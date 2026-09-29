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
  check('travel walk pace active',g0.walkPace==='travel',g0.walkPace);
  check('travel walk target is ~1.10 u/s',g0.walkSpeed>1.09&&g0.walkSpeed<1.11,String(g0.walkSpeed));
  check('Walking_A playback is overdriven to cap',Math.abs(g0.walkPlaybackRate-1.8)<1e-9,String(g0.walkPlaybackRate));
  check('velocity semantic consumer retained',g0.feelMode==='velocity'&&g0.enhanced===true,JSON.stringify({feel:g0.feelMode,enhanced:g0.enhanced}));
  const orbitRetained=await page.evaluate(()=>!!window.__game.world.groundOrbit?.report?.().enabled);
  check('Orbit retained',orbitRetained,String(orbitRetained));

  await key(page,'keydown','KeyW','w');
  await page.evaluate(()=>window.__game.advanceBy(.12));
  const start=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('travel Walk accelerates rather than snaps',start.speed>.45&&start.speed<1.0,String(start.speed));
  check('travel Walk uses Walking_A',start.currentAnimation==='Walking_A'&&start.semantic==='walk',JSON.stringify({a:start.currentAnimation,s:start.semantic}));

  await page.evaluate(()=>window.__game.advanceBy(.72));
  const walk=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('travel Walk settles near 1.10 u/s',walk.speed>1.06&&walk.speed<1.12,String(walk.speed));
  const travel=Math.hypot(walk.position.x-g0.position.x,walk.position.z-g0.position.z);
  check('travel Walk covers useful ground',travel>.65,'distance='+travel.toFixed(2));

  await key(page,'keydown','ShiftLeft','Shift');
  await page.evaluate(()=>window.__game.advanceBy(.18));
  const run=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('Shift still reaches Running_A tier',run.currentAnimation==='Running_A'&&run.semantic==='run',JSON.stringify({a:run.currentAnimation,s:run.semantic,v:run.speed}));
  await page.evaluate(()=>window.__game.advanceBy(.55));
  const sprint=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('Shift still reaches Running_B sprint',sprint.currentAnimation==='Running_B'&&sprint.semantic==='sprint',JSON.stringify({a:sprint.currentAnimation,s:sprint.semantic,v:sprint.speed}));

  await key(page,'keyup','ShiftLeft','Shift');
  await page.evaluate(()=>window.__game.advanceBy(.55));
  const backToWalk=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('release returns to faster Walking_A',backToWalk.currentAnimation==='Walking_A'&&backToWalk.speed>1.05,JSON.stringify({a:backToWalk.currentAnimation,v:backToWalk.speed}));

  await key(page,'keyup','KeyW','w');
  await page.evaluate(()=>window.__game.advanceBy(.5));
  check('runtime error collector empty',(await page.evaluate(()=>window.__game.errors())).length===0,JSON.stringify(await page.evaluate(()=>window.__game.errors())));
  check('page/console errors empty',errors.length===0,JSON.stringify(errors));
  await page.screenshot({path:out+'/walk-pace-travel.png',fullPage:true});
  await fs.writeFile(out+'/report.json',JSON.stringify({base:BASE,checks,errors,initial:g0,start,walk,run,sprint,backToWalk,travel,testedAt:new Date().toISOString()},null,2));
  console.log('RESULT',checks.filter(c=>c.pass).length+'/'+checks.length,'PASS');
}catch(error){
  await fs.writeFile(out+'/failure.json',JSON.stringify({checks,errors,error:String(error?.stack||error),testedAt:new Date().toISOString()},null,2));
  try{await page.screenshot({path:out+'/failure.png',fullPage:true});}catch{}
  throw error;
}finally{
  await browser.close();
}
