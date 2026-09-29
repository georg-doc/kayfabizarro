import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createPhysics,STEP} from './donor-race-pr10/physics.js';
import {createDriveIntent} from './donor-race-pr10/drive-intent.mjs';
import {buildHeightfieldMesh,collectReactiveProps,createWorldCollisionPresentation} from './world-collision-response.mjs';
import {analyse,WheelRig,SCHEMA as CARRIG_SCHEMA} from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@e9438c55edd2d75b5787c326db3112ee6682242b/tools/KFB-ToolBox/_inbox/KFB%20Vehicle%20Animation%20Lab%20v4/KFB_Vehicle_Lab_v4/lab-v7/carrig.v3.js';
import {createDeformer,SCHEMA as DEFORMER_SCHEMA} from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@e9438c55edd2d75b5787c326db3112ee6682242b/tools/KFB-ToolBox/_inbox/KFB%20Vehicle%20Animation%20Lab%20v4/KFB_Vehicle_Lab_v4/lab-v7/vehicle-cartoon-deformer.v2.js';

const VEHICLE_LAB_COMMIT='e9438c55edd2d75b5787c326db3112ee6682242b';
const VEHICLE_LAB_ROOT='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+VEHICLE_LAB_COMMIT+'/tools/KFB-ToolBox/_inbox/KFB%20Vehicle%20Animation%20Lab%20v4/KFB_Vehicle_Lab_v4';
const PROFILE_URL=VEHICLE_LAB_ROOT+'/lab-v7/deformer-profiles.json';
const WHEEL_REST=.4,WHEEL_RADIUS=.42,CHASSIS_TO_CONTACT=WHEEL_REST+WHEEL_RADIUS;
const RAD2DEG=180/Math.PI;

export const DRIVE_SOURCE=Object.freeze({
  owner:'FREE_ROAM_C0',
  racePr:10,
  raceHead:'406cd26f44f22811fe3b3a58776839be7ffb7b2c',
  vehicleRepo:'georg-doc/kayfabizarro',
  vehicleCommit:'10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0',
  vehiclePath:'media/3D_Assets/kenney_car-kit/Models/GLB format/kart-oobi.glb',
  vehicleLabCommit:VEHICLE_LAB_COMMIT,
  vehicleRigSchema:CARRIG_SCHEMA,
  vehicleProfile:'CAR_CHILL_LIGHT',
  deformerSchema:DEFORMER_SCHEMA,
  contactOwner:'FREE_ROAM_C0 / Rapier',
  worldReactionOwner:'WORLD-CORE-MOBILITY-R0B presentation only'
});

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function findCarStart(app){
  const p=app.play.position,heading=app.play.walker.state.heading||0;
  const f={x:Math.sin(heading),z:Math.cos(heading)},r={x:-Math.cos(heading),z:Math.sin(heading)};
  for(const [ahead,side] of [[6,0],[7,2.5],[5,-2.5],[9,0],[3,3.5]]){
    const x=p.x+f.x*ahead+r.x*side,z=p.z+f.z*ahead+r.z*side;
    if(!app.world.solidAt(x,z))return {x,z,heading};
  }
  return {x:p.x+f.x*4,z:p.z+f.z*4,heading};
}

function buildingTriangles(app){
  const vertices=[],indices=[],zone=app.world.zone;
  const support=app.world.city?.support,groupY=app.world.city?.group?.position?.y||0;
  for(const b of zone.buildings||[]){
    const ring=(b.fp||[]).slice();
    if(ring.length>2&&Math.hypot(ring[0].x-ring.at(-1).x,ring[0].z-ring.at(-1).z)<.001)ring.pop();
    if(ring.length<3)continue;
    const hostY=groupY+(support?.offsetOf?.(b.id)||0);
    const bottom=hostY+(+b.minH||0),top=hostY+(+b.h||6),base=vertices.length/3;
    for(const p of ring)vertices.push(p.x,bottom,p.z);
    for(const p of ring)vertices.push(p.x,top,p.z);
    const shape=ring.map(p=>new THREE.Vector2(p.x,p.z));
    for(const tri of THREE.ShapeUtils.triangulateShape(shape,[])){
      indices.push(base+ring.length+tri[0],base+ring.length+tri[2],base+ring.length+tri[1]);
      if(!b.minH)indices.push(base+tri[0],base+tri[1],base+tri[2]);
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
  const url='https://cdn.jsdelivr.net/gh/'+DRIVE_SOURCE.vehicleRepo+'@'+DRIVE_SOURCE.vehicleCommit+'/'+encoded;
  const [gltf,profileDoc]=await Promise.all([
    new GLTFLoader().loadAsync(url),
    fetch(PROFILE_URL,{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error('Vehicle profile HTTP '+r.status);return r.json()})
  ]);
  const model=gltf.scene;
  let box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3());
  model.scale.multiplyScalar(2.8/Math.max(size.x,size.z));model.updateMatrixWorld(true);
  model.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});
  const rig=analyse({THREE,root:model,label:'kart-oobi',upFix:false,yawFix:'auto'});
  if(rig.report.wheels!==4)throw Error('kart-oobi source rig expected 4 measured wheels, got '+rig.report.wheels);
  const profile=profileDoc?.profiles?.CAR_CHILL_LIGHT;
  if(!profile)throw Error('CAR_CHILL_LIGHT profile missing from pinned Vehicle Lab');
  return {rig,profile,wheelRig:new WheelRig({THREE,rig,facing:1}),sourceUrl:url};
}

function localDirection(q,normal){
  const n=new THREE.Vector3(normal.x,normal.y,normal.z).applyQuaternion(q.clone().invert()).normalize();
  const ax=Math.abs(n.x),ay=Math.abs(n.y),az=Math.abs(n.z);
  if(ay>ax&&ay>az)return n.y>0?'down':'up';
  if(az>=ax)return n.z<0?'front':'back';
  return n.x>0?'left':'right';
}

export async function createWorldDriveM2A(app){
  if(!app?.world||!app?.play||!app?.scene||!app?.camera||typeof app.terrainHeightAt!=='function')throw Error('WORLD-DRIVE-M2A needs the accepted World r2 host');
  const start=findCarStart(app),groundY=app.terrainHeightAt(start.x,start.z);
  const zoneRect=app.world.zone?.rectW;
  const tileHalf=Math.min(92,(app.world.tile?.size||184)/2-4);
  const contactRect=zoneRect?{
    minX:zoneRect.minX-8,maxX:zoneRect.maxX+8,minZ:zoneRect.minZ-8,maxZ:zoneRect.maxZ+8
  }:{
    minX:app.world.tile.cx-tileHalf,maxX:app.world.tile.cx+tileHalf,
    minZ:app.world.tile.cz-tileHalf,maxZ:app.world.tile.cz+tileHalf
  };
  const contactSize={x:contactRect.maxX-contactRect.minX,z:contactRect.maxZ-contactRect.minZ};
  const terrainMesh=buildHeightfieldMesh(app.terrainHeightAt,contactRect,1);
  const buildingMesh=buildingTriangles(app);
  const reactiveProps=collectReactiveProps(app.sceneObjects);
  const fixture={
    surfaces:[
      {id:'world-ground',shape:'gltf',kind:'terrain',road:true,p:[0,0,0]},
      {id:'world-buildings',shape:'gltf',kind:'building',road:false,p:[0,0,0]},
      ...reactiveProps.surfaces
    ],
    start:{p:[start.x,groundY+1.2,start.z],yaw:start.heading},
    inBounds(point,purpose){const margin=purpose==='safe'?1:8;return point[0]>=contactRect.minX-margin&&point[0]<=contactRect.maxX+margin&&point[2]>=contactRect.minZ-margin&&point[2]<=contactRect.maxZ+margin&&point[1]>-20&&point[1]<100}
  };
  const physics=await createPhysics(fixture);
  physics.addMesh('world-ground',terrainMesh.vertices,terrainMesh.indices);
  physics.addMesh('world-buildings',buildingMesh.vertices,buildingMesh.indices);
  physics.reset('world-receiver-start-heading');

  // FREE_ROAM_C0 remains the only physical tuning owner.  The semantic adapter follows its cap
  // instead of silently replacing it with the old World-local 12/18 m/s limits.
  const intent=createDriveIntent({maxForward:physics.params.maxSpeed,maxBoost:physics.params.maxSpeed}),keys=new Set();
  let current=physics.snapshot(),previous=current,accumulator=0,active=false,lastSpeed=0;
  let lastEvent=current.events.at(-1)?.id||null,idleSettled=false,impactLong=0,lastImpact=null,trackAnchor=null;
  const impactSeen=new Map();

  const root=new THREE.Group();root.name='M2A · source kart-oobi rig · FREE_ROAM_C0 contact';app.scene.add(root);
  const vehicle=await loadVehicle();
  vehicle.rig.group.position.y=-CHASSIS_TO_CONTACT;
  root.add(vehicle.rig.group);
  const deformer=createDeformer(THREE,vehicle.rig,{profile:vehicle.profile});
  const presentation=createWorldCollisionPresentation({scene:app.scene,world:app.world,heightAt:app.terrainHeightAt,reactiveProps});

  const request=()=>({
    forward:keys.has('KeyW')||keys.has('ArrowUp'),backward:keys.has('KeyS')||keys.has('ArrowDown'),
    left:keys.has('KeyA')||keys.has('ArrowLeft'),right:keys.has('KeyD')||keys.has('ArrowRight'),
    driftLeft:keys.has('KeyQ'),driftRight:keys.has('KeyR'),boost:keys.has('ShiftLeft')||keys.has('ShiftRight'),brake:keys.has('KeyB'),hop:keys.has('Space')
  });
  const signedSpeed=s=>{
    const q=new THREE.Quaternion(s.rotation.x,s.rotation.y,s.rotation.z,s.rotation.w),f=new THREE.Vector3(0,0,1).applyQuaternion(q);
    return f.dot(new THREE.Vector3(s.velocity.x,s.velocity.y,s.velocity.z));
  };

  function contactResponse(){
    const q=new THREE.Quaternion(current.rotation.x,current.rotation.y,current.rotation.z,current.rotation.w);
    const facts=physics.contactFacts();
    let lateralHeld=false;
    for(const fact of facts){
      if(fact.kind==='terrain'||fact.surface==='world-ground')continue;
      const direction=localDirection(q,fact.normal);
      const strength=clamp((fact.approach-1.0)/8,0,1);
      if((direction==='left'||direction==='right')&&fact.approach>.25){
        lateralHeld=true;
        deformer.railImpact({side:direction==='left'?-1:1,strength:Math.max(.12,strength),contact:true});
      }
      if(strength<.08)continue;
      const prev=impactSeen.get(fact.surface)||-1e9,now=current.tick*STEP;
      if(now-prev<.18)continue;
      impactSeen.set(fact.surface,now);
      const n=new THREE.Vector3(fact.normal.x,fact.normal.y,fact.normal.z).normalize();
      const p=new THREE.Vector3(fact.position.x,fact.position.y,fact.position.z).addScaledVector(n,-1.0);
      const event={...fact,direction,strength,position:{x:p.x,y:p.y,z:p.z}};
      if(direction==='front')impactLong=Math.min(impactLong,-strength);
      else if(direction==='back')impactLong=Math.max(impactLong,strength*.65);
      presentation.impact(event);lastImpact={surface:event.surface,kind:event.kind,direction:event.direction,strength:+event.strength.toFixed(2),approach:+event.approach.toFixed(2)};
    }
    if(!lateralHeld)deformer.railRelease();
  }

  function emitTracks(speedNorm){
    const contacts=current.contacts.filter(Boolean).length;
    if(!active||contacts<2||Math.abs(signedSpeed(current))<2.2)return;
    const p=new THREE.Vector3(current.position.x,current.position.y,current.position.z);
    if(trackAnchor&&trackAnchor.distanceToSquared(p)<.45*.45)return;
    trackAnchor=p.clone();
    const q=new THREE.Quaternion(current.rotation.x,current.rotation.y,current.rotation.z,current.rotation.w);
    const strength=clamp(.12+Math.abs(current.slip||0)/7+(current.drifting?.35:0)+speedNorm*.08,.12,.85);
    for(const i of [2,3]){
      if(!current.contacts[i])continue;
      const w=physics.wheels[i],local=new THREE.Vector3(w[0],-current.wheelLengths[i]-WHEEL_RADIUS,w[2]).applyQuaternion(q).add(p);
      presentation.wheelTrack({point:local,heading:current.yaw||0,strength});
    }
  }

  function simulate(){
    const drive=intent.step(request(),signedSpeed(current),STEP,current.contacts.filter(Boolean).length);
    previous=current;current=physics.step(drive);contactResponse();
    const speed=signedSpeed(current),speedNorm=clamp(Math.abs(speed)/physics.params.maxSpeed,0,1);
    const baseAccel=clamp((speed-lastSpeed)/(STEP*18),-1,1),steerLoad=clamp(-current.steer/physics.params.steerMax,-1,1)*speedNorm;
    impactLong*=Math.exp(-STEP*8.5);
    deformer.setSignals({speed:speedNorm,longAccel:clamp(baseAccel+impactLong,-1,1),lateral:steerLoad,bank:0,drift:drive.drift?clamp(steerLoad*1.35||Math.sign(drive.steer),-1,1):0});
    lastSpeed=speed;emitTracks(speedNorm);
    const event=current.events.at(-1);
    if(event?.id!==lastEvent&&event?.type==='landing'){
      const strength=clamp(Math.abs(event.vertical||0)/7,.25,1);
      deformer.landing({strength});
      presentation.landing({point:new THREE.Vector3(event.position.x,event.position.y,event.position.z),strength});
    }
    lastEvent=event?.id||null;
  }

  const focus=new THREE.Vector3(),desired=new THREE.Vector3();
  function place(alpha=1,snap=false){
    const p=new THREE.Vector3().copy(previous.position).lerp(current.position,alpha);
    const q=new THREE.Quaternion().copy(previous.rotation).slerp(new THREE.Quaternion().copy(current.rotation),alpha);
    root.position.copy(p);root.quaternion.copy(q);
    const lengths=current.wheelLengths.map((v,i)=>previous.wheelLengths[i]+(v-previous.wheelLengths[i])*alpha);
    const compression=clamp(lengths.reduce((s,v)=>s+(WHEEL_REST-v),0)/(lengths.length*.28),0,.22);
    vehicle.wheelRig.setSuspension(lengths.map(v=>WHEEL_REST-v),compression*.12);
    vehicle.wheelRig.setSteer(current.steer*RAD2DEG);
    if(!active)return;
    const f=new THREE.Vector3(0,0,1).applyQuaternion(q);focus.copy(p).add(new THREE.Vector3(0,1.15,0));desired.copy(focus).addScaledVector(f,-8.2).add(new THREE.Vector3(0,4.2,0));
    const clearance=physics.cameraClearance(focus,desired),full=desired.distanceTo(focus);
    if(clearance.blocked&&full>0)desired.copy(focus.clone().lerp(desired,Math.max(.18,clearance.distance/full)));
    if(snap)app.camera.position.copy(desired);else app.camera.position.lerp(desired,.15);
    app.camera.lookAt(focus.clone().addScaledVector(f,2.6));
  }

  function safeExit(){
    const p=current.position,q=new THREE.Quaternion(current.rotation.x,current.rotation.y,current.rotation.z,current.rotation.w),r=new THREE.Vector3(1,0,0).applyQuaternion(q),f=new THREE.Vector3(0,0,1).applyQuaternion(q);
    for(const v of [r.clone().multiplyScalar(2.3),r.clone().multiplyScalar(-2.3),f.clone().multiplyScalar(-2.8)]){
      const x=p.x+v.x,z=p.z+v.z;if(!app.world.solidAt(x,z))return {x,z,heading:current.yaw||0};
    }
    return {x:p.x,z:p.z,heading:current.yaw||0};
  }

  function setActive(on){
    active=!!on;keys.clear();intent.reset();accumulator=0;trackAnchor=null;root.userData.active=active;
    if(active)place(1,true);
  }

  function update(dt){
    const h=Math.min(.1,Math.max(0,dt||0));
    if(!active){
      if(!idleSettled){
        accumulator+=h;let n=0;
        while(accumulator>=STEP&&n++<6){simulate();accumulator-=STEP}
        idleSettled=current.contacts.filter(Boolean).length>=4&&Math.abs(current.velocity.y)<.08;
      }
      place(1);deformer.update(h);presentation.update(h);return current;
    }
    accumulator+=h;let n=0;
    while(accumulator>=STEP&&n++<6){simulate();accumulator-=STEP}
    if(n>=6)accumulator=0;
    vehicle.wheelRig.spin(h,signedSpeed(current));
    place(Math.max(0,accumulator/STEP));deformer.update(h);presentation.update(h);return current;
  }

  const ignore=e=>['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName);
  const kd=e=>{if(!active||ignore(e)||e.repeat)return;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys.add(e.code)};
  const ku=e=>keys.delete(e.code);
  addEventListener('keydown',kd,{capture:true});addEventListener('keyup',ku,{capture:true});addEventListener('blur',()=>keys.clear());

  let preSettledSteps=0;
  for(;preSettledSteps<240;preSettledSteps++){
    simulate();
    if(current.contacts.filter(Boolean).length>=4&&Math.abs(current.velocity.y)<.08){idleSettled=true;break}
  }
  previous=current;place(1,true);

  function wheelGapReport(){
    const p=new THREE.Vector3(current.position.x,current.position.y,current.position.z),q=new THREE.Quaternion(current.rotation.x,current.rotation.y,current.rotation.z,current.rotation.w);
    const gaps=[];
    for(let i=0;i<physics.wheels.length;i++){
      if(!current.contacts[i])continue;
      const w=physics.wheels[i],c=new THREE.Vector3(w[0],-current.wheelLengths[i],w[2]).applyQuaternion(q).add(p);
      gaps.push(c.y-WHEEL_RADIUS-app.terrainHeightAt(c.x,c.z));
    }
    return gaps.length?gaps.reduce((s,v)=>s+v,0)/gaps.length:null;
  }

  function report(){
    const gap=wheelGapReport();
    return {
      schema:'kfb.world-drive-m2a/2',active,source:DRIVE_SOURCE,physicalOwner:'FREE_ROAM_C0',worldOwner:'World r2',
      sourceSurfaceAdapter:true,
      terrainContact:{kind:'render-heightfield-mesh',stepM:terrainMesh.step,triangles:terrainMesh.triangles,flatProxy:false},
      buildingTriangles:buildingMesh.indices.length/3,reactivePropColliders:reactiveProps.surfaces.length,
      contactBounds:{...contactRect,width:+contactSize.x.toFixed(1),depth:+contactSize.z.toFixed(1)},
      physicsParams:{...physics.params},idleSettled,preSettledSteps,
      position:{x:+current.position.x.toFixed(2),y:+current.position.y.toFixed(2),z:+current.position.z.toFixed(2)},
      speedKmh:+(Math.abs(signedSpeed(current))*3.6).toFixed(1),contacts:current.contacts.filter(Boolean).length,
      visualGroundGapM:gap==null?null:+gap.toFixed(3),
      vehicleRig:{schema:vehicle.rig.schema,wheels:vehicle.rig.report.wheels,wheelSource:vehicle.rig.report.wheelSource,wheelRadius:vehicle.rig.report.wheelRadius,wheelbase:vehicle.rig.report.wheelbase,track:vehicle.rig.report.track,sourceUrl:vehicle.sourceUrl},
      deformer:deformer.readout,lastImpact,worldReaction:presentation.report()
    };
  }

  return {
    root,presentationRoot:deformer.nodes.responseRoot,physics,setActive,update,safeExit,report,
    get active(){return active},get position(){return current.position},get yaw(){return current.yaw||0},
    distanceTo(p){return Math.hypot(current.position.x-p.x,current.position.z-p.z)}
  };
}
