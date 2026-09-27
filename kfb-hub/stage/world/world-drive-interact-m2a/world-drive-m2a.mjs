import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createPhysics,STEP} from './donor-race-pr10/physics.js';
import {createDriveIntent} from './donor-race-pr10/drive-intent.mjs';
import {createDeformer,FALLBACK_PROFILE,SCHEMA as DEFORMER_SCHEMA} from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@f30b719a8c9da3e9ac90d4d9628c0691d676d1e9/tools/KFB-ToolBox/_inbox/KFB%20Cartoon%20Vehicle%20Deformer%20Lab%20v2/WSA_Vehicles_v2_2026-09-18/lab-v7/vehicle-cartoon-deformer.v2.js';

export const DRIVE_SOURCE=Object.freeze({
  owner:'FREE_ROAM_C0',
  racePr:10,
  raceHead:'406cd26f44f22811fe3b3a58776839be7ffb7b2c',
  vehicleRepo:'georg-doc/kayfabizarro',
  vehicleCommit:'15e36b915c9bdfd7ff000d398418269e27c6ef9f',
  vehiclePath:'media/3D_Assets/kenney_car-kit/Models/GLB format/kart-oobi.glb',
  deformerCommit:'f30b719a8c9da3e9ac90d4d9628c0691d676d1e9',
  deformerSchema:DEFORMER_SCHEMA
});

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const finite=v=>Number.isFinite(v);

function findCarStart(app){
  const p=app.play.position,heading=app.play.walker.state.heading||0;
  const f={x:Math.sin(heading),z:Math.cos(heading)},r={x:-Math.cos(heading),z:Math.sin(heading)};
  for(const [ahead,side] of [[6,0],[7,2.5],[5,-2.5],[9,0],[3,3.5]]){
    const x=p.x+f.x*ahead+r.x*side,z=p.z+f.z*ahead+r.z*side;
    if(!app.world.solidAt(x,z))return {x,z,heading};
  }
  return {x:p.x+f.x*4,z:p.z+f.z*4,heading};
}

function buildingTriangles(zone,terrainY=0){
  const vertices=[],indices=[];
  for(const b of zone.buildings||[]){
    const ring=(b.fp||[]).slice();
    if(ring.length>2&&Math.hypot(ring[0].x-ring.at(-1).x,ring[0].z-ring.at(-1).z)<.001)ring.pop();
    if(ring.length<3)continue;
    const bottom=terrainY+(+b.minH||0),top=terrainY+(+b.h||6),base=vertices.length/3;
    for(const p of ring)vertices.push(p.x,bottom,p.z);
    for(const p of ring)vertices.push(p.x,top,p.z);
    const shape=ring.map(p=>new THREE.Vector2(p.x,p.z));
    for(const tri of THREE.ShapeUtils.triangulateShape(shape,[])){
      indices.push(base+ring.length+tri[0],base+ring.length+tri[2],base+ring.length+tri[1]);
      if(bottom===terrainY)indices.push(base+tri[0],base+tri[1],base+tri[2]);
    }
    for(let i=0;i<ring.length;i++){
      const j=(i+1)%ring.length,a=base+i,c=base+j,A=a+ring.length,C=c+ring.length;
      indices.push(a,A,c,c,A,C);
    }
  }
  return {vertices:new Float32Array(vertices),indices:new Uint32Array(indices)};
}

async function loadVehicle(){
  const encoded=DRIVE_SOURCE.vehiclePath.split('/').map(encodeURIComponent).join('/');
  const url=`https://cdn.jsdelivr.net/gh/${DRIVE_SOURCE.vehicleRepo}@${DRIVE_SOURCE.vehicleCommit}/${encoded}`;
  const gltf=await new GLTFLoader().loadAsync(url),model=gltf.scene;
  let box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3());
  model.scale.multiplyScalar(2.8/Math.max(size.x,size.z));model.updateMatrixWorld(true);
  box=new THREE.Box3().setFromObject(model);const center=box.getCenter(new THREE.Vector3());
  model.position.x-=center.x;model.position.z-=center.z;model.position.y-=box.min.y+.35;
  model.traverse(n=>{if(/wheel/i.test(n.name)||n.name==='character')n.visible=false;if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});
  return {model,box};
}

export async function createWorldDriveM2A(app){
  if(!app?.world||!app?.play||!app?.scene||!app?.camera)throw Error('WORLD-DRIVE-M2A needs the accepted World r2 host');
  const start=findCarStart(app),groundY=app.terrainHeightAt(start.x,start.z);
  const zoneRect=app.world.zone?.rectW;
  const tileHalf=Math.min(92,(app.world.tile?.size||184)/2-4);
  const contactRect=zoneRect?{
    minX:zoneRect.minX-8,maxX:zoneRect.maxX+8,minZ:zoneRect.minZ-8,maxZ:zoneRect.maxZ+8
  }:{
    minX:app.world.tile.cx-tileHalf,maxX:app.world.tile.cx+tileHalf,
    minZ:app.world.tile.cz-tileHalf,maxZ:app.world.tile.cz+tileHalf
  };
  const contactCenter={x:(contactRect.minX+contactRect.maxX)/2,z:(contactRect.minZ+contactRect.maxZ)/2};
  const contactSize={x:contactRect.maxX-contactRect.minX,z:contactRect.maxZ-contactRect.minZ};
  const fixture={
    surfaces:[
      {id:'world-ground',shape:'box',kind:'terrain',road:true,p:[contactCenter.x,groundY-.25,contactCenter.z],size:[contactSize.x,.5,contactSize.z]},
      {id:'world-buildings',shape:'gltf',kind:'building',road:false,p:[0,0,0]}
    ],
    start:{p:[start.x,groundY+1.2,start.z],yaw:start.heading},
    inBounds(point,purpose){const margin=purpose==='safe'?1:8;return point[0]>=contactRect.minX-margin&&point[0]<=contactRect.maxX+margin&&point[2]>=contactRect.minZ-margin&&point[2]<=contactRect.maxZ+margin&&point[1]>-20&&point[1]<100}
  };
  const buildingMesh=buildingTriangles(app.world.zone,groundY);
  const physics=await createPhysics(fixture);physics.addMesh('world-buildings',buildingMesh.vertices,buildingMesh.indices);physics.reset('world-receiver-start-heading');
  Object.assign(physics.params,{steerMax:.55,steerFalloff:.045,steerEase:.22,brake:90,coast:3});
  const intent=createDriveIntent(),keys=new Set();
  let current=physics.snapshot(),previous=current,accumulator=0,active=false,wheelAngle=0,lastSpeed=0,lastEvent=current.events.at(-1)?.id||null,idleSettled=false;

  const root=new THREE.Group();root.name='M2A · proven kart-oobi · Race PR10';app.scene.add(root);
  const shell=new THREE.Group();root.add(shell);const wheelPivots=[];
  for(const [x,z] of [[-.85,1],[.85,1],[-.85,-1],[.85,-1]]){
    const pivot=new THREE.Group(),wheel=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.24,16),new THREE.MeshStandardMaterial({color:0x18262d,roughness:.82}));
    wheel.rotation.z=Math.PI/2;pivot.position.set(x,-.4,z);pivot.add(wheel);root.add(pivot);wheelPivots.push({pivot,wheel});
  }
  const {model,box}=await loadVehicle();shell.add(model);
  const deformer=createDeformer(THREE,{group:root,body:shell,wheels:wheelPivots.map(w=>({steer:w.pivot})),frame:{height:Math.max(1,box.getSize(new THREE.Vector3()).y)}},{profile:{...FALLBACK_PROFILE,id:'KFB_WORLD_M2A_CHILL_LIGHT',squashAmount:.024,pitchResponse:3.2,rollResponse:4.2,driftYawResponse:7,impactResponse:.06,landingSquash:.075}});

  const request=()=>({
    forward:keys.has('KeyW')||keys.has('ArrowUp'),backward:keys.has('KeyS')||keys.has('ArrowDown'),
    left:keys.has('KeyA')||keys.has('ArrowLeft'),right:keys.has('KeyD')||keys.has('ArrowRight'),
    driftLeft:keys.has('KeyQ'),driftRight:keys.has('KeyR'),boost:keys.has('ShiftLeft')||keys.has('ShiftRight'),brake:keys.has('KeyB'),hop:keys.has('Space')
  });
  const signedSpeed=s=>{
    const q=new THREE.Quaternion(s.rotation.x,s.rotation.y,s.rotation.z,s.rotation.w),f=new THREE.Vector3(0,0,1).applyQuaternion(q);
    return f.dot(new THREE.Vector3(s.velocity.x,s.velocity.y,s.velocity.z));
  };
  function simulate(){
    const drive=intent.step(request(),signedSpeed(current),STEP,current.contacts.filter(Boolean).length);previous=current;current=physics.step(drive);
    const speed=signedSpeed(current),speedNorm=clamp(Math.abs(speed)/physics.params.maxSpeed,0,1),longAccel=clamp((speed-lastSpeed)/(STEP*18),-1,1),steerLoad=clamp(-current.steer/physics.params.steerMax,-1,1)*speedNorm;
    deformer.setSignals({speed:speedNorm,longAccel,lateral:steerLoad,bank:0,drift:drive.drift?clamp(steerLoad*1.35||Math.sign(drive.steer),-1,1):0});lastSpeed=speed;
    const event=current.events.at(-1);if(event?.id!==lastEvent&&event?.type==='landing')deformer.landing({strength:clamp(Math.abs(event.vertical||0)/7,.25,1)});lastEvent=event?.id||null;
  }
  const focus=new THREE.Vector3(),desired=new THREE.Vector3();
  function place(alpha=1,snap=false){
    const p=new THREE.Vector3().copy(previous.position).lerp(current.position,alpha),q=new THREE.Quaternion().copy(previous.rotation).slerp(new THREE.Quaternion().copy(current.rotation),alpha);root.position.copy(p);root.quaternion.copy(q);
    wheelPivots.forEach((w,i)=>{w.pivot.position.y=-(previous.wheelLengths[i]+(current.wheelLengths[i]-previous.wheelLengths[i])*alpha);w.pivot.rotation.y=i<2?current.steer:0;w.wheel.rotation.x=wheelAngle});
    if(!active)return;
    const f=new THREE.Vector3(0,0,1).applyQuaternion(q);focus.copy(p).add(new THREE.Vector3(0,1.15,0));desired.copy(focus).addScaledVector(f,-8.2).add(new THREE.Vector3(0,4.2,0));
    const clearance=physics.cameraClearance(focus,desired),full=desired.distanceTo(focus);if(clearance.blocked&&full>0)desired.copy(focus.clone().lerp(desired,Math.max(.18,clearance.distance/full)));
    if(snap)app.camera.position.copy(desired);else app.camera.position.lerp(desired,.15);app.camera.lookAt(focus.clone().addScaledVector(f,2.6));
  }
  function safeExit(){
    const p=current.position,q=new THREE.Quaternion(current.rotation.x,current.rotation.y,current.rotation.z,current.rotation.w),r=new THREE.Vector3(1,0,0).applyQuaternion(q),f=new THREE.Vector3(0,0,1).applyQuaternion(q);
    for(const v of [r.clone().multiplyScalar(2.3),r.clone().multiplyScalar(-2.3),f.clone().multiplyScalar(-2.8)]){
      const x=p.x+v.x,z=p.z+v.z;if(!app.world.solidAt(x,z))return {x,z,heading:current.yaw||0};
    }
    return {x:p.x,z:p.z,heading:current.yaw||0};
  }
  function setActive(on){active=!!on;keys.clear();intent.reset();accumulator=0;root.userData.active=active;if(active)place(1,true)}
  function update(dt){
    if(!active){
      if(!idleSettled){
        accumulator+=Math.min(.1,dt);let n=0;
        while(accumulator>=STEP&&n++<6){simulate();accumulator-=STEP}
        idleSettled=current.contacts.filter(Boolean).length>=4&&Math.abs(current.velocity.y)<.08;
      }
      place(1);deformer.update(dt);return current
    }
    accumulator+=Math.min(.1,dt);let n=0;while(accumulator>=STEP&&n++<6){simulate();accumulator-=STEP}if(n>=6)accumulator=0;
    wheelAngle=(wheelAngle+signedSpeed(current)*dt/.42)%(Math.PI*2);place(Math.max(0,accumulator/STEP));deformer.update(dt);return current;
  }
  const ignore=e=>['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName);
  const kd=e=>{if(!active||ignore(e)||e.repeat)return;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys.add(e.code)};
  const ku=e=>keys.delete(e.code);addEventListener('keydown',kd,{capture:true});addEventListener('keyup',ku,{capture:true});addEventListener('blur',()=>keys.clear());
  place(1,true);
  function report(){
    const visualWheelBottom=root.position.y-Math.max(...current.wheelLengths)-.42;
    const surfaceY=app.terrainHeightAt(root.position.x,root.position.z);
    return {schema:'kfb.world-drive-m2a/1',active,source:DRIVE_SOURCE,physicalOwner:'FREE_ROAM_C0',worldOwner:'World r2',sourceSurfaceAdapter:true,buildingTriangles:buildingMesh.indices.length/3,contactBounds:{...contactRect,width:+contactSize.x.toFixed(1),depth:+contactSize.z.toFixed(1)},idleSettled,position:{x:+current.position.x.toFixed(2),y:+current.position.y.toFixed(2),z:+current.position.z.toFixed(2)},speedKmh:+(Math.abs(signedSpeed(current))*3.6).toFixed(1),contacts:current.contacts.filter(Boolean).length,visualGroundGapM:+(visualWheelBottom-surfaceY).toFixed(3),deformer:deformer.readout}
  }
  return {root,physics,setActive,update,safeExit,report,get active(){return active},get position(){return current.position},get yaw(){return current.yaw||0},distanceTo(p){return Math.hypot(current.position.x-p.x,current.position.z-p.z)}};
}
