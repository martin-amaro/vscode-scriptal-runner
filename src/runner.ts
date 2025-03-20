import * as vscode from 'vscode';
import * as path from 'path';

export class RunnerConfigProvider implements vscode.DebugConfigurationProvider {
    private static terminal: vscode.Terminal | null = null; // Terminal persistente
    private scriptalPath: string;

    constructor(scriptalPath: string) {
        this.scriptalPath = scriptalPath;
    }

    resolveDebugConfiguration(
        folder: vscode.WorkspaceFolder | undefined,
        config: vscode.DebugConfiguration,
        token?: vscode.CancellationToken
    ): vscode.DebugConfiguration | undefined {
        if (!config.program) {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const filePath = editor.document.uri.fsPath;

                if (!filePath.endsWith('.stal')) {
                    vscode.window.showErrorMessage("The file must have a '.stal' extension.");
                    return undefined;
                }

                config.program = filePath;
                const exePath = this.scriptalPath; // Ruta del ejecutable

                // Si la terminal fue cerrada manualmente, la volvemos a crear
                if (!RunnerConfigProvider.terminal || RunnerConfigProvider.terminal.exitStatus) {
                    RunnerConfigProvider.terminal = vscode.window.createTerminal("Scriptal Runner");
                }

                // Limpiamos la consola antes de ejecutar
                const clearCommand = process.platform === "win32" ? "cls" : "clear";
                RunnerConfigProvider.terminal.sendText(clearCommand);

                // Ejecutamos el .exe con el archivo
                RunnerConfigProvider.terminal.sendText(`${exePath} "${filePath}"`);
                RunnerConfigProvider.terminal.show();

                
            } else {
                vscode.window.showErrorMessage("It must be a '.stal' file.");
                return undefined;
            }
        }
        return config;
    }
}
