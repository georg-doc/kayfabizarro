import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const MODEL_PIN='bdaea0648f27c0f16e0a737bfba237eb54dd4cbb';
const MODULE_PIN='bdaea0648f27c0f16e0a737bfba237eb54dd4cbb';
const ASSET_PIN='11d7df978c63b9e375707bd8d9431b4c8358cda8';
const RAW_MODEL='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+MODEL_PIN+'/';
const RAW_ASSET='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+ASSET_PIN+'/';
const CDN_MODULE='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+MODULE_PIN+'/';
const enc=p=>p.split('/').map(encodeURIComponent).join('/');
const rawModel=p=>RAW_MODEL+enc(p);
const rawAsset=p=>RAW_ASSET+enc(p);

const PATHS={
  driver:'media/3D_Assets/KayKit_Mystery_Series6/2 - August 2023 - Driver/character/gltf/Driver.glb',
  goth:'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb',
  ranged:'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_CombatRanged.glb',
  gun:'media/3D_Assets/Platformer Game Kit - Dec 2021/Character/glTF/Character_Gun.gltf'
};
const BASE_GRIP={ex:-14,ey:77,ez:0,ox:0,oy:-0.03,oz:0,scale:0.37};
const HUMAN_PITCH_DELTA_DEG=-5;
const GUN_CFG={anchor:'slot',class:'pistol',url:rawAsset(PATHS.gun),node:'gun',hand:'right',...BASE_GRIP,ex:BASE_GRIP.ex+HUMAN_PITCH_DELTA_DEG};
const REQUIRED=['Ranged_1H_Aiming','Ranged_1H_Reload','Ranged_1H_Shoot','Ranged_1H_Shooting'];

const stage=document.getElementById('stage'), statusEl=document.getElementById('status'), clipSel=document.getElementById('clip');
const clipsEl=document.getElementById('clips'), fbReport=document.getElementById('fbReport'), gothReport=document.getElementById('gothReport'), bindReport=document.getElementById('bindReport');
const modeStamp=document.getElementById('modeStamp'), badgeL=document.getElementById('badgeL'), badgeR=document.getElementById('badgeR');

const scene=new THREE.Scene();scene.background=new THREE.Color(0x172027);
const camera=new THREE.PerspectiveCamera(34,1,.02,120);camera.position.set(6,3.0,8);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;stage.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xe7edf0,0x3d4548,1.6));const sun=new THREE.DirectionalLight(0xffe4b8,2.4);sun.position.set(5,8,6);scene.add(sun);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(30,18),new THREE.MeshStandardMaterial({color:0x252e33,roughness:.96}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(30,60,0x66777d,0x344148);grid.position.y=.003;scene.add(grid);
const divider=new THREE.Mesh(new THREE.BoxGeometry(.018,.012,10),new THREE.MeshBasicMaterial({color:0x607078}));divider.position.y=.01;scene.add(divider);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,1.2,0);controls.maxPolarAngle=Math.PI*.49;
function resize(){const r=stage.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(.2,r.width/Math.max(1,r.height));camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();

const loader=new GLTFLoader();
let graftMod=null,graftContract=null,fxMod=null,fx=null,rangedMap=new Map(),inventory=[],lanes=[],sourceGun=null,sourceGroup=null,currentClip=null,currentMode='source',error=null,ready=false,shotEvents=0;
const weaponCache=new Map();
const ROOT_MOTION=/^(root|hips)$/i;
const norm=s=>String(s||'').replace(/[^a-z0-9]/gi,'').toLowerCase();
function trackInfo(track){try{return THREE.PropertyBinding.parseTrackName(track.name)}catch{return null}}
function nodeNames(root){const s=new Set();root.traverse(n=>{if(n.name)s.add(n.name)});return s}
function cleanClip(root,clip){const names=nodeNames(root),tracks=[];for(const src of clip.tracks||[]){const p=trackInfo(src);if(!p||!p.nodeName||!names.has(p.nodeName))continue;if(p.propertyName==='position'&&ROOT_MOTION.test(p.nodeName))continue;tracks.push(src.clone())}return new THREE.AnimationClip(clip.name,clip.duration,tracks,clip.blendMode)}
function groundObject(obj){obj.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(obj);if(Number.isFinite(b.min.y))obj.position.y-=b.min.y;obj.updateMatrixWorld(true)}
function fitObjects(objs){const box=new THREE.Box3();for(const o of objs)if(o?.visible!==false)box.expandByObject(o);const s=box.getSize(new THREE.Vector3()),c=box.getCenter(new THREE.Vector3());if(!Number.isFinite(s.y)||s.lengthSq()===0)return;const r=Math.max(s.x,s.y,s.z)*.72;controls.target.copy(c);camera.position.set(c.x+r*1.1,c.y+r*.55,c.z+r*1.75);camera.near=Math.max(.01,r/100);camera.far=Math.max(100,r*30);camera.updateProjectionMatrix();controls.update()}
async function ensureModules(){
  if(!graftMod)graftMod=await import(CDN_MODULE+'tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js');
  if(!graftContract)graftContract=await fetch(CDN_MODULE+'tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json').then(r=>{if(!r.ok)throw Error('graft contract '+r.status);return r.json()});
  if(!fxMod)fxMod=await import(CDN_MODULE+'tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/fx.v1.js');
  const pet=graftMod.pickGraftPet(graftContract,'graft-driver');
  GUN_CFG.matColors={...(pet?.graft?.weapon?.matColors||{})};
}
function sideOf(n){return /right/i.test(n)?'r':/left/i.test(n)?'l':(/r$/i.test(n)?'r':/l$/i.test(n)?'l':'')}
function pickWeaponBone(figure,hand='right'){
  const all=[];figure.traverse(o=>{if(o.isBone&&/handslot|hand|fist|wrist/i.test(o.name))all.push(o)});if(!all.length)throw Error('no hand bones');
  const want=hand==='left'?'l':'r',pool=all.filter(b=>sideOf(b.name)===want),src0=pool.length?pool:all,RANK=[/handslot/i,/^hand/i,/hand/i,/fist/i,/wrist/i];
  for(const re of RANK){const hit=src0.find(b=>re.test(b.name));if(hit)return hit}return src0[0];
}
function poseBind(figure,fn){
  const skels=new Set(),bones=[];figure.traverse(n=>{if(n.isSkinnedMesh&&n.skeleton)skels.add(n.skeleton);if(n.isBone)bones.push(n)});
  const saved=bones.map(b=>({p:b.position.clone(),q:b.quaternion.clone(),s:b.scale.clone()}));skels.forEach(sk=>{try{sk.pose()}catch{}});figure.updateMatrixWorld(true);
  let out;try{out=fn(bones)}finally{bones.forEach((b,i)=>{b.position.copy(saved[i].p);b.quaternion.copy(saved[i].q);b.scale.copy(saved[i].s)});figure.updateMatrixWorld(true)}return out;
}
function measureBind(figure){
  return poseBind(figure,()=>{
    const bone=pickWeaponBone(figure,'right');let elbow=bone.parent;while(elbow&&(!elbow.isBone||/handslot|hand|fist|wrist/i.test(elbow.name)))elbow=elbow.parent;
    const forearm=Math.max(1e-4,elbow&&elbow.isBone?bone.getWorldPosition(new THREE.Vector3()).distanceTo(elbow.getWorldPosition(new THREE.Vector3())):0);
    return {bone:bone.name,parent:bone.parent?.name||null,pos:bone.position.toArray(),quat:bone.quaternion.toArray(),scale:bone.scale.toArray(),forearm};
  });
}
async function loadGunNode(url,nodePattern='gun'){
  let src=weaponCache.get(url+'·'+nodePattern);if(src)return src;
  const gltf=await loader.loadAsync(url);let picked=null,re=new RegExp(nodePattern,'i');gltf.scene.traverse(n=>{if(!picked&&!n.isBone&&re.test(n.name))picked=n});
  if(!picked)throw Error('gun node not found in source');
  const gg=picked.clone(true);gg.position.set(0,0,0);gg.quaternion.identity();gg.scale.set(1,1,1);const wrap=new THREE.Group();wrap.name=picked.name||'gun';wrap.add(gg);weaponCache.set(url+'·'+nodePattern,wrap);return wrap;
}
/* Consumer-local calibration extraction of current graft-mount.v1 mountWeapon.
   Transform numbers remain the existing Georg calibration; no actor-specific Euler/socket is invented. */
async function mountWeaponDirect({figure,cfg}){
  const bone=pickWeaponBone(figure,cfg.hand);const src=await loadGunNode(cfg.url,cfg.node),obj=src.clone(true);
  obj.traverse(n=>{if(!n.isMesh||!n.material)return;n.material=n.material.clone();const hex=cfg.matColors?.[n.material.name];if(hex)n.material.color=new THREE.Color(hex)});
  const holder=new THREE.Group();holder.name='KFB weapon · CA2 direct calibration';holder.add(obj);
  const bind=poseBind(figure,()=>{
    let elbow=bone.parent;while(elbow&&(!elbow.isBone||/handslot|hand|fist|wrist/i.test(elbow.name)))elbow=elbow.parent;
    const forearm=Math.max(1e-4,elbow&&elbow.isBone?bone.getWorldPosition(new THREE.Vector3()).distanceTo(elbow.getWorldPosition(new THREE.Vector3())):0);
    return {elbow,forearm};
  });
  bone.add(holder);
  const D=Math.PI/180;holder.quaternion.setFromEuler(new THREE.Euler(cfg.ex*D,cfg.ey*D,cfg.ez*D,'YXZ'));holder.position.set(0,0,0);
  holder.translateX(cfg.ox*bind.forearm);holder.translateY(cfg.oy*bind.forearm);holder.translateZ(cfg.oz*bind.forearm);holder.scale.setScalar(cfg.scale);
  obj.traverse(n=>{n.userData.noMeasure=true});
  holder.updateWorldMatrix(true,true);const inv=new THREE.Matrix4().copy(holder.matrixWorld).invert(),lb=new THREE.Box3(),v=new THREE.Vector3();
  obj.traverse(n=>{if(!n.isMesh||!n.geometry)return;if(!n.geometry.boundingBox)n.geometry.computeBoundingBox();const bb=n.geometry.boundingBox;for(let i=0;i<8;i++){v.set(i&1?bb.max.x:bb.min.x,i&2?bb.max.y:bb.min.y,i&4?bb.max.z:bb.min.z).applyMatrix4(n.matrixWorld).applyMatrix4(inv);lb.expandByPoint(v)}});
  const size=lb.getSize(new THREE.Vector3()),ctr=lb.getCenter(new THREE.Vector3()),ax=size.x>=size.y&&size.x>=size.z?'x':size.y>=size.z?'y':'z';
  const endA=ctr.clone(),endB=ctr.clone();endA[ax]=lb.min[ax];endB[ax]=lb.max[ax];
  const wristW=(bind.elbow||bone).getWorldPosition(new THREE.Vector3()),dA=holder.localToWorld(endA.clone()).distanceTo(wristW),dB=holder.localToWorld(endB.clone()).distanceTo(wristW),muzzleLocal=dA>dB?endA:endB;
  const muzzle=new THREE.Object3D();muzzle.name='KFB muzzle';muzzle.position.copy(muzzleLocal);holder.add(muzzle);
  const report={status:'OK',bone:bone.name,anchor:'slot',mountedOn:bone.name,forearm:+bind.forearm.toFixed(4),url:cfg.url,node:cfg.node,class:'pistol',hand:'right',barrelAxis:ax,barrelLength:+size[ax].toFixed(4),muzzleLocal:muzzleLocal.toArray().map(x=>+x.toFixed(4)),grip:{eulerDeg:[cfg.ex,cfg.ey,cfg.ez],offsetForearm:[cfg.ox,cfg.oy,cfg.oz],scale:cfg.scale}};
  return {holder,bone,muzzle,report,dispose(){holder.removeFromParent();holder.traverse(n=>{if(n.isMesh&&n.material)[].concat(n.material).forEach(m=>m.dispose())})}};
}
function muzzlePose(weapon){
  const p=weapon.muzzle.getWorldPosition(new THREE.Vector3()),o=weapon.holder.getWorldPosition(new THREE.Vector3()),d=p.clone().sub(o);if(d.lengthSq()<1e-8)d.set(0,0,1);d.normalize();
  const pitchDeg=Math.atan2(d.y,Math.hypot(d.x,d.z))*180/Math.PI;
  return {worldPosition:p.toArray().map(x=>+x.toFixed(4)),worldForward:d.toArray().map(x=>+x.toFixed(5)),worldPitchDeg:+pitchDeg.toFixed(3),localPosition:weapon.muzzle.position.toArray().map(x=>+x.toFixed(4)),localForward:weapon.muzzle.position.clone().normalize().toArray().map(x=>+x.toFixed(5))};
}
function bindDelta(a,b){const qa=new THREE.Quaternion().fromArray(a.quat),qb=new THREE.Quaternion().fromArray(b.quat);return{slotPosition:+new THREE.Vector3().fromArray(a.pos).distanceTo(new THREE.Vector3().fromArray(b.pos)).toFixed(8),slotQuaternionDeg:+(qa.angleTo(qb)*180/Math.PI).toFixed(6),forearm:+Math.abs(a.forearm-b.forearm).toFixed(8)}}
function velocitySeries(clip){
  const trs=(clip.tracks||[]).filter(t=>/quaternion$/.test(t.name));let tr=trs.find(t=>norm(t.name).includes('handslotrquaternion'))||trs.find(t=>norm(t.name).includes('handrquaternion'))||null;if(!tr||tr.times.length<3)return{track:null,series:[]};
  const q0=new THREE.Quaternion(),q1=new THREE.Quaternion(),series=[];for(let i=1;i<tr.times.length;i++){q0.fromArray(tr.values,(i-1)*4);q1.fromArray(tr.values,i*4);const dt=tr.times[i]-tr.times[i-1]||1e-3;series.push({t:(tr.times[i]+tr.times[i-1])/2,w:q0.angleTo(q1)/dt*180/Math.PI})}return{track:tr.name,series};
}
function markerReport(clip){
  const fire=fxMod.fireTimes(THREE,clip,'r'),vel=velocitySeries(clip),release=fire.times[0]??null;let recovery=null;
  if(release!=null&&vel.series.length){let start=vel.series.findIndex(x=>x.t>=release);if(start<0)start=0;for(let i=Math.max(1,start+1);i<vel.series.length-1;i++){if(vel.series[i].w<=vel.series[i-1].w&&vel.series[i].w<=vel.series[i+1].w){recovery=+vel.series[i].t.toFixed(3);break}}if(recovery==null)recovery=+clip.duration.toFixed(3)}
  const singleShot=/_Shoot$/.test(clip.name),primaryRelease=singleShot?(fire.times[0]??null):null,laterRotationalPeaks=singleShot?fire.times.slice(1):[];
  return{clip:clip.name,duration:+clip.duration.toFixed(4),releaseTimes:fire.times,primaryRelease,laterRotationalPeaks,releasePolicy:singleShot?'first measured rotational peak only; later peaks are not promoted to projectile releases':'all measured cadence peaks remain calibration candidates',releaseHow:fire.how,recoveryStart:recovery,recoveryMethod:'first post-release local minimum of measured right slot/hand angular velocity',rotationTrack:vel.track};
}
async function loadSourceGun(){
  const src=await loadGunNode(GUN_CFG.url,GUN_CFG.node);sourceGroup=src.clone(true);scene.add(sourceGroup);sourceGroup.visible=true;sourceGroup.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});groundObject(sourceGroup);sourceGun=sourceGroup;fitObjects([sourceGroup]);
}
function makeArrow(){const a=new THREE.ArrowHelper(new THREE.Vector3(0,0,1),new THREE.Vector3(),.7,0xffc54a,.16,.08);scene.add(a);return a}
async function loadActors(){
  await ensureModules();
  const left=new THREE.Group();left.position.x=-1.6;scene.add(left);
  const pet=graftMod.pickGraftPet(graftContract,'graft-driver');
  const graft=await graftMod.mountGraft({THREE,loader,parent:left,pet,lib:graftContract,camera,animation:'host',poseOverClip:false,override:{graft:{weapon:{on:true,anchor:'slot',class:'pistol',ex:GUN_CFG.ex,ey:GUN_CFG.ey,ez:GUN_CFG.ez,ox:GUN_CFG.ox,oy:GUN_CFG.oy,oz:GUN_CFG.oz,scale:GUN_CFG.scale}}}});
  if(!graft.weapon||graft.report.weapon?.status!=='OK')throw Error('FB weapon mount failed '+JSON.stringify(graft.report.weapon));
  const fb={id:'frizzlebob',label:'FrizzleBob · Driver Graft',root:left,figure:graft.figure,mixer:new THREE.AnimationMixer(graft.figure),update:(dt)=>graft.update(dt,camera),dispose:()=>graft.dispose(),weapon:graft.weapon,bind:measureBind(graft.figure),arrow:makeArrow(),action:null,markers:[],fired:new Set()};

  const right=new THREE.Group();right.position.x=1.6;scene.add(right);const gg=(await loader.loadAsync(rawModel(PATHS.goth))).scene;right.add(gg);groundObject(right);gg.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});
  const gw=await mountWeaponDirect({figure:gg,cfg:GUN_CFG});
  const goth={id:'gothgirl',label:'GothGirl',root:right,figure:gg,mixer:new THREE.AnimationMixer(gg),update:()=>{},dispose:()=>gw.dispose(),weapon:gw,bind:measureBind(gg),arrow:makeArrow(),action:null,markers:[],fired:new Set()};
  lanes=[fb,goth];left.visible=false;right.visible=false;fb.arrow.visible=false;goth.arrow.visible=false;
}
async function loadRanged(){
  const gltf=await loader.loadAsync(rawAsset(PATHS.ranged));inventory=(gltf.animations||[]).map(c=>c.name);rangedMap=new Map((gltf.animations||[]).map(c=>[c.name,c]));
  for(const n of REQUIRED)if(!rangedMap.has(n))throw Error('required ranged clip missing '+n);
  clipSel.innerHTML='';for(const n of inventory){const o=document.createElement('option');o.value=n;o.textContent=n;clipSel.append(o)}clipSel.value='Ranged_1H_Aiming';
}
function cleanFor(lane,name){const src=rangedMap.get(name);if(!src)throw Error('clip missing '+name);return cleanClip(lane.figure,src)}
function stopLane(l){try{l.mixer.stopAllAction()}catch{}l.action=null;l.markers=[];l.fired.clear()}
function playCompare(name){
  currentMode='compare';currentClip=name;modeStamp.textContent=name;sourceGroup.visible=false;badgeL.style.display='block';badgeR.style.display='block';
  for(const l of lanes){l.root.visible=true;l.arrow.visible=true;stopLane(l);const clip=cleanFor(l,name),a=l.mixer.clipAction(clip,l.figure);a.enabled=true;a.setEffectiveWeight(1);a.setLoop(name==='Ranged_1H_Aiming'||name==='Ranged_1H_Shooting'?THREE.LoopRepeat:THREE.LoopOnce,name==='Ranged_1H_Aiming'||name==='Ranged_1H_Shooting'?Infinity:1);a.clampWhenFinished=true;a.reset().play();l.action=a;const mr=markerReport(rangedMap.get(name));l.markers=Number.isFinite(mr.primaryRelease)?[mr.primaryRelease]:mr.releaseTimes}
  clipSel.value=name;fitObjects(lanes.map(l=>l.root));renderReports();
}
function showSource(){
  currentMode='source';currentClip=null;modeStamp.textContent='SOURCE GUN · ISOLATED';for(const l of lanes){stopLane(l);l.root.visible=false;l.arrow.visible=false}sourceGroup.visible=true;badgeL.style.display='none';badgeR.style.display='none';fitObjects([sourceGroup]);renderReports();
}
function seekRelease(){
  const name='Ranged_1H_Shoot',rep=markerReport(rangedMap.get(name)),t=rep.primaryRelease;
  if(!Number.isFinite(t))throw Error('release marker unavailable');
  playCompare(name);
  shotEvents=0;
  for(const l of lanes){
    l.mixer.setTime(t);
    if(l.action){l.action.time=t;l.action.paused=true}
    l.update?.(0);
    updateArrow(l);
    l.fired.add(t.toFixed(3));
    fx.fire(l.weapon.muzzle,'muzzle',l.weapon.report.forearm);
    shotEvents++;
  }
  currentMode='release-frame';modeStamp.textContent='RELEASE FRAME · '+t.toFixed(3)+'s';
  renderReports();
  return t;
}
function updateArrow(l){
  const pose=muzzlePose(l.weapon),p=new THREE.Vector3().fromArray(pose.worldPosition),d=new THREE.Vector3().fromArray(pose.worldForward);l.arrow.position.copy(p);l.arrow.setDirection(d);l.arrow.setLength(Math.max(.3,l.weapon.report.forearm*2.2),.16,.08);
}
function maybeFire(l){
  if(!l.action||!l.markers.length)return;const t=l.action.time;for(const m of l.markers){const key=m.toFixed(3);if(t>=m&&!l.fired.has(key)){l.fired.add(key);fx.fire(l.weapon.muzzle,'muzzle',l.weapon.report.forearm);shotEvents++}}
}
function reportText(l){
  const r=l.weapon.report,p=muzzlePose(l.weapon);return[
    'bone '+r.bone+' · anchor '+r.anchor,
    'forearm '+r.forearm,
    'grip Euler '+JSON.stringify(r.grip?.eulerDeg||[GUN_CFG.ex,GUN_CFG.ey,GUN_CFG.ez])+' deg',
    'human pitch correction '+HUMAN_PITCH_DELTA_DEG+' deg from Studio base '+BASE_GRIP.ex+' deg',
    'grip offset/forearm '+JSON.stringify(r.grip?.offsetForearm||[GUN_CFG.ox,GUN_CFG.oy,GUN_CFG.oz]),
    'scale '+(r.grip?.scale??GUN_CFG.scale),
    'barrel '+r.barrelAxis+' · '+r.barrelLength,
    'muzzle local '+JSON.stringify(r.muzzleLocal),
    'forward local '+JSON.stringify(p.localForward),
    'forward world '+JSON.stringify(p.worldForward),
    'world pitch '+p.worldPitchDeg+' deg'
  ].join('\n')
}
function renderReports(){
  const shoot=markerReport(rangedMap.get('Ranged_1H_Shoot')),auto=markerReport(rangedMap.get('Ranged_1H_Shooting'));
  clipsEl.textContent='CombatRanged clips '+inventory.length+'\n'+inventory.join('\n')+'\n\nSingle-shot primary release '+shoot.primaryRelease+'s · '+shoot.releaseHow+'\nLater rotational peaks '+JSON.stringify(shoot.laterRotationalPeaks)+' · NOT projectile releases\nRecovery candidate '+shoot.recoveryStart+'s · '+shoot.recoveryMethod+'\nContinuous cadence candidates '+JSON.stringify(auto.releaseTimes)+' · '+auto.releaseHow;
  if(lanes.length){fbReport.textContent=reportText(lanes[0]);gothReport.textContent=reportText(lanes[1]);bindReport.textContent='FB '+JSON.stringify(lanes[0].bind)+'\nGoth '+JSON.stringify(lanes[1].bind)+'\nDelta '+JSON.stringify(bindDelta(lanes[0].bind,lanes[1].bind))}
}
function snapshot(){
  const shoot=markerReport(rangedMap.get('Ranged_1H_Shoot')),auto=markerReport(rangedMap.get('Ranged_1H_Shooting'));
  return{ready,error,mode:currentMode,currentClip,source:{modelPin:MODEL_PIN,modulePin:MODULE_PIN,assetPin:ASSET_PIN,gun:PATHS.gun,ranged:PATHS.ranged},gripTuning:{studioBaseEulerDeg:[BASE_GRIP.ex,BASE_GRIP.ey,BASE_GRIP.ez],humanPitchDeltaDeg:HUMAN_PITCH_DELTA_DEG,effectiveEulerDeg:[GUN_CFG.ex,GUN_CFG.ey,GUN_CFG.ez]},inventory:[...inventory],required:[...REQUIRED],shotEvents,
    bind:lanes.length?{frizzlebob:lanes[0].bind,gothgirl:lanes[1].bind,delta:bindDelta(lanes[0].bind,lanes[1].bind)}:null,
    markers:{shoot,continuous:auto},
    actors:Object.fromEntries(lanes.map(l=>[l.id,{weaponReport:JSON.parse(JSON.stringify(l.weapon.report)),muzzle:muzzlePose(l.weapon),scheduledMarkers:[...l.markers],actionTime:l.action?+l.action.time.toFixed(4):null,actionPaused:!!l.action?.paused}])),
    scope:{worldMovement:false,physics:false,targetSelection:false,projectileSpawn:false,damage:false,rewards:false,audio:false,arenaSave:false}};
}
window.__KFB_RANGED_CALIBRATION__={version:'0.1-candidate',ready:false,error:null,showSource,play:playCompare,seekRelease,snapshot};

document.getElementById('showSource').onclick=showSource;document.getElementById('showAim').onclick=()=>playCompare('Ranged_1H_Aiming');document.getElementById('releaseFrame').onclick=seekRelease;
clipSel.onchange=()=>playCompare(clipSel.value);document.querySelectorAll('[data-clip]').forEach(b=>b.onclick=()=>playCompare(b.dataset.clip));

async function boot(){
  statusEl.textContent='loading';try{await ensureModules();fx=fxMod.makeFx(THREE,scene);await Promise.all([loadSourceGun(),loadRanged()]);await loadActors();renderReports();showSource();ready=true;window.__KFB_RANGED_CALIBRATION__.ready=true;statusEl.textContent='ready';statusEl.className='pill ok'}
  catch(e){error=String(e?.stack||e);window.__KFB_RANGED_CALIBRATION__.error=error;statusEl.textContent='error';statusEl.className='pill bad';clipsEl.textContent='ERROR\n'+error;console.error(e)}
}
const clock=new THREE.Clock();renderer.setAnimationLoop(()=>{const dt=Math.min(.05,clock.getDelta());for(const l of lanes){l.mixer?.update(dt);l.update?.(dt);if(l.root.visible){updateArrow(l);maybeFire(l)}}fx?.update(dt);controls.update();renderer.render(scene,camera)});
boot();
