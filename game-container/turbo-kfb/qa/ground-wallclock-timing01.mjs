import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.BASE_URL||'http://127.0.0.1:4173/game-container/turbo-kfb/app/';
const out=process.env.ARTIFACT_DIR||'game-container/turbo-kfb/qa/artifacts-wallclock-timing';
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

  const cfg=await page.evaluate(()=>window.__game.timing());
  check('live timing uses 60 Hz simulation slices',Math.abs(cfg.simStep-1/60)<1e-9,String(cfg.simStep));
  check('live timing has bounded catch-up window',Math.abs(cfg.maxCatchUp-.25)<1e-9,String(cfg.maxCatchUp));

  await key(page,'keydown','KeyW','w');
  const p0=await page.evaluate(()=>({...window.__game.world.groundPlayer.report().position}));

  const samples=await page.evaluate(()=>{
    const rows=[];
    for(let i=0;i<12;i++) rows.push(window.__game.advanceFrameElapsed(1/15));
    return rows;
  });
  const p1=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  const totalSim=samples.reduce((n,r)=>n+r.simulatedDt,0);
  const totalRaw=samples.reduce((n,r)=>n+r.rawDt,0);
  const totalDropped=samples.reduce((n,r)=>n+r.droppedDt,0);
  const distance=Math.hypot(p1.position.x-p0.x,p1.position.z-p0.z);

  check('15 FPS frames preserve wall-clock simulation time',Math.abs(totalRaw-.8)<1e-6&&Math.abs(totalSim-.8)<1e-6,JSON.stringify({raw:totalRaw,sim:totalSim}));
  check('15 FPS frames discard no elapsed time',totalDropped<1e-8,String(totalDropped));
  check('each 15 FPS frame is sliced instead of clamped',samples.every(r=>r.steps===4&&r.simulatedDt>.066&&r.simulatedDt<.067),JSON.stringify(samples.slice(0,2)));
  check('two-gear W stays Running_A during slow-frame catch-up',p1.currentAnimation==='Running_A'&&p1.semantic==='run',JSON.stringify({a:p1.currentAnimation,s:p1.semantic,v:p1.speed}));
  check('slow-frame wall-clock travel is materially faster than old half-speed failure',distance>1.45,'distance='+distance.toFixed(2));

  await key(page,'keydown','ShiftLeft','Shift');
  const shiftTiming=await page.evaluate(()=>window.__game.advanceFrameElapsed(1/15));
  const sprint=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('Shift remains Running_B through catch-up',sprint.currentAnimation==='Running_B'&&sprint.semantic==='sprint',JSON.stringify({a:sprint.currentAnimation,s:sprint.semantic,v:sprint.speed}));
  check('Shift frame also consumes full 15 FPS interval',shiftTiming.steps===4&&Math.abs(shiftTiming.simulatedDt-1/15)<1e-9,JSON.stringify(shiftTiming));

  await key(page,'keyup','ShiftLeft','Shift');
  await key(page,'keyup','KeyW','w');
  const stall=await page.evaluate(()=>window.__game.advanceFrameElapsed(.5));
  check('long stall is bounded instead of spiralling',Math.abs(stall.simulatedDt-.25)<1e-9&&Math.abs(stall.droppedDt-.25)<1e-9,JSON.stringify(stall));

  check('runtime error collector empty',(await page.evaluate(()=>window.__game.errors())).length===0,JSON.stringify(await page.evaluate(()=>window.__game.errors())));
  check('page/console errors empty',errors.length===0,JSON.stringify(errors));
  await page.screenshot({path:out+'/wallclock-timing.png',fullPage:true});
  await fs.writeFile(out+'/report.json',JSON.stringify({base:BASE,checks,errors,cfg,samples,totalRaw,totalSim,totalDropped,distance,sprint,shiftTiming,stall,testedAt:new Date().toISOString()},null,2));
  console.log('RESULT',checks.filter(c=>c.pass).length+'/'+checks.length,'PASS');
}catch(error){
  await fs.writeFile(out+'/failure.json',JSON.stringify({checks,errors,error:String(error?.stack||error),testedAt:new Date().toISOString()},null,2));
  try{await page.screenshot({path:out+'/failure.png',fullPage:true});}catch{}
  throw error;
}finally{
  await browser.close();
}
