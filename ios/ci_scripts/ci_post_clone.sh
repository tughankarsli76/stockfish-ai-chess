#!/bin/sh
set -eu
CHESS_ROOT="${CI_PRIMARY_REPOSITORY_PATH:?Xcode Cloud checkout path is required}"
cd "$CHESS_ROOT"
if [ "$(uname -m)" != arm64 ]; then
    echo 'This project requires an Apple Silicon Xcode Cloud build environment.' >&2
    exit 1
fi
python3 ios/ci_scripts/restore-models.py
export CARGO_HOME="$CHESS_ROOT/ios/rust-toolchain/cargo"
export RUSTUP_HOME="$CHESS_ROOT/ios/rust-toolchain/rustup"
export PATH="$CARGO_HOME/bin:$PATH"
mkdir -p "$CHESS_ROOT/.cloud-cache"
if [ ! -x "$CARGO_HOME/bin/rustup" ]; then
    curl --fail --location --retry 3 https://sh.rustup.rs -o "$CHESS_ROOT/.cloud-cache/rustup-init.sh"
    sh "$CHESS_ROOT/.cloud-cache/rustup-init.sh" -y --no-modify-path --profile minimal --default-toolchain nightly-2026-08-16
fi
rustup toolchain install nightly-2026-08-16 --profile minimal
rustup target add --toolchain nightly-2026-08-16 aarch64-apple-ios aarch64-apple-ios-sim
if [ ! -x "$CHESS_ROOT/ios/zig-toolchain/zig" ]; then
    curl --fail --location --retry 3 https://ziglang.org/download/0.16.0/zig-aarch64-macos-0.16.0.tar.xz -o "$CHESS_ROOT/.cloud-cache/zig.tar.xz"
    printf '%s  %s\n' b23d70deaa879b5c2d486ed3316f7eaa53e84acf6fc9cc747de152450d401489 "$CHESS_ROOT/.cloud-cache/zig.tar.xz" | shasum -a 256 -c -
    mkdir -p "$CHESS_ROOT/ios/zig-toolchain"
    tar -xf "$CHESS_ROOT/.cloud-cache/zig.tar.xz" -C "$CHESS_ROOT/ios/zig-toolchain" --strip-components=1
fi
"$CHESS_ROOT/ios/zig-toolchain/zig" version
if ! command -v node >/dev/null 2>&1 || ! node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 24 ? 0 : 1)'; then
    export HOMEBREW_NO_AUTO_UPDATE=1
    brew install node@24
    export PATH="$(brew --prefix node@24)/bin:$PATH"
fi
node --test --test-isolation=none tests/*.test.mjs
python3 ios/test-scan-model-download.py
if ! python3 -c 'import sys; sys.exit(0 if sys.version_info[:2] == (3, 12) else 1)'; then
    brew install python@3.12
    export CHESS_SCAN_PYTHON="$(brew --prefix python@3.12)/bin/python3.12"
fi
sh ios/prepare-scan-models.sh
python3 ios/generate-project.py
