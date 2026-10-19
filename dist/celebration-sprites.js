// Separate intact transparent figures and locate their feet and cyan spell focus.
export function prepareSixPoses(sheet,focusColor='cyan'){
 const canvas=document.createElement('canvas');canvas.width=sheet.naturalWidth;canvas.height=sheet.naturalHeight;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(sheet,0,0);
 const {width:w,height:h}=canvas,rgba=ctx.getImageData(0,0,w,h).data,labels=new Int32Array(w*h),queue=new Int32Array(w*h),figures=[];let label=0;
 for(let p=0;p<w*h;p++){
  if(labels[p]||rgba[p*4+3]<20)continue;
  label++;let head=0,tail=1,left=w,top=h,right=0,bottom=0;labels[p]=label;queue[0]=p;
  while(head<tail){const n=queue[head++],x=n%w,y=Math.floor(n/w);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
   for(const k of [x>0?n-1:-1,x<w-1?n+1:-1,y>0?n-w:-1,y<h-1?n+w:-1])if(k>=0&&!labels[k]&&rgba[4*k+3]>=20){labels[k]=label;queue[tail++]=k;}
  }
  if(tail>5000)figures.push({label,left,top,right,bottom});
 }
 figures.sort((a,b)=>Math.floor(a.bottom/(h/2))-Math.floor(b.bottom/(h/2))||a.left-b.left);
 if(figures.length!==6)throw Error('Celebration sheet must contain six complete figures');
 return figures.map(f=>{
  const sprite=document.createElement('canvas');sprite.width=f.right-f.left+1;sprite.height=f.bottom-f.top+1;
  const sc=sprite.getContext('2d'),out=sc.createImageData(sprite.width,sprite.height),feet=[],crystal=[];
  for(let y=f.top;y<=f.bottom;y++)for(let x=f.left;x<=f.right;x++)if(labels[y*w+x]===f.label){
   const a=4*(y*w+x),b=4*((y-f.top)*sprite.width+x-f.left);out.data.set(rgba.subarray(a,a+4),b);
   if(y>f.bottom-15)feet.push(x);
   const focus=focusColor==='blue'?rgba[a+2]>110&&rgba[a+2]>rgba[a]*1.25&&rgba[a+2]>rgba[a+1]*1.05:rgba[a+1]>115&&rgba[a+2]>145&&rgba[a+1]>rgba[a]*1.15;
   if(x>f.right-(f.right-f.left)*.18&&focus)crystal.push([x,y]);
  }
  feet.sort((a,b)=>a-b);crystal.sort((a,b)=>b[0]-a[0]);const tip=crystal.slice(0,Math.max(1,Math.floor(crystal.length*.15)));
  sc.putImageData(out,0,0);
  return {canvas:sprite,left:f.left,top:f.top,foot:[feet[Math.floor(feet.length/2)]??(f.left+f.right)/2,f.bottom],
   tip:tip.length?[tip.reduce((a,b)=>a+b[0],0)/tip.length,tip.reduce((a,b)=>a+b[1],0)/tip.length]:[f.right,f.top+(f.bottom-f.top)*.3],scale:180/(h/2)};
 });
}
