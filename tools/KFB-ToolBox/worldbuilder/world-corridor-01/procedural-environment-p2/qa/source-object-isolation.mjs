import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const url='http://127.0.0.1:4173/tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-environment-p2/source-object-isolation.html';
const EXPECTED=[
  'log','log_large','log_stack',
  'stump_old','stump_round','stump_roundDetailed','stump_oldTall',
  'mushroom_red','mushroom_redTall','mushroom_redGroup','mushroom_tanGroup',
  'Grass_1_A_Color1','Grass_2_A_Color1'
];
const PIN='a5fefb273b274e40b3a1e642788c87113fa6ea27';

await fs.mkdir('environment-family-p2-evidence',{recursive:true});

const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const consoleErrors=[],pageErrors=[];
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
page.on('pageerror',e=>pageErrors.push(String(e)));

const problems=[],states=[];
try{
  await page.goto(url,{waitUntil:'networkidle',timeout:120000});
  await page.waitForFunction(()=>window.__KFB_ENV_P2?.ready===true,null,{timeout:120000});

  const donors=await page.evaluate(()=>window.__KFB_ENV_P2_API?.donors||[]);
  if(donors.length!==EXPECTED.length)problems.push('donor-count='+donors.length+' expected='+EXPECTED.length);
  const donorNames=donors.map(d=>d.name);
  for(let i=0;i<EXPECTED.length;i++) if(donorNames[i]!==EXPECTED[i]) problems.push('donor-order['+i+']='+donorNames[i]+' expected='+EXPECTED[i]);

  for(let i=0;i<EXPECTED.length;i++){
    const state=await page.evaluate(async i=>await window.__KFB_ENV_P2_API.load(i),i);
    states.push(state);

    if(state.pin!==PIN)problems.push(EXPECTED[i]+': pin mismatch');
    if(state.donor?.name!==EXPECTED[i])problems.push(EXPECTED[i]+': wrong donor '+state.donor?.name);
    if(state.fallbackUsed!==false)problems.push(EXPECTED[i]+': fallback used');
    if(state.originalMaterials!==true)problems.push(EXPECTED[i]+': originalMaterials false');
    if(state.deformed!==false)problems.push(EXPECTED[i]+': deformed');
    if(state.materialAdapted!==false)problems.push(EXPECTED[i]+': material adapted');

    const b=state.rawLoadedBounds;
    if(!Array.isArray(b)||b.length!==3||b.some(v=>!Number.isFinite(v)||v<=0)){
      problems.push(EXPECTED[i]+': invalid rawLoadedBounds '+JSON.stringify(b));
    }

    const ref=state.donor?.raw;
    if(Array.isArray(ref)&&Array.isArray(b)&&b.length===3){
      for(let k=0;k<3;k++){
        const tol=Math.max(.03,Math.abs(ref[k])*.08);
        if(Math.abs(b[k]-ref[k])>tol){
          problems.push(EXPECTED[i]+': bound['+k+'] '+b[k].toFixed(4)+' vs catalog '+ref[k].toFixed(4)+' tol '+tol.toFixed(4));
        }
      }
    }

    if(EXPECTED[i]==='stump_oldTall' && state.donor?.family!=='stump-negative'){
      problems.push('stump_oldTall negative-control classification lost');
    }

    const filename=String(i+1).padStart(2,'0')+'-'+EXPECTED[i].replace(/[^a-zA-Z0-9_-]/g,'_')+'.png';
    await page.screenshot({path:'environment-family-p2-evidence/'+filename,fullPage:true,timeout:30000}).catch(e=>{
      consoleErrors.push('nonblocking screenshot '+EXPECTED[i]+': '+String(e));
    });
  }
}catch(err){
  problems.push('qa-exception: '+String(err?.stack||err));
}

if(pageErrors.length)problems.push('pageErrors='+pageErrors.length);
const unexpectedConsole=consoleErrors.filter(x=>!x.startsWith('nonblocking screenshot'));
if(unexpectedConsole.length)problems.push('consoleErrors='+unexpectedConsole.length);

const evidence={
  url,
  pin:PIN,
  expected:EXPECTED,
  states,
  consoleErrors,
  pageErrors,
  problems
};
await fs.writeFile('environment-family-p2-evidence/state.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
await browser.close();
if(problems.length)process.exit(1);
