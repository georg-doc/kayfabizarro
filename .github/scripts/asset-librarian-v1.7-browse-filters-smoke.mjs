import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT=process.cwd();
const STABLE='http://127.0.0.1:8770/asset-librarian/';
const OUT=path.join(ROOT,'artifacts','asset-librarian-smoke','v1.7');
const assert=(v,m)=>{if(!v)throw new Error(m);};
const browserExe=()=>execFileSync('bash',['-lc','command -v google-chrome-stable || command -v google-chrome || command -v chromium || true'],{encoding:'utf8'}).trim();
async function poll(fn,label,ms=120000){const end=Date.now()+ms;let last;while(Date.now()<end){try{last=await fn();if(last)return last;}catch(e){last=e.message;}await sleep(300);}throw new Error(`Timeout ${label}: ${JSON.stringify(last)}`);}
class CDP{constructor(ws){this.ws=ws;this.n=1;this.p=new Map();this.errors=[];this.exceptions=[];ws.addEventListener('message',e=>{const m=JSON.parse(String(e.data));if(m.id){const q=this.p.get(m.id);if(!q)return;this.p.delete(m.id);m.error?q.reject(new Error(m.error.message)):q.resolve(m.result||{});return;}if(m.method==='Runtime.consoleAPICalled'&&m.params?.type==='error')this.errors.push(m.params.args?.map(a=>a.value??a.description??'').join(' ')||'console.error');if(m.method==='Runtime.exceptionThrown')this.exceptions.push(m.params?.exceptionDetails?.text||'Runtime exception');});}send(method,params={}){const id=this.n++;return new Promise((resolve,reject)=>{this.p.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));});}async eval(x){const r=await this.send('Runtime.evaluate',{expression:x,awaitPromise:true,returnByValue:true,userGesture:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||'eval failed');return r.result?.value;}}
async function connect(url){const ws=new WebSocket(url);await new Promise((ok,bad)=>{ws.addEventListener('open',ok,{once:true});ws.addEventListener('error',()=>bad(new Error('CDP error')),{once:true});});return new CDP(ws);}
async function ev(cdp,x,label,ms){return poll(()=>cdp.eval(x),label,ms);}
async function screenshot(cdp,name){const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true});writeFileSync(path.join(OUT,`${name}.png`),Buffer.from(r.data,'base64'));}

async function run(){
  mkdirSync(OUT,{recursive:true});const exe=browserExe();assert(exe,'No Chrome');
  const server=spawn('python3',['-m','http.server','8770','--bind','127.0.0.1'],{cwd:ROOT,stdio:'ignore'});const port=9228;
  const browser=spawn(exe,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist','--use-angle=swiftshader','--enable-unsafe-swiftshader',`--remote-debugging-port=${port}`,`--user-data-dir=/tmp/kfb-v17-${process.pid}`,'--window-size=1740,1250','about:blank'],{stdio:['ignore','ignore','pipe']});
  let stderr='';browser.stderr.on('data',c=>stderr+=c.toString());const result={schema:'kfb.asset-librarian-v1.7-browse-filters-smoke.v1',checks:{},result:'FAIL'};
  try{
    await poll(async()=>{try{return (await fetch(STABLE)).ok;}catch{return false;}},'server');
    const version=await poll(async()=>{try{const r=await fetch(`http://127.0.0.1:${port}/json/version`);return r.ok?await r.json():false;}catch{return false;}},'chrome');
    const r=await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(STABLE)}`,{method:'PUT'}),target=await r.json(),cdp=await connect(target.webSocketDebuggerUrl);await cdp.send('Page.enable');await cdp.send('Runtime.enable');
    await ev(cdp,`window.KFBAssetLibrarianV17?.version==='1.7' && document.getElementById('registryStatus')?.textContent==='Registry ready'`,'v1.7 ready');
    assert(await cdp.eval(`document.title.includes('v1.7')`),'v1.7 title missing');

    await cdp.eval(`document.getElementById('kaykitPreset').click()`);
    const page1=await ev(cdp,`(()=>{const n=document.querySelectorAll('#resultList .result-card').length;const t=document.getElementById('resultMeta').textContent;return n===120&&t.includes('primary matches')?{n,t}:false;})()`,'KayKit first page',120000);
    const moreVisible=await cdp.eval(`!document.getElementById('loadMoreButton').hidden`);assert(moreVisible,'Load more should be visible for KayKit');
    await cdp.eval(`document.getElementById('loadMoreButton').click()`);
    const page2=await ev(cdp,`(()=>{const n=document.querySelectorAll('#resultList .result-card').length;return n>120?n:false;})()`,'KayKit second page',120000);
    result.checks.pagination={first:page1.n,afterLoadMore:page2,meta:page1.t};

    await cdp.eval(`(()=>{document.getElementById('searchInput').value='';document.getElementById('packFilter').value='kaykit-boardgamebits-1-0-free';return window.KFBAssetLibrarianV17.runSearch();})()`);
    const board=await ev(cdp,`(()=>{const cards=[...document.querySelectorAll('#resultList .result-card')];return cards.length&&cards.every(c=>c.querySelector('.result-subtitle')?.textContent==='kaykit-boardgamebits-1-0-free')?cards.length:false;})()`,'BoardGameBits pack');
    result.checks.boardGameBits=board;

    await cdp.eval(`(()=>{document.getElementById('packFilter').value='';document.getElementById('searchInput').value='KayKit';for(const i of document.querySelectorAll('#typeFilterOptions input'))i.checked=['character','nature'].includes(i.value);document.getElementById('typeFilterOptions').dispatchEvent(new Event('change',{bubbles:true}));return window.KFBAssetLibrarianV17.runSearch();})()`);
    const typeMulti=await ev(cdp,`(()=>{const cards=[...document.querySelectorAll('#resultList .result-card')];const ok=cards.length&&cards.every(c=>['character','nature'].includes(c.dataset.assetType));return ok?{count:cards.length,summary:document.getElementById('typeFilterSummary').textContent}:false;})()`,'type multiselect',120000);
    assert(typeMulti.summary.includes('2 selected'),'type multiselect summary missing');result.checks.typeMultiselect=typeMulti;

    await cdp.eval(`(()=>{for(const i of document.querySelectorAll('#typeFilterOptions input'))i.checked=false;document.getElementById('typeFilterOptions').dispatchEvent(new Event('change',{bubbles:true}));for(const i of document.querySelectorAll('#formatFilterOptions input'))i.checked=['glb','gltf'].includes(i.value);document.getElementById('formatFilterOptions').dispatchEvent(new Event('change',{bubbles:true}));return window.KFBAssetLibrarianV17.runSearch();})()`);
    const formatMulti=await ev(cdp,`(()=>{const cards=[...document.querySelectorAll('#resultList .result-card')];const ok=cards.length&&cards.every(c=>{const b=[...c.querySelectorAll('.result-badges .badge')].map(x=>x.textContent.toLowerCase());return b.includes('glb')||b.includes('gltf');});return ok?{count:cards.length,summary:document.getElementById('formatFilterSummary').textContent}:false;})()`,'format multiselect',120000);
    assert(formatMulti.summary.includes('GLB')&&formatMulti.summary.includes('GLTF'),'format multiselect summary missing');result.checks.formatMultiselect=formatMulti;

    await cdp.eval(`(()=>{for(const i of document.querySelectorAll('#formatFilterOptions input'))i.checked=false;document.getElementById('formatFilterOptions').dispatchEvent(new Event('change',{bubbles:true}));document.getElementById('searchInput').value='Rig_Medium_General';document.getElementById('browseModeFilter').value='primary';document.getElementById('browseModeFilter').dispatchEvent(new Event('change',{bubbles:true}));return window.KFBAssetLibrarianV17.runSearch();})()`);
    await ev(cdp,`document.getElementById('resultMeta').textContent.includes('0 primary matches')`,'primary hides animation sources');
    await cdp.eval(`(()=>{document.getElementById('browseModeFilter').value='all';document.getElementById('browseModeFilter').dispatchEvent(new Event('change',{bubbles:true}));return true;})()`);
    const animationRaw=await ev(cdp,`[...document.querySelectorAll('#resultList .result-card')].some(c=>c.dataset.assetType==='animation-source')`,'all representations reveals animation sources',120000);result.checks.animationSourceBoundary=animationRaw;

    await cdp.eval(`(()=>{document.getElementById('browseModeFilter').value='primary';document.getElementById('browseModeFilter').dispatchEvent(new Event('change',{bubbles:true}));document.getElementById('searchInput').value='Driver';return window.KFBAssetLibrarianV17.runSearch();})()`);
    const driver=await ev(cdp,`(()=>{const ids=[...document.querySelectorAll('#resultList .result-card')].map(c=>c.dataset.assetId);const glb=ids.filter(id=>/\/Driver\.glb$/i.test(id));const fbx=ids.filter(id=>/\/Driver\.fbx$/i.test(id));return glb.length&&fbx.length===0?{glb:glb.length,fbx:fbx.length}:false;})()`,'primary Driver representation',120000);result.checks.primaryRepresentation=driver;
    await screenshot(cdp,'01-kaykit-primary-browse-filters');

    result.consoleErrors=cdp.errors;result.runtimeExceptions=cdp.exceptions;assert(!cdp.errors.length,`console: ${cdp.errors.join(' | ')}`);assert(!cdp.exceptions.length,`exceptions: ${cdp.exceptions.join(' | ')}`);result.browser=version.Browser;result.result='PASS';writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));cdp.ws.close();
  }catch(e){result.failure=String(e.stack||e);result.browserStderr=stderr;writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');writeFileSync(path.join(OUT,'failure.txt'),`${e.stack||e}\n\n${stderr}`);throw e;}finally{browser.kill('SIGTERM');server.kill('SIGTERM');}
}
run().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
