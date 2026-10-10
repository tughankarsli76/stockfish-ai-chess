export function createSchedule(engines,games,random=Math.random){
  if(new Set(engines).size!==engines.length||engines.length<2||!Number.isInteger(games)||games<1||games>10)throw Error('Choose at least two engines and 1–10 games against each other.');
  const schedule=[],reverseColors=random()<0.5;
  for(let round=0;round<games;round++)for(let a=0;a<engines.length;a++)for(let b=a+1;b<engines.length;b++){
    // Orient pairs around a circle so each engine's color totals differ by at most one.
    const aStartsWhite=b-a<=engines.length/2;
    let white=engines[aStartsWhite?a:b],black=engines[aStartsWhite?b:a];
    if((round%2===1)!==reverseColors)[white,black]=[black,white];
    schedule.push({white,black});
  }
  return schedule;
}
export function standings(t){
  const rows=t.engines.map(id=>({id,played:0,wins:0,draws:0,losses:0,points:0}));
  for(const game of t.results)for(const side of ['white','black']){const row=rows.find(r=>r.id===game[side]);row.played++;if(game.result==='1/2-1/2'){row.draws++;row.points+=.5;}else if(game.result===(side==='white'?'1-0':'0-1')){row.wins++;row.points++;}else row.losses++;}
  return rows.sort((a,b)=>b.points-a.points||b.wins-a.wins);
}
export function tournamentOutcome(t){
  if(!t||t.stopped||!t.schedule.length||t.results.length!==t.schedule.length)return null;
  const rows=standings(t);
  return {rows,winners:rows.filter(row=>row.points===rows[0].points),games:t.results.length};
}
export function installTournament(api){
  const $=id=>document.getElementById(id),engines=globalThis.chessNative?.engines||[{id:'stockfish19',name:'Stockfish 19'}];
  let tournament=null,nextAt=0;
  try{tournament=JSON.parse(localStorage.getItem('chess-preview-tournament')||'null');}catch{}
  const save=()=>localStorage.setItem('chess-preview-tournament',JSON.stringify(tournament));
  $('newEngineMatch').insertAdjacentHTML('afterend','<button id="newEngineTournament">Engine Tournament</button>');
  document.body.insertAdjacentHTML('beforeend',`<dialog id="tournamentDialog" class="mode-screen" aria-label="Engine Tournament"><div class="mode-heading"><button type="button" id="tournamentBack" aria-label="Back to New Game"><span aria-hidden="true" class="back-chevron"></span><span>Back</span></button><h2>Engine Tournament</h2></div><div class="tournament-content"><p>Select participating engines</p><div id="tournamentEngines" class="list"></div><div class="list"><label>Games against each other<select id="tournamentGames">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<option ${n===2?'selected':''}>${n}</option>`).join('')}</select></label><label>Time control<select id="tournamentControl"><option value="move">Time per move</option><option value="game">Time per game</option></select></label><label id="tournamentSecondsRow">Seconds per move<select id="tournamentSeconds">${[1,3,5,10,15,30,45,60,90,120].map(n=>`<option ${n===5?'selected':''}>${n}</option>`).join('')}</select></label><label id="tournamentMinutesRow" hidden>Minutes per engine<select id="tournamentMinutes">${[1,3,5,10,15,30,45,60,90,120].map(n=>`<option ${n===3?'selected':''}>${n}</option>`).join('')}</select></label></div><p id="tournamentSummary"></p><p>Starting colors are randomized and balanced across engines. Colors alternate each game per pairing. An even number gives equal games with each color.</p><p id="tournamentError" class="error" role="alert"></p><button id="startTournament" class="primary">Start Tournament</button><p id="tournamentProgress"></p><div id="tournamentStandings"></div><button id="viewTournamentResults" hidden>View Results</button><button id="resumeTournament">Resume Tournament</button><button id="stopTournament">Stop Tournament</button></div></dialog>`);
  document.body.insertAdjacentHTML('beforeend','<dialog id="tournamentResultsDialog" class="mode-screen" aria-labelledby="tournamentResultsTitle"><div class="mode-heading"><h2 id="tournamentResultsTitle">Tournament Results</h2><button type="button" id="tournamentResultsDone">Done</button></div><div class="tournament-content"><h3 id="tournamentWinner"></h3><p id="tournamentResultsSummary"></p><div id="tournamentFinalStandings"></div><p class="tournament-points-note">Win: 1 point · Draw: ½ point · Loss: 0 points</p></div></dialog>');
  for(const e of engines){const label=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.value=e.id;box.checked=true;label.append(document.createTextNode(e.name),box);$('tournamentEngines').append(label);}
  const selected=()=>[...$('tournamentEngines').querySelectorAll('input:checked')].map(x=>x.value);
  const name=id=>engines.find(e=>e.id===id)?.name||id;
  function render(){
    const count=selected().length,games=Number($('tournamentGames').value);$('tournamentSummary').textContent=`${count} engines · ${count*(count-1)/2*games||0} games total`;
    const timed=$('tournamentControl').value==='game';$('tournamentSecondsRow').hidden=timed;$('tournamentMinutesRow').hidden=!timed;
    $('resumeTournament').hidden=$('stopTournament').hidden=!tournament||tournament.stopped||tournament.results.length===tournament.schedule.length;
    $('tournamentProgress').textContent=tournament?`${tournament.stopped?'Stopped':tournament.results.length===tournament.schedule.length?'Completed':'Tournament'} · ${tournament.results.length} / ${tournament.schedule.length} games finished`:'';
    $('viewTournamentResults').hidden=!tournamentOutcome(tournament);
    renderStandings($('tournamentStandings'),tournament?standings(tournament):[]);
  }
  function renderStandings(target,rows){
    target.replaceChildren();if(!rows.length)return;
    const table=document.createElement('table');table.innerHTML='<thead><tr><th scope="col">Engine</th><th scope="col" aria-label="Wins">W</th><th scope="col" aria-label="Draws">D</th><th scope="col" aria-label="Losses">L</th><th scope="col">Points</th></tr></thead>';
    const body=document.createElement('tbody');
    for(const r of rows){const tr=document.createElement('tr');for(const v of [name(r.id),r.wins,r.draws,r.losses,r.points]){const td=document.createElement('td');td.textContent=v;tr.append(td);}body.append(tr);}
    table.append(body);target.append(table);
  }
  function showResults(){
    const outcome=tournamentOutcome(tournament);if(!outcome||api.state().celebrating)return;
    $('tournamentWinner').textContent=(outcome.winners.length===1?'Winner: ':'Joint winners: ')+outcome.winners.map(row=>name(row.id)).join(', ');
    $('tournamentResultsSummary').textContent=`Completed · ${outcome.games} / ${outcome.games} games finished`;
    renderStandings($('tournamentFinalStandings'),outcome.rows);
    api.open('tournamentResultsDialog');tournament.resultsShown=true;save();render();
  }
  $('viewTournamentResults').onclick=showResults;
  $('tournamentResultsDone').onclick=()=>$('tournamentResultsDialog').close();

  function launch(){const pair=tournament.schedule[tournament.results.length];api.startEngineMatch({...pair,...tournament.control,tournamentId:tournament.id,round:tournament.results.length+1});}
  $('newEngineTournament').onclick=()=>{api.open('tournamentDialog');render();};
  $('tournamentBack').onclick=()=>api.open('newDialog');
  $('tournamentDialog').oninput=render;
  $('startTournament').onclick=()=>{try{
    $('tournamentError').textContent='';
    const ids=selected(),schedule=createSchedule(ids,Number($('tournamentGames').value));
    const minutes=Number($('tournamentMinutes').value),seconds=Number($('tournamentSeconds').value);
    if(![1,3,5,10,15,30,45,60,90,120].includes(minutes)||![1,3,5,10,15,30,45,60,90,120].includes(seconds))throw Error('Choose a listed time control.');
    tournament={id:Date.now().toString(),engines:ids,schedule,results:[],control:{seconds,fixedTime:$('tournamentControl').value!=='game',gameMinutes:minutes,increment:0}};nextAt=0;save();launch();
  }catch(e){$('tournamentError').textContent=e.message;}};
  $('resumeTournament').onclick=()=>{const s=api.state();if(s.engineMatch?.tournamentId===tournament.id&&s.engineMatch.round===tournament.results.length+1){$('tournamentDialog').close();api.resumeEngineMatch();}else launch();};
  $('stopTournament').onclick=()=>{tournament.stopped=true;save();if(api.state().engineMatch?.tournamentId===tournament.id)api.stopEngineMatch();render();};
  setInterval(()=>{
    if(!tournament||tournament.stopped)return;
    const s=api.state(),match=s.engineMatch;
    if(s.settings.opponent!=='match'||match?.tournamentId!==tournament.id||s.suspended||document.hidden||document.querySelector('dialog[open]'))return;
    if(tournament.results.length>=tournament.schedule.length){if(!tournament.resultsShown)showResults();return;}
    if(match.round===tournament.results.length+1&&(s.session.game.isGameOver()||s.clockExpired)){
      const g=s.session.game,result=s.clockExpired?(s.clockExpired==='w'?'0-1':'1-0'):g.isCheckmate()?(g.turn()==='w'?'0-1':'1-0'):'1/2-1/2';
      tournament.results.push({...tournament.schedule[tournament.results.length],result,pgn:(g.setHeader('Result',result),g.pgn())});save();nextAt=Date.now()+4000;
      if(tournament.results.length===tournament.schedule.length){showResults();return;}
    }
    if(!match.paused&&match.round===tournament.results.length&&Date.now()>=nextAt)launch();
  },500);
}
