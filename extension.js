const vscode = require('vscode');

function activate(context) {

    function getWordUnderCursor() {
        const editor = vscode.window.activeTextEditor;
        let cursorPosition = editor.selection.start;
        let wordRange = editor.document.getWordRangeAtPosition(cursorPosition);
        return editor.document.getText(wordRange);
    }

    async function findExport(word) {
        const findExportRegex = `export[ ]+(let|const|var|function)[ ]+${word}(\\(| |=)`
        const findFunctionRegex = `function[ ]+${word}(\\(| |=)`
        const findVariableRegex = `(let|const|var)[ ]+${word}( |=)`
        var matches = []
        await vscode.workspace.findTextInFiles(
            { pattern: findExportRegex, isRegExp: true },
            match => {
                matches.push(match)
            }
        );


        if (matches.length >= 1) {
            if (matches.length > 1) {
                vscode.window.showInformationMessage(`Multiple exports found... will go to random one`);
            }
            return matches
        }


        if (matches.length == 0) {
            await vscode.workspace.findTextInFiles(
                { pattern: findFunctionRegex, isRegExp: true },
                match => {
                    matches.push(match)
                }
            );
            await vscode.workspace.findTextInFiles(
                { pattern: findVariableRegex, isRegExp: true },
                match => {
                    matches.push(match)
                }
            );
        }

        if (matches.length == 0) {
            vscode.window.showInformationMessage(`No match found`);
        }

        return matches
    }

    function goToMatch(match) {
        vscode.window.showTextDocument(
            match.uri,
            { selection: match.ranges[0] }
        )
    }

    let disposable = vscode.commands.registerTextEditorCommand('extension.go-to-export', async function () {
        let word = getWordUnderCursor();

        let matches = await findExport(word);

        if (matches.length > 0) {
            goToMatch(matches[0])
        }
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
