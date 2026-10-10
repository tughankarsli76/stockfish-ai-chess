import test from 'node:test';
import assert from 'node:assert/strict';
import {Chess} from '../dist/vendor/chess.js';
import {saveDefaults,prepareSavedGame} from '../dist/save-game.js';

test('save defaults use current players and date, preserving imported headers',()=>{
 const game=new Chess(),players={white:'Matrix76',black:'Stockfish 19'};
 const values=saveDefaults(game,players,new Date(2026,8,14));
 assert.equal(values.White,'Matrix76');assert.equal(values.Black,'Stockfish 19');assert.equal(values.Date,'2026.09.14');assert.equal(values['File Name'],'My Games.pgn');
 game.setHeader('White','Imported White');game.setHeader('Event','Club Night');game.setHeader('Date','2025.12.02');
 const imported=saveDefaults(game,players);assert.equal(imported.White,'Imported White');assert.equal(imported.Event,'Club Night');assert.equal(imported.Date,'2025.12.02');
});
test('saved metadata and result round trip without changing the ongoing game',()=>{
 const game=new Chess();for(const san of ['e4','e5','Nf3'])game.move(san);
 const original=game.pgn(),values={...saveDefaults(game,{white:'Alice',black:'Bob'}),Event:'Club Championship',Site:'New York',Round:'3',Result:'1/2-1/2','File Name':'Club games'};
 const saved=prepareSavedGame(original,values),copy=new Chess();copy.loadPgn(saved.pgn);
 assert.equal(saved.fileName,'Club games.pgn');assert.equal(saved.moves,3);assert.equal(copy.getHeaders().Event,values.Event);assert.equal(copy.getHeaders().Result,'1/2-1/2');assert.match(saved.pgn,/1\/2-1\/2$/);assert.deepEqual(copy.history(),game.history());assert.equal(game.pgn(),original);
});
test('saved custom positions preserve FEN and reject malformed metadata and paths',()=>{
 const game=new Chess('7k/8/8/8/8/8/R7/K7 w - - 0 50'),values=saveDefaults(game,{white:'Alice',black:'Bob'});
 const saved=prepareSavedGame(game.pgn(),values),copy=new Chess();copy.loadPgn(saved.pgn);assert.equal(copy.fen(),game.fen());
 for(const file of ['../game.pgn','CON.pgn','bad/name',''])assert.throws(()=>prepareSavedGame(game.pgn(),{...values,'File Name':file}),/file name/);
 assert.throws(()=>prepareSavedGame(game.pgn(),{...values,Event:'Injected\n[Tag "x"]'}),/single line/);
 assert.throws(()=>prepareSavedGame(game.pgn(),{...values,Date:'yesterday'}),/date/);
 assert.throws(()=>prepareSavedGame(game.pgn(),{...values,Result:'win'}),/result/);
});
