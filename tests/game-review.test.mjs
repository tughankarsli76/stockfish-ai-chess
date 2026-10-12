import test from 'node:test';
import assert from 'node:assert/strict';
import {GameSession} from '../dist/model.js';
import {gameReviewStats,canShowGameReview} from '../dist/game-review.js';
import {MoveRatings} from '../dist/move-ratings.js';
function ended(){const session=new GameSession();session.load('1. f3 e5 2. g4 Qh4#');return session;}
test('review counts each side separately and includes unclassified moves',()=>{
 const session=ended(),kinds=['mistake','best',null,'excellent'];
 const stats=gameReviewStats(session.moves,m=>{const kind=kinds[session.moves.indexOf(m)];return kind?{kind}:null;});
 assert.equal(stats.w.total,2);assert.equal(stats.b.total,2);
 assert.equal(stats.w.counts.mistake,1);assert.equal(stats.b.counts.best,1);assert.equal(stats.b.counts.excellent,1);
 assert.equal(stats.w.unrated,1);assert.equal(stats.b.unrated,0);
 for(const side of ['w','b'])assert.equal(Object.values(stats[side].counts).reduce((a,b)=>a+b,0)+stats[side].unrated,stats[side].total);
});
test('book and forced ratings contribute without fabricated accuracy or Elo',()=>{
 const session=new GameSession();session.move('e4');session.move('e5');const ratings=new MoveRatings();
 const stats=gameReviewStats(session.moves,m=>ratings.get(m));assert.equal(stats.w.counts.book,1);assert.equal(stats.b.counts.book,1);
 assert.equal(stats.w.unrated,0);assert.equal(Object.hasOwn(stats.w,'accuracy'),false);assert.equal(Object.hasOwn(stats.w,'elo'),false);
});
test('summary appears only for a finished live computer game with coach enabled',()=>{
 const session=ended(),state={session,settings:{chessCoach:true,opponent:'computer'},tab:'game'};
 assert.equal(canShowGameReview(state),true);
 for(const patch of [{settings:{chessCoach:false,opponent:'computer'}},{settings:{chessCoach:true,opponent:'match'}},{tab:'analysis'},{suspended:true},{inactive:true}])assert.equal(canShowGameReview({...state,...patch}),false);
 session.navigate(1);assert.equal(canShowGameReview(state),false);
});
test('draws and clock expiration are included, but unfinished games are not',()=>{
 const session=new GameSession(),state={session,settings:{chessCoach:true,opponent:'computer'},tab:'game'};
 assert.equal(canShowGameReview(state),false);assert.equal(canShowGameReview({...state,clockExpired:'w'}),true);
 session.load('8/8/8/8/8/2k5/8/K7 w - - 0 1');assert.equal(session.game.isDraw(),true);assert.equal(canShowGameReview(state),true);
});
test('reviewing or undoing does not count discarded future moves',()=>{
 const session=ended();session.takeBack();const stats=gameReviewStats(session.moves,()=>null);
 assert.equal(stats.w.total,2);assert.equal(stats.b.total,1);assert.equal(stats.w.unrated+stats.b.unrated,3);
});
