"""Compare ARM SIMD with SIMDe's portable scalar fallback using the same official network."""
from pathlib import Path
import subprocess,queue,threading,json
root=Path(__file__).resolve().parents[1]
fens=[
'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',
'8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1',
'r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1',
'rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8'
]
def run(name):
 p=subprocess.Popen([str(root/'obsidian-validation'/name)],stdin=subprocess.PIPE,stdout=subprocess.PIPE,text=True)
 q=queue.Queue()
 def read():
  for line in p.stdout:q.put(line.strip())
 threading.Thread(target=read,daemon=True).start()
 def send(cmd):p.stdin.write(cmd+'\n');p.stdin.flush()
 def until(prefix):
  out=[]
  while True:
   line=q.get(timeout=45);out.append(line)
   if line.startswith(prefix):return out
 try:
  send('uci');until('uciok');send('setoption name Hash value 16');send('isready');until('readyok')
  results=[]
  for fen in fens:
   send('ucinewgame');send('position fen '+fen);send('eval')
   evaluation=until('Evaluation:')[-1]
   send('go perft 3');perft=until('nodes:')[-1]
   send('go depth 6');search=until('bestmove')
   final=next(line for line in reversed(search) if line.startswith('info depth '))
   # Time/nps differ between SIMD implementations; compare the meaningful search output.
   fields=final.split();score=fields[fields.index('score')+1:fields.index('score')+3]
   pv=fields[fields.index('pv')+1:]
   results.append(dict(fen=fen,evaluation=evaluation,perft=perft,score=score,pv=pv,bestmove=search[-1]))
  return results
 finally:
  send('quit');p.wait(timeout=10)
a=run('obsidian-arm');b=run('obsidian-reference')
assert a==b,json.dumps({'arm':a,'reference':b},indent=2)
assert a[0]['perft']=='nodes: 8902',a[0]
assert a[1]['perft']=='nodes: 97862',a[1]
print(json.dumps(a,indent=2));print('PASS: all 5 positions have identical evaluation, depth-6 score/PV/bestmove and perft between ARM and portable reference; known perft counts verified.')
