import {prepareSixPoses} from './celebration-sprites.js';
// Animation 4: a hammer strike calls lightning onto the defeated king.
const DURATION=7.2;
let sharedAssets=null;
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
function image(relative){return new Promise((resolve,reject)=>{
 const item=new Image();item.decoding='async';item.onload=()=>resolve(item);item.onerror=()=>reject(Error('Unable to load lightning knight celebration'));item.src=new URL(relative,import.meta.url).href;
});}
function loadAssets(){
 if(!sharedAssets)sharedAssets=Promise.all([image('./assets/lightning-knight/knight6.png'),image('./assets/pieces/classic/wK.svg'),image('./assets/pieces/classic/bK.svg')])
  .then(([sheet,wK,bK])=>({frames:prepareSixPoses(sheet,'blue'),wK,bK})).catch(error=>{sharedAssets=null;throw error;});
 return sharedAssets;
}
export function createLightningKnightScene(canvas,images){
 const ctx=canvas.getContext('2d');
 function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
 function knight(t){
  const entry=smooth(t/1.25),index=t<1.25?Math.floor(t*6)%2:t<1.85?2:t<2.6?3:t<4.85?4:5;
  const f=images.frames[index],x=204-300*(1-entry),y=176+(t>2.6&&t<3?3*Math.sin((t-2.6)*Math.PI/.4):0),s=f.scale;
  ctx.save();ctx.globalAlpha=smooth(t/.3);ellipse(x,179,36,3,'#19273a17');ctx.drawImage(f.canvas,x+(f.left-f.foot[0])*s,y+(f.top-f.foot[1])*s,f.canvas.width*s,f.canvas.height*s);ctx.restore();
  return {x:x+(f.tip[0]-f.foot[0])*s,y:y+(f.tip[1]-f.foot[1])*s};
 }
 function lightning(t,tip){
  const strength=smooth((t-2.6)/.16)*(1-smooth((t-3.35)/.5));if(strength<=0)return;
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  const points=[[tip.x,tip.y],[tip.x+26,tip.y-29],[tip.x+9,tip.y-56],[tip.x+61,22],[365,8],[349,42],[385,66],[374,90],[411,124]];
  for(const [width,color]of [[12,'#8dbdff25'],[5,'#75bbff90'],[1.8,'#e7f5ffff']]){
   ctx.globalAlpha=strength;ctx.strokeStyle=color;ctx.lineWidth=width;
   ctx.beginPath();points.forEach(([x,y],i)=>{const shake=i===0||i===points.length-1?0:Math.sin(t*9+i*2.4)*2;i?ctx.lineTo(x+shake,y):ctx.moveTo(x,y);});ctx.stroke();
  }
  ctx.strokeStyle='#a7d5ff';ctx.lineWidth=1;ctx.globalAlpha=strength*.75;
  for(const path of [[[385,66],[415,53],[429,62]],[[349,42],[330,32],[319,43]],[[374,90],[354,104],[361,116]]]){ctx.beginPath();path.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
  const glow=ctx.createRadialGradient(412,128,2,412,128,36);glow.addColorStop(0,'#d8eaff88');glow.addColorStop(1,'#7dbbff00');ellipse(412,128,36,33,glow);ctx.restore();
 }
 function defeatedKing(t,winner){
  const king=images[winner==='w'?'bK':'wK'],elapsed=t-3.15;
  if(elapsed<0){ctx.save();ellipse(412,165,28,3,'#182a4417');ctx.translate(412+(t>2.7?Math.sin(t*37)*1.5:0),128);ctx.rotate(t>2.7?Math.sin(t*32)*.025:0);ctx.drawImage(king,-32,-32,64,64);ctx.restore();}
  else if(elapsed<2.2){
   ctx.save();ctx.globalAlpha=1-smooth((elapsed-.8)/1.4);
   for(let i=0;i<30;i++){
    const col=i%5,row=Math.floor(i/5),vx=(col-2)*25+Math.sin(i*4.7)*18,vy=-35-(i%7)*11;
    ctx.save();ctx.translate(412+vx*elapsed,128+vy*elapsed+90*elapsed*elapsed);ctx.rotate(Math.sin(i*2.4)*elapsed*2.5);
    ctx.beginPath();ctx.rect(-32+col*13,-32+row*11,13,11);ctx.clip();ctx.drawImage(king,-32,-32,64,64);ctx.restore();
   }
   for(let i=0;i<19;i++){
    const a=i*2.399,r=8+elapsed*(22+i%5*8),x=412+Math.cos(a)*r,y=128+Math.sin(a)*r*.65+elapsed*elapsed*14;
    ctx.strokeStyle=i%2?'#4f9bdf':'#bbdeff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*3,y+Math.sin(a)*3);ctx.stroke();
   }
   ctx.restore();
  }
 }
 return(time,winner)=>{
  const t=Math.max(0,Math.min(DURATION,time));ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,560,200);defeatedKing(t,winner);const tip=knight(t);lightning(t,tip);
 };
}
export class LightningKnightCelebration {
 constructor(container){
  this.container=container;this.canvas=document.createElement('canvas');this.canvas.className='mate-lightning-knight';this.canvas.width=1120;this.canvas.height=400;this.canvas.hidden=true;this.canvas.setAttribute('aria-hidden','true');container.append(this.canvas);
  this.frame=null;this.generation=0;this._active=false;this.scene=null;loadAssets().catch(()=>{});
 }
 get active(){return this._active;}
 stop(){this.generation++;if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;this._active=false;}
 _draw(images,time,winner){this.scene??=createLightningKnightScene(this.canvas,images);this.scene(time,winner);this.canvas.hidden=false;}
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
