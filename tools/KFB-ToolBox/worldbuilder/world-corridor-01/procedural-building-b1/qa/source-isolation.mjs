import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const url='http://127.0.0.1:4173/tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-building-b1/source-isolation.html';
const EXPECTED=[
  {id:'compact-simple',topology:'way/371401529',envelope:'way/371401477',roof:'flat',corners:4},
  {id:'ordinary-notched',topology:'way/371401481',envelope:'way/371401497',roof:'hipped-hint',corners:7},
  {id:'large-complex',topology:'way/371401488',envelope:'way/371401495',roof:'flat',corners:9}
];
const PIN='0c59e92d9d8688f5a88cd309ae8891dcd174c2fc';

await fs.mkdir('building-b1-evidence',{recursive:true});

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
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>window.__KFB_BUILDING_B1?.ready===true,null,{timeout:120000});

  const lanes=await page.evaluate(()=>window.__KFB_BUILDING_B1_API?.lanes||[]);
  if(lanes.length!==EXPECTED.length)problems.push('lane-count='+lanes.length);

  for(let i=0;i<EXPECTED.length;i++){
    const state=await page.evaluate(async i=>await window.__KFB_BUILDING_B1_API.show(i),i);
    states.push(state);
    const e=EXPECTED[i],f=state.facts;

    if(state.sourcePin!==PIN)problems.push(e.id+': source pin mismatch');
    if(state.corpusCount!==22)problems.push(e.id+': corpus count '+state.corpusCount);
    if(state.lane?.id!==e.id)problems.push(e.id+': lane id '+state.lane?.id);
    if(state.lane?.topologyId!==e.topology)problems.push(e.id+': topology donor '+state.lane?.topologyId);
    if(state.lane?.envelopeId!==e.envelope)problems.push(e.id+': envelope donor '+state.lane?.envelopeId);

    if(f?.topology?.corners!==e.corners)problems.push(e.id+': topology corners '+f?.topology?.corners);
    if(f?.sibling?.corners!==e.corners)problems.push(e.id+': sibling corners '+f?.sibling?.corners);
    if(f?.topologyPreserved!==true)problems.push(e.id+': topology not preserved');

    if(Math.abs(f?.targetAreaErrorPct??999)>.01)problems.push(e.id+': area error '+f?.targetAreaErrorPct);
    if(Math.abs(f?.targetAspectErrorPct??999)>.05)problems.push(e.id+': aspect error '+f?.targetAspectErrorPct);

    if(f?.heightMatch!==true)problems.push(e.id+': height mismatch');
    if(f?.roofMatch!==true)problems.push(e.id+': roof mismatch');
    if(f?.roofHeightMatch!==true)problems.push(e.id+': roof-height mismatch');
    if(f?.sibling?.roofType!==e.roof)problems.push(e.id+': sibling roof '+f?.sibling?.roofType);
    if(f?.baseAnchored!==true)problems.push(e.id+': base not anchored');

    if(!Number.isFinite(f?.scale?.long)||!Number.isFinite(f?.scale?.short)||f.scale.long<=0||f.scale.short<=0){
      problems.push(e.id+': invalid scale '+JSON.stringify(f?.scale));
    }
    if(f.scale.long<.5||f.scale.long>2||f.scale.short<.5||f.scale.short>2){
      problems.push(e.id+': scale outside bounded proof range '+JSON.stringify(f.scale));
    }

    if(!(f?.v2?.topology?.body?.triangles>0)||!(f?.v2?.sibling?.body?.triangles>0)||!(f?.v2?.envelope?.body?.triangles>0)){
      problems.push(e.id+': missing V2 body geometry');
    }
    if(!(f?.v2?.topology?.roof?.triangles>0)||!(f?.v2?.sibling?.roof?.triangles>0)||!(f?.v2?.envelope?.roof?.triangles>0)){
      problems.push(e.id+': missing V2 roof geometry');
    }

    if(state.facadeRuleId!=='kfb-facade-rule-v1')problems.push(e.id+': facade owner '+state.facadeRuleId);
    if(state.facadeRendered!==false)problems.push(e.id+': facade clone rendered');
    if(state.materialDecision!==false)problems.push(e.id+': material decision leaked');
    if(state.rendererCount!==1)problems.push(e.id+': renderer count '+state.rendererCount);
    if(state.worldIntegrated!==false)problems.push(e.id+': world integrated');

    const centers=[state.stageCenters?.topology,state.stageCenters?.sibling,state.stageCenters?.envelope];
    const expectedX=state.expectedStageX||[-7,0,7];
    centers.forEach((p,k)=>{
      if(!Array.isArray(p)||p.length!==3||p.some(v=>!Number.isFinite(v))){
        problems.push(e.id+': invalid stage center '+k);
        return;
      }
      if(Math.abs(p[0]-expectedX[k])>.05)problems.push(e.id+': stage '+k+' x='+p[0]+' expected '+expectedX[k]);
      if(Math.abs(p[2])>.05)problems.push(e.id+': stage '+k+' z='+p[2]);
    });
    for(let k=1;k<centers.length;k++){
      if(Array.isArray(centers[k-1])&&Array.isArray(centers[k])&&Math.abs(centers[k][0]-centers[k-1][0])<6){
        problems.push(e.id+': stages not separated '+(k-1)+'/'+k);
      }
    }

    await page.screenshot({
      path:'building-b1-evidence/'+String(i+1).padStart(2,'0')+'-'+e.id+'.png',
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
await fs.writeFile('building-b1-evidence/state.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));

await browser.close();
if(problems.length)process.exit(1);
