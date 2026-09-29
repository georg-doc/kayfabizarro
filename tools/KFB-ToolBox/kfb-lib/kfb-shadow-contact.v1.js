/**
 * KFB shared shadow/contact runtime v1.
 * One owner for shadow-camera fitting and contact policy.
 */
export const KFB_SHADOW_CONTACT_PROFILE = Object.freeze({
  id: 'KFB_SHARED_SHADOW_CONTACT_V1',
  mapSize: 4096,
  bias: -0.00003,
  normalBiasTexels: 1.2,
  minHalfM: 45,
  maxHalfM: 260,
  snapStepM: 5,
  sunDistanceM: 700,
  nearPaddingM: 80,
  foliagePolicy: 'CAST_WORLD_NO_SIBLING_RECEIVE',
  coplanarPolicy: 'GEOMETRY_FIX_REQUIRED'
});
const UP = { x: 0, y: 1, z: 0 };
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const normalize=v=>{const n=Math.hypot(v.x,v.y,v.z)||1;return{x:v.x/n,y:v.y/n,z:v.z/n}};
const cross=(a,b)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const addScaled=(o,v,s)=>{o.x+=v.x*s;o.y+=v.y*s;o.z+=v.z*s;return o};

export function fitKfbDirectionalShadow(light, focus, direction, options = {}) {
  if (!light?.shadow?.camera || !light?.position || !light?.target?.position)
    throw new TypeError('directional light with shadow camera and target required');
  const p={...KFB_SHADOW_CONTACT_PROFILE,...options};
  const d=normalize(direction);
  const requested=options.halfM??options.forcedHalfM??clamp((options.focusDistanceM??90)*1.6,p.minHalfM,p.maxHalfM);
  const half=clamp(Math.round(requested/p.snapStepM)*p.snapStepM,p.minHalfM,p.maxHalfM);
  light.shadow.mapSize.set(p.mapSize,p.mapSize);
  const texelM=2*half/p.mapSize;
  light.shadow.bias=p.bias;
  light.shadow.normalBias=texelM*p.normalBiasTexels;
  const cam=light.shadow.camera;
  Object.assign(cam,{left:-half,right:half,top:half,bottom:-half,
    near:Math.max(.1,p.sunDistanceM-Math.max(half*1.25,380)),
    far:p.sunDistanceM+half*1.25+p.nearPaddingM});
  cam.updateProjectionMatrix();
  let e1=normalize(cross(UP,d));
  if(Math.hypot(e1.x,e1.y,e1.z)<.5)e1={x:1,y:0,z:0};
  const e2=normalize(cross(d,e1));
  const a=Math.round(dot(focus,e1)/texelM)*texelM;
  const b=Math.round(dot(focus,e2)/texelM)*texelM;
  const snapped={x:0,y:0,z:0};
  addScaled(snapped,e1,a);addScaled(snapped,e2,b);addScaled(snapped,d,dot(focus,d));
  light.target.position.set(snapped.x,snapped.y,snapped.z);
  light.position.set(snapped.x+d.x*p.sunDistanceM,snapped.y+d.y*p.sunDistanceM,snapped.z+d.z*p.sunDistanceM);
  light.target.updateMatrixWorld();
  return Object.freeze({profile:p.id,halfM:half,texelM,bias:light.shadow.bias,
    normalBias:light.shadow.normalBias,normalBiasTexels:p.normalBiasTexels,mapSize:p.mapSize,
    focus:[focus.x,focus.y,focus.z],snappedFocus:[snapped.x,snapped.y,snapped.z]});
}

export function applyKfbShadowRole(object, role='solid') {
  if(!object?.traverse)throw new TypeError('Object3D required');
  object.traverse(node=>{
    if(!node.isMesh)return;
    if(role==='foliage-blob'){node.castShadow=true;node.receiveShadow=false;}
    else if(role==='overlay'){node.castShadow=false;node.receiveShadow=false;}
    else if(role==='ground'){node.castShadow=false;node.receiveShadow=true;}
    else{node.castShadow=true;node.receiveShadow=true;}
    node.userData.kfbShadowRole=role;
  });
  return object;
}

export function assertNoCoplanarShadowPatch({separationM,label='surface pair'}) {
  if(!Number.isFinite(separationM)||separationM<=.001)
    throw new Error('KFB_COPLANAR_GEOMETRY: '+label+' has <=1mm separation; repair geometry, not shadow bias');
  return true;
}
