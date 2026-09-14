import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT=process.cwd();
const STABLE='http://127.0.0.1:8768/asset-librarian/';
const OUT=path.join(ROOT,'artifacts','asset-librarian-smoke','v1.5');
const GOTH='media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb';
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
  const server=spawn('python3',['-m','http.server','8768','--bind','127.0.0.1'],{cwd:ROOT,stdio:'ignore'});
  const port=9226;
  const browser=spawn(exe,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist','--use-angle=swiftshader','--enable-unsafe-swiftshader',`--remote-debugging-port=${port}`,`--user-data-dir=/tmp/kfb-v15-${process.pid}`,'--window-size=1700,1250','about:blank'],{stdio:['ignore','ignore','pipe']});
  let stderr='';browser.stderr.on('data',c=>stderr+=c.toString());const result={schema:'kfb.asset-librarian-v1.5-animation-framing-smoke.v1',checks:{},result:'FAIL'};
  try{
    await poll(async()=>{try{return (await fetch(STABLE)).ok;}catch{return false;}},'server');
    const version=await poll(async()=>{try{const r=await fetch(`http://127.0.0.1:${port}/json/version`);return r.ok?await r.json():false;}catch{return false;}},'chrome');
    const r=await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(STABLE)}`,{method:'PUT'}),target=await r.json(),cdp=await connect(target.webSocketDebuggerUrl);await cdp.send('Page.enable');await cdp.send('Runtime.enable');
    await ev(cdp,`location.pathname==='/tools/asset_registry/librarian/'`,'permanent URL redirect');result.checks.permanentUrl=true;
    await ev(cdp,`window.KFBAssetLibrarianV15?.version==='1.5' && document.getElementById('registryStatus')?.textContent==='Registry ready'`,'v1.5 ready');
    const mode=await cdp.eval(`document.getElementById('registryModeSelect').value`);assert(mode==='live',`expected live mode, got ${mode}`);

    await cdp.eval(`(()=>{document.getElementById('searchInput').value='GothGirl';document.getElementById('kindFilter').value='model-3d';return window.KFBAssetLibrarianV15.runSearch();})()`);
    await ev(cdp,`[...document.querySelectorAll('.result-card')].some(c=>c.dataset.assetId===${JSON.stringify(GOTH)})`,'GothGirl result');
    await cdp.eval(`(()=>{const c=[...document.querySelectorAll('.result-card')].find(c=>c.dataset.assetId===${JSON.stringify(GOTH)});c.querySelector('.result-open').click();return true;})()`);
    await ev(cdp,`document.getElementById('detailPath')?.textContent===${JSON.stringify(GOTH)}`,'GothGirl detail');
    await ev(cdp,`document.getElementById('previewStatus')?.textContent.includes('no embedded clips')`,'embedded clip boundary');
    const motions=await ev(cdp,`(()=>{const e=document.getElementById('animationSources');return !e.hidden&&e.innerText.includes('Local character animation packs')&&e.innerText.includes('KayKit shared animation library')?e.innerText:false;})()`,'motion library');
    assert(String(motions).includes('Animation Lab v2'),'Animation Lab v2 boundary missing');
    const badges=await cdp.eval(`document.getElementById('detailBadges').innerText`);assert(/local motions/.test(badges),`local motion badge missing: ${badges}`);assert(/shared motions/.test(badges),`shared motion badge missing: ${badges}`);result.checks.gothGirlMotionLibrary=true;

    const framing=await cdp.eval(`(async()=>{const m=await import('/tools/asset_registry/librarian/preview3d.js');return m.framingState();})()`);
    assert(framing?.projected,'framing state missing');
    const p=framing.projected;assert(p.minX>-0.96&&p.maxX<0.96&&p.minY>-0.96&&p.maxY<0.90,`GothGirl projected bounds too close/cropped: ${JSON.stringify(p)}`);result.checks.gothGirlFraming=p;
    await screenshot(cdp,'01-gothgirl-motion-library-framing');

    const thumb=await ev(cdp,`(()=>{const c=[...document.querySelectorAll('.result-card')].find(c=>c.dataset.assetId===${JSON.stringify(GOTH)});const i=c?.querySelector('.result-thumb img');return i?.complete&&i.naturalWidth>0?{w:i.naturalWidth,h:i.naturalHeight}:false;})()`,'GothGirl gallery thumbnail',120000);result.checks.galleryThumb=thumb;

    result.consoleErrors=cdp.errors;result.runtimeExceptions=cdp.exceptions;assert(!cdp.errors.length,`console: ${cdp.errors.join(' | ')}`);assert(!cdp.exceptions.length,`exceptions: ${cdp.exceptions.join(' | ')}`);result.browser=version.Browser;result.result='PASS';writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));cdp.ws.close();
  }catch(e){result.failure=String(e.stack||e);result.browserStderr=stderr;writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');writeFileSync(path.join(OUT,'failure.txt'),`${e.stack||e}\n\n${stderr}`);throw e;}finally{browser.kill('SIGTERM');server.kill('SIGTERM');}
}
run().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
