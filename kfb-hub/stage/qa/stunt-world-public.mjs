import fs from 'node:fs';
import { chromium } from 'playwright';

const origin=process.env.KFB_PUBLIC_ORIGIN||'https://kayfabizarro.pages.dev';
const route='/kfb-hub/stage/stunt-world/';
const direct=origin+route+'runtime/ChatGPT_web/osm-city-drive/';
const localDeployment=JSON.parse(fs.readFileSync('kfb-hub/stage/stunt-world/DEPLOYMENT.json','utf8'));
const out='stunt-world-public-evidence';
fs.mkdirSync(out,{recursive:true});

const result={
  schema:'kfb.stunt-world.public-proof.v0',
  origin,route,direct,
  expectedBuild:localDeployment.build,
  expectedRuntimeCommit:localDeployment.testedRuntimeCommit,
  expectedEvidenceCommit:localDeployment.browserEvidenceCommit,
  date:new Date().toISOString(),
  status:'RUNNING',
  checks:[],
  errors:[],
  humanFullRoute:'OPEN',
  physicalMobileQa:'OPEN',
  travelWalkDrive:'OPEN'
};
const check=(name,pass,details)=>{
  result.checks.push({name,pass:Boolean(pass),details});
  if(!pass)throw new Error(name);
};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

let browser,page;
try{
  // Cloudflare deploy is external to the GitHub commit. Wait for exact package identity.
  let publicDeployment=null;
  for(let attempt=0;attempt<36;attempt++){
    try{
      const response=await fetch(origin+route+'DEPLOYMENT.json?ci='+Date.now(),{
        cache:'no-store',
        signal:AbortSignal.timeout(15000)
      });
      if(response.ok){
        const data=await response.json();
        if(data.build===localDeployment.build
          && data.testedRuntimeCommit===localDeployment.testedRuntimeCommit
          && data.browserEvidenceCommit===localDeployment.browserEvidenceCommit){
          publicDeployment=data;
          break;
        }
      }
    }catch{}
    await sleep(10000);
  }
  check('exact Stage deployment manifest is public',Boolean(publicDeployment),{
    expectedBuild:localDeployment.build,
    expectedRuntimeCommit:localDeployment.testedRuntimeCommit
  });
  result.publicDeployment=publicDeployment;

  const manifestResponse=await fetch(origin+route+'PUBLIC_MANIFEST.json?ci='+Date.now(),{
    cache:'no-store',
    signal:AbortSignal.timeout(15000)
  });
  check('public manifest HTTP',manifestResponse.ok,{status:manifestResponse.status});
  const manifest=await manifestResponse.json();
  check('public runtime source identity',
    manifest.testedRuntimeCommit===localDeployment.testedRuntimeCommit
      && manifest.browserEvidenceCommit===localDeployment.browserEvidenceCommit,
    {testedRuntimeCommit:manifest.testedRuntimeCommit,browserEvidenceCommit:manifest.browserEvidenceCommit});
  const exactRuntimeFiles=Object.values(manifest.files||{}).filter(v=>v?.sourcePath).length;
  check('nine exact Race runtime files are declared',exactRuntimeFiles===9,exactRuntimeFiles);

  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const context=await browser.newContext({viewport:{width:940,height:900}});
  page=await context.newPage();
  page.on('pageerror',e=>result.errors.push(String(e)));
  page.on('console',m=>{
    if(m.type()==='error'&&!/favicon/.test(m.text()))result.errors.push(m.text());
  });

  const t0=Date.now();
  await page.goto(direct+'?qa=1&city=ehrenfeld-huerth-corridor-v0&look=grotesque',{
    waitUntil:'domcontentloaded',
    timeout:180000
  });
  await page.waitForFunction(()=>window.__OSM_CITY_DRIVE_READY__||window.__OSM_CITY_DRIVE_ERROR__,{},{
    timeout:180000
  });
  result.bootMs=Date.now()-t0;
  check('public corridor browser boot',
    await page.evaluate(()=>Boolean(window.__OSM_CITY_DRIVE_READY__)),
    await page.evaluate(()=>window.__OSM_CITY_DRIVE_ERROR__));
  check('public boot within ceiling',result.bootMs<180000,result.bootMs);

  const snapshot=()=>page.evaluate(()=>window.__OSM_CITY_DRIVE__.snapshot());
  const waitTicks=async(count,timeout=60000)=>{
    const startTick=(await snapshot()).physical.tick;
    await page.waitForFunction(
      ({startTick,count})=>window.__OSM_CITY_DRIVE__.snapshot().physical.tick>=startTick+count,
      {startTick,count},
      {timeout}
    );
  };

  result.snapshots={};
  result.snapshots.boot=await snapshot();
  check('exact public corridor candidate identity',
    result.snapshots.boot.id==='osm-city-drive-c1-deformer-ehrenfeld-huerth-corridor-v0-grotesque',
    result.snapshots.boot.id);
  check('exact public City source pin',
    result.snapshots.boot.sourcePins.cityCommit==='3db2c786152fd4d77ca33a63effd2a9db9c1d4c1'
      && result.snapshots.boot.sourcePins.cityBlob==='5d47021f9380101454b707a028d8675cab37fbe1',
    result.snapshots.boot.sourcePins);
  check('public corridor metadata',
    result.snapshots.boot.city.corridor?.routePhysicalLengthM===11384.3
      && result.snapshots.boot.city.corridor?.halfWidthM===220
      && result.snapshots.boot.city.corridor?.routePoints===510
      && result.snapshots.boot.city.corridor?.joinCount===2,
    result.snapshots.boot.city.corridor);
  check('public real OSM geometry is substantial',
    result.snapshots.boot.city.diagnostics.sourceBuildings>5000
      && result.snapshots.boot.city.diagnostics.sourceRoads>500,
    result.snapshots.boot.city.diagnostics);
  check('public mirror preserves Free Roam C0 ownership',
    result.snapshots.boot.presentation.physicalOwner==='FREE_ROAM_C0'
      && result.snapshots.boot.presentation.collisionGeometryDeformed===false,
    result.snapshots.boot.presentation);
  check('public start is Hürth corridor join',
    result.snapshots.boot.city.start.anchorId==='huerth-corridor-join'
      && result.snapshots.boot.city.start.headingSource==='corridor-route-reverse',
    result.snapshots.boot.city.start);

  await page.locator('#start').click();
  await page.waitForFunction(
    ()=>window.__OSM_CITY_DRIVE__.snapshot().physical.contacts.filter(Boolean).length===4,
    {},
    {timeout:30000}
  );
  result.snapshots.settled=await snapshot();
  check('public Stage settles four C0 wheel contacts',
    result.snapshots.settled.physical.contacts.every(Boolean),
    result.snapshots.settled.physical.contacts);
  check('public Hürth join is mapped road',
    result.snapshots.settled.city.nearestRoad?.distanceM<1
      && result.snapshots.settled.city.driveSurface.onMappedRoad===true,
    {nearestRoad:result.snapshots.settled.city.nearestRoad,driveSurface:result.snapshots.settled.city.driveSurface});
  check('public scene contains distant Ehrenfeld join',
    result.snapshots.settled.city.anchorDistancesM.ehrenfeldJoin>8000
      && result.snapshots.settled.city.anchorDistancesM.huerthJoin<10,
    result.snapshots.settled.city.anchorDistancesM);
  const recoveriesBefore=result.snapshots.settled.physical.events.filter(e=>e.type==='recovery');
  check('expected start-heading recovery is explicit',
    recoveriesBefore.length===1&&recoveriesBefore[0].reason==='receiver-start-heading',
    recoveriesBefore);
  await page.screenshot({path:out+'/settled.png'});

  await page.locator('#view').focus();
  const runBefore=result.snapshots.settled.physical.run;
  const recoveryCountBefore=recoveriesBefore.length;
  await page.keyboard.down('w');
  await page.waitForFunction(()=>window.__OSM_CITY_DRIVE__.snapshot().signedForwardSpeed>1.5,{},{
    timeout:20000
  });
  await waitTicks(40);
  result.snapshots.forward=await snapshot();
  await page.keyboard.up('w');

  const distanceM=Math.hypot(
    result.snapshots.forward.physical.position.x-result.snapshots.settled.physical.position.x,
    result.snapshots.forward.physical.position.z-result.snapshots.settled.physical.position.z
  );
  result.shortDriveDistanceM=distanceM;
  check('public short drive uses unchanged C0 run',
    distanceM>2
      && result.snapshots.forward.physical.run===runBefore
      && result.snapshots.forward.physical.contacts.filter(Boolean).length>=2,
    {distanceM,run:result.snapshots.forward.physical.run,contacts:result.snapshots.forward.physical.contacts});
  check('public deformer remains downstream of physics',
    result.snapshots.forward.presentation.signals.speed>0.04
      && result.snapshots.forward.presentation.physicalOwner==='FREE_ROAM_C0',
    result.snapshots.forward.presentation);
  const recoveriesAfter=result.snapshots.forward.physical.events.filter(e=>e.type==='recovery');
  check('no new public recovery during short drive',
    result.snapshots.forward.physical.run===runBefore
      && recoveriesAfter.length===recoveryCountBefore,
    {runBefore,runAfter:result.snapshots.forward.physical.run,recoveriesBefore,recoveriesAfter});
  check('no public script errors',result.errors.length===0,result.errors);
  await page.screenshot({path:out+'/forward.png'});

  result.status='PASS';
}catch(error){
  result.status='FAIL';
  result.failure=String(error.stack||error);
  if(page){
    result.appError=await page.evaluate(()=>window.__OSM_CITY_DRIVE_ERROR__).catch(()=>null);
    await page.screenshot({path:out+'/FAIL.png'}).catch(()=>{});
  }
  process.exitCode=1;
}finally{
  await browser?.close();
  fs.writeFileSync(out+'/public.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({
    status:result.status,
    checks:result.checks.length,
    bootMs:result.bootMs,
    shortDriveDistanceM:result.shortDriveDistanceM,
    failure:result.failure
  }));
}
