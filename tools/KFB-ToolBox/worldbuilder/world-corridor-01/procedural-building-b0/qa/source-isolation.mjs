import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const url='http://127.0.0.1:4173/tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-building-b0/source-isolation.html';
const EXPECTED=[
  {role:'compact-flat',id:'way/371401529',heightM:10.13,roof:'flat'},
  {role:'larger-gable',id:'way/371401492',heightM:12.46,roof:'gabled-hint'},
  {role:'compact-hip',id:'way/371401475',heightM:12.19,roof:'hipped-hint'}
];
const PIN='0c59e92d9d8688f5a88cd309ae8891dcd174c2fc';

await fs.mkdir('building-b0-evidence',{recursive:true});

const browser=await chromium.launch({
  headless:true,
  args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']
});
const page=await browser.newPage({viewport:{width:1600,height:900}});
const consoleErrors=[],pageErrors=[];
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
page.on('pageerror',e=>pageErrors.push(String(e)));

const states=[],problems=[];
try{
  await page.goto(url,{waitUntil:'networkidle',timeout:120000});
  await page.waitForFunction(()=>window.__KFB_BUILDING_B0?.ready===true,null,{timeout:120000});

  const controls=await page.evaluate(()=>window.__KFB_BUILDING_B0_API?.controls||[]);
  if(controls.length!==EXPECTED.length)problems.push('control-count='+controls.length);

  for(let i=0;i<EXPECTED.length;i++){
    const state=await page.evaluate(async i=>await window.__KFB_BUILDING_B0_API.show(i),i);
    states.push(state);
    const e=EXPECTED[i];

    if(state.sourcePin!==PIN)problems.push(e.id+': source pin mismatch');
    if(state.selectedRole!==e.role)problems.push(e.id+': role '+state.selectedRole);
    if(state.selectedId!==e.id)problems.push(e.id+': selected '+state.selectedId);
    if(Math.abs(state.sourceHeightM-e.heightM)>.001)problems.push(e.id+': height '+state.sourceHeightM);
    if(state.sourceRoof?.type!==e.roof)problems.push(e.id+': roof '+state.sourceRoof?.type);

    if(state.fixtureCount!==22)problems.push(e.id+': fixtureCount '+state.fixtureCount);
    if(!state.fixtureAnchor||!Number.isFinite(state.fixtureAnchor.x)||!Number.isFinite(state.fixtureAnchor.z)){
      problems.push(e.id+': invalid fixture anchor');
    }

    if(state.parity?.bodyParity!==true)problems.push(e.id+': body parity fail');
    if(state.parity?.roofParity!==true)problems.push(e.id+': roof parity fail');
    if(state.parity?.baseAnchored!==true)problems.push(e.id+': base not anchored');
    if(!state.parity?.accepted?.body?.hash||!state.parity?.candidate?.body?.hash){
      problems.push(e.id+': missing body hash');
    }
    if(!state.parity?.accepted?.roof?.hash||!state.parity?.candidate?.roof?.hash){
      problems.push(e.id+': missing roof hash');
    }

    if(state.facadeRuleId!=='kfb-facade-rule-v1')problems.push(e.id+': facade rule '+state.facadeRuleId);
    if(state.facadeRendered!==false)problems.push(e.id+': facade clone rendered');
    if(state.materialDecision!==false)problems.push(e.id+': material decision leaked');
    if(state.rendererCount!==1)problems.push(e.id+': rendererCount '+state.rendererCount);
    if(state.worldIntegrated!==false)problems.push(e.id+': world integrated');

    if(state.buildingA?.originalMaterials!==true)problems.push(e.id+': building_A materials changed');
    if(state.buildingA?.materialAdapted!==false)problems.push(e.id+': building_A material adapted');
    if(state.buildingA?.deformed!==false)problems.push(e.id+': building_A deformed');
    if(state.buildingA?.fallbackUsed!==false)problems.push(e.id+': building_A fallback');
    if(!Array.isArray(state.buildingA?.rawBounds)||state.buildingA.rawBounds.some(v=>!Number.isFinite(v)||v<=0)){
      problems.push(e.id+': building_A bounds invalid');
    }

    const corners=(state.sourceFootprint||[]).length;
    if(corners!==5)problems.push(e.id+': source footprint serialized corners '+corners+' expected 5 including closure');

    await page.screenshot({
      path:'building-b0-evidence/'+String(i+1).padStart(2,'0')+'-'+e.role+'.png',
      fullPage:true,
      timeout:30000
    }).catch(err=>consoleErrors.push('nonblocking screenshot '+e.id+': '+String(err)));
  }
}catch(err){
  problems.push('qa-exception: '+String(err?.stack||err));
}

if(pageErrors.length)problems.push('pageErrors='+pageErrors.length);
const unexpected=consoleErrors.filter(x=>!x.startsWith('nonblocking screenshot'));
if(unexpected.length)problems.push('consoleErrors='+unexpected.length);

const evidence={url,pin:PIN,expected:EXPECTED,states,consoleErrors,pageErrors,problems};
await fs.writeFile('building-b0-evidence/state.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));

await browser.close();
if(problems.length)process.exit(1);
