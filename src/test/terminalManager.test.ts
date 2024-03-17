import * as vscode from "vscode";
import { TerminalManager } from "../utils/terminalManager"; // Adjust the path to your TerminalManager file
import * as sinon from "sinon";
import { config } from "chai";
import { CommandConfig } from "../types/command-config";

describe("TerminalManager", () => {
  let sandbox: sinon.SinonSandbox;
  let createTerminalStub: sinon.SinonStub;
  let showStub: sinon.SinonStub;
  let sendTextStub: sinon.SinonStub;
  let disposeStub: sinon.SinonStub;
  let expect: any;

  // Use a `before` hook to dynamically import 'chai'
  before(async () => {
    const chai = await import("chai");
    expect = chai.expect;
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Create stubs for vscode API methods used by TerminalManager
    showStub = sandbox.stub();
    sendTextStub = sandbox.stub();
    disposeStub = sandbox.stub();
    createTerminalStub = sandbox.stub(vscode.window, "createTerminal").returns({
      show: showStub,
      sendText: sendTextStub,
      dispose: disposeStub,
    } as any); // Cast to 'any' to satisfy the stub contract

    // Clear TerminalManager's terminal map before each test
    (TerminalManager as any).terminals.clear();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create a new terminal if it does not exist", () => {
    const terminalName = "testTerminal";
    const command = "echo Hello World";
    const shellPath = "/bin/bash";

    TerminalManager.openTerminal(
      { displayName: terminalName, text: command } as CommandConfig,
      shellPath,
      true
    );

    expect(createTerminalStub.calledOnceWithExactly(terminalName)).to.be.true;
    expect(sendTextStub.calledOnceWithExactly(command, true)).to.be.true;
  });

  it("should reuse an existing terminal if one already exists with the same name", () => {
    const commandConfig1: CommandConfig = {
      displayName: "testTerminal",
      text: "echo First Command",
      enabled: true,
      id: "test",
    };
    const commandConfig2: CommandConfig = {
      displayName: "testTerminal",
      text: "echo Second Command",
      enabled: true,
      id: "test1",
    };
    const shellPath = "/bin/bash";

    TerminalManager.openTerminal(commandConfig1, shellPath, true);
    TerminalManager.openTerminal(commandConfig2, shellPath, true);

    expect(createTerminalStub.calledOnce).to.be.true; // Terminal created only once
    expect(sendTextStub.secondCall.calledWithExactly(commandConfig2.text, true))
      .to.be.true;
  });

  it("should clear the terminal before executing a command when clearBeforeExecute is true", () => {
    const commandConfig: CommandConfig = {
      displayName: "testTerminal",
      text: "echo Clear Me",
      id: "test",
      enabled: true,
    };
    const shellPath = "/bin/bash";

    TerminalManager.openTerminal(commandConfig, shellPath, true);

    // Logging the arguments of the stub calls for debugging
    // Debugging: Log the arguments of the stub calls
    if (sendTextStub.getCall(0)) {
      console.log("First call args:", sendTextStub.getCall(0).args[0]);
    } else {
      console.log("sendTextStub was not called the first time");
    }

    if (sendTextStub.getCall(1)) {
      console.log("Second call args:", sendTextStub.getCall(1).args[0]);
    } else {
      console.log("sendTextStub was not called the second time");
    }
    // Your existing assertions
    expect(
      sendTextStub.firstCall.calledWith(
        sinon.match(process.platform === "win32" ? "cls" : "clear")
      )
    ).to.be.true;
    expect(sendTextStub.secondCall.calledWithExactly(commandConfig.text, true))
      .to.be.true;
  });

  // More tests...
});
