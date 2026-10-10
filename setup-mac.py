"""Build the included Stockfish source for the Mac preview, not for iOS."""
import hashlib
import platform
from pathlib import Path
import shutil
import subprocess
import sys

def main():
    if platform.system() != 'Darwin' or platform.machine() != 'arm64':
        sys.exit('Run this helper on an Apple Silicon Mac, in a native Terminal (not Rosetta).')
    check = subprocess.run(['xcrun', '--find', 'clang++'], capture_output=True, text=True)
    if check.returncode:
        sys.exit('Install and open Xcode first, complete its setup, then try again. See START-HERE.md.')
    root = Path(__file__).resolve().parent
    engine = root / 'engine/stockfish-progress'
    network = engine / 'nn-1a298aa575a0.nnue'
    if hashlib.sha256(network.read_bytes()).hexdigest()[:12] != '1a298aa575a0':
        sys.exit('The included neural network failed verification. Extract the package again.')
    shutil.copy2(network, engine / 'src' / network.name)
    subprocess.run(['make', 'clean'], cwd=engine / 'src', check=True)
    subprocess.run(['make', '-j2', 'build', 'ARCH=apple-silicon', 'COMP=clang'], cwd=engine / 'src', check=True)
    target = engine / 'stockfish'
    shutil.copy2(engine / 'src/stockfish', target)
    target.chmod(0o755)
    subprocess.run([sys.executable, str(root / 'verify-engine.py')], cwd=root, check=True)
    print('\nMac engine ready. Start the preview with: python3 server.py')

if __name__ == '__main__':
    main()
