"""Verify original Lichess move/capture files; use --fetch to restore pinned copies."""
import argparse
import hashlib
import json
from pathlib import Path
import urllib.request


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--fetch', action='store_true', help='Download the pinned upstream copies')
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent / 'dist/assets/audio'
    manifest = json.loads((root / 'lichess-source.json').read_text())
    base = f"https://raw.githubusercontent.com/lichess-org/mobile/{manifest['commit']}/"
    for entry in manifest['files']:
        target = root / entry['file']
        if args.fetch:
            request = urllib.request.Request(base + entry['upstreamPath'], headers={'User-Agent': 'Stockfish-AI-Chess'})
            with urllib.request.urlopen(request, timeout=30) as response:
                data = response.read()
        else:
            data = target.read_bytes()
        if len(data) != entry['bytes'] or hashlib.sha256(data).hexdigest() != entry['sha256']:
            raise RuntimeError('Lichess source checksum mismatch: ' + entry['file'])
        if args.fetch:
            target.write_bytes(data)
        print(entry['file'] + ': matches pinned Lichess source')


if __name__ == '__main__':
    main()
