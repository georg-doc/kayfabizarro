// Run from repository root: node kfb-hub/stage/toolbox/frankenstein-composer/tests/wireface-face-driver-contract.mjs
// Stubs prove interface contracts, NOT actual SDK/WebGL face attachment.
import assert from 'node:assert/strict';
import {FACE_MODES,SCHEMA,companion,attachWireface,bindOwnerAudio}
 from '../wireface-face-driver-contract.mjs';
const actor={schema:'kfb.actor-recipe/0.2-candidate',
 primaryFormat:'kfb.pets/1',
 source:{selectedId:'gothgirl',rigFamily:'Rig_Medium'},
 composition:{bodyRef:'gothgirl',headRef:'fb-head-v5',
 faceOwners:{eye:'pet-eye-rig.v6'}},
 provenance:{sourceHead:'865b3d8a032bdbe41ac09aea77f67677c2fb4745'}};
const donor={sourceId:'SOURCE_ONLY_FACE',sourceRef:'verified-donor-ref',
 sdkVersion:'SDK_VERSION_NOT_ASSUMED',proof:'SOURCE_ISOLATED_VISUALLY_VERIFIED',
 distributionReviewed:true};
const mount={headNodeId:'real-head-node',measured:true,
 at:[0,0,0],rotation:[0,0,0],size:1};
let passed=0;
const test=(name,fn)=>{fn();passed++;};
const bad=(name,fn,re)=>test(name,()=>assert.throws(fn,re));
test('four modes',()=>assert.equal(FACE_MODES.length,4));
test('native preserves recipe',()=>{
 const p=companion(actor);assert.equal(p.channelOwner,'KFB_NATIVE');
 assert.equal(p.faceSource,null);assert.equal(actor.composition.faceDriver,undefined);
});
test('Wireface source companion',()=>{
 const p=companion(actor,{mode:'WIREFACE_MESH',faceSource:donor,mount});
 assert.equal(p.status,'SDK_LOAD_AND_VISUAL_PROOF_REQUIRED');
 assert.equal(p.schema,SCHEMA);
});
for(const mode of FACE_MODES.filter(x=>x!=='KFB_NATIVE')){
 test('supported '+mode,()=>assert.equal(
 companion(actor,{mode,faceSource:donor,mount}).faceDriver,mode));
}
bad('never fake source proof',()=>companion(actor,{mode:'WIREFACE_MESH',
 faceSource:{...donor,proof:'URL_LOADED'},mount}),/VENDOR_FACE_SOURCE_NOT_ISOLATED/);
bad('never skip license',()=>companion(actor,{mode:'WIREFACE_MESH',
 faceSource:{...donor,distributionReviewed:false},mount}),/WIRE_FACE_LICENCE_NOT_REVIEWED/);
bad('measured head required',()=>companion(actor,{mode:'WIREFACE_MESH',
 faceSource:donor,mount:{...mount,measured:false}}),/REAL_HEAD_MEASUREMENT_REQUIRED/);
bad('double EyeRig forbidden',()=>companion(actor,{mode:'WIREFACE_MESH',
 faceSource:donor,mount,activeFaceOwners:['eye']}),/DOUBLE_FACE_CHANNEL_OWNER/);
bad('double mouth forbidden',()=>companion(actor,{mode:'WIREFACE_MESH',
 faceSource:donor,mount,activeFaceOwners:['mouth']}),/DOUBLE_FACE_CHANNEL_OWNER/);
bad('second audio clock forbidden',()=>companion(actor,{
 audioClockOwner:'CREATURE_NEW_AUDIO'}),/SECOND_AUDIO_CLOCK_FORBIDDEN/);
const recipe=companion(actor,{mode:'WIREFACE_MESH',faceSource:donor,mount});
bad('no vendor sdk',()=>attachWireface({recipe,face:{},head:{name:mount.headNodeId},
 sdk:{},sourceProof:true}),/VENDOR_SDK_FACE_HEAD_REQUIRED/);
bad('wrong source mount',()=>attachWireface({recipe,face:{},
 head:{name:'fake-head'},sdk:{attachFace:()=>({})},sourceProof:true}),
 /HEAD_MOUNT_IDENTITY_MISMATCH/);
bad('no isolated proof',()=>attachWireface({recipe,face:{},
 head:{name:mount.headNodeId},sdk:{attachFace:()=>({})},sourceProof:false}),
 /SOURCE_VISUAL_PROOF_REQUIRED/);
test('injected sdk adapter seam',()=>{
 let called=0;
 const result=attachWireface({recipe,face:{},head:{name:mount.headNodeId},
 sdk:{attachFace:()=>{called++;return {id:'stub'};}},sourceProof:true});
 assert.equal(called,1);assert.equal(result.status,'SDK_ATTACHED_VISUAL_NOT_YET_ACCEPTED');
});
bad('no new audio source',()=>bindOwnerAudio({face:{}}),/EXISTING_AUDIO_SOURCE_REQUIRED/);
test('existing audio passed through',()=>{
 const result=bindOwnerAudio({face:{listenTo:(ctx,s)=>({ctx,s})},
 audioContext:{id:'from-kfb-audio'},audioSource:{id:'voice-clip'}});
 assert.equal(result.audioClockOwner,'KFB_AUDIO_EXISTING');
});
test('no claim of complete GLB',()=>assert.equal(recipe.selfContainedAnimatedGLBVerified,false));
console.log(JSON.stringify({status:'CONTRACT_TESTS_PASS_NOT_VENDOR_VISUAL_PROOF',
 passed, realVendorSDKTested:false, composerSitePublished:false},null,2));
