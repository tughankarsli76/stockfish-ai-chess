# Stockfish 19 with live progress

Based on the bundled official sf_19 source. Evaluation and move selection are unchanged.

Changes:
- src/search.cpp emits `info nodes <actual total>` from the existing once-per-second timer, without stopping or restarting search.
- src/nnue/simd.h uses the MSVC AVX-VNNI intrinsic for the same operation, avoiding the AVX-512 encoding.

The original official universal binary remains in ../stockfish-19/stockfish.
This local Windows x64 build targets AVX-VNNI/BMI2; it is not an iOS binary or a universal Windows distribution.
The original embedded NNUE was exported unchanged as nn-1a298aa575a0.nnue and must accompany the executable.

Build: `python build.py` with the configured Visual Studio Build Tools 2026 installation. Source and compile.rsp are included.
Verify: `python verify-progress.py`.

Validation: 51-position `bench 16 1 8 default depth` returned 170203 nodes for both original and patched builds. A 10-second search of the reported custom position produced 10 increasing node reports approximately one second apart.

License: GNU GPL v3 or later, see Copying.txt and AUTHORS.


## In-process iOS host

The iOS integration adds `UCIEngine::command()` and `stop_and_wait()` to the UCI wrapper. The original command-line loop uses the same parser, while the native host serializes commands and joins the search before changing sessions. See `../../ios/README.md` and the complete integration source under `../../ios/StockfishChess/`.
