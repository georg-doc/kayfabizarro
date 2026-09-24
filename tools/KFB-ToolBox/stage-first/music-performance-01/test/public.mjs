import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const stageUrl='https://kayfabizarro.pages.dev/kfb-hub/stage/';
const perfUrl='https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/music-performance/';
const out='music-perf-public-proof';
fs.mkdirSync(out,{recursive:true});
const report={status:'UNKNOWN',stageUrl,perfUrl,checks:[],errors:[],httpErrors:[]};
const check=(name,pass,detail=null)=>{report.checks.push({name,pass:!!pass,detail});if(!pass)throw new Error(name+(detail?': '+JSON.stringify(detail):''));};
const near=(a,b,t=.08)=>Math.abs(a-b)<=t;
const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});
let page;
async function openUntil(page,url,predicate,label){
  let last=null;
  for(let i=0;i<8;i++){
    const resp=await page.goto(url,{waitUntil:'networkidle',timeout:120000});
    last={status:resp?.status()||0,url:page.url()};
    if(resp&&resp.ok()&&await predicate())return last;
    await page.waitForTimeout(5000);
  }
  throw new Error(label+' not propagated: '+JSON.stringify(last));
}
try{
  const ctx=await browser.newContext({viewport:{width:1440,height:930}});
  page=await ctx.newPage();
  page.on('pageerror',e=>report.errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});
  page.on('response',r=>{if(r.status()>=400)report.httpErrors.push({url:r.url(),status:r.status()})});

  const stageResp=await openUntil(page,stageUrl,
    ()=>page.locator('[data-stage-id="music-perf-01"]').count().then(n=>n===1),
    'Stage card');
  check('stage HTTP 2xx',stageResp.status>=200&&stageResp.status<300,stageResp);
  const link=page.locator('[data-stage-id="music-perf-01"] a.primary');
  check('stage card visible',await link.isVisible());
  const href=await link.getAttribute('href');
  check('stage direct link',href==='./toolbox/music-performance/'||href===perfUrl,href);
  await page.screenshot({path:path.join(out,'01-stage-card.png'),fullPage:true});

  const perfResp=await openUntil(page,perfUrl,
    ()=>page.evaluate(()=>document.documentElement.dataset.kfbBuild==='MUSIC-PERF-01-v1'),
    'MUSIC-PERF build');
  check('performance HTTP 2xx',perfResp.status>=200&&perfResp.status<300,perfResp);
  check('build marker',await page.evaluate(()=>document.documentElement.dataset.kfbBuild==='MUSIC-PERF-01-v1'));
  await page.waitForFunction(()=>window.__MUSIC_PERF_01__?.snapshot().ready===true,{timeout:120000});
  let s=await page.evaluate(()=>window.__MUSIC_PERF_01__.snapshot());
  check('exact ORB donor',s.source.id==='orb-kayfabizarros-band'&&s.source.version==='v5',s.source);
  check('exact GLB pin',s.source.glbBlob==='446b044ed7c68bf877afc0f456f0aa87cc390b46',s.source.glbBlob);
  check('exact song pin',s.song.blob==='368eb5ae8fafcfba1cce3ba3f80488378fe056b0',s.song.blob);
  check('one song owner',s.audioOwnerCount===1,s.audioOwnerCount);
  check('source mode first',s.mode==='source',s.mode);
  check('source drummer visible',s.performers.drummer===true,s.performers);

  await page.evaluate(async()=>{await window.__MUSIC_PERF_01__.setBeat(3.5);});
  s=await page.evaluate(()=>window.__MUSIC_PERF_01__.snapshot());
  check('public seek beat 3.5',near(s.beatPos,3.5,.04),s.beatPos);
  check('public bounce phase',near(s.actions.bounce.time,3.5,.05),s.actions.bounce);
  check('public strum phase',near(s.actions.strum.time,.5,.05),s.actions.strum);

  await page.evaluate(()=>window.__MUSIC_PERF_01__.setMode('performance'));
  s=await page.evaluate(()=>window.__MUSIC_PERF_01__.snapshot());
  check('performance leader visible',s.performers.leader===true,s.performers);
  check('performance guitarist visible',s.performers.guitarist===true,s.performers);
  check('performance drummer HOLD hidden',s.performers.drummer===false,s.performers);

  await page.evaluate(async()=>{await window.__MUSIC_PERF_01__.setBeat(4);});
  const before=await page.evaluate(()=>window.__MUSIC_PERF_01__.snapshot());
  await page.evaluate(()=>window.__MUSIC_PERF_01__.play());
  await page.waitForTimeout(900);
  const after=await page.evaluate(()=>window.__MUSIC_PERF_01__.snapshot());
  check('public song advances',after.audioTime>before.audioTime+.45,{before:before.audioTime,after:after.audioTime});
  check('public beat clock advances',after.beatPos>before.beatPos+.7,{before:before.beatPos,after:after.beatPos});
  await page.evaluate(()=>window.__MUSIC_PERF_01__.pause());
  await page.screenshot({path:path.join(out,'02-public-performance.png'),fullPage:true});

  check('no page errors',report.errors.length===0,report.errors);
  check('no HTTP failures',report.httpErrors.length===0,report.httpErrors);
  report.final=after;report.status='PASS';
}catch(e){
  report.status='FAIL';report.failure=String(e.stack||e);
  if(page)await page.screenshot({path:path.join(out,'FAIL.png'),fullPage:true}).catch(()=>{});
  process.exitCode=1;
}finally{
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({status:report.status,checks:report.checks.length,failure:report.failure||null}));
  await browser.close();
}
