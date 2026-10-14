#!/usr/bin/env python3
"""Restore just the shared, checksum-pinned Karsli/Stockfish network."""
import hashlib
import json
from pathlib import Path
import subprocess
import shutil
import tarfile

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
        try:
            subprocess.run(['curl', '--fail', '--location', '--retry', '3', '--max-time', '300',
                            '--output', str(temporary), 'https://tests.stockfishchess.org/api/nn/' + name], check=True)
        except subprocess.CalledProcessError:
            # Package-manager-only cloud policies may not allow the primary host.
            # Use the existing immutable app source asset, verifying BOTH archive and model.
            print('Primary network download unavailable; using pinned release source archive.', flush=True)
            cache = root / '.cloud-cache'
            cache.mkdir(exist_ok=True)
            archive = cache / 'build21-source.tar.gz'
            if not archive.is_file():
                archive_temp = archive.with_suffix('.download')
                try:
                    subprocess.run(['curl', '--fail', '--location', '--retry', '3', '--max-time', '600',
                                    '--output', str(archive_temp), spec['archiveURL']], check=True)
                    archive_temp.replace(archive)
                finally:
                    archive_temp.unlink(missing_ok=True)
            digest = hashlib.sha256()
            with archive.open('rb') as stream:
                for block in iter(lambda: stream.read(1024 * 1024), b''):
                    digest.update(block)
            if digest.hexdigest() != spec['archiveSHA256']:
                raise RuntimeError('Pinned source archive SHA-256 mismatch; refusing restoration')
            with tarfile.open(archive, 'r:gz') as source:
                member = source.getmember('Stockfish-AI-Chess/' + row['path'])
                if not member.isfile() or member.size != row['bytes']:
                    raise RuntimeError('Invalid pinned network archive member')
                with source.extractfile(member) as incoming, temporary.open('wb') as outgoing:
                    shutil.copyfileobj(incoming, outgoing)
        if not valid(temporary):
            raise RuntimeError('Network size or SHA-256 mismatch; refusing to use downloaded data')
        temporary.replace(destination)
    finally:
        temporary.unlink(missing_ok=True)
print('Verified shared Karsli network: ' + row['sha256'])
