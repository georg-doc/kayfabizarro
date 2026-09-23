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
export function roundFootprint(poly,r,segments=4){
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
export function elasticParams(building,anchor={x:20,z:18},cfg={}){
  const c=centroid(building.footprint),r=mulberry32(stableHash((cfg.seed||'kfb-elastic-grotesque-clay-v1')+':'+building.id));
  const sym=()=>r()*2-1, h=Math.max(1,Number(building.heightM)||1);
  const ex=anchor.x-c.x,ez=anchor.z-c.z,el=Math.max(1,Math.hypot(ex,ez));
  return {
    c,h,
    radius:clamp(Math.min(minEdge(building.footprint),h)*Number(cfg.roundness??.13),.35,1.8),
    leanX:sym()*Number(cfg.lean??.035),
    leanZ:sym()*Number(cfg.lean??.035),
    bendX:sym()*Number(cfg.bend??.04),
    bendZ:sym()*Number(cfg.bend??.04),
    belly:(.7+r()*.3)*Number(cfg.belly??.07),
    taper:(.55+r()*.45)*Number(cfg.taper??.075),
    twist:sym()*Number(cfg.twistDeg??5)*Math.PI/180,
    blockX:ex/el*Number(cfg.blockPull??.018),
    blockZ:ez/el*Number(cfg.blockPull??.018),
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
function addCap(indices,row,ring,up=true){
  const pts=ring.map(q=>new THREE.Vector2(q.x,q.z));
  for(const tri of THREE.ShapeUtils.triangulateShape(pts,[])){
    if(up)indices.push(row[tri[0]],row[tri[2]],row[tri[1]]);
    else indices.push(row[tri[0]],row[tri[1]],row[tri[2]]);
  }
}
export function buildElasticShell(building,anchor,cfg={}){
  const P=elasticParams(building,anchor,cfg),base=roundFootprint(building.footprint,P.radius,4),steps=Math.max(5,Math.floor(cfg.verticalSteps??9));
  const pos=[],rows=[],idx=[],rings=[];
  for(let s=0;s<=steps;s++){
    const t=s/steps,y=P.h*t,ring=base.map(p=>deformElasticXZ(p,t,P));rings.push(ring);
    const row=[];for(const q of ring){row.push(pos.length/3);pos.push(q.x,y,q.z);}rows.push(row);
  }
  for(let s=0;s<steps;s++)for(let i=0;i<base.length;i++){const j=(i+1)%base.length,A=rows[s][i],B=rows[s][j],C=rows[s+1][i],D=rows[s+1][j];idx.push(A,C,B,B,C,D);}
  addCap(idx,rows[0],rings[0],false);addCap(idx,rows.at(-1),rings.at(-1),true);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
  return {geometry:g,params:P,topRing:rings.at(-1),baseRing:rings[0]};
}
function longestEdge(poly){
  const p=openFootprint(poly);let best={i:0,len:0};
  for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],len=Math.hypot(b.x-a.x,b.z-a.z);if(len>best.len)best={i,len,a,b};}
  return best;
}
export function buildElasticRoof(building,shell){
  const P=shell.params,base=shell.topRing,kind=building.roof?.type||'flat',h=Math.max(.35,Number(building.roof?.heightM)||.5),layers=5;
  const edge=longestEdge(building.footprint),ux=(edge.b.x-edge.a.x)/edge.len,uz=(edge.b.z-edge.a.z)/edge.len,vx=-uz,vz=ux;
  const pos=[],rows=[],rings=[],idx=[];
  for(let s=0;s<layers;s++){
    const t=s/(layers-1);let su=1,sv=1;
    if(kind.includes('gabled')){su=1-.12*t;sv=1-.88*t;}
    else if(kind.includes('hipped')){su=1-.68*t;sv=1-.68*t;}
    else {su=1-.06*t;sv=1-.06*t;}
    const ring=base.map(p=>{const dx=p.x-P.c.x,dz=p.z-P.c.z,du=dx*ux+dz*uz,dv=dx*vx+dz*vz,puff=Math.sin(Math.PI*t)*.12;return{x:P.c.x+ux*du*su+vx*(dv*sv+puff),z:P.c.z+uz*du*su+vz*(dv*sv+puff)};});
    rings.push(ring);const row=[];for(const q of ring){row.push(pos.length/3);pos.push(q.x,P.h+h*t,q.z);}rows.push(row);
  }
  for(let s=0;s<layers-1;s++)for(let i=0;i<base.length;i++){const j=(i+1)%base.length,A=rows[s][i],B=rows[s][j],C=rows[s+1][i],D=rows[s+1][j];idx.push(A,C,B,B,C,D);}
  addCap(idx,rows.at(-1),rings.at(-1),true);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
export function protectedDetails(building,shell){
  const P=shell.params,p=openFootprint(building.footprint),edge=longestEdge(p),a=edge.a,b=edge.b,dx=b.x-a.x,dz=b.z-a.z;
  let nx=-dz/edge.len,nz=dx/edge.len,mx=(a.x+b.x)/2,mz=(a.z+b.z)/2;
  if(nx*(mx-P.c.x)+nz*(mz-P.c.z)<0){nx=-nx;nz=-nz;}
  const rows=P.h>8?[.28,.61]:[.5],count=clamp(Math.floor(edge.len/4.5),2,4),out=[];
  for(const v of rows)for(let i=0;i<count;i++){const u=(i+1)/(count+1),base={x:a.x+dx*u,z:a.z+dz*u},q=deformElasticXZ(base,v,P);out.push({kind:'window',x:q.x+nx*.12,y:P.h*v,z:q.z+nz*.12,yaw:Math.atan2(nx,nz),w:1.55,h:1.35,d:.14});}
  const base={x:a.x+dx*.16,z:a.z+dz*.16},q=deformElasticXZ(base,.12,P);out.push({kind:'door',x:q.x+nx*.14,y:1.35,z:q.z+nz*.14,yaw:Math.atan2(nx,nz),w:1.75,h:2.7,d:.18});
  return out;
}
