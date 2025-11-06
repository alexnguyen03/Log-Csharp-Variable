import * as vscode from "vscode";
const commentAllAction = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const doc = editor.document;
    const text = doc.getText();
    const fullRange = new vscode.Range(
        doc.positionAt(0),
        doc.positionAt(text.length)
    );

    const logPattern = /^(\s*)(\/\/\s*)?(System\.Console\.WriteLine.*)$/gm;

    const toggled = text.replace(logPattern, (match, indent, comment, logLine) => {
        if (comment) {
            return `${indent}${logLine}`;
        } else {
            return `${indent}// ${logLine}`;
        }
    });

    await editor.edit(editBuilder => {
        editBuilder.replace(fullRange, toggled);
    });

    const config = vscode.workspace.getConfiguration("csharpLogger");
    if (config.get<boolean>("autoFormat") ?? true) {
        void vscode.commands.executeCommand("editor.action.formatDocument");
    }
}
const commentCommandName = "extension.toggleGeneratedLog";
export { commentAllAction, commentCommandName };