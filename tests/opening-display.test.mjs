import test from 'node:test';
import assert from 'node:assert/strict';
import {Chess} from '../dist/vendor/chess.js';
import {openingForPosition,bookSuggestions} from '../dist/features.js';

test('opening name uses the current position, including FEN imports',()=>{
 const game=new Chess();assert.equal(openingForPosition(game),null);
 game.move('d4');game.move('Nf6');
 assert.equal(openingForPosition(game).eco,'A45');
 assert.match(openingForPosition(game).name,/Indian/);
 assert.deepEqual(openingForPosition(new Chess(game.fen())),openingForPosition(game));
 const moves=bookSuggestions(game);
 assert.deepEqual(moves.slice(0,2).map(m=>m.san),['c4','Nf3']);
 assert.ok(moves.length>=2);
 assert.equal(moves.reduce((sum,m)=>sum+m.percentage,0),100);
 assert.match(moves[0].label,/^2\.c4 \(\d+%\)$/);
});

test('opening follows reviewed positions and book weights are not renormalized to the displayed subset',()=>{
 const game=new Chess();const previous=[];
 for(const san of ['e4','e5','Nf3','Nc6','Bb5']){previous.push(game.fen());game.move(san);}
 assert.match(openingForPosition(game).name,/Ruy Lopez/);
 assert.equal(openingForPosition(new Chess(previous[2])).eco,'C20');
 const start=bookSuggestions(new Chess());
 assert.equal(start.reduce((sum,m)=>sum+m.percentage,0),100);
 assert.ok(start.slice(0,2).reduce((sum,m)=>sum+m.percentage,0)<100);
 game.move('h5');assert.match(openingForPosition(game,[...previous,game.history({verbose:true}).at(-1).before]).name,/Ruy Lopez/);
});
