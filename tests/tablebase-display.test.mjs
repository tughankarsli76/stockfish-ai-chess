import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {GameSession} from '../dist/model.js';
import {StockfishEngine} from '../dist/engine.js';

const fen='6k1/8/8/8/8/8/5Q2/6K1 w - - 0 1';
function element(){
 return {children:[],className:'',textContent:'',hidden:false,attributes:{},dataset:{},
  replaceChildren(){this.children=[];},append(...children){this.children.push(...children);},setAttribute(name,value){this.attributes[name]=value;}};
}
function indicators(node){return (node.className==='tablebase-indicator'?[node]:[]).concat(node.children.flatMap(child=>typeof child==='object'?indicators(child):[]));}
function harness(language='en'){
 const session=new GameSession();session.load(fen);
 const elements=new Map(),node=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);};
 const c={session,$:node,tab:'analysis',analysisProgress:null,engineReady:true,engineFailed:false,
  document:{documentElement:{lang:language},createElement:element,createTextNode:text=>text},clockExpired:()=>false,currentAnalysisLines:()=>[]};
 vm.createContext(c);
 const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
 vm.runInContext(source.slice(source.indexOf('function appendTablebaseIndicator('),source.indexOf('function onInfo(')),c);
 return {c,node};
}

test('Analysis and Game both show a TB badge only after reported tablebase hits',()=>{
 const {c,node}=harness();
 for(const hits of [0,7]){
  c.analysisProgress={fen,nodes:1000,depth:12,nps:50000,tbHits:hits};
  c.tab='analysis';c.renderAnalysisProgress();
  c.tab='game';c.renderSearchCount();
  for(const id of ['engineDepth','positionCount']){
   const badges=indicators(node(id));assert.equal(badges.length,hits?1:0,id);
   if(hits){assert.equal(badges[0].textContent,'TB');assert.equal(badges[0].attributes['aria-label'],'Tablebases used');}
  }
 }
 assert.equal(node('engineDepth').children.length,3,'Keep the existing three search-stat groups');
});

test('both views clear tablebase evidence for a different position, reset search, or absent progress',()=>{
 const {c,node}=harness('es');
 c.tab='game';
 const render=()=>{c.renderAnalysisProgress();c.renderSearchCount();};
 c.analysisProgress={fen,nodes:20,depth:1,nps:1000,tbHits:4};render();
 assert.equal(indicators(node('engineDepth'))[0].attributes['aria-label'],'Bases de finales utilizadas');
 for(const progress of [{fen:'different position',nodes:50,tbHits:99},{fen,nodes:0,depth:0,tbHits:0},null]){
  c.analysisProgress=progress;render();
  assert.equal(indicators(node('engineDepth')).length,0);
  assert.equal(indicators(node('positionCount')).length,0);
 }
});

test('infinite MultiPV Analysis keeps tablebases configured and displays hit-only UCI reports',()=>{
 const {c,node}=harness(),commands=[];
 const engine=new StockfishEngine(()=>{},()=>{},()=>{},()=>({postMessage(command){commands.push(command);},terminate(){}}),job=>{
  c.analysisProgress={fen:job.fen,nodes:job.nodes,depth:job.searchDepth,nps:job.nps,tbHits:job.tbHits};c.renderAnalysisProgress();
 });
 try{
  engine.receive('uciok');engine.receive('readyok');
  engine.request({id:1,fen,computer:false,level:20,multiPV:1,time:50});engine.receive('bestmove f2f3');
  engine.request({id:2,fen,computer:false,level:20,multiPV:3,time:0});
  assert.equal(engine.configuration.SyzygyPath,'<empty>');
  assert.ok(commands.indexOf('setoption name SyzygyPath value <empty>')<commands.indexOf('position fen '+fen));
  assert.equal(commands.at(-1),'go infinite');
  assert.equal(engine.active.multiPV,3);
  engine.receive('info depth 1 nodes 100 tbhits 7');
  assert.equal(engine.active.lines.length,0,'A complete PV batch is not required for tablebase evidence');
  assert.equal(indicators(node('engineDepth')).length,1);
  engine.request({id:3,fen,computer:false,level:20,multiPV:3,time:0});
  engine.receive('info nodes 1000 tbhits 99');
  assert.equal(engine.active.tbHits,7,'Ignore reports from the cancelled search');
  engine.receive('bestmove f2f3');
  assert.equal(indicators(node('engineDepth')).length,0,'New searches clear the previous badge');
 }finally{engine.destroy();}
});
