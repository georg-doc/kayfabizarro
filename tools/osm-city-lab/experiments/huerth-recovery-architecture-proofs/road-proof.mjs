import * as THREE from 'three';
import {
  inflatePathsD, unionD, differenceD, intersectD,
  FillRule, JoinType, EndType,
  triangulateD, TriangulateResult, areaPathsD
} from 'clipper2-ts';

const ROAD_HALF=4.5;
const CURB=1.15;
const PATH_HALF=1.15;

const roadCenterlines=[
  [{x:-44,y:0},{x:44,y:0}],
  [{x:0,y:0},{x:0,y:32}]
];
const pathCenterlines=[
  [{x:22,y:-26},{x:22,y:0}]
];

const absArea=paths=>Math.abs(areaPathsD(paths||[]));
const key=p=>p.x.toFixed(5)+','+p.y.toFixed(5);

function triangulateRegion(paths,materialIndex,state){
  if(!paths?.length)return;
  const tri=triangulateD(paths,3,true);
  if(tri.result!==TriangulateResult.success)throw new Error('Clipper2 triangulation failed for material '+materialIndex+' · '+tri.result);
  const start=state.indices.length;
  for(const t of tri.solution){
    if(t.length<3)continue;
    for(const p of t.slice(0,3)){
      const k=key(p);
      let idx=state.vertexMap.get(k);
      if(idx==null){
        idx=state.positions.length/3;
        state.vertexMap.set(k,idx);
        state.positions.push(p.x,0,p.y);
      }
      state.indices.push(idx);
    }
  }
  state.groups.push({start,count:state.indices.length-start,materialIndex});
}

function buildTopology(){
  const roadBuffered=inflatePathsD(roadCenterlines,ROAD_HALF,JoinType.Round,EndType.Round,2,3,.12);
  const roadRegion=unionD(roadBuffered,FillRule.NonZero);
  const outerBuffered=inflatePathsD(roadCenterlines,ROAD_HALF+CURB,JoinType.Round,EndType.Round,2,3,.12);
  const outerRegion=unionD(outerBuffered,FillRule.NonZero);
  const curbRegion=differenceD(outerRegion,roadRegion,FillRule.NonZero,3);

  const pathBuffered=inflatePathsD(pathCenterlines,PATH_HALF,JoinType.Round,EndType.Round,2,3,.10);
  const pathUnion=unionD(pathBuffered,FillRule.NonZero);
  // The path is physically cut at the outer street boundary; it never overlaps road/curb.
  const pathRegion=differenceD(pathUnion,outerRegion,FillRule.NonZero,3);

  const overlapRoadCurb=absArea(intersectD(roadRegion,curbRegion,FillRule.NonZero,3));
  const overlapPathStreet=absArea(intersectD(pathRegion,outerRegion,FillRule.NonZero,3));
  const partitionError=Math.abs((absArea(roadRegion)+absArea(curbRegion))-absArea(outerRegion));

  const state={positions:[],indices:[],groups:[],vertexMap:new Map()};
  // One shared vertex/index buffer, three material groups, no overlay surface meshes.
  triangulateRegion(curbRegion,0,state);
  triangulateRegion(roadRegion,1,state);
  triangulateRegion(pathRegion,2,state);

  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(state.positions,3));
  geometry.setIndex(state.indices);
  for(const g of state.groups)geometry.addGroup(g.start,g.count,g.materialIndex);
  geometry.computeVertexNormals();

  return {
    geometry,
    regions:{roadRegion,curbRegion,pathRegion,outerRegion},
    metrics:{
      surfaceMeshCount:1,
      materialGroups:state.groups.length,
      uniqueVertices:state.positions.length/3,
      triangles:state.indices.length/3,
      roadPolygons:roadRegion.length,
      curbPolygons:curbRegion.length,
      pathPolygons:pathRegion.length,
      partitionError,
      overlapRoadCurb,
      overlapPathStreet
    }
  };
}

export function mountRoadProof(canvas,ui={}){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.0;

  const scene=new THREE.Scene();
  scene.background=new THREE.Color('#d7d6c1');
  const camera=new THREE.OrthographicCamera(-58,58,40,-40,.1,200);
  camera.position.set(0,78,0.01);
  camera.lookAt(0,0,0);

  scene.add(new THREE.HemisphereLight(0xffffff,0x666666,2.4));
  const plane=new THREE.Mesh(
    new THREE.PlaneGeometry(130,90),
    new THREE.MeshStandardMaterial({color:'#aebf79',roughness:1,metalness:0})
  );
  plane.rotation.x=-Math.PI/2;
  plane.position.y=-.03;
  scene.add(plane);

  const topology=buildTopology();
  const mats=[
    new THREE.MeshStandardMaterial({color:'#e8d18b',roughness:.98,metalness:0,side:THREE.DoubleSide}),
    new THREE.MeshStandardMaterial({color:'#9f8292',roughness:.98,metalness:0,side:THREE.DoubleSide}),
    new THREE.MeshStandardMaterial({color:'#d8bd83',roughness:.98,metalness:0,side:THREE.DoubleSide})
  ];
  const surface=new THREE.Mesh(topology.geometry,mats);
  surface.position.y=.015;
  scene.add(surface);

  const wire=new THREE.LineSegments(
    new THREE.WireframeGeometry(topology.geometry),
    new THREE.LineBasicMaterial({color:0x2e2a25,transparent:true,opacity:.32})
  );
  wire.position.y=.035;
  scene.add(wire);

  const lineMatRoad=new THREE.LineBasicMaterial({color:0x2a2521,transparent:true,opacity:.35});
  const lineMatPath=new THREE.LineBasicMaterial({color:0x6b4e31,transparent:true,opacity:.55});
  const centerlineGroup=new THREE.Group();
  const addLine=(line,mat)=>{
    const pts=line.map(p=>new THREE.Vector3(p.x,.045,p.y));
    centerlineGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),mat));
  };
  roadCenterlines.forEach(l=>addLine(l,lineMatRoad));
  pathCenterlines.forEach(l=>addLine(l,lineMatPath));
  scene.add(centerlineGroup);

  let showWire=true,showCenter=false;
  centerlineGroup.visible=showCenter;
  if(ui.wireButton)ui.wireButton.onclick=()=>{showWire=!showWire;wire.visible=showWire;ui.wireButton.classList.toggle('active',showWire);};
  if(ui.centerButton)ui.centerButton.onclick=()=>{showCenter=!showCenter;centerlineGroup.visible=showCenter;ui.centerButton.classList.toggle('active',showCenter);};

  if(ui.metrics){
    const m=topology.metrics;
    ui.metrics.textContent=
      `1 mesh · ${m.materialGroups} material groups · ${m.uniqueVertices} shared vertices · ${m.triangles} triangles · overlap area ${(m.overlapRoadCurb+m.overlapPathStreet).toExponential(1)}`;
  }

  function resize(){
    const r=canvas.getBoundingClientRect();
    renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);
    const aspect=Math.max(.1,r.width/Math.max(1,r.height));
    const h=42;camera.left=-h*aspect;camera.right=h*aspect;camera.top=h;camera.bottom=-h;camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);resize();
  (function loop(){requestAnimationFrame(loop);renderer.render(scene,camera);})();

  return {
    report:()=>({
      schema:'kfb.huerth-proof.road/0.1',
      engine:'clipper2-ts@2.0.1-18-evaluation',
      topologyOwner:'ONE_BUFFER_GEOMETRY',
      surfaceMeshCount:topology.metrics.surfaceMeshCount,
      materialGroups:topology.metrics.materialGroups,
      partitionError:topology.metrics.partitionError,
      overlapRoadCurb:topology.metrics.overlapRoadCurb,
      overlapPathStreet:topology.metrics.overlapPathStreet,
      patchDiscs:0,
      overlaySurfaceMeshes:0,
      webgl2:renderer.capabilities.isWebGL2
    })
  };
}
