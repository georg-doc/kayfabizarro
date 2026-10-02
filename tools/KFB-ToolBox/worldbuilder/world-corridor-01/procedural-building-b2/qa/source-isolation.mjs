import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const url='http://127.0.0.1:4173/tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-building-b2/source-isolation.html';
const EXPECTED=[
  {lane:'compact-simple',id:'b1/compact-simple/371401529-to-371401477'},
  {lane:'ordinary-notched',id:'b1/ordinary-notched/371401481-to-371401497'},
  {lane:'large-complex',id:'b1/large-complex/371401488-to-371401495'}
];

await fs.mkdir('building-b2-evidence',{recursive:true});
const browser=await chromium.launch({
  headless:true,
  args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']
});
const page=await browser.newPage({viewport:{width:1600,height:900}});
const consoleErrors=[],pageErrors=[];
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
page.on('pageerror',e=>pageErrors.push(String(e)));

let state=null;
const problems=[];
try{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>window.__KFB_BUILDING_B2?.ready===true,null,{timeout:240000});
  state=await page.evaluate(()=>window.__KFB_BUILDING_B2);

  const s=state.summary;
  if(s?.owner?.blob!=='c11b6f7156eaee808fe4689ee406f9b3480b6f0b')problems.push('owner blob mismatch');
  if(s?.seam?.blob!=='95c6bfa04a4dd2106039db600b1e826ef48f4490')problems.push('seam blob mismatch');
  if(s?.fixture?.blob!=='c242f09421a72249edb9c9ba8e431532666ab321')problems.push('fixture blob mismatch');

  if(s?.zone?.buildings!==700)problems.push('zone buildings '+s?.zone?.buildings);
  if(s?.zone?.roads!==164)problems.push('zone roads '+s?.zone?.roads);
  if(s?.zone?.landuse!==22)problems.push('zone landuse '+s?.zone?.landuse);

  if(s?.presenter?.facadeRule!=='kfb-facade-rule-v1')problems.push('facade rule '+s?.presenter?.facadeRule);
  if(!(s?.presenter?.buildings>650))problems.push('presenter buildings '+s?.presenter?.buildings);
  if(!(s?.presenter?.windows>5000))problems.push('full-zone windows '+s?.presenter?.windows);
  if(!(s?.presenter?.doors>300))problems.push('full-zone doors '+s?.presenter?.doors);
  if(!(s?.presenter?.partyEdges>0))problems.push('no party-wall semantics observed');
  if(!(s?.presenter?.wallNormalsOnly>0))problems.push('FACE_NORMALS owner path not observed');
  if(s?.ownerModified!==false)problems.push('ownerModified true');

  const siblings=s?.siblings||[];
  if(siblings.length!==EXPECTED.length)problems.push('sibling count '+siblings.length);
  for(let i=0;i<EXPECTED.length;i++){
    const f=siblings[i],e=EXPECTED[i];
    if(f?.lane!==e.lane)problems.push(e.lane+': lane '+f?.lane);
    if(f?.siblingId!==e.id)problems.push(e.lane+': id '+f?.siblingId);
    if(f?.supportRecord!==true)problems.push(e.lane+': support record missing');
    if(!(f?.wallVertexCount>0)||!(f?.roofVertexCount>0))problems.push(e.lane+': wall/roof output missing');
    if(!(f?.detailCount>0))problems.push(e.lane+': no details');
    if(!(f?.doors>=1))problems.push(e.lane+': no door');
    if(!(f?.windows>=1))problems.push(e.lane+': no windows');
    if(f?.windowsOnParty!==0)problems.push(e.lane+': windows on party '+f?.windowsOnParty);
    if(f?.doorsOnParty!==0)problems.push(e.lane+': doors on party '+f?.doorsOnParty);
    if(f?.doorWithinRoadRange!==true)problems.push(e.lane+': door outside road range '+f?.doorEdgeRoadDistance);
    if(f?.doorNearBestRoadEdge!==true)problems.push(e.lane+': door not near best road edge '+JSON.stringify({door:f?.doorEdgeRoadDistance,min:f?.minEligibleRoadDistance}));
    if(f?.multiFloorWindows!==true)problems.push(e.lane+': no multi-floor window span '+f?.windowVerticalSpan);
  }

  const centers=state.stageCenters||[];
  const expectedX=state.expectedStageX||[-7,0,7];
  if(centers.length!==3)problems.push('stage center count '+centers.length);
  centers.forEach((p,i)=>{
    if(!Array.isArray(p)||p.some(v=>!Number.isFinite(v)))problems.push('invalid stage '+i);
    else{
      if(Math.abs(p[0]-expectedX[i])>.05)problems.push('stage '+i+' x '+p[0]);
      if(Math.abs(p[2])>.05)problems.push('stage '+i+' z '+p[2]);
    }
  });

  if(state.rendererCount!==1)problems.push('rendererCount '+state.rendererCount);
  if(state.fullOwnerGroupAddedToScene!==false)problems.push('full owner group added to scene');
  if(state.extractedEvidenceOnly!==true)problems.push('evidence extraction contract lost');
  if(state.materialDecision!==false)problems.push('material decision leaked');

  if(pageErrors.length)problems.push('pageErrors='+pageErrors.length);
  const unexpected=consoleErrors.filter(x=>!x.includes('404'));
  if(unexpected.length)problems.push('consoleErrors='+unexpected.length);

  await page.screenshot({
    path:'building-b2-evidence/existing-facade-owner.png',
    fullPage:true,
    timeout:30000
  }).catch(err=>consoleErrors.push('nonblocking screenshot: '+String(err)));
}catch(err){
  problems.push('qa-exception: '+String(err?.stack||err));
}

const evidence={url,state,consoleErrors,pageErrors,problems};
await fs.writeFile('building-b2-evidence/state.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
await browser.close();
if(problems.length)process.exit(1);
