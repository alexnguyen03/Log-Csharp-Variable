import * as vscode from "vscode";

function getSafeInsertLine(
    doc: vscode.TextDocument,
    currentLine: number,
): number {
    const lineText = doc.lineAt(currentLine).text;
    const prevLine = currentLine > 0 ? doc.lineAt(currentLine).text : "";
    const startsWithBrace = /^\s*[\{\}].*$/.test(lineText + 1);
    if (startsWithBrace) {
        return currentLine + 1;
    }
    const isControlBlock = /^\s*(else|catch|finally)\b/.test(lineText);
    if (isControlBlock) {
        return currentLine + 1;
    }
    const prevEndsWithParen = currentLine > 0 && /\)\s*$/.test(prevLine);
    if (prevEndsWithParen) {
        return currentLine + 1;
    }
  
    const isMethodBodyStart = /^\s*$/.test(lineText) && currentLine > 0;
    if (isMethodBodyStart) {
        const methodLine = doc.lineAt(currentLine - 1).text;
        if (/\)\s*$/.test(methodLine) && /\w+\s+\w+\s*\(/.test(methodLine)) {
            return currentLine + 1;
        }
    }
    return currentLine;
}

async function ensureJsonUsing(
    doc: vscode.TextDocument,
    editBuilder: vscode.TextEditorEdit
): Promise<void> {
    const text = doc.getText();
    const usingPattern = /^\s*using\s+System\.Text\.Json\s*;/m;
    if (usingPattern.test(text)) {
        return;
    }
    const lines = text.split('\n');
    let insertLine = 0;
    for (let i = 0; i < lines.length; i++) {
        if (/^\s*using\s+.+?;/.test(lines[i])) {
            insertLine = i + 1;
        } else if (lines[i].trim() !== '') {
            break;
        }
    }
    const insertPos = new vscode.Position(insertLine, 0);
    editBuilder.insert(insertPos, "using System.Text.Json;\n");
}
export { getSafeInsertLine, ensureJsonUsing };