// Reject impossible material before a position reaches a native engine.
export function validatePosition(game){
  const kings={};
  for(const color of ['w','b']){
    const pieces=game.board().flat().filter(p=>p?.color===color);
    const count=type=>pieces.filter(p=>p.type===type).length;
    const name=color==='w'?'White':'Black';
    if(count('k')!==1)throw Error(name+' must have exactly one king.');
    kings[color]=pieces.find(p=>p.type==='k').square;
    if(pieces.length>16)throw Error(name+' cannot have more than 16 pieces. Remove extra pieces.');
    if(count('p')>8)throw Error(name+' cannot have more than 8 pawns.');
    const bishops=[0,0];
    for(const p of pieces){
      if(p.type==='p'&&/[18]$/.test(p.square))throw Error('Pawns cannot be on the first or last rank.');
      if(p.type==='b')bishops[(p.square.charCodeAt(0)+Number(p.square[1]))%2]++;
    }
    const promotions=Math.max(0,count('q')-1)+Math.max(0,count('r')-2)+Math.max(0,count('n')-2)+bishops.reduce((sum,n)=>sum+Math.max(0,n-1),0);
    if(promotions>8-count('p'))throw Error(name+' has too many promoted pieces for the remaining pawns. Remove extra pieces or pawns.');
  }
  const w=kings.w,b=kings.b;
  if(Math.abs(w.charCodeAt(0)-b.charCodeAt(0))<=1&&Math.abs(Number(w[1])-Number(b[1]))<=1)throw Error('The kings cannot be next to one another.');
  const waiting=game.turn()==='w'?'b':'w';
  if(game.isAttacked(kings[waiting],game.turn()))throw Error('The side that just moved cannot leave its king in check.');
}
