import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const URL='http://127.0.0.1:4173/kfb-hub/stage/game-dev-studio/theatre-curtain-v1/';
const checks=[];
function check(name,cond,extra=''){checks.push({name,pass:!!cond,extra});if(!cond)throw new Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)}
await fs.mkdir('curtain-v1-local-evidence',{recursive:true});
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
 await page.waitForFunction(()=>window.__KFB_CURTAIN_V1__?.ready===true||!!window.__KFB_CURTAIN_V1__?.error,null,{timeout:120000});
 let snap=await page.evaluate(()=>({...window.__KFB_CURTAIN_V1__.snapshot(),source:window.__KFB_CURTAIN_V1__.source,error:window.__KFB_CURTAIN_V1__.error}));
 check('bench ready',snap.ready===true,JSON.stringify(snap.error));
 check('no bench error',!snap.error,String(snap.error));
 check('CPU Verlet fallback',/CPU Verlet/.test(snap.backend),snap.backend);
 check('two panels',snap.panelCount===2,String(snap.panelCount));
 check('visible attachment rings',snap.hooks>=10,String(snap.hooks));
 check('default exact fabric',snap.texture==='velour_velvet',snap.texture);
 check('source implementation pin',snap.source?.kfbImplementationHead==='4e2de202f82b0f0d7dfa3241d6f0416a84eb15d0',JSON.stringify(snap.source));
 check('module seam',JSON.stringify(snap.api)===JSON.stringify(['mount','update','setState','impulse','reset','dispose']),JSON.stringify(snap.api));
 check('canvas mounted',!!(await page.$('#stage canvas')));

 await page.click('#open');
 await page.waitForFunction(()=>window.__KFB_CURTAIN_V1__.snapshot().openProgress>.97,null,{timeout:12000});
 snap=await page.evaluate(()=>window.__KFB_CURTAIN_V1__.snapshot());
 check('open reaches side gather',snap.openProgress>.97,String(snap.openProgress));
 await page.waitForTimeout(350);
 snap=await page.evaluate(()=>window.__KFB_CURTAIN_V1__.snapshot());
 check('open rest state',snap.state==='open-rest',snap.state);

 const before=snap.impulses;
 await page.click('#impact');
 await page.waitForTimeout(250);
 snap=await page.evaluate(()=>window.__KFB_CURTAIN_V1__.snapshot());
 check('impact API applied',snap.impulses===before+1,String(snap.impulses));

 await page.selectOption('#fabric','rough_linen');
 await page.waitForFunction(()=>window.__KFB_CURTAIN_V1__.snapshot().texture==='rough_linen',null,{timeout:30000});
 snap=await page.evaluate(()=>window.__KFB_CURTAIN_V1__.snapshot());
 check('real fabric switch',snap.texture==='rough_linen',snap.texture);

 await page.click('#close');
 await page.waitForFunction(()=>window.__KFB_CURTAIN_V1__.snapshot().openProgress<.03,null,{timeout:12000});
 await page.waitForTimeout(350);
 snap=await page.evaluate(()=>window.__KFB_CURTAIN_V1__.snapshot());
 check('close returns curtain',snap.openProgress<.03,String(snap.openProgress));
 check('closed wind state',snap.state==='closed-wind',snap.state);

 await page.click('#reset');
 snap=await page.evaluate(()=>window.__KFB_CURTAIN_V1__.snapshot());
 check('reset returns closed idle',['closed-rest','closed-wind'].includes(snap.state),snap.state);
 check('reset progress',snap.openProgress===0,String(snap.openProgress));

 const donor=await page.request.get(URL+'donor.html');
 check('isolated donor route',donor.ok(),'status='+donor.status());
 const donorText=await donor.text();
 check('donor pin visible',donorText.includes('7300402f96c23bfa2174ffc0da01fb4e277d33da'));
 check('no failed main resources',failed.length===0,JSON.stringify(failed));
 check('no page/console errors',errors.length===0,JSON.stringify(errors));

 await page.screenshot({path:'curtain-v1-local-evidence/closed-reset.png',fullPage:true});
 await fs.writeFile('curtain-v1-local-evidence/local-browser.json',JSON.stringify({url:URL,checks,snapshot:snap,errors,failed},null,2));
 console.log('CURTAIN_V1_LOCAL_BROWSER_RESULT',checks.length+'/'+checks.length,'PASS');
}finally{if(browser)await browser.close()}
