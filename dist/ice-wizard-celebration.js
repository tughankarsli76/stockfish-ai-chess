import {prepareSixPoses} from './celebration-sprites.js';
// Animation 3: the ice wizard freezes the defeated king and shatters it.
const DURATION=7.4;
let sharedAssets=null;
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
function image(relative){return new Promise((resolve,reject)=>{
 const item=new Image();item.decoding='async';item.onload=()=>resolve(item);item.onerror=()=>reject(Error('Unable to load ice wizard celebration'));
 item.src=new URL(relative,import.meta.url).href;
});}
function frozenKing(source){
 const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const ctx=canvas.getContext('2d');ctx.drawImage(source,0,0,128,128);
 ctx.globalCompositeOperation='source-atop';const fill=ctx.createLinearGradient(0,0,128,128);
 fill.addColorStop(0,'#e7fbff');fill.addColorStop(.4,'#85d8f0');fill.addColorStop(.7,'#d1f5ff');fill.addColorStop(1,'#388ba7');ctx.fillStyle=fill;ctx.fillRect(0,0,128,128);return canvas;
}

function loadAssets(){
 if(!sharedAssets)sharedAssets=Promise.all([image('./assets/ice-wizard/icewizard6.png'),image('./assets/pieces/classic/wK.svg'),image('./assets/pieces/classic/bK.svg')])
  .then(([sheet,wK,bK])=>({frames:prepareSixPoses(sheet),wK,bK,icewK:frozenKing(wK),icebK:frozenKing(bK)})).catch(error=>{sharedAssets=null;throw error;});
 return sharedAssets;
}
export function createIceWizardScene(canvas,images){
 const ctx=canvas.getContext('2d');
 function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
 function wizard(t){
  const arrival=smooth(t/1.35),index=t<1.35?Math.floor(t*6)%2:t<2.25?2:t<4.7?3+Math.floor(t*5)%2:t<5.3?4:5;
  const frame=images.frames[index],x=205-300*(1-arrival),y=176-(t<1.35?Math.sin(t*11)*2:0),s=frame.scale;
  ctx.save();ctx.globalAlpha=smooth(t/.3);ellipse(x,179,39,3,'#173b4e16');ctx.drawImage(frame.canvas,x+(frame.left-frame.foot[0])*s,y+(frame.top-frame.foot[1])*s,frame.canvas.width*s,frame.canvas.height*s);ctx.restore();
  return {x:x+(frame.tip[0]-frame.foot[0])*s,y:y+(frame.tip[1]-frame.foot[1])*s};
 }
 function spell(t,tip){
  const strength=smooth((t-2.25)/.45)*(1-smooth((t-3.7)/.55));if(strength<=0)return;
  const reach=smooth((t-2.25)/.6),end={x:tip.x+(412-tip.x)*reach,y:tip.y+(127-tip.y)*reach};
  ctx.save();ctx.lineCap='round';
  for(const [width,color]of [[16,'#9ce7f52a'],[7,'#a9f1ff88'],[2,'#edfdffff']]){
   ctx.strokeStyle=color;ctx.lineWidth=width*strength;ctx.beginPath();ctx.moveTo(tip.x,tip.y);ctx.bezierCurveTo(tip.x+60,tip.y-13,end.x-45,end.y+12,end.x,end.y);ctx.stroke();
  }
  for(let i=0;i<21;i++){
   const q=(t*.75+i*.618)%1,x=tip.x+(end.x-tip.x)*q,y=tip.y+(end.y-tip.y)*q+Math.sin(t*3+i*2.4)*q*14,size=1+i%3*.65;
   ctx.globalAlpha=strength*(1-q*.7);ctx.strokeStyle='#72c9e5';ctx.lineWidth=.8;
   for(let k=0;k<3;k++){const a=k*Math.PI/3+t*.2;ctx.beginPath();ctx.moveTo(x-Math.cos(a)*size,y-Math.sin(a)*size);ctx.lineTo(x+Math.cos(a)*size,y+Math.sin(a)*size);ctx.stroke();}
  }
  ctx.restore();
 }
 function frost(t,winner){
  const king=images[winner==='w'?'bK':'wK'],ice=images[winner==='w'?'icebK':'icewK'],freeze=smooth((t-2.8)/.8),burst=t-4.35;
  if(burst<0){
   ellipse(412,165,28,3,'#19384a16');ctx.drawImage(king,380,96,64,64);
   if(freeze>0){
    ctx.save();ctx.globalAlpha=freeze;ctx.drawImage(ice,380,96,64,64);
    ctx.beginPath();ctx.moveTo(383,157);ctx.lineTo(379,104);ctx.lineTo(399,88);ctx.lineTo(433,98);ctx.lineTo(447,153);ctx.lineTo(427,169);ctx.closePath();ctx.fillStyle='#bcefff33';ctx.fill();ctx.strokeStyle='#7ecbdda0';ctx.lineWidth=1;ctx.stroke();
    if(t>3.7){ctx.globalAlpha=smooth((t-3.7)/.5);ctx.strokeStyle='#287f9bc0';ctx.lineWidth=1;for(const path of [[[399,90],[410,119],[395,137],[405,163]],[[410,119],[433,126],[445,154]],[[395,137],[381,146]]]){ctx.beginPath();path.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}}
    ctx.restore();
   }
  }else if(burst<2.1){
   ctx.save();ctx.globalAlpha=1-smooth((burst-.75)/1.35);
   for(let i=0;i<35;i++){
    const col=i%5,row=Math.floor(i/5),vx=(col-2)*26+Math.sin(i*4.9)*20,vy=-45-(i%7)*12;
    ctx.save();ctx.translate(412+vx*burst,128+vy*burst+95*burst*burst);ctx.rotate(Math.sin(i*2.4)*burst*2);
    ctx.beginPath();ctx.rect(-35+col*14,-38+row*11,14,11);ctx.clip();ctx.drawImage(ice,-32,-32,64,64);ctx.restore();
   }
   for(let i=0;i<12;i++){
    const x=412+Math.cos(i*2.4)*(8+burst*55),y=132+Math.sin(i*2.4)*burst*45-70*burst+90*burst*burst,s=2+i%3;
    ctx.beginPath();ctx.moveTo(x,y-s*2);ctx.lineTo(x+s,y);ctx.lineTo(x,y+s*2);ctx.lineTo(x-s,y);ctx.closePath();ctx.fillStyle=i%2?'#83cee7':'#c8eff8';ctx.fill();
   }
   ctx.restore();
  }
 }
 return (time,winner)=>{
  const t=Math.max(0,Math.min(DURATION,time));ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,560,200);
  frost(t,winner);const tip=wizard(t);spell(t,tip);
 };
}
export class IceWizardCelebration {
 constructor(container){
  this.container=container;this.canvas=document.createElement('canvas');this.canvas.className='mate-ice-wizard';this.canvas.width=1120;this.canvas.height=400;this.canvas.hidden=true;this.canvas.setAttribute('aria-hidden','true');container.append(this.canvas);
  this.frame=null;this.generation=0;this._active=false;this.scene=null;loadAssets().catch(()=>{});
 }
 get active(){return this._active;}
 stop(){this.generation++;if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;this._active=false;}
 _draw(images,time,winner){this.scene??=createIceWizardScene(this.canvas,images);this.scene(time,winner);this.canvas.hidden=false;}
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
