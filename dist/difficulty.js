// Displayed Elo bands are approximate presets, not calibrated player ratings.
// Preserve Stockfish's full-strength level 20 for World Champion and analysis.
export const DIFFICULTIES=[
  [150,550,'Beginner',0],
  [550,950,'Beginner',1],
  [950,1075,'Casual',2],
  [1075,1175,'Casual',3],
  [1175,1275,'Average',4],
  [1275,1375,'Average',5],
  [1375,1475,'Intermediate',6],
  [1475,1575,'Intermediate',7],
  [1575,1675,'Experienced',8],
  [1675,1775,'Experienced',9],
  [1775,1875,'Tournament Player',10],
  [1875,1975,'Tournament Player',11],
  [1975,2075,'Expert',12],
  [2075,2175,'Expert',13],
  [2175,2275,'National Master',14],
  [2275,2375,'FIDE Master',15],
  [2375,2475,'International Master',16],
  [2475,2725,'Grandmaster',17],
  [2725,3525,'World Champion',20]
].map(([min,max,label,level])=>({min,max,label,level:String(level),range:min+' to '+max}));

export function difficultyForLevel(level){
  return DIFFICULTIES.find(item=>item.level===String(level))||DIFFICULTIES.find(item=>item.level==='5');
}
