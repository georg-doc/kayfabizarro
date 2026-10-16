import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const objects=new Map();let version=0;
const bucket={async get(key){const o=objects.get(key);return o?{etag:o.etag,body:o.value,json:async()=>JSON.parse(o.value)}:null},async head(key){return objects.has(key)?{}:null},async put(key,value,options){const current=objects.get(key);const condition=options?.onlyIf;if(condition?.etagMatches&&current?.etag!==condition.etagMatches)return null;if(condition?.etagDoesNotMatch==='*'&&current)return null;const o={etag:String(++version),value:value instanceof ArrayBuffer?new Uint8Array(value):value};objects.set(key,o);return o}};
globalThis.__testEnv={BUCKET:bucket};
let code=await fs.readFile(new URL('../lib/staging.ts',import.meta.url),'utf8');
code=code.replace("import { env } from 'cloudflare:workers';","const env=globalThis.__testEnv;").replace("'./links'",JSON.stringify(new URL('../lib/links.ts',import.meta.url).href)).replace("export {validBuild} from './links';",'');
const compiled=ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const staging=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const manifests=new Map();let head='a'.repeat(40);let offline=false;let time=Date.now();const realNow=Date.now;Date.now=()=>time;
const make=(n)=>({schema:'kfb.ws1-build/1',commit:'fixture-'+n,date:`2026-10-17T01:${String(n).padStart(2,'0')}:00Z`,tests:{passed:23,total:23},links:{stage:'#stage',m1:'#m1',car:null},notes:'fixture'});
manifests.set(head,make(1));const html='<!doctype html><html>UNCHANGED FIXTURE</html>';
let historyRef=null;
const realFetch=globalThis.fetch;
globalThis.fetch=async input=>{if(offline)throw Error('injected offline');const u=new URL(String(input));if(u.hostname==='api.github.com'){if(u.pathname.includes('/git/trees/'))return Response.json({tree:[{type:'blob',path:'dist/index.html',size:html.length},{type:'blob',path:'dist/assets/test.js',size:10}]});if(u.searchParams.has('path')){historyRef=u.searchParams.get('sha');return Response.json([...manifests.keys()].reverse().map(sha=>({sha})));}return Response.json({sha:head})}if(u.pathname.includes('/ws1/preview/build.json'))return Response.json(manifests.get(head));const parts=u.pathname.split('/');const sha=parts[3],path=parts.slice(4).join('/');if(path==='build.json')return Response.json(manifests.get(sha));if(path.endsWith('index.html'))return new Response(html);if(path==='dist/assets/test.js')return new Response('window.x=1');return new Response('absent',{status:404})};
let count=0;const check=(fn)=>{fn();count++};
try{
 let c=await staging.sync();check(()=>assert.equal(c.builds[0].sha,head));
 check(()=>assert.ok(objects.has('meta/'+head+'.json')));
 check(()=>assert.equal(c.builds.length,1));
 let response=await staging.artifact(head,'index.html');const text=await response.text();check(()=>assert.equal(text,html));
 for(let n=2;n<=6;n++){time+=20000;head=String(n).repeat(40);manifests.set(head,make(n));c=await staging.sync()}
 check(()=>assert.equal(c.builds.length,5));check(()=>assert.equal(c.builds[0].sha,head));
 response=await staging.artifact('a'.repeat(40),'index.html');check(()=>assert.equal(response.status,200));
 const good=head;time+=20000;head='b'.repeat(40);manifests.set(head,{...make(7),tests:[true,false]});c=await staging.sync();check(()=>assert.equal(c.builds[0].sha,good));check(()=>assert.ok(c.error));
 time+=20000;offline=true;c=await staging.sync();check(()=>assert.equal(c.builds[0].sha,good));check(()=>assert.match(c.error,/offline/));
 offline=false;time+=20000;head='c'.repeat(40);manifests.set(head,{...make(8),tests:[{status:'PASS'},true],entry:'dist/index.html'});c=await staging.sync();check(()=>assert.equal(c.builds[0].entry,'dist/index.html'));check(()=>assert.equal(c.builds[0].files.length,2));
 response=await staging.artifact(head,'dist/assets/test.js');check(()=>assert.equal(response.status,200));
 response=await staging.artifact(head,'../secret');check(()=>assert.equal(response.status,400));
 response=await staging.artifact('d'.repeat(40),'index.html');check(()=>assert.equal(response.status,404));
 time+=20000;const pair=await Promise.all([staging.sync(),staging.history()]);const after=await staging.catalog();check(()=>assert.equal(after.builds[0].sha,head));
 check(()=>assert.ok(pair.every(c=>c.builds.length<=5)));
 for(let n=9;n<=14;n++){head=n.toString(16).padStart(40,'0');manifests.set(head,make(n))}
 time+=20000;await staging.sync();await staging.history();const resumed=await staging.catalog();
 check(()=>assert.equal(resumed.builds.length,5));
 check(()=>assert.deepEqual(resumed.builds.map(b=>b.sha),[14,13,12,11,10].map(n=>n.toString(16).padStart(40,'0'))));
 check(()=>assert.equal(resumed.historyChecked,head));
 check(()=>assert.equal(historyRef,head));
 console.log(`${count}/${count} archive integration checks PASS (synthetic source, in-memory R2; not a real WS1 push)`);
}finally{globalThis.fetch=realFetch;Date.now=realNow}
