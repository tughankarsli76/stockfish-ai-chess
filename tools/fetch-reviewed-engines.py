"""Fetch pinned public source inputs only; never execute downloaded files."""
from pathlib import Path, PurePosixPath
import hashlib, io, json, tarfile, urllib.request

root = Path(__file__).resolve().parent.parent
inputs = [
    ('cinder-0.6.1', 'brunocodutra/cinder', 'f5d8b06701b059561e70bfb5dfbc98f65d910131'),
    ('viridithas-20.0.0', 'cosmobobak/viridithas', '0631113e2215714c54d397cce9a8caebc5e6f8ee'),
    ('halogen-16.0.0', 'KierenP/Halogen', 'fa6d24a5423a20b4530723cd0f6f76d4da0581d8'),
    ('clover-9.1', 'lucametehau/CloverEngine', 'e647926a8f23b6b93f7f27c01cb6f686909ec482'),
    ('starzix-6.1', 'zzzzz151/Starzix', 'cb3bc13cc651f73db56ad4a714ed2765dcc901c0'),
]

def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'Stockfish-AI-Chess-source-audit'})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()

records = []
for name, repo, commit in inputs:
    destination = root / 'engine' / name
    if destination.exists():
        print(f'{name}: existing source preserved', flush=True)
        continue
    url = f'https://codeload.github.com/{repo}/tar.gz/{commit}'
    archive = fetch(url)
    destination.mkdir()
    with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as tar:
        for member in tar.getmembers():
            parts = PurePosixPath(member.name).parts[1:]
            if not parts:
                continue
            if any(part in ('..', '/') for part in parts) or member.issym() or member.islnk():
                raise RuntimeError(f'Unsafe archive entry: {member.name}')
            output = destination.joinpath(*parts)
            if member.isdir():
                output.mkdir(parents=True, exist_ok=True)
            elif member.isfile():
                output.parent.mkdir(parents=True, exist_ok=True)
                output.write_bytes(tar.extractfile(member).read())
            else:
                raise RuntimeError(f'Unsupported archive entry: {member.name}')
    record = {'repository': f'https://github.com/{repo}', 'commit': commit,
              'archiveURL': url, 'archiveSHA256': hashlib.sha256(archive).hexdigest()}
    (destination / 'UPSTREAM.json').write_text(json.dumps(record, indent=2) + '\n')
    records.append(record)
    print(f'{name}: source pinned to {commit}', flush=True)

networks = [
    ('viridithas-20.0.0/viridithas.nnue.zst', 'https://github.com/cosmobobak/viridithas-networks/releases/download/v109/sandhi-s2-b200.nnue.zst'),
    ('halogen-16.0.0/src/150521a9.nn', 'https://github.com/KierenP/Halogen-Networks/releases/download/150521a9/150521a9.nn'),
]
for relative, url in networks:
    destination = root / 'engine' / relative
    if destination.exists():
        print(f'{relative}: existing input preserved', flush=True)
        continue
    data = fetch(url)
    destination.write_bytes(data)
    print(f'{relative}: {len(data)} bytes, sha256 {hashlib.sha256(data).hexdigest()}', flush=True)

license_path = root / 'engine/viridithas-20.0.0/network-LICENSE-CC0.txt'
license_path.write_bytes(fetch('https://raw.githubusercontent.com/cosmobobak/viridithas-networks/main/LICENSE'))
halogen_license = root / 'engine/halogen-16.0.0/network-LICENSE-GPL3.txt'
halogen_license.write_bytes(fetch('https://raw.githubusercontent.com/KierenP/Halogen-Networks/master/LICENSE'))
for name, relative in [('clover-9.1', 'src/incbin-UNLICENSE.txt'), ('starzix-6.1', 'src/3rdparty/incbin-UNLICENSE.txt')]:
    (root / 'engine' / name / relative).write_bytes(fetch('https://raw.githubusercontent.com/graphitemaster/incbin/main/UNLICENSE'))
