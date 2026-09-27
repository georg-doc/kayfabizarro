// KFB OSM City · deterministic cartoon massing helpers.
//
// Donor grammar: KFB Cartoon-Verbieger.
// City adaptation:
// - normalized per building, never arbitrary metre noise;
// - ground anchored, stronger towards the top;
// - stable OSM-identity seed;
// - optional ring staggering for a controlled cubist/grotesque silhouette.
//
// S1 presentation only. S2 collision/export geometry is never deformed.

export function stableHash(value){
  let h=2166136261;
  for(const c of String(value)){
    h^=c.charCodeAt(0);
    h=Math.imul(h,16777619);
  }
  return h>>>0;
}

export function mulberry32(seed){
  let a=(seed>>>0)||1;
  return function(){
    a=(a+0x6D2B79F5)|0;
    let t=Math.imul(a^(a>>>15),1|a);
    t=(t+Math.imul(t^(t>>>7),61|t))^t;
    return ((t^(t>>>14))>>>0)/4294967296;
  };
}

export function cityCartoonParams(id,cfg={},seedRoot='kfb-city'){
  const seed=stableHash(seedRoot+':'+id);
  const r=mulberry32(seed);
  const sym=()=>r()*2-1;
  const bend=Number(cfg.bend??0.018);
  const lean=Number(cfg.lean??0.024);
  const taper=Number(cfg.taper??0.055);
  const twistDeg=Number(cfg.twistDeg??1.8);
  const stackSteps=Math.max(0,Math.floor(Number(cfg.stackSteps??0)));
  const stackShift=Math.max(0,Number(cfg.stackShift??0));
  const stackOffsets=[{x:0,z:0}];

  for(let i=1;i<=stackSteps;i++){
    const strength=stackShift*(.4+.6*i/Math.max(1,stackSteps));
    stackOffsets.push({x:sym()*strength,z:sym()*strength});
  }

  return {
    bendX:sym()*bend,
    bendZ:sym()*bend,
    leanX:sym()*lean,
    leanZ:sym()*lean,
    taper:(.35+r()*.65)*taper,
    twist:sym()*twistDeg*Math.PI/180,
    stackOffsets,
    seed
  };
}

function boundsLike(bb){
  return {
    minY:bb.min.y,
    maxY:bb.max.y,
    h:Math.max(1e-5,bb.max.y-bb.min.y),
    cx:(bb.min.x+bb.max.x)/2,
    cz:(bb.min.z+bb.max.z)/2
  };
}

function stackOffsetAt(t,p,bounds){
  const offsets=p.stackOffsets||[];
  if(offsets.length<=1)return {x:0,z:0};
  const index=Math.min(offsets.length-1,Math.max(0,Math.round(t*(offsets.length-1))));
  const o=offsets[index]||offsets[0];
  return {x:o.x*bounds.h,z:o.z*bounds.h};
}

export function deformPoint(point,bounds,p){
  const t=Math.max(0,Math.min(1,(point.y-bounds.minY)/bounds.h));
  let rx=point.x-bounds.cx;
  let rz=point.z-bounds.cz;
  const s=Math.max(.68,1-p.taper*t);
  rx*=s;
  rz*=s;
  const a=p.twist*t,ca=Math.cos(a),sa=Math.sin(a);
  const tx=rx*ca-rz*sa;
  const tz=rx*sa+rz*ca;
  const stack=stackOffsetAt(t,p,bounds);
  return {
    x:bounds.cx+tx+(p.bendX*t*t+p.leanX*t)*bounds.h+stack.x,
    y:point.y,
    z:bounds.cz+tz+(p.bendZ*t*t+p.leanZ*t)*bounds.h+stack.z
  };
}

export function applyCartoonMassing(geometry,id,cfg={},seedRoot='kfb-city'){
  geometry.computeBoundingBox();
  const bounds=boundsLike(geometry.boundingBox);
  const params=cityCartoonParams(id,cfg,seedRoot);
  const pos=geometry.getAttribute('position');
  for(let i=0;i<pos.count;i++){
    const q=deformPoint({x:pos.getX(i),y:pos.getY(i),z:pos.getZ(i)},bounds,params);
    pos.setXYZ(i,q.x,q.y,q.z);
  }
  pos.needsUpdate=true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return {params,bounds};
}

function openFootprint(poly){
  if(!Array.isArray(poly))return [];
  const pts=poly.map(p=>({x:Number(p.x),z:Number(p.z)})).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.z));
  if(pts.length>1){
    const a=pts[0],b=pts[pts.length-1];
    if(Math.hypot(a.x-b.x,a.z-b.z)<.001)pts.pop();
  }
  return pts;
}

function buildingCenter(poly){
  const xs=poly.map(p=>p.x),zs=poly.map(p=>p.z);
  return {x:(Math.min(...xs)+Math.max(...xs))/2,z:(Math.min(...zs)+Math.max(...zs))/2};
}

export function windowCodesForBuilding(building,deform,cfg={},seedRoot='kfb-city'){
  if(!(building?.heightM>=Number(cfg.minBuildingHeightM??5)))return [];
  const poly=openFootprint(building.footprint);
  if(poly.length<3)return [];
  const center=buildingCenter(poly);
  const minFacade=Number(cfg.minFacadeM??4.5);
  const maxFacades=Math.max(1,Math.floor(cfg.facadesPerBuilding??2));
  const maxPerFacade=Math.max(1,Math.floor(cfg.maxPerFacade??3));
  const r=mulberry32(stableHash(seedRoot+':windows:'+building.id));
  const edges=[];

  for(let i=0;i<poly.length;i++){
    const a=poly[i],b=poly[(i+1)%poly.length],dx=b.x-a.x,dz=b.z-a.z;
    const len=Math.hypot(dx,dz);
    if(len<minFacade)continue;
    let nx=-dz/len,nz=dx/len;
    const mx=(a.x+b.x)/2,mz=(a.z+b.z)/2;
    if(nx*(mx-center.x)+nz*(mz-center.z)<0){nx=-nx;nz=-nz;}
    edges.push({i,a,b,dx,dz,len,nx,nz,rank:len*(.92+r()*.16)});
  }

  edges.sort((a,b)=>b.rank-a.rank);
  const out=[];
  for(const edge of edges.slice(0,maxFacades)){
    const count=Math.max(1,Math.min(maxPerFacade,Math.floor(edge.len/7.5)));
    for(let j=0;j<count;j++){
      const u=.16+r()*.68;
      const v=.24+r()*.56;
      const width=Math.min(edge.len*.22,.75+r()*1.05);
      const height=.9+r()*.9;
      const depth=.08+r()*.06;
      const base={
        x:edge.a.x+edge.dx*u+edge.nx*(depth*.5+.035),
        y:Math.min(building.heightM-.7,Math.max(.8,building.heightM*v)),
        z:edge.a.z+edge.dz*u+edge.nz*(depth*.5+.035)
      };
      const q=deform?deformPoint(base,deform.bounds,deform.params):base;
      out.push({
        x:q.x,y:q.y,z:q.z,
        width,height,depth,
        yaw:Math.atan2(edge.nx,edge.nz)+(deform?deform.params.twist*Math.max(0,Math.min(1,base.y/deform.bounds.h)):0),
        materialIndex:Math.floor(r()*Math.max(1,Number(cfg.materialCount??3))),
        sourceId:building.id
      });
    }
  }
  return out;
}
