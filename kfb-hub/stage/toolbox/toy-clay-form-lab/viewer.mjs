import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {buildSample,PART_BUDGETS} from '../../../../tools/KFB-ToolBox/toy-clay-form-lab/lib/samples.mjs';

const DONOR='/media/3D_Assets/Tiny_Treats_Charming_Kitchen_1.1_FREE/Assets/gltf/toaster.gltf';
const stage=document.querySelector('#stage'),canvas=document.querySelector('#view'),status=document.querySelector('#status'),note=document.querySelector('#note'),title=document.querySelector('#title');
const scene=new THREE.Scene();scene.background=new THREE.Color('#d9e0dc');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const camera=new THREE.PerspectiveCamera(38,1,.05,100),controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.49;
scene.add(new THREE.HemisphereLight(0xfffbef,0x626b66,2.0));const sun=new THREE.DirectionalLight(0xffeed7,3.1);sun.position.set(-7,10,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
const floor=new THREE.Mesh(new THREE.CylinderGeometry(6,6.2,.32,48),new THREE.MeshStandardMaterial({color:'#b8c2af',roughness:1,metalness:0}));floor.position.y=-.18;floor.receiveShadow=true;scene.add(floor);
const content=new THREE.Group();scene.add(content);const loader=new GLTFLoader();let root=null,currentView='oblique';

function resize(){const r=stage.getBoundingClientRect();if(r.width<1||r.height<1)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(stage);
function disposeRoot(){if(!root)return;content.remove(root);root.traverse(o=>{if(o.isMesh){o.geometry?.dispose?.();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose?.());else o.material?.dispose?.();}});root=null;}
function markSource(obj){obj.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.userData.kfbDonorMesh=true;}});}
function normalizeDonor(obj){obj.updateMatrixWorld(true);let b=new THREE.Box3().setFromObject(obj),s=b.getSize(new THREE.Vector3());const k=3.8/Math.max(s.x,s.y,s.z);obj.scale.multiplyScalar(k);obj.updateMatrixWorld(true);b=new THREE.Box3().setFromObject(obj);const c=b.getCenter(new THREE.Vector3());obj.position.x-=c.x;obj.position.z-=c.z;obj.position.y-=b.min.y;obj.updateMatrixWorld(true);}
function stats(obj){let meshes=0,parts=0,triangles=0;obj.traverse(o=>{if(!o.isMesh)return;meshes++;if(o.userData.kfbToyPart)parts++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;});return {meshes,parts,triangles:Math.round(triangles)};}
function frame(view=currentView){currentView=view;const box=new THREE.Box3().setFromObject(content),sphere=box.getBoundingSphere(new THREE.Sphere()),c=sphere.center,r=Math.max(.8,sphere.radius);const dirs={oblique:[1,.72,1.15],front:[0,.18,1],side:[1,.18,0]},dir=new THREE.Vector3(...(dirs[view]||dirs.oblique)).normalize();const vf=THREE.MathUtils.degToRad(camera.fov),hf=2*Math.atan(Math.tan(vf/2)*camera.aspect),dist=r/Math.sin(Math.min(vf,hf)/2)*1.18;controls.target.copy(c);camera.position.copy(c).addScaledVector(dir,dist);camera.near=Math.max(.02,dist/200);camera.far=dist+r*10;camera.updateProjectionMatrix();controls.update();}
async function load(id){
  document.documentElement.dataset.kfbToyReady='no';document.documentElement.dataset.kfbToyModel=id;disposeRoot();status.textContent='Loading…';
  if(id==='donor'){const gltf=await loader.loadAsync(DONOR);root=gltf.scene;markSource(root);normalizeDonor(root);content.add(root);title.textContent='Tiny Treats · toaster';note.textContent='Exact source object isolated first · no procedural replacement';}
  else{root=buildSample(THREE,id);content.add(root);const names={panel:'Rounded panel · 3 buttons',eiffel:'Eiffel · toy icon',cologne:'Cologne Cathedral · toy icon'};title.textContent=names[id];note.textContent='KFB Toy/Clay candidate · macro forms + visible rounding + hard part budget';}
  resize();frame('oblique');const s=stats(root),budget=id==='donor'?'source':PART_BUDGETS[id];
  status.textContent=id==='donor'?(s.meshes+' source mesh · '+s.triangles+' triangles'):(s.parts+'/'+budget+' parts · '+s.triangles+' triangles');
  window.__KFB_TOY_LAB__={ready:true,model:id,donor:id==='donor'?DONOR:null,stats:s,budget,landmarkDefaultUnchanged:'city-grotesque'};
  document.documentElement.dataset.kfbToyPartCount=String(s.parts);document.documentElement.dataset.kfbToyReady='yes';
}
document.querySelector('#model').addEventListener('change',e=>load(e.target.value).catch(fail));
document.querySelector('#wire').addEventListener('change',e=>root?.traverse(o=>{if(o.isMesh){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.wireframe=e.target.checked);}}));
for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>frame(b.dataset.view));
function fail(e){console.error(e);status.textContent='FAILED: '+e.message;document.documentElement.dataset.kfbToyReady='error';window.__KFB_TOY_LAB__={ready:false,error:String(e)};}
renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera);});load('donor').catch(fail);
