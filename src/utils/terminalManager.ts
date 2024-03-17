import * as vscode from "vscode";

export class TerminalManager {
  private static terminals = new Map<string, vscode.Terminal>();

  static openTerminal(
    name: string,
    command: string,
    clearBeforeExecute: boolean = false
  ) {
    let terminal = this.terminals.get(name);
    if (!terminal) {
      terminal = vscode.window.createTerminal(name);
      this.terminals.set(name, terminal);
    }
    terminal.show();

    if (clearBeforeExecute) {
      const clearCommand = process.platform === "win32" ? "cls" : "clear";
      terminal.sendText(clearCommand, true);
    }

    terminal.sendText(command, true);
  }
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
