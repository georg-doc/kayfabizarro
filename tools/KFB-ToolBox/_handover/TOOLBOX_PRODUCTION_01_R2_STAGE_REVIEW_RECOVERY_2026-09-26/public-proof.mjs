import fs from 'node:fs';
import { chromium } from 'playwright';

const STAGE='https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/production-01-r2/';
const TOOLBOX='https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/';
const HUB='https://kayfabizarro.pages.dev/kfb-hub/';
const LIVE_REG='https://raw.githubusercontent.com/georg-doc/kayfabizarro/bot/production-desk-update/registry/production/v1/lanes.json';
const MARK='KFB_TOOLBOX_PRODUCTION_01_R2_STAGE_REVIEW_RECOVERY_2026_09_26';
const ROUTE_REV='TOOLBOX_R2_REVIEW_2026_09_26';
const report={stage:STAGE,toolbox:TOOLBOX,hub:HUB,checks:[],errors:[],httpErrors:[]};
const check=(name,pass,detail=null)=>{report.checks.push({name,pass:!!pass,detail});if(!pass)throw new Error('FAIL · '+name+' · '+JSON.stringify(detail))};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function pollText(url,predicate,label,tries=160){
  let last='';
  for(let i=0;i<tries;i++){
    try{
      const sep=url.includes('?')?'&':'?';
      const r=await fetch(url+sep+'qa='+Date.now(),{cache:'no-store'});
      const t=await r.text();
      last=r.status+' '+t.slice(0,180);
      if(r.ok&&predicate(t)) return {status:r.status,text:t};
    }catch(e){last=String(e)}
    await sleep(3000);
  }
  throw new Error(label+' timeout · '+last);
}

await fs.promises.mkdir('toolbox-r2-public-proof',{recursive:true});

const stageHttp=await pollText(STAGE,t=>t.includes(MARK),'Stage marker');
check('exact Stage marker deployed',stageHttp.text.includes(MARK));
const toolboxHttp=await pollText(TOOLBOX,t=>t.includes(ROUTE_REV)&&t.includes(STAGE),'ToolBox route revision');
check('ToolBox front door revision deployed',toolboxHttp.text.includes(ROUTE_REV));
check('ToolBox front door links exact review',toolboxHttp.text.includes(STAGE));
const registryHttp=await pollText(LIVE_REG,t=>{
  try{
    const l=JSON.parse(t).lanes.find(x=>x.id==='toolbox-source-safe');
    return l?.bucket==='LOOK_AT'&&l?.review?.available===true&&l.review.url===STAGE;
  }catch{return false}
},'Live Registry ToolBox review');
const liveLane=JSON.parse(registryHttp.text).lanes.find(x=>x.id==='toolbox-source-safe');
report.liveLane=liveLane;
check('Live Registry is LOOK_AT',liveLane.bucket==='LOOK_AT',liveLane.bucket);
check('Live Registry exact review available',liveLane.review?.available===true&&liveLane.review?.url===STAGE,liveLane.review);

const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
  const stagePage=await browser.newPage({viewport:{width:1440,height:900}});
  stagePage.on('pageerror',e=>report.errors.push('stage pageerror: '+String(e)));
  stagePage.on('console',m=>{if(m.type()==='error'&&!/favicon/i.test(m.text()))report.errors.push('stage console: '+m.text())});
  stagePage.on('response',r=>{if(r.status()>=400&&!/favicon/i.test(r.url()))report.httpErrors.push({surface:'stage',status:r.status(),url:r.url()})});
  const sr=await stagePage.goto(STAGE+'?browserqa='+Date.now(),{waitUntil:'domcontentloaded',timeout:90000});
  check('Stage HTTP',!!sr&&sr.ok(),sr?.status());
  await stagePage.waitForFunction(m=>window.__KFB_TOOLBOX_R2_REVIEW?.ready===true&&window.__KFB_TOOLBOX_R2_REVIEW?.marker===m,MARK,{timeout:180000});
  const stageState=await stagePage.evaluate(()=>({
    marker:window.__KFB_TOOLBOX_R2_REVIEW.marker,
    ready:window.__KFB_TOOLBOX_R2_REVIEW.ready,
    sourceIsolated:window.__KFB_TOOLBOX_R2_REVIEW.sourceIsolated,
    errors:window.__KFB_TOOLBOX_R2_REVIEW.errors,
    packCounts:window.__KFB_TOOLBOX_R2_REVIEW.packCounts,
    frame:window.__KFB_TOOLBOX_R2_REVIEW.refreshFrame()
  }));
  report.stageState=stageState;
  check('Stage runtime marker',stageState.marker===MARK,stageState.marker);
  check('Stage runtime ready',stageState.ready===true);
  check('Source Object is isolated first',stageState.sourceIsolated===true);
  check('three KayKit packs loaded',stageState.packCounts?.General===15&&stageState.packCounts?.MovementBasic===11&&stageState.packCounts?.MovementAdvanced===13,stageState.packCounts);
  check('public source actor + ears inside safe chrome',stageState.frame?.insideSafe===true,stageState.frame);
  check('Stage runtime errors zero',stageState.errors?.length===0,stageState.errors);
  await stagePage.screenshot({path:'toolbox-r2-public-proof/01-stage-source.png',fullPage:true});

  const toolboxPage=await browser.newPage({viewport:{width:1440,height:900}});
  const tr=await toolboxPage.goto(TOOLBOX+'?browserqa='+Date.now(),{waitUntil:'domcontentloaded',timeout:90000});
  check('ToolBox front door HTTP',!!tr&&tr.ok(),tr?.status());
  check('ToolBox route revision visible',await toolboxPage.locator('[data-route-revision="'+ROUTE_REV+'"]').count()===1);
  check('ToolBox exact review link visible',await toolboxPage.locator('a[href="'+STAGE+'"]').count()>=1);
  await toolboxPage.screenshot({path:'toolbox-r2-public-proof/02-toolbox-frontdoor.png',fullPage:true});

  const hubPage=await browser.newPage({viewport:{width:1440,height:1000}});
  const hubErrors=[];
  hubPage.on('pageerror',e=>hubErrors.push('pageerror: '+String(e)));
  hubPage.on('console',m=>{if(m.type()==='error'&&!/favicon/i.test(m.text()))hubErrors.push('console: '+m.text())});
  const hr=await hubPage.goto(HUB+'?browserqa='+Date.now(),{waitUntil:'domcontentloaded',timeout:90000});
  check('KFB Hub HTTP',!!hr&&hr.ok(),hr?.status());
  await hubPage.waitForFunction(stage=>[...document.querySelectorAll('a')].some(a=>a.href===stage),STAGE,{timeout:90000});
  check('KFB Hub exact review link rendered',await hubPage.locator('a[href="'+STAGE+'"]').count()>=1);
  check('KFB Hub ToolBox review title rendered',await hubPage.getByText('ToolBox r2 · 33/33 PASS → Georg Review',{exact:true}).count()>=1);
  check('KFB Hub browser errors zero',hubErrors.length===0,hubErrors);
  report.hubErrors=hubErrors;
  await hubPage.screenshot({path:'toolbox-r2-public-proof/03-kfb-hub.png',fullPage:true});

  check('public failed HTTP assets zero',report.httpErrors.length===0,report.httpErrors);
}finally{
  await browser.close();
}

report.status='PASS';
report.summary={passed:report.checks.filter(x=>x.pass).length,total:report.checks.length,errors:report.errors.length,httpErrors:report.httpErrors.length};
fs.writeFileSync('toolbox-r2-public-proof/report.json',JSON.stringify(report,null,2)+'\n');
console.log('PUBLIC BROWSER PASS',report.summary.passed+'/'+report.summary.total,JSON.stringify(report.summary));
