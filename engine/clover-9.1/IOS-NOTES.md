# Clover 9.1: iOS integration

Modified for this application on 2026-10-07. Upstream: https://github.com/lucametehau/CloverEngine.
Pinned commit: `e647926a8f23b6b93f7f27c01cb6f686909ec482`. Original archive SHA-256: `0406e682fb5b0f3531cb9e8786476b63848f73a93cb9ff3df578f0842ac19633`.

Code license: GPL-3.0-or-later; preserve the original LICENSE and all dependency notices.
The network is part of the same licensed release tree. Bundled Fathom retains its MIT license; incbin-UNLICENSE.txt preserves the original incbin grant.
Network input: `src/quantised.nnue`; SHA-256: `605aa6d9cc676f299a81e048e3c4c4cca8c9899c977b2d49a7bb0c0de202b114`.

## Modifications

Native UCI init/command methods share the original CLI parser. The host stops and joins all search workers before a new position, option, or engine switch. Namespace wrappers and prefixed Fathom/assembly globals prevent collisions with other engines. Replaced three ambiguous integer comparisons on checkers() with equivalent boolean conversions for Clang C++20.

## Rebuild

Run `python3 ios/generate-project.py` from the application root to regenerate namespace wrappers and project paths. Xcode's build phases prepare network layouts and build the selected ARM64 target. Rust engines use the combined host documented in `engine/ios-rust-engines/README.md`; C++ engines use Apple Clang and the same project. No engine executable, remote engine or model download is used at runtime. Complete modified source, input weights and license notices are retained for corresponding-source distribution.

## Validation

The native integration test `testTenNativeEnginesOfflineAnalysisMatchesAndStop` checks release identity, legal PVs, timed matches and cancellation of infinite searches. Recorded results belong in `release/reports/version-1.1-development-update.json`; this source note does not itself claim a passed test or installation.
