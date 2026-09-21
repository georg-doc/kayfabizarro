import {chromium} from 'playwright';import fs from 'node:fs/promises';
const BASE=process.env.KFB_EYE_BASE||'http://127.0.0.1:4173',OUT=process.env.KFB_EYE_EVIDENCE||'eye-actor-evidence';await fs.mkdir(OUT,{recursive:true});
const checks=[];const check=(n,c,e='')=>{checks.push({name:n,pass:!!c,extra:e});if(!c)throw Error('FAIL '+n+' '+e);console.log('PASS',n,e)};
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 for(const [label,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]){
  const page=await browser.newPage({viewport}),errors=[],failed=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));
  const res=await page.goto(BASE+'/kfb-hub/stage/toolbox/eye-actor-studio/',{waitUntil:'domcontentloaded',timeout:60000});check(label+' HTTP',res?.ok(),String(res?.status()));
  await page.waitForFunction(()=>document.documentElement.dataset.kfbEyeActorReady==='yes',null,{timeout:60000});check(label+' donor ready',true);check(label+' donor first',await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO__.mode)==='donor');check(label+' donor has 4 lids',(await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO__.lidCount))===4);
  await page.screenshot({path:OUT+'/'+label+'-donor.png'});
  await page.selectOption('#mode','clay');await page.waitForFunction(()=>document.documentElement.dataset.kfbEyeActorReady==='yes'&&document.documentElement.dataset.kfbEyeActorMode==='clay'&&window.__KFB_EYE_ACTOR_STUDIO__?.mode==='clay'&&window.__KFB_EYE_ACTOR_STUDIO__?.clayLidCount===4);let d=await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO__);check(label+' four clay lids',d.clayLidCount===4,String(d.clayLidCount));check(label+' pupil behind rim',d.clayReport?.pupilClearance>0,String(d.clayReport?.pupilClearance));
  await page.selectOption('#pose','skeptical');await page.waitForTimeout(250);d=await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO__);check(label+' asymmetric skeptical lids',Math.abs(d.lidRotations[0]-d.lidRotations[2])>.05,JSON.stringify(d.lidRotations));
  await page.selectOption('#colorCase','body');await page.waitForTimeout(100);d=await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO__);check(label+' body color fallback',d.resolver.source==='body',JSON.stringify(d.resolver));
  await page.selectOption('#colorCase','main');await page.waitForTimeout(100);d=await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO__);check(label+' main color fallback',d.resolver.source==='main',JSON.stringify(d.resolver));
  await page.selectOption('#emanata','sweat');await page.waitForTimeout(100);d=await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO__);check(label+' sweat state',d.emanata==='sweat');
  await page.screenshot({path:OUT+'/'+label+'-clay-skeptical.png'});
  check(label+' no failed resources',failed.length===0,JSON.stringify(failed));check(label+' no page errors',errors.length===0,JSON.stringify(errors));await page.close();
 }
 await fs.writeFile(OUT+'/browser.json',JSON.stringify({checks},null,2));console.log('KFB_EYE_ACTOR_BROWSER_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
}finally{await browser.close()}
