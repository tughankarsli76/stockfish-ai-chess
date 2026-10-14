import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {UciEngine,runBench,validateSearch,binaryHash,installSignalCleanup} from '../../tools/uci.mjs';
installSignalCleanup();
const here=resolve('experiments/karsli/candidates/tarnished-interactions'),candidate=resolve(process.env.KARSLI_TARNISHED_BINARY||resolve(here,'karsli-tarnished-interactions')),baseline=resolve(process.env.KARSLI_TARNISHED_BASELINE||'experiments/karsli/candidates/pz-threat-correction/karsli-pz-threat-correction');
const option='Karsli Tarnished Interaction LMR Weight',fen='r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1';
const settings={Threads:1,Hash:64,MultiPV:1,Ponder:false,UCI_LimitStrength:false,'Skill Level':20};
const report={createdAt:new Date().toISOString(),purpose:'Tarnished bounded pair/triple interaction LMR activation, compatibility and material checks; no Elo claim',checks:[],passed:false};
let engine;
async function check(name,fn){const started=performance.now();const evidence=await fn();report.checks.push({name,passed:true,elapsedMs:Math.round(performance.now()-started),evidence});console.log('PASS '+name);}
async function configure(extra={}){await engine.configure({...settings,[option]:128,'Karsli Tarnished Diagnostics':true,'Karsli Orange Diagnostics':true,'Karsli Reckless Pack':false,...extra});await engine.newGame();}
async function search(position,go,params){const x=await engine.search(`position fen ${position}`,go,params);return {...validateSearch(position,x),events:x.lines.filter(s=>s.startsWith('info string Karsli Tarnished '))};}
try{
 report.binaries={candidate:{path:candidate,sha256:await binaryHash(candidate)},baseline:{path:baseline,sha256:await binaryHash(baseline)}};
 await check('disabled interaction LMR preserves complete revision9 deterministic bench',async()=>{const a=await runBench(candidate,{checkBonus:0,depthSlope:0,alphaBonus:0,extraOptions:{[option]:0}});const b=await runBench(baseline,{checkBonus:0,depthSlope:0,alphaBonus:0});assert.equal(a.nodes,b.nodes);return {candidate:a,baseline:b};});
 engine=new UciEngine(candidate);
 await check('interaction LMR default off and ready',async()=>{const id=await engine.initialize(settings);assert(id.options.some(s=>s.startsWith(`option name ${option} type spin default 0`)));return id.name;});
 await check('active interaction LMR preserves legal move generation',async()=>{await configure();const n=await engine.perft(fen,3);assert.equal(n,97862);return n;});
 await check('pair/triple context changes positive LMR',async()=>{let hits=0;const evidence=[];for(const f of [fen,'r1bq1rk1/ppp2ppp/2n2n2/2b1p3/4P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 4 7']){await configure();const x=await search(f,'go depth 14');hits+=Number(x.events.join(' ').match(/interaction-use=(\d+)/)?.[1]||0);evidence.push(x);if(hits)break;}assert(hits>0);return {hits,evidence};});
 await check('interaction LMR off reports zero blocks',async()=>{await configure({[option]:0});const x=await search(fen,'go depth 10');assert(x.events.join(' ').includes('interaction-use=0'));return x;});
 await check('interaction LMR on with complete current14-option profile and MultiPV',async()=>{const profile=JSON.parse(await readFile('experiments/karsli/reports/full-orange/combined-profile.json','utf8'));await configure({...profile,'Karsli Berserk Threat NMP Guard':true,'Karsli Caissa Node Cache Weight':512,'Karsli Trium Disagreement RFP Weight':64,'Karsli PZ Threat Correction Weight':128,MultiPV:3});const x=await search(fen,'go depth 10');assert.deepEqual(x.ranks,[1,2,3]);return x;});
 await check('interaction LMR on four workers stop and reuse',async()=>{await configure({Threads:4});const stopped=await search(fen,'go infinite',{stopAfterMs:150,timeoutMs:4000});await configure();const reused=await search(fen,'go depth 8');return {stopped,reused};});
 await check('interaction LMR on free queen captures both colors',async()=>{const evidence=[];for(const [f,move] of [['7k/8/8/4q3/3P4/8/8/K7 w - - 0 1','d4e5'],['7k/8/8/3p4/4Q3/8/8/K7 b - - 0 1','d5e4']]){await configure();const x=await search(f,'go depth 9');assert.equal(x.bestmove,move);evidence.push(x);}return evidence;});
 await check('clean process exit',async()=>{await engine.close();assert.equal(engine.process.exitCode,0);assert.equal(engine.stderr,'');return true;});report.passed=true;
}catch(e){report.error=e.stack;process.exitCode=1;console.error(e.stack);}finally{if(engine)await engine.close();await writeFile(resolve(here,process.env.KARSLI_TARNISHED_REPORT||'validation.json'),JSON.stringify(report,null,2)+'\n');console.log(`${report.checks.length} checks completed; passed=${report.passed}`);}
