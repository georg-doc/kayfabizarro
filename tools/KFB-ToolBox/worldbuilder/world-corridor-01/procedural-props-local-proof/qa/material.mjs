import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const file=path.resolve('tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-props-local-proof/KFB_WC1_P0B_MATERIAL_REVIEW.html');
const url=pathToFileURL(file).href;
const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const consoleErrors=[],pageErrors=[];
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
page.on('pageerror',e=>pageErrors.push(String(e)));

await page.goto(url,{waitUntil:'networkidle',timeout:120000});
await page.waitForFunction(()=>window.__KFB_LOCAL_REVIEW?.ready===true,null,{timeout:120000});

const get=()=>page.evaluate(()=>window.__KFB_LOCAL_REVIEW);
const states=[];
states.push(await get());

for (const mode of ['derek','neutral','clay002']) {
  await page.click('.material[data-material="'+mode+'"]');
  await page.waitForFunction(m=>window.__KFB_LOCAL_REVIEW?.materialMode===m,mode,{timeout:60000});
  states.push(await get());
}

const problems=[];
const [initial,derek,neutral,back]=states;
if(initial.sourcePin!=='94443824e6b13f38c611defd06dacedd7c6d0faa')problems.push('source pin mismatch');
if(initial.materialMode!=='clay002')problems.push('initial material mismatch');
if(derek.materialMode!=='derek'||!/Derek RGB/.test(derek.clayLook||''))problems.push('Derek switch failed');
if(neutral.materialMode!=='neutral'||!/Clay off/.test(neutral.clayLook||''))problems.push('Neutral switch failed');
if(back.materialMode!=='clay002'||!/Clay002/.test(back.clayLook||''))problems.push('Clay002 restore failed');
for(const s of states){
  if(s.counts?.tufts!==0||s.counts?.pebbles!==7||s.counts?.trees!==11)problems.push('geometry counts changed');
  if(s.secondRenderer!==false)problems.push('second renderer');
}
if(pageErrors.length)problems.push('pageErrors='+pageErrors.length);
const unexpected=consoleErrors.filter(x=>!x.includes('404'));
if(unexpected.length)problems.push('unexpected consoleErrors='+unexpected.length);

console.log(JSON.stringify({url,states,consoleErrors,pageErrors,problems},null,2));
await browser.close();
if(problems.length)process.exit(1);
