// WB2 boundary to the existing SurfaceTruth and Rapier Physics owners. No frame/input/render loop.
import * as THREE from 'three';
import {Physics,SurfaceTruth,TriangleContact} from '../wb2-design-01/owners/island-owners.mjs';
export async function createIslandSurface(seed){
  const physics=await Physics.create(),surface=new SurfaceTruth(seed),colliders=new Map(),fingerprints=new Map(),objectMeshes=new Map(),geometryHashes=new Map(),bounds=new Map();
  let disposed=false,groundMesh=null;
  function arrays(mesh){
    mesh.updateWorldMatrix(true,false);const p=mesh.geometry.attributes.position,source=mesh.geometry.index?.array||Uint32Array.from({length:p.count},(_,i)=>i),count=mesh.isInstancedMesh?mesh.count:1,v=new THREE.Vector3(),local=new THREE.Matrix4(),matrix=new THREE.Matrix4(),positions=new Float32Array(p.count*3*count),indices=new Uint32Array(source.length*count);
    for(let n=0;n<count;n++){
      if(mesh.isInstancedMesh){mesh.getMatrixAt(n,local);matrix.multiplyMatrices(mesh.matrixWorld,local);}else matrix.copy(mesh.matrixWorld);
      for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(matrix);positions.set([v.x,v.y,v.z],(n*p.count+i)*3);}
      for(let i=0;i<source.length;i++)indices[n*source.length+i]=source[i]+n*p.count;
    }
    return {positions,indices};
  }
  function digest(data){let h=2166136261;for(const array of [data.positions,data.indices])for(const b of new Uint8Array(array.buffer,array.byteOffset,array.byteLength))h=Math.imul(h^b,16777619);return (h>>>0).toString(16).padStart(8,'0');}
  function replace(id,data){
    // Build first; remove the last valid collider only after Rapier accepts its replacement.
    const next=physics.world.createCollider(physics.R.ColliderDesc.trimesh(data.positions,data.indices));
    const prior=colliders.get(id);if(prior)physics.world.removeCollider(prior,true);colliders.set(id,next);geometryHashes.set(id,digest(data));let maxY=-Infinity,minY=Infinity;for(let i=1;i<data.positions.length;i+=3){maxY=Math.max(maxY,data.positions[i]);minY=Math.min(minY,data.positions[i]);}bounds.set(id,{maxY,minY});
    return next;
  }
  return {schema:'kfb.island-surface-adapter/1',physics,surface,
    get mesh(){return groundMesh},
    ground(mesh){const data=arrays(mesh);replace('terrain',data);surface.bindIndexedGround(data.positions,data.indices);groundMesh=mesh;},
    road(mesh,id='route'){const data=arrays(mesh),contact=new TriangleContact(id);contact.addArrays(data.positions,data.indices);replace('track/'+id,data);surface.contact({id,owner:'track-core',heightAt:(x,z)=>contact.heightAt(x,z)});},
    objects(roots){
      const keep=new Set();for(const root of roots){if(root.userData.kind==='resident'||root.userData.physicsOwner==='Joyride Drive')continue;let part=0;root.traverse(mesh=>{if(!mesh.isMesh||mesh.isSkinnedMesh )return;const id='object/'+root.userData.sceneObjectId+'/'+part++;keep.add(id);objectMeshes.set(id,mesh);mesh.updateWorldMatrix(true,false);const key=mesh.geometry.uuid+'/'+mesh.matrixWorld.elements.join(',')+'/'+(mesh.instanceMatrix?.version??0)+'/'+(mesh.count??1);if(fingerprints.get(id)!==key){replace(id,arrays(mesh));fingerprints.set(id,key);}});}
      for(const [id,c] of colliders)if(id.startsWith('object/')&&!keep.has(id)){physics.world.removeCollider(c,true);colliders.delete(id);fingerprints.delete(id);objectMeshes.delete(id);geometryHashes.delete(id);bounds.delete(id)}
    },
    heightAt:(x,z)=>surface.heightAt(x,z),
    evidence(points){physics.world.step();return {schema:'kfb.surface-contact-witness/1',revision:surface.revision,colliders:colliders.size,objects:[...objectMeshes].map(([id,mesh])=>{const box=new THREE.Box3().setFromObject(mesh),c=box.getCenter(new THREE.Vector3()),y=box.max.y+10,origin=new THREE.Vector3(c.x,y,c.z),direction=new THREE.Vector3(0,-1,0),visible=new THREE.Raycaster(origin,direction).intersectObject(mesh,false)[0],physical=colliders.get(id).castRay(new physics.R.Ray(origin,direction),100,true);return {id,geometryHash:geometryHashes.get(id),matrix:mesh.matrixWorld.toArray(),visibleY:visible?.point.y??null,rapierY:physical>=0?y-physical:null,delta:visible&&physical>=0?Math.abs(visible.point.y-(y-physical)):null};}),samples:points.map(([x,z])=>{
      const support=surface.heightAt(x,z);let rapier=null;
      // Bounded rays start above actual collider geometry, independently of SurfaceTruth.
      // Rapier f32 misses a known long-distance triangle hit at 500–1000 m (retained evidence).
      for(const [id,collider] of colliders){if(id!=='terrain'&&!id.startsWith('track/'))continue;const bound=bounds.get(id),originY=bound.maxY+2,toi=collider.castRay(new physics.R.Ray({x,y:originY,z},{x:0,y:-1,z:0}),originY-bound.minY+2,true);if(toi>=0){const height=originY-toi;rapier=rapier===null?height:Math.max(rapier,height);}}
      return {x,z,support,rapier,delta:rapier===null?null:Math.abs(support-rapier),rayOrigin:'per-collider maxY + 2m'};
    })};},
    dispose(){if(disposed)return;disposed=true;colliders.clear();surface.dispose();physics.dispose();groundMesh=null;}
  };
}
