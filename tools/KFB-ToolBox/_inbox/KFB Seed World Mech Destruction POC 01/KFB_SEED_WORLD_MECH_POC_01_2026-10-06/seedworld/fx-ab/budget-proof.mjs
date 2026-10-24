import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const dir=process.env.KFB_PROOF_DIR||'kfb-seedworld-budget-fx-evidence';
fs.mkdirSync(dir,{recursive:true});
const result={schema:'kfb.seedworld.saturated-fx-budget/0.1',owner:'Existing Seed World Mech Destruction POC 01',scenario:'block',status:'RUNNING',tests:[],measurements:[],errors:[],notRun:['Target Mac/actual GPU FPS','Visual Clay Golden acceptance','Dynamic sustained fire/real-time pool arbitration','Full WB2 or Combat integration']};
const check=(name,pass,details=null)=>{result.tests.push({name,pass:!!pass,details});if(!pass)throw Error(name+' '+JSON.stringify(details));};
const root='tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/KFB_SEED_WORLD_MECH_POC_01_2026-10-06/seedworld/fx-ab/';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
let page;
try{
 page=await browser.newPage({viewport:{width:1370,height:925},deviceScaleFactor:1});
 page.on('pageerror',e=>result.errors.push('pageerror:'+String(e)));
 page.on('response',r=>{if(r.status()>=400&&r.url().includes('/FX_Visual/'))result.errors.push('source HTTP '+r.status()+':'+r.url())});
 await page.goto('http://127.0.0.1:8768/'+root+'index.html?scenario=block',{waitUntil:'load',timeout:120000});
 await page.waitForFunction(()=>{const a=window.__KFB_SPELLSPILL_FX_AB__;return a&&(a.ready||a.error)},{timeout:150000});
 const source=await page.evaluate(()=>{const x=window.__KFB_SPELLSPILL_FX_AB__;return {ready:x.ready,error:x.error,isolated:x.isolated,damage:x.damageEvidence}});
 check('real original POC loaded',source.ready,source.error);
 check('actual Brackeys alpha plus source 3D isolated earlier',source.isolated?.threeGeometry==='IcosahedronGeometry'&&source.isolated?.alphaNaturalWidth>0,source.isolated);
 check('actual 12 source rocket events',source.damage?.events===12,source.damage);
 check('nonzero true damage and smoke',source.damage.cellsLost>0&&source.damage.smoke>0,source.damage);
 check('actual source pool pressure',source.damage.peakVfx>=500&&source.damage.smoke>=150,source.damage);
 result.originalDamage=source.damage;
 for(const mode of ['none','c','d']){
  const x=await page.evaluate(mode=>window.__KFB_SPELLSPILL_FX_AB__.measure(mode,16),mode);
  result.measurements.push(x);
  check('finite actual render timings '+mode,x.frames===16&&Number.isFinite(x.renderSubmitMs.p95)&&x.callsAvg>0,x);
  await page.screenshot({path:path.join(dir,'block-'+mode+'.png'),fullPage:true});
 }
 const [baseline,legacy,budget]=result.measurements;
 check('budget capped 3D near hero',budget.visual3D>0&&budget.visual3D<=3&&budget.visual3D<legacy.visual3D,{legacy:legacy.visual3D,budget:budget.visual3D});
 check('budget capped 2D source atlas',budget.visual2D>0&&budget.visual2D<=28&&budget.visual2D<legacy.visual2D,{legacy:legacy.visual2D,budget:budget.visual2D});
 check('source smoke positions never duplicated in bounded hybrid',(()=>{
  const ids=[...budget.budget.hero,...budget.budget.sprites];
  return new Set(ids).size===ids.length;
 })(),budget.budget);
 check('budget uses actual original pool IDs not new emitter simulation',budget.budget.droppedMath===source.damage.smoke-budget.visual3D-budget.visual2D,budget.budget);
 check('bounded geometry lower than prior hybrid',budget.trisMax<legacy.trisMax,{legacy:legacy.trisMax,budget:budget.trisMax});
 check('budget smoke visible in rendered scene',budget.pixelDiffVsNoSmoke?.changedPercent>=0.04,budget.pixelDiffVsNoSmoke);
 check('same authoritative game damage across all variants',result.measurements.every(x=>JSON.stringify(x.damageEvidence)===JSON.stringify(baseline.damageEvidence)));
 check('no original source mask HTTP error',result.errors.length===0,result.errors);
 result.status='TECHNICAL_BUDGET_PROOF_PASS__NOT_VISUAL_OR_TARGET_GPU_ACCEPTANCE';
}catch(e){result.failure=String(e.stack||e);result.status='FAIL';process.exitCode=1; if(page)await page.screenshot({path:path.join(dir,'failure.png'),fullPage:true}).catch(()=>{});}
finally{
 result.summary={passed:result.tests.filter(x=>x.pass).length,total:result.tests.length,screenshots:fs.readdirSync(dir).filter(x=>x.endsWith('.png')).length};
 fs.writeFileSync(path.join(dir,'results.json'),JSON.stringify(result,null,2));
 await browser.close();
 console.log(JSON.stringify(result.summary));console.log(result.status);if(result.failure)console.error(result.failure);
}