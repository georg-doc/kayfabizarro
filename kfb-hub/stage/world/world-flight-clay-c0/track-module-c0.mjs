import * as THREE from 'three';

const r3=n=>+n.toFixed(3);
const gesture=(t,v)=>{
  const smooth=(a,b,x)=>{const q=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return q*q*(3-2*q)};
  const crest=v.crest.amplitude*(smooth(v.crest.start,(v.crest.start+v.crest.end)/2,t)-smooth((v.crest.start+v.crest.end)/2,v.crest.end,t));
  const dip=v.dip.amplitude*(smooth(v.dip.start,(v.dip.start+v.dip.end)/2,t)-smooth((v.dip.start+v.dip.end)/2,v.dip.end,t));
  const ramp=v.ramp.amplitude*(smooth(v.ramp.riseStart,v.ramp.riseEnd,t)-smooth(v.ramp.deckEnd,v.ramp.landEnd,t));
  return crest+dip+ramp;
};
const widthAt=(profile,t)=>{for(let i=1;i<profile.length;i++){const a=profile[i-1],b=profile[i];if(t<=b[0])return THREE.MathUtils.lerp(a[1],b[1],(t-a[0])/(b[0]-a[0]||1));}return profile.at(-1)[1]};
function strip(points,left,right,color,name){
  const P=[],I=[];
  for(let i=0;i<points.length;i++){
    const p=points[i],n=p.n;
    for(const d of [left(p),right(p)])P.push(p.c.x+n.x*d,p.y,p.c.z+n.z*d);
    if(i){const k=i*2;I.push(k-2,k-1,k,k-1,k+1,k)}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setIndex(I);g.computeVertexNormals();
  const m=new THREE.MeshStandardMaterial({color,roughness:.91,metalness:0,side:THREE.DoubleSide});
  const mesh=new THREE.Mesh(g,m);mesh.name=name;mesh.receiveShadow=true;return mesh;
}

export async function mountTrackModule(app){
  if(!app?.world||!app?.play)throw Error('Track C0 needs ready World r2 play scene');
  const source=await fetch('./TRACK_MODULE_SOURCE.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Track source HTTP '+r.status);return r.json()});
  const spawn=app.world.spawn, heading=spawn.heading||0, sy=Math.sin(heading),cy=Math.cos(heading);
  const local=[[-34,-4],[-25,34],[6,58],[48,55],[78,24],[66,-16],[28,-34],[-14,-27],[-34,-4]].map(([x,z])=>new THREE.Vector3(x,0,z));
  const curve=new THREE.CatmullRomCurve3(local,true,'centripetal',.45),N=180,pts=[];
  const toWorld=v=>new THREE.Vector3(spawn.x+v.x*cy+v.z*sy,0,spawn.z-v.x*sy+v.z*cy);
  for(let i=0;i<=N;i++){
    const t=i/N,c=toWorld(curve.getPointAt(t)),tan0=curve.getTangentAt(t),tan=new THREE.Vector3(tan0.x*cy+tan0.z*sy,0,-tan0.x*sy+tan0.z*cy).normalize(),n=new THREE.Vector3(-tan.z,0,tan.x),w=widthAt(source.widthProfile,t)/2;
    const base=app.play.ground(c.x,c.z)+.11,y=base+gesture(t,source.verticalGestures);
    pts.push({t,c,tan,n,w,y});
  }
  const group=new THREE.Group();group.name='Track module · ST01 source recipe · C0 placement';
  const road=strip(pts,p=>-p.w,p=>p.w,0x5f5667,'track road · clay asphalt');
  const walkL=strip(pts,p=>-p.w-2.2,p=>-p.w-.28,0xa89ba1,'track sidewalk left');
  const walkR=strip(pts,p=>p.w+.28,p=>p.w+2.2,0xa89ba1,'track sidewalk right');
  group.add(walkL,walkR,road);
  const curbGeo=new THREE.BoxGeometry(1.45,.26,.48),curbMat=new THREE.MeshStandardMaterial({color:0xd29a56,roughness:.96}),count=Math.floor(N/3)*2,curbs=new THREE.InstancedMesh(curbGeo,curbMat,count);
  const M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(1,1,1),UP=new THREE.Vector3(0,1,0);let k=0;
  for(let i=0;i<N;i+=3){const p=pts[i],yaw=Math.atan2(p.tan.x,p.tan.z);Q.setFromAxisAngle(UP,yaw);for(const s of [-1,1]){const x=p.c.x+p.n.x*(s*(p.w+.08)),z=p.c.z+p.n.z*(s*(p.w+.08));M.compose(new THREE.Vector3(x,p.y+.13,z),Q,S);curbs.setMatrixAt(k++,M)}}
  curbs.count=k;curbs.name='clay curb stone rhythm';curbs.receiveShadow=true;group.add(curbs);
  const markerMat=new THREE.MeshStandardMaterial({color:0xe85f47,roughness:.8});
  for(const [id,p] of [['track.entry',pts[0]],['track.exit',pts.at(-2)]]){const m=new THREE.Mesh(new THREE.CylinderGeometry(.35,.5,1.5,8),markerMat);m.name=id;m.position.set(p.c.x,p.y+.75,p.c.z);group.add(m)}
  app.scene.add(group);
  const original={road:road.material.color.getHex(),walk:walkL.material.color.getHex(),curb:curbMat.color.getHex()};
  function setClay(on){road.material.color.set(on?0x514754:original.road);for(const m of [walkL,walkR])m.material.color.set(on?0x9b9097:original.walk);curbMat.color.set(on?0xd78a4c:original.curb);for(const m of [road,walkL,walkR]){m.material.roughness=on ? .98 : .91;m.material.needsUpdate=true}}
  return {group,source,points:pts,setClay,report:()=>({schema:'kfb.track-module-c0/1',sourceRevision:source.revision,sourceOwner:source.owner,connectors:['track.entry','track.exit'],samples:pts.length,widthM:[Math.min(...pts.map(p=>p.w*2)),Math.max(...pts.map(p=>p.w*2))].map(r3),curbSegments:k,placement:{x:r3(spawn.x),z:r3(spawn.z),heading:r3(heading)}})};
}
