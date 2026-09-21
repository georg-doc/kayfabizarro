import * as THREE from 'three';

// Deployment/presentation repair around the existing Race-owned Track Lab module.
// It does not own movement/contact. The underlying module, A0 recipe and Race config remain authoritative.

const originalRender=THREE.WebGLRenderer.prototype.render;
let repairedScene=null;
let vehicleRoot=null;
let visualRoot=null;
let hoverGlow=null;
let wake=null;
let speedLines=null;

function parseSpeed(){
  const text=document.getElementById('speed')?.textContent||'';
  const m=text.match(/(\d+)/);
  return m?Number(m[1]):0;
}

function findVehicleRoot(scene){
  const groups=scene.children.filter(o=>o?.isGroup);
  return groups.find(g=>g.position.lengthSq()>.01&&g.children.some(c=>c?.isGroup))||null;
}

function addHoverFx(root){
  if(hoverGlow)return;
  visualRoot=root.children.find(c=>c?.isGroup)||null;

  hoverGlow=new THREE.Mesh(
    new THREE.CircleGeometry(1.35,28),
    new THREE.MeshBasicMaterial({
      color:0x8eeeff,transparent:true,opacity:.18,depthWrite:false,
      blending:THREE.AdditiveBlending
    })
  );
  hoverGlow.rotation.x=-Math.PI/2;
  hoverGlow.position.y=.025;
  root.add(hoverGlow);

  const count=24,arr=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    arr[i*3]=(Math.random()-.5)*2.2;
    arr[i*3+1]=.04+Math.random()*.26;
    arr[i*3+2]=-1-Math.random()*5;
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(arr,3));
  wake=new THREE.Points(g,new THREE.PointsMaterial({
    color:0xd7f7ff,size:.16,transparent:true,opacity:0,depthWrite:false,
    blending:THREE.AdditiveBlending
  }));
  root.add(wake);

  const lines=16,pos=new Float32Array(lines*6);
  for(let i=0;i<lines;i++){
    const x=(Math.random()-.5)*6.5,y=.35+Math.random()*2.4,z=-2-Math.random()*9,l=.8+Math.random()*2.4;
    pos[i*6]=x;pos[i*6+1]=y;pos[i*6+2]=z;
    pos[i*6+3]=x;pos[i*6+4]=y;pos[i*6+5]=z-l;
  }
  const lg=new THREE.BufferGeometry();
  lg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  speedLines=new THREE.LineSegments(lg,new THREE.LineBasicMaterial({
    color:0xe9fbff,transparent:true,opacity:0,depthWrite:false
  }));
  root.add(speedLines);
}

THREE.WebGLRenderer.prototype.render=function(scene,camera){
  // Current human finding: realtime shadows create distracting inner-curve artifacts.
  // For this Track-Lab gate use a clean stylized no-shadow presentation and a fake hover cue.
  this.shadowMap.enabled=false;

  if(repairedScene!==scene){
    repairedScene=scene;
    scene.traverse(o=>{
      if(o?.isLight)o.castShadow=false;
      if(o?.isMesh){o.castShadow=false;o.receiveShadow=false;}
    });
  }

  if(!vehicleRoot||!vehicleRoot.parent){
    vehicleRoot=findVehicleRoot(scene);
    if(vehicleRoot)addHoverFx(vehicleRoot);
  }

  if(vehicleRoot&&visualRoot&&hoverGlow&&wake&&speedLines){
    const speed=parseSpeed();
    const n=Math.min(1,speed/295);
    visualRoot.position.y=.14+Math.sin(performance.now()*.006)*.015*(.35+.65*n);
    hoverGlow.material.opacity=.14+.16*n;
    wake.material.opacity=Math.max(0,n-.08)*.45;
    speedLines.material.opacity=Math.max(0,n-.32)*.38;

    const a=wake.geometry.getAttribute('position');
    for(let i=0;i<a.count;i++){
      let z=a.getZ(i)-(.03+speed*.0009);
      if(z<-7){
        z=-.8-Math.random()*1.2;
        a.setX(i,(Math.random()-.5)*2.4);
        a.setY(i,.04+Math.random()*.28);
      }
      a.setZ(i,z);
    }
    a.needsUpdate=true;
  }

  return originalRender.call(this,scene,camera);
};

try{
  await import('/kfb-hub/stunt-race/track-lab/track-lab-a0.mjs?v=20260917-v061-repair');
}catch(err){
  console.error(err);
  const loading=document.getElementById('loading');
  if(loading)loading.textContent='Track Lab module failed to load · '+err.message;
}
