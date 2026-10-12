import {pieceImage,PIECE_SETS} from './pieces.js';
import {BoardMotion} from './motion.js';
import {MoveSound} from './move-sound.js';
import {MoveHaptics} from './move-haptics.js';
import {WinCelebration,CheckmateCelebration} from './celebration.js';
import {Chess} from './vendor/chess.js';
import {GameClock,clockLabel,gameMinutes,moveIncrement} from './clock.js';
import {GameSession,gameStatus} from './model.js';
import {GameOwner} from './game-owner.js';
import {ReviewAnalysis} from './accuracy.js';
import {installGameReview} from './game-review.js';
import {MoveRatings,appendMoveRating} from './move-ratings.js';
import {ChessCoach} from './coach.js';
import {StockfishEngine} from './engine.js';
import {NativeEngineTransport} from './native-engine.js';
import {LINE_COLORS,requestedLines,describeLine,arrowMarkup,AnalysisUpdates} from './analysis.js';
import {DEFAULT_SETTINGS,notation,chooseBookMove,bookMoves,computerMoveTime,normalizeAnalysisTime,analysisMoveTime,shouldThinkDuringTurn} from './features.js';
import {installMenus} from './menus.js';
import {MENU_MARKUP} from './menu-markup.js';
import {installSaveGame} from './save-game.js';
import {installImportGame} from './import-game.js';
import {installExportGame} from './export-game.js';
const $=id=>document.getElementById(id);
const session=new GameSession();
const moveRatings=new MoveRatings();
const coach=new ChessCoach(()=>renderCoach());
let coachTimer=null;
const boardMotion=new BoardMotion($('board'));
const moveSound=new MoveSound();
const moveHaptics=new MoveHaptics();
const winCelebration=new WinCelebration();
const mateCelebration=new CheckmateCelebration([$('gameCelebration'),$('analysisCelebration')]);
const glyph={p:'♟',n:'♞',b:'♝',r:'♜',q:'♛',k:'♚'},names={p:'pawn',n:'knight',b:'bishop',r:'rook',q:'queen',k:'king'};
let settings={...DEFAULT_SETTINGS,links:{}};
let engineMatch=null;
function matchActive(){return settings.opponent==='match'&&!!engineMatch;}
function matchView(view=tab){return view==='game'||view==='analysis';}
function selectedEngine(){return matchActive()&&matchView()?engineMatch[session.position().turn()==='w'?'white':'black']:settings.engine;}
function engineName(id=settings.engine){return (globalThis.chessNative?.engines||[]).find(item=>item.id===id)?.name||({'reckless090':'Reckless 0.9.0','plenty800':'PlentyChess 8.0.0','pawn201':'Pawnocchio 2.0.1','obsidian160':'Obsidian 16.0'}[id]||'Stockfish 19');}
function normalizeEngine(){if(!(globalThis.chessNative?.engines||[{id:'stockfish19'}]).some(item=>item.id===settings.engine))settings.engine='stockfish19';}
let nativeSuspended=false,benchmarkMode=false,nativeBackgroundClock=null,nativeNextClock=null,screenAwakeState=null;
let gameReview=null,reviewTimer=null;
const reviewAnalysis=new ReviewAnalysis(moveRatings,()=>{gameReview?.refresh();});
let menus=null,bookTimer,searchProgress=null,analysisProgress=null,analysisPaused=false,brainSuspended=false;
let gameOwner=null,inactiveTab=false;
let progressTimer=null,pendingProgress=null,lastProgressRender=0;
const PROGRESS_REFRESH_MS=2500;
const analysisUpdates=new AnalysisUpdates(publishAnalysis);
let gameClock=null,clockHistory=[],restoredClock=null,clockFlagHandled=false,moveClock=null;
let tab='game',selected=null,flipped=false,promotion=null,engineReady=false,engineFailed=false,requestId=0,bestHint=null,toastTimer,saved=[],scores={},analysis=null,analysisLines=[],analysisFen=null,analysisComplete=false,analysisExpected=0;
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3000);}
try{const data=JSON.parse(localStorage.getItem('chess-preview-v2')||localStorage.getItem('chess-preview-v1')||'null');if(data){engineMatch=data.engineMatch?{...data.engineMatch,paused:!data.backgroundResume}:null;restoredClock=data.clock;if(data.pgn){try{session.load(data.pgn,{cursor:data.cursor});if(['game','analysis','graph'].includes(data.tab))tab=data.tab;}catch{localStorage.setItem('chess-preview-invalid-position-backup',JSON.stringify(data));session.reset();restoredClock=null;engineMatch=null;toast('Invalid saved position skipped. A recovery copy was kept.');}}settings={...settings,...data.settings};if(data.engineVersion===engineName())moveRatings.restore(data.moveRatings);if(data.backgroundWaiting&&restoredClock?.current){const wait=data.backgroundWaiting,c=restoredClock.current,elapsed=Math.max(0,Date.now()-wait.since);if(settings.fixedTime===false){c.remaining[wait.side]=Math.max(0,c.remaining[wait.side]-elapsed);if(!c.remaining[wait.side])c.expired=wait.side;}else if(restoredClock.moveClock?.elapsed)restoredClock.moveClock.elapsed[wait.side]+=elapsed;}if((data.resourceDefaultsRevision||0)<2){settings.threads=2;settings.hash=150;}if((data.analysisTimeRevision||0)<1)settings.time=0;saved=Array.isArray(data.saved)?data.saved:[];scores=data.engineVersion===engineName()?(data.scores||{}):{};flipped=!!data.flipped;if(settings.shortcut==='hint')settings.shortcut='new';if((data.styleRevision||0)<2)settings.coordinates=true;if((data.styleRevision||0)<3){settings.theme=DEFAULT_SETTINGS.theme;settings.pieceSet='classic';}if((data.boardDefaultsRevision||0)<1&&settings.theme==='wood')settings.theme=DEFAULT_SETTINGS.theme;}}catch{try{localStorage.setItem('chess-preview-invalid-position-backup',localStorage.getItem('chess-preview-v2')||localStorage.getItem('chess-preview-v1')||'');}catch{}session.reset();toast('Saved position could not be safely loaded. Starting a new board; a recovery copy was kept.');}
if(globalThis.chessNative)settings.threads=Math.max(1,Math.min(globalThis.chessNative.maxThreads||1,Math.floor(Number(settings.threads)||2)));
if(globalThis.chessNative)settings.hash=Math.max(16,Math.min(globalThis.chessNative.maxHashMB||32,Math.floor(Number(settings.hash)||150)));
if(!Object.hasOwn(PIECE_SETS,settings.pieceSet))settings.pieceSet='classic';
normalizeEngine();
let connectedEngine=settings.engine;
if(settings.opponent==='match'&&(!engineMatch||!(globalThis.chessNative?.engines||[{id:'stockfish19'}]).some(item=>item.id===engineMatch.white)||!(globalThis.chessNative?.engines||[{id:'stockfish19'}]).some(item=>item.id===engineMatch.black))){settings.opponent='local';engineMatch=null;}
settings.fixedTime=settings.fixedTime!==false;
try{gameOwner=new GameOwner(localStorage);gameOwner.claim();}catch{gameOwner=null;}
settings.moveTime=Number(settings.moveTime)===0.6?DEFAULT_SETTINGS.moveTime:Math.round(Math.max(1,Math.min(60,Number(settings.moveTime)||DEFAULT_SETTINGS.moveTime)));
delete settings.tablebasePieces;
settings.gameMinutes=gameMinutes(settings.gameMinutes);settings.increment=moveIncrement(settings.increment);
resetGameClock(restoredClock);
function persist(){try{const data=JSON.stringify({engineVersion:engineName(),engineNames:Object.fromEntries((globalThis.chessNative?.engines||[]).map(e=>[e.id,e.name])),styleRevision:3,boardDefaultsRevision:1,analysisTimeRevision:1,resourceDefaultsRevision:2,engineMatch,moveRatings:moveRatings.serialize(session.moves),engineMatchProgress:matchActive()?{moves:session.length,complete:session.game.isGameOver()||clockExpired()}:null,pgn:session.game.pgn(),cursor:session.cursor,tab,settings,saved,scores,flipped,clock:clockSave()});if(gameOwner)return gameOwner.save('chess-preview-v2',data);localStorage.setItem('chess-preview-v2',data);return true;}catch{toast('Browser storage is full or unavailable. Export PGN to keep your game.');return false;}}
function ensureSelectedEngine(){
  const desired=selectedEngine();
  if(connectedEngine===desired)return;
  ++requestId;clearTimeout(bookTimer);clearTimeout(progressTimer);progressTimer=null;pendingProgress=null;
  analysis=null;analysisLines=[];analysisProgress=null;searchProgress=null;engineReady=false;engineFailed=false;
  engine.suspend();connectedEngine=desired;if(!nativeSuspended)engine.resume();
}
function syncSettings(){delete settings.tablebasePieces;moveSound.setEnabled(settings.moveSound);moveHaptics.setEnabled(settings.moveHaptics);if(['walnut1','rosewood1'].includes(settings.theme))settings.theme=DEFAULT_SETTINGS.theme;normalizeEngine();ensureSelectedEngine();settings.time=normalizeAnalysisTime(settings.time);for(const id of ['theme'])$(id).value=settings[id];for(const id of ['coordinates','legalHints','lastMove'])$(id).checked=settings[id];document.body.dataset.theme=settings.theme;menus?.sync();}
const engine=new StockfishEngine(onInfo,onResult,status=>{engineReady=status==='ready';engineFailed=status==='unavailable';if(engineFailed)toast('Stockfish disconnected. Click Analysis to reconnect.');renderStatus();renderAnalysis();},()=>new NativeEngineTransport(connectedEngine),onSearchProgress);
function coachEnabled(){return settings.chessCoach===true&&settings.opponent==='computer'&&tab==='game'&&session.live&&!benchmarkMode&&!inactiveTab;}
function installCoachCard(){
  const card=document.createElement('section');card.id='coachCard';card.hidden=true;card.setAttribute('aria-label','Chess Coach');card.setAttribute('aria-live','polite');
  card.innerHTML='<div class="coach-heading"><strong id="coachTitle">Chess Coach</strong><button id="coachDismiss" type="button" aria-label="Dismiss coach advice">×</button></div><p id="coachExplanation"></p>';
  $('gamePanel').prepend(card);
  $('coachDismiss').onclick=()=>coach.dismiss();
}
function renderCoach(){
  const card=$('coachCard');if(!card)return;
  coach.expire();
  const feedback=coach.feedback;
  if(feedback&&!session.moves.some(move=>move.before===feedback.before&&move.after===feedback.after))coach.dismiss();
  card.hidden=!coachEnabled()||!coach.feedback;
  if(card.hidden)return;
  $('coachTitle').textContent='Chess Coach · '+feedback.severity+' — '+feedback.playedSan;
  $('coachExplanation').textContent=feedback.reason;
}
function reviewKey(){return session.game.pgn()+'|'+connectedEngine+'|'+(clockExpired()?gameClock.expired:'');}
function reviewAllowed(){return coachEnabled()&&!nativeSuspended&&(session.game.isGameOver()||clockExpired())&&$('gameReviewDialog')?.open;}
function cancelReviewAnalysis(){
  clearTimeout(reviewTimer);reviewTimer=null;reviewAnalysis.cancel();
  if(engine.pending?.review)engine.pending=null;
  if(engine.active?.review&&!engine.active.cancelled){engine.active.cancelled=true;engine.send('stop');}
}
function startReviewAnalysis(){
  if(!reviewAllowed())return;
  cancelReviewAnalysis();ensureSelectedEngine();reviewAnalysis.start(session,reviewKey());nextReviewSearch();
}
function nextReviewSearch(){
  if(!reviewAllowed()||reviewAnalysis.key!==reviewKey()){cancelReviewAnalysis();return;}
  const maxPV=(globalThis.chessNative?.engines||[]).find(item=>item.id===connectedEngine)?.maxPV||2;
  const job=reviewAnalysis.job(++requestId,maxPV);
  if(!job){gameReview?.refresh();persist();return;}
  reviewTimer=setTimeout(()=>{
    reviewTimer=null;
    if(!reviewAllowed()||engineFailed){cancelReviewAnalysis();gameReview?.refresh();return;}
    if(reviewAnalysis.accept(job,null))nextReviewSearch();
  },5000);
  engine.request({...job,threads:Number(settings.threads),hash:Number(settings.hash),tablebasePath:settings.tablebasePath});
}
function computerTurn(){return (tab==='game'||matchActive()&&matchView())&&session.live&&!session.game.isGameOver()&&!clockExpired()&&(matchActive()?!engineMatch.paused:settings.opponent==='computer'&&session.game.turn()!==settings.side);}
function validJob(job){return !benchmarkMode&&!nativeSuspended&&!inactiveTab&&job.id===requestId&&job.fen===session.position().fen()&&!clockExpired();}
function continuousTurnSearch(position){
  const liveTurn=tab==='game'&&session.live&&!position.isGameOver();
  return liveTurn&&((settings.showAnalysis&&!computerTurn())||shouldThinkDuringTurn(settings,position,{tab,live:session.live}));
}
function analyze(preserveAnalysis=false){
  analysisUpdates.cancel();
  if(inactiveTab||nativeSuspended||benchmarkMode)return;
  if(matchActive()&&(engineMatch.paused||!matchView()||!session.live)){engine.cancel();renderAnalysis();return;}
  ensureSelectedEngine();
  if(tab==='analysis'&&analysisPaused){engine.cancel();renderAnalysis();return;}
  const position=session.position(),id=++requestId;
  clearTimeout(coachTimer);coachTimer=null;
  clearTimeout(progressTimer);progressTimer=null;pendingProgress=null;lastProgressRender=0;
  searchProgress=null;analysisProgress=null;renderSearchCount();
  clearTimeout(bookTimer);
  bestHint=null;
  if(!preserveAnalysis||analysisFen!==position.fen()){analysis=null;analysisLines=[];}
  analysisFen=position.fen();analysisComplete=false;
  const showLines=tab==='analysis'||(tab==='game'&&settings.showAnalysis);
  const thinkDuringTurn=continuousTurnSearch(position);
  brainSuspended=thinkDuringTurn&&(document.hidden||!!document.querySelector('dialog[open]'));
  const permanentBrain=thinkDuringTurn&&!brainSuspended;
  analysisExpected=Math.min(requestedLines(position,showLines),(globalThis.chessNative?.engines||[]).find(item=>item.id===connectedEngine)?.maxPV||3);
  engine.cancel();
  syncClock();
  if(clockExpired()){renderStatus();renderAnalysis();return;}
  const coachJob=coach.job(id,position.fen(),coachEnabled());
  renderCoach();
  // Restore book arrows immediately after the animation, before coach searches.
  renderAnalysis();
  if(coachJob&&!position.isGameOver()){
    coachTimer=setTimeout(()=>{if(id!==requestId)return;coach.clear();renderCoach();engine.cancel();analyze();},5000);
    engine.request({...coachJob,multiPV:Math.min(coachJob.multiPV,(globalThis.chessNative?.engines||[]).find(item=>item.id===connectedEngine)?.maxPV||3),threads:Number(settings.threads),hash:Number(settings.hash),wdl:false,tablebasePath:settings.tablebasePath});
    renderStatus();return;
  }
  if(position.isGameOver()){
    coach.pending=null;
    analysisComplete=true;
    scores[position.fen()]=position.isCheckmate()?(position.turn()==='w'?-100:100):0;
    $('engineBadge').textContent='Game over';
    renderAnalysis();renderGraph();persist();return;
  }
  renderAnalysis();
  const bookMove=computerTurn()&&settings.openingBook?chooseBookMove(position,Math.random,settings.bookVariety):null;
  if(bookMove){
    renderStatus();
    bookTimer=setTimeout(()=>{if(id!==requestId||!computerTurn())return;makeMove({from:bookMove.uci.slice(0,2),to:bookMove.uci.slice(2,4),promotion:bookMove.uci[4]||'q'});},matchActive()?1500:350);
    return;
  }
  engine.request({id,fen:position.fen(),permanentBrain,computer:computerTurn(),clock:computerTurn()&&settings.fixedTime===false?gameClock.uci():null,multiPV:analysisExpected,level:computerTurn()&&!matchActive()?Number(settings.level):20,time:computerTurn()?(matchActive()?engineMatch.seconds*1000:computerMoveTime(settings)):(permanentBrain?0:showLines?analysisMoveTime(settings):1000),threads:Number(settings.threads),hash:Number(settings.hash),wdl:settings.wdl,tablebasePath:settings.tablebasePath});
  renderStatus();
}
function onSearchProgress(job){
  if(job.review)return;
  if(job.coach)return;
  if(!validJob(job))return;
  searchProgress={id:job.id,nodes:job.nodes,depth:job.searchDepth};
  pendingProgress={id:job.id,fen:job.fen,nodes:job.nodes,searchDepth:job.searchDepth,tbHits:job.tbHits,nps:job.nps};
  if(!lastProgressRender){publishSearchProgress();return;}
  if(progressTimer===null)progressTimer=setTimeout(publishSearchProgress,Math.max(0,PROGRESS_REFRESH_MS-(Date.now()-lastProgressRender)));
}
function publishSearchProgress(){
  clearTimeout(progressTimer);progressTimer=null;
  const job=pendingProgress;pendingProgress=null;
  if(!job||!validJob(job))return;
  lastProgressRender=Date.now();
  analysisProgress={fen:job.fen,nodes:job.nodes,depth:job.searchDepth,tbHits:job.tbHits,nps:job.nps};
  renderSearchCount();
  renderAnalysisProgress();
}
function renderAnalysisProgress(){
  const progress=analysisProgress?.fen===session.position().fen()?analysisProgress:null;
  const counter=$('engineDepth');
  counter.replaceChildren();
  if(!progress)return;
  const spanish=document.documentElement.lang==='es';
  const stats=[[(spanish?'Profundidad':'Depth'),progress.depth],[(spanish?'Velocidad':'Speed'),Number.isFinite(progress.nps)?new Intl.NumberFormat(document.documentElement.lang||'en',{maximumFractionDigits:0,useGrouping:false}).format(progress.nps/1000)+' kN/s':'—'],[(spanish?'Posiciones':'Positions'),new Intl.NumberFormat(document.documentElement.lang||'en').format(progress.nodes)]];
  for(const [label,value] of stats){
    const stat=document.createElement('span');stat.className='engine-stat engine-stat-badge';
    stat.textContent=label+'\u00a0'+value;counter.append(stat);
  }
}
function renderSearchCount(){
  const counter=$('positionCount'),position=session.position();
  const progress=analysisProgress?.fen===position.fen()?analysisProgress:null;
  counter.hidden=!(tab==='game'&&session.live&&!position.isGameOver()&&!clockExpired()&&engineReady&&!engineFailed&&progress);
  const spanish=document.documentElement.lang==='es';
  const bestLine=currentAnalysisLines().find(line=>line.rank===1),evaluation=bestLine?.evaluation||'—';
  counter.replaceChildren();
  if(!counter.hidden){
    const stats=[[(spanish?'Profundidad':'Depth'),progress.depth],[(spanish?'Puntuación':'Score'),evaluation],[(spanish?'Velocidad':'Speed'),Number.isFinite(progress.nps)?new Intl.NumberFormat(document.documentElement.lang||'en',{maximumFractionDigits:0,useGrouping:false}).format(progress.nps/1000)+' kN/s':'—'],[(spanish?'Posiciones':'Positions'),new Intl.NumberFormat(document.documentElement.lang||'en').format(progress.nodes)]];
    stats.forEach(([label,value],index)=>{
      if(index===1)counter.append(document.createTextNode(' '));
      if(index>=2)counter.append(document.createElement('br'));
      const stat=document.createElement('span');stat.className='engine-stat engine-stat-badge'+(index===1?' engine-stat-score':'');
      if(index<=2){
        stat.textContent=label+'\u00a0';
        const score=document.createElement('span');score.className=index===2?'stat-speed-value':'stat-score-value';score.dataset.scoreTone=index===1?(bestLine?.scoreTone||'neutral'):'neutral';score.textContent=value;stat.append(score);
      }else stat.textContent=label+'\u00a0'+value;
      counter.append(stat);
    });
    if(progress.tbHits>0){
      const indicator=document.createElement('span');indicator.className='tablebase-indicator';
      indicator.textContent='TB';indicator.title=spanish?'Bases de finales utilizadas':'Tablebases used';
      indicator.setAttribute('aria-label',indicator.title);counter.append(indicator);
    }
  }
}
function onInfo(job,info){
  if(job.review)return;
  if(job.coach){
    // The after-move search belongs to the visible position; publish its arrows.
    if(job.coachStage==='after'&&validJob(job))analysisUpdates.push(job,info);
    return;
  }
  if(validJob(job))analysisUpdates.push(job,info);
}
function publishAnalysis(job,info){
  if(!validJob(job))return;
  analysis=info;
  if(!matchActive()){moveRatings.record(job.fen,{...info,alternatives:job.lines.filter(line=>line.multipv>1)});renderHistory();menus?.refreshMoveList();}
  const score=(info.type==='mate'?(info.score>=0?100:-100):info.score/100)*(session.position().turn()==='w'?1:-1);
  if(scores[job.fen]!==score){scores[job.fen]=score;renderGraph();}
  analysisLines=job.lines.map(line=>describeLine(job.fen,line)).filter(Boolean);
  renderSearchCount();
  $('engineBadge').textContent=job.computer?engineName(connectedEngine)+' is thinking':'';
  renderAnalysis();
}
function onResult(job,move,info){
  if(job.review){
    if(!reviewAllowed()||reviewAnalysis.key!==reviewKey())return;
    clearTimeout(reviewTimer);reviewTimer=null;
    if(reviewAnalysis.accept(job,info?{...info,alternatives:job.lines.filter(line=>line.multipv>1)}:null)){gameReview?.refresh();persist();nextReviewSearch();}
    return;
  }
  if(job.coach){
    if(job.id!==requestId||nativeSuspended||inactiveTab||!coachEnabled()||session.game.fen()!==job.coachAfter||clockExpired())return;
    clearTimeout(coachTimer);coachTimer=null;
    if(job.coachStage==='after'&&info&&validJob(job)){analysisUpdates.flush();publishAnalysis(job,info);}
    if(info){moveRatings.record(job.fen,{...info,alternatives:job.lines.filter(line=>line.multipv>1)});renderHistory();menus?.refreshMoveList();}
    coach.accept(job,info?{...info,alternatives:job.lines.filter(line=>line.multipv>1)}:info);renderCoach();analyze(job.coachStage==='after'&&!!info);return;
  }
  if(!validJob(job))return;
  analysisUpdates.flush();
  publishSearchProgress();
  searchProgress=null;renderSearchCount();
  const position=session.position();
  if(info){
    scores[job.fen]=info.type==='mate'?(info.score*(position.turn()==='w'?1:-1)>=0?100:-100):info.score/100*(position.turn()==='w'?1:-1);
    renderGraph();persist();
  }
  bestHint=move&&move!=='(none)'?move:null;
  analysisComplete=true;$('engineBadge').textContent=engineName(connectedEngine);renderAnalysis();
  if(((job.computer&&computerTurn())||job.forceMove)&&session.live&&session.game.fen()===job.fen&&bestHint){
    try{makeMove({from:move.slice(0,2),to:move.slice(2,4),promotion:move[4]||'q'});}catch{toast('The engine returned an invalid move.');}
  }else renderStatus();
}
function renderBoard(){ boardMotion.cancel();$('boardFrame').classList.toggle('no-coordinates',!settings.coordinates);$('ranks').innerHTML=(flipped?[1,2,3,4,5,6,7,8]:[8,7,6,5,4,3,2,1]).map(n=>'<span>'+n+'</span>').join('');$('files').innerHTML=(flipped?'hgfedcba':'abcdefgh').split('').map(f=>'<span>'+f+'</span>').join('');$('arrows').replaceChildren();const position=session.position(),moves=session.moves,recent=moves[session.cursor-1],legal=selected&&settings.legalHints?position.moves({square:selected,verbose:true}):[],focus=document.activeElement?.dataset?.square;$('board').replaceChildren();for(let row=0;row<8;row++)for(let col=0;col<8;col++){const file=flipped?7-col:col,rank=flipped?row+1:8-row,sq='abcdefgh'[file]+rank,p=position.get(sq),b=document.createElement('button');b.className='square'+((file+rank)%2===1?' dark':'')+(sq===selected?' selected':'')+(settings.lastMove&&[recent?.from,recent?.to].includes(sq)?' recent':'')+(legal.some(m=>m.to===sq)?' legal'+(p?' capture':''):'')+(p?.type==='k'&&p.color===position.turn()&&position.isCheck()?' checked':'');b.dataset.square=sq;b.setAttribute('aria-label',sq+(p?' '+(p.color==='w'?'White':'Black')+' '+names[p.type]+(p.type==='k'&&p.color===position.turn()&&position.isCheck()?' in check':''):' empty'));b.setAttribute('aria-pressed',String(sq===selected));b.innerHTML=p?'<img class="piece-img" src="'+pieceImage(settings.pieceSet,p.color,p.type)+'" alt="" draggable="false">':'';b.onclick=()=>selectSquare(sq);$('board').append(b);}if(focus)$('board').querySelector('[data-square="'+focus+'"]')?.focus({preventScroll:true});renderAnalysisArrows();}
function selectSquare(square){
  if(boardMotion.running)return;
  syncClock();
  if(session.live&&clockExpired()){toast(clockStatus());return;}
  const position=session.position();
  if(position.isGameOver()){toast(gameStatus(position));return;}
  if(matchActive()){toast('Stop the engine match to play manually.');return;}
  if(tab==='game'&&settings.opponent==='computer'&&position.turn()!==settings.side){
    toast(session.live?engineName(selectedEngine())+' is thinking.':'Choose a position where it is your turn to continue.');return;
  }
  const p=position.get(square),moves=selected?position.moves({square:selected,verbose:true}).filter(m=>m.to===square):[];
  if(moves.length){
    if(moves.some(m=>m.promotion)){promotion={from:selected,to:square};$('promotionDialog').showModal();return;}
    makeMove({from:selected,to:square});
  }else{selected=p?.color===position.turn()?square:null;renderBoard();}
}
function makeMove(move){
  try{
    syncClock();
    const branching=!session.live,oldCursor=session.cursor,position=session.position();
    if(!branching&&clockExpired())throw Error(clockStatus());
    if(branching&&tab==='game'&&settings.opponent==='computer'&&position.turn()!==settings.side)throw Error('Choose a position where it is your turn to continue.');
    const coaching=coachEnabled()&&!branching&&position.turn()===settings.side;
    const coachBefore=coaching?(moveRatings.evaluation(position.fen())||(analysisFen===position.fen()?analysis:null)):null;
    const beforeMotion=boardMotion.capture();
    const color=position.turn(),result=session.move(move,{fromReview:branching});
    if(branching){
      gameClock.run(null);
      if(!gameClock.restore(clockHistory[oldCursor]))gameClock=new GameClock(settings.gameMinutes,settings.increment);
      clockHistory.length=oldCursor+1;clockFlagHandled=false;
    }
    if(settings.fixedTime===false&&(tab==='game'||matchActive()&&matchView())){
      gameClock.finishMove(color);clockHistory.length=session.cursor;clockHistory[session.cursor]=gameClock.snapshot();
    }
    if(coaching)coach.record(result,coachBefore);
    selected=null;changed({move:result,before:beforeMotion});
    if(branching)toast('Continuing from here.');
    return result;
  }catch(e){toast(e.message);throw e;}
}
function renderHistory(){const moves=session.moves;$('history').replaceChildren();if(!moves.length){const d=document.createElement('div');d.className='empty-history';d.innerHTML='<p>Select a piece, then its destination.</p>';$('history').append(d);}else moves.forEach((move,i)=>{if(move.color==='w'||i===0){const n=document.createElement('span');n.className='move-number';n.textContent=move.before.split(' ')[5]+(move.color==='w'?'.':'…');$('history').append(n);}const b=document.createElement('button');b.className='move-button'+(session.cursor===i+1?' current':'');b.textContent=notation(move.san,settings.figurine);const rating=moveRatings.get(move);appendMoveRating(b,rating);b.setAttribute('aria-label','View move '+(i+1)+': '+move.san+(rating?' — '+rating.label:''));b.onclick=()=>navigate(i+1);$('history').append(b);});if(session.live)$('history').scrollTop=$('history').scrollHeight;$('timeline').max=moves.length;$('timeline').value=session.cursor;for(const id of ['first','previous'])$(id).disabled=session.cursor===0;for(const id of ['next','last'])$(id).disabled=session.live;$('undo').disabled=moves.length===0;$('positionLabel').textContent=session.cursor===0?'Starting position':(session.live?'Latest position':'Reviewing')+' · '+session.cursor+' / '+moves.length;}
function syncScreenAwake(){
  if(!globalThis.chessNative?.setScreenAwake)return;
  const enabled=!nativeSuspended&&!document.hidden&&(benchmarkMode||session.live&&!session.game.isGameOver()&&!clockExpired()&&(tab==='game'||matchActive()&&matchView())&&(!matchActive()||!engineMatch.paused));
  if(screenAwakeState===enabled)return;
  screenAwakeState=enabled;
  chessNative.setScreenAwake(enabled).catch(()=>{screenAwakeState=null;});
}
function renderStatus(){gameReview?.update();syncClock();syncScreenAwake();renderSearchCount();const position=session.position(),positionStatus=tab==='analysis'&&!position.isGameOver()?'':gameStatus(position);$('status').textContent=(tab==='game'||tab==='analysis')&&position.isCheckmate()?'':session.live&&clockExpired()?clockStatus():matchActive()&&engineMatch.paused&&!position.isGameOver()?'Match paused':!session.live&&tab!=='analysis'?'Reviewing position'+(positionStatus?' · '+positionStatus:''):computerTurn()?(engineFailed?'Engine unavailable · choose Both Sides':''):tab==='game'&&!position.isGameOver()?'':positionStatus;const headers=session.game.getHeaders();$('whiteName').textContent=headers.White&&headers.White!=='?'?headers.White:(settings.opponent==='local'?(settings.yourName||'Player 1'):settings.side==='w'?(settings.yourName||'You'):engineName());$('blackName').textContent=headers.Black&&headers.Black!=='?'?headers.Black:(settings.opponent==='local'?(settings.yourName||'Player 2'):settings.side==='b'?(settings.yourName||'You'):engineName());$('whiteIndicator').classList.toggle('turn',position.turn()==='w');$('blackIndicator').classList.toggle('turn',position.turn()==='b');$('hint').disabled=!session.live||computerTurn()||position.isGameOver()||engineFailed;if(!engineReady)$('engineBadge').textContent=engineFailed?'Engine unavailable':'';menus?.sync();}
function renderGraph(){const moves=session.moves,positions=moves.length?[moves[0].before,...moves.map(m=>m.after)]:[session.game.fen()];const svg=$('graph');svg.innerHTML='<line x1="12" y1="65" x2="428" y2="65" stroke="#777"/><line x1="12" y1="8" x2="12" y2="123" stroke="#aaa"/>';let segment=[];const flush=()=>{if(segment.length){const path=document.createElementNS('http://www.w3.org/2000/svg','polyline');path.setAttribute('points',segment.join(' '));path.setAttribute('fill','none');path.setAttribute('stroke','#30383b');path.setAttribute('stroke-width','1.5');svg.append(path);if(settings.graphStyle==='filled'&&segment.length>1){const area=document.createElementNS('http://www.w3.org/2000/svg','polygon');area.setAttribute('points',segment[0].split(',')[0]+',65 '+segment.join(' ')+' '+segment.at(-1).split(',')[0]+',65');area.setAttribute('fill','#586da52b');svg.prepend(area);}segment=[];}};positions.forEach((fen,i)=>{if(typeof scores[fen]!=='number'){flush();return;}const x=12+(positions.length>1?i/(positions.length-1)*416:0),y=65-Math.max(-6,Math.min(6,scores[fen]*(settings.graphStyle==='black'?-1:1)))/6*55;segment.push(x+','+y);const point=document.createElementNS('http://www.w3.org/2000/svg','circle');point.setAttribute('cx',x);point.setAttribute('cy',y);point.setAttribute('r',i===session.cursor?'4':'2');point.setAttribute('fill',i===session.cursor?'#3232ff':'#555');svg.append(point);});flush();document.querySelector('.graph-title>span').textContent=settings.graphStyle==='black'?'Black advantage':'White advantage';const score=scores[session.position().fen()],current=typeof score==='number'?score*(settings.graphStyle==='black'?-1:1):undefined;$('graphScore').textContent=typeof current==='number'?(current>=0?'+':'')+current.toFixed(2):'Not analyzed';$('graphHelp').textContent=(settings.graphStyle==='black'?'Black above the line · White below':'White above the line · Black below')+' · Gaps are unanalyzed positions';}
function render(){renderCoach();renderBoard();renderHistory();renderStatus();renderGraph();renderAnalysis();}
function changed(motion){
  if(!motion){winCelebration.stop();mateCelebration.stop();}
  render();persist();
  if(!motion){analyze();return;}
  if(session.live&&session.game.isCheckmate()){winCelebration.play();mateCelebration.play(tab);}
  const id=++requestId,fen=session.position().fen();engine.cancel();clearTimeout(bookTimer);
  const animation=boardMotion.play(motion.move,motion.before);
  if(!nativeSuspended&&!inactiveTab){moveSound.play(!!motion.move.captured);moveHaptics.play();}
  animation.then(()=>{if(id===requestId&&fen===session.position().fen())analyze();});
  renderAnalysisArrows();syncClock();
}
function navigate(index){coach.clear();winCelebration.stop();mateCelebration.stop();if(matchActive())pauseEngineMatch();gameClock.tick();const previousCursor=session.cursor;session.navigate(index);selected=null;render();persist();if(tab==='analysis'&&session.cursor!==previousCursor&&session.cursor>0&&!nativeSuspended&&!inactiveTab)moveSound.play(!!session.moves[session.cursor-1]?.captured);analyze();}
function takeBack(){
  coach.clear();
  if(!session.cursor)return;
  if(tab!=='game'||settings.opponent!=='computer'){navigate(session.cursor-1);return;}
  ++requestId;engine.cancel();clearTimeout(bookTimer);boardMotion.cancel();
  gameClock.run(null);session.takeBack();
  if(!gameClock.restore(clockHistory[session.cursor]))gameClock=new GameClock(settings.gameMinutes,settings.increment);
  clockHistory.length=session.cursor+1;clockFlagHandled=false;
  selected=null;promotion=null;changed();
}
function setTab(next,restart=false){mateCelebration.stop();const keepMatch=!restart&&matchActive()&&!engineMatch.paused&&session.live&&matchView()&&matchView(next);if(matchActive()&&!matchView(next))pauseEngineMatch();gameClock.tick();analysisPaused=false;tab=next;for(const [key,id] of [['game','playTab'],['analysis','analysisTab'],['graph','graphTab']]){$(id).classList.toggle('active',key===tab);$(id).setAttribute('aria-selected',String(key===tab));$(key==='game'?'gamePanel':key+'Panel').hidden=key!==tab;}selected=null;render();persist();if(!keepMatch)analyze();}
function showDialog(id){
  if(matchActive())pauseEngineMatch();
  const next=$(id),previous=[...document.querySelectorAll('dialog[open]')];
  // Keep a modal in the top layer throughout navigation so its backdrop and
  // focus never briefly return to the board or the tapped Options row.
  if(!next.open)next.showModal();
  for(const dialog of previous)if(dialog!==next)dialog.close();
  suspendPermanentBrain();
}
function startNewGame(mode){
  if(!['w','b','both'].includes(mode))return;
  engineMatch=null;settings.opponent=mode==='both'?'local':'computer';
  settings.side=mode==='b'?'b':'w';
  session.reset();resetGameClock();selected=null;promotion=null;scores={};flipped=settings.side==='b';
  for(const d of document.querySelectorAll('dialog[open]'))d.close();
  syncSettings();setTab('game');persist();
}
function startEngineMatch(config){
  const installed=globalThis.chessNative?.engines||[{id:'stockfish19'}];
  if(!['white','black'].every(side=>installed.some(item=>item.id===config[side]))||![1,3,5,10,15,30,45,60,90,120].includes(config.seconds)){toast('Choose installed engines and a valid move time.');return;}
  ++requestId;engine.cancel();clearTimeout(bookTimer);
  engineMatch={white:config.white,black:config.black,seconds:config.seconds,fixedTime:config.fixedTime!==false,gameMinutes:gameMinutes(config.gameMinutes),increment:moveIncrement(config.increment),paused:false,tournamentId:config.tournamentId||null,round:config.round||null};
  settings.opponent='match';settings.fixedTime=config.fixedTime!==false;
  if(!settings.fixedTime){settings.gameMinutes=gameMinutes(config.gameMinutes);settings.increment=moveIncrement(config.increment);}
  session.reset();session.game.setHeader('White',engineName(config.white));session.game.setHeader('Black',engineName(config.black));session.game.setHeader('Event',config.tournamentId?'Engine Tournament':'Engine Match');
  if(config.round)session.game.setHeader('Round',String(config.round));
  resetGameClock();selected=null;promotion=null;scores={};flipped=false;
  for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
  syncSettings();setTab('game',true);persist();
}
function pauseEngineMatch(){
  if(!matchActive()||engineMatch.paused)return;
  engineMatch.paused=true;++requestId;clearTimeout(bookTimer);engine.cancel();gameClock.run(null);selected=null;render();persist();
}
function resumeEngineMatch(){
  if(!matchActive()||session.game.isGameOver()&&!engineMatch.tournamentId)return;
  session.navigate(session.length);engineMatch.paused=false;setTab('game',true);persist();
}
function stopEngineMatch(){
  if(!matchActive())return;
  pauseEngineMatch();settings.opponent='local';syncSettings();render();persist();analyze();
}
function playerHeader(color){const value=session.game.getHeaders()[color];return value&&value!=='?'?value:$(color.toLowerCase()+'Name').textContent;}
function saveGame(){const pgn=session.game.pgn();saved.unshift({id:Date.now().toString(),date:new Date().toLocaleString(),pgn,moves:session.length,white:playerHeader('White'),black:playerHeader('Black'),clock:clockSave()});if(persist()){toast('Game saved in this browser.');return true;}saved.shift();return false;}
function renderSaved(){$('savedGames').replaceChildren();if(!saved.length){const p=document.createElement('p');p.textContent='No saved games yet. Use Game → Save Game.';p.style.padding='20px';$('savedGames').append(p);return;}saved.forEach(entry=>{const b=document.createElement('button');b.className='saved-row';const title=document.createElement('strong'),detail=document.createElement('small');title.textContent=entry.white+' — '+entry.black;detail.textContent=entry.date+' · '+entry.moves+' half-moves';b.append(title,detail);b.onclick=()=>{try{session.load(entry.pgn);resetGameClock(entry.clock);selected=null;settings.opponent='local';syncSettings();$('gamesDialog').close();setTab('game');persist();toast('Saved game loaded in Both Sides mode.');}catch{toast('This saved game could not be loaded.');}};$('savedGames').append(b);});}
function loadHistoricalGame(pgn,cursor=0){
  // Validate the entire score and selected position before changing the live game.
  const candidate=new GameSession();
  try{candidate.load(pgn);candidate.navigate(cursor);}catch{return {error:'This historical game could not be loaded.'};}
  if(settings.opponent==='match'&&engineMatch?.tournamentId)return {error:'Finish or stop the tournament before opening game analysis.'};
  const keepPrevious=!!(session.length||session.game.getHeaders().FEN||engineMatch);
  if(keepPrevious){
    if(!saveGame())return {error:'Your current game could not be saved. Free some storage or export it before opening analysis.'};
  }else if(!persist())return {error:'Storage is unavailable. Your current game has been kept.'};
  ++requestId;engine.cancel();clearTimeout(bookTimer);clearTimeout(progressTimer);progressTimer=null;pendingProgress=null;
  analysisUpdates.cancel();winCelebration.stop();mateCelebration.stop();boardMotion.cancel();
  nativeBackgroundClock=null;nativeNextClock=null;
  engineMatch=null;settings.opponent='local';settings.showAnalysis=true;
  session.load(candidate.game.pgn());session.navigate(cursor);resetGameClock();
  selected=null;promotion=null;scores={};flipped=false;bestHint=null;
  analysis=null;analysisLines=[];analysisFen=null;analysisComplete=false;searchProgress=null;analysisProgress=null;
  syncSettings();for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
  setTab('analysis');persist();
  toast(keepPrevious?'Historical game opened. Your previous game is in Load Game.':'Historical game opened for analysis.');
  return {ok:true};
}
function exportPgn(){if(globalThis.chessNative){globalThis.chessNative.share(session.game.pgn()+'\n','chess-game-'+new Date().toISOString().slice(0,10)+'.pgn').catch(error=>toast(error.message));return;}const blob=new Blob([session.game.pgn()+'\n'],{type:'application/x-chess-pgn'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='chess-game-'+new Date().toISOString().slice(0,10)+'.pgn';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('PGN download prepared.');}
$('playTab').onclick=()=>setTab('game');$('analysisTab').onclick=()=>setTab('analysis');$('graphTab').onclick=()=>setTab('graph');
$('newGame').onclick=$('menuNew').onclick=()=>showDialog('newDialog');
document.querySelectorAll('[data-new-mode]').forEach(button=>button.onclick=()=>startNewGame(button.dataset.newMode));
$('settingsButton').onclick=()=>showDialog('settingsDialog');$('gameMenuButton').onclick=()=>showDialog('gameMenu');
$('saveButton').onclick=saveGame;$('gamesButton').onclick=()=>{renderSaved();showDialog('gamesDialog');};
$('importButton').onclick=()=>{$('importError').textContent='';showDialog('importDialog');};
$('exportButton').onclick=exportPgn;$('copyFen').onclick=async()=>{try{await navigator.clipboard.writeText(session.position().fen());toast('Position copied.');}catch{toast('Clipboard is unavailable. Use Export PGN instead.');}};
$('importForm').onsubmit=e=>{e.preventDefault();try{session.load($('notation').value);resetGameClock();selected=null;scores={};settings.opponent='local';syncSettings();$('importDialog').close();setTab('game');persist();toast('Loaded in Both Sides mode.');}catch(error){$('importError').textContent='Could not load notation. '+error.message;}};
$('flip').onclick=$('menuFlip').onclick=()=>{flipped=!flipped;renderBoard();persist();};
$('undo').onclick=()=>{gameClock.run(null);session.undo(settings.opponent==='computer'&&tab==='game',settings.side);if(!gameClock.restore(clockHistory[session.cursor]))resetGameClock();clockFlagHandled=false;selected=null;changed();};
$('hint').onclick=()=>{if(!bestHint){toast('The engine is still calculating. Try again shortly.');return;}const from=bestHint.slice(0,2),to=bestHint.slice(2,4);selected=from;renderBoard();$('board').querySelector('[data-square="'+to+'"]')?.classList.add('hinted');drawArrow(from,to);toast('Try '+from+' → '+to);};
$('first').onclick=()=>navigate(0);$('previous').onclick=()=>navigate(Math.max(0,session.cursor-1));$('next').onclick=()=>navigate(Math.min(session.length,session.cursor+1));$('last').onclick=()=>navigate(session.length);$('timeline').oninput=()=>navigate(Number($('timeline').value));
for(const id of ['opponent','side','level','theme','coordinates','legalHints','lastMove'])$(id).onchange=()=>{settings[id]=$(id).type==='checkbox'?$(id).checked:$(id).value;if(id==='side')flipped=settings.side==='b';syncSettings();selected=null;render();persist();if(['opponent','side','level'].includes(id))analyze();};


document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
document.querySelectorAll('[data-promote]').forEach(b=>b.onclick=()=>{if(promotion){const move={...promotion,promotion:b.dataset.promote};promotion=null;$('promotionDialog').close();makeMove(move);}});
$('promotionDialog').addEventListener('close',()=>{promotion=null;});
document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;if(e.key==='ArrowLeft'){e.preventDefault();navigate(Math.max(0,session.cursor-1));}if(e.key==='ArrowRight'){e.preventDefault();navigate(Math.min(session.length,session.cursor+1));}});
if(document.modelContext?.registerTool){const lifecycle=new AbortController();try{Promise.resolve(document.modelContext.registerTool({name:'get_chess_position',description:'Read the currently displayed chess position and legal moves.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({fen:session.position().fen(),moves:session.position().moves(),status:gameStatus(session.position()),cursor:session.cursor})},{signal:lifecycle.signal})).catch(()=>{});}catch{}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
// Preserve wall-clock time while native output is buffered and WebKit is asleep.
function captureNativeClock(keepSearch){
  nativeNextClock=null;
  nativeBackgroundClock=keepSearch&&(gameClock.running||moveClock.running)?{fen:session.game.fen(),side:session.game.turn(),startedAt:Date.now(),computer:!!engine.active?.computer}:null;
}
function chargeNativeClock(side,elapsed){
  if(settings.fixedTime===false){
    gameClock.remaining[side]=Math.max(0,gameClock.remaining[side]-elapsed);
    if(!gameClock.remaining[side]){gameClock.expired=side;gameClock.running=null;}
  }else moveClock.elapsed[side]+=elapsed;
}
function restoreNativeClock(searchFinishedAt){
  const saved=nativeBackgroundClock;nativeBackgroundClock=null;
  if(!saved||saved.fen!==session.game.fen())return;
  const now=Date.now(),finished=saved.computer&&searchFinishedAt?Math.min(now,Math.max(saved.startedAt,searchFinishedAt)):now;
  chargeNativeClock(saved.side,Math.max(0,finished-saved.startedAt));
  if(saved.computer&&searchFinishedAt)nativeNextClock={fen:saved.fen,side:saved.side==='w'?'b':'w',elapsed:Math.max(0,now-finished)};
}
function finishNativeClock(){
  const saved=nativeNextClock;nativeNextClock=null;
  // Debit the human only after the buffered computer move was legally applied.
  if(saved&&session.game.fen()!==saved.fen&&session.game.turn()===saved.side&&!session.game.isGameOver())chargeNativeClock(saved.side,saved.elapsed);
}
function backgroundGameEligible(){return !benchmarkMode&&!nativeSuspended&&session.live&&!session.game.isGameOver()&&!clockExpired()&&!document.querySelector('dialog[open]')&&(tab==='game'||matchActive()&&matchView())&&(matchActive()?!engineMatch.paused:settings.opponent==='computer'&&session.game.turn()!==settings.side);}
window.addEventListener('chess-native-lifecycle',event=>{
  const lifecycle=typeof event.detail==='string'?{type:event.detail}:event.detail;
  if(lifecycle.type==='match-background-expired'){pauseEngineMatch();return;}
  if(lifecycle.type==='screen-lock'||lifecycle.type==='match-inactive'||lifecycle.type==='background'&&matchActive()){screenAwakeState=null;nativeSuspended=true;++requestId;clearTimeout(bookTimer);clearTimeout(progressTimer);progressTimer=null;analysisUpdates.cancel();gameClock.run(null);advanceMoveClock(moveClock,session.game.fen(),session.game.turn(),false);if(matchActive())engineMatch.paused=true;engine.suspend();engineReady=false;if(lifecycle.type==='background')persist();return;}
  if(lifecycle.type==='background'){
    screenAwakeState=null;
    const keepSearch=!matchActive()&&engine.active&&!engine.active.cancelled&&!engine.active.coach;
    if(engine.active?.coach){coach.clear();clearTimeout(coachTimer);coachTimer=null;}
    captureNativeClock(keepSearch);
    const continueGame=!keepSearch&&(backgroundGameEligible()||(!benchmarkMode&&tab==='game'&&session.live&&!session.game.isGameOver()&&!clockExpired()&&!document.querySelector('dialog[open]')&&!matchActive()));
    winCelebration.stop();mateCelebration.stop();
    nativeSuspended=true;clearTimeout(bookTimer);clearTimeout(progressTimer);progressTimer=null;analysisUpdates.cancel();
    gameClock.run(null);advanceMoveClock(moveClock,session.game.fen(),session.game.turn(),false);persist();
    if(continueGame&&globalThis.chessNative?.backgroundGame){
      ++requestId;engine.suspend();engineReady=false;
      const data=JSON.parse(localStorage.getItem('chess-preview-v2'));
      data.engineNames=Object.fromEntries(chessNative.engines.map(e=>[e.id,e.name]));
      const tournament=JSON.parse(localStorage.getItem('chess-preview-tournament')||'null');
      chessNative.backgroundGame(data,tournament).catch(()=>{});
    }
  }
  else if(lifecycle.type==='foreground'){screenAwakeState=null;restoreNativeClock(lifecycle.searchFinishedAt);nativeSuspended=false;if(engine.suspended)engine.resume();render();}
  else if(lifecycle.type==='foreground-ready'){
    finishNativeClock();analysisUpdates.flush();publishSearchProgress();renderStatus();
    const continuous=continuousTurnSearch(session.position())||(tab==='analysis'&&!analysisPaused&&Number(settings.time)===0);
    if(!boardMotion.running&&!engine.active&&!engine.pending&&(!analysisComplete||continuous))analyze();
  }
  else if(lifecycle.type==='suspend'){screenAwakeState=null;nativeSuspended=true;++requestId;clearTimeout(bookTimer);clearTimeout(progressTimer);analysisUpdates.cancel();gameClock.run(null);advanceMoveClock(moveClock,session.game.fen(),session.game.turn(),false);persist();engineReady=false;engine.suspend();}
  else if(lifecycle.type==='resume'){screenAwakeState=null;nativeSuspended=false;if(!benchmarkMode)engine.resume();render();analyze();}
});
window.addEventListener('pagehide',()=>{winCelebration.stop();mateCelebration.stop();gameClock.run(null);persist();clearTimeout(bookTimer);engine.destroy();});
function suspendPermanentBrain(){
  if(engine.active?.permanentBrain||engine.pending?.permanentBrain){
    brainSuspended=true;++requestId;engine.cancel();
  }
}
document.addEventListener('visibilitychange',()=>{
  screenAwakeState=null;syncScreenAwake();
  if(document.hidden)moveSound.stop();
  if(document.hidden){winCelebration.stop();mateCelebration.stop();}
  if(document.hidden&&!globalThis.chessNative)suspendPermanentBrain();
});
menus=installMenus({
 state:()=>({settings,session,tab,analysisPaused,analysis,analysisLines,analysisFen,engineFailed,engineMatch,clockExpired:clockExpired()?gameClock.expired:null,suspended:nativeSuspended,celebrating:winCelebration.active}),
 moveRating:move=>moveRatings.get(move),
 startEngineMatch,pauseEngineMatch,resumeEngineMatch,stopEngineMatch,loadHistoricalGame,
 beginBenchmark:()=>{benchmarkMode=true;syncScreenAwake();++requestId;clearTimeout(bookTimer);clearTimeout(progressTimer);analysisUpdates.cancel();engine.suspend();engineReady=false;gameClock.run(null);advanceMoveClock(moveClock,session.game.fen(),session.game.turn(),false);},
 endBenchmark:()=>{benchmarkMode=false;syncScreenAwake();if(!nativeSuspended){engine.resume();analyze();}},
 open:showDialog,toast,status:gameStatus,navigate,takeBack,setTab,toggleAnalysis,save:saveGame,openSave:()=>saveScreen.open(),openImport:()=>importScreen.open(),openExport:()=>exportScreen.open(),renderSaved,exportPgn,
 flip:()=>{flipped=!flipped;renderBoard();persist();},
 hint:()=>{$('hint').onclick();},
 patch:patchSettings,
 moveNow:forceMove,
 loadPosition:(fen,view='game')=>{session.load(fen);resetGameClock();settings.opponent='local';selected=null;scores={};if(view==='analysis')settings.showAnalysis=true;syncSettings();setTab(view);persist();},
 pauseForScan:()=>{if(matchActive())pauseEngineMatch();clearTimeout(bookTimer);engine.cancel();},
 resumeAfterScan:()=>analyze(),
 resetEverything:keep=>{
   try{if(keep)localStorage.setItem('chess-preview-reset-backup',localStorage.getItem('chess-preview-v2')||localStorage.getItem('chess-preview-v1')||'');else localStorage.removeItem('chess-preview-reset-backup');}catch{toast('Could not create recovery copy. Export your game before resetting.');return;}
   settings={...DEFAULT_SETTINGS,links:{}};engineMatch=null;saved=[];scores={};session.reset();resetGameClock();selected=null;flipped=false;syncSettings();setTab('game');persist();
 },
 recoverReset:()=>{try{const data=JSON.parse(localStorage.getItem('chess-preview-reset-backup'));if(!data)throw Error();session.load(data.pgn);settings={...DEFAULT_SETTINGS,...data.settings};engineMatch=data.engineMatch?{...data.engineMatch,paused:true}:null;resetGameClock(data.clock);saved=data.saved||[];scores=data.scores||{};flipped=!!data.flipped;syncSettings();setTab('game');persist();toast('Previous games and settings restored.');}catch{toast('No valid recovery copy is available.');}}
},MENU_MARKUP);
installCoachCard();
gameReview=installGameReview({state:()=>({settings,session,tab,celebrating:winCelebration.active,suspended:nativeSuspended,inactive:inactiveTab,clockExpired:clockExpired()?gameClock.expired:null,result:clockExpired()?clockStatus():gameStatus(session.game),white:$('whiteName').textContent,black:$('blackName').textContent,reviewProgress:reviewAnalysis}),ratingFor:move=>moveRatings.get(move),accuracyFor:move=>moveRatings.accuracy(move),open:showDialog,startAnalysis:startReviewAnalysis,cancelAnalysis:cancelReviewAnalysis});
const saveScreen=installSaveGame({open:showDialog,snapshot:()=>({pgn:session.game.pgn(),white:playerHeader('White'),black:playerHeader('Black'),clock:clockSave()}),save:entry=>{
 saved.unshift({...entry,id:Date.now().toString(),date:new Date().toLocaleString()});
 if(!persist()){saved.shift();return false;}
 if(globalThis.chessNative){globalThis.chessNative.share(entry.pgn+'\n',entry.fileName).catch(error=>toast(error.message));toast('Game saved on this iPhone.');return true;}
 const blob=new Blob([entry.pgn+'\n'],{type:'application/x-chess-pgn'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=entry.fileName;link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
 toast('Game saved in this browser. '+entry.fileName+' download prepared.');return true;
}});
const importScreen=installImportGame({open:showDialog});
const exportScreen=installExportGame({open:showDialog,toast,exportFile:exportPgn,game:()=>session.game.pgn(),position:()=>session.position().fen()});
syncSettings();setTab(tab,true);
setInterval(syncClock,100);
setInterval(()=>{if(gameClock.running||moveClock?.running)persist();},5000);
window.addEventListener('storage',event=>{if(event.key===GameOwner.key)checkGameOwner();});
function checkGameOwner(){
  if(inactiveTab||!gameOwner||gameOwner.owns())return;
  inactiveTab=true;++requestId;clearTimeout(bookTimer);clearTimeout(progressTimer);engine.destroy();
  gameClock.run(null);advanceMoveClock(moveClock,session.game.fen(),session.game.turn(),false);
  const dialog=document.createElement('dialog');dialog.id='otherTabDialog';dialog.setAttribute('aria-labelledby','otherTabTitle');
  dialog.innerHTML='<h2 id="otherTabTitle">Game open in another tab</h2><p>This tab is paused so it cannot overwrite your latest game.</p><div class="dialog-actions"><button class="primary" id="continueHere">Continue here</button></div>';
  dialog.addEventListener('cancel',event=>event.preventDefault());
  dialog.querySelector('button').onclick=()=>location.reload();document.body.append(dialog);dialog.showModal();
}
new MutationObserver(syncClock).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});


function drawArrow(from,to){$('arrows').innerHTML=arrowMarkup([{uci:from+to,rank:1}],flipped);}

function toggleAnalysis(){setTab(tab==='analysis'?'game':'analysis');}
function currentAnalysisLines(){
  return analysisFen===session.position().fen()?analysisLines:[];
}
function renderAnalysisArrows(){
  const position=session.position(),book=(tab==='game'||matchActive()&&tab==='analysis')&&settings.openingBook?bookMoves(position).slice(0,2).map((move,i)=>({...move,rank:i+1})):[];
  const lines=tab==='game'?currentAnalysisLines().slice(0,2):currentAnalysisLines();
  const markup=!boardMotion.running&&(tab==='analysis'||(tab==='game'&&settings.showAnalysis))&&settings.analysisArrows
    ?arrowMarkup(book.length?book:lines,flipped):'';
  if($('arrows').innerHTML!==markup)$('arrows').innerHTML=markup;
}
function renderAnalysis(){
  document.body.classList.toggle('match-analysis',tab==='analysis'&&matchActive());
  const lines=currentAnalysisLines(),position=session.position();
  $('engineBadge').hidden=tab==='analysis'&&matchActive()&&!position.isGameOver()&&!engineFailed;
  if(tab==='analysis'&&analysisPaused)$('engineBadge').textContent='Analysis stopped';
  $('analysisLines').replaceChildren();
  $('analysisMessage').classList.toggle('checkmate-result',position.isCheckmate());
  $('analysisMessage').hidden=lines.length>0;
  if(!lines.length)$('analysisMessage').textContent=position.isGameOver()
    ?gameStatus(position)
    :tab==='analysis'&&analysisPaused?'Click Analysis to resume.':engineFailed?'Stockfish disconnected. Click Analysis to reconnect.'
    :'';
  $('analysisMessage').hidden=lines.length>0||!$('analysisMessage').textContent;
  mateCelebration.render(position);
  renderAnalysisProgress();
  $('analysisNote').textContent=position.isGameOver()?'No further moves.'
    :position.moves().length===1?'Only one legal move.'
    :position.moves().length===2?'Only two legal moves.'
    :'';
  $('analysisNote').hidden=!$('analysisNote').textContent;
  for(const line of lines){
    const row=document.createElement('li');row.className='analysis-line';
    row.dataset.rank=line.rank;row.dataset.move=line.uci;row.style.setProperty('--line-color',LINE_COLORS[line.rank-1]);
    const rank=document.createElement('span');rank.className='line-rank';rank.textContent=line.rank;
    const root=document.createElement('strong');root.className='line-move';root.textContent=notation(line.root,settings.figurine);
    const evaluation=document.createElement('span');evaluation.className='line-evaluation';evaluation.dataset.scoreTone=line.scoreTone;evaluation.textContent=line.evaluation;
    const continuation=document.createElement('p');continuation.className='line-continuation';continuation.textContent=notation(line.continuation,settings.figurine);
    row.append(rank,root,evaluation,continuation);$('analysisLines').append(row);
  }
  renderAnalysisArrows();menus?.renderInsights();
}

function patchSettings(patch){
  if(globalThis.chessNative&&Object.hasOwn(patch,'hash'))patch={...patch,hash:Math.max(16,Math.min(globalThis.chessNative.maxHashMB||32,Math.floor(Number(patch.hash)||150)))};
  if(globalThis.chessNative&&Object.hasOwn(patch,'threads'))patch={...patch,threads:Math.max(1,Math.min(globalThis.chessNative.maxThreads||1,Math.floor(Number(patch.threads)||2)))};
  const resetTime=['fixedTime','gameMinutes','increment'].some(key=>key in patch&&patch[key]!==settings[key]);
  if(['chessCoach','engine','opponent','side'].some(key=>key in patch))coach.clear();
  gameClock.tick();if('engine' in patch){scores={};moveRatings.clear();}Object.assign(settings,patch);
  settings.gameMinutes=gameMinutes(settings.gameMinutes);settings.increment=moveIncrement(settings.increment);
  if(resetTime)resetGameClock();
  if('side' in patch)flipped=settings.side==='b';
  selected=null;syncSettings();render();persist();
  if(!settings.showAnalysis&&tab==='analysis'){setTab('game');return;}
  if(Object.keys(patch).some(key=>['chessCoach','engine','opponent','side','level','moveTime','fixedTime','gameMinutes','increment','showAnalysis','time','threads','hash','tablebasePath','wdl','openingBook','bookVariety','permanentBrain','analysisArrows'].includes(key)))analyze();
}
function forceMove(){
  if(boardMotion.running||matchActive()&&engineMatch.paused)return;
  syncClock();if(clockExpired()){toast(clockStatus());return;}
  if(!session.live){toast('Use End of Game before requesting a move.');return;}
  if(session.game.isGameOver()){toast(gameStatus(session.game));return;}
  clearTimeout(bookTimer);
  if(engine.active?.computer&&validJob(engine.active)&&engine.moveNow())return;
  const book= settings.openingBook?chooseBookMove(session.game,Math.random,settings.bookVariety):null;
  const move=bestHint||book?.uci;
  if(move){makeMove({from:move.slice(0,2),to:move.slice(2,4),promotion:move[4]||'q'});return;}
  if(engine.active&&validJob(engine.active)&&engine.moveNow())return;
  const id=++requestId;
  engine.request({id,fen:session.game.fen(),computer:computerTurn(),forceMove:true,multiPV:1,level:computerTurn()&&!matchActive()?Number(settings.level):20,time:500,threads:settings.threads,hash:settings.hash,wdl:settings.wdl,tablebasePath:settings.tablebasePath});
}

function clockExpired(){return settings.fixedTime===false&&!!gameClock?.expired;}
function clockStatus(){return (gameClock.expired==='w'?'White':'Black')+' ran out of time';}
function clockSave(){if(moveClock)advanceMoveClock(moveClock,session.game.fen(),session.game.turn(),!!moveClock.running);return {fen:session.game.fen(),minutes:settings.gameMinutes,increment:settings.increment,current:gameClock.snapshot(),savedAt:Date.now(),runningSide:settings.fixedTime===false?gameClock.running:moveClock?.running,countUp:settings.fixedTime!==false,history:clockHistory,moveClock:moveClock?{fen:moveClock.fen,elapsed:{...moveClock.elapsed}}:null};}
function resetGameClock(saved=null){
  gameClock=new GameClock(settings.gameMinutes,settings.increment);clockHistory=[];clockFlagHandled=false;
  moveClock={fen:session.game.fen(),elapsed:{w:0,b:0},running:null,since:performance.now()};
  if(saved?.moveClock?.fen===moveClock.fen&&['w','b'].every(c=>Number.isFinite(saved.moveClock.elapsed?.[c])&&saved.moveClock.elapsed[c]>=0))moveClock.elapsed={...saved.moveClock.elapsed};
  if(saved?.fen===session.game.fen()&&saved.minutes===settings.gameMinutes&&saved.increment===settings.increment&&gameClock.restore(saved.current))clockHistory=Array.isArray(saved.history)?saved.history:[];
  // The clock belongs to the live game, even when restoring an earlier review move.
  clockHistory[session.length]=gameClock.snapshot();
}
function advanceMoveClock(clock,fen,turn,running,now=performance.now()){
  if(clock.running)clock.elapsed[clock.running]+=Math.max(0,now-clock.since);
  clock.fen=fen;
  clock.running=running?turn:null;clock.since=now;
}
function syncClock(){if(benchmarkMode){gameClock?.run(null);return;}if(nativeSuspended){gameClock.run(null);return;}
  if(!gameClock)return;
  if(inactiveTab)return;
  if(brainSuspended&&!document.hidden&&!document.querySelector('dialog[open]')){
    brainSuspended=false;
    if(continuousTurnSearch(session.position())){analyze();return;}
  }
  const turn=session.game.turn();
  const dialogOpen=!!document.querySelector('dialog[open]:not(#promotionDialog)');
  const waitingForEngine=(matchActive()||settings.opponent==='computer'&&turn!==settings.side)&&(!engineReady||engineFailed);
  const running=!nativeSuspended&&(!matchActive()||!engineMatch.paused)&&(tab==='game'||matchActive()&&matchView())&&session.live&&!session.game.isGameOver()&&!dialogOpen&&!waitingForEngine&&!boardMotion.running;
  gameClock.run(settings.fixedTime===false&&running?turn:null);
  advanceMoveClock(moveClock,session.game.fen(),turn,settings.fixedTime!==false&&running);
  for(const [color,id] of [['w','whiteClock'],['b','blackClock']]){
    const element=$(id),fixed=settings.fixedTime!==false;element.hidden=fixed&&!session.live;
    const elapsed=Math.floor(moveClock.elapsed[color]/1000);
    element.textContent=': '+(fixed?Math.floor(elapsed/60)+':'+String(elapsed%60).padStart(2,'0'):clockLabel(gameClock.remaining[color]));
    element.title=fixed?'Total time spent playing':'Time remaining in the game';
    element.classList.toggle('expired',!fixed&&gameClock.expired===color);
  }
  if(clockExpired()&&!clockFlagHandled){
    clockFlagHandled=true;++requestId;clearTimeout(bookTimer);engine.cancel();searchProgress=null;
    $('status').textContent=clockStatus();$('positionCount').hidden=true;
    $('engineBadge').textContent=clockStatus();syncScreenAwake();persist();gameReview?.update();
  }
}

// Native integration tests import this module inside the actual WKWebView.
export const nativeIntegration={
 state:()=>({tab,searchId:engine.active?.id??engine.pending?.id??null,fen:session.position().fen(),pgn:session.game.pgn(),length:session.length,cursor:session.cursor,ready:engineReady,engineIdentity:engine.identity,engineMatch:engineMatch?{...engineMatch}:null,settings:{...settings},lines:analysisLines,nodes:searchProgress?.nodes||0,depth:analysisProgress?.depth||0,active:!!engine.active,suspended:nativeSuspended,clock:clockSave()}),
 reset:()=>{engine.cancel();session.reset();resetGameClock();selected=null;scores={};changed();},
 startEngineMatch,pauseEngineMatch,resumeEngineMatch,stopEngineMatch,
 patch:patchSettings,setTab,analyze,navigate,takeBack,persist,
 load:pgn=>{engine.cancel();session.load(pgn);resetGameClock();selected=null;scores={};changed();}
};
