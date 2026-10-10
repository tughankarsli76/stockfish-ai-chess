import {HISTORICAL_GAMES} from './historical-games-data.js';

const ERAS=['Early chess','Romantic era','Champions','Human vs computer'];
const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function findHistoricalGames(query='',era='all',games=HISTORICAL_GAMES){
 const terms=normalize(query).trim().split(/\s+/).filter(Boolean);
 return games.filter(game=>(era==='all'||game.era===era)&&terms.every(term=>normalize([game.title,game.white,game.black,game.year,game.event,game.summary].join(' ')).includes(term)));
}

export function installHistoricalGames(api){
 const css=document.createElement('link');css.rel='stylesheet';css.href='historical-games.css';document.head.append(css);
 const library=document.createElement('dialog');library.id='historicalGamesDialog';library.className='mode-screen historical-games-screen';library.setAttribute('aria-labelledby','historicalGamesTitle');
 library.innerHTML='<div class="mode-heading historical-heading"><button type="button" id="historicalGamesBack"><span class="back-chevron" aria-hidden="true"></span><span>Options</span></button><h2 id="historicalGamesTitle">Classical &amp; Legendary Games</h2></div><div class="historical-search"><label for="historicalSearch">Search games</label><input type="search" id="historicalSearch" placeholder="Player, game, or year" autocomplete="off"><label for="historicalEra">Browse</label><select id="historicalEra"></select></div><p id="historicalCount" class="historical-count" role="status"></p><div id="historicalGamesList" class="historical-games-list"></div>';
 const detail=document.createElement('dialog');detail.id='historicalGameDialog';detail.className='mode-screen historical-game-screen';detail.setAttribute('aria-labelledby','historicalGameTitle');
 detail.innerHTML='<div class="mode-heading historical-heading"><button type="button" id="historicalDetailBack"><span class="back-chevron" aria-hidden="true"></span><span>Games</span></button><h2 id="historicalGameTitle"></h2></div><div class="historical-game-info"><p id="historicalPlayers"></p><p id="historicalEvent"></p><span id="historicalResult" class="historical-result"></span></div><div class="historical-context"><p id="historicalSummary"></p><button type="button" id="historicalAnalyze" class="primary">Analyze this game</button><p class="historical-analysis-help">Opens the full game in Analysis. Your current game is kept in Load Game.</p><p id="historicalLoadError" class="error" role="alert"></p></div>';
 document.body.append(library,detail);
 const $=id=>document.getElementById(id);
 let current=null;
 const spanish={'Options':'Opciones','Games':'Partidas','Classical & Legendary Games':'Partidas clásicas y legendarias','Search games':'Buscar partidas','Player, game, or year':'Jugador, partida o año','Browse':'Explorar','All games':'Todas las partidas','Early chess':'Ajedrez antiguo','Romantic era':'Época romántica','Champions':'Campeones','Human vs computer':'Humano contra computadora','Analyze this game':'Analizar esta partida','Opens the full game in Analysis. Your current game is kept in Load Game.':'Abre la partida completa en Análisis. Tu partida actual se conserva en Cargar partida.'};
 const language=()=>{const value=api.state().settings.language;return value==='system'?(navigator.language.toLowerCase().startsWith('es')?'es':'en'):value;};
 const t=value=>language()==='es'?(spanish[value]||value):value;
 function translate(){
  $('historicalGamesTitle').textContent=t('Classical & Legendary Games');
  $('historicalGamesBack').lastElementChild.textContent=t('Options');$('historicalDetailBack').lastElementChild.textContent=t('Games');
  for(const [id,key] of [['historicalSearch','Search games'],['historicalEra','Browse']])document.querySelector('label[for="'+id+'"]').textContent=t(key);
  $('historicalSearch').placeholder=t('Player, game, or year');
  $('historicalAnalyze').textContent=t('Analyze this game');
  detail.querySelector('.historical-analysis-help').textContent=t('Opens the full game in Analysis. Your current game is kept in Load Game.');
  const selected=$('historicalEra').value||'all';$('historicalEra').replaceChildren();
  for(const era of ['all',...ERAS]){const option=document.createElement('option');option.value=era;option.textContent=t(era==='all'?'All games':era);$('historicalEra').append(option);}
  $('historicalEra').value=selected;
 }
 function renderList(){
  const games=findHistoricalGames($('historicalSearch').value,$('historicalEra').value);
  $('historicalCount').textContent=language()==='es'?games.length+' partidas · Colección sin conexión':games.length+' games · Offline collection';
  const list=$('historicalGamesList');list.replaceChildren();
  if(!games.length){const empty=document.createElement('p');empty.className='historical-empty';empty.textContent=language()==='es'?'No hay partidas. Prueba otro jugador o año.':'No games found. Try another player or year.';list.append(empty);return;}
  for(const game of games){
   const button=document.createElement('button');button.type='button';button.className='historical-game-row';
   const text=document.createElement('span'),title=document.createElement('strong'),players=document.createElement('span'),meta=document.createElement('small'),arrow=document.createElement('span');
   title.textContent=game.title;players.textContent=game.white+' — '+game.black;meta.textContent=game.year+' · '+t(game.era);arrow.textContent='›';arrow.className='historical-chevron';arrow.setAttribute('aria-hidden','true');
   text.append(title,players,meta);button.append(text,arrow);button.onclick=()=>openGame(game);list.append(button);
  }
 }
 function openGame(game){
  try{current=game;
   $('historicalGameTitle').textContent=game.title;$('historicalPlayers').textContent=game.white+' — '+game.black;$('historicalEvent').textContent=game.event+' · '+game.year;
   const result=game.result==='1-0'?'White wins':game.result==='0-1'?'Black wins':'Draw';$('historicalResult').textContent=game.result+' · '+(language()==='es'?({'White wins':'Ganan blancas','Black wins':'Ganan negras','Draw':'Tablas'}[result]):result);
   $('historicalSummary').textContent=game.summary;$('historicalLoadError').textContent='';
   api.open('historicalGameDialog');detail.scrollTop=0;
  }catch{api.toast('This historical game could not be opened.');}
 }
 $('historicalGamesBack').onclick=()=>api.open('settingsDialog');$('historicalDetailBack').onclick=()=>api.open('historicalGamesDialog');
 $('historicalSearch').oninput=renderList;$('historicalEra').onchange=renderList;
 $('historicalAnalyze').onclick=()=>{const result=api.loadHistoricalGame(current.pgn);$('historicalLoadError').textContent=result?.error||'';};
 library.addEventListener('cancel',event=>{event.preventDefault();api.open('settingsDialog');});detail.addEventListener('cancel',event=>{event.preventDefault();api.open('historicalGamesDialog');});
 return {open(){translate();renderList();api.open('historicalGamesDialog');}};
}
