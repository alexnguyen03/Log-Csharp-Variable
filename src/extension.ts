import * as vscode from "vscode";
import { logAction, logCommandName } from "./logAction";
import { commentAllAction, commentCommandName } from "./commentAction";
export function activate(context: vscode.ExtensionContext) {
  const logCommand = vscode.commands.registerCommand(logCommandName, async () => await logAction());
  const commentLogsCmd = vscode.commands.registerCommand(commentCommandName, async () => await commentAllAction());
  const openConfig = vscode.commands.registerCommand("extension.openLogCSharpVariableSettings", () =>
    vscode.commands.executeCommand(
      "workbench.action.openSettings",
      "logCSharpVariable"
    )
  );
  context.subscriptions.push(logCommand, commentLogsCmd, openConfig);
}
export function deactivate() { }
