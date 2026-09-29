import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const URL='http://127.0.0.1:4173/game-container/turbo-kfb/bench/playcanvas-arch-01/';
const OUT='playcanvas-arch-rb01-evidence';
await fs.mkdir(OUT,{recursive:true});

const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1280,height:720}});
const pageErrors=[],consoleErrors=[];
page.on('pageerror',e=>pageErrors.push(String(e)));
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});

const checks=[];
const check=(name,ok,detail='')=>{checks.push({name,ok:Boolean(ok),detail});if(!ok)throw new Error(name+': '+detail);};

await page.goto(URL,{waitUntil:'networkidle',timeout:90000});
await page.waitForFunction(()=>document.documentElement.dataset.pcArchReady==='1',null,{timeout:90000});

const layout=await page.evaluate(()=>{
  const box=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
  return {
    shell:box('.shell'),bench:box('.bench'),canvas:box('#application-canvas'),panel:box('.panel'),
    entitiesVisible:!!document.querySelector('[data-mode="entities"]')?.offsetParent,
    instancedVisible:!!document.querySelector('[data-mode="instanced"]')?.offsetParent,
    count2000Visible:!!document.querySelector('[data-count="2000"]')?.offsetParent
  };
});
check('panel visible',layout.panel.width>=340 && layout.panel.x>800,JSON.stringify(layout.panel));
check('canvas contained by bench',layout.canvas.right<=layout.bench.right+1 && layout.canvas.width<=layout.bench.width+1,JSON.stringify({canvas:layout.canvas,bench:layout.bench}));
check('bench does not cover panel',layout.bench.right<=layout.panel.x+1,JSON.stringify({bench:layout.bench,panel:layout.panel}));
check('controls visible',layout.entitiesVisible&&layout.instancedVisible&&layout.count2000Visible,JSON.stringify(layout));

await page.evaluate(async()=>window.__PC_ARCH_BENCH__.setCase({mode:'instanced',count:2000,shadows:false,pixelRatio:false}));
const caseState=await page.evaluate(()=>({
  status:document.querySelector('#status')?.textContent,
  snapshot:window.__PC_ARCH_BENCH__.snapshot()
}));
check('2000 instanced case builds',caseState.status?.includes('instanced')&&caseState.snapshot.count===2000&&caseState.snapshot.mode==='instanced',JSON.stringify(caseState));
check('no page errors desktop',pageErrors.length===0,pageErrors.join('\n'));
check('no console errors desktop',consoleErrors.length===0,consoleErrors.join('\n'));
await page.screenshot({path:`${OUT}/desktop.png`,fullPage:true});

await page.setViewportSize({width:390,height:844});
await page.waitForTimeout(250);
const mobile=await page.evaluate(()=>{
  const r=document.querySelector('.panel').getBoundingClientRect();
  const b=document.querySelector('.bench').getBoundingClientRect();
  return {panel:{x:r.x,y:r.y,width:r.width,height:r.height},bench:{x:b.x,y:b.y,width:b.width,height:b.height},scrollHeight:document.documentElement.scrollHeight};
});
check('mobile panel stacks below bench',mobile.panel.y>=mobile.bench.height-2 && mobile.panel.width>=380,JSON.stringify(mobile));
await page.screenshot({path:`${OUT}/mobile.png`,fullPage:true});

const report={schema:'kfb.playcanvas-arch-rb01.browser-proof/1',url:URL,checks,pageErrors,consoleErrors,layout,mobile,caseState,totals:{passed:checks.filter(x=>x.ok).length,failed:checks.filter(x=>!x.ok).length}};
await fs.writeFile(`${OUT}/browser.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
