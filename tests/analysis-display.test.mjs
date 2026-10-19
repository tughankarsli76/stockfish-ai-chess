import test from 'node:test';
import assert from 'node:assert/strict';
import {AnalysisDisplay} from '../dist/analysis.js';

function fixture(){
 const display=new AnalysisDisplay(),game={},lines=[{rank:1,uci:'e2e4',evaluation:'+0.35'}];
 const input={game,engine:'stockfish19',fen:'first',lines,progress:{depth:18,nodes:123456,nps:120000,tbHits:4},wdl:[35,60,5]};
 display.update(input);return {display,input,lines};
}

test('a new position keeps PVs, stats and White-perspective WDL through empty search startup',()=>{
 const {display,input,lines}=fixture();
 const pending={...input,fen:'next',lines:[],progress:null,wdl:null};
 let shown=display.update(pending);
 assert.equal(shown.lines,lines);assert.deepEqual(shown.wdl,[35,60,5]);assert.equal(shown.pending,true);
 assert.equal(shown.progress.depth,18);assert.equal(shown.progress.nps,120000);assert.equal(shown.progress.nodes,123456);
 assert.equal(shown.progress.tbHits,0,'retaining numbers must not invent tablebase use in the next search');
 pending.progress={depth:0,nodes:0,nps:null,tbHits:0};shown=display.update(pending);
 assert.equal(shown.progress.depth,18);assert.equal(shown.lines,lines);
 assert.deepEqual(pending.lines,[],'the engine position must remain separate from cached display lines');
});

test('fresh stats update independently and a complete new PV batch replaces old lines and WDL',()=>{
 const {display,input}=fixture();
 const pending={...input,fen:'next',lines:[],wdl:null,progress:{depth:1,nodes:20,nps:500,tbHits:0}};
 let shown=display.update(pending);assert.equal(shown.progress.depth,1);assert.deepEqual(shown.wdl,[35,60,5]);
 const lines=[{rank:1,uci:'e7e5',evaluation:'-0.10'}];
 shown=display.update({...pending,lines,wdl:[10,70,20]});assert.equal(shown.lines,lines);
 assert.equal(shown.pending,false);assert.deepEqual(shown.wdl,[10,70,20]);
 shown=display.update({...pending,lines,wdl:null});assert.equal(shown.wdl,null,'an engine without WDL must not keep an older score indefinitely');
});

test('new games and engine changes clear old data; continuing from history keeps it',()=>{
 const {display,input,lines}=fixture(),branch={};display.followMove(branch);
 let shown=display.update({...input,game:branch,fen:'branch',lines:[],progress:null,wdl:null});
 assert.equal(shown.lines,lines);assert.deepEqual(shown.wdl,[35,60,5]);
 shown=display.update({...input,game:{},lines:[],progress:null,wdl:null});
 assert.deepEqual(shown.lines,[]);assert.equal(shown.progress,null);assert.equal(shown.wdl,null);
 display.update(input);
 shown=display.update({...input,engine:'other',lines:[],progress:null,wdl:null});
 assert.deepEqual(shown.lines,[]);assert.equal(shown.progress,null);assert.equal(shown.wdl,null);
});

test('terminal results replace PVs and WDL and cannot reappear on an earlier unevaluated position',()=>{
 const {display,input}=fixture();
 let shown=display.update({...input,terminal:true});
 assert.deepEqual(shown.lines,[]);assert.equal(shown.wdl,null);assert.equal(shown.pending,false);
 shown=display.update({...input,fen:'history',lines:[],wdl:null,progress:null});
 assert.deepEqual(shown.lines,[]);assert.equal(shown.wdl,null);assert.equal(shown.pending,true);
});

test('alternating engines in the same computer match do not blank the presentation',()=>{
 const {display,input,lines}=fixture();
 const shown=display.update({...input,fen:'next',engine:'other',continuingMatch:true,lines:[],wdl:null,progress:null});
 assert.equal(shown.lines,lines);assert.equal(shown.progress.depth,18);assert.deepEqual(shown.wdl,[35,60,5]);
});
