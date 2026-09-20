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

  // The Hub intentionally limits the default "Heute" surface. Prove visibility
  // through the actual UI filters instead of requiring all routed items at once.
  await page.waitForFunction(()=>document.body.innerText.includes('Review / build the rounded responsive CardRig'),{}, {timeout:30000});
  check('default Heute shows CardRig P0', (await page.locator('body').innerText()).includes('Review / build the rounded responsive CardRig'));

  await page.getByRole('button',{name:'Briefings',exact:true}).click();
  await page.waitForFunction(()=>document.body.innerText.includes('Storytelling Maps · Claude Visual Lab VL1')&&document.body.innerText.includes('Storytelling Maps · Responsive CardRig v1'),{}, {timeout:30000});
  let text=await page.locator('body').innerText();
  check('Briefings shows Claude VL1',text.includes('Storytelling Maps · Claude Visual Lab VL1'));
  check('Briefings shows CardRig contract',text.includes('Storytelling Maps · Responsive CardRig v1'));
  await page.screenshot({path:out+'/hub-briefings-desktop.png',fullPage:true});

  await page.getByRole('button',{name:'To-dos',exact:true}).click();
  await page.waitForFunction(()=>document.body.innerText.includes('Run Claude Design · Storytelling Visual Lab VL1')&&document.body.innerText.includes('WSA planning · shared legless PropActor seam'),{}, {timeout:30000});
  text=await page.locator('body').innerText();
  check('To-dos shows CardRig',text.includes('Review / build the rounded responsive CardRig'));
  check('To-dos shows Claude VL1',text.includes('Run Claude Design · Storytelling Visual Lab VL1'));
  check('To-dos shows WSA PropActor',text.includes('WSA planning · shared legless PropActor seam'));

  const mobile=await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true});
  const mp=await mobile.newPage();
  await mp.goto(URL+'?storytelling-maps-vl1-mobile='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
  await mp.getByRole('button',{name:'Briefings',exact:true}).click();
  await mp.waitForFunction(()=>document.body.innerText.includes('Storytelling Maps · Claude Visual Lab VL1'),{}, {timeout:30000});
  await mp.screenshot({path:out+'/hub-briefings-mobile-landscape.png',fullPage:true});
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
