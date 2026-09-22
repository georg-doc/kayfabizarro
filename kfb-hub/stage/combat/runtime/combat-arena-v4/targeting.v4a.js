// Picking and combat share the current visible body, including its animated offsets.
import {Sphere} from '../vendor/three.module.js';
function visibleMeshes(root){
 const meshes=[];
 root?.updateWorldMatrix(true,true);
 root?.traverseVisible(o=>{
  if(!o.isMesh || o.userData?.noCombatPick)return;
  if(![].concat(o.material||[]).some(m=>m.visible!==false && (!m.transparent || m.opacity>.02)))return;
  if(o.isSkinnedMesh){
   o.computeBoundingBox();
   // The box already contains every posed vertex. Its enclosing sphere is safe
   // for raycast rejection, without a second skinning pass on every update.
   o.boundingBox.getBoundingSphere(o.boundingSphere ||= new Sphere());
  }
  meshes.push(o);
 });
 return meshes;
}
export function pickEnemy(raycaster,mobs){
 const owners=new Map(),meshes=[];
 for(const m of mobs){if(m.tot||m.weg)continue;for(const o of visibleMeshes(m.root)){owners.set(o,m);meshes.push(o);}}
 const hit=raycaster.intersectObjects(meshes,false)[0];
 return hit?{mob:owners.get(hit.object),point:hit.point.clone()}:null;
}
export function enemyBounds(T,mob){
 const box=new T.Box3();
 for(const o of visibleMeshes(mob.root)){
  const local=o.isSkinnedMesh?o.boundingBox:(o.geometry.boundingBox|| (o.geometry.computeBoundingBox(),o.geometry.boundingBox));
  if(local)box.union(local.clone().applyMatrix4(o.matrixWorld));
 }
 if(box.isEmpty())box.setFromCenterAndSize(new T.Vector3(mob.pos.x,mob.pos.y+(mob.hoehe||1)*.5,mob.pos.z),new T.Vector3((mob.radius||.3)*2,mob.hoehe||1,(mob.radius||.3)*2));
 return box;
}
export function intercept(T,origin,center,velocity,speed=17){
 const v=velocity?.clone()||new T.Vector3();v.y=0;
 if(v.length()>4)v.setLength(4); // Teleports and level changes are not movement to lead.
 const dx=center.x-origin.x,dz=center.z-origin.z;
 const a=v.x*v.x+v.z*v.z-speed*speed,b=2*(dx*v.x+dz*v.z),c=dx*dx+dz*dz;
 const disc=Math.max(0,b*b-4*a*c);
 const roots=Math.abs(a)<1e-6?[-c/(b||1)]:[(-b-Math.sqrt(disc))/(2*a),(-b+Math.sqrt(disc))/(2*a)];
 const time=Math.max(.025,Math.min(1.5,...roots.filter(t=>t>0)));
 return {point:center.clone().addScaledVector(v,time),time};
}
