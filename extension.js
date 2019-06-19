const vscode = require('vscode');

function activate(context) {

    function getWordUnderCursor() {
        const editor = vscode.window.activeTextEditor;
        let cursorPosition = editor.selection.start;
        let wordRange = editor.document.getWordRangeAtPosition(cursorPosition);
        return editor.document.getText(wordRange);
    }

    async function findByRegex(regex) {
        var matches = []
        await vscode.workspace.findTextInFiles(
            { pattern: regex, isRegExp: true },
            match => {
                matches.push(match)
            }
        );
        return matches
    }

    async function findExport(word) {
        const export1Regex = `export[ ]+(let|const|var|function)[ ]+${word}(\\(| |=)`
        const export2Regex = `export.*\\{.*${word}[\\}, \\n]+`

        // search exports
        var matches = [
            ...(await findByRegex(export1Regex)),
            ...(await findByRegex(export2Regex)),
        ]

        if (matches.length >= 1) { return matches }

        // search class/function/variable
        const functionRegex = `function[ ]+${word}(\\(| |=)`
        const variableRegex = `(let|const|var)[ ]+${word}( |=)`
        const classRegex = `class[ ]+${word}[ |\\n]`
        matches = [
            ...(await findByRegex(classRegex)),
            ...(await findByRegex(functionRegex)),
            ...(await findByRegex(variableRegex))
        ]

        if (matches.length >= 1) { return matches }

        // search for React/Svelte Component
        var uris = []
        var searchPatterns = [
            `**/${word}.svelte`,
            `**/${word}.js`,
            `**/${word}/index.js`,
            `**/${word}.jsx`,
            `**/${word}/index.jsx`,
        ]

        for (let i = 0; i < searchPatterns.length; i++) {
            uris = await vscode.workspace.findFiles(searchPatterns[i])
            if (uris.length > 0) { break }
        }

        if (uris.length > 0) {
            let match = {
                uri: uris[0],
                ranges: [new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0))]
            }
            matches = [match]
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

        if (matches.length > 1) {
            vscode.window.showInformationMessage(`Multiple exports found... will go to random one`);
        }

        if (matches.length > 0) {
            goToMatch(matches[0])
        } else {
            vscode.window.showInformationMessage(`No match found`);
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
