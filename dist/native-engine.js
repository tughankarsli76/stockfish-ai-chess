// Worker-shaped transport for the official local Windows engine.
// Streams UCI output while sending commands in strict order.
export class NativeEngineTransport {
  async open(){
    for(let attempt=0;attempt<5&&!this.closed;attempt++){
      const response=await fetch('/api/engine/open',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}',signal:this.controller.signal});
      if(response.status!==429||attempt===4)return response;
      await response.body?.cancel();
      await new Promise(resolve=>{const signal=this.controller.signal;let timer;const finish=()=>{clearTimeout(timer);signal.removeEventListener('abort',finish);resolve();};if(signal.aborted)return resolve();timer=setTimeout(finish,1000);signal.addEventListener('abort',finish,{once:true});});
    }
    return null;
  }
  constructor(engine="stockfish19"){if(globalThis.chessNative?.Transport)return new globalThis.chessNative.Transport(engine);this.controller=new AbortController();this.pending=[];this.session=null;this.chain=Promise.resolve();this.closed=false;this.connect();}
  async connect(){try{const response=await this.open();if(this.closed)return;if(!response.ok)throw Error('Engine HTTP '+response.status);const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='';while(!this.closed){const {done,value}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});let newline;while((newline=buffer.indexOf('\n'))>=0){const text=buffer.slice(0,newline);buffer=buffer.slice(newline+1);if(!text)continue;const event=JSON.parse(text);if(event.session){this.session=event.session;for(const command of this.pending)this.postMessage(command);this.pending=[];}if(typeof event.line==='string')this.onmessage?.({data:event.line});}}if(!this.closed)throw Error('Engine connection closed');}catch(error){if(!this.closed)this.onerror?.(error);}}
  postMessage(command){if(this.closed)return;if(!this.session){this.pending.push(command);return;}this.chain=this.chain.then(async()=>{if(this.closed)return;const response=await fetch('/api/engine/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session:this.session,command}),signal:this.controller.signal});if(!response.ok)throw Error('Engine command HTTP '+response.status);}).catch(error=>{if(!this.closed)this.onerror?.(error);});}
  terminate(){this.closed=true;this.pending=[];this.controller.abort();}
}
