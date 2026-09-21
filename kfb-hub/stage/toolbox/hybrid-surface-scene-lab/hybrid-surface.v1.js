/* KFB Hybrid Surface v0.1-candidate
 *
 * Successor experiment to RGB Triplanar Palette Lab.
 * Keeps each material's original color/map identity and adds ONE shared painterly RGB texture
 * as subtle triplanar modulation.
 *
 * Projection rule:
 *   - static environment: WORLD space (continuous field across modular parts)
 *   - moving/skinned actors: OBJECT space (texture stays attached to the actor)
 *
 * Donor grammar remains media/3D_Assets/pet-surface.v1.js; this does not replace that owner.
 */

const VERSION='0.1-candidate';
const DEFAULT_SKIP=/eye|pupil|iris|mouth|teeth|tooth|tongue|flame|fire|glass/i;

function asMats(mat){return Array.isArray(mat)?mat:[mat]}
function maxColor(c){return Math.max(c?.r||0,c?.g||0,c?.b||0)}

export function makeHybridMaterial(THREE,sourceMaterial,{
  texture,
  projection='object',
  scale=.5,
  strength=.34,
  matte=.82,
  skip=DEFAULT_SKIP
}={}){
  if(!texture)throw new Error('hybrid surface requires one shared texture');
  const src=sourceMaterial;
  const name=(src?.name||'')+'';
  if(!src || skip?.test(name) || src.transparent || src.opacity<.92 || maxColor(src.emissive)>.16){
    return {material:src,decorated:false,reason:'preserved-special'};
  }

  const material=src.clone();
  material.roughness=Math.max(Number.isFinite(src.roughness)?src.roughness:0.5,matte);
  material.metalness=Number.isFinite(src.metalness)?src.metalness:0;
  const uniforms={
    uKfbHybridTex:{value:texture},
    uKfbHybridScale:{value:scale},
    uKfbHybridStrength:{value:strength},
    uKfbProjectionMode:{value:projection==='world'?1:0}
  };
  material.userData.kfbHybrid={
    version:VERSION,
    projection,
    scale,
    strength,
    matte,
    sharedTextureUuid:texture.uuid,
    uniforms,
    sourceMapUuid:src.map?.uuid||null,
    hybridMapUuid:material.map?.uuid||null,
    sourceColor:src.color?.getHexString?.()||null,
    hybridColor:material.color?.getHexString?.()||null,
    shaderCompiled:false
  };
  const prior=material.onBeforeCompile;
  const priorKey=src.customProgramCacheKey?.bind(src);
  material.customProgramCacheKey=()=>`kfb-hybrid-${VERSION}-${projection}-${priorKey?priorKey():''}`;
  material.onBeforeCompile=(shader,renderer)=>{
    if(prior)prior(shader,renderer);
    Object.assign(shader.uniforms,uniforms);
    shader.vertexShader=shader.vertexShader
      .replace('#include <common>','#include <common>\nvarying vec3 vKfbObjP; varying vec3 vKfbObjN; varying vec3 vKfbWorldP; varying vec3 vKfbWorldN;')
      .replace('#include <skinnormal_vertex>','#include <skinnormal_vertex>\n  vKfbObjN=objectNormal; vKfbWorldN=normalize(mat3(modelMatrix)*objectNormal);')
      .replace('#include <displacementmap_vertex>','#include <displacementmap_vertex>\n  vKfbObjP=transformed; vKfbWorldP=(modelMatrix*vec4(transformed,1.0)).xyz;');
    shader.fragmentShader=shader.fragmentShader
      .replace('#include <common>','#include <common>\nvarying vec3 vKfbObjP; varying vec3 vKfbObjN; varying vec3 vKfbWorldP; varying vec3 vKfbWorldN;\nuniform sampler2D uKfbHybridTex; uniform float uKfbHybridScale,uKfbHybridStrength,uKfbProjectionMode;\nvec3 kfbHW(vec3 n){vec3 w=pow(abs(normalize(n)),vec3(2.0));return w/max(w.x+w.y+w.z,1e-4);}\nvec3 kfbHS(sampler2D t,vec3 p,vec3 w){return texture2D(t,p.yz).rgb*w.x+texture2D(t,p.xz).rgb*w.y+texture2D(t,p.xy).rgb*w.z;}')
      .replace('#include <color_fragment>','#include <color_fragment>\n{\n  vec3 kfbP=mix(vKfbObjP,vKfbWorldP,step(0.5,uKfbProjectionMode));\n  vec3 kfbN=normalize(mix(vKfbObjN,vKfbWorldN,step(0.5,uKfbProjectionMode)));\n  vec3 kfbW=kfbHW(kfbN);\n  vec3 kfbA=kfbHS(uKfbHybridTex,kfbP*uKfbHybridScale,kfbW);\n  vec3 kfbB=kfbHS(uKfbHybridTex,kfbP*uKfbHybridScale*0.31+vec3(7.13,3.71,11.27),kfbW);\n  vec3 kfbM=mix(kfbA,kfbB,0.24);\n  float kfbL=dot(kfbM,vec3(0.299,0.587,0.114));\n  float kfbV=mix(0.82,1.10,smoothstep(0.08,0.86,kfbL));\n  float kfbGrime=1.0-smoothstep(0.16,0.52,kfbL);\n  vec3 kfbTint=vec3(0.965+0.055*kfbM.r,0.955+0.050*kfbM.g,0.935+0.045*kfbM.b);\n  vec3 kfbPainted=diffuseColor.rgb*kfbV*kfbTint*(1.0-0.10*kfbGrime);\n  diffuseColor.rgb=mix(diffuseColor.rgb,kfbPainted,clamp(uKfbHybridStrength,0.0,1.0));\n}');
    material.userData.kfbHybrid.shaderCompiled=true;
    material.userData.kfbHybrid.shader=shader;
  };
  material.needsUpdate=true;
  return {material,decorated:true,reason:'hybrid'};
}

export function prepareHybridObject(THREE,root,options={}){
  const records=[];let meshes=0,decorated=0,preserved=0,mapsPreserved=0,colorsPreserved=0;
  root.traverse(node=>{
    if(!node.isMesh)return;
    meshes++;
    const originals=asMats(node.material);
    const hybrids=[];
    for(const src of originals){
      const rec=makeHybridMaterial(THREE,src,options);
      hybrids.push(rec.material);
      if(rec.decorated){
        decorated++;
        const h=rec.material.userData.kfbHybrid;
        if(h.sourceMapUuid===h.hybridMapUuid)mapsPreserved++;
        if(h.sourceColor===h.hybridColor)colorsPreserved++;
      }else preserved++;
    }
    node.userData.kfbOriginalMaterial=node.material;
    node.userData.kfbHybridMaterial=Array.isArray(node.material)?hybrids:hybrids[0];
    records.push({node,original:node.material,hybrid:node.userData.kfbHybridMaterial});
    node.castShadow=true;node.receiveShadow=true;
  });
  return{root,records,stats:{meshes,decorated,preserved,mapsPreserved,colorsPreserved,projection:options.projection||'object',sharedTextureUuid:options.texture?.uuid||null}};
}

export function setHybridMode(prepared,on){
  for(const rec of prepared.records)rec.node.material=on?rec.hybrid:rec.original;
}

export function setHybridParams(prepared,{scale,strength,matte}={}){
  for(const rec of prepared.records){
    for(const m of asMats(rec.hybrid)){
      const h=m?.userData?.kfbHybrid;if(!h)continue;
      if(Number.isFinite(scale)){h.scale=scale;h.uniforms.uKfbHybridScale.value=scale}
      if(Number.isFinite(strength)){h.strength=strength;h.uniforms.uKfbHybridStrength.value=strength}
      if(Number.isFinite(matte)){h.matte=matte;m.roughness=Math.max(m.roughness,matte)}
    }
  }
}

export function hybridStats(prepared){
  let compiled=0,total=0;const textureUuids=new Set(),projections=new Set();
  for(const rec of prepared.records)for(const m of asMats(rec.hybrid)){
    const h=m?.userData?.kfbHybrid;if(!h)continue;total++;if(h.shaderCompiled)compiled++;textureUuids.add(h.sharedTextureUuid);projections.add(h.projection);
  }
  return{...prepared.stats,materials:total,compiled,textureUuids:[...textureUuids],projections:[...projections]};
}
