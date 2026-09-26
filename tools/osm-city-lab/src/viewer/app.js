import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { materialPalette, pickStable } from '../style/kfb-city-materials.js';
import { applyCartoonMassing, windowCodesForBuilding } from '../style/cartoon-city.js';
import { joinedStrip, addJunctionPatches } from './street-surface.js';
import { createStreetSigns } from './street-signs.js';
import { createNaturePoc } from './nature-poc.js';
import { createCityFurniture } from './city-furniture.js';

const params=new URLSearchParams(location.search);
const cityId=(params.get('city')||'ehrenfeld-v0').trim();
if(!/^[a-z0-9-]+$/.test(cityId)) throw new Error('Invalid city id');
const requestedLook=(params.get('look')||'').trim().toLowerCase();
const truthy=v=>['1','on','true','yes'].includes(String(v||'').toLowerCase());
const requestedLabels=truthy(params.get('labels'));
const requestedNature=truthy(params.get('nature'));
const requestedFurniture=truthy(params.get('furniture'));

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

let streetSignController=null;
let natureController=null;
let cityFurnitureController=null;

const metrics={
  look:null,
  roadStripMode:'joined-miter+osm-node-patches',
  roadMeshes:0,
  sidewalkMeshes:0,
  pathMeshes:0,
  roadVertices:0,
  roadJunctionPatches:0,
  sidewalkJunctionPatches:0,
  pathJunctionPatches:0,
  buildingMeshes:0,
  roofMeshes:0,
  windowInstances:0,
  streetSigns:0,
  streetSignMinBuildingClearanceM:null,
  natureInstances:0,
  natureAssets:[],
  cityFurnitureInstances:0,
  cityFurnitureByType:{},
  cityFurnitureAssets:[],
  trafficSignalJunctions:0,
  trafficPlanStatus:null,
  zLevels:null
};

function mat(color,roughness=.88,extra={}){
  return new THREE.MeshStandardMaterial({
    color,roughness,metalness:0,side:THREE.DoubleSide,
    ...extra
  });
}

function polygonShape(poly){
  const s=new THREE.Shape();
  (poly||[]).forEach((p,i)=>i?s.lineTo(p.x,-p.z):s.moveTo(p.x,-p.z));
  return s;
}

function polygonSurface(poly,y,material,renderOrder=0){
  const g=new THREE.ShapeGeometry(polygonShape(poly));
  g.rotateX(-Math.PI/2);
  const m=new THREE.Mesh(g,material);
  m.position.y=y;
  m.receiveShadow=true;
  m.renderOrder=renderOrder;
  return m;
}

function lookProfile(style,look){
  if(look==='clean')return null;
  const base=style.cartoonMassing||{};
  const preset=base.presets?.[look]||base.presets?.cartoon||{};
  return {...preset,windows:base.windows||{}};
}

function addBuilding(b,palette,style,look,windowBuckets){
  const shape=polygonShape(b.footprint);
  const profile=lookProfile(style,look);
  const steps=profile?Math.max(2,Number(profile.verticalSteps||4)):1;
  const g=new THREE.ExtrudeGeometry(shape,{depth:b.heightM,bevelEnabled:false,steps});
  g.rotateX(-Math.PI/2);

  let deformation=null;
  if(profile){
    deformation=applyCartoonMassing(g,b.id,profile,style.seed||'kfb-city');
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

  if(profile&&profile.windows?.enabled!==false){
    const winCfg={...profile.windows,materialCount:palette.window.length};
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
    camera.fov=59;
    camera.filmOffset=4.8;
    camera.up.set(.04,.9992,0);
    targetY=7;
    camera.position.set(cx+span*.46,span*.22,cz+span*.41);
  }else if(mode==='grotesque'){
    camera.fov=76;
    camera.filmOffset=10.5;
    camera.up.set(.085,.9964,0);
    targetY=12;
    camera.position.set(cx+span*.31,span*.12,cz+span*.28);
  }else{
    camera.position.set(cx+span*.62,span*.52,cz+span*.62);
  }

  controls.target.set(cx,targetY,cz);
  camera.near=.5;
  camera.far=span*4.5;
  camera.updateProjectionMatrix();
  controls.update();
}

function focusStreetSign(bounds){
  const c=streetSignController?.candidates?.[0];
  if(!c){frame(bounds,'street');return;}
  setCameraBasics();
  camera.fov=48;
  const tx=c.tangent?.x||0,tz=c.tangent?.z||1;
  const nx=c.normal?.x??-tz,nz=c.normal?.z??tx;
  controls.target.set(c.x,1.8,c.z);
  // Camera stays mostly on the road side of the sign, reducing building occlusion.
  camera.position.set(c.x-nx*5.5-tx*2.5,3.1,c.z-nz*5.5-tz*2.5);
  camera.near=.15;
  camera.far=Math.max(300,Math.max(bounds.sizeM.x,bounds.sizeM.z)*2);
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

function setParam(name,value){
  const u=new URL(location.href);
  if(value==null||value===false||value==='')u.searchParams.delete(name);
  else u.searchParams.set(name,String(value));
  location.href=u.href;
}

function bindLookButtons(look){
  document.querySelectorAll('[data-look]').forEach(button=>{
    button.classList.toggle('active',button.dataset.look===look);
    button.onclick=()=>setParam('look',button.dataset.look);
  });
}

function bindFeatureButtons(){
  const state={labels:requestedLabels,nature:requestedNature,furniture:requestedFurniture};
  document.querySelectorAll('[data-feature]').forEach(button=>{
    const key=button.dataset.feature;
    button.classList.toggle('active',!!state[key]);
    button.onclick=()=>setParam(key,state[key]?'0':'1');
  });
}

function addStreetSurfaces(THREE,city,palette,style){
  const L=style.layers||{};
  const lift=Number(L.junctionPatchLift??.004);
  const driveable=city.features.roads.filter(r=>r.driveable);
  const paths=city.features.roads.filter(r=>!r.driveable);
  const sidewalkRoads=driveable.filter(r=>r.sidewalk?.left||r.sidewalk?.right);

  const sidewalkMat=mat(palette.sidewalk,.98,{polygonOffset:true,polygonOffsetFactor:2,polygonOffsetUnits:2});
  const pathMat=mat(palette.path,.97,{polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
  const roadMat=mat(palette.road,.96,{polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});

  for(const r of sidewalkRoads){
    const sw=joinedStrip(THREE,r.centerline,r.widthM+4.2,metrics.zLevels.sidewalk,sidewalkMat);
    if(sw){sw.renderOrder=2;root.add(sw);metrics.sidewalkMeshes++;metrics.roadVertices+=sw.userData.vertexCount||0;}
  }

  for(const r of paths){
    const path=joinedStrip(THREE,r.centerline,Math.max(.8,r.widthM),metrics.zLevels.path,pathMat);
    if(path){path.renderOrder=3;root.add(path);metrics.pathMeshes++;metrics.roadVertices+=path.userData.vertexCount||0;}
  }

  for(const r of driveable){
    const road=joinedStrip(THREE,r.centerline,r.widthM,metrics.zLevels.road,roadMat);
    if(road){road.renderOrder=4;root.add(road);metrics.roadMeshes++;metrics.roadVertices+=road.userData.vertexCount||0;}
  }

  const swSpecs=addJunctionPatches(THREE,root,sidewalkRoads,{
    y:metrics.zLevels.sidewalk+lift,
    material:sidewalkMat,
    widthExtra:2.1,
    driveableOnly:true,
    segments:14
  });
  metrics.sidewalkJunctionPatches=swSpecs.length;

  const pathSpecs=addJunctionPatches(THREE,root,paths,{
    y:metrics.zLevels.path+lift,
    material:pathMat,
    widthExtra:.12,
    driveableOnly:false,
    segments:12
  });
  metrics.pathJunctionPatches=pathSpecs.length;

  const roadSpecs=addJunctionPatches(THREE,root,driveable,{
    y:metrics.zLevels.road+lift,
    material:roadMat,
    widthExtra:.08,
    driveableOnly:true,
    segments:14
  });
  metrics.roadJunctionPatches=roadSpecs.length;

  for(const child of root.children){
    if(child.userData?.role==='street-junction-patch')child.renderOrder=5;
  }
}

async function load(){
  try{
    const [city,style,spec]=await Promise.all([
      fetch(`./data/${cityId}/normalized.json`,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`normalized.json ${r.status}`);return r.json();}),
      fetch('./styles/kfb-city-v0.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`style ${r.status}`);return r.json();}),
      fetch(`./data/${cityId}/SOURCE_SPEC.json`,{cache:'no-store'}).then(r=>r.ok?r.json():({label:cityId}))
    ]);

    const allowed=['clean','cartoon','grotesque'];
    const fallback=allowed.includes(style.cartoonMassing?.defaultMode)?style.cartoonMassing.defaultMode:'cartoon';
    const look=allowed.includes(requestedLook)?requestedLook:fallback;
    metrics.look=look;
    bindLookButtons(look);
    bindFeatureButtons();

    document.title=`KFB OSM City Lab · ${spec.label||cityId} · ${look}`;
    brand.textContent=`KFB OSM CITY LAB · ${(spec.label||cityId).toUpperCase()}`;

    const p=materialPalette(style);
    const L=style.layers||{};
    metrics.zLevels={
      ground:Number(L.groundY??-.16),
      landuse:Number(L.landuseY??-.11),
      sidewalk:Number(L.sidewalkY??-.005),
      path:Number(L.pathY??.03),
      road:Number(L.roadY??.095),
      waterLine:Number(L.waterLineY??.045)
    };

    root.add(polygonSurface([
      {x:city.bounds.min.x-30,z:city.bounds.min.z-30},
      {x:city.bounds.max.x+30,z:city.bounds.min.z-30},
      {x:city.bounds.max.x+30,z:city.bounds.max.z+30},
      {x:city.bounds.min.x-30,z:city.bounds.max.z+30},
      {x:city.bounds.min.x-30,z:city.bounds.min.z-30}
    ],metrics.zLevels.ground,mat('#899d79'),0));

    for(const a of city.features.landuse){
      if(a.class==='green')root.add(polygonSurface(a.polygon,metrics.zLevels.landuse,mat(p.green),1));
      if(a.class==='water')root.add(polygonSurface(a.polygon,Number(L.waterAreaY??-.095),mat(p.water,.5),1));
    }

    addStreetSurfaces(THREE,city,p,style);

    for(const w of city.features.waterLines){
      const line=joinedStrip(THREE,w.line,3,metrics.zLevels.waterLine,mat(p.water,.5));
      if(line){line.renderOrder=3;root.add(line);}
    }

    const windowBuckets=Array.from({length:Math.max(1,p.window.length)},()=>[]);
    for(const b of city.features.buildings)addBuilding(b,p,style,look,windowBuckets);
    if(look!=='clean')addWindowInstances(windowBuckets,p);

    if(requestedLabels){
      streetSignController=createStreetSigns(THREE,city.features.roads,style.streetSigns||{},p.streetSign,style.seed||'kfb-city',city.features.buildings);
      root.add(streetSignController.root);
      metrics.streetSigns=streetSignController.candidates.length;
      const clearances=streetSignController.candidates.map(c=>c.buildingClearanceM).filter(Number.isFinite);
      metrics.streetSignMinBuildingClearanceM=clearances.length?Math.min(...clearances):null;
    }

    if(requestedNature){
      status.textContent='Loading KayKit forest POC…';
      natureController=await createNaturePoc(THREE,city,style.naturePoc||{},style.seed||'kfb-city');
      root.add(natureController.root);
      natureController.root.visible=true;
      metrics.natureInstances=natureController.candidates.length;
      metrics.natureAssets=[...natureController.loadedAssets];
      if(natureController.errors.length)console.warn('[city nature POC] asset load errors',natureController.errors);
    }

    if(requestedFurniture){
      status.textContent='Loading KayKit city furniture R0…';
      cityFurnitureController=await createCityFurniture(THREE,city,style.cityFurnitureR0||{},style.seed||'kfb-city');
      root.add(cityFurnitureController.root);
      metrics.cityFurnitureInstances=cityFurnitureController.candidates.length;
      metrics.cityFurnitureByType={...cityFurnitureController.byType};
      metrics.cityFurnitureAssets=[...cityFurnitureController.loadedAssets];
      metrics.trafficSignalJunctions=cityFurnitureController.trafficPlan.junctions.length;
      metrics.trafficPlanStatus=cityFurnitureController.trafficPlan.status;
      if(cityFurnitureController.errors.length)console.warn('[city furniture R0] asset load errors',cityFurnitureController.errors);
    }

    const startView=requestedLabels?'sign':look==='grotesque'?'grotesque':look==='cartoon'?'cartoon':'oblique';
    if(startView==='sign')focusStreetSign(city.bounds);
    else frame(city.bounds,startView);
    document.querySelectorAll('[data-camera]').forEach(button=>{
      button.onclick=()=>button.dataset.camera==='sign'?focusStreetSign(city.bounds):frame(city.bounds,button.dataset.camera);
    });

    status.textContent=look==='grotesque'
      ?'S1c grotesque massing · wide-angle + cubist ring stagger'
      :look==='cartoon'
        ?'S1c cartoon massing · stronger controlled skew'
        :'S1c clean massing · OSM anatomy baseline';

    const features=[
      requestedLabels?`${metrics.streetSigns} street signs`:null,
      requestedNature?`${metrics.natureInstances} KayKit trees`:null,
      requestedFurniture?`${metrics.cityFurnitureInstances} city props / ${metrics.trafficSignalJunctions} signal junctions`:null
    ].filter(Boolean).join(' · ');

    diag.textContent=`${city.diagnostics.featureCounts.roads} roads · ${city.diagnostics.featureCounts.buildings} buildings · ${metrics.roadJunctionPatches} road junction patches · ${metrics.pathMeshes} paths below roads${features?' · '+features:''} · ${city.bounds.sizeM.x.toFixed(0)} × ${city.bounds.sizeM.z.toFixed(0)} m`;

    window.KFBCityLab=Object.freeze({
      report:()=>({
        cityId,look,
        labels:requestedLabels,
        nature:requestedNature,
        furniture:requestedFurniture,
        ...metrics,
        sourceCounts:{...city.diagnostics.featureCounts},
        bounds:city.bounds,
        separateRoofCaps:false,
        s2GeometryDeformed:false,
        movementOwner:'none-viewer-only'
      })
    });
  }catch(err){
    brand.textContent=`KFB OSM CITY LAB · ${cityId.toUpperCase()}`;
    status.textContent='CITY VIEW FAILED';
    diag.textContent=err.message;
    console.error(err);
  }
}

await load();

(function loop(){
  requestAnimationFrame(loop);
  controls.update();
  streetSignController?.update(camera);
  renderer.render(scene,camera);
})();
