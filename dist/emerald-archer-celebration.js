import {prepareSixPoses} from './celebration-sprites.js';
// Animation 10: a light arrow turns the defeated king into emerald shards.
const DURATION=7.6;
let sharedAssets=null;
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
function image(relative){return new Promise((resolve,reject)=>{
 const item=new Image();item.decoding='async';item.onload=()=>resolve(item);item.onerror=()=>reject(Error('Unable to load emerald archer celebration'));item.src=new URL(relative,import.meta.url).href;
});}
function crystalKing(source){
 const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const ctx=canvas.getContext('2d');ctx.drawImage(source,0,0,128,128);
 ctx.globalCompositeOperation='source-atop';const fill=ctx.createLinearGradient(0,0,128,128);
 fill.addColorStop(0,'#e1ffe8');fill.addColorStop(.24,'#5dd799');fill.addColorStop(.47,'#157a53');fill.addColorStop(.68,'#aff6ce');fill.addColorStop(1,'#166c4c');ctx.fillStyle=fill;ctx.fillRect(0,0,128,128);
 for(const [points,color]of [[[[13,41],[65,19],[44,82]],'#c5ffe75c'],[[[65,19],[110,57],[44,82]],'#ecfff244'],[[[44,82],[110,57],[99,116]],'#056c4b5c'],[[[13,41],[44,82],[25,116]],'#2ec67f4d']]){
  ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.strokeStyle='#dcffef85';ctx.lineWidth=1;ctx.stroke();
 }
 return canvas;
}
function loadAssets(){
 if(!sharedAssets)sharedAssets=Promise.all([image('./assets/emerald-archer/archer6.png'),image('./assets/pieces/classic/wK.svg'),image('./assets/pieces/classic/bK.svg')])
  .then(([sheet,wK,bK])=>({frames:prepareSixPoses(sheet),wK,bK,emeraldwK:crystalKing(wK),emeraldbK:crystalKing(bK)})).catch(error=>{sharedAssets=null;throw error;});
 return sharedAssets;
}
export function createEmeraldArcherScene(canvas,images){
 const ctx=canvas.getContext('2d');
 function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
 function diamond(x,y,size,color){ctx.beginPath();ctx.moveTo(x,y-size*1.7);ctx.lineTo(x+size,y);ctx.lineTo(x,y+size*1.7);ctx.lineTo(x-size,y);ctx.closePath();ctx.fillStyle=color;ctx.fill();}
 function archer(t){
  const entry=smooth(t/1.25),index=t<1.25?Math.floor(t*5)%2:t<2.2?2:t<2.7?3:t<4.7?4:5;
  const f=images.frames[index],s=f.scale,x=204-300*(1-entry),y=176;
  ctx.save();ctx.globalAlpha=smooth(t/.3);ellipse(x,179,35,3,'#1a493016');ctx.drawImage(f.canvas,x+(f.left-f.foot[0])*s,y+(f.top-f.foot[1])*s,f.canvas.width*s,f.canvas.height*s);ctx.restore();
 }
 function arrow(t){
  if(t<2.15||t>3.18)return;
  const flight=smooth((t-2.7)/.4),x=265+flight*148,y=106+flight*20,charge=smooth((t-2.15)/.45),fade=1-smooth((t-3.1)/.08);
  ctx.save();ctx.globalAlpha=charge*fade;ctx.lineCap='round';
  for(const [width,color]of [[9,'#6febaa2e'],[4,'#80efae80'],[1.4,'#e4ffed']]){
   ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x-42-flight*13,y-5);ctx.lineTo(x,y);ctx.stroke();
  }
  ctx.beginPath();ctx.moveTo(x+5,y);ctx.lineTo(x-5,y-4);ctx.lineTo(x-3,y);ctx.lineTo(x-6,y+3);ctx.closePath();ctx.fillStyle='#c3ffdc';ctx.fill();
  for(let i=0;i<11;i++){
   const q=(t*1.7+i*.618)%1;ctx.globalAlpha=charge*fade*(1-q)*.65;ellipse(x-14-q*(24+flight*25),y-3+Math.sin(i*2.4+t*4)*(2+q*5),.7+i%3*.3,.7+i%3*.3,'#82dba7');
  }ctx.restore();
 }
 function crystallize(t,winner){
  const king=images[winner==='w'?'bK':'wK'],gem=images[winner==='w'?'emeraldbK':'emeraldwK'],freeze=smooth((t-3.05)/.65),burst=t-4.3;
  if(burst<0){
   ellipse(414,165,28,3,'#25453116');ctx.drawImage(king,382,96,64,64);
   if(freeze>0){
    ctx.save();ctx.globalAlpha=freeze;ctx.drawImage(gem,382,96,64,64);
    for(let i=0;i<8;i++){
     const a=i*Math.PI/4,rx=25+(i%3)*3,x=414+Math.cos(a)*rx,y=128+Math.sin(a)*31;
     ctx.globalAlpha=freeze*.55;diamond(x,y,2+i%3,'#86e3ad70');
    }
    if(t>3.75){ctx.globalAlpha=smooth((t-3.75)/.4);ctx.strokeStyle='#e0ffeaa0';ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(405,99);ctx.lineTo(419,119);ctx.lineTo(406,139);ctx.lineTo(421,158);ctx.moveTo(419,119);ctx.lineTo(438,129);ctx.stroke();}
    ctx.restore();
   }
  }else if(burst<1.9){
   ctx.save();ctx.globalAlpha=1-smooth((burst-.5)/1.25);
   for(let i=0;i<28;i++){
    const col=i%4,row=Math.floor(i/4),vx=(col-1.5)*24+Math.sin(i*3.8)*25,vy=-35-(i%7)*8;
    ctx.save();ctx.translate(414+vx*burst,128+vy*burst+73*burst*burst);ctx.rotate(Math.sin(i*2.4)*burst*3);
    ctx.beginPath();ctx.moveTo(-32+col*16,-32+row*10);ctx.lineTo(-16+col*16,-32+row*10);ctx.lineTo(-24+col*16,-22+row*10);ctx.closePath();ctx.clip();ctx.drawImage(gem,-32,-32,64,64);ctx.restore();
   }
   for(let i=0;i<18;i++){
    const a=i*2.4,r=9+burst*(16+i%5*12),x=414+Math.cos(a)*r,y=128+Math.sin(a)*r*.65-45*burst+65*burst*burst;
    ctx.save();ctx.translate(x,y);ctx.rotate(a+burst*2);diamond(0,0,1.5+i%3*.7,i%2?'#4ebf88':'#b2edca');ctx.restore();
   }
   ctx.restore();
  }
 }
 return(time,winner)=>{const t=Math.max(0,Math.min(DURATION,time));ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,560,200);crystallize(t,winner);archer(t);arrow(t);};
}
export class EmeraldArcherCelebration {
 constructor(container){
  this.container=container;this.canvas=document.createElement('canvas');this.canvas.className='mate-emerald-archer';this.canvas.width=1120;this.canvas.height=400;this.canvas.hidden=true;this.canvas.setAttribute('aria-hidden','true');container.append(this.canvas);
  this.frame=null;this.generation=0;this._active=false;this.scene=null;loadAssets().catch(()=>{});
 }
 get active(){return this._active;}
 stop(){this.generation++;if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;this._active=false;}
 _draw(images,time,winner){this.scene??=createEmeraldArcherScene(this.canvas,images);this.scene(time,winner);this.canvas.hidden=false;}
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
