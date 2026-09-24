import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base=process.env.AUDIO_CAL_URL||'http://127.0.0.1:4173/kfb-hub/stage/audio-calibration/';
const out=process.env.AUDIO_CAL_PROOF||'audio-cal-proof';
fs.mkdirSync(out,{recursive:true});

const result={status:'UNKNOWN',checks:[],errors:[],httpErrors:[],base};
function check(name,ok,detail=null){
  result.checks.push({name,ok:!!ok,detail});
  if(!ok)throw new Error(name+(detail!=null?': '+JSON.stringify(detail):''));
}
const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});
let page;
try{
  const context=await browser.newContext({viewport:{width:1440,height:980}});
  page=await context.newPage();
  page.on('pageerror',e=>result.errors.push(String(e)));
  page.on('console',msg=>{if(msg.type()==='error')result.errors.push(msg.text())});
  page.on('response',res=>{if(res.status()>=400)result.httpErrors.push({url:res.url(),status:res.status()})});

  await page.goto(base,{waitUntil:'networkidle',timeout:90000});
  check('stage marker',await page.evaluate(()=>document.documentElement.dataset.kfbBuild==='AUDIO-CAL-01-v1'));
  check('runtime export',await page.evaluate(()=>!!window.__KFB_AUDIO_CAL__));
  check('three scene controls',(await page.locator('.scene-button').count())===3);

  await page.locator('#startAudio').click();
  await page.waitForFunction(()=>window.__KFB_AUDIO_CAL__.snapshot().ready,{timeout:90000});
  await page.waitForFunction(()=>window.__KFB_AUDIO_CAL__.snapshot().loaded>=10,{timeout:90000});

  let snap=await page.evaluate(()=>window.__KFB_AUDIO_CAL__.snapshot());
  check('one AudioContext',snap.contextCount===1,snap);
  check('AudioContext running',snap.contextState==='running',snap);
  check('three persistent loops',snap.activeLoops===3,snap);
  check('ten decoded reference assets',snap.loaded===10,snap);
  check('no audio load errors',snap.loadErrors.length===0,snap.loadErrors);

  await page.waitForTimeout(700);
  const t1=(await page.evaluate(()=>window.__KFB_AUDIO_CAL__.snapshot())).musicTime;
  await page.waitForTimeout(500);
  const t2=(await page.evaluate(()=>window.__KFB_AUDIO_CAL__.snapshot())).musicTime;
  check('music timeline advances',t2>t1+.25,{t1,t2});

  await page.locator('[data-scene="ring-performance"]').click();
  await page.waitForTimeout(450);
  const open=await page.evaluate(()=>window.__KFB_AUDIO_CAL__.snapshot());
  check('ring scene selected',open.scene==='ring-performance',open);
  check('ring foreground music level',open.gains.musicScene>.60,open.gains);

  await page.evaluate(()=>window.__KFB_AUDIO_CAL__.voiceFocus(true));
  await page.waitForTimeout(450);
  const duck=await page.evaluate(()=>window.__KFB_AUDIO_CAL__.snapshot());
  check('voice focus active',duck.ducked===true,duck);
  check('music bus ducked',duck.gains.musicBus<open.gains.musicBus*.55,{open:open.gains.musicBus,duck:duck.gains.musicBus});
  check('ambience bus ducked',duck.gains.ambienceBus<open.gains.ambienceBus*.70,{open:open.gains.ambienceBus,duck:duck.gains.ambienceBus});

  const duckT1=duck.musicTime;
  await page.waitForTimeout(500);
  const duckT2=(await page.evaluate(()=>window.__KFB_AUDIO_CAL__.snapshot())).musicTime;
  check('music continues during voice duck',duckT2>duckT1+.25,{duckT1,duckT2});

  await page.evaluate(()=>window.__KFB_AUDIO_CAL__.voiceFocus(false));
  await page.waitForTimeout(850);
  const recovered=await page.evaluate(()=>window.__KFB_AUDIO_CAL__.snapshot());
  check('voice focus releases',recovered.ducked===false,recovered);
  check('music bus recovers',recovered.gains.musicBus>duck.gains.musicBus*2,{duck:duck.gains.musicBus,recovered:recovered.gains.musicBus});

  await page.evaluate(async()=>{
    await window.__KFB_AUDIO_CAL__.impact();
    await window.__KFB_AUDIO_CAL__.crowd();
    await window.__KFB_AUDIO_CAL__.cascade();
    await window.__KFB_AUDIO_CAL__.storm();
    await window.__KFB_AUDIO_CAL__.vehicle();
  });
  await page.waitForTimeout(900);
  snap=await page.evaluate(()=>window.__KFB_AUDIO_CAL__.snapshot());
  for(const key of ['impact','crowd','cascade','storm','vehicle']){
    check(key+' event counted',snap.counters[key]>=1,snap.counters);
  }

  await page.locator('[data-scene="graveyard-night"]').click();
  await page.waitForTimeout(450);
  const grave=await page.evaluate(()=>window.__KFB_AUDIO_CAL__.snapshot());
  check('graveyard scene selected',grave.scene==='graveyard-night',grave);
  check('graveyard music near-silent',grave.gains.musicScene<.08,grave.gains);
  check('graveyard wind remains present',grave.gains.wind>.20,grave.gains);

  check('desktop viewport fits',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:path.join(out,'desktop-ring-graveyard.png'),fullPage:true});

  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const mp=await mobile.newPage();
  const mobileErrors=[];
  mp.on('pageerror',e=>mobileErrors.push(String(e)));
  await mp.goto(base,{waitUntil:'networkidle',timeout:90000});
  check('mobile viewport fits',await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  check('mobile scene stack',await mp.evaluate(()=>getComputedStyle(document.querySelector('.scenes')).gridTemplateColumns.split(' ').length===1));
  check('mobile no page errors',mobileErrors.length===0,mobileErrors);
  await mp.screenshot({path:path.join(out,'mobile.png'),fullPage:true});
  await mobile.close();

  check('no page/console errors',result.errors.length===0,result.errors);
  check('no HTTP failures',result.httpErrors.length===0,result.httpErrors);

  result.final=await page.evaluate(()=>window.__KFB_AUDIO_CAL__.snapshot());
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
