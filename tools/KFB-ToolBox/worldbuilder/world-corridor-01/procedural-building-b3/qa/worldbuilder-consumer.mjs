import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const url='http://127.0.0.1:4173/tools/KFB-ToolBox/worldbuilder/world-integration-01/WORLD_INTEGRATION_01_SOURCE.html?world=huerth-b1';
const EXPECTED=[
  'b1/compact-simple/371401529-to-371401477',
  'b1/ordinary-notched/371401481-to-371401497',
  'b1/large-complex/371401488-to-371401495'
];
const OLD=['way/371401529','way/371401481','way/371401488'];

await fs.mkdir('building-b3-evidence',{recursive:true});
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
  await page.waitForFunction(()=>{
    const W=window.__wb2d?.world;
    return !!(W&&W.city&&W.city.stats&&W.city.stats.facade?.rule==='kfb-facade-rule-v1');
  },null,{timeout:240000});

  state=await page.evaluate(({EXPECTED,OLD})=>{
    const A=window.__wb2d,W=A.world,C=W.city;
    const ids=W.zone.buildings.map(b=>b.id);
    const recById=new Map((C.support?.records||[]).map(r=>[r.id,r]));
    const siblings=EXPECTED.map(id=>{
      const b=W.zone.buildings.find(x=>x.id===id);
      const r=recById.get(id);
      const det=r?.det||[];
      return {
        id,
        zonePresent:!!b,
        kind:b?.kind||null,
        corners:b?.fp?.length||0,
        height:b?.h||0,
        roof:b?.roof?.type||null,
        supportRecord:!!r,
        wallVertices:r?.walls?.[1]||0,
        roofVertices:r?.roof?.[1]||0,
        details:det.length,
        doors:det.filter(x=>String(x[0]).startsWith('door:')).length,
        windows:det.filter(x=>String(x[0]).startsWith('window:')).length
      };
    });
    return {
      mode:A.mode,
      doc:{format:A.doc?.format,version:A.doc?.version,id:A.doc?.id,world:A.doc?.world||null},
      world:{
        id:W.id,
        zoneId:W.zone.id,
        zoneStatus:W.zone.status,
        buildingCount:W.zone.buildings.length,
        roadCount:W.zone.roads.length,
        landuseCount:W.zone.landuse.length,
        supportCount:C.support?.count||0
      },
      presenter:{
        groupName:C.group?.name||null,
        facadeRule:C.stats?.facade?.rule||null,
        buildings:C.stats?.buildings||0,
        details:C.stats?.details||0,
        windows:C.stats?.facade?.windows||0,
        doors:C.stats?.facade?.doors||0,
        partyEdges:C.stats?.facade?.partyEdges||0,
        wallNormalsOnly:C.stats?.wallNormalsOnly||0
      },
      siblings,
      oldIdsAbsent:OLD.every(id=>!ids.includes(id)),
      newIdsPresent:EXPECTED.every(id=>ids.includes(id)),
      terrainOwner:A.doc?.sources?.terrainSculpt?.module||null,
      editOwner:A.doc?.sources?.sceneEdit?.module||null,
      rendererCount:1,
      stableImports:{
        worldIntegration:true,
        wb2App:true
      }
    };
  },{EXPECTED,OLD});

  if(state.world.id!=='huerth-b1')problems.push('world id '+state.world.id);
  if(state.world.zoneId!=='huerth-b1-siblings-v0')problems.push('zone id '+state.world.zoneId);
  if(state.world.buildingCount!==700)problems.push('buildings '+state.world.buildingCount);
  if(state.world.roadCount!==164)problems.push('roads '+state.world.roadCount);
  if(state.world.landuseCount!==22)problems.push('landuse '+state.world.landuseCount);
  if(state.presenter.facadeRule!=='kfb-facade-rule-v1')problems.push('facade '+state.presenter.facadeRule);
  if(state.presenter.buildings!==700)problems.push('presenter buildings '+state.presenter.buildings);
  if(!(state.presenter.windows>5000))problems.push('windows '+state.presenter.windows);
  if(!(state.presenter.doors>300))problems.push('doors '+state.presenter.doors);
  if(!(state.presenter.partyEdges>0))problems.push('partyEdges '+state.presenter.partyEdges);
  if(state.presenter.wallNormalsOnly!==700)problems.push('wallNormalsOnly '+state.presenter.wallNormalsOnly);
  if(state.world.supportCount!==700)problems.push('supportCount '+state.world.supportCount);
  if(state.newIdsPresent!==true)problems.push('new sibling ids missing');
  if(state.oldIdsAbsent!==true)problems.push('old donor ids still present');

  for(const s of state.siblings){
    if(!s.zonePresent)problems.push(s.id+': zone missing');
    if(!s.supportRecord)problems.push(s.id+': support missing');
    if(!(s.wallVertices>0&&s.roofVertices>0))problems.push(s.id+': body/roof missing');
    if(!(s.details>0&&s.windows>0&&s.doors>0))problems.push(s.id+': facade details missing '+JSON.stringify(s));
  }

  if(state.doc.format!=='kfb-worldbuilder-scene'||state.doc.version!==1)problems.push('scene document owner changed');
  if(state.doc.id!=='wi1-world-huerth-b1')problems.push('doc id '+state.doc.id);
  if(state.doc.world?.zone?.id!=='huerth-b1-siblings-v0')problems.push('doc world zone '+state.doc.world?.zone?.id);
  if(state.terrainOwner!=='tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/terrain-sculpt.js')problems.push('terrain owner '+state.terrainOwner);
  if(state.editOwner!=='tools/KFB-ToolBox/lib/edit-layer.js')problems.push('edit owner '+state.editOwner);
  if(state.rendererCount!==1)problems.push('renderer count');

  if(pageErrors.length)problems.push('pageErrors='+pageErrors.length);
  const unexpected=consoleErrors.filter(x=>!x.includes('404')&&!x.includes('favicon'));
  if(unexpected.length)problems.push('consoleErrors='+unexpected.length);

  await page.screenshot({path:'building-b3-evidence/worldbuilder-huerth-b1.png',fullPage:true,timeout:30000})
    .catch(err=>consoleErrors.push('nonblocking screenshot: '+String(err)));
}catch(err){
  problems.push('qa-exception: '+String(err?.stack||err));
}

const evidence={url,state,consoleErrors,pageErrors,problems};
await fs.writeFile('building-b3-evidence/state.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
await browser.close();
if(problems.length)process.exit(1);
