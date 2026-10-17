import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const URL='https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/theatre-curtain-v1/';
const REV='curtain-v1-2026-09-20-r1';
const checks=[];
const check=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw new Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)};
await fs.mkdir('curtain-v1-public-evidence',{recursive:true});

let marker=null;
for(let i=0;i<30;i++){
  try{
    const r=await fetch(URL+'SOURCE.json',{cache:'no-store'});
    if(r.ok){
      const j=await r.json();
      if(j.candidateRevision===REV){marker=j;break}
    }
  }catch{}
  await new Promise(r=>setTimeout(r,10000));
}
check('public SOURCE marker',!!marker,JSON.stringify(marker?.candidateRevision||null));
check('candidate revision',marker?.candidateRevision===REV,String(marker?.candidateRevision));
check('local evidence carried',marker?.localEvidence?.checks==='22/22 PASS',String(marker?.localEvidence?.checks));

let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push('pageerror '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const response=await page.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
  check('public Stage HTTP',response?.ok()===true,'status='+response?.status());
  await page.waitForFunction(()=>window.__KFB_CURTAIN_V1__?.ready===true||!!window.__KFB_CURTAIN_V1__?.error,null,{timeout:120000});
  let snap=await page.evaluate(()=>({...window.__KFB_CURTAIN_V1__.snapshot(),source:window.__KFB_CURTAIN_V1__.source,error:window.__KFB_CURTAIN_V1__.error}));
  check('public bench ready',snap.ready===true,JSON.stringify(snap.error));
  check('no public bench error',!snap.error,String(snap.error));
  check('public CPU Verlet fallback',/CPU Verlet/.test(snap.backend),snap.backend);
  check('public two panels',snap.panelCount===2,String(snap.panelCount));
  check('public attachment rings',snap.hooks>=10,String(snap.hooks));
  check('public default fabric',snap.texture==='velour_velvet',snap.texture);
  check('public donor pin',snap.source?.threeExampleCommit==='7300402f96c23bfa2174ffc0da01fb4e277d33da',JSON.stringify(snap.source));
  check('public module seam',JSON.stringify(snap.api)===JSON.stringify(['mount','update','setState','impulse','reset','dispose']),JSON.stringify(snap.api));
  check('public canvas mounted',!!(await page.$('#stage canvas')));

  await page.click('#open');
  await page.waitForFunction(()=>window.__KFB_CURTAIN_V1__.snapshot().openProgress>.97,null,{timeout:15000});
  snap=await page.evaluate(()=>window.__KFB_CURTAIN_V1__.snapshot());
  check('public open reaches gather',snap.openProgress>.97,String(snap.openProgress));
  await page.waitForFunction(()=>window.__KFB_CURTAIN_V1__.snapshot().state==='open-rest',null,{timeout:15000});
  snap=await page.evaluate(()=>window.__KFB_CURTAIN_V1__.snapshot());
  check('public open rest',snap.state==='open-rest',snap.state);

  const before=snap.impulses;
  await page.click('#impact');
  await page.waitForFunction(n=>window.__KFB_CURTAIN_V1__.snapshot().impulses===n+1,before,{timeout:5000});
  snap=await page.evaluate(()=>window.__KFB_CURTAIN_V1__.snapshot());
  check('public impact',snap.impulses===before+1,String(snap.impulses));

  await page.selectOption('#fabric','hessian_230');
  await page.waitForFunction(()=>window.__KFB_CURTAIN_V1__.snapshot().texture==='hessian_230',null,{timeout:30000});
  snap=await page.evaluate(()=>window.__KFB_CURTAIN_V1__.snapshot());
  check('public fabric switch',snap.texture==='hessian_230',snap.texture);

  await page.click('#close');
  await page.waitForFunction(()=>window.__KFB_CURTAIN_V1__.snapshot().openProgress<.03,null,{timeout:15000});
  snap=await page.evaluate(()=>window.__KFB_CURTAIN_V1__.snapshot());
  check('public close returns curtain',snap.openProgress<.03,String(snap.openProgress));
  await page.waitForFunction(()=>window.__KFB_CURTAIN_V1__.snapshot().state==='closed-wind',null,{timeout:15000});
  snap=await page.evaluate(()=>window.__KFB_CURTAIN_V1__.snapshot());
  check('public closed wind',snap.state==='closed-wind',snap.state);

  await page.click('#reset');
  await page.waitForFunction(()=>window.__KFB_CURTAIN_V1__.snapshot().openProgress===0,null,{timeout:5000});
  snap=await page.evaluate(()=>window.__KFB_CURTAIN_V1__.snapshot());
  check('public reset closed idle',['closed-rest','closed-wind'].includes(snap.state),snap.state);
  check('public reset progress',snap.openProgress===0,String(snap.openProgress));

  const donor=await page.request.get(URL+'donor.html');
  check('public isolated donor route',donor.ok(),'status='+donor.status());
  const donorText=await donor.text();
  check('public donor source pin',donorText.includes('7300402f96c23bfa2174ffc0da01fb4e277d33da'));
  check('no public failed resources',failed.length===0,JSON.stringify(failed));
  check('no public browser errors',errors.length===0,JSON.stringify(errors));

  await page.screenshot({path:'curtain-v1-public-evidence/closed-reset-public.png',fullPage:true});
  await fs.writeFile('curtain-v1-public-evidence/public-browser.json',JSON.stringify({url:URL,marker,checks,snapshot:snap,errors,failed},null,2));
  console.log('CURTAIN_V1_PUBLIC_BROWSER_RESULT',checks.length+'/'+checks.length,'PASS');
}finally{if(browser)await browser.close()}
