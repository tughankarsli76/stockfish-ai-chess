# Karsli 1.0-dev: experiment results

## Revision 9: screenshot-ordered orange review through Horsie

All 23 review/selection decisions are complete: 21 focused implementation comparisons and public-document-only Coda/Integral reviews. Five selected adaptations across revisions 8–9 supplement existing Karsli: Cinder transition correction, Obsidian shallow history suppression, Alexandria relative learned-correction LMR, Hobbes capture-route history, Halogen material-threat RFP margin. Each new option defaults off. The [explicit combined profile](reports/full-orange/combined-profile.json) was used for material tests and revision-9 matches. No direct material-balance evaluation bonus or new network was added. Current Apple Silicon executable: `build/karsli-orange`.

| Revision-9 evidence | Result |
| --- | --- |
| Optimized validation | 22/22 passed |
| ASan and UBSan validation | 22/22 passed; no runtime sanitizer diagnostics |
| Revision-8 regression with new two options off | 19/19 passed |
| Full-profile material/clock suite | 20/20 passed, including seven material/stalemate fixtures per engine and 1/3/5-minute clocks for individual searches |
| Full-profile sanitized material suite | 14/14 passed |
| Boundary helpers | Existing and five new helpers passed |

The 1/3/5-minute checks are individual real-clock searches, not complete games at those time controls. One initial test-harness timeout interrupted the baseline's valid 53-second search; the timeout was corrected to the allocated clock plus five seconds, and the final suite passed. The initial record is retained separately. Perft, special moves, legal PVs, MultiPV, four workers, stop/reset/reuse, isolated feature activation and disabled-profile equivalence passed. Diagnostic counts represent search events, not material gains.

## Revision 8: first ten displayed ranks, excluding Torch

Nine orange entries through Alexandria were compared. Three selected adaptations were added, then normal 19/19, sanitizer 19/19 and previous-Coda regression 17/17 passed. Revision 8 is preserved in `snapshots/first10-v8` and `build/karsli-first10`. Reviews and detailed evidence: [first-ten report](reports/first10-blend/ANALIZ.md).

## Exploratory paired matches for revisions 8–9

All series used one worker, 64 MB hash, the unchanged network, eight two-color opening pairs, 5 seconds initial time plus 50 ms per move, and natural rules-based endings. The 32-game series repeated the eight opening pairs twice. No heavy builds/tests ran concurrently. Wall-clock time was charged before the increment. No score-based adjudication was applied.

| Candidate / reference | Games | Candidate wins / losses / draws | Record |
| --- | --- | --- | --- |
| Rev8 → Stockfish 19 | 32 | 0 / 1 / 31 | [JSON](reports/first10-blend/combined-vs-stockfish.json), [PGN](reports/first10-blend/combined-vs-stockfish.pgn) |
| Rev8 → rev7 Karsli | 16 | 1 / 0 / 15 | [JSON](reports/first10-blend/combined-vs-revision7.json), [PGN](reports/first10-blend/combined-vs-revision7.pgn) |
| Rev9 → Stockfish 19 | 32 | 2 / 0 / 30 | [JSON](reports/full-orange/combined-vs-stockfish.json), [PGN](reports/full-orange/combined-vs-stockfish.pgn) |
| Rev9 → rev8 Karsli | 16 | 2 / 0 / 14 | [JSON](reports/full-orange/combined-vs-first10.json), [PGN](reports/full-orange/combined-vs-first10.pgn) |

All 96 games completed without truncation or time forfeits. Binary/profile hashes, clocks, move lists and PGNs are saved. Independent legal replay and source/report/binary correspondence are recorded in [artifact-audit.json](reports/full-orange/artifact-audit.json). Small decisive counts and repeated openings do not establish an Elo gain, superiority to Stockfish, or strength at 1–20-minute controls. Individual additions have not been isolated in strength matches; new defaults remain off.

Detailed Turkish [combined report](reports/full-orange/ANALIZ.md), [engine decisions](reports/full-orange/ENGINE-MATRIX.md), [source manifest](reports/full-orange/corresponding-source-manifest.json), and per-engine reports explain scope, reuse decisions, bounds and limitations. Normal binary SHA-256: `6441f59222f148b49c1e952b24a2e17e8c5a5bbf86cc108ca43243f094dabef9`; sanitized SHA-256: `2df2dbe8ec5b5d20a33448cce570232f96516ea615aae1b143bb2008e575bd27`. Historical sources/binaries were preserved. The iOS application is unchanged.

## Revision 7 Coda public review and independent experiment

Coda 0.9.4 public documentation review is complete, pinned to commit
`6531e16a36a47cdf0a7781112205c7cac7b97199`. Six documentation/license
files were captured and checked against Git blob IDs. Under the existing
project provenance restriction, no Coda implementation, formula, tuned table,
network or binary was imported or inspected. The Turkish
[review](reports/coda-0.9.4-review/ANALIZ.md) lists 18 feature groups and five
further research candidates; this is not an implementation-level source audit.

One independently designed experiment was added to Karsli revision 7:
`Karsli Coda Idea LMP Margin` (range 0–256, tested 64, default 0).
At eligible shallow non-PV nodes near alpha, it delays the existing quiet-move
skip threshold by at most two move-count slots. Other pruning still applies;
this does not guarantee two additional quiet moves are searched. No material
evaluation bonus or time-management change was added. Current executable:
`build/karsli-coda-idea`; the Stockfish network is unchanged.

| Evidence | Result |
| --- | --- |
| Optimized validation | 17/17 passed |
| AddressSanitizer and UndefinedBehaviorSanitizer | 17/17 passed, no runtime stderr diagnostics |
| Previous Pawnocchio/Plenty/Reckless regression | 19/19 passed with the new option off |
| Boundary helpers | All earlier helpers and new margin/overflow/bounded-delay checks passed |
| Paired functional match against Stockfish 19 | 8 completed games: 1 Karsli win, 1 loss, 6 draws |
| Independent PGN/rules replay | All 1159 plies in four two-color opening pairs verified |
| Artifact audit | Passed: binary/source/report correspondence, 110 current engine files, 142 snapshot files and six upstream documents |

Checks include activation, perft, both-color free-queen captures, legal PVs,
en passant, underpromotion, orthodox/Chess960 castling, mate, actual-clock
limits, MultiPV, four workers, stop/reset/reuse, maximum margin and a combined
Reckless/Plenty/Pawnocchio/Coda experiment. Normal diagnostics counted 244939
near-alpha events and 31170 delayed skip decisions; sanitized totals were
73684 and 9974. These count evaluations, not played moves or material gains.

All-zero disabled controls reproduce 147915, 158239 and 170203 depth-8
benchmark nodes for the prior profiles. Isolated margin 64 produces 183681
nodes; with Coda off and prior Reckless/Plenty/Pawnocchio controls active,
175046 nodes match revision 6. More nodes do not establish greater strength.

The eight games used four openings in both colors, one worker, 64 MB hash,
100 ms per move and the shared network. Reckless was enabled, older three
controls and Plenty/Pawnocchio additions disabled, Coda margin 64. No game
was truncated. This small functional sample cannot support an Elo claim;
the new option remains off by default. Revision 6 is preserved in
`snapshots/pawnocchio-v6/` with 142 file hashes and four historical binaries.

An initial harness-only failure queried a free-queen position after the engine
had been closed. The query was moved before cleanup and both final runs
passed. The initial record is retained separately and excluded from final
validation totals. Current records are under `reports/coda-idea/`.
The iOS application was not changed.

## Revision 6 Pawnocchio results

Pawnocchio 2.0.1 review and two opt-in adaptations are complete:
`Karsli Pawnocchio Razor Margin` (tested 128, default 0) and
`Karsli Pawnocchio Pawn Escape` (tested 256, default 0).
Current executable: `build/karsli-pawnocchio`.
The Stockfish 19 network is unchanged. The previous revision-5 source,
tools and records are preserved in `snapshots/plenty-v5/` with 138 file
hashes; four historical binary hashes were independently verified.

The official tag is pinned to commit
`2903efa6652d1b00d0bdd2fb5983ba35165e9282`.
All 99 captured non-artwork source/build/test/license files were checked
against Git blob IDs. The Turkish [source comparison](reports/pawnocchio-2.0.1-deep-review/ANALIZ.md)
contains 34 features and six further candidates.

| Evidence | Result |
| --- | --- |
| Optimized validation | 19/19 checks passed |
| AddressSanitizer and UndefinedBehaviorSanitizer validation | 19/19 checks passed; no runtime stderr diagnostics |
| Existing Plenty integration regression checks | 16/16 passed on the new binary, Pawnocchio options off |
| Boundary helpers | All earlier helpers plus pawn danger masks, score direction and all razor margin values passed |
| Paired functional match against Stockfish 19 | 8 completed games, 8 draws, no truncation or illegal moves |
| Independent PGN/rules replay | All 990 plies across four two-color opening pairs verified |
| Current artifact audit | Passed: binary/source/report correspondence, 109 engine files and 99 captured upstream files |

The active checks include both-color free-queen captures, exposed versus
defended quiet pawns, standard perft (197281 and 97862 nodes), legal PVs,
en passant, underpromotion, orthodox and Chess960 castling, forced mate,
depth/node/actual-clock limits, MultiPV, four workers, explicit stop,
maximum option values and reset/reuse. The combined test enables Reckless,
Plenty and Pawnocchio together. The exposed/defended test isolates pawn
ordering and confirms no pawn-order adjustment for the defended fixture.

Normal-validation counters totaled 3101 easy-target detections at eligible
razor nodes, 1121 prevented razor shortcuts, and 256773 nonzero pawn-order
adjustments. Sanitized totals were 1053, 327 and 83524. Counts differ in
time-limited and multithreaded searches. A pawn-order event counts a generated
move score change, not a played escape. Counters establish activation, not
playing strength.

The disabled single-thread depth-8 benchmarks match previous binaries:
147915 nodes with default quiet-check/Reckless settings; 158239 with older
three experiments zero and Reckless enabled; 170203 with all custom features
disabled, matching Stockfish. With Plenty's tested two options active,
Reckless enabled and older three zero, current and revision-5 binaries both
return 185073. Each benchmark uses 51 positions.

Isolated new-feature benchmarks, with older experiments zero and Reckless
disabled: razor margin 128 gives 176676 nodes; pawn escape 256 gives 177217;
both give 164335. These are search signatures and do not establish speed
or strength improvements.

The match used four openings with both colors, one worker, 64 MB hash,
100 ms per move, Reckless enabled, new Pawnocchio 128/256, Plenty off and the
older three experiments zero. Eight draws are a small functional comparison,
not an Elo estimate or evidence that the candidate equals/beats Stockfish.
No raw material-preference evaluation bonus was added. The new options stay
off by default pending controlled strength tests. This Mac development
binary has not been integrated into the iOS app.

Artifacts are in `reports/pawnocchio-pack/`: `build.json`, `validation.json`,
`sanitized-build.json`, `sanitized-validation.json`, `plenty-regression.json`,
`smoke-match.json/.pgn`, `artifact-audit.json`, `revision6.patch` and
`corresponding-source-manifest.json`. Compiler logs are in `build/`.
Historical results follow unchanged.

## Revision 5: PlentyChess material-search candidates — 11 October 2026

The PlentyChess 7.0.0 review is complete: 37 official files, 9,354 archived
lines, a 25-feature inventory and comparison with current Karsli. The full
Turkish review is [ANALIZ.md](reports/plentychess-7.0.0-deep-review/ANALIZ.md).
Two new bounded adaptations are implemented in `build/karsli-plenty`:

- `Karsli Plenty Threat Guard`: preserve the full improving RFP margin when
  opponent lower-value attacks target our higher-value material.
- `Karsli Plenty Capture LMR`: protect positive reductions of actual,
  non-losing-SEE PV/TT-PV captures at non-cut nodes. Tested bonus 256, range
  0–1024. Overlapping Reckless recapture protection uses the larger bonus,
  rather than the sum.

Both default off pending strength evidence. The earlier Reckless pack stays
on by default and the existing Plenty-inspired Depth Slope stays at zero.
Revision 4 source/tools/reports are preserved in `snapshots/reckless-v4/`;
all 138 captured file hashes and three preserved binaries were checked.

### Verification

- Optimized Plenty checks: **16/16 passed**.
- Separate debug + AddressSanitizer/UndefinedBehaviorSanitizer build:
  **16/16 passed**, with no runtime diagnostics.
- Previous Reckless validation on the new binary: **28/28 passed**.
- Candidate, unmodified reference and sanitizer builds emitted no warnings.
  Release candidate/reference use identical Apple clang 21 Apple Silicon
  flags and the macOS 13 deployment target. Network checksum is unchanged.
- Each feature activated independently. The optimized suite counted 65,753
  guarded material threats, 5,106 prevented original RFP cutoffs and 3,789
  extra capture-protection applications across its searches.
- Both active with Reckless passed legal PV replay, standard perft, EP,
  underpromotion, castling, Chess960 continuation, known mate, MultiPV,
  actual clocks, four workers, maximum option values and stop/reuse.
- Plenty disabled exactly reproduces the preserved revision-4 default
  147,915-node and isolated Reckless 158,239-node benchmark signatures;
  all custom search controls disabled reproduce Stockfish's 170,203 nodes.
- Isolated Plenty guard: 192,692 nodes; isolated capture bonus 256: 175,313;
  both with Reckless disabled: 187,825. Each benchmark uses 51 positions,
  one worker and depth 8. These counts show changed search, not strength
  or speed. Tablebases were unavailable for live probing checks.

### Eight-game functional comparison

Four independently selected openings, both colors, one cycle, one worker,
64 MB hash, no pondering/tablebases and 100 milliseconds per move against
Stockfish 19. Candidate used Reckless on, new threat guard on, capture bonus
256 and the three older experiments zeroed. **All eight games were draws**;
no truncations, illegal moves or crashes. Both processes exited cleanly.
Independent replay verified all eight PGNs, all **1,186 plies**, final FENs,
results, paired colors and recorded Plenty options. The artifact audit passed.

Eight drawn games do not establish equality or a strength improvement. This
is a smoke comparison; larger ablation matches and tuning under the intended
short clock controls remain necessary. The separate major-piece correction,
search-count-weighted learning and TT-based re-search skip ideas remain
reviewed next-stage candidates, not implemented claims.

Evidence: `reports/plenty-pack/build.json`, `validation.json`,
`sanitized-build.json`, `sanitized-validation.json`, `reckless-regression.json`,
`smoke-match.json`/`.pgn`, `artifact-audit.json`, `revision5.patch` and
`corresponding-source-manifest.json`. `UPSTREAM.json` and `NOTICE.md` retain
commit/license provenance. This is a local Karsli development revision.

## Revision 4: eight Reckless groups — 11 October 2026

The owner's request to implement all eight reviewed groups is complete.
`build/karsli-reckless` enables the pack by default; every group has its own
UCI control and the master switch restores revision-3 behavior. Defaults,
bounds and exact adaptations are listed in [README.md](README.md).
The optional extra PV recapture extension is implemented but defaults off.
This is an experimental combination; none of these coefficients is tuned
or established as a playing-strength improvement.

Both optimized candidate/reference builds use identical Apple clang 21,
Apple Silicon and macOS 13 deployment flags. Both emitted no compiler
warnings. A separate debug build with AddressSanitizer and UndefinedBehaviorSanitizer
also compiled without warnings. Bounds checks passed for all four sets of
helpers. The Stockfish network checksum is unchanged.

### Functional and activation evidence

- Optimized build: **28/28 checks passed**.
- Debug + address/undefined sanitizers: **28/28 checks passed**, clean exits
  and no runtime diagnostics.
- Actual default profile, retaining Check Bonus 512: legal depth-12 search
  and all 51 benchmark positions completed; **147,915 nodes**.
- The isolated new pack, with the three older experiments zeroed, completed
  all 51 benchmark positions with **158,239 nodes**. These node counts
  establish changed search, not strength or speed.
- Master disabled: all five revision-3 signatures reproduced exactly:
  unmodified 170,203; check protection 174,277; slope 2 169,474;
  alpha 128 150,612; alpha 256 183,116.
- Individual new controls all zero/false also reproduce the unmodified
  170,203-node signature.
- Each search feature was activated independently and counted. Clock tests
  exercised evaluation stability. Two- and four-worker clock searches
  exercised soft votes, completed-depth result votes and shared optimism.
- Special moves, independent legal PV replay, MultiPV, mate/stalemate,
  known mate, Chess960 castling continuation, explicit stop/reuse and maximum
  option values with four workers passed.

The sanitizer harness initially used an arbitrary three-second bound on a
60-second clock, and a short clock that could expire before a completed
iteration cast a soft-stop vote. These were test assumptions, not sanitizer
findings. Final clock checks bound elapsed time to the supplied remaining
clock and use a 16-second SMP clock with independently reset positions for
activation. The initial reports are preserved as
`sanitized-validation-initial.json` and
`sanitized-validation-clock-activation.json`; the final passing report is
`sanitized-validation.json`. Hard search deadlines and cancellation remain
in the original Stockfish time checks. Live Syzygy tablebases were unavailable.

### Paired short comparison

All 32 scheduled games finished: **0 Karsli wins, 3 Stockfish wins,
27 draws and 2 unfinished games at the 300-ply limit**. The unfinished games
are not counted as draws. Both engines used one worker, 64 MB hash,
no pondering or tablebases and 100 milliseconds per move. Eight openings
were played with both colors in two cycles. Every move was checked by
chess.js while playing; both engine processes exited cleanly. Independent saved-artifact
replay also verified all 32 PGNs, all 4,335 plies, results, paired colors
and final positions; the artifact audit passed.

This short comparison shows no strength gain and favors Stockfish in its
completed decisive games. It is a functional smoke comparison, not a
statistical Elo test, and cannot isolate which feature caused a loss.
The eight groups remain available and enabled at the owner's request;
separate controls permit later tuning and ablation. The earlier interrupted
three-game records are retained separately and excluded from these totals.
Fixed movetime and one worker do not exercise clock allocation or SMP
behavior; those are covered by the separate functional clock tests above.

### Exact evidence and reproducibility

- `reports/reckless-pack/build.json`: flags, commands, source and binary hashes.
- `reports/reckless-pack/validation.json`: optimized checks and activation counts.
- `reports/reckless-pack/sanitized-build.json` and `sanitized-validation.json`:
  debug/sanitizer build and checks.
- `reports/reckless-pack/default-profile-validation.json`: actual UCI defaults.
- `reports/reckless-pack/paired-match.json` and `.pgn`: final comparison records.
- `reports/reckless-pack/artifact-audit.json`: binary/source correspondence and
  independent complete PGN/move replay.
- `reports/reckless-pack/corresponding-source-manifest.json`: hashes for all
  current engine sources, tests, tools and retained licenses.
- `reports/reckless-pack/revision4.patch`: reviewable engine changes from the
  exact revision-3 snapshot.
- `snapshots/alpha-raise-v3/SNAPSHOT.json`: preserved old sources, tools and
  executable hashes. Every captured source/tool file was rechecked.
- `UPSTREAM.json`, `NOTICE.md`, original GPL license and retained AGPL license:
  pinned Reckless commit, attribution and combined-source notices.

The reference evaluator/network remains Stockfish's. No standalone material
preference bonus was added by these eight search adaptations. Controlled
clock matches at the intended short game durations, parameter tuning and
larger paired tests with uncertainty are still needed to establish strength.
This local Mac revision does not change the submitted iOS release.

## Resumed baseline: 11 October 2026

The owner explicitly resumed Karsli development after the 7 October pause.
Current candidate and reference binary hashes, modified engine source hashes,
and the added Karsli header match the preserved revision-3 build record.
All **18 fresh functional checks passed**, using the isolated Alpha Bonus 128
configuration. The all-disabled control still matches unchanged Stockfish's
170,203-node benchmark signature. Historical reports remain intact.

Evidence: `reports/resume-2026-10-11/validation.json`.
This revalidation establishes a working baseline; it does not add playing-strength
evidence or change experimental defaults.

## Revision 3: bounded alpha-raise reduction

Checked 7 October 2026. The current Mac executable is
`build/karsli-alpha-raise`. Earlier binaries, original source inputs and
result evidence remain preserved. The depth-slope snapshot records that
its historical test tools were reconstructed from captured pre-edit content;
original byte hashes for those tools had not been captured. Its engine
source, reports and executable hashes were preserved independently.

This experiment adapts Pawnocchio 2.0.1's count of earlier moves that raised
alpha. Karsli counts only genuine completed non-cutoff improvements, skips
artificial equal-score promotions, and saturates the per-node count at eight.
Only existing positive LMR reductions receive an added bonus, capped at
1024 fixed-point units (one ply). Existing negative/zero reductions, child
depth bounds, fail-high re-search, quiescence and time management remain intact.
Stockfish already reduces remaining node depth after some alpha improvements,
so the added signal can overlap existing selectivity.

`Karsli Alpha Bonus` accepts 0–256 and defaults to **0 (disabled)**.
The isolated setting was selected before testing: Check Bonus 0,
Depth Slope 0, Alpha Bonus 128. Pawnocchio's network and artwork are not used;
its GPL source attribution and license text are retained.

Both binaries built with identical Apple Silicon flags and macOS 13 target,
without compiler warnings. All **18 functional checks passed**, including
one/two-thread legal searches at alpha bonuses 128 and 256, special moves,
terminal positions, MultiPV, stop/reuse and independent control signatures.
The reduction-bound test covers every allowed coefficient, counter saturation,
one-ply maximum, zero control and unchanged existing extensions.

The fixed depth-8, 51-position benchmark produced:

| Candidate settings | Nodes searched |
| --- | ---: |
| Unchanged Stockfish 19 | 170,203 |
| All three experiments disabled | 170,203 |
| Original quiet-check 512 only | 174,277 |
| Previous depth-slope 2 only | 169,474 |
| New alpha bonus 128 only | 150,612 |
| New alpha bonus 256 only | 183,116 |

These are search signatures, not strength/speed scores. The controls preserve
both earlier experiments exactly, and the selected new setting changes
search. Fewer nodes at a fixed depth do not demonstrate stronger play.

**All 32 comparison games completed: 0 Karsli wins, 4 losses and 28 draws.**
The score was 14/32 for Karsli against 18/32 for Stockfish. Both engines used
one thread, 64 MB hash, 100 ms per move, no pondering and no tablebases.
Eight distinct opening prefixes were played with both candidate colors in
two cycles; repeated cycles are not additional distinct openings. There
were no truncated games, illegal moves or engine crashes.

Independent replay verified all 32 PGNs and JSON move lists, all 4,212 legal
plies (3,924 searched plies), final FENs, actual terminal outcomes, color
pairing, settings and source/network/binary hashes. Historical evidence
remained unchanged, recorded child cleanup was clean, and a focused approved
live process check found no remaining prototype engines.

**Decision: keep Alpha Bonus disabled by default.** This short comparison
did not demonstrate an improvement. It is not a statistically established
Elo loss: the sample is small, opening cycles repeat and move time is very
short. No new combination or default promotion is justified. A later
independent research candidate is Pawnocchio's individual correction-term
uncertainty; a larger match needs diverse openings, longer controls and
statistical uncertainty.

Revision 3 evidence:

- `reports/alpha-raise/build.json`: exact flags, source deltas and binary hashes.
- `reports/alpha-raise/validation.json`: all 18 checks and six benchmark signatures.
- `reports/alpha-raise/alpha-128-match.json` and `.pgn`: all comparison game records.
- `reports/alpha-raise/karsli-alpha-raise.patch`: complete delta from original Stockfish 19.
- `reports/alpha-raise/independent-review.json`: independent replay and artifact/process audit.

This remains a Mac research prototype. No iOS app integration, phone
installation or App Store submission was made for this experiment.

## Revision 2: depth-dependent deeper re-search

Checked 7 October 2026. The new Mac executable is
`build/karsli-depth-slope`; the original `build/karsli` and its evidence
remain unchanged. Exact first-prototype source and provenance are preserved
under `snapshots/quiet-check-v1`.

The second experiment adapts PlentyChess 7's depth-sensitive improvement
threshold for the extra one-ply search after reduced-search fail-high.
Karsli retains Stockfish's base 53 and all surrounding conditions, using
`53 + slope * max(0, childDepth)` in Stockfish's internal score units.
`Karsli Depth Slope` accepts 0–4 and defaults to **0 (disabled)**.
The comparison setting was chosen before testing: **Check Bonus 0,
Depth Slope 2**. No foreign network is used.

Both binaries built with the same Apple Silicon flags and macOS 13 target,
with no compiler warnings. All **16 functional checks passed**, including
legal special moves, terminal positions, MultiPV, cancellation/reuse,
two-thread slope-2 search, and legal searches at slopes 1, 2 and 4.
Bound checks cover every permitted slope and relevant child depth.

The 51-position deterministic depth-8 benchmark confirmed controls and
observable search changes:

| Candidate settings | Nodes searched |
| --- | ---: |
| Unchanged Stockfish 19 | 170,203 |
| Check Bonus 0, Depth Slope 0 | 170,203 |
| Original Check Bonus 512, Depth Slope 0 | 174,277 |
| Check Bonus 0, Depth Slope 1 | 185,736 |
| Check Bonus 0, Depth Slope 2 | 169,474 |
| Check Bonus 0, Depth Slope 4 | 164,405 |

Node totals are not strength or speed scores. A higher slope does not imply
monotonically fewer nodes because search decisions interact.

**The selected slope-2 comparison completed all 32 games:** Karsli won 1,
lost 3, and drew 28, scoring 15/32 against Stockfish's 17/32. There were
zero truncated games, illegal moves or engine crashes. Each engine had
one thread, 64 MB hash, 100 ms per move, no pondering and no tablebases.
Eight distinct opening prefixes were each played with both candidate
colors, over two cycles; repeated cycles are not additional distinct
openings. All recorded engine processes exited cleanly.

**Decision: retain this as an experimental option, disabled by default.**
This short comparison did not demonstrate an improvement. The small sample,
repeated opening set and very short move time do not establish an Elo loss
either. No combined experiment or default promotion is justified by these
results. A future independent candidate is Pawnocchio's bounded alpha-raise
counter; any larger follow-up should use more diverse paired openings and
longer time controls with statistical uncertainty.

Revision 2 evidence:

- `reports/depth-slope/build.json`: exact flags, source deltas and binary hashes.
- `reports/depth-slope/validation.json`: all 16 checks and benchmark controls.
- `reports/depth-slope/depth-slope-2-match.json` and `.pgn`: complete game records.
- `reports/depth-slope/karsli-depth-slope.patch`: complete delta from original Stockfish 19.
- `reports/depth-slope/independent-review.json`: independent replay of all
  32 PGNs and 4,392 legal plies, binary/source/network linkage, preserved
  first-prototype evidence and live process cleanup check.

No iOS app integration, phone installation or App Store submission was made
for this experiment.

## Revision 1: quiet-check first prototype

Checked 7 October 2026 on this Apple Silicon Mac. The executable is
`build/karsli`; its historical candidate source is preserved under
`snapshots/quiet-check-v1/source/`.
It is a Stockfish 19 derivative with one enabled experimental search change:
Clover-inspired protection for quiet checking moves during late-move reduction.
Captures and promotions are excluded from that adjustment.

## Functional results

- Both original-reference and candidate builds succeeded with Apple clang 21,
  identical Apple Silicon optimization flags and a macOS 13 deployment target.
  Neither final build emitted compiler warnings.
- Reduction-bound checks passed across every permitted check-bonus value.
- All 14 UCI/search checks passed: identity/options/readiness, two known perft
  positions, legal searches under depth/node/time limits, mate and stalemate,
  underpromotion/castling/en passant restrictions, three legal MultiPV lines,
  cancellation and reuse, and a two-thread search.
- With `Karsli Check Bonus=0`, the 51-position benchmark produced exactly
  the unchanged reference's 170,203-node signature. With the default 512 bonus,
  it produced 174,277 nodes. This confirms the experiment changes search;
  node counts and single benchmark timings do not establish strength or speed.

## First paired smoke match

Eight games were played from four independently selected opening prefixes,
each with colors reversed. Both engines used one thread, 64 MB hash, no
pondering, no tablebases and 50 milliseconds per move. Every move was checked
with the separate chess.js rules implementation.

All eight games completed as draws by threefold repetition. There were zero
truncations, illegal moves or engine crashes. Independent replay confirmed
all eight PGNs, all 1,052 plies, final FENs, results, paired colors and report
move arrays. Both engine processes exited cleanly.

This is a functional smoke match, not an Elo experiment. Eight draws do not
establish equality or superiority to Stockfish. Longer controlled matches,
more varied openings and statistical uncertainty are needed before calling
any experimental change an improvement.

## Evidence

- `reports/build.json`: compiler commands, source changes and binary hashes.
- `reports/validation.json`: all 14 checks and three benchmark signatures.
- `reports/smoke-match.json` and `.pgn`: full paired-game records.
- `reports/prototype-validation-review.json`: independent artifact/replay audit.
- `reports/ccrl-top30.json`: observed CCRL 40/15 list dated 2 October 2026.
- `reports/high-ranked-code-review.md` and `ccrl-source-eligibility.md`:
  initial source comparisons and code/network reuse distinctions.
- `reports/ccrl-top-four-technical.md`,
  `ccrl-cinder-obsidian-technical.md` and
  `ccrl-first10-restricted-technical.md`: completed detailed review of the
  nine orange engines among the first ten CCRL entries. Source candidates
  and publicly documented excluded implementations are distinguished;
  these research reports do not constitute measured Karsli improvements.

The app's submitted 1.1 build is a separate artifact. App Store Connect was
checked read-only during this work: version 1.1 build 7 remained Waiting for
Review, version 1.0 remained Ready for Distribution, and manual release was
selected. No app submission or phone installation is part of this prototype.