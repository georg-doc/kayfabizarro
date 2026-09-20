import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=(process.env.KCC_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/toolbox/kaykit-character-compat-v0/').replace(/\/?$/,'/');
const PUBLIC=process.env.KCC_PUBLIC==='1';
const EXPECTED_HEAD=process.env.KCC_SOURCE_HEAD||'0fd958f6c35c1b6d74abac2dfc37340eaec6c0c5';
const OUT=process.env.KCC_PROOF_DIR||'kcc-v0-evidence';

const REAL=[
  {id:'goth-girl',path:'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb'},
  {id:'frizzlebob-driver-host',path:'media/3D_Assets/KayKit_Mystery_Series6/2 - August 2023 - Driver/character/gltf/Driver.glb'},
  {id:'bath',path:'media/3D_Assets/Bubbly_Bathroom_Tiny_Treats_1-1/Assets/gltf/bath.gltf'},
  {id:'rover-round',path:'media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Vehicles/GLTF/Rover_Round.gltf'},
  {id:'paper-plane',path:'media/3D_Assets/KFB/Paper Plane by Anonymous - 5X4zRUBadun.glb'},
  {id:'pencil-a-long',path:'media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/pencil_A_long.gltf'}
];

const checks=[];
const check=(name,cond,extra='')=>{
  checks.push({name,pass:!!cond,extra});
  if(!cond) throw Error('FAIL '+name+' '+extra);
  console.log('PASS',name,extra);
};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function waitMarker(){
  if(!PUBLIC) return;
  let last=null;
  for(let i=0;i<180;i++){
    try{
      const r=await fetch(BASE+'SOURCE.json?proof='+Date.now(),{cache:'no-store'});
      const text=await r.text();
      let j=null;try{j=JSON.parse(text)}catch{}
      last={status:r.status,head:j?.sourceRuntimeHead||null,preview:text.slice(0,100)};
      if(r.ok && j?.sourceRuntimeHead===EXPECTED_HEAD){
        console.log('DEPLOYED',BASE,EXPECTED_HEAD);
        return;
      }
    }catch(e){last={error:String(e)}}
    await sleep(3000);
  }
  throw Error('Stage marker timeout '+JSON.stringify(last));
}

await waitMarker();
await fs.mkdir(OUT,{recursive:true});

let browser;
try{
  browser=await chromium.launch({
    headless:true,
    args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']
  });
  const page=await browser.newPage({viewport:{width:1440,height:920},deviceScaleFactor:1});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push('pageerror '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  check('HTTP',response?.ok()===true,'status='+response?.status());

  await page.waitForFunction(
    ()=>document.querySelectorAll('#sourceList .source').length===7,
    null,{timeout:60000}
  );
  check('seven source rows',(await page.locator('#sourceList .source').count())===7);
  check('WebGL canvas',await page.locator('#stage canvas').count()===1);

  const matrix=await page.evaluate(async()=>{
    const r=await fetch('./SOURCE_MATRIX.json',{cache:'no-store'});
    return {ok:r.ok,status:r.status,json:r.ok?await r.json():null};
  });
  check('matrix HTTP',matrix.ok===true,'status='+matrix.status);
  check('matrix no-placeholder',matrix.json?.noPlaceholderPolicy===true);
  check('matrix source count',matrix.json?.sources?.length===7,String(matrix.json?.sources?.length));

  const evidence={base:BASE,public:PUBLIC,sourceRuntimeHead:EXPECTED_HEAD,rows:{}};

  for(const spec of REAL){
    await page.locator('#sourceList .source[data-id="'+spec.id+'"]').click();
    await page.waitForFunction(
      ({id,path})=>{
        const b=document.querySelector('#sourceList .source[data-id="'+id+'"]');
        const selected=b?.getAttribute('aria-pressed')==='true';
        const asset=document.getElementById('assetPath')?.textContent||'';
        const meshes=document.getElementById('meshCount')?.textContent||'—';
        const overlay=document.getElementById('loadstate');
        return selected && asset===path && meshes!=='—' && !overlay?.classList.contains('show');
      },
      spec,{timeout:120000}
    );
    const snap=await page.evaluate(({id})=>({
      selected:document.querySelector('#sourceList .source[data-id="'+id+'"]')?.getAttribute('aria-pressed'),
      path:document.getElementById('assetPath')?.textContent||'',
      meshes:Number(document.getElementById('meshCount')?.textContent),
      skinned:Number(document.getElementById('skinCount')?.textContent),
      bones:Number(document.getElementById('boneCount')?.textContent),
      overlay:document.getElementById('loadstate')?.classList.contains('show')
    }),spec);
    check(spec.id+' selected',snap.selected==='true',String(snap.selected));
    check(spec.id+' exact source path',snap.path===spec.path,snap.path);
    check(spec.id+' real mesh',Number.isFinite(snap.meshes)&&snap.meshes>0,String(snap.meshes));
    check(spec.id+' no fallback/error overlay',snap.overlay===false,String(snap.overlay));
    evidence.rows[spec.id]=snap;
    await page.screenshot({path:OUT+'/'+spec.id+'.png',fullPage:true});
  }

  await page.locator('#sourceList .source[data-id="rubber-eraser"]').click();
  await page.waitForFunction(()=>{
    const b=document.querySelector('#sourceList .source[data-id="rubber-eraser"]');
    const title=document.querySelector('#loadstate strong')?.textContent||'';
    return b?.getAttribute('aria-pressed')==='true' &&
      document.getElementById('loadstate')?.classList.contains('show') &&
      title==='SOURCE REQUIRED';
  },null,{timeout:30000});

  const rubber=await page.evaluate(()=>({
    selected:document.querySelector('#sourceList .source[data-id="rubber-eraser"]')?.getAttribute('aria-pressed'),
    title:document.querySelector('#loadstate strong')?.textContent||'',
    body:document.querySelector('#loadstate span')?.textContent||'',
    path:document.getElementById('assetPath')?.textContent||'',
    meshes:document.getElementById('meshCount')?.textContent||''
  }));
  check('rubber selected',rubber.selected==='true',String(rubber.selected));
  check('rubber SOURCE REQUIRED',rubber.title==='SOURCE REQUIRED',rubber.title);
  check('rubber has no source path',rubber.path==='NO VERIFIED 3D SOURCE',rubber.path);
  check('rubber renders no donor mesh',rubber.meshes==='—',rubber.meshes);
  check('rubber message rejects substitute',/refuses placeholder or substitute geometry/i.test(rubber.body),rubber.body);
  evidence.rows['rubber-eraser']=rubber;
  await page.screenshot({path:OUT+'/rubber-source-required.png',fullPage:true});

  check('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));

  evidence.checks=checks;
  evidence.failed=failed;
  evidence.errors=errors;
  await fs.writeFile(OUT+'/browser.json',JSON.stringify(evidence,null,2));
  console.log('KCC_V0_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
}finally{
  if(browser) await browser.close();
}
