import {cityCartoonParams,deformPoint,stableHash,mulberry32} from '../../../osm-city-lab/src/style/cartoon-city.js';
import {boundsOf} from '../pilot-01/geometry.mjs';
import {assembly} from '../pilot-02/builder.mjs';

export const SHAPE_MODES=['base','city-grotesque','soft-cubist','voxel-steps','boxel'];
const clone=a=>({...a,bounds:{min:[...a.bounds.min],max:[...a.bounds.max],size:[...a.bounds.size]},parts:a.parts.map(p=>({...p,positions:[...p.positions]}))});
const frame=a=>({minY:a.bounds.min[1],maxY:a.bounds.max[1],h:Math.max(1e-5,a.bounds.size[1]),cx:(a.bounds.min[0]+a.bounds.max[0])/2,cz:(a.bounds.min[2]+a.bounds.max[2])/2});

function deform(asset,style,mode){
  const out=clone(asset),b=frame(out),exact=style.cartoonMassing?.presets?.grotesque||{};
  const cfg=mode==='city-grotesque'?exact:{...exact,bend:.078,lean:.055,taper:.105,twistDeg:7.5,stackSteps:5,stackShift:.028};
  const params=cityCartoonParams(out.id,cfg,style.seed||'kfb-city');
  const r=mulberry32(stableHash((style.seed||'kfb-city')+':soft-landmark:'+out.id));
  const bulge=mode==='soft-cubist'?(.10+r()*.055):0;
  for(const part of out.parts)for(let i=0;i<part.positions.length;i+=3){
    const p={x:part.positions[i],y:part.positions[i+1],z:part.positions[i+2]};
    let q=deformPoint(p,b,params);
    if(bulge){
      const t=Math.max(0,Math.min(1,(p.y-b.minY)/b.h));
      const c=deformPoint({x:b.cx,y:p.y,z:b.cz},b,params),s=1+bulge*Math.sin(Math.PI*t);
      q={x:c.x+(q.x-c.x)*s,y:q.y,z:c.z+(q.z-c.z)*s};
    }
    part.positions.splice(i,3,q.x,q.y,q.z);
  }
  out.bounds=boundsOf(out.parts);out.shapeMode=mode;
  out.deformation={source:mode==='city-grotesque'?'OSM City grotesque preset':'soft-cubist extension',params,bulge,collision:'unchanged'};
  return out;
}
function pb(part){
  const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
  for(let i=0;i<part.positions.length;i++){const k=i%3;lo[k]=Math.min(lo[k],part.positions[i]);hi[k]=Math.max(hi[k],part.positions[i]);}
  return {min:lo,max:hi,size:hi.map((v,i)=>v-lo[i]),center:hi.map((v,i)=>(v+lo[i])/2)};
}
function courses(asset){
  const g=new Map();
  for(const p of asset.parts){const m=/^(khufu|khafre|menkaure)-course-(\d+)$/.exec(p.name);if(!m)continue;if(!g.has(m[1]))g.set(m[1],[]);g.get(m[1]).push({part:p,index:+m[2],b:pb(p)});}
  for(const a of g.values())a.sort((x,y)=>x.index-y.index);
  return g;
}
function steps(asset){
  const a=assembly('giza-voxel','Giza · Voxel Steps','Square slab steps derived from the existing Giza course bounds.');
  for(const list of courses(asset).values())for(const c of list)a.box(c.part.name,c.part.zone,c.b.center,c.b.size);
  const out=a.finish();out.shapeMode='voxel-steps';out.sourceAsset='giza';return out;
}
function boxel(asset){
  const a=assembly('giza-boxel','Giza · Boxel Blocks','Macro-block study derived from the existing Giza course count and bounds.');
  for(const list of courses(asset).values()){
    const n0=list.length;
    for(const c of list){
      const n=Math.max(1,n0-c.index),w=Math.max(c.b.size[0],c.b.size[2]),cell=w/n,sy=c.b.size[1],gap=.075;
      for(let z=0;z<n;z++)for(let x=0;x<n;x++){
        const px=c.b.center[0]-w/2+cell*(x+.5),pz=c.b.center[2]-w/2+cell*(z+.5);
        let hh=sy*(1-gap),py=c.b.center[1];if(c.index===0){hh=sy*(1-gap/2);py=c.b.min[1]+hh/2;}
        a.box(c.part.name+'-b-'+x+'-'+z,c.part.zone,[px,py,pz],[cell*(1-gap),hh,cell*(1-gap)]);
      }
    }
  }
  const out=a.finish();out.shapeMode='boxel';out.sourceAsset='giza';return out;
}
export function shapeAsset(asset,style,mode='base'){
  if(mode==='base')return clone(asset);
  if(mode==='city-grotesque'||mode==='soft-cubist')return deform(asset,style,mode);
  if(mode==='voxel-steps')return asset.id==='giza'?steps(asset):clone(asset);
  if(mode==='boxel')return asset.id==='giza'?boxel(asset):clone(asset);
  throw Error('Unknown shape mode '+mode);
}
export const modeSupported=(id,mode)=>!(mode==='voxel-steps'||mode==='boxel')||id==='giza';
