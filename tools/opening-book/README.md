# Offline opening book builder

The app embeds a filtered book derived from January–November 2025 Lichess Elite
games at https://database.nikonoel.fr/ (CC0). The exact download URLs, byte counts,
SHA-256 hashes, output counts and filter settings are recorded in
`dist/assets/ELITE-BOOK-SOURCE.json`. The large source ZIPs and intermediate files
live in `release/book-work/` and are not bundled in the app.

The C++ parser uses Disservin's MIT-licensed chess-library; its header and license
are in `vendor/`. The app does not link this build-time library.

## Build

From the repository root, place the eleven monthly ZIPs and a `downloads.json`
manifest in `release/book-work/`, then run:

```sh
clang++ -std=c++17 -O3 tools/opening-book/aggregate.cpp -o release/book-work/aggregate
python3 -u tools/opening-book/aggregate.py > release/book-work/aggregate.log 2>&1
python3 -u tools/opening-book/screen.py > release/book-work/screen.log 2>&1
python3 tools/opening-book/package.py
```

Screening uses the local Stockfish 19 executable at
`engine/stockfish-progress/src/stockfish` with its adjacent neural networks.
It runs three single-threaded workers and saves resumable JSONL checkpoints.
Use a fresh checkpoint when changing inputs or screening settings. Packaging
refuses incomplete or duplicate screening results. Review and test the staged
files before copying them to `dist/elite-book-data.js` and
`dist/assets/ELITE-BOOK-SOURCE.json`.

Packaging uses Node.js and the app's chess rules to normalize en-passant keys
(pass `--node /path/to/node` if necessary). A pinned pawn cannot capture en
passant, so that target square must not appear in the lookup key. If equivalent
keys collide, packaging prefers the already canonical record and does not add
their game counts together.
Repeated engine PV entries are also deduplicated by move, so a node-limited
engine update cannot multiply an observed move's weight.

## Filtering

Only finished standard games from the usual starting position qualify: both
players rated at least 2300, at least one rated 2500, excluding bullet. Games
are deduplicated by source URL. Illegal moves in the first 40 plies reject a
game. A position contributes at most once per game.

The first aggregation pass uses a count-min sketch to identify recurring
positions without storing every rare position. The second pass counts these
exactly. The sketch can overestimate, but final exact thresholds remove false
positives: at least 12 games per position, 8 per move, 1% move share and 35%
score for the moving side (wins plus half draws).

Stockfish evaluates up to three alternatives. Retained moves must also occur
in the eligible game data, score within 60 centipawns of its best move and at
least -100 centipawns from the moving side's perspective. If its best result
is a winning mate, only winning mates qualify. Evaluations use one common
depth per position and require at least depth 6. Search limits are depth 10 /
12,000 nodes, increased to depth 14 / 150,000 nodes at positions supported by
at least 1,000 games; the first reached limit ends the search.

This is finite screening, not a guarantee of optimal play. Positions without
a retained move fall back to the app's normal engine search. Book percentages
describe relative observed counts among the retained moves, not win chances.
Engine search history and platform can affect which equally strong moves
survive; metadata records the engine executable hash and limits.
