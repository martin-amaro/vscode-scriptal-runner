import * as vscode from 'vscode';
import { RunnerConfigProvider } from './runner.js';

export function activate(context: vscode.ExtensionContext) {

	const config = vscode.workspace.getConfiguration('scriptal-runner');
	const scriptalPath = config.get<string>('path');


	if (!scriptalPath) {
		vscode.window.showErrorMessage('Scriptal path is not set. Please configure it in VSCode settings.');
		return;
	}

	let runDisposable = vscode.commands.registerCommand("extension.scriptal-runner.run", () => {
		vscode.window.showInformationMessage("Running Scriptal file...");
		vscode.commands.executeCommand("workbench.action.debug.start");
	});
	
	context.subscriptions.push(
        vscode.debug.registerDebugConfigurationProvider("scriptal", new RunnerConfigProvider(scriptalPath))
    );
	context.subscriptions.push(runDisposable);
}

export function deactivate() {}
