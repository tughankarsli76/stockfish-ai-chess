"""Package fully screened candidates as the app's offline opening book."""
from pathlib import Path
import json, hashlib, re, subprocess, argparse

parser=argparse.ArgumentParser()
parser.add_argument('--node',default='node',help='Node.js executable for app-compatible FEN keys')
args=parser.parse_args()

root=Path(__file__).resolve().parents[2]
work=root/'release/book-work'
rows=[json.loads(line) for line in (work/'screened.jsonl').open()]
candidates={line.split('\t',1)[0] for line in (work/'candidates.tsv').open()}
assert len(rows)==len({row['fen'] for row in rows})==len(candidates)
assert {row['fen'] for row in rows}==candidates
ep_keys=[row['fen'] for row in rows if row['fen'].split(' ')[3]!='-']
normalized=json.loads(subprocess.run([args.node,str(root/'tools/opening-book/canonical-keys.mjs')],
    input=json.dumps(ep_keys),text=True,capture_output=True,check=True).stdout)
book={}
collisions=0
duplicate_moves=0
# Prefer an already canonical record if equivalent keys exist. Never double-count games.
for row in sorted(rows,key=lambda row:(row['fen']!=normalized.get(row['fen'],row['fen']),-row['support'],row['fen'])):
    if not row['entries']:continue
    key=normalized.get(row['fen'],row['fen'])
    if key in book:
        collisions+=1
        continue
    moves={}
    for move,count in row['entries']:
        if move in moves:
            assert moves[move]==count,'Conflicting weights for one move'
            duplicate_moves+=1
        moves[move]=count
    book[key]=sorted(moves.items(),key=lambda entry:(-entry[1],entry[0]))
book=dict(sorted(book.items()))
log=(work/'aggregate.log').read_text()
read,kept,rejected=map(int,re.findall(r'DONE read=(\d+) kept=(\d+) rejected=(\d+)',log)[-1])
info={
    'name':'Lichess Elite — January–November 2025, Stockfish-filtered',
    'source':'https://database.nikonoel.fr/',
    'downloads':json.loads((work/'downloads.json').read_text()),
    'license':'CC0-1.0','games':kept,'positions':len(book),
    'moves':sum(map(len,book.values())),'maxPly':40,'minGamesPerLine':8,
    'minPositionGames':12,'minMoveShare':0.01,'minGameScore':0.35,
    'ratings':'2500+ versus 2300+, excluding bullet',
    'percentages':'Relative observed move counts among retained book moves',
    'excludedGames':rejected,'readGames':read,
    'canonicalizedEnPassantKeys':sum(fen!=key for fen,key in normalized.items()),
    'equivalentPositionRecordsDiscarded':collisions,
    'duplicateMoveRecordsDiscarded':duplicate_moves,
    'engineScreen':{'engine':'Stockfish 19','sha256':hashlib.sha256((root/'engine/stockfish-progress/src/stockfish').read_bytes()).hexdigest(),
        'positionsScreened':len(rows),'multiPV':3,'minimumDepth':6,'maxLossCentipawns':60,
        'minimumScoreCentipawns':-100,'usualLimits':{'depth':10,'nodes':12000},
        'commonLimits':{'minimumPositionGames':1000,'depth':14,'nodes':150000},
        'note':'Finite engine screening, not a guarantee. Only supported moves in an evaluated top-three batch are retained; unsupported positions fall back to engine search.'},
}
output='// Derived from Lichess Elite games, CC0. See assets/ELITE-BOOK-SOURCE.json.\n'
# Large object literals make JavaScriptCore compile hundreds of thousands of
# expressions before the first board can paint. JSON uses its fast data parser.
output+='export const ELITE_BOOK = JSON.parse('+json.dumps(json.dumps(book,separators=(',',':')))+');\n'
output+='export const ELITE_BOOK_INFO = '+json.dumps(info,separators=(',',':'))+';\n'
assert len(output.encode())<50_000_000,'Book exceeds mobile size budget'
(work/'elite-book-data.js').write_text(output)
(work/'ELITE-BOOK-SOURCE.json').write_text(json.dumps(info,indent=2)+'\n')
print(json.dumps({'games':kept,'positions':len(book),'moves':info['moves'],'bytes':len(output.encode())},indent=2))
