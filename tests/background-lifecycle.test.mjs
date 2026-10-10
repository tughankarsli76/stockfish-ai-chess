import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

function harness(){
 const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
 const start=source.indexOf("window.addEventListener('chess-native-lifecycle'");
 const end=source.indexOf("window.addEventListener('pagehide'",start);
 const calls=[];
 const c={matchActive:()=>false,captureNativeClock:()=>{},restoreNativeClock:()=>{},finishNativeClock:()=>{},publishSearchProgress:()=>{},renderStatus:()=>{},boardMotion:{running:false},benchmarkMode:false,backgroundGameEligible:()=>false,winCelebration:{stop:()=>{}},mateCelebration:{stop(){}},nativeSuspended:false,requestId:17,bookTimer:1,progressTimer:2,engineReady:true,analysisComplete:false,tab:'game',analysisPaused:false,settings:{time:10},continuousTurnSearch:()=>false,
  analysisUpdates:{cancel:()=>calls.push('cancel-display'),flush:()=>calls.push('flush-display')},gameClock:{run:value=>calls.push(['clock',value])},
  moveClock:{},session:{position:()=>({}),game:{fen:()=> 'position',turn:()=> 'w'}},
  advanceMoveClock:()=>{},persist:()=>calls.push('persist'),clearTimeout:()=>{},
  engine:{active:{id:17},pending:null,suspend:()=>calls.push('stop-engine'),resume:()=>calls.push('resume-engine')},
  pauseEngineMatch:()=>calls.push('pause-match'),render:()=>calls.push('render'),analyze:()=>calls.push('analyze'),window:{addEventListener:(_name,fn)=>c.event=fn}};
 vm.runInNewContext(source.slice(start,end),c);return {c,calls};
}
test('backgrounding pauses clocks without cancelling or replacing the native search',()=>{
 const {c,calls}=harness();c.event({detail:'background'});
 assert.equal(c.progressTimer,null);assert.equal(c.nativeSuspended,true);assert.equal(c.requestId,17);assert.equal(c.engine.active.id,17);
 assert.ok(calls.includes('persist'));assert.ok(!calls.includes('stop-engine'));
 c.event({detail:'foreground'});c.event({detail:'foreground-ready'});
 assert.equal(c.nativeSuspended,false);assert.ok(!calls.includes('analyze'));
});
test('returning retains completed results but restarts a deferred book move',()=>{
 const {c,calls}=harness();c.engine.active=null;c.analysisComplete=true;
 c.event({detail:'foreground-ready'});assert.ok(!calls.includes('analyze'));
 c.analysisComplete=false;c.event({detail:'foreground-ready'});assert.ok(calls.includes('analyze'));
});
test('forced suspension still cancels searches and invalidates stale results',()=>{
 const {c,calls}=harness();c.event({detail:'suspend'});
 assert.equal(c.requestId,18);assert.equal(c.engineReady,false);assert.ok(calls.includes('stop-engine'));
 c.event({detail:'resume'});assert.ok(calls.includes('resume-engine'));assert.ok(calls.includes('analyze'));
});

test('returning restarts stopped continuous main-screen thinking',()=>{
 const {c,calls}=harness();c.engine.active=null;c.analysisComplete=true;c.continuousTurnSearch=()=>true;
 c.event({detail:'foreground-ready'});assert.ok(calls.includes('analyze'));
});
test('returning restarts unlimited analysis but respects paused analysis',()=>{
 const {c,calls}=harness();c.engine.active=null;c.analysisComplete=true;c.tab='analysis';c.settings.time=0;
 c.event({detail:'foreground-ready'});assert.equal(calls.filter(x=>x==='analyze').length,1);
 c.analysisPaused=true;c.event({detail:'foreground-ready'});assert.equal(calls.filter(x=>x==='analyze').length,1);
});

test('an active normal-game search bypasses the headless handoff',()=>{
 const {c,calls}=harness();c.backgroundGameEligible=()=>true;
 c.chessNative={backgroundGame:()=>{throw Error('Must keep the current search');}};
 c.event({detail:'background'});c.event({detail:{type:'foreground',searchFinishedAt:0}});c.event({detail:'foreground-ready'});
 assert.equal(c.requestId,17);assert.equal(c.engine.active.id,17);assert.ok(!calls.includes('stop-engine'));assert.ok(!calls.includes('analyze'));
});
test('returning during a move animation does not start a duplicate search',()=>{
 const {c,calls}=harness();c.engine.active=null;c.boardMotion.running=true;
 c.event({detail:'foreground-ready'});assert.ok(!calls.includes('analyze'));
});
test('cancelling the system background activity pauses the match',()=>{
 const {c,calls}=harness();c.event({detail:'match-background-expired'});
 assert.deepEqual(calls,['pause-match']);assert.equal(c.requestId,17);
});

for(const type of ['background','match-inactive','screen-lock'])test(type+' pauses an engine match without handing it to background play',()=>{
 const {c,calls}=harness();c.matchActive=()=>true;c.engineMatch={paused:false};
 c.backgroundGameEligible=()=>{throw Error('Paused matches must not be handed off');};
 c.event({detail:type});
 assert.equal(c.engineMatch.paused,true);assert.equal(c.nativeSuspended,true);assert.equal(c.requestId,18);
 assert.equal(c.engineReady,false);assert.equal(c.progressTimer,null);assert.ok(calls.includes('stop-engine'));
 assert.ok(calls.some(x=>Array.isArray(x)&&x[0]==='clock'&&x[1]===null));
 if(type==='background')assert.ok(calls.includes('persist'));
 c.event({detail:'foreground'});assert.equal(c.engineMatch.paused,true);
});
