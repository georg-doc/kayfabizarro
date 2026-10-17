import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const outDir=process.env.KFB_PROOF_DIR||'kfb-spellspill-fx-ab-evidence';
fs.mkdirSync(outDir,{recursive:true});
const result={schema:'kfb.seedworld.real-source-fx-ab/0.1',build:process.env.GITHUB_SHA||'UNKNOWN',tests:[],rows:[],status:'RUNNING',environment:'Playwright Chromium SwiftShader, 980x640 viewport inside 1370x925 page; NOT target-GPU FPS',errors:[],notRun:['Georg GPU Safari/Chrome/monitor real viewport','independent KFB visual Golden','continuous animated multi-emitter dynamic FX profiling','true GPU timer query','full production integration']};
const check=(name,ok,details)=>{result.tests.push({name,pass:!!ok,details});if(!ok)throw Error(name+' '+JSON.stringify(details));};
const root='tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/KFB_SEED_WORLD_MECH_POC_01_2026-10-06/seedworld/fx-ab/';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
try{
 for(const scenario of ['single','four','block']){
  const page=await browser.newPage({viewport:{width:1370,height:925},deviceScaleFactor:1});
  page.on('pageerror',e=>result.errors.push({scenario,type:'pageerror',message:String(e)}));
  page.on('response',r=>{if(r.status()>=400&&r.url().includes('/media/3D_Assets/FX_Visual'))result.errors.push({scenario,type:'asset-http',status:r.status(),url:r.url()})});
  try{
   await page.goto('http://127.0.0.1:8768/'+root+'index.html?scenario='+scenario,{waitUntil:'load',timeout:120000});
   await page.waitForFunction(()=>{const x=window.__KFB_SPELLSPILL_FX_AB__;return x&&(x.ready||x.error)},{timeout:150000});
   const state=await page.evaluate(()=>{const x=window.__KFB_SPELLSPILL_FX_AB__;return {ready:x.ready,error:x.error,isolated:x.isolated,damage:x.damageEvidence,stream:x.streamingPendingBeforeRun}});
   check(scenario+' real POC source initialised',state.ready,state.error);
   check(scenario+' real 3D source dust and 2D original mask',state.isolated?.threeGeometry==='IcosahedronGeometry'&&state.isolated?.alphaNaturalWidth>0&&state.isolated?.dustInstanceCount>0,state.isolated);
   check(scenario+' source explosion count',state.damage.events==={single:1,four:4,block:12}[scenario],state.damage);
   check(scenario+' actual source visual and gameplay event split',state.damage.promoted>=0&&state.damage.smoke>0&&state.damage.cellsLost>=0&&state.damage.debris>=0,state.damage);
   if(scenario==='single'){
     const isoA=await page.evaluate(()=>window.__KFB_SPELLSPILL_FX_AB__.isolate('a'));
     check('original 3D source alone rendered',isoA.actualPOC3D>0&&isoA.actualBrackeys2D===0,isoA);
     await page.screenshot({path:path.join(outDir,'isolated-source-3d.png'),fullPage:true});
     await page.evaluate(()=>window.__KFB_SPELLSPILL_FX_AB__.restoreIsolation());
     const isoB=await page.evaluate(()=>window.__KFB_SPELLSPILL_FX_AB__.isolate('b'));
     check('original 2D Brackeys mask alone rendered',isoB.actualPOC3D===0&&isoB.actualBrackeys2D>0,isoB);
     await page.screenshot({path:path.join(outDir,'isolated-source-2d.png'),fullPage:true});
     await page.evaluate(()=>window.__KFB_SPELLSPILL_FX_AB__.restoreIsolation());
   }
   const rows=[];
   for(const variant of ['none','a','b','c']){
    const metric=await page.evaluate(v=>window.__KFB_SPELLSPILL_FX_AB__.measure(v,30),variant);
    check(scenario+' '+variant+' renders finite frame timings',metric.frames===30&&Number.isFinite(metric.renderSubmitMs.p95)&&metric.callsAvg>0,metric);
    rows.push(metric);result.rows.push(metric);
    await page.screenshot({path:path.join(outDir,scenario+'-'+variant+'.png'),fullPage:true});
   }
   const [none,a,b,c]=rows;
   check(scenario+' A renders source 3D lobes',a.visual3D===a.sourceDust&&a.visual2D===0,a);
   check(scenario+' B renders source 2D atlas',b.visual3D===0&&b.visual2D===b.sourceDust,b);
   check(scenario+' C bounded 3D + real 2D source',c.visual3D===Math.min(9,c.sourceDust)&&c.visual2D===Math.max(0,c.sourceDust-9),c);
   check(scenario+' gameplay damage immutable across comparisons',rows.every(r=>JSON.stringify(r.damageEvidence)===JSON.stringify(none.damageEvidence)),rows.map(r=>({v:r.variant,damage:r.damageEvidence})));
   for(const m of [a,b,c])check(scenario+' '+m.variant+' actually changes source-scene pixels',m.pixelDiffVsNoSmoke?.changedPercent>=0.04,m.pixelDiffVsNoSmoke);
   check(scenario+' source alpha request succeeded',!result.errors.some(e=>e.scenario===scenario&&e.type==='asset-http'),result.errors);
  }catch(e){
   result.errors.push({scenario,type:'test',message:String(e.stack||e)});
   if(await page.locator('canvas').count()>0)await page.screenshot({path:path.join(outDir,scenario+'-FAILED.png'),fullPage:true}).catch(()=>{});
   throw e;
  }finally{await page.close();}
 }
 result.status='TECHNICAL_SOURCE_COMPARISON_PASS__HUMAN_AND_TARGET_GPU_OPEN';
}catch(e){result.status='FAIL';result.failure=String(e.stack||e);process.exitCode=1;}
finally{
 result.summary={passed:result.tests.filter(x=>x.pass).length,total:result.tests.length,screenshots:fs.readdirSync(outDir).filter(x=>x.endsWith('.png')).length,rows:result.rows.length};
 fs.writeFileSync(path.join(outDir,'results.json'),JSON.stringify(result,null,2));
 await browser.close();
 console.log(JSON.stringify(result.summary));console.log(result.status);if(result.failure)console.error(result.failure);
}