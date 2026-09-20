import fs from 'node:fs';
import { chromium } from 'playwright';

const origin='https://kayfabizarro.pages.dev';
const route='/kfb-hub/stage/storytelling-maps/t2-media-standee/';
const expected='KFB-STORYTELLING-MAPS-T2-MEDIA-STANDEE-20260920-R1';
const out='storytelling-maps-t2-evidence';
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
 const ctx=await browser.newContext({viewport:{width:1440,height:960}});
 page=await ctx.newPage();
 page.on('pageerror',e=>report.errors.push(String(e)));
 page.on('console',m=>{if(m.type()==='error'&&!/favicon/i.test(m.text()))report.errors.push(m.text());});
 page.on('requestfailed',req=>{if(!/favicon/i.test(req.url()))report.failedRequests.push({url:req.url(),error:req.failure()?.errorText||'failed'});});
 const nav=await page.goto(origin+route,{waitUntil:'domcontentloaded',timeout:60000});
 check('route HTTP',nav?.ok(),nav?.status());
 await page.waitForFunction(()=>window.KFBStorytellingT2?.report?.().ready===true,{}, {timeout:100000});
 let snap=await page.evaluate(()=>window.KFBStorytellingT2.report());
 report.runtime=snap;
 check('portrait ready',snap.portrait.ready,snap.portrait);
 check('landscape ready',snap.landscape.ready,snap.landscape);
 check('portrait frame preserved',snap.portrait.framePreserved,snap.portrait);
 check('landscape frame preserved',snap.landscape.framePreserved,snap.landscape);
 check('portrait front replaced',snap.portrait.mediaMaterialReplaced&&snap.portrait.replacementBindings>0,snap.portrait);
 check('landscape front replaced',snap.landscape.mediaMaterialReplaced&&snap.landscape.replacementBindings>0,snap.landscape);
 check('source materials discovered',snap.portrait.sourceMaterialNames.includes('boardgame')&&snap.portrait.sourceMaterialNames.includes('red_knight'),snap.portrait.sourceMaterialNames);
 await page.screenshot({path:out+'/desktop-media.png',fullPage:true});

 snap=await page.evaluate(()=>window.KFBStorytellingT2.setMedia(false));
 check('original fronts restored',!snap.portrait.mediaOn&&!snap.landscape.mediaOn,snap);
 await page.screenshot({path:out+'/desktop-original.png',fullPage:true});
 snap=await page.evaluate(()=>window.KFBStorytellingT2.setMedia(true));
 check('media fronts restored',snap.portrait.mediaOn&&snap.landscape.mediaOn,snap);

 const mobile=await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true});
 const mp=await mobile.newPage();
 await mp.goto(origin+route,{waitUntil:'domcontentloaded',timeout:60000});
 await mp.waitForFunction(()=>window.KFBStorytellingT2?.report?.().ready===true,{}, {timeout:100000});
 await mp.screenshot({path:out+'/mobile-landscape.png',fullPage:true});
 await mobile.close();

 check('no page errors',report.errors.length===0,report.errors);
 check('no failed HTTP requests',report.failedRequests.length===0,report.failedRequests);
 report.status='PASS';
}catch(e){
 report.status='FAIL';report.failure=String(e.stack||e);process.exitCode=1;
 if(page){try{await page.screenshot({path:out+'/failure.png',fullPage:true,timeout:5000});}catch{}}
}finally{
 await browser?.close();
 fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
}
