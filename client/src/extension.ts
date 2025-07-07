
import * as path from 'path';
import * as vscode from 'vscode';


import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;
// //预览
let previewDecoration: vscode.TextEditorDecorationType | undefined;
let previewDisposables : vscode.Disposable[] = [];


export function activate(context: vscode.ExtensionContext) {
	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// 注册代码补全针对的语言对象
		documentSelector: [{ scheme: 'file', language: 'javascript' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'myExtension v1.0',
		'My Extension V1.0',
		serverOptions,
		clientOptions
	);

	client.onNotification('client/executeCommand',(previewInfo)=>{
		showPreview(previewInfo);
	});

	// Start the client. This will also launch the server
	client.start();


}
// 显示预览
function showPreview(previewInfo: {text:string,range:vscode.Range}){
	const editor = vscode.window.activeTextEditor;
	if(!editor){
		return;
	}
	//清除之前的预览
	clearPreview();

	//创建新的预览装饰器
	previewDecoration = vscode.window.createTextEditorDecorationType({
		rangeBehavior:vscode.DecorationRangeBehavior.ClosedClosed,
		light:{color:'rgba(247, 173, 13, 0.98)'},
		dark:{color:'rgba(241, 14, 14, 0.92)'},
		after:{
			contentText:previewInfo.text,
			color:new vscode.ThemeColor('editorGhostText.foreground'),
			fontStyle:'italic'
		}
	});

	// 应用装饰器
    editor.setDecorations(previewDecoration, [{
        range: previewInfo.range,
        hoverMessage: '代码补全预览'
    }]);
    // 监听文档变化以清除预览
    const changeDisposable = vscode.workspace.onDidChangeTextDocument(e => {
        if (e.document === editor.document) {
            clearPreview();
        }
    });

    // 监听光标移动以清除预览
    const cursorDisposable = vscode.window.onDidChangeTextEditorSelection(e => {
        if (e.textEditor === editor) {
            clearPreview();
        }
    });

    previewDisposables.push(changeDisposable, cursorDisposable);
}


//清除预览
function clearPreview(){
	if(previewDecoration){
		previewDecoration.dispose();
		previewDecoration = null;
	}
	previewDisposables.forEach(e=>{e.dispose();});
	previewDisposables = [];
	
}


export function deactivate(): Thenable<void> | undefined {
	//关闭插件前清除预览
	//clearPreview();

	if (!client) {
		return undefined;
	}
	return client.stop();
}
