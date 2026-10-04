import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/*
 * KFB Environment Family P2 · geometry only
 *
 * Source-derived soft procedural transfer after exact authored donor isolation.
 * No material owner. No renderer. No placement owner. No frame loop.
 */

export const P2_SOURCE = Object.freeze({
  sourcePin: 'a5fefb273b274e40b3a1e642788c87113fa6ea27',
  sourceIsolationRun: 36960716414,
  sourceIsolationArtifact: 11207717976,
  sourceIsolationDigest: 'sha256:9a430ac22b91bdcc66b04b8dcfe10089de66088b617734bb65b457dfa4c8dd17',
  donors: Object.freeze({
    logs: ['log','log_large','log_stack'],
    stumps: ['stump_old','stump_round','stump_roundDetailed'],
    stumpNegative: 'stump_oldTall',
    mushrooms: ['mushroom_red','mushroom_redTall','mushroom_redGroup','mushroom_tanGroup'],
    grass: ['Grass_1_A_Color1','Grass_2_A_Color1']
  })
});

export const P2_ROLES = Object.freeze({
  SOFT_LOG_SEPARATOR: 'log / long low separator',
  SOFT_LOG_STACK3: 'log_stack / authored three-log pile',
  SOFT_STUMP_ROUND: 'stump_round / short flared cut trunk',
  SOFT_STUMP_DETAILED: 'stump_roundDetailed + stump_old / compact stump with asymmetric nubs',
  SOFT_MUSHROOM_NORMAL: 'mushroom_red / normal single',
  SOFT_MUSHROOM_GROUP3: 'mushroom_redGroup / one leader + two companions',
  SOFT_GRASS_TUFT: 'KayKit Grass_1 + Grass_2 roles / P0B soft bent-blade construction'
});

function merge(parts){
  const indexed=parts.every(p=>p.index);
  const list=indexed?parts:parts.map(p=>p.index?p.toNonIndexed():p);
  const g=mergeGeometries(list,false);
  for(const p of new Set([...parts,...list])) if(p!==g) p.dispose();
  g.computeVertexNormals();
  return g;
}

function lathe(points,segments=24){
  return new THREE.LatheGeometry(
    points.map(([r,y])=>new THREE.Vector2(r,y)),
    segments
  );
}

function softLogCore({
  length=.71,
  radiusX=.117,
  radiusY=.0865,
  taper=.04,
  bend=.018,
  radialSegments=20,
  heightSegments=8
}={}){
  const g=new THREE.CylinderGeometry(1-taper,1,length,radialSegments,heightSegments,false);
  const p=g.getAttribute('position');

  // Axis is Y here. Preserve cut ends, but soften the side silhouette with a very small axial bow.
  for(let i=0;i<p.count;i++){
    const y=p.getY(i);
    const t=THREE.MathUtils.clamp(y/length+.5,0,1);
    const bulge=Math.sin(Math.PI*t);
    p.setX(i,p.getX(i)*(1+.035*bulge)+bend*bulge);
    p.setZ(i,p.getZ(i)*(1+.018*bulge));
  }

  g.rotateX(Math.PI/2);
  g.scale(radiusX,radiusY,1);
  g.computeVertexNormals();
  return g;
}

function branchNub({x=.07,y=.035,z=.13,length=.16,r=.022,az=.7,tilt=.9}={}){
  const g=new THREE.CylinderGeometry(r*.72,r,length,12,3,false);
  g.rotateZ(tilt);
  g.rotateY(az);
  g.translate(x,y,z);
  g.computeVertexNormals();
  return g;
}

export function buildSoftLogSeparatorGeometry(){
  const core=softLogCore();
  const nub=branchNub({x:.07,y:.035,z:.11,length:.14,r:.02,az:.4,tilt:1.02});
  return merge([core,nub]);
}

export function buildSoftLogStack3Geometry(){
  const parts=[];
  const add=(x,y,scale,roll=0)=>{
    const g=softLogCore({length:.71*scale,radiusX:.117*scale,radiusY:.0865*scale,taper:.035,bend:.012});
    g.rotateZ(roll);
    g.translate(x,y,0);
    parts.push(g);
  };

  // Exact role transfer from the authored log_stack screenshot: two lower logs, one upper leader.
  add(-.12,.09,.96,.025);
  add(.12,.09,.94,-.022);
  add(0,.235,.9,.012);

  return merge(parts);
}

function stumpBody({height=.206,base=.185,rim=.155,recess=.025}={}){
  // Profile deliberately returns inward/downward at the top to form the observed recessed cut face.
  const pts=[
    [0,0],
    [base*.83,0],
    [base,.022],
    [base*.94,height*.28],
    [base*.82,height*.62],
    [rim,height*.9],
    [rim*.92,height],
    [rim*.58,height*.99],
    [rim*.20,height-recess*.3],
    [0,height-recess]
  ];
  const g=lathe(pts,28);
  g.computeVertexNormals();
  return g;
}

function stumpNub({angle=0,y=.09,length=.105,r=.028,tilt=.72}={}){
  const g=new THREE.CylinderGeometry(r*.72,r,length,12,3,false);
  g.rotateZ(Math.PI/2-tilt);
  g.rotateY(angle);
  const reach=.135;
  g.translate(Math.cos(angle)*reach,y,Math.sin(angle)*reach);
  g.computeVertexNormals();
  return g;
}

export function buildSoftStumpRoundGeometry(){
  return stumpBody({height:.206,base:.185,rim:.155,recess:.026});
}

export function buildSoftStumpDetailedGeometry(){
  return merge([
    stumpBody({height:.206,base:.195,rim:.158,recess:.027}),
    stumpNub({angle:.2,y:.075,length:.105,r:.027,tilt:.68}),
    stumpNub({angle:2.35,y:.105,length:.09,r:.024,tilt:.8}),
    stumpNub({angle:4.15,y:.07,length:.075,r:.022,tilt:.6})
  ]);
}

function mushroomStem({height=.145,base=.028,top=.021}={}){
  const g=lathe([
    [0,0],
    [base*.82,0],
    [base,height*.12],
    [base*.86,height*.55],
    [top,height],
    [0,height]
  ],20);
  g.computeVertexNormals();
  return g;
}

function mushroomCap({y=.145,r=.092,h=.06}={}){
  // Rounded version of the observed broad low cap / small crown.
  const g=lathe([
    [0,0],
    [r*.42,0],
    [r*.88,h*.15],
    [r,h*.34],
    [r*.86,h*.64],
    [r*.5,h*.88],
    [r*.18,h],
    [0,h]
  ],28);
  g.translate(0,y,0);
  g.computeVertexNormals();
  return g;
}

function mushroomSingle({height=.145,capR=.092,capH=.06}={}){
  return merge([
    mushroomStem({height,base:capR*.31,top:capR*.22}),
    mushroomCap({y:height*.94,r:capR,h:capH})
  ]);
}

export function buildSoftMushroomNormalGeometry(){
  return mushroomSingle({height:.145,capR:.092,capH:.06});
}

export function buildSoftMushroomGroup3Geometry(){
  const parts=[];

  const add=(x,z,scale,yaw=0)=>{
    const g=mushroomSingle({
      height:.145*scale,
      capR:.092*scale,
      capH:.06*scale
    });
    g.rotateY(yaw);
    g.translate(x,0,z);
    parts.push(g);
  };

  // Source morphology: one taller rear leader, two smaller foreground companions.
  add(0,.055,1.18,.2);
  add(-.085,-.045,.78,-.35);
  add(.082,-.055,.68,.55);

  return merge(parts);
}

function softBlade({
  height=.56,
  width=.038,
  lean=.22,
  radial=.35,
  offset=.025,
  segments=5,
  narrow=false
}={}){
  const bottomR=width*(narrow?.44:.58);
  const topR=width*(narrow?.08:.12);
  const g=new THREE.CylinderGeometry(topR,bottomR,height,8,segments,true);
  g.scale(narrow?.42:.65,1,.52);
  g.translate(0,height/2,0);

  const p=g.getAttribute('position');
  for(let i=0;i<p.count;i++){
    const t=THREE.MathUtils.clamp(p.getY(i)/height,0,1);
    p.setX(i,p.getX(i)+lean*height*t*t);
  }

  g.rotateY(-radial);
  g.translate(Math.cos(radial)*offset,0,Math.sin(radial)*offset);
  g.computeVertexNormals();
  return g;
}

export function buildSoftGrassTuftGeometry(){
  // KayKit donor roles:
  // broad Grass_1 silhouette + tall/narrow Grass_2 spear,
  // arranged with the existing Travel 3–5 cluster lesson.
  return merge([
    softBlade({height:.78,width:.026,lean:.20,radial:.15,offset:.018,narrow:true}),
    softBlade({height:.56,width:.044,lean:.30,radial:1.45,offset:.05,narrow:false}),
    softBlade({height:.49,width:.04,lean:.18,radial:2.7,offset:.045,narrow:false}),
    softBlade({height:.68,width:.021,lean:.34,radial:4.15,offset:.035,narrow:true}),
    softBlade({height:.43,width:.036,lean:.24,radial:5.25,offset:.05,narrow:false})
  ]);
}

export function p2GeometrySet(){
  return [
    ['SOFT_LOG_SEPARATOR',buildSoftLogSeparatorGeometry()],
    ['SOFT_LOG_STACK3',buildSoftLogStack3Geometry()],
    ['SOFT_STUMP_ROUND',buildSoftStumpRoundGeometry()],
    ['SOFT_STUMP_DETAILED',buildSoftStumpDetailedGeometry()],
    ['SOFT_MUSHROOM_NORMAL',buildSoftMushroomNormalGeometry()],
    ['SOFT_MUSHROOM_GROUP3',buildSoftMushroomGroup3Geometry()],
    ['SOFT_GRASS_TUFT',buildSoftGrassTuftGeometry()]
  ];
}

export function geometryFacts(geometry){
  geometry.computeBoundingBox();
  const size=new THREE.Vector3();
  geometry.boundingBox.getSize(size);
  return {
    vertices:geometry.getAttribute('position')?.count||0,
    triangles:geometry.index?geometry.index.count/3:(geometry.getAttribute('position')?.count||0)/3,
    bounds:[size.x,size.y,size.z]
  };
}
