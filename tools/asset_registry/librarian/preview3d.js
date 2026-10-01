import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { $ } from './state.js';
import { visibleMeshBounds, framePerspectiveCamera, projectedBounds } from './framing3d.js';
let renderer,scene,camera,controls,clock,root,mixer,bounds,token=0,motionToken=0,clips=[];
let externalState=null,activeAction=null,activeClip=null;
function fmtTime(seconds){
  const s=Math.max(0,Number(seconds)||0),m=Math.floor(s/60),r=Math.floor(s%60);
  return `${m}:${String(r).padStart(2,'0')}`;
}
function syncMotionTransport(){
  const box=$('motionTransport'); if(!box)return;
  const ready=Boolean(activeAction&&activeClip);
  box.hidden=!ready;
  if(!ready)return;
  const duration=Math.max(.0001,Number(activeClip.duration)||0);
  const scrub=$('motionScrub'),time=$('motionTime'),play=$('motionPlayPause');
  if(scrub&&!scrub.matches(':active'))scrub.value=String(Math.min(1,Math.max(0,(activeAction.time||0)/duration)));
  if(time)time.textContent=`${fmtTime(activeAction.time||0)} / ${fmtTime(duration)}`;
  if(play)play.textContent=activeAction.paused?'Play':'Pause';
}
function configureAction(action,clip){
  activeAction=action;activeClip=clip;
  const speed=Number($('motionSpeed')?.value||1);
  const loop=$('motionLoop')?.checked!==false;
  action.timeScale=Number.isFinite(speed)&&speed>0?speed:1;
  action.setLoop(loop?THREE.LoopRepeat:THREE.LoopOnce,loop?Infinity:1);
  action.clampWhenFinished=!loop;
  action.paused=false;
  syncMotionTransport();
  return action;
}
export function setMotionPaused(paused){
  if(!activeAction)return false;
  activeAction.paused=Boolean(paused);syncMotionTransport();return true;
}
export function setMotionSpeed(speed){
  if(!activeAction)return false;
  const value=Number(speed);if(!Number.isFinite(value)||value<=0)return false;
  activeAction.timeScale=value;syncMotionTransport();return true;
}
export function setMotionLoop(loop){
  if(!activeAction)return false;
  activeAction.setLoop(loop?THREE.LoopRepeat:THREE.LoopOnce,loop?Infinity:1);
  activeAction.clampWhenFinished=!loop;syncMotionTransport();return true;
}
export function scrubMotion(progress){
  if(!activeAction||!activeClip)return false;
  const p=Math.min(1,Math.max(0,Number(progress)||0));
  activeAction.paused=true;activeAction.time=(Number(activeClip.duration)||0)*p;
  mixer?.update(0);syncMotionTransport();return true;
}

function init() {
  if (renderer) return; const canvas=$('previewCanvas');
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false}); renderer.setPixelRatio(Math.min(devicePixelRatio||1,2)); renderer.outputColorSpace=THREE.SRGBColorSpace;
  scene=new THREE.Scene(); scene.background=new THREE.Color(0xe7e1d4); camera=new THREE.PerspectiveCamera(44,1,.01,5000); controls=new OrbitControls(camera,canvas); controls.enableDamping=true;
  scene.add(new THREE.HemisphereLight(0xffffff,0x777777,2.4)); const key=new THREE.DirectionalLight(0xffffff,2); key.position.set(4,7,3); scene.add(key); clock=new THREE.Clock();
  const resize=()=>{const r=canvas.getBoundingClientRect(); renderer.setSize(Math.max(1,Math.round(r.width)),Math.max(1,Math.round(r.height)),false); camera.aspect=Math.max(1,r.width)/Math.max(1,r.height); camera.updateProjectionMatrix();}; new ResizeObserver(resize).observe(canvas); resize();
  const loop=()=>{requestAnimationFrame(loop); const dt=clock.getDelta(); if(mixer)mixer.update(dt); syncMotionTransport(); controls.update(); renderer.render(scene,camera);}; loop();
}
function disposeTree(node){node?.traverse((o)=>{o.geometry?.dispose?.();for(const m of (Array.isArray(o.material)?o.material:[o.material]).filter(Boolean)){for(const v of Object.values(m))if(v?.isTexture)v.dispose?.();m.dispose?.();}});}
export function clear3D() {
  motionToken+=1; mixer=null; clips=[]; bounds=null; externalState=null; activeAction=null; activeClip=null;
  if(root&&scene){scene.remove(root);disposeTree(root);} root=null;
  if($('motionTransport'))$('motionTransport').hidden=true; if($('motionScrub'))$('motionScrub').value='0'; if($('motionTime'))$('motionTime').textContent='0:00 / 0:00';
  $('previewCanvas').hidden=true; $('threeControls').hidden=true; $('clipSelect').replaceChildren(new Option('No embedded clips','')); $('wireframeToggle').checked=false;
  if($('externalMotionSelect')) $('externalMotionSelect').value='';
}
export function fitCamera() {
  if(!root||!camera||!controls)return;
  bounds=visibleMeshBounds(root);
  framePerspectiveCamera(camera,bounds,{controls,padding:1.18,headroom:.16,footroom:.06,side:.07,depth:.07,direction:new THREE.Vector3(1,.34,1)});
}
export function framingState(){
  if(!camera||!bounds)return null;
  return { projected:projectedBounds(camera,bounds), min:bounds.min.toArray(), max:bounds.max.toArray() };
}
export function setWireframe(enabled){if(!root)return;root.traverse((o)=>{for(const m of (Array.isArray(o.material)?o.material:[o.material]).filter(Boolean))if('wireframe'in m){m.wireframe=enabled;m.needsUpdate=true;}});}
export function playClip(index){if(!root||!clips[index])return;motionToken+=1;externalState=null;if($('externalMotionSelect'))$('externalMotionSelect').value='';if(!mixer)mixer=new THREE.AnimationMixer(root);mixer.stopAllAction();const action=mixer.clipAction(clips[index],root).reset().play();configureAction(action,clips[index]);$('previewStatus').textContent=`${clips.length} clip(s) · ${index===0?'playing first':'playing'} (${clips[index].name||`#${index+1}`})`;}
function bindingCoverage(targetRoot,clip){
  let matched=0;
  for(const track of clip.tracks||[]){
    try{const parsed=THREE.PropertyBinding.parseTrackName(track.name);if(THREE.PropertyBinding.findNode(targetRoot,parsed.nodeName))matched+=1;}catch{/* counted as unmatched */}
  }
  return { matchedTracks:matched,totalTracks:(clip.tracks||[]).length };
}
export async function playExternalClip(sourceRecord,clipName,clipIndex=0){
  if(!root)throw new Error('Load a character preview first.');
  const targetRoot=root, run=++motionToken;
  $('previewStatus').textContent=`Loading motion · ${clipName || `#${clipIndex+1}`}…`;
  const gltf=await new GLTFLoader().loadAsync(sourceRecord.source?.rawPinned||sourceRecord.source?.rawLatest);
  if(run!==motionToken||targetRoot!==root){disposeTree(gltf.scene);return null;}
  const sourceClips=gltf.animations||[];
  const clip=sourceClips.find((item)=>item.name===clipName)||sourceClips[clipIndex]||sourceClips[0];
  if(!clip){disposeTree(gltf.scene);throw new Error('Source contains no animation clip.');}
  const coverage=bindingCoverage(targetRoot,clip);
  if(!coverage.matchedTracks){disposeTree(gltf.scene);throw new Error(`No animation tracks bind to this character (${coverage.totalTracks} tracks checked).`);}
  if(!mixer)mixer=new THREE.AnimationMixer(targetRoot);mixer.stopAllAction();const action=mixer.clipAction(clip,targetRoot).reset().play();configureAction(action,clip);
  externalState={sourceAssetId:sourceRecord.assetId,clipName:clip.name||clipName||`Clip ${clipIndex+1}`,matchedTracks:coverage.matchedTracks,totalTracks:coverage.totalTracks,playing:true};
  $('clipSelect').value='';
  $('previewStatus').textContent=`External motion · ${externalState.clipName} · ${coverage.matchedTracks}/${coverage.totalTracks} tracks bound`;
  disposeTree(gltf.scene); requestAnimationFrame(()=>fitCamera()); return {...externalState};
}
export function externalMotionState(){return externalState?{...externalState}:null;}
export function animationState(){return{mixer,loadedAnimations:clips,externalMotion:externalState,activeClip:activeClip?.name||null,activeDuration:activeClip?.duration||0,paused:Boolean(activeAction?.paused)};}
export async function render3D(record){$('previewCanvas').hidden=false;$('threeControls').hidden=false;init();const t=++token;++motionToken;externalState=null;$('previewTitle').textContent='3D preview';$('previewStatus').textContent='Loading…';
  try{const gltf=await new GLTFLoader().loadAsync(record.source?.rawPinned||record.source?.rawLatest);if(t!==token)return;root=gltf.scene;clips=gltf.animations||[];scene.add(root);fitCamera();$('clipSelect').replaceChildren(new Option(clips.length?`${clips.length} embedded clips`:'No embedded clips',''),...clips.map((c,i)=>new Option(c.name||`Clip ${i+1}`,String(i))));if(clips.length&&$('autoplayToggle').checked){$('clipSelect').value='0';playClip(0);requestAnimationFrame(()=>fitCamera());}else $('previewStatus').textContent=clips.length?`${clips.length} clip(s) · paused`:'Loaded · no embedded clips';}
  catch(e){if(t===token)$('previewStatus').textContent=`Preview failed: ${e.message}`;}}
