import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT=process.cwd();
const STABLE='http://127.0.0.1:8771/asset-librarian/';
const OUT=path.join(ROOT,'artifacts','asset-librarian-smoke','v1.8');
const CLIP='Melee_1H_Attack_Chop';
const DRIVER='media/3D_Assets/KayKit_Mystery_Series6/2 - August 2023 - Driver/character/gltf/Driver.glb';
const assert=(v,m)=>{if(!v)throw new Error(m);};
const browserExe=()=>execFileSync('bash',['-lc','command -v google-chrome-stable || command -v google-chrome || command -v chromium || true'],{encoding:'utf8'}).trim();
async function poll(fn,label,ms=120000){const end=Date.now()+ms;let last;while(Date.now()<end){try{last=await fn();if(last)return last;}catch(e){last=e.message;}await sleep(300);}throw new Error(`Timeout ${label}: ${JSON.stringify(last)}`);}
class CDP{
  constructor(ws){this.ws=ws;this.n=1;this.p=new Map();this.errors=[];this.exceptions=[];ws.addEventListener('message',e=>{const m=JSON.parse(String(e.data));if(m.id){const q=this.p.get(m.id);if(!q)return;this.p.delete(m.id);m.error?q.reject(new Error(m.error.message)):q.resolve(m.result||{});return;}if(m.method==='Runtime.consoleAPICalled'&&m.params?.type==='error')this.errors.push(m.params.args?.map(a=>a.value??a.description??'').join(' ')||'console.error');if(m.method==='Runtime.exceptionThrown')this.exceptions.push(m.params?.exceptionDetails?.text||'Runtime exception');});}
  send(method,params={}){const id=this.n++;return new Promise((resolve,reject)=>{this.p.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));});}
  async eval(x){const r=await this.send('Runtime.evaluate',{expression:x,awaitPromise:true,returnByValue:true,userGesture:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||'eval failed');return r.result?.value;}
}
async function connect(url){const ws=new WebSocket(url);await new Promise((ok,bad)=>{ws.addEventListener('open',ok,{once:true});ws.addEventListener('error',()=>bad(new Error('CDP error')),{once:true});});return new CDP(ws);}
async function ev(cdp,x,label,ms){return poll(()=>cdp.eval(x),label,ms);}
async function screenshot(cdp,name){const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true});writeFileSync(path.join(OUT,`${name}.png`),Buffer.from(r.data,'base64'));}

async function run(){
  mkdirSync(OUT,{recursive:true});
  const exe=browserExe();assert(exe,'No Chrome');
  const server=spawn('python3',['-m','http.server','8771','--bind','127.0.0.1'],{cwd:ROOT,stdio:'ignore'});
  const port=9229;
  const browser=spawn(exe,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist','--use-angle=swiftshader','--enable-unsafe-swiftshader',`--remote-debugging-port=${port}`,`--user-data-dir=/tmp/kfb-v18-${process.pid}`,'--window-size=1740,1250','about:blank'],{stdio:['ignore','ignore','pipe']});
  let stderr='';browser.stderr.on('data',c=>stderr+=c.toString());
  const result={schema:'kfb.asset-librarian-v1.8-collections-motion-smoke.v1',checks:{},result:'FAIL'};
  try{
    await poll(async()=>{try{return (await fetch(STABLE)).ok;}catch{return false;}},'server');
    const version=await poll(async()=>{try{const r=await fetch(`http://127.0.0.1:${port}/json/version`);return r.ok?await r.json():false;}catch{return false;}},'chrome');
    const r=await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(STABLE)}`,{method:'PUT'}),target=await r.json(),cdp=await connect(target.webSocketDebuggerUrl);
    await cdp.send('Page.enable');await cdp.send('Runtime.enable');
    await ev(cdp,`window.KFBAssetLibrarianV18?.version==='1.8' && document.getElementById('registryStatus')?.textContent==='Registry ready'`,'v1.8 ready');
    assert(await cdp.eval(`document.title.includes('v1.8')`),'v1.8 title missing');

    await cdp.eval(`document.getElementById('kaykitPreset').click();true`);
    const kaykit=await ev(cdp,`(()=>{const q=document.getElementById('searchInput').value;const fam=document.getElementById('sourceFamilyFilter').value;const cards=[...document.querySelectorAll('#resultList .result-card')];const packs=cards.map(c=>c.querySelector('.result-subtitle')?.textContent||'');return q===''&&fam==='kaykit'&&cards.length&&packs.every(p=>p.toLowerCase().includes('kaykit'))?{count:cards.length,packOptions:document.getElementById('packFilter').options.length}:false;})()`,'KayKit family browse');
    result.checks.kaykitFamily=kaykit;

    await cdp.eval(`(()=>{const fam=document.getElementById('sourceFamilyFilter');fam.value='tiny-treats';fam.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`);
    const tinyPacks=await ev(cdp,`(()=>{const p=document.getElementById('packFilter');const opts=[...p.options].slice(1);return opts.length>=2&&opts.some(o=>o.value==='bubbly-bathroom-tiny-treats-1-1')?opts.length:false;})()`,'Tiny Treats packs');
    await cdp.eval(`(()=>{const p=document.getElementById('packFilter');p.value='bubbly-bathroom-tiny-treats-1-1';p.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`);
    await ev(cdp,`(()=>{const c=document.getElementById('collectionFilter');return !c.disabled&&[...c.options].some(o=>o.value==='Assets');})()`,'pack collections');
    await cdp.eval(`(()=>{const c=document.getElementById('collectionFilter');c.value='Assets';c.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`);
    const tinyCollection=await ev(cdp,`(()=>{const cards=[...document.querySelectorAll('#resultList .result-card')];return cards.length&&cards.every(card=>card.querySelector('.result-subtitle')?.textContent==='bubbly-bathroom-tiny-treats-1-1'&&card.querySelector('.result-meta-line')?.textContent.startsWith('Assets'))?cards.length:false;})()`,'Tiny Treats collection results');
    result.checks.tinyTreats={packs:tinyPacks,assetsCollection:tinyCollection};
    await screenshot(cdp,'01-collections');

    await cdp.eval(`document.querySelector('[data-library-tab="motions"]').click();true`);
    await ev(cdp,`!document.getElementById('resourceWorkspace').hidden&&document.getElementById('resourceEyebrow')?.textContent==='motions'`,'motions tab');
    await cdp.eval(`(()=>{const scope=document.getElementById('resourceActorFilter');scope.value='driver-host';scope.dispatchEvent(new Event('change',{bubbles:true}));const actor=document.getElementById('motionPreviewActorFilter');actor.value='driver-host';actor.dispatchEvent(new Event('change',{bubbles:true}));const q=document.getElementById('resourceSearch');q.value=${JSON.stringify(CLIP)};q.dispatchEvent(new Event('input',{bubbles:true}));return true;})()`);
    await ev(cdp,`document.querySelectorAll('#resourceList .resource-card').length===1`,'motion result');
    await cdp.eval(`document.querySelector('#resourceList .resource-open').click();true`);
    await ev(cdp,`document.getElementById('resourcePrimaryAction').innerText.includes('Preview on KayKit Driver Host')`,'actor preview action');
    await cdp.eval(`[...document.querySelectorAll('#resourcePrimaryAction button')].find(b=>b.textContent.startsWith('Preview on ')).click();true`);
    const playback=await ev(cdp,`(()=>{const path=document.getElementById('detailPath')?.textContent;const status=document.getElementById('previewStatus')?.textContent||'';const transport=document.getElementById('motionTransport');return path===${JSON.stringify(DRIVER)}&&status.includes(${JSON.stringify(CLIP)})&&status.includes('tracks bound')&&!transport.hidden?{status}:false;})()`,'motion on actor',120000);
    await cdp.eval(`(()=>{const s=document.getElementById('motionSpeed');s.value='0.5';s.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`);
    const speedState=await ev(cdp,`(()=>{const state=window.KFBAssetLibrarianV18.motionTransportState();const value=document.getElementById('motionSpeed').value;return state&&Math.abs(state.speed-.5)<.001&&value==='0.5'?{state,value}:false;})()`,'motion speed');
    await cdp.eval(`document.getElementById('motionPlayPause').click();true`);
    const pauseState=await ev(cdp,`(()=>{const state=window.KFBAssetLibrarianV18.motionTransportState();const label=document.getElementById('motionPlayPause').textContent;return state?.paused===true&&label==='Play'?{state,label}:false;})()`,'motion pause');
    await cdp.eval(`(()=>{const scrub=document.getElementById('motionScrub');scrub.value='0.5';scrub.dispatchEvent(new Event('input',{bubbles:true}));return true;})()`);
    const scrubState=await ev(cdp,`(()=>{const state=window.KFBAssetLibrarianV18.motionTransportState();const value=Number(document.getElementById('motionScrub').value);return state?.paused===true&&state.progress>.49&&state.progress<.51&&value>.49&&value<.51?{state,value}:false;})()`,'motion scrub');
    result.checks.motionPreview={...playback,transport:{speed:speedState,pause:pauseState,scrub:scrubState}};
    await screenshot(cdp,'02-motion-preview');

    result.consoleErrors=cdp.errors;result.runtimeExceptions=cdp.exceptions;
    assert(!cdp.errors.length,`console: ${cdp.errors.join(' | ')}`);
    assert(!cdp.exceptions.length,`exceptions: ${cdp.exceptions.join(' | ')}`);
    result.browser=version.Browser;result.result='PASS';
    writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');
    console.log(JSON.stringify(result,null,2));cdp.ws.close();
  }catch(e){
    result.failure=String(e.stack||e);result.browserStderr=stderr;
    writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');
    writeFileSync(path.join(OUT,'failure.txt'),`${e.stack||e}\n\n${stderr}`);
    throw e;
  }finally{browser.kill('SIGTERM');server.kill('SIGTERM');}
}
run().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
