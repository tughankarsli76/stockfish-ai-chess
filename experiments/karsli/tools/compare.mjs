// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {Chess,UciEngine,binaryHash,experimentRoot,gameOutcome,installSignalCleanup,parseArguments,playUci} from './uci.mjs';

const openings=[
 ['Open game',['e4','e5','Nf3','Nc6','Bc4','Bc5','c3','Nf6']],
 ['Queen pawn',['d4','d5','c4','e6','Nc3','Nf6','Bg5','Be7']],
 ['Sicilian',['e4','c5','Nf3','d6','d4','cxd4','Nxd4','Nf6','Nc3','a6']],
 ['Indian',['d4','Nf6','c4','g6','Nc3','Bg7','e4','d6','Nf3','O-O']],
 ['French',['e4','e6','d4','d5','Nc3','Nf6','Bg5','Be7']],
 ['English',['c4','e5','Nc3','Nf6','g3','d5','cxd5','Nxd5','Bg2','Nb6']],
 ['Caro-Kann',['e4','c6','d4','d5','Nc3','dxe4','Nxe4','Bf5']],
 ['Reti',['Nf3','d5','g3','Nf6','Bg2','e6','O-O','Be7','d3','O-O']]
].map(([name,san])=>{const b=new Chess();return {name,san,moves:san.map(s=>{const m=b.move(s);return m.from+m.to+(m.promotion??'');}),fen:b.fen()};});

const args=parseArguments(process.argv.slice(2),{candidate:resolve(experimentRoot,'build/karsli-first10'),reference:resolve(experimentRoot,'build/stockfish-19'),profile:resolve(experimentRoot,'reports/first10-blend/combined-profile.json'),'reference-profile':'',reports:resolve(experimentRoot,'reports/first10-blend'),'report-name':'combined-vs-stockfish',pairs:8,cycles:2,threads:1,hash:64,clock:5000,increment:50,movetime:0,'max-plies':500},{pairs:{min:1,max:8},cycles:{min:1,max:16},threads:{min:1,max:4},hash:{min:16,max:1024},clock:{min:1,max:60000},increment:{min:0,max:1000},movetime:{min:0,max:1000},'max-plies':{min:50,max:1000}});
assert(/^[\w.-]+$/.test(args['report-name']));
const candidateProfile=JSON.parse(await readFile(args.profile,'utf8'));
const referenceProfile=args['reference-profile']?JSON.parse(await readFile(args['reference-profile'],'utf8')):{};
const common={Threads:args.threads,Hash:args.hash,MultiPV:1,Ponder:false,UCI_LimitStrength:false,'Skill Level':20,'Move Overhead':20};
const report={createdAt:new Date().toISOString(),purpose:'Paired exploratory comparison; statistical strength remains unproven',settings:common,profiles:{candidate:candidateProfile,reference:referenceProfile},clockMs:args.clock,incrementMs:args.increment,movetimeMs:args.movetime,maxPlies:args['max-plies'],openingPairs:args.pairs,cycles:args.cycles,scheduledGames:args.pairs*args.cycles*2,games:[],passed:false};
const dir=resolve(args.reports);await mkdir(dir,{recursive:true});const jsonPath=resolve(dir,args['report-name']+'.json'),pgnPath=resolve(dir,args['report-name']+'.pgn');
const engines=[],pgn=[];const started=performance.now();installSignalCleanup();
async function save(){
 report.elapsedMs=Math.round(performance.now()-started);
 report.summary={completed:0,truncated:0,candidateWins:0,referenceWins:0,draws:0,timeForfeits:0};
 for(const g of report.games){if(g.result==='*'){report.summary.truncated++;continue;}report.summary.completed++;if(g.result==='1/2-1/2')report.summary.draws++;else report.summary[g.result===(g.candidateColor==='white'?'1-0':'0-1')?'candidateWins':'referenceWins']++;if(g.reason==='time forfeit')report.summary.timeForfeits++;}
 await writeFile(jsonPath,JSON.stringify(report,null,2)+'\n');await writeFile(pgnPath,pgn.join('\n\n')+'\n');
}
async function initialize(engine,profile){
 const identity=await engine.initialize(common);
 for(const name of Object.keys(profile))assert(identity.options.some(l=>l.startsWith('option name '+name+' ')),'Unsupported profile option: '+name);
 await engine.configure(profile);return identity;
}
try{
 report.binaries={candidate:{path:resolve(args.candidate),sha256:await binaryHash(args.candidate)},reference:{path:resolve(args.reference),sha256:await binaryHash(args.reference)}};
 const candidate=new UciEngine(args.candidate),reference=new UciEngine(args.reference);engines.push(candidate,reference);
 report.identities={candidate:await initialize(candidate,candidateProfile),reference:await initialize(reference,referenceProfile)};
 for(let cycle=0;cycle<args.cycles;cycle++)for(let pair=0;pair<args.pairs;pair++)for(let color=0;color<2;color++){
  const candidateWhite=color===0,white=candidateWhite?candidate:reference,black=candidateWhite?reference:candidate;
  await candidate.newGame();await reference.newGame();
  const game=new Chess(),opening=openings[pair],moves=[];
  for(const m of opening.moves){playUci(game,m);moves.push(m);}
  const clocks={w:args.clock,b:args.clock},timings=[];let outcome=gameOutcome(game),nodes=0;const gameStarted=performance.now();
  while(!outcome&&moves.length<args['max-plies']){
   const side=game.turn(),engine=side==='w'?white:black;
   const go=args.movetime?'go movetime '+args.movetime:`go wtime ${Math.max(1,Math.floor(clocks.w))} btime ${Math.max(1,Math.floor(clocks.b))} winc ${args.increment} binc ${args.increment}`;
   const t=performance.now();const result=await engine.search('position startpos moves '+moves.join(' '),go,{timeoutMs:Math.max(10000,clocks[side]+5000)});const spent=performance.now()-t;
   timings.push({side,spentMs:Math.round(spent*1000)/1000,remainingBeforeMs:Math.round(clocks[side]*1000)/1000,bestmove:result.bestmove});
   if(!args.movetime){clocks[side]-=spent;if(clocks[side]<=0){outcome={result:side==='w'?'0-1':'1-0',reason:'time forfeit'};break;}clocks[side]+=args.increment;}
   playUci(game,result.bestmove);moves.push(result.bestmove);
   const nodeLines=result.lines.map(l=>l.match(/\bnodes\s+(\d+)/)).filter(Boolean);if(nodeLines.length)nodes+=Number(nodeLines.at(-1)[1]);
   outcome=gameOutcome(game);
  }
  const result=outcome?.result??'*',reason=outcome?.reason??'ply-limit truncation',number=report.games.length+1;
  game.setHeader('Event','Karsli paired exploratory comparison');game.setHeader('Site','Local Mac');game.setHeader('Date',report.createdAt.slice(0,10).replaceAll('-','.'));game.setHeader('Round',String(number));
  game.setHeader('White',(candidateWhite?'Candidate: ':'Reference: ')+white.identity);game.setHeader('Black',(candidateWhite?'Reference: ':'Candidate: ')+black.identity);game.setHeader('Result',result);game.setHeader('Termination',reason);game.setHeader('Opening',opening.name);game.setHeader('OpeningPair',String(pair+1));game.setHeader('Cycle',String(cycle+1));game.setHeader('TimeControl',args.movetime?'-':`${args.clock/1000}+${args.increment/1000}`);game.setHeader('CandidateProfileSHA256',await binaryHash(args.profile));
  report.games.push({number,cycle:cycle+1,pair:pair+1,pairCycle:`${cycle+1}:${pair+1}`,candidateColor:candidateWhite?'white':'black',opening:opening.name,openingSan:opening.san,result,reason,plies:moves.length,nodes,elapsedMs:Math.round(performance.now()-gameStarted),finalFen:game.fen(),clocks,timings,moves});pgn.push(game.pgn({maxWidth:80}));await save();
  console.log(`Game ${number}/${report.scheduledGames}: ${result}, ${reason}, ${moves.length} plies; candidate ${report.summary.candidateWins}W ${report.summary.referenceWins}L ${report.summary.draws}D`);
 }
 report.passed=report.games.length===report.scheduledGames&&report.games.every(g=>g.result!=='*');
 if(!report.passed)process.exitCode=1;
}catch(error){report.error=error.stack;process.exitCode=1;console.error(error.stack);}
finally{report.cleanup=await Promise.all(engines.map(e=>e.close()));for(const e of engines)if(e.process.exitCode!==0||e.stderr){report.passed=false;report.runtimeError=e.stderr||'Nonzero engine exit';process.exitCode=1;}await save();console.log(JSON.stringify(report.summary));}
