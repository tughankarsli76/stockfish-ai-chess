# Obsidian 16.0 iOS integration

Upstream: https://github.com/gab8192/Obsidian/tree/v16.0 (GPL-3.0).
Official network: https://github.com/gab8192/Obsidian-nets/releases/download/nets/net87perm.bin
SHA-256: 26cc34cc2f8df06d2c0c0cc0c2fade6cd354326c5c73e363fa6284d3e3362b16

The network is embedded into the binary for completely offline play.

## Adaptations

- C++ declarations are enclosed in Obsidian namespace to isolate this engine from the others. Its Fathom symbols have an obsidian_ prefix.
- Intel AVX2 operations use SIMDe 0.8.2 explicit APIs on ARM (https://github.com/simd-everywhere/simde/tree/v0.8.2, MIT). The original 256-bit lane layout, weight permutation, search and evaluation formulas are retained. The variable-count shift uses the equivalent sll operation.
- Aligned allocations use posix_memalign/free on Apple platforms.
- UCI command dispatch is extracted from the stdin loop for the in-process host. Stop joins all search work; teardown joins workers and frees the transposition table. Immutable initialized tables/network stay available for engine switching.
- ObsidianBackend.cpp initializes the upstream engine and applies a 32MB hash default. Native transport serializes commands and engine replacement.
- MultiPV works; adjustable skill and WDL are not offered by this release. Unsupported transport options are ignored, and full-strength play is indicated in Options.
- Minimizing suspends search through the same app lifecycle path as the other engines.

## Build

Keep engine/Obsidian-16.0 and engine/simde-0.8.2 alongside the other engines. Restore the network above when building from the bundled source copy.
Run `python3 ios/generate-project.py`, then build ios/StockfishChess.xcodeproj for arm64 iOS 17+ or the arm64 simulator. The generator preserves existing signing settings and sets OBSIDIAN_IOS for these sources only.
The app bundle contains modified source, license, SIMDe headers and integration/build scripts under Licenses.
