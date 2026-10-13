import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GameSession} from '../dist/model.js';
import {gameAccuracy,estimatedGameRating} from '../dist/accuracy.js';
const fixtures=JSON.parse(readFileSync(new URL('./fixtures/game-rating-references.json',import.meta.url),'utf8'));
test('transcribed reference games are legal and the provisional curve fits the measured four sides',()=>{
 for(const sample of fixtures.samples){
  const session=new GameSession();session.load(sample.pgn);assert.equal(session.length,sample.moveMetrics.length);
  const stats=gameAccuracy(session.moves,m=>sample.moveMetrics[session.moves.indexOf(m)]);
  for(const [color,side] of [['w','white'],['b','black']]){
   assert.equal(stats[color].analyzed,stats[color].total);
   assert.equal(estimatedGameRating(stats[color].averageCentipawnLoss),sample.reference[side]);
  }
 }
});
