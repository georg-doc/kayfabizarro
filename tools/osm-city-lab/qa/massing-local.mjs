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

async function runCase(browser,{city,look,labels=false,nature=false,furniture=false,suffix=''}) {
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  const qs=new URLSearchParams({city,look});
  if(labels)qs.set('labels','1');
  if(nature)qs.set('nature','1');
  if(furniture)qs.set('furniture','1');
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

  if(furniture){
    assert.ok(report.cityFurnitureInstances>0,'city furniture should place exact source-backed props');
    assert.ok(report.cityFurnitureAssets.length>=4,'city furniture should load multiple KayKit donor assets');
    assert.ok(report.cityFurnitureByType.streetlight>0,'streetlights should be present');
    const signals=(report.cityFurnitureByType.trafficlight_A||0)+(report.cityFurnitureByType.trafficlight_B||0)+(report.cityFurnitureByType.trafficlight_C||0);
    assert.ok(report.trafficSignalJunctions>0,'expected topology-selected teaching/demo signal junctions');
    assert.ok(signals>0,'selected signal junctions should render KayKit traffic lights');
    assert.equal(report.trafficPlanStatus,'PROPOSAL_SEAM_NO_RULE_RUNTIME');
  }else{
    assert.equal(report.cityFurnitureInstances,0);
    assert.equal(report.trafficSignalJunctions,0);
  }

  assert.deepEqual(errors,[]);
  const id=[city,look,labels?'labels':null,nature?'nature':null,furniture?'furniture':null,suffix||null].filter(Boolean).join('-');
  await page.screenshot({path:`${OUT}/${id}.png`});
  reports.push({url,report,errors});
  await context.close();
}


async function runSourceProof(browser){
  const manifest=JSON.parse(fs.readFileSync('tools/osm-city-lab/source-proof/city-furniture-r0/SOURCE.json','utf8'));
  const context=await browser.newContext({viewport:{width:1280,height:800}});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  const donorReports=[];
  for(const donor of manifest.donors){
    const url='http://127.0.0.1:4173/tools/osm-city-lab/source-proof/city-furniture-r0/?asset='+encodeURIComponent(donor.id);
    await page.goto(url,{waitUntil:'networkidle',timeout:120000});
    await page.waitForFunction(()=>window.KFBCityFurnitureSourceProof?.report()?.loaded===true,{},{timeout:120000});
    const report=await page.evaluate(()=>window.KFBCityFurnitureSourceProof.report());
    assert.equal(report.id,donor.id);
    assert.equal(report.path,donor.path);
    assert.ok(report.rawBounds.size.every(v=>Number.isFinite(v)&&v>0),'source object must have non-zero raw bounds');
    assert.ok(report.meshNames.length>0,'source object must expose at least one mesh');
    donorReports.push(report);
    await page.screenshot({path:`${OUT}/source-${donor.id}.png`});
  }
  assert.deepEqual(errors,[]);
  reports.push({url:'source-proof',sourceProof:donorReports,errors});
  await context.close();
}

try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const city of Object.keys(expected)){
    for(const look of ['clean','cartoon','grotesque'])await runCase(browser,{city,look});
    await runCase(browser,{city,look:'cartoon',labels:true,suffix:'signs'});
  }
  await runCase(browser,{city:'huerth-v0',look:'cartoon',nature:true,suffix:'forest'});
  await runCase(browser,{city:'ehrenfeld-v0',look:'cartoon',labels:true,furniture:true,suffix:'city-furniture-r0'});
  await runSourceProof(browser);

  fs.writeFileSync(OUT+'/report.json',JSON.stringify({status:'PASS',reports},null,2)+'\n');
  console.log(JSON.stringify({
    status:'PASS',
    cases:reports.map(x=>x.report?({
      city:x.report.cityId,
      look:x.report.look,
      signs:x.report.streetSigns,
      trees:x.report.natureInstances,
      furniture:x.report.cityFurnitureInstances,
      signalJunctions:x.report.trafficSignalJunctions,
      roadJunctions:x.report.roadJunctionPatches,
      paths:x.report.pathMeshes,
      windows:x.report.windowInstances
    }):({sourceProof:x.sourceProof?.length||0}))
  },null,2));
}finally{
  await browser?.close();
  server.close();
}
