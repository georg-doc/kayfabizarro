import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.BASE_URL||'http://127.0.0.1:4173/game-container/turbo-kfb/app/';
const out=process.env.ARTIFACT_DIR||'game-container/turbo-kfb/qa/artifacts-travel-pace-timing';
await fs.mkdir(out,{recursive:true});
const checks=[];
function check(name,condition,extra=''){
  checks.push({name,pass:!!condition,extra});
  if(!condition)throw new Error('FAIL '+name+(extra?' · '+extra:''));
  console.log('PASS',name,extra);
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
  check('Travel profile active',g0.walkPace==='travel',g0.walkPace);
  check('Travel cadence is 1.8x',Math.abs(g0.travelCadence-1.8)<1e-9,String(g0.travelCadence));
  check('Running_A world target is cadence-coupled',Math.abs(g0.travelRunSpeed-4.46449350062322)<1e-9,String(g0.travelRunSpeed));
  check('Running_B world target is cadence-coupled',Math.abs(g0.travelSprintSpeed-5.451146564260952)<1e-9,String(g0.travelSprintSpeed));
  check('Running_A playback target is 1.8x',Math.abs(g0.travelRunPlaybackRate-1.8)<1e-9,String(g0.travelRunPlaybackRate));
  check('Running_B playback target is 1.8x',Math.abs(g0.travelSprintPlaybackRate-1.8)<1e-9,String(g0.travelSprintPlaybackRate));
  check('Travel default/Shift clips retained',g0.travelDefaultClip==='Running_A'&&g0.travelShiftClip==='Running_B',JSON.stringify({w:g0.travelDefaultClip,shift:g0.travelShiftClip}));
  check('Orbit retained',await page.evaluate(()=>!!window.__game.world.groundOrbit?.report?.().enabled));

  const probe=await page.evaluate(()=>{
    const fire=(type,code,key)=>window.dispatchEvent(new KeyboardEvent(type,{code,key,bubbles:true,cancelable:true}));
    const report=()=>window.__game.world.groundPlayer.report();
    const p0=report();
    fire('keydown','KeyW','w');
    const runFrames=[];
    for(let i=0;i<12;i++)runFrames.push(window.__game.advanceTravelFrame(1/15));
    const run=report();
    fire('keydown','ShiftLeft','Shift');
    const sprintFrames=[];
    for(let i=0;i<9;i++)sprintFrames.push(window.__game.advanceTravelFrame(1/15));
    const sprint=report();
    fire('keyup','ShiftLeft','Shift');
    for(let i=0;i<3;i++)window.__game.advanceTravelFrame(1/15);
    const released=report();
    fire('keyup','KeyW','w');
    const stall=window.__game.advanceTravelFrame(.5);
    return {p0,runFrames,run,sprintFrames,sprint,released,stall};
  });

  const runRaw=probe.runFrames.reduce((n,r)=>n+r.rawDt,0);
  const runSim=probe.runFrames.reduce((n,r)=>n+r.simulatedDt,0);
  const runDropped=probe.runFrames.reduce((n,r)=>n+r.droppedDt,0);
  const runDistance=Math.hypot(probe.run.position.x-probe.p0.position.x,probe.run.position.z-probe.p0.position.z);
  check('15 FPS Travel consumes full wall-clock time',Math.abs(runRaw-.8)<1e-6&&Math.abs(runSim-.8)<1e-6,JSON.stringify({raw:runRaw,sim:runSim}));
  check('15 FPS Travel drops no ordinary frame time',runDropped<1e-8,String(runDropped));
  check('15 FPS frame is four 60 Hz slices',probe.runFrames.every(r=>r.active&&r.steps===4&&Math.abs(r.simulatedDt-1/15)<1e-9),JSON.stringify(probe.runFrames.slice(0,2)));
  check('W remains Running_A',probe.run.currentAnimation==='Running_A'&&probe.run.semantic==='run',JSON.stringify({a:probe.run.currentAnimation,s:probe.run.semantic}));
  check('W settles near 4.46 u/s',probe.run.speed>4.42&&probe.run.speed<4.47,String(probe.run.speed));
  check('W playback reaches 1.8x',probe.run.currentPlaybackRate>1.79&&probe.run.currentPlaybackRate<=1.8,String(probe.run.currentPlaybackRate));
  check('W covers materially faster synchronized ground',runDistance>2.6,'distance='+runDistance.toFixed(2));

  const sprintRaw=probe.sprintFrames.reduce((n,r)=>n+r.rawDt,0);
  const sprintSim=probe.sprintFrames.reduce((n,r)=>n+r.simulatedDt,0);
  check('Shift remains Running_B',probe.sprint.currentAnimation==='Running_B'&&probe.sprint.semantic==='sprint',JSON.stringify({a:probe.sprint.currentAnimation,s:probe.sprint.semantic}));
  check('Shift settles near 5.45 u/s',probe.sprint.speed>5.40&&probe.sprint.speed<5.46,String(probe.sprint.speed));
  check('Shift playback reaches 1.8x',probe.sprint.currentPlaybackRate>1.79&&probe.sprint.currentPlaybackRate<=1.8,String(probe.sprint.currentPlaybackRate));
  check('Sprint 15 FPS timing remains wall-clock exact',Math.abs(sprintRaw-.6)<1e-6&&Math.abs(sprintSim-.6)<1e-6,JSON.stringify({raw:sprintRaw,sim:sprintSim}));
  check('Shift release returns Running_A',probe.released.currentAnimation==='Running_A'&&probe.released.semantic==='run',JSON.stringify({a:probe.released.currentAnimation,s:probe.released.semantic}));
  check('Long stall catch-up remains bounded',Math.abs(probe.stall.simulatedDt-.25)<1e-9&&Math.abs(probe.stall.droppedDt-.25)<1e-9,JSON.stringify(probe.stall));

  check('runtime errors empty',(await page.evaluate(()=>window.__game.errors())).length===0,JSON.stringify(await page.evaluate(()=>window.__game.errors())));
  check('page/console errors empty',errors.length===0,JSON.stringify(errors));
  await page.screenshot({path:out+'/travel-pace-timing.png',fullPage:true});
  await fs.writeFile(out+'/report.json',JSON.stringify({base:BASE,checks,errors,initial:g0,probe,runRaw,runSim,runDropped,runDistance,sprintRaw,sprintSim,testedAt:new Date().toISOString()},null,2));
  console.log('RESULT',checks.filter(c=>c.pass).length+'/'+checks.length,'PASS');
}catch(error){
  await fs.writeFile(out+'/failure.json',JSON.stringify({checks,errors,error:String(error?.stack||error),testedAt:new Date().toISOString()},null,2));
  try{await page.screenshot({path:out+'/failure.png',fullPage:true});}catch{}
  throw error;
}finally{
  await browser.close();
}
