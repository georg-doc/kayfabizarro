const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const roundTo=(value,step)=>Math.round(value/step)*step;

export const KFB_RENDER_PRESET_R0=Object.freeze({
  schema:'kfb.render-preset/1',
  id:'KFB_RENDER_R0_CONTACT_AND_DETAIL',
  version:1,
  shadow:Object.freeze({
    mapSize:2048,
    sunDistanceM:900,
    activeHalfMinM:72,
    activeHalfMaxM:140,
    cameraDistanceMultiplier:1.2,
    extentStepM:8,
    depthBias:-0.000035,
    normalBiasMinM:0.006,
    normalBiasMaxM:0.028,
    normalBiasTexels:0.30
  }),
  clay:Object.freeze({
    maxAnisotropy:4,
    stable:Object.freeze({
      hero:Object.freeze({tile:1.75,stroke:.42,grain:.10,macro:.38,facet:.09,crease:.42,relief:.90}),
      world:Object.freeze({tile:2.10,stroke:.30,grain:.055,macro:.32,facet:.055,crease:.28,relief:.72})
    }),
    moving:Object.freeze({
      hero:Object.freeze({tile:1.90,stroke:.31,grain:.04,macro:.29,facet:.055,crease:.26,relief:.76}),
      world:Object.freeze({tile:2.35,stroke:.20,grain:.018,macro:.23,facet:.025,crease:.14,relief:.58})
    })
  })
});

export function resolveShadowTuning(cameraDistanceM,mapSize=KFB_RENDER_PRESET_R0.shadow.mapSize){
  const P=KFB_RENDER_PRESET_R0.shadow;
  const safeDistance=Number.isFinite(cameraDistanceM)?Math.max(0,cameraDistanceM):0;
  const safeMapSize=Math.max(1,Number.isFinite(mapSize)?mapSize:P.mapSize);
  const halfExtentM=clamp(roundTo(safeDistance*P.cameraDistanceMultiplier,P.extentStepM),P.activeHalfMinM,P.activeHalfMaxM);
  const texelM=2*halfExtentM/safeMapSize;
  const normalBiasM=clamp(texelM*P.normalBiasTexels,P.normalBiasMinM,P.normalBiasMaxM);
  return {halfExtentM,texelM,normalBiasM,depthBias:P.depthBias,mapSize:safeMapSize};
}

export function followDirectionalShadow({sun,direction,focus,camera,controlsTarget}){
  if(!sun?.shadow||!direction||!focus||!camera)throw Error('KFB Render R0 needs sun, direction, focus and camera');
  const shadow=sun.shadow,shadowCamera=shadow.camera,P=KFB_RENDER_PRESET_R0.shadow;
  const target=controlsTarget||focus;
  const cameraDistance=camera.position.distanceTo(target);
  const tuning=resolveShadowTuning(cameraDistance,shadow.mapSize.x);
  if(tuning.halfExtentM!==sun.userData.kfbRenderHalfExtentM){
    sun.userData.kfbRenderHalfExtentM=tuning.halfExtentM;
    Object.assign(shadowCamera,{
      left:-tuning.halfExtentM,right:tuning.halfExtentM,
      top:tuning.halfExtentM,bottom:-tuning.halfExtentM,
      near:P.sunDistanceM-Math.max(tuning.halfExtentM*1.2,380),
      far:P.sunDistanceM+tuning.halfExtentM*1.2+80
    });
    shadowCamera.updateProjectionMatrix();
  }
  shadow.normalBias=tuning.normalBiasM;
  shadow.bias=tuning.depthBias;

  const e1=focus.clone().set(0,1,0).cross(direction).normalize();
  const e2=direction.clone().cross(e1).normalize();
  const a=Math.round(focus.dot(e1)/tuning.texelM)*tuning.texelM;
  const b=Math.round(focus.dot(e2)/tuning.texelM)*tuning.texelM;
  const snapped=e1.multiplyScalar(a).addScaledVector(e2,b).addScaledVector(direction,focus.dot(direction));
  sun.target.position.copy(snapped);
  sun.position.copy(snapped).addScaledVector(direction,P.sunDistanceM);
  sun.target.updateMatrixWorld();
  sun.userData.kfbRenderPreset={
    schema:'kfb.render-shadow-state/1',preset:KFB_RENDER_PRESET_R0.id,
    cameraDistanceM:+cameraDistance.toFixed(3),
    halfExtentM:tuning.halfExtentM,texelM:+tuning.texelM.toFixed(5),
    normalBiasM:+tuning.normalBiasM.toFixed(5),depthBias:tuning.depthBias,
    stabilizedToTexel:true
  };
  return sun.userData.kfbRenderPreset;
}

export function clayTierValues(tier='world',state='stable'){
  const mode=state==='moving'?'moving':'stable';
  const level=tier==='hero'?'hero':'world';
  return KFB_RENDER_PRESET_R0.clay[mode][level];
}
