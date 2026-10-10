# Starzix 6.1: iOS integration

Modified for this application on 2026-10-07. Upstream: https://github.com/zzzzz151/Starzix.
Pinned commit: `cb3bc13cc651f73db56ad4a714ed2765dcc901c0`. Original archive SHA-256: `db48c19bb6a4badf8c8f837d3b98305fa2aaa8637ebeddd081cbade0c3955a24`.

Code license: WTFPL-2.0; preserve the original LICENSE and all dependency notices.
The network is part of the same licensed release tree. Retain MIT ordered-map headers, incbin-UNLICENSE.txt and upstream LC0 training-data attribution. The upstream repository is archived; 6.1 is the latest published release found.
Network input: `src/net.bin`; SHA-256: `2ef2c339a0eb17a06d64b91d96a3b374750f58600a973d1521a12d1452320034`.

## Modifications

Added an ARM64 scalar Vec fallback and conditional x86 intrinsic inclusion; the existing non-AVX evaluation path is retained. Added an optional network path define and an independent atomic cancellation flag so a stop arriving before search startup cannot be cleared by go(). Namespace and assembly-name isolation avoid collisions. The host joins the search thread before mutation/destruction. Upstream supplies one PV.

## Rebuild

Run `python3 ios/generate-project.py` from the application root to regenerate namespace wrappers and project paths. Xcode's build phases prepare network layouts and build the selected ARM64 target. Rust engines use the combined host documented in `engine/ios-rust-engines/README.md`; C++ engines use Apple Clang and the same project. No engine executable, remote engine or model download is used at runtime. Complete modified source, input weights and license notices are retained for corresponding-source distribution.

## Validation

The native integration test `testTenNativeEnginesOfflineAnalysisMatchesAndStop` checks release identity, legal PVs, timed matches and cancellation of infinite searches. Recorded results belong in `release/reports/version-1.1-development-update.json`; this source note does not itself claim a passed test or installation.
