import {cityCartoonParams,deformPoint as cityDeformPoint,stableHash as cityStableHash,mulberry32 as cityMulberry32} from '../../../osm-city-lab/src/style/cartoon-city.js';
import {boundsOf} from '../pilot-01/geometry.mjs';

export const RIG_MODEL_IDS=['spasskaya','kremlin-wall'];
export const RIG_SHAPE_MODES=['base','city-grotesque','soft-cubist'];

const CLOCK_YAWS=[0,Math.PI/2,Math.PI,Math.PI*1.5];
const CLOCK_ANCHOR_FRONT=[0,41.5,5.55];

const clone=a=>({...a,bounds:{min:[...a.bounds.min],max:[...a.bounds.max],size:[...a.bounds.size]},parts:a.parts.map(p=>({...p,positions:[...p.positions]}))});
const frame=a=>({minY:a.bounds.min[1],maxY:a.bounds.max[1],h:Math.max(1e-5,a.bounds.size[1]),cx:(a.bounds.min[0]+a.bounds.max[0])/2,cz:(a.bounds.min[2]+a.bounds.max[2])/2});
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,s)=>a.map(v=>v*s);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const len=a=>Math.hypot(...a);
const unit=a=>{const n=len(a);if(n<1e-9)throw Error('Degenerate sampled rig axis');return mul(a,1/n);};
const rotateY=(p,y)=>[p[0]*Math.cos(y)+p[2]*Math.sin(y),p[1],-p[0]*Math.sin(y)+p[2]*Math.cos(y)];

function clockIndex(name){
  const prefixes=['clock-face-','clock-rim-','clock-tick-','clock-hour-','clock-minute-'];
  for(const prefix of prefixes){
    if(!name.startsWith(prefix))continue;
    const rest=name.slice(prefix.length);
    for(let i=0;i<CLOCK_YAWS.length;i++){
      const token=String(CLOCK_YAWS[i]);
      if(rest===token||rest.startsWith(token+'-'))return i;
    }
  }
  return -1;
}
function partGroup(name){
  const ci=clockIndex(name);
  if(ci>=0)return 'clock:'+ci;
  if(name.startsWith('wall--1')||name.startsWith('merlon--1'))return 'wall:left';
  if(name.startsWith('wall-1')||name.startsWith('merlon-1'))return 'wall:right';
  if(name==='star-mast'||name.startsWith('star-sector-'))return 'secondarySoft';
  return 'towerCore';
}
function profileFor(style,mode,id){
  if(mode==='base')return null;
  const exact=style.cartoonMassing?.presets?.grotesque||{};
  const cfg=mode==='city-grotesque'?exact:{...exact,bend:.078,lean:.055,taper:.105,twistDeg:7.5,stackSteps:5,stackShift:.028};
  const params=cityCartoonParams(id,cfg,style.seed||'kfb-city');
  const r=cityMulberry32(cityStableHash((style.seed||'kfb-city')+':grouped-soft:'+id));
  return {params,bulge:mode==='soft-cubist'?(.10+r()*.055):0,mode};
}
function fieldPoint(p,b,profile){
  if(!profile)return [...p];
  let q=cityDeformPoint({x:p[0],y:p[1],z:p[2]},b,profile.params);
  if(profile.bulge){
    const t=Math.max(0,Math.min(1,(p[1]-b.minY)/b.h));
    const c=cityDeformPoint({x:b.cx,y:p[1],z:b.cz},b,profile.params);
    const s=1+profile.bulge*Math.sin(Math.PI*t);
    q={x:c.x+(q.x-c.x)*s,y:q.y,z:c.z+(q.z-c.z)*s};
  }
  return [q.x,q.y,q.z];
}
function sampledRigidFrame(anchor,b,profile){
  if(!profile)return {origin:[...anchor],x:[1,0,0],y:[0,1,0],z:[0,0,1]};
  const e=Math.max(.02,b.h*.0025),origin=fieldPoint(anchor,b,profile);
  let x=unit(sub(fieldPoint(add(anchor,[e,0,0]),b,profile),origin));
  let yRaw=sub(fieldPoint(add(anchor,[0,e,0]),b,profile),origin);
  yRaw=sub(yRaw,mul(x,dot(yRaw,x)));
  let y=unit(yRaw),z=unit(cross(x,y));
  const zRaw=sub(fieldPoint(add(anchor,[0,0,e]),b,profile),origin);
  if(dot(z,zRaw)<0)z=mul(z,-1);
  y=unit(cross(z,x));
  return {origin,x,y,z};
}
function rigidPoint(p,anchor,rf){
  const d=sub(p,anchor);
  return add(rf.origin,add(add(mul(rf.x,d[0]),mul(rf.y,d[1])),mul(rf.z,d[2])));
}
function applyPointwise(part,b,profile){
  for(let i=0;i<part.positions.length;i+=3){
    const q=fieldPoint(part.positions.slice(i,i+3),b,profile);
    part.positions.splice(i,3,...q);
  }
}
function applyClockRigid(part,anchor,rf){
  for(let i=0;i<part.positions.length;i+=3){
    const q=rigidPoint(part.positions.slice(i,i+3),anchor,rf);
    part.positions.splice(i,3,...q);
  }
}
export function rigLandmark(asset,style,mode='base'){
  if(!RIG_MODEL_IDS.includes(asset.id))throw Error('Rig v1 supports Spasskaya/Kremlin only');
  if(!RIG_SHAPE_MODES.includes(mode))throw Error('Unknown rig shape mode '+mode);
  const out=clone(asset),b=frame(out),profile=profileFor(style,mode,asset.id);
  const attachments=CLOCK_YAWS.map((yaw,i)=>{
    const anchor=rotateY(CLOCK_ANCHOR_FRONT,yaw),rf=sampledRigidFrame(anchor,b,profile);
    return {id:'clock:'+i,type:'rigidAttached',yaw,anchorOriginal:anchor,anchorDeformed:rf.origin,basis:{x:rf.x,y:rf.y,z:rf.z}};
  });
  const byId=Object.fromEntries(attachments.map(a=>[a.id,a]));
  for(const part of out.parts){
    const group=partGroup(part.name);part.rigGroup=group;
    if(group.startsWith('clock:')){
      const a=byId[group],rf={origin:a.anchorDeformed,x:a.basis.x,y:a.basis.y,z:a.basis.z};
      applyClockRigid(part,a.anchorOriginal,rf);
    }else applyPointwise(part,b,profile);
  }
  out.bounds=boundsOf(out.parts);
  out.shapeMode=mode;
  out.rig={
    schema:'kfb.landmark-rig/0.1',
    root:'landmarkBody',
    groups:[
      {id:'towerCore',type:'coreMass'},
      ...attachments.map(a=>({id:a.id,type:a.type,host:'towerCore'})),
      ...(asset.id==='kremlin-wall'?[{id:'wall:left',type:'coreMass'},{id:'wall:right',type:'coreMass'}]:[]),
      {id:'secondarySoft',type:'secondarySoft',host:'towerCore'}
    ],
    attachments,
    deformation:profile?{mode,source:mode==='city-grotesque'?'OSM City grotesque preset':'soft-cubist extension',params:profile.params,bulge:profile.bulge}:{mode:'base'},
    bumperProfile:{status:'PROPOSAL_METADATA_ONLY',owner:'consumer',shape:'asset-bounds',responseSignal:'impact',physicsImplemented:false},
    sourceGeometryUnchanged:true
  };
  return out;
}
export function clockGroupIndex(name){return clockIndex(name);}
export function groupForPart(name){return partGroup(name);}
export function rigidDistanceReport(base,rigged){
  const reports=[];
  for(const a of rigged.rig?.attachments||[]){
    const baseParts=base.parts.filter(p=>partGroup(p.name)===a.id),newParts=rigged.parts.filter(p=>p.rigGroup===a.id);
    let maxError=0,vertices=0;
    for(let pi=0;pi<baseParts.length;pi++){
      const p0=baseParts[pi],p1=newParts[pi];
      for(let i=0;i<p0.positions.length;i+=3){
        const d0=len(sub(p0.positions.slice(i,i+3),a.anchorOriginal));
        const d1=len(sub(p1.positions.slice(i,i+3),a.anchorDeformed));
        maxError=Math.max(maxError,Math.abs(d0-d1));vertices++;
      }
    }
    reports.push({id:a.id,maxError,vertices});
  }
  return reports;
}
