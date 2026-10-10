import subprocess,threading,queue,time
from pathlib import Path
root=Path(__file__).resolve().parent
p=subprocess.Popen([str(root/"stockfish-progress.exe")],cwd=root,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.DEVNULL,text=True,bufsize=1,creationflags=subprocess.CREATE_NO_WINDOW)
q=queue.Queue()
def read():
    for line in p.stdout:q.put((time.monotonic(),line.strip()))
threading.Thread(target=read,daemon=True).start()
def send(s):p.stdin.write(s+"\n");p.stdin.flush()
def until(prefix):
    while True:
        _,line=q.get(timeout=15)
        if line.startswith(prefix):return
try:
    send("uci");until("uciok")
    for command in ["setoption name Threads value 2","setoption name Hash value 64","setoption name MultiPV value 2","isready"]:send(command)
    until("readyok")
    send("position fen 8/3P3k/n2K3p/2p3n1/1b4N1/2p1p1P1/8/3B4 w - - 0 1")
    send("go infinite");start=time.monotonic();samples=[]
    while time.monotonic()-start<10:
        t,line=q.get(timeout=3)
        if line.startswith("info nodes "):samples.append((round(t-start,3),int(line.split()[2])))
    print("Actual node reports:",samples)
    assert len(samples)>=8
    assert all(b[1]>a[1] and b[0]-a[0]<1.5 for a,b in zip(samples,samples[1:]))
finally:
    if p.poll() is None:
        send("stop");until("bestmove");send("quit");p.wait(timeout=10)
