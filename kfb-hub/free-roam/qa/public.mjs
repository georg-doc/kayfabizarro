// Repeatable public-host proof. Does not deploy, modify source, award human acceptance or use a substitute host.
import fs from 'node:fs';import {createHash} from 'node:crypto';import {chromium} from 'playwright';
const origin='https://kayfabizarro.pages.dev',home='/kfb-hub/free-roam/',dir='kfb-hub/free-roam/';
const catalog=JSON.parse(fs.readFileSync(dir+'releases.json','utf8')),release=catalog.releases.find(r=>r.id===catalog.current);
if(!release?.published)throw Error('No published current release');
const url=new URL(release.path,origin+home).href,local=dir+'versions/'+release.id+'/';
const manifest=JSON.parse(fs.readFileSync(local+'PROVENANCE.json','utf8')),mirror=JSON.parse(fs.readFileSync(local+'MIRROR.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex'),report={url,home:origin+home,sourceCommit:manifest.sourceCommit,checks:[],errors:[],snapshots:{},humanAcceptance:'PENDING',physicalDeviceTest:'NOT_PERFORMED'};
const out='free-roam-public-evidence';fs.mkdirSync(out,{recursive:true});
const check=(name,pass,details)=>{report.checks.push({name,pass:!!pass,details});if(!pass)throw Error(name)};
let browser,page;
try{
 let live=false;for(let attempt=0;attempt<24;attempt++){
  try{const r=await fetch(url+'PROVENANCE.json',{signal:AbortSignal.timeout(15000),cache:'no-store'});if(r.ok&&(await r.json()).sourceCommit===manifest.sourceCommit){live=true;break;}}catch{}
  await new Promise(r=>setTimeout(r,10000));
 }
 check('actual KFB version is deployed',live);
 for(const [file,sourceHash] of Object.entries(manifest.files)){
  const bytes=fs.readFileSync(local+file),delta=mirror.packagingDeltas.find(d=>d.file===file);
  check('source identity: '+file,delta?hash(bytes)===delta.sha256&&hash(Buffer.concat([bytes,Buffer.from('\n')]))===sourceHash:hash(bytes)===sourceHash);
  const r=await fetch(url+file,{signal:AbortSignal.timeout(15000)});check('public bytes: '+file,r.ok&&hash(Buffer.from(await r.arrayBuffer()))===hash(bytes));
 }
 browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const context=await browser.newContext({viewport:{width:1280,height:800}});page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))report.errors.push(m.text())});
 await page.goto(origin+home,{waitUntil:'networkidle',timeout:60000});await page.waitForSelector('#current-link a');
 check('permanent navigator points to current release',await page.locator('#current-link a').getAttribute('href')===release.path);
 await page.screenshot({path:out+'/navigator.png',fullPage:true});
 const comparisonPaths=['/travel/wip/travel_globe_wsa/world-builder/','/kfb-hub/stunt-race/track-environment-lab/','/resident-atlas-s6/','/world-atlas/'];
 for(const p of comparisonPaths)check('comparison link: '+p,await page.locator('a[href^="'+p+'"]').count()>0);
 await page.locator('#current-link a').click();await page.waitForFunction(()=>window.__FREE_ROAM_READY__||window.__FREE_ROAM_ERROR__,{},{timeout:120000});
 check('public WebGL boot',await page.evaluate(()=>!!window.__FREE_ROAM_READY__),await page.evaluate(()=>window.__FREE_ROAM_ERROR__));
 const snap=()=>page.evaluate(()=>window.__FREE_ROAM__.snapshot());report.snapshots.boot=await snap();
 check('81 dry support samples',report.snapshots.boot.terrain.dryAreaSamples===81,report.snapshots.boot.terrain);
 check('start is gated',report.snapshots.boot.paused);await page.locator('#start').click();
 await page.waitForFunction(()=>window.__FREE_ROAM__.snapshot().physical.contacts.every(Boolean),{},{timeout:20000});check('all four suspension rays contact actual terrain',(await snap()).physical.contacts.every(Boolean));
 await page.screenshot({path:out+'/drive.png'});
 await page.keyboard.down('w');await page.waitForFunction(()=>window.__FREE_ROAM__.snapshot().signedForwardSpeed>3,{},{timeout:15000});await page.keyboard.up('w');check('forward driving',(await snap()).signedForwardSpeed>3);
 await page.keyboard.down('s');await page.waitForFunction(()=>window.__FREE_ROAM__.snapshot().signedForwardSpeed<-.5,{},{timeout:15000});check('brake and reverse',(await snap()).signedForwardSpeed<-.5);
 await page.keyboard.down('Shift');await page.waitForTimeout(700);report.snapshots.reverse=await snap();check('reverse speed bound',Math.abs(report.snapshots.reverse.signedForwardSpeed)<3.1);check('no reverse boost',report.snapshots.reverse.phase!=='BOOST');await page.keyboard.up('Shift');
 const q0=(await snap()).physical.rotation;await page.keyboard.down('d');await page.waitForTimeout(700);await page.keyboard.up('d');await page.keyboard.up('s');const q1=(await snap()).physical.rotation;check('reverse steering changes physical yaw',Math.abs(q1.y-q0.y)>.002);
 await page.keyboard.down('b');await page.waitForTimeout(900);await page.keyboard.up('b');await page.locator('#pause').click();const before=await snap();await page.waitForTimeout(300);check('pause freezes simulation',(await snap()).physical.tick===before.physical.tick);check('pause clears held input',(await snap()).input.length===0);
 await page.locator('#reset').click();check('reset stays in local region',Math.hypot((await snap()).physical.position.x,(await snap()).physical.position.z)<14);
 await page.locator('#profile').selectOption('donor');check('comparison change stays paused',(await snap()).paused);await page.locator('#pause').click();await page.locator('#view').focus();await page.keyboard.down('w');await page.waitForFunction(()=>window.__FREE_ROAM__.snapshot().signedForwardSpeed>1,{},{timeout:15000});await page.keyboard.up('w');check('raw Slice-04 input comparison',(await snap()).profile==='donor');
 await page.locator('#pause').click();await page.locator('#profile').selectOption('candidate');await page.locator('#reset').click();await page.locator('#pause').click();await page.locator('#view').focus();await page.waitForFunction(()=>window.__FREE_ROAM__.snapshot().physical.contacts.filter(Boolean).length>=2,{},{timeout:10000});
 const hops=(await snap()).physical.events.filter(e=>e.type==='hop').length;await page.keyboard.down('Space');await page.waitForTimeout(450);await page.keyboard.up('Space');check('contact-driven hop once',(await snap()).physical.events.filter(e=>e.type==='hop').length===hops+1);await page.waitForFunction(()=>window.__FREE_ROAM__.snapshot().physical.contacts.filter(Boolean).length>=2,{},{timeout:10000});
 await page.keyboard.down('w');await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.keyboard.up('w');check('blur clears held throttle',(await snap()).paused&&(await snap()).input.length===0);
 report.snapshots.final=await snap();check('bounded local up error',report.snapshots.final.maxUpErrorDegrees<=3);await page.screenshot({path:out+'/final.png'});
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(150);check('narrow viewport fits',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:out+'/narrow.png'});
 await page.locator('header a').click();await page.waitForSelector('#current-link a');check('app returns to permanent navigator',page.url()===origin+home);check('no script errors',report.errors.length===0,report.errors);report.status='PASS';
}catch(e){report.status='FAIL';report.failure=String(e.stack||e);if(page)await page.screenshot({path:out+'/FAIL.png'}).catch(()=>{});process.exitCode=1;}
finally{await browser?.close();fs.writeFileSync(out+'/public.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));}
