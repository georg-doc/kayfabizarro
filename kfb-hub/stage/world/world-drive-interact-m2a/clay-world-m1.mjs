import * as THREE from 'three';
import {makeClayRelief} from './h0-clay/clay-relief.v2.js';
import {makeClayUniforms,makeClayMaterial,setPalette,seedGeometry,PALETTES} from './h0-clay/clay-material.v4.js';
import {KFB_RENDER_PRESET_R0,clayTierValues} from '../../../shared/render/kfb-render-preset.v1.mjs';

const H0_SOURCE={
  id:'KFB_CLAYMATION_H0_HIRNWELT_2026-09-27',
  ref:'georg-doc/kayfabizarro@main',
  modules:['clay-material.v4.js','clay-relief.v2.js','clay-soften.v1.js'],
  geometryPolicy:'consume existing ElasticGrotesqueClayV2 geometry; H0 soften is source-locked but not executed at runtime'
};

function makeReliefTexture(){
  const relief=makeClayRelief({size:512,seed:43129,density:.78});
  const texture=new THREE.DataTexture(relief.data,relief.size,relief.size,THREE.RGBAFormat);
  texture.name='H0 Hirnwelt hand-relief 512';
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.generateMipmaps=true;
  texture.needsUpdate=true;
  return {texture,relief};
}

function layerFor(mesh,terrain,far){
  if(mesh===terrain)return {id:'terrain',scale:1.35,role:'world'};
  if(mesh===far)return {id:'far-terrain',scale:2.65,role:'world'};
  const n=(mesh.name||'').toLowerCase();
  if(n.startsWith('far-shell:'))return {id:'far-city-shell',scale:0,role:'world'};
  if(/wall|building|facade|elasticgrotesque/.test(n))return {id:'facade',scale:2.45,role:'world'};
  if(/roof/.test(n))return {id:'roof',scale:2.05,role:'world'};
  if(/ground|plate|road|curb|path|water/.test(n))return {id:'ground-road-sidewalk',scale:1.35,role:'world'};
  return {id:'prop-detail',scale:.62,role:'soft'};
}

function simplifiedFarClay(source){
  const material=source.clone();
  material.name=(source.name||'city-shell')+' · R4 simplified far clay';
  if('roughness'in material)material.roughness=1;
  if('metalness'in material)material.metalness=0;
  material.onBeforeCompile=()=>{};
  material.customProgramCacheKey=()=> 'kfb-r4-simple-far-clay';
  material.needsUpdate=true;
  return material;
}

function clayMaterialFor(source,U,layer,reliefK){
  return makeClayMaterial(THREE,U,{
    src:source,
    role:layer.role,
    palMap:true,
    reliefK,
    proc:false,
    scale:layer.scale
  });
}

export async function mountClayWorld(app){
  const terrain=app.terrain,city=app.world?.city,far=app.scene.getObjectByName('far-ground');
  if(!terrain||!city?.plate||!city?.group)throw Error('H0 Clay needs the accepted World r2 terrain and city owners');

  const {texture,relief}=makeReliefTexture();
  texture.anisotropy=Math.min(KFB_RENDER_PRESET_R0.clay.maxAnisotropy,app.renderer.capabilities.getMaxAnisotropy?.()||1);
  const uniforms={hero:makeClayUniforms(THREE,texture),world:makeClayUniforms(THREE,texture)};
  for(const value of Object.values(uniforms))setPalette(THREE,value,PALETTES.claybound,.2);
  let detailState='moving';
  function setDetailState(next){
    detailState=next==='stable'?'stable':'moving';
    for(const tier of ['hero','world']){
      const U=uniforms[tier],P=clayTierValues(tier,detailState);
      U.uClayTile.value=P.tile;U.uClayStroke.value=P.stroke;U.uClayGrain.value=P.grain;
      U.uClayMacro.value=P.macro;U.uClayFacet.value=P.facet;U.uClayCrease.value=P.crease;
    }
    document.body.dataset.m2aClayDetail=detailState;
    return detailReport();
  }
  function detailReport(){
    return {schema:'kfb.clay-detail-tier-r0/1',state:detailState,tiers:{hero:clayTierValues('hero',detailState),world:clayTierValues('world',detailState),far:'simplified'},texture:{size:relief.size,mipmaps:texture.generateMipmaps,anisotropy:texture.anisotropy}};
  }
  setDetailState('moving');

  const meshes=[];
  const seen=new Set();
  const add=mesh=>{if(mesh?.isMesh&&!seen.has(mesh)){seen.add(mesh);meshes.push(mesh)}};
  add(terrain);add(far);city.group.traverse(add);

  const records=[];
  const counts={terrain:0,'far-terrain':0,'far-city-shell':0,facade:0,roof:0,'ground-road-sidewalk':0,'prop-detail':0};
  let seed=43129;
  for(const mesh of meshes){
    if(!mesh.geometry?.attributes?.position||mesh.isSkinnedMesh)continue;
    const layer=layerFor(mesh,terrain,far);
    const simplified=layer.id==='far-city-shell'||layer.id==='far-terrain';
    if(!simplified)seedGeometry(THREE,mesh.geometry,seed++);
    const original=mesh.material;
    const tier=layer.id==='prop-detail'?'hero':'world';
    const reliefK=clayTierValues(tier,'stable').relief;
    const clay=simplified
      ? (Array.isArray(original)?original.map(simplifiedFarClay):simplifiedFarClay(original))
      : (Array.isArray(original)
        ? original.map(material=>clayMaterialFor(material,uniforms[tier],layer,reliefK))
        : clayMaterialFor(original,uniforms[tier],layer,reliefK));
    records.push({mesh,original,clay,layer,tier:simplified?'far':tier});
    counts[layer.id]++;
  }
  if(!counts.facade||!counts['ground-road-sidewalk'])throw Error('H0 Clay could not bind facade and street/ground owners');

  const sun=app.scene.children.find(o=>o.isDirectionalLight&&o.castShadow);
  const hemi=app.scene.children.find(o=>o.isHemisphereLight);
  const light0=sun&&hemi?{
    sunColor:sun.color.clone(),sunIntensity:sun.intensity,
    hemiColor:hemi.color.clone(),ground:hemi.groundColor.clone(),hemiIntensity:hemi.intensity,
    mapping:app.renderer.toneMapping,exposure:app.renderer.toneMappingExposure
  }:null;
  const fill=new THREE.DirectionalLight(0xffc7a7,.38);
  fill.name='H0 Hirnwelt warm clay fill';fill.position.set(-10,15,-7);fill.visible=false;app.scene.add(fill);

  let mode='original';
  function setMode(next){
    mode=next==='clay'?'clay':'original';
    const on=mode==='clay';
    for(const r of records)r.mesh.material=on?r.clay:r.original;
    if(light0){
      sun.color.copy(on?new THREE.Color(0xffd0a5):light0.sunColor);sun.intensity=on?2.35:light0.sunIntensity;
      hemi.color.copy(on?new THREE.Color(0xffe5c8):light0.hemiColor);
      hemi.groundColor.copy(on?new THREE.Color(0x55667a):light0.ground);hemi.intensity=on?2.05:light0.hemiIntensity;
      app.renderer.toneMapping=on?THREE.ACESFilmicToneMapping:light0.mapping;
      app.renderer.toneMappingExposure=on?1.08:light0.exposure;
    }
    fill.visible=on;
    document.body.dataset.m1Look=mode;
    return report();
  }
  const heights=(city.support?.records||[]).map(r=>{
    const p=city.blocks.geometry.attributes.position;let lo=Infinity,hi=-Infinity;
    for(let i=r.walls[0];i<r.walls[0]+r.walls[1];i++){lo=Math.min(lo,p.getY(i));hi=Math.max(hi,p.getY(i))}
    return hi-lo;
  }).filter(Number.isFinite);
  function report(){
    return {
      schema:'kfb.h0-hirnwelt-world-adapter/1',mode,world:app.world.id,
      donor:H0_SOURCE,relief:{size:relief.size,seed:relief.seed,ms:relief.ms,source:'clay-relief.v2.js'},
      layers:{coarse:'facades/roofs 2.45/2.05',medium:'terrain/road/sidewalk 1.35',fine:'props .62'},
      boundMeshes:records.length,counts,
      buildingCount:heights.length,
      buildingHeightM:heights.length?[+Math.min(...heights).toFixed(2),+Math.max(...heights).toFixed(2)]:[],
      geometryRuntimePreprocess:false,skinnedMeshesUntouched:true,reversible:true,
      distanceBudget:{fullRelief:'hero props + near terrain/streets/city in bounded hero/world tiers',simplified:'far-city-shell + far-terrain',simplifiedMeshes:counts['far-city-shell']+counts['far-terrain']},
      detail:detailReport(),
      owners:{geometry:'World r2 · ElasticGrotesqueClayV2',material:'H0 Hirnwelt clay-material.v4 + clay-relief.v2',collision:'World r2 ground/contact'}
    };
  }
  const requestedLook=new URLSearchParams(location.search).get('look');
  setMode(requestedLook==='original'?'original':'clay');
  return {setMode,setDetailState,detailReport,report,get mode(){return mode}};
}
