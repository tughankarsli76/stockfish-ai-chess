import {installChessCom} from './chesscom.js';
import {installLichess} from './lichess.js';
import {Chess} from './vendor/chess.js';
const SOURCES={
 clipboard:{title:'From Clipboard',help:'Paste one PGN game or a FEN position, then choose Load Game.'},
 lichess:{title:'From Lichess',help:'Export a PGN from your Lichess game, then paste it here or choose the downloaded file.',url:'https://lichess.org/',link:'Open Lichess'},
 chesscom:{title:'From Chess.com',help:'Open your game on Chess.com and use Share to copy or download its PGN. Paste it here or choose the downloaded file.',url:'https://www.chess.com/games/archive',link:'Open Chess.com',guide:'https://support.chess.com/en/articles/8705305-how-do-i-get-a-pgn-of-my-game'},
 file:{title:'Email? Finder? Safari?',help:'Choose a PGN or FEN file saved from email, your file manager, or a browser. You can also paste game notation below.'}
};
export async function readGameFile(file){
 if(!file)throw Error('Choose a PGN or FEN file.');
 if(file.size>250000)throw Error('Please choose a single game under 250 KB.');
 const text=(await file.text()).replace(/^\uFEFF/,'').trim();
 if(!text)throw Error('This file is empty. Choose a PGN or FEN file.');
 return text;
}
export function installImportGame(api){
 const css=document.createElement('link');css.rel='stylesheet';css.href='chesscom.css';document.head.append(css);
 const importApi={...api,load:pgn=>{new Chess().loadPgn(pgn);document.getElementById('notation').value=pgn;document.getElementById('importForm').requestSubmit();}};
 const chesscom=installChessCom(importApi),lichess=installLichess(importApi);
 const $=id=>document.getElementById(id),menu=document.createElement('dialog');
 menu.id='importMenu';menu.className='action-sheet';menu.setAttribute('aria-label','Import Game');
 menu.innerHTML='<div class="list"><button type="button" data-import-source="clipboard">From Clipboard</button><button type="button" data-import-source="lichess">From Lichess</button><button type="button" data-import-source="chesscom">From Chess.com</button></div><button type="button" class="sheet-cancel" id="cancelImportMenu">Cancel</button>';
 document.body.append(menu);
 const dialog=$('importDialog');dialog.setAttribute('aria-labelledby','importTitle');dialog.querySelector('h2').id='importTitle';dialog.querySelector('p').id='importHelp';
 const controls=document.createElement('div');controls.className='import-source-actions';controls.innerHTML='<button type="button" id="pasteImport">Paste Clipboard</button><button type="button" id="chooseImportFile">Choose File</button><input type="file" id="importFile" accept=".pgn,.fen,.txt,application/x-chess-pgn,text/plain" hidden><a id="importSite" target="_blank" rel="noopener noreferrer" hidden></a><a id="importGuide" target="_blank" rel="noopener noreferrer" hidden>PGN help</a>';
 $('notation').before(controls);let revision=0;
 async function paste(){const token=++revision,original=$('notation').value;$('importError').textContent='';try{const text=await navigator.clipboard.readText();if(token!==revision||!dialog.open||$('notation').value!==original)return;if(!text.trim())throw Error('The clipboard is empty. Copy a PGN game or FEN position first.');if(text.length>250000)throw Error('Please paste a single game under 250 KB.');$('notation').value=text;$('notation').focus();}catch(error){if(token===revision&&dialog.open)$('importError').textContent=error.name==='NotAllowedError'||!navigator.clipboard?'Clipboard access is unavailable. Paste directly into the box below.':error.message;}}
 function source(key){const data=SOURCES[key];++revision;$('notation').value='';$('importFile').value='';$('importError').textContent='';$('importTitle').textContent=data.title;$('importHelp').textContent=data.help;$('importSite').hidden=!data.url;$('importGuide').hidden=!data.guide;if(data.url){$('importSite').href=data.url;$('importSite').textContent=data.link;}if(data.guide)$('importGuide').href=data.guide;api.open('importDialog');if(key==='clipboard')paste();}
 menu.querySelectorAll('[data-import-source]').forEach(button=>button.onclick=()=>button.dataset.importSource==='chesscom'?chesscom.open():button.dataset.importSource==='lichess'?lichess.open():source(button.dataset.importSource));
 $('cancelImportMenu').onclick=()=>menu.close();
 $('pasteImport').onclick=paste;
 $('chooseImportFile').onclick=async()=>{if(globalThis.chessNative){const token=++revision;try{const text=await globalThis.chessNative.pickGame();if(typeof text==='string'&&token===revision&&dialog.open)$('notation').value=text;}catch(error){if(token===revision&&dialog.open)$('importError').textContent=error.message;}return;}$('importFile').value='';$('importFile').click();};
 $('importFile').onchange=async()=>{const file=$('importFile').files[0];if(!file)return;const token=++revision,original=$('notation').value;$('importError').textContent='';try{const text=await readGameFile(file);if(token===revision&&dialog.open&&$('notation').value===original){$('notation').value=text;$('notation').focus();}}catch(error){if(token===revision&&dialog.open)$('importError').textContent=error.message;}};
 dialog.addEventListener('close',()=>++revision);
 return {open:()=>api.open('importMenu')};
}
