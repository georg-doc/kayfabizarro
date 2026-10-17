import {chooseIndex} from './contact-core.mjs';
// Injected host only. No context creation, DOM, timers or music ownership.
export const SURFACES={
 sand:{prefix:'footstep_snow_',cutoff:1100,tail:.24,gain:.78},
 stone:{prefix:'footstep_concrete_',cutoff:950,tail:.19,gain:.72},
 wood:{prefix:'footstep_wood_',cutoff:780,tail:.22,gain:.72},
 'wet-clay':{prefix:'grass-',cutoff:650,tail:.24,gain:.85}
};
export async function createFootstepAudio({audioContext:ctx,destination,rows}){
 if(!ctx||!destination)throw Error('Existing host AudioContext and semantic bus required');
 const output=ctx.createGain();output.gain.value=.5;output.connect(destination);
 const capture=ctx.createMediaStreamDestination();output.connect(capture);
 const banks={},metrics=[],last={},live=new Set(),scheduled=[];
 try{for(const [surface,config] of Object.entries(SURFACES)){
  banks[surface]=[];
  for(const row of rows.filter(r=>r.file.startsWith(config.prefix))){
   const r=await fetch(new URL('./assets/'+row.file,import.meta.url));if(!r.ok)throw Error('Missing '+row.file);
   const b=await ctx.decodeAudioData(await r.arrayBuffer());let peak=0,onset=b.length;
   for(let ch=0;ch<b.numberOfChannels;ch++)for(const v of b.getChannelData(ch))peak=Math.max(peak,Math.abs(v));
   for(let ch=0;ch<b.numberOfChannels;ch++){const pcm=b.getChannelData(ch);for(let i=0;i<pcm.length;i++)if(Math.abs(pcm[i])>peak*.035){onset=Math.min(onset,i);break;}}
   const trim=Math.max(0,onset/b.sampleRate-.002);
   banks[surface].push({buffer:b,trim,gain:Math.min(1,.11/Math.max(.01,peak)),file:row.file});
   metrics.push({surface,file:row.file,duration:b.duration,sampleRate:b.sampleRate,peak,trimSeconds:trim,onsetAfterTrimMs:(onset/b.sampleRate-trim)*1000});
  }
  if(banks[surface].length!==5)throw Error('Exactly five donors required: '+surface);
 }}catch(e){output.disconnect();capture.disconnect();throw e;}
 function stop(){for(const s of live)try{s.stop();}catch{}live.clear();}
 function play(cue){
  const bank=cue.surface,config=SURFACES[bank];if(!config)return null;
  const index=chooseIndex(banks[bank].length,last[bank]??-1);last[bank]=index;const sample=banks[bank][index];
  const src=ctx.createBufferSource(),hp=ctx.createBiquadFilter(),low=ctx.createBiquadFilter(),env=ctx.createGain();
  const rate=.97+Math.random()*.06;src.buffer=sample.buffer;src.playbackRate.value=rate;
  hp.type='highpass';hp.frequency.value=65;low.type='lowpass';low.frequency.value=config.cutoff;low.Q.value=.5;
  src.connect(hp).connect(low).connect(env).connect(output);
  const when=ctx.currentTime,duration=Math.min(config.tail,(sample.buffer.duration-sample.trim)/rate);
  const gain=sample.gain*config.gain*(.88+Math.random()*.12)*(cue.kind==='land'?1.15:1);
  env.gain.setValueAtTime(0,when);env.gain.linearRampToValueAtTime(gain,when+.01);
  env.gain.exponentialRampToValueAtTime(Math.max(.0001,gain*.24),when+duration*.55);env.gain.linearRampToValueAtTime(0,when+duration);
  while(live.size>=4){const s=live.values().next().value;try{s.stop();}catch{}live.delete(s);}live.add(src);
  src.onended=()=>{live.delete(src);for(const n of [src,hp,low,env])n.disconnect();};src.start(when,sample.trim);src.stop(when+duration+.002);
  const record={...cue,file:sample.file,pitchRate:rate,scheduled:when,driftMs:(when-cue.time)*1000,renderToScheduleMs:(when-cue.renderedAt)*1000,attackMs:10,outputPeakCeiling:gain*.5};
  scheduled.push(record);if(scheduled.length>3000)scheduled.shift();return record;
 }
 return {play,stop,metrics,scheduled,capture,output,dispose(){stop();output.disconnect();}};
}

