import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {buildEars} from '../kfb-rigs-embed-v3/frizzlegraft-v1/ears.v2.js';

export const SCHEMA='kfb.rabbit-ear-style/0.1-candidate';
const FB_URL=new URL('../kfb-rigs-embed-v3/petstudio-v9/assets/models/FrizzleBob_Yellow.gltf',import.meta.url).href;
let donorCache=null;

async function donorColors(THREE,loader){
  donorCache ||= loader.loadAsync(FB_URL);
  const gltf=await donorCache;
  const found={};
  gltf.scene.traverse(o=>{
    if(!o.isMesh)return;
    for(const m of [].concat(o.material||[])){
      if(!m?.color||!m.name)continue;
      if(m.name==='Main'||m.name==='Main_Light')found[m.name]=m.color.clone();
    }
  });
  return {
    outer:found.Main||new THREE.Color(0xf2c83c),
    inner:found.Main_Light||new THREE.Color(0xe6b671)
  };
}

function smoothGeometry(THREE,source,{iterations=2,strength=.13}={}){
  let g=mergeVertices(source.clone(),1e-4);
  if(!g.index)g=g.toNonIndexed();
  if(!g.index){g.computeVertexNormals();return g;}
  const pos=g.attributes.position;
  const n=pos.count,adj=Array.from({length:n},()=>new Set());
  const ix=g.index;
  for(let i=0;i<ix.count;i+=3){
    const a=ix.getX(i),b=ix.getX(i+1),c=ix.getX(i+2);
    adj[a].add(b).add(c);adj[b].add(a).add(c);adj[c].add(a).add(b);
  }
  let cur=Float32Array.from(pos.array);
  for(let it=0;it<iterations;it++){
    const next=Float32Array.from(cur);
    for(let i=0;i<n;i++){
      const ns=adj[i];if(!ns.size)continue;
      let ax=0,ay=0,az=0;
      for(const j of ns){ax+=cur[j*3];ay+=cur[j*3+1];az+=cur[j*3+2];}
      ax/=ns.size;ay/=ns.size;az/=ns.size;
      next[i*3]=cur[i*3]+(ax-cur[i*3])*strength;
      next[i*3+1]=cur[i*3+1]+(ay-cur[i*3+1])*strength*.45;
      next[i*3+2]=cur[i*3+2]+(az-cur[i*3+2])*strength;
    }
    cur=next;
  }
  pos.array.set(cur);pos.needsUpdate=true;
  g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
  return g;
}

function makeInnerZone(THREE,outerGeo,color,{innerWidth=.60,innerLength=.80,depth=.92}={}){
  const geo=outerGeo.clone();geo.computeBoundingBox();
  const bb=geo.boundingBox,size=bb.getSize(new THREE.Vector3());
  const mat=new THREE.MeshStandardMaterial({
    color,roughness:.86,metalness:0,
    polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1
  });
  const mesh=new THREE.Mesh(geo,mat);
  mesh.name='kfb-inner-ear-zone';
  mesh.userData.kfbEarStyleZone='inner';
  mesh.scale.set(innerWidth,innerLength,depth);
  mesh.position.y=size.y*(1-innerLength)*.42;
  mesh.position.z=Math.max(.003,size.z*.06);
  mesh.castShadow=true;
  return mesh;
}

export async function buildCartoonEars({
  THREE,loader,host,place={},outerColor=null,innerColor=null,
  innerWidth=.60,innerLength=.80,smoothIterations=2,smoothStrength=.13,log=()=>{}
}={}){
  if(!THREE||!loader||!host)return {status:'UNSUPPORTED',reason:'missing THREE/loader/host'};
  const colors=await donorColors(THREE,loader);
  const outer=outerColor?new THREE.Color(outerColor):colors.outer.clone();
  const inner=innerColor?new THREE.Color(innerColor):colors.inner.clone();

  const base=await buildEars({THREE,loader,host,color:outer,place,log});
  if(base.status!=='OK')return base;

  const innerMeshes=[];
  const outerMeshes=[];
  base.group.traverse(o=>{
    if(!o.isMesh||!/^ear[LR]$/.test(o.name||''))return;
    outerMeshes.push(o);
    const old=o.geometry;
    const rounded=smoothGeometry(THREE,old,{iterations:smoothIterations,strength:smoothStrength});
    o.geometry=rounded;old.dispose();
    o.material=o.material.clone();
    o.material.color.copy(outer);o.material.roughness=.84;o.material.metalness=0;o.material.flatShading=false;o.material.needsUpdate=true;
    const inset=makeInnerZone(THREE,rounded,inner,{innerWidth,innerLength});
    o.add(inset);innerMeshes.push(inset);
  });

  const report={
    status:'OK',schema:SCHEMA,donorSchema:base.schema,
    outerColor:'#'+outer.getHexString(),
    innerColor:'#'+inner.getHexString(),
    outerMeshes:outerMeshes.length,innerZones:innerMeshes.length,
    innerWidth,innerLength,smoothIterations,smoothStrength,
    behaviorOwner:'kfb.ears/0.2'
  };
  log('Rabbit ears cartoon style · '+report.outerColor+' / '+report.innerColor+' · '+innerMeshes.length+' inner zones');

  return {
    status:'OK',schema:SCHEMA,group:base.group,report,
    update:dt=>base.update(dt),
    setOuterColor(hex){outer.set(hex);for(const m of outerMeshes)m.material.color.copy(outer);report.outerColor='#'+outer.getHexString()},
    setInnerColor(hex){inner.set(hex);for(const m of innerMeshes)m.material.color.copy(inner);report.innerColor='#'+inner.getHexString()},
    setInnerWidth(v){for(const m of innerMeshes)m.scale.x=v;report.innerWidth=v},
    dispose(){
      for(const m of innerMeshes){m.geometry?.dispose?.();m.material?.dispose?.();}
      for(const m of outerMeshes)m.material?.dispose?.();
      base.dispose();
    }
  };
}

export async function measuredFrizzleEarColors({THREE,loader}={}){
  const c=await donorColors(THREE,loader);
  return {outer:'#'+c.outer.getHexString(),inner:'#'+c.inner.getHexString(),source:FB_URL};
}

export default buildCartoonEars;
