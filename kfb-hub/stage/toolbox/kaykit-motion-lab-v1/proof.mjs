import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.KML_BASE_URL||'http://127.0.0.1:4173/tools/KFB-ToolBox/kaykit-motion-lab-v1/';
const PUBLIC=process.env.KML_PUBLIC==='1';
const EXPECTED_HEAD=process.env.KML_SOURCE_HEAD||'';
const OUT=process.env.KML_PROOF_DIR||'toolbox-motion-lab-evidence';
const ACTORS=[
  {id:'frizzlebob',rig:'Rig_Medium',adapter:'graft'},
  {id:'gothgirl',rig:'Rig_Medium',adapter:'direct'},
  {id:'blackknight',rig:'Rig_Large',adapter:'direct'}
];
const checks=[];
const check=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)};

async function waitMarker(){
  if(!PUBLIC)return;
  let last=null;
  for(let i=0;i<180;i++){
    try{
      const r=await fetch(BASE+'SOURCE.json?proof='+Date.now(),{cache:'no-store'});
      const text=await r.text();
      let j=null;try{j=JSON.parse(text)}catch{}
      last={status:r.status,head:j?.sourceBranchHead||null,preview:text.slice(0,80)};
      if(r.ok && j?.sourceBranchHead===EXPECTED_HEAD){
        console.log('DEPLOYED',BASE,EXPECTED_HEAD);
        return;
      }
    }catch(e){last={error:String(e)}}
    await new Promise(r=>setTimeout(r,3000));
  }
  throw Error('Stage marker timeout '+JSON.stringify(last));
}

await waitMarker();
await fs.mkdir(OUT,{recursive:true});
let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:920},deviceScaleFactor:1});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push('pageerror '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  check('HTTP',response?.ok()===true,'status='+response?.status());

  await page.waitForFunction(()=>window.__KFB_TOOLBOX_MOTION_LAB__?.ready===true||!!window.__KFB_TOOLBOX_MOTION_LAB__?.error,null,{timeout:120000});
  const evidence={base:BASE,public:PUBLIC,sourceHead:EXPECTED_HEAD,actors:{}};

  for(const spec of ACTORS){
    if(spec.id!=='frizzlebob'){
      await page.evaluate(async(id)=>{await window.__KFB_TOOLBOX_MOTION_LAB__.selectActor(id)},spec.id);
      await page.waitForFunction(id=>window.__KFB_TOOLBOX_MOTION_LAB__?.ready===true&&window.__KFB_TOOLBOX_MOTION_LAB__.snapshot().actor===id,spec.id,{timeout:120000});
    }
    const snap=await page.evaluate(()=>window.__KFB_TOOLBOX_MOTION_LAB__.snapshot());
    check(spec.id+' ready',snap.ready===true,JSON.stringify(snap.error));
    check(spec.id+' no error',!snap.error,String(snap.error));
    check(spec.id+' identity',snap.actor===spec.id,JSON.stringify({actor:snap.actor,label:snap.label}));
    check(spec.id+' rig',snap.rig===spec.rig,String(snap.rig));
    check(spec.id+' adapter',snap.adapter===spec.adapter,String(snap.adapter));
    check(spec.id+' Idle_A',snap.available.includes('Idle_A'),snap.available.join(','));
    check(spec.id+' Walking_A',snap.available.includes('Walking_A'),snap.available.join(','));
    check(spec.id+' Running_A',snap.available.includes('Running_A'),snap.available.join(','));

    for(const clip of ['Walking_A','Running_A']){
      const p=snap.profiles?.[clip];
      check(spec.id+' '+clip+' measured',!!p,JSON.stringify(p));
      check(spec.id+' '+clip+' duration',Number(p?.duration)>0,String(p?.duration));
      check(spec.id+' '+clip+' left contact',Array.isArray(p?.left?.contacts)&&p.left.contacts.length>0,JSON.stringify(p?.left));
      check(spec.id+' '+clip+' right contact',Array.isArray(p?.right?.contacts)&&p.right.contacts.length>0,JSON.stringify(p?.right));
      check(spec.id+' '+clip+' ref speed',Number.isFinite(p?.referenceSpeedAbs)&&p.referenceSpeedAbs>0,String(p?.referenceSpeedAbs));
      check(spec.id+' '+clip+' slip',Number.isFinite(p?.slipBody),String(p?.slipBody));
    }

    check(spec.id+' consumer movement owner',snap.ownership?.movementPhysics==='consumer',JSON.stringify(snap.ownership));
    check(spec.id+' mixer owner',snap.ownership?.mixer==='one-per-visual-host',JSON.stringify(snap.ownership));
    check(spec.id+' registry read-only',snap.ownership?.registry==='read-only',JSON.stringify(snap.ownership));

    await page.evaluate(()=>window.__KFB_TOOLBOX_MOTION_LAB__.runAB());
    await page.waitForTimeout(850);
    const ui=await page.evaluate(()=>({
      metrics:document.getElementById('metrics')?.textContent||'',
      a:document.getElementById('badgeA')?.textContent||'',
      b:document.getElementById('badgeB')?.textContent||'',
      canvas:!!document.querySelector('#stage canvas'),
      attachment:document.getElementById('attachment')?.textContent||''
    }));
    check(spec.id+' WebGL canvas',ui.canvas===true);
    check(spec.id+' naive label',/NAIVE/.test(ui.a),ui.a);
    check(spec.id+' phase-sync label',/PHASE SYNC/.test(ui.b),ui.b);
    check(spec.id+' A/B transition',/A target/.test(ui.metrics)&&/B target/.test(ui.metrics),ui.metrics);
    check(spec.id+' attachment proposal',ui.attachment.length>12,ui.attachment);
    await page.screenshot({path:OUT+'/'+spec.id+'.png',fullPage:true});
    evidence.actors[spec.id]={...snap,ui};
  }

  check('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));
  evidence.checks=checks;evidence.failed=failed;evidence.errors=errors;
  await fs.writeFile(OUT+'/browser.json',JSON.stringify(evidence,null,2));
  console.log('TOOLBOX_MOTION_LAB_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
} finally {
  if(browser)await browser.close();
}
