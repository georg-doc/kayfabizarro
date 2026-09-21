import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=(process.env.KLR_KIT_F1_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/toolbox/legacy-rpg-rigging/').replace(/\/?$/,'/');
const OUT=process.env.KLR_KIT_F1_PROOF_DIR||'klr-kit-f1-evidence';
const SEED='gate-16';
const checks=[];
const check=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)};

await fs.mkdir(OUT,{recursive:true});
let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1540,height:1000},deviceScaleFactor:1});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push('pageerror '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  check('HTTP',response?.ok()===true,'status='+response?.status());
  await page.waitForFunction(()=>document.querySelector('#bootBadge')?.textContent==='READY',null,{timeout:120000});
  check('boot READY',await page.locator('#bootBadge').textContent()==='READY');
  check('randomizer UI exists',await page.locator('#recipeSeed').count()===1&&await page.locator('#randomizeBtn').count()===1);
  check('WebGL canvas',await page.locator('#stage canvas').count()===1);

  await page.waitForFunction(()=>document.querySelector('#loading')?.hidden===true,null,{timeout:60000});
  check('initial source isolate settled',await page.locator('#loading').evaluate(el=>el.hidden===true));

  const previousReady=await page.evaluate(()=>document.documentElement.dataset.assemblyReady||'');
  await page.fill('#recipeSeed',SEED);
  await page.click('#randomizeBtn');
  await page.waitForFunction(
    ({seed,prev})=>{
      const d=document.documentElement.dataset;
      return d.recipeSeed===seed&&d.assemblyRequest&&d.assemblyRequest!==prev&&(d.assemblyState==='ready'||d.assemblyState==='error');
    },
    {seed:SEED,prev:previousReady},
    {timeout:120000}
  );

  const dom=await page.evaluate(()=>({
    assemblyState:document.documentElement.dataset.assemblyState||'',
    assemblyRequest:document.documentElement.dataset.assemblyRequest||'',
    assemblyReady:document.documentElement.dataset.assemblyReady||'',
    assemblyBody:document.documentElement.dataset.assemblyBody||'',
    assemblyHead:document.documentElement.dataset.assemblyHead||'',
    recipeSeed:document.documentElement.dataset.recipeSeed||'',
    recipeKey:document.documentElement.dataset.recipeKey||'',
    body:document.querySelector('#bodySelect')?.value||'',
    head:document.querySelector('#headSelect')?.value||'',
    right:document.querySelector('#rightWeapon')?.value||'',
    left:document.querySelector('#leftWeapon')?.value||'',
    rig:document.querySelector('#rigStatus')?.textContent||'',
    mode:document.querySelector('#stageMode')?.textContent||'',
    object:document.querySelector('#stageObject')?.textContent||'',
    assemblyReport:document.querySelector('#assemblyReport')?.textContent||''
  }));
  check('gate-16 ready',dom.assemblyState==='ready',dom.assemblyReport.slice(0,500));
  check('ready token matches request',dom.assemblyReady===dom.assemblyRequest,dom.assemblyReady);
  check('assembly identity token',dom.assemblyBody==='knight'&&dom.assemblyHead==='rogue-c',JSON.stringify({body:dom.assemblyBody,head:dom.assemblyHead}));
  check('UI identity exact',dom.body==='knight'&&dom.head==='rogue-c',JSON.stringify({body:dom.body,head:dom.head}));
  check('no held item',dom.right===''&&dom.left==='',JSON.stringify({right:dom.right,left:dom.left}));
  check('Rig_Legacy ready',dom.rig==='RIG_LEGACY',dom.rig);
  check('assembled stage',dom.mode==='ASSEMBLED',dom.mode);
  check('visible identity',/Knight/.test(dom.object)&&/Rogue Head C/.test(dom.object),dom.object);

  const report=JSON.parse(await page.locator('#recipeReport').textContent());
  check('recipe seed exact',report.seed===SEED,report.seed);
  check('recipe body/head exact',report.recipe?.bodyId==='knight'&&report.recipe?.headId==='rogue-c',JSON.stringify(report.recipe));
  check('recipe held exact',report.recipe?.held?.right===null&&report.recipe?.held?.left===null,JSON.stringify(report.recipe?.held));
  check('recipe key DOM exact',report.key===dom.recipeKey,dom.recipeKey);
  check('30 clips retained',/"clips": 30/.test(dom.assemblyReport),dom.assemblyReport.slice(0,250));
  check('core parts retained',/"placed"/.test(dom.assemblyReport)&&!/"missing": \[\s*"/.test(dom.assemblyReport),dom.assemblyReport.slice(0,250));

  await page.screenshot({path:OUT+'/gate-16.png',fullPage:true});
  check('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));

  const evidence={base:BASE,seed:SEED,report,dom,checks,failed,errors};
  await fs.writeFile(OUT+'/browser.json',JSON.stringify(evidence,null,2));
  console.log('KLR_KIT_F1_BROWSER_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
} finally {
  if(browser)await browser.close();
}
