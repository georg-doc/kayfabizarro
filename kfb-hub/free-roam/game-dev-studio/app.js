import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const $=id=>document.getElementById(id);
const canvas=$('view'),wrap=$('canvasWrap');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(36,1,.01,200);
camera.position.set(3,2.4,4.5);
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.autoRotate=false;controls.autoRotateSpeed=.8;
scene.add(new THREE.HemisphereLight(0xffffff,0x44515a,2.1));
const key=new THREE.DirectionalLight(0xffffff,2.2);key.position.set(4,7,5);scene.add(key);
const grid=new THREE.GridHelper(14,28,0x65747b,0x334047);grid.material.transparent=true;grid.material.opacity=.28;scene.add(grid);
const loader=new GLTFLoader();
let model=null,overlay=new THREE.Group(),catalog=null,current=null,showEvidence=true;
scene.add(overlay);

function clearGroup(root){
  if(!root)return;root.traverse(o=>{if(o.geometry)o.geometry.dispose?.();for(const m of [].concat(o.material||[])){if(!m)continue;for(const v of Object.values(m))if(v?.isTexture)v.dispose?.();m.dispose?.();}});
  root.removeFromParent();
}
function clearOverlay(){while(overlay.children.length){const o=overlay.children.pop();o.traverse?.(n=>{n.geometry?.dispose?.();[].concat(n.material||[]).forEach(m=>m?.dispose?.())})}}
function resize(){
  const r=wrap.getBoundingClientRect(),w=Math.max(1,Math.floor(r.width)),h=Math.max(1,Math.floor(r.height));
  if(canvas.width!==w||canvas.height!==h){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
}
function fit(object){
  const box=new THREE.Box3().setFromObject(object);if(box.isEmpty())return;
  const size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),max=Math.max(size.x,size.y,size.z);
  const dist=max/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)))*1.5;
  camera.position.copy(center).add(new THREE.Vector3(dist*.8,dist*.55,dist));
  controls.target.copy(center);controls.minDistance=max*.35;controls.maxDistance=Math.max(max*8,8);controls.update();
  grid.position.y=box.min.y;
}
async function addSedanEvidence(asset){
  clearOverlay();if(!asset.colliderSpec||!showEvidence)return;
  try{
    const [c,w]=await Promise.all([fetch(asset.colliderSpec,{cache:'no-store'}).then(r=>r.json()),fetch(asset.wheelReport,{cache:'no-store'}).then(r=>r.json())]);
    const a=c.derivation.sourceAabb,size=new THREE.Vector3(...a.size),center=new THREE.Vector3(...a.center);
    const solid=new THREE.BoxGeometry(size.x,size.y,size.z),edges=new THREE.EdgesGeometry(solid);solid.dispose();
    const box=new THREE.LineSegments(edges,new THREE.LineBasicMaterial({color:0xf2c96c,transparent:true,opacity:.82}));
    box.position.copy(center);overlay.add(box);
    for(const wheel of w.wheels||[]){const p=new THREE.Vector3(...wheel.sourcePosition);const marker=new THREE.Mesh(new THREE.SphereGeometry(.026,14,10),new THREE.MeshBasicMaterial({color:0x8fd8ae}));marker.position.copy(p);overlay.add(marker)}
  }catch(e){console.warn('Evidence overlay unavailable',e)}
}
function facts(asset){
  const rows=[['Status',asset.status],['Role',asset.role],['Format',asset.format.toUpperCase()],['Revision',asset.revision.slice(0,12)],['Path',asset.sourcePath]];
  $('facts').replaceChildren(...rows.flatMap(([a,b])=>{const k=document.createElement('b'),v=document.createElement('span');k.textContent=a;v.textContent=b;return[k,v]}));
}
async function select(asset){
  current=asset;document.querySelectorAll('.asset').forEach(b=>b.dataset.active=String(b.dataset.id===asset.id));
  $('kind').textContent=asset.kind;$('title').textContent=asset.label;$('role').textContent=asset.role;facts(asset);
  const evidenceAvailable=!!(asset.colliderSpec&&asset.wheelReport);$('wire').hidden=!evidenceAvailable;$('wire').textContent=showEvidence?'Hide evidence':'Show evidence';
  $('sourceLink').href=asset.githubUrl;$('packageLink').href=asset.packagePath;$('stageTitle').textContent=asset.label;
  $('stageStatus').textContent='Loading pinned '+asset.format.toUpperCase()+'…';
  if(model){clearGroup(model);model=null}clearOverlay();
  try{
    const gltf=await loader.loadAsync(asset.previewUrl);model=gltf.scene;scene.add(model);model.updateMatrixWorld(true);fit(model);
    await addSedanEvidence(asset);$('stageStatus').textContent='Pinned source loaded · orbit / zoom enabled';
  }catch(e){$('stageStatus').textContent='Preview failed: '+e.message;console.error(e)}
}
function renderAssets(list){
  const bar=$('assetbar');bar.replaceChildren();
  for(const a of list){const b=document.createElement('button');b.className='asset';b.dataset.id=a.id;b.innerHTML='<strong>'+a.label+'</strong><small>'+a.kind+' · '+a.status+'</small>';b.onclick=()=>select(a);bar.append(b)}
}
async function init(){
  const r=await fetch('/tools/game-dev-studio/catalog.json',{cache:'no-store'});if(!r.ok)throw Error('catalog '+r.status);catalog=await r.json();
  const p=catalog.packages[0];$('packageTitle').textContent=p.title;$('packageSubtitle').textContent=p.subtitle+' · '+p.status;$('manifestLink').href=p.manifest;$('testLink').href=p.consumerPlan;
  const vehicle=p.receiverHandoff?.donor?'Sedan → '+p.receiverHandoff.donor+': adapter ready, Sedan runtime test open':'Sedan receiver open';
  const resident=p.residentHandoff?.consumer?'Lorekeeper → '+p.residentHandoff.consumer+': '+p.residentHandoff.status.replaceAll('_',' ').toLowerCase():'Lorekeeper consumer open';
  $('packageNote').textContent=vehicle+' · '+resident+'. Preview evidence is not consumer or human acceptance.';
  renderAssets(p.assets);await select(p.assets[0]);window.__KFB_GAME_DEV_STUDIO__={catalog,select:id=>select(p.assets.find(a=>a.id===id)),snapshot:()=>({package:p.id,asset:current?.id,showEvidence,evidenceAvailable:!!(current?.colliderSpec&&current?.wheelReport),evidenceObjects:overlay.children.length,catalogRevision:catalog.catalogRevision})};window.__KFB_GAME_DEV_STUDIO_READY__=true;
}
$('fit').onclick=()=>model&&fit(model);$('spin').onclick=()=>{controls.autoRotate=!controls.autoRotate;$('spin').textContent=controls.autoRotate?'Stop rotate':'Auto rotate'};$('wire').onclick=()=>{showEvidence=!showEvidence;if(current?.id==='car-sedan')addSedanEvidence(current);$('wire').textContent=showEvidence?'Hide evidence':'Show evidence'};
function frame(){resize();controls.update();renderer.render(scene,camera);requestAnimationFrame(frame)}requestAnimationFrame(frame);
init().catch(e=>{$('stageStatus').textContent='Cannot start: '+e.message;window.__KFB_GAME_DEV_STUDIO_ERROR__=String(e.stack||e);console.error(e)});
