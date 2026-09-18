import {raw,readExact,clamp} from './sources.mjs';
// One music source. No substitute for the approved-but-not-delivered A1 soundscape.
export async function createRadio(onChange=()=>{}){
  const catalog=JSON.parse(await readExact(raw('media/3D_Assets/Sounds/jukebox.json'),'28cd833831f07a1d5fc103e90bf60bb0720d047f'));
  const tracks=catalog.tracks;if(!Array.isArray(tracks)||!tracks.length)throw Error('Empty repository jukebox');
  const media=new Audio();media.preload='none';media.crossOrigin='anonymous';let context=null,node=null,gain=null,index=0,playing=false,volume=.45,seq=0,error='',hiddenWasPlaying=false;
  function snapshot(){return {track:tracks[index].id,title:tracks[index].title,index,playing,volume,state:context?.state||'not-started',sourceCount:node?1:0,position:media.currentTime||0,error,a1:'SOURCE_PENDING_NOT_IMPLEMENTED'}}
  const publish=()=>onChange(snapshot());
  function init(){if(!context){context=new AudioContext();node=context.createMediaElementSource(media);gain=context.createGain();gain.gain.value=volume;node.connect(gain).connect(context.destination)}return context.resume()}
  async function play(){const token=++seq;error='';
    try{await init();if(!media.src){media.src=raw(tracks[index].file);media.loop=!!tracks[index].loop}await media.play();if(token!==seq){if(!playing)media.pause();return}playing=true;publish()}
    catch(e){if(token!==seq)return;playing=false;error=e.message;publish()}
  }
  function pause(){seq++;playing=false;media.pause();publish()}
  function choose(i){seq++;index=((i%tracks.length)+tracks.length)%tracks.length;const resume=playing;media.pause();media.src=raw(tracks[index].file);media.loop=!!tracks[index].loop;error='';publish();if(resume)play()}
  media.onended=()=>{if(playing)choose(index+1)};
  media.onerror=()=>{playing=false;error='Track could not load. Choose another track or retry.';publish()};
  document.addEventListener('visibilitychange',()=>{if(document.hidden){hiddenWasPlaying=playing;media.pause();context?.suspend()}else if(hiddenWasPlaying){playing=false;hiddenWasPlaying=false;publish()}});
  publish();return {tracks,play,pause,choose,next(){choose(index+1)},toggle(){return playing?pause():play()},setVolume(v){volume=clamp(v,0,1);if(gain)gain.gain.setTargetAtTime(volume,context.currentTime,.04);publish()},snapshot,dispose(){pause();media.removeAttribute('src');media.load();node?.disconnect();gain?.disconnect();context?.close()}};
}
