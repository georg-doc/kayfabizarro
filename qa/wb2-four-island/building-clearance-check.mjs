import fs from 'node:fs';import assert from 'node:assert/strict';import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {arch,corridors} from './geometry-check.mjs';
import {hull,findPlacement,checkFootprint,protectedAnchors} from '../../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/world-clearance.v1.mjs';
import {signatureRecipe,createLifeTree} from '../../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/signature-life-tree.v1.mjs';
const manifest=JSON.parse(fs.readFileSync('tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/VISIBLE_SOURCE_MANIFEST.json'));
const report=[];
globalThis.ProgressEvent=class ProgressEvent{constructor(type,props){Object.assign(this,{type},props)}};
for(const n of arch.nodes){const anchors=protectedAnchors(n.anchors),tree=createLifeTree(THREE,signatureRecipe(n,corridors),n.plan,n.field,{corridors,anchors}),placed=[];
 const centre=n.plan.plazas.find(p=>p.kind==='big'),pads=['world.utopia','world.protopia'].includes(n.id)?n.plan.pads.slice(1):n.plan.pads;
 for(const [i,record] of manifest.families[n.id].entries()){
  const p='evidence/source/buildings/'+n.id+'-'+i+'.gltf',j=JSON.parse(fs.readFileSync(p));
  for(const b of j.buffers||[])if(b.uri&&!b.uri.startsWith('data:'))b.uri='data:application/octet-stream;base64,'+fs.readFileSync('evidence/source/buildings/'+b.uri).toString('base64');
  // Geometry-only source inspection: textures omitted here, never in production.
  j.images=[];j.textures=[];j.materials=[];for(const mesh of j.meshes)for(const prim of mesh.primitives)delete prim.material;
  const g=await new GLTFLoader().parseAsync(JSON.stringify(j),''),model=g.scene,box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),pad=pads[i];
  const radius=Math.hypot(size.x,size.z)/2,scale=Math.min(4,pad?pad.r*.75/Math.max(radius,.01):4/Math.max(radius,.01));model.scale.setScalar(scale);model.updateMatrixWorld(true);
  const points=[];model.traverse(o=>{if(o.isMesh){const a=o.geometry.attributes.position,v=new THREE.Vector3();for(let k=0;k<a.count;k++){v.fromBufferAttribute(a,k).applyMatrix4(o.matrixWorld);points.push([v.x,v.z])}}});
  const local=hull(points),preferred=pad?[pad.x,pad.z]:[centre.x+(i%3-1)*9,centre.z+(Math.floor(i/3)+1)*10],rotation=Math.atan2(centre.x-preferred[0],centre.z-preferred[1]);
  const constraints={corridors,anchors,roots:tree.obstacles.slice(0,1),buildings:placed,setback:1};
  try{const fit=findPlacement({localFootprint:local,preferred,centre:[centre.x,centre.z],plan:n.plan,field:n.field,constraints,rotation});assert.equal(checkFootprint(fit.footprint,constraints).length,0);placed.push({...fit,id:n.id+'/building/'+i,assetId:record.assetId,scale,nativeSize:size.toArray(),localFootprint:local});}
  catch(e){report.push({worldId:n.id,status:'BLOCKED',assetId:record.assetId,error:e.message,placed});fs.writeFileSync('evidence/building-clearance.json',JSON.stringify(report,null,2));throw e}
 }
 report.push({worldId:n.id,status:'GEOMETRY_CLEARANCE_PASS_NOT_BROWSER_PASS',placed,intersections:{track:0,bridgehead:0,anchor:0,trunk:0,building:0,surfaceRoots:'PENDING_INTEGRATED_MESH_CHECK'}});
}
fs.writeFileSync('evidence/building-clearance.json',JSON.stringify(report,null,2));console.log(report.map(r=>({world:r.worldId,count:r.placed.length,status:r.status})));
