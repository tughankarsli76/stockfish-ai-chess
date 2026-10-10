"""Download the pinned 3/4-piece Syzygy set sequentially and verify SHA-256."""
import hashlib
from pathlib import Path
import urllib.request

folder = Path(__file__).resolve().parent.parent / 'tablebases/syzygy-3-4'
base = 'https://tablebase.lichess.ovh/tables/standard/'
for entry in (folder / 'SHA256SUMS').read_text().splitlines():
    expected, name = entry.split()
    target = folder / name
    if target.exists() and hashlib.sha256(target.read_bytes()).hexdigest() == expected:
        continue
    category = '3-4-5-wdl/' if name.endswith('.rtbw') else '3-4-5-dtz/'
    with urllib.request.urlopen(base + category + name, timeout=60) as response:
        data = response.read()
    if hashlib.sha256(data).hexdigest() != expected:
        raise RuntimeError('Checksum mismatch: ' + name)
    target.write_bytes(data)
    print(name, len(data), flush=True)
print('All 70 tablebase files verified.', flush=True)
