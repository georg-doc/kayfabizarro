import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as THREE from '../../procedural-test-world-01/open-world/node_modules/three/build/three.module.js';
// Browser import-map resolution reproduced with the same installed Three dependency.
const adapterURL=new URL('../../world-integration-01/island-surface-adapter.v1.mjs',import.meta.url);
const source=(await readFile(adapterURL,'utf8')).replace("from 'three'",`from '${new URL('../../procedural-test-world-01/open-world/node_modules/three/build/three.module.js',import.meta.url)}'`).replace("from '../wb2-design-01/owners/island-owners.mjs'",`from '${new URL('../owners/island-owners.mjs',import.meta.url)}'`);
const {createIslandSurface}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
test('individual pavement transforms and changed forest instances share exact visible contacts',async()=>{
 const a=await createIslandSurface(3);try{
  const g=new THREE.BoxGeometry(2,1,2),m=new THREE.InstancedMesh(g,new THREE.MeshBasicMaterial(),2);
  m.setMatrixAt(0,new THREE.Matrix4().makeTranslation(4,.5,0));m.setMatrixAt(1,new THREE.Matrix4().makeTranslation(-4,2,0));m.instanceMatrix.needsUpdate=true;
  a.road(m,'paving');const e=a.evidence([[4,0],[-4,0]]);assert.ok(e.samples.every(s=>s.delta<.00001));assert.equal(e.samples[0].support,1);assert.equal(e.samples[1].support,2.5);
  const root=new THREE.Group();root.userData.sceneObjectId='forest';root.add(m);a.objects([root]);a.physics.world.step();
  const cast=x=>a.physics.world.castRay(new a.physics.R.Ray({x,y:6,z:0},{x:0,y:-1,z:0}),10,true);
  m.setMatrixAt(0,new THREE.Matrix4().makeTranslation(9,.5,0));m.instanceMatrix.needsUpdate=true;a.objects([root]);a.physics.world.step();assert.ok(cast(9));
  a.objects([]);a.physics.world.step();assert.equal(cast(9),null);
 }finally{a.dispose()}
});
