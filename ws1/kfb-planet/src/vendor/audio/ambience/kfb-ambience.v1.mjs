// Vendored aus KFB Audio Site 0.7.6 (kayfabizarro@945518d3 tools/KFB-Audio-Site/dist/ambience/kfb-ambience.v1.mjs, V-458); KFB-Spiel-Patches: moveWaterEmitters, Lazy-Load in start().
// kfb-ambience.v1 — Audio owner. Inject context/buses; host calls tick(). No DOM or clock creation.
export const clamp01=x=>Math.max(0,Math.min(1,Number(x)||0));
export function poissonWait(ratePerMinute,minGap,random=Math.random){if(!(ratePerMinute>0))return Infinity;return minGap-Math.log(Math.max(1e-8,1-clamp01(random())))*60/ratePerMinute;}
export function chooseVariant(ids,last,random=Math.random){const choices=ids.filter(id=>id!==last);return (choices.length?choices:ids)[Math.min((choices.length||ids.length)-1,Math.floor(clamp01(random())*(choices.length||ids.length)))];}
export const thunderDelay=distance=>Math.max(0,Number(distance)||0)/343;
export const PRESETS={
 meadow:{label:'Cozy meadow',day:['meadow-1','meadow-2'],night:['wind-1','wind-2'],pools:{birds:5,crickets:3},water:[]},
 jungle:{label:'Jungle',day:['jungle-1','jungle-2'],night:['jungle-1','jungle-2'],pools:{birds:3,crickets:5,frogs:1},water:[],gaps:['monkeys/wildlife','authentic night bed; morning donor has handling noise']},
 beach:{label:'Beach',day:['wind-1','wind-2'],night:['wind-1','wind-2'],pools:{birds:.7,crickets:.4},water:['wave-1','wave-2','wave-3','wave-4'],gaps:['coastal bird species']},
 forest:{label:'Forest / fir',day:['forest-1','forest-2'],night:['wind-1','wind-2'],pools:{birds:3,crickets:3},water:[],gaps:['fir-specific field recording']},
 pond:{label:'Pond',day:['meadow-1','meadow-2'],night:['pond-1','pond-2'],pools:{birds:2,crickets:2,frogs:4},water:['river']}
};
export async function createAmbience({audioContext:ctx,destinations,manifest,assetBaseUrl=new URL('./',import.meta.url),random=Math.random,onWind=()=>{},onWeather=()=>{},onCue=()=>{},buffers:injectedBuffers}={}){
 if(!ctx||!destinations?.GLOBAL_BED||!destinations?.LOCAL_AMBIENCE)throw Error('Inject existing context and GLOBAL_BED / LOCAL_AMBIENCE buses');
 if(!manifest){const r=await fetch(new URL('licence-register.json',assetBaseUrl));if(!r.ok)throw Error('Missing ambience register');manifest=await r.json();}
 const assets=new Map(manifest.assets.map(a=>[a.id,a])),buffers=new Map(injectedBuffers||[]),decode=[],pending=new Map(),live=new Set(),log=[],last={},slots=new Map(),pools=new Map(),water=new Map(),seen=new Set();
 const groups={},filters={},meter=ctx.createAnalyser();meter.fftSize=1024;const pcm=new Float32Array(1024);
 for(const role of ['GLOBAL_BED','LOCAL_AMBIENCE']){const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=20000;f.connect(destinations[role]);f.connect(meter);filters[role]=f;}
 for(const layer of ['bed','events','weather','wind','water']){const gain=ctx.createGain();gain.gain.value=0;gain.connect(filters[layer==='bed'?'GLOBAL_BED':'LOCAL_AMBIENCE']);groups[layer]=gain;}
 const rainGains={};for(const key of ['rain-light','rain-heavy']){const g=ctx.createGain();g.gain.value=0;g.connect(groups.weather);rainGains[key]=g;}
 let active=false,generation=0,context={biome:'meadow',timeOfDay:'day',weather:'clear',wind:.2},mix={musicActive:false,soundbedActive:false,dialogueActive:false,sidechainLevel:0,hostVoiceDuckDb:0},nextDrift=0,drift=1,lastTick=null,error=null,nextWind=0,windSignal=.2;
 const now=()=>ctx.currentTime;
 function record(e){log.push(e);if(log.length>1500)log.shift();onCue(e);}
 function ramp(param,value,seconds=.8){const t=now();if(param.cancelAndHoldAtTime)param.cancelAndHoldAtTime(t);else{param.cancelScheduledValues(t);param.setValueAtTime(param.value,t);}param.linearRampToValueAtTime(value,t+seconds);}
 async function load(id){if(buffers.has(id))return buffers.get(id);if(pending.has(id))return pending.get(id);const a=assets.get(id);if(!a||!a.sha256||!/^(CC0-1.0|LicenseRef-ChequeredInk-Commercial)$/.test(a.license))throw Error('Uncleared/missing asset '+id);
  const p=(async()=>{let r;try{r=await fetch(new URL(a.file,assetBaseUrl));}catch(e){throw Error('Asset '+id+': '+e.message);}if(!r.ok)throw Error('Missing asset '+id);const bytes=await r.arrayBuffer();const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');if(digest!==a.sha256)throw Error('SHA mismatch '+id);const b=await ctx.decodeAudioData(bytes);buffers.set(id,b);decode.push({id,duration:b.duration,sampleRate:b.sampleRate,channels:b.numberOfChannels});return b;})().finally(()=>pending.delete(id));pending.set(id,p);return p;
 }
 function place(panner,p){panner.panningModel='HRTF';panner.distanceModel='inverse';panner.refDistance=8;panner.maxDistance=2000;panner.rolloffFactor=1;const a=p||{x:0,y:1,z:-8};for(const key of ['x','y','z'])panner['position'+key.toUpperCase()].setValueAtTime(a[key]||0,now());}
 function play(id,{at=now()+.03,layer='events',duration,fade=0.04,position,pitch=false,gain=1,loop=false,epoch=generation,route}={}){
  const b=buffers.get(id);if(!active||!b)return null;if(live.size>=24){record({type:'polyphony-drop',id,at});return null;}const s=ctx.createBufferSource(),env=ctx.createGain();s.buffer=b;s.playbackRate.value=pitch ? .97+random()*.06 : 1;s.loop=loop;
  const rate=s.playbackRate.value,len=duration??(b.duration/rate),offset=loop?random()*b.duration:random()*Math.max(0,b.duration-len*rate-.01);s.connect(env);
  let pan;const destination=route||groups[layer];if(position){pan=ctx.createPanner();place(pan,position);env.connect(pan).connect(destination);}else env.connect(destination);
  const safeFade=Math.min(fade,len/3);env.gain.setValueAtTime(0,at);env.gain.linearRampToValueAtTime(gain,at+safeFade);env.gain.setValueAtTime(gain,at+len-safeFade);env.gain.linearRampToValueAtTime(0,at+len);
  const v={id,s,env,pan,epoch,layer,start:at,end:at+len};live.add(v);s.onended=()=>{live.delete(v);for(const n of [s,env,pan])n?.disconnect();};s.start(at,offset);s.stop(at+len+.01);record({type:layer,id,at,offset,duration:len,rate,position:position||null});return v;
 }
 function release(v,seconds=6){if(!v)return;ramp(v.env.gain,0,seconds);try{v.s.stop(now()+seconds+.02);}catch{}}
 function preset(){return PRESETS[context.biome];}
 function bedIds(){return ['night','evening'].includes(context.timeOfDay)?preset().night:preset().day;}
 function poolRate(pool){const base=preset().pools[pool]||0,t=context.timeOfDay;return base*(pool==='birds'?(t==='morning'?1.5:t==='day'?1:t==='evening'?.3:.03):(t==='night'?1.6:t==='evening'?1:t==='morning'?.3:.12))*(['rain-heavy','thunderstorm','storm'].includes(context.weather)?.25:1);}
 function applyMix(){const side=Math.max(mix.musicActive||mix.soundbedActive?1:0,clamp01(mix.sidechainLevel)),wanted=Math.min(-5*side,mix.dialogueActive?-5:0,mix.combatActive?-6:0),ownDuck=Math.min(0,wanted-(mix.dialogueActive?mix.hostVoiceDuckDb:0)),duck=10**(ownDuck/20),snow=context.weather==='snow'?.7:1;
  const targets={bed:.40*drift,events:.65,weather:.5,wind:.45*context.wind,water:.5};for(const layer of Object.keys(groups))ramp(groups[layer].gain,active?targets[layer]*duck*snow:0,wanted<0?.18:1.2);
  const wet=['rain-light','rain-heavy','thunderstorm'].includes(context.weather),intensity=context.weather==='rain-light'?.2:context.weather==='rain-heavy'?.8:1;
  ramp(rainGains['rain-light'].gain,wet?Math.cos(intensity*Math.PI/2):0,3);ramp(rainGains['rain-heavy'].gain,wet?Math.sin(intensity*Math.PI/2):0,3);
  for(const f of Object.values(filters))ramp(f.frequency,context.weather==='snow'?900:20000,1.5);return {wantedDb:wanted,moduleDuckDb:ownDuck,hostVoiceDuckDb:mix.dialogueActive?mix.hostVoiceDuckDb:0};}
 function runSlot(key,ids,layer,enabled=true,gain=1){if(!enabled||!ids.length){const v=slots.get(key);if(v){release(v.voice,3);slots.delete(key);}return;}
  const slot=slots.get(key);if(slot&&now()<slot.nextAt-.3)return;
  const id=chooseVariant(ids,last[key],random),b=buffers.get(id);if(!b)return;last[key]=id;
  const len=Math.min(b.duration-.05,layer==='bed'?32+random()*8:Math.max(2,b.duration-.1)),fade=Math.min(layer==='bed'?8:4,len/3),at=slot?Math.max(now()+.03,slot.nextAt):now()+.08;
  const voice=play(id,{at,layer,duration:len,fade,gain,route:rainGains[key]});if(voice)slots.set(key,{voice,nextAt:at+len-fade});
 }
 function tick(){if(!active)return;const t=now(),gap=lastTick==null?0:t-lastTick;lastTick=t;
  if(gap>1){for(const s of slots.values())s.nextAt=t+.03;for(const p of pools.values())p.at=t+poissonWait(p.rate,5,random);record({type:'backlog-dropped',at:t,gap});}
  if(t>=nextDrift){drift=.9+random()*.2;nextDrift=t+12+random()*13;applyMix();}
  if(t>=nextWind){nextWind=t+.25;windSignal=context.wind*(.78+.14*Math.sin(t*.31)+.08*Math.sin(t*.79));const side=Math.max(mix.musicActive||mix.soundbedActive?1:0,clamp01(mix.sidechainLevel)),wanted=Math.min(-5*side,mix.dialogueActive?-5:0,mix.combatActive?-6:0),ownDuck=Math.min(0,wanted-(mix.dialogueActive?mix.hostVoiceDuckDb:0));ramp(groups.wind.gain,.45*windSignal*10**(ownDuck/20)*(context.weather==='snow'?.7:1),.25);onWind({value:windSignal,baseValue:context.wind,at:t,source:'kfb-ambience.v1'});}
  runSlot('biome',bedIds(),'bed');runSlot('wind',['wind-1','wind-2'],'wind',context.wind>0);
  const wet=['rain-light','rain-heavy','thunderstorm'].includes(context.weather),intensity=context.weather==='rain-light'?.2:context.weather==='rain-heavy'?.8:1;
  runSlot('rain-light',['rain-1','rain-2'],'weather',wet);runSlot('rain-heavy',['rain-3','rain-4'],'weather',wet);
  for(const pool of ['birds','crickets','frogs']){const rate=poolRate(pool),p=pools.get(pool)||{at:t+poissonWait(rate,5,random),rate};pools.set(pool,p);p.rate=rate;if(t<p.at||!rate)continue;
   const ids=manifest.assets.filter(a=>a.pool===pool).map(a=>a.id),id=chooseVariant(ids,last[pool],random);last[pool]=id;const angle=random()*Math.PI*2,r=6+random()*16;play(id,{pitch:true,position:{x:Math.cos(angle)*r,y:pool==='birds'?2+random()*3:.3,z:Math.sin(angle)*r}});p.at=t+poissonWait(rate,5,random);
  }
  for(const e of water.values()){if(e.nextAt>t)continue;const ids=e.kind==='beach'?['wave-1','wave-2','wave-3','wave-4']:e.kind==='waterfall'?['waterfall']:['river-long'];const id=chooseVariant(ids,e.last,random);e.last=id;const voice=play(id,{layer:'water',position:e.position,duration:Math.min(buffers.get(id)?.duration||2,e.kind==='beach'?15:12),fade:Math.min(1,(buffers.get(id)?.duration||2)/4),loop:e.kind!=='beach'});if(voice?.pan){const d=Math.hypot(e.position.x,e.position.z),low=ctx.createBiquadFilter();low.type='lowpass';low.frequency.value=Math.max(600,12000/(1+d/20));voice.pan.disconnect();voice.pan.connect(low).connect(groups.water);voice.s.onended=()=>{live.delete(voice);for(const n of [voice.s,voice.env,voice.pan,low])n.disconnect();};voice.emitter=e.id;voice.low=low;}e.nextAt=t+(e.kind==='beach'?9+random()*8:Math.max(1,(voice?.end||t+3)-t-1));}
 }
 async function prepare(){let index=0;const worker=async()=>{while(index<manifest.assets.length)await load(manifest.assets[index++].id);};await Promise.all(Array.from({length:4},worker));return snapshot();}
 // KFB-Spiel-Patch (Lazy-Load): zuerst nur, was der aktuelle Kontext hört (Teppich, Wind, Tierstimmen, Regen bei Regen), Rest im Hintergrund
 function needed(){const p=preset(),ids=new Set([...p.day,...p.night,'wind-1','wind-2',...manifest.assets.filter(a=>a.pool&&(p.pools[a.pool]||0)>0).map(a=>a.id)]);if(['rain-light','rain-heavy','thunderstorm'].includes(context.weather))['rain-1','rain-2','rain-3','rain-4','thunder'].forEach(i=>ids.add(i));return [...ids].filter(i=>assets.has(i));}
 async function start(){const g=++generation;await Promise.all(needed().map(load));prepare().catch(e=>{error=String(e?.message||e)});if(g!==generation)return snapshot();active=true;onWeather({snow:context.weather==='snow',at:now()});lastTick=null;nextDrift=now();applyMix();tick();return snapshot();}
 function stop(){generation++;active=false;onWeather({snow:false,at:now()});for(const gain of Object.values(groups)){gain.gain.cancelScheduledValues(now());gain.gain.setValueAtTime(0,now());}for(const v of live)try{v.s.stop();}catch{}live.clear();slots.clear();pools.clear();water.clear();return snapshot();}
 async function setContext(update){const next={...context,...update};if(!PRESETS[next.biome]||!['morning','day','evening','night'].includes(next.timeOfDay)||!['clear','rain-light','rain-heavy','thunderstorm','snow','storm'].includes(next.weather))throw Error('Invalid ambience context');next.wind=clamp01(next.wind);
  const changed=next.biome!==context.biome||next.timeOfDay!==context.timeOfDay,weatherChanged=next.weather!==context.weather;context=next;if(changed){release(slots.get('biome')?.voice,8);slots.delete('biome');pools.clear();}applyMix();if(weatherChanged)onWeather({snow:active&&context.weather==='snow',at:now()});onWind({value:context.wind,at:now(),source:'kfb-ambience.v1'});if(active)tick();return snapshot();}
 function setMix(update){if(Object.keys(update).some(k=>mix[k]!==update[k])){mix={...mix,...update};applyMix();}return snapshot();}
 function setWaterEmitters(emitters){for(const e of emitters)if(!e.id||!['river','beach','waterfall'].includes(e.kind)||!['x','y','z'].every(k=>Number.isFinite(e.position?.[k])))throw Error('Invalid water emitter');for(const v of live)if(v.layer==='water')release(v,1);water.clear();for(const e of emitters)water.set(e.id,{...e,nextAt:now()+.05});}
 // KFB-Spiel-Patch: Quellen mit gleicher id an neue (hörerbezogene) Lage schieben, laufende Stimmen gleiten mit (kein Neustart)
 function moveWaterEmitters(list){const t=now();for(const u of list){const e=water.get(u.id);if(!e||!['x','y','z'].every(k=>Number.isFinite(u.position?.[k])))continue;e.position={...u.position};for(const v of live)if(v.emitter===u.id&&v.pan){for(const k of ['x','y','z'])v.pan['position'+k.toUpperCase()].setTargetAtTime(e.position[k],t,.15);v.low?.frequency.setTargetAtTime(Math.max(600,12000/(1+Math.hypot(e.position.x,e.position.z)/20)),t,.15);}}}
 function emit(e){if(e?.type!=='lightning'||!active)return null;if(!e.id||!Number.isFinite(e.at)||!Number.isFinite(e.distanceM)||e.distanceM<0)throw Error('Lightning requires unique id, context time and nonnegative meters');if(seen.has(e.id))return null;seen.add(e.id);if(seen.size>256)seen.delete(seen.values().next().value);
  const at=e.at+thunderDelay(e.distanceM);if(at<now()-.05){record({type:'late-lightning-dropped',id:e.id,at:now()});return null;}
  const b=buffers.get('thunder'),theta=e.azimuth||0,d=e.distanceM;const v=play('thunder',{at:Math.max(now()+.01,at),layer:'weather',position:{x:Math.sin(theta)*d,y:15,z:-Math.cos(theta)*d},gain:.8});if(v?.pan)v.pan.refDistance=500;
  record({type:'lightning',id:e.id,flashAt:e.at,thunderAt:at,distanceM:d,delaySeconds:thunderDelay(d)});return {id:e.id,flashAt:e.at,thunderAt:at,delaySeconds:thunderDelay(d)};
 }
 function snapshot(){meter.getFloatTimeDomainData(pcm);const side=Math.max(mix.musicActive||mix.soundbedActive?1:0,clamp01(mix.sidechainLevel)),wanted=Math.min(-5*side,mix.dialogueActive?-5:0,mix.combatActive?-6:0);return {schema:'kfb-ambience.v1',active,context:{...context},mix:{...mix},wantedDuckDb:wanted,moduleDuckDb:Math.min(0,wanted-(mix.dialogueActive?mix.hostVoiceDuckDb:0)),moduleCreatedAudioContexts:0,clock:'injected AudioContext.currentTime / host tick',activeSources:live.size,rms:Math.sqrt(pcm.reduce((n,v)=>n+v*v,0)/pcm.length),decode:decode.slice(),loaded:buffers.size,log:log.slice(),gaps:preset().gaps||[],error};}
 function dispose(){stop();for(const g of [...Object.values(groups),...Object.values(rainGains)])g.disconnect();for(const f of Object.values(filters))f.disconnect();meter.disconnect();}
 return {prepare,start,stop,tick,setContext,setMix,setWaterEmitters,moveWaterEmitters,emit,snapshot,dispose};
}
