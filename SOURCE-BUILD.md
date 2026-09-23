# Building the corresponding source

This package contains the original application and modified engine source, required networks, assets and build scripts. Read LICENSING.md for the scoped application license and individual component licenses.

## Environment

Use an Apple Silicon Mac with full Xcode installed and selected as the active developer directory. The recorded build environment uses Xcode 27.0, Python 3, Rust 1.94.0 and Zig 0.16.0. Targets are ARM64 iOS/iPadOS 17.0 or later and ARM64 simulators. General-purpose compilers, Apple SDKs and signing credentials are not included.

Install Rust 1.94.0 using the official Rust distribution with CARGO_HOME set to this extracted project's ios/rust-toolchain/cargo and RUSTUP_HOME to ios/rust-toolchain/rustup. Add its cargo/bin directory to PATH. Install aarch64-apple-ios and aarch64-apple-ios-sim targets. Fetch the pinned Cargo dependencies before the offline Xcode build:

```sh
export CARGO_HOME="$PWD/ios/rust-toolchain/cargo"
export RUSTUP_HOME="$PWD/ios/rust-toolchain/rustup"
export PATH="$CARGO_HOME/bin:$PATH"
rustup toolchain install 1.94.0 --profile minimal
rustup default 1.94.0
rustup target add aarch64-apple-ios aarch64-apple-ios-sim
cargo fetch --locked --manifest-path engine/reckless-0.9.0/Cargo.toml
```

These commands require rustup already installed into the specified cargo/bin location. Obtain rustup from https://rustup.rs/; the toolchain and dependency fetch need internet access. Install the official ARM64 macOS Zig 0.16.0 distribution from https://ziglang.org/download/ so that its executable is ios/zig-toolchain/zig. Keep its accompanying library directory intact.

## Generate and build

From the extracted project root, generate the Xcode project first; generated project files are not part of the archive:

```sh
python3 ios/generate-project.py
xcodebuild -project ios/StockfishChess.xcodeproj -scheme StockfishChess \
  -configuration Release -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath ios/source-build CODE_SIGNING_ALLOWED=NO build
```

Open the generated project to run on a simulator. To build for a physical device, use a generic iOS destination and configure your own signing account/team in Xcode. The temporary bundle ID is org.example.stockfishaichess. Changing it creates a different app container; export existing games first. No signing credentials are provided.

See ios/README.md for tests and native integration, and each engine's IOS-NOTES.md for modifications, model checksums and engine-specific build details. Use the source manifest to verify files. Compiler/SDK differences can change binary bytes; a successful build is not a claim of bit-for-bit identity with Apple's signed distribution.

## Verification limits

The recorded extraction build uses the existing local Rust/Zig installations and downloaded Cargo cache, with fresh application and engine build outputs. It verifies archive completeness and buildability in that environment, not a fresh-machine toolchain bootstrap. Source publication and App Store review are separate release steps.
