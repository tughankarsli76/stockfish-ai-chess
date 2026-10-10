# PlentyChess 8.0.0 iOS integration

Official source: https://github.com/Yoshie2000/PlentyChess/tree/b-v8.0.0
Release tag b-v8.0.0, upstream commit 50ad9f1. Preserve LICENSE (GPL-3.0),
README, complete corresponding modified source and build instructions.

## Network and reproducible processing

Upstream network.txt selects 0178r.
Download https://github.com/Yoshie2000/PlentyNetworks/releases/download/0178r/0178r.bin
into this directory as 0178r.bin.
SHA-256: 663e0531ac71c6c7c6d3bc4f1fac923bf69136f9786fa1da5c4ac25382aee54b

On this ARM64 Mac, from the project root:

    make -C engine/plentychess-8.0.0/tools arch=arm64
    engine/plentychess-8.0.0/tools/process_net false engine/plentychess-8.0.0/0178r.bin engine/plentychess-8.0.0/processed.bin

Processed network SHA-256:
5cedef19778f1bb784e181fc013543127d1fdcde227795710b1a48f6e53d79cd

Xcode compiles the native sources with -DARCH_ARM -DPLENTY_IOS for ARM64 iPhone
and simulator, embedding processed.bin using upstream INCBIN. No runtime download,
subprocess or network service. Run python3 ios/generate-project.py to regenerate
the project; existing owner signing settings are preserved.

## Integration changes

- uci.cpp adds plentyCommand, reusing upstream command dispatch without stdin.
- tt.h defers iOS hash allocation until selected, and adds release().
- thread.h adds shutdown() to stop/join workers and free their histories when
  selecting another engine. It is used by the iOS non-NUMA build only.
- nnue.cpp specifies the bundled ARM-processed network path for the iOS build.
- ios/StockfishChess/PlentyChessBackend.cpp initializes lookup/evaluation data once,
  owns the current board/history, and stops/drains search before commands/switches.
- No search logic, evaluation weights or strength tuning changes.

The app runs one native engine at a time. Existing lifecycle suspension applies.
PlentyChess offers Threads, Hash, MultiPV and timed/infinite UCI searches, but no
Stockfish Skill Level or UCI_ShowWDL options: those are skipped, difficulty shows
Full strength, and the UI does not invent WDL percentages. Syzygy code is compiled
from included Fathom source but disabled; no tablebase files are bundled.
