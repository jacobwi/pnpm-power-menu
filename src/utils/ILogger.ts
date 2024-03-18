import { LogLevel } from './LogLevel';

/**
 * Represents a logger interface for logging messages with different log levels.
 */
export interface ILogger {
  /**
   * Sets the log level for the logger.
   * @param level - The log level to set.
   */
  setLevel(level: LogLevel): void;

  /**
   * Logs a debug message.
   * @param message - The debug message to log.
   * @param optionalParams - Optional parameters to include in the log message.
   */
  debug(message: string, ...optionalParams: unknown[]): void;

  /**
   * Logs an info message.
   * @param message - The info message to log.
   * @param optionalParams - Optional parameters to include in the log message.
   */
  info(message: string, ...optionalParams: unknown[]): void;

  /**
   * Logs a warning message.
   * @param message - The warning message to log.
   * @param optionalParams - Optional parameters to include in the log message.
   */
  warn(message: string, ...optionalParams: unknown[]): void;

  /**
   * Logs an error message.
   * @param message - The error message to log.
   * @param optionalParams - Optional parameters to include in the log message.
   */
  error(message: string, ...optionalParams: unknown[]): void;
}
