import {validatePosition} from './position-safety.js';
import {Chess} from './vendor/chess.js';
import {OPENING_NAMES} from './opening-names.js';
import {ELITE_BOOK,ELITE_BOOK_INFO} from './elite-book-data.js';
export {ELITE_BOOK_INFO};

export const DEFAULT_SETTINGS={engine:'stockfish19',opponent:'computer',chessCoach:false,animations:true,side:'w',level:'20',theme:'maple3',coordinates:true,legalHints:false,lastMove:true,time:0,analysisArrows:true,useToolbar:true,shortcut:'new',pieceSet:'classic',moveSound:false,moveHaptics:false,graphStyle:'default',showAnalysis:true,figurine:true,openingBook:true,bookVariety:'medium',permanentBrain:false,wdl:true,threads:2,hash:150,tablebasePath:'',tablebaseCount:0,language:'system',yourName:'',fixedTime:true,moveTime:5,links:{}};
export const ANALYSIS_TIMES=[5,10,20,30,60,90,0];
Object.assign(DEFAULT_SETTINGS,{gameMinutes:3,increment:0});
// Keep recorded games/results intact when restoring data from the retired app engine.
export function migrateRemovedKarsli(data,tournament=null){
  let changed=false;
  if(data?.settings?.engine==='karsli01'){data.settings.engine='stockfish19';changed=true;}
  if(data?.engineMatch&&[data.engineMatch.white,data.engineMatch.black].includes('karsli01')){
    if(data.settings?.opponent==='match')data.settings.opponent='local';
    data.engineMatch=null;delete data.engineMatchProgress;delete data.backgroundWaiting;
    data.backgroundResume=false;changed=true;
  }
  if(tournament&&!tournament.stopped&&tournament.results?.length<tournament.schedule?.length&&
      (tournament.engines?.includes('karsli01')||tournament.schedule.some(pair=>[pair.white,pair.black].includes('karsli01')))){
    tournament.stopped=true;changed=true;
  }
  return changed;
}
export function normalizeAnalysisTime(value){return ['number','string'].includes(typeof value)&&String(value).trim()!==''&&ANALYSIS_TIMES.includes(Number(value))?Number(value):0;}
export function analysisMoveTime(settings){return normalizeAnalysisTime(settings.time)*1000;}
export function shouldThinkDuringTurn(settings,position,{tab='game',live=true}={}){
  return settings.permanentBrain===true&&settings.opponent==='computer'&&tab==='game'&&live&&!position.isGameOver()&&position.turn()===settings.side;
}
export function computerMoveTime(settings){return settings.fixedTime===false?0:Math.round(Math.max(1,Math.min(60,Number(settings.moveTime)||DEFAULT_SETTINGS.moveTime))*1000);}
export const FIGURINES={K:'♚',Q:'♛',R:'♜',B:'♝',N:'♞'};
export function notation(text,enabled){return enabled?text.replace(/[KQRBN]/g,c=>FIGURINES[c]):text;}
export function timeLabel(seconds){return Number(seconds)===0?'Forever':seconds+'s';}
export function whiteWdl(wdl,turn){
  if(!Array.isArray(wdl)||wdl.length!==3||wdl.some(n=>!Number.isFinite(n)||n<0)||wdl.reduce((a,b)=>a+b,0)!==1000)return null;
  const ordered=turn==='w'?wdl:[wdl[2],wdl[1],wdl[0]],out=ordered.map(n=>Math.floor(n/10));
  const order=ordered.map((n,i)=>({i,remainder:n%10})).sort((a,b)=>b.remainder-a.remainder);
  for(let n=100-out.reduce((a,b)=>a+b,0),i=0;i<n;i++)out[order[i].i]++;
  return out;
}

// Offline Lichess Elite book: legal moves with observed counts, including transpositions.
const positionKey=fen=>fen.split(' ').slice(0,4).join(' ');
const bookCache=new Map();
export function bookMoves(game){
  if(game.isGameOver())return [];
  const key=positionKey(game.fen()),entries=ELITE_BOOK[key];
  if(!entries)return [];
  if(bookCache.has(key))return bookCache.get(key);
  const legal=new Map(game.moves({verbose:true}).map(m=>[m.from+m.to+(m.promotion||''),m.san]));
  const moves=Object.freeze(entries.filter(([uci,count])=>legal.has(uci)&&count>0).map(([uci,weight])=>Object.freeze({uci,weight,san:legal.get(uci)})).sort((a,b)=>b.weight-a.weight));
  if(bookCache.size>=512)bookCache.delete(bookCache.keys().next().value);
  bookCache.set(key,moves);return moves;
}
export function chooseBookMove(game,random=Math.random,variety='medium'){
  const moves=bookMoves(game),power=variety==='low'?2:variety==='high'?.5:1;
  const weights=moves.map(move=>Math.pow(move.weight,power)),total=weights.reduce((sum,weight)=>sum+weight,0);
  if(!total)return null;
  let target=random()*total;
  for(let i=0;i<moves.length;i++){target-=weights[i];if(target<=0)return moves[i];}
  return moves.at(-1);
}

export function openingForPosition(game,previousFens=[]){
  for(const fen of [game.fen(),...previousFens.slice().reverse()]){
    const entry=OPENING_NAMES[positionKey(fen)];
    if(entry)return {eco:entry[0],name:entry[1]};
  }
  return null;
}
export function bookSuggestions(game){
  const moves=bookMoves(game),total=moves.reduce((sum,m)=>sum+m.weight,0);
  if(!total)return [];
  const percentages=moves.map(m=>Math.floor(m.weight/total*100));
  const order=moves.map((m,i)=>({i,remainder:m.weight/total*100-percentages[i]})).sort((a,b)=>b.remainder-a.remainder);
  for(let i=0,remaining=100-percentages.reduce((a,b)=>a+b,0);i<remaining;i++)percentages[order[i].i]++;
  const number=game.fen().split(' ')[5],prefix=number+(game.turn()==='w'?'.':'…');
  return moves.map((m,i)=>({...m,percentage:percentages[i],label:prefix+m.san+' ('+percentages[i]+'%)'}));
}

export function positionFromDraft(draft){
  const placement=Array.from({length:8},(_,i)=>{let empty=0,row='';for(const f of 'abcdefgh'){const p=draft.squares[f+(8-i)];if(p){if(!/^[prnbqkPRNBQK]$/.test(p))throw Error('Unknown piece.');if(empty){row+=empty;empty=0;}row+=p;}else empty++;}return row+(empty||'');}).join('/');
  const rights=['K','Q','k','q'].filter(c=>draft.castling.includes(c)).join('')||'-';
  const fen=[placement,draft.turn,rights,draft.enPassant||'-',Number(draft.halfmove)||0,Number(draft.fullmove)||1].join(' ');
  const game=new Chess(fen),kings={};
  validatePosition(game);
  for(const row of game.board())for(const p of row)if(p?.type==='k')kings[p.color]=p.square;
  const w=kings.w,b=kings.b;
  if(Math.abs(w.charCodeAt(0)-b.charCodeAt(0))<=1&&Math.abs(Number(w[1])-Number(b[1]))<=1)throw Error('The kings cannot be next to one another.');
  const waiting=game.turn()==='w'?'b':'w';
  if(game.isAttacked(kings[waiting],game.turn()))throw Error('The side that just moved cannot leave its king in check.');
  for(const [right,king,rook,color] of [['K','e1','h1','w'],['Q','e1','a1','w'],['k','e8','h8','b'],['q','e8','a8','b']]){
    if(rights.includes(right)&&!(game.get(king)?.type==='k'&&game.get(king)?.color===color&&game.get(rook)?.type==='r'&&game.get(rook)?.color===color))throw Error('Castling rights require the king and rook on their starting squares.');
  }
  return fen;
}

export function draftFromGame(game){const squares={};for(const row of game.board())for(const p of row)if(p)squares[p.square]=p.color==='w'?p.type.toUpperCase():p.type;const parts=game.fen().split(' ');return {squares,turn:parts[1],castling:parts[2]==='-'?[]:parts[2].split(''),enPassant:parts[3],halfmove:parts[4],fullmove:parts[5]};}

export function safeAppLink(value,email=false){if(email){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)||/[\r\n?]/.test(value))throw Error('Enter a valid email address.');return 'mailto:'+value;}const url=new URL(value);if(!['https:','http:'].includes(url.protocol))throw Error('Use an https:// or http:// URL.');return url.href;}
