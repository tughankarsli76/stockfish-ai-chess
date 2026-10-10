# Combined Rust host for iOS

This static library combines Reckless 0.9.0, Cinder 0.6.1 and Viridithas 20.0.0 under one Rust standard-library runtime. The host is AGPL-3.0-or-later and retains each upstream component's terms. Cargo.lock pins active dependencies; DEPENDENCY-LICENSES.json and vendor/ retain their complete source and notices.

Use the ARM64 Mac nightly-2026-08-16 toolchain (Rust 1.100.0-nightly, 67854e511), with aarch64-apple-ios and aarch64-apple-ios-sim targets, in the project-local ios/rust-toolchain tree. Set CARGO_HOME to ios/rust-toolchain/cargo and RUSTUP_HOME to ios/rust-toolchain/rustup. Install the toolchain and targets with rustup before building. Signing configuration is independent.

Run `PLATFORM_NAME=iphonesimulator ios/build-rust-engines.sh`, or use PLATFORM_NAME=iphoneos. The script sets an iOS 17 deployment target and builds --locked --offline using the supplied vendor sources. It removes SDKROOT for host build scripts; Xcode supplies the device SDK for target linking. No crate download is needed once the compiler and target standard libraries are installed. The output is libchess_rust_ios.a. Do not also link a standalone Reckless static library: doing so duplicates Rust runtime symbols.

Cinder receives raw UCI strings through a channel and parses them on its 16 MB worker stack, avoiding a parser stack overflow on iOS dispatch threads and emits complete lines through a native callback. Viridithas has a library entry point and UCI channel reader; its stdout macros emit complete lines through the callback. Each host stops a running search and waits for bestmove before mutation. Destroy sends quit and joins the UCI thread. The C++ wrapper limits the active Rust callback to the app's single serialized engine connection.

ARM64 numerical validation: run ios/test-viridithas-neon.sh on an ARM64 Mac. Native engine analysis, match and cancellation tests run in the isolated CoreScaling iOS test app; do not run them over normal app preferences.
