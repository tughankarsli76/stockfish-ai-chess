import test from 'node:test';
import assert from 'node:assert/strict';
import {Chess} from '../dist/vendor/chess.js';
import {ChessCoach,coachFeedback} from '../dist/coach.js';
import {DEFAULT_SETTINGS} from '../dist/features.js';
const info=(score,pv,type='cp',depth=14)=>({score,pv,type,depth});
const move=(fen,uci)=>new Chess(fen).move({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]});
const white='6k1/8/2b5/8/8/5N2/P7/6K1 w - - 0 1';
test('coach defaults off and does not schedule analysis when disabled',()=>{
 assert.equal(DEFAULT_SETTINGS.chessCoach,false);
 const coach=new ChessCoach(),played=move(white,'a2a3');coach.record(played);
 assert.equal(coach.job(1,played.after,false),null);assert.equal(coach.pending,null);
});
test('coach explains a verified undefended knight capture for White',()=>{
 const feedback=coachFeedback(move(white,'a2a3'),info(0,['f3d4']),info(350,['c6f3','g1f2']));
 assert.equal(feedback.severity,'Blunder');assert.match(feedback.reason,/knight undefended on f3/);assert.match(feedback.reason,/Black can capture it with the bishop/);
 assert.equal(feedback.bestSan,'Nd4');
});
test('coach evaluates Black from Black perspective and names the White attacker',()=>{
 const played=move('6k1/p7/5n2/8/8/2B5/8/6K1 b - - 0 1','a7a6');
 const feedback=coachFeedback(played,info(0,['f6d5']),info(300,['c3f6']));
 assert.equal(feedback.severity,'Blunder');assert.match(feedback.reason,/White can capture it with the bishop/);
});
test('a defended knight does not receive an unsupported undefended claim',()=>{
 const played=move('6k1/8/2b5/8/8/5N2/P7/5RK1 w - - 0 1','a2a3');
 const feedback=coachFeedback(played,info(0,['f3d4']),info(300,['c6f3','f1f3']));
 assert.ok(feedback);assert.doesNotMatch(feedback.reason,/undefended/);assert.match(feedback.reason,/Bxf3/);
});
test('good moves, shallow results, invalid PVs and moves matching the best move produce no warning',()=>{
 const played=move(white,'a2a3');
 assert.equal(coachFeedback(played,info(0,['f3d4']),info(25,['c6f3'])),null);
 assert.equal(coachFeedback(played,info(0,['f3d4'],'cp',4),info(300,['c6f3'])),null);
 assert.equal(coachFeedback(played,info(0,['a2a3']),info(300,['c6f3'])),null);
 assert.equal(coachFeedback(played,info(0,['f3d4']),info(300,['a8a1'])),null);
});
test('coach explains a move allowing forced mate with a legal reply',()=>{
 const game=new Chess();game.move('f3');game.move('e5');const played=game.move('g4');
 const feedback=coachFeedback(played,info(-50,['g2g3']),info(1,['d8h4'],'mate'));
 assert.match(feedback.reason,/allows Black to force checkmate/);assert.match(feedback.reason,/Qh4#/);
});
test('already forced-lost positions do not generate exaggerated mate-loss warnings',()=>{
 const played=move(white,'a2a3');
 assert.equal(coachFeedback(played,info(-5,['f3d4'],'mate'),info(2,['c6f3'],'mate')),null);
});
test('coach serializes full-strength before/after jobs and rejects stale results',()=>{
 const coach=new ChessCoach(),played=move(white,'a2a3');coach.record(played);
 const before=coach.job(10,played.after,true);assert.equal(before.fen,played.before);assert.equal(before.level,20);assert.equal(before.computer,false);
 assert.equal(coach.accept({...before,coachAfter:'wrong'},info(0,['f3d4'])),false);
 assert.equal(coach.accept(before,info(0,['f3d4'])),true);
 const after=coach.job(11,played.after,true);assert.equal(after.fen,played.after);
 assert.equal(coach.accept(before,info(0,['f3d4'])),false);
 coach.accept(after,info(350,['c6f3']));assert.equal(coach.pending,null);assert.equal(coach.feedback.severity,'Blunder');
 coach.record(played);assert.equal(coach.job(12,new Chess().fen(),true),null);assert.equal(coach.feedback,null);
});
test('missing engine evidence ends coaching without inventing an explanation',()=>{
 const coach=new ChessCoach(),played=move(white,'a2a3');coach.record(played);
 coach.accept(coach.job(1,played.after,true),null);assert.equal(coach.pending,null);assert.equal(coach.feedback,null);
});

test('coach advice expires after 20 seconds without resetting on reads',t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']});let changes=0;
 const coach=new ChessCoach(()=>changes++),played=move(white,'a2a3');coach.record(played);
 coach.accept(coach.job(1,played.after,true),info(0,['f3d4']));
 coach.accept(coach.job(2,played.after,true),info(350,['c6f3']));
 assert.ok(coach.feedback);t.mock.timers.tick(19999);
 assert.ok(coach.feedback);coach.expire();assert.ok(coach.feedback);
 t.mock.timers.tick(1);assert.equal(coach.feedback,null);assert.ok(changes>=3);
});
test('new advice receives its own timer and dismiss cancels expiry',t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']});
 const coach=new ChessCoach(),played=move(white,'a2a3');
 const warn=()=>{coach.record(played,info(0,['f3d4']));coach.accept(coach.job(1,played.after,true),info(350,['c6f3']));};
 warn();t.mock.timers.tick(15000);warn();t.mock.timers.tick(5000);assert.ok(coach.feedback);
 t.mock.timers.tick(14999);assert.ok(coach.feedback);t.mock.timers.tick(1);assert.equal(coach.feedback,null);
 warn();coach.dismiss();assert.equal(coach.feedback,null);t.mock.timers.tick(20000);assert.equal(coach.feedback,null);
});
test('valid cached before-move analysis skips the extra search; shallow analysis does not',()=>{
 const coach=new ChessCoach(),played=move(white,'a2a3');
 coach.record(played,info(0,['f3d4']));assert.equal(coach.job(1,played.after,true).coachStage,'after');
 coach.record(played,info(0,['f3d4'],'cp',3));assert.equal(coach.job(2,played.after,true).coachStage,'before');
});

test('coach notifies all six requested move categories with appropriate explanations',()=>{
 const played=move(white,'a2a3'),before=info(0,['f3d4']);
 for(const [loss,severity] of [[300,'Blunder'],[150,'Mistake'],[75,'Inaccuracy'],[10,'Excellent']]){
  const feedback=coachFeedback(played,before,info(loss,['c6f3']));assert.equal(feedback.severity,severity);assert.ok(feedback.reason.length>20);
  if(severity==='Excellent'){assert.match(feedback.reason,/Excellent move/);assert.doesNotMatch(feedback.reason,/undefended/);}
 }
 const strong=move(white,'f3d4'),best={...before,alternatives:[{...info(-200,['a2a3']),multipv:2}]};
 assert.equal(coachFeedback(strong,best,info(0,['c6e4'])).severity,'Great');
 const offered=move('6k1/8/8/8/7b/5N2/P7/6K1 w - - 0 1','f3g5');
 const unique={...info(0,['f3g5']),alternatives:[{...info(-200,['a2a3']),multipv:2}]};
 const brilliant=coachFeedback(offered,unique,info(0,['h4g5']));assert.equal(brilliant.severity,'Brilliant');assert.match(brilliant.reason,/knight sacrifice/);
});
test('ordinary Good, Best, book and forced moves do not produce extra coach popups',()=>{
 assert.equal(coachFeedback(move(white,'a2a3'),info(0,['f3d4']),info(40,['c6f3'])),null);
 assert.equal(coachFeedback(move(white,'f3d4'),info(0,['f3d4']),info(0,['c6e4'])),null);
 const game=new Chess(),book=game.move('e4');
 assert.equal(coachFeedback(book,info(0,['g1f3']),info(75,['e7e5'])),null);
 const forced=move('8/8/8/8/8/6k1/7r/7K w - - 0 1','h1g1');
 assert.equal(coachFeedback(forced,info(0,['h1g1']),info(0,['h2g2'])),null);
});
test('before-move coach search requests alternatives, while the after search uses one line',()=>{
 const coach=new ChessCoach(),played=move(white,'a2a3');coach.record(played);
 const job=coach.job(1,played.after,true);assert.equal(job.multiPV,2);
 coach.accept(job,info(0,['f3d4']));assert.equal(coach.job(2,played.after,true).multiPV,1);
});
