import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const BASE=(process.env.WZ_BASE_URL||'http://127.0.0.1:4173/tools/KFB-ToolBox/worldbuilder/world-zone-bake-01/').replace(/\/?$/,'/');
const PAGE_URL=BASE+'WORLD_ZONE_BAKE_01_REVIEW.html';
const OUT=process.env.WZ_PROOF_DIR||'world-zone-review-g3-evidence';

await fs.mkdir(OUT,{recursive:true});

const report={
  schema:'kfb.world-zone.review-g3-browser.v1',
  url:PAGE_URL,
  checks:[],
  errors:[],
  httpErrors:[],
  reloadRequests:[],
  browser:null,
  result:'FAIL'
};
const check=(name,condition,detail='')=>{
  report.checks.push({name,pass:!!condition,detail});
  if(!condition)throw new Error('FAIL · '+name+(detail?' · '+detail:''));
};

let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  report.browser=browser.version();
  const context=await browser.newContext({viewport:{width:1600,height:900}});
  const page=await context.newPage();

  let reloadWindow=false;
  page.on('pageerror',e=>report.errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});
  page.on('response',res=>{
    if(res.status()>=400)report.httpErrors.push({status:res.status(),url:res.url()});
  });
  page.on('request',req=>{
    if(reloadWindow)report.reloadRequests.push(req.url());
  });

  await page.goto(PAGE_URL,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>document.getElementById('status')?.textContent?.startsWith('1 · SOURCE ISOLATION'),null,{timeout:30000});

  check('source isolation status',await page.locator('#status').textContent().then(t=>t.startsWith('1 · SOURCE ISOLATION')));
  check('source counts visible',(await page.locator('#facts').textContent()).includes('6351 buildings · 5236 roads'));
  check('source frame visible',(await page.locator('#facts').textContent()).includes('frame metre · x east · z north'));
  check('baked step unlocked',!(await page.locator('#baked').isDisabled()));
  await page.screenshot({path:OUT+'/01-source-isolation.png',fullPage:true});

  await page.locator('#baked').click();
  await page.waitForFunction(()=>document.getElementById('status')?.textContent?.startsWith('2 · BAKED ZONE'),null,{timeout:30000});
  check('baked GLB status',await page.locator('#status').textContent().then(t=>t.includes('visual.glb only')));
  check('baked GLB bytes',(await page.locator('#facts').textContent()).includes('11,629,496 bytes'));
  check('placed step unlocked',!(await page.locator('#placed').isDisabled()));
  const canvasSignal=await page.locator('#view').evaluate(c=>{
    const gl=c.getContext('webgl2')||c.getContext('webgl');
    return !!gl && gl.drawingBufferWidth>0 && gl.drawingBufferHeight>0 && gl.getError()===0;
  });
  check('WebGL canvas active',canvasSignal);
  await page.screenshot({path:OUT+'/02-baked-zone.png',fullPage:true});

  await page.locator('#placed').click();
  await page.waitForFunction(()=>document.getElementById('status')?.textContent?.startsWith('3 · WORLDBUILDER PLACEMENT'),null,{timeout:30000});
  const placedFacts=await page.locator('#facts').textContent();
  check('WorldBuilder placement status',(await page.locator('#status').textContent()).includes('manifest ref + transform only'));
  check('fixture manifest ref visible',placedFacts.includes('MANIFEST.json'));
  check('fixture transform visible',placedFacts.includes('pos 180, 0, -120'));
  check('reload step unlocked',!(await page.locator('#reload').isDisabled()));
  await page.screenshot({path:OUT+'/03-zone-ref-transform.png',fullPage:true});

  reloadWindow=true;
  await page.locator('#reload').click();
  await page.waitForFunction(()=>document.getElementById('status')?.textContent?.startsWith('4 · RELOAD PASS'),null,{timeout:30000});
  await page.waitForTimeout(400);
  reloadWindow=false;

  const reloadStatus=await page.locator('#status').textContent();
  const reloadFacts=await page.locator('#facts').textContent();
  check('reload pass status',reloadStatus.includes('source recompute 0 · Overpass 0'));
  check('reload manifest + GLB only',reloadFacts.includes('runtime fetches: manifest 1 · glb 1'));
  check('reload source counters zero',reloadFacts.includes('normalized/raw/Overpass: 0/0/0'));

  const after=report.reloadRequests.map(u=>new URL(u).pathname);
  check('reload fetched manifest',after.some(p=>p.endsWith('/MANIFEST.json')),JSON.stringify(after));
  check('reload fetched baked GLB',after.some(p=>p.endsWith('/visual.glb')),JSON.stringify(after));
  check('reload did not fetch normalized',!after.some(p=>p.endsWith('/normalized.json')),JSON.stringify(after));
  check('reload did not fetch raw OSM',!after.some(p=>p.includes('source.overpass')),JSON.stringify(after));
  check('reload did not call Overpass',!report.reloadRequests.some(u=>/overpass-api|overpass\.kumi/i.test(u)),JSON.stringify(report.reloadRequests));

  check('no page or console errors',report.errors.length===0,JSON.stringify(report.errors));
  check('no HTTP errors',report.httpErrors.length===0,JSON.stringify(report.httpErrors));

  await page.screenshot({path:OUT+'/04-reload-pass.png',fullPage:true});
  report.result='PASS';
  report.pass=report.checks.filter(x=>x.pass).length;
  report.fail=report.checks.filter(x=>!x.pass).length;
  await fs.writeFile(OUT+'/report.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
}catch(e){
  report.errors.push(String(e?.stack||e));
  report.pass=report.checks.filter(x=>x.pass).length;
  report.fail=report.checks.filter(x=>!x.pass).length+1;
  await fs.writeFile(OUT+'/report.json',JSON.stringify(report,null,2)+'\n');
  console.error(e);
  process.exitCode=1;
}finally{
  await browser?.close();
}
