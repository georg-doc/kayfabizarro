/* TOOLBOX-COHERENT-INTEGRATION-01
   Additive adapter over the accepted Stage-First v1 donor.
   Existing owners only: Stage roster/runtime, current Driver Graft, Resident Atlas,
   shared edit-layer, kfb.scene-patch.v1. No fallback geometry or second renderer. */
import { makeEditLayer } from '../lib/edit-layer.js';
import { buildVignette } from '../../resident_atlas_s6/lib/atlas.js';
import { RESIDENTS } from '../../resident_atlas_s6/data/cast.js';
import { mountGraft, pickGraftPet, SCHEMA as GRAFT_SCHEMA } from '../kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js';

const JOB='TOOLBOX-COHERENT-INTEGRATION-01';
const RESIDENT_PIN='10f661a542e2553b4d3433bfc5b45dfc1401e660';
const PATCH_SCHEMA='kfb.scene-patch.v1';
const STORAGE_PREFIX='kfb.toolbox.scene-patch.v1.';
const TARGET_IDS=['goth-girl','orc-warband','animatronic'];
const DRIVER_ID='graft-driver';
const DRIVER_CONTRACT='../kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json';

const wait=(ms)=>new Promise((r)=>setTimeout(r,ms));
async function waitToolBox(){
  const until=performance.now()+60000;
  while(performance.now()<until){
    const t=window.__TOOLBOX;
    if(t&&t.scene&&t.THREE&&t.cam&&t.controls&&t.gltf&&t.roster&&t.state) return t;
    await wait(50);
  }
  throw new Error('Stage-First runtime did not expose window.__TOOLBOX within 60 s');
}
function node(tag,attrs,text){
  const n=document.createElement(tag);
  for(const [k,v] of Object.entries(attrs||{})){
    if(k==='class') n.className=v; else n.setAttribute(k,v);
  }
  if(text!=null) n.textContent=text;
  return n;
}
function fail(message,error){
  const msg=message+(error&&error.message?' · '+error.message:'');
  console.error('['+JOB+'] '+msg,error||'');
  let box=document.getElementById('kfb-ci-fail');
  if(!box){
    box=node('div',{id:'kfb-ci-fail'});
    Object.assign(box.style,{position:'fixed',left:'12px',right:'12px',top:'12px',zIndex:'2147483647',
      padding:'12px 14px',background:'#7c2118',color:'#fff',border:'2px solid #fff',
      font:'600 13px/1.35 Space Grotesk,sans-serif',boxShadow:'0 8px 30px rgba(0,0,0,.4)'});
    document.body.append(box);
  }
  box.textContent='SOURCE FAIL · '+msg;
}

const toolbox=await waitToolBox();
const THREE=toolbox.THREE;
const canvas=toolbox._canvas||toolbox.renderer.domElement;
const recipes=new Map(RESIDENTS.filter((r)=>TARGET_IDS.includes(r.residentId)).map((r)=>[r.residentId,r]));
for(const id of TARGET_IDS) if(!recipes.has(id)){ fail('mandated Resident recipe missing: '+id); throw new Error('missing Resident '+id); }

const contractResponse=await fetch(new URL(DRIVER_CONTRACT,import.meta.url).href,{cache:'no-store'});
if(!contractResponse.ok){ fail('current Driver Graft contract HTTP '+contractResponse.status); throw new Error('Driver contract HTTP '+contractResponse.status); }
const driverContract=await contractResponse.json();
const driverPet=pickGraftPet(driverContract,DRIVER_ID);
if(!driverPet){ fail('current Driver Graft contract has no '+DRIVER_ID); throw new Error('missing '+DRIVER_ID); }

const css=node('style');
css.textContent=[
'#kfb-ci-bar{position:fixed;left:50%;bottom:12px;z-index:2147482000;transform:translateX(-50%);display:flex;align-items:center;gap:6px;padding:7px 8px;border:1px solid var(--border,#2a2d30);background:var(--surface,#1d1f21);color:var(--text,#e7e7e5);box-shadow:0 8px 28px rgba(0,0,0,.25);font:500 12px/1.2 "Space Grotesk",sans-serif;max-width:calc(100vw - 24px)}',
'#kfb-ci-bar button,#kfb-ci-bar select{height:30px;border:1px solid var(--border,#2a2d30);background:var(--chip,#26292c);color:var(--text,#e7e7e5);font:500 12px "Space Grotesk",sans-serif;padding:0 9px}',
'#kfb-ci-bar button{cursor:pointer}#kfb-ci-bar button[data-on="1"]{background:var(--accent-fill,#e6a13c);color:var(--on-accent,#17181a);border-color:var(--accent-fill,#e6a13c)}',
'#kfb-ci-bar .sep{width:1px;height:20px;background:var(--border,#2a2d30)}#kfb-ci-status{max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--muted,#90969b)}',
'#kfb-ci-object{position:absolute;z-index:2147482100;display:flex;gap:3px;padding:4px;background:var(--surface,#1d1f21);border:1px solid var(--border,#2a2d30);box-shadow:0 6px 18px rgba(0,0,0,.25);transform:translateX(-50%)}',
'#kfb-ci-object[hidden]{display:none}#kfb-ci-object button{border:1px solid var(--border,#2a2d30);background:var(--chip,#26292c);color:var(--text,#e7e7e5);height:28px;padding:0 7px;font:500 11px "Space Grotesk",sans-serif;cursor:pointer}',
'#kfb-ci-object button[data-active="1"]{background:var(--accent-fill,#e6a13c);color:var(--on-accent,#17181a)}'
].join('\n');
document.head.append(css);

const bar=node('div',{id:'kfb-ci-bar','aria-label':'ToolBox scene authoring'});
const sceneSelect=node('select',{id:'kfb-ci-resident',title:'Real Resident scene'});
for(const id of TARGET_IDS){ const r=recipes.get(id); sceneSelect.append(node('option',{value:id},r.name)); }
const loadBtn=node('button',{id:'kfb-ci-load'},'Load Resident');
const sourceBtn=node('button',{id:'kfb-ci-source'},'Actor source');
const sceneBtn=node('button',{id:'kfb-ci-scene'},'Resident scene');
const editBtn=node('button',{id:'kfb-ci-edit'},'Edit');
const saveBtn=node('button',{id:'kfb-ci-save'},'Save');
const reloadBtn=node('button',{id:'kfb-ci-reload'},'Reload');
const status=node('span',{id:'kfb-ci-status'},'booting');
bar.append(sceneSelect,loadBtn,node('span',{class:'sep'}),sourceBtn,sceneBtn,editBtn,node('span',{class:'sep'}),saveBtn,reloadBtn,status);
document.body.append(bar);

const objectMenu=node('div',{id:'kfb-ci-object',hidden:''});
for(const [m,l] of [['translate','Move'],['rotate','Rotate'],['scale','Scale'],['floor','Drop'],['close','×']]) objectMenu.append(node('button',{'data-m':m},l));
document.body.append(objectMenu);

let currentResident=null,currentDriver=null,currentDriverHandle=null,currentDriverBase=null,lastSelected=null;
let editDirty=false,viewMode='source',edit=null;
const setStatus=(m,bad=false)=>{status.textContent=m;status.style.color=bad?'#f08b78':'var(--muted,#90969b)';};
const patchKey=(id)=>STORAGE_PREFIX+id;
const activePet=()=>toolbox.roster&&toolbox.roster[toolbox.state.petIdx];

function disposeOne(x){ if(x&&typeof x.dispose==='function'){try{x.dispose();}catch(e){console.warn('['+JOB+'] dispose',e);}} }
function clearDriverPointers(){
  toolbox._pose=null;toolbox.biped=null;toolbox._bipedRoot=null;toolbox.rig=null;toolbox.brow=null;toolbox.browGraft=null;
  toolbox.nose=null;toolbox.noseGraft=null;toolbox.moust=null;toolbox.mouth=null;
}
function disposeCurrentDriver(){
  if(!currentDriverHandle) return;
  try{currentDriverHandle.dispose();}catch(e){console.warn('['+JOB+'] driver dispose',e);}
  currentDriverHandle=null;currentDriver=null;currentDriverBase=null;clearDriverPointers();
}
function disposeDonorBiped(){
  const old={pose:toolbox._pose,biped:toolbox.biped,root:toolbox._bipedRoot,rig:toolbox.rig,brow:toolbox.brow,
    browGraft:toolbox.browGraft,nose:toolbox.nose,noseGraft:toolbox.noseGraft,moust:toolbox.moust,mouth:toolbox.mouth};
  const seen=new Set();
  for(const x of [old.pose,old.brow,old.browGraft,old.nose,old.noseGraft,old.moust,old.mouth,old.rig,old.biped]){
    if(!x||seen.has(x)) continue;seen.add(x);disposeOne(x);
  }
  if(old.root&&old.root.parent) old.root.parent.remove(old.root);
  clearDriverPointers();
  return old.root;
}
async function mountCurrentDriver(oldRoot){
  const tr=oldRoot?{p:oldRoot.position.clone(),q:oldRoot.quaternion.clone(),s:oldRoot.scale.clone()}:null;
  const loader=toolbox.gltf||toolbox._gltfL||new window.__PETED.GLTFLoader();
  const h=await mountGraft({THREE,loader,parent:toolbox.scene,pet:driverPet,lib:toolbox.lib||driverContract,
    camera:toolbox.cam,animation:'own',poseOverClip:'auto',log:(m)=>console.info('[current-driver] '+m)});
  if(!h||h.schema!==GRAFT_SCHEMA||h.id!==DRIVER_ID){if(h&&h.dispose)h.dispose();throw new Error('Driver owner returned wrong identity');}
  if(tr){h.root.position.copy(tr.p);h.root.quaternion.copy(tr.q);h.root.scale.copy(tr.s);}
  h.root.name='CURRENT OWNER · '+DRIVER_ID;
  h.root.userData.kfbSource={id:DRIVER_ID,schema:GRAFT_SCHEMA,sourceRef:'tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js'};
  currentDriverHandle=h;currentDriver=h.root;
  currentDriverBase={p:h.root.position.clone(),q:h.root.quaternion.clone(),s:h.root.scale.clone()};
  toolbox.biped=h.biped;toolbox._bipedRoot=h.root;toolbox.rig=h.rig;toolbox._pose=h.pose;toolbox.brow=h.brow;toolbox.browGraft=h.browGraft;
  toolbox.nose=h.nose;toolbox.noseGraft=h.noseGraft;toolbox.moust=h.moust;toolbox.mouth=h.mouth;
  if(toolbox._gnd&&toolbox._gnd.setTarget) toolbox._gnd.setTarget(h.root);
  return h;
}
async function promoteDriver(index){
  const pet=toolbox.roster[index==null?toolbox.state.petIdx:index];
  if(!pet||pet.id!==DRIVER_ID) return null;
  const oldRoot=toolbox._bipedRoot;disposeDonorBiped();
  try{const h=await mountCurrentDriver(oldRoot);setStatus('Actor · '+DRIVER_ID+' · current graft owner');return h;}
  catch(e){fail('current Driver Graft owner failed',e);throw e;}
}
function stageActorRoot(){
  if(toolbox._bipedRoot&&toolbox._bipedRoot.visible!==false)return toolbox._bipedRoot;
  if(toolbox.carl&&toolbox.carl.group)return toolbox.carl.group;
  if(toolbox.rq&&toolbox.rq.group)return toolbox.rq.group;
  if(toolbox.rolli&&toolbox.rolli.group)return toolbox.rolli.group;
  if(toolbox.ch&&toolbox.ch.group&&toolbox.ch.group.visible!==false)return toolbox.ch.group;
  return null;
}
function requiredIds(recipe){
  return [...(recipe.habitat||[]),recipe.actor,...(recipe.signatureProps||[])].filter(Boolean).filter((x)=>!x.optional).map((x)=>x.id);
}
function assertResident(v,recipe){
  const missing=requiredIds(recipe).filter((id)=>!v.nodes.has(id));
  if(missing.length) throw new Error('mandated source node(s) missing: '+missing.join(', '));
  if(!v.nodes.has(recipe.actor.id)) throw new Error('Resident actor missing: '+recipe.actor.id);
}
function sourceRef(id){return 'tools/resident_atlas_s6/data/cast.js@'+RESIDENT_PIN+'#'+id;}
function recordOf(n){
  const e=n&&n.userData&&n.userData.entry;if(!e||!currentResident)return null;
  return{id:currentResident.id+':'+e.id,localId:e.id,role:e.role||(e.id===currentResident.recipe.actor.id?'resident actor':'resident object'),sourceRef:e.a||null};
}
function patchFromCurrent(){
  if(!currentResident)throw new Error('No Resident scene loaded');
  const ops=[];
  for(const [id,n] of currentResident.v.nodes.entries()){
    if(!n||!n.userData||!n.userData.entry)continue;
    ops.push({id:currentResident.id+':'+id,
      position:[n.position.x,n.position.y,n.position.z].map((x)=>+x.toFixed(6)),
      rotation:[n.rotation.x,n.rotation.y,n.rotation.z].map((x)=>+x.toFixed(6)),
      scale:[n.scale.x,n.scale.y,n.scale.z].map((x)=>+x.toFixed(6))});
  }
  return{schema:PATCH_SCHEMA,host:'toolbox-stage-first',source:{assetId:currentResident.id,sourceRef:sourceRef(currentResident.id)},ops};
}
function validatePatch(p,resident){
  if(!p||p.schema!==PATCH_SCHEMA)throw new Error('wrong patch schema');
  if(!p.source||p.source.assetId!==resident.id||p.source.sourceRef!==sourceRef(resident.id))throw new Error('patch source identity mismatch');
  if(!Array.isArray(p.ops))throw new Error('patch ops missing');
  const plan=[];
  for(const op of p.ops){
    const prefix=resident.id+':';
    if(!op||typeof op.id!=='string'||!op.id.startsWith(prefix))throw new Error('foreign patch op: '+(op&&op.id));
    const localId=op.id.slice(prefix.length),n=resident.v.nodes.get(localId);
    if(!n)throw new Error('unresolved patch object: '+op.id);
    for(const k of ['position','rotation','scale'])if(!Array.isArray(op[k])||op[k].length!==3||op[k].some((x)=>!Number.isFinite(x)))throw new Error('invalid '+k+' on '+op.id);
    plan.push({n,op});
  }
  return plan;
}
function applyPatch(p,resident){
  const plan=validatePatch(p,resident);
  for(const {n,op} of plan){n.position.fromArray(op.position);n.rotation.set(op.rotation[0],op.rotation[1],op.rotation[2]);n.scale.fromArray(op.scale);n.updateMatrixWorld(true);}
  return plan.length;
}
function savePatch(){
  const p=patchFromCurrent();localStorage.setItem(patchKey(currentResident.id),JSON.stringify(p));editDirty=false;
  setStatus('Saved · '+p.ops.length+' ops · '+PATCH_SCHEMA);return p;
}
function saved(id){
  const raw=localStorage.getItem(patchKey(id));if(!raw)return null;
  try{return JSON.parse(raw);}catch(e){throw new Error('saved patch is invalid JSON');}
}
function removeResident(){
  if(!currentResident)return;if(edit)edit.clear();
  if(currentResident.v.root.parent)currentResident.v.root.parent.remove(currentResident.v.root);
  currentResident=null;lastSelected=null;
}
function restoreDriver(){
  if(!currentDriver||!currentDriverBase)return;
  currentDriver.position.copy(currentDriverBase.p);currentDriver.quaternion.copy(currentDriverBase.q);currentDriver.scale.copy(currentDriverBase.s);currentDriver.updateMatrixWorld(true);
}
function frameRoots(roots){
  const xs=roots.filter((x)=>x&&x.visible!==false);if(!xs.length)return;
  const b=new THREE.Box3();for(const x of xs)b.expandByObject(x);if(b.isEmpty())return;
  const sp=b.getBoundingSphere(new THREE.Sphere()),dir=toolbox.cam.position.clone().sub(toolbox.controls.target);
  if(dir.lengthSq()<0.1)dir.set(.3,.25,1);dir.normalize();
  const vf=THREE.MathUtils.degToRad(toolbox.cam.fov),dist=Math.max(1.6,sp.radius/Math.max(.1,Math.sin(vf/2))*1.22);
  toolbox.controls.maxDistance=Math.max(8,dist*2.2);toolbox.controls.target.copy(sp.center);toolbox.cam.position.copy(sp.center).add(dir.multiplyScalar(dist));
  toolbox.cam.near=Math.max(.02,dist/250);toolbox.cam.far=Math.max(100,dist*12);toolbox.cam.updateProjectionMatrix();toolbox.controls.update();if(edit)edit.follow();
}
function arrangeIntegrated(){
  if(!currentResident)return;const actor=stageActorRoot(),rr=currentResident.v.root;rr.visible=true;
  if(actor){
    if(actor===currentDriver)restoreDriver();actor.visible=true;actor.updateMatrixWorld(true);rr.updateMatrixWorld(true);
    const rb=new THREE.Box3().setFromObject(rr),ab=new THREE.Box3().setFromObject(actor);
    if(!rb.isEmpty()&&!ab.isEmpty()){const ac=ab.getCenter(new THREE.Vector3()),aw=ab.max.x-ab.min.x,target=rb.min.x-Math.max(.5,aw*.5)-.8;actor.position.x+=target-ac.x;actor.updateMatrixWorld(true);}
  }
  frameRoots([actor,rr]);
}
function showSource(){
  viewMode='source';const actor=stageActorRoot();if(currentResident)currentResident.v.root.visible=false;
  if(actor){if(actor===currentDriver)restoreDriver();actor.visible=true;frameRoots([actor]);}
  if(edit)edit.setOn(false);sourceBtn.dataset.on='1';sceneBtn.dataset.on='0';editBtn.dataset.on='0';
  setStatus(activePet()&&activePet().id===DRIVER_ID?'Source · current Driver Graft owner':'Source · Stage-First roster actor');
}
function showScene(){
  if(!currentResident){setStatus('Load a Resident scene first',true);return;}
  viewMode='scene';sourceBtn.dataset.on='0';sceneBtn.dataset.on='1';arrangeIntegrated();setStatus('Scene · '+currentResident.recipe.name+' · click object to edit');
}
async function loadResident(id,opts={}){
  const recipe=recipes.get(id);if(!recipe)throw new Error('Resident target not allowed: '+id);
  loadBtn.disabled=true;setStatus('Loading real Resident · '+recipe.name);if(edit)edit.clear();removeResident();
  try{
    const v=await buildVignette(recipe,(d,n,nodeId)=>setStatus('Resident '+recipe.name+' · '+d+'/'+n+' · '+nodeId));
    assertResident(v,recipe);currentResident={id,recipe,v};v.root.name='ToolBox Resident · '+id;toolbox.scene.add(v.root);
    if(opts.applySaved!==false){const p=saved(id);if(p){const n=applyPatch(p,currentResident);setStatus('Reloaded · '+n+' ops · '+recipe.name);}}
    editDirty=false;showScene();return currentResident;
  }catch(e){removeResident();fail('Resident source failed: '+id,e);throw e;}
  finally{loadBtn.disabled=false;}
}
async function reloadResident(){
  if(!currentResident)throw new Error('No Resident scene loaded');const id=currentResident.id;
  await loadResident(id,{applySaved:true});edit.setOn(true);editBtn.dataset.on='1';setStatus('Reloaded · continue editing · '+recipes.get(id).name);return currentResident;
}

edit=makeEditLayer({scene:toolbox.scene,camera:toolbox.cam,controls:toolbox.controls},canvas,{
  getRoot:()=>currentResident&&currentResident.v.root,recordOf,menu:objectMenu,gridStep:.05,angleStep:15,
  onPick:(n,r)=>{lastSelected=n||null;setStatus(r?'Selected · '+r.id+' · '+r.role:(currentResident?'Scene · '+currentResident.recipe.name:'No Resident scene'));},
  onChange:()=>{editDirty=true;setStatus('Edited · unsaved');},
  onMenu:(m)=>{if(m==='floor'){const out=edit.drop();editDirty=editDirty||out.length>0;setStatus(out.length?'Drop · '+out.length+' object':'Drop · no editable selection',!out.length);}}
});
edit.setOn(false);
edit.onChange(()=>{for(const b of objectMenu.querySelectorAll('button[data-m]'))b.dataset.active=b.dataset.m===edit.mode?'1':'0';});

loadBtn.addEventListener('click',()=>loadResident(sceneSelect.value).catch(()=>{}));
sourceBtn.addEventListener('click',showSource);
sceneBtn.addEventListener('click',showScene);
editBtn.addEventListener('click',()=>{
  if(!currentResident){setStatus('Load a Resident scene first',true);return;}
  const next=!edit.on;if(next){viewMode='scene';showScene();edit.setOn(true);editBtn.dataset.on='1';setStatus('Edit ON · click a Resident actor/object');}
  else{edit.setOn(false);editBtn.dataset.on='0';setStatus('Edit OFF');}
});
saveBtn.addEventListener('click',()=>{try{savePatch();}catch(e){setStatus(e.message,true);}});
reloadBtn.addEventListener('click',()=>reloadResident().catch((e)=>setStatus(e.message,true)));

const priorLoadPet=toolbox.loadPet.bind(toolbox);
toolbox.loadPet=async(index)=>{
  if(currentDriverHandle)disposeCurrentDriver();
  const result=await priorLoadPet(index),pet=toolbox.roster[index];
  if(pet&&pet.id===DRIVER_ID)await promoteDriver(index);
  if(currentResident&&viewMode==='scene')arrangeIntegrated();else if(viewMode==='source')showSource();
  return result;
};

try{
  const idx=toolbox.roster.findIndex((p)=>p.id===DRIVER_ID);if(idx<0)throw new Error('real Stage-First roster has no '+DRIVER_ID);
  if(toolbox.state.petIdx!==idx)await priorLoadPet(idx);
  await promoteDriver(idx);showSource();
}catch(e){fail('Driver source promotion failed',e);throw e;}

const priorAnimate=toolbox.animate.bind(toolbox);let residentTickAt=performance.now();
toolbox.animate=function(){
  const now=performance.now(),dt=Math.min(.05,Math.max(0,(now-residentTickAt)/1000));residentTickAt=now;
  const v=currentResident&&currentResident.v;
  if(v&&v.root.visible!==false){
    if(v.mixer&&v.mixer.mixer)v.mixer.mixer.update(dt);
    for(const m of (v.extraMixers||[]))if(m&&m.mixer)m.mixer.update(dt);
    if(v.activity&&v.activity.enabled!==false&&v.activity.update)v.activity.update(dt);
  }
  if(edit)edit.follow();return priorAnimate();
};

window.__KFB_COHERENT={
  job:JOB,ready:true,stageFirstDonorSha256:'08f9108a6a2a556d0e1e2e34ce564842062a4fdd77a80fb1020a8e723b688fba',
  driverOwner:{id:DRIVER_ID,schema:GRAFT_SCHEMA,module:'tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js'},
  residentPin:RESIDENT_PIN,residentTargets:TARGET_IDS.slice(),patchSchema:PATCH_SCHEMA,edit,loadResident,save:savePatch,reload:reloadResident,showSource,showScene,
  probe(){
    const p=activePet();return{ready:true,rosterCount:(toolbox.roster||[]).length,actorId:p&&p.id,
      actorOwnerSchema:currentDriverHandle&&currentDriverHandle.schema,actorOwnerRoot:currentDriver&&currentDriver.name,
      residentId:currentResident&&currentResident.id,residentNodeCount:currentResident?currentResident.v.nodes.size:0,
      residentActorId:currentResident&&currentResident.recipe.actor.id,editorOn:edit.on,editorMode:edit.mode,dirty:editDirty,viewMode,
      selected:lastSelected&&recordOf(lastSelected)&&recordOf(lastSelected).id};
  },
  selectResidentNode(localId){
    if(!currentResident)throw new Error('No Resident scene loaded');const n=currentResident.v.nodes.get(localId);
    if(!n)throw new Error('Unknown Resident node: '+localId);edit.select(n);lastSelected=n;return n;
  },
  get resident(){return currentResident;},get driver(){return currentDriverHandle;}
};
console.info('['+JOB+'] ready · roster='+toolbox.roster.length+' · driver='+GRAFT_SCHEMA+' · residents='+TARGET_IDS.join(','));
