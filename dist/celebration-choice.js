// Independent, equal-probability choices. Repeats are intentional, not shuffled away.
export const CELEBRATIONS=Object.freeze(['samurai','dragon','ice-wizard','lightning-knight','phoenix','gorilla','storm-warrior','lion-king','cosmic-wizard','emerald-archer']);
export function randomCelebration(){
  if(globalThis.crypto?.getRandomValues){
    const value=new Uint32Array(1),limit=0x100000000-0x100000000%CELEBRATIONS.length;
    // Reject the incomplete remainder so every scene has exactly equal odds.
    do{globalThis.crypto.getRandomValues(value);}while(value[0]>=limit);
    return CELEBRATIONS[value[0]%CELEBRATIONS.length];
  }
  return CELEBRATIONS[Math.floor(Math.random()*CELEBRATIONS.length)];
}
