import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.SEAM_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/toolbox/tileable-macro-seam-lab/';
const OUT=process.env.SEAM_OUT||'tileable-macro-seam-evidence';
const checks=[];
const check=(name,cond,extra='')=>{checks.push({name,pass:!!cond,extra});if(!cond)throw Error('FAIL '+name+' '+extra);console.log('PASS',name,extra)};

await fs.mkdir(OUT,{recursive:true});
let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const res=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  check('HTTP',res?.ok()===true,'status='+res?.status());
  await page.waitForFunction(()=>window.__KFB_TILEABLE_SEAM__?.ready===true||!!window.__KFB_TILEABLE_SEAM__?.error,null,{timeout:180000});
  await page.waitForTimeout(600);
  const snap=await page.evaluate(()=>window.__KFB_TILEABLE_SEAM__.snapshot());

  check('ready',snap.ready===true,JSON.stringify(snap.error));
  check('exact Dungeon recipe',snap.room?.recipeId==='CQ-S1_KAYKIT_DUNGEON_PROMO',JSON.stringify(snap.room));
  check('Dungeon 69 placements',snap.room?.placements===69,String(snap.room?.placements));
  check('exact GothGirl donor',/GothGirl\.glb$/.test(snap.actors?.gothgirl?.path||''),JSON.stringify(snap.actors?.gothgirl));
  check('exact FrizzleBob graft donor',/graft-mount\.v1\.js$/.test(snap.actors?.frizzlebob?.module||''),JSON.stringify(snap.actors?.frizzlebob));
  check('frozen v2 material pin retained',snap.contract?.v2MaterialPin==='7cbad52b55fb9ec2300aa4b25ca92b0997ce448a',String(snap.contract?.v2MaterialPin));
  check('only macro generator changes',snap.contract?.onlyChange==='macro texture generator',JSON.stringify(snap.contract));

  const oldScore=(snap.oldMetric.seamXRatio+snap.oldMetric.seamYRatio)/2;
  const newScore=(snap.newMetric.seamXRatio+snap.newMetric.seamYRatio)/2;
  check('tileable edge score improves',newScore<oldScore,JSON.stringify({old:snap.oldMetric,new:snap.newMetric,oldScore,newScore}));
  check('tileable X edge not worse',snap.newMetric.seamXRatio<=snap.oldMetric.seamXRatio,JSON.stringify({old:snap.oldMetric.seamXRatio,new:snap.newMetric.seamXRatio}));
  check('tileable Y edge not worse',snap.newMetric.seamYRatio<=snap.oldMetric.seamYRatio,JSON.stringify({old:snap.oldMetric.seamYRatio,new:snap.newMetric.seamYRatio}));

  await page.evaluate(()=>{window.__KFB_TILEABLE_SEAM__.setView('seam');window.__KFB_TILEABLE_SEAM__.setLook('old')});
  await page.waitForTimeout(350);
  const oldPng=await page.screenshot({path:OUT+'/seam-old-repeat.png',fullPage:true});
  await page.evaluate(()=>window.__KFB_TILEABLE_SEAM__.setLook('tileable'));
  await page.waitForTimeout(350);
  const newPng=await page.screenshot({path:OUT+'/seam-tileable.png',fullPage:true});
  check('seam renders differ',Buffer.compare(oldPng,newPng)!==0);

  await page.evaluate(()=>{window.__KFB_TILEABLE_SEAM__.setView('integrated');window.__KFB_TILEABLE_SEAM__.setLook('tileable')});
  await page.waitForTimeout(300);
  await page.screenshot({path:OUT+'/integrated-tileable.png',fullPage:true});

  const finalSnap=await page.evaluate(()=>window.__KFB_TILEABLE_SEAM__.snapshot());
  check('one active shared tileable texture',finalSnap.textures.active.length===1&&finalSnap.textures.active[0]===finalSnap.textures.tileable,JSON.stringify(finalSnap.textures));

  await page.setViewportSize({width:832,height:780});await page.waitForTimeout(250);
  const responsive=await page.evaluate(()=>({canvas:!!document.querySelector('#stage canvas'),controls:document.querySelector('.controls')?.getBoundingClientRect().width||0,viewport:innerWidth}));
  check('832px canvas visible',responsive.canvas===true);
  check('832px controls fit',responsive.controls<=responsive.viewport,JSON.stringify(responsive));
  await page.screenshot({path:OUT+'/integrated-tileable-832.png',fullPage:true});

  check('no failed resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));

  await fs.writeFile(OUT+'/browser.json',JSON.stringify({base:BASE,snapshot:finalSnap,checks,failed,errors},null,2));
  console.log('TILEABLE_MACRO_SEAM_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
}finally{if(browser)await browser.close()}
