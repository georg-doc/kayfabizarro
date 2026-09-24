import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const ROOT=process.cwd();
const OUT='osm-elastic-grotesque-clay-huerth01-evidence';
fs.mkdirSync(OUT,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=http.createServer((req,res)=>{
  try{
    const u=new URL(req.url,'http://127.0.0.1'),pathname=decodeURIComponent(u.pathname);
    const file=path.resolve(ROOT,'.'+pathname);
    if(!file.startsWith(ROOT)){res.writeHead(403);res.end('forbidden');return;}
    res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
    fs.createReadStream(file).on('error',()=>{res.writeHead(404);res.end('not found');}).pipe(res);
  }catch{res.writeHead(404);res.end('not found');}
});
await new Promise(r=>server.listen(4175,'127.0.0.1',r));

let browser;
const errors=[],extraRequests=[];
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1536,height:900}});
  const url='http://127.0.0.1:4175/tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/HUERTH01_V2_PORTABLE.html';
  page.on('pageerror',e=>errors.push('pageerror: '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text());});
  page.on('request',r=>{if(r.url()!==url)extraRequests.push(r.url());});
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>window.__KFB_ELASTIC_HUERTH01__?.report,{},{timeout:20000});

  let report=await page.evaluate(()=>window.__KFB_ELASTIC_HUERTH01__.report());
  assert.equal(report.schema,'kfb.elastic-grotesque-clay.huerth01/0.2-candidate');
  assert.equal(report.sourceCity,'huerth-v0');
  assert.equal(report.sourceBuildings,22);
  assert.ok(report.sourceRoadParts>0);
  assert.deepEqual(report.modes,['clean','grotesque','elastic']);
  assert.equal(report.currentGrotesqueDonor,'src/style/cartoon-city.js');
  assert.equal(report.elasticCollisionMutation,false);
  assert.equal(report.elasticStyleVersion,'ELASTIC_GROUP_WARP_V2');
  assert.equal(report.elasticGroupWarp,'COHERENT_LOW_FREQUENCY_FIELD');
  assert.equal(report.elasticDetails,'IRREGULAR_2_3_WINDOWS_NO_FRAME_PLUS_ONE_DOOR');
  assert.equal(report.elasticRoadSurface,'CONTINUOUS_CATMULL_ROM_RIBBON');
  assert.equal(report.elasticPalette,'KFB_WONKY_90S_CLAY_V1');
  assert.equal(report.humanAcceptance,'PENDING');
  assert.deepEqual(report.visibleCounts,{clean:22,grotesque:22,elastic:22});
  assert.ok(Object.values(report.webgl2).every(Boolean),'all three canvases must boot WebGL2');
  assert.deepEqual(errors,[]);
  assert.deepEqual(extraRequests,[],'portable review must make zero secondary network requests');

  const first=await page.locator('#building option').nth(1).getAttribute('value');
  assert.ok(first?.startsWith('way/'));
  await page.selectOption('#building',first);
  await page.click('#isolate');
  await page.waitForTimeout(200);
  report=await page.evaluate(()=>window.__KFB_ELASTIC_HUERTH01__.report());
  assert.equal(report.selectedId,first);
  assert.equal(report.isolated,true);
  assert.deepEqual(report.visibleCounts,{clean:1,grotesque:1,elastic:1});
  assert.deepEqual(errors,[]);
  assert.deepEqual(extraRequests,[]);

  await page.click('#isolate');
  report=await page.evaluate(()=>window.__KFB_ELASTIC_HUERTH01__.report());
  assert.equal(report.isolated,false);
  assert.deepEqual(report.visibleCounts,{clean:22,grotesque:22,elastic:22});

  const result={status:'PASS',checks:23,url,report,errors,extraRequests,isolatedSource:first,transport:'EXACT_V2_INLINE_BUNDLE'};
  fs.writeFileSync(OUT+'/portable-report.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
}finally{
  await browser?.close();
  server.close();
}
