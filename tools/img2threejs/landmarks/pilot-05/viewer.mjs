import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {buildLandmark} from '../pilot-02/geometry.mjs';
import {shapeAsset} from '../pilot-03/deform.mjs';
import {zoneColours} from '../pilot-02/presentation.mjs';
import {CITY_STYLE_URL} from '../pilot-01/presentation.mjs';
import {createLandmarkGroup,disposeLandmark} from '../pilot-01/three-adapter.mjs';
import {exportGLB} from '../pilot-01/glb.mjs';
import {bandRigLandmark,clockMountReport} from './band-rig.mjs';
import {createBandRigGroup,addBandHelpers,disposeBandRig} from './band-three.mjs';
import {createBandVibeReactor} from './band-reactor.mjs';

const BAND_COLOURS={lower:'#8e6955',clock:'#d88b4a',belfry:'#78a087',tent:'#666b90'};

export async function boot(){
  const canvas=document.querySelector('#view'),stage=document.querySelector('#stage'),status=document.querySelector('#status');
  const style=window.__KFB_EMBEDDED_CITY_STYLE__||await fetch(CITY_STYLE_URL).then(r=>{if(!r.ok)throw Error('City style HTTP '+r.status);return r.json();});
  const scene=new THREE.Scene();scene.background=new THREE.Color('#d7e0e8');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;
  const camera=new THREE.PerspectiveCamera(44,1,.1,3000),controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.495;
  scene.add(new THREE.HemisphereLight(0xffffff,0x6b756e,1.55));
  const sun=new THREE.DirectionalLight(0xfff0d1,2.35);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);scene.add(sun);scene.add(sun.target);
  const content=new THREE.Group();scene.add(content);

  let model='spasskaya',shapeMode='city-grotesque',rigMode='band',paletteMode='city',vibe='idle',bpm=112,intensity=.65,wire=false,showRig=true;
  let view=null,viewKind=null,asset=null,baseAsset=null,reactor=null,floor=null,grid=null,helpers=null;
  const params=new URLSearchParams(location.search);
  if(['spasskaya','kremlin-wall'].includes(params.get('model')))model=params.get('model');
  if(['base','city-grotesque','soft-cubist'].includes(params.get('shape')))shapeMode=params.get('shape');
  if(['band','legacy'].includes(params.get('rig')))rigMode=params.get('rig');

  function resize(){const r=stage.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);camera.updateProjectionMatrix();}
  new ResizeObserver(resize).observe(stage);

  function colours(a){return zoneColours(a,style,paletteMode==='bands'?'city':paletteMode);}
  function recolour(){
    if(!view)return;const p=colours(asset);
    view.root.traverse(o=>{
      if(!o.isMesh)return;
      const zone=o.userData.kfbMaterialZone||o.material?.userData?.kfbMaterialZone||o.material?.name;
      const band=o.userData.kfbRigBand;
      const value=paletteMode==='bands'&&band?BAND_COLOURS[band]:p[zone];
      if(value)o.material.color.set(value);o.material.wireframe=wire;
    });
  }
  function disposeCurrent(){
    reactor?.reset();reactor=null;
    if(viewKind==='band'&&view)disposeBandRig(view);
    if(viewKind==='legacy'&&view?.root)disposeLandmark(view.root);
    if(view?.root?.parent)view.root.parent.remove(view.root);
    view=null;viewKind=null;helpers=null;
    if(floor){scene.remove(floor);floor.geometry.dispose();floor.material.dispose();floor=null;}
    if(grid){scene.remove(grid);grid.geometry.dispose();grid.material.dispose();grid=null;}
  }
  function cameraStyle(){
    camera.filmOffset=0;camera.up.set(0,1,0);camera.fov=44;
    if(shapeMode==='city-grotesque'){camera.fov=62;camera.filmOffset=5.5;camera.up.set(.045,.999,0);}
    if(shapeMode==='soft-cubist'){camera.fov=54;camera.filmOffset=2.5;camera.up.set(.025,.9997,0);}
    camera.updateProjectionMatrix();
  }
  function frame(viewName='oblique'){
    cameraStyle();const box=new THREE.Box3().setFromObject(content),size=box.getSize(new THREE.Vector3()),c=box.getCenter(new THREE.Vector3()),d=Math.max(1,size.length());
    const v={oblique:[1,.62,1.08],front:[0,.12,1],side:[1,.12,0],top:[0,1,.001]}[viewName]||[1,.62,1.08],dir=new THREE.Vector3(...v).normalize();
    const vf=camera.fov*Math.PI/180,hf=2*Math.atan(Math.tan(vf/2)*camera.aspect),dist=d*.5/Math.sin(Math.min(vf,hf)/2)*1.12;
    controls.target.copy(c);camera.position.copy(c).addScaledVector(dir,dist);camera.near=Math.max(.02,d/3000);camera.far=dist+d*10;camera.updateProjectionMatrix();controls.update();
    sun.position.copy(c).add(new THREE.Vector3(-d*.7,d,d*.8));sun.target.position.copy(c);
  }
  function makeFloor(){
    const box=new THREE.Box3().setFromObject(content),size=box.getSize(new THREE.Vector3()),c=box.getCenter(new THREE.Vector3()),rad=Math.max(size.x,size.z)*.72+size.y*.14;
    floor=new THREE.Mesh(new THREE.CylinderGeometry(rad,rad*1.02,Math.max(.3,rad*.012),48),new THREE.MeshStandardMaterial({color:style.palette.green,roughness:1}));
    floor.position.set(c.x,-Math.max(.3,rad*.012)/2-.05,c.z);floor.receiveShadow=true;scene.add(floor);
    grid=new THREE.GridHelper(Math.ceil(rad*2/10)*10,20,'#829282','#829282');grid.position.set(c.x,-.03,c.z);grid.visible=document.querySelector('#grid').checked;grid.material.transparent=true;grid.material.opacity=.3;scene.add(grid);
  }
  function updateStatus(){
    const report=rigMode==='band'?clockMountReport(baseAsset,asset):null;
    const maxErr=report?Math.max(...report.map(r=>r.error)):null;
    const standoff=report?report.map(r=>r.riggedStandoff.toFixed(3)).join(' / '):null;
    document.querySelector('#title').textContent=(model==='spasskaya'?'Spasskaya Tower':'Kremlin wall study')+' · Band Rig v2';
    document.querySelector('#note').textContent=rigMode==='band'
      ?'clock-stage + all four clock assemblies share one semantic affine band transform.'
      :'Legacy Pilot-03 point deformation retained only for A/B.';
    if(rigMode==='band'){
      status.textContent=asset.triangles.toLocaleString('en')+' triangles · BAND RIG · '+shapeMode.toUpperCase().replaceAll('-',' ')+' · host standoff '+standoff+' m · max error '+maxErr.toExponential(1)+' m · BPM '+bpm;
    }else{
      status.textContent=asset.triangles.toLocaleString('en')+' triangles · LEGACY POINT DEFORM · '+shapeMode.toUpperCase().replaceAll('-',' ')+' · BPM '+bpm;
    }
  }
  function load(){
    disposeCurrent();baseAsset=buildLandmark(model);
    if(rigMode==='band'){
      asset=bandRigLandmark(baseAsset,style,shapeMode);
      view=createBandRigGroup(THREE,asset,colours(asset));viewKind='band';content.add(view.root);
      helpers=addBandHelpers(THREE,view,showRig);
      reactor=createBandVibeReactor(THREE,view,{mode:vibe,bpm,intensity});
    }else{
      asset=shapeAsset(baseAsset,style,shapeMode);
      const root=createLandmarkGroup(THREE,asset,colours(asset));view={root};viewKind='legacy';content.add(root);
    }
    recolour();makeFloor();resize();frame();updateStatus();
    document.querySelector('#model').value=model;document.querySelector('#shape').value=shapeMode;document.querySelector('#rigMode').value=rigMode;document.querySelector('#vibe').value=vibe;
    document.querySelector('#showRig').disabled=rigMode!=='band';document.querySelector('#showRig').checked=showRig&&rigMode==='band';
    window.__KFB_LANDMARK_BAND_RIG_V2__={ready:true,model,shapeMode,rigMode,rig:asset.rig||null,owner:'img2threejs-donor',movementOwner:'none',collisionOwner:'none',audioOwner:'external'};
  }

  document.querySelector('#model').addEventListener('change',e=>{model=e.target.value;load();});
  document.querySelector('#shape').addEventListener('change',e=>{shapeMode=e.target.value;load();});
  document.querySelector('#rigMode').addEventListener('change',e=>{rigMode=e.target.value;load();});
  document.querySelector('#palette').addEventListener('change',e=>{paletteMode=e.target.value;recolour();});
  document.querySelector('#vibe').addEventListener('change',e=>{vibe=e.target.value;reactor?.setMode(vibe);});
  document.querySelector('#bpm').addEventListener('input',e=>{bpm=Number(e.target.value);document.querySelector('#bpmValue').textContent=String(bpm);reactor?.setBpm(bpm);updateStatus();});
  document.querySelector('#intensity').addEventListener('input',e=>{intensity=Number(e.target.value);document.querySelector('#intensityValue').textContent=intensity.toFixed(2);reactor?.setIntensity(intensity);});
  document.querySelector('#impactL').addEventListener('click',()=>reactor?.triggerImpact(1,-1));
  document.querySelector('#impactR').addEventListener('click',()=>reactor?.triggerImpact(1,1));
  document.querySelector('#showRig').addEventListener('change',e=>{showRig=e.target.checked;if(helpers)helpers.visible=showRig;});
  document.querySelector('#wire').addEventListener('change',e=>{wire=e.target.checked;recolour();});
  document.querySelector('#grid').addEventListener('change',e=>{if(grid)grid.visible=e.target.checked;});
  for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>frame(b.dataset.view));
  document.querySelector('#export').addEventListener('click',()=>{
    const bytes=exportGLB(asset,colours(asset)),u=URL.createObjectURL(new Blob([bytes],{type:'model/gltf-binary'})),a=document.createElement('a');
    a.href=u;a.download='kfb-'+model+'-'+shapeMode+'-'+rigMode+'-band-rig-v2.glb';a.click();setTimeout(()=>URL.revokeObjectURL(u),3000);
  });

  resize();load();
  renderer.setAnimationLoop(ms=>{if(reactor)reactor.update(ms/1000);controls.update();renderer.render(scene,camera);});
}
