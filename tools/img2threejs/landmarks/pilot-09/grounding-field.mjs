const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};

function pointSegDistance(px,pz,ax,az,bx,bz){
  const vx=bx-ax,vz=bz-az,wx=px-ax,wz=pz-az;
  const vv=vx*vx+vz*vz||1;
  const t=clamp((wx*vx+wz*vz)/vv);
  return Math.hypot(px-(ax+vx*t),pz-(az+vz*t));
}
function pointInPolygon(x,z,poly=[]){
  let inside=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[i],b=poly[j];
    if(((a.z>z)!=(b.z>z))&&(x<(b.x-a.x)*(z-a.z)/(b.z-a.z+1e-12)+a.x))inside=!inside;
  }
  return inside;
}
function polygonDistance(x,z,poly=[]){
  if(poly.length<2)return Infinity;
  if(pointInPolygon(x,z,poly))return 0;
  let d=Infinity;
  for(let i=0;i<poly.length;i++){
    const a=poly[i],b=poly[(i+1)%poly.length];
    d=Math.min(d,pointSegDistance(x,z,a.x,a.z,b.x,b.z));
  }
  return d;
}
function roadDistance(x,z,roads=[]){
  let d=Infinity,width=0;
  for(const road of roads){
    const pts=road.centerline||[];
    for(let i=0;i<pts.length-1;i++){
      const s=pointSegDistance(x,z,pts[i].x,pts[i].z,pts[i+1].x,pts[i+1].z);
      if(s<d){d=s;width=Number(road.widthM||road.width||5);}
    }
  }
  return {distance:d,width};
}
function fade(distance,inner,outer){
  if(distance<=inner)return 1;
  if(distance>=outer)return 0;
  return 1-smooth((distance-inner)/(outer-inner));
}

export function createGroundingField(scene,opts={}){
  const buildings=(scene?.obstacles?.buildings||[]).map(b=>b.footprint).filter(p=>Array.isArray(p)&&p.length>=3);
  const roads=(scene?.surfaces?.roads||[]).filter(r=>r.driveable!==false && (r.centerline||[]).length>=2);
  const landmarks=Array.isArray(opts.landmarkFootprints)?opts.landmarkFootprints:[];
  const buildingInner=Number(opts.buildingInnerM??1.8),buildingOuter=Number(opts.buildingOuterM??11);
  const roadOuter=Number(opts.roadOuterM??12),landmarkInner=Number(opts.landmarkInnerM??2.5),landmarkOuter=Number(opts.landmarkOuterM??18);

  function weightAt(x,z){
    let wb=0,wl=0;
    for(const poly of buildings){
      const d=polygonDistance(x,z,poly);
      if(d<buildingOuter)wb=Math.max(wb,fade(d,buildingInner,buildingOuter));
      if(wb>.999)break;
    }
    for(const poly of landmarks){
      const d=polygonDistance(x,z,poly);
      if(d<landmarkOuter)wl=Math.max(wl,fade(d,landmarkInner,landmarkOuter));
      if(wl>.999)break;
    }
    const road=roadDistance(x,z,roads);
    const wr=Number.isFinite(road.distance)?fade(road.distance,road.width*.5+1.5,road.width*.5+roadOuter):0;
    const weight=Math.max(wb,wr,wl);
    return {weight,building:wb,road:wr,landmark:wl};
  }

  return {
    weightAt,
    stats:{buildings:buildings.length,roads:roads.length,landmarks:landmarks.length},
    contract:{
      mode:'terrain-derived-support-field',
      visibleBase:false,
      targetGroundY:Number(opts.targetGroundY??0)
    }
  };
}

export function rectangleFootprint(cx,cz,width,depth,yaw=0){
  const hw=width/2,hd=depth/2,c=Math.cos(yaw),s=Math.sin(yaw);
  return [[-hw,-hd],[hw,-hd],[hw,hd],[-hw,hd]].map(([x,z])=>({x:cx+x*c-z*s,z:cz+x*s+z*c}));
}

export {pointInPolygon,polygonDistance,pointSegDistance};
