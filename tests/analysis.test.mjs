import test from 'node:test';
import assert from 'node:assert/strict';
import {Chess} from '../dist/vendor/chess.js';
import {describeLine,requestedLines,boardPoint,arrowMarkup,whiteAssessment} from '../dist/analysis.js';
import {parseInfo,StockfishEngine} from '../dist/engine.js';

test('analysis parses PV rank, score, and continuation without accepting bounds',()=>{
  assert.deepEqual(parseInfo('info depth 12 multipv 2 score cp -23 nodes 42 pv e7e5 g1f3'),{depth:12,multipv:2,type:'cp',score:-23,pv:['e7e5','g1f3']});
  assert.equal(parseInfo('info depth 12 score cp 23 lowerbound pv e2e4'),null);
});
test('black-to-move scores and notation are shown from White perspective',()=>{
  const b=new Chess();b.move('e4');
  const line=describeLine(b.fen(),{multipv:2,depth:12,type:'cp',score:52,pv:['e7e5','g1f3','b8c6']});
  assert.equal(line.evaluation,'-0.52');assert.equal(line.continuation,'1… e5 2. Nf3 Nc6');
  assert.equal(line.assessment,'White is slightly worse');
});

test('White assessments use symmetric evaluation bands including boundaries',()=>{
  for(const [score,label] of [[0,'Equal position'],[29,'Equal position'],[-29,'Equal position'],[30,'White is slightly better'],[99,'White is slightly better'],[100,'White is better'],[299,'White is better'],[300,'White is winning'],[-30,'White is slightly worse'],[-99,'White is slightly worse'],[-100,'White is worse'],[-299,'White is worse'],[-300,'White is losing'],[-586,'White is losing']])assert.equal(whiteAssessment(score),label);
  assert.equal(whiteAssessment(NaN),'');
});

test('assessments follow White across both turns and forced-mate signs',()=>{
  for(const turn of ['w','b']){
    const board=new Chess();if(turn==='b')board.move('e4');
    for(const type of ['cp','mate'])for(const whiteWins of [true,false]){
      const score=(type==='mate'?2:586)*(whiteWins?1:-1)*(turn==='w'?1:-1);
      const line=describeLine(board.fen(),{multipv:1,depth:12,type,score,pv:[turn==='w'?'e2e4':'e7e5']});
      assert.equal(line.assessment,whiteWins?'White is winning':'White is losing');
      assert.equal(line.scoreTone,whiteWins?'positive':'negative');
      if(type==='mate')assert.equal(line.evaluation,'#2');
    }
  }
});
test('Black mate notation omits the minus sign and arrows rotate with coordinates',()=>{
  const b=new Chess();b.move('e4');
  const line=describeLine(b.fen(),{multipv:1,depth:8,type:'mate',score:12,pv:['e7e5']});
  assert.equal(line.evaluation,'#12');
  assert.equal(line.scoreTone,'negative');
  assert.equal(line.assessment,'White is losing');
  assert.deepEqual(boardPoint('e2'),[450,650]);assert.deepEqual(boardPoint('e2',true),[350,150]);
  assert.match(arrowMarkup([{uci:'e2e4',rank:1}]),/data-from="e2" data-to="e4"/);
});
test('terminal and forced-move positions request only existing candidates',()=>{
  const b=new Chess('8/8/8/8/8/1k6/r7/K7 w - - 0 1');assert.equal(requestedLines(b,true),1);
  const start=new Chess();assert.equal(requestedLines(start,true),3);assert.equal(requestedLines(start,false),1);
  start.move('e4');assert.equal(requestedLines(start,true),3);assert.equal(requestedLines(start,false),1);
});
test('a MultiPV batch publishes together and only the best line becomes position score',()=>{
  const transport={commands:[],postMessage(c){this.commands.push(c)},terminate(){}};
  const published=[],results=[];
  const e=new StockfishEngine(job=>published.push(job.lines.map(l=>l.multipv)),(_job,_move,info)=>results.push(info),()=>{},()=>transport);
  try{e.receive('uciok');e.receive('readyok');e.request({id:1,fen:new Chess().fen(),multiPV:3,level:20,time:100});
    e.receive('info depth 8 multipv 1 score cp 40 pv e2e4');e.receive('info depth 8 multipv 2 score cp 20 pv d2d4');
    assert.equal(published.length,0);e.receive('info depth 8 multipv 3 score cp 5 pv g1f3');assert.deepEqual(published,[[1,2,3]]);
    e.receive('bestmove e2e4');assert.equal(results[0].score,40);
  }finally{e.destroy();}
});
