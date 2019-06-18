const vscode = require('vscode');

function activate(context) {

    function getWordUnderCursor() {
        const editor = vscode.window.activeTextEditor;
        let cursorPosition = editor.selection.start;
        let wordRange = editor.document.getWordRangeAtPosition(cursorPosition);
        return editor.document.getText(wordRange);
    }

    function goToMatch(match) {
        vscode.workspace.openTextDocument(match.uri)
            .then(doc => {
                return vscode.window.showTextDocument(doc)
                    .then(editor => {
                        let range = match.ranges[0]
                        editor.selection = new vscode.Selection(range.start, range.end);
                        vscode.commands.executeCommand('revealLine', {
                            lineNumber: range.start.line,
                            at: 'center'
                        });
                    });
            });
    }

    let disposable = vscode.commands.registerTextEditorCommand('extension.go-to-export', async function () {
        let word = getWordUnderCursor();

        const regexText = `export (let|const|var|function) ${word}(\\(| )`
        var matches = []
        await vscode.workspace.findTextInFiles(
            { pattern: regexText, isRegExp: true },
            match => {
                matches.push(match)
            }
        );

        if (matches.length == 0) {
            vscode.window.showInformationMessage(`No match found`);
            return;
        }

        if (matches.length > 1) {
            vscode.window.showInformationMessage(`Multiple exports found... will go to random one`);
        }

        // let ranges = matches[0].ranges
        // let line = ranges[0].start.line
        // let uri = matches[0].uri
        // console.log(`first match is ${JSON.stringify(ranges)} ${uri}`)
        // console.log(`line ${line} of ${uri}`)

        goToMatch(matches[0])
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
