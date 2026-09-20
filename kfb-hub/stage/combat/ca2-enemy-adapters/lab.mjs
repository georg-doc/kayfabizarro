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
 {id:'skeleton-warrior',label:'Skeleton Warrior',rig:'Rig_Medium',x:-3.15,path:'media/3D_Assets/KayKit_Skeletons/characters/gltf/Skeleton_Warrior.glb'},
 {id:'orc-brute',label:'Orc Brute',rig:'Rig_Large',x:0,path:'media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb'},
 {id:'avian-swordsman',label:'Avian Swordsman',rig:'Rig_Medium',x:3.15,path:'media/3D_Assets/KayKit_Mystery_Series6/9 - March 2026 - Avian Swordsman/AvianSwordsman.glb'}
];
const stateMap={
 'skeleton-warrior':{idle:'Idle_A',move:'Running_A',attack:'Melee_1H_Attack_Chop',hit:'Hit_A',defeat:'Death_A'},
 'orc-brute':{idle:'Idle_A',move:'Walking_A',attack:'Melee_Unarmed_Smash',hit:'Hit_A',defeat:'Death_A'},
 'avian-swordsman':{idle:'Idle_A',move:'Running_A',attack:'Melee_1H_Attack_Jump_Chop',hit:'Hit_A',defeat:'Death_A'}
};
const states=['idle','move','attack','hit','defeat'];
const setNames=['General','MovementBasic','CombatMelee'];
const setPath=(rig,set)=>SETROOT+rig+'/'+rig+'_'+set+'.glb';
const rootMotion=/^(root|hips)$/i;

const stage=document.getElementById('stage'),statusEl=document.getElementById('status'),statesEl=document.getElementById('states'),factsEl=document.getElementById('facts'),setsEl=document.getElementById('sets'),measureEl=document.getElementById('semantics');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x172027);
const camera=new THREE.PerspectiveCamera(34,1,.02,120);camera.position.set(9.1,4.2,11.8);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;stage.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xe7edf0,0x3d4548,1.75));const sun=new THREE.DirectionalLight(0xffe4bd,2.25);sun.position.set(5,9,6);scene.add(sun);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(24,16),new THREE.MeshStandardMaterial({color:0x252e33,roughness:.95}));floor.rotation.x=-Math.PI/2;scene.add(floor);const grid=new THREE.GridHelper(24,48,0x607078,0x344148);grid.position.y=.002;scene.add(grid);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,1.7,0);controls.maxPolarAngle=Math.PI*.49;
function resize(){const r=stage.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(.2,r.width/Math.max(1,r.height));camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();

const loader=new GLTFLoader(),actorState=new Map(),clips={Medium:new Map(),Large:new Map()};let current='idle',ready=false,error=null,autoTimer=null;
function rigKey(r){return r==='Rig_Large'?'Large':'Medium'}
function parseTrack(track){try{return THREE.PropertyBinding.parseTrackName(track.name)}catch{return null}}
function nodeNames(root){const s=new Set();root.traverse(n=>{if(n.name)s.add(n.name)});return s}
function cleanClip(root,src){
 const names=nodeNames(root),tracks=[];
 for(const tr of src.tracks||[]){const p=parseTrack(tr);if(!p?.nodeName||!names.has(p.nodeName))continue;if(p.propertyName==='position'&&rootMotion.test(p.nodeName))continue;tracks.push(tr.clone())}
 return new THREE.AnimationClip(src.name,src.duration,tracks,src.blendMode)
}
function visibleBounds(root){
 const box=new THREE.Box3(),v=new THREE.Vector3();let points=0;root.updateMatrixWorld(true);
 root.traverse(n=>{if(!n.isMesh||!n.geometry?.attributes?.position)return;const a=n.geometry.attributes.position,step=Math.max(1,Math.floor(a.count/2400));for(let i=0;i<a.count;i+=step){v.fromBufferAttribute(a,i);if(n.isSkinnedMesh&&n.applyBoneTransform)n.applyBoneTransform(i,v);v.applyMatrix4(n.matrixWorld);box.expandByPoint(v);points++}});
 const size=box.getSize(new THREE.Vector3());return{min:box.min.toArray(),max:box.max.toArray(),size:size.toArray(),diag:size.length(),height:size.y,points}
}
function groundRest(root){const b=visibleBounds(root);if(Number.isFinite(b.min[1]))root.position.y-=b.min[1];root.updateMatrixWorld(true);return visibleBounds(root)}
function getClip(a,state){const name=stateMap[a.id][state],key=rigKey(a.rig),src=clips[key].get(name);if(!src)throw Error('clip not found '+a.id+' '+state+' '+name);return src}
function loopFor(state){return state==='idle'||state==='move'}
function playState(state,{freeze=false,phase=.35}={}){
 if(!states.includes(state))throw Error('unknown state '+state);current=state;
 for(const a of actors){const st=actorState.get(a.id);st.mixer.stopAllAction();const src=getClip(a,state),clip=cleanClip(st.figure,src),action=st.mixer.clipAction(clip,st.figure);action.reset();action.enabled=true;action.setEffectiveWeight(1);if(loopFor(state)){action.setLoop(THREE.LoopRepeat,Infinity)}else{action.setLoop(THREE.LoopOnce,1);action.clampWhenFinished=true}action.play();st.action=action;st.clipName=src.name;st.duration=src.duration;if(freeze){const t=Math.max(0,Math.min(src.duration,src.duration*phase));st.mixer.setTime(t);action.time=t;action.paused=true;st.phase=phase}else st.phase=null}
 renderPanel();document.querySelectorAll('[data-state]').forEach(b=>b.classList.toggle('active',b.dataset.state===state));return snapshot()
}
function measured(){
 const out={};for(const a of actors){const st=actorState.get(a.id),b=visibleBounds(st.root);out[a.id]={clip:st.clipName,duration:+(st.duration||0).toFixed(4),phase:st.phase,bounds:{min:b.min.map(x=>+x.toFixed(4)),max:b.max.map(x=>+x.toFixed(4)),size:b.size.map(x=>+x.toFixed(4)),diag:+b.diag.toFixed(4),height:+b.height.toFixed(4)},groundMinY:+b.min[1].toFixed(4),anchor:{x:+st.root.position.x.toFixed(4),y:+st.root.position.y.toFixed(4),z:+st.root.position.z.toFixed(4)},restDiag:+st.rest.diag.toFixed(4),restHeight:+st.rest.height.toFixed(4)}}
 return out
}
function renderPanel(){
 factsEl.textContent=actors.map(a=>{const st=actorState.get(a.id);return a.label+' · '+a.rig+'\nstate '+current+' → '+(st?.clipName||stateMap[a.id][current])+'\nmixer '+(st?.mixer?'1':'0')+' · root-motion position tracks stripped'}).join('\n\n');
 setsEl.textContent=actors.map(a=>a.label+'\n'+states.map(s=>s+' → '+stateMap[a.id][s]).join('\n')).join('\n\n');
 const m=measured();measureEl.textContent=actors.map(a=>{const x=m[a.id];return a.label+'\nminY '+x.groundMinY+' · h '+x.bounds.height+' · diag '+x.bounds.diag+' / rest '+x.restDiag+'\nanchor '+JSON.stringify(x.anchor)}).join('\n\n')
}
function snapshot(){return{ready,error,current,stateMap,source:{modelPin:MODEL_PIN,animationPin:ANIM_PIN},actors:actors.map(a=>({id:a.id,label:a.label,rig:a.rig,oneMixer:!!actorState.get(a.id)?.mixer})),measurements:actorState.size?measured():{},scope:{arenaRuntime:false,hp:false,damage:false,rewards:false,respawn:false,weapons:false,worldMovement:false}}}
function startAuto(){clearInterval(autoTimer);let i=0;playState(states[i]);autoTimer=setInterval(()=>{i=(i+1)%states.length;playState(states[i])},1800)}
window.__KFB_CA203_PLAYBACK__={ready:false,error:null,snapshot,play:(s)=>playState(s),freeze:(s=current,p=.35)=>playState(s,{freeze:true,phase:p}),auto:startAuto};

async function boot(){
 try{
  for(const a of actors){const g=await loader.loadAsync(raw(MODEL_PIN,a.path)),root=g.scene;root.position.x=a.x;scene.add(root);const rest=groundRest(root);const mixer=new THREE.AnimationMixer(root);actorState.set(a.id,{root,figure:root,mixer,action:null,clipName:null,duration:0,phase:null,rest})}
  for(const rig of ['Rig_Medium','Rig_Large']){const key=rigKey(rig);for(const set of setNames){const g=await loader.loadAsync(raw(ANIM_PIN,setPath(rig,set)));for(const c of g.animations||[])clips[key].set(c.name,c)}}
  for(const s of states){const b=document.createElement('button');b.dataset.state=s;b.textContent=s;b.onclick=()=>playState(s);statesEl.append(b)}
  document.getElementById('auto').onclick=startAuto;document.getElementById('freeze').onclick=()=>playState(current,{freeze:true,phase:.35});
  ready=true;window.__KFB_CA203_PLAYBACK__.ready=true;statusEl.textContent='ready';playState('idle');
 }catch(e){error=String(e?.stack||e);window.__KFB_CA203_PLAYBACK__.error=error;statusEl.textContent='error';factsEl.textContent=error;console.error(e)}
}
const clock=new THREE.Clock();renderer.setAnimationLoop(()=>{const dt=Math.min(.05,clock.getDelta());for(const st of actorState.values())st.mixer.update(dt);controls.update();renderer.render(scene,camera)});boot();
