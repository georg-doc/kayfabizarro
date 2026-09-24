import * as THREE from 'three';
import {stableHash,mulberry32} from '../../../src/style/cartoon-city.js';

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
  return {geometry:g,params:P,topRing:rings.at(-1),topY:ringYs.at(-1),baseRing:rings[0]};
}
function longestEdge(poly){
  const p=openFootprint(poly);let best={i:0,len:0};
  for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],len=Math.hypot(b.x-a.x,b.z-a.z);if(len>best.len)best={i,len,a,b};}
  return best;
}
export function buildElasticRoof(building,shell){
  const P=shell.params,base=shell.topRing,baseY=shell.topY,kind=building.roof?.type||'flat',h=Math.max(.35,Number(building.roof?.heightM)||.5),layers=6;
  const edge=longestEdge(building.footprint),ux=(edge.b.x-edge.a.x)/edge.len,uz=(edge.b.z-edge.a.z)/edge.len,vx=-uz,vz=ux;
  const pos=[],rows=[],rings=[],idx=[];
  for(let s=0;s<layers;s++){
    const t=s/(layers-1);let su=1,sv=1;
    if(kind.includes('gabled')){su=1-.11*t;sv=1-.90*t;}
    else if(kind.includes('hipped')){su=1-.70*t;sv=1-.70*t;}
    else {su=1-.075*t;sv=1-.075*t;}
    const ring=base.map(p=>{const dx=p.x-P.c.x,dz=p.z-P.c.z,du=dx*ux+dz*uz,dv=dx*vx+dz*vz,puff=Math.sin(Math.PI*t)*.16;return{x:P.c.x+ux*du*su+vx*(dv*sv+puff),z:P.c.z+uz*du*su+vz*(dv*sv+puff)};});
    rings.push(ring);const row=[];for(let i=0;i<ring.length;i++){row.push(pos.length/3);const softCrown=Math.sin(Math.PI*t)*.07*(P.seed>.5?1:-1);pos.push(ring[i].x,baseY[i]+h*t+softCrown,ring[i].z);}rows.push(row);
  }
  for(let s=0;s<layers-1;s++)for(let i=0;i<base.length;i++){const j=(i+1)%base.length,A=rows[s][i],B=rows[s][j],C=rows[s+1][i],D=rows[s+1][j];idx.push(A,C,B,B,C,D);}
  addCap(idx,rows.at(-1),rings.at(-1),true);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
function facadeNormal(a,b,t,P){
  const da=deformElasticXZ(a,t,P),db=deformElasticXZ(b,t,P),dx=db.x-da.x,dz=db.z-da.z,l=Math.hypot(dx,dz)||1;
  let nx=-dz/l,nz=dx/l,mid={x:(da.x+db.x)/2,z:(da.z+db.z)/2},cc=deformElasticXZ(P.c,t,P);
  if(nx*(mid.x-cc.x)+nz*(mid.z-cc.z)<0){nx=-nx;nz=-nz;}
  return {nx,nz,yaw:Math.atan2(nx,nz)};
}
export function protectedDetails(building,shell){
  const P=shell.params,p=openFootprint(building.footprint),edge=longestEdge(p),a=edge.a,b=edge.b,dx=b.x-a.x,dz=b.z-a.z;
  const r=mulberry32(stableHash('kfb-elastic-facade-v2:'+building.id)),out=[];
  const doorU=.16+r()*.68,doorW=1.45+r()*.55,doorH=2.35+r()*.55,doorT=clamp((doorH*.5)/P.h,.06,.22);
  {
    const base={x:a.x+dx*doorU,z:a.z+dz*doorU},q=deformElasticXZ(base,doorT,P),n=facadeNormal(a,b,doorT,P);
    out.push({kind:'door',x:q.x+n.nx*.13,y:deformElasticY(base,doorT,P),z:q.z+n.nz*.13,yaw:n.yaw,w:doorW,h:doorH,d:.15});
  }
  const wanted=2+(r()>.52?1:0),picked=[];
  for(let tries=0;tries<30&&picked.length<wanted;tries++){
    const u=.13+r()*.74,v=.25+r()*.50;
    if(Math.abs(u-doorU)<.22)continue;
    if(picked.some(w=>Math.hypot((u-w.u)*1.15,v-w.v)<.23))continue;
    picked.push({u,v});
  }
  for(const w of picked){
    const base={x:a.x+dx*w.u,z:a.z+dz*w.u},q=deformElasticXZ(base,w.v,P),n=facadeNormal(a,b,w.v,P);
    out.push({kind:'window',x:q.x+n.nx*.105,y:deformElasticY(base,w.v,P),z:q.z+n.nz*.105,yaw:n.yaw,w:.82+r()*.34,h:1.65+r()*.55,d:.10});
  }
  return out;
}
