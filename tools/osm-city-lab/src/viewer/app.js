import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { materialPalette, pickStable } from '../style/kfb-city-materials.js';
import { applyCartoonMassing, windowCodesForBuilding } from '../style/cartoon-city.js';

const params=new URLSearchParams(location.search);
const cityId=(params.get('city')||'ehrenfeld-v0').trim();
if(!/^[a-z0-9-]+$/.test(cityId)) throw new Error('Invalid city id');
const requestedLook=(params.get('look')||'').trim().toLowerCase();

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
const camera=new THREE.PerspectiveCamera(45,1,.5,2500);
const controls=new OrbitControls(camera,canvas);
controls.enableDamping=true;
controls.dampingFactor=.12;
scene.add(new THREE.HemisphereLight(0xffffff,0x58605b,2.2));
const sun=new THREE.DirectionalLight(0xfff2d6,2.7);
sun.position.set(-240,360,180);
sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);
scene.add(sun);
const root=new THREE.Group();
scene.add(root);

const metrics={
  look:null,
  roadStripMode:'joined-miter',
  roadMeshes:0,
  sidewalkMeshes:0,
  roadVertices:0,
  buildingMeshes:0,
  roofMeshes:0,
  windowInstances:0,
  zLevels:null
};

function mat(color,roughness=.88,extra={}){
  return new THREE.MeshStandardMaterial({
    color,roughness,metalness:0,side:THREE.DoubleSide,
    ...extra
  });
}

function cleanLine(points){
  const out=[];
  for(const p of points||[]){
    if(!Number.isFinite(p?.x)||!Number.isFinite(p?.z))continue;
    const q={x:Number(p.x),z:Number(p.z)};
    const prev=out[out.length-1];
    if(!prev||Math.hypot(prev.x-q.x,prev.z-q.z)>.001)out.push(q);
  }
  return out;
}

// Continuous joined strip. The previous implementation emitted one independent rectangle
// per segment; the wider sidewalk strip could therefore peek through at every bend and
// shimmer while zooming. This keeps one left/right pair per source point with a clamped miter.
function joinedStrip(points,width,y,material){
  const pts=cleanLine(points);
  if(pts.length<2)return null;
  const half=Math.max(.02,width/2);
  const pos=[];
  const idx=[];

  const dir=(a,b)=>{
    const dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz)||1;
    return {x:dx/l,z:dz/l};
  };
  const normal=d=>({x:-d.z,z:d.x});

  for(let i=0;i<pts.length;i++){
    const p=pts[i];
    const d0=i>0?dir(pts[i-1],p):dir(p,pts[i+1]);
    const d1=i<pts.length-1?dir(p,pts[i+1]):d0;
    const n0=normal(d0),n1=normal(d1);
    let mx=n0.x+n1.x,mz=n0.z+n1.z;
    let ml=Math.hypot(mx,mz);
    if(ml<1e-5){mx=n1.x;mz=n1.z;ml=1;}
    mx/=ml;mz/=ml;
    const denom=Math.max(.38,Math.abs(mx*n1.x+mz*n1.z));
    const miter=Math.min(half*1.8,half/denom);
    pos.push(
      p.x+mx*miter,y,p.z+mz*miter,
      p.x-mx*miter,y,p.z-mz*miter
    );
  }
  for(let i=0;i<pts.length-1;i++){
    const a=i*2,b=a+1,c=a+2,d=a+3;
    idx.push(a,c,b,b,c,d);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setIndex(idx);
  g.computeVertexNormals();
  const m=new THREE.Mesh(g,material);
  m.receiveShadow=true;
  m.userData.vertexCount=pts.length*2;
  return m;
}

function polygonShape(poly){
  const s=new THREE.Shape();
  (poly||[]).forEach((p,i)=>i?s.lineTo(p.x,-p.z):s.moveTo(p.x,-p.z));
  return s;
}

function polygonSurface(poly,y,material){
  const g=new THREE.ShapeGeometry(polygonShape(poly));
  g.rotateX(-Math.PI/2);
  const m=new THREE.Mesh(g,material);
  m.position.y=y;
  m.receiveShadow=true;
  return m;
}

function addBuilding(b,palette,style,look,windowBuckets){
  const shape=polygonShape(b.footprint);
  const cartoonCfg=style.cartoonMassing||{};
  const steps=look==='cartoon'?Math.max(2,Number(cartoonCfg.verticalSteps||4)):1;
  const g=new THREE.ExtrudeGeometry(shape,{depth:b.heightM,bevelEnabled:false,steps});
  g.rotateX(-Math.PI/2);

  let deformation=null;
  if(look==='cartoon'){
    deformation=applyCartoonMassing(g,b.id,cartoonCfg,style.seed||'kfb-city');
  }else{
    g.computeVertexNormals();
  }

  const color=pickStable(palette[b.materialClass],b.id);
  const m=new THREE.Mesh(g,mat(color,.9,{flatShading:true}));
  m.castShadow=true;
  m.receiveShadow=true;
  m.userData.sourceId=b.id;
  root.add(m);
  metrics.buildingMeshes++;

  // KISS massing: the ExtrudeGeometry's own cap IS the roof.
  // No separate roof boxes/cones are generated here.
  if(look==='cartoon'&&cartoonCfg.windows?.enabled!==false){
    const winCfg={...cartoonCfg.windows,materialCount:palette.window.length};
    const codes=windowCodesForBuilding(b,deformation,winCfg,style.seed||'kfb-city');
    for(const w of codes){
      const bucket=windowBuckets[w.materialIndex%windowBuckets.length];
      bucket.push(w);
      metrics.windowInstances++;
    }
  }
}

function addWindowInstances(buckets,palette){
  const box=new THREE.BoxGeometry(1,1,1);
  const yAxis=new THREE.Vector3(0,1,0);
  buckets.forEach((items,i)=>{
    if(!items.length)return;
    const im=new THREE.InstancedMesh(box,mat(palette.window[i%palette.window.length],.64),items.length);
    im.castShadow=false;
    im.receiveShadow=false;
    const matrix=new THREE.Matrix4();
    const q=new THREE.Quaternion();
    const p=new THREE.Vector3();
    const s=new THREE.Vector3();
    items.forEach((w,n)=>{
      p.set(w.x,w.y,w.z);
      q.setFromAxisAngle(yAxis,w.yaw);
      s.set(w.width,w.height,w.depth);
      matrix.compose(p,q,s);
      im.setMatrixAt(n,matrix);
    });
    im.instanceMatrix.needsUpdate=true;
    im.userData.role='window-material-codes';
    root.add(im);
  });
}

function setCameraBasics(){
  camera.filmOffset=0;
  camera.up.set(0,1,0);
  camera.fov=45;
}

function frame(bounds,mode='oblique'){
  const cx=(bounds.min.x+bounds.max.x)/2;
  const cz=(bounds.min.z+bounds.max.z)/2;
  const span=Math.max(bounds.sizeM.x,bounds.sizeM.z);
  setCameraBasics();
  let targetY=0;
  if(mode==='top'){
    camera.position.set(cx,span*1.12,cz+.01);
  }else if(mode==='street'){
    camera.fov=52;
    targetY=4;
    camera.position.set(cx-span*.28,7,cz+span*.22);
  }else if(mode==='cartoon'){
    camera.fov=57;
    camera.filmOffset=3.8;
    camera.up.set(.035,.9994,0);
    targetY=6;
    camera.position.set(cx+span*.48,span*.24,cz+span*.43);
  }else{
    camera.position.set(cx+span*.62,span*.52,cz+span*.62);
  }
  controls.target.set(cx,targetY,cz);
  camera.near=.5;
  camera.far=span*4.5;
  camera.updateProjectionMatrix();
  controls.update();
}

function resize(){
  const r=canvas.getBoundingClientRect();
  renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);
  camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(canvas);
resize();

function bindLookButtons(look){
  document.querySelectorAll('[data-look]').forEach(button=>{
    button.classList.toggle('active',button.dataset.look===look);
    button.onclick=()=>{
      const u=new URL(location.href);
      u.searchParams.set('look',button.dataset.look);
      location.href=u.href;
    };
  });
}

async function load(){
  try{
    const [city,style,spec]=await Promise.all([
      fetch(`./data/${cityId}/normalized.json`,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`normalized.json ${r.status}`);return r.json();}),
      fetch('./styles/kfb-city-v0.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`style ${r.status}`);return r.json();}),
      fetch(`./data/${cityId}/SOURCE_SPEC.json`,{cache:'no-store'}).then(r=>r.ok?r.json():({label:cityId}))
    ]);

    const fallbackLook=style.cartoonMassing?.defaultMode==='clean'?'clean':'cartoon';
    const look=['clean','cartoon'].includes(requestedLook)?requestedLook:fallbackLook;
    metrics.look=look;
    bindLookButtons(look);

    document.title=`KFB OSM City Lab · ${spec.label||cityId} · ${look}`;
    brand.textContent=`KFB OSM CITY LAB · ${(spec.label||cityId).toUpperCase()}`;

    const p=materialPalette(style);
    const L=style.layers||{};
    metrics.zLevels={
      ground:Number(L.groundY??-.12),
      landuse:Number(L.landuseY??-.075),
      sidewalk:Number(L.sidewalkY??.012),
      road:Number(L.roadY??.065),
      waterLine:Number(L.waterLineY??.04)
    };

    root.add(polygonSurface([
      {x:city.bounds.min.x-30,z:city.bounds.min.z-30},
      {x:city.bounds.max.x+30,z:city.bounds.min.z-30},
      {x:city.bounds.max.x+30,z:city.bounds.max.z+30},
      {x:city.bounds.min.x-30,z:city.bounds.max.z+30},
      {x:city.bounds.min.x-30,z:city.bounds.min.z-30}
    ],metrics.zLevels.ground,mat('#899d79')));

    for(const a of city.features.landuse){
      if(a.class==='green')root.add(polygonSurface(a.polygon,metrics.zLevels.landuse,mat(p.green)));
      if(a.class==='water')root.add(polygonSurface(a.polygon,Number(L.waterAreaY??-.065),mat(p.water,.5)));
    }

    const sidewalkMat=mat(p.sidewalk,.96,{polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
    const roadMat=mat(p.road,.95,{polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
    const footMat=mat(p.sidewalk,.94,{polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});

    for(const r of city.features.roads){
      if(r.sidewalk?.left||r.sidewalk?.right){
        const sw=joinedStrip(r.centerline,r.widthM+4.2,metrics.zLevels.sidewalk,sidewalkMat);
        if(sw){root.add(sw);metrics.sidewalkMeshes++;metrics.roadVertices+=sw.userData.vertexCount||0;}
      }
      const road=joinedStrip(r.centerline,r.widthM,metrics.zLevels.road,r.driveable?roadMat:footMat);
      if(road){root.add(road);metrics.roadMeshes++;metrics.roadVertices+=road.userData.vertexCount||0;}
    }

    for(const w of city.features.waterLines){
      const line=joinedStrip(w.line,3,metrics.zLevels.waterLine,mat(p.water,.5));
      if(line)root.add(line);
    }

    const windowBuckets=Array.from({length:Math.max(1,p.window.length)},()=>[]);
    for(const b of city.features.buildings)addBuilding(b,p,style,look,windowBuckets);
    if(look==='cartoon')addWindowInstances(windowBuckets,p);

    frame(city.bounds,look==='cartoon'?'cartoon':'oblique');
    document.querySelectorAll('[data-camera]').forEach(button=>button.onclick=()=>frame(city.bounds,button.dataset.camera));

    status.textContent=look==='cartoon'
      ?'S1b cartoon massing · OSM footprint blocks + controlled skew'
      :'S1b clean massing · direct OSM footprint extrusion';
    diag.textContent=`${city.diagnostics.featureCounts.roads} roads · ${city.diagnostics.featureCounts.buildings} buildings · flat extrusion caps · ${metrics.windowInstances} window codes · ${city.bounds.sizeM.x.toFixed(0)} × ${city.bounds.sizeM.z.toFixed(0)} m local`;

    window.KFBCityLab=Object.freeze({
      report:()=>({
        cityId,look,
        ...metrics,
        sourceCounts:{...city.diagnostics.featureCounts},
        bounds:city.bounds,
        separateRoofCaps:false,
        s2GeometryDeformed:false
      })
    });
  }catch(err){
    brand.textContent=`KFB OSM CITY LAB · ${cityId.toUpperCase()}`;
    status.textContent='SOURCE CACHE PENDING';
    diag.textContent=`${err.message}. The GitHub source-cache workflow must complete before the real OSM blockout can render.`;
    console.error(err);
  }
}

await load();
(function loop(){
  requestAnimationFrame(loop);
  controls.update();
  renderer.render(scene,camera);
})();
