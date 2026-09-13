import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { $ } from './state.js';
let renderer,scene,camera,controls,clock,root,mixer,sphere,token=0,clips=[];
function init() {
  if (renderer) return; const canvas=$('previewCanvas');
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false}); renderer.setPixelRatio(Math.min(devicePixelRatio||1,2)); renderer.outputColorSpace=THREE.SRGBColorSpace;
  scene=new THREE.Scene(); scene.background=new THREE.Color(0xe7e1d4); camera=new THREE.PerspectiveCamera(44,1,.01,5000); controls=new OrbitControls(camera,canvas); controls.enableDamping=true;
  scene.add(new THREE.HemisphereLight(0xffffff,0x777777,2.4)); const key=new THREE.DirectionalLight(0xffffff,2); key.position.set(4,7,3); scene.add(key); clock=new THREE.Clock();
  const resize=()=>{const r=canvas.getBoundingClientRect(); renderer.setSize(Math.max(1,Math.round(r.width)),Math.max(1,Math.round(r.height)),false); camera.aspect=Math.max(1,r.width)/Math.max(1,r.height); camera.updateProjectionMatrix();}; new ResizeObserver(resize).observe(canvas); resize();
  const loop=()=>{requestAnimationFrame(loop); if(mixer)mixer.update(clock.getDelta()); controls.update(); renderer.render(scene,camera);}; loop();
}
export function clear3D() {
  mixer=null; clips=[]; sphere=null;
  if(root&&scene){scene.remove(root); root.traverse((o)=>{o.geometry?.dispose?.(); for(const m of (Array.isArray(o.material)?o.material:[o.material]).filter(Boolean)){for(const v of Object.values(m)) if(v?.isTexture)v.dispose?.(); m.dispose?.();}});} root=null;
  $('previewCanvas').hidden=true; $('threeControls').hidden=true; $('clipSelect').replaceChildren(new Option('No clips','')); $('wireframeToggle').checked=false;
}
export function fitCamera() {
  if(!sphere||!camera||!controls)return; const radius=Math.max(sphere.radius,.01),vf=THREE.MathUtils.degToRad(camera.fov),hf=2*Math.atan(Math.tan(vf/2)*Math.max(camera.aspect,.01)),dist=(radius/Math.sin(Math.max(.01,Math.min(vf,hf))/2))*1.18;
  controls.target.copy(sphere.center); camera.near=Math.max(radius/100,dist-radius*3,.001); camera.far=Math.max(dist+radius*10,100); camera.position.copy(sphere.center).add(new THREE.Vector3(1,.65,1).normalize().multiplyScalar(dist)); camera.updateProjectionMatrix(); controls.update();
}
export function setWireframe(enabled){if(!root)return;root.traverse((o)=>{for(const m of (Array.isArray(o.material)?o.material:[o.material]).filter(Boolean))if('wireframe'in m){m.wireframe=enabled;m.needsUpdate=true;}});}
export function playClip(index){if(!root||!clips[index])return;if(!mixer)mixer=new THREE.AnimationMixer(root);mixer.stopAllAction();mixer.clipAction(clips[index]).reset().play();$('previewStatus').textContent=`${clips.length} clip(s) · ${index===0?'playing first':'playing'} (${clips[index].name||`#${index+1}`})`;}
export function animationState(){return{mixer,loadedAnimations:clips};}
export async function render3D(record){$('previewCanvas').hidden=false;$('threeControls').hidden=false;init();const t=++token;$('previewTitle').textContent='3D preview';$('previewStatus').textContent='Loading…';
  try{const gltf=await new GLTFLoader().loadAsync(record.source?.rawPinned||record.source?.rawLatest);if(t!==token)return;root=gltf.scene;clips=gltf.animations||[];scene.add(root);sphere=new THREE.Box3().setFromObject(root).getBoundingSphere(new THREE.Sphere());fitCamera();$('clipSelect').replaceChildren(new Option(clips.length?`${clips.length} clips`:'No clips',''),...clips.map((c,i)=>new Option(c.name||`Clip ${i+1}`,String(i))));if(clips.length&&$('autoplayToggle').checked){$('clipSelect').value='0';playClip(0);}else $('previewStatus').textContent=clips.length?`${clips.length} clip(s) · paused`:'Loaded';}
  catch(e){if(t===token)$('previewStatus').textContent=`Preview failed: ${e.message}`;}}
