import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {materialPalette,pickStable} from '../../src/style/kfb-city-materials.js';
import {applyCartoonMassing,windowCodesForBuilding,stableHash} from '../../src/style/cartoon-city.js';
import {addJunctionPatches} from '../../src/viewer/street-surface.js';
import {buildElasticShell,buildElasticRoof,protectedDetails,centroid} from './elastic-grotesque-clay.mjs';
import {makePalette} from './vendor/racer-cologne/cologne-palette.v1.js';

const FIXTURE_IDS=["way/371401492","way/371401494","way/371401485","way/371401566","way/371401483","way/371401495","way/371401482","way/371401475","way/371401481","way/371401529","way/371401497","way/371401491","way/371401471","way/371401493","way/371401480","way/371401490","way/371401488","way/371401477","way/371401469","way/371401496","way/371401465","way/371401499"];
const MODES=['clean','grotesque','elastic'];
const $=s=>document.querySelector(s),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const RACER_PALETTE_DONOR={
  repository:'georg-doc/KFB-Stunt-Car-Race',
  commit:'cc80f4a1c6c509db9668df79fd53b13cee093a9d',
  file:'KFB Cologne Race Option C-3/lab-v9/cologne-palette.v1.js',
  blob:'38246785ec2c9089737b2a195673a3ad4c07bdf8'
};
const RACER_PALETTE_SEED=stableHash('huerth-look-r2/card-seed-compatible');
const RACER_PALETTE=makePalette(RACER_PALETTE_SEED,{id:'huerth-look-r2',label:'Hürth Look R2'});
const ELASTIC_PALETTE={
  id:'RACER_COLOGNE_HARMONIC_R2',
  walls:[...RACER_PALETTE.buildings],
  roofs:[...RACER_PALETTE.roofs],
  windows:[RACER_PALETTE.roles.waterDeep,RACER_PALETTE.roles.water,RACER_PALETTE.roles.skyMidDay,RACER_PALETTE.roles.deep].filter(Boolean),
  doors:[RACER_PALETTE.roles.coral,RACER_PALETTE.roles.hot,RACER_PALETTE.roles.gold,RACER_PALETTE.roles.magenta,RACER_PALETTE.roles.structure].filter(Boolean),
  ground:'#adc767',road:'#89768f',curb:'#e0c779',path:'#d9bb84',sky:'#bdc8aa'
};
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
const fixturePoints=buildings.flatMap(b=>b.footprint||[]);
const fixtureXs=fixturePoints.map(p=>p.x),fixtureZs=fixturePoints.map(p=>p.z);
const fixtureCenter={x:(Math.min(...fixtureXs)+Math.max(...fixtureXs))/2,z:(Math.min(...fixtureZs)+Math.max(...fixtureZs))/2};
const shadowHalf=Math.max(Math.max(...fixtureXs)-Math.min(...fixtureXs),Math.max(...fixtureZs)-Math.min(...fixtureZs))*.5+22;

const colorSlot=(arr,id,salt='')=>arr[stableHash(ELASTIC_PALETTE.id+':'+salt+':'+id)%arr.length];
function shape(poly){const s=new THREE.Shape();poly.forEach((p,i)=>i?s.lineTo(p.x,-p.z):s.moveTo(p.x,-p.z));return s;}
function cleanGeometry(b,steps=1){const g=new THREE.ExtrudeGeometry(shape(b.footprint),{depth:b.heightM,bevelEnabled:false,steps});g.rotateX(-Math.PI/2);g.computeVertexNormals();return g;}
function material(color,rough=.9,flat=false){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:0,flatShading:flat,side:THREE.DoubleSide});}
function surfaceMaterial(color){const m=material(color,.99,false);m.depthWrite=false;m.polygonOffset=true;m.polygonOffsetFactor=-1;m.polygonOffsetUnits=-1;return m;}
function detailMaterial(color,rough){const m=material(color,rough,false);m.polygonOffset=true;m.polygonOffsetFactor=-1;m.polygonOffsetUnits=-1;return m;}
function lineLength(line){let n=0;for(let i=1;i<(line?.length||0);i++)n+=Math.hypot(line[i].x-line[i-1].x,line[i].z-line[i-1].z);return n;}
function smoothRoadRibbon(line,width,y,mat){
  if(!line||line.length<2)return null;
  const pts=line.map(p=>new THREE.Vector3(p.x,y,p.z));
  const curve=new THREE.CatmullRomCurve3(pts,false,'centripetal',.45);
  const samples=Math.max(8,Math.min(160,Math.ceil(lineLength(line)/3.2)));
  const pos=[],idx=[],half=Math.max(.15,width/2);
  for(let i=0;i<=samples;i++){
    const u=i/samples,p=curve.getPointAt(u),t=curve.getTangentAt(u).normalize(),nx=-t.z,nz=t.x;
    pos.push(p.x+nx*half,y,p.z+nz*half,p.x-nx*half,y,p.z-nz*half);
  }
  for(let i=0;i<samples;i++){const a=i*2,b=a+1,c=a+2,d=a+3;idx.push(a,c,b,b,c,d);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
  const mesh=new THREE.Mesh(g,mat);mesh.receiveShadow=true;return mesh;
}
function addPathRoadConnectors(root,pathMat){
  const driveByNode=new Map();
  for(const road of roads){
    if(!road.driveable)continue;
    const ids=road.nodeIds||[];
    for(let i=0;i<Math.min(ids.length,road.centerline?.length||0);i++){
      const key=ids[i]==null?null:String(ids[i]);if(!key)continue;
      const prev=driveByNode.get(key);
      const width=Math.max(.8,Number(road.widthM)||4);
      if(!prev||width>prev.width)driveByNode.set(key,{width,x:road.centerline[i].x,z:road.centerline[i].z});
    }
  }
  let count=0;
  for(const path of roads){
    if(path.driveable||!path.centerline?.length)continue;
    const ids=path.nodeIds||[],last=path.centerline.length-1;
    for(const i of [0,last]){
      const key=ids[i]==null?null:String(ids[i]),hit=key&&driveByNode.get(key);
      if(!hit)continue;
      const j=i===0?1:last-1;if(j<0||j>=path.centerline.length)continue;
      const node=path.centerline[i],inside=path.centerline[j],dx=node.x-inside.x,dz=node.z-inside.z,len=Math.hypot(dx,dz)||1,ux=dx/len,uz=dz/len;
      const width=Math.max(.8,Number(path.widthM)||1.6),overlap=Math.min(.55,width*.28),reach=hit.width*.5+.7;
      const back={x:node.x-ux*overlap,z:node.z-uz*overlap},through={x:node.x+ux*reach,z:node.z+uz*reach};
      const mesh=smoothRoadRibbon([back,node,through],width,.034,pathMat);
      if(mesh){mesh.receiveShadow=false;mesh.renderOrder=2;mesh.userData.role='path-road-connector';root.add(mesh);count++;}
    }
  }
  return count;
}
function addRoads(root,palette,mode){
  const elastic=mode==='elastic';
  const roadMat=surfaceMaterial(elastic?ELASTIC_PALETTE.road:palette.road);
  const curbMat=surfaceMaterial(elastic?ELASTIC_PALETTE.curb:palette.sidewalk);
  const pathMat=surfaceMaterial(elastic?ELASTIC_PALETTE.path:palette.path);
  for(const r of roads){
    if(r.driveable){
      const curb=smoothRoadRibbon(r.centerline,Math.max(.8,r.widthM)+1.25,.018,curbMat);
      const road=smoothRoadRibbon(r.centerline,Math.max(.8,r.widthM),.048,roadMat);
      if(curb){curb.renderOrder=1;root.add(curb);}if(road){road.renderOrder=2;root.add(road);}
    }else{
      const path=smoothRoadRibbon(r.centerline,Math.max(.8,r.widthM),.032,pathMat);if(path){path.renderOrder=1;root.add(path);}
    }
  }
  if(!elastic)return {roadJunctionPatches:0};
  const driveable=roads.filter(r=>r.driveable);
  const roadSpecs=addJunctionPatches(THREE,root,driveable,{y:.049,material:roadMat,widthExtra:.64,driveableOnly:true,segments:18});
  const pathRoadConnectors=addPathRoadConnectors(root,pathMat);
  for(const child of root.children)if(child.userData?.role==='street-junction-patch')child.renderOrder=3;
  return {roadJunctionPatches:roadSpecs.length,pathRoadConnectors};
}
function addCurrentWindows(root,b,deformation,palette){
  const cfg={...style.cartoonMassing.windows,materialCount:palette.window.length},codes=windowCodesForBuilding(b,deformation,cfg,style.seed||'kfb-city');
  const geo=new THREE.BoxGeometry(1,1,1);
  for(const w of codes){const mesh=new THREE.Mesh(geo,material(palette.window[w.materialIndex%palette.window.length],.64));mesh.position.set(w.x,w.y,w.z);mesh.rotation.y=w.yaw;mesh.scale.set(w.width,w.height,w.depth);root.add(mesh);}
}
function addElasticDetails(root,b,shell){
  const box=new THREE.BoxGeometry(1,1,1),details=protectedDetails(b,shell);
  details.forEach((d,i)=>{
    const colors=d.kind==='window'?ELASTIC_PALETTE.windows:ELASTIC_PALETTE.doors;
    const col=colorSlot(colors,b.id,d.kind+':'+d.facadeIndex+':'+i);
    const mesh=new THREE.Mesh(box,detailMaterial(col,d.kind==='window'?.86:.96));
    const tangent=new THREE.Vector3(d.ux,d.uy,d.uz).normalize();
    const vertical=new THREE.Vector3(d.vx,d.vy,d.vz).normalize();
    const normal=new THREE.Vector3(d.nx,d.ny,d.nz).normalize();
    const basis=new THREE.Matrix4().makeBasis(tangent,vertical,normal);
    mesh.quaternion.setFromRotationMatrix(basis);
    mesh.position.set(d.x-normal.x*d.d*.5,d.y-normal.y*d.d*.5,d.z-normal.z*d.d*.5);
    mesh.scale.set(d.w,d.h,d.d);
    mesh.castShadow=false;mesh.receiveShadow=true;root.add(mesh);
  });
  return details.length;
}
function makeViewer(canvas,mode){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.03;
  const scene=new THREE.Scene(),elastic=mode==='elastic';scene.background=new THREE.Color(elastic?ELASTIC_PALETTE.sky:'#c6d0c4');scene.fog=new THREE.Fog(scene.background,190,430);
  const camera=new THREE.PerspectiveCamera(48,1,.2,700),controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.12;
  scene.add(new THREE.HemisphereLight(elastic?0xffefd5:0xfff4df,elastic?0x536653:0x4b5c50,elastic?2.25:2.0));const sun=new THREE.DirectionalLight(elastic?0xffd8b8:0xffead0,elastic?3.25:3);
  if(elastic){
    sun.position.set(fixtureCenter.x-82,126,fixtureCenter.z+64);sun.target.position.set(fixtureCenter.x,0,fixtureCenter.z);
    sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);sun.shadow.camera.left=-shadowHalf;sun.shadow.camera.right=shadowHalf;sun.shadow.camera.top=shadowHalf;sun.shadow.camera.bottom=-shadowHalf;sun.shadow.camera.near=16;sun.shadow.camera.far=320;sun.shadow.bias=.0002;sun.shadow.normalBias=.055;sun.shadow.radius=2;sun.shadow.camera.updateProjectionMatrix();scene.add(sun,sun.target);
  }else{
    sun.position.set(-90,130,70);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-190;sun.shadow.camera.right=190;sun.shadow.camera.top=190;sun.shadow.camera.bottom=-190;scene.add(sun);
  }
  const root=new THREE.Group();scene.add(root);const palette=materialPalette(style);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(380,410),material(elastic?ELASTIC_PALETTE.ground:'#879b72',1));ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;root.add(ground);const roadMetrics=addRoads(root,palette,mode);
  const buildingRoots=new Map();
  for(const b of buildings){
    const group=new THREE.Group();group.userData.sourceId=b.id;let geom,deformation=null,shell=null,detailCount=0;
    if(mode==='clean'){geom=cleanGeometry(b,1);}
    else if(mode==='grotesque'){geom=cleanGeometry(b,Math.max(2,style.cartoonMassing.presets.grotesque.verticalSteps));deformation=applyCartoonMassing(geom,b.id,style.cartoonMassing.presets.grotesque,style.seed||'kfb-city');}
    else {
      shell=buildElasticShell(b,anchor);geom=shell.geometry;
      const roof=new THREE.Mesh(buildElasticRoof(b,shell),material(colorSlot(ELASTIC_PALETTE.roofs,b.id,'roof'),.98));roof.castShadow=true;roof.receiveShadow=false;group.add(roof);detailCount=addElasticDetails(group,b,shell);
    }
    const color=elastic?colorSlot(ELASTIC_PALETTE.walls,b.id,'wall'):pickStable(palette[b.materialClass],b.id),mesh=new THREE.Mesh(geom,material(color,elastic?.975:.9,mode!=='elastic'));mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);
    if(mode==='grotesque')addCurrentWindows(group,b,deformation,palette);
    group.userData.detailCount=detailCount;root.add(group);buildingRoots.set(b.id,group);
  }
  const defaultTarget=new THREE.Vector3(anchor.x,3,anchor.z);
  function frame(target=defaultTarget,dist=215,pitch=.55,yaw=.72){controls.target.copy(target);camera.position.set(target.x+Math.sin(yaw)*Math.cos(pitch)*dist,target.y+Math.sin(pitch)*dist,target.z+Math.cos(yaw)*Math.cos(pitch)*dist);camera.lookAt(target);controls.update();}
  function focus(b){const c=centroid(b.footprint);frame(new THREE.Vector3(c.x,b.heightM*.42,c.z),58+Math.max(0,b.heightM-10)*2,.42,.72);}
  function reset(){frame(defaultTarget,215,.55,.72);}
  function isolate(id,on){for(const [bid,g] of buildingRoots)g.visible=!on||bid===id;}
  function visibleCount(){let n=0;for(const g of buildingRoots.values())if(g.visible)n++;return n;}
  function resize(){const r=canvas.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);camera.updateProjectionMatrix();}
  new ResizeObserver(resize).observe(canvas);resize();reset();
  (function loop(){requestAnimationFrame(loop);controls.update();renderer.render(scene,camera);})();
  const totalDetailCount=()=>[...buildingRoots.values()].reduce((n,g)=>n+(g.userData.detailCount||0),0);
  return {mode,focus,reset,isolate,visibleCount,totalDetailCount,isWebGL2:renderer.capabilities.isWebGL2,roadMetrics};
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
window.__KFB_ELASTIC_HUERTH01__=Object.freeze({report:()=>({schema:'kfb.elastic-grotesque-clay.huerth01/0.4-r2-candidate',sourceCity:city.id,sourceBuildings:buildings.length,sourceRoadParts:roads.length,modes:[...MODES],defaultView:'elastic',retainedSwitchViews:['clean','cartoon','grotesque','elastic'],currentGrotesqueDonor:'src/style/cartoon-city.js',elasticCollisionMutation:false,elasticStyleVersion:'ELASTIC_GROUP_WARP_V2',elasticGroupWarp:'COHERENT_LOW_FREQUENCY_FIELD',elasticDetails:'ORGANIC_ALL_VISIBLE_FACADES_FINAL_SURFACE_FRAME',elasticDetailCount:viewers.find(v=>v.mode==='elastic')?.totalDetailCount?.()||0,elasticShadow:'4096_TIGHT_FIT_BIAS_0_0002_NORMAL_0_055_ROOF_NO_RECEIVE',elasticRoadSurface:'CATMULL_RIBBON_OSM_NODE_ASPHALT_PATCH_PLUS_PATH_CONNECTOR',elasticRoadJunctionPatches:viewers.find(v=>v.mode==='elastic')?.roadMetrics?.roadJunctionPatches||0,elasticPathRoadConnectors:viewers.find(v=>v.mode==='elastic')?.roadMetrics?.pathRoadConnectors||0,elasticRoof:'FINAL_TOP_OUTLINE_EAVE_OVERHANG_R2',elasticPalette:ELASTIC_PALETTE.id,elasticPaletteScheme:RACER_PALETTE.scheme,elasticPaletteSeed:RACER_PALETTE_SEED,elasticPaletteDonor:RACER_PALETTE_DONOR,selectedId:select.value||null,isolated,visibleCounts:Object.fromEntries(viewers.map(v=>[v.mode,v.visibleCount()])),webgl2:Object.fromEntries(viewers.map(v=>[v.mode,v.isWebGL2])),humanAcceptance:'R2_PENDING_REVIEW'})});
