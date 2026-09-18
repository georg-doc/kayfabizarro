import fs from 'node:fs';
import {chromium} from 'playwright';

const origin='https://kayfabizarro.pages.dev';
const home='/kfb-hub/free-roam/game-dev-studio/';
const catalogUrl='/tools/game-dev-studio/catalog.json';
const localCatalog=JSON.parse(fs.readFileSync('tools/game-dev-studio/catalog.json','utf8'));
const out='game-dev-studio-public-evidence';
fs.mkdirSync(out,{recursive:true});

const report={
  url:origin+home,
  catalog:origin+catalogUrl,
  checks:[],
  errors:[],
  package:localCatalog.packages?.[0]?.id||null,
  humanAcceptance:'PENDING'
};
const check=(name,pass,details)=>{report.checks.push({name,pass:!!pass,details});if(!pass)throw Error(name)};

let browser;
try{
  let live=false,remoteCatalog=null;
  for(let attempt=0;attempt<30;attempt++){
    try{
      const r=await fetch(origin+catalogUrl+'?ci='+Date.now(),{signal:AbortSignal.timeout(15000),cache:'no-store'});
      if(r.ok){
        const j=await r.json();
        if(j.schema===localCatalog.schema&&j.packages?.[0]?.id===localCatalog.packages?.[0]?.id){live=true;remoteCatalog=j;break}
      }
    }catch{}
    await new Promise(r=>setTimeout(r,10000));
  }
  check('catalog deployed',live,{package:remoteCatalog?.packages?.[0]?.id});
  check('pilot has four preview assets',remoteCatalog.packages[0].assets.length===4,remoteCatalog.packages[0].assets.map(a=>a.id));

  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const context=await browser.newContext({viewport:{width:1440,height:960}});
  const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))report.errors.push(m.text())});
  const r=await page.goto(origin+home,{waitUntil:'domcontentloaded',timeout:60000});
  check('fixed page HTTP',r?.ok(),r?.status());
  await page.waitForFunction(()=>window.__KFB_GAME_DEV_STUDIO_READY__||window.__KFB_GAME_DEV_STUDIO_ERROR__,{},{timeout:120000});
  check('studio boot',await page.evaluate(()=>!!window.__KFB_GAME_DEV_STUDIO_READY__),await page.evaluate(()=>window.__KFB_GAME_DEV_STUDIO_ERROR__));
  check('four asset controls',await page.locator('.asset').count()===4,await page.locator('.asset').count());
  check('Lorekeeper default preview loaded',(await page.evaluate(()=>window.__KFB_GAME_DEV_STUDIO__.snapshot())).asset==='lorekeeper');
  await page.screenshot({path:out+'/lorekeeper.png',fullPage:true});

  await page.evaluate(()=>window.__KFB_GAME_DEV_STUDIO__.select('car-sedan'));
  const snap=await page.evaluate(()=>window.__KFB_GAME_DEV_STUDIO__.snapshot());
  check('Sedan preview selected',snap.asset==='car-sedan',snap);
  check('Sedan evidence enabled',snap.showEvidence===true,snap);
  check('pinned source links used',remoteCatalog.packages[0].assets.every(a=>/raw\.githubusercontent\.com\/georg-doc\/kayfabizarro\/[0-9a-f]{40}\//.test(a.previewUrl)));
  await page.screenshot({path:out+'/sedan-evidence.png',fullPage:true});

  const tool=await fetch(origin+'/tools/game-dev-studio/',{redirect:'manual',signal:AbortSignal.timeout(15000)});
  check('tool route exists',tool.status>=200&&tool.status<400,tool.status);
  check('no browser errors',report.errors.length===0,report.errors);
  report.status='PASS';
}catch(e){
  report.status='FAIL';report.failure=String(e.stack||e);process.exitCode=1;
}finally{
  if(browser)await browser.close();
  fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
}
