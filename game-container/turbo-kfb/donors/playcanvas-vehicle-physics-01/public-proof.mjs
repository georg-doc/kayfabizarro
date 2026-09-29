import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const ROUTE='https://kayfabizarro.pages.dev/kfb-hub/stage/playcanvas-donor-01/';
const MARKER=ROUTE+'SOURCE.json';
const HUB='https://kayfabizarro.pages.dev/kfb-hub/stage/hub-ui-v2/';
const OUT='playcanvas-donor-01-public-proof';
await fs.mkdir(OUT,{recursive:true});

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let marker=null,lastBody='',lastStatus=0;
for(let i=0;i<90;i++){
  try{
    const r=await fetch(MARKER,{cache:'no-store'});
    lastStatus=r.status; lastBody=await r.text();
    if(r.ok){
      const j=JSON.parse(lastBody);
      if(j?.status==='DONOR_PARITY_CANDIDATE'&&j?.userForkProject===1609943){
        marker=j; break;
      }
    }
  }catch{}
  await sleep(2000);
}
if(!marker) throw new Error(`public marker not current: HTTP ${lastStatus} body=${lastBody.slice(0,240)}`);

const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1280,height:720}});
const pageErrors=[],consoleErrors=[],failed=[];
page.on('pageerror',e=>pageErrors.push(String(e)));
page.on('console',m=>{if(m.type()==='error') consoleErrors.push(m.text());});
page.on('requestfailed',r=>failed.push({url:r.url(),failure:r.failure()}));

await page.goto(ROUTE,{waitUntil:'domcontentloaded',timeout:120000});
await page.waitForFunction(()=>{
  try{return Boolean(window.pc?.Application?.getApplication?.()?.root?.findByName?.('Car Physics'));}catch{return false;}
},null,{timeout:120000});
await page.waitForTimeout(1800);

const snap=()=>page.evaluate(()=>{
  const app=window.pc?.Application?.getApplication?.()||null;
  const car=app?.root?.findByName?.('Car Physics')||null;
  const camera=app?.root?.findByName?.('Follow Camera')||null;
  const graphics=app?.root?.findByName?.('Car Graphics')||null;
  return {
    title:document.title,
    car:car?{pos:[car.getPosition().x,car.getPosition().y,car.getPosition().z]}:null,
    camera:Boolean(camera),
    graphics:Boolean(graphics)
  };
});
const before=await snap();
await page.keyboard.down('KeyW');
await page.waitForTimeout(1800);
await page.keyboard.up('KeyW');
await page.waitForTimeout(400);
const afterW=await snap();
await page.keyboard.press('KeyR');
await page.waitForTimeout(350);
const afterR=await snap();
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
const driveDisplacement=dist(before.car.pos,afterW.car.pos);
const resetDistance=dist(before.car.pos,afterR.car.pos);
await page.screenshot({path:`${OUT}/stage.png`,fullPage:true});

const hubText=await (await fetch(HUB,{cache:'no-store'})).text();
const hubCard=hubText.includes("id:'playcanvas-donor-01'")&&hubText.includes("url:'/kfb-hub/stage/playcanvas-donor-01/'");

const checks=[
  ['marker',Boolean(marker)],
  ['title',before.title==='Vehicle Physics'],
  ['car',Boolean(before.car)],
  ['camera',before.camera],
  ['graphics',before.graphics],
  ['W moves',driveDisplacement>0.5],
  ['R reset',resetDistance<1.5],
  ['hub card',hubCard],
  ['page errors',pageErrors.length===0],
  ['console errors',consoleErrors.length===0],
  ['request failures',failed.length===0]
];
const report={schema:'kfb.playcanvas-donor-01.public-proof/1',route:ROUTE,marker,before,afterW,afterR,driveDisplacement,resetDistance,hubCard,pageErrors,consoleErrors,requestFailures:failed,checks};
await fs.writeFile(`${OUT}/public.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
for(const [name,ok] of checks) if(!ok) throw new Error(name+' failed');
console.log('CHECKS '+checks.length+'/'+checks.length+' PASS');
await browser.close();
