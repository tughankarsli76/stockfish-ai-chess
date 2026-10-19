import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {describeLine,evaluationBarState} from '../dist/analysis.js';
import {GameSession} from '../dist/model.js';
import {timeWinner} from '../dist/clock.js';

test('evaluation balance is symmetric, bounded, and neutral until a score arrives',()=>{
 assert.deepEqual(evaluationBarState(null),{whiteShare:.5,label:'—',favored:'white'});
 assert.equal(evaluationBarState({type:'cp',whiteScore:0}).whiteShare,.5);
 for(const score of [22,100,500,100000]){
  const white=evaluationBarState({type:'cp',whiteScore:score}),black=evaluationBarState({type:'cp',whiteScore:-score});
  assert.ok(white.whiteShare>.5&&white.whiteShare<=.98);
  assert.ok(black.whiteShare<.5&&black.whiteShare>=.02);
  assert.ok(Math.abs(white.whiteShare+black.whiteShare-1)<1e-12);
  assert.equal(white.label,'+'+(score/100).toFixed(2));assert.equal(black.favored,'black');
 }
});

test('engine scores and mate signs keep White perspective on either turn',()=>{
 const session=new GameSession();
 for(const [move,pv] of [[null,'e2e4'],['e4','e7e5']]){
  if(move)session.game.move(move);
  for(const type of ['cp','mate']){
   const line=describeLine(session.game.fen(),{score:35,type,pv:[pv],multipv:1,depth:12});
   const state=evaluationBarState(line),black=session.game.turn()==='b';
   assert.equal(state.favored,black?'black':'white');
   assert.equal(state.label,type==='mate'?'M35':black?'-0.35':'+0.35');
  }
 }
 for(const [result,share] of [['1-0',1],['0-1',0],['1/2-1/2',.5]])assert.equal(evaluationBarState({type:'cp',whiteScore:300},result).whiteShare,share);
});

function harness(){
 const session=new GameSession(),bar={hidden:false,style:{setProperty(key,value){this[key]=value;}},dataset:{},setAttribute(key,value){this[key]=value;}},label={};
 const c={session,tab:'analysis',clockExpired:()=>false,gameClock:{expired:null},timeWinner,evaluationBarState,
  currentAnalysisLines:()=>[], $:id=>id==='analysisEvaluationBar'?bar:label};
 vm.createContext(c);
 const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
 vm.runInContext(app.slice(app.indexOf('function renderEvaluationBar(){'),app.indexOf('function renderAnalysis(){')),c);
 return {c,bar,label,session};
}

test('Analysis uses rank one, clears stale scores, and hides the bar on other screens',()=>{
 const {c,bar,label}=harness();
 c.currentAnalysisLines=()=>[{rank:2,type:'cp',whiteScore:800},{rank:1,type:'cp',whiteScore:-35}];
 c.renderEvaluationBar();assert.equal(label.textContent,'-0.35');assert.equal(bar.dataset.favored,'black');
 assert.equal(bar.hidden,false);assert.ok(parseFloat(bar.style['--white-share'])<50);
 c.currentAnalysisLines=()=>[];c.renderEvaluationBar();assert.equal(label.textContent,'—');assert.equal(bar.style['--white-share'],'50%');
 for(const tab of ['game','graph']){c.tab=tab;c.renderEvaluationBar();assert.equal(bar.hidden,true);}
});

test('mate, draw and live clock results override scores without leaking into history',()=>{
 const {c,label,bar,session}=harness();
 session.load('1. f3 e5 2. g4 Qh4#');c.renderEvaluationBar();assert.equal(label.textContent,'0–1');assert.equal(bar.style['--white-share'],'0%');
 session.navigate(1);c.renderEvaluationBar();assert.equal(label.textContent,'—');
 session.reset();c.clockExpired=()=>true;c.gameClock.expired='b';c.renderEvaluationBar();assert.equal(label.textContent,'1–0');
 session.load('1. e4');session.navigate(0);c.renderEvaluationBar();assert.equal(label.textContent,'—');
 c.clockExpired=()=>false;session.load('[SetUp "1"]\n[FEN "8/8/8/8/8/8/3k4/K7 w - - 0 1"]\n\n*');
 c.renderEvaluationBar();assert.equal(label.textContent,'½–½');assert.equal(bar.style['--white-share'],'50%');
});
