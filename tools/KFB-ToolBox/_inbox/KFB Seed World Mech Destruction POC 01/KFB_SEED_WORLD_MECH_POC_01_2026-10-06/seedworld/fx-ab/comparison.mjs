import * as THREE from 'three';
import { createWorld, clayMaterial, geomFrom } from '../sw-world.js';
import { proto } from '../sw-mesh.js';
import { createDestruct, CAPS } from '../sw-destruct.js';
// Only presentation sampling here. The original destruction and damage writer is unchanged.
const $$=s=>document.querySelector(s), params=new URLSearchParams(location.search), scenario=params.get('scenario')||'single',seed=20261005;
const out={ready:false,error:null,scenario,source:{destruct:'../sw-destruct.js',world:'../sw-world.js',mask:'/media/3D_Assets/FX_Visual/brackeys_vfx_bundle/particles/alpha/smoke_03_a.png'},status:'INITIALISING'};
window.__KFB_SPELLSPILL_FX_AB__=out;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(53,980/640,.1,900), host=$$('#view');
const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'low-power',preserveDrawingBuffer:true});
renderer.setPixelRatio(1);renderer.setSize(980,640);renderer.toneMapping=THREE.NeutralToneMapping;renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.info.autoReset=false;
host.appendChild(renderer.domElement);
const ambient=new THREE.HemisphereLight('#e8eef2','#8a7a60',1.15), sun=new THREE.DirectionalLight('#fff1d6',2.5);
sun.position.set(90,160,60);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
Object.assign(sun.shadow.camera,{left:-95,right:95,top:95,bottom:-95,near:1,far:420});sun.shadow.normalBias=.6;
scene.add(ambient,sun,sun.target);
let world,destruct,dust,alpha,texture,loadOk=false,target=null;
const snapshots=[];
const seeded=(initial)=>{let s=initial>>>0;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296}};
const pause=()=>new Promise(r=>setTimeout(r,0));
const q=(v,p)=>{if(!v.length)return null;const s=[...v].sort((a,b)=>a-b);return +s[Math.min(s.length-1,Math.floor((s.length-1)*p))].toFixed(2)};
const M=new THREE.Matrix4(),P=new THREE.Vector3(),R=new THREE.Quaternion(),S=new THREE.Vector3(),C=new THREE.Color();
function smokeVisibility(mode){
 const count=out.originalDustCount;
 if(mode==='none'){dust.visible=false;alpha.visible=false;alpha.count=0;}
 if(mode==='a'){dust.visible=true;dust.count=count;alpha.visible=false;alpha.count=0;}
 if(mode==='b'){dust.visible=false;alpha.visible=true;alpha.count=count;}
 if(mode==='c'){dust.visible=count>0;dust.count=Math.min(9,count);alpha.visible=true;alpha.count=Math.max(0,count-9);}
 out.variant=mode; $$('#info').textContent=JSON.stringify({variant:mode,scenario,originalDust:count,drawn3D:dust.visible?dust.count:0,drawn2D:alpha.visible?alpha.count:0,damage:out.damageEvidence},null,2);
}
async function build(){
 const mat=clayMaterial();
 // Exact same source material as the POC; it is the documented clay_floor_001 stand-in, NOT canonical K1/H0/K2 Golden.
 await mat.userData.load().catch(()=>false);
 world=createWorld({scene,seed,material:mat,budgetMs:8,useWorker:true});
 const prev=Math.random;Math.random=seeded(0x4b4642);
 try{destruct=createDestruct({scene,world,material:mat,winGeo:geomFrom(proto('win')),doorGeo:geomFrom(proto('door'))})}finally{Math.random=prev}
 dust=destruct.meshes.find(x=>x===destruct.meshes[6]);
 if(!dust || !dust.isInstancedMesh || dust.geometry.type!=='IcosahedronGeometry')throw Error('actual source 3D dust instance missing');
 const mask=$$('#mask-original');await new Promise((resolve,reject)=>{if(mask.complete)return mask.naturalWidth?resolve():reject(Error('image empty'));mask.onload=resolve;mask.onerror=()=>reject(Error('source mask missing'))});
 texture=await new THREE.TextureLoader().loadAsync(out.source.mask);texture.colorSpace=THREE.SRGBColorSpace;
 if(!mask.naturalWidth||texture.image.width!==mask.naturalWidth)throw Error('real mask mismatch');
 loadOk=true;
 alpha=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:texture,color:'#a39b8b',transparent:true,opacity:0.8,depthWrite:false,side:THREE.DoubleSide,alphaTest:0.025,fog:true}),CAPS.dust);
 alpha.count=0;alpha.visible=false;alpha.renderOrder=20;alpha.frustumCulled=false;alpha.name='original-KFB-smoke-03-alpha-adapter';scene.add(alpha);
 const timeout=performance.now()+70000;
 while(performance.now()<timeout){
   world.update(0,0);
   const candidates=world.buildingsNear(0,0,35).filter(b=>b.rec?.floors>=2);
   if(candidates.length>=5){target=candidates.map(x=>x.rec).sort((a,b)=>Math.hypot(a.centroid[0],a.centroid[1])-Math.hypot(b.centroid[0],b.centroid[1]))[0];break;}
   await new Promise(r=>setTimeout(r,16));
 }
 if(!target)throw Error('SOURCE_REQUIRED: existing seed world did not load real near buildings');
 const cx=target.centroid[0],cz=target.centroid[1];
 camera.position.set(cx+36,target.baseY+31,cz+39);camera.lookAt(cx,target.baseY+5,cz);
 scene.background=new THREE.Color(world.gen.type.sky);scene.fog=new THREE.Fog(world.gen.type.fog,170,430);
 sun.position.set(cx+90,target.baseY+160,cz+60);sun.target.position.set(cx,0,cz);sun.target.updateMatrixWorld();sun.updateMatrixWorld();
 // Let pending source world chunk jobs settle before comparison, but no target-device FPS assertion.
 const end=performance.now()+30000;
 while(world.pending()>0&&performance.now()<end){world.update(cx,cz);await new Promise(r=>setTimeout(r,16));}
 out.streamingPendingBeforeRun=world.pending();out.sourceBuildingId=target.id;
 const near=world.buildingsNear(cx,cz,38).map(x=>x.rec).filter(r=>r.id&&r.centroid);
 near.sort((a,b)=>Math.hypot(a.centroid[0]-cx,a.centroid[1]-cz)-Math.hypot(b.centroid[0]-cx,b.centroid[1]-cz));
 let times=scenario==='single'?[0]:scenario==='four'?[0,6,12,18]:[0,2,4,6,8,10,12,14,16,18,20,22];
 let when=times.map((t,i)=>({t,r:near[i%near.length]}));
 let damageStepMs=[];
 for(let step=0;step<43;step++){
   for(const item of when.filter(x=>x.t===step)){
     const rec=item.r,dir=new THREE.Vector3(0,.2,-1).normalize();
     destruct.rocket(new THREE.Vector3(rec.centroid[0],rec.baseY+Math.min(3,rec.height*.3),rec.centroid[1]),dir);
   }
   const start=performance.now();destruct.update(1/60,null);damageStepMs.push(performance.now()-start);
   if(step%3===0)await pause();
 }
 const all=destruct.meshes,dustMesh=all[6];const cnt=dustMesh.count;
 out.originalDustCount=cnt;out.damageEvidence={events:when.length,cellsLost:destruct.stats.cellsLost,cascades:destruct.stats.cascades,debris:destruct.stats.debris,smoke:cnt,chips:destruct.stats.chips,fire:destruct.stats.fire,promoted:destruct.stats.promoted,peakVfx:destruct.stats.vfxPeak,updateMs:{p50:q(damageStepMs,.5),p95:q(damageStepMs,.95),p99:q(damageStepMs,.99)}};
 for(let i=0;i<cnt;i++){
   dustMesh.getMatrixAt(i,M);M.decompose(P,R,S);
   // Billboard plane aligned to the SAME camera; real source mask, identical underlying dust positions/scale.
   M.compose(P,camera.quaternion,new THREE.Vector3(S.x*1.3,S.y*1.3,1));alpha.setMatrixAt(i,M);
 }
 alpha.instanceMatrix.needsUpdate=true;
 if(!cnt)throw Error('Original source smoke pool empty in '+scenario);
 // Source isolation: the exact Brackeys alpha is separately shown above; this confirms actual 3D dust geometry source.
 out.isolated={alphaNaturalWidth:mask.naturalWidth,threeGeometry:dust.geometry.type,damageFromSource:true,dustInstanceCount:cnt,sourceRevision:THREE.REVISION};
 smokeVisibility('a');renderer.render(scene,camera);out.ready=true;out.status='READY';
}
out.measure=async(mode,frames=38)=>{
 if(!out.ready||!['none','a','b','c'].includes(mode))throw Error('not ready or invalid variant');
 smokeVisibility(mode);renderer.compile(scene,camera);
 for(let i=0;i<5;i++)renderer.render(scene,camera);
 let renderMs=[],intervalMs=[],calls=0,tris=0,last=0;
 for(let i=0;i<frames;i++){
   await new Promise(requestAnimationFrame);const start=performance.now();
   if(last)intervalMs.push(start-last);last=start;
   renderer.info.reset();renderer.render(scene,camera);renderMs.push(performance.now()-start);
   calls+=renderer.info.render.calls;tris=Math.max(tris,renderer.info.render.triangles);
 }
 const result={variant:mode,scenario,frames,sourceDust:out.originalDustCount,visual3D:dust.visible?dust.count:0,visual2D:alpha.visible?alpha.count:0,renderSubmitMs:{p50:q(renderMs,.5),p95:q(renderMs,.95),p99:q(renderMs,.99)},rafIntervalMs:{p50:q(intervalMs,.5),p95:q(intervalMs,.95),p99:q(intervalMs,.99)},callsAvg:Math.round(calls/frames),trisMax:tris,rendererInfo:{geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures},damageEvidence:out.damageEvidence,engine:'headless fixture, real source POC, not target GPU'};
 out.lastResult=result;return result;
};
for(const button of document.querySelectorAll('[data-mode]'))button.onclick=()=>out.measure(button.dataset.mode,20).catch(e=>$$('#info').textContent=e.message);
build().catch(e=>{out.error=String(e.stack||e);out.status='FAIL';$$('#info').textContent=out.error;console.error(e)});
