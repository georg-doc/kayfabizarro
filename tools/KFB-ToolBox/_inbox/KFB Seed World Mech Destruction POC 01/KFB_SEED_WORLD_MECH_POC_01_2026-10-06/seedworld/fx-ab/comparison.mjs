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
let world,destruct,dust,clayOverlay,alpha,texture,loadOk=false,target=null;
let shardProxy,debrisHero,sourceDebris,sourceChips;
let sourceDebrisCount=0,sourceChipsCount=0;
let isolationState=null;
const sourceDustInstances=[];
let baselinePixels=null;
const seeded=(initial)=>{let s=initial>>>0;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296}};
const pause=()=>new Promise(r=>setTimeout(r,0));
const q=(v,p)=>{if(!v.length)return null;const s=[...v].sort((a,b)=>a-b);return +s[Math.min(s.length-1,Math.floor((s.length-1)*p))].toFixed(2)};
const M=new THREE.Matrix4(),P=new THREE.Vector3(),R=new THREE.Quaternion(),S=new THREE.Vector3(),C=new THREE.Color();
// Optional fourth PRESENTATION ONLY profile. SOURCE positions remain unchanged.
const SATURATED_FX_BUDGET=Object.freeze({hero3D:3,smoke2D:28,tilePx:110,worldPx:[980,640],clayScale:2.3,smokeScale:5.2});
function chooseBudgetIndices(){
 const projected=[],vec=new THREE.Vector3(),chosen=[],seen=new Set();
 camera.updateMatrixWorld();
 // Newer original source puffs are preferred, one representative per screen tile.
 for(let i=sourceDustInstances.length-1;i>=0;i--){
  const v=sourceDustInstances[i];vec.copy(v.p).project(camera);
  if(!Number.isFinite(vec.x)||!Number.isFinite(vec.y)||vec.z<-.95||vec.z>1)continue;
  const x=(vec.x+1)*490,y=(1-vec.y)*320;
  if(x<0||x>=980||y<0||y>=640)continue;
  projected.push({i,x,y,key:Math.floor(x/SATURATED_FX_BUDGET.tilePx)+':'+Math.floor(y/SATURATED_FX_BUDGET.tilePx)});
 }
 // Select a few distinct near-impact lobes first; do not spawn a second particle simulation.
 const hero=[];
 for(const p of projected){if(hero.length>=SATURATED_FX_BUDGET.hero3D)break;if(seen.has(p.key))continue;hero.push(p.i);seen.add(p.key);}
 // Preserve coverage of the whole impact region without stacking dozens of overlapping alpha quads.
 const sprites=[],spriteTiles=new Set();
 for(const p of projected){if(sprites.length>=SATURATED_FX_BUDGET.smoke2D)break;if(hero.includes(p.i)||spriteTiles.has(p.key))continue;sprites.push(p.i);spriteTiles.add(p.key);}
 return {hero,sprites,candidateVisible:projected.length,droppedMath:max0(sourceDustInstances.length-hero.length-sprites.length),tilePx:SATURATED_FX_BUDGET.tilePx};
}
function max0(n){return Math.max(0,n);}
// R3 is still a frozen-frame test adapter. One authoritative event/transform stream,
// and the original source 3D meshes always remain available in modes NONE/A/B/C/D/E.
const READABLE_FX_BUDGET=Object.freeze({hero3D:2,smoke2D:48,tilePx:70,perTile:3,clayScale:1.55,smokeScale:7.8,near3DDebris:12,shardScale:.65});
function selectReadableSourceIds(){
 const candidates=[],tileCounts=new Map(),v=new THREE.Vector3();camera.updateMatrixWorld();
 for(let i=sourceDustInstances.length-1;i>=0;i--){
  const x=sourceDustInstances[i];v.copy(x.p).project(camera);
  if(!Number.isFinite(v.x)||!Number.isFinite(v.y)||v.z<-.95||v.z>1)continue;
  const px=(v.x+1)*490,py=(1-v.y)*320;
  if(px<0||px>=980||py<0||py>=640)continue;
  candidates.push({i,key:Math.floor(px/READABLE_FX_BUDGET.tilePx)+':'+Math.floor(py/READABLE_FX_BUDGET.tilePx)});
 }
 const hero=[],sprites=[];
 for(const c of candidates){
  if(hero.length<READABLE_FX_BUDGET.hero3D && !hero.some(i=>sourceDustInstances[i].p.distanceTo(sourceDustInstances[c.i].p)<1.3)){hero.push(c.i);continue;}
  if(sprites.length>=READABLE_FX_BUDGET.smoke2D)continue;
  const n=tileCounts.get(c.key)||0;
  if(n>=READABLE_FX_BUDGET.perTile)continue;
  if(hero.includes(c.i))continue;
  sprites.push(c.i);tileCounts.set(c.key,n+1);
 }
 return {hero,sprites,candidateVisible:candidates.length,sourceUnrepresented:max0(sourceDustInstances.length-hero.length-sprites.length),tilePx:READABLE_FX_BUDGET.tilePx,perTile:READABLE_FX_BUDGET.perTile};
}
function createFlatShardGeometry(){
 // A genuine planar jagged wood/chip silhouette, 5 vertices and 3 triangles,
 // not a new donor texture or a replacement for any gameplay physics chunk.
 const g=new THREE.BufferGeometry();
 g.setAttribute('position',new THREE.Float32BufferAttribute([-.47,-.23,0, -.21,.29,0, .12,.52,0, .46,.12,0, .22,-.41,0],3));
 g.setIndex([0,1,2,0,2,3,0,3,4]);g.computeVertexNormals();return g;
}
const shardTmp=new THREE.Matrix4(),shardPos=new THREE.Vector3(),shardQ=new THREE.Quaternion(),shardS=new THREE.Vector3(),shardCol=new THREE.Color(),zTurn=new THREE.Quaternion();
function showPlanarDebris(enabled){
 if(!sourceDebris||!sourceChips||!shardProxy||!debrisHero)return;
 if(isolationState){sourceDebris.visible=false;sourceChips.visible=false;shardProxy.visible=false;debrisHero.visible=false;return;}
 sourceDebris.visible=!enabled;sourceChips.visible=!enabled;
 shardProxy.visible=enabled;debrisHero.visible=enabled;
 if(!enabled){shardProxy.count=0;debrisHero.count=0;return;}
 let near=[],far=[];
 for(let i=0;i<sourceDebrisCount;i++){
  sourceDebris.getMatrixAt(i,shardTmp);shardTmp.decompose(shardPos,shardQ,shardS);
  const item={i,dist:shardPos.distanceToSquared(camera.position)};
  (near.length<READABLE_FX_BUDGET.near3DDebris?near:far).push(item);
 }
 // Preserve a small foreground group in exactly the original rounded source material.
 const sorted=near.concat(far).sort((a,b)=>a.dist-b.dist),hero=sorted.slice(0,READABLE_FX_BUDGET.near3DDebris);
 const heroIDs=new Set(hero.map(x=>x.i)),proxyIDs=sorted.filter(x=>!heroIDs.has(x.i));
 for(let j=0;j<hero.length;j++){
  const i=hero[j].i;sourceDebris.getMatrixAt(i,shardTmp);debrisHero.setMatrixAt(j,shardTmp);
  sourceDebris.getColorAt(i,shardCol);debrisHero.setColorAt(j,shardCol);
 }
 debrisHero.count=hero.length;if(hero.length){debrisHero.instanceMatrix.needsUpdate=true;debrisHero.instanceColor.needsUpdate=true;}
 let n=0;
 const add=(src,i,scale,rotSeed)=>{
  src.getMatrixAt(i,shardTmp);shardTmp.decompose(shardPos,shardQ,shardS);
  zTurn.setFromAxisAngle(new THREE.Vector3(0,0,1),rotSeed);
  shardQ.copy(camera.quaternion).multiply(zTurn);
  shardS.set(Math.max(.07,shardS.x*scale),Math.max(.09,shardS.y*scale),1);
  shardTmp.compose(shardPos,shardQ,shardS);shardProxy.setMatrixAt(n,shardTmp);
  src.getColorAt(i,shardCol);shardProxy.setColorAt(n,shardCol);n++;
 };
 proxyIDs.forEach(({i})=>add(sourceDebris,i,READABLE_FX_BUDGET.shardScale,(i*0.71)%6.28));
 for(let i=0;i<sourceChipsCount;i++)add(sourceChips,i,.9,(i*1.13)%6.28);
 shardProxy.count=n;
 if(n){shardProxy.instanceMatrix.needsUpdate=true;shardProxy.instanceColor.needsUpdate=true;}
 out.shardBudget={originalDebris:sourceDebrisCount,originalChips:sourceChipsCount,originalDebris3D:hero.length,planeDebris:n-sourceChipsCount,planeChips:sourceChipsCount,planeTotal:n,geometryTrianglesPerInstance:3,sourceUnmodified:true};
}

function smokeVisibility(mode){
 const count=out.originalDustCount;
 // Source instance transforms are sampled once from the actual POC; only these display copies change.
 dust.visible=false;
 clayOverlay.visible=mode==='a'||mode==='c';
 clayOverlay.count=mode==='a'?count:mode==='c'?Math.min(9,count):0;
 for(let i=0;i<clayOverlay.count;i++){
   const x=sourceDustInstances[i];M.compose(x.p,x.q,new THREE.Vector3(x.s.x*5,x.s.y*5,x.s.z*5));clayOverlay.setMatrixAt(i,M);
   clayOverlay.setColorAt(i,x.color);
 }
 if(clayOverlay.count){clayOverlay.instanceMatrix.needsUpdate=true;clayOverlay.instanceColor.needsUpdate=true;}
 alpha.visible=mode==='b'||mode==='c';
 const from=mode==='c'?Math.min(9,count):0;
 alpha.count=alpha.visible?count-from:0;
 if(alpha.visible){
   for(let i=from;i<count;i++){const x=sourceDustInstances[i];M.compose(x.p,camera.quaternion,new THREE.Vector3(x.s.x*6.5,x.s.y*6.5,1));alpha.setMatrixAt(i-from,M);}
   alpha.instanceMatrix.needsUpdate=true;
 }
 let activeBudget=null;
 if(mode==='e'||mode==='f'){
   activeBudget=selectReadableSourceIds();
   clayOverlay.visible=activeBudget.hero.length>0;clayOverlay.count=activeBudget.hero.length;
   for(let j=0;j<activeBudget.hero.length;j++){
     const x=sourceDustInstances[activeBudget.hero[j]];
     M.compose(x.p,x.q,new THREE.Vector3(x.s.x*READABLE_FX_BUDGET.clayScale,x.s.y*READABLE_FX_BUDGET.clayScale,x.s.z*READABLE_FX_BUDGET.clayScale));
     clayOverlay.setMatrixAt(j,M);clayOverlay.setColorAt(j,x.color.clone().multiplyScalar(.66));
   }
   if(clayOverlay.count){clayOverlay.instanceMatrix.needsUpdate=true;clayOverlay.instanceColor.needsUpdate=true;}
   alpha.visible=activeBudget.sprites.length>0;alpha.count=activeBudget.sprites.length;
   alpha.material.color.set('#55504d');alpha.material.opacity=.96;
   for(let j=0;j<activeBudget.sprites.length;j++){
     const x=sourceDustInstances[activeBudget.sprites[j]];
     const scale=READABLE_FX_BUDGET.smokeScale*(.85+((j*11)%9)/30);
     M.compose(x.p,camera.quaternion,new THREE.Vector3(x.s.x*scale,x.s.y*scale,1));alpha.setMatrixAt(j,M);
   }
   if(alpha.count)alpha.instanceMatrix.needsUpdate=true;
 }
 if(mode==='d'){
   activeBudget=chooseBudgetIndices();
   clayOverlay.visible=activeBudget.hero.length>0;clayOverlay.count=activeBudget.hero.length;
   for(let j=0;j<activeBudget.hero.length;j++){
     const x=sourceDustInstances[activeBudget.hero[j]];
     M.compose(x.p,x.q,new THREE.Vector3(x.s.x*SATURATED_FX_BUDGET.clayScale,x.s.y*SATURATED_FX_BUDGET.clayScale,x.s.z*SATURATED_FX_BUDGET.clayScale));
     clayOverlay.setMatrixAt(j,M);clayOverlay.setColorAt(j,x.color.clone().multiplyScalar(.78));
   }
   if(clayOverlay.count){clayOverlay.instanceMatrix.needsUpdate=true;clayOverlay.instanceColor.needsUpdate=true;}
   alpha.material.color.set('#68635d'); // subdued neutral clay-gray, adapter only, not style Golden
   alpha.material.opacity=.90;
   alpha.visible=activeBudget.sprites.length>0;alpha.count=activeBudget.sprites.length;
   for(let j=0;j<activeBudget.sprites.length;j++){
     const x=sourceDustInstances[activeBudget.sprites[j]];
     const size=SATURATED_FX_BUDGET.smokeScale*(.88+((j*13)%7)/25);
     M.compose(x.p,camera.quaternion,new THREE.Vector3(x.s.x*size,x.s.y*size,1));
     alpha.setMatrixAt(j,M);
   }
   if(alpha.count)alpha.instanceMatrix.needsUpdate=true;
 }else if(mode!=='e'&&mode!=='f'){
   alpha.material.color.set('#8f867f');alpha.material.opacity=.96;
 }
 showPlanarDebris(mode==='f');
 out.budget=activeBudget;

 out.variant=mode;
 $$('#info').textContent=JSON.stringify({variant:mode,scenario,originalDust:count,drawn3D:clayOverlay.visible?clayOverlay.count:0,drawn2D:alpha.visible?alpha.count:0,damage:out.damageEvidence},null,2);
}
out.isolate=(mode)=>{
 if(!out.ready||!['a','b'].includes(mode))throw Error('source isolation must use actual loaded source');
 if(isolationState)throw Error('source already isolated');
 isolationState={background:scene.background,world:world.root.visible,sourceMeshes:destruct.meshes.map(m=>m.visible),variant:out.variant};
 world.root.visible=false;for(const m of destruct.meshes)m.visible=false;
 scene.background=new THREE.Color('#4f4b45');smokeVisibility(mode);renderer.render(scene,camera);
 return {mode,actualPOC3D:clayOverlay.count,actualBrackeys2D:alpha.count};
};
out.restoreIsolation=()=>{
 if(!isolationState)return false;
 scene.background=isolationState.background;world.root.visible=isolationState.world;
 destruct.meshes.forEach((m,i)=>m.visible=isolationState.sourceMeshes[i]);
 const prev=isolationState.variant;isolationState=null;smokeVisibility(prev);renderer.render(scene,camera);return true;
};
out.isolateShards=(mode)=>{
 if(!out.ready||!['original','planar'].includes(mode)||isolationState)throw Error('real source shards not ready / already isolated');
 isolationState={kind:'shards',background:scene.background,world:world.root.visible,sourceMeshes:destruct.meshes.map(m=>m.visible),variant:out.variant};
 world.root.visible=false;for(const m of destruct.meshes)m.visible=false;
 clayOverlay.visible=false;alpha.visible=false;shardProxy.visible=false;debrisHero.visible=false;
 scene.background=new THREE.Color('#54514a');
 if(mode==='original'){sourceDebris.visible=true;sourceChips.visible=true;}
 else{
  isolationState=null;showPlanarDebris(true);
  // Keep detached source cells hidden, only real-source planar debris/chips.
  isolationState={kind:'shards',background:scene.background,world:false,sourceMeshes:destruct.meshes.map(m=>m.visible),variant:out.variant,restoreOriginal:true};
 }
 renderer.render(scene,camera);
 return {mode,originalSourceDebris:sourceDebrisCount,originalSourceChips:sourceChipsCount,drawnPlanar:mode==='planar'?shardProxy.count:0};
};
out.restoreShards=()=>{
 if(!isolationState||isolationState.kind!=='shards')throw Error('no shard isolation');
 isolationState=null;world.root.visible=true;
 scene.background=new THREE.Color(world.gen.type.sky);
 // Re-establish saved regular render mode, not source references as a new owner.
 destruct.meshes.forEach(m=>m.visible=true);smokeVisibility(out.variant);renderer.render(scene,camera);
 return true;
};
async function build(){
 const mat=clayMaterial();
 // Exact same source material as the POC; it is the documented clay_floor_001 stand-in, NOT canonical K1/H0/K2 Golden.
 await mat.userData.load().catch(()=>false);
 world=createWorld({scene,seed,material:mat,budgetMs:8,useWorker:true});
 const prev=Math.random;Math.random=seeded(0x4b4642);
 try{destruct=createDestruct({scene,world,material:mat,winGeo:geomFrom(proto('win')),doorGeo:geomFrom(proto('door'))})}finally{Math.random=prev}
 dust=destruct.meshes[6];
 if(!dust || !dust.isInstancedMesh || dust.geometry.type!=='IcosahedronGeometry')throw Error('actual source 3D dust instance missing');
 clayOverlay=new THREE.InstancedMesh(dust.geometry,dust.material,CAPS.dust);
 clayOverlay.count=0;clayOverlay.visible=false;clayOverlay.frustumCulled=false;clayOverlay.name='test-only-scaled-original-source-clay-lobes';scene.add(clayOverlay);
 const mask=$$('#mask-original');await new Promise((resolve,reject)=>{if(mask.complete)return mask.naturalWidth?resolve():reject(Error('image empty'));mask.onload=resolve;mask.onerror=()=>reject(Error('source mask missing'))});
 texture=await new THREE.TextureLoader().loadAsync(out.source.mask);texture.colorSpace=THREE.SRGBColorSpace;
 if(!mask.naturalWidth||texture.image.width!==mask.naturalWidth)throw Error('real mask mismatch');
 loadOk=true;
 alpha=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:texture,color:'#8f867f',transparent:true,opacity:0.96,depthWrite:false,side:THREE.DoubleSide,alphaTest:0.015,fog:true}),CAPS.dust);
 alpha.count=0;alpha.visible=false;alpha.renderOrder=20;alpha.frustumCulled=false;alpha.name='original-KFB-smoke-03-alpha-adapter';scene.add(alpha);
 // Original POC dynamic source is still sole owner of real structural debris + chips.
 // This immutable shared geometry is a *presentation proxy* for the same frozen instances.
 sourceDebris=destruct.meshes[3];sourceChips=destruct.meshes[5];
 if(!sourceDebris.isInstancedMesh||!sourceChips.isInstancedMesh)throw Error('actual POC debris/chips source missing');
 const shardGeom=createFlatShardGeometry();
 shardProxy=new THREE.InstancedMesh(shardGeom,new THREE.MeshBasicMaterial({color:'#fff',side:THREE.DoubleSide,depthWrite:true,transparent:false,polygonOffset:true,polygonOffsetFactor:-1}),CAPS.debris+CAPS.chips);
 shardProxy.count=0;shardProxy.visible=false;shardProxy.frustumCulled=false;shardProxy.name='source-event-planar-shards-test-only';scene.add(shardProxy);
 debrisHero=new THREE.InstancedMesh(sourceDebris.geometry,sourceDebris.material,CAPS.debris);
 debrisHero.count=0;debrisHero.visible=false;debrisHero.frustumCulled=false;debrisHero.name='exact-POC-debris-foreground-source';scene.add(debrisHero);
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
 // The block stress re-hits four real neighbouring structures, rather than lightly tagging 12 unrelated buildings.
 let when=times.map((t,i)=>({t,r:near[scenario==='block'?i%Math.min(4,near.length):i%near.length]}));
 let damageStepMs=[];
 for(let step=0;step<43;step++){
   for(const item of when.filter(x=>x.t===step)){
     const rec=item.r,dir=new THREE.Vector3(0,.2,-1).normalize();
     destruct.rocket(new THREE.Vector3(rec.centroid[0],rec.baseY+(scenario==='block'?1.35:Math.min(3,rec.height*.3)),rec.centroid[1]),dir);
   }
   const start=performance.now();destruct.update(1/60,null);damageStepMs.push(performance.now()-start);
   if(step%3===0)await pause();
 }
 const all=destruct.meshes,dustMesh=all[6];const cnt=dustMesh.count;
 sourceDebrisCount=sourceDebris.count;sourceChipsCount=sourceChips.count;
 out.originalDebrisCount=sourceDebrisCount;out.originalChipsCount=sourceChipsCount;
 out.originalDustCount=cnt;
 // Reframe only this read-only test camera onto actual observed POC smoke, not an imagined target.
 let sum=new THREE.Vector3(),num=0;
 for(let i=0;i<cnt;i++){
   dustMesh.getMatrixAt(i,M);M.decompose(P,R,S);
   const originColor=new THREE.Color();dustMesh.getColorAt(i,originColor);sourceDustInstances.push({p:P.clone(),q:R.clone(),s:S.clone(),color:originColor});
   if(i>=Math.max(0,cnt-70)){sum.add(P);num++;}
 }
 if(num){sum.divideScalar(num);const k=scenario==='single'?1:scenario==='four'?1.25:1.7;camera.position.set(sum.x+13*k,sum.y+21*k,sum.z+16*k);camera.lookAt(sum);camera.updateMatrixWorld();out.smokeCenter=sum.toArray();}
out.damageEvidence={events:when.length,cellsLost:destruct.stats.cellsLost,cascades:destruct.stats.cascades,debris:destruct.stats.debris,smoke:cnt,chips:destruct.stats.chips,fire:destruct.stats.fire,promoted:destruct.stats.promoted,peakVfx:destruct.stats.vfxPeak,updateMs:{p50:q(damageStepMs,.5),p95:q(damageStepMs,.95),p99:q(damageStepMs,.99)}};
 // B/C instance buffers are filled from these pinned original 3D source positions by smokeVisibility().

 if(!cnt)throw Error('Original source smoke pool empty in '+scenario);
 // Source isolation: the exact Brackeys alpha is separately shown above; this confirms actual 3D dust geometry source.
 out.isolated={alphaNaturalWidth:mask.naturalWidth,threeGeometry:dust.geometry.type,damageFromSource:true,dustInstanceCount:cnt,sourceRevision:THREE.REVISION};
 smokeVisibility('a');renderer.render(scene,camera);out.ready=true;out.status='READY';
}
out.measure=async(mode,frames=38)=>{
 if(!out.ready||!['none','a','b','c','d','e','f'].includes(mode))throw Error('not ready or invalid variant');
 smokeVisibility(mode);renderer.compile(scene,camera);
 for(let i=0;i<5;i++)renderer.render(scene,camera);
 let renderMs=[],intervalMs=[],calls=0,tris=0,last=0;
 for(let i=0;i<frames;i++){
   await new Promise(requestAnimationFrame);const start=performance.now();
   if(last)intervalMs.push(start-last);last=start;
   renderer.info.reset();renderer.render(scene,camera);renderMs.push(performance.now()-start);
   calls+=renderer.info.render.calls;tris=Math.max(tris,renderer.info.render.triangles);
 }
 // Pixel signal is counted after timing, so source presence is not mistaken for visual coverage.
 const probe=document.createElement('canvas');probe.width=980;probe.height=640;
 const ctx=probe.getContext('2d',{willReadFrequently:true});ctx.drawImage(renderer.domElement,0,0);
 const px=ctx.getImageData(0,0,980,640).data;
 let visible=null;
 if(mode==='none')baselinePixels=px.slice();
 else if(baselinePixels){let changed=0,checked=0,delta=0;for(let i=0;i<px.length;i+=16){const d=(Math.abs(px[i]-baselinePixels[i])+Math.abs(px[i+1]-baselinePixels[i+1])+Math.abs(px[i+2]-baselinePixels[i+2]))/3;delta+=d;if(d>8)changed++;checked++;}visible={changedPercent:+(100*changed/checked).toFixed(3),meanDifference:+(delta/checked).toFixed(3),samplePixels:checked};}
 const result={variant:mode,scenario,frames,sourceDust:out.originalDustCount,budget:['d','e','f'].includes(mode)?out.budget:null,shards:mode==='f'?out.shardBudget:null,pixelDiffVsNoSmoke:visible,visual3D:clayOverlay.visible?clayOverlay.count:0,visual2D:alpha.visible?alpha.count:0,renderSubmitMs:{p50:q(renderMs,.5),p95:q(renderMs,.95),p99:q(renderMs,.99)},rafIntervalMs:{p50:q(intervalMs,.5),p95:q(intervalMs,.95),p99:q(intervalMs,.99)},callsAvg:Math.round(calls/frames),trisMax:tris,rendererInfo:{geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures},damageEvidence:out.damageEvidence,engine:'headless fixture, real source POC, not target GPU'};
 out.lastResult=result;return result;
};
for(const button of document.querySelectorAll('[data-mode]'))button.onclick=()=>out.measure(button.dataset.mode,20).catch(e=>$$('#info').textContent=e.message);
build().catch(e=>{out.error=String(e.stack||e);out.status='FAIL';$$('#info').textContent=out.error;console.error(e)});
