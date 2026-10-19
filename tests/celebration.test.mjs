import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {GameSession} from '../dist/model.js';

const celebrationSource=readFileSync(new URL('../dist/celebration.js',import.meta.url),'utf8');
const samuraiSource=readFileSync(new URL('../dist/samurai-celebration.js',import.meta.url),'utf8');
function element(){
 const classes=new Set();
 return {dataset:{},children:[],hidden:false,style:{},offsetWidth:1,
  setAttribute(){},append(...children){this.children.push(...children);},
  getContext(){return {};},classList:{add:name=>classes.add(name),remove:name=>classes.delete(name),contains:name=>classes.has(name)}};
}
function resultHarness(){
 const scenes=[],timers=new Map();let nextTimer=0;
 class FakeSamurai {
  constructor(container){this.container=container;this.active=false;this.plays=[];this.finals=[];scenes.push(this);}
  stop(){this.active=false;}
  play(winner){this.active=true;this.plays.push(winner);}
  renderFinal(winner){this.finals.push(winner);}
 }
 const context={SamuraiCelebration:FakeSamurai,document:{hidden:false,createElement:element},matchMedia:()=>({matches:false}),
  setTimeout:fn=>{const id=++nextTimer;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id)};
 vm.createContext(context);
 vm.runInContext(celebrationSource.slice(celebrationSource.indexOf('export class CheckmateCelebration')).replace('export class','this.CheckmateCelebration=class'),context);
 const containers=['game','analysis'].map(view=>{const node=element();node.dataset.view=view;return node;});
 return {celebration:new context.CheckmateCelebration(containers),containers,scenes,timers,context};
}
function mate(winner){
 const session=new GameSession();
 session.load(winner==='w'?'1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7#':'1. f3 e5 2. g4 Qh4#');
 assert.equal(session.position().isCheckmate(),true);
 return session.position();
}

test('each checkmate selects its winner and plays the two-handed scene in the result view',()=>{
 for(const [winner,view] of [['w','game'],['b','analysis']]){
  const {celebration,containers,scenes}=resultHarness(),position=mate(winner),index=view==='game'?0:1;
  assert.equal(position.turn(),winner==='w'?'b':'w');
  celebration.render(position);celebration.play(view);
  assert.equal(containers[index].hidden,false);
  assert.equal(containers[index].dataset.kind,'mate');
  assert.equal(containers[index].dataset.winner,winner==='w'?'white':'black');
  assert.deepEqual(scenes[index].plays,[winner]);
  assert.deepEqual(scenes[1-index].plays,[]);
  assert.equal(celebration.active,true);
 }
});

test('the canvas shows the defeated king for either winning side',()=>{
 const draws=[],ctx=new Proxy({drawImage:image=>draws.push(image.name)},{get(target,key){return key in target?target[key]:(()=>{});}});
 const context={SWING_TIMES:[2.83,3.69,4.42],Path2D:class {}};vm.createContext(context);
 const start=samuraiSource.indexOf('function createScene('),end=samuraiSource.indexOf('/** A one-shot canvas scene.');
 vm.runInContext(samuraiSource.slice(start,end)+'\nthis.sceneFactory=createScene;',context);
 const draw=context.sceneFactory({getContext:()=>ctx},{wK:{name:'white king'},bK:{name:'black king'}});
 draw(0,'w');assert.deepEqual(draws,['black king']);
 draws.length=0;draw(0,'b');assert.deepEqual(draws,['white king']);
});

test('time wins use the same samurai for either winner in both result views',()=>{
 for(const winner of ['w','b'])for(const view of ['game','analysis']){
  const {celebration,containers,scenes,timers}=resultHarness(),index=view==='game'?0:1;
  celebration.render(new GameSession().position(),winner);celebration.play(view);
  assert.equal(containers[index].dataset.kind,'time');
  assert.equal(containers[index].dataset.winner,winner==='w'?'white':'black');
  assert.equal(containers[index].hidden,false);assert.equal(celebration.active,true);
  assert.deepEqual(scenes[index].plays,[winner]);assert.equal(timers.size,0);
  scenes[index].active=false;assert.equal(celebration.active,false);
 }
});

test('disabling samurai hides both scenes, cancels playback and prevents replay',()=>{
 const {celebration,containers,scenes}=resultHarness(),position=mate('w');
 celebration.render(position);celebration.play('game');assert.equal(celebration.active,true);
 celebration.render(position,null,false);celebration.play('analysis');
 assert.equal(celebration.active,false);
 assert.ok(containers.every(container=>container.hidden));assert.ok(scenes.every(scene=>!scene.active));
 assert.deepEqual(scenes[1].plays,[]);
 celebration.render(position,null,true);
 assert.equal(celebration.active,false);assert.ok(containers.every(container=>!container.hidden));
});

test('a declared decisive result uses the same samurai scene',()=>{
 const {celebration,containers,scenes}=resultHarness();
 celebration.render(new GameSession().position(),'b',true,'result');celebration.play('game');
 assert.equal(containers[0].dataset.kind,'result');assert.deepEqual(scenes[0].plays,['b']);
});

test('rerendering the same mate keeps its animation, while another position cancels and hides it',()=>{
 const {celebration,containers,scenes}=resultHarness(),position=mate('w');
 celebration.render(position);celebration.play('game');
 const finals=scenes[0].finals.length;
 celebration.render(position,'w',true,'result');
 assert.equal(celebration.active,true);assert.deepEqual(scenes[0].plays,['w']);
 assert.equal(scenes[0].finals.length,finals);
 celebration.render(new GameSession().position());
 assert.equal(celebration.active,false);assert.equal(scenes[0].active,false);
 for(const container of containers)assert.equal(container.hidden,true);
});

test('the result remains busy until its complete samurai sequence ends',()=>{
 const {celebration,scenes}=resultHarness();celebration.render(mate('b'));celebration.play('analysis');
 assert.equal(celebration.active,true);
 scenes[1].active=false;
 assert.equal(celebration.active,false);
});

function rendererHarness({hidden=false,reduced=false}={}){
 let resolve,reject,nextFrame=0;
 const assets=new Promise((yes,no)=>{resolve=yes;reject=no;}),frames=new Map(),draws=[];
 const context={DURATION:6.8,document:{hidden,createElement:element},matchMedia:()=>({matches:reduced}),loadAssets:()=>assets,
  requestAnimationFrame:fn=>{const id=++nextFrame;frames.set(id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id)};
 vm.createContext(context);
 vm.runInContext(samuraiSource.slice(samuraiSource.indexOf('export class SamuraiCelebration')).replace('export class','this.SamuraiCelebration=class'),context);
 const scene=new context.SamuraiCelebration(element());
 scene._draw=(_images,time,winner)=>draws.push({time,winner});
 const tick=now=>{assert.equal(frames.size,1,'exactly one animation frame should be pending');const [id,fn]=frames.entries().next().value;frames.delete(id);fn(now);};
 return {scene,context,frames,draws,resolve,reject,tick};
}
const settle=async()=>{for(let i=0;i<4;i++)await Promise.resolve();};

test('stopping while assets load cannot resurrect the previous result',async()=>{
 const {scene,frames,draws,resolve}=rendererHarness();
 assert.equal(scene.play('w'),true);assert.equal(scene.active,true);
 scene.stop();resolve({});await settle();
 assert.equal(scene.active,false);assert.equal(frames.size,0);assert.deepEqual(draws,[]);
});

test('samurai activity includes asset loading and all 6.8 seconds, beyond the confetti',async()=>{
 const {scene,frames,draws,resolve,tick}=rendererHarness();
 scene.play('b');assert.equal(scene.active,true);assert.equal(frames.size,0);
 resolve({});await settle();tick(10000);assert.equal(scene.active,true);
 tick(15700);assert.equal(scene.active,true,'the scene must still block Game Review after confetti ends');
 tick(16799);assert.equal(scene.active,true);tick(16800);
 assert.equal(scene.active,false);assert.equal(frames.size,0);
 assert.deepEqual(draws.at(-1),{time:6.8,winner:'b'});
});

test('reduced motion draws a static final result without scheduling animated frames',async()=>{
 const {scene,frames,draws,resolve}=rendererHarness({reduced:true});
 assert.equal(scene.play('w'),false);resolve({});await settle();
 assert.equal(scene.active,false);assert.equal(frames.size,0);
 assert.deepEqual(draws,[{time:6.8,winner:'w'}]);
});

test('hidden documents never start or resume a celebration',async()=>{
 const hidden=rendererHarness({hidden:true});
 assert.equal(hidden.scene.play('w'),false);hidden.resolve({});await settle();
 assert.equal(hidden.frames.size,0);assert.deepEqual(hidden.draws,[]);
 const loading=rendererHarness();loading.scene.play('w');loading.context.document.hidden=true;
 loading.resolve({});await settle();assert.equal(loading.scene.active,false);assert.equal(loading.frames.size,0);
 const running=rendererHarness();running.scene.play('w');running.resolve({});await settle();running.tick(1000);
 running.context.document.hidden=true;running.tick(1100);
 assert.equal(running.scene.active,false);assert.equal(running.frames.size,0);assert.equal(running.draws.length,1);
});

test('cancelled queued frames and failed assets leave no active overlay',async()=>{
 const running=rendererHarness();running.scene.play('w');running.resolve({});await settle();
 const stale=[...running.frames.values()][0];running.scene.stop();stale(1000);
 assert.equal(running.frames.size,0);assert.equal(running.scene.active,false);assert.deepEqual(running.draws,[]);
 const failed=rendererHarness();failed.scene.play('b');failed.reject(new Error('asset unavailable'));await settle();
 assert.equal(failed.scene.active,false);assert.equal(failed.frames.size,0);assert.deepEqual(failed.draws,[]);
});
