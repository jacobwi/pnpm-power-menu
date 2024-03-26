import * as vscode from "vscode";
import * as yaml from "js-yaml";
import * as fs from "fs";

import * as path from "path";
import { ICommandConfig } from "../interfaces/ICommandConfig";
import { logger } from "../utils/logger";

export async function loadCommandConfig(
  commandId: string
): Promise<ICommandConfig | undefined> {
  const yamlPath = path.join(__dirname, "..", "assets", "commands.yaml");

  const fileContents = await fs.promises.readFile(yamlPath, "utf8");
  const config = yaml.load(fileContents) as { commands: ICommandConfig[] };
  return config.commands.find((command) => command.id === commandId);
}

export async function initialLoadCommandsConfig(): Promise<ICommandConfig[]> {
  const yamlPath = path.join(__dirname, "..", "assets", "commands.yaml");
  try {
    const fileContents = await fs.promises.readFile(yamlPath, "utf8");
    const config = yaml.load(fileContents) as { commands: ICommandConfig[] };
    logger.info("Commands configuration loaded successfully.");
    return config.commands;
  } catch (error) {
    logger.error(`Error loading commands configuration: ${error}`);
    return [];
  }
}

export async function registerCommand(
  context: vscode.ExtensionContext,
  commandId: string
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
            `No folder context found for ${commandConfig.displayName}`
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
          `[registerCommand] Custom command executed: ${commandConfig.displayName}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}
export function registerDynamicCommands(
  context: vscode.ExtensionContext,
  commands: ICommandConfig[]
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
  commandConfig: ICommandConfig,
  context: vscode.ExtensionContext
) {
  if (commandConfig.args) {
    const processedArgs = commandConfig.args.map((arg) =>
      replacePlaceholders(arg, context)
    );
    try {
      const result = await vscode.commands.executeCommand(
        commandConfig.command,
        ...processedArgs
      );
      logger.info(
        `Built-in command executed: ${commandConfig.command}`,
        result
      );
    } catch (error) {
      logger.error(
        `Error executing built-in command ${commandConfig.command}:`,
        error
      );
    }
  } else {
    // Execute the command without arguments
    await vscode.commands.executeCommand(commandConfig.command);
  }
}
export function replacePlaceholders(
  arg: string,
  context: vscode.ExtensionContext
): string {
  let replacedString: string;
  return arg.replace(/@ext:\$\{([^}]+)\}/g, (_, variableName) => {
    switch (variableName) {
      case "context.extension.id":
        return arg.replace("${" + variableName + "}", context.extension.id);

      case variableName.startsWith("exec.shell"):
        logger.warn("exec.shell is not supported yet");
        return _;
      default:
        logger.warn(`Unknown variable: ${variableName}`);
        return _; // Return the original placeholder if the variable is unknown
    }
  });
}
