import fs from 'node:fs';
import { chromium } from 'playwright';

const URL='https://kayfabizarro.pages.dev/kfb-hub/stage/minigames/dungeon-raid-v2/';
const EXPECT={
  implementationHead:'e2d9a1fa24d024eb89ad513dc3b97762c0fb460b',
  testedHead:'da04e03378f79ca973a3768e0c934bc5372b1aa5',
  roomId:'R02'
};
const out='artifacts/world-atlas-dungeon-room-s14-public';
fs.mkdirSync(out,{recursive:true});
const report={url:URL,checks:[],errors:[],httpFailures:[]};
const check=(name,pass,detail=null)=>{
  report.checks.push({name,pass:!!pass,detail});
  if(!pass) process.exitCode=1;
};
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

async function waitForMarker(){
  let last=null;
  for(let i=1;i<=12;i++){
    try{
      const r=await fetch(URL+'SOURCE.json?qa='+Date.now(),{cache:'no-store',headers:{'cache-control':'no-cache'}});
      const text=await r.text();
      last={attempt:i,status:r.status,type:r.headers.get('content-type'),text:text.slice(0,1000)};
      if(r.ok){
        try{
          const j=JSON.parse(text);
          if(j?.implementationHead===EXPECT.implementationHead && j?.testedHead===EXPECT.testedHead) return {j,attempt:i};
        }catch{}
      }
    }catch(e){ last={attempt:i,error:String(e)}; }
    if(i<12) await sleep(10000);
  }
  throw new Error('public SOURCE marker not current after polling: '+JSON.stringify(last));
}

const marker=await waitForMarker().catch(e=>{report.errors.push(String(e)); return null;});
if(marker){
  report.marker=marker;
  const j=marker.j;
  check('public SOURCE implementation head',j.implementationHead===EXPECT.implementationHead,j.implementationHead);
  check('public SOURCE tested head',j.testedHead===EXPECT.testedHead,j.testedHead);
  check('public SOURCE browser proof 15/15',j.browserProof?.checksPassed===15 && j.browserProof?.checksTotal===15,j.browserProof);
  check('public SOURCE Blender file proof',j.blenderProof?.blendSaved===true && j.blenderProof?.manifestInstances===37 && j.blenderProof?.importedObjects===39,j.blenderProof);
  check('public SOURCE remains pre-raid',j.preRaid===true && j.combat===false && j.bspIntegration===false && j.tinyTreats===false,{preRaid:j.preRaid,combat:j.combat,bspIntegration:j.bspIntegration,tinyTreats:j.tinyTreats});
}else{
  check('public SOURCE marker reachable and current',false,report.errors.at(-1));
}

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:820}});
page.on('pageerror',e=>report.errors.push('pageerror: '+String(e)));
page.on('console',m=>{if(m.type()==='error') report.errors.push('console: '+m.text());});
page.on('response',r=>{if(r.status()>=400) report.httpFailures.push({status:r.status(),url:r.url()});});

try{
  const response=await page.goto(URL+'?qa='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
  check('exact public Stage HTTP 200',!!response && response.ok(),response?.status());
  check('Stage marker visible in DOM',
    await page.locator('body[data-kfb-stage="dungeon-room-s14-r02"]').count()===1,
    await page.locator('body').getAttribute('data-kfb-stage'));
  check('Stage implementation marker',
    await page.locator('body').getAttribute('data-implementation-head')===EXPECT.implementationHead,
    await page.locator('body').getAttribute('data-implementation-head'));

  const iframe=page.locator('iframe');
  const iframeSrc=await iframe.getAttribute('src');
  check('Stage embeds S14 room source',iframeSrc==='/tools/world_atlas/source/KayKit_Dungeon_Room_Blueprint_S14.html',iframeSrc);

  const handle=await iframe.elementHandle();
  const frame=await handle.contentFrame();
  await frame.waitForFunction(()=>!!window.__S14?.root && document.getElementById('hud')?.style.display==='none',{}, {timeout:180000});
  const state=await frame.evaluate(()=>{
    const red=[...document.querySelectorAll('#checks .no')].map(x=>x.textContent.trim());
    return {
      title:document.title,
      roomId:window.__S14.room?.id,
      rootChildren:window.__S14.root?.children?.length??0,
      visibleProps:window.__S14.root.children.filter(x=>x.visible && x.userData.recipe?.layer==='prop').length,
      technicalFailures:red.filter(x=>!x.startsWith('Abweichung von der Vorlage')),
      documentedDeviations:red.filter(x=>x.startsWith('Abweichung von der Vorlage')).length,
      manifest:window.__S14.blenderManifest()
    };
  });
  report.roomState={
    title:state.title,roomId:state.roomId,rootChildren:state.rootChildren,visibleProps:state.visibleProps,
    technicalFailures:state.technicalFailures,documentedDeviations:state.documentedDeviations,
    manifestSchema:state.manifest?.schema,manifestInstances:state.manifest?.instances?.length
  };
  check('public embedded room is R02',state.roomId===EXPECT.roomId,state.roomId);
  check('public embedded room instances loaded',state.rootChildren===41,state.rootChildren);
  check('public embedded visible props loaded',state.visibleProps===21,state.visibleProps);
  check('public embedded technical room checks green',state.technicalFailures.length===0,state.technicalFailures);
  check('public embedded known deviations remain explicit',state.documentedDeviations===4,state.documentedDeviations);
  check('public embedded Blender manifest live',state.manifest?.schema==='kfb.blender-room-manifest.v1' && state.manifest?.instances?.length===37,{schema:state.manifest?.schema,instances:state.manifest?.instances?.length});
  await page.screenshot({path:out+'/public-r02.png',fullPage:true});
}catch(e){
  report.errors.push(String(e?.stack||e));
  process.exitCode=1;
}finally{
  check('no public browser console/page errors',report.errors.length===0,report.errors);
  check('no failed public HTTP assets',report.httpFailures.length===0,report.httpFailures);
  fs.writeFileSync(out+'/public-report.json',JSON.stringify(report,null,2)+'\n');
  await browser.close();
}
