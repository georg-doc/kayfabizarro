import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const url='http://127.0.0.1:4173/tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/PROCEDURAL_TEST_WORLD_01_SOURCE.html';
const outDir='procedural-test-world-r2d-evidence';
await fs.mkdir(outDir,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1600,height:900}});
const consoleErrors=[],pageErrors=[],problems=[];
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
page.on('pageerror',e=>pageErrors.push(String(e)));
let state=null;
try{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>{const A=window.__wb2d,W=A?.world;return !!(A&&W&&W.id==='r2d4'&&A.terrain&&W.worldGraph?.nodes?.length===4);},null,{timeout:240000});
  state=await page.evaluate(()=>{
    const A=window.__wb2d,W=A.world,resources=performance.getEntriesByType('resource').map(r=>r.name);
    const nodeIds=W.worldGraph.nodes.map(n=>n.id),connectionIds=W.worldGraph.connections.map(c=>c.id);
    const islandGroups=nodeIds.map(id=>!!A.scene.getObjectByName('R2D island · '+id));
    const bridges=connectionIds.map(id=>!!A.scene.getObjectByName('R2D ROAD_BRIDGE · '+id));
    const anchorIds=W.worldGraph.nodes.flatMap(n=>n.anchors.map(a=>a.id));
    const buildingReport=W.buildingReport||{},presentation=W.presentationReport||{};
    return{
      world:{id:W.id,zoneId:W.zone.id,status:W.zone.status,tile:W.tile,spawn:W.spawn},
      graph:W.worldGraph,
      doc:{format:A.doc?.format,version:A.doc?.version,id:A.doc?.id,world:A.doc?.world},
      terrain:{name:A.terrain?.name,vertices:A.terrain?.geometry?.attributes?.position?.count||0},
      visible:{islandGroups,bridges},
      anchorIds,
      presentations:Object.keys(presentation),
      buildings:Object.fromEntries(Object.entries(buildingReport).map(([k,v])=>[k,{facadeRule:v.facadeRule,placed:v.placed?.length||0,windows:v.stats?.windows||0,doors:v.stats?.doors||0}])),
      playIsNull:A.play==null,
      rendererCanvasCount:document.querySelectorAll('#wb2d canvas').length,
      loadedLegacy:{wi1Play:resources.some(x=>x.includes('/wi1-play.js')),travelGlobe:resources.some(x=>x.includes('travel')&&x.includes('globe')),cardStart:resources.some(x=>x.includes('card-start'))}
    };
  });
  if(state.world.id!=='r2d4')problems.push('world id '+state.world.id);
  if(state.graph.nodes.length!==4)problems.push('node count '+state.graph.nodes.length);
  if(state.graph.connections.length!==3)problems.push('connection count '+state.graph.connections.length);
  if(!state.graph.connections.every(c=>c.kind==='ROAD_BRIDGE'&&c.owner==='Track Core'&&c.sampleCount>2))problems.push('invalid Track Core connection');
  const decks=Object.fromEntries(state.graph.nodes.map(n=>[n.id,n.deckId]));
  if(decks['world.dystopia']!=='ignore_dystopia'||decks['world.utopia']!=='forget_utopia'||decks['world.protopia']!=='embrace_protopia')problems.push('deck routing');
  for(const id of ['town.spawn.market','town.resident.clown.onboarding','town.resident.driver.taxi','town.vehicle.taxi.01','dystopia.party.pentagram','dystopia.party.orc-singer','utopia.monstrosity.throne','utopia.robot.works','protopia.farm.social-core','protopia.lorekeeper.plateau'])if(!state.anchorIds.includes(id))problems.push('anchor '+id);
  if(state.visible.islandGroups.some(x=>!x))problems.push('island group missing');
  if(state.visible.bridges.some(x=>!x))problems.push('bridge missing');
  if(state.presentations.length!==4)problems.push('presentation count '+state.presentations.length);
  if(Object.keys(state.buildings).length!==4)problems.push('building owner count '+Object.keys(state.buildings).length);
  if(!Object.values(state.buildings).every(x=>x.facadeRule==='kfb-facade-rule-v1'))problems.push('facade owner mismatch');
  if(!Object.values(state.buildings).some(x=>x.placed>0&&x.windows>0&&x.doors>0))problems.push('no source-proven building family');
  if(state.doc.format!=='kfb-worldbuilder-scene'||state.doc.version!==1)problems.push('scene owner changed');
  if(state.doc.world?.provider!=='kfb.r2d-worldbuilder-adapter/2')problems.push('provider '+state.doc.world?.provider);
  if(!state.playIsNull)problems.push('legacy play unexpectedly active');
  if(state.loadedLegacy.wi1Play)problems.push('wi1-play loaded');
  if(state.loadedLegacy.travelGlobe)problems.push('Travel Globe loaded');
  if(state.loadedLegacy.cardStart)problems.push('card-start loaded');
  if(state.rendererCanvasCount!==1)problems.push('canvas count '+state.rendererCanvasCount);
  if(pageErrors.length)problems.push('pageErrors='+pageErrors.length);
  const unexpected=consoleErrors.filter(x=>!x.includes('favicon')&&!x.includes('404'));
  if(unexpected.length)problems.push('consoleErrors='+unexpected.length);
  await page.screenshot({path:outDir+'/r2d-wb2-four-island.png',fullPage:true,timeout:30000}).catch(e=>consoleErrors.push('nonblocking screenshot '+String(e)));
}catch(err){problems.push('qa-exception: '+String(err?.stack||err));}
const evidence={url,state,consoleErrors,pageErrors,problems};
await fs.writeFile(outDir+'/state.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
await browser.close();
if(problems.length)process.exit(1);
