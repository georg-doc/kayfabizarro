import fs from 'node:fs';
const {chromium}=await import(process.env.KFB_PLAYWRIGHT_PATH||'playwright');

const base=(process.env.RSM01_BASE_URL||'http://127.0.0.1:4198/kfb-hub/stage/town/resident-social-memory-01/').replace(/\/?$/,'/');
const out=process.env.RSM01_PROOF_DIR||'resident-social-memory-01-proof';
fs.mkdirSync(out,{recursive:true});

const browser=await chromium.launch({headless:true,executablePath:process.env.KFB_BROWSER_EXECUTABLE||undefined});
let count=0;
const ok=(name,value,detail='')=>{if(!value)throw Error('FAIL '+name+(detail?' · '+detail:''));console.log('ok '+(++count)+' - '+name)};

async function open(spec){
  const page=await browser.newPage({viewport:{width:spec.width,height:spec.height}});
  const errors=[],failed=[],http=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  page.on('requestfailed',r=>failed.push(r.url()+' :: '+r.failure()?.errorText));
  page.on('response',r=>{if(r.status()>=400)http.push(r.status()+' '+r.url())});
  await page.goto(base+'?world=huerth',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.body.dataset.residentSocialReady==='true',null,{timeout:120000});
  await page.waitForTimeout(1000);
  return {page,errors,failed,http};
}

{
  const {page,errors,failed,http}=await open({width:1280,height:820});
  let report=await page.evaluate(()=>window.__residentSocialMemory.report());
  ok('desktop Stage marker',await page.evaluate(()=>document.body.dataset.kfbStage)==='RESIDENT-SOCIAL-MEMORY-01');
  ok('desktop real World M2A still active',report.world.sameWorld===true&&report.world.trackProxy===false);
  ok('desktop two residents mounted',report.residents.residents.length===2,JSON.stringify(report.residents.residents.map(x=>x.id)));
  ok('desktop Clown routine is real juggle cascade',report.residents.residents.find(x=>x.id==='clown')?.activity==='juggle-cascade-v1');
  ok('desktop Goth Girl routine mounted',report.residents.residents.find(x=>x.id==='goth-girl')?.activity==='sit-wave-performance');
  ok('desktop one shared E owner reports interaction target shape','target' in report.world.interaction);

  await page.evaluate(()=>{
    window.__rsmEvents={speech:[],journey:[],reaction:[]};
    addEventListener('kfb-chatterbox-request',e=>window.__rsmEvents.speech.push(e.detail));
    addEventListener('kfb-journey-event',e=>window.__rsmEvents.journey.push(e.detail));
    addEventListener('kfb-resident-reaction-request',e=>window.__rsmEvents.reaction.push(e.detail));
    const api=window.__residentSocialMemory;
    const clown=api.residents.residents.find(r=>r.id==='clown');
    const p=clown.module.root.position;
    api.app.play.place(p.x,p.z+2,Math.PI);
  });
  await page.waitForTimeout(350);
  report=await page.evaluate(()=>window.__residentSocialMemory.report());
  ok('desktop resolver selects nearby Resident',report.world.interaction.target?.kind==='resident'&&report.world.interaction.target?.id==='resident:clown',JSON.stringify(report.world.interaction.target));
  ok('desktop existing UI names Resident target',(await page.locator('#m1-hint').innerText()).includes('talk to Clown'));

  const first=await page.evaluate(()=>window.__residentSocialMemory.mobility.interact({source:'browser-proof'}));
  ok('desktop E resolver performs external Resident interaction',first.action==='EXTERNAL_INTERACTION'&&first.target?.residentId==='clown',JSON.stringify(first));
  await page.waitForTimeout(520);
  report=await page.evaluate(()=>window.__residentSocialMemory.report());
  let events=await page.evaluate(()=>window.__rsmEvents);
  const clown1=report.residents.residents.find(x=>x.id==='clown');
  ok('desktop first interaction produces one witnessed memory',clown1.memoryCount===1&&clown1.meaningfulReceipts===1,JSON.stringify(clown1));
  ok('desktop first speech is semantic Triplet without recall Fluff-o-lect',events.speech.length===1&&events.speech[0].mode==='semantic-triplet'&&events.speech[0].fluffOlect===null,JSON.stringify(events.speech));
  ok('desktop Reaction Choreography request emitted once',events.reaction.length===1&&events.reaction[0].noSecondMixer===true);
  ok('desktop Journey receipt emitted after interpretation',events.journey.length===1&&events.journey[0].eventType==='resident.interaction.witnessed');
  ok('desktop AIDA reached interpret/remember',clown1.history.some(x=>x.state==='interpret_remember'));

  await page.waitForTimeout(1400);
  report=await page.evaluate(()=>window.__residentSocialMemory.report());
  let clown=report.residents.residents.find(x=>x.id==='clown');
  ok('desktop routine resumes after interaction',clown.state==='routine'&&clown.activityEnabled===true,JSON.stringify(clown));
  ok('desktop AIDA recorded return/resume',clown.history.some(x=>x.state==='return_resume_retarget'));

  await page.waitForTimeout(900);
  const second=await page.evaluate(()=>window.__residentSocialMemory.mobility.interact({source:'browser-proof-recall'}));
  ok('desktop second E interaction accepted after cooldown',second.action==='EXTERNAL_INTERACTION',JSON.stringify(second));
  await page.waitForTimeout(520);
  report=await page.evaluate(()=>window.__residentSocialMemory.report());
  events=await page.evaluate(()=>window.__rsmEvents);
  clown=report.residents.residents.find(x=>x.id==='clown');
  ok('desktop second witnessed memory is bounded append',clown.memoryCount===2&&clown.meaningfulReceipts===2,JSON.stringify(clown));
  ok('desktop second speech uses context-valid Fluff-o-lect',events.speech.length===2&&events.speech[1].fluffOlect?.omitted==='juggling routine',JSON.stringify(events.speech[1]));
  ok('desktop recall context cites visible activity + prior memory',events.speech[1].fluffOlect?.recoverableFrom?.includes('visible:juggle-cascade-v1')&&events.speech[1].fluffOlect?.recoverableFrom?.includes('memory:prior witnessed interaction'));
  ok('desktop social thread continues instead of duplicating identity',clown.thread?.turns===2,JSON.stringify(clown.thread));
  ok('desktop two Journey receipts only for two meaningful witnessed interactions',events.journey.length===2);

  await page.screenshot({path:out+'/desktop-resident-social.png',fullPage:true});
  ok('desktop no page errors',errors.length===0,errors.join(' | '));
  ok('desktop no failed requests',failed.length===0,failed.slice(0,5).join(' | '));
  ok('desktop no HTTP errors',http.length===0,http.slice(0,5).join(' | '));
  await page.close();
}

{
  const {page,errors,failed,http}=await open({width:390,height:844});
  const report=await page.evaluate(()=>window.__residentSocialMemory.report());
  ok('narrow two residents mounted',report.residents.residents.length===2);
  ok('narrow existing World controls fit viewport',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&[...document.querySelectorAll('#m1-bar button')].every(b=>{const x=b.getBoundingClientRect();return x.left>=0&&x.right<=innerWidth})));
  ok('narrow no replacement Resident chrome',await page.locator('#m1-ui').count()===1&&await page.locator('#resident-panel').count()===0);
  await page.screenshot({path:out+'/narrow-resident-social.png',fullPage:true});
  ok('narrow no page errors',errors.length===0,errors.join(' | '));
  ok('narrow no failed requests',failed.length===0,failed.slice(0,5).join(' | '));
  ok('narrow no HTTP errors',http.length===0,http.slice(0,5).join(' | '));
  await page.close();
}

await browser.close();
console.log('RESIDENT SOCIAL MEMORY BROWSER PASS '+count+'/'+count);
