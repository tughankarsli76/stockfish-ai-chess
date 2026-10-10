# Building the corresponding source

This package contains the original application and modified engine source, required networks, assets and build scripts. Read LICENSING.md for the scoped application license and individual component licenses.

## Environment

Use an Apple Silicon Mac with full Xcode installed and selected as the active developer directory. The recorded build environment uses Xcode 27.0, Python 3, Rust nightly-2026-08-16 and Zig 0.16.0. Targets are ARM64 iOS/iPadOS 17.0 or later and ARM64 simulators. General-purpose compilers, Apple SDKs and signing credentials are not included.

Install Rust nightly-2026-08-16 using the official Rust distribution with CARGO_HOME set to this extracted project's ios/rust-toolchain/cargo and RUSTUP_HOME to ios/rust-toolchain/rustup. Add its cargo/bin directory to PATH. Install aarch64-apple-ios and aarch64-apple-ios-sim targets. The locked Rust crate sources and licenses are vendored in engine/ios-rust-engines/vendor. No Cargo dependency fetch is needed for the offline Xcode build:

```sh
export CARGO_HOME="$PWD/ios/rust-toolchain/cargo"
export RUSTUP_HOME="$PWD/ios/rust-toolchain/rustup"
export PATH="$CARGO_HOME/bin:$PATH"
rustup toolchain install nightly-2026-08-16 --profile minimal
rustup default nightly-2026-08-16
rustup target add aarch64-apple-ios aarch64-apple-ios-sim
```

These commands require rustup already installed into the specified cargo/bin location. Obtain rustup from https://rustup.rs/; the toolchain and target installation need internet access. Install the official ARM64 macOS Zig 0.16.0 distribution from https://ziglang.org/download/ so that its executable is ios/zig-toolchain/zig. Keep its accompanying library directory intact.

Keep the vendored Cargo files intact, including platform import libraries, Windows test DLLs and source directories named `target`. Cargo validates these original package inputs against their recorded checksums even though the iOS build does not run Windows fixtures. The public source package retains them and their license notices; the app's bundled source copy omits the Windows binary files.

## Generate and build

From the extracted project root, generate the Xcode project first; generated project files are not part of the archive:

```sh
python3 ios/generate-project.py
xcodebuild -project ios/StockfishChess.xcodeproj -scheme StockfishChess \
  -configuration Release -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath ios/source-build CODE_SIGNING_ALLOWED=NO build
```

Open the generated project to run on a simulator. To build for a physical device, use a generic iOS destination and configure your own signing account/team in Xcode. The Debug bundle ID is org.example.stockfishaichess; Release uses com.tughankarsli.stockfishaichess, version 1.4, build 21 in this source tree. Use your own unique identifier and signing team when building your own distribution. Changing it creates a different app container; export existing games first. No signing credentials are provided.

Build 21 contains fixes made after the immutable public version 1.4 build 15 source snapshot, including live computer play after taking back a checkmate and the approved SF Pro player typography. White/Black labels use the original Arial 18px bold (700), and clocks use the original Arial 17px bold (700) with tabular digits. Player names retain SF Pro 16px regular (400). The Apple system font is used directly for names on iOS/macOS, without redistributing font files. The owner authorized App Store submission of version 1.4 build 21 on October 9, 2026. This source tree corresponds to build 21. Its versioned source release is https://github.com/tughankarsli76/stockfish-ai-chess/releases/tag/v1.4-build21-source. Earlier build 15 source and binaries remain immutable. Source publication, binary upload and App Review submission are independently verified release steps.

See ios/README.md for tests and native integration, and each engine's IOS-NOTES.md for modifications, model checksums and engine-specific build details. Use the source manifest to verify files. Compiler/SDK differences can change binary bytes; a successful build is not a claim of bit-for-bit identity with Apple's signed distribution.

## Verification limits

Version 1.4 build 21 is the current release candidate. Setup Position now opens with coordinates enabled by default; its coordinate toggle remains available. Historical-game review saves the selected move and active view, and restores both after a phone-lock reload. Headless computer play advances its saved cursor to the latest move. The Analysis toolbar button switches between Analysis and the main Game view, including after Setup Position, while preserving the position. The Classical & Legendary Games collection contains 100 distinct complete scores spanning 1475–2026, with 55 older and newer additions and source provenance in docs/HISTORICAL-GAMES-SOURCES.md. Checkmate now shows a winner-colored king with 12 stars and a nine-second animation below the larger, bold result label in Game and Analysis. The existing full-screen confetti is preserved. Review and view switching do not replay either celebration; reduced-motion preferences disable animation. The prior version 1.3 submission and corresponding-source release are frozen separately.

Version 1.3 build 14 adds unsigned mate labels, the original Maple board as the default, a one-tap Resume Match button, dynamic installed-version display, and simplified Legendary Games details. Engine matches and tournaments now save and pause when leaving the app or locking the phone, without requesting continued-processing system activities. The ten native engines, networks and privacy manifest remain unchanged. The historical game records and provenance are documented in docs/HISTORICAL-GAMES-SOURCES.md.

The production archive is audited against this package's input manifest and the exact bundled web assets. An independent clean build of build 6's extracted source previously passed original vendored-file checksums and built the unsigned Release app for an ARM64 iOS simulator using the existing local Rust/Zig installations. Fresh-machine compiler installation has not been repeated, and binary reproducibility is not claimed. Submitted build 14 validation results are recorded alongside the corresponding-source release. Source publication and App Store review are separate release steps.
