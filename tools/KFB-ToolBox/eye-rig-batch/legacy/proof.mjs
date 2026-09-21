import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=(process.env.KLR_EYE_BASE_URL||'http://127.0.0.1:4173/tools/KFB-ToolBox/eye-rig-batch/legacy/').replace(/\/?$/,'/');
const OUT=process.env.KLR_EYE_PROOF_DIR||'legacy-eye-batch-evidence';
const checks=[];
const check=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)};

await fs.mkdir(OUT+'/source',{recursive:true});
await fs.mkdir(OUT+'/mounted',{recursive:true});
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
  const catalog=await page.evaluate(async()=>await (await fetch('../data/rig-legacy-heads.v0.json')).json());
  check('17-head catalog',catalog.actors.length===17,String(catalog.actors.length));

  const summaries=[];
  let measured=0,human=0;
  for(let i=0;i<catalog.actors.length;i++){
    const actor=catalog.actors[i],id=actor.id;
    const source=await page.evaluate(async(id)=>await window.__KLR_EYE_BATCH__.source(id),id);
    check(id+' source id',source.id===id,JSON.stringify(source));
    check(id+' source mode',await page.evaluate(()=>document.documentElement.dataset.legacyEyeMode)==='source');
    check(id+' source exact path',source.sourcePath===actor.sourcePath,source.sourcePath);
    await page.screenshot({path:`${OUT}/source/${String(i+1).padStart(2,'0')}-${id}.png`});

    const mounted=await page.evaluate(async(id)=>await window.__KLR_EYE_BATCH__.mount(id),id);
    const p=mounted.profile,measurement=mounted.measurement,eye=mounted.eyeReport;
    check(id+' mounted mode',await page.evaluate(()=>document.documentElement.dataset.legacyEyeMode)==='mounted');
    check(id+' profile schema',p.schema==='kfb.eye-profile/0.1-candidate',p.schema);
    check(id+' rig family',p.rigClass==='Rig_Legacy',p.rigClass);
    check(id+' source identity',p.actorId===id&&p.source.path===actor.sourcePath,JSON.stringify(p.source));
    check(id+' source isolate evidence',p.evidence.sourceIsolationPassed===true);
    check(id+' mount evidence',p.evidence.automatedMountPassed===true);
    check(id+' visual approval remains false',p.evidence.eyeProfileVisuallyApproved===false);
    check(id+' FaceHost OK',p.faceHost?.status==='OK',JSON.stringify(p.faceHost));
    check(id+' eyeFrame',!!eye.eyeFrame,JSON.stringify(eye.eyeFrame));
    check(id+' measurement classified',['MEASURED_CANDIDATE','HUMAN_REQUIRED'].includes(measurement.status),measurement.status);
    check(id+' anchor finite',['dx','dy','ring'].every(k=>Number.isFinite(p.eye?.anchor?.[k])),JSON.stringify(p.eye?.anchor));
    if(measurement.status==='MEASURED_CANDIDATE')measured++;else human++;
    summaries.push({
      id,label:actor.label,kind:actor.kind,hostBodyId:actor.hostBodyId,
      measurement:measurement.status,status:p.status,anchor:p.eye.anchor,
      baseColor:p.eye.baseColor,cleanupCount:mounted.cleanupCount,
      headSize:p.faceHost.headSize,confidence:p.sourceFace.confidence
    });
    console.log('KLR_EYE_PROFILE_JSON:'+JSON.stringify(p));
    await page.screenshot({path:`${OUT}/mounted/${String(i+1).padStart(2,'0')}-${id}.png`});
  }

  const report=await page.evaluate(()=>window.__KLR_EYE_BATCH__.report());
  check('17 profiles generated',Object.keys(report.profiles).length===17,String(Object.keys(report.profiles).length));
  check('all heads source-isolated',new Set(report.sourceSeen).size===17,String(new Set(report.sourceSeen).size));
  check('classification totals 17',measured+human===17,`${measured} measured + ${human} human`);
  check('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));

  const batch={
    schema:'kfb.eye-profile-batch/0.2-candidate',
    rigClass:'Rig_Legacy',
    inheritanceOrder:['rigClass','character','session'],
    classDefault:null,
    generatedFrom:'KLR-EYE-01 automated LegacyFaceHost measurement',
    generatedDate:'2026-09-21',
    profileCount:17,
    measuredCount:measured,
    humanRequiredCount:human,
    profiles:Object.values(report.profiles)
  };
  await fs.writeFile(OUT+'/rig-legacy-auto.generated.json',JSON.stringify(batch,null,2));
  await fs.writeFile(OUT+'/browser.json',JSON.stringify({base:BASE,checks,summaries,failed,errors,batchSummary:{measured,human}},null,2));
  await page.screenshot({path:OUT+'/final.png',fullPage:true});
  console.log('KLR_EYE_BATCH_COUNTS',JSON.stringify({profiles:17,measured,human}));
  console.log('KLR_EYE_BROWSER_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
} finally {
  if(browser)await browser.close();
}
