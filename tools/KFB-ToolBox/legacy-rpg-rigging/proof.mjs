import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=(process.env.KLR_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/toolbox/legacy-rpg-rigging/').replace(/\/?$/,'/');
const PUBLIC=process.env.KLR_PUBLIC==='1';
const EXPECTED_HEAD=process.env.KLR_SOURCE_HEAD||'';
const OUT=process.env.KLR_PROOF_DIR||'legacy-rpg-rigging-evidence';
const checks=[];
const check=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)};
const wait=ms=>new Promise(r=>setTimeout(r,ms));

async function waitMarker(){
  if(!PUBLIC)return;
  let last=null;
  for(let i=0;i<180;i++){
    try{
      const r=await fetch(BASE+'SOURCE.json?proof='+Date.now(),{cache:'no-store'});
      const text=await r.text();let j=null;try{j=JSON.parse(text)}catch{}
      last={status:r.status,head:j?.sourceBranchHead||j?.sourceRuntimeHead||null,preview:text.slice(0,100)};
      if(r.ok && (j?.sourceBranchHead===EXPECTED_HEAD||j?.sourceRuntimeHead===EXPECTED_HEAD))return;
    }catch(e){last={error:String(e)}}
    await wait(3000);
  }
  throw Error('Stage marker timeout '+JSON.stringify(last));
}

await waitMarker();
await fs.mkdir(OUT,{recursive:true});
let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1540,height:1000},deviceScaleFactor:1});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push('pageerror '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  check('HTTP',response?.ok()===true,'status='+response?.status());
  await page.waitForFunction(()=>document.querySelector('#bootBadge')?.textContent==='READY',null,{timeout:120000});
  check('boot READY',await page.locator('#bootBadge').textContent()==='READY');
  check('source mode first',await page.locator('#stageMode').textContent()==='SOURCE');
  check('Barbarian donor isolated',/Barbarian/.test(await page.locator('#stageObject').textContent()));
  check('WebGL canvas',await page.locator('#stage canvas').count()===1);
  const catalog=await page.evaluate(async()=>await (await fetch('./data/catalog.v1.json')).json());
  check('4 bodies',catalog.characters.length===4,String(catalog.characters.length));
  check('17 heads',catalog.heads.length===17,String(catalog.heads.length));
  check('24 weapons',catalog.weapons.length===24,String(catalog.weapons.length));
  check('10 gear/props',catalog.accessories.length===10,String(catalog.accessories.length));
  check('30 native clips',catalog.motions.length===30,String(catalog.motions.length));
  check('semantic attack',catalog.semantic.attack==='Attack(1h)',String(catalog.semantic.attack));
  check('semantic bow',catalog.semantic.bow==='Shoot(2h)Bow',String(catalog.semantic.bow));

  const assembled={};
  for(const id of ['barbarian','knight','mage','rogue']){
    await page.selectOption('#bodySelect',id);
    await page.locator('#bodySelect').dispatchEvent('change');
    await page.click('#assembleBtn');
    await page.waitForFunction(()=>document.querySelector('#rigStatus')?.textContent==='RIG_LEGACY',null,{timeout:120000});
    await page.waitForFunction(()=>document.querySelector('#stageMode')?.textContent==='ASSEMBLED' && /native Rig_Legacy/.test(document.querySelector('#motionStatus')?.textContent||''),null,{timeout:30000});
    const snap=await page.evaluate(()=>({
      rig:document.querySelector('#rigStatus')?.textContent,
      mode:document.querySelector('#stageMode')?.textContent,
      object:document.querySelector('#stageObject')?.textContent,
      motion:document.querySelector('#motionStatus')?.textContent,
      report:document.querySelector('#assemblyReport')?.textContent
    }));
    check(id+' rig',snap.rig==='RIG_LEGACY',snap.rig);
    check(id+' assembled',snap.mode==='ASSEMBLED',snap.mode);
    check(id+' source identity',new RegExp(id,'i').test(snap.object),snap.object);
    check(id+' native motion active',/native Rig_Legacy/.test(snap.motion),snap.motion);
    check(id+' 30 clips',/"clips": 30/.test(snap.report),snap.report.slice(0,220));
    check(id+' core parts',/"placed"/.test(snap.report)&&!/"missing": \[\s*"/.test(snap.report),snap.report.slice(0,220));
    assembled[id]=snap;
  }

  await page.selectOption('#bodySelect','barbarian');
  await page.locator('#bodySelect').dispatchEvent('change');
  await page.click('#assembleBtn');
  await page.waitForFunction(()=>document.querySelector('#rigStatus')?.textContent==='RIG_LEGACY',null,{timeout:120000});
  await page.click('[data-motion="Attack(1h)"]');
  await page.waitForFunction(()=>/Attack\(1h\).*native Rig_Legacy/.test(document.querySelector('#motionStatus')?.textContent||''),null,{timeout:30000});
  check('native attack audition',/Attack\(1h\).*native Rig_Legacy/.test(await page.locator('#motionStatus').textContent()));
  await page.selectOption('#rightWeapon','sword-common');
  await page.locator('#rightWeapon').dispatchEvent('change');
  await page.waitForTimeout(1200);
  check('weapon selector accepts exact donor',await page.inputValue('#rightWeapon')==='sword-common');

  const eyeReport=await page.locator('#eyeSourceReport').textContent();
  check('LegacyFaceHost measured',/"status": "OK"/.test(eyeReport),eyeReport.slice(0,220));
  check('eye candidate report',/sourceEyes/.test(eyeReport)&&/profileStatus/.test(eyeReport),eyeReport.slice(0,220));
  await page.click('#eyeRigBtn');
  await page.waitForFunction(()=>document.querySelector('#stageMode')?.textContent==='EYERIG',null,{timeout:30000});
  check('EyeRig v6 mounted',await page.locator('#stageMode').textContent()==='EYERIG');
  await page.click('[data-expr="angry"]');
  await page.click('#blinkBtn');
  await page.waitForTimeout(350);
  check('EyeRig expression controls active',await page.locator('[data-expr="angry"]').evaluate(el=>el.classList.contains('active')));

  await page.screenshot({path:OUT+'/desktop.png',fullPage:true});
  const evidence={base:BASE,public:PUBLIC,sourceHead:EXPECTED_HEAD,checks,assembled,failed,errors};
  await fs.writeFile(OUT+'/browser.json',JSON.stringify(evidence,null,2));
  check('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));
  evidence.checks=checks;
  await fs.writeFile(OUT+'/browser.json',JSON.stringify(evidence,null,2));
  console.log('LEGACY_RPG_RIGGING_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
} finally {
  if(browser)await browser.close();
}
