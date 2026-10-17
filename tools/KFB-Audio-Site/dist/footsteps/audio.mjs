import {chooseIndex} from './contact-core.mjs';
// Injected host only. No AudioContext, clock, DOM, master or music-ducking ownership here.
export async function createFootstepAudio({audioContext:ctx,destination,rows}){
  if(!ctx||!destination)throw Error('Existing host AudioContext and semantic bus required');
  const output=ctx.createGain();output.gain.value=.65;output.connect(destination);
  const capture=ctx.createMediaStreamDestination();output.connect(capture);
  const banks={},metrics=[],last={},live=new Set();
  for(const row of rows.filter(r=>/^(grass|concrete|gravel|land)-/.test(r.file))){
    const r=await fetch(new URL(`./assets/${row.file}`,import.meta.url));if(!r.ok)throw Error(`Missing source ${row.file}`);
    const b=await ctx.decodeAudioData(await r.arrayBuffer());let peak=0,onset=b.length;
    for(let ch=0;ch<b.numberOfChannels;ch++){const pcm=b.getChannelData(ch);for(let i=0;i<pcm.length;i++)peak=Math.max(peak,Math.abs(pcm[i]));}
    for(let ch=0;ch<b.numberOfChannels;ch++){const pcm=b.getChannelData(ch);for(let i=0;i<pcm.length;i++)if(Math.abs(pcm[i])>peak*.035){onset=Math.min(onset,i);break;}}
    const trim=Math.max(0,onset/b.sampleRate-.004),bank=row.file.split('-')[0];
    (banks[bank]??=[]).push({buffer:b,trim,gain:Math.min(2,.42/Math.max(.01,peak)),file:row.file});
    metrics.push({file:row.file,duration:b.duration,sampleRate:b.sampleRate,channels:b.numberOfChannels,peak,trimSeconds:trim,onsetAfterTrimMs:(onset/b.sampleRate-trim)*1000});
  }
  const scheduled=[];
  function play(cue){
    const bank=cue.kind==='land'?'land':cue.surface;if(!banks[bank]?.length)return null;
    const index=chooseIndex(banks[bank].length,last[bank]??-1);last[bank]=index;const sample=banks[bank][index];
    // Fixed low-mid treatment; cadence is exclusively contact-derived, never sample-length-derived.
    const src=ctx.createBufferSource(),hp=ctx.createBiquadFilter(),low=ctx.createBiquadFilter(),body=ctx.createBiquadFilter(),env=ctx.createGain();
    src.buffer=sample.buffer;src.playbackRate.value=1;hp.type='highpass';hp.frequency.value=45;
    low.type='lowpass';low.frequency.value=bank==='gravel'?1500:2100;low.Q.value=.55;
    body.type='lowshelf';body.frequency.value=190;body.gain.value=2;
    src.connect(hp).connect(low).connect(body).connect(env).connect(output);
    const when=Math.max(ctx.currentTime+.004,cue.time),duration=sample.buffer.duration-sample.trim;
    env.gain.setValueAtTime(0,when);env.gain.linearRampToValueAtTime(sample.gain*(cue.kind==='land'?.85:.58),when+.006);env.gain.setValueAtTime(sample.gain*(cue.kind==='land'?.85:.58),when+Math.max(.007,duration-.035));env.gain.linearRampToValueAtTime(0,when+duration);
    while(live.size>=8){const oldest=live.values().next().value;oldest.stop();live.delete(oldest);}live.add(src);
    src.onended=()=>{live.delete(src);for(const node of [src,hp,low,body,env])node.disconnect();};src.start(when,sample.trim);src.stop(when+duration+.01);
    const record={...cue,file:sample.file,scheduled:when,driftMs:(when-cue.time)*1000,onsetDriftMs:(when-cue.time)*1000+metrics.find(m=>m.file===sample.file).onsetAfterTrimMs};scheduled.push(record);if(scheduled.length>3000)scheduled.shift();return record;
  }
  return {play,metrics,scheduled,capture,output,stop(){for(const s of live)s.stop();live.clear();},dispose(){this.stop();output.disconnect();}};
}
