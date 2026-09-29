import assert from 'node:assert/strict';
import {KFB_SHADOW_CONTACT_PROFILE,fitKfbDirectionalShadow,applyKfbShadowRole,assertNoCoplanarShadowPatch} from '../kfb-lib/kfb-shadow-contact.v1.js';

const vec=(x=0,y=0,z=0)=>({x,y,z,set(a,b,c){this.x=a;this.y=b;this.z=c;},updateMatrixWorld(){}});
const camera={updateProjectionMatrix(){this.updated=true;}};
const light={shadow:{camera,mapSize:{x:0,y:0,set(x,y){this.x=x;this.y=y;}}},position:vec(),target:{position:vec(),updateMatrixWorld(){}}};
const report=fitKfbDirectionalShadow(light,{x:12.34,y:2,z:-7.7},{x:1,y:2,z:1},{halfM:90});
assert.equal(report.profile,KFB_SHADOW_CONTACT_PROFILE.id);
assert.equal(report.halfM,90);
assert.equal(report.mapSize,4096);
assert.ok(report.normalBias>0&&report.normalBias<0.25);
assert.equal(camera.updated,true);

const mesh={isMesh:true,userData:{},castShadow:false,receiveShadow:true};
applyKfbShadowRole({traverse(fn){fn(mesh);}},'foliage-blob');
assert.equal(mesh.castShadow,true);
assert.equal(mesh.receiveShadow,false);
assert.equal(mesh.userData.kfbShadowRole,'foliage-blob');

assert.throws(()=>assertNoCoplanarShadowPatch({separationM:0,label:'road overlay'}),/KFB_COPLANAR_GEOMETRY/);
assert.equal(assertNoCoplanarShadowPatch({separationM:.002}),true);
console.log('SHADOW CONTACT CONTRACT PASS 12/12');
