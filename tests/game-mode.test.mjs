import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_SETTINGS,computerMoveTime} from '../dist/features.js';
import {StockfishEngine} from '../dist/engine.js';

test('fixed move time uses seconds while game clocks use a separate UCI budget',()=>{
  assert.equal(computerMoveTime(DEFAULT_SETTINGS),10000);
  assert.equal(computerMoveTime({...DEFAULT_SETTINGS,moveTime:17}),17000);
  assert.equal(computerMoveTime({...DEFAULT_SETTINGS,fixedTime:false,moveTime:17}),0);
  assert.equal(computerMoveTime({...DEFAULT_SETTINGS,moveTime:100000}),60000);
});

test('game-clock search sends both clocks and increments and can play on Move Now',()=>{
  const transport={commands:[],postMessage(command){this.commands.push(command);},terminate(){}},results=[];
  const engine=new StockfishEngine(()=>{},(job,move)=>results.push({forceMove:job.forceMove,move}),()=>{},()=>transport);
  try{
    engine.receive('uciok');engine.receive('readyok');
    engine.request({id:1,fen:'test position',computer:true,multiPV:2,level:5,time:0,clock:{wtime:177500,btime:180000,winc:2000,binc:2000}});
    assert.equal(transport.commands.at(-1),'go wtime 177500 btime 180000 winc 2000 binc 2000');
    assert.equal(engine.active.multiPV,2);
    assert.ok(transport.commands.includes('setoption name MultiPV value 2'));
    assert.equal(results.length,0);
    assert.equal(engine.moveNow(),true);
    assert.equal(transport.commands.at(-1),'stop');
    engine.receive('bestmove e2e4');
    assert.deepEqual(results,[{forceMove:true,move:'e2e4'}]);
  }finally{engine.destroy();}
});


test('computer search publishes two evaluations and completes with its chosen move',()=>{
  const transport={commands:[],postMessage(command){this.commands.push(command);},terminate(){}},published=[],results=[];
  const engine=new StockfishEngine(job=>published.push(job.lines.map(line=>line.pv[0])),(job,move,info)=>results.push({computer:job.computer,move,score:info.score}),()=>{},()=>transport);
  try{
    engine.receive('uciok');engine.receive('readyok');
    engine.request({id:1,fen:'test black position',computer:true,multiPV:2,level:20,time:10000});
    engine.receive('info depth 10 multipv 1 score cp 30 pv e7e5');
    assert.equal(published.length,0);
    engine.receive('info depth 10 multipv 2 score cp 15 pv c7c5');
    assert.deepEqual(published,[['e7e5','c7c5']]);
    engine.receive('bestmove e7e5');
    assert.deepEqual(results,[{computer:true,move:'e7e5',score:30}]);
  }finally{engine.destroy();}
});


test('every difficulty preset sends its own Stockfish skill before the search',async()=>{
  const {DIFFICULTIES}=await import('../dist/difficulty.js');
  const transport={commands:[],postMessage(command){this.commands.push(command);},terminate(){}};
  const engine=new StockfishEngine(()=>{},()=>{},()=>{},()=>transport);
  try{
    engine.receive('uciok');engine.receive('readyok');
    assert.equal(new Set(DIFFICULTIES.map(d=>d.level)).size,19);
    for(const [index,difficulty] of DIFFICULTIES.entries()){
      transport.commands.length=0;
      engine.request({id:index,fen:'position',computer:true,multiPV:2,level:Number(difficulty.level),time:100});
      const skill='setoption name Skill Level value '+difficulty.level;
      assert.ok(transport.commands.includes(skill),difficulty.range);
      assert.ok(transport.commands.indexOf(skill)<transport.commands.indexOf('go movetime 100'));
      engine.receive('bestmove e2e4');
    }
  }finally{engine.destroy();}
});

test('switching difficulty cancels the old reply and restores selected strength after analysis',()=>{
  const transport={commands:[],postMessage(command){this.commands.push(command);},terminate(){}},results=[];
  const engine=new StockfishEngine(()=>{},(job,move)=>results.push({id:job.id,move}),()=>{},()=>transport);
  try{
    engine.receive('uciok');engine.receive('readyok');
    engine.request({id:1,fen:'position',computer:true,multiPV:2,level:20,time:10000});
    engine.request({id:2,fen:'position',computer:true,multiPV:2,level:0,time:10000});
    assert.equal(transport.commands.at(-1),'stop');
    engine.receive('bestmove e2e4');
    assert.deepEqual(results,[]);
    assert.equal(engine.active.level,0);
    assert.ok(transport.commands.slice(-4).includes('setoption name Skill Level value 0'));
    engine.receive('info depth 5 multipv 1 score cp 50 pv e2e4');
    engine.receive('info depth 5 multipv 2 score cp 20 pv d2d4');
    engine.moveNow();
    engine.receive('bestmove d2d4');
    assert.deepEqual(results,[{id:2,move:'d2d4'}]); // Use the handicapped bestmove, not the top analysis line.
    engine.request({id:3,fen:'position',computer:false,multiPV:2,level:20,time:0});
    engine.request({id:4,fen:'position',computer:true,multiPV:2,level:0,time:1000});
    engine.receive('bestmove e2e4');
    assert.equal(engine.active.level,0);
    assert.ok(transport.commands.slice(-4).includes('setoption name Skill Level value 0'));
  }finally{engine.destroy();}
});


test('Move fallback uses the selected computer difficulty and stops an existing search first',async()=>{
  const {readFileSync}=await import('node:fs');
  const {runInNewContext}=await import('node:vm');
  const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
  const forceMove=source.slice(source.indexOf('function forceMove(){'),source.indexOf('function clockExpired(){'));
  for(const level of [0,7,20]){
    let requested;
    const context={boardMotion:{running:false},matchActive:()=>false,syncClock(){},clockExpired:()=>false,
      session:{live:true,game:{isGameOver:()=>false,fen:()=> 'position'}},clearTimeout(){},bookTimer:null,
      settings:{openingBook:false,level:String(level)},bestHint:null,requestId:0,computerTurn:()=>true,
      engine:{request:job=>{requested=job;}}};
    runInNewContext(forceMove+'forceMove();',context);
    assert.equal(requested.level,level);
    assert.equal(requested.computer,true);
    assert.equal(requested.forceMove,true);
  }
  let stopped=0;
  runInNewContext(forceMove+'forceMove();',{
    boardMotion:{running:false},matchActive:()=>false,syncClock(){},clockExpired:()=>false,
    session:{live:true,game:{isGameOver:()=>false}},clearTimeout(){},bookTimer:null,
    settings:{fixedTime:true,openingBook:true},validJob:()=>true,
    engine:{active:{computer:true},moveNow(){stopped++;return true;}},
    chooseBookMove(){throw Error('Must finish the selected-strength search before using the book');}
  });
  assert.equal(stopped,1);
});


import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {GameOwner} from '../dist/game-owner.js';
import {GameSession} from '../dist/model.js';
const memory=()=>{const data=new Map();return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};};
test('older tab cannot overwrite game, settings, saved games or clocks after another tab takes over',()=>{
 const storage=memory(),older=new GameOwner(storage,'older');older.claim();
 const original=new GameSession();original.move('e4');older.save('chess-preview-v2',JSON.stringify({pgn:original.game.pgn()}));
 const newer=new GameOwner(storage,'newer');newer.claim();
 original.move('c5');const latest=JSON.stringify({pgn:original.game.pgn(),settings:{level:5},saved:[{id:'saved-game'}],clock:{remaining:{w:175000,b:178000}}});
 assert.equal(newer.save('chess-preview-v2',latest),true);
 for(const stale of ['autosave','engine result','pagehide'])assert.equal(older.save('chess-preview-v2',stale),false);
 assert.equal(storage.getItem('chess-preview-v2'),latest);
 const reloaded=new GameSession();reloaded.load(JSON.parse(storage.getItem('chess-preview-v2')).pgn);
 assert.equal(reloaded.game.fen(),original.game.fen());
 const returned=new GameOwner(storage,'returned');returned.claim();assert.equal(newer.save('chess-preview-v2','stale close'),false);assert.equal(returned.owns(),true);
});
test('app persistence uses the ownership guard, including stale unload and autosave calls',()=>{
 const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
 const storage=memory(),owner=new GameOwner(storage,'a');owner.claim();
 const game=new GameSession();game.move('d4');
 const context=vm.createContext({gameOwner:owner,session:game,settings:{level:20},engineName:()=>"Stockfish 19",engineMatch:null,matchActive:()=>false,tab:'game',saved:[],scores:{},flipped:false,clockSave:()=>({elapsed:12}),localStorage:storage,toast:()=>{}});
 vm.runInContext(source.slice(source.indexOf('function persist(){'),source.indexOf('function syncSettings(){')),context);
 assert.equal(context.persist(),true);const previous=storage.getItem('chess-preview-v2');
 new GameOwner(storage,'b').claim();assert.equal(context.persist(),false);assert.equal(storage.getItem('chess-preview-v2'),previous);
});
test('restoring an earlier review move preserves its historical clock instead of replacing it with the live clock',async()=>{
 const {GameClock}=await import('../dist/clock.js');
 const session=new GameSession();session.load('1. e4 e5 2. Nf3 Nc6',{cursor:1});
 const earlier={remaining:{w:175000,b:180000},expired:null};
 const latest={remaining:{w:160000,b:165000},expired:null};
 const saved={fen:session.game.fen(),minutes:3,increment:0,current:latest,history:[null,earlier]};
 const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
 const context=vm.createContext({session,GameClock,settings:{gameMinutes:3,increment:0},performance});
 vm.runInContext(source.slice(source.indexOf('function resetGameClock('),source.indexOf('function advanceMoveClock(')),context);
 context.resetGameClock(saved);
 assert.equal(context.clockHistory[1],earlier);
 assert.deepEqual({...context.gameClock.remaining},latest.remaining);
 assert.deepEqual({...context.clockHistory[session.length].remaining},latest.remaining);
 assert.equal(session.cursor,1);
});
test('count-up clocks accumulate separately across moves, pause, and resume without resetting',()=>{
 const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
 const context=vm.createContext({});vm.runInContext(source.slice(source.indexOf('function advanceMoveClock('),source.indexOf('function syncClock(){')),context);
 const clock={elapsed:{w:0,b:0},running:null,since:0};
 context.advanceMoveClock(clock,'start','w',true,0);
 context.advanceMoveClock(clock,'after-white','b',true,2200);
 context.advanceMoveClock(clock,'after-black','w',true,5300);
 assert.deepEqual(clock.elapsed,{w:2200,b:3100});
 context.advanceMoveClock(clock,'after-black','w',false,6500);
 context.advanceMoveClock(clock,'after-black','w',true,20000);
 context.advanceMoveClock(clock,'third-move','b',true,20800);
 assert.deepEqual(clock.elapsed,{w:4200,b:3100});
});


test('native transport retries a busy engine slot and stops retrying when cancelled',async()=>{
 const {NativeEngineTransport}=await import('../dist/native-engine.js');
 const originalFetch=globalThis.fetch;
 let calls=0;
 try{
  const success={status:200,ok:true};
  globalThis.fetch=async()=>++calls===1?{status:429,body:{cancel:async()=>{}}}:success;
  const transport={closed:false,controller:new AbortController()};
  assert.equal(await NativeEngineTransport.prototype.open.call(transport),success);
  assert.equal(calls,2);
  calls=0;globalThis.fetch=async()=>{calls++;return {status:429,body:{cancel:async()=>{}}};};
  const pending=NativeEngineTransport.prototype.open.call(transport);
  setTimeout(()=>{transport.closed=true;transport.controller.abort();},10);
  assert.equal(await pending,null);assert.equal(calls,1);
 }finally{globalThis.fetch=originalFetch;}
});
