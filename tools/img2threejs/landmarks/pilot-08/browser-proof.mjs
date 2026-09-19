import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const URL='http://127.0.0.1:4173/tools/img2threejs/landmarks/pilot-08/';
const OUT='tinyskies-osm-integrated-evidence';
await fs.mkdir(OUT,{recursive:true});
const checks=[];
const errors=[];
function check(name,condition,detail=''){
  checks.push({name,pass:!!condition,detail});
  if(!condition)throw Error('FAIL '+name+' '+detail);
  console.log('PASS',name,detail);
}
const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
const page=await context.newPage();
page.on('pageerror',e=>errors.push('pageerror: '+e.message));
page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text());});
page.on('response',r=>{if(r.status()>=400)errors.push('http '+r.status()+': '+r.url());});

await page.goto(URL,{waitUntil:'networkidle',timeout:60000});
await page.waitForFunction(()=>window.__KFB_TINYSKIES_OSM_PROOF__?.ready===true,{timeout:45000});
let state=await page.evaluate(()=>window.__KFB_TINYSKIES_OSM_PROOF__);
check('build marker',state.build==='KFB-TS-OSM-INTEGRATED-V1-20260919',state.build);
check('default integrated',state.mode==='integrated',state.mode);
check('default OSM light',state.lightMode==='osm',state.lightMode);
check('real OSM buildings',state.osm?.buildings>20,String(state.osm?.buildings));
check('OSM triangles',state.osm?.triangles>1000,String(state.osm?.triangles));
check('Dom present',state.dom?.triangles>700,String(state.dom?.triangles));
check('Dom grotesque',state.dom?.shapeMode==='city-grotesque',state.dom?.shapeMode);
check('no geo claim',state.dom?.placement==='STYLE_INTEGRATION_ONLY_NOT_GEO',state.dom?.placement);
check('rain wetness false',state.weather?.materialWetness===false);
check('rain albedo false',state.weather?.materialAlbedoShift===false);
check('lighthouse donor ref',state.donorRefs?.lighthouse?.status==='SOURCE_DERIVED_KFB_RECREATION_NOT_COPIED_ASSET');
check('observatory donor ref',state.donorRefs?.observatory?.status==='SOURCE_DERIVED_KFB_RECREATION_NOT_COPIED_ASSET');
await page.selectOption('#mode','lighthouse');
await page.waitForTimeout(500);
state=await page.evaluate(()=>window.__KFB_TINYSKIES_OSM_PROOF__);
check('lighthouse isolation',state.mode==='lighthouse',state.mode);
await page.screenshot({path:path.join(OUT,'01-source-lighthouse.png'),fullPage:true});

await page.selectOption('#mode','observatory');
await page.waitForTimeout(500);
state=await page.evaluate(()=>window.__KFB_TINYSKIES_OSM_PROOF__);
check('observatory isolation',state.mode==='observatory',state.mode);
await page.screenshot({path:path.join(OUT,'02-source-observatory.png'),fullPage:true});

await page.selectOption('#mode','integrated');
await page.selectOption('#light','osm');
await page.waitForTimeout(700);
state=await page.evaluate(()=>window.__KFB_TINYSKIES_OSM_PROOF__);
check('integrated after donor isolation',state.mode==='integrated',state.mode);
await page.screenshot({path:path.join(OUT,'03-integrated-osm.png'),fullPage:true});

await page.selectOption('#light','evening');
await page.waitForTimeout(800);
state=await page.evaluate(()=>window.__KFB_TINYSKIES_OSM_PROOF__);
check('evening switch',state.lightMode==='evening',state.lightMode);
await page.screenshot({path:path.join(OUT,'04-integrated-evening.png'),fullPage:true});

await page.check('#rain');
await page.waitForTimeout(700);
state=await page.evaluate(()=>window.__KFB_TINYSKIES_OSM_PROOF__);
check('rain switch',state.rainWeight===1,String(state.rainWeight));
check('rain still no wetness',state.weather.materialWetness===false);
await page.screenshot({path:path.join(OUT,'05-integrated-rain.png'),fullPage:true});

check('no page/console/http errors',errors.length===0,errors.join('\n'));
const result={url:URL,checks,errors,state,passed:checks.filter(x=>x.pass).length,total:checks.length};
await fs.writeFile(path.join(OUT,'browser-result.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({passed:result.passed,total:result.total,errors},null,2));
await browser.close();
