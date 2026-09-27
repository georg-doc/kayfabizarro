import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const STAGE='https://kayfabizarro.pages.dev/kfb-hub/stage/look-torsion-01/';
const HUB='https://kayfabizarro.pages.dev/kfb-hub/stage/';
const OUT='look-torsion-01-public-evidence';
fs.mkdirSync(OUT,{recursive:true});

let browser;
let checks=0;
const errors=[];
const ok=(v,m)=>{assert.ok(v,m);checks++;};
const eq=(a,b,m)=>{assert.equal(a,b,m);checks++;};

async function gotoWithDeployRetry(page,url){
  let last;
  for(let attempt=1;attempt<=24;attempt++){
    try{
      const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
      if(response && response.ok()) return {response,attempt};
      last=new Error('HTTP '+(response?.status?.() ?? 'no response'));
    }catch(e){ last=e; }
    await page.waitForTimeout(5000);
  }
  throw last || new Error('public route did not become reachable');
}

try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1536,height:900}});
  page.on('pageerror',e=>errors.push('pageerror: '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text());});

  const stageNav=await gotoWithDeployRetry(page,STAGE);
  ok(stageNav.response.ok(),'Cloudflare Stage HTTP 2xx');
  ok(stageNav.attempt<=24,'Stage became reachable within deployment window');
  eq(await page.title(),'LOOK-TORSION-01 · Elastic Torsion Proof','public title');
  eq((await page.locator('h1').innerText()).trim(),'LOOK-TORSION-01 · ELASTIC TORSION ARCHITECTURE PROOF','public h1');
  ok((await page.locator('body').innerText()).includes('way/23574173'),'public source marker');
  ok((await page.locator('body').innerText()).includes('Hürth R2 remains untouched'),'protected boundary marker');
  await page.waitForFunction(()=>window.__KFB_LOOK_TORSION_01__?.report,{},{timeout:30000});

  let r=await page.evaluate(()=>window.__KFB_LOOK_TORSION_01__.report());
  eq(r.schema,'kfb.look-torsion-01/1.1-candidate','public schema');
  eq(r.source.osm,'way/23574173','public source object');
  eq(r.profiles.activeCTwistDeg,9.5,'public hero default');
  eq(r.review.cameraSkew,false,'camera skew public default OFF');
  ok(Object.values(r.webgl2).every(Boolean),'public A/B/C WebGL2');
  eq(r.protected.huerthR2Edited,false,'public protected boundary');
  await page.screenshot({path:OUT+'/01-public-abc-hero.png',fullPage:true});

  await page.click('[data-torsion="13.2"]');
  await page.waitForTimeout(200);
  r=await page.evaluate(()=>window.__KFB_LOOK_TORSION_01__.report());
  eq(r.profiles.activeCTwistDeg,13.2,'public stronger landmark range selectable');
  ok(r.read.activeTopProbeDisplacementM>4,'public landmark range visibly moves top probe');
  await page.screenshot({path:OUT+'/02-public-landmark-range.png',fullPage:true});

  const hubNav=await gotoWithDeployRetry(page,HUB);
  ok(hubNav.response.ok(),'KFB Hub Stage HTTP 2xx');
  const card=page.locator('[data-stage-id="look-torsion-01"]');
  eq(await card.count(),1,'Hub contains one LOOK-TORSION-01 card');
  ok((await card.innerText()).includes('45/45 browser PASS'),'Hub card test marker');
  const href=await card.locator('a.primary').getAttribute('href');
  eq(href,'./look-torsion-01/','Hub card direct Stage link');
  await page.screenshot({path:OUT+'/03-hub-stage-card.png',fullPage:true});

  eq(errors.length,0,'no public page/console errors');
  const report={status:'PUBLIC_VERIFIED',checks,stage:STAGE,hub:HUB,stageAttempt:stageNav.attempt,errors,screenshots:['01-public-abc-hero.png','02-public-landmark-range.png','03-hub-stage-card.png']};
  fs.writeFileSync(OUT+'/report.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
}finally{
  await browser?.close();
}
