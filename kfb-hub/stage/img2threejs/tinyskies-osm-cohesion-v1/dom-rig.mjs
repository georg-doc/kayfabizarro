import {cityCartoonParams,deformPoint} from '/tools/osm-city-lab/src/style/cartoon-city.js';
import {boundsOf} from '/tools/img2threejs/landmarks/pilot-01/geometry.mjs';

const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const mul=(a,s)=>a.map(v=>v*s);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const len=a=>Math.hypot(...a);
const unit=a=>{const n=len(a);if(n<1e-9)throw Error('Degenerate rig axis');return mul(a,1/n);};

function clone(asset){
  return {...asset,bounds:{min:[...asset.bounds.min],max:[...asset.bounds.max],size:[...asset.bounds.size]},parts:asset.parts.map(p=>({...p,positions:[...p.positions]}))};
}
function globalBounds(asset){
  const b=asset.bounds;
  return {minY:b.min[1],maxY:b.max[1],h:Math.max(1e-5,b.size[1]),cx:(b.min[0]+b.max[0])/2,cz:(b.min[2]+b.max[2])/2};
}
function partBounds(parts){
  const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
  for(const part of parts)for(let i=0;i<part.positions.length;i++){
    const k=i%3;lo[k]=Math.min(lo[k],part.positions[i]);hi[k]=Math.max(hi[k],part.positions[i]);
  }
  return {min:lo,max:hi,size:hi.map((v,i)=>v-lo[i]),center:hi.map((v,i)=>(v+lo[i])/2)};
}
function fieldPoint(p,bounds,params){
  const q=deformPoint({x:p[0],y:p[1],z:p[2]},bounds,params);
  return [q.x,q.y,q.z];
}
function fitGroupTransform(parts,bounds,params,groupId){
  const b=partBounds(parts);
  if(groupId==='foundation')return {
    id:groupId,pivot:[b.center[0],b.min[1],b.center[2]],
    origin:[b.center[0],b.min[1],b.center[2]],x:[1,0,0],y:[0,1,0],z:[0,0,1],sx:1,sy:1,sz:1
  };
  const pivot=[b.center[0],b.min[1],b.center[2]],top=[b.center[0],b.max[1],b.center[2]],mid=[b.center[0],(b.min[1]+b.max[1])/2,b.center[2]];
  const origin=fieldPoint(pivot,bounds,params),topOut=fieldPoint(top,bounds,params);
  const yVec=sub(topOut,origin),sy=len(yVec)/Math.max(.001,b.size[1]),yAxis=unit(yVec);
  const e=Math.max(.05,bounds.h*.0025);
  const xp=fieldPoint([mid[0]+e,mid[1],mid[2]],bounds,params),xm=fieldPoint([mid[0]-e,mid[1],mid[2]],bounds,params);
  const zp=fieldPoint([mid[0],mid[1],mid[2]+e],bounds,params),zm=fieldPoint([mid[0],mid[1],mid[2]-e],bounds,params);
  const xFull=sub(xp,xm),zFull=sub(zp,zm);
  // Preserve each semantic assembly's authored contact plane. Grotesque lean/bend
  // travels through the Y vector; the X/Z basis stays horizontal so roofs,
  // windows and buttresses move with their host without pushing ground-contact
  // corners below terrain.
  let xAxis=unit([xFull[0],0,xFull[2]]);
  let zAxis=unit([-xAxis[2],0,xAxis[0]]);
  if(dot(zAxis,zFull)<0)zAxis=mul(zAxis,-1);
  return {id:groupId,pivot,origin,x:xAxis,y:yAxis,z:zAxis,sx:len(xFull)/(2*e),sy,sz:len(zFull)/(2*e)};
}
function applyPoint(p,T){
  const d=sub(p,T.pivot);
  return add(T.origin,add(add(mul(T.x,d[0]*T.sx),mul(T.y,d[1]*T.sy)),mul(T.z,d[2]*T.sz)));
}

export function rigCologneCathedralGrotesque(asset,style){
  const out=clone(asset),bounds=globalBounds(out),preset=style.cartoonMassing?.presets?.grotesque||{};
  const params=cityCartoonParams('koelner-dom-v0.3',preset,style.seed||'kfb-city');
  const ids=[...new Set(out.parts.map(p=>p.rigGroup||'nave'))];
  const transforms={};
  for(const id of ids)transforms[id]=fitGroupTransform(out.parts.filter(p=>(p.rigGroup||'nave')===id),bounds,params,id);
  for(const part of out.parts){
    const T=transforms[part.rigGroup||'nave'];
    for(let i=0;i<part.positions.length;i+=3){
      const q=applyPoint(part.positions.slice(i,i+3),T);
      part.positions.splice(i,3,...q);
    }
  }
  out.bounds=boundsOf(out.parts);
  out.shapeMode='city-grotesque';
  out.rig={schema:'kfb.cologne-cathedral-group-rig/0.1',concept:'semantic-affine-groups',transforms,sourceGeometryUnchanged:true};
  out.note+=' · Group-rigged City Grotesque presentation; foundation remains undeformed.';
  return out;
}

export function groupAttachmentReport(source,rigged){
  const result=[];
  for(const id of Object.keys(rigged.rig.transforms)){
    const before=partBounds(source.parts.filter(p=>(p.rigGroup||'nave')===id));
    const after=partBounds(rigged.parts.filter(p=>(p.rigGroup||'nave')===id));
    result.push({id,before,after});
  }
  return result;
}
