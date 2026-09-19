import {raw,readExact,clamp} from './sources.mjs';
// One music source, one AudioContext. Race owns all gameplay truth.
// Default BOX1 stays on the canonical repository Jukebox. RoadTrip v2 is opt-in Stage.
// SFX are short read-only presentation accents from the existing KFB audio library.
const ROADTRIP_PIN='f2f24085ed285894864731ffe27047ef24b5ab7d';
const ROADTRIP_ROOT='media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/';
const ROADTRIP_V2=Object.freeze([
  {id:'roadtrip_checkpoint_rush_a',title:'RoadTrip v2 · Checkpoint Rush A',file:ROADTRIP_ROOT+'Checkpoint Rush A.mp3',loop:true,pin:ROADTRIP_PIN,collection:'roadtrip-v2',blob:'318a248a47639f414a820352764ed4dc46924c7b'},
  {id:'roadtrip_checkpoint_rush_b',title:'RoadTrip v2 · Checkpoint Rush B',file:ROADTRIP_ROOT+'Checkpoint Rush B.mp3',loop:true,pin:ROADTRIP_PIN,collection:'roadtrip-v2',blob:'5fde6bca3c025c4ff132c76ce1277d4267ad9d18'},
  {id:'roadtrip_final_lap_lift_a',title:'RoadTrip v2 · Final Lap Lift A',file:ROADTRIP_ROOT+'Final Lap Lift A.mp3',loop:true,pin:ROADTRIP_PIN,collection:'roadtrip-v2',blob:'208fa9c909dc0366e207ccd2747594b2ecdd4943'},
  {id:'roadtrip_final_lap_lift_b',title:'RoadTrip v2 · Final Lap Lift B',file:ROADTRIP_ROOT+'Final Lap Lift B.mp3',loop:true,pin:ROADTRIP_PIN,collection:'roadtrip-v2',blob:'39d16a3f6339895efe9d88d992fe154ce52c3546'},
  {id:'roadtrip_shepards_coaster_01',title:'RoadTrip v2 · Shepards Coaster 01',file:ROADTRIP_ROOT+'KFB Shepards_Coaster 01.mp3',loop:true,pin:ROADTRIP_PIN,collection:'roadtrip-v2',blob:'5b031c2252e07b515ca0d3a3eff3546c27143f42'},
  {id:'roadtrip_shepards_coaster_02',title:'RoadTrip v2 · Shepards Coaster 02',file:ROADTRIP_ROOT+'KFB Shepards_Coaster 02.mp3',loop:true,pin:ROADTRIP_PIN,collection:'roadtrip-v2',blob:'c3d0a8f8887b67da8802d9a582e4eccaa9e9816e'},
  {id:'roadtrip_night_circuit_runner_a',title:'RoadTrip v2 · Night Circuit Runner A',file:ROADTRIP_ROOT+'Night Circuit Runner.mp3',loop:true,pin:ROADTRIP_PIN,collection:'roadtrip-v2',blob:'f1f573db8cf2f8359acc124d2cc85be8a578df74'},
  {id:'roadtrip_night_circuit_runner_b',title:'RoadTrip v2 · Night Circuit Runner B',file:ROADTRIP_ROOT+'Night Circuit Runner B.mp3',loop:true,pin:ROADTRIP_PIN,collection:'roadtrip-v2',blob:'2e10fb6e1b0d8c89a8f5ec9618697803bf76bf1d'}
]);
const SFX_PIN='d78fa862262184aa0ed172ed42e10db6e3705c71';
const A='media/3D_Assets/Audio/';
const SFX=Object.freeze({
  boost:{file:A+'Retro/power_up.wav',gain:.82,duck:.48},
  boostRelease:{file:A+'kenney_interface-sounds/Audio/switch_003.ogg',gain:.48,duck:.88,rate:.96},
  jump:{file:A+'Retro/jump.wav',gain:.66,duck:.72},
  land:{file:A+'kenney_impact-sounds/Audio/impactGeneric_light_002.ogg',gain:.78,duck:.52},
  drift:{file:A+'Other/whoosh_2.wav',gain:.44,duck:.82,rate:1.08},
  regrip:{file:A+'kenney_interface-sounds/Audio/confirmation_001.ogg',gain:.48,duck:.88,rate:1.06},
  rail:{file:A+'kenney_impact-sounds/Audio/impactMetal_medium_002.ogg',gain:.86,duck:.42},
  pickup:{file:A+'Retro/coin.wav',gain:.72,duck:.74},
  powerup:{file:A+'Retro/power_up.wav',gain:.92,duck:.40,layer:A+'kenney_music-jingles/Audio/Pizzicato jingles/jingles_PIZZI00.ogg',layerGain:.46},
  powerdown:{file:A+'Retro/power_down.wav',gain:.90,duck:.35,layer:A+'kenney_music-jingles/Audio/Steel jingles/jingles_STEEL05.ogg',layerGain:.42}
});
const CORE_PRELOAD=[...new Set(Object.values(SFX).flatMap(x=>[x.file,x.layer].filter(Boolean)))];
const ladder=(family,step)=>A+'Match Three/match_'+family+'_'+clamp(Math.round(step||1),1,10)+(clamp(Math.round(step||1),1,10)===10?'_MAX':'')+'.wav';

export async function createRadio(onChange=()=>{}){
  const catalog=JSON.parse(await readExact(raw('media/3D_Assets/Sounds/jukebox.json'),'28cd833831f07a1d5fc103e90bf60bb0720d047f'));
  const canonical=catalog.tracks;if(!Array.isArray(canonical)||!canonical.length)throw Error('Empty repository jukebox');
  const stageMode=new URLSearchParams(location.search).get('audio')==='roadtrip-v2';
  const tracks=(stageMode?[...canonical,...ROADTRIP_V2]:canonical).map(t=>({...t,collection:t.collection||'canonical'}));
  const media=new Audio();media.preload='none';media.crossOrigin='anonymous';
  let context=null,node=null,musicGain=null,sfxGain=null,compressor=null,index=0,playing=false,volume=.45,sfxVolume=.95,seq=0,error='',hiddenWasPlaying=false;
  const buffers=new Map(),loading=new Set();let sfxEvents=0,lastSfx='',sfxSkipped=0;
  const sourceUrl=t=>raw(t.file,t.pin);
  const audioUrl=file=>raw(file,SFX_PIN);
  function snapshot(){const t=tracks[index];return {track:t.id,title:t.title,index,playing,volume,sfxVolume,state:context?.state||'not-started',sourceCount:node?1:0,position:media.currentTime||0,error,a1:'SOURCE_PENDING_NOT_IMPLEMENTED',stageMode,trackCount:tracks.length,collection:t.collection,file:t.file,pin:t.pin||null,sfxLoaded:buffers.size,sfxLoading:loading.size,sfxEvents,lastSfx,sfxSkipped}}
  const publish=()=>onChange(snapshot());
  async function loadBuffer(file){
    if(buffers.has(file)||loading.has(file)||!context)return;
    loading.add(file);publish();
    try{const r=await fetch(audioUrl(file),{cache:'force-cache'});if(!r.ok)throw Error('SFX HTTP '+r.status);const b=await context.decodeAudioData(await r.arrayBuffer());buffers.set(file,b)}
    catch(e){console.warn('KFB SFX unavailable',file,e)}
    finally{loading.delete(file);publish()}
  }
  function warm(){for(const file of CORE_PRELOAD)loadBuffer(file)}
  async function init(){if(!context){
    context=new AudioContext();node=context.createMediaElementSource(media);musicGain=context.createGain();sfxGain=context.createGain();compressor=context.createDynamicsCompressor();
    musicGain.gain.value=volume;sfxGain.gain.value=sfxVolume;compressor.threshold.value=-9;compressor.knee.value=12;compressor.ratio.value=3.5;compressor.attack.value=.004;compressor.release.value=.18;
    node.connect(musicGain).connect(compressor);sfxGain.connect(compressor);compressor.connect(context.destination);warm();
  }await context.resume();publish();return true}
  async function play(){const token=++seq;error='';
    try{await init();if(!media.src){media.src=sourceUrl(tracks[index]);media.loop=!!tracks[index].loop}await media.play();if(token!==seq){if(!playing)media.pause();return}playing=true;publish()}
    catch(e){if(token!==seq)return;playing=false;error=e.message;publish()}
  }
  function pause(){seq++;playing=false;media.pause();publish()}
  function choose(i){seq++;index=((i%tracks.length)+tracks.length)%tracks.length;const resume=playing;media.pause();media.src=sourceUrl(tracks[index]);media.loop=!!tracks[index].loop;error='';publish();if(resume)play()}
  function duck(amount=.55,seconds=.24){if(!context||!musicGain||!playing)return;const t=context.currentTime,base=volume;musicGain.gain.cancelScheduledValues(t);musicGain.gain.setValueAtTime(musicGain.gain.value,t);musicGain.gain.linearRampToValueAtTime(base*amount,t+.018);musicGain.gain.linearRampToValueAtTime(base,t+seconds)}
  function playBuffer(file,{gain=.7,rate=1,pan=0}={}){
    const b=buffers.get(file);if(!b||!context||context.state!=='running')return false;
    const src=context.createBufferSource(),g=context.createGain(),p=context.createStereoPanner();src.buffer=b;src.playbackRate.value=rate;g.gain.value=gain;p.pan.value=clamp(pan,-1,1);src.connect(g).connect(p).connect(sfxGain);src.start();src.onended=()=>{try{src.disconnect();g.disconnect();p.disconnect()}catch{}};return true;
  }
  function trigger(name,{strength=1,step=1,pan=0}={}){
    if(!context||context.state!=='running'){sfxSkipped++;publish();return false}
    strength=clamp(strength,0,1.5);
    if(name==='checkpoint'||name==='cascade'){
      const file=ladder(name==='checkpoint'?'xylophone':'synth',step);
      if(!buffers.has(file)){loadBuffer(file);sfxSkipped++;publish();return false}
      const ok=playBuffer(file,{gain:(name==='checkpoint' ? .72 : .84)*strength,pan});if(ok){lastSfx=name+':'+clamp(Math.round(step),1,10);sfxEvents++;duck(name==='checkpoint' ? .68 : .48,.28)}publish();return ok;
    }
    const spec=SFX[name];if(!spec)return false;
    if(!buffers.has(spec.file)){loadBuffer(spec.file);sfxSkipped++;publish();return false}
    const ok=playBuffer(spec.file,{gain:spec.gain*strength,rate:spec.rate||1,pan});
    if(ok&&spec.layer&&buffers.has(spec.layer))playBuffer(spec.layer,{gain:(spec.layerGain||.4)*strength,rate:1,pan:pan*.35});
    if(ok){lastSfx=name;sfxEvents++;duck(spec.duck??.6,(name==='rail'||name==='land') ? .34 : .24)}publish();return ok;
  }
  media.onended=()=>{if(playing)choose(index+1)};
  media.onerror=()=>{playing=false;error='Track could not load. Choose another track or retry.';publish()};
  document.addEventListener('visibilitychange',()=>{if(document.hidden){hiddenWasPlaying=playing;media.pause();context?.suspend()}else if(hiddenWasPlaying){playing=false;hiddenWasPlaying=false;publish()}});
  publish();return {
    tracks,play,pause,choose,next(){choose(index+1)},toggle(){return playing?pause():play()},resume:init,trigger,
    setVolume(v){volume=clamp(v,0,1);if(musicGain)musicGain.gain.setTargetAtTime(volume,context.currentTime,.04);publish()},
    setSfxVolume(v){sfxVolume=clamp(v,0,1.25);if(sfxGain)sfxGain.gain.setTargetAtTime(sfxVolume,context.currentTime,.04);publish()},
    snapshot,dispose(){pause();media.removeAttribute('src');media.load();node?.disconnect();musicGain?.disconnect();sfxGain?.disconnect();compressor?.disconnect();context?.close();buffers.clear()}
  };
}
