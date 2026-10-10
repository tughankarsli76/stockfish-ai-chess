import test from 'node:test';
import assert from 'node:assert/strict';
import {Chess} from '../dist/vendor/chess.js';
import {DEFAULT_SETTINGS,shouldThinkDuringTurn,bookMoves,chooseBookMove,whiteWdl,draftFromGame,positionFromDraft,notation,safeAppLink} from '../dist/features.js';
test('opening book returns legal alternatives and is absent outside its lines',()=>{const b=new Chess();assert.ok(bookMoves(b).length>=3);const chosen=chooseBookMove(b,()=>0);assert.ok(b.move({from:chosen.uci.slice(0,2),to:chosen.uci.slice(2,4)}));assert.deepEqual(bookMoves(new Chess('7k/8/8/8/8/8/R7/K7 w - - 0 50')),[]);});
test('WDL percentages keep White perspective and sum to 100',()=>{assert.deepEqual(whiteWdl([155,701,144],'w'),[16,70,14]);assert.deepEqual(whiteWdl([155,701,144],'b'),[14,70,16]);assert.equal(whiteWdl([1,2,3],'w'),null);});
test('position editor round-trips a valid board',()=>{const b=new Chess();assert.equal(positionFromDraft(draftFromGame(b)),b.fen());});
test('position editor rejects adjacent kings and impossible castling',()=>{const d={squares:{e1:'K',e2:'k'},turn:'w',castling:[],enPassant:'-',halfmove:0,fullmove:1};assert.throws(()=>positionFromDraft(d),/next to/);d.squares={e1:'K',e8:'k'};d.castling=['K'];assert.throws(()=>positionFromDraft(d),/Castling/);});
test('figurines and configured links preserve meaning without executable URLs',()=>{assert.equal(notation('1. Nf3 d5 2. Bb5+',true),'1. ♞f3 d5 2. ♝b5+');assert.equal(notation('Nf3',false),'Nf3');assert.throws(()=>safeAppLink('javascript:alert(1)'));assert.equal(safeAppLink('https://example.com'),'https://example.com/');});


test('book variety changes move frequency while Medium preserves existing weights',()=>{
  const game=new Chess(),moves=bookMoves(game),top=moves[0].uci,total=moves.reduce((sum,m)=>sum+m.weight,0);
  const count=variety=>Array.from({length:1000},(_,i)=>chooseBookMove(game,()=>(i+.5)/1000,variety)).filter(move=>move.uci===top).length;
  const medium=count('medium');assert.ok(Math.abs(medium/1000-moves[0].weight/total)<.002);
  assert.ok(count('low')>medium);assert.ok(count('high')<medium);
  for(const variety of ['low','medium','high','invalid']){
    for(const random of [0,.2,.5,.9,.999999])assert.ok(moves.includes(chooseBookMove(game,()=>random,variety)));
    assert.equal(chooseBookMove(new Chess('7k/8/8/8/8/8/R7/K7 w - - 0 50'),()=>0,variety),null);
  }
  assert.equal(count('invalid'),medium);
});


test('Permanent Brain defaults off and runs only on the human turn of a live computer game',()=>{
  const game=new Chess(),settings={...DEFAULT_SETTINGS,permanentBrain:true,side:'w'};
  assert.equal(DEFAULT_SETTINGS.permanentBrain,false);
  assert.equal(shouldThinkDuringTurn(DEFAULT_SETTINGS,game),false);
  assert.equal(shouldThinkDuringTurn(settings,game),true);
  assert.equal(shouldThinkDuringTurn(settings,game,{tab:'analysis'}),false);
  assert.equal(shouldThinkDuringTurn(settings,game,{live:false}),false);
  assert.equal(shouldThinkDuringTurn({...settings,opponent:'local'},game),false);
  game.move('e4');assert.equal(shouldThinkDuringTurn(settings,game),false);
  assert.equal(shouldThinkDuringTurn({...settings,side:'b'},game),true);
  const mate=new Chess('7k/6Q1/5K2/8/8/8/8/8 b - - 0 1');
  assert.equal(shouldThinkDuringTurn({...settings,side:'b'},mate),false);
});
