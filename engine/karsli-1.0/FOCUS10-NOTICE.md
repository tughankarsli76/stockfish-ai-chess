# Selected ten-engine blend

The existing Stockfish GPL and Reckless AGPL combination and all prior component
grants remain in force. No foreign network, training data or runtime is included.
Current source pin/decision evidence is retained in the repository under
experiments/karsli/reports/focus10. The native revision-9 default profile remains
unchanged; the new three controls default off.

New local code in src/karsli_focus10.h and corresponding search.cpp additions:

- PlentyChess 7, Yoshie2000 and contributors, GPLv3, commit
  e2060ab4b3021babb7d74af3cbe908154c03b2fd: major-piece-pattern correction concept
  from src/history.cpp and src/board.cpp. Local six-bitboard hash, bounded
  worker-private Stats table and existing Stockfish update admission/clamps.
  PlentyChess's Zobrist table and tuned coefficients are not copied.
- Alexandria 9, PGG106 and contributors, GPLv3, commit
  f65f76c4e25e03602bf7512b726dace67c01a07d: raw/adjusted-evaluation complexity LMR
  concept from src/search.cpp. Local denominator floor, bounded gain, and maximum
  of overlapping protections; no copied tuned threshold or one-ply table.
- Stormphrax 8, Ciekce and contributors, GPLv3, commit
  582965517ed2032d41a6b4cd6c2e66b1b934e2ad: shallow TT lower-bound extension concept
  from src/search.cpp. Local quiet-only one-ply variant with nominal-depth budget,
  and no stacking on regular singular or recapture extension paths. Original
  GPL text is retained in licenses/Stormphrax-8.0-GPL-3.0.txt.

The additions are GPL-3.0-only; the combined engine retains its AGPL obligations.
Prior Reckless, Pawnocchio, Cinder, Obsidian/Ethereal and Hobbes adaptations and
their exact credits/grants remain in NOTICE.md and licenses/.

Coda stays documentation/independent-idea only, consistent with the recorded
project exclusion. Integral's selected public snapshot has no identified reuse
grant; its code/weights are not included. General NNUE, threat, correction and
alpha-beta concepts are matched to existing implementations and the separately
licensed PlentyChess major-pattern concept, not represented as copied Integral
code or a port of its network architecture.

A consecutive-null safety bug exposed by Reckless SMP sanitizer validation was
fixed by rejecting a previous Move::null before the existing NMP assertion.
The assertion is retained; no verification or test was disabled. Initial failure
and final evidence are separate in the focus10 report.
