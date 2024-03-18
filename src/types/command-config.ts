// Represents the configuration for a single command
/**
 * Represents the configuration for a command.
 */
export interface CommandConfig {
  /**
   * The unique identifier for the command.
   */
  id: string;

  /**
   * Specifies whether the command is enabled or disabled.
   */
  enabled: boolean;

  /**
   * The text representation of the command.
   */
  command: string;

  /**
   * The display name of the command.
   */
  displayName: string;

  /**
   * Specifies whether the command is a built-in command.
   */
  isBuiltIn?: boolean;

  /**
   * An array of arguments to be passed to the command.
   */
  args?: string[];
}

// Represents the structure of the commands.yaml file
export interface CommandsConfig {
  commands: CommandConfig[];
}
