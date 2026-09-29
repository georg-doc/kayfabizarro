import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const ROUTE='https://kayfabizarro.pages.dev/kfb-hub/stage/playcanvas-look-01/';
const DONOR='https://kayfabizarro.pages.dev/kfb-hub/stage/playcanvas-donor-01/';
const MARKER=ROUTE+'SOURCE.json';
const PROFILE=ROUTE+'LOOK_PROFILE.json';
const HUB='https://kayfabizarro.pages.dev/kfb-hub/stage/hub-ui-v2/';
const OUT='playcanvas-look-01-public-proof';
await fs.mkdir(OUT,{recursive:true});

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let marker=null,profile=null,lastStatus=0,lastBody='';
for(let i=0;i<100;i++){
  try{
    const r=await fetch(MARKER,{cache:'no-store'});
    lastStatus=r.status; lastBody=await r.text();
    if(r.ok){
      const j=JSON.parse(lastBody);
      if(j?.status==='PC_LOOK_01_CANDIDATE' &&
         j?.immutableDonor?.head==='732deba269aa49ff987c9f946ffd3568a9bed3bb'){
        marker=j;
        const pr=await fetch(PROFILE,{cache:'no-store'});
        if(pr.ok) profile=await pr.json();
        if(profile?.schema==='kfb.pc-look-01.material-profile/1') break;
      }
    }
  }catch{}
  await sleep(2000);
}
if(!marker||!profile) throw new Error(`public marker/profile not current: HTTP ${lastStatus} body=${lastBody.slice(0,240)}`);

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
await page.goto(ROUTE,{waitUntil:'domcontentloaded',timeout:120000});
await page.waitForFunction(()=>Boolean(window.pc?.Application?.getApplication?.()?.root?.findByName?.('Car Physics')),null,{timeout:120000});
await page.waitForTimeout(1600);

const snap=()=>page.evaluate(()=>{
  const app=window.pc?.Application?.getApplication?.()||null;
  const car=app?.root?.findByName?.('Car Physics')||null;
  const camera=app?.root?.findByName?.('Follow Camera')||null;
  const graphics=app?.root?.findByName?.('Car Graphics')||null;
  const names=['bug_body','bug_prop1bonnet','bug_tyre','bug_props2','bug_props1','01 - Default'];
  const mats=Object.fromEntries(names.map(name=>{
    const a=app?.assets?.find?.(name,'material'),m=a?.resource;
    return [name,m?{metalness:m.metalness,shininess:m.shininess,diffuseMap:Boolean(m.diffuseMap),normalMap:Boolean(m.normalMap)}:null];
  }));
  return {title:document.title,car:car?{pos:[car.getPosition().x,car.getPosition().y,car.getPosition().z]}:null,camera:Boolean(camera),graphics:Boolean(graphics),mats};
});
const before=await snap();
const stageShot=await page.screenshot({path:OUT+'/stage.png',fullPage:true});
await page.keyboard.down('KeyW'); await page.waitForTimeout(1800); await page.keyboard.up('KeyW'); await page.waitForTimeout(450);
const afterW=await snap();
await page.keyboard.press('KeyR'); await page.waitForTimeout(400);
const afterR=await snap();
await page.screenshot({path:OUT+'/after-reset.png',fullPage:true});

const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
const driveDisplacement=dist(before.car.pos,afterW.car.pos);
const resetDistance=dist(before.car.pos,afterR.car.pos);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const donorScreenshotSha256=hash(donorShot),stageScreenshotSha256=hash(stageShot);
const visualDelta=donorScreenshotSha256!==stageScreenshotSha256;
const mats=before.mats;
const matLoaded=Object.values(mats).every(Boolean);
const matte=Object.values(mats).every(m=>m&&Math.abs(m.metalness)<1e-6);
const mapsPreserved=Object.values(mats).every(m=>m&&m.diffuseMap&&m.normalMap);

const hubText=await (await fetch(HUB,{cache:'no-store'})).text();
const hubCard=hubText.includes("id:'playcanvas-look-01'");
const hubLink=hubText.includes("url:'/kfb-hub/stage/playcanvas-look-01/'");

const checks=[
  ['marker',Boolean(marker)],
  ['profile',Boolean(profile)],
  ['title',before.title==='Vehicle Physics'],
  ['car',Boolean(before.car)],
  ['Follow Camera',before.camera],
  ['Car Graphics',before.graphics],
  ['six material resources loaded',matLoaded],
  ['all six materials non-metallic',matte],
  ['original diffuse + normal maps loaded',mapsPreserved],
  ['public donor/look screenshot differs',visualDelta],
  ['W moves',driveDisplacement>0.5],
  ['R reset',resetDistance<1.5],
  ['Hub card',hubCard],
  ['Hub direct Stage link',hubLink],
  ['page errors',pageErrors.length===0],
  ['console errors',consoleErrors.length===0],
  ['request failures',failed.length===0]
];
const report={schema:'kfb.pc-look-01.public-proof/1',route:ROUTE,donor:DONOR,marker,profile,before,afterW,afterR,
  driveDisplacement,resetDistance,donorScreenshotSha256,stageScreenshotSha256,visualDelta,hubCard,hubLink,
  pageErrors,consoleErrors,requestFailures:failed,checks};
await fs.writeFile(OUT+'/public.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
for(const [name,ok] of checks) if(!ok) throw new Error(name+' failed');
console.log('PUBLIC CHECKS '+checks.length+'/'+checks.length+' PASS');
await browser.close();
