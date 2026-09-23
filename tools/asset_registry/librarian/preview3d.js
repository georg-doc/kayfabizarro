import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { $ } from './state.js';
import { visibleMeshBounds, framePerspectiveCamera, projectedBounds } from './framing3d.js';
import { repairMissingTextureMaps } from './texture-fallback.js';
let renderer,scene,camera,controls,clock,root,mixer,bounds,token=0,motionToken=0,clips=[];
let externalState=null;
function init() {
  if (renderer) return; const canvas=$('previewCanvas');
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false}); renderer.setPixelRatio(Math.min(devicePixelRatio||1,2)); renderer.outputColorSpace=THREE.SRGBColorSpace;
  scene=new THREE.Scene(); scene.background=new THREE.Color(0xe7e1d4); camera=new THREE.PerspectiveCamera(44,1,.01,5000); controls=new OrbitControls(camera,canvas); controls.enableDamping=true;
  scene.add(new THREE.HemisphereLight(0xffffff,0x777777,2.4)); const key=new THREE.DirectionalLight(0xffffff,2); key.position.set(4,7,3); scene.add(key); clock=new THREE.Clock();
  const resize=()=>{const r=canvas.getBoundingClientRect(); renderer.setSize(Math.max(1,Math.round(r.width)),Math.max(1,Math.round(r.height)),false); camera.aspect=Math.max(1,r.width)/Math.max(1,r.height); camera.updateProjectionMatrix();}; new ResizeObserver(resize).observe(canvas); resize();
  const loop=()=>{requestAnimationFrame(loop); if(mixer)mixer.update(clock.getDelta()); controls.update(); renderer.render(scene,camera);}; loop();
}
function disposeTree(node){node?.traverse((o)=>{o.geometry?.dispose?.();for(const m of (Array.isArray(o.material)?o.material:[o.material]).filter(Boolean)){for(const v of Object.values(m))if(v?.isTexture)v.dispose?.();m.dispose?.();}});}
export function clear3D() {
  motionToken+=1; mixer=null; clips=[]; bounds=null; externalState=null;
  if(root&&scene){scene.remove(root);disposeTree(root);} root=null;
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
export function playClip(index){if(!root||!clips[index])return;motionToken+=1;externalState=null;if($('externalMotionSelect'))$('externalMotionSelect').value='';if(!mixer)mixer=new THREE.AnimationMixer(root);mixer.stopAllAction();mixer.clipAction(clips[index],root).reset().play();$('previewStatus').textContent=`${clips.length} clip(s) · ${index===0?'playing first':'playing'} (${clips[index].name||`#${index+1}`})`;}
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
  if(!mixer)mixer=new THREE.AnimationMixer(targetRoot);mixer.stopAllAction();mixer.clipAction(clip,targetRoot).reset().play();
  externalState={sourceAssetId:sourceRecord.assetId,clipName:clip.name||clipName||`Clip ${clipIndex+1}`,matchedTracks:coverage.matchedTracks,totalTracks:coverage.totalTracks,playing:true};
  $('clipSelect').value='';
  $('previewStatus').textContent=`External motion · ${externalState.clipName} · ${coverage.matchedTracks}/${coverage.totalTracks} tracks bound`;
  disposeTree(gltf.scene); requestAnimationFrame(()=>fitCamera()); return {...externalState};
}
export function externalMotionState(){return externalState?{...externalState}:null;}
export function animationState(){return{mixer,loadedAnimations:clips,externalMotion:externalState};}
export async function render3D(record){$('previewCanvas').hidden=false;$('threeControls').hidden=false;init();const t=++token;++motionToken;externalState=null;$('previewTitle').textContent='3D preview';$('previewStatus').textContent='Loading…';
  try{const gltf=await new GLTFLoader().loadAsync(record.source?.rawPinned||record.source?.rawLatest);if(t!==token)return;root=gltf.scene;const repaired=await repairMissingTextureMaps(THREE,record,root);if(t!==token){disposeTree(root);root=null;return;}clips=gltf.animations||[];scene.add(root);fitCamera();$('clipSelect').replaceChildren(new Option(clips.length?`${clips.length} embedded clips`:'No embedded clips',''),...clips.map((c,i)=>new Option(c.name||`Clip ${i+1}`,String(i))));if(clips.length&&$('autoplayToggle').checked){$('clipSelect').value='0';playClip(0);requestAnimationFrame(()=>fitCamera());}else $('previewStatus').textContent=(clips.length?`${clips.length} clip(s) · paused`:'Loaded · no embedded clips')+(repaired?` · ${repaired} texture fallback${repaired===1?'':'s'}`:'');}
  catch(e){if(t===token)$('previewStatus').textContent=`Preview failed: ${e.message}`;}}
