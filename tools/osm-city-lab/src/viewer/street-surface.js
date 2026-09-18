// KFB OSM City · presentation-only street surface helpers.
// Keeps source centerlines/widths intact while closing visual gaps at shared OSM nodes.

export function cleanLine(points){
  const out=[];
  for(const p of points||[]){
    if(!Number.isFinite(p?.x)||!Number.isFinite(p?.z))continue;
    const q={x:Number(p.x),z:Number(p.z)};
    const prev=out[out.length-1];
    if(!prev||Math.hypot(prev.x-q.x,prev.z-q.z)>.001)out.push(q);
  }
  return out;
}

export function joinedStrip(THREE,points,width,y,material){
  const pts=cleanLine(points);
  if(pts.length<2)return null;
  const half=Math.max(.02,width/2);
  const pos=[];
  const idx=[];

  const dir=(a,b)=>{
    const dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz)||1;
    return {x:dx/l,z:dz/l};
  };
  const normal=d=>({x:-d.z,z:d.x});

  for(let i=0;i<pts.length;i++){
    const p=pts[i];
    const d0=i>0?dir(pts[i-1],p):dir(p,pts[i+1]);
    const d1=i<pts.length-1?dir(p,pts[i+1]):d0;
    const n0=normal(d0),n1=normal(d1);
    let mx=n0.x+n1.x,mz=n0.z+n1.z;
    let ml=Math.hypot(mx,mz);
    if(ml<1e-5){mx=n1.x;mz=n1.z;ml=1;}
    mx/=ml;mz/=ml;
    const denom=Math.max(.38,Math.abs(mx*n1.x+mz*n1.z));
    const miter=Math.min(half*1.8,half/denom);
    pos.push(
      p.x+mx*miter,y,p.z+mz*miter,
      p.x-mx*miter,y,p.z-mz*miter
    );
  }

  for(let i=0;i<pts.length-1;i++){
    const a=i*2,b=a+1,c=a+2,d=a+3;
    idx.push(a,c,b,b,c,d);
  }

  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setIndex(idx);
  g.computeVertexNormals();
  const mesh=new THREE.Mesh(g,material);
  mesh.receiveShadow=true;
  mesh.userData.vertexCount=pts.length*2;
  return mesh;
}

export function circlePatch(THREE,x,z,radius,y,material,segments=12){
  const n=Math.max(8,segments|0);
  const pos=[x,y,z];
  const idx=[];
  for(let i=0;i<n;i++){
    const a=i/n*Math.PI*2;
    pos.push(x+Math.cos(a)*radius,y,z+Math.sin(a)*radius);
  }
  for(let i=0;i<n;i++)idx.push(0,1+((i+1)%n),1+i);
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setIndex(idx);
  g.computeVertexNormals();
  const mesh=new THREE.Mesh(g,material);
  mesh.receiveShadow=true;
  mesh.userData.role='street-junction-patch';
  return mesh;
}

function nodeKey(id){return id==null?null:String(id);}

export function junctionSpecs(roads,{driveableOnly=true,widthExtra=0}={}){
  const byNode=new Map();
  for(const road of roads||[]){
    if(driveableOnly&&!road.driveable)continue;
    const line=cleanLine(road.centerline);
    const ids=road.nodeIds||[];
    for(let i=0;i<line.length;i++){
      const key=nodeKey(ids[i]);
      if(!key)continue;
      const e=byNode.get(key)||{
        nodeId:ids[i],
        x:line[i].x,z:line[i].z,
        radius:0,
        roads:new Set()
      };
      e.radius=Math.max(e.radius,Math.max(.25,Number(road.widthM||4)/2+widthExtra));
      e.roads.add(road.id);
      byNode.set(key,e);
    }
  }
  return [...byNode.values()]
    .filter(e=>e.roads.size>=2)
    .map(e=>({
      nodeId:e.nodeId,
      x:e.x,z:e.z,
      radius:e.radius,
      roadCount:e.roads.size
    }));
}

export function addJunctionPatches(THREE,root,roads,{y,material,widthExtra=0,driveableOnly=true,segments=12}){
  const specs=junctionSpecs(roads,{driveableOnly,widthExtra});
  for(const s of specs)root.add(circlePatch(THREE,s.x,s.z,s.radius,y,material,segments));
  return specs;
}

export function pointSegmentDistance(p,a,b){
  const dx=b.x-a.x,dz=b.z-a.z,l2=dx*dx+dz*dz||1;
  const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/l2));
  return Math.hypot(p.x-(a.x+dx*t),p.z-(a.z+dz*t));
}

export function pointRoadDistance(p,roads){
  let best=Infinity;
  for(const r of roads||[]){
    const line=cleanLine(r.centerline);
    for(let i=1;i<line.length;i++)best=Math.min(best,pointSegmentDistance(p,line[i-1],line[i])-Number(r.widthM||0)/2);
  }
  return best;
}
