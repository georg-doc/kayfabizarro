// Vendored 1:1 aus KFB Audio Site 0.7.6 (kayfabizarro@945518d3 tools/KFB-Audio-Site/dist/footsteps/audio.mjs); KFB-Spiel-Patch: Import ohne ?v, assetBaseUrl, surfaces, paralleles Laden.
import {chooseIndex} from './contact-core.mjs';
import {shapePCM} from './sample-shape.mjs'; // KFB-Spiel: ohne ?v=0.7.6 (Vite)
// Injected host only. No context creation, DOM, timers or music ownership.
export const SURFACES={
 sand:{prefix:'footstep_snow_',cutoff:620,tail:.28,gain:.78,attack:.032},
 stone:{prefix:'footstep_concrete_',cutoff:950,tail:.19,gain:.72},
 wood:{prefix:'footstep_wood_',cutoff:780,tail:.22,gain:.72},
 'wet-clay':{prefix:'grass-',cutoff:450,tail:.24,gain:.5,attack:.024,levelDb:-6},
 'carpet-wood':{prefix:'footstep_wood_',cutoff:580,highpass:110,tail:.19,attack:.028,levelDb:-3},
 'foley-carpet':{prefix:'foley_footstep_carpet_',cutoff:900,tail:.28,attack:.022,count:4,imported:true,levelDb:-2},
 'foley-concrete':{prefix:'foley_footstep_concrete_',cutoff:950,tail:.22,attack:.016,count:4,imported:true,levelDb:-2},
 'foley-gravel':{prefix:'foley_footstep_gravel_',cutoff:1100,tail:.30,attack:.018,count:4,imported:true,levelDb:-2},
 'foley-vinyl':{prefix:'foley_footstep_vinyl_',cutoff:850,tail:.24,attack:.018,count:4,imported:true,levelDb:-2},
 'digital-grass':{prefix:'digital_footstep_grass_',cutoff:1100,tail:.25,attack:.018,count:4,imported:true,levelDb:-4},
 'digital-gravel':{prefix:'digital_footstep_gravel_',cutoff:1100,tail:.25,attack:.018,count:4,imported:true,levelDb:-4},
 'digital-snow':{prefix:'digital_footstep_snow_',cutoff:1000,tail:.25,attack:.020,count:4,imported:true,levelDb:-4},
 'digital-wood':{prefix:'digital_footstep_wood_',cutoff:900,tail:.25,attack:.020,count:4,imported:true,levelDb:-4},
 creak:{prefix:'foley_creak_',cutoff:1200,tail:.5,attack:.025,count:1,imported:true,levelDb:-6,role:'accent'}
};
export async function createFootstepAudio({audioContext:ctx,destination,rows,assetBaseUrl=new URL('./',import.meta.url),surfaces}){ // KFB-Spiel: assetBaseUrl + surfaces (Teilmenge) injizierbar
 if(!ctx||!destination)throw Error('Existing host AudioContext and semantic bus required');
 const output=ctx.createGain();output.gain.value=0;output.connect(destination);
 const capture=ctx.createMediaStreamDestination(),captureDelay=ctx.createDelay(.5);output.connect(captureDelay).connect(capture);
 const meter=ctx.createAnalyser();meter.fftSize=1024;output.connect(meter);const meterPCM=new Float32Array(1024);let armed=false;
 const banks={},metrics=[],last={},live=new Set(),scheduled=[];
 // KFB-Spiel-Patch: alle Dateien gleichzeitig holen und dekodieren (vorher nacheinander), Formen wie gehabt der Reihe nach
 const want=Object.entries(SURFACES).filter(([id])=>!surfaces||surfaces.includes(id)),fetched=new Map();
 await Promise.all(want.flatMap(([,config])=>rows.filter(r=>r.file.startsWith(config.prefix)).map(async row=>{const r=await fetch(new URL('assets/'+(config.imported?'imported/':'')+row.file,assetBaseUrl));if(!r.ok)throw Error('Missing '+row.file);fetched.set(row.file,await ctx.decodeAudioData(await r.arrayBuffer()));})));
 try{for(const [surface,config] of want){
  banks[surface]=[];
  for(const row of rows.filter(r=>r.file.startsWith(config.prefix))){
   const b=fetched.get(row.file);let peak=0,onset=b.length;
   for(let ch=0;ch<b.numberOfChannels;ch++)for(const v of b.getChannelData(ch))peak=Math.max(peak,Math.abs(v));
   for(let ch=0;ch<b.numberOfChannels;ch++){const pcm=b.getChannelData(ch);for(let i=0;i<pcm.length;i++)if(Math.abs(pcm[i])>peak*.035){onset=Math.min(onset,i);break;}}
   const trim=config.imported?Math.max(0,onset/b.sampleRate-.002):0;
   const shaped=shapePCM(Array.from({length:b.numberOfChannels},(_,ch)=>b.getChannelData(ch).subarray(Math.floor(trim*b.sampleRate))),b.sampleRate,config),processed=ctx.createBuffer(b.numberOfChannels,shaped.channels[0].length,b.sampleRate);
   shaped.channels.forEach((pcm,ch)=>processed.copyToChannel(pcm,ch));
   banks[surface].push({buffer:processed,trim:0,gain:1,onset:shaped.onsetSeconds,file:row.file});
   metrics.push({surface,file:row.file,duration:b.duration,sampleRate:b.sampleRate,peak,trimSeconds:trim,onsetAfterTrimMs:shaped.onsetSeconds*1000,processedRms:shaped.rms,processedPeak:shaped.peak,levelDb:config.levelDb||0});
  }
  if(banks[surface].length!==(config.count||5))throw Error('Unexpected variant count: '+surface);
 }}catch(e){output.disconnect();capture.disconnect();throw e;}
 function stop(){armed=false;output.gain.cancelScheduledValues(ctx.currentTime);output.gain.setValueAtTime(0,ctx.currentTime);for(const s of live)try{s.stop();}catch{}live.clear();}
 function play(cue){
  const bank=cue.surface,config=SURFACES[bank];if(!armed||!config)return null;
  const index=chooseIndex(banks[bank].length,last[bank]??-1);last[bank]=index;const sample=banks[bank][index];
  const src=ctx.createBufferSource(),env=ctx.createGain();
  const rate=.97+Math.random()*.06;src.buffer=sample.buffer;src.playbackRate.value=rate;
  src.connect(env).connect(output);
  const attack=config.attack||.01,lead=sample.onset/rate;
  const when=Math.max(ctx.currentTime,cue.time-lead),duration=Math.min(config.tail,(sample.buffer.duration-sample.trim)/rate);
  const gain=(.96+Math.random()*.04)*(cue.kind==='land'?1.1:1);
  env.gain.setValueAtTime(gain,when);
  while(live.size>=4){const s=live.values().next().value;try{s.stop();}catch{}live.delete(s);}live.add(src);
  src.onended=()=>{live.delete(src);for(const n of [src,env])n.disconnect();};src.start(when,sample.trim);src.stop(when+duration+.002);
  const record={...cue,file:sample.file,pitchRate:rate,scheduled:when,estimatedOnsetAt:when+lead,onsetEstimateErrorMs:(when+lead-cue.time)*1000,late:ctx.currentTime>cue.time-lead,driftMs:(when-cue.time)*1000,renderToScheduleMs:(when-cue.renderedAt)*1000,attackMs:attack*1000,outputPeakCeiling:gain*.06};
  scheduled.push(record);if(scheduled.length>3000)scheduled.shift();return record;
 }
 return {play,stop,metrics,scheduled,capture,output,arm(){armed=true;output.gain.setValueAtTime(.5,ctx.currentTime);},setCaptureDelay(seconds){captureDelay.delayTime.value=Math.max(0,Math.min(.45,seconds));},state(){meter.getFloatTimeDomainData(meterPCM);return {armed,activeSources:live.size,rms:Math.sqrt(meterPCM.reduce((n,v)=>n+v*v,0)/meterPCM.length)};},dispose(){stop();output.disconnect();captureDelay.disconnect();meter.disconnect();}};
}

