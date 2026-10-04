import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const URL='https://kayfabizarro.pages.dev/kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/';
const TESTED='aa28a743628699271c94c1911af23d0564c6f3cc';
const BUILD='KFB-TS-OSM-INTEGRATED-V1-20260919';
const OUT='tinyskies-osm-stage-evidence';
const checks=[];
const errors=[];
const failed=[];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function pass(name,cond,detail=''){checks.push({name,pass:!!cond,detail});if(!cond)throw Error('FAIL '+name+' '+detail);console.log('PASS',name,detail);}

async function marker(){
  try{
    const r=await fetch(URL+'SOURCE.json?ts='+Date.now(),{cache:'no-store'});
    const j=r.ok?await r.json():null;
    return {ok:r.ok&&j?.testedRuntimeHead===TESTED&&j?.stageBuild===BUILD,status:r.status,head:j?.testedRuntimeHead,build:j?.stageBuild};
  }catch(e){return {ok:false,status:0,error:String(e)}}
}
let last;
for(let i=0;i<180;i++){
  last=await marker();
  if(last.ok){console.log('DEPLOYED',URL,TESTED);break;}
  if(i===179)throw Error('Cloudflare marker timeout '+JSON.stringify(last));
  await sleep(3000);
}

await fs.mkdir(OUT,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
try{
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push('pageerror '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const response=await page.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
  pass('HTTP',response?.ok()===true,'status='+response?.status());
  await page.waitForFunction(()=>window.__KFB_TINYSKIES_OSM_PROOF__?.ready===true,null,{timeout:120000});
  let state=await page.evaluate(()=>window.__KFB_TINYSKIES_OSM_PROOF__);
  pass('build marker',state.build===BUILD,state.build);
  pass('default integrated',state.mode==='integrated',state.mode);
  pass('default OSM light',state.lightMode==='osm',state.lightMode);
  pass('OSM subset real',state.osm?.buildings===90&&state.osm?.triangles===9459,JSON.stringify(state.osm));
  pass('Dom exact',state.dom?.triangles===1050&&state.dom?.shapeMode==='city-grotesque',JSON.stringify(state.dom));
  pass('no geo claim',state.dom?.placement==='STYLE_INTEGRATION_ONLY_NOT_GEO',state.dom?.placement);
  pass('weather material baseline',state.weather?.materialWetness===false&&state.weather?.materialAlbedoShift===false,JSON.stringify(state.weather));

  // Donor source objects are captured in isolation before the integrated evidence.
  await page.selectOption('#mode','lighthouse');await page.waitForTimeout(500);
  state=await page.evaluate(()=>window.__KFB_TINYSKIES_OSM_PROOF__);
  pass('lighthouse isolation',state.mode==='lighthouse',state.mode);
  await page.screenshot({path:OUT+'/01-source-lighthouse.png',fullPage:true});

  await page.selectOption('#mode','observatory');await page.waitForTimeout(500);
  state=await page.evaluate(()=>window.__KFB_TINYSKIES_OSM_PROOF__);
  pass('observatory isolation',state.mode==='observatory',state.mode);
  await page.screenshot({path:OUT+'/02-source-observatory.png',fullPage:true});

  await page.selectOption('#mode','integrated');await page.selectOption('#light','osm');await page.waitForTimeout(700);
  state=await page.evaluate(()=>window.__KFB_TINYSKIES_OSM_PROOF__);
  pass('integrated OSM',state.mode==='integrated'&&state.lightMode==='osm',JSON.stringify({mode:state.mode,light:state.lightMode}));
  await page.screenshot({path:OUT+'/03-integrated-osm.png',fullPage:true});

  await page.selectOption('#light','evening');await page.waitForTimeout(800);
  state=await page.evaluate(()=>window.__KFB_TINYSKIES_OSM_PROOF__);
  pass('Evening switch',state.lightMode==='evening',state.lightMode);
  await page.screenshot({path:OUT+'/04-integrated-evening.png',fullPage:true});

  await page.check('#rain');await page.waitForTimeout(700);
  state=await page.evaluate(()=>window.__KFB_TINYSKIES_OSM_PROOF__);
  pass('Rain switch',state.rainWeight===1,String(state.rainWeight));
  pass('Rain keeps dry material baseline',state.weather.materialWetness===false&&state.weather.materialAlbedoShift===false);
  await page.screenshot({path:OUT+'/05-integrated-rain.png',fullPage:true});

  pass('no failed resources',failed.length===0,JSON.stringify(failed));
  pass('no page/console errors',errors.length===0,JSON.stringify(errors));
  await fs.writeFile(OUT+'/public-browser.json',JSON.stringify({url:URL,testedRuntimeHead:TESTED,build:BUILD,checks,errors,failed,state},null,2)+'\n');
  console.log('PUBLIC_BROWSER_RESULT',checks.length+'/'+checks.length,'PASS');
  await page.close();
} finally { await browser.close(); }
