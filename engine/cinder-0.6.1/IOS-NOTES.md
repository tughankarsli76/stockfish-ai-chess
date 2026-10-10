# Cinder 0.6.1: iOS integration

Modified for this application on 2026-10-07. Upstream: https://github.com/brunocodutra/cinder.
Pinned commit: `f5d8b06701b059561e70bfb5dfbc98f65d910131`. Original archive SHA-256: `6528c28578883c40c9098e15cf0e225f9b895f98a2c3671a2a3e360a85e07a92`.

Code license: GPL-3.0; preserve the original LICENSE and all dependency notices.
The network is part of the same licensed release tree. Preserve the LC0 training-data ODbL attribution in README.md.
Network input: `lib/nnue/nnue.bin.zst`; SHA-256: `8036a4da52ad5099824c211388e3e135680c806cc1b8f7d5b03831aa41ab2b7b`.

## Modifications

No upstream chess/search changes. The aggregate Rust host implements the UCI channel and C callbacks. Parsing stays on its 16 MB worker stack: calling the upstream parser on the smaller iOS dispatch stack overflowed even for ucinewgame. Upstream supports one PV; the catalog advertises that limit.

## Rebuild

Run `python3 ios/generate-project.py` from the application root to regenerate namespace wrappers and project paths. Xcode's build phases prepare network layouts and build the selected ARM64 target. Rust engines use the combined host documented in `engine/ios-rust-engines/README.md`; C++ engines use Apple Clang and the same project. No engine executable, remote engine or model download is used at runtime. Complete modified source, input weights and license notices are retained for corresponding-source distribution.

## Validation

The native integration test `testTenNativeEnginesOfflineAnalysisMatchesAndStop` checks release identity, legal PVs, timed matches and cancellation of infinite searches. Recorded results belong in `release/reports/version-1.1-development-update.json`; this source note does not itself claim a passed test or installation.
