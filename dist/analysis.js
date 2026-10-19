import {Chess} from './vendor/chess.js';

export const LINE_COLORS = ['#315ea8', '#008f39', '#d32f2f'];

// Coalesce search bursts before converting PVs and rebuilding the game UI.
// Completion flushes the newest result immediately, without delaying a move.
export class AnalysisUpdates {
  constructor(publish, interval=100){this.publish=publish;this.interval=interval;this.timer=null;this.pending=null;}
  push(job,info){
    this.pending={job:{...job,lines:job.lines.slice()},info};
    if(this.timer===null)this.timer=setTimeout(()=>this.flush(),this.interval);
  }
  flush(){
    clearTimeout(this.timer);this.timer=null;
    const pending=this.pending;this.pending=null;
    if(pending)this.publish(pending.job,pending.info);
  }
  cancel(){clearTimeout(this.timer);this.timer=null;this.pending=null;}
}

// Display bands in centipawns, always measured from White's perspective.
export function whiteAssessment(score, type = 'cp') {
  if (!Number.isFinite(score)) return '';
  if (type === 'mate') return score >= 0 ? 'White is winning' : 'White is losing';
  if (score >= 300) return 'White is winning';
  if (score >= 100) return 'White is better';
  if (score >= 30) return 'White is slightly better';
  if (score > -30) return 'Equal position';
  if (score > -100) return 'White is slightly worse';
  if (score > -300) return 'White is worse';
  return 'White is losing';
}

export function requestedLines(game, analyzing) {
  return game.isGameOver() ? 0 : Math.min(analyzing ? 3 : 1, game.moves().length);
}

export function describeLine(fen, info) {
  const board = new Chess(fen);
  const whiteScore = info.score * (board.turn() === 'w' ? 1 : -1);
  const evaluation = info.type === 'mate'
    ? `#${Math.abs(info.score)}`
    : `${whiteScore >= 0 ? '+' : ''}${(whiteScore / 100).toFixed(2)}`;
  const moves = [];
  for (const uci of info.pv.slice(0, 10)) {
    if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(uci)) break;
    try {
      const number = Number(board.fen().split(' ')[5]);
      const color = board.turn();
      const move = board.move({from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] || 'q'});
      moves.push({san: move.san, number, color});
    } catch { break; }
  }
  if (!moves.length) return null;
  const continuation = moves.map((move, index) => {
    const prefix = move.color === 'w' ? `${move.number}. ` : index === 0 ? `${move.number}… ` : '';
    return prefix + move.san;
  }).join(' ');
  return {whiteScore,type:info.type,scoreTone: whiteScore > 0 ? 'positive' : whiteScore < 0 ? 'negative' : 'neutral', rank: info.multipv, root: moves[0].san, uci: info.pv[0], evaluation, assessment: whiteAssessment(whiteScore, info.type), continuation, depth: info.depth};
}

// A visual evaluation balance, not a win probability. Scores already use White's perspective.
export function evaluationBarState(line,result=null){
  if(['1-0','0-1','1/2-1/2'].includes(result))return {whiteShare:result==='1-0'?1:result==='0-1'?0:.5,label:result==='1/2-1/2'?'½–½':result==='1-0'?'1–0':'0–1',favored:result==='0-1'?'black':'white'};
  if(!line||!Number.isFinite(line.whiteScore)||!['cp','mate'].includes(line.type))return {whiteShare:.5,label:'—',favored:'white'};
  const score=line.whiteScore;
  if(line.type==='mate')return {whiteShare:score>=0?1:0,label:'M'+Math.abs(score),favored:score<0?'black':'white'};
  return {whiteShare:Math.max(.02,Math.min(.98,1/(1+Math.exp(-score/250)))),label:(score>=0?'+':'')+(score/100).toFixed(2),favored:score<0?'black':'white'};
}

// Hold the displayed evaluation while the next position is being searched.
export class EvaluationBar {
  constructor(){this.game=null;this.last=null;this.terminal=false;}
  // Playing from an earlier position replaces the game object, but continues this analysis.
  followMove(game){this.game=game;}
  update(game,line,result=null){
    if(game!==this.game){this.game=game;this.last=null;this.terminal=false;}
    const state=evaluationBarState(line,result);
    if(state.label!=='—'){
      this.last=state;this.terminal=['1-0','0-1','1/2-1/2'].includes(result);
      return {...state,pending:false};
    }
    // A completed game's result is not an evaluation of an earlier move.
    if(this.terminal){this.last=null;this.terminal=false;}
    return {...(this.last||state),pending:true};
  }
}

// Presentation only: previous search data must never become an engine input.
export class AnalysisDisplay {
  constructor(){this.game=null;this.engine=null;this.lines=[];this.progress=null;this.wdl=null;this.fen=null;}
  followMove(game){this.game=game;}
  update({game,engine,fen,lines=[],progress=null,wdl=null,terminal=false,continuingMatch=false}){
    if(game!==this.game||engine!==this.engine&&!continuingMatch){
      this.game=game;this.engine=engine;this.lines=[];this.progress=null;this.wdl=null;this.fen=null;
    }
    this.engine=engine;
    const freshProgress=progress&&(progress.depth>0||progress.nodes>0||Number.isFinite(progress.nps)||progress.tbHits>0);
    if(freshProgress)this.progress=progress;
    if(terminal){this.lines=[];this.wdl=null;this.fen=null;}
    else if(lines.length){this.lines=lines;this.wdl=wdl;this.fen=fen;}
    return {lines:this.lines,wdl:this.wdl,pending:!terminal&&this.fen!==fen,
      progress:this.progress?{...this.progress,tbHits:progress?.tbHits||0}:null};
  }
}

export function boardPoint(square, flipped = false) {
  if (!/^[a-h][1-8]$/.test(square)) throw Error('Invalid square');
  const file = 'abcdefgh'.indexOf(square[0]), rank = Number(square[1]);
  return [(flipped ? 7 - file : file) * 100 + 50, (flipped ? rank - 1 : 8 - rank) * 100 + 50];
}

export function arrowMarkup(lines, flipped = false) {
  return [...lines].reverse().map(line => {
    if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(line.uci) || ![1, 2, 3].includes(line.rank)) return '';
    const from = line.uci.slice(0, 2), to = line.uci.slice(2, 4);
    const [x1, y1] = boardPoint(from, flipped), [x2, y2] = boardPoint(to, flipped);
    const length = Math.hypot(x2 - x1, y2 - y1);
    if (!length) return '';
    const dx = (x2 - x1) / length, dy = (y2 - y1) / length;
    const neckX = x2 - dx * 26, neckY = y2 - dy * 26;
    const points = `${x2},${y2} ${neckX - dy * 14},${neckY + dx * 14} ${neckX + dy * 14},${neckY - dx * 14}`;
    return `<g data-rank="${line.rank}" data-from="${from}" data-to="${to}" fill="${LINE_COLORS[line.rank - 1]}" stroke="${LINE_COLORS[line.rank - 1]}" opacity="${line.rank === 1 ? '.72' : '.85'}"><line x1="${x1 + dx * 18}" y1="${y1 + dy * 18}" x2="${neckX}" y2="${neckY}" stroke-width="8"/><polygon points="${points}" stroke="none"/></g>`;
  }).join('');
}
