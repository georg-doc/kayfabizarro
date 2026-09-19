import {cityCartoonParams,deformPoint as cityDeformPoint,stableHash,mulberry32} from '../../../osm-city-lab/src/style/cartoon-city.js';
import {boundsOf} from '../pilot-01/geometry.mjs';

export const BAND_IDS=['lower','clock','belfry','tent'];
export const BAND_RANGES={
  lower:[0,30.2],
  clock:[30.2,46.475],
  belfry:[46.475,53.6],
  tent:[53.6,71]
};

export function bandGroupForPart(name){
  if(name.startsWith('clock-'))return 'clock';
  if(name==='clock-stage'||name==='clock-stage-bottom'||name==='clock-stage-top'||name==='lower-hip-roof'||name.startsWith('gable-')||name.startsWith('pinnacle-'))return 'clock';
  if(name.startsWith('belfry-'))return 'belfry';
  if(name==='green-tent'||name.startsWith('tent-rib-')||name==='star-mast'||name.startsWith('star-sector-'))return 'tent';
  return 'lower';
}

const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,s)=>a.map(v=>v*s);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const len=a=>Math.hypot(...a);
const unit=a=>{const n=len(a);if(n<1e-8)throw Error('Degenerate band axis');return mul(a,1/n);};

function cloneAsset(asset){
  return {
    ...asset,
    bounds:{min:[...asset.bounds.min],max:[...asset.bounds.max],size:[...asset.bounds.size]},
    parts:asset.parts.map(p=>({...p,positions:[...p.positions]}))
  };
}
function frame(asset){
  const b=asset.bounds;
  return {minY:b.min[1],maxY:b.max[1],h:Math.max(1e-5,b.size[1]),cx:(b.min[0]+b.max[0])/2,cz:(b.min[2]+b.max[2])/2};
}
function profileFor(style,mode,id){
  if(mode==='base')return null;
  const exact=style.cartoonMassing?.presets?.grotesque||{};
  const cfg=mode==='city-grotesque'
    ? exact
    : {...exact,bend:.072,lean:.05,taper:.09,twistDeg:6.5,stackSteps:4,stackShift:.022};
  const params=cityCartoonParams(id,cfg,style.seed||'kfb-city');
  const r=mulberry32(stableHash((style.seed||'kfb-city')+':band-soft:'+id));
  return {params,bulge:mode==='soft-cubist'?(.08+r()*.04):0,mode};
}
export function bandFieldPoint(point,bounds,profile){
  if(!profile)return [...point];
  let q=cityDeformPoint({x:point[0],y:point[1],z:point[2]},bounds,profile.params);
  if(profile.bulge){
    const t=Math.max(0,Math.min(1,(point[1]-bounds.minY)/bounds.h));
    const c=cityDeformPoint({x:bounds.cx,y:point[1],z:bounds.cz},bounds,profile.params);
    const s=1+profile.bulge*Math.sin(Math.PI*t);
    q={x:c.x+(q.x-c.x)*s,y:q.y,z:c.z+(q.z-c.z)*s};
  }
  return [q.x,q.y,q.z];
}
export function buildBandTransform(asset,band,profile){
  const bounds=frame(asset),range=BAND_RANGES[band],y0=range[0],y1=range[1],ym=(y0+y1)/2;
  if(!profile)return {band,sourceY:[y0,y1],origin:[0,y0,0],x:[1,0,0],y:[0,1,0],z:[0,0,1],sx:1,sy:1,sz:1};
  const A=bandFieldPoint([0,y0,0],bounds,profile),B=bandFieldPoint([0,y1,0],bounds,profile);
  const yVec=sub(B,A),sy=len(yVec)/(y1-y0),yAxis=unit(yVec);
  const e=Math.max(.05,bounds.h*.0025);
  const xMinus=bandFieldPoint([-e,ym,0],bounds,profile),xPlus=bandFieldPoint([e,ym,0],bounds,profile);
  let xRaw=sub(xPlus,xMinus);
  xRaw=sub(xRaw,mul(yAxis,dot(xRaw,yAxis)));
  let xAxis=unit(xRaw);
  const zMinus=bandFieldPoint([0,ym,-e],bounds,profile),zPlus=bandFieldPoint([0,ym,e],bounds,profile);
  const zRaw=sub(zPlus,zMinus);
  let zAxis=unit(cross(xAxis,yAxis));
  if(dot(zAxis,zRaw)<0)zAxis=mul(zAxis,-1);
  xAxis=unit(cross(yAxis,zAxis));
  return {
    band,sourceY:[y0,y1],origin:A,x:xAxis,y:yAxis,z:zAxis,
    sx:len(sub(xPlus,xMinus))/(2*e),sy,sz:len(zRaw)/(2*e)
  };
}
export function applyBandTransformPoint(point,T){
  const d=[point[0],point[1]-T.sourceY[0],point[2]];
  return add(T.origin,add(add(mul(T.x,d[0]*T.sx),mul(T.y,d[1]*T.sy)),mul(T.z,d[2]*T.sz)));
}

export function bandRigLandmark(asset,style,mode='base'){
  if(!['spasskaya','kremlin-wall'].includes(asset.id))throw Error('Band Rig v2 currently supports Spasskaya/Kremlin study');
  if(!['base','city-grotesque','soft-cubist'].includes(mode))throw Error('Unknown Band Rig v2 mode '+mode);
  const out=cloneAsset(asset),profile=profileFor(style,mode,asset.id),bands={};
  for(const id of BAND_IDS)bands[id]=buildBandTransform(asset,id,profile);
  for(const part of out.parts){
    const band=bandGroupForPart(part.name);
    part.rigBand=band;
    const T=bands[band];
    for(let i=0;i<part.positions.length;i+=3){
      const q=applyBandTransformPoint(part.positions.slice(i,i+3),T);
      part.positions.splice(i,3,...q);
    }
  }
  out.bounds=boundsOf(out.parts);
  out.shapeMode=mode;
  out.rig={
    schema:'kfb.landmark-band-rig/0.2',
    concept:'semantic-affine-bands',
    bands,
    partRule:'clock-stage and all clock-* parts share the exact clock-band transform',
    bumperProfile:{status:'PROPOSAL_METADATA_ONLY',physicsImplemented:false},
    sourceGeometryUnchanged:true
  };
  return out;
}
