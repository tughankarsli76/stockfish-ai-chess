import test from 'node:test';
import assert from 'node:assert/strict';
import {Chess} from '../dist/vendor/chess.js';
import {classifyMove,MoveRatings} from '../dist/move-ratings.js';
const fen='6k1/8/2b5/8/8/5N2/P7/6K1 w - - 0 1';
const play=(position,uci)=>new Chess(position).move({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]});
const info=(score,pv,extra={})=>({type:'cp',depth:14,score,pv,...extra});
const bad=play(fen,'a2a3');
test('move ratings distinguish blunders, mistakes, inaccuracies and safe alternatives',()=>{
 for(const [loss,kind] of [[300,'blunder'],[150,'mistake'],[70,'inaccuracy'],[40,'good'],[10,'excellent']]){
  assert.equal(classifyMove(bad,info(0,['f3d4']),info(loss,['c6f3'])).kind,kind);
 }
});
test('Black move ratings use Black perspective',()=>{
 const black=play('6k1/p7/5n2/8/8/2B5/8/6K1 b - - 0 1','a7a6');
 assert.equal(classifyMove(black,info(0,['f6d5']),info(300,['c3f6'])).kind,'blunder');
});
test('a best move and a uniquely strong best move have distinct ratings',()=>{
 const best=play(fen,'f3d4'),after=info(0,['c6e4']);
 assert.equal(classifyMove(best,info(0,['f3d4']),after).kind,'best');
 assert.equal(classifyMove(best,info(0,['f3d4'],{alternatives:[info(-200,['a2a3'],{multipv:2})]}),after).kind,'great');
 assert.equal(classifyMove(best,info(0,['f3d4'],{alternatives:[info(-200,['a2a3'],{multipv:2,depth:8})]}),after).kind,'best');
});
test('Brilliant requires a sound uniquely best sacrifice, not merely a good move',()=>{
 // Nd4 is offered to the c6 bishop while the engine supports compensation.
 const sacrifice=play(fen,'f3d4');
 const baseline=info(0,['f3d4'],{alternatives:[info(-200,['a2a3'],{multipv:2})]});
 assert.equal(classifyMove(sacrifice,baseline,info(0,['c6d5'])).kind,'great');
 // A legal capture of the knight after Ng4 can substantiate the sacrifice.
 const position='6k1/8/8/8/7b/5N2/P7/6K1 w - - 0 1',offered=play(position,'f3g5');
 const before=info(0,['f3g5'],{alternatives:[info(-200,['a2a3'],{multipv:2})]});
 assert.equal(classifyMove(offered,before,info(0,['h4g5'])).kind,'brilliant');
 assert.equal(classifyMove(offered,info(0,['f3d4']),info(250,['h4g5'])).kind,'blunder');
});
test('missing or shallow analysis and illegal principal variations are not classified',()=>{
 assert.equal(classifyMove(bad,null,info(300,['c6f3'])),null);
 assert.equal(classifyMove(bad,info(0,['f3d4'],{depth:4}),info(300,['c6f3'])),null);
 assert.equal(classifyMove(bad,info(0,['f3d4']),info(300,['a8a1'])),null);
});
test('known opening-book and forced moves can be classified without engine analysis',()=>{
 const ratings=new MoveRatings(),opening=play(new Chess().fen(),'e2e4');
 assert.equal(ratings.get(opening).kind,'book');
 const forcedGame=new Chess('8/8/8/8/8/6k1/7r/7K w - - 0 1');
 const legal=forcedGame.moves({verbose:true});assert.equal(legal.length,1);
 assert.equal(ratings.get(forcedGame.move(legal[0])).kind,'forced');
});
test('ratings persist by the exact move and position, surviving coach-card dismissal',()=>{
 const ratings=new MoveRatings();ratings.record(bad.before,info(0,['f3d4']));ratings.record(bad.after,info(300,['c6f3']));
 assert.equal(ratings.get(bad).kind,'blunder');const saved=JSON.parse(JSON.stringify(ratings.serialize([bad])));
 const restored=new MoveRatings();restored.restore(saved);assert.equal(restored.get(bad).kind,'blunder');
 assert.equal(restored.get(play(fen,'f3d4')),null);
 restored.clear();assert.equal(restored.get(bad),null);
});
test('deeper evaluations take precedence and equal-depth updates keep alternative evidence',()=>{
 const ratings=new MoveRatings();ratings.record(bad.before,info(0,['f3d4'],{alternatives:[info(-200,['a2a3'],{multipv:2})]}));
 ratings.record(bad.before,info(0,['f3d4']));assert.equal(ratings.evaluations.get(bad.before).alternatives.length,1);
 ratings.record(bad.before,info(100,['a2a3'],{depth:4}));assert.equal(ratings.evaluations.get(bad.before).pv[0],'f3d4');
});

test('missed mate separates a missed win from a missed opportunity while still winning',()=>{
 const played=play('7k/8/5KQ1/8/8/8/8/8 w - - 0 1','g6f5');
 const before=info(1,['g6g7'],{type:'mate'});
 assert.equal(classifyMove(played,before,info(0,['h8g8'])).kind,'missedWin');
 assert.equal(classifyMove(played,before,info(-500,['h8g8'])).kind,'miss');
});

test('inconsistent evaluations do not label the previously recommended move a blunder',()=>{
 const best=play(fen,'f3d4');
 assert.equal(classifyMove(best,info(0,['f3d4']),info(300,['c6d5'])),null);
});
