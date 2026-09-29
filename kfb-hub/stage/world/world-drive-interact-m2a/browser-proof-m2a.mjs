import fs from 'node:fs';
const {chromium}=await import(process.env.KFB_PLAYWRIGHT_PATH||'playwright');
const base=(process.env.WORLD_M2A_BASE_URL||'http://127.0.0.1:4176/kfb-hub/stage/world/world-drive-interact-m2a/').replace(/\/?$/,'/');
const out=process.env.WORLD_M2A_PROOF_DIR||'world-drive-interact-m2a-proof';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.KFB_BROWSER_EXECUTABLE||undefined});
let count=0;const ok=(name,value,detail='')=>{if(!value)throw Error('FAIL '+name+(detail?' · '+detail:''));console.log('ok '+(++count)+' - '+name)};
for(const spec of [{name:'desktop',width:1280,height:820},{name:'narrow',width:390,height:844}]){
  const page=await browser.newPage({viewport:{width:spec.width,height:spec.height}}),errors=[],failed=[],http=[],consoleInfo=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());else consoleInfo.push(m.type()+': '+m.text())});page.on('requestfailed',r=>failed.push(r.url()+' :: '+r.failure()?.errorText));page.on('response',r=>{if(r.status()>=400)http.push(r.status()+' '+r.url())});
  await page.goto(base+'?world=huerth',{waitUntil:'domcontentloaded',timeout:120000});
  try{await page.waitForFunction(()=>document.body.dataset.m1Ready==='true',null,{timeout:150000})}catch(error){console.error('BOOT DIAG',JSON.stringify({errors,failed,http,consoleInfo:consoleInfo.slice(-80),body:await page.evaluate(()=>({dataset:{...document.body.dataset},text:document.body.innerText.slice(0,800),wb2d:!!window.__wb2d,world:window.__wb2d?.world?.id||null,play:!!window.__wb2d?.play,status:document.querySelector('#status')?.textContent||null}))},null,2));throw error}await page.waitForTimeout(900);
  let r=await page.evaluate(()=>window.__worldDriveM2A.report());
  ok(spec.name+' M2A marker',await page.evaluate(()=>document.body.dataset.kfbStage)==='WORLD-DRIVE-INTERACT-M2A');
  ok(spec.name+' Hirnwelt H0 clay is default',r.clay.mode==='clay'&&await page.evaluate(()=>document.body.dataset.m1Look)==='clay');
  ok(spec.name+' clay binds real World meshes',r.clay.boundMeshes>0&&r.clay.buildingCount>0,JSON.stringify(r.clay));
  ok(spec.name+' clay covers terrain road sidewalk facades roofs',r.clay.layers.medium.includes('terrain/road/sidewalk')&&r.clay.layers.coarse.includes('facades/roofs'));
  ok(spec.name+' R4 adaptive quality active',r.quality.profile==='ADAPTIVE_RESOLUTION_CLAY_DISTANCE_R4'&&r.quality.pixelRatio<=.86&&r.quality.cssUiNativeResolution);
  ok(spec.name+' far city clay is simplified',r.clay.distanceBudget.simplifiedMeshes>0);
  ok(spec.name+' shared shadow profile active',r.shadow?.profile==='KFB_SHARED_SHADOW_CONTACT_V1'&&r.shadow.mapTypeName==='PCFSoftShadowMap',JSON.stringify(r.shadow));
  ok(spec.name+' fitted shadow follows canonical texel bias',r.shadow?.follow?.halfM>=90&&r.shadow.follow.halfM<=400&&Math.abs(r.shadow.follow.normalBiasTexels-1.2)<1e-9&&r.shadow.follow.normalBias>0&&r.shadow.follow.bias===-0.00003,JSON.stringify(r.shadow?.follow));
  ok(spec.name+' shared caster policy reaches integrated roots',r.shadow?.policy?.runs>=4&&r.shadow.policy.labels.includes('world-city-preserve')&&r.shadow.policy.labels.includes('world-play-actor'),JSON.stringify(r.shadow?.policy));
  ok(spec.name+' solid casters remain after thin-overlay filter',r.shadow?.policy?.casters>0&&r.shadow.policy.meshes>=r.shadow.policy.casters,JSON.stringify(r.shadow?.policy));
  ok(spec.name+' starts Ground beside vehicle',r.mobility.mode==='ground'&&r.mobility.interaction.available);
  ok(spec.name+' exact Race donor pinned',r.mobility.drive.source.raceHead==='406cd26f44f22811fe3b3a58776839be7ffb7b2c');
  ok(spec.name+' no proxy Track',r.mobility.trackProxy===false);
  await page.evaluate(()=>{
    const a=window.__worldDriveM2A.app,p=a.play?.position||a.world.spawn,cam=a.camera,ctl=a.controls;
    ctl.target.set(p.x,p.y+1.0,p.z);cam.position.set(p.x+5.5,p.y+3.2,p.z+5.5);ctl.update();
    a.world.setSun(35,32);
  });
  await page.waitForTimeout(500);
  await page.screenshot({path:out+'/'+spec.name+'-shadow-actor-prop.png'});
  await page.evaluate(()=>{
    const a=window.__worldDriveM2A.app,z=a.world.zone,s=a.world.spawn;
    const cent=b=>{let x=0,z0=0,n=0;for(const p of b.fp||[]){x+=p.x;z0+=p.z;n++}return n?{x:x/n,z:z0/n}:null};
    let best=null;for(const b of z.buildings||[]){const q=cent(b);if(!q)continue;const d=Math.hypot(q.x-s.x,q.z-s.z);if(!best||d<best.d)best={...q,d}}
    if(best){a.controls.target.set(best.x,3,best.z);a.camera.position.set(best.x+14,9,best.z+14);a.controls.update()}
    a.world.setSun(55,28);
  });
  await page.waitForTimeout(500);
  await page.screenshot({path:out+'/'+spec.name+'-shadow-building-contact.png'});
  const start=r.mobility.drive.position;
  await page.keyboard.press('KeyE');await page.waitForFunction(()=>document.body.dataset.m1Mobility==='drive');
  r=await page.evaluate(()=>window.__worldDriveM2A.report());
  ok(spec.name+' E enters Drive',r.mobility.mode==='drive'&&r.mobility.drive.active);
  ok(spec.name+' drive vehicle consumes caster policy',r.shadow?.policy?.labels.includes('world-drive-vehicle'),JSON.stringify(r.shadow?.policy));
  ok(spec.name+' Free Roam owns Drive',r.mobility.router.activeMovementOwner==='FREE_ROAM_C0'&&r.mobility.router.activeCameraOwner==='FREE_ROAM_C0');
  await page.keyboard.down('KeyW');await page.waitForTimeout(1700);await page.keyboard.up('KeyW');await page.waitForTimeout(250);
  r=await page.evaluate(()=>window.__worldDriveM2A.report());
  ok(spec.name+' vehicle moves',Math.hypot(r.mobility.drive.position.x-start.x,r.mobility.drive.position.z-start.z)>.35,JSON.stringify(r.mobility.drive));
  ok(spec.name+' physical wheel contact',r.mobility.drive.contacts>=2,JSON.stringify(r.mobility.drive));
  await page.screenshot({path:out+'/'+spec.name+'-drive.png'});
  await page.keyboard.press('KeyE');await page.waitForFunction(()=>document.body.dataset.m1Mobility==='ground');
  r=await page.evaluate(()=>window.__worldDriveM2A.report());ok(spec.name+' E exits to Ground',r.mobility.mode==='ground'&&!r.mobility.drive.active);
  await page.keyboard.press('Space');await page.waitForTimeout(120);await page.keyboard.press('Space');await page.waitForFunction(()=>document.body.dataset.m1Mobility==='flight');
  r=await page.evaluate(()=>window.__worldDriveM2A.report());ok(spec.name+' double Space enters Flight',r.mobility.mode==='flight'&&r.mobility.flight.vehicle==='card-carrier.js');
  await page.click('#m1-ground');await page.waitForFunction(()=>document.body.dataset.m1Mobility==='ground');
  ok(spec.name+' compact controls',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&[...document.querySelectorAll('#m1-bar button')].every(b=>{const x=b.getBoundingClientRect();return x.left>=0&&x.right<=innerWidth})));
  ok(spec.name+' no page errors',errors.length===0,errors.join(' | '));ok(spec.name+' no failed requests',failed.length===0,failed.slice(0,4).join(' | '));ok(spec.name+' no HTTP errors',http.length===0,http.slice(0,4).join(' | '));await page.close();
}
await browser.close();console.log('WORLD DRIVE M2A BROWSER PASS '+count+'/'+count);
