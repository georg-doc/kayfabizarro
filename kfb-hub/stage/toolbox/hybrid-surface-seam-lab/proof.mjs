import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.SEAM_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/toolbox/hybrid-surface-seam-lab/';
const PUBLIC=process.env.SEAM_PUBLIC==='1';
const EXPECTED_HEAD=process.env.SEAM_SOURCE_HEAD||'';
const OUT=process.env.SEAM_PROOF_DIR||'hybrid-seam-evidence';
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

await waitMarker();
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
  await page.waitForFunction(()=>window.__KFB_SEAM_LAB__?.ready===true||!!window.__KFB_SEAM_LAB__?.error,null,{timeout:180000});
  await page.waitForTimeout(700);
  let snap=await page.evaluate(()=>window.__KFB_SEAM_LAB__.snapshot());

  check('runtime ready',snap.ready===true,JSON.stringify(snap.error));
  check('exact Dungeon donor',snap.room?.recipeId==='CQ-S1_KAYKIT_DUNGEON_PROMO'&&snap.room?.placements===69,JSON.stringify(snap.room));
  check('five exact actors',Object.keys(snap.cast||{}).length===5,Object.keys(snap.cast||{}).join(','));
  check('tileable default active',snap.macroMode==='tileable',String(snap.macroMode));
  check('legacy generator has mismatching edges',snap.edgeMetrics?.legacy?.maxAbs>0,JSON.stringify(snap.edgeMetrics?.legacy));
  check('tileable opposite edges exact',snap.edgeMetrics?.tileable?.maxAbs===0&&snap.edgeMetrics?.tileable?.meanAbs===0,JSON.stringify(snap.edgeMetrics?.tileable));
  check('one active shared texture environment',snap.environment?.textureUuids?.length===1,JSON.stringify(snap.environment?.textureUuids));
  check('same one texture across actors',snap.actors?.textureUuids?.length===1&&snap.environment?.textureUuids?.[0]===snap.actors?.textureUuids?.[0],JSON.stringify({env:snap.environment?.textureUuids,actors:snap.actors?.textureUuids}));
  check('source roughness still preserved',snap.environment?.roughnessPreserved===snap.environment?.decorated&&snap.actors?.roughnessPreserved===snap.actors?.decorated,JSON.stringify({env:snap.environment,actors:snap.actors}));

  await page.evaluate(()=>{window.__KFB_SEAM_LAB__.setLook('hybrid');window.__KFB_SEAM_LAB__.setView('seam');window.__KFB_SEAM_LAB__.setMacroMode('legacy')});
  await page.waitForTimeout(350);
  await page.screenshot({path:OUT+'/seam-legacy-nontileable.png',fullPage:true});
  const legacySnap=await page.evaluate(()=>window.__KFB_SEAM_LAB__.snapshot());
  check('legacy comparison mode active',legacySnap.macroMode==='legacy');

  await page.evaluate(()=>window.__KFB_SEAM_LAB__.setMacroMode('tileable'));
  await page.waitForTimeout(350);
  await page.screenshot({path:OUT+'/seam-tileable.png',fullPage:true});
  snap=await page.evaluate(()=>window.__KFB_SEAM_LAB__.snapshot());
  check('tileable comparison mode active',snap.macroMode==='tileable');
  check('tileable edge metric remains zero after switch',snap.edgeMetrics.tileable.maxAbs===0,JSON.stringify(snap.edgeMetrics.tileable));

  await page.evaluate(()=>{window.__KFB_SEAM_LAB__.setView('integrated');window.__KFB_SEAM_LAB__.setMacroMode('tileable')});
  await page.waitForTimeout(300);
  await page.screenshot({path:OUT+'/integrated-tileable.png',fullPage:true});

  await page.setViewportSize({width:832,height:780});
  await page.waitForTimeout(250);
  const responsive=await page.evaluate(()=>({canvas:!!document.querySelector('#stage canvas'),controls:document.querySelector('.controls')?.getBoundingClientRect().width||0,viewport:innerWidth}));
  check('832px canvas visible',responsive.canvas===true);
  check('832px controls fit',responsive.controls<=responsive.viewport,JSON.stringify(responsive));
  await page.screenshot({path:OUT+'/integrated-tileable-832.png',fullPage:true});

  check('no failed resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));

  await fs.writeFile(OUT+'/browser.json',JSON.stringify({base:BASE,public:PUBLIC,sourceHead:EXPECTED_HEAD,snapshot:snap,checks,failed,errors},null,2));
  console.log('HYBRID_SEAM_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
}finally{
  if(browser)await browser.close();
}
