import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.copyIpynbCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }

        const document = editor.document;
        const filePath = document.fileName;

        if (path.extname(filePath) !== '.ipynb') {
            vscode.window.showErrorMessage('Not a Jupyter Notebook file.');
            return;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const notebook = JSON.parse(content);

            let code = '';
            notebook.cells.forEach((cell: any) => {
                if (cell.cell_type === 'code') {
                    code += cell.source.join('') + '\n';
                }
            });

            vscode.env.clipboard.writeText(code);
            vscode.window.showInformationMessage('Code copied to clipboard.');
        } catch (error) {
            vscode.window.showErrorMessage('Failed to parse the notebook file.');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}