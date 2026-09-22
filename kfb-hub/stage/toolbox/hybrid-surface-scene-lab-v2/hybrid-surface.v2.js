/* KFB Hybrid Surface v2 · clay/grain candidate
 *
 * Bounded successor to the public Hybrid Surface v1 proof.
 * - preserves source base color / maps / roughness / metalness
 * - one shared painterly RGB texture for broad macro variation
 * - seam-soft triplanar macro field
 * - procedural 3D clay grain (no second texture, no projection seam)
 * - source roughness is modulated in-shader, never globally clamped
 *
 * Existing owners are unchanged. Donor projection grammar:
 * media/3D_Assets/pet-surface.v1.js
 */

const VERSION='0.2-candidate';
const DEFAULT_SKIP=/eye|pupil|iris|mouth|teeth|tooth|tongue|flame|fire|glass/i;

const asMats=mat=>Array.isArray(mat)?mat:[mat];
const maxColor=c=>Math.max(c?.r||0,c?.g||0,c?.b||0);

export function makeHybridV2Material(THREE,sourceMaterial,{
  texture,
  projection='object',
  macroScale=.12,
  grainScale=7.0,
  strength=.56,
  grainStrength=.34,
  roughnessStrength=.28,
  skip=DEFAULT_SKIP
}={}){
  if(!texture)throw new Error('hybrid v2 requires one shared texture');
  const src=sourceMaterial;
  const name=(src?.name||'')+'';
  if(!src || skip?.test(name) || src.transparent || src.opacity<.92 || maxColor(src.emissive)>.16){
    return {material:src,decorated:false,reason:'preserved-special'};
  }

  const material=src.clone();
  const sourceRoughness=Number.isFinite(src.roughness)?src.roughness:null;
  const sourceMetalness=Number.isFinite(src.metalness)?src.metalness:null;
  if(sourceRoughness!==null)material.roughness=sourceRoughness;
  if(sourceMetalness!==null)material.metalness=sourceMetalness;

  const uniforms={
    uKfbSurfaceTex:{value:texture},
    uKfbMacroScale:{value:macroScale},
    uKfbGrainScale:{value:grainScale},
    uKfbSurfaceStrength:{value:strength},
    uKfbGrainStrength:{value:grainStrength},
    uKfbRoughnessStrength:{value:roughnessStrength},
    uKfbProjectionMode:{value:projection==='world'?1:0}
  };

  material.userData.kfbHybridV2={
    version:VERSION,
    projection,
    macroScale,grainScale,strength,grainStrength,roughnessStrength,
    sharedTextureUuid:texture.uuid,
    uniforms,
    sourceMapUuid:src.map?.uuid||null,
    hybridMapUuid:material.map?.uuid||null,
    sourceColor:src.color?.getHexString?.()||null,
    hybridColor:material.color?.getHexString?.()||null,
    sourceRoughness,
    hybridBaseRoughness:Number.isFinite(material.roughness)?material.roughness:null,
    sourceMetalness,
    hybridBaseMetalness:Number.isFinite(material.metalness)?material.metalness:null,
    shaderCompiled:false
  };

  const prior=material.onBeforeCompile;
  const priorKey=src.customProgramCacheKey?.bind(src);
  material.customProgramCacheKey=()=>`kfb-hybrid-v2-${VERSION}-${projection}-${priorKey?priorKey():''}`;

  material.onBeforeCompile=(shader,renderer)=>{
    if(prior)prior(shader,renderer);
    Object.assign(shader.uniforms,uniforms);

    shader.vertexShader=shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vKfbObjP; varying vec3 vKfbObjN; varying vec3 vKfbWorldP; varying vec3 vKfbWorldN;'
      )
      .replace(
        '#include <skinnormal_vertex>',
        '#include <skinnormal_vertex>\n  vKfbObjN=objectNormal; vKfbWorldN=normalize(mat3(modelMatrix)*objectNormal);'
      )
      .replace(
        '#include <displacementmap_vertex>',
        '#include <displacementmap_vertex>\n  vKfbObjP=transformed; vKfbWorldP=(modelMatrix*vec4(transformed,1.0)).xyz;'
      );

    const pars=`
varying vec3 vKfbObjP; varying vec3 vKfbObjN; varying vec3 vKfbWorldP; varying vec3 vKfbWorldN;
uniform sampler2D uKfbSurfaceTex;
uniform float uKfbMacroScale,uKfbGrainScale,uKfbSurfaceStrength,uKfbGrainStrength,uKfbRoughnessStrength,uKfbProjectionMode;

vec3 kfbTriWeights(vec3 n){
  vec3 w=pow(abs(normalize(n))+vec3(1e-4),vec3(1.18));
  return w/max(w.x+w.y+w.z,1e-4);
}
vec3 kfbTriSample(sampler2D t,vec3 p,vec3 n){
  vec3 nn=normalize(n);
  vec3 w=kfbTriWeights(nn);
  vec2 uvX=p.zy;
  vec2 uvY=p.xz;
  vec2 uvZ=p.xy;
  if(nn.x<0.0)uvX.x=-uvX.x;
  if(nn.y<0.0)uvY.x=-uvY.x;
  if(nn.z>0.0)uvZ.x=-uvZ.x;
  return texture2D(t,uvX).rgb*w.x+texture2D(t,uvY).rgb*w.y+texture2D(t,uvZ).rgb*w.z;
}
float kfbHash31(vec3 p){
  p=fract(p*0.1031);
  p+=dot(p,p.yzx+33.33);
  return fract((p.x+p.y)*p.z);
}
float kfbNoise3(vec3 p){
  vec3 i=floor(p),f=fract(p);
  f=f*f*(3.0-2.0*f);
  float n000=kfbHash31(i+vec3(0,0,0));
  float n100=kfbHash31(i+vec3(1,0,0));
  float n010=kfbHash31(i+vec3(0,1,0));
  float n110=kfbHash31(i+vec3(1,1,0));
  float n001=kfbHash31(i+vec3(0,0,1));
  float n101=kfbHash31(i+vec3(1,0,1));
  float n011=kfbHash31(i+vec3(0,1,1));
  float n111=kfbHash31(i+vec3(1,1,1));
  float x00=mix(n000,n100,f.x),x10=mix(n010,n110,f.x);
  float x01=mix(n001,n101,f.x),x11=mix(n011,n111,f.x);
  return mix(mix(x00,x10,f.y),mix(x01,x11,f.y),f.z);
}
float kfbFbm3(vec3 p){
  return kfbNoise3(p)*0.58+kfbNoise3(p*2.07+vec3(4.7,1.3,8.1))*0.29+kfbNoise3(p*4.11+vec3(2.2,7.4,3.9))*0.13;
}
vec3 kfbSurfaceP(){return mix(vKfbObjP,vKfbWorldP,step(0.5,uKfbProjectionMode));}
vec3 kfbSurfaceN(){return normalize(mix(vKfbObjN,vKfbWorldN,step(0.5,uKfbProjectionMode)));}
float kfbMacro(vec3 p,vec3 n){
  vec3 a=kfbTriSample(uKfbSurfaceTex,p*uKfbMacroScale,n);
  vec3 b=kfbTriSample(uKfbSurfaceTex,p*uKfbMacroScale*0.37+vec3(5.37,11.19,2.71),n);
  float texL=dot(mix(a,b,0.28),vec3(0.299,0.587,0.114));
  float volume=kfbFbm3(p*uKfbMacroScale*1.7+vec3(13.2,4.1,9.7));
  return mix(texL,volume,0.30);
}
float kfbGrain(vec3 p){
  float g=kfbFbm3(p*uKfbGrainScale+vec3(17.3,5.9,2.1));
  float tooth=abs(g-0.5)*2.0;
  return clamp(mix(g,tooth,0.34),0.0,1.0);
}
`;

    shader.fragmentShader=shader.fragmentShader
      .replace('#include <common>','#include <common>\n'+pars)
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
{
  vec3 kfbP=kfbSurfaceP();
  vec3 kfbN=kfbSurfaceN();
  float kfbM=kfbMacro(kfbP,kfbN);
  float kfbG=kfbGrain(kfbP);
  float kfbMacroDelta=(kfbM-0.5)*0.42;
  float kfbGrainDelta=(kfbG-0.5)*0.18*uKfbGrainStrength;
  float kfbGrime=1.0-smoothstep(0.18,0.52,kfbM);
  vec3 kfbWarm=mix(vec3(0.955,0.935,0.905),vec3(1.035,1.018,0.985),kfbM);
  vec3 kfbPainted=diffuseColor.rgb*(1.0+kfbMacroDelta+kfbGrainDelta)*kfbWarm*(1.0-0.07*kfbGrime);
  diffuseColor.rgb=mix(diffuseColor.rgb,kfbPainted,clamp(uKfbSurfaceStrength,0.0,1.0));
}`
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
{
  vec3 kfbRP=kfbSurfaceP();
  float kfbRG=kfbGrain(kfbRP);
  float kfbRoughMul=mix(0.90,1.22,kfbRG);
  float kfbTarget=clamp(roughnessFactor*kfbRoughMul,0.02,1.0);
  roughnessFactor=mix(roughnessFactor,kfbTarget,clamp(uKfbRoughnessStrength*uKfbSurfaceStrength,0.0,1.0));
}`
      );

    material.userData.kfbHybridV2.shaderCompiled=true;
    material.userData.kfbHybridV2.shader=shader;
  };

  material.needsUpdate=true;
  return {material,decorated:true,reason:'hybrid-v2'};
}

export function prepareHybridV2Object(THREE,root,options={}){
  const records=[];
  let meshes=0,decorated=0,preserved=0,mapsPreserved=0,colorsPreserved=0,roughnessPreserved=0,metalnessPreserved=0;

  root.traverse(node=>{
    if(!node.isMesh)return;
    meshes++;
    const originals=asMats(node.material);
    const hybrids=[];

    for(const src of originals){
      const rec=makeHybridV2Material(THREE,src,options);
      hybrids.push(rec.material);

      if(rec.decorated){
        decorated++;
        const h=rec.material.userData.kfbHybridV2;
        if(h.sourceMapUuid===h.hybridMapUuid)mapsPreserved++;
        if(h.sourceColor===h.hybridColor)colorsPreserved++;
        if(h.sourceRoughness===h.hybridBaseRoughness)roughnessPreserved++;
        if(h.sourceMetalness===h.hybridBaseMetalness)metalnessPreserved++;
      }else preserved++;
    }

    node.userData.kfbOriginalMaterial=node.material;
    node.userData.kfbHybridV2Material=Array.isArray(node.material)?hybrids:hybrids[0];
    records.push({node,original:node.material,hybrid:node.userData.kfbHybridV2Material});
    node.castShadow=true;
    node.receiveShadow=true;
  });

  return {
    root,records,
    stats:{
      meshes,decorated,preserved,mapsPreserved,colorsPreserved,roughnessPreserved,metalnessPreserved,
      projection:options.projection||'object',
      sharedTextureUuid:options.texture?.uuid||null
    }
  };
}

export function setHybridV2Mode(prepared,on){
  for(const rec of prepared.records)rec.node.material=on?rec.hybrid:rec.original;
}

export function setHybridV2Params(prepared,{macroScale,grainScale,strength,grainStrength,roughnessStrength}={}){
  for(const rec of prepared.records){
    for(const m of asMats(rec.hybrid)){
      const h=m?.userData?.kfbHybridV2;
      if(!h)continue;
      if(Number.isFinite(macroScale)){h.macroScale=macroScale;h.uniforms.uKfbMacroScale.value=macroScale}
      if(Number.isFinite(grainScale)){h.grainScale=grainScale;h.uniforms.uKfbGrainScale.value=grainScale}
      if(Number.isFinite(strength)){h.strength=strength;h.uniforms.uKfbSurfaceStrength.value=strength}
      if(Number.isFinite(grainStrength)){h.grainStrength=grainStrength;h.uniforms.uKfbGrainStrength.value=grainStrength}
      if(Number.isFinite(roughnessStrength)){h.roughnessStrength=roughnessStrength;h.uniforms.uKfbRoughnessStrength.value=roughnessStrength}
    }
  }
}

export function hybridV2Stats(prepared){
  let compiled=0,total=0,visibleMaterials=0,visibleCompiled=0;
  const textureUuids=new Set(),projections=new Set(),sourceRoughness=[],hybridBaseRoughness=[];

  for(const rec of prepared.records)for(const m of asMats(rec.hybrid)){
    const h=m?.userData?.kfbHybridV2;
    if(!h)continue;
    total++;
    if(h.shaderCompiled)compiled++;
    if(rec.node.visible!==false){visibleMaterials++;if(h.shaderCompiled)visibleCompiled++}
    textureUuids.add(h.sharedTextureUuid);
    projections.add(h.projection);
    if(Number.isFinite(h.sourceRoughness))sourceRoughness.push(h.sourceRoughness);
    if(Number.isFinite(h.hybridBaseRoughness))hybridBaseRoughness.push(h.hybridBaseRoughness);
  }

  return {
    ...prepared.stats,
    materials:total,compiled,visibleMaterials,visibleCompiled,
    textureUuids:[...textureUuids],projections:[...projections],
    sourceRoughness,hybridBaseRoughness
  };
}
