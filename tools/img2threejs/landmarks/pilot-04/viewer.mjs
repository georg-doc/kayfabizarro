import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {buildLandmark} from '../pilot-02/geometry.mjs';
import {shapeAsset} from '../pilot-03/deform.mjs';
import {zoneColours} from '../pilot-02/presentation.mjs';
import {CITY_STYLE_URL} from '../pilot-01/presentation.mjs';
import {createLandmarkGroup,disposeLandmark} from '../pilot-01/three-adapter.mjs';
import {exportGLB} from '../pilot-01/glb.mjs';
import {rigLandmark,rigidDistanceReport} from './rig.mjs';
import {createRiggedLandmarkGroup,disposeRiggedLandmark,addRigHelpers} from './rig-three.mjs';
import {createLivingToyReactor} from './reactor.mjs';

export async function boot(){
  const canvas=document.querySelector('#view'),stage=document.querySelector('#stage'),status=document.querySelector('#status');
  const style=window.__KFB_EMBEDDED_CITY_STYLE__||await fetch(CITY_STYLE_URL).then(r=>{if(!r.ok)throw Error('City style HTTP '+r.status);return r.json();});
  const scene=new THREE.Scene();scene.background=new THREE.Color('#d7e0e8');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;
  const camera=new THREE.PerspectiveCamera(42,1,.1,2500),controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.495;
  scene.add(new THREE.HemisphereLight(0xffffff,0x6b756e,1.55));
  const sun=new THREE.DirectionalLight(0xfff0d1,2.35);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);scene.add(sun);scene.add(sun.target);
  const content=new THREE.Group();scene.add(content);

  let model='spasskaya',shapeMode='city-grotesque',rigMode='grouped',paletteMode='city',vibe='idle';
  let bpm=112,intensity=.65,wire=false,showRig=true,current=null,reactor=null,floor=null,grid=null,helpers=null,lastAsset=null;
  const params=new URLSearchParams(location.search);
  if(['spasskaya','kremlin-wall'].includes(params.get('model')))model=params.get('model');
  if(['base','city-grotesque','soft-cubist'].includes(params.get('shape')))shapeMode=params.get('shape');
  if(['grouped','legacy'].includes(params.get('rig')))rigMode=params.get('rig');

  function resize(){const r=stage.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);camera.updateProjectionMatrix();}
  new ResizeObserver(resize).observe(stage);

  function palette(asset){return zoneColours(asset,style,paletteMode);}
  function fakeRigView(root,asset){
    const body=new THREE.Group();body.name='landmarkBody';content.add(body);body.add(root);
    const materialsByZone=new Map();
    root.traverse(o=>{if(o.isMesh){const z=o.userData.kfbMaterialZone||o.material?.userData?.kfbMaterialZone||o.material?.name;if(z){if(!materialsByZone.has(z))materialsByZone.set(z,[]);materialsByZone.get(z).push(o.material);}}});
    return {root:body,body,groups:new Map(),materialsByZone,asset,legacyInner:root};
  }
  function disposeCurrent(){
    reactor?.reset();reactor=null;
    if(!current)return;
    if(rigMode==='grouped')disposeRiggedLandmark(current);
    else{
      if(current.legacyInner)disposeLandmark(current.legacyInner);
      if(current.root.parent)current.root.parent.remove(current.root);
    }
    content.clear();current=null;helpers=null;
    if(floor){scene.remove(floor);floor.geometry.dispose();floor.material.dispose();floor=null;}
    if(grid){scene.remove(grid);grid.geometry.dispose();grid.material.dispose();grid=null;}
  }
  function recolour(){
    if(!current)return;const p=palette(lastAsset);
    current.root.traverse(o=>{if(!o.isMesh)return;const z=o.userData.kfbMaterialZone||o.material?.userData?.kfbMaterialZone||o.material?.name;if(z&&p[z])o.material.color.set(p[z]);o.material.wireframe=wire;});
  }
  function cameraStyle(){
    camera.filmOffset=0;camera.up.set(0,1,0);camera.fov=42;
    if(shapeMode==='city-grotesque'){camera.fov=68;camera.filmOffset=7.5;camera.up.set(.065,.9979,0);}
    if(shapeMode==='soft-cubist'){camera.fov=56;camera.filmOffset=3.2;camera.up.set(.03,.9995,0);}
    camera.updateProjectionMatrix();
  }
  function frame(view='oblique'){
    cameraStyle();const box=new THREE.Box3().setFromObject(content),size=box.getSize(new THREE.Vector3()),c=box.getCenter(new THREE.Vector3()),diag=Math.max(1,size.length());
    const v={oblique:[1,.62,1.08],front:[0,.12,1],side:[1,.12,0],top:[0,1,.001]}[view]||[1,.62,1.08],dir=new THREE.Vector3(...v).normalize();
    const vf=camera.fov*Math.PI/180,hf=2*Math.atan(Math.tan(vf/2)*camera.aspect),dist=diag*.5/Math.sin(Math.min(vf,hf)/2)*1.12;
    controls.target.copy(c);camera.position.copy(c).addScaledVector(dir,dist);camera.near=Math.max(.02,diag/3000);camera.far=dist+diag*10;camera.updateProjectionMatrix();controls.update();
    sun.position.copy(c).add(new THREE.Vector3(-diag*.7,diag,diag*.8));sun.target.position.copy(c);
  }
  function makeFloor(){
    const box=new THREE.Box3().setFromObject(content),size=box.getSize(new THREE.Vector3()),c=box.getCenter(new THREE.Vector3()),radius=Math.max(size.x,size.z)*.72+size.y*.15;
    floor=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius*1.02,Math.max(.3,radius*.012),48),new THREE.MeshStandardMaterial({color:style.palette.green,roughness:1}));
    floor.position.set(c.x,-Math.max(.3,radius*.012)/2-.06,c.z);floor.receiveShadow=true;scene.add(floor);
    grid=new THREE.GridHelper(Math.ceil(radius*2/10)*10,20,'#809080','#809080');grid.position.set(c.x,-.03,c.z);grid.visible=document.querySelector('#grid').checked;grid.material.transparent=true;grid.material.opacity=.3;scene.add(grid);
  }
  function updateStatus(){
    if(!lastAsset)return;
    const report=rigMode==='grouped'?rigidDistanceReport(buildLandmark(model),lastAsset):[];
    const lock=report.length?Math.max(...report.map(r=>r.maxError)):null;
    const triangles=lastAsset.parts.reduce((s,p)=>s+p.positions.length/9,0);
    const modeLabel=shapeMode.toUpperCase().replaceAll('-',' ');
    const lockLabel=lock==null?'legacy point deformation':('clock rigid error '+lock.toExponential(1)+' m');
    status.textContent=`${triangles.toLocaleString('en')} triangles · ${rigMode.toUpperCase()} · ${modeLabel} · ${lockLabel} · BPM ${bpm} · vibe ${vibe.toUpperCase()}`;
    document.querySelector('#title').textContent=(model==='spasskaya'?'Spasskaya Tower':'Kremlin wall study')+' · Rig v1';
    document.querySelector('#note').textContent=rigMode==='grouped'
      ?'Clock assemblies follow explicit anchors in one shared deformation frame. Idle / disco / impact are preview signals only.'
      :'Legacy Pilot-03 point deformation kept for A/B comparison; attachments are not rigidly locked.';
  }
  function load(){
    disposeCurrent();
    const base=buildLandmark(model);
    if(rigMode==='grouped'){
      lastAsset=rigLandmark(base,style,shapeMode);
      current=createRiggedLandmarkGroup(THREE,lastAsset,palette(lastAsset));content.add(current.root);
      helpers=addRigHelpers(THREE,current,showRig);
    }else{
      lastAsset=shapeAsset(base,style,shapeMode);
      const legacy=createLandmarkGroup(THREE,lastAsset,palette(lastAsset));
      current=fakeRigView(legacy,lastAsset);
    }
    reactor=createLivingToyReactor(THREE,current,{mode:vibe,bpm,intensity});
    recolour();makeFloor();resize();frame();updateStatus();
    document.querySelector('#model').value=model;document.querySelector('#shape').value=shapeMode;document.querySelector('#rigMode').value=rigMode;document.querySelector('#vibe').value=vibe;
    document.querySelector('#showRig').disabled=rigMode!=='grouped';document.querySelector('#showRig').checked=showRig&&rigMode==='grouped';
    window.__KFB_LANDMARK_RIG_V1__={ready:true,model,shapeMode,rigMode,rig:lastAsset.rig||null,owner:'img2threejs-donor',movementOwner:'none',collisionOwner:'none',audioOwner:'external'};
  }

  document.querySelector('#model').addEventListener('change',e=>{model=e.target.value;load();});
  document.querySelector('#shape').addEventListener('change',e=>{shapeMode=e.target.value;load();});
  document.querySelector('#rigMode').addEventListener('change',e=>{rigMode=e.target.value;load();});
  document.querySelector('#palette').addEventListener('change',e=>{paletteMode=e.target.value;recolour();});
  document.querySelector('#vibe').addEventListener('change',e=>{vibe=e.target.value;reactor?.setMode(vibe);updateStatus();});
  document.querySelector('#bpm').addEventListener('input',e=>{bpm=Number(e.target.value);document.querySelector('#bpmValue').textContent=String(bpm);reactor?.setBpm(bpm);updateStatus();});
  document.querySelector('#intensity').addEventListener('input',e=>{intensity=Number(e.target.value);document.querySelector('#intensityValue').textContent=intensity.toFixed(2);reactor?.setIntensity(intensity);});
  document.querySelector('#wire').addEventListener('change',e=>{wire=e.target.checked;recolour();});
  document.querySelector('#grid').addEventListener('change',e=>{if(grid)grid.visible=e.target.checked;});
  document.querySelector('#showRig').addEventListener('change',e=>{showRig=e.target.checked;if(helpers)helpers.visible=showRig;});
  document.querySelector('#impactL').addEventListener('click',()=>reactor?.triggerImpact(1,-1));
  document.querySelector('#impactR').addEventListener('click',()=>reactor?.triggerImpact(1,1));
  for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>frame(b.dataset.view));
  document.querySelector('#export').addEventListener('click',()=>{
    const bytes=exportGLB(lastAsset,palette(lastAsset)),u=URL.createObjectURL(new Blob([bytes],{type:'model/gltf-binary'})),a=document.createElement('a');
    a.href=u;a.download='kfb-'+model+'-'+shapeMode+'-'+rigMode+'-rig-v1.glb';a.click();setTimeout(()=>URL.revokeObjectURL(u),3000);
  });

  resize();load();
  let t0=performance.now()/1000;
  renderer.setAnimationLoop(ms=>{
    const t=ms/1000;reactor?.update(t-t0);controls.update();renderer.render(scene,camera);
  });
}
