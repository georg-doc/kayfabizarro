import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $=(s)=>document.querySelector(s), $$=(s)=>[...document.querySelectorAll(s)];
const mod=(n,m)=>((n%m)+m)%m, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const audio=$('#song'), canvas=$('#view'), stage=$('#stage');
const state={ready:false,mode:'source',playing:false,loop:true,recipe:null,sourceMeta:null,root:null,mixer:null,actions:new Map(),audioOwnerCount:1,errors:[],lastBeat:null,songObjectUrl:null};

const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.shadowMap.enabled=true;
const scene=new THREE.Scene(); scene.background=new THREE.Color('#16120e'); scene.fog=new THREE.Fog('#16120e',18,34);
const camera=new THREE.PerspectiveCamera(34,1,.1,100);
const controls=new OrbitControls(camera,canvas); controls.enableDamping=true; controls.maxPolarAngle=Math.PI*.49;
scene.add(new THREE.HemisphereLight('#fff1dc','#3a2c1f',1.6));
const key=new THREE.DirectionalLight('#ffd9a8',2.4); key.position.set(5,9,7); key.castShadow=true; scene.add(key);
const rim=new THREE.DirectionalLight('#9fb8ff',.9); rim.position.set(-6,5,-8); scene.add(rim);
const fire=new THREE.PointLight('#ff7a3a',6,9,1.6); fire.position.set(-1.6,1.2,-3.4); scene.add(fire);

function fail(m,e){const t=m+(e?.message?' · '+e.message:'');state.errors.push(t);console.error('[MUSIC-PERF-01]',t,e||'');$('#status').textContent='SOURCE FAIL · '+t;$('#status').dataset.bad='1';}
function status(t){$('#status').textContent=t;$('#status').dataset.bad='0';}
function beatPos(){if(!state.recipe)return 0;const t=state.recipe.timing;return(audio.currentTime-t.phaseOffsetSec)*t.bpm/60;}
function timeForBeat(b){const t=state.recipe.timing;return t.phaseOffsetSec+b*60/t.bpm;}
function mediaReady(){
  if(audio.readyState>=3 && Number.isFinite(audio.duration))return Promise.resolve();
  return new Promise((resolve,reject)=>{
    const done=()=>{cleanup();resolve();};
    const bad=()=>{cleanup();reject(new Error('song media failed to become seekable'));};
    const cleanup=()=>{audio.removeEventListener('canplay',done);audio.removeEventListener('error',bad);};
    audio.addEventListener('canplay',done,{once:true});
    audio.addEventListener('error',bad,{once:true});
    audio.load();
  });
}
async function loadSongTransport(url){
  const res=await fetch(url,{cache:'force-cache'});
  if(!res.ok)throw new Error('song HTTP '+res.status);
  const blob=await res.blob();
  if(state.songObjectUrl)URL.revokeObjectURL(state.songObjectUrl);
  state.songObjectUrl=URL.createObjectURL(blob);
  audio.src=state.songObjectUrl;
  audio.preload='auto';
  audio.loop=false;
  await mediaReady();
}
async function seekSongTime(target){
  await mediaReady();
  const max=Number.isFinite(audio.duration)?Math.max(0,audio.duration-.01):target;
  target=clamp(target,0,max);
  if(Math.abs(audio.currentTime-target)<=.025)return audio.currentTime;
  await new Promise((resolve,reject)=>{
    let timer;
    const done=()=>{
      if(Math.abs(audio.currentTime-target)<=.08){cleanup();resolve();}
    };
    const bad=()=>{cleanup();reject(new Error('song seek failed'));};
    const cleanup=()=>{
      clearTimeout(timer);
      audio.removeEventListener('seeked',done);
      audio.removeEventListener('timeupdate',done);
      audio.removeEventListener('error',bad);
    };
    audio.addEventListener('seeked',done);
    audio.addEventListener('timeupdate',done);
    audio.addEventListener('error',bad,{once:true});
    timer=setTimeout(()=>{cleanup();reject(new Error('song seek timeout target='+target.toFixed(3)+' current='+audio.currentTime.toFixed(3)));},3000);
    audio.currentTime=target;
    done();
  });
  return audio.currentTime;
}
function barBeat(b){const t=state.recipe.timing,s=Math.max(0,b);return{bar:Math.floor(s/t.beatsPerBar)+1+t.barOffset,beat:Math.floor(mod(s,t.beatsPerBar))+1};}
function performerForAction(n){return state.recipe?.performers.find(p=>p.choreography.actionRef===n)||null;}

function setMode(mode){
  if(!['source','performance'].includes(mode))return false;
  state.mode=mode;
  $$('.mode').forEach(b=>b.dataset.on=String(b.dataset.mode===mode));
  $('#modeCopy').textContent=mode==='source'
    ?'Exact ORB-P1 v5 source object. Leader, guitarist, drummer and camp remain unfiltered.'
    :'Resident Performance recipe. Accepted leader + guitarist run; drummer HOLD is disabled without editing the donor.';
  if(state.root){
    state.root.traverse(o=>{if(o.userData.__musicPerfHidden)o.visible=true;o.userData.__musicPerfHidden=false;});
    if(mode==='performance'){
      for(const p of state.recipe.performers.filter(p=>!p.enabled)){
        const names=new Set([p.sourceNode,...(p.visibilityNodes||[])]);
        state.root.traverse(o=>{if(names.has(o.name)||(/WardrumStick/i.test(o.name)&&p.id==='drummer')){o.userData.__musicPerfHidden=true;o.visible=false;}});
      }
    }
  }
  renderPerformers(); return true;
}
function syncActions(){
  if(!state.mixer)return;
  const b=beatPos();
  for(const [name,r] of state.actions){
    const p=performerForAction(name), src=state.sourceMeta?.clips?.find(c=>c.name===name);
    const cycle=p?.choreography?.cycleBeats||src?.beats||Math.max(1,Math.round(r.clip.duration));
    const local=b-(p?.choreography?.startBeat||0)-(p?.choreography?.beatOffset||0);
    r.action.time=(local<0?0:mod(local,cycle))*r.clip.duration/cycle;
  }
  state.mixer.update(0);
}
async function setBeat(b){
  if(!state.recipe)return;
  const m=state.recipe.markers;
  b=clamp(Number(b)||0,m.startBeat,m.finishBeat);
  await seekSongTime(Math.max(0,timeForBeat(b)));
  syncActions();
  renderTimeline();
  return beatPos();
}
async function togglePlay(){
  if(!state.ready)return false;
  if(state.playing){audio.pause();}
  else{
    const b=beatPos(),m=state.recipe.markers;
    if(b<m.startBeat-.01||b>=m.finishBeat)audio.currentTime=timeForBeat(m.startBeat);
    await audio.play();
  }
  return state.playing;
}
function renderTransport(){$('#play').textContent=state.playing?'Pause':'Play';$('#loop').checked=state.loop;}
function renderMeta(){const r=state.recipe;$('#songName').textContent=r.label;$('#bpm').textContent=r.timing.bpm+' BPM';$('#phase').textContent='phase '+r.timing.phaseOffsetSec.toFixed(3)+' s';$('#barOffset').textContent='bar offset '+r.timing.barOffset;$('#sourcePin').textContent=r.sourceObject.glbBlob.slice(0,8)+' · PR #'+r.sourceObject.donorPr;}
function renderPerformers(){
  const h=$('#performers');h.innerHTML='';
  for(const p of state.recipe.performers){
    const d=document.createElement('div'); d.className='performer'; d.dataset.active=String(state.mode==='source'||p.enabled);
    d.innerHTML='<div><b>'+p.id+'</b><span>'+p.residentId+'</span></div><code>'+p.choreography.actionRef+' · '+p.choreography.cycleBeats+' beat'+(p.choreography.cycleBeats===1?'':'s')+'</code><em data-result="'+p.humanResult+'">'+p.humanResult+'</em>';
    h.append(d);
  }
}
function renderRuler(){
  const h=$('#ruler');h.innerHTML='';const r=state.recipe,m=r.markers,total=m.finishBeat-m.startBeat;
  for(let b=m.startBeat;b<m.finishBeat;b++){
    const x=document.createElement('button');x.className='beat-cell'+(b%r.timing.beatsPerBar===0?' downbeat':'');x.dataset.beat=String(b);x.innerHTML='<span>'+(b%r.timing.beatsPerBar+1)+'</span>';x.onclick=()=>setBeat(b).catch(e=>fail('song seek',e));h.append(x);
  }
  for(const [k,l] of [['startBeat','START'],['loopStartBeat','LOOP'],['loopEndBeat','END']]){
    const x=document.createElement('i');x.className='marker';x.textContent=l;x.style.left=((m[k]-m.startBeat)/total*100)+'%';h.append(x);
  }
}
function renderTimeline(){
  if(!state.recipe)return;const b=beatPos(),bb=barBeat(b),m=state.recipe.markers;
  $('#count').textContent='Bar '+bb.bar+' · Beat '+bb.beat;$('#beatValue').textContent=b.toFixed(2);$('#timeValue').textContent=audio.currentTime.toFixed(2)+' s';
  $('#scrub').value=String(clamp(b,m.startBeat,m.finishBeat));$('#playhead').style.left=(clamp((b-m.startBeat)/(m.finishBeat-m.startBeat),0,1)*100)+'%';
  const w=Math.floor(b);if(w!==state.lastBeat){state.lastBeat=w;$$('.beat-cell').forEach(x=>x.dataset.active=String(Number(x.dataset.beat)===w));}
}
function enforceMarkers(){
  if(!state.playing)return;const m=state.recipe.markers,b=beatPos();
  if(state.loop&&b>=m.loopEndBeat)audio.currentTime=timeForBeat(m.loopStartBeat);
  else if(!state.loop&&b>=m.finishBeat)audio.pause();
}
function fitCamera(){const c=state.recipe.cameraRecipe;camera.fov=c.fov;camera.position.fromArray(c.position);controls.target.fromArray(c.target);controls.minDistance=c.minDistance;controls.maxDistance=c.maxDistance;camera.updateProjectionMatrix();controls.update();}
function resize(){const w=Math.max(1,stage.clientWidth),h=Math.max(1,stage.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
function snapshot(){
  const actions={};for(const [n,r] of state.actions)actions[n]={time:+r.action.time.toFixed(4),duration:+r.clip.duration.toFixed(4)};
  const performers={};for(const p of state.recipe?.performers||[]){const n=state.root?.getObjectByName(p.sourceNode);performers[p.id]=n?n.visible:null;}
  return{ready:state.ready,mode:state.mode,playing:state.playing,loop:state.loop,audioOwnerCount:state.audioOwnerCount,audioTime:+(audio.currentTime||0).toFixed(4),audioDuration:Number.isFinite(audio.duration)?+audio.duration.toFixed(4):null,seekableRanges:audio.seekable?.length||0,beatPos:+beatPos().toFixed(4),source:{id:state.sourceMeta?.id||null,version:state.sourceMeta?.version||null,glbBlob:state.recipe?.sourceObject?.glbBlob||null},song:{blob:state.recipe?.songRef?.blob||null,bpm:state.recipe?.timing?.bpm||null,phaseOffsetSec:state.recipe?.timing?.phaseOffsetSec||null},performers,actions,errors:[...state.errors]};
}
function downloadRecipe(){const b=new Blob([JSON.stringify(state.recipe,null,2)+'\n'],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=state.recipe.id+'.performance.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),3000);}

async function boot(){
  const [rr,sr]=await Promise.all([fetch('./performance-recipe.json',{cache:'no-store'}),fetch('./donor/orb_module_source.json',{cache:'no-store'})]);
  if(!rr.ok||!sr.ok)throw new Error('recipe/source metadata HTTP failure');
  state.recipe=await rr.json();state.sourceMeta=await sr.json();
  if(state.sourceMeta.id!==state.recipe.sourceObject.residentModuleId||state.sourceMeta.version!==state.recipe.sourceObject.version)throw new Error('donor identity mismatch');
  if(state.sourceMeta.track.gitBlob!==state.recipe.songRef.blob)throw new Error('song blob mismatch');
  for(const p of state.recipe.performers)if(!state.sourceMeta.clips.find(c=>c.name===p.choreography.actionRef))throw new Error('donor clip missing: '+p.choreography.actionRef);
  await loadSongTransport(state.recipe.songRef.previewUrl);await seekSongTime(timeForBeat(state.recipe.markers.startBeat));
  renderMeta();renderRuler();renderPerformers();fitCamera();
  try{window.createImageBitmap=undefined;}catch{}
  const gltf=await new GLTFLoader().loadAsync(state.recipe.sourceObject.glb);
  state.root=gltf.scene;state.root.name='SOURCE OBJECT · ORB-P1 v5';scene.add(state.root);
  state.root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=o.name==='Ground';if(o.material?.map)o.material.map.anisotropy=4;}});
  state.mixer=new THREE.AnimationMixer(state.root);
  for(const clip of gltf.animations){const action=state.mixer.clipAction(clip);action.play();state.actions.set(clip.name,{action,clip});}
  for(const name of ['bounce','strum','drum'])if(!state.actions.has(name))throw new Error('exact donor action missing: '+name);
  for(const p of state.recipe.performers)if(!state.root.getObjectByName(p.sourceNode))throw new Error('exact donor node missing: '+p.sourceNode);
  setMode('source');syncActions();state.ready=true;status('SOURCE OBJECT ready · exact ORB-P1 v5');
  window.__MUSIC_PERF_01__={setMode,setBeat,togglePlay,play:async()=>{if(!state.playing)await togglePlay();},pause:()=>audio.pause(),snapshot,recipe:()=>structuredClone(state.recipe)};
}
$('#sourceMode').onclick=()=>setMode('source');$('#performanceMode').onclick=()=>setMode('performance');$('#play').onclick=()=>togglePlay().catch(e=>fail('audio transport',e));$('#restart').onclick=()=>setBeat(0).catch(e=>fail('song seek',e));$('#loop').onchange=e=>{state.loop=e.target.checked;renderTransport();};$('#scrub').oninput=e=>{audio.pause();setBeat(e.target.value).catch(err=>fail('song seek',err));};$('#download').onclick=downloadRecipe;
audio.onplay=()=>{state.playing=true;renderTransport();};audio.onpause=()=>{state.playing=false;renderTransport();};audio.onerror=()=>fail('song media error '+(audio.error?.code||''));
new ResizeObserver(resize).observe(stage);resize();
function frame(){requestAnimationFrame(frame);controls.update();if(state.ready){enforceMarkers();syncActions();renderTimeline();}renderer.render(scene,camera);}frame();
boot().catch(e=>fail('boot',e));
