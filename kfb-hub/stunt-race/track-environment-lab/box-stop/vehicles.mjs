import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clamp} from './sources.mjs';
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const SHELL_ONLY=new Set(['kart-by-ben-harrison-bkdlm4mh7rg','skateboard-by-poly-by-google-7dfn4vttcwy','rollerskate-a','go-kart-by-poly-by-google-3hkutvs0aav']);
const NOTES={
  'kart-by-ben-harrison-bkdlm4mh7rg':'Shell response only · ambiguous wheel detection disabled.',
  'skateboard-by-poly-by-google-7dfn4vttcwy':'Board response · no rider, wheels are part of the source mesh.',
  'rollerskate-a':'Shell response · source has no verified separate wheels.',
  'go-kart-by-poly-by-google-3hkutvs0aav':'Source rendered upright in this adapter · wheel extraction remains disabled.'
};
export function disposeObject(root){
  const geos=new Set(),mats=new Set(),textures=new Set();root.traverse(n=>{if(!n.isMesh)return;geos.add(n.geometry);for(const m of [].concat(n.material)){mats.add(m);for(const v of Object.values(m))if(v?.isTexture)textures.add(v)}});
  for(const g of geos)g.dispose();for(const m of mats)m.dispose();for(const t of textures)t.dispose();root.removeFromParent();
}
function simpleRig(root,parts,row){
  const orient=parts.ORIENTS[row.orientDefault||0];root.rotation.x+=orient[1];root.rotation.z+=orient[2];root.updateMatrixWorld(true);
  let b=new THREE.Box3().setFromObject(root),s=b.getSize(V());
  if(row.upFix&&s.y>s.z*1.15){root.rotation.x-=Math.PI/2;root.updateMatrixWorld(true);b.setFromObject(root);s=b.getSize(V())}
  if(s.x>s.z*1.15){root.rotation.y+=Math.PI/2;root.updateMatrixWorld(true);b.setFromObject(root);s=b.getSize(V())}
  const c=b.getCenter(V()),group=new THREE.Group(),body=new THREE.Group();body.add(root);group.add(body);root.position.sub(V(c.x,b.min.y,c.z));
  return {group,body,wheels:[],frame:{height:s.y,length:s.z,width:s.x},report:{wheels:0,wheelSource:'none',wheelRadius:0,wheelbase:s.z,size:s.toArray()}};
}
function scaledProfile(base,amount){
  const p={...base};for(const k of ['squashAmount','stretchAmount','lateralSquash','pitchResponse','rollResponse','driftYawResponse','driftRoll','impactResponse','landingSquash','speedBias'])p[k]*=amount;
  // Track bank is already in the Race contact basis. Never apply its absolute angle twice.
  p.bankFollow=0;return p;
}
export function vehicleFactory(source){
  const loader=new GLTFLoader();let loading=0;
  async function load(id){
    const row=source.fixtures.ALL.find(r=>r.id===id);if(!row)throw Error('Unknown vehicle '+id);
    loading++;let gltf;
    try{gltf=await loader.loadAsync(row.url)}finally{loading--}
    const original=gltf.scene;let skinned=false;original.traverse(n=>{skinned ||= !!n.isSkinnedMesh});
    if(skinned){disposeObject(original);throw Error('Skinned source excluded from this shell-only pass')}
    // Reviewed per-fixture facing belongs to the asset adapter, not to the driving camera.
    if(row.facing<0)original.rotation.y+=Math.PI;
    let rig;
    try{rig=SHELL_ONLY.has(id)?simpleRig(original,source.parts,row):source.parts.analyse({THREE,root:original,label:row.label,upFix:id==='wagon-by-poly-by-google-136bu5geshs'?false:row.upFix,orientX:id==='wagon-by-poly-by-google-136bu5geshs'?0:(row.orientDefault||0)})}
    catch(e){disposeObject(original);throw e}
    const length=rig.frame.length;if(!Number.isFinite(length)||length<=0){disposeObject(rig.group);throw Error('Invalid measured dimensions')}
    let target=row.group==='heavy'?6.5:row.group==='board'?3.1:row.group==='karts'?3.5:4.1;
    if(row.id==='vehicle-monster-truck')target=5.7;if(row.id==='van')target=5.0;
    const scale=target/length,root=new THREE.Group();root.name='BoxStop:'+row.id;root.add(rig.group);rig.group.scale.setScalar(scale);
    // Do not spin an axle inferred at zero wheelbase, or speculative island wheels without two axles.
    const wheelSafe=rig.wheels.length>=4&&rig.wheels.length<=6&&rig.report.wheelbase>length*.24;
    const wheels=wheelSafe?new source.parts.WheelRig({THREE,rig,facing:1}):null;
    if(!wheelSafe&&rig.wheels.length){for(const w of rig.wheels){rig.body.attach(w.steer)}rig.wheels=[]}
    const deform=source.deformer.createDeformer(THREE,rig,{profile:source.profiles[row.profile]});
    let lastHits=null,lastAir=false,profileId=row.profile,mode='deformer',strength=1,disposed=false;
    const stats={railEvents:0,landEvents:0},createdTextures=new Set();
    // Source analysis clones materials but shares textures. Release each texture once at disposal.
    original.traverse(n=>{if(n.isMesh)for(const m of [].concat(n.material))for(const v of Object.values(m))if(v?.isTexture)createdTextures.add(v)});
    function configure(next){profileId=next.profile||profileId;mode=next.mode||mode;strength=clamp(next.strength??strength,0,1.5);
      if(!source.profiles[profileId])throw Error('Unknown motion profile');deform.setProfile(scaledProfile(source.profiles[profileId],strength));deform.reset();lastHits=null;lastAir=false;return info()}
    function update(dt,t={},active=true){
      if(disposed)return;
      if(active&&mode==='deformer'){
        deform.setSignals({speed:clamp(t.speedNormalized,0,1),longAccel:clamp(t.longitudinalAcceleration/28,-1,1),lateral:clamp(t.lateralAccelerationProxy/65,-1,1),bank:0,drift:t.driftActive?clamp(t.driftDirection,-1,1):0});
        if(lastHits!==null&&t.railHits>lastHits){deform.railRelease();deform.railImpact({side:Math.sign(t.impactSide)||1,strength:clamp(t.railImpact,.15,1)});stats.railEvents++}
        if(lastAir&&!t.airborne){deform.landing({strength:clamp(t.landingImpulse/9,.1,1)});stats.landEvents++}
        deform.update(dt);
      }else if(mode==='original'){deform.reset()}
      lastHits=t.railHits??lastHits;lastAir=!!t.airborne;
      if(wheels&&active){wheels.spin(dt,(t.speed||0)/scale);wheels.angle%=Math.PI*2;wheels.setSteer(-(t.steerInput||0)*21)}
    }
    function reset(){deform.reset();wheels?.reset();lastHits=null;lastAir=false;rig.wheels.forEach(w=>w.spin.rotation.set(0,0,0))}
    function info(){return {id:row.id,label:row.label,group:row.group,profile:profileId,mode,strength,sourcePath:row.path,sourcePin:row.pin,sourceUrl:row.url,
      measured:rig.report,scale,dimensions:[rig.frame.width*scale,rig.frame.height*scale,target],wheelAnimation:!!wheels,
      note:NOTES[id]||(!wheels?'Shell response · no verified wheel animation.':row.group==='heavy'?'Heavy timing is an unapproved starting profile.':'Verified source · visual comparison on the common Race contact proxy.'),
      pose:deform.readout,events:{...stats},contactProxy:'UNCHANGED_COMMON_V08',profileAccepted:false}}
    configure({});return {root,row,rig,deform,update,reset,configure,info,dispose(){if(disposed)return;disposed=true;disposeObject(root);
      // Free the unrendered original geometries/materials too, except when retained in shell-only mode.
      if(!SHELL_ONLY.has(id)){const geo=new Set(),mat=new Set();original.traverse(n=>{if(n.isMesh){geo.add(n.geometry);for(const m of [].concat(n.material))mat.add(m)}});geo.forEach(g=>g.dispose());mat.forEach(m=>m.dispose())}
      createdTextures.forEach(t=>t.dispose());deform.dispose();}};
  }
  return {load,get loading(){return loading}};
}
