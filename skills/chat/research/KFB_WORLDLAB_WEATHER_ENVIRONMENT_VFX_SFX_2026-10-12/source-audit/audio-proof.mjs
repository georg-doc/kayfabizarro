import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const dir='kfb-worldlab-audio-rain-evidence';
fs.mkdirSync(dir,{recursive:true});
const rainPath='media/3D_Assets/Audio/Environment/_source_audit_cc0_rain.ogg';
const report={schema:'kfb.worldlab.rain-audio-existing-mixer/0.1',status:'RUNNING',checks:[],rainOrigin:'https://opengameart.org/content/rain-loopable',rainAuthor:'Ylmir',rainLicense:'CC0 per source item',rainPersistedToRepository:false,sourceMixer:'kfb-hub/stage/audio-calibration/audio-calibration.js',audioListening:'NOT_RUN',errors:[],notRun:['actual human listening','product audio acceptance','live Game/World audio integration']};
const check=(n,pass,d)=>{report.checks.push({name:n,pass:!!pass,details:d??null});if(!pass)throw Error(n+': '+JSON.stringify(d));};
let browser,page;
try{
  if(!fs.existsSync(rainPath)){
    report.status='SOURCE_REQUIRED_EXTERNAL_ARCHIVE_UNAVAILABLE';
    report.failure='Rain OGG not downloaded from OpenGameArt. No substitute generated.';
  } else {
    const b=fs.readFileSync(rainPath),sha=crypto.createHash('sha256').update(b).digest('hex');
    report.rainFile={path:rainPath,bytes:b.length,sha256:sha};
    check('Actual external rain bytes and OggS header',b.length>15000&&b.subarray(0,4).toString()==='OggS',{bytes:b.length,sha256:sha});
    check('Existing KFB Audio calibration source unchanged',fs.readFileSync('kfb-hub/stage/audio-calibration/audio-calibration.js','utf8').includes('window.__KFB_AUDIO_CAL__'));
    browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});
    page=await browser.newPage({viewport:{width:1200,height:800}});
    page.on('pageerror',e=>report.errors.push(String(e)));
    page.on('response',r=>{if(r.status()>=400)report.errors.push(r.status()+' '+r.url())});
    const manifest=JSON.parse(fs.readFileSync('kfb-hub/stage/audio-calibration/SOURCE.json','utf8'));
    const originalWind=manifest.assets.wind.path;
    check('Existing calibration manifest maps wind to original KFB ambience',originalWind==='media/3D_Assets/Audio/Environment/ambient_wind.wav',originalWind);
    manifest.assets.wind.path=rainPath;
    report.fixtureAdapter={role:'GLOBAL_BED/wind input replaced with downloaded CC0 rain for test only',originalWind,ephemeralRain:rainPath};
    await page.route('**/kfb-hub/stage/audio-calibration/SOURCE.json',async route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(manifest)}));
    await page.goto('http://127.0.0.1:8766/kfb-hub/stage/audio-calibration/',{waitUntil:'load',timeout:90000});
    await page.waitForFunction(()=>!!window.__KFB_AUDIO_CAL__,{timeout:30000});
    const before=await page.evaluate(()=>window.__KFB_AUDIO_CAL__.startAudio());
    await page.waitForTimeout(900);
    const s0=await page.evaluate(()=>window.__KFB_AUDIO_CAL__.snapshot());
    check('Existing owner started one AudioContext',s0.ready&&s0.contextCount===1&&s0.contextState==='running',s0);
    check('Rain downloaded and decoded by existing KFB mixer',s0.activeLoops>=1&&!s0.loadErrors.some(x=>x.includes('_source_audit_cc0_rain.ogg')),{loaded:s0.loaded,loops:s0.activeLoops,errors:s0.loadErrors});
    check('Audio mix actively routes GLOBAL_BED',s0.gains.ambienceBus>0.2,s0.gains);
    const t0=s0.musicTime;
    await page.evaluate(()=>window.__KFB_AUDIO_CAL__.voiceFocus(true));
    await page.waitForTimeout(1100);
    const s1=await page.evaluate(()=>window.__KFB_AUDIO_CAL__.snapshot());
    check('Existing voice focus ducks the rain ambience bus',s1.ducked&&s1.gains.ambienceBus<s0.gains.ambienceBus*0.88,{baseline:s0.gains.ambienceBus,ducked:s1.gains.ambienceBus});
    check('Single AudioContext is retained when ducked',s1.contextCount===1,s1.contextCount);
    check('Music timeline not paused for voice',s1.musicTime>t0+0.2,{before:t0,after:s1.musicTime,paused:s1.musicPaused});
    await page.screenshot({path:path.join(dir,'rain-via-existing-audio-duck.png'),fullPage:true});
    await page.evaluate(()=>window.__KFB_AUDIO_CAL__.voiceFocus(false));
    await page.waitForTimeout(1300);
    const s2=await page.evaluate(()=>window.__KFB_AUDIO_CAL__.snapshot());
    check('Existing ambience recovers after voice',!s2.ducked&&s2.gains.ambienceBus>s1.gains.ambienceBus+0.10,{ducked:s1.gains.ambienceBus,recovered:s2.gains.ambienceBus});
    const slider=page.locator('input[data-bus="ambience"]');
    check('Original ambience bus slider exists',await slider.count()===1);
    await slider.fill('0');
    // Existing owner uses setTargetAtTime(tau=.38s); allow >6 time constants before asserting near-silence.
    await page.waitForTimeout(2500);
    const mute=await page.evaluate(()=>window.__KFB_AUDIO_CAL__.snapshot());
    check('Original audio owner ambience mute drops gain',mute.gains.ambienceBus<0.01,mute.gains.ambienceBus);
    check('No browser source errors',report.errors.length===0,report.errors);
    report.measurements={before:s0,duck:s1,recovered:s2,muted:mute};
    report.status='RUNTIME_MIX_DUCK_MUTE_PASS__HUMAN_LISTEN_NOT_RUN';
  }
}catch(e){report.status='FAIL';report.failure=String(e.stack||e);process.exitCode=1;}
finally{
  report.summary={passed:report.checks.filter(x=>x.pass).length,total:report.checks.length};
  fs.writeFileSync(path.join(dir,'results.json'),JSON.stringify(report,null,2));
  if(page&&report.status==='FAIL')await page.screenshot({path:path.join(dir,'failure.png'),fullPage:true}).catch(()=>{});
  await browser?.close();
  console.log(JSON.stringify({status:report.status,summary:report.summary,source:report.rainFile||null,errors:report.errors}));
}
