"""Screen supported book moves with the bundled Stockfish 19; resumable JSONL output.

Only moves in a completed, same-depth top-three engine batch are retained.
Common positions receive a larger search budget. This is finite analysis, not
a proof of move quality; the app falls back to its engine outside this book.
"""
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
import json, subprocess, re, atexit, time

ROOT=Path(__file__).resolve().parents[2]
WORK=ROOT/'release/book-work'
ENGINE=ROOT/'engine/stockfish-progress/src/stockfish'
process=None

def send(command):
    process.stdin.write(command+'\n');process.stdin.flush()

def until(prefix):
    lines=[]
    while True:
        line=process.stdout.readline()
        if not line:raise RuntimeError('Stockfish exited during book screening')
        line=line.strip();lines.append(line)
        if line.startswith(prefix):return lines

def start_engine():
    global process
    process=subprocess.Popen([str(ENGINE)],cwd=ENGINE.parent,stdin=subprocess.PIPE,
                             stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,bufsize=1)
    send('uci');identity=until('uciok')
    if not any('id name Stockfish 19' in line for line in identity):raise RuntimeError('Wrong engine')
    send('setoption name Threads value 1');send('setoption name Hash value 32')
    send('setoption name MultiPV value 3');send('isready');until('readyok')
    atexit.register(process.terminate)

def screen(row):
    fen,entries,total=row
    send('position fen '+fen+' 0 1')
    # Deepen the frequently encountered opening branches; bound long tail cost.
    common=total>=1000
    send('go depth '+('14' if common else '10')+' nodes '+('150000' if common else '12000'))
    lines=until('bestmove ')
    batches={}
    for line in lines:
        if 'lowerbound' in line or 'upperbound' in line:continue
        match=re.search(r'\bdepth (\d+).*?\bmultipv (\d+).*?\bscore (cp|mate) (-?\d+).*?\bpv (\S+)',line)
        if match:
            depth,rank,kind,score,move=match.groups()
            batches.setdefault(int(depth),{})[int(rank)]=(kind,int(score),move)
    complete=[depth for depth,batch in batches.items() if len(batch)==3]
    # Positions with fewer than three legal moves still have a usable final batch.
    if not complete:
        complete=[depth for depth,batch in batches.items() if 1 in batch and depth>=6]
    depth=max(complete,default=0);batch=batches.get(depth,{})
    kept=[]
    if depth>=6 and 1 in batch:
        bestKind,bestScore,_=batch[1]
        for kind,score,move in batch.values():
            good=(bestKind=='cp' and kind=='cp' and bestScore-score<=60 and score>=-100)
            if bestKind=='mate':good=kind=='mate' and bestScore>0 and score>0
            if good:
                kept.extend([entry for entry in entries if entry[0]==move])
    # A node-limited final PV update can repeat one move in multiple ranks.
    # Preserve its observed game count exactly once.
    kept=list(dict(kept).items())
    return {'fen':fen,'entries':kept,'depth':depth,'support':total,'common':common}

def main():
    positions={}
    for line in (WORK/'candidates.tsv').open():
        fen,move,count,points,total=line.rstrip('\n').split('\t')
        entry=positions.setdefault(fen,[[],int(total)])
        entry[0].append([move,int(count)])
    rows=sorted(((fen,entries,total) for fen,(entries,total) in positions.items()),key=lambda row:(-row[2],row[0]))
    target=WORK/'screened.jsonl'
    done=set()
    if target.exists():
        for line in target.open():done.add(json.loads(line)['fen'])
    pending=[row for row in rows if row[0] not in done]
    print('Positions',len(rows),'already screened',len(done),'pending',len(pending),flush=True)
    start=time.monotonic()
    with target.open('a') as out, ProcessPoolExecutor(max_workers=3,initializer=start_engine) as pool:
        for index,result in enumerate(pool.map(screen,pending,chunksize=32),1):
            out.write(json.dumps(result,separators=(',',':'))+'\n')
            if index%1000==0:
                out.flush();print('Screened',index+len(done),'of',len(rows),'elapsed',round(time.monotonic()-start),flush=True)
    print('DONE',len(rows),flush=True)

if __name__=='__main__':main()
