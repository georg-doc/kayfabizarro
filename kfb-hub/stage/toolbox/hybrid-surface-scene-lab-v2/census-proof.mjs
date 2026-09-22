import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.CENSUS_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/toolbox/hybrid-surface-scene-lab-v2/';
const OUT=process.env.CENSUS_OUT||'hybrid-v2-census-evidence';
const checks=[];
const note=(name,pass,extra='')=>{checks.push({name,pass:!!pass,extra});console.log(pass?'PASS':'FAIL',name,extra)};
const key=r=>[r.actorId,r.objectPath,r.materialIndex].join('|');

await fs.mkdir(OUT,{recursive:true});
let browser;
let fatal=null;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const res=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  note('HTTP',res?.ok()===true,'status='+res?.status());
  await page.waitForFunction(()=>window.__KFB_HYBRID_V2__?.ready===true||!!window.__KFB_HYBRID_V2__?.error,null,{timeout:180000});
  await page.waitForTimeout(700);
  const ready=await page.evaluate(()=>({ready:window.__KFB_HYBRID_V2__.ready,error:window.__KFB_HYBRID_V2__.error}));
  note('runtime ready',ready.ready===true,JSON.stringify(ready));

  // Baseline exactly mirrors the frozen proof moment: integrated + hybrid before later screenshots.
  await page.evaluate(()=>{window.__KFB_HYBRID_V2__.setView('integrated');window.__KFB_HYBRID_V2__.setLook('hybrid')});
  await page.waitForTimeout(450);
  const baseline=await page.evaluate(()=>window.__KFB_HYBRID_V2__.materialCensus());
  const baselineDecorated=baseline.filter(r=>r.decorated);
  const baselineProofMissing=baselineDecorated.filter(r=>r.effectiveVisible&&!r.compiled);
  note('decorated material census non-empty',baselineDecorated.length>0,String(baselineDecorated.length));
  note('frozen proof mismatch resolves to five concrete baseline records',baselineProofMissing.length===5,JSON.stringify(baselineProofMissing,null,2));

  // Exercise each exact actor in isolation and record normal renderer submissions.
  const ids=['legacy','medium','gothgirl','frizzlebob','large'];
  const isolate={};
  for(const id of ids){
    await page.evaluate(()=>window.__KFB_HYBRID_V2__.resetRenderSubmissions());
    await page.evaluate(id=>{window.__KFB_HYBRID_V2__.setIsolatedActor(id);window.__KFB_HYBRID_V2__.setView('actor');window.__KFB_HYBRID_V2__.setLook('hybrid')},id);
    await page.waitForTimeout(520);
    const rows=await page.evaluate(()=>window.__KFB_HYBRID_V2__.materialCensus());
    isolate[id]=Object.fromEntries(rows.filter(r=>r.actorId===id).map(r=>[key(r),r]));
  }

  const classified=[];
  for(const base of baselineProofMissing){
    let row=isolate[base.actorId]?.[key(base)]||base;
    let classification;
    let forcedFrustum=null;

    if(!row.attachedToActorRoot||!row.attachedToScene)classification='DETACHED_FROM_RENDER_SCENE';
    else if(!row.hybridIsActive)classification='HYBRID_MATERIAL_NOT_ACTIVE_ON_NODE';
    else if(!row.materialVisible)classification='MATERIAL_VISIBLE_FALSE';
    else if(row.materialIsArray&&row.materialCount===1&&(row.groups||[]).length===0)classification='ARRAY_MATERIAL_WITHOUT_GROUPS_NOT_SUBMITTED_BY_THREE';
    else if(!row.drawReferenced)classification='UNUSED_MATERIAL_SLOT';
    else if(!row.effectiveVisible)classification='HIDDEN_BY_VISIBILITY_CHAIN';
    else if(row.submitted&&row.compiled)classification='RENDERED_AND_COMPILED_WHEN_ISOLATED';
    else if((row.indexCount===0)||(row.indexCount===null&&row.vertexCount===0))classification='EMPTY_GEOMETRY';
    else if((row.layerMask&row.cameraLayerMask)===0)classification='CAMERA_LAYER_EXCLUDED';
    else {
      // Diagnostic-only frustum probe: no material/shader/style changes.
      await page.evaluate(()=>window.__KFB_HYBRID_V2__.resetRenderSubmissions());
      await page.evaluate(id=>{window.__KFB_HYBRID_V2__.setIsolatedActor(id);window.__KFB_HYBRID_V2__.setView('actor');window.__KFB_HYBRID_V2__.setLook('hybrid')},base.actorId);
      forcedFrustum=await page.evaluate(uuid=>window.__KFB_HYBRID_V2__.setCensusFrustum(uuid,false),base.materialUuid);
      await page.waitForTimeout(420);
      const forcedRows=await page.evaluate(()=>window.__KFB_HYBRID_V2__.materialCensus());
      const forced=forcedRows.find(r=>key(r)===key(base))||row;
      await page.evaluate(({uuid,prior})=>window.__KFB_HYBRID_V2__.setCensusFrustum(uuid,prior),{uuid:base.materialUuid,prior:forcedFrustum?.prior??true});
      if(forced.submitted&&forced.compiled)classification='FRUSTUM_CULLED_IN_NORMAL_VIEW';
      else if(!forced.submitted)classification='NOT_SUBMITTED_EVEN_WITH_FRUSTUM_DISABLED';
      else classification='SUBMITTED_WITHOUT_COMPILE_MARKER';
      row={...row,forcedProbe:{submitted:forced.submitted,compiled:forced.compiled,effectiveVisible:forced.effectiveVisible,frustumCulled:forced.frustumCulled}};
    }

    const out={...row,baselineCompiled:base.compiled,baselineEffectiveVisible:base.effectiveVisible,diagnosticClassification:classification,forcedFrustum};
    classified.push(out);
    console.log('CENSUS_RECORD',JSON.stringify({
      actorId:out.actorId,nodeName:out.nodeName,objectPath:out.objectPath,
      materialIndex:out.materialIndex,materialCount:out.materialCount,materialIsArray:out.materialIsArray,materialName:out.materialName,materialUuid:out.materialUuid,
      materialVisible:out.materialVisible,hybridIsActive:out.hybridIsActive,activeMaterialIsArray:out.activeMaterialIsArray,activeMaterialUuids:out.activeMaterialUuids,
      attachedToActorRoot:out.attachedToActorRoot,attachedToScene:out.attachedToScene,parentName:out.parentName,
      drawReferenced:out.drawReferenced,indexCount:out.indexCount,vertexCount:out.vertexCount,
      effectiveVisible:out.effectiveVisible,submitted:out.submitted,compiled:out.compiled,
      layerMask:out.layerMask,cameraLayerMask:out.cameraLayerMask,
      classification:out.diagnosticClassification,forcedProbe:out.forcedProbe||null
    }));
  }

  const unresolved=classified.filter(r=>['NOT_SUBMITTED_EVEN_WITH_FRUSTUM_DISABLED','SUBMITTED_WITHOUT_COMPILE_MARKER'].includes(r.diagnosticClassification));
  const expectedClassifications=new Set(['DETACHED_FROM_RENDER_SCENE','HYBRID_MATERIAL_NOT_ACTIVE_ON_NODE','MATERIAL_VISIBLE_FALSE','ARRAY_MATERIAL_WITHOUT_GROUPS_NOT_SUBMITTED_BY_THREE','UNUSED_MATERIAL_SLOT','HIDDEN_BY_VISIBILITY_CHAIN','RENDERED_AND_COMPILED_WHEN_ISOLATED','EMPTY_GEOMETRY','CAMERA_LAYER_EXCLUDED','FRUSTUM_CULLED_IN_NORMAL_VIEW']);
  note('all five baseline records named',classified.length===5&&classified.every(r=>r.actorId&&r.objectPath&&r.materialUuid),JSON.stringify(classified,null,2));
  note('all five evidence-classified without shader changes',classified.length===5&&unresolved.length===0&&classified.every(r=>expectedClassifications.has(r.diagnosticClassification)),JSON.stringify({unresolved,classified},null,2));

  await page.evaluate(()=>{window.__KFB_HYBRID_V2__.setView('cast');window.__KFB_HYBRID_V2__.setLook('hybrid')});
  await page.waitForTimeout(250);
  await page.screenshot({path:OUT+'/cast-census.png',fullPage:true});

  note('no failed resources',failed.length===0,JSON.stringify(failed));
  note('no page/console errors',errors.length===0,JSON.stringify(errors));

  const evidence={base:BASE,ready,baseline,baselineProofMissing,classified,checks,failed,errors};
  await fs.writeFile(OUT+'/material-census.json',JSON.stringify(evidence,null,2));

  const pass=checks.every(x=>x.pass);
  console.log('HYBRID_V2_CENSUS_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,pass?'PASS':'FAIL');
  if(!pass)fatal=new Error('diagnostic checks failed');
}catch(e){
  fatal=e;
}finally{
  if(browser)await browser.close();
}
if(fatal)throw fatal;
