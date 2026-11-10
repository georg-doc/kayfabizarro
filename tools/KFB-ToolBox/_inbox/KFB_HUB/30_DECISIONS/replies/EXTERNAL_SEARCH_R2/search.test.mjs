import test from 'node:test';
import assert from 'node:assert/strict';
import { createSearchPager, pageSize } from './site/external-search-paging.js';
const providers = ids => ids.map(id=>({id,name:id}));
const asset = (p,i,extra={})=>({id:`${p}:${i}`,provider:p,type:'model',price:{free:true},downloadable:true,...extra});
const reply=(p,rows,extra={})=>({results:rows,providers:[{provider:p,status:'ok',...extra}]});
test('per-source paging retains merge tails and unique results beyond 36',async()=>{
 const calls=[]; const pager=createSearchPager({request:async p=>{calls.push(p); return reply(p.providers,Array.from({length:24},(_,i)=>asset(p.providers,p.offset+i)),{total:72});}});
 await pager.reset({q:'tree'},providers(['a','b'])); assert.equal(pager.state.results.length,48); assert.equal(pager.state.visible,36);
 await pager.more(); assert.equal(calls.length,2); assert.equal(pager.state.visible,72);
 await pager.more(); assert.equal(pager.state.results.length,96); assert.deepEqual(calls.map(x=>[x.providers,x.offset]),[['a',0],['b',0],['a',24],['b',24]]);
 assert.equal(new Set(pager.state.results.map(x=>x.id)).size,96);
});
test('native page boundaries never skip 50/200 boundary rows',()=>{
 assert.equal(pageSize('sketchfab',24),24); assert.equal(pageSize('threedtexel',48),2); assert.equal(pageSize('texturescom',192),8);
 for(const id of ['threedtexel','texturescom']) {let offset=0; for(let i=0;i<30;i++){let n=pageSize(id,offset),boundary=id==='threedtexel'?50:200;assert.ok(offset%boundary+n<=boundary);offset+=n;}}
});
test('failures retain same cursor and can retry, link source is labelled',async()=>{
 let count=0; const offsets=[];const pager=createSearchPager({request:async p=>{offsets.push(p.offset);if(!count++)throw Error('429');return reply(p.providers,[asset('a',0)],{total:1});}});
 await pager.reset({q:'tree'},providers(['a'])); assert.equal(pager.state.sources[0].offset,0);assert.equal(pager.canFetch(),true);
 await pager.more();assert.deepEqual(offsets,[0,0]);assert.equal(pager.state.results.length,1);assert.equal(pager.canFetch(),false);
});
test('short/empty filtered pages with unknown total remain searchable, strict free/download claims',async()=>{
 const pager=createSearchPager({request:async p=>reply(p.providers,p.offset===0?[asset('a',0,{price:{}}),asset('a',1,{downloadable:false})]:[asset('a',24)])});
 await pager.reset({q:'tree',free:true,downloadable:true},providers(['a']));assert.equal(pager.state.results.length,0);assert.equal(pager.canFetch(),true);
 await pager.more();assert.equal(pager.state.results.length,1);assert.equal(pager.state.sources[0].offset,48);
});
test('new query cancels stale work without stale state or loading unlock',async()=>{
 let release; const pager=createSearchPager({request:p=>p.q==='old'?new Promise(resolve=>{release=()=>resolve(reply('a',[asset('a','old')]));}):Promise.resolve(reply('a',[asset('a','new')],{total:1}))});
 const old=pager.reset({q:'old'},providers(['a']));await pager.reset({q:'new'},providers(['a']));release();await old;
 assert.deepEqual(pager.state.results.map(x=>x.id),['a:new']);assert.equal(pager.state.config.q,'new');assert.equal(pager.state.loading,false);
});
test('double-click locked, duplicates stop repeating sources without inventing exhaustive total',async()=>{
 let calls=0;const pager=createSearchPager({request:async p=>{calls++;return reply(p.providers,[asset('a',0)]);}});
 await pager.reset({q:'tree'},providers(['a']));await Promise.all([pager.more(),pager.more()]);assert.equal(calls,2);assert.equal(pager.state.results.length,1);assert.match(pager.state.sources[0].bound,/repeats/);
});
test('controller renders paged counts, keeps helpers and binds load-more/filter events',async()=>{
 const {createExternalSearchController}=await import('./site/external-3d-search.js');
 const storage=()=>({getItem:()=>null,setItem:()=>{}});globalThis.localStorage=storage();globalThis.sessionStorage=storage();globalThis.Option=class{constructor(text,value){this.text=text;this.value=value;}};
 const nodes=new Map();const $=id=>{if(!nodes.has(id))nodes.set(id,{value:'',checked:false,innerHTML:'',textContent:'',listeners:{},addEventListener(t,fn){this.listeners[t]=fn;},replaceChildren(){},setAttribute(){},focus(){}});return nodes.get(id);};
 $('externalSearchInput').value='tree';$('externalFreeOnly').checked=true;
 globalThis.fetch=async url=>{const u=new URL(url);let body;
 if(u.pathname==='/v1/providers') body={providers:providers(['a','b']).map(p=>({...p,assetTypes:['model'],enabled:true,supportsDownload:true}))};
 else if(u.pathname==='/v1/search') body=reply(u.searchParams.get('providers'),Array.from({length:24},(_,i)=>asset(u.searchParams.get('providers'),i)),{total:24});
 else body=asset('a',0);
 return {ok:true,json:async()=>body};};
 const controller=createExternalSearchController({$,escapeHTML:s=>String(s),toast:()=>{}});controller.bind();await controller.search();
 assert.match($('externalResultMeta').textContent,/36 shown · 48 unique/);assert.equal(($('externalResults').innerHTML.match(/<article /g)||[]).length,36);
 await $('externalLoadMore').listeners.click();assert.match($('externalResultMeta').textContent,/48 shown · 48 unique/);assert.ok($('externalSourceReport').innerHTML.includes('source reports 24'));
 assert.ok($('externalFreeOnly').listeners.change);
});
