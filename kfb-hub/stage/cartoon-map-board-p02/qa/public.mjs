import fs from 'node:fs';
import { chromium } from 'playwright';

const origin='https://kayfabizarro.pages.dev';
const route='/kfb-hub/stage/cartoon-map-board-p02/';
const expectedBuild='KFB-CARTOON-MAP-BOARD-P02-EXP-20260920-R1';
const expectedRuntime='p0.2-stage-exp-r1';
const out='cartoon-map-board-p02-stage-evidence';
fs.mkdirSync(out,{recursive:true});

const report={url:origin+route,expectedBuild,expectedRuntime,checks:[],errors:[],failedRequests:[]};
const check=(name,pass,details)=>{report.checks.push({name,pass:!!pass,details});if(!pass)throw new Error(name);};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let browser,page;

try{
  let marker=null;
  for(let i=0;i<30;i++){
    try{
      const r=await fetch(origin+route+'DEPLOYMENT.json?ci='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});
      if(r.ok && /json/i.test(r.headers.get('content-type')||'')){
        const j=await r.json();
        if(j.build===expectedBuild){marker=j;break;}
      }
    }catch{}
    await sleep(10000);
  }
  check('exact Cloudflare marker deployed',!!marker,marker);

  const html=await fetch(origin+route+'?ci='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});
  check('Stage route HTTP',html.ok,{status:html.status});
  const htmlText=await html.text();
  check('Stage page identity',htmlText.includes('Experimental Stage')&&htmlText.includes('NEXT STORY'),{length:htmlText.length});

  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const context=await browser.newContext({viewport:{width:1440,height:960}});
  page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error'&&!/favicon/i.test(m.text()))report.errors.push(m.text());});
  page.on('requestfailed',req=>{if(!/favicon/i.test(req.url()))report.failedRequests.push({url:req.url(),error:req.failure()?.errorText||'failed'});});

  const nav=await page.goto(origin+route,{waitUntil:'domcontentloaded',timeout:60000});
  check('browser route HTTP',nav?.ok(),nav?.status());
  await page.waitForFunction(()=>window.__KFB_MAP_BOARD_READY__||window.__KFB_MAP_BOARD_ERROR__,{}, {timeout:160000});
  const snap=await page.evaluate(()=>window.KFBMapBoard?.report?.());
  report.runtime=snap;
  check('runtime ready',snap?.ready===true,snap);
  check('runtime build identity',snap?.build===expectedRuntime,snap?.build);
  check('Europe board populated',snap?.countriesLoaded>=30&&snap?.countriesFailed<=8,snap);
  check('story markers populated',snap?.markersLoaded>=3,snap);
  check('ink capability resolved',/map BAND adapter/.test(snap?.inkCanonStatus||''),snap?.inkCanonStatus);

  await page.screenshot({path:out+'/hero.png',fullPage:true});
  const story=await page.evaluate(()=>window.KFBMapBoard.nextStory());
  check('NEXT STORY works',!!story?.storyId&&!!story?.selected,story);
  await page.waitForTimeout(1000);
  await page.screenshot({path:out+'/story.png',fullPage:true});

  const exploded=await page.evaluate(()=>window.KFBMapBoard.setExploded(true));
  check('EXPLODE works',exploded?.exploded===true,exploded);
  await page.waitForTimeout(900);
  await page.screenshot({path:out+'/explode.png',fullPage:true});

  check('no page errors',report.errors.length===0,report.errors);
  report.status='PASS';
}catch(e){
  report.status='FAIL';
  report.failure=String(e.stack||e);
  if(page){try{await page.screenshot({path:out+'/failure.png',fullPage:true,timeout:5000});}catch{}}
  process.exitCode=1;
}finally{
  await browser?.close();
  fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
}
