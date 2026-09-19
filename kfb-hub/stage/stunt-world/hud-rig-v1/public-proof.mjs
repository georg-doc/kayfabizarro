import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const URL='https://georg-doc.github.io/kayfabizarro/kfb-hub/stage/stunt-world/hud-rig-v1/';
const CLOUDFLARE_URL='https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/hud-rig-v1/';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const checks=[];const pass=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name)};
let marker=false,lastStatus=0,lastText='',runtimeText='';
for(let i=0;i<75;i++){
  try{
    const r=await fetch(URL,{cache:'no-store'});lastStatus=r.status;lastText=await r.text();
    const rr=await fetch(URL+'hud-rig-lab.mjs',{cache:'no-store'});runtimeText=await rr.text();
    if(r.ok&&rr.ok&&lastText.includes('KFB Stunt World · HUD Rig Lab v1')&&runtimeText.includes('never the speaker grille')){marker=true;break}
  }catch{}
  await sleep(2400);
}
pass('GitHub Pages deployed final HUD runtime marker',marker,'status='+lastStatus);
let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const pageErrors=[],consoleErrors=[],failed=[];
  page.on('pageerror',e=>pageErrors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
  page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
  const response=await page.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
  pass('public GitHub Pages Stage HTTP OK',response?.ok()===true,'status='+response?.status());
  await page.waitForFunction(()=>window.__KFB_HUD_RIG_V1__?.ready===true,{timeout:60000});
  const s=await page.evaluate(()=>window.__KFB_HUD_RIG_V1__.snapshot());
  pass('public exact asset pin',s.sourcePin==='13bee1bb6db0f27fbd13da2a3750f19859ca58af');
  pass('public real radio loaded',s.assets.radio.loaded===true);
  pass('public radio handle removed',s.assets.radio.handleRemoved===true);
  pass('public real arrow loaded',s.assets.arrow.loaded===true);
  pass('public real gear loaded',s.assets.gear.loaded===true);
  pass('public owns no keyboard keys',s.inputOwnership.keyboardKeysOwned.length===0);
  pass('public creates no audio engine',s.inputOwnership.audioContextCreated===false);
  await fs.mkdir('hud-stage-evidence',{recursive:true});
  await page.screenshot({path:'hud-stage-evidence/public-hud-rig-v1.png',fullPage:true});
  pass('public no page errors',pageErrors.length===0,JSON.stringify(pageErrors));
  pass('public no console errors',consoleErrors.length===0,JSON.stringify(consoleErrors));
  const sourceFailures=failed.filter(x=>/raw\.githubusercontent\.com|cdn\.jsdelivr\.net/.test(x.url));
  pass('public no source failures',sourceFailures.length===0,JSON.stringify(sourceFailures));
  let cloudflare={url:CLOUDFLARE_URL,status:0,marker:false};
  try{const cr=await fetch(CLOUDFLARE_URL,{cache:'no-store'});cloudflare.status=cr.status;cloudflare.marker=(await cr.text()).includes('KFB Stunt World · HUD Rig Lab v1')}catch(e){cloudflare.error=String(e)}
  console.log('CLOUDFLARE_NONBLOCKING',JSON.stringify(cloudflare));
  await fs.writeFile('hud-stage-evidence/public-browser.json',JSON.stringify({url:URL,cloudflare,checks,pageErrors,consoleErrors,failed,snapshot:s},null,2));
  console.log('PUBLIC_BROWSER_RESULT',checks.length+'/'+checks.length,'PASS');
}finally{if(browser)await browser.close()}
