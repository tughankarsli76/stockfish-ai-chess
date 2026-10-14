"""Verify pinned Karsli source/profile and generate native profile commands."""
from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parent.parent
engine=root/'engine/karsli-1.0'
manifest=json.loads((engine/'IOS-SOURCE-MANIFEST.json').read_text())
for name,expected in manifest['iOSSourceFiles'].items():
    if hashlib.sha256((engine/name).read_bytes()).hexdigest()!=expected:
        raise RuntimeError('Karsli corresponding-source mismatch: '+name)
for name,expected in manifest.get('additionalNoticeFiles',{}).items():
    if hashlib.sha256((engine/name).read_bytes()).hexdigest()!=expected:
        raise RuntimeError('Karsli retained-notice mismatch: '+name)
profile_path=engine/'combined-profile.json'
if hashlib.sha256(profile_path.read_bytes()).hexdigest()!=manifest['profileSHA256']:
    raise RuntimeError('Karsli profile checksum mismatch')
profile=json.loads(profile_path.read_text())
commands=[]
for name,value in profile.items():
    if not name.startswith('Karsli ') or '\n' in name or not isinstance(value,(bool,int)):
        raise ValueError('Invalid research profile option')
    commands.append('setoption name '+name+' value '+(str(value).lower() if isinstance(value,bool) else str(value)))
content='// Generated from engine/karsli-1.0/combined-profile.json; GPL-3.0-only.\n#pragma once\nstruct KarsliIOSSetting { const char *name; const char *command; };\ninline constexpr KarsliIOSSetting KarsliIOSProfile[] = {\n'+''.join('    {'+json.dumps(name)+', '+json.dumps(command)+'},\n' for name,command in zip(profile,commands))+'};\ninline constexpr const char *KarsliIOSProfileSHA256 = '+json.dumps(manifest['profileSHA256'])+';\n'
target=root/'ios/StockfishChess/KarsliProfile.h'
if not target.exists() or target.read_text()!=content:target.write_text(content)
print('Verified Karsli source revision '+str(manifest.get('integration',{}).get('revision',manifest['researchRevision']))+' and '+str(len(commands))+' unchanged native profile options.')
