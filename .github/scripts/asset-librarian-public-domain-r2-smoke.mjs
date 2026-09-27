import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT=process.cwd();
const URL='http://127.0.0.1:8772/tools/asset_registry/librarian/';
const OUT=path.join(ROOT,'artifacts','asset-librarian-smoke','public-domain-r2');
const CASES=[
  {
    query:'Bathing suit',
    path:'media/public_domain/met/bathing-suit-1890-95.jpg',
    provider:'met',
    sourceId:'86434',
    rights:'Public Domain',
    sha:'8d4696259a2fa664da351e6f619a8808ca129c1bd45e4d0f80e87381c151917c',
  },
  {
    query:'Great Wave',
    path:'media/public_domain/aic/great-wave-hokusai-1830-33.jpg',
    provider:'aic',
    sourceId:'24645',
    rights:'Public Domain',
    sha:'e0aa55ad5865f5ffa3e0fb7087e91a1e11ce5d7f13f392ba0f493c513b7f0f56',
  },
  {
    query:'Silent film',
    path:'media/public_domain/commons/silent-film.svg',
    provider:'commons',
    sourceId:'File:Silent film.svg',
    rights:'Public domain',
    sha:'e55e5d25eb1c834816a10d4d15d9ef30fa8a467c92d853f7439556b5774aadc7',
  },
  {
    query:'The General',
    path:'media/public_domain/ia/the-general-1926-item-tile.jpg',
    provider:'ia',
    sourceId:'TheGeneral1926',
    rights:'publicdomain/mark/1.0',
    sha:'bbc1321e8ca53998e8bb2761a199d0130dc6230de589087ea62eddaf7888ee19',
  },
];

const assert=(value,message)=>{if(!value)throw new Error(message);};
const browserExe=()=>execFileSync(
  'bash',
  ['-lc','command -v google-chrome-stable || command -v google-chrome || command -v chromium || true'],
  {encoding:'utf8'},
).trim();

async function poll(fn,label,timeout=90000){
  const end=Date.now()+timeout;let last;
  while(Date.now()<end){
    try{last=await fn();if(last)return last;}catch(error){last=error.message;}
    await sleep(250);
  }
  throw new Error(`Timeout waiting for ${label}: ${JSON.stringify(last)}`);
}

class CDP{
  constructor(ws){
    this.ws=ws;this.next=1;this.pending=new Map();this.consoleErrors=[];this.exceptions=[];
    ws.addEventListener('message',(event)=>{
      const msg=JSON.parse(String(event.data));
      if(msg.id){
        const pending=this.pending.get(msg.id);if(!pending)return;
        this.pending.delete(msg.id);
        msg.error?pending.reject(new Error(msg.error.message)):pending.resolve(msg.result||{});
        return;
      }
      if(msg.method==='Runtime.consoleAPICalled'&&msg.params?.type==='error'){
        this.consoleErrors.push(msg.params.args?.map(a=>a.value??a.description??'').join(' ')||'console.error');
      }
      if(msg.method==='Runtime.exceptionThrown'){
        this.exceptions.push(msg.params?.exceptionDetails?.text||'Runtime exception');
      }
    });
  }
  send(method,params={}){
    const id=this.next++;
    return new Promise((resolve,reject)=>{
      this.pending.set(id,{resolve,reject});
      this.ws.send(JSON.stringify({id,method,params}));
    });
  }
  async eval(expression){
    const result=await this.send('Runtime.evaluate',{
      expression,awaitPromise:true,returnByValue:true,userGesture:true,
    });
    if(result.exceptionDetails)throw new Error(result.exceptionDetails.text||'evaluation failed');
    return result.result?.value;
  }
}

async function connect(wsUrl){
  const ws=new WebSocket(wsUrl);
  await new Promise((resolve,reject)=>{
    ws.addEventListener('open',resolve,{once:true});
    ws.addEventListener('error',()=>reject(new Error('CDP websocket error')),{once:true});
  });
  return new CDP(ws);
}

async function screenshot(cdp,name){
  const result=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true});
  const file=path.join(OUT,`${name}.png`);
  writeFileSync(file,Buffer.from(result.data,'base64'));
  return file;
}

async function searchAndOpen(cdp,test,index){
  const literal=JSON.stringify(test);
  await cdp.eval(`(()=>{
    const t=${literal};
    const search=document.getElementById('searchInput');
    const kind=document.getElementById('kindFilter');
    const pack=document.getElementById('packFilter');
    const collection=document.getElementById('collectionFilter');
    if(!search||!kind||!pack||!collection)throw new Error('required filters missing');
    search.value=t.query;
    kind.value='image-2d';
    pack.value='';
    collection.value='';
    for(const input of document.querySelectorAll('#typeFilterOptions input,#formatFilterOptions input'))input.checked=false;
    return window.KFBAssetLibrarianV17.runSearch();
  })()`);
  await poll(
    ()=>cdp.eval(`[...document.querySelectorAll('#resultList .result-card')].some(c=>c.dataset.assetId===${JSON.stringify(test.path)})`),
    `search result ${test.query}`,
  );
  const cardCount=await cdp.eval(`[...document.querySelectorAll('#resultList .result-card')].filter(c=>c.dataset.assetId===${JSON.stringify(test.path)}).length`);
  assert(cardCount===1,`${test.path}: expected one exact result, got ${cardCount}`);

  await cdp.eval(`(()=>{
    const card=[...document.querySelectorAll('#resultList .result-card')].find(c=>c.dataset.assetId===${JSON.stringify(test.path)});
    card.querySelector('.result-open').click();
    return true;
  })()`);
  await poll(
    ()=>cdp.eval(`document.getElementById('detailPath')?.textContent===${JSON.stringify(test.path)}`),
    `detail ${test.path}`,
  );
  await poll(
    ()=>cdp.eval(`document.getElementById('previewStatus')?.textContent==='Loaded' && document.getElementById('imagePreviewImg')?.naturalWidth>0`),
    `image preview ${test.path}`,
  );

  const record=await cdp.eval(`fetch('../../../registry/assets/v1/catalog.jsonl',{cache:'no-store'})
    .then(r=>{if(!r.ok)throw new Error('catalog '+r.status);return r.text();})
    .then(text=>{
      const rec=text.split('\\n').filter(Boolean).map(line=>JSON.parse(line)).find(row=>row.assetId===${JSON.stringify(test.path)});
      return {
        assetId:rec?.assetId,
        name:rec?.name,
        license:rec?.license,
        rightsEvidence:rec?.rightsEvidence,
        source:rec?.source,
      };
    })`);
  assert(record?.assetId===test.path,`${test.path}: catalog record missing`);
  assert(String(record.license||'').toLowerCase().includes(test.rights.toLowerCase()),`${test.path}: rights text mismatch ${record.license}`);
  assert(record.rightsEvidence?.mode==='explicit-sidecar',`${test.path}: explicit-sidecar provenance missing`);
  assert(record.rightsEvidence?.provider===test.provider,`${test.path}: provider mismatch`);
  assert(String(record.rightsEvidence?.sourceId)===test.sourceId,`${test.path}: sourceId mismatch`);
  assert(record.rightsEvidence?.sha256===test.sha,`${test.path}: SHA mismatch`);
  assert(String(record.rightsEvidence?.sidecarPath||'').endsWith('.license.json'),`${test.path}: sidecar path missing`);

  const provenance=await cdp.eval(`document.getElementById('provenanceFacts').innerText`);
  for(const expected of [
    'explicit-sidecar',
    test.provider,
    test.sourceId,
    test.sha,
    '.license.json',
  ]) assert(String(provenance).includes(expected),`${test.path}: provenance UI missing ${expected}: ${provenance}`);

  const imageMeta=await cdp.eval(`document.getElementById('imageMeta').textContent`);
  const shot=await screenshot(cdp,`${String(index+1).padStart(2,'0')}-${test.provider}`);
  return {query:test.query,path:test.path,name:record.name,imageMeta,provenance,screenshot:shot};
}

async function run(){
  mkdirSync(OUT,{recursive:true});
  const exe=browserExe();assert(exe,'No Chrome/Chromium found');
  const server=spawn('python3',['-m','http.server','8772','--bind','127.0.0.1'],{cwd:ROOT,stdio:'ignore'});
  const port=9232;
  const browser=spawn(exe,[
    '--headless=new','--no-sandbox','--disable-dev-shm-usage','--no-first-run','--no-default-browser-check',
    `--remote-debugging-port=${port}`,`--user-data-dir=/tmp/kfb-pd-r2-${process.pid}`,
    '--window-size=1500,1100','about:blank',
  ],{stdio:['ignore','ignore','pipe']});
  let stderr='';browser.stderr.on('data',chunk=>stderr+=chunk.toString());
  const result={schema:'kfb.asset-librarian-public-domain-r2-smoke.v1',checks:[],result:'FAIL'};
  try{
    await poll(async()=>{try{return (await fetch(URL)).ok;}catch{return false;}},'HTTP server');
    const version=await poll(async()=>{try{const r=await fetch(`http://127.0.0.1:${port}/json/version`);return r.ok?await r.json():false;}catch{return false;}},'Chrome');
    const targetResponse=await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(URL)}`,{method:'PUT'});
    assert(targetResponse.ok,`Could not open CDP target: ${targetResponse.status}`);
    const target=await targetResponse.json();
    const cdp=await connect(target.webSocketDebuggerUrl);
    await cdp.send('Page.enable');await cdp.send('Runtime.enable');

    await poll(()=>cdp.eval(`document.getElementById('registryStatus')?.textContent==='Registry ready'`),'Registry ready');
    await cdp.eval(`window.KFBAssetLibrarianV17.setRegistryMode('canonical')`);
    await poll(
      ()=>cdp.eval(`document.getElementById('registryStatus')?.textContent==='Registry ready' && document.getElementById('sourceCommit')?.textContent.startsWith('CANONICAL · ')`),
      'canonical registry',
    );

    const registry=await cdp.eval(`(()=>{
      const s=window.KFBAssetLibrarianV17.getState();
      return {sourceCommit:s.sourceCommit,total:s.catalog?.length||0};
    })()`);
    assert(/^[0-9a-f]{40}$/.test(registry.sourceCommit),`invalid registry source commit: ${registry.sourceCommit}`);

    for(let i=0;i<CASES.length;i++) result.checks.push(await searchAndOpen(cdp,CASES[i],i));

    assert(cdp.consoleErrors.length===0,`console errors: ${cdp.consoleErrors.join(' | ')}`);
    assert(cdp.exceptions.length===0,`runtime exceptions: ${cdp.exceptions.join(' | ')}`);
    result.browser=version.Browser;
    result.registry=registry;
    result.consoleErrors=cdp.consoleErrors;
    result.runtimeExceptions=cdp.exceptions;
    result.result='PASS';
    writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');
    console.log(JSON.stringify(result,null,2));
    cdp.ws.close();
  }catch(error){
    result.failure=String(error.stack||error);
    result.browserStderr=stderr.slice(-8000);
    writeFileSync(path.join(OUT,'result.json'),JSON.stringify(result,null,2)+'\n');
    writeFileSync(path.join(OUT,'failure.txt'),`${error.stack||error}\n\n${stderr}`);
    throw error;
  }finally{
    browser.kill('SIGTERM');server.kill('SIGTERM');
  }
}

run().catch(error=>{console.error(error.stack||error);process.exitCode=1;});
