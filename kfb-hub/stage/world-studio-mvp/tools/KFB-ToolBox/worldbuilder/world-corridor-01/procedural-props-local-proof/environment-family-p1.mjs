import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

/*
 * KFB Environment Family P1 · geometry only
 *
 * No material owner. No renderer. No placement owner.
 * Source-derived geometry helpers for the approved procedural-environment lane.
 */

export const SOURCE_PROVENANCE = Object.freeze({
  p0b: Object.freeze({
    repo: 'georg-doc/kayfabizarro',
    path: 'tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-props-p0/procedural-props-p0b.mjs',
    head: '94443824e6b13f38c611defd06dacedd7c6d0faa',
    blob: '0174e27c2ada67753f5e29161e4973087cf04d8e',
    role: 'human-positive soft procedural tree + rounded pebble grammar'
  }),
  k1Rock: Object.freeze({
    repo: 'georg-doc/kayfabizarro',
    path: 'tools/KFB-ToolBox/_inbox/KFB Knet-Katalog K1 + Hirnwelt Claymation Reference/KFB_K1_H0_CODEBASE_2026-09-29/lab-clay/clay-catalog.v5.js',
    blob: '1cb40e45dc4d2ca20a554e4315b68f9331af4152',
    role: 'Golden organic clay boulder'
  }),
  t3: Object.freeze({
    repo: 'georg-doc/kayfabizarro',
    path: 'tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 - TUNE/KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/lab-track/track-look.v3.js',
    blob: 'a4be0b0fb8a8c5e7b8589495c71015d30de7a5f2',
    role: 'accepted-base nature cluster / blob rock / bush grammar'
  })
});

export const FAMILY_ROLES = Object.freeze({
  P0B_TREE: 'positive-control tree',
  P0B_PEBBLE: 'small pebble cluster',
  K1_BOULDER: 'medium organic boulder',
  T3_ACCENT_ROCK: 'large accent rock',
  T3_BUSH: 'low 2–3 lobe bush'
});

function rng(seed){
  let a=seed>>>0;
  return()=>{a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};
}

function merge(parts){
  const indexed=parts.every(p=>p.index);
  const list=indexed?parts:parts.map(p=>p.index?p.toNonIndexed():p);
  const g=mergeGeometries(list,false);
  for(const p of new Set([...parts,...list])) if(p!==g) p.dispose();
  g.computeVertexNormals();
  return g;
}

function lathe(pts,segments=12){
  return new THREE.LatheGeometry(pts.map(([r,y])=>new THREE.Vector2(r,y)),segments);
}

function p0bTrunkGeometry(height=.9,base=.12,top=.075,roots=4,segments=12){
  const g=lathe([
    [base*1.5,0],
    [base*1.08,height*.07],
    [base*.86,height*.22],
    [(base*.86+top)/2,height*.6],
    [top,height]
  ],segments);
  const p=g.getAttribute('position');
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),z=p.getZ(i),flare=Math.max(0,1-p.getY(i)/(height*.3));
    const lobe=1+.28*flare*Math.max(0,Math.cos(roots*Math.atan2(x,z)))**2;
    p.setXYZ(i,x*lobe,p.getY(i),z*lobe);
  }
  g.computeVertexNormals();
  return g;
}

function sphereBlob(x,y,z,r,squash=1,ws=18,hs=12){
  const g=new THREE.SphereGeometry(r,ws,hs);
  g.scale(1,squash,1);
  g.translate(x,y,z);
  return g;
}

export function buildP0BTreeGeometry(){
  const trunk=p0bTrunkGeometry(1.18,.14,.085,5,14);
  return merge([
    trunk,
    sphereBlob(0,1.46,0,.58,.92,20,13),
    sphereBlob(-.34,1.24,-.12,.38,1,18,12),
    sphereBlob(.18,1.82,.1,.36,1,18,12),
    sphereBlob(.34,1.32,.08,.32,.96,16,11)
  ]);
}

export function buildP0BPebbleGeometry(){
  const a=new THREE.SphereGeometry(.43,16,10);
  a.scale(1,.58,.82);
  a.translate(-.07,.25,0);

  const b=new THREE.SphereGeometry(.24,14,9);
  b.scale(1,.72,.88);
  b.translate(.37,.14,.16);

  return merge([a,b]);
}

export function buildK1BoulderGeometry(){
  const g=new THREE.IcosahedronGeometry(.6,5);
  const p=g.getAttribute('position');
  const v=new THREE.Vector3();
  for(let i=0;i<p.count;i++){
    v.fromBufferAttribute(p,i).normalize();
    const k=
      1+
      .16*Math.sin(v.x*3.1+1)*Math.cos(v.z*2.7)+
      .07*Math.sin(v.y*6.3+v.x*4.1);
    v.multiplyScalar(.6*k);
    v.y*=.68;
    p.setXYZ(i,v.x,v.y+.3,v.z);
  }
  g.computeVertexNormals();
  return g;
}

/* Exact T3 blob construction: Icosahedron -> remove normal/uv -> mergeVertices -> radial lump field. */
function buildT3Blob(r,detail=3,lumpK=.12,seed=1){
  let g=new THREE.IcosahedronGeometry(r,detail+2);
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g=mergeVertices(g);

  const p=g.getAttribute('position');
  const v=new THREE.Vector3();
  for(let i=0;i<p.count;i++){
    v.fromBufferAttribute(p,i);
    const n=v.clone().normalize();
    const f=
      1+lumpK*
      (
        Math.sin(n.x*3.1+seed)*
        Math.sin(n.y*2.7+seed*1.7)*
        Math.sin(n.z*3.3+seed*.3)
      );
    v.copy(n.multiplyScalar(r*f));
    p.setXYZ(i,v.x,v.y,v.z);
  }
  g.computeVertexNormals();
  return g;
}

export function buildT3AccentRockGeometry(seed=1701,scale=1){
  const R=rng(seed);
  const r=(2.2+R()*2.0)*scale;
  const g=buildT3Blob(r,3,.25,seed);
  g.scale(1,.62,1.1);
  g.rotateY(R()*3);
  g.translate(0,r*.2,0);
  g.computeVertexNormals();
  return g;
}

export function buildT3BushGeometry(seed=1801,scale=1){
  const R=rng(seed);
  const n=2+Math.floor(R()*2);
  const parts=[];

  for(let k=0;k<n;k++){
    const r=(2.0+R()*1.4)*scale;
    const g=buildT3Blob(r,3,.12,seed+k);
    g.scale(1,.78,1);
    g.translate(
      (R()-.5)*r*1.6,
      r*.35,
      (R()-.5)*r*1.6
    );
    parts.push(g);
  }

  return merge(parts);
}

export function geometryFacts(geometry){
  geometry.computeBoundingBox();
  const size=new THREE.Vector3();
  geometry.boundingBox.getSize(size);
  return {
    vertices: geometry.getAttribute('position')?.count || 0,
    triangles: geometry.index ? geometry.index.count/3 : (geometry.getAttribute('position')?.count || 0)/3,
    bounds:[size.x,size.y,size.z]
  };
}
