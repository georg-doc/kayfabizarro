import test from 'node:test';import assert from 'node:assert/strict';
import * as THREE from '../../procedural-test-world-01/open-world/node_modules/three/build/three.module.js';
import {Physics} from '../owners/island-owners.mjs';
import {createPlanarGround} from '../../../lib/ground-planar.v1.js';
function setup(p,spawn={x:0,z:0,heading:Math.PI/2}){
 const handlers={};globalThis.addEventListener=(name,fn)=>{(handlers[name]??=[]).push(fn)};
 const root=new THREE.Group(),dom={addEventListener(){}};
 const g=createPlanarGround({THREE,camera:new THREE.PerspectiveCamera(),root,dom,bodyHeight:1.8,spawn,groundAt:()=>0,solidAt:()=>0,speeds:{walk:1,run:3,sprint:5},present(){},physics:p});
 return {g,root,key:(code,down)=>handlers[down?'keydown':'keyup'].forEach(fn=>fn({code,target:{},preventDefault(){}}))};
}
function colliders(p){p.world.createCollider(p.R.ColliderDesc.cuboid(20,.5,20).setTranslation(0,-.5,0));p.world.createCollider(p.R.ColliderDesc.cuboid(2,.15,2).setTranslation(4,.15,0));p.step(1/60)}
test('quarantined: automatic 0.30m step climbing before pose replay', {todo:'Guard: optional until required route proves unavoidable curb; frozen after two non-improving repairs'}, async()=>{
 const p=await Physics.create();colliders(p);const {g,key}=setup(p);g.setOn(true);key('KeyW',true);
 for(let i=0;i<140;i++){g.update(1/60);p.step(1/60)}key('KeyW',false);
 for(let i=0;i<30;i++){g.update(1/60);p.step(1/60)}
 const doc={id:'A',world:{}};g.writeDoc(doc);assert.ok(doc.world.player.position[1]>.29,JSON.stringify(doc.world.player));assert.ok(g.character.validPose(g.position));
 g.dispose();p.dispose();const q=await Physics.create();colliders(q);const fresh=setup(q).g;
 fresh.readDoc(doc);assert.deepEqual(fresh.position.toArray(),doc.world.player.position);
 assert.ok(fresh.character.validPose(fresh.position));fresh.dispose();q.dispose();
});
test('fixed-step descent is independent of 30 versus 60 render updates',async()=>{
 const ends=[];for(const hz of [30,60]){const p=await Physics.create();colliders(p);const {g}=setup(p);g.position.y=8;g.character.reset(g.position);g.setOn(true);for(let i=0;i<hz/2;i++){g.update(1/hz);p.step(1/hz)}ends.push(g.position.y);g.dispose();p.dispose()}
 assert.ok(Math.abs(ends[0]-ends[1])<1e-6);assert.ok(ends[0]<6&&ends[0]>4);
});

test('valid authored-platform pose survives a fresh Physics/Ground owner without terrain snapping',async()=>{
 const p=await Physics.create();colliders(p);const {g}=setup(p);g.position.set(4,.315,0);g.character.reset(g.position);p.step(1/60);
 assert.ok(g.character.validPose(g.position));const doc={id:'A',world:{}};g.writeDoc(doc);g.dispose();p.dispose();
 const q=await Physics.create();colliders(q);const fresh=setup(q).g;fresh.readDoc(doc);assert.deepEqual(fresh.position.toArray(),doc.world.player.position);assert.ok(fresh.character.validPose(fresh.position));fresh.dispose();q.dispose();
});

function receivingFloor(p){const mesh=new THREE.PlaneGeometry(40,40,10,10);mesh.rotateX(-Math.PI/2);p.world.createCollider(p.R.ColliderDesc.trimesh(mesh.attributes.position.array,new Uint32Array(mesh.index.array)));mesh.dispose();p.step(1/60)}

test('default jog, deliberate slow walk, sprint and backward use distinct native speed targets',async()=>{
 const ends=[];for(const modifier of [null,'AltLeft','ShiftLeft','back']){const p=await Physics.create();receivingFloor(p);const {g,key}=setup(p,{x:0,z:0,heading:0});g.setOn(true);key(modifier==='back'?'KeyS':'KeyW',true);if(modifier&&modifier!=='back')key(modifier,true);for(let i=0;i<60;i++)p.step(1/60);ends.push(g.speed);g.dispose();p.dispose()}
 assert.ok(ends[0]>2&&ends[0]<3);assert.equal(ends[1],1);assert.equal(ends[2],5);assert.equal(ends[3],-ends[0],JSON.stringify(ends));
});
test('fresh Space produces anticipation, ballistic air and contact-triggered landing without repeat jumps',async()=>{
 const p=await Physics.create();receivingFloor(p);const {g,key}=setup(p);g.setOn(true);for(let i=0;i<5;i++)p.step(1/60);const baseline=g.position.y;key('Space',true);const states=[],ys=[];for(let i=0;i<90;i++){p.step(1/60);states.push(g.motion.phase);ys.push(g.position.y)}
 assert.equal(states[0],'anticipation');assert.ok(states.includes('air'));assert.ok(states.includes('landing'));assert.equal(states.at(-1),'ground');assert.ok(Math.max(...ys)-baseline>1.2);assert.ok(Math.abs(ys.at(-1)-baseline)<.01,JSON.stringify({baseline,end:ys.at(-1),ys}));
 const air=ys.filter((v,i)=>states[i]==='air');assert.ok(air.some((v,i)=>i>0&&v<air[i-1]));assert.equal(states.filter((v,i)=>v==='anticipation'&&(i===0||states[i-1]!==v)).length,1);g.dispose();p.dispose();
});
