import {NativeEngineTransport} from './native-engine.js';
export const ENGINE_NAME = 'Stockfish 19';

export function parseInfo(line) {
  const depth = line.match(/\bdepth (\d+)/);
  const score = line.match(/\bscore (cp|mate) (-?\d+)/);
  const pv = line.match(/\bpv (.+)$/);
  if (!depth || !score || !pv || /\b(lowerbound|upperbound)\b/.test(line)) return null;
  const multipv = Number(line.match(/\bmultipv (\d+)/)?.[1] || 1);
  if (multipv < 1 || multipv > 3) return null;
  const info = {depth: Number(depth[1]), type: score[1], score: Number(score[2]), multipv, pv: pv[1].trim().split(/\s+/)};
  const wdl=line.match(/\bwdl (\d+) (\d+) (\d+)/);
  if(wdl)info.wdl=wdl.slice(1).map(Number);
  return info;
}

// Only one search is active. Stopped results cannot update a newer position.
// MultiPV lines are published as complete, same-depth batches.
export class StockfishEngine {
  constructor(onInfo, onResult, onStatus, createTransport = () => new NativeEngineTransport(), onProgress = () => {}) {
    Object.assign(this, {onInfo, onResult, onStatus, onProgress, ready: false, active: null, pending: null, failed: false});
    this.createTransport=createTransport;this.retries=0;this.destroyed=false;
    this.connect();
  }
  connect() {
    if(this.destroyed)return;
    this.failed=false;this.ready=false;this.identity=null;this.configuration={};
    const worker=this.worker=this.createTransport();
    worker.onmessage=e=>{if(this.worker===worker&&!this.failed&&!this.destroyed)String(e.data).split('\n').forEach(line=>this.receive(line));};
    worker.onerror=error=>{if(this.worker===worker)this.fail(error);};
    this.timer = setTimeout(() => { if (!this.ready) this.fail(Error('Engine startup timed out')); }, 20000);
    this.send('uci');
  }
  send(command) { this.worker.postMessage(command); }
  fail(error) {
    if (this.failed||this.destroyed) return;
    console.warn('Stockfish connection:',error?.message||'Connection lost');
    this.failed = true; this.ready = false;
    clearTimeout(this.timer); this.worker.terminate();
    this.pending=this.pending||(!this.active?.cancelled&&this.active?{...this.active,cancelled:false}:null);
    this.active = null;
    if(this.retries<3){
      this.onStatus('reconnecting');
      this.retryTimer=setTimeout(()=>{this.retryTimer=null;this.connect();},1000*++this.retries);
    }else this.onStatus('unavailable');
  }
  receive(line) {
    if(line.startsWith('id name ')){this.identity=line.slice(8);}
    else if (line === 'uciok') {
      this.send('setoption name Threads value '+Math.min(globalThis.chessNative?.maxThreads||2,2));
      this.send('setoption name Hash value '+Math.min(globalThis.chessNative?.maxHashMB||150,150));
      this.send('isready');
    } else if (line === 'readyok') {
      clearTimeout(this.timer); this.ready = true;
      this.onStatus('ready'); this.start();
    } else if (line.startsWith('info ') && this.active && !this.active.cancelled) {
      const info = parseInfo(line), job = this.active;
      if(info)this.retries=0;
      // Nodes is the cumulative total across threads, repeated in MultiPV output.
      // Progress can arrive without a complete PV, or at an already published depth.
      const nodesMatch = line.match(/\bnodes (\d+)(?=\s|$)/);
      const nodes = nodesMatch ? Number(nodesMatch[1]) : null;
      const depthMatch = line.match(/\bdepth (\d+)(?=\s|$)/);
      const depth = depthMatch ? Number(depthMatch[1]) : null;
      const tbMatch = line.match(/\btbhits (\d+)(?=\s|$)/);
      const tbHits = tbMatch ? Number(tbMatch[1]) : null;
      const npsMatch = line.match(/\bnps (\d+)(?=\s|$)/);
      const nps = npsMatch ? Number(npsMatch[1]) : null;
      let progressChanged = false;
      if (Number.isSafeInteger(nps) && nps !== job.nps) {
        job.nps = nps;
        progressChanged = true;
      }
      if (Number.isSafeInteger(tbHits) && tbHits > job.tbHits) {
        job.tbHits = tbHits;
        progressChanged = true;
      }
      if (Number.isSafeInteger(nodes) && nodes > job.nodes) {
        job.nodes = nodes;
        progressChanged = true;
      }
      if (Number.isSafeInteger(depth) && depth > job.searchDepth) {
        job.searchDepth = depth;
        progressChanged = true;
      }
      if (progressChanged) this.onProgress(job);
      if (!info || info.multipv > job.multiPV || info.depth <= job.publishedDepth) return;
      const batch = job.depths.get(info.depth) || new Map();
      batch.set(info.multipv, info);
      job.depths.set(info.depth, batch);
      const complete = Array.from({length: job.multiPV}, (_, i) => batch.get(i + 1));
      if (complete.some(item => !item) || new Set(complete.map(item => item.pv[0])).size !== job.multiPV) return;
      job.lines = complete;
      job.info = complete[0]; // Score and graph must always use rank 1.
      job.publishedDepth = info.depth;
      for (const depth of job.depths.keys()) if (depth <= info.depth) job.depths.delete(depth);
      this.onInfo(job, job.info);
    } else if (line.startsWith('bestmove ') && this.active) {
      const job = this.active; this.active = null;
      if (!job.cancelled) this.onResult(job, line.split(' ')[1], job.info);
      this.start();
    }
  }
  request(job) {
    if (this.destroyed) return;
    this.pending = job;
    if(this.failed){if(!this.retryTimer){this.retries=0;this.onStatus('reconnecting');this.connect();}return;}
    if (this.active) {
      if (!this.active.cancelled) { this.active.cancelled = true; this.send('stop'); }
    } else this.start();
  }
  cancel() {
    this.pending = null;
    if (this.active && !this.active.cancelled) { this.active.cancelled = true; this.send('stop'); }
  }
  moveNow() {
    if(!this.active || this.active.cancelled)return false;
    this.active.forceMove=true;
    this.send('stop');
    return true;
  }
  start() {
    if (!this.ready || this.active || !this.pending) return;
    const job = this.pending; this.pending = null; this.active = job;
    job.multiPV = Math.max(1, Math.min(3, job.multiPV || 1));
    job.lines = []; job.depths = new Map(); job.publishedDepth = -1;
    job.nodes = 0; job.searchDepth = 0; job.tbHits = 0; job.nps = null;
    this.onProgress(job);
    this.configuration ||= {};
    const options={Threads:job.threads||2,Hash:job.hash||150,UCI_ShowWDL:!!job.wdl,SyzygyPath:job.tablebasePath||'<empty>'};
    for(const [name,value] of Object.entries(options))if(this.configuration[name]!==value){this.send('setoption name '+name+' value '+value);this.configuration[name]=value;}
    this.send('setoption name Skill Level value ' + job.level);
    this.send('setoption name MultiPV value ' + job.multiPV);
    this.send('position fen ' + job.fen);
    const clock=job.computer&&job.clock;
    this.send(clock?'go wtime '+Math.max(1,Math.floor(clock.wtime))+' btime '+Math.max(1,Math.floor(clock.btime))+' winc '+Math.max(0,Math.floor(clock.winc))+' binc '+Math.max(0,Math.floor(clock.binc)):(job.time===0?'go infinite':'go movetime ' + job.time));
  }
  suspend() {
    if(this.suspended)return;
    this.suspended=true;this.cancel();clearTimeout(this.retryTimer);clearTimeout(this.timer);this.retryTimer=null;this.worker.terminate();this.worker=null;this.active=null;this.ready=false;
  }
  resume() { if(!this.suspended)return;this.suspended=false;this.retries=0;this.connect(); }
  destroy() { this.destroyed=true;this.cancel();clearTimeout(this.retryTimer);this.retryTimer=null; clearTimeout(this.timer); this.worker?.terminate(); }
}
