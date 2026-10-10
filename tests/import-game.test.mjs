import test from 'node:test';
import assert from 'node:assert/strict';
import {readGameFile} from '../dist/import-game.js';
import {GameSession} from '../dist/model.js';
test('PGN and FEN files load through the existing atomic importer',async()=>{
 const game=new GameSession();
 const pgn=await readGameFile(new File(['\uFEFF[White "Alice"]\n[Black "Bob"]\n\n1. e4 e5 2. Nf3 *'],'game.pgn'));
 game.load(pgn);assert.equal(game.length,3);assert.equal(game.game.getHeaders().White,'Alice');
 const fen=game.game.fen();game.load(await readGameFile(new File([fen],'position.fen')));assert.equal(game.game.fen(),fen);
 const before=game.game.fen();assert.throws(()=>game.load('not a game'));assert.equal(game.game.fen(),before);
});
test('empty and oversized files fail before the current game can change',async()=>{
 await assert.rejects(()=>readGameFile(new File(['   '],'empty.pgn')),/empty/);
 await assert.rejects(()=>readGameFile({size:250001,text:()=>{throw Error('Must not read');}}),/250 KB/);
 await assert.rejects(()=>readGameFile(null),/Choose/);
});
