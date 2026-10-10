# Reckless 0.9.0 iOS integration

Upstream: https://github.com/codedeliveryservice/Reckless/tree/v0.9.0
Source obtained from the official v0.9.0 tag. Preserve LICENSE (AGPL-3.0), AUTHORS,
source, Cargo.lock and these build instructions with distributions.

## Neural network

Official model: https://github.com/codedeliveryservice/RecklessNetworks/releases/download/networks/v54-5478683c.nnue
SHA-256: 5478683cb1bababde29ae8f29468a99846726548fc6a0ed54cac40ab6d38efbf
Place in networks/v54-5478683c.nnue. Rust embeds it in the static library; no runtime download.

## Build

The project-local Rust 1.94.0 toolchain lives in ios/rust-toolchain (not a global
installation and no shell profile changes). Required targets: aarch64-apple-ios,
aarch64-apple-ios-sim. Set CARGO_HOME and RUSTUP_HOME to its cargo/rustup folders,
and put cargo/bin on PATH. Fetch dependencies with cargo fetch --locked using
this Cargo.toml. Xcode's build-reckless.sh then builds with --locked --offline,
--lib --release --no-default-features --features ios, targeting the active SDK.
Minimum iOS version: 17.0. Both device and simulator are ARM64 with NEON.

## Local changes

- Added staticlib target, lib.rs output macros, and ios.rs C ABI bridge.
- Added IosUci command entry point reusing upstream command/search functions.
- Added an atomic cancellation latch to SharedContext and the search startup,
  ensuring immediate suspension cannot be overwritten by a just-starting worker.
- Set iOS worker priority to match the interactive host command queue.
- Added ThreadPool destruction that joins workers when switching engines.
- Search, move generation, evaluation weights, and tuning remain upstream.
- C++ RecklessBackend.cpp runs searches on a worker thread and joins before
  changing engines or releasing state. Output reaches the existing session-checked
  WKWebView bridge without subprocesses or process-wide stdio redirection.

No bundled Syzygy files: this build disables Syzygy and NUMA. Reckless has no
Stockfish Skill Level or UCI_ShowWDL option. The host skips those unsupported
options, displays Full strength for difficulty, and does not synthesize WDL.
The existing time limits, opening book, MultiPV, Threads and Hash controls remain.
