import fs from 'node:fs';import * as THREE from 'three';import {arch,corridors} from './geometry-check.mjs';
import {signatureRecipe,createLifeTree} from '../../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/signature-life-tree.v1.mjs';
import {polygonDistance,protectedAnchors} from '../../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/world-clearance.v1.mjs';
const records=JSON.parse(fs.readFileSync('evidence/building-clearance.json')),report=[];
for(const n of arch.nodes){const buildings=records.find(r=>r.worldId===n.id).placed,tree=createLifeTree(THREE,signatureRecipe(n,corridors),n.plan,n.field,{corridors,anchors:protectedAnchors(n.anchors),buildings}),hits=[];
 tree.root.traverse(o=>{if(!o.isMesh||!o.name.includes('root'))return;const p=o.geometry.attributes.position,idx=o.geometry.index.array;for(const b of buildings){
  const bb=[Math.min(...b.footprint.map(p=>p[0])),Math.max(...b.footprint.map(p=>p[0])),Math.min(...b.footprint.map(p=>p[1])),Math.max(...b.footprint.map(p=>p[1]))];
  for(let k=0;k<idx.length;k+=3){const tri=[idx[k],idx[k+1],idx[k+2]],maxY=Math.max(...tri.map(i=>p.getY(i)));if(maxY<b.base-.01)continue;
   const poly=tri.map(i=>[p.getX(i),p.getZ(i)]);if(Math.max(...poly.map(p=>p[0]))<bb[0]||Math.min(...poly.map(p=>p[0]))>bb[1]||Math.max(...poly.map(p=>p[1]))<bb[2]||Math.min(...poly.map(p=>p[1]))>bb[3])continue;
   if(polygonDistance(poly,b.footprint)<.05){hits.push({building:b.id,mesh:o.name,triangle:k/3,maxY,base:b.base});break}
  }
 }});report.push({worldId:n.id,rootBuildingIntersections:hits.length,hits});}
fs.writeFileSync('evidence/root-clearance.json',JSON.stringify(report,null,2));console.log(report);if(report.some(r=>r.hits.length))process.exitCode=1;
