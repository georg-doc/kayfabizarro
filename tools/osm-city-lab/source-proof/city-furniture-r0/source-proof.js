import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const manifest=await fetch('./SOURCE.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('SOURCE.json '+r.status);return r.json();});
const canvas=document.querySelector('#view');
const buttons=document.querySelector('#buttons');
const title=document.querySelector('#title');
const meta=document.querySelector('#meta');

const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.shadowMap.enabled=true;
const scene=new THREE.Scene();
scene.background=new THREE.Color('#c6d7dc');
scene.add(new THREE.HemisphereLight(0xffffff,0x5b5865,2.5));
const sun=new THREE.DirectionalLight(0xfff1d0,3);
sun.position.set(-3,6,5);sun.castShadow=true;scene.add(sun);
const camera=new THREE.PerspectiveCamera(40,1,.01,100);
const controls=new OrbitControls(camera,canvas);
controls.enableDamping=true;controls.dampingFactor=.12;

const reference=new THREE.GridHelper(5,10,0x776d82,0xb4a8b8);
reference.position.y=-.002;scene.add(reference);
const loader=new GLTFLoader();
let active=null;
let report={loaded:false};

function resize(){
  const r=canvas.getBoundingClientRect();
  renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);
  camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(canvas);resize();

function disposeActive(){
  if(!active)return;
  scene.remove(active);
  active=null;
}

function rawBounds(object){
  object.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(object);
  const size=new THREE.Vector3();box.getSize(size);
  const center=new THREE.Vector3();box.getCenter(center);
  return {box,size,center};
}

async function show(index){
  const donor=manifest.donors[(index+manifest.donors.length)%manifest.donors.length];
  const u=new URL(location.href);u.searchParams.set('asset',donor.id);history.replaceState(null,'',u);
  [...buttons.querySelectorAll('button')].forEach((b,i)=>b.classList.toggle('active',i===manifest.donors.indexOf(donor)));
  title.textContent='Loading · '+donor.label;
  meta.textContent=donor.path;
  disposeActive();
  report={loaded:false,id:donor.id,path:donor.path};
  try{
    const gltf=await loader.loadAsync(donor.path);
    const object=gltf.scene;
    const raw=rawBounds(object);
    const extent=Math.max(raw.size.x,raw.size.y,raw.size.z)||1;
    const viewScale=2.25/extent;
    object.scale.setScalar(viewScale);
    object.updateMatrixWorld(true);
    const scaled=rawBounds(object);
    object.position.x-=scaled.center.x;
    object.position.z-=scaled.center.z;
    object.position.y-=scaled.box.min.y;
    object.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true;}});
    scene.add(object);active=object;
    const meshNames=[];
    object.traverse(n=>{if(n.isMesh)meshNames.push(n.name||'(unnamed mesh)');});
    camera.position.set(3.2,2.35,4.2);
    controls.target.set(0,1.05,0);
    camera.near=.01;camera.far=100;camera.updateProjectionMatrix();controls.update();
    const b={
      min:[raw.box.min.x,raw.box.min.y,raw.box.min.z].map(v=>+v.toFixed(5)),
      max:[raw.box.max.x,raw.box.max.y,raw.box.max.z].map(v=>+v.toFixed(5)),
      size:[raw.size.x,raw.size.y,raw.size.z].map(v=>+v.toFixed(5))
    };
    report={loaded:true,id:donor.id,label:donor.label,path:donor.path,role:donor.role,rawBounds:b,viewScale:+viewScale.toFixed(6),meshNames};
    title.textContent=donor.label+' · '+donor.role;
    meta.textContent=donor.path+' · raw size '+b.size.join(' × ')+' · mesh '+meshNames.join(', ');
  }catch(error){
    console.error(error);
    report={loaded:false,id:donor.id,path:donor.path,error:String(error)};
    title.textContent='SOURCE LOAD FAILED · '+donor.label;
    meta.textContent=String(error);
  }
}

manifest.donors.forEach((d,i)=>{
  const b=document.createElement('button');b.className='donor';b.textContent=d.label.replace('KayKit · ','').replace('Kenney · ','');
  b.onclick=()=>show(i);buttons.appendChild(b);
});
const requested=new URLSearchParams(location.search).get('asset');
const initial=Math.max(0,manifest.donors.findIndex(d=>d.id===requested));
await show(initial);
window.KFBCityFurnitureSourceProof=Object.freeze({report:()=>structuredClone(report),manifest:()=>structuredClone(manifest)});

(function loop(){requestAnimationFrame(loop);controls.update();renderer.render(scene,camera);})();
