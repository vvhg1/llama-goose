# Llama Goose

# this is work in progress and not ready for use yet

- does not trigger suggestion again on new stream input, current workaround I am using is triggering inline suggestion by user
- does add inline suggestion but there is some issue with what exactly it should contain and how it is matched by vscode (what to show in the end is handled somewhere deep inside, might help to have a look at the source to get some insight)
- error handling

## Description

This extension provides inline suggestions from a Code Llama model. Named after a famous character from "Top Gun", this AI powered pair programming assistant will help you write code faster and better.

Llama Goose is a Visual Studio Code extension that leverages infill-capable Code-Llama models to provide code suggestions. With this extension, you can enhance your coding experience by getting context-aware code suggestions as you type.

## Requirements

Before using Llama Goose, ensure you have the following prerequisites:

    Visual Studio Code (Version 1.82.0 or higher)
    A Code Llama model server running on your local machine (or a remote machine)
    You currently need my fork of llama.cpp to run the server as it needs to support the infill format. I opened a pull request to the original repo, but it hasn't been merged yet. You can find my fork here: [llama.cpp](https://github.com/vvhg1/llama.cpp.git)

## Installation

    Open Visual Studio Code.

    Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or use the shortcut Ctrl+Shift+X.

    Search for "Llama Goose" in the Extensions view search box.

    Click the "Install" button next to the Llama Goose extension.

    After installation, click "Reload" to activate the extension.

    Get a quantized Code Llama model and llama.cpp (my fork for now) and run the server. This is the sample command to run the server:

    ```bash
    ./server -t 10 -ngl 32 -m ./models/themodelyouwanttorun.gguf  -c 4096 --port 60053
    ```

## Usage

    Open a code file in Visual Studio Code.

    Start typing your code, and Llama Goose will provide inline code suggestions based on your context.

    Accept a suggestion by pressing Tab, or reject it by continuing to type.

    Enjoy an enhanced coding experience with context-aware code suggestions.

## Configuration

(not implemented yet)
Llama Goose connects to a language model server running on your local machine by default. You can modify the server's address and port in the extension's settings.
Default port is 60053 ( goose ;) )

## Known Issues

If you encounter any issues while using Llama Goose, please report them on the GitHub repository.

## Contribution

Contributions to Llama Goose are welcome! If you want to contribute to this project, please fork the GitHub repository and create a pull request.
[Github repository](https://github.com/vvhg1/llama-goose.git)

## License

This extension is licensed under the MIT License. See the LICENSE file for details.

## Author

Llama Goose is developed and maintained by [vvhg1](https://github.com/vvhg1).

## Acknowledgments

    Special thanks to the creators of llama.cpp and the creators of the  Llama(2) models.

## Release Notes

no release yet
0.0.1
