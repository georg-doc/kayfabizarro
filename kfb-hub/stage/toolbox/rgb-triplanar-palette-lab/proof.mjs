import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const BASE=process.env.RGBTRI_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/toolbox/rgb-triplanar-palette-lab/';
const PUBLIC=process.env.RGBTRI_PUBLIC==='1';
const EXPECTED_HEAD=process.env.RGBTRI_SOURCE_HEAD||'';
const OUT=process.env.RGBTRI_PROOF_DIR||'rgb-triplanar-evidence';
const ASSETS=['armchair','pencil','gothgirl'];
const checks=[];const check=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)};
async function waitMarker(){if(!PUBLIC)return;let last=null;for(let i=0;i<180;i++){try{const r=await fetch(BASE+'SOURCE.json?proof='+Date.now(),{cache:'no-store'});const text=await r.text();let j=null;try{j=JSON.parse(text)}catch{}last={status:r.status,head:j?.sourceBranchHead||null,preview:text.slice(0,100)};if(r.ok&&j?.sourceBranchHead===EXPECTED_HEAD){console.log('DEPLOYED',BASE,EXPECTED_HEAD);return}}catch(e){last={error:String(e)}}await new Promise(r=>setTimeout(r,3000))}throw Error('Stage marker timeout '+JSON.stringify(last))}
await waitMarker();await fs.mkdir(OUT,{recursive:true});let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});const errors=[],failed=[];
  page.on('pageerror',e=>errors.push('pageerror '+String(e)));page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));
  const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});check('HTTP',response?.ok()===true,'status='+response?.status());
  await page.waitForFunction(()=>window.__KFB_RGB_TRIPLANAR__?.ready===true||!!window.__KFB_RGB_TRIPLANAR__?.error,null,{timeout:120000});
  const evidence={base:BASE,public:PUBLIC,sourceHead:EXPECTED_HEAD,assets:{}};let sharedUuid=null;
  for(const id of ASSETS){
    if(id!=='armchair'){await page.evaluate(async id=>window.__KFB_RGB_TRIPLANAR__.selectAsset(id),id);await page.waitForFunction(id=>window.__KFB_RGB_TRIPLANAR__?.ready===true&&window.__KFB_RGB_TRIPLANAR__.snapshot().asset===id,id,{timeout:120000})}
    await page.waitForTimeout(300);const s=await page.evaluate(()=>window.__KFB_RGB_TRIPLANAR__.snapshot());
    check(id+' ready',s.ready===true,JSON.stringify(s.error));check(id+' exact source path',typeof s.path==='string'&&s.path.startsWith('media/3D_Assets/'),s.path);check(id+' source visible',s.sourceVisible===true);check(id+' processed visible',s.processedVisible===true);
    check(id+' source meshes',s.source?.meshes>0,JSON.stringify(s.source));check(id+' mesh parity',s.processed?.meshes===s.source?.meshes,JSON.stringify({source:s.source?.meshes,processed:s.processed?.meshes}));check(id+' shader compiled',s.processed?.compiled===s.processed?.materials,JSON.stringify(s.processed));
    check(id+' one processed texture uuid',s.uniqueProcessedTextureUuids.length===1,JSON.stringify(s.uniqueProcessedTextureUuids));
    if(sharedUuid===null)sharedUuid=s.sharedTextureUuid;check(id+' same RGB texture',s.sharedTextureUuid===sharedUuid,s.sharedTextureUuid);
    check(id+' RGB canvas',s.canvas?.width===256&&s.canvas?.height===256,JSON.stringify(s.canvas));check(id+' consumer owner unchanged',s.ownership?.consumerRuntime==='unchanged',JSON.stringify(s.ownership));
    const pixels=await page.evaluate(()=>{const c=document.getElementById('rgbMaskCanvas'),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let r=0,g=0,b=0;for(let i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2]}return{r,g,b}});
    check(id+' RGB mask channels populated',pixels.r>0&&pixels.g>0&&pixels.b>0,JSON.stringify(pixels));
    await page.screenshot({path:OUT+'/'+id+'.png',fullPage:true});evidence.assets[id]={snapshot:s,pixels};
  }
  await page.setViewportSize({width:832,height:780});await page.waitForTimeout(250);const responsive=await page.evaluate(()=>({canvas:!!document.querySelector('#stage canvas'),controls:document.querySelector('.controls')?.getBoundingClientRect().width||0,viewport:innerWidth}));check('832px canvas visible',responsive.canvas===true);check('832px controls fit',responsive.controls<=responsive.viewport,JSON.stringify(responsive));await page.screenshot({path:OUT+'/split-832.png',fullPage:true});
  check('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));check('no page/console errors',errors.length===0,JSON.stringify(errors));
  evidence.checks=checks;evidence.failed=failed;evidence.errors=errors;await fs.writeFile(OUT+'/browser.json',JSON.stringify(evidence,null,2));console.log('RGB_TRIPLANAR_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
}finally{if(browser)await browser.close()}
