import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const URL='http://127.0.0.1:4173/game-container/turbo-kfb/donors/playcanvas-vehicle-physics-01/static/';
const OUT='playcanvas-donor-01-local-proof';
await fs.mkdir(OUT,{recursive:true});

const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1280,height:720}});
const pageErrors=[]; const consoleErrors=[]; const failed=[];
page.on('pageerror',e=>pageErrors.push(String(e)));
page.on('console',m=>{if(m.type()==='error') consoleErrors.push(m.text());});
page.on('requestfailed',r=>failed.push({url:r.url(),failure:r.failure()}));

await page.goto(URL,{waitUntil:'domcontentloaded',timeout:120000});
await page.waitForFunction(()=>{
  try{return Boolean(window.pc?.Application?.getApplication?.()?.root?.findByName?.('Car Physics'));}catch{return false;}
},null,{timeout:120000});
await page.waitForTimeout(2000);

const snap=()=>page.evaluate(()=>{
  const app=window.pc?.Application?.getApplication?.()||null;
  const car=app?.root?.findByName?.('Car Physics')||null;
  const camera=app?.root?.findByName?.('Follow Camera')||null;
  const graphics=app?.root?.findByName?.('Car Graphics')||null;
  const light=app?.root?.findByName?.('Light')||null;
  return {
    title:document.title,
    hasApp:Boolean(app),
    car:car?{pos:[car.getPosition().x,car.getPosition().y,car.getPosition().z],enabled:car.enabled}:null,
    camera:camera?{pos:[camera.getPosition().x,camera.getPosition().y,camera.getPosition().z],enabled:camera.enabled}:null,
    graphics:Boolean(graphics),
    light:Boolean(light)
  };
});
const before=await snap();
await page.screenshot({path:`${OUT}/before.png`,fullPage:true});
await page.keyboard.down('KeyW');
await page.waitForTimeout(1800);
await page.keyboard.up('KeyW');
await page.waitForTimeout(500);
const afterW=await snap();
await page.keyboard.press('KeyR');
await page.waitForTimeout(400);
const afterR=await snap();
await page.screenshot({path:`${OUT}/after-reset.png`,fullPage:true});

const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
const driveDisplacement=dist(before.car.pos,afterW.car.pos);
const resetDistance=dist(before.car.pos,afterR.car.pos);
const report={
  schema:'kfb.playcanvas-donor-01.local-parity/1',
  url:URL,before,afterW,afterR,driveDisplacement,resetDistance,
  pageErrors,consoleErrors,requestFailures:failed
};
await fs.writeFile(`${OUT}/local.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));

const checks=[
  ['title',before.title==='Vehicle Physics'],
  ['app',before.hasApp],
  ['car',Boolean(before.car)],
  ['camera',Boolean(before.camera)],
  ['car graphics',before.graphics],
  ['light',before.light],
  ['W moves',driveDisplacement>0.5],
  ['R reset',resetDistance<1.5],
  ['page errors',pageErrors.length===0],
  ['console errors',consoleErrors.length===0],
  ['request failures',failed.length===0]
];
for(const [name,ok] of checks) if(!ok) throw new Error(name+' failed: '+JSON.stringify(report));
console.log('CHECKS '+checks.length+'/'+checks.length+' PASS');
await browser.close();
