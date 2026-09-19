import {raw,readExact,clamp} from './sources.mjs';
// One music source. No substitute for the approved-but-not-delivered A1 soundscape.
// Default BOX1 stays on the canonical repository Jukebox. The RoadTrip v2 intake is
// exposed only behind ?audio=roadtrip-v2 for Stage driving/listening.
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
export async function createRadio(onChange=()=>{}){
  const catalog=JSON.parse(await readExact(raw('media/3D_Assets/Sounds/jukebox.json'),'28cd833831f07a1d5fc103e90bf60bb0720d047f'));
  const canonical=catalog.tracks;if(!Array.isArray(canonical)||!canonical.length)throw Error('Empty repository jukebox');
  const stageMode=new URLSearchParams(location.search).get('audio')==='roadtrip-v2';
  const tracks=(stageMode?[...canonical,...ROADTRIP_V2]:canonical).map(t=>({...t,collection:t.collection||'canonical'}));
  const media=new Audio();media.preload='none';media.crossOrigin='anonymous';let context=null,node=null,gain=null,index=0,playing=false,volume=.45,seq=0,error='',hiddenWasPlaying=false;
  const sourceUrl=t=>raw(t.file,t.pin);
  function snapshot(){const t=tracks[index];return {track:t.id,title:t.title,index,playing,volume,state:context?.state||'not-started',sourceCount:node?1:0,position:media.currentTime||0,error,a1:'SOURCE_PENDING_NOT_IMPLEMENTED',stageMode,trackCount:tracks.length,collection:t.collection,file:t.file,pin:t.pin||null}}
  const publish=()=>onChange(snapshot());
  function init(){if(!context){context=new AudioContext();node=context.createMediaElementSource(media);gain=context.createGain();gain.gain.value=volume;node.connect(gain).connect(context.destination)}return context.resume()}
  async function play(){const token=++seq;error='';
    try{await init();if(!media.src){media.src=sourceUrl(tracks[index]);media.loop=!!tracks[index].loop}await media.play();if(token!==seq){if(!playing)media.pause();return}playing=true;publish()}
    catch(e){if(token!==seq)return;playing=false;error=e.message;publish()}
  }
  function pause(){seq++;playing=false;media.pause();publish()}
  function choose(i){seq++;index=((i%tracks.length)+tracks.length)%tracks.length;const resume=playing;media.pause();media.src=sourceUrl(tracks[index]);media.loop=!!tracks[index].loop;error='';publish();if(resume)play()}
  media.onended=()=>{if(playing)choose(index+1)};
  media.onerror=()=>{playing=false;error='Track could not load. Choose another track or retry.';publish()};
  document.addEventListener('visibilitychange',()=>{if(document.hidden){hiddenWasPlaying=playing;media.pause();context?.suspend()}else if(hiddenWasPlaying){playing=false;hiddenWasPlaying=false;publish()}});
  publish();return {tracks,play,pause,choose,next(){choose(index+1)},toggle(){return playing?pause():play()},setVolume(v){volume=clamp(v,0,1);if(gain)gain.gain.setTargetAtTime(volume,context.currentTime,.04);publish()},snapshot,dispose(){pause();media.removeAttribute('src');media.load();node?.disconnect();gain?.disconnect();context?.close()}};
}
