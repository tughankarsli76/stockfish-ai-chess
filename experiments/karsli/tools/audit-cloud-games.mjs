import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {Chess,playUci,gameOutcome,binaryHash} from './uci.mjs';
const path=process.argv[2];assert(path?.endsWith('.json'),'Pass the comparison JSON path');
const report=JSON.parse(await readFile(path,'utf8'));
assert(report.passed);assert.equal(report.games.length,report.scheduledGames);
assert(report.cleanup.every(e=>e.code===0));assert.equal(report.summary.timeForfeits,0);
assert.equal(report.summary.truncated,0);assert.equal(report.movetimeMs,0);
const hash=await binaryHash(report.binaries.candidate.path);
assert.equal(hash,report.binaries.candidate.sha256);assert.equal(hash,report.binaries.reference.sha256);
assert.equal(hash,await binaryHash(report.binaries.reference.path));
const on=report.profiles.candidate,off=report.profiles.reference;
assert.deepEqual(Object.keys(on).sort(),Object.keys(off).sort());
const differences=Object.keys(on).filter(k=>on[k]!==off[k]);assert.equal(differences.length,1);
assert.equal(off[differences[0]],0);
const candidate=path.includes('pz-threat-correction')?'pz-threat-correction':'tarnished-interactions';
const recordedOn=await readFile(`experiments/karsli/candidates/${candidate}/profile-on.json`);
assert.deepEqual(on,JSON.parse(recordedOn));
assert.deepEqual(off,JSON.parse(await readFile(`experiments/karsli/candidates/${candidate}/profile-off.json`,'utf8')));
const profileHash=createHash('sha256').update(recordedOn).digest('hex');
const pgns=(await readFile(path.replace(/\.json$/,'.pgn'),'utf8')).trim().split(/\n+(?=\[Event )/);
assert.equal(pgns.length,report.games.length);
const pairs=new Map();let plies=0;
for(const [i,g] of report.games.entries()){
 const chess=new Chess();for(const m of g.moves)playUci(chess,m);
 assert.equal(chess.fen(),g.finalFen);assert.equal(chess.history().length,g.plies);
 assert.deepEqual(gameOutcome(chess),{result:g.result,reason:g.reason});
 const tag=pgns[i].match(/^\[CandidateProfileSHA256 "([a-f0-9]{64})"\]$/m);assert(tag);assert.equal(tag[1],profileHash);
 const replay=new Chess();replay.loadPgn(pgns[i].replace('[CandidateProfileSHA256 "','[CandidateProfileHash "'));
 assert.equal(replay.fen(),g.finalFen);assert.deepEqual(replay.history(),chess.history());
 assert.equal(replay.getHeaders().Result,g.result);
 const clocks={w:report.clockMs,b:report.clockMs};
 assert.equal(g.timings.length,g.moves.length-g.openingSan.length);
 for(const [j,t] of g.timings.entries()){
  assert.equal(t.bestmove,g.moves[g.openingSan.length+j]);
  assert.equal(t.side,(g.openingSan.length+j)%2===0?'w':'b');
  assert(Math.abs(clocks[t.side]-t.remainingBeforeMs)<0.002);assert(t.spentMs>=0);
  assert(t.remainingBeforeMs-t.spentMs>0);clocks[t.side]=t.remainingBeforeMs-t.spentMs+report.incrementMs;
 }
 for(const side of ['w','b'])assert(Math.abs(clocks[side]-g.clocks[side])<0.01);
 if(!pairs.has(g.pairCycle))pairs.set(g.pairCycle,[]);pairs.get(g.pairCycle).push(g);plies+=g.plies;
}
assert.equal(pairs.size,report.openingPairs*report.cycles);
for(const games of pairs.values()){
 assert.equal(games.length,2);assert.deepEqual(new Set(games.map(g=>g.candidateColor)),new Set(['white','black']));
 assert.deepEqual(games[0].openingSan,games[1].openingSan);
}
const audit={passed:true,createdAt:new Date().toISOString(),games:report.games.length,
 pairedOpenings:pairs.size,legalPliesReplayed:plies,onlyProfileDifference:differences[0],
 profileHash,binaryHash:hash,summary:report.summary,strengthProven:false};
await writeFile(path.replace(/\.json$/,'-audit.json'),JSON.stringify(audit,null,2)+'\n');
console.log(JSON.stringify(audit));
