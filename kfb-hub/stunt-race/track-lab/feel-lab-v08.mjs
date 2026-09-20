import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {adaptA0TrackRecipeForRace} from './race-track-adapter.mjs';

const FLOW_RECIPE=await fetch(new URL('../FLOW_LOOP_RECIPE_A0.json',import.meta.url),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`Flow Loop recipe HTTP ${r.status}`);return r.json()});
const RACE_RUNTIME=await fetch(new URL('./RACE_FLOW_RUNTIME_CONFIG.json',import.meta.url),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`Race runtime config HTTP ${r.status}`);return r.json()});
const FEEL_RUNTIME=await fetch(new URL('./RACE_FEEL_V08_CONFIG.json',import.meta.url),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`Feel v08 config HTTP ${r.status}`);return r.json()});
const FLOW=adaptA0TrackRecipeForRace(FLOW_RECIPE,RACE_RUNTIME);
const FEEL={
  driftMinSpeed:7.5,driftSteerScale:1.28,driftDampingScale:.28,driftKickScale:.035,
  driftYawGain:1.32,driftRollGain:.024,regripSeconds:.34,regripDampingScale:1.85,
  accelPitchGain:.0075,lateralRollGain:.0028,railHeaveImpulse:.065,
  surfaceSpring:34,surfaceDamping:8.2,hoverBase:.045,forceArrowScale:.18,
  boostAccelScale:1.55,boostMaxForward:48.5,boostPitchBias:.035,
  jumpImpulse:7.8,jumpGravity:19.0,
  ...(FEEL_RUNTIME.feel||{})
};

const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mod=(n,m)=>((n%m)+m)%m;
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
const ease=t=>(1-Math.cos(Math.PI*clamp(t,0,1)))/2;
const TAU=Math.PI*2;
const v3=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const angleDelta=(a,b)=>{let d=b-a;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return d};
const expS=(rate,dt)=>1-Math.exp(-rate*dt);

const UI={
  canvas:$('#gl'),vehicle:$('#vehicle'),status:$('#vehicleStatus'),
  speed:$('#speed'),drive:$('#driveState'),bank:$('#bank'),lat:$('#latLoad'),boost:$('#boostState'),
  auto:$('#auto'),reset:$('#reset'),map:$('#mapMode'),phys:$('#physMode'),lab:$('#labToggle'),
  panel:$('#labPanel'),miniWrap:$('#miniWrap'),mini:$('#mini'),
  hash:$('#trackHash'),surface:$('#surfaceStatus'),width:$('#trackWidth'),test:$('#selfTest'),
  loading:$('#loading'),build:$('#buildLabel')
};
const mctx=UI.mini.getContext('2d');

const renderer=new THREE.WebGLRenderer({canvas:UI.canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(2,devicePixelRatio||1));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.03;
renderer.shadowMap.enabled=false;

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x86ced1);
scene.fog=new THREE.Fog(0x86ced1,110,260);
const camera=new THREE.PerspectiveCamera(67,1,.08,520);
scene.add(new THREE.HemisphereLight(0xe8fbff,0xa08f63,1.9));
const sun=new THREE.DirectionalLight(0xfff1cf,2.35);sun.position.set(-55,85,-35);scene.add(sun);

const world=new THREE.Group(),vehicleRoot=new THREE.Group(),visualRoot=new THREE.Group(),fxRoot=new THREE.Group(),forceRoot=new THREE.Group();
scene.add(world);vehicleRoot.add(fxRoot,visualRoot,forceRoot);scene.add(vehicleRoot);forceRoot.visible=false;

function stable(v){if(v===null||typeof v!=='object')return JSON.stringify(v);if(Array.isArray(v))return '['+v.map(stable).join(',')+']';return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}'}
function hash(s){let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0}return h.toString(16).padStart(8,'0')}

function prepareCorners(src){
  const C=src.map(p=>({...p})),n=C.length,at=i=>C[mod(i,n)];
  const recalc=()=>{for(let i=0;i<n;i++){
    const p=at(i-1),c=at(i),q=at(i+1);let ax=p.x-c.x,az=p.z-c.z,bx=q.x-c.x,bz=q.z-c.z;
    const la=Math.hypot(ax,az)||1,lb=Math.hypot(bx,bz)||1;ax/=la;az/=la;bx/=lb;bz/=lb;
    c.ax=ax;c.az=az;c.bx=bx;c.bz=bz;c.theta=Math.acos(clamp(ax*bx+az*bz,-.999999,.999999));
  }};
  const tang=c=>c.r/Math.tan(c.theta/2);
  recalc();
  for(let pass=0;pass<5;pass++){for(let i=0;i<n;i++){
    const a=at(i),b=at(i+1),L=Math.hypot(b.x-a.x,b.z-a.z),need=tang(a)+tang(b);
    if(need>L*.9){const k=L*.9/need;a.r*=k;b.r*=k}
  }recalc()}
  for(let i=0;i<n;i++){
    const c=at(i),d=tang(c);c.t1={x:c.x+c.ax*d,z:c.z+c.az*d};c.t2={x:c.x+c.bx*d,z:c.z+c.bz*d};
    let mx=c.ax+c.bx,mz=c.az+c.bz;const ml=Math.hypot(mx,mz)||1;mx/=ml;mz/=ml;
    const cd=c.r/Math.sin(c.theta/2);c.center={x:c.x+mx*cd,z:c.z+mz*cd};
    c.a1=Math.atan2(c.t1.z-c.center.z,c.t1.x-c.center.x);c.a2=Math.atan2(c.t2.z-c.center.z,c.t2.x-c.center.x);c.sweep=angleDelta(c.a1,c.a2);
  }
  return C;
}
function buildDenseFlow(c){
  const C=prepareCorners(c.nodes),out=[],n=C.length,push=(x,y,z)=>out.push(v3(x,y,z));
  for(let i=0;i<n;i++){
    const a=C[i],b=C[(i+1)%n],al=Math.abs(a.sweep)*a.r,as=Math.max(4,Math.ceil(al/c.denseArcStep));
    for(let j=0;j<=as;j++){const u=j/as,q=a.a1+a.sweep*u;push(a.center.x+Math.cos(q)*a.r,a.h,a.center.z+Math.sin(q)*a.r)}
    const dx=b.t1.x-a.t2.x,dz=b.t1.z-a.t2.z,L=Math.hypot(dx,dz),ss=Math.max(2,Math.ceil(L/c.denseLineStep));
    for(let j=1;j<ss;j++){const u=j/ss;push(a.t2.x+dx*u,lerp(a.h,b.h,ease(u)),a.t2.z+dz*u)}
  }
  return {dense:out,corners:C};
}
function resample(points,N){
  const M=points.length,cum=new Float64Array(M+1);
  for(let i=0;i<M;i++)cum[i+1]=cum[i]+points[i].distanceTo(points[(i+1)%M]);
  const total=cum[M],ds=total/N,out=[];let j=0;
  for(let i=0;i<N;i++){const s=i*ds;while(j<M-1&&cum[j+1]<s)j++;const a=points[j],b=points[(j+1)%M],span=cum[j+1]-cum[j]||1;out.push(a.clone().lerp(b,(s-cum[j])/span))}
  return {points:out,total,ds};
}
function flowRoute(){
  const {dense,corners}=buildDenseFlow(FLOW.track),r=resample(dense,FLOW.track.sampleCount);
  const target=v3((corners[0].t2.x+corners[1].t1.x)/2,(corners[0].h+corners[1].h)/2,(corners[0].t2.z+corners[1].t1.z)/2);
  let k=0,b=Infinity;for(let i=0;i<r.points.length;i++){const d=r.points[i].distanceToSquared(target);if(d<b){b=d;k=i}}
  r.points=[...r.points.slice(k),...r.points.slice(0,k)];return r;
}
function tangents(route){const N=route.length,T=[];for(let i=0;i<N;i++)T.push(route[mod(i+1,N)].clone().sub(route[mod(i-1,N)]).normalize());return T}
function signedAround(a,b,axis){const aa=a.clone().projectOnPlane(axis).normalize(),bb=b.clone().projectOnPlane(axis).normalize();return Math.atan2(axis.dot(new THREE.Vector3().crossVectors(aa,bb)),clamp(aa.dot(bb),-1,1))}
function transportedFrames(route,rolls){
  const N=route.length,T=tangents(route),R=new Array(N),U=new Array(N);let seed=v3(0,1,0);if(Math.abs(seed.dot(T[0]))>.92)seed=v3(1,0,0);
  R[0]=new THREE.Vector3().crossVectors(seed,T[0]).normalize();U[0]=new THREE.Vector3().crossVectors(T[0],R[0]).normalize();
  for(let i=1;i<N;i++){const q=new THREE.Quaternion().setFromUnitVectors(T[i-1],T[i]);R[i]=R[i-1].clone().applyQuaternion(q).normalize();U[i]=U[i-1].clone().applyQuaternion(q).normalize()}
  const qClose=new THREE.Quaternion().setFromUnitVectors(T[N-1],T[0]),endR=R[N-1].clone().applyQuaternion(qClose).normalize(),tw=signedAround(endR,R[0],T[0]);
  for(let i=0;i<N;i++){const q=new THREE.Quaternion().setFromAxisAngle(T[i],tw*i/N+(rolls?rolls[i]:0));R[i].applyQuaternion(q).normalize();U[i]=new THREE.Vector3().crossVectors(T[i],R[i]).normalize();R[i]=new THREE.Vector3().crossVectors(U[i],T[i]).normalize()}
  return route.map((p,i)=>({pos:p,forward:T[i],right:R[i],up:U[i],bank:rolls?rolls[i]:0}));
}
function buildCore(){
  const r=flowRoute(),N=r.points.length,rolls=new Float64Array(N),curv=new Float64Array(N),head=new Float64Array(N);
  for(let i=0;i<N;i++){const f=r.points[mod(i+2,N)].clone().sub(r.points[mod(i-2,N)]).normalize();head[i]=Math.atan2(f.x,f.z)}
  const raw=new Float64Array(N);for(let i=0;i<N;i++){curv[i]=angleDelta(head[mod(i-2,N)],head[mod(i+2,N)])/(4*r.ds);raw[i]=clamp(-curv[i]*FLOW.track.bankGain,-FLOW.track.bankLimit,FLOW.track.bankLimit)}
  let tmp=raw.slice();for(let p=0;p<FLOW.track.bankSmoothPasses;p++){for(let i=0;i<N;i++){let s=0,c=0;for(let k=-FLOW.track.bankSmoothRadius;k<=FLOW.track.bankSmoothRadius;k++){s+=tmp[mod(i+k,N)];c++}rolls[i]=s/c}tmp=rolls.slice()}
  const F=transportedFrames(r.points,rolls);for(let i=0;i<N;i++)F[i].curvature=curv[i];
  const sample=s=>{s=mod(s,r.total);const f=s/r.ds,i=Math.floor(f)%N,u=f-Math.floor(f),j=(i+1)%N,a=F[i],b=F[j],pos=a.pos.clone().lerp(b.pos,u),forward=a.forward.clone().lerp(b.forward,u).normalize(),right=a.right.clone().lerp(b.right,u).normalize(),up=new THREE.Vector3().crossVectors(forward,right).normalize();right.copy(new THREE.Vector3().crossVectors(up,forward).normalize());return {i,u,pos,forward,right,up,bank:lerp(a.bank,b.bank,u),curvature:lerp(a.curvature,b.curvature,u)}};
  return {recipe:FLOW,route:r.points,total:r.total,ds:r.ds,frames:F,sample,hash:hash(stable(FLOW_RECIPE))};
}
function selfTest(c){
  let ortho=0,cont=1;for(let i=0;i<c.frames.length;i++){const f=c.frames[i],n=c.frames[(i+1)%c.frames.length];ortho=Math.max(ortho,Math.abs(f.forward.dot(f.right)),Math.abs(f.forward.dot(f.up)),Math.abs(f.right.dot(f.up)));cont=Math.min(cont,f.right.dot(n.right))}
  return {ok:ortho<1e-3&&cont>.86&&Number.isFinite(c.total),ortho,cont};
}

// v0.8 track-width vocabulary: authored locally in Race, not A0 yet.
const WIDTH_KEYS=[
  [0.00,1.00],[0.10,1.00],[0.18,.76],[0.27,.76],
  [0.36,1.18],[0.49,1.18],[0.59,.90],[0.70,.90],
  [0.80,1.10],[0.90,1.00],[1.00,1.00]
];
function widthScaleAt(t){
  t=mod(t,1);
  for(let i=0;i<WIDTH_KEYS.length-1;i++){
    const a=WIDTH_KEYS[i],b=WIDTH_KEYS[i+1];
    if(t>=a[0]&&t<=b[0])return lerp(a[1],b[1],smooth((t-a[0])/(b[0]-a[0]||1)));
  }
  return 1;
}
const baseHalf=FLOW.track.roadWidth/2;
function halfWidthAtS(s,total){return baseHalf*widthScaleAt(mod(s,total)/total)}

const MAT={
  road:new THREE.MeshStandardMaterial({color:0x2b2e37,roughness:.8,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}),
  side:new THREE.MeshStandardMaterial({color:0x56515a,roughness:.9,side:THREE.DoubleSide}),
  rail:new THREE.MeshStandardMaterial({color:0x25272f,roughness:.72,metalness:.08}),
  line:new THREE.MeshBasicMaterial({color:0xb9b8b1,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),
  ground:new THREE.MeshStandardMaterial({color:0xd8c98d,roughness:1})
};
let core=null,trackGroup=null;
function quad(A,a,b,c,d){A.push(a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z,a.x,a.y,a.z,c.x,c.y,c.z,d.x,d.y,d.z)}
function mesh(A,m){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(A,3));g.computeVertexNormals();return new THREE.Mesh(g,m)}
function buildWorld(){
  core=buildCore();if(trackGroup)world.remove(trackGroup);trackGroup=new THREE.Group();world.add(trackGroup);
  const N=core.route.length,top=[],side=[],lp=[],rp=[],lines=[];let minY=Infinity,maxR=120;
  for(let i=0;i<N;i++){
    const j=(i+1)%N,a=core.frames[i],b=core.frames[j],hwa=halfWidthAtS(i*core.ds,core.total),hwb=halfWidthAtS(j*core.ds,core.total);
    const al=a.pos.clone().addScaledVector(a.right,-hwa),ar=a.pos.clone().addScaledVector(a.right,hwa),bl=b.pos.clone().addScaledVector(b.right,-hwb),br=b.pos.clone().addScaledVector(b.right,hwb);
    quad(top,al,ar,br,bl);
    const alb=al.clone().addScaledVector(a.up,-FLOW.track.roadThickness),arb=ar.clone().addScaledVector(a.up,-FLOW.track.roadThickness),blb=bl.clone().addScaledVector(b.up,-FLOW.track.roadThickness),brb=br.clone().addScaledVector(b.up,-FLOW.track.roadThickness);
    quad(side,arb,alb,blb,brb);quad(side,al,alb,blb,bl);quad(side,arb,ar,br,brb);
    lp.push(al.clone().addScaledVector(a.up,FLOW.track.barrierHeight+.12));rp.push(ar.clone().addScaledVector(a.up,FLOW.track.barrierHeight+.12));
    if(i%34<20){
      for(const frac of [-1/3,1/3]){
        const latA=hwa*frac,latB=hwb*frac,h=.055,l=.032;
        const l0=a.pos.clone().addScaledVector(a.right,latA-h).addScaledVector(a.up,l),r0=a.pos.clone().addScaledVector(a.right,latA+h).addScaledVector(a.up,l);
        const l1=b.pos.clone().addScaledVector(b.right,latB-h).addScaledVector(b.up,l),r1=b.pos.clone().addScaledVector(b.right,latB+h).addScaledVector(b.up,l);
        quad(lines,l0,r0,r1,l1);
      }
    }
    minY=Math.min(minY,alb.y,arb.y);maxR=Math.max(maxR,Math.abs(a.pos.x)+40,Math.abs(a.pos.z)+40);
  }
  trackGroup.add(mesh(top,MAT.road),mesh(side,MAT.side),mesh(lines,MAT.line));
  for(const pts of [lp,rp]){const c=new THREE.CatmullRomCurve3(pts,true,'catmullrom',.5),g=new THREE.TubeGeometry(c,pts.length,.115,10,true);trackGroup.add(new THREE.Mesh(g,MAT.rail))}
  const ground=new THREE.Mesh(new THREE.BoxGeometry(maxR*2,1.2,maxR*2),MAT.ground);ground.position.y=minY-6.6;trackGroup.add(ground);
  const t=selfTest(core);UI.hash.textContent=`${FLOW_RECIPE.id} · ${FLOW_RECIPE.revision} · ${core.hash}`;UI.surface.textContent=FLOW.surfaces[0].roles.join(' / ');UI.test.textContent=`${t.ok?'PASS':'CHECK'} · continuity ${t.cont.toFixed(3)}`;
}

const loader=new GLTFLoader();
const K='https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/';
const N='https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney-car-kit/Models/GLB%20format/';
const VEH={hatchback:K+'car_hatchback.gltf',sedan:K+'car_sedan.gltf',stationwagon:K+'car_stationwagon.gltf',taxi:K+'car_taxi.gltf',police:K+'car_police.gltf',race:N+'race.glb','race-future':N+'race-future.glb'};
const RAW='https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/';
const raw=p=>RAW+p.split('/').map(encodeURIComponent).join('/');
const BOARD=raw('media/3D_Assets/KFB/Skateboard by Poly by Google - 7Dfn4VtTCWY.glb');
const ACTION=raw('media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb');
let currentVisual=null,baseYaw=0,userFlip=0;
function fallback(){
  visualRoot.clear();const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:0xf05b93,roughness:.5}),d=new THREE.MeshStandardMaterial({color:0x242831,roughness:.6});
  const b=new THREE.Mesh(new THREE.BoxGeometry(2.5,.65,4.2),m);b.position.y=.65;g.add(b);
  for(const x of [-1.15,1.15])for(const z of [-1.25,1.25]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.34,14),d);w.rotation.z=Math.PI/2;w.position.set(x,.43,z);g.add(w)}
  visualRoot.add(g);currentVisual=g;UI.status.textContent='proxy';
}
function inferYaw(o){
  const f=[],r=[];o.updateMatrixWorld(true);o.traverse(n=>{const s=(n.name||'').toLowerCase();if(!s.includes('wheel_'))return;const p=v3();n.getWorldPosition(p);if(s.includes('front'))f.push(p);else if(s.includes('rear'))r.push(p)});
  if(!f.length||!r.length)return 0;const avg=a=>a.reduce((p,q)=>p.add(q),v3()).multiplyScalar(1/a.length),v=avg(f).sub(avg(r));v.y=0;return v.lengthSq()?-Math.atan2(v.x,v.z):0;
}
function normalizeXZ(o,target){o.updateMatrixWorld(true);let b=new THREE.Box3().setFromObject(o),z=v3();b.getSize(z);o.scale.multiplyScalar(target/(Math.max(z.x,z.z)||1));o.updateMatrixWorld(true);b=new THREE.Box3().setFromObject(o);const c=v3();b.getCenter(c);o.position.x-=c.x;o.position.z-=c.z;o.position.y-=b.min.y}
function normalizeY(o,target){o.updateMatrixWorld(true);let b=new THREE.Box3().setFromObject(o),z=v3();b.getSize(z);o.scale.multiplyScalar(target/(z.y||1));o.updateMatrixWorld(true);b=new THREE.Box3().setFromObject(o);const c=v3();b.getCenter(c);o.position.x-=c.x;o.position.z-=c.z;o.position.y-=b.min.y}
async function loadBoardRider(){const [bb,cc]=await Promise.all([loader.loadAsync(BOARD),loader.loadAsync(ACTION)]),g=new THREE.Group(),board=bb.scene,character=cc.scene;normalizeXZ(board,3.3);normalizeY(character,2.15);character.position.y+=.18;g.add(board,character);visualRoot.clear();visualRoot.add(g);currentVisual=g;baseYaw=0;userFlip=0;UI.status.textContent='board + ActionFigure · rig pose WIP'}
async function loadCar(k){
  if(k==='proxy'){fallback();return}UI.status.textContent='loading…';
  try{
    if(k==='board-actionfigure'){await loadBoardRider();return}
    const g=(await loader.loadAsync(VEH[k])).scene;visualRoot.clear();currentVisual=g;baseYaw=inferYaw(g);userFlip=0;g.updateMatrixWorld(true);
    let box=new THREE.Box3().setFromObject(g),sz=v3();box.getSize(sz);g.scale.setScalar(4.1/(Math.max(sz.x,sz.z)||1));g.updateMatrixWorld(true);box=new THREE.Box3().setFromObject(g);
    const c=v3();box.getCenter(c);g.position.set(-c.x,-box.min.y,-c.z);g.rotation.y=baseYaw;visualRoot.add(g);UI.status.textContent=`KayKit/fixture · ${k}`;
  }catch(e){console.error(e);fallback();UI.status.textContent='asset fallback'}
}

// Race keeps presentation intentionally clean while Vehicle Lab owns the VFX exploration.
const blobShadow=new THREE.Mesh(new THREE.CircleGeometry(1,32),new THREE.MeshBasicMaterial({color:0x15161b,transparent:true,opacity:.20,depthWrite:false}));
blobShadow.rotation.x=-Math.PI/2;blobShadow.position.y=.012;blobShadow.scale.set(1.45,.78,1);blobShadow.renderOrder=1;fxRoot.add(blobShadow);
const latArrow=new THREE.ArrowHelper(v3(1,0,0),v3(0,1.15,0),1,0x8eeeff,.35,.18),longArrow=new THREE.ArrowHelper(v3(0,0,1),v3(0,1.15,0),1,0xffd24d,.35,.18);forceRoot.add(latArrow,longArrow);

const state={
  s:2.5,speed:0,x:0,vx:0,railHits:0,wallCooldown:0,impact:0,impactSide:0,
  driftActive:false,driftDir:0,regrip:0,longAccel:0,heave:FEEL.hoverBase,heaveV:0,
  jumpY:0,jumpV:0,airborne:false,landingImpulse:0
};
const keys={},camLook=v3();let auto=false,mapView=false,physicsView=false;

function reset(){
  Object.assign(state,{s:2.5,speed:0,x:0,vx:0,railHits:0,wallCooldown:0,impact:0,impactSide:0,driftActive:false,driftDir:0,regrip:0,longAccel:0,heave:FEEL.hoverBase,heaveV:0,jumpY:0,jumpV:0,airborne:false,landingImpulse:0});
  const r=core.sample(state.s),p=r.pos.clone().addScaledVector(r.up,.08);vehicleRoot.position.copy(p);vehicleRoot.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(r.right,r.up,r.forward));
  visualRoot.position.set(0,FEEL.hoverBase,0);visualRoot.rotation.set(0,0,0);camera.position.copy(p).addScaledVector(r.forward,-11).addScaledVector(r.up,4.7);camera.up.copy(r.up);camera.lookAt(p.clone().addScaledVector(r.forward,8));
}
function soft(x,limit,c){const s=limit*c.softStart,a=Math.abs(x);if(a<=s)return 0;const side=Math.sign(x)||1,t=clamp((a-s)/(limit-s),0,1);return -side*(c.softBase+c.softGain*t*t)}
function hit(limit,c){
  if(Math.abs(state.x)<limit)return 0;const side=Math.sign(state.x)||1,out=state.vx*side>0,before=Math.abs(state.vx);state.x=side*(limit-.1);
  if(out&&state.wallCooldown<=0){state.vx=-side*Math.max(c.bounceBase,before*c.bounceLat+Math.abs(state.speed)*c.bounceSpeed);state.speed*=c.retention;state.wallCooldown=c.cooldown;state.impact=1;state.impactSide=side;state.railHits++;return before}
  if(state.vx*side>0)state.vx=-side*Math.max(1.8,before*.34);return 0;
}
function startJump(){
  if(state.airborne||state.jumpY>.01)return;
  state.jumpV=FEEL.jumpImpulse;state.airborne=true;
}
function updateJump(dt){
  state.landingImpulse=Math.max(0,state.landingImpulse-dt*5);
  if(!state.airborne)return;
  state.jumpV-=FEEL.jumpGravity*dt;state.jumpY+=state.jumpV*dt;
  if(state.jumpY<=0){const impact=Math.abs(state.jumpV);state.jumpY=0;state.jumpV=0;state.airborne=false;state.landingImpulse=clamp(impact/10,0,1);state.heaveV+=.035+.055*state.landingImpulse}
}

function step(dt){
  const r=core.sample(state.s),c=core.recipe.flow;
  const gas=auto||keys.KeyW||keys.ArrowUp,back=keys.KeyS||keys.ArrowDown,left=keys.KeyA||keys.ArrowLeft,right=keys.KeyD||keys.ArrowRight;
  const driftDir=(keys.KeyQ?-1:0)+(keys.KeyE?1:0),boost=!!(keys.ShiftLeft||keys.ShiftRight);
  let steer=(right?1:0)-(left?1:0);if(auto)steer=Math.sign(c.steerBase||1)*clamp(-state.x*.7-state.vx*.18-r.curvature*7,-1,1);
  const beforeSpeed=state.speed;
  if(gas)state.speed+=state.speed<0?c.brake*dt:c.accel*(boost?FEEL.boostAccelScale:1)*dt;
  else if(back)state.speed+=state.speed>1?-c.brake*dt:-c.reverseAccel*dt;
  else{const d=c.drag*dt;state.speed=Math.abs(state.speed)<=d?0:state.speed-Math.sign(state.speed)*d}
  state.speed=clamp(state.speed,-c.maxReverse,boost?FEEL.boostMaxForward:c.maxForward);

  const sa=Math.abs(state.speed),sf=clamp(sa/24,0,1.35);
  const drifting=!!(driftDir&&sa>FEEL.driftMinSpeed&&!state.airborne);
  if(drifting&&!state.driftActive)state.vx+=driftDir*Math.sign(c.steerBase||1)*sa*FEEL.driftKickScale;
  if(!drifting&&state.driftActive)state.regrip=FEEL.regripSeconds;
  state.driftActive=drifting;state.driftDir=drifting?Math.sign(driftDir):0;state.regrip=Math.max(0,state.regrip-dt);
  if(drifting)steer=clamp(steer+driftDir*.68,-1,1);

  state.wallCooldown=Math.max(0,state.wallCooldown-dt);state.impact=Math.max(0,state.impact-dt*4.6);
  const currentHalf=halfWidthAtS(state.s,core.total),limit=Math.max(1.8,currentHalf-c.proxyHalfWidth);
  const centrifugal=-r.curvature*state.speed*state.speed*c.centrifugalGain,rawLat=-r.curvature*state.speed*state.speed;
  const steerForce=steer*c.steerBase*(.48+sf)*(drifting?FEEL.driftSteerScale:1);
  let damping=c.lateralDamping*(drifting?FEEL.driftDampingScale:1);
  if(state.regrip>0)damping*=1+FEEL.regripDampingScale*(state.regrip/FEEL.regripSeconds);
  state.vx+=(steerForce+centrifugal+soft(state.x,limit,c)-state.vx*damping)*dt;state.x+=state.vx*dt;
  const railImpulse=state.airborne?0:hit(limit,c);if(railImpulse>0)state.heaveV+=FEEL.railHeaveImpulse*(1+railImpulse*.05);

  state.s=mod(state.s+state.speed*dt,core.total);updateJump(dt);
  const n=core.sample(state.s),p=n.pos.clone().addScaledVector(n.right,state.x).addScaledVector(n.up,.08+state.jumpY);vehicleRoot.position.copy(p);

  const slip=clamp(state.vx/Math.max(6,sa),-.48,.48),f=n.forward.clone().addScaledVector(n.right,slip*(drifting?1.5:.9)).normalize(),rr=new THREE.Vector3().crossVectors(n.up,f).normalize();
  vehicleRoot.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(rr,n.up,f)),expS(14,dt));

  const instantAccel=(state.speed-beforeSpeed)/Math.max(dt,.001);state.longAccel=lerp(state.longAccel,instantAccel,expS(8,dt));
  const targetHeave=FEEL.hoverBase;state.heaveV+=((targetHeave-state.heave)*FEEL.surfaceSpring-state.heaveV*FEEL.surfaceDamping)*dt;state.heave+=state.heaveV*dt;

  const pitchTarget=clamp(-state.longAccel*FEEL.accelPitchGain-(boost?FEEL.boostPitchBias:0),-.16,.14);
  const rollTarget=clamp(-state.vx*.012+state.impactSide*state.impact*.10+rawLat*FEEL.lateralRollGain,-.24,.24);
  const driftYaw=drifting?driftDir*.18-slip*FEEL.driftYawGain:0;
  const yawTarget=drifting?clamp(driftYaw,-.46,.46):clamp(-slip*.26,-.08,.08);
  visualRoot.rotation.x=lerp(visualRoot.rotation.x,pitchTarget,expS(8,dt));visualRoot.rotation.y=lerp(visualRoot.rotation.y,yawTarget,expS(drifting?9:12,dt));visualRoot.rotation.z=lerp(visualRoot.rotation.z,rollTarget,expS(10,dt));
  visualRoot.position.x=lerp(visualRoot.position.x,-state.impactSide*state.impact*.16,expS(12,dt));visualRoot.position.y=state.heave;

  const speedNorm=clamp(sa/FEEL.boostMaxForward,0,1),heightNorm=clamp(state.jumpY/3,0,1);
  blobShadow.position.y=.012-state.jumpY;blobShadow.material.opacity=.20*(1-heightNorm*.7);blobShadow.scale.set(1.45+heightNorm*.3,.78+heightNorm*.15,1);

  const latDir=Math.sign(rawLat)||1,longDir=Math.sign(state.longAccel)||1;
  latArrow.setDirection(v3(latDir,0,0));latArrow.setLength(.5+Math.min(4,Math.abs(rawLat)*FEEL.forceArrowScale),.32,.15);
  longArrow.setDirection(v3(0,0,longDir));longArrow.setLength(.5+Math.min(3,Math.abs(state.longAccel)*.08),.32,.15);

  let drive='GRIP';if(drifting)drive=`DRIFT ${driftDir<0?'L':'R'}`;else if(state.regrip>0)drive='RE-GRIP';else if(state.airborne)drive='JUMP';
  UI.speed.textContent=(state.speed<-.1?'R ':'')+Math.round(sa*7.2);UI.bank.textContent=`${(n.bank*180/Math.PI).toFixed(0)}°`;UI.drive.textContent=drive;UI.drive.classList.toggle('hot',drifting);UI.lat.textContent=(Math.abs(rawLat)*.08).toFixed(1);UI.boost.textContent=boost?'BOOST':'—';UI.boost.classList.toggle('hot',boost);UI.width.textContent=`${(currentHalf*2).toFixed(1)} m`;

  window.__KFB_RACE_TELEMETRY__={
    speed:state.speed,speedNormalized:speedNorm,longitudinalAcceleration:state.longAccel,lateralAccelerationProxy:rawLat,bank:n.bank,
    driftActive:drifting,driftDirection:state.driftDir,driftSlip:slip,regrip:state.regrip>0,boostActive:boost,
    airborne:state.airborne,verticalVelocity:state.jumpV,landingImpulse:state.landingImpulse,
    railImpact:state.impact,railHits:state.railHits,steerInput:steer,trackWidth:currentHalf*2
  };
  return n;
}
function cameraStep(dt,r){
  const car=vehicleRoot.position;if(mapView){const ctr=core.route.reduce((a,p)=>a.add(p),v3()).multiplyScalar(1/core.route.length),p=ctr.clone().add(v3(0,190,0));camera.position.lerp(p,expS(4,dt));camera.up.set(0,0,-1);camera.lookAt(ctr);return}
  const p=car.clone().addScaledVector(r.forward,-11.5).addScaledVector(r.up,4.7);camera.position.lerp(p,expS(5.5,dt));camera.up.lerp(v3(0,1,0).lerp(r.up,.42).normalize(),expS(6,dt)).normalize();camLook.lerp(car.clone().addScaledVector(r.forward,10.5).addScaledVector(r.up,1.15),expS(7,dt));camera.lookAt(camLook);
}
function mini(){
  if(UI.miniWrap.hidden)return;const w=UI.mini.clientWidth,h=UI.mini.clientHeight;mctx.clearRect(0,0,w,h);let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;
  for(const p of core.route){minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minZ=Math.min(minZ,p.z);maxZ=Math.max(maxZ,p.z)}
  const pad=18,sc=Math.min((w-2*pad)/(maxX-minX||1),(h-2*pad)/(maxZ-minZ||1)),cx=(minX+maxX)/2,cz=(minZ+maxZ)/2,X=p=>w/2+(p.x-cx)*sc,Z=p=>h/2+(p.z-cz)*sc;
  mctx.strokeStyle='rgba(238,232,216,.82)';mctx.lineWidth=7;mctx.lineJoin='round';mctx.beginPath();for(let i=0;i<core.route.length;i+=6){const p=core.route[i];i?mctx.lineTo(X(p),Z(p)):mctx.moveTo(X(p),Z(p))}mctx.closePath();mctx.stroke();
  const r=core.sample(state.s),p=r.pos.clone().addScaledVector(r.right,state.x);mctx.fillStyle='#f05b93';mctx.beginPath();mctx.arc(X(p),Z(p),5,0,TAU);mctx.fill();
}
function setLab(open){UI.panel.hidden=!open;UI.miniWrap.hidden=!open;UI.lab.textContent=open?'LAB ×':'LAB';resize()}
function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();const r=UI.mini.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);UI.mini.width=Math.max(1,r.width*d);UI.mini.height=Math.max(1,r.height*d);mctx.setTransform(d,0,0,d,0,0)}
addEventListener('resize',resize);
function focus(){try{UI.canvas.focus({preventScroll:true})}catch{}}
UI.canvas.tabIndex=0;addEventListener('pointerdown',focus);
addEventListener('keydown',e=>{
  keys[e.code]=true;
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyQ','KeyE'].includes(e.code))e.preventDefault();
  if(e.code==='Space'&&!e.repeat)startJump();
  if(e.code==='KeyR')reset();
  if(e.code==='KeyM'){mapView=!mapView;UI.map.textContent=mapView?'CHASE':'MAP'}
  if(e.code==='KeyP'){physicsView=!physicsView;forceRoot.visible=physicsView;UI.phys.textContent='PHYS: '+(physicsView?'ON':'OFF')}
  if(e.code==='KeyH')setLab(UI.panel.hidden);
},{capture:true});
addEventListener('keyup',e=>keys[e.code]=false,{capture:true});
addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.onpointerdown=e=>{e.preventDefault();keys[k]=true;if(k==='Space')startJump();focus()};b.onpointerup=b.onpointercancel=b.onpointerleave=e=>{e.preventDefault();keys[k]=false}});
UI.lab.onclick=()=>setLab(UI.panel.hidden);
UI.auto.onclick=()=>{auto=!auto;UI.auto.textContent='AUTO: '+(auto?'ON':'OFF')};
UI.reset.onclick=reset;
UI.map.onclick=()=>{mapView=!mapView;UI.map.textContent=mapView?'CHASE':'MAP'};
UI.phys.onclick=()=>{physicsView=!physicsView;forceRoot.visible=physicsView;UI.phys.textContent='PHYS: '+(physicsView?'ON':'OFF')};
UI.vehicle.onchange=()=>loadCar(UI.vehicle.value);
$('#flip').onclick=()=>{userFlip=mod(userFlip+Math.PI,TAU);if(currentVisual)currentVisual.rotation.y=baseYaw+userFlip};

buildWorld();fallback();await loadCar(UI.vehicle.value);setLab(false);resize();reset();UI.loading.style.display='none';if(UI.build)UI.build.textContent='V0.8 CONTROLS + WIDTH';
let last=performance.now();function frame(t){const dt=Math.min(.04,(t-last)/1000||0);last=t;const r=step(dt);cameraStep(dt,r);mini();renderer.render(scene,camera);requestAnimationFrame(frame)}requestAnimationFrame(frame);
