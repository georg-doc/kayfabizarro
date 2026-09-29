import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const URL='https://playcanv.as/apps/BfRjx709/index.html';
const OUT='playcanvas-donor-01-probe';
await fs.mkdir(OUT,{recursive:true});

const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1280,height:720}});
const responses=[];
const pageErrors=[];
const consoleErrors=[];
page.on('response',r=>{
  const u=r.url();
  responses.push({url:u,status:r.status(),contentType:r.headers()['content-type']||''});
});
page.on('pageerror',e=>pageErrors.push(String(e)));
page.on('console',m=>{if(m.type()==='error') consoleErrors.push(m.text());});

await page.goto(URL,{waitUntil:'domcontentloaded',timeout:120000});
await page.waitForFunction(() => {
  try {
    const app=window.pc?.Application?.getApplication?.();
    return Boolean(app?.root?.findByName?.('Car Physics'));
  } catch { return false; }
}, null, {timeout:120000});
await page.waitForTimeout(2000);

const snap=()=>page.evaluate(()=>{
  const canvas=document.querySelector('canvas');
  const app=window.pc?.Application?.getApplication?.()||null;
  const car=app?.root?.findByName?.('Car Physics')||null;
  const camera=app?.root?.findByName?.('Follow Camera')||null;
  return {
    title:document.title,
    canvas:Boolean(canvas),
    canvasSize:canvas?{width:canvas.width,height:canvas.height}:null,
    hasPc:Boolean(window.pc),
    hasApp:Boolean(app),
    car:car?{pos:[car.getPosition().x,car.getPosition().y,car.getPosition().z],rot:[car.getEulerAngles().x,car.getEulerAngles().y,car.getEulerAngles().z]}:null,
    camera:camera?{pos:[camera.getPosition().x,camera.getPosition().y,camera.getPosition().z]}:null
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
const driveDisplacement=before.car&&afterW.car?dist(before.car.pos,afterW.car.pos):0;
const resetDistance=before.car&&afterR.car?dist(before.car.pos,afterR.car.pos):Infinity;

const uniq=[]; const seen=new Set();
for(const x of responses){if(!seen.has(x.url)){seen.add(x.url);uniq.push(x);}}
const sameOrigin=uniq.filter(x=>x.url.startsWith('https://playcanv.as/apps/BfRjx709/'));

const report={
  schema:'kfb.playcanvas-donor-01.probe/2',
  url:URL,
  before,
  afterW,
  afterR,
  driveDisplacement,
  resetDistance,
  pageErrors,
  consoleErrors,
  responseCount:uniq.length,
  sameOriginCount:sameOrigin.length,
  responses:uniq
};
await fs.writeFile(`${OUT}/probe.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));

if(!before.canvas||!before.car||!before.camera) throw new Error('Donor scene did not boot expected source objects');
if(!(driveDisplacement>0.5)) throw new Error('W did not move donor vehicle: '+driveDisplacement);
if(pageErrors.length) throw new Error('Page errors: '+pageErrors.join(' | '));
await browser.close();
