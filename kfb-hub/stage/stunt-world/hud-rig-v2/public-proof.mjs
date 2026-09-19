import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const GH='https://georg-doc.github.io/kayfabizarro/kfb-hub/stage/stunt-world/hud-rig-v2/';
const CF='https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/hud-rig-v2/';
const DONOR='5650b6c54d8789b20ea80abe857688173d506d3b';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const checks=[];
const pass=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name)};

async function marker(url){
  try{
    const r=await fetch(url,{cache:'no-store'}),html=await r.text();
    const rr=await fetch(url+'hud-rig-v2.mjs',{cache:'no-store'}),js=await rr.text();
    return {ok:r.ok&&rr.ok&&html.includes('KFB HUD Rig v2 · Edge Constellation')&&js.includes("DONOR_PIN='"+DONOR+"'"),status:r.status};
  }catch(e){return {ok:false,status:0,error:String(e)}}
}
async function waitMarker(label,url){
  let last={ok:false,status:0};
  for(let i=0;i<100;i++){last=await marker(url);if(last.ok){console.log('DEPLOYED',label,url);return last}await sleep(2400)}
  throw Error(label+' deploy marker timeout '+JSON.stringify(last));
}
await waitMarker('GitHub Pages',GH);
const cloudflareMarker=await marker(CF);
console.log('CLOUDFLARE_STATUS',JSON.stringify({url:CF,...cloudflareMarker}));

async function startDrive(page){
  await page.waitForFunction(()=>{
    const f=document.getElementById('driveHost'),s=f?.contentDocument?.getElementById('start');
    return !!s && !s.disabled;
  },null,{timeout:90000});
  await page.evaluate(()=>document.getElementById('driveHost').contentDocument.getElementById('start').click());
  await page.waitForFunction(()=>{
    const f=document.getElementById('driveHost'),g=f?.contentDocument?.getElementById('gate');
    return !!g && (g.hidden || f.contentWindow.getComputedStyle(g).display==='none');
  },null,{timeout:30000});
}
async function inspectPage(page,label){
  const pageErrors=[],consoleErrors=[],failed=[];
  page.on('pageerror',e=>pageErrors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
  page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
  const response=await page.goto(GH,{waitUntil:'domcontentloaded',timeout:60000});
  pass(label+' Stage HTTP OK',response?.ok()===true,'status='+response?.status());
  await page.waitForFunction(()=>window.__KFB_HUD_V2_WRAPPER__?.snapshot?.().ready===true,null,{timeout:90000});
  await page.waitForFunction(()=>window.__KFB_HUD_V2__?.ready===true,null,{timeout:90000});
  let snap=await page.evaluate(()=>window.__KFB_HUD_V2__.snapshot());
  pass(label+' exact donor pin',snap.donorPin===DONOR,snap.donorPin);
  pass(label+' exact assets loaded',Object.values(snap.assets).every(v=>v.loaded),JSON.stringify(snap.assets));
  pass(label+' central FOV clear',snap.composition.fovClear,JSON.stringify(snap.composition));
  pass(label+' owns zero keyboard keys',snap.inputOwnership.keyboardKeysOwned.length===0);
  pass(label+' creates no AudioContext',snap.inputOwnership.audioContextCreated===false);
  await startDrive(page);
  pass(label+' real Race gate cleared',await page.evaluate(()=>{
    const f=document.getElementById('driveHost'),g=f?.contentDocument?.getElementById('gate');
    return !!g && (g.hidden || f.contentWindow.getComputedStyle(g).display==='none');
  }));
  pass(label+' real Race canvas present',await page.evaluate(()=>!!document.getElementById('driveHost')?.contentDocument?.getElementById('view')));
  const sourceFailures=failed.filter(x=>/raw\.githubusercontent\.com|cdn\.jsdelivr\.net/.test(x.url));
  pass(label+' no source request failures',sourceFailures.length===0,JSON.stringify(sourceFailures));
  pass(label+' no page errors',pageErrors.length===0,JSON.stringify(pageErrors));
  pass(label+' no console errors',consoleErrors.length===0,JSON.stringify(consoleErrors));
  return {snap,pageErrors,consoleErrors,failed};
}

let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  await fs.mkdir('hud-stage-v2-evidence',{recursive:true});

  const desktop=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const d=await inspectPage(desktop,'desktop');
  await desktop.screenshot({path:'hud-stage-v2-evidence/public-desktop-driving.png',fullPage:true});

  const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const m=await inspectPage(mobile,'mobile');
  pass('mobile dedicated layout active',m.snap.mobile===true);
  pass('mobile touch band clear',m.snap.composition.touchBandClear,JSON.stringify(m.snap.composition));
  pass('mobile real touch controls present',await mobile.evaluate(()=>!!document.getElementById('driveHost')?.contentDocument?.getElementById('touch')));
  await mobile.screenshot({path:'hud-stage-v2-evidence/public-mobile-driving.png',fullPage:true});

  await fs.writeFile('hud-stage-v2-evidence/public-browser.json',JSON.stringify({url:GH,cloudflare:{url:CF,...cloudflareMarker},checks,desktop:d,mobile:m},null,2));
  console.log('PUBLIC_BROWSER_RESULT',checks.length+'/'+checks.length,'PASS');
}finally{if(browser)await browser.close()}
