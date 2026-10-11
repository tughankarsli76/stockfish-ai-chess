// Photo-derived positions have no move history. Never infer castling or
// en-passant rights from pieces merely standing on their starting squares.
export function scanDraft(placement){
  const rows=String(placement).split('/'),squares={};
  if(rows.length!==8)throw Error('The photo did not produce an 8 × 8 board.');
  rows.forEach((row,index)=>{
    let file=0;
    for(const p of row){
      if(/^[1-8]$/.test(p))file+=Number(p);
      else if(/^[prnbqkPRNBQK]$/.test(p)&&file<8)squares['abcdefgh'[file++]+(8-index)]=p;
      else throw Error('The photo contains an unreadable square.');
    }
    if(file!==8)throw Error('The photo did not produce an 8 × 8 board.');
  });
  return {squares,turn:'w',castling:[],enPassant:'-',halfmove:0,fullmove:1};
}
export function rotateScan(draft){
  const squares={};
  for(const [square,piece] of Object.entries(draft.squares))squares['hgfedcba'['abcdefgh'.indexOf(square[0])]+(9-Number(square[1]))]=piece;
  return {...draft,squares,castling:[],enPassant:'-'};
}
export function checkedCorners(points){
  if(!Array.isArray(points)||points.length!==4||points.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>!Number.isFinite(v)||v<0||v>1)))throw Error('Keep all four corners inside the photo.');
  let area=0;
  for(let i=0;i<4;i++){
    const p=points[i],q=points[(i+1)%4],r=points[(i+2)%4];
    if((q[0]-p[0])*(r[1]-q[1])-(q[1]-p[1])*(r[0]-q[0])<=.0001)throw Error('Place the corners clockwise around the board, without crossing them.');
    area+=p[0]*q[1]-q[0]*p[1];
  }
  if(area<.02)throw Error('The board is too small. Move the corners outward or take a closer photo.');
  return points;
}
// Map the unit board to a quadrilateral, including its seven internal grid lines.
export function boardProjection(points){
  checkedCorners(points);
  const a=[];
  for(const [i,[u,v]] of [[0,[0,0]],[1,[1,0]],[2,[1,1]],[3,[0,1]]]){
    const [x,y]=points[i];
    a.push([u,v,1,0,0,0,-x*u,-x*v,x],[0,0,0,u,v,1,-y*u,-y*v,y]);
  }
  for(let j=0;j<8;j++){
    let pivot=j;for(let i=j+1;i<8;i++)if(Math.abs(a[i][j])>Math.abs(a[pivot][j]))pivot=i;
    [a[j],a[pivot]]=[a[pivot],a[j]];
    const d=a[j][j];if(Math.abs(d)<1e-9)throw Error('Choose a clearer board outline.');
    for(let k=j;k<9;k++)a[j][k]/=d;
    for(let i=0;i<8;i++)if(i!==j){const f=a[i][j];for(let k=j;k<9;k++)a[i][k]-=f*a[j][k];}
  }
  const h=a.map(row=>row[8]);
  return (u,v)=>{const d=h[6]*u+h[7]*v+1;return [(h[0]*u+h[1]*v+h[2])/d,(h[3]*u+h[4]*v+h[5])/d];};
}
export function perspectiveBoard(gray,points){
  const project=boardProjection(points),board=new Float32Array(256*256);
  const sample=(x,y)=>gray.data[Math.max(0,Math.min(gray.height-1,y))*gray.width+Math.max(0,Math.min(gray.width-1,x))];
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
    const p=project((x+.5)/256,(y+.5)/256),sx=p[0]*gray.width-.5,sy=p[1]*gray.height-.5;
    const ix=Math.floor(sx),iy=Math.floor(sy),dx=sx-ix,dy=sy-iy;
    board[y*256+x]=(sample(ix,iy)*(1-dx)*(1-dy)+sample(ix+1,iy)*dx*(1-dy)+sample(ix,iy+1)*(1-dx)*dy+sample(ix+1,iy+1)*dx*dy)/255;
  }
  return board;
}
