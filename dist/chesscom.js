const BASE='https://api.chess.com/pub/player/';
const KEY='chesscom-import-v1';
const SUGGESTED=[['hikaru','Hikaru Nakamura'],['gothamchess','Levy Rozman'],['magnuscarlsen','Magnus Carlsen'],['AlexandraBotez','Alexandra Botez']];
export function username(value){
 const name=String(value||'').trim();
 if(!/^[a-z0-9_-]{2,25}$/i.test(name))throw Error('Enter a Chess.com username (2–25 letters, numbers, underscores or hyphens).');
 return name;
}
export async function recentGames(name,{signal,fetcher=fetch}={}){
 const user=username(name).toLowerCase();
 const data=await request(BASE+user+'/games/archives',signal,fetcher);
 if(!Array.isArray(data.archives))throw Error('Chess.com returned an unreadable game archive.');
 const archives=data.archives.filter(url=>typeof url==='string'&&url.startsWith(BASE+user+'/games/')&&/\/\d{4}\/\d{2}$/.test(url)).sort().reverse();
 const games=[];
 for(const url of archives.slice(0,12)){
  const month=await request(url,signal,fetcher);
  if(!Array.isArray(month.games))throw Error('Chess.com returned an unreadable game list.');
  games.push(...month.games.filter(g=>g.rules==='chess'&&typeof g.pgn==='string'&&g.pgn.length<=250000));
  if(games.length>=30)break;
 }
 return games.sort((a,b)=>(b.end_time||0)-(a.end_time||0)).slice(0,30);
}
async function request(url,signal,fetcher=fetch){
 const response=await fetcher(url,{signal:AbortSignal.any([signal||new AbortController().signal,AbortSignal.timeout(20000)]),credentials:'omit'});
 if(!response.ok)throw Error(response.status===404?'Player not found. Check the username.':response.status===429?'Chess.com is busy. Please try again shortly.':'Chess.com could not load this data. Please try again.');
 return response.json();
}
export function installChessCom(api){return installAccountImport(api,{name:'Chess.com',id:'chesscomDialog',key:KEY,suggested:SUGGESTED,validate:username,games:recentGames,profile:(name,signal)=>request(BASE+name.toLowerCase(),signal),emptyMessage:'No standard chess games found in the latest 12 available months.'});}
export function installAccountImport(api,provider){
 const {name:site,id,key:storageKey,suggested:players,validate:validateUsername,games:loadGames,profile:loadProfile,emptyMessage}=provider;
 const sheet=document.createElement('dialog');sheet.id=id;sheet.className='chesscom-screen';sheet.setAttribute('aria-label',site);document.body.append(sheet);
 let state={username:'',favourites:[]},controller,screen='home';
 const profiles=new Map();
 function restore(){try{const data=JSON.parse(localStorage.getItem(storageKey)||'{}');state={username:typeof data.username==='string'?data.username:'',favourites:Array.isArray(data.favourites)?data.favourites.filter(n=>typeof n==='string'&&/^[a-z0-9_-]{2,30}$/i.test(n)).slice(0,50):[]};}catch{}}
 function save(){try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{message('Could not save preferences in this browser.');}}
 function element(tag,text,className){const el=document.createElement(tag);if(text)el.textContent=text;if(className)el.className=className;return el;}
 function button(text,action,className){const el=element('button',text,className);el.type='button';el.onclick=action;return el;}
 function begin(title,left='Cancel',action=()=>sheet.close()){
  controller?.abort();controller=new AbortController();sheet.replaceChildren();
  const header=element('div',null,'cc-heading');header.append(button(left,action),element('h2',title));sheet.append(header);return header;
 }
 function message(text){let el=sheet.querySelector('.cc-message');if(!el){el=element('p',null,'cc-message');el.setAttribute('role','status');sheet.append(el);}el.textContent=text;}
 function section(title){sheet.append(element('h3',title,'cc-section'));const list=element('div',null,'cc-list');sheet.append(list);return list;}
 function row(label,value,action){const el=button('',action,'cc-row');el.append(element('span',label),element('span',value,'cc-value'),element('span','›','cc-chevron'));return el;}
 function playerRow(name,label){
  const el=button('',()=>load(name),'cc-row cc-player');const avatar=element('span',label.split(' ').map(n=>n[0]).slice(0,2).join(''),'cc-avatar');
  const text=element('span',null,'cc-player-text');text.append(element('span',label),element('small',name));el.append(avatar,text,element('span','›','cc-chevron'));el.dataset.player=name;
  const profile=profiles.get(name.toLowerCase());if(profile)decorate(el,profile,label);return el;
 }
 function decorate(el,profile,label){
  el.querySelector('.cc-player-text>span').textContent=[profile.title,label].filter(Boolean).join(' ');
  if(typeof profile.avatar==='string'&&/^https:\/\//.test(profile.avatar)){
   const img=element('img');img.alt='';img.src=profile.avatar;img.referrerPolicy='no-referrer';img.onerror=()=>img.remove();el.querySelector('.cc-avatar').append(img);
  }
 }
 async function hydrate(token){
  for(const [name,label] of [...players,...state.favourites.map(n=>[n,n])]){
   if(token.aborted)return;
   if(profiles.has(name.toLowerCase()))continue;
   try{const data=await loadProfile(name,token);if(token.aborted)return;profiles.set(name.toLowerCase(),data);for(const el of sheet.querySelectorAll('[data-player]'))if(el.dataset.player===name)decorate(el,data,label);}catch{if(token.aborted)return;}
  }
 }
 function home(){
  screen='home';const header=begin(site);const add=button('+',()=>edit(true),'cc-add');add.setAttribute('aria-label','Add favourite player');header.append(add);
  const account=section(site.toUpperCase()+' ACCOUNT');account.append(row('Username',state.username||'Enter username',()=>edit(false)),row('Load Recent Games','',()=>state.username?load(state.username):edit(false,true)));
  const suggested=section('SUGGESTED PLAYERS');for(const [name,label] of players)suggested.append(playerRow(name,label));
  const favourites=section('FAVOURITE PLAYERS');
  if(!state.favourites.length)favourites.append(element('p','Tap + to save players you follow for quick imports.','cc-help'));
  for(const name of state.favourites){const wrap=element('div',null,'cc-favourite');const remove=button('−',()=>{state.favourites=state.favourites.filter(n=>n!==name);save();home();},'cc-remove');remove.setAttribute('aria-label','Remove '+name+' from favourites');wrap.append(playerRow(name,name),remove);favourites.append(wrap);}
  hydrate(controller.signal);
 }
 function edit(favourite,loadAfter=false){
  screen='edit';const header=begin(favourite?'Add Favourite':'Username','Cancel',home);const form=element('form');const label=element('label',site+' username','cc-input');const input=element('input');input.name='username';input.setAttribute('aria-label',site+' username');input.autocomplete='off';input.autocapitalize='none';input.spellcheck=false;input.maxLength=site==='Lichess'?30:25;input.value=favourite?'':state.username;label.append(input);form.append(label);sheet.append(form);
  header.append(button('Save',()=>form.requestSubmit()));form.onsubmit=e=>{e.preventDefault();try{const value=validateUsername(input.value);if(favourite){if(state.favourites.length>=50)throw Error('You can save up to 50 favourites.');if(!state.favourites.some(n=>n.toLowerCase()===value.toLowerCase()))state.favourites.push(value);}else state.username=value;save();if(loadAfter)load(value);else home();}catch(error){message(error.message);}};input.focus();
 }
 async function load(name){
  screen='games';begin(name,'‹ Back',home);section('RECENT GAMES');message('Loading recent games…');const token=controller.signal;
  try{
   const games=await loadGames(name,{signal:token});if(token.aborted||!sheet.open)return;
   message(games.length?'Choose a game to import.':emptyMessage);
   const list=sheet.querySelector('.cc-list');
   for(const game of games){const white=game.white?.username||'White',black=game.black?.username||'Black';const result=game.pgn.match(/\[Result "([^"]+)"\]/)?.[1]||'*';const el=button('',()=>{try{api.load(game.pgn);sheet.close();}catch(error){message('Could not import this game. '+error.message);}},'cc-row cc-game');const text=element('span');text.append(element('span',white+' — '+black),element('small',new Date((game.end_time||0)*1000).toLocaleDateString()+' · '+(game.time_class||'Chess')+' · '+result));el.append(text,element('span','›','cc-chevron'));list.append(el);}
  }catch(error){if(token.aborted)return;message(error.name==='TypeError'||error.name==='TimeoutError'?'Could not connect to '+site+'. Check your internet connection and try again.':error.message);sheet.append(button('Try Again',()=>load(name),'cc-retry'));}
 }
 sheet.addEventListener('close',()=>controller?.abort());
 return {open(){restore();api.open(sheet.id);home();}};
}
