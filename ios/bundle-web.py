"""Bundle web assets and corresponding engine source/license for offline use."""
import os,shutil,hashlib,subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
out=Path(os.environ['TARGET_BUILD_DIR'])/os.environ['UNLOCALIZED_RESOURCES_FOLDER_PATH']
tablebases=root/'tablebases/syzygy-3-4'
for line in (tablebases/'SHA256SUMS').read_text().splitlines():
 expected,name=line.split()
 if hashlib.sha256((tablebases/name).read_bytes()).hexdigest()!=expected:
  raise RuntimeError('Tablebase checksum mismatch: '+name)
shutil.copytree(tablebases,out/'Tablebases',dirs_exist_ok=True)
if (out/'Web').exists():shutil.rmtree(out/'Web')
shutil.copytree(root/'dist',out/'Web',dirs_exist_ok=True,ignore=shutil.ignore_patterns('stockfish-18-lite-single*'))
# Link each distributed app to the source revision used by its build, rather
# than a historical source archive or a branch that changes after delivery.
try:
 revision=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True,stderr=subprocess.DEVNULL).strip()
except (OSError,subprocess.CalledProcessError):
 revision=None
if revision:
 release_info=out/'Web/release-info.js'
 release_info.write_text(release_info.read_text().replace(
  'https://github.com/tughankarsli76/stockfish-ai-chess/tree/develop',
  'https://github.com/tughankarsli76/stockfish-ai-chess/tree/'+revision))
licenses=out/'Licenses'
if licenses.exists():shutil.rmtree(licenses)
licenses.mkdir()
engine=root/'engine/stockfish-progress'
shutil.copytree(engine/'src',licenses/'Stockfish19Source',dirs_exist_ok=True,ignore=shutil.ignore_patterns('*.o','stockfish','*.nnue','*.exe'))
for p in (root/'engine/stockfish-19/stockfish').glob('*'):
 if p.name in ['Copying.txt','AUTHORS','README.md']:shutil.copy2(p,licenses/p.name)
shutil.copytree(root/'ios/StockfishChess',licenses/'IOSIntegration',dirs_exist_ok=True,ignore=shutil.ignore_patterns('Assets.xcassets','Stockfish18Backend.cpp'))
# Keep the exact source metadata as text without declaring a nested app bundle.
# App Store validation interprets files named Info.plist as bundle manifests.
(licenses/'IOSIntegration/Info.plist').rename(licenses/'IOSIntegration/Info.plist.source')
reckless=root/'engine/reckless-0.9.0'
shutil.copytree(reckless,licenses/'Reckless090Source',dirs_exist_ok=True,ignore=shutil.ignore_patterns('target','.git','networks'))
shutil.copytree(root/'engine/plentychess-8.0.0',licenses/'PlentyChess800Source',dirs_exist_ok=True,ignore=shutil.ignore_patterns('*.bin','*.o','process_net','*.dSYM','.git'))
shutil.copytree(root/'engine/pawnocchio-2.0.1-src',licenses/'Pawnocchio201Source',dirs_exist_ok=True,ignore=shutil.ignore_patterns('.zig-cache','zig-out','.git','pawnocchio-nets','assets'))
pawn_network_notices=licenses/'Pawnocchio201Source/pawnocchio-nets'
pawn_network_notices.mkdir(parents=True,exist_ok=True)
for name in ['LICENSE','NOTICE.txt']:
 shutil.copy2(root/'engine/pawnocchio-2.0.1-src/pawnocchio-nets'/name,pawn_network_notices/name)
shutil.copytree(root/'engine/Obsidian-16.0',licenses/'Obsidian160Source',dirs_exist_ok=True,ignore=shutil.ignore_patterns('*.bin','*.o','Obsidian','.git'))
for name in ['cinder-0.6.1','viridithas-20.0.0','halogen-16.0.0','clover-9.1','starzix-6.1','ios-rust-engines']:
 ignored=['target','.git','*.o','*.dSYM','dependency-metadata.json']
 if name=='ios-rust-engines':ignored.extend(['*.a','*.dll','*.exe','*.pdb'])
 shutil.copytree(root/'engine'/name,licenses/'NewEngineSources'/name,dirs_exist_ok=True,ignore=shutil.ignore_patterns(*ignored))
shutil.copytree(root/'engine/simde-0.8.2/simde',licenses/'simde-0.8.2/simde',dirs_exist_ok=True)
shutil.copy2(root/'engine/simde-0.8.2/COPYING',licenses/'simde-0.8.2/COPYING')
for name in ['generate-project.py','bundle-web.py','build-reckless.sh','build-rust-engines.sh','build-pawnocchio.sh','bundle-background.py','prepare-cpp-engines.py','prepare-halogen-network.py','test-viridithas-neon.sh','verify-new-engine-inputs.py']:
 shutil.copy2(root/'ios'/name,licenses/name)

startup_baseline=out/'startup-book-baseline.js'
if startup_baseline.exists():startup_baseline.unlink()
if os.environ.get('CONFIGURATION')=='Debug':
 shutil.copy2(root/'ios/StockfishChessTests/ios-integration-tests.js',out/'Web/ios-integration-tests.js')
 if os.environ.get('CHESS_STARTUP_BENCHMARK')=='1' and '.corebench.' in os.environ.get('PRODUCT_BUNDLE_IDENTIFIER',''):
  shutil.copy2(root/'ios/benchmarks/startup-baseline/elite-book-data.js',startup_baseline)
