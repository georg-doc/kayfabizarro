import fs from 'node:fs';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

const expectedRuntime='666d3e43314cb43f0286c93442c335dcb60167d8';
const expectedEvidence='e8c0ee43b22922b04761e8334194e6426e2a9c17';
const base=(process.env.TE01_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/stunt-world/te01-osm-depth-ink/').replace(/\/?$/,'/');
const isPublic=process.env.TE01_PUBLIC==='1';
const out=process.env.TE01_PROOF_DIR||'te01-proof';
fs.mkdirSync(out,{recursive:true});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const result={base,isPublic,expectedRuntime,expectedEvidence,checks:[],errors:[],httpErrors:[],status:'RUNNING',humanAcceptance:'PENDING'};
const check=(name,pass,detail)=>{result.checks.push({name,pass:Boolean(pass),detail});if(!pass)throw Error(name)};
function gitBlobSha(bytes){const header=Buffer.from('blob '+bytes.length+'\0');return crypto.createHash('sha1').update(header).update(bytes).digest('hex');}

let browser,page;
try{
  let deployment=null;
  if(isPublic){
    let ok=false;
    for(let i=0;i<42;i++){
      try{
        const r=await fetch(base+'DEPLOYMENT.json?ci='+Date.now(),{cache:'no-store'});
        if(r.ok){deployment=await r.json();if(deployment.testedRuntimeCommit===expectedRuntime&&deployment.browserEvidenceCommit===expectedEvidence){ok=true;break;}}
      }catch{}
      await pause(10000);
    }
    check('Cloudflare deployment marker',ok,deployment);
  }else{
    const r=await fetch(base+'DEPLOYMENT.json',{cache:'no-store'});deployment=await r.json();
    check('local deployment marker',r.ok&&deployment.testedRuntimeCommit===expectedRuntime&&deployment.browserEvidenceCommit===expectedEvidence,deployment);
  }

  const wrapper=await fetch(base+'?ci='+Date.now(),{cache:'no-store'});const wrapperText=await wrapper.text();
  check('TE-01 stable wrapper',wrapper.ok&&wrapperText.includes('TE-01 OSM Depth + Ink'),{status:wrapper.status,length:wrapperText.length});

  const mr=await fetch(base+'PUBLIC_MANIFEST.json?ci='+Date.now(),{cache:'no-store'});check('manifest loads',mr.ok,mr.status);
  const manifest=await mr.json();
  check('manifest owner + revision',manifest.implementationSSOT==='georg-doc/KFB-Stunt-Car-Race'&&manifest.testedRuntimeCommit===expectedRuntime&&manifest.browserEvidenceCommit===expectedEvidence,manifest);
  const runtimeFiles=Object.entries(manifest.files).filter(([name,meta])=>name.startsWith('runtime/')&&meta.sourcePath);
  check('10 exact runtime files',runtimeFiles.length===10,runtimeFiles.map(([name])=>name));
  for(const [name,meta] of runtimeFiles){
    const r=await fetch(base+name+'?ci='+Date.now(),{cache:'no-store'});const bytes=Buffer.from(await r.arrayBuffer());const blob=gitBlobSha(bytes);
    check('exact runtime blob '+name,r.ok&&blob===meta.gitBlob,{status:r.status,blob,expected:meta.gitBlob});
  }

  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const context=await browser.newContext({viewport:{width:1280,height:900}});page=await context.newPage();
  page.on('pageerror',e=>result.errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))result.errors.push(m.text())});
  page.on('response',r=>{if(r.status()>=400)result.httpErrors.push({url:r.url(),status:r.status()})});

  const runtime=base+'runtime/ChatGPT_web/osm-city-drive/?qa=1&city=huerth-v0&look=grotesque';result.runtimeUrl=runtime;
  const t0=Date.now();await page.goto(runtime,{waitUntil:'domcontentloaded',timeout:180000});
  await page.waitForFunction(()=>window.__OSM_CITY_DRIVE_READY__||window.__OSM_CITY_DRIVE_ERROR__,{},{timeout:180000});
  result.bootMs=Date.now()-t0;check('browser ready',await page.evaluate(()=>Boolean(window.__OSM_CITY_DRIVE_READY__)),await page.evaluate(()=>window.__OSM_CITY_DRIVE_ERROR__));
  const snap=()=>page.evaluate(()=>window.__OSM_CITY_DRIVE__.snapshot());result.snapshots={};result.snapshots.boot=await snap();
  const w=result.snapshots.boot.presentation.worldLook;
  check('depth contract',w.visualDepth.groundY===-0.14&&w.visualDepth.landuseY===-0.075&&w.visualDepth.landuseOffsetFactor===-1&&w.visualDepth.landuseOffsetUnits===-1&&w.visualDepth.physicalGroundTopY===-0.11,w.visualDepth);
  check('OFF default + semantic contours',w.ink.mode==='off'&&w.ink.contourCount===326&&w.ink.seedBinding==='OBJECT_ROUTE_ARCLENGTH_STABLE',w.ink);

  await page.locator('#start').click();await page.waitForFunction(()=>window.__OSM_CITY_DRIVE__.snapshot().physical.contacts.filter(Boolean).length===4,{},{timeout:30000});
  result.snapshots.settled=await snap();const runBefore=result.snapshots.settled.physical.run;
  await page.evaluate(()=>window.__OSM_CITY_DRIVE__.setLayerVisibility('ground',false));await page.screenshot({path:out+'/landuse-only.png'});await page.evaluate(()=>window.__OSM_CITY_DRIVE__.setLayerVisibility('ground',true));
  await page.evaluate(()=>window.__OSM_CITY_DRIVE__.setOutlineMode('ink'));result.snapshots.ink=await snap();
  check('INK presentation-only',result.snapshots.ink.presentation.worldLook.ink.mode==='ink'&&result.snapshots.ink.presentation.worldLook.ink.presentationOnly===true,result.snapshots.ink.presentation.worldLook.ink);
  await page.screenshot({path:out+'/ink.png'});

  await page.evaluate(()=>window.__OSM_CITY_DRIVE__.setOutlineMode('bend'));await page.locator('#view').focus();await page.keyboard.down('w');
  await page.waitForFunction(()=>window.__OSM_CITY_DRIVE__.snapshot().signedForwardSpeed>4,{},{timeout:20000});await page.keyboard.down('d');await page.waitForTimeout(900);
  await page.screenshot({path:out+'/bend-motion.png'});await page.keyboard.up('d');await page.keyboard.up('w');result.snapshots.motion=await snap();
  check('BEND moving C0 ownership',result.snapshots.motion.presentation.worldLook.ink.mode==='bend'&&result.snapshots.motion.physical.run===runBefore&&result.snapshots.motion.physical.contacts.filter(Boolean).length>=2,{ink:result.snapshots.motion.presentation.worldLook.ink,run:result.snapshots.motion.physical.run,contacts:result.snapshots.motion.physical.contacts});
  check('no console/page errors',result.errors.length===0,result.errors);check('no failed HTTP assets',result.httpErrors.length===0,result.httpErrors);result.status='PASS';
}catch(error){
  result.status='FAIL';result.failure=String(error.stack||error);process.exitCode=1;if(page)await page.screenshot({path:out+'/FAIL.png'}).catch(()=>{});
}finally{
  fs.writeFileSync(out+'/results.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({status:result.status,checks:result.checks.length,passed:result.checks.filter(x=>x.pass).length,bootMs:result.bootMs,failure:result.failure||null}));
  if(browser)await browser.close();
}
