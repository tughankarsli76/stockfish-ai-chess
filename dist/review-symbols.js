// Review-only presentation: monochrome vector symbols avoid colored emoji fonts.
export const REVIEW_SYMBOLS={
 brilliant:{color:'#20bba5',text:'!!'},
 great:{color:'#739bbf',text:'!'},
 book:{color:'#cea076',path:'M3 4c3-1 6-1 8 1v15c-2-2-5-2-8-1z M13 5c2-2 5-2 8-1v15c-3-1-6-1-8 1z'},
 best:{color:'#81b64c',path:'m12 2 3 6.5 7 1-5 5 1.2 7-6.2-3.3-6.2 3.3 1.2-7-5-5 7-1z'},
 excellent:{color:'#81b64c',path:'M2 10h4v11H2z M8 10l4-7c.5-1 2-1 2 1v5h6c2 0 2 2 1.5 4l-2 7c-.2 1-1 1-2 1H8z'},
 good:{color:'#96b776',path:'m3 12 5 5L21 4l3 3L8 23 0 15z'},
 inaccuracy:{color:'#f7c631',text:'?!'},
 mistake:{color:'#ffa459',text:'?'},
 miss:{color:'#ff7066',path:'m4 1 8 8 8-8 3 3-8 8 8 8-3 3-8-8-8 8-3-3 8-8-8-8z'},
 blunder:{color:'#ff412f',text:'??'}
};
export function reviewSymbol(kind){
 const style=REVIEW_SYMBOLS[kind],icon=document.createElement('span');icon.className='review-symbol';icon.dataset.rating=kind;icon.style.backgroundColor=style.color;icon.setAttribute('aria-hidden','true');
 if(style.path)icon.innerHTML='<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="currentColor" d="'+style.path+'"/></svg>';
 else icon.textContent=style.text;
 return icon;
}
