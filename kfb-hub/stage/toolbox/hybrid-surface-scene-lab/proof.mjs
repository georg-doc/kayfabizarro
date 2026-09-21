import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.HYBRID_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/toolbox/hybrid-surface-scene-lab/';
const PUBLIC=process.env.HYBRID_PUBLIC==='1';
const EXPECTED_HEAD=process.env.HYBRID_SOURCE_HEAD||'';
const OUT=process.env.HYBRID_PROOF_DIR||'hybrid-surface-scene-evidence';
const checks=[];
const check=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)};

async function waitMarker(){
  if(!PUBLIC)return;
  let last=null;
  for(let i=0;i<180;i++){
    try{
      const r=await fetch(BASE+'SOURCE.json?proof='+Date.now(),{cache:'no-store'});
      const text=await r.text();let j=null;try{j=JSON.parse(text)}catch{}
      last={status:r.status,head:j?.sourceBranchHead||null,preview:text.slice(0,100)};
      if(r.ok&&j?.sourceBranchHead===EXPECTED_HEAD){console.log('DEPLOYED',BASE,EXPECTED_HEAD);return}
    }catch(e){last={error:String(e)}}
    await new Promise(r=>setTimeout(r,3000));
  }
  throw Error('Stage marker timeout '+JSON.stringify(last));
}

await waitMarker();await fs.mkdir(OUT,{recursive:true});let browser;
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
  await page.waitForFunction(()=>window.__KFB_HYBRID_SCENE__?.ready===true||!!window.__KFB_HYBRID_SCENE__?.error,null,{timeout:180000});
  await page.waitForTimeout(900);
  const snap=await page.evaluate(()=>window.__KFB_HYBRID_SCENE__.snapshot());

  check('ready',snap.ready===true,JSON.stringify(snap.error));
  check('no runtime error',!snap.error,String(snap.error));
  check('exact Dungeon recipe',snap.room?.recipeId==='CQ-S1_KAYKIT_DUNGEON_PROMO',String(snap.room?.recipeId));
  check('Dungeon 69 placements',snap.room?.placements===69,String(snap.room?.placements));
  check('Dungeon source meshes visible',snap.room?.sourceFacts?.meshes>69,JSON.stringify(snap.room?.sourceFacts));
  check('World Atlas donor pin',snap.room?.kitLab?.pin==='bc1441eb8ff9a2df0e15e778b44b73f97eb63d76',JSON.stringify(snap.room?.kitLab));
  check('Dungeon recipe blob',snap.room?.recipe?.blob==='2d2ba81b35d2277553470582ae93b30f6ec197ac',JSON.stringify(snap.room?.recipe));

  const cast=snap.cast||{};
  check('five exact actors',Object.keys(cast).length===5,Object.keys(cast).join(','));
  check('Legacy Orc A',cast.legacy?.rig==='Rig_Legacy'&&/character_orcA\.gltf$/.test(cast.legacy?.path||''),JSON.stringify(cast.legacy));
  check('ActionFigure Medium',cast.medium?.rig==='Rig_Medium'&&/ActionFigure\.glb$/.test(cast.medium?.path||''),JSON.stringify(cast.medium));
  check('GothGirl Medium',cast.gothgirl?.rig==='Rig_Medium'&&/GothGirl\.glb$/.test(cast.gothgirl?.path||''),JSON.stringify(cast.gothgirl));
  check('FrizzleBob graft',cast.frizzlebob?.adapter==='graft'&&cast.frizzlebob?.rig==='Rig_Medium',JSON.stringify(cast.frizzlebob));
  check('Black Knight Large',cast.large?.rig==='Rig_Large'&&/BlackKnight\.glb$/.test(cast.large?.path||''),JSON.stringify(cast.large));
  for(const id of ['legacy','medium','gothgirl','frizzlebob','large'])check(id+' visible meshes',cast[id]?.meshes>0,JSON.stringify(cast[id]));

  check('static env uses WORLD projection',snap.environment?.projections?.length===1&&snap.environment.projections[0]==='world',JSON.stringify(snap.environment?.projections));
  check('actors use OBJECT projection',snap.actors?.projections?.length===1&&snap.actors.projections[0]==='object',JSON.stringify(snap.actors?.projections));
  check('one env texture',snap.environment?.textureUuids?.length===1,JSON.stringify(snap.environment?.textureUuids));
  check('one actor texture',snap.actors?.textureUuids?.length===1,JSON.stringify(snap.actors?.textureUuids));
  check('same texture across env + actors',snap.environment?.textureUuids?.[0]===snap.actors?.textureUuids?.[0],JSON.stringify({env:snap.environment?.textureUuids,actors:snap.actors?.textureUuids}));
  check('environment maps preserved',snap.environment?.mapsPreserved===snap.environment?.decorated,JSON.stringify(snap.environment));
  check('environment colors preserved',snap.environment?.colorsPreserved===snap.environment?.decorated,JSON.stringify(snap.environment));
  check('actor maps preserved',snap.actors?.mapsPreserved===snap.actors?.decorated,JSON.stringify(snap.actors));
  check('actor colors preserved',snap.actors?.colorsPreserved===snap.actors?.decorated,JSON.stringify(snap.actors));
  check('environment shaders compiled',snap.environment?.compiled===snap.environment?.materials,JSON.stringify(snap.environment));
  check('actor shaders compiled',snap.actors?.compiled===snap.actors?.materials,JSON.stringify(snap.actors));
  check('consumer owner unchanged',snap.ownership?.consumerRuntime==='unchanged'&&snap.ownership?.physics==='unchanged',JSON.stringify(snap.ownership));

  await page.evaluate(()=>window.__KFB_HYBRID_SCENE__.setView('room'));
  await page.evaluate(()=>window.__KFB_HYBRID_SCENE__.setLook('original'));await page.waitForTimeout(450);
  const roomOriginal=await page.screenshot({path:OUT+'/room-original.png',fullPage:true});
  await page.evaluate(()=>window.__KFB_HYBRID_SCENE__.setLook('hybrid'));await page.waitForTimeout(450);
  const roomHybrid=await page.screenshot({path:OUT+'/room-hybrid.png',fullPage:true});
  check('room hybrid visibly differs',Buffer.compare(roomOriginal,roomHybrid)!==0);

  await page.evaluate(()=>window.__KFB_HYBRID_SCENE__.setView('cast'));
  await page.evaluate(()=>window.__KFB_HYBRID_SCENE__.setLook('original'));await page.waitForTimeout(450);
  const castOriginal=await page.screenshot({path:OUT+'/cast-original.png',fullPage:true});
  await page.evaluate(()=>window.__KFB_HYBRID_SCENE__.setLook('hybrid'));await page.waitForTimeout(450);
  const castHybrid=await page.screenshot({path:OUT+'/cast-hybrid.png',fullPage:true});
  check('cast hybrid visibly differs',Buffer.compare(castOriginal,castHybrid)!==0);

  await page.evaluate(()=>window.__KFB_HYBRID_SCENE__.setView('integrated'));
  await page.evaluate(()=>window.__KFB_HYBRID_SCENE__.setLook('original'));await page.waitForTimeout(350);
  const integratedOriginal=await page.screenshot({path:OUT+'/integrated-original.png',fullPage:true});
  await page.evaluate(()=>window.__KFB_HYBRID_SCENE__.setLook('hybrid'));await page.waitForTimeout(350);
  const integratedHybrid=await page.screenshot({path:OUT+'/integrated-hybrid.png',fullPage:true});
  check('integrated hybrid visibly differs',Buffer.compare(integratedOriginal,integratedHybrid)!==0);

  await page.setViewportSize({width:832,height:780});await page.waitForTimeout(300);
  const responsive=await page.evaluate(()=>({canvas:!!document.querySelector('#stage canvas'),controls:document.querySelector('.controls')?.getBoundingClientRect().width||0,viewport:innerWidth}));
  check('832px canvas visible',responsive.canvas===true);
  check('832px controls fit',responsive.controls<=responsive.viewport,JSON.stringify(responsive));
  await page.screenshot({path:OUT+'/integrated-hybrid-832.png',fullPage:true});

  const finalSnap=await page.evaluate(()=>window.__KFB_HYBRID_SCENE__.snapshot());
  check('hybrid default strength retained',Math.abs(finalSnap.strength-.34)<.001,String(finalSnap.strength));
  check('larger pattern retained',Math.abs(finalSnap.scaleMul-.70)<.001,String(finalSnap.scaleMul));
  check('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));

  const evidence={base:BASE,public:PUBLIC,sourceHead:EXPECTED_HEAD,snapshot:finalSnap,checks,failed,errors};
  await fs.writeFile(OUT+'/browser.json',JSON.stringify(evidence,null,2));
  console.log('HYBRID_SURFACE_SCENE_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
}finally{if(browser)await browser.close()}
