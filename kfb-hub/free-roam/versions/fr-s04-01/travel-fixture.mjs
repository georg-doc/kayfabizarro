// The real, unmodified Travel baker creates the only terrain mesh.
import * as THREE from 'three';
import {createGlobe} from './travel-donor/globe.js';
export function createTravelFixture(scene){
 const scale=.01, radius=16, seed=1842;
 const globe=createGlobe({THREE,radius:5,segments:256,seed,terrainType:'default'});scene.add(globe.group);globe.group.updateMatrixWorld(true);
 const g=globe.mesh.geometry,pos=g.attributes.position,land=g.attributes.landFlag,index=g.index;
 if(!land||!index)throw Error('Travel baked land mask/index unavailable');
 // A dry triangle is not a dry driving area. Select a location clear of water vertices.
 const waterMargin=.34,waterBins=new Map(),cell=p=>[Math.floor(p.x/waterMargin),Math.floor(p.y/waterMargin),Math.floor(p.z/waterMargin)];
 for(let i=0;i<pos.count;i++){if(land.getX(i)>=.99)continue;const p=new THREE.Vector3().fromBufferAttribute(pos,i),key=cell(p).join(',');if(!waterBins.has(key))waterBins.set(key,[]);waterBins.get(key).push(p);}
 function dryNeighborhood(p){const bin=cell(p);for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++){const entries=waterBins.get([bin[0]+x,bin[1]+y,bin[2]+z].join(','));if(entries?.some(v=>v.distanceToSquared(p)<waterMargin*waterMargin))return false;}return true;}
 const a=new THREE.Vector3(),b=a.clone(),c=a.clone(),normal=a.clone(),center=a.clone();let best=null,bestScore=-Infinity;
 for(let i=0;i<index.count;i+=3){const ids=[index.getX(i),index.getX(i+1),index.getX(i+2)];if(ids.some(j=>land.getX(j)<.99))continue;
  a.fromBufferAttribute(pos,ids[0]);b.fromBufferAttribute(pos,ids[1]);c.fromBufferAttribute(pos,ids[2]);center.copy(a).add(b).add(c).multiplyScalar(1/3);
  if(Math.abs(center.y/center.length())>.75)continue;
  normal.subVectors(b,a).cross(c.clone().sub(a));if(normal.lengthSq()<1e-12)continue;normal.normalize();
  const alignment=normal.dot(center.clone().normalize());if(alignment>.995&&alignment>bestScore&&dryNeighborhood(center)){bestScore=alignment;best={origin:center.clone(),triangle:i/3};}
 }
 if(!best)throw Error('No dry, low-slope baked neighborhood for this fixture');
 const origin=best.origin,up=origin.clone().normalize();let east=new THREE.Vector3(0,1,0).cross(up).normalize();const forward=east.clone().cross(up).normalize();east=up.clone().cross(forward).normalize();
 const basis=new THREE.Matrix4().makeBasis(east,up,forward),frameQ=new THREE.Quaternion().setFromRotationMatrix(basis),inverse=frameQ.clone().invert();
 const toWorld=p=>new THREE.Vector3(p.x??p[0],p.y??p[1],p.z??p[2]).multiplyScalar(scale).applyQuaternion(frameQ).add(origin);
 const toLocal=p=>p.clone().sub(origin).applyQuaternion(inverse).multiplyScalar(1/scale);
 // Transform original dry triangles, not a second elevation function or a tangent plane.
 const verts=[],indices=[];let triangles=0;
 for(let i=0;i<index.count;i+=3){const ids=[index.getX(i),index.getX(i+1),index.getX(i+2)];if(ids.some(j=>land.getX(j)<.99))continue;
  const v=ids.map(j=>toLocal(new THREE.Vector3().fromBufferAttribute(pos,j)));
  if(v.every(p=>p.x>40)||v.every(p=>p.x< -40)||v.every(p=>p.z>40)||v.every(p=>p.z< -40)||v.every(p=>p.y< -30))continue;
  const n=verts.length/3;v.forEach(p=>verts.push(p.x,p.y,p.z));indices.push(n,n+1,n+2);triangles++;
 }
 const ray=new THREE.Raycaster();let drySamples=0,minSupportUpDot=1,minHeight=Infinity,maxHeight=-Infinity;
 function height(x,z){ray.set(toWorld([x,30,z]),up.clone().negate());ray.far=.8;const hit=ray.intersectObject(globe.mesh,false)[0];if(!hit)throw Error('No baked support in test region');if([hit.face.a,hit.face.b,hit.face.c].some(i=>land.getX(i)<.99))throw Error('Water face inside dry test region');const h=toLocal(hit.point).y;drySamples++;minHeight=Math.min(minHeight,h);maxHeight=Math.max(maxHeight,h);minSupportUpDot=Math.min(minSupportUpDot,hit.face.normal.dot(up));return h;}
 for(let x=-radius;x<=radius;x+=4)for(let z=-radius;z<=radius;z+=4)if(Math.hypot(x,z)<=radius)height(x,z);
 const surfaces=[{id:'island',shape:'gltf',kind:'terrain',road:true,p:[0,0,0]}];
 // Visible boundary and collider share these declarations; no global DRIVE claim.
 for(let i=0;i<32;i++){const t=i/32*Math.PI*2,x=Math.cos(t)*radius,z=Math.sin(t)*radius;
  const e={id:'boundary-'+i,kind:'wall',p:[x,height(x,z)+.55,z],size:[3.2,1.1,.3],yaw:Math.PI/2-t,restitution:.1};surfaces.push(e);
  const m=new THREE.Mesh(new THREE.BoxGeometry(...e.size),new THREE.MeshStandardMaterial({color:i%2?0x52606a:0xf2c96c,roughness:.9}));m.position.copy(toWorld(e.p));m.quaternion.copy(frameQ).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),e.yaw));m.scale.setScalar(scale);scene.add(m);
 }
 const start={p:[0,1.25,0],yaw:0};
 const inBounds=(p,mode)=>p.every(Number.isFinite)&&Math.hypot(p[0],p[2])<(mode==='safe'?radius-2:radius+5)&&p[1]>-12&&p[1]<35;
 const diagnostics={seed,travelRadius:5,travelUnitsPerPhysicsUnit:scale,bodyHeightReference:.022,localRadius:radius,anchor:origin.toArray(),frameQuaternion:frameQ.toArray(),sourceTriangle:best.triangle,sourceNormalUpDot:bestScore,contactTriangles:triangles,dryAreaSamples:drySamples,waterVertexMargin:waterMargin,sampledHeightRange:maxHeight-minHeight,minSupportUpDot,gravityPolicy:'fixed local -Y; bounded probe only',upBudgetDegrees:3};
 return {globe,toWorld,toLocal,frameQ,up,scale,start,surfaces,inBounds,vertices:new Float32Array(verts),indices:new Uint32Array(indices),diagnostics,
  upError(p){return Math.acos(THREE.MathUtils.clamp(toWorld(p).normalize().dot(up),-1,1))*180/Math.PI;}};
}
