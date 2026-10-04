import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {mountEumelThree2p5D} from './eumel-three2p5d.v0.1.js';

const $=q=>document.querySelector(q),stage=$('#stage'),status=$('#status');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(2,devicePixelRatio||1));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;stage.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0xdce7ef);
const camera=new THREE.PerspectiveCamera(32,1,.01,100);camera.position.set(3.1,1.55,4.8);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1.0,0);controls.enableDamping=true;controls.minDistance=2.4;controls.maxDistance=8;
scene.add(new THREE.HemisphereLight(0xffffff,0x6f8065,1.3));const sun=new THREE.DirectionalLight(0xffffff,1.7);sun.position.set(3,6,4);sun.castShadow=true;scene.add(sun);
const ground=new THREE.Mesh(new THREE.CircleGeometry(3.1,64),new THREE.MeshStandardMaterial({color:0xbfd39b,roughness:.92}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const ring=new THREE.Mesh(new THREE.RingGeometry(2.6,2.66,64),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.55,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.004;scene.add(ring);
const actorParent=new THREE.Group();scene.add(actorParent);

let actor;
try{
 actor=await mountEumelThree2p5D({
  THREE,parent:actorParent,camera,
  svgUrl:'../../labs/eumel-rig-lab/source-assets/EUMEL_SOURCE_COMPONENTS.svg',
  bindUrl:'../../labs/eumel-rig-lab/data/neutral_bind_pose.json',
  worldHeight:2.0,facingPolicy:'upright-yaw-billboard',EyeRigClass:window.KFBEyeRig2D
 });
 status.textContent='IMPLEMENTATION LOADED';status.className='pass';
}catch(e){
 window.__KFB_EUMEL_2P5D_ERROR__=String(e.stack||e);
 status.textContent='FAIL';status.className='fail';$('#debug').textContent=e.stack||String(e);throw e
}

$('#facing').onchange=e=>actor.setFacingPolicy(e.target.value);
$('#state').onchange=e=>actor.setState(e.target.value);
$('#orbit').onchange=e=>controls.enabled=e.target.checked;
$('#blink').onclick=()=>actor.eyeRig.blinkNow();
$('#neutral').onclick=()=>{$('#state').value='neutral';actor.setState('neutral');actor.eyeRig.setGazeFollow(true);actor.eyeRig.pointTo(0,0)};
function snapshot(){
 const frame=actor.eyeRig.eyeFrame();
 return {
  ready:true,
  state:$('#state').value,
  facing:$('#facing').value,
  worldHeight:actor.meta.worldHeight,
  scale:+actor.meta.scale.toFixed(6),
  eyeRadius:+frame.radius.toFixed(6),
  diagnostics:actor.diagnostics(),
  canvas:{width:renderer.domElement.width,height:renderer.domElement.height}
 };
}
window.__KFB_EUMEL_2P5D__={
 snapshot,
 setState(v){$('#state').value=v;actor.setState(v);},
 setFacing(v){$('#facing').value=v;actor.setFacingPolicy(v);},
 blink(){actor.eyeRig.blinkNow();},
 dispose(){ro.disconnect();actor.dispose();renderer.dispose();}
};
window.__KFB_EUMEL_2P5D_READY__=true;

const ro=new ResizeObserver(()=>{const r=stage.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(.1,r.width/Math.max(1,r.height));camera.updateProjectionMatrix()});ro.observe(stage);
let last=performance.now();
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;controls.update();actor.update(dt,{camera,velocity:$('#state').value==='walk'?1:0});renderer.render(scene,camera);$('#debug').textContent=JSON.stringify(snapshot(),null,2);requestAnimationFrame(frame)}
requestAnimationFrame(frame);
