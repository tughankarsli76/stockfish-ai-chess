import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {GameSession,gameStatus} from '../dist/model.js';
import {AnalysisDisplay,EvaluationBar,describeLine,arrowMarkup,LINE_COLORS} from '../dist/analysis.js';
import {bookMoves,bookSuggestions,openingForPosition,notation,FIGURINES,whiteWdl} from '../dist/features.js';
import {timeResult,timeWinner} from '../dist/clock.js';

function element(){
 const classes=new Set();
 return {children:[],text:'',hidden:false,dataset:{},attributes:{},style:{setProperty(){}},
  classList:{toggle(name,enabled){if(enabled)classes.add(name);else classes.delete(name);},contains:name=>classes.has(name)},
  set textContent(value){this.text=String(value);this.children=[];},
  get textContent(){return this.text+this.children.map(child=>typeof child==='string'?child:child.textContent).join('');},
  replaceChildren(...children){this.text='';this.children=children;},append(...children){this.children.push(...children);},
  setAttribute(name,value){this.attributes[name]=value;}};
}

function harness(){
 const session=new GameSession(),elements=new Map();
 const node=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);};
 const c={session,$:node,tab:'analysis',flipped:false,settings:{opponent:'match',openingBook:true,showAnalysis:true,analysisArrows:true,figurine:false,animations:false,wdl:true},
  engineMatch:{white:'stockfish19',black:'reckless090',paused:false},analysisDisplay:new AnalysisDisplay(),evaluationBar:new EvaluationBar(),connectedEngine:'stockfish19',
  analysis:null,analysisFen:null,analysisLines:[],analysisProgress:null,analysisPaused:false,engineFailed:false,expired:null,
  matchActive:()=>c.settings.opponent==='match'&&!!c.engineMatch,clockExpired:()=>c.expired,clockStatus:()=>timeResult(c.expired),
  gameClock:{get expired(){return c.expired;}},mateCelebration:{render(){}},renderAnalysisProgress(){},renderAnalysisArrows(){},
  gameStatus,notation,FIGURINES,whiteWdl,bookMoves,bookSuggestions,openingForPosition,arrowMarkup,LINE_COLORS,timeResult,timeWinner,t:text=>text,
  document:{documentElement:{lang:'en'},body:element(),createElement:element,createTextNode:text=>text}};
 c.api={state:()=>({...c,clockExpired:c.expired}),status:gameStatus,displayAnalysis:()=>c.displayAnalysis()};
 vm.createContext(c);
 const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
 const menus=readFileSync(new URL('../dist/menus.js',import.meta.url),'utf8');
 vm.runInContext(app.slice(app.indexOf('function currentAnalysisLines(){'),app.indexOf('function renderEvaluationBar(){')),c);
 vm.runInContext(menus.slice(menus.indexOf('function moveNotation('),menus.indexOf('const labels=')),c);
 vm.runInContext(menus.slice(menus.indexOf('  function renderInsights(){'),menus.indexOf('  fillResourceOptions();')),c);
 c.menus={renderInsights:c.renderInsights};
 vm.runInContext(app.slice(app.indexOf('function renderEvaluationBar(){'),app.indexOf('function patchSettings(')),c);
 function publish(uci){
  c.analysisFen=session.position().fen();
  c.analysisLines=[describeLine(c.analysisFen,{pv:[uci],score:35,type:'cp',multipv:1,depth:18})];
 }
 return {c,node,session,publish,render:()=>c.renderAnalysis()};
}

function moveLabels(container){
 const moves=container.children.at(-1);
 return moves.children.filter(child=>typeof child!=='string').map(child=>child.attributes['aria-label']||child.textContent);
}

test('Analysis shows the same opening-book choices as Game before the first engine search',()=>{
 const {c,node,session,render}=harness();render();
 assert.equal(c.analysisLines.length,0,'No UCI result is needed to display the opening book');
 assert.equal(node('analysisBookInsights').hidden,false);
 assert.equal(node('analysisBookInsights').children[0].textContent,'Book');
 assert.equal(node('analysisBookInsights').children[1].textContent,'Starting position');
 assert.deepEqual(moveLabels(node('analysisBookInsights')),bookSuggestions(session.position()).slice(0,2).map(move=>move.label));
 assert.match(node('analysisBookInsights').textContent,/1\.e4 \(\d+%\)/);
 assert.equal(node('analysisLines').hidden,true);
 assert.equal(node('analysisEvaluationBar').hidden,true,'A match has no evaluation bar during book play');
 assert.equal(node('analysisMessage').hidden,true,'Do not show an empty search placeholder over the book');
 assert.equal(node('gameInsights').textContent,node('analysisBookInsights').textContent);
 assert.equal(node('gameInsights').attributes['aria-busy'],'false');
});

test('book names and move numbering follow both sides while switching Game and Analysis',()=>{
 const {c,node,session,render}=harness();render();
 const startingText=node('analysisBookInsights').textContent;
 session.move('d4');render();
 assert.notEqual(node('analysisBookInsights').textContent,startingText);
 assert.ok(moveLabels(node('analysisBookInsights')).every(label=>label.startsWith('1…')));
 assert.equal(node('gameInsights').textContent,node('analysisBookInsights').textContent);
 session.move('Nf6');c.settings.figurine=true;render();
 assert.match(node('analysisBookInsights').children[1].textContent,/^A45: .*Indian/);
 assert.ok(moveLabels(node('analysisBookInsights')).every(label=>label.startsWith('2.')));
 assert.deepEqual(moveLabels(node('analysisBookInsights')),moveLabels(node('gameInsights')));
 const gameBook=node('gameInsights').textContent;
 assert.ok(gameBook.includes(FIGURINES.N),'The same figurine notation is available in both views');
 c.tab='game';render();
 assert.equal(node('analysisBookInsights').hidden,true);
 assert.equal(node('gameInsights').textContent,gameBook);
 c.tab='analysis';render();
 assert.equal(node('analysisBookInsights').hidden,false);
 assert.equal(node('analysisBookInsights').textContent,gameBook);
});

test('book presentation takes priority over cached PVs and hands back to actual engine analysis',()=>{
 const {c,node,session,publish,render}=harness();publish('g1f3');render();
 assert.equal(node('analysisBookInsights').hidden,false);
 assert.equal(node('analysisLines').hidden,true,'Cached engine lines must not compete with book play');
 c.settings.openingBook=false;render();
 assert.equal(node('analysisBookInsights').hidden,true);
 assert.equal(node('analysisBookInsights').textContent,'');
 assert.equal(node('analysisLines').hidden,false);
 assert.equal(node('analysisEvaluationBar').hidden,false,'Turning the book off restores match evaluation');
 assert.equal(node('analysisEvaluationLabel').textContent,'+0.35');
 assert.equal(node('analysisLines').children[0].dataset.move,'g1f3');
 assert.match(node('analysisLines').textContent,/\+0\.35/);
 c.settings.openingBook=true;
 session.load('6k1/8/8/8/8/8/5Q2/6K1 w - - 0 1');
 assert.equal(bookSuggestions(session.position()).length,0);
 publish('f2f3');render();
 assert.equal(node('analysisBookInsights').hidden,true);
 assert.equal(node('analysisBookInsights').textContent,'');
 assert.equal(node('analysisLines').hidden,false);
 assert.equal(node('analysisEvaluationBar').hidden,false);
 assert.equal(node('analysisLines').children[0].dataset.move,'f2f3');
 assert.match(node('analysisLines').textContent,/Qf3/);
 assert.doesNotMatch(node('gameInsights').textContent,/Book|Starting position/);
});

test('a timeout or completed game replaces book play with the result',()=>{
 const {c,node,session,render}=harness();render();
 assert.ok(bookSuggestions(session.position()).length>0);
 c.expired='w';render();
 assert.equal(node('analysisBookInsights').hidden,true);
 assert.equal(node('analysisBookInsights').textContent,'');
 assert.equal(node('analysisMessage').hidden,false);
 assert.equal(node('analysisMessage').textContent,'Black wins on Time');
 assert.equal(node('analysisEvaluationBar').hidden,false,'The completed match result replaces book-only presentation');
 assert.equal(node('analysisEvaluationLabel').textContent,'0–1');
 assert.equal(node('gameInsights').textContent,'Black wins on Time');
 c.expired=null;session.load('1. f3 e5 2. g4 Qh4#');render();
 assert.equal(node('analysisBookInsights').hidden,true);
 assert.equal(node('analysisMessage').hidden,false);
 assert.equal(node('analysisMessage').textContent,'Checkmate — Black wins');
 assert.equal(node('analysisEvaluationBar').hidden,false);
 assert.equal(node('analysisEvaluationLabel').textContent,'0–1');
 assert.equal(node('gameInsights').textContent,'Checkmate — Black wins');
});

test('ordinary position analysis keeps displaying engine PVs even in an opening-book position',()=>{
 const {c,node,publish,render}=harness();c.settings.opponent='local';c.engineMatch=null;
 publish('g1f3');render();
 assert.equal(node('analysisBookInsights').hidden,true);
 assert.equal(node('analysisBookInsights').textContent,'');
 assert.equal(node('analysisLines').hidden,false);
 assert.equal(node('analysisEvaluationBar').hidden,false,'Standalone Analysis keeps its evaluation bar');
 assert.equal(node('analysisEvaluationLabel').textContent,'+0.35');
 assert.equal(node('analysisLines').children[0].dataset.move,'g1f3');
 assert.match(node('analysisLines').textContent,/Nf3/);
 assert.match(node('gameInsights').textContent,/BookStarting position/,'Existing Game book suggestions remain available');
});

test('human versus computer Analysis shows current book moves on both turns and reviewed positions',()=>{
 const {c,node,session,publish,render}=harness();c.settings.opponent='computer';c.settings.side='w';c.engineMatch=null;
 publish('g1f3');render();
 assert.equal(node('analysisBookInsights').hidden,false);
 assert.equal(node('analysisBookInsights').children[1].textContent,'Starting position');
 assert.deepEqual(moveLabels(node('analysisBookInsights')),bookSuggestions(session.position()).slice(0,2).map(move=>move.label));
 assert.equal(node('analysisLines').hidden,true,'Book play takes precedence over a cached engine variation');
 assert.equal(node('analysisEvaluationBar').hidden,false,'The computer-game evaluation bar keeps its existing behavior');
 assert.equal(node('analysisEvaluationLabel').textContent,'+0.35');
 for(const move of bookSuggestions(session.position()).slice(0,2))assert.ok(node('arrows').innerHTML.includes('data-from="'+move.uci.slice(0,2)+'" data-to="'+move.uci.slice(2,4)+'"'),'Book arrows match the displayed choices');
 assert.ok(!node('arrows').innerHTML.includes('data-from="g1" data-to="f3"'),'Cached PV arrows do not override opening-book choices');
 session.move('d4');render();
 assert.ok(moveLabels(node('analysisBookInsights')).every(label=>label.startsWith('1…')));
 assert.equal(node('analysisBookInsights').textContent,node('gameInsights').textContent);
 assert.equal(node('analysisEvaluationBar').hidden,false);
 session.move('Nf6');render();
 assert.match(node('analysisBookInsights').children[1].textContent,/^A45: .*Indian/);
 assert.ok(moveLabels(node('analysisBookInsights')).every(label=>label.startsWith('2.')));
 const liveBook=node('analysisBookInsights').textContent;
 session.navigate(1);render();
 assert.equal(session.live,false);
 assert.equal(node('analysisBookInsights').hidden,false,'Reviewed opening positions retain their own book display');
 assert.ok(moveLabels(node('analysisBookInsights')).every(label=>label.startsWith('1…')));
 assert.deepEqual(moveLabels(node('analysisBookInsights')),bookSuggestions(session.position()).slice(0,2).map(move=>move.label));
 assert.notEqual(node('analysisBookInsights').textContent,liveBook);
 c.settings.side='b';render();
 assert.equal(node('analysisBookInsights').hidden,false,'Book visibility does not depend on which side the person chose');
});

test('computer-game book display hands back to engine PVs outside the book or when Book is off',()=>{
 const {c,node,session,publish,render}=harness();c.settings.opponent='computer';c.engineMatch=null;
 publish('g1f3');render();assert.equal(node('analysisBookInsights').hidden,false);
 c.settings.openingBook=false;render();
 assert.equal(node('analysisBookInsights').hidden,true);
 assert.equal(node('analysisBookInsights').textContent,'');
 assert.equal(node('analysisLines').hidden,false);
 assert.equal(node('analysisLines').children[0].dataset.move,'g1f3');
 assert.equal(node('analysisEvaluationBar').hidden,false);
 assert.ok(node('arrows').innerHTML.includes('data-from="g1" data-to="f3"'),'Turning Book off restores the engine arrow');
 c.settings.openingBook=true;session.load('6k1/8/8/8/8/8/5Q2/6K1 w - - 0 1');
 assert.equal(bookSuggestions(session.position()).length,0);
 publish('f2f3');render();
 assert.equal(node('analysisBookInsights').hidden,true);
 assert.equal(node('analysisBookInsights').textContent,'');
 assert.equal(node('analysisLines').hidden,false);
 assert.equal(node('analysisLines').children[0].dataset.move,'f2f3');
 assert.equal(node('analysisEvaluationBar').hidden,false);
});

test('match evaluation remains hidden across book turns and history, then returns as soon as book play ends',()=>{
 const {c,node,session,render}=harness();render();
 assert.equal(node('analysisEvaluationBar').hidden,true);
 for(const move of ['d4','Nf6']){
  session.move(move);render();
  assert.equal(node('analysisBookInsights').hidden,false);
  assert.equal(node('analysisEvaluationBar').hidden,true);
 }
 session.navigate(1);render();
 assert.equal(node('analysisEvaluationBar').hidden,true);
 c.tab='game';render();assert.equal(node('analysisEvaluationBar').hidden,true);
 c.tab='analysis';render();assert.equal(node('analysisEvaluationBar').hidden,true);
 session.load('6k1/8/8/8/8/8/5Q2/6K1 w - - 0 1');
 c.analysisLines=[];c.analysisProgress=null;render();
 assert.equal(node('analysisBookInsights').hidden,true);
 assert.equal(node('analysisEvaluationBar').hidden,false,'Do not wait for the first search result to restore the evaluation bar');
 assert.equal(node('analysisEvaluationLabel').textContent,'—','No engine score is invented when leaving the book');
});

test('computer-game timeout and checkmate take priority over opening-book presentation',()=>{
 const {c,node,session,render}=harness();c.settings.opponent='computer';c.engineMatch=null;
 session.load('1. d4 Nf6');render();
 assert.equal(node('analysisBookInsights').hidden,false);
 assert.ok(node('arrows').innerHTML,'Book arrows are present before the flag falls');
 c.expired='b';render();
 assert.equal(node('analysisBookInsights').hidden,true);
 assert.equal(node('analysisMessage').hidden,false);
 assert.equal(node('analysisMessage').textContent,'White wins on Time');
 assert.equal(node('analysisEvaluationBar').hidden,false);
 assert.equal(node('analysisEvaluationLabel').textContent,'1–0');
 assert.equal(node('arrows').innerHTML,'','A timeout must clear book arrows with the book details');
 session.navigate(1);render();
 assert.equal(session.live,false);
 assert.equal(node('analysisBookInsights').hidden,false,'The earlier position can still show its opening book after a live-game timeout');
 for(const move of bookSuggestions(session.position()).slice(0,2))assert.ok(node('arrows').innerHTML.includes('data-from="'+move.uci.slice(0,2)+'" data-to="'+move.uci.slice(2,4)+'"'),'Reviewed opening arrows belong to the reviewed side and position');
 session.navigate(session.length);render();
 assert.equal(node('analysisBookInsights').hidden,true);
 assert.equal(node('arrows').innerHTML,'','Returning to the timed-out live position hides book arrows again');
 c.expired=null;session.load('1. f3 e5 2. g4 Qh4#');render();
 assert.equal(node('analysisBookInsights').hidden,true);
 assert.equal(node('analysisMessage').textContent,'Checkmate — Black wins');
 assert.equal(node('analysisEvaluationBar').hidden,false);
 assert.equal(node('analysisEvaluationLabel').textContent,'0–1');
});
