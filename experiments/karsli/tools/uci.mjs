import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Chess} from '../../../dist/vendor/chess.js';

export {Chess};
export const experimentRoot=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const defaults={candidate:resolve(experimentRoot,'build/karsli-alpha-raise'),baseline:resolve(experimentRoot,'build/stockfish-19')};
const activeChildren=new Set();

export function installSignalCleanup(){
  for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{
    const children=[...activeChildren];
    await Promise.all(children.map(child=>new Promise(resolve=>{
      if(child.exitCode!==null||child.signalCode!==null)return resolve();
      child.once('exit',resolve);child.once('error',resolve);child.kill('SIGKILL');
    })));
    process.exit(signal==='SIGINT'?130:143);
  });
}

export async function binaryHash(path){return createHash('sha256').update(await readFile(path)).digest('hex');}

export function parseArguments(argv,defaults,bounds={}){
  const result={...defaults};
  for(let index=0;index<argv.length;index++){
    const key=argv[index].replace(/^--/,'');
    if(argv[index]==='--help'){result.help=true;continue;}
    if(!argv[index].startsWith('--')||!(key in defaults))throw new Error(`Unknown argument ${argv[index]}`);
    const value=argv[++index];
    if(value===undefined||value.startsWith('--'))throw new Error(`Missing value for --${key}`);
    result[key]=typeof defaults[key]==='number'?Number(value):value;
    if(typeof defaults[key]==='number'){
      const {min=1,max=Number.MAX_SAFE_INTEGER}=bounds[key]??{};
      if(!Number.isSafeInteger(result[key])||result[key]<min||result[key]>max){
        const requirement=min===1&&max===Number.MAX_SAFE_INTEGER?'a positive integer':`an integer between ${min} and ${max}`;
        throw new Error(`--${key} must be ${requirement}`);
      }
    }
  }
  return result;
}

export class UciEngine{
  constructor(path){
    this.path=resolve(path);this.stderr='';this.waiter=null;this.fatal=null;this.closing=false;
    this.process=spawn(this.path,[],{cwd:dirname(this.path),stdio:['pipe','pipe','pipe']});
    activeChildren.add(this.process);
    this.exit=new Promise(resolve=>{this.resolveExit=resolve;});
    this.reader=createInterface({input:this.process.stdout});
    this.reader.on('line',line=>{
      if(!this.waiter)return;
      const waiter=this.waiter;waiter.lines.push(line);
      if(waiter.predicate(line)){this.waiter=null;clearTimeout(waiter.timer);waiter.resolve(waiter.lines);}
    });
    this.process.stderr.on('data',chunk=>{this.stderr=(this.stderr+chunk).slice(-12000);});
    this.process.on('error',error=>{activeChildren.delete(this.process);this.fail(error);this.resolveExit({error:error.message});});
    this.process.on('exit',(code,signal)=>{
      activeChildren.delete(this.process);
      if(!this.closing)this.fail(new Error(`${this.path} exited with ${code??signal}: ${this.stderr.slice(-1000)}`));
      this.resolveExit({code,signal});
    });
    this.process.stdin.on('error',error=>{if(!this.closing)this.fail(error);});
  }
  fail(error){
    this.fatal=error;
    if(this.waiter){const waiter=this.waiter;this.waiter=null;clearTimeout(waiter.timer);waiter.reject(error);}
  }
  send(command){
    if(this.fatal)throw this.fatal;
    if(command.includes('\n')||command.includes('\r'))throw new Error('UCI command must contain one line');
    if(this.process.exitCode!==null)throw new Error('Engine has exited');
    this.process.stdin.write(command+'\n');
  }
  until(command,predicate,timeoutMs=10000){
    if(this.waiter)throw new Error('Overlapping UCI operation');
    if(this.fatal)return Promise.reject(this.fatal);
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{
        this.waiter=null;
        const error=new Error(`Timed out after ${timeoutMs} ms waiting for ${command}: ${this.stderr.slice(-1000)}`);
        this.fatal=error;this.process.kill('SIGKILL');reject(error);
      },timeoutMs);
      this.waiter={predicate,timer,resolve,reject,lines:[]};
      try{this.send(command);}catch(error){this.fail(error);}
    });
  }
  async initialize(options={}){
    const lines=await this.until('uci',line=>line==='uciok');
    this.identity=lines.find(line=>line.startsWith('id name '))?.slice(8);
    this.options=lines.filter(line=>line.startsWith('option name '));
    await this.configure(options);
    return {name:this.identity,options:this.options};
  }
  async configure(options){
    for(const [name,value] of Object.entries(options))this.send(`setoption name ${name} value ${value}`);
    await this.ready();
  }
  ready(){return this.until('isready',line=>line==='readyok');}
  async newGame(){this.send('ucinewgame');await this.ready();}
  async search(position,go,{timeoutMs=10000,stopAfterMs=null}={}){
    this.send(position);
    const pending=this.until(go,line=>line.startsWith('bestmove '),timeoutMs);
    const stopper=stopAfterMs===null?null:setTimeout(()=>{try{this.send('stop');}catch{}},stopAfterMs);
    try{
      const lines=await pending;
      const bestmove=lines.at(-1).split(/\s+/)[1];
      return {bestmove,lines};
    }finally{if(stopper!==null)clearTimeout(stopper);}
  }
  async perft(fen,depth){
    this.send(`position fen ${fen}`);
    const lines=await this.until(`go perft ${depth}`,line=>/^Nodes searched:\s*\d+\s*$/.test(line),30000);
    return Number(lines.at(-1).match(/\d+/)[0]);
  }
  async close(){
    if(this.closing)return this.exit;
    this.closing=true;
    if(this.waiter)this.fail(new Error('Engine closed during pending operation'));
    try{this.process.stdin.write('stop\nquit\n');this.process.stdin.end();}catch{}
    const killer=setTimeout(()=>this.process.kill('SIGKILL'),3000);
    try{return await this.exit;}finally{clearTimeout(killer);this.reader.close();}
  }
}

export function playUci(game,move){
  if(!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(move))throw new Error(`Invalid UCI move ${move}`);
  return game.move({from:move.slice(0,2),to:move.slice(2,4),promotion:move[4]});
}

export function validateSearch(fen,result,{terminal=false}={}){
  const game=new Chess(fen);
  if(terminal){
    if(!game.isGameOver())throw new Error('Expected terminal validation position');
    if(!['(none)','0000'].includes(result.bestmove))throw new Error(`Terminal search returned ${result.bestmove}`);
  }else playUci(game,result.bestmove);
  let checkedPv=0;const ranks=new Set();
  for(const line of result.lines){
    const pv=line.match(/\bpv\s+(.+)$/);
    if(!pv)continue;
    const board=new Chess(fen);
    for(const move of pv[1].trim().split(/\s+/))playUci(board,move);
    checkedPv++;const rank=line.match(/\bmultipv\s+(\d+)/);if(rank)ranks.add(Number(rank[1]));
  }
  return {bestmove:result.bestmove,checkedPv,ranks:[...ranks].sort((a,b)=>a-b)};
}

export function gameOutcome(game){
  if(game.isCheckmate())return {result:game.turn()==='w'?'0-1':'1-0',reason:'checkmate'};
  if(game.isStalemate())return {result:'1/2-1/2',reason:'stalemate'};
  if(game.isInsufficientMaterial())return {result:'1/2-1/2',reason:'insufficient material'};
  if(game.isThreefoldRepetition())return {result:'1/2-1/2',reason:'threefold repetition'};
  if(game.isDrawByFiftyMoves())return {result:'1/2-1/2',reason:'fifty-move rule'};
  return null;
}

export async function runBench(path,{checkBonus=null,depthSlope=null,alphaBonus=null,extraOptions={},timeoutMs=60000}={}){
  const started=performance.now();let stdout='',stderr='',timedOut=false;
  const process=spawn(resolve(path),[],{cwd:dirname(resolve(path)),stdio:['pipe','pipe','pipe']});
  activeChildren.add(process);
  const result=new Promise((resolve,reject)=>{
    process.on('error',error=>{activeChildren.delete(process);reject(error);});
    process.on('exit',(code,signal)=>{activeChildren.delete(process);resolve({code,signal});});
  });
  process.stdout.on('data',chunk=>{stdout+=chunk;});process.stderr.on('data',chunk=>{stderr+=chunk;});
  process.stdin.on('error',()=>{});
  const killer=setTimeout(()=>{timedOut=true;process.kill('SIGKILL');},timeoutMs);
  const commands=[];
  if(checkBonus!==null)commands.push(`setoption name Karsli Check Bonus value ${checkBonus}`);
  if(depthSlope!==null)commands.push(`setoption name Karsli Depth Slope value ${depthSlope}`);
  if(alphaBonus!==null)commands.push(`setoption name Karsli Alpha Bonus value ${alphaBonus}`);
  for(const [name,value] of Object.entries(extraOptions)){
    if(/[\r\n]/.test(name+String(value)))throw new Error('Benchmark option must contain one line');
    commands.push(`setoption name ${name} value ${value}`);
  }
  process.stdin.end([...commands,'bench 16 1 8 default depth','quit',''].join('\n'));
  try{
    const exit=await result;
    if(timedOut||exit.code!==0)throw new Error(`Benchmark failed: ${timedOut?'timeout':exit.code??exit.signal}; ${stderr.slice(-1000)}`);
    const nodes=stderr.match(/Nodes searched\s*:\s*(\d+)/);
    if(!nodes)throw new Error('Benchmark did not report a node signature');
    const positions=[...stderr.matchAll(/Position:\s*(\d+)\/(\d+)/g)];
    return {nodes:Number(nodes[1]),positions:positions.length,elapsedMs:Math.round(performance.now()-started),command:'bench 16 1 8 default depth',checkBonus,depthSlope,alphaBonus,extraOptions};
  }finally{clearTimeout(killer);if(process.exitCode===null)process.kill('SIGKILL');}
}
