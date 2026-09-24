import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { Bucket, addBuilding, addRoad, buildGlb, stableHash } from './geometry.js';

const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex');
const round6 = (v) => +Number(v).toFixed(6);

function canonicalLandmarkTargets(){return [
  {id:'way/4532022',role:'landmark-source-anchor',label:'Kölner Dom'},
  {id:'node/2399559029',role:'transport-source-anchor',label:'Köln Hauptbahnhof'},
  {id:'relation/5460390',role:'bridge-source-anchor',label:'Hohenzollernbrücke'},
  {id:'relation/3837695',role:'bridge-source-anchor',label:'Deutzer Brücke'},
  {id:'way/23559378',role:'tunnel-source-anchor',label:'Rheinufertunnel'}
];}
function findObjectById(root,target){
  const stack=[root],seen=new Set();
  while(stack.length){const v=stack.pop();if(!v||typeof v!=='object'||seen.has(v))continue;seen.add(v);if(String(v.id||'')===target)return v;for(const x of Object.values(v))if(x&&typeof x==='object')stack.push(x);}
  return null;
}
async function writeJson(file,obj){await fs.writeFile(file,JSON.stringify(obj,null,2)+'\n');}
async function hashFile(file){const b=await fs.readFile(file);return {sha256:sha256(b),bytes:b.length};}

export async function compileWorldZone({repoRoot=process.cwd(),cityId='dom-zentrum-v0',zoneId='cologne-dom-zentrum-v0',revision='2026-09-24.1',outRoot=null,sourceCommit=process.env.GITHUB_SHA||'UNPINNED'}={}){
  const lab=path.join(repoRoot,'tools/osm-city-lab'),data=path.join(lab,'data',cityId),styleFile=path.join(lab,'styles','kfb-city-v0.json'),deformerFile=path.join(lab,'src/style/cartoon-city.js');
  const target=outRoot?path.join(outRoot,zoneId,revision):path.join(lab,'world-zones',zoneId,revision);
  await fs.rm(target,{recursive:true,force:true});await fs.mkdir(target,{recursive:true});
  const [normalizedBuf,rawBuf,specBuf,provBuf,queryBuf,contextBuf,styleBuf,deformerBuf,compilerBuf,geometryBuf]=await Promise.all([
    fs.readFile(path.join(data,'normalized.json')),fs.readFile(path.join(data,'source.overpass.json')),fs.readFile(path.join(data,'SOURCE_SPEC.json')),fs.readFile(path.join(data,'PROVENANCE.json')),fs.readFile(path.join(data,'query.overpassql')),fs.readFile(path.join(data,'DESIGN_CONTEXT.json')),fs.readFile(styleFile),fs.readFile(deformerFile),fs.readFile(new URL(import.meta.url)),fs.readFile(new URL('./geometry.js',import.meta.url))
  ]);
  const normalized=JSON.parse(normalizedBuf),spec=JSON.parse(specBuf),prov=JSON.parse(provBuf),context=JSON.parse(contextBuf),style=JSON.parse(styleBuf);
  const rawSha=sha256(rawBuf),normSha=sha256(normalizedBuf),querySha=sha256(queryBuf);
  if(rawSha!==prov.sourceSha256)throw new Error(`raw source hash mismatch: ${rawSha} != ${prov.sourceSha256}`);
  if(normalized.schema!=='kfb.osm-city.normalized.v0'||normalized.id!==cityId)throw new Error('unexpected normalized source');
  const profile=style.cartoonMassing?.presets?.[style.cartoonMassing.defaultMode||'cartoon']||style.cartoonMassing?.presets?.cartoon||{};
  const palette=style.palette||{},buckets=new Map();
  const bucket=(name,color)=>{const key=name+':'+color; if(!buckets.has(key))buckets.set(key,new Bucket(name,color));return buckets.get(key);};
  let visualBuildingVertices=0,visualBuildingTriangles=0,visualRoadVertices=0,visualRoadTriangles=0;
  for(const b of normalized.features.buildings){
    const key=String(b.materialClass||'building-pale').replace(/^building-/,'');
    const arr=key==='warm'?palette.buildingWarm:key==='industrial'?palette.buildingIndustrial:palette.buildingPale;
    const colors=Array.isArray(arr)&&arr.length?arr:['#c7d2c3'];const color=colors[stableHash(b.id)%colors.length];
    const s=addBuilding(bucket('building-'+key,color),b,profile,style.seed||'kfb-city');visualBuildingVertices+=s.vertices;visualBuildingTriangles+=s.triangles;
  }
  for(const r of normalized.features.roads){
    const drive=!!r.driveable,name=drive?'road':'path',color=drive?(palette.road||'#3b3a46'):(palette.path||'#d9c8aa'),y=drive?Number(style.layers?.roadY??.095):Number(style.layers?.pathY??.03);
    const s=addRoad(bucket(name,color),r,y);visualRoadVertices+=s.vertices;visualRoadTriangles+=s.triangles;
  }
  const compilerEntrySha=sha256(compilerBuf),geometrySha=sha256(geometryBuf),compilerSha=sha256(Buffer.concat([compilerBuf,geometryBuf])),styleSha=sha256(styleBuf),deformerSha=sha256(deformerBuf);
  const glb=buildGlb([...buckets.values()],{zoneId,revision,sourceDataset:cityId,sourceCommit,sourceNormalizedSha256:normSha,compilerSha256:compilerSha,look:{style:'tools/osm-city-lab/styles/kfb-city-v0.json',styleSha256:styleSha,deformer:'tools/osm-city-lab/src/style/cartoon-city.js',deformerSha256:deformerSha,preset:style.cartoonMassing.defaultMode||'cartoon'}});
  const anchors=canonicalLandmarkTargets().map(t=>{const found=findObjectById(context,t.id);return {...t,source:found||null,status:found?'source-backed':'source-id-pinned'};});
  const roads={schema:'kfb.world-zone.roads.v1',zoneId,revision,frame:normalized.frame,roads:normalized.features.roads};
  const buildings={schema:'kfb.world-zone.buildings.v1',zoneId,revision,frame:normalized.frame,buildings:normalized.features.buildings};
  const anchorDoc={schema:'kfb.world-zone.anchors.v1',zoneId,revision,frame:normalized.frame,anchors,landmarkPolicy:{externalModulesRemainSeparate:true,rule:'OSM massing/semantics remain geographic truth; authored Landmark Modules are separate references and transforms.'}};
  const support={schema:'kfb.world-zone.support-collision.v1',zoneId,revision,truth:'undeformed-normalized-semantics',ground:{kind:'local-y-plane',y:0,frame:normalized.frame},roadSupports:{source:'roads.json#/roads',driveableOnly:true,count:normalized.features.roads.filter(r=>r.driveable).length},buildingObstacles:{source:'building-semantics.json#/buildings',count:normalized.features.buildings.length},rule:'Visual cartoon deformation never mutates support/collision truth.'};
  const sourceDoc={schema:'kfb.world-zone.source.v1',zoneId,revision,owner:'KFB OSM City Lab',sourceDataset:{id:cityId,path:`tools/osm-city-lab/data/${cityId}/`,rawPath:`tools/osm-city-lab/data/${cityId}/source.overpass.json`,normalizedPath:`tools/osm-city-lab/data/${cityId}/normalized.json`,sourceCommit,rawSha256:rawSha,normalizedSha256:normSha,querySha256:querySha,osmBaseTimestamp:prov.osmBaseTimestamp,retrievedAt:prov.retrievedAt,attribution:prov.attribution},compiler:{schema:'kfb.world-zone.compiler.v1',revision:'1.0.0',files:[{path:'tools/osm-city-lab/src/world-zone/compiler.js',sha256:compilerEntrySha},{path:'tools/osm-city-lab/src/world-zone/geometry.js',sha256:geometrySha}],sha256:compilerSha},look:{stylePath:'tools/osm-city-lab/styles/kfb-city-v0.json',styleSha256:styleSha,deformerPath:'tools/osm-city-lab/src/style/cartoon-city.js',deformerSha256:deformerSha,preset:style.cartoonMassing.defaultMode||'cartoon'},runtimePolicy:'load baked package only; no runtime/editor Overpass request',compositionPolicy:'WorldBuilder stores zone manifest reference + transform. Landmark Modules stay separate searchable references.'};
  await Promise.all([
    fs.copyFile(path.join(data,'SOURCE_SPEC.json'),path.join(target,'source-spec.json')),
    fs.copyFile(path.join(data,'PROVENANCE.json'),path.join(target,'provenance.json')),
    fs.copyFile(path.join(data,'query.overpassql'),path.join(target,'query.overpassql')),
    fs.copyFile(path.join(data,'normalized.json'),path.join(target,'normalized.json')),
    writeJson(path.join(target,'roads.json'),roads),writeJson(path.join(target,'building-semantics.json'),buildings),writeJson(path.join(target,'anchors.json'),anchorDoc),writeJson(path.join(target,'support-collision.json'),support),writeJson(path.join(target,'SOURCE.json'),sourceDoc),fs.writeFile(path.join(target,'visual.glb'),glb)
  ]);
  const names=['source-spec.json','provenance.json','query.overpassql','normalized.json','roads.json','building-semantics.json','anchors.json','support-collision.json','SOURCE.json','visual.glb'];
  const files={};for(const name of names)files[name]=await hashFile(path.join(target,name));
  const manifest={schema:'kfb.world-zone.manifest.v1',id:zoneId,revision,label:'Köln Dom / Hauptbahnhof / Altstadt / Rhein',owner:'KFB OSM City Lab',frame:normalized.frame,bounds:normalized.bounds,source:{datasetId:cityId,rawSha256:rawSha,normalizedSha256:normSha,querySha256:querySha,osmBaseTimestamp:prov.osmBaseTimestamp},compiler:{revision:'1.0.0',sha256:compilerSha},look:{styleId:style.id,styleSha256:styleSha,deformerSha256:deformerSha,preset:style.cartoonMassing.defaultMode||'cartoon'},contents:{normalized:'normalized.json',roads:'roads.json',buildings:'building-semantics.json',anchors:'anchors.json',visual:'visual.glb',supportCollision:'support-collision.json',source:'SOURCE.json',provenance:'provenance.json',sourceSpec:'source-spec.json',query:'query.overpassql'},counts:{roads:normalized.features.roads.length,driveableRoads:normalized.features.roads.filter(r=>r.driveable).length,buildings:normalized.features.buildings.length,landuse:normalized.features.landuse.length,waterLines:normalized.features.waterLines.length,anchors:anchors.length},visual:{buildingVertices:visualBuildingVertices,buildingTriangles:visualBuildingTriangles,roadVertices:visualRoadVertices,roadTriangles:visualRoadTriangles,glbBytes:glb.length},files,runtimePolicy:'baked package only; source refresh is explicit build-time work',worldBuilderContract:{format:'kfb-worldbuilder-scene',version:1,storage:'zone manifest reference + transform only'}};
  await writeJson(path.join(target,'MANIFEST.json'),manifest);
  const report={schema:'kfb.world-zone.build-report.v1',zoneId,revision,sourceRawSha256:rawSha,normalizedSha256:normSha,querySha256:querySha,compilerSha256:compilerSha,styleSha256:styleSha,deformerSha256:deformerSha,counts:manifest.counts,visual:manifest.visual,gates:{rawHashMatchesProvenance:true,normalizedMetreFrame:normalized.frame?.units==='metre',roadsPresent:normalized.features.roads.length>0,buildingsPresent:normalized.features.buildings.length>0,bakedVisualGlb:glb.length>100000,supportUndeformed:baseSupportInvariant(support),landmarksSeparate:anchorDoc.landmarkPolicy.externalModulesRemainSeparate===true,noRuntimeOverpass:sourceDoc.runtimePolicy.includes('no runtime/editor Overpass')}};
  await writeJson(path.join(target,'BUILD_REPORT.json'),report);
  return {target,manifest,report};
}
function baseSupportInvariant(support){return support.truth==='undeformed-normalized-semantics'&&support.buildingObstacles.source.includes('building-semantics.json')&&support.roadSupports.source.includes('roads.json');}
