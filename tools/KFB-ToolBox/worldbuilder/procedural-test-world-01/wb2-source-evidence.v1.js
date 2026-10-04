/* Internal evidence adapter: uses the actual WB2 renderer, never a second world. */
import * as THREE from 'three';
import {buildP0BTreeGeometry,buildT3BushGeometry,SOURCE_PROVENANCE} from '../world-corridor-01/procedural-props-local-proof/environment-family-p1.mjs';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { makeClayRelief } from '../../_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-clay/clay-relief.v2.js';
import { makeToolReliefs } from '../../_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-clay/clay-relief.v4.js';
import { makeClayUniforms, makeClayMaterial, seedGeometry, PROFILES } from '../../_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-clay/clay-material.v10.js';
import { TOOLMIX } from '../../_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-clay/clay-toolmix.v1.js';

const loader=new GLTFLoader(),cache=new Map();
export const manifest=await fetch(new URL('./VISIBLE_SOURCE_MANIFEST.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('source manifest '+r.status);return r.json()});
let clayPromise;
export async function clayContext(){
  if(!clayPromise)clayPromise=(async()=>{
    // K2 source boot, lines 37–43. Seam: share uniforms with WB2; no donor renderer.
    const tex=d=>{const t=new THREE.DataTexture(d,1024,1024,THREE.RGBAFormat);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t};
    const relief=makeClayRelief({size:1024,seed:31}),tools=await makeToolReliefs({size:1024,seed:41});
    const U=makeClayUniforms(THREE,tex(relief.data));
    [U.uClayToolA.value,U.uClayToolB.value,U.uClayToolC.value]=tools.maps.map(tex);
    U.uClayToolOn.value=1;U.uClayLegacyStroke.value=0;U.uClayMottle.value=.04;
    U.uClayPrint.value=U.uClayRelief.value;U.uClayPrintOn.value=0;
    // Preserve source-native asset colours. No palette replacement.
    return U;
  })();return clayPromise;
}
export async function loadRegistered(record){
  const key=record.source.commit+'/'+record.assetId;
  if(!cache.has(key))cache.set(key,loader.loadAsync(record.source.rawPinned));
  const g=await cache.get(key);return g.scene.clone(true);
}
export async function adaptRegistered(root,seed=31){
  const U=await clayContext(),QUIET={print:.3,dent:0,gouge:0,crack:0,stroke:1,facet:.2,crease:.3};
  const profile={...PROFILES.house,...QUIET,legacy:0,tools:TOOLMIX.house};
  root.traverse(o=>{if(o.isMesh){o.geometry=seedGeometry(THREE,o.geometry.clone(),seed++);o.material=(Array.isArray(o.material)?o.material:[o.material]).map(src=>makeClayMaterial(THREE,U,{src,profile,palMap:false,reliefK:.15}));if(o.material.length===1)o.material=o.material[0];o.castShadow=o.receiveShadow=true}});
  return root;
}
export function createCandidateEvidence(A){
  let isolate=null,residentIsolate=null,restore=null,frameTimes=[],sampleFrames=0,last=performance.now();
  const sample=()=>{const now=performance.now();residentIsolate?.update(Math.min(.05,(now-last)/1000));frameTimes.push(now-last);last=now;if(frameTimes.length>240)frameTimes.shift();if(frameTimes.length>=120&&++sampleFrames%30===0){const sorted=[...frameTimes].sort((a,b)=>a-b);document.body.dataset.candidateMetrics=JSON.stringify({build:window.__kfbBuild||'LOCAL_UNSEALED',frames:frameTimes.length,medianMs:sorted[Math.floor(sorted.length/2)],p95Ms:sorted[Math.floor(sorted.length*.95)],drawCalls:A.renderer.info.render.calls,triangles:A.renderer.info.render.triangles,pixelRatio:A.renderer.getPixelRatio(),camera:A.camera.position.toArray()})}};
  const sourceAudit=()=>{
    const rendered=new Map(),unknown=new Map(),frustum=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(A.camera.projectionMatrix,A.camera.matrixWorldInverse));
    A.scene.traverseVisible(o=>{if(!o.isMesh)return;let q=o;while(q&&!q.userData?.sourceRecord)q=q.parent;const source=q?.userData?.sourceRecord;if(!source){const box=new THREE.Box3().setFromObject(o);if(frustum.intersectsBox(box))unknown.set(o.uuid,{name:o.name||o.type,parent:o.parent?.name||o.parent?.type});return;}const box=new THREE.Box3().setFromObject(o);if(frustum.intersectsBox(box)){const key=source.source.commit+'/'+source.assetId;const rec=rendered.get(key)||{assetId:source.assetId,packId:source.packId,commit:source.source.commit,blob:source.source.blobSha,meshCount:0};rec.meshCount++;rendered.set(key,rec)}});
    const loaded=performance.getEntriesByType('resource').map(r=>r.name),banned=manifest.bannedVisible.filter(p=>loaded.some(url=>decodeURIComponent(url).includes(p)));
    const sorted=[...frameTimes].sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length/2)]||0;
    return{schema:'kfb.actual-runtime-evidence/1',build:window.__kfbBuild||document.body.dataset.candidateRevision||'LOCAL_UNSEALED',ready:document.body.dataset.candidateReady,seed:3,camera:A.camera.position.toArray(),target:A.controls.target.toArray(),loaded,rendered:[...rendered.values()],unknownVisibleMeshes:[...unknown.values()],banned,firewall:banned.length?'FAIL':'PASS',performance:{frames:frameTimes.length,medianMs:median,p95Ms:sorted[Math.floor(sorted.length*.95)]||0,drawCalls:A.renderer.info.render.calls,triangles:A.renderer.info.render.triangles},owners:{renderer:'WB2',ground:A.play?.constructor?.name,animationMixers:A.play?.evidence().mixerCount},player:A.play?.evidence()};
  };
  async function inspect(worldId,variant='original',index=0){
    if(!restore){const hidden=A.scene.children.filter(o=>!o.isLight);restore={hidden:hidden.map(o=>[o,o.visible]),camera:A.camera.position.clone(),target:A.controls.target.clone(),play:A.play.on};A.setPlay(false);hidden.forEach(o=>o.visible=false)}
    if(isolate)A.scene.remove(isolate);residentIsolate?.dispose();residentIsolate=null;
    const procedural=worldId.startsWith('nature.p1-'),bush=worldId==='nature.p1-bush';
    const resident=worldId.startsWith('resident:'),curtain=worldId==='curtain',card=worldId.startsWith('card:'),party=worldId.startsWith('party:'),taxi=worldId==='taxi',actor=worldId.startsWith('actor:'),billboard=worldId.startsWith('billboard:');
    if(billboard){const api=await import('./wb2-billboards.v1.js');residentIsolate=await api.createWorldBillboard(worldId.slice(10),{renderer:A.renderer,original:variant==='original',cards:A.mvp?.cards})}
    if(actor){const api=await import('./wb2-player.v1.js'),root=await api.loadActorSource(worldId.slice(6));residentIsolate={root,update(){},dispose(){root.removeFromParent()},evidence:()=>api.PLAYER_SOURCES[worldId.slice(6)]}}
    if(taxi){const api=await import('./wb2-taxi.v1.js'),root=await api.createTaxiModel();residentIsolate={root,update(){},dispose(){root.removeFromParent()},evidence:()=>api.TAXI_SOURCE}}
    if(party){const api=await import('./wb2-party.v1.js');residentIsolate=await api.createPartySet(worldId.slice(6),{renderer:A.renderer,original:variant==='original'})}
    if(card){const api=await import('./wb2-cards.v1.js'),owner=api.createMvpCards(),c=await owner.load(worldId.slice(5));residentIsolate={root:c.group,update(){},dispose:()=>{c.group.removeFromParent();owner.builder.dispose()},evidence:()=>owner.evidence()}}
    if(curtain){const api=await import('../../_inbox/KFB Theatre Curtain v2/2026-09-24-theatre-curtain/game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs');const c=await api.createSharedTheatreCurtain({renderer:A.renderer});residentIsolate={root:c.scene,update:dt=>c.update(dt),dispose:()=>c.dispose(),evidence:()=>c.snapshot()};c.scene.userData.sourceRecord={assetId:'KFB Theatre Curtain',packId:'KFB Theatre Curtain v2',source:{commit:'1df8edaeb11b695821f73c695b328b00fd85e42f',path:'tools/KFB-ToolBox/_inbox/KFB Theatre Curtain v2/2026-09-24-theatre-curtain/game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs',blobSha:null}};}
    if(resident){const api=await import('./wb2-residents.v1.js');residentIsolate=await api.createResidentSet(worldId.slice(9),{original:variant==='original'})}
    const record=(resident||curtain||card||party||taxi||actor||billboard)?residentIsolate.root.userData.sourceRecord:procedural?{assetId:bush?'T3_BUSH':'P0B_TREE',packId:'KFB Environment P1',source:{commit:'1df8edaeb11b695821f73c695b328b00fd85e42f',blobSha:'e64ed265882b973235cef04251073840e0231e72',path:'tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-props-local-proof/environment-family-p1.mjs'},lineage:bush?SOURCE_PROVENANCE.t3:SOURCE_PROVENANCE.p0b}:manifest.families[worldId][index];
    const root=(resident||curtain||card||party||taxi||actor||billboard)?residentIsolate.root:procedural?new THREE.Mesh(bush?buildT3BushGeometry(1801,1):buildP0BTreeGeometry(),new THREE.MeshStandardMaterial({color:'#83b33d',roughness:1})):await loadRegistered(record);
    if(variant!=='original'&&!resident&&!procedural&&!curtain&&!card&&!party&&!taxi&&!actor&&!billboard)await adaptRegistered(root);
    if(procedural&&variant!=='original'&&bush)root.scale.setScalar(.28);
    root.userData.sourceRecord=record;root.name='Registered source isolate · '+record.assetId;
    isolate=root;A.scene.add(root);root.updateMatrixWorld(true);
    const box=new THREE.Box3().setFromObject(root),centre=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3()),r=Math.max(size.x,size.y,size.z);
    A.camera.position.copy(centre).add(new THREE.Vector3(r*1.5,r*.8,r*2.2));A.controls.target.copy(centre);A.controls.update();
    if(variant==='detail'){A.camera.position.copy(centre).add(new THREE.Vector3(r*.25,r*.12,r*.45));A.controls.target.copy(centre);A.controls.update()}
    document.body.dataset.candidateReady='SOURCE_ISOLATE_READY';document.body.dataset.sourceInspection=JSON.stringify(residentIsolate?.evidence()||{assetId:record.assetId,variant});return{record,variant,bounds:{min:box.min.toArray(),max:box.max.toArray()},sourceMeshes:root.children.length};
  }
  function release(){residentIsolate?.dispose();residentIsolate=null;if(isolate)A.scene.remove(isolate);isolate=null;if(restore){restore.hidden.forEach(([o,v])=>o.visible=v);A.camera.position.copy(restore.camera);A.controls.target.copy(restore.target);A.controls.update();if(restore.play)A.setPlay(true);restore=null}document.body.dataset.candidateReady='WB2_READY'}
  document.body.dataset.movementProbe=JSON.stringify(Array.from({length:16},(_,i)=>{const x=A.world.spawn.x,z=A.world.spawn.z+i;return{distance:i,x,z,ground:A.terrainHeightAt(x,z),support:A.world.groundAt(x,z,A.terrainHeightAt(x,z)),building:A.world.buildingAt(x,z)}}));
  document.body.dataset.candidateReady='WB2_READY';
  function frameWorld(worldId){
    A.setPlay(false);const n=A.world.archipelago?.nodes.find(n=>n.id===worldId);if(!n)throw Error('world camera preset '+worldId);
    const anchor=n.anchors.find(a=>a.locator.kind==='plaza')||n.anchors[0],p=anchor.position;
    A.controls.target.set(p[0],p[1]+3,p[2]);A.camera.position.set(p[0]+30,p[1]+22,p[2]+36);A.controls.update();
    document.body.dataset.candidateReady='WORLD_PRESET_READY';return{worldId,anchor:anchor.id,camera:A.camera.position.toArray(),target:A.controls.target.toArray()};
  }
  return{sample,sourceAudit,inspect,release,frameWorld,manifest};
}
