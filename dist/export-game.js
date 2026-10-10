export function installExportGame(api){
 const menu=document.createElement('dialog');menu.id='exportMenu';menu.className='action-sheet';menu.setAttribute('aria-label','Export Game');
 menu.innerHTML='<div class="list"><button type="button" id="exportFile">Export File</button><button type="button" id="copyExportGame">Copy Game</button><button type="button" id="copyExportPosition">Copy Position</button></div><button type="button" class="sheet-cancel" id="cancelExportMenu">Cancel</button>';
 const fallback=document.createElement('dialog');fallback.id='exportCopyDialog';fallback.setAttribute('aria-labelledby','exportCopyTitle');
 fallback.innerHTML='<div class="dialog-heading"><h2 id="exportCopyTitle">Copy Game</h2><button type="button" id="closeExportCopy">Done</button></div><p>Clipboard access is unavailable. Select and copy the text below.</p><textarea id="exportCopyText" aria-label="Export notation" readonly rows="8"></textarea>';
 document.body.append(menu,fallback);
 const $=id=>document.getElementById(id);let revision=0;
 menu.addEventListener('close',()=>++revision);
 $('cancelExportMenu').onclick=()=>menu.close();
 $('closeExportCopy').onclick=()=>fallback.close();
 $('exportFile').onclick=()=>{api.exportFile();menu.close();};
 async function copy(position){
  const token=++revision,text=position?api.position():api.game();
  try{await navigator.clipboard.writeText(text);if(token!==revision||!menu.open)return;menu.close();api.toast(position?'Position copied as FEN.':'Game copied as PGN.');}
  catch{if(token!==revision||!menu.open)return;$('exportCopyTitle').textContent=position?'Copy Position':'Copy Game';$('exportCopyText').value=text;api.open('exportCopyDialog');$('exportCopyText').focus();$('exportCopyText').select();}
 }
 $('copyExportGame').onclick=()=>copy(false);
 $('copyExportPosition').onclick=()=>copy(true);
 return {open:()=>api.open('exportMenu')};
}
