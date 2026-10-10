"""Stream downloaded monthly Elite ZIPs through the two-pass C++ aggregator."""
from pathlib import Path
import subprocess, zipfile, shutil

root = Path(__file__).resolve().parents[2]
work = root / 'release/book-work'
for mode in ['count', 'collect']:
    print('PASS', mode, flush=True)
    process = subprocess.Popen([str(work/'aggregate'), mode, str(work/'counts.bin'),
                                str(work/'candidates.tsv')], stdin=subprocess.PIPE)
    try:
        for path in sorted(work.glob('lichess_elite_2025-*.zip')):
            print('Reading', path.name, flush=True)
            with zipfile.ZipFile(path) as archive:
                names = [name for name in archive.namelist() if name.endswith('.pgn')]
                assert len(names) == 1
                with archive.open(names[0]) as stream:
                    shutil.copyfileobj(stream, process.stdin, 1024*1024)
            process.stdin.write(b'\n\n')
        process.stdin.close()
        if process.wait() != 0:
            raise RuntimeError('Book aggregation failed')
    except BaseException:
        process.kill()
        process.wait()
        raise
