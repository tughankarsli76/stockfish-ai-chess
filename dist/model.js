import {validatePosition} from './position-safety.js';
import {Chess} from './vendor/chess.js';
export class GameSession {
  constructor(){this.game=new Chess();this.cursor=0;this._moves=null;}
  get moves(){return this._moves??=this.game.history({verbose:true});}
  get length(){return this.moves.length;}
  get live(){return this.cursor===this.length;}
  position(){return this.live?this.game:new Chess(this.moves[this.cursor].before);}
  navigate(index){if(!Number.isInteger(index)||index<0||index>this.length)throw Error('Invalid move position');this.cursor=index;}
  move(move,{fromReview=false}={}){
    if(!this.live){
      if(!fromReview)throw Error('Return to the latest position to play.');
      // Validate on a copy so an illegal move never discards the later line.
      const next=new Chess();next.loadPgn(this.game.pgn());
      while(next.history().length>this.cursor)next.undo();
      if(next.isGameOver())throw Error('The game is over.');
      const result=next.move(move);next.setHeader('Result','*');
      this.game=next;this._moves=null;this.cursor=this.length;return result;
    }
    if(this.game.isGameOver())throw Error('The game is over.');
    const result=this.game.move(move);this._moves=null;this.cursor=this.length;return result;
  }
  undo(computer=false,side='w'){if(!this.live){this.cursor=this.length;return;}this.game.undo();this._moves=null;if(computer&&this.game.turn()!==side&&this.length){this.game.undo();this._moves=null;}this.cursor=this.length;}
  takeBack(){
    if(!this.cursor)return false;
    const target=this.cursor-1;
    // Keep the original game's headers, repetition history, and special-move rights.
    for(let length=this.length;length>target;--length)this.game.undo();
    this.game.setHeader('Result','*');this._moves=null;this.cursor=this.length;
    return true;
  }
  reset(){this.game=new Chess();this.cursor=0;this._moves=null;}
  load(text,{cursor}={}){if(typeof text!=='string'||!text.trim())throw Error('Paste a PGN game or FEN position.');if(text.length>250000)throw Error('Please load a single game under 250 KB.');const next=new Chess();const trimmed=text.trim();if(trimmed.split(/\s+/)[0].split('/').length===8)next.load(trimmed);else next.loadPgn(trimmed);validatePosition(next);const first=next.history({verbose:true})[0];if(first)validatePosition(new Chess(first.before));this.game=next;this._moves=null;this.cursor=Number.isInteger(cursor)&&cursor>=0&&cursor<=this.length?cursor:this.length;}
}
export function gameStatus(game){if(game.isCheckmate())return `Checkmate — ${game.turn()==='w'?'Black':'White'} wins`;if(game.isStalemate())return 'Draw — stalemate';if(game.isThreefoldRepetition())return 'Draw — threefold repetition';if(game.isInsufficientMaterial())return 'Draw — insufficient material';if(game.isDrawByFiftyMoves())return 'Draw — fifty-move rule';if(game.isDraw())return 'Draw';return `${game.turn()==='w'?'White':'Black'} to move`;}
