import {SamuraiCelebration} from './samurai-celebration.js';
import {DragonCelebration} from './dragon-celebration.js';
import {IceWizardCelebration} from './ice-wizard-celebration.js';
import {LightningKnightCelebration} from './lightning-knight-celebration.js';
import {PhoenixCelebration} from './phoenix-celebration.js';
import {GorillaCelebration} from './gorilla-celebration.js';
import {StormWarriorCelebration} from './storm-warrior-celebration.js';
import {LionKingCelebration} from './lion-king-celebration.js';
import {CosmicWizardCelebration} from './cosmic-wizard-celebration.js';
import {EmeraldArcherCelebration} from './emerald-archer-celebration.js';
import {randomCelebration} from './celebration-choice.js';

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

// Choose once per decisive result; both result views keep the same scene.
export class CheckmateCelebration {
  constructor(containers,choose=randomCelebration){
    this.containers=containers;this.position=null;this.kind=null;this.playing=null;this.timer=null;this.useAnimations=true;
    this.choose=choose;this.choices=new WeakMap();this.animation='samurai';this.scenes=new Map();
    for(const container of containers){
      container.setAttribute('aria-hidden','true');
      const halo=document.createElement('div');halo.className='mate-halo';
      const king=document.createElement('span');king.className='mate-king';king.textContent='♚';
      container.append(halo,king);
      [...'abcdefghijkl'].forEach((name,index)=>{
        const star=document.createElement('span');star.className='mate-star '+name;
        star.textContent=[1,4,7,9,10].includes(index)?'✧':'✦';container.append(star);
      });
      this.scenes.set(container,{samurai:new SamuraiCelebration(container),dragon:new DragonCelebration(container),'ice-wizard':new IceWizardCelebration(container),'lightning-knight':new LightningKnightCelebration(container),phoenix:new PhoenixCelebration(container),gorilla:new GorillaCelebration(container),'storm-warrior':new StormWarriorCelebration(container),'lion-king':new LionKingCelebration(container),'cosmic-wizard':new CosmicWizardCelebration(container),'emerald-archer':new EmeraldArcherCelebration(container)});
    }
  }
  scene(container){return this.scenes.get(container)[this.animation];}
  get active(){return this.playing!==null&&(this.useAnimations?this.scene(this.playing).active:this.timer!==null);}
  stop(settle=true){
    const previous=this.playing;
    clearTimeout(this.timer);this.timer=null;previous?.classList.remove('playing');this.playing=null;
    for(const scenes of this.scenes.values())for(const scene of Object.values(scenes))scene.stop();
    if(settle&&this.useAnimations&&this.position)for(const container of this.containers)if(!container.hidden)this.scene(container).renderFinal(container.dataset.winner==='white'?'w':'b');
  }
  render(position,winner=null,enabled=true,resultKind='time',game=position){
    const mate=position.isCheckmate(),winningSide=mate?(position.turn()==='w'?'b':'w'):winner;
    const decided=!!winningSide,kind=mate?'mate':resultKind,modeChanged=enabled!==this.useAnimations,playingView=this.active?this.playing.dataset.view:null;
    const key=decided?position.fen()+'|'+winningSide+'|'+kind+'|'+enabled:null,changed=key!==this.position||game!==this.game;
    if(changed)this.stop(false);
    this.useAnimations=enabled;
    if(decided){
      let choices=this.choices.get(game);
      if(!choices){choices=new Map();this.choices.set(game,choices);}
      const result=position.fen()+'|'+winningSide+'|'+kind;
      if(!choices.has(result))choices.set(result,this.choose());
      this.animation=choices.get(result);
    }
    this.position=key;this.game=game;
    this.kind=decided?kind:null;
    for(const container of this.containers){
      container.hidden=!decided;
      container.dataset.winner=winningSide==='w'?'white':'black';
      container.dataset.kind=this.kind||'';
      container.dataset.animation=enabled?this.animation:'king';
      if(changed&&decided&&enabled)this.scene(container).renderFinal(container.dataset.winner==='white'?'w':'b');
    }
    if(modeChanged&&playingView&&decided)this.play(playingView);
  }
  play(view){
    // Keep both result views settled while only the selected view animates.
    this.stop();
    if(!this.position||document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const container=this.containers.find(element=>element.dataset.view===view);
    if(!container)return;
    // Flush a previous animation before a new decisive result starts.
    void container.offsetWidth;
    this.playing=container;container.classList.add('playing');
    if(this.useAnimations)this.scene(container).play(container.dataset.winner==='white'?'w':'b');
    else this.timer=setTimeout(()=>this.stop(),9300);
  }
}
