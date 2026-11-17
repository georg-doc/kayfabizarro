import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GraphRoomVolume} from './blaster-lab/geometry-owner.mjs';
import {createFractureRoomResponse,ROOM_SURFACES} from './blaster-lab/fracture-surfaces.mjs';
import {createVoxelHost} from './corner-lab/module/core/terrain-host.mjs';
import {createInfiniteRoomsCombatSource} from './blaster-lab/combat-source.mjs';
const frame={toLocal:p=>p,localDirection:p=>p};
const profile={nativeCommandWeapon:'rocket'};
test('native fracture opens each of six planes; reset restores the exact solid field',()=>{
 for(const surface of ROOM_SURFACES){const v=new GraphRoomVolume(),baseline=v.bits.slice(),level=createFractureRoomResponse({frame,commitFracture(){},canReset:()=>true}),at=surface.origin.map((n,i)=>n+surface.u[i]*2.5+surface.v[i]*(surface.height/2));
 const receipt=level.impact({id:'r0:'+surface.name,kind:'shot',at,normal:surface.normal,dir:surface.normal.map(x=>-x),energy:1,weapon:'rocket'},profile);assert.ok(receipt);assert.ok(v.derive(level.surfaces).length);assert.ok(v.removed>0,surface.name);assert.equal(level.status().confirmedMessages,1);assert.ok(level.reset());v.derive(level.surfaces);assert.deepEqual(v.bits,baseline);assert.equal(v.removed,0);}
});
test('visible field and real Rapier collision share a breach; reset overlap is rejected',async()=>{
 await R.init();const world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Group(),v=new GraphRoomVolume(),material=new T.MeshStandardMaterial(),terrain=createVoxelHost({R,world,scene,volume:v,material});terrain.rebuild(v.keys());world.step();
 const rayAt=(x,y)=>world.castRay(new R.Ray({x,y,z:2},{x:0,y:0,z:-1}),2,true);
 assert.ok(rayAt(3.25,2.25));
 const level=createFractureRoomResponse({frame,commitFracture(){},canReset:()=>true});level.impact({id:'r0:north',kind:'shot',at:[3.25,2.25,.75],normal:[0,0,1],dir:[0,0,-1],energy:1,weapon:'rocket'},profile);terrain.rebuild(v.derive(level.surfaces));world.step();
 let opening=null;for(let y=1;y<3.5&&!opening;y+=.125)for(let x=1;x<5.5;x+=.125)if(!rayAt(x,y)){opening={x,y,z:.5};break;}
 assert.ok(opening,'actual collider ray goes through native hole');assert.equal(v.occupiedByReset(opening,{radius:.03,height:.06}),true);assert.equal(v.occupiedByReset({x:3.25,y:1.655,z:4.4}),false);
 level.reset();terrain.rebuild(v.derive(level.surfaces));world.step();assert.ok(rayAt(opening.x,opening.y));terrain.dispose();material.dispose();world.free();
});
test('one registered source routes one real confirmed message to one cascade; no boxes or duplicate damage',()=>{
 let registered,calls=0,cascades=0;const addCombatTarget=s=>{registered=s;return()=>registered=null;};const host=createInfiniteRoomsCombatSource({addCombatTarget,sweepWorld:()=>null,level:{impact:()=>{calls++;return{ok:true};},reset:()=>true},profiles:{blaster:{}},recipe:{id:'infiniterooms.impact.v1'},onCascade:()=>cascades++});assert.equal(registered.name,'infiniterooms');assert.equal('boxes' in registered,false);const info={id:'r0:north',shot:1,at:[3,2,.75],normal:[0,0,1],dir:[0,0,-1],weapon:'blaster',energy:.7};assert.ok(registered.hit(info));assert.equal(registered.hit(info),false);assert.equal(calls,1);assert.equal(cascades,1);host.dispose();assert.equal(registered,null);
});
