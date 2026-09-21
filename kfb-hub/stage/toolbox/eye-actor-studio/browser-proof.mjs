import {chromium} from 'playwright';import fs from 'node:fs/promises';
const BASE=process.env.KFB_EAS1_BASE||'http://127.0.0.1:4173',OUT=process.env.KFB_EAS1_EVIDENCE||'eas1-evidence';await fs.mkdir(OUT,{recursive:true});
const checks=[];const check=(n,c,e='')=>{checks.push({name:n,pass:!!c,extra:e});if(!c)throw Error('FAIL '+n+' '+e);console.log('PASS',n,e)};
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 for(const [label,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]){
  const page=await browser.newPage({viewport}),errors=[],failed=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const res=await page.goto(BASE+'/kfb-hub/stage/toolbox/eye-actor-studio/',{waitUntil:'domcontentloaded',timeout:60000});
  check(label+' HTTP',res?.ok(),String(res?.status()));
  await page.waitForFunction(()=>document.documentElement.dataset.kfbEyeStudioReady==='yes'&&window.__KFB_EYE_ACTOR_STUDIO_V1__?.ready,null,{timeout:60000});
  check(label+' default cluster',await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__.mode)==='cluster');
  check(label+' default count 2',(await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__.cluster.count))===2);

  await page.selectOption('#preset','pair-asymmetric');await page.waitForTimeout(120);
  let d=await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__.cluster);
  check(label+' asymmetric sizes',Math.abs(d.eyes[0].size-d.eyes[1].size)>.2,JSON.stringify(d.eyes.map(x=>x.size)));

  await page.selectOption('#preset','pair-frog-side');await page.waitForTimeout(120);
  d=await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__.cluster);
  check(label+' frog yaw',Math.abs(d.eyes[0].eulerDeg[1])>=60&&Math.abs(d.eyes[1].eulerDeg[1])>=60,JSON.stringify(d.eyes.map(x=>x.eulerDeg)));

  await page.selectOption('#preset','three-eye');await page.waitForTimeout(120);
  check(label+' three eyes',(await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__.cluster.count))===3);

  await page.selectOption('#preset','four-eye');await page.waitForTimeout(120);
  check(label+' four eyes',(await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__.cluster.count))===4);

  await page.selectOption('#scope','selected');await page.selectOption('#pose','aim');await page.waitForTimeout(120);
  d=await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__.cluster);
  check(label+' selected aim scope',Math.abs(d.eyes[0].gaze[0])>.1&&Math.abs(d.eyes[1].gaze[0])<.01,JSON.stringify(d.eyes.map(x=>x.gaze)));

  await page.selectOption('#mode','donor');await page.waitForTimeout(200);
  check(label+' exact donor mode',await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__.mode)==='donor');
  await page.screenshot({path:OUT+'/'+label+'-donor.png'});

  await page.selectOption('#mode','cluster');await page.selectOption('#preset','pair-frog-side');await page.waitForTimeout(150);
  await page.screenshot({path:OUT+'/'+label+'-frog.png'});

  check(label+' no failed resources',failed.length===0,JSON.stringify(failed));
  check(label+' no page errors',errors.length===0,JSON.stringify(errors));
  await page.close();
 }
 await fs.writeFile(OUT+'/browser.json',JSON.stringify({checks},null,2));
 console.log('KFB_EAS1_BROWSER_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
}finally{await browser.close()}
