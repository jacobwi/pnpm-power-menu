import { ICommandConfig } from "./../interfaces/ICommandConfig";
import * as vscode from "vscode";
import * as sinon from "sinon";
import {
  loadCommandConfig,
  registerCommand,
  executeBuiltInCommand,
  replacePlaceholders,
} from "../commands/commandsHandler";

describe("Command Handlers", () => {
  let originalNodeEnv: string | undefined;
  let sandbox: sinon.SinonSandbox;
  let createTerminalStub: sinon.SinonStub;
  let showStub: sinon.SinonStub;
  let sendTextStub: sinon.SinonStub;
  let disposeStub: sinon.SinonStub;
  let expect: any;
  before(async function () {
    // Save the original NODE_ENV value
    originalNodeEnv = process.env.NODE_ENV;
    // Set NODE_ENV to 'test' for the tests
    process.env.NODE_ENV = "test";
    const chai = await import("chai");
    expect = chai.expect;
  });
  beforeEach(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(vscode.commands, "registerCommand");
    sandbox.stub(vscode.commands, "executeCommand");
    sandbox.stub(vscode.window, "showWarningMessage");
    createTerminalStub = sandbox.stub(vscode.window, "createTerminal").returns({
      show: showStub,
      sendText: sendTextStub,
      dispose: disposeStub,
    } as any); // Cast to 'any' to satisfy the stub contract
  });

  afterEach(() => {
    sandbox.restore();
  });
  after(function () {
    // Revert NODE_ENV to its original value after tests
    process.env.NODE_ENV = originalNodeEnv;
  });
  describe("loadCommandConfig", () => {
    it("should load command configuration correctly", async () => {
      // Mock file reading and yaml parsing to return a specific command config
      const commandId = "pnpm-power-menu.openExtSettings";
      const expectedConfig: ICommandConfig = {
        id: commandId,
        enabled: true,
        command: "workbench.action.openSettings",
        displayName: "Open Extension Settings",
        isBuiltIn: true,
        args: ["@ext:${context.extension.id}"],
      };

      const config = await loadCommandConfig(commandId);
      expect(config).to.deep.equal(expectedConfig);
    });
  });

  describe("registerCommand", () => {
    it("should register a command with VS Code", async () => {
      const commandId = "sampleCommand";
      const uri = vscode.Uri.parse("file:///path/to/folder");

      // Call your registerCommand function with a mocked context and command ID
      await registerCommand(
        { subscriptions: [] } as unknown as vscode.ExtensionContext,
        commandId
      );

      // Assert that VS Code's registerCommand was called with the correct command ID
      sinon.assert.calledWith(
        vscode.commands.registerCommand as sinon.SinonStub,
        commandId,
        sinon.match.func
      );
    });
  });

  describe("executeBuiltInCommand", () => {
    it("should execute a built-in command with the correct arguments", async () => {
      const commandConfig: ICommandConfig = {
        id: "pnpm-power-menu.openExtSettings",
        enabled: true,
        command: "workbench.action.openSettings",
        displayName: "Open Extension Settings",
        isBuiltIn: true,
        args: ["@ext:${context.extension.id}"],
      };

      // Create a mock context with an extension.id
      const mockContext: Partial<vscode.ExtensionContext> = {
        extension: {
          id: "moka.pnpm-power-menu",
          extensionUri: vscode.Uri.parse(""),
          extensionPath: "",
          isActive: false,
          packageJSON: {},
          extensionKind: vscode.ExtensionKind.UI,
          exports: {},
          activate: () => Promise.resolve(),
        },
      };

      // Execute the built-in command using your `executeBuiltInCommand` function with the stubbed `replacePlaceholders`
      await executeBuiltInCommand(
        commandConfig,
        mockContext as vscode.ExtensionContext
      );

      // Assert that the VS Code's executeCommand API was called with the correct arguments
      sinon.assert.calledWith(
        vscode.commands.executeCommand as sinon.SinonStub,
        commandConfig.command,
        "pnpm-power-menu" // This should match the replaced value
      );
    });
  });

  describe("replacePlaceholders", () => {
    it("should replace placeholders correctly", () => {
      const context = {
        extension: { id: "context.extension.id" },
      } as vscode.ExtensionContext;
      const arg = "@ext:${context.extension.id}";

      const result = replacePlaceholders(arg, context);

      expect(result).to.equal("context.extension.id");
    });
  });
});
