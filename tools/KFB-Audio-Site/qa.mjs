import fs from 'node:fs';import path from 'node:path';import { chromium } from 'playwright';
const base=process.env.KFB_AUDIO_SITE_URL||'http://127.0.0.1:4173/tools/KFB-Audio-Site/';const out='kfb-audio-source-intake-proof';fs.mkdirSync(out,{recursive:true});
const result={status:'UNKNOWN',checks:[],errors:[],httpErrors:[]};const check=(n,o,d=null)=>{result.checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d))};
const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});let page;
try{
 const c=await browser.newContext({viewport:{width:1440,height:1050}});page=await c.newPage();page.on('pageerror',e=>result.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')result.errors.push(m.text())});page.on('response',r=>{if(r.status()>=400&&!r.url().includes('raw.githubusercontent.com'))result.httpErrors.push({url:r.url(),status:r.status()})});
 await page.goto(base,{waitUntil:'networkidle',timeout:90000});
 check('site marker 0.3',await page.evaluate(()=>document.documentElement.dataset.kfbAudioSite==='0.3'));
 check('World is default',await page.locator('#world').evaluate(e=>e.classList.contains('active')));
 check('Journey has 8 scenes',await page.locator('#sceneStrip .scene-btn').count()===8,await page.locator('#sceneStrip .scene-btn').count());
 check('Town loads storybook bed',await page.locator('#worldTitle').innerText().then(x=>x.includes('Folk / Acoustic / Storybook')));
 await page.click('[data-scene="drive"]');
 check('Drive selects road master',await page.locator('#worldTitle').innerText().then(x=>x.includes('Wet Neon Road')));
 check('Drive activates scene',await page.locator('[data-scene="drive"]').evaluate(e=>e.classList.contains('active')));
 await page.click('[data-world-fade="16"]');check('16 second fade selected',await page.locator('[data-world-fade="16"]').evaluate(e=>e.classList.contains('active')));
 await page.click('#voiceDuck');check('Voice duck toggles',await page.locator('#voiceDuck').evaluate(e=>e.classList.contains('active')));
 await page.click('[data-view="catalog"]');
 check('69 catalog tracks',await page.locator('#catalogGrid .track').count()===69,await page.locator('#catalogGrid .track').count());
 check('stats 59 / 29',await page.locator('#stats').innerText().then(x=>x.includes('59 world')&&x.includes('29 stems')));
 await page.selectOption('#stemFilter','stems');check('29 stem filter',await page.locator('#catalogGrid .track').count()===29,await page.locator('#catalogGrid .track').count());
 await page.click('[data-view="sources"]');
 check('SFX count 1704',await page.locator('#sfxCount').innerText().then(x=>x.includes('1,704')));
 await page.fill('#sfxSearch','jump');check('SFX jump search renders',await page.locator('#sfxGrid .track').count()>0,await page.locator('#sfxGrid .track').count());
 check('17 Eleven tests',await page.locator('#candidateGrid .candidate').count()===17,await page.locator('#candidateGrid .candidate').count());
 check('rain remains source-required',await page.locator('#missingSources').innerText().then(x=>x.includes('Rain bank')&&x.includes('SOURCE_REQUIRED')));
 check('no page errors',result.errors.length===0,result.errors);check('no local HTTP errors',result.httpErrors.length===0,result.httpErrors);
 await page.screenshot({path:path.join(out,'desktop.png'),fullPage:true});result.status='PASS';
}catch(e){result.status='FAIL';result.failure=String(e.stack||e);process.exitCode=1;if(page)await page.screenshot({path:path.join(out,'FAIL.png'),fullPage:true}).catch(()=>{})}
finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:result.status,checks:result.checks.length,failure:result.failure||null}));await browser.close()}