import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createPlanarGround} from '../../lib/ground-planar.v1.js';
import {sampleLoco} from './loco-blend.v1.mjs';

const SOURCE_PIN='4398cd96499cd74c20b7be89e051a99121ea54c2';
const BASE='media/3D_Assets/KayKit_Character_Animations_1.1/';
const raw=path=>'https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+SOURCE_PIN+'/'+path.split('/').map(encodeURIComponent).join('/');
export async function makePlayer({scene,camera,dom,world,groundAt,hud}) {
  const response=await fetch(new URL('./KFB_KAYKIT_LOCO_SET_01.v1.json',import.meta.url));if(!response.ok)throw Error('Motion contract missing');
  const contract=await response.json(),anchors=contract.locomotion.anchors,loader=new GLTFLoader();
  const [model,general,movement]=await Promise.all([
    loader.loadAsync(raw(BASE+'Mannequin Character/characters/Mannequin_Medium.glb')),
    loader.loadAsync(raw(BASE+'Animations/gltf/Rig_Medium/Rig_Medium_General.glb')),
    loader.loadAsync(raw(BASE+'Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb'))]);
  const figure=model.scene,holder=new THREE.Group();holder.name='WB2 Player · Mannequin_Medium';holder.add(figure);holder.visible=false;
  const names=new Set();figure.traverse(o=>{names.add(o.name);if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  const clips=[...general.animations,...movement.animations],mixer=new THREE.AnimationMixer(figure),actions=new Map(),bindings={};
  for(const a of anchors){
    const source=clips.find(c=>c.name===a.clip);if(!source)throw Error('Native clip missing: '+a.clip);
    // Same-rig source binding: preserve native translations/scales and all rotations.
    // Only the two absent, unused hand slots may be omitted; never silently drop a bone.
    const tracks=source.tracks.filter(t=>{const name=t.name.slice(0,t.name.lastIndexOf('.'));if(names.has(name))return true;if(/^handslot[lr]$/.test(name))return false;throw Error('Mannequin binding missing: '+t.name);});
    const clip=new THREE.AnimationClip(source.name,source.duration,tracks.map(t=>t.clone()));
    const action=mixer.clipAction(clip);action.play();action.paused=true;action.setEffectiveWeight(0);actions.set(a.clip,action);bindings[a.clip]={sourceTracks:source.tracks.length,boundTracks:tracks.length,duration:source.duration};
  }
  let phase=0,idleClock=0,samples=sampleLoco(anchors,0,0,0);
  function present(dt,speed){
    idleClock+=dt;const prior=sampleLoco(anchors,speed,phase,idleClock);phase=((phase+prior.phaseRate*dt*(speed<0?-1:1))%1+1)%1;
    samples=sampleLoco(anchors,speed,phase,idleClock);
    for(const action of actions.values())action.setEffectiveWeight(0);
    for(const row of samples.rows){const action=actions.get(row.clip);action.time=row.time;action.setEffectiveWeight(row.weight);}
    mixer.update(0);figure.updateMatrixWorld(true);
  }
  present(0,0);const box=new THREE.Box3().setFromObject(figure,true),bodyHeight=box.max.y-box.min.y;
  // Preserve the native metre rig; origin offset only, no consumer speed/rig rescale.
  figure.position.y=-box.min.y;scene.add(holder);
  const speeds=Object.fromEntries(anchors.map(a=>[a.role,a.speed]));
  const ground=createPlanarGround({THREE,camera,dom,root:holder,bodyHeight,spawn:world.spawn,groundAt,solidAt:(x,z)=>world.solidAt(x,z),speeds,present,hud});
  return Object.assign(ground,{actor:{holder,figure,mixer,report:{actor:'Mannequin_Medium',bindings,bodyHeight}},contract,
    evidence(){return {owner:'WB2 shared planar Ground',animationOwner:'KayKit native speed/phase mixer',sourcePin:SOURCE_PIN,actorProfileId:'Mannequin_Medium',position:ground.position.toArray(),heading:ground.heading,speed:ground.speed,phase,rows:samples.rows,bindings,bodyHeight,groundY:groundAt(ground.position.x,ground.position.z),mixerCount:1}},
  });
}
