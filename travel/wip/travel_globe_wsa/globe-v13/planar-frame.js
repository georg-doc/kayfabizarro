// Travel Flight geometry boundary for the existing WB2 island frame.
// One donor unit = 10 metres, consistently for distance, speed, height and camera.
// No integrator, input loop, terrain field or physics world lives here.
export function createPlanarFlightFrame({THREE,surface,character,spawn,metresPerUnit=10,voidHeight=-5}){
 const k=metresPerUnit,up=new THREE.Vector3(0,1,0),north=new THREE.Vector3(0,0,1),east=new THREE.Vector3(-1,0,0);
 const worldPos=(q,alt)=>new THREE.Vector3(q.x*k,alt*k,q.z*k);
 const fromWorld=p=>new THREE.Vector3(p.x/k,0,p.z/k);
 const floor=q=>surface.heightAt(q.x*k,q.z*k);
 const direction=heading=>north.clone().multiplyScalar(Math.cos(heading)).addScaledVector(east,Math.sin(heading));
 return {metresPerUnit:k,fromWorld,worldPos,
  frame:()=>({up:up.clone(),north:north.clone(),east:east.clone()}),
  spawn:()=>({qPosition:fromWorld(spawn),heading:-spawn.heading||0}),
  surface:q=>{const y=floor(q);return (Number.isFinite(y)?y:voidHeight)/k},
  isLand:q=>Number.isFinite(floor(q)),
  move:(q,heading,distance)=>q.clone().addScaledVector(direction(heading),distance),
  resolve:(previous,desired)=>{const a=worldPos(previous.qPosition,previous.altitude),b=worldPos(desired.qPosition,desired.altitude),contact=character().move(a,b.sub(a));return {qPosition:fromWorld(contact.position),altitude:contact.position.y/k}},
  matrix(S){const forward=direction(S.heading),right=new THREE.Vector3().crossVectors(forward,up).normalize(),pitchQ=new THREE.Quaternion().setFromAxisAngle(right,-S.pitch),pf=forward.applyQuaternion(pitchQ),pu=up.clone().applyQuaternion(pitchQ),bankQ=new THREE.Quaternion().setFromAxisAngle(pf,S.bankAngle);return new THREE.Matrix4().makeBasis(right.applyQuaternion(bankQ),pu.applyQuaternion(bankQ),pf.negate()).setPosition(worldPos(S.qPosition,S.altitude))},
  shotRay(S){const forward=direction(S.heading),right=new THREE.Vector3().crossVectors(forward,up).normalize();return {origin:worldPos(S.qPosition,S.altitude),direction:forward.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(right,-S.pitch)).normalize()}},
  avoidCamera(pivot,position){const delta=position.clone().sub(pivot),distance=delta.length();if(distance<.01)return;delta.divideScalar(distance);const c=character(),p=surface.physics,hit=p.world.castRay(new p.R.Ray(pivot,delta),distance,true,undefined,undefined,c.collider,c.body);if(hit)position.copy(pivot).addScaledVector(delta,Math.max(.2,hit.timeOfImpact-.3))},
  landingSupport(q){const y=floor(q);return Number.isFinite(y)?y:null},
 };
}
