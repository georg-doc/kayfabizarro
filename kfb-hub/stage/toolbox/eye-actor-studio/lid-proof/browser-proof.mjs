import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.KFB_LID_BASE||'http://127.0.0.1:4173';
const OUT=process.env.KFB_LID_EVIDENCE||'upper-lid-evidence';
await fs.mkdir(OUT,{recursive:true});

const checks=[];
const check=(name,cond,extra='')=>{
  checks.push({name,pass:!!cond,extra});
  if(!cond)throw Error('FAIL '+name+' '+extra);
  console.log('PASS',name,extra);
};

const browser=await chromium.launch({
  headless:true,
  args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']
});

try{
  for(const [label,viewport] of [
    ['desktop',{width:1440,height:900}],
    ['mobile',{width:390,height:844}]
  ]){
    const page=await browser.newPage({viewport});
    const errors=[],failed=[];
    page.on('pageerror',e=>errors.push(String(e)));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
    page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

    const res=await page.goto(BASE+'/kfb-hub/stage/toolbox/eye-actor-studio/lid-proof/',{
      waitUntil:'domcontentloaded',timeout:60000
    });
    check(label+' HTTP',res?.ok(),String(res?.status()));

    await page.waitForFunction(
      ()=>document.documentElement.dataset.kfbUpperLidReady==='yes'&&window.__KFB_UPPER_LID_PROOF__?.ready,
      null,{timeout:60000}
    );

    let d=await page.evaluate(()=>window.__KFB_UPPER_LID_PROOF__);
    check(label+' exact Mannequin host',d.host==='Mannequin_Medium.glb',d.host);
    check(label+' EyeRig v6 eye owner',d.eyeOwner==='EyeRig v6',d.eyeOwner);
    check(label+' old shells hidden',d.oldShellsHidden===true);
    check(label+' exactly one visible eye',d.visibleEyes===1,String(d.visibleEyes));
    check(label+' exactly one upper lid',d.upperLids===1,String(d.upperLids));
    check(label+' no lower lid',d.lowerLids===0,String(d.lowerLids));
    check(label+' upper lid schema',d.schema==='kfb.upper-lid-volume/0.3-candidate',d.schema);
    check(label+' closed volume',d.closedVolume===true);
    check(label+' real occlusion margin',d.realOcclusionMargin===true);
    check(label+' positive visible margin thickness',d.marginThickness>.01,String(d.marginThickness));

    await page.screenshot({path:OUT+'/'+label+'-reference-front.png'});

    await page.click('[data-view="three"]');
    await page.waitForFunction(()=>document.documentElement.dataset.kfbUpperLidView==='three'&&window.__KFB_UPPER_LID_PROOF__?.view==='three');
    d=await page.evaluate(()=>window.__KFB_UPPER_LID_PROOF__);
    check(label+' 3/4 view state',d.view==='three',d.view);
    await page.screenshot({path:OUT+'/'+label+'-reference-three.png'});

    await page.click('[data-view="side"]');
    await page.waitForFunction(()=>document.documentElement.dataset.kfbUpperLidView==='side'&&window.__KFB_UPPER_LID_PROOF__?.view==='side');
    d=await page.evaluate(()=>window.__KFB_UPPER_LID_PROOF__);
    check(label+' side view state',d.view==='side',d.view);
    await page.screenshot({path:OUT+'/'+label+'-reference-side.png'});

    await page.click('[data-view="front"]');

    await page.selectOption('#variant','cover');await page.waitForTimeout(160);
    d=await page.evaluate(()=>window.__KFB_UPPER_LID_PROOF__);
    check(label+' cover variant',d.params.cover>.45,JSON.stringify(d.params));
    await page.screenshot({path:OUT+'/'+label+'-cover-front.png'});

    await page.selectOption('#variant','slant');await page.waitForTimeout(160);
    d=await page.evaluate(()=>window.__KFB_UPPER_LID_PROOF__);
    check(label+' slant variant',Math.abs(d.params.slant)>.5,JSON.stringify(d.params));
    await page.screenshot({path:OUT+'/'+label+'-slant-front.png'});

    await page.selectOption('#variant','concave');await page.waitForTimeout(160);
    d=await page.evaluate(()=>window.__KFB_UPPER_LID_PROOF__);
    check(label+' concave variant',d.params.curve<-.6,JSON.stringify(d.params));
    await page.screenshot({path:OUT+'/'+label+'-concave-front.png'});

    await page.selectOption('#variant','convex');await page.waitForTimeout(160);
    d=await page.evaluate(()=>window.__KFB_UPPER_LID_PROOF__);
    check(label+' convex variant',d.params.curve>.6,JSON.stringify(d.params));
    await page.screenshot({path:OUT+'/'+label+'-convex-front.png'});

    await page.selectOption('#debug','translucent');await page.waitForTimeout(120);
    check(label+' translucent debug',true);
    await page.screenshot({path:OUT+'/'+label+'-translucent.png'});

    check(label+' no failed resources',failed.length===0,JSON.stringify(failed));
    check(label+' no page errors',errors.length===0,JSON.stringify(errors));

    await page.close();
  }

  await fs.writeFile(OUT+'/browser.json',JSON.stringify({checks},null,2));
  console.log('KFB_UPPER_LID_BROWSER_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
}finally{
  await browser.close();
}
