// Animation 2: a local eight-pose dragon and fire breath.
const DURATION=7.2;
let assets=null;
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const lerp=(a,b,t)=>a+(b-a)*t;
function image(relative){return new Promise((resolve,reject)=>{
 const item=new Image();item.decoding='async';item.onload=()=>resolve(item);item.onerror=()=>reject(new Error('Unable to load dragon celebration'));
 item.src=new URL(relative,import.meta.url).href;
});}
function loadAssets(){
 if(!assets)assets=Promise.all([image('./assets/dragon/dragon8.png'),image('./assets/pieces/classic/wK.svg'),image('./assets/pieces/classic/bK.svg')])
  .then(([sheet,wK,bK])=>({frames:separatePoses(sheet),wK,bK})).catch(error=>{assets=null;throw error;});
 return assets;
}
function separatePoses(sheet){
 const canvas=document.createElement('canvas');canvas.width=sheet.naturalWidth;canvas.height=sheet.naturalHeight;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(sheet,0,0);
 const {width:w,height:h}=canvas,pixels=ctx.getImageData(0,0,w,h),rgba=pixels.data,labels=new Int16Array(w*h),queue=new Int32Array(w*h),figures=[];
 let label=0;
 for(let p=0;p<w*h;p++){
  if(labels[p]||rgba[4*p+3]<20)continue;
  label++;let head=0,tail=1,left=w,top=h,right=0,bottom=0;labels[p]=label;queue[0]=p;
  while(head<tail){const n=queue[head++],x=n%w,y=Math.floor(n/w);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
   for(const k of [x>0?n-1:-1,x<w-1?n+1:-1,y>0?n-w:-1,y<h-1?n+w:-1])if(k>=0&&!labels[k]&&rgba[4*k+3]>=20){labels[k]=label;queue[tail++]=k;}
  }
  if(tail>5000)figures.push({label,left,top,right,bottom});
 }
 figures.sort((a,b)=>Math.floor(a.bottom/(h/2))-Math.floor(b.bottom/(h/2))||a.left-b.left);
 if(figures.length!==8)throw Error('Dragon sheet must have eight complete silhouettes');
 return figures.map((f,index)=>{
  const sprite=document.createElement('canvas');sprite.width=f.right-f.left+1;sprite.height=f.bottom-f.top+1;
  const sc=sprite.getContext('2d'),out=sc.createImageData(sprite.width,sprite.height);
  for(let y=f.top;y<=f.bottom;y++)for(let x=f.left;x<=f.right;x++)if(labels[y*w+x]===f.label){const a=4*(y*w+x),b=4*((y-f.top)*sprite.width+x-f.left);out.data.set(rgba.subarray(a,a+4),b);}
  sc.putImageData(out,0,0);
  // Anatomical ground and mouth anchors, scaled to the generated sheet dimensions.
  const feet=[[420,418],[858,418],[1306,418],[1730,418],[423,816],[934,816],[1300,816],[1727,816]][index];
  const mouth=[[510,238],[896,247],[1349,251],[1760,235],[427,499],[951,613],[1330,627],[1763,588]][index];
  return {canvas:sprite,left:f.left,top:f.top,foot:[feet[0]*w/1792,feet[1]*h/896],mouth:[mouth[0]*w/1792,mouth[1]*h/896],scale:.48*1792/w};
 });
}
export function createDragonScene(canvas,images){
 const ctx=canvas.getContext('2d');
 function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
 function state(t){
  const entering=smooth(t/1.3),flight=t<1.3;
  const index=flight?[0,1,2,1][Math.floor(t*7)%4]:t<1.8?3:t<2.35?4:t<4.7?5:t<5.15?6:7;
  return {frame:images.frames[index],x:250-360*(1-entering),y:174-(flight?18*(1-entering)+3*Math.sin(t*8):0)};
 }
 function dragon(t){
  const pose=state(t),f=pose.frame,scale=f.scale;
  ctx.save();ctx.globalAlpha=smooth(t/.25);ellipse(pose.x-58,178,112,4,'#1b19291a');
  ctx.drawImage(f.canvas,pose.x+(f.left-f.foot[0])*scale,pose.y+(f.top-f.foot[1])*scale,f.canvas.width*scale,f.canvas.height*scale);ctx.restore();
  return {x:pose.x+(f.mouth[0]-f.foot[0])*scale,y:pose.y+(f.mouth[1]-f.foot[1])*scale};
 }
 function flame(t,mouth){
  const strength=smooth((t-2.35)/.35)*(1-smooth((t-4.25)/.45));if(strength<=0)return;
  const target={x:431,y:125},dx=target.x-mouth.x,dy=target.y-mouth.y,length=Math.hypot(dx,dy);
  ctx.save();ctx.translate(mouth.x,mouth.y);ctx.rotate(Math.atan2(dy,dx));
  for(let layer=0;layer<3;layer++){
   const width=[24,16,7][layer]*strength,gradient=ctx.createLinearGradient(0,0,length,0);
   gradient.addColorStop(0,['#ef6b13ee','#ffc146fa','#fff2b5ff'][layer]);gradient.addColorStop(.55,['#f18c1bd9','#ffd45ee6','#fff3bfd9'][layer]);gradient.addColorStop(1,'#f8b34000');
   ctx.beginPath();ctx.moveTo(0,0);
   for(let k=1;k<=28;k++){const u=k/28,w=width*Math.sin(u*Math.PI/2),wave=Math.sin(u*22-t*18)*w*.13;ctx.lineTo(u*length,w+wave);}
   for(let k=28;k>=1;k--){const u=k/28,w=width*Math.sin(u*Math.PI/2),wave=Math.cos(u*19-t*21)*w*.14;ctx.lineTo(u*length,-w+wave);}
   ctx.closePath();ctx.fillStyle=gradient;ctx.fill();
  }
  for(let i=0;i<30;i++){
   const u=(t*(.7+i%5*.03)+i*.618)%1,x=u*length,y=Math.sin(i*2.399+t*3)*u*22;
   ctx.globalAlpha=strength*(1-u);ellipse(x,y,1.2+i%3*.45,.8+i%2*.4,i%3?'#ffbc47':'#fff3bf');
  }
  ctx.restore();
 }
 function king(t,winner){
  const lose=images[winner==='w'?'bK':'wK'];
  const dissolve=smooth((t-3.85)/.8),hit=t>2.8&&t<4.6;
  ctx.save();ctx.globalAlpha=1-dissolve;ellipse(412,165,29,4,'#1b19291c');
  if(dissolve<1){ctx.globalAlpha=1-dissolve;ctx.translate(412+(hit?Math.sin(t*35)*1.5:0),128+dissolve*21);ctx.rotate(dissolve*.12);ctx.drawImage(lose,-32,-32*(1-dissolve*.4),64,64*(1-dissolve*.4));}
  ctx.restore();
  if(t>3.6&&t<5.5){
   ctx.save();const fade=smooth((t-3.6)/.4)*(1-smooth((t-4.6)/.9));
   for(let i=0;i<23;i++){const a=i*2.399,r=8+(t-3.6)*(7+i%6*3);ctx.globalAlpha=fade*.65;ellipse(412+Math.cos(a)*r,139+Math.sin(a)*r*.5,1+i%2,.7,i%2?'#ac6b37':'#f4b753');}ctx.restore();
  }
 }
 return (time,winner)=>{
  const t=Math.max(0,Math.min(DURATION,time));ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,560,200);
  king(t,winner);const mouth=dragon(t);flame(t,mouth);
 };
}
export class DragonCelebration {
 constructor(container){
  this.container=container;this.canvas=document.createElement('canvas');this.canvas.className='mate-dragon';this.canvas.width=1120;this.canvas.height=400;
  this.canvas.hidden=true;this.canvas.setAttribute('aria-hidden','true');container.append(this.canvas);
  this.frame=null;this.generation=0;this._active=false;this.scene=null;loadAssets().catch(()=>{});
 }
 get active(){return this._active;}
 stop(){this.generation++;if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;this._active=false;}
 _draw(images,time,winner){this.scene??=createDragonScene(this.canvas,images);this.scene(time,winner);this.canvas.hidden=false;this.container.classList.add('dragon-ready');}
 renderFinal(winner){
  this.stop();const generation=this.generation;
  return loadAssets().then(images=>{if(generation!==this.generation)return false;this._draw(images,DURATION,winner);return true;}).catch(()=>false);
 }
 play(winner){
  this.stop();if(document.hidden)return false;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){this.renderFinal(winner);return false;}
  if(!this.canvas.getContext('2d'))return false;
  const generation=this.generation;this._active=true;
  loadAssets().then(images=>{
   if(generation!==this.generation)return;if(document.hidden){this.stop();return;}let started=null;
   const draw=now=>{
    if(generation!==this.generation)return;if(document.hidden){this.stop();return;}
    started??=now;const elapsed=Math.min(DURATION,(now-started)/1000);this._draw(images,elapsed,winner);
    if(elapsed<DURATION)this.frame=requestAnimationFrame(draw);else{this.frame=null;this._active=false;}
   };this.frame=requestAnimationFrame(draw);
  }).catch(()=>{if(generation===this.generation)this._active=false;});
  return true;
 }
}
