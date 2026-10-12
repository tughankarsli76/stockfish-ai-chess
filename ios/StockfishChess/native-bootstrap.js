(() => {
  const call = body => window.webkit.messageHandlers.chess.postMessage(body);
  const store = {...window.__chessSaved};
  const storage = {
    getItem:key=>Object.hasOwn(store,String(key))?store[String(key)]:null,
    setItem(key,value){key=String(key);value=String(value);store[key]=value;call({action:'store',key,value});},
    removeItem(key){key=String(key);delete store[key];call({action:'store',key,value:null});},
    clear(){for(const key of Object.keys(store))this.removeItem(key);},
    key:index=>Object.keys(store)[index]??null,
    get length(){return Object.keys(store).length;}
  };
  Object.defineProperty(window,'localStorage',{value:storage});
  if(!crypto.randomUUID)crypto.randomUUID=()=> '10000000-1000-4000-8000-100000000000'.replace(/[018]/g,c=>(Number(c)^crypto.getRandomValues(new Uint8Array(1))[0]&15>>Number(c)/4).toString(16));
  const transports=new Map();
  window.__chessEngineLine=(session,line)=>transports.get(session)?.onmessage?.({data:line});
  class IOSEngineTransport {
    constructor(engine="stockfish19"){this.session=crypto.randomUUID();this.closed=false;transports.set(this.session,this);this.chain=call({action:'open',session:this.session,engine});}
    postMessage(command){if(this.closed)return;this.chain=this.chain.then(()=>{if(!this.closed)return call({action:'command',session:this.session,command});}).catch(error=>{if(!this.closed)this.onerror?.(error);});}
    terminate(){if(this.closed)return;this.closed=true;transports.delete(this.session);call({action:'close',session:this.session});}
  }
  window.chessNative={pickScanPhoto:source=>call({action:'pickScanPhoto',source}),readScan:data=>call({action:'readScan',...data}),setScreenAwake:enabled=>call({action:'screenAwake',enabled:enabled===true}),setMoveSoundEnabled:enabled=>call({action:'moveSoundEnabled',enabled}),playMoveSound:(capture=false)=>call({action:'playMoveSound',capture:capture===true}),setMoveHapticsEnabled:enabled=>call({action:'moveHapticsEnabled',enabled}),playMoveHaptics:()=>call({action:'playMoveHaptics'}),backgroundGame:(data,tournament)=>call({action:'backgroundGame',data,tournament}),tablebaseStatus:()=>call({action:'tablebaseStatus'}),downloadTablebases:()=>call({action:'tablebaseDownload'}),pauseTablebases:()=>call({action:'tablebasePause'}),appVersion:window.__chessAppInfo?.version||"",deviceInfo:window.__chessDeviceInfo||{},coreInfo:window.__chessCoreInfo||{},maxHashMB:Math.max(16,Math.floor(Number(window.__chessMaxHashMB)||32)),memoryMB:Math.max(0,Math.floor(Number(window.__chessMemoryMB)||0)),maxThreads:Math.max(1,Math.floor(Number(window.__chessMaxThreads)||1)),engines:[{id:'stockfish19',name:'Stockfish 19'},{id:'karsli01',name:'Karsli 1.0-dev'},{id:'reckless090',name:'Reckless 0.9.0'},{id:'plenty800',name:'PlentyChess 8.0.0'},{id:'pawn201',name:'Pawnocchio 2.0.1',maxPV:1},{id:'obsidian160',name:'Obsidian 16.0'},{id:'cinder061',name:'Cinder 0.6.1',maxPV:1},{id:'viridithas200',name:'Viridithas 20.0.0',maxPV:1},{id:'halogen160',name:'Halogen 16.0.0'},{id:'clover91',name:'Clover 9.1'},{id:'starzix61',name:'Starzix 6.1',maxPV:1}],Transport:IOSEngineTransport,share:(text,name)=>call({action:'share',text,name}),pickGame:()=>call({action:'pickGame'})};
  Object.defineProperty(navigator,'clipboard',{value:{readText:()=>call({action:'readClipboard'}),writeText:text=>call({action:'writeClipboard',text})}});
  const originalFetch=window.fetch.bind(window);
  window.fetch=async(input,options={})=>{
    const url=new URL(typeof input==='string'?input:input.url,location.href);
    if(url.pathname==='/api/engine/info')return new Response(JSON.stringify({maxThreads:window.chessNative.maxThreads,maxHashMB:window.chessNative.maxHashMB,memoryMB:window.chessNative.memoryMB,coreInfo:window.chessNative.coreInfo}),{headers:{'Content-Type':'application/json'}});
    if(!['api.chess.com','lichess.org'].includes(url.hostname))return originalFetch(input,options);
    const signal=options.signal,identifier=crypto.randomUUID();
    if(signal?.aborted)throw new DOMException('Request cancelled','AbortError');
    const abort=()=>call({action:'cancelFetch',identifier});
    signal?.addEventListener('abort',abort,{once:true});
    try {const result=await call({action:'fetch',url:url.href,identifier});if(signal?.aborted)throw new DOMException('Request cancelled','AbortError');return new Response(result.text,{status:result.status,headers:{'Content-Type':result.type||'application/json'}});}
    finally{signal?.removeEventListener('abort',abort);}
  };
  document.addEventListener('DOMContentLoaded',async()=>{
    document.title='Stockfish AI Chess';
    document.querySelector('header > span')?.remove();
    document.documentElement.classList.add('native-ios');
    try{const module=await import('chess://app/fixed-pages.js');module.installFixedPages();}catch(error){console.warn('Page layout setup:',error);}
    // No fixed delay and no dependency on engine readiness. Present the actual
    // restored position once its pieces and native layout are ready to draw.
    if(document.querySelectorAll('#board .square').length===64){
      await Promise.all([...document.querySelectorAll('#board img')].map(image=>image.decode().catch(()=>{})));
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      await call({action:'interfaceReady'});
    }
  });
})();
