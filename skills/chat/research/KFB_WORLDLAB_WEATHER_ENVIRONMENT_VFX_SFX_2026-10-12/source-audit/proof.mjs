import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const base='http://127.0.0.1:8765/';
const root='skills/chat/research/KFB_WORLDLAB_WEATHER_ENVIRONMENT_VFX_SFX_2026-10-12/source-audit/';
const url=base+root+'index.html';
const proofDir=process.env.KFB_PROOF_DIR||'kfb-worldlab-weather-source-evidence';
fs.mkdirSync(proofDir,{recursive:true});
const results={schema:'kfb.worldlab.weather-source/0.1',sourceBranch:'research/kfb-worldlab-weather-environment-vfx-sfx-2026-10-12',githubHead:process.env.KFB_SOURCE_HEAD||'UNKNOWN',status:'RUNNING',checks:[],metrics:{},pageErrors:[],httpErrors:[],notRun:['rain SFX decoded/loop tested with current audio mixer','speech duck/mute listening','Clay visual integration/approval','target GPU FPS/performance','human visual/audio acceptance']};
function check(name,condition,details=null){results.checks.push({name,pass:!!condition,details});if(!condition)throw Error(name+': '+JSON.stringify(details))}
const donors=[
 ['SKY3 EnvironmentHost','tools/KFB-ToolBox/_inbox/KFB Skydome Gates SKY3/KFB_SKYDOME_SKY3_SESSION_CUT_2026-10-01_r1/lab-sky/env-host.v3.js','70579123889d86b1b8a39748ee6ede4d0bcaad98'],
 ['Original Travel rain','tools/KFB-ToolBox/_inbox/KFB Skydome Gates SKY3/KFB_SKYDOME_SKY3_SESSION_CUT_2026-10-01_r1/travel/globe-v13/rain-overlay.js','679defc912b2648a04778a3154ed9c0553dee30f'],
 ['Kenney source sprite','media/3D_Assets/FX_Visual/kenney_smoke-particles/PNG/White puff/whitePuff00.png','52d2a79863b06669c0a77556602fdb139039267e'],
 ['Original wind WAV','media/3D_Assets/Audio/Environment/ambient_wind.wav','9e259a43528d292cf2d61796893df9b2ddb80eb6'],
];
let browser,page;
try{
  for(const [name,source,sha] of donors){
    const b=fs.existsSync(source)?execFileSync('git',['hash-object',source],{encoding:'utf8'}).trim():'MISSING';
    check('Real source pin '+name,b===sha,{path:source,expected:sha,actual:b});
  }
  // A real KFB WAV source is present, but it is WIND and cannot count as a rain sound.
  check('Original KFB wind WAV has RIFF/WAVE header',(()=>{const b=fs.readFileSync(donors[3][1]);return b.subarray(0,4).toString()==='RIFF'&&b.subarray(8,12).toString()==='WAVE'})());
  browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
  page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});
  page.on('pageerror',e=>results.pageErrors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')results.pageErrors.push(m.text())});
  page.on('response',r=>{if(r.status()>=400)results.httpErrors.push({url:r.url(),status:r.status()})});
  await page.goto(url,{waitUntil:'load',timeout:90000});
  await page.waitForFunction(()=>{const p=window.__KFB_WORLDLAB_SOURCE_AUDIT__;return p&&(p.ready||p.error)},{timeout:60000});
  const init=await page.evaluate(()=>{const p=window.__KFB_WORLDLAB_SOURCE_AUDIT__;return {ready:p.ready,error:p.error,snapshot:p.ready?p.snapshot():null}});
  check('Original EnvironmentHost booted in browser',init.ready,init.error);
  const vfx=await page.evaluate(()=>window.__KFB_WORLDLAB_SOURCE_AUDIT__.sourceIsolate());
  check('Original Kenney sprite visibly loaded in isolated source view',vfx.loaded&&vfx.width>0,vfx);
  await page.screenshot({path:path.join(proofDir,'source-dry.png'),fullPage:true});
  const dry=await page.evaluate(()=>window.__KFB_WORLDLAB_SOURCE_AUDIT__.step('clear',420));
  check('Dry initial source weather is clear',dry.weather==='clear'&&dry.rain===0,dry);
  check('No second opaque sky shell',dry.opaqueShells<=1,dry);
  check('Original fog instance persists',dry.fogReferenceStable===true,dry);
  const rain=await page.evaluate(()=>window.__KFB_WORLDLAB_SOURCE_AUDIT__.step('rain',120));
  results.metrics.rainFirst={weight:rain.rain,streaks:rain.rainStreaks,revision:rain.rendererRevision};
  check('Rain source transitions to active',rain.weather==='rain'&&rain.rain>0.70&&rain.rainStreaks>0,rain);
  check('Real original rain overlay is used',rain.originalRain==='rain-overlay',rain.originalRain);
  await page.screenshot({path:path.join(proofDir,'source-rain.png'),fullPage:true});
  const recovered=await page.evaluate(()=>window.__KFB_WORLDLAB_SOURCE_AUDIT__.step('clear',420));
  check('Original rain layer recovers to dry',recovered.weather==='clear'&&recovered.rain===0&&recovered.rainStreaks===0,recovered);
  const replay=await page.evaluate(()=>window.__KFB_WORLDLAB_SOURCE_AUDIT__.step('rain',120));
  check('Fixed dt rain intensity can be replayed',(Math.abs(replay.rain-rain.rain)<1e-10),{first:rain.rain,replay:replay.rain});
  check('Rain source never took over fog/opaque sky',replay.fogReferenceStable&&replay.opaqueShells<=1,replay);
  await page.locator('#vfx-isolate').screenshot({path:path.join(proofDir,'source-vfx-isolated.png')});
  const sound=await page.evaluate(()=>{const a=document.getElementById('wind-source');return {src:a.currentSrc,readyState:a.readyState,duration:a.duration}});
  results.metrics.existingWind=sound;
  check('Browser received original KFB wind audio metadata',sound.readyState>=1&&Number.isFinite(sound.duration)&&sound.duration>0,sound);
  check('No page errors',results.pageErrors.length===0,results.pageErrors);
  check('No HTTP errors',results.httpErrors.length===0,results.httpErrors);
  results.status='SOURCE_A_AND_C_PASS__B_RAIN_AND_MIX_NOT_RUN';
}catch(e){
  results.status='FAIL';results.failure=String(e.stack||e);
  process.exitCode=1;
}finally{
  results.summary={passed:results.checks.filter(x=>x.pass).length,total:results.checks.length,screenshots:fs.readdirSync(proofDir).filter(x=>x.endsWith('.png'))};
  fs.writeFileSync(path.join(proofDir,'results.json'),JSON.stringify(results,null,2));
  if(page&&results.status==='FAIL')await page.screenshot({path:path.join(proofDir,'failure.png'),fullPage:true}).catch(()=>{});
  await browser?.close();
  console.log(JSON.stringify(results.summary));console.log(results.status);if(results.failure)console.error(results.failure);
}
