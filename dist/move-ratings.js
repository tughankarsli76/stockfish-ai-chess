import {moveAccuracy,ACCURACY_VERSION} from './accuracy.js';
import {Chess} from './vendor/chess.js';
import {bookMoves} from './features.js';

export const MOVE_RATINGS={
 brilliant:{label:'Brilliant',symbol:'!!',color:'#514fc4'},
 blunder:{label:'Blunder',symbol:'??',color:'#ad5753'},
 book:{label:'Book',symbol:'▤',color:'#b74c52'},
 forced:{label:'Forced',symbol:'→',color:'#468664'},
 miss:{label:'Miss',symbol:'×',color:'#996d92'},
 missedWin:{label:'Missed Win',symbol:'−',color:'#c93c35'},
 inaccuracy:{label:'Inaccuracy',symbol:'?!',color:'#db7439'},
 mistake:{label:'Mistake',symbol:'?',color:'#d4663b'},
 good:{label:'Good',symbol:'✓',color:'#397e62'},
 excellent:{label:'Excellent',symbol:'+',color:'#43865d'},
 best:{label:'Best',symbol:'★',color:'#389565'},
 great:{label:'Great',symbol:'!',color:'#6554c2'}
};
const VALUES={p:1,n:3,b:3,r:5,q:9,k:0};
const key=move=>move.before+'|'+move.lan+'|'+move.after;
const usable=info=>info&&info.depth>=8&&['cp','mate'].includes(info.type)&&Number.isFinite(info.score)&&(info.terminal===true||Array.isArray(info.pv)&&info.pv.length);
const value=info=>info.type==='mate'?(info.score>0?100000:-100000):info.score;
function play(game,uci){try{return typeof uci==='string'&&/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(uci)?game.move({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]}):null;}catch{return null;}}
function result(kind,reason){return {kind,reason,...MOVE_RATINGS[kind]};}

export function basicMoveRating(move){
 const game=new Chess(move.before),legal=game.moves({verbose:true});
 if(legal.length===1&&legal[0].lan===move.lan)return result('forced','The only legal move in this position.');
 if(bookMoves(game).some(item=>item.uci===move.lan))return result('book','A move in the built-in opening book.');
 return null;
}

export function classifyMove(move,beforeInfo,afterInfo){
 if(!usable(beforeInfo)||!usable(afterInfo))return null;
 const before=new Chess(move.before),after=new Chess(move.after),best=play(before,beforeInfo.pv[0]);
 if(!best||!afterInfo.terminal&&!play(new Chess(move.after),afterInfo.pv[0]))return null;
 const prior=value(beforeInfo),next=-value(afterInfo),loss=Math.max(0,prior-next);
 // A large evaluation swing after the recommended move is inconsistent evidence.
 if(best.lan===move.lan&&loss>=50)return null;
 if(prior===-100000&&next===-100000)return null;
 if(beforeInfo.type==='mate'&&beforeInfo.score>0&&next<100000){
  return next<=0?result('missedWin','A forced win was available before this move.'):result('miss','A forced mate was available but was not maintained.');
 }
 if(loss>=200)return result('blunder','The engine evaluation drops by at least two pawns.');
 if(loss>=100)return result('mistake','The engine evaluation drops by at least one pawn.');
 if(loss>=50)return result('inaccuracy','The engine evaluation drops by at least half a pawn.');
 if(best.lan===move.lan&&loss<=30){
  const runner=beforeInfo.alternatives?.find(line=>line.multipv===2||line.rank===2);
  const unique=usable(runner)&&runner.depth===beforeInfo.depth&&prior-value(runner)>=150;
  // A brilliant label requires a uniquely best, sound material sacrifice in the legal PV.
  const continuation=new Chess(move.after),reply=play(continuation,afterInfo.pv[0]);
  let material=(VALUES[move.captured]||0)-(move.promotion?0:VALUES[move.piece]||0),sacrificed=reply?.captured&&reply.to===move.to&&material<=-2;
  if(sacrificed){
   for(const uci of afterInfo.pv.slice(1,4)){
    const step=play(continuation,uci);if(!step){sacrificed=false;break;}
    if(step.captured)material+=(step.color===move.color?1:-1)*VALUES[step.captured];
   }
  }
  if(unique&&sacrificed&&material<=-2&&prior>=-50&&next>=-50)return result('brilliant','A uniquely best move sacrifices material while maintaining the position.');
  if(unique)return result('great','The best move is substantially stronger than the next analyzed choice.');
  return result('best','Matches the engine’s best move and maintains the evaluation.');
 }
 if(loss<=15)return result('excellent','Nearly matches the engine’s best evaluation.');
 return result('good','Keeps the position within half a pawn of the engine’s best evaluation.');
}

export class MoveRatings {
 constructor(){this.evaluations=new Map();this.ratings=new Map();this.basics=new Map();this.computed=new Map();this.accuracies=new Map();this.accuracyInputs=new Map();}
 clear(){this.evaluations.clear();this.ratings.clear();this.basics.clear();this.computed.clear();this.accuracies.clear();this.accuracyInputs.clear();}
 accuracy(move){
  const before=this.evaluations.get(move.before),after=this.evaluations.get(move.after),id=key(move),cached=this.accuracyInputs.get(id);
  if(cached&&cached.before===before&&cached.after===after)return this.accuracies.get(id)||null;
  const metric=moveAccuracy(move,before,after);this.accuracyInputs.set(id,{before,after});
  if(metric)this.accuracies.set(key(move),metric);
  return metric||this.accuracies.get(key(move))||null;
 }
 recordTerminal(game){
  if(!game.isGameOver())return;
  this.record(game.fen(),{depth:99,type:game.isCheckmate()?'mate':'cp',score:0,pv:[],terminal:true});
 }
 evaluation(fen){return this.evaluations.get(fen)||null;}
 record(fen,info){
  if(!usable(info))return;
  if(!info.terminal&&!play(new Chess(fen),info.pv[0]))return;
  const previous=this.evaluations.get(fen);
  if(previous&&previous.depth>info.depth)return;
  const alternatives=info.alternatives?.length?info.alternatives:previous?.depth===info.depth&&previous.pv[0]===info.pv[0]?previous.alternatives:[];
  this.evaluations.set(fen,{...info,pv:[...info.pv],alternatives:alternatives?.map(line=>({...line,pv:[...line.pv]}))});
  if(this.evaluations.size>1000)this.evaluations.delete(this.evaluations.keys().next().value);
 }
 get(move){
  const id=key(move);
  if(!this.basics.has(id)){
   this.basics.set(id,basicMoveRating(move));
  }
  const basic=this.basics.get(id),before=this.evaluations.get(move.before),after=this.evaluations.get(move.after);
  const cached=this.computed.get(id);
  if(!basic&&cached&&cached.before===before&&cached.after===after)return cached.rating||this.ratings.get(id)||null;
  const rating=basic||classifyMove(move,before,after);
  this.computed.set(id,{before,after,rating});
  if(rating)this.ratings.set(id,rating);
  else if(usable(this.evaluations.get(move.before))&&usable(this.evaluations.get(move.after)))this.ratings.delete(id);
  return rating||this.ratings.get(id)||null;
 }
 serialize(moves){return Object.fromEntries(moves.map(move=>{const id=key(move),rating=this.ratings.get(id),accuracy=this.accuracies.get(id);return [id,{kind:rating?.kind||null,reason:rating?.reason||'',accuracy}];}).filter(([,data])=>data.kind||data.accuracy));}
 restore(data){
  if(!data||typeof data!=='object'||Array.isArray(data))return;
  for(const [id,rating] of Object.entries(data).slice(0,1000)){
   if(id.length>400||!rating)continue;
   const metric=rating.accuracy;
   if(metric&&metric.version===ACCURACY_VERSION&&Number.isFinite(metric.cpLoss)&&metric.cpLoss>=0&&Number.isFinite(metric.score)&&metric.score>=0&&metric.score<=100&&Number.isFinite(metric.loss)&&metric.loss>=0&&metric.loss<=100&&metric.beforeDepth>=10&&metric.afterDepth>=10)this.accuracies.set(id,{...metric});
   if(Object.hasOwn(MOVE_RATINGS,rating.kind)&&typeof rating.reason==='string'&&rating.reason.length<=300)this.ratings.set(id,result(rating.kind,rating.reason));
  }
 }
}
export function appendMoveRating(element,rating,showLabel=false){
 if(!rating)return;
 const badge=document.createElement('span');badge.className='move-rating';badge.dataset.rating=rating.kind;badge.style.setProperty('--rating-color',rating.color);
 badge.textContent=rating.symbol;badge.setAttribute('aria-label',rating.label);badge.title=rating.label+' — '+rating.reason;
 element.append(document.createTextNode(' '),badge);element.title=badge.title;
 if(showLabel){const label=document.createElement('span');label.className='move-rating-label';label.textContent=rating.label;element.append(label);}
}
