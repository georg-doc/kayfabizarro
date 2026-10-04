import fs from 'node:fs';import path from 'node:path';import { chromium } from 'playwright';
const base=process.env.KFB_AUDIO_SITE_URL||'http://127.0.0.1:4173/tools/KFB-Audio-Site/';const out='kfb-audio-site-proof';fs.mkdirSync(out,{recursive:true});
const result={status:'UNKNOWN',checks:[],errors:[],httpErrors:[]};const check=(n,o,d=null)=>{result.checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d))};
const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});let page;
try{
 const c=await browser.newContext({viewport:{width:1440,height:1000}});page=await c.newPage();page.on('pageerror',e=>result.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')result.errors.push(m.text())});page.on('response',r=>{if(r.status()>=400&&!r.url().includes('raw.githubusercontent.com'))result.httpErrors.push({url:r.url(),status:r.status()})});
 await page.goto(base,{waitUntil:'networkidle',timeout:90000});
 check('site marker',await page.evaluate(()=>document.documentElement.dataset.kfbAudioSite==='0.2'));
 check('catalog renders >=54',await page.locator('.track').count()>=54,await page.locator('.track').count());
 check('stats says 44 RoadTrip',await page.locator('#stats').innerText().then(x=>x.includes('44 RoadTrip v2')));
 await page.selectOption('#stemFilter','stems');check('stem filter shows 14',await page.locator('.track').count()===14,await page.locator('.track').count());
 await page.click('[data-view="mix"]');check('mix visible',await page.locator('#mix').evaluate(e=>e.classList.contains('active')));
 check('B/C/D controls visible',await page.locator('[data-context]').count()===3,await page.locator('[data-context]').count());
 check('default state C',await page.locator('[data-context="C"]').getAttribute('aria-pressed')==='true');
 await page.click('[data-context="B"]');await page.click('[data-context="C"]');await page.click('[data-context="D"]');
 const dBefore=await page.evaluate(()=>window.KFBAudioSite.musicContext.getSnapshot());check('manual B-C-D reaches D',dBefore.state==='D',dBefore);check('one AudioContext after transitions',dBefore.audioContextCount===1,dBefore.audioContextCount);
 await page.click('#ttsToggle');const dDucked=await page.evaluate(()=>window.KFBAudioSite.musicContext.getSnapshot());check('D keeps separate TTS ducking',dDucked.state==='D'&&dDucked.voiceActive&&dDucked.effectiveBusGainDb.SCORE<dBefore.effectiveBusGainDb.SCORE,{before:dBefore.effectiveBusGainDb.SCORE,after:dDucked.effectiveBusGainDb.SCORE});check('TTS does not create second context',dDucked.audioContextCount===1,dDucked.audioContextCount);await page.click('#ttsToggle');
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('kfb:music-context',{detail:{state:'B',source:'qa-world-adapter',reason:'movement'}})));const adapted=await page.evaluate(()=>window.KFBAudioSite.musicContext.getSnapshot());check('external World adapter seam',adapted.state==='B'&&adapted.audioContextCount===1,adapted);
 await page.click('[data-view="prompt"]');check('Prompt Studio has B/C/D entries',await page.locator('#pStyle option').count()===3,await page.locator('#pStyle option').count());await page.selectOption('#pStyle','D');await page.fill('#pMood','rainy midnight melancholy');await page.selectOption('#pRefs',{index:0});await page.click('#buildPrompt');check('D prompt request grounded',await page.locator('#promptOut').inputValue().then(x=>x.includes('rainy midnight melancholy')&&x.includes('Conversation Style D')&&x.includes('KFB_MUSIC_CONTEXT_STYLES_BCD_v1.md')));
 await page.click('[data-view="soundscape"]');check('rain missing visible',await page.locator('#missingSources').innerText().then(x=>x.includes('Rain bank')&&x.includes('SOURCE_REQUIRED')));
 check('no page errors',result.errors.length===0,result.errors);check('no local HTTP errors',result.httpErrors.length===0,result.httpErrors);
 await page.screenshot({path:path.join(out,'desktop.png'),fullPage:true});result.status='PASS';
}catch(e){result.status='FAIL';result.failure=String(e.stack||e);process.exitCode=1;if(page)await page.screenshot({path:path.join(out,'FAIL.png'),fullPage:true}).catch(()=>{})}
finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:result.status,checks:result.checks.length,failure:result.failure||null}));await browser.close()}
