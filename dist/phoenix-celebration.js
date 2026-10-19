import {prepareSixPoses} from './celebration-sprites.js';
// Animation 5: the phoenix circles the defeated king with a ring of fire.
const DURATION=7.4;
let sharedAssets=null;
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
function image(relative){return new Promise((resolve,reject)=>{
 const item=new Image();item.decoding='async';item.onload=()=>resolve(item);item.onerror=()=>reject(Error('Unable to load phoenix celebration'));item.src=new URL(relative,import.meta.url).href;
});}
function loadAssets(){
 if(!sharedAssets)sharedAssets=Promise.all([image('./assets/phoenix/phoenix6.png'),image('./assets/pieces/classic/wK.svg'),image('./assets/pieces/classic/bK.svg')])
  .then(([sheet,wK,bK])=>({frames:prepareSixPoses(sheet),wK,bK})).catch(error=>{sharedAssets=null;throw error;});
 return sharedAssets;
}
export function createPhoenixScene(canvas,images){
 const ctx=canvas.getContext('2d');
 function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
 function birdState(t){
  const entry=smooth(t/1.4),orbit=clamp((t-1.65)/2.9),angle=Math.PI+orbit*Math.PI*2;
  let x=205-290*(1-entry),y=103-Math.sin(t*5)*3,direction=1;
  if(t>=1.4&&t<1.65){const q=smooth((t-1.4)/.25);x=205+(328-205)*q;y=103+25*q;}
  else if(t>=1.65&&t<4.55){x=398+Math.cos(angle)*70;y=128+Math.sin(angle)*31;direction=-Math.sin(angle)>=0?1:-1;}
  else if(t>=4.55){const q=smooth((t-4.55)/.95);x=328+(205-328)*q;y=128+(105-128)*q;direction=q<.8?-1:1;}
  const index=t>=5.5?5:t>=1.65&&t<4.55?[3,4,1,2][Math.floor(t*6)%4]:[0,1,2,1][Math.floor(t*6)%4];
  return {x,y,direction,index};
 }
 function bird(t){
  const p=birdState(t),f=images.frames[p.index],s=f.scale*.83;
  ctx.save();ctx.globalAlpha=smooth(t/.3);ctx.translate(p.x,p.y);ctx.scale(p.direction,1);
  const centerX=f.left+f.canvas.width*.49,centerY=f.top+f.canvas.height*.46;
  ctx.drawImage(f.canvas,(f.left-centerX)*s,(f.top-centerY)*s,f.canvas.width*s,f.canvas.height*s);ctx.restore();
 }
 function fireRing(t){
  const progress=clamp((t-1.65)/2.9),strength=smooth((t-1.8)/.5)*(1-smooth((t-4.6)/.75));if(strength<=0)return;
  ctx.save();ctx.lineCap='round';
  for(const [width,color]of [[13,'#f2a93422'],[5,'#ec8e35b0'],[1.8,'#ffd289e0']]){
   ctx.globalAlpha=strength;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();
   for(let i=0;i<=64;i++){const a=Math.PI+i/64*Math.PI*2*progress,wave=Math.sin(a*12-t*7)*1.4,x=398+Math.cos(a)*(71+wave),y=130+Math.sin(a)*(35+wave*.5);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  }
  for(let i=0;i<28;i++){
   const a=Math.PI+i/27*Math.PI*2*progress,q=(t*.5+i*.618)%1,x=398+Math.cos(a)*(72+q*8),y=130+Math.sin(a)*36-q*13;
   ctx.globalAlpha=strength*(1-q)*.8;ellipse(x,y,.8+i%2*.55,1.2+i%3*.35,i%3?'#eeb55f':'#fbe0a0');
  }
  ctx.restore();
 }
 function king(t,winner){
  const king=images[winner==='w'?'bK':'wK'],burn=smooth((t-3.3)/1.3);
  if(burn<1){
   ctx.save();ctx.globalAlpha=1-burn;ellipse(398,165,27,3,'#30231d17');ctx.translate(398,128+burn*15);ctx.rotate(burn*.12);ctx.drawImage(king,-32,-32,64,64);ctx.restore();
  }
  if(t>3.3&&t<6){
   const q=t-3.3,alpha=smooth(q/.5)*(1-smooth((q-1.3)/1.4));ctx.save();ctx.globalAlpha=alpha;
   for(let i=0;i<32;i++){
    const x=398+Math.sin(i*2.4)*(9+q*(6+i%5)),y=133+Math.cos(i*2.4)*q*10-q*(8+i%4*4);
    ellipse(x,y,.7+i%3*.35,.5+i%2*.3,i%4?'#81776b':'#da9b56');
   }ctx.restore();
  }
 }
 return(time,winner)=>{
  const t=Math.max(0,Math.min(DURATION,time));ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,560,200);fireRing(t);king(t,winner);bird(t);
 };
}
export class PhoenixCelebration {
 constructor(container){
  this.container=container;this.canvas=document.createElement('canvas');this.canvas.className='mate-phoenix';this.canvas.width=1120;this.canvas.height=400;this.canvas.hidden=true;this.canvas.setAttribute('aria-hidden','true');container.append(this.canvas);
  this.frame=null;this.generation=0;this._active=false;this.scene=null;loadAssets().catch(()=>{});
 }
 get active(){return this._active;}
 stop(){this.generation++;if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;this._active=false;}
 _draw(images,time,winner){this.scene??=createPhoenixScene(this.canvas,images);this.scene(time,winner);this.canvas.hidden=false;}
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
