/* KFB RGB Triplanar Palette v0.1-candidate
 *
 * Additive ToolBox material experiment. It reuses the triplanar projection grammar from
 * media/3D_Assets/pet-surface.v1.js (donor blob ceffefe20ec46d82f6c0da0d6369be53f7ea4b24)
 * and adds exactly one new seam: RGB channels become palette weights.
 *
 * This module does not replace pet-surface.v1.js or any actor/material owner.
 */

const VERSION='0.1-candidate';

function mulberry32(seed){
  let a=seed>>>0;
  return()=>{a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296};
}

function paintStroke(ctx,rng,channel,size){
  const colors=['rgba(255,0,0,.28)','rgba(0,255,0,.28)','rgba(0,0,255,.28)'];
  const x0=rng()*size,y0=rng()*size;
  const x1=rng()*size,y1=rng()*size;
  const cx=(x0+x1)*.5+(rng()-.5)*size*.42;
  const cy=(y0+y1)*.5+(rng()-.5)*size*.42;
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(cx,cy,x1,y1);
  ctx.strokeStyle=colors[channel];ctx.lineWidth=size*(.06+rng()*.13);ctx.globalAlpha=.82+rng()*.18;ctx.stroke();
}

export function createRgbBrushTexture(THREE,{size=256,seed=0x4b4642}={}){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
  const ctx=canvas.getContext('2d',{alpha:false,willReadFrequently:true});
  ctx.fillStyle='rgb(32,32,32)';ctx.fillRect(0,0,size,size);
  ctx.lineCap='round';ctx.lineJoin='round';ctx.globalCompositeOperation='screen';
  const rng=mulberry32(seed);
  for(let pass=0;pass<4;pass++)for(let channel=0;channel<3;channel++)for(let i=0;i<9;i++)paintStroke(ctx,rng,channel,size);
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.15;
  for(let i=0;i<18;i++){
    const x=rng()*size,y=rng()*size,r=size*(.025+rng()*.08);
    const g=ctx.createRadialGradient(x,y,0,x,y,r);const c=i%3;
    const rgb=c===0?'255,0,0':c===1?'0,255,0':'0,0,255';
    g.addColorStop(0,`rgba(${rgb},.55)`);g.addColorStop(1,`rgba(${rgb},0)`);
    ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
  }
  ctx.globalAlpha=1;
  const texture=new THREE.CanvasTexture(canvas);
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.colorSpace=THREE.NoColorSpace;
  texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.generateMipmaps=true;
  texture.anisotropy=8;
  texture.name='KFB_RGB_TRIPLANAR_SINGLE_TEXTURE';
  texture.needsUpdate=true;
  return{texture,canvas,seed,size};
}

function clearTextureSlots(material){
  const slots=['map','alphaMap','aoMap','bumpMap','displacementMap','emissiveMap','envMap','lightMap','metalnessMap','normalMap','roughnessMap'];
  const removed=[];
  for(const key of slots){if(material[key]){removed.push(key);material[key]=null}}
  return removed;
}

function asColor(THREE,value){return value?.isColor?value.clone():new THREE.Color(value)}

export function decorateRgbTriplanarMaterial(THREE,sourceMaterial,{texture,palette=['#21160f','#b76432','#ead89d'],scale=1.35,strength=1}={}){
  if(!texture)throw new Error('RGB triplanar texture required');
  const material=sourceMaterial.clone();
  const removedTextureSlots=clearTextureSlots(material);
  if(material.color)material.color.set(0xffffff);
  if(material.emissive)material.emissive.set(0x000000);
  material.vertexColors=false;
  material.roughness=Number.isFinite(material.roughness)?Math.max(.55,material.roughness):.86;
  material.metalness=Number.isFinite(material.metalness)?Math.min(.18,material.metalness):0;
  const uniforms={
    uKfbRgbTex:{value:texture},
    uKfbTriScale:{value:scale},
    uKfbPatternStrength:{value:strength},
    uKfbColorR:{value:asColor(THREE,palette[0])},
    uKfbColorG:{value:asColor(THREE,palette[1])},
    uKfbColorB:{value:asColor(THREE,palette[2])}
  };
  material.userData.kfbRgbTri={version:VERSION,uniforms,removedTextureSlots,shaderCompiled:false,sharedTextureUuid:texture.uuid};
  const sourceKey=sourceMaterial.customProgramCacheKey?.bind(sourceMaterial);
  material.customProgramCacheKey=()=>`kfb-rgb-tri-${VERSION}-${sourceKey?sourceKey():''}`;
  const prior=material.onBeforeCompile;
  material.onBeforeCompile=(shader,renderer)=>{
    if(prior)prior(shader,renderer);
    Object.assign(shader.uniforms,uniforms);
    shader.vertexShader=shader.vertexShader
      .replace('#include <common>','#include <common>\nvarying vec3 vKfbTriP;\nvarying vec3 vKfbTriN;')
      .replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\n  vKfbTriN = objectNormal;')
      .replace('#include <begin_vertex>','#include <begin_vertex>\n  vKfbTriP = transformed;');
    shader.fragmentShader=shader.fragmentShader
      .replace('#include <common>','#include <common>\nvarying vec3 vKfbTriP; varying vec3 vKfbTriN;\nuniform sampler2D uKfbRgbTex; uniform float uKfbTriScale,uKfbPatternStrength; uniform vec3 uKfbColorR,uKfbColorG,uKfbColorB;\nvec3 kfbTriW(vec3 n){ vec3 w=pow(abs(normalize(n)),vec3(2.0)); return w/max(w.x+w.y+w.z,1e-4); }\nvec4 kfbTriSample(sampler2D t,vec3 p,vec3 w){ return texture2D(t,p.yz)*w.x+texture2D(t,p.xz)*w.y+texture2D(t,p.xy)*w.z; }')
      .replace('#include <color_fragment>','#include <color_fragment>\n{ vec3 kfbW=kfbTriW(vKfbTriN); vec3 kfbM=max(kfbTriSample(uKfbRgbTex,vKfbTriP*uKfbTriScale,kfbW).rgb,vec3(0.001)); float kfbS=max(kfbM.r+kfbM.g+kfbM.b,0.001); vec3 kfbC=(kfbM.r*uKfbColorR+kfbM.g*uKfbColorG+kfbM.b*uKfbColorB)/kfbS; diffuseColor.rgb*=mix(vec3(1.0),kfbC,clamp(uKfbPatternStrength,0.0,1.0)); }');
    material.userData.kfbRgbTri.shaderCompiled=true;
    material.userData.kfbRgbTri.shader=shader;
  };
  material.needsUpdate=true;
  return material;
}

export function applyRgbTriplanarToObject(THREE,root,options={}){
  const materials=[];let meshes=0,removedTextureSlots=0;
  root.traverse(node=>{
    if(!node.isMesh)return;
    meshes++;
    const src=Array.isArray(node.material)?node.material:[node.material];
    const next=src.map(m=>{
      const out=decorateRgbTriplanarMaterial(THREE,m,options);
      materials.push(out);removedTextureSlots+=out.userData.kfbRgbTri.removedTextureSlots.length;return out;
    });
    node.material=Array.isArray(node.material)?next:next[0];
    node.castShadow=true;node.receiveShadow=true;
  });
  return{root,materials,meshes,removedTextureSlots};
}

export function setRgbTriplanarPalette(materials,THREE,palette){
  for(const material of materials){
    const u=material.userData?.kfbRgbTri?.uniforms;if(!u)continue;
    u.uKfbColorR.value.copy(asColor(THREE,palette[0]));
    u.uKfbColorG.value.copy(asColor(THREE,palette[1]));
    u.uKfbColorB.value.copy(asColor(THREE,palette[2]));
  }
}

export function setRgbTriplanarScale(materials,scale){for(const m of materials){const u=m.userData?.kfbRgbTri?.uniforms;if(u)u.uKfbTriScale.value=scale}}

export default{createRgbBrushTexture,decorateRgbTriplanarMaterial,applyRgbTriplanarToObject,setRgbTriplanarPalette,setRgbTriplanarScale};
