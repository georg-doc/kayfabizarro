import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=(process.env.TGP0_BASE_URL || 'http://127.0.0.1:4173/kfb-hub/stage/osm-city-three-geo-p0/').replace(/\/?$/,'/');
const OUT=process.env.TGP0_PROOF_DIR || 'three-geo-p0-proof';
const checks=[];
const errors=[];
const pass=(name,condition,extra='')=>{
  const row={name,pass:!!condition,extra};
  checks.push(row);
  console.log((row.pass?'PASS ':'FAIL ')+name+(extra?' :: '+extra:''));
  if(!row.pass) throw new Error('FAIL '+name+(extra?' :: '+extra:''));
};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

await fs.mkdir(OUT,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
let finalSnapshot=null;
try{
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push('pageerror: '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text())});

  const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  pass('stage http',response && response.ok(),String(response && response.status()));
  await page.waitForFunction(()=>window.__KFB_THREE_GEO_P0__,{timeout:30000});

  let source=null;
  for(let i=0;i<90;i++){
    source=await page.evaluate(()=>window.__KFB_THREE_GEO_P0__.snapshot());
    if(source.fatal) throw new Error(source.fatal);
    if(source.ready && source.tiles.ready>0 && source.tiles.loading===0 && source.tiles.rebuilding===0 && source.source) break;
    await sleep(1000);
  }
  pass('build marker',source.build==='KFB-THREE-GEO-P0-20261001',source.build);
  pass('donor pin',source.donor.version==='2.2.0' && source.donor.commit==='78a6b822261929a54f731dd08a972cf7b0a11500',JSON.stringify(source.donor));
  pass('three r160',source.three==='0.160.0',source.three);
  pass('source tiles ready',source.ready && source.tiles.ready>0,JSON.stringify(source.tiles));
  pass('source failures zero',source.tiles.failed===0 && source.events.sourceError===0,JSON.stringify({tiles:source.tiles,events:source.events}));
  pass('render produced geometry',source.renderer.calls>0 && source.renderer.triangles>0,JSON.stringify(source.renderer));
  await page.screenshot({path:OUT+'/source.png',fullPage:true});

  const query=await page.evaluate(()=>window.__KFB_THREE_GEO_P0__.originQuery());
  const coordOk=query && Math.abs(query.lat-50.949425)<0.00001 && Math.abs(query.lon-6.9175)<0.00001 && Math.abs(query.roundtrip.x)<0.01 && Math.abs(query.roundtrip.z)<0.01;
  pass('coordinate roundtrip',coordOk,JSON.stringify(query));

  const seamRaw=await page.evaluate(()=>window.__KFB_THREE_GEO_P0__.projectLatLon(50.95210,6.92220));
  const R=6378137;
  const lat0=50.949425,lon0=6.9175;
  const seamCity={
    x:R*((6.92220-lon0)*Math.PI/180)*Math.cos(lat0*Math.PI/180),
    z:R*((50.95210-lat0)*Math.PI/180)
  };
  const seamMapped={x:seamRaw.x,z:-seamRaw.z};
  pass('seam axis requires z flip',seamRaw.z<0 && seamCity.z>0,JSON.stringify({raw:seamRaw,city:seamCity}));
  pass('seam east alignment under 2cm',Math.abs(seamMapped.x-seamCity.x)<0.02,JSON.stringify({mapped:seamMapped,city:seamCity}));
  pass('seam north alignment under 2cm',Math.abs(seamMapped.z-seamCity.z)<0.02,JSON.stringify({mapped:seamMapped,city:seamCity}));

  await page.evaluate(()=>window.__KFB_THREE_GEO_P0__.setMode('kfb'));
  await sleep(2500);
  const kfb=await page.evaluate(()=>window.__KFB_THREE_GEO_P0__.snapshot());
  pass('kfb material mode',kfb.mode==='kfb' && !kfb.fatal,kfb.mode);
  pass('same streaming owner after restyle',kfb.tiles.ready>0 && kfb.tiles.failed===0,JSON.stringify(kfb.tiles));
  await page.screenshot({path:OUT+'/kfb-material.png',fullPage:true});

  const before=await page.evaluate(()=>window.__KFB_THREE_GEO_P0__.snapshot());
  await page.evaluate(()=>window.__KFB_THREE_GEO_P0__.toggleStream());
  await sleep(16000);
  const moving=await page.evaluate(()=>window.__KFB_THREE_GEO_P0__.snapshot());
  await page.evaluate(()=>window.__KFB_THREE_GEO_P0__.toggleStream());
  pass('stream loaded new tiles',moving.events.load>before.events.load,JSON.stringify({before:before.events,after:moving.events}));
  pass('stream unloaded tiles',moving.events.unload>before.events.unload,JSON.stringify({before:before.events,after:moving.events}));
  pass('stream remains healthy',moving.tiles.ready>0 && moving.tiles.failed===0 && !moving.fatal,JSON.stringify(moving.tiles));
  pass('workers active or explicit fallback',moving.workers.starts>0 || moving.workers.fallbacks>0,JSON.stringify(moving.workers));
  await page.screenshot({path:OUT+'/stream.png',fullPage:true});

  finalSnapshot=await page.evaluate(()=>window.__KFB_THREE_GEO_P0__.snapshot());
  pass('no page or console errors',errors.length===0,errors.join(' | '));
  await fs.writeFile(OUT+'/result.json',JSON.stringify({base:BASE,checks,errors,source,kfb,moving,finalSnapshot},null,2));
}finally{
  await browser.close();
}
console.log('RESULT '+checks.filter(x=>x.pass).length+'/'+checks.length+' PASS');
