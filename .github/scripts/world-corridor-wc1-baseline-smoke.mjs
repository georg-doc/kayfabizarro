import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT=process.cwd();
const BASE='http://127.0.0.1:8772/';
const REL='tools/KFB-ToolBox/worldbuilder/world-corridor-01/baseline-source/KFB World Core R2C · WC1 Baseline.dc.html';
const TEST_URL=new globalThis.URL(REL,BASE).href;
const OUT=path.join(ROOT,'artifacts','world-corridor','wc1-baseline');
const SRC='tools/KFB-ToolBox/_inbox/KFB World Core R2C · Hex-Archipel Katalog/WORLD_CORE_R2C_2026-10-01';
const DST='tools/KFB-ToolBox/worldbuilder/world-corridor-01/baseline-source';
const PARITY=[
  'KFB World Core R2C · Hex-Archipel Katalog.dc.html',
  'support.js',
  'lab-world/hex-archipel.r2c.js',
  'lab-world/shadow-fit.v1.js',
  'lab-world/sky-core.r0a.js',
  'lab-clay/clay-relief.v2.js',
  'lab-clay/clay-material.v10.js',
  'lab-clay/clay-profiles.v2.js',
  'lab-clay/clay-relief.v4.js',
  'lab-clay/clay-toolmix.v1.js',
];

const assert=(v,m)=>{if(!v)throw new Error(m);};
const browserExe=()=>execFileSync('bash',['-lc','command -v google-chrome-stable || command -v google-chrome || command -v chromium || true'],{encoding:'utf8'}).trim();
async function poll(fn,label,ms=120000){const end=Date.now()+ms;let last;while(Date.now()<end){try{last=await fn();if(last)return last;}catch(e){last=e.message;}await sleep(300);}throw new Error(`Timeout ${label}: ${JSON.stringify(last)}`);}
class CDP{
  constructor(ws){this.ws=ws;this.n=1;this.p=new Map();this.errors=[];this.exceptions=[];ws.addEventListener('message',e=>{const m=JSON.parse(String(e.data));if(m.id){const q=this.p.get(m.id);if(!q)return;this.p.delete(m.id);m.error?q.reject(new Error(m.error.message)):q.resolve(m.result||{});return;}if(m.method==='Runtime.consoleAPICalled'&&m.params?.type==='error')this.errors.push(m.params.args?.map(a=>a.value??a.description??'').join(' ')||'console.error');if(m.method==='Runtime.exceptionThrown')this.exceptions.push(m.params?.exceptionDetails?.text||'Runtime exception');});}
  send(method,params={}){const id=this.n++;return new Promise((resolve,reject)=>{this.p.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));});}
  async eval(x){const r=await this.send('Runtime.evaluate',{expression:x,awaitPromise:true,returnByValue:true,userGesture:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||'eval failed');return r.result?.value;}
}
async function connect(url){const ws=new WebSocket(url);await new Promise((ok,bad)=>{ws.addEventListener('open',ok,{once:true});ws.addEventListener('error',()=>bad(new Error('CDP error')),{once:true});});return new CDP(ws);}
async function screenshot(cdp,name){const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true});writeFileSync(path.join(OUT,name),Buffer.from(r.data,'base64'));}

async function run(){
  mkdirSync(OUT,{recursive:true});
  const parity=PARITY.map(rel=>{
    const a=readFileSync(path.join(ROOT,SRC,rel));
    const b=readFileSync(path.join(ROOT,DST,rel));
    return {rel,bytes:a.length,exact:a.equals(b)};
  });
  assert(parity.every(x=>x.exact),`Rehome parity failed: ${parity.filter(x=>!x.exact).map(x=>x.rel).join(', ')}`);

  const original=readFileSync(path.join(ROOT,DST,'KFB World Core R2C · Hex-Archipel Katalog.dc.html'),'utf8');
  const instrumented=readFileSync(path.join(ROOT,DST,'KFB World Core R2C · WC1 Baseline.dc.html'),'utf8');
  const stripped=instrumented.replace('<script type="module" src="../performance-probe.js"></script>\n','');
  assert(stripped===original,'Instrumented entry differs from exact source by more than the probe script tag.');

  const exe=browserExe();assert(exe,'No Chrome/Chromium available');
  const server=spawn('python3',['-m','http.server','8772','--bind','127.0.0.1'],{cwd:ROOT,stdio:'ignore'});
  const port=9230;
  const browser=spawn(exe,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist','--use-angle=swiftshader','--enable-unsafe-swiftshader',`--remote-debugging-port=${port}`,`--user-data-dir=/tmp/kfb-wc1-${process.pid}`,'--window-size=1600,900','about:blank'],{stdio:['ignore','ignore','pipe']});
  let stderr='';browser.stderr.on('data',c=>stderr+=c.toString());
  const result={schema:'kfb.world-corridor.wc1-baseline-smoke/0.1',url:TEST_URL,parity,result:'FAIL'};
  try{
    await poll(async()=>{try{return (await fetch(TEST_URL)).ok;}catch{return false;}},'server');
    const version=await poll(async()=>{try{const r=await fetch(`http://127.0.0.1:${port}/json/version`);return r.ok?await r.json():false;}catch{return false;}},'chrome');
    const r=await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(TEST_URL)}`,{method:'PUT'});
    const target=await r.json(),cdp=await connect(target.webSocketDebuggerUrl);
    await cdp.send('Page.enable');await cdp.send('Runtime.enable');

    await poll(()=>cdp.eval(`window.__r2c?.info?.fps>0 && window.__KFB_WC1_BASELINE__?.measure ? true : false`),'R2C + probe ready',180000);
    const metrics=await cdp.eval(`window.__KFB_WC1_BASELINE__.measure({warmupMs:1200,sampleMs:3500,label:'CI_REFERENCE'})`);
    assert(metrics && metrics.frames>30,'too few measured frames');
    assert(metrics.drawCalls>0,'drawCalls missing');
    assert(metrics.triangles>0,'triangles missing');
    assert(metrics.trackLengthM>0,'track baseline missing');
    assert(metrics.trackCrossings===0,`track crossings changed: ${metrics.trackCrossings}`);
    assert(metrics.worldItems>0 && metrics.worldCells>0,'world baseline counts missing');

    result.browser=version.Browser;
    result.metrics=metrics;
    result.consoleErrors=cdp.errors;
    result.runtimeExceptions=cdp.exceptions;
    assert(!cdp.errors.length,`console errors: ${cdp.errors.join(' | ')}`);
    assert(!cdp.exceptions.length,`runtime exceptions: ${cdp.exceptions.join(' | ')}`);
    result.result='PASS';
    await screenshot(cdp,'baseline.png');
    writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');
    console.log(JSON.stringify(result,null,2));
    cdp.ws.close();
  }catch(e){
    result.failure=String(e.stack||e);result.browserStderr=stderr;
    writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');
    throw e;
  }finally{
    browser.kill('SIGTERM');server.kill('SIGTERM');
  }
}
run().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
