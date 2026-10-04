import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const URL='https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/hud-game-v3/';
const MARK='KFB Race · Game HUD v3';
const checks=[];const pass=(n,c,x='')=>{checks.push({name:n,pass:!!c,extra:x});if(!c)throw Error('FAIL '+n+' '+x);console.log('PASS',n)};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let deployed=false,last='';
for(let i=0;i<120;i++){try{const r=await fetch(URL,{cache:'no-store'}),t=await r.text();last=r.status+' '+t.slice(0,80);if(r.ok&&t.includes(MARK)){deployed=true;break}}catch(e){last=String(e)}await sleep(3000)}
if(!deployed)throw Error('Cloudflare marker timeout '+last);
await fs.mkdir('hud-game-v3-stage-evidence',{recursive:true});
let browser;
async function run(label,viewport,mobile=false){
  const page=await browser.newPage({viewport,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
  const errors=[],failed=[],tolerated=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  page.on('response',r=>{if(r.status()<400)return;const u=r.url();if(r.status()===404&&u.endsWith('/overworld/card-grids.json'))tolerated.push(u);else failed.push(r.status()+' '+u)});
  const response=await page.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});pass(label+' HTTP',response?.ok()===true,'status='+response?.status());
  await page.waitForFunction(()=>window.__KFB_HUD_GAME_V3__?.ready===true,null,{timeout:120000});
  let s=await page.evaluate(()=>window.__KFB_HUD_GAME_V3__.snapshot());
  pass(label+' no HUD error',!s.error,String(s.error));
  pass(label+' actual Race host',s.sameOrigin===true&&s.host.includes('track-lab-v08'));
  pass(label+' real radio owner',s.radioReady===true&&s.radioSource==='BOX1_RADIO_MODULE');
  pass(label+' four real landscape Cards',s.almanacReady===true&&s.cards===4&&s.cardRatios.every(r=>r>1),JSON.stringify(s.cardRatios));
  pass(label+' real Mini-map connected',s.minimap===true);
  pass(label+' zero HUD drive keys',s.keyboardKeysOwned.length===0);
  const ui=await page.evaluate(()=>{
    const f=document.getElementById('driveHost'),d=f.contentDocument,w=f.contentWindow,mini=d.getElementById('miniWrap'),touch=d.querySelector('.touch');
    const rect=e=>{const r=e.getBoundingClientRect();return{left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};
    const canv=d.getElementById('mini');
    const ctx=canv.getContext('2d',{willReadFrequently:true}),px=ctx.getImageData(0,0,canv.width,canv.height).data;
    let nonzero=0;for(let i=3;i<px.length;i+=4)if(px[i]){nonzero++;if(nonzero>200)break}
    return{
      oldHud:w.getComputedStyle(d.querySelector('.hud')).display,
      lab:w.getComputedStyle(d.getElementById('labToggle')).display,
      mini:{...rect(mini),display:w.getComputedStyle(mini).display,drawn:nonzero>200},
      touch:touch?{...rect(touch),display:w.getComputedStyle(touch).display}:null,
      radio:rect(document.getElementById('radioControls')),
      speed:rect(document.getElementById('speedCluster')),
      almanac:rect(document.getElementById('almanac')),
      radioText:document.getElementById('radioControls').innerText.trim()
    };
  });
  pass(label+' old HUD hidden',ui.oldHud==='none');
  pass(label+' lab hidden',ui.lab==='none');
  pass(label+' actual Mini-map canvas drawn',ui.mini.display!=='none'&&ui.mini.drawn,JSON.stringify(ui.mini));
  pass(label+' Radio has no visible text',ui.radioText==='');
  const fov={left:viewport.width*.25,right:viewport.width*.75,top:viewport.height*.09,bottom:viewport.height*.67};
  const hit=r=>r&&!(r.right<=fov.left||r.left>=fov.right||r.bottom<=fov.top||r.top>=fov.bottom);
  pass(label+' central FOV clear',![ui.radio,ui.speed,ui.almanac,ui.mini].some(hit),JSON.stringify(ui));
  await page.hover('#almanac');await page.waitForTimeout(300);
  const cards=await page.locator('.almanacCard').evaluateAll(es=>es.map(e=>({top:e.getBoundingClientRect().top,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})));
  pass(label+' Almanac fans downward',cards[1].top>cards[0].top+40&&cards[2].top>cards[1].top+40&&cards[3].top>cards[2].top+40,JSON.stringify(cards));
  const before=Math.abs(Number(s.telemetry?.speed)||0);
  await page.evaluate(()=>{const f=document.getElementById('driveHost'),w=f.contentWindow;w.dispatchEvent(new w.KeyboardEvent('keydown',{code:'KeyW',key:'w',bubbles:true}))});
  await page.waitForTimeout(850);
  await page.evaluate(()=>{const f=document.getElementById('driveHost'),w=f.contentWindow;w.dispatchEvent(new w.KeyboardEvent('keyup',{code:'KeyW',key:'w',bubbles:true}))});
  await page.waitForTimeout(100);s=await page.evaluate(()=>window.__KFB_HUD_GAME_V3__.snapshot());pass(label+' Race telemetry moves',Math.abs(Number(s.telemetry?.speed)||0)>before+.1,JSON.stringify({before,after:s.telemetry?.speed}));
  if(mobile){pass(label+' touch visible',ui.touch?.display!=='none',JSON.stringify(ui.touch));pass(label+' HUD above touch band',ui.speed.bottom<=ui.touch.top&&ui.mini.bottom<=ui.touch.top,JSON.stringify(ui))}
  pass(label+' known card-grid fallback bounded',tolerated.length<=1,JSON.stringify(tolerated));pass(label+' no unexpected resource failures',failed.length===0,JSON.stringify(failed));pass(label+' no page errors',errors.length===0,JSON.stringify(errors));
  await page.screenshot({path:'hud-game-v3-stage-evidence/'+label+'.png',fullPage:true});await page.close();
}
try{browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});await run('desktop',{width:1440,height:900});await run('mobile',{width:390,height:844},true);await fs.writeFile('hud-game-v3-stage-evidence/public-browser.json',JSON.stringify({url:URL,checks},null,2));console.log('PUBLIC_BROWSER_RESULT',checks.length+'/'+checks.length,'PASS')}finally{if(browser)await browser.close()}
