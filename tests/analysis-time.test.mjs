import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeAnalysisTime,analysisMoveTime} from '../dist/features.js';
import {StockfishEngine} from '../dist/engine.js';

test('analysis time migrates retired presets and preserves long and unlimited settings',()=>{
  for(const value of [1,2,null,undefined,'',false,123])assert.equal(normalizeAnalysisTime(value),0);
  assert.equal(normalizeAnalysisTime('20'),20);
  assert.equal(normalizeAnalysisTime(90),90);
  assert.equal(normalizeAnalysisTime(0),0);
});

test('90-second analysis uses milliseconds and can switch to continuous analysis',()=>{
  const transport={commands:[],postMessage(command){this.commands.push(command);},terminate(){}},results=[];
  const engine=new StockfishEngine(()=>{},job=>results.push(job.id),()=>{},()=>transport);
  try{
    engine.receive('uciok');engine.receive('readyok');
    engine.request({id:1,fen:'test position',multiPV:3,level:20,time:analysisMoveTime({time:90})});
    assert.equal(transport.commands.at(-1),'go movetime 90000');
    engine.request({id:2,fen:'test position',multiPV:3,level:20,time:analysisMoveTime({time:0})});
    assert.equal(transport.commands.at(-1),'stop');
    engine.receive('bestmove e2e4');
    assert.deepEqual(results,[]);
    assert.equal(transport.commands.at(-1),'go infinite');
  }finally{engine.destroy();}
});
