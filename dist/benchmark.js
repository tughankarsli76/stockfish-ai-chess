import {StockfishEngine} from './engine.js';
import {NativeEngineTransport} from './native-engine.js';
export const BENCHMARK_FEN='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
export const BENCHMARK_REFERENCE_NPS=5000000;
export function benchmarkScore(nps){return Number.isFinite(nps)&&nps>0?Math.min(100,Math.round(nps/BENCHMARK_REFERENCE_NPS*10000)/100):0;}
export function installBenchmark(api){
 const dialog=document.createElement('dialog');dialog.id='benchmarkDialog';dialog.className='mode-screen';
 dialog.setAttribute('aria-labelledby','benchmarkTitle');
 dialog.innerHTML='<div class="mode-heading"><button id="benchmarkBack"><span aria-hidden="true" class="back-chevron"></span><span>Options</span></button><h2 id="benchmarkTitle">Stockfish Chess Benchmark</h2></div><div class="benchmark-content"><p id="benchmarkDevice"></p><div class="list benchmark-results"><p>Positions per second: <strong id="benchmarkNps">—</strong></p><p>Relative Speed: <strong id="benchmarkScore">—</strong></p></div><p id="benchmarkStatus" role="status">Ready</p><div id="benchmarkProgress" class="benchmark-score-track" role="progressbar" aria-label="Relative Speed" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuetext="Not measured"><span id="benchmarkProgressFill" class="benchmark-score-fill"></span></div><div class="benchmark-score-scale" aria-hidden="true"><span>0</span><span>100</span></div><button class="primary" id="benchmarkRun">Run Again</button></div>';
 document.body.append(dialog);
 const $=id=>document.getElementById(id);let engine=null,timeout=null,runId=0,started=false;
 function resetScore(){
  $('benchmarkNps').textContent='—';$('benchmarkScore').textContent='—';
  $('benchmarkProgress').setAttribute('aria-valuenow','0');$('benchmarkProgress').setAttribute('aria-valuetext','Not measured');$('benchmarkProgressFill').style.width='0%';
 }
 function showScore(nps){
  if(!Number.isFinite(nps)||nps<=0)return;
  const score=benchmarkScore(nps),display=score.toFixed(2);
  $('benchmarkNps').textContent=Math.round(nps).toLocaleString();$('benchmarkScore').textContent=display;
  $('benchmarkProgress').setAttribute('aria-valuenow',String(score));$('benchmarkProgress').setAttribute('aria-valuetext',display+' out of 100');$('benchmarkProgressFill').style.width=score+'%';
 }
 function stop(){runId++;clearTimeout(timeout);engine?.destroy();engine=null;$('benchmarkRun').disabled=false;$('benchmarkProgress').setAttribute('aria-busy','false');}
 function cancel(){if(!engine)return;stop();resetScore();$('benchmarkStatus').textContent='Benchmark interrupted. Tap Run Again to restart.';}
 function run(){
  stop();const id=runId;started=false;
  resetScore();$('benchmarkProgress').setAttribute('aria-busy','true');$('benchmarkRun').disabled=true;$('benchmarkStatus').textContent='Preparing Stockfish…';
  const threads=globalThis.chessNative?.maxThreads||navigator.hardwareConcurrency||2;
  const hash=Math.min(150,globalThis.chessNative?.maxHashMB||150);
  engine=new StockfishEngine(()=>{},job=>{
   if(id!==runId)return;
   const nps=job.nps;
   stop();
   if(!Number.isFinite(nps)||nps<=0){resetScore();$('benchmarkStatus').textContent='No speed result received. Please try again.';return;}
   showScore(nps);$('benchmarkStatus').textContent='Benchmark complete';
  },status=>{
   if(id!==runId)return;
   if(status==='unavailable'||status==='reconnecting'){stop();resetScore();$('benchmarkStatus').textContent='Benchmark could not run. Please try again.';}
  },()=>new NativeEngineTransport('stockfish19'),job=>{
   if(id!==runId)return;
   if(!started){started=true;$('benchmarkStatus').textContent='Running benchmark…';}
   showScore(job.nps);
  });
  engine.request({id:1,fen:BENCHMARK_FEN,multiPV:1,level:20,time:15000,threads,hash,wdl:false});
  timeout=setTimeout(()=>{if(id===runId){stop();resetScore();$('benchmarkStatus').textContent='Benchmark timed out. Please try again.';}},40000);
 }
 $('benchmarkRun').onclick=run;
 $('benchmarkBack').onclick=()=>{dialog.close();api.open('settingsDialog');};
 dialog.addEventListener('close',()=>{stop();api.endBenchmark();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
 window.addEventListener('chess-native-lifecycle',e=>{if(e.detail==='background'||e.detail==='suspend')cancel();});
 window.addEventListener('pagehide',stop);
 return {open(){
  api.open('benchmarkDialog');api.beginBenchmark();
  const native=globalThis.chessNative,info=native?.deviceInfo;
  const model=info?.modelName||'device',cores=native?.maxThreads||navigator.hardwareConcurrency;
  const memory=native?.memoryMB?Math.round(native.memoryMB/1024):null;
  $('benchmarkDevice').textContent='Your '+model+' has '+(cores?'a '+cores+'-core CPU':'a CPU')+(memory?' and '+memory+' GB of RAM.':'. RAM information is unavailable.');
  run();
 }};
}
