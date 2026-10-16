import {Chess} from './vendor/chess.js';

const NAMES={p:'pawn',n:'knight',b:'bishop',r:'rook',q:'queen',k:'king'};
const VALUES={p:1,n:3,b:3,r:5,q:9,k:0};
const side=color=>color==='w'?'White':'Black';
const other=color=>color==='w'?'b':'w';
const choose=(items,variation)=>items[variation%items.length];
function play(game,uci){
  if(typeof uci!=='string'||! /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(uci))return null;
  try{return game.move({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]});}catch{return null;}
}
function replay(fen,pv,limit=8){
  const game=new Chess(fen),moves=[];
  for(const uci of pv.slice(0,limit)){
    const move=play(game,uci);if(!move)return {game,moves,valid:false};moves.push(move);
  }
  return {game,moves,valid:true};
}
function lineText(moves,limit=4){
  return moves.slice(0,limit).map((move,index)=>{
    const number=move.before.split(' ')[5];
    return (move.color==='w'?number+'. ':index===0?number+'... ':'')+move.san;
  }).join(' ');
}
function captureSquare(move){return move.flags.includes('e')?move.to[0]+move.from[1]:move.to;}
function material(moves,player){
  return moves.reduce((sum,move)=>sum+(move.color===player?1:-1)*((VALUES[move.captured]||0)+(move.promotion?VALUES[move.promotion]-1:0)),0);
}
function canCapture(game,from,to,color){
  // A geometrical attack from a pinned piece is not a playable capture.
  const fen=game.fen().split(' ');fen[1]=color;fen[3]='-';
  return !!play(new Chess(fen.join(' ')),from+to)?.captured;
}
function between(square,from,to){
  const point=s=>[s.charCodeAt(0),Number(s[1])],a=point(from),b=point(to),p=point(square);
  const dx=b[0]-a[0],dy=b[1]-a[1];
  if(dx&&dy&&Math.abs(dx)!==Math.abs(dy))return false;
  return (p[0]-a[0])*dy===(p[1]-a[1])*dx&&p[0]>=Math.min(a[0],b[0])&&p[0]<=Math.max(a[0],b[0])&&p[1]>=Math.min(a[1],b[1])&&p[1]<=Math.max(a[1],b[1])&&square!==from&&square!==to;
}
function alternative(move,best,bestLine,reply,variation){
  const before=new Chess(move.before),better=new Chess(best.after),victim=reply.captured&&captureSquare(reply);
  let detail='';
  if(best.san.includes('#'))detail='delivers checkmate immediately';
  else if(before.isCheck())detail='answers the check';
  else if(victim&&best.from===victim)detail=`moves your ${NAMES[best.piece]} away from ${victim}`;
  else if(best.captured&&best.to===reply.from)detail=`removes the ${NAMES[best.captured]} before it can play ${reply.san}`;
  else if(victim&&better.get(victim)?.color===move.color&&better.isAttacked(victim,move.color)&&!new Chess(move.after).isAttacked(victim,move.color))detail=`keeps your ${NAMES[reply.captured]} on ${victim} defended`;
  else if(best.captured)detail=`captures the ${NAMES[best.captured]} on ${captureSquare(best)}`;
  else if(best.promotion)detail=`promotes your pawn to a ${NAMES[best.promotion]}`;
  else if(best.flags.includes('k')||best.flags.includes('q'))detail='castles, moving your king and bringing the rook into play';
  else if(best.san.includes('+'))detail='gives check, so your opponent has to respond to your king attack';
  if(detail)return choose([`${best.san} was stronger: it ${detail}.`,`A better choice was ${best.san}, which ${detail}.`,`Prefer ${best.san} here; it ${detail}.`],variation);
  if(bestLine.moves.length>=2)return choose([`Compare that with ${lineText(bestLine.moves,3)}, the engine's better continuation.`,`The stronger plan starts ${lineText(bestLine.moves,3)}.`,`Instead, look at ${lineText(bestLine.moves,3)}.`],variation);
  return choose([`The engine prefers ${best.san} in this position.`,`Consider ${best.san} as the stronger alternative here.`,`${best.san} keeps more of your position's value.`],variation);
}
function evaluationChange(beforeInfo,afterInfo,player){
  if(beforeInfo.type!=='cp'||afterInfo.type!=='cp')return '';
  const before=beforeInfo.score,after=-afterInfo.score,opponent=side(other(player));
  if(Math.abs(before)<=50&&after<=-150)return `This turns a roughly equal position into a clear advantage for ${opponent}.`;
  if(before>=150&&after<=50)return 'This gives back much of the advantage you had.';
  if(before<=-150&&after<before)return `You were already under pressure; this makes ${opponent}'s advantage larger.`;
  const loss=Math.max(0,(before-after)/100),amount=Number(loss.toFixed(1));
  return loss>=0.5?`The engine's evaluation is about ${amount} ${amount===1?'pawn':'pawns'} lower after this move.`:'';
}

// Each claim comes from the board, a legal PV, or the engine's mate/evaluation evidence.
// Vary the presentation between notifications without inventing a different tactic.
export function badMoveExplanation(move,beforeInfo,afterInfo,best,variation=0){
  const before=new Chess(move.before),after=new Chess(move.after),player=move.color,opponent=side(other(player));
  const continuation=replay(move.after,afterInfo.pv),bestLine=replay(move.before,beforeInfo.pv),reply=continuation.moves[0];
  if(!reply)return '';
  const better=alternative(move,best,bestLine,reply,variation),line=lineText(continuation.moves);
  const evidence=choose([`One engine continuation is ${line}.`,`The reply to watch is ${line}.`,`The analyzed line runs ${line}.`],variation);
  let cause='',theme='';
  if(afterInfo.type==='mate'&&afterInfo.score>0&&afterInfo.score<=5&&!(beforeInfo.type==='mate'&&beforeInfo.score<0)){
    theme='mate';
    cause=choose([
      `${move.san} allows ${opponent} to force checkmate, starting with ${reply.san}.`,
      `King safety comes first here: ${opponent} has a forced mate after ${move.san}, beginning ${reply.san}.`,
      `Watch ${reply.san}: after ${move.san}, the engine finds a forced mate for ${opponent}.`
    ],variation);
    if(continuation.game.isCheckmate())cause+=` The mating line is ${lineText(continuation.moves,8)}.`;
  }else if(beforeInfo.type==='mate'&&beforeInfo.score>0&&!(afterInfo.type==='mate'&&afterInfo.score<0)){
    theme='missedMate';
    cause=choose([
      `You missed a forced checkmate with ${best.san}.`,
      `There was a mating attack here: ${best.san} starts it, but ${move.san} lets it slip.`,
      `${best.san} was the chance to finish the game; the forced mate is no longer preserved after ${move.san}.`
    ],variation);
    const winning=bestLine.moves.length>1?`The winning continuation starts ${lineText(bestLine.moves,6)}.`:better;
    return variation%2?`${winning} ${cause}`:`${cause} ${winning}`;
  }
  if(!cause){
    const afterReply=new Chess(reply.after);
    const forkTargets=afterReply.board().flat().filter(piece=>piece?.color===player&&['k','q','r','b','n'].includes(piece.type)&&afterReply.attackers(piece.square,other(player)).includes(reply.to)&&(piece.type==='k'||canCapture(afterReply,reply.to,piece.square,other(player))));
    const follow=continuation.moves[2];
    if(forkTargets.length>=2&&follow?.captured&&follow.from===reply.to&&forkTargets.some(piece=>piece.square===captureSquare(follow))){
      theme='fork';
      const targets=forkTargets.map(piece=>`your ${NAMES[piece.type]} on ${piece.square}`).join(' and ');
      cause=choose([`${reply.san} creates a fork, attacking ${targets} at the same time.`,`The problem is the double attack: ${reply.san} threatens ${targets}.`,`After ${move.san}, watch the fork with ${reply.san} against ${targets}.`],variation);
      cause+=` In the engine's line, ${follow.san} then captures your ${NAMES[follow.captured]}.`;
    }else if(reply.promotion){
      theme='promotion';cause=`${reply.san} lets ${opponent}'s pawn promote to a ${NAMES[reply.promotion]}${reply.captured?`, capturing your ${NAMES[reply.captured]} on ${reply.to}`:''}. That promotion needs to be dealt with before spending a move elsewhere.`;
    }else if(reply.captured){
      const square=captureSquare(reply),victim=after.get(square),piece=NAMES[reply.captured],attacker=NAMES[reply.piece];
      const opened=['b','r','q'].includes(reply.piece)&&before.get(square)?.color===player&&between(move.from,reply.from,square);
      if(opened){
        theme='openedLine';
        cause=`Moving your ${NAMES[move.piece]} from ${move.from} opens the ${attacker}'s line to your ${piece} on ${square}. ${opponent} can now play ${reply.san}.`;
      }else if(victim?.color===player&&!after.isAttacked(square,player)){
        theme='loosePiece';
        cause=choose([
          `That move leaves your ${piece} undefended on ${square}. ${opponent} can capture it with the ${attacker} (${reply.san}).`,
          `Your ${piece} on ${square} has no defender, so ${reply.san} lets ${opponent} take it with the ${attacker}.`,
          `The danger after ${move.san} is ${reply.san}: your ${piece} on ${square} is left without protection.`
        ],variation);
        if(before.attackers(square,player).includes(move.from)&&!after.attackers(square,player).includes(move.to))cause+=` Your ${NAMES[move.piece]} was defending it from ${move.from}.`;
      }else if(continuation.valid&&continuation.moves.length>=2&&material([move,...continuation.moves],player)<=-1){
        theme='exchange';
        const loss=-material([move,...continuation.moves],player);
        cause=choose([`This exchange is costly: ${reply.san} captures your ${piece}, and the shown continuation costs about ${loss} ${loss===1?'pawn':'pawns'} of material.`,`Count both sides of the trade. After ${reply.san}, you give up more material than you recover: about ${loss} ${loss===1?'pawn':'pawns'} in the shown line.`,`Follow the exchanges after ${reply.san}: this sequence costs about ${loss} ${loss===1?'pawn':'pawns'} of material, even after counting what you capture.`],variation);
      }else{
        theme='capture';cause=`${opponent} can answer ${move.san} with ${reply.san}, capturing your ${piece} on ${square}${reply.san.includes('+')?' with check':''}.`;
      }
    }else if(follow?.captured&&afterReply.get(captureSquare(follow))?.color===player&&afterReply.get(captureSquare(follow))?.type===follow.captured&&canCapture(afterReply,follow.from,follow.to,other(player))){
      theme='threat';
      const target=`your ${NAMES[follow.captured]} on ${captureSquare(follow)}`;
      cause=follow.from===reply.to?`${reply.san} attacks ${target}.`:`After ${reply.san}, the ${NAMES[follow.piece]} on ${follow.from} threatens ${target}.`;
      cause+=` In the analyzed line, ${continuation.moves[1].san} does not stop ${follow.san} from taking it.`;
    }else if(best.captured){
      theme='missedCapture';cause=`${best.san} could have captured the ${NAMES[best.captured]} on ${captureSquare(best)}. After ${move.san}, ${opponent} instead gets ${reply.san}.`;
    }else if(reply.san.includes('+')){
      theme='check';cause=`${reply.san} comes with check. You must answer the king threat before carrying on with your own plan.`;
    }else{
      theme='evaluation';cause=evaluationChange(beforeInfo,afterInfo,player);
    }
  }
  // A concrete tactic comes first; quiet mistakes compare both analyzed plans.
  if(theme==='evaluation')return choose([`${cause} ${evidence} ${better}`,`${better} ${cause} ${evidence}`,`${evidence} ${cause} ${better}`],variation).trim();
  if(theme==='missedCapture')return `${cause} ${evidence}`;
  const extra=theme==='mate'&&continuation.game.isCheckmate()?'':theme==='loosePiece'&&continuation.moves.length===1?'':evidence;
  return choose([`${cause} ${better} ${extra}`,`${better} ${cause} ${extra}`,`${cause} ${extra} ${better}`],variation).trim();
}
