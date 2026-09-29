import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.BASE_URL||'http://127.0.0.1:4173/game-container/turbo-kfb/app/';
const out=process.env.ARTIFACT_DIR||'game-container/turbo-kfb/qa/artifacts-walk-pace-tune';
await fs.mkdir(out,{recursive:true});
const checks=[];
function check(name,condition,extra=''){
  checks.push({name,pass:!!condition,extra});
  if(!condition)throw new Error('FAIL '+name+(extra?' · '+extra:''));
  console.log('PASS',name,extra);
}
async function key(page,type,code,k){
  await page.evaluate(({type,code,k})=>window.dispatchEvent(new KeyboardEvent(type,{code,key:k,bubbles:true,cancelable:true})),{type,code,k});
}
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text())});

try{
  await page.goto(BASE+'?ground=1&groundFeel=velocity&walkPace=travel',{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__game?.state==='ground'&&window.__game?.world?.groundPlayer?.ready===true,null,{timeout:30000});
  const g0=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('travel profile active',g0.walkPace==='travel',g0.walkPace);
  check('normal travel target is Running_A speed',Math.abs(g0.forwardSpeed-g0.runSpeed)<1e-9&&g0.forwardSpeed>2.47&&g0.forwardSpeed<2.49,JSON.stringify({forward:g0.forwardSpeed,run:g0.runSpeed}));
  check('travel default clip is Running_A',g0.travelDefaultClip==='Running_A',g0.travelDefaultClip);
  check('travel Shift clip is Running_B',g0.travelShiftClip==='Running_B',g0.travelShiftClip);
  check('Running_A playback reference remains 1x',Math.abs(g0.runPlaybackRate-1)<1e-9,String(g0.runPlaybackRate));
  check('velocity semantic consumer retained',g0.feelMode==='velocity'&&g0.enhanced===true,JSON.stringify({feel:g0.feelMode,enhanced:g0.enhanced}));
  const orbitRetained=await page.evaluate(()=>!!window.__game.world.groundOrbit?.report?.().enabled);
  check('Orbit retained',orbitRetained,String(orbitRetained));

  await key(page,'keydown','KeyW','w');
  await page.evaluate(()=>window.__game.advanceBy(.06));
  const start=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('W immediately selects Running_A',start.currentAnimation==='Running_A'&&start.semantic==='run',JSON.stringify({a:start.currentAnimation,s:start.semantic,v:start.speed}));
  check('W acceleration is already materially faster than old travel Walk',start.speed>0.8,String(start.speed));

  await page.evaluate(()=>window.__game.advanceBy(.78));
  const run=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('normal W settles near Running_A speed',run.currentAnimation==='Running_A'&&run.semantic==='run'&&run.speed>2.42&&run.speed<2.50,JSON.stringify({a:run.currentAnimation,s:run.semantic,v:run.speed}));
  const travel=Math.hypot(run.position.x-g0.position.x,run.position.z-g0.position.z);
  check('normal W covers second-gear ground',travel>1.55,'distance='+travel.toFixed(2));

  await key(page,'keydown','ShiftLeft','Shift');
  await page.evaluate(()=>window.__game.advanceBy(.06));
  const sprintStart=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('Shift immediately selects Running_B Sprint',sprintStart.currentAnimation==='Running_B'&&sprintStart.semantic==='sprint',JSON.stringify({a:sprintStart.currentAnimation,s:sprintStart.semantic,v:sprintStart.speed}));
  await page.evaluate(()=>window.__game.advanceBy(.55));
  const sprint=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('Shift settles near Running_B sprint speed',sprint.currentAnimation==='Running_B'&&sprint.semantic==='sprint'&&sprint.speed>2.95,JSON.stringify({a:sprint.currentAnimation,s:sprint.semantic,v:sprint.speed}));

  await key(page,'keyup','ShiftLeft','Shift');
  await page.evaluate(()=>window.__game.advanceBy(.12));
  const backToRun=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('Shift release returns directly to Running_A',backToRun.currentAnimation==='Running_A'&&backToRun.semantic==='run',JSON.stringify({a:backToRun.currentAnimation,s:backToRun.semantic,v:backToRun.speed}));

  await key(page,'keyup','KeyW','w');
  await page.evaluate(()=>window.__game.advanceBy(.5));
  check('runtime error collector empty',(await page.evaluate(()=>window.__game.errors())).length===0,JSON.stringify(await page.evaluate(()=>window.__game.errors())));
  check('page/console errors empty',errors.length===0,JSON.stringify(errors));
  await page.screenshot({path:out+'/walk-pace-travel.png',fullPage:true});
  await fs.writeFile(out+'/report.json',JSON.stringify({base:BASE,checks,errors,initial:g0,start,run,sprintStart,sprint,backToRun,travel,testedAt:new Date().toISOString()},null,2));
  console.log('RESULT',checks.filter(c=>c.pass).length+'/'+checks.length,'PASS');
}catch(error){
  await fs.writeFile(out+'/failure.json',JSON.stringify({checks,errors,error:String(error?.stack||error),testedAt:new Date().toISOString()},null,2));
  try{await page.screenshot({path:out+'/failure.png',fullPage:true});}catch{}
  throw error;
}finally{
  await browser.close();
}
