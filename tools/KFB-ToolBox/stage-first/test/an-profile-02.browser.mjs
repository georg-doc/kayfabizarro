import { chromium } from 'playwright';

let pass=0;
function ok(name,cond){
  if(!cond) throw new Error('FAIL '+name);
  pass++;console.log('ok '+pass+' - '+name);
}
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:980}});
const pageErrors=[];
const motionFailures=[];
page.on('pageerror',(e)=>pageErrors.push(e.message));
page.on('requestfailed',(r)=>{
  const u=r.url();
  if(u.includes('KFB_Motion_Library')||u.includes('motion-profile-reader')) motionFailures.push(u+' :: '+(r.failure()?.errorText||'failed'));
});
page.on('response',(r)=>{
  const u=r.url();
  if((u.includes('KFB_Motion_Library')||u.includes('motion-profile-reader'))&&r.status()>=400) motionFailures.push(u+' :: HTTP '+r.status());
});
try{
  const url='http://127.0.0.1:8765/tools/KFB-ToolBox/stage-first/src/KFB%20Animation%20Lab%20v3.dc.html';
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForFunction(()=>window.__kfbLab&&window.__kfbLab.state.ready===true,null,{timeout:180000});
  await page.waitForFunction(()=>window.__kfbLab&&window.__kfbLab.motion&&window.__kfbLab.motion.profiles?.schema==='kfb.motion-profile-catalog/1.0',null,{timeout:180000});

  let p=await page.evaluate(()=>({
    source:window.__kfbLab.ML.SOURCE_REVISION,
    sourcePr:window.__kfbLab.ML.SOURCE_PR,
    motionPr:window.__kfbLab.ML.MOTION_LIBRARY_PR,
    catalogSchema:window.__kfbLab.motion.catalogue.schema,
    profileSchema:window.__kfbLab.motion.profiles.schema,
    catalogCount:window.__kfbLab.motion.catalogue.clips.length,
    profileCount:window.__kfbLab.motion.profiles.clipCount
  }));
  ok('shared source is exact AN-PROFILE-01 head',p.source==='032c9d50cd5de6764fa37fec65cb203ed35fcb11');
  ok('source PRs remain explicit',p.sourcePr===206&&p.motionPr===197);
  ok('source catalogue schema is current',p.catalogSchema==='kfb.motion-catalog.v1');
  ok('profile catalogue schema is current',p.profileSchema==='kfb.motion-profile-catalog/1.0');
  ok('catalogue/profile both cover 33 clips',p.catalogCount===33&&p.profileCount===33);

  await page.evaluate(async()=>{
    const lab=window.__kfbLab;
    await lab.setRig('Medium');
    if(!lab.motionClips.Medium) await lab.loadMotionPack('Medium');
  });
  await page.waitForFunction(()=>window.__kfbLab.motionClips.Medium?.length===33,null,{timeout:180000});
  p=await page.evaluate(()=>{
    const lab=window.__kfbLab;
    const items=lab.allClips('Medium').filter((x)=>x.library);
    const ids=items.map((x)=>x.clip.name);
    return {count:items.length,unique:new Set(ids).size,status:lab.motionPackStatus.Medium};
  });
  ok('Rig_Medium real KFB library loads 33 clips',p.count===33&&p.unique===33&&p.status==='ok');

  await page.evaluate(async()=>{
    const lab=window.__kfbLab;
    await new Promise((resolve)=>lab.setState({family:'',q:'',showData:true,dataTab:'info'},resolve));
    lab.selectClip('KFBMotion/kfb_locomotion_run_forward_a');
  });
  await page.waitForFunction(()=>window.__kfbLab.clip?.name==='kfb_locomotion_run_forward_a');
  p=await page.evaluate(()=>{
    const lab=window.__kfbLab;
    const item=lab.allClips().find((x)=>x.key==='KFBMotion/kfb_locomotion_run_forward_a');
    const profile=lab.motionProfile(item);
    return {
      clip:lab.clip?.name,
      mixer:!!lab.mixer,
      library:item?.library,
      state:profile?.semantics?.stateFamily,
      gait:profile?.semantics?.gait,
      direction:profile?.semantics?.direction,
      root:profile?.rootTravel?.mode,
      loop:profile?.loop,
      ref:lab.ML.referenceSpeed(lab.motion,item.clip.name,'Medium'),
      feet:lab.ML.plantedSummary(lab.motion,item.clip.name,'Medium'),
      markers:lab.ML.actionMarkers(lab.motion,item.clip.name).map((m)=>m.name),
      rate:profile?.acceptableRateWindow?.status
    };
  });
  ok('Run Forward selects through existing clip path',p.clip==='kfb_locomotion_run_forward_a'&&p.library===true&&p.mixer===true);
  ok('Run Forward semantic family is locomotion/run',p.state==='locomotion'&&p.gait==='run');
  ok('Run Forward direction/root facts are source-backed',p.direction==='forward'&&p.root==='travel');
  ok('Run Forward loop fact is present',p.loop===true);
  ok('Run Forward measured-derived reference speed is available',Number.isFinite(p.ref)&&p.ref>0);
  ok('Rig_Medium planted contacts are measured',typeof p.feet==='string'&&p.feet.startsWith('measured'));
  ok('unmeasured action markers are not invented',Array.isArray(p.markers)&&p.markers.length===0);
  ok('per-clip playback-rate window remains unknown',p.rate==='UNKNOWN_NOT_MEASURED_FOR_THIS_CLIP');

  await page.waitForFunction(()=>document.body.innerText.includes('Motion · Ref speed')&&document.body.innerText.includes('Motion · Feet')&&document.body.innerText.includes('AN-PROFILE-01'));
  ok('Data panel visibly exposes profile facts',await page.evaluate(()=>document.body.innerText.includes('Motion · State')&&document.body.innerText.includes('Motion · Loop')&&document.body.innerText.includes('Motion · Markers')));

  p=await page.evaluate(async()=>{
    const lab=window.__kfbLab;
    await new Promise((resolve)=>lab.setState({family:'motion:locomotion',q:''},resolve));
    const vis=lab.visibleClips('Medium');
    return {count:vis.length,allLibrary:vis.every((x)=>x.library),allLoco:vis.every((x)=>lab.itemFamily(x)==='motion:locomotion')};
  });
  ok('semantic locomotion filter uses profile metadata',p.count===4&&p.allLibrary&&p.allLoco);

  p=await page.evaluate(async()=>{
    const lab=window.__kfbLab;
    await new Promise((resolve)=>lab.setState({family:'',q:'travel'},resolve));
    const vis=lab.visibleClips('Medium').filter((x)=>x.library);
    await new Promise((resolve)=>lab.setState({q:''},resolve));
    return {count:vis.length,allTravel:vis.every((x)=>lab.motionProfile(x)?.rootTravel?.mode==='travel')};
  });
  ok('search can find source-backed travel semantics',p.count>0&&p.allTravel);

  await page.evaluate(async()=>{
    const lab=window.__kfbLab;
    await lab.setRig('Large');
    if(!lab.motionClips.Large) await lab.loadMotionPack('Large');
  });
  await page.waitForFunction(()=>window.__kfbLab.motionClips.Large?.length===33&&window.__kfbLab.state.rig==='Large',null,{timeout:180000});
  p=await page.evaluate(()=>{
    const lab=window.__kfbLab;
    const items=lab.allClips('Large').filter((x)=>x.library);
    return {count:items.length,unique:new Set(items.map((x)=>x.clip.name)).size,status:lab.motionPackStatus.Large};
  });
  ok('Rig_Large real KFB library loads 33 clips',p.count===33&&p.unique===33&&p.status==='ok');

  await page.evaluate(()=>window.__kfbLab.selectClip('KFBMotion/kfb_locomotion_run_forward_a'));
  await page.waitForFunction(()=>window.__kfbLab.clip?.name==='kfb_locomotion_run_forward_a');
  p=await page.evaluate(()=>{
    const lab=window.__kfbLab;
    const item=lab.allClips().find((x)=>x.key==='KFBMotion/kfb_locomotion_run_forward_a');
    const profile=lab.motionProfile(item);
    return {
      feet:lab.ML.plantedSummary(lab.motion,item.clip.name,'Large'),
      ref:lab.ML.referenceSpeed(lab.motion,item.clip.name,'Large'),
      hands:profile?.contacts?.hands?.status,
      markers:lab.ML.actionMarkers(lab.motion,item.clip.name).length
    };
  });
  ok('Rig_Large foot contacts remain unknown',p.feet.includes('UNKNOWN_NOT_MEASURED'));
  ok('Rig_Large travel reference speed uses its own measured distance',Number.isFinite(p.ref)&&p.ref>0);
  ok('hand contacts remain explicitly unknown',p.hands==='UNKNOWN_NOT_MEASURED');
  ok('Large does not gain invented run markers',p.markers===0);

  p=await page.evaluate(()=>{
    const lab=window.__kfbLab;
    const item=lab.allClips().find((x)=>x.key==='KFBMotion/kfb_climb_to_top_a');
    const marks=lab.ML.actionMarkers(lab.motion,item.clip.name);
    return marks.map((m)=>({name:m.name,status:m.status,phase:m.phase}));
  });
  ok('explicit climb endsOnTop marker survives',p.length===1&&p[0].name==='endsOnTop'&&p[0].status==='CATALOGUE_EXPLICIT'&&p[0].phase===1);

  ok('no KFB Motion/profile network failures',motionFailures.length===0);
  ok('no page errors during Animation Studio proof',pageErrors.length===0);
  console.log('AN-PROFILE-02 BROWSER PASS '+pass+'/'+pass);
} finally {
  await browser.close();
}
