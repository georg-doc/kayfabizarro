import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { materialPalette, pickStable } from '../style/kfb-city-materials.js';

const params=new URLSearchParams(location.search);
const cityId=(params.get('city')||'ehrenfeld-v0').trim();
if(!/^[a-z0-9-]+$/.test(cityId)) throw new Error('Invalid city id');

const canvas=document.querySelector('#view');
const status=document.querySelector('#status');
const diag=document.querySelector('#diag');
const brand=document.querySelector('#brand');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.shadowMap.enabled=true;
const scene=new THREE.Scene();
scene.background=new THREE.Color('#c6d7dc');
scene.fog=new THREE.Fog('#c6d7dc',450,1200);
const camera=new THREE.PerspectiveCamera(45,1,0.1,2000);
const controls=new OrbitControls(camera,canvas);
controls.enableDamping=true; controls.dampingFactor=.12;
scene.add(new THREE.HemisphereLight(0xffffff,0x58605b,2.2));
const sun=new THREE.DirectionalLight(0xfff2d6,2.7); sun.position.set(-240,360,180); sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048); scene.add(sun);
const root=new THREE.Group(); scene.add(root);

function mat(color,roughness=.88){ return new THREE.MeshStandardMaterial({color,roughness,metalness:0,side:THREE.DoubleSide}); }
function ribbon(points,width,y,material){
  const pos=[],idx=[]; let base=0;
  for(let i=0;i<points.length-1;i++){
    const a=points[i],b=points[i+1],dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz)||1,nx=-dz/l*width/2,nz=dx/l*width/2;
    pos.push(a.x+nx,y,a.z+nz,a.x-nx,y,a.z-nz,b.x+nx,y,b.z+nz,b.x-nx,y,b.z-nz);
    idx.push(base,base+2,base+1,base+1,base+2,base+3); base+=4;
  }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setIndex(idx); g.computeVertexNormals();
  const m=new THREE.Mesh(g,material); m.receiveShadow=true; return m;
}
function polygonShape(poly){
  const s=new THREE.Shape();
  poly.forEach((p,i)=>i?s.lineTo(p.x,-p.z):s.moveTo(p.x,-p.z));
  return s;
}
function polygonSurface(poly,y,material){
  const g=new THREE.ShapeGeometry(polygonShape(poly)); g.rotateX(-Math.PI/2);
  const m=new THREE.Mesh(g,material); m.position.y=y; m.receiveShadow=true; return m;
}
function addBuilding(b,palette){
  const shape=polygonShape(b.footprint);
  const g=new THREE.ExtrudeGeometry(shape,{depth:b.heightM,bevelEnabled:false,steps:1});
  g.rotateX(-Math.PI/2);
  const color=pickStable(palette[b.materialClass],b.id);
  const m=new THREE.Mesh(g,mat(color)); m.castShadow=true; m.receiveShadow=true; root.add(m);
  const xs=b.footprint.map(p=>p.x),zs=b.footprint.map(p=>p.z);
  const cx=(Math.min(...xs)+Math.max(...xs))/2,cz=(Math.min(...zs)+Math.max(...zs))/2;
  const sx=Math.max(...xs)-Math.min(...xs),sz=Math.max(...zs)-Math.min(...zs);
  const roofColor=pickStable(palette.roof,b.id);
  if(b.roof.type==='hipped-hint'||b.roof.type==='gabled-hint'){
    const rg=new THREE.ConeGeometry(1,b.roof.heightM,4); const rm=new THREE.Mesh(rg,mat(roofColor));
    rm.scale.set(Math.max(1,sx*.62),1,Math.max(1,sz*.62)); rm.rotation.y=Math.PI/4; rm.position.set(cx,b.heightM+b.roof.heightM/2,cz); rm.castShadow=true; root.add(rm);
  } else {
    const rg=new THREE.BoxGeometry(Math.max(.5,sx*.88),Math.max(.2,b.roof.heightM),Math.max(.5,sz*.88));
    const rm=new THREE.Mesh(rg,mat(roofColor)); rm.position.set(cx,b.heightM+b.roof.heightM/2,cz); rm.castShadow=true; root.add(rm);
  }
}
function frame(bounds,mode='oblique'){
  const cx=(bounds.min.x+bounds.max.x)/2,cz=(bounds.min.z+bounds.max.z)/2;
  const span=Math.max(bounds.sizeM.x,bounds.sizeM.z);
  controls.target.set(cx,0,cz);
  if(mode==='top') camera.position.set(cx,span*1.12,cz+.01);
  else if(mode==='street') camera.position.set(cx-span*.28,7,cz+span*.22);
  else camera.position.set(cx+span*.62,span*.52,cz+span*.62);
  camera.near=.1; camera.far=span*5; camera.updateProjectionMatrix(); controls.update();
}
function resize(){
  const r=canvas.getBoundingClientRect(); renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);
  camera.aspect=Math.max(1,r.width)/Math.max(1,r.height); camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(canvas); resize();

async function load(){
  try{
    const [city,style,spec]=await Promise.all([
      fetch(`./data/${cityId}/normalized.json`,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`normalized.json ${r.status}`);return r.json();}),
      fetch('./styles/kfb-city-v0.json').then(r=>{if(!r.ok)throw new Error(`style ${r.status}`);return r.json();}),
      fetch(`./data/${cityId}/SOURCE_SPEC.json`).then(r=>r.ok?r.json():({label:cityId}))
    ]);
    document.title=`KFB OSM City Lab · ${spec.label||cityId}`;
    brand.textContent=`KFB OSM CITY LAB · ${(spec.label||cityId).toUpperCase()}`;
    const p=materialPalette(style);
    root.add(polygonSurface([
      {x:city.bounds.min.x-30,z:city.bounds.min.z-30},{x:city.bounds.max.x+30,z:city.bounds.min.z-30},
      {x:city.bounds.max.x+30,z:city.bounds.max.z+30},{x:city.bounds.min.x-30,z:city.bounds.max.z+30},
      {x:city.bounds.min.x-30,z:city.bounds.min.z-30}
    ],-.035,mat('#899d79')));
    for(const a of city.features.landuse){
      if(a.class==='green') root.add(polygonSurface(a.polygon,.005,mat(p.green)));
      if(a.class==='water') root.add(polygonSurface(a.polygon,.012,mat(p.water,.5)));
    }
    const sidewalkMat=mat(p.sidewalk),roadMat=mat(p.road),footMat=mat(p.sidewalk);
    for(const r of city.features.roads){
      if(r.sidewalk?.left||r.sidewalk?.right) root.add(ribbon(r.centerline,r.widthM+4.2,.018,sidewalkMat));
      root.add(ribbon(r.centerline,r.widthM,.028,r.driveable?roadMat:footMat));
    }
    for(const w of city.features.waterLines) root.add(ribbon(w.line,3,.02,mat(p.water,.5)));
    for(const b of city.features.buildings) addBuilding(b,p);
    frame(city.bounds);
    status.textContent='S0 cache loaded · S1 procedural low-poly view';
    diag.textContent=`${city.diagnostics.featureCounts.roads} roads · ${city.diagnostics.featureCounts.buildings} buildings · ${city.diagnostics.featureCounts.landuse} landuse · ${city.bounds.sizeM.x.toFixed(0)} × ${city.bounds.sizeM.z.toFixed(0)} m local`;
    document.querySelectorAll('[data-camera]').forEach(b=>b.onclick=()=>frame(city.bounds,b.dataset.camera));
  }catch(err){
    brand.textContent=`KFB OSM CITY LAB · ${cityId.toUpperCase()}`;
    status.textContent='SOURCE CACHE PENDING';
    diag.textContent=`${err.message}. The GitHub source-cache workflow must complete before the real OSM blockout can render.`;
  }
}
await load();
(function loop(){requestAnimationFrame(loop);controls.update();renderer.render(scene,camera)})();
