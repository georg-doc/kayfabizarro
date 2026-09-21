import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {EyeRig} from '../../../../tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js';
import {BrowRig} from '../../../../tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/brow-rig.v2.js';
import {applyOval} from '../../../../tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/eyeoval.v1.js';
import {EyeCluster} from '../../../../tools/KFB-ToolBox/eye-actor-studio-v1/eye-cluster.v1.mjs';
import {loadHostCatalog} from '../../../../tools/KFB-ToolBox/eye-actor-studio-v1/host-catalog.v1.mjs';
import {HostRuntime} from '../../../../tools/KFB-ToolBox/eye-actor-studio-v1/host-runtime.v1.mjs';

const $=s=>document.querySelector(s),stage=$('#stage'),canvas=$('#view');
const scene=new THREE.Scene();scene.background=new THREE.Color('#d8dfdc');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const camera=new THREE.PerspectiveCamera(34,1,.05,120);
const orbit=new OrbitControls(camera,canvas);orbit.enableDamping=true;orbit.target.set(0,1.5,0);

scene.add(new THREE.HemisphereLight(0xfffbef,0x59605d,1.6));
const key=new THREE.DirectionalLight(0xffe3c7,2.7);key.position.set(-4,7,7);key.castShadow=true;scene.add(key);
const fill=new THREE.DirectionalLight(0xcbd9ee,.55);fill.position.set(4,2,5);scene.add(fill);

const sourceStage=new THREE.Group();sourceStage.name='KFB Eye Actor source stage';scene.add(sourceStage);
const floor=new THREE.Mesh(new THREE.CircleGeometry(4.5,56),new THREE.ShadowMaterial({opacity:.16}));
floor.rotation.x=-Math.PI/2;floor.position.y=-.01;floor.receiveShadow=true;scene.add(floor);
const loader=new GLTFLoader();

let bundle=null,hostRuntime=null,activeHost=null,activeHostDef=null;
let donorRig=null,donorBrow=null,cluster=null;
let mode='source',preset='pair-frontal',currentView='three';
let hostLoadToken=0,lastHostId=null;
let frameState={center:new THREE.Vector3(0,1.5,0),radius:2};

function log(msg){console.log('[EyeActorStudio]',msg);}

function disposeDonor(){
  donorBrow?.dispose?.();donorBrow=null;
  donorRig?.dispose?.();donorRig=null;
}
function disposeCluster(){
  cluster?.dispose?.();cluster=null;
}
function faceColorInt(hex){
  const s=String(hex||'#d7a17d').replace('#','');
  return Number.parseInt(s,16)||0xd7a17d;
}
function ensureCluster(){
  if(cluster||!activeHost?.faceHost)return cluster;
  cluster=new EyeCluster(THREE,activeHost.faceHost.inner,{radius:.29,faceColor:activeHost.color||'#d7a17d'});
  cluster.root.scale.setScalar(activeHost.unit||1);
  cluster.setPreset(preset);
  cluster.setDebug($('#debug').value);
  cluster.setEmanata($('#emanata').value);
  cluster.root.visible=mode==='cluster';
  return cluster;
}
function buildDonor(){
  disposeDonor();
  if(!activeHost?.faceHost)return;
  const ch=activeHost.faceHost.faceCtx();
  ch.o=ch.o||{};
  ch.o.makeMat=o=>new THREE.MeshStandardMaterial({color:o.color,roughness:o.roughness??.85,metalness:0});
  donorRig=new EyeRig(ch,{
    anchor:{dx:.34,dy:.02,ring:.27,track:.11},
    baseColor:faceColorInt(activeHost.color),
    pupilSize:.38,gloss:.3,lidFit:.9,
    life:{on:false,wander:0,tremor:0}
  });
  donorRig.build();
  applyOval(donorRig,{w:1,h:1,d:1,tilt:0});
  donorBrow=new BrowRig({
    THREE,getEyeFrame:()=>donorRig.eyeFrame(),baseColor:faceColorInt(activeHost.color),
    params:{solid:true,round:1,even:true,thickness:1.5,lift:.24}
  });
}

function applyMode(){
  ensureCluster();
  if(mode==='source'){
    if(cluster)cluster.root.visible=false;
    disposeDonor();
  }else if(mode==='donor'){
    if(cluster)cluster.root.visible=false;
    buildDonor();
  }else{
    disposeDonor();
    if(cluster)cluster.root.visible=true;
  }
  syncUI();publish();
}

function resize(){
  const r=stage.getBoundingClientRect();if(r.width<1||r.height<1)return;
  renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);

function updateFrameState(){
  if(!hostRuntime?.wrapper)return;
  const box=new THREE.Box3().setFromObject(hostRuntime.wrapper);
  if(box.isEmpty())return;
  const sphere=box.getBoundingSphere(new THREE.Sphere());
  frameState={center:sphere.center.clone(),radius:Math.max(.65,sphere.radius)};
}
function setView(v=currentView){
  currentView=v;updateFrameState();
  const c=frameState.center,r=frameState.radius;
  const dirs={
    front:new THREE.Vector3(0,.08,1),
    three:new THREE.Vector3(1,.45,1.25),
    side:new THREE.Vector3(1,.08,0),
    top:new THREE.Vector3(.001,1,.001)
  };
  const dir=(dirs[v]||dirs.three).normalize();
  const vf=THREE.MathUtils.degToRad(camera.fov);
  const hf=2*Math.atan(Math.tan(vf/2)*camera.aspect);
  const dist=r/Math.sin(Math.min(vf,hf)/2)*1.22;
  orbit.target.copy(c);
  camera.position.copy(c).addScaledVector(dir,dist);
  camera.near=Math.max(.02,dist/220);camera.far=dist+r*14;camera.updateProjectionMatrix();orbit.update();
}

const defs=[
  ['px','X',-1.2,1.2,.01],['py','Y',-1.0,1.0,.01],['pz','Z',-.2,1.25,.01],
  ['size','Size',.35,1.7,.01],['sx','Width',.5,1.7,.01],['sy','Height',.5,1.7,.01],['sz','Depth',.5,1.7,.01],
  ['pitch','Pitch',-90,90,1],['yaw','Yaw',-110,110,1],['roll','Roll',-90,90,1],
  ['gazeX','Gaze X',-1,1,.05],['gazeY','Gaze Y',-1,1,.05]
];
const controls=$('#controls');
for(const [id,label,min,max,step] of defs){
  const row=document.createElement('div');row.className='row';
  row.innerHTML='<label for="'+id+'">'+label+'</label><input id="'+id+'" type="range" min="'+min+'" max="'+max+'" step="'+step+'"><output id="'+id+'Out"></output>';
  controls.append(row);
  row.querySelector('input').addEventListener('input',updateFromControls);
}

function selected(){return cluster?.slot?.()||null;}
function syncControls(){
  const s=selected();
  const disabled=mode!=='cluster'||!s;
  controls.querySelectorAll('input').forEach(el=>el.disabled=disabled);
  $('#lidMode').disabled=disabled;$('#lidThickness').disabled=disabled;$('#lidCurve').disabled=disabled;
  if(!s){$('#selectedTitle').textContent=mode==='source'?'Source-only view':'EyeRig v6 donor pair';return;}
  const vals={
    px:s.position[0],py:s.position[1],pz:s.position[2],
    size:s.size,sx:s.shape[0],sy:s.shape[1],sz:s.shape[2],
    pitch:s.eulerDeg[0],yaw:s.eulerDeg[1],roll:s.eulerDeg[2],
    gazeX:s.gaze[0],gazeY:s.gaze[1]
  };
  for(const [id,v] of Object.entries(vals)){
    const el=$('#'+id),out=$('#'+id+'Out');
    if(el){el.value=v;if(out)out.textContent=(Math.round(v*100)/100).toString();}
  }
  $('#lidMode').value=s.lidMode;
  $('#lidThickness').value=s.lidThickness;$('#lidThicknessOut').textContent=s.lidThickness.toFixed(2);
  $('#lidCurve').value=s.lidCurve;$('#lidCurveOut').textContent=s.lidCurve.toFixed(1);
  $('#selectedTitle').textContent=s.id+' · '+s.role;
}
function updateFromControls(){
  if(mode!=='cluster'||!cluster)return;
  const n=id=>+$('#'+id).value;
  cluster.updateSlot(cluster.selected,{
    position:[n('px'),n('py'),n('pz')],
    size:n('size'),shape:[n('sx'),n('sy'),n('sz')],
    eulerDeg:[n('pitch'),n('yaw'),n('roll')],
    gaze:[n('gazeX'),n('gazeY')]
  });
  syncUI();publish();
}
function slotList(){
  const wrap=$('#slots');wrap.innerHTML='';
  if(mode!=='cluster'||!cluster){
    wrap.innerHTML='<div class="tiny">'+(mode==='source'?'Source shown without Eye Actor overlay.':'Exact pair donor is active.')+'</div>';
    return;
  }
  cluster.slots.forEach((s,i)=>{
    const b=document.createElement('button');b.className='slot'+(i===cluster.selected?' active':'');
    b.innerHTML='<span>'+s.id+'</span><small>'+s.size.toFixed(2)+' · '+s.eulerDeg.map(Math.round).join('/')+'°</small>';
    b.onclick=()=>{cluster.selected=i;syncUI();publish();};wrap.append(b);
  });
}

function fillHostSelect(hosts){
  const sel=$('#hostSelect');sel.innerHTML='';
  const groups=new Map();
  for(const h of hosts){
    if(!groups.has(h.group))groups.set(h.group,[]);
    groups.get(h.group).push(h);
  }
  for(const [label,list] of groups){
    const og=document.createElement('optgroup');og.label=label;
    for(const h of list){const o=new Option(h.label,h.id);og.append(o);}
    sel.append(og);
  }
}
function fillLegacySelectors(){
  $('#legacyBody').innerHTML='';
  for(const b of hostRuntime.legacyBodies())$('#legacyBody').append(new Option(b.label,b.id));
  $('#legacyHead').innerHTML='';
  for(const h of hostRuntime.legacyHeads())$('#legacyHead').append(new Option(h.label,h.id));
  $('#legacyBody').value='rogue';
  $('#legacyHead').value='rogue-default';
}
function activeLegacyOptions(){
  return {legacyBodyId:$('#legacyBody').value||'rogue',legacyHeadId:$('#legacyHead').value||'rogue-default'};
}

async function loadHost(id){
  const def=bundle.hosts.find(h=>h.id===id);
  if(!def)return;
  const token=++hostLoadToken;
  document.documentElement.dataset.kfbEyeHostReady='no';
  document.documentElement.dataset.kfbEyeStudioReady='no';
  $('#hostSelect').disabled=true;
  $('#hostStatus').className='source-line';
  $('#hostStatus').textContent='Loading exact source…';
  $('#hostSource').textContent=def.path||def.ownerCatalog||'Lab placeholder';

  disposeDonor();disposeCluster();
  try{
    const result=await hostRuntime.load(def,activeLegacyOptions());
    if(token!==hostLoadToken)return;
    activeHost=result;activeHostDef=def;lastHostId=id;
    const modular=def.kind==='legacy-modular';
    $('#legacyModular').hidden=!modular;
    ensureCluster();
    applyMode();
    setView(currentView);
    const rep=result.report;
    $('#hostStatus').className='source-line ok';
    $('#hostStatus').textContent='SOURCE READY · '+rep.kind+' · FaceHost '+rep.faceHost.status+' · color '+rep.sourceColor;
    $('#hostSource').textContent=(rep.sourcePath||def.ownerCatalog||'procedural lab placeholder')+(rep.legacyHead?.label?' · '+rep.legacyHead.label:'');
    $('#hostBadge').textContent=def.label+' · '+rep.kind;
    document.documentElement.dataset.kfbEyeHost=def.id;
    document.documentElement.dataset.kfbEyeHostReady='yes';
    document.documentElement.dataset.kfbEyeStudioReady='yes';
    publish();
  }catch(e){
    console.error(e);
    $('#hostStatus').className='source-line warn';
    $('#hostStatus').textContent='UNSUPPORTED / LOAD FAILED · '+e.message;
    $('#hostBadge').textContent=def.label+' · FAILED';
    document.documentElement.dataset.kfbEyeHost='error';
    document.documentElement.dataset.kfbEyeHostReady='error';
    window.__KFB_EYE_ACTOR_STUDIO_V1__={ready:false,host:{id:def.id,error:String(e)}};
  }finally{
    if(token===hostLoadToken)$('#hostSelect').disabled=false;
  }
}

function syncUI(){
  slotList();syncControls();
  const r=cluster?.report?.()||null;
  if(mode==='source')$('#status').textContent='SOURCE ONLY · no Eye Actor overlay';
  else if(mode==='donor')$('#status').textContent='EyeRig v6 + BrowRig v2 donor';
  else $('#status').textContent=(r?.count||0)+' eye'+((r?.count||0)!==1?'s':'')+' · '+cluster.debug+' · '+cluster.emanata;
  $('#orient').textContent=mode==='cluster'&&selected()?('P/Y/R '+selected().eulerDeg.map(v=>Math.round(v)).join(' / ')+'°'):mode.toUpperCase();
  const exportData={
    schema:'kfb.eye-actor-studio/1-candidate',mode,preset,
    host:hostRuntime?.report||null,
    donor:{eyeRig:'v6',browRig:'v2',eyeOval:'v1'},
    cluster:r
  };
  $('#json').textContent=JSON.stringify(exportData,null,2);
  if(document.documentElement.dataset.kfbEyeHostReady==='yes')document.documentElement.dataset.kfbEyeStudioReady='yes';
}
function publish(){
  window.__KFB_EYE_ACTOR_STUDIO_V1__={
    ready:document.documentElement.dataset.kfbEyeStudioReady==='yes',
    mode,preset,
    host:hostRuntime?.report||null,
    hostId:lastHostId,
    donor:{eyeRig:'v6',browRig:'v2',eyeOval:'v1'},
    cluster:cluster?.report?.()||null
  };
}

$('#mode').onchange=e=>{mode=e.target.value;applyMode();};
$('#preset').onchange=e=>{preset=e.target.value;ensureCluster();cluster.setPreset(preset);syncUI();publish();};
$('#pose').onchange=e=>{
  if(mode==='cluster'&&cluster){cluster.applyPose(e.target.value,$('#scope').value);syncUI();publish();}
  else if(mode==='donor'){
    const sk=e.target.value==='skeptical';
    donorRig?.applyEmote?.({lidUpper:sk?[.60,.12]:0,lidLower:sk?[.16,.03]:0,slant:sk?[.22,-.05]:0,pupil:'normal',gaze:'front'});
    donorBrow?.expression?.(sk?'skeptical':'neutral');
  }
};
$('#scope').onchange=e=>{if(cluster)cluster.scope=e.target.value;publish();};
$('#blink').onclick=()=>mode==='cluster'?cluster?.blink?.($('#scope').value):mode==='donor'?donorRig?.blinkNow?.():null;
$('#minus').onclick=()=>{if(mode==='cluster'&&cluster){cluster.removeEye();syncUI();publish();}};
$('#plus').onclick=()=>{if(mode==='cluster'&&cluster){cluster.addEye();syncUI();publish();}};
$('#reset').onclick=()=>{if(mode==='cluster'&&cluster){cluster.setPreset(preset);syncUI();publish();}};
$('#debug').onchange=e=>{if(cluster){cluster.setDebug(e.target.value);syncUI();publish();}};
$('#emanata').onchange=e=>{if(cluster){cluster.setEmanata(e.target.value);syncUI();publish();}};
$('#lidMode').onchange=e=>{if(mode==='cluster'&&cluster){cluster.updateSlot(cluster.selected,{lidMode:e.target.value});syncUI();publish();}};
$('#lidThickness').oninput=e=>{if(mode==='cluster'&&cluster){cluster.updateSlot(cluster.selected,{lidThickness:+e.target.value});syncUI();publish();}};
$('#lidCurve').oninput=e=>{if(mode==='cluster'&&cluster){cluster.updateSlot(cluster.selected,{lidCurve:+e.target.value});syncUI();publish();}};
$('#copyJson').onclick=async()=>{try{await navigator.clipboard.writeText($('#json').textContent);$('#copyJson').textContent='Copied';setTimeout(()=>$('#copyJson').textContent='Copy JSON',800);}catch{}};
$('#hostSelect').onchange=e=>loadHost(e.target.value);
$('#legacyBody').onchange=()=>{if(activeHostDef?.kind==='legacy-modular')loadHost(activeHostDef.id);};
$('#legacyHead').onchange=()=>{if(activeHostDef?.kind==='legacy-modular')loadHost(activeHostDef.id);};
for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>setView(b.dataset.view);
$('#theme').onclick=()=>{
  const dark=document.documentElement.dataset.theme==='dark';
  if(!dark){
    document.documentElement.dataset.theme='dark';
    for(const [k,v] of Object.entries({'--bg':'#0f0e0c','--panel':'#191714','--ink':'#f3eddf','--muted':'#aaa093','--line':'#38332c','--chip':'#25211c'}))document.documentElement.style.setProperty(k,v);
    $('#theme').textContent='Paper';
  }else location.reload();
};

async function boot(){
  resize();
  bundle=await loadHostCatalog();
  hostRuntime=new HostRuntime({THREE,loader,stageRoot:sourceStage,catalogBundle:bundle,log});
  fillHostSelect(bundle.hosts);fillLegacySelectors();
  const def=bundle.hosts.find(h=>h.default)||bundle.hosts[0];
  $('#hostSelect').value=def.id;
  await loadHost(def.id);
}
boot().catch(e=>{
  console.error(e);$('#hostStatus').className='source-line warn';$('#hostStatus').textContent='BOOT FAILED · '+e.message;
  document.documentElement.dataset.kfbEyeStudioReady='error';
});

const clock=new THREE.Clock();
renderer.setAnimationLoop(()=>{
  const dt=Math.min(.05,clock.getDelta());
  donorRig?.update?.(dt);donorBrow?.sync?.();
  orbit.update();renderer.render(scene,camera);publish();
});
