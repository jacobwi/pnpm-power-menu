import * as vscode from "vscode";
import { registerCommandsFromYAML } from "./commands/commandRegister";

export function activate(context: vscode.ExtensionContext) {
  registerCommandsFromYAML(context)
    .then(() => {
      console.log("Commands registered successfully.");
    })
    .catch((error) => {
      console.error("Failed to register commands:", error);
    });
}

export function deactivate() {}
