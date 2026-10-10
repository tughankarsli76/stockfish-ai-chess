import test from 'node:test';
import assert from 'node:assert/strict';
import {AnalysisUpdates} from '../dist/analysis.js';
import {GameSession} from '../dist/model.js';

test('mate-search bursts publish only the newest complete lines and flush on completion',t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  const seen=[],updates=new AnalysisUpdates((job,info)=>seen.push([job.id,info.score,job.lines]));
  const job={id:1,lines:[]};
  for(let depth=1;depth<=100;depth++){
    const info={depth,type:'mate',score:depth>50?5:7};
    job.lines=[info,{...info,multipv:2}];updates.push(job,info);
  }
  assert.equal(seen.length,0);
  t.mock.timers.tick(100);
  assert.equal(seen.length,1);assert.equal(seen[0][1],5);assert.equal(seen[0][2][0].depth,100);
  const final={depth:101,type:'mate',score:4};job.lines=[final];updates.push(job,final);
  updates.flush();assert.equal(seen.length,2);assert.equal(seen[1][1],4);
  t.mock.timers.tick(100);assert.equal(seen.length,2);
});

test('changing positions cancels queued analysis and keeps the new search separate',t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  const seen=[],updates=new AnalysisUpdates(job=>seen.push(job.id));
  updates.push({id:1,lines:[]},{});updates.cancel();
  t.mock.timers.tick(100);assert.deepEqual(seen,[]);
  updates.push({id:2,lines:[]},{});t.mock.timers.tick(100);assert.deepEqual(seen,[2]);
});

test('repeated game-screen reads do not replay history; mutations invalidate the cache',()=>{
  const session=new GameSession();session.load('1. e4 e5 2. Nf3 Nc6');
  let calls=0;const history=session.game.history.bind(session.game);
  session.game.history=(...args)=>{calls++;return history(...args);};
  for(let i=0;i<100;i++){assert.equal(session.length,4);assert.ok(session.live);assert.equal(session.position(),session.game);session.moves;}
  assert.equal(calls,0);
  session.move('Bb5');assert.equal(session.length,5);assert.equal(calls,1);
  session.undo();assert.equal(session.length,4);assert.equal(calls,2);
  session.navigate(2);assert.equal(session.position().fen(),session.moves[2].before);
  session.move('Bc4',{fromReview:true});assert.deepEqual(session.moves.map(m=>m.san),['e4','e5','Bc4']);
  session.reset();assert.equal(session.length,0);
  session.load('1. d4 d5');assert.equal(session.length,2);
});
