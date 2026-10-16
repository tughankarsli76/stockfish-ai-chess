import {classifyMove,basicMoveRating} from './move-ratings.js';
import {Chess} from './vendor/chess.js';
import {badMoveExplanation} from './coach-explanations.js';

const PIECES={p:'pawn',n:'knight',b:'bishop',r:'rook',q:'queen',k:'king'};
function play(game,uci){
  if(typeof uci!=='string'||! /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(uci))return null;
  try{return game.move({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]||'q'});}catch{return null;}
}
function usable(info){return info&&info.depth>=8&&['cp','mate'].includes(info.type)&&Number.isFinite(info.score)&&Array.isArray(info.pv);}

// Explain only legal, engine-supported continuations. Never invent a tactical reason.
export function coachFeedback(move,beforeInfo,afterInfo,variation=0){
  if(!usable(beforeInfo)||!usable(afterInfo))return null;
  const before=new Chess(move.before),player=move.color;
  const best=play(before,beforeInfo.pv[0]);
  if(!best||basicMoveRating(move))return null;
  const rating=classifyMove(move,beforeInfo,afterInfo);
  const notifications=['brilliant','blunder','inaccuracy','mistake','excellent','great'];
  if(!rating||!notifications.includes(rating.kind)&&!['miss','missedWin'].includes(rating.kind))return null;
  const severity=['miss','missedWin'].includes(rating.kind)?'Blunder':rating.label;
  let reason='';
  const line=new Chess(move.after),reply=play(line,afterInfo.pv[0]);
  if(!reply)return null;
  if(rating.kind==='brilliant'){
    reason=`Brilliant move! ${move.san} offers a ${PIECES[move.piece]} sacrifice while maintaining your position. You found the strongest continuation.`;
  }else if(rating.kind==='great'){
    reason=`Great move! ${move.san} is the engine's best choice and is clearly stronger than the other analyzed option. You found the critical move.`;
  }else if(rating.kind==='excellent'){
    reason=`Excellent move! ${move.san} keeps your position very close to the engine's best evaluation. Keep looking for your opponent's threats.`;
  }else reason=badMoveExplanation(move,beforeInfo,afterInfo,best,variation);
  return {severity,reason,bestMove:best.lan,bestSan:best.san,playedSan:move.san,before:move.before,after:move.after,player};
}

// The app shares its single native engine. Coach checks precede the normal reply.
export class ChessCoach {
  constructor(onChange=()=>{}){this.pending=null;this.feedback=null;this.dismissTimer=null;this.expiresAt=0;this.explanationCount=0;this.onChange=onChange;}
  dismiss(){clearTimeout(this.dismissTimer);this.dismissTimer=null;this.expiresAt=0;this.feedback=null;this.onChange();}
  expire(){if(this.feedback&&Date.now()>=this.expiresAt)this.dismiss();}
  record(move,beforeInfo=null){
    this.dismiss();
    this.pending={move,stage:usable(beforeInfo)?'after':'before',beforeInfo:usable(beforeInfo)?beforeInfo:null};
  }
  clear(){this.pending=null;this.dismiss();}
  job(id,fen,enabled){
    const pending=this.pending;
    if(!enabled||pending&&pending.move.after!==fen){this.clear();return null;}
    if(!pending)return null;
    return {id,coach:true,fen:pending.stage==='before'?pending.move.before:pending.move.after,coachAfter:pending.move.after,coachStage:pending.stage,computer:false,level:20,multiPV:pending.stage==='before'?Math.min(2,new Chess(pending.move.before).moves().length):1,time:1000};
  }
  accept(job,info){
    const pending=this.pending;
    if(!pending||job.coachAfter!==pending.move.after||job.coachStage!==pending.stage)return false;
    if(!usable(info)){this.pending=null;return true;}
    if(pending.stage==='before'){pending.beforeInfo=info;pending.stage='after';}
    else{
      const feedback=coachFeedback(pending.move,pending.beforeInfo,info,this.explanationCount);
      this.pending=null;this.dismiss();this.feedback=feedback;
      if(feedback){
        this.explanationCount++;
        this.expiresAt=Date.now()+20000;
        this.dismissTimer=setTimeout(()=>{if(this.feedback===feedback)this.dismiss();},20000);
        this.dismissTimer?.unref?.();
        this.onChange();
      }
    }
    return true;
  }
}
