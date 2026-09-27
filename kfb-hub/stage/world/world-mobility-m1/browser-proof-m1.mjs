import fs from 'node:fs';
import crypto from 'node:crypto';
const {chromium}=await import(process.env.KFB_PLAYWRIGHT_PATH||'playwright');
const base=(process.env.WORLD_MOBILITY_M1_BASE_URL||'http://127.0.0.1:4175/kfb-hub/stage/world/world-mobility-m1/').replace(/\/?$/,'/');
const out=process.env.WORLD_MOBILITY_M1_PROOF_DIR||'world-mobility-m1-proof';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.KFB_BROWSER_EXECUTABLE||undefined});
let count=0;function ok(name,condition,detail=''){if(!condition)throw Error('FAIL '+name+(detail?' · '+detail:''));console.log('ok '+(++count)+' - '+name)}
for(const spec of [{name:'desktop',width:1280,height:820},{name:'narrow',width:390,height:844}]){
  const page=await browser.newPage({viewport:{width:spec.width,height:spec.height}});
  const errors=[],failed=[],httpErrors=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  page.on('requestfailed',r=>failed.push(r.url()+' :: '+r.failure()?.errorText));
  page.on('response',r=>{if(r.status()>=400)httpErrors.push(r.status()+' '+r.url())});
  await page.goto(base+'?world=huerth',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.body.dataset.m1Ready==='true',null,{timeout:120000});
  await page.waitForTimeout(1200);
  const initial=await page.evaluate(()=>({marker:document.body.dataset.kfbStage,mode:document.body.dataset.m1Mobility,look:document.body.dataset.m1Look,report:window.__worldMobilityM1.report(),overflow:document.documentElement.scrollWidth>innerWidth,track:!!window.__wb2d.scene.getObjectByName('Track module · ST01 source recipe · C0 placement'),controls:[...document.querySelectorAll('#m1-bar button')].every(b=>{const r=b.getBoundingClientRect();return r.width>20&&r.left>=0&&r.right<=innerWidth})}));
  ok(spec.name+' M1 marker',initial.marker==='WORLD-MOBILITY-M1');
  ok(spec.name+' World runtime ready',initial.report.clay.world==='huerth');
  ok(spec.name+' starts Ground Original',initial.mode==='ground'&&initial.look==='original');
  ok(spec.name+' folded track proxy absent',!initial.track&&initial.report.mobility.trackProxy===false);
  ok(spec.name+' router owns one Ground writer',initial.report.mobility.router.activeMovementOwner==='World r2 play'&&initial.report.mobility.router.activeCameraOwner==='World r2 play');
  ok(spec.name+' compact controls visible',initial.controls);
  ok(spec.name+' no horizontal overflow',!initial.overflow);
  const original=await page.screenshot({path:out+'/'+spec.name+'-ground-original.png'});

  await page.keyboard.press('Space');await page.waitForTimeout(120);
  ok(spec.name+' first Space stays Ground',await page.evaluate(()=>window.__worldMobilityM1.mobility.mode==='ground'));
  await page.keyboard.press('Space');await page.waitForFunction(()=>document.body.dataset.m1Mobility==='flight');
  await page.waitForTimeout(300);
  const entered=await page.evaluate(()=>window.__worldMobilityM1.mobility.report());
  ok(spec.name+' second Space enters Flight',entered.mode==='flight'&&entered.intent.requestCount===1);
  ok(spec.name+' real Travel carrier active',entered.flight.vehicle==='card-carrier.js'&&entered.flight.actorPose==='idle on card carrier');
  ok(spec.name+' router switched both owners',entered.router.activeMovementOwner==='Travel flight ENU surface adapter'&&entered.router.activeCameraOwner==='Travel flight ENU surface adapter');

  const before=entered.flight.position;
  await page.keyboard.down('KeyW');await page.waitForTimeout(700);await page.keyboard.up('KeyW');
  await page.keyboard.down('Space');await page.waitForTimeout(500);await page.keyboard.up('Space');
  const flown=await page.evaluate(()=>window.__worldMobilityM1.mobility.report());
  ok(spec.name+' flight moves through same World',Math.hypot(flown.flight.position[0]-before[0],flown.flight.position[2]-before[2])>.5);
  ok(spec.name+' flight gains clearance',flown.flight.clearance>entered.flight.clearance+.5);

  await page.click('#m1-clay');await page.waitForFunction(()=>document.body.dataset.m1Look==='clay');
  const clay=await page.evaluate(()=>window.__worldMobilityM1.report());
  ok(spec.name+' Clay remains reversible',clay.clay.mode==='clay'&&clay.clay.reversible);
  const clayPng=await page.screenshot({path:out+'/'+spec.name+'-flight-clay.png'});
  ok(spec.name+' Original Clay pixels differ',crypto.createHash('sha256').update(original).digest('hex')!==crypto.createHash('sha256').update(clayPng).digest('hex'));

  await page.click('#m1-ground');await page.waitForFunction(()=>document.body.dataset.m1Mobility==='ground');
  const returned=await page.evaluate(()=>window.__worldMobilityM1.mobility.report());
  ok(spec.name+' returns to World Ground owner',returned.mode==='ground'&&returned.router.activeMovementOwner==='World r2 play');
  await page.click('#m1-info');ok(spec.name+' inline documentation opens',await page.locator('#m1-help').isVisible());
  ok(spec.name+' no page or console errors',errors.length===0,errors.join(' | '));
  ok(spec.name+' no failed source requests',failed.length===0,failed.slice(0,5).join(' | '));
  ok(spec.name+' no HTTP errors',httpErrors.length===0,httpErrors.slice(0,5).join(' | '));
  await page.close();
}
await browser.close();
console.log('WORLD MOBILITY M1 BROWSER PASS '+count+'/'+count);

