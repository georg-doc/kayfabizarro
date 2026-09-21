import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=(process.env.KLR_EYE_BASE_URL||'http://127.0.0.1:4173/tools/KFB-ToolBox/eye-rig-batch/legacy/').replace(/\/?$/,'/');
const OUT=process.env.KLR_EYE_PERSISTED_DIR||'legacy-eye-persisted-evidence';
const checks=[];
const check=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

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
  check('saved profile button exists',await page.locator('#persistedBtn').count()===1);
  const catalog=await page.evaluate(async()=>await (await fetch('../data/rig-legacy-heads.v0.json')).json());
  const batch=await page.evaluate(async()=>await (await fetch('../data/rig-legacy-auto.v1.json')).json());
  check('17 catalog heads',catalog.actors.length===17,String(catalog.actors.length));
  check('17 persisted profiles',batch.profiles.length===17,String(batch.profiles.length));
  check('Rig_Legacy persisted batch',batch.rigClass==='Rig_Legacy',batch.rigClass);
  const byId=new Map(batch.profiles.map(p=>[p.actorId,p]));
  const results=[];

  for(const actor of catalog.actors){
    const expected=byId.get(actor.id);
    check(actor.id+' persisted profile exists',!!expected);
    await page.evaluate(async(id)=>await window.__KLR_EYE_BATCH__.source(id),actor.id);
    check(actor.id+' source mode',await page.evaluate(()=>document.documentElement.dataset.legacyEyeMode)==='source');
    const out=await page.evaluate(async(id)=>await window.__KLR_EYE_BATCH__.mountPersisted(id),actor.id);
    const p=out.profile;
    check(actor.id+' mounted mode',await page.evaluate(()=>document.documentElement.dataset.legacyEyeMode)==='mounted');
    check(actor.id+' exact actor/source identity',p.actorId===expected.actorId&&p.source.path===expected.source.path,JSON.stringify(p.source));
    check(actor.id+' exact saved anchor',same(p.eye.anchor,expected.eye.anchor),JSON.stringify({got:p.eye.anchor,expected:expected.eye.anchor}));
    check(actor.id+' exact saved status',p.status===expected.status,p.status);
    check(actor.id+' exact saved face color',p.eye.baseColor===expected.eye.baseColor,String(p.eye.baseColor));
    check(actor.id+' current measurement classification stable',out.measurement.status===expected.sourceFace.status,`${out.measurement.status} / ${expected.sourceFace.status}`);
    check(actor.id+' source-isolation evidence',p.evidence.sourceIsolationPassed===true);
    check(actor.id+' automated mount evidence',p.evidence.automatedMountPassed===true);
    check(actor.id+' visual approval still false',p.evidence.eyeProfileVisuallyApproved===false);
    check(actor.id+' eyeFrame',!!out.eyeReport.eyeFrame,JSON.stringify(out.eyeReport.eyeFrame));
    results.push({id:actor.id,status:p.status,measurement:out.measurement.status,anchor:p.eye.anchor,eyeFrame:out.eyeReport.eyeFrame});
  }

  const report=await page.evaluate(()=>window.__KLR_EYE_BATCH__.report());
  check('runtime sees 17 persisted profiles',report.persistedCount===17,String(report.persistedCount));
  check('all 17 mounted in this session',report.mounted.length===17,String(report.mounted.length));
  check('all 17 source-seen in this session',new Set(report.sourceSeen).size===17,String(new Set(report.sourceSeen).size));
  check('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));
  await fs.writeFile(OUT+'/browser.json',JSON.stringify({base:BASE,checks,results,failed,errors},null,2));
  await page.screenshot({path:OUT+'/final.png',fullPage:true});
  console.log('KLR_EYE_PERSISTED_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
} finally {
  if(browser)await browser.close();
}
