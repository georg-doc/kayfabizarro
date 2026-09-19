import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const BASE='5650b6c54d8789b20ea80abe857688173d506d3b';
const REPO='georg-doc/kayfabizarro';
const REGISTRY_ROOT=`https://raw.githubusercontent.com/${REPO}/${BASE}/registry/assets/v1`;
const MODULE_CDN=`https://cdn.jsdelivr.net/gh/${REPO}@${BASE}`;
const RAW_BASE=`https://raw.githubusercontent.com/${REPO}/${BASE}`;
const $=(s,r=document)=>r.querySelector(s);
const r3=(n)=>Number(n).toFixed(3).replace(/-0\.000/,'0.000');
const vec=(a)=>a.map(r3).join(' × ');
const encPath=(p)=>p.split('/').map(encodeURIComponent).join('/');

const PACKS=[
  ['carries','kenney-platformer-kit','Kenney Platformer'],
  ['carries','kaykit-dungeon-pack-1-1-free-2','KayKit Dungeon'],
  ['carries','kaykit-medieval-hexagon-pack-1-0-free','KayKit Medieval Hexagon'],
  ['carries','kaykit-medieval-builder-pack-1-0','KayKit Medieval Builder'],
  ['tells','tiny-treats-pretty-park-1-0-free','Tiny Treats · Pretty Park'],
  ['tells','tiny-treats-pleasant-picnic-1-0-free','Tiny Treats · Pleasant Picnic'],
  ['tells','tiny-treats-homely-house-1-0-free','Tiny Treats · Homely House'],
  ['tells','tiny-treats-bakery-interior-1-1-free','Tiny Treats · Bakery Interior'],
  ['tells','tiny-treats-house-plants-1-0-free-2','Tiny Treats · House Plants'],
  ['tells','bubbly-bathroom-tiny-treats-1-1','Tiny Treats · Bubbly Bathroom'],
  ['inhabits','kaykit-mystery-series6','KayKit Mystery Series 6']
];
const TINY_CLASS={
  'tiny-treats-bakery-interior-1-1-free':{tags:['MODULAR INTERIOR','LOOSE PROPS'],note:'Walls, floors, doorway + bakery furniture/food. Structural pieces stay modular.'},
  'bubbly-bathroom-tiny-treats-1-1':{tags:['MODULAR INTERIOR','LOOSE PROPS'],note:'Bathroom shell pieces + fixtures/props. Do not scatter wall/floor parts.'},
  'tiny-treats-house-plants-1-0-free-2':{tags:['MODULAR INTERIOR','LOOSE SCENERY'],note:'Interior support parts plus plant families. Classification is per component.'},
  'tiny-treats-pretty-park-1-0-free':{tags:['GROUND MODULES','LOOSE SCENERY'],note:'Authored sliced grass/floor parts coexist with bench, trees and shrubs.'},
  'tiny-treats-pleasant-picnic-1-0-free':{tags:['LOOSE SCENERY'],note:'Picnic scene dressing; no C0 claim of a structural interior grammar.'},
  'tiny-treats-homely-house-1-0-free':{tags:['LOOSE / ROOM SCENERY'],note:'Home-scene components; C0 does not promote them to a universal building grammar.'}
};

const PROOFS={
  carry:{pack:'kaykit-dungeon-pack-1-1-free-2',path:'media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/floor_tile_large.gltf',collision:'SUPPORT_SURFACE_CANDIDATE · consumer SOLID proxy',anchor:'footprint X/Z @ authored scale 1.0'},
  'tell-modular':{pack:'tiny-treats-bakery-interior-1-1-free',path:'media/3D_Assets/Tiny_Treats_Bakery_Interior_1.1_FREE/Assets/gltf/door_modular.gltf',collision:'CONNECTOR VISUAL · collision REVIEW',anchor:'height · candidate world door 2.05 units'},
  'tell-loose':{pack:'tiny-treats-pretty-park-1-0-free',path:'media/3D_Assets/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/bench.gltf',collision:'LOOSE PROP · collision REVIEW',anchor:'height @ authored scale 1.0'},
  inhabit:{kind:'resident',modulePath:'tools/resident_atlas/modules/clown-juggling-island.module.json',collision:'NONE IN MODULE · support/collision consumer-owned',anchor:'module root · scene.scale = 1'},
  act:{kind:'graft',contractPath:'tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json',collision:'ACTOR PRESENTATION · runtime owns capsule/hitbox',anchor:'assembled figure height @ authored scale'}
};

const evidence={schema:'kfb.c0-browser-evidence/1',baseCommit:BASE,registry:null,packs:{},proofs:{},modules:{},errors:[]};
window.__C0_EVIDENCE__=evidence;
$('#baseSha').textContent=BASE.slice(0,12);

async function getJSON(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${url}`);return r.json();}
async function loadRegistry(){
  const manifest=await getJSON(`${REGISTRY_ROOT}/manifest.json`); evidence.registry=manifest; $('#registrySha').textContent=(manifest.sourceCommit||'unknown').slice(0,12);
  await Promise.all(PACKS.map(async([role,id,label])=>{const p=await getJSON(`${REGISTRY_ROOT}/packs/${id}.json`); evidence.packs[id]=p; renderPack(role,label,p);}));
  renderTiny();
}
function renderPack(role,label,p){
  const modelCount=p.kinds?.['model-3d']||0; const format=Object.entries(p.formats||{}).filter(([k])=>['glb','gltf','fbx','obj','blend'].includes(k)).map(([k,v])=>`${v} ${k.toUpperCase()}`).join(' · ');
  const el=document.createElement('article'); el.className='pack'; el.dataset.role=role; el.innerHTML=`<div class="lane">${role}</div><h3>${label}</h3><div class="count">${modelCount}</div><div><small>3D models · ${format||'mixed'}</small></div><div class="root">${p.root}<br>registry asset source: ${(p.assets.find(a=>a.kind==='model-3d')?.source?.commit||'n/a').slice(0,12)}</div>`; $('#packGrid').append(el);
}
function renderTiny(){
  const order=['tiny-treats-pretty-park-1-0-free','tiny-treats-pleasant-picnic-1-0-free','tiny-treats-homely-house-1-0-free','tiny-treats-bakery-interior-1-1-free','tiny-treats-house-plants-1-0-free-2','bubbly-bathroom-tiny-treats-1-1'];
  for(const id of order){const p=evidence.packs[id],c=TINY_CLASS[id]; const el=document.createElement('article');el.className='tiny-card';el.innerHTML=`<b>${p.displayName.replaceAll('_',' ')}</b>${c.tags.map(t=>`<span class="class ${/MODULAR|GROUND/.test(t)?'mod':'loose'}">${t}</span>`).join('')}<p>${c.note}</p><p><strong>${p.kinds?.['model-3d']||0}</strong> models · source ${(p.assets.find(a=>a.kind==='model-3d')?.source?.commit||'').slice(0,8)}</p>`;$('#tinyGrid').append(el);}
}
function assetRecord(packId,path){const p=evidence.packs[packId]; return p?.assets?.find(a=>a.path===path)||null;}

class PinnedLoader extends GLTFLoader{
  pin(url){return typeof url==='string'&&url.includes(`raw.githubusercontent.com/${REPO}/main/`)?url.replace(`/${REPO}/main/`,`/${REPO}/${BASE}/`):url}
  load(url,onLoad,onProgress,onError){return super.load(this.pin(url),onLoad,onProgress,onError)}
  loadAsync(url,onProgress){return super.loadAsync(this.pin(url),onProgress)}
}

const viewers=[];
class Viewer{
  constructor(article){this.article=article;this.canvas=$('[data-canvas]',article);this.shell=$('.viewer-shell',article);this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0xe9e4d6);this.camera=new THREE.PerspectiveCamera(38,1,.01,2000);this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,antialias:true,alpha:false});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.controls=new OrbitControls(this.camera,this.canvas);this.controls.enableDamping=true;this.controls.autoRotate=true;this.controls.autoRotateSpeed=.85;this.scene.add(new THREE.HemisphereLight(0xffffff,0x6d675b,2.5));const key=new THREE.DirectionalLight(0xffffff,2.7);key.position.set(4,7,5);this.scene.add(key);const rim=new THREE.DirectionalLight(0xffd9b7,1.3);rim.position.set(-5,3,-4);this.scene.add(rim);this.clock=new THREE.Clock();this.updaters=[];this.resize=()=>{const r=this.canvas.getBoundingClientRect();this.renderer.setSize(Math.max(1,Math.round(r.width)),Math.max(1,Math.round(r.height)),false);this.camera.aspect=Math.max(.01,r.width/Math.max(1,r.height));this.camera.updateProjectionMatrix()};new ResizeObserver(this.resize).observe(this.canvas);this.resize();viewers.push(this)}
  add(root){this.root=root;this.scene.add(root);this.frame(root);}
  frame(root){const box=visibleBounds(root);const sphere=box.getBoundingSphere(new THREE.Sphere());const radius=Math.max(.02,sphere.radius);const vfov=THREE.MathUtils.degToRad(this.camera.fov);const hfov=2*Math.atan(Math.tan(vfov/2)*this.camera.aspect);const distance=radius/Math.sin(Math.min(vfov,hfov)/2)*1.28;this.controls.target.copy(sphere.center);this.camera.position.copy(sphere.center).add(new THREE.Vector3(1,.42,1).normalize().multiplyScalar(distance));this.camera.near=Math.max(.001,distance-radius*3.5);this.camera.far=Math.max(100,distance+radius*12);this.camera.lookAt(sphere.center);this.camera.updateProjectionMatrix();this.controls.update();}
  fail(e){this.shell.classList.add('error');this.shell.dataset.error=`PREVIEW FAILED · ${e.message}`;}
  update(dt){for(const fn of this.updaters)fn(dt);this.controls.update();this.renderer.render(this.scene,this.camera)}
}
function visibleBounds(root){root.updateWorldMatrix(true,true);const box=new THREE.Box3().makeEmpty(),tmp=new THREE.Box3();root.traverse(o=>{if(!o.visible||o.userData?.noMeasure||!(o.isMesh||o.isSkinnedMesh||o.isPoints||o.isLine))return;tmp.makeEmpty().setFromObject(o,true);if(!tmp.isEmpty())box.union(tmp)});if(box.isEmpty())box.setFromObject(root,true);return box}
function measure(root){const box=visibleBounds(root);const s=box.getSize(new THREE.Vector3());const min=box.min.toArray(),max=box.max.toArray();const pivot=[0,0,0];const norm=[s.x?(-min[0]/s.x):null,s.y?(-min[1]/s.y):null,s.z?(-min[2]/s.z):null];return {size:s.toArray(),min,max,baseY:min[1],pivot,pivotNormalized:norm}}
function factHTML(label,value,wide=false,cls=''){return `<div class="fact ${wide?'wide':''}"><label>${label}</label><div class="${cls}">${value}</div></div>`}
function renderFacts(article,entry){const f=$('[data-facts]',article);const m=entry.measurement;f.innerHTML=factHTML('Exact source',`<code>${entry.sourcePath}</code>`,true)+factHTML('Revision / blob',`${(entry.sourceCommit||'').slice(0,12)} · ${(entry.blobSha||'n/a').slice(0,12)}`,true)+factHTML('Measurements',m?`${vec(m.size)} · XYZ`:'pending')+factHTML('Base / pivot',m?`base Y ${r3(m.baseY)} · pivot norm ${vec(m.pivotNormalized)}`:'pending')+factHTML('Scale anchor',entry.scaleAnchor||'—')+factHTML('Collision role',entry.collision,true,/REVIEW/.test(entry.collision)?'warn':'')+factHTML('Evidence',entry.evidence,true,entry.evidence.includes('BROWSER')?'pass':'warn')}

async function loadAssetProof(id){const cfg=PROOFS[id],article=$(`[data-proof="${id}"]`),viewer=new Viewer(article);try{const rec=assetRecord(cfg.pack,cfg.path);if(!rec)throw new Error('asset not found in central pack shard');const gltf=await new PinnedLoader().loadAsync(rec.source.rawPinned||rec.source.rawLatest);viewer.add(gltf.scene);const m=measure(gltf.scene);let scaleAnchor=cfg.anchor;if(id==='tell-modular')scaleAnchor=`height ${r3(m.size[1])} → 2.05 target = scale ${r3(2.05/m.size[1])}`;if(id==='carry')scaleAnchor=`footprint ${r3(m.size[0])} × ${r3(m.size[2])} @ scale 1.0`;const e={id,sourcePath:rec.path,sourceCommit:rec.source.commit,blobSha:rec.source.blobSha,packId:cfg.pack,measurement:m,scaleAnchor,collision:cfg.collision,evidence:'FOUND · MEASURED · BROWSER SEEN'};evidence.proofs[id]=e;renderFacts(article,e);article.dataset.evidence='browser-seen';}catch(e){evidence.errors.push(`${id}: ${e.message}`);viewer.fail(e);renderFacts(article,{sourcePath:cfg.path||'—',sourceCommit:'',measurement:null,scaleAnchor:cfg.anchor,collision:cfg.collision,evidence:'FOUND / BROWSER FAILED'});}}

async function loadResidentProof(){const id='inhabit',cfg=PROOFS[id],article=$(`[data-proof="${id}"]`),viewer=new Viewer(article);try{const [manifest,mod]=await Promise.all([getJSON(`${RAW_BASE}/${cfg.modulePath}`),import(`${MODULE_CDN}/tools/resident_atlas/modules/runtime/s6-resident-module.js`)]);const handle=await mod.mountResidentSceneModule(manifest,{parent:viewer.scene});viewer.root=handle.root;viewer.frame(handle.root);viewer.updaters.push(dt=>handle.update(dt));const m=measure(handle.root);const actorPath='media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/characters/Clown.glb';const actorRec=assetRecord('kaykit-mystery-series6',actorPath);const e={id,sourcePath:cfg.modulePath,sourceCommit:manifest.source?.commit,blobSha:'1c75730143e3481b43edaa8e7231e1a853f7834d',actor:{path:actorPath,sourceCommit:actorRec?.source?.commit||'891eadf01e218f5fc21387e64cea1fec8332c5b6',blobSha:actorRec?.source?.blobSha||null},adapter:manifest.source.adapter,measurement:m,scaleAnchor:cfg.anchor,collision:cfg.collision,evidence:'FOUND · MODULE MOUNTED · MEASURED · BROWSER SEEN'};evidence.proofs[id]=e;evidence.modules.resident=manifest;renderFacts(article,{...e,sourcePath:`${cfg.modulePath} → ${actorPath}`});article.dataset.evidence='browser-seen';}catch(e){evidence.errors.push(`${id}: ${e.message}`);viewer.fail(e);renderFacts(article,{sourcePath:cfg.modulePath,sourceCommit:'',measurement:null,scaleAnchor:cfg.anchor,collision:cfg.collision,evidence:'FOUND / BROWSER FAILED'});}}

async function loadGraftProof(){const id='act',cfg=PROOFS[id],article=$(`[data-proof="${id}"]`),viewer=new Viewer(article);try{const [contract,graft]=await Promise.all([getJSON(`${RAW_BASE}/${cfg.contractPath}`),import(`${MODULE_CDN}/tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js`)]);const pet=graft.pickGraftPet(contract,'graft-driver');if(!pet)throw new Error('graft-driver missing in current contract');const holder=new THREE.Group();viewer.scene.add(holder);const handle=await graft.mountGraft({THREE,loader:new PinnedLoader(),parent:holder,pet,lib:contract,camera:viewer.camera,animation:'host',log:()=>{}});viewer.root=holder;viewer.frame(handle.figure||holder);viewer.updaters.push(dt=>handle.update?.(dt,viewer.camera));const m=measure(handle.figure||holder);const driverPath='media/3D_Assets/KayKit_Mystery_Series6/2 - August 2023 - Driver/character/gltf/Driver.glb';const driverRec=assetRecord('kaykit-mystery-series6',driverPath);const e={id,sourcePath:cfg.contractPath,sourceCommit:BASE,blobSha:'f202a1c2f1670ab6045176af6621c94041124e76',reader:{path:'tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js',blobSha:'a84b2c92a00f7764088c4916030327eb04a91c5c'},host:{path:driverPath,sourceCommit:driverRec?.source?.commit||BASE,blobSha:driverRec?.source?.blobSha||null},measurement:m,scaleAnchor:`assembled figure height ${r3(m.size[1])} @ scale 1.0`,collision:cfg.collision,evidence:'CONTRACT FOUND · GRAFT MOUNTED · MEASURED · BROWSER SEEN'};evidence.proofs[id]=e;evidence.modules.graft={contractMeta:contract.meta,pet:{id:pet.id,kind:pet.kind,module:pet.module,variant:pet.variant}};renderFacts(article,{...e,sourcePath:`${cfg.contractPath} → ${driverPath}`});article.dataset.evidence='browser-seen';}catch(e){evidence.errors.push(`${id}: ${e.message}`);viewer.fail(e);renderFacts(article,{sourcePath:cfg.contractPath,sourceCommit:BASE,measurement:null,scaleAnchor:cfg.anchor,collision:cfg.collision,evidence:'CONTRACT FOUND / BROWSER FAILED'});}}

function download(name,obj){const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000)}
function enableExports(){const scene=$('#sceneRecipe'),mod=$('#moduleManifest');scene.disabled=mod.disabled=false;scene.onclick=()=>download('kfb-c0-scene-recipe.json',{schema:'kfb.scene-recipe.c0/1',baseCommit:BASE,registrySourceCommit:evidence.registry?.sourceCommit,proofs:evidence.proofs,rule:'References only; consumer owns runtime/collision.'});mod.onclick=()=>download('kfb-c0-module-manifest.json',{schema:'kfb.module-manifest.c0/1',baseCommit:BASE,resident:evidence.modules.resident,graft:evidence.modules.graft,boundary:'No owner replacement; mount/update/dispose only where existing donor contracts say so.'});}
function finalise(){const expected=['carry','tell-modular','tell-loose','inhabit','act'];const ok=expected.every(k=>evidence.proofs[k]?.evidence?.includes('BROWSER SEEN'))&&evidence.errors.length===0;const s=$('#globalStatus');s.textContent=ok?'5/5 BROWSER PROOFS':'EVIDENCE INCOMPLETE';s.className=`status ${ok?'pass':'fail'}`;document.documentElement.dataset.c0Ready=ok?'1':'0';$('#footerStatus').textContent=ok?'Central registry → 5 measured browser witnesses':'Errors: '+evidence.errors.join(' | ');evidence.ready=ok;evidence.finishedAt=new Date().toISOString();enableExports();}

function loop(){requestAnimationFrame(loop);for(const v of viewers){const dt=Math.min(.05,v.clock.getDelta());v.update(dt)}}
loop();

(async()=>{try{await loadRegistry();await Promise.all([loadAssetProof('carry'),loadAssetProof('tell-modular'),loadAssetProof('tell-loose'),loadResidentProof(),loadGraftProof()]);}catch(e){evidence.errors.push('bootstrap: '+e.message);}finally{finalise();console.info('C0_EVIDENCE',evidence);}})();
