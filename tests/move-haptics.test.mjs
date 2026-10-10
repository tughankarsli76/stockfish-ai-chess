import test from 'node:test';
import assert from 'node:assert/strict';
import {MoveHaptics} from '../dist/move-haptics.js';
import {MoveSound} from '../dist/move-sound.js';

test('move haptics require explicit opt-in and ignore hidden-page moves',async()=>{
  const events=[];let hidden=false;
  const haptics=new MoveHaptics({native:{setMoveHapticsEnabled:async enabled=>events.push(enabled),playMoveHaptics:async()=>events.push('impact')},hidden:()=>hidden});
  haptics.play();
  for(const value of [undefined,false,'true',1]){haptics.setEnabled(value);haptics.play();}
  haptics.setEnabled(true);haptics.setEnabled(true);haptics.play();
  hidden=true;haptics.play();hidden=false;
  haptics.setEnabled(false);haptics.play();
  await Promise.resolve();
  assert.deepEqual(events,[false,true,'impact',false]);
});

test('sound and haptics can be enabled independently',async()=>{
  const events=[];
  const native={setMoveHapticsEnabled:async()=>{},playMoveHaptics:async()=>events.push('impact'),setMoveSoundEnabled:async()=>{},playMoveSound:async()=>events.push('sound')};
  const haptics=new MoveHaptics({native,hidden:()=>false});
  const sound=new MoveSound({native,hidden:()=>false});
  haptics.setEnabled(true);sound.setEnabled(false);sound.play();haptics.play();
  assert.deepEqual(events,['impact']);
  haptics.setEnabled(false);sound.setEnabled(true);sound.play();haptics.play();
  assert.deepEqual(events,['impact','sound']);
  haptics.setEnabled(true);sound.play();haptics.play();
  assert.deepEqual(events,['impact','sound','sound','impact']);
});

test('unsupported hardware and failed native feedback never interrupt gameplay',async()=>{
  for(const native of [null,{}, {setMoveHapticsEnabled:()=>{throw Error('Unavailable');},playMoveHaptics:async()=>{throw Error('Unsupported');}}]){
    const haptics=new MoveHaptics({native,hidden:()=>false});
    assert.doesNotThrow(()=>{haptics.setEnabled(true);haptics.play();haptics.setEnabled(false);});
    await Promise.resolve();
  }
});
