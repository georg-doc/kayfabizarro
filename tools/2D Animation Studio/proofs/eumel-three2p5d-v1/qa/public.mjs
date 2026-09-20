import fs from 'node:fs';
import { chromium } from 'playwright';

const origin='https://kayfabizarro.pages.dev';
const route='/tools/2D%20Animation%20Studio/proofs/eumel-three2p5d-v1/';
const url=origin+route;
const out='eumel-three2p5d-public-evidence';
fs.mkdirSync(out,{recursive:true});

const report={url,checks:[],errors:[],failedResources:[],humanAcceptance:'PENDING'};
const check=(name,pass,details=null)=>{
  report.checks.push({name,pass:!!pass,details});
  if(!pass)throw new Error(name+(details?': '+JSON.stringify(details):''));
};
const close=(a,b,eps=1e-5)=>Math.abs(a-b)<=eps;

let browser;
try{
  // Deployment propagation gate: exact page marker must be public.
  let deployed=false;
  for(let i=0;i<30;i++){
    try{
      const r=await fetch(url+'?ci='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});
      if(r.ok){
        const t=await r.text();
        if(t.includes('Eumel 2.5D World-Space Proof')&&t.includes('eumel-three2p5d.v0.1.js')){deployed=true;break;}
      }
    }catch{}
    await new Promise(r=>setTimeout(r,10000));
  }
  check('current three2p5d proof deployed',deployed);

  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const context=await browser.newContext({viewport:{width:1440,height:920}});
  const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push('pageerror: '+String(e)));
  page.on('console',m=>{if(m.type()==='error'&&!/favicon/i.test(m.text()))report.errors.push('console: '+m.text())});
  page.on('requestfailed',r=>{if(!/favicon/i.test(r.url()))report.failedResources.push({url:r.url(),failure:r.failure()?.errorText||'unknown'})});
  page.on('response',r=>{if(r.status()>=400&&!/favicon/i.test(r.url()))report.failedResources.push({url:r.url(),status:r.status()})});

  const res=await page.goto(url+'?qa='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
  check('Cloudflare page HTTP',!!res&&res.ok(),res?.status());
  check('correct page title',(await page.title()).includes('Eumel 2.5D World-Space Proof'),await page.title());

  await page.waitForFunction(()=>window.__KFB_EUMEL_2P5D_READY__||window.__KFB_EUMEL_2P5D_ERROR__,{}, {timeout:120000});
  const bootError=await page.evaluate(()=>window.__KFB_EUMEL_2P5D_ERROR__||null);
  check('three2p5d runtime boot',!bootError,bootError);

  const initial=await page.evaluate(()=>window.__KFB_EUMEL_2P5D__.snapshot());
  report.initial=initial;
  check('canvas is real render surface',initial.canvas.width>500&&initial.canvas.height>400,initial.canvas);
  check('world height contract',close(initial.worldHeight,2,1e-4),initial.worldHeight);
  check('eye frame exists',initial.eyeRadius>0,initial.eyeRadius);

  // Neutral baseline.
  await page.evaluate(()=>window.__KFB_EUMEL_2P5D__.setState('neutral'));
  await page.waitForTimeout(120);
  const neutral=await page.evaluate(()=>window.__KFB_EUMEL_2P5D__.snapshot());
  report.neutral=neutral;

  // Hip anchors must not translate while local walk swings.
  await page.evaluate(()=>window.__KFB_EUMEL_2P5D__.setState('walk'));
  await page.waitForFunction(({a,b})=>{
    const s=window.__KFB_EUMEL_2P5D__.snapshot();
    return Math.abs(s.diagnostics.legA.rotation-a)>.08||Math.abs(s.diagnostics.legB.rotation-b)>.08;
  },{a:neutral.diagnostics.legA.rotation,b:neutral.diagnostics.legB.rotation},{timeout:3000});
  const walk=await page.evaluate(()=>window.__KFB_EUMEL_2P5D__.snapshot());
  report.walk=walk;
  const hipStable=
    close(walk.diagnostics.legA.pivot.x,neutral.diagnostics.legA.pivot.x)&&
    close(walk.diagnostics.legA.pivot.y,neutral.diagnostics.legA.pivot.y)&&
    close(walk.diagnostics.legB.pivot.x,neutral.diagnostics.legB.pivot.x)&&
    close(walk.diagnostics.legB.pivot.y,neutral.diagnostics.legB.pivot.y);
  check('walk keeps both hip pivots attached',hipStable,{neutral:{a:neutral.diagnostics.legA.pivot,b:neutral.diagnostics.legB.pivot},walk:{a:walk.diagnostics.legA.pivot,b:walk.diagnostics.legB.pivot}});
  check('walk visibly swings legs',Math.abs(walk.diagnostics.legA.rotation-neutral.diagnostics.legA.rotation)>.04||Math.abs(walk.diagnostics.legB.rotation-neutral.diagnostics.legB.rotation)>.04,{neutral:[neutral.diagnostics.legA.rotation,neutral.diagnostics.legB.rotation],walk:[walk.diagnostics.legA.rotation,walk.diagnostics.legB.rotation]});

  // Hop must affect local presentation only.
  await page.evaluate(()=>window.__KFB_EUMEL_2P5D__.setState('hop'));
  await page.waitForFunction(y=>window.__KFB_EUMEL_2P5D__.snapshot().diagnostics.actor.y>y+.07,neutral.diagnostics.actor.y,{timeout:3000});
  const hop=await page.evaluate(()=>window.__KFB_EUMEL_2P5D__.snapshot());
  report.hop=hop;
  check('hop produces local vertical acting',hop.diagnostics.actor.y>neutral.diagnostics.actor.y+.07,{neutral:neutral.diagnostics.actor.y,hop:hop.diagnostics.actor.y});

  // Facing policy: fixed world-facing is zero yaw; billboard follows the camera in yaw only.
  await page.evaluate(()=>window.__KFB_EUMEL_2P5D__.setFacing('world-facing-upright'));
  await page.waitForTimeout(120);
  const fixed=await page.evaluate(()=>window.__KFB_EUMEL_2P5D__.snapshot());
  check('world-facing mode holds zero actor yaw',Math.abs(fixed.diagnostics.rootYaw)<.001,fixed.diagnostics.rootYaw);
  await page.evaluate(()=>window.__KFB_EUMEL_2P5D__.setFacing('upright-yaw-billboard'));
  await page.waitForTimeout(120);
  const billboard=await page.evaluate(()=>window.__KFB_EUMEL_2P5D__.snapshot());
  check('yaw billboard responds to camera',Math.abs(billboard.diagnostics.rootYaw)>.2,billboard.diagnostics.rootYaw);

  // Blink must keep pupil vertically within the closing eye fallback.
  await page.evaluate(()=>{window.__KFB_EUMEL_2P5D__.setState('neutral');window.__KFB_EUMEL_2P5D__.blink()});
  await page.waitForFunction(()=>window.__KFB_EUMEL_2P5D__.snapshot().diagnostics.eyeA.sy<.5,{}, {timeout:1200});
  const blinkClosed=await page.evaluate(()=>window.__KFB_EUMEL_2P5D__.snapshot());
  report.blinkClosed=blinkClosed;
  check('blink closes eye wrapper',blinkClosed.diagnostics.eyeA.sy<.5,blinkClosed.diagnostics.eyeA);
  check('pupil follows blink compression',blinkClosed.diagnostics.eyeA.pupilSy<=blinkClosed.diagnostics.eyeA.sy+.02,blinkClosed.diagnostics.eyeA);
  await page.waitForFunction(()=>window.__KFB_EUMEL_2P5D__.snapshot().diagnostics.eyeA.sy>.92,{}, {timeout:1500});
  check('blink recovers open',true);

  await page.screenshot({path:out+'/eumel-three2p5d.png',fullPage:true});
  check('no failed resources',report.failedResources.length===0,report.failedResources);
  check('no browser console/page errors',report.errors.length===0,report.errors);
  report.status='PASS';
}catch(e){
  report.status='FAIL';
  report.failure=String(e?.stack||e);
  process.exitCode=1;
}finally{
  if(browser)await browser.close();
  fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
}
