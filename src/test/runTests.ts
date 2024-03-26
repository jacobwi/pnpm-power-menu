// src/test/runTests.ts

import * as path from "path";
import { runTests } from "@vscode/test-electron";

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");

    // The path to the extension test runner script
    // Passed to `--extensionTestsPath`
    const extensionTestsPath = path.resolve(__dirname, "./index.ts");

    // Download VS Code, unzip it, and run the integration test
    await runTests({
      version: "insiders", // Use VS Code Insiders; change as needed
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [
        // This launches a new instance of VS Code for testing
        // You can add additional launch arguments here if needed
      ],
    });
  } catch (err) {
    console.error(err);
    console.error("Failed to run tests");
    process.exit(1);
  }
}

main();
