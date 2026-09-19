import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const URL='http://127.0.0.1:4173/kfb-hub/stage/game-dev-studio/kcl-m1-locomotion-sync/';
const EXPECTED=['Walking_A','Walking_B','Walking_C','Running_A','Running_B'];
const checks=[];
function check(name,cond,extra=''){
  const row={name,pass:!!cond,extra};
  checks.push(row);
  if(!cond) throw new Error('FAIL '+name+' '+extra);
  console.log('PASS',name,extra);
}
await fs.mkdir('kcl-m1-local-evidence',{recursive:true});
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
  check('HTTP',response?.ok()===true,'status='+response?.status());

  await page.waitForFunction(()=>window.__KFB_KCL_M1__?.ready===true||!!window.__KFB_KCL_M1__?.error,null,{timeout:120000});
  let snap=await page.evaluate(()=>window.__KFB_KCL_M1__.snapshot());
  check('bench ready',snap.ready===true,JSON.stringify(snap.error));
  check('no bench error',!snap.error,String(snap.error));
  check('exact five clips',JSON.stringify(snap.clipNames)===JSON.stringify(EXPECTED),JSON.stringify(snap.clipNames));
  check('five profiles',Object.keys(snap.profiles||{}).length===5,Object.keys(snap.profiles||{}).join(','));

  for(const name of EXPECTED){
    const p=snap.profiles[name];
    check(name+' duration',Number(p?.duration)>0,String(p?.duration));
    check(name+' left contact',Array.isArray(p?.left?.contacts)&&p.left.contacts.length>0,JSON.stringify(p?.left));
    check(name+' right contact',Array.isArray(p?.right?.contacts)&&p.right.contacts.length>0,JSON.stringify(p?.right));
    check(name+' reference speed',Number.isFinite(p?.referenceSpeedAbs)&&p.referenceSpeedAbs>0,String(p?.referenceSpeedAbs));
    check(name+' slip finite',Number.isFinite(p?.slipBody),String(p?.slipBody));
  }

  check('consumer movement owner preserved',snap.ownership?.movementPhysics==='consumer',JSON.stringify(snap.ownership));
  check('registry read-only',snap.ownership?.registry==='read-only',JSON.stringify(snap.ownership));
  check('pinned source',snap.source?.pin==='29c7500b39d20945f4f8e73fb02fef91a055b02c',JSON.stringify(snap.source));

  await page.click('#transition');
  await page.waitForTimeout(900);
  const ui=await page.evaluate(()=>({
    metrics:document.getElementById('metrics')?.textContent||'',
    left:document.getElementById('leftBadge')?.textContent||'',
    right:document.getElementById('rightBadge')?.textContent||'',
    canvas:!!document.querySelector('#stage canvas')
  }));
  check('WebGL canvas',ui.canvas===true);
  check('naive lane label',/NAIVE/.test(ui.left),ui.left);
  check('phase-sync lane label',/PHASE SYNC/.test(ui.right),ui.right);
  check('A/B transition executed',/A target/.test(ui.metrics)&&/B target/.test(ui.metrics),ui.metrics);
  check('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));

  const profileSummary=Object.fromEntries(EXPECTED.map(name=>{
    const p=snap.profiles[name];
    return [name,{
      duration:p.duration,
      axis:p.axis,
      referenceSpeed:p.referenceSpeed,
      referenceSpeedAbs:p.referenceSpeedAbs,
      slipBody:p.slipBody,
      maxSlip:p.maxSlip,
      footCycle:p.footCycle,
      leftContacts:p.left.contacts,
      rightContacts:p.right.contacts,
      leftPlanted:p.left.planted,
      rightPlanted:p.right.planted
    }];
  }));
  console.log('KCL_M1_PROFILE_SUMMARY',JSON.stringify(profileSummary));
  console.log('LOCAL_BROWSER_RESULT',checks.length+'/'+checks.length,'PASS');

  await page.screenshot({path:'kcl-m1-local-evidence/desktop.png',fullPage:true});
  await fs.writeFile('kcl-m1-local-evidence/local-browser.json',JSON.stringify({
    url:URL,source:snap.source,profiles:profileSummary,ui,checks,errors,failed
  },null,2));
}finally{if(browser)await browser.close()}
