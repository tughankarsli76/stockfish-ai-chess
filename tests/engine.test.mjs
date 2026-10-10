import test from 'node:test';
import assert from 'node:assert/strict';
import {StockfishEngine} from '../dist/engine.js';
test('tablebases use the installed path automatically and ignore retired limits',()=>{
  const commands=[];
  const engine=new StockfishEngine(()=>{},()=>{},()=>{},()=>({postMessage(command){commands.push(command);},terminate(){}}));
  try{
    engine.receive('uciok');engine.receive('readyok');
    for(const [id,value] of [undefined,0,3,4,5].entries()){
      engine.request({id,fen:'position '+id,level:20,time:50,tablebasePieces:value});
      assert.equal(commands.at(-1),'go movetime 50');
      engine.receive('bestmove a1b1');
    }
    assert.ok(commands.includes('setoption name SyzygyPath value <empty>'));
    assert.ok(commands.indexOf('setoption name SyzygyPath value <empty>')<commands.indexOf('position fen position 0'));
    assert.equal(commands.some(command=>command.startsWith('setoption name SyzygyProbeLimit')),false);
  }finally{engine.destroy();}
});
test('tablebase hits update without PV and reset between searches',()=>{
  const progress=[];
  const engine=new StockfishEngine(()=>{},()=>{},()=>{},()=>({postMessage(){},terminate(){}}),job=>progress.push(job.tbHits));
  try {
    engine.receive('uciok');engine.receive('readyok');
    engine.request({id:1,fen:'first',level:20,time:50});
    engine.receive('info depth 1 nodes 10 tbhits 0');
    engine.receive('info depth 1 nodes 10 tbhits 7');
    assert.equal(progress.at(-1),7);
    engine.receive('info depth 1 nodes 10 tbhits 3');
    assert.equal(engine.active.tbHits,7);
    engine.request({id:2,fen:'next',level:20,time:50});
    engine.receive('info nodes 30 tbhits 99');
    assert.equal(progress.at(-1),7);
    engine.receive('bestmove a1b1');
    assert.equal(progress.at(-1),0);
    assert.equal(engine.active.tbHits,0);
  }finally{engine.destroy();}
});
test('cancelled engine searches cannot deliver stale moves into a new position',()=>{const previous=globalThis.Worker;class FakeWorker{constructor(){this.commands=[];}postMessage(m){this.commands.push(m);}terminate(){}}globalThis.Worker=FakeWorker;const results=[];const engine=new StockfishEngine(()=>{},job=>results.push(job.id),()=>{},()=>new FakeWorker());try{engine.receive('uciok');engine.receive('readyok');engine.request({id:1,fen:'old',level:5,time:50});engine.request({id:2,fen:'new',level:5,time:50});assert.equal(engine.active.id,1);assert.equal(engine.pending.id,2);assert.equal(engine.worker.commands.at(-1),'stop');engine.receive('bestmove e2e4');assert.deepEqual(results,[]);assert.equal(engine.active.id,2);engine.receive('bestmove d2d4');assert.deepEqual(results,[2]);}finally{engine.destroy();globalThis.Worker=previous;}});
