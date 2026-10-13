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
test('completed games support every opponent mode and coach setting',()=>{
 const session=ended();
 for(const opponent of ['local','computer','match'])for(const chessCoach of [true,false])for(const tab of ['game','analysis','graph']){
  const state={session,settings:{opponent,chessCoach},tab};assert.equal(canShowGameReview(state),true);assert.equal(canShowGameReview(state,{automatic:true}),true);
 }
 for(const patch of [{suspended:true},{inactive:true},{celebrating:true}])assert.equal(canShowGameReview({session,...patch}),false);
 session.navigate(1);assert.equal(canShowGameReview({session}),true);assert.equal(canShowGameReview({session},{automatic:true}),false);
});
test('setup games and tournaments can be opened manually but never interrupt automatically',()=>{
 const session=ended();let state={session,engineMatch:{tournamentId:'cup'}};
 assert.equal(canShowGameReview(state),true);assert.equal(canShowGameReview(state,{automatic:true}),false);
 state={session};session.game.setHeader('PositionSetup','1');assert.equal(canShowGameReview(state),true);assert.equal(canShowGameReview(state,{automatic:true}),false);
 const fenSession=new GameSession();fenSession.load('8/8/8/8/8/2k5/8/K7 w - - 0 1');assert.equal(canShowGameReview({session:fenSession},{automatic:true}),false);
});
test('historical results are reviewable even when final position is not mate',()=>{
 const session=new GameSession();session.load('[Result "1-0"]\n\n1. e4 e5 1-0');
 assert.equal(canShowGameReview({session}),true);assert.equal(canShowGameReview({session},{automatic:true}),true);
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

test('setup origin survives saving and loading the game',()=>{
 const session=ended();session.game.setHeader('PositionSetup','1');const restored=new GameSession();restored.load(session.game.pgn());
 assert.equal(restored.length,4);assert.equal(canShowGameReview({session:restored}),true);assert.equal(canShowGameReview({session:restored},{automatic:true}),false);
});
