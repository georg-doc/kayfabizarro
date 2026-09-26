import { chromium } from 'playwright';

const base=process.env.ENV_PREVIEW_STAGE_BASE||'http://127.0.0.1:4173';
const route=base+'/kfb-hub/stage/toolbox/environment-preview-01/';
const browser=await chromium.launch({
  headless:true,
  executablePath:process.env.PLAYWRIGHT_CHROME||undefined,
  args:['--enable-webgl','--ignore-gpu-blocklist','--use-gl=swiftshader']
});
const page=await browser.newPage({viewport:{width:1365,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('requestfailed',r=>errors.push(r.url()+' · '+(r.failure()?.errorText||'')));
let pass=0,total=0;const ok=(name,v,d='')=>{total++;if(v){pass++;console.log('PASS · '+name)}else{console.error('FAIL · '+name+(d?' · '+d:''));process.exitCode=1}};
await page.goto(route,{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForFunction(()=>window.__KFB_ENV_STAGE?.ready===true);
ok('stage build marker',await page.locator('[data-build="ENV_PREVIEW_01_STAGE_2026_09_26"]').count()===1);
ok('source head marker',(await page.evaluate(()=>window.__KFB_ENV_STAGE.sourceHead))==='6718eef05f2b6dd0d79ae04884b33f3396c34379');
let child=page.frames().find(f=>f!==page.mainFrame());
await child.waitForFunction(()=>window.__atlas?.ENV&&window.__atlas?.cur?.(),null,{timeout:120000});
let probe=await child.evaluate(()=>window.__atlas.ENV.probe());
ok('Resident WORLD_MATCH',probe.requestedMode==='WORLD_MATCH',JSON.stringify(probe));
ok('Resident source pin',probe.sourceHead==='8614282aab2ced43bb5dda9fcf7abadf9768100a',probe.sourceHead||'');
await page.click('#toolbox');
await page.waitForFunction(()=>window.__KFB_ENV_STAGE?.view==='toolbox');
child=page.frames().find(f=>f!==page.mainFrame());
await child.waitForFunction(()=>window.__kfbTB?.runtime&&window.__kfbEnvPreview,null,{timeout:120000});
probe=await child.evaluate(()=>window.__kfbEnvPreview.probe());
ok('ToolBox WORLD_MATCH',probe.requestedMode==='WORLD_MATCH',JSON.stringify(probe));
ok('ToolBox source pin',probe.sourceHead==='8614282aab2ced43bb5dda9fcf7abadf9768100a',probe.sourceHead||'');
ok('compact selector visible',await child.locator('#kfb-env-preview-mode').count()===1);
ok('no browser errors',errors.length===0,errors.join(' | '));
await page.setViewportSize({width:390,height:844});await page.waitForTimeout(120);
ok('mobile no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+2));
await browser.close();
console.log(`BROWSER PASS ${pass}/${total}`);
if(pass!==total)process.exit(1);
