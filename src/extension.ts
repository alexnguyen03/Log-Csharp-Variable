import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.LogC#Variable', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);
            const fileName = editor.document.fileName;
            const surroundingFunction = getSurroundingFunction(editor.document, selection.start);
            const surroundingClass = getSurroundingClass(editor.document, selection.start);

            const nextLinePosition = isVariableDeclaration(editor.document, selection.start)
                ? getEndOfDeclarationPosition(editor.document, selection.start)
                : getNextLinePosition(editor.document, selection.start);

            const lineToInsert = `Console.WriteLine("Line: ${nextLinePosition.line + 1}, Class: ${surroundingClass}, Method: ${surroundingFunction}.❇️ ${selectedText} = " + ${selectedText});\n`;

            editor.edit((editBuilder) => {
                editBuilder.insert(nextLinePosition, lineToInsert);
            });

            vscode.commands.executeCommand('editor.action.formatDocument');
            vscode.window.showInformationMessage('Inserted Console.WriteLine after selected line!');
        }
    });
    context.subscriptions.push(disposable);
}

function getSurroundingFunction(document: vscode.TextDocument, position: vscode.Position): string | undefined {
    for (let i = position.line; i >= 0; i--) {
        const line = document.lineAt(i).text.trim();
        const functionRegex = /(public|private|protected|static|async)?\s*(Task<\w+>|Task|void|int|string|bool|double|var|\w+)\s+([\w]+)\s*\(.*\)/;
        const match = line.match(functionRegex);
        if (match) {
            return match[3];
        }
    }
    return undefined;
}

function getSurroundingClass(document: vscode.TextDocument, position: vscode.Position): string | undefined {
    for (let i = position.line; i >= 0; i--) {
        const line = document.lineAt(i).text;
        const classRegex = /class\s+([a-zA-Z_][a-zA-Z0-9_]*)/;
        const match = line.match(classRegex);
        if (match) {
            return match[1];
        }
    }
    return undefined;
}

function isVariableDeclaration(document: vscode.TextDocument, position: vscode.Position): boolean {
    const line = document.lineAt(position.line).text.trim();
    const varRegex = /^(var|int|string|bool|double|float|object|List<\w+>|Dictionary<.*?>|\w+)\s+\w+\s*(=|;)/;
    return varRegex.test(line);
}

function getEndOfDeclarationPosition(document: vscode.TextDocument, position: vscode.Position): vscode.Position {
    let lineIndex = position.line;
    while (lineIndex < document.lineCount) {
        const lineText = document.lineAt(lineIndex).text;
        if (lineText.includes(";")) {
            return new vscode.Position(lineIndex + 1, 0);
        }
        lineIndex++;
    }
    return new vscode.Position(position.line + 1, 0);
}

function getNextLinePosition(document: vscode.TextDocument, position: vscode.Position): vscode.Position {
    return new vscode.Position(position.line + 1, 0);
}
