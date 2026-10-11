// Display levels describe the preset order, not calibrated Elo ratings.
// Keep existing Stockfish skills so saved settings and playing strength are preserved.
export const DIFFICULTIES=[
  ['Easiest',0],
  ['Low',1],
  ['Low',2],
  ['Low',3],
  ['Medium',4],
  ['Medium',5],
  ['Medium',6],
  ['Medium',7],
  ['High',8],
  ['High',9],
  ['High',10],
  ['High',11],
  ['Very High',12],
  ['Very High',13],
  ['Very High',14],
  ['Very High',15],
  ['Very High',16],
  ['Very High',17],
  ['Full Strength',20]
].map(([label,level],index)=>({label,level:String(level),number:index+1,title:'Level '+(index+1)}));

export function difficultyForLevel(level){
  return DIFFICULTIES.find(item=>item.level===String(level))||DIFFICULTIES.find(item=>item.level==='5');
}
