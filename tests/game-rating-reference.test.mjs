import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GameSession} from '../dist/model.js';
import {gameAccuracy,estimatedGameRating} from '../dist/accuracy.js';
import {compareReferences} from '../tools/compare-review-references.mjs';
const fixtures=JSON.parse(readFileSync(new URL('./fixtures/game-rating-references.json',import.meta.url),'utf8'));
const evidence=JSON.parse(readFileSync(new URL('./fixtures/game-rating-evaluations.json',import.meta.url),'utf8'));
test('transcribed reference games are legal; only training games are expected to fit the provisional curve',()=>{
 for(const sample of fixtures.samples){
  const session=new GameSession();session.load(sample.pgn);assert.equal(session.length,sample.moveMetrics.length);
  const stats=gameAccuracy(session.moves,m=>sample.moveMetrics[session.moves.indexOf(m)]);
  for(const [color,side] of [['w','white'],['b','black']]){
   assert.equal(stats[color].analyzed,stats[color].total);
   if(sample.calibrationRole==='training')assert.equal(estimatedGameRating(stats[color].averageCentipawnLoss),sample.reference[side]);
  }
 }
});

test('raw engine evidence reproduces measured scores and exposes third-game prediction errors',()=>{
 const comparison=compareReferences(fixtures,evidence);
 assert.equal(comparison.length,3);
 for(const sample of comparison){
  const saved=fixtures.samples.find(item=>item.id===sample.id);
  for(const [color,side] of [['w','white'],['b','black']]){
   assert.equal(sample[side].accuracy,saved.measured[color].accuracy);
   assert.equal(sample[side].averageCentipawnLoss,saved.measured[color].averageCentipawnLoss);
   assert.equal(Object.values(sample[side].counts).reduce((sum,n)=>sum+n,0)+sample[side].unclassified,sample[side].totalMoves);
   assert.equal(sample[side].error.gameRating,sample[side].gameRating-saved.reference[side]);
  }
 }
 const holdout=comparison.find(sample=>sample.calibrationRole==='holdout');
 assert.equal(holdout.id,'user-reference-3');
 assert.equal(holdout.white.reference.gameRating,350);
 assert.equal(holdout.black.reference.gameRating,100);
 assert.equal(holdout.white.totalMoves,15);
 assert.equal(holdout.black.totalMoves,14);
});

test('a missing or shallow position cannot produce a misleading complete comparison',()=>{
 const missing=structuredClone(evidence);
 const run=missing.runs.find(run=>run.sampleIds.includes('user-reference-3'));
 delete run.positions[Object.keys(run.positions)[0]];
 assert.throws(()=>compareReferences(fixtures,missing),/Missing position evidence/);
 const shallow=structuredClone(evidence);
 const position=Object.values(shallow.runs.find(run=>run.sampleIds.includes('user-reference-3')).positions)[0];
 position.depth=1;
 assert.throws(()=>compareReferences(fixtures,shallow),/Incomplete review evidence/);
});

test('screenshot reference categories account for all moves on each side',()=>{
 for(const sample of fixtures.samples){
  const reference=sample.referenceReview;
  for(const side of ['white','black'])assert.equal(Object.values(reference.counts[side]).reduce((a,b)=>a+b,0),reference.totalMoves[side]);
 }
});
