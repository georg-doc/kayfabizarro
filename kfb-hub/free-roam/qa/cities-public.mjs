// Public-host proof for OSM City slice navigators and the real shared S1 City Lab consumer.
// Does not award S1 visual acceptance or S2 Walk/Drive acceptance.
import fs from 'node:fs';
import { chromium } from 'playwright';

const origin='https://kayfabizarro.pages.dev';
const root='kfb-hub/free-roam/';
const catalog=JSON.parse(fs.readFileSync(root+'cities.json','utf8'));
const out='osm-city-public-evidence';
fs.mkdirSync(out,{recursive:true});

const report={
  origin,
  updated:catalog.updated,
  status:'RUNNING',
  checks:[],
  cities:[],
  errors:[],
  humanAcceptance:'PENDING',
  driveAcceptance:'NOT_TESTED'
};
const check=(name,pass,details)=>{report.checks.push({name,pass:!!pass,details});if(!pass)throw new Error(name)};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

let browser;
try{
  // Wait for Cloudflare's external deploy of the same main revision.
  let live=false;
  for(let attempt=0;attempt<36;attempt++){
    try{
      const r=await fetch(origin+'/kfb-hub/free-roam/cities.json?ci='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});
      if(r.ok){
        const d=await r.json();
        if(d.updated===catalog.updated && (d.cities||[]).length===catalog.cities.length){live=true;break}
      }
    }catch{}
    await sleep(10000);
  }
  check('city catalog deployed',live,{url:origin+'/kfb-hub/free-roam/cities.json',updated:catalog.updated});

  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const city of catalog.cities){
    const cityReport={id:city.id,entry:new URL(city.entry,origin+'/kfb-hub/free-roam/').href,viewer:new URL(city.viewer.path,origin).href,checks:[]};
    const context=await browser.newContext({viewport:{width:1280,height:820}});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(String(e)));
    page.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))errors.push(m.text())});

    const entry=await fetch(cityReport.entry+'?ci='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});
    check(city.id+' entry HTTP',entry.ok,{status:entry.status,url:cityReport.entry});
    const entryHtml=await entry.text();
    check(city.id+' entry identity',entryHtml.includes(`data-city="${city.id}"`),city.id);

    const provUrl=origin+'/tools/osm-city-lab/data/'+city.id+'/PROVENANCE.json';
    const provResp=await fetch(provUrl+'?ci='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});
    check(city.id+' public provenance',provResp.ok,{status:provResp.status,url:provUrl});
    const prov=await provResp.json();
    check(city.id+' provenance identity',prov.id===city.id,{id:prov.id,sourceSha256:prov.sourceSha256});

    await page.goto(cityReport.entry,{waitUntil:'networkidle',timeout:60000});
    await page.waitForFunction(id=>document.body.dataset.city===id && document.querySelector('#title')?.textContent!=='Loading city…',city.id,{timeout:30000});
    check(city.id+' hub title',await page.locator('#title').textContent()===city.title,await page.locator('#title').textContent());
    check(city.id+' S1 link',await page.locator('#viewer a').getAttribute('href')===city.viewer.path,city.viewer.path);
    check(city.id+' S2 remains gated',await page.locator('#drive a').count()===0 && /not published/i.test(await page.locator('#drive').textContent()),await page.locator('#drive').textContent());
    await page.screenshot({path:out+'/'+city.slug+'-entry.png',fullPage:true});

    await page.locator('#viewer a').click();
    await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.startsWith('S0 cache loaded'),{},{timeout:120000});
    const diag=await page.locator('#diag').textContent();
    check(city.id+' real S1 browser boot',/roads/.test(diag)&&/buildings/.test(diag),diag);
    check(city.id+' expected roads visible in diagnostics',diag.includes(String(city.evidence.roads)+' roads'),diag);
    check(city.id+' expected buildings visible in diagnostics',diag.includes(String(city.evidence.buildings)+' buildings'),diag);
    check(city.id+' no browser errors',errors.length===0,errors);
    await page.screenshot({path:out+'/'+city.slug+'-s1.png'});
    cityReport.diag=diag;
    cityReport.sourceSha256=prov.sourceSha256;
    cityReport.browserErrors=errors;
    report.cities.push(cityReport);
    await context.close();
  }
  report.status='PASS';
}catch(e){
  report.status='FAIL';
  report.failure=String(e.stack||e);
  process.exitCode=1;
}finally{
  await browser?.close();
  fs.writeFileSync(out+'/public.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({status:report.status,checks:report.checks.length,cities:report.cities.length,failure:report.failure}));
}
