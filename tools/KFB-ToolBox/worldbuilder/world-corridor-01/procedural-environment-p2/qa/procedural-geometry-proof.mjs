import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const url='http://127.0.0.1:4173/tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-environment-p2/procedural-geometry-proof.html';
const EXPECTED=[
  'SOFT_LOG_SEPARATOR',
  'SOFT_LOG_STACK3',
  'SOFT_STUMP_ROUND',
  'SOFT_STUMP_DETAILED',
  'SOFT_MUSHROOM_NORMAL',
  'SOFT_MUSHROOM_GROUP3',
  'SOFT_GRASS_TUFT'
];

await fs.mkdir('environment-family-p2-proc-evidence',{recursive:true});

const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1600,height:900}});
const consoleErrors=[],pageErrors=[];
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
page.on('pageerror',e=>pageErrors.push(String(e)));

let state=null;
const problems=[];

try{
  await page.goto(url,{waitUntil:'networkidle',timeout:120000});
  await page.waitForFunction(()=>window.__KFB_ENV_P2_PROC?.ready===true,null,{timeout:120000});
  state=await page.evaluate(()=>window.__KFB_ENV_P2_PROC);

  if(state.geometryModule!=='environment-family-p2.mjs')problems.push('geometry module mismatch');
  if(state.source?.sourcePin!=='a5fefb273b274e40b3a1e642788c87113fa6ea27')problems.push('source pin mismatch');
  if(state.source?.sourceIsolationArtifact!==11207717976)problems.push('source-isolation artifact mismatch');
  if(state.materialDecision!==false)problems.push('material decision leaked into geometry lane');
  if(state.displayMaterial!=='neutral-only')problems.push('display material contract changed');
  if(state.worldIntegrated!==false)problems.push('world integration unexpectedly true');
  if(state.buildingImplemented!==false)problems.push('building implementation unexpectedly true');

  const objects=state.objects||[];
  if(objects.length!==EXPECTED.length)problems.push('object-count='+objects.length+' expected='+EXPECTED.length);
  const names=objects.map(o=>o.name);
  for(let i=0;i<EXPECTED.length;i++){
    if(names[i]!==EXPECTED[i])problems.push('object['+i+']='+names[i]+' expected='+EXPECTED[i]);
  }

  for(const o of objects){
    if(!o.role)problems.push(o.name+': missing role');
    if(!(o.vertices>0))problems.push(o.name+': vertices');
    if(!(o.triangles>0))problems.push(o.name+': triangles');
    if(!Array.isArray(o.bounds)||o.bounds.length!==3||o.bounds.some(v=>!Number.isFinite(v)||v<=0)){
      problems.push(o.name+': invalid bounds '+JSON.stringify(o.bounds));
    }
  }

  if(state.stats?.renderer!=='WebGL2')problems.push('renderer='+state.stats?.renderer);
  if(state.displayTextureMaps!==0)problems.push('expected 0 display material texture maps, got '+state.displayTextureMaps);
  if(pageErrors.length)problems.push('pageErrors='+pageErrors.length);

  const unexpected=consoleErrors.filter(x=>!x.includes('404'));
  if(unexpected.length)problems.push('consoleErrors='+unexpected.length);

  await page.screenshot({
    path:'environment-family-p2-proc-evidence/procedural-geometry-proof.png',
    fullPage:true,
    timeout:30000
  }).catch(e=>consoleErrors.push('nonblocking screenshot: '+String(e)));
}catch(err){
  problems.push('qa-exception: '+String(err?.stack||err));
}

const evidence={url,state,consoleErrors,pageErrors,problems};
await fs.writeFile(
  'environment-family-p2-proc-evidence/state.json',
  JSON.stringify(evidence,null,2)
);
console.log(JSON.stringify(evidence,null,2));

await browser.close();
if(problems.length)process.exit(1);
