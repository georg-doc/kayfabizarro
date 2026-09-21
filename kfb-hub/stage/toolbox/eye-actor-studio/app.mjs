import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {EyeRig} from '../../../../tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js';
import {BrowRig} from '../../../../tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/brow-rig.v2.js';
import {applyOval} from '../../../../tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/eyeoval.v1.js';
import {EyeCluster} from '../../../../tools/KFB-ToolBox/eye-actor-studio-v1/eye-cluster.v1.mjs';

const $=s=>document.querySelector(s),stage=$('#stage'),canvas=$('#view');
const scene=new THREE.Scene();scene.background=new THREE.Color('#d8dfdc');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.shadowMap.enabled=true;
const camera=new THREE.PerspectiveCamera(34,1,.05,100);
const orbit=new OrbitControls(camera,canvas);orbit.enableDamping=true;orbit.target.set(0,.08,0);

scene.add(new THREE.HemisphereLight(0xfffbef,0x59605d,1.6));
const key=new THREE.DirectionalLight(0xffe3c7,2.7);key.position.set(-4,6,7);key.castShadow=true;scene.add(key);
const fill=new THREE.DirectionalLight(0xcbd9ee,.55);fill.position.set(4,2,5);scene.add(fill);

const host=new THREE.Group();scene.add(host);
const headMat=new THREE.MeshStandardMaterial({color:'#d69a78',roughness:.84,metalness:0});
const headGeo=new THREE.SphereGeometry(1,48,32);headGeo.scale(.96,1.12,.82);headGeo.computeBoundingBox();
const head=new THREE.Mesh(headGeo,headMat);head.name='body';head.castShadow=true;head.receiveShadow=true;host.add(head);
const floor=new THREE.Mesh(new THREE.CircleGeometry(3,48),new THREE.ShadowMaterial({opacity:.16}));
floor.rotation.x=-Math.PI/2;floor.position.y=-1.15;floor.receiveShadow=true;scene.add(floor);

const ch={THREE,inner:host,o:{makeMat:o=>new THREE.MeshStandardMaterial({color:o.color,roughness:o.roughness??.85,metalness:0})}};
let donorRig=null,donorBrow=null,cluster=null,mode='cluster',preset='pair-frontal';

function buildDonor(){
  donorBrow?.dispose?.();donorRig?.dispose?.();
  donorRig=new EyeRig(ch,{
    anchor:{dx:.34,dy:.02,ring:.27,track:.11},
    baseColor:0xd69a78,pupilSize:.38,gloss:.3,lidFit:.9,
    life:{on:false,wander:0,tremor:0}
  });
  donorRig.build();
  applyOval(donorRig,{w:1,h:1,d:1,tilt:0});
  donorBrow=new BrowRig({
    THREE,getEyeFrame:()=>donorRig.eyeFrame(),baseColor:0xd69a78,
    params:{solid:true,round:1,even:true,thickness:1.5,lift:.24}
  });
}
function ensureCluster(){
  if(!cluster)cluster=new EyeCluster(THREE,host,{radius:.29,faceColor:'#d69a78'});
}
function setMode(v){
  mode=v;ensureCluster();
  if(v==='donor'){
    cluster.root.visible=false;
    buildDonor();
  }else{
    donorBrow?.dispose?.();donorBrow=null;
    donorRig?.dispose?.();donorRig=null;
    cluster.root.visible=true;
  }
  syncUI();publish();
}
function resize(){
  const r=stage.getBoundingClientRect();if(r.width<1||r.height<1)return;
  renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);

function setView(v){
  const p={front:[0,.1,4.8],three:[3.1,.65,3.7],side:[4.8,.1,0],top:[0,4.8,.01]}[v]||[0,.1,4.8];
  camera.position.set(...p);orbit.target.set(0,.05,0);orbit.update();
}
setView('front');

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

function selected(){ensureCluster();return cluster.slot();}
function syncControls(){
  if(mode!=='cluster'||!selected())return;
  const s=selected();
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
  $('#lidThickness').value=s.lidThickness;
  $('#lidThicknessOut').textContent=s.lidThickness.toFixed(2);
  $('#lidCurve').value=s.lidCurve;
  $('#lidCurveOut').textContent=s.lidCurve.toFixed(1);
  $('#selectedTitle').textContent=s.id+' · '+s.role;
}
function updateFromControls(){
  if(mode!=='cluster')return;
  const n=id=>+$('#'+id).value;
  cluster.updateSlot(cluster.selected,{
    position:[n('px'),n('py'),n('pz')],
    size:n('size'),
    shape:[n('sx'),n('sy'),n('sz')],
    eulerDeg:[n('pitch'),n('yaw'),n('roll')],
    gaze:[n('gazeX'),n('gazeY')]
  });
  syncUI();publish();
}
function slotList(){
  const wrap=$('#slots');wrap.innerHTML='';
  if(mode!=='cluster'){
    wrap.innerHTML='<div class="tiny">Donor pair owned by EyeRig v6.</div>';
    return;
  }
  cluster.slots.forEach((s,i)=>{
    const b=document.createElement('button');
    b.className='slot'+(i===cluster.selected?' active':'');
    b.innerHTML='<span>'+s.id+'</span><small>'+s.size.toFixed(2)+' · '+s.eulerDeg.map(Math.round).join('/')+'°</small>';
    b.onclick=()=>{cluster.selected=i;syncUI();publish();};
    wrap.append(b);
  });
}
function syncUI(){
  slotList();syncControls();
  const r=mode==='cluster'?cluster.report():null;
  $('#status').textContent=mode==='cluster'?(r.count+' eye'+(r.count>1?'s':'')+' · '+cluster.debug+' · '+cluster.emanata):'exact EyeRig v6 + BrowRig v2 donor';
  $('#orient').textContent=mode==='cluster'&&selected()?('P/Y/R '+selected().eulerDeg.map(v=>Math.round(v)).join(' / ')+'°'):'pair donor';
  $('#json').textContent=mode==='cluster'?JSON.stringify(cluster.export(),null,2):JSON.stringify({mode:'donor',owner:'EyeRig v6',browOwner:'BrowRig v2',eyeOval:'v1'},null,2);
  document.documentElement.dataset.kfbEyeStudioReady='yes';
}
function publish(){
  window.__KFB_EYE_ACTOR_STUDIO_V1__={
    ready:true,mode,preset,
    donor:{eyeRig:'v6',browRig:'v2',eyeOval:'v1'},
    cluster:mode==='cluster'?cluster.report():null
  };
}

$('#mode').onchange=e=>setMode(e.target.value);
$('#preset').onchange=e=>{
  preset=e.target.value;ensureCluster();cluster.setPreset(preset);syncUI();publish();
};
$('#pose').onchange=e=>{
  if(mode==='cluster'){
    cluster.applyPose(e.target.value,$('#scope').value);syncUI();publish();
  }else{
    const sk=e.target.value==='skeptical';
    donorRig?.applyEmote?.({lidUpper:sk?[.60,.12]:0,lidLower:sk?[.16,.03]:0,slant:sk?[.22,-.05]:0,pupil:'normal',gaze:'front'});
    donorBrow?.expression?.(sk?'skeptical':'neutral');
  }
};
$('#scope').onchange=e=>{ensureCluster();cluster.scope=e.target.value;publish();};
$('#blink').onclick=()=>mode==='cluster'?cluster.blink($('#scope').value):donorRig?.blinkNow?.();
$('#minus').onclick=()=>{if(mode==='cluster'){cluster.removeEye();syncUI();publish();}};
$('#plus').onclick=()=>{if(mode==='cluster'){cluster.addEye();syncUI();publish();}};
$('#reset').onclick=()=>{if(mode==='cluster'){cluster.setPreset(preset);syncUI();publish();}};
$('#debug').onchange=e=>{ensureCluster();cluster.setDebug(e.target.value);syncUI();publish();};
$('#emanata').onchange=e=>{ensureCluster();cluster.setEmanata(e.target.value);syncUI();publish();};
$('#lidMode').onchange=e=>{if(mode==='cluster'){cluster.updateSlot(cluster.selected,{lidMode:e.target.value});syncUI();publish();}};
$('#lidThickness').oninput=e=>{if(mode==='cluster'){cluster.updateSlot(cluster.selected,{lidThickness:+e.target.value});syncUI();publish();}};
$('#lidCurve').oninput=e=>{if(mode==='cluster'){cluster.updateSlot(cluster.selected,{lidCurve:+e.target.value});syncUI();publish();}};
$('#copyJson').onclick=async()=>{
  try{
    await navigator.clipboard.writeText($('#json').textContent);
    $('#copyJson').textContent='Copied';
    setTimeout(()=>$('#copyJson').textContent='Copy JSON',800);
  }catch{}
};
for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>setView(b.dataset.view);
$('#theme').onclick=()=>{
  const dark=document.documentElement.dataset.theme==='dark';
  if(!dark){
    document.documentElement.dataset.theme='dark';
    document.documentElement.style.setProperty('--bg','#0f0e0c');
    document.documentElement.style.setProperty('--panel','#191714');
    document.documentElement.style.setProperty('--ink','#f3eddf');
    document.documentElement.style.setProperty('--muted','#aaa093');
    document.documentElement.style.setProperty('--line','#38332c');
    document.documentElement.style.setProperty('--chip','#25211c');
    $('#theme').textContent='Paper';
  }else location.reload();
};

ensureCluster();cluster.setPreset(preset);setMode('cluster');resize();syncUI();publish();
const clock=new THREE.Clock();
renderer.setAnimationLoop(()=>{
  const dt=Math.min(.05,clock.getDelta());
  donorRig?.update?.(dt);donorBrow?.sync?.();
  orbit.update();renderer.render(scene,camera);publish();
});
