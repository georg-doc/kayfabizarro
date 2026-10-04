import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const ROOT=process.cwd();
const OUT='osm-city-massing-evidence';
fs.mkdirSync(OUT,{recursive:true});

const mime={
  '.html':'text/html; charset=utf-8',
  '.js':'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.gltf':'model/gltf+json',
  '.bin':'application/octet-stream',
  '.css':'text/css; charset=utf-8',
  '.png':'image/png',
  '.jpg':'image/jpeg'
};
const server=http.createServer((req,res)=>{
  try{
    const u=new URL(req.url,'http://127.0.0.1');
    let pathname=decodeURIComponent(u.pathname);
    if(pathname.endsWith('/'))pathname+='index.html';
    const file=path.resolve(ROOT,'.'+pathname);
    if(!file.startsWith(ROOT)){res.writeHead(403);res.end('forbidden');return;}
    const stat=fs.statSync(file);
    if(stat.isDirectory()){res.writeHead(302,{Location:pathname+'/'});res.end();return;}
    res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
    fs.createReadStream(file).pipe(res);
  }catch{
    res.writeHead(404);res.end('not found');
  }
});
await new Promise(r=>server.listen(4173,'127.0.0.1',r));

const expected={
  'ehrenfeld-v0':{roads:372,buildings:1808},
  'huerth-v0':{roads:164,buildings:700}
};
const reports=[];
let browser;

async function runCase(browser,{city,look,labels=false,nature=false,suffix=''}) {
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  const qs=new URLSearchParams({city,look});
  if(labels)qs.set('labels','1');
  if(nature)qs.set('nature','1');
  const url=`http://127.0.0.1:4173/tools/osm-city-lab/?${qs}`;
  await page.goto(url,{waitUntil:'networkidle',timeout:120000});
  await page.waitForFunction(()=>window.KFBCityLab?.report,{},{timeout:120000});
  const report=await page.evaluate(()=>window.KFBCityLab.report());

  assert.equal(report.cityId,city);
  assert.equal(report.look,look);
  assert.equal(report.buildingMeshes,expected[city].buildings);
  assert.equal(report.sourceCounts.roads,expected[city].roads);
  assert.equal(report.roofMeshes,0);
  assert.equal(report.separateRoofCaps,false);
  assert.equal(report.s2GeometryDeformed,false);
  assert.equal(report.movementOwner,'none-viewer-only');
  assert.equal(report.roadStripMode,'joined-miter+osm-node-patches');
  assert.ok(report.roadMeshes>0);
  assert.ok(report.roadJunctionPatches>0,'expected real OSM-node road junction patches');
  assert.ok(report.roadVertices>report.roadMeshes*2);
  assert.ok(report.zLevels.road-report.zLevels.path>=.04,'driveable road/path layer separation too small');
  assert.ok(report.zLevels.path-report.zLevels.sidewalk>=.02,'path/sidewalk separation too small');
  assert.ok(report.zLevels.sidewalk-report.zLevels.landuse>=.04,'sidewalk/landuse separation too small');

  if(look==='clean')assert.equal(report.windowInstances,0);
  else assert.ok(report.windowInstances>0,'deformed mode should emit window material codes');

  if(labels){
    assert.ok(report.streetSigns>0,'street-name signs should exist');
    assert.ok(report.streetSignMinBuildingClearanceM==null||report.streetSignMinBuildingClearanceM>0,'street sign must not be inside a building footprint');
  }else{
    assert.equal(report.streetSigns,0);
  }

  if(nature){
    assert.ok(report.natureInstances>0,'KayKit nature POC should place trees');
    assert.ok(report.natureAssets.length>0,'KayKit nature POC should load GitHub assets');
  }else{
    assert.equal(report.natureInstances,0);
  }

  assert.deepEqual(errors,[]);
  const id=[city,look,labels?'labels':null,nature?'nature':null,suffix||null].filter(Boolean).join('-');
  await page.screenshot({path:`${OUT}/${id}.png`});
  reports.push({url,report,errors});
  await context.close();
}

try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const city of Object.keys(expected)){
    for(const look of ['clean','cartoon','grotesque'])await runCase(browser,{city,look});
    await runCase(browser,{city,look:'cartoon',labels:true,suffix:'signs'});
  }
  await runCase(browser,{city:'huerth-v0',look:'cartoon',nature:true,suffix:'forest'});

  fs.writeFileSync(OUT+'/report.json',JSON.stringify({status:'PASS',reports},null,2)+'\n');
  console.log(JSON.stringify({
    status:'PASS',
    cases:reports.map(x=>({
      city:x.report.cityId,
      look:x.report.look,
      signs:x.report.streetSigns,
      trees:x.report.natureInstances,
      roadJunctions:x.report.roadJunctionPatches,
      paths:x.report.pathMeshes,
      windows:x.report.windowInstances
    }))
  },null,2));
}finally{
  await browser?.close();
  server.close();
}
