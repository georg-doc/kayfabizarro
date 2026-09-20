// GENERATED from the unchanged Race Slice-04 donor by tools/build.py.
// Source owner: georg-doc/KFB-Stunt-Car-Race. Not a third physics engine.
// Shared movement owner. World definitions live in world.js; vehicle tuning remains unchanged.
import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
export const STEP=1/60;
export const VERSION='fr-s04-01-source-derived';
export const START={p:[0,1.2,-16],yaw:0};
import {TRACK,rampVertices,curveGeometry,hillBaseGeometry} from './world.js';
export {TRACK,rampVertices,RAMP_INDICES,curveGeometry,footprint,KENNEY} from './world.js';
const ROADS=new Set(TRACK.filter(s=>s.road).map(s=>s.id));
// Accepted tuning of the base. The dev panel edits a copy; these stay the defaults.
export const PARAMS={engine:1000,maxSpeed:27,steerMax:.43,steerFalloff:.035,steerEase:.16,grip:4.5,driftGrip:1.0,side:1.8,driftSide:.55,hopImpulse:5.4,brake:80,slopeBrakeMax:40,coast:2}; // brake raised from 40 (base): B barely slowed the kart from 90 km/h. Tuning point for Georg.
export async function createPhysics(fixture){
 if(!fixture||!Array.isArray(fixture.surfaces)||typeof fixture.inBounds!=='function')throw Error('Explicit fixture required');
 const TRACK=fixture.surfaces,START=fixture.start;
 const ROADS=new Set(TRACK.filter(s=>s.road).map(s=>s.id));
 await RAPIER.init();
 const world=new RAPIER.World({x:0,y:-15,z:0});world.timestep=STEP;
 const params={...PARAMS};
 const surfaces=new Map();const breakables=new Map();const meshes=new Map();
 // Slice 04: 'curve' entries become a static trimesh from the shared hull; 'gltf' tiles get theirs later via addMesh(); props have no collider of their own.
 function makeCollider(s){if(s.kind==='prop'||s.shape==='gltf')return null;
  const d=s.shape==='solid-ramp'?RAPIER.ColliderDesc.convexHull(rampVertices(s)):['curve','hill-base'].includes(s.shape)?(g=>RAPIER.ColliderDesc.trimesh(g.vertices,g.indices))((s.shape==='curve'?curveGeometry:hillBaseGeometry)(s)):s.kind==='bumper'?RAPIER.ColliderDesc.cylinder(s.height/2,s.radius):RAPIER.ColliderDesc.cuboid(...s.size.map(x=>x/2));
  // Breakables are solid until a real impact breaks them; no slow sensor tunnelling.
  if(s.shape!=='solid-ramp'&&s.shape!=='curve'&&s.shape!=='hill-base'){const a=(s.rotation||0)/2,h=(s.yaw||0)/2;d.setTranslation(...s.p).setRotation(s.yaw?{x:0,y:Math.sin(h),z:0,w:Math.cos(h)}:{x:Math.sin(a),y:0,z:0,w:Math.cos(a)});}
  const c=world.createCollider(d.setFriction(.8).setRestitution(s.restitution||0));surfaces.set(c.handle,s);return c;}
 for(const s of TRACK){const c=makeCollider(s);if(c&&s.kind==='breakable')breakables.set(s.id,{entry:s,collider:c,broken:false,timer:0});}
 // Host hands over the transformed triangles of a declared gltf tile: the very vertices the renderer draws. One collider per id.
 function addMesh(id,vertices,indices){const s=TRACK.find(e=>e.id===id&&e.shape==='gltf');if(!s)throw Error(`No gltf surface ${id} declared`);if(meshes.has(id))throw Error(`Mesh surface ${id} already added`);
  const c=world.createCollider(RAPIER.ColliderDesc.trimesh(vertices,indices).setFriction(.8));surfaces.set(c.handle,s);meshes.set(id,c);world.updateSceneQueries();return {id,triangles:indices.length/3};}
 const body=world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(...START.p).setLinearDamping(.15).setAngularDamping(2).setCanSleep(false).setCcdEnabled(true));
 // Same mass and box inertia, lower centre of mass: stabilize the tested braking-after-turn cases.
 const chassis=world.createCollider(RAPIER.ColliderDesc.cuboid(.75,.26,1.3).setMassProperties(180,{x:0,y:-.3,z:0},{x:105.456,y:135.15,z:37.806},{x:0,y:0,z:0,w:1}).setFriction(.3),body);
 const vehicle=world.createVehicleController(body);vehicle.indexUpAxis=1;vehicle.setIndexForwardAxis=2;
 const wheels=[[-.85,0,1],[.85,0,1],[-.85,0,-1],[.85,0,-1]];
 wheels.forEach((p,i)=>{vehicle.addWheel({x:p[0],y:p[1],z:p[2]},{x:0,y:-1,z:0},{x:-1,y:0,z:0},.4,.42);vehicle.setWheelSuspensionStiffness(i,42);vehicle.setWheelSuspensionCompression(i,4.4);vehicle.setWheelSuspensionRelaxation(i,5);vehicle.setWheelMaxSuspensionForce(i,18000);vehicle.setWheelMaxSuspensionTravel(i,.28);vehicle.setWheelFrictionSlip(i,4.5);vehicle.setWheelSideFrictionStiffness(i,1.8);});
 let tick=0,run=0,sinceReset=0,phase='explore',air=0,settled=0,hadGround=true,ramp=false,hopHeld=false,disposed=false,steer=0,bumperCool=0,flipT=0,safeT=0,drifting=false;
 let stuckT=0,stuckAnchor=[...START.p],stuckSurface=null;
 let safe={p:[...START.p],yaw:START.yaw};
 const events=[];let nextEvent=0;
 const emit=(type,data={})=>{const e={id:`${VERSION}:${run}:${++nextEvent}`,type,tick,run,...data};events.push(e);if(events.length>180)events.shift();return e;};
 // Recovery is a new attempt at the last safe checkpoint with momentum cleared. It is not a medium/mode transition.
 const spawnBox=new RAPIER.Cuboid(.85,.45,1.4);
 function checkpointClear(point,yaw=0){
  if(!point.every(Number.isFinite)||!fixture.inBounds(point,'safe'))return false;
  if(TRACK.some(s=>{
   if(s.road||s.id==='island'||s.kind==='prop'||s.shape==='gltf'||s.shape==='curve')return false;
   // Recovery lifts the chassis by .6: reserve its height and a margin, but allow genuinely clear roofs.
   if(s.size&&s.shape!=='solid-ramp'){const a=s.rotation||0;const bottom=s.p[1]-(Math.abs(Math.cos(a))*s.size[1]+Math.abs(Math.sin(a))*s.size[2])/2;if(bottom>point[1]+1.1)return false;}
   if(s.kind==='breakable'&&breakables.get(s.id)?.broken)return false;
   if(s.kind==='bumper')return Math.hypot(point[0]-s.p[0],point[2]-s.p[2])<s.radius+2;
   const m=s.yaw?Math.max(s.size[0],s.size[2])/2+2:null; // yawed boxes: conservative square margin
   return Math.abs(point[0]-s.p[0])<(m??s.size[0]/2+2)&&Math.abs(point[2]-s.p[2])<(m??s.size[2]/2+2);
  }))return false;
  // Check the actual live colliders too, including GLTF track/support meshes that
  // do not have an axis-aligned declaration suitable for the conservative test.
  const h=yaw/2;let occupied=false;world.updateSceneQueries();
  world.intersectionsWithShape({x:point[0],y:point[1]+.6,z:point[2]},{x:0,y:Math.sin(h),z:0,w:Math.cos(h)},spawnBox,c=>{
   const s=surfaces.get(c.handle);if(s&&s.id!=='island')occupied=true;return !occupied;
  },RAPIER.QueryFilterFlags.EXCLUDE_SENSORS,undefined,chassis,body);
  return !occupied;
 }
 function reset(reason='manual'){if(!checkpointClear(safe.p,safe.yaw))safe={p:[...START.p],yaw:START.yaw};const h=safe.yaw/2;body.setTranslation({x:safe.p[0],y:safe.p[1]+.6,z:safe.p[2]},true);body.setRotation({x:0,y:Math.sin(h),z:0,w:Math.cos(h)},true);body.setLinvel({x:0,y:0,z:0},true);body.setAngvel({x:0,y:0,z:0},true);body.resetForces(true);body.resetTorques(true);run++;phase='explore';ramp=false;air=0;settled=0;hadGround=true;hopHeld=false;steer=0;flipT=0;safeT=0;sinceReset=0;drifting=false;bumperCool=0;stuckT=0;stuckAnchor=[safe.p[0],safe.p[1],safe.p[2]];stuckSurface=null;emit('recovery',{reason,position:{x:safe.p[0],y:safe.p[1],z:safe.p[2]}});world.updateSceneQueries();}
 world.step();world.updateSceneQueries();
 function step(input={}){
  if(disposed)throw Error('Physics disposed');tick++;sinceReset+=STEP;
  const speed=vehicle.currentVehicleSpeed();const incoming={...body.linvel()};
  const slopedContact=Array.from({length:4},(_,i)=>vehicle.wheelIsInContact(i)&&vehicle.wheelContactNormal(i)?.y<.98).some(Boolean);
  const brakeForce=slopedContact?Math.min(params.brake,params.slopeBrakeMax):params.brake;
  drifting=!!input.drift&&Math.abs(speed)>4;
  steer+=(Math.max(-1,Math.min(1,input.steer||0))*(params.steerMax/(1+Math.abs(speed)*params.steerFalloff))-steer)*params.steerEase;
  for(let i=0;i<4;i++){vehicle.setWheelSteering(i,i<2?steer:0);vehicle.setWheelEngineForce(i,!input.brake&&(Math.abs(speed)<params.maxSpeed||(input.throttle||0)*speed<0)?(input.throttle||0)*params.engine*(input.boost?1.55:1):0);vehicle.setWheelBrake(i,input.brake?brakeForce:(input.throttle?0:params.coast));vehicle.setWheelFrictionSlip(i,drifting&&i>=2?params.driftGrip:params.grip);vehicle.setWheelSideFrictionStiffness(i,drifting&&i>=2?params.driftSide:params.side);}
  const oldContact=Array.from({length:4},(_,i)=>vehicle.wheelIsInContact(i)).filter(Boolean).length;
  if(input.hop&&!hopHeld&&oldContact>=2){body.applyImpulse({x:0,y:180*params.hopImpulse,z:0},true);emit('hop');}
  hopHeld=!!input.hop;
  vehicle.updateVehicle(STEP,RAPIER.QueryFilterFlags.EXCLUDE_SENSORS,undefined,c=>c.handle!==chassis.handle);
  world.step();
  bumperCool=Math.max(0,bumperCool-STEP);
  const p=body.translation(),rot=body.rotation(),v=body.linvel();
  // Bumper contacts and breakable volumes: consequences are read from the actual contact, then emitted as facts.
  const hits=[],vol=[],obstructions=[];world.contactPairsWith(chassis,o=>{
   const s=surfaces.get(o.handle);if(!s)return;let touching=false;
   world.contactPair(chassis,o,m=>{if(m.numSolverContacts()>0){touching=true;const n=m.normal();if(Math.abs(n.y)<.65)obstructions.push(s);}});
   if(touching){if(s.kind==='bumper'||s.kind==='wall')hits.push(s);else if(s.kind==='breakable')vol.push(s);}
  });
  if(hits.length&&bumperCool<=0&&Math.abs(speed)>2){bumperCool=.6;emit('bumper',{surface:hits[0].id,speed:Math.abs(speed),position:{...p}});}
  for(const s of vol){const b=breakables.get(s.id);if(!b||b.broken)continue;
   if(Math.hypot(incoming.x,incoming.z)>=s.threshold){surfaces.delete(b.collider.handle);world.removeCollider(b.collider,true);b.broken=true;b.timer=s.respawn;body.setLinvel({x:incoming.x*.7,y:incoming.y,z:incoming.z*.7},true);emit('breakable',{surface:s.id,speed:Math.hypot(incoming.x,incoming.z),position:{...p},velocity:incoming});}
   else if(bumperCool<=0&&Math.hypot(incoming.x,incoming.z)>1){bumperCool=.6;emit('bumper',{surface:s.id,speed:Math.abs(speed),position:{...p}});}}
  for(const b of breakables.values())if(b.broken){b.timer-=STEP;const d=Math.hypot(p.x-b.entry.p[0],p.z-b.entry.p[2]);if(b.timer<=0&&d>9){b.collider=makeCollider(b.entry);b.broken=false;emit('breakable-reset',{surface:b.entry.id});}}
  const contacts=Array.from({length:4},(_,i)=>vehicle.wheelIsInContact(i)).filter(Boolean).length;
  const groundIds=Array.from({length:4},(_,i)=>{const c=vehicle.wheelGroundObject(i);return c?(surfaces.get(c.handle)?.id||null):null;});
  if(groundIds.includes('ramp')){if(!ramp)emit('ramp-contact',{speed:Math.abs(speed)});ramp=true;phase='ramp';}
  if(contacts===0){air+=STEP;if(ramp&&air>.16&&phase!=='landed'&&phase!=='complete')phase='air';}
  else {if(!hadGround&&air>.12&&sinceReset>1){emit('landing',{airSeconds:air,position:{...p},vertical:v.y});if(ramp&&air>.16&&p.z>25)phase='landed';}air=0;}
  hadGround=contacts>0;
  settled=contacts>=2&&Math.abs(v.y)<2.5?settled+STEP:0;
  if(fixture.allowLegacyGoal===true&&phase==='landed'&&p.z>=56&&p.z<=80&&Math.abs(p.x)<6.4&&settled>=.12){phase='complete';emit('stunt-complete',{position:{...p}});}
  // Orientation facts: up.y for rollover, yaw for the checkpoint, lateral slip for sound and driver lean.
  const uy=1-2*(rot.x*rot.x+rot.z*rot.z);const fx=2*(rot.x*rot.z+rot.w*rot.y),fz=1-2*(rot.x*rot.x+rot.y*rot.y);const yaw=Math.atan2(fx,fz);
  const rx=1-2*(rot.y*rot.y+rot.z*rot.z),rz=2*(rot.x*rot.z-rot.w*rot.y);const slip=v.x*rx+v.z*rz;
  // A chassis contact with a side normal is a physical obstruction. With no
  // wheel contact, any solid chassis contact can also be an underside/support snag.
  if(contacts===0){world.contactPairsWith(chassis,o=>{const s=surfaces.get(o.handle);if(!s)return;world.contactPair(chassis,o,m=>{if(m.numSolverContacts()>0&&!obstructions.includes(s))obstructions.push(s);});});}
  const driveIntent=!input.brake&&Math.abs(input.throttle||0)>=.35&&sinceReset>1;
  const moved=Math.hypot(p.x-stuckAnchor[0],p.z-stuckAnchor[2]);
  if(driveIntent&&obstructions.length&&moved<.55&&Math.hypot(v.x,v.z)<1.5){stuckT+=STEP;stuckSurface=obstructions[0].id;
   if(stuckT>=1.5){const surface=stuckSurface,seconds=stuckT;reset('stuck');events.at(-1).surface=surface;events.at(-1).blockedSeconds=seconds;return snapshot();}
  }else{stuckT=0;stuckAnchor=[p.x,p.y,p.z];stuckSurface=null;}
  if(contacts===4&&uy>.95&&groundIds.every(g=>g&&ROADS.has(g))&&phase!=='air'&&!obstructions.length&&checkpointClear([p.x,p.y,p.z],yaw)){safeT+=STEP;if(safeT>=.5){safe={p:[p.x,p.y,p.z],yaw};safeT=0;}}else safeT=0;
  if(uy<.2){flipT+=STEP;if(flipT>2.5){reset('rollover');return snapshot();}}else flipT=0;
  if(!fixture.inBounds([p.x,p.y,p.z],'recovery')){reset('outside');return snapshot();}
  return snapshot({uy,yaw,slip,groundIds,contacts});
 }
 function snapshot(x={}){const rot=body.rotation(),v=body.linvel();return {tick,run,phase,position:{...body.translation()},rotation:{...rot},velocity:{...v},angularVelocity:{...body.angvel()},speed:vehicle.currentVehicleSpeed(),contacts:Array.from({length:4},(_,i)=>!!vehicle.wheelIsInContact(i)),wheelLengths:Array.from({length:4},(_,i)=>vehicle.wheelSuspensionLength(i)),steer,drifting,airborne:air,up:x.uy??1-2*(rot.x*rot.x+rot.z*rot.z),yaw:x.yaw??0,slip:x.slip??0,groundIds:x.groundIds||[],safe:{p:[...safe.p],yaw:safe.yaw},stuck:{seconds:stuckT,surface:stuckSurface},broken:[...breakables.values()].filter(b=>b.broken).map(b=>b.entry.id),events:events.slice(-12)};}
 // Read-only camera sweep against the same live colliders as the vehicle.
 const cameraBall=new RAPIER.Ball(.35);
 function cameraClearance(from,to){
  const dx=to.x-from.x,dy=to.y-from.y,dz=to.z-from.z,length=Math.hypot(dx,dy,dz);
  if(length<1e-6)return {distance:0,blocked:false};
  world.updateSceneQueries();
  const hit=world.castShape(from,{x:0,y:0,z:0,w:1},{x:dx/length,y:dy/length,z:dz/length},cameraBall,0,length,true,RAPIER.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,body);
  return {distance:hit?Math.max(0,hit.time_of_impact-.06):length,blocked:!!hit,surface:hit?surfaces.get(hit.collider.handle)?.id:null};
 }
 return {cameraClearance,step,snapshot,reset,addMesh,meshSurfaces:()=>[...meshes.keys()],wheels,world,body,vehicle,events,params,defaults:PARAMS,dispose(){if(disposed)return;disposed=true;world.removeVehicleController(vehicle);world.free();}};
}