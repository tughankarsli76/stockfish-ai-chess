import {prepareSixPoses} from './celebration-sprites.js';
// Animation 6: a chest beat and ground slam topple the defeated king.
const DURATION=7.2;
let sharedAssets=null;
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
function image(relative){return new Promise((resolve,reject)=>{
 const item=new Image();item.decoding='async';item.onload=()=>resolve(item);item.onerror=()=>reject(Error('Unable to load gorilla celebration'));item.src=new URL(relative,import.meta.url).href;
});}
function loadAssets(){
 if(!sharedAssets)sharedAssets=Promise.all([image('./assets/gorilla/gorilla6.png'),image('./assets/pieces/classic/wK.svg'),image('./assets/pieces/classic/bK.svg')])
  .then(([sheet,wK,bK])=>({frames:prepareSixPoses(sheet),wK,bK})).catch(error=>{sharedAssets=null;throw error;});
 return sharedAssets;
}
export function createGorillaScene(canvas,images){
 const ctx=canvas.getContext('2d');
 function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
 function gorilla(t){
  const entry=smooth(t/1.2),index=t<1.2?Math.floor(t*5)%2:t<2.05?2:t<2.8?3:t<4.8?4:5;
  const f=images.frames[index],s=f.scale,x=204-300*(1-entry),chest=t>=1.2&&t<2.05?Math.sin((t-1.2)*22)*1.4:0,y=176+chest;
  ctx.save();ctx.globalAlpha=smooth(t/.3);ellipse(x,179,43,3.5,'#26221e1c');ctx.drawImage(f.canvas,x+(f.left-f.foot[0])*s,y+(f.top-f.foot[1])*s,f.canvas.width*s,f.canvas.height*s);ctx.restore();
 }
 function shockwave(t){
  const elapsed=t-2.8;if(elapsed<0||elapsed>1.7)return;
  ctx.save();ctx.lineWidth=1.2;
  for(let i=0;i<3;i++){
   const q=clamp((elapsed-i*.12)/1.2);if(q<=0||q>=1)continue;
   ctx.globalAlpha=(1-q)*.5;ctx.strokeStyle='#9d9382';ctx.beginPath();ctx.ellipse(280,173,8+q*155,1.5+q*10,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.globalAlpha=(1-smooth(elapsed/1.5))*.6;ctx.strokeStyle='#8e8375';ctx.lineWidth=.8;
  ctx.beginPath();ctx.moveTo(274,174);ctx.lineTo(300,172);ctx.lineTo(312,176);ctx.lineTo(337,172);ctx.lineTo(350,175);ctx.lineTo(378,172);ctx.lineTo(400,174);ctx.lineTo(427,171);ctx.lineTo(447,174);ctx.stroke();
  for(let i=0;i<22;i++){
   const x=281+Math.cos(i*2.4)*elapsed*(9+i%5*8),y=173-Math.sin(clamp(elapsed/1.5)*Math.PI)*(3+i%7*2);
   ctx.globalAlpha=(1-clamp(elapsed/1.5))*.5;ellipse(x,y,1+i%3*.5,.6+i%2*.4,i%3?'#aaa18e':'#d0c6ae');
  }ctx.restore();
 }
 function king(t,winner){
  const king=images[winner==='w'?'bK':'wK'],fall=smooth((t-3.1)/.95),fade=1-smooth((t-4.7)/.75);if(fade<=0)return;
  ctx.save();ctx.globalAlpha=fade;ellipse(412+fall*18,168,28+fall*8,3,'#29231d18');
  const rumble=t>2.95&&t<3.55?Math.sin(t*37)*1.4:0;
  ctx.translate(412+fall*8+rumble,164-fall*12);ctx.rotate(fall*1.53);ctx.drawImage(king,-32,-64,64,64);ctx.restore();
 }
 return(time,winner)=>{
  const t=Math.max(0,Math.min(DURATION,time));ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,560,200);shockwave(t);king(t,winner);gorilla(t);
 };
}
export class GorillaCelebration {
 constructor(container){
  this.container=container;this.canvas=document.createElement('canvas');this.canvas.className='mate-gorilla';this.canvas.width=1120;this.canvas.height=400;this.canvas.hidden=true;this.canvas.setAttribute('aria-hidden','true');container.append(this.canvas);
  this.frame=null;this.generation=0;this._active=false;this.scene=null;loadAssets().catch(()=>{});
 }
 get active(){return this._active;}
 stop(){this.generation++;if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;this._active=false;}
 _draw(images,time,winner){this.scene??=createGorillaScene(this.canvas,images);this.scene(time,winner);this.canvas.hidden=false;}
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
