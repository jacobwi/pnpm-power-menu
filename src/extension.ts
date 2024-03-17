import * as vscode from 'vscode';
import { registerCommandsFromYAML } from './commands/commandRegister';

export function activate(context: vscode.ExtensionContext) {
    registerCommandsFromYAML(context);
}

export function deactivate() {}