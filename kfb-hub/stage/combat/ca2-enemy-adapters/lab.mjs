import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const MODEL_PIN='891eadf01e218f5fc21387e64cea1fec8332c5b6';
const ANIM_PIN='11d7df978c63b9e375707bd8d9431b4c8358cda8';
const RAW='https://raw.githubusercontent.com/georg-doc/kayfabizarro/';
const enc=p=>p.split('/').map(encodeURIComponent).join('/');
const raw=(pin,p)=>RAW+pin+'/'+enc(p);
const SETROOT='media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/';
const actors=[
 {id:'skeleton-warrior',label:'Skeleton Warrior',rig:'Rig_Medium',role:'proof-medium-melee',path:'media/3D_Assets/KayKit_Skeletons/characters/gltf/Skeleton_Warrior.glb'},
 {id:'orc-brute',label:'Orc Brute',rig:'Rig_Large',role:'proof-large-brute',path:'media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb'},
 {id:'avian-swordsman',label:'Avian Swordsman',rig:'Rig_Medium',role:'comparison-only',path:'media/3D_Assets/KayKit_Mystery_Series6/9 - March 2026 - Avian Swordsman/AvianSwordsman.glb'}
];
const setNames=['General','MovementBasic','CombatMelee'];
const setPath=(rig,set)=>SETROOT+rig+'/'+rig+'_'+set+'.glb';

const stage=document.getElementById('stage'),statusEl=document.getElementById('status'),actorsEl=document.getElementById('actors'),factsEl=document.getElementById('facts'),setsEl=document.getElementById('sets'),semEl=document.getElementById('semantics');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x172027);
const camera=new THREE.PerspectiveCamera(32,1,.02,100);camera.position.set(4.6,2.7,7.2);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;stage.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xe7edf0,0x3d4548,1.7));const sun=new THREE.DirectionalLight(0xffe4bd,2.2);sun.position.set(5,8,5);scene.add(sun);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.MeshStandardMaterial({color:0x252e33,roughness:.95}));floor.rotation.x=-Math.PI/2;scene.add(floor);const grid=new THREE.GridHelper(20,40,0x607078,0x344148);grid.position.y=.002;scene.add(grid);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,1.2,0);controls.maxPolarAngle=Math.PI*.49;
function resize(){const r=stage.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(.2,r.width/Math.max(1,r.height));camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();

const loader=new GLTFLoader(), roots=new Map(), inventories={Medium:{},Large:{}}, actorFacts={};let selected='skeleton-warrior',ready=false,error=null;
function rigKey(r){return r==='Rig_Large'?'Large':'Medium'}
function boneFacts(root){const bones=[];root.traverse(n=>{if(n.isBone)bones.push(n.name)});return{count:bones.length,names:bones}}
function visibleBounds(root){
  const box=new THREE.Box3();const v=new THREE.Vector3();let points=0;
  root.updateMatrixWorld(true);
  root.traverse(n=>{
    if(!n.isMesh||!n.geometry?.attributes?.position)return;
    const a=n.geometry.attributes.position,step=Math.max(1,Math.floor(a.count/2500));
    for(let i=0;i<a.count;i+=step){v.fromBufferAttribute(a,i);if(n.isSkinnedMesh&&n.applyBoneTransform)n.applyBoneTransform(i,v);v.applyMatrix4(n.matrixWorld);box.expandByPoint(v);points++}
  });
  const size=box.getSize(new THREE.Vector3());return{min:box.min.toArray(),max:box.max.toArray(),size:size.toArray(),height:size.y,points};
}
function ground(root){const b=visibleBounds(root);if(Number.isFinite(b.min[1]))root.position.y-=b.min[1];root.updateMatrixWorld(true);return visibleBounds(root)}
function semantics(inv){
 const all=[...new Set(Object.values(inv).flat())];
 const pick=re=>all.filter(n=>re.test(n));
 return{idle:pick(/(^|_)Idle(_|$)|Idle/i),move:pick(/Walking|Running|Jog|Walk|Run/i),attack:pick(/Attack|Melee/i),hit:pick(/(^|_)Hit(_|$)|Hit|Damage/i),defeat:pick(/Death|Defeat|Dead/i)};
}
function fit(root){const b=new THREE.Box3().setFromObject(root),s=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3()),r=Math.max(s.x,s.y,s.z,.5);controls.target.copy(c);camera.position.set(c.x+r*.9,c.y+r*.45,c.z+r*1.65);controls.update()}
function render(){
 const a=actors.find(x=>x.id===selected),f=actorFacts[selected],inv=inventories[rigKey(a.rig)],sem=semantics(inv);
 for(const [id,r] of roots)r.visible=id===selected;
 factsEl.textContent=[a.label,a.role,a.rig,a.path,'bones '+f.bones.count,'visible height '+f.bounds.height.toFixed(4),'sampled vertices '+f.bounds.points].join('\n');
 setsEl.textContent=setNames.map(s=>a.rig+'_'+s+' · '+(inv[s]?.length||0)+' clips\n'+(inv[s]||[]).join('\n')).join('\n\n');
 semEl.textContent=Object.entries(sem).map(([k,v])=>k.toUpperCase()+' ('+v.length+')\n'+v.join('\n')).join('\n\n');
 document.querySelectorAll('[data-actor]').forEach(b=>b.classList.toggle('active',b.dataset.actor===selected));fit(roots.get(selected));
}
function snapshot(){const a=actors.find(x=>x.id===selected);return{ready,error,selected,source:{modelPin:MODEL_PIN,animationPin:ANIM_PIN},actors:actors.map(x=>({...x,facts:actorFacts[x.id]})),clipSets:inventories,semantics:{Medium:semantics(inventories.Medium),Large:semantics(inventories.Large)},scope:{arenaRuntime:false,hp:false,damage:false,rewards:false,respawn:false,weapons:false}}}
window.__KFB_CA203_ENUM__={ready:false,error:null,snapshot,select:id=>{if(roots.has(id)){selected=id;render()}}};

async function boot(){
 try{
  for(const a of actors){
    const g=await loader.loadAsync(raw(MODEL_PIN,a.path)),root=g.scene;root.visible=false;scene.add(root);const b=ground(root);roots.set(a.id,root);actorFacts[a.id]={bones:boneFacts(root),bounds:b,embeddedAnimations:(g.animations||[]).map(c=>c.name)};
    const btn=document.createElement('button');btn.dataset.actor=a.id;btn.textContent=a.label;btn.onclick=()=>{selected=a.id;render()};actorsEl.append(btn);
  }
  for(const rig of ['Rig_Medium','Rig_Large']){
    const key=rigKey(rig);
    for(const s of setNames){const p=setPath(rig,s),g=await loader.loadAsync(raw(ANIM_PIN,p));inventories[key][s]=(g.animations||[]).map(c=>c.name)}
  }
  ready=true;window.__KFB_CA203_ENUM__.ready=true;statusEl.textContent='ready';render();
 }catch(e){error=String(e?.stack||e);window.__KFB_CA203_ENUM__.error=error;statusEl.textContent='error';factsEl.textContent=error;console.error(e)}
}
const clock=new THREE.Clock();renderer.setAnimationLoop(()=>{clock.getDelta();controls.update();renderer.render(scene,camera)});boot();
