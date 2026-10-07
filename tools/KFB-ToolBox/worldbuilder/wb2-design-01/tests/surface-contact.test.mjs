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
test('existing Physics character sweep blocks a solid wall and retains floor support',async()=>{
 const p=await Physics.create();try{
  p.world.createCollider(p.R.ColliderDesc.cuboid(10,.5,10).setTranslation(0,-.5,0));
  p.world.createCollider(p.R.ColliderDesc.cuboid(.2,2,3).setTranslation(2,2,0));
  const character=p.createCharacter(1.8);let position={x:0,y:0,z:0};character.reset(position);p.step(1/60);
  for(let i=0;i<120;i++){position=character.move(position,{x:.1,y:-.1,z:0}).position;p.step(1/60);}
  assert.ok(position.x<1.55);assert.ok(position.x>1.3);assert.ok(Math.abs(position.y)<.05);
  character.dispose();
 }finally{p.dispose()}
});
