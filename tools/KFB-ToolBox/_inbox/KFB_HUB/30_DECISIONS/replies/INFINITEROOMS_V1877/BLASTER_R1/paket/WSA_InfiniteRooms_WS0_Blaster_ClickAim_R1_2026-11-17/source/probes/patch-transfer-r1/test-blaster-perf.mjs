import test from 'node:test';import assert from 'node:assert/strict';
import {GraphRoomVolume as ReferenceVolume} from './blaster-lab/geometry-owner.baseline.mjs';
import {GraphRoomVolume} from './blaster-lab/graph-volume.mjs';
import {createFractureRoomResponse,ROOM_SURFACES} from './blaster-lab/fracture-surfaces.mjs';
const frame={toLocal:p=>p,localDirection:p=>p};
test('cached planar columns reproduce every native solid bit and dirty chunk across six surfaces, repeat hits and resets',()=>{
 const reference=new ReferenceVolume(),candidate=new GraphRoomVolume(),level=createFractureRoomResponse({frame,commitFracture(){},canReset:()=>true});
 const equal=()=>{assert.deepEqual(candidate.derive(level.surfaces).sort(),reference.derive(level.surfaces).sort());assert.deepEqual(candidate.bits,reference.bits);assert.equal(candidate.removed,reference.removed);};equal();
 for(const [i,s] of ROOM_SURFACES.entries())for(let j=0;j<2;j++){
  const at=s.origin.map((n,k)=>n+s.u[k]*(2.3+j*.35)+s.v[k]*(s.height/2));
  level.impact({id:'r0:'+s.name,kind:'shot',at,normal:s.normal,dir:s.normal.map(x=>-x),energy:j?.7:1,weapon:'rocket'},{nativeCommandWeapon:'rocket'});equal();equal();
  if(i===2&&j===1){level.reset();equal();}
 }
 const p={x:3.25,y:1.655,z:4.4};assert.equal(candidate.occupiedByReset(p),reference.occupiedByReset(p));level.reset();equal();assert.deepEqual(candidate.bits,candidate.initial);
});

import {Worker} from 'node:worker_threads';
import {createFieldPipeline} from './blaster-lab/field-pipeline.mjs';
function pipeline(){const url=new URL('./blaster-lab/field-engine.mjs',import.meta.url).href,worker=new Worker(`const{parentPort}=require('node:worker_threads');import(${JSON.stringify(url)}).then(({createFieldEngine})=>{const run=createFieldEngine();parentPort.on('message',m=>{const r=run(m);parentPort.postMessage(r,r.field?[r.field.d.buffer,r.field.data.buffer]:[]);});parentPort.postMessage({type:'ready'});});`,{eval:true}),port={postMessage:m=>worker.postMessage(m),terminate:()=>worker.terminate()};worker.on('message',data=>port.onmessage?.({data}));worker.on('error',e=>port.onerror?.(e));return createFieldPipeline(port);}
test('real background worker preserves native masks, polygons and six-plane collision bytes',async t=>{
 const p=pipeline();t.after(()=>p.dispose());await p.ready;const sync=createFractureRoomResponse({frame,commitFracture(){},canReset:()=>true}),commits=[],asyncLevel=createFractureRoomResponse({frame,commitFracture:c=>commits.push(c),canReset:()=>true,fieldPipeline:p});
 for(const s of ROOM_SURFACES){const at=s.origin.map((n,k)=>n+s.u[k]*2.5+s.v[k]*s.height/2),info={id:'r0:'+s.name,kind:'shot',at,normal:s.normal,dir:s.normal.map(x=>-x),energy:.7,weapon:'blaster'},profile={nativeCommandWeapon:'blaster'};assert.ok(sync.impact(info,profile));const receipt=asyncLevel.impact(info,profile);assert.ok(receipt);assert.equal(receipt.surfaces[0].geometryPending,true);assert.equal(receipt.surfaces[0].geometryChanged,false);}
 await p.idle();assert.equal(commits.length,6);assert.ok(commits.every(c=>c.receipt.geometryChanged&&!c.receipt.geometryPending));assert.equal(p.status().error,null);for(let i=0;i<6;i++){const a=asyncLevel.surfaces[i].field,b=sync.surfaces[i].field;assert.deepEqual(a.d,b.d);assert.deepEqual(a.data,b.data);assert.deepEqual(a.graph,b.graph);}
 const a=new GraphRoomVolume(),b=new ReferenceVolume();a.derive(asyncLevel.surfaces);b.derive(sync.surfaces);assert.deepEqual(a.bits,b.bits);
});
test('reset cancels pending field generations; late pre-reset results never reopen a restored wall',async t=>{
 const p=pipeline();t.after(()=>p.dispose());await p.ready;let commits=[];const level=createFractureRoomResponse({frame,commitFracture:c=>commits.push(c),canReset:()=>true,fieldPipeline:p}),info={id:'r0:north',kind:'shot',at:[3.25,2.25,.75],normal:[0,0,1],dir:[0,0,-1],energy:.7,weapon:'blaster'},profile={nativeCommandWeapon:'blaster'};
 level.impact(info,profile);level.reset();commits=[];level.impact({...info,at:[2.25,2.25,.75]},profile);await p.idle();assert.equal(commits.length,1);assert.equal(level.status().surfaceCommits,1);assert.equal(level.surfaces.find(r=>r.name==='north').field.applied,1);assert.equal(p.status().pending,0);
});

import * as T from 'three';import R from '@dimforge/rapier3d-compat';
import {createGeometryOwner as createReference} from './blaster-lab/geometry-owner.baseline.mjs';
import {createGeometryOwner} from './blaster-lab/geometry-owner.mjs';
import {applyClay,removeClay} from './native-audio-58b/src/vendor/clay/kfb-clay.v1.1.js';
test('prepared materials retain native piece geometry, artwork UVs, clay parameters and physical hulls; reset/dispose release ownership',async()=>{
 await R.init();const fixture=async create=>{const world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene(),owner=await create({scene,world,R,clay:{applyClay,removeClay},cardImage:id=>'card:'+id,loadTexture:async()=>{const t=new T.Texture();t.image={width:1366,height:762};return t;}}),level=createFractureRoomResponse({frame,commitFracture:c=>owner.commit(c),canReset:()=>true});return{world,scene,owner,level};};const a=await fixture(createReference),b=await fixture(createGeometryOwner);
 try{const info={id:'r0:north',kind:'shot',at:[3.25,2.25,.75],normal:[0,0,1],dir:[0,0,-1],energy:.7,weapon:'blaster'};for(const f of[a,b]){f.level.impact(info,{nativeCommandWeapon:'blaster'});f.owner.flush(f.level.surfaces);f.world.step();}
 assert.deepEqual(a.owner.volume.bits,b.owner.volume.bits);assert.equal(a.owner.status().spawned,b.owner.status().spawned);assert.ok(b.owner.status().spawned>0);assert.equal(a.world.bodies.len(),b.world.bodies.len());assert.equal(a.world.colliders.len(),b.world.colliders.len());
 const pieces=f=>f.owner.group.children.filter(o=>o.name==='kfb-cut-wall-panel');const A=pieces(a),B=pieces(b);assert.equal(A.length,B.length);for(let i=0;i<A.length;i++){for(const key of['position','normal','uv'])assert.deepEqual(A[i].geometry.attributes[key].array,B[i].geometry.attributes[key].array);for(let k=0;k<2;k++){assert.equal(A[i].material[k].roughness,B[i].material[k].roughness);assert.deepEqual(A[i].material[k].color,B[i].material[k].color);assert.equal(A[i].material[k].customProgramCacheKey(),B[i].material[k].customProgramCacheKey());assert.equal(!!A[i].material[k].map,!!B[i].material[k].map);}}
 for(const f of[a,b]){f.level.reset();f.owner.flush(f.level.surfaces);assert.equal(f.world.bodies.len(),0);assert.equal(f.owner.status().fragments,0);f.owner.dispose();assert.equal(f.world.colliders.len(),0);}
 }finally{for(const f of[a,b])f.world.free();}
});

test('preflight warms real builders without leaving damage, rubble, collision changes or hit counters',async()=>{
 await R.init();const world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene(),owner=await createGeometryOwner({scene,world,R,clay:{applyClay,removeClay},cardImage:id=>'card:'+id,loadTexture:async()=>{const t=new T.Texture();t.image={width:1366,height:762};return t;}}),initial=owner.volume.bits.slice(),colliders=world.colliders.len(),level=createFractureRoomResponse({frame,commitFracture(){},canReset:()=>true}),source=createFractureRoomResponse({frame,commitFracture(){},canReset:()=>true});
 try{source.impact({id:'r0:north',kind:'shot',at:[3.25,2.25,.75],normal:[0,0,1],dir:[0,0,-1],energy:.7,weapon:'blaster'},{nativeCommandWeapon:'blaster'});const field=source.surfaces.find(s=>s.name==='north').field;let target=null,draws=0;owner.prewarm({getRenderTarget:()=>null,setRenderTarget:t=>target=t,render(){draws++;},initTexture(){}},null,null,[field],level.surfaces);assert.ok(draws>=4);assert.equal(target,null);assert.deepEqual(owner.volume.bits,initial);assert.equal(world.colliders.len(),colliders);assert.equal(world.bodies.len(),0);assert.equal(owner.status().spawned,0);assert.equal(owner.status().commits,0);assert.equal(level.status().confirmedMessages,0);
 }finally{owner.dispose();world.free();}
});
