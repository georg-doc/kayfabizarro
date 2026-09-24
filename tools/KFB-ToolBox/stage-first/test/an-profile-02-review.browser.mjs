import { chromium } from 'playwright';

let pass=0;
function ok(name,cond){ if(!cond) throw new Error('FAIL '+name); pass++; console.log('ok '+pass+' - '+name); }
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:920}});
const errors=[], failures=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('requestfailed',r=>failures.push(r.url()+' :: '+(r.failure()?.errorText||'failed')));
try{
  const url='http://127.0.0.1:8765/tools/KFB-ToolBox/stage-first/review/an-profile-02-review.html';
  page.on('console',(m)=>{ if(['error','warning'].includes(m.type())) console.log('review '+m.type()+': '+m.text()); });
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForFunction(()=>window.__AN_PROFILE_02_REVIEW&&(window.__AN_PROFILE_02_REVIEW.ready===true||window.__AN_PROFILE_02_REVIEW.error),null,{timeout:180000});

  let p=await page.evaluate(()=>window.__AN_PROFILE_02_REVIEW);
  if(p.error) throw new Error('plain review boot failed: '+p.error);
  ok('plain review reaches ready',p.ready===true);
  ok('exact AN-PROFILE source head is pinned',p.sourceRevision==='032c9d50cd5de6764fa37fec65cb203ed35fcb11');
  ok('Medium source loads 33 clips',p.rig==='Medium'&&p.counts.medium===33);
  ok('default source clip is selected',p.selected==='kfb_locomotion_run_forward_a');
  ok('review renders a real WebGL canvas',await page.locator('#stage canvas').count()===1);
  ok('clip browser lists the 33 real source clips',await page.locator('.clip').count()===33);
  ok('measured Data panel is visible',await page.locator('body').innerText().then(t=>t.includes('Reference speed')&&t.includes('Feet')&&t.includes('AN-PROFILE-01')));

  await page.click('#rigLarge');
  await page.waitForFunction(()=>window.__AN_PROFILE_02_REVIEW?.rig==='Large'&&window.__AN_PROFILE_02_REVIEW?.counts?.large===33,null,{timeout:180000});
  p=await page.evaluate(()=>window.__AN_PROFILE_02_REVIEW);
  ok('Large source loads 33 clips',p.rig==='Large'&&p.counts.large===33);
  ok('Large foot contacts remain visibly unknown',await page.locator('body').innerText().then(t=>t.includes('UNKNOWN_NOT_MEASURED')));

  await page.fill('#search','kfb_climb_to_top_a');
  await page.waitForFunction(()=>document.querySelectorAll('.clip').length===1);
  await page.locator('.clip').click();
  await page.waitForFunction(()=>window.__AN_PROFILE_02_REVIEW?.selected==='kfb_climb_to_top_a');
  ok('search/filter selects real climb clip',await page.locator('.clip').count()===1);
  ok('explicit endsOnTop marker is visible',await page.locator('body').innerText().then(t=>t.includes('endsOnTop @ 1')));

  ok('no page errors',errors.length===0);
  ok('no failed source/module requests',failures.length===0);
  console.log('AN-PROFILE-02 PLAIN REVIEW BROWSER PASS '+pass+'/'+pass);
} finally { await browser.close(); }
