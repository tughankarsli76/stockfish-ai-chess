import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../dist/menus.js',import.meta.url),'utf8');
const setup=source.slice(source.indexOf("  const toolbar=document.createElement('nav');"),source.indexOf("  toolbar.insertAdjacentHTML('beforebegin'"));
const handlers=source.slice(source.indexOf("  click('toolbarGame'"),source.indexOf('\n',source.indexOf("  click('toolbarGame'")));
const sync=source.slice(source.indexOf('  function sync(){'),source.indexOf('  function renderInsights(){'));

function harness({tab='game',showAnalysis=true}={}){
 const nodes=new Map(),frames=new Map(),opened=[];let frameId=0,context;
 function element(tag='div',id=''){
  const classes=new Set(),attributes=new Map(),listeners=new Map();
  const node={tag,id,children:[],parent:null,style:{},disabled:false,clientLeft:0,clientTop:0,
   classList:{add:name=>classes.add(name),remove:name=>classes.delete(name),contains:name=>classes.has(name),toggle(name,enabled){enabled??=!classes.has(name);enabled?classes.add(name):classes.delete(name);}},
   setAttribute:(name,value)=>attributes.set(name,String(value)),getAttribute:name=>attributes.get(name)??null,
   append(...children){for(const child of children){child.parent=this;this.children.push(child);}},
   addEventListener(type,listener){listeners.set(type,listener);},
   contains(child){return child===this||this.children.some(node=>node.contains(child));},
   closest(selector){return selector==='button'?(tag==='button'?this:this.parent?.closest(selector)):null;},
   querySelector(selector){return selector.startsWith('#')?nodes.get(selector.slice(1)):element();},
   querySelectorAll(){return this.children.filter(node=>node.tag==='button');},
   getBoundingClientRect(){const i=['toolbarGame','toolbarOptions','toolbarAnalysis','toolbarFlip','toolbarMove'].indexOf(this.id);return i>=0?{left:10+i*100,top:510,width:80,height:40}:{left:10,top:500,width:500,height:60};},
   dispatchClick(button){listeners.get('click')?.({target:button});if(!button.disabled)button.onclick?.();}
  };
  Object.defineProperty(node,'innerHTML',{set(html){for(const [,id] of html.matchAll(/<button id="([^"]+)"/g)){const child=element('button',id);nodes.set(id,child);this.append(child);}}});
  if(id)nodes.set(id,node);return node;
 }
 const $=id=>{if(!nodes.has(id))nodes.set(id,element('div',id));return nodes.get(id);};
 const state={tab,settings:{showAnalysis,engine:'stockfish19',theme:'maple',pieceSet:'classic',hash:32,threads:1,time:0,opponent:'local'},analysisPaused:false,session:{cursor:0,length:0,live:true,game:{isGameOver:()=>false}}};
 const api={state:()=>state,setTab(tab){state.tab=tab;context.sync();},toggleAnalysis(){this.setTab(state.tab==='analysis'?'game':'analysis');},patch(patch){Object.assign(state.settings,patch);context.sync();},flip(){context.sync();}};
 const app=element(),body=element();
 context={api,$,document:{createElement:element,querySelector:()=>app,querySelectorAll:()=>[],body},window:{addEventListener(){}},
  requestAnimationFrame:fn=>{frames.set(++frameId,fn);return frameId;},cancelAnimationFrame:id=>frames.delete(id),
  click:(id,fn)=>{$(id).onclick=fn;},open:id=>{opened.push(id);context.sync();},
  toggles:{},hashSizes:[16,32],analysisTimeButtons:[],varietyButtons:[],difficultyButtons:[],modeButtons:[],
  difficultyForLevel:()=>({level:19,number:19,label:'Full Strength'}),PIECE_SETS:{classic:{name:'Classic'}},boards:{maple:'Maple'},
  timeLabel:()=> 'Forever',labels:{},language:()=> 'en',t:value=>value,
  renderThreads(){},renderHash(){},renderModeTime(){},renderIncrement(){},translate(){},renderInsights(){},refreshCapturedPieces(){},localStorage:{getItem:()=>null}};
 vm.createContext(context);vm.runInContext(setup+'\n'+handlers+'\n'+sync+'\nthis.toolbar=toolbar;this.pill=toolbarSelection;',context);context.sync();
 const tap=id=>context.toolbar.dispatchClick($(id));
 const active=()=>context.toolbar.children.filter(node=>node.tag==='button'&&node.classList.contains('active')).map(node=>node.id);
 const position=()=>context.pill.style.transform;
 return {api,state,$,tap,active,position,opened,context};
}

test('tapping Analysis twice returns the active button, selection pill and pressed state to Game',()=>{
 const h=harness(),gamePosition=h.position();assert.deepEqual(h.active(),['toolbarGame']);
 h.tap('toolbarAnalysis');assert.equal(h.state.tab,'analysis');assert.deepEqual(h.active(),['toolbarAnalysis']);
 const analysisPosition=h.position();assert.notEqual(analysisPosition,gamePosition);
 assert.equal(h.$('toolbarAnalysis').getAttribute('aria-pressed'),'true');assert.equal(h.$('toolbarGame').getAttribute('aria-pressed'),'false');
 h.tap('toolbarAnalysis');assert.equal(h.state.tab,'game');assert.deepEqual(h.active(),['toolbarGame']);assert.equal(h.position(),gamePosition);
 assert.equal(h.$('toolbarAnalysis').getAttribute('aria-pressed'),'false');assert.equal(h.$('toolbarGame').getAttribute('aria-pressed'),'true');
});

test('programmatic view changes move the active button and pill without a toolbar click',()=>{
 const h=harness(),gamePosition=h.position();h.api.setTab('analysis');assert.deepEqual(h.active(),['toolbarAnalysis']);assert.notEqual(h.position(),gamePosition);
 h.api.setTab('game');assert.deepEqual(h.active(),['toolbarGame']);assert.equal(h.position(),gamePosition);
 h.api.setTab('analysis');h.api.setTab('graph');assert.deepEqual(h.active(),['toolbarGame']);assert.equal(h.$('toolbarAnalysis').getAttribute('aria-pressed'),'false');
});

test('Options, Flip and Move retain deliberate highlights through same-view rerenders',()=>{
 for(const tab of ['game','analysis'])for(const id of ['toolbarOptions','toolbarFlip','toolbarMove']){
  const h=harness({tab});h.tap(id);assert.deepEqual(h.active(),[id]);const position=h.position();
  h.api.patch({showAnalysis:true});assert.deepEqual(h.active(),[id]);assert.equal(h.position(),position);
  assert.equal(h.$('toolbarAnalysis').getAttribute('aria-pressed'),String(tab==='analysis'));
  h.api.setTab(tab==='analysis'?'game':'analysis');assert.deepEqual(h.active(),[tab==='analysis'?'toolbarGame':'toolbarAnalysis']);
 }
});

test('Analysis enables a hidden analysis display and remains correct through its intermediate settings sync',()=>{
 const h=harness({showAnalysis:false});h.tap('toolbarAnalysis');assert.equal(h.state.settings.showAnalysis,true);assert.equal(h.state.tab,'analysis');assert.deepEqual(h.active(),['toolbarAnalysis']);
 h.tap('toolbarAnalysis');assert.deepEqual(h.active(),['toolbarGame']);
});

test('initial Analysis selection and paused accessibility state agree with the active view',()=>{
 const h=harness({tab:'analysis'});assert.deepEqual(h.active(),['toolbarAnalysis']);assert.equal(h.$('toolbarAnalysis').getAttribute('aria-pressed'),'true');
 h.state.analysisPaused=true;h.context.sync();assert.deepEqual(h.active(),['toolbarAnalysis']);assert.equal(h.$('toolbarAnalysis').getAttribute('aria-pressed'),'false');
 h.api.setTab('game');assert.deepEqual(h.active(),['toolbarGame']);assert.equal(h.$('toolbarGame').getAttribute('aria-pressed'),'true');
});
