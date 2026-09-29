import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE=process.env.BASE_URL||'http://127.0.0.1:4173/game-container/turbo-kfb/app/';
const out=process.env.ARTIFACT_DIR||'game-container/turbo-kfb/qa/ground-orbit-integration01-artifacts';
await fs.mkdir(out,{recursive:true});
const checks=[];
function check(name,condition,extra=''){
  checks.push({name,pass:!!condition,extra});
  if(!condition)throw new Error('FAIL '+name+(extra?' · '+extra:''));
  console.log('PASS',name,extra);
}
async function waitFor(page,fn,timeout=30000){await page.waitForFunction(fn,null,{timeout});}
async function keyEvent(page,type,code,key){
  await page.evaluate(({type,code,key})=>window.dispatchEvent(new KeyboardEvent(type,{code,key,bubbles:true,cancelable:true})),{type,code,key});
}
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text());});

try{
  await page.goto(BASE+'?ground=1&groundFeel=velocity',{waitUntil:'networkidle',timeout:30000});
  await waitFor(page,()=>window.__game?.state==='ground'&&window.__game?.world?.groundPlayer?.ready===true);
  const g0=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('candidate opts into velocity feel',g0.feelMode==='velocity'&&g0.enhanced===true,JSON.stringify({feel:g0.feelMode,enhanced:g0.enhanced}));
  const required=['Idle_A','Walking_A','Running_A','Running_B','Walking_Backwards','Running_Strafe_Left','Running_Strafe_Right','Jump_Start','Jump_Idle','Jump_Land'];
  check('candidate binds semantic source clips',JSON.stringify(g0.clips)===JSON.stringify(required),JSON.stringify(g0.clips));
  check('candidate walk speed returns to measured Walking_A',Math.abs(g0.walkSpeed-0.610950956910957)<1e-9,String(g0.walkSpeed));
  check('candidate sprint tier exceeds Running_A',g0.sprintSpeed>g0.runSpeed,String(g0.sprintSpeed));
  check('candidate jump apex bounded to actor scale',g0.jump&&g0.jump.apex>g0.actorHeight*.45&&g0.jump.apex<g0.actorHeight*.60,JSON.stringify(g0.jump));
  check('candidate nominal airtime bounded',g0.jump.nominalAirTime>.70&&g0.jump.nominalAirTime<.90,String(g0.jump.nominalAirTime));

  const orbit0=await page.evaluate(()=>{
    const w=window.__game.world;
    const r=w.groundOrbit?.report?.();
    const c=window.__game.camera.position;
    return {report:r,camera:{x:c.x,y:c.y,z:c.z},heading:w.groundPlayer.heading};
  });
  check('combined Ground Orbit owner mounted',!!orbit0.report&&orbit0.report.enabled===true,JSON.stringify(orbit0.report));

  await page.evaluate(()=>{
    const canvas=document.getElementById('game-canvas');
    const fire=(type,x,y,buttons,button=0)=>canvas.dispatchEvent(new PointerEvent(type,{pointerId:17,pointerType:'mouse',clientX:x,clientY:y,button,buttons,bubbles:true,cancelable:true}));
    fire('pointerdown',720,420,1,0);
    fire('pointermove',520,360,1,0);
    fire('pointerup',520,360,0,0);
    for(let i=0;i<24;i++)window.__game.world.groundOrbit.update(1/60,window.__game.world.groundPlayer);
  });
  const orbit1=await page.evaluate(()=>{
    const r=window.__game.world.groundOrbit.report();
    const c=window.__game.camera.position;
    return {report:r,camera:{x:c.x,y:c.y,z:c.z}};
  });
  const orbitMove=Math.hypot(orbit1.camera.x-orbit0.camera.x,orbit1.camera.y-orbit0.camera.y,orbit1.camera.z-orbit0.camera.z);
  check('combined pointer drag changes Orbit yaw',Math.abs(orbit1.report.targetYaw-orbit0.report.targetYaw)>.5,JSON.stringify({before:orbit0.report.targetYaw,after:orbit1.report.targetYaw}));
  check('combined pointer drag moves camera',orbitMove>1,'distance='+orbitMove.toFixed(2));

  await page.evaluate(()=>{
    const canvas=document.getElementById('game-canvas');
    canvas.dispatchEvent(new WheelEvent('wheel',{deltaY:-420,bubbles:true,cancelable:true}));
    for(let i=0;i<24;i++)window.__game.world.groundOrbit.update(1/60,window.__game.world.groundPlayer);
  });
  const orbit2=await page.evaluate(()=>window.__game.world.groundOrbit.report());
  check('combined wheel zoom changes Orbit distance',orbit2.targetDistance<orbit1.report.targetDistance-.2,JSON.stringify({before:orbit1.report.targetDistance,after:orbit2.targetDistance}));

  await keyEvent(page,'keydown','KeyC','c'); await keyEvent(page,'keyup','KeyC','c');
  await page.evaluate(()=>{for(let i=0;i<28;i++)window.__game.world.groundOrbit.update(1/60,window.__game.world.groundPlayer);});
  const orbit3=await page.evaluate(()=>{
    const w=window.__game.world,r=w.groundOrbit.report();
    const expected=((w.groundPlayer.heading+Math.PI+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;
    const diff=Math.atan2(Math.sin(r.targetYaw-expected),Math.cos(r.targetYaw-expected));
    return {targetYaw:r.targetYaw,expected,diff};
  });
  check('combined C recenters Orbit behind actor',Math.abs(orbit3.diff)<.02,JSON.stringify(orbit3));

  await keyEvent(page,'keydown','KeyW','w');
  await page.evaluate(()=>window.__game.advanceBy(.12));
  const gAccel=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('walk accelerates instead of snapping',gAccel.speed>0&&gAccel.speed<g0.walkSpeed*.8,String(gAccel.speed));
  check('forward starts Walking_A',gAccel.currentAnimation==='Walking_A',gAccel.currentAnimation);
  await page.evaluate(()=>window.__game.advanceBy(.70));
  const gWalk=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('walk settles near measured speed',gWalk.speed>g0.walkSpeed*.90&&gWalk.speed<g0.walkSpeed*1.06,String(gWalk.speed));

  await keyEvent(page,'keydown','ShiftLeft','Shift');
  await page.evaluate(()=>window.__game.advanceBy(.16));
  const gRun=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('shift ramp reaches run state before sprint',gRun.currentAnimation==='Running_A'&&gRun.semantic==='run',JSON.stringify({a:gRun.currentAnimation,s:gRun.semantic,v:gRun.speed}));
  await page.evaluate(()=>window.__game.advanceBy(.55));
  const gSprint=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('shift reaches Running_B sprint tier',gSprint.currentAnimation==='Running_B'&&gSprint.semantic==='sprint',JSON.stringify({a:gSprint.currentAnimation,s:gSprint.semantic,v:gSprint.speed}));
  check('sprint speed is materially above run reference',gSprint.speed>g0.runSpeed*1.08,String(gSprint.speed));

  await keyEvent(page,'keyup','ShiftLeft','Shift');
  await page.evaluate(()=>window.__game.advanceBy(.55));
  const gWalk2=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('release decelerates back to walk',gWalk2.currentAnimation==='Walking_A'&&gWalk2.semantic==='walk',JSON.stringify({a:gWalk2.currentAnimation,s:gWalk2.semantic,v:gWalk2.speed}));

  await keyEvent(page,'keyup','KeyW','w');
  await page.evaluate(()=>window.__game.advanceBy(.45));
  await keyEvent(page,'keydown','KeyS','s');
  await page.evaluate(()=>window.__game.advanceBy(.35));
  const gBack=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('backward state is wired',gBack.currentAnimation==='Walking_Backwards'&&gBack.semantic==='backward',JSON.stringify({a:gBack.currentAnimation,s:gBack.semantic}));
  await keyEvent(page,'keyup','KeyS','s');
  await page.evaluate(()=>window.__game.advanceBy(.35));

  await keyEvent(page,'keydown','KeyQ','q');
  await page.evaluate(()=>window.__game.advanceBy(.35));
  const gStrafe=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('left strafe state is wired',gStrafe.currentAnimation==='Running_Strafe_Left'&&gStrafe.semantic==='strafe.left',JSON.stringify({a:gStrafe.currentAnimation,s:gStrafe.semantic}));
  await keyEvent(page,'keyup','KeyQ','q');
  await page.evaluate(()=>window.__game.advanceBy(.4));

  await keyEvent(page,'keydown','KeyW','w');
  await keyEvent(page,'keydown','ShiftLeft','Shift');
  await page.evaluate(()=>window.__game.advanceBy(.65));
  const preJump=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  await keyEvent(page,'keydown','Space',' ');
  await keyEvent(page,'keyup','Space',' ');
  await page.evaluate(()=>window.__game.advanceBy(.10));
  const js=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('jump begins with source Jump_Start',js.currentAnimation==='Jump_Start',js.currentAnimation);
  await page.evaluate(()=>window.__game.advanceBy(.28));
  const air=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  check('jump reaches source Jump_Idle air state',air.currentAnimation==='Jump_Idle'&&air.onGround===false,JSON.stringify({a:air.currentAnimation,g:air.onGround}));
  await page.evaluate(()=>window.__game.advanceBy(.70));
  const postJump=await page.evaluate(()=>window.__game.world.groundPlayer.report());
  const jumpTravel=Math.hypot(postJump.position.x-preJump.position.x,postJump.position.z-preJump.position.z);
  check('jump returns to ground in bounded time',postJump.onGround===true,JSON.stringify({g:postJump.onGround,a:postJump.currentAnimation}));
  check('sprint jump carries useful horizontal travel',jumpTravel>1.4,'distance='+jumpTravel.toFixed(2));
  check('jump recovers to moving locomotion',['Running_A','Running_B','Jump_Land'].includes(postJump.currentAnimation),postJump.currentAnimation);
  await keyEvent(page,'keyup','ShiftLeft','Shift');
  await keyEvent(page,'keyup','KeyW','w');

  await page.screenshot({path:out+'/ground-orbit-integration01.png',fullPage:true});
  check('runtime error collector empty',(await page.evaluate(()=>window.__game.errors())).length===0,JSON.stringify(await page.evaluate(()=>window.__game.errors())));
  check('page/console errors empty',errors.length===0,JSON.stringify(errors));

  const report={base:BASE,checks,errors,testedAt:new Date().toISOString(),initial:g0,walk:gWalk,run:gRun,sprint:gSprint,backward:gBack,strafe:gStrafe,jump:{pre:preJump,start:js,air,post:postJump,travel:jumpTravel}};
  await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));
  console.log('RESULT',checks.filter(c=>c.pass).length+'/'+checks.length,'PASS');
}catch(error){
  await fs.writeFile(out+'/failure.json',JSON.stringify({checks,errors,error:String(error?.stack||error),testedAt:new Date().toISOString()},null,2));
  try{await page.screenshot({path:out+'/failure.png',fullPage:true});}catch{}
  console.error('GROUND_ORBIT_INTEGRATION01_FAIL',error);
  throw error;
}finally{
  await browser.close();
}
