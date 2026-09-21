export function applyEyeShading(rig,{
  sclera='#efede5',scleraRoughness=.68,scleraClearcoat=.28,
  pupilRoughness=.36,pupilClearcoat=.65,envMapIntensity=.65
}={}){
  if(!rig?.eyes)return {status:'UNSUPPORTED'};
  let scleraCount=0,pupilCount=0;
  for(const e of rig.eyes){
    const scleraMesh=e.children?.find?.(x=>x.isMesh);
    if(scleraMesh?.material){
      const m=scleraMesh.material;m.color?.set?.(sclera);m.roughness=scleraRoughness;
      if('clearcoat' in m)m.clearcoat=scleraClearcoat;
      if('clearcoatRoughness' in m)m.clearcoatRoughness=.24;
      if('envMapIntensity' in m)m.envMapIntensity=envMapIntensity;
      m.needsUpdate=true;scleraCount++;
    }
    if(e._puMesh?.material){
      const m=e._puMesh.material;m.roughness=pupilRoughness;
      if('clearcoat' in m)m.clearcoat=pupilClearcoat;
      if('clearcoatRoughness' in m)m.clearcoatRoughness=.08;
      if('envMapIntensity' in m)m.envMapIntensity=envMapIntensity;
      m.needsUpdate=true;pupilCount++;
    }
  }
  return {status:'OK',scleraCount,pupilCount};
}

export function mountUnderEyeShadows(THREE,rig,{opacity=.16,color='#3f322f'}={}){
  const f=rig.eyeFrame?.();if(!f)return null;
  const g=new THREE.Group();g.name='KFB under-eye shadow preview';g.userData.kfbEyeShadowPreview=true;
  const mat=new THREE.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,toneMapped:false});
  for(const p of [f.left,f.right]){
    const geo=new THREE.SphereGeometry(f.radius*.92,24,12);
    const m=new THREE.Mesh(geo,mat);m.scale.set(1,.28,.10);
    m.position.set(p.x,p.y-f.radius*.56,p.z-f.radius*.12);m.userData.petOverlay=true;g.add(m);
  }
  f.parent.add(g);return g;
}
