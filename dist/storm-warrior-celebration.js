import {prepareSixPoses} from './celebration-sprites.js';
// Animation 7: a sword sweep raises a vortex that carries the defeated king away.
const DURATION=7.4;
let sharedAssets=null;
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
function image(relative){return new Promise((resolve,reject)=>{
 const item=new Image();item.decoding='async';item.onload=()=>resolve(item);item.onerror=()=>reject(Error('Unable to load storm warrior celebration'));item.src=new URL(relative,import.meta.url).href;
});}
function loadAssets(){
 if(!sharedAssets)sharedAssets=Promise.all([image('./assets/storm-warrior/warrior6.png'),image('./assets/pieces/classic/wK.svg'),image('./assets/pieces/classic/bK.svg')])
  .then(([sheet,wK,bK])=>({frames:prepareSixPoses(sheet),wK,bK})).catch(error=>{sharedAssets=null;throw error;});
 return sharedAssets;
}
export function createStormWarriorScene(canvas,images){
 const ctx=canvas.getContext('2d');
 function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
 function warrior(t){
  const entry=smooth(t/1.25),index=t<1.25?Math.floor(t*5)%2:t<2?2:t<2.65?3:t<4.85?4:5;
  const f=images.frames[index],s=f.scale,x=202-300*(1-entry),y=176;
  ctx.save();ctx.globalAlpha=smooth(t/.3);ellipse(x,179,35,3,'#183b3716');ctx.drawImage(f.canvas,x+(f.left-f.foot[0])*s,y+(f.top-f.foot[1])*s,f.canvas.width*s,f.canvas.height*s);ctx.restore();
 }
 function wind(t,front){
  const strength=smooth((t-2)/.8)*(1-smooth((t-4.8)/1));if(strength<=0)return;
  ctx.save();ctx.globalAlpha=strength;ctx.lineCap='round';
  if(!front){
   const q=smooth((t-2)/.6);ctx.strokeStyle='#7dbab04d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(263,103);ctx.bezierCurveTo(293,75,319,146,348+q*48,138);ctx.stroke();
   ellipse(407,175,24+strength*10,4,'#829b9020');
  }
  for(let i=0;i<13;i++){
   const u=i/12,y=171-u*132,r=11+u*40,phase=t*5.5+i*.76;
   ctx.strokeStyle=i%3?'#7eaaa484':'#cadcdbb0';ctx.lineWidth=i%3?1:1.7;
   ctx.beginPath();let started=false;
   for(let k=0;k<=32;k++){
    const a=k/32*Math.PI*2+phase,isFront=Math.sin(a)>0;if(isFront!==front){started=false;continue;}
    const x=407+Math.cos(a)*r,sy=y+Math.sin(a)*(2+u*7);
    started?ctx.lineTo(x,sy):ctx.moveTo(x,sy);started=true;
   }ctx.stroke();
  }
  for(let i=0;i<23;i++){
   const u=(t*.22+i*.618)%1,a=t*(4+i%3*.2)+i*2.4;if((Math.sin(a)>0)!==front)continue;
   const r=12+u*39,x=407+Math.cos(a)*r,y=171-u*132+Math.sin(a)*u*5;
   ctx.strokeStyle=i%3?'#80a79ca0':'#b7c9b8b0';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a+.7)*3,y+Math.sin(a+.7));ctx.stroke();
  }ctx.restore();
 }
 function king(t,winner){
  const king=images[winner==='w'?'bK':'wK'],lift=smooth((t-2.65)/1.8),fade=1-smooth((t-4.05)/.65);if(fade<=0)return;
  ctx.save();ctx.globalAlpha=fade;
  const elapsed=Math.max(0,t-2.65),x=412+Math.sin(elapsed*9)*lift*11,y=128-lift*142;
  ctx.translate(x,y);ctx.rotate(elapsed*4.4*lift);const scale=1-lift*.42;ctx.scale(scale,scale);ctx.drawImage(king,-32,-32,64,64);ctx.restore();
 }
 return(time,winner)=>{
  const t=Math.max(0,Math.min(DURATION,time));ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,560,200);wind(t,false);king(t,winner);wind(t,true);warrior(t);
 };
}
export class StormWarriorCelebration {
 constructor(container){
  this.container=container;this.canvas=document.createElement('canvas');this.canvas.className='mate-storm-warrior';this.canvas.width=1120;this.canvas.height=400;this.canvas.hidden=true;this.canvas.setAttribute('aria-hidden','true');container.append(this.canvas);
  this.frame=null;this.generation=0;this._active=false;this.scene=null;loadAssets().catch(()=>{});
 }
 get active(){return this._active;}
 stop(){this.generation++;if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;this._active=false;}
 _draw(images,time,winner){this.scene??=createStormWarriorScene(this.canvas,images);this.scene(time,winner);this.canvas.hidden=false;}
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
