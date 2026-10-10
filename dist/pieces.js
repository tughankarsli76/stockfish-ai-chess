export const PIECE_SETS={
 classic:{name:'Classic',folder:'classic/'},
 merida:{name:'Piece 11 · Merida',folder:''},
 chessnut:{name:'Chessnut',folder:'chessnut/'},
 fantasy:{name:'Fantasy',folder:'fantasy/'},
 celtic:{name:'Celtic',folder:'celtic/'},
 spatial:{name:'Spatial',folder:'spatial/'},
 pixel:{name:'Pixel',folder:'pixel/'},
 rhosgfx:{name:'RhosGFX',folder:'rhosgfx/'},
 mono:{name:'Mono',folder:'mono/'},
 letter:{name:'Letter',folder:'letter/'},
 pirouetti:{name:'Pirouetti',folder:'pirouetti/'},
 shapes:{name:'Shapes',folder:'shapes/'},
 'kiwen-suwi':{name:'Kiwen Suwi',folder:'kiwen-suwi/'},
 firi:{name:'Firi',folder:'firi/'},
 mpchess:{name:'MPChess',folder:'mpchess/'},
 totoy:{name:'Totoy',folder:'totoy/'},
 papercut:{name:'Papercut',folder:'papercut/'}
};
export function pieceImage(set,color,type){
 const folder=(PIECE_SETS[set]||PIECE_SETS.classic).folder;
 const name=color+type.toUpperCase();
 return 'assets/pieces/'+folder+encodeURIComponent(name)+'.svg';
}
