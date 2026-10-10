import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {GameSession} from '../dist/model.js';
import {Chess} from '../dist/vendor/chess.js';
import {HISTORICAL_GAMES} from '../dist/historical-games-data.js';
import {findHistoricalGames} from '../dist/historical-games.js';

test('every historical game has complete legal notation and its published result',()=>{
  assert.ok(HISTORICAL_GAMES.length>0);
  assert.equal(new Set(HISTORICAL_GAMES.map(entry=>entry.id)).size,HISTORICAL_GAMES.length);
  for(const entry of HISTORICAL_GAMES){
    const strict=new Chess();
    assert.doesNotThrow(()=>strict.loadPgn(entry.pgn,{strict:true}),entry.title);
    const session=new GameSession();
    assert.doesNotThrow(()=>session.load(entry.pgn),entry.title);
    assert.ok(session.length>0,entry.title);
    assert.ok(Number.isInteger(entry.expectedPlies)&&entry.expectedPlies>0,entry.title);
    assert.equal(session.length,entry.expectedPlies,entry.title);
    assert.equal(session.game.fen(),entry.finalFen,entry.title);
    const headers=session.game.getHeaders();
    assert.equal(headers.White,entry.white,entry.title);
    assert.equal(headers.Black,entry.black,entry.title);
    assert.equal(headers.Result,entry.result,entry.title);
    assert.equal(headers.Date,entry.date,entry.title);
    assert.ok(entry.sources.length>0,entry.title);
    for(const source of entry.sources)assert.equal(new URL(source.url).protocol,'https:',entry.title);
  }
});

test('the expanded collection includes multiple games from the requested legends',()=>{
  assert.equal(HISTORICAL_GAMES.length,100);
  for(const player of ['Kasparov','Karpov','Tal','Carlsen','Fischer','Anand','Capablanca']){
    const name=new RegExp('\\b'+player+'\\b','i');
    assert.ok(HISTORICAL_GAMES.filter(entry=>name.test(entry.white+' '+entry.black)).length>=2,player+' needs multiple games');
  }
  const scores=HISTORICAL_GAMES.map(entry=>{
    const game=new Chess();game.loadPgn(entry.pgn,{strict:true});
    return game.history().join(' ');
  });
  assert.equal(new Set(scores).size,scores.length,'The collection must not repeat the same game');
});

test('the hundred-game collection spans older classics and recent players',()=>{
  assert.ok(HISTORICAL_GAMES.filter(game=>game.year<1900).length>=10);
  assert.ok(HISTORICAL_GAMES.filter(game=>game.year>=1900&&game.year<2000).length>=35);
  assert.ok(HISTORICAL_GAMES.filter(game=>game.year>=2000).length>=40);
  for(const year of [2024,2025,2026])assert.ok(findHistoricalGames(String(year)).length>=3,String(year));
  for(const player of ['Gaprindashvili','Chiburdanidze','Hou Yifan','Gukesh','Praggnanandhaa','Erdogmus']){
    assert.ok(findHistoricalGames(player).length>0,player);
  }
  for(let i=1;i<HISTORICAL_GAMES.length;i++)assert.ok(HISTORICAL_GAMES[i].year>=HISTORICAL_GAMES[i-1].year);
});

test('search finds players with accents and combines era, year, and game context',()=>{
  const games=[
    {id:'reti',title:'Réti versus Alekhine',white:'Richard Réti',black:'Alexander Alekhine',year:1925,era:'Champions',event:'Baden-Baden',summary:'A game of central control'},
    {id:'immortal',title:'The Immortal Game',white:'Adolf Anderssen',black:'Lionel Kieseritzky',year:1851,era:'Romantic era',event:'London',summary:'Sacrificial attacking play'}
  ];
  const before=JSON.stringify(games);
  assert.deepEqual(findHistoricalGames('RETI 1925 central','Champions',games).map(game=>game.id),['reti']);
  assert.deepEqual(findHistoricalGames('reti','Romantic era',games),[]);
  assert.deepEqual(findHistoricalGames('anderssen London','all',games).map(game=>game.id),['immortal']);
  assert.deepEqual(findHistoricalGames('missing','all',games),[]);
  assert.deepEqual(findHistoricalGames('  ','all',games),games);
  assert.equal(JSON.stringify(games),before);
});

test('the collection includes early chess and both landmark Deep Blue matches',()=>{
  assert.ok(HISTORICAL_GAMES.some(entry=>entry.year<1600&&entry.era==='Early chess'));
  for(const year of [1996,1997]){
    assert.ok(HISTORICAL_GAMES.some(entry=>entry.year===year&&/Kasparov/i.test(entry.white+' '+entry.black)&&/Deep Blue/i.test(entry.white+' '+entry.black)),String(year));
  }
});

test('replaying any historical game preserves its full move sequence and metadata',()=>{
  for(const entry of HISTORICAL_GAMES){
    const session=new GameSession();session.load(entry.pgn);
    const complete=session.game.pgn(),final=session.game.fen(),length=session.length;
    for(const cursor of [0,1,Math.floor(length/2),length]){
      session.navigate(cursor);
      assert.equal(session.cursor,cursor,entry.title);
      assert.equal(session.length,length,entry.title);
      assert.equal(session.game.pgn(),complete,entry.title);
      assert.doesNotThrow(()=>session.position(),entry.title);
    }
    assert.equal(session.position().fen(),final,entry.title);
  }
});

const appSource=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
function appFunction(name){
  const start=appSource.indexOf('function '+name+'(');
  assert.ok(start>=0,'Missing app function '+name);
  const next=appSource.indexOf('\nfunction ',start+1);
  return appSource.slice(start,next<0?undefined:next);
}
function loaderHarness({storageFails=false,tournament=false}={}){
  const session=new GameSession();
  session.load('[White "Alice"]\n[Black "Bob"]\n\n1. d4 d5 2. c4');
  session.navigate(1);
  let clock={fen:session.game.fen(),current:{remaining:{w:172000,b:169000}},history:[]};
  const existing={id:'previous-save',pgn:'1. e4 e5',clock:{kept:true}};
  const writes=[],events=[],messages=[],closedDialogs=[];
  const dialogs=[{close(){closedDialogs.push('options');}},{close(){closedDialogs.push('historical');}}];
  const settings={opponent:tournament?'match':'computer',showAnalysis:false,side:'w',engine:'stockfish19',theme:'walnut',fixedTime:false};
  const context=vm.createContext({
    GameSession,session,settings,saved:[existing],scores:{old:0.2},flipped:true,
    engineMatch:tournament?{white:'stockfish19',black:'reckless090',paused:true,tournamentId:'active-tournament',round:2}:null,
    gameOwner:null,engineName:()=> 'Stockfish 19',clockExpired:()=>false,
    clockSave:()=>clock,resetGameClock(){events.push('reset-clock');clock={reset:true};},
    localStorage:{setItem(key,value){if(storageFails)throw Error('Storage full');writes.push({key,value});events.push('persist');}},
    engine:{cancel(){events.push('cancel-engine');}},clearTimeout(timer){events.push('clear:'+timer);},
    requestId:41,bookTimer:'old-book',progressTimer:'old-progress',pendingProgress:{old:true},
    analysisUpdates:{cancel(){events.push('cancel-analysis');},flush(){events.push('flush-analysis');}},
    winCelebration:{stop(){events.push('stop-celebration');}},mateCelebration:{stop(){}},boardMotion:{cancel(){events.push('cancel-motion');}},
    nativeBackgroundClock:{old:true},nativeNextClock:{old:true},selected:'d2',promotion:{from:'a7',to:'a8'},bestHint:'d7d5',
    analysis:{old:true},analysisLines:[{old:true}],analysisFen:session.position().fen(),analysisComplete:true,searchProgress:{old:true},analysisProgress:{old:true},
    document:{querySelectorAll:()=>dialogs},syncSettings(){events.push('sync-settings');},
    setTab(next){context.tab=next;events.push('tab:'+next);},tab:'game',
    toast:message=>messages.push(message),$:id=>({textContent:id==='whiteName'?'Alice':'Bob'}),
    benchmarkMode:false,nativeSuspended:false,inactiveTab:false,
    publishSearchProgress(){events.push('publish-search');},renderSearchCount(){events.push('render-search');},
    renderGraph(){events.push('render-graph');},renderAnalysis(){events.push('render-analysis');},renderStatus(){events.push('render-status');},
    makeMove(move){events.push('make-move');session.move(move);}
  });
  vm.runInContext(['matchActive','playerHeader','persist','saveGame','validJob','onResult','loadHistoricalGame'].map(appFunction).join('\n'),context);
  const snapshot=()=>JSON.stringify({pgn:session.game.pgn(),cursor:session.cursor,clock,settings,engineMatch:context.engineMatch,saved:context.saved,scores:context.scores,flipped:context.flipped,selected:context.selected,promotion:context.promotion});
  return {context,session,existing,writes,events,messages,closedDialogs,snapshot};
}

test('opening historical analysis saves the complete previous game and keeps the selected position',()=>{
  const h=loaderHarness(),entry=HISTORICAL_GAMES[0],previousPgn=h.session.game.pgn(),previousClock=h.context.clockSave();
  const candidate=new GameSession();candidate.load(entry.pgn);candidate.navigate(7);
  assert.equal(h.context.loadHistoricalGame(entry.pgn,7).ok,true);
  assert.equal(h.session.cursor,7);
  assert.equal(h.session.length,entry.expectedPlies);
  assert.equal(h.session.position().fen(),candidate.position().fen());
  assert.equal(h.session.game.fen(),entry.finalFen);
  assert.equal(h.context.saved.length,2);
  assert.equal(h.context.saved[0].pgn,previousPgn);
  assert.equal(h.context.saved[0].clock,previousClock);
  assert.equal(h.context.saved[1],h.existing);
  assert.equal(h.context.settings.opponent,'local');
  assert.equal(h.context.settings.showAnalysis,true);
  assert.equal(h.context.settings.theme,'walnut');
  assert.equal(h.context.tab,'analysis');
  assert.equal(h.context.engineMatch,null);
  assert.equal(h.context.selected,null);assert.equal(h.context.promotion,null);
  assert.deepEqual(Object.keys(h.context.scores),[]);
  assert.equal(h.context.nativeBackgroundClock,null);assert.equal(h.context.nativeNextClock,null);
  assert.deepEqual(h.closedDialogs,['options','historical']);
  const persisted=JSON.parse(h.writes.at(-1).value);
  assert.equal(persisted.pgn,h.session.game.pgn());
  assert.equal(persisted.cursor,7);
  assert.equal(persisted.tab,'analysis');
  assert.equal(persisted.saved[0].pgn,previousPgn);
  assert.equal(persisted.saved[1].id,h.existing.id);
  assert.ok(h.events.indexOf('persist')<h.events.indexOf('cancel-engine'));
});

test('saved historical review restores every position without losing the complete game',()=>{
  for(const entry of HISTORICAL_GAMES){
    for(const cursor of [0,1,Math.floor(entry.expectedPlies/2),entry.expectedPlies]){
      const h=loaderHarness();h.context.loadHistoricalGame(entry.pgn,cursor);
      const saved=JSON.parse(h.writes.at(-1).value),restored=new GameSession();
      restored.load(saved.pgn,{cursor:saved.cursor});
      assert.equal(restored.cursor,cursor,entry.title);
      assert.equal(restored.position().fen(),h.session.position().fen(),entry.title);
      assert.equal(restored.game.pgn(),h.session.game.pgn(),entry.title);
      assert.equal(restored.length,entry.expectedPlies,entry.title);
      assert.equal(saved.tab,'analysis');
    }
  }
});

test('missing or invalid saved review positions keep the valid game at its latest move',()=>{
  const entry=HISTORICAL_GAMES[0],restored=new GameSession();
  for(const cursor of [undefined,null,-1,entry.expectedPlies+1,1.5,'7',NaN]){
    restored.load(entry.pgn,{cursor});
    assert.equal(restored.cursor,entry.expectedPlies);
    assert.equal(restored.position().fen(),entry.finalFen);
  }
});

test('review navigation saves immediately, before the phone can suspend the page',()=>{
  const h=loaderHarness();h.context.loadHistoricalGame(HISTORICAL_GAMES[0].pgn);
  h.context.gameClock={tick(){}};h.context.render=()=>{};h.context.analyze=()=>{};
  h.context.moveSound={play(){}};
  vm.runInContext(appFunction('navigate'),h.context);
  for(const cursor of [7,6,0,h.session.length]){
    h.context.navigate(cursor);
    const saved=JSON.parse(h.writes.at(-1).value);
    assert.equal(saved.cursor,cursor);
    assert.equal(saved.tab,'analysis');
  }
});

test('an earlier save of the same notation does not replace the current clock snapshot',()=>{
  const h=loaderHarness(),previousPgn=h.session.game.pgn(),currentClock=h.context.clockSave();
  const earlier={id:'older-same-game',pgn:previousPgn,clock:{current:{remaining:{w:180000,b:180000}}}};
  h.context.saved.unshift(earlier);
  assert.equal(h.context.loadHistoricalGame(HISTORICAL_GAMES[0].pgn).ok,true);
  assert.equal(h.context.saved.length,3);
  assert.equal(h.context.saved[0].pgn,previousPgn);
  assert.equal(h.context.saved[0].clock,currentClock);
  assert.notEqual(h.context.saved[0].clock,earlier.clock);
  assert.equal(h.context.saved[1],earlier);
  assert.equal(h.context.saved[2],h.existing);
  const persisted=JSON.parse(h.writes.at(-1).value);
  assert.deepEqual(persisted.saved[0].clock,currentClock);
  assert.deepEqual(persisted.saved[1].clock,earlier.clock);
});

test('invalid notation or replay indices leave the existing game, clocks, and saved games intact',()=>{
  for(const [pgn,cursor] of [['not a PGN',0],[HISTORICAL_GAMES[0].pgn,-1],[HISTORICAL_GAMES[0].pgn,0.5],[HISTORICAL_GAMES[0].pgn,HISTORICAL_GAMES[0].expectedPlies+1]]){
    const h=loaderHarness(),before=h.snapshot();
    assert.ok(h.context.loadHistoricalGame(pgn,cursor).error);
    assert.equal(h.snapshot(),before);
    assert.equal(h.writes.length,0);
    assert.equal(h.events.length,0);
  }
});

test('a storage failure aborts historical loading and rolls back the attempted saved entry',()=>{
  const h=loaderHarness({storageFails:true}),before=h.snapshot();
  assert.match(h.context.loadHistoricalGame(HISTORICAL_GAMES[0].pgn).error,/saved|storage/i);
  assert.equal(h.snapshot(),before);
  assert.equal(h.context.saved[0],h.existing);
  assert.equal(h.context.requestId,41);
  assert.deepEqual(h.closedDialogs,[]);
  assert.equal(h.events.includes('cancel-engine'),false);
});

test('an active tournament retains its round, match, notation, and clocks',()=>{
  const h=loaderHarness({tournament:true}),before=h.snapshot(),match=h.context.engineMatch;
  assert.match(h.context.loadHistoricalGame(HISTORICAL_GAMES[0].pgn).error,/tournament/i);
  assert.equal(h.snapshot(),before);
  assert.equal(h.context.engineMatch,match);
  assert.equal(h.context.settings.opponent,'match');
  assert.equal(h.writes.length,0);
  assert.equal(h.events.length,0);
});

test('an ordinary engine match is saved before entering historical analysis',()=>{
  const h=loaderHarness(),previousPgn=h.session.game.pgn(),previousClock=h.context.clockSave();
  h.context.settings.opponent='match';
  h.context.engineMatch={white:'stockfish19',black:'reckless090',paused:true,tournamentId:null};
  assert.equal(h.context.loadHistoricalGame(HISTORICAL_GAMES[0].pgn).ok,true);
  assert.equal(h.context.saved[0].pgn,previousPgn);
  assert.equal(h.context.saved[0].clock,previousClock);
  assert.equal(h.context.engineMatch,null);
  assert.equal(h.context.settings.opponent,'local');
  assert.equal(h.context.saved[1],h.existing);
});

test('opening historical analysis cancels book timers and rejects an old engine reply at the same FEN',()=>{
  const h=loaderHarness();h.session.reset();
  const oldJob={id:h.context.requestId,fen:h.session.position().fen(),forceMove:true};
  assert.equal(h.context.validJob(oldJob),true);
  assert.equal(h.context.loadHistoricalGame(HISTORICAL_GAMES[0].pgn).ok,true);
  assert.equal(h.session.position().fen(),oldJob.fen);
  assert.ok(h.context.requestId>oldJob.id);
  assert.equal(h.context.validJob(oldJob),false);
  assert.ok(h.events.includes('cancel-engine'));
  assert.ok(h.events.includes('clear:old-book'));
  assert.ok(h.events.includes('clear:old-progress'));
  const before=h.session.game.pgn(),events=h.events.length;
  h.context.onResult(oldJob,'e2e4',{type:'cp',score:25});
  assert.equal(h.session.game.pgn(),before);
  assert.equal(h.session.cursor,0);
  assert.equal(h.events.length,events);
});

test('a setup position with no moves is preserved before historical analysis',()=>{
  const h=loaderHarness();h.session.load('7k/8/8/8/8/8/R7/K7 w - - 0 50');
  const setupPgn=h.session.game.pgn();
  assert.equal(h.session.length,0);
  assert.equal(h.context.loadHistoricalGame(HISTORICAL_GAMES[0].pgn).ok,true);
  assert.equal(h.context.saved[0].pgn,setupPgn);
  const restored=new GameSession();restored.load(h.context.saved[0].pgn);
  assert.equal(restored.game.fen(),'7k/8/8/8/8/8/R7/K7 w - - 0 50');
});
