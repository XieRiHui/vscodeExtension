import * as vscode from 'vscode';
import { getFunctionNode } from './main';
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('df.helloWorld', () => {
		vscode.window.showInformationMessage('终于!');

		const editor = vscode.window.activeTextEditor;
		if(!editor) {return;}
		const code=editor.document.getText();
		;
		const index=editor.document.offsetAt(editor.selection.active);
		const functionNode=getFunctionNode(code,index);
		
		if(!functionNode){return;}

		editor.edit((editBuilder:vscode.TextEditorEdit)=> {
			editBuilder.delete(new vscode.Range(new vscode.Position(functionNode.start.line-1,functionNode.start.column),
			new vscode.Position(functionNode.end.line-1,functionNode.end.column)));
		});

	});

	context.subscriptions.push(disposable);
}
export function deactivate() {}