import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const url=process.env.KFB_PROC_WC1_URL||
  'http://127.0.0.1:4173/tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-props-p0/integration-wc1-clay002.html';

const browser=await chromium.launch({
  headless:true,
  args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']
});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const consoleErrors=[],pageErrors=[];
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
page.on('pageerror',e=>pageErrors.push(String(e)));

await page.goto(url,{waitUntil:'networkidle',timeout:120000});
await page.waitForFunction(()=>window.__KFB_PROC_WC1?.ready===true,null,{timeout:120000});
const state=await page.evaluate(()=>window.__KFB_PROC_WC1);
const problems=[];
if(!/Clay002/.test(state?.clayLook||''))problems.push('Clay002 not active');
if(state?.secondRenderer!==false)problems.push('second renderer introduced');
if(state?.sourceOwner!=='WC1 existing renderer/world owner')problems.push('source owner mismatch');
if(state?.counts?.tufts!==16)problems.push('tuft count mismatch');
if(state?.counts?.pebbles!==12)problems.push('pebble count mismatch');
if(state?.counts?.trees!==12)problems.push('tree count mismatch');
if(!(state?.delta?.calls>=3&&state.delta.calls<=6))problems.push('unexpected call delta');
if(!(state?.delta?.triangles>0&&state.delta.triangles<100000))problems.push('unexpected triangle delta');
if((state?.delta?.textures??99)!==0)problems.push('diagnostic props added texture');
if(consoleErrors.length)problems.push('consoleErrors='+consoleErrors.length);
if(pageErrors.length)problems.push('pageErrors='+pageErrors.length);

await fs.mkdir('procedural-props-wc1-evidence',{recursive:true});
await page.screenshot({path:'procedural-props-wc1-evidence/integration-wc1-clay002.png'});
await fs.writeFile('procedural-props-wc1-evidence/integration-wc1-clay002.json',
  JSON.stringify({url,state,consoleErrors,pageErrors,problems},null,2));
await browser.close();

console.log(JSON.stringify({state,consoleErrors,pageErrors,problems},null,2));
if(problems.length)process.exit(1);
