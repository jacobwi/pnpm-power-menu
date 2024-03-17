// Represents the configuration for a single command
export interface CommandConfig {
  id: string;
  enabled: boolean;
  text: string;
  displayName: string;
  isBuiltIn?: boolean;
  args?: any[];
}

// Represents the structure of the commands.yaml file
export interface CommandsConfig {
  commands: CommandConfig[];
}