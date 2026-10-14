import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {Chess,playUci,gameOutcome,binaryHash} from '../../tools/uci.mjs';
const root='experiments/karsli/candidates/caissa-node-cache/';
const report=JSON.parse(await readFile(root+'cache-ablation.json','utf8'));
assert(report.passed);assert.equal(report.games.length,16);assert(report.cleanup.every(e=>e.code===0));
assert.equal(report.binaries.candidate.sha256,await binaryHash(report.binaries.candidate.path));assert.equal(report.binaries.reference.sha256,report.binaries.candidate.sha256);
const on=JSON.parse(await readFile(root+'profile-on.json','utf8')),off=JSON.parse(await readFile(root+'profile-off.json','utf8'));
assert.deepEqual(report.profiles.candidate,on);assert.deepEqual(report.profiles.reference,off);
assert.deepEqual({...on,'Karsli Caissa Node Cache Weight':0},off);
const profileHash=createHash('sha256').update(await readFile(root+'profile-on.json')).digest('hex');
const pgns=(await readFile(root+'cache-ablation.pgn','utf8')).trim().split(/\n+(?=\[Event )/);assert.equal(pgns.length,16);
let plies=0;const pairs=new Map();
for(const [i,g] of report.games.entries()){
 const chess=new Chess();for(const m of g.moves)playUci(chess,m);assert.equal(chess.fen(),g.finalFen);assert.equal(chess.history().length,g.plies);assert.deepEqual(gameOutcome(chess),{result:g.result,reason:g.reason});
 const tag=pgns[i].match(/^\[CandidateProfileSHA256 "([a-f0-9]{64})"\]$/m);assert(tag);assert.equal(tag[1],profileHash);
 const replay=new Chess();replay.loadPgn(pgns[i].replace('[CandidateProfileSHA256 "','[CandidateProfileHash "'));assert.equal(replay.fen(),g.finalFen);assert.deepEqual(replay.history(),chess.history());assert.equal(replay.getHeaders().Result,g.result);
 const clocks={w:5000,b:5000};assert.equal(g.timings.length,g.moves.length-g.openingSan.length);
 for(const [j,t] of g.timings.entries()){assert.equal(t.bestmove,g.moves[g.openingSan.length+j]);assert(Math.abs(clocks[t.side]-t.remainingBeforeMs)<0.002);assert(t.spentMs>=0);clocks[t.side]=t.remainingBeforeMs-t.spentMs+50;assert(clocks[t.side]>50);}
 if(!pairs.has(g.pairCycle))pairs.set(g.pairCycle,[]);pairs.get(g.pairCycle).push(g);plies+=g.plies;
}
assert.equal(pairs.size,8);for(const games of pairs.values()){assert.equal(games.length,2);assert.deepEqual(new Set(games.map(g=>g.candidateColor)),new Set(['white','black']));assert.deepEqual(games[0].openingSan,games[1].openingSan);}
const audit={passed:true,createdAt:new Date().toISOString(),games:16,pairedOpenings:8,legalPliesReplayed:plies,onlyProfileDifference:'Karsli Caissa Node Cache Weight',profileHash,binaryHash:report.binaries.candidate.sha256,summary:report.summary,strengthProven:false};
await writeFile(root+'game-audit.json',JSON.stringify(audit,null,2)+'\n');console.log(JSON.stringify(audit));
