"""Verify the immutable model inputs before compiling new native engines."""
from pathlib import Path
import hashlib
root = Path(__file__).resolve().parent.parent
inputs = {'cinder-0.6.1/lib/nnue/nnue.bin.zst': '8036a4da52ad5099824c211388e3e135680c806cc1b8f7d5b03831aa41ab2b7b', 'viridithas-20.0.0/viridithas.nnue.zst': '066c172e22c25ee3d3b4084ad44ff761426f906a9c536cabd0127d17413d0585', 'halogen-16.0.0/src/150521a9.nn': '150521a9957beb7fe90395dd5b134f75cde4e6dfc95e5d5fdee80031e7c7c9cb', 'clover-9.1/src/quantised.nnue': '605aa6d9cc676f299a81e048e3c4c4cca8c9899c977b2d49a7bb0c0de202b114', 'starzix-6.1/src/net.bin': '2ef2c339a0eb17a06d64b91d96a3b374750f58600a973d1521a12d1452320034'}
for relative, expected in inputs.items():
    path = root / 'engine' / relative
    if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
        raise RuntimeError('Engine model checksum mismatch: ' + relative)
print('Five pinned engine model inputs verified')
