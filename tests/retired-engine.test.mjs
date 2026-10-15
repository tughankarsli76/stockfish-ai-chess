import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {migrateRemovedKarsli,DEFAULT_SETTINGS} from '../dist/features.js';
import {BackgroundGame} from '../dist/background-game.js';
import {Chess} from '../dist/vendor/chess.js';

function savedGame(){
 const game=new Chess();game.move('e4');game.move('e5');
 game.setHeader('White','Player','Black','Karsli 1.0-dev');
 return {pgn:game.pgn(),settings:{...DEFAULT_SETTINGS,engine:'karsli01',opponent:'computer',side:'b',openingBook:false},saved:[{name:'Earlier game',pgn:game.pgn()}],engineVersion:'Karsli 1.0-dev'};
}

test('installed native engine catalog retains ten engines without Karsli',()=>{
 const context={__chessSaved:{},document:{addEventListener(){}},crypto:{randomUUID:()=> 'session'},navigator:{},fetch:async()=>{},webkit:{messageHandlers:{chess:{postMessage:async()=>{}}}}};context.window=context;
 vm.runInNewContext(readFileSync(new URL('../ios/StockfishChess/native-bootstrap.js',import.meta.url),'utf8'),context);
 assert.deepEqual(Array.from(context.chessNative.engines,e=>e.id),['stockfish19','reckless090','plenty800','pawn201','obsidian160','cinder061','viridithas200','halogen160','clover91','starzix61']);
});

test('retired engine preference falls back without rewriting game history or analysis identity',()=>{
 const data=savedGame(),before=structuredClone(data);
 assert.equal(migrateRemovedKarsli(data),true);
 before.settings.engine='stockfish19';assert.deepEqual(data,before);
 assert.equal(migrateRemovedKarsli(data),false);
 for(const engine of ['stockfish19','clover91']){const supported=savedGame();supported.settings.engine=engine;const snapshot=structuredClone(supported);assert.equal(migrateRemovedKarsli(supported),false);assert.deepEqual(supported,snapshot);}
});

test('unfinished retired engine matches stop while played moves, clocks and saved games survive',()=>{
 for(const side of ['white','black']){
  const data=savedGame();data.settings.opponent='match';data.engineMatch={white:'stockfish19',black:'clover91',paused:false};data.engineMatch[side]='karsli01';
  data.clock={current:{remaining:{w:34000,b:27000},active:null}};data.engineMatchProgress={moves:2,complete:false};data.backgroundResume=true;data.backgroundWaiting={since:100,side:'w'};
  const before=structuredClone(data);assert.equal(migrateRemovedKarsli(data),true);
  assert.equal(data.settings.opponent,'local');assert.equal(data.engineMatch,null);assert.equal(data.backgroundResume,false);assert.equal(data.backgroundWaiting,undefined);assert.equal(data.engineMatchProgress,undefined);
  assert.equal(data.pgn,before.pgn);assert.deepEqual(data.clock,before.clock);assert.deepEqual(data.saved,before.saved);
 }
});

test('only unfinished tournaments involving the removed engine are stopped',()=>{
 const pair={white:'stockfish19',black:'karsli01'},result={...pair,result:'1-0',pgn:savedGame().pgn};
 const tournament={engines:['stockfish19','karsli01'],schedule:[pair,pair],results:[result],stopped:false};
 const before=structuredClone(tournament);assert.equal(migrateRemovedKarsli(null,tournament),true);before.stopped=true;assert.deepEqual(tournament,before);assert.equal(migrateRemovedKarsli(null,tournament),false);
 for(const other of [{...tournament,stopped:false,results:[result,result]},{engines:['stockfish19','clover91'],schedule:[{white:'stockfish19',black:'clover91'}],results:[],stopped:false}]){const copy=structuredClone(other);assert.equal(migrateRemovedKarsli(null,other),false);assert.deepEqual(other,copy);}
});

test('background restoration uses Stockfish for ordinary play and never restarts a retired match',()=>{
 const data=savedGame(),game=new BackgroundGame(data);
 assert.equal(game.next().engine,'stockfish19');assert.equal(data.settings.engine,'karsli01');assert.equal(game.game.pgn(),data.pgn);
 const match=savedGame();match.settings.opponent='match';match.engineMatch={white:'karsli01',black:'stockfish19',tournamentId:'old',round:1,seconds:1};
 const tournament={id:'old',engines:['karsli01','stockfish19'],schedule:[{white:'karsli01',black:'stockfish19'}],results:[],stopped:false};
 const retired=new BackgroundGame(match,tournament);assert.equal(retired.next(),null);
 const state=retired.checkpoint();assert.equal(state.tournament.stopped,true);assert.deepEqual(state.tournament.results,[]);assert.equal(state.data.settings.opponent,'local');assert.equal(state.data.engineMatch,null);assert.equal(state.data.pgn,match.pgn);assert.deepEqual(state.data.saved,match.saved);
 assert.equal(tournament.stopped,false);assert.equal(match.engineMatch.white,'karsli01');
});
