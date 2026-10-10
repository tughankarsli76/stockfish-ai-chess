import test from 'node:test';
import assert from 'node:assert/strict';
import {Chess} from '../dist/vendor/chess.js';
import {bookMoves,chooseBookMove,ELITE_BOOK_INFO} from '../dist/features.js';
import {ELITE_BOOK} from '../dist/elite-book-data.js';

test('large book covers distinct openings with legal weighted replies',()=>{
 for(const line of ['e4 Nf6','e4 d5 exd5','e4 d6 d4 Nf6 Nc3 g6','d4 f5','e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7']){
  const game=new Chess();for(const san of line.split(' '))game.move(san);
  const moves=bookMoves(game);assert.ok(moves.length>0,line);
  for(const m of moves){const copy=new Chess(game.fen());assert.ok(copy.move({from:m.uci.slice(0,2),to:m.uci.slice(2,4),promotion:m.uci[4]}));assert.ok(Number.isInteger(m.weight)&&m.weight>0);}
  for(const random of [0,0.5,0.999999])assert.ok(moves.some(m=>m.uci===chooseBookMove(game,()=>random).uci));
 }
 assert.ok(ELITE_BOOK_INFO.positions>50000);
});

test('expanded filtered book has consistent counts and legal replies across its range',()=>{
 const positions=Object.entries(ELITE_BOOK);
 assert.ok(positions.length>100000);
 assert.equal(positions.length,ELITE_BOOK_INFO.positions);
 assert.equal(positions.reduce((sum,[,moves])=>sum+moves.length,0),ELITE_BOOK_INFO.moves);
 assert.ok(ELITE_BOOK_INFO.games>3000000);
 assert.equal(ELITE_BOOK_INFO.downloads.length,11);
 for(const [fen,entries] of positions){
  assert.equal(new Set(entries.map(([uci])=>uci)).size,entries.length,fen);
  assert.ok(entries.every(([,count])=>Number.isInteger(count)&&count>=8),fen);
  if(fen.split(' ')[3]!=='-')assert.equal(new Chess(fen+' 0 1').fen().split(' ').slice(0,4).join(' '),fen);
 }
 for(let i=0;i<positions.length;i+=Math.max(1,Math.floor(positions.length/500))){
  const [fen,entries]=positions[i],game=new Chess(fen+' 0 1');
  const legal=new Set(game.moves({verbose:true}).map(m=>m.from+m.to+(m.promotion||'')));
  for(const [uci,count] of entries){assert.ok(legal.has(uci),fen+' '+uci);assert.ok(count>=8);}
 }
});

test('weak opening pawn moves cannot return through high book variety',()=>{
 for(const [line,excluded] of [['',['f2f3','g2g4']],['e4',['f7f6','g7g5']]]){
  const game=new Chess();if(line)game.move(line);
  const moves=bookMoves(game);assert.ok(moves.length>=2);
  assert.ok(moves.every(m=>!excluded.includes(m.uci)));
  for(const variety of ['low','medium','high'])for(let i=0;i<=100;i++){
   const chosen=chooseBookMove(game,()=>i/101,variety);
   assert.ok(chosen&&!excluded.includes(chosen.uci));
  }
 }
});

test('transpositions and FEN imports share the same book recommendations',()=>{
 const positions=['d4 Nf6 c4 e6 Nf3 d5','d4 d5 c4 e6 Nf3 Nf6'].map(line=>{const game=new Chess();for(const san of line.split(' '))game.move(san);return game;});
 const moves=bookMoves(positions[0]);assert.ok(moves.length>0);
 assert.deepEqual(bookMoves(positions[1]),moves);
 assert.deepEqual(bookMoves(new Chess(positions[0].fen())),moves);
});
