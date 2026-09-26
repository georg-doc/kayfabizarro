import { chromium } from 'playwright';

const base='http://127.0.0.1:8765/';
const route='tools/KFB-ToolBox/worldbuilder/world-integration-01/WORLD_INTEGRATION_01_SOURCE.html';
const wb2='tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/WB2_TERRAIN_SCULPT_01_SOURCE.html';

const browser=await chromium.launch({headless:true});
let total=0;
function ok(name,cond,detail=''){
  if(!cond) throw new Error('FAIL '+name+(detail?' · '+detail:''));
  total++; console.log('ok '+total+' - '+name+(detail?' · '+detail:''));
}
async function world(zone){
  const page=await browser.newPage({viewport:{width:1280,height:820}});
  const pageErrors=[]; const failed=[];
  page.on('pageerror',e=>pageErrors.push(String(e)));
  page.on('requestfailed',r=>failed.push(r.url()+' :: '+r.failure()?.errorText));
  await page.goto(base+route+'?world='+zone+'&selftest=wi1',{waitUntil:'domcontentloaded',timeout:120000});
  try {
    await page.waitForFunction(()=>document.querySelector('#wiTest')?.textContent?.split('\n').filter(x=>x.startsWith('PASS · ')).length>=55,null,{timeout:180000});
  } catch (err) {
    const diag=await page.evaluate(()=>({
      status:document.querySelector('#status')?.textContent||'',
      wiTest:document.querySelector('#wiTest')?.textContent||'',
      body:document.body?.innerText?.slice(0,5000)||'',
      selftest:document.body?.dataset?.selftest||''
    })).catch(()=>({}));
    console.error('WORLD BOOT DIAGNOSTIC', JSON.stringify({zone,diag,pageErrors,failed},null,2));
    throw err;
  }
  const data=await page.evaluate(()=>({
    lines:document.querySelector('#wiTest')?.textContent?.split('\n').filter(Boolean)||[],
    fail:document.body.dataset.selftest==='FAIL',
    state:document.querySelector('#wiState')?.textContent||'',
    facts:document.querySelector('#wiZone')?.textContent||''
  }));
  const passes=data.lines.filter(x=>x.startsWith('PASS · ')).length;
  ok(zone+' world selftest 55/55',passes===55,String(passes));
  ok(zone+' no selftest failure',!data.fail);
  ok(zone+' no page errors',pageErrors.length===0,pageErrors.join(' | '));
  ok(zone+' no failed source requests',failed.length===0,failed.slice(0,4).join(' | '));
  if(zone==='cologne') ok('Cologne protected landmark facts visible',/Dom|Hbf|landmark/i.test(data.facts),data.facts.slice(0,180));
  await page.close();
}
await world('huerth');
await world('cologne');

{
  const page=await browser.newPage({viewport:{width:1100,height:760}});
  const errs=[]; page.on('pageerror',e=>errs.push(String(e)));
  await page.goto(base+wb2+'?selftest=1',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.body.dataset.selftest==='PASS'||document.body.dataset.selftest==='FAIL',null,{timeout:180000});
  const d=await page.evaluate(()=>({state:document.body.dataset.selftest,count:document.body.dataset.selftestCount||'',text:document.querySelector('#selftest')?.textContent||''}));
  ok('accepted WB2 baseline still passes',d.state==='PASS',d.text.slice(-300));
  ok('accepted WB2 baseline remains 34/34',d.count==='34/34',d.count);
  ok('accepted WB2 baseline has no page errors',errs.length===0,errs.join(' | '));
  await page.close();
}
await browser.close();
console.log('WORLD R2 BROWSER PASS '+total+'/'+total);
