import fs from 'node:fs';import path from 'node:path';import { chromium } from 'playwright';
const base=process.env.MOOD_POOL_URL||'http://127.0.0.1:4173/kfb-hub/stage/audio-stem-bed-02/';
const out='audio-stem-bed-02-proof';fs.mkdirSync(out,{recursive:true});
const result={status:'UNKNOWN',checks:[],errors:[],httpErrors:[],external:[]};
const check=(n,o,d=null)=>{result.checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d));};
const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});let page;
try{
  const c=await browser.newContext({viewport:{width:1440,height:980}});
  page=await c.newPage();
  const origin=new URL(base).origin;
  page.on('pageerror',e=>result.errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')result.errors.push(m.text())});
  page.on('response',r=>{if(r.status()>=400)result.httpErrors.push({url:r.url(),status:r.status()})});
  page.on('request',r=>{try{const u=new URL(r.url());if(!r.url().startsWith('data:')&&u.origin!==origin)result.external.push(r.url())}catch{}});
  await page.goto(base,{waitUntil:'networkidle',timeout:90000});
  check('build marker',await page.evaluate(()=>document.documentElement.dataset.kfbBuild==='AUDIO-STEM-BED-02-v0.1'));
  check('runtime export',await page.evaluate(()=>!!window.__KFB_MOOD_POOL__));
  let s=await page.evaluate(()=>window.__KFB_MOOD_POOL__.snapshot());
  check('five donor definitions',s.donors.length===5,s.donors);

  for(const id of ['neutral','awe','sunshine','grief','boss']){
    await page.evaluate(id=>window.__KFB_MOOD_POOL__.selectDonor(id),id);
    await page.click('#load');
    await page.waitForFunction(id=>window.__KFB_MOOD_POOL__.snapshot().loadedDonor===id,id,{timeout:120000});
    await page.evaluate(()=>window.__KFB_MOOD_POOL__.play());
    s=await page.evaluate(()=>window.__KFB_MOOD_POOL__.snapshot());
    check(id+' starts sync',s.synchronizedStarts,s.starts);
    check(id+' starts all stems',s.starts.length===s.stemCount,{starts:s.starts.length,stemCount:s.stemCount});
    await page.evaluate(()=>window.__KFB_MOOD_POOL__.stop());
  }

  await page.evaluate(()=>{
    window.__KFB_MOOD_POOL__.selectDonor('neutral');
    window.__KFB_MOOD_POOL__.setControl('activity',1);
  });
  s=await page.evaluate(()=>window.__KFB_MOOD_POOL__.snapshot());
  check('activity raises drums target',s.targets.drums>.7,s.targets);

  await page.evaluate(()=>window.__KFB_MOOD_POOL__.preset('voice'));
  s=await page.evaluate(()=>window.__KFB_MOOD_POOL__.snapshot());
  check('voice ducks keyboard harder than bass',s.targets.keyboard/s.targets.bass<.5,s.targets);

  check('no page errors',result.errors.length===0,result.errors);
  check('no HTTP errors',result.httpErrors.length===0,result.httpErrors);
  check('no external requests',result.external.length===0,result.external);
  await page.screenshot({path:path.join(out,'desktop.png'),fullPage:true});
  result.snapshot=s;result.status='PASS';
}catch(e){
  result.status='FAIL';result.failure=String(e.stack||e);process.exitCode=1;
  if(page)await page.screenshot({path:path.join(out,'FAIL.png'),fullPage:true}).catch(()=>{});
}finally{
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify({status:result.status,checks:result.checks.length,failure:result.failure||null}));
  await browser.close();
}