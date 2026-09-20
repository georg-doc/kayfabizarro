import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.KRC_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/toolbox/kaykit-ranged-calibration-v1/';
const EXPECTED=process.env.KRC_SOURCE_HEAD||'';
const OUT=process.env.KRC_PROOF_DIR||'kaykit-ranged-calibration-evidence';
const checks=[];
const check=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)};
const finiteArray=(a,n)=>Array.isArray(a)&&a.length===n&&a.every(Number.isFinite);

await fs.mkdir(OUT,{recursive:true});
const marker=await fetch(BASE+'SOURCE.json?proof='+Date.now(),{cache:'no-store'}).then(async r=>({ok:r.ok,status:r.status,json:await r.json()}));
check('source marker HTTP',marker.ok,'status='+marker.status);
check('source marker head',marker.json.implementationHead===EXPECTED,marker.json.implementationHead);

let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:920},deviceScaleFactor:1});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push('pageerror '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  check('stage HTTP',response?.ok()===true,'status='+response?.status());
  await page.waitForFunction(()=>window.__KFB_RANGED_CALIBRATION__?.ready===true||!!window.__KFB_RANGED_CALIBRATION__?.error,null,{timeout:120000});
  let snap=await page.evaluate(()=>window.__KFB_RANGED_CALIBRATION__.snapshot());

  check('lab ready',snap.ready===true,JSON.stringify(snap.error));
  check('no lab error',!snap.error,String(snap.error));
  check('source-first default',snap.mode==='source',snap.mode);
  check('exact model pin',snap.source.modelPin==='bdaea0648f27c0f16e0a737bfba237eb54dd4cbb',snap.source.modelPin);
  check('exact module pin',snap.source.modulePin==='bdaea0648f27c0f16e0a737bfba237eb54dd4cbb',snap.source.modulePin);
  check('exact asset pin',snap.source.assetPin==='11d7df978c63b9e375707bd8d9431b4c8358cda8',snap.source.assetPin);
  check('exact gun source',/Character_Gun\.gltf$/.test(snap.source.gun),snap.source.gun);
  check('exact ranged source',/Rig_Medium_CombatRanged\.glb$/.test(snap.source.ranged),snap.source.ranged);
  check('ranged inventory populated',snap.inventory.length>=13,'count='+snap.inventory.length);
  for(const n of ['Ranged_1H_Aiming','Ranged_1H_Reload','Ranged_1H_Shoot','Ranged_1H_Shooting']){
    check('clip '+n,snap.inventory.includes(n),snap.inventory.join(','));
  }
  check('no game/runtime ownership',Object.values(snap.scope||{}).every(v=>v===false),JSON.stringify(snap.scope));
  check('source WebGL canvas',!!await page.$('#stage canvas'));
  await page.screenshot({path:OUT+'/00-source-gun.png',fullPage:true});

  await page.evaluate(()=>window.__KFB_RANGED_CALIBRATION__.play('Ranged_1H_Aiming'));
  await page.waitForTimeout(750);
  snap=await page.evaluate(()=>window.__KFB_RANGED_CALIBRATION__.snapshot());
  check('aim mode compare',snap.mode==='compare'&&snap.currentClip==='Ranged_1H_Aiming',JSON.stringify({mode:snap.mode,clip:snap.currentClip}));
  for(const id of ['frizzlebob','gothgirl']){
    const a=snap.actors[id];
    check(id+' weapon report OK',a?.weaponReport?.status==='OK',JSON.stringify(a?.weaponReport));
    check(id+' right slot',/handslot.*r|handslot.*right|right.*handslot/i.test(a?.weaponReport?.bone||''),a?.weaponReport?.bone||'');
    check(id+' muzzle local',finiteArray(a?.muzzle?.localPosition,3),JSON.stringify(a?.muzzle));
    check(id+' muzzle world',finiteArray(a?.muzzle?.worldPosition,3),JSON.stringify(a?.muzzle));
    check(id+' forward local',finiteArray(a?.muzzle?.localForward,3),JSON.stringify(a?.muzzle));
    check(id+' forward world',finiteArray(a?.muzzle?.worldForward,3),JSON.stringify(a?.muzzle));
    check(id+' forearm measured',Number(a?.weaponReport?.forearm)>0,String(a?.weaponReport?.forearm));
    check(id+' barrel measured',Number(a?.weaponReport?.barrelLength)>0,String(a?.weaponReport?.barrelLength));
  }
  check('bind delta finite',Object.values(snap.bind?.delta||{}).every(Number.isFinite),JSON.stringify(snap.bind?.delta));
  await page.screenshot({path:OUT+'/01-aim-compare.png',fullPage:true});

  const release=snap.markers?.shoot?.primaryRelease;
  check('Shoot primary release marker exists',Number.isFinite(release),JSON.stringify(snap.markers?.shoot));
  check('late single-shot peaks not promoted',Array.isArray(snap.markers?.shoot?.laterRotationalPeaks)&&snap.markers.shoot.laterRotationalPeaks.length>=1&&/not promoted/i.test(snap.markers.shoot.releasePolicy||''),JSON.stringify(snap.markers?.shoot));
  check('Shoot release marker inside clip',release>=0&&release<=snap.markers.shoot.duration,String(release));
  check('Shoot recovery marker exists',Number.isFinite(snap.markers?.shoot?.recoveryStart),JSON.stringify(snap.markers?.shoot));
  check('Shoot recovery after release',snap.markers.shoot.recoveryStart>=release,JSON.stringify(snap.markers.shoot));
  check('release method recorded',String(snap.markers?.shoot?.releaseHow||'').length>4,String(snap.markers?.shoot?.releaseHow));

  const seeked=await page.evaluate(()=>window.__KFB_RANGED_CALIBRATION__.seekRelease());
  check('release-frame seek',Math.abs(seeked-release)<0.001,'seeked='+seeked+' release='+release);
  const flash=await page.evaluate(()=>window.__KFB_RANGED_CALIBRATION__.snapshot());
  check('release-frame mode',flash.mode==='release-frame',flash.mode);
  check('Shoot clip active',flash.currentClip==='Ranged_1H_Shoot',flash.currentClip);
  check('release event reached both actors',flash.shotEvents===2,'shotEvents='+flash.shotEvents);
  for(const id of ['frizzlebob','gothgirl']){
    check(id+' scheduled single release',Array.isArray(flash.actors[id]?.scheduledMarkers)&&flash.actors[id].scheduledMarkers.length===1&&Math.abs(flash.actors[id].scheduledMarkers[0]-release)<0.001,JSON.stringify(flash.actors[id]));
    check(id+' action paused at release',flash.actors[id]?.actionPaused===true,JSON.stringify(flash.actors[id]));
    check(id+' action time at release',Math.abs(flash.actors[id]?.actionTime-release)<0.002,JSON.stringify(flash.actors[id]));
  }
  await page.screenshot({path:OUT+'/02-shoot-release.png',fullPage:true});

  await page.waitForTimeout(900);
  await page.evaluate(()=>window.__KFB_RANGED_CALIBRATION__.play('Ranged_1H_Reload'));
  await page.waitForTimeout(420);
  const reload=await page.evaluate(()=>window.__KFB_RANGED_CALIBRATION__.snapshot());
  check('Reload clip active',reload.currentClip==='Ranged_1H_Reload',reload.currentClip);
  await page.screenshot({path:OUT+'/03-reload.png',fullPage:true});

  check('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));

  const evidence={base:BASE,expectedHead:EXPECTED,checks,failed,errors,measurement:snap,shootAtRelease:flash,reload};
  await fs.writeFile(OUT+'/measurement.json',JSON.stringify(evidence,null,2)+'\n');
  console.log('KAYKIT_RANGED_CALIBRATION_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
} finally {
  if(browser) await browser.close();
}
