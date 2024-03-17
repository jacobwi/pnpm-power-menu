import * as vscode from "vscode";
import * as yaml from "js-yaml";
import * as fs from "fs/promises"; // Use the promise-based version of fs
import * as path from "path";
import { handleCommandExecution } from "./commandHandler";
import { CommandConfig, CommandsConfig } from "../types/command-config"; // Assuming CommandsConfig is an interface representing the structure of your YAML file

let cachedCommandsConfig: CommandConfig[] | null = null;
const expectedCommandIds = [
    "pnpm-power-menu.init",
    "pnpm-power-menu.install",
    "pnpm-power-menu.update",
    "pnpm-power-menu.test",
    "pnpm-power-menu.openExtSettings"
];
export async function registerCommandsFromYAML(
  context: vscode.ExtensionContext
) {
  const config = vscode.workspace.getConfiguration(context.extension.id);
  const lazyLoadEnabled = config.get<boolean>("lazyLoad", false);

  if (lazyLoadEnabled) {
    expectedCommandIds.forEach((commandId) => {
      const lazyRegistration = vscode.commands.registerCommand(
        commandId,
        async () => {
          // Dispose the lightweight command registration
          lazyRegistration.dispose();
          const commands = await loadOrGetCommandsConfig();
          const commandConfig = commands.find((c) => c.id === commandId);

          if (commandConfig) {
            // Perform the actual command registration now that it's needed
            const disposable = vscode.commands.registerCommand(commandId, () =>
              handleCommandExecution(commandConfig, context)
            );
            context.subscriptions.push(disposable);
            // Immediately invoke the command handler after registration
            handleCommandExecution(commandConfig, context);
          }
        }
      );
      context.subscriptions.push(lazyRegistration);
    });
  } else {
    const commands = await loadOrGetCommandsConfig();
    commands.forEach((command: CommandConfig) => {
      const disposable = vscode.commands.registerCommand(command.id, () =>
        handleCommandExecution(command, context)
      );
      context.subscriptions.push(disposable);
    });
  }
}

async function loadOrGetCommandsConfig(): Promise<CommandConfig[]> {
  if (!cachedCommandsConfig) {
    const yamlPath = path.join(__dirname, "..", "commands.yaml");
    try {
      const fileContents = await fs.readFile(yamlPath, "utf8");
      const config = yaml.load(fileContents) as CommandsConfig; // Use the specific type
      cachedCommandsConfig = config.commands;
    } catch (error) {
      console.error(`Error loading command configurations: ${error}`);
      cachedCommandsConfig = []; // Avoid subsequent load attempts
    }
  }
  return cachedCommandsConfig;
}
