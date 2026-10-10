import test from 'node:test';
import assert from 'node:assert/strict';
import {StockfishEngine} from '../dist/engine.js';

test('live depth updates without a PV or node change and resets with the search',()=>{
  const progress=[],transport={postMessage(){},terminate(){}};
  const engine=new StockfishEngine(()=>{},()=>{},()=>{},()=>transport,job=>progress.push([job.id,job.nodes,job.searchDepth]));
  try{
    engine.receive('readyok');
    engine.request({id:1,fen:'position',computer:true,level:20,time:0});
    engine.receive('info depth 35 seldepth 48 nodes 1234567');
    assert.deepEqual(progress.at(-1),[1,1234567,35]);
    engine.receive('info depth 36');
    assert.deepEqual(progress.at(-1),[1,1234567,36]);
    engine.receive('info depth 34 nodes 1234600');
    engine.receive('info seldepth 52');
    assert.deepEqual(progress.at(-1),[1,1234600,36]);
    engine.request({id:2,fen:'position',computer:true,level:20,time:0});
    engine.receive('info depth 99 nodes 9999999');
    assert.deepEqual(progress.at(-1),[1,1234600,36]);
    engine.receive('bestmove e2e4');
    assert.deepEqual(progress.at(-1),[2,0,0]);
    engine.receive('info depth 1 nodes 20');
    assert.deepEqual(progress.at(-1),[2,20,1]);
  }finally{engine.destroy();}
});

test('search totals update independently of PV batches without counting repeated nodes twice',()=>{
  const transport={postMessage(){},terminate(){}},progress=[],lines=[];
  const engine=new StockfishEngine(job=>lines.push(job.lines),()=>{},()=>{},()=>transport,job=>progress.push([job.id,job.nodes]));
  try{
    engine.receive('uciok');engine.receive('readyok');
    engine.request({id:1,fen:'position',multiPV:3,level:20,time:0});
    engine.receive('info depth 10 multipv 1 score cp 30 nodes 1000 pv e2e4');
    engine.receive('info depth 10 multipv 2 score cp 20 nodes 1000 pv d2d4');
    assert.equal(lines.length,0);
    assert.deepEqual(progress,[[1,0],[1,1000]]);
    engine.receive('info depth 10 multipv 3 score cp 10 nodes 1000 pv g1f3');
    assert.equal(lines.length,1);
    engine.receive('info depth 10 score cp 35 lowerbound nodes 1500 pv e2e4');
    engine.receive('info nodes 2300 nps 10000');
    engine.receive('info nodes 2200');
    engine.receive('info nodes 9007199254740992');
    assert.deepEqual(progress,[[1,0],[1,1000],[1,1500],[1,2300]]);
    // Replacement search cannot inherit totals from the cancelled search.
    engine.request({id:2,fen:'position',computer:true,level:20,time:0});
    engine.receive('info nodes 9999');
    assert.deepEqual(progress.at(-1),[1,2300]);
    engine.receive('bestmove e2e4');
    assert.deepEqual(progress.at(-1),[2,0]);
    engine.receive('info nodes 42');
    assert.deepEqual(progress.at(-1),[2,42]);
    engine.receive('bestmove d2d4');
    engine.receive('info nodes 10000');
    assert.deepEqual(progress.at(-1),[2,42]);
  }finally{engine.destroy();}
});

 test('speed follows reported NPS, including decreases, and resets for each search',()=>{
  const progress=[];
  const engine=new StockfishEngine(()=>{},()=>{},()=>{},()=>({postMessage(){},terminate(){}}),job=>progress.push(job.nps));
  try{
    engine.receive('readyok');engine.request({id:1,fen:'first',level:20,time:0});
    assert.equal(progress.at(-1),null);
    engine.receive('info nodes 100 nps 2400000');assert.equal(progress.at(-1),2400000);
    engine.receive('info nps 1800000');assert.equal(progress.at(-1),1800000);
    engine.receive('info depth 3');assert.equal(progress.at(-1),1800000);
    engine.request({id:2,fen:'second',level:20,time:0});
    engine.receive('info nps 9900000');assert.equal(progress.at(-1),1800000);
    engine.receive('bestmove e2e4');assert.equal(progress.at(-1),null);
    engine.receive('info nps 0');assert.equal(progress.at(-1),0);
  }finally{engine.destroy();}
});
