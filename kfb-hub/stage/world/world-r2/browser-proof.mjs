import { chromium } from 'playwright';
import fs from 'node:fs';

const base=(process.env.WORLD_R2_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/world/world-r2/').replace(/\/?$/,'/');
const out=process.env.WORLD_R2_PROOF_DIR||'world-r2-stage-proof';
fs.mkdirSync(out,{recursive:true});
const executablePath=process.env.WORLD_R2_BROWSER_EXECUTABLE||undefined;
const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
let count=0;
function ok(name,condition,detail=''){
  if(!condition) throw new Error(`FAIL ${name}${detail?` · ${detail}`:''}`);
  count++; console.log(`ok ${count} - ${name}${detail?` · ${detail}`:''}`);
}
async function world(id){
  const page=await browser.newPage({viewport:{width:1280,height:820}});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('requestfailed',r=>failed.push(`${r.url()} :: ${r.failure()?.errorText}`));
  await page.goto(`${base}?world=${id}&selftest=wi1`,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.querySelector('#wiTest')?.textContent?.split('\n').filter(x=>x.startsWith('PASS · ')).length>=55,null,{timeout:180000});
  const d=await page.evaluate(()=>({
    marker:document.body.dataset.kfbSourceHead||'',
    failed:document.body.dataset.selftest==='FAIL',
    lines:document.querySelector('#wiTest')?.textContent?.split('\n').filter(Boolean)||[],
    facts:document.querySelector('#wiZone')?.textContent||''
  }));
  ok(`${id} source marker`,d.marker==='58028b07d7618926c40ffaec3bd4053dc88c0efd');
  ok(`${id} world selftest 55/55`,d.lines.filter(x=>x.startsWith('PASS · ')).length===55);
  ok(`${id} no selftest failure`,!d.failed);
  ok(`${id} no page errors`,errors.length===0,errors.join(' | '));
  ok(`${id} no failed source requests`,failed.length===0,failed.slice(0,4).join(' | '));
  if(id==='cologne') ok('Cologne protected landmark facts visible',/Dom|Hbf|landmark/i.test(d.facts),d.facts.slice(0,160));
  await page.screenshot({path:`${out}/${id}.png`,fullPage:true});
  await page.close();
}
await world('huerth');
await world('cologne');
{
  const page=await browser.newPage({viewport:{width:1100,height:760}});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('requestfailed',r=>failed.push(`${r.url()} :: ${r.failure()?.errorText}`));
  await page.goto(`${base}runtime/worldbuilder/wb2-terrain-sculpt-01/WB2_TERRAIN_SCULPT_01_SOURCE.html?selftest=1`,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.body.dataset.selftest==='PASS'||document.body.dataset.selftest==='FAIL',null,{timeout:180000});
  const d=await page.evaluate(()=>({state:document.body.dataset.selftest,count:document.body.dataset.selftestCount||'',text:document.querySelector('#selftest')?.textContent||''}));
  ok('accepted WB2 baseline PASS',d.state==='PASS',d.text.slice(-240));
  ok('accepted WB2 baseline remains 34/34',d.count==='34/34',d.count);
  ok('accepted WB2 no page errors',errors.length===0,errors.join(' | '));
  ok('accepted WB2 no failed source requests',failed.length===0,failed.slice(0,4).join(' | '));
  await page.screenshot({path:`${out}/wb2.png`,fullPage:true});
  await page.close();
}
await browser.close();
console.log(`WORLD R2 STAGE BROWSER PASS ${count}/${count}`);
