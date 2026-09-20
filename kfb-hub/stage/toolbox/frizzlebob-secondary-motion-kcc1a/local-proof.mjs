import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const URL=process.env.KCC1A_BASE_URL||'http://127.0.0.1:4173/kfb-hub/stage/toolbox/frizzlebob-secondary-motion-kcc1a/';
const OUT=process.env.KCC1A_PROOF_DIR||'kcc1a-browser-evidence';
const checks=[];
const check=(name,cond,extra='')=>{
  checks.push({name,pass:!!cond,extra});
  if(!cond) throw Error('FAIL '+name+' '+extra);
  console.log('PASS',name,extra);
};

await fs.mkdir(OUT,{recursive:true});
let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:940},deviceScaleFactor:1});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push('pageerror '+String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
  page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});
  page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));

  const response=await page.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
  check('HTTP',response?.ok()===true,'status='+response?.status());
  await page.waitForFunction(()=>document.getElementById('json')?.textContent?.includes('kfb.secondary-motion.race-facts/0.1'),null,{timeout:30000});

  check('no ear mesh label',/NO EAR MESH/.test(await page.locator('body').innerText()));
  check('scope guard visible',/No placeholder ears are rendered here/.test(await page.locator('body').innerText()));
  check('canonical adapter provenance',/race-secondary-facts\.v1\.js/.test(await page.locator('body').innerText()));
  check('canvas trace exists',await page.locator('#plot').count()===1);

  await page.click('[data-preset="rest"]');
  const rest=await page.evaluate(()=>({
    energy:document.getElementById('energy')?.firstChild?.nodeValue?.trim(),
    flutter:document.getElementById('flutterAmp')?.firstChild?.nodeValue?.trim(),
    root:[
      document.getElementById('rootPitch')?.textContent,
      document.getElementById('rootRoll')?.textContent,
      document.getElementById('rootYaw')?.textContent
    ]
  }));
  check('rest energy zero',rest.energy==='0.000',JSON.stringify(rest));
  check('rest flutter zero',rest.flutter==='0.000',JSON.stringify(rest));
  check('rest root zero',rest.root.every(x=>x==='0.000'),JSON.stringify(rest));

  await page.click('[data-preset="crosswind"]');
  const cross=await page.evaluate(()=>({
    energy:Number(document.getElementById('energy')?.firstChild?.nodeValue),
    roll:Number(document.getElementById('rootRoll')?.textContent),
    flutter:Number(document.getElementById('flutterAmp')?.firstChild?.nodeValue),
    json:document.getElementById('json')?.textContent||''
  }));
  check('crosswind energizes',cross.energy>0,JSON.stringify(cross));
  check('crosswind produces root roll',Math.abs(cross.roll)>0.01,JSON.stringify(cross));
  check('crosswind enables flutter',cross.flutter>0,JSON.stringify(cross));
  check('output schema visible',cross.json.includes('"schema": "kfb.secondary-motion.race-facts/0.1"'));

  await page.click('[data-preset="impact"]');
  const impact=Number(await page.locator('#impactFact').textContent());
  check('impact preset emits impact fact',impact>0.5,String(impact));

  check('no failed HTTP/resources',failed.length===0,JSON.stringify(failed));
  check('no page/console errors',errors.length===0,JSON.stringify(errors));

  await page.screenshot({path:OUT+'/desktop.png',fullPage:true});
  await fs.writeFile(OUT+'/browser.json',JSON.stringify({url:URL,checks,rest,cross,impact,failed,errors},null,2));
  console.log('KCC1A_BROWSER_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
}finally{
  if(browser) await browser.close();
}
