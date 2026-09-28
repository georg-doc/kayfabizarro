import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const STAGE_URL=process.env.NPC_LIFE_STAGE_URL||'https://kayfabizarro.pages.dev/kfb-hub/stage/resident/npc-life-01/';
const HUB_URL='https://kayfabizarro.pages.dev/kfb-hub/';
const EXPECTED_HEAD='ea157c52dd6cadbae1b0fe40f6cacede65ec9792';
const outDir=process.env.NPC_LIFE_PROOF_DIR||'npc-life-01-public-proof';
fs.mkdirSync(outDir,{recursive:true});

const checks=[];
function check(name,condition,detail=null){
  checks.push({name,pass:Boolean(condition),detail});
  if(!condition) throw new Error('FAIL: '+name+(detail?' · '+detail:''));
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function deployedMarker(){
  let last=null;
  for(let attempt=1;attempt<=18;attempt++){
    try{
      const response=await fetch(STAGE_URL,{cache:'no-store'});
      const html=await response.text();
      last={attempt,status:response.status,hasSlice:html.includes('data-kfb-slice="NPC-LIFE-01"'),hasHead:html.includes('data-source-head="'+EXPECTED_HEAD+'"')};
      if(response.ok&&last.hasSlice&&last.hasHead)return last;
    }catch(error){last={attempt,error:String(error)}}
    await sleep(10000);
  }
  throw new Error('Exact deployed NPC-LIFE-01 marker not visible: '+JSON.stringify(last));
}

const markerProof=await deployedMarker();
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const pageErrors=[];
const requestFailures=[];
page.on('pageerror',e=>pageErrors.push(String(e)));
page.on('requestfailed',r=>requestFailures.push(r.url()+' :: '+(r.failure()?.errorText||'')));

try{
  const response=await page.goto(STAGE_URL,{waitUntil:'domcontentloaded',timeout:60000});
  check('stage HTTP 200',response?.status()===200,String(response?.status()));
  await page.waitForFunction(()=>Boolean(window.__NPC_LIFE_01__),null,{timeout:120000});

  check('exact Stage URL opened',page.url().startsWith(STAGE_URL),page.url());
  check('slice marker visible',await page.evaluate(()=>document.documentElement.dataset.kfbSlice)==='NPC-LIFE-01');
  check('exact source head marker visible',await page.evaluate(()=>document.documentElement.dataset.sourceHead)===EXPECTED_HEAD);
  check('NPC-LIFE heading visible',(await page.locator('h1').textContent())?.includes('NPC-LIFE-01'));

  const runtime=await page.evaluate(()=>({
    slice:window.__NPC_LIFE_01__.slice,
    build:window.__NPC_LIFE_01__.build,
    loadedResidents:window.__NPC_LIFE_01__.loadedResidents,
    clipCount:window.__NPC_LIFE_01__.clipCount,
    pins:window.__NPC_LIFE_01__.pins,
    sourceText:document.querySelector('#source-status')?.textContent||''
  }));
  check('runtime identifies NPC-LIFE-01',runtime.slice==='NPC-LIFE-01',runtime.slice);
  check('runtime build v1',runtime.build==='v1',runtime.build);
  check('exact proof Residents loaded',JSON.stringify(runtime.loadedResidents.sort())===JSON.stringify(['goth-girl','toy-soldier']));
  check('real motion clips loaded',runtime.clipCount>0,String(runtime.clipCount));
  check('asset + animation pins exposed',Boolean(runtime.pins?.assets&&runtime.pins?.anims),JSON.stringify(runtime.pins));
  check('source status names Resident and Motion sources',/Resident source:/.test(runtime.sourceText)&&/Motion source:/.test(runtime.sourceText),runtime.sourceText);

  await page.locator('#source-goth').click();
  check('Goth Girl source-isolate mode',await page.locator('#beat').textContent()==='source');
  await page.locator('#source-soldier').click();
  check('Toy Soldier source-isolate mode',await page.locator('#beat').textContent()==='source');

  await page.locator('#residents').click();
  await page.waitForFunction(()=>document.querySelector('#beat')?.textContent==='react',null,{timeout:60000});
  check('Resident ↔ Resident reaches react beat',await page.locator('#beat').textContent()==='react');
  check('accept decision enabled',!(await page.locator('#accept').isDisabled()));
  check('decline decision enabled',!(await page.locator('#decline').isDisabled()));
  await page.locator('#accept').click();
  await page.waitForFunction(()=>/accept event emitted/.test(document.querySelector('#offer-status')?.textContent||''),null,{timeout:15000});
  check('accept event emitted without inventory ownership',(await page.locator('#offer-status').textContent())?.includes('inventory untouched'));
  await page.waitForFunction(()=>window.__NPC_LIFE_01__.activeBeat===null,null,{timeout:15000});

  await page.locator('#player').click();
  await page.waitForFunction(()=>document.querySelector('#beat')?.textContent==='react',null,{timeout:60000});
  check('Resident → Player reaches react beat',await page.locator('#beat').textContent()==='react');
  await page.locator('#decline').click();
  await page.waitForFunction(()=>/decline event emitted/.test(document.querySelector('#offer-status')?.textContent||''),null,{timeout:15000});
  check('decline keeps reward ownership',(await page.locator('#offer-status').textContent())?.includes('reward-owned'));

  check('no browser page errors',pageErrors.length===0,pageErrors.join(' | '));
  check('no failed source requests',requestFailures.length===0,requestFailures.slice(0,8).join(' | '));
  await page.screenshot({path:path.join(outDir,'npc-life-01-stage.png'),fullPage:true});

  const hub=await browser.newPage({viewport:{width:1440,height:1000}});
  const hubErrors=[]; const hubFailures=[];
  hub.on('pageerror',e=>hubErrors.push(String(e)));
  hub.on('requestfailed',r=>hubFailures.push(r.url()+' :: '+(r.failure()?.errorText||'')));
  const hubResponse=await hub.goto(HUB_URL,{waitUntil:'domcontentloaded',timeout:60000});
  check('Hub HTTP 200',hubResponse?.status()===200,String(hubResponse?.status()));
  await hub.waitForTimeout(3000);
  const hubBody=await hub.locator('body').innerText();
  const stageLinks=hub.locator('a[href*="/kfb-hub/stage/resident/npc-life-01/"]');
  check('Hub carries NPC-LIFE title',hubBody.includes('Residents · Living encounter bus')||hubBody.includes('NPC-LIFE-01'),hubBody.slice(0,1200));
  check('Hub links exact NPC-LIFE Stage route',await stageLinks.count()>0,String(await stageLinks.count()));
  check('Hub has no page errors',hubErrors.length===0,hubErrors.join(' | '));
  check('Hub has no failed source requests',hubFailures.length===0,hubFailures.slice(0,8).join(' | '));
  await hub.screenshot({path:path.join(outDir,'kfb-hub-npc-life-01.png'),fullPage:true});
  await hub.close();

  const report={
    schema:'kfb.npc-life-01-public-proof/1',
    stageUrl:STAGE_URL,hubUrl:HUB_URL,expectedHead:EXPECTED_HEAD,
    markerAttempt:markerProof.attempt,
    checks:checks.length,passed:checks.filter(x=>x.pass).length,failed:checks.filter(x=>!x.pass).length,
    pageErrors,requestFailures,status:'PASS'
  };
  fs.writeFileSync(path.join(outDir,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
}catch(error){
  const report={
    schema:'kfb.npc-life-01-public-proof/1',
    stageUrl:STAGE_URL,hubUrl:HUB_URL,expectedHead:EXPECTED_HEAD,
    markerAttempt:markerProof?.attempt??null,
    checks:checks.length,passed:checks.filter(x=>x.pass).length,failed:checks.filter(x=>!x.pass).length+1,
    pageErrors,requestFailures,status:'FAIL',error:String(error?.stack||error)
  };
  fs.writeFileSync(path.join(outDir,'report.json'),JSON.stringify(report,null,2)+'\n');
  try{await page.screenshot({path:path.join(outDir,'failure.png'),fullPage:true})}catch{}
  console.error(JSON.stringify(report,null,2));
  throw error;
}finally{
  await browser.close();
}
