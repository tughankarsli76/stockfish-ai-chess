# Stockfish AI Chess for iPhone

This Xcode project embeds the existing chess interface in WKWebView and runs ten bundled native chess engines inside the app. The board, piece sets, menus, opening book, analysis, game clocks, saved games, PGN review, and position editor use the same web modules as the Mac preview.

## Open and run

Open `StockfishChess.xcodeproj`, select the **StockfishChess** scheme and an iPhone simulator, then choose Run. No Apple account is needed for the simulator.

- Temporary bundle identifier: `org.example.stockfishaichess`.
- Signing: current local development settings are preserved by the generator. Configure the owner's account and permanent identifier for distribution; no signing credentials are included in the private source candidate.
- Minimum iOS deployment target: 17.0. The current Mac build uses Xcode 27.0 and the iOS 27.0 simulator.
- Architectures: arm64 for iPhone/iPad and Apple Silicon simulators.

From this repository's root:

```sh
xcodebuild -project ios/StockfishChess.xcodeproj -scheme StockfishChess \
  -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath ios/build CODE_SIGNING_ALLOWED=NO build

xcodebuild -project ios/StockfishChess.xcodeproj -scheme StockfishChess \
  -destination 'platform=iOS Simulator,name=iPhone 18 Pro' \
  -derivedDataPath ios/build CODE_SIGNING_ALLOWED=NO test

xcodebuild -project ios/StockfishChess.xcodeproj -scheme StockfishChess \
  -configuration Release -sdk iphoneos -destination 'generic/platform=iOS' \
  -derivedDataPath ios/device-build CODE_SIGNING_ALLOWED=NO build
```

The generated project is checked into this handoff. `python3 ios/generate-project.py` regenerates it without third-party dependencies. Edit that generator if changing build settings, targets, or resource membership; regeneration overwrites the project and Info.plist. It also copies the approved icon and launch assets from `dist/assets/branding`.

## Native integration

- `chess://app/` serves bundled assets through `WKURLSchemeHandler`. No localhost server, subprocess, remote engine, or network model download is used.
- `SFEngine.mm` serializes one active native engine connection. Native search workers run off the main thread and output reaches the active JavaScript transport. Session identifiers discard output from old connections. Stockfish 18 is no longer compiled, bundled, or offered; stored selections fall back to Stockfish 19 and obsolete matches preserve their position for manual play.
- Stockfish exposes `UCIEngine::command()` and `stop_and_wait()`. Each other engine's IOS-NOTES.md documents native entry points, namespace isolation, cancellation and any ARM64 portability changes.
- The included `nn-1a298aa575a0.nnue` is a bundle resource. `NNUE_EMBEDDING_OFF` avoids linking a second copy into the executable.
- Phone defaults are two engine threads and 150 MB hash; the interface detects the device CPU core count and offers 1 through the detected core count, without an arbitrary cap, and detects physical RAM for Hash options. The Hash budget is one quarter of device RAM rounded down to a power of two (16 MB minimum; 16384 MB engine ceiling). The screen lists detected RAM and the selectable Hash limit. This is an app budget, not a claim about the live iOS memory limit. Saved thread and Hash values are clamped to the current device limits; valid choices are retained.
- Native lifecycle notifications checkpoint game state. Ordinary play/analysis retains finite UIKit search continuation and delivers completed moves once on return. As of version 1.3 on October 8, 2026, engine matches and tournaments pause whenever the app becomes inactive or the phone locks. A native checkpoint freezes the position and clocks even if WebKit drops its lifecycle event. Returning restores the paused game with a Resume Match button. The app no longer submits BGContinuedProcessingTask requests for matches, so new matches do not create the system Engine Match / Playing move status activity. A terminated WebView reloads from durable native storage.
- Existing autosaves, saved games, reset recovery, usernames, and favorites are mirrored into app-local native preferences. Existing Mac browser data is separate; import PGN to transfer games.
- PGN export and saved-game export use `UIActivityViewController`; Choose File uses the iOS document picker. Clipboard actions use `UIPasteboard`.
- Chess.com and Lichess imports use cancellable HTTPS URLSession requests restricted to those services' public chess API paths. Internet imports require connectivity; gameplay, analysis, and the opening book work offline.
- The safe-area layout avoids the status bar/home indicator and follows keyboard appearance. Existing responsive portrait and landscape styles are retained.

## Verification and remaining device work

See `test-results/VERIFICATION.md` and `../release/reports/version-1.1-development-update.json` for recorded results. The XCTest suite exercises the real bundled WebView and native engines; the UI test checks native presentation and lifecycle. Device checks use the separate CoreScaling app with `benchmarks/CoreScaling.xcconfig`. Tests reset their own game state; use isolated storage and do not run them over a game you want to keep.

On 7 October 2026, all ten native engines passed the physical iPhone and simulator analysis, match and cancellation checks. The final Stockfish 18 migration test preserved the saved position, PGN, username and resource settings. A physical UI test kept an engine match running after Home for 65 seconds, with 28 legal recorded plies on return. Physical screen lock, long-duration battery/heat behavior and a fresh extracted-source build were not tested in this run.

Simulator validation cannot establish real iPhone battery use, heat, physical tap comfort, or airplane-mode behavior on hardware. After configuring the owner's signing account, verify those on the intended iPhone, including calls/interruptions, long analysis sessions, background recovery, native clipboard permissions, and PGN document providers.

App Store publication is a separate step: owner signing, support/privacy details, screenshots, age rating, and distribution review remain. The app does not claim to be an official Stockfish project.

## Source and notices

Preserve Stockfish's GPL notices, the complete modified source, neural network, and corresponding build instructions. Engine source is in `../engine/stockfish-progress/src/`; original notices are in `../engine/stockfish-19/stockfish/`. Native integration source is here. The bundle includes engine notices/source and native integration source under `Licenses`, while the private source candidate still requires a clean rebuild and distribution review. Web-asset notices remain under `dist/assets` and `dist/vendor`.

## Installed engines (7 October 2026)

The iPhone app bundles the ten native engines listed below and their required networks. Stockfish 19 remains the default. Choose the active play/analysis engine in Options → Change Engine. The choice is saved; switching clears previous engine evaluations and stops the previous search. The active search can continue while iOS grants background execution time. Engine-versus-engine matches are available as described below.

Stockfish 18 is retained only in historical development records. Version 1.1 builds and source candidates exclude it. The app loads one native engine at a time; switching stops the previous search and releases its search resources.

The project generator now preserves existing build/signing settings rather than clearing the owner's selected team when regenerating.

## Version 2.1 interface

Options → Animations, directly below Game Review, controls only the samurai
celebration. It defaults to on and is saved between launches. Decisive results
in human and computer matches use the same scene, including wins on time.
Turning it off does not change piece motion, menu transitions or confetti.
Tournaments wait for the active result celebration before starting the next game.

The Analysis screen includes a horizontal White/Black evaluation bar beneath
Positions. It follows the best engine line from White's perspective and clears
when a new position has not yet been evaluated. It is separate from WDL.
Options → Study → Chess News, below Computer Chess Rankings, opens World Chess news.

## Classical & Legendary Games

Options → Study → Classical & Legendary Games opens an offline collection of 150
historical games spanning 1475–2026, including the Immortal Game, the Opera Game,
both landmark Deep Blue–Kasparov games, and games by Kasparov, Karpov, Tal,
Carlsen, Fischer, Anand, Capablanca and other legends. Search by player,
title or year, or filter by era. Each entry has its complete move score, a short
historical introduction and source links. See `../docs/HISTORICAL-GAMES-SOURCES.md`
for provenance and qualifications. Version 1.8 adds 24 human–computer games,
20 tournament games from 2025–2026, and six AlphaZero–Stockfish 8 research games
from 2018. The Human vs computer and Engine vs engine filters keep those match
types separately accessible.

Analyze this game opens the full game in the existing Analysis screen, saving the
previous game's notation and clock snapshot first. An active tournament must be
finished or stopped before switching its main board to historical analysis;
the collection can still be browsed while a tournament is paused.

## Engine matches

The Analysis screen has dedicated Back and Forward arrows below WDL, anchored
above the bottom toolbar. They step through the saved move history without
discarding later moves and disable at the first/latest position. Reviewing an
active engine match pauses it; returning to the latest move keeps it paused
until Resume is chosen. The arrows remain available when WDL is switched off.
The entire arrow row suppresses double-tap zoom, including taps on disabled arrows
at either end of the game.

Game → New Game → Engine Match lets you choose installed engines independently for White and Black, then choose Time per move or Time per game. Both sides use full engine strength. With Opening Book enabled, both sides wait a fixed 1.5 seconds for book moves after the preceding move animation, independent of the selected thinking time, then use timed engine searches after leaving the book. Opening Book Variety still controls book selection. The Game menu provides Resume/Pause and Stop. Switching between Game and Analysis preserves the live match search and move budget; the shared board, analysis lines and clocks follow each turn. Clicking Analysis again returns to Game without pausing. Opening a menu or reviewing moves pauses a match; Resume returns to the latest position. Stop preserves the position for manual play. Saving/exporting uses the selected engines as PGN player names. Matches restored after reopening the app start paused. Change Engine remains the single-engine selector for ordinary play/analysis.

## Reckless 0.9.0

The offline iPhone app also includes Reckless 0.9.0. Select it in Options → Engine
→ Change Engine, or as either side in Game → New Game → Engine Match. Stockfish 19 remains available. Reckless plays at full strength, uses the
selected time limit, and supports multiple analysis lines; it does not supply WDL
percentages or adjustable skill levels. The active search can continue while iOS grants background execution time.

Xcode builds the ARM64 Rust static library for the active SDK before linking.
See `../engine/reckless-0.9.0/IOS-NOTES.md` for source, model checksum, local Rust
toolchain setup, changes and reproducible offline build instructions.

## PlentyChess 8.0.0

PlentyChess 8.0.0 is available offline in Change Engine and both Engine Match
selectors. It runs at full strength with the selected time control and supports
multiple analysis lines. Stockfish and Reckless remain available. Background continuation follows the lifecycle behavior above. The main screen has no engine loading messages.

Source, official neural network checksums, ARM network processing and integration
changes are documented in `../engine/plentychess-8.0.0/IOS-NOTES.md`. Prepare the
processed network as documented before a fresh Xcode build.

## Pawnocchio 2.0.1

Pawnocchio 2.0.1 is available offline in Change Engine and both Engine Match
selectors. It runs at full strength, supports WDL, and supplies one analysis line
(upstream 2.0.1 does not support MultiPV). Other engines retain multiple lines.
Zig 0.16.0 and caches are project-local. See
`../engine/pawnocchio-2.0.1-src/IOS-NOTES.md` for the pinned neural network,
checksums, changes, and device/simulator build instructions.

## Fresh source setup

The current source tree contains all ten modified engine sources, model inputs, web assets, tests and project generator. It excludes signing credentials, compiled engine libraries, Xcode output, and downloaded toolchains/caches. Before building on another ARM64 Mac:

1. Install Xcode and its iOS SDK, plus Python 3. Install Node.js to run the web tests.
2. Install Rust nightly-2026-08-16 with both Apple iOS ARM64 targets into the project-local `ios/rust-toolchain` paths. The combined Rust host uses vendored locked dependencies; see `../engine/ios-rust-engines/README.md`.
3. Install the official Zig 0.16.0 ARM64 macOS distribution at `ios/zig-toolchain`.
4. Follow PlentyChess IOS-NOTES.md to regenerate its processed network if absent, and verify the model hashes in each engine's IOS-NOTES.md.
5. Run `python3 ios/generate-project.py`, then use the simulator build command above. Choose a simulator available on the destination Mac. Configure owner signing separately for physical devices.

Obsidian 16.0 is the sixth engine; its model provenance, SIMDe port and modifications are documented in `../engine/Obsidian-16.0/IOS-NOTES.md`. A fresh extracted-source Release simulator build succeeded on this Mac on September 22, 2026, using the already installed Rust/Zig toolchains and cached Cargo dependencies. The engine libraries and Xcode products were compiled in fresh directories. Fresh-machine toolchain installation and dependency acquisition have not yet been validated.

### Offline endgame tablebases

Stockfish 19 automatically uses the bundled complete 3- and 4-piece
Syzygy set (70 WDL/DTZ files, 4,346,080 bytes). Piece counts include both kings.
No network access or folder selection is required on iOS. Other native engines
retain their existing tablebase support limitations. Restore the pinned data
with `python3 tools/download-tablebases.py`; the iOS bundle script checks every
SHA-256 before packaging. See `tablebases/syzygy-3-4/README.md` for provenance.

### CPU core breakdown

Threads shows total CPU cores and the performance/efficiency split when available. Uses documented hw.nperflevels and hw.perflevelN.physicalcpu_max sysctls; accepts two positive counts only when their sum matches processorCount. Explicit Apple-specification fallback for iPhone17 Pro/Pro Max (iPhone18,1/18,2):2 performance+4 efficiency. No model fallback in Simulator; unknown devices show unavailable rather than assuming a split. See StockfishChess/CPUCoreInfo.h.

## Ten-engine catalog in version 1.1

Retained: Stockfish 19, Reckless 0.9.0, PlentyChess 8.0.0, Pawnocchio 2.0.1 and Obsidian 16.0. Added: Cinder 0.6.1, Viridithas 20.0.0, Halogen 16.0.0, Clover 9.1 and Starzix 6.1. The new engine versions are pinned in UPSTREAM.json files; model hashes and modifications are recorded in their IOS-NOTES.md files. Code/model grants and excluded candidates are recorded in `../release/reports/ten-engine-license-audit.json`.

Analysis requests three PVs where the upstream engine supports MultiPV; the main game requests two. Pawnocchio, Cinder, Viridithas and Starzix each provide one native PV. They still support engine matches and ordinary analysis. No synthetic extra lines are generated.

Run the ten-engine integration test in the isolated CoreScaling app, with `benchmarks/CoreScaling.xcconfig`. It checks all ten identities and legal analysis, five new timed match opponents, and stopping infinite searches before switching. Run `test-viridithas-neon.sh` on an ARM64 Mac for the numerical SIMD portability check. Current test and installation evidence is recorded in the version 1.1 report.

The physical-device continued-processing test verifies a granted system task, native match progression and checkpoint restoration through a manually invoked lifecycle handoff. It does not by itself establish long screen-lock execution or OS suspension behavior. The public synchronous scheduler submission runs on a utility queue because the iOS 27.0.1 asynchronous submission API returned an NSXPC decoding error on the test phone.

The owner’s hardware side-button screen-lock test on iOS 27.0.1 confirmed that the native model took over when WebKit did not deliver its background event, and reached 18 legal plies. The system then expired the continued task about 32 seconds after grant. This is a failed screen-lock check, not evidence of long locked execution. Diagnostics are in `test-results/version-1.1-actual-lock-diagnostics.json`; The owner subsequently chose a different behavior: keep the screen awake during active play, preserve ordinary minimized continuation, and pause on intentional device lock. The updated owner side-button test passed: the match paused at ply2, the continued task completed successfully, and the saved position remained at two legal plies more than60seconds later.

During a live foreground game, the native idle timer is disabled, including while the human player chooses a move. Paused matches, finished games, move review and solo analysis release it. The protected-data lock notification pauses and checkpoints native play and ends a continued task successfully. Normal minimization retains the existing background handoff. Lock detection uses the documented protected-data lifecycle on passcode-protected devices; iOS determines notification timing. The new focused device tests and owner side-button check are recorded in `../release/reports/version-1.1-screen-awake-lock-pause.json`.

## Version 1.3 pause policy — October 8, 2026

The owner approved removing the background-match status message and pausing engine matches whenever they leave the app. This supersedes the earlier minimized-match continuation behavior and test results above. The centered Resume Match button is now smaller and positioned lower. Ordinary computer-game background search behavior remains as described above.


## Chess Coach explanations and game defaults

Bad-move feedback uses the legal before/after engine lines and board geometry to explain loose pieces, removed defenders, opened attacks, forks, unfavorable exchanges, promotions, king checks and missed mating or capture opportunities. Suggested alternatives describe their verified immediate effect when available; otherwise both analyzed continuations are compared. Recaptures and promotions count toward material, and pinned attackers are excluded from playable fork targets. Unsupported positional stories are not inferred from evaluation numbers. Successive notifications vary their phrasing and order while preserving the underlying chess facts. Coach searches and the 20-second advice lifetime are unchanged.

The default game mode is User Plays White against the computer, fixed time, 5 seconds per computer move. Fresh-start and Reset Everything flows use these defaults; explicitly saved mode/time preferences continue to be remembered.

## Retired Karsli app engine

Karsli is no longer selectable or linked into Stockfish AI Chess. The native catalog contains the ten retained engines. Karsli source, profile generation and engine-specific fixtures are excluded from app builds and app resources; its historical source and license notices remain in Git. New Karsli development belongs to the independent `karsli-engine` project.

Restoring ordinary play switches a saved Karsli engine preference to Stockfish 19 and discards stale engine analysis through the existing version check. An unfinished engine match using Karsli stops and preserves its PGN and clocks for manual play. An unfinished tournament containing Karsli is marked stopped, preserving completed games and results; completed tournament records are retained. The same migration runs in the headless background model and reset recovery. Archived PGN player names are not rewritten.

The checked-in Xcode source references and the project generator exclude Karsli. Xcode Cloud regenerates the project and performs native compilation on Apple hardware; Linux checks cover the app model, catalog and build configuration, not a native iOS compile.
