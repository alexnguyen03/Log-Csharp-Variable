import * as vscode from "vscode";

function getSerializedValue(
    variable: string,
    config: vscode.WorkspaceConfiguration
): string {
    const serialize = config.get<boolean>("serializeObjects") ?? true;
    if (!serialize) {
        return `{${variable}}`;
    }

    const primitiveTypes = new Set([
        "int", "long", "short", "byte",
        "float", "double", "decimal",
        "bool", "char", "string",
        "Int32", "Int64", "Single", "Double", "Boolean", "Char", "String"
    ]);

    const editor = vscode.window.activeTextEditor;
    if (!editor) return `{${variable}}`;

    const line = editor.document.lineAt(editor.selection.start.line).text;
    const typeMatch = line.match(new RegExp(`\\b(\\w+)\\s+${variable}\\b`));
    const varType = typeMatch ? typeMatch[1] : null;

    if (varType && primitiveTypes.has(varType)) {
        return `{${variable}}`; 
    }

    const jsonOption = config.get<"Indented" | "SingleLine">("jsonOptions") ?? "Indented";
    let optionsCode = "";
    switch (jsonOption) {
        case "SingleLine":
            optionsCode = "new JsonSerializerOptions { WriteIndented = false }";
            break;
        default:
            optionsCode = "new JsonSerializerOptions { WriteIndented = true }";
            break;
    }

    return `{JsonSerializer.Serialize(${variable}, ${optionsCode})}`;
}

export default getSerializedValue;