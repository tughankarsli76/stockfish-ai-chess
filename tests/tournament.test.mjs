import test from 'node:test';
import assert from 'node:assert/strict';
import {createSchedule,standings,tournamentOutcome} from '../dist/tournament.js';
test('round robin includes every pairing and balances colors',()=>{
 for(let count=2;count<=6;count++)for(let games=1;games<=10;games++)for(const coin of [0,1]){
  const engines=['stockfish19','stockfish18','reckless090','plenty800','pawn201','obsidian160'].slice(0,count),before=[...engines];
  const schedule=createSchedule(engines,games,()=>coin),pairs=count*(count-1)/2;
  assert.equal(schedule.length,pairs*games);assert.deepEqual(engines,before);
  for(const engine of engines){
   const white=schedule.filter(g=>g.white===engine).length,black=schedule.filter(g=>g.black===engine).length;
   assert.equal(white+black,(count-1)*games);assert.ok(Math.abs(white-black)<=1,`${count} engines, ${games} games: ${engine} ${white}W/${black}B`);
  }
  for(let a=0;a<count;a++)for(let b=a+1;b<count;b++){
   const pair=schedule.filter(g=>[g.white,g.black].includes(engines[a])&&[g.white,g.black].includes(engines[b]));
   assert.equal(pair.length,games);
   for(let game=1;game<pair.length;game++)assert.deepEqual(pair[game],{white:pair[game-1].black,black:pair[game-1].white});
  }
 }
});
test('a one-game tournament can start Stockfish as either color',()=>{
 const engines=['stockfish19','stockfish18'];
 assert.deepEqual(createSchedule(engines,1,()=>0),[{white:'stockfish18',black:'stockfish19'}]);
 assert.deepEqual(createSchedule(engines,1,()=>1),[{white:'stockfish19',black:'stockfish18'}]);
});
test('invalid participants and counts rejected',()=>{for(const args of [[['a'],2],[['a','a'],2],[['a','b'],0],[['a','b'],1.5],[['a','b'],11]])assert.throws(()=>createSchedule(...args));});
test('standings score wins draws and losses',()=>{const rows=standings({engines:['a','b','c'],results:[{white:'a',black:'b',result:'1-0'},{white:'b',black:'c',result:'1/2-1/2'},{white:'c',black:'a',result:'0-1'}]});assert.deepEqual(rows.map(r=>[r.id,r.points,r.played]),[['a',2,2],['b',.5,2],['c',.5,2]]);assert.equal(rows[0].wins,2);assert.equal(rows[1].losses,1);});
test('only a finished tournament has final results',()=>{
 const t={engines:['a','b'],schedule:createSchedule(['a','b'],1,()=>1),results:[]};
 assert.equal(tournamentOutcome(t),null);
 t.results.push({...t.schedule[0],result:'0-1'});
 assert.deepEqual(tournamentOutcome(t).winners.map(r=>r.id),['b']);
 assert.equal(tournamentOutcome(t).games,1);
 t.stopped=true;assert.equal(tournamentOutcome(t),null);
});
test('equal points produce joint winners',()=>{
 const t={engines:['a','b'],schedule:createSchedule(['a','b'],1),results:[{white:'a',black:'b',result:'1/2-1/2'}]};
 const outcome=tournamentOutcome(t);
 assert.deepEqual(outcome.winners.map(r=>[r.id,r.points]),[['a',.5],['b',.5]]);
});
