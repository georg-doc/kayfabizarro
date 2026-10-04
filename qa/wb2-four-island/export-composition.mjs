import fs from 'node:fs';import * as THREE from 'three';import {arch,corridors} from './geometry-check.mjs';
import {signatureRecipe,createLifeTree,PALETTES} from '../../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/signature-life-tree.v1.mjs';
import {buildIslandBody} from '../../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/r2d-presentation.v1.js';
import {buildClayStrand} from '../../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/joyride-strand.v1.js';
import {prepareJoyride} from '../../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/joyride-world-context.v1.js';
import {protectedAnchors} from '../../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/world-clearance.v1.mjs';
import {makeClayUniforms} from '../../tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-clay/clay-material.v10.js';
const nativeFetch=globalThis.fetch;globalThis.fetch=async url=>String(url).startsWith('file:')?{ok:true,json:async()=>JSON.parse(fs.readFileSync(new URL(url)))}:nativeFetch(url);
const ctx=await prepareJoyride(arch),buildings=JSON.parse(fs.readFileSync('evidence/building-clearance.json')),out=[];
const U=makeClayUniforms(THREE,new THREE.DataTexture(new Uint8Array([128,128,128,255]),1,1));
const add=(worldId,o)=>{if(!o.isMesh)return;const p=o.geometry.attributes.position,c=o.geometry.attributes.color;out.push({worldId,name:o.name,positions:Array.from(p.array),indices:Array.from(o.geometry.index?.array||[]),colors:c?Array.from(c.array):null,color:'#'+o.material.color.getHexString()})};
for(const n of arch.nodes){const recipe=signatureRecipe(n,ctx.corridors),tree=createLifeTree(THREE,recipe,n.plan,n.field,{corridors:ctx.corridors,anchors:protectedAnchors(n.anchors),buildings:buildings.find(b=>b.worldId===n.id).placed});tree.root.traverse(o=>add(n.id,o));
 const body=buildIslandBody(n.plan,n.field,PALETTES[n.recipe.biome],recipe);for(const [name,geo] of [['earth top',body.top],['earth mantle',body.under]]){const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:PALETTES[n.recipe.biome].rock,vertexColors:true}));m.name=name;add(n.id,m)}
 const road=buildClayStrand(THREE,n.plan.stream,{U,palette:PALETTES[n.recipe.biome],...ctx.contexts.get(n.id)});road.traverse(o=>add(n.id,o));
}
fs.writeFileSync('evidence/composition.mesh.json',JSON.stringify(out));fs.writeFileSync('evidence/composition.frames.json',JSON.stringify(arch.nodes.map(n=>({worldId:n.id,centre:[n.plan.c0[0],n.recipe.position[1]+8,n.plan.c0[1]],span:110}))));
console.log('Four offline composition meshes exported; excludes K2 shader, gameplay, Residents and browser evidence.');
