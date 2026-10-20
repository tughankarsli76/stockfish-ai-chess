import {nativeIntegration} from './app.js';
import {recentGames as chessComGames} from './chesscom.js';
import {recentLichessGames} from './lichess.js';
import {Chess} from './vendor/chess.js';
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const passed=[];
// Only temporary result views are exercised: the app's game and settings are untouched.
export async function gameEndAnimationAssets(){
 const [{CheckmateCelebration,WinCelebration},{CELEBRATIONS}]=await Promise.all([import('./celebration.js'),import('./celebration-choice.js')]);
 const assert=(condition,message)=>{if(!condition)throw Error(message);};
 const visible=node=>!!node&&!node.hidden&&node.getClientRects().length>0&&getComputedStyle(node).display!=='none'&&getComputedStyle(node).visibility!=='hidden';
 const pixels=(canvas,region=[0,0,560,200])=>{
  const scale=canvas.width/560,[x,y,w,h]=region.map(value=>Math.round(value*scale));
  const rgba=canvas.getContext('2d',{willReadFrequently:true}).getImageData(x,y,w,h).data;
  let opaque=0,emerald=0;
  for(let i=0;i<rgba.length;i+=4)if(rgba[i+3]>32){opaque++;if(rgba[i+1]>rgba[i]*1.12&&rgba[i+1]>rgba[i+2]*1.08)emerald++;}
  return {opaque,emerald};
 };
 const host=document.createElement('div');host.dataset.integrationFixture='game-end-assets';
 Object.assign(host.style,{position:'fixed',left:'0',top:'0',width:'340px',zIndex:'2000',pointerEvents:'none',display:'grid',gap:'8px'});
 const containers=['game','analysis'].map(view=>{const node=document.createElement('div');node.className='mate-celebration';node.dataset.view=view;host.append(node);return node;});
 document.body.append(host);
 let selected='samurai';const celebration=new CheckmateCelebration(containers,()=>selected),confetti=new WinCelebration(),position=new Chess();
 const result={scenesChecked:0,viewsChecked:0,animationOffCases:0,noAnimatedKing:true,offWinnerColors:true,confettiBothModes:false,confettiCleaned:false,archerCrystallized:false,archerTargetCleared:false,archerFinalHasCharacter:false,archerCompleted:false,temporaryContainersRemoved:false,scenePixels:[]};
 const noStars=()=>containers.every(node=>[...node.querySelectorAll('.mate-king,.mate-halo,.mate-star')].every(child=>!visible(child)));
 try{
  assert(CELEBRATIONS.length===10,'Expected all ten bundled game-end scenes');
  for(const [index,name] of CELEBRATIONS.entries()){
   selected=name;const winner=index%2?'b':'w';
   celebration.render(position,winner,true,'result',{});
   const loaded=await Promise.all(containers.map(node=>celebration.scene(node).renderFinal(winner)));
   assert(loaded.every(Boolean),'Bundled animation asset failed to decode: '+name);
   assert(noStars(),'Animated result exposed a starred king: '+name);
   for(const node of containers){
    const canvases=[...node.querySelectorAll('canvas')].filter(visible),canvas=canvases[0];
    assert(node.dataset.animation===name&&node.dataset.winner===(winner==='w'?'white':'black'),'Result scene or winner differs between views: '+name);
    assert(canvases.length===1&&canvas.classList.contains('mate-'+name),'Wrong or multiple animation canvases visible: '+name);
    const count=pixels(canvas).opaque;assert(count>200,'Decoded animation canvas is empty: '+name);
    result.scenePixels.push({name,view:node.dataset.view,opaque:count});result.viewsChecked++;
   }
   result.scenesChecked++;
  }
  assert(!matchMedia('(prefers-reduced-motion: reduce)').matches,'Full animation regression requires Reduce Motion off in the isolated test app');
  for(const winner of ['w','b'])for(const view of ['game','analysis']){
   celebration.render(position,winner,false,'result',{});celebration.play(view);confetti.play();
   await delay(1450);
   assert(confetti.active&&confetti.canvas.isConnected&&getComputedStyle(confetti.canvas).pointerEvents==='none','Original confetti did not run with animations off');
   for(const node of containers){
    const king=node.querySelector('.mate-king'),stars=[...node.querySelectorAll('.mate-star')];
    const correct=node.dataset.animation==='king'&&node.dataset.winner===(winner==='w'?'white':'black')&&visible(king)&&getComputedStyle(king).color===(winner==='w'?'rgb(250, 250, 250)':'rgb(17, 18, 24)');
    assert(correct,'Animations off did not show the original winner-colored king');
    assert(stars.length===12&&stars.every(visible),'Original stars are missing in animations-off mode');
    assert([...node.querySelectorAll('canvas')].every(canvas=>!visible(canvas)),'A scene remained visible with animations off');
   }
   const active=containers.find(node=>node.dataset.view===view);
   assert([...active.querySelectorAll('.mate-star')].some(star=>Number(getComputedStyle(star).opacity)>0),'Original king stars did not animate');
   result.animationOffCases++;confetti.stop();celebration.stop(false);
  }
  selected='emerald-archer';celebration.render(position,'w',true,'result',{});
  assert((await Promise.all(containers.map(node=>celebration.scene(node).renderFinal('w')))).every(Boolean),'Archer assets did not settle in both views');
  const scene=celebration.scene(containers[0]),target=[365,84,102,92];
  confetti.play();celebration.play('game');const started=performance.now();let emeraldPixels=0,samples=0;
  assert(scene.active&&confetti.active,'Archer and original confetti did not start together');
  result.confettiBothModes=true;
  while(scene.active&&performance.now()-started<14000){
   await delay(35);const elapsed=performance.now()-started;samples++;
   if(elapsed>=3500&&elapsed<=4250)emeraldPixels=Math.max(emeraldPixels,pixels(scene.canvas,target).emerald);
   assert(noStars(),'Archer playback exposed a starred winning king');
  }
  const elapsedMs=performance.now()-started;
  assert(!scene.active&&elapsedMs>=7500&&elapsedMs<14000,'Archer did not complete its real 7.6-second sequence');
  assert(emeraldPixels>20,'The defeated king did not visibly crystallize into emerald');
  assert(pixels(scene.canvas,target).opaque===0,'Archer ending retained the defeated king or crystal debris');
  assert(pixels(scene.canvas).opaque>200,'Archer disappeared at the end of its sequence');
  assert(!confetti.active&&!confetti.canvas,'Original confetti did not clean itself up');
  assert(containers.every(node=>visible(node.querySelector('.mate-emerald-archer'))),'Switching result views lost the settled archer');
  Object.assign(result,{archerCrystallized:true,archerTargetCleared:true,archerFinalHasCharacter:true,archerCompleted:true,confettiCleaned:true,emeraldPixels,archerElapsedMs:elapsedMs,animationSamples:samples});
 }finally{
  confetti.stop();celebration.stop(false);host.remove();result.temporaryContainersRemoved=!host.isConnected;
 }
 return result;
}
export function trackMoveFeedback(){
 window.__restoreMoveFeedback?.();
 const events=[];
 const restore=[];
 for(const [method,kind] of [['playMoveSound','sound'],['playMoveHaptics','haptic']]){
  const play=chessNative[method];
  restore.push(()=>{chessNative[method]=play;});
  chessNative[method]=function(capture=false){
   const animations=[...document.querySelectorAll('#board .moving-piece')].flatMap(piece=>piece.getAnimations());
   const event={kind,capture:capture===true,duringMove:animations.some(animation=>animation.playState==='running'),elapsedMs:Math.max(0,...animations.map(animation=>Number(animation.currentTime)||0))};
   events.push(event);
   return Promise.resolve(play.call(this,capture)).then(accepted=>{event.accepted=accepted;return accepted;});
  };
 }
 window.__moveFeedback=events;
 window.__restoreMoveFeedback=()=>{for(const reset of restore)reset();};
}
export async function engineMatchBookDisplay(){
 const api=nativeIntegration,$=id=>document.getElementById(id),{bookSuggestions}=await import('./features.js');
 const assert=(condition,message)=>{if(!condition)throw Error(message);};
 const result={bookPositionsChecked:0,openingNames:[],bookBounds:[],bookBeforeSearch:false,bothViewsEqual:true,bookFitsPanel:true,bookBarHidden:true,barRestoredAfterBook:false,toggleContinuesMatch:false,engineAnalysisAfterBook:false};
 api.stopEngineMatch();api.patch({engine:'stockfish19',openingBook:true,showAnalysis:true,analysisArrows:true,figurine:true,useToolbar:true,bookVariety:'low',threads:1,hash:32});
 try{
  api.startEngineMatch({white:'stockfish19',black:'clover91',seconds:3});api.setTab('analysis');
  await until(()=>!api.state().active,'Previous native search did not finish cancelling');
  const checkBook=()=>{
   const state=api.state(),card=$('analysisBookInsights'),board=new Chess(state.fen),choices=bookSuggestions(board).slice(0,2);
   assert(!card.hidden&&getComputedStyle(card).display!=='none'&&card.getClientRects().length>0,'Analysis opening book is not visible');
   assert(card.querySelector('strong')?.textContent==='Book','Analysis book title is missing');
   assert(choices.length>0&&card.querySelector('p:last-child')?.textContent.includes('%'),'Analysis book move percentages are missing');
   const labels=[...card.querySelectorAll('p:last-child>span')].map(node=>node.getAttribute('aria-label')||node.textContent);
   assert(JSON.stringify(labels)===JSON.stringify(choices.map(move=>move.label)),'Analysis book moves do not match the current side/position');
   assert(card.textContent===$('gameInsights').textContent,'Game and Analysis book names or moves differ');
   assert($('analysisLines').hidden,'Cached engine lines are competing with book play');
   assert($('analysisEvaluationBar').hidden&&getComputedStyle($('analysisEvaluationBar')).display==='none','Match evaluation bar is visible during book play');
   assert(!state.active,'Book play unexpectedly started a native search');
   const bounds=card.getBoundingClientRect(),panel=$('analysisPanel').getBoundingClientRect(),toolbar=document.querySelector('.main-toolbar').getBoundingClientRect();
   assert(bounds.bottom<=Math.min(panel.bottom,toolbar.top)&&bounds.top>=panel.top,'Book content is clipped or overlaps the toolbar');
   result.bookBounds.push({top:bounds.top,bottom:bounds.bottom,panelBottom:panel.bottom,toolbarTop:toolbar.top});
   result.openingNames.push(card.querySelector('.opening-name')?.textContent||'');
   result.bookPositionsChecked++;
  };
  checkBook();result.bookBeforeSearch=api.state().length===0;
  const before=api.state();$('toolbarAnalysis').click();
  assert(api.state().tab==='game'&&$('toolbarGame').classList.contains('active'),'Match Analysis did not return to the Game menu button');
  $('toolbarAnalysis').click();
  assert(api.state().tab==='analysis'&&$('toolbarAnalysis').classList.contains('active'),'Match Analysis did not reselect its menu button');
  result.toggleContinuesMatch=!api.state().engineMatch.paused&&api.state().length===before.length;
  for(let move=1;move<=2;move++){
   await until(()=>api.state().length>=move&&!document.querySelector('.moving-piece'),'Book match did not advance',15000);
   checkBook();
  }
  api.load('6k1/8/8/8/8/8/5Q2/6K1 w - - 0 1');
  assert(bookSuggestions(new Chess(api.state().fen)).length===0,'Transition fixture is still in the opening book');
  assert(!$('analysisEvaluationBar').hidden,'Match evaluation bar did not return when book play ended');
  await until(()=>api.state().lines.length>0&&$('analysisLines').querySelector('.analysis-line')&&api.state().depth>0,'Native engine analysis did not appear after the book');
  assert($('analysisBookInsights').hidden&&!$('analysisBookInsights').textContent,'Opening book remained visible after leaving it');
  assert(!$('analysisLines').hidden,'Real engine analysis remained hidden after book play');
  result.engineAnalysisAfterBook=true;result.barRestoredAfterBook=true;
  return result;
 }finally{api.pauseEngineMatch();api.stopEngineMatch();}
}

export async function computerBookAnalysisAndToolbar(){
 const api=nativeIntegration,$=id=>document.getElementById(id),{bookSuggestions}=await import('./features.js');
 const assert=(condition,message)=>{if(!condition)throw Error(message);};
 const result={bookPositionsChecked:0,bookNames:[],bookPriorityDuringSearch:false,engineAnalysisAfterBook:false,toolbarCycles:0,gameSelectedAfterStop:true,selectionPillFollowsGame:true};
 api.stopEngineMatch();api.setTab('analysis');
 api.patch({engine:'stockfish19',opponent:'computer',side:'w',openingBook:true,showAnalysis:true,analysisArrows:true,figurine:true,useToolbar:true,time:0,threads:1,hash:32});
 const moveLabels=node=>[...node.querySelectorAll('p:not([class])>span')].map(span=>span.getAttribute('aria-label')||span.textContent);
 const checkBook=()=>{
  const card=$('analysisBookInsights'),state=api.state(),choices=bookSuggestions(new Chess(state.fen)).slice(0,2);
  assert(state.settings.opponent==='computer'&&state.tab==='analysis'&&!card.hidden&&card.getClientRects().length>0,'Computer game book details are not visible in Analysis');
  assert(card.querySelector('.opening-name')?.textContent===$('gameInsights').querySelector('.opening-name')?.textContent,'Computer game opening name differs between views');
  assert(JSON.stringify(moveLabels(card))===JSON.stringify(choices.map(move=>move.label))&&JSON.stringify(moveLabels(card))===JSON.stringify(moveLabels($('gameInsights'))),'Computer game book moves differ from the current position or main screen');
  assert($('analysisLines').hidden,'Engine variations replaced the computer game book prematurely');
  assert(!$('analysisEvaluationBar').hidden,'Human-computer Analysis unexpectedly hid its evaluation bar');
  result.bookNames.push(card.querySelector('.opening-name').textContent);result.bookPositionsChecked++;
 };
 try{
  for(const pgn of ['1. d4','1. d4 Nf6','1. e4 e5 2. Nf3 Nc6']){api.load(pgn);checkBook();}
  await until(()=>api.state().lines.length>0,'Underlying computer game analysis did not produce a native PV');
  checkBook();result.bookPriorityDuringSearch=true;
  api.patch({openingBook:false});
  await until(()=>!$('analysisLines').hidden&&$('analysisLines').querySelector('.analysis-line'),'Disabling book did not restore engine variations');
  assert($('analysisBookInsights').hidden,'Computer book remained visible with Opening Book off');
  api.patch({openingBook:true});checkBook();
  api.load('6k1/8/8/8/8/8/5Q2/6K1 w - - 0 1');
  await until(()=>api.state().lines.length>0&&!$('analysisLines').hidden&&$('analysisLines').querySelector('.analysis-line'),'Computer game Analysis did not resume outside the book');
  assert($('analysisBookInsights').hidden&&!$('analysisEvaluationBar').hidden,'Out-of-book computer analysis kept the wrong presentation');
  result.engineAnalysisAfterBook=true;
  $('toolbarOptions').click();assert($('settingsDialog').open,'Options did not open');$('settingsDialog').close();
  for(let cycle=0;cycle<3;cycle++){
   $('toolbarAnalysis').click();
   assert(api.state().tab==='game'&&!$('gamePanel').hidden&&$('analysisPanel').hidden,'Stopping Analysis did not return to Game');
   assert($('toolbarGame').classList.contains('active')&&!$('toolbarAnalysis').classList.contains('active')&&$('toolbarAnalysis').getAttribute('aria-pressed')==='false','Bottom menu still selects Analysis after stopping it');
   await delay(250);
   const pill=document.querySelector('.toolbar-selection').getBoundingClientRect(),game=$('toolbarGame').getBoundingClientRect();
   assert(Math.abs((pill.left+pill.width/2)-(game.left+game.width/2))<1,'Bottom menu selection pill did not move to Game');
   $('toolbarAnalysis').click();
   assert(api.state().tab==='analysis'&&$('toolbarAnalysis').classList.contains('active')&&!$('toolbarGame').classList.contains('active'),'Starting Analysis did not select its menu button');
   result.toolbarCycles++;
  }
  return result;
 }finally{api.patch({opponent:'local'});}
}

export async function mainDisplayContinuity(){
 const api=nativeIntegration,$=id=>document.getElementById(id);
 api.stopEngineMatch();api.patch({engine:'stockfish19',opponent:'local',openingBook:false,showAnalysis:true,analysisArrows:true,wdl:true,chessCoach:false,animations:true,threads:1,hash:32,time:0});
 await until(()=>api.state().ready,'Native engine did not become ready');
 api.setTab('game');api.load('1. e4 e5 2. Nf3 Nc6');
 const visible=()=>!$('positionCount').hidden&&$('positionCount').querySelectorAll('.engine-stat-badge').length===4&&
  !!$('gameInsights').querySelector('.move-evaluations')?.textContent&&!!$('wdlSummary').textContent&&$('arrows').querySelectorAll('g').length>0;
 await until(visible,'Main game analysis did not appear');
 let samples=0;
 for(let turn=0;turn<3;turn++){
  const state=api.state(),board=new Chess(state.fen),move=board.moves({verbose:true}).find(move=>move.promotion===undefined);
  const previous={score:document.querySelector('#positionCount .stat-score-value')?.textContent,insights:$('gameInsights').textContent,wdl:$('wdlSummary').textContent};
  document.querySelector('[data-square="'+move.from+'"]').click();document.querySelector('[data-square="'+move.to+'"]').click();
  if(api.state().fen===state.fen)throw Error('Board move was not played');
  if(!visible()||document.querySelector('#positionCount .stat-score-value')?.textContent!==previous.score||$('gameInsights').textContent!==previous.insights||$('wdlSummary').textContent!==previous.wdl)throw Error('Main game display cleared immediately after a move');
  const started=performance.now();
  while(performance.now()-started<800){await delay(16);samples++;if(!visible())throw Error('Main game display disappeared during search or move animation');}
  await until(()=>api.state().depth>0&&api.state().lines.length>0,'New position did not replace cached analysis');
 }
 api.setTab('analysis');await until(()=>$('engineDepth').querySelector('.engine-stat-badge'),'Analysis badges did not appear');
 const bar=getComputedStyle($('analysisEvaluationBar')),badge=getComputedStyle($('engineDepth').querySelector('.engine-stat-badge'));
 const matchingRoundness=bar.borderRadius===badge.borderRadius&&parseFloat(bar.borderRadius)>4;
 if(!matchingRoundness)throw Error('Analysis bar does not match the rounded stat badges');
 return {movesChecked:3,samples,matchingRoundness,mainDisplayContinuous:true};
}

export async function mainGameMateResponsiveness(){
 const api=nativeIntegration;
 api.stopEngineMatch();api.patch({engine:'stockfish19',opponent:'local',openingBook:false,showAnalysis:true,analysisArrows:true,threads:1,hash:32,level:'20',time:0});
 await until(()=>api.state().ready,'Native engine did not become ready');
 api.setTab('game');api.load('1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6');
 await until(()=>api.state().lines.some(line=>/^#\d+$/.test(line.evaluation)),'Main game did not find the forced mate');
 const start=performance.now();let last=start,maxGapMs=0,samples=0,mateSeen=false,arrowsSeen=false;
 while(performance.now()-start<4500){
  await delay(50);const now=performance.now();maxGapMs=Math.max(maxGapMs,now-last);last=now;samples++;
  mateSeen ||= api.state().lines.some(line=>/^#\d+$/.test(line.evaluation));
  arrowsSeen ||= document.querySelectorAll('#arrows g').length>0;
 }
 const gameVisible=!document.getElementById('gamePanel').hidden;
 const mainMateCompact=/^#\d+$/.test(document.querySelector('#positionCount .engine-stat-score .stat-score-value')?.textContent||'');
 api.patch({opponent:'local'});
 api.setTab('analysis');
 await until(()=>api.state().lines.some(line=>/^#\d+$/.test(line.evaluation)),'Analysis did not display the White mate');
 const analysisMateCompact=[...document.querySelectorAll('#analysisLines .line-evaluation')].some(node=>/^#\d+$/.test(node.textContent));
 api.setTab('game');api.load('1. f3 e5 2. g4');
 await until(()=>{
  const score=document.querySelector('#positionCount .engine-stat-score .stat-score-value');
  return /^#\d+$/.test(score?.textContent||'')&&score?.dataset.scoreTone==='negative';
 },'Main game did not display the Black mate without a minus sign');
 const blackMainMateCompact=true;
 api.patch({opponent:'local'});api.setTab('analysis');
 await until(()=>[...document.querySelectorAll('#analysisLines .line-evaluation')].some(node=>/^#\d+$/.test(node.textContent)&&node.dataset.scoreTone==='negative'),'Analysis did not display the Black mate without a minus sign');
 const blackAnalysisMateCompact=true;
 const noLongMateLabels=!document.querySelector('.app').textContent.includes('Mate in ');
 api.setTab('game');
 return {mateSeen,arrowsSeen,gameVisible,samples,maxGapMs,mainMateCompact,analysisMateCompact,blackMainMateCompact,blackAnalysisMateCompact,noLongMateLabels};
}
export async function analysisMoveArrows(){
 const api=nativeIntegration,$=id=>document.getElementById(id);
 const results={},frames=[];
 const diagnostic=()=>{
  const app=document.querySelector('.app'),panel=$('analysisPanel');
  const metrics=node=>node?{scrollTop:node.scrollTop,scrollHeight:node.scrollHeight,clientHeight:node.clientHeight,overflowY:getComputedStyle(node).overflowY}:null;
  return {results,frames,app:metrics(app),panel:metrics(panel),windowScrollY:window.scrollY,viewport:{width:innerWidth,height:innerHeight},state:{cursor:api.state().cursor,length:api.state().length,tab:api.state().tab}};
 };
 const assert=(condition,message)=>{if(!condition)throw Error(message+' '+JSON.stringify(diagnostic()));};
 const visible=node=>!node.hidden&&node.getClientRects().length>0;
 const sameFrame=(a,b)=>['top','bottom','left','right'].every(key=>Math.abs(a[key]-b[key])<1);
 const frame=()=>{
  const nav=$('analysisMoveNav').getBoundingClientRect(),toolbar=$('mainToolbar').getBoundingClientRect();
  return {top:nav.top,bottom:nav.bottom,left:nav.left,right:nav.right,toolbarTop:toolbar.top};
 };
 const fixedFrame=reference=>{
  const panel=$('analysisPanel'),app=document.querySelector('.app');
  const touch=new Event('touchmove',{bubbles:true,cancelable:true});panel.dispatchEvent(touch);
  panel.scrollTop=100;app.scrollTop=100;
  const current=frame();frames.push({cursor:api.state().cursor,...current,appScrollTop:app.scrollTop,panelScrollTop:panel.scrollTop,windowScrollY:window.scrollY});
  return sameFrame(current,reference)&&Math.abs(current.toolbarTop-reference.toolbarTop)<1&&current.bottom<=current.toolbarTop+1&&panel.scrollTop===0&&app.scrollTop===0&&window.scrollY===0;
 };
 try{
  document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
  api.stopEngineMatch();api.patch({engine:'stockfish19',opponent:'local',openingBook:false,showAnalysis:true,analysisArrows:true,wdl:true,useToolbar:true,moveSound:false,moveHaptics:false,threads:1,hash:32,time:0});
  api.reset();api.setTab('analysis');
  const back=$('analysisBack'),forward=$('analysisForward'),nav=$('analysisMoveNav');
  assert(back&&forward&&nav,'Analysis move controls were not rendered');
  results.emptyBothDisabled=back.disabled&&forward.disabled;
  const empty=api.state();back.click();forward.click();
  results.emptyClicksDoNothing=api.state().cursor===0&&api.state().length===0&&api.state().pgn===empty.pgn;
  assert(results.emptyBothDisabled&&results.emptyClicksDoNothing,'Empty-game move controls allowed navigation');

  const fixture='1. e4 e5 2. Nf3 Nc6 3. Bb5 a6',game=new Chess();game.loadPgn(fixture);
  const moves=game.history({verbose:true}),start=new Chess().fen();
  api.load(fixture);
  await until(()=>api.state().lines.length===3&&$('wdlSummary').textContent.trim().length>0,'Analysis did not produce three lines and WDL',10000);
  const loaded=api.state(),reference=frame(),wdl=$('wdlSummary').getBoundingClientRect();
  results.realWdlAboveArrows=visible($('wdlSummary'))&&wdl.height>0&&wdl.bottom<=reference.top+1;
  results.arrowsAboveToolbar=reference.bottom<=reference.toolbarTop+1;
  results.tapAreas=[back,forward].every(button=>{
   const rect=button.getBoundingClientRect();
   const hit=document.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2);
   const receivesTap=button.disabled?hit?.closest('#analysisMoveNav')===nav:hit?.closest('button')===button;
   return rect.width>=44&&rect.height>=44&&receivesTap;
  });
  results.accessibleLabels=[back,forward].every(button=>!!button.getAttribute('aria-label')&&button.querySelector('svg[aria-hidden="true"]'));
  results.boundaries=loaded.cursor===moves.length&&!back.disabled&&forward.disabled;
  results.stepsCorrect=true;results.fullHistoryPreserved=true;results.fixedDuringSteps=fixedFrame(reference);
  const inspect=cursor=>{
   const state=api.state();
   results.stepsCorrect&&=state.cursor===cursor&&state.fen===(cursor===0?start:moves[cursor-1].after);
   results.fullHistoryPreserved&&=state.length===loaded.length&&state.pgn===loaded.pgn;
   results.boundaries&&=back.disabled===(cursor===0)&&forward.disabled===(cursor===moves.length);
   results.fixedDuringSteps&&=fixedFrame(reference);
  };
  for(let cursor=moves.length-1;cursor>=0;cursor--){back.click();await delay(35);inspect(cursor);}
  back.click();inspect(0);
  for(let cursor=1;cursor<=moves.length;cursor++){forward.click();await delay(35);inspect(cursor);}
  forward.click();inspect(moves.length);
  assert(results.stepsCorrect&&results.fullHistoryPreserved&&results.boundaries,'Arrows changed the game history or did not step one ply at the boundaries');
  assert(results.realWdlAboveArrows&&results.arrowsAboveToolbar&&results.tapAreas&&results.fixedDuringSteps,'Analysis arrows overlap content, have small tap areas, or scroll during review');

  api.patch({wdl:false});await delay(100);
  results.hiddenWdlAnchored=$('wdlSummary').hidden&&visible(nav)&&fixedFrame(reference);
  api.patch({wdl:true});
  results.toolbarSettingsFit=true;
  for(const useToolbar of [false,true]){
   api.patch({useToolbar});await delay(100);
   const settingFrame=frame(),panel=$('analysisPanel').getBoundingClientRect();
   results.toolbarSettingsFit&&=visible(nav)&&settingFrame.bottom<=settingFrame.toolbarTop+1&&panel.bottom<=settingFrame.top+1&&fixedFrame(reference);
  }
  results.onlyAnalysisVisible=true;
  for(const tab of ['game','graph','analysis']){
   api.setTab(tab);await delay(50);
   results.onlyAnalysisVisible&&=visible(nav)===(tab==='analysis');
  }
  assert(results.hiddenWdlAnchored&&results.toolbarSettingsFit&&results.onlyAnalysisVisible,'Move arrows shifted when WDL or toolbar settings changed, or appeared outside Analysis');

  api.startEngineMatch({white:'stockfish19',black:'clover91',seconds:1});api.setTab('analysis');
  await until(()=>api.state().length>=2&&api.state().active&&!api.state().engineMatch.paused,'Engine match did not reach an active search after two moves',15000);
  const live=api.state();back.click();const reviewed=api.state();
  results.activeMatchPaused=reviewed.engineMatch.paused&&reviewed.cursor===live.length-1;
  results.matchHistoryPreserved=reviewed.length===live.length&&reviewed.pgn===live.pgn;
  forward.click();const latest=api.state();
  results.forwardReturnsToLatest=latest.cursor===live.length&&forward.disabled&&latest.fen===live.fen;
  await delay(1400);
  const held=api.state();
  results.latestDoesNotResume=held.engineMatch.paused&&held.length===live.length&&held.cursor===live.length&&held.pgn===live.pgn;
  assert(results.activeMatchPaused&&results.matchHistoryPreserved&&results.forwardReturnsToLatest&&results.latestDoesNotResume,'Reviewing a running engine match lost moves or resumed play automatically');
  return {...results,frames,reviewedPlies:moves.length,matchPlies:live.length};
 }finally{
  api.stopEngineMatch();api.patch({opponent:'local',useToolbar:true,wdl:true,showAnalysis:false});api.reset();api.setTab('game');
  document.querySelector('.app').scrollTop=0;$('analysisPanel').scrollTop=0;$('gamePanel').scrollTop=0;window.scrollTo(0,0);
 }
}
export async function tournamentColors(){
 const api=nativeIntegration,$=id=>document.getElementById(id);
 api.stopEngineMatch();api.patch({openingBook:false,threads:2,hash:150});
 $('newEngineTournament').click();
 for(const box of $('tournamentEngines').querySelectorAll('input')){
  box.checked=['stockfish19','clover91','reckless090'].includes(box.value);
  box.dispatchEvent(new Event('input',{bubbles:true}));
 }
 $('tournamentGames').value='1';$('tournamentControl').value='move';$('tournamentSeconds').value='1';
 const random=Math.random;Math.random=()=>0;
 try{$('startTournament').click();}finally{Math.random=random;}
 await until(()=>api.state().length>=2,'Tournament engines did not make two legal moves',15000);
 const state=api.state(),saved=JSON.parse(localStorage.getItem('chess-preview-tournament'));
 const balanced=saved.engines.every(id=>saved.schedule.filter(game=>game.white===id).length===1&&saved.schedule.filter(game=>game.black===id).length===1);
 const stockfishBlack=state.engineMatch.black==='stockfish19'&&saved.schedule[0].black==='stockfish19';
 const playerLabels=$('whiteName').textContent==='Clover 9.1'&&$('blackName').textContent==='Stockfish 19';
 api.pauseEngineMatch();
 return {moves:state.length,match:state.engineMatch,participants:saved.engines.length,games:saved.schedule.length,dialog:$('tournamentDialog').open,balanced,stockfishBlack,playerLabels,schedule:saved.schedule};
}
export async function benchmarkScoreBar(){
 const api=nativeIntegration,$=id=>document.getElementById(id),{benchmarkScore}=await import('./benchmark.js');
 api.stopEngineMatch();api.patch({engine:'stockfish19',opponent:'local',showAnalysis:true,time:0,threads:2,hash:150});api.load('1. e4 e5');
 const fen=api.state().fen,transport=chessNative.Transport.prototype,send=transport.postMessage,commands=[];
 const hoverStyle=document.createElement('style');
 transport.postMessage=function(command){commands.push(command);return send.call(this,command);};
 try{
  $('toolbarOptions').click();$('benchmarkButton').click();
  const bar=$('benchmarkProgress'),fill=$('benchmarkProgressFill');
  const initialZero=bar.getAttribute('aria-valuenow')==='0'&&fill.style.width==='0%'&&$('benchmarkScore').textContent==='—';
  let liveBarSeen=false;const deadline=Date.now()+45000;
  while($('benchmarkStatus').textContent!=='Benchmark complete'){
   if(Date.now()>deadline)throw Error('Benchmark did not complete: '+$('benchmarkStatus').textContent);
   const value=Number(bar.getAttribute('aria-valuenow'));
   liveBarSeen||=bar.getAttribute('aria-busy')==='true'&&value>0&&value<=100&&fill.style.width===value+'%'&&$('benchmarkScore').textContent===value.toFixed(2);
   await delay(50);
  }
  const nps=Number($('benchmarkNps').textContent.replaceAll(',','')),score=Number($('benchmarkScore').textContent);
  await delay(450);
  const barFillsToScore=Number(bar.getAttribute('aria-valuenow'))===score&&fill.style.width===score+'%'&&Math.abs(fill.getBoundingClientRect().width/bar.getBoundingClientRect().width*100-score)<1;
  const final={score:$('benchmarkScore').textContent,width:fill.style.width,value:bar.getAttribute('aria-valuenow')};await delay(650);
  const barStopped=bar.getAttribute('aria-busy')==='false'&&$('benchmarkScore').textContent===final.score&&fill.style.width===final.width&&bar.getAttribute('aria-valuenow')===final.value;
  const device=$('benchmarkDevice').textContent;
  const run=$('benchmarkRun'),readyStyle=getComputedStyle(run),buttonRect=run.getBoundingClientRect(),dialogRect=$('benchmarkDialog').getBoundingClientRect();
  const runAgainEnabled=!run.disabled;
  const runAgainVisible=readyStyle.display!=='none'&&readyStyle.visibility==='visible'&&Number(readyStyle.opacity)===1&&buttonRect.height>=44&&buttonRect.width>0&&buttonRect.top>=dialogRect.top&&buttonRect.bottom<=dialogRect.bottom;
  // Reproduce iOS sticky hover with the same selector specificity and declarations.
  const hover=[...document.styleSheets].flatMap(sheet=>[...sheet.cssRules]).find(rule=>rule.selectorText==='button:hover');
  if(!hover)throw Error('Global button hover rule not found');
  hoverStyle.textContent='button.benchmark-test-hover{'+hover.style.cssText+'}';document.head.append(hoverStyle);run.classList.add('benchmark-test-hover');
  const hoveredStyle=getComputedStyle(run),runAgainSolidOnHover=hoveredStyle.backgroundColor===getComputedStyle(fill).backgroundColor&&hoveredStyle.color==='rgb(255, 255, 255)'&&Number(hoveredStyle.opacity)===1;
  const runAgainTappable=document.elementFromPoint(buttonRect.left+buttonRect.width/2,buttonRect.top+buttonRect.height/2)?.closest('#benchmarkRun')===run;
  const result={nps,score,relativeSpeedLabel:bar.getAttribute('aria-label')==='Relative Speed'&&$('benchmarkScore').parentElement.textContent.startsWith('Relative Speed: ')&&!$('benchmarkDialog').textContent.includes('Benchmark Score'),twoDecimals:/^\d+\.\d{2}$/.test($('benchmarkScore').textContent),duration15Seconds:commands.includes('go movetime 15000'),descriptionRemoved:!document.querySelector('#benchmarkDialog .benchmark-method')&&!$('benchmarkDialog').textContent.includes('150 MB hash')&&!$('benchmarkDialog').textContent.includes('5,000,000 positions/second'),valid:nps>0&&score===benchmarkScore(nps)&&score>=0&&score<=100&&$('benchmarkScore').textContent===score.toFixed(2),initialZero,liveBarSeen,barFillsToScore,barStopped,allCores:commands.includes('setoption name Threads value '+chessNative.maxThreads),metadata:!!chessNative.deviceInfo.modelName&&device.includes(chessNative.maxThreads+'-core CPU')&&device.includes(Math.round(chessNative.memoryMB/1024)+' GB'),unchanged:api.state().fen===fen,threads:api.state().settings.threads,hash:api.state().settings.hash};
  Object.assign(result,{runAgainEnabled,runAgainVisible,runAgainSolidOnHover,runAgainTappable});
  run.click();result.resetWorks=bar.getAttribute('aria-valuenow')==='0'&&fill.style.width==='0%'&&$('benchmarkScore').textContent==='—';result.runAgainDisabledDuringRun=run.disabled;
  await delay(300);$('benchmarkBack').click();document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());api.setTab('analysis');
  await until(()=>api.state().lines.length>0,'Game analysis did not resume after cancelling the benchmark',10000);
  result.resumed=!$('benchmarkDialog').open&&api.state().fen===fen;
  return result;
 }finally{transport.postMessage=send;$('benchmarkRun').classList.remove('benchmark-test-hover');hoverStyle.remove();}
}
function check(condition,message){if(!condition)throw Error(message);passed.push(message);}
async function until(fn,message,timeout=25000){const deadline=Date.now()+timeout;while(Date.now()<deadline){if(fn())return;await delay(100);}throw Error(message);}
export async function run(){
 const api=nativeIntegration;
 api.stopEngineMatch();api.patch({engine:'stockfish19'});
 await until(()=>api.state().ready,'Native engine did not become ready');
 check(location.protocol==='chess:','UI loaded entirely from the app bundle');
 check(document.querySelectorAll('#board [data-square]').length===64,'Existing board rendered all 64 squares');
 check(api.state().settings.threads===1&&api.state().settings.hash===32,'Conservative native engine defaults');
 api.setTab('game');api.reset();api.patch({opponent:'computer',side:'w',openingBook:true,moveTime:1});
 document.querySelector('[data-square="e2"]').click();document.querySelector('[data-square="e4"]').click();
 await until(()=>api.state().length===2,'Opening book did not reply');
 check(api.state().length===2,'Offline opening book replies to e4');
 api.reset();api.patch({opponent:'computer',side:'w',openingBook:false,moveTime:1,level:'5'});
 document.querySelector('[data-square="d2"]').click();document.querySelector('[data-square="d4"]').click();
 await until(()=>api.state().length===2,'Stockfish did not reply outside the opening book');
 check(new Chess(api.state().fen).turn()==='w','Offline Stockfish 19 returned a legal computer move');
 api.patch({opponent:'local',time:5});api.setTab('analysis');
 await until(()=>api.state().lines.length===2,'Two analysis lines did not arrive');
 check(api.state().lines.length===2,'Two native analysis lines with scores and continuations');
 await until(()=>api.state().nodes>0,'No node progress');
 check(api.state().nodes>0,'Search node count reaches the interface');
 const clip=api.state().pgn;await navigator.clipboard.writeText(clip);check(await navigator.clipboard.readText()===clip,'Native clipboard round trip');
 api.patch({time:0});api.setTab('game');api.analyze();await delay(300);
 window.dispatchEvent(new CustomEvent('chess-native-lifecycle',{detail:'suspend'}));
 const position=api.state().fen,pausedElapsed=api.state().clock.moveClock.elapsed.w;await delay(700);
 check(api.state().suspended&&!api.state().active,'Forced suspension stops the active search');
 const resumedAt=performance.now();window.dispatchEvent(new CustomEvent('chess-native-lifecycle',{detail:'resume'}));
 await until(()=>api.state().ready&&api.state().lines.length===2,'Resume did not reconnect');
 check(api.state().fen===position,'Resume preserves position without duplicate moves');
 check(api.state().clock.moveClock.elapsed.w-pausedElapsed<performance.now()-resumedAt+300,'Count-up clock excludes background time');
 api.patch({time:5,level:'20'});api.navigate(0);api.navigate(2);await delay(300);
 check(api.state().length===2&&api.state().cursor===2,'PGN review preserves the full game');
 const pgn=api.state().pgn;api.load(pgn);check(api.state().length===2,'PGN export and import round trip');
 api.patch({opponent:'local'});api.setTab('game');api.persist();
 const savedBefore=JSON.parse(localStorage.getItem('chess-preview-v2')).saved;
 api.navigate(0);
 document.querySelector('[data-square="c2"]').click();document.querySelector('[data-square="c4"]').click();
 await until(()=>api.state().length===1&&api.state().cursor===1,'Could not continue after taking back moves');
 api.persist();
 const continued=JSON.parse(localStorage.getItem('chess-preview-v2'));
 check(JSON.stringify(continued.saved)===JSON.stringify(savedBefore),'Taking back and continuing does not add a saved game');
 check(continued.pgn.includes('c4'),'Continued game still persists for app recovery');
 api.load('8/8/8/8/8/4k3/8/4K2R w K - 0 1');api.setTab('analysis');
 await until(()=>api.state().lines.length===2,'Custom position analysis failed');
 check(api.state().lines.length===2,'Custom FEN analysis works offline');
 const native=window.webkit.messageHandlers.chess;
 let rejected=false;try{await native.postMessage({action:'fetch',identifier:'bad',url:'http://127.0.0.1:4173/'});}catch{rejected=true;}
 check(rejected,'Native import rejects unapproved destinations');
 // Validate cancellation and error handling through the real WK native fetch path.
 const abort=new AbortController();abort.abort();rejected=false;
 try{await fetch('https://api.chess.com/pub/player/erik/games/archives',{signal:abort.signal});}catch(error){rejected=error.name==='AbortError';}
 check(rejected,'Import cancellation reaches the WebView caller');
 let response;try{response=await fetch('https://api.chess.com/pub/player/this-user-does-not-exist-947281/games/archives');check(!response.ok,'Chess.com missing-account response is handled');}catch(error){check(!!error.message,'Network failure is surfaced to the import UI');}
 api.reset();api.patch({opponent:'computer',side:'w',openingBook:true,threads:1,hash:32,time:5,level:'5'});api.setTab('game');
 api.persist();await delay(300);
 const stored=JSON.parse(localStorage.getItem('chess-preview-v2'));
 check(stored.engineVersion==='Stockfish 19'&&stored.settings.threads===1,'Game and settings persist through native storage');
 return passed;
}

export async function network(){
 const results=[];
 const chess=await chessComGames('erik');if(!chess.length)throw Error('Chess.com returned no games');results.push('Chess.com HTTPS import: '+chess.length+' games');
 const lichess=await recentLichessGames('DrNykterstein');if(!lichess.length)throw Error('Lichess returned no games');results.push('Lichess HTTPS import: '+lichess.length+' games');
 let missing=false;try{await recentLichessGames('missing-user-947281');}catch(error){missing=/not found/i.test(error.message);}if(!missing)throw Error('Lichess missing-account response was not handled');results.push('Lichess missing-account error handled');
 const abort=new AbortController();const pending=fetch('https://lichess.org/api/games/user/DrNykterstein?max=30',{signal:abort.signal});abort.abort();let cancelled=false;try{await pending;}catch(error){cancelled=error.name==='AbortError'||/cancel/i.test(error.message);}if(!cancelled)throw Error('Active request did not cancel');results.push('Active native URLSession request cancelled');
 return results;
}

export async function engines(){
 const api=nativeIntegration,results=[];
 api.patch({engine:'stockfish19',opponent:'local',openingBook:false,time:0});api.reset();api.setTab('analysis');
 await until(()=>api.state().ready&&api.state().engineIdentity==='Stockfish 19'&&api.state().lines.length===2,'Stockfish 19 initial search failed');
 const original=api.state().fen;
 for(const [id,name] of [['clover91','Clover 9.1'],['stockfish19','Stockfish 19'],['clover91','Clover 9.1']]){
   const picker=document.getElementById('activeEngine');picker.value=id;picker.dispatchEvent(new Event('change'));
   await until(()=>api.state().ready&&api.state().engineIdentity===name&&api.state().lines.length===2,'Engine switch failed: '+name);
   if(api.state().fen!==original)throw Error('Switch changed the game position');
   if(!api.state().lines.every(line=>line.root&&line.evaluation))throw Error('Missing engine analysis');
   results.push(name+' identifies itself and analyzes offline after switching');
 }
 api.patch({opponent:'computer',side:'b',moveTime:1,level:'20'});api.reset();api.setTab('game');
 await until(()=>api.state().length===1,'Clover 9.1 did not play a legal move');
 await delay(400);
 if(api.state().length!==1||new Chess(api.state().fen).turn()!=='b')throw Error('Duplicate or illegal move');
 results.push('Clover 9.1 plays exactly one legal move');
 api.persist();
 if(JSON.parse(localStorage.getItem('chess-preview-v2')).settings.engine!=='clover91')throw Error('Selected engine was not saved');
 api.patch({opponent:'local',engine:'stockfish19'});api.setTab('analysis');
 await until(()=>api.state().ready&&api.state().engineIdentity==='Stockfish 19'&&api.state().lines.length===2,'Stockfish 19 restore failed');
 results.push('Engine choice persists and Stockfish 19 remains available');
 return results;
}

export async function nativeEngines(){
 const api=nativeIntegration,results=[];
 const names=['Stockfish 19','Reckless 0.9.0','PlentyChess 8.0.0','Pawnocchio 2.0.1','Obsidian 16.0','Cinder 0.6.1','Viridithas 20.0.0','Halogen 16.0.0','Clover 9.1','Starzix 6.1'];
 if(chessNative.engines.length!==10||new Set(chessNative.engines.map(e=>e.id)).size!==10||chessNative.engines.some(e=>e.id==='stockfish18'))throw Error('Wrong native engine catalog');
 if(JSON.stringify(chessNative.engines.map(e=>e.name))!==JSON.stringify(names))throw Error('Wrong release versions');
 api.stopEngineMatch();api.patch({opponent:'local',openingBook:false,showAnalysis:true,threads:2,hash:150,time:1});api.reset();api.setTab('analysis');
 const original=api.state().fen;
 for(const entry of chessNative.engines){
   api.patch({engine:entry.id,opponent:'local'});api.setTab('analysis');
   const count=entry.maxPV===1?1:3;
   try{await until(()=>api.state().ready&&api.state().engineIdentity.toLowerCase()===entry.name.toLowerCase()&&api.state().lines.length===count,'Offline analysis failed: '+entry.name);}catch(error){throw Error(error.message+' '+JSON.stringify({ready:api.state().ready,identity:api.state().engineIdentity,lines:api.state().lines}));}
   if(api.state().fen!==original)throw Error('Engine switching changed the position');
   for(const line of api.state().lines){const board=new Chess(original);const uci=line.uci;if(!uci||!board.move({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]||'q'}))throw Error('Illegal PV from '+entry.name);}
   results.push(entry.name+' native identity and legal analysis ('+count+' PV)');
 }
 for(const entry of chessNative.engines.filter(e=>['cinder061','viridithas200','halogen160','clover91','starzix61','obsidian160'].includes(e.id))){
   api.startEngineMatch({white:'stockfish19',black:entry.id,seconds:1});api.setTab('game');
   try{await until(()=>api.state().length>=4,'Match failed: '+entry.name);}catch(error){throw Error(error.message+' '+JSON.stringify(api.state()));}
   api.pauseEngineMatch();await delay(250);
   const game=new Chess();game.loadPgn(api.state().pgn);
   if(game.history().length<4)throw Error('Illegal match PGN: '+entry.name);
   if(game.getHeaders().Black!==entry.name)throw Error('Wrong match opponent identity');
   results.push(entry.name+' plays legal timed match moves against Stockfish 19');
   api.stopEngineMatch();api.patch({opponent:'local',engine:entry.id,time:0});api.reset();api.setTab('analysis');
   await until(()=>api.state().ready&&api.state().engineIdentity===entry.name&&api.state().lines.length>0,'Infinite search did not start: '+entry.name);
   api.patch({engine:'stockfish19',time:1});
   await until(()=>api.state().ready&&api.state().engineIdentity==='Stockfish 19'&&api.state().lines.length===3,'Stop/switch failed: '+entry.name);
   if(api.state().length!==0)throw Error('Late move after cancelling '+entry.name);
   results.push(entry.name+' stops infinite search before engine switch');
 }
 api.stopEngineMatch();api.patch({opponent:'local',engine:'stockfish19'});api.setTab('game');
 return results;
}

export async function match(){
 const api=nativeIntegration,results=[];
 api.patch({opponent:'local',openingBook:false});
 document.getElementById('menuNew').click();document.getElementById('newEngineMatch').click();
 if(!document.getElementById('newEngineMatchDialog').open)throw Error('New Game match setup did not open');
 const $=id=>document.getElementById(id);
 const options=id=>[...$(id).options].map(option=>option.value);
 for(const [match,tournament] of [['matchControl','tournamentControl'],['matchMoveTime','tournamentSeconds'],['matchGameMinutes','tournamentMinutes']]){
  if(JSON.stringify(options(match))!==JSON.stringify(options(tournament)))throw Error('Match time presets differ from Tournament');
 }
 $('matchControl').value='move';$('matchControl').dispatchEvent(new Event('change'));
 if(getComputedStyle($('matchSecondsRow')).display==='none'||getComputedStyle($('matchMinutesRow')).display!=='none')throw Error('Move-time fields are not shown correctly');
 document.getElementById('matchWhiteEngine').value='stockfish19';
 document.getElementById('matchBlackEngine').value='clover91';
 document.getElementById('matchMoveTime').value='1';
 document.getElementById('startEngineMatch').click();
 if(api.state().settings.fixedTime!==true||api.state().engineMatch.seconds!==1)throw Error('Move-time match did not use the selected seconds');
 const seen=new Set();
 const watcher=setInterval(()=>{if(api.state().ready&&api.state().active)seen.add(api.state().engineIdentity);},50);
 try{await until(()=>api.state().length>=4,'Engines did not alternate legal moves',45000);}finally{clearInterval(watcher);}
 document.getElementById('toolbarGame').click();
 const moves=api.state().length;
 await delay(1500);
 if(!api.state().engineMatch.paused||api.state().length!==moves)throw Error('Match did not pause safely');
 if(!seen.has('Stockfish 19')||!seen.has('Clover 9.1'))throw Error('Both actual engine versions did not search');
 const game=new Chess();game.loadPgn(api.state().pgn);
 if(game.getHeaders().White!=='Stockfish 19'||game.getHeaders().Black!=='Clover 9.1')throw Error('Wrong match player names');
 results.push('New Game setup starts Stockfish 19 versus Clover 9.1 and both make legal moves');
 results.push('Game menu pauses the match without a late move');
 document.getElementById('pauseEngineMatch').click();
 await until(()=>api.state().length>=moves+2,'Match did not resume',25000);
 api.stopEngineMatch();const stopped=api.state().length;await delay(1500);
 if(api.state().settings.opponent!=='local'||api.state().length!==stopped)throw Error('Stopped match kept playing');
 results.push('Resume continues and Stop preserves the game without further moves');
 // Self-play is also supported.
 api.startEngineMatch({white:'clover91',black:'clover91',seconds:1});
 await until(()=>api.state().length>=2,'Same-engine self-play failed',25000);
 api.pauseEngineMatch();api.persist();
 const saved=JSON.parse(localStorage.getItem('chess-preview-v2'));
 if(saved.engineMatch.white!=='clover91'||!saved.engineMatch.paused)throw Error('Match state did not persist');
 results.push('Clover 9.1 self-play and paused match persistence work');
 api.stopEngineMatch();$('menuNew').click();$('newEngineMatch').click();
 $('matchControl').value='game';$('matchControl').dispatchEvent(new Event('change'));
 if(getComputedStyle($('matchSecondsRow')).display!=='none'||getComputedStyle($('matchMinutesRow')).display==='none')throw Error('Game-time fields are not shown correctly');
 $('matchGameMinutes').value='1';$('matchWhiteEngine').value='stockfish19';$('matchBlackEngine').value='clover91';$('startEngineMatch').click();
 const timedStart=api.state();
 if(timedStart.settings.fixedTime!==false||timedStart.settings.gameMinutes!==1||timedStart.settings.increment!==0||timedStart.clock.current.remaining.b!==60000||timedStart.clock.current.remaining.w>60000||timedStart.clock.current.remaining.w<59000)throw Error('Game-time match did not initialize each engine with one minute');
 await until(()=>api.state().length>=2,'Clock-controlled engines did not both make legal moves',35000);
 $('toolbarGame').click();
 const timedPause=api.state(),remaining=timedPause.clock.current.remaining;
 if(!timedPause.engineMatch.paused||remaining.w>=60000||remaining.b>=60000||$('whiteClock').title!=='Time remaining in the game'||$('blackClock').title!=='Time remaining in the game')throw Error('Game-time match did not run both countdown clocks');
 await delay(650);
 const afterPause=api.state().clock.current.remaining;
 if(afterPause.w!==remaining.w||afterPause.b!==remaining.b)throw Error('Game-time clocks ran while paused');
 $('menuNew').click();$('newEngineMatch').click();
 if($('matchControl').value!=='game'||$('matchGameMinutes').value!=='1')throw Error('Match setup did not remember the game time control');
 api.persist();const timedSaved=JSON.parse(localStorage.getItem('chess-preview-v2'));
 if(timedSaved.engineMatch.fixedTime!==false||timedSaved.engineMatch.gameMinutes!==1)throw Error('Match time control did not persist');
 results.push('Match uses the same time-control menu and presets as Tournament and remembers the selected control');
 $('toolbarGame').click();$('pauseEngineMatch').click();
 await until(()=>api.state().active,'Clock-controlled match did not resume',15000);
 await delay(400);
 const resumed=api.state();
 if(resumed.engineMatch.paused||resumed.clock.current.remaining.w+resumed.clock.current.remaining.b>=remaining.w+remaining.b)throw Error('Game-time countdown did not resume');
 results.push('Time per game initializes two one-minute countdowns, plays both engines, pauses, and resumes');
 api.stopEngineMatch();api.patch({engine:'stockfish19',opponent:'local',fixedTime:true,gameMinutes:3,increment:0});api.reset();
 return results;
}

export async function reckless(){
 const api=nativeIntegration,results=[];
 api.stopEngineMatch();api.patch({engine:'stockfish19',opponent:'local',openingBook:false,time:0,threads:1,hash:32});api.reset();api.setTab('analysis');
 const initial=api.state().fen;
 const picker=document.getElementById('activeEngine');picker.value='reckless090';picker.dispatchEvent(new Event('change'));
 await until(()=>api.state().ready&&api.state().engineIdentity==='Reckless 0.9.0'&&api.state().lines.length===2,'Reckless offline analysis failed',40000);
 if(api.state().fen!==initial||!api.state().nodes)throw Error('Reckless changed position or has no node output');
 if(!api.state().lines.every(line=>line.root&&line.evaluation))throw Error('Missing Reckless scores/PVs');
 if(document.getElementById('difficultyButtonValue').textContent!=='Full strength')throw Error('Reckless falsely advertises adjustable strength');
 results.push('Actual Reckless 0.9.0 identity, two analysis lines, depth, nodes and scores work offline');
 api.patch({threads:2,hash:16});
 await until(()=>api.state().lines.length===2,'Reckless two-thread search failed');
 api.patch({opponent:'computer',side:'b',fixedTime:true,moveTime:1});api.reset();api.setTab('game');
 await until(()=>api.state().length===1,'Reckless failed to play a move');await delay(500);
 if(api.state().length!==1||new Chess(api.state().fen).turn()!=='b')throw Error('Duplicate or illegal Reckless move');
 api.persist();if(JSON.parse(localStorage.getItem('chess-preview-v2')).settings.engine!=='reckless090')throw Error('Reckless selection not persisted');
 results.push('Reckless plays one legal timed move and the engine choice persists');
 for(const opponent of ['stockfish19','clover91','reckless090']){
   api.startEngineMatch({white:'reckless090',black:opponent,seconds:1});
   const seen=new Set();const watch=setInterval(()=>{if(api.state().ready&&api.state().active)seen.add(api.state().engineIdentity);},20);
   try{await until(()=>api.state().length>=4,'Reckless match failed against '+opponent,45000);}finally{clearInterval(watch);}
   api.pauseEngineMatch();const moves=api.state().length;await delay(1200);
   if(api.state().length!==moves||!seen.has('Reckless 0.9.0'))throw Error('Pause or Reckless identity failed');
   const other=opponent==='stockfish19'?'Stockfish 19':opponent==='clover91'?'Clover 9.1':'Reckless 0.9.0';
   if(!seen.has(other))throw Error('Opponent did not search: '+other);
   const game=new Chess();game.loadPgn(api.state().pgn);
   if(game.getHeaders().White!=='Reckless 0.9.0'||game.getHeaders().Black!==other)throw Error('Incorrect match headers');
   api.resumeEngineMatch();await until(()=>api.state().length>=moves+1,'Match did not resume');
   api.stopEngineMatch();const stopped=api.state().length;await delay(1200);
   if(api.state().length!==stopped)throw Error('Stopped match played a late move');
   results.push('Reckless versus '+other+': legal moves, correct names, pause/resume/stop');
 }
 // Rapid cancellation before the native search thread starts must also drain safely.
 for(let i=0;i<5;i++){api.patch({engine:i%2?'clover91':'reckless090',opponent:'local'});api.reset();api.setTab('analysis');await delay(30);api.navigate(0);}
 api.patch({engine:'stockfish19',threads:1,hash:32});api.setTab('analysis');
 await until(()=>api.state().ready&&api.state().engineIdentity==='Stockfish 19'&&api.state().lines.length===2,'Stockfish did not recover after rapid switching',40000);
 results.push('Rapid cancellation and switching back to Stockfish 19 work');
 api.setTab('game');api.reset();return results;
}

export async function plenty(){
 const api=nativeIntegration,results=[];
 api.stopEngineMatch();api.patch({engine:'stockfish19',opponent:'local',openingBook:false,time:0,threads:1,hash:32});api.reset();api.setTab('analysis');
 const initial=api.state().fen;
 const picker=document.getElementById('activeEngine');picker.value='plenty800';picker.dispatchEvent(new Event('change'));
 await until(()=>api.state().ready&&api.state().engineIdentity==='PlentyChess 8.0.0'&&api.state().lines.length===2,'PlentyChess offline analysis failed',40000);
 if(api.state().fen!==initial||!api.state().nodes)throw Error('PlentyChess changed position or has no node output');
 if(!api.state().lines.every(line=>line.root&&line.evaluation))throw Error('Missing PlentyChess scores/PVs');
 if(document.getElementById('difficultyButtonValue').textContent!=='Full strength')throw Error('PlentyChess falsely advertises adjustable strength');
 results.push('Actual PlentyChess 8.0.0 identity, two analysis lines, depth, nodes and scores work offline');
 api.patch({threads:2,hash:16});
 await until(()=>api.state().lines.length===2,'PlentyChess two-thread search failed');
 api.patch({opponent:'computer',side:'b',fixedTime:true,moveTime:1});api.reset();api.setTab('game');
 await until(()=>api.state().length===1,'PlentyChess failed to play a move');await delay(500);
 if(api.state().length!==1||new Chess(api.state().fen).turn()!=='b')throw Error('Duplicate or illegal PlentyChess move');
 api.persist();if(JSON.parse(localStorage.getItem('chess-preview-v2')).settings.engine!=='plenty800')throw Error('PlentyChess selection not persisted');
 results.push('PlentyChess plays one legal timed move and the engine choice persists');
 for(const opponent of ['stockfish19','clover91','reckless090','plenty800']){
   api.startEngineMatch({white:'plenty800',black:opponent,seconds:1});
   const seen=new Set();const watch=setInterval(()=>{if(api.state().ready&&api.state().active)seen.add(api.state().engineIdentity);},20);
   try{await until(()=>api.state().length>=4,'PlentyChess match failed against '+opponent,45000);}finally{clearInterval(watch);}
   api.pauseEngineMatch();const moves=api.state().length;await delay(1200);
   if(api.state().length!==moves||!seen.has('PlentyChess 8.0.0'))throw Error('Pause or PlentyChess identity failed');
   const other=opponent==='stockfish19'?'Stockfish 19':opponent==='clover91'?'Clover 9.1':opponent==='reckless090'?'Reckless 0.9.0':'PlentyChess 8.0.0';
   if(!seen.has(other))throw Error('Opponent did not search: '+other);
   const game=new Chess();game.loadPgn(api.state().pgn);
   if(game.getHeaders().White!=='PlentyChess 8.0.0'||game.getHeaders().Black!==other)throw Error('Incorrect match headers');
   api.resumeEngineMatch();await until(()=>api.state().length>=moves+1,'Match did not resume');
   api.stopEngineMatch();const stopped=api.state().length;await delay(1200);
   if(api.state().length!==stopped)throw Error('Stopped match played a late move');
   results.push('PlentyChess versus '+other+': legal moves, correct names, pause/resume/stop');
 }
 // Rapid cancellation before the native search thread starts must also drain safely.
 for(let i=0;i<5;i++){api.patch({engine:i%2?'clover91':'plenty800',opponent:'local'});api.reset();api.setTab('analysis');await delay(30);api.navigate(0);}
 api.patch({engine:'stockfish19',threads:1,hash:32});api.setTab('analysis');
 await until(()=>api.state().ready&&api.state().engineIdentity==='Stockfish 19'&&api.state().lines.length===2,'Stockfish did not recover after rapid switching',40000);
 results.push('Rapid cancellation and switching back to Stockfish 19 work');
 api.setTab('game');api.reset();return results;
}

export async function pawn(){
 const api=nativeIntegration,results=[];
 api.stopEngineMatch();api.patch({engine:'stockfish19',opponent:'local',openingBook:false,time:0,threads:1,hash:32});api.reset();api.setTab('analysis');
 const initial=api.state().fen;
 const picker=document.getElementById('activeEngine');picker.value='pawn201';picker.dispatchEvent(new Event('change'));
 await until(()=>api.state().ready&&api.state().engineIdentity==='pawnocchio 2.0.1'&&api.state().lines.length===1,'Pawnocchio offline analysis failed',40000);
 if(api.state().fen!==initial||!api.state().nodes)throw Error('Pawnocchio changed position or has no node output');
 if(!api.state().lines.every(line=>line.root&&line.evaluation))throw Error('Missing Pawnocchio scores/PVs');
 if(document.getElementById('difficultyButtonValue').textContent!=='Full strength')throw Error('Pawnocchio falsely advertises adjustable strength');
 results.push('Actual Pawnocchio 2.0.1 identity, one analysis line, depth, nodes and scores work offline');
 if(document.getElementById('analysisNote').textContent==='Only one legal move.')throw Error('Single-PV capability is mislabeled as a forced move');
 api.patch({threads:2,hash:16,wdl:true});
 await until(()=>api.state().lines.length===1,'Pawnocchio two-thread search failed');
 await until(()=>document.getElementById('wdlSummary').textContent.includes('%'),'Pawnocchio WDL missing');
 api.patch({opponent:'computer',side:'b',fixedTime:true,moveTime:1});api.reset();api.setTab('game');
 await until(()=>api.state().length===1,'Pawnocchio failed to play a move');await delay(500);
 if(api.state().length!==1||new Chess(api.state().fen).turn()!=='b')throw Error('Duplicate or illegal Pawnocchio move');
 api.persist();if(JSON.parse(localStorage.getItem('chess-preview-v2')).settings.engine!=='pawn201')throw Error('Pawnocchio selection not persisted');
 results.push('Pawnocchio plays one legal timed move and the engine choice persists');
 for(const opponent of ['stockfish19','clover91','reckless090','plenty800','pawn201']){
   api.startEngineMatch({white:'pawn201',black:opponent,seconds:1});
   const seen=new Set();const watch=setInterval(()=>{if(api.state().ready&&api.state().active)seen.add(api.state().engineIdentity);},20);
   try{await until(()=>api.state().length>=4,'Pawnocchio match failed against '+opponent,45000);}finally{clearInterval(watch);}
   api.pauseEngineMatch();const moves=api.state().length;await delay(1200);
   if(api.state().length!==moves||!seen.has('pawnocchio 2.0.1'))throw Error('Pause or Pawnocchio identity failed');
   const other=opponent==='stockfish19'?'Stockfish 19':opponent==='clover91'?'Clover 9.1':opponent==='reckless090'?'Reckless 0.9.0':opponent==='plenty800'?'PlentyChess 8.0.0':'Pawnocchio 2.0.1';
   if(!seen.has(opponent==='pawn201'?'pawnocchio 2.0.1':other))throw Error('Opponent did not search: '+other);
   const game=new Chess();game.loadPgn(api.state().pgn);
   if(game.getHeaders().White!=='Pawnocchio 2.0.1'||game.getHeaders().Black!==other)throw Error('Incorrect match headers');
   api.resumeEngineMatch();await until(()=>api.state().length>=moves+1,'Match did not resume');
   api.stopEngineMatch();const stopped=api.state().length;await delay(1200);
   if(api.state().length!==stopped)throw Error('Stopped match played a late move');
   results.push('Pawnocchio versus '+other+': legal moves, correct names, pause/resume/stop');
 }
 // Rapid cancellation before the native search thread starts must also drain safely.
 for(let i=0;i<5;i++){api.patch({engine:i%2?'clover91':'pawn201',opponent:'local'});api.reset();api.setTab('analysis');await delay(30);api.navigate(0);}
 api.patch({engine:'stockfish19',threads:1,hash:32});api.setTab('analysis');
 await until(()=>api.state().ready&&api.state().engineIdentity==='Stockfish 19'&&api.state().lines.length===2,'Stockfish did not recover after rapid switching',40000);
 results.push('Rapid cancellation and switching back to Stockfish 19 work');
 api.setTab('game');api.reset();return results;
}

export async function obsidian(){
 const api=nativeIntegration,results=[];
 api.stopEngineMatch();api.patch({engine:'stockfish19',opponent:'local',openingBook:false,time:0,threads:1,hash:32});api.reset();api.setTab('analysis');
 const initial=api.state().fen;
 const picker=document.getElementById('activeEngine');picker.value='obsidian160';picker.dispatchEvent(new Event('change'));
 await until(()=>api.state().ready&&api.state().engineIdentity==='Obsidian 16.0'&&api.state().lines.length===2,'Obsidian offline analysis failed',40000);
 if(api.state().fen!==initial||!api.state().nodes)throw Error('Obsidian changed position or has no node output');
 if(!api.state().lines.every(line=>line.root&&line.evaluation))throw Error('Missing Obsidian scores/PVs');
 if(document.getElementById('difficultyButtonValue').textContent!=='Full strength')throw Error('Obsidian falsely advertises adjustable strength');
 if(document.getElementById('wdlSummary').textContent.includes('%'))throw Error('Obsidian shows unsupported WDL');
 results.push('Actual Obsidian 16.0 identity, two analysis lines, depth, nodes and scores work offline');
 api.patch({threads:2,hash:16});
 await until(()=>api.state().lines.length===2,'Obsidian two-thread search failed');
 api.patch({opponent:'computer',side:'b',fixedTime:true,moveTime:1});api.reset();api.setTab('game');
 await until(()=>api.state().length===1,'Obsidian failed to play a move');await delay(500);
 if(api.state().length!==1||new Chess(api.state().fen).turn()!=='b')throw Error('Duplicate or illegal Obsidian move');
 api.persist();if(JSON.parse(localStorage.getItem('chess-preview-v2')).settings.engine!=='obsidian160')throw Error('Obsidian selection not persisted');
 results.push('Obsidian plays one legal timed move and the engine choice persists');
 for(const opponent of ['stockfish19','clover91','reckless090','plenty800','pawn201','obsidian160']){
   api.startEngineMatch({white:'obsidian160',black:opponent,seconds:1});
   const seen=new Set();const watch=setInterval(()=>{if(api.state().ready&&api.state().active)seen.add(api.state().engineIdentity);},20);
   try{await until(()=>api.state().length>=4,'Obsidian match failed against '+opponent,45000);}finally{clearInterval(watch);}
   api.pauseEngineMatch();const moves=api.state().length;await delay(1200);
   if(api.state().length!==moves||!seen.has('Obsidian 16.0'))throw Error('Pause or Obsidian identity failed');
   const other=opponent==='stockfish19'?'Stockfish 19':opponent==='clover91'?'Clover 9.1':opponent==='reckless090'?'Reckless 0.9.0':opponent==='plenty800'?'PlentyChess 8.0.0':opponent==='pawn201'?'Pawnocchio 2.0.1':'Obsidian 16.0';
   if(!seen.has(opponent==='pawn201'?'pawnocchio 2.0.1':other))throw Error('Opponent did not search: '+other);
   const game=new Chess();game.loadPgn(api.state().pgn);
   if(game.getHeaders().White!=='Obsidian 16.0'||game.getHeaders().Black!==other)throw Error('Incorrect match headers');
   api.resumeEngineMatch();await until(()=>api.state().length>=moves+1,'Match did not resume');
   api.stopEngineMatch();const stopped=api.state().length;await delay(1200);
   if(api.state().length!==stopped)throw Error('Stopped match played a late move');
   results.push('Obsidian versus '+other+': legal moves, correct names, pause/resume/stop');
 }
 // Rapid cancellation before the native search thread starts must also drain safely.
 for(let i=0;i<5;i++){api.patch({engine:i%2?'clover91':'obsidian160',opponent:'local'});api.reset();api.setTab('analysis');await delay(30);api.navigate(0);}
 api.patch({engine:'stockfish19',threads:1,hash:32});api.setTab('analysis');
 await until(()=>api.state().ready&&api.state().engineIdentity==='Stockfish 19'&&api.state().lines.length===2,'Stockfish did not recover after rapid switching',40000);
 results.push('Rapid cancellation and switching back to Stockfish 19 work');
 api.setTab('game');api.reset();return results;
}

// Exercise the shipped menus in WKWebView, including the modal handoff that
// previously exposed the board/tapped row for a frame when returning to Options.
export async function optionsDetailNavigation(){
 const api=nativeIntegration;
 api.stopEngineMatch();api.patch({opponent:'local',showAnalysis:false,language:'en'});
 const cases=[['#boardButton','Board'],['#piecesButton','Pieces'],['#languageButton','Language'],['#nameButton','Your Name'],['#helpButton','Help & FAQ'],['[data-release-info="support"]','Support']];
 const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
 const visible=()=>[...document.querySelectorAll('dialog[open]')];
 const require=(ok,message)=>{if(!ok)throw Error(message);};
 let watch=false,gaps=0;
 const close=HTMLDialogElement.prototype.close;
 HTMLDialogElement.prototype.close=function(...args){const result=close.apply(this,args);if(watch&&!visible().length)gaps++;return result;};
 const rows=[];
 try{
  document.getElementById('toolbarOptions').click();
  for(const [selector,title] of cases){
   watch=true;document.querySelector(selector).click();await frame();
   const dialog=visible()[0],header=dialog.querySelector('.dialog-heading');
   require(visible().length===1,`${title}: only one modal must remain open`);
   const back=header.querySelector('.options-back'),done=header.querySelector('button:last-child'),heading=header.querySelector('h2');
   require(back?.textContent.trim()==='Options'&&done.textContent.trim()==='Done',`${title}: navigation labels`);
   const left=back.getBoundingClientRect(),middle=heading.getBoundingClientRect(),right=done.getBoundingClientRect();
   require(left.right<=middle.left&&middle.right<=right.left,`${title}: left/center/right must not overlap`);
   require(left.height>=44&&right.height>=44,`${title}: touch targets`);
   require(getComputedStyle(back).webkitTapHighlightColor==='rgba(0, 0, 0, 0)',`${title}: no gray touch overlay`);
   dialog.scrollTop=dialog.scrollHeight;await frame();
   const scrolled=header.getBoundingClientRect(),bounds=dialog.getBoundingClientRect();
   require(scrolled.top>=bounds.top&&scrolled.bottom<=bounds.bottom,`${title}: navigation stays visible while scrolling`);
   back.click();await frame();
   require(visible().length===1&&visible()[0].id==='settingsDialog',`${title}: Options returns to menu`);
   require(visible()[0].contains(document.activeElement),`${title}: focus stays in Options`);
   document.querySelector(selector).click();await frame();watch=false;
   visible()[0].querySelector('.dialog-heading button:last-child').click();await frame();
   require(!visible().length,`${title}: Done dismisses the menu`);
   rows.push(title);document.getElementById('toolbarOptions').click();
  }
  require(gaps===0,`Modal handoff exposed the board ${gaps} times`);
  watch=false;document.querySelector('#settingsDialog [data-close]').click();
  return {pages:rows,modalGaps:gaps};
 }finally{HTMLDialogElement.prototype.close=close;}
}
