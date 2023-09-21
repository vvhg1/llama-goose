const vscode = require("vscode");
const http = require('http');

let logger = vscode.window.createOutputChannel("Llama Goose");
let loggerm = vscode.window.createOutputChannel("Llama Goose Model");
let testInlineSuggestion = "";
let modelServer = "localhost";
let modelPort = 60053; //goose ;)
let ongoingRequest = null;
logger.appendLine(`starting up`);
async function queryModel(in_prefix, in_suffix) {
  if (ongoingRequest) {
    logger.appendLine(`Aborting ongoing request`);
    ongoingRequest.abort();
    ongoingRequest = null; // Reset the ongoing request variable
  }
  logger.appendLine(`Querying model`);

  const postData = JSON.stringify({
    input_prefix: in_prefix,
    input_suffix: in_suffix,
    n_predict: 128,
    stream: true,
  });

  const options = {
    hostname: modelServer,
    port: modelPort,
    path: '/infill',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const req = http.request(options, (res) => {
    res.on('data', (chunk) => {
      const chunkString = chunk.toString();
      try {
        const cutString = chunkString.substring(6);
        const json = JSON.parse(cutString);
        loggerm.append(json.content);
        logger.appendLine(`reply stream            :${json.content}`);
        testInlineSuggestion += json.content;
        logger.appendLine(`testinline after model call: ${testInlineSuggestion}`);
        vscode.commands.executeCommand('editor.action.triggerInlineSuggest');
        logger.appendLine(`triggered completion?`);
      } catch (error) {
        loggerm.appendLine(`Error parsing JSON: ${error.message}`);
        logger.appendLine(`Error parsing JSON: ${error.message}`);
      }
    });

    res.on('error', (error) => {
      logger.appendLine(`Error: ${error.message}`);
    }
    );
    res.on('close', () => {
      loggerm.appendLine(`Stream closed`);
      logger.appendLine(`Stream closed`);
    }
    );
  });
  ongoingRequest = req;

  req.on('error', (error) => {
    logger.appendLine(`Error in request: ${error.message}`);
  });

  req.write(postData);
  req.end();
}
// 
vscode.workspace.onDidChangeTextDocument((e) => {
  if (vscode.window.activeTextEditor.document === e.document) {
    let textchange = e.contentChanges[0].text;
    let chagnedCharCount = textchange.length;
    let realCursor = new vscode.Position(e.contentChanges[0].range.start.line, e.contentChanges[0].range.start.character + chagnedCharCount);
    let textBeforeCursor = e.document.getText(new vscode.Range(new vscode.Position(0, 0), realCursor));
    let textAfterCursor = e.document.getText(new vscode.Range(realCursor, new vscode.Position(e.document.lineCount, 0)));
    let currentLine = e.document.lineAt(realCursor.line);
    let suggestionStart = currentLine.text.trimStart();
    // if testInlineSuggestion starts with suggestionStart, then we don't need to query the model
    if (testInlineSuggestion.startsWith(suggestionStart)) {
      logger.appendLine(`testInlineSuggestion starts with suggestionStart`);
    } else {
      testInlineSuggestion = suggestionStart;
      queryModel(textBeforeCursor, textAfterCursor);
    }
  }
});

function activate(context) {
  logger.appendLine("Llama Goose is now active");
  // Register the inline completion provider when the extension activates
  const provider = vscode.languages.registerInlineCompletionItemProvider('*', {
    provideInlineCompletionItems: async (document, position, context, token) => {
      const items = [];
      if (testInlineSuggestion !== "") {
        const line = document.lineAt(position.line);
        let range = line.range;
        logger.appendLine(`adding suggestion ${testInlineSuggestion}`);
        const suggestion = testInlineSuggestion;
        range = new vscode.Range(range.start, range.start)
        items.push({
          insertText: suggestion,
        });
      } else {
        logger.appendLine(`flagging as complete`);
      }
      logger.appendLine(`hi there`);
      return items;
    }
  });

  context.subscriptions.push(provider);
}


function deactivate() {
  //cancel any ongoing request
  if (ongoingRequest) {
    logger.appendLine(`Aborting ongoing request`);
    ongoingRequest.abort();
  }
  logger.appendLine("Llama Goose is now inactive");
}


module.exports = {
  activate,
  deactivate
};
