import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { CommandConfig } from '../types/command-config';
import { logger } from '../utils/logger';

export async function loadCommandConfig(
  commandId: string,
): Promise<CommandConfig | undefined> {
  let yamlPath: string;

  if (process.env.NODE_ENV === 'test') {
    yamlPath = path.join(__dirname, 'commands.yaml');
  } else {
    yamlPath = path.join(__dirname, 'commands', 'commands.yaml');
  }

  const fileContents = await fs.promises.readFile(yamlPath, 'utf8');
  const config = yaml.load(fileContents) as { commands: CommandConfig[] };
  return config.commands.find((command) => command.id === commandId);
}

export async function initialLoadCommandsConfig(): Promise<CommandConfig[]> {
  const yamlPath = path.join(__dirname, 'commands', 'commands.yaml');
  try {
    const fileContents = await fs.promises.readFile(yamlPath, 'utf8');
    const config = yaml.load(fileContents) as { commands: CommandConfig[] };
    logger.info('Commands configuration loaded successfully.');
    return config.commands;
  } catch (error) {
    logger.error(`Error loading commands configuration: ${error}`);
    return [];
  }
}

export async function registerCommand(
  context: vscode.ExtensionContext,
  commandId: string,
) {
  const disposable = vscode.commands.registerCommand(
    commandId,
    async (uri: vscode.Uri) => {
      const commandConfig = await loadCommandConfig(commandId);
      if (!commandConfig) {
        logger.error(`Command configuration not found for ${commandId}`);
        return;
      }

      if (commandConfig.isBuiltIn) {
        // Execute built-in command with processed arguments
        await executeBuiltInCommand(commandConfig, context);
      } else {
        // Execute custom command in terminal
        const folderPath = uri
          ? uri.fsPath
          : vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!folderPath) {
          vscode.window.showWarningMessage(
            `No folder context found for ${commandConfig.displayName}`,
          );
          logger.error(`[registerCommand] No folder context found`);
          return;
        }
        logger.debug(`[registerCommand] Context Path: ${folderPath}`);
        const terminal = vscode.window.createTerminal({
          cwd: folderPath,
          name: commandConfig.displayName,
        });
        terminal.show();
        terminal.sendText(commandConfig.command);
        logger.debug(
          `[registerCommand] Custom command executed: ${commandConfig.displayName}`,
        );
      }
    },
  );

  context.subscriptions.push(disposable);
}
export function registerDynamicCommands(
  context: vscode.ExtensionContext,
  commands: CommandConfig[],
) {
  commands.forEach(async (commandConfig) => {
    try {
      await registerCommand(context, commandConfig.id);
    } catch (error) {
      logger.error(`Error registering command [${commandConfig.id}]: ${error}`);
    }
  });
}
export async function executeBuiltInCommand(
  commandConfig: CommandConfig,
  context: vscode.ExtensionContext,
) {
  if (commandConfig.args) {
    const processedArgs = commandConfig.args.map((arg) =>
      replacePlaceholders(arg, context),
    );
    try {
      const result = await vscode.commands.executeCommand(
        commandConfig.command,
        ...processedArgs,
      );
      logger.info(
        `Built-in command executed: ${commandConfig.command}`,
        result,
      );
    } catch (error) {
      logger.error(
        `Error executing built-in command ${commandConfig.command}:`,
        error,
      );
    }
  } else {
    // Execute the command without arguments
    await vscode.commands.executeCommand(commandConfig.command);
  }
}
export function replacePlaceholders(
  arg: string,
  context: vscode.ExtensionContext,
): string {
  return arg.replace(/@ext:\$\{([^}]+)\}/g, (_, variableName) => {
    switch (variableName) {
      case 'context.extension.id':
        return context.extension.id;
      case variableName.startsWith('exec.shell'):
        console.warn('exec.shell is not supported yet');
        return _;
      default:
        console.warn(`Unknown variable: ${variableName}`);
        return _; // Return the original placeholder if the variable is unknown
    }
  });
}
