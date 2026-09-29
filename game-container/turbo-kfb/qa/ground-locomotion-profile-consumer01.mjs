import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.BASE_URL||'http://127.0.0.1:4173/game-container/turbo-kfb/app/';
const out=process.env.ARTIFACT_DIR||'game-container/turbo-kfb/qa/artifacts-locomotion-profile-consumer';
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
  await page.goto(BASE+'?ground=1&groundFeel=velocity&walkPace=travel',{waitUntil:'networkidle',timeout:45000});
  await page.waitForFunction(()=>window.__game?.state==='ground'&&window.__game?.world?.groundPlayer?.ready===true,null,{timeout:45000});
  const g0=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('stable ToolBox locomotion owner consumed',g0.profileOwner==='/tools/KFB-ToolBox/kfb-lib/locomotion-profiles.v1.js',g0.profileOwner);
  check('consumer schema is canonical',g0.profileSchema==='kfb.locomotion-profile-set/0.1#consumer',g0.profileSchema);
  check('profile source is KayKit Character Animations 1.1',g0.profileSource?.pack==='KayKit Character Animations 1.1',JSON.stringify(g0.profileSource));
  check('run role resolves Running_A',g0.profileRoles?.run?.clip==='Running_A',JSON.stringify(g0.profileRoles?.run));
  check('ActionFigure sprint follows canonical measured fallback',g0.profileRoles?.sprint?.clip==='Running_A'&&g0.profileRoles?.sprint?.sourceBacked===false&&g0.profileRoles?.sprint?.variant?.type==='playback-rate',JSON.stringify(g0.profileRoles?.sprint));
  check('ActionFigure sprint profile is faster via playback variant',g0.profileRoles.sprint.worldSpeed>g0.profileRoles.run.worldSpeed*1.1&&Math.abs(g0.profileRoles.sprint.rate-1.3)<1e-9,JSON.stringify({run:g0.profileRoles.run,sprint:g0.profileRoles.sprint}));
  check('Travel gameplay targets come from legacy Walker feel donor',Math.abs(g0.travelRunSpeed-5.4)<1e-9&&Math.abs(g0.travelSprintSpeed-9.45)<1e-9,JSON.stringify({run:g0.travelRunSpeed,sprint:g0.travelSprintSpeed}));
  check('run target playback is profile-derived',g0.travelRunPlaybackRate>1&&g0.travelRunPlaybackRate<3,String(g0.travelRunPlaybackRate));
  check('sprint target playback is profile-derived and faster',g0.travelSprintPlaybackRate>g0.travelRunPlaybackRate&&g0.travelSprintPlaybackRate<4,String(g0.travelSprintPlaybackRate));
  check('Orbit retained',await page.evaluate(()=>!!window.__game.world.groundOrbit?.report?.().enabled));

  const probe=await page.evaluate(()=>{
    const fire=(type,code,key)=>window.dispatchEvent(new KeyboardEvent(type,{code,key,bubbles:true,cancelable:true}));
    const report=()=>window.__game.world.groundPlayer.report();
    const p0=report();
    fire('keydown','KeyW','w');
    const runFrames=[]; for(let i=0;i<15;i++)runFrames.push(window.__game.advanceTravelFrame(1/15));
    const run=report();
    fire('keydown','ShiftLeft','Shift');
    const sprintFrames=[]; for(let i=0;i<15;i++)sprintFrames.push(window.__game.advanceTravelFrame(1/15));
    const sprint=report();
    fire('keyup','ShiftLeft','Shift');
    for(let i=0;i<4;i++)window.__game.advanceTravelFrame(1/15);
    const released=report();
    fire('keyup','KeyW','w');
    return {p0,runFrames,run,sprintFrames,sprint,released};
  });

  const runRaw=probe.runFrames.reduce((n,r)=>n+r.rawDt,0);
  const runSim=probe.runFrames.reduce((n,r)=>n+r.simulatedDt,0);
  const runDropped=probe.runFrames.reduce((n,r)=>n+r.droppedDt,0);
  const runDistance=Math.hypot(probe.run.position.x-probe.p0.position.x,probe.run.position.z-probe.p0.position.z);
  check('15 FPS run preserves wall-clock',Math.abs(runRaw-1)<1e-6&&Math.abs(runSim-1)<1e-6&&runDropped<1e-8,JSON.stringify({raw:runRaw,sim:runSim,dropped:runDropped}));
  check('W uses canonical run role',probe.run.currentRole==='run'&&probe.run.currentAnimation==='Running_A'&&probe.run.semantic==='run',JSON.stringify({role:probe.run.currentRole,a:probe.run.currentAnimation,s:probe.run.semantic}));
  check('W settles near 5.4 u/s',probe.run.speed>5.35&&probe.run.speed<5.41,String(probe.run.speed));
  check('W playback follows measured profile',Math.abs(probe.run.currentPlaybackRate-probe.run.travelRunPlaybackRate)<0.03,JSON.stringify({current:probe.run.currentPlaybackRate,target:probe.run.travelRunPlaybackRate}));
  check('W covers faster ground',runDistance>4,'distance='+runDistance.toFixed(2));

  const sprintRaw=probe.sprintFrames.reduce((n,r)=>n+r.rawDt,0);
  const sprintSim=probe.sprintFrames.reduce((n,r)=>n+r.simulatedDt,0);
  check('15 FPS sprint preserves wall-clock',Math.abs(sprintRaw-1)<1e-6&&Math.abs(sprintSim-1)<1e-6,JSON.stringify({raw:sprintRaw,sim:sprintSim}));
  check('Shift uses canonical sprint role',probe.sprint.currentRole==='sprint'&&probe.sprint.currentAnimation==='Running_A'&&probe.sprint.semantic==='sprint',JSON.stringify({role:probe.sprint.currentRole,a:probe.sprint.currentAnimation,s:probe.sprint.semantic}));
  check('Shift settles near 9.45 u/s',probe.sprint.speed>9.38&&probe.sprint.speed<9.46,String(probe.sprint.speed));
  check('Shift playback follows measured profile',Math.abs(probe.sprint.currentPlaybackRate-probe.sprint.travelSprintPlaybackRate)<0.03,JSON.stringify({current:probe.sprint.currentPlaybackRate,target:probe.sprint.travelSprintPlaybackRate}));
  check('run to sprint uses canonical same-clip transition hint',probe.sprint.lastTransition?.from==='run'&&probe.sprint.lastTransition?.to==='sprint'&&Math.abs(probe.sprint.lastTransition.fade-.15)<1e-9&&probe.sprint.lastTransition.syncPhase===true&&probe.sprint.lastTransition.sameClip===true,JSON.stringify(probe.sprint.lastTransition));
  check('Shift release returns canonical run role',probe.released.currentRole==='run'&&probe.released.currentAnimation==='Running_A',JSON.stringify({role:probe.released.currentRole,a:probe.released.currentAnimation}));
  check('sprint to run uses canonical same-clip transition hint',probe.released.lastTransition?.from==='sprint'&&probe.released.lastTransition?.to==='run'&&Math.abs(probe.released.lastTransition.fade-.2)<1e-9&&probe.released.lastTransition.syncPhase===true&&probe.released.lastTransition.sameClip===true,JSON.stringify(probe.released.lastTransition));

  check('runtime errors empty',(await page.evaluate(()=>window.__game.errors())).length===0,JSON.stringify(await page.evaluate(()=>window.__game.errors())));
  check('page/console errors empty',errors.length===0,JSON.stringify(errors));
  await page.screenshot({path:out+'/ground-locomotion-profile-consumer.png',fullPage:true});
  await fs.writeFile(out+'/report.json',JSON.stringify({base:BASE,checks,errors,initial:g0,probe,runDistance,testedAt:new Date().toISOString()},null,2));
  console.log('RESULT',checks.filter(c=>c.pass).length+'/'+checks.length,'PASS');
}catch(error){
  await fs.writeFile(out+'/failure.json',JSON.stringify({checks,errors,error:String(error?.stack||error),testedAt:new Date().toISOString()},null,2));
  try{await page.screenshot({path:out+'/failure.png',fullPage:true});}catch{}
  throw error;
}finally{await browser.close()}
