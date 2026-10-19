import {appendMoveRating} from './move-ratings.js';
import {installTournament} from './tournament.js';
import {installTablebases} from './tablebases.js';
import {installBenchmark} from './benchmark.js';
import {installHistoricalGames} from './historical-games.js';
import {installReleaseInfo} from './release-info.js';
import {LINE_COLORS} from './analysis.js';
import {timeResult} from './clock.js';
import {PIECE_SETS,pieceImage} from './pieces.js';
import {renderCapturedPieces} from './captured-pieces.js';
import {DIFFICULTIES,difficultyForLevel} from './difficulty.js';
import {installScanner} from './scan.js';
import {openingForPosition,bookSuggestions,FIGURINES} from './features.js';
import {DEFAULT_SETTINGS,ANALYSIS_TIMES,bookMoves,draftFromGame,positionFromDraft,safeAppLink,notation,timeLabel,whiteWdl} from './features.js';
const $=id=>document.getElementById(id);
function moveNotation(text,enabled,side){
  const label=document.createElement('span');
  if(!enabled){label.textContent=text;return label;}
  label.setAttribute('aria-label',text);
  for(const part of text.split(/([KQRBN])/)){
    if(!FIGURINES[part]){label.append(document.createTextNode(part));continue;}
    const piece=document.createElement('span');
    piece.className='notation-figurine '+(side==='w'?'white':'black');
    piece.textContent=FIGURINES[part];piece.setAttribute('aria-hidden','true');
    label.append(piece);
  }
  return label;
}
const labels={new:'Start Game',flip:'Flip Board',move:'Move Now',hint:'Hint'};
const boards={maple3:'Maple',wood:'Maple 1',walnut:'Walnut',honeywood:'Honey Wood',oak:'Oak',birch:'Birch',mahogany:'Mahogany',gray:'Gray',green:'Green',blue:'Blue',slate:'Slate',sand:'Sand',ocean:'Ocean',rosewood:'Rosewood',espresso:'Espresso',forest:'Forest',olive:'Olive',mint:'Mint',navy:'Navy',cobalt:'Cobalt',lavender:'Lavender',burgundy:'Burgundy',terracotta:'Terracotta',ivory:'Ivory',graphite:'Graphite'};
const spanish={'Animations':'Animaciones','Chess News':'Noticias de ajedrez','Computer Chess Rankings':'Clasificaciones de ajedrez por computadora','FIDE Chess Rankings':'Clasificaciones de ajedrez FIDE','Chess Coach':'Entrenador de ajedrez','Game':'Partida','Options':'Opciones','Done':'Listo','Cancel':'Cancelar','New Game':'Nueva partida','Save Game':'Guardar partida','Load Game':'Cargar partida','Import Game':'Importar partida','Export Game':'Exportar partida','Setup Position':'Configurar posición','Take Back':'Retroceder','Step Forward':'Avanzar','Start of Game':'Inicio de la partida','End of Game':'Final de la partida','Move List':'Lista de jugadas','Move Now':'Mover ahora','Analysis':'Análisis','Graph':'Gráfico','Game View':'Ver partida','Game Mode':'Modo de juego','Game Difficulty':'Dificultad','Use Toolbar':'Usar barra de herramientas','Show Coordinates':'Mostrar coordenadas','Show Legal Moves':'Mostrar jugadas legales','Show Last Move':'Mostrar última jugada','Show Arrows':'Mostrar flechas','Shortcut':'Acceso rápido','Board':'Tablero','Pieces':'Piezas','Show Analysis':'Mostrar análisis','Figurine Notation':'Notación con figuras','Use Opening Book':'Usar libro de aperturas','Use Win/Draw/Loss (WDL)':'Usar victoria/tablas/derrota (WDL)','Analysis Time':'Tiempo de análisis','Threads':'Hilos','HashTable':'Tabla hash','Tablebase':'Base de finales','Language':'Idioma','Your Name':'Tu nombre','Reset Everything':'Restablecer todo','Write Review':'Escribir reseña','Help & FAQ':'Ayuda y preguntas','Online Store':'Tienda en línea','Engine':'Motor','App Links':'Enlaces de la aplicación','Save Links':'Guardar enlaces','Start Game':'Iniciar partida','Flip Board':'Girar tablero','Hint':'Pista','Flip':'Girar','Move':'Jugada','More':'Más','Both Sides':'Ambos lados','Computer':'Computadora','Play As':'Jugar con','White':'Blancas','Black':'Negras','Beginner':'Principiante','Casual':'Casual','Average':'Medio','Strong':'Fuerte','Expert':'Experto','World Champion':'Campeón mundial','Default':'Predeterminado','Filled':'Relleno','Black perspective':'Perspectiva de negras','Maple':'Arce','Maple 1':'Arce 1','Walnut':'Nogal','Gray':'Gris','Green':'Verde','System':'Sistema','Forever':'Continuo','Clear Board':'Vaciar tablero','Starting Position':'Posición inicial','Side to move':'Turno','Castling rights':'Derechos de enroque','Use Position':'Usar posición','Connect Folder':'Conectar carpeta','Disconnect':'Desconectar','Player name':'Nombre del jugador','Save':'Guardar','Opponent':'Oponente','Computer move time':'Tiempo de la computadora','Playing strength':'Fuerza de juego','Board style':'Estilo de tablero','Graph style':'Estilo de gráfico','Top-right button':'Botón superior derecho','Tablebase folder':'Carpeta de finales','Restore Last Reset':'Restaurar último reinicio','Book':'Libro','Draw':'Tablas','You':'Tú','Finding the best moves…':'Buscando las mejores jugadas…','Connecting to Stockfish 19…':'Conectando con Stockfish 19…','Analyzing':'Analizando','Game over':'Fin de la partida','White to move':'Juegan blancas','Black to move':'Juegan negras','Starting position':'Posición inicial','En passant':'Al paso','Half-moves':'Medias jugadas','Move number':'Número de jugada'};
function toggler(id,text){return '<label><span>'+text+'</span><input id="'+id+'" type="checkbox"></label>';}
Object.assign(spanish,{'Sound':'Sonido','Haptics':'Respuesta háptica','Study':'Estudio','Classical & Legendary Games':'Partidas clásicas y legendarias'});
Object.assign(spanish,{'INCREMENTS':'INCREMENTOS'});
Object.assign(spanish,{'White is winning':'Las blancas están ganando','White is better':'Las blancas están mejor','White is slightly better':'Las blancas están ligeramente mejor','Equal position':'Posición igualada','White is slightly worse':'Las blancas están ligeramente peor','White is worse':'Las blancas están peor','White is losing':'Las blancas están perdiendo'});
Object.assign(spanish,{'Play White':'Jugar con blancas','Play Black':'Jugar con negras','Play Both':'Jugar ambos lados'});
Object.assign(spanish,{'Clear':'Vaciar','Coord':'Coord','Turn':'Turno','Black O-O-O':'Negras O-O-O','Black O-O':'Negras O-O','White O-O-O':'Blancas O-O-O','White O-O':'Blancas O-O'});
Object.assign(spanish,{'THREADS':'HILOS','Cpu / Threads Usage':'Uso de CPU / Hilos','Number of engine threads to use.':'Número de hilos que usará el motor.'});
Object.assign(spanish,{'HASHTABLE':'TABLA HASH','The hash table stores analyzed positions so Stockfish can reuse its search results. Larger hash tables can hold more positions and use more memory.':'La tabla hash guarda posiciones analizadas para que Stockfish pueda reutilizar sus resultados. Las tablas más grandes almacenan más posiciones y usan más memoria.'});
Object.assign(spanish,{'Setting the analysis time to Forever is not recommended as it would drain battery power considerably.':'No se recomienda analizar de forma continua, ya que consume mucha más batería.'});
Object.assign(spanish,{'Difficulty':'Dificultad','DIFFICULTY LEVELS':'NIVELES DE DIFICULTAD','Level':'Nivel','Easiest':'La más baja','Very High':'Muy alta','Full Strength':'Máxima fuerza'});
Object.assign(spanish,{'User Plays White':'El usuario juega con blancas','User Plays Black':'El usuario juega con negras','User Plays Both':'El usuario juega ambos lados','Fixed Time':'Tiempo fijo','GAME MODE':'MODO DE JUEGO','TIME CONTROL':'CONTROL DE TIEMPO','Unlimited thinking time':'Tiempo de reflexión ilimitado'});
Object.assign(spanish,{'Opening Book Variety':'Variedad del libro','Low':'Baja','Medium':'Media','High':'Alta'});
Object.assign(spanish,{'Think During My Turn (Permanent Brain)':'Pensar durante mi turno (cerebro permanente)'});
Object.assign(spanish,{'Captured Pieces':'Piezas capturadas','Captured by White':'Capturadas por las blancas','Captured by Black':'Capturadas por las negras','No captured pieces.':'No hay piezas capturadas.','Pawn':'Peón','Knight':'Caballo','Bishop':'Alfil','Rook':'Torre','Queen':'Dama'});
function row(id,text){return '<button id="'+id+'"><span>'+text+'</span><span class="option-value"><span id="'+id+'Value"></span><svg class="option-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m9 5 7 7-7 7"/></svg></span></button>';}
const OPTIONS='<div class="dialog-heading"><h2>Options</h2><button data-close>Done</button></div><div class="option-group list">'+row('modeButton','Game Mode')+row('difficultyButton','Game Difficulty')+toggler('chessCoach','Chess Coach')+row('optionsGameReviewButton','Game Review')+toggler('animations','Animations')+'</div><div class="option-group list">'+toggler('coordinates','Show Coordinates')+toggler('legalHints','Show Legal Moves')+toggler('lastMove','Show Last Move')+toggler('optionArrows','Show Arrows')+'</div><div class="option-group list">'+row('boardButton','Board')+row('piecesButton','Pieces')+toggler('sound','Sound')+toggler('haptics','Haptics')+'</div><div class="option-group list">'+toggler('showAnalysis','Show Analysis')+toggler('figurine','Figurine Notation')+toggler('openingBook','Use Opening Book')+row('bookVarietyButton','Opening Book Variety')+toggler('wdl','Use Win/Draw/Loss (WDL)')+'</div><p class="group-title">Engine</p><div class="list">'+row('engineMatchButton','Change Engine')+row('timeButton','Analysis Time')+row('threadsButton','Cpu / Threads Usage')+row('hashButton','HashTable')+row('tablebasesButton','Tablebases')+row('benchmarkButton','Stockfish Chess Benchmark')+'</div><p class="group-title">Study</p><div class="list">'+row('historicalGamesButton','Classical &amp; Legendary Games')+row('fideRankingsButton','FIDE Chess Rankings')+row('computerRankingsButton','Computer Chess Rankings')+row('chessNewsButton','Chess News')+'</div><div class="option-group list">'+row('languageButton','Language')+row('nameButton','Your Name')+row('resetButton','Reset Everything')+'</div><div class="option-group list centered"><button id="helpButton">Help &amp; FAQ</button><button data-release-info="support">Support</button><button data-link="review">Write Review</button></div>';
export function installMenus(api,html){
  document.body.insertAdjacentHTML('beforeend',html);
  document.body.insertAdjacentHTML('beforeend','<dialog id="bookVarietyDialog" class="mode-screen analysis-time-screen" aria-labelledby="bookVarietyTitle"><div class="mode-heading"><button id="bookVarietyBack"><span aria-hidden="true" class="back-chevron"></span><span>Options</span></button><h2 id="bookVarietyTitle">Opening Book Variety</h2></div><div class="analysis-time-choices" role="radiogroup" aria-labelledby="bookVarietyTitle">'+['low','medium','high'].map(value=>'<button type="button" class="analysis-time-choice" role="radio" aria-checked="false" data-book-variety="'+value+'"><span>'+value[0].toUpperCase()+value.slice(1)+'</span><span class="analysis-time-check" aria-hidden="true">✓</span></button>').join('')+'</div></dialog>');
  const installedEngines=globalThis.chessNative?.engines||[{id:'stockfish19',name:'Stockfish 19'}];
  for(const item of installedEngines){
    const option=document.createElement('option');option.value=item.id;option.textContent=item.name;$('activeEngine').append(option);
    const row=document.createElement('div');row.className='engine-match-installed';
    const name=document.createElement('strong');name.textContent=item.name;
    row.append(name);$('installedEngines').append(row);
  }
  $('activeEngine').onchange=()=>api.patch({engine:$('activeEngine').value});

  for(const id of ['matchWhiteEngine','matchBlackEngine'])for(const item of installedEngines){const option=document.createElement('option');option.value=item.id;option.textContent=item.name;$(id).append(option);}

  const varietyButtons=[...document.querySelectorAll('[data-book-variety]')];

  const analysisTimeButtons=ANALYSIS_TIMES.map(seconds=>{const button=document.createElement('button');button.type='button';button.className='analysis-time-choice';button.dataset.analysisSeconds=seconds;button.setAttribute('role','radio');button.setAttribute('aria-checked','false');const label=document.createElement('span');label.className='analysis-time-name';const check=document.createElement('span');check.className='analysis-time-check';check.setAttribute('aria-hidden','true');check.textContent='✓';button.append(label,check);$('analysisTimeChoices').append(button);return button;});
  const difficultyButtons=DIFFICULTIES.map(item=>{const button=document.createElement('button');button.type='button';button.className='difficulty-choice';button.dataset.difficulty=item.level;button.setAttribute('role','radio');button.setAttribute('aria-checked','false');const level=document.createElement('span');level.className='difficulty-level';level.textContent=item.title;const label=document.createElement('span');label.className='difficulty-name';label.textContent=item.label;const check=document.createElement('span');check.className='difficulty-check';check.setAttribute('aria-hidden','true');check.textContent='✓';button.append(level,label,check);$('difficultyChoices').append(button);return button;});
  $('gameMenu').classList.add('action-sheet');
  $('gameMenu').innerHTML='<div class="list"><button id="menuNew">New Game</button><button id="pauseEngineMatch" hidden>Pause Match</button><button id="stopEngineMatch" hidden>Stop Match</button><button id="saveButton">Save Game</button><button id="gamesButton">Load Game</button><button id="importButton">Import Game</button><button id="exportButton">Export Game</button><button id="setupButton">Setup Position</button><button id="scanButton">Scan and Analyze</button></div><button class="sheet-cancel" data-close>Cancel</button>';
  $('settingsDialog').classList.add('options-screen');$('settingsDialog').innerHTML=OPTIONS;
  const toolbar=document.createElement('nav');toolbar.id='mainToolbar';toolbar.className='main-toolbar';toolbar.setAttribute('aria-label','Chess toolbar');
  toolbar.innerHTML='<button id="toolbarGame">Game</button><button id="toolbarOptions">Options</button><button id="toolbarAnalysis">Analysis</button><button id="toolbarFlip">Flip</button><button id="toolbarMove">Move</button>';
  const toolbarButtons=[...toolbar.querySelectorAll('button')];
  const toolbarSelection=document.createElement('span');toolbarSelection.className='toolbar-selection';toolbarSelection.hidden=true;toolbarSelection.setAttribute('aria-hidden','true');toolbar.append(toolbarSelection);
  let selectedToolbar=toolbar.querySelector(api.state().tab==='analysis'?'#toolbarAnalysis':'#toolbarGame'),toolbarLayoutFrame=0;
  selectedToolbar.classList.add('active');
  function positionToolbarSelection(animate=false){
    const target=selectedToolbar.getBoundingClientRect(),bounds=toolbar.getBoundingClientRect();
    if(!target.width||!target.height)return;
    if(!animate)toolbarSelection.classList.remove('animated');
    const width=Math.max(44,target.width+8);
    toolbarSelection.style.width=width+'px';
    toolbarSelection.style.transform=`translate3d(${target.left-bounds.left-toolbar.clientLeft+(target.width-width)/2}px,${target.top-bounds.top-toolbar.clientTop+(target.height-30)/2}px,0)`;
    toolbarSelection.hidden=false;
    if(!animate){
      cancelAnimationFrame(toolbarLayoutFrame);
      toolbarLayoutFrame=requestAnimationFrame(()=>{toolbarSelection.classList.add('animated');toolbarLayoutFrame=0;});
    }
  }
  toolbar.addEventListener('click',event=>{
    const selected=event.target.closest('button');
    if(!selected||!toolbar.contains(selected)||selected.disabled)return;
    selectedToolbar=selected;
    for(const button of toolbarButtons)button.classList.toggle('active',button===selected);
    positionToolbarSelection(true);
  },true);
  document.querySelector('.app').append(toolbar);
  positionToolbarSelection();
  if(typeof ResizeObserver!=='undefined'){
    const observer=new ResizeObserver(()=>positionToolbarSelection());
    for(const element of [toolbar,...toolbarButtons])observer.observe(element);
  }
  window.addEventListener('resize',()=>positionToolbarSelection());
  toolbar.insertAdjacentHTML('beforebegin','<nav id="analysisMoveNav" class="analysis-move-nav" aria-label="Analysis move navigation" hidden><button id="analysisBack" type="button" aria-label="Previous move" disabled><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m15 5-7 7 7 7"/></svg></button><button id="analysisForward" type="button" aria-label="Next move" disabled><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m9 5 7 7-7 7"/></svg></button></nav>');
  $('analysisBack').onclick=()=>api.navigate(Math.max(0,api.state().session.cursor-1));
  $('analysisForward').onclick=()=>{const {session}=api.state();api.navigate(Math.min(session.length,session.cursor+1));};
  $('gamePanel').insertAdjacentHTML('afterbegin','<div id="gameInsights"></div>');
  document.querySelector('.status-line').insertAdjacentHTML('beforeend','<div id="matchResume" class="match-resume" hidden><button id="resumeMatch" type="button" class="primary">Resume Match</button></div>');
  $('analysisPanel').insertAdjacentHTML('beforeend','<div id="wdlSummary" class="wdl-summary"></div>');

  // Pointer taps activate only the right-hand control; keyboard activation stays available.
  const rightControlRows=['modeButton','difficultyButton','boardButton','piecesButton','optionsGameReviewButton','nameButton','bookVarietyButton','engineMatchButton','timeButton','threadsButton','hashButton','tablebasesButton','benchmarkButton','historicalGamesButton','fideRankingsButton','computerRankingsButton','chessNewsButton','languageButton','resetButton'];
  for(const id of rightControlRows){
    const button=$(id);button.classList.add('right-control-only');
    const control=button.querySelector('.option-value')||button.lastElementChild;control.classList.add('option-control');
    button.addEventListener('pointerdown',event=>{if(!control.contains(event.target))event.preventDefault();},true);
    button.addEventListener('click',event=>{if(event.detail!==0&&!control.contains(event.target)){event.preventDefault();event.stopImmediatePropagation();}},true);
  }
  for(const input of $('settingsDialog').querySelectorAll('input[type="checkbox"]')){
    const label=input.closest('label');label.classList.add('right-control-only');
    label.addEventListener('pointerdown',event=>{if(event.target!==input)event.preventDefault();},true);
    label.addEventListener('click',event=>{if(event.target!==input)event.preventDefault();},true);
  }
  let draft,palette='P',setupFlipped=false,setupCoordinates=true,limits={maxThreads:2,maxHashMB:64},hashSizes=[];
  const translations=[];
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){const node=walker.currentNode,text=node.textContent.trim();if(spanish[text])translations.push({node,text});}
  function language(){const s=api.state().settings;return s.language==='system'?(navigator.language.toLowerCase().startsWith('es')?'es':'en'):s.language;}
  function t(text){return language()==='es'?(spanish[text]||text):text;}
  function translate(){for(const {node,text} of translations)if(node.isConnected)node.textContent=t(text);document.documentElement.lang=language();}
  const open=id=>api.open(id),close=()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  const click=(id,fn)=>{$(id).onclick=fn;};
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
  document.querySelectorAll('[data-options-back]').forEach(b=>b.onclick=()=>open('settingsDialog'));
  const scanner=installScanner(api);
  click('scanButton',()=>scanner.open());
  installTournament(api);
  const tablebases=installTablebases(api);
  click('tablebasesButton',()=>tablebases.open());
  const benchmark=installBenchmark(api);
  click('benchmarkButton',()=>benchmark.open());
  const historicalGames=installHistoricalGames(api);
  click('historicalGamesButton',()=>historicalGames.open());
  click('computerRankingsButton',()=>window.open('https://computerchess.org.uk/4040/index.html','_blank','noopener,noreferrer'));
  click('chessNewsButton',()=>window.open('https://worldchess.com/news','_blank','noopener,noreferrer'));
  click('fideRankingsButton',()=>window.open('https://ratings.fide.com/top_lists.phtml?list=open','_blank','noopener,noreferrer'));
  const dialogs={engineMatchButton:'engineMatchDialog',bookVarietyButton:'bookVarietyDialog',modeButton:'modeDialog',difficultyButton:'difficultyDialog',boardButton:'boardDialog',piecesButton:'piecesDialog',timeButton:'analysisTimeDialog',threadsButton:'threadsDialog',hashButton:'hashDialog',languageButton:'languageDialog',nameButton:'nameDialog',helpButton:'helpDialog',resetButton:'resetDialog'};
  for(const [id,dialog] of Object.entries(dialogs))click(id,()=>{sync();open(dialog);});
  click('engineMatchBack',()=>open('settingsDialog'));

  function renderMatchTimeControl(){
    const timed=$('matchControl').value==='game';
    $('matchSecondsRow').hidden=timed;$('matchMinutesRow').hidden=!timed;
  }
  $('matchControl').onchange=renderMatchTimeControl;
  click('newEngineMatch',()=>{
    const {engineMatch:match,settings:s}=api.state();
    $('matchWhiteEngine').value=match?.white||installedEngines[0].id;
    $('matchBlackEngine').value=match?.black||(installedEngines[1]||installedEngines[0]).id;
    $('matchMoveTime').value=String(match?.seconds||5);
    $('matchControl').value=match&&(match.fixedTime??s.fixedTime)===false?'game':'move';
    $('matchGameMinutes').value=String(match?.gameMinutes||(match?s.gameMinutes:3));
    if(!$('matchGameMinutes').value)$('matchGameMinutes').value='3';
    renderMatchTimeControl();open('newEngineMatchDialog');
  });
  click('engineMatchSetupBack',()=>open('newDialog'));
  click('startEngineMatch',()=>api.startEngineMatch({white:$('matchWhiteEngine').value,black:$('matchBlackEngine').value,seconds:Number($('matchMoveTime').value),fixedTime:$('matchControl').value!=='game',gameMinutes:Number($('matchGameMinutes').value),increment:0}));
  click('pauseEngineMatch',()=>{if(api.state().engineMatch?.paused){close();api.resumeEngineMatch();}else api.pauseEngineMatch();});
  click('resumeMatch',()=>api.resumeEngineMatch());
  click('stopEngineMatch',()=>{close();api.stopEngineMatch();});

  click('modeBack',()=>open('settingsDialog'));
  click('analysisTimeBack',()=>open('settingsDialog'));
  click('bookVarietyBack',()=>open('settingsDialog'));
  varietyButtons.forEach((button,index)=>{
    button.onclick=()=>api.patch({bookVariety:button.dataset.bookVariety});
    button.onkeydown=event=>{let next;
      if(['ArrowDown','ArrowRight'].includes(event.key))next=(index+1)%3;
      else if(['ArrowUp','ArrowLeft'].includes(event.key))next=(index+2)%3;
      else if(event.key==='Home')next=0;else if(event.key==='End')next=2;else return;
      event.preventDefault();varietyButtons[next].click();varietyButtons[next].focus();
    };
  });
  click('threadsBack',()=>open('settingsDialog'));
  click('hashBack',()=>open('settingsDialog'));
  analysisTimeButtons.forEach((button,index)=>{button.onclick=()=>api.patch({time:Number(button.dataset.analysisSeconds)});button.onkeydown=e=>{let next;if(['ArrowDown','ArrowRight'].includes(e.key))next=(index+1)%analysisTimeButtons.length;else if(['ArrowUp','ArrowLeft'].includes(e.key))next=(index+analysisTimeButtons.length-1)%analysisTimeButtons.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=analysisTimeButtons.length-1;else return;e.preventDefault();analysisTimeButtons[next].click();analysisTimeButtons[next].focus();};});
  click('difficultyBack',()=>open('settingsDialog'));
  click('difficultyButton',()=>{sync();open('difficultyDialog');difficultyButtons.find(b=>b.getAttribute('aria-checked')==='true')?.scrollIntoView({block:'nearest'});});
  difficultyButtons.forEach((button,index)=>{button.onclick=()=>api.patch({level:button.dataset.difficulty});button.onkeydown=e=>{let next;if(['ArrowDown','ArrowRight'].includes(e.key))next=(index+1)%difficultyButtons.length;else if(['ArrowUp','ArrowLeft'].includes(e.key))next=(index+difficultyButtons.length-1)%difficultyButtons.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=difficultyButtons.length-1;else return;e.preventDefault();difficultyButtons[next].click();difficultyButtons[next].focus();};});
  const modeButtons=[...document.querySelectorAll('[data-player-mode]')];
  const chooseMode=b=>api.patch(b.dataset.playerMode==='both'?{opponent:'local'}:{opponent:'computer',side:b.dataset.playerMode});
  modeButtons.forEach((b,i)=>{b.onclick=()=>chooseMode(b);b.onkeydown=e=>{const direction=['ArrowDown','ArrowRight'].includes(e.key)?1:['ArrowUp','ArrowLeft'].includes(e.key)?-1:0;if(!direction)return;e.preventDefault();const next=modeButtons[(i+direction+modeButtons.length)%modeButtons.length];chooseMode(next);next.focus();};});
  $('fixedTime').onchange=()=>api.patch({fixedTime:$('fixedTime').checked});
  function modeTimeLabel(value,fixed){return fixed?(language()==='es'?value+' '+(Number(value)===1?'segundo':'segundos')+' por jugada':value+' '+(Number(value)===1?'second':'seconds')+' per move'):(language()==='es'?value+' minutos por partida':value+' minutes per game');}
  function renderModeTime(value,fixed){$('moveTimeLabel').textContent=modeTimeLabel(value,fixed);$('moveTime').setAttribute('aria-valuetext',modeTimeLabel(value,fixed));$('moveTime').style.setProperty('--time-progress',((value-(fixed?1:3))/(fixed?59:177)*100)+'%');}
  $('moveTime').oninput=()=>renderModeTime($('moveTime').value,api.state().settings.fixedTime!==false);
  $('moveTime').onchange=()=>api.patch({[api.state().settings.fixedTime!==false?'moveTime':'gameMinutes']:Number($('moveTime').value)});
  function renderIncrement(){const slider=$('increment'),label=modeTimeLabel(slider.value,true);$('incrementLabel').textContent=label;slider.setAttribute('aria-valuetext',label);slider.style.setProperty('--increment-progress',(Number(slider.value)/60*100)+'%');}
  $('increment').oninput=renderIncrement;
  $('increment').onchange=()=>api.patch({increment:Number($('increment').value)});
  function renderThreads(){
    const slider=$('threads'),total=Number(slider.max),p=limits.coreInfo?.performance,e=limits.coreInfo?.efficiency,spanish=language()==='es';
    $('threadsCount').textContent=slider.value;
    const known=Number.isInteger(p)&&Number.isInteger(e)&&p>0&&e>0&&p+e===total;
    $('threadsHelp').textContent=spanish?'Máximo detectado: '+total+' hilos. '+total+' núcleos en total.':'Detected maximum: '+total+' threads. '+total+' cores total.';
    if(known){
      const breakdown=document.createElement('span');breakdown.className='core-breakdown';
      breakdown.textContent=spanish?p+' de rendimiento + '+e+' de eficiencia.':p+' performance + '+e+' efficiency cores.';
      $('threadsHelp').append(document.createTextNode(' '),breakdown);
    }else $('threadsHelp').append(document.createTextNode(spanish?' Desglose de tipos de núcleo no disponible.':' Core-type breakdown unavailable.'));
    if(!globalThis.chessNative)$('threadsHelp').textContent=spanish?'Máximo detectado: '+total+' hilos.':'Detected maximum: '+total+' threads.';
    slider.style.setProperty('--threads-progress',(total>1?(Number(slider.value)-1)/(total-1)*100:0)+'%');
  }
  $('threads').oninput=renderThreads;
  $('threads').onchange=()=>api.patch({threads:Number($('threads').value)});
  function renderHash(){const slider=$('hash'),label=hashSizes[Number(slider.value)]+' MB';$('hashSize').textContent=label;$('hashHelp').textContent=limits.memoryMB?(language()==='es'?'RAM detectada: '+(limits.memoryMB/1024).toFixed(1)+' GB. Hash máximo: '+limits.maxHashMB+' MB. Se reserva memoria para el motor, la app e iOS.':'Detected RAM: '+(limits.memoryMB/1024).toFixed(1)+' GB. Hash limit: '+limits.maxHashMB+' MB. Memory is reserved for the engine, app and iOS.'):(language()==='es'?'Hash máximo: '+limits.maxHashMB+' MB.':'Hash limit: '+limits.maxHashMB+' MB.');slider.setAttribute('aria-valuetext',label);slider.style.setProperty('--hash-progress',(Number(slider.max)>0?Number(slider.value)/Number(slider.max)*100:0)+'%');}
  $('hash').oninput=renderHash;
  $('hash').onchange=()=>api.patch({hash:hashSizes[Number($('hash').value)]});
  click('toolbarGame',()=>{api.setTab('game');open('gameMenu');});click('toolbarOptions',()=>open('settingsDialog'));click('toolbarFlip',api.flip);click('toolbarMove',()=>open('moveMenu'));click('toolbarAnalysis',()=>{if(!api.state().settings.showAnalysis)api.patch({showAnalysis:true});api.toggleAnalysis();});
  click('menuNew',()=>open('newDialog'));click('saveButton',()=>api.openSave());click('gamesButton',()=>{api.renderSaved();open('gamesDialog');});click('importButton',()=>api.openImport());click('exportButton',()=>api.openExport());
  click('takeBack',()=>{close();api.takeBack();});click('stepForward',()=>{const s=api.state().session;api.navigate(Math.min(s.length,s.cursor+1));close();});click('startOfGame',()=>{api.navigate(0);close();});click('endOfGame',()=>{api.navigate(api.state().session.length);close();});
  click('moveNow',()=>{close();api.moveNow();});
  click('moveListButton',()=>{renderMoveList();open('moveListDialog');});
  const refreshCapturedPieces=()=>{const {session,settings}=api.state();renderCapturedPieces($('capturedPiecesList'),session,settings.pieceSet,t);};
  click('capturedPiecesButton',()=>{refreshCapturedPieces();open('capturedPiecesDialog');});
  for(const [id,tab] of [['showGameView','game'],['showAnalysisView','analysis'],['showGraphView','graph']])click(id,()=>{close();if(tab==='analysis'&&!api.state().settings.showAnalysis)api.patch({showAnalysis:true});api.setTab(tab);});

  click('copyFen',async()=>{try{await navigator.clipboard.writeText(api.state().session.position().fen());api.toast('Position copied.');}catch{api.toast('Clipboard is unavailable.');}});
  $('newGame').onclick=()=>{const shortcut=api.state().settings.shortcut;if(shortcut==='new')open('newDialog');if(shortcut==='flip')api.flip();if(shortcut==='move')api.moveNow();if(shortcut==='hint')api.hint();};
  $('animations').setAttribute('aria-description','Show the samurai celebration after a win.');
  const toggles={chessCoach:'chessCoach',animations:'animations',sound:'moveSound',haptics:'moveHaptics',coordinates:'coordinates',legalHints:'legalHints',lastMove:'lastMove',optionArrows:'analysisArrows',showAnalysis:'showAnalysis',figurine:'figurine',openingBook:'openingBook',wdl:'wdl'};
  for(const [id,key] of Object.entries(toggles))$(id).onchange=()=>api.patch({[key]:$(id).checked});
  for(const [id,key] of [['theme','theme'],['language','language']])$(id).onchange=()=>api.patch({[key]:$(id).value});
  document.querySelectorAll('[data-board]').forEach(b=>b.onclick=()=>api.patch({theme:b.dataset.board}));
  document.querySelectorAll('[data-piece-set]').forEach(b=>b.onclick=()=>api.patch({pieceSet:b.dataset.pieceSet}));
  click('applyName',()=>{api.patch({yourName:$('yourName').value.trim()});close();});
  function fillResourceOptions(){
    const s=api.state().settings;
    hashSizes=[...new Set([16,32,64,128,150,256,512,1024,2048,3000,4096,8192,16384,limits.maxHashMB,Number(s.hash)])].filter(n=>Number.isInteger(n)&&n>=1&&n<=limits.maxHashMB).sort((a,b)=>a-b);
    $('threads').max=limits.maxThreads;
    $('threads').value=s.threads;
    renderThreads();
    $('hash').max=hashSizes.length-1;
    $('hash').value=Math.max(0,hashSizes.indexOf(Number(s.hash)));
    renderHash();
  }
  fetch('/api/engine/info').then(r=>{if(!r.ok)throw Error('Engine limits unavailable');return r.json();}).then(info=>{limits={maxThreads:Math.max(1,Math.floor(Number(info.maxThreads)||1)),maxHashMB:Math.max(16,Math.floor(Number(info.maxHashMB)||64)),memoryMB:Number(info.memoryMB)||0,coreInfo:info.coreInfo||{}};$('threads').disabled=false;$('hash').disabled=false;fillResourceOptions();sync();}).catch(()=>{fillResourceOptions();sync();});
  installReleaseInfo(open,t);
  const defaultLinks={review:'https://apps.apple.com/app/id6817158025?action=write-review'};
  const linkLabels={review:'Write Review'};
  for(const [key,label] of Object.entries(linkLabels)){const field=document.createElement('label');field.className='field-label';field.textContent=label;const input=document.createElement('input');input.id='link-'+key;input.type=key==='email'?'email':'url';input.className='text-input';input.placeholder=key==='email'?'you@example.com':'https://';field.append(input);$('appLinksFields').append(field);}
  function fillLinks(){for(const key of Object.keys(linkLabels))$('link-'+key).value=api.state().settings.links?.[key]||defaultLinks[key]||'';}
  document.querySelectorAll('[data-link]').forEach(b=>b.onclick=()=>{const key=b.dataset.link,value=api.state().settings.links?.[key]||defaultLinks[key];if(!value){fillLinks();open('linksDialog');$('link-'+key).focus();return;}try{window.open(safeAppLink(value,key==='email'),'_blank','noopener,noreferrer');}catch(e){api.toast(e.message);}});
  click('applyLinks',()=>{const links={...api.state().settings.links};try{for(const key of Object.keys(linkLabels)){const value=$('link-'+key).value.trim();delete links[key];if(value){safeAppLink(value,key==='email');links[key]=value;}}api.patch({links});$('linksError').textContent='';close();api.toast('App links saved.');}catch(error){$('linksError').textContent=error.message;}});
  click('confirmReset',()=>{api.resetEverything($('keepRecovery').checked);close();});
  click('recoverReset',()=>{api.recoverReset();close();});
  function piecePath(piece){const color=piece===piece.toUpperCase()?'w':'b';return pieceImage(api.state().settings.pieceSet,color,piece);}
  function renderSetup(){
    const focused=document.activeElement,focusSquare=focused?.dataset?.setupSquare,focusPiece=focused?.dataset?.setupPiece;
    $('setupDialog').classList.toggle('setup-flipped',setupFlipped);
    $('setupBoardFrame').classList.toggle('with-coordinates',setupCoordinates);
    $('flipSetup').setAttribute('aria-pressed',String(setupFlipped));
    $('coordSetup').setAttribute('aria-pressed',String(setupCoordinates));
    $('setupPalette').replaceChildren();
    for(const piece of ['p','n','b','r','q','k','P','N','B','R','Q','K']){
      const b=document.createElement('button');b.type='button';b.dataset.setupPiece=piece;
      b.className=palette===piece?'selected':'';b.setAttribute('aria-pressed',String(palette===piece));
      b.setAttribute('aria-label','Choose '+t(piece===piece.toUpperCase()?'White':'Black')+' '+{k:'king',q:'queen',r:'rook',b:'bishop',n:'knight',p:'pawn'}[piece.toLowerCase()]);
      b.title='Select again to erase';
      const img=document.createElement('img');img.src=piecePath(piece);img.alt='';img.draggable=false;b.append(img);
      b.onclick=()=>{palette=palette===piece?'':piece;renderSetup();};$('setupPalette').append(b);
    }
    const files=(setupFlipped?'hgfedcba':'abcdefgh').split(''),ranks=setupFlipped?[1,2,3,4,5,6,7,8]:[8,7,6,5,4,3,2,1];
    $('setupRanks').replaceChildren(...ranks.map(rank=>{const label=document.createElement('span');label.textContent=rank;return label;}));
    $('setupFiles').replaceChildren(...files.map(file=>{const label=document.createElement('span');label.textContent=file;return label;}));
    $('setupBoard').replaceChildren();
    for(const rank of ranks)for(const file of files){
      const square=file+rank,piece=draft.squares[square],b=document.createElement('button');
      b.type='button';b.dataset.setupSquare=square;b.className='setup-square'+(('abcdefgh'.indexOf(file)+rank)%2===1?' dark':'');
      b.setAttribute('aria-label','Edit '+square+(piece?' '+piece:' empty'));
      if(piece){const img=document.createElement('img');img.src=piecePath(piece);img.alt='';img.draggable=false;b.append(img);}
      b.onclick=()=>{if(palette&&draft.squares[square]!==palette)draft.squares[square]=palette;else delete draft.squares[square];draft.enPassant='-';draft.halfmove=0;$('setupError').textContent='';renderSetup();};
      $('setupBoard').append(b);
    }
    if(focusSquare)$('setupBoard').querySelector('[data-setup-square="'+focusSquare+'"]')?.focus({preventScroll:true});
    if(focusPiece)$('setupPalette').querySelector('[data-setup-piece="'+focusPiece+'"]')?.focus({preventScroll:true});
  }
  function syncDraft(){
    $('setupTurnDisc').classList.toggle('black',draft.turn==='b');
    $('setupTurn').setAttribute('aria-label',language()==='es'?(draft.turn==='w'?'Juegan blancas. Cambiar a negras.':'Juegan negras. Cambiar a blancas.'):(draft.turn==='w'?'White to move. Switch to Black.':'Black to move. Switch to White.'));
    document.querySelectorAll('[data-castle]').forEach(c=>c.checked=draft.castling.includes(c.dataset.castle));
  }
  document.querySelectorAll('[data-castle]').forEach(c=>c.onchange=()=>{draft.castling=[...document.querySelectorAll('[data-castle]:checked')].map(input=>input.dataset.castle);$('setupError').textContent='';});
  click('setupButton',()=>{draft=draftFromGame(api.state().session.position());palette='P';setupFlipped=false;syncDraft();renderSetup();$('setupError').textContent='';open('setupDialog');});
  click('clearSetup',()=>{draft={squares:{},turn:'w',castling:[],enPassant:'-',halfmove:0,fullmove:1};syncDraft();renderSetup();$('setupError').textContent='';});
  click('flipSetup',()=>{setupFlipped=!setupFlipped;renderSetup();});
  click('coordSetup',()=>{setupCoordinates=!setupCoordinates;renderSetup();});
  click('setupTurn',()=>{draft.turn=draft.turn==='w'?'b':'w';draft.enPassant='-';draft.halfmove=0;syncDraft();$('setupError').textContent='';});
  click('applySetup',()=>{try{const fen=positionFromDraft(draft);if(!api.save())return;api.loadPosition(fen);close();api.toast('Position loaded. Previous game saved.');}catch(error){$('setupError').textContent=error.message;$('setupError').scrollIntoView({block:'nearest'});}});
  function renderMoveList(){const {session,settings}=api.state();$('fullMoveList').replaceChildren();if(!session.length){$('fullMoveList').textContent='No moves yet.';return;}for(const [i,m] of session.moves.entries()){const button=document.createElement('button');button.textContent=m.before.split(' ')[5]+(m.color==='w'?'. ':'… ')+notation(m.san,settings.figurine);button.className=session.cursor===i+1?'current':'';appendMoveRating(button,api.moveRating?.(m),true);button.onclick=()=>{api.navigate(i+1);close();};$('fullMoveList').append(button);}}
  function sync(){
    const {settings:s,session,tab}=api.state();
    $('activeEngine').value=s.engine||'stockfish19';
    const match=api.state().engineMatch,matching=s.opponent==='match'&&!!match;
    $('pauseEngineMatch').hidden=$('stopEngineMatch').hidden=!matching;
    $('pauseEngineMatch').textContent=match?.paused?'Resume Match':'Pause Match';
    $('pauseEngineMatch').disabled=session.game.isGameOver();
    $('matchResume').hidden=!matching||!match.paused||session.game.isGameOver()||api.state().clockExpired;
    $('newDialog').setAttribute('aria-label',t('New Game'));
    for(const [id,key] of Object.entries(toggles))$(id).checked=!!s[key];
    for(const [id,key] of [['theme','theme'],['language','language']])$(id).value=s[key];
    if(document.activeElement!==$('threads'))$('threads').value=s.threads;
    renderThreads();
    if(document.activeElement!==$('hash'))$('hash').value=Math.max(0,hashSizes.indexOf(Number(s.hash)));
    renderHash();
    analysisTimeButtons.forEach((button,index)=>{const seconds=Number(button.dataset.analysisSeconds),checked=seconds===Number(s.time),label=seconds===0?t('Forever')+' ∞':seconds+'s '+(language()==='es'?'por jugada':'per move');button.setAttribute('aria-checked',String(checked));button.tabIndex=checked?0:-1;button.querySelector('.analysis-time-name').textContent=label;});
    document.querySelectorAll('[data-board]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.board===s.theme)));
    const variety=['low','medium','high'].includes(s.bookVariety)?s.bookVariety:'medium';
    $('bookVarietyButtonValue').textContent=t(variety[0].toUpperCase()+variety.slice(1));
    varietyButtons.forEach(button=>{const checked=button.dataset.bookVariety===variety;button.setAttribute('aria-checked',String(checked));button.tabIndex=checked?0:-1;});
    const fullStrengthOnly=['reckless090','plenty800','pawn201','obsidian160'].includes(s.engine);
    $('difficultyButton').disabled=fullStrengthOnly;
    const difficulty=difficultyForLevel(s.level);
    difficultyButtons.forEach((button,index)=>{const item=DIFFICULTIES[index],checked=button.dataset.difficulty===difficulty.level;button.querySelector('.difficulty-level').textContent=t('Level')+' '+item.number;button.querySelector('.difficulty-name').textContent=t(item.label);button.setAttribute('aria-checked',String(checked));button.tabIndex=checked?0:-1;});
    const playerMode=s.opponent==='local'?'both':s.side;
    modeButtons.forEach(b=>{const checked=b.dataset.playerMode===playerMode;b.setAttribute('aria-checked',String(checked));b.tabIndex=checked?0:-1;});
    $('fixedTime').checked=s.fixedTime!==false;
    $('moveTime').disabled=false;
    $('moveTime').min=s.fixedTime!==false?1:3;$('moveTime').max=s.fixedTime!==false?60:180;
    if(document.activeElement!==$('moveTime'))$('moveTime').value=s.fixedTime!==false?s.moveTime:s.gameMinutes;
    renderModeTime($('moveTime').value,s.fixedTime!==false);
    $('incrementControl').hidden=s.fixedTime!==false;
    if(document.activeElement!==$('increment'))$('increment').value=s.increment;
    renderIncrement();
    if(document.activeElement!==$('yourName'))$('yourName').value=s.yourName||'';
    const values={modeButton:(s.opponent==='match'?'Engine Match':s.opponent==='local'?t('Both Sides'):t(s.side==='w'?'White':'Black'))+' · '+(s.opponent==='match'?match.seconds+'s':s.fixedTime===false?s.gameMinutes+' min + '+s.increment+'s':s.moveTime+'s'),difficultyButton:fullStrengthOnly?'Full strength':t('Level')+' '+difficulty.number+' · '+t(difficulty.label),boardButton:t(boards[s.theme]),piecesButton:(PIECE_SETS[s.pieceSet]||PIECE_SETS.classic).name,timeButton:t(timeLabel(s.time)),threadsButton:s.threads,hashButton:s.hash+' MB',languageButton:s.language==='system'?t('System'):s.language==='es'?'Español':'English',nameButton:s.yourName||t('You')};
    for(const [id,value] of Object.entries(values))$(id+'Value').textContent=value;
    document.body.classList.toggle('use-toolbar',s.useToolbar);
    $('analysisTab').hidden=true;
    $('toolbarAnalysis').setAttribute('aria-pressed',String(tab==='analysis'&&!api.state().analysisPaused));
    $('showAnalysisView').hidden=!s.showAnalysis;
    $('newGame').textContent={new:'＋',flip:'⇅',move:'▶',hint:'◇'}[s.shortcut]||'＋';$('newGame').setAttribute('aria-label',t(labels[s.shortcut]||'Start Game'));
    $('takeBack').disabled=session.cursor===0;$('stepForward').disabled=session.live;$('startOfGame').disabled=session.cursor===0;$('endOfGame').disabled=session.live;
    $('analysisMoveNav').hidden=tab!=='analysis';
    $('analysisMoveNav').setAttribute('aria-label',language()==='es'?'Navegación de jugadas del análisis':'Analysis move navigation');
    $('analysisBack').disabled=session.cursor===0;
    $('analysisForward').disabled=session.live;
    $('analysisBack').setAttribute('aria-label',language()==='es'?'Jugada anterior':'Previous move');
    $('analysisForward').setAttribute('aria-label',language()==='es'?'Jugada siguiente':'Next move');
    $('moveNow').disabled=!session.live||session.game.isGameOver();
    
    $('recoverReset').hidden=!localStorage.getItem('chess-preview-reset-backup');
    document.querySelectorAll('[data-piece-set]').forEach(b=>{const chosen=b.dataset.pieceSet===s.pieceSet;b.classList.toggle('chosen',chosen);b.setAttribute('aria-pressed',String(chosen));});
    translate();renderInsights();
    if($('capturedPiecesDialog').open)refreshCapturedPieces();
  }
  function renderInsights(){
    const {settings:s,session,analysis,analysisLines,analysisFen,clockExpired}=api.state(),position=session.position();
    const available=analysisFen===position.fen()?analysisLines:[],book=s.openingBook?bookSuggestions(position):[];
    const opening=book.length?openingForPosition(position,session.moves.slice(0,session.cursor).map(m=>m.before)):null;
    const timeout=session.live?timeResult(clockExpired):'',result=timeout||(position.isCheckmate()?api.status(position):'');
    $('gameInsights').classList.toggle('checkmate-result',!!result);
    $('gameInsights').hidden=!s.showAnalysis&&!result;
    $('gameInsights').replaceChildren();
    if(s.showAnalysis||result){
      const text=document.createElement('p');
      if(result)text.textContent=result;
      else if(book.length)book.slice(0,2).forEach((m,index)=>{
        if(index)text.append(document.createTextNode('   '));
        text.append(moveNotation(m.label,s.figurine,position.turn()));
      });
      else if(available.length){text.className='move-evaluations';available.slice(0,2).forEach((line,index)=>{
        if(index)text.append(document.createElement('br'));
        const move=document.createElement('span');
        const dot=document.createElement('span');dot.className='move-color-dot';
        dot.style.backgroundColor=LINE_COLORS[line.rank-1];dot.setAttribute('aria-hidden','true');
        const score=document.createElement('strong');score.className='move-score';score.dataset.scoreTone=line.scoreTone;
        score.textContent='('+line.evaluation+')';
        move.append(dot,document.createTextNode(position.moveNumber()+(position.turn()==='w'?'. ':'... ')),moveNotation(line.root,s.figurine,position.turn()),document.createTextNode(' '),score);
        text.append(move);
      });}
      else text.textContent=position.isGameOver()?api.status(position):'';
      if(book.length&&!result){
        const title=document.createElement('strong');title.textContent=t('Book');
        $('gameInsights').append(title);
        const name=document.createElement('p');name.className='opening-name';
        name.textContent=opening?opening.eco+': '+opening.name:t('Starting position');
        $('gameInsights').append(name);
      }
      $('gameInsights').append(text);
    }
    const wdl=!result&&s.wdl&&analysisFen===position.fen()?whiteWdl(analysis?.wdl,position.turn()):null;
    $('wdlSummary').hidden=!s.wdl;$('wdlSummary').textContent=wdl?t('White')+': '+wdl[0]+'% · '+t('Draw')+': '+wdl[1]+'% · '+t('Black')+': '+wdl[2]+'%':'';
    if(wdl&&s.showAnalysis){const p=document.createElement('p');p.className='wdl-inline';p.textContent=$('wdlSummary').textContent;$('gameInsights').append(p);}
  }
  fillResourceOptions();
  return {sync,renderInsights,t,refreshMoveList:()=>{if($('moveListDialog').open)renderMoveList();}};
}
