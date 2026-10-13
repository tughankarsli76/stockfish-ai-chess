import {Chess} from './vendor/chess.js';
export const ACCURACY_VERSION=2;

export function usableAccuracyInfo(info){
 return !!info&&info.depth>=10&&['cp','mate'].includes(info.type)&&Number.isFinite(info.score)&&!info.lowerbound&&!info.upperbound&&(info.terminal===true||Array.isArray(info.pv)&&info.pv.length>0);
}
export function validAccuracyPosition(fen,info){
 if(!usableAccuracyInfo(info))return false;
 if(info.terminal)return true;
 try{const uci=info.pv[0];return !!new Chess(fen).move({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]});}catch{return false;}
}
// Portable estimated winning chances from evaluation, not a calibrated FIDE model.
// Engine WDL is preferred and includes half the draw chance in expected score.
export function winningChances(info){
 if(info.type==='mate')return info.score>0?100:0;
 if(Array.isArray(info.wdl)&&info.wdl.length===3&&info.wdl.every(n=>Number.isFinite(n)&&n>=0)&&info.wdl.reduce((a,b)=>a+b,0)===1000)return (info.wdl[0]+info.wdl[1]/2)/10;
 return 100/(1+Math.exp(-Math.max(-10000,Math.min(10000,info.score))/250));
}
export function moveAccuracy(move,before,after){
 if(!usableAccuracyInfo(before)||!usableAccuracyInfo(after))return null;
 const game=new Chess(move.before);let best;
 try{const uci=before.pv[0];best=game.move({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]});}catch{return null;}
 if(!after.terminal){try{const uci=after.pv[0];new Chess(move.after).move({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]});}catch{return null;}}
 const loss=best.lan===move.lan?0:Math.max(0,winningChances(before)-(100-winningChances(after)));
 // Chance saturation must not hide another lost piece in a losing position.
 const cpLoss=best.lan===move.lan?0:before.type==='cp'&&after.type==='cp'?Math.max(0,before.score+after.score):before.type==='cp'&&after.type==='mate'&&after.score>0?1000:before.type==='mate'&&before.score>0&&!(after.type==='mate'&&after.score<0)?1000:0;
 const score=100*Math.exp(-Math.max(loss/20,cpLoss/200));
 return {version:ACCURACY_VERSION,score:Math.max(0,Math.min(100,score)),loss,cpLoss,beforeDepth:before.depth,afterDepth:after.depth};
}
export function gameAccuracy(moves,accuracyFor){
 const result={w:{total:0,analyzed:0,accuracy:null,averageCentipawnLoss:null},b:{total:0,analyzed:0,accuracy:null,averageCentipawnLoss:null}},sums={w:0,b:0},reciprocals={w:0,b:0},cpSums={w:0,b:0},cpCounts={w:0,b:0};
 for(const move of moves){const side=result[move.color];if(!side)continue;side.total++;const metric=accuracyFor(move);if(metric&&Number.isFinite(metric.score)){side.analyzed++;sums[move.color]+=metric.score;reciprocals[move.color]+=1/metric.score;if(Number.isFinite(metric.cpLoss)&&metric.cpLoss>=0){cpSums[move.color]+=metric.cpLoss;cpCounts[move.color]++;}}}
 for(const color of ['w','b'])if(result[color].total>0&&result[color].analyzed===result[color].total)result[color].accuracy=(sums[color]/result[color].total+result[color].total/reciprocals[color])/2;
 for(const color of ['w','b'])if(result[color].total>0&&cpCounts[color]===result[color].total)result[color].averageCentipawnLoss=cpSums[color]/result[color].total;
 return result;
}

// Missing positions are checked serially using the app's single native engine.
export class ReviewAnalysis {
 constructor(ratings,onChange=()=>{}){this.ratings=ratings;this.onChange=onChange;this.token=0;this.running=false;this.queue=[];this.completed=0;this.total=0;this.attempt=0;this.key=null;this.activeId=null;}
 start(session,key){
  this.cancel();this.key=key;
  if(session.game.isGameOver())this.ratings.recordTerminal(session.game);
  this.queue=[...new Set(session.moves.filter(move=>!this.ratings.accuracy(move)).flatMap(move=>[move.before,move.after]))].filter(fen=>!validAccuracyPosition(fen,this.ratings.evaluation(fen)));
  this.completed=0;this.total=this.queue.length;this.attempt=0;this.running=this.total>0;this.onChange();
 }
 job(id,maxPV=2){if(!this.running||!this.queue.length)return null;this.activeId=id;return {id,review:true,reviewToken:this.token,fen:this.queue[0],computer:false,level:20,multiPV:Math.max(1,Math.min(2,maxPV,new Chess(this.queue[0]).moves().length)),time:this.attempt?3000:1000,wdl:true};}
 accept(job,info){
  if(!this.running||job.id!==this.activeId||job.reviewToken!==this.token||job.fen!==this.queue[0])return false;
  if(validAccuracyPosition(job.fen,info))this.ratings.record(job.fen,info);
  else if(!this.attempt){this.attempt=1;this.onChange();return true;}
  this.queue.shift();this.completed++;this.attempt=0;this.running=this.queue.length>0;this.onChange();return true;
 }
 cancel(){this.token++;this.running=false;this.queue=[];this.attempt=0;this.activeId=null;}
}

// Provisional log-linear fit to two user-reported reference games (four sides).
// Based on mean evaluation loss, independently of the Accuracy display formula.
// References cover ACPL 55–96 only; do not claim calibration outside that range.
export function estimatedGameRating(averageCentipawnLoss){
 if(!Number.isFinite(averageCentipawnLoss)||averageCentipawnLoss<0)return null;
 return Math.max(0,Math.min(2400,Math.round(2035.0367269419546*Math.exp(-averageCentipawnLoss/109.93336198679971)/50)*50));
}
