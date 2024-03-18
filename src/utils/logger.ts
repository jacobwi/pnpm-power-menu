import * as vscode from 'vscode';
import { LogLevel } from './LogLevel';
import { ILogger } from './ILogger';

/**
 * Represents a logger that provides logging functionality with different log levels.
 */
class Logger implements ILogger {
  private static instance: Logger;
  private logLevel: LogLevel = LogLevel.Debug;

  /**
   * Private constructor to enforce singleton pattern.
   * Initializes the logger and sets up the event listener for configuration changes.
   */
  private constructor() {
    this.updateLogLevelFromConfiguration();
    vscode.workspace.onDidChangeConfiguration(
      this.updateLogLevelFromConfiguration,
      this,
    );
  }

  /**
   * Returns the singleton instance of the Logger class.
   * @returns The Logger instance.
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Updates the log level based on the configuration settings.
   * This method is called when the configuration changes.
   */
  private updateLogLevelFromConfiguration(): void {
    const config = vscode.workspace.getConfiguration();
    const level = config.get<LogLevel>(
      'yourExtension.logLevel',
      LogLevel.Debug,
    );
    this.setLevel(level);
  }

  /**
   * Sets the log level.
   * @param level - The log level to set.
   */
  public setLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Checks if a log message with the specified level should be logged based on the current log level.
   * @param messageLevel - The level of the log message.
   * @returns True if the log message should be logged, false otherwise.
   */
  private shouldLog(messageLevel: LogLevel): boolean {
    const orderedLevels = [
      LogLevel.Debug,
      LogLevel.Info,
      LogLevel.Warn,
      LogLevel.Error,
    ];
    return (
      orderedLevels.indexOf(messageLevel) >=
      orderedLevels.indexOf(this.logLevel)
    );
  }

  /**
   * Logs a message with the specified level.
   * @param messageLevel - The level of the log message.
   * @param message - The log message.
   * @param optionalParams - Optional parameters to include in the log message.
   */
  private log(
    messageLevel: LogLevel,
    message: string,
    ...optionalParams: unknown[]
  ): void {
    if (this.shouldLog(messageLevel)) {
      // Map LogLevel to console methods
      const logFunctionMap = {
        [LogLevel.Debug]: console.debug,
        [LogLevel.Info]: console.info,
        [LogLevel.Warn]: console.warn,
        [LogLevel.Error]: console.error,
      };

      const logFunction = logFunctionMap[messageLevel];
      logFunction(`[${messageLevel}] ${message}`, ...optionalParams);
    }
  }

  /**
   * Logs a debug message.
   * @param message - The debug message.
   * @param optionalParams - Optional parameters to include in the log message.
   */
  public debug(message: string, ...optionalParams: unknown[]): void {
    this.log(LogLevel.Debug, message, ...optionalParams);
  }

  /**
   * Logs an info message.
   * @param message - The info message.
   * @param optionalParams - Optional parameters to include in the log message.
   */
  public info(message: string, ...optionalParams: unknown[]): void {
    this.log(LogLevel.Info, message, ...optionalParams);
  }

  /**
   * Logs a warning message.
   * @param message - The warning message.
   * @param optionalParams - Optional parameters to include in the log message.
   */
  public warn(message: string, ...optionalParams: unknown[]): void {
    this.log(LogLevel.Warn, message, ...optionalParams);
  }

  /**
   * Logs an error message.
   * @param message - The error message.
   * @param optionalParams - Optional parameters to include in the log message.
   */
  public error(message: string, ...optionalParams: unknown[]): void {
    this.log(LogLevel.Error, message, ...optionalParams);
  }
}

export function getCurrentLogLevel(): string {
  const config = vscode.workspace.getConfiguration('pnpm-power-menu');
  const logLevel = config.get<string>('logLevel', 'Info'); // 'Info' is the default
  return logLevel;
}
export const logger = Logger.getInstance();
