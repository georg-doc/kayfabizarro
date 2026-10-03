import fs from 'node:fs';import path from 'node:path';import { chromium } from 'playwright';
const base=process.env.MOOD_POOL_URL||'http://127.0.0.1:4173/kfb-hub/stage/audio-stem-bed-02/',out='audio-stem-bed-02-proof';fs.mkdirSync(out,{recursive:true});
const result={status:'UNKNOWN',checks:[],errors:[],httpErrors:[],external:[]},check=(n,o,d=null)=>{result.checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d))};
const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});let page;
try{
 const c=await browser.newContext({viewport:{width:1440,height:1050}});page=await c.newPage();const origin=new URL(base).origin;
 page.on('pageerror',e=>result.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')result.errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)result.httpErrors.push({url:r.url(),status:r.status()})});page.on('request',r=>{try{const u=new URL(r.url());if(!r.url().startsWith('data:')&&u.origin!==origin)result.external.push(r.url())}catch{}});
 await page.goto(base,{waitUntil:'networkidle',timeout:90000});check('build marker R2',await page.evaluate(()=>document.documentElement.dataset.kfbBuild==='AUDIO-STEM-BED-02-R2'));check('runtime export',await page.evaluate(()=>!!window.__KFB_MOOD_POOL__));
 let s=await page.evaluate(()=>window.__KFB_MOOD_POOL__.snapshot());check('five donors',s.donors.length===5,s.donors);check('only Cyclical is stem-certified',s.donors.filter(d=>d.runtimePolicy==='stem-certified').map(d=>d.id).join(',')==='neutral',s.donors);
 for(const id of ['neutral','awe','sunshine','grief','boss']){
   await page.evaluate(id=>window.__KFB_MOOD_POOL__.selectDonor(id),id);await page.click('#load');await page.waitForFunction(id=>window.__KFB_MOOD_POOL__.snapshot().loadedDonor===id,id,{timeout:120000});s=await page.evaluate(()=>window.__KFB_MOOD_POOL__.snapshot());
   check(id+' master loaded',s.masterLoaded===true,s);if(id==='neutral')check('Cyclical loads 8 certified stems',s.loadedStemCount===8,s.loadedStemCount);else check(id+' does not decode uncertified stems',s.loadedStemCount===0,s.loadedStemCount);
   await page.evaluate(()=>window.__KFB_MOOD_POOL__.playMaster());s=await page.evaluate(()=>window.__KFB_MOOD_POOL__.snapshot());check(id+' master reference is one source',s.mode==='master-reference'&&s.starts.length===1,s);
   await page.evaluate(()=>window.__KFB_MOOD_POOL__.stop());await page.evaluate(()=>window.__KFB_MOOD_POOL__.play());s=await page.evaluate(()=>window.__KFB_MOOD_POOL__.snapshot());
   if(id==='neutral'){check('Cyclical adaptive uses certified stems',s.mode==='stem-certified'&&s.starts.length===8&&s.synchronizedStarts,s)}
   else check(id+' game bed stays original master',s.mode==='master-safe'&&s.starts.length===1,s);
   await page.evaluate(()=>window.__KFB_MOOD_POOL__.stop());
 }
 await page.evaluate(()=>{window.__KFB_MOOD_POOL__.selectDonor('sunshine')});await page.click('#load');await page.waitForFunction(()=>window.__KFB_MOOD_POOL__.snapshot().loadedDonor==='sunshine',{timeout:120000});
 await page.evaluate(()=>window.__KFB_MOOD_POOL__.play());s=await page.evaluate(()=>window.__KFB_MOOD_POOL__.snapshot());check('Buant R2 uses master-safe source',s.mode==='master-safe'&&s.starts.length===1&&s.loadedStemCount===0,s);
 await page.evaluate(()=>window.__KFB_MOOD_POOL__.preset('road'));s=await page.evaluate(()=>window.__KFB_MOOD_POOL__.snapshot());check('Buant road remains one master source',s.starts.length===1&&s.mode==='master-safe',s);check('master-safe processing bounded',s.processing.lowpassHz>=9000&&s.processing.outputGain<=.75,s.processing);
 await page.evaluate(()=>window.__KFB_MOOD_POOL__.preset('voice'));s=await page.evaluate(()=>window.__KFB_MOOD_POOL__.snapshot());check('voice focus ducks master globally',s.processing.outputGain<.60,s.processing);
 check('no page errors',result.errors.length===0,result.errors);check('no HTTP errors',result.httpErrors.length===0,result.httpErrors);check('no external requests',result.external.length===0,result.external);
 await page.screenshot({path:path.join(out,'desktop.png'),fullPage:true});result.snapshot=s;result.status='PASS';
}catch(e){result.status='FAIL';result.failure=String(e.stack||e);process.exitCode=1;if(page)await page.screenshot({path:path.join(out,'FAIL.png'),fullPage:true}).catch(()=>{})}
finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:result.status,checks:result.checks.length,failure:result.failure||null,snapshot:result.snapshot||null}));await browser.close()}