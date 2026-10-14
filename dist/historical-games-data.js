// Built-in historical game scores. Source and validation notes: docs/HISTORICAL-GAMES-SOURCES.md.
// Unknown date components are retained; introductions are original and scores are unannotated.
export const HISTORICAL_GAMES = [
  {
    id: "castellvi-vinyoles-1475",
    title: "Scachs d'amor — Chess of Love",
    era: "Early chess",
    white: "Francesc de Castellví",
    black: "Narcís Vinyoles",
    year: 1475,
    event: "Scachs d'amor (literary game)",
    date: "1475.??.??",
    result: "1-0",
    expectedPlies: 41,
    finalFen: "3Q1k1r/2p2ppp/6q1/3R4/5b2/7P/PPP2PP1/4K2R b K - 2 21",
    pgn: `[Event "Scachs d'amor (literary game)"]
[Site "Valencia"]
[Date "1475.??.??"]
[Round "?"]
[White "Francesc de Castellví"]
[Black "Narcís Vinyoles"]
[Result "1-0"]

1. e4 d5 2. exd5 Qxd5 3. Nc3 Qd8 4. Bc4 Nf6 5. Nf3 Bg4 6. h3 Bxf3 7. Qxf3 e6
8. Qxb7 Nbd7 9. Nb5 Rc8 10. Nxa7 Nb6 11. Nxc8 Nxc8 12. d4 Nd6 13. Bb5+ Nxb5
14. Qxb5+ Nd7 15. d5 exd5 16. Be3 Bd6 17. Rd1 Qf6 18. Rxd5 Qg6 19. Bf4 Bxf4
20. Qxd7+ Kf8 21. Qd8# 1-0`,
    summary: "A literary game from fifteenth-century Valencia, preserved in Scachs d’amor, illustrates the powerful queen and bishop moves of emerging modern chess. Its date is traditionally given as around 1475.",
    sources: [
      {
        "title": "Scachs d’Amor — poem and English translation",
        "url": "https://www.scachsdamor.org/"
      },
      {
        "title": "Chessgames — Castellví vs Vinyoles, 1475",
        "url": "https://www.chessgames.com/perl/chessgame?gid=1259987"
      }
    ],
  },
  {
    id: "mcdonnell-labourdonnais-1834",
    title: "Three pawns on the seventh rank",
    era: "Romantic era",
    white: "Alexander McDonnell",
    black: "Louis de La Bourdonnais",
    year: 1834,
    event: "La Bourdonnais–McDonnell, fourth match",
    date: "1834.??.??",
    result: "0-1",
    expectedPlies: 74,
    finalFen: "3b2rk/3P2pp/8/p7/8/2Q5/PP1pppPP/3R3K w - - 0 38",
    pgn: `[Event "La Bourdonnais–McDonnell, fourth match"]
[Site "London"]
[Date "1834.??.??"]
[Round "16"]
[White "Alexander McDonnell"]
[Black "Louis de La Bourdonnais"]
[Result "0-1"]

1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 e5 5. Nxc6 bxc6 6. Bc4 Nf6 7. Bg5 Be7
8. Qe2 d5 9. Bxf6 Bxf6 10. Bb3 O-O 11. O-O a5 12. exd5 cxd5 13. Rd1 d4 14. c4 Qb6
15. Bc2 Bb7 16. Nd2 Rae8 17. Ne4 Bd8 18. c5 Qc6 19. f3 Be7 20. Rac1 f5
21. Qc4+ Kh8 22. Ba4 Qh6 23. Bxe8 fxe4 24. c6 exf3 25. Rc2 Qe3+ 26. Kh1 Bc8
27. Bd7 f2 28. Rf1 d3 29. Rc3 Bxd7 30. cxd7 e4 31. Qc8 Bd8 32. Qc4 Qe1 33. Rc1 d2
34. Qc5 Rg8 35. Rd1 e3 36. Qc3 Qxd1 37. Rxd1 e2 0-1`,
    summary: "A celebrated game from the 1834 London matches between two leading masters of their time. La Bourdonnais finishes with three connected pawns on the seventh rank.",
    sources: [
      {
        "title": "PGN Mentor — McDonnell game records",
        "url": "https://www.pgnmentor.com/players/McDonnell/McDonnell.pgn"
      }
    ],
  },
  {
    id: "immortal-1851",
    title: "The Immortal Game",
    era: "Romantic era",
    white: "Adolf Anderssen",
    black: "Lionel Kieseritzky",
    year: 1851,
    event: "London casual game",
    date: "1851.??.??",
    result: "1-0",
    expectedPlies: 45,
    finalFen: "r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 b - - 1 23",
    pgn: `[Event "London casual game"]
[Site "London"]
[Date "1851.??.??"]
[Round "?"]
[White "Adolf Anderssen"]
[Black "Lionel Kieseritzky"]
[Result "1-0"]

1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5
8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8
15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6
21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7# 1-0`,
    summary: "Anderssen’s famous London game became an emblem of the sacrificial attacking style of the nineteenth century. The published finish gives up the queen before the remaining minor pieces deliver mate.",
    sources: [
      {
        "title": "PGN Mentor — Anderssen game records",
        "url": "https://www.pgnmentor.com/players/Anderssen/Anderssen.pgn"
      },
      {
        "title": "Edward Winter — The Immortal Game",
        "url": "https://www.chesshistory.com/winter/extra/immortal.html"
      }
    ],
  },
  {
    id: "evergreen-1852",
    title: "The Evergreen Game",
    era: "Romantic era",
    white: "Adolf Anderssen",
    black: "Jean Dufresne",
    year: 1852,
    event: "Berlin casual game",
    date: "1852.??.??",
    result: "1-0",
    expectedPlies: 47,
    finalFen: "1r3kr1/pbpBBp1p/1b3P2/8/8/2P2q2/P4PPP/3R2K1 b - - 0 24",
    pgn: `[Event "Berlin casual game"]
[Site "Berlin"]
[Date "1852.??.??"]
[Round "?"]
[White "Adolf Anderssen"]
[Black "Jean Dufresne"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O d3
8. Qb3 Qf6 9. e5 Qg6 10. Re1 Nge7 11. Ba3 b5 12. Qxb5 Rb8 13. Qa4 Bb6
14. Nbd2 Bb7 15. Ne4 Qf5 16. Bxd3 Qh5 17. Nf6+ gxf6 18. exf6 Rg8 19. Rad1 Qxf3
20. Rxe7+ Nxe7 21. Qxd7+ Kxd7 22. Bf5+ Ke8 23. Bd7+ Kf8 24. Bxe7# 1-0`,
    summary: "Another enduring Anderssen attacking game, played in Berlin and published in 1852. Its final combination brings both bishops into the attack after a rook and queen are sacrificed.",
    sources: [
      {
        "title": "PGN Mentor — Anderssen game records",
        "url": "https://www.pgnmentor.com/players/Anderssen/Anderssen.pgn"
      }
    ],
  },
  {
    id: "paulsen-morphy-1857-6",
    title: "Morphy’s queen sacrifice",
    era: "Romantic era",
    white: "Louis Paulsen",
    black: "Paul Morphy",
    year: 1857,
    event: "First American Chess Congress",
    date: "1857.??.??",
    result: "0-1",
    expectedPlies: 56,
    finalFen: "6k1/p1p2ppp/2p4r/8/1P1P4/2P1b3/4r2P/R1B2R1K w - - 1 29",
    pgn: `[Event "First American Chess Congress"]
[Site "New York"]
[Date "1857.??.??"]
[Round "6"]
[White "Louis Paulsen"]
[Black "Paul Morphy"]
[Result "0-1"]

1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6 4. Bb5 Bc5 5. O-O O-O 6. Nxe5 Re8 7. Nxc6 dxc6 8. Bc4 b5
9. Be2 Nxe4 10. Nxe4 Rxe4 11. Bf3 Re6 12. c3 Qd3 13. b4 Bb6 14. a4 bxa4 15. Qxa4 Bd7 16.
Ra2 Rae8 17. Qa6 Qxf3 18. gxf3 Rg6+ 19. Kh1 Bh3 20. Rd1 Bg2+ 21. Kg1 Bxf3+ 22. Kf1 Bg2+
23. Kg1 Bh3+ 24. Kh1 Bxf2 25. Qf1 Bxf1 26. Rxf1 Re2 27. Ra1 Rh6 28. d4 Be3 0-1`,
    summary: "Morphy gives up his queen to keep the black king under attack at the first American Chess Congress.",
    sources: [
      {
        "title": "PGN Mentor — Morphy game scores",
        "url": "https://www.pgnmentor.com/players/Morphy.zip"
      }
    ],
  },
  {
    id: "opera-1858",
    title: "The Opera Game",
    era: "Romantic era",
    white: "Paul Morphy",
    black: "Duke of Brunswick and Count Isouard",
    year: 1858,
    event: "Paris consultation game",
    date: "1858.??.??",
    result: "1-0",
    expectedPlies: 33,
    finalFen: "1n1Rkb1r/p4ppp/4q3/4p1B1/4P3/8/PPP2PPP/2K5 b k - 1 17",
    pgn: `[Event "Paris consultation game"]
[Site "Paris"]
[Date "1858.??.??"]
[Round "?"]
[White "Paul Morphy"]
[Black "Duke of Brunswick and Count Isouard"]
[Result "1-0"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7
8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7
14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`,
    summary: "Morphy played White against the Duke of Brunswick and Count Isouard in Paris. The short game became a familiar illustration of rapid development, open lines, and a coordinated mating attack.",
    sources: [
      {
        "title": "PGN Mentor — Morphy game records",
        "url": "https://www.pgnmentor.com/players/Morphy/Morphy.pgn"
      }
    ],
  },
  {
    id: "morphy-anderssen-1858-9",
    title: "Morphy vs Anderssen — Paris",
    era: "Romantic era",
    white: "Paul Morphy",
    black: "Adolf Anderssen",
    year: 1858,
    event: "Morphy–Anderssen match",
    date: "1858.??.??",
    result: "1-0",
    expectedPlies: 33,
    finalFen: "r1bq1b1r/ppN3pp/5k2/3Bp2Q/4P3/4P3/PPn1K1PP/R6R b - - 1 17",
    pgn: `[Event "Morphy–Anderssen match"]
[Site "Paris"]
[Date "1858.??.??"]
[Round "9"]
[White "Paul Morphy"]
[Black "Adolf Anderssen"]
[Result "1-0"]

1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 e6 5. Nb5 d6 6. Bf4 e5 7. Be3 f5 8. N1c3 f4 9.
Nd5 fxe3 10. Nbc7+ Kf7 11. Qf3+ Nf6 12. Bc4 Nd4 13. Nxf6+ d5 14. Bxd5+ Kg6 15. Qh5+ Kxf6
16. fxe3 Nxc2+ 17. Ke2 1-0`,
    summary: "Morphy wins the ninth game of his Paris match against Anderssen. Follow how rapid development turns into an attack.",
    sources: [
      {
        "title": "PGN Mentor — Morphy game scores",
        "url": "https://www.pgnmentor.com/players/Morphy.zip"
      }
    ],
  },
  {
    id: "anderssen-steinitz-1866-7",
    title: "Anderssen vs Steinitz — London",
    era: "Romantic era",
    white: "Adolf Anderssen",
    black: "Wilhelm Steinitz",
    year: 1866,
    event: "Anderssen–Steinitz match",
    date: "1866.??.??",
    result: "1-0",
    expectedPlies: 67,
    finalFen: "6rk/5N2/3p1b2/p1nqn3/1pp5/6Q1/P4PRP/1BR4K b - - 1 34",
    pgn: `[Event "Anderssen–Steinitz match"]
[Site "London"]
[Date "1866.??.??"]
[Round "7"]
[White "Adolf Anderssen"]
[Black "Wilhelm Steinitz"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Bc5 6. O-O d6 7. d4 exd4 8. cxd4 Bb6 9.
d5 Na5 10. Bb2 Ne7 11. Bd3 Ng6 12. Nc3 O-O 13. Qd2 Bd7 14. Ne2 c5 15. Ng3 Bc7 16. Bxg7
f6 17. Bxf8 Qxf8 18. Nf5 b5 19. Rac1 Nb7 20. Kh1 a5 21. g4 Re8 22. g5 c4 23. gxf6 Qxf6
24. Ng5 Ne5 25. Bb1 Nc5 26. Rg1 Kh8 27. Qc3 Bxf5 28. exf5 b4 29. Qg3 Bd8 30. Nxh7 Qf7
31. f6 Qxd5+ 32. Rg2 Rg8 33. Ng5 Bxf6 34. Nf7+ 1-0`,
    summary: "An attacking victory for Anderssen in the seventh game of his London match against Steinitz.",
    sources: [
      {
        "title": "PGN Mentor — Anderssen game scores",
        "url": "https://www.pgnmentor.com/players/Anderssen.zip"
      }
    ],
  },
  {
    id: "zukertort-blackburne-1883",
    title: "Zukertort’s London combination",
    era: "Romantic era",
    white: "Johannes Zukertort",
    black: "Joseph Henry Blackburne",
    year: 1883,
    event: "London tournament",
    date: "1883.??.??",
    result: "1-0",
    expectedPlies: 65,
    finalFen: "6k1/pb2Q1B1/1p6/2rP4/8/1P2R3/P1r3PP/6K1 b - - 0 33",
    pgn: `[Event "London tournament"]
[Site "London"]
[Date "1883.??.??"]
[Round "?"]
[White "Johannes Zukertort"]
[Black "Joseph Henry Blackburne"]
[Result "1-0"]

1. c4 e6 2. e3 Nf6 3. Nf3 b6 4. Be2 Bb7 5. O-O d5 6. d4 Bd6 7. Nc3 O-O 8. b3 Nbd7 9. Bb2
Qe7 10. Nb5 Ne4 11. Nxd6 cxd6 12. Nd2 Ndf6 13. f3 Nxd2 14. Qxd2 dxc4 15. Bxc4 d5 16. Bd3
Rfc8 17. Rae1 Rc7 18. e4 Rac8 19. e5 Ne8 20. f4 g6 21. Re3 f5 22. exf6 Nxf6 23. f5 Ne4
24. Bxe4 dxe4 25. fxg6 Rc2 26. gxh7+ Kh8 27. d5+ e5 28. Qb4 R8c5 29. Rf8+ Kxh7 30. Qxe4+
Kg7 31. Bxe5+ Kxf8 32. Bg7+ Kg8 33. Qxe7 1-0`,
    summary: "Zukertort builds pressure against Blackburne’s king and offers his queen during the decisive combination.",
    sources: [
      {
        "title": "PGN Mentor — Zukertort game scores",
        "url": "https://www.pgnmentor.com/players/Zukertort.zip"
      }
    ],
  },
  {
    id: "steinitz-zukertort-1886-20",
    title: "The first world title — Game 20",
    era: "Romantic era",
    white: "Wilhelm Steinitz",
    black: "Johannes Zukertort",
    year: 1886,
    event: "World Championship, Game 20",
    date: "1886.??.??",
    result: "1-0",
    expectedPlies: 37,
    finalFen: "r6r/pppbbk1p/7p/3P4/6N1/3B1NP1/PPP3K1/R3Q3 b - - 0 19",
    pgn: `[Event "World Championship, Game 20"]
[Site "USA"]
[Date "1886.??.??"]
[Round "20"]
[White "Wilhelm Steinitz"]
[Black "Johannes Zukertort"]
[Result "1-0"]

1. e4 e5 2. Nc3 Nc6 3. f4 exf4 4. d4 d5 5. exd5 Qh4+ 6. Ke2 Qe7+ 7. Kf2 Qh4+ 8. g3 fxg3+
9. Kg2 Nxd4 10. hxg3 Qg4 11. Qe1+ Be7 12. Bd3 Nf5 13. Nf3 Bd7 14. Bf4 f6 15. Ne4 Ngh6
16. Bxh6 Nxh6 17. Rxh6 gxh6 18. Nxf6+ Kf7 19. Nxg4 1-0`,
    summary: "Steinitz wins the twentieth game of the first official World Championship match against Zukertort.",
    sources: [
      {
        "title": "PGN Mentor — Steinitz game scores",
        "url": "https://www.pgnmentor.com/players/Steinitz.zip"
      }
    ],
  },
  {
    id: "lasker-bauer-1889",
    title: "Lasker’s double bishop sacrifice",
    era: "Champions",
    white: "Emanuel Lasker",
    black: "Johann Hermann Bauer",
    year: 1889,
    event: "Amsterdam tournament",
    date: "1889.??.??",
    result: "1-0",
    expectedPlies: 75,
    finalFen: "8/8/1p1rk3/8/7P/1P1Q4/P1PP2P1/6K1 b - - 0 38",
    pgn: `[Event "Amsterdam tournament"]
[Site "Amsterdam"]
[Date "1889.??.??"]
[Round "?"]
[White "Emanuel Lasker"]
[Black "Johann Hermann Bauer"]
[Result "1-0"]

1. f4 d5 2. e3 Nf6 3. b3 e6 4. Bb2 Be7 5. Bd3 b6 6. Nf3 Bb7 7. Nc3 Nbd7
8. O-O O-O 9. Ne2 c5 10. Ng3 Qc7 11. Ne5 Nxe5 12. Bxe5 Qc6 13. Qe2 a6
14. Nh5 Nxh5 15. Bxh7+ Kxh7 16. Qxh5+ Kg8 17. Bxg7 Kxg7 18. Qg4+ Kh7 19. Rf3 e5
20. Rh3+ Qh6 21. Rxh6+ Kxh6 22. Qd7 Bf6 23. Qxb7 Kg7 24. Rf1 Rab8 25. Qd7 Rfd8
26. Qg4+ Kf8 27. fxe5 Bg7 28. e6 Rb7 29. Qg6 f6 30. Rxf6+ Bxf6 31. Qxf6+ Ke8
32. Qh8+ Ke7 33. Qg7+ Kxe6 34. Qxb7 Rd6 35. Qxa6 d4 36. exd4 cxd4 37. h4 d3
38. Qxd3 1-0`,
    summary: "The future world champion sacrificed both bishops to open the pawn cover around Bauer’s king. The game helped make this attacking pattern one of chess’s best-known combinations.",
    sources: [
      {
        "title": "PGN Mentor — Lasker game records",
        "url": "https://www.pgnmentor.com/players/Lasker/Lasker.pgn"
      }
    ],
  },
  {
    id: "pillsbury-tarrasch-1895",
    title: "Pillsbury vs Tarrasch — Hastings",
    era: "Romantic era",
    white: "Harry Nelson Pillsbury",
    black: "Siegbert Tarrasch",
    year: 1895,
    event: "Hastings tournament",
    date: "1895.??.??",
    result: "1-0",
    expectedPlies: 103,
    finalFen: "8/7Q/8/6pk/1p1Pp3/1r2P2P/2p5/7K b - - 0 52",
    pgn: `[Event "Hastings tournament"]
[Site "Hastings"]
[Date "1895.??.??"]
[Round "?"]
[White "Harry Nelson Pillsbury"]
[Black "Siegbert Tarrasch"]
[Result "1-0"]

1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. Nf3 Nbd7 6. Rc1 O-O 7. e3 b6 8. cxd5 exd5 9.
Bd3 Bb7 10. O-O c5 11. Re1 c4 12. Bb1 a6 13. Ne5 b5 14. f4 Re8 15. Qf3 Nf8 16. Ne2 Ne4
17. Bxe7 Rxe7 18. Bxe4 dxe4 19. Qg3 f6 20. Ng4 Kh8 21. f5 Qd7 22. Rf1 Rd8 23. Rf4 Qd6
24. Qh4 Rde8 25. Nc3 Bd5 26. Nf2 Qc6 27. Rf1 b4 28. Ne2 Qa4 29. Ng4 Nd7 30. R4f2 Kg8 31.
Nc1 c3 32. b3 Qc6 33. h3 a5 34. Nh2 a4 35. g4 axb3 36. axb3 Ra8 37. g5 Ra3 38. Ng4 Bxb3
39. Rg2 Kh8 40. gxf6 gxf6 41. Nxb3 Rxb3 42. Nh6 Rg7 43. Rxg7 Kxg7 44. Qg3+ Kxh6 45. Kh1
Qd5 46. Rg1 Qxf5 47. Qh4+ Qh5 48. Qf4+ Qg5 49. Rxg5 fxg5 50. Qd6+ Kh5 51. Qxd7 c2 52.
Qxh7# 1-0`,
    summary: "Pillsbury faces Tarrasch in the 1895 Hastings tournament. Study the coordination of White’s pieces in this winning score.",
    sources: [
      {
        "title": "PGN Mentor — Pillsbury game scores",
        "url": "https://www.pgnmentor.com/players/Pillsbury.zip"
      }
    ],
  },
  {
    id: "steinitz-bardeleben-1895",
    title: "Steinitz’s unstoppable rook",
    era: "Champions",
    white: "Wilhelm Steinitz",
    black: "Curt von Bardeleben",
    year: 1895,
    event: "Hastings tournament",
    date: "1895.08.17",
    result: "1-0",
    expectedPlies: 49,
    finalFen: "r1r4k/pp1q3R/5pp1/3p2N1/6Q1/8/PP3PPP/2R3K1 b - - 0 25",
    pgn: `[Event "Hastings tournament"]
[Site "Hastings"]
[Date "1895.08.17"]
[Round "10"]
[White "Wilhelm Steinitz"]
[Black "Curt von Bardeleben"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Nc3 d5
8. exd5 Nxd5 9. O-O Be6 10. Bg5 Be7 11. Bxd5 Bxd5 12. Nxd5 Qxd5 13. Bxe7 Nxe7
14. Re1 f6 15. Qe2 Qd7 16. Rac1 c6 17. d5 cxd5 18. Nd4 Kf7 19. Ne6 Rhc8 20. Qg4 g6
21. Ng5+ Ke8 22. Rxe7+ Kf8 23. Rf7+ Kg8 24. Rg7+ Kh8 25. Rxh7+ 1-0`,
    summary: "The first world champion sends his rook along the seventh rank while Black cannot capture it. The played score ends at 25.Rxh7+; the longer mating finish often shown with this game was demonstrated afterward.",
    sources: [
      {
        "title": "PGN Mentor — Steinitz game records",
        "url": "https://www.pgnmentor.com/players/Steinitz/Steinitz.pgn"
      },
      {
        "title": "Edward Winter — Steinitz v von Bardeleben",
        "url": "https://www.chesshistory.com/winter/extra/steinitzvonbardeleben.html"
      }
    ],
  },
  {
    id: "rotlewi-rubinstein-1907",
    title: "Rubinstein’s Immortal Game",
    era: "Champions",
    white: "Georg Rotlewi",
    black: "Akiba Rubinstein",
    year: 1907,
    event: "Łódź tournament",
    date: "1907.12.26",
    result: "0-1",
    expectedPlies: 50,
    finalFen: "6k1/5ppp/pb2p3/1p2P3/1P2bPnP/P6r/1B4QP/R4R1K w - - 2 26",
    pgn: `[Event "Łódź tournament"]
[Site "Łódź"]
[Date "1907.12.26"]
[Round "?"]
[White "Georg Rotlewi"]
[Black "Akiba Rubinstein"]
[Result "0-1"]

1. d4 d5 2. Nf3 e6 3. e3 c5 4. c4 Nc6 5. Nc3 Nf6 6. dxc5 Bxc5 7. a3 a6 8. b4 Bd6
9. Bb2 O-O 10. Qd2 Qe7 11. Bd3 dxc4 12. Bxc4 b5 13. Bd3 Rd8 14. Qe2 Bb7 15. O-O Ne5
16. Nxe5 Bxe5 17. f4 Bc7 18. e4 Rac8 19. e5 Bb6+ 20. Kh1 Ng4 21. Be4 Qh4 22. g3 Rxc3
23. gxh4 Rd2 24. Qxd2 Bxe4+ 25. Qg2 Rh3 0-1`,
    summary: "Rubinstein allows his queen to be captured and continues the attack with rooks and bishops. The finish shows how coordinated pieces can overwhelm a king even when the attacking queen disappears.",
    sources: [
      {
        "title": "PGN Mentor — Rubinstein game records",
        "url": "https://www.pgnmentor.com/players/Rubinstein/Rubinstein.pgn"
      },
      {
        "title": "Edward Winter — Akiba Rubinstein Miscellanea",
        "url": "https://www.chesshistory.com/winter/extra/rubinstein2.html"
      }
    ],
  },
  {
    id: "levitsky-marshall-1912-6",
    title: "Marshall’s queen on g3",
    era: "Champions",
    white: "Stepan Levitsky",
    black: "Frank Marshall",
    year: 1912,
    event: "German Chess Congress, Breslau",
    date: "1912.??.??",
    result: "0-1",
    expectedPlies: 46,
    finalFen: "5rk1/pp4pp/4p3/2R3Q1/3n4/6qr/P1P2PPP/5RK1 w - - 2 24",
    pgn: `[Event "German Chess Congress, Breslau"]
[Site "Breslau"]
[Date "1912.??.??"]
[Round "6"]
[White "Stepan Levitsky"]
[Black "Frank Marshall"]
[Result "0-1"]

1. e4 e6 2. d4 d5 3. Nc3 c5 4. Nf3 Nc6 5. exd5 exd5 6. Be2 Nf6 7. O-O Be7 8. Bg5 O-O 9.
dxc5 Be6 10. Nd4 Bxc5 11. Nxe6 fxe6 12. Bg4 Qd6 13. Bh3 Rae8 14. Qd2 Bb4 15. Bxf6 Rxf6
16. Rad1 Qc5 17. Qe2 Bxc3 18. bxc3 Qxc3 19. Rxd5 Nd4 20. Qh5 Ref8 21. Re5 Rh6 22. Qg5
Rxh3 23. Rc5 Qg3 0-1`,
    summary: "Marshall ends this game with a queen move to g3. Replay the position to investigate the different ways White could capture it.",
    sources: [
      {
        "title": "PGN Mentor — Marshall game scores",
        "url": "https://www.pgnmentor.com/players/Marshall.zip"
      }
    ],
  },
  {
    id: "lasker-capablanca-1914",
    title: "Lasker vs Capablanca — St Petersburg",
    era: "Champions",
    white: "Emanuel Lasker",
    black: "José Raúl Capablanca",
    year: 1914,
    event: "St Petersburg, final stage",
    date: "1914.??.??",
    result: "1-0",
    expectedPlies: 83,
    finalFen: "R1bk1r2/7R/2p2p2/1pNnpPp1/1P4P1/6K1/2P5/8 b - - 7 42",
    pgn: `[Event "St Petersburg, final stage"]
[Site "St Petersburg"]
[Date "1914.??.??"]
[Round "?"]
[White "Emanuel Lasker"]
[Black "José Raúl Capablanca"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Bxc6 dxc6 5. d4 exd4 6. Qxd4 Qxd4 7. Nxd4 Bd6 8. Nc3
Ne7 9. O-O O-O 10. f4 Re8 11. Nb3 f6 12. f5 b6 13. Bf4 Bb7 14. Bxd6 cxd6 15. Nd4 Rad8
16. Ne6 Rd7 17. Rad1 Nc8 18. Rf2 b5 19. Rfd2 Rde7 20. b4 Kf7 21. a3 Ba8 22. Kf2 Ra7 23.
g4 h6 24. Rd3 a5 25. h4 axb4 26. axb4 Rae7 27. Kf3 Rg8 28. Kf4 g6 29. Rg3 g5+ 30. Kf3
Nb6 31. hxg5 hxg5 32. Rh3 Rd7 33. Kg3 Ke8 34. Rdh1 Bb7 35. e5 dxe5 36. Ne4 Nd5 37. N6c5
Bc8 38. Nxd7 Bxd7 39. Rh7 Rf8 40. Ra1 Kd8 41. Ra8+ Bc8 42. Nc5 1-0`,
    summary: "Lasker wins their encounter in the final stage of the St Petersburg tournament.",
    sources: [
      {
        "title": "PGN Mentor — Lasker game scores",
        "url": "https://www.pgnmentor.com/players/Lasker.zip"
      }
    ],
  },
  {
    id: "capablanca-marshall-1918",
    title: "Capablanca meets the Marshall Attack",
    era: "Champions",
    white: "José Raúl Capablanca",
    black: "Frank Marshall",
    year: 1918,
    event: "New York tournament",
    date: "1918.??.??",
    result: "1-0",
    expectedPlies: 71,
    finalFen: "5rk1/1P3Bp1/R6p/8/6P1/2B1rQ2/2K3P1/6q1 b - - 0 36",
    pgn: `[Event "New York tournament"]
[Site "New York"]
[Date "1918.??.??"]
[Round "?"]
[White "José Raúl Capablanca"]
[Black "Frank Marshall"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 O-O 8. c3 d5
9. exd5 Nxd5 10. Nxe5 Nxe5 11. Rxe5 Nf6 12. Re1 Bd6 13. h3 Ng4 14. Qf3 Qh4
15. d4 Nxf2 16. Re2 Bg4 17. hxg4 Bh2+ 18. Kf1 Bg3 19. Rxf2 Qh1+ 20. Ke2 Bxf2
21. Bd2 Bh4 22. Qh3 Rae8+ 23. Kd3 Qf1+ 24. Kc2 Bf2 25. Qf3 Qg1 26. Bd5 c5
27. dxc5 Bxc5 28. b4 Bd6 29. a4 a5 30. axb5 axb4 31. Ra6 bxc3 32. Nxc3 Bb4
33. b6 Bxc3 34. Bxc3 h6 35. b7 Re3 36. Bxf7+ 1-0`,
    summary: "Marshall challenged Capablanca with a pawn sacrifice in the Ruy Lopez at the New York tournament. Their encounter became closely associated with the opening now called the Marshall Attack.",
    sources: [
      {
        "title": "PGN Mentor — Capablanca game records",
        "url": "https://www.pgnmentor.com/players/Capablanca/Capablanca.pgn"
      }
    ],
  },
  {
    id: "capablanca-lasker-1921-11",
    title: "Capablanca takes the initiative — Game 11",
    era: "Champions",
    white: "José Raúl Capablanca",
    black: "Emanuel Lasker",
    year: 1921,
    event: "World Championship, Game 11",
    date: "1921.??.??",
    result: "1-0",
    expectedPlies: 95,
    finalFen: "5Q2/2R4p/1p1qpp1k/8/3P3P/3B2P1/5PK1/r7 b - - 0 48",
    pgn: `[Event "World Championship, Game 11"]
[Site "Havana"]
[Date "1921.??.??"]
[Round "11"]
[White "José Raúl Capablanca"]
[Black "Emanuel Lasker"]
[Result "1-0"]

1. d4 d5 2. Nf3 e6 3. c4 Nf6 4. Bg5 Nbd7 5. e3 Be7 6. Nc3 O-O 7. Rc1 Re8 8. Qc2 c6 9.
Bd3 dxc4 10. Bxc4 Nd5 11. Bxe7 Rxe7 12. O-O Nf8 13. Rfd1 Bd7 14. e4 Nb6 15. Bf1 Rc8 16.
b4 Be8 17. Qb3 Rec7 18. a4 Ng6 19. a5 Nd7 20. e5 b6 21. Ne4 Rb8 22. Qc3 Nf4 23. Nd6 Nd5
24. Qa3 f6 25. Nxe8 Qxe8 26. exf6 gxf6 27. b5 Rbc8 28. bxc6 Rxc6 29. Rxc6 Rxc6 30. axb6
axb6 31. Re1 Qc8 32. Nd2 Nf8 33. Ne4 Qd8 34. h4 Rc7 35. Qb3 Rg7 36. g3 Ra7 37. Bc4 Ra5
38. Nc3 Nxc3 39. Qxc3 Kf7 40. Qe3 Qd6 41. Qe4 Ra4 42. Qb7+ Kg6 43. Qc8 Qb4 44. Rc1 Qe7
45. Bd3+ Kh6 46. Rc7 Ra1+ 47. Kg2 Qd6 48. Qxf8+ 1-0`,
    summary: "Capablanca wins the eleventh game of his World Championship match against Lasker.",
    sources: [
      {
        "title": "PGN Mentor — Capablanca game scores",
        "url": "https://www.pgnmentor.com/players/Capablanca.zip"
      }
    ],
  },
  {
    id: "bogoljubow-alekhine-1922",
    title: "Alekhine’s Hastings attack",
    era: "Champions",
    white: "Efim Bogoljubow",
    black: "Alexander Alekhine",
    year: 1922,
    event: "Hastings tournament",
    date: "1922.??.??",
    result: "0-1",
    expectedPlies: 106,
    finalFen: "8/8/4kp1p/3p3P/4KP2/8/8/8 w - - 0 54",
    pgn: `[Event "Hastings tournament"]
[Site "Hastings"]
[Date "1922.??.??"]
[Round "?"]
[White "Efim Bogoljubow"]
[Black "Alexander Alekhine"]
[Result "0-1"]

1. d4 f5 2. c4 Nf6 3. g3 e6 4. Bg2 Bb4+ 5. Bd2 Bxd2+ 6. Nxd2 Nc6 7. Ngf3 O-O 8. O-O d6
9. Qb3 Kh8 10. Qc3 e5 11. e3 a5 12. b3 Qe8 13. a3 Qh5 14. h4 Ng4 15. Ng5 Bd7 16. f3 Nf6
17. f4 e4 18. Rfd1 h6 19. Nh3 d5 20. Nf1 Ne7 21. a4 Nc6 22. Rd2 Nb4 23. Bh1 Qe8 24. Rg2
dxc4 25. bxc4 Bxa4 26. Nf2 Bd7 27. Nd2 b5 28. Nd1 Nd3 29. Rxa5 b4 30. Rxa8 bxc3 31. Rxe8
c2 32. Rxf8+ Kh7 33. Nf2 c1=Q+ 34. Nf1 Ne1 35. Rh2 Qxc4 36. Rb8 Bb5 37. Rxb5 Qxb5 38. g4
Nf3+ 39. Bxf3 exf3 40. gxf5 Qe2 41. d5 Kg8 42. h5 Kh7 43. e4 Nxe4 44. Nxe4 Qxe4 45. d6
cxd6 46. f6 gxf6 47. Rd2 Qe2 48. Rxe2 fxe2 49. Kf2 exf1=Q+ 50. Kxf1 Kg7 51. Kf2 Kf7 52.
Ke3 Ke6 53. Ke4 d5+ 0-1`,
    summary: "Alekhine wins with Black against Bogoljubow at Hastings. Follow the activity of his pieces and advancing pawns.",
    sources: [
      {
        "title": "PGN Mentor — Alekhine game scores",
        "url": "https://www.pgnmentor.com/players/Alekhine.zip"
      }
    ],
  },
  {
    id: "saemisch-nimzowitsch-1923",
    title: "The Immortal Zugzwang Game",
    era: "Champions",
    white: "Friedrich Sämisch",
    black: "Aron Nimzowitsch",
    year: 1923,
    event: "Copenhagen tournament",
    date: "1923.03.??",
    result: "0-1",
    expectedPlies: 50,
    finalFen: "6k1/3q2p1/p2bp2p/3p1r2/1p1Pp3/3bQ1PP/PP1B1rB1/1N2R1RK w - - 0 26",
    pgn: `[Event "Copenhagen tournament"]
[Site "Copenhagen"]
[Date "1923.03.??"]
[Round "?"]
[White "Friedrich Sämisch"]
[Black "Aron Nimzowitsch"]
[Result "0-1"]

1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Bb7 5. Bg2 Be7 6. Nc3 O-O 7. O-O d5 8. Ne5 c6
9. cxd5 cxd5 10. Bf4 a6 11. Rc1 b5 12. Qb3 Nc6 13. Nxc6 Bxc6 14. h3 Qd7 15. Kh2 Nh5
16. Bd2 f5 17. Qd1 b4 18. Nb1 Bb5 19. Rg1 Bd6 20. e4 fxe4 21. Qxh5 Rxf2 22. Qg5 Raf8
23. Kh1 R8f5 24. Qe3 Bd3 25. Rce1 h6 0-1`,
    summary: "Nimzowitsch restricts White’s pieces until the quiet 25...h6 leaves Sämisch without a satisfactory reply. This Copenhagen game became a famous example of domination and the pressure created by having to move.",
    sources: [
      {
        "title": "PGN Mentor — Nimzowitsch game records",
        "url": "https://www.pgnmentor.com/players/Nimzowitsch/Nimzowitsch.pgn"
      },
      {
        "title": "Edward Winter — Zugzwang",
        "url": "https://en.chessbase.com/newsroom/post/winter-on-i-zugzwang-i?page=0"
      }
    ],
  },
  {
    id: "capablanca-tartakower-1924",
    title: "Capablanca’s king leads the way",
    era: "Champions",
    white: "José Raúl Capablanca",
    black: "Savielly Tartakower",
    year: 1924,
    event: "New York tournament",
    date: "1924.??.??",
    result: "1-0",
    expectedPlies: 103,
    finalFen: "6k1/2R3P1/1pKP4/8/r7/8/8/8 b - - 0 52",
    pgn: `[Event "New York tournament"]
[Site "New York"]
[Date "1924.??.??"]
[Round "6"]
[White "José Raúl Capablanca"]
[Black "Savielly Tartakower"]
[Result "1-0"]

1. d4 e6 2. Nf3 f5 3. c4 Nf6 4. Bg5 Be7 5. Nc3 O-O 6. e3 b6 7. Bd3 Bb7 8. O-O Qe8
9. Qe2 Ne4 10. Bxe7 Nxc3 11. bxc3 Qxe7 12. a4 Bxf3 13. Qxf3 Nc6 14. Rfb1 Rae8
15. Qh3 Rf6 16. f4 Na5 17. Qf3 d6 18. Re1 Qd7 19. e4 fxe4 20. Qxe4 g6 21. g3 Kf8
22. Kg2 Rf7 23. h4 d5 24. cxd5 exd5 25. Qxe8+ Qxe8 26. Rxe8+ Kxe8 27. h5 Rf6
28. hxg6 hxg6 29. Rh1 Kf8 30. Rh7 Rc6 31. g4 Nc4 32. g5 Ne3+ 33. Kf3 Nf5
34. Bxf5 gxf5 35. Kg3 Rxc3+ 36. Kh4 Rf3 37. g6 Rxf4+ 38. Kg5 Re4 39. Kf6 Kg8
40. Rg7+ Kh8 41. Rxc7 Re8 42. Kxf5 Re4 43. Kf6 Rf4+ 44. Ke5 Rg4 45. g7+ Kg8
46. Rxa7 Rg1 47. Kxd5 Rc1 48. Kd6 Rc2 49. d5 Rc1 50. Rc7 Ra1 51. Kc6 Rxa4 52. d6 1-0`,
    summary: "Capablanca gives up pawns in a rook ending so his king can penetrate Black’s position. An active king, an advanced rook, and a passed pawn turn the ending into one of his most memorable wins.",
    sources: [
      {
        "title": "PGN Mentor — Capablanca game records",
        "url": "https://www.pgnmentor.com/players/Capablanca/Capablanca.pgn"
      },
      {
        "title": "ChessBase — New York 1924, round 6",
        "url": "https://en.chessbase.com/post/new-york-1924-round-6-lasker-and-lasker-play-remarkable-draw"
      }
    ],
  },
  {
    id: "reti-capablanca-1924",
    title: "Réti’s challenge to Capablanca",
    era: "Champions",
    white: "Richard Réti",
    black: "José Raúl Capablanca",
    year: 1924,
    event: "New York tournament",
    date: "1924.??.??",
    result: "1-0",
    expectedPlies: 61,
    finalFen: "4rnk1/2r2p2/1pNR2pp/pPqRn3/8/P3N1P1/1Q3PKP/8 b - - 8 31",
    pgn: `[Event "New York tournament"]
[Site "New York"]
[Date "1924.??.??"]
[Round "?"]
[White "Richard Réti"]
[Black "José Raúl Capablanca"]
[Result "1-0"]

1. Nf3 Nf6 2. c4 g6 3. b4 Bg7 4. Bb2 O-O 5. g3 b6 6. Bg2 Bb7 7. O-O d6 8. d3 Nbd7 9.
Nbd2 e5 10. Qc2 Re8 11. Rfd1 a5 12. a3 h6 13. Nf1 c5 14. b5 Nf8 15. e3 Qc7 16. d4 Be4
17. Qc3 exd4 18. exd4 N6d7 19. Qd2 cxd4 20. Bxd4 Qxc4 21. Bxg7 Kxg7 22. Qb2+ Kg8 23.
Rxd6 Qc5 24. Rad1 Ra7 25. Ne3 Qh5 26. Nd4 Bxg2 27. Kxg2 Qe5 28. Nc4 Qc5 29. Nc6 Rc7 30.
Ne3 Ne5 31. R1d5 1-0`,
    summary: "Réti wins with a flank opening against Capablanca in New York. Compare the battle for central squares with a traditional pawn center.",
    sources: [
      {
        "title": "PGN Mentor — Capablanca game scores",
        "url": "https://www.pgnmentor.com/players/Capablanca.zip"
      }
    ],
  },
  {
    id: "reti-alekhine-1925",
    title: "Alekhine’s Baden-Baden combination",
    era: "Champions",
    white: "Richard Réti",
    black: "Alexander Alekhine",
    year: 1925,
    event: "Baden-Baden tournament",
    date: "1925.04.25",
    result: "0-1",
    expectedPlies: 80,
    finalFen: "r5k1/1N3pp1/4b3/8/3n4/5BP1/4R2K/8 w - - 1 41",
    pgn: `[Event "Baden-Baden tournament"]
[Site "Baden-Baden"]
[Date "1925.04.25"]
[Round "8"]
[White "Richard Réti"]
[Black "Alexander Alekhine"]
[Result "0-1"]

1. g3 e5 2. Nf3 e4 3. Nd4 d5 4. d3 exd3 5. Qxd3 Nf6 6. Bg2 Bb4+ 7. Bd2 Bxd2+
8. Nxd2 O-O 9. c4 Na6 10. cxd5 Nb4 11. Qc4 Nbxd5 12. N2b3 c6 13. O-O Re8
14. Rfd1 Bg4 15. Rd2 Qc8 16. Nc5 Bh3 17. Bf3 Bg4 18. Bg2 Bh3 19. Bf3 Bg4
20. Bh1 h5 21. b4 a6 22. Rc1 h4 23. a4 hxg3 24. hxg3 Qc7 25. b5 axb5 26. axb5 Re3
27. Nf3 cxb5 28. Qxb5 Nc3 29. Qxb7 Qxb7 30. Nxb7 Nxe2+ 31. Kh2 Ne4 32. Rc4 Nxf2
33. Bg2 Be6 34. Rcc2 Ng4+ 35. Kh3 Ne5+ 36. Kh2 Rxf3 37. Rxe2 Ng4+ 38. Kh3 Ne3+
39. Kh2 Nxc2 40. Bxf3 Nd4 0-1`,
    summary: "Alekhine’s win over Réti is remembered for a rook left on e3 and a long sequence of coordinated threats. This replay uses the familiar score published by Alekhine; historical accounts differ on the preceding bishop repetitions.",
    sources: [
      {
        "title": "Edward Winter — Réti v Alekhine, published score variants",
        "url": "https://www.chesshistory.com/winter/extra/retialekhine.html"
      },
      {
        "title": "PGN Mentor — Alekhine game records",
        "url": "https://www.pgnmentor.com/players/Alekhine/Alekhine.pgn"
      }
    ],
  },
  {
    id: "alekhine-capablanca-1927-34",
    title: "Alekhine wins the title — Game 34",
    era: "Champions",
    white: "Alexander Alekhine",
    black: "José Raúl Capablanca",
    year: 1927,
    event: "World Championship, Game 34",
    date: "1927.??.??",
    result: "1-0",
    expectedPlies: 163,
    finalFen: "8/4R3/2k5/7K/5P1P/8/8/7r b - - 2 82",
    pgn: `[Event "World Championship, Game 34"]
[Site "Buenos Aires"]
[Date "1927.??.??"]
[Round "34"]
[White "Alexander Alekhine"]
[Black "José Raúl Capablanca"]
[Result "1-0"]

1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Nbd7 5. e3 c6 6. a3 Be7 7. Nf3 O-O 8. Bd3 dxc4 9.
Bxc4 Nd5 10. Bxe7 Qxe7 11. Ne4 N5f6 12. Ng3 c5 13. O-O Nb6 14. Ba2 cxd4 15. Nxd4 g6 16.
Rc1 Bd7 17. Qe2 Rac8 18. e4 e5 19. Nf3 Kg7 20. h3 h6 21. Qd2 Be6 22. Bxe6 Qxe6 23. Qa5
Nc4 24. Qxa7 Nxb2 25. Rxc8 Rxc8 26. Qxb7 Nc4 27. Qb4 Ra8 28. Ra1 Qc6 29. a4 Nxe4 30.
Nxe5 Qd6 31. Qxc4 Qxe5 32. Re1 Nd6 33. Qc1 Qf6 34. Ne4 Nxe4 35. Rxe4 Rb8 36. Re2 Ra8 37.
Ra2 Ra5 38. Qc7 Qa6 39. Qc3+ Kh7 40. Rd2 Qb6 41. Rd7 Qb1+ 42. Kh2 Qb8+ 43. g3 Rf5 44.
Qd4 Qe8 45. Rd5 Rf3 46. h4 Qh8 47. Qb6 Qa1 48. Kg2 Rf6 49. Qd4 Qxd4 50. Rxd4 Kg7 51. a5
Ra6 52. Rd5 Rf6 53. Rd4 Ra6 54. Ra4 Kf6 55. Kf3 Ke5 56. Ke3 h5 57. Kd3 Kd5 58. Kc3 Kc5
59. Ra2 Kb5 60. Kb3 Kc5 61. Kc3 Kb5 62. Kd4 Rd6+ 63. Ke5 Re6+ 64. Kf4 Ka6 65. Kg5 Re5+
66. Kh6 Rf5 67. f4 Rc5 68. Ra3 Rc7 69. Kg7 Rd7 70. f5 gxf5 71. Kh6 f4 72. gxf4 Rd5 73.
Kg7 Rf5 74. Ra4 Kb5 75. Re4 Ka6 76. Kh6 Rxa5 77. Re5 Ra1 78. Kxh5 Rg1 79. Rg5 Rh1 80.
Rf5 Kb6 81. Rxf7 Kc6 82. Re7 1-0`,
    summary: "The thirty-fourth game concludes Alekhine’s World Championship match against Capablanca.",
    sources: [
      {
        "title": "PGN Mentor — Alekhine game scores",
        "url": "https://www.pgnmentor.com/players/Alekhine.zip"
      }
    ],
  },
  {
    id: "alekhine-nimzowitsch-1930",
    title: "Alekhine’s Gun",
    era: "Champions",
    white: "Alexander Alekhine",
    black: "Aron Nimzowitsch",
    year: 1930,
    event: "San Remo tournament",
    date: "1930.01.18",
    result: "1-0",
    expectedPlies: 63,
    finalFen: "2rk4/p1rqn3/P1n1p1p1/3pPp1p/BP1P1P1P/2R2NP1/2R4K/2Q5 b - - 0 32",
    pgn: `[Event "San Remo tournament"]
[Site "San Remo"]
[Date "1930.01.18"]
[Round "3"]
[White "Alexander Alekhine"]
[Black "Aron Nimzowitsch"]
[Result "1-0"]

1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. e5 c5 5. Bd2 Ne7 6. Nb5 Bxd2+ 7. Qxd2 O-O 8. c3 b6
9. f4 Ba6 10. Nf3 Qd7 11. a4 Nbc6 12. b4 cxb4 13. cxb4 Bb7 14. Nd6 f5 15. a5 Nc8
16. Nxb7 Qxb7 17. a6 Qf7 18. Bb5 N8e7 19. O-O h6 20. Rfc1 Rfc8 21. Rc2 Qe8
22. Rac1 Rab8 23. Qe3 Rc7 24. Rc3 Qd7 25. R1c2 Kf8 26. Qc1 Rbc8 27. Ba4 b5
28. Bxb5 Ke8 29. Ba4 Kd8 30. h4 h5 31. Kh2 g6 32. g3 1-0`,
    summary: "Alekhine places his queen behind two rooks on the c-file and squeezes Nimzowitsch’s cramped position. The formation became known as Alekhine’s Gun, a lasting image of coordinated heavy pieces.",
    sources: [
      {
        "title": "PGN Mentor — Alekhine game records",
        "url": "https://www.pgnmentor.com/players/Alekhine/Alekhine.pgn"
      },
      {
        "title": "ChessBase — Alekhine wins San Remo 1930",
        "url": "https://de.chessbase.com/post/auf-dem-hoehepunkt-seiner-karriere-aljechin-gewinnt-in-san-remo-mit-14-aus-15"
      },
      {
        "title": "ChessBase — Mastering Chess Strategy, Alekhine–Nimzowitsch",
        "url": "https://books.chessbase.com/en/mastering-chess-strategy-vol-3/attack-your-opponents-weaknesses-1"
      }
    ],
  },
  {
    id: "euwe-alekhine-1935-26",
    title: "Euwe vs Alekhine — Game 26",
    era: "Champions",
    white: "Max Euwe",
    black: "Alexander Alekhine",
    year: 1935,
    event: "World Championship, Game 26",
    date: "1935.??.??",
    result: "1-0",
    expectedPlies: 93,
    finalFen: "8/p3r3/4R2p/1ppP2k1/2P1N3/8/PP1r3P/7K b - - 1 47",
    pgn: `[Event "World Championship, Game 26"]
[Site "NLD"]
[Date "1935.??.??"]
[Round "26"]
[White "Max Euwe"]
[Black "Alexander Alekhine"]
[Result "1-0"]

1. d4 e6 2. c4 f5 3. g3 Bb4+ 4. Bd2 Be7 5. Bg2 Nf6 6. Nc3 O-O 7. Nf3 Ne4 8. O-O b6 9.
Qc2 Bb7 10. Ne5 Nxc3 11. Bxc3 Bxg2 12. Kxg2 Qc8 13. d5 d6 14. Nd3 e5 15. Kh1 c6 16. Qb3
Kh8 17. f4 e4 18. Nb4 c5 19. Nc2 Nd7 20. Ne3 Bf6 21. Nxf5 Bxc3 22. Nxd6 Qb8 23. Nxe4 Bf6
24. Nd2 g5 25. e4 gxf4 26. gxf4 Bd4 27. e5 Qe8 28. e6 Rg8 29. Nf3 Qg6 30. Rg1 Bxg1 31.
Rxg1 Qf6 32. Ng5 Rg7 33. exd7 Rxd7 34. Qe3 Re7 35. Ne6 Rf8 36. Qe5 Qxe5 37. fxe5 Rf5 38.
Re1 h6 39. Nd8 Rf2 40. e6 Rd2 41. Nc6 Re8 42. e7 b5 43. Nd8 Kg7 44. Nb7 Kf6 45. Re6+ Kg5
46. Nd6 Rxe7 47. Ne4+ 1-0`,
    summary: "Euwe wins the twenty-sixth game of the World Championship match. Follow the changing balance between material and piece activity.",
    sources: [
      {
        "title": "PGN Mentor — Euwe game scores",
        "url": "https://www.pgnmentor.com/players/Euwe.zip"
      }
    ],
  },
  {
    id: "botvinnik-capablanca-1938",
    title: "Botvinnik’s central breakthrough",
    era: "Champions",
    white: "Mikhail Botvinnik",
    black: "José Raúl Capablanca",
    year: 1938,
    event: "AVRO tournament",
    date: "1938.11.22",
    result: "1-0",
    expectedPlies: 81,
    finalFen: "6k1/p3P2p/1p3Q2/3p3K/2pP2P1/1nP5/7P/4q3 b - - 2 41",
    pgn: `[Event "AVRO tournament"]
[Site "Netherlands"]
[Date "1938.11.22"]
[Round "11"]
[White "Mikhail Botvinnik"]
[Black "José Raúl Capablanca"]
[Result "1-0"]

1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 d5 5. a3 Bxc3+ 6. bxc3 c5 7. cxd5 exd5 8. Bd3 O-O
9. Ne2 b6 10. O-O Ba6 11. Bxa6 Nxa6 12. Bb2 Qd7 13. a4 Rfe8 14. Qd3 c4 15. Qc2 Nb8
16. Rae1 Nc6 17. Ng3 Na5 18. f3 Nb3 19. e4 Qxa4 20. e5 Nd7 21. Qf2 g6 22. f4 f5
23. exf6 Nxf6 24. f5 Rxe1 25. Rxe1 Re8 26. Re6 Rxe6 27. fxe6 Kg7 28. Qf4 Qe8
29. Qe5 Qe7 30. Ba3 Qxa3 31. Nh5+ gxh5 32. Qg5+ Kf8 33. Qxf6+ Kg8 34. e7 Qc1+
35. Kf2 Qc2+ 36. Kg3 Qd3+ 37. Kh4 Qe4+ 38. Kxh5 Qe2+ 39. Kh4 Qe4+ 40. g4 Qe1+ 41. Kh5
1-0`,
    summary: "The future world champion builds a central pawn advance against Capablanca and breaks through with successive piece sacrifices. His king then escapes the checks while the passed e-pawn decides the game.",
    sources: [
      {
        "title": "PGN Mentor — Botvinnik game records",
        "url": "https://www.pgnmentor.com/players/Botvinnik/Botvinnik.pgn"
      },
      {
        "title": "ChessBase — Botvinnik’s AVRO masterpiece",
        "url": "https://en.chessbase.com/post/avro-1938-round-11-botvinnik-masterpiece"
      },
      {
        "title": "ChessBase — Botvinnik–Capablanca score and context",
        "url": "https://en.chessbase.com/post/learn-from-the-great-patriarch-of-chess-mikhail-botvinnik"
      }
    ],
  },
  {
    id: "botvinnik-bronstein-1951-23",
    title: "Botvinnik’s late comeback — Game 23",
    era: "Champions",
    white: "Mikhail Botvinnik",
    black: "David Bronstein",
    year: 1951,
    event: "World Championship, Game 23",
    date: "1951.??.??",
    result: "1-0",
    expectedPlies: 113,
    finalFen: "2n5/1p2n3/1p4k1/3p2Bp/P2P3P/2K2B2/8/8 b - - 18 57",
    pgn: `[Event "World Championship, Game 23"]
[Site "Moscow"]
[Date "1951.??.??"]
[Round "23"]
[White "Mikhail Botvinnik"]
[Black "David Bronstein"]
[Result "1-0"]

1. d4 Nf6 2. c4 g6 3. g3 c6 4. Bg2 d5 5. cxd5 cxd5 6. Nc3 Bg7 7. Nh3 Bxh3 8. Bxh3 Nc6 9.
Bg2 e6 10. e3 O-O 11. Bd2 Rc8 12. O-O Nd7 13. Ne2 Qb6 14. Bc3 Rfd8 15. Nf4 Nf6 16. Qb3
Ne4 17. Qxb6 axb6 18. Be1 Na5 19. Nd3 Bf8 20. f3 Nd6 21. Bf2 Bh6 22. Rac1 Nac4 23. Rfe1
Na5 24. Kf1 Bg7 25. g4 Nc6 26. b3 Nb5 27. Ke2 Bf8 28. a4 Nc7 29. Bg3 Na6 30. Bf1 f6 31.
Red1 Na5 32. Rxc8 Rxc8 33. Rc1 Rxc1 34. Nxc1 Ba3 35. Kd1 Bxc1 36. Kxc1 Nxb3+ 37. Kc2 Na5
38. Kc3 Kf7 39. e4 f5 40. gxf5 gxf5 41. Bd3 Kg6 42. Bd6 Nc6 43. Bb1 Kf6 44. Bg3 fxe4 45.
fxe4 h6 46. Bf4 h5 47. exd5 exd5 48. h4 Nab8 49. Bg5+ Kf7 50. Bf5 Na7 51. Bf4 Nbc6 52.
Bd3 Nc8 53. Be2 Kg6 54. Bd3+ Kf6 55. Be2 Kg6 56. Bf3 N6e7 57. Bg5 1-0`,
    summary: "Botvinnik wins the penultimate game of his World Championship match against Bronstein.",
    sources: [
      {
        "title": "PGN Mentor — Botvinnik game scores",
        "url": "https://www.pgnmentor.com/players/Botvinnik.zip"
      }
    ],
  },
  {
    id: "geller-euwe-1953-2",
    title: "Euwe’s counterattack in Zürich",
    era: "Champions",
    white: "Efim Geller",
    black: "Max Euwe",
    year: 1953,
    event: "Candidates tournament, Zürich",
    date: "1953.??.??",
    result: "0-1",
    expectedPlies: 52,
    finalFen: "4n2Q/pb1p1kp1/5p1B/1p6/3P3R/P4qN1/6rP/2R1K3 w - - 4 27",
    pgn: `[Event "Candidates tournament, Zürich"]
[Site "Zuerich"]
[Date "1953.??.??"]
[Round "2"]
[White "Efim Geller"]
[Black "Max Euwe"]
[Result "0-1"]

1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 c5 5. a3 Bxc3+ 6. bxc3 b6 7. Bd3 Bb7 8. f3 Nc6 9.
Ne2 O-O 10. O-O Na5 11. e4 Ne8 12. Ng3 cxd4 13. cxd4 Rc8 14. f4 Nxc4 15. f5 f6 16. Rf4
b5 17. Rh4 Qb6 18. e5 Nxe5 19. fxe6 Nxd3 20. Qxd3 Qxe6 21. Qxh7+ Kf7 22. Bh6 Rh8 23.
Qxh8 Rc2 24. Rc1 Rxg2+ 25. Kf1 Qb3 26. Ke1 Qf3 0-1`,
    summary: "Euwe meets Geller’s attack with active counterplay in the second round of the 1953 Candidates tournament.",
    sources: [
      {
        "title": "PGN Mentor — Geller game scores",
        "url": "https://www.pgnmentor.com/players/Geller.zip"
      }
    ],
  },
  {
    id: "byrne-fischer-1956",
    title: "The Game of the Century",
    era: "Champions",
    white: "Donald Byrne",
    black: "Bobby Fischer",
    year: 1956,
    event: "Rosenwald Memorial tournament",
    date: "1956.??.??",
    result: "0-1",
    expectedPlies: 82,
    finalFen: "1Q6/5pk1/2p3p1/1p2N2p/1b5P/1bn5/2r3P1/2K5 w - - 16 42",
    pgn: `[Event "Rosenwald Memorial tournament"]
[Site "New York"]
[Date "1956.??.??"]
[Round "?"]
[White "Donald Byrne"]
[Black "Bobby Fischer"]
[Result "0-1"]

1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6
8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4
14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxb6 Bxc4+ 19. Kg1 Ne2+
20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1
26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4
32. Qb8 b5 33. h4 h5 34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+
38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+ 41. Kc1 Rc2# 0-1`,
    summary: "Fischer’s game against Donald Byrne became known as the Game of the Century. A queen sacrifice leads to a series of forcing moves and a final rook mate.",
    sources: [
      {
        "title": "PGN Mentor — Fischer game records",
        "url": "https://www.pgnmentor.com/players/Fischer/Fischer.pgn"
      }
    ],
  },
  {
    id: "tal-tolush-1957",
    title: "Tal’s attack against Tolush",
    era: "Champions",
    white: "Mikhail Tal",
    black: "Alexander Tolush",
    year: 1957,
    event: "USSR Championship",
    date: "1957.??.??",
    result: "1-0",
    expectedPlies: 83,
    finalFen: "1n4k1/4q1r1/4R2Q/2pP2p1/2p5/8/PP6/2K2R2 b - - 0 42",
    pgn: `[Event "USSR Championship"]
[Site "Moscow"]
[Date "1957.??.??"]
[Round "21"]
[White "Mikhail Tal"]
[Black "Alexander Tolush"]
[Result "1-0"]

1. c4 Nf6 2. Nc3 g6 3. e4 d6 4. d4 Bg7 5. f3 e5 6. Nge2 Nbd7 7. Bg5 c6 8. Qd2 O-O
9. d5 c5 10. g4 a6 11. Ng3 Re8 12. h4 Qa5 13. Bh6 Nf8 14. h5 Qc7 15. Bd3 b5
16. O-O-O bxc4 17. Bb1 Bh8 18. Rdg1 Rb8 19. Nf5 N6d7 20. Bg5 Bg7 21. Nxg7 Kxg7
22. Bh6+ Kg8 23. f4 exf4 24. Qxf4 Qd8 25. hxg6 Nxg6 26. Qh2 Nde5 27. Bf4 Nf8
28. Qh6 Neg6 29. Bg5 f6 30. e5 Rxe5 31. Bxg6 Rb7 32. Ne4 fxg5 33. Rf1 Rxe4
34. Bxe4 Rg7 35. Rf6 Bxg4 36. Rhf1 Nd7 37. Rxd6 Qe7 38. Rxa6 Kh8 39. Bxh7 Nb8
40. Bf5+ Kg8 41. Be6+ Bxe6 42. Rxe6 1-0`,
    summary: "Tal launches a kingside attack against Tolush in the 1957 Soviet Championship. The game ends with a rook capture on e6 after a sequence of sacrifices and exchanges.",
    sources: [
      {
        "title": "PGN Mentor — Tal game records",
        "url": "https://www.pgnmentor.com/players/Tal/Tal.pgn"
      }
    ],
  },
  {
    id: "tal-smyslov-1959",
    title: "Tal’s queen offer against Smyslov",
    era: "Champions",
    white: "Mikhail Tal",
    black: "Vasily Smyslov",
    year: 1959,
    event: "Candidates Tournament",
    date: "1959.??.??",
    result: "1-0",
    expectedPlies: 51,
    finalFen: "r1b5/p5pp/1bN1k3/8/2pBn3/4K3/1PP2PPP/R6R b - - 4 26",
    pgn: `[Event "Candidates Tournament"]
[Site "Bled/Zagreb/Belgrade"]
[Date "1959.??.??"]
[Round "8"]
[White "Mikhail Tal"]
[Black "Vasily Smyslov"]
[Result "1-0"]

1. e4 c6 2. d3 d5 3. Nd2 e5 4. Ngf3 Nd7 5. d4 dxe4 6. Nxe4 exd4 7. Qxd4 Ngf6
8. Bg5 Be7 9. O-O-O O-O 10. Nd6 Qa5 11. Bc4 b5 12. Bd2 Qa6 13. Nf5 Bd8
14. Qh4 bxc4 15. Qg5 Nh5 16. Nh6+ Kh8 17. Qxh5 Qxa2 18. Bc3 Nf6 19. Qxf7 Qa1+
20. Kd2 Rxf7 21. Nxf7+ Kg8 22. Rxa1 Kxf7 23. Ne5+ Ke6 24. Nxc6 Ne4+ 25. Ke3 Bb6+
26. Bd4 1-0`,
    summary: "Tal offers his queen against former world champion Smyslov in the 1959 Candidates Tournament. His remaining pieces carry the attack through to a 26-move victory.",
    sources: [
      {
        "title": "PGN Mentor — Tal game records",
        "url": "https://www.pgnmentor.com/players/Tal/Tal.pgn"
      },
      {
        "title": "Chessgames — Tal vs Smyslov, Candidates round 8",
        "url": "https://www.chessgames.com/perl/chessgame?gid=1139475"
      }
    ],
  },
  {
    id: "spassky-bronstein-1960",
    title: "Spassky’s King’s Gambit attack",
    era: "Champions",
    white: "Boris Spassky",
    black: "David Bronstein",
    year: 1960,
    event: "27th USSR Championship",
    date: "1960.??.??",
    result: "1-0",
    expectedPlies: 45,
    finalFen: "r3rn2/ppp1q1pk/7p/2P1N3/3PQ3/1B6/PP4PP/5RK1 b - - 2 23",
    pgn: `[Event "27th USSR Championship"]
[Site "Leningrad"]
[Date "1960.??.??"]
[Round "?"]
[White "Boris Spassky"]
[Black "David Bronstein"]
[Result "1-0"]

1. e4 e5 2. f4 exf4 3. Nf3 d5 4. exd5 Bd6 5. Nc3 Ne7 6. d4 O-O 7. Bd3 Nd7 8. O-O h6
9. Ne4 Nxd5 10. c4 Ne3 11. Bxe3 fxe3 12. c5 Be7 13. Bc2 Re8 14. Qd3 e2 15. Nd6 Nf8
16. Nxf7 exf1=Q+ 17. Rxf1 Bf5 18. Qxf5 Qd7 19. Qf4 Bf6 20. N3e5 Qe7 21. Bb3 Bxe5
22. Nxe5+ Kh7 23. Qe4+ 1-0`,
    summary: "Spassky sacrifices a rook in a sharp King’s Gambit and brings his queen and knights into the attack. The game’s final combination also inspired the chess scene in From Russia with Love.",
    sources: [
      {
        "title": "PGN Mentor — Spassky game records",
        "url": "https://www.pgnmentor.com/players/Spassky/Spassky.pgn"
      },
      {
        "title": "Spassky’s account — Soviet Chess History",
        "url": "https://dgriffinchess.wordpress.com/2018/01/05/spasskys-annotations-to-his-famous-win-v-bronstein-27th-ussr-ch-leningrad-1960/"
      }
    ],
  },
  {
    id: "botvinnik-tal-1960-game-6",
    title: "Tal–Botvinnik, World Championship game 6",
    era: "Champions",
    white: "Mikhail Botvinnik",
    black: "Mikhail Tal",
    year: 1960,
    event: "Tal–Botvinnik World Championship",
    date: "1960.03.26",
    result: "0-1",
    expectedPlies: 92,
    finalFen: "8/2R4p/6p1/8/3k1P2/2p3KP/8/4r3 w - - 2 47",
    pgn: `[Event "Tal–Botvinnik World Championship"]
[Site "Moscow"]
[Date "1960.03.26"]
[Round "6"]
[White "Mikhail Botvinnik"]
[Black "Mikhail Tal"]
[Result "0-1"]

1. c4 Nf6 2. Nf3 g6 3. g3 Bg7 4. Bg2 O-O 5. d4 d6 6. Nc3 Nbd7 7. O-O e5 8. e4 c6
9. h3 Qb6 10. d5 cxd5 11. cxd5 Nc5 12. Ne1 Bd7 13. Nd3 Nxd3 14. Qxd3 Rfc8
15. Rb1 Nh5 16. Be3 Qb4 17. Qe2 Rc4 18. Rfc1 Rac8 19. Kh2 f5 20. exf5 Bxf5
21. Ra1 Nf4 22. gxf4 exf4 23. Bd2 Qxb2 24. Rab1 f3 25. Rxb2 fxe2 26. Rb3 Rd4
27. Be1 Be5+ 28. Kg1 Bf4 29. Nxe2 Rxc1 30. Nxd4 Rxe1+ 31. Bf1 Be4 32. Ne2 Be5
33. f4 Bf6 34. Rxb7 Bxd5 35. Rc7 Bxa2 36. Rxa7 Bc4 37. Ra8+ Kf7 38. Ra7+ Ke6
39. Ra3 d5 40. Kf2 Bh4+ 41. Kg2 Kd6 42. Ng3 Bxg3 43. Bxc4 dxc4 44. Kxg3 Kd5
45. Ra7 c3 46. Rc7 Kd4 0-1`,
    summary: "In the sixth game of his world championship challenge, Tal sacrificed a knight against Botvinnik and created a sharp struggle. This victory is one of the defining games of their 1960 match.",
    sources: [
      {
        "title": "PGN Mentor — World Championship 1960",
        "url": "https://www.pgnmentor.com/events/WorldChamp1960.pgn"
      },
      {
        "title": "US Chess — Tal Move by Move, game 6 record",
        "url": "https://new.uschess.org/news/review-tal-move-by-move"
      }
    ],
  },
  {
    id: "tal-hecht-1962",
    title: "Tal’s queen sacrifice in Varna",
    era: "Champions",
    white: "Mikhail Tal",
    black: "Hans-Joachim Hecht",
    year: 1962,
    event: "Chess Olympiad",
    date: "1962.??.??",
    result: "1-0",
    expectedPlies: 97,
    finalFen: "8/p7/6P1/6R1/3p1K2/5P2/P1k5/6r1 b - - 3 49",
    pgn: `[Event "Chess Olympiad"]
[Site "Varna"]
[Date "1962.??.??"]
[Round "9"]
[White "Mikhail Tal"]
[Black "Hans-Joachim Hecht"]
[Result "1-0"]

1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. Nc3 Bb4 5. Bg5 Bb7 6. e3 h6 7. Bh4 Bxc3+
8. bxc3 d6 9. Nd2 e5 10. f3 Qe7 11. e4 Nbd7 12. Bd3 Nf8 13. c5 dxc5 14. dxe5 Qxe5
15. Qa4+ c6 16. O-O Ng6 17. Nc4 Qe6 18. e5 b5 19. exf6 bxa4 20. fxg7 Rg8
21. Bf5 Nxh4 22. Bxe6 Ba6 23. Nd6+ Ke7 24. Bc4 Rxg7 25. g3 Kxd6 26. Bxa6 Nf5
27. Rab1 f6 28. Rfd1+ Ke7 29. Re1+ Kd6 30. Kf2 c4 31. g4 Ne7 32. Rb7 Rag8
33. Bxc4 Nd5 34. Bxd5 cxd5 35. Rb4 Rc8 36. Rxa4 Rxc3 37. Ra6+ Kc5 38. Rxf6 h5
39. h3 hxg4 40. hxg4 Rh7 41. g5 Rh5 42. Rf5 Rc2+ 43. Kg3 Kc4 44. Ree5 d4
45. g6 Rh1 46. Rc5+ Kd3 47. Rxc2 Kxc2 48. Kf4 Rg1 49. Rg5 1-0`,
    summary: "Tal allows his queen to be captured during this Olympiad game against Hecht. The struggle continues into a rook ending before Tal wins on move 49.",
    sources: [
      {
        "title": "PGN Mentor — Tal game records",
        "url": "https://www.pgnmentor.com/players/Tal/Tal.pgn"
      },
      {
        "title": "ChessBase — Tal vs Hecht, Varna 1962",
        "url": "https://tutorials3.chessbase.com/en/modern-classics/tal-hecht-1962"
      }
    ],
  },
  {
    id: "gaprindashvili-bykova-1962-10",
    title: "Gaprindashvili vs Bykova — Game 10",
    era: "Champions",
    white: "Nona Gaprindashvili",
    black: "Elisaveta Bykova",
    year: 1962,
    event: "Women’s World Championship, Game 10",
    date: "1962.??.??",
    result: "1-0",
    expectedPlies: 114,
    finalFen: "8/2R4p/4k2K/8/4b1PP/8/8/8 w - - 1 58",
    pgn: `[Event "Women’s World Championship, Game 10"]
[Site "Moscow"]
[Date "1962.??.??"]
[Round "10"]
[White "Nona Gaprindashvili"]
[Black "Elisaveta Bykova"]
[Result "1-0"]

1. e4 c5 2. Nc3 Nc6 3. f4 e6 4. Nf3 d5 5. Bb5 Ne7 6. exd5 exd5 7. Ne5 a6 8. Bxc6+ Nxc6
9. O-O Be7 10. Qf3 Be6 11. Nxc6 bxc6 12. f5 Bd7 13. d3 O-O 14. Bd2 Rb8 15. b3 Bf6 16.
Rad1 Re8 17. Na4 Be5 18. Kh1 Qe7 19. Rde1 Qd6 20. Be3 d4 21. Bg1 f6 22. Nb2 Qd5 23. Re4
Bc7 24. Nc4 Rxe4 25. dxe4 Qf7 26. c3 Be5 27. Rd1 dxc3 28. Nxe5 fxe5 29. Qxc3 c4 30. Qxe5
Rb5 31. Qd6 cxb3 32. axb3 Be8 33. b4 a5 34. bxa5 Rxa5 35. Qb8 Rb5 36. Qf4 Qe7 37. Bd4 c5
38. Bc3 Rb3 39. Qg3 Rb7 40. f6 Qf7 41. fxg7 Qe6 42. h3 Qxe4 43. Kh2 Qg6 44. Qe5 Rxg7 45.
Qxg7+ Qxg7 46. Bxg7 Kxg7 47. Rc1 Bf7 48. Rxc5 Bg6 49. Kg3 Be4 50. Kf4 Bd3 51. Rc7+ Kf6
52. Rc6+ Kf7 53. Kg5 Bb1 54. Rc7+ Ke6 55. Kh6 Be4 56. g4 Bg2 57. h4 Be4 1-0`,
    summary: "A victory for Nona Gaprindashvili in her 1962 Women’s World Championship match against Elisaveta Bykova.",
    sources: [
      {
        "title": "PGN Mentor — Gaprindashvili game scores",
        "url": "https://www.pgnmentor.com/players/Gaprindashvili.zip"
      }
    ],
  },
  {
    id: "byrne-fischer-1963-3",
    title: "Fischer’s attack against Robert Byrne",
    era: "Champions",
    white: "Robert Byrne",
    black: "Bobby Fischer",
    year: 1963,
    event: "US Championship",
    date: "1963.??.??",
    result: "0-1",
    expectedPlies: 42,
    finalFen: "r3r1k1/pb1q1pbp/1p4p1/8/3N4/BPN3P1/P2Q3P/R2R1K2 w - - 3 22",
    pgn: `[Event "US Championship"]
[Site "New York"]
[Date "1963.??.??"]
[Round "3"]
[White "Robert Byrne"]
[Black "Bobby Fischer"]
[Result "0-1"]

1. d4 Nf6 2. c4 g6 3. g3 c6 4. Bg2 d5 5. cxd5 cxd5 6. Nc3 Bg7 7. e3 O-O 8. Nge2 Nc6 9.
O-O b6 10. b3 Ba6 11. Ba3 Re8 12. Qd2 e5 13. dxe5 Nxe5 14. Rfd1 Nd3 15. Qc2 Nxf2 16.
Kxf2 Ng4+ 17. Kg1 Nxe3 18. Qd2 Nxg2 19. Kxg2 d4 20. Nxd4 Bb7+ 21. Kf1 Qd7 0-1`,
    summary: "Fischer wins with Black against Robert Byrne in the US Championship. Study how his pieces converge on White’s king.",
    sources: [
      {
        "title": "PGN Mentor — Fischer game scores",
        "url": "https://www.pgnmentor.com/players/Fischer.zip"
      }
    ],
  },
  {
    id: "tal-larsen-1965-game-10",
    title: "Tal wins the deciding game against Larsen",
    era: "Champions",
    white: "Mikhail Tal",
    black: "Bent Larsen",
    year: 1965,
    event: "Candidates semifinal",
    date: "1965.08.08",
    result: "1-0",
    expectedPlies: 73,
    finalFen: "4Rr1k/1b3Qpp/p7/2qP2P1/7P/1PP5/1P1K4/8 b - - 5 37",
    pgn: `[Event "Candidates semifinal"]
[Site "Bled"]
[Date "1965.08.08"]
[Round "10"]
[White "Mikhail Tal"]
[Black "Bent Larsen"]
[Result "1-0"]

1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 e6 5. Nc3 d6 6. Be3 Nf6 7. f4 Be7
8. Qf3 O-O 9. O-O-O Qc7 10. Ndb5 Qb8 11. g4 a6 12. Nd4 Nxd4 13. Bxd4 b5
14. g5 Nd7 15. Bd3 b4 16. Nd5 exd5 17. exd5 f5 18. Rde1 Rf7 19. h4 Bb7
20. Bxf5 Rxf5 21. Rxe7 Ne5 22. Qe4 Qf8 23. fxe5 Rf4 24. Qe3 Rf3 25. Qe2 Qxe7
26. Qxf3 dxe5 27. Re1 Rd8 28. Rxe5 Qd6 29. Qf4 Rf8 30. Qe4 b3 31. axb3 Rf1+
32. Kd2 Qb4+ 33. c3 Qd6 34. Bc5 Qxc5 35. Re8+ Rf8 36. Qe6+ Kh8 37. Qf7 1-0`,
    summary: "Tal sacrifices a knight on d5 in the deciding game of his Candidates semifinal against Larsen. The attack leads to a forcing finish and a place in the final.",
    sources: [
      {
        "title": "PGN Mentor — Tal game records",
        "url": "https://www.pgnmentor.com/players/Tal/Tal.pgn"
      },
      {
        "title": "Mikhail Tal — 1965 Candidates semifinal report, translated by Douglas Griffin",
        "url": "https://dgriffinchess.wordpress.com/wp-content/uploads/2019/12/tal-larsen-10th-match-game-candidates-semi-final-bled-1965.pdf"
      }
    ],
  },
  {
    id: "petrosian-spassky-1966-game10",
    title: "Petrosian–Spassky, World Championship game 10",
    era: "Champions",
    white: "Tigran Petrosian",
    black: "Boris Spassky",
    year: 1966,
    event: "Petrosian–Spassky World Championship",
    date: "1966.05.02",
    result: "1-0",
    expectedPlies: 59,
    finalFen: "6kQ/5r1p/p2N4/nppP2q1/2P5/1P2N3/P6P/7K b - - 1 30",
    pgn: `[Event "Petrosian–Spassky World Championship"]
[Site "Moscow"]
[Date "1966.05.02"]
[Round "10"]
[White "Tigran Petrosian"]
[Black "Boris Spassky"]
[Result "1-0"]

1. Nf3 Nf6 2. g3 g6 3. c4 Bg7 4. Bg2 O-O 5. O-O Nc6 6. Nc3 d6 7. d4 a6 8. d5 Na5
9. Nd2 c5 10. Qc2 e5 11. b3 Ng4 12. e4 f5 13. exf5 gxf5 14. Nd1 b5 15. f3 e4
16. Bb2 exf3 17. Bxf3 Bxb2 18. Qxb2 Ne5 19. Be2 f4 20. gxf4 Bh3 21. Ne3 Bxf1
22. Rxf1 Ng6 23. Bg4 Nxf4 24. Rxf4 Rxf4 25. Be6+ Rf7 26. Ne4 Qh4 27. Nxd6 Qg5+
28. Kh1 Ra7 29. Bxf7+ Rxf7 30. Qh8+ 1-0`,
    summary: "Petrosian answers Spassky’s kingside pressure with two exchange sacrifices. His bishops and knights take over the attack, and a final queen check ends one of the title match’s most striking games.",
    sources: [
      {
        "title": "PGN Mentor — Petrosian game records",
        "url": "https://www.pgnmentor.com/players/Petrosian/Petrosian.pgn"
      },
      {
        "title": "Tal’s contemporary game score — translated by Douglas Griffin",
        "url": "https://dgriffinchess.wordpress.com/wp-content/uploads/2020/06/petrosian-spassky-10th-match-game-world-championship-moscow-1966.pdf"
      }
    ],
  },
  {
    id: "larsen-fischer-1971-game6",
    title: "Fischer completes the 6–0 sweep",
    era: "Champions",
    white: "Bent Larsen",
    black: "Bobby Fischer",
    year: 1971,
    event: "Candidates semifinal, Larsen–Fischer",
    date: "1971.07.20",
    result: "0-1",
    expectedPlies: 80,
    finalFen: "4R3/6kp/p2r4/1p1b1pN1/1P4p1/P7/6P1/7K w - - 3 41",
    pgn: `[Event "Candidates semifinal, Larsen–Fischer"]
[Site "Denver"]
[Date "1971.07.20"]
[Round "6"]
[White "Bent Larsen"]
[Black "Bobby Fischer"]
[Result "0-1"]

1. f4 c5 2. Nf3 g6 3. e4 Bg7 4. Be2 Nc6 5. O-O d6 6. d3 e6 7. Na3 Nge7 8. c3 O-O
9. Be3 a6 10. d4 cxd4 11. Nxd4 b5 12. Nxc6 Nxc6 13. Qd2 Qc7 14. Rad1 Rd8 15. Nc2 Rb8
16. a3 Na5 17. e5 Bf8 18. b4 Nc6 19. Nd4 dxe5 20. fxe5 Nxe5 21. Bg5 Rd5 22. Qf4 Bg7
23. h4 Rb7 24. Bf6 Bxf6 25. Qxf6 Qxc3 26. h5 gxh5 27. Kh1 Ng4 28. Bxg4 hxg4
29. Qh6 Bd7 30. Rf4 f5 31. Qf6 Bc8 32. Rff1 Rf7 33. Qh6 Bb7 34. Nxe6 Qf6 35. Qe3 Re7
36. Rde1 Rd6 37. Qg5+ Qxg5 38. Nxg5 Rxe1 39. Rxe1 Bd5 40. Re8+ Kg7 0-1`,
    summary: "Larsen keeps searching for winning chances in the final game of the Denver semifinal. Fischer withstands the attack and converts the endgame, completing his remarkable 6–0 match victory.",
    sources: [
      {
        "title": "PGN Mentor — Fischer game records",
        "url": "https://www.pgnmentor.com/players/Fischer/Fischer.pgn"
      },
      {
        "title": "Tal and Zaitsev’s contemporary score — translated by Douglas Griffin",
        "url": "https://dgriffinchess.wordpress.com/wp-content/uploads/2019/05/larsen-fischer-6th-match-game-candidates-semi-final-denver-1971.pdf"
      }
    ],
  },
  {
    id: "fischer-petrosian-1971-game7",
    title: "Fischer–Petrosian, Candidates final game 7",
    era: "Champions",
    white: "Bobby Fischer",
    black: "Tigran Petrosian",
    year: 1971,
    event: "Candidates final, Fischer–Petrosian",
    date: "1971.10.19",
    result: "1-0",
    expectedPlies: 67,
    finalFen: "r3k3/1R3R2/p2r2p1/5p2/1PBp1n1p/8/P2K2PP/8 b - - 1 34",
    pgn: `[Event "Candidates final, Fischer–Petrosian"]
[Site "Buenos Aires"]
[Date "1971.10.19"]
[Round "7"]
[White "Bobby Fischer"]
[Black "Tigran Petrosian"]
[Result "1-0"]

1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Bd3 Nc6 6. Nxc6 bxc6 7. O-O d5 8. c4 Nf6
9. cxd5 cxd5 10. exd5 exd5 11. Nc3 Be7 12. Qa4+ Qd7 13. Re1 Qxa4 14. Nxa4 Be6
15. Be3 O-O 16. Bc5 Rfe8 17. Bxe7 Rxe7 18. b4 Kf8 19. Nc5 Bc8 20. f3 Rea7 21. Re5 Bd7
22. Nxd7+ Rxd7 23. Rc1 Rd6 24. Rc7 Nd7 25. Re2 g6 26. Kf2 h5 27. f4 h4 28. Kf3 f5
29. Ke3 d4+ 30. Kd2 Nb6 31. Ree7 Nd5 32. Rf7+ Ke8 33. Rb7 Nxf4 34. Bc4 1-0`,
    summary: "Fischer trades his advanced knight for a bishop, then brings both rooks to the seventh rank. The final bishop move weaves a mating net in this famous step toward his 1972 world title challenge.",
    sources: [
      {
        "title": "PGN Mentor — Fischer game records",
        "url": "https://www.pgnmentor.com/players/Fischer/Fischer.pgn"
      },
      {
        "title": "Polugaevsky’s contemporary score — translated by Douglas Griffin",
        "url": "https://dgriffinchess.wordpress.com/wp-content/uploads/2019/06/fischer-petrosian-7th-match-game-candidates-final-buenos-aires-1971-1.pdf"
      },
      {
        "title": "Karsten Müller — corrected game move 33...Nxf4",
        "url": "https://en.chessbase.com/post/solution-of-the-endgame-riddle-was-fischer-s-22-nxd7-winning"
      }
    ],
  },
  {
    id: "spassky-fischer-1972-13",
    title: "Fischer’s endgame battle — Game 13",
    era: "Champions",
    white: "Boris Spassky",
    black: "Bobby Fischer",
    year: 1972,
    event: "World Championship, Game 13",
    date: "1972.??.??",
    result: "0-1",
    expectedPlies: 148,
    finalFen: "8/3r4/8/8/3BR3/1p6/pK3p2/5k2 w - - 0 75",
    pgn: `[Event "World Championship, Game 13"]
[Site "Reykjavik"]
[Date "1972.??.??"]
[Round "13"]
[White "Boris Spassky"]
[Black "Bobby Fischer"]
[Result "0-1"]

1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. Nf3 g6 5. Bc4 Nb6 6. Bb3 Bg7 7. Nbd2 O-O 8. h3 a5 9. a4
dxe5 10. dxe5 Na6 11. O-O Nc5 12. Qe2 Qe8 13. Ne4 Nbxa4 14. Bxa4 Nxa4 15. Re1 Nb6 16.
Bd2 a4 17. Bg5 h6 18. Bh4 Bf5 19. g4 Be6 20. Nd4 Bc4 21. Qd2 Qd7 22. Rad1 Rfe8 23. f4
Bd5 24. Nc5 Qc8 25. Qc3 e6 26. Kh2 Nd7 27. Nd3 c5 28. Nb5 Qc6 29. Nd6 Qxd6 30. exd6 Bxc3
31. bxc3 f6 32. g5 hxg5 33. fxg5 f5 34. Bg3 Kf7 35. Ne5+ Nxe5 36. Bxe5 b5 37. Rf1 Rh8
38. Bf6 a3 39. Rf4 a2 40. c4 Bxc4 41. d7 Bd5 42. Kg3 Ra3+ 43. c3 Rha8 44. Rh4 e5 45.
Rh7+ Ke6 46. Re7+ Kd6 47. Rxe5 Rxc3+ 48. Kf2 Rc2+ 49. Ke1 Kxd7 50. Rexd5+ Kc6 51. Rd6+
Kb7 52. Rd7+ Ka6 53. R7d2 Rxd2 54. Kxd2 b4 55. h4 Kb5 56. h5 c4 57. Ra1 gxh5 58. g6 h4
59. g7 h3 60. Be7 Rg8 61. Bf8 h2 62. Kc2 Kc6 63. Rd1 b3+ 64. Kc3 h1=Q 65. Rxh1 Kd5 66.
Kb2 f4 67. Rd1+ Ke4 68. Rc1 Kd3 69. Rd1+ Ke2 70. Rc1 f3 71. Bc5 Rxg7 72. Rxc4 Rd7 73.
Re4+ Kf1 74. Bd4 f2 0-1`,
    summary: "Spassky and Fischer reach an unusual endgame in the thirteenth game of their World Championship match.",
    sources: [
      {
        "title": "PGN Mentor — Fischer game scores",
        "url": "https://www.pgnmentor.com/players/Fischer.zip"
      }
    ],
  },
  {
    id: "fischer-spassky-1972-game-6",
    title: "Fischer–Spassky, World Championship game 6",
    era: "Champions",
    white: "Bobby Fischer",
    black: "Boris Spassky",
    year: 1972,
    event: "Fischer–Spassky World Championship",
    date: "1972.07.23",
    result: "1-0",
    expectedPlies: 81,
    finalFen: "4q2k/2r1r3/4PR1p/p1p5/P1Bp1Q1P/1P6/6P1/6K1 b - - 4 41",
    pgn: `[Event "Fischer–Spassky World Championship"]
[Site "Reykjavik"]
[Date "1972.07.23"]
[Round "6"]
[White "Bobby Fischer"]
[Black "Boris Spassky"]
[Result "1-0"]

1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6
8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8
14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6
20. e4 d4 21. f4 Qe7 22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 exf5
27. Rxf5 Nh7 28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7 32. Qe5 Qe8
33. a4 Qd8 34. R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8 37. Qe4 Nf6 38. Rxf6 gxf6
39. Rxf6 Kg8 40. Bc4 Kh8 41. Qf4 1-0`,
    summary: "Fischer began with 1.c4 in this celebrated sixth game of the Reykjavik title match. His win became one of the most remembered games of the 1972 championship.",
    sources: [
      {
        "title": "PGN Mentor — World Championship 1972",
        "url": "https://www.pgnmentor.com/events/WorldChamp1972.pgn"
      },
      {
        "title": "ChessBase — Game 6 and recorded thinking times",
        "url": "https://fr.chessbase.com/post/fischer-vs-spassky-1972-il-y-a-cinquante-ans-50-serie-4-sixieme-partie"
      }
    ],
  },
  {
    id: "karpov-unzicker-1974",
    title: "Karpov’s bishop on a7",
    era: "Champions",
    white: "Anatoly Karpov",
    black: "Wolfgang Unzicker",
    year: 1974,
    event: "Chess Olympiad, Final Group A",
    date: "1974.??.??",
    result: "1-0",
    expectedPlies: 87,
    finalFen: "r1rnqk2/B1n3b1/3p1pQp/1p1PpPpN/1Pp1P3/R1P1N2P/R5P1/6K1 b - - 5 44",
    pgn: `[Event "Chess Olympiad, Final Group A"]
[Site "Nice"]
[Date "1974.??.??"]
[Round "3"]
[White "Anatoly Karpov"]
[Black "Wolfgang Unzicker"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O
9. h3 Na5 10. Bc2 c5 11. d4 Qc7 12. Nbd2 Nc6 13. d5 Nd8 14. a4 Rb8 15. axb5 axb5
16. b4 Nb7 17. Nf1 Bd7 18. Be3 Ra8 19. Qd2 Rfc8 20. Bd3 g6 21. Ng3 Bf8 22. Ra2 c4
23. Bb1 Qd8 24. Ba7 Ne8 25. Bc2 Nc7 26. Rea1 Qe7 27. Bb1 Be8 28. Ne2 Nd8
29. Nh2 Bg7 30. f4 f6 31. f5 g5 32. Bc2 Bf7 33. Ng3 Nb7 34. Bd1 h6 35. Bh5 Qe8
36. Qd1 Nd8 37. Ra3 Kf8 38. R1a2 Kg8 39. Ng4 Kf8 40. Ne3 Kg8 41. Bxf7+ Nxf7
42. Qh5 Nd8 43. Qg6 Kf8 44. Nh5 1-0`,
    summary: "Karpov’s bishop move to a7 supports his control of the open a-file against Unzicker. This Olympiad victory shows patient piece coordination followed by an attack on the king.",
    sources: [
      {
        "title": "PGN Mentor — Karpov game records",
        "url": "https://www.pgnmentor.com/players/Karpov/Karpov.pgn"
      },
      {
        "title": "Anatoly Karpov — Selected Games 1969–77, translated by Douglas Griffin",
        "url": "https://dgriffinchess.wordpress.com/wp-content/uploads/2021/09/karpov-unzicker-21st-olympiad-nice-1974.pdf"
      }
    ],
  },
  {
    id: "karpov-spassky-1974-9",
    title: "Karpov vs Spassky — Candidates Game 9",
    era: "Champions",
    white: "Anatoly Karpov",
    black: "Boris Spassky",
    year: 1974,
    event: "Candidates semifinal, Game 9",
    date: "1974.??.??",
    result: "1-0",
    expectedPlies: 69,
    finalFen: "1n1R3r/1q4k1/2p1Qpp1/p1B1p2p/P3P3/2P2N1P/1P4PK/8 b - - 0 35",
    pgn: `[Event "Candidates semifinal, Game 9"]
[Site "Leningrad"]
[Date "1974.??.??"]
[Round "9"]
[White "Anatoly Karpov"]
[Black "Boris Spassky"]
[Result "1-0"]

1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 d6 6. Be2 Be7 7. O-O O-O 8. f4 Nc6 9.
Be3 Bd7 10. Nb3 a5 11. a4 Nb4 12. Bf3 Bc6 13. Nd4 g6 14. Rf2 e5 15. Nxc6 bxc6 16. fxe5
dxe5 17. Qf1 Qc8 18. h3 Nd7 19. Bg4 h5 20. Bxd7 Qxd7 21. Qc4 Bh4 22. Rd2 Qe7 23. Rf1
Rfd8 24. Nb1 Qb7 25. Kh2 Kg7 26. c3 Na6 27. Re2 Rf8 28. Nd2 Bd8 29. Nf3 f6 30. Rd2 Be7
31. Qe6 Rad8 32. Rxd8 Bxd8 33. Rd1 Nb8 34. Bc5 Rh8 35. Rxd8 1-0`,
    summary: "Karpov wins the ninth game of his Candidates semifinal match against Spassky.",
    sources: [
      {
        "title": "PGN Mentor — Karpov game scores",
        "url": "https://www.pgnmentor.com/players/Karpov.zip"
      }
    ],
  },
  {
    id: "karpov-kortschnoj-1978-32",
    title: "Karpov retains the title — Game 32",
    era: "Champions",
    white: "Anatoly Karpov",
    black: "Viktor Korchnoi",
    year: 1978,
    event: "World Championship, Game 32",
    date: "1978.??.??",
    result: "1-0",
    expectedPlies: 82,
    finalFen: "q5r1/1r1bppkp/1P3np1/n5N1/2P5/4Q1NP/3R1PP1/4RBK1 w - - 1 42",
    pgn: `[Event "World Championship, Game 32"]
[Site "Baguio City"]
[Date "1978.??.??"]
[Round "32"]
[White "Anatoly Karpov"]
[Black "Viktor Korchnoi"]
[Result "1-0"]

1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Nf3 Bg7 5. Be2 O-O 6. O-O c5 7. d5 Na6 8. Bf4 Nc7 9. a4
b6 10. Re1 Bb7 11. Bc4 Nh5 12. Bg5 Nf6 13. Qd3 a6 14. Rad1 Rb8 15. h3 Nd7 16. Qe3 Ba8
17. Bh6 b5 18. Bxg7 Kxg7 19. Bf1 Nf6 20. axb5 axb5 21. Ne2 Bb7 22. Ng3 Ra8 23. c3 Ra4
24. Bd3 Qa8 25. e5 dxe5 26. Qxe5 Nxd5 27. Bxb5 Ra7 28. Nh4 Bc8 29. Be2 Be6 30. c4 Nb4
31. Qxc5 Qb8 32. Bf1 Rc8 33. Qg5 Kh8 34. Rd2 Nc6 35. Qh6 Rg8 36. Nf3 Qf8 37. Qe3 Kg7 38.
Ng5 Bd7 39. b4 Qa8 40. b5 Na5 41. b6 Rb7 1-0`,
    summary: "The final game of Karpov’s 1978 World Championship match against Viktor Korchnoi.",
    sources: [
      {
        "title": "PGN Mentor — Karpov game scores",
        "url": "https://www.pgnmentor.com/players/Karpov.zip"
      }
    ],
  },
  {
    id: "chiburdanidze-alexandria-1981-15",
    title: "Chiburdanidze vs Alexandria — Game 15",
    era: "Champions",
    white: "Maia Chiburdanidze",
    black: "Nana Alexandria",
    year: 1981,
    event: "Women’s World Championship, Game 15",
    date: "1981.??.??",
    result: "1-0",
    expectedPlies: 73,
    finalFen: "1b2r3/3k2p1/1Bqr4/5Qp1/8/P2PP2p/4KP2/R6B b - - 1 37",
    pgn: `[Event "Women’s World Championship, Game 15"]
[Site "Tbilisi/Borzhomi"]
[Date "1981.??.??"]
[Round "15"]
[White "Maia Chiburdanidze"]
[Black "Nana Alexandria"]
[Result "1-0"]

1. Nf3 Nf6 2. b3 d5 3. Bb2 Bg4 4. e3 Nbd7 5. h3 Bh5 6. d3 e6 7. g4 Bg6 8. Nh4 Bb4+ 9. c3
Bd6 10. Nxg6 hxg6 11. Bg2 g5 12. Nd2 Ne5 13. Nf3 Nxf3+ 14. Qxf3 Qe7 15. c4 c6 16. Ke2
Rh7 17. Rhc1 Nd7 18. Kf1 Ne5 19. Qd1 Ng6 20. a3 Bc7 21. Ke2 O-O-O 22. b4 f5 23. Qa4 fxg4
24. Qxa7 gxh3 25. Bh1 Bb8 26. Qa8 Qd6 27. cxd5 exd5 28. Bd4 Kd7 29. Qxb7+ Qc7 30. Qa6
Re8 31. b5 Ne7 32. Bb6 Qc8 33. bxc6+ Nxc6 34. Qb5 Rh6 35. Qxd5+ Rd6 36. Rxc6 Qxc6 37.
Qf5+ 1-0`,
    summary: "Maia Chiburdanidze wins the fifteenth game of her Women’s World Championship match against Nana Alexandria.",
    sources: [
      {
        "title": "PGN Mentor — Chiburdanidze game scores",
        "url": "https://www.pgnmentor.com/players/Chiburdanidze.zip"
      }
    ],
  },
  {
    id: "karpov-kasparov-1984-game-9",
    title: "Karpov’s endgame squeeze — Game 9",
    era: "Champions",
    white: "Anatoly Karpov",
    black: "Garry Kasparov",
    year: 1984,
    event: "Karpov–Kasparov World Championship",
    date: "1984.??.??",
    result: "1-0",
    expectedPlies: 139,
    finalFen: "8/8/3N4/8/kP1P4/P3K3/6b1/8 b - - 2 70",
    pgn: `[Event "Karpov–Kasparov World Championship"]
[Site "Moscow"]
[Date "1984.??.??"]
[Round "9"]
[White "Anatoly Karpov"]
[Black "Garry Kasparov"]
[Result "1-0"]

1. d4 d5 2. c4 e6 3. Nf3 c5 4. cxd5 exd5 5. g3 Nf6 6. Bg2 Be7 7. O-O O-O
8. Nc3 Nc6 9. Bg5 cxd4 10. Nxd4 h6 11. Be3 Re8 12. Qb3 Na5 13. Qc2 Bg4
14. Nf5 Rc8 15. Bd4 Bc5 16. Bxc5 Rxc5 17. Ne3 Be6 18. Rad1 Qc8 19. Qa4 Rd8
20. Rd3 a6 21. Rfd1 Nc4 22. Nxc4 Rxc4 23. Qa5 Rc5 24. Qb6 Rd7 25. Rd4 Qc7
26. Qxc7 Rdxc7 27. h3 h5 28. a3 g6 29. e3 Kg7 30. Kh2 Rc4 31. Bf3 b5 32. Kg2 R7c5
33. Rxc4 Rxc4 34. Rd4 Kf8 35. Be2 Rxd4 36. exd4 Ke7 37. Na2 Bc8 38. Nb4 Kd6
39. f3 Ng8 40. h4 Nh6 41. Kf2 Nf5 42. Nc2 f6 43. Bd3 g5 44. Bxf5 Bxf5 45. Ne3 Bb1
46. b4 gxh4 47. Ng2 hxg3+ 48. Kxg3 Ke6 49. Nf4+ Kf5 50. Nxh5 Ke6 51. Nf4+ Kd6
52. Kg4 Bc2 53. Kh5 Bd1 54. Kg6 Ke7 55. Nxd5+ Ke6 56. Nc7+ Kd7 57. Nxa6 Bxf3
58. Kxf6 Kd6 59. Kf5 Kd5 60. Kf4 Bh1 61. Ke3 Kc4 62. Nc5 Bc6 63. Nd3 Bg2
64. Ne5+ Kc3 65. Ng6 Kc4 66. Ne7 Bb7 67. Nf5 Bg2 68. Nd6+ Kb3 69. Nxb5 Ka4
70. Nd6 1-0`,
    summary: "Karpov wins a long knight-against-bishop ending in the first of his world championship matches against Kasparov. The game lasts 70 moves and rewards careful king and knight coordination.",
    sources: [
      {
        "title": "PGN Mentor — Karpov game records",
        "url": "https://www.pgnmentor.com/players/Karpov/Karpov.pgn"
      }
    ],
  },
  {
    id: "karpov-kasparov-1985-game-16",
    title: "Kasparov’s knight on d3 — Game 16",
    era: "Champions",
    white: "Anatoly Karpov",
    black: "Garry Kasparov",
    year: 1985,
    event: "Karpov–Kasparov World Championship",
    date: "1985.??.??",
    result: "0-1",
    expectedPlies: 80,
    finalFen: "8/5pk1/7p/8/1p4P1/1P1R2P1/3N1qBP/3Nr2K w - - 1 41",
    pgn: `[Event "Karpov–Kasparov World Championship"]
[Site "Moscow"]
[Date "1985.??.??"]
[Round "16"]
[White "Anatoly Karpov"]
[Black "Garry Kasparov"]
[Result "0-1"]

1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nb5 d6 6. c4 Nf6 7. N1c3 a6
8. Na3 d5 9. cxd5 exd5 10. exd5 Nb4 11. Be2 Bc5 12. O-O O-O 13. Bf3 Bf5
14. Bg5 Re8 15. Qd2 b5 16. Rad1 Nd3 17. Nab1 h6 18. Bh4 b4 19. Na4 Bd6
20. Bg3 Rc8 21. b3 g5 22. Bxd6 Qxd6 23. g3 Nd7 24. Bg2 Qf6 25. a3 a5
26. axb4 axb4 27. Qa2 Bg6 28. d6 g4 29. Qd2 Kg7 30. f3 Qxd6 31. fxg4 Qd4+
32. Kh1 Nf6 33. Rf4 Ne4 34. Qxd3 Nf2+ 35. Rxf2 Bxd3 36. Rfd2 Qe3 37. Rxd3 Rc1
38. Nb2 Qf2 39. Nd2 Rxd1+ 40. Nxd1 Re1+ 0-1`,
    summary: "Kasparov establishes a knight on d3 in this Sicilian Defense victory over Karpov. His active pieces lead to a final rook check and a win with Black in their 1985 title match.",
    sources: [
      {
        "title": "PGN Mentor — Kasparov game records",
        "url": "https://www.pgnmentor.com/players/Kasparov/Kasparov.pgn"
      }
    ],
  },
  {
    id: "karpov-kasparov-1985-24",
    title: "Kasparov wins the title — Game 24",
    era: "Champions",
    white: "Anatoly Karpov",
    black: "Garry Kasparov",
    year: 1985,
    event: "World Championship, Game 24",
    date: "1985.??.??",
    result: "0-1",
    expectedPlies: 84,
    finalFen: "4r2k/q5bp/4R3/4P1P1/P1Qn3R/2N5/1r4KP/8 w - - 1 43",
    pgn: `[Event "World Championship, Game 24"]
[Site "Moscow"]
[Date "1985.??.??"]
[Round "24"]
[White "Anatoly Karpov"]
[Black "Garry Kasparov"]
[Result "0-1"]

1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2 e6 7. O-O Be7 8. f4 O-O 9.
Kh1 Qc7 10. a4 Nc6 11. Be3 Re8 12. Bf3 Rb8 13. Qd2 Bd7 14. Nb3 b6 15. g4 Bc8 16. g5 Nd7
17. Qf2 Bf8 18. Bg2 Bb7 19. Rad1 g6 20. Bc1 Rbc8 21. Rd3 Nb4 22. Rh3 Bg7 23. Be3 Re7 24.
Kg1 Rce8 25. Rd1 f5 26. gxf6 Nxf6 27. Rg3 Rf7 28. Bxb6 Qb8 29. Be3 Nh5 30. Rg4 Nf6 31.
Rh4 g5 32. fxg5 Ng4 33. Qd2 Nxe3 34. Qxe3 Nxc2 35. Qb6 Ba8 36. Rxd6 Rb7 37. Qxa6 Rxb3
38. Rxe6 Rxb2 39. Qc4 Kh8 40. e5 Qa7+ 41. Kh1 Bxg2+ 42. Kxg2 Nd4+ 0-1`,
    summary: "Kasparov wins with Black in the last game of his 1985 World Championship match against Karpov.",
    sources: [
      {
        "title": "PGN Mentor — Kasparov game scores",
        "url": "https://www.pgnmentor.com/players/Kasparov.zip"
      }
    ],
  },
  {
    id: "kasparov-karpov-1987-game-24",
    title: "Kasparov’s last-game victory — Game 24",
    era: "Champions",
    white: "Garry Kasparov",
    black: "Anatoly Karpov",
    year: 1987,
    event: "Kasparov–Karpov World Championship",
    date: "1987.??.??",
    result: "1-0",
    expectedPlies: 127,
    finalFen: "5n1k/5Q2/4p1p1/2q1P2p/7P/6P1/5PK1/3B4 b - - 14 64",
    pgn: `[Event "Kasparov–Karpov World Championship"]
[Site "Sevilla"]
[Date "1987.??.??"]
[Round "24"]
[White "Garry Kasparov"]
[Black "Anatoly Karpov"]
[Result "1-0"]

1. c4 e6 2. Nf3 Nf6 3. g3 d5 4. b3 Be7 5. Bg2 O-O 6. O-O b6 7. Bb2 Bb7 8. e3 Nbd7
9. Nc3 Ne4 10. Ne2 a5 11. d3 Bf6 12. Qc2 Bxb2 13. Qxb2 Nd6 14. cxd5 Bxd5
15. d4 c5 16. Rfd1 Rc8 17. Nf4 Bxf3 18. Bxf3 Qe7 19. Rac1 Rfd8 20. dxc5 Nxc5
21. b4 axb4 22. Qxb4 Qa7 23. a3 Nf5 24. Rb1 Rxd1+ 25. Rxd1 Qc7 26. Nd3 h6
27. Rc1 Ne7 28. Qb5 Nf5 29. a4 Nd6 30. Qb1 Qa7 31. Ne5 Nxa4 32. Rxc8+ Nxc8
33. Qd1 Ne7 34. Qd8+ Kh7 35. Nxf7 Ng6 36. Qe8 Qe7 37. Qxa4 Qxf7 38. Be4 Kg8
39. Qb5 Nf8 40. Qxb6 Qf6 41. Qb5 Qe7 42. Kg2 g6 43. Qa5 Qg7 44. Qc5 Qf7 45. h4 h5
46. Qc6 Qe7 47. Bd3 Qf7 48. Qd6 Kg7 49. e4 Kg8 50. Bc4 Kg7 51. Qe5+ Kg8
52. Qd6 Kg7 53. Bb5 Kg8 54. Bc6 Qa7 55. Qb4 Qc7 56. Qb7 Qd8 57. e5 Qa5
58. Be8 Qc5 59. Qf7+ Kh8 60. Ba4 Qd5+ 61. Kh2 Qc5 62. Bb3 Qc8 63. Bd1 Qc5 64. Kg2
1-0`,
    summary: "Kasparov needed to win the last game of the 1987 match to retain his world title. He defeated Karpov after a long struggle, tying the match in Seville.",
    sources: [
      {
        "title": "PGN Mentor — Kasparov game records",
        "url": "https://www.pgnmentor.com/players/Kasparov/Kasparov.pgn"
      },
      {
        "title": "Garry Kasparov — recollection of the 1987 final game",
        "url": "https://en.chessbase.com/post/what-is-garry-up-to"
      }
    ],
  },
  {
    id: "ivanchuk-kasparov-1991-1",
    title: "Ivanchuk vs Kasparov — Linares",
    era: "Champions",
    white: "Vassily Ivanchuk",
    black: "Garry Kasparov",
    year: 1991,
    event: "Linares tournament",
    date: "1991.??.??",
    result: "1-0",
    expectedPlies: 75,
    finalFen: "2N1bbrq/5p1k/5Q2/pPp2pP1/P4N1R/7P/8/7K b - - 0 38",
    pgn: `[Event "Linares tournament"]
[Site "Linares"]
[Date "1991.??.??"]
[Round "1"]
[White "Vassily Ivanchuk"]
[Black "Garry Kasparov"]
[Result "1-0"]

1. e4 c5 2. Nf3 d6 3. Bb5+ Nd7 4. d4 Nf6 5. O-O cxd4 6. Qxd4 a6 7. Bxd7+ Bxd7 8. Bg5 h6
9. Bxf6 gxf6 10. c4 e6 11. Nc3 Rc8 12. Kh1 h5 13. a4 h4 14. h3 Be7 15. b4 a5 16. b5 Qc7
17. Nd2 Qc5 18. Qd3 Rg8 19. Rae1 Qg5 20. Rg1 Qf4 21. Ref1 b6 22. Ne2 Qh6 23. c5 Rxc5 24.
Nc4 Kf8 25. Nxb6 Be8 26. f4 f5 27. exf5 Rxf5 28. Rc1 Kg7 29. g4 Rc5 30. Rxc5 dxc5 31.
Nc8 Bf8 32. Qd8 Qg6 33. f5 Qh6 34. g5 Qh5 35. Rg4 exf5 36. Nf4 Qh8 37. Qf6+ Kh7 38.
Rxh4+ 1-0`,
    summary: "Ivanchuk defeats Kasparov in the opening round of the Linares tournament.",
    sources: [
      {
        "title": "PGN Mentor — Ivanchuk game scores",
        "url": "https://www.pgnmentor.com/players/Ivanchuk.zip"
      }
    ],
  },
  {
    id: "karpov-topalov-1994",
    title: "Karpov’s Linares combination",
    era: "Champions",
    white: "Anatoly Karpov",
    black: "Veselin Topalov",
    year: 1994,
    event: "Linares",
    date: "1994.??.??",
    result: "1-0",
    expectedPlies: 77,
    finalFen: "5k2/Q7/5q2/7B/5P2/1P4P1/Pr3PK1/8 b - - 2 39",
    pgn: `[Event "Linares"]
[Site "Linares"]
[Date "1994.??.??"]
[Round "4"]
[White "Anatoly Karpov"]
[Black "Veselin Topalov"]
[Result "1-0"]

1. d4 Nf6 2. c4 c5 3. Nf3 cxd4 4. Nxd4 e6 5. g3 Nc6 6. Bg2 Bc5 7. Nb3 Be7
8. Nc3 O-O 9. O-O d6 10. Bf4 Nh5 11. e3 Nxf4 12. exf4 Bd7 13. Qd2 Qb8 14. Rfe1 g6
15. h4 a6 16. h5 b5 17. hxg6 hxg6 18. Nc5 dxc5 19. Qxd7 Rc8 20. Rxe6 Ra7
21. Rxg6+ fxg6 22. Qe6+ Kg7 23. Bxc6 Rd8 24. cxb5 Bf6 25. Ne4 Bd4 26. bxa6 Qb6
27. Rd1 Qxa6 28. Rxd4 Rxd4 29. Qf6+ Kg8 30. Qxg6+ Kf8 31. Qe8+ Kg7 32. Qe5+ Kg8
33. Nf6+ Kf7 34. Be8+ Kf8 35. Qxc5+ Qd6 36. Qxa7 Qxf6 37. Bh5 Rd2 38. b3 Rb2
39. Kg2 1-0`,
    summary: "Karpov sacrifices material to break open Topalov’s position at Linares in 1994. A sequence of checks leads to an endgame that Karpov converts on move 39.",
    sources: [
      {
        "title": "PGN Mentor — Karpov game records",
        "url": "https://www.pgnmentor.com/players/Karpov/Karpov.pgn"
      },
      {
        "title": "ChessBase — Linares 1994 game from the tournament bulletin",
        "url": "https://en.chessbase.com/post/karpov-diem-happy-65th-birthday-tolya"
      }
    ],
  },
  {
    id: "kasparov-anand-1995-game-10",
    title: "Kasparov’s prepared rook sacrifice — Game 10",
    era: "Champions",
    white: "Garry Kasparov",
    black: "Viswanathan Anand",
    year: 1995,
    event: "PCA World Championship",
    date: "1995.??.??",
    result: "1-0",
    expectedPlies: 75,
    finalFen: "8/4k2p/3R4/2n1PPP1/1p6/p3K3/P6P/2rB4 b - - 2 38",
    pgn: `[Event "PCA World Championship"]
[Site "New York"]
[Date "1995.??.??"]
[Round "10"]
[White "Garry Kasparov"]
[Black "Viswanathan Anand"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Nxe4 6. d4 b5 7. Bb3 d5
8. dxe5 Be6 9. Nbd2 Nc5 10. c3 d4 11. Ng5 dxc3 12. Nxe6 fxe6 13. bxc3 Qd3
14. Bc2 Qxc3 15. Nb3 Nxb3 16. Bxb3 Nd4 17. Qg4 Qxa1 18. Bxe6 Rd8 19. Bh6 Qc3
20. Bxg7 Qd3 21. Bxh8 Qg6 22. Bf6 Be7 23. Bxe7 Qxg4 24. Bxg4 Kxe7 25. Rc1 c6
26. f4 a5 27. Kf2 a4 28. Ke3 b4 29. Bd1 a3 30. g4 Rd5 31. Rc4 c5 32. Ke4 Rd8
33. Rxc5 Ne6 34. Rd5 Rc8 35. f5 Rc4+ 36. Ke3 Nc5 37. g5 Rc1 38. Rd6 1-0`,
    summary: "Kasparov introduces a prepared rook sacrifice against Anand in the tenth game of their 1995 world championship match. The victory is a celebrated example of deep opening preparation.",
    sources: [
      {
        "title": "PGN Mentor — Kasparov game records",
        "url": "https://www.pgnmentor.com/players/Kasparov/Kasparov.pgn"
      },
      {
        "title": "Garry Kasparov interview — preparation for Anand in 1995",
        "url": "https://en.chessbase.com/post/the-garry-kasparov-interview-part-2/7"
      }
    ],
  },
  {
    id: "deep-blue-kasparov-1996-game-1",
    title: "Deep Blue–Kasparov, 1996 game 1",
    era: "Human vs computer",
    white: "Deep Blue",
    black: "Garry Kasparov",
    year: 1996,
    event: "Kasparov–Deep Blue match",
    date: "1996.02.10",
    result: "1-0",
    expectedPlies: 73,
    finalFen: "8/7R/5q1k/3Q2N1/3p4/PP3pPP/5n1K/4r3 b - - 0 37",
    pgn: `[Event "Kasparov–Deep Blue match"]
[Site "Philadelphia"]
[Date "1996.02.10"]
[Round "1"]
[White "Deep Blue"]
[Black "Garry Kasparov"]
[Result "1-0"]

1. e4 c5 2. c3 d5 3. exd5 Qxd5 4. d4 Nf6 5. Nf3 Bg4 6. Be2 e6 7. h3 Bh5
8. O-O Nc6 9. Be3 cxd4 10. cxd4 Bb4 11. a3 Ba5 12. Nc3 Qd6 13. Nb5 Qe7
14. Ne5 Bxe2 15. Qxe2 O-O 16. Rac1 Rac8 17. Bg5 Bb6 18. Bxf6 gxf6 19. Nc4 Rfd8
20. Nxb6 axb6 21. Rfd1 f5 22. Qe3 Qf6 23. d5 Rxd5 24. Rxd5 exd5 25. b3 Kh8
26. Qxb6 Rg8 27. Qc5 d4 28. Nd6 f4 29. Nxb7 Ne5 30. Qd5 f3 31. g3 Nd3 32. Rc7 Re8
33. Nd6 Re1+ 34. Kh2 Nxf2 35. Nxf7+ Kg7 36. Ng5+ Kh6 37. Rxh7+ 1-0`,
    summary: "Deep Blue won the opening game of the 1996 Philadelphia match. It was the first computer victory over a reigning world chess champion under standard tournament time controls; Kasparov went on to win the match.",
    sources: [
      {
        "title": "IBM’s 1996 match archive — Game 1 score",
        "url": "https://park.org/Cdrom/Pavilions/IBM/DeepBlue/games/game1/current.html"
      },
      {
        "title": "IBM — Deep Blue history",
        "url": "https://www.ibm.com/history/deep-blue"
      },
      {
        "title": "PGN Mentor — Kasparov game records",
        "url": "https://www.pgnmentor.com/players/Kasparov/Kasparov.pgn"
      }
    ],
  },
  {
    id: "deep-blue-kasparov-1997-game-6",
    title: "Deep Blue–Kasparov, 1997 game 6",
    era: "Human vs computer",
    white: "Deep Blue",
    black: "Garry Kasparov",
    year: 1997,
    event: "Kasparov–Deep Blue rematch",
    date: "1997.05.11",
    result: "1-0",
    expectedPlies: 37,
    finalFen: "r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - - 0 19",
    pgn: `[Event "Kasparov–Deep Blue rematch"]
[Site "New York"]
[Date "1997.05.11"]
[Round "6"]
[White "Deep Blue"]
[Black "Garry Kasparov"]
[Result "1-0"]

1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Nd7 5. Ng5 Ngf6 6. Bd3 e6 7. N1f3 h6
8. Nxe6 Qe7 9. O-O fxe6 10. Bg6+ Kd8 11. Bf4 b5 12. a4 Bb7 13. Re1 Nd5
14. Bg3 Kc8 15. axb5 cxb5 16. Qd3 Bc6 17. Bf5 exf5 18. Rxe7 Bxe7 19. c4 1-0`,
    summary: "Deep Blue’s short victory in the final game secured the 1997 rematch, 3½–2½. It was the first match victory by a computer over a reigning world champion under standard tournament time controls.",
    sources: [
      {
        "title": "PGN Mentor — Kasparov game records",
        "url": "https://www.pgnmentor.com/players/Kasparov/Kasparov.pgn"
      },
      {
        "title": "IBM — Deep Blue history",
        "url": "https://www.ibm.com/history/deep-blue"
      }
    ],
  },
  {
    id: "topalov-shirov-1998-10",
    title: "Shirov’s bishop sacrifice on h3",
    era: "Champions",
    white: "Veselin Topalov",
    black: "Alexei Shirov",
    year: 1998,
    event: "Linares tournament",
    date: "1998.03.04",
    result: "0-1",
    expectedPlies: 106,
    finalFen: "8/4B3/6p1/8/p2p3P/1k5P/5K2/8 w - - 6 54",
    pgn: `[Event "Linares tournament"]
[Site "Linares"]
[Date "1998.03.04"]
[Round "10"]
[White "Veselin Topalov"]
[Black "Alexei Shirov"]
[Result "0-1"]

1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. cxd5 Nxd5 5. e4 Nxc3 6. bxc3 Bg7 7. Bb5+ c6 8. Ba4 O-O
9. Ne2 Nd7 10. O-O e5 11. f3 Qe7 12. Be3 Rd8 13. Qc2 Nb6 14. Bb3 Be6 15. Rad1 Nc4 16.
Bc1 b5 17. f4 exd4 18. Nxd4 Bg4 19. Rde1 Qc5 20. Kh1 a5 21. h3 Bd7 22. a4 bxa4 23. Ba2
Be8 24. e5 Nb6 25. f5 Nd5 26. Bd2 Nb4 27. Qxa4 Nxa2 28. Qxa2 Bxe5 29. fxg6 hxg6 30. Bg5
Rd5 31. Re3 Qd6 32. Qe2 Bd7 33. c4 Bxd4 34. cxd5 Bxe3 35. Qxe3 Re8 36. Qc3 Qxd5 37. Bh6
Re5 38. Rf3 Qc5 39. Qa1 Bf5 40. Re3 f6 41. Rxe5 Qxe5 42. Qa2+ Qd5 43. Qxd5+ cxd5 44. Bd2
a4 45. Bc3 Kf7 46. h4 Ke6 47. Kg1 Bh3 48. gxh3 Kf5 49. Kf2 Ke4 50. Bxf6 d4 51. Be7 Kd3
52. Bc5 Kc4 53. Be7 Kb3 0-1`,
    summary: "Shirov offers his bishop on h3 in a memorable endgame against Topalov.",
    sources: [
      {
        "title": "PGN Mentor — Shirov game scores",
        "url": "https://www.pgnmentor.com/players/Shirov.zip"
      }
    ],
  },
  {
    id: "kasparov-topalov-1999",
    title: "Kasparov’s Immortal",
    era: "Champions",
    white: "Garry Kasparov",
    black: "Veselin Topalov",
    year: 1999,
    event: "Hoogovens tournament",
    date: "1999.01.20",
    result: "1-0",
    expectedPlies: 87,
    finalFen: "8/Q6p/6p1/5p2/5P2/2p3P1/3r3P/2K1k3 b - - 3 44",
    pgn: `[Event "Hoogovens tournament"]
[Site "Wijk aan Zee"]
[Date "1999.01.20"]
[Round "4"]
[White "Garry Kasparov"]
[Black "Veselin Topalov"]
[Result "1-0"]

1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7
8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O
14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5
20. Qf4+ Ka7 21. Rhe1 d4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6
26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3
32. Qxa6+ Kxb4 33. c3+ Kxc3 34. Qa1+ Kd2 35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7
38. Bxc4 bxc4 39. Qxh8 Rd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7
1-0`,
    summary: "Kasparov’s Wijk aan Zee victory over Topalov is often called Kasparov’s Immortal. A rook sacrifice starts a sustained chase of the black king across the board.",
    sources: [
      {
        "title": "PGN Mentor — Kasparov game records",
        "url": "https://www.pgnmentor.com/players/Kasparov/Kasparov.pgn"
      }
    ],
  },
  {
    id: "polgar-anand-1999-1",
    title: "Polgár vs Anand — Dos Hermanas",
    era: "Champions",
    white: "Judit Polgár",
    black: "Viswanathan Anand",
    year: 1999,
    event: "Dos Hermanas tournament",
    date: "1999.04.06",
    result: "1-0",
    expectedPlies: 67,
    finalFen: "6k1/6bp/5p1q/p4r2/1p2pP2/1P2B3/P1P3QP/2KR4 b - - 3 34",
    pgn: `[Event "Dos Hermanas tournament"]
[Site "Dos Hermanas"]
[Date "1999.04.06"]
[Round "1"]
[White "Judit Polgár"]
[Black "Viswanathan Anand"]
[Result "1-0"]

1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e6 7. g4 e5 8. Nf5 g6 9. g5
gxf5 10. exf5 d5 11. Qf3 d4 12. O-O-O Nbd7 13. Bd2 dxc3 14. Bxc3 Bg7 15. Rg1 O-O 16.
gxf6 Qxf6 17. Qe3 Kh8 18. f4 Qb6 19. Qg3 Qh6 20. Rd6 f6 21. Bd2 e4 22. Bc4 b5 23. Be6
Ra7 24. Rc6 a5 25. Be3 Rb7 26. Bd5 Rb8 27. Rc7 b4 28. b3 Rb5 29. Bc6 Rxf5 30. Rxc8 Rxc8
31. Bxd7 Rcc5 32. Bxf5 Rxf5 33. Rd1 Kg8 34. Qg2 1-0`,
    summary: "Judit Polgár wins against Viswanathan Anand at Dos Hermanas.",
    sources: [
      {
        "title": "PGN Mentor — PolgarJ game scores",
        "url": "https://www.pgnmentor.com/players/PolgarJ.zip"
      }
    ],
  },
  {
    id: "kramnik-kasparov-2000-2",
    title: "Kramnik breaks through — Game 2",
    era: "Champions",
    white: "Vladimir Kramnik",
    black: "Garry Kasparov",
    year: 2000,
    event: "World Championship, Game 2",
    date: "2000.10.10",
    result: "1-0",
    expectedPlies: 79,
    finalFen: "8/4k3/1R6/P2Bb2p/5p2/5P1K/r6P/8 b - - 4 40",
    pgn: `[Event "World Championship, Game 2"]
[Site "London ENG"]
[Date "2000.10.10"]
[Round "2"]
[White "Vladimir Kramnik"]
[Black "Garry Kasparov"]
[Result "1-0"]

1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. cxd5 Nxd5 5. e4 Nxc3 6. bxc3 Bg7 7. Nf3 c5 8. Be3 Qa5 9.
Qd2 Bg4 10. Rb1 a6 11. Rxb7 Bxf3 12. gxf3 Nc6 13. Bc4 O-O 14. O-O cxd4 15. cxd4 Bxd4 16.
Bd5 Bc3 17. Qc1 Nd4 18. Bxd4 Bxd4 19. Rxe7 Ra7 20. Rxa7 Bxa7 21. f4 Qd8 22. Qc3 Bb8 23.
Qf3 Qh4 24. e5 g5 25. Re1 Qxf4 26. Qxf4 gxf4 27. e6 fxe6 28. Rxe6 Kg7 29. Rxa6 Rf5 30.
Be4 Re5 31. f3 Re7 32. a4 Ra7 33. Rb6 Be5 34. Rb4 Rd7 35. Kg2 Rd2+ 36. Kh3 h5 37. Rb5
Kf6 38. a5 Ra2 39. Rb6+ Ke7 40. Bd5 1-0`,
    summary: "Kramnik wins the second game of his World Championship match against Kasparov.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2000 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2000.pgn"
      }
    ],
  },
  {
    id: "kramnik-kasparov-2000-g10",
    title: "Kramnik’s London breakthrough",
    era: "Champions",
    white: "Vladimir Kramnik",
    black: "Garry Kasparov",
    year: 2000,
    event: "World Championship, game 10",
    date: "2000.10.24",
    result: "1-0",
    expectedPlies: 49,
    finalFen: "3N1r1k/p3Q1pp/1p3n2/8/8/5P2/Pq3P1P/4R1K1 b - - 9 25",
    pgn: `[Event "World Championship, game 10"]
[Site "London ENG"]
[Date "2000.10.24"]
[Round "10"]
[White "Vladimir Kramnik"]
[Black "Garry Kasparov"]
[Result "1-0"]

1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.e3 O-O 5.Bd3 d5 6.Nf3 c5 7.O-O cxd4 8.exd4 dxc4
9.Bxc4 b6 10.Bg5 Bb7 11.Re1 Nbd7 12.Rc1 Rc8 13.Qb3 Be7 14.Bxf6 Nxf6 15.Bxe6 fxe6
16.Qxe6+ Kh8 17.Qxe7 Bxf3 18.gxf3 Qxd4 19.Nb5 Qxb2 20.Rxc8 Rxc8 21.Nd6 Rb8
22.Nf7+ Kg8 23.Qe6 Rf8 24.Nd8+ Kh8 25.Qe7  1-0`,
    summary: "Kramnik’s queen and knight coordinate to defeat Kasparov in just 25 moves. This sharp Nimzo-Indian battle was one of the decisive games of their London title match.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2000 game records",
        "url": "https://www.pgnmentor.com/events/WorldChamp2000.pgn"
      },
      {
        "title": "GM Rafael Leitão — Kramnik vs Kasparov",
        "url": "https://rafaelleitao.com/kramnik-x-kasparov/"
      }
    ],
  },
  {
    id: "polgar-kasparov-2002",
    title: "Polgár defeats Kasparov",
    era: "Champions",
    white: "Judit Polgár",
    black: "Garry Kasparov",
    year: 2002,
    event: "Russia vs Rest of the World (rapid)",
    date: "2002.09.09",
    result: "1-0",
    expectedPlies: 84,
    finalFen: "2k5/pR4R1/1p6/2p2r2/2P5/4K3/PP3P1r/8 w - - 1 43",
    pgn: `[Event "Russia vs Rest of the World (rapid)"]
[Site "Moscow RUS"]
[Date "2002.09.09"]
[Round "5"]
[White "Judit Polgár"]
[Black "Garry Kasparov"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4 5. d4 Nd6 6. Bxc6 dxc6 7. dxe5 Nf5
8. Qxd8+ Kxd8 9. Nc3 h6 10. Rd1+ Ke8 11. h3 Be7 12. Ne2 Nh4 13. Nxh4 Bxh4
14. Be3 Bf5 15. Nd4 Bh7 16. g4 Be7 17. Kg2 h5 18. Nf5 Bf8 19. Kf3 Bg6
20. Rd2 hxg4+ 21. hxg4 Rh3+ 22. Kg2 Rh7 23. Kg3 f6 24. Bf4 Bxf5 25. gxf5 fxe5
26. Re1 Bd6 27. Bxe5 Kd7 28. c4 c5 29. Bxd6 cxd6 30. Re6 Rah8 31. Rexd6+ Kc8
32. R2d5 Rh3+ 33. Kg2 Rh2+ 34. Kf3 R2h3+ 35. Ke4 b6 36. Rc6+ Kb8 37. Rd7 Rh2
38. Ke3 Rf8 39. Rcc7 Rxf5 40. Rb7+ Kc8 41. Rdc7+ Kd8 42. Rxg7 Kc8 1-0`,
    summary: "Polgár defeated the world’s top-rated player in the 2002 Moscow team match. The game was played at rapid time controls and became a landmark in her career.",
    sources: [
      {
        "title": "PGN Mentor — Kasparov game records",
        "url": "https://www.pgnmentor.com/players/Kasparov/Kasparov.pgn"
      },
      {
        "title": "ChessBase — Russia vs the Rest of the World, 2002 report",
        "url": "https://en.chessbase.com/post/what-is-wrong-with-the-great-ks-/1"
      }
    ],
  },
  {
    id: "kramnik-leko-2004-14",
    title: "Kramnik’s last-game comeback",
    era: "Champions",
    white: "Vladimir Kramnik",
    black: "Peter Leko",
    year: 2004,
    event: "World Championship, Game 14",
    date: "2004.10.18",
    result: "1-0",
    expectedPlies: 81,
    finalFen: "3k4/1pR2N2/pPb2K2/3pPp2/7r/8/8/8 b - - 5 41",
    pgn: `[Event "World Championship, Game 14"]
[Site "Brissago SUI"]
[Date "2004.10.18"]
[Round "14"]
[White "Vladimir Kramnik"]
[Black "Peter Leko"]
[Result "1-0"]

1. e4 c6 2. d4 d5 3. e5 Bf5 4. h4 h6 5. g4 Bd7 6. Nd2 c5 7. dxc5 e6 8. Nb3 Bxc5 9. Nxc5
Qa5+ 10. c3 Qxc5 11. Nf3 Ne7 12. Bd3 Nbc6 13. Be3 Qa5 14. Qd2 Ng6 15. Bd4 Nxd4 16. cxd4
Qxd2+ 17. Kxd2 Nf4 18. Rac1 h5 19. Rhg1 Bc6 20. gxh5 Nxh5 21. b4 a6 22. a4 Kd8 23. Ng5
Be8 24. b5 Nf4 25. b6 Nxd3 26. Kxd3 Rc8 27. Rxc8+ Kxc8 28. Rc1+ Bc6 29. Nxf7 Rxh4 30.
Nd6+ Kd8 31. Rg1 Rh3+ 32. Ke2 Ra3 33. Rxg7 Rxa4 34. f4 Ra2+ 35. Kf3 Ra3+ 36. Kg4 Rd3 37.
f5 Rxd4+ 38. Kg5 exf5 39. Kf6 Rg4 40. Rc7 Rh4 41. Nf7+ 1-0`,
    summary: "Kramnik wins the final game of his 2004 World Championship match against Leko.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2004 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2004.pgn"
      }
    ],
  },
  {
    id: "kramnik-topalov-2006-10",
    title: "Kramnik vs Topalov — Game 10",
    era: "Champions",
    white: "Vladimir Kramnik",
    black: "Veselin Topalov",
    year: 2006,
    event: "World Championship, Game 10",
    date: "2006.10.08",
    result: "1-0",
    expectedPlies: 85,
    finalFen: "6k1/8/7p/B4p2/2b2Pp1/Rn4P1/1P5P/6K1 b - - 0 43",
    pgn: `[Event "World Championship, Game 10"]
[Site "Elista RUS"]
[Date "2006.10.08"]
[Round "10"]
[White "Vladimir Kramnik"]
[Black "Veselin Topalov"]
[Result "1-0"]

1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. g3 Bb4+ 5. Bd2 Be7 6. Bg2 O-O 7. O-O c6 8. Bf4 Nbd7 9.
Qc2 a5 10. Rd1 Nh5 11. Bc1 b5 12. cxd5 cxd5 13. e4 dxe4 14. Qxe4 Rb8 15. Qe2 Nhf6 16.
Bf4 Rb6 17. Ne5 Nd5 18. Bxd5 exd5 19. Nc3 Nf6 20. Nxb5 Ba6 21. a4 Ne4 22. Rdc1 Qe8 23.
Rc7 Bd8 24. Ra7 f6 25. Nd7 Rf7 26. Nxb6 Rxa7 27. Nxd5 Rd7 28. Ndc3 Rxd4 29. Re1 f5 30.
Qc2 Rb4 31. Nd5 Rxb5 32. axb5 Qxb5 33. Nc7 Qc4 34. Qd1 Bxc7 35. Qd7 h6 36. Qxc7 Qb4 37.
Qb8+ Qxb8 38. Bxb8 Nd2 39. Ra1 g5 40. f4 Nb3 41. Ra3 Bc4 42. Bc7 g4 43. Bxa5 1-0`,
    summary: "Kramnik wins the tenth game of the 2006 World Championship match.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2006 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2006.pgn"
      }
    ],
  },
  {
    id: "kramnik-anand-2008-g3",
    title: "Anand’s Bonn breakthrough",
    era: "Champions",
    white: "Vladimir Kramnik",
    black: "Viswanathan Anand",
    year: 2008,
    event: "World Championship, game 3",
    date: "2008.10.17",
    result: "0-1",
    expectedPlies: 82,
    finalFen: "8/P7/4pp1k/7p/5P2/R4P2/KP5P/1b3q2 w - - 5 42",
    pgn: `[Event "World Championship, game 3"]
[Site "Bonn GER"]
[Date "2008.10.17"]
[Round "3"]
[White "Vladimir Kramnik"]
[Black "Viswanathan Anand"]
[Result "0-1"]

1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8.
Bd3 a6 9. e4 c5 10. e5 cxd4 11. Nxb5 axb5 12. exf6 gxf6 13. O-O Qb6 14. Qe2
Bb7 15. Bxb5 Bd6 16. Rd1 Rg8 17. g3 Rg4 18. Bf4 Bxf4 19. Nxd4 h5 20. Nxe6
fxe6 21. Rxd7 Kf8 22. Qd3 Rg7 23. Rxg7 Kxg7 24. gxf4 Rd8 25. Qe2 Kh6 26.
Kf1 Rg8 27. a4 Bg2+ 28. Ke1 Bh3 29. Ra3 Rg1+ 30. Kd2 Qd4+ 31. Kc2 Bg4 32.
f3 Bf5+ 33. Bd3 Bh3 34. a5 Rg2 35. a6 Rxe2+ 36. Bxe2 Bf5+ 37. Kb3 Qe3+ 38.
Ka2 Qxe2 39. a7 Qc4+ 40. Ka1 Qf1+ 41. Ka2 Bb1+ 0-1`,
    summary: "Anand takes the lead in the 2008 title match with an attacking win as Black. His active rooks and queen pursue Kramnik’s king despite White’s dangerous passed a-pawn.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2008 game records",
        "url": "https://www.pgnmentor.com/events/WorldChamp2008.pgn"
      },
      {
        "title": "FIDE — Anand takes the lead in game 3",
        "url": "https://old.fide.com/component/content/article/1-fide-news/3387-kramnik-0-1-anand-game-3.html"
      }
    ],
  },
  {
    id: "anand-kramnik-2008-6",
    title: "Anand vs Kramnik — Game 6",
    era: "Champions",
    white: "Viswanathan Anand",
    black: "Vladimir Kramnik",
    year: 2008,
    event: "World Championship, Game 6",
    date: "2008.10.21",
    result: "1-0",
    expectedPlies: 93,
    finalFen: "6Q1/6Bp/1n3k2/4n3/p7/P1r4P/8/4K3 b - - 1 47",
    pgn: `[Event "World Championship, Game 6"]
[Site "Bonn GER"]
[Date "2008.10.21"]
[Round "6"]
[White "Viswanathan Anand"]
[Black "Vladimir Kramnik"]
[Result "1-0"]

1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2 d5 5. cxd5 Qxd5 6. Nf3 Qf5 7. Qb3 Nc6 8. Bd2 O-O 9.
h3 b6 10. g4 Qa5 11. Rc1 Bb7 12. a3 Bxc3 13. Bxc3 Qd5 14. Qxd5 Nxd5 15. Bd2 Nf6 16. Rg1
Rac8 17. Bg2 Ne7 18. Bb4 c5 19. dxc5 Rfd8 20. Ne5 Bxg2 21. Rxg2 bxc5 22. Rxc5 Ne4 23.
Rxc8 Rxc8 24. Nd3 Nd5 25. Bd2 Rc2 26. Bc1 f5 27. Kd1 Rc8 28. f3 Nd6 29. Ke1 a5 30. e3 e5
31. gxf5 e4 32. fxe4 Nxe4 33. Bd2 a4 34. Nf2 Nd6 35. Rg4 Nc4 36. e4 Nf6 37. Rg3 Nxb2 38.
e5 Nd5 39. f6 Kf7 40. Ne4 Nc4 41. fxg7 Kg8 42. Rd3 Ndb6 43. Bh6 Nxe5 44. Nf6+ Kf7 45.
Rc3 Rxc3 46. g8=Q+ Kxf6 47. Bg7+ 1-0`,
    summary: "Anand wins with White in the sixth game of the 2008 World Championship match.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2008 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2008.pgn"
      }
    ],
  },
  {
    id: "hou-yifan-koneru-2011-7",
    title: "Hou Yifan vs Koneru — Game 7",
    era: "Champions",
    white: "Hou Yifan",
    black: "Humpy Koneru",
    year: 2011,
    event: "Women’s World Championship, Game 7",
    date: "2011.11.23",
    result: "1-0",
    expectedPlies: 193,
    finalFen: "r6k/8/6PP/4R1K1/8/8/8/8 b - - 4 97",
    pgn: `[Event "Women’s World Championship, Game 7"]
[Site "Tirana ALB"]
[Date "2011.11.23"]
[Round "7"]
[White "Hou Yifan"]
[Black "Humpy Koneru"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3
Qd7 10. d4 Re8 11. Nbd2 Bf8 12. a3 Bb7 13. d5 Ne7 14. Nf1 Ng6 15. N3h2 c6 16. Bg5 Be7
17. dxc6 Bxc6 18. Ng3 Nf4 19. Bxf6 Bxf6 20. Nh5 Qe7 21. Qf3 Bg5 22. Rad1 Ne6 23. Ng4 Rf8
24. Ne3 Bxe3 25. Qxe3 Rad8 26. Ng3 g6 27. Rd2 h5 28. Qh6 Nf4 29. Ne2 Qf6 30. Nxf4 exf4
31. Rd3 Rfe8 32. Rf3 Rd7 33. Rxf4 Qg7 34. Qg5 Re5 35. Qg3 Rde7 36. Rd1 g5 37. Rf5 Bxe4
38. Rxe5 Qxe5 39. Rxd6 Qxg3 40. fxg3 Bb7 41. Kf2 Kg7 42. Bd1 h4 43. gxh4 gxh4 44. Rd4
Be4 45. Bf3 Bxf3 46. Kxf3 Re1 47. Rxh4 Rb1 48. Rb4 Kf6 49. Ke3 Ke5 50. Re4+ Kd5 51. Rd4+
Ke5 52. Rd2 f5 53. Kd3 Kf4 54. Rf2+ Kg3 55. Rxf5 Rxb2 56. Rg5+ Kh4 57. Rg6 a5 58. Rg4+
Kh5 59. Re4 Kg6 60. Re2 Rb3 61. Ra2 b4 62. axb4 axb4 63. Rc2 Ra3 64. Kd4 bxc3 65. Rxc3
Ra2 66. Rg3+ Kh5 67. Ke3 Ra3+ 68. Kf2 Ra2+ 69. Kg1 Ra1+ 70. Kh2 Ra2 71. Rd3 Ra5 72. Rd4
Rb5 73. h4 Rb3 74. g3 Rb1 75. Kh3 Rh1+ 76. Kg2 Ra1 77. Rd5+ Kh6 78. Kh3 Ra3 79. Re5 Ra4
80. Re3 Ra6 81. g4 Ra1 82. Re6+ Kg7 83. h5 Rh1+ 84. Kg3 Kh7 85. Kf4 Rf1+ 86. Kg5 Rf7 87.
h6 Ra7 88. Kh5 Ra5+ 89. g5 Rb5 90. Re7+ Kg8 91. Kg6 Rb6+ 92. Kf5 Rb5+ 93. Kf6 Rb6+ 94.
Re6 Rb8 95. g6 Kh8 96. Re5 Ra8 97. Kg5 1-0`,
    summary: "Hou Yifan wins the seventh game of her Women’s World Championship match against Humpy Koneru.",
    sources: [
      {
        "title": "PGN Mentor — Hou game scores",
        "url": "https://www.pgnmentor.com/players/Hou.zip"
      }
    ],
  },
  {
    id: "carlsen-aronian-2012",
    title: "Carlsen outplays Aronian",
    era: "Champions",
    white: "Magnus Carlsen",
    black: "Levon Aronian",
    year: 2012,
    event: "Tata Steel, round 3",
    date: "2012.01.16",
    result: "1-0",
    expectedPlies: 135,
    finalFen: "8/1PK5/3B4/8/7N/7p/6k1/1r6 b - - 1 68",
    pgn: `[Event "Tata Steel, round 3"]
[Site "Wijk aan Zee NED"]
[Date "2012.01.16"]
[Round "3"]
[White "Magnus Carlsen"]
[Black "Levon Aronian"]
[Result "1-0"]

1. c4 e6 2. Nc3 d5 3. d4 Be7 4. cxd5 exd5 5. Bf4 c6 6. Qc2 Nf6 7. h3 g6 8.
e3 Bf5 9. Qd2 h5 10. Bd3 Bxd3 11. Qxd3 Nbd7 12. Nge2 a5 13. O-O O-O 14. f3
b5 15. e4 dxe4 16. fxe4 Nc5 17. Qf3 Ne6 18. Be3 b4 19. Nb1 Nh7 20. Nd2 Rc8
21. Rad1 Bh4 22. g3 Bf6 23. Nc4 Bg7 24. b3 Qe7 25. Qg2 Nc7 26. Nxa5 Rfe8
27. e5 Nd5 28. Bd2 Red8 29. Nf4 Qa7 30. Nxc6 Rxc6 31. Nxd5 Rc2 32. Kh1 Bf8
33. e6 Qa8 34. exf7+ Kh8 35. Nf4 Qxg2+ 36. Kxg2 Rxd4 37. Rf2 Rd6 38. Bc1
Rxf2+ 39. Kxf2 Rxd1 40. Bb2+ Nf6 41. Bxf6+ Kh7 42. Ne6 Bd6 43. Be5 Be7 44.
f8=Q Bxf8 45. Nxf8+ Kh6 46. Ne6 g5 47. h4 gxh4 48. gxh4 Kg6 49. Nd4 Rd3 50.
Nc6 Rd2+ 51. Ke3 Rxa2 52. Bd6 Ra1 53. Kd4 Rg1 54. Kc5 Kf5 55. Nxb4 Rc1+ 56.
Kd4 Re1 57. Nc6 Re4+ 58. Kd5 Rxh4 59. b4 Rh1 60. b5 Rb1 61. Nd4+ Kg4 62.
Kc6 Rc1+ 63. Kd7 Rb1 64. Kc7 h4 65. b6 Kh3 66. b7 Kg2 67. Nf5 h3 68. Nh4+
1-0`,
    summary: "Carlsen converts a complicated position into an unusual battle of minor pieces against a rook. A far-advanced b-pawn helps him finish this 68-move Wijk aan Zee duel.",
    sources: [
      {
        "title": "PGN Mentor — WijkaanZee2012 game records",
        "url": "https://www.pgnmentor.com/events/WijkaanZee2012.pgn"
      }
    ],
  },
  {
    id: "hou-yifan-polgar-2012-7-7",
    title: "Hou Yifan meets Judit Polgár",
    era: "Champions",
    white: "Hou Yifan",
    black: "Judit Polgár",
    year: 2012,
    event: "Gibraltar Open",
    date: "2012.01.30",
    result: "1-0",
    expectedPlies: 93,
    finalFen: "3R4/5pk1/prr1b2p/5P1R/8/1P1B2P1/2PK3P/8 b - - 0 47",
    pgn: `[Event "Gibraltar Open"]
[Site "Caleta ENG"]
[Date "2012.01.30"]
[Round "7.7"]
[White "Hou Yifan"]
[Black "Judit Polgár"]
[Result "1-0"]

1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 a6 6. Be2 Nge7 7. Bf4 Ng6 8. Nxc6 bxc6
9. Bd6 Bxd6 10. Qxd6 Qe7 11. O-O-O Qxd6 12. Rxd6 Ke7 13. Rhd1 Nf4 14. Bf3 Rb8 15. R6d2
g5 16. Na4 d5 17. g3 Ng6 18. Re1 Kf6 19. Bh5 Rb4 20. Nc3 d4 21. e5+ Nxe5 22. Ne4+ Ke7
23. Nxg5 h6 24. Nxe6 Bxe6 25. Rxe5 Rd8 26. f4 Rb5 27. Rde2 Kf6 28. Bf3 c5 29. a4 Rb4 30.
Rxc5 Rxa4 31. b3 Rb4 32. Be4 Bg4 33. Re1 Rd6 34. Bd3 Bd7 35. Ree5 Be6 36. Kd2 Rbb6 37.
Ra5 Rbc6 38. Ra4 Rb6 39. Re4 Bf5 40. Rexd4 Re6 41. Bc4 Rec6 42. Ra5 Bc8 43. Bd3 Be6 44.
Rd8 Bc8 45. Rad5 Be6 46. Rh5 Kg7 47. f5 1-0`,
    summary: "Hou Yifan wins their encounter at the Gibraltar Open.",
    sources: [
      {
        "title": "PGN Mentor — Hou game scores",
        "url": "https://www.pgnmentor.com/players/Hou.zip"
      }
    ],
  },
  {
    id: "gelfand-anand-2012-7",
    title: "Gelfand takes the lead — Game 7",
    era: "Champions",
    white: "Boris Gelfand",
    black: "Viswanathan Anand",
    year: 2012,
    event: "World Championship, Game 7",
    date: "2012.05.20",
    result: "1-0",
    expectedPlies: 75,
    finalFen: "7k/2R5/p3N2p/4Npp1/3P4/6P1/P1n1pPPK/1r6 b - - 0 38",
    pgn: `[Event "World Championship, Game 7"]
[Site "Moscow RUS"]
[Date "2012.05.20"]
[Round "7"]
[White "Boris Gelfand"]
[Black "Viswanathan Anand"]
[Result "1-0"]

1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. e3 e6 5. Nf3 a6 6. c5 Nbd7 7. Qc2 b6 8. cxb6 Nxb6 9. Bd2
c5 10. Rc1 cxd4 11. exd4 Bd6 12. Bg5 O-O 13. Bd3 h6 14. Bh4 Bb7 15. O-O Qb8 16. Bg3 Rc8
17. Qe2 Bxg3 18. hxg3 Qd6 19. Rc2 Nbd7 20. Rfc1 Rab8 21. Na4 Ne4 22. Rxc8+ Bxc8 23. Qc2
g5 24. Qc7 Qxc7 25. Rxc7 f6 26. Bxe4 dxe4 27. Nd2 f5 28. Nc4 Nf6 29. Nc5 Nd5 30. Ra7 Nb4
31. Ne5 Nc2 32. Nc6 Rxb2 33. Rc7 Rb1+ 34. Kh2 e3 35. Rxc8+ Kh7 36. Rc7+ Kh8 37. Ne5 e2
38. Nxe6 1-0`,
    summary: "Gelfand wins the seventh game of the World Championship match against Anand.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2012 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2012.pgn"
      }
    ],
  },
  {
    id: "anand-gelfand-2012-8",
    title: "Anand’s 17-move reply",
    era: "Champions",
    white: "Viswanathan Anand",
    black: "Boris Gelfand",
    year: 2012,
    event: "World Championship, Game 8",
    date: "2012.05.21",
    result: "1-0",
    expectedPlies: 33,
    finalFen: "rn2r1k1/pp3p1p/3p2p1/2pP3P/2P5/2N5/PPK2Q1P/1R3B1q b - - 1 17",
    pgn: `[Event "World Championship, Game 8"]
[Site "Moscow RUS"]
[Date "2012.05.21"]
[Round "8"]
[White "Viswanathan Anand"]
[Black "Boris Gelfand"]
[Result "1-0"]

1. d4 Nf6 2. c4 g6 3. f3 c5 4. d5 d6 5. e4 Bg7 6. Ne2 O-O 7. Nec3 Nh5 8. Bg5 Bf6 9. Bxf6
exf6 10. Qd2 f5 11. exf5 Bxf5 12. g4 Re8+ 13. Kd1 Bxb1 14. Rxb1 Qf6 15. gxh5 Qxf3+ 16.
Kc2 Qxh1 17. Qf2 1-0`,
    summary: "Anand wins the eighth game in seventeen moves, immediately after his defeat in game seven.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2012 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2012.pgn"
      }
    ],
  },
  {
    id: "aronian-anand-2013",
    title: "Anand’s Immortal Game",
    era: "Champions",
    white: "Levon Aronian",
    black: "Viswanathan Anand",
    year: 2013,
    event: "Tata Steel, round 4",
    date: "2013.01.15",
    result: "0-1",
    expectedPlies: 46,
    finalFen: "2r3k1/pb4p1/4p3/1p3p1q/5Pn1/P1NQb2P/1P4P1/R1B2R1K w - - 4 24",
    pgn: `[Event "Tata Steel, round 4"]
[Site "Wijk aan Zee NED"]
[Date "2013.01.15"]
[Round "4"]
[White "Levon Aronian"]
[Black "Viswanathan Anand"]
[Result "0-1"]

1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3
Bd6 9. O-O O-O 10. Qc2 Bb7 11. a3 Rc8 12. Ng5 c5 13. Nxh7 Ng4 14. f4 cxd4 15.
exd4 Bc5 16. Be2 Nde5 17. Bxg4 Bxd4+ 18. Kh1 Nxg4 19. Nxf8 f5 20. Ng6 Qf6 21. h3
Qxg6 22. Qe2 Qh5 23. Qd3 Be3 0-1`,
    summary: "Anand’s celebrated 23-move victory combines a daring pawn thrust with rapid piece activity in the Semi-Slav. His bishops, knight and queen converge around Aronian’s king in a compact attacking masterpiece.",
    sources: [
      {
        "title": "PGN Mentor — WijkaanZee2013 game records",
        "url": "https://www.pgnmentor.com/events/WijkaanZee2013.pgn"
      },
      {
        "title": "NM Sam Copeland — Anand’s Immortal Game",
        "url": "https://www.chess.com/blog/SamCopeland/anands-immortal-chess-game-aronian-vs-anand-2013"
      }
    ],
  },
  {
    id: "carlsen-anand-2013-g5",
    title: "Carlsen takes the Chennai lead",
    era: "Champions",
    white: "Magnus Carlsen",
    black: "Viswanathan Anand",
    year: 2013,
    event: "World Championship, game 5",
    date: "2013.11.15",
    result: "1-0",
    expectedPlies: 115,
    finalFen: "8/P6R/8/2k5/2p4P/2K5/r7/8 b - - 0 58",
    pgn: `[Event "World Championship, game 5"]
[Site "Chennai IND"]
[Date "2013.11.15"]
[Round "5"]
[White "Magnus Carlsen"]
[Black "Viswanathan Anand"]
[Result "1-0"]

1. c4 e6 2. d4 d5 3. Nc3 c6 4. e4 dxe4 5. Nxe4 Bb4+ 6. Nc3 c5 7. a3 Ba5 8. Nf3
Nf6 9. Be3 Nc6 10. Qd3 cxd4 11. Nxd4 Ng4 12. O-O-O Nxe3 13. fxe3 Bc7 14. Nxc6
bxc6 15. Qxd8+ Bxd8 16. Be2 Ke7 17. Bf3 Bd7 18. Ne4 Bb6 19. c5 f5 20. cxb6 fxe4
21. b7 Rab8 22. Bxe4 Rxb7 23. Rhf1 Rb5 24. Rf4 g5 25. Rf3 h5 26. Rdf1 Be8 27.
Bc2 Rc5 28. Rf6 h4 29. e4 a5 30. Kd2 Rb5 31. b3 Bh5 32. Kc3 Rc5+ 33. Kb2 Rd8 34.
R1f2 Rd4 35. Rh6 Bd1 36. Bb1 Rb5 37. Kc3 c5 38. Rb2 e5 39. Rg6 a4 40. Rxg5 Rxb3+
41. Rxb3 Bxb3 42. Rxe5+ Kd6 43. Rh5 Rd1 44. e5+ Kd5 45. Bh7 Rc1+ 46. Kb2 Rg1 47.
Bg8+ Kc6 48. Rh6+ Kd7 49. Bxb3 axb3 50. Kxb3 Rxg2 51. Rxh4 Ke6 52. a4 Kxe5 53.
a5 Kd6 54. Rh7 Kd5 55. a6 c4+ 56. Kc3 Ra2 57. a7 Kc5 58. h4 1-0`,
    summary: "Carlsen scores the first decisive result of the 2013 title match. Persistent pressure gives way to a rook ending in which his passed pawns decide the game.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2013 game records",
        "url": "https://www.pgnmentor.com/events/WorldChamp2013.pgn"
      },
      {
        "title": "FIDE — 2013 World Championship reports",
        "url": "https://old.fide.com/component/content/article/1-fide-news/7539-fide-world-championship-carlsen-takes-the-lead.html"
      }
    ],
  },
  {
    id: "anand-carlsen-2013-g6",
    title: "Carlsen’s second Chennai win",
    era: "Champions",
    white: "Viswanathan Anand",
    black: "Magnus Carlsen",
    year: 2013,
    event: "World Championship, game 6",
    date: "2013.11.16",
    result: "0-1",
    expectedPlies: 134,
    finalFen: "R7/8/7p/8/1PP2k2/7P/5p1K/6r1 w - - 6 68",
    pgn: `[Event "World Championship, game 6"]
[Site "Chennai IND"]
[Date "2013.11.16"]
[Round "6"]
[White "Viswanathan Anand"]
[Black "Magnus Carlsen"]
[Result "0-1"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. d3 Bc5 5. c3 O-O 6. O-O Re8 7. Re1 a6 8. Ba4
b5 9. Bb3 d6 10. Bg5 Be6 11. Nbd2 h6 12. Bh4 Bxb3 13. axb3 Nb8 14. h3 Nbd7 15.
Nh2 Qe7 16. Ndf1 Bb6 17. Ne3 Qe6 18. b4 a5 19. bxa5 Bxa5 20. Nhg4 Bb6 21. Bxf6
Nxf6 22. Nxf6+ Qxf6 23. Qg4 Bxe3 24. fxe3 Qe7 25. Rf1 c5 26. Kh2 c4 27. d4 Rxa1
28. Rxa1 Qb7 29. Rd1 Qc6 30. Qf5 exd4 31. Rxd4 Re5 32. Qf3 Qc7 33. Kh1 Qe7 34.
Qg4 Kh7 35. Qf4 g6 36. Kh2 Kg7 37. Qf3 Re6 38. Qg3 Rxe4 39. Qxd6 Rxe3 40. Qxe7
Rxe7 41. Rd5 Rb7 42. Rd6 f6 43. h4 Kf7 44. h5 gxh5 45. Rd5 Kg6 46. Kg3 Rb6 47.
Rc5 f5 48. Kh4 Re6 49. Rxb5 Re4+ 50. Kh3 Kg5 51. Rb8 h4 52. Rg8+ Kh5 53. Rf8 Rf4
54. Rc8 Rg4 55. Rf8 Rg3+ 56. Kh2 Kg5 57. Rg8+ Kf4 58. Rc8 Ke3 59. Rxc4 f4 60.
Ra4 h3 61. gxh3 Rg6 62. c4 f3 63. Ra3+ Ke2 64. b4 f2 65. Ra2+ Kf3 66. Ra3+ Kf4
67. Ra8 Rg1 0-1`,
    summary: "Carlsen wins with Black immediately after his breakthrough in game five. The Berlin Defence leads to a long rook ending, where a passed f-pawn becomes the key to victory.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2013 game records",
        "url": "https://www.pgnmentor.com/events/WorldChamp2013.pgn"
      },
      {
        "title": "FIDE — 2013 World Championship reports",
        "url": "https://old.fide.com/component/content/article/1-fide-news/7539-fide-world-championship-carlsen-takes-the-lead.html"
      }
    ],
  },
  {
    id: "caruana-vachier-lagrave-2014-2-2",
    title: "Caruana vs Vachier-Lagrave — Sinquefield",
    era: "Champions",
    white: "Fabiano Caruana",
    black: "Maxime Vachier-Lagrave",
    year: 2014,
    event: "Sinquefield Cup, Round 2",
    date: "2014.08.28",
    result: "1-0",
    expectedPlies: 59,
    finalFen: "5rk1/pp3npp/4p3/3qP3/6P1/2N1Q3/PR2B2P/6K1 b - - 2 30",
    pgn: `[Event "Sinquefield Cup, Round 2"]
[Site "Saint Louis USA"]
[Date "2014.08.28"]
[Round "2.2"]
[White "Fabiano Caruana"]
[Black "Maxime Vachier-Lagrave"]
[Result "1-0"]

1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 e6 5. Be2 c5 6. Be3 Qb6 7. Nc3 Nc6 8. O-O Qxb2 9. Qe1
cxd4 10. Bxd4 Nxd4 11. Nxd4 Bb4 12. Ndb5 Ba5 13. Rb1 Qxc2 14. Rc1 Qb2 15. g4 Bg6 16. f4
Be4 17. Rf2 Nh6 18. Bd3 Qb4 19. Rb1 Qc5 20. Nxe4 dxe4 21. Qxa5 O-O 22. Be2 e3 23. Rff1
Rfc8 24. Qe1 Qd5 25. Rb2 f6 26. Qg3 fxe5 27. fxe5 Rf8 28. Rxf8+ Rxf8 29. Qxe3 Nf7 30.
Nc3 1-0`,
    summary: "Caruana wins their second-round encounter at the 2014 Sinquefield Cup.",
    sources: [
      {
        "title": "PGN Mentor — SaintLouis2014 game scores",
        "url": "https://www.pgnmentor.com/events/SaintLouis2014.pgn"
      }
    ],
  },
  {
    id: "carlsen-caruana-2014-3-1",
    title: "Caruana defeats Carlsen — Sinquefield",
    era: "Champions",
    white: "Magnus Carlsen",
    black: "Fabiano Caruana",
    year: 2014,
    event: "Sinquefield Cup, Round 3",
    date: "2014.08.29",
    result: "0-1",
    expectedPlies: 68,
    finalFen: "1Q6/pp2P1pk/1bp4p/8/8/2P5/PP4PK/6q1 w - - 2 35",
    pgn: `[Event "Sinquefield Cup, Round 3"]
[Site "Saint Louis USA"]
[Date "2014.08.29"]
[Round "3.1"]
[White "Magnus Carlsen"]
[Black "Fabiano Caruana"]
[Result "0-1"]

1. e4 e5 2. Bc4 Nf6 3. d3 c6 4. Nf3 d5 5. Bb3 Bb4+ 6. c3 Bd6 7. Bg5 dxe4 8. dxe4 h6 9.
Bh4 Qe7 10. Nbd2 Nbd7 11. Bg3 Bc7 12. O-O Nh5 13. h3 Nxg3 14. fxg3 Nc5 15. Bxf7+ Kxf7
16. Nxe5+ Kg8 17. Ng6 Qg5 18. Rf8+ Kh7 19. Nxh8 Bg4 20. Qf1 Nd3 21. Qxd3 Rxf8 22. hxg4
Qxg4 23. Nf3 Qxg3 24. e5+ Kxh8 25. e6 Bb6+ 26. Kh1 Qg4 27. Qd6 Rd8 28. Qe5 Rd5 29. Qb8+
Kh7 30. e7 Qh5+ 31. Nh2 Rd1+ 32. Rxd1 Qxd1+ 33. Nf1 Qxf1+ 34. Kh2 Qg1+ 0-1`,
    summary: "Caruana wins with Black against Carlsen in round three of the 2014 Sinquefield Cup.",
    sources: [
      {
        "title": "PGN Mentor — SaintLouis2014 game scores",
        "url": "https://www.pgnmentor.com/events/SaintLouis2014.pgn"
      }
    ],
  },
  {
    id: "carlsen-anand-2014-g11",
    title: "Carlsen retains the crown",
    era: "Champions",
    white: "Magnus Carlsen",
    black: "Viswanathan Anand",
    year: 2014,
    event: "World Championship, game 11",
    date: "2014.11.23",
    result: "1-0",
    expectedPlies: 89,
    finalFen: "8/4b3/4P3/1k4P1/8/ppK5/8/4R3 b - - 1 45",
    pgn: `[Event "World Championship, game 11"]
[Site "Sochi RUS"]
[Date "2014.11.23"]
[Round "11"]
[White "Magnus Carlsen"]
[Black "Viswanathan Anand"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4 5. d4 Nd6 6. Bxc6 dxc6 7. dxe5 Nf5 8.
Qxd8+ Kxd8 9. h3 Bd7 10. Nc3 h6 11. b3 Kc8 12. Bb2 c5 13. Rad1 b6 14. Rfe1 Be6
15. Nd5 g5 16. c4 Kb7 17. Kh2 a5 18. a4 Ne7 19. g4 Ng6 20. Kg3 Be7 21. Nd2 Rhd8
22. Ne4 Bf8 23. Nef6 b5 24. Bc3 bxa4 25. bxa4 Kc6 26. Kf3 Rdb8 27. Ke4 Rb4 28.
Bxb4 cxb4 29. Nh5 Kb7 30. f4 gxf4 31. Nhxf4 Nxf4 32. Nxf4 Bxc4 33. Rd7 Ra6 34.
Nd5 Rc6 35. Rxf7 Bc5 36. Rxc7+ Rxc7 37. Nxc7 Kc6 38. Nb5 Bxb5 39. axb5+ Kxb5 40.
e6 b3 41. Kd3 Be7 42. h4 a4 43. g5 hxg5 44. hxg5 a3 45. Kc3 1-0`,
    summary: "Carlsen’s win in Sochi secures the 2014 world title with a game to spare. After a tense Berlin middlegame, his central and kingside pawns settle the contest.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2014 game records",
        "url": "https://www.pgnmentor.com/events/WorldChamp2014.pgn"
      },
      {
        "title": "FIDE — Carlsen wins the 2014 championship match",
        "url": "https://old.fide.com/component/content/article/1-fide-news/8393-magnus-carlsen-wins-the-world-championship-match.html"
      }
    ],
  },
  {
    id: "nakamura-topalov-2016",
    title: "Nakamura’s Candidates comeback",
    era: "Champions",
    white: "Hikaru Nakamura",
    black: "Veselin Topalov",
    year: 2016,
    event: "Candidates Tournament, round 7",
    date: "2016.03.19",
    result: "1-0",
    expectedPlies: 77,
    finalFen: "8/5ppk/2p3p1/2P3R1/4nQ1P/4BpP1/5P1K/3q4 b - - 1 39",
    pgn: `[Event "Candidates Tournament, round 7"]
[Site "Moscow RUS"]
[Date "2016.03.19"]
[Round "7"]
[White "Hikaru Nakamura"]
[Black "Veselin Topalov"]
[Result "1-0"]

1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. e3 Bf5 5. Nc3 e6 6. Nh4 Bg6 7. Nxg6 hxg6 8. Rb1
Nbd7 9. c5 a5 10. a3 Be7 11. g3 e5 12. Bg2 e4 13. b4 axb4 14. axb4 Nf8 15. b5
Ne6 16. Bd2 O-O 17. Na4 Ng5 18. h4 Nf3+ 19. Bxf3 exf3 20. bxc6 bxc6 21. Nc3 Bxc5
22. dxc5 d4 23. exd4 Qxd4 24. O-O Qg4 25. Re1 Rfd8 26. Rb2 Rd4 27. Re7 Rad8 28.
Qb3 Rf8 29. Qd1 Rfd8 30. Qb3 Rf8 31. Nd1 Nd5 32. Re5 Kh7 33. Kh2 Nf6 34. Be3 Rb8
35. Qxb8 Rxd1 36. Rb1 Qd7 37. Rg5 Ne4 38. Rxd1 Qxd1 39. Qf4 1-0`,
    summary: "A sharp Slav Defence pits Topalov’s kingside activity against Nakamura’s pressure on the queenside. Nakamura emerges from the complications to score his first win of the 2016 Candidates.",
    sources: [
      {
        "title": "PGN Mentor — Candidates2016 game records",
        "url": "https://www.pgnmentor.com/events/Candidates2016.pgn"
      },
      {
        "title": "World Chess — Nakamura and Topalov’s round 7 press conference",
        "url": "https://www.youtube.com/watch?v=1FCC3EPHqRU"
      }
    ],
  },
  {
    id: "karjakin-caruana-2016-14-4",
    title: "Karjakin’s final-round victory",
    era: "Champions",
    white: "Sergey Karjakin",
    black: "Fabiano Caruana",
    year: 2016,
    event: "Candidates tournament, Round 14",
    date: "2016.03.28",
    result: "1-0",
    expectedPlies: 83,
    finalFen: "3R1k2/5B2/5p2/4qQ1p/1p2r3/6P1/P1P3bP/1K6 b - - 4 42",
    pgn: `[Event "Candidates tournament, Round 14"]
[Site "Moscow RUS"]
[Date "2016.03.28"]
[Round "14.4"]
[White "Sergey Karjakin"]
[Black "Fabiano Caruana"]
[Result "1-0"]

1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 d6 6. Bg5 e6 7. Qd2 a6 8. O-O-O Bd7 9.
f4 h6 10. Bh4 b5 11. Bxf6 gxf6 12. f5 Qb6 13. fxe6 fxe6 14. Nxc6 Qxc6 15. Bd3 h5 16. Kb1
b4 17. Ne2 Qc5 18. Rhf1 Bh6 19. Qe1 a5 20. b3 Rg8 21. g3 Ke7 22. Bc4 Be3 23. Rf3 Rg4 24.
Qf1 Rf8 25. Nf4 Bxf4 26. Rxf4 a4 27. bxa4 Bxa4 28. Qd3 Bc6 29. Bb3 Rg5 30. e5 Rxe5 31.
Rc4 Rd5 32. Qe2 Qb6 33. Rh4 Re5 34. Qd3 Bg2 35. Rd4 d5 36. Qd2 Re4 37. Rxd5 exd5 38.
Qxd5 Qc7 39. Qf5 Rf7 40. Bxf7 Qe5 41. Rd7+ Kf8 42. Rd8+ 1-0`,
    summary: "Karjakin wins the final-round encounter against Caruana at the 2016 Candidates tournament.",
    sources: [
      {
        "title": "PGN Mentor — Candidates2016 game scores",
        "url": "https://www.pgnmentor.com/events/Candidates2016.pgn"
      }
    ],
  },
  {
    id: "carlsen-karjakin-2016-10",
    title: "Carlsen levels the match — Game 10",
    era: "Champions",
    white: "Magnus Carlsen",
    black: "Sergey Karjakin",
    year: 2016,
    event: "World Championship, Game 10",
    date: "2016.11.24",
    result: "1-0",
    expectedPlies: 149,
    finalFen: "7r/kp6/5K2/P2R3p/7P/6P1/8/8 b - - 9 75",
    pgn: `[Event "World Championship, Game 10"]
[Site "New York USA"]
[Date "2016.11.24"]
[Round "10"]
[White "Magnus Carlsen"]
[Black "Sergey Karjakin"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. d3 Bc5 5. c3 O-O 6. Bg5 h6 7. Bh4 Be7 8. O-O d6 9.
Nbd2 Nh5 10. Bxe7 Qxe7 11. Nc4 Nf4 12. Ne3 Qf6 13. g3 Nh3+ 14. Kh1 Ne7 15. Bc4 c6 16.
Bb3 Ng6 17. Qe2 a5 18. a4 Be6 19. Bxe6 fxe6 20. Nd2 d5 21. Qh5 Ng5 22. h4 Nf3 23. Nxf3
Qxf3+ 24. Qxf3 Rxf3 25. Kg2 Rf7 26. Rfe1 h5 27. Nf1 Kf8 28. Nd2 Ke7 29. Re2 Kd6 30. Nf3
Raf8 31. Ng5 Re7 32. Rae1 Rfe8 33. Nf3 Nh8 34. d4 exd4 35. Nxd4 g6 36. Re3 Nf7 37. e5+
Kd7 38. Rf3 Nh6 39. Rf6 Rg7 40. b4 axb4 41. cxb4 Ng8 42. Rf3 Nh6 43. a5 Nf5 44. Nb3 Kc7
45. Nc5 Kb8 46. Rb1 Ka7 47. Rd3 Rc7 48. Ra3 Nd4 49. Rd1 Nf5 50. Kh3 Nh6 51. f3 Rf7 52.
Rd4 Nf5 53. Rd2 Rh7 54. Rb3 Ree7 55. Rdd3 Rh8 56. Rb1 Rhh7 57. b5 cxb5 58. Rxb5 d4 59.
Rb6 Rc7 60. Nxe6 Rc3 61. Nf4 Rhc7 62. Nd5 Rxd3 63. Nxc7 Kb8 64. Nb5 Kc8 65. Rxg6 Rxf3
66. Kg2 Rb3 67. Nd6+ Nxd6 68. Rxd6 Re3 69. e6 Kc7 70. Rxd4 Rxe6 71. Rd5 Rh6 72. Kf3 Kb8
73. Kf4 Ka7 74. Kg5 Rh8 75. Kf6 1-0`,
    summary: "Carlsen wins the tenth classical game of his 2016 World Championship match.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2016 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2016.pgn"
      }
    ],
  },
  {
    id: "carlsen-karjakin-2016-4",
    title: "Carlsen’s queen sacrifice for mate",
    era: "Champions",
    white: "Magnus Carlsen",
    black: "Sergey Karjakin",
    year: 2016,
    event: "World Championship, Rapid tiebreak Game 4",
    date: "2016.11.30",
    result: "1-0",
    expectedPlies: 99,
    finalFen: "2R5/4bppk/1p1p3Q/5R1P/4P3/5P2/r4q1P/7K b - - 6 50",
    pgn: `[Event "World Championship, Rapid tiebreak Game 4"]
[Site "New York USA"]
[Date "2016.11.30"]
[Round "4"]
[White "Magnus Carlsen"]
[Black "Sergey Karjakin"]
[Result "1-0"]

1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. f3 e5 6. Nb3 Be7 7. c4 a5 8. Be3 a4 9. Nc1
O-O 10. Nc3 Qa5 11. Qd2 Na6 12. Be2 Nc5 13. O-O Bd7 14. Rb1 Rfc8 15. b4 axb3 16. axb3
Qd8 17. Nd3 Ne6 18. Nb4 Bc6 19. Rfd1 h5 20. Bf1 h4 21. Qf2 Nd7 22. g3 Ra3 23. Bh3 Rca8
24. Nc2 R3a6 25. Nb4 Ra5 26. Nc2 b6 27. Rd2 Qc7 28. Rbd1 Bf8 29. gxh4 Nf4 30. Bxf4 exf4
31. Bxd7 Qxd7 32. Nb4 Ra3 33. Nxc6 Qxc6 34. Nb5 Rxb3 35. Nd4 Qxc4 36. Nxb3 Qxb3 37. Qe2
Be7 38. Kg2 Qe6 39. h5 Ra3 40. Rd3 Ra2 41. R3d2 Ra3 42. Rd3 Ra7 43. Rd5 Rc7 44. Qd2 Qf6
45. Rf5 Qh4 46. Rc1 Ra7 47. Qxf4 Ra2+ 48. Kh1 Qf2 49. Rc8+ Kh7 50. Qh6+ 1-0`,
    summary: "Carlsen ends the final rapid tiebreak with a queen sacrifice on h6.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2016 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2016.pgn"
      }
    ],
  },
  {
    id: "carlsen-caruana-2018-3",
    title: "Carlsen closes the tiebreak",
    era: "Champions",
    white: "Magnus Carlsen",
    black: "Fabiano Caruana",
    year: 2018,
    event: "World Championship, Rapid tiebreak Game 3",
    date: "2018.11.28",
    result: "1-0",
    expectedPlies: 101,
    finalFen: "8/6pk/p6p/2Q5/PP1n1pQ1/4q2P/6BK/8 b - - 1 51",
    pgn: `[Event "World Championship, Rapid tiebreak Game 3"]
[Site "London ENG"]
[Date "2018.11.28"]
[Round "3"]
[White "Magnus Carlsen"]
[Black "Fabiano Caruana"]
[Result "1-0"]

1. e4 c5 2. Nf3 e6 3. c4 Nc6 4. d4 cxd4 5. Nxd4 Bc5 6. Nc2 Nf6 7. Nc3 O-O 8. Be3 b6 9.
Be2 Bb7 10. O-O Qe7 11. Qd2 Rfd8 12. Rfd1 Ne5 13. Bxc5 bxc5 14. f4 Ng6 15. Qe3 d6 16.
Rd2 a6 17. Rad1 Qc7 18. b3 h6 19. g3 Rd7 20. Bf3 Re8 21. Qf2 Ne7 22. h3 Red8 23. Bg2 Nc6
24. g4 Qa5 25. Na4 Qc7 26. e5 dxe5 27. Nxc5 Rxd2 28. Rxd2 Rxd2 29. Qxd2 Ba8 30. fxe5
Qxe5 31. Nd7 Qb2 32. Qd6 Nxd7 33. Qxd7 Qxc2 34. Qe8+ Kh7 35. Qxa8 Qd1+ 36. Kh2 Qd6+ 37.
Kh1 Nd4 38. Qe4+ f5 39. gxf5 exf5 40. Qe3 Ne6 41. b4 Ng5 42. c5 Qf6 43. c6 Ne6 44. a4
Nc7 45. Qf4 Ne6 46. Qd6 Qa1+ 47. Kh2 Nd4 48. c7 Qc3 49. Qc5 Qe3 50. c8=Q f4 51. Qg4 1-0`,
    summary: "Carlsen wins the third rapid tiebreak game of the 2018 World Championship.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2018 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2018.pgn"
      }
    ],
  },
  {
    id: "carlsen-nepomniachtchi-2021-g6",
    title: "The 136-move marathon",
    era: "Champions",
    white: "Magnus Carlsen",
    black: "Ian Nepomniachtchi",
    year: 2021,
    event: "World Championship, game 6",
    date: "2021.12.03",
    result: "1-0",
    expectedPlies: 271,
    finalFen: "3k4/5RN1/4P3/5P2/7K/8/8/6q1 b - - 2 136",
    pgn: `[Event "World Championship, game 6"]
[Site "Dubai UAE"]
[Date "2021.12.03"]
[Round "6"]
[White "Magnus Carlsen"]
[Black "Ian Nepomniachtchi"]
[Result "1-0"]

1.d4 Nf6 2.Nf3 d5 3.g3 e6 4.Bg2 Be7 5.O-O O-O 6.b3 c5 7.dxc5 Bxc5 8.c4 dxc4
9.Qc2 Qe7 10.Nbd2 Nc6 11.Nxc4 b5 12.Nce5 Nb4 13.Qb2 Bb7 14.a3 Nc6 15.Nd3 Bb6
16.Bg5 Rfd8 17.Bxf6 gxf6 18.Rac1 Nd4 19.Nxd4 Bxd4 20.Qa2 Bxg2 21.Kxg2 Qb7+
22.Kg1 Qe4 23.Qc2 a5 24.Rfd1 Kg7 25.Rd2 Rac8 26.Qxc8 Rxc8 27.Rxc8 Qd5 28.b4 a4
29.e3 Be5 30.h4 h5 31.Kh2 Bb2 32.Rc5 Qd6 33.Rd1 Bxa3 34.Rxb5 Qd7 35.Rc5 e5
36.Rc2 Qd5 37.Rdd2 Qb3 38.Ra2 e4 39.Nc5 Qxb4 40.Nxe4 Qb3 41.Rac2 Bf8 42.Nc5 Qb5
43.Nd3 a3 44.Nf4 Qa5 45.Ra2 Bb4 46.Rd3 Kh6 47.Rd1 Qa4 48.Rda1 Bd6 49.Kg1 Qb3
50.Ne2 Qd3 51.Nd4 Kh7 52.Kh2 Qe4 53.Rxa3 Qxh4+ 54.Kg1 Qe4 55.Ra4 Be5 56.Ne2 Qc2
57.R1a2 Qb3 58.Kg2 Qd5+ 59.f3 Qd1 60.f4 Bc7 61.Kf2 Bb6 62.Ra1 Qb3 63.Re4 Kg7
64.Re8 f5 65.Raa8 Qb4 66.Rac8 Ba5 67.Rc1 Bb6 68.Re5 Qb3 69.Re8 Qd5 70.Rcc8 Qh1
71.Rc1 Qd5 72.Rb1 Ba7 73.Re7 Bc5 74.Re5 Qd3 75.Rb7 Qc2 76.Rb5 Ba7 77.Ra5 Bb6
78.Rab5 Ba7 79.Rxf5 Qd3 80.Rxf7+ Kxf7 81.Rb7+ Kg6 82.Rxa7 Qd5 83.Ra6+ Kh7
84.Ra1 Kg6 85.Nd4 Qb7 86.Ra2 Qh1 87.Ra6+ Kf7 88.Nf3 Qb1 89.Rd6 Kg7 90.Rd5 Qa2+
91.Rd2 Qb1 92.Re2 Qb6 93.Rc2 Qb1 94.Nd4 Qh1 95.Rc7+ Kf6 96.Rc6+ Kf7 97.Nf3 Qb1
98.Ng5+ Kg7 99.Ne6+ Kf7 100.Nd4 Qh1 101.Rc7+ Kf6 102.Nf3 Qb1 103.Rd7 Qb2+
104.Rd2 Qb1 105.Ng1 Qb4 106.Rd1 Qb3 107.Rd6+ Kg7 108.Rd4 Qb2+ 109.Ne2 Qb1
110.e4 Qh1 111.Rd7+ Kg8 112.Rd4 Qh2+ 113.Ke3 h4 114.gxh4 Qh3+ 115.Kd2 Qxh4
116.Rd3 Kf8 117.Rf3 Qd8+ 118.Ke3 Qa5 119.Kf2 Qa7+ 120.Re3 Qd7 121.Ng3 Qd2+
122.Kf3 Qd1+ 123.Re2 Qb3+ 124.Kg2 Qb7 125.Rd2 Qb3 126.Rd5 Ke7 127.Re5+ Kf7
128.Rf5+ Ke8 129.e5 Qa2+ 130.Kh3 Qe6 131.Kh4 Qh6+ 132.Nh5 Qh7 133.e6 Qg6
134.Rf7 Kd8 135.f5 Qg1 136.Ng7  1-0`,
    summary: "Carlsen earns the first win of the 2021 title match after an extraordinary 136-move struggle. The long endgame features his rook and knight battling Nepomniachtchi’s queen.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2021 game records",
        "url": "https://www.pgnmentor.com/events/WorldChamp2021.pgn"
      },
      {
        "title": "FIDE — 2021 championship game 6 report",
        "url": "https://www.fide.com/fide-world-championship-2021-are-we-there-yet/"
      }
    ],
  },
  {
    id: "carlsen-nepomniachtchi-2021-8",
    title: "Carlsen vs Nepomniachtchi — Game 8",
    era: "Champions",
    white: "Magnus Carlsen",
    black: "Ian Nepomniachtchi",
    year: 2021,
    event: "World Championship, Game 8",
    date: "2021.12.05",
    result: "1-0",
    expectedPlies: 91,
    finalFen: "8/7k/8/3P4/6P1/1P2qQ1p/6P1/7K b - - 1 46",
    pgn: `[Event "World Championship, Game 8"]
[Site "Dubai UAE"]
[Date "2021.12.05"]
[Round "8"]
[White "Magnus Carlsen"]
[Black "Ian Nepomniachtchi"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nf6 3. d4 Nxe4 4. Bd3 d5 5. Nxe5 Nd7 6. Nxd7 Bxd7 7. Nd2 Nxd2 8. Bxd2
Bd6 9. O-O h5 10. Qe1+ Kf8 11. Bb4 Qe7 12. Bxd6 Qxd6 13. Qd2 Re8 14. Rae1 Rh6 15. Qg5 c6
16. Rxe8+ Bxe8 17. Re1 Qf6 18. Qe3 Bd7 19. h3 h4 20. c4 dxc4 21. Bxc4 b5 22. Qa3+ Kg8
23. Qxa7 Qd8 24. Bb3 Rd6 25. Re4 Be6 26. Bxe6 Rxe6 27. Rxe6 fxe6 28. Qc5 Qa5 29. Qxc6
Qe1+ 30. Kh2 Qxf2 31. Qxe6+ Kh7 32. Qe4+ Kg8 33. b3 Qxa2 34. Qe8+ Kh7 35. Qxb5 Qf2 36.
Qe5 Qb2 37. Qe4+ Kg8 38. Qd3 Qf2 39. Qc3 Qf4+ 40. Kg1 Kh7 41. Qd3+ g6 42. Qd1 Qe3+ 43.
Kh1 g5 44. d5 g4 45. hxg4 h3 46. Qf3 1-0`,
    summary: "Carlsen wins the eighth game of the 2021 World Championship match.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2021 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2021.pgn"
      }
    ],
  },
  {
    id: "ding-liren-nepomniachtchi-2023-2-1",
    title: "Nepomniachtchi strikes first — Game 2",
    era: "Champions",
    white: "Ding Liren",
    black: "Ian Nepomniachtchi",
    year: 2023,
    event: "World Championship, Game 2",
    date: "2023.04.10",
    result: "0-1",
    expectedPlies: 58,
    finalFen: "1k1r4/2q4p/p2b1p1Q/4pp2/P2Rb3/5N1P/2p2PP1/4R2K w - - 0 30",
    pgn: `[Event "World Championship, Game 2"]
[Site "Astana KAZ"]
[Date "2023.04.10"]
[Round "2.1"]
[White "Ding Liren"]
[Black "Ian Nepomniachtchi"]
[Result "0-1"]

1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. h3 dxc4 5. e3 c5 6. Bxc4 a6 7. O-O Nc6 8. Nc3 b5 9. Bd3
Bb7 10. a4 b4 11. Ne4 Na5 12. Nxf6+ gxf6 13. e4 c4 14. Bc2 Qc7 15. Bd2 Rg8 16. Rc1 O-O-O
17. Bd3 Kb8 18. Re1 f5 19. Bc2 Nc6 20. Bg5 Rxg5 21. Nxg5 Nxd4 22. Qh5 f6 23. Nf3 Nxc2
24. Rxc2 Bxe4 25. Rd2 Bd6 26. Kh1 c3 27. bxc3 bxc3 28. Rd4 c2 29. Qh6 e5 0-1`,
    summary: "Nepomniachtchi wins with Black in the second game of the 2023 World Championship match.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2023 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2023.pgn"
      }
    ],
  },
  {
    id: "ding-nepomniachtchi-2023-g4",
    title: "Ding levels the match",
    era: "Champions",
    white: "Ding Liren",
    black: "Ian Nepomniachtchi",
    year: 2023,
    event: "World Championship, game 4",
    date: "2023.04.13",
    result: "1-0",
    expectedPlies: 93,
    finalFen: "4qQ2/p3P3/1p2k1r1/6pp/2P5/6PP/P7/3R2K1 b - - 6 47",
    pgn: `[Event "World Championship, game 4"]
[Site "Astana KAZ"]
[Date "2023.04.13"]
[Round "4"]
[White "Ding Liren"]
[Black "Ian Nepomniachtchi"]
[Result "1-0"]

1.c4 Nf6 2.Nc3 e5 3.Nf3 Nc6 4.e3 Bb4 5.Qc2 Bxc3 6.bxc3 d6 7.e4 O-O 8.Be2 Nh5
9.d4 Nf4 10.Bxf4 exf4 11.O-O Qf6 12.Rfe1 Re8 13.Bd3 Bg4 14.Nd2 Na5 15.c5 dxc5
16.e5 Qh6 17.d5 Rad8 18.c4 b6 19.h3 Bh5 20.Be4 Re7 21.Qc3 Rde8 22.Bf3 Nb7
23.Re2 f6 24.e6 Nd6 25.Rae1 Nf5 26.Bxh5 Qxh5 27.Re4 Qh6 28.Qf3 Nd4 29.Rxd4 cxd4
30.Nb3 g5 31.Nxd4 Qg6 32.g4 fxg3 33.fxg3 h5 34.Nf5 Rh7 35.Qe4 Kh8 36.e7 Qf7
37.d6 cxd6 38.Nxd6 Qg8 39.Nxe8 Qxe8 40.Qe6 Kg7 41.Rf1 Rh6 42.Rd1 f5 43.Qe5+ Kf7
44.Qxf5+ Rf6 45.Qh7+ Ke6 46.Qg7 Rg6 47.Qf8  1-0`,
    summary: "Ding’s first victory in the 2023 title match restores an even score. A rook-for-knight sacrifice and strong central pawns let him seize control against Nepomniachtchi.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2023 game records",
        "url": "https://www.pgnmentor.com/events/WorldChamp2023.pgn"
      },
      {
        "title": "FIDE — Ding strikes back in game 4",
        "url": "https://www.fide.com/fide-world-championship-ding-liren-strikes-back-with-a-victory/"
      }
    ],
  },
  {
    id: "ding-liren-nepomniachtchi-2023-6-1",
    title: "Ding’s London System — Game 6",
    era: "Champions",
    white: "Ding Liren",
    black: "Ian Nepomniachtchi",
    year: 2023,
    event: "World Championship, Game 6",
    date: "2023.04.16",
    result: "1-0",
    expectedPlies: 87,
    finalFen: "6r1/R4Qpk/5pNp/3P3P/8/2P5/p4PPK/1bq5 b - - 5 44",
    pgn: `[Event "World Championship, Game 6"]
[Site "Astana KAZ"]
[Date "2023.04.16"]
[Round "6.1"]
[White "Ding Liren"]
[Black "Ian Nepomniachtchi"]
[Result "1-0"]

1. d4 Nf6 2. Nf3 d5 3. Bf4 c5 4. e3 Nc6 5. Nbd2 cxd4 6. exd4 Bf5 7. c3 e6 8. Bb5 Bd6 9.
Bxd6 Qxd6 10. O-O O-O 11. Re1 h6 12. Ne5 Ne7 13. a4 a6 14. Bf1 Nd7 15. Nxd7 Qxd7 16. a5
Qc7 17. Qf3 Rfc8 18. Ra3 Bg6 19. Nb3 Nc6 20. Qg3 Qe7 21. h4 Re8 22. Nc5 e5 23. Rb3 Nxa5
24. Rxe5 Qf6 25. Ra3 Nc4 26. Bxc4 dxc4 27. h5 Bc2 28. Nxb7 Qb6 29. Nd6 Rxe5 30. Qxe5
Qxb2 31. Ra5 Kh7 32. Rc5 Qc1+ 33. Kh2 f6 34. Qg3 a5 35. Nxc4 a4 36. Ne3 Bb1 37. Rc7 Rg8
38. Nd5 Kh8 39. Ra7 a3 40. Ne7 Rf8 41. d5 a2 42. Qc7 Kh7 43. Ng6 Rg8 44. Qf7 1-0`,
    summary: "Ding Liren wins the sixth game after opening with the London System.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2023 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2023.pgn"
      }
    ],
  },
  {
    id: "ding-liren-nepomniachtchi-2023-12-1",
    title: "Ding fights back — Game 12",
    era: "Champions",
    white: "Ding Liren",
    black: "Ian Nepomniachtchi",
    year: 2023,
    event: "World Championship, Game 12",
    date: "2023.04.26",
    result: "1-0",
    expectedPlies: 75,
    finalFen: "1b3rk1/p6p/3PR1n1/5p1q/P4p2/2Q4P/1P3PB1/6RK b - - 0 38",
    pgn: `[Event "World Championship, Game 12"]
[Site "Astana KAZ"]
[Date "2023.04.26"]
[Round "12.1"]
[White "Ding Liren"]
[Black "Ian Nepomniachtchi"]
[Result "1-0"]

1. d4 Nf6 2. Nf3 d5 3. e3 c5 4. Nbd2 cxd4 5. exd4 Qc7 6. c3 Bd7 7. Bd3 Nc6 8. O-O Bg4 9.
Re1 e6 10. Nf1 Bd6 11. Bg5 O-O 12. Bxf6 gxf6 13. Ng3 f5 14. h3 Bxf3 15. Qxf3 Ne7 16. Nh5
Kh8 17. g4 Rg8 18. Kh1 Ng6 19. Bc2 Nh4 20. Qe3 Rg6 21. Rg1 f4 22. Qd3 Qe7 23. Rae1 Qg5
24. c4 dxc4 25. Qc3 b5 26. a4 b4 27. Qxc4 Rag8 28. Qc6 Bb8 29. Qb7 Rh6 30. Be4 Rf8 31.
Qxb4 Qd8 32. Qc3 Ng6 33. Bg2 Qh4 34. Re2 f5 35. Rxe6 Rxh5 36. gxh5 Qxh5 37. d5+ Kg8 38.
d6 1-0`,
    summary: "Ding Liren wins the twelfth game of the 2023 World Championship match.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2023 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2023.pgn"
      }
    ],
  },
  {
    id: "gukesh-abasov-2024-5-3",
    title: "Gukesh vs Abasov — Candidates",
    era: "Champions",
    white: "Gukesh Dommaraju",
    black: "Nijat Abasov",
    year: 2024,
    event: "Candidates tournament, Round 5",
    date: "2024.04.09",
    result: "1-0",
    expectedPlies: 173,
    finalFen: "8/3q4/5K2/6Q1/4P2k/8/8/8 b - - 14 87",
    pgn: `[Event "Candidates tournament, Round 5"]
[Site "Toronto CAN"]
[Date "2024.04.09"]
[Round "5.3"]
[White "Gukesh Dommaraju"]
[Black "Nijat Abasov"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nf6 3. d4 Nxe4 4. Bd3 d5 5. dxe5 Nc5 6. Be2 Be7 7. O-O O-O 8. Re1 c6 9.
Nbd2 Nbd7 10. h3 a5 11. Nb3 f6 12. exf6 Nxf6 13. Be3 Nce4 14. Nbd2 a4 15. Nxe4 Nxe4 16.
a3 Bc5 17. Bd3 Bxe3 18. Rxe3 Qf6 19. c3 Bf5 20. Qe2 Nd6 21. Bxf5 Nxf5 22. Re6 Qf7 23.
Re1 h6 24. Qc2 Qd7 25. c4 d4 26. c5 Qf7 27. R6e4 Qd5 28. Re5 Qf7 29. R5e4 Qd5 30. Re5
Qf7 31. R1e4 Rad8 32. Rf4 d3 33. Qxa4 Qa2 34. Kh2 g6 35. Qb4 Qf7 36. Re1 Rfe8 37. Rfe4
Rxe4 38. Rxe4 Rd5 39. Nd2 Ng7 40. Kg1 Ne6 41. Re3 Nxc5 42. Qc4 Ne6 43. Rxd3 b5 44. Qc3
Nf4 45. Re3 Rg5 46. Ne4 Rxg2+ 47. Kh1 Nd5 48. Nf6+ Nxf6 49. Kxg2 Nd5 50. Qxc6 Nxe3+ 51.
fxe3 Qf5 52. b3 h5 53. a4 bxa4 54. bxa4 Qg5+ 55. Kf2 Qf5+ 56. Kg2 Qg5+ 57. Kf2 Qf5+ 58.
Ke2 g5 59. e4 Qxh3 60. Qg6+ Kh8 61. Qh6+ Kg8 62. Qxg5+ Kh8 63. Qh6+ Kg8 64. Qg5+ Kh8 65.
a5 h4 66. Qh6+ Kg8 67. Qg6+ Kh8 68. a6 Qh2+ 69. Ke3 Qh3+ 70. Ke2 Qh2+ 71. Kd3 Qh3+ 72.
Kc4 Qc8+ 73. Kd5 Qd8+ 74. Qd6 Qa5+ 75. Ke6 h3 76. Kf7 Qa2+ 77. Qe6 Qxe6+ 78. Kxe6 h2 79.
a7 h1=Q 80. a8=Q+ Kg7 81. Qa7+ Kh6 82. Qe3+ Kh5 83. Kf5 Qf1+ 84. Qf4 Qb5+ 85. Qe5 Qd7+
86. Kf6+ Kh4 87. Qg5+ 1-0`,
    summary: "Gukesh wins with White against Nijat Abasov in the fifth round of the 2024 Candidates tournament.",
    sources: [
      {
        "title": "PGN Mentor — Candidates2024 game scores",
        "url": "https://www.pgnmentor.com/events/Candidates2024.pgn"
      }
    ],
  },
  {
    id: "gukesh-ding-liren-2024-3-1",
    title: "Gukesh’s first match win — Game 3",
    era: "Champions",
    white: "Gukesh Dommaraju",
    black: "Ding Liren",
    year: 2024,
    event: "World Championship, Game 3",
    date: "2024.11.27",
    result: "1-0",
    expectedPlies: 74,
    finalFen: "4k3/1p1r4/p1p3p1/5p1r/3bPB2/1P3K1B/8/3R3R w - - 2 38",
    pgn: `[Event "World Championship, Game 3"]
[Site "Singapore SIN"]
[Date "2024.11.27"]
[Round "3.1"]
[White "Gukesh Dommaraju"]
[Black "Ding Liren"]
[Result "1-0"]

1. d4 Nf6 2. Nf3 d5 3. c4 e6 4. cxd5 exd5 5. Nc3 c6 6. Qc2 g6 7. h3 Bf5 8. Qb3 Qb6 9. g4
Qxb3 10. axb3 Bc2 11. Bf4 h5 12. Rg1 hxg4 13. hxg4 Nbd7 14. Nd2 Rg8 15. g5 Nh5 16. Bh2
Rh8 17. f3 Ng7 18. Bg3 Rh5 19. e4 dxe4 20. fxe4 Ne6 21. Rc1 Nxd4 22. Bf2 Bg7 23. Ne2
Nxb3 24. Rxc2 Nxd2 25. Kxd2 Ne5 26. Nd4 Rd8 27. Ke2 Rh2 28. Bg2 a6 29. b3 Rd7 30. Rcc1
Ke7 31. Rcd1 Ke8 32. Bg3 Rh5 33. Nf3 Nxf3 34. Kxf3 Bd4 35. Rh1 Rxg5 36. Bh3 f5 37. Bf4
Rh5 1-0`,
    summary: "Gukesh wins the third game of the 2024 World Championship match against Ding Liren.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2024 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2024.pgn"
      }
    ],
  },
  {
    id: "gukesh-ding-liren-2024-11-1",
    title: "Gukesh takes the lead — Game 11",
    era: "Champions",
    white: "Gukesh Dommaraju",
    black: "Ding Liren",
    year: 2024,
    event: "World Championship, Game 11",
    date: "2024.12.08",
    result: "1-0",
    expectedPlies: 57,
    finalFen: "1rq3k1/1p2rp2/2Q1p1pb/pRN4p/P1Pp4/3P2PP/5PB1/1R4K1 b - - 0 29",
    pgn: `[Event "World Championship, Game 11"]
[Site "Singapore SIN"]
[Date "2024.12.08"]
[Round "11.1"]
[White "Gukesh Dommaraju"]
[Black "Ding Liren"]
[Result "1-0"]

1. Nf3 d5 2. c4 d4 3. b4 c5 4. e3 Nf6 5. a3 Bg4 6. exd4 cxd4 7. h3 Bxf3 8. Qxf3 Qc7 9.
d3 a5 10. b5 Nbd7 11. g3 Nc5 12. Bg2 Nfd7 13. O-O Ne5 14. Qf4 Rd8 15. Rd1 g6 16. a4 h5
17. b6 Qd6 18. Ba3 Bh6 19. Bxc5 Qxc5 20. Qe4 Nc6 21. Na3 Rd7 22. Nc2 Qxb6 23. Rab1 Qc7
24. Rb5 O-O 25. Na1 Rb8 26. Nb3 e6 27. Nc5 Re7 28. Rdb1 Qc8 29. Qxc6 1-0`,
    summary: "Gukesh wins the eleventh game of the 2024 World Championship match.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2024 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2024.pgn"
      }
    ],
  },
  {
    id: "ding-liren-gukesh-2024-12-1",
    title: "Ding’s response — Game 12",
    era: "Champions",
    white: "Ding Liren",
    black: "Gukesh Dommaraju",
    year: 2024,
    event: "World Championship, Game 12",
    date: "2024.12.09",
    result: "1-0",
    expectedPlies: 77,
    finalFen: "5rk1/1p1P2R1/n2B1pbp/1q1P4/p7/P3Q1PP/1Pr2PBK/3R4 b - - 0 39",
    pgn: `[Event "World Championship, Game 12"]
[Site "Singapore SIN"]
[Date "2024.12.09"]
[Round "12.1"]
[White "Ding Liren"]
[Black "Gukesh Dommaraju"]
[Result "1-0"]

1. c4 e6 2. g3 d5 3. Bg2 Nf6 4. Nf3 d4 5. O-O Nc6 6. e3 Be7 7. d3 dxe3 8. Bxe3 e5 9. Nc3
O-O 10. Re1 h6 11. a3 a5 12. h3 Be6 13. Kh2 Rb8 14. Qc2 Re8 15. Nb5 Bf5 16. Rad1 Nd7 17.
Qd2 Bg6 18. d4 e4 19. Ng1 Nb6 20. Qc3 Bf6 21. Qc2 a4 22. Ne2 Bg5 23. Nf4 Bxf4 24. Bxf4
Rc8 25. Qc3 Nb8 26. d5 Qd7 27. d6 c5 28. Nc7 Rf8 29. Bxe4 Nc6 30. Bg2 Rcd8 31. Nd5 Nxd5
32. cxd5 Nb8 33. Qxc5 Rc8 34. Qd4 Na6 35. Re7 Qb5 36. d7 Rc4 37. Qe3 Rc2 38. Bd6 f6 39.
Rxg7+ 1-0`,
    summary: "Ding Liren wins the twelfth game, immediately after losing game eleven.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2024 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2024.pgn"
      }
    ],
  },
  {
    id: "ding-liren-gukesh-2024-14-1",
    title: "Gukesh becomes world champion",
    era: "Champions",
    white: "Ding Liren",
    black: "Gukesh Dommaraju",
    year: 2024,
    event: "World Championship, Game 14",
    date: "2024.12.12",
    result: "0-1",
    expectedPlies: 116,
    finalFen: "8/8/8/4kp2/6p1/4K1P1/8/8 w - - 2 59",
    pgn: `[Event "World Championship, Game 14"]
[Site "Singapore SIN"]
[Date "2024.12.12"]
[Round "14.1"]
[White "Ding Liren"]
[Black "Gukesh Dommaraju"]
[Result "0-1"]

1. Nf3 d5 2. g3 c5 3. Bg2 Nc6 4. d4 e6 5. O-O cxd4 6. Nxd4 Nge7 7. c4 Nxd4 8. Qxd4 Nc6
9. Qd1 d4 10. e3 Bc5 11. exd4 Bxd4 12. Nc3 O-O 13. Nb5 Bb6 14. b3 a6 15. Nc3 Bd4 16. Bb2
e5 17. Qd2 Be6 18. Nd5 b5 19. cxb5 axb5 20. Nf4 exf4 21. Bxc6 Bxb2 22. Qxb2 Rb8 23. Rfd1
Qb6 24. Bf3 fxg3 25. hxg3 b4 26. a4 bxa3 27. Rxa3 g6 28. Qd4 Qb5 29. b4 Qxb4 30. Qxb4
Rxb4 31. Ra8 Rxa8 32. Bxa8 g5 33. Bd5 Bf5 34. Rc1 Kg7 35. Rc7 Bg6 36. Rc4 Rb1+ 37. Kg2
Re1 38. Rb4 h5 39. Ra4 Re5 40. Bf3 Kh6 41. Kg1 Re6 42. Rc4 g4 43. Bd5 Rd6 44. Bb7 Kg5
45. f3 f5 46. fxg4 hxg4 47. Rb4 Bf7 48. Kf2 Rd2+ 49. Kg1 Kf6 50. Rb6+ Kg5 51. Rb4 Be6
52. Ra4 Rb2 53. Ba8 Kf6 54. Rf4 Ke5 55. Rf2 Rxf2 56. Kxf2 Bd5 57. Bxd5 Kxd5 58. Ke3 Ke5
0-1`,
    summary: "The fourteenth and final game of the 2024 World Championship ends with a victory for Gukesh.",
    sources: [
      {
        "title": "PGN Mentor — WorldChamp2024 game scores",
        "url": "https://www.pgnmentor.com/events/WorldChamp2024.pgn"
      },
      {
        "title": "FIDE — World Championship Game 14",
        "url": "https://www.fide.com/fide-world-championship-game-14-gukesh-d-claims-title/"
      }
    ],
  },
  {
    id: "gukesh-keymer-2025-5-6",
    title: "Gukesh vs Keymer — Tata Steel",
    era: "Champions",
    white: "Gukesh Dommaraju",
    black: "Vincent Keymer",
    year: 2025,
    event: "Tata Steel Masters, Round 5",
    date: "2025.01.22",
    result: "1-0",
    expectedPlies: 143,
    finalFen: "8/4B3/1R2K1p1/7p/7P/5k2/3r4/8 b - - 2 72",
    pgn: `[Event "Tata Steel Masters, Round 5"]
[Site "Wijk aan Zee NED"]
[Date "2025.01.22"]
[Round "5.6"]
[White "Gukesh Dommaraju"]
[Black "Vincent Keymer"]
[Result "1-0"]

1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd2 d5 6. Nf3 Nbd7 7. Qc2 c6 8. Be2 b6 9. O-O
a5 10. a3 Bxc3 11. Bxc3 Ne4 12. Be1 Ba6 13. Bd3 h6 14. Bxe4 dxe4 15. Nd2 f5 16. f3 exf3
17. Nxf3 c5 18. Rd1 cxd4 19. Rxd4 Qe8 20. Bg3 e5 21. Rd6 Rc8 22. Rfd1 f4 23. exf4 exf4
24. Bf2 Rf7 25. R1d4 Bb7 26. Qd1 Bc6 27. b4 axb4 28. axb4 Qe7 29. Qd3 Nf6 30. Rxf4 Be4
31. Qd4 Bxf3 32. Rxf3 Qe2 33. Rd8+ Rxd8 34. Qxd8+ Rf8 35. Qd3 Qxd3 36. Rxd3 Rc8 37. Rd4
Kf7 38. Kf1 Ra8 39. Ke2 Ra4 40. Be1 Ke6 41. Bd2 h5 42. Kd3 Ng4 43. Kc3 Nf6 44. Kb3 Ra1
45. Bc3 Rb1+ 46. Kc2 Rf1 47. Rd2 Ne8 48. Kb3 g6 49. Bd4 Rb1+ 50. Ka4 Rc1 51. Bxb6 Rxc4
52. Kb5 Rc1 53. Bc5 Nf6 54. Rd6+ Kf5 55. Kc6 Ng4 56. Rd2 Ke6 57. Rd6+ Kf5 58. b5 Ne5+
59. Kd5 Nd3 60. Rc6 Nf4+ 61. Kd6 Rd1+ 62. Kc7 Nd5+ 63. Kc8 Rc1 64. Kd7 Rc2 65. Bd6 Rxg2
66. Rc5 Ke4 67. Ke6 Rd2 68. h4 Nb6 69. Rc6 Nd5 70. b6 Nxb6 71. Rxb6 Kf3 72. Be7 1-0`,
    summary: "Gukesh wins with White against Vincent Keymer at the 2025 Tata Steel Masters.",
    sources: [
      {
        "title": "PGN Mentor — Gukesh game scores",
        "url": "https://www.pgnmentor.com/players/Gukesh.zip"
      }
    ],
  },
  {
    id: "caruana-praggnanandhaa-2025-11-5",
    title: "Praggnanandhaa vs Caruana — Tata Steel",
    era: "Champions",
    white: "Fabiano Caruana",
    black: "Rameshbabu Praggnanandhaa",
    year: 2025,
    event: "Tata Steel Masters, Round 11",
    date: "2025.01.31",
    result: "0-1",
    expectedPlies: 74,
    finalFen: "2r4k/4qppp/B7/2n5/b3P3/p3Q2P/K1R3P1/8 w - - 0 38",
    pgn: `[Event "Tata Steel Masters, Round 11"]
[Site "Wijk aan Zee NED"]
[Date "2025.01.31"]
[Round "11.5"]
[White "Fabiano Caruana"]
[Black "Rameshbabu Praggnanandhaa"]
[Result "0-1"]

1. c4 e6 2. Nc3 d5 3. d4 Nf6 4. cxd5 exd5 5. Bg5 c6 6. e3 Bd6 7. Bd3 O-O 8. Nge2 Re8 9.
h3 Nbd7 10. Qc2 Nf8 11. O-O-O b5 12. Kb1 a5 13. f3 Be7 14. Bxf6 Bxf6 15. e4 a4 16. a3 b4
17. axb4 a3 18. b3 Qb6 19. Ka2 dxe4 20. fxe4 Bxd4 21. Nxd4 Qxd4 22. b5 Bd7 23. Bc4 Qa7
24. bxc6 Bxc6 25. Rhf1 Re7 26. Nd5 Rb7 27. Rf5 Rc8 28. Qd3 Ne6 29. Rdf1 Be8 30. R5f2 Qb8
31. Rc2 Nc5 32. Qe3 Nxb3 33. Rb1 Ba4 34. Bd3 Nc5 35. Ne7+ Kh8 36. Rxb7 Qxb7 37. Ba6 Qxe7
0-1`,
    summary: "Praggnanandhaa wins with Black against Caruana in round eleven of the 2025 Tata Steel Masters.",
    sources: [
      {
        "title": "PGN Mentor — Praggnanandhaa game scores",
        "url": "https://www.pgnmentor.com/players/Praggnanandhaa.zip"
      }
    ],
  },
  {
    id: "praggnanandhaa-gukesh-2025-3",
    title: "Praggnanandhaa wins the Tata Steel tiebreak",
    era: "Champions",
    white: "Rameshbabu Praggnanandhaa",
    black: "Gukesh Dommaraju",
    year: 2025,
    event: "Tata Steel Masters, Blitz tiebreak Game 3",
    date: "2025.02.02",
    result: "1-0",
    expectedPlies: 123,
    finalFen: "8/8/5NK1/6p1/5k1p/7P/6P1/8 b - - 2 62",
    pgn: `[Event "Tata Steel Masters, Blitz tiebreak Game 3"]
[Site "Wijk aan Zee NED"]
[Date "2025.02.02"]
[Round "3"]
[White "Rameshbabu Praggnanandhaa"]
[Black "Gukesh Dommaraju"]
[Result "1-0"]

1. d4 d5 2. Nf3 Nf6 3. Bf4 e6 4. e3 c5 5. Be2 Bd6 6. dxc5 Bxc5 7. O-O O-O 8. c4 dxc4 9.
Bxc4 a6 10. Qxd8 Rxd8 11. Nbd2 Bd7 12. Rac1 Be7 13. Be2 Nd5 14. Bg3 Bb5 15. Bxb5 axb5
16. a3 Nc6 17. Rfd1 Rac8 18. Kf1 Nb6 19. Ne4 Nc4 20. Rxd8+ Rxd8 21. Rc2 Rd1+ 22. Ke2 Rb1
23. Nc3 Rxb2 24. Rxb2 Nxb2 25. Nxb5 Nc4 26. Kd3 Nxa3 27. Nxa3 Bxa3 28. Kc4 Na7 29. Bb8
Nc8 30. Kb5 f6 31. Nd2 Kf7 32. Nc4 Bf8 33. Na5 Bd6 34. Bxd6 Nxd6+ 35. Kb6 Ne4 36. f3 Nc3
37. Kxb7 e5 38. Kc6 Nd1 39. Nc4 Ke6 40. e4 g6 41. Kc5 f5 42. Kb4 fxe4 43. fxe4 Nf2 44.
Nd2 Kd6 45. Nc4+ Ke6 46. Nd2 Kf6 47. Kc4 Ng4 48. Nf1 Nf2 49. Kd5 Nd3 50. Ne3 Nf4+ 51.
Kd6 Nd3 52. Ng4+ Kg5 53. Nxe5 Kf4 54. Nxd3+ Kxe4 55. Nf2+ Ke3 56. Ng4+ Kf4 57. Nf6 h5
58. Ke6 h4 59. Kf7 Kf5 60. Kg7 g5 61. h3 Kf4 62. Kg6 1-0`,
    summary: "Praggnanandhaa wins the deciding blitz tiebreak against Gukesh at the 2025 Tata Steel Masters.",
    sources: [
      {
        "title": "PGN Mentor — Praggnanandhaa game scores",
        "url": "https://www.pgnmentor.com/players/Praggnanandhaa.zip"
      },
      {
        "title": "TWIC — Tata Steel 2025",
        "url": "https://theweekinchess.com/chessnews/events/87th-tata-steel-2025"
      }
    ],
  },
  {
    id: "abdusattorov-gukesh-2026-6-5",
    title: "Abdusattorov vs Gukesh — Tata Steel",
    era: "Champions",
    white: "Nodirbek Abdusattorov",
    black: "Gukesh Dommaraju",
    year: 2026,
    event: "Tata Steel Masters, Round 6",
    date: "2026.01.23",
    result: "1-0",
    expectedPlies: 73,
    finalFen: "3r4/2p3kp/1p3Q2/p1p1P1r1/P1Pq4/3P1Pp1/2P3K1/4RR2 b - - 0 37",
    pgn: `[Event "Tata Steel Masters, Round 6"]
[Site "Wijk aan Zee NED"]
[Date "2026.01.23"]
[Round "6.5"]
[White "Nodirbek Abdusattorov"]
[Black "Gukesh Dommaraju"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Bxc6 dxc6 7. d3 Nd7 8. Nc3 O-O 9.
Be3 Re8 10. a4 a5 11. Kh1 Bd6 12. Ne2 Nf8 13. Ng3 c5 14. Nd2 Ne6 15. Nf5 Bf8 16. Nc4 f6
17. Qg4 Kh8 18. Qg3 b6 19. h4 g6 20. Nh6 Qd7 21. Ng4 Bg7 22. f3 Ba6 23. b3 Rad8 24. h5
gxh5 25. Nh6 Bxc4 26. bxc4 Bxh6 27. Bxh6 Rg8 28. Qh2 Rg6 29. Qxh5 Nf4 30. Bxf4 exf4 31.
g4 fxg3 32. Kg2 Qd4 33. Rae1 Kg7 34. e5 Rh6 35. Qg4+ Rg6 36. Qf5 Rg5 37. Qxf6+ 1-0`,
    summary: "Abdusattorov wins against Gukesh in round six of the 2026 Tata Steel Masters.",
    sources: [
      {
        "title": "PGN Mentor — Abdusattorov game scores",
        "url": "https://www.pgnmentor.com/players/Abdusattorov.zip"
      }
    ],
  },
  {
    id: "erigaisi-erdogmus-2026-7-7",
    title: "Erdoğmuş vs Erigaisi — Tata Steel",
    era: "Champions",
    white: "Arjun Erigaisi",
    black: "Yağız Kaan Erdoğmuş",
    year: 2026,
    event: "Tata Steel Masters, Round 7",
    date: "2026.01.24",
    result: "0-1",
    expectedPlies: 103,
    finalFen: "6k1/7p/4R3/2p2PP1/8/p1PK3p/1p4b1/8 b - - 1 52",
    pgn: `[Event "Tata Steel Masters, Round 7"]
[Site "Wijk aan Zee NED"]
[Date "2026.01.24"]
[Round "7.7"]
[White "Arjun Erigaisi"]
[Black "Yağız Kaan Erdoğmuş"]
[Result "0-1"]

1. c4 e5 2. g3 Nf6 3. Bg2 c6 4. Nf3 e4 5. Nd4 d5 6. d3 Qb6 7. Nb3 Ng4 8. O-O e3 9. f3
Nf2 10. Qc2 Nh3+ 11. Bxh3 Bxh3 12. Rd1 d4 13. c5 Qd8 14. Qc4 Na6 15. Qxd4 Qxd4 16. Nxd4
Bxc5 17. Bxe3 O-O-O 18. Nc2 Rhe8 19. Kf2 Nb4 20. Nba3 Rxe3 21. Nxe3 Be6 22. d4 Rxd4 23.
Ke1 Rxd1+ 24. Nxd1 Nxa2 25. Kd2 b5 26. Nc2 a5 27. Nc3 Nxc3 28. bxc3 a4 29. e4 Kc7 30. f4
g6 31. Nd4 Bc4 32. e5 Be7 33. g4 c5 34. Nc2 Kc6 35. Ne3 Bb3 36. f5 Bg5 37. Kd3 Bf4 38.
Ke4 g5 39. h4 Bxe3 40. Kxe3 gxh4 41. Kd2 Bd5 42. Re1 Kd7 43. Re3 a3 44. Kc1 Bg2 45. e6+
Ke8 46. exf7+ Kxf7 47. Re6 b4 48. g5 b3 49. Rf6+ Kg8 50. Re6 b2+ 51. Kc2 h3 52. Kd3 0-1`,
    summary: "Yağız Kaan Erdoğmuş wins against Arjun Erigaisi in the 2026 Tata Steel Masters.",
    sources: [
      {
        "title": "PGN Mentor — Erigaisi game scores",
        "url": "https://www.pgnmentor.com/players/Erigaisi.zip"
      }
    ],
  },
  {
    id: "keymer-abdusattorov-2026-7-3",
    title: "Abdusattorov vs Keymer — Tata Steel",
    era: "Champions",
    white: "Vincent Keymer",
    black: "Nodirbek Abdusattorov",
    year: 2026,
    event: "Tata Steel Masters, Round 7",
    date: "2026.01.24",
    result: "0-1",
    expectedPlies: 82,
    finalFen: "8/pp5p/8/P2k1p2/3P1P2/1P1K2P1/5B2/7r w - - 3 42",
    pgn: `[Event "Tata Steel Masters, Round 7"]
[Site "Wijk aan Zee NED"]
[Date "2026.01.24"]
[Round "7.3"]
[White "Vincent Keymer"]
[Black "Nodirbek Abdusattorov"]
[Result "0-1"]

1. c4 c6 2. Nf3 d5 3. e3 Nf6 4. Nc3 e6 5. d4 Nbd7 6. Qc2 Bd6 7. g4 Nxg4 8. Rg1 Qf6 9.
Rxg4 Qxf3 10. Rxg7 Nf6 11. Rg5 Qh1 12. f4 Bd7 13. Qf2 Ne4 14. Nxe4 Qxe4 15. Bd2 Be7 16.
Rh5 Qg6 17. Qf3 Qc2 18. Qd1 Qg6 19. Ba5 e5 20. Bd3 Qg1+ 21. Kd2 Qxd1+ 22. Rxd1 Bg4 23.
Rxe5 f6 24. Rxe7+ Kxe7 25. Rg1 Rag8 26. cxd5 cxd5 27. e4 Bd7 28. Bb4+ Kf7 29. Rg3 Rxg3
30. hxg3 dxe4 31. Bxe4 f5 32. Bd5+ Be6 33. Bf3 Rd8 34. Kc3 Bd5 35. Bxd5+ Rxd5 36. a4 Ke6
37. Kd3 Rd8 38. b3 Kd5 39. Be1 Rd6 40. a5 Rh6 41. Bf2 Rh1 0-1`,
    summary: "Abdusattorov wins with Black against Keymer in round seven of the 2026 Tata Steel Masters.",
    sources: [
      {
        "title": "PGN Mentor — Abdusattorov game scores",
        "url": "https://www.pgnmentor.com/players/Abdusattorov.zip"
      }
    ],
  },
  {
    id: "erigaisi-abdusattorov-2026-13-4",
    title: "Abdusattorov’s final-round win",
    era: "Champions",
    white: "Arjun Erigaisi",
    black: "Nodirbek Abdusattorov",
    year: 2026,
    event: "Tata Steel Masters, Round 13",
    date: "2026.02.01",
    result: "0-1",
    expectedPlies: 110,
    finalFen: "3B4/7p/k7/2p5/1p6/1K1b2P1/8/8 w - - 6 56",
    pgn: `[Event "Tata Steel Masters, Round 13"]
[Site "Wijk aan Zee NED"]
[Date "2026.02.01"]
[Round "13.4"]
[White "Arjun Erigaisi"]
[Black "Nodirbek Abdusattorov"]
[Result "0-1"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 d6 7. Qb3 Qd7 8. O-O Bb6 9.
Nbd2 Na5 10. Qc2 Nxc4 11. Nxc4 Qc6 12. Nxb6 axb6 13. dxe5 dxe5 14. Nxe5 Qe6 15. f4 Nf6
16. c4 O-O 17. Bb2 Qe7 18. a4 Nd7 19. Nf3 f6 20. Rfe1 Nc5 21. e5 f5 22. Nd4 Ne6 23. Nxf5
Qf7 24. Ne3 Nxf4 25. Nd5 Be6 26. Nxf4 Qxf4 27. Rad1 Rad8 28. Rxd8 Rxd8 29. Bc1 Qh4 30.
Re4 Qe7 31. Re3 Qc5 32. h3 Rd4 33. Ba3 Rd1+ 34. Kf2 Rf1+ 35. Kxf1 Qxe3 36. Bb2 Qc5 37.
Ke2 Bxc4+ 38. Kd2 Qf2+ 39. Kc3 Qxc2+ 40. Kxc2 Kf7 41. e6+ Kxe6 42. Bxg7 Bf1 43. g3 Bxh3
44. Kc3 Kd5 45. Kb4 Bf1 46. Bf6 c5+ 47. Kb3 b5 48. axb5 Bxb5 49. Be7 Kc6 50. Bf6 Be2 51.
Be7 b5 52. Bf6 b4 53. Ka4 Kb6 54. Bd8+ Ka6 55. Kb3 Bd3 0-1`,
    summary: "Abdusattorov defeats Erigaisi with Black in the last round of the 2026 Tata Steel Masters.",
    sources: [
      {
        "title": "PGN Mentor — Abdusattorov game scores",
        "url": "https://www.pgnmentor.com/players/Abdusattorov.zip"
      },
      {
        "title": "TWIC — Tata Steel 2026",
        "url": "https://theweekinchess.com/chessnews/events/88th-tata-steel-2026"
      }
    ],
  },
  {
    "id": "garry-kasparov-deep-junior-2003-fide-man-machine-wc-1",
    "title": "Kasparov–Deep Junior — game 1 (2003)",
    "era": "Human vs computer",
    "white": "Garry Kasparov",
    "black": "Deep Junior",
    "year": 2003,
    "event": "Kasparov–Deep Junior match",
    "date": "2003.01.26",
    "result": "1-0",
    "expectedPlies": 53,
    "finalFen": "r5k1/p1R2ppp/6n1/1b2p1Pn/4P3/4B3/P2N1P1P/K3R3 b - - 1 27",
    "pgn": "[Event \"Kasparov–Deep Junior match\"]\n[Site \"New York USA\"]\n[Date \"2003.01.26\"]\n[Round \"1\"]\n[White \"Garry Kasparov\"]\n[Black \"Deep Junior\"]\n[Result \"1-0\"]\n\n1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. e3 e6 5. Nf3 Nbd7 6. Qc2 Bd6 7. g4 dxc4\n8. Bxc4 b6 9. e4 e5 10. g5 Nh5 11. Be3 O-O 12. O-O-O Qc7 13. d5 b5 14. dxc6 bxc4\n15. Nb5 Qxc6 16. Nxd6 Bb7 17. Qc3 Rae8 18. Nxe8 Rxe8 19. Rhe1 Qb5 20. Nd2 Rc8\n21. Kb1 Nf8 22. Ka1 Ng6 23. Rc1 Ba6 24. b3 cxb3 25. Qxb3 Ra8 26. Qxb5 Bxb5\n27. Rc7 1-0",
    "summary": "Game 1 of the Kasparov–Deep Junior match in 2003. Garry Kasparov wins.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kasparov.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kasparov.zip"
      }
    ]
  },
  {
    "id": "deep-junior-garry-kasparov-2003-fide-man-machine-wc-2",
    "title": "Kasparov–Deep Junior — game 2 (2003)",
    "era": "Human vs computer",
    "white": "Deep Junior",
    "black": "Garry Kasparov",
    "year": 2003,
    "event": "Kasparov–Deep Junior match",
    "date": "2003.01.28",
    "result": "1/2-1/2",
    "expectedPlies": 60,
    "finalFen": "2R5/1p3k1p/3p2p1/2nP4/2P5/4p3/P1R3PP/q4NK1 w - - 1 31",
    "pgn": "[Event \"Kasparov–Deep Junior match\"]\n[Site \"New York USA\"]\n[Date \"2003.01.28\"]\n[Round \"2\"]\n[White \"Deep Junior\"]\n[Black \"Garry Kasparov\"]\n[Result \"1/2-1/2\"]\n\n1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Bd3 Bc5 6. Nb3 Ba7 7. c4 Nc6\n8. Nc3 d6 9. O-O Nge7 10. Re1 O-O 11. Be3 e5 12. Nd5 a5 13. Rc1 a4 14. Bxa7 Rxa7\n15. Nd2 Nd4 16. Qh5 Ne6 17. Rc3 Nc5 18. Bc2 Nxd5 19. exd5 g6 20. Qh6 f5\n21. Ra3 Qf6 22. b4 axb3 23. Rxa7 bxc2 24. Rc1 e4 25. Rxc2 Qa1+ 26. Nf1 f4\n27. Ra8 e3 28. fxe3 fxe3 29. Qxf8+ Kxf8 30. Rxc8+ Kf7 1/2-1/2",
    "summary": "Game 2 of the Kasparov–Deep Junior match in 2003. The game ends in a draw.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kasparov.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kasparov.zip"
      }
    ]
  },
  {
    "id": "garry-kasparov-deep-junior-2003-fide-man-machine-wc-3",
    "title": "Kasparov–Deep Junior — game 3 (2003)",
    "era": "Human vs computer",
    "white": "Garry Kasparov",
    "black": "Deep Junior",
    "year": 2003,
    "event": "Kasparov–Deep Junior match",
    "date": "2003.01.30",
    "result": "0-1",
    "expectedPlies": 72,
    "finalFen": "5k2/p5qp/1pp2p2/3r3R/3Q4/8/PP3P2/2K5 w - - 0 37",
    "pgn": "[Event \"Kasparov–Deep Junior match\"]\n[Site \"New York USA\"]\n[Date \"2003.01.30\"]\n[Round \"3\"]\n[White \"Garry Kasparov\"]\n[Black \"Deep Junior\"]\n[Result \"0-1\"]\n\n1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. e3 e6 5. Nf3 Nbd7 6. Qc2 b6 7. cxd5 exd5\n8. Bd3 Be7 9. Bd2 O-O 10. g4 Nxg4 11. Rg1 Ndf6 12. h3 Nh6 13. e4 dxe4\n14. Bxh6 exd3 15. Rxg7+ Kh8 16. Qxd3 Rg8 17. Rxg8+ Nxg8 18. Bf4 f6 19. O-O-O Bd6\n20. Qe3 Bxf4 21. Qxf4 Bxh3 22. Rg1 Qb8 23. Qe3 Qd6 24. Nh4 Be6 25. Rh1 Rd8\n26. Ng6+ Kg7 27. Nf4 Bf5 28. Nce2 Ne7 29. Ng3 Kh8 30. Nxf5 Nxf5 31. Qe4 Qd7\n32. Rh5 Nxd4 33. Ng6+ Kg8 34. Ne7+ Kf8 35. Nd5 Qg7 36. Qxd4 Rxd5 0-1",
    "summary": "Game 3 of the Kasparov–Deep Junior match in 2003. Deep Junior wins.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kasparov.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kasparov.zip"
      }
    ]
  },
  {
    "id": "deep-junior-garry-kasparov-2003-fide-man-machine-wc-4",
    "title": "Kasparov–Deep Junior — game 4 (2003)",
    "era": "Human vs computer",
    "white": "Deep Junior",
    "black": "Garry Kasparov",
    "year": 2003,
    "event": "Kasparov–Deep Junior match",
    "date": "2003.02.02",
    "result": "1/2-1/2",
    "expectedPlies": 121,
    "finalFen": "8/1r4k1/1Pr3p1/1R3pP1/5P1K/8/8/1R6 b - - 1 61",
    "pgn": "[Event \"Kasparov–Deep Junior match\"]\n[Site \"New York USA\"]\n[Date \"2003.02.02\"]\n[Round \"4\"]\n[White \"Deep Junior\"]\n[Black \"Garry Kasparov\"]\n[Result \"1/2-1/2\"]\n\n1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 e6 5. Nb5 d6 6. c4 Nf6 7. N1c3 a6\n8. Na3 Nd7 9. Nc2 Be7 10. Be2 b6 11. O-O Bb7 12. h3 O-O 13. Be3 Rc8 14. Qd2 Nce5\n15. b3 Nf6 16. f3 Qc7 17. Rac1 Rfe8 18. a3 Ned7 19. Rfd1 Qb8 20. Bf2 Rcd8\n21. b4 Ba8 22. a4 Rc8 23. Rb1 Qc7 24. a5 bxa5 25. b5 Bb7 26. b6 Qb8 27. Ne3 Nc5\n28. Qa2 Nfd7 29. Na4 Ne5 30. Nc2 Ncd7 31. Nd4 Red8 32. Kh1 Nc6 33. Nxc6 Rxc6\n34. Kg1 h6 35. Qa3 Rdc8 36. Bg3 Bf8 37. Qc3 Ne5 38. c5 Nd7 39. Qxa5 Nxc5\n40. Nxc5 Rxc5 41. Qa4 R5c6 42. Bf2 d5 43. Bxa6 Bc5 44. Bxc5 Rxc5 45. Bxb7 Qxb7\n46. exd5 exd5 47. Qa7 R5c7 48. Qxb7 Rxb7 49. Rxd5 Rc6 50. Rdb5 h5 51. Kf2 Re6\n52. f4 g6 53. Kg3 Kg7 54. Kh4 Kh6 55. R1b4 Rd6 56. g3 f6 57. g4 hxg4 58. hxg4 Kg7\n59. Rb3 Rc6 60. g5 f5 61. Rb1 1/2-1/2",
    "summary": "Game 4 of the Kasparov–Deep Junior match in 2003. The game ends in a draw.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kasparov.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kasparov.zip"
      }
    ]
  },
  {
    "id": "garry-kasparov-deep-junior-2003-fide-man-machine-wc-5",
    "title": "Kasparov–Deep Junior — game 5 (2003)",
    "era": "Human vs computer",
    "white": "Garry Kasparov",
    "black": "Deep Junior",
    "year": 2003,
    "event": "Kasparov–Deep Junior match",
    "date": "2003.02.05",
    "result": "1/2-1/2",
    "expectedPlies": 38,
    "finalFen": "rnb1r2k/pp3ppB/2p5/3p4/3P1P1q/P1N1PKN1/1PQB2Pn/R4R2 w - - 7 20",
    "pgn": "[Event \"Kasparov–Deep Junior match\"]\n[Site \"New York USA\"]\n[Date \"2003.02.05\"]\n[Round \"5\"]\n[White \"Garry Kasparov\"]\n[Black \"Deep Junior\"]\n[Result \"1/2-1/2\"]\n\n1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5 6. cxd5 exd5 7. Ne2 Re8\n8. O-O Bd6 9. a3 c6 10. Qc2 Bxh2+ 11. Kxh2 Ng4+ 12. Kg3 Qg5 13. f4 Qh5\n14. Bd2 Qh2+ 15. Kf3 Qh4 16. Bxh7+ Kh8 17. Ng3 Nh2+ 18. Kf2 Ng4+ 19. Kf3 Nh2+\n1/2-1/2",
    "summary": "Game 5 of the Kasparov–Deep Junior match in 2003. The game ends in a draw.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kasparov.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kasparov.zip"
      }
    ]
  },
  {
    "id": "deep-junior-garry-kasparov-2003-fide-man-machine-wc-6",
    "title": "Kasparov–Deep Junior — game 6 (2003)",
    "era": "Human vs computer",
    "white": "Deep Junior",
    "black": "Garry Kasparov",
    "year": 2003,
    "event": "Kasparov–Deep Junior match",
    "date": "2003.02.07",
    "result": "1/2-1/2",
    "expectedPlies": 55,
    "finalFen": "4n1k1/3nbpp1/pp1p3p/4p3/P4P2/BNr3PP/2P1R1K1/3R4 b - - 0 28",
    "pgn": "[Event \"Kasparov–Deep Junior match\"]\n[Site \"New York USA\"]\n[Date \"2003.02.07\"]\n[Round \"6\"]\n[White \"Deep Junior\"]\n[Black \"Garry Kasparov\"]\n[Result \"1/2-1/2\"]\n\n1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2 e5 7. Nb3 Be7\n8. O-O O-O 9. Kh1 Bd7 10. Be3 Bc6 11. Bf3 Nbd7 12. a4 b6 13. Qd3 Bb7 14. h3 Rc8\n15. Rad1 h6 16. Rfe1 Qc7 17. g3 Rfd8 18. Kh2 Re8 19. Re2 Qc4 20. Qxc4 Rxc4\n21. Nd2 Rc7 22. Bg2 Rec8 23. Nb3 Rxc3 24. bxc3 Bxe4 25. Bc1 Bxg2 26. Kxg2 Rxc3\n27. Ba3 Ne8 28. f4 1/2-1/2",
    "summary": "The sixth game is drawn, completing Kasparov’s 2003 New York match against Deep Junior with a 3–3 score.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kasparov.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kasparov.zip"
      }
    ]
  },
  {
    "id": "garry-kasparov-x3d-fritz-2003-x3d-match-1",
    "title": "Kasparov–X3D Fritz — game 1 (2003)",
    "era": "Human vs computer",
    "white": "Garry Kasparov",
    "black": "X3D Fritz",
    "year": 2003,
    "event": "Kasparov–X3D Fritz match",
    "date": "2003.11.11",
    "result": "1/2-1/2",
    "expectedPlies": 73,
    "finalFen": "1r4k1/p4ppp/2p5/2Q3P1/3R3P/8/bP6/2KR2q1 b - - 7 37",
    "pgn": "[Event \"Kasparov–X3D Fritz match\"]\n[Site \"New York USA\"]\n[Date \"2003.11.11\"]\n[Round \"1\"]\n[White \"Garry Kasparov\"]\n[Black \"X3D Fritz\"]\n[Result \"1/2-1/2\"]\n\n1. Nf3 d5 2. c4 c6 3. d4 Nf6 4. Nc3 e6 5. e3 Nbd7 6. Qc2 Bd6 7. g4 Bb4 8. Bd2 Qe7\n9. Rg1 Bxc3 10. Bxc3 Ne4 11. O-O-O Qf6 12. Be2 Nxf2 13. Rdf1 Ne4 14. Bb4 c5\n15. cxd5 exd5 16. dxc5 Qe7 17. Nd4 O-O 18. Nf5 Qe5 19. c6 bxc6 20. Bxf8 Kxf8\n21. Ng3 Ndc5 22. Nxe4 Nxe4 23. Bd3 Be6 24. Bxe4 dxe4 25. Rf4 Bd5 26. Qc5+ Kg8\n27. Rgf1 Rb8 28. R1f2 Qc7 29. Rc2 Qd7 30. h4 Qd8 31. g5 Bxa2 32. Rxe4 Qd3\n33. Rd4 Qxe3+ 34. Rcd2 Qe1+ 35. Rd1 Qe3+ 36. R1d2 Qg1+ 37. Rd1 1/2-1/2",
    "summary": "Game 1 of the Kasparov–X3D Fritz match in 2003. The game ends in a draw.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kasparov.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kasparov.zip"
      }
    ]
  },
  {
    "id": "x3d-fritz-garry-kasparov-2003-x3d-match-2",
    "title": "Kasparov–X3D Fritz — game 2 (2003)",
    "era": "Human vs computer",
    "white": "X3D Fritz",
    "black": "Garry Kasparov",
    "year": 2003,
    "event": "Kasparov–X3D Fritz match",
    "date": "2003.11.13",
    "result": "1-0",
    "expectedPlies": 77,
    "finalFen": "4R1r1/1p1Q3k/6qb/P2P3p/3p2p1/8/5PPP/5NK1 b - - 7 39",
    "pgn": "[Event \"Kasparov–X3D Fritz match\"]\n[Site \"New York USA\"]\n[Date \"2003.11.13\"]\n[Round \"2\"]\n[White \"X3D Fritz\"]\n[Black \"Garry Kasparov\"]\n[Result \"1-0\"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. d3 d6 5. c3 g6 6. O-O Bg7 7. Nbd2 O-O\n8. Re1 Re8 9. d4 Bd7 10. d5 Ne7 11. Bxd7 Nxd7 12. a4 h6 13. a5 a6 14. b4 f5\n15. c4 Nf6 16. Bb2 Qd7 17. Rb1 g5 18. exf5 Qxf5 19. Nf1 Qh7 20. N3d2 Nf5\n21. Ne4 Nxe4 22. Rxe4 h5 23. Qd3 Rf8 24. Rbe1 Rf7 25. R1e2 g4 26. Qb3 Raf8\n27. c5 Qg6 28. cxd6 cxd6 29. b5 axb5 30. Qxb5 Bh6 31. Qb6 Kh7 32. Qb4 Rg7\n33. Rxe5 dxe5 34. Qxf8 Nd4 35. Bxd4 exd4 36. Re8 Rg8 37. Qe7+ Rg7 38. Qd8 Rg8\n39. Qd7+ 1-0",
    "summary": "Game 2 of the Kasparov–X3D Fritz match in 2003. X3D Fritz wins.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kasparov.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kasparov.zip"
      }
    ]
  },
  {
    "id": "garry-kasparov-x3d-fritz-2003-x3d-match-3",
    "title": "Kasparov–X3D Fritz — game 3 (2003)",
    "era": "Human vs computer",
    "white": "Garry Kasparov",
    "black": "X3D Fritz",
    "year": 2003,
    "event": "Kasparov–X3D Fritz match",
    "date": "2003.11.16",
    "result": "1-0",
    "expectedPlies": 89,
    "finalFen": "r6k/1r1qnppp/NPp2n1b/2Pp4/3Pp3/1RB1P1PP/R1Q2P2/K4B2 b - - 4 45",
    "pgn": "[Event \"Kasparov–X3D Fritz match\"]\n[Site \"New York USA\"]\n[Date \"2003.11.16\"]\n[Round \"3\"]\n[White \"Garry Kasparov\"]\n[Black \"X3D Fritz\"]\n[Result \"1-0\"]\n\n1. Nf3 Nf6 2. c4 e6 3. Nc3 d5 4. d4 c6 5. e3 a6 6. c5 Nbd7 7. b4 a5 8. b5 e5\n9. Qa4 Qc7 10. Ba3 e4 11. Nd2 Be7 12. b6 Qd8 13. h3 O-O 14. Nb3 Bd6 15. Rb1 Be7\n16. Nxa5 Nb8 17. Bb4 Qd7 18. Rb2 Qe6 19. Qd1 Nfd7 20. a3 Qh6 21. Nb3 Bh4\n22. Qd2 Nf6 23. Kd1 Be6 24. Kc1 Rd8 25. Rc2 Nbd7 26. Kb2 Nf8 27. a4 Ng6\n28. a5 Ne7 29. a6 bxa6 30. Na5 Rdb8 31. g3 Bg5 32. Bg2 Qg6 33. Ka1 Kh8\n34. Na2 Bd7 35. Bc3 Ne8 36. Nb4 Kg8 37. Rb1 Bc8 38. Ra2 Bh6 39. Bf1 Qe6\n40. Qd1 Nf6 41. Qa4 Bb7 42. Nxb7 Rxb7 43. Nxa6 Qd7 44. Qc2 Kh8 45. Rb3 1-0",
    "summary": "Kasparov wins the third game of his 2003 X3D Fritz match, restoring equality before the final game.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kasparov.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kasparov.zip"
      }
    ]
  },
  {
    "id": "x3d-fritz-garry-kasparov-2003-x3d-match-4",
    "title": "Kasparov–X3D Fritz — game 4 (2003)",
    "era": "Human vs computer",
    "white": "X3D Fritz",
    "black": "Garry Kasparov",
    "year": 2003,
    "event": "Kasparov–X3D Fritz match",
    "date": "2003.11.18",
    "result": "1/2-1/2",
    "expectedPlies": 54,
    "finalFen": "3Q4/6pk/7p/8/8/8/r4qPP/3R3K w - - 2 28",
    "pgn": "[Event \"Kasparov–X3D Fritz match\"]\n[Site \"New York USA\"]\n[Date \"2003.11.18\"]\n[Round \"4\"]\n[White \"X3D Fritz\"]\n[Black \"Garry Kasparov\"]\n[Result \"1/2-1/2\"]\n\n1. d4 d5 2. c4 dxc4 3. Nf3 e6 4. e3 Nf6 5. Bxc4 c5 6. O-O a6 7. Bb3 cxd4\n8. exd4 Nc6 9. Nc3 Be7 10. Re1 O-O 11. Bf4 Na5 12. d5 Nxb3 13. Qxb3 exd5\n14. Rad1 Be6 15. Qxb7 Bd6 16. Bg5 Rb8 17. Qxa6 Rxb2 18. Bxf6 Qxf6 19. Qxd6 Qxc3\n20. Nd4 Rxa2 21. Nxe6 fxe6 22. Qxe6+ Kh8 23. Rf1 Qc5 24. Qxd5 Rfxf2\n25. Rxf2 Qxf2+ 26. Kh1 h6 27. Qd8+ Kh7 1/2-1/2",
    "summary": "Game 4 of the Kasparov–X3D Fritz match in 2003. The game ends in a draw.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kasparov.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kasparov.zip"
      }
    ]
  },
  {
    "id": "deep-fritz-vladimir-kramnik-2002-brains-in-bahrain-1",
    "title": "Brains in Bahrain — game 1 (2002)",
    "era": "Human vs computer",
    "white": "Deep Fritz",
    "black": "Vladimir Kramnik",
    "year": 2002,
    "event": "Brains in Bahrain",
    "date": "2002.10.04",
    "result": "1/2-1/2",
    "expectedPlies": 55,
    "finalFen": "4k3/2p5/1p2p1p1/p1p1P1P1/P1P3p1/1P6/5PK1/8 b - - 2 28",
    "pgn": "[Event \"Brains in Bahrain\"]\n[Site \"Bahrain UAE\"]\n[Date \"2002.10.04\"]\n[Round \"1\"]\n[White \"Deep Fritz\"]\n[Black \"Vladimir Kramnik\"]\n[Result \"1/2-1/2\"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4 5. d4 Nd6 6. Bxc6 dxc6 7. dxe5 Nf5\n8. Qxd8+ Kxd8 9. Nc3 h6 10. b3 Ke8 11. Bb2 Be7 12. Rad1 a5 13. a4 h5 14. Ne2 Be6\n15. c4 Rd8 16. h3 b6 17. Nfd4 Nxd4 18. Nxd4 c5 19. Nxe6 fxe6 20. Rxd8+ Kxd8\n21. Bc1 Kc8 22. Rd1 Rd8 23. Rxd8+ Kxd8 24. g4 g6 25. h4 hxg4 26. Bg5 Bxg5\n27. hxg5 Ke8 28. Kg2 1/2-1/2",
    "summary": "Game 1 of the Brains in Bahrain in 2002. The game ends in a draw.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kramnik.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kramnik.zip"
      }
    ]
  },
  {
    "id": "vladimir-kramnik-deep-fritz-2002-brains-in-bahrain-2",
    "title": "Brains in Bahrain — game 2 (2002)",
    "era": "Human vs computer",
    "white": "Vladimir Kramnik",
    "black": "Deep Fritz",
    "year": 2002,
    "event": "Brains in Bahrain",
    "date": "2002.10.06",
    "result": "1-0",
    "expectedPlies": 113,
    "finalFen": "8/3k4/5p1p/p2Rp2P/P3P3/1PK2P2/8/3r4 b - - 6 57",
    "pgn": "[Event \"Brains in Bahrain\"]\n[Site \"Bahrain UAE\"]\n[Date \"2002.10.06\"]\n[Round \"2\"]\n[White \"Vladimir Kramnik\"]\n[Black \"Deep Fritz\"]\n[Result \"1-0\"]\n\n1. d4 d5 2. c4 dxc4 3. Nf3 Nf6 4. e3 e6 5. Bxc4 c5 6. O-O a6 7. dxc5 Qxd1\n8. Rxd1 Bxc5 9. Kf1 b5 10. Be2 Bb7 11. Nbd2 Nbd7 12. Nb3 Bf8 13. a4 b4\n14. Nfd2 Bd5 15. f3 Bd6 16. g3 e5 17. e4 Be6 18. Nc4 Bc7 19. Be3 a5 20. Nc5 Nxc5\n21. Bxc5 Nd7 22. Nd6+ Kf8 23. Bf2 Bxd6 24. Rxd6 Ke7 25. Rad1 Rhc8 26. Bb5 Nc5\n27. Bc6 Bc4+ 28. Ke1 Nd3+ 29. R1xd3 Bxd3 30. Bc5 Bc4 31. Rd4+ Kf6 32. Rxc4 Rxc6\n33. Be7+ Kxe7 34. Rxc6 Kd7 35. Rc5 f6 36. Kd2 Kd6 37. Rd5+ Kc6 38. Kd3 g6\n39. Kc4 g5 40. h3 h6 41. h4 gxh4 42. gxh4 Ra7 43. h5 Ra8 44. Rc5+ Kb6\n45. Rb5+ Kc6 46. Rd5 Kc7 47. Kb5 b3 48. Rd3 Ra7 49. Rxb3 Rb7+ 50. Kc4 Ra7\n51. Rb5 Ra8 52. Kd5 Ra6 53. Rc5+ Kd7 54. b3 Rd6+ 55. Kc4 Rd4+ 56. Kc3 Rd1\n57. Rd5+ 1-0",
    "summary": "Game 2 of the Brains in Bahrain in 2002. Vladimir Kramnik wins.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kramnik.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kramnik.zip"
      }
    ]
  },
  {
    "id": "deep-fritz-vladimir-kramnik-2002-brains-in-bahrain-3",
    "title": "Brains in Bahrain — game 3 (2002)",
    "era": "Human vs computer",
    "white": "Deep Fritz",
    "black": "Vladimir Kramnik",
    "year": 2002,
    "event": "Brains in Bahrain",
    "date": "2002.10.08",
    "result": "0-1",
    "expectedPlies": 101,
    "finalFen": "8/7p/2p1b3/2k2pP1/5P2/1pK5/4B3/8 b - - 1 51",
    "pgn": "[Event \"Brains in Bahrain\"]\n[Site \"Manama BAH\"]\n[Date \"2002.10.08\"]\n[Round \"3\"]\n[White \"Deep Fritz\"]\n[Black \"Vladimir Kramnik\"]\n[Result \"0-1\"]\n\n1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Bc5 5. Nxc6 Qf6 6. Qd2 dxc6 7. Nc3 Ne7\n8. Qf4 Be6 9. Qxf6 gxf6 10. Na4 Bb4+ 11. c3 Bd6 12. Be3 b6 13. f4 O-O-O\n14. Kf2 c5 15. c4 Nc6 16. Nc3 f5 17. e5 Bf8 18. b3 Nb4 19. a3 Nc2 20. Rc1 Nxe3\n21. Kxe3 Bg7 22. Nd5 c6 23. Nf6 Bxf6 24. exf6 Rhe8 25. Kf3 Rd2 26. h3 Bd7\n27. g3 Re6 28. Rb1 Rxf6 29. Be2 Re6 30. Rhe1 Kc7 31. Bf1 b5 32. Rec1 Kb6\n33. b4 cxb4 34. axb4 Re4 35. Rd1 Rxd1 36. Rxd1 Be6 37. Bd3 Rd4 38. Be2 Rxd1\n39. c5+ Kb7 40. Bxd1 a5 41. bxa5 Ka6 42. Ke3 Kxa5 43. Kd4 b4 44. g4 fxg4\n45. hxg4 b3 46. Kc3 Ka4 47. Kb2 f6 48. Bf3 Kb5 49. g5 f5 50. Kc3 Kxc5 51. Be2 0-1",
    "summary": "Game 3 of the Brains in Bahrain in 2002. Vladimir Kramnik wins.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kramnik.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kramnik.zip"
      }
    ]
  },
  {
    "id": "vladimir-kramnik-deep-fritz-2002-brains-in-bahrain-4",
    "title": "Brains in Bahrain — game 4 (2002)",
    "era": "Human vs computer",
    "white": "Vladimir Kramnik",
    "black": "Deep Fritz",
    "year": 2002,
    "event": "Brains in Bahrain",
    "date": "2002.10.10",
    "result": "1/2-1/2",
    "expectedPlies": 81,
    "finalFen": "8/8/8/4pk2/P1R5/4P3/r7/6K1 b - - 2 41",
    "pgn": "[Event \"Brains in Bahrain\"]\n[Site \"Manama BAH\"]\n[Date \"2002.10.10\"]\n[Round \"4\"]\n[White \"Vladimir Kramnik\"]\n[Black \"Deep Fritz\"]\n[Result \"1/2-1/2\"]\n\n1. d4 d5 2. c4 e6 3. Nf3 c5 4. cxd5 exd5 5. g3 Nc6 6. Bg2 Nf6 7. O-O Be7\n8. Nc3 O-O 9. Bg5 cxd4 10. Nxd4 h6 11. Bf4 Bg4 12. h3 Be6 13. Rc1 Re8\n14. Nxe6 fxe6 15. e4 d4 16. e5 dxc3 17. exf6 Bxf6 18. bxc3 Qxd1 19. Rfxd1 Rad8\n20. Be3 Rxd1+ 21. Rxd1 Bxc3 22. Rd7 Rb8 23. Bxc6 bxc6 24. Rxa7 Rb2 25. Ra6 Bd2\n26. Rxc6 Bxe3 27. fxe3 Kf7 28. a4 Ra2 29. Rc4 Kf6 30. Kf1 g5 31. h4 h5\n32. hxg5+ Kxg5 33. Ke1 e5 34. Kf1 Kf5 35. Rh4 Kg6 36. Re4 Kf5 37. Rh4 Kg5\n38. Kg1 Kg6 39. g4 hxg4 40. Rxg4+ Kf5 41. Rc4 1/2-1/2",
    "summary": "Game 4 of the Brains in Bahrain in 2002. The game ends in a draw.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kramnik.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kramnik.zip"
      }
    ]
  },
  {
    "id": "deep-fritz-vladimir-kramnik-2002-brains-in-bahrain-5",
    "title": "Brains in Bahrain — game 5 (2002)",
    "era": "Human vs computer",
    "white": "Deep Fritz",
    "black": "Vladimir Kramnik",
    "year": 2002,
    "event": "Brains in Bahrain",
    "date": "2002.10.13",
    "result": "1-0",
    "expectedPlies": 69,
    "finalFen": "6k1/4Np2/1p4pp/4n3/2q1Q3/4P1PP/5PK1/8 b - - 3 35",
    "pgn": "[Event \"Brains in Bahrain\"]\n[Site \"Manama BAH\"]\n[Date \"2002.10.13\"]\n[Round \"5\"]\n[White \"Deep Fritz\"]\n[Black \"Vladimir Kramnik\"]\n[Result \"1-0\"]\n\n1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 Be7 5. Bg5 h6 6. Bh4 O-O 7. e3 Ne4\n8. Bxe7 Qxe7 9. cxd5 Nxc3 10. bxc3 exd5 11. Qb3 Rd8 12. c4 dxc4 13. Bxc4 Nc6\n14. Be2 b6 15. O-O Bb7 16. Rfc1 Rac8 17. Qa4 Na5 18. Rc3 c5 19. Rac1 cxd4\n20. Nxd4 Rxc3 21. Rxc3 Rc8 22. Rxc8+ Bxc8 23. h3 g6 24. Bf3 Bd7 25. Qc2 Qc5\n26. Qe4 Qc1+ 27. Kh2 Qc7+ 28. g3 Nc4 29. Be2 Ne5 30. Bb5 Bxb5 31. Nxb5 Qc5\n32. Nxa7 Qa5 33. Kg2 Qxa2 34. Nc8 Qc4 35. Ne7+ 1-0",
    "summary": "Game 5 of the Brains in Bahrain in 2002. Deep Fritz wins.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kramnik.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kramnik.zip"
      }
    ]
  },
  {
    "id": "vladimir-kramnik-deep-fritz-2002-brains-in-bahrain-6",
    "title": "Brains in Bahrain — game 6 (2002)",
    "era": "Human vs computer",
    "white": "Vladimir Kramnik",
    "black": "Deep Fritz",
    "year": 2002,
    "event": "Brains in Bahrain",
    "date": "2002.10.15",
    "result": "0-1",
    "expectedPlies": 68,
    "finalFen": "2r5/6kp/bp6/3n4/8/1p4P1/5P2/R3R1K1 w - - 0 35",
    "pgn": "[Event \"Brains in Bahrain\"]\n[Site \"Manama BAH\"]\n[Date \"2002.10.15\"]\n[Round \"6\"]\n[White \"Vladimir Kramnik\"]\n[Black \"Deep Fritz\"]\n[Result \"0-1\"]\n\n1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Ba6 5. b3 Bb4+ 6. Bd2 Be7 7. Bg2 c6 8. Bc3 d5\n9. Ne5 Nfd7 10. Nxd7 Nxd7 11. Nd2 O-O 12. O-O Rc8 13. a4 Bf6 14. e4 c5\n15. exd5 cxd4 16. Bb4 Re8 17. Ne4 exd5 18. Nd6 dxc4 19. Nxf7 Kxf7 20. Bd5+ Kg6\n21. Qg4+ Bg5 22. Be4+ Rxe4 23. Qxe4+ Kh6 24. h4 Bf6 25. Bd2+ g5 26. hxg5+ Bxg5\n27. Qh4+ Kg6 28. Qe4+ Kg7 29. Bxg5 Qxg5 30. Rfe1 cxb3 31. Qxd4+ Nf6 32. a5 Qd5\n33. Qxd5 Nxd5 34. axb6 axb6 0-1",
    "summary": "Deep Fritz wins game six of Brains in Bahrain, bringing the 2002 match level after Kramnik’s early lead.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kramnik.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kramnik.zip"
      }
    ]
  },
  {
    "id": "deep-fritz-vladimir-kramnik-2002-brains-in-bahrain-7",
    "title": "Brains in Bahrain — game 7 (2002)",
    "era": "Human vs computer",
    "white": "Deep Fritz",
    "black": "Vladimir Kramnik",
    "year": 2002,
    "event": "Brains in Bahrain",
    "date": "2002.10.17",
    "result": "1/2-1/2",
    "expectedPlies": 56,
    "finalFen": "3qrrk1/5p1p/bp1p2pb/p2Pp3/P1PpPP2/1P1Q2PB/3NR2P/5RK1 w - - 9 29",
    "pgn": "[Event \"Brains in Bahrain\"]\n[Site \"Manama BAH\"]\n[Date \"2002.10.17\"]\n[Round \"7\"]\n[White \"Deep Fritz\"]\n[Black \"Vladimir Kramnik\"]\n[Result \"1/2-1/2\"]\n\n1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Bb7 5. Bg2 Be7 6. O-O O-O 7. Nc3 Ne4\n8. Qc2 Nxc3 9. Qxc3 c5 10. Rd1 d6 11. b3 Bf6 12. Bb2 Qe7 13. Qc2 Nc6 14. e4 e5\n15. d5 Nd4 16. Bxd4 cxd4 17. Bh3 g6 18. a4 a5 19. Rab1 Ba6 20. Re1 Kh8\n21. Kg2 Bg7 22. Qd3 Rae8 23. Nd2 Bh6 24. f4 Qc7 25. Rf1 Kg8 26. Rbe1 Qd8\n27. Kg1 Bb7 28. Re2 Ba6 1/2-1/2",
    "summary": "Game 7 of the Brains in Bahrain in 2002. The game ends in a draw.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kramnik.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kramnik.zip"
      }
    ]
  },
  {
    "id": "vladimir-kramnik-deep-fritz-2002-brains-in-bahrain-8",
    "title": "Brains in Bahrain — game 8 (2002)",
    "era": "Human vs computer",
    "white": "Vladimir Kramnik",
    "black": "Deep Fritz",
    "year": 2002,
    "event": "Brains in Bahrain",
    "date": "2002.10.19",
    "result": "1/2-1/2",
    "expectedPlies": 41,
    "finalFen": "3qnrk1/pp3ppp/2p3b1/8/3P4/PB3N1P/1P1Q1PP1/4R1K1 b - - 1 21",
    "pgn": "[Event \"Brains in Bahrain\"]\n[Site \"Manama BAH\"]\n[Date \"2002.10.19\"]\n[Round \"8\"]\n[White \"Vladimir Kramnik\"]\n[Black \"Deep Fritz\"]\n[Result \"1/2-1/2\"]\n\n1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 c6 5. Bg5 Be7 6. e3 O-O 7. Bd3 Nbd7\n8. O-O dxc4 9. Bxc4 Nd5 10. Bxe7 Qxe7 11. Rc1 Nxc3 12. Rxc3 e5 13. Bb3 exd4\n14. exd4 Nf6 15. Re1 Qd6 16. h3 Bf5 17. Rce3 Rae8 18. Re5 Bg6 19. a3 Qd8\n20. Rxe8 Nxe8 21. Qd2 1/2-1/2",
    "summary": "Game 8 of the Brains in Bahrain in 2002. The game ends in a draw.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kramnik.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kramnik.zip"
      }
    ]
  },
  {
    "id": "vladimir-kramnik-deep-fritz-2006-the-duel-1",
    "title": "Kramnik–Deep Fritz — game 1 (2006)",
    "era": "Human vs computer",
    "white": "Vladimir Kramnik",
    "black": "Deep Fritz",
    "year": 2006,
    "event": "Kramnik–Deep Fritz match",
    "date": "2006.11.25",
    "result": "1/2-1/2",
    "expectedPlies": 93,
    "finalFen": "8/8/2K5/4N3/P3k3/8/8/4b3 b - - 0 47",
    "pgn": "[Event \"Kramnik–Deep Fritz match\"]\n[Site \"Bonne GER\"]\n[Date \"2006.11.25\"]\n[Round \"1\"]\n[White \"Vladimir Kramnik\"]\n[Black \"Deep Fritz\"]\n[Result \"1/2-1/2\"]\n\n1. d4 Nf6 2. c4 e6 3. g3 d5 4. Bg2 dxc4 5. Qa4+ Nbd7 6. Qxc4 a6 7. Qd3 c5\n8. dxc5 Bxc5 9. Nf3 O-O 10. O-O Qe7 11. Nc3 b6 12. Ne4 Nxe4 13. Qxe4 Nf6\n14. Qh4 Bb7 15. Bg5 Rfd8 16. Bxf6 Qxf6 17. Qxf6 gxf6 18. Rfd1 Kf8 19. Ne1 Bxg2\n20. Kxg2 f5 21. Rxd8+ Rxd8 22. Nd3 Bd4 23. Rc1 e5 24. Rc2 Rd5 25. Nb4 Rb5\n26. Nxa6 Rxb2 27. Rxb2 Bxb2 28. Nb4 Kg7 29. Nd5 Bd4 30. a4 Bc5 31. h3 f6\n32. f3 Kg6 33. e4 h5 34. g4 hxg4 35. hxg4 fxe4 36. fxe4 Kg5 37. Kf3 Kg6\n38. Ke2 Kg5 39. Kd3 Bg1 40. Kc4 Bf2 41. Kb5 Kxg4 42. Nxf6+ Kf3 43. Kc6 Bh4\n44. Nd7 Kxe4 45. Kxb6 Bf2+ 46. Kc6 Be1 47. Nxe5 1/2-1/2",
    "summary": "Game 1 of the Kramnik–Deep Fritz match in 2006. The game ends in a draw.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kramnik.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kramnik.zip"
      }
    ]
  },
  {
    "id": "deep-fritz-vladimir-kramnik-2006-the-duel-2",
    "title": "Kramnik–Deep Fritz — game 2 (2006)",
    "era": "Human vs computer",
    "white": "Deep Fritz",
    "black": "Vladimir Kramnik",
    "year": 2006,
    "event": "Kramnik–Deep Fritz match",
    "date": "2006.11.27",
    "result": "1-0",
    "expectedPlies": 69,
    "finalFen": "5N1k/6pQ/7p/4P3/pp6/4q3/1P4PP/2b4K b - - 2 35",
    "pgn": "[Event \"Kramnik–Deep Fritz match\"]\n[Site \"Bonne GER\"]\n[Date \"2006.11.27\"]\n[Round \"2\"]\n[White \"Deep Fritz\"]\n[Black \"Vladimir Kramnik\"]\n[Result \"1-0\"]\n\n1. d4 d5 2. c4 dxc4 3. e4 b5 4. a4 c6 5. Nc3 b4 6. Na2 Nf6 7. e5 Nd5 8. Bxc4 e6\n9. Nf3 a5 10. Bg5 Qb6 11. Nc1 Ba6 12. Qe2 h6 13. Be3 Bxc4 14. Qxc4 Nd7\n15. Nb3 Be7 16. Rc1 O-O 17. O-O Rfc8 18. Qe2 c5 19. Nfd2 Qc6 20. Qh5 Qxa4\n21. Nxc5 Nxc5 22. dxc5 Nxe3 23. fxe3 Bxc5 24. Qxf7+ Kh8 25. Qf3 Rf8 26. Qe4 Qd7\n27. Nb3 Bb6 28. Rfd1 Qf7 29. Rf1 Qa7 30. Rxf8+ Rxf8 31. Nd4 a4 32. Nxe6 Bxe3+\n33. Kh1 Bxc1 34. Nxf8 Qe3 35. Qh7# 1-0",
    "summary": "Deep Fritz wins the second game of the 2006 match with 35.Qh7#, the famous missed mate in one. Replay the full score leading to the final position.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kramnik.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kramnik.zip"
      }
    ]
  },
  {
    "id": "vladimir-kramnik-deep-fritz-2006-the-duel-3",
    "title": "Kramnik–Deep Fritz — game 3 (2006)",
    "era": "Human vs computer",
    "white": "Vladimir Kramnik",
    "black": "Deep Fritz",
    "year": 2006,
    "event": "Kramnik–Deep Fritz match",
    "date": "2006.11.29",
    "result": "1/2-1/2",
    "expectedPlies": 87,
    "finalFen": "8/8/5kp1/7p/7P/4B1P1/r4PK1/8 b - - 1 44",
    "pgn": "[Event \"Kramnik–Deep Fritz match\"]\n[Site \"Bonne GER\"]\n[Date \"2006.11.29\"]\n[Round \"3\"]\n[White \"Vladimir Kramnik\"]\n[Black \"Deep Fritz\"]\n[Result \"1/2-1/2\"]\n\n1. d4 Nf6 2. c4 e6 3. g3 d5 4. Bg2 dxc4 5. Qa4+ Nbd7 6. Qxc4 a6 7. Qc2 c5\n8. Nf3 b6 9. Ne5 Nd5 10. Nc3 Bb7 11. Nxd5 Bxd5 12. Bxd5 exd5 13. O-O Nxe5\n14. dxe5 Qc8 15. Rd1 Qe6 16. Qd3 Be7 17. Qxd5 Rd8 18. Qb3 Rxd1+ 19. Qxd1 O-O\n20. Qb3 c4 21. Qc3 f6 22. b3 Rc8 23. Bb2 b5 24. Qe3 fxe5 25. bxc4 Rxc4\n26. Bxe5 h6 27. Rd1 Rc2 28. Qb3 Qxb3 29. axb3 Rxe2 30. Bd6 Bf6 31. Bc5 a5\n32. Bd4 Be7 33. Bc3 a4 34. bxa4 bxa4 35. Rd7 Bf8 36. Rd8 Kf7 37. Ra8 a3\n38. Rxf8+ Kxf8 39. Bb4+ Kf7 40. Bxa3 Ra2 41. Bc5 g6 42. h4 Kf6 43. Be3 h5 44. Kg2\n1/2-1/2",
    "summary": "Game 3 of the Kramnik–Deep Fritz match in 2006. The game ends in a draw.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kramnik.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kramnik.zip"
      }
    ]
  },
  {
    "id": "deep-fritz-vladimir-kramnik-2006-the-duel-4",
    "title": "Kramnik–Deep Fritz — game 4 (2006)",
    "era": "Human vs computer",
    "white": "Deep Fritz",
    "black": "Vladimir Kramnik",
    "year": 2006,
    "event": "Kramnik–Deep Fritz match",
    "date": "2006.12.01",
    "result": "1/2-1/2",
    "expectedPlies": 108,
    "finalFen": "8/p3n3/2p1k2p/P1P5/3K2P1/5B2/8/8 w - - 9 55",
    "pgn": "[Event \"Kramnik–Deep Fritz match\"]\n[Site \"Bonne GER\"]\n[Date \"2006.12.01\"]\n[Round \"4\"]\n[White \"Deep Fritz\"]\n[Black \"Vladimir Kramnik\"]\n[Result \"1/2-1/2\"]\n\n1. e4 e5 2. Nf3 Nf6 3. d4 Nxe4 4. Bd3 d5 5. Nxe5 Nd7 6. Nxd7 Bxd7 7. O-O Bd6\n8. Qh5 Qf6 9. Nc3 Qxd4 10. Nxd5 Bc6 11. Ne3 g6 12. Qh3 Ng5 13. Qg4 Qf4\n14. Qxf4 Bxf4 15. Nc4 Ne6 16. Bxf4 Nxf4 17. Rfe1+ Kf8 18. Bf1 Bb5 19. a4 Ba6\n20. b4 Bxc4 21. Bxc4 Rd8 22. Re4 Nh5 23. Rae1 Rd7 24. h3 Ng7 25. Re5 Nf5\n26. Bb5 c6 27. Bd3 Nd6 28. g4 Kg7 29. f4 Rhd8 30. Kg2 Nc8 31. a5 Rd4 32. R5e4 Kf8\n33. Kf3 h6 34. Rxd4 Rxd4 35. Re4 Rd6 36. Ke3 g5 37. Rd4 Ke7 38. c4 Rxd4\n39. Kxd4 gxf4 40. Ke4 Kf6 41. Kxf4 Ne7 42. Be4 b6 43. c5 bxc5 44. bxc5 Ng6+\n45. Ke3 Ne7 46. Kd4 Ke6 47. Bf3 f5 48. Bd1 Kf6 49. Bc2 fxg4 50. hxg4 Ke6\n51. Bb1 Kf6 52. Be4 Ke6 53. Bh1 Kf6 54. Bf3 Ke6 1/2-1/2",
    "summary": "Game 4 of the Kramnik–Deep Fritz match in 2006. The game ends in a draw.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kramnik.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kramnik.zip"
      }
    ]
  },
  {
    "id": "vladimir-kramnik-deep-fritz-2006-the-duel-5",
    "title": "Kramnik–Deep Fritz — game 5 (2006)",
    "era": "Human vs computer",
    "white": "Vladimir Kramnik",
    "black": "Deep Fritz",
    "year": 2006,
    "event": "Kramnik–Deep Fritz match",
    "date": "2006.12.03",
    "result": "1/2-1/2",
    "expectedPlies": 69,
    "finalFen": "5rk1/p7/6Pp/2p5/7R/4P2n/r5P1/BR2K3 b - - 9 35",
    "pgn": "[Event \"Kramnik–Deep Fritz match\"]\n[Site \"Bonne GER\"]\n[Date \"2006.12.03\"]\n[Round \"5\"]\n[White \"Vladimir Kramnik\"]\n[Black \"Deep Fritz\"]\n[Result \"1/2-1/2\"]\n\n1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 Bb4 5. e3 O-O 6. a3 Bxc3+ 7. bxc3 c5\n8. Bb2 Nc6 9. Rc1 Re8 10. Bd3 dxc4 11. Bxc4 e5 12. dxe5 Qxd1+ 13. Rxd1 Nxe5\n14. Nxe5 Rxe5 15. Be2 Bd7 16. c4 Re7 17. h4 Ne4 18. h5 Ba4 19. Rd3 b5\n20. cxb5 Bxb5 21. Rd1 Bxe2 22. Kxe2 Rb8 23. Ba1 f5 24. Rd5 Rb3 25. Rxf5 Rxa3\n26. Rb1 Re8 27. Rf4 Ra2+ 28. Ke1 h6 29. Rg4 g5 30. hxg6 Nxf2 31. Rh4 Rf8\n32. Kf1 Nh3+ 33. Ke1 Nf2 34. Kf1 Nh3+ 35. Ke1 1/2-1/2",
    "summary": "Game 5 of the Kramnik–Deep Fritz match in 2006. The game ends in a draw.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kramnik.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kramnik.zip"
      }
    ]
  },
  {
    "id": "deep-fritz-vladimir-kramnik-2006-the-duel-6",
    "title": "Kramnik–Deep Fritz — game 6 (2006)",
    "era": "Human vs computer",
    "white": "Deep Fritz",
    "black": "Vladimir Kramnik",
    "year": 2006,
    "event": "Kramnik–Deep Fritz match",
    "date": "2006.12.05",
    "result": "1-0",
    "expectedPlies": 93,
    "finalFen": "1r3n2/1br3k1/1N1R1p2/1Bp1p1pp/P1P5/1P6/3R1PPP/6K1 b - - 0 47",
    "pgn": "[Event \"Kramnik–Deep Fritz match\"]\n[Site \"Bonne GER\"]\n[Date \"2006.12.05\"]\n[Round \"6\"]\n[White \"Deep Fritz\"]\n[Black \"Vladimir Kramnik\"]\n[Result \"1-0\"]\n\n1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bc4 e6 7. O-O Be7\n8. Bb3 Qc7 9. Re1 Nc6 10. Re3 O-O 11. Rg3 Kh8 12. Nxc6 bxc6 13. Qe2 a5\n14. Bg5 Ba6 15. Qf3 Rab8 16. Re1 c5 17. Bf4 Qb7 18. Bc1 Ng8 19. Nb1 Bf6 20. c3 g6\n21. Na3 Qc6 22. Rh3 Bg7 23. Qg3 a4 24. Bc2 Rb6 25. e5 dxe5 26. Rxe5 Nf6\n27. Qh4 Qb7 28. Re1 h5 29. Rf3 Nh7 30. Qxa4 Qc6 31. Qxc6 Rxc6 32. Ba4 Rb6\n33. b3 Kg8 34. c4 Rd8 35. Nb5 Bb7 36. Rfe3 Bh6 37. Re5 Bxc1 38. Rxc1 Rc6\n39. Nc3 Rc7 40. Bb5 Nf8 41. Na4 Rdc8 42. Rd1 Kg7 43. Rd6 f6 44. Re2 e5\n45. Red2 g5 46. Nb6 Rb8 47. a4 1-0",
    "summary": "Game 6 of the Kramnik–Deep Fritz match in 2006. Deep Fritz wins.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/goatchess/goatchess.github.io/3d14b1986289e491916d350b6c4cbc472f3b6873/pgn/Kramnik.pgn"
      },
      {
        "title": "PGN Mentor — player archive",
        "url": "https://www.pgnmentor.com/players/Kramnik.zip"
      }
    ]
  },
  {
    "id": "alphazero-stockfish-2018-11542767294934054345",
    "title": "AlphaZero — Stockfish 8: research game 1 (2018)",
    "era": "Engine vs engine",
    "white": "AlphaZero",
    "black": "Stockfish 8",
    "year": 2018,
    "event": "AlphaZero–Stockfish research match",
    "date": "2018.01.18",
    "result": "1-0",
    "expectedPlies": 133,
    "finalFen": "4k3/1p6/1Kb5/1pPpB3/p7/P2R4/5r2/3B4 b - - 36 67",
    "pgn": "[Event \"AlphaZero–Stockfish research match\"]\n[Site \"London, UK\"]\n[Date \"2018.01.18\"]\n[Round \"11542767294934054345\"]\n[White \"AlphaZero\"]\n[Black \"Stockfish 8\"]\n[Result \"1-0\"]\n\n1. Nf3 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2 O-O 5. a3 Bxc3 6. Qxc3 a5 7. b4 d6\n8. e3 Ne4 9. Qc2 Ng5 10. b5 Nxf3+ 11. gxf3 Qf6 12. d4 Qxf3 13. Rg1 Nd7\n14. Be2 Qf6 15. Bb2 Qh4 16. Rg4 Qxh2 17. Rg3 f5 18. O-O-O Rf7 19. Bf3 Qh4\n20. Rh1 Qf6 21. Kb1 g6 22. Rgg1 a4 23. Ka1 Rg7 24. e4 f4 25. c5 Qe7 26. Rc1 Nf6\n27. e5 dxe5 28. Rhe1 e4 29. Bxe4 Qf8 30. d5 exd5 31. Bd3 Bg4 32. f3 Bd7\n33. Qc3 Nh5 34. Re5 c6 35. Rce1 Nf6 36. Qd4 cxb5 37. Bb1 Bc6 38. Re6 Rf7\n39. Rg1 Qg7 40. Qxf4 Re8 41. Rd6 Nd7 42. Qc1 Rf6 43. f4 Qe7 44. Rxf6 Nxf6\n45. f5 Qe3 46. fxg6 Qxc1 47. gxh7+ Kf7 48. Rxc1 Nxh7 49. Bxh7 Re3 50. Rd1 Ke8\n51. Ka2 Bd7 52. Bd4 Rh3 53. Bc2 Be6 54. Re1 Kd7 55. Kb2 Rf3 56. Re5 Rg3\n57. Re3 Rg2 58. Kc3 Rg4 59. Rf3 Ke8 60. Rf2 Rg3+ 61. Kb4 Rg4 62. Rd2 Bd7\n63. Ka5 Rf4 64. Be5 Rf3 65. Rd3 Rf2 66. Bd1 Bc6 67. Kb6 1-0",
    "summary": "A published AlphaZero–Stockfish 8 research game from 2018. AlphaZero wins; replay the complete score from the opening to the recorded finish.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/SDDNDan/IA-Sah-B3/29e3a7971e46d9d45f310e0a228e79566cbebb1b/pgns/engines/alphazero_vs_stockfish.pgn"
      },
      {
        "title": "DeepMind — AlphaZero research publication",
        "url": "https://deepmind.google/discover/blog/alphazero-shedding-new-light-on-chess-shogi-and-go/"
      }
    ]
  },
  {
    "id": "alphazero-stockfish-2018-11882219725075081943",
    "title": "AlphaZero — Stockfish 8: research game 2 (2018)",
    "era": "Engine vs engine",
    "white": "AlphaZero",
    "black": "Stockfish 8",
    "year": 2018,
    "event": "AlphaZero–Stockfish research match",
    "date": "2018.01.18",
    "result": "1-0",
    "expectedPlies": 137,
    "finalFen": "rr3k2/3P2p1/4P2p/7P/2pN4/p1P2KP1/8/3R4 b - - 2 69",
    "pgn": "[Event \"AlphaZero–Stockfish research match\"]\n[Site \"London, UK\"]\n[Date \"2018.01.18\"]\n[Round \"11882219725075081943\"]\n[White \"AlphaZero\"]\n[Black \"Stockfish 8\"]\n[Result \"1-0\"]\n\n1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Bb7 5. Bg2 Be7 6. Nc3 O-O 7. O-O Ne4 8. Bd2 d5\n9. cxd5 exd5 10. Qb3 c5 11. Bf4 Na6 12. Rfd1 c4 13. Qc2 Nb4 14. Qc1 Qd7\n15. h4 Rac8 16. a3 Nxc3 17. bxc3 Nc6 18. Qb1 Rce8 19. Re1 Na5 20. Ng5 f5\n21. Nf3 Bf6 22. Ra2 h6 23. a4 Qe6 24. Kh2 Bc8 25. Rh1 Nc6 26. h5 Kh8 27. Ng1 Qf7\n28. Bf3 Rd8 29. Nh3 Kg8 30. Bc1 Rfe8 31. Qb5 Bb7 32. Rd1 Na5 33. Qb1 Bc8\n34. Nf4 Bg5 35. Ng6 Bxc1 36. Qxc1 Be6 37. Ne5 Qc7 38. Rb2 Nb7 39. Rb5 Na5\n40. Qf4 Nb3 41. Ng6 Qc6 42. Qe5 Qd7 43. e3 Na5 44. Bg2 Nb7 45. Ra1 Kh7\n46. Nf4 Bg8 47. Rxd5 Bxd5 48. Qxd5 Nd6 49. Bh3 Re7 50. Ng6 Rf7 51. Ne5 Qb7\n52. Bg2 Qxd5 53. Bxd5 Rc7 54. Kg2 Ne4 55. Bxe4 fxe4 56. f3 exf3+ 57. Kxf3 Re7\n58. Ng6 Rb7 59. e4 b5 60. axb5 Rxb5 61. Nf4 Rb3 62. Ne2 Ra8 63. e5 a5 64. d5 a4\n65. d6 a3 66. d7 Kg8 67. Rd1 Rbb8 68. e6 Kf8 69. Nd4 1-0",
    "summary": "A published AlphaZero–Stockfish 8 research game from 2018. AlphaZero wins; replay the complete score from the opening to the recorded finish.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/SDDNDan/IA-Sah-B3/29e3a7971e46d9d45f310e0a228e79566cbebb1b/pgns/engines/alphazero_vs_stockfish.pgn"
      },
      {
        "title": "DeepMind — AlphaZero research publication",
        "url": "https://deepmind.google/discover/blog/alphazero-shedding-new-light-on-chess-shogi-and-go/"
      }
    ]
  },
  {
    "id": "alphazero-stockfish-2018-6854337384941683259",
    "title": "AlphaZero — Stockfish 8: research game 3 (2018)",
    "era": "Engine vs engine",
    "white": "AlphaZero",
    "black": "Stockfish 8",
    "year": 2018,
    "event": "AlphaZero–Stockfish research match",
    "date": "2018.01.18",
    "result": "1-0",
    "expectedPlies": 97,
    "finalFen": "7r/p2P1bk1/R7/2p1P3/p7/3B4/1P1K4/8 b - - 0 49",
    "pgn": "[Event \"AlphaZero–Stockfish research match\"]\n[Site \"London, UK\"]\n[Date \"2018.01.18\"]\n[Round \"6854337384941683259\"]\n[White \"AlphaZero\"]\n[Black \"Stockfish 8\"]\n[Result \"1-0\"]\n\n1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Bb7 5. Bg2 Bb4+ 6. Bd2 Be7 7. Nc3 O-O\n8. Qc2 Na6 9. a3 c5 10. d5 exd5 11. Ng5 Nc7 12. h4 h6 13. Nxd5 Ncxd5 14. cxd5 d6\n15. a4 Qd7 16. Bc3 Rfe8 17. O-O-O Bd8 18. e4 Ng4 19. Bh3 hxg5 20. f3 f5\n21. fxg4 fxg4 22. Bf1 gxh4 23. Bb5 Qf7 24. gxh4 Bf6 25. Rhf1 Rf8 26. Bxf6 gxf6\n27. Rf4 Qg7 28. Be2 Qh6 29. Rf1 g3 30. Qd3 Kh8 31. Qxg3 Rae8 32. Bd3 Bc8\n33. Kb1 Rf7 34. Qf2 Bd7 35. h5 Ref8 36. Bc2 Be8 37. Rf3 Re7 38. Rxf6 Qxf6\n39. Qxf6+ Rxf6 40. Rxf6 Kg7 41. Rxd6 Bxh5 42. Kc1 Re5 43. a5 bxa5 44. Kd2 Be8\n45. Ra6 Rh5 46. Bd3 a4 47. d6 Bf7 48. d7 Rh8 49. e5 1-0",
    "summary": "A published AlphaZero–Stockfish 8 research game from 2018. AlphaZero wins; replay the complete score from the opening to the recorded finish.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/SDDNDan/IA-Sah-B3/29e3a7971e46d9d45f310e0a228e79566cbebb1b/pgns/engines/alphazero_vs_stockfish.pgn"
      },
      {
        "title": "DeepMind — AlphaZero research publication",
        "url": "https://deepmind.google/discover/blog/alphazero-shedding-new-light-on-chess-shogi-and-go/"
      }
    ]
  },
  {
    "id": "alphazero-stockfish-2018-5361299757472136882",
    "title": "Stockfish 8 — AlphaZero: research game 8 (2018)",
    "era": "Engine vs engine",
    "white": "Stockfish 8",
    "black": "AlphaZero",
    "year": 2018,
    "event": "AlphaZero–Stockfish research match",
    "date": "2018.01.18",
    "result": "0-1",
    "expectedPlies": 114,
    "finalFen": "3k4/8/5N2/1rb1Pp2/2pB1P1p/3b2pP/6P1/3R3K w - - 10 58",
    "pgn": "[Event \"AlphaZero–Stockfish research match\"]\n[Site \"London, UK\"]\n[Date \"2018.01.18\"]\n[Round \"5361299757472136882\"]\n[White \"Stockfish 8\"]\n[Black \"AlphaZero\"]\n[Result \"0-1\"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4 5. d4 Nd6 6. Bxc6 dxc6 7. dxe5 Nf5\n8. Qxd8+ Kxd8 9. Rd1+ Ke8 10. Nc3 Be7 11. b3 Nh4 12. Nxh4 Bxh4 13. Be3 Be7\n14. Ne2 h5 15. c3 h4 16. Rd2 Rh5 17. h3 a5 18. Re1 Be6 19. f4 a4 20. Nd4 Bd7\n21. b4 c5 22. bxc5 Bxc5 23. Nc2 Be7 24. Rb1 b6 25. Nb4 Be6 26. Nc6 a3 27. Kh2 f6\n28. Re1 f5 29. Nd4 Bd7 30. Bf2 Rd8 31. Ree2 c5 32. Nc2 g5 33. Nxa3 g4 34. Kg1 g3\n35. Be3 Ra8 36. Nc4 Rh6 37. Rb2 Ra6 38. Bc1 b5 39. Ne3 Ra4 40. c4 bxc4 41. Nd5 c3\n42. Nxc3 Rc4 43. Bd2 Rc6 44. Kf1 Be6 45. Rb1 Rb4 46. Ree1 Bc4+ 47. Kg1 Rc8\n48. Rbc1 Bd3 49. Nd5 Rb2 50. Bc3 Rxa2 51. Ra1 Rxa1 52. Bxa1 c4 53. Nf6+ Kd8\n54. Bc3 Rb8 55. Bd4 Bb4 56. Rd1 Rb5 57. Kh1 Bc5 0-1",
    "summary": "A published AlphaZero–Stockfish 8 research game from 2018. AlphaZero wins; replay the complete score from the opening to the recorded finish.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/SDDNDan/IA-Sah-B3/29e3a7971e46d9d45f310e0a228e79566cbebb1b/pgns/engines/alphazero_vs_stockfish.pgn"
      },
      {
        "title": "DeepMind — AlphaZero research publication",
        "url": "https://deepmind.google/discover/blog/alphazero-shedding-new-light-on-chess-shogi-and-go/"
      }
    ]
  },
  {
    "id": "alphazero-stockfish-2018-14385736216385115953",
    "title": "Stockfish 8 — AlphaZero: research game 10 (2018)",
    "era": "Engine vs engine",
    "white": "Stockfish 8",
    "black": "AlphaZero",
    "year": 2018,
    "event": "AlphaZero–Stockfish research match",
    "date": "2018.01.18",
    "result": "1-0",
    "expectedPlies": 297,
    "finalFen": "7r/5p1P/4b1p1/1k2P1P1/5KP1/B6R/8/8 b - - 14 149",
    "pgn": "[Event \"AlphaZero–Stockfish research match\"]\n[Site \"London, UK\"]\n[Date \"2018.01.18\"]\n[Round \"14385736216385115953\"]\n[White \"Stockfish 8\"]\n[Black \"AlphaZero\"]\n[Result \"1-0\"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4 5. d4 Nd6 6. Bxc6 dxc6 7. dxe5 Nf5\n8. Qxd8+ Kxd8 9. Nc3 Be7 10. Rd1+ Ke8 11. Ne4 Be6 12. b3 b6 13. h3 Rd8 14. Bb2 h5\n15. Rxd8+ Bxd8 16. Rd1 h4 17. Nh2 c5 18. c4 a5 19. Nc3 Nd4 20. Ng4 Rh5\n21. Kf1 Bd7 22. f3 Ne6 23. Nd5 Bg5 24. Nf2 Bd8 25. Nd3 Rf5 26. Ne3 Rg5\n27. Bc3 Rh5 28. Kf2 Bc8 29. Nd5 Bg5 30. f4 Bd8 31. Ne3 Bd7 32. Nd5 Bc8 33. Ne3 g6\n34. Bd2 Bb7 35. Nd5 Kd7 36. Nc1 Kc8 37. Ne2 Bc6 38. Be3 Ng7 39. Nec3 Rh8\n40. Ne4 a4 41. Kf3 Nf5 42. Rd2 Re8 43. Bf2 Rg8 44. b4 cxb4 45. Nxb4 Bb7\n46. Nd5 Re8 47. Kg4 Nh6+ 48. Kf3 Nf5 49. Kg4 Nh6+ 50. Kf3 Re6 51. Rd3 Nf5\n52. Rd2 a3 53. Kg4 Nh6+ 54. Kf3 Nf5 55. Kg4 Nh6+ 56. Kf3 Rc6 57. Ke3 Nf5+\n58. Kd3 Re6 59. Re2 Ne7 60. Ndf6 Nf5 61. Nd5 Re8 62. Kc3 b5 63. Nc5 Bc6\n64. Ne4 Bb7 65. Nc5 Bc6 66. Ne4 bxc4 67. Kxc4 Bb7 68. Re1 Ba6+ 69. Kb3 Bb7\n70. Kc4 Ba8 71. Bc5 Re6 72. Ng5 Bxg5 73. fxg5 Re8 74. Nf4 Ng7 75. Bxa3 Rd8\n76. Re2 Rd1 77. Rf2 Ne6 78. Nxe6 Bd5+ 79. Kb5 Bxe6 80. Bc5 Rb1+ 81. Kc6 Rd1\n82. Kb5 Ra1 83. a3 Re1 84. Bd4 Rb1+ 85. Kc5 Rc1+ 86. Kb5 Bd7+ 87. Kb4 Be6\n88. Kb5 Rb1+ 89. Kc5 Rd1 90. a4 Rc1+ 91. Kb5 Kb7 92. Rd2 Bb3 93. Rb2 Bc4+\n94. Kb4 Be6 95. Be3 Re1 96. Bd4 Rc1 97. Kb5 Bd7+ 98. Kb4 Ka6 99. Rb3 Rc2\n100. g4 Rd2 101. Kc5 Be6 102. Rf3 Kb7 103. a5 Ra2 104. Bc3 Ra3 105. Kb5 Rb3+\n106. Kc5 Ra3 107. Re3 Ra2 108. Be1 Ra1 109. Bd2 Kc8 110. Rd3 Rd1 111. Kb5 Bd7+\n112. Kb4 Be6 113. Kc5 Ra1 114. Kd4 Ra4+ 115. Kc5 Ra1 116. a6 Rxa6 117. Be1 Kb7\n118. Bxh4 Ra5+ 119. Kd4 c5+ 120. Ke4 Kc6 121. Be1 Ra2 122. Rd6+ Kb5 123. Rd3 Rh2\n124. Re3 Rg2 125. Kf3 Rc2 126. Rc3 Rh2 127. Kg3 Re2 128. Bf2 Kb4 129. Rc1 c4\n130. Re1 Rc2 131. Be3 c3 132. h4 Ra2 133. h5 Kb3 134. h6 Ra8 135. Rc1 c2\n136. h7 Rh8 137. Rh1 Kc3 138. Kf4 Kd3 139. Rh2 Kc3 140. Ke4 Kb4 141. Kd3 Bc4+\n142. Kxc2 Be6 143. Bc1 Rc8+ 144. Kd3 Rh8 145. Ke4 Ka4 146. Kf4 Kb3 147. Rh3+ Ka4\n148. Bb2 Kb5 149. Ba3 1-0",
    "summary": "Stockfish 8 wins this long research game against AlphaZero from 2018. The archived score runs to move 149.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/SDDNDan/IA-Sah-B3/29e3a7971e46d9d45f310e0a228e79566cbebb1b/pgns/engines/alphazero_vs_stockfish.pgn"
      },
      {
        "title": "DeepMind — AlphaZero research publication",
        "url": "https://deepmind.google/discover/blog/alphazero-shedding-new-light-on-chess-shogi-and-go/"
      }
    ]
  },
  {
    "id": "alphazero-stockfish-2018-17293012532641473451",
    "title": "Stockfish 8 — AlphaZero: research game 12 (2018)",
    "era": "Engine vs engine",
    "white": "Stockfish 8",
    "black": "AlphaZero",
    "year": 2018,
    "event": "AlphaZero–Stockfish research match",
    "date": "2018.01.18",
    "result": "0-1",
    "expectedPlies": 96,
    "finalFen": "3B4/6p1/k2b1p2/5b1p/2Pp3P/3P4/4KPP1/8 w - - 7 49",
    "pgn": "[Event \"AlphaZero–Stockfish research match\"]\n[Site \"London, UK\"]\n[Date \"2018.01.18\"]\n[Round \"17293012532641473451\"]\n[White \"Stockfish 8\"]\n[Black \"AlphaZero\"]\n[Result \"0-1\"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Na5 6. Bb5+ c6 7. dxc6 bxc6\n8. Bd3 Nd5 9. Nf3 Bd6 10. O-O Nf4 11. Re1 Nxd3 12. cxd3 O-O 13. Nxe5 c5\n14. Nc3 Bb7 15. b3 Re8 16. Nc4 Nxc4 17. Rxe8+ Qxe8 18. bxc4 Qe6 19. Bb2 Rb8\n20. Nb5 Qg6 21. Qf1 Bf4 22. Nxa7 h6 23. Bc3 Qh5 24. h3 Ra8 25. Qd1 Qxd1+\n26. Rxd1 Rxa7 27. Ra1 Bc6 28. a4 Rxa4 29. Rxa4 Bxa4 30. Kf1 Bb3 31. Ke2 Bd6\n32. Ke3 Be7 33. Be5 f6 34. Bc7 Kf7 35. Bb6 Ke6 36. Ke2 Kd7 37. Ke1 Kc6 38. Ba5 h5\n39. Kf1 Kd7 40. Bb6 Bc2 41. Ke2 Kc6 42. Ba5 Bd6 43. d4 cxd4 44. d3 Ba4 45. h4 Kb7\n46. Kf1 Bd7 47. Ke2 Ka6 48. Bd8 Bf5 0-1",
    "summary": "A published AlphaZero–Stockfish 8 research game from 2018. AlphaZero wins; replay the complete score from the opening to the recorded finish.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/SDDNDan/IA-Sah-B3/29e3a7971e46d9d45f310e0a228e79566cbebb1b/pgns/engines/alphazero_vs_stockfish.pgn"
      },
      {
        "title": "DeepMind — AlphaZero research publication",
        "url": "https://deepmind.google/discover/blog/alphazero-shedding-new-light-on-chess-shogi-and-go/"
      }
    ]
  },
  {
    "id": "yag-z-kaan-erdogmus-aleksandra-goryachkina-2025-fide-grand-swiss-2025-1-52",
    "title": "Yağız Kaan Erdoğmuş — Aleksandra Goryachkina: Grand Swiss 2025, round 1",
    "era": "Champions",
    "white": "Yağız Kaan Erdoğmuş",
    "black": "Aleksandra Goryachkina",
    "year": 2025,
    "event": "FIDE Grand Swiss 2025",
    "date": "2025.09.04",
    "result": "1-0",
    "expectedPlies": 93,
    "finalFen": "5r2/R4Ppk/8/2QP3P/5K2/4P1N1/1P5q/8 b - - 4 47",
    "pgn": "[Event \"FIDE Grand Swiss 2025\"]\n[Site \"Samarkand UZB\"]\n[Date \"2025.09.04\"]\n[Round \"1.52\"]\n[White \"Yağız Kaan Erdoğmuş\"]\n[Black \"Aleksandra Goryachkina\"]\n[Result \"1-0\"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d3 Bc5 5. Nc3 h6 6. Be3 Bxe3 7. fxe3 d6\n8. a3 O-O 9. Qe2 a6 10. Rg1 b5 11. Bb3 Be6 12. g4 Bxb3 13. cxb3 b4 14. axb4 Nh7\n15. b5 Nb4 16. bxa6 Rxa6 17. Ra4 Rxa4 18. bxa4 c6 19. h4 Qb6 20. Kf2 Re8\n21. g5 h5 22. Ra1 Nxd3+ 23. Kf1 Nb4 24. a5 Qc5 25. Ra4 Nf8 26. Nd2 Rb8 27. a6 Qa7\n28. Nc4 Nxa6 29. Kf2 Qb7 30. Na5 Qc8 31. Nxc6 Qxc6 32. Rxa6 Qb7 33. Ra2 Nd7\n34. Qxh5 Nc5 35. Qf3 Qb3 36. Kg3 Qc4 37. Ra7 Rf8 38. h5 d5 39. exd5 e4\n40. Qf4 Qb4 41. Qd6 Qc4 42. g6 Qd3 43. gxf7+ Kh7 44. Qxc5 Qf1 45. Nxe4 Qg1+\n46. Kf4 Qh2+ 47. Ng3 1-0",
    "summary": "Yağız Kaan Erdoğmuş wins this round-1 encounter at FIDE Grand Swiss 2025. The recorded opening is Giuoco Pianissimo.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/fidegrandsw25.pgn"
      },
      {
        "title": "The Week in Chess — FIDE Grand Swiss 2025",
        "url": "https://theweekinchess.com/chessnews/events/fide-grand-swiss-2025"
      }
    ]
  },
  {
    "id": "r-praggnanandhaa-ivan-zemlyanskii-2025-fide-grand-swiss-2025-2-9",
    "title": "R Praggnanandhaa — Ivan Zemlyanskii: Grand Swiss 2025, round 2",
    "era": "Champions",
    "white": "R Praggnanandhaa",
    "black": "Ivan Zemlyanskii",
    "year": 2025,
    "event": "FIDE Grand Swiss 2025",
    "date": "2025.09.05",
    "result": "1-0",
    "expectedPlies": 65,
    "finalFen": "3rk3/p3pp1p/1p4p1/n1r5/RP2BP2/3R2P1/4PK1P/8 b - - 0 33",
    "pgn": "[Event \"FIDE Grand Swiss 2025\"]\n[Site \"Samarkand UZB\"]\n[Date \"2025.09.05\"]\n[Round \"2.9\"]\n[White \"R Praggnanandhaa\"]\n[Black \"Ivan Zemlyanskii\"]\n[Result \"1-0\"]\n\n1. c4 Nf6 2. Nc3 d5 3. cxd5 Nxd5 4. Nf3 c5 5. g3 g6 6. Qb3 Nb4 7. Ne4 Bg7\n8. Nxc5 N8c6 9. Bg2 Qa5 10. Qc4 b6 11. Nb3 Qa6 12. Ne5 Qxc4 13. Nxc4 Be6\n14. d3 Rc8 15. O-O O-O 16. Bd2 Nc2 17. Rad1 Bg4 18. f3 Be6 19. Rc1 Bxc4\n20. dxc4 N2d4 21. Kf2 Nxb3 22. axb3 Bxb2 23. Rb1 Ba3 24. f4 Rfd8 25. Rfd1 Bb4\n26. Be3 Na5 27. Rd3 Kf8 28. Ra1 Ke8 29. Ra4 Bd6 30. Be4 Rc7 31. c5 Bxc5\n32. Bxc5 Rxc5 33. b4 1-0",
    "summary": "R Praggnanandhaa wins this round-2 encounter at FIDE Grand Swiss 2025. The recorded opening is English.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/fidegrandsw25.pgn"
      },
      {
        "title": "The Week in Chess — FIDE Grand Swiss 2025",
        "url": "https://theweekinchess.com/chessnews/events/fide-grand-swiss-2025"
      }
    ]
  },
  {
    "id": "haik-m-martirosyan-arjun-erigaisi-2025-fide-grand-swiss-2025-2-10",
    "title": "Haik M. Martirosyan — Arjun Erigaisi: Grand Swiss 2025, round 2",
    "era": "Champions",
    "white": "Haik M. Martirosyan",
    "black": "Arjun Erigaisi",
    "year": 2025,
    "event": "FIDE Grand Swiss 2025",
    "date": "2025.09.05",
    "result": "0-1",
    "expectedPlies": 108,
    "finalFen": "4k1r1/7R/1p6/1bn5/1R5P/8/4r1BK/8 w - - 17 55",
    "pgn": "[Event \"FIDE Grand Swiss 2025\"]\n[Site \"Samarkand UZB\"]\n[Date \"2025.09.05\"]\n[Round \"2.10\"]\n[White \"Haik M. Martirosyan\"]\n[Black \"Arjun Erigaisi\"]\n[Result \"0-1\"]\n\n1. d4 Nf6 2. c4 g6 3. Nf3 Bg7 4. g3 O-O 5. Bg2 d6 6. O-O Nbd7 7. Nc3 e5 8. h3 Re8\n9. e4 exd4 10. Nxd4 Nc5 11. Re1 h6 12. Nb3 Ne6 13. f4 a5 14. a4 h5 15. Be3 h4\n16. g4 g5 17. fxg5 Nd7 18. Nd4 Ne5 19. Nf5 Nxc4 20. Bc1 c6 21. Nxg7 Kxg7\n22. e5 d5 23. b3 Nb6 24. Kh1 Nd7 25. Qf3 Ndc5 26. Rb1 b6 27. b4 axb4 28. Rxb4 Ba6\n29. Qf6+ Kg8 30. Qh6 Nd3 31. g6 fxg6 32. Rf1 Nxe5 33. Rd1 Ra7 34. Nxd5 cxd5\n35. Rxd5 Qb8 36. Bb2 Rh7 37. Bxe5 Rxh6 38. Bxb8 Rxb8 39. Rd6 Nc5 40. g5 Rh5\n41. Rxg6+ Kh7 42. Rc6 Rxg5 43. Rxh4+ Kg8 44. Rb4 Nxa4 45. Rd6 Bb5 46. h4 Re5\n47. Rg4+ Kf7 48. Rh6 Rg8 49. Rh7+ Kf8 50. Rf4+ Ke8 51. Bf3 Nc5 52. Rb4 Re3\n53. Bg2 Re1+ 54. Kh2 Re2 0-1",
    "summary": "Arjun Erigaisi wins this round-2 encounter at FIDE Grand Swiss 2025. The recorded opening is King's Indian.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/fidegrandsw25.pgn"
      },
      {
        "title": "The Week in Chess — FIDE Grand Swiss 2025",
        "url": "https://theweekinchess.com/chessnews/events/fide-grand-swiss-2025"
      }
    ]
  },
  {
    "id": "vincent-keymer-jeffery-xiong-2025-fide-grand-swiss-2025-2-11",
    "title": "Vincent Keymer — Jeffery Xiong: Grand Swiss 2025, round 2",
    "era": "Champions",
    "white": "Vincent Keymer",
    "black": "Jeffery Xiong",
    "year": 2025,
    "event": "FIDE Grand Swiss 2025",
    "date": "2025.09.05",
    "result": "1-0",
    "expectedPlies": 108,
    "finalFen": "4R3/P5r1/8/3k1p1K/7P/8/8/8 w - - 5 55",
    "pgn": "[Event \"FIDE Grand Swiss 2025\"]\n[Site \"Samarkand UZB\"]\n[Date \"2025.09.05\"]\n[Round \"2.11\"]\n[White \"Vincent Keymer\"]\n[Black \"Jeffery Xiong\"]\n[Result \"1-0\"]\n\n1. c4 e6 2. Nc3 d5 3. d4 c5 4. cxd5 exd5 5. Nf3 Nc6 6. g3 Nf6 7. a3 cxd4\n8. Nxd4 Bc5 9. Be3 Bb6 10. Bg2 O-O 11. O-O Re8 12. h3 Rxe3 13. fxe3 Qd6\n14. Rf3 Bd7 15. Kh2 Ne5 16. Rf4 Re8 17. Qf1 Nh5 18. Nxd5 Nxf4 19. Qxf4 Bd8\n20. Rd1 Qg6 21. Nf3 Nxf3+ 22. exf3 Bxh3 23. Qa4 Qc6 24. Qxc6 bxc6 25. Kxh3 cxd5\n26. Rxd5 Bb6 27. e4 Rd8 28. Rb5 Rd2 29. a4 g6 30. a5 Bg1 31. f4 h5 32. e5 h4\n33. gxh4 Rd3+ 34. Kg4 Bh2 35. Bf3 Rd4 36. Rb8+ Kg7 37. Rb7 Rxf4+ 38. Kh3 Rxf3+\n39. Kxh2 Re3 40. b4 Rxe5 41. a6 Re4 42. Kg3 Kf6 43. b5 Rb4 44. Kf3 Ke6 45. Ke3 f5\n46. Rxa7 Rb3+ 47. Kf4 Rb4+ 48. Kg5 Rxb5 49. Ra8 Rb4 50. a7 Rg4+ 51. Kh6 Ra4\n52. Kxg6 Rg4+ 53. Kh5 Rg7 54. Re8+ Kd5 1-0",
    "summary": "Vincent Keymer wins this round-2 encounter at FIDE Grand Swiss 2025. The recorded opening is QGD.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/fidegrandsw25.pgn"
      },
      {
        "title": "The Week in Chess — FIDE Grand Swiss 2025",
        "url": "https://theweekinchess.com/chessnews/events/fide-grand-swiss-2025"
      }
    ]
  },
  {
    "id": "matthias-bluebaum-r-praggnanandhaa-2025-fide-grand-swiss-2025-5-2",
    "title": "Matthias Bluebaum — R Praggnanandhaa: Grand Swiss 2025, round 5",
    "era": "Champions",
    "white": "Matthias Bluebaum",
    "black": "R Praggnanandhaa",
    "year": 2025,
    "event": "FIDE Grand Swiss 2025",
    "date": "2025.09.08",
    "result": "1-0",
    "expectedPlies": 109,
    "finalFen": "6n1/5K2/6p1/8/6pP/k7/6P1/8 b - - 1 55",
    "pgn": "[Event \"FIDE Grand Swiss 2025\"]\n[Site \"Samarkand UZB\"]\n[Date \"2025.09.08\"]\n[Round \"5.2\"]\n[White \"Matthias Bluebaum\"]\n[Black \"R Praggnanandhaa\"]\n[Result \"1-0\"]\n\n1. d4 e6 2. c4 Bb4+ 3. Nc3 Bxc3+ 4. bxc3 f5 5. e4 fxe4 6. Qg4 Qe7 7. Qxe4 Nf6\n8. Qc2 b6 9. Nf3 Bb7 10. Be2 d6 11. O-O Nbd7 12. Be3 O-O 13. Nd2 e5 14. Rae1 Kh8\n15. Bd1 Rae8 16. f4 exf4 17. Rxf4 Qf7 18. Rff1 Re7 19. Qd3 Rfe8 20. Bf2 Rxe1\n21. Rxe1 Rxe1+ 22. Bxe1 Nf8 23. Qe3 Ng6 24. Bg3 Qd7 25. h3 Qf5 26. d5 Ba6\n27. a3 Kg8 28. Be2 Ne5 29. Bxe5 dxe5 30. Nf3 Qe4 31. Qxe4 Nxe4 32. Nxe5 Nxc3\n33. Bd3 b5 34. c5 Nxd5 35. Nc6 Bb7 36. Nxa7 c6 37. Be4 Nc3 38. Bxc6 Bxc6\n39. Nxc6 Kf7 40. Nd4 Kf6 41. c6 Ke7 42. Kf2 Kd6 43. Kf3 g6 44. h4 h6 45. Kg4 Nd5\n46. Nxb5+ Kxc6 47. Nd4+ Kc5 48. Nc2 Kc4 49. Kf3 Kb3 50. Ne3 Nf6 51. Ng4 Ng8\n52. Ke4 Kxa3 53. Ke5 h5 54. Ke6 hxg4 55. Kf7 1-0",
    "summary": "Matthias Bluebaum wins this round-5 encounter at FIDE Grand Swiss 2025. The recorded opening is Queen's pawn.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/fidegrandsw25.pgn"
      },
      {
        "title": "The Week in Chess — FIDE Grand Swiss 2025",
        "url": "https://theweekinchess.com/chessnews/events/fide-grand-swiss-2025"
      }
    ]
  },
  {
    "id": "arjun-erigaisi-matthias-bluebaum-2025-fide-grand-swiss-2025-7-2",
    "title": "Arjun Erigaisi — Matthias Bluebaum: Grand Swiss 2025, round 7",
    "era": "Champions",
    "white": "Arjun Erigaisi",
    "black": "Matthias Bluebaum",
    "year": 2025,
    "event": "FIDE Grand Swiss 2025",
    "date": "2025.09.11",
    "result": "0-1",
    "expectedPlies": 102,
    "finalFen": "8/8/4p1p1/6k1/1p2Pq1b/5Q1K/1P2P3/8 w - - 11 52",
    "pgn": "[Event \"FIDE Grand Swiss 2025\"]\n[Site \"Samarkand UZB\"]\n[Date \"2025.09.11\"]\n[Round \"7.2\"]\n[White \"Arjun Erigaisi\"]\n[Black \"Matthias Bluebaum\"]\n[Result \"0-1\"]\n\n1. c4 e6 2. g3 d5 3. Bg2 Nf6 4. d4 Be7 5. Nf3 O-O 6. O-O dxc4 7. Qc2 c6\n8. Qxc4 b5 9. Qd3 Nbd7 10. Be3 Nd5 11. Bd2 Bb7 12. Nc3 b4 13. Ne4 Qb6 14. Qc2 c5\n15. Nfg5 g6 16. dxc5 Nxc5 17. Nxc5 Qxc5 18. Qb3 Rac8 19. Rac1 Qb5 20. Rxc8 Rxc8\n21. Qf3 Qe8 22. Qe4 Rc7 23. Qh4 h5 24. Qd4 Qd8 25. h4 Rd7 26. Qxa7 Ba8\n27. Nxe6 fxe6 28. Qa4 Nb6 29. Qc2 Kf7 30. Bh6 Bxg2 31. Kxg2 Qa8+ 32. Kg1 Qxa2\n33. Qc6 Qa5 34. Bg5 Qc5 35. Qf3+ Qf5 36. Qc6 Qc5 37. Qf3+ Kg7 38. Be3 Qd6\n39. g4 Nc4 40. gxh5 Nxe3 41. fxe3 Bxh4 42. Kg2 Qd5 43. e4 Qxh5 44. Qf8+ Kh7\n45. Rf7+ Rxf7 46. Qxf7+ Kh6 47. Qf8+ Kg5 48. Qc5+ Kg4 49. Qe3 Qe5 50. Qf3+ Kg5\n51. Kh3 Qf4 0-1",
    "summary": "Matthias Bluebaum wins this round-7 encounter at FIDE Grand Swiss 2025. The recorded opening is Catalan.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/fidegrandsw25.pgn"
      },
      {
        "title": "The Week in Chess — FIDE Grand Swiss 2025",
        "url": "https://theweekinchess.com/chessnews/events/fide-grand-swiss-2025"
      }
    ]
  },
  {
    "id": "yag-z-kaan-erdogmus-levon-aronian-2025-fide-grand-swiss-2025-8-11",
    "title": "Yağız Kaan Erdoğmuş — Levon Aronian: Grand Swiss 2025, round 8",
    "era": "Champions",
    "white": "Yağız Kaan Erdoğmuş",
    "black": "Levon Aronian",
    "year": 2025,
    "event": "FIDE Grand Swiss 2025",
    "date": "2025.09.12",
    "result": "1-0",
    "expectedPlies": 97,
    "finalFen": "8/2r2k2/1R1R2pp/1p6/6P1/2nP4/5P2/5K2 b - - 1 49",
    "pgn": "[Event \"FIDE Grand Swiss 2025\"]\n[Site \"Samarkand UZB\"]\n[Date \"2025.09.12\"]\n[Round \"8.11\"]\n[White \"Yağız Kaan Erdoğmuş\"]\n[Black \"Levon Aronian\"]\n[Result \"1-0\"]\n\n1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. e5 c5 5. Bd2 Ne7 6. a3 Bxc3 7. Bxc3 b6 8. h4 Ba6\n9. Bxa6 Nxa6 10. h5 h6 11. Nf3 Rc8 12. Qe2 Nb8 13. g4 Qd7 14. Bd2 cxd4\n15. Bb4 Rc4 16. Rg1 Na6 17. b3 d3 18. cxd3 Rc8 19. Bd6 Nc5 20. b4 Na4 21. Qd2 f6\n22. Nh4 O-O 23. Bxe7 Qxe7 24. Ng6 Qc7 25. Kf1 Rf7 26. Re1 Qc2 27. Re2 Qxd2\n28. Rxd2 Rc3 29. Kg2 Rxa3 30. Re1 Nc3 31. Rc2 d4 32. exf6 Rxf6 33. Re4 e5\n34. Rxe5 a5 35. Re8+ Kf7 36. Re7+ Kg8 37. bxa5 Rxa5 38. Re8+ Kf7 39. Re7+ Kg8\n40. Rd7 b5 41. Rxd4 Ra3 42. Rc1 Kh7 43. Rd8 Rxg6 44. hxg6+ Kxg6 45. Re1 Ra7\n46. Re6+ Kf7 47. Rb6 Rc7 48. Kf1 g6 49. Rdd6 1-0",
    "summary": "Yağız Kaan Erdoğmuş wins this round-8 encounter at FIDE Grand Swiss 2025. The recorded opening is French.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/fidegrandsw25.pgn"
      },
      {
        "title": "The Week in Chess — FIDE Grand Swiss 2025",
        "url": "https://theweekinchess.com/chessnews/events/fide-grand-swiss-2025"
      }
    ]
  },
  {
    "id": "anish-giri-jorden-van-foreest-2025-fide-grand-swiss-2025-9-4",
    "title": "Anish Giri — Jorden Van Foreest: Grand Swiss 2025, round 9",
    "era": "Champions",
    "white": "Anish Giri",
    "black": "Jorden Van Foreest",
    "year": 2025,
    "event": "FIDE Grand Swiss 2025",
    "date": "2025.09.13",
    "result": "1-0",
    "expectedPlies": 105,
    "finalFen": "8/8/2k5/K2nP1Bp/P6P/8/8/8 b - - 4 53",
    "pgn": "[Event \"FIDE Grand Swiss 2025\"]\n[Site \"Samarkand UZB\"]\n[Date \"2025.09.13\"]\n[Round \"9.4\"]\n[White \"Anish Giri\"]\n[Black \"Jorden Van Foreest\"]\n[Result \"1-0\"]\n\n1. Nf3 d5 2. d4 Nf6 3. c4 e6 4. g3 Be7 5. Bg2 O-O 6. Nc3 dxc4 7. Ne5 c5\n8. dxc5 Qxd1+ 9. Nxd1 Bxc5 10. O-O Nd5 11. Nxc4 Nc6 12. Nc3 Rd8 13. Re1 b6\n14. Ne3 Bxe3 15. Bxe3 Nce7 16. Nxd5 Nxd5 17. Bd2 Bb7 18. e4 Nf6 19. Bf4 Nd7\n20. b4 Nf8 21. Be3 Rac8 22. Rec1 e5 23. Rxc8 Rxc8 24. Rc1 Rxc1+ 25. Bxc1 Bc6\n26. f3 Bb5 27. Kf2 f6 28. f4 Ne6 29. fxe5 fxe5 30. Bb2 Nd4 31. Bf1 Bxf1\n32. Kxf1 Nc2 33. b5 Ne3+ 34. Ke2 Nc4 35. Bc3 Na3 36. Bxe5 Nxb5 37. Kd3 a6\n38. Bd4 Kf7 39. Bxb6 Ke6 40. a4 Nd6 41. Kd4 Nf7 42. Bc7 h5 43. h4 Kd7 44. Be5 g5\n45. Kd5 gxh4 46. gxh4 Nd8 47. Kc5 Nc6 48. Bf4 Na5 49. Kb6 Nc4+ 50. Kxa6 Kc6\n51. e5 Nb6 52. Ka5 Nd5 53. Bg5 1-0",
    "summary": "Anish Giri wins this round-9 encounter at FIDE Grand Swiss 2025. The recorded opening is Catalan.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/fidegrandsw25.pgn"
      },
      {
        "title": "The Week in Chess — FIDE Grand Swiss 2025",
        "url": "https://theweekinchess.com/chessnews/events/fide-grand-swiss-2025"
      }
    ]
  },
  {
    "id": "anish-giri-hans-moke-niemann-2025-fide-grand-swiss-2025-11-2",
    "title": "Anish Giri — Hans Moke Niemann: Grand Swiss 2025, round 11",
    "era": "Champions",
    "white": "Anish Giri",
    "black": "Hans Moke Niemann",
    "year": 2025,
    "event": "FIDE Grand Swiss 2025",
    "date": "2025.09.15",
    "result": "1-0",
    "expectedPlies": 91,
    "finalFen": "8/p2b1k2/7p/P3K3/7P/5P2/4B3/8 b - - 1 46",
    "pgn": "[Event \"FIDE Grand Swiss 2025\"]\n[Site \"Samarkand UZB\"]\n[Date \"2025.09.15\"]\n[Round \"11.2\"]\n[White \"Anish Giri\"]\n[Black \"Hans Moke Niemann\"]\n[Result \"1-0\"]\n\n1. c4 Nf6 2. Nc3 e5 3. Nf3 Nc6 4. e3 Bb4 5. Qc2 Bxc3 6. Qxc3 Qe7 7. a3 d5\n8. d4 exd4 9. Nxd4 Nxd4 10. Qxd4 c5 11. Qh4 Be6 12. cxd5 Nxd5 13. Bb5+ Bd7\n14. Qxe7+ Nxe7 15. Be2 Rc8 16. f3 f6 17. Kf2 Kf7 18. Rd1 Be6 19. h4 b6 20. e4 Nc6\n21. Be3 Na5 22. Rd6 Rhe8 23. g4 Nb7 24. Rd2 Na5 25. Rd6 Nb7 26. Rdd1 Na5\n27. Rac1 Ke7 28. Ba6 Rcd8 29. Rxd8 Rxd8 30. b4 Nb3 31. Rc3 Rd6 32. bxc5 bxc5\n33. Rxb3 Bxb3 34. Bxc5 Kd7 35. Bxd6 Kxd6 36. g5 Be6 37. Ke3 Kc5 38. Kf4 Kd4\n39. gxf6 gxf6 40. a4 h6 41. a5 Bd7 42. Be2 Kc5 43. e5 Kd5 44. exf6 Ke6\n45. f7 Kxf7 46. Ke5 1-0",
    "summary": "Anish Giri wins this round-11 encounter at FIDE Grand Swiss 2025. The recorded opening is English.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/fidegrandsw25.pgn"
      },
      {
        "title": "The Week in Chess — FIDE Grand Swiss 2025",
        "url": "https://theweekinchess.com/chessnews/events/fide-grand-swiss-2025"
      }
    ]
  },
  {
    "id": "alireza-firouzja-magnus-carlsen-2026-14th-norway-chess-2026-1-2",
    "title": "Alireza Firouzja — Magnus Carlsen: Norway Chess 2026, round 1",
    "era": "Champions",
    "white": "Alireza Firouzja",
    "black": "Magnus Carlsen",
    "year": 2026,
    "event": "14th Norway Chess 2026",
    "date": "2026.05.25",
    "result": "1-0",
    "expectedPlies": 75,
    "finalFen": "4r1k1/3q2p1/5p1p/1n2PP2/2pP4/2P2QB1/6PP/2R3K1 b - - 0 38",
    "pgn": "[Event \"14th Norway Chess 2026\"]\n[Site \"Oslo NOR\"]\n[Date \"2026.05.25\"]\n[Round \"1.2\"]\n[White \"Alireza Firouzja\"]\n[Black \"Magnus Carlsen\"]\n[Result \"1-0\"]\n\n1. d4 d5 2. c4 e6 3. Nf3 Nf6 4. Nc3 h6 5. a3 c5 6. cxd5 exd5 7. Bf4 Nc6 8. e3 a6\n9. Be2 c4 10. Ne5 Bd6 11. O-O O-O 12. Bg3 Bf5 13. f4 Be7 14. Bf3 Rc8 15. Rc1 b5\n16. Be1 b4 17. axb4 Bxb4 18. Bh4 Bxc3 19. bxc3 Qd6 20. Ra1 Ne4 21. Rxa6 f6\n22. Bxe4 Bxe4 23. Ng4 Qd7 24. Nf2 Ne7 25. Qe2 Rc6 26. Rxc6 Qxc6 27. Nxe4 dxe4\n28. Ra1 Nd5 29. Be1 Rb8 30. f5 Kh7 31. Qg4 Qd7 32. Qxe4 Re8 33. Qg4 Kg8\n34. e4 Ne3 35. Qf3 Nc2 36. Rc1 Na3 37. Bg3 Nb5 38. e5 1-0",
    "summary": "Alireza Firouzja wins this round-1 encounter at 14th Norway Chess 2026. The recorded opening is QGD.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/norway26.pgn"
      },
      {
        "title": "The Week in Chess — Norway Chess 2026",
        "url": "https://theweekinchess.com/chessnews/events/norway-chess-2026"
      }
    ]
  },
  {
    "id": "alireza-firouzja-r-praggnanandhaa-2026-14th-norway-chess-2026-2-1",
    "title": "Alireza Firouzja — R Praggnanandhaa: Norway Chess 2026, round 2",
    "era": "Champions",
    "white": "Alireza Firouzja",
    "black": "R Praggnanandhaa",
    "year": 2026,
    "event": "14th Norway Chess 2026",
    "date": "2026.05.26",
    "result": "1-0",
    "expectedPlies": 119,
    "finalFen": "5b2/8/p7/P5p1/2R2P1r/kP2P3/2KN4/8 b - - 0 60",
    "pgn": "[Event \"14th Norway Chess 2026\"]\n[Site \"Oslo NOR\"]\n[Date \"2026.05.26\"]\n[Round \"2.1\"]\n[White \"Alireza Firouzja\"]\n[Black \"R Praggnanandhaa\"]\n[Result \"1-0\"]\n\n1. d4 d5 2. c4 e6 3. Nf3 Nf6 4. Nc3 c6 5. Bg5 Nbd7 6. cxd5 exd5 7. e3 h6\n8. Bh4 g5 9. Bg3 Nh5 10. Bd3 Nxg3 11. hxg3 Bg7 12. Qc2 Nb6 13. O-O-O Be6\n14. Kb1 Qe7 15. Rc1 O-O-O 16. Na4 Kb8 17. Nc5 Rc8 18. Qb3 Rc7 19. Rc3 Ka8\n20. Rhc1 Nd7 21. Nxd7 Bxd7 22. a4 h5 23. Qc2 h4 24. gxh4 gxh4 25. Bf5 Bf6\n26. Bxd7 Rxd7 27. Ne1 Qe4 28. Qxe4 dxe4 29. Rc5 h3 30. gxh3 Rxh3 31. Rf5 Rd6\n32. Nc2 a6 33. Rg1 Ka7 34. Rg4 Re6 35. Nb4 Rh6 36. Na2 Rg6 37. Rxg6 fxg6\n38. Rf4 c5 39. dxc5 b6 40. Nb4 bxc5 41. Nd5 Bg5 42. Rg4 Bd8 43. Nc3 g5\n44. Nxe4 Re5 45. Kc2 Kb6 46. Kd3 Kc6 47. b3 Be7 48. Rg1 Rd5+ 49. Ke2 Kb6\n50. Nd2 Ka5 51. Rg4 Rd8 52. Re4 Bf8 53. Kd1 Rd6 54. Kc2 Rf6 55. Nc4+ Kb4\n56. f3 Rh6 57. Nd2+ Ka3 58. a5 Rh4 59. f4 c4 60. Rxc4 1-0",
    "summary": "Alireza Firouzja wins this round-2 encounter at 14th Norway Chess 2026. The recorded opening is QGD semi-Slav.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/norway26.pgn"
      },
      {
        "title": "The Week in Chess — Norway Chess 2026",
        "url": "https://theweekinchess.com/chessnews/events/norway-chess-2026"
      }
    ]
  },
  {
    "id": "r-praggnanandhaa-magnus-carlsen-2026-14th-norway-chess-2026-3-2",
    "title": "R Praggnanandhaa — Magnus Carlsen: Norway Chess 2026, round 3",
    "era": "Champions",
    "white": "R Praggnanandhaa",
    "black": "Magnus Carlsen",
    "year": 2026,
    "event": "14th Norway Chess 2026",
    "date": "2026.05.27",
    "result": "1-0",
    "expectedPlies": 92,
    "finalFen": "1R6/1bP2pk1/p3p3/4n2p/7P/8/BKP1n1p1/5R2 w - - 0 47",
    "pgn": "[Event \"14th Norway Chess 2026\"]\n[Site \"Oslo NOR\"]\n[Date \"2026.05.27\"]\n[Round \"3.2\"]\n[White \"R Praggnanandhaa\"]\n[Black \"Magnus Carlsen\"]\n[Result \"1-0\"]\n\n1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. h4 h6 7. Bc4 e6 8. a3 Nc6\n9. Be3 Bd7 10. Ba2 Be7 11. Qe2 h5 12. f3 Ne5 13. O-O-O Rc8 14. Bg5 Rxc3\n15. bxc3 Qa5 16. Kb1 Qxa3 17. f4 Neg4 18. e5 dxe5 19. fxe5 Nh7 20. Qd2 Nf8\n21. Nf3 Qc5 22. Bxe7 Qxe7 23. Ng5 Ng6 24. Ne4 N6xe5 25. Nd6+ Kf8 26. Rhf1 Nf6\n27. Qd4 Neg4 28. Nxb7 Bb5 29. Qd8+ Ne8 30. Qxe7+ Kxe7 31. c4 Ba4 32. Rd8 Bc6\n33. Rb8 Bxg2 34. Rg1 Bf3 35. Rg3 Ne5 36. c5 g5 37. Nd6 g4 38. Nc8+ Kf6\n39. Nd6 Nxd6 40. Rxh8 Ne4 41. Rg1 Nc3+ 42. Kb2 Ne2 43. Rf1 g3 44. c6 Kg7\n45. c7 Bb7 46. Rb8 g2 1-0",
    "summary": "R Praggnanandhaa wins this round-3 encounter at 14th Norway Chess 2026. The recorded opening is Sicilian.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/norway26.pgn"
      },
      {
        "title": "The Week in Chess — Norway Chess 2026",
        "url": "https://theweekinchess.com/chessnews/events/norway-chess-2026"
      }
    ]
  },
  {
    "id": "d-gukesh-magnus-carlsen-2026-14th-norway-chess-2026-4-2",
    "title": "D Gukesh — Magnus Carlsen: Norway Chess 2026, round 4",
    "era": "Champions",
    "white": "D Gukesh",
    "black": "Magnus Carlsen",
    "year": 2026,
    "event": "14th Norway Chess 2026",
    "date": "2026.05.28",
    "result": "0-1",
    "expectedPlies": 84,
    "finalFen": "5k2/1R6/4bp1p/8/p3B1P1/q4P2/7P/5N1K w - - 0 43",
    "pgn": "[Event \"14th Norway Chess 2026\"]\n[Site \"Oslo NOR\"]\n[Date \"2026.05.28\"]\n[Round \"4.2\"]\n[White \"D Gukesh\"]\n[Black \"Magnus Carlsen\"]\n[Result \"0-1\"]\n\n1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. cxd5 exd5 5. Bg5 Bb4 6. Nf3 Qd6 7. Nd2 c6\n8. Qc2 h6 9. Nb5 Qe7 10. Bxf6 gxf6 11. Nc3 Nd7 12. e3 Nb6 13. Bd3 Rg8 14. g3 Bh3\n15. a3 Bxc3 16. bxc3 Nc8 17. c4 dxc4 18. Qxc4 Nd6 19. Qb4 a5 20. Qc3 Rg5\n21. Be2 Rc8 22. f3 c5 23. Kf2 Rd5 24. Qb2 cxd4 25. exd4 Kf8 26. Rhe1 Be6\n27. Rad1 f5 28. Nf1 f4 29. Bd3 Qf6 30. Be4 Rb5 31. Qd2 Bb3 32. Rc1 Rxc1\n33. Qxc1 Qxd4+ 34. Kg2 Be6 35. Qxf4 Rb2+ 36. Kh1 Qf2 37. Qxd6+ Kg7 38. Qe5+ f6\n39. Qxb2 Qxb2 40. Rb1 Qxa3 41. Rxb7+ Kf8 42. g4 a4 0-1",
    "summary": "Magnus Carlsen wins this round-4 encounter at 14th Norway Chess 2026. The recorded opening is QGD.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/norway26.pgn"
      },
      {
        "title": "The Week in Chess — Norway Chess 2026",
        "url": "https://theweekinchess.com/chessnews/events/norway-chess-2026"
      }
    ]
  },
  {
    "id": "magnus-carlsen-wesley-so-2026-14th-norway-chess-2026-5-2",
    "title": "Magnus Carlsen — Wesley So: Norway Chess 2026, round 5",
    "era": "Champions",
    "white": "Magnus Carlsen",
    "black": "Wesley So",
    "year": 2026,
    "event": "14th Norway Chess 2026",
    "date": "2026.05.30",
    "result": "0-1",
    "expectedPlies": 116,
    "finalFen": "8/2p5/1p1p4/4k1P1/P1n5/1N6/2Kp4/8 w - - 1 59",
    "pgn": "[Event \"14th Norway Chess 2026\"]\n[Site \"Oslo NOR\"]\n[Date \"2026.05.30\"]\n[Round \"5.2\"]\n[White \"Magnus Carlsen\"]\n[Black \"Wesley So\"]\n[Result \"0-1\"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d3 Bc5 5. Bg5 h6 6. Bh4 d6 7. c3 a5 8. O-O O-O\n9. Nbd2 Ba7 10. a4 g5 11. Bg3 Kg7 12. Re1 g4 13. Nh4 Nh5 14. Nf1 Qg5 15. Ne3 Bxe3\n16. Rxe3 Nf4 17. Qe1 Be6 18. f3 h5 19. Bb5 Ne7 20. d4 f6 21. Rd1 Neg6 22. Rd2 Rf7\n23. Kh1 Kh7 24. d5 Bd7 25. Bxd7 Rxd7 26. Nf5 Ne7 27. Bh4 Qg6 28. Ng3 Qh6\n29. c4 Rf8 30. Rb3 Nfg6 31. Nf1 Nxh4 32. Qxh4 f5 33. Qe1 fxe4 34. Qxe4+ Ng6\n35. g3 Rdf7 36. Rf2 Qc1 37. Kg2 Rxf3 38. Rbxf3 gxf3+ 39. Rxf3 Qxb2+ 40. Kh3 Qd4\n41. Qxd4 exd4 42. Rxf8 Nxf8 43. Kg2 Nd7 44. Nd2 Ne5 45. h3 Kg6 46. Kf2 Kg5\n47. Kf1 Kf6 48. Kf2 Nd3+ 49. Ke2 Nb2 50. Nb3 Ke5 51. Nxa5 Ke4 52. g4 hxg4\n53. hxg4 d3+ 54. Kd2 b6 55. Nb3 Nxc4+ 56. Kc3 d2 57. Kc2 Kxd5 58. g5 Ke5 0-1",
    "summary": "Wesley So wins this round-5 encounter at 14th Norway Chess 2026. The recorded opening is Giuoco Pianissimo.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/norway26.pgn"
      },
      {
        "title": "The Week in Chess — Norway Chess 2026",
        "url": "https://theweekinchess.com/chessnews/events/norway-chess-2026"
      }
    ]
  },
  {
    "id": "r-praggnanandhaa-d-gukesh-2026-14th-norway-chess-2026-5-3",
    "title": "R Praggnanandhaa — D Gukesh: Norway Chess 2026, round 5",
    "era": "Champions",
    "white": "R Praggnanandhaa",
    "black": "D Gukesh",
    "year": 2026,
    "event": "14th Norway Chess 2026",
    "date": "2026.05.30",
    "result": "0-1",
    "expectedPlies": 94,
    "finalFen": "6r1/7k/2PR1p1p/1P5b/p7/P1N3q1/3Q1K2/2R5 w - - 3 48",
    "pgn": "[Event \"14th Norway Chess 2026\"]\n[Site \"Oslo NOR\"]\n[Date \"2026.05.30\"]\n[Round \"5.3\"]\n[White \"R Praggnanandhaa\"]\n[Black \"D Gukesh\"]\n[Result \"0-1\"]\n\n1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 Bb4 5. Qa4+ Nc6 6. Qc2 Bd6 7. Bg5 h6\n8. Bxf6 Qxf6 9. e3 O-O 10. c5 Be7 11. Bb5 Bd7 12. O-O Rfd8 13. h3 g6 14. a3 a6\n15. Bxc6 Bxc6 16. Ne5 Be8 17. f4 b6 18. b4 a5 19. Rfb1 Qg7 20. Qe2 Rdb8\n21. e4 dxe4 22. Nxe4 Ra7 23. Qe3 Qf8 24. Kh2 Kh7 25. b5 a4 26. c6 Rd8 27. Rd1 f6\n28. Nc4 Bf7 29. Qe2 Qg8 30. Rac1 Raa8 31. Rd2 Re8 32. Nc3 e5 33. d5 exf4\n34. Qf2 g5 35. Nxb6 cxb6 36. d6 Bf8 37. Qxb6 g4 38. hxg4 Qxg4 39. Qf2 Re3\n40. Rd4 Qh5+ 41. Kg1 Qe5 42. Qd2 f3 43. Kf2 Bxd6 44. Rxd6 Rg8 45. gxf3 Rxf3+\n46. Kxf3 Bh5+ 47. Kf2 Qg3+ 0-1",
    "summary": "D Gukesh wins this round-5 encounter at 14th Norway Chess 2026. The recorded opening is QGD.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/norway26.pgn"
      },
      {
        "title": "The Week in Chess — Norway Chess 2026",
        "url": "https://theweekinchess.com/chessnews/events/norway-chess-2026"
      }
    ]
  },
  {
    "id": "vincent-keymer-d-gukesh-2026-14th-norway-chess-2026-6-1",
    "title": "Vincent Keymer — D Gukesh: Norway Chess 2026, round 6",
    "era": "Champions",
    "white": "Vincent Keymer",
    "black": "D Gukesh",
    "year": 2026,
    "event": "14th Norway Chess 2026",
    "date": "2026.05.31",
    "result": "1-0",
    "expectedPlies": 103,
    "finalFen": "5k2/5pR1/5P1r/2bNP2p/8/5K1P/P7/8 b - - 0 52",
    "pgn": "[Event \"14th Norway Chess 2026\"]\n[Site \"Oslo NOR\"]\n[Date \"2026.05.31\"]\n[Round \"6.1\"]\n[White \"Vincent Keymer\"]\n[Black \"D Gukesh\"]\n[Result \"1-0\"]\n\n1. d4 Nf6 2. Nf3 d5 3. c3 e6 4. Bf4 c5 5. e3 Nc6 6. Nbd2 Be7 7. h3 Bd6\n8. dxc5 Bxc5 9. Bd3 O-O 10. O-O Re8 11. e4 e5 12. Bg5 d4 13. Nb3 Bd6\n14. cxd4 exd4 15. Nbxd4 Nxd4 16. Nxd4 h6 17. Be3 Be5 18. Nf3 Bxb2 19. Rb1 Ba3\n20. Qb3 Bf8 21. Bc4 Be6 22. Rfd1 Qc8 23. Bxe6 Rxe6 24. e5 Ne4 25. Rdc1 Nc5\n26. Bxc5 Bxc5 27. Qxb7 Qxb7 28. Rxb7 Rc8 29. Rc2 Rec6 30. Rd2 Rb6 31. Rbd7 Rb1+\n32. Kh2 Rf1 33. Kg3 Bb6 34. R7d3 Rc6 35. Nd4 Rg6+ 36. Kh2 Rg5 37. Re2 Rg6\n38. g3 Rc1 39. Kg2 Rc4 40. Nf5 Re6 41. f4 h5 42. Rd7 Rc3 43. Ne7+ Kf8 44. Nd5 Ke8\n45. Rxa7 Rxg3+ 46. Kxg3 Rg6+ 47. Kf3 Bxa7 48. Rc2 Bg1 49. f5 Rh6 50. Rg2 Bc5\n51. Rxg7 Kf8 52. f6 1-0",
    "summary": "Vincent Keymer wins this round-6 encounter at 14th Norway Chess 2026. The recorded opening is Queen's pawn game.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/norway26.pgn"
      },
      {
        "title": "The Week in Chess — Norway Chess 2026",
        "url": "https://theweekinchess.com/chessnews/events/norway-chess-2026"
      }
    ]
  },
  {
    "id": "magnus-carlsen-alireza-firouzja-2026-14th-norway-chess-2026-6-2",
    "title": "Magnus Carlsen — Alireza Firouzja: Norway Chess 2026, round 6",
    "era": "Champions",
    "white": "Magnus Carlsen",
    "black": "Alireza Firouzja",
    "year": 2026,
    "event": "14th Norway Chess 2026",
    "date": "2026.05.31",
    "result": "1-0",
    "expectedPlies": 109,
    "finalFen": "8/5k2/4pQ2/2P1P2K/8/6P1/2q5/8 b - - 2 55",
    "pgn": "[Event \"14th Norway Chess 2026\"]\n[Site \"Oslo NOR\"]\n[Date \"2026.05.31\"]\n[Round \"6.2\"]\n[White \"Magnus Carlsen\"]\n[Black \"Alireza Firouzja\"]\n[Result \"1-0\"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. Nc3 Be7 6. O-O b5 7. Bb3 O-O 8. d3 d6\n9. a3 Na5 10. Ba2 Be6 11. Bxe6 fxe6 12. b4 Nc6 13. Bd2 Qe8 14. Ne2 Nh5 15. c3 Qg6\n16. Ng3 Nf4 17. a4 Qf7 18. d4 g5 19. axb5 axb5 20. Rxa8 Rxa8 21. dxe5 dxe5\n22. Bxf4 exf4 23. Qd7 fxg3 24. Qxc6 gxf2+ 25. Kxf2 Rf8 26. Kg1 Bd6 27. Qxb5 g4\n28. Nd2 Bf4 29. g3 Be3+ 30. Kg2 Qg7 31. Qd3 Bb6 32. Rxf8+ Qxf8 33. Qe2 h5\n34. h3 Qg7 35. hxg4 hxg4 36. c4 c6 37. Nf1 Kf8 38. Nh2 Qc3 39. Nxg4 Qxb4\n40. Ne5 Qd6 41. Qh5 Ke7 42. Qh7+ Ke8 43. Qg8+ Ke7 44. Qg7+ Ke8 45. Kh3 Bd4\n46. Qh8+ Ke7 47. Nxc6+ Qxc6 48. Qxd4 Kf7 49. c5 Qb5 50. Kh4 Kg6 51. Qe5 Qc4\n52. Qg5+ Kf7 53. Kh5 Qc3 54. e5 Qc2 55. Qf6+ 1-0",
    "summary": "Magnus Carlsen wins this round-6 encounter at 14th Norway Chess 2026. The recorded opening is Ruy Lopez.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/norway26.pgn"
      },
      {
        "title": "The Week in Chess — Norway Chess 2026",
        "url": "https://theweekinchess.com/chessnews/events/norway-chess-2026"
      }
    ]
  },
  {
    "id": "wesley-so-r-praggnanandhaa-2026-14th-norway-chess-2026-6-3",
    "title": "Wesley So — R Praggnanandhaa: Norway Chess 2026, round 6",
    "era": "Champions",
    "white": "Wesley So",
    "black": "R Praggnanandhaa",
    "year": 2026,
    "event": "14th Norway Chess 2026",
    "date": "2026.05.31",
    "result": "1-0",
    "expectedPlies": 125,
    "finalFen": "8/8/2r5/2Pk4/3R2P1/3K4/8/8 b - - 4 63",
    "pgn": "[Event \"14th Norway Chess 2026\"]\n[Site \"Oslo NOR\"]\n[Date \"2026.05.31\"]\n[Round \"6.3\"]\n[White \"Wesley So\"]\n[Black \"R Praggnanandhaa\"]\n[Result \"1-0\"]\n\n1. d4 d5 2. c4 e6 3. Nc3 c6 4. e3 Nf6 5. Nf3 Nbd7 6. Be2 Bd6 7. O-O O-O 8. b3 Ne4\n9. Bb2 f5 10. g3 Qf6 11. a4 a5 12. Qc2 g5 13. Nxe4 fxe4 14. Nd2 Qh6 15. f3 exf3\n16. Rxf3 Rxf3 17. Bxf3 g4 18. Bxg4 Nf6 19. Bf3 Qxe3+ 20. Kg2 e5 21. cxd5 cxd5\n22. dxe5 Bxe5 23. Bxe5 Qxe5 24. Rc1 Bg4 25. Qc3 d4 26. Qc4+ Kh8 27. Qd3 Re8\n28. Nc4 Qh5 29. Bxg4 Qxg4 30. h3 Qh5 31. Rf1 Qd5+ 32. Qf3 d3 33. Qxd5 Nxd5\n34. Rd1 Nb4 35. Nxa5 b5 36. axb5 Rb8 37. Nc4 Rxb5 38. Kf2 Kg7 39. Ke3 Rg5\n40. Rg1 Rb5 41. Kd4 Rd5+ 42. Kc3 Na2+ 43. Kd2 Nb4 44. Ra1 Nc6 45. Ne3 Rd7\n46. Nf5+ Kf7 47. Ne3 Ne5 48. Rf1+ Ke6 49. Nc4 Nxc4+ 50. bxc4 Ke5 51. Rf3 Rd4\n52. Rf4 Rd7 53. Rf3 Rd4 54. Rf7 h6 55. Rf4 Rd6 56. c5 Rg6 57. Rg4 Rc6 58. Rc4 h5\n59. Kxd3 Rg6 60. g4 hxg4 61. hxg4 Rc6 62. Re4+ Kd5 63. Rd4+ 1-0",
    "summary": "Wesley So wins this round-6 encounter at 14th Norway Chess 2026. The recorded opening is QGD semi-Slav.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/norway26.pgn"
      },
      {
        "title": "The Week in Chess — Norway Chess 2026",
        "url": "https://theweekinchess.com/chessnews/events/norway-chess-2026"
      }
    ]
  },
  {
    "id": "alireza-firouzja-d-gukesh-2026-14th-norway-chess-2026-8-1",
    "title": "Alireza Firouzja — D Gukesh: Norway Chess 2026, round 8",
    "era": "Champions",
    "white": "Alireza Firouzja",
    "black": "D Gukesh",
    "year": 2026,
    "event": "14th Norway Chess 2026",
    "date": "2026.06.02",
    "result": "1-0",
    "expectedPlies": 121,
    "finalFen": "8/3r4/6P1/5R2/4k1Pp/8/6PK/8 b - - 2 61",
    "pgn": "[Event \"14th Norway Chess 2026\"]\n[Site \"Oslo NOR\"]\n[Date \"2026.06.02\"]\n[Round \"8.1\"]\n[White \"Alireza Firouzja\"]\n[Black \"D Gukesh\"]\n[Result \"1-0\"]\n\n1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 Bb4 5. cxd5 exd5 6. Bf4 Ne4 7. Rc1 Bf5\n8. e3 g5 9. Bg3 Bxc3+ 10. bxc3 h5 11. Qb3 O-O 12. Qxb7 c6 13. Qc7 Nd7\n14. Qxd8 Raxd8 15. Nd2 Nxg3 16. hxg3 Nf6 17. Nb3 Rb8 18. Be2 Kg7 19. Bd1 Rfc8\n20. O-O a5 21. Bc2 Bxc2 22. Rxc2 a4 23. Nc5 a3 24. Nb3 Ne4 25. c4 c5\n26. Rfc1 cxd4 27. exd4 dxc4 28. Rxc4 Rxc4 29. Rxc4 Kf6 30. Rc6+ Ke7 31. Kf1 Kd7\n32. Ra6 Rc8 33. Rxa3 Rc2 34. Nc5+ Nxc5 35. dxc5 Rxc5 36. Rd3+ Ke6 37. Re3+ Kd6\n38. a4 Kc6 39. Rf3 f5 40. Re3 Ra5 41. Ra3 Kc5 42. Ke2 Kb4 43. Ra1 Re5+\n44. Kd3 Rd5+ 45. Ke2 Re5+ 46. Kf1 Kb3 47. a5 Kb2 48. Ra4 Kb3 49. f4 Rd5\n50. Ra1 Kb2 51. Re1 Rxa5 52. Re5 Ra1+ 53. Kf2 Kc3 54. fxg5 Kd4 55. Rxf5 Ke4\n56. Rb5 Rd1 57. g4 h4 58. Rf5 Rd2+ 59. Kg1 Rd3 60. g6 Rd7 61. Kh2 1-0",
    "summary": "Alireza Firouzja wins this round-8 encounter at 14th Norway Chess 2026. The recorded opening is QGD.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/norway26.pgn"
      },
      {
        "title": "The Week in Chess — Norway Chess 2026",
        "url": "https://theweekinchess.com/chessnews/events/norway-chess-2026"
      }
    ]
  },
  {
    "id": "magnus-carlsen-d-gukesh-2026-14th-norway-chess-2026-10-2",
    "title": "Magnus Carlsen — D Gukesh: Norway Chess 2026, round 10",
    "era": "Champions",
    "white": "Magnus Carlsen",
    "black": "D Gukesh",
    "year": 2026,
    "event": "14th Norway Chess 2026",
    "date": "2026.06.05",
    "result": "1-0",
    "expectedPlies": 129,
    "finalFen": "8/2k5/6P1/4K2n/8/5B2/8/8 b - - 2 65",
    "pgn": "[Event \"14th Norway Chess 2026\"]\n[Site \"Oslo NOR\"]\n[Date \"2026.06.05\"]\n[Round \"10.2\"]\n[White \"Magnus Carlsen\"]\n[Black \"D Gukesh\"]\n[Result \"1-0\"]\n\n1. e4 c6 2. c4 d5 3. exd5 cxd5 4. cxd5 Nf6 5. Nc3 Nxd5 6. Nf3 Nc6 7. Bb5 e6\n8. O-O Be7 9. d4 O-O 10. Re1 Bd7 11. Bd3 Rc8 12. Nxd5 exd5 13. Ne5 Bf6 14. Bf4 g6\n15. Qb3 Na5 16. Qb4 Be6 17. Rad1 Re8 18. h3 Be7 19. Qa4 Qb6 20. Nd7 Bxd7\n21. Qxd7 Nc6 22. Qxd5 Red8 23. Qb5 Bf6 24. Qxb6 axb6 25. Be4 Rxd4 26. Rxd4 Nxd4\n27. Bxb7 Rc2 28. Bh6 Ne6 29. Rc1 Rxc1+ 30. Bxc1 Nc5 31. Bd5 Na4 32. Kf1 Nxb2\n33. Ke2 Kf8 34. Be3 Ke7 35. Kd2 Na4 36. Kd3 Be5 37. Bb3 Nc5+ 38. Kc4 f5\n39. Kb5 f4 40. Bd2 Kd7 41. Kxb6 Ne4 42. Bc1 Nxf2 43. Bd5 Bd4+ 44. Kb5 g5\n45. Kc4 Bb6 46. Bf3 Nh1 47. Bd2 Ng3 48. a4 Kc7 49. a5 Bf2 50. Kd5 h5 51. Bc3 Kb7\n52. Bf6 g4 53. hxg4 hxg4 54. Bxg4 Nf1 55. a6+ Ka7 56. Be2 Nd2 57. Bd4+ Bxd4\n58. Kxd4 f3 59. Bxf3 Kxa6 60. Bd5 Kb6 61. g4 Nf1 62. g5 Ng3 63. Ke5 Kc7\n64. g6 Nh5 65. Bf3 1-0",
    "summary": "Magnus Carlsen wins this round-10 encounter at 14th Norway Chess 2026. The recorded opening is Caro-Kann.",
    "sources": [
      {
        "title": "Archived PGN score (pinned source)",
        "url": "https://raw.githubusercontent.com/sundarm710/chess/7ac638fa420a42d6ab7e73caa027220c33a9b32f/data/raw/norway26.pgn"
      },
      {
        "title": "The Week in Chess — Norway Chess 2026",
        "url": "https://theweekinchess.com/chessnews/events/norway-chess-2026"
      }
    ]
  },
].sort((a,b)=>a.year-b.year);
