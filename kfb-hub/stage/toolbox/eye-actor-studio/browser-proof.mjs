import {chromium} from 'playwright';import fs from 'node:fs/promises';
const BASE=process.env.KFB_EAS1_BASE||'http://127.0.0.1:4173',OUT=process.env.KFB_EAS1_EVIDENCE||'eas1-evidence';await fs.mkdir(OUT,{recursive:true});
const checks=[];const check=(n,c,e='')=>{checks.push({name:n,pass:!!c,extra:e});if(!c)throw Error('FAIL '+n+' '+e);console.log('PASS',n,e)};
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});

async function waitHost(page,id){
  await page.waitForFunction(x=>document.documentElement.dataset.kfbEyeHostReady==='yes'&&window.__KFB_EYE_ACTOR_STUDIO_V1__?.hostId===x,id,{timeout:60000});
  return page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__);
}
async function selectHost(page,id){
  await page.selectOption('#hostSelect',id);
  return waitHost(page,id);
}

try{
 for(const [label,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]){
  const page=await browser.newPage({viewport}),errors=[],failed=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const res=await page.goto(BASE+'/kfb-hub/stage/toolbox/eye-actor-studio/',{waitUntil:'domcontentloaded',timeout:60000});
  check(label+' HTTP',res?.ok(),String(res?.status()));
  let state=await waitHost(page,'legacy-prototype-pete');
  check(label+' PrototypePete default',state.hostId==='legacy-prototype-pete',state.hostId);
  check(label+' source mode first',state.mode==='source',state.mode);
  check(label+' host face ready',state.host?.faceHost?.status==='OK',JSON.stringify(state.host?.faceHost));

  await page.screenshot({path:OUT+'/'+label+'-prototype-source.png'});

  await page.selectOption('#mode','cluster');await page.waitForTimeout(120);
  state=await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__);
  check(label+' cluster count 2',state.cluster?.count===2,String(state.cluster?.count));

  await page.selectOption('#preset','pair-asymmetric');await page.waitForTimeout(120);
  let d=await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__.cluster);
  check(label+' asymmetric sizes',Math.abs(d.eyes[0].size-d.eyes[1].size)>.2,JSON.stringify(d.eyes.map(x=>x.size)));

  await page.selectOption('#preset','pair-frog-side');await page.waitForTimeout(120);
  d=await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__.cluster);
  check(label+' frog yaw',Math.abs(d.eyes[0].eulerDeg[1])>=60&&Math.abs(d.eyes[1].eulerDeg[1])>=60,JSON.stringify(d.eyes.map(x=>x.eulerDeg)));

  await page.selectOption('#preset','three-eye');await page.waitForTimeout(120);
  check(label+' three eyes',(await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__.cluster.count))===3);

  await page.selectOption('#preset','four-eye');await page.waitForTimeout(120);
  check(label+' four eyes',(await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__.cluster.count))===4);

  await page.selectOption('#scope','selected');await page.selectOption('#pose','aim');await page.waitForTimeout(120);
  d=await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__.cluster);
  check(label+' selected aim scope',Math.abs(d.eyes[0].gaze[0])>.1&&Math.abs(d.eyes[1].gaze[0])<.01,JSON.stringify(d.eyes.map(x=>x.gaze)));

  await page.selectOption('#mode','donor');await page.waitForTimeout(200);
  check(label+' exact donor mode',await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__.mode)==='donor');
  await page.screenshot({path:OUT+'/'+label+'-prototype-donor.png'});

  await page.selectOption('#mode','cluster');await page.selectOption('#preset','pair-frog-side');await page.waitForTimeout(150);
  await page.screenshot({path:OUT+'/'+label+'-frog.png'});

  if(label==='desktop'){
    await page.selectOption('#mode','source');

    state=await selectHost(page,'mannequin-medium');
    check('desktop Mannequin Medium',state.host?.rigClass==='Rig_Medium',JSON.stringify(state.host));
    check('desktop Mannequin FaceHost',state.host?.faceHost?.status==='OK');

    state=await selectHost(page,'medium-gothgirl');
    check('desktop Medium owner actor',state.host?.sourcePath?.includes('GothGirl.glb'),state.host?.sourcePath);

    state=await selectHost(page,'large-orc-brute');
    check('desktop Large reviewed actor',state.host?.rigClass==='Rig_Large'&&state.host?.sourcePath?.toLowerCase().includes('orc'),JSON.stringify(state.host));

    state=await selectHost(page,'legacy-skeleton-warrior');
    check('desktop Legacy skeleton',state.host?.rigClass==='Rig_Legacy'&&state.host?.faceHost?.status==='OK',JSON.stringify(state.host));

    state=await selectHost(page,'legacy-jack');
    check('desktop Legacy Jack pumpkin',state.host?.sourcePath?.includes('character_jack.gltf'),state.host?.sourcePath);

    state=await selectHost(page,'legacy-dungeon-modular');
    check('desktop Legacy modular opens',state.host?.rigClass==='Rig_Legacy',JSON.stringify(state.host));

    await page.selectOption('#legacyBody','knight');
    await page.waitForFunction(()=>document.documentElement.dataset.kfbEyeHostReady==='yes'&&window.__KFB_EYE_ACTOR_STUDIO_V1__?.host?.sourcePath?.includes('character_knight.gltf'),null,{timeout:60000});
    state=await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__);
    check('desktop Legacy modular body',state.host?.sourcePath?.includes('character_knight.gltf'),state.host?.sourcePath);

    await page.selectOption('#legacyHead','rogue-c');
    await page.waitForFunction(()=>document.documentElement.dataset.kfbEyeHostReady==='yes'&&window.__KFB_EYE_ACTOR_STUDIO_V1__?.host?.legacyHead?.id==='rogue-c',null,{timeout:60000});
    state=await page.evaluate(()=>window.__KFB_EYE_ACTOR_STUDIO_V1__);
    check('desktop Legacy modular alternate head',state.host?.legacyHead?.id==='rogue-c',JSON.stringify(state.host?.legacyHead));

    state=await selectHost(page,'prop-pencil-short');
    check('desktop Pencil prop',state.host?.kind==='prop'&&state.host?.sourcePath?.includes('pencil_B_short.gltf'),JSON.stringify(state.host));

    state=await selectHost(page,'prop-eraser');
    check('desktop Eraser prop',state.host?.kind==='prop'&&state.host?.sourcePath?.includes('Eraser by Poly'),JSON.stringify(state.host));

    await page.screenshot({path:OUT+'/desktop-eraser-source.png'});
  }

  check(label+' no failed resources',failed.length===0,JSON.stringify(failed));
  check(label+' no page errors',errors.length===0,JSON.stringify(errors));
  await page.close();
 }
 await fs.writeFile(OUT+'/browser.json',JSON.stringify({checks},null,2));
 console.log('KFB_EAS1_BROWSER_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
}finally{await browser.close()}
