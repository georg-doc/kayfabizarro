import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const data=await fetch('./V010_TOPOLOGY_BLOCKOUT.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('topology '+r.status);return r.json()});
const canvas=document.getElementById('view');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setClearColor(0x182028,1);
const scene=new THREE.Scene();
scene.fog=new THREE.Fog(0x182028,90,180);
const camera=new THREE.PerspectiveCamera(42,1,.1,400);
const controls=new OrbitControls(camera,canvas);
controls.enableDamping=true;
controls.target.set(0,0,0);
const hemi=new THREE.HemisphereLight(0xddeeff,0x30302a,1.8);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffffff,2.4);sun.position.set(20,40,15);scene.add(sun);

const palette={main:0x70a9cb,pit:0xd2b16c,bridge:0xee7865,support:0x7b8791,anchor:0xf1c06c};
const routeRoot=new THREE.Group(), pitRoot=new THREE.Group(), anchorRoot=new THREE.Group();
scene.add(routeRoot,pitRoot,anchorRoot);

function v(a){return new THREE.Vector3(a[0],a[1],a[2])}
function segment(a0,b0,width,color,thickness=.38){
  const a=v(a0),b=v(b0),dir=b.clone().sub(a),len=dir.length(),mid=a.clone().add(b).multiplyScalar(.5);
  const g=new THREE.BoxGeometry(width,thickness,len);
  const m=new THREE.MeshStandardMaterial({color,roughness:.78,metalness:.02});
  const mesh=new THREE.Mesh(g,m);
  mesh.position.copy(mid);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),dir.clone().normalize());
  return mesh;
}
function route(routeId,root){
  const r=data.routes[routeId],pts=r.points;
  for(let i=0;i<pts.length-1;i++){
    const isUpper=routeId==='MAIN'&&(i===6||i===7||i===8);
    const mesh=segment(pts[i],pts[i+1],r.width,isUpper?palette.bridge:(routeId==='PIT'?palette.pit:palette.main),isUpper?.46:.34);
    mesh.userData={routeId,segment:i,isUpper};
    root.add(mesh);
  }
}
route('MAIN',routeRoot);route('PIT',pitRoot);

for(const p of data.crossing.supportAnchors){
  const h=data.crossing.clearance-.3;
  const g=new THREE.CylinderGeometry(.7,.9,h,10);
  const m=new THREE.MeshStandardMaterial({color:palette.support,roughness:.85});
  const mesh=new THREE.Mesh(g,m);mesh.position.set(p[0],h*.5,p[2]);routeRoot.add(mesh);
}
const svc=data.anchors.serviceBuilding;
const svcMesh=new THREE.Mesh(new THREE.BoxGeometry(...svc.size),new THREE.MeshStandardMaterial({color:0x4b5660,roughness:.9,transparent:true,opacity:.72}));
svcMesh.position.copy(v(svc.position));svcMesh.position.y+=svc.size[1]*.5;routeRoot.add(svcMesh);

function marker(pos,scale=.7){
  const g=new THREE.CylinderGeometry(scale,scale,0.18,16);
  const m=new THREE.MeshStandardMaterial({color:palette.anchor,emissive:0x5a4014});
  const mesh=new THREE.Mesh(g,m);mesh.position.copy(v(pos));mesh.position.y+=.18;return mesh;
}
anchorRoot.add(marker(data.anchors.startFinish.position,1.05));
anchorRoot.add(marker(data.anchors.pitEntry.position),marker(data.anchors.pitExit.position));
for(const s of data.anchors.stalls)anchorRoot.add(marker(s.position,.45));

const ground=new THREE.GridHelper(120,24,0x34414b,0x26313a);scene.add(ground);

const labelsLayer=document.getElementById('labels');
const labels=data.presentation.labels.map(row=>{
  const el=document.createElement('div');el.className='label';el.textContent=row.text;labelsLayer.append(el);
  return {el,pos:v(row.position)};
});
const dots=[];
for(const pos of [data.anchors.pitEntry.position,data.anchors.pitExit.position,data.anchors.startFinish.position,...data.anchors.stalls.map(x=>x.position)]){
  const el=document.createElement('div');el.className='anchor';labelsLayer.append(el);dots.push({el,pos:v(pos)});
}

function project(item){
  const p=item.pos.clone().project(camera);
  const visible=p.z>-1&&p.z<1;
  item.el.hidden=!visible;
  if(!visible)return;
  item.el.style.left=((p.x*.5+.5)*innerWidth)+'px';
  item.el.style.top=((-p.y*.5+.5)*innerHeight)+'px';
}
function resize(){
  const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
}
addEventListener('resize',resize);resize();

function setTop(){
  camera.position.set(0,105,.01);camera.up.set(0,0,-1);controls.target.set(0,0,0);controls.update();
}
function setIso(){
  camera.up.set(0,1,0);camera.position.set(63,58,70);controls.target.set(0,0,0);controls.update();
}
setIso();

const same=(a,b)=>a.length===b.length&&a.every((x,i)=>Math.abs(x-b[i])<1e-6);
function audit(){
  const main=data.routes.MAIN.points,pit=data.routes.PIT.points;
  const upper=data.crossing.upper.segment,lower=data.crossing.lower.segment;
  const upperY=(main[upper][1]+main[upper+1][1])*.5;
  const lowerY=(main[lower][1]+main[lower+1][1])*.5;
  const checks={
    mainClosed:same(main[0],main.at(-1)),
    entrySeparateFromExit:data.connectors[0].mainPointIndex!==data.connectors[1].mainPointIndex,
    pitEntryConnects:same(pit[0],main[data.connectors[0].mainPointIndex]),
    pitExitConnects:same(pit.at(-1),main[data.connectors[1].mainPointIndex]),
    crossingIsNotConnector:![upper,lower].includes(data.connectors[0].mainPointIndex)&&![upper,lower].includes(data.connectors[1].mainPointIndex),
    clearance:upperY-lowerY>=data.crossing.clearance-.01,
    stalls:data.anchors.stalls.length>=4
  };
  return {pass:Object.values(checks).every(Boolean),checks,upperY,lowerY};
}
const result=audit();
document.getElementById('pass').textContent=result.pass?'TOPOLOGY AUDIT PASS':'TOPOLOGY AUDIT FAIL';
document.getElementById('status').classList.toggle('bad',!result.pass);
document.getElementById('facts').textContent='MAIN closed · PIT split/merge distinct · bridge clearance '+(result.upperY-result.lowerY).toFixed(1)+' · '+data.anchors.stalls.length+' stalls';
window.__KFB_V010__={data,audit:result,version:data.revision};

document.getElementById('top').onclick=()=>{setTop();document.getElementById('top').classList.add('active');document.getElementById('iso').classList.remove('active')};
document.getElementById('iso').onclick=()=>{setIso();document.getElementById('iso').classList.add('active');document.getElementById('top').classList.remove('active')};
let pit=true,anchors=true;
document.getElementById('pit').onclick=e=>{pit=!pit;pitRoot.visible=pit;e.currentTarget.textContent='PIT '+(pit?'ON':'OFF');e.currentTarget.classList.toggle('active',pit)};
document.getElementById('anchors').onclick=e=>{anchors=!anchors;anchorRoot.visible=anchors;for(const d of dots)d.el.style.display=anchors?'':'none';e.currentTarget.textContent='ANCHORS '+(anchors?'ON':'OFF');e.currentTarget.classList.toggle('active',anchors)};
document.getElementById('pit').classList.add('active');document.getElementById('anchors').classList.add('active');

function frame(){
  controls.update();renderer.render(scene,camera);for(const x of labels)project(x);for(const x of dots)project(x);requestAnimationFrame(frame)
}
frame();