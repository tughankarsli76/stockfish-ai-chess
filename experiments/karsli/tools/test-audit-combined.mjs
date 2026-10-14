// Negative controls for independent bundle audits; generated fixtures stay in build/.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {dirname,resolve} from 'node:path';
const reportPath=resolve(process.argv[2]||'experiments/karsli/build/cloud/combined-research.json');
const original=JSON.parse(await readFile(reportPath,'utf8'));
assert(original.passed,'Run the successful comparison and independent audit first');
const pgn=await readFile(reportPath.replace(/\.json$/,'.pgn'),'utf8');
const out=resolve(dirname(reportPath),'failures/audit-negative-controls');await mkdir(out,{recursive:true});
const cases=[
 ['extra-profile-change',r=>{r.profiles.reference['Karsli Check Bonus']=0;}],
 ['clock-overrun',r=>{const t=r.games[0].timings[0];t.spentMs=t.remainingBeforeMs+1;}],
 ['illegal-move',r=>{r.games[0].moves[r.games[0].openingSan.length]='a1a8';}],
 ['truncated-game',r=>{r.summary.truncated=1;}]
];
const evidence=[];
for(const [name,mutate] of cases){
 const data=structuredClone(original);mutate(data);
 const path=resolve(out,name+'.json');await writeFile(path,JSON.stringify(data));await writeFile(path.replace(/\.json$/,'.pgn'),pgn);
 const result=spawnSync(process.execPath,['experiments/karsli/tools/audit-combined-games.mjs',path],{encoding:'utf8'});
 assert.equal(result.error,undefined);assert.notEqual(result.status,0,'Auditor accepted '+name);
 await writeFile(resolve(out,name+'.log'),result.stdout+result.stderr);evidence.push({name,rejected:true,exitCode:result.status});
}
const report={passed:true,purpose:'Expected auditor rejections, not engine failures',checks:evidence};
await writeFile(resolve(dirname(reportPath),'audit-negative-controls.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
