import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const URL='https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/kcl-m1-locomotion-sync/';
const SOURCE_HEAD='d5c112af24df803462f0a326a85925f34170a5ed';
const checks=[];
const pass=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name)};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function marker(){
  try{
    const r=await fetch(URL+'SOURCE.json',{cache:'no-store'});
    const j=r.ok?await r.json():null;
    return {ok:r.ok&&j?.sourceBranchHead===SOURCE_HEAD,status:r.status,head:j?.sourceBranchHead||null};
  }catch(e){return {ok:false,status:0,error:String(e)}}
}
let last;
for(let i=0;i<180;i++){
  last=await marker();
  if(last.ok){console.log('DEPLOYED',URL,SOURCE_HEAD);break}
  if(i===179)throw Error('Cloudflare marker timeout '+JSON.stringify(last));
  await sleep(3000);
}

await fs.mkdir('kcl-m1-stage-evidence',{recursive:true});
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
  pass('HTTP',response?.ok()===true,'status='+response?.status());

  await page.waitForFunction(()=>window.__KFB_KCL_M1__?.ready===true||!!window.__KFB_KCL_M1__?.error,null,{timeout:120000});
  let snap=await page.evaluate(()=>({...window.__KFB_KCL_M1__.snapshot(),source:window.__KFB_KCL_M1__.source}));
  pass('bench ready',snap.ready===true,JSON.stringify(snap.error));
  pass('no bench error',!snap.error,String(snap.error));
  pass('exact five clips',JSON.stringify(snap.clipNames)===JSON.stringify(['Walking_A','Walking_B','Walking_C','Running_A','Running_B']),JSON.stringify(snap.clipNames));
  pass('five profiles',Object.keys(snap.profiles||{}).length===5,Object.keys(snap.profiles||{}).join(','));

  for(const name of snap.clipNames){
    const p=snap.profiles[name];
    pass(name+' duration',Number(p?.duration)>0,String(p?.duration));
    pass(name+' left contact',Array.isArray(p?.left?.contacts)&&p.left.contacts.length>0,JSON.stringify(p?.left));
    pass(name+' right contact',Array.isArray(p?.right?.contacts)&&p.right.contacts.length>0,JSON.stringify(p?.right));
    pass(name+' reference speed',Number.isFinite(p?.referenceSpeedAbs)&&p.referenceSpeedAbs>0,String(p?.referenceSpeedAbs));
    pass(name+' slip finite',Number.isFinite(p?.slipBody),String(p?.slipBody));
  }

  pass('consumer movement owner preserved',snap.ownership?.movementPhysics==='consumer',JSON.stringify(snap.ownership));
  pass('registry read-only',snap.ownership?.registry==='read-only',JSON.stringify(snap.ownership));
  pass('pinned source',snap.source?.pin==='29c7500b39d20945f4f8e73fb02fef91a055b02c',JSON.stringify(snap.source));

  await page.click('#transition');
  await page.waitForTimeout(700);
  const ui=await page.evaluate(()=>({
    metrics:document.getElementById('metrics')?.textContent||'',
    left:document.getElementById('leftBadge')?.textContent||'',
    right:document.getElementById('rightBadge')?.textContent||'',
    canvas:!!document.querySelector('#stage canvas')
  }));
  pass('WebGL canvas',ui.canvas===true);
  pass('naive lane label',/NAIVE/.test(ui.left),ui.left);
  pass('phase-sync lane label',/PHASE SYNC/.test(ui.right),ui.right);
  pass('A/B transition executed',/A target/.test(ui.metrics)&&/B target/.test(ui.metrics),ui.metrics);

  pass('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  pass('no page/console errors',errors.length===0,JSON.stringify(errors));

  await page.screenshot({path:'kcl-m1-stage-evidence/desktop.png',fullPage:true});
  await fs.writeFile('kcl-m1-stage-evidence/public-browser.json',JSON.stringify({url:URL,sourceHead:SOURCE_HEAD,snapshot:snap,ui,checks},null,2));
  console.log('PUBLIC_BROWSER_RESULT',checks.length+'/'+checks.length,'PASS');
}finally{if(browser)await browser.close()}
