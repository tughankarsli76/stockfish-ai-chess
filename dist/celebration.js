import {SamuraiCelebration} from './samurai-celebration.js';

// A brief, non-interactive confetti overlay.
export class WinCelebration {
  constructor(){this.canvas=null;this.frame=null;}
  get active(){return this.canvas!==null;}
  stop(){if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;this.canvas?.remove();this.canvas=null;}
  play(){
    this.stop();
    if(document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const canvas=document.createElement('canvas');canvas.className='win-confetti';canvas.setAttribute('aria-hidden','true');
    Object.assign(canvas.style,{position:'fixed',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'1000'});
    const ctx=canvas.getContext('2d');if(!ctx)return;
    this.canvas=canvas;document.body.append(canvas);
    const colors=['#ffca28','#ef5350','#42a5f5','#66bb6a','#ab47bc','#ff8a65'];
    const pieces=Array.from({length:180},()=>({x:Math.random(),delay:Math.random()*900,duration:3200+Math.random()*1400,sway:15+Math.random()*35,phase:Math.random()*Math.PI*2,spin:Math.random()*8-4,color:colors[Math.floor(Math.random()*colors.length)],size:5+Math.random()*5}));
    let started=null,width=0,height=0;
    const draw=now=>{
      if(this.canvas!==canvas)return;
      if(document.hidden){this.stop();return;}
      started??=now;const elapsed=now-started;
      if(elapsed>=5700){this.stop();return;}
      const w=innerWidth,h=innerHeight,scale=Math.min(devicePixelRatio||1,2);
      if(w!==width||h!==height){width=w;height=h;canvas.width=w*scale;canvas.height=h*scale;ctx.setTransform(scale,0,0,scale,0,0);}
      ctx.clearRect(0,0,width,height);
      for(const p of pieces){
        const t=(elapsed-p.delay)/p.duration;if(t<0||t>1)continue;
        ctx.save();ctx.translate(p.x*width+Math.sin(t*8+p.phase)*p.sway,-20+t*(height+50));ctx.rotate(p.phase+t*p.spin);
        ctx.globalAlpha=Math.min(1,(1-t)*5);ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2);ctx.restore();
      }
      this.frame=requestAnimationFrame(draw);
    };
    this.frame=requestAnimationFrame(draw);
  }
}

// Checkmate uses the defeated king; time wins retain the winner-colored king.
export class CheckmateCelebration {
  constructor(containers){
    this.containers=containers;this.position=null;this.kind=null;this.playing=null;this.timer=null;
    this.samurai=new Map();
    for(const container of containers){
      container.setAttribute('aria-hidden','true');
      const halo=document.createElement('div');halo.className='mate-halo';
      const king=document.createElement('span');king.className='mate-king';king.textContent='♚';
      container.append(halo,king);
      [...'abcdefghijkl'].forEach((name,index)=>{
        const star=document.createElement('span');star.className='mate-star '+name;
        star.textContent=[1,4,7,9,10].includes(index)?'✧':'✦';container.append(star);
      });
      this.samurai.set(container,new SamuraiCelebration(container));
    }
  }
  get active(){return this.playing!==null&&(this.kind!=='mate'||this.samurai.get(this.playing).active);}
  stop(settle=true){
    const previous=this.playing;
    clearTimeout(this.timer);this.timer=null;previous?.classList.remove('playing');this.playing=null;
    for(const scene of this.samurai.values())scene.stop();
    if(settle&&previous&&this.kind==='mate'&&this.position)this.samurai.get(previous).renderFinal(previous.dataset.winner==='white'?'w':'b');
  }
  render(position,timeWinner=null){
    const mate=position.isCheckmate(),checkmate=mate||!!timeWinner,key=checkmate?position.fen()+'|'+(timeWinner||'mate'):null,changed=key!==this.position;
    if(changed)this.stop(false);
    this.position=key;
    this.kind=mate?'mate':timeWinner?'time':null;
    for(const container of this.containers){
      container.hidden=!checkmate;
      container.dataset.winner=(timeWinner||(position.turn()==='w'?'b':'w'))==='w'?'white':'black';
      container.dataset.kind=this.kind||'';
      if(changed&&mate)this.samurai.get(container).renderFinal(container.dataset.winner==='white'?'w':'b');
    }
  }
  play(view){
    this.stop(false);
    if(!this.position||document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const container=this.containers.find(element=>element.dataset.view===view);
    if(!container)return;
    // Flush a previous animation before a new checkmate starts.
    void container.offsetWidth;
    this.playing=container;container.classList.add('playing');
    if(this.kind==='mate'){
      this.samurai.get(container).play(container.dataset.winner==='white'?'w':'b');
      return;
    }
    this.timer=setTimeout(()=>this.stop(),9300);
  }
}
