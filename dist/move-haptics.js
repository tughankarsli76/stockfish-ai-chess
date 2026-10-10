// Optional move feedback. Unsupported devices and hidden pages stay quiet.
export class MoveHaptics {
  constructor({native=globalThis.chessNative,hidden=()=>document.hidden}={}){
    this.native=native;this.hidden=hidden;this.enabled=false;this.configured=false;
  }
  setEnabled(value){
    const enabled=value===true;
    if(this.configured&&enabled===this.enabled)return;
    this.configured=true;this.enabled=enabled;
    try{Promise.resolve(this.native?.setMoveHapticsEnabled?.(enabled)).catch(()=>{});}catch{}
  }
  play(){
    if(!this.enabled||this.hidden())return;
    try{Promise.resolve(this.native?.playMoveHaptics?.()).catch(()=>{});}catch{/* Feedback must never interrupt a move. */}
  }
}
