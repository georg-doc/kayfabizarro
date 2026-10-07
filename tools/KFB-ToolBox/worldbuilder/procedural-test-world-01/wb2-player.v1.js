import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createPlanarGround} from '../../lib/ground-planar.v1.js';
import {sampleLoco} from './loco-blend.v1.mjs';

const SOURCE_PIN='4398cd96499cd74c20b7be89e051a99121ea54c2';
const BASE='media/3D_Assets/KayKit_Character_Animations_1.1/';
const raw=path=>'https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+SOURCE_PIN+'/'+path.split('/').map(encodeURIComponent).join('/');
export const PLAYER_SOURCES=Object.freeze({
 Mannequin_Medium:{commit:SOURCE_PIN,path:BASE+'Mannequin Character/characters/Mannequin_Medium.glb'},
 FrizzleBob_v5b:{commit:'23615cffb515d03d2b6a0164b896dd08e3bc1bed',path:'tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5b.glb',blobSha:'24134a51793fef0dd8cab59bbf50b6b7c5960a45'}
});
export async function loadActorSource(profile){const src=PLAYER_SOURCES[profile];if(!src)throw Error('Unreviewed player profile '+profile);const g=await new GLTFLoader().loadAsync('https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+src.commit+'/'+src.path.split('/').map(encodeURIComponent).join('/'));g.scene.userData.sourceRecord={assetId:profile,packId:'KayKit Rig_Medium',source:src};return g.scene;}
export async function makePlayer({scene,camera,dom,world,groundAt,hud}) {
  const response=await fetch(new URL('./KFB_KAYKIT_LOCO_SET_01.v1.json',import.meta.url));if(!response.ok)throw Error('Motion contract missing');
  const contract=await response.json(),anchors=contract.locomotion.anchors,loader=new GLTFLoader();
  const [model,general,movement,advanced]=await Promise.all([
    loader.loadAsync(raw(BASE+'Mannequin Character/characters/Mannequin_Medium.glb')),
    loader.loadAsync(raw(BASE+'Animations/gltf/Rig_Medium/Rig_Medium_General.glb')),
    loader.loadAsync(raw(BASE+'Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb')),
    loader.loadAsync(raw(BASE+'Animations/gltf/Rig_Medium/Rig_Medium_MovementAdvanced.glb'))]);
  let figure=model.scene,profile='Mannequin_Medium';const holder=new THREE.Group();holder.name='WB2 Player · Mannequin_Medium';holder.add(figure);figure.userData.sourceRecord={assetId:profile,packId:'KayKit Rig_Medium',source:PLAYER_SOURCES[profile]};holder.visible=false;
  const names=new Set();figure.traverse(o=>{names.add(o.name);if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  const clips=[...general.animations,...movement.animations,...advanced.animations],actions=new Map();
  const requiredClips=[...new Set([...anchors.map(a=>a.clip),contract.variants.backwards,...contract.variants.jumpChain])];let mixer=new THREE.AnimationMixer(figure),bindings={};
  for(const name of requiredClips){
    const source=clips.find(c=>c.name===name);if(!source)throw Error('Native clip missing: '+name);
    // Same-rig source binding: preserve native translations/scales and all rotations.
    // Only the two absent, unused hand slots may be omitted; never silently drop a bone.
    const tracks=source.tracks.filter(t=>{const name=t.name.slice(0,t.name.lastIndexOf('.'));if(names.has(name))return true;if(/^handslot[lr]$/.test(name))return false;throw Error('Mannequin binding missing: '+t.name);});
    const clip=new THREE.AnimationClip(source.name,source.duration,tracks.map(t=>t.clone()));
    const action=mixer.clipAction(clip);action.play();action.paused=true;action.setEffectiveWeight(0);actions.set(name,action);bindings[name]={sourceTracks:source.tracks.length,boundTracks:tracks.length,duration:source.duration};
  }
  let dancing=false,danceTime=0,danceAction=null,danceSource=null;let phase=0,idleClock=0,samples=sampleLoco(anchors,0,0,0);
  function present(dt,speed,motion={phase:'ground',time:0}){
    if(dancing&&danceAction){danceTime+=dt;for(const a of actions.values())a.setEffectiveWeight(0);danceAction.setEffectiveWeight(1);danceAction.time=danceTime%danceAction.getClip().duration;mixer.update(0);figure.updateMatrixWorld(true);return;}if(danceAction)danceAction.setEffectiveWeight(0);
    idleClock+=dt;
    if(motion.phase!=='ground'){
      for(const a of actions.values())a.setEffectiveWeight(0);
      const name=motion.phase==='anticipation'?'Jump_Start':motion.phase==='landing'?'Jump_Land':'Jump_Idle';
      const action=actions.get(name),duration=action.getClip().duration;
      // Start/compression use the authored clip; air/landing selection follows capsule contact.
      action.time=motion.phase==='air'?motion.time%duration:Math.min(motion.time,duration);action.setEffectiveWeight(1);
      samples={rows:[{clip:name,time:action.time,weight:1}],phaseRate:0};mixer.update(0);figure.updateMatrixWorld(true);return;
    }
    if(speed<-.05){
      for(const a of actions.values())a.setEffectiveWeight(0);const action=actions.get(contract.variants.backwards);
      action.time=(idleClock*Math.abs(speed)/speeds.walk)%action.getClip().duration;action.setEffectiveWeight(1);samples={rows:[{clip:contract.variants.backwards,time:action.time,weight:1}],phaseRate:0};mixer.update(0);figure.updateMatrixWorld(true);return;
    }
    const prior=sampleLoco(anchors,speed,phase,idleClock);phase=((phase+prior.phaseRate*dt*(speed<0?-1:1))%1+1)%1;
    samples=sampleLoco(anchors,speed,phase,idleClock);
    for(const action of actions.values())action.setEffectiveWeight(0);
    for(const row of samples.rows){const action=actions.get(row.clip);action.time=row.time;action.setEffectiveWeight(row.weight);}
    mixer.update(0);figure.updateMatrixWorld(true);
  }
  present(0,0);const box=new THREE.Box3().setFromObject(figure,true);let bodyHeight=box.max.y-box.min.y;
  // Preserve the native metre rig; origin offset only, no consumer speed/rig rescale.
  figure.position.y=-box.min.y;scene.add(holder);
  const speeds=Object.fromEntries(anchors.map(a=>[a.role,a.speed]));
  const ground=createPlanarGround({THREE,camera,dom,root:holder,bodyHeight,spawn:world.spawn,groundAt,physics:world.surfaceAdapter?.physics,getActorProfileId:()=>profile,isMovementLocked:()=>dancing,solidAt:(x,z)=>world.solidAt(x,z),speeds,present,hud});
  const api=Object.assign(ground,{actor:{holder,figure,mixer,report:{actor:'Mannequin_Medium',bindings,bodyHeight}},contract,
    evidence(){return {owner:'WB2 shared planar Ground',animationOwner:'KayKit native speed/phase mixer',sourcePin:PLAYER_SOURCES[profile].commit,actorProfileId:profile,position:ground.position.toArray(),heading:ground.heading,speed:ground.speed,motion:ground.motion,phase,rows:samples.rows,bindings,bodyHeight,dance:{active:dancing,source:danceSource,time:danceTime,bindings:danceAction?.getClip().tracks.length},groundY:groundAt(ground.position.x,ground.position.z),mixerCount:1}},
    async learnDance(){if(danceAction)return;const source={commit:'032c9d50cd5de6764fa37fec65cb203ed35fcb11',path:'media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library_Rig_Medium.glb',clip:'kfb_dance_hip_hop_a',rootMotion:'in-place'};const g=await loader.loadAsync('https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+source.commit+'/'+source.path);const c=g.animations.find(c=>c.name===source.clip);if(!c)throw Error('Required learned dance source missing');const known=new Set();figure.traverse(o=>known.add(o.name));const tracks=c.tracks.filter(t=>{const name=t.name.slice(0,t.name.lastIndexOf('.'));if(known.has(name))return true;if(/^handslot[lr]$/.test(name))return false;throw Error('Required dance bone missing '+t.name)});source.sourceTracks=c.tracks.length;source.boundTracks=tracks.length;danceAction=mixer.clipAction(new THREE.AnimationClip(c.name,c.duration,tracks.map(t=>t.clone())));danceAction.play();danceAction.paused=true;danceAction.setEffectiveWeight(0);danceSource=source;},
    async setDancing(on){if(on)await api.learnDance();dancing=!!on;danceTime=0;ground.setOn(true);},
    async setActor(next){
      if(next===profile)return profile;const replacement=await loadActorSource(next),available=new Set();replacement.traverse(o=>{available.add(o.name);if(o.isMesh)o.castShadow=o.receiveShadow=true});
      const nextBindings={},prepared=[];
      for(const name of requiredClips){const src=clips.find(c=>c.name===name);const tracks=src.tracks.filter(t=>{const name=t.name.slice(0,t.name.lastIndexOf('.'));if(available.has(name))return true;if(/^handslot[lr]$/.test(name))return false;throw Error('Required Medium bone missing '+next+': '+name)});prepared.push(new THREE.AnimationClip(src.name,src.duration,tracks.map(t=>t.clone())));nextBindings[src.name]={sourceTracks:src.tracks.length,boundTracks:tracks.length,duration:src.duration};}
      const wasOn=ground.on;dancing=false;danceAction=null;danceSource=null;ground.setOn(false);mixer.stopAllAction();mixer.uncacheRoot(figure);holder.remove(figure);figure=replacement;holder.add(figure);mixer=new THREE.AnimationMixer(figure);actions.clear();bindings=nextBindings;profile=next;
      for(const clip of prepared){const action=mixer.clipAction(clip);action.play();action.paused=true;action.setEffectiveWeight(0);actions.set(clip.name,action)}
      phase=idleClock=0;present(0,0);const b=new THREE.Box3().setFromObject(figure,true);bodyHeight=b.max.y-b.min.y;ground.setBodyHeight(bodyHeight);figure.position.y=-b.min.y;holder.name='WB2 Player · '+next;api.actor={holder,figure,mixer,report:{actor:next,bindings,bodyHeight}};ground.setOn(wasOn);return profile;
    }
  });
  const danceEvents=new AbortController(),disposeGround=api.dispose.bind(api);
  addEventListener('keydown',e=>{if(dancing&&['KeyW','KeyS','KeyA','KeyD','KeyQ','KeyE','Space','Tab'].includes(e.code))dancing=false;},{signal:danceEvents.signal});
  api.dispose=()=>{danceEvents.abort();mixer.stopAllAction();mixer.uncacheRoot(figure);disposeGround()};
  if(!world.surfaceAdapter)return api;
  const travel='../../../../travel/wip/travel_globe_wsa/';
  const [{createCarpet},{createCameraRig},{createFlightControls},{createPlanarFlightFrame},{createWorldBuilderModeBridge},{createGroundFlightIntent}]=await Promise.all([
    import(travel+'globe-v13/carpet.js'),import(travel+'globe-v13/camera-rig.js'),import(travel+'globe-v13/flight-controls.js'),import(travel+'globe-v13/planar-frame.js'),import(travel+'world-builder/runtime-mode.js'),import(travel+'world-builder/mode-intent.js')]);
  const frame=createPlanarFlightFrame({THREE,surface:world.surfaceAdapter,character:()=>ground.character,spawn:world.spawn}),carpet=createCarpet({THREE,globeRadius:1,seed:world.zone.seed,geometry:frame}),rig=createCameraRig(THREE,camera.aspect,{camera,geometry:frame}),flightControls=createFlightControls(dom);
  const mobility=createWorldBuilderModeBridge({ground,carpet,rig,controls:flightControls,frame,physics:world.surfaceAdapter.physics,holder,present,worldId:world.docId,actorProfileId:()=>profile,onMode:mode=>{document.body.dataset.movementOwner=mode==='FLIGHT'?'Travel Flight':'WB2 Ground'}});
  const intent=createGroundFlightIntent({onRequestFlight:()=>mobility.enterFlight()});ground.setSpaceIntent(e=>intent.noteGroundSpace(e));
  const wrapper=Object.create(api);Object.defineProperty(wrapper,'on',{get:()=>mobility.active});
  wrapper.update=dt=>mobility.update(dt);wrapper.setOn=on=>{intent.reset('play-edit');mobility.setOn(on)};
  wrapper.readDoc=doc=>{intent.reset('document');mobility.reset();api.readDoc(doc)};
  wrapper.evidence=()=>({...api.evidence(),mobility:mobility.evidence(),intent:intent.report()});
  wrapper.writeDoc=doc=>mobility.writeDoc(doc);wrapper.setActor=async next=>{const result=await api.setActor(next);mobility.afterActorChange();return result};
  wrapper.dispose=()=>{mobility.dispose();api.dispose()};return wrapper;
}
