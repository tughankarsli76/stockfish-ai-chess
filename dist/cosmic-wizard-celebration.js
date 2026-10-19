import {prepareSixPoses} from './celebration-sprites.js';
// Animation 9: a violet orbital portal absorbs the defeated king.
const DURATION=7.6;
let sharedAssets=null;
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
function image(relative){return new Promise((resolve,reject)=>{
 const item=new Image();item.decoding='async';item.onload=()=>resolve(item);item.onerror=()=>reject(Error('Unable to load cosmic wizard celebration'));item.src=new URL(relative,import.meta.url).href;
});}
function loadAssets(){
 if(!sharedAssets)sharedAssets=Promise.all([image('./assets/cosmic-wizard/wizard6.png'),image('./assets/pieces/classic/wK.svg'),image('./assets/pieces/classic/bK.svg')])
  .then(([sheet,wK,bK])=>({frames:prepareSixPoses(sheet),wK,bK})).catch(error=>{sharedAssets=null;throw error;});
 return sharedAssets;
}
export function createCosmicWizardScene(canvas,images){
 const ctx=canvas.getContext('2d');
 function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
 function wizard(t){
  const entry=smooth(t/1.25),index=t<1.25?Math.floor(t*5)%2:t<2.2?2:t<4.6?3:t<5.6?4:5;
  const f=images.frames[index],s=f.scale,x=204-300*(1-entry),y=176;
  ctx.save();ctx.globalAlpha=smooth(t/.3);ellipse(x,179,34,3,'#36266716');ctx.drawImage(f.canvas,x+(f.left-f.foot[0])*s,y+(f.top-f.foot[1])*s,f.canvas.width*s,f.canvas.height*s);ctx.restore();
 }
 function portal(t,front){
  const strength=smooth((t-2.1)/.7)*(1-smooth((t-5)/.85));if(strength<=0)return;
  ctx.save();ctx.globalAlpha=strength;
  if(!front){
   const glow=ctx.createRadialGradient(414,118,0,414,118,65);glow.addColorStop(0,'#7d5bc52e');glow.addColorStop(.65,'#9d85d21a');glow.addColorStop(1,'#9d85d200');ctx.fillStyle=glow;ctx.fillRect(344,48,140,140);
   ctx.strokeStyle='#aa99d380';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(263,89);ctx.bezierCurveTo(300,75,337,146,368,115);ctx.stroke();
  }
  for(let ring=0;ring<3;ring++){
   const tilt=ring*.8+.25,rx=(36+ring*9)*strength,ry=(12+ring*5)*strength;
   ctx.strokeStyle=ring===1?'#9b83cbb0':'#bdabdce0';ctx.lineWidth=ring===1?1.5:1;
   ctx.beginPath();let started=false;
   for(let k=0;k<=70;k++){
    const a=k/70*Math.PI*2+t*.7,isFront=Math.sin(a)>0;if(isFront!==front){started=false;continue;}
    const ox=Math.cos(a)*rx,oy=Math.sin(a)*ry,x=414+ox*Math.cos(tilt)-oy*Math.sin(tilt),y=118+ox*Math.sin(tilt)+oy*Math.cos(tilt);
    started?ctx.lineTo(x,y):ctx.moveTo(x,y);started=true;
   }ctx.stroke();
  }
  for(let i=0;i<16;i++){
   const a=t*(1.6+i%3*.15)+i*2.4;if((Math.sin(a)>0)!==front)continue;
   const r=(30+i%4*6)*strength;ellipse(414+Math.cos(a)*r,118+Math.sin(a)*r*.7,.9+i%3*.4,.9+i%3*.4,i%3?'#a58ac8':'#d1c6ee');
  }ctx.restore();
 }
 function king(t,winner){
  const q=smooth((t-3)/1.7),fade=1-smooth((t-4.15)/.65);if(fade<=0)return;
  ctx.save();ctx.globalAlpha=fade;ctx.translate(414,130-q*12);ctx.rotate(q*4.8);const scale=1-q*.96;ctx.scale(scale,scale);ctx.drawImage(images[winner==='w'?'bK':'wK'],-32,-32,64,64);ctx.restore();
 }
 return(time,winner)=>{const t=Math.max(0,Math.min(DURATION,time));ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,560,200);portal(t,false);king(t,winner);portal(t,true);wizard(t);};
}
export class CosmicWizardCelebration {
 constructor(container){
  this.container=container;this.canvas=document.createElement('canvas');this.canvas.className='mate-cosmic-wizard';this.canvas.width=1120;this.canvas.height=400;this.canvas.hidden=true;this.canvas.setAttribute('aria-hidden','true');container.append(this.canvas);
  this.frame=null;this.generation=0;this._active=false;this.scene=null;loadAssets().catch(()=>{});
 }
 get active(){return this._active;}
 stop(){this.generation++;if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;this._active=false;}
 _draw(images,time,winner){this.scene??=createCosmicWizardScene(this.canvas,images);this.scene(time,winner);this.canvas.hidden=false;}
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
