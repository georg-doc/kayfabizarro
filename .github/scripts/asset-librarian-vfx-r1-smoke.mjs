import {spawn,execFileSync} from 'node:child_process';
import {readFileSync,mkdirSync,writeFileSync,mkdtempSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import os from 'node:os';
import {setTimeout as sleep} from 'node:timers/promises';

const ROOT=process.cwd(), BASE='http://127.0.0.1:8779/tools/asset_registry/librarian/';
const OUT=path.join(ROOT,'artifacts','asset-librarian-smoke','vfx-r1');
const CATALOG=path.join(ROOT,'tools/asset_registry/librarian/live/vfx-katalog.r1.json');
const LIVE='https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/tools/asset_registry/librarian/live/vfx-katalog.r1.json';
const catalog=JSON.parse(readFileSync(CATALOG,'utf8'));
const originalHash=createHash('sha256').update(readFileSync(CATALOG)).digest('hex');
const assert=(value,message)=>{if(!value)throw new Error(message);};
async function poll(fn,label,ms=45000){const end=Date.now()+ms;let last;while(Date.now()<end){try{last=await fn();if(last)return last;}catch(error){last=error.message;}await sleep(100);}throw new Error(`Timeout ${label}: ${JSON.stringify(last)}`);}
function executable(){if(process.env.BROWSER_EXE)return process.env.BROWSER_EXE;return execFileSync('bash',['-lc','command -v google-chrome-stable || command -v google-chrome || command -v chromium || true'],{encoding:'utf8'}).trim();}
class CDP {
  constructor(ws){
    this.ws=ws;this.index=0;this.pending=new Map();this.errors=[];this.exceptions=[];this.mode='live';this.revision=catalog.stand;this.requests=[];this.networkFailures=[];
    ws.addEventListener('message',event=>{const m=JSON.parse(String(event.data));if(m.id){const p=this.pending.get(m.id);if(p){this.pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result||{});}return;}
      if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')this.errors.push(m.params.args.map(a=>a.value||a.description).join(' '));
      if(m.method==='Runtime.exceptionThrown')this.exceptions.push(m.params.exceptionDetails.text);
      if(m.method==='Network.loadingFailed')this.networkFailures.push(m.params);
      if(m.method==='Fetch.requestPaused')this.handleFeed(m.params).catch(error=>this.exceptions.push(error.message));
    });
  }
  send(method,params={}){const id=++this.index;return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));});}
  async eval(expression){const r=await this.send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true,userGesture:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text);return r.result?.value;}
  async handleFeed({requestId,request}){
    this.requests.push({url:request.url,headers:request.headers,revision:this.revision,mode:this.mode});
    if(this.mode==='offline'){await this.send('Fetch.failRequest',{requestId,errorReason:'ConnectionFailed'});return;}
    const document=structuredClone(catalog);document.stand=this.revision;
    if(this.mode==='unsafe')document.inboxFileId='private-file-must-not-render';
    await this.send('Fetch.fulfillRequest',{requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'application/json'},{name:'Access-Control-Allow-Origin',value:'*'},{name:'Cache-Control',value:'no-store'}],body:Buffer.from(JSON.stringify(document)).toString('base64')});
  }
}
async function connect(url){const ws=new WebSocket(url);await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});return new CDP(ws);}
async function screenshot(cdp,name){const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true});writeFileSync(path.join(OUT,name+'.png'),Buffer.from(r.data,'base64'));}
async function value(cdp,id,text){await cdp.eval(`(()=>{const el=document.getElementById(${JSON.stringify(id)});el.value=${JSON.stringify(text)};el.dispatchEvent(new Event(el.tagName==='INPUT'?'input':'change',{bubbles:true}));return true;})()`);}
async function fx(cdp){await poll(()=>cdp.eval(`document.getElementById('registryStatus')?.textContent==='Registry ready'`),'Registry ready',90000);await cdp.eval(`document.querySelector('[data-library-tab="fx"]').click();true`);await poll(()=>cdp.eval(`document.querySelectorAll('#resourceList [data-vfx-id]').length===${catalog.zahlen.effekte}`),'Owner VFX effects');}
async function count(cdp,expected){await poll(()=>cdp.eval(`document.querySelectorAll('#resourceList .resource-card').length===${expected}`),`count ${expected}`);}
async function openEffect(cdp,id){await cdp.eval(`document.querySelector('[data-vfx-id="${id}"] .resource-open').click();true`);await poll(()=>cdp.eval(`document.getElementById('vfxDetailContent').hidden===false`),'VFX detail');}

async function run(){
  mkdirSync(OUT,{recursive:true});
  const exe=executable();assert(exe,'Chrome is required for browser acceptance');
  const server=spawn('python3',['-c',"import http.server; http.server.ThreadingHTTPServer.request_queue_size=128; http.server.test(HandlerClass=http.server.SimpleHTTPRequestHandler, ServerClass=http.server.ThreadingHTTPServer, port=8779, bind='127.0.0.1')"],{cwd:ROOT,stdio:'ignore'});
  const browser=spawn(exe,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader','--remote-debugging-port=9239','--user-data-dir='+mkdtempSync(path.join(os.tmpdir(),'kfb-vfx-r1-')),'--window-size=1440,1000','about:blank'],{stdio:'ignore'});
  const result={schema:'kfb.vfx-catalog-browser-acceptance/1',checks:{},result:'FAIL'};let cdp;
  try {
    await poll(async()=>{try{return(await fetch(BASE)).ok;}catch{return false;}},'preview server');
    await poll(async()=>{try{return(await fetch('http://127.0.0.1:9239/json/version')).ok;}catch{return false;}},'headless Chrome');
    const target=await(await fetch('http://127.0.0.1:9239/json/new?about:blank',{method:'PUT'})).json();
    cdp=await connect(target.webSocketDebuggerUrl);await cdp.send('Page.enable');await cdp.send('Runtime.enable');await cdp.send('Network.enable');
    await cdp.send('Fetch.enable',{patterns:[{urlPattern:LIVE+'*',requestStage:'Request'}]});
    await cdp.send('Page.navigate',{url:BASE});
    await poll(()=>cdp.eval(`Boolean(document.querySelector('[data-library-tab="fx"]'))`),'FX navigation');
    await fx(cdp);await value(cdp,'resourceFxScope','vfx');await count(cdp,catalog.zahlen.effekte);
    result.checks.catalog={effects:catalog.zahlen.effekte,donors:catalog.spender.length,status:catalog.zahlen.nach_status};
    for(const [status,n] of Object.entries(catalog.zahlen.nach_status)){await value(cdp,'resourceStatusFilter',status);await count(cdp,n);}
    await value(cdp,'resourceStatusFilter','');
    await value(cdp,'resourceSpenderFilter','patch-elements');await count(cdp,catalog.spender.find(donor=>donor.id==='patch-elements').effekte.length);await value(cdp,'resourceSpenderFilter','');
    await value(cdp,'resourceArtFilter','Portal');assert(await cdp.eval(`document.querySelectorAll('#resourceList .resource-card').length>0`),'Art filter');await value(cdp,'resourceArtFilter','');
    await value(cdp,'resourceSearch','effekseer.fireball');await count(cdp,1);await value(cdp,'resourceSearch','');
    result.checks.filters=true;
    await openEffect(cdp,'elements.thunderstrike');
    const detail=await cdp.eval(`document.getElementById('vfxDetailContent').textContent`);
    assert(['parameter','bereich','standard','wirkung','phasen_s','kosten','use_cases','unbekannt','globale_parameter','api'].every(key=>detail.includes(key)),'Complete typed details');
    await cdp.send('Browser.grantPermissions',{origin:'http://127.0.0.1:8779',permissions:['clipboardReadWrite','clipboardSanitizedWrite']});
    await cdp.eval(`document.getElementById('copyVfxReference').click();true`);
    const reference=await poll(()=>cdp.eval(`navigator.clipboard.readText().then(text=>{try{return JSON.parse(text);}catch{return null;}})`),'Clipboard reference');
    assert(reference.katalog===catalog.schema&&reference.id==='elements.thunderstrike'&&reference.parameter.intensity===1,'Source reference and standard values');
    result.checks.clipboard=reference;
    await poll(()=>cdp.eval(`Boolean(document.querySelector('#vfxDetailContent img')?.naturalWidth)`),'Detail preview');
    await screenshot(cdp,'01-fx-detail');
    await cdp.eval(`document.getElementById('resourceDetailClose').click();true`);
    await value(cdp,'resourceFxScope','registry');await count(cdp,10);result.checks.legacyFx=10;
    await value(cdp,'resourceFxScope','donors');await count(cdp,catalog.spender.length);await openEffect(cdp,'patch-elements');
    assert(await cdp.eval(`document.getElementById('vfxDetailContent').textContent.includes('globale_parameter')&&document.getElementById('vfxDetailContent').textContent.includes('api')`),'Donor parameters and API');
    await cdp.eval(`document.getElementById('resourceDetailClose').click();true`);
    await value(cdp,'resourceFxScope','vfx');await openEffect(cdp,'quarks.muendung');
    assert(await cdp.eval(`document.querySelector('#vfxDetailContent .vfx-placeholder').innerText.includes('tools/vfx-buehne')&&!document.querySelector('#vfxDetailContent .vfx-preview img')`),'Missing preview uses source text without image request');
    await cdp.eval(`document.getElementById('resourceDetailClose').click();true`);
    await poll(()=>cdp.eval(`Boolean([...document.querySelectorAll('#resourceList img')].find(image=>image.src.startsWith('https://git.patch.gg/')&&image.complete&&image.naturalWidth>0))`),'Immutable git.patch.gg preview',60000);
    await value(cdp,'resourceFxScope','donors');
    await poll(()=>cdp.eval(`Boolean([...document.querySelectorAll('#resourceList img')].find(image=>image.src.startsWith('https://cdn.patch.gg/')&&image.complete&&image.naturalWidth>0))`),'cdn.patch.gg donor cover',60000);
    result.checks.publicImages=true;
    await value(cdp,'resourceFxScope','vfx');
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    assert(await cdp.eval(`document.documentElement.scrollWidth<=window.innerWidth+1`),'Mobile layout overflows');
    await openEffect(cdp,'elements.thunderstrike');
    assert(await cdp.eval(`document.getElementById('resourceDetailPanel').getBoundingClientRect().width<=window.innerWidth`),'Mobile drawer overflows');
    await screenshot(cdp,'02-fx-mobile');
    await cdp.send('Emulation.clearDeviceMetricsOverride');result.checks.mobile=true;
    cdp.revision='2026-11-24.refresh-proof';await cdp.send('Page.reload');await fx(cdp);
    await poll(()=>cdp.eval(`document.getElementById('vfxCatalogStand').textContent.includes('2026-11-24.refresh-proof')`),'Owner data refresh without rebuild');
    result.checks.refresh={before:catalog.stand,after:cdp.revision,source:LIVE,method:'Intercepted main response, same candidate build; owner JSON is never written'};
    await screenshot(cdp,'03-refresh-after');
    cdp.mode='unsafe';await cdp.send('Page.reload');await fx(cdp);
    assert(await cdp.eval(`document.getElementById('vfxCatalogStand').textContent.includes('Schnappschuss')&&!document.body.innerText.includes('private-file-must-not-render')`),'Unsafe live data must preserve safe snapshot');
    result.checks.privateDataRejected=true;
    cdp.mode='offline';await cdp.send('Page.reload');await fx(cdp);
    assert(await cdp.eval(`document.getElementById('vfxCatalogStand').textContent.includes('Schnappschuss')`),'Offline snapshot');result.checks.failSoft=true;
    assert(createHash('sha256').update(readFileSync(CATALOG)).digest('hex')===originalHash,'Owner catalogue was modified');
    result.checks.ownerDataUnchanged=originalHash;
    result.consoleErrors=cdp.errors;result.runtimeExceptions=cdp.exceptions;result.feedRequests=cdp.requests;
    assert(!cdp.errors.length,'Console errors: '+cdp.errors.join(' | '));assert(!cdp.exceptions.length,'Runtime errors: '+cdp.exceptions.join(' | '));
    result.result='PASS';
  } catch(error) {result.failure=String(error.stack||error);if(cdp){result.diagnostic=await cdp.eval(`({text:document.body.innerText.slice(-8000),cards:document.querySelectorAll('#resourceList .resource-card').length})`).catch(()=>null);result.consoleErrors=cdp.errors;result.runtimeExceptions=cdp.exceptions;result.networkFailures=cdp.networkFailures;result.feedRequests=cdp.requests;await screenshot(cdp,'failure').catch(()=>{});}throw error;}
  finally {writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');cdp?.ws.close();browser.kill('SIGTERM');server.kill('SIGTERM');console.log(JSON.stringify(result,null,2));}
}
run().catch(error=>{console.error(error.stack||error);process.exitCode=1;});
