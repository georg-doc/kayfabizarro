import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT=process.cwd();
const BASE='http://127.0.0.1:8767/tools/asset_registry/librarian/';
const OUT=path.join(ROOT,'artifacts','asset-librarian-smoke','v1.4');
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
async function clickTab(cdp,name){await cdp.eval(`document.querySelector('[data-library-tab="${name}"]').click();true`);await ev(cdp,`!document.getElementById('resourceWorkspace').hidden`,'workspace');await ev(cdp,`document.querySelectorAll('#resourceList .resource-card').length>0`,`${name} rows`);}
async function openRig(cdp,text){const ok=await cdp.eval(`(()=>{const c=[...document.querySelectorAll('#resourceList .resource-card')].find(x=>x.innerText.includes(${JSON.stringify(text)}));if(!c)return false;c.querySelector('.resource-open').click();return true;})()`);assert(ok,`rig missing: ${text}`);}
async function canvasSignal(cdp){await sleep(500);return cdp.eval(`(()=>{const c=document.getElementById('resourcePreviewCanvas');if(!c||!c.width||!c.height)return 0;try{return c.toDataURL('image/png').length;}catch{return 0;}})()`);}

async function run(){
  mkdirSync(OUT,{recursive:true});
  const exe=browserExe();assert(exe,'No Chrome');
  const server=spawn('python3',['-m','http.server','8767','--bind','127.0.0.1'],{cwd:ROOT,stdio:'ignore'});
  const browser=spawn(exe,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist','--use-angle=swiftshader','--enable-unsafe-swiftshader','--remote-debugging-port=9225','--user-data-dir=/tmp/kfb-v14','--window-size=1700,1250','about:blank'],{stdio:['ignore','ignore','pipe']});
  let stderr='';browser.stderr.on('data',c=>stderr+=c.toString());const result={schema:'kfb.asset-librarian-v1.4-live-rigs-smoke.v1',checks:{},result:'FAIL'};
  try{
    await poll(async()=>{try{return (await fetch(`${BASE}index.html`)).ok;}catch{return false;}},'server');
    const version=await poll(async()=>{try{const r=await fetch('http://127.0.0.1:9225/json/version');return r.ok?await r.json():false;}catch{return false;}},'chrome');
    const r=await fetch(`http://127.0.0.1:9225/json/new?${encodeURIComponent(BASE)}`,{method:'PUT'}),target=await r.json(),cdp=await connect(target.webSocketDebuggerUrl);await cdp.send('Page.enable');await cdp.send('Runtime.enable');
    await ev(cdp,`document.getElementById('registryStatus')?.textContent==='Registry ready'`,'registry ready');

    const mode=await cdp.eval(`document.getElementById('registryModeSelect').value`);assert(mode==='live',`expected live default, got ${mode}`);
    const line=await cdp.eval(`document.getElementById('sourceCommit').textContent`);assert(String(line).startsWith('LIVE · '),`live source line missing: ${line}`);assert(String(line).includes('12,860')||String(line).includes('12860'),`fresh live count missing: ${line}`);result.checks.liveRegistry=line;

    await cdp.eval(`(()=>{document.getElementById('searchInput').value='KFB_Tourbus_WaterBowser';return window.KFBAssetLibrarianV14.runSearch();})()`);
    const tourbus=await ev(cdp,`(()=>{const t=document.getElementById('resultList').innerText;return t.includes('KFB_Tourbus_WaterBowser')?t:false;})()`,'live Tourbus search');assert(String(tourbus).includes('KFB_Tourbus_WaterBowser'),'Tourbus missing from live Registry');result.checks.tourbus=true;
    await cdp.eval(`(()=>{document.getElementById('searchInput').value='GothGirl';return window.KFBAssetLibrarianV14.runSearch();})()`);
    const goth=await ev(cdp,`(()=>{const t=document.getElementById('resultList').innerText;return t.includes('GothGirl')?t:false;})()`,'live GothGirl search');assert(String(goth).includes('GothGirl'),'GothGirl missing from live Registry');result.checks.gothGirl=true;await screenshot(cdp,'01-live-gothgirl');

    await cdp.eval(`(()=>{const s=document.getElementById('registryModeSelect');s.value='canonical';s.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`);await ev(cdp,`document.getElementById('registryStatus')?.textContent==='Registry ready' && document.getElementById('sourceCommit').textContent.startsWith('CANONICAL · ')`,'canonical switch');result.checks.canonicalSwitch=true;
    await cdp.eval(`(()=>{const s=document.getElementById('registryModeSelect');s.value='live';s.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`);await ev(cdp,`document.getElementById('registryStatus')?.textContent==='Registry ready' && document.getElementById('sourceCommit').textContent.startsWith('LIVE · ')`,'live switch back');

    await clickTab(cdp,'rigs');
    await openRig(cdp,'kfb-carl-rig-v6(1).json');
    await ev(cdp,`document.getElementById('resourcePreviewStatus').textContent==='Loaded · owner runtime'`,'Carl owner preview',120000);
    const carlSignal=await canvasSignal(cdp);assert(carlSignal>2000,`Carl canvas empty: ${carlSignal}`);result.checks.carlOwnerPreview=carlSignal;await screenshot(cdp,'02-carl-owner-rig');

    await cdp.eval(`document.getElementById('resourceDetailClose').click();true`);
    await openRig(cdp,'kfb-pet-graft-driver (4).json');
    await ev(cdp,`document.getElementById('resourcePreviewStatus').textContent==='Loaded · owner runtime'`,'Graft owner preview',120000);
    const graftSignal=await canvasSignal(cdp);assert(graftSignal>2000,`Graft canvas empty: ${graftSignal}`);result.checks.graftOwnerPreview=graftSignal;await screenshot(cdp,'03-graft-owner-rig');

    await cdp.eval(`document.getElementById('resourceDetailClose').click();true`);
    await openRig(cdp,'kfb-rig-driver (Rover 01).json');
    await ev(cdp,`document.getElementById('resourcePreviewStatus').textContent==='Loaded · partial composition'`,'Rover partial preview',120000);
    const roverNote=await cdp.eval(`document.getElementById('resourcePreviewNote').textContent`);assert(String(roverNote).includes('cut/base/cockpit fabrication'),'vehicle truth boundary missing');const roverSignal=await canvasSignal(cdp);assert(roverSignal>2000,`Rover canvas empty: ${roverSignal}`);result.checks.roverPartialPreview=roverSignal;await screenshot(cdp,'04-rover-partial-rig');

    result.consoleErrors=cdp.errors;result.runtimeExceptions=cdp.exceptions;assert(!cdp.errors.length,`console: ${cdp.errors.join(' | ')}`);assert(!cdp.exceptions.length,`exceptions: ${cdp.exceptions.join(' | ')}`);result.browser=version.Browser;result.result='PASS';writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));cdp.ws.close();
  }catch(e){result.failure=String(e.stack||e);result.browserStderr=stderr;writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');writeFileSync(path.join(OUT,'failure.txt'),`${e.stack||e}\n\n${stderr}`);throw e;}finally{browser.kill('SIGTERM');server.kill('SIGTERM');}
}
run().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
