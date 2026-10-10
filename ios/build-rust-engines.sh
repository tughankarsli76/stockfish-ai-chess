#!/bin/sh
set -eu
CHESS_ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
export CARGO_HOME="$CHESS_ROOT/ios/rust-toolchain/cargo"
export RUSTUP_HOME="$CHESS_ROOT/ios/rust-toolchain/rustup"
export PATH="$CARGO_HOME/bin:$PATH"
export IPHONEOS_DEPLOYMENT_TARGET=17.0
case "${PLATFORM_NAME:-iphonesimulator}" in
  iphoneos) CHESS_RUST_TARGET=aarch64-apple-ios ;;
  iphonesimulator) CHESS_RUST_TARGET=aarch64-apple-ios-sim ;;
  *) echo "Unsupported chess platform" >&2; exit 1 ;;
esac
unset SDKROOT
cargo +nightly-2026-08-16 --config 'source.crates-io.replace-with="vendored-sources"' --config "source.vendored-sources.directory=\"$CHESS_ROOT/engine/ios-rust-engines/vendor\"" build --manifest-path "$CHESS_ROOT/engine/ios-rust-engines/Cargo.toml" --locked --offline --lib --release --target "$CHESS_RUST_TARGET"
CHESS_LIB_DEST=${BUILT_PRODUCTS_DIR:-$CHESS_ROOT/ios/rust-libs/$CHESS_RUST_TARGET}
mkdir -p "$CHESS_LIB_DEST"
cp "$CHESS_ROOT/engine/ios-rust-engines/target/$CHESS_RUST_TARGET/release/libchess_rust_ios.a" "$CHESS_LIB_DEST/libchess_rust_ios.a"
