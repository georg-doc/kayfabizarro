import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=(process.env.KLR_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/toolbox/legacy-rpg-rigging/').replace(/\/?$/,'/');
const OUT=process.env.KLR_SYNC_PROOF_DIR||'legacy-rpg-sync-evidence';
const checks=[];
const check=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)};

await fs.mkdir(OUT,{recursive:true});
let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push('pageerror '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  check('HTTP',response?.ok()===true,'status='+response?.status());
  await page.waitForFunction(()=>document.querySelector('#bootBadge')?.textContent==='READY',null,{timeout:120000});
  check('boot READY',await page.locator('#bootBadge').textContent()==='READY');
  check('WebGL canvas',await page.locator('#stage canvas').count()===1);

  const sequence=['barbarian','knight','mage','rogue'];
  const snapshots={};

  for(const id of sequence){
    await page.selectOption('#bodySelect',id);
    await page.locator('#bodySelect').dispatchEvent('change');
    const before=await page.evaluate(()=>document.documentElement.dataset.assemblyReady||'');
    await page.click('#assembleBtn');

    await page.waitForFunction(
      ({id,before})=>{
        const d=document.documentElement.dataset;
        return d.assemblyBody===id && d.assemblyRequest && d.assemblyRequest!==before;
      },
      {id,before},
      {timeout:30000}
    );

    const request=await page.evaluate(()=>document.documentElement.dataset.assemblyRequest||'');
    check(id+' request token',request.includes(':'+id+':'),request);

    await page.waitForFunction(
      ({id,request})=>{
        const d=document.documentElement.dataset;
        return d.assemblyState==='ready' && d.assemblyBody===id && d.assemblyReady===request;
      },
      {id,request},
      {timeout:120000}
    );

    const snap=await page.evaluate(()=>({
      state:document.documentElement.dataset.assemblyState,
      request:document.documentElement.dataset.assemblyRequest,
      ready:document.documentElement.dataset.assemblyReady,
      body:document.documentElement.dataset.assemblyBody,
      head:document.documentElement.dataset.assemblyHead,
      rig:document.querySelector('#rigStatus')?.textContent,
      mode:document.querySelector('#stageMode')?.textContent,
      object:document.querySelector('#stageObject')?.textContent,
      motion:document.querySelector('#motionStatus')?.textContent,
      report:document.querySelector('#assemblyReport')?.textContent
    }));

    check(id+' ready token',snap.state==='ready'&&snap.ready===request&&snap.request===request,JSON.stringify({state:snap.state,request:snap.request,ready:snap.ready}));
    check(id+' body identity',snap.body===id&&new RegExp(id,'i').test(snap.object||''),JSON.stringify({body:snap.body,object:snap.object}));
    check(id+' Rig_Legacy',snap.rig==='RIG_LEGACY',String(snap.rig));
    check(id+' assembled',snap.mode==='ASSEMBLED',String(snap.mode));
    check(id+' native motion',/native Rig_Legacy/.test(snap.motion||''),String(snap.motion));
    check(id+' report identity',new RegExp('"bodyId": "'+id+'"').test(snap.report||''),String(snap.report).slice(0,260));
    check(id+' 30 clips',/"clips": 30/.test(snap.report||''),String(snap.report).slice(0,260));
    check(id+' core parts',/"placed"/.test(snap.report||'')&&!/"missing": \[\s*"/.test(snap.report||''),String(snap.report).slice(0,260));
    snapshots[id]=snap;
  }

  await page.screenshot({path:OUT+'/desktop.png',fullPage:true});
  check('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));

  const evidence={base:BASE,sequence,checks,snapshots,failed,errors};
  await fs.writeFile(OUT+'/browser.json',JSON.stringify(evidence,null,2));
  console.log('KLR_SYNC_01_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
} finally {
  if(browser)await browser.close();
}
