// Normalize en-passant keys using the same chess rules as the app.
import {Chess} from '../../dist/vendor/chess.js';
let input='';
for await(const chunk of process.stdin)input+=chunk;
const keys={};
for(const fen of JSON.parse(input)){
 keys[fen]=new Chess(fen+' 0 1').fen().split(' ').slice(0,4).join(' ');
}
process.stdout.write(JSON.stringify(keys));
