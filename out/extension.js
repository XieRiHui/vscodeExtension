"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const main_1 = require("./main");
const zhipu_1 = require("./zhipu");
function activate(context) {
    const disposable = vscode.commands.registerCommand('df.helloWorld', () => {
        vscode.window.showInformationMessage('这是功能1!');
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
    const disposable2 = vscode.commands.registerCommand('df.func2', () => {
        vscode.window.showInformationMessage('这是功能222!');
        //第一步 得到代码上下文
        const editor = vscode.window.activeTextEditor;
        const position = editor?.selection.active; //光标的位置
        if (position === undefined) {
            vscode.window.showInformationMessage("当前光标未激活");
            return;
        }
        const beforeText = editor?.document.getText(new vscode.Range(new vscode.Position(0, 0), position));
        const afterText = editor?.document.getText(new vscode.Range(position, new vscode.Position(editor.document.lineCount, 0)));
        //调用AI大模型API
    });
    const provider = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: '*' }, // 支持所有语言
    {
        async provideCompletionItems(document, position) {
            // 获取代码上下文
            const beforeText = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
            const afterText = document.getText(new vscode.Range(position, document.positionAt(document.getText().length)));
            // 调用智谱API
            let suggestion = await (0, zhipu_1.getZhipuSuggestion)(beforeText, afterText);
            suggestion = suggestion.substring(1, suggestion.length - 1);
            // console.log("suggestion:",suggestion);
            const snippet = new vscode.SnippetString(suggestion);
            // console.log("snippet:",snippet);
            // 创建补全项
            const item = new vscode.CompletionItem('AI Suggestion');
            item.insertText = snippet;
            item.detail = '智谱AI代码补全';
            item.documentation = "AI生成的代码建议";
            item.preselect = true;
            // item.range = new vscode.Range(position.with({ character: Math.max(0, position.character - 1) }), // 前移1字符
            //   position);
            console.log(item.range);
            return [item];
        }
    }, ';');
    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable2);
    context.subscriptions.push(provider);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map