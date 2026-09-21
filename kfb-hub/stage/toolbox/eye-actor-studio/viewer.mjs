import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {EyeRig} from '../../../../tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js';
import {BrowRig} from '../../../../tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/brow-rig.v2.js';
import {applyClayLids} from '../../../../tools/KFB-ToolBox/eye-actor-studio/lib/clay-lid-adapter.v0.mjs';
import {applyEyeShading,mountUnderEyeShadows} from '../../../../tools/KFB-ToolBox/eye-actor-studio/lib/eye-materials.v0.mjs';
import {mountEmanata3D} from '../../../../tools/KFB-ToolBox/eye-actor-studio/lib/emanata3d.v0.mjs';
import {resolveSurfaceColor} from '../../../../tools/KFB-ToolBox/eye-actor-studio/lib/color-resolver.v0.mjs';
import {applyEyeActorPose} from '../../../../tools/KFB-ToolBox/eye-actor-studio/lib/pose-library.v0.mjs';

const stage=document.querySelector('#stage'),canvas=document.querySelector('#view'),status=document.querySelector('#status'),resolverEl=document.querySelector('#resolver'),title=document.querySelector('#title');
const scene=new THREE.Scene();scene.background=new THREE.Color('#d8dfdc');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;
const camera=new THREE.PerspectiveCamera(34,1,.05,100),controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.target.set(0,.2,0);
scene.add(new THREE.HemisphereLight(0xfffbef,0x59605d,1.7));const key=new THREE.DirectionalLight(0xffe4ca,2.6);key.position.set(-4,6,7);key.castShadow=true;scene.add(key);const fill=new THREE.DirectionalLight(0xc7d8ef,.55);fill.position.set(4,2,4);scene.add(fill);

const host=new THREE.Group();scene.add(host);const inner=new THREE.Group();host.add(inner);
const bodyGeo=new THREE.SphereGeometry(1,48,32);bodyGeo.scale(.92,1.12,.82);bodyGeo.computeBoundingBox();
const bodyMat=new THREE.MeshStandardMaterial({color:'#d69a78',roughness:.82,metalness:0});
const body=new THREE.Mesh(bodyGeo,bodyMat);body.name='body';body.castShadow=true;body.receiveShadow=true;inner.add(body);
const ch={THREE,inner,o:{makeMat:(o)=>new THREE.MeshStandardMaterial({color:o.color,roughness:o.roughness??.85,metalness:0})}};
let rig=null,brow=null,shadowGroup=null,emanataGroup=null,clayReport=null,resolver=null;

function resize(){const r=stage.getBoundingClientRect();if(r.width<1||r.height<1)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(stage);
function frame(view='front'){const dir=view==='side'?new THREE.Vector3(1,.08,.2):new THREE.Vector3(.22,.10,1);camera.position.copy(dir.normalize().multiplyScalar(4.8));controls.target.set(0,.1,0);controls.update();}
frame();

function colorInput(){
  const c=document.querySelector('#colorCase').value;
  if(c==='face')return {face:'#d69a78',body:'#7a9b66',main:'#d8b84f'};
  if(c==='body')return {face:null,body:'#7a9b66',main:'#d8b84f'};
  return {face:null,body:null,main:'#d8b84f'};
}
function disposeExtras(){shadowGroup?.removeFromParent();shadowGroup=null;emanataGroup?.removeFromParent();emanataGroup=null;brow?.dispose?.();brow=null;rig?.dispose?.();rig=null;}
function applyZoneDebug(){
  if(document.querySelector('#debug').value!=='zones')return;
  const cols={upper:'#e47355',lower:'#71a67a'};
  for(const e of rig.eyes){
    if(e._up){e._up.material=e._up.material.clone();e._up.material.color.set(cols.upper);}
    if(e._lo){e._lo.material=e._lo.material.clone();e._lo.material.color.set(cols.lower);}
    if(e._puMesh){e._puMesh.material=e._puMesh.material.clone();e._puMesh.material.color.set('#111111');}
  }
  if(brow?.material){brow.material.uniforms.ink.value.set('#7c57a2');}
}
function rebuild(){
  document.documentElement.dataset.kfbEyeActorReady='no';disposeExtras();resolver=resolveSurfaceColor(colorInput());bodyMat.color.set(resolver.color);
  scene.updateMatrixWorld(true);
  rig=new EyeRig(ch,{anchor:{dx:.34,dy:.02,ring:.26,track:.11},baseColor:parseInt(resolver.color.slice(1),16),pupilSize:.38,gloss:.40,lidFit:.88,life:{on:false,wander:0,tremor:0}});
  rig.build();applyEyeShading(rig);
  brow=new BrowRig({THREE,getEyeFrame:()=>rig.eyeFrame(),baseColor:parseInt(resolver.color.slice(1),16),params:{solid:true,round:1,even:true,thickness:1.65,lift:.24}});
  const mode=document.querySelector('#mode').value;
  clayReport=mode==='clay'?applyClayLids(THREE,rig,{thickness:+document.querySelector('#thickness').value,curve:+document.querySelector('#curve').value}):null;
  const p=applyEyeActorPose(rig,brow,document.querySelector('#pose').value);
  if(document.querySelector('#shadow').checked)shadowGroup=mountUnderEyeShadows(THREE,rig);
  emanataGroup=mountEmanata3D(THREE,rig,document.querySelector('#emanata').value);
  applyZoneDebug();resolverEl.textContent='material source: '+resolver.source+' → '+resolver.color;
  title.textContent=mode==='clay'?'Clay Lids candidate':'Exact EyeRig v6 donor';
  document.documentElement.dataset.kfbEyeActorMode=mode;document.documentElement.dataset.kfbEyeActorPose=document.querySelector('#pose').value;document.documentElement.dataset.kfbEyeActorReady='yes';
  status.textContent=(mode==='clay'?('4 clay lids · pupil clearance '+clayReport.pupilClearance.toFixed(4)):'EyeRig v6 shell lids')+' · BrowRig v2 '+p.brow;
}
for(const id of ['mode','pose','debug','emanata','colorCase','shadow'])document.querySelector('#'+id).addEventListener('change',rebuild);
for(const id of ['thickness','curve'])document.querySelector('#'+id).addEventListener('change',rebuild);
document.querySelector('#blink').addEventListener('click',()=>rig?.blinkNow?.());
const clock=new THREE.Clock();
renderer.setAnimationLoop(()=>{
  const dt=Math.min(.05,clock.getDelta());rig?.update?.(dt);brow?.sync?.();controls.update();renderer.render(scene,camera);
  if(rig?.eyes){
    const rotations=rig.eyes.flatMap(e=>[e._up?.rotation.x??0,e._lo?.rotation.x??0]);
    window.__KFB_EYE_ACTOR_STUDIO__={ready:true,mode:document.documentElement.dataset.kfbEyeActorMode,pose:document.documentElement.dataset.kfbEyeActorPose,resolver,clayReport,lidCount:rig.eyes.reduce((n,e)=>n+(e._up?1:0)+(e._lo?1:0),0),clayLidCount:rig.eyes.reduce((n,e)=>n+(e._up?.userData.kfbClayLid?1:0)+(e._lo?.userData.kfbClayLid?1:0),0),lidRotations:rotations,browPreset:document.querySelector('#pose').value,emanata:document.querySelector('#emanata').value};
  }
});
rebuild();
