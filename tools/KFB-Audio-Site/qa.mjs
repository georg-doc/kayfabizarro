import fs from 'node:fs';import path from 'node:path';import { chromium } from 'playwright';
const base=process.env.KFB_AUDIO_SITE_URL||'http://127.0.0.1:4173/tools/KFB-Audio-Site/';const out='kfb-audio-site-proof';fs.mkdirSync(out,{recursive:true});
const result={status:'UNKNOWN',checks:[],errors:[],httpErrors:[]};const check=(n,o,d=null)=>{result.checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d))};
const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});let page;
try{
 const c=await browser.newContext({viewport:{width:1440,height:1000}});page=await c.newPage();page.on('pageerror',e=>result.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')result.errors.push(m.text())});page.on('response',r=>{if(r.status()>=400&&!r.url().includes('raw.githubusercontent.com'))result.httpErrors.push({url:r.url(),status:r.status()})});
 await page.goto(base,{waitUntil:'networkidle',timeout:90000});
 check('site marker',await page.evaluate(()=>document.documentElement.dataset.kfbAudioSite==='0.1'));
 check('catalog renders >=54',await page.locator('.track').count()>=54,await page.locator('.track').count());
 check('stats says 44 RoadTrip',await page.locator('#stats').innerText().then(x=>x.includes('44 RoadTrip v2')));
 await page.selectOption('#stemFilter','stems');check('stem filter shows 14',await page.locator('.track').count()===14,await page.locator('.track').count());
 await page.click('[data-view="mix"]');check('mix visible',await page.locator('#mix').evaluate(e=>e.classList.contains('active')));
 await page.click('[data-view="prompt"]');await page.fill('#pMood','rainy midnight melancholy');await page.selectOption('#pRefs',{index:0});await page.click('#buildPrompt');check('prompt request built',await page.locator('#promptOut').inputValue().then(x=>x.includes('rainy midnight melancholy')&&x.includes('Master')));
 await page.click('[data-view="soundscape"]');check('rain missing visible',await page.locator('#missingSources').innerText().then(x=>x.includes('Rain bank')&&x.includes('SOURCE_REQUIRED')));
 check('no page errors',result.errors.length===0,result.errors);check('no local HTTP errors',result.httpErrors.length===0,result.httpErrors);
 await page.screenshot({path:path.join(out,'desktop.png'),fullPage:true});result.status='PASS';
}catch(e){result.status='FAIL';result.failure=String(e.stack||e);process.exitCode=1;if(page)await page.screenshot({path:path.join(out,'FAIL.png'),fullPage:true}).catch(()=>{})}
finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:result.status,checks:result.checks.length,failure:result.failure||null}));await browser.close()}
