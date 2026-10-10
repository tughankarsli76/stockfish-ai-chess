// Optional move audio. Keep all audio allocation out of the default startup path.
export class MoveSound {
  constructor({native=globalThis.chessNative,createAudio=capture=>new Audio(new URL(capture?'./assets/audio/capture-lichess.mp3':'./assets/audio/move-lichess.mp3',import.meta.url).href),hidden=()=>document.hidden}={}){
    this.native=native;this.createAudio=createAudio;this.hidden=hidden;
    this.enabled=false;this.configured=false;this.audio=null;this.captureAudio=null;
  }
  setEnabled(value){
    const enabled=value===true;
    if(this.configured&&enabled===this.enabled)return;
    this.configured=true;
    this.enabled=enabled;
    if(this.native?.setMoveSoundEnabled)this.native.setMoveSoundEnabled(enabled).catch(()=>{});
    if(!enabled)this.stop();
  }
  play(capture=false){
    if(!this.enabled||this.hidden())return;
    capture=capture===true;
    if(this.native?.playMoveSound){this.native.playMoveSound(capture).catch(()=>{});return;}
    try{
      const key=capture?'captureAudio':'audio';
      if(!this[key]){this[key]=this.createAudio(capture);this[key].volume=0.8;}
      this[key].currentTime=0;
      this[key].play()?.catch(()=>{});
    }catch{/* Audio must never interrupt a move. */}
  }
  stop(){
    for(const audio of [this.audio,this.captureAudio])if(audio){audio.pause();audio.currentTime=0;}
  }
}
