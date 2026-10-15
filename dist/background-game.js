import {Chess} from './vendor/chess.js';
import {GameClock} from './clock.js';
import {chooseBookMove,computerMoveTime,migrateRemovedKarsli} from './features.js';
import {validatePosition} from './position-safety.js';

// No DOM or WebKit timers: the native host drives this same game model offscreen.
export class BackgroundGame {
 constructor(data,tournament=null,now=()=>Date.now()){
  this.data=JSON.parse(JSON.stringify(data));this.tournament=tournament?JSON.parse(JSON.stringify(tournament)):null;this.now=now;
  migrateRemovedKarsli(this.data,this.tournament);
  delete this.data.settings.tablebasePieces;delete this.data.tablebaseDefaultsRevision;
  this.data.engineNames ||= {};
  this.game=new Chess();this.game.loadPgn(data.pgn);validatePosition(this.game);
  this.clock=new GameClock(data.settings.gameMinutes,data.settings.increment,now);
  if(data.clock?.current)this.clock.restore(data.clock.current);
  this.history=data.clock?.history||[];if(!this.history[this.game.history().length])this.history[this.game.history().length]=this.clock.snapshot();this.elapsed={...(data.clock?.moveClock?.elapsed||{w:0,b:0})};
  this.started=0;this.searching=false;this.completed=false;this.waiting=false;
 }
 get match(){return this.data.settings.opponent==='match'?this.data.engineMatch:null;}
 get participating(){return this.match&&this.tournament&&!this.tournament.stopped&&this.match.tournamentId===this.tournament.id;}
 result(){return this.clock.expired?(this.clock.expired==='w'?'0-1':'1-0'):this.game.isCheckmate()?(this.game.turn()==='w'?'0-1':'1-0'):this.game.isGameOver()?'1/2-1/2':null;}
 next(){
  const result=this.result();
  if(result){
   this.game.setHeader('Result',result);
   if(this.participating){
    const t=this.tournament;
    if(this.match.round===t.results.length+1)t.results.push({...t.schedule[t.results.length],result,pgn:this.game.pgn()});
    if(t.results.length<t.schedule.length){
     const pair=t.schedule[t.results.length],s=this.data.settings,c=t.control;
     this.data.engineMatch={...pair,seconds:c.seconds,paused:false,tournamentId:t.id,round:t.results.length+1};
     Object.assign(s,{fixedTime:c.fixedTime!==false,gameMinutes:c.gameMinutes,increment:c.increment||0});
     this.game=new Chess();this.game.setHeader('White',this.data.engineNames[pair.white]||pair.white,'Black',this.data.engineNames[pair.black]||pair.black,'Event','Engine Tournament','Round',String(t.results.length+1));
     this.clock=new GameClock(s.gameMinutes,s.increment,this.now);this.history=[];this.elapsed={w:0,b:0};
    }else {this.completed=true;return null;}
   }else {this.completed=true;return null;}
  }
  const s=this.data.settings;
  if(this.match?.paused||(!this.match&&(s.opponent!=='computer'||this.game.turn()===s.side))){this.waiting=true;return null;}
  const side=this.game.turn();this.started=this.now();this.searching=true;
  if(s.fixedTime===false)this.clock.run(side);
  const book=s.openingBook?chooseBookMove(this.game,Math.random,s.bookVariety):null;
   return {engine:this.match?this.match[side==='w'?'white':'black']:s.engine,fen:this.game.fen(),book:book?.uci||null,threads:s.threads,hash:s.hash,level:this.match?20:Number(s.level),milliseconds:this.match?this.match.seconds*1000:computerMoveTime(s),clock:s.fixedTime===false?this.clock.uci():null};
 }
 advance(uci){
  if(!this.searching)return false;
  const side=this.game.turn();this.elapsed[side]+=Math.max(0,this.now()-this.started);this.searching=false;
  if(this.data.settings.fixedTime===false&&!this.clock.finishMove(side))return false;
  this.game.move({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]||'q'});
  this.history[this.game.history().length]=this.clock.snapshot();return true;
 }
 checkpoint(resume=false){
  this.clock.tick();
  const d=this.data,moves=this.game.history().length;d.pgn=this.game.pgn();d.cursor=moves;d.scores={};d.backgroundResume=resume;
  d.engineMatchProgress=this.match?{moves,complete:!!this.result()}:null;
  d.clock={fen:this.game.fen(),minutes:d.settings.gameMinutes,increment:d.settings.increment,current:this.clock.snapshot(),history:this.history,moveClock:{fen:this.game.fen(),elapsed:{...this.elapsed}}};
  if(this.waiting&&!this.result())d.backgroundWaiting={since:this.now(),side:this.game.turn()};else delete d.backgroundWaiting;
  return {data:d,tournament:this.tournament,moves,finishedGames:this.tournament?.results.length||0,totalGames:this.tournament?.schedule.length||1,completed:this.completed,waiting:this.waiting};
 }
 stop(resume=false){
  if(this.searching){this.elapsed[this.game.turn()]+=Math.max(0,this.now()-this.started);this.searching=false;}
  this.clock.run(null);return this.checkpoint(resume);
 }
}
