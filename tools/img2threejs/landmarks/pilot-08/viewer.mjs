import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {buildStyledBuildingMesh} from '/kfb-hub/stage/stunt-world/runtime/ChatGPT_web/osm-city-drive/src/city-style.mjs';
import {buildRoadMesh,buildSidewalkMesh} from '/kfb-hub/stage/stunt-world/runtime/ChatGPT_web/osm-city-drive/src/city-geometry.mjs';
import {resolveLandmarkColours,applyWorldEnvironment} from '/tools/img2threejs/styles/landmark-world-style.mjs';
import {buildCologneCathedral} from './dom-geometry.mjs';
import {rigCologneCathedralGrotesque} from './dom-rig.mjs';
import {createWorldMaterialSystem} from './world-material.mjs';
import {createTerrainHost,terrainHeightAt,INTEGRATED_DOM_POSITION} from './terrain-host.mjs';
import {createLighthouseReference,createObservatoryReference} from './tinyskies-reference.mjs';

const BUILD='KFB-TS-OSM-INTEGRATED-V1-20260919';
const SCENE_URL='/tools/osm-city-lab/scenes/huerth-v0.json';
const STYLE_URL='/tools/osm-city-lab/styles/kfb-city-v0.json';
const PROFILE_URL='/tools/img2threejs/styles/landmark-style-profiles.v1.json';
const TRAVEL_URL='/tools/img2threejs/styles/travel-visual-snapshot.v1.json';

function centroid(footprint=[]){
  if(!footprint.length)return {x:0,z:0};
  const xs=footprint.map(p=>p.x),zs=footprint.map(p=>p.z);
  return {x:(Math.min(...xs)+Math.max(...xs))/2,z:(Math.min(...zs)+Math.max(...zs))/2};
}
function citySubset(scene,radius=225){
  const inside=p=>Math.hypot(p.x,p.z)<=radius;
  return {
    ...scene,
    surfaces:{
      ...scene.surfaces,
      roads:(scene.surfaces.roads||[]).filter(r=>(r.centerline||[]).some(inside)),
      sidewalks:(scene.surfaces.sidewalks||[]).filter(r=>(r.centerline||[]).some(inside))
    },
    obstacles:{
      ...scene.obstacles,
      buildings:(scene.obstacles.buildings||[]).filter(b=>{
        const c=centroid(b.footprint);return Math.hypot(c.x,c.z)<=radius;
      })
    }
  };
}
function geometryFromMesh(THREE,data,withColors=false){
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(data.vertices,3));
  if(withColors&&data.colors)geo.setAttribute('color',new THREE.BufferAttribute(data.colors,3));
  geo.setIndex(new THREE.BufferAttribute(data.indices,1));
  geo.computeVertexNormals();geo.computeBoundingSphere();
  return geo;
}
function groupLandmarkByZone(THREE,asset,system,colours){
  const root=new THREE.Group();root.name='cologne-cathedral-grotesque';
  const zonePositions=new Map();
  for(const part of asset.parts){
    if(!zonePositions.has(part.zone))zonePositions.set(part.zone,[]);
    zonePositions.get(part.zone).push(...part.positions);
  }
  const materials=new Map();
  for(const [zone,positions] of zonePositions){
    const opts={color:colours[zone]||'#888888'};
    if(zone==='glazing'){opts.emissive=colours[zone]||'#56788a';opts.emissiveIntensity=.08;opts.transparent=true;opts.opacity=.82;}
    const mat=system.phong(opts,zone==='glazing'?.5:.46,zone==='upper'?2.45:2.7);
    materials.set(zone,mat);
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.computeVertexNormals();
    const mesh=new THREE.Mesh(geo,mat);mesh.name='dom-zone-'+zone;mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.kfbMaterialZone=zone;
    root.add(mesh);
  }
  root.userData.asset=asset;
  return {root,materials,dispose(){root.traverse(o=>{o.geometry?.dispose();});for(const m of materials.values())m.dispose();}};
}
function setDomGlow(domView,gain){
  const m=domView.materials.get('glazing');if(m)m.emissiveIntensity=gain;
}
function makeRoads(THREE,scene,system){
  const group=new THREE.Group();group.name='osm-roads';
  const sidewalks=buildSidewalkMesh(scene),roads=buildRoadMesh(scene);
  if(sidewalks.indices.length){
    const geo=geometryFromMesh(THREE,sidewalks);const mat=system.phong({color:'#a9a398',shininess:4},.16,3.2);
    const mesh=new THREE.Mesh(geo,mat);mesh.position.y=.055;mesh.receiveShadow=true;group.add(mesh);
  }
  if(roads.indices.length){
    const geo=geometryFromMesh(THREE,roads);const mat=system.phong({color:'#4b5052',shininess:8},.2,3);
    const mesh=new THREE.Mesh(geo,mat);mesh.position.y=.10;mesh.receiveShadow=true;group.add(mesh);
  }
  return {group,stats:{roads:roads.stats,sidewalks:sidewalks.stats}};
}
function makeBuildings(THREE,scene,style,system){
  const data=buildStyledBuildingMesh(scene,style,'grotesque'),geo=geometryFromMesh(THREE,data,true);
  const mat=system.phong({vertexColors:true,shininess:15},.48,3);
  const mesh=new THREE.Mesh(geo,mat);mesh.name='osm-grotesque-buildings';mesh.castShadow=true;mesh.receiveShadow=true;
  return {mesh,stats:data.stats};
}
function makeRain(THREE){
  const count=1200,pos=new Float32Array(count*3),speed=new Float32Array(count);
  let s=1837;const rnd=()=>((s=Math.imul(s^s>>>15,1|s)+0x6D2B79F5|0),(s^s>>>14>>>0)/4294967296);
  for(let i=0;i<count;i++){pos[i*3]=(rnd()-.5)*620;pos[i*3+1]=12+rnd()*150;pos[i*3+2]=(rnd()-.5)*620;speed[i]=34+rnd()*38;}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const mat=new THREE.PointsMaterial({color:'#cce8ff',size:.72,transparent:true,opacity:.58,depthWrite:false});
  const points=new THREE.Points(geo,mat);points.name='rain-overlay-world';points.visible=false;
  return {
    points,
    setWeight(w){points.visible=w>0;mat.opacity=.15+.5*w;points.userData.rainWeight=w;},
    update(dt){if(!points.visible)return;const a=geo.attributes.position;for(let i=0;i<count;i++){let y=a.getY(i)-speed[i]*dt;if(y<-4)y=150+(i%17);a.setY(i,y);}a.needsUpdate=true;},
    dispose(){geo.dispose();mat.dispose();}
  };
}
function addPedestal(THREE,system){
  const mat=system.phong({color:'#8b927f',shininess:3},.25,3);
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(26,30,2.2,28),mat);mesh.position.y=-1.1;mesh.receiveShadow=true;return mesh;
}

export async function boot(){
  const canvas=document.querySelector('#view'),stage=document.querySelector('#stage'),status=document.querySelector('#status');
  const [city,style,profiles,snapshot]=await Promise.all([
    fetch(SCENE_URL,{cache:'no-store'}).then(r=>r.json()),
    fetch(STYLE_URL,{cache:'no-store'}).then(r=>r.json()),
    fetch(PROFILE_URL,{cache:'no-store'}).then(r=>r.json()),
    fetch(TRAVEL_URL,{cache:'no-store'}).then(r=>r.json())
  ]);
  const subset=citySubset(city,225),system=createWorldMaterialSystem(THREE);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(48,1,.1,4000),controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.08;controls.maxPolarAngle=Math.PI*.495;
  const integrated=new THREE.Group(),isolation=new THREE.Group();scene.add(integrated,isolation);
  const terrain=createTerrainHost(THREE,system,{size:900,segments:96});integrated.add(terrain.mesh);
  const cityView=makeBuildings(THREE,subset,style,system);integrated.add(cityView.mesh);
  const roads=makeRoads(THREE,subset,system);integrated.add(roads.group);

  const domBase=buildCologneCathedral(),domAsset=rigCologneCathedralGrotesque(domBase,style);
  const domColours=resolveLandmarkColours('koelner-dom',profiles,snapshot,{environment:'osm',mood:'verdant',biomeIndex:0,timeOfDay:'day'});
  const dom=groupLandmarkByZone(THREE,domAsset,system,domColours);
  dom.root.position.set(INTEGRATED_DOM_POSITION.x,-.10,INTEGRATED_DOM_POSITION.z);dom.root.rotation.y=-.38;integrated.add(dom.root);
  const plazaMat=system.phong({color:'#b6ab99',shininess:3},.22,3);
  const plaza=new THREE.Mesh(new THREE.CylinderGeometry(43,47,.55,32),plazaMat);plaza.position.set(INTEGRATED_DOM_POSITION.x,-.12,INTEGRATED_DOM_POSITION.z+7);plaza.receiveShadow=true;integrated.add(plaza);

  const lighthouse=createLighthouseReference(THREE,system);lighthouse.position.set(155,terrainHeightAt(155,-175),-175);lighthouse.rotation.y=.6;integrated.add(lighthouse);
  const observatory=createObservatoryReference(THREE,system);observatory.position.set(160,terrainHeightAt(160,155),155);observatory.rotation.y=-.55;integrated.add(observatory);

  const isolatedLight=createLighthouseReference(THREE,system),isolatedObs=createObservatoryReference(THREE,system),pedestal=addPedestal(THREE,system);isolation.add(pedestal,isolatedLight,isolatedObs);isolatedLight.visible=false;isolatedObs.visible=false;

  const rain=makeRain(THREE);scene.add(rain.points);
  let mode='integrated',lightMode='osm',rainWeight=0,env=null,last=performance.now()/1000;

  function resize(){const r=stage.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);camera.updateProjectionMatrix();}
  new ResizeObserver(resize).observe(stage);

  function applyLight(){
    if(lightMode==='osm'){
      env=applyWorldEnvironment(THREE,scene,renderer,{environment:'osm'});
      system.setRim('#ffe6bd');setDomGlow(dom,.08);
    }else{
      env=applyWorldEnvironment(THREE,scene,renderer,{environment:'travel',snapshot,timeOfDay:lightMode,fogScale:14});
      const p=snapshot.skyPresets[lightMode]||snapshot.skyPresets.day;system.setRim(p.rim);
      setDomGlow(dom,lightMode==='night'?.72:lightMode==='evening'?.30:.10);
    }
    document.querySelector('#light').value=lightMode;
  }
  function frame(){
    const target=mode==='integrated'?integrated:isolation,box=new THREE.Box3().setFromObject(target),size=box.getSize(new THREE.Vector3()),c=box.getCenter(new THREE.Vector3()),d=Math.max(1,size.length());
    const dir=mode==='integrated'?new THREE.Vector3(1.15,.62,1):new THREE.Vector3(1,.55,1);dir.normalize();
    camera.fov=mode==='integrated'?52:43;camera.filmOffset=mode==='integrated'?3.4:0;camera.up.set(.025,.9997,0);camera.updateProjectionMatrix();
    const vf=THREE.MathUtils.degToRad(camera.fov),hf=2*Math.atan(Math.tan(vf/2)*camera.aspect),dist=d*.5/Math.sin(Math.min(vf,hf)/2)*1.08;
    controls.target.copy(c);camera.position.copy(c).addScaledVector(dir,dist);camera.near=Math.max(.05,d/5000);camera.far=dist+d*12;camera.updateProjectionMatrix();controls.update();
  }
  function applyMode(){
    integrated.visible=mode==='integrated';isolation.visible=mode!=='integrated';
    isolatedLight.visible=mode==='lighthouse';isolatedObs.visible=mode==='observatory';
    pedestal.visible=mode!=='integrated';
    document.querySelector('#mode').value=mode;frame();updateStatus();
  }
  function updateStatus(){
    const modeLabel=mode==='integrated'?'Hürth OSM + Grotesque Dom + source-reference props':mode==='lighthouse'?'TinySkies lighthouse source-reference recreation':'TinySkies observatory source-reference recreation';
    status.textContent=`${modeLabel} · light ${lightMode.toUpperCase()} · rain ${rainWeight?'ON':'OFF'} · OSM buildings ${cityView.stats.sourceBuildings} · Dom ${domAsset.triangles.toLocaleString('en')} triangles`;
    document.querySelector('#title').textContent=mode==='integrated'?'TinySkies × OSM × Grotesque · Integrated Proof':mode==='lighthouse'?'Source reference · Lighthouse':'Source reference · Observatory';
    document.querySelector('#note').textContent=mode==='integrated'
      ?'STYLE_INTEGRATION_ONLY_NOT_GEO · one terrain, one world light/rim, stable local palettes.'
      :'Source-derived KFB recreation shown in isolation before integration; no upstream mesh/code asset copied.';
    window.__KFB_TINYSKIES_OSM_PROOF__={
      ready:true,build:BUILD,mode,lightMode,rainWeight,
      osm:{city:city.id,buildings:cityView.stats.sourceBuildings,triangles:cityView.stats.triangles},
      dom:{id:domAsset.id,triangles:domAsset.triangles,shapeMode:domAsset.shapeMode,placement:'STYLE_INTEGRATION_ONLY_NOT_GEO'},
      donorRefs:{lighthouse:lighthouse.userData.sourceReference,observatory:observatory.userData.sourceReference},
      weather:{materialWetness:false,materialAlbedoShift:false}
    };
  }

  document.querySelector('#mode').addEventListener('change',e=>{mode=e.target.value;applyMode();});
  document.querySelector('#light').addEventListener('change',e=>{lightMode=e.target.value;applyLight();updateStatus();});
  document.querySelector('#rain').addEventListener('change',e=>{rainWeight=e.target.checked?1:0;rain.setWeight(rainWeight);updateStatus();});
  document.querySelector('#reset').addEventListener('click',frame);
  document.querySelector('#wire').addEventListener('change',e=>{
    const on=e.target.checked;integrated.traverse(o=>{if(o.isMesh&&o.material)o.material.wireframe=on;});
  });

  resize();applyLight();rain.setWeight(0);applyMode();
  renderer.setAnimationLoop(ms=>{const now=ms/1000,dt=Math.min(.05,Math.max(0,now-last));last=now;rain.update(dt);controls.update();renderer.render(scene,camera);});
}
