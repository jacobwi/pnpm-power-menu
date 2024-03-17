import * as vscode from "vscode";
import * as yaml from "js-yaml";
import * as fs from "fs/promises";
import * as path from "path";
import { handleCommandExecution } from "./commandHandler";
import { CommandConfig, CommandsConfig } from "../types/command-config";

let cachedCommandsConfig: CommandConfig[] | null = null;

const expectedCommandIds = [
  "pnpm-power-menu.init",
  "pnpm-power-menu.install",
  "pnpm-power-menu.update",
  "pnpm-power-menu.test",
  "pnpm-power-menu.openExtSettings",
];

/**
 * Registers commands from a YAML configuration file.
 * @param context - The extension context.
 */
export async function registerCommandsFromYAML(
  context: vscode.ExtensionContext
) {
  const config = vscode.workspace.getConfiguration(context.extension.id);
  const lazyLoadEnabled = config.get<boolean>("lazyLoad", false);
  console.log(`Lazy load setting: ${lazyLoadEnabled ? "enabled" : "disabled"}`);

  const commands = await loadOrGetCommandsConfig();
  commands
    .filter((commandConfig) => expectedCommandIds.includes(commandConfig.id))
    .forEach((commandConfig) => {
      let isFirstTime = true;
      const commandRegistration = vscode.commands.registerCommand(
        commandConfig.id,
        async (uri) => {
          console.log(
            `Command triggered: ${commandConfig.id}, isFirstTime: ${isFirstTime}`
          );

          if (lazyLoadEnabled && isFirstTime) {
            console.log(
              `Disposing initial registration for ${commandConfig.id}`
            );
            commandRegistration.dispose();
            isFirstTime = false;
            console.log(
              `Disposed initial registration for ${commandConfig.id}`
            );
          }

          console.log(`Executing command: ${commandConfig.id}`);
          handleCommandExecution(commandConfig, context, uri);

          if (lazyLoadEnabled && !isFirstTime) {
            console.log(
              `Re-adding command to context subscriptions: ${commandConfig.id}`
            );
            context.subscriptions.push(commandRegistration);
          }
        }
      );

      if (!lazyLoadEnabled) {
        console.log(
          `Adding command to context subscriptions immediately: ${commandConfig.id}`
        );
        context.subscriptions.push(commandRegistration);
      }
    });
}

async function loadOrGetCommandsConfig(): Promise<CommandConfig[]> {
  if (cachedCommandsConfig === null) {
    const yamlPath = path.join(__dirname, "commands.yaml");
    try {
      const fileContents = await fs.readFile(yamlPath, "utf8");
      const config = yaml.load(fileContents) as CommandsConfig;
      cachedCommandsConfig = config.commands;
      console.log("Commands configuration loaded successfully.");
    } catch (error) {
      console.error(`Error loading command configurations: ${error}`);
      cachedCommandsConfig = [];
    }
  } else {
    console.log("Using cached commands configuration.");
  }
  return cachedCommandsConfig;
}
