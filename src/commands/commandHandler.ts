import * as vscode from 'vscode';
import { CommandConfig } from '../types/command-config';
import { TerminalManager } from '../utils/terminalManager';
export function handleCommandExecution(commandConfig: CommandConfig, context: vscode.ExtensionContext) {
    if (commandConfig.isBuiltIn) {
        // Process and execute built-in VS Code command with dynamic arguments
        const processedArgs = commandConfig.args ? processArgs(commandConfig.args, context) : [];
        vscode.commands.executeCommand(commandConfig.text, ...processedArgs);
    } else {
        // Execute custom command in a terminal, with an option to clear the terminal before execution
        const clearBeforeExecute = true;
        TerminalManager.openTerminal(commandConfig.displayName, commandConfig.text, clearBeforeExecute);
    }
}

function processArgs(args: string[], context: vscode.ExtensionContext): any[] {
    return args.map(arg => replacePlaceholders(arg, context));
}

function replacePlaceholders(arg: string, context: any): string {
    return arg.replace(/\$\{([^}]+)\}/g, (match, path) => {
        try {
            const pathParts = path.split('.');
            let currentValue = context;
            
            for (const part of pathParts) {
                // one line conditional continue statement
                if (part === 'context') {continue;} 
                
                if (currentValue[part] === undefined) {
                    throw new Error(`Property '${part}' not found.`);
                }
                currentValue = currentValue[part];
            }

            return currentValue;
        } catch (error) {
            console.warn(`Could not replace placeholder '${match}': ${error}`);
            return match; // Return the original placeholder if there's an issue resolving it
        }
    });
}