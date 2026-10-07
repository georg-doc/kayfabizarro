// WB2 boundary to the existing SurfaceTruth and Rapier Physics owners. No frame/input/render loop.
import * as THREE from 'three';
import {Physics,SurfaceTruth,TriangleContact} from '../wb2-design-01/owners/island-owners.mjs';
export async function createIslandSurface(seed){
  const physics=await Physics.create(),surface=new SurfaceTruth(seed),colliders=new Map();
  let disposed=false,groundMesh=null;
  function arrays(mesh){
    mesh.updateWorldMatrix(true,false);const p=mesh.geometry.attributes.position,v=new THREE.Vector3(),positions=new Float32Array(p.count*3);
    for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);positions.set([v.x,v.y,v.z],i*3)}
    return {positions,indices:mesh.geometry.index?new Uint32Array(mesh.geometry.index.array):Uint32Array.from({length:p.count},(_,i)=>i)};
  }
  function replace(id,data){
    // Build first; remove the last valid collider only after Rapier accepts its replacement.
    const next=physics.world.createCollider(physics.R.ColliderDesc.trimesh(data.positions,data.indices));
    const prior=colliders.get(id);if(prior)physics.world.removeCollider(prior,true);colliders.set(id,next);
    return next;
  }
  return {schema:'kfb.island-surface-adapter/1',physics,surface,
    get mesh(){return groundMesh},
    ground(mesh){const data=arrays(mesh);replace('terrain',data);surface.bindIndexedGround(data.positions,data.indices);groundMesh=mesh;},
    road(mesh,id='route'){const data=arrays(mesh),contact=new TriangleContact(id);contact.addArrays(data.positions,data.indices);replace('track/'+id,data);surface.contact({id,owner:'track-core',heightAt:(x,z)=>contact.heightAt(x,z)});},
    objects(roots){
      const keep=new Set();for(const root of roots){if(root.userData.kind==='resident')continue;let part=0;root.traverse(mesh=>{if(!mesh.isMesh||mesh.isSkinnedMesh||mesh.isInstancedMesh)return;const id='object/'+root.userData.sceneObjectId+'/'+part++;keep.add(id);replace(id,arrays(mesh));});}
      for(const [id,c] of colliders)if(id.startsWith('object/')&&!keep.has(id)){physics.world.removeCollider(c,true);colliders.delete(id)}
    },
    heightAt:(x,z)=>surface.heightAt(x,z),
    evidence(points){physics.world.step();return {schema:'kfb.surface-contact-witness/1',revision:surface.revision,colliders:colliders.size,samples:points.map(([x,z])=>{const support=surface.heightAt(x,z),ray=new physics.R.Ray({x,y:1000,z},{x:0,y:-1,z:0}),hit=physics.world.castRay(ray,2000,true);return {x,z,support,rapier:hit?1000-hit.timeOfImpact:null,delta:hit?Math.abs(support-(1000-hit.timeOfImpact)):null}})};},
    dispose(){if(disposed)return;disposed=true;colliders.clear();surface.dispose();physics.dispose();groundMesh=null;}
  };
}
