import test from 'node:test';import assert from 'node:assert/strict';
import * as THREE from '../../procedural-test-world-01/open-world/node_modules/three/build/three.module.js';
import {Physics} from '../owners/island-owners.mjs';
import {makeFrame,createDriver,stepDriver,pose} from '../../../_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-drive/kfb-drive.k2b.js';
test('existing Joyride Drive stops at a shared Rapier obstacle, reverses and continues',async()=>{
 const p=await Physics.create(),floor=new THREE.PlaneGeometry(40,40,40,40);floor.rotateX(-Math.PI/2);p.world.createCollider(p.R.ColliderDesc.trimesh(floor.attributes.position.array,new Uint32Array(floor.index.array)));floor.dispose();
 p.world.createCollider(p.R.ColliderDesc.cuboid(5,2,.3).setTranslation(0,2,8));const car=p.createVehicle({x:.8,y:.5,z:1.4}),Q={x:0,y:0,z:0,w:1};
 const S=Array.from({length:121},(_,i)=>({s:i*.5,p:[0,0,i*.5],T:[0,0,1],U:[0,1,0],R:[1,0,0],slots:Array.from({length:8},(_,j)=>[j===6?-4:4]),prm:{surface:1}})),F=makeFrame(S,.5),d=createDriver(2);let P=pose(d,F.at(d.s),-.025);const centre=P=>({x:P.P[0],y:P.P[1]+.5,z:P.P[2]});car.setPose(centre(P),Q);p.step(1/60);
 function run(input,n){for(let i=0;i<n;i++){const before=P,q=stepDriver(d,F,input,1/60,{assist:.8,hover:-.025,acceptPose:next=>car.accepts(centre(before),Q,centre(next),Q)});P=pose(d,q,-.025);car.setPose(centre(P),Q);p.step(1/60)}}
 run({gas:true},120);const stopped=P.P[2];assert.ok(d.hits>0);assert.ok(stopped<6.31&&stopped>5);run({brake:true},45);assert.ok(P.P[2]<stopped-1);assert.ok(d.speed<0);run({gas:true},45);assert.ok(d.speed>0);car.dispose();p.dispose();
});

test('open receiving route stops at its endpoint without teleporting or claiming a lap',()=>{
 const S=Array.from({length:61},(_,i)=>({s:i*.5,p:[0,0,i*.5],T:[0,0,1],U:[0,1,0],R:[1,0,0],slots:Array.from({length:8},(_,j)=>[j===6?-4:4]),prm:{surface:1}})),F=makeFrame(S,.5,false),d=createDriver(27);
 for(let i=0;i<180;i++)stepDriver(d,F,{gas:true},1/60,{endpoint:'stop'});
 assert.equal(d.s,F.L-2);assert.equal(d.speed,0);assert.equal(d.lap,1);
 for(let i=0;i<50;i++)stepDriver(d,F,{brake:true},1/60,{endpoint:'stop'});assert.ok(d.s<F.L-3);assert.ok(d.speed<0);
});
test('vehicle rotation into a wall is rejected even without centre translation',async()=>{
 const p=await Physics.create(),car=p.createVehicle({x:.8,y:.5,z:2}),at={x:0,y:1,z:0},Q={x:0,y:0,z:0,w:1};p.world.createCollider(p.R.ColliderDesc.cuboid(.1,2,5).setTranslation(1.2,1,0));car.setPose(at,Q);p.step(1/60);
 const turned=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI/4);assert.equal(car.accepts(at,Q,at,turned),false);car.dispose();p.dispose();
});
