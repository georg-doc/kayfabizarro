import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT=process.cwd();
const BASE='http://127.0.0.1:8766/tools/asset_registry/librarian/';
const OUT=path.join(ROOT,'artifacts','asset-librarian-smoke','v1.3');
const MOTION_ASSET='media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_CombatMelee.glb';
const CLIP='Melee_1H_Attack_Chop';
const assert=(v,m)=>{if(!v)throw new Error(m);};
const browserExe=()=>execFileSync('bash',['-lc','command -v google-chrome-stable || command -v google-chrome || command -v chromium || true'],{encoding:'utf8'}).trim();
async function poll(fn,label,ms=60000){const end=Date.now()+ms;let last;while(Date.now()<end){try{last=await fn();if(last)return last;}catch(e){last=e.message;}await sleep(250);}throw new Error(`Timeout ${label}: ${JSON.stringify(last)}`);}
class CDP{
  constructor(ws){this.ws=ws;this.n=1;this.p=new Map();this.errors=[];this.exceptions=[];ws.addEventListener('message',e=>{const m=JSON.parse(String(e.data));if(m.id){const q=this.p.get(m.id);if(!q)return;this.p.delete(m.id);m.error?q.reject(new Error(m.error.message)):q.resolve(m.result||{});return;}if(m.method==='Runtime.consoleAPICalled'&&m.params?.type==='error')this.errors.push(m.params.args?.map(a=>a.value??a.description??'').join(' ')||'console.error');if(m.method==='Runtime.exceptionThrown')this.exceptions.push(m.params?.exceptionDetails?.text||'Runtime exception');});}
  send(method,params={}){const id=this.n++;return new Promise((resolve,reject)=>{this.p.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));});}
  async eval(x){const r=await this.send('Runtime.evaluate',{expression:x,awaitPromise:true,returnByValue:true,userGesture:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||'eval failed');return r.result?.value;}
}
async function connect(url){const ws=new WebSocket(url);await new Promise((ok,bad)=>{ws.addEventListener('open',ok,{once:true});ws.addEventListener('error',()=>bad(new Error('CDP error')),{once:true});});return new CDP(ws);}
async function ev(cdp,x,label,ms){return poll(()=>cdp.eval(x),label,ms);}
async function screenshot(cdp,name){const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true});writeFileSync(path.join(OUT,`${name}.png`),Buffer.from(r.data,'base64'));}
async function clickTab(cdp,name){await cdp.eval(`document.querySelector('[data-library-tab="${name}"]').click();true`);await ev(cdp,`!document.getElementById('resourceWorkspace').hidden`,'workspace');await ev(cdp,`document.getElementById('resourceEyebrow')?.textContent===${JSON.stringify(name)} && document.querySelectorAll('#resourceList .resource-card').length>0`,`${name} rows`);}

async function run(){
  mkdirSync(OUT,{recursive:true});
  const exe=browserExe();assert(exe,'No Chrome');
  const server=spawn('python3',['-m','http.server','8766','--bind','127.0.0.1'],{cwd:ROOT,stdio:'ignore'});
  const browser=spawn(exe,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist','--use-angle=swiftshader','--enable-unsafe-swiftshader','--remote-debugging-port=9224','--user-data-dir=/tmp/kfb-v13','--window-size=1700,1250','about:blank'],{stdio:['ignore','ignore','pipe']});
  let stderr='';browser.stderr.on('data',c=>stderr+=c.toString());const result={schema:'kfb.asset-librarian-v1.3-resources-smoke.v1',checks:{},result:'FAIL'};
  try{
    await poll(async()=>{try{return (await fetch(`${BASE}index.html`)).ok;}catch{return false;}},'server');
    const version=await poll(async()=>{try{const r=await fetch('http://127.0.0.1:9224/json/version');return r.ok?await r.json():false;}catch{return false;}},'chrome');
    const r=await fetch(`http://127.0.0.1:9224/json/new?${encodeURIComponent(BASE)}`,{method:'PUT'}),target=await r.json(),cdp=await connect(target.webSocketDebuggerUrl);await cdp.send('Page.enable');await cdp.send('Runtime.enable');
    await ev(cdp,`document.getElementById('registryStatus')?.textContent==='Registry ready'`,'registry ready');

    await clickTab(cdp,'actors');
    const actors=await cdp.eval(`document.getElementById('resourceList').innerText`);for(const n of ['CapsuleCarl','KayKit Driver Host','FrizzleBob Driver Graft'])assert(String(actors).includes(n),`missing ${n}`);result.checks.actors=true;await screenshot(cdp,'01-actors');

    await clickTab(cdp,'rigs');const rigs=await cdp.eval(`document.getElementById('resourceList').innerText`);assert(String(rigs).includes('kfb-carl-rig-v6(1).json'),'Carl rig missing');assert(String(rigs).includes('kfb-rig-driver.json'),'Driver rig missing');result.checks.rigs=true;

    await clickTab(cdp,'motions');await cdp.eval(`(()=>{const s=document.getElementById('resourceActorFilter');s.value='frizzlebob-driver-graft';s.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`);const count=await ev(cdp,`(()=>{const n=document.querySelectorAll('#resourceList .resource-card').length;return n>100?n:false;})()`,'graft motions');result.checks.graftMotions=count;
    const opened=await cdp.eval(`(()=>{const c=[...document.querySelectorAll('#resourceList .resource-card')].find(x=>x.innerText.includes(${JSON.stringify(CLIP)}));if(!c)return false;c.querySelector('.resource-open').click();return true;})()`);assert(opened,'source clip missing');await ev(cdp,`document.getElementById('resourcePrimaryAction').innerText.includes('Preview source clip')`,'source action');const warning=await cdp.eval(`document.getElementById('resourcePrimaryAction').innerText`);assert(String(warning).includes('does not prove retarget or actor compatibility'),'compatibility warning missing');await cdp.eval(`document.querySelector('#resourcePrimaryAction button.primary').click();true`);await ev(cdp,`document.getElementById('detailPath')?.textContent===${JSON.stringify(MOTION_ASSET)}`,'motion asset',90000);await ev(cdp,`(()=>{const s=document.getElementById('clipSelect');return s?.selectedOptions[0]?.textContent===${JSON.stringify(CLIP)}&&document.getElementById('previewStatus').textContent.includes('playing');})()`,'clip playback',90000);result.checks.sourceClipPreview=true;await screenshot(cdp,'02-source-clip');

    await cdp.eval(`document.querySelector('[data-library-tab="motions"]').click();true`);await ev(cdp,`!document.getElementById('resourceWorkspace').hidden`,'motions return');await ev(cdp,`document.getElementById('resourceEyebrow')?.textContent==='motions'`,'motions return ready');await cdp.eval(`(()=>{const a=document.getElementById('resourceActorFilter');a.value='kfb-pets';a.dispatchEvent(new Event('change',{bubbles:true}));const q=document.getElementById('resourceSearch');q.value='kayfabulate';q.dispatchEvent(new Event('input',{bubbles:true}));return true;})()`);await ev(cdp,`document.querySelectorAll('#resourceList .resource-card').length===1`,'kayfabulate');await cdp.eval(`document.querySelector('#resourceList .resource-open').click();true`);const custom=await ev(cdp,`document.getElementById('resourcePrimaryAction').innerText`,'custom detail');assert(String(custom).includes('owner runtime'),'owner warning missing');assert(!String(custom).includes('Preview source clip'),'fake custom playback');result.checks.customMotionBoundary=true;

    await cdp.eval(`document.querySelector('[data-library-tab="fx"]').click();true`);await ev(cdp,`document.getElementById('resourceEyebrow')?.textContent==='fx' && document.querySelectorAll('#resourceList .resource-card').length>0`,'fx');await cdp.eval(`(()=>{const a=document.getElementById('resourceActorFilter');a.value='kfb-pets';a.dispatchEvent(new Event('change',{bubbles:true}));const q=document.getElementById('resourceSearch');q.value='';q.dispatchEvent(new Event('input',{bubbles:true}));return true;})()`);const fx=await ev(cdp,`(()=>{const t=document.getElementById('resourceList').innerText;return ['spiral','heart','star','dust'].every(x=>t.includes(x))?t:false;})()`,'fx set');result.checks.fx=['spiral','heart','star','dust'].every(x=>String(fx).includes(x));await screenshot(cdp,'03-fx');

    result.consoleErrors=cdp.errors;result.runtimeExceptions=cdp.exceptions;assert(!cdp.errors.length,`console: ${cdp.errors.join(' | ')}`);assert(!cdp.exceptions.length,`exceptions: ${cdp.exceptions.join(' | ')}`);result.browser=version.Browser;result.result='PASS';writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));cdp.ws.close();
  }catch(e){result.failure=String(e.stack||e);result.browserStderr=stderr;writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');throw e;}finally{browser.kill('SIGTERM');server.kill('SIGTERM');}
}
run().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
