import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const URL='https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/hud-racer-v2/';
const MARK='KFB Race · Clean Racer HUD v2';
const TESTED='35ca982c9e62b4f14df207a6d31bb808b0a4f965';
const checks=[];
const pass=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name)};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function marker(){
  try{
    const r=await fetch(URL,{cache:'no-store'}),txt=await r.text();
    return {ok:r.ok&&txt.includes(MARK),status:r.status,title:(txt.match(/<title>(.*?)<\/title>/i)||[])[1]||null};
  }catch(e){return {ok:false,status:0,error:String(e)}}
}
let last;
for(let i=0;i<120;i++){
  last=await marker();
  if(last.ok){console.log('DEPLOYED',URL,TESTED);break}
  if(i===119)throw Error('Cloudflare marker timeout '+JSON.stringify(last));
  await sleep(3000);
}

await fs.mkdir('hud-racer-v2-stage-evidence',{recursive:true});
let browser;

async function run(label,viewport,mobile=false){
  const page=await browser.newPage({viewport,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
  const errors=[],failed=[],tolerated=[];
  page.on('pageerror',e=>errors.push('pageerror '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{
    if(r.status()<400)return;
    const u=r.url();
    if(r.status()===404&&u.endsWith('/overworld/card-grids.json'))tolerated.push({status:r.status(),url:u});
    else failed.push({status:r.status(),url:u});
  });
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const response=await page.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
  pass(label+' HTTP',response?.ok()===true,'status='+response?.status());
  await page.waitForFunction(()=>window.__KFB_HUD_RACER_V2__?.ready===true,null,{timeout:120000});
  let snap=await page.evaluate(()=>window.__KFB_HUD_RACER_V2__.snapshot());
  pass(label+' no HUD error',!snap.error,String(snap.error));
  pass(label+' visual SSOT marker',snap.visualSSOT==='CHAT_ACCEPTED_CLEAN_RACER_2026-09-19');
  pass(label+' same-origin host',snap.sameOrigin===true);
  pass(label+' real radio owner',snap.radioReady===true&&snap.radioSource==='BOX1_RADIO_MODULE',JSON.stringify(snap));
  pass(label+' real Card art',snap.almanacReady===true&&snap.cards===4,JSON.stringify(snap));
  pass(label+' minimap connected',snap.minimap===true);
  pass(label+' zero HUD drive keys',snap.keyboardKeysOwned.length===0);
  pass(label+' no fake waypoint',snap.layout?.waypoint==='DORMANT_NO_DESTINATION_OWNER');

  const ui=await page.evaluate(()=>{
    const f=document.getElementById('driveHost'),d=f?.contentDocument,w=f?.contentWindow;
    const old=d?.querySelector('.hud'),lab=d?.getElementById('labToggle'),mini=d?.getElementById('miniWrap'),touch=d?.querySelector('.touch');
    const rect=id=>{const r=document.getElementById(id)?.getBoundingClientRect();return r?{left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}:null};
    const mr=mini?.getBoundingClientRect(),tr=touch?.getBoundingClientRect();
    return {
      oldHud:old?w.getComputedStyle(old).display:null,
      lab:lab?w.getComputedStyle(lab).display:null,
      mini:mini?{display:w.getComputedStyle(mini).display,left:mr.left,top:mr.top,right:mr.right,bottom:mr.bottom}:null,
      touch:touch?{display:w.getComputedStyle(touch).display,left:tr.left,top:tr.top,right:tr.right,bottom:tr.bottom}:null,
      radio:rect('audioStrip'),speed:rect('speedCluster'),almanac:rect('almanac')
    };
  });
  pass(label+' old HUD hidden',ui.oldHud==='none',JSON.stringify(ui));
  pass(label+' Lab chrome hidden',ui.lab==='none',JSON.stringify(ui));
  pass(label+' Mini-map visible',ui.mini?.display!=='none',JSON.stringify(ui));

  const fov={left:viewport.width*.25,right:viewport.width*.75,top:viewport.height*.09,bottom:viewport.height*.67};
  const intersects=r=>!!r&&!(r.right<=fov.left||r.left>=fov.right||r.bottom<=fov.top||r.top>=fov.bottom);
  pass(label+' central FOV clear',![ui.radio,ui.speed,ui.almanac,ui.mini].some(intersects),JSON.stringify({ui,fov}));

  const before=Math.abs(Number(snap.telemetry?.speed)||0);
  await page.evaluate(()=>{const f=document.getElementById('driveHost'),w=f.contentWindow;w.dispatchEvent(new w.KeyboardEvent('keydown',{code:'KeyW',key:'w',bubbles:true}))});
  await page.waitForTimeout(900);
  await page.evaluate(()=>{const f=document.getElementById('driveHost'),w=f.contentWindow;w.dispatchEvent(new w.KeyboardEvent('keyup',{code:'KeyW',key:'w',bubbles:true}))});
  await page.waitForTimeout(120);
  snap=await page.evaluate(()=>window.__KFB_HUD_RACER_V2__.snapshot());
  const after=Math.abs(Number(snap.telemetry?.speed)||0);
  pass(label+' Race telemetry moves',after>before+.1,JSON.stringify({before,after}));

  if(mobile){
    pass(label+' Race touch visible',ui.touch?.display!=='none',JSON.stringify(ui.touch));
    pass(label+' HUD above touch band',(ui.speed?.bottom??0)<=(ui.touch?.top??viewport.height)&&(ui.mini?.bottom??0)<=(ui.touch?.top??viewport.height),JSON.stringify(ui));
  }

  pass(label+' known card-grid fallback bounded',tolerated.length<=1,JSON.stringify(tolerated));
  pass(label+' no failed unexpected resources',failed.length===0,JSON.stringify(failed));
  pass(label+' no page/console errors',errors.length===0,JSON.stringify(errors));
  await page.screenshot({path:'hud-racer-v2-stage-evidence/'+label+'.png',fullPage:true});
  await page.close();
}

try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
  await run('desktop',{width:1440,height:900},false);
  await run('mobile',{width:390,height:844},true);
  await fs.writeFile('hud-racer-v2-stage-evidence/public-browser.json',JSON.stringify({url:URL,testedHead:TESTED,checks},null,2));
  console.log('PUBLIC_BROWSER_RESULT',checks.length+'/'+checks.length,'PASS');
}finally{if(browser)await browser.close()}
