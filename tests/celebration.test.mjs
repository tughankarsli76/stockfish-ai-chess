import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {GameSession} from '../dist/model.js';
import {createDragonScene} from '../dist/dragon-celebration.js';
import {createIceWizardScene} from '../dist/ice-wizard-celebration.js';
import {createLightningKnightScene} from '../dist/lightning-knight-celebration.js';
import {createPhoenixScene} from '../dist/phoenix-celebration.js';
import {createGorillaScene} from '../dist/gorilla-celebration.js';
import {createStormWarriorScene} from '../dist/storm-warrior-celebration.js';
import {createLionKingScene} from '../dist/lion-king-celebration.js';
import {createCosmicWizardScene} from '../dist/cosmic-wizard-celebration.js';
import {createEmeraldArcherScene} from '../dist/emerald-archer-celebration.js';
import {CELEBRATIONS} from '../dist/celebration-choice.js';

const celebrationSource=readFileSync(new URL('../dist/celebration.js',import.meta.url),'utf8');
const samuraiSource=readFileSync(new URL('../dist/samurai-celebration.js',import.meta.url),'utf8');
const dragonSource=readFileSync(new URL('../dist/dragon-celebration.js',import.meta.url),'utf8');
const iceWizardSource=readFileSync(new URL('../dist/ice-wizard-celebration.js',import.meta.url),'utf8');
const knightSource=readFileSync(new URL('../dist/lightning-knight-celebration.js',import.meta.url),'utf8');
const phoenixSource=readFileSync(new URL('../dist/phoenix-celebration.js',import.meta.url),'utf8');
const gorillaSource=readFileSync(new URL('../dist/gorilla-celebration.js',import.meta.url),'utf8');
const stormSource=readFileSync(new URL('../dist/storm-warrior-celebration.js',import.meta.url),'utf8');
const lionSource=readFileSync(new URL('../dist/lion-king-celebration.js',import.meta.url),'utf8');
const cosmicSource=readFileSync(new URL('../dist/cosmic-wizard-celebration.js',import.meta.url),'utf8');
const archerSource=readFileSync(new URL('../dist/emerald-archer-celebration.js',import.meta.url),'utf8');
function element(){
 const classes=new Set();
 return {dataset:{},children:[],hidden:false,style:{},offsetWidth:1,
  setAttribute(){},append(...children){this.children.push(...children);},
  getContext(){return {};},classList:{add:name=>classes.add(name),remove:name=>classes.delete(name),contains:name=>classes.has(name)}};
}
function resultHarness(choose=()=>'samurai'){
 const scenes=[],dragons=[],wizards=[],knights=[],phoenixes=[],gorillas=[],storms=[],lions=[],cosmics=[],archers=[],timers=new Map();let nextTimer=0;
 class FakeSamurai {
  constructor(container,collection=scenes){this.container=container;this.active=false;this.plays=[];this.finals=[];collection.push(this);}
  stop(){this.active=false;}
  play(winner){this.active=true;this.plays.push(winner);}
  renderFinal(winner){this.finals.push(winner);}
 }
 class FakeDragon extends FakeSamurai {constructor(container){super(container,dragons);}}
 class FakeIceWizard extends FakeSamurai {constructor(container){super(container,wizards);}}
 class FakeKnight extends FakeSamurai {constructor(container){super(container,knights);}}
 class FakePhoenix extends FakeSamurai {constructor(container){super(container,phoenixes);}}
 class FakeGorilla extends FakeSamurai {constructor(container){super(container,gorillas);}}
 class FakeStorm extends FakeSamurai {constructor(container){super(container,storms);}}
 class FakeLion extends FakeSamurai {constructor(container){super(container,lions);}}
 class FakeCosmic extends FakeSamurai {constructor(container){super(container,cosmics);}}
 class FakeArcher extends FakeSamurai {constructor(container){super(container,archers);}}
 const context={EmeraldArcherCelebration:FakeArcher,LionKingCelebration:FakeLion,CosmicWizardCelebration:FakeCosmic,GorillaCelebration:FakeGorilla,StormWarriorCelebration:FakeStorm,PhoenixCelebration:FakePhoenix,LightningKnightCelebration:FakeKnight,IceWizardCelebration:FakeIceWizard,DragonCelebration:FakeDragon,randomCelebration:choose,SamuraiCelebration:FakeSamurai,document:{hidden:false,createElement:element},matchMedia:()=>({matches:false}),
  setTimeout:fn=>{const id=++nextTimer;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id)};
 vm.createContext(context);
 vm.runInContext(celebrationSource.slice(celebrationSource.indexOf('export class CheckmateCelebration')).replace('export class','this.CheckmateCelebration=class'),context);
 const containers=['game','analysis'].map(view=>{const node=element();node.dataset.view=view;return node;});
 return {celebration:new context.CheckmateCelebration(containers),containers,scenes,dragons,wizards,knights,phoenixes,gorillas,storms,lions,cosmics,archers,timers,context};
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

test('disabling samurai replaces a running scene with the original animated king',()=>{
 const {celebration,containers,scenes,timers}=resultHarness(),position=mate('w');
 celebration.render(position);celebration.play('game');assert.equal(celebration.active,true);
 celebration.render(position,null,false);
 assert.equal(celebration.active,true);assert.equal(timers.size,1);
 assert.ok(containers.every(container=>!container.hidden&&container.dataset.animation==='king'));
 assert.ok(scenes.every(scene=>!scene.active));assert.deepEqual(scenes[1].plays,[]);
 assert.equal(containers[0].classList.contains('playing'),true);
 [...timers.values()][0]();assert.equal(celebration.active,false);
 assert.equal(containers[0].classList.contains('playing'),false);
 celebration.render(position,null,true);assert.equal(celebration.active,false);
 assert.ok(containers.every(container=>container.dataset.animation==='samurai'));
});

test('samurai off retains the winner-colored king for mates and time wins in both views',()=>{
 for(const winner of ['w','b'])for(const view of ['game','analysis'])for(const kind of ['mate','time']){
  const {celebration,containers,scenes,timers}=resultHarness(),position=kind==='mate'?mate(winner):new GameSession().position();
  const index=view==='game'?0:1;
  celebration.render(position,kind==='time'?winner:null,false);celebration.play(view);
  assert.equal(containers[index].hidden,false);assert.equal(containers[index].dataset.animation,'king');
  assert.equal(containers[index].dataset.winner,winner==='w'?'white':'black');
  assert.equal(celebration.active,true);assert.equal(timers.size,1);
  assert.ok(scenes.every(scene=>!scene.active&&scene.plays.length===0&&scene.finals.length===0));
  celebration.stop();assert.equal(celebration.active,false);assert.equal(timers.size,0);
 }
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

function rendererHarness({hidden=false,reduced=false,kind='samurai'}={}){
 let resolve,reject,nextFrame=0;
 const renderers={samurai:[samuraiSource,'SamuraiCelebration',6.8],dragon:[dragonSource,'DragonCelebration',7.2],'ice-wizard':[iceWizardSource,'IceWizardCelebration',7.4],'lightning-knight':[knightSource,'LightningKnightCelebration',7.2],phoenix:[phoenixSource,'PhoenixCelebration',7.4],gorilla:[gorillaSource,'GorillaCelebration',7.2],'storm-warrior':[stormSource,'StormWarriorCelebration',7.4],'lion-king':[lionSource,'LionKingCelebration',7.4],'cosmic-wizard':[cosmicSource,'CosmicWizardCelebration',7.6],'emerald-archer':[archerSource,'EmeraldArcherCelebration',7.6]};
 const [source,name,duration]=renderers[kind];
 const assets=new Promise((yes,no)=>{resolve=yes;reject=no;}),frames=new Map(),draws=[];
 const context={DURATION:duration,document:{hidden,createElement:element},matchMedia:()=>({matches:reduced}),loadAssets:()=>assets,
  requestAnimationFrame:fn=>{const id=++nextFrame;frames.set(id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id)};
 vm.createContext(context);

 vm.runInContext(source.slice(source.indexOf('export class '+name)).replace('export class','this.Scene=class'),context);
 const scene=new context.Scene(element());
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


test('dragon choice stays fixed across views, rerenders, history and animation toggles',()=>{
 let choices=0;const {celebration,containers,scenes,dragons}=resultHarness(()=>{choices++;return 'dragon';}),position=mate('w'),game={};
 celebration.render(position,null,true,'mate',game);celebration.play('game');
 assert.equal(choices,1);assert.ok(containers.every(c=>c.dataset.animation==='dragon'));assert.deepEqual(dragons[0].plays,['w']);assert.equal(celebration.active,true);
 celebration.render(position,null,true,'mate',game);celebration.play('analysis');
 assert.equal(choices,1);assert.deepEqual(dragons[1].plays,['w']);assert.equal(dragons[0].active,false);assert.ok(scenes.every(s=>s.plays.length===0));
 celebration.render(position,null,false,'mate',game);celebration.render(position,null,true,'mate',game);
 assert.equal(choices,1);assert.ok(containers.every(c=>c.dataset.animation==='dragon'));
 celebration.render(new GameSession().position(),null,true,'mate',game);celebration.render(position,null,true,'mate',game);
 assert.equal(choices,1);assert.ok(containers.every(c=>c.dataset.animation==='dragon'));
 celebration.stop();assert.equal(celebration.active,false);
});

test('every new game draws independently, including identical results and consecutive repeats',()=>{
 const queue=CELEBRATIONS.flatMap(name=>[name,name]);let choices=0;
 const {celebration,containers}=resultHarness(()=>queue[choices++]),position=mate('b');
 for(const expected of queue){celebration.render(position,null,true,'mate',{});assert.equal(containers[0].dataset.animation,expected);}
 assert.equal(choices,queue.length);
});

test('dragon lifecycle waits for assets, completes its full duration and cancels stale frames',async()=>{
 const {scene,resolve,tick,frames,draws}=rendererHarness({kind:'dragon'});
 scene.play('b');assert.equal(scene.active,true);resolve({});await settle();tick(1000);tick(8199);assert.equal(scene.active,true);
 tick(8200);assert.equal(scene.active,false);assert.equal(frames.size,0);assert.deepEqual(draws.at(-1),{time:7.2,winner:'b'});
 scene.play('w');await settle();const stale=[...frames.values()][0];scene.stop();stale(9000);assert.equal(scene.active,false);assert.equal(frames.size,0);
 const reduced=rendererHarness({kind:'dragon',reduced:true});reduced.scene.play('w');reduced.resolve({});await settle();assert.deepEqual(reduced.draws,[{time:7.2,winner:'w'}]);assert.equal(reduced.frames.size,0);
 const hidden=rendererHarness({kind:'dragon',hidden:true});assert.equal(hidden.scene.play('w'),false);
});

test('uniform random selection rejects biased remainder values and allows independent repeats',()=>{
 const source=readFileSync(new URL('../dist/celebration-choice.js',import.meta.url),'utf8'),n=CELEBRATIONS.length,limit=0x100000000-0x100000000%n;
 const rejected=Array.from({length:0x100000000-limit},(_,i)=>limit+i),values=[...Array.from({length:n},(_,i)=>i),...rejected,...Array.from({length:n},(_,i)=>n+i),limit-1];let calls=0;
 const c={crypto:{getRandomValues(array){assert.ok(calls<values.length);array[0]=values[calls++];return array;}}};vm.createContext(c);
 vm.runInContext(source.replaceAll('export ','')+'\nthis.pick=randomCelebration;',c);
 const expected=[...CELEBRATIONS,...CELEBRATIONS,CELEBRATIONS[n-1]];
 assert.deepEqual(expected.map(()=>c.pick()),expected);assert.equal(calls,values.length);
});


test('the dragon scene ends with only the dragon, never a starred winning king',()=>{
 const draws=[],text=[];
 const ctx=new Proxy({drawImage:image=>draws.push(image.name),fillText:label=>text.push(label),createLinearGradient:()=>({addColorStop(){}})},{get(target,key){return key in target?target[key]:()=>{};}});
 const images={wK:{name:'white king'},bK:{name:'black king'},frames:Array.from({length:8},()=>({canvas:{name:'dragon'},left:0,top:0,foot:[0,0],mouth:[0,0],scale:1}))};
 const draw=createDragonScene({getContext:()=>ctx},images);
 for(const winner of ['w','b']){
  draws.length=0;draw(0,winner);assert.ok(draws.includes(winner==='w'?'black king':'white king'));
  draws.length=0;draw(3.4,winner);assert.ok(draws.includes('dragon'));assert.ok(!draws.includes(winner==='w'?'white king':'black king'));
  for(const time of [5.5,6,7.2]){draws.length=0;draw(time,winner);assert.deepEqual(draws,['dragon']);}
 }
 assert.deepEqual(text,[],'No star symbols or winning-king labels are drawn inside the animated scene');
});


test('ice wizard handles either winning side in both views and retains the shared off mode',()=>{
 for(const side of ['w','b'])for(const view of ['game','analysis']){
  const {celebration,containers,wizards,scenes,dragons}=resultHarness(()=>'ice-wizard'),position=mate(side),index=view==='game'?0:1;
  celebration.render(position);celebration.play(view);
  assert.equal(containers[index].dataset.animation,'ice-wizard');assert.deepEqual(wizards[index].plays,[side]);assert.equal(celebration.active,true);
  assert.ok([...scenes,...dragons].every(s=>s.plays.length===0));
  celebration.render(position,null,false);assert.ok(containers.every(c=>c.dataset.animation==='king'));assert.ok(wizards.every(s=>!s.active));
 }
});

test('ice wizard freezes and fragments the defeated king, ending with only the wizard',()=>{
 const draws=[],text=[],ctx=new Proxy({drawImage:image=>draws.push(image.name),fillText:s=>text.push(s)},{get(target,key){return key in target?target[key]:()=>{};}});
 const images={wK:{name:'white king'},bK:{name:'black king'},icewK:{name:'white ice'},icebK:{name:'black ice'},frames:Array.from({length:6},()=>({canvas:{name:'wizard'},left:0,top:0,foot:[0,0],tip:[0,0],scale:1}))};
 const draw=createIceWizardScene({getContext:()=>ctx},images);
 for(const winner of ['w','b']){
  draws.length=0;draw(0,winner);assert.ok(draws.includes(winner==='w'?'black king':'white king'));
  draws.length=0;draw(3.5,winner);assert.ok(draws.includes(winner==='w'?'black ice':'white ice'));
  draws.length=0;draw(4.6,winner);assert.ok(draws.filter(x=>x===(winner==='w'?'black ice':'white ice')).length>1);
  draws.length=0;draw(7.4,winner);assert.deepEqual(draws,['wizard']);
 }
 assert.deepEqual(text,[]);
});

test('ice wizard cancels loading and stale frames, honors reduced motion and completes 7.4 seconds',async()=>{
 const cancelled=rendererHarness({kind:'ice-wizard'});cancelled.scene.play('w');cancelled.scene.stop();cancelled.resolve({});await settle();assert.equal(cancelled.frames.size,0);assert.deepEqual(cancelled.draws,[]);
 const {scene,resolve,tick,frames,draws}=rendererHarness({kind:'ice-wizard'});scene.play('b');assert.equal(scene.active,true);resolve({});await settle();tick(1000);tick(8399);assert.equal(scene.active,true);tick(8400);assert.equal(scene.active,false);assert.equal(frames.size,0);assert.deepEqual(draws.at(-1),{time:7.4,winner:'b'});
 const reduced=rendererHarness({kind:'ice-wizard',reduced:true});reduced.scene.play('w');reduced.resolve({});await settle();assert.equal(reduced.frames.size,0);assert.deepEqual(reduced.draws,[{time:7.4,winner:'w'}]);
 const hidden=rendererHarness({kind:'ice-wizard',hidden:true});assert.equal(hidden.scene.play('b'),false);
});


test('lightning knight plays for either winner, ends without a crowned king, and uses shared off mode',()=>{
 for(const winner of ['w','b']){
  const {celebration,containers,knights}=resultHarness(()=>'lightning-knight'),position=mate(winner);
  celebration.render(position);celebration.play('game');assert.deepEqual(knights[0].plays,[winner]);assert.equal(celebration.active,true);
  celebration.render(position,null,false);assert.ok(containers.every(c=>c.dataset.animation==='king'));assert.ok(knights.every(s=>!s.active));
 }
 const draws=[],text=[],ctx=new Proxy({drawImage:image=>draws.push(image.name),fillText:s=>text.push(s),createRadialGradient:()=>({addColorStop(){}})},{get(target,key){return key in target?target[key]:()=>{};}});
 const images={wK:{name:'white king'},bK:{name:'black king'},frames:Array.from({length:6},()=>({canvas:{name:'knight'},left:0,top:0,foot:[0,0],tip:[0,0],scale:1}))},draw=createLightningKnightScene({getContext:()=>ctx},images);
 for(const winner of ['w','b']){
  draws.length=0;draw(0,winner);assert.ok(draws.includes(winner==='w'?'black king':'white king'));
  draws.length=0;draw(3.6,winner);assert.ok(draws.filter(x=>x===(winner==='w'?'black king':'white king')).length>1);
  draws.length=0;draw(7.2,winner);assert.deepEqual(draws,['knight']);
 }
 assert.deepEqual(text,[]);
});

test('lightning knight preserves cancellation, reduced motion and its full duration',async()=>{
 const cancelled=rendererHarness({kind:'lightning-knight'});cancelled.scene.play('w');cancelled.scene.stop();cancelled.resolve({});await settle();assert.equal(cancelled.frames.size,0);assert.deepEqual(cancelled.draws,[]);
 const {scene,resolve,tick,frames,draws}=rendererHarness({kind:'lightning-knight'});scene.play('b');resolve({});await settle();tick(1000);tick(8199);assert.equal(scene.active,true);tick(8200);assert.equal(scene.active,false);assert.equal(frames.size,0);assert.deepEqual(draws.at(-1),{time:7.2,winner:'b'});
 const reduced=rendererHarness({kind:'lightning-knight',reduced:true});reduced.scene.play('w');reduced.resolve({});await settle();assert.equal(reduced.frames.size,0);assert.deepEqual(reduced.draws,[{time:7.2,winner:'w'}]);
 const hidden=rendererHarness({kind:'lightning-knight',hidden:true});assert.equal(hidden.scene.play('b'),false);
});


test('phoenix circles either defeated king and finishes with only the bird',()=>{
 const draws=[],text=[],ctx=new Proxy({drawImage:image=>draws.push(image.name),fillText:s=>text.push(s)},{get(target,key){return key in target?target[key]:()=>{};}});
 const images={wK:{name:'white king'},bK:{name:'black king'},frames:Array.from({length:6},()=>({canvas:{name:'phoenix'},left:0,top:0,scale:1}))},draw=createPhoenixScene({getContext:()=>ctx},images);
 for(const winner of ['w','b']){
  draws.length=0;draw(0,winner);assert.ok(draws.includes(winner==='w'?'black king':'white king'));
  draws.length=0;draw(3.6,winner);assert.ok(draws.includes('phoenix'));assert.ok(draws.includes(winner==='w'?'black king':'white king'));
  draws.length=0;draw(7.4,winner);assert.deepEqual(draws,['phoenix']);
 }
 assert.deepEqual(text,[]);
});

test('phoenix follows the shared result-view and animations-off policy',()=>{
 for(const winner of ['w','b'])for(const view of ['game','analysis']){
  const {celebration,containers,phoenixes}=resultHarness(()=>'phoenix'),position=mate(winner),index=view==='game'?0:1;
  celebration.render(position);celebration.play(view);assert.equal(containers[index].dataset.animation,'phoenix');assert.deepEqual(phoenixes[index].plays,[winner]);assert.equal(celebration.active,true);
  celebration.render(position,null,false);assert.ok(containers.every(c=>c.dataset.animation==='king'));assert.ok(phoenixes.every(s=>!s.active));
 }
});

test('phoenix preserves loading cancellation, reduced motion, background stopping and duration',async()=>{
 const cancelled=rendererHarness({kind:'phoenix'});cancelled.scene.play('w');cancelled.scene.stop();cancelled.resolve({});await settle();assert.equal(cancelled.frames.size,0);assert.deepEqual(cancelled.draws,[]);
 const {scene,resolve,tick,frames,draws,context}=rendererHarness({kind:'phoenix'});scene.play('b');resolve({});await settle();tick(1000);tick(8399);assert.equal(scene.active,true);tick(8400);assert.equal(scene.active,false);assert.equal(frames.size,0);assert.deepEqual(draws.at(-1),{time:7.4,winner:'b'});
 scene.play('w');await settle();tick(9000);context.document.hidden=true;tick(9100);assert.equal(scene.active,false);assert.equal(frames.size,0);
 const reduced=rendererHarness({kind:'phoenix',reduced:true});reduced.scene.play('w');reduced.resolve({});await settle();assert.equal(reduced.frames.size,0);assert.deepEqual(reduced.draws,[{time:7.4,winner:'w'}]);
});


for(const [kind,createScene,collection,duration] of [['gorilla',createGorillaScene,'gorillas',7.2],['storm-warrior',createStormWarriorScene,'storms',7.4],['lion-king',createLionKingScene,'lions',7.4],['cosmic-wizard',createCosmicWizardScene,'cosmics',7.6],['emerald-archer',createEmeraldArcherScene,'archers',7.6]]){
 test(kind+' affects only the defeated king and follows the shared result policy',()=>{
  for(const winner of ['w','b'])for(const view of ['game','analysis']){
   const h=resultHarness(()=>kind),position=mate(winner),index=view==='game'?0:1;
   h.celebration.render(position);h.celebration.play(view);assert.deepEqual(h[collection][index].plays,[winner]);assert.equal(h.celebration.active,true);
   h.celebration.render(position,null,false);assert.ok(h.containers.every(c=>c.dataset.animation==='king'));assert.ok(h[collection].every(s=>!s.active));
  }
  const draws=[],text=[],translations=[],rotations=[],scales=[],ctx=new Proxy({drawImage:image=>draws.push(image.name),fillText:s=>text.push(s),translate:(x,y)=>translations.push({x,y}),rotate:r=>rotations.push(r),scale:(x,y)=>scales.push({x,y}),createRadialGradient:()=>({addColorStop(){}})},{get(target,key){return key in target?target[key]:()=>{};}});
  const images={wK:{name:'white king'},bK:{name:'black king'},emeraldwK:{name:'white crystal'},emeraldbK:{name:'black crystal'},frames:Array.from({length:6},()=>({canvas:{name:'figure'},left:0,top:0,foot:[0,0],scale:1}))},draw=createScene({getContext:()=>ctx},images);
  for(const winner of ['w','b']){
   draws.length=0;draw(0,winner);assert.ok(draws.includes(winner==='w'?'black king':'white king'));
   translations.length=0;rotations.length=0;draw(3.8,winner);
   if(kind==='storm-warrior')assert.ok(translations[0].y<128,'the vortex must lift the king');
   else if(kind==='lion-king')assert.ok(translations[0].x>440,'the roar must send the defeated king away');
   else if(kind==='cosmic-wizard')assert.ok(scales.at(-1).x<.6,'the portal must shrink the defeated king');
   else if(kind==='emerald-archer'){
    const defeated=winner==='w'?'black crystal':'white crystal';assert.ok(draws.includes(defeated),'the defeated king must crystallize');
    draws.length=0;draw(4.6,winner);assert.ok(draws.filter(x=>x===defeated).length>1,'the crystallized king must break into shards');
    assert.ok(!draws.includes(winner==='w'?'white crystal':'black crystal'));
   }
   else assert.ok(rotations.some(r=>r>0.5),'the slam must topple the king');
   draws.length=0;draw(duration,winner);assert.deepEqual(draws,['figure']);
  }
  assert.deepEqual(text,[]);
 });
 test(kind+' honors loading cancellation, reduced motion and the complete duration',async()=>{
  const cancelled=rendererHarness({kind});cancelled.scene.play('w');cancelled.scene.stop();cancelled.resolve({});await settle();assert.equal(cancelled.frames.size,0);assert.deepEqual(cancelled.draws,[]);
  const {scene,resolve,tick,frames,draws}=rendererHarness({kind});scene.play('b');resolve({});await settle();tick(1000);tick(1000+duration*1000-1);assert.equal(scene.active,true);tick(1000+duration*1000);assert.equal(scene.active,false);assert.equal(frames.size,0);assert.deepEqual(draws.at(-1),{time:duration,winner:'b'});
  const reduced=rendererHarness({kind,reduced:true});reduced.scene.play('w');reduced.resolve({});await settle();assert.equal(reduced.frames.size,0);assert.deepEqual(reduced.draws,[{time:duration,winner:'w'}]);
 });
}
