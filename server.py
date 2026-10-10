"""Local-only chess preview and isolated Stockfish 19 sessions.

No shell or arbitrary UCI options are exposed to the browser. Each tab gets its
own process; disconnects close it. Python uses Windows anonymous pipes because
Node's pipe creation is unavailable in this desktop execution environment.
"""
import json
import os
import queue
import re
import secrets
import subprocess
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent
ENGINE = ROOT / ('engine/stockfish-progress/stockfish-progress.exe' if os.name == 'nt' else 'engine/stockfish-progress/stockfish')
if os.name == 'nt' and not ENGINE.is_file():
    ENGINE = ROOT / 'engine/stockfish-19/stockfish/stockfish-windows-x86-64-universal.exe'
FLAGS = subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
SESSIONS = {}
LOCK = threading.Lock()
ORIGINS = {'http://127.0.0.1:4173', 'http://localhost:4173'}
HOSTS = {'127.0.0.1:4173', 'localhost:4173'}
MAX_THREADS = min(os.cpu_count() or 1, 64)
MAX_HASH = 4096
if os.name == 'nt':
    import ctypes
    class MemoryStatus(ctypes.Structure):
        _fields_ = [('length', ctypes.c_ulong), ('load', ctypes.c_ulong)] + [(name, ctypes.c_ulonglong) for name in ['totalPhys','availPhys','totalPage','availPage','totalVirtual','availVirtual','availExtended']]
    memory = MemoryStatus()
    memory.length = ctypes.sizeof(memory)
    if ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(memory)):
        MAX_HASH = max(64, min(16384, int(memory.totalPhys // (1024 * 1024 * 2))))


def tablebase_info(value):
    if not isinstance(value, str) or len(value) > 400 or any(c in value for c in '\r\n;'):
        raise ValueError('Enter one local tablebase folder.')
    if not value.strip() or value == '<empty>':
        return {'path': '', 'count': 0}
    folder = Path(value).expanduser().resolve(strict=True)
    if not folder.is_dir():
        raise ValueError('Choose a folder, not a file.')
    count = sum(1 for entry in folder.iterdir() if entry.is_file() and entry.suffix.lower() in {'.rtbw', '.rtbz'})
    if not count:
        raise ValueError('This folder contains no Syzygy .rtbw or .rtbz files.')
    return {'path': str(folder), 'count': count}


def valid_command(command):
    if not isinstance(command, str) or len(command) > 512:
        return False
    if command in {'uci', 'isready', 'stop', 'quit', 'ucinewgame'}:
        return True
    if re.fullmatch(r'setoption name (MultiPV value [1-3]|Skill Level value ([0-9]|1[0-9]|20)|UCI_ShowWDL value (true|false))', command):
        return True
    resource = re.fullmatch(r'setoption name (Hash|Threads) value ([0-9]+)', command)
    if resource:
        return 1 <= int(resource[2]) <= (MAX_HASH if resource[1] == 'Hash' else MAX_THREADS)
    if command.startswith('setoption name SyzygyPath value '):
        try:
            tablebase_info(command[len('setoption name SyzygyPath value '):])
            return True
        except (OSError, ValueError):
            return False
    if command == 'go infinite':
        return True
    clock = re.fullmatch(r'go wtime ([0-9]{1,10}) btime ([0-9]{1,10}) winc ([0-9]{1,5}) binc ([0-9]{1,5})', command)
    if clock:
        return all(1 <= int(clock[i]) <= 2147483647 for i in (1, 2)) and all(0 <= int(clock[i]) <= 60000 for i in (3, 4))
    if re.fullmatch(r'go movetime [0-9]{1,5}', command):
        return 1 <= int(command.split()[-1]) <= 90000
    if command.startswith('position fen '):
        fen = command[len('position fen '):]
        if not re.fullmatch(r'[prnbqkPRNBQK1-8/]+ [wb] (-|K?Q?k?q?) (-|[a-h][36]) [0-9]{1,6} [1-9][0-9]{0,5}', fen):
            return False
        ranks = fen.split()[0].split('/')
        return len(ranks) == 8 and all(sum(int(c) if c.isdigit() else 1 for c in rank) == 8 for rank in ranks) and fen.split()[0].count('K') == 1 and fen.split()[0].count('k') == 1
    return False


class EngineSession:
    def __init__(self):
        self.process = subprocess.Popen([str(ENGINE)], cwd=ENGINE.parent, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, bufsize=1, creationflags=FLAGS)
        self.lines = queue.Queue(maxsize=4096)
        self.write_lock = threading.Lock()
        self.closed = False
        threading.Thread(target=self.read, daemon=True).start()

    def read(self):
        try:
            for line in self.process.stdout:
                self.lines.put(line.rstrip('\r\n'), timeout=2)
        except (OSError, ValueError, queue.Full):
            pass
        finally:
            try:
                self.lines.put(None, timeout=1)
            except queue.Full:
                self.close()

    def send(self, command):
        with self.write_lock:
            if self.closed:
                raise BrokenPipeError('Engine session closed')
            self.process.stdin.write(command + '\n')
            self.process.stdin.flush()

    def close(self):
        with self.write_lock:
            if self.closed:
                return
            self.closed = True
            if self.process.poll() is None:
                self.process.terminate()
                try:
                    self.process.wait(timeout=2)
                except subprocess.TimeoutExpired:
                    self.process.kill()
                    self.process.wait(timeout=2)
            self.process.stdin.close()
            self.process.stdout.close()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / 'dist'), **kwargs)

    def log_message(self, *_):
        pass

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

    def allowed(self):
        return self.headers.get('Host') in HOSTS and self.headers.get('Origin', 'http://127.0.0.1:4173') in ORIGINS

    def reply(self, code, data):
        payload = json.dumps(data).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        if not self.allowed():
            return self.reply(403, {'error': 'Local origin required'})
        if urlsplit(self.path).path == '/api/engine/info':
            return self.reply(200, {'name': 'Stockfish 19', 'runtime': 'native Windows' if os.name == 'nt' else 'native macOS', 'threads': 2, 'hashMB': 64, 'maxThreads': MAX_THREADS, 'maxHashMB': MAX_HASH, 'release': 'sf_19'})
        return super().do_GET()

    def do_POST(self):
        if not self.allowed() or self.headers.get('Content-Type', '').split(';')[0] != 'application/json':
            return self.reply(403, {'error': 'Local JSON requests required'})
        try:
            size = int(self.headers.get('Content-Length', '0'))
            if not 0 < size <= 2048:
                return self.reply(413, {'error': 'Invalid request size'})
            data = json.loads(self.rfile.read(size))
            if not isinstance(data, dict):
                raise ValueError()
        except (ValueError, json.JSONDecodeError):
            return self.reply(400, {'error': 'Invalid JSON'})
        route = urlsplit(self.path).path
        if route == '/api/tablebase/validate':
            try:
                return self.reply(200, tablebase_info(data.get('path', '')))
            except (OSError, ValueError) as error:
                return self.reply(400, {'error': str(error)})
        if route == '/api/engine/open':
            return self.open_engine()
        if route == '/api/engine/command':
            command = data.get('command')
            if not valid_command(command):
                return self.reply(400, {'error': 'Unsupported engine command'})
            session_id = data.get('session')
            if not isinstance(session_id, str):
                return self.reply(400, {'error': 'Invalid session'})
            with LOCK:
                session = SESSIONS.get(session_id)
            if not session:
                return self.reply(410, {'error': 'Engine session ended'})
            try:
                session.send(command)
                return self.reply(200, {'ok': True})
            except (OSError, ValueError):
                return self.reply(410, {'error': 'Engine process ended'})
        return self.reply(404, {'error': 'Not found'})

    def open_engine(self):
        with LOCK:
            if len(SESSIONS) >= 4:
                return self.reply(429, {'error': 'Close another chess preview tab and retry'})
            try:
                session = EngineSession()
            except OSError:
                return self.reply(503, {'error': 'Could not start Stockfish 19'})
            session_id = secrets.token_urlsafe(24)
            SESSIONS[session_id] = session
        self.send_response(200)
        self.send_header('Content-Type', 'application/x-ndjson')
        self.end_headers()
        def emit(data):
            self.wfile.write((json.dumps(data) + '\n').encode())
            self.wfile.flush()
        try:
            emit({'session': session_id})
            while not session.closed:
                try:
                    line = session.lines.get(timeout=1)
                except queue.Empty:
                    emit({'ping': True})
                    continue
                if line is None:
                    break
                emit({'line': line})
        except (OSError, ValueError):
            pass
        finally:
            session.close()
            with LOCK:
                SESSIONS.pop(session_id, None)


if __name__ == '__main__':
    if not ENGINE.is_file():
        raise SystemExit('Engine missing. On a Mac, run python3 setup-mac.py first.')
    probe = subprocess.run([str(ENGINE)], input='uci\nquit\n', text=True, capture_output=True, timeout=10, creationflags=FLAGS, cwd=ENGINE.parent)
    if probe.returncode or 'id name Stockfish 19' not in probe.stdout:
        raise RuntimeError('Stockfish 19 verification failed')
    print('Chess App ready: http://127.0.0.1:4173 — Stockfish 19 (full engine)', flush=True)
    server = ThreadingHTTPServer(('127.0.0.1', 4173), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
        with LOCK:
            active = list(SESSIONS.values())
        for session in active:
            session.close()
