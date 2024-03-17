import * as vscode from "vscode";
import { CommandConfig } from "../types/command-config";
import { TerminalManager } from "../utils/terminalManager";

export function handleCommandExecution(
  commandConfig: CommandConfig,
  context: vscode.ExtensionContext,
  uri?: vscode.Uri
) {
  // Log that a command is about to be executed
  console.log(`Executing command: ${commandConfig.id}`);

  // Check and log the URI if it's provided, which is crucial for non-built-in commands
  if (uri) {
    console.log(`URI received: ${uri.toString()}`);
  } else {
    console.log(`No URI received for command: ${commandConfig.id}`);
  }

  // Your existing logic for handling built-in vs custom commands
  if (commandConfig.isBuiltIn) {
    // Existing logic for built-in commands...
  } else {
    // Check for the custom command execution
    if (!uri) {
      console.warn(
        `URI not provided for non-built-in command ${commandConfig.id}`
      );
      return;
    }

    // Before executing a custom command, log the action
    console.log(
      `Executing custom command in terminal: ${commandConfig.id}, with URI: ${uri}`
    );

    // Your existing logic for executing custom commands in a terminal
    const clearBeforeExecute = true; // or determined by your logic
    const contextPath = uri.fsPath;
    TerminalManager.openTerminal(
      commandConfig,
      contextPath,
      clearBeforeExecute
    );
  }
}

function processArgs(args: string[], context: vscode.ExtensionContext): any[] {
  return args.map((arg) => replacePlaceholders(arg, context));
}

function replacePlaceholders(
  arg: string,
  context: vscode.ExtensionContext
): string {
  return arg.replace(/\$\{([^}]+)\}/g, (match, path) => {
    try {
      const pathParts = path.split(".");
      let currentValue: any = context;
      for (const part of pathParts) {
        if (part === "context") {
          continue; // Skip the 'context' part, it's just a placeholder in this path
        }
        if (currentValue[part] === undefined) {
          throw new Error(`Property '${part}' not found in context.`);
        }
        currentValue = currentValue[part];
      }
      console.log(`Placeholder ${match} replaced with ${currentValue}`);
      return currentValue;
    } catch (error) {
      console.error(`Error replacing placeholder '${match}':`, error);
      return match; // Return the original placeholder if there's an error
    }
  });
}
