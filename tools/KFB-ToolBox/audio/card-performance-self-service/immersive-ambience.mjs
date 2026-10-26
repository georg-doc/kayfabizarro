/* KFB Audio · WS0 Immersive Sound R0 · source-isolated Iceberg-inspired tone field
 * Existing KFB Audio Site supplies one AudioContext and a semantic bus destination.
 * Internal design donor: travel/3D Conspiracy Iceberg Explorer/atmo-engine.js.
 * This adapts its slow drone/noise/interval/ping idea, NOT its second AudioContext,
 * master compressor, music clock, timer loop, or optional seven-track bank.
 * SYNTH_ONLY: no animal field recording, no licensed Sound Forge code, no clinical claim.
 */
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,Number(v)||0));
const PALETTES=Object.freeze({
  ICEBERG:{root:55,ratio:1.5,noise:900,body:0.038,color:0.035,sub:0.024},
  ONEIRIC:{root:110,ratio:1.498,noise:2350,body:0.026,color:0.034,sub:0.008},
  ORGANIC_AIR:{root:92.5,ratio:1.334,noise:1480,body:0.012,color:0.012,sub:0.004}
});
const SOURCE='KFB Conspiracy Iceberg Explorer / atmo-engine.js · INTERNAL_ADAPTED';
function noiseBuffer(ctx,seed){
  const frames=Math.round(ctx.sampleRate*11),out=ctx.createBuffer(1,frames,ctx.sampleRate);
  const data=out.getChannelData(0);let x=(seed>>>0)||0x1eafbeef,last=0;
  for(let i=0;i<frames;i++){
    x^=x<<13;x^=x>>>17;x^=x<<5;
    const white=(x>>>0)/2147483648-1;
    last=(last+0.02*white)/1.02;
    data[i]=last*2.8;
  }
  // Short seam smoothing; finite 11-second source, modulation adds longer evolution.
  const n=Math.min(2205,Math.floor(frames/8));
  for(let i=0;i<n;i++){
    const t=i/n;const value=data[i]*(t)+data[frames-n+i]*(1-t);
    data[i]=value;data[frames-n+i]=value;
  }
  return out;
}
export function createImmersiveAmbience({audioContext,destination,seed=0x1cebe49,onChange=()=>{}}={}){
  if(!audioContext||typeof audioContext.createOscillator!=='function')throw new Error('Injected KFB AudioContext required');
  if(!destination||typeof destination.connect!=='function')throw new Error('Existing GLOBAL_BED destination required');
  const ctx=audioContext;let palette='ICEBERG',depth=0.25,g=null,disposed=false,eventCount=0,accentCount=0;
  const notify=()=>{try{onChange(snapshot())}catch{}};
  function snapshot(){return {schema:'kfb.audio.immersive.v0',palette,depth,active:!!g,source:SOURCE,kind:'SYNTH_ONLY',events:eventCount,accents:accentCount,hostMode:'INJECTED_EXISTING_CONTEXT',moduleCreatedAudioContexts:0,usesMusicClock:false};}
  function param(p,value,seconds=1.2){const now=ctx.currentTime;p.cancelScheduledValues(now);p.setTargetAtTime(value,now,Math.max(.02,seconds)/3);}
  function soundGraph(){
    const out=ctx.createGain();out.gain.value=0;out.connect(destination);
    const noise=ctx.createBufferSource();noise.buffer=noiseBuffer(ctx,seed);noise.loop=true;
    const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.Q.value=.7;lp.frequency.value=800;
    const ng=ctx.createGain();ng.gain.value=.105;noise.connect(lp);lp.connect(ng);ng.connect(out);
    const sub=ctx.createOscillator(),body=ctx.createOscillator(),color=ctx.createOscillator(),twin=ctx.createOscillator();
    sub.type='sine';body.type='triangle';color.type='sine';twin.type='sine';
    const sg=ctx.createGain(),bg=ctx.createGain(),cg=ctx.createGain(),tg=ctx.createGain();
    sub.connect(sg);sg.connect(out);body.connect(bg);bg.connect(out);color.connect(cg);cg.connect(out);twin.connect(tg);tg.connect(out);
    const drift=ctx.createOscillator(),driftGain=ctx.createGain(),vib=ctx.createOscillator(),vibGain=ctx.createGain();
    drift.frequency.value=.037;driftGain.gain.value=120;drift.connect(driftGain);driftGain.connect(lp.frequency);
    vib.frequency.value=.083;vibGain.gain.value=12;vib.connect(vibGain);vibGain.connect(color.detune);vibGain.connect(twin.detune);
    const oscillators=[noise,sub,body,color,twin,drift,vib],nodes=[out,noise,lp,ng,sub,body,color,twin,sg,bg,cg,tg,drift,driftGain,vib,vibGain];
    for(const s of oscillators)s.start();
    return {out,lp,sub,body,color,twin,sg,bg,cg,tg,vibGain,oscillators,nodes};
  }
  function update(seconds=1.6){
    if(!g)return;
    const p=PALETTES[palette],d=depth;
    param(g.lp.frequency,p.noise*(1-.74*d),seconds);
    param(g.sub.frequency,p.root*(1-.12*d),seconds);
    param(g.body.frequency,p.root*2,seconds);
    param(g.color.frequency,p.root*2*p.ratio*(1+.028*d),seconds);
    param(g.twin.frequency,p.root*2*p.ratio*(1+.028*d)+(0.16+1.65*d),seconds);
    param(g.sg.gain,p.sub*(0.5+0.5*d),seconds);
    param(g.bg.gain,p.body,seconds);
    param(g.cg.gain,p.color,seconds);
    param(g.tg.gain,p.color*.75,seconds);
    param(g.vibGain.gain,8+15*d,seconds);
  }
  function start(){
    if(disposed)throw new Error('Immersive ambience disposed');
    if(g)return snapshot();
    g=soundGraph();update(.15);param(g.out.gain,.67,.7);eventCount++;notify();return snapshot();
  }
  function stop(){
    if(!g)return snapshot();
    const old=g;g=null;param(old.out.gain,0,.18);
    const end=ctx.currentTime+.9;for(const src of old.oscillators){try{src.stop(end)}catch{}}
    old.oscillators.forEach(src=>{src.onended=()=>{try{src.disconnect()}catch{}}});
    // Disconnect outlet following the fade; never close the host's context.
    old.out.gain.setValueAtTime(0,end);
    const done=()=>{for(const n of old.nodes){try{n.disconnect()}catch{}}};
    old.oscillators[0].onended=done;
    eventCount++;notify();return snapshot();
  }
  function setPalette(value){if(!Object.hasOwn(PALETTES,value))throw new Error('Unknown immersive palette');palette=value;update();eventCount++;notify();return snapshot();}
  function setDepth(value){depth=clamp(value);update();eventCount++;notify();return snapshot();}
  function accent(){
    if(!g||disposed)return false;
    const t=ctx.currentTime,root=PALETTES[palette].root;
    const o=ctx.createOscillator(),volume=ctx.createGain(),flt=ctx.createBiquadFilter();
    o.type='sine';o.frequency.setValueAtTime(root*(5.5-2.3*depth),t);
    o.frequency.exponentialRampToValueAtTime(Math.max(35,root*(3.3-1.2*depth)),t+1.25);
    volume.gain.setValueAtTime(.00001,t);volume.gain.linearRampToValueAtTime(.027,t+.025);
    volume.gain.exponentialRampToValueAtTime(.00001,t+2.6);
    flt.type='lowpass';flt.frequency.value=1600;o.connect(flt);flt.connect(volume);volume.connect(g.out);
    o.onended=()=>{try{o.disconnect();flt.disconnect();volume.disconnect()}catch{}};
    o.start(t);o.stop(t+2.7);accentCount++;notify();return true;
  }
  function dispose(){if(disposed)return;stop();disposed=true;}
  return {start,stop,setPalette,setDepth,accent,dispose,getSnapshot:snapshot};
}
export const IMMERSIVE_PALETTES=Object.freeze(Object.keys(PALETTES));
