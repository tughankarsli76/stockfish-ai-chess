import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

function releasePages(version){
 const elements=new Map(),buttons=['privacy','support'].map(key=>({dataset:{releaseInfo:key}}));
 const body={innerHTML:'',title:{textContent:''},querySelector(selector){return selector==='[data-app-title]'&&this.innerHTML.includes('data-app-title')?this.title:null;}};
 const context={document:{createElement:()=>({close(){this.open=false;}}),body:{append(dialog){elements.set(dialog.id,dialog);elements.set('releaseInfoDone',{});elements.set('releaseInfoBack',{});elements.set('releaseInfoBackLabel',{});elements.set('releaseInfoTitle',{});elements.set('releaseInfoBody',body);}},getElementById:id=>elements.get(id),querySelectorAll:()=>buttons}};
 if(version!==undefined){
  // Run the actual iOS bridge before opening the actual release page.
  context.window=context;context.__chessAppInfo={version};context.__chessSaved={};
  context.webkit={messageHandlers:{chess:{postMessage:async()=>{}}}};
  context.crypto={randomUUID:()=> 'test-session'};context.navigator={};context.fetch=async()=>{};
  context.document.addEventListener=()=>{};
  vm.runInNewContext(readFileSync(new URL('../ios/StockfishChess/native-bootstrap.js',import.meta.url),'utf8'),context);
 }
 vm.runInNewContext(readFileSync(new URL('../dist/release-info.js',import.meta.url),'utf8').replace('export function','function'),context);
 context.installReleaseInfo(id=>{elements.get(id).open=true;});
 return {context,body,elements,open:key=>buttons.find(button=>button.dataset.releaseInfo===key).onclick()};
}

for(const version of ['1.3','1.5','2.0.1'])test(`release pages show installed version ${version} through the native bridge`,()=>{
 const page=releasePages(version);page.open('support');
 assert.equal(page.context.chessNative.appVersion,version);
 assert.equal(page.elements.get('releaseInfoDialog').open,true);
 assert.equal(page.body.title.textContent,`Stockfish AI Chess ${version}`);
 assert.ok(page.body.innerHTML.includes('Developed by Tughan Y. Karsli'));
 page.open('support');assert.ok(page.body.innerHTML.includes('mailto:tughankarsli@gmail.com'));
 assert.ok(page.body.innerHTML.endsWith('remove any information you do not want to share.</p>'));
 assert.ok(!page.body.innerHTML.includes('<h3>'));
 page.open('privacy');assert.ok(page.body.innerHTML.includes('Privacy Policy'));
 assert.equal(page.body.title.textContent,`Stockfish AI Chess · App version ${version}`);
 assert.ok(page.body.innerHTML.includes('Privacy policy last updated: October 10, 2026'));
 assert.ok(!page.body.innerHTML.includes('Version 1.0'));
 page.open('support');assert.equal(page.body.title.textContent,`Stockfish AI Chess ${version}`);
});

test('browser preview without installed metadata does not claim an app version',()=>{
 const page=releasePages();page.open('support');
 assert.equal(page.body.title.textContent,'Stockfish AI Chess');
 assert.ok(!page.body.innerHTML.includes('Stockfish AI Chess 1.1'));
 page.open('privacy');assert.equal(page.body.title.textContent,'Stockfish AI Chess');
 assert.ok(page.body.innerHTML.includes('Privacy policy last updated: October 10, 2026'));
});
