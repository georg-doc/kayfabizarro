import fs from 'node:fs';
import { chromium } from 'playwright';

const origin='https://kayfabizarro.pages.dev';
const route='/tools/kfb-cartoon-map-board/';
const localStory=JSON.parse(fs.readFileSync('tools/kfb-cartoon-map-board/data/story-demo.v1.json','utf8'));
const localApp=fs.readFileSync('tools/kfb-cartoon-map-board/src/app.js','utf8');
const buildMatch=localApp.match(/const KFB_MAP_BUILD = '([^']+)'/);
if(!buildMatch) throw new Error('KFB_MAP_BUILD missing from local app.js');
const expectedBuild=buildMatch[1];
const out='kfb-cartoon-map-board-public-evidence';
fs.mkdirSync(out,{recursive:true});

const report={
  slice:'P0.2',
  url:origin+route,
  storyVersion:localStory.version,
  expectedBuild,
  checks:[],
  errors:[],
  failedRequests:[],
  runtime:null,
  phase:null,
  diag:null,
  loadingText:null,
  humanAcceptance:'PENDING'
};
const check=(name,pass,details)=>{
  report.checks.push({name,pass:!!pass,details});
  if(!pass) throw new Error(name);
};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

let browser,page;
try{
  // Cloudflare is an external deploy from the same main tree. Wait for the exact story manifest.
  let live=false,remoteStory=null;
  for(let attempt=0;attempt<36;attempt++){
    try{
      const r=await fetch(origin+route+'data/story-demo.v1.json?ci='+Date.now(),{
        cache:'no-store',signal:AbortSignal.timeout(15000)
      });
      if(r.ok && /json/i.test(r.headers.get('content-type')||'')){
        const j=await r.json();
        if(j.schema===localStory.schema && j.version===localStory.version && j.stories?.length===localStory.stories?.length){
          live=true;remoteStory=j;break;
        }
      }
    }catch{}
    await sleep(10000);
  }
  check('Cloudflare story manifest deployed',live,{
    url:origin+route+'data/story-demo.v1.json',
    expectedVersion:localStory.version,
    actualVersion:remoteStory?.version
  });

  let appLive=false;
  for(let attempt=0;attempt<36;attempt++){
    try{
      const r=await fetch(origin+route+'src/app.js?ci='+Date.now(),{
        cache:'no-store',signal:AbortSignal.timeout(15000)
      });
      if(r.ok){
        const text=await r.text();
        if(text.includes("const KFB_MAP_BUILD = '"+expectedBuild+"'")){appLive=true;break;}
      }
    }catch{}
    await sleep(10000);
  }
  check('exact runtime build deployed',appLive,{expectedBuild,url:origin+route+'src/app.js'});

  const html=await fetch(origin+route+'?ci='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});
  check('fixed Cloudflare route HTTP',html.ok,{status:html.status,url:origin+route});
  const htmlText=await html.text();
  check('P0.2 page identity',htmlText.includes('EUROPE P0.2')&&htmlText.includes('NEXT STORY'),'P0.2 controls present');

  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const context=await browser.newContext({viewport:{width:1440,height:960}});
  page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(String(e)));
  page.on('console',m=>{
    if(m.type()==='error'&&!/favicon/i.test(m.text())) report.errors.push(m.text());
  });
  page.on('requestfailed',req=>{
    const url=req.url();
    if(!/favicon/i.test(url)) report.failedRequests.push({url,error:req.failure()?.errorText||'request failed'});
  });

  const nav=await page.goto(origin+route,{waitUntil:'domcontentloaded',timeout:60000});
  check('browser route HTTP',nav?.ok(),nav?.status());
  await page.waitForFunction(
    ()=>window.__KFB_MAP_BOARD_READY__||window.__KFB_MAP_BOARD_ERROR__,
    {},
    {timeout:125000}
  );
  report.phase=await page.evaluate(()=>window.__KFB_MAP_BOARD_PHASE__||null);
  report.diag=await page.locator('#diag').textContent();
  report.loadingText=await page.locator('#loadingText').textContent();
  check(
    'runtime boot',
    await page.evaluate(()=>!!window.__KFB_MAP_BOARD_READY__),
    {
      error:await page.evaluate(()=>window.__KFB_MAP_BOARD_ERROR__),
      phase:report.phase,
      diag:report.diag,
      loadingText:report.loadingText,
      failedRequests:report.failedRequests
    }
  );

  const snap=await page.evaluate(()=>window.KFBMapBoard?.report?.());
  report.runtime=snap;
  check('runtime build identity',snap?.build===expectedBuild,{actual:snap?.build,expectedBuild});
  check('full Europe country board populated',snap?.countriesLoaded===snap?.countriesExpected && snap?.countriesFailed===0,snap);
  check('story anchors populated',snap?.markersLoaded===localStory.stories.length,snap);
  check('map ink capability resolved',/canon v\d+ \+ map BAND adapter/.test(snap?.inkCanonStatus||''),snap?.inkCanonStatus);
  await page.screenshot({path:out+'/hero.png',fullPage:true});

  const story=await page.evaluate(()=>window.KFBMapBoard.nextStory());
  check('story focus selects country',!!story?.selected&&!!story?.storyId,story);
  check('story panel changed',/STORY FOCUS/.test(await page.locator('#selKicker').textContent()),await page.locator('#selKicker').textContent());
  await page.waitForTimeout(1400);
  await page.screenshot({path:out+'/story-focus.png',fullPage:true});

  const exploded=await page.evaluate(()=>window.KFBMapBoard.setExploded(true));
  check('explode state',exploded?.exploded===true,exploded);
  await page.waitForTimeout(1200);
  await page.screenshot({path:out+'/explode.png',fullPage:true});

  check('no browser errors',report.errors.length===0,report.errors);
  report.status='PASS';
}catch(e){
  report.status='FAIL';
  report.failure=String(e.stack||e);
  if(page){
    try{report.phase=await page.locator('#stage').getAttribute('data-boot-phase',{timeout:3000});}catch{}
    try{report.diag=await page.locator('#diag').textContent({timeout:3000});}catch{}
    try{report.loadingText=await page.locator('#loadingText').textContent({timeout:3000});}catch{}
    try{await page.screenshot({path:out+'/failure.png',fullPage:true,timeout:5000});}catch{}
  }
  process.exitCode=1;
}finally{
  await browser?.close();
  fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
}
