import test from 'node:test';
import assert from 'node:assert/strict';
import {username,recentGames} from '../dist/chesscom.js';
const base='https://api.chess.com/pub/player/hikaru/games/';
test('validates usernames without accepting URLs or path segments',()=>{assert.equal(username(' Hikaru '),'Hikaru');for(const value of ['', '../hikaru','https://chess.com/hikaru'])assert.throws(()=>username(value));});
test('loads newest archives, sorts games, excludes variants and foreign URLs',async()=>{
 const seen=[];const fetcher=async url=>{seen.push(url);return {ok:true,json:async()=>url.endsWith('archives')?{archives:[base+'2025/01',base+'2025/02','https://example.com/games/2025/03']}:{games:[{rules:'chess',pgn:'1. e4',end_time:seen.length},{rules:'chess960',pgn:'x',end_time:99}]}};};
 const games=await recentGames('Hikaru',{fetcher});assert.deepEqual(seen,[base+'archives',base+'2025/02',base+'2025/01']);assert.equal(games.length,2);assert.equal(games[0].end_time,3);
});
test('limits result list to thirty games and stops fetching',async()=>{let count=0;const games=await recentGames('hikaru',{fetcher:async()=>({ok:true,json:async()=>++count===1?{archives:[base+'2025/01',base+'2025/02']}:{games:Array.from({length:40},(_,n)=>({rules:'chess',pgn:'1. e4',end_time:n}))}})});assert.equal(count,2);assert.equal(games.length,30);assert.equal(games[0].end_time,39);});
test('reports missing accounts, rate limits and empty archives',async()=>{
 for(const status of [404,429])await assert.rejects(recentGames('hikaru',{fetcher:async()=>({ok:false,status})}),status===404?/Player not found/:/busy/);
 assert.deepEqual(await recentGames('hikaru',{fetcher:async()=>({ok:true,json:async()=>({archives:[]})})}),[]);
});
