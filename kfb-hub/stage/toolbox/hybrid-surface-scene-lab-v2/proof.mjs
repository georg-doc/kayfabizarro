import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.HYBRID_V2_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/toolbox/hybrid-surface-scene-lab-v2/';
const PUBLIC=process.env.HYBRID_V2_PUBLIC==='1';
const EXPECTED_HEAD=process.env.HYBRID_V2_SOURCE_HEAD||'';
const OUT=process.env.HYBRID_V2_PROOF_DIR||'hybrid-surface-v2-evidence';
const checks=[];
const check=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)};

async function waitMarker(){
  if(!PUBLIC)return;
  let last=null;
  for(let i=0;i<180;i++){
    try{
      const r=await fetch(BASE+'SOURCE.json?proof='+Date.now(),{cache:'no-store'});
      const text=await r.text();let j=null;try{j=JSON.parse(text)}catch{}
      last={status:r.status,head:j?.sourceBranchHead||null,preview:text.slice(0,120)};
      if(r.ok&&j?.sourceBranchHead===EXPECTED_HEAD){console.log('DEPLOYED',BASE,EXPECTED_HEAD);return}
    }catch(e){last={error:String(e)}}
    await new Promise(r=>setTimeout(r,3000));
  }
  throw Error('Stage marker timeout '+JSON.stringify(last));
}

await waitMarker();
await fs.mkdir(OUT,{recursive:true});
let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push('pageerror '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  check('HTTP',response?.ok()===true,'status='+response?.status());
  await page.waitForFunction(()=>window.__KFB_HYBRID_V2__?.ready===true||!!window.__KFB_HYBRID_V2__?.error,null,{timeout:180000});
  await page.waitForTimeout(900);
  let snap=await page.evaluate(()=>window.__KFB_HYBRID_V2__.snapshot());

  check('ready',snap.ready===true,JSON.stringify(snap.error));
  check('no runtime error',!snap.error,String(snap.error));
  check('exact Dungeon recipe',snap.room?.recipeId==='CQ-S1_KAYKIT_DUNGEON_PROMO',String(snap.room?.recipeId));
  check('Dungeon 69 placements',snap.room?.placements===69,String(snap.room?.placements));
  check('Dungeon source meshes',snap.room?.sourceFacts?.meshes>69,JSON.stringify(snap.room?.sourceFacts));
  check('World Atlas donor pin',snap.room?.kitLab?.pin==='bc1441eb8ff9a2df0e15e778b44b73f97eb63d76',JSON.stringify(snap.room?.kitLab));
  check('RGB brush donor pinned',snap.sourcePins?.brushDonor==='15f2f1714d62b606033b8624964e481c6d99d59f',String(snap.sourcePins?.brushDonor));

  const cast=snap.cast||{};
  check('five exact actors',Object.keys(cast).length===5,Object.keys(cast).join(','));
  check('Legacy Orc exact',cast.legacy?.rig==='Rig_Legacy'&&/character_orcA\.gltf$/.test(cast.legacy?.path||''),JSON.stringify(cast.legacy));
  check('ActionFigure exact',cast.medium?.rig==='Rig_Medium'&&/ActionFigure\.glb$/.test(cast.medium?.path||''),JSON.stringify(cast.medium));
  check('GothGirl exact',cast.gothgirl?.rig==='Rig_Medium'&&/GothGirl\.glb$/.test(cast.gothgirl?.path||''),JSON.stringify(cast.gothgirl));
  check('FrizzleBob exact graft',cast.frizzlebob?.adapter==='graft'&&cast.frizzlebob?.rig==='Rig_Medium',JSON.stringify(cast.frizzlebob));
  check('Black Knight exact',cast.large?.rig==='Rig_Large'&&/BlackKnight\.glb$/.test(cast.large?.path||''),JSON.stringify(cast.large));

  for(const id of ['legacy','medium','gothgirl','frizzlebob','large']){
    check(id+' has visible meshes',cast[id]?.meshes>0,JSON.stringify(cast[id]));
    check(id+' exact head proxy matched',(cast[id]?.scaleReport?.headRaw?.names?.length||0)>0,JSON.stringify(cast[id]?.scaleReport?.headRaw));
  }

  const cal=snap.scaleCalibration;
  check('head-size calibration exists',!!cal&&Number.isFinite(cal.targetHeadMetric),JSON.stringify(cal));
  const headErrors=Object.entries(cast).map(([id,a])=>({id,metric:a.scaleReport.headScaled.metric,error:Math.abs(a.scaleReport.headScaled.metric-cal.targetHeadMetric)/cal.targetHeadMetric}));
  check('all heads normalized within 1.5%',headErrors.every(x=>x.error<=.015),JSON.stringify(headErrors));
  check('Legacy shorter than Medium median',cast.legacy.scaleReport.scaledTotalHeight<cal.mediumMedianHeight,JSON.stringify({legacy:cast.legacy.scaleReport.scaledTotalHeight,mediumMedian:cal.mediumMedianHeight}));
  check('Large remains taller than Medium median',cast.large.scaleReport.scaledTotalHeight>cal.mediumMedianHeight,JSON.stringify({large:cast.large.scaleReport.scaledTotalHeight,mediumMedian:cal.mediumMedianHeight}));

  check('static env WORLD projection',snap.environment?.projections?.length===1&&snap.environment.projections[0]==='world',JSON.stringify(snap.environment?.projections));
  check('actors OBJECT projection',snap.actors?.projections?.length===1&&snap.actors.projections[0]==='object',JSON.stringify(snap.actors?.projections));
  check('one env texture',snap.environment?.textureUuids?.length===1,JSON.stringify(snap.environment?.textureUuids));
  check('one actor texture',snap.actors?.textureUuids?.length===1,JSON.stringify(snap.actors?.textureUuids));
  check('same one texture env + actors',snap.environment?.textureUuids?.[0]===snap.actors?.textureUuids?.[0],JSON.stringify({env:snap.environment?.textureUuids,actors:snap.actors?.textureUuids}));
  check('contract textureCount one',snap.surfaceContract?.textureCount===1,JSON.stringify(snap.surfaceContract));
  check('grain is procedural 3D',/procedural 3D/.test(snap.surfaceContract?.grain||''),String(snap.surfaceContract?.grain));

  for(const [label,g] of [['environment',snap.environment],['actors',snap.actors]]){
    check(label+' maps preserved',g.mapsPreserved===g.decorated,JSON.stringify(g));
    check(label+' colors preserved',g.colorsPreserved===g.decorated,JSON.stringify(g));
    check(label+' source roughness preserved',g.roughnessPreserved===g.decorated,JSON.stringify(g));
    check(label+' source metalness preserved',g.metalnessPreserved===g.decorated,JSON.stringify(g));
  }
  check('roughness distribution not globally clamped',new Set([...snap.environment.sourceRoughness,...snap.actors.sourceRoughness].map(x=>Number(x).toFixed(3))).size>1,JSON.stringify({env:snap.environment.sourceRoughness,actors:snap.actors.sourceRoughness}));
  check('environment shaders compiled',snap.environment.compiled===snap.environment.materials,JSON.stringify(snap.environment));
  check('visible actor shaders compiled',snap.actors.visibleCompiled===snap.actors.visibleMaterials,JSON.stringify(snap.actors));
  check('consumer owner unchanged',snap.ownership?.consumerRuntime==='unchanged'&&snap.ownership?.physics==='unchanged',JSON.stringify(snap.ownership));

  await page.evaluate(()=>window.__KFB_HYBRID_V2__.setView('room'));
  await page.evaluate(()=>window.__KFB_HYBRID_V2__.setLook('original'));await page.waitForTimeout(400);
  const roomOriginal=await page.screenshot({path:OUT+'/room-original.png',fullPage:true});
  await page.evaluate(()=>window.__KFB_HYBRID_V2__.setLook('hybrid'));await page.waitForTimeout(400);
  const roomHybrid=await page.screenshot({path:OUT+'/room-hybrid-v2.png',fullPage:true});
  check('room v2 visibly differs',Buffer.compare(roomOriginal,roomHybrid)!==0);

  await page.evaluate(()=>window.__KFB_HYBRID_V2__.setView('cast'));
  await page.evaluate(()=>window.__KFB_HYBRID_V2__.setLook('original'));await page.waitForTimeout(400);
  const castOriginal=await page.screenshot({path:OUT+'/cast-original-headscale.png',fullPage:true});
  await page.evaluate(()=>window.__KFB_HYBRID_V2__.setLook('hybrid'));await page.waitForTimeout(400);
  const castHybrid=await page.screenshot({path:OUT+'/cast-hybrid-v2.png',fullPage:true});
  check('cast v2 visibly differs',Buffer.compare(castOriginal,castHybrid)!==0);

  for(const id of ['legacy','medium','gothgirl','frizzlebob','large']){
    await page.evaluate(id=>{window.__KFB_HYBRID_V2__.setIsolatedActor(id);window.__KFB_HYBRID_V2__.setView('actor');window.__KFB_HYBRID_V2__.setLook('original')},id);
    await page.waitForTimeout(180);
    await page.screenshot({path:OUT+'/source-isolate-'+id+'.png',fullPage:true});
  }
  check('five source-isolation screenshots exercised',true);

  await page.evaluate(()=>{window.__KFB_HYBRID_V2__.setView('seam');window.__KFB_HYBRID_V2__.setLook('hybrid')});
  await page.waitForTimeout(300);
  await page.screenshot({path:OUT+'/seam-closeup-v2.png',fullPage:true});
  check('seam diagnostic view exercised',true);

  await page.evaluate(()=>{window.__KFB_HYBRID_V2__.setView('integrated');window.__KFB_HYBRID_V2__.setLook('hybrid')});
  await page.waitForTimeout(300);
  await page.screenshot({path:OUT+'/integrated-hybrid-v2.png',fullPage:true});

  await page.setViewportSize({width:832,height:780});
  await page.waitForTimeout(250);
  const responsive=await page.evaluate(()=>({canvas:!!document.querySelector('#stage canvas'),controls:document.querySelector('.controls')?.getBoundingClientRect().width||0,viewport:innerWidth}));
  check('832px canvas visible',responsive.canvas===true);
  check('832px controls fit',responsive.controls<=responsive.viewport,JSON.stringify(responsive));
  await page.screenshot({path:OUT+'/integrated-hybrid-v2-832.png',fullPage:true});

  snap=await page.evaluate(()=>window.__KFB_HYBRID_V2__.snapshot());
  check('v2 strength default',Math.abs(snap.strength-.62)<.001,String(snap.strength));
  check('v2 macro default',Math.abs(snap.macroFactor-.72)<.001,String(snap.macroFactor));
  check('v2 grain default',Math.abs(snap.grainStrength-.52)<.001,String(snap.grainStrength));
  check('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));

  const evidence={base:BASE,public:PUBLIC,sourceHead:EXPECTED_HEAD,snapshot:snap,headErrors,checks,failed,errors};
  await fs.writeFile(OUT+'/browser.json',JSON.stringify(evidence,null,2));
  console.log('HYBRID_SURFACE_V2_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
}finally{
  if(browser)await browser.close();
}
