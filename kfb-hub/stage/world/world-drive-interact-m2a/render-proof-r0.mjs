import fs from 'node:fs';
const {chromium}=await import(process.env.KFB_PLAYWRIGHT_PATH||'playwright');
const base=(process.env.WORLD_M2A_BASE_URL||'http://127.0.0.1:4206/kfb-hub/stage/world/world-drive-interact-m2a/').replace(/\/?$/,'/');
const out=process.env.WORLD_M2A_RENDER_R0_PROOF_DIR||'world-drive-interact-m2a-render-r0-proof';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.KFB_BROWSER_EXECUTABLE||undefined});
const page=await browser.newPage({viewport:{width:1280,height:820}}),errors=[],failed=[],http=[];
page.on('pageerror',error=>errors.push(String(error)));
page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
page.on('requestfailed',request=>failed.push(request.url()+' :: '+request.failure()?.errorText));
page.on('response',response=>{if(response.status()>=400)http.push(response.status()+' '+response.url())});
await page.goto(base+'?world=huerth&look=clay',{waitUntil:'domcontentloaded',timeout:120000});
await page.waitForFunction(()=>document.body.dataset.m1Ready==='true',null,{timeout:60000});
await page.waitForFunction(()=>window.__worldDriveM2A.quality.report().state==='stable',null,{timeout:10000});
const stable=await page.evaluate(()=>window.__worldDriveM2A.report());
await page.screenshot({path:out+'/stable-contact.png'});
await page.evaluate(()=>window.__worldDriveM2A.app.world.setSun(118,34));
await page.waitForTimeout(500);
const lowSun=await page.evaluate(()=>window.__worldDriveM2A.report());
await page.screenshot({path:out+'/low-sun-contact.png'});
await page.keyboard.down('KeyW');
await page.waitForFunction(()=>window.__worldDriveM2A.quality.report().state==='moving',null,{timeout:2000});
const moving=await page.evaluate(()=>window.__worldDriveM2A.report());
await page.keyboard.up('KeyW');
await page.waitForFunction(()=>window.__worldDriveM2A.quality.report().state==='stable',null,{timeout:6000});
const restored=await page.evaluate(()=>window.__worldDriveM2A.report());
const assertions={
  sharedPreset:stable.render.preset==='KFB_RENDER_R0_CONTACT_AND_DETAIL',
  activeEnvelope:stable.render.shadow.halfExtentM>=72&&stable.render.shadow.halfExtentM<=140,
  contactBiasBounded:stable.render.shadow.normalBiasM>=.006&&stable.render.shadow.normalBiasM<=.028,
  texelStabilized:stable.render.shadow.stabilizedToTexel===true,
  stableHeroDetail:stable.render.detailState==='stable'&&stable.render.clay.tiers.hero.grain===.10,
  movingDetailReduced:moving.render.detailState==='moving'&&moving.render.clay.tiers.hero.grain<stable.render.clay.tiers.hero.grain,
  restoredDetail:restored.render.detailState==='stable',
  sunAngleSafe:lowSun.render.shadow.normalBiasM<=.028,
  noErrors:errors.length===0&&failed.length===0&&http.length===0
};
const result={schema:'kfb.render-r0-browser-proof/1',base,stable:stable.render,lowSun:lowSun.render,moving:moving.render,restored:restored.render,assertions,errors,failed,http,pass:Object.values(assertions).every(Boolean)};
fs.writeFileSync(out+'/result.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
await page.close();await browser.close();
if(!result.pass)process.exitCode=2;
