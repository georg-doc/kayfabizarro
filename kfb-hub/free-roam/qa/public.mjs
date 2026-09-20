// Repeatable public-host proof for the current immutable Free Roam release.
import fs from 'node:fs';import {createHash} from 'node:crypto';import {chromium} from 'playwright';
const origin='https://kayfabizarro.pages.dev',home='/kfb-hub/free-roam/',dir='kfb-hub/free-roam/';
const catalog=JSON.parse(fs.readFileSync(dir+'releases.json','utf8')),release=catalog.releases.find(r=>r.id===catalog.current);
if(!release?.published)throw Error('No published current release');
const url=new URL(release.path,origin+home).href,local=dir+'versions/'+release.id+'/';
const manifest=JSON.parse(fs.readFileSync(local+'PROVENANCE.json','utf8')),mirror=JSON.parse(fs.readFileSync(local+'MIRROR.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const report={url,home:origin+home,release:release.id,sourceCommit:manifest.sourceCommit,checks:[],errors:[],snapshots:{},humanAcceptance:'PENDING',physicalDeviceTest:'NOT_PERFORMED'};
const out='free-roam-public-evidence';fs.mkdirSync(out,{recursive:true});
const check=(name,pass,details)=>{report.checks.push({name,pass:!!pass,details});if(!pass)throw Error(name)};
let browser,page;
try{
 let live=false;for(let attempt=0;attempt<30;attempt++){
  try{const r=await fetch(url+'PROVENANCE.json?ci='+Date.now(),{signal:AbortSignal.timeout(15000),cache:'no-store'});if(r.ok&&(await r.json()).sourceCommit===manifest.sourceCommit){live=true;break;}}catch{}
  await new Promise(r=>setTimeout(r,10000));
 }
 check('actual KFB version is deployed',live,{url,sourceCommit:manifest.sourceCommit});
 for(const [file,sourceHash] of Object.entries(manifest.files)){
  const bytes=fs.readFileSync(local+file),delta=(mirror.packagingDeltas||[]).find(d=>d.file===file);
  check('source identity: '+file,delta?hash(bytes)===delta.sha256&&hash(Buffer.concat([bytes,Buffer.from('\n')]))===sourceHash:hash(bytes)===sourceHash);
  const r=await fetch(url+file+'?ci='+Date.now(),{signal:AbortSignal.timeout(15000),cache:'no-store'});
  check('public bytes: '+file,r.ok&&hash(Buffer.from(await r.arrayBuffer()))===hash(bytes));
 }
 browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const context=await browser.newContext({viewport:{width:1280,height:800}});page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))report.errors.push(m.text())});
 await page.goto(origin+home,{waitUntil:'networkidle',timeout:60000});await page.waitForSelector('#current-link a');
 check('permanent navigator points to current release',await page.locator('#current-link a').getAttribute('href')===release.path,release.path);
 for(const p of ['/travel/wip/travel_globe_wsa/world-builder/','/kfb-hub/stunt-race/track-environment-lab/','/resident-atlas-s6/','/world-atlas/'])check('comparison link: '+p,await page.locator('a[href^="'+p+'"]').count()>0);
 await page.screenshot({path:out+'/navigator.png',fullPage:true});
 await page.locator('#current-link a').click();await page.waitForFunction(()=>window.__FREE_ROAM_READY__||window.__FREE_ROAM_ERROR__,{},{timeout:120000});
 check('public WebGL boot',await page.evaluate(()=>!!window.__FREE_ROAM_READY__),await page.evaluate(()=>window.__FREE_ROAM_ERROR__));
 const snap=()=>page.evaluate(()=>window.__FREE_ROAM__.snapshot());
 const waitTicks=async(n,timeout=60000)=>{const start=(await snap()).physical.tick;await page.waitForFunction(({start,n})=>window.__FREE_ROAM__.snapshot().physical.tick>=start+n,{start,n},{timeout});};
 const quatChanged=(a,b)=>Math.abs(a.x*b.x+a.y*b.y+a.z*b.z+a.w*b.w)<.9998;
 report.snapshots.boot=await snap();
 check('S04-02 identity',report.snapshots.boot.id==='fr-s04-02',report.snapshots.boot.id);
 check('wide baked Travel contact',report.snapshots.boot.terrain.contactTriangles===652&&report.snapshots.boot.terrain.dryAreaSamples===113,report.snapshots.boot.terrain);
 check('wide open region has no circular fence',report.snapshots.boot.terrain.localRadius===48&&report.snapshots.boot.terrain.recoveryRadius===56&&report.snapshots.boot.terrain.boundaryColliders===0,report.snapshots.boot.terrain);
 check('start is gated',report.snapshots.boot.paused);await page.locator('#start').click();
 await page.waitForFunction(()=>window.__FREE_ROAM__.snapshot().physical.contacts.filter(Boolean).length===4,{},{timeout:20000});
 check('all four suspension rays contact actual terrain',(await snap()).physical.contacts.every(Boolean));await page.screenshot({path:out+'/drive.png'});
 await page.locator('#view').focus();await page.keyboard.down('w');await page.waitForFunction(()=>window.__FREE_ROAM__.snapshot().signedForwardSpeed>3,{},{timeout:15000});
 const d0=await snap();await page.keyboard.down('d');await waitTicks(30);const d1=await snap();await page.keyboard.up('d');await page.keyboard.up('w');
 check('D reaches corrected semantic steer',d1.input.includes('KeyD')&&d1.driveInput.steer<-.9,{input:d1.input,driveInput:d1.driveInput});
 check('D reaches corrected physical steer',d1.physical.steer<-.02,d1.physical.steer);
 check('D actually turns chassis',quatChanged(d0.physical.rotation,d1.physical.rotation),{before:d0.physical.rotation,after:d1.physical.rotation});
 await page.keyboard.down('b');await page.waitForFunction(()=>Math.abs(window.__FREE_ROAM__.snapshot().signedForwardSpeed)<.5,{},{timeout:30000});await page.keyboard.up('b');await page.keyboard.press('r');await waitTicks(6);
 await page.keyboard.down('w');await page.waitForFunction(()=>window.__FREE_ROAM__.snapshot().signedForwardSpeed>3,{},{timeout:15000});
 const a0=await snap();await page.keyboard.down('a');await waitTicks(30);const a1=await snap();await page.keyboard.up('a');await page.keyboard.up('w');
 check('A reaches opposite semantic steer',a1.input.includes('KeyA')&&a1.driveInput.steer>.9,{input:a1.input,driveInput:a1.driveInput});
 check('A reaches opposite physical steer',a1.physical.steer>.02,a1.physical.steer);
 check('A actually turns chassis',quatChanged(a0.physical.rotation,a1.physical.rotation),{before:a0.physical.rotation,after:a1.physical.rotation});
 await page.keyboard.down('b');await page.waitForFunction(()=>Math.abs(window.__FREE_ROAM__.snapshot().signedForwardSpeed)<.5,{},{timeout:30000});await page.keyboard.up('b');await page.keyboard.press('r');await waitTicks(6);
 await page.keyboard.down('s');await page.waitForFunction(()=>window.__FREE_ROAM__.snapshot().signedForwardSpeed<-.6,{},{timeout:15000});
 const reverseSamples=[];for(let i=0;i<10;i++){await waitTicks(3);const q=await snap();reverseSamples.push({speed:q.signedForwardSpeed,phase:q.phase,tick:q.physical.tick});}
 check('reverse remains negative without sign chatter',reverseSamples.every(x=>x.speed<.16),reverseSamples);
 check('reverse stays out of neutral chatter after engagement',reverseSamples.every(x=>!['NEUTRAL_DWELL','BRAKE_TO_REVERSE'].includes(x.phase)),reverseSamples);
 const r0=await snap();await page.keyboard.down('d');await waitTicks(30);const r1=await snap();await page.keyboard.up('d');await page.keyboard.up('s');
 check('D gets arcade reverse steering assist',r1.physical.steer>.02,r1.physical.steer);
 check('reverse steering changes chassis orientation',quatChanged(r0.physical.rotation,r1.physical.rotation),{before:r0.physical.rotation,after:r1.physical.rotation});
 check('reverse speed stays bounded',Math.abs(r1.signedForwardSpeed)<4.2,r1.signedForwardSpeed);check('reverse never boosts',r1.phase!=='BOOST',r1.phase);
 await page.locator('#camera').click();const c0=(await snap()).camera.azimuth;await page.mouse.move(600,400);await page.mouse.down({button:'left'});await page.mouse.move(760,400,{steps:8});await page.mouse.up({button:'left'});await page.waitForTimeout(150);
 const c1=(await snap()).camera.azimuth;check('orbit drag-right follows Ground yaw convention',c1>c0+.02,{before:c0,after:c1});await page.locator('#camera').click();
 await page.keyboard.press('r');await waitTicks(6);await page.keyboard.down('w');await page.keyboard.down('Shift');await page.waitForFunction(()=>window.__FREE_ROAM__.snapshot().signedForwardSpeed>10,{},{timeout:30000});await waitTicks(24);
 const boosted=await snap();await page.keyboard.up('Shift');await page.keyboard.up('w');
 check('boost reaches high-speed test range',boosted.signedForwardSpeed>10,boosted.signedForwardSpeed);
 check('boost run stays inside open recovery envelope',Math.hypot(boosted.physical.position.x,boosted.physical.position.z)<boosted.terrain.recoveryRadius,{position:boosted.physical.position,radius:boosted.terrain.recoveryRadius});
 await page.keyboard.press('r');await waitTicks(6);const curveRun=(await snap()).physical.run;await page.keyboard.down('w');await page.keyboard.down('d');await waitTicks(180,90000);const curved=await snap();await page.keyboard.up('d');await page.keyboard.up('w');
 check('continuous curve avoids stuck/outside recovery',curved.physical.run===curveRun&&!curved.physical.events.some(e=>e.type==='recovery'&&['stuck','outside'].includes(e.reason)),{runBefore:curveRun,runAfter:curved.physical.run,events:curved.physical.events});
 check('continuous curve remains dynamically moving',Math.abs(curved.signedForwardSpeed)>1.2,{speed:curved.signedForwardSpeed,position:curved.physical.position});
 await page.locator('#pause').click();const before=await snap();await page.waitForTimeout(300);check('pause freezes simulation',(await snap()).physical.tick===before.physical.tick);check('pause clears held input',(await snap()).input.length===0);
 await page.locator('#reset').click();check('reset stays in wide local region',Math.hypot((await snap()).physical.position.x,(await snap()).physical.position.z)<42);
 await page.locator('#profile').selectOption('donor');check('comparison change stays paused',(await snap()).paused);await page.locator('#pause').click();await page.locator('#view').focus();await page.keyboard.down('w');await page.waitForFunction(()=>window.__FREE_ROAM__.snapshot().signedForwardSpeed>1,{},{timeout:15000});await page.keyboard.up('w');check('raw Slice-04 input comparison',(await snap()).profile==='donor');
 await page.locator('#pause').click();await page.locator('#profile').selectOption('candidate');await page.locator('#reset').click();await page.locator('#pause').click();await page.locator('#view').focus();await page.waitForFunction(()=>window.__FREE_ROAM__.snapshot().physical.contacts.filter(Boolean).length>=2,{},{timeout:10000});
 const hops=(await snap()).physical.events.filter(e=>e.type==='hop').length;await page.keyboard.down('Space');await page.waitForTimeout(450);await page.keyboard.up('Space');check('contact-driven hop once',(await snap()).physical.events.filter(e=>e.type==='hop').length===hops+1);
 await page.waitForFunction(()=>window.__FREE_ROAM__.snapshot().physical.contacts.filter(Boolean).length>=2,{},{timeout:10000});
 await page.keyboard.down('w');await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.keyboard.up('w');check('blur clears held throttle',(await snap()).paused&&(await snap()).input.length===0);
 report.snapshots.final=await snap();check('bounded local up error',report.snapshots.final.maxUpErrorDegrees<=report.snapshots.final.terrain.upBudgetDegrees,report.snapshots.final.maxUpErrorDegrees);await page.screenshot({path:out+'/final.png'});
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(150);check('narrow viewport fits',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:out+'/narrow.png'});
 await page.locator('header a').click();await page.waitForSelector('#current-link a');check('app returns to permanent navigator',page.url()===origin+home);
 check('no script errors',report.errors.length===0,report.errors);report.status='PASS';
}catch(e){report.status='FAIL';report.failure=String(e.stack||e);if(page)await page.screenshot({path:out+'/FAIL.png'}).catch(()=>{});process.exitCode=1;}
finally{await browser?.close();fs.writeFileSync(out+'/public.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,checks:report.checks.length,failure:report.failure}));}
