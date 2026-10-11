import {findChessboardCorners,snapCorners} from './vendor/scan/detect.js';
import {extractTiles,rgbaToGray,boardToTiles} from './vendor/scan/tiles.js';
import {probsToPlacement} from './vendor/scan/fen.js';
import {scanDraft,checkedCorners,boardProjection,perspectiveBoard} from './scan-position.js';
import {positionFromDraft} from './features.js';
import {pieceImage} from './pieces.js';

// Geometry uses clockwise corner order; labels follow reading order.
const CORNER_LABELS=[1,2,4,3];

const MARKUP=`<dialog id="scanDialog" class="mode-screen scan-screen" aria-labelledby="scanTitle">
  <div class="mode-heading"><button id="scanBack" type="button"><span class="back-chevron" aria-hidden="true"></span><span>Game</span></button><h2 id="scanTitle">Scan and Analyze</h2><button id="scanDone" type="button">Done</button></div>
  <div id="scanChoose"><p>Choose a photo or take a picture of the whole board. Keep every square and piece visible.</p>
    <div class="list"><label><span>Image type</span><select id="scanKind"><option value="digital">Screenshot / Diagram</option><option value="physical">Physical Board</option></select></label>
    <button id="scanCamera" type="button">Take Photo</button><button id="scanLibrary" type="button">Choose Photo</button></div>
    <p class="scan-note">Photos are processed on your iPhone. They are not uploaded or saved by this app.</p></div>
  <div id="scanCrop" hidden>
    <div id="scanPhotoFrame" class="scan-photo-frame"><img id="scanPhoto" alt="Selected chessboard photo"><svg id="scanGrid" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"></svg></div>
    <div class="dialog-actions"><button id="scanAnother" type="button">Change Photo</button><button id="scanRead" type="button" class="primary">Read Board</button></div></div>
  <div id="scanReview" hidden>
    <div class="scan-board-frame">
      <div class="rank-labels scan-board-ranks" aria-hidden="true">${[8,7,6,5,4,3,2,1].map(rank=>`<span>${rank}</span>`).join('')}</div>
      <div id="scanBoard" class="board scan-board" role="group" aria-label="Review detected position"></div>
      <div class="file-labels scan-board-files" aria-hidden="true">${[...'abcdefgh'].map(file=>`<span>${file}</span>`).join('')}</div>
    </div>
    <div id="scanPalette" class="scan-palette" role="group" aria-label="Choose a piece or erase"></div>
    <div class="list"><label><span>Side to move</span><select id="scanTurn"><option value="">Choose side to move</option><option value="w">White</option><option value="b">Black</option></select></label></div>
    <details><summary>Position history</summary><p>A photo cannot show castling rights, en passant, or move counters. Set these if known. Defaults: no castling, no en passant, 0 half-moves, move 1.</p>
      <div class="scan-rights"><label><input type="checkbox" data-scan-castle="K"> White O-O</label><label><input type="checkbox" data-scan-castle="Q"> White O-O-O</label><label><input type="checkbox" data-scan-castle="k"> Black O-O</label><label><input type="checkbox" data-scan-castle="q"> Black O-O-O</label></div>
      <label>En passant <input id="scanEp" type="text" maxlength="2" value="-" placeholder="- or e3"></label>
      <label>Half-moves <input id="scanHalfmove" type="number" min="0" max="999999" value="0"></label>
      <label>Move number <input id="scanFullmove" type="number" min="1" max="999999" value="1"></label></details>
    <div class="dialog-actions"><button id="scanRetry" type="button">Back to Photo</button><button id="scanAnalyze" type="button" class="primary">Analyze</button></div></div>
  <p id="scanStatus" role="status" aria-live="polite"></p><p id="scanError" class="error" role="alert"></p>
</dialog>`;

export function installScanner(api){
  document.body.insertAdjacentHTML('beforeend',MARKUP);
  const $=id=>document.getElementById(id),dialog=$('scanDialog');
  let generation=0,image=null,encoded='',corners=null,gray=null,draft=null,palette='',busy=false,applied=false;
  let initialCandidates=[];
  let uncertainSquares=new Set();
  const error=text=>$('scanError').textContent=text||'';
  function stage(name){
    for(const key of ['Choose','Crop','Review'])$('scan'+key).hidden=key!==name;
    // Each stage has different content heights; do not retain the crop scroll offset.
    dialog.scrollTop=0;
    error();
  }
  function working(value,text=''){
    busy=value;dialog.setAttribute('aria-busy',String(value));$('scanStatus').textContent=text;
    for(const id of ['scanCamera','scanLibrary','scanAnother','scanRead','scanRetry','scanAnalyze'])$(id).disabled=value;
  }
  function clear(){generation++;image=null;gray=null;draft=null;encoded='';initialCandidates=[];uncertainSquares.clear();corners=null;$('scanPhoto').removeAttribute('src');$('scanGrid').replaceChildren();$('scanBoard').replaceChildren();$('scanPalette').replaceChildren();working(false);}
  dialog.addEventListener('close',()=>{clear();if(!applied)api.resumeAfterScan?.();});
  const close=()=>dialog.close();$('scanDone').onclick=close;$('scanBack').onclick=close;
  function renderGrid(){
    const svg=$('scanGrid');svg.replaceChildren();
    try{
      const project=boardProjection(corners);
      const line=(p,q)=>{const n=document.createElementNS('http://www.w3.org/2000/svg','line');for(const [key,value] of Object.entries({x1:p[0]*1000,y1:p[1]*1000,x2:q[0]*1000,y2:q[1]*1000}))n.setAttribute(key,value);svg.append(n);};
      for(let i=0;i<=8;i++){line(project(i/8,0),project(i/8,1));line(project(0,i/8),project(1,i/8));}
      error();
    }catch(e){error(e.message);}
    corners.forEach((p,i)=>{
      const marker=document.createElementNS('http://www.w3.org/2000/svg','circle');marker.setAttribute('cx',p[0]*1000);marker.setAttribute('cy',p[1]*1000);marker.setAttribute('r','27');marker.dataset.corner=i;svg.append(marker);
      const number=document.createElementNS('http://www.w3.org/2000/svg','text');number.setAttribute('x',p[0]*1000);number.setAttribute('y',p[1]*1000+12);number.textContent=CORNER_LABELS[i];svg.append(number);
    });
  }
  let dragging=null;
  $('scanGrid').addEventListener('pointerdown',e=>{
    if(busy)return;
    const rect=$('scanGrid').getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width,y=(e.clientY-rect.top)/rect.height;
    let best=-1,distance=Infinity;corners?.forEach((p,i)=>{const d=Math.hypot((p[0]-x)*rect.width,(p[1]-y)*rect.height);if(d<distance){distance=d;best=i;}});
    if(best>=0&&distance<48){dragging=best;$('scanGrid').setPointerCapture(e.pointerId);e.preventDefault();}
  });
  $('scanGrid').addEventListener('pointermove',e=>{
    if(dragging===null||busy)return;
    const rect=$('scanGrid').getBoundingClientRect();corners[dragging]=[Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width)),Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height))];initialCandidates=[];renderGrid();
  });
  for(const type of ['pointerup','pointercancel'])$('scanGrid').addEventListener(type,()=>dragging=null);
  async function pick(source){
    if(busy)return;
    if(!globalThis.chessNative?.pickScanPhoto){error('Scan and Analyze is available in the iPhone app.');return;}
    const token=++generation;working(true,'Opening photo picker…');error();
    try{
      const selected=await globalThis.chessNative.pickScanPhoto(source);
      if(token!==generation)return;if(!selected){working(false);return;}
      encoded=selected.image;
      image=new Image();image.src='data:image/jpeg;base64,'+encoded;await image.decode();if(token!==generation)return;
      const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
      gray=rgbaToGray(ctx.getImageData(0,0,canvas.width,canvas.height).data,canvas.width,canvas.height);
      initialCandidates=[];
      if($('scanKind').value==='digital'){
        const detected=findChessboardCorners(gray);
        if(detected){const snapped=snapCorners(gray,detected);initialCandidates=[detected,snapped];corners=[[detected.x0/gray.width,detected.y0/gray.height],[detected.x1/gray.width,detected.y0/gray.height],[detected.x1/gray.width,detected.y1/gray.height],[detected.x0/gray.width,detected.y1/gray.height]].map(p=>p.map(v=>Math.max(0,Math.min(1,v))));}
        else corners=[[.1,.1],[.9,.1],[.9,.9],[.1,.9]];
      }else corners=selected.corners||[[.1,.1],[.9,.1],[.9,.9],[.1,.9]];
      $('scanPhoto').src=image.src;stage('Crop');renderGrid();working(false);
    }catch(e){if(token===generation){working(false);error(e.message||'This photo could not be opened.');}}
  }
  $('scanCamera').onclick=()=>pick('camera');$('scanLibrary').onclick=()=>pick('library');
  $('scanAnother').onclick=()=>{clear();stage('Choose');};
  async function read(){
    if(busy||!image)return;
    const token=++generation;
    try{
      checkedCorners(corners);working(true,'Reading the board…');error();
      let result;
      if($('scanKind').value==='digital'){
        // Rectangular screenshots only: physical photos use the perspective
        // pipeline. Two alignments are compared without hiding uncertainty.
        const candidates=initialCandidates.length?initialCandidates:[null];
        for(const box of candidates){
          const tiles=box?extractTiles(gray,box):boardToTiles(perspectiveBoard(gray,corners));
          const reply=await globalThis.chessNative.readScan({kind:'digital',tiles:Array.from(tiles)});if(token!==generation)return;
          const candidate=probsToPlacement(reply.probs);if(!result||candidate.meanConfidence>result.meanConfidence)result=candidate;
        }
      }else{
        const reply=await globalThis.chessNative.readScan({kind:'physical',image:encoded,corners});if(token!==generation)return;
        result=probsToPlacement(reply.probs);
      }
      if(token!==generation)return;
      draft=scanDraft(result.placement);palette='';
      $('scanTurn').value='';$('scanEp').value='-';$('scanHalfmove').value='0';$('scanFullmove').value='1';dialog.querySelectorAll('[data-scan-castle]').forEach(b=>b.checked=false);
      uncertainSquares=new Set(result.confidences.flatMap((p,i)=>p<.7?['abcdefgh'[i%8]+(Math.floor(i/8)+1)]:[]));
      stage('Review');renderReview();working(false);
    }catch(e){if(token===generation){working(false);error(e.message||'The board could not be read. Try a clearer photo.');}}
  }
  $('scanRead').onclick=read;
  function renderReview(){
    const board=$('scanBoard');board.replaceChildren();
    for(let rank=8;rank>=1;rank--)for(const file of 'abcdefgh'){
      const square=file+rank,p=draft.squares[square],button=document.createElement('button');button.type='button';button.dataset.scanSquare=square;button.className='square '+(('abcdefgh'.indexOf(file)+rank)%2?'dark':'light')+(uncertainSquares.has(square)?' uncertain':'');button.setAttribute('aria-label',square+' '+(p||'empty')+(uncertainSquares.has(square)?' — needs review':''));
      if(p){const img=document.createElement('img');img.src=pieceImage(api.state().settings.pieceSet,p===p.toUpperCase()?'w':'b',p);img.alt='';img.draggable=false;button.append(img);}
      button.onclick=()=>{if(!palette||draft.squares[square]===palette)delete draft.squares[square];else draft.squares[square]=palette;uncertainSquares.delete(square);draft.castling=[];dialog.querySelectorAll('[data-scan-castle]').forEach(b=>b.checked=false);$('scanEp').value='-';error();renderReview();};board.append(button);
    }
    const group=$('scanPalette');group.replaceChildren();
    for(const p of ['K','Q','R','B','N','P','k','q','r','b','n','p','']){
      const button=document.createElement('button');button.type='button';button.setAttribute('aria-pressed',String(palette===p));button.setAttribute('aria-label',p?((p===p.toUpperCase()?'White ':'Black ')+{k:'king',q:'queen',r:'rook',b:'bishop',n:'knight',p:'pawn'}[p.toLowerCase()]):'Erase');
      if(p){const img=document.createElement('img');img.src=pieceImage(api.state().settings.pieceSet,p===p.toUpperCase()?'w':'b',p);img.alt='';button.append(img);}else button.textContent='Erase';
      button.onclick=()=>{palette=p;renderReview();};group.append(button);
    }
  }
  $('scanRetry').onclick=()=>{stage('Crop');renderGrid();};
  $('scanAnalyze').onclick=()=>{
    if(!draft||busy)return;
    try{
      if(!$('scanTurn').value)throw Error('Choose which side moves next.');
      draft.turn=$('scanTurn').value;draft.castling=[...dialog.querySelectorAll('[data-scan-castle]:checked')].map(b=>b.dataset.scanCastle);
      draft.enPassant=$('scanEp').value.trim().toLowerCase()||'-';
      const half=Number($('scanHalfmove').value),full=Number($('scanFullmove').value);
      if(!Number.isInteger(half)||half<0||half>999999||!Number.isInteger(full)||full<1||full>999999)throw Error('Enter valid move counters.');
      if(!/^(-|[a-h][36])$/.test(draft.enPassant))throw Error('En passant must be - or a square on rank 3 or 6.');
      draft.halfmove=half;draft.fullmove=full;
      const fen=positionFromDraft(draft);
      if(!api.save())return;
      api.loadPosition(fen,'analysis');applied=true;dialog.close();api.toast('Scanned position opened in Analysis. Previous game saved.');
    }catch(e){error(e.message);$('scanError').scrollIntoView({block:'nearest'});}
  };
  return {open(){if(api.state().engineMatch?.tournamentId){api.toast('Finish or stop the tournament before scanning a position.');return;}clear();applied=false;stage('Choose');api.pauseForScan?.();api.open('scanDialog');}};
}
