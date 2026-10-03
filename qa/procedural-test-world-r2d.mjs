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
  await page.waitForFunction(()=>{
    const A=window.__wb2d,W=A?.world;
    return !!(A&&W&&W.id==='r2d3'&&A.terrain&&A.terrain.name?.includes('R2D'));
  },null,{timeout:240000});

  state=await page.evaluate(()=>{
    const A=window.__wb2d,W=A.world;
    const resources=performance.getEntriesByType('resource').map(r=>r.name);
    const road=A.scene.getObjectByName('R2D Track Core road');
    const c=W.spawn;
    const samples=[
      [c.x,c.z],
      [c.x+5,c.z],
      [c.x,c.z+5],
      [W.tile.cx+W.tile.size*.55,W.tile.cz]
    ].map(([x,z])=>({x,z,h:A.terrainHeightAt(x,z),mask:W.maskAt?.(x,z)||null}));
    return {
      world:{id:W.id,zoneId:W.zone.id,status:W.zone.status,tile:W.tile,spawn:W.spawn},
      doc:{format:A.doc?.format,version:A.doc?.version,id:A.doc?.id,world:A.doc?.world},
      terrain:{name:A.terrain?.name,vertices:A.terrain?.geometry?.attributes?.position?.count||0},
      road:{present:!!road,meshCount:road?road.children.length:0},
      presentation:W.presentationReport||null,
      visible:{
        top:!!A.scene.getObjectByName('R2D continuous island top'),
        underside:!!A.scene.getObjectByName('R2D floating island underside'),
        pond:!!A.scene.getObjectByName('R2D pond'),
        creek:!!A.scene.getObjectByName('R2D creek'),
        waterfall:!!A.scene.getObjectByName('R2D waterfall'),
        nature:!!A.scene.getObjectByName('R2D source-proven procedural nature')
      },
      playIsNull:A.play==null,
      rendererCanvasCount:document.querySelectorAll('#wb2d canvas').length,
      samples,
      loadedLegacy:{
        wi1Play:resources.some(x=>x.includes('/wi1-play.js')),
        travelGlobe:resources.some(x=>x.includes('travel')&&x.includes('globe')),
        cardStart:resources.some(x=>x.includes('card-start'))
      }
    };
  });

  if(state.world.id!=='r2d3')problems.push('world id '+state.world.id);
  if(state.world.status!=='SOURCE_DERIVED_R2D_V0')problems.push('world status '+state.world.status);
  if(state.doc.format!=='kfb-worldbuilder-scene'||state.doc.version!==1)problems.push('scene owner changed');
  if(state.doc.world?.provider!=='kfb.r2d-worldbuilder-adapter/1')problems.push('provider '+state.doc.world?.provider);
  if(!state.terrain.name?.includes('R2D'))problems.push('terrain not R2D');
  if(!(state.terrain.vertices>1000))problems.push('terrain vertices '+state.terrain.vertices);
  if(!state.road.present)problems.push('Track Core road missing');
  if(!state.visible.top)problems.push('continuous island top missing');
  if(!state.visible.underside)problems.push('floating underside missing');
  if(!state.visible.pond)problems.push('pond missing');
  if(!state.visible.creek)problems.push('creek missing');
  if(!state.visible.waterfall)problems.push('waterfall missing');
  if(!state.visible.nature)problems.push('procedural nature missing');
  if(!state.presentation?.underside)problems.push('presentation report underside false');
  if(!(state.presentation?.nature?.trees>0))problems.push('presentation nature tree count missing');
  if(!state.playIsNull)problems.push('legacy play unexpectedly active');
  if(state.loadedLegacy.wi1Play)problems.push('wi1-play loaded');
  if(state.loadedLegacy.travelGlobe)problems.push('Travel Globe loaded');
  if(state.loadedLegacy.cardStart)problems.push('card-start loaded');
  if(state.rendererCanvasCount!==1)problems.push('canvas count '+state.rendererCanvasCount);
  if(!state.samples.some(x=>x.h<-5))problems.push('island outside/drop height not observed');
  if(pageErrors.length)problems.push('pageErrors='+pageErrors.length);
  const unexpected=consoleErrors.filter(x=>!x.includes('favicon')&&!x.includes('404'));
  if(unexpected.length)problems.push('consoleErrors='+unexpected.length);

  await page.screenshot({path:outDir+'/r2d-wb2.png',fullPage:true,timeout:30000}).catch(e=>consoleErrors.push('nonblocking screenshot '+String(e)));
}catch(err){
  problems.push('qa-exception: '+String(err?.stack||err));
}

const evidence={url,state,consoleErrors,pageErrors,problems};
await fs.writeFile(outDir+'/state.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
await browser.close();
if(problems.length)process.exit(1);
