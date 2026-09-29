import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const URL='https://launch.playcanvas.com/2608057?debug=true';
const OUT='playcanvas-donor-01-probe';
await fs.mkdir(OUT,{recursive:true});

const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1280,height:720}});
const responses=[];
const pageErrors=[];
const consoleErrors=[];
page.on('response',r=>{
  const u=r.url();
  const ct=r.headers()['content-type']||'';
  if(/playcanvas|playcanv\.as|cdn|asset|launch/i.test(u)) responses.push({url:u,status:r.status(),contentType:ct});
});
page.on('pageerror',e=>pageErrors.push(String(e)));
page.on('console',m=>{if(m.type()==='error') consoleErrors.push(m.text());});

await page.goto(URL,{waitUntil:'domcontentloaded',timeout:120000});
await page.waitForTimeout(8000);

const before=await page.evaluate(()=>{
  const canvas=document.querySelector('canvas');
  const keys=Object.keys(window).filter(k=>/app|pc|play|scene|engine/i.test(k)).slice(0,80);
  let app=null;
  try { app=window.pc?.Application?.getApplication?.()||null; } catch {}
  let car=null;
  try { car=app?.root?.findByName?.('Car Physics')||null; } catch {}
  return {
    title:document.title,
    href:location.href,
    canvas:Boolean(canvas),
    canvasSize:canvas?{width:canvas.width,height:canvas.height,clientWidth:canvas.clientWidth,clientHeight:canvas.clientHeight}:null,
    bodyText:(document.body?.innerText||'').slice(0,1000),
    windowKeys:keys,
    hasPc:Boolean(window.pc),
    hasApp:Boolean(app),
    car:car?{name:car.name,pos:[car.getPosition().x,car.getPosition().y,car.getPosition().z]}:null
  };
});

await page.screenshot({path:`${OUT}/before.png`,fullPage:true});
await page.keyboard.down('KeyW');
await page.waitForTimeout(1600);
await page.keyboard.up('KeyW');
await page.waitForTimeout(500);

const after=await page.evaluate(()=>{
  let app=null; try { app=window.pc?.Application?.getApplication?.()||null; } catch {}
  let car=null; try { car=app?.root?.findByName?.('Car Physics')||null; } catch {}
  return {
    hasPc:Boolean(window.pc),
    hasApp:Boolean(app),
    car:car?{name:car.name,pos:[car.getPosition().x,car.getPosition().y,car.getPosition().z]}:null
  };
});
await page.screenshot({path:`${OUT}/after-w.png`,fullPage:true});

const unique=[];
const seen=new Set();
for(const x of responses){ if(!seen.has(x.url)){seen.add(x.url);unique.push(x);} }

const report={
  schema:'kfb.playcanvas-donor-01.probe/1',
  url:URL,
  before,
  after,
  pageErrors,
  consoleErrors,
  responseCount:unique.length,
  responses:unique
};
await fs.writeFile(`${OUT}/probe.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(!before.canvas) throw new Error('No PlayCanvas canvas');
if(pageErrors.length) throw new Error('Page errors: '+pageErrors.join(' | '));
await browser.close();
