import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT=process.cwd();
const STABLE='http://127.0.0.1:8769/asset-librarian/';
const OUT=path.join(ROOT,'artifacts','asset-librarian-smoke','v1.6');
const GOTH='media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb';
const MIC='media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Microphone.gltf';
const assert=(v,m)=>{if(!v)throw new Error(m);};
const browserExe=()=>execFileSync('bash',['-lc','command -v google-chrome-stable || command -v google-chrome || command -v chromium || true'],{encoding:'utf8'}).trim();
async function poll(fn,label,ms=120000){const end=Date.now()+ms;let last;while(Date.now()<end){try{last=await fn();if(last)return last;}catch(e){last=e.message;}await sleep(300);}throw new Error(`Timeout ${label}: ${JSON.stringify(last)}`);}
class CDP{constructor(ws){this.ws=ws;this.n=1;this.p=new Map();this.errors=[];this.exceptions=[];ws.addEventListener('message',e=>{const m=JSON.parse(String(e.data));if(m.id){const q=this.p.get(m.id);if(!q)return;this.p.delete(m.id);m.error?q.reject(new Error(m.error.message)):q.resolve(m.result||{});return;}if(m.method==='Runtime.consoleAPICalled'&&m.params?.type==='error')this.errors.push(m.params.args?.map(a=>a.value??a.description??'').join(' ')||'console.error');if(m.method==='Runtime.exceptionThrown')this.exceptions.push(m.params?.exceptionDetails?.text||'Runtime exception');});}send(method,params={}){const id=this.n++;return new Promise((resolve,reject)=>{this.p.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));});}async eval(x){const r=await this.send('Runtime.evaluate',{expression:x,awaitPromise:true,returnByValue:true,userGesture:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||'eval failed');return r.result?.value;}}
async function connect(url){const ws=new WebSocket(url);await new Promise((ok,bad)=>{ws.addEventListener('open',ok,{once:true});ws.addEventListener('error',()=>bad(new Error('CDP error')),{once:true});});return new CDP(ws);}
async function ev(cdp,x,label,ms){return poll(()=>cdp.eval(x),label,ms);}
async function screenshot(cdp,name){const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true});writeFileSync(path.join(OUT,`${name}.png`),Buffer.from(r.data,'base64'));}

async function run(){
  mkdirSync(OUT,{recursive:true});const exe=browserExe();assert(exe,'No Chrome');
  const server=spawn('python3',['-m','http.server','8769','--bind','127.0.0.1'],{cwd:ROOT,stdio:'ignore'});const port=9227;
  const browser=spawn(exe,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist','--use-angle=swiftshader','--enable-unsafe-swiftshader',`--remote-debugging-port=${port}`,`--user-data-dir=/tmp/kfb-v16-${process.pid}`,'--window-size=1740,1250','about:blank'],{stdio:['ignore','ignore','pipe']});
  let stderr='';browser.stderr.on('data',c=>stderr+=c.toString());const result={schema:'kfb.asset-librarian-v1.6-town-workbench-smoke.v1',checks:{},result:'FAIL'};
  try{
    await poll(async()=>{try{return (await fetch(STABLE)).ok;}catch{return false;}},'server');
    const version=await poll(async()=>{try{const r=await fetch(`http://127.0.0.1:${port}/json/version`);return r.ok?await r.json():false;}catch{return false;}},'chrome');
    const r=await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(STABLE)}`,{method:'PUT'}),target=await r.json(),cdp=await connect(target.webSocketDebuggerUrl);await cdp.send('Page.enable');await cdp.send('Runtime.enable');
    await ev(cdp,`window.KFBAssetLibrarianV16?.version==='1.6' && document.getElementById('registryStatus')?.textContent==='Registry ready'`,'v1.6 ready');
    assert(await cdp.eval(`document.title.includes('v1.6')`),'visible v1.6 title missing');

    await cdp.eval(`document.getElementById('townTab').click()`);
    await ev(cdp,`!document.getElementById('townWorkspace').hidden && document.getElementById('townStatus').textContent==='Workbench ready'`,'Town workbench ready',120000);
    const townCounts=await cdp.eval(`({world:document.querySelectorAll('#townEnvironmentList .town-card').length,characters:document.querySelectorAll('#townCharacterList .town-card').length,worldMeta:document.getElementById('townEnvironmentMeta').textContent,characterMeta:document.getElementById('townCharacterMeta').textContent})`);
    assert(townCounts.world>0,`no Town world candidates: ${JSON.stringify(townCounts)}`);assert(townCounts.characters>0,`no Town characters: ${JSON.stringify(townCounts)}`);
    assert(await cdp.eval(`[...document.querySelectorAll('#townEnvironmentList .town-card')].some(c=>c.querySelector('.town-meta')?.textContent.includes('kaykit-forest-nature-pack-1-0-free')||c.querySelector('.town-meta')?.textContent.includes('kenney-nature-kit'))`),'Forest/Nature first-choice assets missing');
    await ev(cdp,`[...document.querySelectorAll('#townCharacterList .town-card')].some(c=>c.dataset.assetId===${JSON.stringify(GOTH)})`,'GothGirl in Town characters');
    await cdp.eval(`(()=>{const c=[...document.querySelectorAll('#townCharacterList .town-card')].find(c=>c.dataset.assetId===${JSON.stringify(GOTH)});c.querySelector('.town-card-actions button').click();return true;})()`);
    await ev(cdp,`[...document.querySelectorAll('#townPropList .town-card')].some(c=>c.dataset.assetId===${JSON.stringify(MIC)})`,'GothGirl collection props');
    result.checks.townWorkbench={...townCounts,gothGirl:true,gothGirlMicrophone:true};
    await screenshot(cdp,'01-town-workbench-forest-gothgirl-props');

    await cdp.eval(`(()=>{const s=document.getElementById('townWorldFilter');s.value='buildings';s.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`);
    const buildings=await ev(cdp,`(()=>{const t=document.getElementById('townEnvironmentMeta')?.textContent||'';const n=Number(t.match(/([\\d,]+) candidates/)?.[1]?.replaceAll(',','')||0);return n>0?n:false;})()`,'building candidates');
    await cdp.eval(`(()=>{const s=document.getElementById('townWorldFilter');s.value='space';s.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`);
    const space=await ev(cdp,`(()=>{const cards=[...document.querySelectorAll('#townEnvironmentList .town-card')];return cards.length&&cards.some(c=>c.querySelector('.town-meta')?.textContent.includes('scifi-ultimate-space-kit-quaternius'))?cards.length:false;})()`,'Space Kit candidates');
    result.checks.worldFilters={buildings,space};

    await cdp.eval(`window.KFBAssetLibrarianV16.showDetail(${JSON.stringify(GOTH)})`);
    await ev(cdp,`document.getElementById('detailPath')?.textContent===${JSON.stringify(GOTH)}`,'GothGirl detail');
    const related=await ev(cdp,`(()=>{const box=document.getElementById('relatedAssets');return !box?.hidden&&box.innerText.includes('GothGirl_Microphone')?box.innerText:false;})()`,'related collection props');
    assert(String(related).includes('candidate-only'),'related prop boundary missing');
    const motionOptions=await ev(cdp,`(()=>{const s=document.getElementById('externalMotionSelect');return s&&!document.getElementById('externalMotionControl').hidden&&s.options.length>1?s.options.length-1:false;})()`,'on-character motion choices');
    await cdp.eval(`(()=>{const s=document.getElementById('externalMotionSelect');s.value=s.options[1].value;s.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`);
    const motionState=await ev(cdp,`(async()=>{const m=await import('/tools/asset_registry/librarian/preview3d.js');const s=m.externalMotionState();return s?.playing&&s.matchedTracks>0?s:false;})()`,'external motion playback',120000);
    assert(motionState.totalTracks>=motionState.matchedTracks,'invalid track coverage');
    assert((await cdp.eval(`document.getElementById('externalMotionBoundary').innerText`)).includes('Animation Lab v2'),'Animation Lab v2 ownership boundary missing');
    result.checks.onCharacterMotion={choices:motionOptions,...motionState};
    await screenshot(cdp,'02-gothgirl-external-motion-related-props');

    const scene=await cdp.eval(`window.KFBAssetLibrarianV16.getTownScene()`);assert(scene.schema==='kfb.town-scene-candidate.v1','Town scene schema missing');assert(scene.status==='candidate-only','Town scene must remain candidate-only');result.checks.scenePlan=scene;
    result.consoleErrors=cdp.errors;result.runtimeExceptions=cdp.exceptions;assert(!cdp.errors.length,`console: ${cdp.errors.join(' | ')}`);assert(!cdp.exceptions.length,`exceptions: ${cdp.exceptions.join(' | ')}`);result.browser=version.Browser;result.result='PASS';writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));cdp.ws.close();
  }catch(e){result.failure=String(e.stack||e);result.browserStderr=stderr;writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');writeFileSync(path.join(OUT,'failure.txt'),`${e.stack||e}\n\n${stderr}`);throw e;}finally{browser.kill('SIGTERM');server.kill('SIGTERM');}
}
run().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
