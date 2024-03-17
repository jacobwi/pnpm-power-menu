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
    const contextPath = "/some/path";

    // Assuming TerminalManager is imported and available here
    TerminalManager.openTerminal(
      { displayName: terminalName, text: command } as CommandConfig,
      contextPath,
      true
    );

    // Verify `createTerminal` was called with the correct name
    sinon.assert.calledOnceWithExactly(
      createTerminalStub,
      sinon.match({ name: terminalName, cwd: contextPath })
    );

    // Since `sendText` is a method on the object returned by `createTerminal`, you'd assert it like this:
    const terminalInstance = createTerminalStub.returnValues[0]; // Get the first terminal instance created by the stub
    sinon.assert.calledWith(terminalInstance.sendText, "clear"); // Or "cls" on Windows
    sinon.assert.calledWith(terminalInstance.sendText, command);
  });
  // it("should reuse an existing terminal if one already exists with the same name", () => {
  //   const commandConfig1: CommandConfig = {
  //     displayName: "testTerminal",
  //     text: "echo First Command",
  //     enabled: true,
  //     id: "test",
  //   };
  //   const commandConfig2: CommandConfig = {
  //     displayName: "testTerminal",
  //     text: "echo Second Command",
  //     enabled: true,
  //     id: "test",
  //   };
  //   const shellPath = "/bin/bash";

  //   TerminalManager.openTerminal(commandConfig1, shellPath, true);
  //   // After the first command, retrieve the stub for sendText from the first terminal created
  //   const firstTerminalSendTextStub =
  //     createTerminalStub.getCall(0).returnValue.sendText;

  //   // Debugging output after the first command
  //   console.log("After first command:");
  //   console.log("createTerminalStub call count:", createTerminalStub.callCount);
  //   console.log(
  //     "firstTerminalSendTextStub call count:",
  //     firstTerminalSendTextStub.callCount
  //   );

  //   TerminalManager.openTerminal(commandConfig2, shellPath, true);
  //   // Debugging output after the second command
  //   console.log("After second command:");
  //   console.log("createTerminalStub call count:", createTerminalStub.callCount);
  //   console.log(
  //     "firstTerminalSendTextStub call count:",
  //     firstTerminalSendTextStub.callCount
  //   );

  //   // Now, the same terminal (first one) should have been reused, so its sendText stub should have been called again
  //   expect(createTerminalStub.calledOnce).to.be.true; // Verify that the terminal was created only once
  //   expect(firstTerminalSendTextStub.calledTwice).to.be.true; // Verify that sendText was called twice on the same terminal
  //   expect(
  //     firstTerminalSendTextStub.secondCall.calledWithExactly(
  //       commandConfig2.text,
  //       true
  //     )
  //   ).to.be.true; // Verify the second call was with the second command
  // });
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
      id: "test",
    };
    const shellPath = "/bin/bash";

    TerminalManager.openTerminal(commandConfig1, shellPath, true);
    // After the first command, retrieve the stub for sendText from the first terminal created
    const firstTerminalSendTextStub =
      createTerminalStub.getCall(0).returnValue.sendText;

    TerminalManager.openTerminal(commandConfig2, shellPath, true);
    // Now, the same terminal (first one) should have been reused, so its sendText stub should have been called again

    expect(createTerminalStub.calledOnce).to.be.true; // Verify that the terminal was created only once
    expect(firstTerminalSendTextStub.callCount).to.equal(4); // Clear command + actual command, twice

    // Assuming the clear command is the first call each time, the actual commands should be the second and fourth calls
    expect(
      firstTerminalSendTextStub
        .getCall(1)
        .calledWithExactly(commandConfig1.text, true)
    ).to.be.true; // First command
    expect(
      firstTerminalSendTextStub
        .getCall(3)
        .calledWithExactly(commandConfig2.text, true)
    ).to.be.true; // Second command
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
});
