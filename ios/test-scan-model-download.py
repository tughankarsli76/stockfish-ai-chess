"""Exercise model download recovery without importing conversion dependencies."""
import ast
import hashlib
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

source = Path(__file__).with_name('prepare-scan-models.py')
function = next(n for n in ast.parse(source.read_text()).body
                if isinstance(n, ast.FunctionDef) and n.name == 'download')


class ModelDownloadTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.cache = Path(self.tmp.name)
        self.data = b'verified model bytes'
        self.digest = hashlib.sha256(self.data).hexdigest()
        scope = {'CACHE': self.cache, 'hashlib': hashlib, 'subprocess': subprocess}
        exec(compile(ast.Module(body=[function], type_ignores=[]), str(source), 'exec'), scope)
        self.download = scope['download']

    def test_verified_cache_needs_no_network(self):
        (self.cache / 'model.zip').write_bytes(self.data)
        with patch.object(subprocess, 'run') as run:
            self.assertEqual(self.download('model.zip', 'https://example.test/model', self.digest).read_bytes(), self.data)
        run.assert_not_called()

    def test_complete_download_is_verified_and_promoted(self):
        def transfer(args, check):
            self.assertTrue(check)
            self.assertIn('--retry-all-errors', args)
            self.assertEqual(args[args.index('--retry') + 1], '4')
            Path(args[args.index('--output') + 1]).write_bytes(self.data)
        with patch.object(subprocess, 'run', side_effect=transfer):
            result = self.download('model.zip', 'https://example.test/model', self.digest)
        self.assertEqual(result.read_bytes(), self.data)
        self.assertFalse((self.cache / 'model.zip.part').exists())

    def test_interrupted_transfer_does_not_replace_existing_file(self):
        (self.cache / 'model.zip').write_bytes(b'old incomplete cache')
        def transfer(args, check):
            Path(args[args.index('--output') + 1]).write_bytes(b'truncated')
            raise subprocess.CalledProcessError(18, args)
        with patch.object(subprocess, 'run', side_effect=transfer):
            with self.assertRaises(subprocess.CalledProcessError):
                self.download('model.zip', 'https://example.test/model', self.digest)
        self.assertEqual((self.cache / 'model.zip').read_bytes(), b'old incomplete cache')
        self.assertFalse((self.cache / 'model.zip.part').exists())

    def test_wrong_checksum_is_never_cached(self):
        def transfer(args, check):
            Path(args[args.index('--output') + 1]).write_bytes(b'wrong model')
        with patch.object(subprocess, 'run', side_effect=transfer):
            with self.assertRaisesRegex(RuntimeError, 'checksum mismatch'):
                self.download('model.zip', 'https://example.test/model', self.digest)
        self.assertFalse((self.cache / 'model.zip').exists())
        self.assertFalse((self.cache / 'model.zip.part').exists())


if __name__ == '__main__':
    unittest.main()
