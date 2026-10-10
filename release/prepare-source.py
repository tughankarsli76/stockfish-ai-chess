"""Build a private source-distribution candidate; does not publish or grant licenses."""
from pathlib import Path
import argparse,tarfile,hashlib,json,re
root=Path(__file__).resolve().parent.parent
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output-dir',type=Path,help='Use a separate directory for this release snapshot.')
parser.add_argument('--version',default='1.1')
parser.add_argument('--build',type=int,help='Build number used in the archive filename.')
args=parser.parse_args()
if not re.fullmatch(r'\d+(?:\.\d+)*',args.version):parser.error('version must contain dotted decimal numbers')
if args.build is not None and args.build<1:parser.error('build must be positive')
paths=['SOURCE-BUILD.md','LICENSE','LICENSING.md','docs/HISTORICAL-GAMES-SOURCES.md','release/APP-STORE-LICENSE-REVIEW.md','release/prepare-source.py','dist','tools/opening-book','engine/stockfish-progress','engine/stockfish-19/stockfish/Copying.txt','engine/stockfish-19/stockfish/AUTHORS','engine/reckless-0.9.0','engine/plentychess-8.0.0','engine/pawnocchio-2.0.1-src','engine/Obsidian-16.0','engine/cinder-0.6.1','engine/viridithas-20.0.0','engine/halogen-16.0.0','engine/clover-9.1','engine/starzix-6.1','engine/ios-rust-engines','engine/simde-0.8.2/simde','engine/simde-0.8.2/COPYING','ios/StockfishChess','ios/StockfishChessTests','ios/StockfishChessUITests','ios/generate-project.py','ios/bundle-web.py','ios/bundle-background.py','tools/download-tablebases.py','tablebases/syzygy-3-4','ios/build-reckless.sh','ios/build-rust-engines.sh','ios/prepare-cpp-engines.py','ios/prepare-halogen-network.py','ios/verify-new-engine-inputs.py','ios/test-viridithas-neon.sh','tools/fetch-reviewed-engines.py','tools/import-lichess-move-sound.py','release/reports/ten-engine-license-audit.json','ios/build-pawnocchio.sh','ios/README.md','tests','package.json','server.py','setup-mac.py','verify-engine.py','release/LICENSING-REVIEW.md','release/PRIVACY-AND-API-AUDIT.md']
excluded={'.git','.zig-cache','zig-out','target','__pycache__','node_modules','xcuserdata','.DS_Store'}
# Cargo validates the original vendored package checksums, including platform
# import libraries, test fixtures and source directories named "target".
vendor_inputs=set()
for checksum in (root/'engine/ios-rust-engines/vendor').glob('*/.cargo-checksum.json'):
 for name,expected in json.loads(checksum.read_text())['files'].items():
  f=checksum.parent/name
  if not f.is_file() or hashlib.sha256(f.read_bytes()).hexdigest()!=expected:
   raise RuntimeError('Vendored input checksum mismatch: '+str(f.relative_to(root)))
  vendor_inputs.add(f)
files=[]
for name in paths:
 p=root/name
 if not p.exists():raise RuntimeError('Missing required source/input: '+name)
 for f in (p.rglob('*') if p.is_dir() else [p]):
  if not f.is_file():continue
  if f not in vendor_inputs:
   if any(part in excluded or part.endswith('.dSYM') for part in f.relative_to(root).parts):continue
   if f.suffix in {'.o','.a','.exe','.dll','.dylib','.pdb','.pyc'} or f.name in {'stockfish','process_net','Obsidian','dependency-metadata.json'}:continue
  if f.suffix in {'.p8','.p12','.mobileprovision','.pem','.key'} or f.name=='.env':
   raise RuntimeError('Private credential-like file in source allowlist: '+str(f.relative_to(root)))
  if f.is_symlink() and not f.resolve().is_relative_to(root):
   raise RuntimeError('Source symlink leaves project: '+str(f.relative_to(root)))
  if f.name.startswith('stockfish-18-lite-single') or f.name=='Stockfish18Backend.cpp':continue
  files.append(f)
manifest=[{'path':str(f.relative_to(root)),'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()} for f in sorted(set(files))]
output_dir=args.output_dir or root/'release'
output_dir.mkdir(parents=True,exist_ok=True)
archive_name=f'Stockfish-AI-Chess-{args.version}-build{args.build}-source.tar.gz' if args.build is not None else f'version-{args.version}-source-candidate.tar.gz'
manifest_name='source-manifest.json' if args.output_dir else f'version-{args.version}-source-manifest.json'
out=output_dir/archive_name
with tarfile.open(out,'w:gz',compresslevel=2) as archive:
 for row in manifest:archive.add(root/row['path'],arcname='Stockfish-AI-Chess/'+row['path'],recursive=False)
(output_dir/manifest_name).write_text(json.dumps(manifest,indent=2)+'\n')
print(f'{len(manifest)} source/input files; {out.stat().st_size} archive bytes. PRIVATE CANDIDATE, version {args.version}; publication not performed.')
