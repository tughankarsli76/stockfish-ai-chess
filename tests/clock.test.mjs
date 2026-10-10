import test from 'node:test';
import assert from 'node:assert/strict';
import {GameClock,clockLabel,gameMinutes,moveIncrement} from '../dist/clock.js';

test('clock charges elapsed time only to the moving player and applies one increment',()=>{
 let now=0;const clock=new GameClock(3,2,()=>now);
 clock.run('w');now=750;clock.tick();now=2500;clock.tick();
 assert.deepEqual(clock.remaining,{w:177500,b:180000});
 assert.equal(clock.finishMove('w'),true);assert.equal(clock.remaining.w,179500);
 clock.run('b');now+=1000;clock.tick();assert.equal(clock.remaining.b,179000);assert.equal(clock.remaining.w,179500);
});
test('analysis and review pauses do not spend time; saved clocks restore without charging closed time',()=>{
 let now=0;const clock=new GameClock(3,0,()=>now);clock.run('w');now=1000;clock.run(null);
 const data=clock.snapshot();now+=60000;clock.tick();assert.equal(clock.remaining.w,179000);
 const restored=new GameClock(3,0,()=>now);assert.equal(restored.restore(data),true);now+=60000;restored.tick();assert.equal(restored.remaining.w,179000);
 restored.run('w');now+=500;assert.equal(restored.uci().wtime,178500);
});
test('elapsed time survives delayed ticks, expiration blocks increments, and snapshots support undo',()=>{
 let now=0;const clock=new GameClock(3,5,()=>now),before=clock.snapshot();
 clock.run('b');now=180001;assert.equal(clock.tick(),'b');assert.equal(clock.remaining.b,0);
 assert.equal(clock.finishMove('b'),false);assert.equal(clock.remaining.b,0);
 clock.run('w');assert.equal(clock.running,null);
 assert.equal(clock.restore(before),true);assert.equal(clock.expired,null);assert.equal(clock.remaining.b,180000);
 assert.equal(clock.restore({remaining:{w:-1,b:0}}),false);
});
test('clock settings and labels cover slider limits and zero increments',()=>{
 assert.equal(gameMinutes(undefined),3);assert.equal(gameMinutes(999),180);assert.equal(moveIncrement(undefined),0);assert.equal(moveIncrement(999),60);
 assert.equal(clockLabel(180000),'3:00');assert.equal(clockLabel(179999),'3:00');assert.equal(clockLabel(179000),'2:59');assert.equal(clockLabel(0),'0:00');
});

test('one-minute tournament clock expires after 60 seconds with no increment',()=>{
 let now=0;const clock=new GameClock(1,0,()=>now);
 assert.deepEqual(clock.remaining,{w:60000,b:60000});
 clock.run('w');now=1000;clock.finishMove('w');assert.equal(clock.remaining.w,59000);
 clock.run('b');now=61000;assert.equal(clock.tick(),'b');assert.equal(clock.remaining.b,0);
});
