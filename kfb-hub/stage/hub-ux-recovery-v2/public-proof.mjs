import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const origin='https://kayfabizarro.pages.dev';
const route='/kfb-hub/stage/hub-ux-recovery-v2/';
const stageRoute='/kfb-hub/stage/';
const liveRoute='/kfb-hub/';
const out='hub-ux-recovery-v2-public-proof';
fs.mkdirSync(out,{recursive:true});

const report={status:'UNKNOWN',route:origin+route,checks:[],errors:[],httpErrors:[]};
const check=(name,pass,detail=null)=>{
  report.checks.push({name,pass:!!pass,detail});
  if(!pass) throw new Error(name+(detail?': '+JSON.stringify(detail):''));
};

const browser=await chromium.launch({headless:true});
let page;
try{
  const ctx=await browser.newContext({viewport:{width:1440,height:900}});
  page=await ctx.newPage();
  page.on('pageerror',e=>report.errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});
  page.on('response',r=>{
    if(r.status()>=400 && !r.url().includes('favicon')) report.httpErrors.push({url:r.url(),status:r.status()});
  });

  const resp=await page.goto(origin+route,{waitUntil:'networkidle',timeout:120000});
  check('candidate HTTP 2xx',!!resp&&resp.ok(),resp?.status());
  check('exact build marker',await page.evaluate(()=>document.documentElement.dataset.kfbBuild==='HUB-UX-RECOVERY-V2'));
  await page.waitForFunction(()=>document.body.innerText.includes('Heute')&&document.body.innerText.includes('Pocket Inbox'),{timeout:30000});
  const text=await page.locator('body').innerText();
  for(const label of ['Heute','Briefings','Projekte','Entscheidungen','Archiv','Pocket Inbox']){
    check('visible surface '+label,text.includes(label));
  }
  check('shared support loaded',await page.evaluate(()=>!!customElements.get('x-dc')));
  check('no horizontal overflow desktop',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  await page.screenshot({path:path.join(out,'01-desktop.png'),fullPage:true});

  const stage=await ctx.newPage();
  const sr=await stage.goto(origin+stageRoute,{waitUntil:'networkidle',timeout:120000});
  check('stage navigator HTTP 2xx',!!sr&&sr.ok(),sr?.status());
  const card=stage.locator('[data-stage-id="hub-ux-recovery-v2"]');
  check('stage navigator card present',(await card.count())===1);
  const href=await card.locator('a.primary').getAttribute('href');
  check('stage navigator exact candidate link',href==='./hub-ux-recovery-v2/'||href===origin+route,href);
  await stage.screenshot({path:path.join(out,'02-stage-navigator.png'),fullPage:true});

  const live=await ctx.newPage();
  const lr=await live.goto(origin+liveRoute,{waitUntil:'networkidle',timeout:120000});
  check('live root HTTP 2xx',!!lr&&lr.ok(),lr?.status());
  check('live root not promoted to candidate',await live.evaluate(()=>document.documentElement.dataset.kfbBuild!=='HUB-UX-RECOVERY-V2'));

  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const mp=await mobile.newPage();
  const mr=await mp.goto(origin+route,{waitUntil:'networkidle',timeout:120000});
  check('mobile candidate HTTP 2xx',!!mr&&mr.ok(),mr?.status());
  check('mobile exact build marker',await mp.evaluate(()=>document.documentElement.dataset.kfbBuild==='HUB-UX-RECOVERY-V2'));
  check('mobile no horizontal overflow',await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  await mp.screenshot({path:path.join(out,'03-mobile.png'),fullPage:true});
  await mobile.close();

  check('no page errors',report.errors.length===0,report.errors);
  check('no HTTP failures',report.httpErrors.length===0,report.httpErrors);
  report.status='PASS';
}catch(e){
  report.status='FAIL';
  report.failure=String(e.stack||e);
  if(page) await page.screenshot({path:path.join(out,'FAIL.png'),fullPage:true}).catch(()=>{});
  process.exitCode=1;
}finally{
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({status:report.status,checks:report.checks.length,failure:report.failure||null},null,2));
  await browser.close();
}
