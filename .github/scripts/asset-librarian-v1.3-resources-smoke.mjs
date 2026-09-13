import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT=process.cwd();
const BASE_URL=process.env.LIBRARIAN_URL || 'http://127.0.0.1:8766/tools/asset_registry/librarian/';
const ARTIFACT_DIR=path.join(ROOT,'artifacts','asset-librarian-smoke','v1.3');
const SOURCE_MOTION='media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_CombatMelee.glb';
const SOURCE_CLIP='Melee_1H_Attack_Chop';

function assert(value,message){if(!value)throw new Error(message);}
function browserExe(){return execFileSync('bash',['-lc','command -v google-chrome-stable || command -v google-chrome || command -v chromium || command -v chromium-browser || true'],{encoding:'utf8'}).trim();}
async function waitHttp(url,timeout=30000){const end=Date.now()+timeout;let last;while(Date.now()<end){try{const r=await fetch(url,{cache:'no-store'});if(r.ok)return r;last=`${r.status}`;}catch(e){last=e.message;}await sleep(250);}throw new Error(`HTTP timeout ${url}: ${last}`);}
class CDP{
  constructor(ws){this.ws=ws;this.id=1;this.pending=new Map();this.consoleErrors=[];this.exceptions=[];ws.addEventListener('message',(e)=>{const m=JSON.parse(String(e.data));if(m.id){const p=this.pending.get(m.id);if(!p)return;this.pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result||{});return;}if(m.method==='Runtime.consoleAPICalled'&&m.params?.type==='error')this.consoleErrors.push(m.params.args?.map(a=>a.value??a.description??'').join(' ')||'console.error');if(m.method==='Runtime.exceptionThrown')this.exceptions.push(m.params?.exceptionDetails?.text||'Runtime exception');});}
  send(method,params={}){const id=this.id++;return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));});}
  async eval(expression){const r=await this.send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true,userGesture:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||'evaluate failed');return r.result?.value;}
}
async function connect(url){const ws=new WebSocket(url);await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(new Error('CDP timeout')),10000);ws.addEventListener('open',()=>{clearTimeout(t);resolve();},{once:true});ws.addEventListener('error',()=>{clearTimeout(t);reject(new Error('CDP error'));},{once:true});});return new CDP(ws);}
async function wait(cdp,expr,label,timeout=60000){const end=Date.now()+timeout;let last;while(Date.now()<end){try{last=await cdp.eval(expr);if(last)return last;}catch(e){last=e.message;}await sleep(250);}throw new Error(`Timed out ${label}; last=${JSON.stringify(last)}`);}
async function shot(cdp,name){const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});writeFileSync(path.join(ARTIFACT_DIR,`${name}.png`),Buffer.from(r.data,'base64'));}
async function tab(cdp,name){await cdp.eval(`document.querySelector('[data-library-tab="${name}"]').click();true`);await wait(cdp,`!document.getElementById('resourceWorkspace').hidden`,'resource workspace');await wait(cdp,`document.querySelectorAll('#resourceList .resource-card').length>0` `${''}`.trim(),`${name} rows`);}

async function run(){
  mkdirSync(ARTIFACT_DIR,{recursive:true});const exe=browserExe();assert(exe,'No Chrome');
  const server=spawn('python3',['-m','http.server','8766','--bind','127.0.0.1'],{cwd:ROOT,stdio:['ignore','pipe','pipe']});
  const browser=spawn(exe,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist','--use-angle=swiftshader','--enable-unsafe-swiftshader','--remote-debugging-address=127.0.0.1','--remote-debugging-port=9224','--user-data-dir=/tmp/kfb-librarian-v13-chrome','--window-size=1700,1250','about:blank'],{stdio:['ignore','pipe','pipe']});
  let stderr='';browser.stderr.on('data',c=>stderr+=c.toString());const result={schema:'kfb.asset-librarian-v1.3-resources-smoke.v1',checks:{},consoleErrors:[],runtimeExceptions:[],result:'FAIL'};
  try{
    await waitHttp(`${BASE_URL}index.html`);const vr=await waitHttp('http://127.0.0.1:9224/json/version'),version=await vr.json();result.browser=version.Browser;
    const cr=await fetch(`http://127.0.0.1:9224/json/new?${encodeURIComponent(BASE_URL)}`,{method:'PUT'});assert(cr.ok,'create target');const target=await cr.json(),cdp=await connect(target.webSocketDebuggerUrl);await cdp.send('Page.enable');await cdp.send('Runtime.enable');
    await wait(cdp,`document.getElementById('registryStatus')?.textContent==='Registry ready'`,'asset registry ready');

    await tab(cdp,'actors');
    const actorText=await cdp.eval(`document.getElementById('resourceList').innerText`);
    for(const name of ['CapsuleCarl','KayKit Driver Host','FrizzleBob Driver Graft'])assert(String(actorText).includes(name),`actor missing: ${name}`);
    result.checks.actors=true;await shot(cdp,'01-actors');

    await tab(cdp,'rigs');
    const rigText=await cdp.eval(`document.getElementById('resourceList').innerText`);
    assert(String(rigText).includes('kfb-carl-rig-v6(1).json'),'Carl rig config missing');
    assert(String(rigText).includes('kfb-rig-driver.json'),'Driver rig config missing');
    result.checks.rigs=true;await shot(cdp,'02-rigs');

    await tab(cdp,'motions');
    await cdp.eval(`(()=>{const s=document.getElementById('resourceActorFilter');s.value='frizzlebob-driver-graft';s.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`);
    const motionCount=await wait(cdp,`document.querySelectorAll('#resourceList .resource-card').length>100 && document.querySelectorAll('#resourceList .resource-card').length`,'FB Graft motion count');
    result.checks.graftMotions=motionCount;
    await cdp.eval(`(()=>{const cards=[...document.querySelectorAll('#resourceList .resource-card')];const c=cards.find(x=>x.innerText.includes(${JSON.stringify(SOURCE_CLIP)}));if(!c)return false;c.querySelector('.resource-open').click();return true;})()`);
    await wait(cdp,`document.getElementById('resourcePrimaryAction').innerText.includes('Preview source clip')`,'source clip action');
    const boundary=await cdp.eval(`document.getElementById('resourcePrimaryAction').innerText`);assert(String(boundary).includes('does not prove retarget or actor compatibility'),'source-preview boundary missing');
    await cdp.eval(`document.querySelector('#resourcePrimaryAction button.primary').click();true`);
    await wait(cdp,`document.getElementById('detailPath')?.textContent===${JSON.stringify(SOURCE_MOTION)}`,'source motion detail',90000);
    await wait(cdp,`(()=>{const s=document.getElementById('clipSelect');return s && s.selectedOptions[0]?.textContent===${JSON.stringify(SOURCE_CLIP)} && document.getElementById('previewStatus').textContent.includes('playing');})()`,'source clip playing',90000);
    result.checks.sourceClipPreview=true;await shot(cdp,'03-source-clip-preview');

    await cdp.eval(`document.querySelector('[data-library-tab="motions"]').click();true`);
    await wait(cdp,`!document.getElementById('resourceWorkspace').hidden`,'motions return');
    await cdp.eval(`(()=>{const a=document.getElementById('resourceActorFilter');a.value='kfb-pets';a.dispatchEvent(new Event('change',{bubbles:true}));const q=document.getElementById('resourceSearch');q.value='kayfabulate';q.dispatchEvent(new Event('input',{bubbles:true}));return true;})()`);
    await wait(cdp,`document.querySelectorAll('#resourceList .resource-card').length===1`,'kayfabulate result');
    await cdp.eval(`document.querySelector('#resourceList .resource-open').click();true`);
    const customMotionAction=await wait(cdp,`document.getElementById('resourcePrimaryAction').innerText`,'custom motion detail');
    assert(String(customMotionAction).includes('owner runtime'),'custom motion owner-runtime warning missing');
    assert(!String(customMotionAction).includes('Preview source clip'),'custom motion exposes fake playback');
    result.checks.customMotionBoundary=true;

    await cdp.eval(`document.querySelector('[data-library-tab="fx"]').click();true`);
    await wait(cdp,`document.querySelectorAll('#resourceList .resource-card').length>0`,'fx rows');
    await cdp.eval(`(()=>{const a=document.getElementById('resourceActorFilter');a.value='kfb-pets';a.dispatchEvent(new Event('change',{bubbles:true}));const q=document.getElementById('resourceSearch');q.value='';q.dispatchEvent(new Event('input',{bubbles:true}));return true;})()`);
    const fxText=await wait(cdp,`(()=>{const t=document.getElementById('resourceList').innerText;return t.includes('spiral')&&t.includes('heart')&&t.includes('star')&&t.includes('dust')?t:false;})()`,'custom fx set');
    result.checks.fx=['spiral','heart','star','dust'].every(x=>String(fxText).includes(x));await shot(cdp,'04-custom-fx');

    result.consoleErrors=cdp.consoleErrors;result.runtimeExceptions=cdp.exceptions;assert(cdp.consoleErrors.length===0,`console errors: ${cdp.consoleErrors.join(' | ')}`);assert(cdp.exceptions.length===0,`runtime exceptions: ${cdp.exceptions.join(' | ')}`);result.result='PASS';writeFileSync(path.join(ARTIFACT_DIR,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));cdp.ws.close();
  }catch(e){result.failure=String(e.stack||e);result.browserStderr=stderr;writeFileSync(path.join(ARTIFACT_DIR,'result.json'),JSON.stringify(result,null,2)+'\n');writeFileSync(path.join(ARTIFACT_DIR,'failure.txt'),`${e.stack||e}\n\n${stderr}`);throw e;}finally{browser.kill('SIGTERM');server.kill('SIGTERM');}
}
run().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
