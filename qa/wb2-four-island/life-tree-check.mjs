import fs from 'node:fs';import assert from 'node:assert/strict';import * as THREE from 'three';
import {arch,corridors} from './geometry-check.mjs';
import {signatureRecipe,createLifeTree} from '../../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/signature-life-tree.v1.mjs';
import {protectedAnchors} from '../../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/world-clearance.v1.mjs';
const records=[],meshes=[];
for(const n of arch.nodes){const r=signatureRecipe(n,corridors);assert.deepEqual(r,signatureRecipe(n,corridors));const tree=createLifeTree(THREE,r,n.plan,n.field,{corridors,anchors:protectedAnchors(n.anchors)});
 tree.root.traverse(o=>{if(o.isMesh){o.updateWorldMatrix(true,false);const p=o.geometry.attributes.position;for(const v of p.array)assert(Number.isFinite(v));meshes.push({worldId:n.id,name:o.name,positions:Array.from(p.array),indices:Array.from(o.geometry.index?.array||[]),color:'#'+o.material.color.getHexString()})}});records.push({...r,rootObstacleCount:tree.obstacles.length});}
fs.writeFileSync('evidence/signature-life-trees.json',JSON.stringify(records,null,2));fs.writeFileSync('evidence/tree-isolates.mesh.json',JSON.stringify(meshes));console.log(records.map(r=>({id:r.id,position:r.position,roots:r.rootObstacleCount})));
