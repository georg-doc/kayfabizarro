import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const HOST='http://127.0.0.1:4173/';
const DONOR=HOST+'game-container/turbo-kfb/donors/playcanvas-vehicle-physics-01/static/';
const LOOK=HOST+'kfb-hub/stage/playcanvas-look-01/';
const MARKER=HOST+'kfb-hub/stage/playcanvas-look-01/SOURCE.json';
const OUT='playcanvas-look-01-local-proof';
await fs.mkdir(OUT,{recursive:true});

const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const donorPage=await browser.newPage({viewport:{width:1280,height:720}});
await donorPage.goto(DONOR,{waitUntil:'domcontentloaded',timeout:120000});
await donorPage.waitForFunction(()=>Boolean(window.pc?.Application?.getApplication?.()?.root?.findByName?.('Car Physics')),null,{timeout:120000});
await donorPage.waitForTimeout(1400);
const donorShot=await donorPage.screenshot({path:OUT+'/donor.png',fullPage:true});
await donorPage.close();

const page=await browser.newPage({viewport:{width:1280,height:720}});
const pageErrors=[],consoleErrors=[],failed=[];
page.on('pageerror',e=>pageErrors.push(String(e)));
page.on('console',m=>{if(m.type()==='error') consoleErrors.push(m.text());});
page.on('requestfailed',r=>failed.push({url:r.url(),failure:r.failure()}));
await page.goto(LOOK,{waitUntil:'domcontentloaded',timeout:120000});
await page.waitForFunction(()=>Boolean(window.pc?.Application?.getApplication?.()?.root?.findByName?.('Car Physics')),null,{timeout:120000});
await page.waitForTimeout(1600);

const snap=()=>page.evaluate(()=>{
  const app=window.pc?.Application?.getApplication?.()||null;
  const car=app?.root?.findByName?.('Car Physics')||null;
  const camera=app?.root?.findByName?.('Follow Camera')||null;
  const graphics=app?.root?.findByName?.('Car Graphics')||null;
  const matNames=['bug_body','bug_prop1bonnet','bug_tyre','bug_props2','bug_props1','01 - Default'];
  const mats=Object.fromEntries(matNames.map(name=>{
    const a=app?.assets?.find?.(name,'material');
    const m=a?.resource;
    return [name,m?{
      diffuse:[m.diffuse.r,m.diffuse.g,m.diffuse.b],
      metalness:m.metalness,
      shininess:m.shininess,
      diffuseMap:Boolean(m.diffuseMap),
      normalMap:Boolean(m.normalMap)
    }:null];
  }));
  return {title:document.title,car:car?{pos:[car.getPosition().x,car.getPosition().y,car.getPosition().z]}:null,
    camera:Boolean(camera),graphics:Boolean(graphics),mats};
});
const before=await snap();
const lookShot=await page.screenshot({path:OUT+'/look.png',fullPage:true});
await page.keyboard.down('KeyW'); await page.waitForTimeout(1800); await page.keyboard.up('KeyW'); await page.waitForTimeout(450);
const afterW=await snap();
await page.keyboard.press('KeyR'); await page.waitForTimeout(400);
const afterR=await snap();
await page.screenshot({path:OUT+'/after-reset.png',fullPage:true});
const marker=await (await fetch(MARKER,{cache:'no-store'})).json();
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
const driveDisplacement=dist(before.car.pos,afterW.car.pos);
const resetDistance=dist(before.car.pos,afterR.car.pos);
const shotHash=b=>crypto.createHash('sha256').update(b).digest('hex');
const visualDelta=shotHash(donorShot)!==shotHash(lookShot);
const mats=before.mats;
const matLoaded=Object.values(mats).every(Boolean);
const matte=Object.values(mats).every(m=>m&&Math.abs(m.metalness)<1e-6);
const mapsPreserved=['bug_body','bug_prop1bonnet','bug_tyre','bug_props2','bug_props1','01 - Default']
  .every(n=>mats[n]?.diffuseMap&&mats[n]?.normalMap);

const checks=[
  ['marker',marker?.status==='PC_LOOK_01_CANDIDATE'],
  ['title',before.title==='Vehicle Physics'],
  ['car',Boolean(before.car)],
  ['Follow Camera',before.camera],
  ['Car Graphics',before.graphics],
  ['six material resources loaded',matLoaded],
  ['all six material resources non-metallic',matte],
  ['diffuse + normal maps still loaded',mapsPreserved],
  ['donor/look screenshot differs',visualDelta],
  ['W moves',driveDisplacement>0.5],
  ['R reset',resetDistance<1.5],
  ['page errors',pageErrors.length===0],
  ['console errors',consoleErrors.length===0],
  ['request failures',failed.length===0]
];
const report={schema:'kfb.pc-look-01.browser-proof/1',url:LOOK,marker,before,afterW,afterR,driveDisplacement,resetDistance,
  donorScreenshotSha256:shotHash(donorShot),lookScreenshotSha256:shotHash(lookShot),visualDelta,pageErrors,consoleErrors,requestFailures:failed,checks};
await fs.writeFile(OUT+'/browser.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
for(const [name,ok] of checks) if(!ok) throw new Error(name+' failed');
console.log('BROWSER CHECKS '+checks.length+'/'+checks.length+' PASS');
await browser.close();
