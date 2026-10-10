import test from 'node:test';
import assert from 'node:assert/strict';
import {Chess} from '../dist/vendor/chess.js';
import {validatePosition} from '../dist/position-safety.js';
import {GameSession} from '../dist/model.js';

test('reject impossible material without replacing the current game',()=>{
 const session=new GameSession(),before=session.game.fen();
 for(const fen of ['7k/8/8/8/8/RRRRRRR1/PPPPPPPP/K7 w - - 0 1','7k/8/8/8/BBBBBBBB/BB6/PPPPPPPP/K7 w - - 0 1']){
  assert.throws(()=>session.load(fen),/pieces|promoted/);
  assert.equal(session.game.fen(),before);
  assert.throws(()=>session.load('[SetUp "1"]\n[FEN "'+fen+'"]\n\n*'),/pieces|promoted/);
 }
});
test('allow plausible promoted material and normal positions',()=>{
 for(const fen of ['7k/8/8/8/8/RRRRRRR1/8/K7 w - - 0 1',new Chess().fen()])assert.doesNotThrow(()=>validatePosition(new Chess(fen)));
});
test('reject adjacent kings and check on the nonmoving king',()=>{
 assert.throws(()=>validatePosition(new Chess('8/8/8/8/8/8/1k6/K7 w - - 0 1')),/next/);
 assert.throws(()=>validatePosition(new Chess('7k/8/8/8/8/8/8/K6R w - - 0 1')),/check/);
});
