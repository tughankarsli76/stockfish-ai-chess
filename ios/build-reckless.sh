#!/bin/sh
set -eu
CHESS_ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
export CARGO_HOME="$CHESS_ROOT/ios/rust-toolchain/cargo"
export RUSTUP_HOME="$CHESS_ROOT/ios/rust-toolchain/rustup"
export PATH="$CARGO_HOME/bin:$PATH"
export IPHONEOS_DEPLOYMENT_TARGET=17.0
case "${PLATFORM_NAME:-iphonesimulator}" in
  iphoneos) RECKLESS_TARGET=aarch64-apple-ios ;;
  iphonesimulator) RECKLESS_TARGET=aarch64-apple-ios-sim ;;
  *) echo "Unsupported Reckless platform" >&2; exit 1 ;;
esac
# Xcode's iOS SDKROOT must not leak into the macOS build-script compiler.
unset SDKROOT
cargo build --manifest-path "$CHESS_ROOT/engine/reckless-0.9.0/Cargo.toml" --locked --offline --lib --release --no-default-features --features ios --target "$RECKLESS_TARGET"
mkdir -p "${BUILT_PRODUCTS_DIR:-$CHESS_ROOT/ios/reckless-libs/$RECKLESS_TARGET}"
cp "$CHESS_ROOT/engine/reckless-0.9.0/target/$RECKLESS_TARGET/release/libreckless_ios.a" "${BUILT_PRODUCTS_DIR:-$CHESS_ROOT/ios/reckless-libs/$RECKLESS_TARGET}/libreckless_ios.a"
