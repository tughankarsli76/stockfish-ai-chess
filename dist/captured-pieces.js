import {pieceImage} from './pieces.js';

// Use the recorded moves, so promotions and custom starting positions do not
// create imaginary captures. Each side lists the pieces that side captured.
export function capturedPieces(session){
  const pieces={w:[],b:[]};
  for(const move of session.moves.slice(0,session.cursor)){
    if(move.captured)pieces[move.color].push(move.captured);
  }
  const order='qrbnp';
  for(const side of ['w','b'])pieces[side].sort((a,b)=>order.indexOf(a)-order.indexOf(b));
  return pieces;
}

export function renderCapturedPieces(container,session,pieceSet,t){
  const pieces=capturedPieces(session);
  const names={p:'Pawn',n:'Knight',b:'Bishop',r:'Rook',q:'Queen'};
  container.replaceChildren();
  for(const side of ['w','b']){
    const row=document.createElement('section');row.className='captured-side';
    const heading=document.createElement('h3');
    heading.textContent=t(side==='w'?'Captured by White':'Captured by Black');
    const list=document.createElement('div');list.className='captured-piece-list';
    for(const type of pieces[side]){
      const img=document.createElement('img');
      img.src=pieceImage(pieceSet,side==='w'?'b':'w',type);
      img.alt=t(side==='w'?'Black':'White')+' '+t(names[type]);
      img.draggable=false;list.append(img);
    }
    if(!pieces[side].length)list.textContent=t('No captured pieces.');
    row.append(heading,list);container.append(row);
  }
}
