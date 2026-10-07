import test from 'node:test';import assert from 'node:assert/strict';
import {SurfaceTruth,Physics} from '../owners/island-owners.mjs';
test('explicit visible triangles drive SurfaceTruth and Rapier identically across replacement',async()=>{
 const s=new SurfaceTruth(3),p=await Physics.create(),indices=new Uint32Array([0,2,1,1,2,3]);let prior;
 try{for(const peak of [1.2,3.8,-.6]){
  const positions=new Float32Array([0,0,0, 4,peak,0, 0,.4,4, 4,2.1,4]);
  if(prior)p.world.removeCollider(prior,true);
  prior=p.world.createCollider(p.R.ColliderDesc.trimesh(positions,indices));s.bindIndexedGround(positions,indices);p.world.step();
  for(const [x,z] of [[.1,.2],[1,2],[2,2],[3,2],[3.8,3.9]]){
   const hit=p.world.castRay(new p.R.Ray({x,y:10,z},{x:0,y:-1,z:0}),20,true);
   assert.ok(hit);assert.ok(Math.abs(s.groundHeightAt(x,z)-(10-hit.timeOfImpact))<.00001);
  }
 }
 assert.equal(s.groundHeightAt(5,5),-Infinity);
 }finally{s.dispose();p.dispose()}
});
