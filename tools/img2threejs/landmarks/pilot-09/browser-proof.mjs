import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const URL='http://127.0.0.1:4173/tools/img2threejs/landmarks/pilot-09/';
const OUT='grounding-worldlook-grotesque-v2-evidence';
await fs.mkdir(OUT,{recursive:true});
const checks=[],errors=[],failed=[];
function ok(name,value,detail=''){checks.push({name,pass:!!value,detail});if(!value)throw Error('FAIL '+name+' '+detail);console.log('PASS',name,detail);}
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
try{
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push('pageerror '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text());});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()});});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const response=await page.goto(URL,{waitUntil:'networkidle',timeout:60000});
  ok('HTTP',response?.ok()===true,'status='+response?.status());
  await page.waitForFunction(()=>window.__KFB_GROUND_WORLD_GROTESQUE_V2__?.ready===true,{timeout:45000});
  let s=await page.evaluate(()=>window.__KFB_GROUND_WORLD_GROTESQUE_V2__);
  ok('build',s.build==='KFB-GROUND-WORLD-GROTESQUE-V2-20260920',s.build);
  ok('default city v2',s.cityLook==='v2',s.cityLook);
  ok('default tiny terrain',s.terrainMode==='tiny',s.terrainMode);
  ok('no landmark base',s.grounding.visibleBase===false,JSON.stringify(s.grounding));
  ok('terrain simplex triangles',s.terrain.sineTerrain===false&&s.terrain.surface==='simplex-staggered-triangles',JSON.stringify(s.terrain));
  ok('v2 semantic bands',s.city.v2.semanticFloorBands===true,JSON.stringify(s.city.v2));
  ok('v2 windows',s.city.v2.windows>0,String(s.city.v2.windows));
  ok('v2 doors',s.city.v2.doors>0,String(s.city.v2.doors));
  ok('Dom grounded',s.dom.grounding.visibleBase===false&&Math.abs(s.dom.grounding.targetY)<1e-9,JSON.stringify(s.dom.grounding));
  await page.screenshot({path:path.join(OUT,'01-v2-tiny-harmonic.png'),fullPage:true});

  await page.selectOption('#cityLook','legacy');await page.waitForTimeout(500);
  s=await page.evaluate(()=>window.__KFB_GROUND_WORLD_GROTESQUE_V2__);
  ok('legacy A/B',s.cityLook==='legacy',s.cityLook);
  await page.screenshot({path:path.join(OUT,'02-legacy-card-stack.png'),fullPage:true});

  await page.selectOption('#cityLook','v2');await page.selectOption('#terrainMode','flat');await page.waitForTimeout(500);
  s=await page.evaluate(()=>window.__KFB_GROUND_WORLD_GROTESQUE_V2__);
  ok('flat debug A/B',s.terrainMode==='flat',s.terrainMode);
  await page.screenshot({path:path.join(OUT,'03-v2-flat-debug.png'),fullPage:true});

  await page.selectOption('#terrainMode','tiny');await page.selectOption('#domPalette','identity');await page.waitForTimeout(500);
  s=await page.evaluate(()=>window.__KFB_GROUND_WORLD_GROTESQUE_V2__);
  ok('identity palette A/B',s.paletteMode==='identity',s.paletteMode);
  await page.screenshot({path:path.join(OUT,'04-v2-tiny-identity.png'),fullPage:true});

  ok('no failed resources',failed.length===0,JSON.stringify(failed));
  ok('no page/console errors',errors.length===0,JSON.stringify(errors));
  const result={url:URL,checks,errors,failed,state:s,passed:checks.filter(x=>x.pass).length,total:checks.length};
  await fs.writeFile(path.join(OUT,'browser-result.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({passed:result.passed,total:result.total,errors,failed},null,2));
} finally {await browser.close();}
