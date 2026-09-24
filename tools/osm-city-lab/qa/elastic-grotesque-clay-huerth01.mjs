import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const ROOT=process.cwd();
const OUT='osm-elastic-grotesque-clay-huerth01-evidence';
fs.mkdirSync(OUT,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
  try{
    const u=new URL(req.url,'http://127.0.0.1'),pathname=decodeURIComponent(u.pathname.endsWith('/')?u.pathname+'index.html':u.pathname);
    const file=path.resolve(ROOT,'.'+pathname);
    if(!file.startsWith(ROOT)){res.writeHead(403);res.end('forbidden');return;}
    res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
    fs.createReadStream(file).on('error',()=>{res.writeHead(404);res.end('not found');}).pipe(res);
  }catch{res.writeHead(404);res.end('not found');}
});
await new Promise(r=>server.listen(4174,'127.0.0.1',r));

let browser;
const errors=[];
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1536,height:900}});
  page.on('pageerror',e=>errors.push('pageerror: '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text());});
  const url='http://127.0.0.1:4174/tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/';
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
  try{
    await page.waitForFunction(()=>window.__KFB_ELASTIC_HUERTH01__?.report,{},{timeout:12000});
  }catch(err){
    const debug={
      url:page.url(),
      title:await page.title(),
      errors,
      body:(await page.locator('body').innerText()).slice(0,4000)
    };
    fs.writeFileSync(OUT+'/failure-debug.json',JSON.stringify(debug,null,2)+'\n');
    await page.screenshot({path:OUT+'/failure.png',fullPage:true});
    console.error(JSON.stringify(debug,null,2));
    throw err;
  }

  let report=await page.evaluate(()=>window.__KFB_ELASTIC_HUERTH01__.report());
  assert.equal(report.schema,'kfb.elastic-grotesque-clay.huerth01/0.4-r2-candidate');
  assert.equal(report.sourceCity,'huerth-v0');
  assert.equal(report.sourceBuildings,22);
  assert.ok(report.sourceRoadParts>0);
  assert.deepEqual(report.modes,['clean','grotesque','elastic']);
  assert.equal(report.currentGrotesqueDonor,'src/style/cartoon-city.js');
  assert.equal(report.elasticCollisionMutation,false);
  assert.equal(report.elasticStyleVersion,'ELASTIC_GROUP_WARP_V2');
  assert.equal(report.elasticGroupWarp,'COHERENT_LOW_FREQUENCY_FIELD');
  assert.equal(report.defaultView,'elastic');
  assert.deepEqual(report.retainedSwitchViews,['clean','cartoon','grotesque','elastic']);
  assert.equal(report.elasticDetails,'ORGANIC_ALL_VISIBLE_FACADES_FINAL_SURFACE_FRAME');
  assert.ok(report.elasticDetailCount>22,'R2 must place details across multiple facades');
  assert.equal(report.elasticShadow,'4096_TIGHT_FIT_BIAS_0_0002_NORMAL_0_055_ROOF_NO_RECEIVE');
  assert.equal(report.elasticRoadSurface,'CATMULL_RIBBON_OSM_NODE_ASPHALT_PATCH_PLUS_PATH_CONNECTOR');
  assert.ok(report.elasticRoadJunctionPatches>0,'elastic road junction patches must exist');
  assert.ok(report.elasticPathRoadConnectors>0,'path-road connectors must exist at shared OSM nodes');
  assert.equal(report.elasticRoof,'FINAL_TOP_OUTLINE_EAVE_OVERHANG_R2');
  assert.equal(report.elasticPalette,'RACER_COLOGNE_HARMONIC_R2');
  assert.ok(['analog','komplementaer','triade','split','tetrade'].includes(report.elasticPaletteScheme),'Racer Cologne harmony scheme must be used');
  assert.equal(typeof report.elasticPaletteSeed,'number');
  assert.equal(report.elasticPaletteDonor?.repository,'georg-doc/KFB-Stunt-Car-Race');
  assert.equal(report.elasticPaletteDonor?.commit,'cc80f4a1c6c509db9668df79fd53b13cee093a9d');
  assert.equal(report.elasticPaletteDonor?.file,'KFB Cologne Race Option C-3/lab-v9/cologne-palette.v1.js');
  assert.equal(report.elasticPaletteDonor?.blob,'38246785ec2c9089737b2a195673a3ad4c07bdf8');
  assert.equal(report.humanAcceptance,'R2_PENDING_REVIEW');
  assert.deepEqual(report.visibleCounts,{clean:22,grotesque:22,elastic:22});
  assert.ok(Object.values(report.webgl2).every(Boolean),'all three canvases must boot WebGL2');
  assert.deepEqual(errors,[]);
  await page.screenshot({path:OUT+'/01-block-comparison.png',fullPage:true});
  const elasticBox=await page.locator('#elastic').boundingBox();
  if(elasticBox)await page.screenshot({path:OUT+'/01b-elastic-r2-after.png',clip:elasticBox});

  const first=await page.locator('#building option').nth(1).getAttribute('value');
  assert.ok(first?.startsWith('way/'));
  await page.selectOption('#building',first);
  await page.click('#isolate');
  await page.waitForTimeout(250);
  report=await page.evaluate(()=>window.__KFB_ELASTIC_HUERTH01__.report());
  assert.equal(report.selectedId,first);
  assert.equal(report.isolated,true);
  assert.deepEqual(report.visibleCounts,{clean:1,grotesque:1,elastic:1});
  assert.deepEqual(errors,[]);
  await page.screenshot({path:OUT+'/02-isolated-source-comparison.png',fullPage:true});

  await page.click('#isolate');
  report=await page.evaluate(()=>window.__KFB_ELASTIC_HUERTH01__.report());
  assert.equal(report.isolated,false);
  assert.deepEqual(report.visibleCounts,{clean:22,grotesque:22,elastic:22});

  for(const look of ['clean','cartoon','grotesque']){
    const legacy=await page.evaluate(async look=>{
      const u='/tools/osm-city-lab/?city=huerth-v0&look='+look;
      const f=document.createElement('iframe');f.style.display='none';f.src=u;document.body.appendChild(f);
      await new Promise((resolve,reject)=>{
        const timeout=setTimeout(()=>reject(new Error('legacy view timeout '+look)),20000);
        f.onload=()=>{clearTimeout(timeout);resolve();};
      });
      const w=f.contentWindow;
      for(let i=0;i<120&&!w.KFBCityLab?.report;i++)await new Promise(r=>setTimeout(r,100));
      const r=w.KFBCityLab?.report?.();
      f.remove();
      return r;
    },look);
    assert.equal(legacy?.look,look,'legacy '+look+' view must still boot unchanged');
  }

  const result={status:'PASS',checks:38,url,report,errors,isolatedSource:first};
  fs.writeFileSync(OUT+'/report.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
}finally{
  await browser?.close();
  server.close();
}
