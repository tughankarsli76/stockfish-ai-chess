#!/bin/sh
set -eu
CHESS_ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
CHESS_MATH_TEST=$(mktemp -d "${TMPDIR:-/tmp}/chess-neon.XXXXXX")
trap 'rm -rf "$CHESS_MATH_TEST"' EXIT HUP INT TERM
"$CHESS_ROOT/ios/rust-toolchain/rustup/toolchains/nightly-2026-08-16-aarch64-apple-darwin/bin/rustc" --edition 2024 --test "$CHESS_ROOT/engine/viridithas-20.0.0/src/nnue/simd.rs" -o "$CHESS_MATH_TEST/neon-test"
"$CHESS_MATH_TEST/neon-test"
