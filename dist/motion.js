export class BoardMotion {
 constructor(board){this.board=board;this.active=null;}
 get running(){return !!this.active;}
 capture(){return new Map([...this.board.querySelectorAll('[data-square]')].map(square=>{const image=square.querySelector('img');return [square.dataset.square,image?{image:image.cloneNode(),rect:image.getBoundingClientRect()}:null];}));}
 cancel(){const job=this.active;if(!job)return;this.active=null;for(const animation of job.animations)animation.cancel();for(const image of job.hidden)image.style.visibility='';for(const image of job.overlays)image.remove();}
 play(move,before){
  this.cancel();
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return Promise.resolve();
  const job={animations:[],hidden:[],overlays:[]};this.active=job;
  const boardRect=this.board.getBoundingClientRect();
  const overlay=(source,rect)=>{const image=source.image;image.classList.add('moving-piece');Object.assign(image.style,{left:(rect.left-boardRect.left)+'px',top:(rect.top-boardRect.top)+'px',width:rect.width+'px',height:rect.height+'px'});this.board.append(image);job.overlays.push(image);return image;};
  const slide=(from,to)=>{
   const source=before.get(from),target=this.board.querySelector('[data-square="'+to+'"] img');if(!source||!target)return;
   const rect=target.getBoundingClientRect(),image=overlay(source,rect);target.style.visibility='hidden';job.hidden.push(target);
   job.animations.push(image.animate([{transform:`translate(${source.rect.left-rect.left}px,${source.rect.top-rect.top}px)`},{transform:'translate(0,0)'}],{duration:650,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'}));
  };
  const capturedSquare=move.flags.includes('e')?move.to[0]+move.from[1]:move.to;
  const victim=move.captured&&before.get(capturedSquare);
  if(victim){const image=overlay(victim,victim.rect);image.style.zIndex='4';job.animations.push(image.animate([{opacity:1},{opacity:0}],{delay:420,duration:230,fill:'both'}));}
  slide(move.from,move.to);
  if(move.flags.includes('k'))slide('h'+move.from[1],'f'+move.from[1]);
  if(move.flags.includes('q'))slide('a'+move.from[1],'d'+move.from[1]);
  return Promise.all(job.animations.map(animation=>animation.finished.catch(()=>{}))).finally(()=>{if(this.active===job)this.cancel();});
 }
}
