import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {buildStyledBuildingMesh as buildLegacyCity} from '../../../../kfb-hub/stage/stunt-world/runtime/ChatGPT_web/osm-city-drive/src/city-style.mjs';
import {buildRoadMesh,buildSidewalkMesh} from '../../../../kfb-hub/stage/stunt-world/runtime/ChatGPT_web/osm-city-drive/src/city-geometry.mjs';
import {buildCologneCathedral} from '../../../../kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/dom-geometry.mjs';
import {rigCologneCathedralGrotesque} from '../../../../kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/dom-rig.mjs';
import {createWorldMaterialSystem} from '../../../../kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/world-material.mjs';
import {applyWorldEnvironment,resolveLandmarkColours} from '../../styles/landmark-world-style.mjs';
import {createGroundingField} from './grounding-field.mjs';
import {createTinySurfaceTerrain} from './terrain-v2.mjs';
import {removeVisibleBaseAndGround,footprintFromBounds} from './ground-landmark.mjs';
import {buildGrotesqueCityV2} from './grotesque-city-v2.mjs';

const BUILD='KFB-GROUND-WORLD-GROTESQUE-V2-20260920';
const SCENE_URL='../../../osm-city-lab/scenes/huerth-v0.json';
const STYLE_URL='../../../osm-city-lab/styles/kfb-city-v0.json';
const PROFILE_URL='../../styles/landmark-style-profiles.v1.json';
const TRAVEL_URL='../../styles/travel-visual-snapshot.v1.json';
const DOM_POS={x:-145,z:148,yaw:-.38};

function centroid(footprint=[]){
  if(!footprint.length)return {x:0,z:0};
  const xs=footprint.map(p=>p.x),zs=footprint.map(p=>p.z);
  return {x:(Math.min(...xs)+Math.max(...xs))/2,z:(Math.min(...zs)+Math.max(...zs))/2};
}
function citySubset(scene,radius=150){
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
function bufferGeometry(THREE,data,withColors=false){
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(data.vertices,3));
  if(withColors&&data.colors)g.setAttribute('color',new THREE.BufferAttribute(data.colors,3));
  g.setIndex(new THREE.BufferAttribute(data.indices,1));
  g.computeVertexNormals();g.computeBoundingSphere();
  return g;
}
function landmarkView(THREE,asset,system,colours){
  const root=new THREE.Group(),positions=new Map(),materials=new Map();
  for(const part of asset.parts){
    if(!positions.has(part.zone))positions.set(part.zone,[]);
    positions.get(part.zone).push(...part.positions);
  }
  for(const [zone,arr] of positions){
    const opts={color:colours[zone]||'#888888'};
    if(zone==='glazing'){opts.emissive=opts.color;opts.emissiveIntensity=.08;opts.transparent=true;opts.opacity=.85;}
    const m=system.phong(opts,zone==='glazing'?.46:.36,zone==='upper'?2.5:2.9);materials.set(zone,m);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));g.computeVertexNormals();
    const mesh=new THREE.Mesh(g,m);mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.zone=zone;root.add(mesh);
  }
  return {root,materials,dispose(){root.traverse(o=>o.geometry?.dispose());for(const m of materials.values())m.dispose();}};
}
function harmonicDomColours(style){
  const p=style.palette;
  return {
    structure:p.buildingPale[0],
    secondary:p.buildingPale[2],
    upper:p.roof[2],
    accent:p.accent[0],
    glazing:p.window[0],
    base:p.buildingIndustrial[2]
  };
}
function roadGroup(THREE,scene,system){
  const group=new THREE.Group(),side=buildSidewalkMesh(scene),road=buildRoadMesh(scene);
  if(side.indices.length){
    const g=bufferGeometry(THREE,side),m=system.phong({color:'#b9ad9f',shininess:4},.16,3.2),mesh=new THREE.Mesh(g,m);
    mesh.position.y=.06;mesh.receiveShadow=true;group.add(mesh);
  }
  if(road.indices.length){
    const g=bufferGeometry(THREE,road),m=system.phong({color:'#40444a',shininess:7},.18,3.1),mesh=new THREE.Mesh(g,m);
    mesh.position.y=.11;mesh.receiveShadow=true;group.add(mesh);
  }
  return {group,stats:{roads:road.stats,sidewalks:side.stats}};
}
function cityShell(THREE,data,system,name,rim=.32){
  const g=bufferGeometry(THREE,data,true),m=system.phong({vertexColors:true,shininess:15},rim,3),mesh=new THREE.Mesh(g,m);
  mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;return {mesh,geometry:g,material:m};
}
function detailInstances(THREE,details,system){
  const group=new THREE.Group();
  const sets=[
    {key:'window-cool',items:details.windows.filter(x=>x.code==='window-cool'),color:'#31414a',emissive:'#26363f',gain:.05},
    {key:'window-warm',items:details.windows.filter(x=>x.code==='window-warm'),color:'#d2aa4a',emissive:'#d2aa4a',gain:.16},
    {key:'street-door',items:details.doors,color:'#5c4650',emissive:null,gain:0}
  ];
  for(const set of sets){
    if(!set.items.length)continue;
    const geo=new THREE.BoxGeometry(1,1,1);
    const mat=system.phong({color:set.color,emissive:set.emissive||'#000000',emissiveIntensity:set.gain,shininess:8},.18,3.2);
    const inst=new THREE.InstancedMesh(geo,mat,set.items.length);inst.name=set.key;
    const dummy=new THREE.Object3D();
    set.items.forEach((d,i)=>{
      dummy.position.set(d.x,d.y,d.z);dummy.rotation.set(0,d.yaw,0);dummy.scale.set(d.width,d.height,d.depth);dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);
    });
    inst.instanceMatrix.needsUpdate=true;inst.castShadow=true;inst.receiveShadow=true;group.add(inst);
  }
  return group;
}
function flatTerrain(THREE,system,size=700){
  const g=new THREE.PlaneGeometry(size,size,1,1);g.rotateX(-Math.PI/2);
  const m=system.phong({color:'#5f8f5b',shininess:3},.18,3.1),mesh=new THREE.Mesh(g,m);mesh.receiveShadow=true;mesh.name='flat-debug-terrain';
  return {mesh,stats:{triangles:2},dispose(){g.dispose();m.dispose();}};
}

export async function boot(){
  const canvas=document.querySelector('#view'),stage=document.querySelector('#stage'),status=document.querySelector('#status');
  const [city,style,profiles,snapshot]=await Promise.all([
    fetch(SCENE_URL,{cache:'no-store'}).then(r=>r.json()),
    fetch(STYLE_URL,{cache:'no-store'}).then(r=>r.json()),
    fetch(PROFILE_URL,{cache:'no-store'}).then(r=>r.json()),
    fetch(TRAVEL_URL,{cache:'no-store'}).then(r=>r.json())
  ]);
  const subset=citySubset(city,150),system=createWorldMaterialSystem(THREE);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(48,1,.1,4000),controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.08;controls.maxPolarAngle=Math.PI*.495;
  const root=new THREE.Group();scene.add(root);

  const domRaw=buildCologneCathedral(),domRig=rigCologneCathedralGrotesque(domRaw,style),domAsset=removeVisibleBaseAndGround(domRig,{rejectParts:['foundation'],targetY:0});
  const domFootprint=footprintFromBounds(domAsset,{x:DOM_POS.x,z:DOM_POS.z},DOM_POS.yaw,5);
  const grounding=createGroundingField(subset,{landmarkFootprints:[domFootprint],buildingInnerM:2,buildingOuterM:12,roadOuterM:13,landmarkInnerM:4,landmarkOuterM:22});

  const tinyTerrain=createTinySurfaceTerrain(THREE,grounding,{size:720,spacing:7.5,seed:1842,heightGain:22,metresPerDomain:165,lowColor:style.palette.greenDark,midColor:style.palette.green,highColor:'#938258',rockColor:'#777063'});
  system.patchRim(tinyTerrain.material,.22,3.2);
  const flat=flatTerrain(THREE,system,720);flat.mesh.visible=false;root.add(tinyTerrain.mesh,flat.mesh);

  const legacyData=buildLegacyCity(subset,style,'grotesque'),legacy=cityShell(THREE,legacyData,system,'legacy-card-stack',.28);legacy.mesh.visible=false;root.add(legacy.mesh);
  const v2Data=buildGrotesqueCityV2(subset,style,{maxBands:5}),v2=cityShell(THREE,v2Data,system,'grotesque-v2',.30);root.add(v2.mesh);
  const details=detailInstances(THREE,v2Data.details,system);root.add(details);

  const roads=roadGroup(THREE,subset,system);root.add(roads.group);

  let paletteMode='harmonic';
  const domIdentity=resolveLandmarkColours('koelner-dom',profiles,snapshot,{environment:'osm',mood:'verdant',biomeIndex:0,timeOfDay:'day'});
  const dom=landmarkView(THREE,domAsset,system,harmonicDomColours(style));dom.root.position.set(DOM_POS.x,-.04,DOM_POS.z);dom.root.rotation.y=DOM_POS.yaw;root.add(dom.root);

  let cityLook='v2',terrainMode='tiny',detailsOn=true,wire=false;
  applyWorldEnvironment(THREE,scene,renderer,{environment:'osm'});system.setRim('#ffe6bd');

  function resize(){const r=stage.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);camera.updateProjectionMatrix();}
  new ResizeObserver(resize).observe(stage);
  function recolourDom(){
    const p=paletteMode==='identity'?domIdentity:harmonicDomColours(style);
    for(const [zone,m] of dom.materials){m.color.set(p[zone]);if(zone==='glazing'){m.emissive.set(p[zone]);m.emissiveIntensity=.08;}}
  }
  function frame(){
    const box=new THREE.Box3();
    for(const o of [v2.mesh,legacy.mesh,roads.group,dom.root])if(o.visible!==false)box.expandByObject(o);
    const s=box.getSize(new THREE.Vector3()),c=box.getCenter(new THREE.Vector3()),d=Math.max(1,s.length()),dir=new THREE.Vector3(1.05,.54,1).normalize();
    camera.fov=49;camera.filmOffset=2;camera.up.set(.018,.9998,0);camera.updateProjectionMatrix();
    const vf=THREE.MathUtils.degToRad(camera.fov),hf=2*Math.atan(Math.tan(vf/2)*camera.aspect),dist=d*.5/Math.sin(Math.min(vf,hf)/2)*.96;
    controls.target.copy(c);camera.position.copy(c).addScaledVector(dir,dist);camera.near=Math.max(.05,d/5000);camera.far=dist+d*12;camera.updateProjectionMatrix();controls.update();
  }
  function applyState(){
    legacy.mesh.visible=cityLook==='legacy';v2.mesh.visible=cityLook==='v2';details.visible=cityLook==='v2'&&detailsOn;
    tinyTerrain.mesh.visible=terrainMode==='tiny';flat.mesh.visible=terrainMode==='flat';
    root.traverse(o=>{if(o.isMesh&&o.material)o.material.wireframe=wire;});
    recolourDom();updateStatus();frame();
  }
  function updateStatus(){
    status.textContent=`Grounding ${terrainMode==='tiny'?'Tiny Surface simplex':'flat debug'} · city ${cityLook==='v2'?'Grotesque v2 cubist':'legacy card-stack'} · OSM buildings ${v2Data.stats.sourceBuildings} · v2 windows ${v2Data.stats.windows} / doors ${v2Data.stats.doors} · Dom base visible NO · terrain triangles ${tinyTerrain.stats.triangles.toLocaleString('en')}`;
    document.querySelector('#title').textContent='Grounding + World Look + Grotesque OSM v2';
    document.querySelector('#note').textContent='Hürth controlled POC · Dom placement remains STYLE_INTEGRATION_ONLY_NOT_GEO.';
    window.__KFB_GROUND_WORLD_GROTESQUE_V2__={
      ready:true,build:BUILD,cityLook,terrainMode,paletteMode,detailsOn,
      grounding:{...grounding.stats,visibleBase:false,domVerticalDropM:domAsset.grounding.verticalDropM},
      terrain:{...tinyTerrain.stats,sineTerrain:false,surface:'simplex-staggered-triangles'},
      city:{legacyTriangles:legacyData.stats.triangles,v2:v2Data.stats},
      dom:{triangles:domAsset.triangles,grounding:domAsset.grounding,placement:'STYLE_INTEGRATION_ONLY_NOT_GEO'}
    };
  }
  document.querySelector('#cityLook').addEventListener('change',e=>{cityLook=e.target.value;applyState();});
  document.querySelector('#terrainMode').addEventListener('change',e=>{terrainMode=e.target.value;applyState();});
  document.querySelector('#domPalette').addEventListener('change',e=>{paletteMode=e.target.value;applyState();});
  document.querySelector('#details').addEventListener('change',e=>{detailsOn=e.target.checked;applyState();});
  document.querySelector('#wire').addEventListener('change',e=>{wire=e.target.checked;applyState();});
  document.querySelector('#reset').addEventListener('click',frame);

  resize();applyState();
  renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera);});
}
