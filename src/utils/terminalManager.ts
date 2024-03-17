import * as vscode from "vscode";
import { CommandConfig } from "../types/command-config";

/**
 * Manages the creation and disposal of terminals in VS Code.
 */
export class TerminalManager {
  private static terminals = new Map<string, vscode.Terminal>();

  /**
   * Opens a terminal with the specified configuration.
   * @param config - The command configuration for the terminal.
   * @param contextPath - The path of the context in which the terminal is opened.
   * @param clearBeforeExecute - Whether to clear the terminal before executing the command. Default is false.
   */
  static openTerminal(
    config: CommandConfig,
    contextPath: string,
    clearBeforeExecute: boolean = false
  ) {
    let terminal = this.terminals.get(config.displayName);
    // Terminal options including the contextPath as the cwd (current working directory)
    const terminalOptions: vscode.TerminalOptions = {
      name: config.displayName,
      cwd: contextPath,
    };
    if (!terminal) {
      terminal = vscode.window.createTerminal(terminalOptions);
      this.terminals.set(config.displayName, terminal);
    }
    terminal.show();

    if (clearBeforeExecute) {
      const clearCommand = process.platform === "win32" ? "cls" : "clear";
      terminal.sendText(clearCommand, true);
    }

    terminal.sendText(config.text, true);
  }

  /**
   * Disposes the terminal with the specified name.
   * @param name - The name of the terminal to dispose.
   */
  static disposeTerminal(name: string): void {
    const terminal = this.terminals.get(name);
    if (terminal) {
      terminal.dispose();
      this.terminals.delete(name);
    }
  }

  private static clearTerminal(terminal: vscode.Terminal): void {
    // Use the 'clear' command for Unix-based systems or 'cls' for Windows
    const isWindows = process.platform === "win32";
    terminal.sendText(isWindows ? "cls" : "clear", true);
    // Focus back on the terminal after clearing
    terminal.show();
  }
}
