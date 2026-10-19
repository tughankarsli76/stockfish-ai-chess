import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createGorillaScene} from '../dist/gorilla-celebration.js';

const controllerSource=readFileSync(new URL('../dist/celebration.js',import.meta.url),'utf8');
const gorillaSource=readFileSync(new URL('../dist/gorilla-celebration.js',import.meta.url),'utf8');
const settle=async()=>{for(let i=0;i<5;i++)await Promise.resolve();};

// Keep the real controller, renderer and cancellation generations. Only browser
// drawing, assets and the frame clock are simulated; other scene types stay idle.
function coldResult({reduced=false}={}){
 let resolve,nextFrame=0;
 const assets=new Promise(done=>resolve=done),frames=new Map();
 function element(){
  const node={dataset:{},children:[],hidden:false,draws:[],offsetWidth:1,
   setAttribute(){},append(...children){this.children.push(...children);},
   classList:{add(){},remove(){}}};
  const ctx=new Proxy({clearRect(){node.draws.length=0;},drawImage(image){node.draws.push(image.name);}},{get:(target,key)=>key in target?target[key]:()=>{}});
  node.getContext=()=>ctx;return node;
 }
 class IdleScene{stop(){}renderFinal(){}play(){}}
 const context={DURATION:7.2,createGorillaScene,loadAssets:()=>assets,
  document:{hidden:false,createElement:element},matchMedia:()=>({matches:reduced}),
  requestAnimationFrame:callback=>{frames.set(++nextFrame,callback);return nextFrame;},
  cancelAnimationFrame:id=>frames.delete(id),clearTimeout(){},setTimeout(){},randomCelebration:()=> 'gorilla'};
 for(const [,name]of controllerSource.matchAll(/^import \{([A-Z]\w*Celebration)\}/gm))context[name]=IdleScene;
 vm.createContext(context);
 vm.runInContext(gorillaSource.slice(gorillaSource.indexOf('export class GorillaCelebration')).replace('export class','this.GorillaCelebration=class'),context);
 vm.runInContext(controllerSource.slice(controllerSource.indexOf('export class CheckmateCelebration')).replace('export class','this.CheckmateCelebration=class'),context);
 const containers=['game','analysis'].map(view=>{const node=element();node.dataset.view=view;return node;});
 const controller=new context.CheckmateCelebration(containers),position={isCheckmate:()=>true,turn:()=> 'b',fen:()=> 'unchanged decisive position'};
 const canvases=containers.map(container=>controller.scenes.get(container).gorilla.canvas);
 const load=async()=>{
  resolve({wK:{name:'white king'},bK:{name:'black king'},frames:Array.from({length:6},()=>({canvas:{name:'gorilla'},left:0,top:0,foot:[0,0],scale:1}))});await settle();
 };
 const tick=now=>{assert.equal(frames.size,1);const [id,draw]=frames.entries().next().value;frames.delete(id);draw(now);};
 return {controller,position,canvases,frames,load,tick};
}

for(const switchBeforeLoad of [true,false]){
 test('switching result views '+(switchBeforeLoad?'before assets load':'after playback begins')+' leaves a final scene in both views',async()=>{
  const h=coldResult();h.controller.render(h.position);h.controller.play('game');
  assert.ok(h.canvases.every(canvas=>canvas.hidden),'both canvases initially wait for their assets');
  if(!switchBeforeLoad){await h.load();h.tick(0);assert.equal(h.canvases[0].hidden,false);}
  // setTab settles the old result, then renders the same position in Analysis.
  h.controller.stop();h.controller.render(h.position);
  if(switchBeforeLoad)await h.load();else await settle();
  assert.equal(h.controller.active,false);assert.equal(h.frames.size,0);
  for(const canvas of h.canvases){assert.equal(canvas.hidden,false);assert.deepEqual(canvas.draws,['gorilla'],'the static ending must contain only the selected character');}
 });
}

test('reduced motion preserves both static result scenes when play is requested before assets load',async()=>{
 const h=coldResult({reduced:true});h.controller.render(h.position);h.controller.play('game');
 assert.equal(h.controller.active,false);await h.load();
 assert.equal(h.frames.size,0);
 for(const canvas of h.canvases){assert.equal(canvas.hidden,false);assert.deepEqual(canvas.draws,['gorilla']);}
});
