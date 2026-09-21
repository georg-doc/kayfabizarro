import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';
import {createRgbBrushTexture,applyRgbTriplanarToObject,setRgbTriplanarPalette,setRgbTriplanarScale} from './kfb-rgb-triplanar.v1.js';

const SOURCE_PIN='28766cb9213e4d36160946edf2871c3f7ec798d0';
const CDN='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+SOURCE_PIN+'/';
const ASSETS={
  armchair:{label:'KayKit Furniture Bits · Armchair',path:'media/3D_Assets/KayKit_Furniture_Bits_1.0_FREE/Assets/gltf/armchair.gltf',height:1.75,scale:1.35,palette:['#2b1515','#8f3d32','#e5ad77']},
  pencil:{label:'KayKit RPG Tools Bits · Pencil B short',path:'media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/pencil_B_short.gltf',height:1.65,scale:2.6,palette:['#25272b','#d79c2f','#f1dca8']},
  gothgirl:{label:'KayKit Mystery · GothGirl',path:'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb',height:2.05,scale:1.05,palette:['#151119','#6f315f','#e6c8c7']}
};

const stage=document.getElementById('stage'),statusEl=document.getElementById('status');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(34,1,.02,80);camera.position.set(0,2.25,7.4);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.domElement.className='webgl';stage.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xf7ead8,0x252829,1.6));
const key=new THREE.DirectionalLight(0xffe4bd,2.4);key.position.set(4.5,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
const fill=new THREE.DirectionalLight(0xb9d6ff,.7);fill.position.set(-5,2,-4);scene.add(fill);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(16,8),new THREE.MeshStandardMaterial({color:0x292b29,roughness:.94}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
const divider=new THREE.Mesh(new THREE.BoxGeometry(.018,.008,6.4),new THREE.MeshBasicMaterial({color:0xd9c8aa,transparent:true,opacity:.35}));divider.position.y=.01;scene.add(divider);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,1.05,0);controls.minDistance=3.5;controls.maxDistance=12;controls.maxPolarAngle=Math.PI*.49;

const brush=createRgbBrushTexture(THREE,{seed:0x4b4642,size:256});
brush.canvas.id='rgbMaskCanvas';document.getElementById('maskMount').appendChild(brush.canvas);
const loader=new GLTFLoader();
const loaded=new Map();let current='armchair',error=null;

function resize(){const r=stage.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(.25,r.width/Math.max(1,r.height));camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();

function collectSourceFacts(root){
  let meshes=0,materials=0,textureSlots=0,skinned=0;
  const seen=new Set();root.traverse(n=>{if(!n.isMesh)return;meshes++;if(n.isSkinnedMesh)skinned++;for(const m of (Array.isArray(n.material)?n.material:[n.material])){if(!m||seen.has(m.uuid))continue;seen.add(m.uuid);materials++;for(const k of ['map','alphaMap','aoMap','bumpMap','displacementMap','emissiveMap','lightMap','metalnessMap','normalMap','roughnessMap'])if(m[k])textureSlots++}});
  return{meshes,materials,textureSlots,skinned};
}
function fitDisplay(group,targetHeight,x){
  group.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(group),size=box.getSize(new THREE.Vector3());const s=targetHeight/Math.max(size.y,.001);group.scale.setScalar(s);group.updateMatrixWorld(true);const b2=new THREE.Box3().setFromObject(group);const c=b2.getCenter(new THREE.Vector3());group.position.x+=x-c.x;group.position.y-=b2.min.y;group.position.z-=c.z;group.updateMatrixWorld(true);
}
function disposePair(pair){for(const root of [pair.source,pair.processed]){scene.remove(root);root.traverse(n=>{if(!n.isMesh)return;const mats=Array.isArray(n.material)?n.material:[n.material];for(const m of mats)if(root===pair.processed)m.dispose()})}}
function sourceClone(root){return cloneSkeleton(root)}
function updateStatus(){
  const p=loaded.get(current);if(!p)return;
  const compiled=p.palette.materials.filter(m=>m.userData.kfbRgbTri.shaderCompiled).length;
  statusEl.className='';statusEl.innerHTML='<strong>'+ASSETS[current].label+'</strong><br>'+p.sourceFacts.meshes+' meshes · source texture slots '+p.sourceFacts.textureSlots+' → RGB mode 1 shared texture<br>shader materials '+compiled+'/'+p.palette.materials.length+' compiled';
}
function applyUi(spec,pair){
  const ids=['r','g','b'];ids.forEach((id,i)=>document.getElementById(id).value=spec.palette[i]);
  document.getElementById('scale').value=String(spec.scale);document.getElementById('scaleOut').textContent=spec.scale.toFixed(2);
  setRgbTriplanarPalette(pair.palette.materials,THREE,spec.palette);setRgbTriplanarScale(pair.palette.materials,spec.scale);
}
async function loadAsset(id){
  if(loaded.has(id))return loaded.get(id);
  const spec=ASSETS[id];const gltf=await loader.loadAsync(CDN+spec.path);
  const base=gltf.scene;const source=sourceClone(base),processed=sourceClone(base);
  const sourceFacts=collectSourceFacts(source);
  source.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});
  const palette=applyRgbTriplanarToObject(THREE,processed,{texture:brush.texture,palette:spec.palette,scale:spec.scale,strength:1});
  source.visible=processed.visible=false;scene.add(source,processed);fitDisplay(source,spec.height,-1.75);fitDisplay(processed,spec.height,1.75);
  const pair={id,spec,source,processed,sourceFacts,palette};loaded.set(id,pair);return pair;
}
async function selectAsset(id){
  if(!ASSETS[id])throw new Error('unknown asset '+id);
  window.__KFB_RGB_TRIPLANAR__.ready=false;
  try{
    for(const p of loaded.values()){p.source.visible=false;p.processed.visible=false}
    statusEl.textContent='Loading '+ASSETS[id].label+'…';
    const pair=await loadAsset(id);current=id;pair.source.visible=pair.processed.visible=true;applyUi(ASSETS[id],pair);
    for(const b of document.querySelectorAll('[data-asset]'))b.classList.toggle('active',b.dataset.asset===id);
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));updateStatus();window.__KFB_RGB_TRIPLANAR__.ready=true;error=null;
  }catch(e){error=String(e?.stack||e);statusEl.className='error';statusEl.textContent='SOURCE ASSET FAILED · '+error;window.__KFB_RGB_TRIPLANAR__.error=error;throw e}
}
function setPaletteFromInputs(){const p=loaded.get(current);if(!p)return;const palette=['r','g','b'].map(id=>document.getElementById(id).value);ASSETS[current].palette=palette;setRgbTriplanarPalette(p.palette.materials,THREE,palette);updateStatus()}
for(const b of document.querySelectorAll('[data-asset]'))b.onclick=()=>selectAsset(b.dataset.asset);
for(const id of ['r','g','b'])document.getElementById(id).oninput=setPaletteFromInputs;
document.getElementById('scale').oninput=e=>{const v=Number(e.target.value),p=loaded.get(current);ASSETS[current].scale=v;document.getElementById('scaleOut').textContent=v.toFixed(2);if(p)setRgbTriplanarScale(p.palette.materials,v)};

window.__KFB_RGB_TRIPLANAR__={
  version:'0.1-candidate',build:'KFB-RGB-TRI-01',ready:false,error:null,sourcePin:SOURCE_PIN,
  donor:{path:'media/3D_Assets/pet-surface.v1.js',blob:'ceffefe20ec46d82f6c0da0d6369be53f7ea4b24',reuse:'triplanar weight + three-plane sampling grammar'},
  singleTexture:{uuid:brush.texture.uuid,name:brush.texture.name,size:brush.size,seed:brush.seed},
  selectAsset,
  snapshot:()=>{
    const p=loaded.get(current);const allMaterials=[...loaded.values()].flatMap(x=>x.palette.materials);return{
      ready:window.__KFB_RGB_TRIPLANAR__.ready,error,asset:current,label:ASSETS[current].label,path:ASSETS[current].path,
      source:p?.sourceFacts||null,processed:p?{meshes:p.palette.meshes,materials:p.palette.materials.length,removedTextureSlots:p.palette.removedTextureSlots,compiled:p.palette.materials.filter(m=>m.userData.kfbRgbTri.shaderCompiled).length}:null,
      sourceVisible:!!p?.source.visible,processedVisible:!!p?.processed.visible,palette:[...ASSETS[current].palette],scale:ASSETS[current].scale,
      sharedTextureUuid:brush.texture.uuid,uniqueProcessedTextureUuids:[...new Set(allMaterials.map(m=>m.userData.kfbRgbTri.sharedTextureUuid))],loadedAssets:[...loaded.keys()],
      canvas:{width:brush.canvas.width,height:brush.canvas.height},ownership:{surfaceDonor:'media/3D_Assets/pet-surface.v1.js',toolbox:'candidate adapter only',consumerRuntime:'unchanged',registry:'read-only'}
    };
  }
};

const clock=new THREE.Clock();renderer.setAnimationLoop(()=>{clock.getDelta();controls.update();renderer.render(scene,camera);if(window.__KFB_RGB_TRIPLANAR__.ready)updateStatus()});
selectAsset('armchair').catch(()=>{});
