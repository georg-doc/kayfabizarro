import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import path from 'node:path';import {pathToFileURL} from 'node:url';
const threeRoot=process.argv[2];if(!threeRoot)throw Error('Pass installed three@0.160.0 package root for geometry-only QA');
const THREE=await import(pathToFileURL(path.join(threeRoot,'build/three.module.js')));
const {GLTFLoader}=await import(pathToFileURL(path.join(threeRoot,'examples/jsm/loaders/GLTFLoader.js')));
import {makeSoles,measureSoleContacts} from '../dist/footsteps/sole-contacts.mjs';
let checks=0;const check=(v,label)=>{assert.ok(v,label);checks++;};
const loader=new GLTFLoader();loader.register(p=>{p.loadTexture=()=>Promise.resolve(new THREE.Texture());return {name:'GEOMETRY_AUDIT'};});
const base=new URL('../dist/footsteps/assets/',import.meta.url);
async function glb(f){const b=readFileSync(new URL(f,base));return loader.parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');}
const results=[];
for(const family of ['Medium','Large']){
 const [model,motion]=await Promise.all([glb('Mannequin_'+family+'.glb'),glb(family==='Medium'?'MovementBasic.glb':'Rig_Large_MovementBasic.glb')]),actor=model.scene,mixer=new THREE.AnimationMixer(actor),names=new Set();actor.traverse(n=>names.add(n.name));
 const saved=[];actor.traverse(n=>saved.push({n,p:n.position.clone(),q:n.quaternion.clone(),s:n.scale.clone()}));const soles=makeSoles(THREE,actor);
 for(const name of ['Walking_A','Running_A']){mixer.stopAllAction();const source=motion.animations.find(c=>c.name===name),clip=new THREE.AnimationClip(name,source.duration,source.tracks.filter(t=>names.has(THREE.PropertyBinding.parseTrackName(t.name).nodeName)).map(t=>t.clone()));
  const profile=measureSoleContacts(THREE,{mixer,clip,actor,soles});check(profile.entries.length===2,'2 contacts');
  const a=mixer.clipAction(clip);a.reset().setEffectiveWeight(1).play();
  const points=[];for(const p of profile.entries){actor.position.y=0;a.time=p.phase*clip.duration;mixer.update(0);actor.updateMatrixWorld(true);if(profile.groundedWalk){actor.position.y=-Math.min(soles.height('l'),soles.height('r'));actor.updateMatrixWorld(true);}const actualY=soles.height(p.foot),floor=profile.groundedWalk?0:p.floorY;check(profile.groundedWalk?Math.abs(actualY)<.00201:Math.abs(actualY-p.soleY)<1e-6,'independent pose reproduces contact');check(actualY-floor<=.00201,'sole reaches actual support plane');points.push({foot:p.foot,phase:p.phase,clearance:actualY-floor});}actor.position.y=0;
  const gap=(profile.entries[1].phase-profile.entries[0].phase+1)%1;check(gap>.35&&gap<.65,'alternating contacts not a doubled stomp');check(profile.soleVertices.l>0&&profile.soleVertices.r>0,'real skinned vertices');
  results.push({family,clip:name,points,gap,vertices:profile.soleVertices});mixer.stopAllAction();for(const x of saved){x.n.position.copy(x.p);x.n.quaternion.copy(x.q);x.n.scale.copy(x.s);}
 }
}
const basePath=new URL('../',import.meta.url),audio=readFileSync(new URL('dist/footsteps/audio.mjs',basePath),'utf8'),preview=readFileSync(new URL('dist/footsteps/preview.mjs',basePath),'utf8');
check(!/new\s+(AudioContext|OfflineAudioContext)/.test(audio+preview),'no context creation');
for(const token of ["cutoff:620","cutoff:950","cutoff:780","tail:.28","tail:.19","tail:.22"])check(audio.includes(token),'surface tone '+token);
check(audio.includes("cutoff:450,tail:.24,gain:.5,attack:.024"),'explicitly requested softer Cozy default only');
check(preview.includes("rows:[...s.rows,...s.r2Rows]"),'same original donors');check(preview.includes("['play','pause','ended','seeking']"),'clip/live interlock');check(audio.includes('output.gain.setValueAtTime(0'),'stop gate');
console.log(JSON.stringify({status:'PASS',checks,results},null,2));
