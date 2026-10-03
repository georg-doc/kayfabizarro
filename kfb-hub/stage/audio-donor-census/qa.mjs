import fs from 'node:fs';import path from 'node:path';import { chromium } from 'playwright';
const base=process.env.DONOR_CENSUS_URL||'http://127.0.0.1:4173/kfb-hub/stage/audio-donor-census/';
const outdir='audio-donor-census-proof';fs.mkdirSync(outdir,{recursive:true});
const result={status:'UNKNOWN',checks:[],errors:[]};const check=(n,o,d=null)=>{result.checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d));};
const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});let page;
try{
 const c=await browser.newContext({viewport:{width:1200,height:800}});page=await c.newPage();page.on('pageerror',e=>result.errors.push(String(e)));
 await page.goto(base,{waitUntil:'networkidle',timeout:90000});await page.click('#run');await page.waitForFunction(()=>!!window.__KFB_DONOR_CENSUS_RESULT__,{timeout:240000});
 const s=await page.evaluate(()=>window.__KFB_DONOR_CENSUS_RESULT__);
 check('five donors',Object.keys(s.donors).length===5,Object.keys(s.donors));
 for(const [id,d] of Object.entries(s.donors)){
   check(id+' master decoded',d.master.duration>120,d.master);
   check(id+' stems decoded',d.summary.stemCount>=7,d.summary);
   check(id+' stem duration spread small',d.summary.durationSpread<1,d.summary);
 }
 check('no page errors',result.errors.length===0,result.errors);
 result.snapshot=s;result.status='PASS';
 await page.screenshot({path:path.join(outdir,'census.png'),fullPage:true});
}catch(e){result.status='FAIL';result.failure=String(e.stack||e);process.exitCode=1;}
finally{fs.writeFileSync(path.join(outdir,'results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:result.status,checks:result.checks.length,failure:result.failure||null}));await browser.close();}