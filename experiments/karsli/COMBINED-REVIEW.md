# Combined candidate review and native promotion readiness

This checkpoint covers standalone engine functionality and exploratory comparisons.
It does not establish stronger play or complete the remaining engine research.
The native app source and its fourteen-option revision-9 profile were not changed.

## Independently labeled evidence

| Platform and comparison | Normal / ASan+UBSan checks | Paired result | Replayed legal plies |
| --- | --- | --- | --- |
| Apple Silicon Mac, PZ on/off | 9 / 9; bounds passed | 1W / 1L / 14D | 1,927 |
| Apple Silicon Mac, Tarnished on/off | 9 / 9; bounds passed | 0W / 0L / 16D | 2,226 |
| Linux x86-64, PZ on/off | 9 / 9; bounds passed | 2W / 1L / 13D | 2,143 |
| Linux x86-64, Tarnished on/off | 9 / 9; bounds passed | 2W / 0L / 14D | 1,977 |
| Linux x86-64, all five on versus current14 | Combined profile exercised by the candidate suites | 0W / 0L / 16D | 2,508 |

Each comparison used sixteen games with eight two-color opening pairs. Completed
Linux comparisons have zero clock forfeits and truncations. Linux leak detection
was enabled. Match binaries were optimized, single-threaded, Hash 64 MB, with
5-second clocks and 50-ms increments. Builds finished before matches. Linux and
Mac are separate runs on different hardware; timing and strength are not pooled.
The combined on/off comparison uses the SAME Tarnished-stage binary so precisely
the five experimental options differ. The other fourteen values remain identical.

The interrupted six-game combined sample is retained separately under
`reports/cloud-linux/interrupted-combined`; it is excluded from the final results.
The independent auditor rejected deliberately changed profiles, illegal moves,
clock overruns and truncated reports. Those are expected rejection tests, not
candidate failures. Pinned source and model checksums are unchanged. The initial
blocked network download and its verified archive fallback are retained.

## Interaction review

- Berserk's NMP guard changes eligibility rather than adding another RFP margin.
  Existing Plenty/Halogen threat protections remain separate mechanisms.
- Caissa's keyed quiet cache affects shallow ordering and resets each search.
  Its quiet/ply gates and bounded bonus remain essential with existing histories.
- Trium's disagreement term adjusts RFP using normalized existing correction
  histories. It is heuristic uncertainty; it does not include all new learned
  correction views and is not a time-management or network adaptation.
- PZ adds a worker-local side-control correction alongside the existing Cinder
  transition correction. Both contribute to corrected evaluation and can also
  affect Alexandria's reduction adjustment. Stockfish admission and terminal
  score bounds are retained; shared correction learning remains correlated.
- Tarnished reads the combined correction magnitude and adds bounded pair/triple
  interactions BEFORE the subsequent Pawnocchio alpha-raise term. Its own
  quarter-ply cap does not cap the aggregate effect of every enabled LMR feature.
  Its imported seed vector is not tuned to these Karsli interactions.

The all-five comparison found no obvious legal/clock failure and no demonstrated
advantage over current14 in this small sample. Per-option technical activation is
covered, but this is not a factorial interaction study, a long-time-control test,
a multithreaded stress study, or a statistically powered strength comparison.
A few favorable isolated results do not justify enabling the package by default.

## Concrete next promotion work, not applied

Technical evidence supports preparing a separately reviewable, opt-in native
integration draft. It does not justify silently changing the deployed profile.
Before promoting into the native engine/profile:

1. Select the intended candidate subset and initial weights explicitly. Keep all
   five experimental UCI defaults false/zero; retain current14 as the control.
2. Reconstruct the chosen source using `SOURCE-MANIFEST.json`. Any native source
   update must include the complete headers and modified engine/search/history
   files together, preserve namespace isolation and the native stop/heartbeat
   adapter, and update `engine/karsli-1.0/IOS-SOURCE-MANIFEST.json`, provenance,
   licenses and corresponding-source records deliberately.
3. Update `engine/karsli-1.0/combined-profile.json` and generated
   `ios/StockfishChess/KarsliProfile.h` together ONLY for the approved experimental
   profile, keeping a current14 control. Extend profile/material/stop/background
   native fixtures to prove each option is applied and reset correctly.
4. Use Apple's Karsli Validation workflow for the candidate native source, with
   the focused three-test plan and real native thread settings. Its current
   revision-9 integration build does not validate an unpromoted nineteen-option
   source. Regenerate/build on Apple CI, not Linux. TestFlight remains manual.
5. Retune interacting LMR seeds and measure speed, longer time controls and
   independently held-out paired games before any default-on strength decision.

Remaining scope: Trium TC-gated time management/TMv2 and TRANN1 require separate
implementation and compatible trained inputs; Tarnished/Karsli-specific LMR
retuning remains open; Raphael's full fractional-depth architecture remains open.
No native promotion, App Review submission or public release occurred here.
