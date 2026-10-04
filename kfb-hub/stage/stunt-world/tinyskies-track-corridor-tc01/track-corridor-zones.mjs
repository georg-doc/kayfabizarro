// TC-01 · Compile a sampled spherical Track route into EXISTING Travel terrain zones.
//
// This module deliberately does not own terrain. It converts Track intent into the current
// setTerrainZones() contract, so travel/globe-v13/terrain-surface.js remains byte-identical.

const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;

function routeForward(THREE,points,i){
  const p=points[i].n;
  const prev=points[Math.max(0,i-1)].n;
  const next=points[Math.min(points.length-1,i+1)].n;
  const f=new THREE.Vector3(next.x-prev.x,next.y-prev.y,next.z-prev.z);
  const n=new THREE.Vector3(p.x,p.y,p.z).normalize();
  f.addScaledVector(n,-f.dot(n));
  if(f.lengthSq()<1e-10){
    const helper=Math.abs(n.y)<.9?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0);
    f.crossVectors(helper,n);
  }
  return f.normalize();
}

function arcWorld(a,b,R){
  return Math.acos(clamp(dot(a,b),-1,1))*R;
}

/**
 * @returns array accepted by Travel's current setTerrainZones().
 */
export function compileTrackCorridorZones({
  THREE,
  routePoints,
  heights,
  globeRadius,
  halfWidthWorld,
  shoulderWorld,
  maxGrade=.34,
  every=1,
}){
  if(!THREE)throw new Error('THREE required');
  if(!Array.isArray(routePoints)||routePoints.length<2)throw new Error('routePoints >= 2 required');
  if(!Array.isArray(heights)||heights.length!==routePoints.length)throw new Error('heights must match routePoints');
  const R=Math.max(.001,globeRadius||5);
  const radius=Math.max(1e-5,halfWidthWorld/R);
  const ramp=Math.max(1e-5,shoulderWorld/R);
  const zones=[];

  for(let i=0;i<routePoints.length;i+=Math.max(1,every|0)){
    const n=new THREE.Vector3(routePoints[i].n.x,routePoints[i].n.y,routePoints[i].n.z).normalize();
    const ex=routeForward(THREE,routePoints,i);
    const ev=new THREE.Vector3().crossVectors(n,ex).normalize();

    const ia=Math.max(0,i-1),ib=Math.min(routePoints.length-1,i+1);
    const ds=arcWorld(routePoints[ia].n,routePoints[ib].n,R);
    const grade=ds>1e-6?clamp((heights[ib]-heights[ia])/ds,-maxGrade,maxGrade):0;

    zones.push({
      n,
      radius,
      ramp,
      height:heights[i],
      // Travel zone coordinates are angular; convert height/world slope to height/radian.
      tiltU:grade*R,
      tiltV:0,
      ex,
      ev,
      tc01:{sample:i,grade,halfWidthWorld,shoulderWorld}
    });
  }

  // Always include the final sample so the roadbed closes cleanly at the end.
  if(zones[zones.length-1]?.tc01?.sample!==routePoints.length-1){
    const i=routePoints.length-1;
    const n=new THREE.Vector3(routePoints[i].n.x,routePoints[i].n.y,routePoints[i].n.z).normalize();
    const ex=routeForward(THREE,routePoints,i);
    const ev=new THREE.Vector3().crossVectors(n,ex).normalize();
    const ia=Math.max(0,i-1),ib=i;
    const ds=arcWorld(routePoints[ia].n,routePoints[ib].n,R);
    const grade=ds>1e-6?clamp((heights[ib]-heights[ia])/ds,-maxGrade,maxGrade):0;
    zones.push({n,radius,ramp,height:heights[i],tiltU:grade*R,tiltV:0,ex,ev,tc01:{sample:i,grade,halfWidthWorld,shoulderWorld}});
  }

  return zones;
}
