# Move ratings — version 1.8

The Game → Move → Move List screen shows colored badges and labels beside rated moves. Expand Move Ratings to see the symbol legend. The compact game history uses the same badges. Move navigation stays unchanged.

Book is assigned only to a move in the bundled opening book; Forced means the position has exactly one legal move. Both work without an engine evaluation. Other labels use the existing engine analysis or coach checks; this feature does not add searches or alter difficulty, clocks, or opening replies. Coaching need not be enabled.

Each side's move is compared from that player's perspective, using evaluations before and after the actual move. Exact scores, depth 8 or greater, and legal principal variations are required. Missing or conflicting analysis leaves a move unclassified. These are this app's engine estimates, not a recreation of another service's proprietary ratings.

Score-loss thresholds: Blunder ≥200 centipawns; Mistake ≥100; Inaccuracy ≥50. Smaller losses can receive Good or Excellent. Best matches the engine's preferred move. Great requires a same-depth second choice at least 150 centipawns worse. Brilliant additionally requires a sound material sacrifice supported by a legal continuation. Miss and Missed Win identify lost forced-mate opportunities, distinguishing positions that remain winning from those that do not.

A cached rating is tied to the exact before position, move, and after position. Current-game ratings are saved on the device and remain after a coach card is dismissed or expires. Branches with different moves do not inherit those grades. Changing engines clears the evaluation cache. Mixed-engine matches are not scored from incomparable engine evaluations; deterministic Book and Forced badges remain available.

Tests cover thresholds, both player colors, unique/sacrificial moves, book/forced moves, missed mate, missing/shallow/contradictory evidence, persistence, and stale branches. A phone-sized browser check exercised the actual Move List, 12-label legend, and a Blunder badge with coaching both enabled and disabled. Real-engine/device behavior should also be checked in TestFlight.
