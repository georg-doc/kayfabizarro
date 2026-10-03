import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base=process.env.AUDIO_ARRANGE_URL||'http://127.0.0.1:4173/kfb-hub/stage/audio-arrange-01/';
const out=process.env.AUDIO_ARRANGE_PROOF||'audio-arrange-proof';
fs.mkdirSync(out,{recursive:true});
const result={status:'UNKNOWN',checks:[],errors:[],httpErrors:[],external:[],base};
const check=(name,ok,detail=null)=>{result.checks.push({name,ok:!!ok,detail});if(!ok)throw new Error(name+': '+JSON.stringify(detail));};

const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});
let page;
try{
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  page=await context.newPage();
  const origin=new URL(base).origin;
  page.on('pageerror',e=>result.errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')result.errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)result.httpErrors.push({url:r.url(),status:r.status()});});
  page.on('request',r=>{try{const u=new URL(r.url());if(!r.url().startsWith('data:')&&u.origin!==origin)result.external.push(r.url());}catch{}});

  await page.goto(base,{waitUntil:'networkidle',timeout:90000});
  check('build marker',await page.evaluate(()=>document.documentElement.dataset.kfbBuild==='AUDIO-ARRANGE-01-DONOR-BENCH-v0.2'));
  check('runtime export',await page.evaluate(()=>!!window.__KFB_AUDIO_ARRANGE__));

  await page.locator('#load').click();
  await page.waitForFunction(()=>window.__KFB_AUDIO_ARRANGE__.snapshot().loaded,{timeout:120000});
  let s=await page.evaluate(()=>window.__KFB_AUDIO_ARRANGE__.snapshot());

  check('one AudioContext',s.contextCount===1,s.contextCount);
  check('AudioContext running',s.contextState==='running',s.contextState);
  check('76 BPM',s.bpm===76,s.bpm);
  check('64 bar form',s.totalBars===64&&s.sections.length===8,{bars:s.totalBars,sections:s.sections.length});
  check('A/B mode gains level calibrated',s.modeGains.master===.68&&s.modeGains.reconstruct===.73&&s.modeGains.arrange===.90,s.modeGains);
  check('bar duration',Math.abs(s.barSeconds-(240/76))<1e-9,s.barSeconds);
  check('eight stem decodes',Object.values(s.stemStats).filter(Boolean).length===8,s.stemStats);
  check('two master decodes',Object.values(s.masterStats).filter(Boolean).length===2,s.masterStats);
  check('all audio substantial',Object.values({...s.masterStats,...s.stemStats}).every(x=>x&&x.duration>120));
  check('stem lengths aligned',s.stemDurationSpread<1.0,s.stemDurationSpread);
  const cyc=s.masterStats.cyclical.duration;
  const stemMean=Object.values(s.stemStats).reduce((a,x)=>a+x.duration,0)/8;
  check('cyclical master/stem duration compatible',Math.abs(cyc-stemMean)<1.0,{cyc,stemMean});

  await page.evaluate(()=>window.__KFB_AUDIO_ARRANGE__.playMaster('cyclical'));
  s=await page.evaluate(()=>window.__KFB_AUDIO_ARRANGE__.snapshot());
  check('cyclical master single source',s.activeSources===1,s.activeSources);
  await page.evaluate(()=>window.__KFB_AUDIO_ARRANGE__.stopAll());

  await page.evaluate(()=>window.__KFB_AUDIO_ARRANGE__.playMaster('loping'));
  s=await page.evaluate(()=>window.__KFB_AUDIO_ARRANGE__.snapshot());
  check('loping master single source',s.activeSources===1,s.activeSources);
  await page.evaluate(()=>window.__KFB_AUDIO_ARRANGE__.stopAll());

  await page.evaluate(()=>window.__KFB_AUDIO_ARRANGE__.playStems('reconstruct'));
  s=await page.evaluate(()=>window.__KFB_AUDIO_ARRANGE__.snapshot());
  check('reconstruct eight sources',s.activeSources===8,s.activeSources);
  check('sample-synchronous scheduled starts',s.synchronizedStarts,s.scheduledStarts);
  await page.waitForTimeout(600);
  await page.evaluate(()=>window.__KFB_AUDIO_ARRANGE__.stopAll());

  await page.evaluate(()=>window.__KFB_AUDIO_ARRANGE__.playStems('arrange'));
  s=await page.evaluate(()=>window.__KFB_AUDIO_ARRANGE__.snapshot());
  check('arrange eight sources',s.activeSources===8,s.activeSources);
  check('arrange sample-synchronous starts',s.synchronizedStarts,s.scheduledStarts);
  check('arrange gain map has all sections',Object.keys(s.arrangeGains).length===8,Object.keys(s.arrangeGains));
  check('SPACE is sparse',s.arrangeGains.SPACE.drums<.25&&s.arrangeGains.SPACE.bass<.4,s.arrangeGains.SPACE);
  check('PSY adds wet space',s.arrangeGains.PSY.wet>s.arrangeGains.A.wet,{psy:s.arrangeGains.PSY.wet,a:s.arrangeGains.A.wet});

  await page.screenshot({path:path.join(out,'desktop.png'),fullPage:true});
  await page.evaluate(()=>window.__KFB_AUDIO_ARRANGE__.stopAll());

  check('no page/console errors',result.errors.length===0,result.errors);
  check('no HTTP errors',result.httpErrors.length===0,result.httpErrors);
  check('no external runtime requests',result.external.length===0,result.external);

  result.snapshot=await page.evaluate(()=>window.__KFB_AUDIO_ARRANGE__.snapshot());
  result.status='PASS';
}catch(e){
  result.status='FAIL';result.failure=String(e.stack||e);process.exitCode=1;
  if(page)await page.screenshot({path:path.join(out,'FAIL.png'),fullPage:true}).catch(()=>{});
}finally{
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify({status:result.status,checks:result.checks.length,failure:result.failure||null}));
  await browser.close();
}
