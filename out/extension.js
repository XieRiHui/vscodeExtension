"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const main_1 = require("./main");
function activate(context) {
    const disposable = vscode.commands.registerCommand('df.helloWorld', () => {
        vscode.window.showInformationMessage('终于!');
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const code = editor.document.getText();
        ;
        const index = editor.document.offsetAt(editor.selection.active);
        const functionNode = (0, main_1.getFunctionNode)(code, index);
        if (!functionNode) {
            return;
        }
        editor.edit((editBuilder) => {
            editBuilder.delete(new vscode.Range(new vscode.Position(functionNode.start.line - 1, functionNode.start.column), new vscode.Position(functionNode.end.line - 1, functionNode.end.column)));
        });
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map