#!/usr/bin/env python3
"""Restore just the shared, checksum-pinned Karsli/Stockfish network."""
import hashlib
import json
from pathlib import Path
import subprocess

root = Path(__file__).resolve().parents[2]
name = 'nn-1a298aa575a0.nnue'
spec = json.loads((root / 'ios/ci_scripts/model-inputs.json').read_text())
row = next(r for r in spec['files'] if r['path'] == 'engine/stockfish-progress/' + name)
destination = root / row['path']

def valid(path):
    if not path.is_file() or path.stat().st_size != row['bytes']:
        return False
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(block)
    return digest.hexdigest() == row['sha256']

if not valid(destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix('.download')
    try:
        subprocess.run(['curl', '--fail', '--location', '--retry', '3', '--max-time', '300',
                        '--output', str(temporary), 'https://tests.stockfishchess.org/api/nn/' + name], check=True)
        if not valid(temporary):
            raise RuntimeError('Network size or SHA-256 mismatch; refusing to use downloaded data')
        temporary.replace(destination)
    finally:
        temporary.unlink(missing_ok=True)
print('Verified shared Karsli network: ' + row['sha256'])
