import {gameAccuracy} from './accuracy.js';
import {MOVE_RATINGS,appendMoveRating} from './move-ratings.js';

export function gameReviewStats(moves,ratingFor){
 const side=()=>({total:0,rated:0,unrated:0,counts:Object.fromEntries(Object.keys(MOVE_RATINGS).map(kind=>[kind,0]))});
 const stats={w:side(),b:side()};
 for(const move of moves){
  const player=stats[move.color];if(!player)continue;
  player.total++;
  const rating=ratingFor(move);
  if(rating&&Object.hasOwn(MOVE_RATINGS,rating.kind)){player.rated++;player.counts[rating.kind]++;}
  else player.unrated++;
 }
 return stats;
}
export function gameReviewFinished(state){
 return state.session.game.isGameOver()||!!state.clockExpired||['1-0','0-1','1/2-1/2'].includes(state.session.game.getHeaders().Result);
}
export function canShowGameReview(state,{automatic=false}={}){
 if(state.suspended||state.inactive||state.celebrating||!gameReviewFinished(state))return false;
 if(!automatic)return true;
 const headers=state.session.game.getHeaders();
 return state.session.live&&!state.engineMatch?.tournamentId&&headers.Event!=='Engine Tournament'&&headers['PositionSetup']!=='1'&&!headers.FEN;
}

export function installGameReview(api){
 const dialog=document.createElement('dialog');dialog.id='gameReviewDialog';dialog.className='game-review-dialog';dialog.setAttribute('aria-labelledby','gameReviewTitle');
 dialog.innerHTML='<div class="dialog-heading"><h2 id="gameReviewTitle">Game Review</h2><button id="gameReviewDone" type="button">Done</button></div><p id="gameReviewResult"></p><p id="gameReviewProgress" role="status" aria-live="polite"></p><button id="gameReviewRetry" type="button" hidden>Retry Analysis</button><table class="game-review-table"><thead><tr><th scope="col">Move Quality</th><th scope="col"><span>White</span><small id="gameReviewWhite"></small></th><th scope="col"><span>Black</span><small id="gameReviewBlack"></small></th></tr></thead><tbody id="gameReviewCounts"></tbody></table>';
 document.body.append(dialog);
 document.getElementById('gameReviewDone').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{clearTimeout(dismissTimer);dismissTimer=null;api.cancelAnalysis?.();});
 document.getElementById('gameReviewRetry').onclick=()=>{api.startAnalysis?.();fill(api.state());};
 const reopen=document.createElement('button');reopen.id='gameReviewButton';reopen.type='button';reopen.textContent='Game Review';reopen.hidden=true;
 document.getElementById('moveListButton').insertAdjacentElement('afterend',reopen);
 let timer=null,dismissTimer=null,seen=null,shownKey=null;
 const gameKey=state=>state.session.game.pgn()+'|'+(state.clockExpired||'');
 const cancel=()=>{clearTimeout(timer);timer=null;};
 function fill(state){
  const stats=gameReviewStats(state.session.moves,api.ratingFor),accuracy=gameAccuracy(state.session.moves,api.accuracyFor||(()=>null));
  const progress=state.reviewProgress;
  document.getElementById('gameReviewProgress').textContent=progress?.running?'Analyzing game… '+progress.completed+' / '+progress.total+' positions':accuracy.w.analyzed<accuracy.w.total||accuracy.b.analyzed<accuracy.b.total?'Analysis incomplete. You can retry the remaining positions.':'';
  document.getElementById('gameReviewRetry').hidden=!!progress?.running||accuracy.w.analyzed===accuracy.w.total&&accuracy.b.analyzed===accuracy.b.total;
  document.getElementById('gameReviewResult').textContent=state.result;
  document.getElementById('gameReviewWhite').textContent=state.white;
  document.getElementById('gameReviewBlack').textContent=state.black;
  const body=document.getElementById('gameReviewCounts');body.replaceChildren();
  const row=(label,w,b,kind=null)=>{
   const tr=document.createElement('tr'),heading=document.createElement('th');heading.scope='row';
   if(kind)appendMoveRating(heading,{...MOVE_RATINGS[kind],kind,reason:MOVE_RATINGS[kind].label},true);else heading.textContent=label;
   tr.dataset.category=kind||label;tr.append(heading);
   for(const [color,count] of [['w',w],['b',b]]){const cell=document.createElement('td');cell.dataset.side=color;cell.textContent=count;tr.append(cell);}
   body.append(tr);
  };
  row('Accuracy',accuracy.w.accuracy===null?'—':accuracy.w.accuracy.toFixed(1),accuracy.b.accuracy===null?'—':accuracy.b.accuracy.toFixed(1));
  row('Total moves',stats.w.total,stats.b.total);
  for(const kind of ['brilliant','great','best','excellent','good','book','inaccuracy','mistake','miss','missedWin','blunder'])row('',stats.w.counts[kind],stats.b.counts[kind],kind);
 }
 function open(){
  const state=api.state();if(!canShowGameReview(state))return;
  cancel();seen=shownKey=gameKey(state);fill(state);api.open(dialog.id);api.startAnalysis?.();clearTimeout(dismissTimer);dismissTimer=setTimeout(()=>{if(dialog.open)dialog.close();},20000);
 }
 reopen.onclick=open;
 function update(){
  const state=api.state(),finished=gameReviewFinished(state),key=finished?gameKey(state):null;
  reopen.hidden=false;
  reopen.disabled=!canShowGameReview(state);
  if(!finished){seen=null;shownKey=null;cancel();if(dialog.open)dialog.close();api.cancelAnalysis?.();return;}
  if(state.celebrating&&canShowGameReview({...state,celebrating:false},{automatic:true})){if(timer===null)schedule(key,250);return;}
  if(!canShowGameReview(state)){cancel();if(dialog.open)dialog.close();api.cancelAnalysis?.();return;}
  if(!canShowGameReview(state,{automatic:true})){cancel();return;}
  if(dialog.open&&shownKey!==key){shownKey=key;fill(state);}
  if(seen===key||timer!==null)return;
  schedule(key);
 }
 function schedule(key,delay=1000){
  timer=setTimeout(()=>{
   timer=null;
   const current=api.state();
   if(!canShowGameReview({...current,celebrating:false},{automatic:true})||gameKey(current)!==key||seen===key)return;
   if(current.celebrating){schedule(key,250);return;}
   // Do not interrupt another dialog or open an old game's summary.
   if(!document.querySelector('dialog[open]'))open();
  },delay);
 }

 return {update,open,refresh:()=>{if(dialog.open)fill(api.state());}};
}
