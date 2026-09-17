// Loads the exact accepted host, verifies its Git blob, then appends a read-only visual port.
// Original Race sources are stored BYTE-IDENTICALLY; no step/camera/contact code is patched.
import * as THREE from 'three';
const EXPECTED='84d71552ebe17b7332b18305bb111136ec746577';
const ASSET_PIN='ce1d201217f40abfc8850eb8e7d6ea7ab9d07f39';
export async function startRaceHost(){
  // Pin asset resolution without changing the Race vehicle presentation implementation.
  THREE.DefaultLoadingManager.setURLModifier(url=>url.replace('raw.githubusercontent.com/georg-doc/kayfabizarro/main/','raw.githubusercontent.com/georg-doc/kayfabizarro/'+ASSET_PIN+'/'));
  const url=new URL('./host/feel-lab-v08.mjs',import.meta.url).href;
  const response=await fetch(url);if(!response.ok)throw Error('Accepted host HTTP '+response.status);
  const source=await response.text(),bytes=new TextEncoder().encode(source),head=new TextEncoder().encode(`blob ${bytes.length}\0`),all=new Uint8Array(head.length+bytes.length);all.set(head);all.set(bytes,head.length);
  const blob=[...new Uint8Array(await crypto.subtle.digest('SHA-1',all))].map(v=>v.toString(16).padStart(2,'0')).join('');
  if(blob!==EXPECTED)throw Error('Accepted v0.8 host changed; refusing to load '+blob);
  const resolved=source.replace("'./race-track-adapter.mjs'",JSON.stringify(new URL('./host/race-track-adapter.mjs',import.meta.url).href)).replaceAll('import.meta.url',JSON.stringify(url));
  const footer=`
// Environment donor port: presentation mutations only; all samples are detached copies.
const originalGround=trackGroup.children.find(o=>o.material===MAT.ground);
const hemi=scene.children.find(o=>o.isHemisphereLight);
const initial={background:scene.background,fog:scene.fog,sunColor:sun.color.clone(),sunPosition:sun.position.clone(),hemiColor:hemi.color.clone(),hemiGround:hemi.groundColor.clone()};
export const environmentPort=Object.freeze({
  owner:'KFB Race v0.8',hostBlob:'${EXPECTED}',total:core.total,routeHash:core.hash,
  sample(s){const q=core.sample(s);return {...q,half:halfWidthAtS(s,core.total)}},
  samples(){return core.frames.map((q,i)=>({s:i*core.ds,x:q.pos.x,y:q.pos.y,z:q.pos.z,rx:q.right.x,ry:q.right.y,rz:q.right.z,half:halfWidthAtS(i*core.ds,core.total)}))},
  attach(group){scene.add(group)},detach(group){scene.remove(group)},
  atmosphere(p){originalGround.visible=false;scene.background=new THREE.Color(p.horizon);scene.fog=new THREE.Fog(p.fog.color,p.fog.near,p.fog.far);sun.color.set(p.light);sun.position.fromArray(p.sunDirection).multiplyScalar(100);hemi.color.set(p.ambient);hemi.groundColor.set(p.groundLight)},
  restore(){originalGround.visible=true;scene.background=initial.background;scene.fog=initial.fog;sun.color.copy(initial.sunColor);sun.position.copy(initial.sunPosition);hemi.color.copy(initial.hemiColor);hemi.groundColor.copy(initial.hemiGround)},
  diagnostics(){return {routeHash:core.hash,s:state.s,speed:state.speed,x:state.x,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,camera:camera.position.toArray(),viewDirection:camera.getWorldDirection(new THREE.Vector3()).toArray(),routeBytes:hash(stable(core.route.map(p=>p.toArray()))),widthBytes:hash(stable(core.route.map((p,i)=>halfWidthAtS(i*core.ds,core.total))))}}
});`;
  const objectURL=URL.createObjectURL(new Blob([resolved,footer],{type:'text/javascript'}));
  try{return (await import(objectURL)).environmentPort}finally{URL.revokeObjectURL(objectURL)}
}
