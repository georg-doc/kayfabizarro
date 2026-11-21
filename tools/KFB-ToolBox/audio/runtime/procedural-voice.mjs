/** KFB Audio Web Audio voice; host owns AudioContext, MusicClock, SCORE and ducking. */
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const hz=pitch=>440*Math.pow(2,(pitch-69)/12);
const cache=new WeakMap();
function karplusBuffer(ctx,pitch) {
  let pitches=cache.get(ctx);
  if(!pitches) { pitches=new Map(); cache.set(ctx,pitches); }
  if(pitches.has(pitch)) return pitches.get(pitch);
  const sampleRate=ctx.sampleRate,period=Math.max(2,Math.round(sampleRate/hz(pitch)));
  const count=Math.floor(sampleRate*1.4);
  const buffer=ctx.createBuffer(1,count,sampleRate),arr=buffer.getChannelData(0);
  let seed=((pitch+1)*2654435761)>>>0;
  for(let i=0;i<period&&i<count;i++) {
    seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;
    arr[i]=(seed>>>0)/2147483648-1;
  }
  for(let i=period;i<count;i++) {
    arr[i]=(arr[i-period]+arr[Math.max(0,i-period+1)])*0.493;
  }
  pitches.set(pitch,buffer);
  return buffer;
}
/**
 * Schedule one note with a precomputed AudioContext timestamp from the host clock.
 * The host handles lookahead/voice caps/score bus. No separate transport is created.
 */
export function scheduleProceduralNote(ctx,destination,note,atTime,bpm) {
  if(!ctx||!destination||!Number.isFinite(atTime)||!Number.isFinite(bpm)||bpm<=0)
    throw new TypeError('injected context/destination/time/bpm required');
  const start=Math.max(atTime,ctx.currentTime+0.002);
  const seconds=clamp((note.length||2)*60/bpm/4,0.025,12);
  const end=start+seconds+0.2;
  const out=ctx.createGain();
  out.gain.setValueAtTime(0.0001,start);
  out.gain.exponentialRampToValueAtTime(clamp(note.velocity||0.1,0.005,0.6),start+0.012);
  out.gain.exponentialRampToValueAtTime(0.0001,start+seconds+0.15);
  out.connect(destination);
  if(note.voice==='pluck'||note.voice==='kalimba') {
    const source=ctx.createBufferSource();
    source.buffer=karplusBuffer(ctx,note.pitch);
    source.connect(out);
    source.onended=()=>{source.disconnect();out.disconnect();};
    source.start(start);source.stop(end);
  } else if(['marimba','steelpan','musicbox'].includes(note.voice)) {
    const ratios=note.voice==='marimba'?[1,3.96,9.21]:
      note.voice==='steelpan'?[1,2.01,2.93]:[1,2.01,4.03];
    let pending=ratios.length;
    ratios.forEach((ratio,i)=>{
      const osc=ctx.createOscillator(),volume=ctx.createGain();
      osc.type='sine';osc.frequency.value=hz(note.pitch)*ratio;
      volume.gain.value=[0.75,0.18,0.07][i];
      osc.connect(volume);volume.connect(out);
      osc.onended=()=>{
        osc.disconnect();volume.disconnect();if(--pending===0)out.disconnect();
      };
      osc.start(start);osc.stop(end);
    });
  } else if(note.voice==='fm-bass') {
    const carrier=ctx.createOscillator(),mod=ctx.createOscillator(),depth=ctx.createGain();
    carrier.type='sine';carrier.frequency.value=hz(note.pitch-12);
    mod.type='sine';mod.frequency.value=hz(note.pitch-12)*2;
    depth.gain.setValueAtTime(75,start);
    depth.gain.exponentialRampToValueAtTime(0.01,end);
    mod.connect(depth);depth.connect(carrier.frequency);carrier.connect(out);
    carrier.onended=()=>{carrier.disconnect();mod.disconnect();depth.disconnect();out.disconnect();};
    mod.start(start);carrier.start(start);mod.stop(end);carrier.stop(end);
  } else {
    const osc=ctx.createOscillator();
    osc.type=note.voice==='saw'?'sawtooth':'sine';
    osc.frequency.value=hz(note.pitch);
    osc.connect(out);
    osc.onended=()=>{osc.disconnect();out.disconnect();};
    osc.start(start);osc.stop(end);
  }
  return {scheduledAt:start,endsAt:end};
}
