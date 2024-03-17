import { defineConfig } from "@vscode/test-cli";

/**
 * Configuration object for running tests in VS Code.
 *
 * @typedef {Object} TestConfig
 * @property {string} label - The label for the configuration.
 * @property {string} files - The pattern to match test files.
 * @property {string} version - The version of VS Code to use for running tests.
 * @property {Object} mocha - The configuration options for Mocha test runner.
 * @property {string} mocha.ui - The interface style for Mocha (e.g., "bdd").
 * @property {number} mocha.timeout - The timeout for each test in milliseconds.
 */

export default defineConfig({
  /**
   * The label for the configuration.
   *
   * @type {string}
   */
  label: "main",

  /**
   * The pattern to match test files.
   *
   * @type {string}
   */
  files: "out/test/**/*.test.js",

  /**
   * The version of VS Code to use for running tests.
   *
   * @type {string}
   */
  version: "insiders",

  /**
   * The configuration options for Mocha test runner.
   *
   * @type {Object}
   */
  mocha: {
    /**
     * The interface style for Mocha (e.g., "bdd").
     *
     * @type {string}
     */
    ui: "bdd", // Behavior Driven Development

    /**
     * The timeout for each test in milliseconds.
     *
     * @type {number}
     */
    timeout: 20000,
  },
});
