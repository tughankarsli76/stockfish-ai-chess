import test from 'node:test';
import assert from 'node:assert/strict';
import {GameSession,gameStatus} from '../dist/model.js';
test('illegal moves leave game unchanged',()=>{const s=new GameSession(),fen=s.game.fen();assert.throws(()=>s.move({from:'e2',to:'e5'}));assert.equal(s.game.fen(),fen);assert.equal(s.cursor,0);});
test('castling moves king and rook',()=>{const s=new GameSession();s.load('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');s.move('O-O');assert.equal(s.game.get('g1').type,'k');assert.equal(s.game.get('f1').type,'r');});
test('en passant capture removes captured pawn',()=>{const s=new GameSession();for(const m of ['e4','a6','e5','d5','exd6'])s.move(m);assert.equal(s.game.get('d5'),undefined);assert.equal(s.game.get('d6').color,'w');});
test('underpromotion honors selected piece',()=>{const s=new GameSession();s.load('7k/P7/8/8/8/8/8/7K w - - 0 1');s.move({from:'a7',to:'a8',promotion:'n'});assert.equal(s.game.get('a8').type,'n');});
test('checkmate stops new moves and reports winner',()=>{const s=new GameSession();for(const m of ['f3','e5','g4','Qh4#'])s.move(m);assert.equal(gameStatus(s.game),'Checkmate — Black wins');assert.throws(()=>s.move('e4'));});
test('review does not discard future moves or permit accidental branching',()=>{const s=new GameSession();s.load('1. e4 e5 2. Nf3 Nc6');const fen=s.game.fen();s.navigate(1);assert.equal(s.position().turn(),'b');assert.throws(()=>s.move('c5'));assert.equal(s.length,4);s.navigate(4);assert.equal(s.game.fen(),fen);});
test('computer undo removes a pair and restores human turn',()=>{const s=new GameSession();s.move('e4');s.move('e5');s.undo(true,'w');assert.equal(s.length,0);assert.equal(s.game.turn(),'w');});
test('invalid import preserves existing game and PGN round trip retains moves',()=>{const s=new GameSession();s.move('d4');const fen=s.game.fen();assert.throws(()=>s.load('this is not a game'));assert.equal(s.game.fen(),fen);const copy=new GameSession();copy.load(s.game.pgn());assert.equal(copy.game.fen(),fen);assert.equal(copy.length,1);});
test('repetition history survives review navigation',()=>{const s=new GameSession();for(const m of ['Nf3','Nf6','Ng1','Ng8','Nf3','Nf6','Ng1','Ng8'])s.move(m);s.navigate(2);s.navigate(8);assert.equal(gameStatus(s.game),'Draw — threefold repetition');});

test('playing from review replaces only later moves and preserves the earlier history',()=>{
 const s=new GameSession();s.load('1. d4 d5 2. c4 c6 3. e3 Bf5');s.navigate(4);
 s.move({from:'g1',to:'f3'},{fromReview:true});
 assert.deepEqual(s.game.history(),['d4','d5','c4','c6','Nf3']);assert.equal(s.live,true);assert.equal(s.game.turn(),'b');
 s.move('Nf6');assert.equal(s.length,6);
});
test('invalid moves from review preserve the complete old line and review cursor',()=>{
 const s=new GameSession();s.load('1. d4 d5 2. c4 c6 3. e3 Bf5');const pgn=s.game.pgn();s.navigate(4);
 assert.throws(()=>s.move({from:'g1',to:'g5'},{fromReview:true}));
 assert.equal(s.game.pgn(),pgn);assert.equal(s.cursor,4);
});
test('review continuation preserves repetition history, headers, and special moves',()=>{
 const s=new GameSession();s.load('[White "Tester"]\n\n1. Nf3 Nf6 2. Ng1 Ng8 3. Nf3 Nf6 4. d4');s.navigate(6);
 s.move('Ng1',{fromReview:true});s.move('Ng8');assert.equal(s.game.isThreefoldRepetition(),true);assert.equal(s.game.getHeaders().White,'Tester');
 const castle=new GameSession();castle.load('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');castle.move('Kf1');castle.navigate(0);castle.move('O-O',{fromReview:true});assert.equal(castle.game.get('f1').type,'r');
 const promotion=new GameSession();promotion.load('7k/P7/8/8/8/8/8/7K w - - 0 1');promotion.move({from:'a7',to:'a8',promotion:'q'});promotion.navigate(0);promotion.move({from:'a7',to:'a8',promotion:'n'},{fromReview:true});assert.equal(promotion.game.get('a8').type,'n');
});
