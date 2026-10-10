# Halogen 16.0.0: iOS integration

Modified for this application on 2026-10-07. Upstream: https://github.com/KierenP/Halogen.
Pinned commit: `fa6d24a5423a20b4530723cd0f6f76d4da0581d8`. Original archive SHA-256: `11b33eadee78cc9aeec77dcfcdbcc70f22eda40243d64488ed35a96ecf401a16`.

Code license: GPL-3.0; preserve the original LICENSE and all dependency notices.
The separate Halogen-Networks repository supplies GPL-3.0; retain network-LICENSE-GPL3.txt. Input tag 150521a9.
Network input: `src/150521a9.nn`; SHA-256: `150521a9957beb7fe90395dd5b134f75cde4e6dfc95e5d5fdee80031e7c7c9cb`.

## Modifications

Generated C++ namespace wrappers isolate all globals, network assembly names and bundled Pyrrhic from other engines. Native host exposes join_search_thread for cancellation. Standard-library specializations live outside the isolated namespace and integer abs is qualified. The network is converted with the upstream verbatim tool for NEON without DOTPROD or NETWORK_SHUFFLE; prepare-halogen-network.py records and checks original, converter and output hashes. C++20, ARM64, floating-point contraction disabled. No OpenMP/NUMA requirement.

## Rebuild

Run `python3 ios/generate-project.py` from the application root to regenerate namespace wrappers and project paths. Xcode's build phases prepare network layouts and build the selected ARM64 target. Rust engines use the combined host documented in `engine/ios-rust-engines/README.md`; C++ engines use Apple Clang and the same project. No engine executable, remote engine or model download is used at runtime. Complete modified source, input weights and license notices are retained for corresponding-source distribution.

## Validation

The native integration test `testTenNativeEnginesOfflineAnalysisMatchesAndStop` checks release identity, legal PVs, timed matches and cancellation of infinite searches. Recorded results belong in `release/reports/version-1.1-development-update.json`; this source note does not itself claim a passed test or installation.
