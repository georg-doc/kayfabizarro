import * as THREE from 'three';
import {
  B0_SOURCE,
  loadB0Source,
  buildAcceptedV2,
  geometryFacts
} from '../procedural-building-b0/building-family-b0.mjs';

export const B1_SOURCE = Object.freeze({
  familyId:'kfb-building-b1-golden-siblings',
  corpusCount:22,
  normalizedBlob:'936a5d990d2f394ae2bccbb4607d0821ca67a191',
  elastic:B0_SOURCE.elastic,
  facade:B0_SOURCE.facade
});

export const B1_LANES=Object.freeze([
  Object.freeze({
    id:'compact-simple',
    topologyId:'way/371401529',
    envelopeId:'way/371401477',
    expectedRoof:'flat'
  }),
  Object.freeze({
    id:'ordinary-notched',
    topologyId:'way/371401481',
    envelopeId:'way/371401497',
    expectedRoof:'hipped-hint'
  }),
  Object.freeze({
    id:'large-complex',
    topologyId:'way/371401488',
    envelopeId:'way/371401495',
    expectedRoof:'flat'
  })
]);

function openFootprint(poly){
  const p=(poly||[]).map(q=>({x:Number(q.x),z:Number(q.z)}));
  if(p.length>1&&Math.hypot(p[0].x-p.at(-1).x,p[0].z-p.at(-1).z)<.001)p.pop();
  return p;
}
function closeFootprint(poly){
  const p=poly.map(q=>({x:q.x,z:q.z}));
  if(p.length){
    p.push({x:p[0].x,z:p[0].z});
  }
  return p;
}
export function polygonArea(poly){
  const p=openFootprint(poly);
  let a=0;
  for(let i=0;i<p.length;i++){
    const q=p[i],r=p[(i+1)%p.length];
    a+=q.x*r.z-r.x*q.z;
  }
  return Math.abs(a)/2;
}
export function bboxAspect(poly){
  const p=openFootprint(poly);
  let x0=Infinity,x1=-Infinity,z0=Infinity,z1=-Infinity;
  for(const q of p){
    x0=Math.min(x0,q.x);x1=Math.max(x1,q.x);
    z0=Math.min(z0,q.z);z1=Math.max(z1,q.z);
  }
  const w=x1-x0,d=z1-z0;
  return Math.max(w,d)/Math.max(.001,Math.min(w,d));
}
function vertexCentroid(poly){
  const p=openFootprint(poly);
  return p.reduce((a,q)=>({x:a.x+q.x/p.length,z:a.z+q.z/p.length}),{x:0,z:0});
}
function principalFrame(poly){
  const p=openFootprint(poly),c=vertexCentroid(p);
  let xx=0,zz=0,xz=0;
  for(const q of p){
    const x=q.x-c.x,z=q.z-c.z;
    xx+=x*x;zz+=z*z;xz+=x*z;
  }
  xx/=p.length;zz/=p.length;xz/=p.length;
  const angle=.5*Math.atan2(2*xz,xx-zz);
  let ux=Math.cos(angle),uz=Math.sin(angle);
  let vx=-uz,vz=ux;
  const ext=axisExtents(p,c,ux,uz,vx,vz);
  if(ext.v>ext.u){
    [ux,vx]=[vx,ux];
    [uz,vz]=[vz,uz];
  }
  const e=axisExtents(p,c,ux,uz,vx,vz);
  return {c,ux,uz,vx,vz,long:e.u,short:e.v,aspect:e.u/Math.max(.001,e.v)};
}
function axisExtents(p,c,ux,uz,vx,vz){
  let u0=Infinity,u1=-Infinity,v0=Infinity,v1=-Infinity;
  for(const q of p){
    const x=q.x-c.x,z=q.z-c.z;
    const u=x*ux+z*uz,v=x*vx+z*vz;
    u0=Math.min(u0,u);u1=Math.max(u1,u);
    v0=Math.min(v0,v);v1=Math.max(v1,v);
  }
  return {u:u1-u0,v:v1-v0};
}
export function footprintFacts(building){
  const p=openFootprint(building.footprint),frame=principalFrame(p);
  return {
    id:building.id,
    corners:p.length,
    areaM2:polygonArea(p),
    bboxAspect:bboxAspect(p),
    principalAspect:frame.aspect,
    principalLong:frame.long,
    principalShort:frame.short,
    heightM:Number(building.heightM),
    roofType:building.roof?.type||'flat',
    roofHeightM:Number(building.roof?.heightM||0),
    materialClass:building.materialClass||null
  };
}
function syntheticId(lane){
  return 'b1/'+lane.id+'/'+lane.topologyId.replace('way/','')+'-to-'+lane.envelopeId.replace('way/','');
}
export function makeSibling(topology,envelope,lane){
  const source=openFootprint(topology.footprint);
  const frame=principalFrame(source);
  const sourceArea=polygonArea(source);
  const targetArea=polygonArea(envelope.footprint);
  const targetAspect=bboxAspect(envelope.footprint);

  const areaScale=targetArea/Math.max(.001,sourceArea);
  const ratio=targetAspect/Math.max(.001,frame.aspect);
  const longScale=Math.sqrt(areaScale*ratio);
  const shortScale=Math.sqrt(areaScale/ratio);

  const transformed=source.map(q=>{
    const x=q.x-frame.c.x,z=q.z-frame.c.z;
    const u=x*frame.ux+z*frame.uz;
    const v=x*frame.vx+z*frame.vz;
    const uu=u*longScale,vv=v*shortScale;
    return {
      x:frame.c.x+uu*frame.ux+vv*frame.vx,
      z:frame.c.z+uu*frame.uz+vv*frame.vz
    };
  });

  const sibling={
    ...topology,
    id:syntheticId(lane),
    footprint:closeFootprint(transformed),
    heightM:Number(envelope.heightM),
    roof:{...(envelope.roof||topology.roof)},
    materialClass:topology.materialClass,
    b1:{
      lane:lane.id,
      topologyId:topology.id,
      envelopeId:envelope.id,
      longScale,
      shortScale,
      targetArea,
      targetAspect
    }
  };
  return sibling;
}

export async function loadB1Corpus(){
  const source=await loadB0Source();
  const lanes=B1_LANES.map(lane=>{
    const topology=source.byId.get(lane.topologyId);
    const envelope=source.byId.get(lane.envelopeId);
    if(!topology||!envelope)throw new Error('B1 donor missing '+lane.id);
    if((topology.roof?.type||'flat')!==lane.expectedRoof)throw new Error('Topology roof mismatch '+lane.id);
    if((envelope.roof?.type||'flat')!==lane.expectedRoof)throw new Error('Envelope roof mismatch '+lane.id);
    const sibling=makeSibling(topology,envelope,lane);
    return {lane,topology,envelope,sibling};
  });
  return {...source,lanes};
}

export function siblingFacts(entry,anchor){
  const t=footprintFacts(entry.topology);
  const e=footprintFacts(entry.envelope);
  const s=footprintFacts(entry.sibling);
  const v2Topology=buildAcceptedV2(entry.topology,anchor);
  const v2Sibling=buildAcceptedV2(entry.sibling,anchor);
  const v2Envelope=buildAcceptedV2(entry.envelope,anchor);
  const sBody=geometryFacts(v2Sibling.body);
  const sRoof=geometryFacts(v2Sibling.roof);

  return {
    lane:entry.lane.id,
    topology:t,
    envelope:e,
    sibling:s,
    topologyPreserved:s.corners===t.corners,
    targetAreaErrorPct:(s.areaM2-e.areaM2)/e.areaM2*100,
    targetAspectErrorPct:(s.principalAspect-e.bboxAspect)/e.bboxAspect*100,
    heightMatch:Math.abs(s.heightM-e.heightM)<1e-9,
    roofMatch:s.roofType===e.roofType,
    roofHeightMatch:Math.abs(s.roofHeightM-e.roofHeightM)<1e-9,
    scale:{
      long:entry.sibling.b1.longScale,
      short:entry.sibling.b1.shortScale
    },
    v2:{
      topology:{body:geometryFacts(v2Topology.body),roof:geometryFacts(v2Topology.roof)},
      sibling:{body:sBody,roof:sRoof},
      envelope:{body:geometryFacts(v2Envelope.body),roof:geometryFacts(v2Envelope.roof)}
    },
    baseAnchored:Math.abs(sBody.minY)<1e-6,
    facadeRuleId:B1_SOURCE.facade.id
  };
}
