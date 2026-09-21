import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.KFB_BASE||'http://127.0.0.1:4173';
const OUT='gpt-selfcontained-evidence';
await fs.mkdir(OUT,{recursive:true});

const browser=await chromium.launch({
  headless:true,
  args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']
});

const checks=[];
const check=(n,c,e='')=>{
  checks.push({name:n,pass:!!c,extra:e});
  if(!c)throw Error('FAIL '+n+' '+e);
  console.log('PASS',n,e);
};

try{
  for(const [label,viewport] of [
    ['desktop',{width:1280,height:820}],
    ['mobile',{width:390,height:844}]
  ]){
    const page=await browser.newPage({viewport});
    const errors=[],failed=[];
    page.on('pageerror',e=>errors.push(String(e)));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
    page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

    const res=await page.goto(BASE+'/kfb-hub/stage/toolbox/eye-actor-studio/gpt-selfcontained/',{
      waitUntil:'domcontentloaded',
      timeout:60000
    });
    check(label+' HTTP',res?.ok(),String(res?.status()));

    await page.waitForFunction(
      ()=>document.documentElement.dataset.kfbDualLidReady==='yes'&&window.__KFB_DUAL_LID_SELFCONTAINED__?.ready,
      null,{timeout:60000}
    );

    let d=await page.evaluate(()=>window.__KFB_DUAL_LID_SELFCONTAINED__);
    check(label+' real host embedded',d.hostVertices===6675,String(d.hostVertices));
    check(label+' upper lid present',d.upper===true);
    check(label+' lower lid present',d.lower===true);
    check(label+' default Hybrid mode',d.motionMode==='hybrid',d.motionMode);
    check(label+' hinge depth exported',d.params.hingeDepth>0,String(d.params.hingeDepth));
    check(label+' canthus lock exported',d.params.canthusLock>.5,String(d.params.canthusLock));

    await page.screenshot({path:OUT+'/'+label+'-neutral-hybrid.png'});

    for(const mode of ['slide','sweep','hybrid']){
      await page.selectOption('#motionMode',mode);
      await page.selectOption('#preset','full');
      await page.waitForTimeout(160);
      d=await page.evaluate(()=>window.__KFB_DUAL_LID_SELFCONTAINED__);
      check(label+' '+mode+' mode state',d.motionMode===mode,d.motionMode);
      check(label+' '+mode+' full blink',d.params.blink===1,String(d.params.blink));
      await page.screenshot({path:OUT+'/'+label+'-'+mode+'-fullblink.png'});
    }

    await page.selectOption('#motionMode','hybrid');
    await page.selectOption('#preset','frog');
    await page.waitForTimeout(140);
    d=await page.evaluate(()=>window.__KFB_DUAL_LID_SELFCONTAINED__);
    check(label+' frog yaw',d.params.eyeYaw===78,String(d.params.eyeYaw));
    check(label+' frog keeps Hybrid',d.motionMode==='hybrid',d.motionMode);
    await page.screenshot({path:OUT+'/'+label+'-hybrid-frog.png'});

    check(label+' no external requests',failed.length===0,JSON.stringify(failed));
    check(label+' no page errors',errors.length===0,JSON.stringify(errors));

    await page.close();
  }

  await fs.copyFile(
    'kfb-hub/stage/toolbox/eye-actor-studio/gpt-selfcontained/index.html',
    OUT+'/KFB_Eye_Actor_Studio_DualLid_SELFCONTAINED.html'
  );
  await fs.writeFile(OUT+'/browser.json',JSON.stringify({checks},null,2));
  console.log('KFB_GPT_SELFCONTAINED_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
}finally{
  await browser.close();
}
