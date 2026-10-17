import test from 'node:test';
import assert from 'node:assert/strict';
import {GameSession} from '../dist/model.js';
import {capturedPieces,renderCapturedPieces} from '../dist/captured-pieces.js';

test('captures belong to the capturing side and follow the review cursor',()=>{
  const session=new GameSession();session.load('1. e4 d5 2. exd5 Qxd5 3. Nc3');
  assert.deepEqual(capturedPieces(session),{w:['p'],b:['p']});
  session.navigate(3);assert.deepEqual(capturedPieces(session),{w:['p'],b:[]});
  session.navigate(0);assert.deepEqual(capturedPieces(session),{w:[],b:[]});
  session.navigate(5);assert.deepEqual(capturedPieces(session),{w:['p'],b:['p']});
  session.takeBack();assert.deepEqual(capturedPieces(session),{w:['p'],b:['p']});
  session.takeBack();assert.deepEqual(capturedPieces(session),{w:['p'],b:[]});
  session.reset();assert.deepEqual(capturedPieces(session),{w:[],b:[]});
});

test('en passant records a captured pawn',()=>{
  const session=new GameSession();
  for(const move of ['e4','a6','e5','d5','exd6'])session.move(move);
  assert.deepEqual(capturedPieces(session),{w:['p'],b:[]});
});

test('custom positions and promotions never invent missing-piece captures',()=>{
  const session=new GameSession();session.load('7k/P7/8/8/8/8/8/7K w - - 0 1');
  assert.deepEqual(capturedPieces(session),{w:[],b:[]});
  session.move('a8=Q+');assert.deepEqual(capturedPieces(session),{w:[],b:[]});
  session.load('1r5k/P7/8/8/8/8/8/7K w - - 0 1');session.move('axb8=N');
  assert.deepEqual(capturedPieces(session),{w:['r'],b:[]});
});

test('capturing a promoted piece uses its actual type',()=>{
  const session=new GameSession();session.load('8/8/8/8/8/7k/p7/1R5K b - - 0 1');
  session.move('a1=Q');session.move('Rxa1');
  assert.deepEqual(capturedPieces(session),{w:['q'],b:[]});
});

test('render uses the selected set, captured colors, accessible names, and empty state',()=>{
  const original=globalThis.document;
  const element=()=>({children:[],append(...children){this.children.push(...children);},replaceChildren(){this.children=[];}});
  globalThis.document={createElement:element};
  try{
    const session=new GameSession();session.load('1. e4 d5 2. exd5 Qxd5');
    const container=element(),t=text=>text;
    renderCapturedPieces(container,session,'merida',t);
    const white=container.children[0],black=container.children[1];
    assert.equal(white.children[0].textContent,'Captured by White');
    assert.equal(white.children[1].children[0].src,'assets/pieces/bP.svg');
    assert.equal(white.children[1].children[0].alt,'Black Pawn');
    assert.equal(black.children[1].children[0].src,'assets/pieces/wP.svg');
    session.navigate(0);renderCapturedPieces(container,session,'classic',t);
    assert.equal(container.children.length,2);
    for(const row of container.children)assert.equal(row.children[1].textContent,'No captured pieces.');
  }finally{globalThis.document=original;}
});
