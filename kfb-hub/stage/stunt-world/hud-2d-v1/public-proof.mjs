import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const URL='https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/hud-2d-v1/';
const TESTED='bc5d87e605957ab8eaa83426d9ad67c5a9e0ff2c';
const checks=[];
const pass=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name)};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function marker(){
  try{
    const r=await fetch(URL+'SOURCE.json',{cache:'no-store'});
    const j=r.ok?await r.json():null;
    return {ok:r.ok&&j?.testedRuntimeHead===TESTED,status:r.status,head:j?.testedRuntimeHead||null};
  }catch(e){return {ok:false,status:0,error:String(e)}}
}
let last;
for(let i=0;i<160;i++){
  last=await marker();
  if(last.ok){console.log('DEPLOYED',URL,TESTED);break}
  if(i===159)throw Error('Cloudflare marker timeout '+JSON.stringify(last));
  await sleep(3000);
}

await fs.mkdir('hud-2d-stage-evidence',{recursive:true});
let browser;
async function run(label,viewport,mobile=false){
  const page=await browser.newPage({viewport,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push('pageerror '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const response=await page.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
  pass(label+' HTTP',response?.ok()===true,'status='+response?.status());
  await page.waitForFunction(()=>window.__KFB_HUD_2D__?.ready===true,null,{timeout:120000});
  let snap=await page.evaluate(()=>window.__KFB_HUD_2D__.snapshot());
  pass(label+' no HUD error',!snap.error,String(snap.error));
  pass(label+' same-origin Race host',snap.sameOrigin===true);
  pass(label+' real radio owner',snap.radioReady===true&&snap.radioSource==='BOX1_RADIO_MODULE',JSON.stringify(snap));
  pass(label+' real PDF Card art',snap.almanacReady===true&&snap.cardSource==='KFB_PDF_ART'&&snap.cards===4,JSON.stringify(snap));
  pass(label+' true-route minimap connected',snap.minimap===true);
  pass(label+' owns zero drive keys',Array.isArray(snap.keyboardKeysOwned)&&snap.keyboardKeysOwned.length===0);
  pass(label+' no fake waypoint',snap.layout?.waypoint==='DORMANT_NO_DESTINATION_OWNER',JSON.stringify(snap.layout));

  const ui=await page.evaluate(()=>{
    const f=document.getElementById('driveHost'),d=f?.contentDocument,w=f?.contentWindow;
    const old=d?.querySelector('.hud'),lab=d?.getElementById('labToggle'),mini=d?.getElementById('miniWrap'),touch=d?.querySelector('.touch');
    const rect=id=>{const r=document.getElementById(id)?.getBoundingClientRect();return r?{left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}:null};
    const miniR=mini?.getBoundingClientRect();
    return {
      oldHud:old?w.getComputedStyle(old).display:null,
      lab:lab?w.getComputedStyle(lab).display:null,
      mini:mini?{display:w.getComputedStyle(mini).display,left:miniR.left,top:miniR.top,right:miniR.right,bottom:miniR.bottom}:null,
      touch:touch?{display:w.getComputedStyle(touch).display,...(()=>{const r=touch.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom}})()}:null,
      speed:rect('speedDock'),radio:rect('radioDock'),almanac:rect('almanacDock')
    };
  });
  pass(label+' old HUD hidden',ui.oldHud==='none',JSON.stringify(ui));
  pass(label+' lab chrome hidden',ui.lab==='none',JSON.stringify(ui));
  pass(label+' minimap visible',ui.mini?.display!=='none',JSON.stringify(ui));

  const protectedRect={left:viewport.width*.26,right:viewport.width*.74,top:viewport.height*.10,bottom:viewport.height*.66};
  const intersects=r=>!!r&&!(r.right<=protectedRect.left||r.left>=protectedRect.right||r.bottom<=protectedRect.top||r.top>=protectedRect.bottom);
  pass(label+' central driving FOV clear',![ui.speed,ui.radio,ui.almanac,ui.mini].some(intersects),JSON.stringify({ui,protectedRect}));

  const before=Math.abs(Number(snap.telemetry?.speed)||0);
  await page.evaluate(()=>{
    const f=document.getElementById('driveHost'),w=f.contentWindow;
    w.dispatchEvent(new w.KeyboardEvent('keydown',{code:'KeyW',key:'w',bubbles:true}));
  });
  await page.waitForTimeout(900);
  await page.evaluate(()=>{
    const f=document.getElementById('driveHost'),w=f.contentWindow;
    w.dispatchEvent(new w.KeyboardEvent('keyup',{code:'KeyW',key:'w',bubbles:true}));
  });
  await page.waitForTimeout(100);
  snap=await page.evaluate(()=>window.__KFB_HUD_2D__.snapshot());
  const after=Math.abs(Number(snap.telemetry?.speed)||0);
  pass(label+' Race telemetry moves',after>before+.1,JSON.stringify({before,after}));

  if(mobile){
    pass(label+' Race touch controls visible',ui.touch?.display!=='none',JSON.stringify(ui.touch));
    const touchTop=ui.touch?.top??viewport.height;
    pass(label+' HUD stays above touch band',(ui.speed?.bottom??0)<=touchTop&&(ui.mini?.bottom??0)<=touchTop,JSON.stringify({speed:ui.speed,mini:ui.mini,touch:ui.touch}));
  }

  pass(label+' no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  pass(label+' no page/console errors',errors.length===0,JSON.stringify(errors));
  await page.screenshot({path:'hud-2d-stage-evidence/'+label+'.png',fullPage:true});
  await page.close();
}

try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
  await run('desktop',{width:1440,height:900},false);
  await run('mobile',{width:390,height:844},true);
  await fs.writeFile('hud-2d-stage-evidence/public-browser.json',JSON.stringify({url:URL,testedHead:TESTED,checks},null,2));
  console.log('PUBLIC_BROWSER_RESULT',checks.length+'/'+checks.length,'PASS');
}finally{if(browser)await browser.close()}
