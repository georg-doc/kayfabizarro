import * as THREE from 'three';

// v0.6.2 deployment/presentation repair only.
// Movement/contact/rail/camera remain owned by the Race Track Lab runtime.
// Relative import is intentional: it works both at kayfabizarro.pages.dev root
// and under georg-doc.github.io/kayfabizarro/ without losing the repo prefix.

const originalRender=THREE.WebGLRenderer.prototype.render;
let preparedScene=null;
let vehicleRoot=null;
let visualRoot=null;
let hoverGlow=null;
let wake=null;
let dust=null;
let speedLines=null;

function parseSpeed(){
  const m=(document.getElementById('speed')?.textContent||'').match(/(\d+)/);
  return m?Number(m[1]):0;
}

function findVehicleRoot(scene){
  const groups=scene.children.filter(o=>o?.isGroup);
  return groups.find(g=>g.position.lengthSq()>.01&&g.children.some(c=>c?.isGroup))||null;
}

function makePoints(count,color,size){
  const arr=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    arr[i*3]=(Math.random()-.5)*2.5;
    arr[i*3+1]=.03+Math.random()*.25;
    arr[i*3+2]=-1-Math.random()*5.5;
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(arr,3));
  return new THREE.Points(g,new THREE.PointsMaterial({color,size,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));
}

function addHoverFx(root){
  if(hoverGlow)return;
  visualRoot=root.children.find(c=>c?.isGroup)||null;

  hoverGlow=new THREE.Mesh(
    new THREE.RingGeometry(.55,1.45,32),
    new THREE.MeshBasicMaterial({color:0x8eeeff,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending})
  );
  hoverGlow.rotation.x=-Math.PI/2;
  hoverGlow.position.y=.018;
  root.add(hoverGlow);

  wake=makePoints(28,0xcff8ff,.17);root.add(wake);
  dust=makePoints(20,0xe6d7a4,.22);root.add(dust);

  const lines=18,pos=new Float32Array(lines*6);
  for(let i=0;i<lines;i++){
    const x=(Math.random()-.5)*6.8,y=.25+Math.random()*2.6,z=-2-Math.random()*9,l=.7+Math.random()*2.7;
    pos[i*6]=x;pos[i*6+1]=y;pos[i*6+2]=z;
    pos[i*6+3]=x;pos[i*6+4]=y;pos[i*6+5]=z-l;
  }
  const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  speedLines=new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:0xe9fbff,transparent:true,opacity:0,depthWrite:false}));
  root.add(speedLines);
}

function cleanGeneratedPresentation(scene){
  scene.traverse(o=>{
    if(o?.isLight)o.castShadow=false;
    if(!o?.isMesh)return;
    o.castShadow=false;o.receiveShadow=false;
    const mat=o.material;
    const mats=Array.isArray(mat)?mat:[mat];
    for(const m of mats){
      if(!m)continue;
      m.needsUpdate=true;
      const hex=m.color?.getHex?.();
      // White/cream vertical barrier faces were the most likely source of the
      // inner-curve overlap/shadow reading. Rubber tube rails remain visible.
      if(hex===0xeee8d8)o.visible=false;
      // Lift lane-mark rendering priority to avoid coplanar-looking shimmer.
      if(hex===0xb9b8b1){m.polygonOffset=true;m.polygonOffsetFactor=-2;m.polygonOffsetUnits=-2;}
    }
  });
}

function animatePoints(points,speed,resetZ,spread,rate){
  if(!points)return;
  const a=points.geometry.getAttribute('position');
  for(let i=0;i<a.count;i++){
    let z=a.getZ(i)-(rate+speed*.0010);
    if(z<resetZ){z=-.7-Math.random()*1.4;a.setX(i,(Math.random()-.5)*spread);a.setY(i,.02+Math.random()*.28);}
    a.setZ(i,z);
  }
  a.needsUpdate=true;
}

THREE.WebGLRenderer.prototype.render=function(scene,camera){
  this.shadowMap.enabled=false;
  if(preparedScene!==scene){preparedScene=scene;cleanGeneratedPresentation(scene);}
  if(!vehicleRoot||!vehicleRoot.parent){vehicleRoot=findVehicleRoot(scene);if(vehicleRoot)addHoverFx(vehicleRoot);}

  if(vehicleRoot&&visualRoot&&hoverGlow){
    const speed=parseSpeed(),n=Math.min(1,speed/295),t=performance.now()*.006;
    // Deliberately low hover: reads as anti-grav, not an accidentally floating car.
    visualRoot.position.y=.07+Math.sin(t)*(.008+.008*n);
    hoverGlow.material.opacity=.16+.22*n;
    if(wake)wake.material.opacity=Math.max(0,n-.05)*.46;
    if(dust)dust.material.opacity=Math.max(0,n-.12)*.22;
    if(speedLines)speedLines.material.opacity=Math.max(0,n-.30)*.42;
    animatePoints(wake,speed,-7.2,2.5,.035);
    animatePoints(dust,speed,-5.8,3.0,.025);
  }
  return originalRender.call(this,scene,camera);
};

try{
  // RELATIVE path fixes the GitHub Pages failure where /kayfabizarro/ was dropped.
  await import('../track-lab/track-lab-a0.mjs?v=V062-20260917-A');
}catch(err){
  console.error(err);
  const loading=document.getElementById('loading');
  if(loading)loading.textContent='v0.6.2 module failed · '+err.message;
}
