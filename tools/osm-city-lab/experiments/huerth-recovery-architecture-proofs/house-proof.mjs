import * as THREE from 'three';
import {
  buildElasticShell,buildElasticRoof,
  elasticParams,roundFootprint,deformElasticXZ,deformElasticY,centroid
} from './vendor/elastic-v2-donor.mjs';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function addCap(indices,row,ring,up=true){
  const pts=ring.map(q=>new THREE.Vector2(q.x,q.z));
  for(const tri of THREE.ShapeUtils.triangulateShape(pts,[])){
    if(up)indices.push(row[tri[0]],row[tri[2]],row[tri[1]]);
    else indices.push(row[tri[0]],row[tri[1]],row[tri[2]]);
  }
}
function longestEdge(poly){
  const p=poly.slice(0,-1);let best={len:0,a:p[0],b:p[1]};
  for(let i=0;i<p.length;i++){
    const a=p[i],b=p[(i+1)%p.length],len=Math.hypot(b.x-a.x,b.z-a.z);
    if(len>best.len)best={len,a,b};
  }
  return best;
}
function ringCenter(ring){
  return ring.reduce((a,p)=>({x:a.x+p.x/ring.length,z:a.z+p.z/ring.length}),{x:0,z:0});
}
function radialOutset(ring,distance){
  const c=ringCenter(ring);
  return ring.map(p=>{
    const dx=p.x-c.x,dz=p.z-c.z,l=Math.hypot(dx,dz)||1;
    return {x:p.x+dx/l*distance,z:p.z+dz/l*distance};
  });
}

function buildUnifiedHouse(building,anchor){
  const P=elasticParams(building,anchor),base=roundFootprint(building.footprint,P.radius,5);
  const wallSteps=12,roofSteps=6,pos=[],idx=[],rows=[],rings=[],ys=[];

  for(let s=0;s<=wallSteps;s++){
    const t=s/wallSteps;
    const ring=base.map(p=>deformElasticXZ(p,t,P));
    const ringY=base.map(p=>deformElasticY(p,t,P));
    const row=[];
    for(let i=0;i<ring.length;i++){
      row.push(pos.length/3);
      pos.push(ring[i].x,ringY[i],ring[i].z);
    }
    rings.push(ring);ys.push(ringY);rows.push(row);
  }
  for(let s=0;s<wallSteps;s++){
    for(let i=0;i<base.length;i++){
      const j=(i+1)%base.length,A=rows[s][i],B=rows[s][j],C=rows[s+1][i],D=rows[s+1][j];
      idx.push(A,C,B,B,C,D);
    }
  }
  addCap(idx,rows[0],rings[0],false);

  // Integration seam: reuse the exact V2 wall top row as the inner eave boundary.
  // The next row expands outward, but the wall top vertices are shared by wall and eave faces.
  const wallTopRow=rows.at(-1),wallTop=rings.at(-1),wallTopY=ys.at(-1);
  const overhang=clamp(Math.min(P.extent.w,P.extent.d)*.045,.34,.58);
  const eave=radialOutset(wallTop,overhang);
  const eaveLift=.055;
  const eaveRow=[];
  for(let i=0;i<eave.length;i++){
    eaveRow.push(pos.length/3);
    pos.push(eave[i].x,wallTopY[i]+eaveLift,eave[i].z);
  }
  for(let i=0;i<eave.length;i++){
    const j=(i+1)%eave.length;
    idx.push(wallTopRow[i],eaveRow[i],wallTopRow[j],wallTopRow[j],eaveRow[i],eaveRow[j]);
  }

  const edge=longestEdge(building.footprint),ux=(edge.b.x-edge.a.x)/edge.len,uz=(edge.b.z-edge.a.z)/edge.len,vx=-uz,vz=ux;
  const c=ringCenter(eave),roofHeight=Math.max(.7,Number(building.roof?.heightM)||1.4),kind=building.roof?.type||'gabled-hint';
  let prevRow=eaveRow,prevRing=eave;
  const roofRows=[eaveRow],roofRings=[eave];

  for(let s=1;s<=roofSteps;s++){
    const t=s/roofSteps;let su=1,sv=1;
    if(kind.includes('gabled')){su=1-.12*t;sv=1-.92*t;}
    else if(kind.includes('hipped')){su=1-.72*t;sv=1-.72*t;}
    else {su=1-.10*t;sv=1-.10*t;}
    const ring=eave.map(p=>{
      const dx=p.x-c.x,dz=p.z-c.z,du=dx*ux+dz*uz,dv=dx*vx+dz*vz;
      return {x:c.x+ux*du*su+vx*dv*sv,z:c.z+uz*du*su+vz*dv*sv};
    });
    const row=[];
    for(let i=0;i<ring.length;i++){
      row.push(pos.length/3);
      pos.push(ring[i].x,wallTopY[i]+eaveLift+roofHeight*t,ring[i].z);
    }
    for(let i=0;i<ring.length;i++){
      const j=(i+1)%ring.length,A=prevRow[i],B=prevRow[j],C=row[i],D=row[j];
      idx.push(A,C,B,B,C,D);
    }
    roofRows.push(row);roofRings.push(ring);prevRow=row;prevRing=ring;
  }
  addCap(idx,roofRows.at(-1),roofRings.at(-1),true);

  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  geometry.setIndex(idx);
  geometry.computeVertexNormals();

  return {
    geometry,
    sharedEaveVertexCount:wallTopRow.length,
    meshCount:1,
    overhang,
    wallTopVertexIndices:[...wallTopRow],
    eaveVertexIndices:[...eaveRow]
  };
}

function addWire(group,mesh,color=0x312b26){
  const line=new THREE.LineSegments(
    new THREE.WireframeGeometry(mesh.geometry),
    new THREE.LineBasicMaterial({color,transparent:true,opacity:.22})
  );
  group.add(line);return line;
}

export function mountHouseProof(canvas,building,ui={}){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.0;
  renderer.shadowMap.enabled=false;

  const scene=new THREE.Scene();
  scene.background=new THREE.Color('#d2d4c6');
  scene.add(new THREE.HemisphereLight(0xfff6e9,0x6f756b,2.8));
  const key=new THREE.DirectionalLight(0xffeedb,2.2);key.position.set(-35,55,42);key.castShadow=false;scene.add(key);

  const anchor=centroid(building.footprint);
  const sourceShell=buildElasticShell(building,anchor);
  const sourceRoof=buildElasticRoof(building,sourceShell);
  const candidate=buildUnifiedHouse(building,anchor);

  const neutralSource=new THREE.MeshStandardMaterial({color:'#b8a58e',roughness:.98,metalness:0,side:THREE.DoubleSide});
  const neutralCandidate=new THREE.MeshStandardMaterial({color:'#bcae96',roughness:.98,metalness:0,side:THREE.DoubleSide});

  const sourceGroup=new THREE.Group(),candidateGroup=new THREE.Group();
  const sourceBodyMesh=new THREE.Mesh(sourceShell.geometry,neutralSource);
  const sourceRoofMesh=new THREE.Mesh(sourceRoof,neutralSource);
  sourceGroup.add(sourceBodyMesh,sourceRoofMesh);
  const candidateMesh=new THREE.Mesh(candidate.geometry,neutralCandidate);
  candidateGroup.add(candidateMesh);

  const sourceBox=new THREE.Box3().setFromObject(sourceGroup),candBox=new THREE.Box3().setFromObject(candidateGroup);
  const sourceC=sourceBox.getCenter(new THREE.Vector3()),candC=candBox.getCenter(new THREE.Vector3());
  sourceGroup.position.set(-28-sourceC.x,-sourceBox.min.y,-sourceC.z);
  candidateGroup.position.set(28-candC.x,-candBox.min.y,-candC.z);
  scene.add(sourceGroup,candidateGroup);

  const sourceWire=addWire(sourceGroup,sourceBodyMesh),sourceRoofWire=addWire(sourceGroup,sourceRoofMesh),candidateWire=addWire(candidateGroup,candidateMesh);
  let wireOn=false;sourceWire.visible=sourceRoofWire.visible=candidateWire.visible=wireOn;
  if(ui.wireButton)ui.wireButton.onclick=()=>{wireOn=!wireOn;sourceWire.visible=sourceRoofWire.visible=candidateWire.visible=wireOn;ui.wireButton.classList.toggle('active',wireOn);};

  const camera=new THREE.PerspectiveCamera(38,1,.1,300);
  camera.position.set(0,27,92);camera.lookAt(0,8,0);

  if(ui.metrics)ui.metrics.textContent=
    `SOURCE donor: 2 meshes · CANDIDATE: 1 mesh · shared wall/eave vertices ${candidate.sharedEaveVertexCount} · overhang ${candidate.overhang.toFixed(2)} m · shadows OFF`;

  function resize(){
    const r=canvas.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);
    camera.aspect=Math.max(.1,r.width/Math.max(1,r.height));camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);resize();
  (function loop(){requestAnimationFrame(loop);renderer.render(scene,camera);})();

  return {
    report:()=>({
      schema:'kfb.huerth-proof.house/0.1',
      sourceDonorHead:'0c59e92d9d8688f5a88cd309ae8891dcd174c2fc',
      sourceDonorBlob:'75c3d794b9341a7074038594b467f91d153486c6',
      sourceMeshCount:2,
      candidateMeshCount:candidate.meshCount,
      sharedEaveVertexCount:candidate.sharedEaveVertexCount,
      overhangM:+candidate.overhang.toFixed(3),
      neutralMaterial:true,
      shadows:false,
      webgl2:renderer.capabilities.isWebGL2
    })
  };
}
