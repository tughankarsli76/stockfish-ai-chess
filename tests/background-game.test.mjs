import test from 'node:test';
import assert from 'node:assert/strict';
import {BackgroundGame} from '../dist/background-game.js';
import {Chess} from '../dist/vendor/chess.js';
import {GameSession} from '../dist/model.js';
const seed=(extra={})=>({pgn:new Chess().pgn(),settings:{engine:'stockfish19',opponent:'match',fixedTime:true,gameMinutes:1,increment:0,openingBook:false,threads:1,hash:16,level:20,moveTime:1,side:'b'},engineNames:{stockfish19:'Stockfish 19',stockfish18:'Stockfish 18'},engineMatch:{white:'stockfish19',black:'stockfish18',seconds:120,paused:false},...extra});
test('background matches alternate engines, persist legal moves and preserve 120-second searches',()=>{
 const data=seed({engineMatchProgress:{moves:7,complete:true}}),game=new BackgroundGame(data);
 for(const [i,move] of ['e2e4','e7e5','g1f3','b8c6'].entries()){const job=game.next();assert.equal(job.engine,i%2?'stockfish18':'stockfish19');assert.equal(job.milliseconds,120000);game.advance(move);assert.deepEqual(game.checkpoint().data.engineMatchProgress,{moves:i+1,complete:false});}
 const saved=game.stop(true);assert.equal(saved.moves,4);assert.equal(saved.data.backgroundResume,true);const restored=new Chess();restored.loadPgn(saved.data.pgn);assert.equal(restored.history().length,4);
 assert.deepEqual(saved.data.engineMatchProgress,{moves:4,complete:false});assert.deepEqual(saved.data.settings,data.settings);assert.deepEqual(data.engineMatchProgress,{moves:7,complete:true});assert.equal(data.pgn,new Chess().pgn());
});
test('normal background play makes only the engine move then waits for the user',()=>{
  const data=seed({engineMatchProgress:{moves:7,complete:false}});data.settings.opponent='computer';const game=new BackgroundGame(data);
  const job=game.next();assert.equal(job.engine,'stockfish19');assert.equal(Object.hasOwn(job,'tablebasePieces'),false);game.advance('e2e4');assert.equal(game.next(),null);assert.equal(game.checkpoint().waiting,true);assert.equal(game.checkpoint().moves,1);
  assert.equal(game.checkpoint().data.engineMatchProgress,null);assert.deepEqual(game.checkpoint().data.settings,data.settings);
});
test('restoring headless play shows newly played moves instead of the previous saved cursor',()=>{
  const data=seed({cursor:0,tab:'game'});data.settings.opponent='computer';
  const game=new BackgroundGame(data);game.next();game.advance('e2e4');game.next();
  const saved=game.stop(true).data,restored=new GameSession();
  restored.load(saved.pgn,{cursor:saved.cursor});
  assert.equal(restored.live,true);assert.equal(restored.cursor,1);
  assert.equal(restored.position().fen(),game.game.fen());
  assert.equal(saved.tab,'game');assert.equal(data.cursor,0);
});
test('a mating move checkpoints completed match progress before scheduling the next move',()=>{
 const position=new Chess('7k/5K2/6Q1/8/8/8/8/8 w - - 0 1'),data=seed({pgn:position.pgn(),engineMatchProgress:{moves:7,complete:false}}),game=new BackgroundGame(data);
 game.next();game.advance('g6g7');assert.ok(game.game.isCheckmate());
 const saved=game.checkpoint();assert.equal(saved.completed,false);assert.deepEqual(saved.data.engineMatchProgress,{moves:1,complete:true});assert.equal(saved.moves,1);
});
test('background games remove retired tablebase limits without changing saved games',()=>{
  for(const value of [0,3,4,5]){
    const data=seed();data.settings.tablebasePieces=value;data.tablebaseDefaultsRevision=1;
    const game=new BackgroundGame(data),job=game.next(),saved=game.checkpoint().data;
    assert.equal(Object.hasOwn(job,'tablebasePieces'),false);
    assert.equal(Object.hasOwn(saved.settings,'tablebasePieces'),false);
    assert.equal(Object.hasOwn(saved,'tablebaseDefaultsRevision'),false);
    assert.equal(saved.pgn,data.pgn);assert.equal(data.settings.tablebasePieces,value);
  }
});
test('one-minute clock can flag in background without applying a late move',()=>{
 let now=0;const data=seed();data.settings.fixedTime=false;const game=new BackgroundGame(data,null,()=>now);
 assert.equal(game.next().clock.wtime,60000);now=60001;assert.equal(game.advance('e2e4'),false);assert.equal(game.next(),null);
 const saved=game.checkpoint();assert.equal(saved.completed,true);assert.equal(saved.moves,0);assert.deepEqual(saved.data.engineMatchProgress,{moves:0,complete:true});assert.equal(saved.data.clock.current.expired,'w');assert.equal(new Chess(saved.data.clock.fen).turn(),'w');
});
test('finished tournament games are recorded once and the next game starts without WebKit',()=>{
 const c=new Chess('7k/5K2/6Q1/8/8/8/8/8 w - - 0 1');const data=seed({pgn:c.pgn()});data.engineMatch.tournamentId='t';data.engineMatch.round=1;
 const pair={white:'stockfish19',black:'stockfish18'},t={id:'t',engines:Object.keys(data.engineNames),schedule:[pair,pair],results:[],control:{seconds:1,fixedTime:true,gameMinutes:1,increment:0}};
 const game=new BackgroundGame(data,t);game.next();game.advance('g6g7');assert.ok(game.game.isCheckmate());assert.deepEqual(game.checkpoint().data.engineMatchProgress,{moves:1,complete:true});assert.ok(game.next());
 const saved=game.checkpoint();assert.equal(saved.tournament.results.length,1);assert.equal(saved.tournament.results[0].result,'1-0');assert.equal(saved.data.engineMatch.round,2);assert.equal(saved.moves,0);assert.equal(game.game.getHeaders().White,'Stockfish 19');
 assert.deepEqual(saved.data.engineMatchProgress,{moves:0,complete:false});
});
test('expiration preserves the current position and remaining clocks without inventing a move',()=>{
 let now=0;const data=seed();data.settings.fixedTime=false;const game=new BackgroundGame(data,null,()=>now);game.next();now=4200;
 const saved=game.stop(false);assert.equal(saved.moves,0);assert.equal(saved.data.clock.current.remaining.w,55800);assert.equal(saved.data.backgroundResume,false);assert.equal(game.advance('e2e4'),false);
});
test('background opening book remains enabled and produces legal moves',()=>{
 const data=seed();data.settings.openingBook=true;const game=new BackgroundGame(data);const job=game.next();assert.ok(job.book);assert.equal(game.advance(job.book),true);
});
