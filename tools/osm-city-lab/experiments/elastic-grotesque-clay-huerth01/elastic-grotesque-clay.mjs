import * as THREE from 'three';
import {stableHash,mulberry32} from '../../src/style/cartoon-city.js';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=t=>t*t*(3-2*t);

export function openFootprint(poly){
  if(!Array.isArray(poly))return [];
  const p=poly.map(q=>({x:Number(q.x),z:Number(q.z)})).filter(q=>Number.isFinite(q.x)&&Number.isFinite(q.z));
  if(p.length>1&&Math.hypot(p[0].x-p.at(-1).x,p[0].z-p.at(-1).z)<.001)p.pop();
  return p;
}
export function centroid(poly){
  const p=openFootprint(poly);
  return p.reduce((a,q)=>({x:a.x+q.x/p.length,z:a.z+q.z/p.length}),{x:0,z:0});
}
function minEdge(poly){
  const p=openFootprint(poly);let m=Infinity;
  for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];m=Math.min(m,Math.hypot(b.x-a.x,b.z-a.z));}
  return Number.isFinite(m)?m:0;
}
function extents(poly){
  const p=openFootprint(poly),xs=p.map(q=>q.x),zs=p.map(q=>q.z);
  return {w:Math.max(...xs)-Math.min(...xs),d:Math.max(...zs)-Math.min(...zs)};
}
export function roundFootprint(poly,r,segments=5){
  const p=openFootprint(poly);if(p.length<3||r<=.001)return p;
  const out=[];
  for(let i=0;i<p.length;i++){
    const c=p[i],a=p[(i-1+p.length)%p.length],b=p[(i+1)%p.length];
    const l1=Math.hypot(c.x-a.x,c.z-a.z),l2=Math.hypot(b.x-c.x,b.z-c.z);
    if(l1<.01||l2<.01){out.push({...c});continue;}
    const rr=Math.min(r,l1*.42,l2*.42);
    const ax=c.x+(a.x-c.x)/l1*rr,az=c.z+(a.z-c.z)/l1*rr;
    const bx=c.x+(b.x-c.x)/l2*rr,bz=c.z+(b.z-c.z)/l2*rr;
    for(let k=0;k<segments;k++){const t=k/segments,u=1-t;out.push({x:u*u*ax+2*u*t*c.x+t*t*bx,z:u*u*az+2*u*t*c.z+t*t*bz});}
  }
  return out;
}
function coherentBlockField(c,cfg={}){
  // Low-frequency field: neighbouring buildings inherit related lean/bend/roof tilt.
  // This is the group-level "wonky street" author; local seeded variation stays secondary.
  const phase=c.x*Number(cfg.fieldX??.014)+c.z*Number(cfg.fieldZ??.010);
  const strength=Number(cfg.groupWarp??1);
  return {
    leanX:Math.sin(phase+.72)*.080*strength,
    leanZ:Math.cos(phase*.86-.38)*.058*strength,
    bendX:Math.sin(phase*.61-.65)*.055*strength,
    bendZ:Math.cos(phase*.57+.28)*.044*strength,
    slopeX:Math.sin(phase*.73+.12)*.040*strength,
    slopeZ:Math.cos(phase*.67-.52)*.030*strength
  };
}
export function elasticParams(building,anchor={x:20,z:18},cfg={}){
  const c=centroid(building.footprint),r=mulberry32(stableHash((cfg.seed||'kfb-elastic-grotesque-clay-v2')+':'+building.id));
  const sym=()=>r()*2-1,h=Math.max(1,Number(building.heightM)||1),e=extents(building.footprint);
  const ex=anchor.x-c.x,ez=anchor.z-c.z,el=Math.max(1,Math.hypot(ex,ez)),F=coherentBlockField(c,cfg);
  return {
    c,h,extent:e,
    radius:clamp(Math.min(minEdge(building.footprint),h)*Number(cfg.roundness??.15),.42,2.05),
    // Correlated block warp dominates; per-building wobble is deliberately smaller.
    leanX:F.leanX+sym()*Number(cfg.localLean??.018),
    leanZ:F.leanZ+sym()*Number(cfg.localLean??.018),
    bendX:F.bendX+sym()*Number(cfg.localBend??.018),
    bendZ:F.bendZ+sym()*Number(cfg.localBend??.018),
    slopeX:F.slopeX+sym()*Number(cfg.localSlope??.009),
    slopeZ:F.slopeZ+sym()*Number(cfg.localSlope??.009),
    belly:(.75+r()*.25)*Number(cfg.belly??.105),
    taper:(.55+r()*.45)*Number(cfg.taper??.070),
    twist:sym()*Number(cfg.twistDeg??4.2)*Math.PI/180,
    blockX:ex/el*Number(cfg.blockPull??.024),
    blockZ:ez/el*Number(cfg.blockPull??.024),
    seed:r()
  };
}
export function deformElasticXZ(p,t,P){
  const e=smooth(clamp(t,0,1)),belly=Math.sin(Math.PI*clamp(t,0,1));
  let x=p.x-P.c.x,z=p.z-P.c.z;
  const scale=1+P.belly*belly-P.taper*e;
  x*=scale;z*=scale;
  const a=P.twist*e,ca=Math.cos(a),sa=Math.sin(a),rx=x*ca-z*sa,rz=x*sa+z*ca;
  return {
    x:P.c.x+rx+(P.leanX*e+P.bendX*belly+P.blockX*e)*P.h,
    z:P.c.z+rz+(P.leanZ*e+P.bendZ*belly+P.blockZ*e)*P.h
  };
}
export function deformElasticY(p,t,P){
  const e=smooth(clamp(t,0,1)),dx=p.x-P.c.x,dz=p.z-P.c.z;
  return P.h*t+e*(dx*P.slopeX+dz*P.slopeZ);
}
function addCap(indices,row,ring,up=true){
  const pts=ring.map(q=>new THREE.Vector2(q.x,q.z));
  for(const tri of THREE.ShapeUtils.triangulateShape(pts,[])){
    if(up)indices.push(row[tri[0]],row[tri[2]],row[tri[1]]);
    else indices.push(row[tri[0]],row[tri[1]],row[tri[2]]);
  }
}
export function buildElasticShell(building,anchor,cfg={}){
  const P=elasticParams(building,anchor,cfg),base=roundFootprint(building.footprint,P.radius,5),steps=Math.max(8,Math.floor(cfg.verticalSteps??12));
  const pos=[],rows=[],idx=[],rings=[],ringYs=[];
  for(let s=0;s<=steps;s++){
    const t=s/steps,ring=base.map(p=>deformElasticXZ(p,t,P)),ys=base.map(p=>deformElasticY(p,t,P));
    rings.push(ring);ringYs.push(ys);
    const row=[];for(let i=0;i<ring.length;i++){row.push(pos.length/3);pos.push(ring[i].x,ys[i],ring[i].z);}rows.push(row);
  }
  for(let s=0;s<steps;s++)for(let i=0;i<base.length;i++){const j=(i+1)%base.length,A=rows[s][i],B=rows[s][j],C=rows[s+1][i],D=rows[s+1][j];idx.push(A,C,B,B,C,D);}
  addCap(idx,rows[0],rings[0],false);addCap(idx,rows.at(-1),rings.at(-1),true);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
  return {geometry:g,params:P,sourceRing:base,rings,ringYs,topRing:rings.at(-1),topY:ringYs.at(-1),baseRing:rings[0]};
}
function longestEdge(poly){
  const p=openFootprint(poly);let best={i:0,len:0};
  for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],len=Math.hypot(b.x-a.x,b.z-a.z);if(len>best.len)best={i,len,a,b};}
  return best;
}
function signedAreaXZ(poly){
  let a=0;
  for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length];a+=p.x*q.z-q.x*p.z;}
  return a*.5;
}
function outsetRing(poly,distance){
  if(!poly?.length||distance<=0)return poly?.map(p=>({...p}))||[];
  const ccw=signedAreaXZ(poly)>0;
  const outward=(a,b)=>{
    const dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz)||1;
    return ccw?{x:dz/l,z:-dx/l}:{x:-dz/l,z:dx/l};
  };
  return poly.map((p,i)=>{
    const prev=poly[(i-1+poly.length)%poly.length],next=poly[(i+1)%poly.length];
    const n0=outward(prev,p),n1=outward(p,next);
    let mx=n0.x+n1.x,mz=n0.z+n1.z,ml=Math.hypot(mx,mz);
    if(ml<1e-5){mx=n1.x;mz=n1.z;ml=1;}
    mx/=ml;mz/=ml;
    const denom=Math.max(.42,Math.abs(mx*n1.x+mz*n1.z));
    const miter=Math.min(distance*1.65,distance/denom);
    return {x:p.x+mx*miter,z:p.z+mz*miter};
  });
}
function nearestRingPoint(ring,target){
  let best={distance:Infinity,index:0,u:0,source:ring[0]};
  for(let i=0;i<ring.length;i++){
    const a=ring[i],b=ring[(i+1)%ring.length],dx=b.x-a.x,dz=b.z-a.z,l2=dx*dx+dz*dz||1;
    const u=clamp(((target.x-a.x)*dx+(target.z-a.z)*dz)/l2,0,1);
    const q={x:a.x+dx*u,z:a.z+dz*u},d=Math.hypot(target.x-q.x,target.z-q.z);
    if(d<best.distance)best={distance:d,index:i,u,source:q};
  }
  return best;
}
export function surfaceFrame(shell,target,t){
  const P=shell.params,ring=shell.sourceRing||shell.baseRing,hit=nearestRingPoint(ring,target);
  const a=ring[hit.index],b=ring[(hit.index+1)%ring.length],u=hit.u;
  const qa=deformElasticXZ(a,t,P),qb=deformElasticXZ(b,t,P);
  const ya=deformElasticY(a,t,P),yb=deformElasticY(b,t,P);
  const position=new THREE.Vector3(
    qa.x+(qb.x-qa.x)*u,
    ya+(yb-ya)*u,
    qa.z+(qb.z-qa.z)*u
  );
  const tangent=new THREE.Vector3(qb.x-qa.x,yb-ya,qb.z-qa.z).normalize();
  const source={x:a.x+(b.x-a.x)*u,z:a.z+(b.z-a.z)*u};
  const eps=.012,t0=clamp(t-eps,0,1),t1=clamp(t+eps,0,1);
  const q0=deformElasticXZ(source,t0,P),q1=deformElasticXZ(source,t1,P);
  const y0=deformElasticY(source,t0,P),y1=deformElasticY(source,t1,P);
  const verticalRaw=new THREE.Vector3(q1.x-q0.x,y1-y0,q1.z-q0.z).normalize();
  const normal=new THREE.Vector3().crossVectors(tangent,verticalRaw).normalize();
  const dc=deformElasticXZ(P.c,t,P),dy=deformElasticY(P.c,t,P);
  const radial=new THREE.Vector3(position.x-dc.x,position.y-dy,position.z-dc.z);
  if(normal.dot(radial)<0)normal.multiplyScalar(-1);
  const vertical=new THREE.Vector3().crossVectors(normal,tangent).normalize();
  return {position,normal,tangent,vertical,source};
}
export function buildElasticRoof(building,shell){
  const P=shell.params,overhang=clamp(Math.min(P.extent.w,P.extent.d)*.055,.42,.72),base=outsetRing(shell.topRing,overhang),baseY=shell.topY,kind=building.roof?.type||'flat',h=Math.max(.35,Number(building.roof?.heightM)||.5),layers=6,eaveLift=.035;
  const edge=longestEdge(building.footprint),ux=(edge.b.x-edge.a.x)/edge.len,uz=(edge.b.z-edge.a.z)/edge.len,vx=-uz,vz=ux;
  const pos=[],rows=[],rings=[],idx=[];
  const innerEave=[],outerEave=[];
  for(let i=0;i<base.length;i++){
    innerEave.push(pos.length/3);pos.push(shell.topRing[i].x,baseY[i]+eaveLift,shell.topRing[i].z);
    outerEave.push(pos.length/3);pos.push(base[i].x,baseY[i]+eaveLift,base[i].z);
  }
  for(let i=0;i<base.length;i++){
    const j=(i+1)%base.length;
    idx.push(innerEave[i],outerEave[i],innerEave[j],innerEave[j],outerEave[i],outerEave[j]);
  }
  for(let s=0;s<layers;s++){
    const t=s/(layers-1);let su=1,sv=1;
    if(kind.includes('gabled')){su=1-.11*t;sv=1-.90*t;}
    else if(kind.includes('hipped')){su=1-.70*t;sv=1-.70*t;}
    else {su=1-.075*t;sv=1-.075*t;}
    const ring=base.map(p=>{const dx=p.x-P.c.x,dz=p.z-P.c.z,du=dx*ux+dz*uz,dv=dx*vx+dz*vz,puff=Math.sin(Math.PI*t)*.16;return{x:P.c.x+ux*du*su+vx*(dv*sv+puff),z:P.c.z+uz*du*su+vz*(dv*sv+puff)};});
    rings.push(ring);const row=[];for(let i=0;i<ring.length;i++){row.push(pos.length/3);const softCrown=Math.sin(Math.PI*t)*.07*(P.seed>.5?1:-1);pos.push(ring[i].x,baseY[i]+eaveLift+h*t+softCrown,ring[i].z);}rows.push(row);
  }
  for(let s=0;s<layers-1;s++)for(let i=0;i<base.length;i++){const j=(i+1)%base.length,A=rows[s][i],B=rows[s][j],C=rows[s+1][i],D=rows[s+1][j];idx.push(A,C,B,B,C,D);}
  addCap(idx,rows.at(-1),rings.at(-1),true);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
export function protectedDetails(building,shell){
  const P=shell.params,p=openFootprint(building.footprint),r=mulberry32(stableHash('kfb-elastic-facade-r2:'+building.id)),out=[];
  const edges=p.map((a,i)=>{
    const b=p[(i+1)%p.length],dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
    return {i,a,b,dx,dz,len,rank:len*(.9+r()*.2)};
  }).filter(e=>e.len>=3.4);
  if(!edges.length)return out;
  const ranked=[...edges].sort((a,b)=>b.rank-a.rank);
  const doorEdge=ranked[Math.min(ranked.length-1,Math.floor(r()*Math.min(2,ranked.length)))];
  const pushDetail=(edge,kind,u,t,w,h,d)=>{
    const target={x:edge.a.x+edge.dx*u,z:edge.a.z+edge.dz*u},frame=surfaceFrame(shell,target,t);
    out.push({
      kind,facadeIndex:edge.i,
      x:frame.position.x,y:frame.position.y,z:frame.position.z,
      nx:frame.normal.x,ny:frame.normal.y,nz:frame.normal.z,
      ux:frame.tangent.x,uy:frame.tangent.y,uz:frame.tangent.z,
      vx:frame.vertical.x,vy:frame.vertical.y,vz:frame.vertical.z,
      w,h,d
    });
  };
  const doorU=.18+r()*.64,doorW=1.35+r()*.65,doorH=2.25+r()*.70,doorT=clamp((doorH*.5)/P.h,.06,.22);
  pushDetail(doorEdge,'door',doorU,doorT,doorW,doorH,.12);

  for(const edge of edges){
    const maxByLength=edge.len>=13?3:edge.len>=7?2:1;
    const wanted=Math.max(1,maxByLength-(r()>.7?1:0));
    const picked=[];
    for(let tries=0;tries<40&&picked.length<wanted;tries++){
      const u=.14+r()*.72,v=.23+r()*.54;
      if(edge.i===doorEdge.i&&Math.abs(u-doorU)<.20)continue;
      if(picked.some(w=>Math.hypot((u-w.u)*1.15,v-w.v)<.21))continue;
      picked.push({u,v});
    }
    for(const w of picked){
      pushDetail(edge,'window',w.u,w.v,.76+r()*.42,1.45+r()*.78,.08);
    }
  }
  return out;
}
