import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {GameSession,gameStatus} from '../dist/model.js';
import {timeResult,timeWinner} from '../dist/clock.js';

function element(){
 const classes=new Set();
 return {hidden:false,textContent:'',children:[],classList:{toggle(name,on){if(on)classes.add(name);else classes.delete(name);},contains:name=>classes.has(name)},setAttribute(){},replaceChildren(...items){this.children=items;},append(...items){this.children.push(...items);}};
}
function harness(){
 const session=new GameSession();session.load('1. e4');
 const elements=new Map(),node=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);};
 const state={session,settings:{showAnalysis:false,openingBook:true,wdl:true},analysis:{wdl:[900,50,50]},analysisLines:[],analysisFen:session.position().fen(),clockExpired:'b'};
 const c={api:{state:()=>state,status:gameStatus},$:node,document:{createElement:element,body:element()},timeResult,timeWinner,
 bookSuggestions:()=>[{label:'1...e5'}],openingForPosition:()=>({eco:'B00',name:'Opening'}),whiteWdl:()=>[90,5,5],t:x=>x,
 settings:state.settings,session,tab:'analysis',matchActive:()=>true,clockExpired:()=>!!state.clockExpired,gameClock:{expired:'b'},clockStatus:()=>timeResult(state.clockExpired),
 currentAnalysisLines:()=>[{uci:'e7e5',rank:1}],analysisPaused:false,engineFailed:false,gameStatus,
 mateCelebration:{render(position,winner){c.winner=winner;}},displayAnalysis:()=>({lines:[],pending:false}),renderEvaluationBar(){},renderAnalysisProgress(){},renderAnalysisArrows(){}};
 vm.createContext(c);
 const menus=readFileSync(new URL('../dist/menus.js',import.meta.url),'utf8');
 vm.runInContext(menus.slice(menus.indexOf('  function renderInsights(){'),menus.indexOf('  fillResourceOptions();')),c);
 c.menus={renderInsights:c.renderInsights};
 const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
 vm.runInContext(app.slice(app.indexOf('function renderAnalysis(){'),app.indexOf('function patchSettings(')),c);
 return {c,state,node};
}

test('time wins stay visible above the king with analysis disabled and book data present',()=>{
 const {c,state,node}=harness();
 for(const expired of ['b','w']){
  state.clockExpired=expired;c.renderInsights();
  const result=node('gameInsights');
  assert.equal(result.hidden,false);assert.equal(result.classList.contains('checkmate-result'),true);
  assert.equal(result.children.length,1);assert.equal(result.children[0].textContent,timeResult(expired));
  assert.equal(node('wdlSummary').textContent,'');
 }
});

test('Analysis shows the bold time result even with a cached engine line',()=>{
 const {c,state,node}=harness();
 for(const expired of ['b','w']){
  state.clockExpired=expired;c.gameClock.expired=expired;c.renderAnalysis();
  assert.equal(node('analysisMessage').hidden,false);
  assert.equal(node('analysisMessage').textContent,timeResult(expired));
  assert.equal(node('analysisMessage').classList.contains('checkmate-result'),true);
  assert.equal(node('analysisLines').children.length,0);assert.equal(node('engineBadge').hidden,true);
  assert.equal(c.winner,timeWinner(expired));
 }
});

test('reviewing an earlier move removes the live timeout result and celebration',()=>{
 const {c,node,state}=harness();c.renderAnalysis();state.session.navigate(0);c.currentAnalysisLines=()=>[];c.renderAnalysis();
 assert.equal(node('gameInsights').hidden,true);
 assert.equal(node('gameInsights').classList.contains('checkmate-result'),false);
 assert.equal(node('analysisMessage').hidden,true);assert.equal(c.winner,null);
});
