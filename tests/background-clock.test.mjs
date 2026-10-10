import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {GameClock} from '../dist/clock.js';

function setup({computer=false,fixedTime=false}={}){
 const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');let now=1000,fen='before',side='b';
 const c={nativeBackgroundClock:null,nativeNextClock:null,settings:{fixedTime},gameClock:new GameClock(1,0,()=>0),moveClock:{running:'b',elapsed:{w:0,b:0}},engine:{active:{computer}},session:{game:{fen:()=>fen,turn:()=>side,isGameOver:()=>false}},Date:{now:()=>now}};
 c.gameClock.run('b');vm.createContext(c);vm.runInContext(source.slice(source.indexOf('function captureNativeClock('),source.indexOf('function backgroundGameEligible(')),c);
 c.captureNativeClock(true);c.gameClock.run(null);c.moveClock.running=null;
 return {c,advance:ms=>now+=ms,move:()=>{fen='after';side='w';}};
}
test('human clock includes the full time away during a retained analysis',()=>{
 const {c,advance}=setup();advance(7000);c.restoreNativeClock(3000);c.finishNativeClock();assert.equal(c.gameClock.remaining.b,53000);assert.equal(c.gameClock.remaining.w,60000);
});
test('completed computer move divides away time between computer and human',()=>{
 const {c,advance,move}=setup({computer:true});advance(9000);c.restoreNativeClock(4000);assert.equal(c.gameClock.remaining.b,57000);assert.equal(c.gameClock.remaining.w,60000);move();c.finishNativeClock();assert.equal(c.gameClock.remaining.w,54000);c.finishNativeClock();assert.equal(c.gameClock.remaining.w,54000);
});
test('count-up clocks retain thinking time across minimize and return',()=>{
 const {c,advance,move}=setup({computer:true,fixedTime:true});advance(9000);c.restoreNativeClock(4000);move();c.finishNativeClock();assert.deepEqual(c.moveClock.elapsed,{w:6000,b:3000});
});
test('expired clocks reject late moves and do not charge an unapplied next turn',()=>{
 const {c,advance}=setup({computer:true});advance(70000);c.restoreNativeClock(65000);assert.equal(c.gameClock.expired,'b');c.finishNativeClock();assert.equal(c.gameClock.remaining.w,60000);
});
