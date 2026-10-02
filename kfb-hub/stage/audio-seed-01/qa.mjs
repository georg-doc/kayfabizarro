import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base=process.env.AUDIO_SEED_URL||'http://127.0.0.1:4173/kfb-hub/stage/audio-seed-01/';
const out=process.env.AUDIO_SEED_PROOF||'audio-seed-proof';
fs.mkdirSync(out,{recursive:true});

const result={status:'UNKNOWN',checks:[],errors:[],httpErrors:[],externalRequests:[],base};
function check(name,ok,detail=null){
  result.checks.push({name,ok:!!ok,detail});
  if(!ok)throw new Error(name+(detail!=null?': '+JSON.stringify(detail):''));
}

const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});
let page;
try{
  const context=await browser.newContext({viewport:{width:1440,height:1040}});
  page=await context.newPage();
  const baseOrigin=new URL(base).origin;
  page.on('pageerror',(e)=>result.errors.push(String(e)));
  page.on('console',(msg)=>{if(msg.type()==='error')result.errors.push(msg.text());});
  page.on('response',(res)=>{if(res.status()>=400)result.httpErrors.push({url:res.url(),status:res.status()});});
  page.on('request',(req)=>{
    const url=req.url();
    if(url.startsWith('data:'))return;
    try{if(new URL(url).origin!==baseOrigin)result.externalRequests.push(url);}catch{}
  });

  await page.goto(base,{waitUntil:'networkidle',timeout:90000});
  check('stage marker',await page.evaluate(()=>document.documentElement.dataset.kfbBuild==='AUDIO-SEED-01-v0.2'));
  check('runtime export',await page.evaluate(()=>!!window.__KFB_AUDIO_SEED__));
  check('three real deck controls',(await page.locator('.deck-button').count())===3);

  await page.locator('#startAudio').click();
  await page.waitForFunction(()=>window.__KFB_AUDIO_SEED__.snapshot().ready,{timeout:30000});
  await page.waitForTimeout(500);
  let snap=await page.evaluate(()=>window.__KFB_AUDIO_SEED__.snapshot());
  check('one AudioContext',snap.contextCount===1,snap);
  check('AudioContext running',snap.contextState==='running',snap);
  check('timeline advances',snap.timelineStep>0,snap.timelineStep);
  check('semantic baseline matches source',snap.semanticDelta<=.0001,snap.semanticDelta);
  check('secondary compatibility nonzero',snap.identity.compatibility>0,snap.identity);

  const beforeRestart=snap.previewFingerprint;
  const sigBefore=snap.identity.identitySignature;
  await page.evaluate(()=>window.__KFB_AUDIO_SEED__.restartSameSeed());
  const afterRestart=await page.evaluate(()=>window.__KFB_AUDIO_SEED__.snapshot());
  check('same-seed structure repeats',afterRestart.previewFingerprint===beforeRestart,{beforeRestart,after:afterRestart.previewFingerprint});
  check('restart preserves identity',afterRestart.identity.identitySignature===sigBefore);

  const signatures={};
  for(const id of ['FORGET','IGNORE','EMBRACE']){
    await page.evaluate((deckId)=>window.__KFB_AUDIO_SEED__.selectDeck(deckId),id);
    await page.waitForFunction((deckId)=>window.__KFB_AUDIO_SEED__.snapshot().deckId===deckId,id);
    const s=await page.evaluate(()=>window.__KFB_AUDIO_SEED__.snapshot());
    signatures[id]=s.identity.identitySignature;
    check(id+' baseline verified',s.semanticDelta<=.0001,s.semanticDelta);
    check(id+' compatible identity',s.identity.compatibility>0,s.identity);
  }
  check('deck identities distinct',new Set(Object.values(signatures)).size===3,signatures);

  await page.evaluate(()=>window.__KFB_AUDIO_SEED__.selectDeck('EMBRACE'));
  await page.evaluate(()=>{window.__KFB_AUDIO_SEED__.setMode('world');window.__KFB_AUDIO_SEED__.setSpeed(.1);});
  const world=await page.evaluate(()=>window.__KFB_AUDIO_SEED__.snapshot());
  await page.evaluate(()=>{window.__KFB_AUDIO_SEED__.setMode('road');window.__KFB_AUDIO_SEED__.setSpeed(.95);});
  const road=await page.evaluate(()=>window.__KFB_AUDIO_SEED__.snapshot());
  check('Road preserves identity',road.identity.identitySignature===world.identity.identitySignature,{world:world.identity,road:road.identity});
  check('Road tempo bounded',road.runtime.bpm-world.runtime.bpm<=7,{world:world.runtime.bpm,road:road.runtime.bpm});
  check('Road speed adds subdivision',road.runtime.subdivisionLevel>world.runtime.subdivisionLevel,{world:world.runtime,road:road.runtime});

  await page.evaluate(()=>{
    window.__KFB_AUDIO_SEED__.setTransform('night',.8);
    window.__KFB_AUDIO_SEED__.setTransform('rain',.75);
  });
  await page.waitForTimeout(650);
  const weather=await page.evaluate(()=>window.__KFB_AUDIO_SEED__.snapshot());
  check('weather preserves identity',weather.identity.identitySignature===world.identity.identitySignature);
  check('rain becomes active',weather.runtime.effectiveRain>.3,weather.runtime);
  check('rain uses stochastic droplet events',weather.rainDrops>0,{rainDrops:weather.rainDrops});
  check('warm motif / rain repair revision',weather.timbreRevision==='warm-motif-r2+stochastic-rain-r2',weather.timbreRevision);

  await page.evaluate(()=>{
    window.__KFB_AUDIO_SEED__.setTransform('psychedelic',.7);
    window.__KFB_AUDIO_SEED__.setTransform('shadow',.8);
  });
  const transformed=await page.evaluate(()=>window.__KFB_AUDIO_SEED__.snapshot());
  check('psychedelic/shadow preserve identity',transformed.identity.identitySignature===world.identity.identitySignature);
  check('psychedelic wet path rises',transformed.runtime.delayWet>.25,transformed.runtime);
  check('shadow transform active',transformed.runtime.effectiveShadow>.3,transformed.runtime);

  const open=await page.evaluate(()=>window.__KFB_AUDIO_SEED__.snapshot());
  await page.evaluate(()=>window.__KFB_AUDIO_SEED__.voiceFocus(true));
  await page.waitForTimeout(250);
  const duck=await page.evaluate(()=>window.__KFB_AUDIO_SEED__.snapshot());
  check('voice focus ducks music',duck.runtime.musicGain<open.runtime.musicGain,{open:open.runtime.musicGain,duck:duck.runtime.musicGain});
  await page.evaluate(()=>window.__KFB_AUDIO_SEED__.voiceFocus(false));

  check('desktop viewport fits',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:path.join(out,'desktop-road-shadow.png'),fullPage:true});

  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const mp=await mobile.newPage();
  const mobileErrors=[];
  mp.on('pageerror',(e)=>mobileErrors.push(String(e)));
  await mp.goto(base,{waitUntil:'networkidle',timeout:90000});
  check('mobile viewport fits',await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  check('mobile deck stack',await mp.evaluate(()=>getComputedStyle(document.querySelector('.deck-tabs')).gridTemplateColumns.split(' ').length===1));
  check('mobile no page errors',mobileErrors.length===0,mobileErrors);
  await mp.screenshot({path:path.join(out,'mobile.png'),fullPage:true});
  await mobile.close();

  check('no page/console errors',result.errors.length===0,result.errors);
  check('no HTTP failures',result.httpErrors.length===0,result.httpErrors);
  check('no external API/network dependency',result.externalRequests.length===0,result.externalRequests);

  result.final=await page.evaluate(()=>window.__KFB_AUDIO_SEED__.snapshot());
  result.status='PASS';
}catch(e){
  result.status='FAIL';
  result.failure=String(e.stack||e);
  if(page)await page.screenshot({path:path.join(out,'FAIL.png'),fullPage:true}).catch(()=>{});
  process.exitCode=1;
}finally{
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify({status:result.status,checks:result.checks.length,failure:result.failure||null}));
  await browser.close();
}
