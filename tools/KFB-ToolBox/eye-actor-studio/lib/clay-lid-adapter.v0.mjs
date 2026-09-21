function point(r,theta,phi){
  const st=Math.sin(theta);
  return [r*st*Math.cos(phi),r*Math.cos(theta),r*st*Math.sin(phi)];
}

export function buildClayLidGeometry(THREE,{
  radius=1,upper=true,thickness=.11,curve=0,innerOffset=.012,
  radialSegments=48,bandSegments=10
}={}){
  const innerR=radius*(1+innerOffset);
  const outerR=radius*(1+innerOffset+Math.max(.02,thickness));
  const baseBoundary=(upper?.56:.44)*Math.PI;
  const boundary=(phi)=>{
    const front=Math.max(0,Math.sin(phi));
    return baseBoundary+curve*.12*front*Math.cos((phi-Math.PI/2)*2);
  };
  const pos=[],idx=[];
  const cols=radialSegments+1,rows=bandSegments+1;
  for(let j=0;j<=radialSegments;j++){
    const phi=j/radialSegments*Math.PI*2;
    const b=boundary(phi);
    for(let i=0;i<=bandSegments;i++){
      const t=i/bandSegments;
      const theta=upper?b*t:b+(Math.PI-b)*t;
      pos.push(...point(outerR,theta,phi));
    }
  }
  for(let j=0;j<radialSegments;j++)for(let i=0;i<bandSegments;i++){
    const a=j*rows+i,b=a+rows,c=b+1,d=a+1;
    idx.push(a,b,d,b,c,d);
  }
  const rimStart=pos.length/3;
  for(let j=0;j<=radialSegments;j++){
    const phi=j/radialSegments*Math.PI*2,b=boundary(phi);
    pos.push(...point(outerR,b,phi),...point(innerR,b,phi));
  }
  for(let j=0;j<radialSegments;j++){
    const a=rimStart+j*2,b=a+2,c=a+3,d=a+1;
    idx.push(a,b,d,b,c,d);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setIndex(idx);g.computeVertexNormals();g.computeBoundingSphere();
  g.userData={kfbClayLid:true,upper,innerR,outerR,thickness,curve,hardInnerRim:true};
  return g;
}

export function applyClayLids(THREE,rig,options={}){
  if(!rig?.eyes?.length)throw Error('EyeRig eyes missing');
  const report={eyes:rig.eyes.length,lids:0,innerOffset:options.innerOffset??.012,thickness:options.thickness??.11,curve:options.curve??0,pupilClearance:null};
  for(const eye of rig.eyes){
    for(const [key,upper] of [['_up',true],['_lo',false]]){
      const mesh=eye[key];if(!mesh)continue;
      const old=mesh.geometry;
      mesh.geometry=buildClayLidGeometry(THREE,{radius:rig._R,upper,...options});
      mesh.userData.kfbClayLid=true;mesh.userData.kfbLidRole=upper?'upper':'lower';
      if(mesh.material){mesh.material.roughness=.88;mesh.material.metalness=0;mesh.material.needsUpdate=true;}
      old?.dispose?.();report.lids++;
    }
  }
  const pupilR=rig._R*1.004;
  const innerR=rig._R*(1+(options.innerOffset??.012));
  report.pupilClearance=innerR-pupilR;
  return report;
}
