import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const file=path.resolve('tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-props-local-proof/KFB_WC1_P0B_LOCAL_REVIEW.html');
const url=pathToFileURL(file).href;

const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const consoleErrors=[],pageErrors=[];
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
page.on('pageerror',e=>pageErrors.push(String(e)));

await page.goto(url,{waitUntil:'networkidle',timeout:120000});
await page.waitForFunction(()=>window.__KFB_LOCAL_REVIEW?.ready===true,null,{timeout:120000});
const state=await page.evaluate(()=>window.__KFB_LOCAL_REVIEW);
const problems=[];
if(state.sourcePin!=='94443824e6b13f38c611defd06dacedd7c6d0faa')problems.push('source pin mismatch');
if(!/Clay002/.test(state.clayLook||''))problems.push('Clay002 inactive');
if(state.secondRenderer!==false)problems.push('second renderer');
if(state.owner!=='WC1 existing renderer/world owner')problems.push('owner mismatch');
if(state.counts?.tufts!==0||state.counts?.pebbles!==7||state.counts?.trees!==11)problems.push('frozen placement counts changed');
if(pageErrors.length)problems.push('pageErrors='+pageErrors.length);
const unexpectedConsole=consoleErrors.filter(x=>!x.includes('404'));
if(unexpectedConsole.length)problems.push('unexpected consoleErrors='+unexpectedConsole.length);

await fs.mkdir('local-proof-evidence',{recursive:true});
await fs.writeFile('local-proof-evidence/file-boot.json',JSON.stringify({url,state,consoleErrors,pageErrors,problems},null,2));
console.log(JSON.stringify({url,state,consoleErrors,pageErrors,problems},null,2));
await browser.close();
if(problems.length)process.exit(1);
