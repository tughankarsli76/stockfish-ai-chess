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
export function canShowGameReview(state){
 return state.settings.chessCoach===true&&state.settings.opponent==='computer'&&state.tab==='game'&&state.session.live&&!state.suspended&&!state.inactive&&(state.session.game.isGameOver()||!!state.clockExpired);
}

export function installGameReview(api){
 const dialog=document.createElement('dialog');dialog.id='gameReviewDialog';dialog.className='game-review-dialog';dialog.setAttribute('aria-labelledby','gameReviewTitle');
 dialog.innerHTML='<div class="dialog-heading"><h2 id="gameReviewTitle">Game Review</h2><button id="gameReviewDone" type="button">Done</button></div><p id="gameReviewResult"></p><table class="game-review-table"><thead><tr><th scope="col">Move Quality</th><th scope="col"><span>White</span><small id="gameReviewWhite"></small></th><th scope="col"><span>Black</span><small id="gameReviewBlack"></small></th></tr></thead><tbody id="gameReviewCounts"></tbody></table><p class="game-review-note">Counts cover rated moves only. Moves without enough analysis are listed separately.</p>';
 document.body.append(dialog);
 document.getElementById('gameReviewDone').onclick=()=>dialog.close();
 const reopen=document.createElement('button');reopen.id='gameReviewButton';reopen.type='button';reopen.textContent='Game Review';reopen.hidden=true;
 document.getElementById('moveListButton').insertAdjacentElement('afterend',reopen);
 let timer=null,seen=null,shownKey=null;
 const gameKey=state=>state.session.game.pgn()+'|'+(state.clockExpired||'');
 const cancel=()=>{clearTimeout(timer);timer=null;};
 function fill(state){
  const stats=gameReviewStats(state.session.moves,api.ratingFor);
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
  row('Total moves',stats.w.total,stats.b.total);
  row('Rated moves',stats.w.rated,stats.b.rated);
  for(const kind of ['brilliant','great','best','excellent','good','book','forced','inaccuracy','mistake','miss','missedWin','blunder'])row('',stats.w.counts[kind],stats.b.counts[kind],kind);
  row('Not yet rated',stats.w.unrated,stats.b.unrated);
 }
 function open(){
  const state=api.state();if(!canShowGameReview(state))return;
  cancel();seen=shownKey=gameKey(state);fill(state);api.open(dialog.id);
 }
 reopen.onclick=open;
 function update(){
  const state=api.state(),finished=state.session.game.isGameOver()||!!state.clockExpired,key=finished?gameKey(state):null;
  reopen.hidden=state.settings.chessCoach!==true||state.settings.opponent!=='computer';
  reopen.disabled=!canShowGameReview(state);
  if(!finished){seen=null;shownKey=null;cancel();if(dialog.open)dialog.close();return;}
  if(!canShowGameReview(state)){cancel();if(dialog.open)dialog.close();return;}
  if(dialog.open&&shownKey!==key){shownKey=key;fill(state);}
  if(seen===key||timer!==null)return;
  timer=setTimeout(()=>{
   timer=null;
   const current=api.state();
   // Do not interrupt another dialog or open an old game's summary.
   if(canShowGameReview(current)&&gameKey(current)===key&&!document.querySelector('dialog[open]'))open();
  },1000);
 }
 return {update,open};
}
