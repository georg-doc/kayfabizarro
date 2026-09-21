export function clayLidGeometry(THREE,{
  radius=1,upper=true,thickness=.13,curve=0,innerOffset=.018,
  radialSegments=48,bandSegments=10
}={}){
  const innerR=radius*(1+innerOffset);
  const outerR=radius*(1+innerOffset+Math.max(.025,thickness));
  const baseBoundary=(upper?.56:.44)*Math.PI;
  const boundary=(phi)=>{
    const front=Math.max(0,Math.sin(phi));
    return baseBoundary+curve*.13*front*Math.cos((phi-Math.PI/2)*2);
  };
  const point=(r,theta,phi)=>{
    const st=Math.sin(theta);
    return [r*st*Math.cos(phi),r*Math.cos(theta),r*st*Math.sin(phi)];
  };
  const pos=[],idx=[],rows=bandSegments+1;
  for(let j=0;j<=radialSegments;j++){
    const phi=j/radialSegments*Math.PI*2,b=boundary(phi);
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
  g.userData={schema:'kfb.clay-lid/1',upper,innerR,outerR,hardInnerRim:true};
  return g;
}
