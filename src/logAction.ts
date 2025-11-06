import * as vscode from "vscode";
import { typeColors, VALID_PLACEHOLDERS } from "./constants";
import { ensureJsonUsing, getSafeInsertLine } from "./validator";
import getSerializedValue from "./getSerializedValue";

const logAction = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    const doc = editor.document;
    const selections = editor.selections;
    if (selections.length === 0) {
        vscode.window.showWarningMessage("Please select at least one variable.");
        return;
    }
    const config = vscode.workspace.getConfiguration("logCSharpVariable");
    const prefix = config.get<string>("logPrefix") ?? "APP";
    const colorize = config.get<boolean>("colorizeLogs") ?? true;
    const includeTimestamp = config.get<boolean>("includeTimestamp") ?? true;
    const rawTemplate = config.get<string>("logTemplate") ?? "{prefix}{type}\\n{varLine}\\n{timeLine} at {pathLine}";
    const quickPickItems = Object.entries(typeColors).map(([type, { icon }]) => ({
        label: colorize
            ? `${icon} ${type.toUpperCase()}` : ` ${icon} ${type}`,
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} log`,
        value: type as keyof typeof typeColors,
    }));
    const picked = await vscode.window.showQuickPick(quickPickItems, {
        placeHolder: "Select log type",
    });
    if (!picked) return; 
    const logType = picked.value;
    const { fg, bg } = typeColors[logType];
    const reset = "\x1b[0m";
    const invalid = (rawTemplate.match(/\{[^}]+?\}/g) || []).filter(p => !(p in VALID_PLACEHOLDERS));
    if (invalid.length > 0) {
        vscode.window.showErrorMessage(
            `Invalid placeholders: ${invalid.join(", ")}\n` +
            `Allowed: ${Object.keys(VALID_PLACEHOLDERS).join(", ")}`
        );
        return;
    }
    await editor.edit(async editBuilder => {
        for (const sel of selections) {
            const variable = doc.getText(sel).trim();
            if (!variable) continue;
            const currentLine = sel.start.line;
            const insertLine = getSafeInsertLine(doc, currentLine); // ← Dùng func
            
            const filePath = doc.fileName.replace(/\\/g, "/");
            const lineNum = sel.start.line + 1;
            
            const serializedValue = getSerializedValue(variable, config);
            const varLine = `{nameof(${variable})} = ${serializedValue}`;
       
            const values = {
                "{prefix}": `[${prefix}]`,
                "{type}": colorize
                    ? `${bg}${fg}[${logType.toUpperCase()}]${reset}`
                    : `[${logType.toUpperCase()}]`,
                "{varLine}": varLine,
                "{timeLine}": includeTimestamp ? `{DateTime.Now:yyyy-MM-dd HH:mm:ss}` : `""`,
                "{pathLine}": `${filePath}(${lineNum},1)`,
            };
            const logContent = Object.entries(values).reduce(
                (tmpl, [key, val]) => tmpl.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), val),
                rawTemplate
            );
            const logStatement = `System.Console.WriteLine($"${logContent}"); \n\n`;
            const insertPos = new vscode.Position(insertLine + 1, 0);
            editBuilder.insert(insertPos, logStatement);
        }
        if (config.get<boolean>("serializeObjects")) {
            await ensureJsonUsing(doc, editBuilder);
        }
    }).then(success => {
        if (success) {
            void vscode.commands.executeCommand('editor.action.formatDocument');
        }
    });
}
const logCommandName = "extension.LogCSharpVariable";
export { logAction, logCommandName };