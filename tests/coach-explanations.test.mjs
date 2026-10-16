import test from 'node:test';
import assert from 'node:assert/strict';
import {Chess} from '../dist/vendor/chess.js';
import {ChessCoach,coachFeedback} from '../dist/coach.js';
import {DEFAULT_SETTINGS,computerMoveTime} from '../dist/features.js';

const info=(score,pv,type='cp')=>({score,pv,type,depth:14});
const played=(fen,uci)=>new Chess(fen).move({from:uci.slice(0,2),to:uci.slice(2,4)});
function feedback(fen,uci,best,pv,variation=0){return coachFeedback(played(fen,uci),info(0,best),info(300,pv),variation);}

test('fork explanation identifies both targets, the follow-up capture, and a concrete prevention',()=>{
 const f=feedback('6k1/8/8/8/8/7n/P7/3K3R w - - 0 1','a2a3',['h1h3'],['h3f2','d1e2','f2h1']);
 assert.match(f.reason,/fork.*king on d1.*rook on h1/);assert.match(f.reason,/Nxh1.*captures your rook/);
 assert.match(f.reason,/Rxh3.*removes the knight/);assert.match(f.reason,/1\.\.\. Nf2\+ 2\. Ke2 Nxh1/);
});

test('geometrical attacks from a pinned knight are not described as a fork',()=>{
 const f=feedback('3k4/8/5n2/8/1Q3R2/8/8/4R1K1 w - - 0 1','e1d1',['b4a4'],['f6d5','d1e1','d5f4']);
 assert.doesNotMatch(f.reason,/fork|double attack/);assert.match(f.reason,/Nd5 2\. Re1 Nxf4/);
});

test('moving a blocker explains the newly opened attack on the queen',()=>{
 const f=feedback('4r1k1/8/8/8/8/8/4B3/4Q1K1 w - - 0 1','e2b5',['e1f2'],['e8e1','g1f2']);
 assert.match(f.reason,/bishop from e2 opens the rook's line to your queen on e1/);
 assert.match(f.reason,/Qf2.*moves your queen away from e1/);
});

test('quiet replies explain the next threat without pretending the capture is forced',()=>{
 const f=feedback('6k1/8/2n5/8/8/5Q2/P7/6K1 w - - 0 1','a2a3',['f3d1'],['c6e5','a3a4','e5f3']);
 assert.match(f.reason,/Ne5 attacks your queen on f3/);assert.match(f.reason,/a4 does not stop Nxf3\+/);
 assert.match(f.reason,/Qd1/);assert.doesNotMatch(f.reason,/forced|fork/);
});

test('moving the sole defender explains which piece was abandoned',()=>{
 const f=feedback('6k1/8/2b5/8/8/5N2/8/5RK1 w - - 0 1','f1e1',['f3d4'],['c6f3','g1f2']);
 assert.match(f.reason,/knight undefended on f3/);assert.match(f.reason,/rook was defending it from f1/);
 assert.match(f.reason,/Nd4.*moves your knight away from f3/);
});

test('unfavorable exchanges count the recapture instead of treating the entire rook as lost',()=>{
 const f=feedback('6k1/8/2b5/8/8/5R2/P7/5RK1 w - - 0 1','a2a3',['f3d3'],['c6f3','f1f3']);
 assert.match(f.reason,/costs about 2 pawns of material/);assert.match(f.reason,/Bxf3 2\. Rxf3/);
 assert.doesNotMatch(f.reason,/undefended|5 pawns of material/);
});

test('an equal bishop-for-knight exchange is not reported as a material loss',()=>{
 const f=feedback('6k1/8/2b5/8/8/5N2/P7/5RK1 w - - 0 1','a2a3',['f3d4'],['c6f3','f1f3']);
 assert.match(f.reason,/capturing your knight/);assert.doesNotMatch(f.reason,/undefended|cost.*material|down.*material/);
});

test('missed captures name the opportunity and quiet mistakes compare two actual plans',()=>{
 const capture=feedback('6k1/p7/8/8/4q3/8/P4N2/6K1 w - - 0 1','a2a3',['f2e4'],['e4e3','g1h2']);
 assert.match(capture.reason,/Nxe4.*captured the queen on e4/);
 const quiet=feedback('6k1/p7/8/8/8/8/P7/4N1K1 w - - 0 1','e1c2',['e1f3','a7a6','f3e5'],['a7a6','c2e3']);
 assert.match(quiet.reason,/roughly equal.*advantage for Black/);assert.match(quiet.reason,/1\. Nf3 a6 2\. Ne5/);
 assert.doesNotMatch(quiet.reason,/undefended|fork|weak square|doubled pawns/);
 const small=coachFeedback(played('6k1/p7/8/8/8/8/P7/4N1K1 w - - 0 1','e1c2'),info(0,['e1f3']),info(104,['a7a6','c2e3']));
 assert.match(small.reason,/about 1 pawn lower/);assert.doesNotMatch(small.reason,/1 pawns/);
});

test('illegal PV tails cannot fabricate an exchange or appear in the explanation',()=>{
 const f=feedback('6k1/8/2b5/8/8/5R2/P7/5RK1 w - - 0 1','a2a3',['f3d3'],['c6f3','a8a1']);
 assert.match(f.reason,/Bxf3/);assert.doesNotMatch(f.reason,/cost.*material|Ra1|a8a1/);
});

test('promotion advice identifies the new queen and how the better move stops it',()=>{
 const f=feedback('7k/8/8/8/8/8/R5pP/K7 w - - 0 1','h2h3',['a2g2'],['g2g1q','a1b2']);
 assert.match(f.reason,/g1=Q\+.*promote to a queen/);assert.match(f.reason,/Rxg2.*removes the pawn/);
});

test('forced-mate advice includes the legal mating move and a specific safer alternative',()=>{
 const game=new Chess();game.move('f3');game.move('e5');const move=game.move('g4');
 const f=coachFeedback(move,info(-50,['g2g3']),info(1,['d8h4'],'mate'));
 assert.match(f.reason,/force checkmate.*Qh4#/);assert.match(f.reason,/mating line is 2\.\.\. Qh4#/);assert.match(f.reason,/g3/);
});

test('successive coach notifications vary the explanation without changing the chess facts',()=>{
 const coach=new ChessCoach(),move=played('6k1/8/2b5/8/8/5N2/P7/6K1 w - - 0 1','a2a3'),reasons=[];
 for(let i=0;i<3;i++){
  coach.record(move,info(0,['f3d4']));coach.accept(coach.job(i,move.after,true),info(300,['c6f3']));
  const f=coach.feedback;assert.equal(f.severity,'Blunder');assert.equal(f.bestSan,'Nd4');
  for(const text of ['knight','f3','Bxf3','Nd4'])assert.ok(f.reason.includes(text));reasons.push(f.reason);
 }
 assert.equal(new Set(reasons).size,3);assert.notEqual(reasons[0].split('.')[0],reasons[1].split('.')[0]);coach.clear();
});

test('default human game is White with fixed five-second computer moves',()=>{
 assert.deepEqual({opponent:DEFAULT_SETTINGS.opponent,side:DEFAULT_SETTINGS.side,fixedTime:DEFAULT_SETTINGS.fixedTime,moveTime:DEFAULT_SETTINGS.moveTime},{opponent:'computer',side:'w',fixedTime:true,moveTime:5});
 assert.equal(computerMoveTime(DEFAULT_SETTINGS),5000);
});
