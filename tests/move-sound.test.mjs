import test from 'node:test';
import assert from 'node:assert/strict';
import {MoveSound} from '../dist/move-sound.js';

test('move audio stays unallocated by default and accepts only explicit opt-in',()=>{
  let allocations=0;
  const sound=new MoveSound({native:null,hidden:()=>false,createAudio:()=>{allocations++;}});
  sound.play();
  for(const value of [undefined,false,'true',1]){sound.setEnabled(value);sound.play();}
  assert.equal(allocations,0);
});

test('native normal and capture sounds play without a browser audio gesture; off and hidden stay silent',async()=>{
  const events=[];let hidden=false;
  const sound=new MoveSound({
    native:{setMoveSoundEnabled:async value=>events.push(value),playMoveSound:async capture=>events.push(['move',capture])},
    hidden:()=>hidden,createAudio:()=>{throw Error('Native must not also play browser audio');}
  });
  sound.setEnabled(false);sound.play();
  sound.setEnabled(true);sound.play();sound.play(true);
  hidden=true;sound.play();hidden=false;
  sound.setEnabled(false);sound.play();
  await Promise.resolve();
  assert.deepEqual(events,[false,true,['move',false],['move',true],false]);
});

test('browser reuses the Lichess effect at its default volume, stops on disable, and tolerates unavailable audio',async()=>{
  let allocations=0,plays=0,stops=0;
  const audio={currentTime:0,play:()=>{plays++;return Promise.reject(Error('Muted browser'));},pause:()=>stops++};
  const sound=new MoveSound({native:null,hidden:()=>false,createAudio:()=>{allocations++;return audio;}});
  sound.setEnabled(true);sound.play();sound.play();
  sound.setEnabled(false);sound.play();
  await Promise.resolve();
  assert.equal(allocations,1);assert.equal(plays,2);assert.equal(stops,1);
  assert.equal(audio.volume,.8);assert.equal(audio.currentTime,0);
});

test('browser chooses distinct move and capture effects and stops both when disabled',()=>{
  const kinds=[],played=[],stopped=[],audio=[];
  const sound=new MoveSound({native:null,hidden:()=>false,createAudio:capture=>{
    kinds.push(capture);const player={currentTime:1,play:()=>played.push(capture),pause:()=>stopped.push(capture)};audio.push(player);return player;
  }});
  sound.setEnabled(true);sound.play();sound.play(true);sound.play();sound.play(true);
  assert.deepEqual(kinds,[false,true]);assert.deepEqual(played,[false,true,false,true]);
  assert.ok(audio.every(player=>player.volume===0.8&&player.currentTime===0));
  sound.setEnabled(false);sound.play(true);assert.deepEqual(stopped,[false,true]);
});
