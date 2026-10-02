import {triangulatePolygon} from '../../../../kfb-hub/stage/stunt-world/runtime/ChatGPT_web/osm-city-drive/src/city-geometry.mjs';
import {stableHash,mulberry32} from '../../../osm-city-lab/src/style/cartoon-city.js';

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const pick=(arr,seed)=>arr[Math.abs(seed)%arr.length];

function hexRgb(hex){
  const n=parseInt(String(hex).replace('#',''),16);
  return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];
}
function centerOf(points){
  const xs=points.map(p=>p.x),zs=points.map(p=>p.z);
  return {x:(Math.min(...xs)+Math.max(...xs))/2,z:(Math.min(...zs)+Math.max(...zs))/2};
}
function edgeNormal(a,b,center){
  const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz)||1;
  let nx=-dz/len,nz=dx/len;
  const mx=(a.x+b.x)/2,mz=(a.z+b.z)/2;
  if(nx*(mx-center.x)+nz*(mz-center.z)<0){nx=-nx;nz=-nz;}
  return {nx,nz,len,dx,dz};
}
function pointSegDistance(px,pz,ax,az,bx,bz){
  const vx=bx-ax,vz=bz-az,wx=px-ax,wz=pz-az,vv=vx*vx+vz*vz||1;
  const t=clamp((wx*vx+wz*vz)/vv);
  return Math.hypot(px-(ax+vx*t),pz-(az+vz*t));
}
function nearestRoadDistance(x,z,roads=[]){
  let d=Infinity;
  for(const road of roads){
    const pts=road.centerline||[];
    if(road.driveable===false)continue;
    for(let i=0;i<pts.length-1;i++)d=Math.min(d,pointSegDistance(x,z,pts[i].x,pts[i].z,pts[i+1].x,pts[i+1].z));
  }
  return d;
}
function familyFor(building,palette,seedRoot){
  const id=building.sourceId||building.id||'building';
  const tag=String(building.tags?.building||building.class||'').toLowerCase();
  if(/industrial|warehouse|commercial|office/.test(tag))return {code:'industrial',colors:palette.buildingIndustrial};
  const pale=stableHash(seedRoot+':family:'+id)%3===0;
  return {code:pale?'pale':'warm',colors:pale?palette.buildingPale:palette.buildingWarm};
}
function transformXZ(p,center,band){
  const x=(p.x-center.x)*band.scale,z=(p.z-center.z)*band.scale;
  const c=Math.cos(band.angle),s=Math.sin(band.angle);
  return {x:center.x+x*c-z*s+band.dx,z:center.z+x*s+z*c+band.dz};
}
function push(mesh,p,color){
  mesh.vertices.push(p.x,p.y,p.z);mesh.colors.push(...color);return mesh.vertices.length/3-1;
}
function prismBand(mesh,points,triangles,center,band,color){
  const low=[],high=[];
  for(const p of points){
    const q=transformXZ(p,center,band);
    low.push(push(mesh,{x:q.x,y:band.y0,z:q.z},color));
    high.push(push(mesh,{x:q.x,y:band.y1,z:q.z},color));
  }
  for(let i=0;i<points.length;i++){
    const n=(i+1)%points.length;
    mesh.indices.push(low[i],high[i],low[n],low[n],high[i],high[n]);
  }
  // Only top cap: lower overlaps the preceding band or terrain.
  for(const [a,b,c] of triangles)mesh.indices.push(high[a],high[c],high[b]);
}
function facadeCodes(building,points,center,bands,roads,style,rng){
  const edges=points.map((a,i)=>{
    const b=points[(i+1)%points.length],n=edgeNormal(a,b,center),mx=(a.x+b.x)/2,mz=(a.z+b.z)/2;
    return {i,a,b,...n,mx,mz,roadD:nearestRoadDistance(mx,mz,roads)};
  }).filter(e=>e.len>=4.2);
  edges.sort((a,b)=>a.roadD-b.roadD||b.len-a.len);
  if(!edges.length)return {windows:[],doors:[]};
  const front=edges[0],secondary=[...edges].sort((a,b)=>b.len-a.len).find(e=>e.i!==front.i)||front;
  const facades=[front,secondary];
  const windows=[];
  for(let bi=0;bi<bands.length;bi++){
    const band=bands[bi];
    const floorH=band.y1-band.y0;
    if(floorH<2.2)continue;
    for(const edge of facades){
      const count=Math.max(1,Math.min(3,Math.floor(edge.len/7)));
      for(let j=0;j<count;j++){
        const u=(j+1)/(count+1);
        const src={x:edge.a.x+edge.dx*u,z:edge.a.z+edge.dz*u};
        const q=transformXZ(src,center,band);
        const angle=band.angle;
        const nx=edge.nx*Math.cos(angle)-edge.nz*Math.sin(angle);
        const nz=edge.nx*Math.sin(angle)+edge.nz*Math.cos(angle);
        const warm=(stableHash((building.sourceId||building.id)+':win:'+bi+':'+edge.i+':'+j)&3)===0;
        windows.push({
          x:q.x+nx*.12,y:band.y0+floorH*.57,z:q.z+nz*.12,
          width:Math.min(1.8,Math.max(.7,edge.len/(count+2)*.32)),
          height:Math.min(1.65,Math.max(.85,floorH*.38)),depth:.16,
          yaw:Math.atan2(nx,nz),
          code:warm?'window-warm':'window-cool',
          color:warm?pick(style.palette.window,2):pick(style.palette.window,stableHash('cool:'+edge.i)%2),
          band:bi,facade:edge.i
        });
      }
    }
  }
  const band=bands[0],u=.5,src={x:front.a.x+front.dx*u,z:front.a.z+front.dz*u},q=transformXZ(src,center,band);
  const nx=front.nx*Math.cos(band.angle)-front.nz*Math.sin(band.angle),nz=front.nx*Math.sin(band.angle)+front.nz*Math.cos(band.angle);
  const doors=[{
    x:q.x+nx*.14,y:band.y0+1.25,z:q.z+nz*.14,width:1.25,height:2.45,depth:.2,
    yaw:Math.atan2(nx,nz),code:'street-door',color:pick(style.palette.roof,stableHash((building.sourceId||building.id)+':door')),
    facade:front.i,roadDistanceM:front.roadD,assetHint:'KayKit-door-candidate'
  }];
  return {windows,doors};
}

export function buildGrotesqueCityV2(scene,style,opts={}){
  const mesh={vertices:[],colors:[],indices:[]},details={windows:[],doors:[],buildings:[]};
  const roads=scene?.surfaces?.roads||[],seedRoot=style.seed||'kfb-city';
  const maxBands=Math.max(2,Number(opts.maxBands||5)|0);
  let sourceBuildings=0;
  for(const building of scene?.obstacles?.buildings||[]){
    const {points,triangles}=triangulatePolygon(building.footprint);
    if(!triangles.length||points.length<3)continue;
    const id=building.sourceId||building.id||'building-'+sourceBuildings;
    const rng=mulberry32(stableHash(seedRoot+':grotesque-v2:'+id));
    const bottom=Math.max(0,Number(building.minHeightM)||0);
    const top=Math.max(bottom+1.5,Math.min(60,Number(building.heightM)||9.3));
    const height=top-bottom,center=centerOf(points);
    const floors=Math.max(1,Math.min(maxBands,Math.round(height/4.3)));
    const family=familyFor(building,style.palette,seedRoot);
    const leanX=(rng()*2-1)*Math.min(1.2,height*.025),leanZ=(rng()*2-1)*Math.min(1.2,height*.025);
    const taper=.035+rng()*.075,twist=(rng()*2-1)*THREE_DEG(5.5);
    const bands=[];
    for(let i=0;i<floors;i++){
      const t0=i/floors,t1=(i+1)/floors,tm=(t0+t1)/2;
      const y0=bottom+height*t0-(i?0.06:0),y1=bottom+height*t1+.05;
      const pulse=(rng()-.5)*.045;
      bands.push({
        y0,y1,
        scale:Math.max(.82,1-taper*tm+pulse),
        angle:twist*tm+(rng()-.5)*THREE_DEG(1.2),
        dx:leanX*tm+(rng()-.5)*.22,
        dz:leanZ*tm+(rng()-.5)*.22
      });
    }
    for(let i=0;i<bands.length;i++){
      const accent=(i>0&&i<bands.length-1&&((stableHash(id+':band:'+i)%4)===0));
      const palette=accent?style.palette.buildingPale:family.colors;
      const color=hexRgb(pick(palette,stableHash(seedRoot+':band-color:'+id+':'+i)));
      prismBand(mesh,points,triangles,center,bands[i],color);
    }
    // low roof cap: one coherent roof object instead of another shifted card.
    const topBand={...bands.at(-1),y0:top+.03,y1:top+.38,scale:bands.at(-1).scale*.96};
    prismBand(mesh,points,triangles,center,topBand,hexRgb(pick(style.palette.roof,stableHash(id+':roof'))));
    const facade=facadeCodes(building,points,center,bands,roads,style,rng);
    details.windows.push(...facade.windows.map(x=>({...x,sourceId:id})));
    details.doors.push(...facade.doors.map(x=>({...x,sourceId:id})));
    details.buildings.push({
      sourceId:id,floors,bands:bands.length,family:family.code,
      windowCount:facade.windows.length,doorCount:facade.doors.length,
      materialCode:`wall:${family.code}|roof|window|street-door`
    });
    sourceBuildings++;
  }
  return {
    vertices:new Float32Array(mesh.vertices),colors:new Float32Array(mesh.colors),indices:new Uint32Array(mesh.indices),
    details,
    stats:{
      sourceBuildings,triangles:mesh.indices.length/3,windows:details.windows.length,doors:details.doors.length,
      look:'grotesque-v2',collisionGeometryDeformed:false,semanticFloorBands:true
    }
  };
}
function THREE_DEG(v){return v*Math.PI/180;}
