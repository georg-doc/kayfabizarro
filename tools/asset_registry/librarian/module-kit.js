import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { $, fetchJSON } from './state.js';
import { visibleMeshBounds, framePerspectiveCamera } from './framing3d.js';

const INDEX_URL='../module-kits/index.json';
let kitIndex={kits:[]},current=null,library=null,renderer=null,scene=null,camera=null,controls=null,root=null,token=0;
const workState={ready:false,packId:null,sampleId:null,errors:[],measurements:{},sourceCommit:null};
const loader=new GLTFLoader();
const cloneState=()=>JSON.parse(JSON.stringify(workState));
window.KFBModuleKitWorkbench={getState:cloneState,openSample:(id)=>loadSample(id)};

function disposeTree(node){node?.traverse((o)=>{o.geometry?.dispose?.();for(const m of (Array.isArray(o.material)?o.material:[o.material]).filter(Boolean)){for(const v of Object.values(m))if(v?.isTexture)v.dispose?.();m.dispose?.();}});}
function clearScene(){if(root&&scene){scene.remove(root);disposeTree(root);}root=null;workState.ready=false;workState.errors=[];workState.measurements={};document.documentElement.dataset.moduleKitReady='0';}
function initViewer(){
  if(renderer)return;
  const canvas=$('moduleKitCanvas');
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;
  scene=new THREE.Scene();scene.background=new THREE.Color(0xe7e1d4);camera=new THREE.PerspectiveCamera(42,1,.01,4000);controls=new OrbitControls(camera,canvas);controls.enableDamping=true;
  scene.add(new THREE.HemisphereLight(0xffffff,0x777777,2.3));const key=new THREE.DirectionalLight(0xffffff,2.2);key.position.set(5,8,4);scene.add(key);const grid=new THREE.GridHelper(20,20);grid.position.y=-.002;scene.add(grid);
  const resize=()=>{const r=canvas.getBoundingClientRect();renderer.setSize(Math.max(1,Math.round(r.width)),Math.max(1,Math.round(r.height)),false);camera.aspect=Math.max(.01,r.width/Math.max(1,r.height));camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(canvas);resize();
  const loop=()=>{requestAnimationFrame(loop);controls.update();renderer.render(scene,camera);};loop();
}
function moduleById(id){return library?.modules?.find((m)=>m.assetId===id)||null;}
function alignBase(node,targetY=0){node.updateWorldMatrix(true,true);let b=visibleMeshBounds(node);node.position.y+=targetY-b.min.y;node.updateWorldMatrix(true,true);return visibleMeshBounds(node);}
function centerXZ(node){let b=visibleMeshBounds(node),c=b.getCenter(new THREE.Vector3());node.position.x-=c.x;node.position.z-=c.z;node.updateWorldMatrix(true,true);return visibleMeshBounds(node);}
async function loadItem(item){
  const mod=moduleById(item.assetId);if(!mod)throw new Error('module missing: '+item.assetId);
  const gltf=await loader.loadAsync(mod.source.rawPinned);const node=gltf.scene;node.userData.module=mod;node.name=mod.name;
  if(item.rotationYDeg)node.rotation.y=THREE.MathUtils.degToRad(item.rotationYDeg);if(item.scale)node.scale.setScalar(item.scale);root.add(node);return{item,mod,node};
}
function layoutLine(items,gap=.2){
  let cursor=0;
  for(const row of items){alignBase(row.node,0);centerXZ(row.node);let b=visibleMeshBounds(row.node);row.node.position.x+=cursor-b.min.x;row.node.updateWorldMatrix(true,true);b=visibleMeshBounds(row.node);cursor=b.max.x+gap;}
}
function layoutFurnished(items){
  const floorRow=items.find((r)=>r.item.anchor==='floor')||items[0];alignBase(floorRow.node,0);centerXZ(floorRow.node);const floorBox=visibleMeshBounds(floorRow.node),size=floorBox.getSize(new THREE.Vector3()),floorTop=floorBox.max.y;
  for(const row of items){if(row===floorRow)continue;alignBase(row.node,floorTop);let b=visibleMeshBounds(row.node),c=b.getCenter(new THREE.Vector3());
    if(row.item.edge){const u=Number.isFinite(row.item.u)?row.item.u:.5;
      if(row.item.edge==='north'||row.item.edge==='south'){const tx=floorBox.min.x+size.x*u;row.node.position.x+=tx-c.x;row.node.updateWorldMatrix(true,true);b=visibleMeshBounds(row.node);row.node.position.z+=(row.item.edge==='north'?floorBox.max.z-b.min.z:floorBox.min.z-b.max.z);}
      else {const tz=floorBox.min.z+size.z*u;row.node.position.z+=tz-c.z;row.node.updateWorldMatrix(true,true);b=visibleMeshBounds(row.node);row.node.position.x+=(row.item.edge==='east'?floorBox.max.x-b.min.x:floorBox.min.x-b.max.x);}
    } else if(Array.isArray(row.item.uv)){const tx=floorBox.min.x+size.x*row.item.uv[0],tz=floorBox.min.z+size.z*row.item.uv[1];row.node.position.x+=tx-c.x;row.node.position.z+=tz-c.z;}
    row.node.updateWorldMatrix(true,true);
  }
}
function recordMeasurements(sampleId,rows){workState.measurements[sampleId]=rows.map(({mod,node})=>{const b=visibleMeshBounds(node),s=b.getSize(new THREE.Vector3());return{assetId:mod.assetId,name:mod.name,size:s.toArray(),min:b.min.toArray(),max:b.max.toArray()};});}
async function loadSample(sampleId){
  if(!current||!library)return;initViewer();const entry=current.sampleRecipes.find((s)=>s.id===sampleId)||current.sampleRecipes[0];if(!entry)return;const run=++token;clearScene();root=new THREE.Group();scene.add(root);workState.packId=current.packId;workState.sampleId=entry.id;workState.sourceCommit=library.sourceCommit;$('moduleKitStatus').textContent='Loading '+entry.label+'…';
  try{const recipe=await fetchJSON(entry.path);const rows=[];for(const item of recipe.items){const row=await loadItem(item);if(run!==token)return;rows.push(row);}if(recipe.layout==='furnished-cell')layoutFurnished(rows);else layoutLine(rows,recipe.gap??(recipe.layout==='chain-x'?.02:.25));
    const box=visibleMeshBounds(root);framePerspectiveCamera(camera,box,{controls,padding:1.18,direction:new THREE.Vector3(1,.45,1),headroom:.12,footroom:.05,side:.08,depth:.08});recordMeasurements(entry.id,rows);const size=box.getSize(new THREE.Vector3());$('moduleKitSampleMeta').textContent=recipe.note+' · '+rows.length+' source assets · scene '+size.toArray().map((n)=>n.toFixed(2)).join(' × ');$('moduleKitStatus').textContent='Loaded · shared scale · '+entry.label;workState.ready=true;document.documentElement.dataset.moduleKitReady='1';renderSampleButtons(entry.id);}
  catch(e){workState.errors.push(String(e));$('moduleKitStatus').textContent='Sample failed: '+e.message;}
}
function renderFamilies(profile){const host=$('moduleKitFamilies');host.replaceChildren();for(const [family,count] of Object.entries(profile.counts.byFamily)){const chip=document.createElement('span');chip.className='module-kit-chip';chip.textContent=family+' · '+count;host.append(chip);}}
function renderSampleButtons(activeId){const host=$('moduleKitSamples');host.replaceChildren();for(const sample of current?.sampleRecipes||[]){const b=document.createElement('button');b.type='button';b.className=sample.id===activeId?'primary':'';b.textContent=sample.label;b.onclick=()=>loadSample(sample.id);host.append(b);}}
export function resolveModuleKitAlias(query){const q=String(query||'').trim().toLocaleLowerCase();if(!q)return null;for(const kit of kitIndex.kits||[])for(const alias of [kit.packId,kit.displayName,...(kit.aliases||[])])if(String(alias).trim().toLocaleLowerCase()===q)return kit.packId;return null;}
export async function openModuleKit(packId,{updateUrl=true}={}){
  const kit=(kitIndex.kits||[]).find((k)=>k.packId===packId);if(!kit){$('moduleKitPanel').hidden=true;current=null;library=null;return false;}
  current=kit;const [profile,lib]=await Promise.all([fetchJSON(kit.packProfile),fetchJSON(kit.moduleLibrary)]);library=lib;$('moduleKitPanel').hidden=false;$('moduleKitTitle').textContent=profile.displayName;$('moduleKitMeta').textContent=profile.counts.models+' models · Build '+profile.counts.byLane.build+' · Furnish '+profile.counts.byLane.furnish+' · Story '+profile.counts.byLane.story+' · source '+String(profile.source.registrySourceCommit||'').slice(0,12);renderFamilies(profile);renderSampleButtons(null);
  const share=new URL(location.href);share.searchParams.set('pack',packId);share.searchParams.set('moduleKit','1');$('moduleKitShare').href=share.pathname+share.search;$('moduleKitShare').textContent='Pack link';if(updateUrl)history.replaceState(null,'',share.pathname+share.search+share.hash);await loadSample(kit.sampleRecipes[0]?.id);return true;
}
export async function initModuleKitWorkbench(){kitIndex=await fetchJSON(INDEX_URL,true)||{kits:[]};const params=new URLSearchParams(location.search);const pack=params.get('pack');return{initialPackId:pack&&kitIndex.kits.some((k)=>k.packId===pack)?pack:null,resolveAlias:resolveModuleKitAlias,openPack:openModuleKit,getState:cloneState};}
