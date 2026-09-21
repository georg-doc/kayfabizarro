import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=(process.env.KLR_KIT_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/toolbox/legacy-rpg-rigging/').replace(/\/?$/,'/');
const OUT=process.env.KLR_KIT_PROOF_DIR||'legacy-actor-kit-evidence';
const checks=[];
const check=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)};
const gameplay=new Set(['hp','health','damage','dmg','armor','speed','ai','brain','team','faction','score','lives','spawn','ghostMode']);
function hasGameplay(v){if(!v||typeof v!=='object')return false;return Object.entries(v).some(([k,x])=>gameplay.has(k)||hasGameplay(x));}

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

  // Pass-2 diagnostic matrix: alternate head/no weapon → embedded head/no weapon → simple sword.
  const seeds=['gate-16','gate-75','gate-33'];
  const recipes={};
  let previousReady='';

  for(const seed of seeds){
    await page.fill('#recipeSeed',seed);
    previousReady=await page.evaluate(()=>document.documentElement.dataset.assemblyReady||'');
    await page.click('#randomizeBtn');
    await page.waitForFunction(
      ({seed,prev})=>{
        const d=document.documentElement.dataset;
        return d.recipeSeed===seed&&d.assemblyRequest&&d.assemblyRequest!==prev&&(d.assemblyState==='ready'||d.assemblyState==='error');
      },
      {seed,prev:previousReady},
      {timeout:120000}
    );
    const state=await page.evaluate(()=>({
      assemblyState:document.documentElement.dataset.assemblyState,
      assemblyRequest:document.documentElement.dataset.assemblyRequest,
      assemblyReady:document.documentElement.dataset.assemblyReady,
      report:document.querySelector('#assemblyReport')?.textContent||''
    }));
    check(seed+' assembly state',state.assemblyState==='ready',state.report.slice(0,600));
    const report=JSON.parse(await page.locator('#recipeReport').textContent());
    const selected=await page.evaluate(()=>({
      body:document.querySelector('#bodySelect')?.value,
      head:document.querySelector('#headSelect')?.value,
      right:document.querySelector('#rightWeapon')?.value||null,
      left:document.querySelector('#leftWeapon')?.value||null,
      extras:document.querySelector('#headExtrasToggle')?.checked,
      key:document.documentElement.dataset.recipeKey,
      object:document.querySelector('#stageObject')?.textContent,
      rig:document.querySelector('#rigStatus')?.textContent
    }));
    check(seed+' schema',report.recipe.schema==='kfb.legacy-actor-recipe/0.1-candidate',report.recipe.schema);
    check(seed+' no gameplay fields',!hasGameplay(report.recipe));
    check(seed+' UI body/head match',selected.body===report.recipe.bodyId&&selected.head===report.recipe.headId,JSON.stringify(selected));
    check(seed+' held slots match',selected.right===(report.recipe.held.right||null)&&selected.left===(report.recipe.held.left||null),JSON.stringify(selected));
    check(seed+' headExtras match',selected.extras===report.recipe.headExtras,String(selected.extras));
    check(seed+' key match',selected.key===report.key,selected.key);
    check(seed+' assembled',selected.rig==='RIG_LEGACY'&&new RegExp(report.recipe.bodyId,'i').test(selected.object||''),selected.object);
    recipes[seed]=report;
  }

  const seed=seeds[0];
  const first=recipes[seed];
  previousReady=await page.evaluate(()=>document.documentElement.dataset.assemblyReady||'');
  await page.fill('#recipeSeed',seed);
  await page.click('#randomizeBtn');
  await page.waitForFunction(
    ({seed,prev})=>{
      const d=document.documentElement.dataset;
      return d.recipeSeed===seed&&d.assemblyRequest&&d.assemblyRequest!==prev&&(d.assemblyState==='ready'||d.assemblyState==='error');
    },
    {seed,prev:previousReady},
    {timeout:120000}
  );
  const repeatState=await page.evaluate(()=>({state:document.documentElement.dataset.assemblyState,report:document.querySelector('#assemblyReport')?.textContent||''}));
  check('repeat seed assembly state',repeatState.state==='ready',repeatState.report.slice(0,600));
  const repeated=JSON.parse(await page.locator('#recipeReport').textContent());
  check('same seed reconstructs same recipe',JSON.stringify(repeated.recipe)===JSON.stringify(first.recipe));
  check('same seed reconstructs same key',repeated.key===first.key,repeated.key);
  check('three sample seeds are not collapsed',new Set(Object.values(recipes).map(x=>x.key)).size>=2,JSON.stringify(Object.values(recipes).map(x=>x.key)));

  await page.screenshot({path:OUT+'/desktop.png',fullPage:true});
  check('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));

  const evidence={base:BASE,seeds,recipes,checks,failed,errors};
  await fs.writeFile(OUT+'/browser.json',JSON.stringify(evidence,null,2));
  console.log('KLR_KIT_01_BROWSER_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
} finally {
  if(browser)await browser.close();
}
