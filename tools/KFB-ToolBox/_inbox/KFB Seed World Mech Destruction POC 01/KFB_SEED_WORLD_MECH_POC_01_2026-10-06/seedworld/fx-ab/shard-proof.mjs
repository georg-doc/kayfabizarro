import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const dest=process.env.KFB_PROOF_DIR||'kfb-seedworld-planar-shard-evidence';
fs.mkdirSync(dest,{recursive:true});
const result={schema:'kfb.seedworld.source-debris-smoke/0.1',status:'RUNNING',sourceOwner:'Existing Seed World sw-destruct + sw-fx POC; source-only presentation',scenario:'block',checks:[],measurements:[],errors:[],notRun:['target Mac GPU device frame pacing','full dynamic explosion timeline','human KFB Clay style Golden','water shader/flamethrower integration']};
const check=(name,pass,details=null)=>{result.checks.push({name,pass:!!pass,details});if(!pass)throw Error(name+' '+JSON.stringify(details));};
const root='tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/KFB_SEED_WORLD_MECH_POC_01_2026-10-06/seedworld/fx-ab/';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
let page;
try{
 page=await browser.newPage({viewport:{width:1370,height:925},deviceScaleFactor:1});
 page.on('pageerror',e=>result.errors.push({type:'pageerror',message:String(e)}));
 page.on('response',r=>{if(r.status()>=400&&r.url().includes('/FX_Visual/'))result.errors.push({type:'asset-http',status:r.status(),url:r.url()})});
 await page.goto('http://127.0.0.1:8768/'+root+'index.html?scenario=block',{waitUntil:'load',timeout:120000});
 await page.waitForFunction(()=>{const x=window.__KFB_SPELLSPILL_FX_AB__;return x&&(x.ready||x.error)},{timeout:150000});
 const initial=await page.evaluate(()=>{const a=window.__KFB_SPELLSPILL_FX_AB__;return {ready:a.ready,error:a.error,original:a.isolated,source:a.damageEvidence,debris:a.originalDebrisCount,chips:a.originalChipsCount}});
 check('original POC and real Brackeys donor load',initial.ready&&initial.original?.alphaNaturalWidth>0&&initial.original?.threeGeometry==='IcosahedronGeometry',initial);
 check('12 real source rockets',initial.source?.events===12,initial.source);
 check('real source debris and chips populated',initial.debris>0&&initial.chips>0,initial);
 check('real source destructible cell damage and actual cascades',initial.source.cellsLost>0&&initial.source.cascades>=1,initial.source);
 result.source=initial;
 const orig=await page.evaluate(()=>window.__KFB_SPELLSPILL_FX_AB__.isolateShards('original'));
 check('original 3D source debris isolated',orig.originalSourceDebris===initial.debris&&orig.originalSourceChips===initial.chips&&orig.drawnPlanar===0,orig);
 await page.screenshot({path:path.join(dest,'isolated-original-3d-debris.png'),fullPage:true});
 await page.evaluate(()=>window.__KFB_SPELLSPILL_FX_AB__.restoreShards());
 const flat=await page.evaluate(()=>window.__KFB_SPELLSPILL_FX_AB__.isolateShards('planar'));
 check('planar proxy sourced from actual full-size POC debris and chips',flat.originalSourceDebris===initial.debris&&flat.originalSourceChips===initial.chips&&flat.drawnPlanar>=initial.chips,flat);
 await page.screenshot({path:path.join(dest,'isolated-original-derived-planar-shards.png'),fullPage:true});
 await page.evaluate(()=>window.__KFB_SPELLSPILL_FX_AB__.restoreShards());
 for(const mode of ['none','d','e','f']){
  const r=await page.evaluate(k=>window.__KFB_SPELLSPILL_FX_AB__.measure(k,14),mode);
  result.measurements.push(r);
  check('valid actual source render metrics '+mode,r.frames===14&&Number.isFinite(r.renderSubmitMs.p95)&&r.callsAvg>0,r);
  check('unchanged source gameplay event result '+mode,JSON.stringify(r.damageEvidence)===JSON.stringify(initial.source),{mode,got:r.damageEvidence});
  await page.screenshot({path:path.join(dest,'block-'+mode+'.png'),fullPage:true});
 }
 const [none,d,e,f]=result.measurements;
 check('R2 sparse capped source smoke was preserved',d.visual3D<=3&&d.visual2D<=28,d);
 check('readable smoke E increases source smoke coverage vs R2 D',e.visual2D>d.visual2D&&e.pixelDiffVsNoSmoke?.changedPercent>d.pixelDiffVsNoSmoke?.changedPercent,{d:d.pixelDiffVsNoSmoke,e:e.pixelDiffVsNoSmoke,eCount:e.visual2D,dCount:d.visual2D});
 check('E and F reuse exactly same 3D and 2D smoke counts',f.visual3D===e.visual3D&&f.visual2D===e.visual2D,{E:[e.visual3D,e.visual2D],F:[f.visual3D,f.visual2D]});
 check('F planar proxy stays within exact source debris+chip count',f.shards?.planeTotal+f.shards?.originalDebris3D===initial.debris+initial.chips,f.shards);
 check('F has only small subset near-camera in exact original 3D',f.shards.originalDebris3D<=12&&f.shards.originalDebris3D>0,f.shards);
 check('F has source-backed planar angular chips',f.shards.planeChips===initial.chips&&f.shards.geometryTrianglesPerInstance===3,f.shards);
 check('F planar shards reduce submitted scene triangles against equal smoke E',f.trisMax<e.trisMax,{E:e.trisMax,F:f.trisMax});
 check('F actually differs visually from E',(()=>{
  // Test additional difference via numerical scene geometry and screenshot evidence;
  // visual art acceptance remains a human decision.
  return f.trisMax!==e.trisMax&&f.shards.planeTotal>0;
 })(),{E:e.trisMax,F:f.trisMax});
 check('F smoke remains visibly present',f.pixelDiffVsNoSmoke?.changedPercent>=0.04,f.pixelDiffVsNoSmoke);
 check('no unavailable source mask errors',result.errors.length===0,result.errors);
 result.status='SOURCE_BUDGET_AND_PLANAR_PROXY_TECHNICAL_PASS__VISUAL_AND_TARGET_GPU_OPEN';
}catch(e){result.status='FAIL';result.failure=String(e.stack||e);process.exitCode=1;if(page)await page.screenshot({path:path.join(dest,'failure.png'),fullPage:true}).catch(()=>{});}
finally{
 result.summary={passed:result.checks.filter(x=>x.pass).length,total:result.checks.length,screenshots:fs.readdirSync(dest).filter(x=>x.endsWith('.png')).length,rows:result.measurements.length};
 fs.writeFileSync(path.join(dest,'results.json'),JSON.stringify(result,null,2));
 await browser.close();
 console.log(JSON.stringify(result.summary));console.log(result.status);if(result.failure)console.error(result.failure);
}