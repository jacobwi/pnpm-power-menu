import { defineConfig } from "@vscode/test-cli";

export default defineConfig({
  label: "main",
  files: "out/test/**/*.test.js", // Pattern to match test files
  version: "insiders", // Use VS Code Insiders for running tests
  mocha: {
    ui: "bdd", // Behavior-Driven Development style interface
    timeout: 20000, // Set test timeout to 20 seconds
  },
});
