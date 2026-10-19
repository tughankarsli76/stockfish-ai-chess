// The approved miniature, two-handed checkmate sequence. Assets stay local and are decoded once.
const DURATION=6.8;
const SWING_TIMES=[2.83,3.69,4.42];
let sharedAssets=null;

function loadImage(relative){
  return new Promise((resolve,reject)=>{
    const image=new Image();image.decoding='async';
    image.onload=()=>resolve(image);
    image.onerror=()=>reject(new Error('Unable to load celebration asset: '+relative));
    image.src=new URL(relative,import.meta.url).href;
  });
}
function loadAssets(){
  if(!sharedAssets)sharedAssets=Promise.all([
    loadImage('./assets/pieces/classic/wK.svg'),
    loadImage('./assets/pieces/classic/bK.svg'),
    loadImage('./assets/samurai/samurai24.webp')
  ]).then(([wK,bK,poses])=>{
    const images={wK,bK,poses};prepareNaturalPoses(images);return images;
  }).catch(error=>{sharedAssets=null;throw error;});
  return sharedAssets;
}
 function prepareNaturalPoses(images){
  const img=images.poses,sheet=document.createElement('canvas');sheet.width=img.naturalWidth;sheet.height=img.naturalHeight;
  const context=sheet.getContext('2d',{willReadFrequently:true});context.drawImage(img,0,0);
  const pixels=context.getImageData(0,0,sheet.width,sheet.height),rgba=pixels.data,w=sheet.width,h=sheet.height;
  const labels=new Int16Array(w*h),queue=new Int32Array(w*h),components=[];let label=0;
  // Separate complete silhouettes so a neighboring sword tip never enters a frame.
  for(let p=0;p<w*h;p++){
   if(labels[p]||rgba[p*4+3]<20)continue;
   label++;let a=0,b=1,left=w,top=h,right=0,bottom=0;labels[p]=label;queue[0]=p;
   while(a<b){const n=queue[a++],x=n%w,y=Math.floor(n/w);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
    for(const k of [x>0?n-1:-1,x<w-1?n+1:-1,y>0?n-w:-1,y<h-1?n+w:-1])if(k>=0&&!labels[k]&&rgba[k*4+3]>=20){labels[k]=label;queue[b++]=k}
   }
   if(b>8000)components.push({label,left,top,right,bottom});
  }
  components.sort((a,b)=>Math.round((a.bottom-254)/253)-Math.round((b.bottom-254)/253)||a.left-b.left);
  if(components.length!==24)throw new Error('Samurai pose sheet must contain twenty-four complete figures');
  images.frames=components.map(c=>{
   const sprite=document.createElement('canvas');sprite.width=c.right-c.left+1;sprite.height=c.bottom-c.top+1;
   const sc=sprite.getContext('2d'),out=sc.createImageData(sprite.width,sprite.height);
   for(let y=c.top;y<=c.bottom;y++)for(let x=c.left;x<=c.right;x++)if(labels[y*w+x]===c.label){const from=(y*w+x)*4,to=((y-c.top)*sprite.width+x-c.left)*4;out.data.set(rgba.subarray(from,from+4),to)}
   sc.putImageData(out,0,0);return {canvas:sprite,left:c.left,top:c.top};
  });
 }

function createScene(canvas,images){
 const ctx=canvas.getContext('2d');
 const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
 const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
 const lerp=(a,b,t)=>a+(b-a)*t;
 const swingTimes=SWING_TIMES,hits=SWING_TIMES;
 let winner='w';
 function shape(path,fill,stroke,width=1){let p=new Path2D(path);if(fill){ctx.fillStyle=fill;ctx.fill(p)}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke(p)}}
 function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}
 function fallWithBounce(t,ground=15){
  const velocity=-36,gravity=180,landing=(-velocity+Math.sqrt(velocity*velocity+2*gravity*ground))/gravity;
  if(t<landing)return velocity*t+.5*gravity*t*t;
  let impact=velocity+gravity*landing,bounce=-impact*.15,q=t-landing,again=-2*bounce/gravity;
  if(q<again)return ground+bounce*q+.5*gravity*q*q;
  return ground;
 }
 function kingCutSurface(upper){
  ctx.beginPath();ctx.moveTo(-12,upper?-.5:0);ctx.lineTo(12,upper?-.5:0);ctx.lineTo(10,upper?2.1:2.5);ctx.lineTo(-10,upper?2.1:2.5);ctx.closePath();
  const g=ctx.createLinearGradient(-12,-1,12,3);g.addColorStop(0,winner==='w'?'#676d75':'#d4c9b5');g.addColorStop(.45,winner==='w'?'#b8bec4':'#f6e8ce');g.addColorStop(1,winner==='w'?'#525962':'#a69b8b');ctx.fillStyle=g;ctx.fill();
 }
 function drawKing(t){
  const img=images[winner==='w'?'bK':'wK'];if(!img)return;
  const n=hits.filter(h=>t>=h).length,size=64;
  ctx.save();ctx.translate(kingPos.x,kingPos.y);
  ellipse(0,30,24,3,'#17171b16');
  if(n<3){
   let dx=0,dy=0,rotate=0;
   for(let i=0;i<Math.min(n,2);i++){let d=t-hits[i],impulse=Math.exp(-d*19)*Math.sin(d*38);dy+=(i===0?-1:1)*impulse*4.5;dx+=impulse*.65;rotate+=(i===0?-.03:.025)*impulse;}
   ctx.save();ctx.translate(dx,dy);ctx.rotate(rotate);ctx.drawImage(img,-size/2,-size/2,size,size);
   if(n>0)shape('M-17 16 L-4 4 L4 -3 L17 -16',null,winner==='w'?'#8f969d':'#a69986',.7);
   if(n>1)shape('M-17 -16 L-3 -2 L5 5 L17 16',null,winner==='w'?'#a1a7af':'#a89a83',.8);
   ctx.restore();
  }else{
   let elapsed=Math.max(0,t-hits[2]),horizontal=1-Math.exp(-elapsed*5),angle=1-Math.exp(-elapsed*6);
   // The lower half absorbs the lateral impulse and remains weighted on the surface.
   ctx.save();ctx.translate(7*horizontal,1.3*horizontal);ctx.rotate(.15*angle);ctx.save();ctx.beginPath();ctx.rect(-40,0,80,42);ctx.clip();ctx.drawImage(img,-size/2,-size/2,size,size);ctx.restore();kingCutSurface(false);ctx.restore();
   // The upper half separates at the blade's contact, then follows gravity and a small landing bounce.
   let x=-15*horizontal,y=fallWithBounce(elapsed),r=-.84*angle;
   ctx.save();ctx.translate(x,y);ctx.rotate(r);ctx.save();ctx.beginPath();ctx.rect(-40,-42,80,42);ctx.clip();ctx.shadowColor='#00000026';ctx.shadowBlur=1.5;ctx.shadowOffsetY=1;ctx.drawImage(img,-size/2,-size/2,size,size);ctx.restore();kingCutSurface(true);ctx.restore();
  }
  ctx.restore();
  if(t<2.25){ctx.save();ctx.globalAlpha=clamp((2.25-t)/.7)*.6;for(let i=0;i<10;i++){let a=i*Math.PI/5+t*.24,x=kingPos.x+Math.cos(a)*55,y=kingPos.y+1+Math.sin(a)*38;ctx.fillStyle='#c6a963';ctx.font=(i%2?'12':'9')+'px Georgia';ctx.fillText(i%2?'✦':'✧',x-4,y+3)}ctx.restore()}
 }
 const kingPos={x:304,y:101};
 const naturalPoses=[
  {hip:119,floor:254,guard:[126,177],tip:[211,238]},
  {hip:376,floor:254,guard:[377,162],tip:[484,217]},
  {hip:634,floor:254,guard:[638,152],tip:[759,142]},
  {hip:890,floor:254,guard:[931,136],tip:[1039,125]},
  {hip:1145,floor:254,guard:[1193,127],tip:[1275,59]},
  {hip:1400,floor:254,guard:[1438,107],tip:[1516,30]},
  {hip:1655,floor:254,guard:[1717,73],tip:[1774,10]},
  {hip:1910,floor:254,guard:[1977,73],tip:[2025,9]},
  {hip:115,floor:521,guard:[96,276],tip:[26,328]},
  {hip:370,floor:521,guard:[354,276],tip:[278,332]},
  {hip:626,floor:521,guard:[624,305],tip:[555,264]},
  {hip:884,floor:521,guard:[884,325],tip:[814,280]},
  {hip:1141,floor:521,guard:[1156,405],tip:[1277,421]},
  {hip:1400,floor:521,guard:[1424,418],tip:[1533,452]},
  {hip:1659,floor:521,guard:[1714,444],tip:[1796,489]},
  {hip:1910,floor:521,guard:[1970,452],tip:[2038,494]},
  {hip:130,floor:760,guard:[103,647],tip:[15,632]},
  {hip:381,floor:760,guard:[344,646],tip:[325,644]},
  {hip:632,floor:760,guard:[696,650],tip:[768,651]},
  {hip:888,floor:760,guard:[967,640],tip:[1056,635]},
  {hip:1144,floor:760,guard:[1207,640],tip:[1311,629]},
  {hip:1398,floor:757,guard:[1464,629],tip:[1560,622]},
  {hip:1657,floor:758,guard:[1734,642],tip:[1824,637]},
  {hip:1912,floor:758,guard:[1969,656],tip:[2040,691]}
 ];
 // Whole, anatomically connected poses: load, drive, follow through, recover.
 const naturalKeys=[
  [0,0],[2.62,0],[2.74,1],[2.83,2],[2.87,3],[2.91,4],[2.96,5],[3.03,6],[3.12,7],
  [3.28,8],[3.42,9],[3.55,10],[3.63,11],[3.69,12],[3.735,13],[3.795,14],[3.89,15],
  [4.15,16],[4.30,17],[4.42,18],[4.465,19],[4.51,20],[4.565,21],[4.645,22],[4.76,23],
  [5.10,15],[5.28,1],[5.45,0]
 ];
 function naturalState(t){
  let index=0,keyIndex=0;for(let k=0;k<naturalKeys.length;k++){const key=naturalKeys[k];if(t<key[0])break;index=key[1];keyIndex=k}
  const entry=smooth((t-1.35)/.62),enterX=lerp(-220,0,entry),hop=t<1.97?-7*Math.sin(entry*Math.PI):0;
  let drive=0;for(const h of swingTimes)drive+=3.5*Math.exp(-Math.pow((t-h-.07)/.19,2));
  return {index,keyIndex,x:224+enterX+drive,y:160+hop,scale:.55};
 }
 function sourceToWorld(point,state,pose){return [state.x+(point[0]-pose.hip)*state.scale,state.y+(point[1]-pose.floor)*state.scale]}
 function swordAt(t){
  const state=naturalState(t),pose=naturalPoses[state.index],nextKey=naturalKeys[state.keyIndex+1],next=nextKey?naturalPoses[nextKey[1]]:pose;
  let a=sourceToWorld(pose.guard,state,pose),b=sourceToWorld(pose.tip,state,pose);
  if(nextKey){
   const interval=nextKey[0]-naturalKeys[state.keyIndex][0],q=smooth((t-naturalKeys[state.keyIndex][0])/interval),c=sourceToWorld(next.guard,state,next),d=sourceToWorld(next.tip,state,next);
   if(state.index>=16&&state.index<=22){a=[lerp(a[0],c[0],q),lerp(a[1],c[1],q)];b=[lerp(b[0],d[0],q),lerp(b[1],d[1],q)]}
   else{const angle=Math.atan2(b[1]-a[1],b[0]-a[0]),angleNext=Math.atan2(d[1]-c[1],d[0]-c[0]),delta=Math.atan2(Math.sin(angleNext-angle),Math.cos(angleNext-angle)),length=lerp(Math.hypot(b[0]-a[0],b[1]-a[1]),Math.hypot(d[0]-c[0],d[1]-c[1]),q),theta=angle+delta*q;a=[lerp(a[0],c[0],q),lerp(a[1],c[1],q)];b=[a[0]+Math.cos(theta)*length,a[1]+Math.sin(theta)*length]}
  }
  const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.max(1,Math.hypot(dx,dy)),points=[];
  for(let i=0;i<=16;i++){const u=i/16,bend=1.6*4*u*(1-u);points.push([lerp(a[0],b[0],u)+dy/length*bend,lerp(a[1],b[1],u)-dx/length*bend])}
  return {points,tip:b};
 }
 function drawSwordMotion(t){
  const moving=(t>2.72&&t<3.17)||(t>3.14&&t<3.34)||(t>3.51&&t<3.97)||(t>4.33&&t<4.84);
  if(!moving)return;
  ctx.save();ctx.fillStyle='#cbd5dc';
  // A short continuous steel trail follows the accelerated arc; the body stays crisp.
  for(let i=7;i>0;i--){const a=swordAt(t-i*.006).points,b=swordAt(t-(i-1)*.006).points;ctx.globalAlpha=.018+(7-i)*.006;ctx.beginPath();ctx.moveTo(...a[5]);ctx.lineTo(...a[16]);ctx.lineTo(...b[16]);ctx.lineTo(...b[5]);ctx.closePath();ctx.fill()}
  ctx.restore();
 }
 function closestBladePoint(t){
  const pts=swordAt(t).points;let closest={distance:Infinity,point:[kingPos.x,kingPos.y]};
  for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],dx=b[0]-a[0],dy=b[1]-a[1],u=clamp(((kingPos.x-a[0])*dx+(kingPos.y-a[1])*dy)/(dx*dx+dy*dy)),q=[a[0]+u*dx,a[1]+u*dy],distance=Math.hypot(q[0]-kingPos.x,q[1]-kingPos.y);if(distance<closest.distance)closest={distance,point:q}}
  return closest;
 }
 function drawSamurai(t){
  if(t<1.35||!images.frames)return;
  const state=naturalState(t),pose=naturalPoses[state.index],sprite=images.frames[state.index];
  ctx.save();ellipse(state.x,162,37,3.8,'#17171b16');
  // The intact silhouette changes during fast motion; no limb warping or body crossfades.
  ctx.drawImage(sprite.canvas,state.x+(sprite.left-pose.hip)*state.scale,state.y+(sprite.top-pose.floor)*state.scale,sprite.canvas.width*state.scale,sprite.canvas.height*state.scale);
  ctx.restore();
 }

 function drawImpact(t){
  for(let i=0;i<hits.length;i++){
   let q=(t-hits[i])/.22;if(q<0||q>1)continue;
   let contact=closestBladePoint(hits[i]).point;
   ctx.save();ctx.globalAlpha=(1-q)*.8;ctx.lineCap='round';
   // A faint streak follows the actual swept tip in the final 80ms of acceleration.
   let p=new Path2D();for(let j=0;j<=10;j++){let point=swordAt(t-.065+j*.0065).tip;if(j===0)p.moveTo(...point);else p.lineTo(...point)}ctx.strokeStyle='#d8e0e799';ctx.lineWidth=1.6*(1-q);ctx.stroke(p);
   for(let k=0;k<5;k++){let a=k*2.399,d=3+q*(8+k),x=contact[0]+Math.cos(a)*d,y=contact[1]+Math.sin(a)*d*.7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*2,y+Math.sin(a)*2);ctx.strokeStyle=winner==='w'?'#9298a2':'#c6b690';ctx.lineWidth=.8;ctx.stroke()}
   ctx.restore();
  }
 }

 return (time,side)=>{
  winner=side==='b'?'b':'w';
  ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,560,200);
  drawSwordMotion(time);drawKing(time);drawSamurai(time);drawImpact(time);
 };
}

/** A one-shot canvas scene. The caller controls result visibility and confetti. */
export class SamuraiCelebration {
  constructor(container){
    this.container=container;this.canvas=document.createElement('canvas');
    this.canvas.className='mate-samurai';this.canvas.width=1120;this.canvas.height=400;
    this.canvas.setAttribute('aria-hidden','true');this.canvas.hidden=true;
    container.append(this.canvas);
    this.frame=null;this.generation=0;this._active=false;this.scene=null;
    // Prewarm while the game is played; failures leave the game result text visible.
    loadAssets().catch(()=>{});
  }
  get active(){return this._active;}
  stop(){
    this.generation++;
    if(this.frame!==null)cancelAnimationFrame(this.frame);
    this.frame=null;this._active=false;
  }
  _draw(images,time,winner){
    this.scene??=createScene(this.canvas,images);
    this.scene(time,winner);this.canvas.hidden=false;
    this.container.classList.add('samurai-ready');
  }
  renderFinal(winner){
    this.stop();const generation=this.generation;
    return loadAssets().then(images=>{
      if(generation!==this.generation)return false;
      this._draw(images,DURATION,winner);return true;
    }).catch(()=>false);
  }
  play(winner){
    this.stop();
    if(document.hidden)return false;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){this.renderFinal(winner);return false;}
    if(!this.canvas.getContext('2d'))return false;
    const generation=this.generation;this._active=true;
    loadAssets().then(images=>{
      if(generation!==this.generation)return;
      if(document.hidden){this.stop();return;}
      let started=null;
      const draw=now=>{
        if(generation!==this.generation)return;
        if(document.hidden){this.stop();return;}
        started??=now;
        const elapsed=Math.min(DURATION,(now-started)/1000);
        this._draw(images,elapsed,winner);
        if(elapsed<DURATION)this.frame=requestAnimationFrame(draw);
        else{this.frame=null;this._active=false;}
      };
      this.frame=requestAnimationFrame(draw);
    }).catch(()=>{if(generation===this.generation)this._active=false;});
    return true;
  }
}
