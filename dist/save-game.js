import {Chess} from './vendor/chess.js';

export const SAVE_FIELDS=['White','Black','Event','Site','Date','Round','Result','File Name'];
export function saveDefaults(game,players,now=new Date()){
 const headers=game.getHeaders(),known=value=>value&&value!=='?'&&value!=='????.??.??';
 const date=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('.');
 const result=game.isCheckmate()?(game.turn()==='w'?'0-1':'1-0'):game.isDraw()?'1/2-1/2':headers.Result||'*';
 return {White:known(headers.White)?headers.White:players.white,Black:known(headers.Black)?headers.Black:players.black,Event:headers.Event||'?',Site:headers.Site||'?',Date:known(headers.Date)?headers.Date:date,Round:headers.Round||'?',Result:result,'File Name':'My Games.pgn'};
}
export function prepareSavedGame(pgn,values){
 const game=new Chess();game.loadPgn(pgn);
 for(const key of SAVE_FIELDS.slice(0,7)){
  const value=String(values[key]||'').trim();
  if(/[\r\n\x00-\x1f"\\]/.test(value))throw Error(key+': use a single line without quotes or backslashes.');
  if(value.length>200)throw Error(key+' is too long.');
  if(key==='Result'&&!['*','1-0','0-1','1/2-1/2'].includes(value))throw Error('Choose a valid result.');
  if(key==='Date'&&!/^(\d{4}|\?{4})\.(\d{2}|\?{2})\.(\d{2}|\?{2})$/.test(value))throw Error('Use YYYY.MM.DD for the date.');
  game.setHeader(key,value||'?');
 }
 let fileName=String(values['File Name']||'').trim();
 if(!fileName||fileName.length>150||/[<>:"/\\|?*\x00-\x1f]/.test(fileName)||/[. ]$/.test(fileName)||/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(fileName))throw Error('Enter a valid file name, such as My Games.pgn.');
 if(!/\.pgn$/i.test(fileName))fileName+='.pgn';
 return {pgn:game.pgn(),fileName,white:game.getHeaders().White,black:game.getHeaders().Black,moves:game.history().length};
}

export function installSaveGame(api){
 const dialog=document.createElement('dialog');dialog.id='saveGameDialog';dialog.className='mode-screen save-game-screen';dialog.setAttribute('aria-label','Save Game');
 dialog.innerHTML='<div class="save-heading"><button type="button" id="cancelSaveGame">Cancel</button><button type="button" id="confirmSaveGame">Save</button></div><div class="save-details list"></div><div class="save-file list"></div><p class="error" id="saveGameError" role="alert"></p>';
 const editor=document.createElement('dialog');editor.id='saveFieldDialog';editor.className='mode-screen save-game-screen';editor.setAttribute('aria-labelledby','saveFieldTitle');
 editor.innerHTML='<form id="saveFieldForm"><div class="save-heading"><button type="button" id="cancelSaveField">Cancel</button><h2 id="saveFieldTitle"></h2><button type="submit">Done</button></div><label class="save-input-row"><span class="sr-only" id="saveFieldLabel"></span><input id="saveFieldInput" maxlength="200" aria-labelledby="saveFieldLabel" autocomplete="off"><select id="saveResultInput" aria-label="Result"><option value="*">* — In progress</option><option value="1-0">1-0 — White wins</option><option value="0-1">0-1 — Black wins</option><option value="1/2-1/2">1/2-1/2 — Draw</option></select></label></form>';
 document.body.append(dialog,editor);
 const $=id=>document.getElementById(id);let values,snapshot,field;
 const rows=new Map();
 for(const key of SAVE_FIELDS){const button=document.createElement('button');button.type='button';button.className='save-detail-row';button.dataset.saveField=key;const label=document.createElement('span'),value=document.createElement('span'),chevron=document.createElement('span');label.textContent=key;value.className='save-field-value';chevron.textContent='›';chevron.className='save-chevron';chevron.setAttribute('aria-hidden','true');button.append(label,value,chevron);dialog.querySelector(key==='File Name'?'.save-file':'.save-details').append(button);rows.set(key,value);button.onclick=()=>{field=key;$('saveFieldTitle').textContent=key;$('saveFieldLabel').textContent=key;$('saveFieldInput').hidden=key==='Result';$('saveResultInput').hidden=key!=='Result';$('saveFieldInput').value=values[key];$('saveResultInput').value=values.Result;api.open('saveFieldDialog');(key==='Result'?$('saveResultInput'):$('saveFieldInput')).focus();};}
 function render(){for(const [key,row] of rows)row.textContent=values[key]||'?';}
 $('cancelSaveGame').onclick=()=>dialog.close();
 $('cancelSaveField').onclick=()=>api.open('saveGameDialog');
 editor.addEventListener('cancel',event=>{event.preventDefault();api.open('saveGameDialog');});
 $('saveFieldForm').onsubmit=event=>{event.preventDefault();values[field]=field==='Result'?$('saveResultInput').value:$('saveFieldInput').value.trim();render();api.open('saveGameDialog');};
 $('confirmSaveGame').onclick=()=>{try{const entry=prepareSavedGame(snapshot.pgn,values);if(api.save({...entry,clock:snapshot.clock})){dialog.close();}}catch(error){$('saveGameError').textContent=error.message;}};
 return {open(){snapshot=api.snapshot();const game=new Chess();game.loadPgn(snapshot.pgn);values=saveDefaults(game,snapshot);$('saveGameError').textContent='';render();api.open('saveGameDialog');}};
}
