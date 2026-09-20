import fs from 'node:fs';
import { chromium } from 'playwright';

const origin='https://kayfabizarro.pages.dev';
const route='/kfb-hub/stage/storytelling-maps/t1-donors/';
const expected='KFB-STORYTELLING-MAPS-T1-DONORS-20260920-R1';
const out='storytelling-maps-t1-evidence';
fs.mkdirSync(out,{recursive:true});
const report={url:origin+route,checks:[],errors:[],failedRequests:[]};
const check=(name,pass,details)=>{report.checks.push({name,pass:!!pass,details});if(!pass)throw new Error(name);};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let browser,page;
try{
 let marker=null;
 for(let i=0;i<30;i++){
  try{
   const r=await fetch(origin+route+'DEPLOYMENT.json?ci='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});
   if(r.ok&&/json/i.test(r.headers.get('content-type')||'')){const j=await r.json();if(j.build===expected){marker=j;break;}}
  }catch{}
  await sleep(10000);
 }
 check('exact Cloudflare marker deployed',!!marker,marker);
 browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const ctx=await browser.newContext({viewport:{width:1440,height:1000}});
 page=await ctx.newPage();
 page.on('pageerror',e=>report.errors.push(String(e)));
 page.on('console',m=>{if(m.type()==='error'&&!/favicon/i.test(m.text()))report.errors.push(m.text());});
 page.on('requestfailed',req=>{if(!/favicon/i.test(req.url()))report.failedRequests.push({url:req.url(),error:req.failure()?.errorText||'failed'});});
 const nav=await page.goto(origin+route,{waitUntil:'domcontentloaded',timeout:60000});
 check('route HTTP',nav?.ok(),nav?.status());
 await page.waitForFunction(()=>window.KFBStorytellingT1?.report?.().ready===true,{}, {timeout:120000});
 const snap=await page.evaluate(()=>window.KFBStorytellingT1.report());
 report.runtime=snap;
 check('playerstand exact donor loaded',snap.stand.loaded,snap.stand);
 check('playercard exact donor loaded',snap.card.loaded,snap.card);
 check('KayKit D20 exact donor loaded',snap.d20.loaded,snap.d20);
 check('external Three/Cannon donor ready',snap.external.ready,snap.external);
 await page.screenshot({path:out+'/desktop.png',fullPage:true});
 const result=await page.evaluate(()=>window.KFBStorytellingT1.rollD10());
 check('D10 roll resolved',!!result,result);
 check('no page errors',report.errors.length===0,report.errors);
 check('no failed HTTP requests',report.failedRequests.length===0,report.failedRequests);
 const mobile=await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true});
 const mp=await mobile.newPage();
 await mp.goto(origin+route,{waitUntil:'domcontentloaded',timeout:60000});
 await mp.waitForFunction(()=>window.KFBStorytellingT1?.report?.().ready===true,{}, {timeout:120000});
 await mp.screenshot({path:out+'/mobile-landscape.png',fullPage:true});
 await mobile.close();
 report.status='PASS';
}catch(e){
 report.status='FAIL';report.failure=String(e.stack||e);process.exitCode=1;
 if(page){try{await page.screenshot({path:out+'/failure.png',fullPage:true,timeout:5000});}catch{}}
}finally{
 await browser?.close();
 fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
}
