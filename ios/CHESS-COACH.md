# Chess Coach — version 1.7

Options → Chess Coach appears directly below Game Difficulty and defaults to off. The setting is saved on the device. Coaching applies to live Play Computer games and the human player's moves. It does not coach engine matches, tournaments, analysis, or historical review.

When enabled, the app uses its existing native engine session for two one-second, full-strength searches: the position before the move and the position after it. The normal computer reply follows these checks; clocks continue running. No network service or extra engine model is needed.

A score loss of at least 100 centipawns is labeled a mistake, and at least 200 a blunder. Scores are compared from the player's perspective. Both searches need depth 8 or greater and an exact score with a legal principal variation. These are engine estimates, not an exhaustive classification of every move.

The coach explains an undefended piece only when the engine's legal reply captures that piece and the player's position does not defend its square. Forced-mate warnings use the engine's mate score. When a specific tactical cause cannot be established, it shows the legal continuation and a better move instead of inventing a cause. Missing, shallow, stale, or invalid analysis produces no warning. A five-second watchdog per search resumes normal play if a coach check stalls.

Advice appears below the board, remains available after the computer reply, and can be dismissed. Turning the coach off, reviewing/undoing the move, or replacing the game clears advice. Native background handoff runs the real game rather than a coach search.

## Validation

Run `npm test`. Coach tests cover White/Black score perspective, verified and unsupported capture explanations, forced mate, insufficient evidence, disabled coaching, and stale jobs. Existing undo/review and background tests exercise the updated app handlers.

A phone-sized browser smoke check using a mock native UCI transport verified the actual Options toggle, default/off state, persistence, blunder card, computer reply, disabling, and timeout recovery. Native engine quality and iPhone lifecycle behavior still need device validation through Xcode Cloud/TestFlight.

## Phone check

1. Open Options and confirm Chess Coach is off and below Game Difficulty.
2. Turn it on and play a computer game. Leave a valuable piece undefended, then check that the advice names a legal capture and offers a safer alternative.
3. Repeat playing as Black; advice should name White's response.
4. Verify normal replies, clocks, undo, background/foreground, and dismissing advice.
5. Turn it off and confirm subsequent moves produce no coach card.
