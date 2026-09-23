# Stockfish AI Chess

An independent iOS chess app by Tughan Y. Karsli. This repository hosts the source distribution and build instructions for the version 1.0, build 2 development snapshot.

## Download the application source

Open [Releases](https://github.com/tughankarsli76/stockfish-ai-chess/releases) and download **Stockfish-AI-Chess-1.0-build2-source.tar.gz**, plus its SHA256SUMS.txt and source-manifest.json. The attached archive is the application source package; GitHub's automatically generated source ZIP contains only the files in this small distribution repository.

The archive includes the interface, native integration, six modified chess engines, bundled neural-network inputs, artwork notices, opening-book builder and data, tests and project-generation scripts. It contains 1,323 source/input files and is approximately 437 MB (417 MiB). Third-party components retain their individual licenses.

Read [SOURCE-BUILD.md](SOURCE-BUILD.md) and [LICENSING.md](LICENSING.md). Original application contributions are licensed under GPL version 3; the repository's LICENSE does not replace third-party terms. No signing credentials or personal game data are included.

## Verification

The archive passed a Release simulator build from a fresh extraction using the installed Xcode 27.0, Rust 1.94.0, Zig 0.16.0 and downloaded Cargo dependencies on an Apple Silicon Mac. Every archive entry matched the source manifest. This is not a fresh-machine bootstrap test or a claim of byte-identical signed binaries.

This is a development source release, not an App Store binary or a statement of Apple approval. The project generator defaults to version 1.0/build 2. Shahi artwork is removed and Pawnocchio's network license notice is included.

## Support

[Support](https://tughankarsli76.github.io/stockfish-ai-chess-site/support.html) · [Privacy](https://tughankarsli76.github.io/stockfish-ai-chess-site/privacy.html) · [Credits](https://tughankarsli76.github.io/stockfish-ai-chess-site/credits.html)

Contact: tughankarsli@gmail.com

This app is not an official app of the Stockfish project or other engine authors.
