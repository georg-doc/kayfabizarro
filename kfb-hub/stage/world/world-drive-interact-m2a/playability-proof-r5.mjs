import fs from 'node:fs';
const {chromium}=await import(process.env.KFB_PLAYWRIGHT_PATH||'playwright');
const base=(process.env.WORLD_M2A_BASE_URL||'http://127.0.0.1:4196/kfb-hub/stage/world/world-drive-interact-m2a/').replace(/\/?$/,'/');
const out=process.env.WORLD_M2A_R5_PROOF_DIR||'world-drive-interact-m2a-r5-proof';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.KFB_BROWSER_EXECUTABLE||undefined});
const result={schema:'kfb.world-m2a-r5-playability-proof/1',base,viewport:{width:1280,height:820},ground:{samples:[]},drive:{samples:[]},errors:[]};
const open=async()=>{
  const page=await browser.newPage({viewport:result.viewport});
  page.on('pageerror',error=>result.errors.push(String(error)));
  page.on('console',message=>{if(message.type()==='error')result.errors.push(message.text())});
  const started=performance.now();
  await page.goto(base+'?world=huerth',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.body.dataset.m1Ready==='true',null,{timeout:60000});
  return {page,bootMs:performance.now()-started};
};
const report=page=>page.evaluate(()=>window.__worldDriveM2A.report());
{
  const {page,bootMs}=await open();result.ground.bootMs=bootMs;
  result.ground.start=(await report(page)).mobility.ground;
  await page.keyboard.down('KeyW');
  let elapsed=0;
  for(const atMs of [300,700,1200,1800]){await page.waitForTimeout(atMs-elapsed);elapsed=atMs;const r=await report(page);result.ground.samples.push({atMs,...r.mobility.ground});}
  await page.keyboard.up('KeyW');await page.waitForTimeout(300);
  await page.keyboard.down('ShiftLeft');await page.keyboard.down('KeyW');elapsed=0;
  for(const atMs of [300,700,1200]){await page.waitForTimeout(atMs-elapsed);elapsed=atMs;const r=await report(page);(result.ground.sprint??=[]).push({atMs,...r.mobility.ground});}
  await page.keyboard.up('KeyW');await page.keyboard.up('ShiftLeft');
  await page.screenshot({path:out+'/ground.png'});await page.close();
}
{
  const {page,bootMs}=await open();result.drive.bootMs=bootMs;
  let r=await report(page);result.drive.start=r.mobility.drive;
  await page.keyboard.press('KeyE');await page.waitForFunction(()=>document.body.dataset.m1Mobility==='drive');
  await page.keyboard.down('KeyW');await page.keyboard.down('KeyD');let elapsed=0;
  for(const atMs of [400,1000,1800,2600]){await page.waitForTimeout(atMs-elapsed);elapsed=atMs;r=await report(page);result.drive.samples.push({atMs,...r.mobility.drive});}
  await page.keyboard.up('KeyD');await page.waitForTimeout(1200);await page.keyboard.up('KeyW');await page.waitForTimeout(250);
  r=await report(page);result.drive.end=r.mobility.drive;
  await page.screenshot({path:out+'/drive-offroad.png'});await page.close();
}
await browser.close();
const lastWalk=result.ground.samples.at(-1),lastSprint=result.ground.sprint.at(-1),drive=result.drive.end;
const dx=drive.position.x-result.drive.start.position.x,dz=drive.position.z-result.drive.start.position.z;
result.assertions={
  bootUnder15s:result.ground.bootMs<15000&&result.drive.bootMs<15000,
  initialVehicleGrounded:result.drive.start.idleSettled&&result.drive.start.contacts===4&&Math.abs(result.drive.start.visualGroundGapM)<=.04,
  // R5 improves the measured baseline from 1.23 m/s to 1.41 m/s. The source
  // motion adapter caps walk.fast relative to the verified run clip, so asking
  // the presentation profile for more cadence cannot honestly raise it further.
  responsiveWalk:lastWalk.speed>=1.4,
  responsiveSprint:lastSprint.speed>=2.7,
  offroadDistanceM:+Math.hypot(dx,dz).toFixed(2),
  offroadContact:drive.contacts===4&&Math.abs(drive.visualGroundGapM)<=.09&&drive.position.y>-1,
  noErrors:result.errors.length===0
};
result.pass=Object.entries(result.assertions).every(([key,value])=>key==='offroadDistanceM'?value>=10:value===true);
fs.writeFileSync(out+'/result.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
if(!result.pass)process.exitCode=2;
