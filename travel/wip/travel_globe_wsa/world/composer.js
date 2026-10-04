import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const view = document.querySelector('#view');
const recipeEl = document.querySelector('#recipe');
const selEl = document.querySelector('#sel');
const assetEl = document.querySelector('#assets');
const candidateEl = document.querySelector('#candidate');
const loader = new GLTFLoader();
const STORAGE_KEY = 'kfb.world-composer.poc.v0';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x11151c);
scene.fog = new THREE.FogExp2(0x11151c, 0.008);

const camera = new THREE.PerspectiveCamera(46, 1, 0.05, 500);
camera.position.set(11, 8, 13);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
view.prepend(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.target.set(0, 1, 0);
orbit.maxPolarAngle = Math.PI * 0.495;

scene.add(new THREE.HemisphereLight(0xe9f1ff, 0x3b2f28, 2.0));
const key = new THREE.DirectionalLight(0xffd4a8, 3.0);
key.position.set(-8, 14, 9);
key.castShadow = true;
scene.add(key);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshStandardMaterial({color:0x2a3037,roughness:1}));
ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;ground.userData.pocGround=true;scene.add(ground);
const grid=new THREE.GridHelper(80,80,0x647080,0x39414b);grid.position.y=.003;scene.add(grid);

const objects=[];let selected=null,selectedHelper=null,pending=null,groundSnap=true,idCounter=1;
const transform=new TransformControls(camera,renderer.domElement);transform.setMode('translate');transform.setSize(.75);
transform.addEventListener('dragging-changed',e=>orbit.enabled=!e.value);
transform.addEventListener('mouseUp',()=>{if(selected&&groundSnap&&transform.getMode()==='translate')snapToGround(selected);refreshSelection();refreshRecipe()});
transform.addEventListener('objectChange',()=>{selectedHelper?.update();refreshSelection()});scene.add(transform);

function resize(){const r=view.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=Math.max(.1,r.width/Math.max(1,r.height));camera.updateProjectionMatrix()}window.addEventListener('resize',resize);resize();
(function animate(){requestAnimationFrame(animate);orbit.update();renderer.render(scene,camera)})();

const safeName=v=>String(v||'').split('/').pop()?.replace(/\.(glb|gltf)$/i,'')||'asset';
const encodedPath=path=>String(path||'').split('/').map(encodeURIComponent).join('/');
function assetUrl(asset,packet={}){const source=asset.source||{};if(source.rawPinned)return source.rawPinned;if(source.rawLatest)return source.rawLatest;if(asset.url&&/^https?:/i.test(asset.url))return asset.url;const path=asset.path||asset.assetPath||asset.assetId;if(!path)return null;const repo=source.repo||packet.sourceRepo||'georg-doc/kayfabizarro',ref=source.commit||packet.sourceCommit||'main';return `https://raw.githubusercontent.com/${repo}/${ref}/${encodedPath(path)}`}
function collectAssets(packet){const out=[],seen=new Set();const visit=v=>{if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(visit);return}const path=v.path||v.assetPath||v.assetId;if(path&&/\.(glb|gltf)$/i.test(path)){const url=assetUrl(v,packet),k=`${path}|${url||''}`;if(!seen.has(k)){seen.add(k);out.push({name:v.name||safeName(path),path,url,source:v.source||{},kind:v.kind||'model-3d'})}}Object.values(v).forEach(visit)};visit(packet.assets||packet);return out}
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderAssetButtons(list){assetEl.innerHTML='';if(!list.length){assetEl.innerHTML='<p class="help">No GLB/GLTF refs found.</p>';return}list.forEach(asset=>{const div=document.createElement('div');div.className='asset';div.innerHTML=`<b>${escapeHtml(asset.name)}</b><code>${escapeHtml(asset.path||asset.url||'')}</code>`;const b=document.createElement('button');b.textContent='Place';b.disabled=!asset.url;b.onclick=()=>{pending=asset;setHudPending()};div.appendChild(b);assetEl.appendChild(div)})}
function setHudPending(){const hud=document.querySelector('.hud');if(!hud.dataset.base)hud.dataset.base=hud.innerHTML;hud.innerHTML=pending?`<b>PLACE:</b> ${escapeHtml(pending.name)} · click authoring ground · Esc cancels`:hud.dataset.base}
async function instantiate(asset,position=new THREE.Vector3(),opts={}){if(!asset.url)throw new Error('No loadable URL for asset');const gltf=await loader.loadAsync(asset.url),root=SkeletonUtils.clone(gltf.scene);root.name=asset.name||safeName(asset.path||asset.url);root.traverse(n=>{n.castShadow=!!n.isMesh;n.receiveShadow=!!n.isMesh});root.position.copy(position);if(opts.rotation)root.rotation.set(...opts.rotation);if(opts.scale)root.scale.set(...opts.scale);root.userData.kfbPoc={id:opts.id||`poc-${idCounter++}`,name:asset.name||root.name,path:asset.path||null,url:asset.url,source:asset.source||{},coordinateSpace:'poc-local',candidateOnly:true};scene.add(root);objects.push(root);if(groundSnap)snapToGround(root);select(root);refreshRecipe();return root}
function snapToGround(obj){obj.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(obj);if(!Number.isFinite(box.min.y))return;obj.position.y+=-box.min.y;obj.updateMatrixWorld(true);selectedHelper?.update()}
function objectFromHit(hit){let o=hit?.object;while(o&&!o.userData?.kfbPoc)o=o.parent;return o||null}
function select(obj){selected=obj;transform.detach();if(selectedHelper){scene.remove(selectedHelper);selectedHelper.dispose?.();selectedHelper=null}if(obj){transform.attach(obj);selectedHelper=new THREE.BoxHelper(obj,0x9b8cff);scene.add(selectedHelper)}refreshSelection()}
function refreshSelection(){if(!selected){selEl.textContent='Nothing selected.';return}selected.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(selected),size=box.getSize(new THREE.Vector3()),d=selected.userData.kfbPoc;selEl.innerHTML=`<b>${escapeHtml(d.name)}</b><br><code>${escapeHtml(d.path||d.url)}</code><br>size ${size.x.toFixed(3)} × ${size.y.toFixed(3)} × ${size.z.toFixed(3)}<br>pos ${selected.position.toArray().map(v=>v.toFixed(3)).join(', ')}<br>rot ${[selected.rotation.x,selected.rotation.y,selected.rotation.z].map(v=>v.toFixed(3)).join(', ')}<br>scale ${selected.scale.toArray().map(v=>v.toFixed(3)).join(', ')}`}
function serialize(){return{schema:'kfb.world-recipe.v0-poc',status:'candidate-only',purpose:'World Authoring UX POC; requires Travel validation/promotion',coordinateSpace:'poc-local',ownerBoundary:{runtimeSSOT:'georg-doc/KFB-Travel-Globe',terrainMovementSave:'NOT OWNED HERE'},updated:new Date().toISOString(),instances:objects.map(o=>({id:o.userData.kfbPoc.id,name:o.userData.kfbPoc.name,assetPath:o.userData.kfbPoc.path,assetUrl:o.userData.kfbPoc.url,source:o.userData.kfbPoc.source,anchor:{type:'poc-local',position:o.position.toArray(),rotation:[o.rotation.x,o.rotation.y,o.rotation.z],scale:o.scale.toArray(),groundSnap}}))}}
function refreshRecipe(){recipeEl.textContent=JSON.stringify(serialize(),null,2)}
async function restore(recipe){clearAll();for(const i of recipe.instances||[]){const a={name:i.name,path:i.assetPath,url:i.assetUrl,source:i.source||{}},p=new THREE.Vector3(...(i.anchor?.position||[0,0,0]));await instantiate(a,p,{id:i.id,rotation:i.anchor?.rotation,scale:i.anchor?.scale})}select(null);refreshRecipe()}
function clearAll(){select(null);while(objects.length)scene.remove(objects.pop());refreshRecipe()}
function frameSelected(){if(!selected)return;const box=new THREE.Box3().setFromObject(selected),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3()).length(),dir=new THREE.Vector3(1,.65,1).normalize();camera.position.copy(center).add(dir.multiplyScalar(Math.max(2.5,size*1.6)));orbit.target.copy(center);orbit.update()}
function duplicateSelected(){if(!selected)return;const d=selected.userData.kfbPoc;instantiate({name:d.name,path:d.path,url:d.url,source:d.source},selected.position.clone().add(new THREE.Vector3(1,0,1)),{rotation:[selected.rotation.x,selected.rotation.y,selected.rotation.z],scale:selected.scale.toArray()}).catch(showError)}
function removeSelected(){if(!selected)return;const i=objects.indexOf(selected);if(i>=0)objects.splice(i,1);scene.remove(selected);select(null);refreshRecipe()}
function showError(err){console.error(err);alert(`POC load error: ${err.message||err}`)}
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();renderer.domElement.addEventListener('pointerdown',async e=>{if(transform.dragging)return;const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;ray.setFromCamera(pointer,camera);if(pending){const h=ray.intersectObject(ground,false)[0];if(!h)return;const a=pending;pending=null;setHudPending();try{await instantiate(a,h.point)}catch(err){showError(err)}return}const hits=ray.intersectObjects(objects,true);select(hits.length?objectFromHit(hits[0]):null)});
window.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;if(e.key==='Escape'){pending=null;setHudPending()}if(e.key.toLowerCase()==='w')transform.setMode('translate');if(e.key.toLowerCase()==='e')transform.setMode('rotate');if(e.key.toLowerCase()==='r')transform.setMode('scale');if(e.key==='Delete'||e.key==='Backspace')removeSelected();document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===transform.getMode()))});
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{transform.setMode(b.dataset.mode);document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x===b))});
document.querySelector('#snap').onclick=e=>{groundSnap=!groundSnap;e.currentTarget.classList.toggle('active',groundSnap);if(selected&&groundSnap){snapToGround(selected);refreshSelection();refreshRecipe()}};
document.querySelector('#parse').onclick=()=>{try{renderAssetButtons(collectAssets(JSON.parse(candidateEl.value)))}catch(e){showError(e)}};
document.querySelector('#demo').onclick=()=>{const packet={sourceRepo:'georg-doc/kayfabizarro',sourceCommit:'main',assets:[{name:'Caveman',path:'media/3D_Assets/KayKit_Mystery_Series6/Caveman/characters/Caveman.glb'},{name:'GothGirl',path:'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb'}]};candidateEl.value=JSON.stringify(packet,null,2);renderAssetButtons(collectAssets(packet))};
document.querySelector('#addUrl').onclick=()=>{const url=document.querySelector('#directUrl').value.trim();if(!url)return;pending={name:document.querySelector('#directName').value.trim()||safeName(url),url,path:null,source:{provenance:'direct-url-poc'}};setHudPending()};
document.querySelector('#duplicate').onclick=duplicateSelected;document.querySelector('#remove').onclick=removeSelected;document.querySelector('#frame').onclick=frameSelected;document.querySelector('#save').onclick=()=>localStorage.setItem(STORAGE_KEY,JSON.stringify(serialize()));document.querySelector('#load').onclick=()=>{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return alert('No local POC recipe saved.');restore(JSON.parse(raw)).catch(showError)};document.querySelector('#copy').onclick=async()=>{await navigator.clipboard.writeText(JSON.stringify(serialize(),null,2))};document.querySelector('#download').onclick=()=>{const blob=new Blob([JSON.stringify(serialize(),null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='kfb-world-recipe-poc.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
refreshRecipe();
