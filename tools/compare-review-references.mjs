import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {GameSession} from '../dist/model.js';
import {MoveRatings} from '../dist/move-ratings.js';
import {gameAccuracy,estimatedGameRating} from '../dist/accuracy.js';

// Use saved raw engine evidence, rather than frozen scores or screenshot counts,
// so changes to the actual app formulas are visible on both training and holdout games.
export function compareReferences(fixtures,evidence){
 return fixtures.samples.map(sample=>{
  const run=evidence.runs.find(run=>run.sampleIds.includes(sample.id));
  if(!run)throw new Error(`Missing engine evidence for ${sample.id}`);
  const session=new GameSession();session.load(sample.pgn);
  const ratings=new MoveRatings();
  for(const move of session.moves)for(const fen of [move.before,move.after]){
   if(!run.positions[fen])throw new Error(`Missing position evidence for ${sample.id}: ${fen}`);
   ratings.record(fen,run.positions[fen]);
  }
  const accuracy=gameAccuracy(session.moves,move=>ratings.accuracy(move));
  const sides={};
  for(const [color,side] of [['w','white'],['b','black']]){
   const current=accuracy[color];
   if(current.analyzed!==current.total||current.accuracy===null||current.averageCentipawnLoss===null)throw new Error(`Incomplete review evidence for ${sample.id} ${side}`);
   const counts=Object.fromEntries(Object.keys(sample.referenceReview.counts[side]).map(kind=>[kind,0]));
   let unclassified=0;
   for(const move of session.moves.filter(move=>move.color===color)){
    let kind=ratings.get(move)?.kind;
    if(kind==='forced')kind='best';
    if(kind==='missedWin')kind='miss';
    if(Object.hasOwn(counts,kind))counts[kind]++;else unclassified++;
   }
   const gameRating=estimatedGameRating(current.averageCentipawnLoss);
   const reference={accuracy:sample.referenceReview.accuracy[side],gameRating:sample.reference[side],counts:sample.referenceReview.counts[side]};
   sides[side]={totalMoves:current.total,analyzed:current.analyzed,accuracy:current.accuracy,averageCentipawnLoss:current.averageCentipawnLoss,gameRating,counts,unclassified,reference,error:{accuracy:current.accuracy-reference.accuracy,gameRating:gameRating-reference.gameRating}};
  }
  return {id:sample.id,calibrationRole:sample.calibrationRole,completeResult:sample.completeResult,...sides};
 });
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const fixtures=JSON.parse(readFileSync(new URL('../tests/fixtures/game-rating-references.json',import.meta.url),'utf8'));
 const evidence=JSON.parse(readFileSync(new URL('../tests/fixtures/game-rating-evaluations.json',import.meta.url),'utf8'));
 const samples=compareReferences(fixtures,evidence);
 const report={notes:'Offline evidence, not an iPhone validation run. The original two games trained the rating curve; the third is held out. Complete supplied move sequences have been analyzed, but final results and player ratings are unknown.',analysis:evidence.analysis,samples};
 if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');
 console.table(samples.flatMap(sample=>['white','black'].map(side=>({sample:sample.id,role:sample.calibrationRole,side,moves:sample[side].totalMoves,accuracy:sample[side].accuracy.toFixed(1),referenceAccuracy:sample[side].reference.accuracy,gameRating:sample[side].gameRating,referenceGameRating:sample[side].reference.gameRating,ratingError:sample[side].error.gameRating}))));
}
