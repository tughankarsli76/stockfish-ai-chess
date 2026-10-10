# Classical & Legendary Games: sources and validation

The built-in collection is stored in `dist/historical-games-data.js` and exports `HISTORICAL_GAMES`. It contains 100 selected records from the fifteenth century through 2026, including both the first game of the 1996 Kasparov–Deep Blue match and the deciding sixth game of the 1997 rematch. The collection is curated rather than an exhaustive ranking of influential chess games.

Each record contains an unannotated PGN, an original short introduction, source links, `expectedPlies`, and a `finalFen` derived by replaying its score. A ply is one move by one player. The introductions do not claim to be engine annotations or reproduce the sources’ prose. Source annotations, analysis variations, photographs, and other media are not bundled.

## Original fifteen-game selection: record provenance

Public records were checked on 7 October 2026. PGN Mentor’s player-viewer files provide the factual move scores for most entries. The links below identify the specific archive or historical account used, rather than a generic search page.

| Catalog ID | White / Black | Result | Plies | Final move | Score and context sources |
| --- | --- | --- | ---: | --- | --- |
| `castellvi-vinyoles-1475` | Francesc de Castellví / Narcís Vinyoles | 1–0 | 41 | 21.Qd8# | [Scachs d’Amor: poem and translation](https://www.scachsdamor.org/); [Chessgames record](https://www.chessgames.com/perl/chessgame?gid=1259987) |
| `mcdonnell-labourdonnais-1834` | Alexander McDonnell / Louis de La Bourdonnais | 0–1 | 74 | 37...e2 | [PGN Mentor: McDonnell](https://www.pgnmentor.com/players/McDonnell/McDonnell.pgn), `London m4`, archive round 62 |
| `immortal-1851` | Adolf Anderssen / Lionel Kieseritzky | 1–0 | 45 | 23.Be7# | [PGN Mentor: Anderssen](https://www.pgnmentor.com/players/Anderssen/Anderssen.pgn), `London 'Immortal game'`; [Edward Winter’s historical sources](https://www.chesshistory.com/winter/extra/immortal.html) |
| `evergreen-1852` | Adolf Anderssen / Jean Dufresne | 1–0 | 47 | 24.Bxe7# | [PGN Mentor: Anderssen](https://www.pgnmentor.com/players/Anderssen/Anderssen.pgn), `Berlin 'Evergreen'` |
| `opera-1858` | Paul Morphy / Duke of Brunswick and Count Isouard | 1–0 | 33 | 17.Rd8# | [PGN Mentor: Morphy](https://www.pgnmentor.com/players/Morphy/Morphy.pgn), `Paris it`, 1858, Black `Duke Karl Count Isouard` |
| `lasker-bauer-1889` | Emanuel Lasker / Johann Hermann Bauer | 1–0 | 75 | 38.Qxd3 | [PGN Mentor: Lasker](https://www.pgnmentor.com/players/Lasker/Lasker.pgn), `Amsterdam`, 1889, the complete record ending 38.Qxd3 |
| `capablanca-marshall-1918` | José Raúl Capablanca / Frank Marshall | 1–0 | 71 | 36.Bxf7+ | [PGN Mentor: Capablanca](https://www.pgnmentor.com/players/Capablanca/Capablanca.pgn), `New York`, 1918 |
| `reti-alekhine-1925` | Richard Réti / Alexander Alekhine | 0–1 | 80 | 40...Nd4 | [Edward Winter: published score variants](https://www.chesshistory.com/winter/extra/retialekhine.html), version B; [PGN Mentor: Alekhine](https://www.pgnmentor.com/players/Alekhine/Alekhine.pgn) consulted for comparison |
| `byrne-fischer-1956` | Donald Byrne / Bobby Fischer | 0–1 | 82 | 41...Rc2# | [PGN Mentor: Fischer](https://www.pgnmentor.com/players/Fischer/Fischer.pgn), `New York Rosenwald`, 1956 |
| `botvinnik-tal-1960-game-6` | Mikhail Botvinnik / Mikhail Tal | 0–1 | 92 | 46...Kd4 | [PGN Mentor: 1960 World Championship](https://www.pgnmentor.com/events/WorldChamp1960.pgn), round 6; [US Chess: game record](https://new.uschess.org/news/review-tal-move-by-move) |
| `fischer-spassky-1972-game-6` | Bobby Fischer / Boris Spassky | 1–0 | 81 | 41.Qf4 | [PGN Mentor: 1972 World Championship](https://www.pgnmentor.com/events/WorldChamp1972.pgn), round 6; [ChessBase: game score and recorded thinking times](https://fr.chessbase.com/post/fischer-vs-spassky-1972-il-y-a-cinquante-ans-50-serie-4-sixieme-partie) |
| `deep-blue-kasparov-1996-game-1` | Deep Blue / Garry Kasparov | 1–0 | 73 | 37.Rxh7+ | [IBM’s contemporary game 1 score](https://park.org/Cdrom/Pavilions/IBM/DeepBlue/games/game1/current.html); [PGN Mentor: Kasparov](https://www.pgnmentor.com/players/Kasparov/Kasparov.pgn), `Philadelphia m`, round 1; [IBM’s history](https://www.ibm.com/history/deep-blue) |
| `deep-blue-kasparov-1997-game-6` | Deep Blue / Garry Kasparov | 1–0 | 37 | 19.c4 | [PGN Mentor: Kasparov](https://www.pgnmentor.com/players/Kasparov/Kasparov.pgn), `New York man vs machine`, round 6; [IBM’s history](https://www.ibm.com/history/deep-blue) |
| `kasparov-topalov-1999` | Garry Kasparov / Veselin Topalov | 1–0 | 87 | 44.Qa7 | [PGN Mentor: Kasparov](https://www.pgnmentor.com/players/Kasparov/Kasparov.pgn), `Hoogovens`, 20 January 1999, round 4 |
| `polgar-kasparov-2002` | Judit Polgár / Garry Kasparov | 1–0 | 84 | 42...Kc8 | [PGN Mentor: Kasparov](https://www.pgnmentor.com/players/Kasparov/Kasparov.pgn), `RUS vs. ROW`, 9 September 2002, round 5; [ChessBase’s contemporary event report](https://en.chessbase.com/post/what-is-wrong-with-the-great-ks-/1) |

## Normalization and historical qualifications

- PGN seven-tag headers are normalized to the catalog’s readable event and player names. For example, archive labels `Comp Deep Blue`, `Kasparov, Gary`, and `Fischer, Robert James` are displayed as Deep Blue, Garry Kasparov, and Bobby Fischer. Event, Date, White, Black, and Result headers match each catalog record. Empty rating fields and auxiliary archive tags are omitted.
- Unknown month and day components remain `??`, and unknown rounds remain `?`. Exact dates are supplied only where the consulted sources support them. The Immortal Game retains `1851.??.??`: Winter records conflicting historical date claims. No precise Opera Game date is inferred from a modern retelling.
- The 1475 entry is explicitly a **literary game** from *Scachs d’amor*, traditionally dated to around 1475. It illustrates modern queen and bishop movement; this is not a claim that every current chess rule was already in effect or that an ordinary competitive game was played on a known date. Its entire move sequence can nevertheless be replayed legally by the app’s modern chess library.
- McDonnell–La Bourdonnais is the sixteenth game of their fourth match. PGN Mentor numbers it 62 across the larger series; the bundled Round header is normalized to `16` within that match.
- The Réti–Alekhine score has documented repetition variants. This collection selects the familiar version B, attributed by Winter to Alekhine’s own publications and other contemporary accounts, ending **40...Nd4**. It does not claim to resolve the disputed repetition count. The compared PGN Mentor record includes additional moves through 42...Bd5; those moves are not part of the selected published version.
- The complete Lasker–Bauer archive record ending 38.Qxd3 is used instead of the duplicate shortened record ending 33.Qg7+.
- SAN punctuation is normalized by `Chess.pgn()`: checkmate endings in several older archive scores written with `+` are exported with `#`. No move is added to demonstrate a hypothetical finish after resignation. In particular, the 1996 Deep Blue game ends at 37.Rxh7+, and the 1997 game at 19.c4.
- Polgár–Kasparov is identified as a **rapid** game. Kasparov was the world’s top-rated player in 2002; the introduction does not describe him as the reigning world champion that year.

This document records provenance and the chosen published scores. It makes no blanket claim about the copyright or licensing of every linked archive or webpage.

## Original selection validation

All 15 original PGNs were validated against the app’s existing `dist/vendor/chess.js` and `dist/model.js` (`GameSession`):

1. The sourced move score parsed and its move count matched the expected count in the table above.
2. The normalized PGN parsed using `Chess.loadPgn(pgn, {strict: true})`.
3. The normalized PGN loaded through `GameSession.load`, preserving every ply.
4. Every navigation position from cursor zero through the final cursor produced a valid position, and the final position matched the record’s `finalFen`.
5. Checkmate was confirmed for the selected 1475, Immortal, Evergreen, Opera, and Byrne–Fischer scores. Other recorded wins retain their historical Result header without pretending that resignation is a board-level checkmate.

The stored final FENs are replay-derived verification values, not independently sourced claims about engine evaluations. Legality and count checks validate the bundled representation; they do not settle the historical score variations described above.

## Expanded collection validation

The expanded collection contains 45 unique games, 3,629 legal plies, and 3,674 replay positions. On 7 October 2026, all PGNs parsed in strict mode, all player/event/date/result headers matched their records, every replay cursor matched its reference FEN, and every full move score remained intact during replay. The original fifteen entries are preserved.

## Ten additional classics and legends

Prepared and verified on 7 October 2026. These are factual, unannotated game scores with original introductory text. No photographs, source commentary, variations, analysis symbols, or published prose have been bundled. The collection includes the complete played score through the reported result; it does not extend resignations into an invented mate.

PGN Mentor player archives were used as a starting score source. Its public download index is https://www.pgnmentor.com/files.html and canonical player archive downloads are https://www.pgnmentor.com/players/NAME.zip. Source links below also identify contemporary scores and primary research on known discrepancies. Display names and event labels are normalized, and PGNs have only the standard seven headers. Unknown date components remain `??` unless a cited source supplies them.

### Corrections and score boundaries

- **Larsen–Fischer, Denver 1971, game 6:** Fischer played Black. The cached PGN Mentor score stops prematurely at `33.Qh6`. The contemporary score by Mikhail Tal and Igor Zaitsev in *64*, issue 30 (1971), as translated by Douglas Griffin, continues `33...Bb7 34.Nxe6 Qf6 35.Qe3 Re7 36.Rde1 Rd6 37.Qg5+ Qxg5 38.Nxg5 Rxe1 39.Rxe1 Bd5 40.Re8+ Kg7`, after which Larsen resigned. The complete 80-ply score is bundled, with the date 20 July 1971 supplied by that score.
- **Fischer–Petrosian, Buenos Aires 1971, game 7:** The cached PGN Mentor score and the contemporary Polugaevsky score printed in *64* contain `33...Nxb4`. Karsten Müller’s article of 26 November 2020 reports the source investigation by Charles Sullivan that established the actual move as `33...Nxf4`; that corrected move is bundled. The game ends after `34.Bc4` (67 plies). Date 19 October 1971 is supplied by the contemporary score. The intro describes the play without claiming that `22.Nxd7+` was objectively best, because modern analysis disputes that assertion.
- **Steinitz–von Bardeleben, Hastings 1895:** The 49-ply played score ends at `25.Rxh7+`. The subsequent mating continuation often reproduced with the game was a demonstration, and is not included. Edward Winter’s research reproduces contemporary eyewitness accounts and verifies round 10 on 17 August 1895. The short app introduction makes this boundary explicit.
- **Rotlewi–Rubinstein, Łódź 1907:** The game ends at `25...Rh3` (50 plies), without the frequently printed demonstrative continuation to mate. Edward Winter identifies the contemporary May–June 1908 *Wiener Schachzeitung* heading as Łódź, 26 December 1907. The known date is preserved.
- **Sämisch–Nimzowitsch, Copenhagen 1923:** The conventional title “Immortal Zugzwang Game” is retained. It ends after `25...h6` (50 plies); White’s resignation is not encoded as an extra move. Edward Winter’s research supplies March 1923; the day remains unknown.
- **Capablanca–Tartakower, New York 1924:** All 103 plies are included through `52.d6`, after which Black resigned. The round-6 context and final score are cross-checked against Johannes Fischer’s ChessBase article. The day and month remain unknown because the starting score does not supply them.
- **Alekhine–Nimzowitsch, San Remo 1930:** All 63 plies through `32.g3` are included. ChessBase’s primary training example supplies 18 January 1930, and its tournament account identifies round 3.
- **Botvinnik–Capablanca, AVRO 1938:** All 81 plies through `41.Kh5` are included. The PGN Mentor generic Amsterdam site is normalized to Netherlands because AVRO took place across Dutch venues. ChessBase’s published game supplies 22 November 1938, and its round report supplies round 11.
- **Spassky–Bronstein, USSR Championship 1960:** All 45 plies are included through `23.Qe4+`; the mating continuation is not appended. Spassky’s contemporary annotations published in the 1960 Soviet yearbook, discussed and translated by Douglas Griffin, confirm the historical context. Date components absent from the starting score remain unknown.
- **Petrosian–Spassky, World Championship 1966, game 10:** All 59 plies through `30.Qh8+` are included, without appending the mating line. Tal’s contemporary annotations in *Shakhmaty v SSSR*, issue 7 (1966), as translated by Douglas Griffin, provide the exact date 2 May 1966.

### Machine verification

Every score loads with the bundled `Chess.loadPgn(..., {strict: true})`, with matching White/Black/Date/Result headers. All 657 replay cursor positions were checked with the app’s `GameSession`, retaining the complete timeline and matching the corresponding before-move FEN or final FEN. `expectedPlies` and `finalFen` are computed from the verified score. Re-normalized PGNs were loaded again in strict mode. All ten IDs and SAN move sequences are distinct from the original 15-game catalog.

### Sources by game

- **Wilhelm Steinitz – Curt von Bardeleben (1895)**, 49 plies.
  - [PGN Mentor — Steinitz game records](https://www.pgnmentor.com/players/Steinitz/Steinitz.pgn).
  - [Edward Winter — Steinitz v von Bardeleben](https://www.chesshistory.com/winter/extra/steinitzvonbardeleben.html).

- **Georg Rotlewi – Akiba Rubinstein (1907)**, 50 plies.
  - [PGN Mentor — Rubinstein game records](https://www.pgnmentor.com/players/Rubinstein/Rubinstein.pgn).
  - [Edward Winter — Akiba Rubinstein Miscellanea](https://www.chesshistory.com/winter/extra/rubinstein2.html).

- **Friedrich Sämisch – Aron Nimzowitsch (1923)**, 50 plies.
  - [PGN Mentor — Nimzowitsch game records](https://www.pgnmentor.com/players/Nimzowitsch/Nimzowitsch.pgn).
  - [Edward Winter — Zugzwang](https://en.chessbase.com/newsroom/post/winter-on-i-zugzwang-i?page=0).

- **José Raúl Capablanca – Savielly Tartakower (1924)**, 103 plies.
  - [PGN Mentor — Capablanca game records](https://www.pgnmentor.com/players/Capablanca/Capablanca.pgn).
  - [ChessBase — New York 1924, round 6](https://en.chessbase.com/post/new-york-1924-round-6-lasker-and-lasker-play-remarkable-draw).

- **Alexander Alekhine – Aron Nimzowitsch (1930)**, 63 plies.
  - [PGN Mentor — Alekhine game records](https://www.pgnmentor.com/players/Alekhine/Alekhine.pgn).
  - [ChessBase — Alekhine wins San Remo 1930](https://de.chessbase.com/post/auf-dem-hoehepunkt-seiner-karriere-aljechin-gewinnt-in-san-remo-mit-14-aus-15).
  - [ChessBase — Mastering Chess Strategy, Alekhine–Nimzowitsch](https://books.chessbase.com/en/mastering-chess-strategy-vol-3/attack-your-opponents-weaknesses-1).

- **Mikhail Botvinnik – José Raúl Capablanca (1938)**, 81 plies.
  - [PGN Mentor — Botvinnik game records](https://www.pgnmentor.com/players/Botvinnik/Botvinnik.pgn).
  - [ChessBase — Botvinnik’s AVRO masterpiece](https://en.chessbase.com/post/avro-1938-round-11-botvinnik-masterpiece).
  - [ChessBase — Botvinnik–Capablanca score and context](https://en.chessbase.com/post/learn-from-the-great-patriarch-of-chess-mikhail-botvinnik).

- **Boris Spassky – David Bronstein (1960)**, 45 plies.
  - [PGN Mentor — Spassky game records](https://www.pgnmentor.com/players/Spassky/Spassky.pgn).
  - [Spassky’s account — Soviet Chess History](https://dgriffinchess.wordpress.com/2018/01/05/spasskys-annotations-to-his-famous-win-v-bronstein-27th-ussr-ch-leningrad-1960/).

- **Tigran Petrosian – Boris Spassky (1966)**, 59 plies.
  - [PGN Mentor — Petrosian game records](https://www.pgnmentor.com/players/Petrosian/Petrosian.pgn).
  - [Tal’s contemporary game score — translated by Douglas Griffin](https://dgriffinchess.wordpress.com/wp-content/uploads/2020/06/petrosian-spassky-10th-match-game-world-championship-moscow-1966.pdf).

- **Bent Larsen – Bobby Fischer (1971)**, 80 plies.
  - [PGN Mentor — Fischer game records](https://www.pgnmentor.com/players/Fischer/Fischer.pgn).
  - [Tal and Zaitsev’s contemporary score — translated by Douglas Griffin](https://dgriffinchess.wordpress.com/wp-content/uploads/2019/05/larsen-fischer-6th-match-game-candidates-semi-final-denver-1971.pdf).

- **Bobby Fischer – Tigran Petrosian (1971)**, 67 plies.
  - [PGN Mentor — Fischer game records](https://www.pgnmentor.com/players/Fischer/Fischer.pgn).
  - [Polugaevsky’s contemporary score — translated by Douglas Griffin](https://dgriffinchess.wordpress.com/wp-content/uploads/2019/06/fischer-petrosian-7th-match-game-candidates-final-buenos-aires-1971-1.pdf).
  - [Karsten Müller — corrected game move 33...Nxf4](https://en.chessbase.com/post/solution-of-the-endgame-riddle-was-fischer-s-22-nxd7-winning).

## Champion game additions: source and validation notes

This group contributes ten unannotated games, with four featuring Garry Kasparov, five featuring Anatoly Karpov, and four featuring Mikhail Tal. Games between Kasparov and Karpov count toward both players. All ten use the existing catalog schema and `era: "Champions"`; player names and event labels are normalized for readability. The introduction sentences are original. No source annotations, analysis variations, photographs, or engine evaluations are included.

## Source records

The move scores were read from [PGN Mentor’s Kasparov records](https://www.pgnmentor.com/players/Kasparov/Kasparov.pgn), [Karpov records](https://www.pgnmentor.com/players/Karpov/Karpov.pgn), and [Tal records](https://www.pgnmentor.com/players/Tal/Tal.pgn). The array carries game-specific source links, including the sources below used to check context and resolve a score discrepancy. The source attribution records provenance; it does not assert a blanket license for archive material.

| Game | Archive identification | Result | Plies | Last recorded move |
| --- | --- | --- | ---: | --- |
| Tal–Tolush, 1957 | USSR Championship, round 21 | 1-0 | 83 | 42. Rxe6 |
| Tal–Smyslov, 1959 | Candidates Tournament, round 8 | 1-0 | 51 | 26. Bd4 |
| Tal–Hecht, 1962 | Varna Olympiad, round 9 | 1-0 | 97 | 49. Rg5 |
| Tal–Larsen, 1965 | Candidates semifinal, game 10 | 1-0 | 73 | 37. Qf7 |
| Karpov–Unzicker, 1974 | Nice Olympiad, Final Group A, round 3 | 1-0 | 87 | 44. Nh5 |
| Karpov–Kasparov, 1984 | World Championship, game 9 | 1-0 | 139 | 70. Nd6 |
| Karpov–Kasparov, 1985 | World Championship, game 16 | 0-1 | 80 | 40... Re1+ |
| Kasparov–Karpov, 1987 | World Championship, game 24 | 1-0 | 127 | 64. Kg2 |
| Karpov–Topalov, 1994 | Linares, round 4 | 1-0 | 77 | 39. Kg2 |
| Kasparov–Anand, 1995 | PCA World Championship, game 10 | 1-0 | 75 | 38. Rd6 |

## Corrections and uncertainties

- **Karpov–Unzicker:** PGN Mentor gives `43...Kh8`. The group uses `43...Kf8`, as printed in Karpov’s own *Izbrannye partii 1969–77* (Moscow, 1978), available in [Douglas Griffin’s translation](https://dgriffinchess.wordpress.com/wp-content/uploads/2021/09/karpov-unzicker-21st-olympiad-nice-1974.pdf). That score ends `43. Qg6 Kf8 44. Nh5`, with Black resigning; its final diagram also places Black’s king on f8. The derived `finalFen` therefore uses f8. The translation identifies 18 June 1974, whereas other database presentations identify 17 June; the group preserves the archive’s `1974.??.??` rather than selecting a disputed date.
- **Tal–Larsen:** The archive’s unknown date is replaced with `1965.08.08`, explicitly identified in [Tal’s 1965 report in Shakhmaty, translated by Douglas Griffin](https://dgriffinchess.wordpress.com/wp-content/uploads/2019/12/tal-larsen-10th-match-game-candidates-semi-final-bled-1965.pdf). The played score, including the resignation endpoint, agrees with the archive. Tal’s report supports the match-deciding context and the knight sacrifice on d5.
- **Other dates:** Nine games retain the archive’s year with unknown month and day (`YYYY.??.??`). No exact dates were inferred from tournament schedules or neighboring records.
- **Karpov–Topalov:** This is the Linares round 4 win, not their 1994 Dos Hermanas win or Las Palmas draw. Its 77-ply score agrees with the tournament-bulletin game reproduced in [ChessBase’s Karpov retrospective](https://en.chessbase.com/post/karpov-diem-happy-65th-birthday-tolya).
- **Tal–Smyslov:** This is Candidates round 8, ending 26. Bd4, not the separate round 22 win. [The individual game record](https://www.chessgames.com/perl/chessgame?gid=1139475) corroborates its identity.
- **Tal–Hecht:** [ChessBase’s game page](https://tutorials3.chessbase.com/en/modern-classics/tal-hecht-1962) identifies the Varna Olympiad game. The introduction describes events visible in the played score: the queen capture and later rook ending.
- **Kasparov–Karpov 1987:** The title-retention context is corroborated by [Kasparov’s own recollection](https://en.chessbase.com/post/what-is-garry-up-to).
- **Kasparov–Anand 1995:** The preparation context is corroborated by [Kasparov’s interview](https://en.chessbase.com/post/the-garry-kasparov-interview-part-2/7). No quoted commentary or analysis branches are incorporated.
- **Termination:** All scores stop at their recorded final move and result. A result marker after a legal position can represent resignation; no hypothetical mate or later continuation has been appended.

## Validation

Validated on 7 October 2026 with the repository’s `dist/vendor/chess.js` and `dist/model.js`, using the bundled Node runtime. Each PGN was parsed with `Chess.loadPgn(pgn, {strict: true})`. The player, event, date, and result headers match their corresponding record fields. Every score has its expected ply count and derived final FEN.

All ten loaded through `GameSession.load`. Every cursor from the starting position through the final position was visited, checked against the strict parser’s corresponding FEN, and checked to preserve the complete move line. Totals: **889 legal plies and 899 reviewed positions**. IDs and exact SAN move sequences are unique and were checked against the original fifteen-game catalog to exclude duplicate records. The group JSON contains only the ten final records.

## Modern legends expansion (10 games)

Validated on 2026-10-07. Scores are factual, unannotated main lines extracted from the linked PGN Mentor event archives. Each game was loaded with strict chess.js parsing and independently replayed move by move; every GameSession cursor was compared to that reference, including its final FEN. Player names, event labels and seven-tag headers are normalized for display. Archive round labels such as `4.5`, `7.3`, and `4.1` include a board suffix; the app uses the actual round number. No moves after resignation, commentary, variations, photos or source prose are reproduced. All introductions are original.

### Kramnik’s London breakthrough

Vladimir Kramnik — Garry Kasparov, 2000.10.24, 1-0; 49 plies.

- [PGN Mentor — WorldChamp2000 game records](https://www.pgnmentor.com/events/WorldChamp2000.pgn)
- [GM Rafael Leitão — Kramnik vs Kasparov](https://rafaelleitao.com/kramnik-x-kasparov/)

Final FEN: `3N1r1k/p3Q1pp/1p3n2/8/8/5P2/Pq3P1P/4R1K1 b - - 9 25`.

### Anand’s Bonn breakthrough

Vladimir Kramnik — Viswanathan Anand, 2008.10.17, 0-1; 82 plies.

- [PGN Mentor — WorldChamp2008 game records](https://www.pgnmentor.com/events/WorldChamp2008.pgn)
- [FIDE — Anand takes the lead in game 3](https://old.fide.com/component/content/article/1-fide-news/3387-kramnik-0-1-anand-game-3.html)

Final FEN: `8/P7/4pp1k/7p/5P2/R4P2/KP5P/1b3q2 w - - 5 42`.

### Carlsen outplays Aronian

Magnus Carlsen — Levon Aronian, 2012.01.16, 1-0; 135 plies.

- [PGN Mentor — WijkaanZee2012 game records](https://www.pgnmentor.com/events/WijkaanZee2012.pgn)

Final FEN: `8/1PK5/3B4/8/7N/7p/6k1/1r6 b - - 1 68`. Introduction describes only facts directly visible in the score (material and passed pawn), without attributing an unsupported historical nickname.

### Anand’s Immortal Game

Levon Aronian — Viswanathan Anand, 2013.01.15, 0-1; 46 plies.

- [PGN Mentor — WijkaanZee2013 game records](https://www.pgnmentor.com/events/WijkaanZee2013.pgn)
- [NM Sam Copeland — Anand’s Immortal Game](https://www.chess.com/blog/SamCopeland/anands-immortal-chess-game-aronian-vs-anand-2013)

Final FEN: `2r3k1/pb4p1/4p3/1p3p1q/5Pn1/P1NQb2P/1P4P1/R1B2R1K w - - 4 24`.

### Carlsen takes the Chennai lead

Magnus Carlsen — Viswanathan Anand, 2013.11.15, 1-0; 115 plies.

- [PGN Mentor — WorldChamp2013 game records](https://www.pgnmentor.com/events/WorldChamp2013.pgn)
- [FIDE — 2013 World Championship reports](https://old.fide.com/component/content/article/1-fide-news/7539-fide-world-championship-carlsen-takes-the-lead.html)

Final FEN: `8/P6R/8/2k5/2p4P/2K5/r7/8 b - - 0 58`.

### Carlsen’s second Chennai win

Viswanathan Anand — Magnus Carlsen, 2013.11.16, 0-1; 134 plies.

- [PGN Mentor — WorldChamp2013 game records](https://www.pgnmentor.com/events/WorldChamp2013.pgn)
- [FIDE — 2013 World Championship reports](https://old.fide.com/component/content/article/1-fide-news/7539-fide-world-championship-carlsen-takes-the-lead.html)

Final FEN: `R7/8/7p/8/1PP2k2/7P/5p1K/6r1 w - - 6 68`.

### Carlsen retains the crown

Magnus Carlsen — Viswanathan Anand, 2014.11.23, 1-0; 89 plies.

- [PGN Mentor — WorldChamp2014 game records](https://www.pgnmentor.com/events/WorldChamp2014.pgn)
- [FIDE — Carlsen wins the 2014 championship match](https://old.fide.com/component/content/article/1-fide-news/8393-magnus-carlsen-wins-the-world-championship-match.html)

Final FEN: `8/4b3/4P3/1k4P1/8/ppK5/8/4R3 b - - 1 45`.

### Nakamura’s Candidates comeback

Hikaru Nakamura — Veselin Topalov, 2016.03.19, 1-0; 77 plies.

- [PGN Mentor — Candidates2016 game records](https://www.pgnmentor.com/events/Candidates2016.pgn)
- [World Chess — Nakamura and Topalov’s round 7 press conference](https://www.youtube.com/watch?v=1FCC3EPHqRU)

Final FEN: `8/5ppk/2p3p1/2P3R1/4nQ1P/4BpP1/5P1K/3q4 b - - 1 39`.

### The 136-move marathon

Magnus Carlsen — Ian Nepomniachtchi, 2021.12.03, 1-0; 271 plies.

- [PGN Mentor — WorldChamp2021 game records](https://www.pgnmentor.com/events/WorldChamp2021.pgn)
- [FIDE — 2021 championship game 6 report](https://www.fide.com/fide-world-championship-2021-are-we-there-yet/)

Final FEN: `3k4/5RN1/4P3/5P2/7K/8/8/6q1 b - - 2 136`.

### Ding levels the match

Ding Liren — Ian Nepomniachtchi, 2023.04.13, 1-0; 93 plies.

- [PGN Mentor — WorldChamp2023 game records](https://www.pgnmentor.com/events/WorldChamp2023.pgn)
- [FIDE — Ding strikes back in game 4](https://www.fide.com/fide-world-championship-ding-liren-strikes-back-with-a-victory/)

Final FEN: `4qQ2/p3P3/1p2k1r1/6pp/2P5/6PP/P7/3R2K1 b - - 6 47`.

Validation total: 10 games; 1101 cursor positions; every score and final FEN passed.


## Version 1.4: one hundred games

On 9 October 2026 the owner requested exactly 100 games with older and newer selections. The original 45 records are preserved. The 55 additions comprise 25 games before 2000 and 30 games from 2000–2026. The complete collection has 59 games before 2000 and 41 from 2000 onward, spanning 1475–2026. Women’s champions Gaprindashvili, Chiburdanidze and Hou Yifan are included alongside recent players Gukesh, Praggnanandhaa, Abdusattorov and Erdoğmuş. The chronological list, search and existing era filters include every entry.

The additions use factual mainline moves and seven standard PGN headers from PGN Mentor’s free public player/event archives. Source comments, annotations, variations, ratings and media are omitted. Introductions are written for this app. Unknown date components and source round identifiers are retained. A resignation or time loss may end on the losing player’s turn; the recorded result is not inferred from checkmate.

Selection checks distinguish games by colors, date, round and event. Paulsen–Morphy is the sixth 1857 final game, ending 28...Be3; the other Morphy–Paulsen games are not that queen-sacrifice game. Zukertort–Blackburne is the score ending 33.Qxe7, not their other London encounter. Its score was cross-checked against [contemporary publications collected by Edward Winter](https://www.chesshistory.com/winter/extra/zukertortblackburne.html). The 2024 final-game length and result were cross-checked with [FIDE’s Game 14 report](https://www.fide.com/fide-world-championship-game-14-gukesh-d-claims-title/). The 2025 tiebreak and 2026 tournament selections were checked against [TWIC’s 2025 event record](https://theweekinchess.com/chessnews/events/87th-tata-steel-2025) and [2026 event record](https://theweekinchess.com/chessnews/events/88th-tata-steel-2026). No continuations after the archived final move are appended.

All 100 scores parse in strict mode and have distinct move sequences and IDs. All 8,469 legal plies and 8,569 replay positions match reference FENs without changing the full score. All original 45 objects match the saved baseline. Validation evidence: `release/reports/version-1.4-100-games-validation.json`. Source headers, archive checksums and final boundaries for the 55 additions: `release/reports/version-1.4-100-games-sources.json`.

| Catalog ID | White / Black | Result | Plies | Final move | Score source |
| --- | --- | --- | ---: | --- | --- |
| `paulsen-morphy-1857-6` | Paulsen, Louis / Morphy, Paul | 0-1 | 56 | 28...Be3 | [PGN Mentor](https://www.pgnmentor.com/players/Morphy.zip) |
| `morphy-anderssen-1858-9` | Morphy, Paul / Anderssen, Adolf | 1-0 | 33 | 17.Ke2 | [PGN Mentor](https://www.pgnmentor.com/players/Morphy.zip) |
| `anderssen-steinitz-1866-7` | Anderssen, Adolf / Steinitz, William | 1-0 | 67 | 34.Nf7+ | [PGN Mentor](https://www.pgnmentor.com/players/Anderssen.zip) |
| `zukertort-blackburne-1883` | Zukertort, Johannes Hermann / Blackburne, Joseph Henry | 1-0 | 65 | 33.Qxe7 | [PGN Mentor](https://www.pgnmentor.com/players/Zukertort.zip) |
| `steinitz-zukertort-1886-20` | Steinitz, William / Zukertort, Johannes Hermann | 1-0 | 37 | 19.Nxg4 | [PGN Mentor](https://www.pgnmentor.com/players/Steinitz.zip) |
| `pillsbury-tarrasch-1895` | Pillsbury, Harry Nelson / Tarrasch, Siegbert | 1-0 | 103 | 52.Qxh7# | [PGN Mentor](https://www.pgnmentor.com/players/Pillsbury.zip) |
| `levitsky-marshall-1912-6` | Levitsky, Stepan M / Marshall, Frank James | 0-1 | 46 | 23...Qg3 | [PGN Mentor](https://www.pgnmentor.com/players/Marshall.zip) |
| `lasker-capablanca-1914` | Lasker, Emanuel / Capablanca, Jose Raul | 1-0 | 83 | 42.Nc5 | [PGN Mentor](https://www.pgnmentor.com/players/Lasker.zip) |
| `capablanca-lasker-1921-11` | Capablanca, Jose Raul / Lasker, Emanuel | 1-0 | 95 | 48.Qxf8+ | [PGN Mentor](https://www.pgnmentor.com/players/Capablanca.zip) |
| `bogoljubow-alekhine-1922` | Bogoljubow, Efim / Alekhine, Alexander | 0-1 | 106 | 53...d5+ | [PGN Mentor](https://www.pgnmentor.com/players/Alekhine.zip) |
| `reti-capablanca-1924` | Reti, Richard / Capablanca, Jose Raul | 1-0 | 61 | 31.R1d5 | [PGN Mentor](https://www.pgnmentor.com/players/Capablanca.zip) |
| `alekhine-capablanca-1927-34` | Alekhine, Alexander / Capablanca, Jose Raul | 1-0 | 163 | 82.Re7 | [PGN Mentor](https://www.pgnmentor.com/players/Alekhine.zip) |
| `euwe-alekhine-1935-26` | Euwe, Max / Alekhine, Alexander | 1-0 | 93 | 47.Ne4+ | [PGN Mentor](https://www.pgnmentor.com/players/Euwe.zip) |
| `botvinnik-bronstein-1951-23` | Botvinnik, Mikhail / Bronstein, David I | 1-0 | 113 | 57.Bg5 | [PGN Mentor](https://www.pgnmentor.com/players/Botvinnik.zip) |
| `geller-euwe-1953-2` | Geller, Efim P / Euwe, Max | 0-1 | 52 | 26...Qf3 | [PGN Mentor](https://www.pgnmentor.com/players/Geller.zip) |
| `gaprindashvili-bykova-1962-10` | Gaprindashvili, Nona / Bykova, Elisaveta I | 1-0 | 114 | 57...Be4 | [PGN Mentor](https://www.pgnmentor.com/players/Gaprindashvili.zip) |
| `byrne-fischer-1963-3` | Byrne, Robert E / Fischer, Robert James | 0-1 | 42 | 21...Qd7 | [PGN Mentor](https://www.pgnmentor.com/players/Fischer.zip) |
| `spassky-fischer-1972-13` | Spassky, Boris V / Fischer, Robert James | 0-1 | 148 | 74...f2 | [PGN Mentor](https://www.pgnmentor.com/players/Fischer.zip) |
| `karpov-spassky-1974-9` | Karpov, Anatoly / Spassky, Boris V | 1-0 | 69 | 35.Rxd8 | [PGN Mentor](https://www.pgnmentor.com/players/Karpov.zip) |
| `karpov-kortschnoj-1978-32` | Karpov, Anatoly / Kortschnoj, Viktor | 1-0 | 82 | 41...Rb7 | [PGN Mentor](https://www.pgnmentor.com/players/Karpov.zip) |
| `chiburdanidze-alexandria-1981-15` | Chiburdanidze, Maia / Alexandria, Nana | 1-0 | 73 | 37.Qf5+ | [PGN Mentor](https://www.pgnmentor.com/players/Chiburdanidze.zip) |
| `karpov-kasparov-1985-24` | Karpov, Anatoly / Kasparov, Gary | 0-1 | 84 | 42...Nd4+ | [PGN Mentor](https://www.pgnmentor.com/players/Kasparov.zip) |
| `ivanchuk-kasparov-1991-1` | Ivanchuk, Vassily / Kasparov, Gary | 1-0 | 75 | 38.Rxh4+ | [PGN Mentor](https://www.pgnmentor.com/players/Ivanchuk.zip) |
| `topalov-shirov-1998-10` | Topalov, Veselin / Shirov, Alexei | 0-1 | 106 | 53...Kb3 | [PGN Mentor](https://www.pgnmentor.com/players/Shirov.zip) |
| `polgar-anand-1999-1` | Polgar, Judit / Anand, Viswanathan | 1-0 | 67 | 34.Qg2 | [PGN Mentor](https://www.pgnmentor.com/players/PolgarJ.zip) |
| `kramnik-kasparov-2000-2` | Kramnik,V / Kasparov,G | 1-0 | 79 | 40.Bd5 | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2000.pgn) |
| `kramnik-leko-2004-14` | Kramnik,V / Leko,P | 1-0 | 81 | 41.Nf7+ | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2004.pgn) |
| `kramnik-topalov-2006-10` | Kramnik,V / Topalov,V | 1-0 | 85 | 43.Bxa5 | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2006.pgn) |
| `anand-kramnik-2008-6` | Anand,V / Kramnik,V | 1-0 | 93 | 47.Bg7+ | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2008.pgn) |
| `hou-yifan-koneru-2011-7` | Hou Yifan / Koneru,H | 1-0 | 193 | 97.Kg5 | [PGN Mentor](https://www.pgnmentor.com/players/Hou.zip) |
| `gelfand-anand-2012-7` | Gelfand,B / Anand,V | 1-0 | 75 | 38.Nxe6 | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2012.pgn) |
| `anand-gelfand-2012-8` | Anand,V / Gelfand,B | 1-0 | 33 | 17.Qf2 | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2012.pgn) |
| `hou-yifan-polgar-2012-7-7` | Hou Yifan / Polgar,Ju | 1-0 | 93 | 47.f5 | [PGN Mentor](https://www.pgnmentor.com/players/Hou.zip) |
| `caruana-vachier-lagrave-2014-2-2` | Caruana,F / Vachier Lagrave,M | 1-0 | 59 | 30.Nc3 | [PGN Mentor](https://www.pgnmentor.com/events/SaintLouis2014.pgn) |
| `carlsen-caruana-2014-3-1` | Carlsen,M / Caruana,F | 0-1 | 68 | 34...Qg1+ | [PGN Mentor](https://www.pgnmentor.com/events/SaintLouis2014.pgn) |
| `karjakin-caruana-2016-14-4` | Karjakin, Sergey / Caruana, Fabiano | 1-0 | 83 | 42.Rd8+ | [PGN Mentor](https://www.pgnmentor.com/events/Candidates2016.pgn) |
| `carlsen-karjakin-2016-10` | Carlsen, Magnus / Karjakin, Sergey | 1-0 | 149 | 75.Kf6 | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2016.pgn) |
| `carlsen-karjakin-2016-4` | Carlsen, Magnus / Karjakin, Sergey | 1-0 | 99 | 50.Qh6+ | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2016.pgn) |
| `carlsen-caruana-2018-3` | Carlsen, Magnus / Caruana, Fabiano | 1-0 | 101 | 51.Qg4 | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2018.pgn) |
| `carlsen-nepomniachtchi-2021-8` | Carlsen,M / Nepomniachtchi,I | 1-0 | 91 | 46.Qf3 | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2021.pgn) |
| `ding-liren-nepomniachtchi-2023-2-1` | Ding Liren / Nepomniachtchi,I | 0-1 | 58 | 29...e5 | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2023.pgn) |
| `ding-liren-nepomniachtchi-2023-6-1` | Ding Liren / Nepomniachtchi,I | 1-0 | 87 | 44.Qf7 | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2023.pgn) |
| `ding-liren-nepomniachtchi-2023-12-1` | Ding Liren / Nepomniachtchi,I | 1-0 | 75 | 38.d6 | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2023.pgn) |
| `gukesh-abasov-2024-5-3` | Gukesh,D / Abasov,N | 1-0 | 173 | 87.Qg5+ | [PGN Mentor](https://www.pgnmentor.com/events/Candidates2024.pgn) |
| `gukesh-ding-liren-2024-3-1` | Gukesh,D / Ding Liren | 1-0 | 74 | 37...Rh5 | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2024.pgn) |
| `gukesh-ding-liren-2024-11-1` | Gukesh,D / Ding Liren | 1-0 | 57 | 29.Qxc6 | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2024.pgn) |
| `ding-liren-gukesh-2024-12-1` | Ding Liren / Gukesh,D | 1-0 | 77 | 39.Rxg7+ | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2024.pgn) |
| `ding-liren-gukesh-2024-14-1` | Ding Liren / Gukesh,D | 0-1 | 116 | 58...Ke5 | [PGN Mentor](https://www.pgnmentor.com/events/WorldChamp2024.pgn) |
| `caruana-praggnanandhaa-2025-11-5` | Caruana,F / Praggnanandhaa,R | 0-1 | 74 | 37...Qxe7 | [PGN Mentor](https://www.pgnmentor.com/players/Praggnanandhaa.zip) |
| `gukesh-keymer-2025-5-6` | Gukesh,D / Keymer,Vincent | 1-0 | 143 | 72.Be7 | [PGN Mentor](https://www.pgnmentor.com/players/Gukesh.zip) |
| `praggnanandhaa-gukesh-2025-3` | Praggnanandhaa,R / Gukesh,D | 1-0 | 123 | 62.Kg6 | [PGN Mentor](https://www.pgnmentor.com/players/Praggnanandhaa.zip) |
| `erigaisi-erdogmus-2026-7-7` | Erigaisi,Arjun / Erdogmus,Yagiz Kaan | 0-1 | 103 | 52.Kd3 | [PGN Mentor](https://www.pgnmentor.com/players/Erigaisi.zip) |
| `abdusattorov-gukesh-2026-6-5` | Abdusattorov,Nodirbek / Gukesh,D | 1-0 | 73 | 37.Qxf6+ | [PGN Mentor](https://www.pgnmentor.com/players/Abdusattorov.zip) |
| `keymer-abdusattorov-2026-7-3` | Keymer,Vincent / Abdusattorov,Nodirbek | 0-1 | 82 | 41...Rh1 | [PGN Mentor](https://www.pgnmentor.com/players/Abdusattorov.zip) |
| `erigaisi-abdusattorov-2026-13-4` | Erigaisi,Arjun / Abdusattorov,Nodirbek | 0-1 | 110 | 55...Bd3 | [PGN Mentor](https://www.pgnmentor.com/players/Abdusattorov.zip) |
