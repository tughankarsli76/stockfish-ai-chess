import test from 'node:test';
import assert from 'node:assert/strict';
import {Chess} from '../dist/vendor/chess.js';
import {GameSession} from '../dist/model.js';
import {MoveRatings,classifyMove} from '../dist/move-ratings.js';
import {winningChances,moveAccuracy,gameAccuracy,estimatedGameRating,ReviewAnalysis} from '../dist/accuracy.js';
const info=(score,pv,extra={})=>({depth:14,type:'cp',score,pv,...extra});
const fen='6k1/8/2b5/8/8/5N2/P7/6K1 w - - 0 1';
const play=(position,uci)=>new Chess(position).move({from:uci.slice(0,2),to:uci.slice(2,4)});
const move=play(fen,'a2a3');
test('Accuracy depends on lost winning chances, not a binary right/wrong count',()=>{
 const a=moveAccuracy(move,info(0,['f3d4']),info(50,['c6f3']));
 const b=moveAccuracy(move,info(0,['f3d4']),info(300,['c6f3']));
 assert.ok(a.score<100&&a.score>b.score&&b.score>=0);
 assert.ok(a.loss<b.loss);
});
test('a recommended best move scores 100 despite cross-search evaluation noise',()=>{
 const best=play(fen,'f3d4');assert.equal(moveAccuracy(best,info(0,['f3d4']),info(150,['c6e4'])).score,100);
});
test('WDL evidence is preferred and Black perspective is symmetric',()=>{
 assert.equal(winningChances(info(1000,['a2a3'],{wdl:[100,800,100]})),50);
 const black=play('6k1/p7/5n2/8/8/2B5/8/6K1 b - - 0 1','a7a6');
 assert.equal(moveAccuracy(black,info(0,['f6d5']),info(300,['c3f6'])).score,moveAccuracy(move,info(0,['f3d4']),info(300,['c6f3'])).score);
});
test('the same cp loss costs less winning chance in an already dominant position',()=>{
 const equal=moveAccuracy(move,info(0,['f3d4']),info(100,['c6f3']));
 const winning=moveAccuracy(move,info(1000,['f3d4']),info(-900,['c6f3']));
 assert.ok(winning.score>equal.score);
});
test('missing, shallow, bounded and invalid PV evidence cannot produce Accuracy',()=>{
 assert.equal(moveAccuracy(move,null,info(300,['c6f3'])),null);
 assert.equal(moveAccuracy(move,info(0,['f3d4'],{depth:8}),info(300,['c6f3'])),null);
 assert.equal(moveAccuracy(move,info(0,['f3d4'],{lowerbound:true}),info(300,['c6f3'])),null);
 assert.equal(moveAccuracy(move,info(0,['a8a1']),info(300,['c6f3'])),null);
});
test('per-player Accuracy is withheld until every move for that player is analyzed',()=>{
 const session=new GameSession();session.move('e4');session.move('e5');session.move('Nf3');
 const scores=new Map([[session.moves[0],100],[session.moves[1],80]]);
 let summary=gameAccuracy(session.moves,m=>scores.has(m)?{score:scores.get(m)}:null);
 assert.equal(summary.w.accuracy,null);assert.equal(summary.b.accuracy,80);
 scores.set(session.moves[2],50);summary=gameAccuracy(session.moves,m=>({score:scores.get(m)}));assert.equal(summary.w.accuracy,75);
 assert.equal(gameAccuracy([],()=>null).w.accuracy,null);
});
test('Game Rating is a bounded app index and never produced without Accuracy',()=>{
 assert.equal(estimatedGameRating(null),null);assert.equal(estimatedGameRating(100),3000);assert.equal(estimatedGameRating(0),0);
 assert.equal(estimatedGameRating(78.7),2350);assert.equal(estimatedGameRating(101),null);
});
test('completed Accuracy survives device persistence independently of raw search data',()=>{
 const ratings=new MoveRatings();ratings.record(move.before,info(0,['f3d4']));ratings.record(move.after,info(300,['c6f3']));
 const score=ratings.accuracy(move).score;ratings.get(move);
 const restored=new MoveRatings();restored.restore(JSON.parse(JSON.stringify(ratings.serialize([move]))));assert.equal(restored.accuracy(move).score,score);
 assert.equal(restored.accuracy(play(fen,'f3d4')),null);
});
test('review queue reuses terminal evidence, retries weak results and rejects canceled or stale jobs',()=>{
 const session=new GameSession();session.load('1. f3 e5 2. g4 Qh4#');
 const ratings=new MoveRatings(),review=new ReviewAnalysis(ratings);review.start(session,'game');
 assert.equal(review.total,4);assert.equal(ratings.evaluation(session.game.fen()).terminal,true);
 const first=review.job(1);assert.equal(first.level,20);assert.equal(first.multiPV,2);
 review.accept(first,null);const retry=review.job(2,1);assert.equal(retry.time,3000);assert.equal(retry.multiPV,1);
 assert.equal(review.accept(first,null),false);review.accept(retry,null);assert.equal(review.completed,1);
 const stale=review.job(3);review.cancel();assert.equal(review.accept(stale,info(0,['e2e4'])),false);
});
test('a checkmating move can use a known terminal score without a fictional continuation',()=>{
 const session=new GameSession();session.load('1. f3 e5 2. g4 Qh4#');const last=session.moves.at(-1),ratings=new MoveRatings();
 ratings.record(last.before,info(1,['d8h4'],{type:'mate'}));ratings.recordTerminal(session.game);
 assert.equal(ratings.accuracy(last).score,100);assert.equal(classifyMove(last,ratings.evaluation(last.before),ratings.evaluation(last.after)).kind,'best');
});

test('review requests only one PV in forced-move positions',()=>{
 const session=new GameSession();session.load('8/8/8/8/8/6k1/7r/7K w - - 0 1');session.move({from:'h1',to:'g1'});
 const review=new ReviewAnalysis(new MoveRatings());review.start(session,'clock-ended');assert.equal(review.job(1,2).multiPV,1);
});
