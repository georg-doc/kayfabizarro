import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.CA2_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/combat/ca2-actor-selector/';
const EXPECTED=process.env.CA2_SOURCE_HEAD||'';
const OUT=process.env.CA2_PROOF_DIR||'combat-ca2-selector-evidence';
const checks=[];
const check=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)};

await fs.mkdir(OUT,{recursive:true});
const marker=await fetch(BASE+'SOURCE.json',{cache:'no-store'}).then(async r=>({ok:r.ok,status:r.status,json:await r.json()}));
check('source marker HTTP',marker.ok,'status='+marker.status);
check('source marker head',marker.json.implementationHead===EXPECTED,marker.json.implementationHead);

let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:920},deviceScaleFactor:1});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push('pageerror '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));
  const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  check('selector HTTP',response?.ok()===true,'status='+response?.status());

  async function waitActor(id){
    await page.waitForFunction(actor=>window.__KFB_CA2_SELECTOR__?.ready===true&&window.__KFB_CA2_SELECTOR__.snapshot().selected===actor,id,{timeout:120000});
    return page.evaluate(()=>window.__KFB_CA2_SELECTOR__.snapshot());
  }

  const fb=await waitActor('frizzlebob-driver');
  check('default actor',fb.selected==='frizzlebob-driver',fb.selected);
  check('FB exact pin',await page.evaluate(()=>window.__KFB_CA2_SELECTOR__.sourcePin)==='bdaea0648f27c0f16e0a737bfba237eb54dd4cbb');
  check('FB graft',fb.adapterKind==='driver-graft',fb.adapterKind);
  check('FB Rig_Medium',fb.rigFamily==='Rig_Medium',fb.rigFamily);
  check('FB exact visual present',fb.visualPresent===true);
  check('FB not source-only',fb.sourceOnly===false);
  check('FB asset gate',fb.gates?.asset===true);
  check('FB clips gate',fb.gates?.clips===true);
  check('FB muzzle still open',fb.gates?.muzzle===false);
  check('FB no runtime ownership',Object.values(fb.scope||{}).every(v=>v===false),JSON.stringify(fb.scope));
  check('FB no save writes',fb.storageWrites===0,String(fb.storageWrites));
  await page.screenshot({path:OUT+'/01-frizzlebob-driver.png',fullPage:true});

  await page.evaluate(async()=>window.__KFB_CA2_SELECTOR__.selectActor('gothgirl'));
  const goth=await waitActor('gothgirl');
  check('GothGirl direct',goth.adapterKind==='kaykit-medium',goth.adapterKind);
  check('GothGirl Rig_Medium',goth.rigFamily==='Rig_Medium',goth.rigFamily);
  check('GothGirl visual present',goth.visualPresent===true);
  check('GothGirl hold',goth.status==='hold',goth.status);
  check('GothGirl face open',goth.gates?.face===false);
  check('GothGirl muzzle open',goth.gates?.muzzle===false);
  check('GothGirl no runtime ownership',Object.values(goth.scope||{}).every(v=>v===false),JSON.stringify(goth.scope));
  check('GothGirl URL deterministic',new URL(page.url()).searchParams.get('actor')==='gothgirl',page.url());
  await page.screenshot({path:OUT+'/02-gothgirl.png',fullPage:true});

  await page.evaluate(async()=>window.__KFB_CA2_SELECTOR__.selectActor('legacy-frizzlebob-v5a'));
  const legacy=await waitActor('legacy-frizzlebob-v5a');
  check('Legacy source-only',legacy.sourceOnly===true);
  check('Legacy no substitute visual',legacy.visualPresent===false);
  check('Legacy current-runtime candidate',legacy.status==='candidate',legacy.status);
  const sourceText=await page.locator('#sourceOnlyText').textContent();
  check('Legacy explains private source',/private Arena runtime asset/i.test(sourceText||''),sourceText||'');
  check('Legacy no substitute copy',/does not invent a replacement model/i.test(sourceText||''),sourceText||'');
  check('Legacy URL deterministic',new URL(page.url()).searchParams.get('actor')==='legacy-frizzlebob-v5a',page.url());
  await page.screenshot({path:OUT+'/03-legacy-source-only.png',fullPage:true});

  const reload=await page.goto(BASE+'?actor=gothgirl',{waitUntil:'domcontentloaded',timeout:60000});
  check('query reload HTTP',reload?.ok()===true,'status='+reload?.status());
  const querySnap=await waitActor('gothgirl');
  check('query actor selection',querySnap.selected==='gothgirl',querySnap.selected);

  check('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));

  const evidence={base:BASE,expectedHead:EXPECTED,checks,failed,errors,final:querySnap};
  await fs.writeFile(OUT+'/browser.json',JSON.stringify(evidence,null,2)+'\n');
  console.log('COMBAT_CA2_SELECTOR_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
}finally{if(browser)await browser.close()}
