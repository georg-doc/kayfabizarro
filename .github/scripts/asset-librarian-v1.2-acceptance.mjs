import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT, BASE_URL, ARTIFACT_DIR, assert, findBrowser } from './asset-librarian-v1.2-env.mjs';
import { waitHttp, connectCDP, waitFor } from './asset-librarian-v1.2-cdp.mjs';
import { setFilters } from './asset-librarian-v1.2-ui.mjs';
import { runTasksA } from './asset-librarian-v1.2-tasks-a.mjs';
import { runTasksB } from './asset-librarian-v1.2-tasks-b.mjs';

async function run(){
  mkdirSync(ARTIFACT_DIR,{recursive:true});const browserExe=findBrowser();assert(browserExe,'No Chrome/Chromium found');
  const server=spawn('python3',['-m','http.server','8765','--bind','127.0.0.1'],{cwd:ROOT,stdio:['ignore','pipe','pipe']});
  const browser=spawn(browserExe,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist','--use-angle=swiftshader','--enable-unsafe-swiftshader','--remote-debugging-address=127.0.0.1','--remote-debugging-port=9223','--user-data-dir=/tmp/kfb-librarian-v12-chrome','--window-size=1700,1250','about:blank'],{stdio:['ignore','pipe','pipe']});
  let browserStderr='';browser.stderr.on('data',c=>browserStderr+=c.toString());const result={schema:'kfb.asset-librarian-v1.2-acceptance.v1',tasks:{},auxiliary:{},consoleErrors:[],runtimeExceptions:[],result:'FAIL'};
  try{
    await waitHttp(`${BASE_URL}index.html`);const vr=await waitHttp('http://127.0.0.1:9223/json/version'),browserVersion=await vr.json();result.browser=browserVersion.Browser;
    const cr=await fetch(`http://127.0.0.1:9223/json/new?${encodeURIComponent(BASE_URL)}`,{method:'PUT'});assert(cr.ok,'create CDP target');const target=await cr.json(),cdp=await connectCDP(target.webSocketDebuggerUrl);await cdp.send('Page.enable');await cdp.send('Runtime.enable');await cdp.send('Network.enable');
    await waitFor(cdp,`document.getElementById('registryStatus')?.textContent === 'Registry ready'`,'registry ready');await cdp.evaluate(`localStorage.removeItem('kfb.asset-librarian.v1.2.selection');true`);await cdp.send('Page.reload');await waitFor(cdp,`document.getElementById('registryStatus')?.textContent === 'Registry ready'`,'registry ready after clean reload');result.registrySourceCommit=await cdp.evaluate(`document.getElementById('sourceCommit').textContent`);
    await cdp.evaluate(`document.getElementById('galleryViewButton').click();true`);assert(await cdp.evaluate(`document.getElementById('resultList').classList.contains('gallery-view')`),'gallery view not active');await cdp.evaluate(`document.getElementById('listViewButton').click();true`);await setFilters(cdp,{problem:'any'});const reviewCount=await cdp.evaluate(`document.querySelectorAll('.result-card').length`);assert(reviewCount>0,'review queue empty');result.auxiliary.reviewQueueVisible=reviewCount;
    await runTasksA(cdp,result);await runTasksB(cdp,result);result.consoleErrors=cdp.consoleErrors;result.runtimeExceptions=cdp.exceptions;assert(cdp.consoleErrors.length===0,`console errors: ${cdp.consoleErrors.join(' | ')}`);assert(cdp.exceptions.length===0,`runtime exceptions: ${cdp.exceptions.join(' | ')}`);result.result='PASS';writeFileSync(path.join(ARTIFACT_DIR,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));cdp.ws.close();
  }catch(e){result.failure=String(e.stack||e);result.browserStderr=browserStderr;writeFileSync(path.join(ARTIFACT_DIR,'result.json'),JSON.stringify(result,null,2)+'\n');writeFileSync(path.join(ARTIFACT_DIR,'failure.txt'),`${e.stack||e}\n\n${browserStderr}`);throw e;}finally{browser.kill('SIGTERM');server.kill('SIGTERM');}
}
run().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
