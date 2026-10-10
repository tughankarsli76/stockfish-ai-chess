// Keep the board, Analysis, and toolbar fixed; Game and dialogs can scroll.
export function installFixedPages(){
  let scheduled=false;
  const entries=new WeakMap(),observed=new WeakSet();
  const tabletLayout=()=>matchMedia('(min-width:700px) and (min-height:600px)').matches;
  const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}};
  const resize=new ResizeObserver(schedule);
  document.addEventListener('touchmove',event=>{
    if(event.target.closest('.app>#analysisPanel')){event.preventDefault();return;}
    if(event.target.closest('.app>#gamePanel')||tabletLayout()&&event.target.closest('.app>.tab-panel'))return;
    if(!event.target.closest('dialog,textarea'))event.preventDefault();
  },{passive:false});
  function update(){
    scheduled=false;
    if(document.querySelector('.app>:is(#gamePanel,#analysisPanel):not([hidden])')){
      for(const area of document.querySelectorAll('.app>.tab-panel')){
        area.classList.remove('has-fixed-pages');
        const entry=entries.get(area);
        if(entry)entry.nav.hidden=true;
      }
      return;
    }
    for(const area of document.querySelectorAll('.app>.tab-panel:not([hidden])')){
      if(!area.clientHeight)continue;
      if(!observed.has(area)){observed.add(area);resize.observe(area);}
      let entry=entries.get(area);
      // Game and Analysis never paginate; other tablet panels scroll.
      if(area.id==='gamePanel'||area.id==='analysisPanel'||tabletLayout()){
        area.classList.remove('has-fixed-pages');
        if(entry)entry.nav.hidden=true;
        continue;
      }
      const previousScroll=area.scrollTop;
      // Remove the reserved footer while measuring the actual content.
      area.classList.remove('has-fixed-pages');
      const needed=area.scrollHeight>area.clientHeight+2;
      if(!needed){if(entry)entry.nav.hidden=true;area.scrollTop=0;continue;}
      area.classList.add('has-fixed-pages');
      area.scrollTop=previousScroll;
      if(!entry){
        const nav=document.createElement('nav');nav.className='fixed-page-nav';nav.setAttribute('aria-label','Page navigation');
        const previous=document.createElement('button'),label=document.createElement('span'),next=document.createElement('button');
        previous.type=next.type='button';previous.textContent='Previous';next.textContent='Next';
        label.setAttribute('aria-live','polite');nav.append(previous,label,next);area.append(nav);
        entry={nav,previous,label,next,step:1};entries.set(area,entry);
        previous.onclick=()=>{area.scrollTop=Math.max(0,area.scrollTop-entry.step);schedule();};
        next.onclick=()=>{area.scrollTop=Math.min(area.scrollHeight-area.clientHeight,area.scrollTop+entry.step);schedule();};
      }
      const rect=area.getBoundingClientRect();
      Object.assign(entry.nav.style,{left:`${rect.left+2}px`,top:`${rect.bottom-54}px`,width:`${rect.width-4}px`});
      entry.nav.hidden=false;
      const heading=area.querySelector('.dialog-heading,.mode-heading,.difficulty-heading');
      entry.step=Math.max(60,area.clientHeight-78-(heading?.offsetHeight||0));
      const max=Math.max(0,area.scrollHeight-area.clientHeight);
      entry.previous.disabled=area.scrollTop<1;entry.next.disabled=area.scrollTop>=max-1;
      const text=`${Math.min(Math.ceil(max/entry.step)+1,Math.ceil(area.scrollTop/entry.step)+1)} / ${Math.ceil(max/entry.step)+1}`;
      if(entry.label.textContent!==text)entry.label.textContent=text;
    }
  }
  new MutationObserver(records=>{
    if(records.some(record=>!record.target.parentElement?.closest('.fixed-page-nav')&&!record.target.closest?.('.fixed-page-nav')))schedule();
  }).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['open','hidden']});
  window.addEventListener('resize',schedule);
  schedule();
}
