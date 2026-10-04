import fs from 'node:fs';import path from 'node:path';import { chromium } from 'playwright';
const base=process.env.KFB_AUDIO_SITE_URL||'http://127.0.0.1:4173/tools/KFB-Audio-Site/';const out='kfb-audio-source-intake-proof';fs.mkdirSync(out,{recursive:true});
const result={status:'UNKNOWN',checks:[],errors:[],httpErrors:[]};const check=(n,o,d=null)=>{result.checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d))};
const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});let page;
try{
 const c=await browser.newContext({viewport:{width:1440,height:1050}});page=await c.newPage();page.on('pageerror',e=>result.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')result.errors.push(m.text())});page.on('response',r=>{if(r.status()>=400&&!r.url().includes('raw.githubusercontent.com'))result.httpErrors.push({url:r.url(),status:r.status()})});
 await page.goto(base,{waitUntil:'networkidle',timeout:90000});
 check('site marker 0.2',await page.evaluate(()=>document.documentElement.dataset.kfbAudioSite==='0.2'));
 check('69 catalog tracks',await page.locator('#catalogGrid .track').count()===69,await page.locator('#catalogGrid .track').count());
 check('stats 45 / 15',await page.locator('#stats').innerText().then(x=>x.includes('59 RoadTrip v2')&&x.includes('29 stem families')));
 check('six palette masters',await page.locator('#catalogGrid .track').filter({hasText:'Bed'}).count()>=9,await page.locator('#catalogGrid .track').filter({hasText:'Bed'}).count());
 check('three ambient winners',await page.locator('#catalogGrid .track').filter({hasText:'Ambient Bed'}).count()>=3,await page.locator('#catalogGrid .track').filter({hasText:'Ambient Bed'}).count());
 check('rain texture card',await page.locator('.track').filter({hasText:'Rain percussion · Beetle / Ring'}).count()===1);
 await page.selectOption('#stemFilter','stems');check('15 stem filter',await page.locator('#catalogGrid .track').count()===29,await page.locator('#catalogGrid .track').count());
 await page.click('[data-view="sourceLab"]');check('Source Lab visible',await page.locator('#sourceLab').evaluate(e=>e.classList.contains('active')));check('17 Eleven tests',await page.locator('#candidateGrid .candidate').count()===17,await page.locator('#candidateGrid .candidate').count());check('candidate stats',await page.locator('#candidateStats').innerText().then(x=>x.includes('17 ElevenLabs tests')));
 await page.selectOption('#candidateStatus','HUMAN_TUNE');check('HUMAN_TUNE filter nonempty',await page.locator('#candidateGrid .candidate').count()>0);
 await page.click('[data-view="soundscape"]');check('rain remains source-required',await page.locator('#missingSources').innerText().then(x=>x.includes('Rain bank')&&x.includes('SOURCE_REQUIRED')));
 check('no page errors',result.errors.length===0,result.errors);check('no local HTTP errors',result.httpErrors.length===0,result.httpErrors);
 await page.screenshot({path:path.join(out,'desktop.png'),fullPage:true});result.status='PASS';
}catch(e){result.status='FAIL';result.failure=String(e.stack||e);process.exitCode=1;if(page)await page.screenshot({path:path.join(out,'FAIL.png'),fullPage:true}).catch(()=>{})}
finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:result.status,checks:result.checks.length,failure:result.failure||null}));await browser.close()}