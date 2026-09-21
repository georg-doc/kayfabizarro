import {chromium} from 'playwright';import fs from 'node:fs/promises';
const BASE=process.env.KFB_TOY_BASE||'http://127.0.0.1:4173',OUT=process.env.KFB_TOY_EVIDENCE||'toy-clay-evidence';await fs.mkdir(OUT,{recursive:true});
const checks=[];const check=(n,c,e='')=>{checks.push({name:n,pass:!!c,extra:e});if(!c)throw Error('FAIL '+n+' '+e);console.log('PASS',n,e)};
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 for(const [label,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]){
  const errors=[],failed=[],page=await browser.newPage({viewport});page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()})});page.on('requestfailed',r=>failed.push({status:0,url:r.url(),error:r.failure()?.errorText}));
  const res=await page.goto(BASE+'/kfb-hub/stage/toolbox/toy-clay-form-lab/',{waitUntil:'domcontentloaded',timeout:60000});check(label+' HTTP',res?.ok(),String(res?.status()));
  await page.waitForFunction(()=>document.documentElement.dataset.kfbToyReady==='yes',null,{timeout:90000});check(label+' donor ready',true);check(label+' donor first',await page.evaluate(()=>window.__KFB_TOY_LAB__.model)==='donor');await page.screenshot({path:OUT+'/'+label+'-donor-toaster.png'});
  for(const [id,max] of [['panel',4],['eiffel',14],['cologne',16]]){await page.selectOption('#model',id);await page.waitForFunction(x=>document.documentElement.dataset.kfbToyReady==='yes'&&document.documentElement.dataset.kfbToyModel===x,id,{timeout:30000});const data=await page.evaluate(()=>window.__KFB_TOY_LAB__);check(label+' '+id+' budget',data.stats.parts<=max,data.stats.parts+'/'+max);}
  await page.screenshot({path:OUT+'/'+label+'-cologne.png'});check(label+' no failed resources',failed.length===0,JSON.stringify(failed));check(label+' no page errors',errors.length===0,JSON.stringify(errors));await page.close();
 }
 await fs.writeFile(OUT+'/browser.json',JSON.stringify({checks},null,2));console.log('KFB_TOY_CLAY_BROWSER_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
}finally{await browser.close()}
