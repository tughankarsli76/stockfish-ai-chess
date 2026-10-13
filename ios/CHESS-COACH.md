# Chess Coach — version 1.8

Options → Chess Coach appears directly below Game Difficulty and defaults to off. The setting is saved on the device. Coaching applies to live Play Computer games and the human player's moves. It does not coach engine matches, tournaments, analysis, or historical review.

When enabled, the app uses its existing native engine session for one-second, full-strength checks of the position before and after the move. A sufficiently deep analysis already available for the before position is reused instead of running that search again. The normal computer reply follows these checks; clocks continue running. No network service or extra engine model is needed.

Coach cards notify Brilliant, Blunder, Inaccuracy, Mistake, Excellent, and Great moves using the same engine-based criteria as the Move List. Book, Forced, Good, and ordinary Best moves do not generate cards. Lost forced-mate opportunities retain the existing blunder warning. A score loss of at least 50 centipawns is an inaccuracy, at least 100 a mistake, and at least 200 a blunder. Scores are compared from the player's perspective. Before-move searches request two lines when supported so unique strong moves can be distinguished; cached MultiPV evidence is reused. Both searches need depth 8 or greater and an exact score with a legal principal variation. These are engine estimates, not an exhaustive classification of every move.

The coach explains an undefended piece only when the engine's legal reply captures that piece and the player's position does not defend its square. Forced-mate warnings use the engine's mate score. When a specific tactical cause cannot be established, it shows the legal continuation and a better move instead of inventing a cause. Missing, shallow, stale, or invalid analysis produces no warning. A five-second watchdog per search resumes normal play if a coach check stalls.

Advice appears below the board, remains available after the computer reply, and can be dismissed. Undismissed advice disappears after 20 seconds; a new message starts a fresh timer. Turning the coach off, reviewing/undoing the move, or replacing the game clears advice. Opening-book arrows redraw immediately when the move animation ends. The after-move coach search publishes arrows for the visible position, and those lines stay visible while the normal reply search starts. Native background handoff runs the real game rather than a coach search.

## Validation

Run `npm test`. Coach tests cover White/Black score perspective, verified and unsupported capture explanations, forced mate, insufficient evidence, disabled coaching, and stale jobs. Existing undo/review and background tests exercise the updated app handlers.

A phone-sized browser smoke check using a mock native UCI transport verified the actual Options toggle, default/off state, persistence, blunder card, computer reply, disabling, and timeout recovery. Native engine quality and iPhone lifecycle behavior still need device validation through Xcode Cloud/TestFlight.

## Phone check

1. Open Options and confirm Chess Coach is off and below Game Difficulty.
2. Turn it on and play a computer game. Leave a valuable piece undefended, then check that the advice names a legal capture and offers a safer alternative.
3. Repeat playing as Black; advice should name White's response.
4. Verify normal replies, clocks, undo, background/foreground, and dismissing advice.
5. Turn it off and confirm subsequent moves produce no coach card.

## End-of-game review

Game Review is available below Move List for completed human, computer and historical games, regardless of Chess Coach. Normal games open it once automatically at the final position, after confetti ends. Historical resignation and draw results use the PGN Result header. Setup/FEN games and engine tournaments allow manual review but never open it automatically. Setup provenance is saved as PositionSetup in PGN, including setups reset to the standard starting board. Navigating earlier moves allows manual full-game review without auto-opening it.

The dialog closes 20 seconds after opening, including manual reopening. Done closes it sooner. Closing cancels missing-position analysis; reopening resumes it. All table numbers are bold. Move List and the compact move history show move-quality badges next to the notation. Move List includes the quality labels but no explanatory ratings legend below the moves. Classification remains available in Game Review.

## Accuracy and estimated game performance

Opening Game Review completes missing position analyses using the existing engine at full strength. No additional engine session, downloads, or external service is used. Analysis runs only after the game ends, can be paused by closing the review, and resumes from retained evidence when reopened. Current-game per-move metrics are saved on the device; a completed saved review does not rerun searches on every launch. A retry is offered when adequate evidence could not be obtained. The PGN and board are never changed by review searches.

Accuracy uses exact evaluations at depth 10 or greater with legal principal variations. Terminal mate and draw scores come from the actual game result. An engine-provided WDL distribution is converted to expected score as `(wins + draws / 2) / 10`; without WDL, the portable estimate is `100 / (1 + exp(-cp / 250))`. These are estimated winning chances/expected scores rather than calibrated probabilities.

For each actual move, compare the player's expected score before the move with `100 - opponentChanceAfter`. The score is `100 * exp(-max(chanceLoss / 20, centipawnLoss / 200))`. The centipawn penalty prevents saturated WDL in already winning or losing positions from hiding subsequent material losses. Allowing forced mate from a centipawn position or losing an available forced mate uses a 1000 cp penalty. Best recommendations receive 100 to avoid cross-search noise. Accuracy averages the arithmetic and harmonic means of the move scores (a zero move score makes the harmonic mean zero), giving serious errors more weight. All moves must have sufficient evidence. Version 2 invalidates saved metrics from the original formula and reanalyzes them. This is an app model, not Chess.com's formula.

Game Rating is a heuristic app performance index, not a calibrated estimate of playing strength. It uses `2400 * (Accuracy / 100)^3`, rounded to 50, rather than the original linear multiplier. It is withheld when Accuracy is unavailable. The ceiling of 2400 and nonlinear curve reduce inflated scores; they do not establish empirical rating calibration. Very short or forced games can still produce high scores. Game Rating is no longer displayed in Game Review.

Tests cover chance-loss sensitivity, saturation in dominant positions, WDL preference, player colors, exact/deep/legal evidence, complete-versus-partial scores, persistence, terminal positions, single-PV forced moves, retries, and cancellation. Browser validation uses mock native UCI results; real-engine/device review quality must be checked in TestFlight.

## Timeout celebrations

When a live game clock expires, including engine matches, the result names the winner as White wins on time or Black wins on time. The same confetti and king animation used at checkmate play once, with the king colored for the clock winner. Review still waits only for confetti. Reduced-motion and background visibility behavior remain handled by the existing celebration classes.
