import {installAccountImport} from './chesscom.js';
export function lichessUsername(value){
 const name=String(value||'').trim();
 if(!/^[a-z0-9_-]{2,30}$/i.test(name))throw Error('Enter a Lichess username (2–30 letters, numbers, underscores or hyphens).');
 return name;
}
async function response(url,{signal,fetcher=fetch,ndjson=false}={}){
 const res=await fetcher(url,{credentials:'omit',signal:AbortSignal.any([signal||new AbortController().signal,AbortSignal.timeout(30000)]),headers:{Accept:ndjson?'application/x-ndjson':'application/json'}});
 if(!res.ok)throw Error(res.status===404?'Player not found. Check the username.':res.status===429?'Lichess is busy. Please wait a minute before trying again.':'Lichess could not load this data. Please try again.');
 return res;
}
export function parseLichessGames(text){
 let games;
 try{games=text.split(/\r?\n/).filter(line=>line.trim()).map(line=>JSON.parse(line));}catch{throw Error('Lichess returned an unreadable game list. Please try again.');}
 return games.filter(g=>g&&g.variant==='standard'&&typeof g.pgn==='string'&&g.pgn.trim()&&g.pgn.length<=250000&&!['created','started','aborted'].includes(g.status))
  .sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,30).map(g=>({pgn:g.pgn,white:{username:g.players?.white?.user?.name||'White'},black:{username:g.players?.black?.user?.name||'Black'},end_time:(g.lastMoveAt||g.createdAt||0)/1000,time_class:g.speed||'Chess'}));
}
export async function recentLichessGames(name,options={}){
 const user=lichessUsername(name);
 const query=new URLSearchParams({max:'30',pgnInJson:'true',moves:'true',tags:'true',clocks:'false',evals:'false',ongoing:'false',finished:'true',sort:'dateDesc',perfType:'ultraBullet,bullet,blitz,rapid,classical,correspondence'});
 const res=await response('https://lichess.org/api/games/user/'+encodeURIComponent(user)+'?'+query,{...options,ndjson:true});
 return parseLichessGames(await res.text());
}
export function installLichess(api){return installAccountImport(api,{
 name:'Lichess',id:'lichessDialog',key:'lichess-import-v1',
 suggested:[['DrNykterstein','Magnus Carlsen'],['alireza2003','Alireza Firouzja'],['EricRosen','Eric Rosen'],['penguingm1','Andrew Tang']],
 validate:lichessUsername,games:recentLichessGames,
 profile:async(name,signal)=>(await response('https://lichess.org/api/user/'+encodeURIComponent(lichessUsername(name)),{signal})).json(),
 emptyMessage:'No completed standard chess games found for this player.'
});}
