import fs from 'node:fs';
import { chromium } from 'playwright';

const URL='https://kayfabizarro.pages.dev/kfb-hub/';
const out='storytelling-maps-hub-evidence';
const required=[
  'Storytelling Maps · Claude Visual Lab VL1',
  'Review / build the rounded responsive CardRig',
  'Run Claude Design · Storytelling Visual Lab VL1',
  'WSA planning · shared legless PropActor seam',
  'Storytelling Maps · Responsive CardRig v1'
];
fs.mkdirSync(out,{recursive:true});
const report={url:URL,checks:[],errors:[],failedRequests:[]};
const check=(name,pass,details='')=>{report.checks.push({name,pass:!!pass,details});if(!pass)throw new Error(name+' '+details);};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let browser,page;
try{
  let html='';
  for(let i=0;i<30;i++){
    try{
      const r=await fetch(URL+'?storytelling-maps-vl1='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});
      if(r.ok){
        html=await r.text();
        if(required.every(x=>html.includes(x)))break;
      }
    }catch{}
    await sleep(10000);
  }
  check('exact Cloudflare Hub source contains VL1 routing',required.every(x=>html.includes(x)),{bytes:html.length});

  browser=await chromium.launch({headless:true});
  const ctx=await browser.newContext({viewport:{width:1440,height:1000}});
  page=await ctx.newPage();
  page.on('pageerror',e=>report.errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error'&&!/favicon/i.test(m.text()))report.errors.push(m.text());});
  page.on('requestfailed',r=>{if(!/favicon/i.test(r.url()))report.failedRequests.push({url:r.url(),error:r.failure()?.errorText||'failed'});});
  const nav=await page.goto(URL+'?storytelling-maps-vl1='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
  check('Hub HTTP',nav?.ok(),nav?.status());

  await page.waitForFunction((names)=>names.every(n=>document.body.innerText.includes(n)),required,{timeout:30000});
  const text=await page.locator('body').innerText();
  for(const label of required)check('visible: '+label,text.includes(label));
  await page.screenshot({path:out+'/hub-desktop.png',fullPage:true});

  const mobile=await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true});
  const mp=await mobile.newPage();
  await mp.goto(URL+'?storytelling-maps-vl1-mobile='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
  await mp.waitForFunction((names)=>names.every(n=>document.body.innerText.includes(n)),required,{timeout:30000});
  await mp.screenshot({path:out+'/hub-mobile-landscape.png',fullPage:true});
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
