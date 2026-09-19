import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {buildLandmark,MODEL_IDS} from '../pilot-02/geometry.mjs';
import {shapeAsset,modeSupported} from '../pilot-03/deform.mjs';
import {bandRigLandmark} from '../pilot-05/band-rig.mjs';
import {createBandRigGroup,disposeBandRig} from '../pilot-05/band-three.mjs';
import {createLandmarkGroup,disposeLandmark} from '../pilot-01/three-adapter.mjs';
import {
  resolveLandmarkColours,resolveTravelBiomeFloor,resolveOsmFloor,
  applyWorldEnvironment,worldStyleReport
} from '../../styles/landmark-world-style.mjs';

const CURRENT=['eiffel','giza','stonehenge','pentagon','spasskaya','kremlin-wall'];
const BAND=new Set(['spasskaya','kremlin-wall']);

export async function boot(){
  const canvas=document.querySelector('#view'),stage=document.querySelector('#stage'),status=document.querySelector('#status');
  const [profiles,snapshot,cityStyle]=await Promise.all([
    fetch('../../styles/landmark-style-profiles.v1.json',{cache:'no-store'}).then(r=>r.json()),
    fetch('../../styles/travel-visual-snapshot.v1.json',{cache:'no-store'}).then(r=>r.json()),
    fetch('../../../osm-city-lab/styles/kfb-city-v0.json',{cache:'no-store'}).then(r=>r.json())
  ]);

  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(45,1,.1,10000);
  const controls=new OrbitControls(camera,canvas);
  controls.enableDamping=true;controls.dampingFactor=.1;controls.maxPolarAngle=Math.PI*.495;

  const content=new THREE.Group();scene.add(content);

  let model='eiffel',shapeMode=profiles.defaultShapeMode||'city-grotesque';
  let environment=profiles.defaultEnvironment||'travel',mood='verdant',biomeIndex=0,timeOfDay='day';
  let view=null,viewKind=null,asset=null,floor=null,grid=null,wire=false,worldEnv=null;

  const q=new URLSearchParams(location.search);
  if(CURRENT.includes(q.get('model')))model=q.get('model');
  if(['base','city-grotesque','soft-cubist','voxel-steps','boxel'].includes(q.get('shape')))shapeMode=q.get('shape');
  if(['osm','travel'].includes(q.get('environment')))environment=q.get('environment');
  if(snapshot.moods[q.get('mood')])mood=q.get('mood');
  if(['day','evening','night'].includes(q.get('time')))timeOfDay=q.get('time');

  function resize(){
    const r=stage.getBoundingClientRect();if(r.width<1||r.height<1)return;
    renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);

  function destroy(){
    if(viewKind==='band'&&view)disposeBandRig(view);
    if(viewKind==='generic'&&view?.root)disposeLandmark(view.root);
    if(view?.root?.parent)view.root.parent.remove(view.root);
    view=null;viewKind=null;
    if(floor){scene.remove(floor);floor.geometry.dispose();floor.material.dispose();floor=null;}
    if(grid){scene.remove(grid);grid.geometry.dispose();grid.material.dispose();grid=null;}
  }

  function allowedShape(){
    if((shapeMode==='voxel-steps'||shapeMode==='boxel')&&model!=='giza')return 'city-grotesque';
    if(BAND.has(model)&&(shapeMode==='voxel-steps'||shapeMode==='boxel'))return 'city-grotesque';
    return shapeMode;
  }

  function buildStyled(){
    const raw=buildLandmark(model),mode=allowedShape();
    if(BAND.has(model)&&['base','city-grotesque','soft-cubist'].includes(mode))return bandRigLandmark(raw,cityStyle,mode);
    return shapeAsset(raw,cityStyle,modeSupported(model,mode)?mode:'city-grotesque');
  }

  function colours(){
    return resolveLandmarkColours(model,profiles,snapshot,{
      environment,mood,biomeIndex,timeOfDay
    });
  }

  function makeFloor(){
    const box=new THREE.Box3().setFromObject(content),s=box.getSize(new THREE.Vector3()),c=box.getCenter(new THREE.Vector3());
    const radius=Math.max(s.x,s.z)*.72+s.y*.18;
    const col=environment==='travel'
      ?resolveTravelBiomeFloor(snapshot,{mood,biomeIndex})
      :resolveOsmFloor(cityStyle);
    floor=new THREE.Mesh(
      new THREE.CylinderGeometry(radius,radius*1.025,Math.max(.3,radius*.012),48),
      new THREE.MeshStandardMaterial({color:col,roughness:1,flatShading:true})
    );
    floor.position.set(c.x,-Math.max(.3,radius*.012)/2-.05,c.z);floor.receiveShadow=true;scene.add(floor);
    grid=new THREE.GridHelper(Math.ceil(radius*2/10)*10,20,'#728277','#728277');
    grid.position.set(c.x,-.035,c.z);grid.visible=document.querySelector('#grid').checked;
    grid.material.transparent=true;grid.material.opacity=.3;scene.add(grid);
  }

  function applyEnvironment(){
    const height=Math.max(5,asset?.bounds?.size?.[1]||20);
    const fogScale=Math.max(1,height/5);
    worldEnv=applyWorldEnvironment(THREE,scene,renderer,{
      environment,snapshot,timeOfDay,fogScale
    });
    if(worldEnv?.lights){
      const diag=Math.max(20,asset?.bounds?.size?.[1]||100);
      for(const l of worldEnv.lights){
        if(l.isDirectionalLight&&l.castShadow){
          l.shadow.mapSize.set(2048,2048);
          l.shadow.camera.left=-diag;l.shadow.camera.right=diag;
          l.shadow.camera.top=diag;l.shadow.camera.bottom=-diag;
          l.shadow.camera.near=.1;l.shadow.camera.far=diag*8;
          l.shadow.camera.updateProjectionMatrix();
        }
      }
    }
  }

  function recolour(){
    if(!view)return;const p=colours();
    view.root.traverse(o=>{
      if(!o.isMesh)return;
      const z=o.userData.kfbMaterialZone||o.material?.userData?.kfbMaterialZone||o.material?.name;
      if(z&&p[z])o.material.color.set(p[z]);
      if(o.material)o.material.wireframe=wire;
    });
  }

  function cameraStyle(){
    camera.filmOffset=0;camera.up.set(0,1,0);camera.fov=45;
    if(allowedShape()==='city-grotesque'){camera.fov=68;camera.filmOffset=7.5;camera.up.set(.06,.9982,0);}
    else if(allowedShape()==='soft-cubist'){camera.fov=56;camera.filmOffset=3;camera.up.set(.03,.9995,0);}
    camera.updateProjectionMatrix();
  }

  function frame(viewName='oblique'){
    cameraStyle();
    const box=new THREE.Box3().setFromObject(content),s=box.getSize(new THREE.Vector3()),c=box.getCenter(new THREE.Vector3()),d=Math.max(1,s.length());
    const v={oblique:[1,.62,1.08],front:[0,.14,1],side:[1,.14,0],top:[0,1,.001]}[viewName]||[1,.62,1.08];
    const dir=new THREE.Vector3(...v).normalize(),vf=camera.fov*Math.PI/180,hf=2*Math.atan(Math.tan(vf/2)*camera.aspect);
    const dist=d*.5/Math.sin(Math.min(vf,hf)/2)*1.13;
    controls.target.copy(c);camera.position.copy(c).addScaledVector(dir,dist);
    camera.near=Math.max(.02,d/4000);camera.far=dist+d*12;camera.updateProjectionMatrix();controls.update();
  }

  function updateOptions(){
    const isGiza=model==='giza';
    for(const v of ['voxel-steps','boxel'])document.querySelector('#shape option[value="'+v+'"]').disabled=!isGiza;
    if(!isGiza&&(shapeMode==='voxel-steps'||shapeMode==='boxel'))shapeMode='city-grotesque';
    document.querySelector('#shape').value=shapeMode;
    document.querySelector('#travelControls').style.display=environment==='travel'?'contents':'none';
  }

  function updateText(){
    const p=profiles.profiles[model],report=worldStyleReport(model,profiles,snapshot,{environment,mood,biomeIndex,timeOfDay});
    document.querySelector('#title').textContent=p.label+' · Grotesque World Style';
    document.querySelector('#note').textContent=
      (allowedShape()==='city-grotesque'?'Grotesque default':'Alternate shape debug')+
      ' · '+environment.toUpperCase()+
      (environment==='travel'?' · '+mood.toUpperCase()+' / '+snapshot.biomes[biomeIndex].name.toUpperCase()+' / '+timeOfDay.toUpperCase():'')+
      ' · landmark-local cartoon palette / host-owned world light.';
    status.textContent=asset.triangles.toLocaleString('en')+' triangles · '+allowedShape().toUpperCase().replaceAll('-',' ')+' · 1 unit = 1 m · style source Travel '+snapshot.sourceCommit.slice(0,8)+' / OSM '+profiles.sourcePins.osmCityStyle.blob.slice(0,8);
    window.__KFB_LANDMARK_STYLE_V1__={ready:true,model,shapeMode:allowedShape(),environment,mood,biomeIndex,timeOfDay,report};
  }

  function load(){
    destroy();updateOptions();asset=buildStyled();
    const p=colours();
    if(BAND.has(model)&&asset.rig?.bands){
      view=createBandRigGroup(THREE,asset,p);viewKind='band';
    }else{
      const root=createLandmarkGroup(THREE,asset,p);view={root};viewKind='generic';
    }
    content.add(view.root);
    applyEnvironment();recolour();makeFloor();resize();frame();updateText();
    document.querySelector('#model').value=model;document.querySelector('#environment').value=environment;
    document.querySelector('#mood').value=mood;document.querySelector('#biome').value=String(biomeIndex);document.querySelector('#time').value=timeOfDay;
  }

  document.querySelector('#model').addEventListener('change',e=>{model=e.target.value;load();});
  document.querySelector('#shape').addEventListener('change',e=>{shapeMode=e.target.value;load();});
  document.querySelector('#environment').addEventListener('change',e=>{environment=e.target.value;load();});
  document.querySelector('#mood').addEventListener('change',e=>{mood=e.target.value;load();});
  document.querySelector('#biome').addEventListener('change',e=>{biomeIndex=Number(e.target.value)|0;load();});
  document.querySelector('#time').addEventListener('change',e=>{timeOfDay=e.target.value;load();});
  document.querySelector('#wire').addEventListener('change',e=>{wire=e.target.checked;recolour();});
  document.querySelector('#grid').addEventListener('change',e=>{if(grid)grid.visible=e.target.checked;});
  for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>frame(b.dataset.view));

  resize();load();
  renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera);});
}
