#!/bin/sh
set -eu
CHESS_ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
CHESS_SCAN_ENV="$CHESS_ROOT/.cloud-cache/scan/venv"
CHESS_SCAN_STAMP="$CHESS_ROOT/.cloud-cache/scan/compiled/inputs.sha256"
CHESS_SCAN_DIGEST=$(cat "$CHESS_ROOT/ios/scan-model-inputs.json" "$CHESS_ROOT/ios/prepare-scan-models.py" "$CHESS_ROOT/ios/scan-model-requirements.txt" | shasum -a 256 | cut -d ' ' -f 1)
if [ -f "$CHESS_SCAN_STAMP" ] && [ "$(cat "$CHESS_SCAN_STAMP")" = "$CHESS_SCAN_DIGEST" ]; then
    exit 0
fi
if [ ! -x "$CHESS_SCAN_ENV/bin/python" ]; then
    "${CHESS_SCAN_PYTHON:-python3}" -m venv "$CHESS_SCAN_ENV"
    "$CHESS_SCAN_ENV/bin/pip" install -r "$CHESS_ROOT/ios/scan-model-requirements.txt"
fi
if [ -d "$CHESS_ROOT/.cloud-cache/scan/compiled" ]; then
    rm -rf "$CHESS_ROOT/.cloud-cache/scan/compiled"
fi
"$CHESS_SCAN_ENV/bin/python" "$CHESS_ROOT/ios/prepare-scan-models.py"
printf '%s\n' "$CHESS_SCAN_DIGEST" > "$CHESS_SCAN_STAMP"
