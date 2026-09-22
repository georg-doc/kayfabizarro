import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.CENSUS_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/toolbox/hybrid-surface-scene-lab-v2/';
const OUT=process.env.CENSUS_OUT||'hybrid-v2-census-evidence';
const checks=[];
const check=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)};

await fs.mkdir(OUT,{recursive:true});
let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const res=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  check('HTTP',res?.ok()===true,'status='+res?.status());
  await page.waitForFunction(()=>window.__KFB_HYBRID_V2__?.ready===true||!!window.__KFB_HYBRID_V2__?.error,null,{timeout:180000});
  const ready=await page.evaluate(()=>({ready:window.__KFB_HYBRID_V2__.ready,error:window.__KFB_HYBRID_V2__.error}));
  check('runtime ready',ready.ready===true,JSON.stringify(ready));

  await page.evaluate(()=>window.__KFB_HYBRID_V2__.resetRenderSubmissions());
  await page.evaluate(()=>{window.__KFB_HYBRID_V2__.setLook('hybrid');window.__KFB_HYBRID_V2__.setView('cast')});
  await page.waitForTimeout(600);

  const ids=['legacy','medium','gothgirl','frizzlebob','large'];
  for(const id of ids){
    await page.evaluate(id=>{window.__KFB_HYBRID_V2__.setIsolatedActor(id);window.__KFB_HYBRID_V2__.setView('actor');window.__KFB_HYBRID_V2__.setLook('hybrid')},id);
    await page.waitForTimeout(450);
  }

  const rows=await page.evaluate(()=>window.__KFB_HYBRID_V2__.materialCensus());
  const decorated=rows.filter(r=>r.decorated);
  const notCompiled=decorated.filter(r=>!r.compiled);
  const unresolved=notCompiled.filter(r=>!['UNUSED_MATERIAL_SLOT','HIDDEN_BY_VISIBILITY_CHAIN','NOT_SUBMITTED_BY_RENDERER'].includes(r.classification));
  const classifications=Object.fromEntries([...new Set(rows.map(r=>r.classification))].map(k=>[k,rows.filter(r=>r.classification===k).length]));

  check('decorated material census non-empty',decorated.length>0,String(decorated.length));
  check('five previously unexplained records identified',notCompiled.length===5,JSON.stringify(notCompiled,null,2));
  check('all five have concrete node/material identity',notCompiled.every(r=>r.actorId&&r.objectPath&&r.materialUuid),JSON.stringify(notCompiled,null,2));
  check('no submitted-without-compile-marker records',rows.filter(r=>r.classification==='SUBMITTED_WITHOUT_COMPILE_MARKER').length===0,JSON.stringify(rows.filter(r=>r.classification==='SUBMITTED_WITHOUT_COMPILE_MARKER'),null,2));
  check('all five classified by draw/render evidence',unresolved.length===0,JSON.stringify(unresolved,null,2));

  for(const row of notCompiled){
    console.log('CENSUS_MISSING',JSON.stringify({
      actorId:row.actorId,nodeName:row.nodeName,objectPath:row.objectPath,
      materialIndex:row.materialIndex,materialCount:row.materialCount,
      materialName:row.materialName,materialUuid:row.materialUuid,
      drawReferenced:row.drawReferenced,submitted:row.submitted,compiled:row.compiled,
      vertexCount:row.vertexCount,groups:row.groups,classification:row.classification
    }));
  }

  await fs.writeFile(OUT+'/material-census.json',JSON.stringify({base:BASE,rows,notCompiled,classifications,checks,failed,errors},null,2));
  await page.evaluate(()=>{window.__KFB_HYBRID_V2__.setView('cast');window.__KFB_HYBRID_V2__.setLook('hybrid')});
  await page.waitForTimeout(250);
  await page.screenshot({path:OUT+'/cast-census.png',fullPage:true});

  check('no failed resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));
  console.log('HYBRID_V2_CENSUS_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
}finally{
  if(browser)await browser.close();
}
