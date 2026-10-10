import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {GameSession,gameStatus} from '../dist/model.js';
import {GameClock} from '../dist/clock.js';

const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
const blackMate='[White "Human"]\n[Black "Computer"]\n[Result "0-1"]\n\n1. f3 e5 2. g4 Qh4# 0-1';
const whiteMate='[White "Computer"]\n[Black "Human"]\n[Result "1-0"]\n\n1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6 4. Qxf7# 1-0';

// Run the app's actual control and result handlers with deterministic clocks/searches.
function appFunction(name){
 const start=source.indexOf('function '+name+'(');
 assert.notEqual(start,-1,'Missing app function '+name);
 let depth=0,quote=null,escaped=false,lineComment=false,blockComment=false;
 for(let i=source.indexOf('{',start);i<source.length;i++){
  const c=source[i];
  if(lineComment){if(c==='\n')lineComment=false;continue;}
  if(blockComment){if(c==='*'&&source[i+1]==='/'){blockComment=false;i++;}continue;}
  if(quote){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c===quote)quote=null;continue;}
  if(c==='/'&&source[i+1]==='/'){lineComment=true;i++;continue;}
  if(c==='/'&&source[i+1]==='*'){blockComment=true;i++;continue;}
  if(c==='\''||c==='"'||c==='`'){quote=c;continue;}
  if(c==='{')depth++;
  if(c==='}'&&--depth===0)return source.slice(start,i+1);
 }
 throw Error('Unterminated app function '+name);
}

function harness(pgn,{tab='game',opponent='computer',side='w'}={}){
 const session=new GameSession();session.load(pgn);
 let now=0,stopped=0,paused=0,rendered=0,persisted=0;
 const moves=[],requests=[],cleared=[],clock=new GameClock(3,2,()=>now);
 const history=Array.from({length:session.length+1},(_,i)=>({remaining:{w:180000-i*1100,b:180000-i*700},expired:null}));
 clock.restore(history.at(-1));
 const context={session,GameClock,settings:{opponent,side,fixedTime:false,gameMinutes:3,increment:2},tab,
  engineMatch:opponent==='match'?{paused:false}:null,gameClock:clock,clockHistory:history,
  moveClock:{fen:session.game.fen(),elapsed:{w:1000,b:2000},running:null,since:0},
  selected:'e2',promotion:{from:'a7',to:'a8'},clockFlagHandled:true,requestId:40,bookTimer:123,
  nativeSuspended:false,inactiveTab:false,benchmarkMode:false,analysis:null,analysisLines:[],analysisFen:null,
  searchProgress:null,bestHint:null,analysisComplete:false,connectedEngine:'stockfish19',scores:{},
  winCelebration:{stop(){stopped++;}},mateCelebration:{stop(){stopped++;}},
  boardMotion:{cancel(){},running:false},moveSound:{play(){}},
  engine:{cancel(){stopped++;}},clearTimeout:id=>cleared.push(id),
  render(){rendered++;},persist(){persisted++;},renderAnalysis(){},renderStatus(){},renderGraph(){},
  renderSearchCount(){},publishSearchProgress(){},analysisUpdates:{flush(){}},
  engineName:()=> 'Stockfish 19',$:()=>({textContent:''}),toast(){},
  pauseEngineMatch(){context.engineMatch.paused=true;paused++;},
  resetGameClock(){throw Error('A valid historical clock must be restored');},
  analyze(){requests.push({id:++context.requestId,fen:session.position().fen(),computer:context.computerTurn()});},
  makeMove(move){moves.push(move);return session.move(move);}
 };
 vm.createContext(context);
 for(const name of ['matchActive','matchView','clockExpired','computerTurn','validJob','changed','navigate','takeBack','onResult'])vm.runInContext(appFunction(name),context);
 return {context,session,clock,history,moves,requests,cleared,
  setNow:value=>{now=value;},counts:()=>({stopped,paused,rendered,persisted})};
}

test('computer takeback makes the pre-mate position live and accepts the remating reply for either color',()=>{
 for(const [pgn,side,winner,uci] of [[blackMate,'w','Black','d8h4'],[whiteMate,'b','White','h5f7']]){
  const h=harness(pgn,{side}),oldLength=h.session.length;
  const before=h.session.moves.at(-1).before,oldJob={id:h.context.requestId,fen:before,computer:true};
  h.context.takeBack();
  assert.equal(h.session.length,oldLength-1);assert.equal(h.session.cursor,h.session.length);assert.equal(h.session.live,true);
  assert.equal(h.session.game.fen(),before);assert.equal(h.session.game.isGameOver(),false);
  assert.equal(h.session.game.getHeaders().Result,'*');assert.equal(h.context.computerTurn(),true);
  assert.equal(h.context.selected,null);assert.equal(h.context.promotion,null);assert.equal(h.context.clockFlagHandled,false);
  assert.equal(h.requests.length,1);assert.equal(h.requests[0].computer,true);
  assert.equal(h.context.validJob(oldJob),false);
  h.context.onResult(oldJob,uci,null);assert.equal(h.moves.length,0);assert.equal(h.session.length,oldLength-1);
  h.context.onResult(h.requests[0],uci,null);
  assert.equal(h.moves.length,1);assert.equal(h.session.live,true);assert.equal(h.session.length,oldLength);
  assert.equal(gameStatus(h.session.game),'Checkmate — '+winner+' wins');
  assert.ok(h.cleared.includes(123));assert.ok(h.counts().stopped>=3);
 }
});

test('taking back a human move leaves the game live and waits for that human',()=>{
 for(const [pgn,side] of [['1. e4 e5 2. Nf3','w'],['1. e4 e5','b']]){
  const h=harness(pgn,{side});h.context.takeBack();
  assert.equal(h.session.live,true);assert.equal(h.session.game.turn(),side);
  assert.equal(h.context.computerTurn(),false);assert.equal(h.requests[0].computer,false);
  h.context.onResult(h.requests[0],side==='w'?'g1f3':'b8c6',null);
  assert.equal(h.moves.length,0);
 }
});

test('computer takeback restores the target clock and discards clocks belonging to removed moves',()=>{
 const h=harness(blackMate),target=h.session.length-1,expected=h.history[target];
 h.setNow(5000);h.context.takeBack();
 assert.deepEqual(h.clock.snapshot(),expected);assert.equal(h.history.length,target+1);
 assert.deepEqual(h.history[target],expected);assert.equal(h.clock.expired,null);
 assert.equal(h.counts().persisted,1);assert.equal(h.counts().rendered,1);
});

test('fixed-time takeback preserves accumulated playing time without a historical countdown snapshot',()=>{
 const h=harness(blackMate),target=h.session.length-1;
 h.context.settings.fixedTime=true;h.history[target]=undefined;
 h.context.moveClock.elapsed={w:12345,b:23456};
 h.context.takeBack();
 assert.deepEqual(h.context.moveClock.elapsed,{w:12345,b:23456});
 assert.equal(h.session.live,true);assert.equal(h.context.computerTurn(),true);
 assert.equal(h.requests[0].computer,true);assert.equal(h.history.length,target+1);
});

test('missing countdown history restarts valid clocks so a rolled-back computer turn can resume',()=>{
 const h=harness(blackMate),target=h.session.length-1;
 h.history[target]=undefined;h.clock.restore({remaining:{w:4000,b:0},expired:'b'});
 h.context.takeBack();
 assert.deepEqual(h.context.gameClock.remaining,{w:180000,b:180000});
 assert.equal(h.context.gameClock.increment,2000);assert.equal(h.context.gameClock.expired,null);
 assert.equal(h.context.clockFlagHandled,false);assert.equal(h.context.computerTurn(),true);
 assert.equal(h.requests[0].computer,true);assert.equal(h.history.length,target+1);
});

test('Analysis, Both Sides, and engine-match Take Back preserve the full game as review',()=>{
 for(const options of [{tab:'analysis'},{opponent:'local'},{opponent:'match'},{tab:'graph'}]){
  const h=harness(blackMate,options),original=h.session.game.pgn(),length=h.session.length;
  h.context.takeBack();
  assert.equal(h.session.game.pgn(),original);assert.equal(h.session.length,length);assert.equal(h.session.cursor,length-1);
  assert.equal(h.session.live,false);assert.equal(h.context.computerTurn(),false);assert.equal(h.requests[0].computer,false);
  h.context.onResult(h.requests[0],'d8h4',null);assert.equal(h.moves.length,0);
  if(options.opponent==='match'){assert.equal(h.context.engineMatch.paused,true);assert.equal(h.counts().paused,1);}
 }
});

test('model takeback from review truncates only later moves and keeps headers and repetition history',()=>{
 const session=new GameSession();
 session.load('[Event "Repeat"]\n[White "Tester"]\n[Result "0-1"]\n\n1. Nf3 Nf6 2. Ng1 Ng8 3. Nf3 Nf6 4. d4 d5 0-1');
 session.navigate(7);
 assert.equal(session.takeBack(),true);assert.deepEqual(session.game.history(),['Nf3','Nf6','Ng1','Ng8','Nf3','Nf6']);
 assert.equal(session.live,true);assert.equal(session.game.getHeaders().Event,'Repeat');assert.equal(session.game.getHeaders().White,'Tester');
 assert.equal(session.game.getHeaders().Result,'*');
 session.move('Ng1');session.move('Ng8');assert.equal(session.game.isThreefoldRepetition(),true);
});

test('model takeback preserves castling, en passant, and promotion rights',()=>{
 const castle=new GameSession();castle.load('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');castle.move('O-O');
 const castleHeader=castle.game.getHeaders().FEN;assert.equal(castle.takeBack(),true);castle.move('O-O');
 assert.equal(castle.game.get('g1').type,'k');assert.equal(castle.game.get('f1').type,'r');assert.equal(castle.game.getHeaders().FEN,castleHeader);
 const ep=new GameSession();for(const move of ['e4','a6','e5','d5','exd6'])ep.move(move);
 assert.equal(ep.takeBack(),true);ep.move('exd6');assert.equal(ep.game.get('d5'),undefined);assert.equal(ep.game.get('d6').color,'w');
 const promotion=new GameSession();promotion.load('7k/P7/8/8/8/8/8/7K w - - 0 1');promotion.move({from:'a7',to:'a8',promotion:'q'});
 assert.equal(promotion.takeBack(),true);promotion.move({from:'a7',to:'a8',promotion:'n'});assert.equal(promotion.game.get('a8').type,'n');
});

test('Take Back at the starting position leaves the complete line and pending work untouched',()=>{
 for(const pgn of ['1. e4 e5','[Result "*"]\n\n*']){
  const h=harness(pgn),original=h.session.game.pgn();h.session.navigate(0);
  assert.equal(h.session.takeBack(),false);h.context.takeBack();
  assert.equal(h.session.game.pgn(),original);assert.equal(h.session.cursor,0);assert.equal(h.requests.length,0);
  assert.equal(h.moves.length,0);assert.deepEqual(h.cleared,[]);assert.equal(h.counts().stopped,0);
 }
});
