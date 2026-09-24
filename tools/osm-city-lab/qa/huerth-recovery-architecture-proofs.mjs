import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const ROOT=process.cwd();
const OUT='huerth-recovery-architecture-proofs-evidence';
fs.mkdirSync(OUT,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png'};
const server=http.createServer((req,res)=>{
  try{
    const u=new URL(req.url,'http://127.0.0.1'),pathname=decodeURIComponent(u.pathname.endsWith('/')?u.pathname+'index.html':u.pathname);
    const file=path.resolve(ROOT,'.'+pathname);
    if(!file.startsWith(ROOT)){res.writeHead(403);res.end('forbidden');return;}
    if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('not found');return;}
    res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
    fs.createReadStream(file).pipe(res);
  }catch{res.writeHead(404);res.end('not found');}
});
await new Promise(r=>server.listen(4176,'127.0.0.1',r));

let browser;
const errors=[],requestFailures=[];
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1536,height:900}});
  page.on('pageerror',e=>errors.push('pageerror: '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text());});
  page.on('requestfailed',req=>requestFailures.push({url:req.url(),error:req.failure()?.errorText||'unknown'}));
  const url='http://127.0.0.1:4176/tools/osm-city-lab/experiments/huerth-recovery-architecture-proofs/';
  await page.goto(url,{waitUntil:'networkidle',timeout:120000});
  try{
    await page.waitForFunction(()=>window.__KFB_HUERTH_ARCH_PROOFS__?.report,{},{timeout:30000});
  }catch(err){
    const debug={
      url:page.url(),
      title:await page.title(),
      errors,
      requestFailures,
      body:(await page.locator('body').innerText()).slice(0,5000)
    };
    fs.writeFileSync(OUT+'/failure-debug.json',JSON.stringify(debug,null,2)+'\n');
    await page.screenshot({path:OUT+'/failure.png',fullPage:true});
    console.error(JSON.stringify(debug,null,2));
    throw err;
  }

  let report=await page.evaluate(()=>window.__KFB_HUERTH_ARCH_PROOFS__.report());
  assert.equal(report.schema,'kfb.huerth-recovery-architecture-proofs/0.1');
  assert.equal(report.sourceCity,'huerth-v0');
  assert.equal(report.sourceHouse,'way/371401492');
  assert.equal(report.frozenR2,'4cc496e79af80c7f8419ffb14f7f5d8daeb0b679');
  assert.equal(report.r2Modified,false);

  assert.equal(report.road.topologyOwner,'ONE_BUFFER_GEOMETRY');
  assert.equal(report.road.surfaceMeshCount,1);
  assert.equal(report.road.materialGroups,3);
  assert.equal(report.road.patchDiscs,0);
  assert.equal(report.road.overlaySurfaceMeshes,0);
  assert.ok(report.road.partitionError<1e-5,'road+curb must exactly partition outer street');
  assert.ok(report.road.overlapRoadCurb<1e-5,'road/curb overlap must be zero');
  assert.ok(report.road.overlapPathStreet<1e-5,'path/street overlap must be zero');
  assert.equal(report.road.webgl2,true);

  assert.equal(report.house.sourceDonorHead,'0c59e92d9d8688f5a88cd309ae8891dcd174c2fc');
  assert.equal(report.house.sourceDonorBlob,'75c3d794b9341a7074038594b467f91d153486c6');
  assert.equal(report.house.sourceMeshCount,2);
  assert.equal(report.house.candidateMeshCount,1);
  assert.ok(report.house.sharedEaveVertexCount>8,'shared eave ring must have real vertices');
  assert.ok(report.house.overhangM>=.34&&report.house.overhangM<=.58);
  assert.equal(report.house.neutralMaterial,true);
  assert.equal(report.house.shadows,false);
  assert.equal(report.house.webgl2,true);

  assert.deepEqual(report.facade.patterns,['ABA','AAB','ABC','PAIR','BREAK','BALANCE']);
  assert.equal(report.facade.facadeCount,6);
  assert.equal(report.facade.randomIndependentPlacement,false);
  assert.equal(report.facade.blockCadence,'A A B A C B');
  assert.equal(report.facade.hierarchy,'WALL_DOMINANT_ROOF_SECONDARY_DOOR_ACCENT_WINDOWS_SUBORDINATE');
  assert.equal(report.facade.paletteSource,'Racer Cologne makePalette()');
  assert.equal(report.facade.racerPaletteDonor.commit,'cc80f4a1c6c509db9668df79fd53b13cee093a9d');
  assert.equal(report.facade.racerPaletteDonor.blob,'38246785ec2c9089737b2a195673a3ad4c07bdf8');
  assert.equal(report.facade.webgl2,true);
  assert.deepEqual(errors,[]);

  await page.screenshot({path:OUT+'/01-road-topology.png',fullPage:true});
  await page.click('[data-proof="house"]');
  await page.waitForTimeout(200);
  await page.screenshot({path:OUT+'/02-house-shared-eave.png',fullPage:true});
  await page.click('[data-proof="facade"]');
  await page.waitForTimeout(200);
  await page.screenshot({path:OUT+'/03-facade-rhythm.png',fullPage:true});

  await page.selectOption('#paletteSource','story');
  await page.waitForTimeout(100);
  report=await page.evaluate(()=>window.__KFB_HUERTH_ARCH_PROOFS__.report());
  assert.equal(report.facade.paletteSource,'world-context STORY_PALETTES');
  assert.equal(report.facade.paletteScheme,'story-mode');
  await page.screenshot({path:OUT+'/04-facade-story-comic.png',fullPage:true});

  await page.selectOption('#paletteSource','harmonic');
  await page.waitForTimeout(100);
  report=await page.evaluate(()=>window.__KFB_HUERTH_ARCH_PROOFS__.report());
  assert.equal(report.facade.paletteSource,'Racer Cologne makePalette()');
  assert.equal(report.facade.paletteScheme,'triade');
  assert.deepEqual(errors,[]);

  const result={status:'PASS',checks:34,url,report,errors};
  fs.writeFileSync(OUT+'/report.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
}finally{
  await browser?.close();
  server.close();
}
