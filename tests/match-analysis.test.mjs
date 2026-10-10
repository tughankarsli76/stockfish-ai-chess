import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {GameSession} from '../dist/model.js';
const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
function harness(){
 const calls=[];const context={mateCelebration:{stop(){}},tab:'game',settings:{opponent:'match',engine:'other'},engineMatch:{white:'white-engine',black:'black-engine',paused:false},analysisPaused:false,selected:null,
 session:{live:true,position:()=>({turn:()=> 'b'}),game:{isGameOver:()=>false,turn:()=> 'b'}},clockExpired:()=>false,gameClock:{tick(){}},render(){},
 persist(){},analyze:()=>calls.push('analyze'),pauseEngineMatch(){context.engineMatch.paused=true;calls.push('pause');},
 $:()=>({classList:{toggle(){}},setAttribute(){}})};
 vm.createContext(context);
 vm.runInContext(source.slice(source.indexOf('function matchActive()'),source.indexOf('function engineName(')),context);
 vm.runInContext(source.slice(source.indexOf('function computerTurn()'),source.indexOf('function validJob(')),context);
 vm.runInContext(source.slice(source.indexOf('function setTab('),source.indexOf('function showDialog(')),context);
 vm.runInContext(source.slice(source.indexOf('function toggleAnalysis('),source.indexOf('function currentAnalysisLines(')),context);
 return {context,calls};
}
test('viewing analysis preserves a live match search and selects the side-to-move engine',()=>{
 const {context:c,calls}=harness();c.setTab('analysis');assert.equal(c.computerTurn(),true);assert.equal(c.selectedEngine(),'black-engine');assert.deepEqual(calls,[]);
 c.setTab('game');assert.deepEqual(calls,[]);assert.equal(c.engineMatch.paused,false);
});
test('explicit match restart starts a search; graph view and manual pause remain paused',()=>{
 const {context:c,calls}=harness();c.setTab('game',true);assert.deepEqual(calls,['analyze']);
 c.setTab('graph');assert.equal(c.engineMatch.paused,true);assert.equal(c.computerTurn(),false);
 c.setTab('analysis');assert.equal(c.engineMatch.paused,true);assert.equal(c.computerTurn(),false);
});
test('ordinary computer games keep their existing analysis behavior',()=>{
 const {context:c,calls}=harness();c.settings.opponent='computer';c.setTab('analysis');assert.equal(c.computerTurn(),false);assert.equal(c.selectedEngine(),'other');assert.deepEqual(calls,['analyze']);
});
test('a setup position returns to playable Game on the second Analysis tap',()=>{
 const {context:c}=harness();c.settings.opponent='local';c.session=new GameSession();
 c.session.load('4k3/8/8/8/8/8/4P3/4K3 w - - 0 1');
 const fen=c.session.position().fen(),pgn=c.session.game.pgn();
 c.toggleAnalysis();assert.equal(c.tab,'analysis');
 c.toggleAnalysis();assert.equal(c.tab,'game');assert.equal(c.analysisPaused,false);
 assert.equal(c.session.position().fen(),fen);assert.equal(c.session.game.pgn(),pgn);
 c.session.move('e4');assert.equal(c.session.game.get('e4').type,'p');
});
test('the Analysis toggle preserves reviewed moves and the full game',()=>{
 const {context:c}=harness();c.settings.opponent='local';c.session=new GameSession();
 c.session.load('1. e4 e5 2. Nf3 Nc6');c.session.navigate(1);
 const pgn=c.session.game.pgn(),fen=c.session.position().fen();
 c.toggleAnalysis();c.toggleAnalysis();
 assert.equal(c.tab,'game');assert.equal(c.session.cursor,1);
 assert.equal(c.session.game.pgn(),pgn);assert.equal(c.session.position().fen(),fen);
});
test('toggling Analysis does not interrupt a live engine match',()=>{
 const {context:c,calls}=harness();
 c.toggleAnalysis();c.toggleAnalysis();
 assert.equal(c.tab,'game');assert.equal(c.engineMatch.paused,false);
 assert.equal(c.computerTurn(),true);assert.deepEqual(calls,[]);
});
test('returning from Analysis resumes the computer turn in Game',()=>{
 const {context:c}=harness();c.settings.opponent='computer';c.settings.side='w';
 c.toggleAnalysis();assert.equal(c.computerTurn(),false);
 c.toggleAnalysis();assert.equal(c.tab,'game');assert.equal(c.computerTurn(),true);
});
test('a disconnected engine does not prevent leaving the Analysis screen',()=>{
 const {context:c,calls}=harness();c.settings.opponent='local';c.engineFailed=true;
 c.toggleAnalysis();c.toggleAnalysis();
 assert.equal(c.tab,'game');assert.deepEqual(calls,['analyze','analyze']);
});
