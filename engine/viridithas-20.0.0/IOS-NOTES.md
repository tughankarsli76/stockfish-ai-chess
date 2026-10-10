# Viridithas 20.0.0: iOS integration

Modified for this application on 2026-10-07. Upstream: https://github.com/cosmobobak/viridithas.
Pinned commit: `0631113e2215714c54d397cce9a8caebc5e6f8ee`. Original archive SHA-256: `cd8ffe4d284e24a66d6972f673ae3aec87ced45e80ffdc3afde6a7ad850e57dd`.

Code license: MIT; preserve the original LICENSE and all dependency notices.
The separate network repository explicitly licenses all networks as CC0. Its license is copied as network-LICENSE-CC0.txt. Input: v109 sandhi-s2-b200.nnue.zst.
Network input: `viridithas.nnue.zst`; SHA-256: `066c172e22c25ee3d3b4084ad44ff761426f906a9c536cabd0127d17413d0585`.

## Modifications

Added a library entry point, line-oriented output callbacks and a channel-based UCI reader. The CLI reader remains available. Native identity omits the development suffix. Fixed the ARM64 Align64 type reference to the existing aligned type. DOTPROD uses runtime CPU detection; a baseline NEON fallback preserves the four-lane dot-product calculation on older ARM64 devices. The scalar-reference test exercises both dispatched and forced-baseline paths. Upstream supplies one PV.

## Rebuild

Run `python3 ios/generate-project.py` from the application root to regenerate namespace wrappers and project paths. Xcode's build phases prepare network layouts and build the selected ARM64 target. Rust engines use the combined host documented in `engine/ios-rust-engines/README.md`; C++ engines use Apple Clang and the same project. No engine executable, remote engine or model download is used at runtime. Complete modified source, input weights and license notices are retained for corresponding-source distribution.

## Validation

The native integration test `testTenNativeEnginesOfflineAnalysisMatchesAndStop` checks release identity, legal PVs, timed matches and cancellation of infinite searches. Recorded results belong in `release/reports/version-1.1-development-update.json`; this source note does not itself claim a passed test or installation.
