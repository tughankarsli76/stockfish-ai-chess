# Karsli 1.0 development experiment

Karsli is derived from Stockfish 19, itself derived from Glaurung 2.1.
The original Stockfish copyright headers and complete upstream `source/AUTHORS`
are retained. Revision 7 retains the revision-4 combination of GPLv3 Stockfish components with AGPLv3
Reckless-derived adaptations under section 13 of both licenses. The original
components retain their existing grants; the AGPLv3 requirements apply to
the combination. See `LICENSE`, `source/Copying.txt`,
`source/Copying-AGPL.txt` and `licenses/Reckless-0.9.0-AGPL-3.0.txt`.
Original upstream grants, including
Stockfish's and Clover's GPL-3.0-or-later notices, remain intact.

The quiet-check late-move-reduction experiment is inspired by Clover 9.1,
authored by Luca Metehau. Its pinned source is commit
`e647926a8f23b6b93f7f27c01cb6f686909ec482`, specifically `src/search.h`
(checking-move reduction adjustment) and `src/params.h` (1024-point reduction
scale). Clover's GPL notice is retained in `licenses/Clover-GPL-3.0.txt`.
Karsli uses a narrower, independently adapted expression and a smaller initial
bonus. Clover's board representation, search implementation and neural network
are not imported.

The depth-dependent deeper re-search experiment adapts an idea from
PlentyChess 7.0.0 by Yoshie2000 and contributors, exact tag `b-v7.0.0`,
commit `e2060ab4b3021babb7d74af3cbe908154c03b2fd`, `src/search.cpp:1100`
and parameter declarations at lines 162–164. Its GPLv3 license text is
retained in `licenses/PlentyChess-7.0.0-GPL-3.0.txt`. The adaptation retains
Stockfish's own base margin of 53, integer search depths and existing
one-ply adjustment. It does not import PlentyChess's tuned base margin,
fractional extension weights, re-search-skip rule, runtime or network.

Revision 5 adds two independently switchable PlentyChess 7.0.0 adaptations:
material-threat guarding of the improving discount in reverse futility pruning
(`src/board.h:100`, `src/search.cpp:787`) and bounded protection of important
captures (`src/search.cpp:1055–1086`). The exact commit and GPLv3 license above
also apply to these additions. `source/src/karsli_plenty.h` records their
provenance. Both default off pending strength evidence. Karsli retains its
existing RFP formula and admits only actual, non-losing-SEE PV/TT-PV captures
for the additional LMR term. Overlapping recapture bonuses use their maximum,
not their sum. PlentyChess's fractional-depth model, tuned tables and NNUE
weights are not ported. Exact revision-4 source, tools and test artifacts
are retained in `snapshots/reckless-v4/`.

The bounded alpha-raise LMR experiment adapts an idea from Pawnocchio
2.0.1, official tag `v2.0.1`, by Jonathan Hallström (2025).
`src/Searcher.zig` lines 1105, 1372 and 1516 define the per-node counter,
reduction term and non-cutoff increment. Its GPL-3.0-or-later source grant
and complete license text are retained in
`licenses/Pawnocchio-2.0.1-GPL-3.0.txt`; source hashes are in `UPSTREAM.json`.
Karsli uses a smaller independent coefficient, bounds the count and total
bonus, and leaves zero/negative reductions intact. Pawnocchio's factorized
LMR model, tuned coefficient, runtime, NNUE and artwork are not imported.

Revision 6 adds two bounded Pawnocchio 2.0.1 search adaptations at commit
`2903efa6652d1b00d0bdd2fb5983ba35165e9282`: our lower-value attack targets
increase the existing razoring margin (`src/Searcher.zig:939`,
`src/Board.zig:810`), and undefended quiet-pawn escapes receive a symmetric
ordering adjustment (`src/MovePicker.zig:199`, `:318`). Both default off.
The GPL-3.0-or-later grant and attribution are recorded in
`source/src/karsli_pawnocchio.h`; the existing full license matches the
official pinned source. The lower-value target-mask helper is reused from
the earlier Plenty adaptation with its credit retained. The adaptations
retain Stockfish's own attack occupancy, score units and pruning semantics.
Verified Pawnocchio source files and original third-party notices are under
`reports/pawnocchio-2.0.1-deep-review/`. The pre-integration revision-5
source, tools and records are retained in `snapshots/plenty-v5/`.

Revision 7 adds an independently written margin-aware quiet-LMP experiment,
motivated by Adam Twiss's public Coda 0.9.4 release description, tag
`v0.9.4`, commit `6531e16a36a47cdf0a7781112205c7cac7b97199`.
No Coda implementation, formula, parameter table, network or runtime is
copied or linked. `source/src/karsli_coda_idea.h` extends Stockfish's own
move-count threshold using a locally designed alpha proximity band and
two-slot cap, under GPL-3.0-or-later. The earlier project exclusion of
direct Coda code/weights is preserved. The documentation-based comparison
and independently verified source records are under
`reports/coda-0.9.4-review/` and `reports/coda-idea/`. Exact revision-6
source/tools/records are retained in `snapshots/pawnocchio-v6/`.

The eight Reckless-inspired search and time-management groups were added
on 11 October 2026 at the owner's explicit request. They derive from official
Reckless 0.9.0, tag `v0.9.0`, commit
`0e92358f5acd66e5ac77b1bf558202e47c515435`, by codedeliveryservice and
contributors, released under AGPLv3. Verified original sources and hashes
are retained under `reports/reckless-0.9.0-deep-review/`. The C++ integration
is separately configurable and bounded; it is not a complete port of Reckless.
The header `source/src/karsli_reckless.h` and modified search/history/thread
files identify the AGPL-derived additions. Reckless's network, evaluator,
training pipeline and Rust runtime are not imported. New validation code
is identified with an AGPLv3 SPDX notice. The preserved revision-3 snapshot
predates this integration and retains its recorded GPL-only combination.

The unchanged Stockfish 19 neural network is
`nn-1a298aa575a0.nnue`, SHA-256
`1a298aa575a085434d29027978dc36867fe9c5bcea9376654b7a8eba1e52dfc2`.
Stockfish acknowledges neural networks trained on Leela Chess Zero data,
available under the Open Database License. That upstream acknowledgment
is retained in `source/README.md`.

Embedded upstream third-party notices, including incbin and Syzygy, remain
in their original source files. No other engine's network is combined here.
The test tools use the app's chess.js rules library under its retained BSD
notice at `dist/vendor/chess-LICENSE.txt`.

This development snapshot is local. It has not been published or added to
the iOS app. A future binary distribution must include the complete
corresponding source, build instructions, licenses and notices. The pinned
input checksums are recorded in `UPSTREAM.json`.

## Revision 8: Cinder, Obsidian and Alexandria code-only adaptations

Cinder 0.6.1 commit f5d8b06701b059561e70bfb5dfbc98f65d910131 (Bruno Dutra) inspired a bounded one-ply transition correction table, learned with existing Stockfish update rules. Obsidian 16 commit 2838ce52c1a3f997cb1175b360cd8c6b2ae6791c (Gabriele Lombardo) inspired a narrower shallow first-quiet bonus gate; its original Ethereal credit is retained. Alexandria 9 commit f65f76c4e25e03602bf7512b726dace67c01a07d (PGG106 and contributors) inspired relative correction protection for quiet LMR. The local implementation uses only learned-correction magnitude and a denominator floor, not Alexandria's full raw-versus-adjusted evaluation or tuned threshold. Original licenses are retained in licenses/; exact selected source files are captured with Git blob verification under reports/first10-blend/review/. No network, training data, foreign tuned parameter table or third-party engine library was imported. New code-only adaptations are GPL-3.0-only; original Stockfish GPL grants and prior Reckless AGPL obligations remain. All three experiments are off by default.

## Revision 9 — remaining-orange selected adaptations (2026-10-11)

Hobbes 3.0, Dan Kelsey (MIT), commit 6852abc0dd816c1bdc3cec23168db2c551a75148: complementary capture from/to history concept from src/search/history.rs. Retain licenses/Hobbes-3.0-MIT.txt, including Copyright (c) 2025 Dan Kelsey. Local worker-only 2×64×64 StatsEntry table, bound 8192, update clamp 2048, additive weight 0..256. Read only actual captures in main/qsearch CAPTURES scoring; positive/negative training only existing main-search capture-history updates. No additional training from TT shortcuts, evasions or ProbCut. Promotions without capture do not train/read. Disabled by default; clear on new game. No Hobbes tuned coefficients copied.

Halogen 16, Kieren Pearson and contributors (GPLv3), commit fa6d24a5423a20b4530723cd0f6f76d4da0581d8: active lesser-piece material-threat RFP margin concept from src/search/search.cpp:976–985. Retain licenses/Halogen-16-GPL-3.0.txt. Local extra margin 0..64 internal units reuses the already-attributed Plenty geometric target detector and is distinct from Plenty's improving-only margin discount suppression. Does not change existing RFP eligibility or force a full search; other pruning remains eligible. Disabled by default. No foreign tuned coefficients copied.

The remaining source comparisons are decisions, not claims that each engine supplied new code. Their networks, datasets, tuning vectors and complete search implementations are not imported. Source versions and focused inspected sections are recorded in reports/remaining-orange. Combined GPLv3/AGPLv3 status remains as described above.
