"""Portable UCI identity and two-line search smoke check."""
import queue
import subprocess
import threading
import time
from server import ENGINE, FLAGS

def main():
    p = subprocess.Popen([str(ENGINE)], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT, text=True, cwd=ENGINE.parent, creationflags=FLAGS)
    lines = queue.Queue()
    def read():
        for line in p.stdout:
            lines.put(line.strip())
    threading.Thread(target=read, daemon=True).start()
    def send(command):
        p.stdin.write(command + '\n')
        p.stdin.flush()
    def until(prefix, timeout=30):
        seen = []
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            try:
                line = lines.get(timeout=min(1, max(.01, deadline-time.monotonic())))
            except queue.Empty:
                if p.poll() is not None:
                    raise RuntimeError('Engine exited unexpectedly')
                continue
            seen.append(line)
            if line.startswith(prefix):
                return seen
        raise RuntimeError('Timed out waiting for ' + prefix)
    try:
        send('uci')
        assert any('id name Stockfish 19' in line for line in until('uciok'))
        send('setoption name Threads value 1')
        send('setoption name Hash value 32')
        send('setoption name MultiPV value 2')
        send('isready')
        until('readyok')
        send('position startpos')
        send('go depth 8')
        output = until('bestmove ')
        assert any('multipv 1 ' in line for line in output)
        assert any('multipv 2 ' in line for line in output)
        assert output[-1].split()[1] not in {'(none)', '0000'}
        print('PASS: Stockfish 19 identity, two analysis lines, and completed search.')
    finally:
        if p.poll() is None:
            try:
                send('quit')
                p.wait(timeout=5)
            except (OSError, subprocess.TimeoutExpired):
                p.kill()
                p.wait()

if __name__ == '__main__':
    main()
