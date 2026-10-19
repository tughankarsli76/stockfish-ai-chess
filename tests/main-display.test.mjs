import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {GameSession,gameStatus} from '../dist/model.js';
import {AnalysisDisplay,describeLine,arrowMarkup,LINE_COLORS} from '../dist/analysis.js';
import {whiteWdl} from '../dist/features.js';
import {timeResult} from '../dist/clock.js';

function element(){
 return {children:[],text:'',hidden:false,dataset:{},style:{setProperty(){}},attributes:{},classList:{toggle(){}},
  set textContent(value){this.text=String(value);this.children=[];},get textContent(){return this.text+this.children.map(x=>typeof x==='string'?x:x.textContent).join('');},
  replaceChildren(...items){this.text='';this.children=items;},append(...items){this.children.push(...items);},setAttribute(key,value){this.attributes[key]=value;}};
}
function harness(){
 const session=new GameSession(),elements=new Map(),node=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);};
 const c={session,$:node,analysisDisplay:new AnalysisDisplay(),connectedEngine:'stockfish19',tab:'game',analysisFen:null,analysis:null,analysisLines:[],analysisProgress:null,
  settings:{showAnalysis:true,analysisArrows:true,openingBook:false,wdl:true},flipped:false,engineReady:true,engineFailed:false,
  matchActive:()=>false,clockExpired:()=>false,whiteWdl,arrowMarkup,LINE_COLORS,timeResult,bookMoves:()=>[],bookSuggestions:()=>[],openingForPosition:()=>null,
  moveNotation(text){const span=element();span.textContent=text;return span;},t:x=>x,
  document:{documentElement:{lang:'en'},createElement:element,createTextNode:text=>text}};
 c.api={state:()=>({...c,clockExpired:null}),status:gameStatus,displayAnalysis:()=>c.displayAnalysis()};vm.createContext(c);
 const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8'),menus=readFileSync(new URL('../dist/menus.js',import.meta.url),'utf8');
 vm.runInContext(app.slice(app.indexOf('function currentAnalysisLines(){'),app.indexOf('function renderEvaluationBar(){')),c);
 vm.runInContext(app.slice(app.indexOf('function appendTablebaseIndicator('),app.indexOf('function onInfo(')),c);
 vm.runInContext(menus.slice(menus.indexOf('  function renderInsights(){'),menus.indexOf('  fillResourceOptions();')),c);
 function publish(uci,score=35){
  c.analysisFen=session.position().fen();c.analysisLines=[describeLine(c.analysisFen,{pv:[uci],score,type:'cp',multipv:1,depth:18})];
  c.analysis={wdl:[350,600,50]};c.analysisProgress={fen:c.analysisFen,depth:18,nodes:123456,nps:120000,tbHits:0};
 }
 function render(){c.renderSearchCount();c.renderInsights();c.renderAnalysisArrows();}
 return {c,node,session,publish,render};
}

test('main screen keeps statistics, score, move labels, arrows and WDL until the next position reports',()=>{
 const {c,node,session,publish,render}=harness();publish('e2e4');render();
 const oldStats=node('positionCount').textContent,oldInsights=node('gameInsights').textContent,oldWdl=node('wdlSummary').textContent,oldArrows=node('arrows').innerHTML;
 assert.match(oldStats,/Depth\s+18/);assert.match(oldStats,/\+0\.35/);assert.match(oldInsights,/1\. e4/);assert.ok(oldArrows);assert.ok(oldWdl);
 session.move('e4');c.analysisProgress=null;c.analysisLines=[];c.engineReady=false;render();
 assert.equal(node('positionCount').hidden,false);assert.equal(node('positionCount').textContent,oldStats);
 assert.equal(node('gameInsights').textContent,oldInsights);assert.equal(node('wdlSummary').textContent,oldWdl);assert.equal(node('arrows').innerHTML,oldArrows);
 assert.equal(node('positionCount').attributes['aria-busy'],'true');assert.equal(c.currentAnalysisLines().length,0,'cached lines never become current engine data');
 c.analysisProgress={fen:session.position().fen(),depth:1,nodes:50,nps:1000,tbHits:0};render();
 assert.match(node('positionCount').textContent,/Depth\s+1/);assert.match(node('positionCount').textContent,/\+0\.35/);
 publish('e7e5',-90);render();
 assert.match(node('gameInsights').textContent,/1\.\.\. e5/);assert.match(node('positionCount').textContent,/\+0\.90/);
 assert.notEqual(node('wdlSummary').textContent,oldWdl);assert.equal(node('positionCount').attributes['aria-busy'],'false');
});

test('main-screen cache clears on a new game or chosen engine, and follows ordinary match handoffs',()=>{
 const {c,node,session,publish,render}=harness();publish('e2e4');render();const oldStats=node('positionCount').textContent;
 session.move('e4');c.analysisLines=[];c.analysisProgress=null;c.connectedEngine='reckless090';c.matchActive=()=>true;render();
 assert.equal(node('positionCount').hidden,false);assert.equal(node('positionCount').textContent,oldStats);
 c.matchActive=()=>false;c.connectedEngine='plenty800';render();assert.equal(node('positionCount').hidden,true);assert.equal(node('wdlSummary').textContent,'');
 publish('e7e5');render();session.reset();c.analysisLines=[];c.analysisProgress=null;render();
 assert.equal(node('positionCount').hidden,true);assert.equal(node('gameInsights').textContent,'');assert.equal(node('arrows').innerHTML,'');
});
