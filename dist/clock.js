export const gameMinutes = value => Math.round(Math.max(1,Math.min(180,Number(value)||3)));
export const moveIncrement = value => Math.round(Math.max(0,Math.min(60,Number(value)||0)));
export function clockLabel(ms){
  const seconds=Math.max(0,Math.ceil(ms/1000));
  return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
}

export class GameClock {
  constructor(minutes=3,increment=0,now=()=>performance.now()){
    this.now=now;this.increment=moveIncrement(increment)*1000;
    this.remaining={w:gameMinutes(minutes)*60000,b:gameMinutes(minutes)*60000};
    this.running=null;this.since=now();this.expired=null;
  }
  tick(){
    const now=this.now();
    if(this.running&&!this.expired){
      this.remaining[this.running]=Math.max(0,this.remaining[this.running]-Math.max(0,now-this.since));
      if(this.remaining[this.running]===0){this.expired=this.running;this.running=null;}
    }
    this.since=now;
    return this.expired;
  }
  run(color){this.tick();this.running=this.expired?null:color;}
  finishMove(color){
    this.tick();if(this.expired)return false;
    this.remaining[color]+=this.increment;this.running=null;return true;
  }
  snapshot(){this.tick();return {remaining:{...this.remaining},expired:this.expired};}
  restore(data){
    if(!data||!['w','b'].every(c=>Number.isFinite(data.remaining?.[c])&&data.remaining[c]>=0))return false;
    this.remaining={...data.remaining};this.expired=['w','b'].includes(data.expired)?data.expired:null;
    this.running=null;this.since=this.now();return true;
  }
  uci(){this.tick();return {wtime:Math.max(1,Math.floor(this.remaining.w)),btime:Math.max(1,Math.floor(this.remaining.b)),winc:this.increment,binc:this.increment};}
}
