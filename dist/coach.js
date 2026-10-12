import {Chess} from './vendor/chess.js';

const PIECES={p:'pawn',n:'knight',b:'bishop',r:'rook',q:'queen',k:'king'};
const VALUES={p:1,n:3,b:3,r:5,q:9,k:0};
const opposite=color=>color==='w'?'b':'w';
const colorName=color=>color==='w'?'White':'Black';
function play(game,uci){
  if(typeof uci!=='string'||! /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(uci))return null;
  try{return game.move({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]||'q'});}catch{return null;}
}
function usable(info){return info&&info.depth>=8&&['cp','mate'].includes(info.type)&&Number.isFinite(info.score)&&Array.isArray(info.pv);}
function score(info,turn,player){return (info.type==='mate'?(info.score>0?100000:-100000):info.score)*(turn===player?1:-1);}

// Explain only legal, engine-supported continuations. Never invent a tactical reason.
export function coachFeedback(move,beforeInfo,afterInfo){
  if(!usable(beforeInfo)||!usable(afterInfo))return null;
  const before=new Chess(move.before),after=new Chess(move.after),player=move.color;
  const best=play(before,beforeInfo.pv[0]);
  if(!best||best.lan===move.lan)return null;
  const beforeScore=score(beforeInfo,player,player),afterScore=score(afterInfo,opposite(player),player);
  const lost=beforeScore-afterScore;
  if(lost<100||beforeScore<=-100000&&afterScore<=-100000)return null;
  const severity=lost>=200?'Blunder':'Mistake';
  let reason='';
  const line=new Chess(move.after),reply=play(line,afterInfo.pv[0]);
  if(!reply)return null;
  if(afterInfo.type==='mate'&&afterInfo.score>0&&afterInfo.score<=5&&beforeScore>-100000){
    reason=`That move allows ${colorName(opposite(player))} to force checkmate. The engine's line starts with ${reply.san}. Look for a move that protects your king.`;
  }else if(beforeInfo.type==='mate'&&beforeInfo.score>0&&beforeInfo.score<=5&&afterInfo.type!=='mate'){
    reason=`You missed a forced checkmate. ${best.san} starts the winning line. Look for checks that limit the king's escape squares.`;
  }else if(reply.captured&&VALUES[reply.captured]>=3&&!after.isAttacked(reply.to,player)){
    const victim=after.get(reply.to);
    if(victim?.color===player){
      reason=`That move leaves your ${PIECES[reply.captured]} undefended on ${reply.to}. ${colorName(opposite(player))} can capture it with the ${PIECES[reply.piece]} (${reply.san}). Try protecting the ${PIECES[reply.captured]} or moving it to safety.`;
    }
  }
  if(!reason){
    // Replay a short legal continuation rather than guessing at positional causes.
    const continuation=new Chess(move.after),san=[];
    for(const uci of afterInfo.pv.slice(0,4)){const next=play(continuation,uci);if(!next)break;san.push(next.san);}
    reason=`${colorName(opposite(player))} can respond with ${san.join(' → ')}. The engine rates your position worse after this move. Consider ${best.san} instead.`;
  }
  return {severity,reason,bestMove:best.lan,bestSan:best.san,playedSan:move.san,before:move.before,after:move.after,player};
}

// The app shares its single native engine. Coach checks precede the normal reply.
export class ChessCoach {
  constructor(onChange=()=>{}){this.pending=null;this.feedback=null;this.dismissTimer=null;this.expiresAt=0;this.onChange=onChange;}
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
    return {id,coach:true,fen:pending.stage==='before'?pending.move.before:pending.move.after,coachAfter:pending.move.after,coachStage:pending.stage,computer:false,level:20,multiPV:1,time:1000};
  }
  accept(job,info){
    const pending=this.pending;
    if(!pending||job.coachAfter!==pending.move.after||job.coachStage!==pending.stage)return false;
    if(!usable(info)){this.pending=null;return true;}
    if(pending.stage==='before'){pending.beforeInfo=info;pending.stage='after';}
    else{
      const feedback=coachFeedback(pending.move,pending.beforeInfo,info);
      this.pending=null;this.dismiss();this.feedback=feedback;
      if(feedback){
        this.expiresAt=Date.now()+20000;
        this.dismissTimer=setTimeout(()=>{if(this.feedback===feedback)this.dismiss();},20000);
        this.dismissTimer?.unref?.();
        this.onChange();
      }
    }
    return true;
  }
}
