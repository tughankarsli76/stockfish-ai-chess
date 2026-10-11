import test from 'node:test';
import assert from 'node:assert/strict';
import {scanDraft,rotateScan,checkedCorners,boardProjection,perspectiveBoard} from '../dist/scan-position.js';
import {positionFromDraft} from '../dist/features.js';
import {extractBoardImage} from '../dist/vendor/scan/tiles.js';

const starting='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
test('photo positions preserve material and never invent move history',()=>{
  const draft=scanDraft(starting);
  assert.equal(Object.keys(draft.squares).length,32);
  assert.equal(positionFromDraft(draft),starting+' w - - 0 1');
  assert.deepEqual(draft.castling,[]);
  assert.equal(draft.enPassant,'-');
  for(const bad of ['8/8','9/8/8/8/8/8/8/8','X7/8/8/8/8/8/8/8','7/8/8/8/8/8/8/8','88/8/8/8/8/8/8/8'])assert.throws(()=>scanDraft(bad));
});
test('rotation corrects black-side photographs without changing piece colors',()=>{
  const draft=scanDraft('R2KQ2R/P6P/8/8/8/8/p6p/r2kq2r');
  const rotated=rotateScan({...draft,castling:['K'],enPassant:'e3'});
  assert.equal(rotated.squares.a8,'r');
  assert.equal(rotated.squares.e1,'K');
  assert.deepEqual(rotateScan(rotated).squares,draft.squares);
  assert.deepEqual(rotated.castling,[]);
  assert.equal(rotated.enPassant,'-');
});
test('corner validation rejects crossed, collapsed, off-image and tiny grids',()=>{
  for(const bad of [[],[[0,0],[1,1],[1,0],[0,1]],[[0,0],[0,0],[0,0],[0,0]],[[-.1,0],[1,0],[1,1],[0,1]],[[0,0],[.02,0],[.02,.02],[0,.02]]])assert.throws(()=>checkedCorners(bad));
  const corners=[[.1,.2],[.9,.1],[.8,.9],[.2,.8]],project=boardProjection(corners);
  for(const [i,[u,v]] of [[0,[0,0]],[1,[1,0]],[2,[1,1]],[3,[0,1]]]){
    const p=project(u,v);assert.ok(Math.abs(p[0]-corners[i][0])<1e-9);assert.ok(Math.abs(p[1]-corners[i][1])<1e-9);
  }
});
test('manual perspective extraction equals screenshot extraction on a rectangular board',()=>{
  const gray={width:128,height:96,data:Float32Array.from({length:128*96},(_,i)=>i%251)};
  const box={x0:24,y0:8,x1:88,y1:72},corners=[[24/128,8/96],[88/128,8/96],[88/128,72/96],[24/128,72/96]];
  const expected=extractBoardImage(gray,box),actual=perspectiveBoard(gray,corners);
  for(let i=0;i<actual.length;i++)assert.ok(Math.abs(expected[i]-actual[i])<1e-6);
});
test('invalid detected boards are rejected before native engine analysis',()=>{
  for(const placement of ['8/8/8/8/8/8/8/8','k7/8/8/8/8/8/4K3/4K3','k7/8/8/8/8/8/8/P3K3'])assert.throws(()=>positionFromDraft(scanDraft(placement)));
});
