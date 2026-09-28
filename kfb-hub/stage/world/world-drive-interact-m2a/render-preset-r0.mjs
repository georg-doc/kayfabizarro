import * as THREE from 'three';
import {KFB_RENDER_PRESET_R0} from '../../../shared/render/kfb-render-preset.v1.mjs';

const FACE=/eye|brow|eyelid|mouth|teeth|tongue|face/i;
const ACTOR=/actor|resident|frizzle|graft|character|caveman/i;
const VEHICLE=/vehicle|kart|wheel|chassis|suspension/i;
const ARCH=/far-shell|wall|roof|facade|building|world-zone|landmark/i;
const TERRAIN=/terrain|ground|plate|road|curb|path|water/i;

function renderClass(mesh,app){
  let node=mesh,name='';
  while(node){name+=' '+(node.name||'');if(node.userData?.kind)name+=' '+node.userData.kind;node=node.parent}
  if(FACE.test(name))return 'FACE';
  if(ACTOR.test(name))return 'ACTOR';
  if(VEHICLE.test(name))return 'VEHICLE';
  if(mesh===app.terrain||TERRAIN.test(name))return 'TERRAIN';
  if(ARCH.test(name))return 'ARCHITECTURE';
  return 'PROP';
}

export function mountRenderPresetR0({app,clay,quality}){
  if(!app?.renderer||!app?.scene||!clay?.setDetailState)throw Error('Render R0 needs the accepted World renderer, scene and H0 clay adapter');
  const renderer=app.renderer;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const maxAnisotropy=renderer.capabilities.getMaxAnisotropy?.()||1;
  const classes={FACE:0,ACTOR:0,VEHICLE:0,PROP:0,ARCHITECTURE:0,TERRAIN:0};
  app.scene.traverse(node=>{if(node.isMesh)classes[renderClass(node,app)]++});

  let detailState=quality?.state==='stable'?'stable':'moving';
  clay.setDetailState(detailState);
  const onQuality=event=>{
    detailState=event.detail?.state==='stable'?'stable':'moving';
    clay.setDetailState(detailState);
  };
  addEventListener('kfb-world-quality',onQuality);

  function report(){
    const sun=app.scene.children.find(node=>node.isDirectionalLight&&node.castShadow);
    const shadow=sun?.userData?.kfbRenderPreset||null;
    return {
      schema:'kfb.render-preset-r0/1',preset:KFB_RENDER_PRESET_R0.id,
      renderer:{shadowFilter:'PCFSoftShadowMap',maxAnisotropy,activePixelRatio:+renderer.getPixelRatio().toFixed(2)},
      shadow,detailState,classes,clay:clay.detailReport(),
      policies:{shadowEnvelope:'active gameplay corridor, never loaded-world bounds',clayDetail:'hero/world/moving tiers; distant shells and far terrain simplified',runtimeOwnersUnchanged:true}
    };
  }
  function dispose(){removeEventListener('kfb-world-quality',onQuality)}
  document.body.dataset.m2aRenderPreset='r0';
  return {report,dispose};
}
