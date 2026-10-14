"""Checksum and archive fallback regressions; no external network or real models."""
import hashlib
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tarfile
import tempfile
import unittest

SCRIPT = Path(__file__).with_name('restore-network.py')
NAME = 'nn-1a298aa575a0.nnue'

class RestoreNetworkTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        script = self.root / 'experiments/karsli/restore-network.py'
        script.parent.mkdir(parents=True)
        shutil.copy2(SCRIPT, script)
        self.script = script
        self.payload = b'pinned-test-network'
        self.destination = self.root / 'engine/stockfish-progress' / NAME
        archive = self.root / 'source.tar.gz'
        with tarfile.open(archive, 'w:gz') as out:
            for name, payload in [('Stockfish-AI-Chess/engine/stockfish-progress/' + NAME, self.payload), ('../must-not-extract', b'other')]:
                member = tarfile.TarInfo(name)
                member.size = len(payload)
                out.addfile(member, io.BytesIO(payload))
        self.spec = {'archiveURL': 'https://github.com/example/pinned.tar.gz',
                     'archiveSHA256': hashlib.sha256(archive.read_bytes()).hexdigest(),
                     'files': [{'path': 'engine/stockfish-progress/' + NAME,
                                'bytes': len(self.payload),
                                'sha256': hashlib.sha256(self.payload).hexdigest()}]}
        self.metadata = self.root / 'ios/ci_scripts/model-inputs.json'
        self.metadata.parent.mkdir(parents=True)
        self.metadata.write_text(json.dumps(self.spec))
        bin_dir = self.root / 'bin'
        bin_dir.mkdir()
        stub = bin_dir / 'curl'
        stub.write_text('#!' + sys.executable + '\n' + "import os,sys,shutil\nfrom pathlib import Path\nargs=sys.argv[1:];out=Path(args[args.index('--output')+1])\nif 'tests.stockfishchess.org' in args[-1]:\n if os.environ.get('TEST_DIRECT')=='corrupt':out.write_bytes(b'corrupt');sys.exit(0)\n sys.exit(22)\nshutil.copyfile(os.environ['TEST_ARCHIVE'],out)\n")
        stub.chmod(0o755)
        self.env = {**os.environ, 'PATH': str(bin_dir) + os.pathsep + os.environ['PATH'], 'TEST_ARCHIVE': str(archive)}

    def tearDown(self):
        self.tmp.cleanup()

    def run_restore(self):
        return subprocess.run([sys.executable, str(self.script)], env=self.env, capture_output=True, text=True)

    def test_verified_cache_needs_no_download(self):
        self.destination.parent.mkdir(parents=True)
        self.destination.write_bytes(self.payload)
        result = self.run_restore()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertNotIn('fallback', result.stdout)

    def test_primary_failure_uses_verified_single_member(self):
        result = self.run_restore()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.destination.read_bytes(), self.payload)
        self.assertFalse((self.root / 'must-not-extract').exists())
        self.assertFalse((self.root.parent / 'must-not-extract').exists())

    def test_bad_archive_digest_is_rejected(self):
        self.spec['archiveSHA256'] = '0' * 64
        self.metadata.write_text(json.dumps(self.spec))
        result = self.run_restore()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('source archive SHA-256 mismatch', result.stderr)
        self.assertFalse(self.destination.exists())

    def test_corrupt_primary_payload_does_not_get_accepted(self):
        self.env['TEST_DIRECT'] = 'corrupt'
        result = self.run_restore()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Network size or SHA-256 mismatch', result.stderr)
        self.assertFalse(self.destination.exists())
        self.assertFalse(self.destination.with_suffix('.download').exists())

if __name__ == '__main__':
    unittest.main()
