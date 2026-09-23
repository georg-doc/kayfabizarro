import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {materialPalette,pickStable} from '../../src/style/kfb-city-materials.js';
import {applyCartoonMassing,windowCodesForBuilding} from '../../src/style/cartoon-city.js';
import {joinedStrip} from '../../src/viewer/street-surface.js';
import {buildElasticShell,buildElasticRoof,protectedDetails,centroid} from './elastic-grotesque-clay.mjs';

const FIXTURE_IDS=["way/371401492","way/371401494","way/371401485","way/371401566","way/371401483","way/371401495","way/371401482","way/371401475","way/371401481","way/371401529","way/371401497","way/371401491","way/371401471","way/371401493","way/371401480","way/371401490","way/371401488","way/371401477","way/371401469","way/371401496","way/371401465","way/371401499"];
const MODES=['clean','grotesque','elastic'];
const $=s=>document.querySelector(s),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const [city,style]=await Promise.all([
  fetch('../../data/huerth-v0/normalized.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Hürth normalized.json '+r.status);return r.json();}),
  fetch('../../styles/kfb-city-v0.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('KFB city style '+r.status);return r.json();})
]);
const byId=new Map(city.features.buildings.map(b=>[b.id,b]));
const buildings=FIXTURE_IDS.map(id=>byId.get(id)).filter(Boolean);
if(buildings.length!==FIXTURE_IDS.length)throw new Error('Pinned Hürth fixture mismatch: '+buildings.length+'/'+FIXTURE_IDS.length);

const centers=buildings.map(b=>centroid(b.footprint));
const anchor=centers.reduce((a,c)=>({x:a.x+c.x/centers.length,z:a.z+c.z/centers.length}),{x:0,z:0});
const roads=city.features.roads.filter(r=>r.centerline?.some(p=>Math.abs(p.x-anchor.x)<150&&Math.abs(p.z-anchor.z)<190));

function shape(poly){const s=new THREE.Shape();poly.forEach((p,i)=>i?s.lineTo(p.x,-p.z):s.moveTo(p.x,-p.z));return s;}
function cleanGeometry(b,steps=1){const g=new THREE.ExtrudeGeometry(shape(b.footprint),{depth:b.heightM,bevelEnabled:false,steps});g.rotateX(-Math.PI/2);g.computeVertexNormals();return g;}
function material(color,rough=.9,flat=false){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:0,flatShading:flat,side:THREE.DoubleSide});}
function addRoads(root,palette){
  const roadMat=material(palette.road,.98),pathMat=material(palette.path,.98);
  for(const r of roads){const mat=r.driveable?roadMat:pathMat;const m=joinedStrip(THREE,r.centerline,Math.max(.8,r.widthM),.02,mat);if(m){m.receiveShadow=true;root.add(m);}}
}
function addCurrentWindows(root,b,deformation,palette){
  const cfg={...style.cartoonMassing.windows,materialCount:palette.window.length},codes=windowCodesForBuilding(b,deformation,cfg,style.seed||'kfb-city');
  const geo=new THREE.BoxGeometry(1,1,1);
  for(const w of codes){const mesh=new THREE.Mesh(geo,material(palette.window[w.materialIndex%palette.window.length],.64));mesh.position.set(w.x,w.y,w.z);mesh.rotation.y=w.yaw;mesh.scale.set(w.width,w.height,w.depth);root.add(mesh);}
}
function addElasticDetails(root,b,shell,palette){
  const box=new THREE.BoxGeometry(1,1,1),frameMat=material('#ead3ad',.97),glassMat=material(palette.window[0],.78),doorMat=material('#6d4438',.97);
  for(const d of protectedDetails(b,shell)){
    if(d.kind==='window'){
      const frame=new THREE.Mesh(box,frameMat),glass=new THREE.Mesh(box,glassMat);
      frame.position.set(d.x,d.y,d.z);frame.rotation.y=d.yaw;frame.scale.set(d.w,d.h,d.d);
      glass.position.copy(frame.position);glass.rotation.copy(frame.rotation);glass.translateZ(.09);glass.scale.set(d.w*.78,d.h*.76,d.d*.75);root.add(frame,glass);
    }else{const door=new THREE.Mesh(box,doorMat);door.position.set(d.x,d.y,d.z);door.rotation.y=d.yaw;door.scale.set(d.w,d.h,d.d);root.add(door);}
  }
}
function makeViewer(canvas,mode){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;
  const scene=new THREE.Scene();scene.background=new THREE.Color(mode==='elastic'?'#c1c7b7':'#c6d0c4');scene.fog=new THREE.Fog(scene.background,190,430);
  const camera=new THREE.PerspectiveCamera(48,1,.2,700),controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.12;
  scene.add(new THREE.HemisphereLight(0xfff4df,0x4b5c50,2.0));const sun=new THREE.DirectionalLight(0xffead0,3);sun.position.set(-90,130,70);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-190;sun.shadow.camera.right=190;sun.shadow.camera.top=190;sun.shadow.camera.bottom=-190;scene.add(sun);
  const root=new THREE.Group();scene.add(root);const palette=materialPalette(style);addRoads(root,palette);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(380,410),material('#879b72',1));ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;root.add(ground);
  const buildingRoots=new Map();
  for(const b of buildings){
    const group=new THREE.Group();group.userData.sourceId=b.id;let geom,deformation=null;
    if(mode==='clean'){geom=cleanGeometry(b,1);}
    else if(mode==='grotesque'){geom=cleanGeometry(b,Math.max(2,style.cartoonMassing.presets.grotesque.verticalSteps));deformation=applyCartoonMassing(geom,b.id,style.cartoonMassing.presets.grotesque,style.seed||'kfb-city');}
    else {const shell=buildElasticShell(b,anchor);geom=shell.geometry;const roof=new THREE.Mesh(buildElasticRoof(b,shell),material('#8f654f',.98));roof.castShadow=roof.receiveShadow=true;group.add(roof);addElasticDetails(group,b,shell,palette);}
    const color=pickStable(palette[b.materialClass],b.id),mesh=new THREE.Mesh(geom,material(color,mode==='elastic'?.97:.9,mode!=='elastic'));mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);
    if(mode==='grotesque')addCurrentWindows(group,b,deformation,palette);
    root.add(group);buildingRoots.set(b.id,group);
  }
  const defaultTarget=new THREE.Vector3(anchor.x,3,anchor.z);
  function frame(target=defaultTarget,dist=215,pitch=.55,yaw=.72){controls.target.copy(target);camera.position.set(target.x+Math.sin(yaw)*Math.cos(pitch)*dist,target.y+Math.sin(pitch)*dist,target.z+Math.cos(yaw)*Math.cos(pitch)*dist);camera.lookAt(target);controls.update();}
  function focus(b){const c=centroid(b.footprint);frame(new THREE.Vector3(c.x,b.heightM*.42,c.z),58+Math.max(0,b.heightM-10)*2,.42,.72);}
  function reset(){frame(defaultTarget,215,.55,.72);}
  function isolate(id,on){for(const [bid,g] of buildingRoots)g.visible=!on||bid===id;}\n  function visibleCount(){let n=0;for(const g of buildingRoots.values())if(g.visible)n++;return n;}
  function resize(){const r=canvas.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);camera.updateProjectionMatrix();}
  new ResizeObserver(resize).observe(canvas);resize();reset();
  (function loop(){requestAnimationFrame(loop);controls.update();renderer.render(scene,camera);})();
  return {mode,focus,reset,isolate,visibleCount,isWebGL2:renderer.capabilities.isWebGL2};
}
const viewers=MODES.map(m=>makeViewer($('#'+m),m));
const select=$('#building'),isolate=$('#isolate'),meta=$('#meta');let isolated=false;
for(const b of buildings){const o=document.createElement('option');o.value=b.id;o.textContent=b.id.replace('way/','')+' · '+b.heightM.toFixed(1)+'m · '+(b.roof?.type||'flat').replace('-hint','');select.appendChild(o);}
function update(){
  const b=byId.get(select.value);isolated=false;isolate.classList.remove('active');isolate.textContent='ISOLATE SOURCE';isolate.disabled=!b;
  viewers.forEach(v=>{v.isolate('',false);b?v.focus(b):v.reset();});
  meta.textContent=b?b.id+' · source height '+b.heightM.toFixed(2)+' m · roof hint '+(b.roof?.type||'none')+' · identical OSM footprint in all panels':
    buildings.length+' real Hürth buildings · '+roads.length+' nearby real road parts · source dataset huerth-v0';
}
select.onchange=update;
isolate.onclick=()=>{const b=byId.get(select.value);if(!b)return;isolated=!isolated;isolate.classList.toggle('active',isolated);isolate.textContent=isolated?'SHOW BLOCK':'ISOLATE SOURCE';viewers.forEach(v=>v.isolate(b.id,isolated));};
$('#reset').onclick=()=>{select.value='';update();};update();
window.__KFB_ELASTIC_HUERTH01__=Object.freeze({report:()=>({schema:'kfb.elastic-grotesque-clay.huerth01/0.1-candidate',sourceCity:city.id,sourceBuildings:buildings.length,sourceRoadParts:roads.length,modes:[...MODES],currentGrotesqueDonor:'src/style/cartoon-city.js',elasticCollisionMutation:false,selectedId:select.value||null,isolated,visibleCounts:Object.fromEntries(viewers.map(v=>[v.mode,v.visibleCount()])),webgl2:Object.fromEntries(viewers.map(v=>[v.mode,v.isWebGL2])),humanAcceptance:'PENDING'})});
