"""Restore large, pinned model inputs without storing them in Git history."""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tarfile

root = Path(__file__).resolve().parents[2]
spec = json.loads(Path(__file__).with_name('model-inputs.json').read_text())

def digest(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()

missing = []
for row in spec['files']:
    relative = Path(row['path'])
    if relative.is_absolute() or '..' in relative.parts or relative.parts[0] != 'engine':
        raise ValueError('Invalid model path')
    path = root / relative
    if not path.is_file() or path.stat().st_size != row['bytes'] or digest(path) != row['sha256']:
        missing.append(row)
if missing:
    cache = root / '.cloud-cache'
    cache.mkdir(exist_ok=True)
    archive = Path(os.environ.get('CHESS_SOURCE_ARCHIVE', cache / 'build21-source.tar.gz'))
    if not archive.is_file():
        subprocess.run(['curl', '--fail', '--location', '--retry', '3', '--output',
                        str(archive), spec['archiveURL']], check=True)
    if digest(archive) != spec['archiveSHA256']:
        raise RuntimeError('Source archive checksum mismatch; remove cached archive before retrying')
    with tarfile.open(archive, 'r:gz') as source:
        for row in missing:
            member = source.getmember('Stockfish-AI-Chess/' + row['path'])
            if not member.isfile() or member.size != row['bytes']:
                raise RuntimeError('Invalid model archive member: ' + row['path'])
            destination = root / row['path']
            destination.parent.mkdir(parents=True, exist_ok=True)
            with source.extractfile(member) as inp, destination.open('wb') as out:
                shutil.copyfileobj(inp, out)
            if digest(destination) != row['sha256']:
                raise RuntimeError('Model checksum mismatch: ' + row['path'])
print(f"Verified {len(spec['files'])} pinned model inputs")
