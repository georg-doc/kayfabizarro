import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const file=path.resolve('tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-props-local-proof/environment-family-p1-source-isolation.html');
const url=pathToFileURL(file).href;
const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1600,height:900}});
const consoleErrors=[],pageErrors=[];
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
page.on('pageerror',e=>pageErrors.push(String(e)));

await page.goto(url,{waitUntil:'networkidle',timeout:120000});
await page.waitForFunction(()=>window.__KFB_ENV_P1?.ready===true,null,{timeout:120000});
const state=await page.evaluate(()=>window.__KFB_ENV_P1);
const problems=[];

if(state.objects?.length!==5)problems.push('expected 5 source-isolation objects');
if(state.positiveControl!=='P0B_TREE')problems.push('positive control changed');
if(state.noMaterialDecision!==true)problems.push('material boundary missing');
if(state.sources?.tree?.blob!=='0174e27c2ada67753f5e29161e4973087cf04d8e')problems.push('P0B source mismatch');
if(state.sources?.k1rock?.blob!=='1cb40e45dc4d2ca20a554e4315b68f9331af4152')problems.push('K1 source mismatch');
if(state.sources?.t3?.blob!=='a4be0b0fb8a8c5e7b8589495c71015d30de7a5f2')problems.push('T3 source mismatch');
const names=(state.objects||[]).map(x=>x.name);
for(const n of ['P0B_TREE','P0B_PEBBLE','K1_BOULDER','T3_ACCENT_ROCK','T3_BUSH'])if(!names.includes(n))problems.push('missing '+n);
for(const o of state.objects||[]){
  if(!(o.vertices>0)||!(o.triangles>0))problems.push('invalid geometry '+o.name);
  if(!Array.isArray(o.bounds)||o.bounds.some(v=>!Number.isFinite(v)||v<=0))problems.push('invalid bounds '+o.name);
}
if(pageErrors.length)problems.push('pageErrors='+pageErrors.length);
const unexpected=consoleErrors.filter(x=>!x.includes('404'));
if(unexpected.length)problems.push('unexpected consoleErrors='+unexpected.length);

await fs.mkdir('environment-family-p1-evidence',{recursive:true});
await fs.writeFile('environment-family-p1-evidence/state.json',JSON.stringify({url,state,consoleErrors,pageErrors,problems},null,2));
await page.screenshot({path:'environment-family-p1-evidence/source-isolation.png',fullPage:true,timeout:30000}).catch(()=>{});
console.log(JSON.stringify({state,consoleErrors,pageErrors,problems},null,2));
await browser.close();
if(problems.length)process.exit(1);
