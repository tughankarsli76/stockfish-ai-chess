# Offline Syzygy tablebases

Complete 3- and 4-piece standard chess WDL (.rtbw) and DTZ (.rtbz) data:
70 files, including both kings in the piece count. Generated using Ronald de
Man's Syzygy tablebase format. The app uses these offline with Stockfish 18/19.

Download source: https://tablebase.lichess.ovh/tables/standard/
Published checksums: https://tablebase.lichess.ovh/tables/standard/sha256
Generator: https://github.com/syzygy1/tb

Run `python3 tools/download-tablebases.py` from the project root to restore
missing files. SHA256SUMS pins the complete set; downloads and iOS builds
verify every file. Five-piece data is not bundled. The iPhone app offers an optional verified download under Options > Engine > Tablebases; dist/tablebases-5.json pins its 220 files (979,611,840 bytes). Six-piece and larger files are excluded.
