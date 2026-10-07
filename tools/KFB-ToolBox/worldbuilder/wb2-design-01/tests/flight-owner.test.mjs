import test from 'node:test';import assert from 'node:assert/strict';
import * as THREE from '../../procedural-test-world-01/open-world/node_modules/three/build/three.module.js';
import {Physics} from '../owners/island-owners.mjs';
import {createCarpet} from '../../../../../travel/wip/travel_globe_wsa/globe-v13/carpet.js';
import {createCameraRig} from '../../../../../travel/wip/travel_globe_wsa/globe-v13/camera-rig.js';
import {createPlanarFlightFrame} from '../../../../../travel/wip/travel_globe_wsa/globe-v13/planar-frame.js';
import {createGroundFlightIntent} from '../../../../../travel/wip/travel_globe_wsa/world-builder/mode-intent.js';
test('source intent requires two fresh taps within 400ms; repeats and 401ms do not request',()=>{let calls=0;const i=createGroundFlightIntent({onRequestFlight:()=>calls++});assert.equal(i.noteGroundSpace({timeStamp:0}).kind,'FIRST_SPACE');i.noteGroundSpace({timeStamp:100,repeat:true});assert.equal(calls,0);i.noteGroundSpace({timeStamp:400});assert.equal(calls,1);i.noteGroundSpace({timeStamp:800});i.noteGroundSpace({timeStamp:1201});assert.equal(calls,1);i.reset();i.noteGroundSpace({timeStamp:1210});assert.equal(calls,1)});
test('Travel Carpet planar seam retains source dynamics, finite void, existing camera and Rapier wall contact',async()=>{
 const physics=await Physics.create(),character=physics.createCharacter(2);character.setFlight(true);
 const wall=physics.world.createCollider(physics.R.ColliderDesc.cuboid(5,5,.3).setTranslation(0,4,6));physics.step(1/60);
 const surface={physics,heightAt:(x,z)=>Math.abs(x)<20&&Math.abs(z)<20?0:-Infinity};
 const frame=createPlanarFlightFrame({THREE,surface,character:()=>character,spawn:{x:0,z:0,heading:0}}),c=createCarpet({THREE,seed:3,globeRadius:1,geometry:frame});c.teleportTo(new THREE.Vector3(),0,.1,0);c.setSpeedFloor(0);
 for(let i=0;i<120;i++){c.update(1/60,0,true,false,false,false);physics.step(1/60)}
 assert.ok(c.worldPos().z<5.5);assert.equal(c.abweichungen().length,0);assert.ok(c.state.speed>0);assert.ok(character.validPose(c.worldPos()));
 const camera=new THREE.PerspectiveCamera(),rig=createCameraRig(THREE,1,{camera,geometry:frame});assert.equal(rig.camera,camera);rig.snapTo(c.state.qPosition,0,c.state.altitude,1);rig.update(1/60,c.state.qPosition,0,c.state.altitude,1);assert.deepEqual(camera.up.toArray(),[0,1,0]);
 physics.world.removeCollider(wall,true);physics.step(1/60);c.teleportTo(new THREE.Vector3(3,0,3),0,1,0);c.setSchwebe(true);for(let i=0;i<30;i++){c.update(1/60,0,false,false,true,false);physics.step(1/60)}assert.ok(c.worldPos().toArray().every(Number.isFinite));assert.equal(frame.landingSupport(c.state.qPosition),null);character.dispose();physics.dispose();
});

test('mode bridge preserves flight heading/FOV through Build and keeps replacement capsule in Flight mode',async()=>{
 const {createPlanarGround}=await import('../../../lib/ground-planar.v1.js'),{createWorldBuilderModeBridge}=await import('../../../../../travel/wip/travel_globe_wsa/world-builder/runtime-mode.js');
 globalThis.addEventListener=()=>{};const physics=await Physics.create(),holder=new THREE.Group(),camera=new THREE.PerspectiveCamera(48),surface={physics,heightAt:()=>0};
 const g=createPlanarGround({THREE,camera,dom:{addEventListener(){}},root:holder,bodyHeight:2,spawn:{x:0,z:0,heading:.4},groundAt:()=>0,solidAt:()=>0,speeds:{walk:1,run:3,sprint:5},present(){},physics});g.setOn(true);
 const frame=createPlanarFlightFrame({THREE,surface,character:()=>g.character,spawn:{x:0,z:0,heading:.4}}),c=createCarpet({THREE,seed:3,globeRadius:1,geometry:frame}),rig=createCameraRig(THREE,1,{camera,geometry:frame}),controls={enabled:false,getState:()=>({turnRate:1,forward:true}),dispose(){}};
 const b=createWorldBuilderModeBridge({ground:g,carpet:c,rig,controls,frame,physics,holder,present(){},worldId:'A',actorProfileId:()=> 'Mannequin_Medium'});assert.ok(b.enterFlight());assert.equal(g.on,false);
 for(let i=0;i<30;i++){physics.step(1/60);b.update(1/60)}assert.notEqual(camera.fov,48);const h=-c.state.heading,p=c.worldPos().toArray();const doc={world:{}};b.writeDoc(doc);assert.equal(doc.world.player.heading,h);
 g.setBodyHeight(2.1);b.afterActorChange();assert.equal(b.mode,'FLIGHT');assert.equal(g.on,false);assert.equal(holder.visible,true);
 b.setOn(false);assert.equal(camera.fov,48);assert.equal(g.heading,h);assert.deepEqual(g.position.toArray(),p);assert.equal(controls.enabled,false);assert.equal(b.mode,'GROUND');b.dispose();g.dispose();physics.dispose();
});

test('blocked flight cannot read a cliff behind the wall as reached terrain',async()=>{
 const results=[];for(const cliff of [false,true]){const physics=await Physics.create(),character=physics.createCharacter(2);character.setFlight(true);physics.world.createCollider(physics.R.ColliderDesc.cuboid(5,5,.3).setTranslation(0,4,6));physics.step(1/60);
 const surface={physics,heightAt:(_x,z)=>cliff&&z>5.43?-5:0},frame=createPlanarFlightFrame({THREE,surface,character:()=>character,spawn:{x:0,z:0,heading:0}}),c=createCarpet({THREE,seed:3,globeRadius:1,geometry:frame});c.teleportTo(new THREE.Vector3(),0,.1,.78);c.setSpeedFloor(0);
 for(let i=0;i<120;i++){c.update(1/60,0,true,false,false,false);physics.step(1/60)}results.push({p:c.worldPos().toArray(),agl:c.agl});character.dispose();physics.dispose()}
 assert.ok(results[0].p[2]<5.43);assert.deepEqual(results[0],results[1]);
});
