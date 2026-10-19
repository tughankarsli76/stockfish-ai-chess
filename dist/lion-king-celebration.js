import {prepareSixPoses} from './celebration-sprites.js';
// Animation 8: the lion's roar sends the defeated king tumbling away.
const DURATION=7.4;
let sharedAssets=null;
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
function image(relative){return new Promise((resolve,reject)=>{
 const item=new Image();item.decoding='async';item.onload=()=>resolve(item);item.onerror=()=>reject(Error('Unable to load lion king celebration'));item.src=new URL(relative,import.meta.url).href;
});}
function loadAssets(){
 if(!sharedAssets)sharedAssets=Promise.all([image('./assets/lion-king/lion6.png'),image('./assets/pieces/classic/wK.svg'),image('./assets/pieces/classic/bK.svg')])
  .then(([sheet,wK,bK])=>({frames:prepareSixPoses(sheet),wK,bK})).catch(error=>{sharedAssets=null;throw error;});
 return sharedAssets;
}
export function createLionKingScene(canvas,images){
 const ctx=canvas.getContext('2d');
 function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
 function lion(t){
  const entry=smooth(t/1.3),index=t<1.3?Math.floor(t*5)%2:t<2.2?2:t<3.8?3:t<4.8?4:5;
  const f=images.frames[index],s=f.scale,x=207-310*(1-entry),roar=t>=2.2&&t<3.8?Math.sin(t*30)*.7:0,y=176+roar;
  ctx.save();ctx.globalAlpha=smooth(t/.3);ellipse(x,179,48,3.5,'#8c65331c');ctx.drawImage(f.canvas,x+(f.left-f.foot[0])*s,y+(f.top-f.foot[1])*s,f.canvas.width*s,f.canvas.height*s);ctx.restore();
 }
 function roar(t){
  ctx.save();ctx.lineCap='round';
  for(let i=0;i<8;i++){
   const q=(t-2.3-i*.16)/1.05;if(q<=0||q>=1)continue;
   const x=280+q*213,ry=12+q*52;ctx.globalAlpha=Math.sin(q*Math.PI)*.57;ctx.strokeStyle=i%2?'#d2ac61':'#ecd09a';ctx.lineWidth=1.8;
   ctx.beginPath();ctx.ellipse(x,103,4+q*12,ry,0,-1.25,1.25);ctx.stroke();
  }
  const q=clamp((t-2.8)/1.5);if(q>0&&q<1){
   ctx.globalAlpha=(1-q)*.65;
   for(let i=0;i<18;i++){const x=390+q*(35+i*3),y=134+Math.sin(i*2.4)*(6+q*22);ellipse(x,y,1.3,.7,i%2?'#c6a06a':'#e9d4aa');}
  }ctx.restore();
 }
 function king(t,winner){
  const elapsed=Math.max(0,t-2.95),fall=smooth(elapsed/1.25),fade=1-smooth((t-4.05)/.7);if(fade<=0)return;
  ctx.save();ctx.globalAlpha=fade;const shake=t>2.65&&t<3.2?Math.sin(t*45)*1.4:0;
  ctx.translate(409+fall*87+shake,164-Math.sin(fall*Math.PI)*37);ctx.rotate(fall*2.15);ctx.drawImage(images[winner==='w'?'bK':'wK'],-32,-64,64,64);ctx.restore();
 }
 return(time,winner)=>{const t=Math.max(0,Math.min(DURATION,time));ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,560,200);king(t,winner);roar(t);lion(t);};
}
export class LionKingCelebration {
 constructor(container){
  this.container=container;this.canvas=document.createElement('canvas');this.canvas.className='mate-lion-king';this.canvas.width=1120;this.canvas.height=400;this.canvas.hidden=true;this.canvas.setAttribute('aria-hidden','true');container.append(this.canvas);
  this.frame=null;this.generation=0;this._active=false;this.scene=null;loadAssets().catch(()=>{});
 }
 get active(){return this._active;}
 stop(){this.generation++;if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;this._active=false;}
 _draw(images,time,winner){this.scene??=createLionKingScene(this.canvas,images);this.scene(time,winner);this.canvas.hidden=false;}
 renderFinal(winner){this.stop();const generation=this.generation;return loadAssets().then(images=>{if(generation!==this.generation)return false;this._draw(images,DURATION,winner);return true;}).catch(()=>false);}
 play(winner){
  this.stop();if(document.hidden)return false;if(matchMedia('(prefers-reduced-motion: reduce)').matches){this.renderFinal(winner);return false;}if(!this.canvas.getContext('2d'))return false;
  const generation=this.generation;this._active=true;
  loadAssets().then(images=>{
   if(generation!==this.generation)return;if(document.hidden){this.stop();return;}let started=null;
   const draw=now=>{if(generation!==this.generation)return;if(document.hidden){this.stop();return;}started??=now;const elapsed=Math.min(DURATION,(now-started)/1000);this._draw(images,elapsed,winner);if(elapsed<DURATION)this.frame=requestAnimationFrame(draw);else{this.frame=null;this._active=false;}};
   this.frame=requestAnimationFrame(draw);
  }).catch(()=>{if(generation===this.generation)this._active=false;});return true;
 }
}
