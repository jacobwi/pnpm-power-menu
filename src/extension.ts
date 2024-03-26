import * as vscode from "vscode";
import {
  initialLoadCommandsConfig,
  registerDynamicCommands,
} from "./commands/commandsHandler";
import { logger, getCurrentLogLevel } from "./utils/logger";
/**
 * Activates the extension.
 *
 * @param context The extension context.
 */
export async function activate(context: vscode.ExtensionContext) {
  logger.info("Extension activated");
  logger.info(`Current log level: ${getCurrentLogLevel()}`);
  const loadedCommands = await initialLoadCommandsConfig();

  registerDynamicCommands(context, loadedCommands);
}

export function deactivate() {
  logger.info("Extension deactivated");
}
