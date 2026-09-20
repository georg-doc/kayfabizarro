import fs from 'node:fs';
import { chromium } from 'playwright';

const URL='https://kayfabizarro.pages.dev/kfb-hub/';
const out='storytelling-map-animator-hub-evidence';
const sourceNeedles=[
  'storytelling-map-animator-sma1',
  'storytelling-map-animator-v1',
  'Storytelling Maps · Map Animator v1',
  'Storytelling Map Animator · SMA1 prepared',
  'planning/storytelling-map-animator-v1-2026-09-20'
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
      const r=await fetch(URL+'?map-animator-v1='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});
      if(r.ok){html=await r.text();if(sourceNeedles.every(n=>html.includes(n)))break;}
    }catch{}
    await sleep(10000);
  }
  check('exact Cloudflare Hub source contains Map Animator routing',sourceNeedles.every(n=>html.includes(n)),{bytes:html.length});

  browser=await chromium.launch({headless:true});
  const ctx=await browser.newContext({viewport:{width:1440,height:1000}});
  page=await ctx.newPage();
  page.on('pageerror',e=>report.errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error'&&!/favicon/i.test(m.text()))report.errors.push(m.text());});
  page.on('requestfailed',r=>{if(!/favicon/i.test(r.url()))report.failedRequests.push({url:r.url(),error:r.failure()?.errorText||'failed'});});
  const nav=await page.goto(URL+'?map-animator-v1='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
  check('Hub HTTP',nav?.ok(),nav?.status());

  await page.getByRole('button',{name:'Briefings',exact:true}).click();
  await page.waitForFunction(()=>document.body.innerText.includes('Storytelling Maps · Map Animator v1'),{}, {timeout:30000});
  check('Briefings shows Map Animator', (await page.locator('body').innerText()).includes('Storytelling Maps · Map Animator v1'));
  await page.screenshot({path:out+'/hub-briefings-desktop.png',fullPage:true});

  await page.getByRole('button',{name:'To-dos',exact:true}).click();
  await page.waitForFunction(()=>document.body.innerText.includes('Storytelling Map Animator · SMA1 prepared'),{}, {timeout:30000});
  check('To-dos shows SMA1 prepared', (await page.locator('body').innerText()).includes('Storytelling Map Animator · SMA1 prepared'));

  const mobile=await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true});
  const mp=await mobile.newPage();
  await mp.goto(URL+'?map-animator-v1-mobile='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
  await mp.getByRole('button',{name:'Briefings',exact:true}).click();
  await mp.waitForFunction(()=>document.body.innerText.includes('Storytelling Maps · Map Animator v1'),{}, {timeout:30000});
  await mp.screenshot({path:out+'/hub-briefings-mobile-landscape.png',fullPage:true});
  await mobile.close();

  check('no page errors',report.errors.length===0,report.errors);
  check('no failed HTTP requests',report.failedRequests.length===0,report.failedRequests);
  report.status='PASS';
}catch(e){
  report.status='FAIL';
  report.failure=String(e.stack||e);
  process.exitCode=1;
  if(page){try{await page.screenshot({path:out+'/failure.png',fullPage:true,timeout:5000});}catch{}}
}finally{
  await browser?.close();
  fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
}
