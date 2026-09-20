import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const PIN='bdaea0648f27c0f16e0a737bfba237eb54dd4cbb';
const RAW='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+PIN+'/';
const CDN='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+PIN+'/';
const enc=p=>p.split('/').map(encodeURIComponent).join('/');
const raw=p=>RAW+enc(p);

const profiles=(await fetch('./ACTOR_PROFILES.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('ACTOR_PROFILES '+r.status);return r.json()})).profiles;
const byId=new Map(profiles.map(p=>[p.id,p]));
const stage=document.getElementById('stage');
const roster=document.getElementById('roster');
const statusEl=document.getElementById('status');
const rigEl=document.getElementById('rig');
const adapterEl=document.getElementById('adapter');
const gatesEl=document.getElementById('gates');
const factsEl=document.getElementById('facts');
const ownersEl=document.getElementById('owners');
const notesEl=document.getElementById('notes');
const sourceOnly=document.getElementById('sourceOnly');
const sourceOnlyText=document.getElementById('sourceOnlyText');

const scene=new THREE.Scene();scene.background=new THREE.Color(0x172027);
const camera=new THREE.PerspectiveCamera(32,1,.02,100);camera.position.set(4.2,2.5,6.3);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;stage.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xe7edf0,0x3d4548,1.7));const sun=new THREE.DirectionalLight(0xffe5bf,2.4);sun.position.set(5,8,5);scene.add(sun);
const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(1.55,1.7,.12,64),new THREE.MeshStandardMaterial({color:0x252e33,roughness:.95}));pedestal.position.y=-.06;scene.add(pedestal);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,1.1,0);controls.maxPolarAngle=Math.PI*.48;controls.minDistance=2.2;controls.maxDistance=12;
const loader=new GLTFLoader();
let visual=null,disposeVisual=null,tickVisual=null,selected=null,error=null,ready=false,token=0,graftModule=null,graftContract=null;

function resize(){const r=stage.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(.2,r.width/Math.max(1,r.height));camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
function clearVisual(){try{disposeVisual?.()}catch{}disposeVisual=null;tickVisual=null;if(visual){scene.remove(visual);visual=null}sourceOnly.classList.remove('show')}
function ground(obj){obj.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(obj);if(Number.isFinite(b.min.y))obj.position.y-=b.min.y;obj.updateMatrixWorld(true)}
function fit(obj){const b=new THREE.Box3().setFromObject(obj),s=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3());if(!Number.isFinite(s.y)||s.y<=0)return;const r=Math.max(s.x,s.y,s.z)*.78;controls.target.copy(c);camera.position.set(c.x+r*.95,c.y+r*.42,c.z+r*1.65);camera.near=Math.max(.01,r/100);camera.far=Math.max(80,r*30);camera.updateProjectionMatrix();controls.update()}
async function ensureGraft(){if(!graftModule)graftModule=await import(CDN+'tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js');if(!graftContract)graftContract=await fetch(CDN+'tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json').then(r=>{if(!r.ok)throw Error('graft contract '+r.status);return r.json()})}
async function loadVisual(profile){
  if(profile.renderMode==='source-only'){
    sourceOnlyText.textContent='Legacy FrizzleBob remains the current Arena source at '+profile.sources.model.path+'. This shared POC does not copy the private Arena runtime asset and does not invent a replacement model.';
    sourceOnly.classList.add('show');return;
  }
  if(profile.renderMode==='direct'){
    const gltf=await loader.loadAsync(raw(profile.sources.model.path));visual=gltf.scene;scene.add(visual);ground(visual);fit(visual);return;
  }
  if(profile.renderMode==='graft'){
    await ensureGraft();const holder=new THREE.Group();scene.add(holder);const pet=graftModule.pickGraftPet(graftContract,'graft-driver');const graft=await graftModule.mountGraft({THREE,loader,parent:holder,pet,lib:graftContract,camera,animation:'host',poseOverClip:false,override:{graft:{weapon:{on:false}},pose:{on:false}}});visual=holder;disposeVisual=()=>graft.dispose();tickVisual=(dt)=>graft.update(dt,camera);ground(holder);fit(holder);return;
  }
  throw Error('unsupported render mode '+profile.renderMode);
}
function setRosterActive(id){for(const b of roster.querySelectorAll('button'))b.classList.toggle('active',b.dataset.id===id)}
function renderProfile(p){
  statusEl.textContent=p.status.toUpperCase();statusEl.className='pill '+(p.status==='enabled'?'ok':p.status==='hold'?'hold':'hold');rigEl.textContent=p.rigFamily;adapterEl.textContent=p.adapterKind;
  gatesEl.innerHTML='';for(const k of ['asset','clips','face','ground','muzzle']){const d=document.createElement('div');d.className='gate '+(p.gates[k]?'on':'off');d.textContent=k.toUpperCase();gatesEl.append(d)}
  const model=p.sources?.model;factsEl.textContent=[p.label,model?model.repo+'@'+model.commit:'',model?.path||'',p.sources?.motionEvidence?('motion '+p.sources.motionEvidence.checks):'',p.renderMode==='source-only'?'visual: source-only / no replacement':'visual: exact pinned donor'].filter(Boolean).join('\n');
  ownersEl.textContent=['world '+p.owners.world,'mixer '+p.owners.mixer,'face '+p.owners.face,'ground '+p.owners.ground,'combat '+p.owners.combat].join('\n');
  notesEl.textContent=(p.notes||[]).join('\n');setRosterActive(p.id);
}
function updateUrl(id){const u=new URL(location.href);u.searchParams.set('actor',id);history.replaceState(null,'',u)}
async function selectActor(id){
  const p=byId.get(id);if(!p)throw Error('unknown actor '+id);const my=++token;ready=false;error=null;selected=id;clearVisual();renderProfile(p);statusEl.textContent='LOADING';updateUrl(id);
  try{await loadVisual(p);if(my!==token)return;statusEl.textContent=p.status.toUpperCase();ready=true;window.__KFB_CA2_SELECTOR__.ready=true;window.__KFB_CA2_SELECTOR__.error=null}
  catch(e){if(my!==token)return;error=String(e?.stack||e);statusEl.textContent='SOURCE ERROR';statusEl.className='pill bad';sourceOnlyText.textContent='Exact source failed to load. No fallback geometry was substituted. '+error;sourceOnly.classList.add('show');window.__KFB_CA2_SELECTOR__.error=error;ready=false;throw e}
}
function buildRoster(){for(const p of profiles){const b=document.createElement('button');b.className='fighter';b.dataset.id=p.id;b.dataset.state=p.status;b.innerHTML='<strong>'+p.label+'</strong><small>'+p.adapterKind+' · '+p.status+'</small>';b.onclick=()=>selectActor(p.id).catch(()=>{});roster.append(b)}}
function snapshot(){const p=byId.get(selected);return{ready,error,selected,renderMode:p?.renderMode||null,status:p?.status||null,rigFamily:p?.rigFamily||null,adapterKind:p?.adapterKind||null,gates:p?{...p.gates}:null,owners:p?{...p.owners}:null,visualPresent:!!visual,sourceOnly:sourceOnly.classList.contains('show'),storageWrites:0,scope:{worldMovement:false,physics:false,combat:false,rewards:false,arenaSave:false}}}
window.__KFB_CA2_SELECTOR__={version:'0.1-candidate',ready:false,error:null,sourcePin:PIN,selectActor,snapshot};

buildRoster();const requested=new URL(location.href).searchParams.get('actor');const initial=byId.has(requested)?requested:'frizzlebob-driver';selectActor(initial).catch(()=>{});
const clock=new THREE.Clock();renderer.setAnimationLoop(()=>{const dt=Math.min(.05,clock.getDelta());tickVisual?.(dt);controls.update();renderer.render(scene,camera)});
