import * as THREE from 'three';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const finite=(v,d=0)=>Number.isFinite(v)?v:d;

export function buildHeightfieldMesh(heightAt,rect,step=1){
  if(typeof heightAt!=='function')throw Error('heightAt required');
  const minX=finite(rect?.minX),maxX=finite(rect?.maxX),minZ=finite(rect?.minZ),maxZ=finite(rect?.maxZ);
  if(!(maxX>minX&&maxZ>minZ))throw Error('valid contact rect required');
  const dx=Math.max(.35,finite(step,1));
  const nx=Math.ceil((maxX-minX)/dx)+1,nz=Math.ceil((maxZ-minZ)/dx)+1;
  const vertices=new Float32Array(nx*nz*3);
  for(let iz=0;iz<nz;iz++){
    const z=iz===nz-1?maxZ:Math.min(maxZ,minZ+iz*dx);
    for(let ix=0;ix<nx;ix++){
      const x=ix===nx-1?maxX:Math.min(maxX,minX+ix*dx),k=(iz*nx+ix)*3;
      vertices[k]=x;vertices[k+1]=finite(heightAt(x,z));vertices[k+2]=z;
    }
  }
  const indices=new Uint32Array((nx-1)*(nz-1)*6);let k=0;
  for(let iz=0;iz<nz-1;iz++)for(let ix=0;ix<nx-1;ix++){
    const a=iz*nx+ix,b=a+1,c=a+nx,d=c+1;
    indices[k++]=a;indices[k++]=c;indices[k++]=b;
    indices[k++]=b;indices[k++]=c;indices[k++]=d;
  }
  return {vertices,indices,step:dx,nx,nz,triangles:indices.length/3};
}

export function collectReactiveProps(sceneObjects){
  const surfaces=[],records=new Map(),values=sceneObjects instanceof Map?[...sceneObjects.values()]:Array.from(sceneObjects||[]);
  let n=0;
  for(const root of values){
    if(!root?.isObject3D||root.visible===false||root.userData?.kind!=='prop')continue;
    root.updateMatrixWorld(true);
    const box=new THREE.Box3().setFromObject(root);if(box.isEmpty())continue;
    const size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),largest=Math.max(size.x,size.y,size.z);
    if(largest<.2||largest>12||size.y<.15)continue;
    const id='world-reactive-prop-'+(++n);
    surfaces.push({id,shape:'box',kind:'reactive-prop',road:false,p:[center.x,center.y,center.z],size:[Math.max(.18,size.x),Math.max(.18,size.y),Math.max(.18,size.z)],restitution:.14});
    records.set(id,{root,basePos:root.position.clone(),baseQuat:root.quaternion.clone(),state:null});
    if(n>=36)break;
  }
  return {surfaces,records};
}

function terrainNormal(heightAt,x,z){
  const e=.35,hL=heightAt(x-e,z),hR=heightAt(x+e,z),hD=heightAt(x,z-e),hU=heightAt(x,z+e);
  return new THREE.Vector3(-(hR-hL)/(2*e),1,-(hU-hD)/(2*e)).normalize();
}

function patchCityMesh(mesh,U){
  if(!mesh?.isMesh||!mesh.material)return 0;
  const patch=mat=>{
    if(!mat||mat.visible===false||mat.colorWrite===false)return mat;
    const m=mat.clone(),prev=m.onBeforeCompile;
    m.onBeforeCompile=sh=>{
      if(prev)prev(sh);
      Object.assign(sh.uniforms,U);
      sh.vertexShader=sh.vertexShader
        .replace('void main() {','uniform vec3 kfbImpactPos;\nuniform vec3 kfbImpactDir;\nuniform float kfbImpactAmp;\nuniform float kfbImpactRadius;\nvoid main() {')
        .replace('#include <begin_vertex>',`#include <begin_vertex>
float kfbImpactD = distance(position, kfbImpactPos);
float kfbImpactW = 1.0 - smoothstep(0.0, max(0.001, kfbImpactRadius), kfbImpactD);
transformed += kfbImpactDir * (kfbImpactAmp * kfbImpactW);`);
    };
    m.customProgramCacheKey=()=>('kfb-world-impact-r0b-'+(prev?String(prev).length:0));
    m.needsUpdate=true;return m;
  };
  mesh.material=Array.isArray(mesh.material)?mesh.material.map(patch):patch(mesh.material);
  return 1;
}

export function createWorldCollisionPresentation({scene,world,heightAt,reactiveProps}){
  if(!scene||!world||typeof heightAt!=='function')throw Error('world collision presentation needs scene/world/heightAt');
  const markRoot=new THREE.Group();markRoot.name='R0B temporary tyre tracks + impact impressions';scene.add(markRoot);
  const trackGeo=new THREE.PlaneGeometry(.18,.72),dentGeo=new THREE.RingGeometry(.12,.62,18);
  const marks=[],maxMarks=72;
  const propRecords=reactiveProps?.records||new Map();
  const city=world.city||null;
  const U={
    kfbImpactPos:{value:new THREE.Vector3(1e6,1e6,1e6)},
    kfbImpactDir:{value:new THREE.Vector3()},
    kfbImpactAmp:{value:0},
    kfbImpactRadius:{value:4}
  };
  let cityMeshes=0,cityHit=null;
  if(city){
    const roots=[city.blocks,city.roofs,city.shells,city.details].filter(Boolean);
    const seen=new Set();
    for(const root of roots)root.traverse?.(m=>{if(m.isMesh&&!seen.has(m)){seen.add(m);cityMeshes+=patchCityMesh(m,U)}});
  }

  function material(opacity=.2){
    return new THREE.MeshStandardMaterial({color:0x5a4038,roughness:1,metalness:0,transparent:true,opacity,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3,side:THREE.DoubleSide});
  }
  function addMark(mesh,life){
    mesh.renderOrder=4;markRoot.add(mesh);marks.push({mesh,life,maxLife:life});
    while(marks.length>maxMarks){const old=marks.shift();old.mesh.removeFromParent();old.mesh.material.dispose()}
  }
  function orientPlane(mesh,point,normal,heading=0){
    const n=normal.clone().normalize(),f=new THREE.Vector3(Math.sin(heading),0,Math.cos(heading));
    f.addScaledVector(n,-f.dot(n));if(f.lengthSq()<1e-5)f.set(0,0,1);f.normalize();
    const right=n.clone().cross(f).normalize();
    mesh.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right,f,n));
    mesh.position.copy(point).addScaledVector(n,.018);
  }
  function wheelTrack({point,heading=0,strength=.25}){
    const p=point.clone?point.clone():new THREE.Vector3(point.x,point.y,point.z),n=terrainNormal(heightAt,p.x,p.z);
    p.y=heightAt(p.x,p.z);
    const mesh=new THREE.Mesh(trackGeo,material(clamp(.10+strength*.18,.1,.32)));
    mesh.scale.x=clamp(.75+strength*.7,.75,1.45);mesh.scale.y=clamp(.7+strength*.9,.7,1.6);
    orientPlane(mesh,p,n,heading);addMark(mesh,5.5+strength*4);return mesh;
  }
  function dent({point,normal=null,strength=.5}){
    const p=point.clone?point.clone():new THREE.Vector3(point.x,point.y,point.z);
    const n=normal?.clone?.().normalize()||terrainNormal(heightAt,p.x,p.z);
    if(Math.abs(n.y)>.55)p.y=heightAt(p.x,p.z);
    const mesh=new THREE.Mesh(dentGeo,material(clamp(.14+strength*.2,.14,.38)));
    const s=clamp(.55+strength*1.25,.55,1.8);mesh.scale.setScalar(s);
    orientPlane(mesh,p,n,0);addMark(mesh,3.5+strength*3.5);return mesh;
  }
  function buildingImpact(fact){
    if(!city?.group)return;
    const pos=new THREE.Vector3(fact.position.x,fact.position.y,fact.position.z),normal=new THREE.Vector3(fact.normal.x,fact.normal.y,fact.normal.z).normalize();
    const invQ=city.group.getWorldQuaternion(new THREE.Quaternion()).invert();
    const lp=city.group.worldToLocal(pos.clone()),ld=normal.clone().multiplyScalar(-1).applyQuaternion(invQ).normalize();
    U.kfbImpactPos.value.copy(lp);U.kfbImpactDir.value.copy(ld);U.kfbImpactRadius.value=3.2+2.8*fact.strength;
    cityHit={t:0,strength:fact.strength};
  }
  function propImpact(fact){
    const rec=propRecords.get(fact.surface);if(!rec)return;
    const n=new THREE.Vector3(fact.normal.x,fact.normal.y,fact.normal.z).normalize();
    const axis=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),n);if(axis.lengthSq()<1e-5)axis.set(1,0,0);axis.normalize();
    rec.state={t:0,strength:fact.strength,axis,normal:n};
  }
  function impact(fact){
    if(!fact)return;
    if(fact.kind==='building')buildingImpact(fact);
    if(fact.kind==='reactive-prop')propImpact(fact);
    if(fact.strength>.28)dent({point:fact.position,normal:new THREE.Vector3(fact.normal.x,fact.normal.y,fact.normal.z),strength:fact.strength});
  }
  function landing({point,strength=.5}){dent({point,normal:terrainNormal(heightAt,point.x,point.z),strength});}

  function update(dt){
    const h=clamp(finite(dt),0,.1);
    if(cityHit){
      cityHit.t+=h;const env=Math.exp(-6.2*cityHit.t),wave=Math.cos(cityHit.t*27);
      U.kfbImpactAmp.value=.28*cityHit.strength*env*wave;
      if(cityHit.t>1.2){cityHit=null;U.kfbImpactAmp.value=0}
    }else U.kfbImpactAmp.value=0;
    for(const rec of propRecords.values()){
      const s=rec.state;if(!s)continue;s.t+=h;const env=Math.exp(-5.5*s.t),wave=Math.sin(Math.min(Math.PI,s.t*18));
      rec.root.position.copy(rec.basePos).addScaledVector(s.normal,-.12*s.strength*env);
      rec.root.quaternion.copy(rec.baseQuat).multiply(new THREE.Quaternion().setFromAxisAngle(s.axis,.22*s.strength*env*wave));
      if(s.t>1.35){rec.root.position.copy(rec.basePos);rec.root.quaternion.copy(rec.baseQuat);rec.state=null}
    }
    for(let i=marks.length-1;i>=0;i--){
      const m=marks[i];m.life-=h;m.mesh.material.opacity*=Math.exp(-h*(m.life<1.5?1.9:.08));
      if(m.life<=0){m.mesh.removeFromParent();m.mesh.material.dispose();marks.splice(i,1)}
    }
  }
  function report(){return {cityMeshesPatched:cityMeshes,reactiveProps:propRecords.size,temporaryMarks:marks.length,maxMarks,cityImpactActive:!!cityHit};}
  function dispose(){
    for(const rec of propRecords.values()){rec.root.position.copy(rec.basePos);rec.root.quaternion.copy(rec.baseQuat);rec.state=null}
    for(const m of marks){m.mesh.removeFromParent();m.mesh.material.dispose()}marks.length=0;trackGeo.dispose();dentGeo.dispose();markRoot.removeFromParent();
    U.kfbImpactAmp.value=0;
  }
  return {impact,landing,wheelTrack,update,report,dispose};
}
