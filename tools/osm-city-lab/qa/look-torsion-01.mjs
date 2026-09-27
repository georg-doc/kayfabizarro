import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const ROOT=process.cwd();
const OUT='look-torsion-01-evidence';
fs.mkdirSync(OUT,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=http.createServer((req,res)=>{
  try{
    const u=new URL(req.url,'http://127.0.0.1');
    const pathname=decodeURIComponent(u.pathname.endsWith('/')?u.pathname+'index.html':u.pathname);
    const file=path.resolve(ROOT,'.'+pathname);
    if(!file.startsWith(ROOT)){res.writeHead(403);res.end('forbidden');return;}
    res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
    fs.createReadStream(file).on('error',()=>{if(!res.headersSent)res.writeHead(404);res.end('not found');}).pipe(res);
  }catch{res.writeHead(404);res.end('not found');}
});
await new Promise(r=>server.listen(4177,'127.0.0.1',r));

let browser;
const errors=[];
let checks=0;
const eq=(a,b,msg)=>{assert.equal(a,b,msg);checks++;};
const ok=(a,msg)=>{assert.ok(a,msg);checks++;};
const deep=(a,b,msg)=>{assert.deepEqual(a,b,msg);checks++;};

try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1536,height:900}});
  page.on('pageerror',e=>errors.push('pageerror: '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text());});
  const url='http://127.0.0.1:4177/tools/osm-city-lab/experiments/look-torsion-01/';
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>window.__KFB_LOOK_TORSION_01__?.report,{},{timeout:30000});
  await page.waitForTimeout(600);

  let r=await page.evaluate(()=>window.__KFB_LOOK_TORSION_01__.report());
  eq(r.schema,'kfb.look-torsion-01/1.0-candidate','schema');
  eq(r.owner,'OSM City Lab presentation / KFB ToolBox authoring','owner');
  eq(r.source.osm,'way/4532022','source OSM');
  eq(r.source.heightM,157.38,'source height');
  eq(r.source.geometryExactInA,true,'A exact donor geometry');
  eq(r.source.materialTreatment,'NEUTRAL_REVIEW_OVERRIDE_ONLY','neutral review material only');
  deep(r.panels,['SOURCE','CURRENT_ELASTIC_IDEA','ELASTIC_PLUS_TORSION'],'A/B/C order');
  eq(r.sameSourceObjectFamily,true,'same source family');
  eq(r.profiles.bTwistDeg,0,'B holds twist at zero');
  eq(r.profiles.lowBuildingReferenceDeg,2.6,'low building reference');
  eq(r.profiles.cHeroDefaultDeg,9.5,'hero default');
  eq(r.profiles.cityGrotesqueStrongReferenceDeg,11,'City GROTESQUE reference');
  eq(r.profiles.currentLandmarkEvidenceDeg,13.2,'Landmark evidence reference');
  eq(r.profiles.activeCTwistDeg,9.5,'C starts below 11 degree donor');
  eq(r.deformation.heightDependent,true,'height dependent');
  eq(r.deformation.cumulativeTwist,true,'cumulative twist');
  eq(r.deformation.bendLeanTaper,true,'bend lean taper retained');
  eq(r.deformation.sharedRoofBodyFinalField,true,'roof/body same final field');
  eq(r.deformation.field,'cartoon-city.js#deformPoint:GLOBAL_LANDMARK_ROOT_V1','field id');
  ok(r.segmentation.elastic.replacedMeshes>0,'B tessellates donor meshes');
  ok(r.segmentation.elastic.maxHeightSegments>=20,'enough vertical segmentation');
  ok(r.segmentation.torsion.maxHeightSegments>=20,'C enough vertical segmentation');
  ok(r.anchors.elasticBaseErrorM<1e-9,'B base anchored');
  ok(r.anchors.torsionBaseErrorM<1e-9,'C base anchored');
  ok(r.geometry.roofMeshesInTorsionField>0,'roof meshes use field');
  ok(r.geometry.bodyMeshesInTorsionField>0,'body meshes use field');
  eq(r.review.neutralSimpleLighting,true,'neutral lighting');
  eq(r.review.shadows,false,'shadows off');
  eq(r.review.cameraSkew,false,'skew off initially');
  eq(r.review.cameraSkewIsPresentationOnly,true,'skew presentation only');
  ok(Object.values(r.webgl2).every(Boolean),'all three canvases WebGL2');
  eq(r.protected.huerthR2Edited,false,'Hürth R2 untouched');
  eq(r.protected.huerthR2RuntimeImported,false,'Hürth R2 runtime not imported');
  deep(errors,[],'no page/console errors');

  await page.screenshot({path:OUT+'/01-abc-neutral-hero.png',fullPage:true});

  await page.click('[data-torsion="2.6"]');
  await page.waitForTimeout(150);
  r=await page.evaluate(()=>window.__KFB_LOOK_TORSION_01__.report());
  eq(r.profiles.activeCTwistDeg,2.6,'low-building range selectable');
  ok(r.anchors.torsionBaseErrorM<1e-9,'low range stays anchored');
  await page.screenshot({path:OUT+'/02-c-low-building-range.png',fullPage:true});

  await page.click('[data-torsion="11"]');
  await page.waitForTimeout(150);
  r=await page.evaluate(()=>window.__KFB_LOOK_TORSION_01__.report());
  eq(r.profiles.activeCTwistDeg,11,'City reference selectable');
  const revBeforeSkew=r.review.geometryRevision;
  await page.click('#skew');
  await page.waitForTimeout(100);
  r=await page.evaluate(()=>window.__KFB_LOOK_TORSION_01__.report());
  eq(r.review.cameraSkew,true,'camera skew toggles');
  eq(r.review.geometryRevision,revBeforeSkew,'camera skew does not change geometry');
  eq(r.profiles.activeCTwistDeg,11,'geometry torsion unchanged by skew');
  deep(errors,[],'no errors after interaction');

  const result={status:'PASS',checks,url,report:r,errors,screenshots:['01-abc-neutral-hero.png','02-c-low-building-range.png']};
  fs.writeFileSync(OUT+'/report.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
}finally{
  await browser?.close();
  server.close();
}
