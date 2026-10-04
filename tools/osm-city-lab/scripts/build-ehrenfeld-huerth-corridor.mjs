import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { normalizeOverpass } from '../src/osm/normalize.js';
import { makeLocalENU, EARTH_RADIUS_M } from '../src/osm/projection.js';
import { buildConsumerScene } from '../src/export/scene-recipe.js';

const ID='ehrenfeld-huerth-corridor-v0';
const DATA=new URL('../data/ehrenfeld-huerth-corridor-v0/',import.meta.url);
const raw=JSON.parse(await fs.readFile(new URL('source.overpass.json',DATA),'utf8'));
const detailSpec=JSON.parse(await fs.readFile(new URL('SOURCE_SPEC.json',DATA),'utf8'));
const provenance=JSON.parse(await fs.readFile(new URL('PROVENANCE.json',DATA),'utf8'));
const queryPlan=JSON.parse(await fs.readFile(new URL('QUERY_PLAN.json',DATA),'utf8'));
const route=JSON.parse(await fs.readFile(new URL('../'+detailSpec.routeEvidence,import.meta.url),'utf8'));

if(route.id!=='ehrenfeld-huerth-v0'||!Array.isArray(route.route?.nodes)||route.route.nodes.length<2)throw new Error('route evidence incompatible');
if(provenance.status!=='CURRENT_NARROW_SOURCE_CANDIDATE')throw new Error('current narrow source candidate required');
if(provenance.routeEvidenceSha256!==queryPlan.routeEvidenceSha256)throw new Error('route evidence pin mismatch');

const routeNodes=route.route.nodes;
let routeLength=0;
const segLen=(a,b)=>Math.hypot((b.lon-a.lon)*111320*Math.cos(((a.lat+b.lat)/2)*Math.PI/180),(b.lat-a.lat)*111320);
const cumulative=[0];
for(let i=1;i<routeNodes.length;i++){routeLength+=segLen(routeNodes[i-1],routeNodes[i]);cumulative.push(routeLength);}
const half=routeLength/2;
let midIndex=0;
while(midIndex<cumulative.length-1&&cumulative[midIndex]<half)midIndex++;
const origin={lat:routeNodes[midIndex].lat,lon:routeNodes[midIndex].lon,altM:0};
const projection=makeLocalENU(origin,EARTH_RADIUS_M);

const boxes=queryPlan.chunks.map(c=>c.bbox);
const bbox={
  south:Math.min(...boxes.map(b=>b.south)),
  west:Math.min(...boxes.map(b=>b.west)),
  north:Math.max(...boxes.map(b=>b.north)),
  east:Math.max(...boxes.map(b=>b.east))
};
const sw=projection.project(bbox.south,bbox.west),ne=projection.project(bbox.north,bbox.east);
const sourceSpec={
  schema:'kfb.osm-city.source-spec.v0',
  id:ID,
  label:'Ehrenfeld ↔ Hürth · current narrow OSM corridor',
  bbox,
  approxSizeM:{northSouth:Math.abs(ne.z-sw.z)+1,eastWest:Math.abs(ne.x-sw.x)+1},
  origin,
  projection:{kind:'local-enu-equirectangular',axes:{x:'east',y:'up',z:'north'},units:'metre',earthRadiusM:EARTH_RADIUS_M},
  overpass:{queryFile:'QUERY_PLAN.json',policy:detailSpec.runtimePolicy},
  license:detailSpec.license
};

const normalized=normalizeOverpass(raw,sourceSpec,provenance);
normalized.source.query='data/ehrenfeld-huerth-corridor-v0/QUERY_PLAN.json';

const routeLocal=routeNodes.map((n,i)=>{
  const p=projection.project(n.lat,n.lon,0);
  return {x:+p.x.toFixed(3),z:+p.z.toFixed(3),lat:n.lat,lon:n.lon,nodeId:n.id??null,routeIndex:i};
});
const routeSegments=[];
for(let i=1;i<routeLocal.length;i++){
  const a=routeLocal[i-1],b=routeLocal[i];
  routeSegments.push({a,b,minX:Math.min(a.x,b.x),maxX:Math.max(a.x,b.x),minZ:Math.min(a.z,b.z),maxZ:Math.max(a.z,b.z)});
}
const band=Number(detailSpec.halfWidthM)||220;
const EPS=.001;

function pointSegDistance(p,a,b){
  const dx=b.x-a.x,dz=b.z-a.z,l2=dx*dx+dz*dz;
  if(l2<1e-12)return Math.hypot(p.x-a.x,p.z-a.z);
  const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/l2));
  return Math.hypot(p.x-(a.x+dx*t),p.z-(a.z+dz*t));
}
function orient(a,b,c){return (b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);}
function onSegment(a,b,p){
  return Math.abs(orient(a,b,p))<1e-8&&p.x>=Math.min(a.x,b.x)-EPS&&p.x<=Math.max(a.x,b.x)+EPS&&p.z>=Math.min(a.z,b.z)-EPS&&p.z<=Math.max(a.z,b.z)+EPS;
}
function segmentsIntersect(a,b,c,d){
  const o1=orient(a,b,c),o2=orient(a,b,d),o3=orient(c,d,a),o4=orient(c,d,b);
  if(((o1>0&&o2<0)||(o1<0&&o2>0))&&((o3>0&&o4<0)||(o3<0&&o4>0)))return true;
  return onSegment(a,b,c)||onSegment(a,b,d)||onSegment(c,d,a)||onSegment(c,d,b);
}
function segmentDistance(a,b,c,d){
  if(segmentsIntersect(a,b,c,d))return 0;
  return Math.min(pointSegDistance(a,c,d),pointSegDistance(b,c,d),pointSegDistance(c,a,b),pointSegDistance(d,a,b));
}
function segmentNearRoute(a,b){
  const minX=Math.min(a.x,b.x)-band,maxX=Math.max(a.x,b.x)+band,minZ=Math.min(a.z,b.z)-band,maxZ=Math.max(a.z,b.z)+band;
  for(const r of routeSegments){
    if(r.maxX<minX||r.minX>maxX||r.maxZ<minZ||r.minZ>maxZ)continue;
    if(segmentDistance(a,b,r.a,r.b)<=band+EPS)return true;
  }
  return false;
}
function pointInPoly(p,poly){
  let inside=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[i],b=poly[j];
    const hit=((a.z>p.z)!==(b.z>p.z))&&(p.x<(b.x-a.x)*(p.z-a.z)/((b.z-a.z)||1e-12)+a.x);
    if(hit)inside=!inside;
  }
  return inside;
}
function polyNearRoute(poly){
  if(!Array.isArray(poly)||poly.length<3)return false;
  for(let i=1;i<poly.length;i++)if(segmentNearRoute(poly[i-1],poly[i]))return true;
  const xs=poly.map(p=>p.x),zs=poly.map(p=>p.z);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs);
  for(const r of routeSegments){
    if(r.maxX<minX||r.minX>maxX||r.maxZ<minZ||r.minZ>maxZ)continue;
    if(pointInPoly(r.a,poly)||pointInPoly(r.b,poly))return true;
  }
  return false;
}
function splitRoad(r){
  const pts=r.centerline||[],ids=r.nodeIds||[];
  const parts=[];let p=null,pids=null;
  for(let i=1;i<pts.length;i++){
    const keep=segmentNearRoute(pts[i-1],pts[i]);
    if(keep){
      if(!p){p=[pts[i-1],pts[i]];pids=[ids[i-1]??null,ids[i]??null];}
      else{p.push(pts[i]);pids.push(ids[i]??null);}
    }else if(p){parts.push({points:p,nodeIds:pids});p=null;pids=null;}
  }
  if(p)parts.push({points:p,nodeIds:pids});
  return parts.map((part,i)=>({
    ...r,
    id:parts.length===1?r.id:`${r.id}:corridor-${i}`,
    centerline:part.points,
    nodeIds:part.nodeIds,
    corridorSourceId:r.id
  }));
}
function splitLineFeature(l){
  const pts=l.line||[];const out=[];let p=null;
  for(let i=1;i<pts.length;i++){
    const keep=segmentNearRoute(pts[i-1],pts[i]);
    if(keep){if(!p)p=[pts[i-1],pts[i]];else p.push(pts[i]);}
    else if(p){out.push(p);p=null;}
  }
  if(p)out.push(p);
  return out.map((line,i)=>({...l,id:out.length===1?l.id:`${l.id}:corridor-${i}`,line,corridorSourceId:l.id}));
}

const before={
  roads:normalized.features.roads.length,
  buildings:normalized.features.buildings.length,
  landuse:normalized.features.landuse.length,
  waterLines:normalized.features.waterLines.length
};
normalized.features.roads=normalized.features.roads.flatMap(splitRoad);
normalized.features.buildings=normalized.features.buildings.filter(b=>polyNearRoute(b.footprint));
normalized.features.landuse=normalized.features.landuse.filter(l=>polyNearRoute(l.polygon));
normalized.features.waterLines=normalized.features.waterLines.flatMap(splitLineFeature);

const all=[];
for(const r of normalized.features.roads)all.push(...r.centerline);
for(const b of normalized.features.buildings)all.push(...b.footprint);
for(const l of normalized.features.landuse)all.push(...l.polygon);
for(const w of normalized.features.waterLines)all.push(...w.line);
const xs=all.map(p=>p.x),zs=all.map(p=>p.z);
normalized.bounds=all.length?{
  min:{x:+Math.min(...xs).toFixed(3),z:+Math.min(...zs).toFixed(3)},
  max:{x:+Math.max(...xs).toFixed(3),z:+Math.max(...zs).toFixed(3)}
}:{min:{x:0,z:0},max:{x:0,z:0}};
normalized.bounds.sizeM={x:+(normalized.bounds.max.x-normalized.bounds.min.x).toFixed(3),z:+(normalized.bounds.max.z-normalized.bounds.min.z).toFixed(3)};
normalized.frame.corridorBand={halfWidthM:band,selectionPolicy:'feature/segment intersects route band; polygon geometry remains source-exact once selected'};
normalized.corridor={
  schema:'kfb.osm-city.corridor-band.v0',
  routeEvidence:detailSpec.routeEvidence,
  routeSourceRevision:detailSpec.routeSourceRevision,
  routePhysicalLengthM:route.route.physicalLengthM,
  halfWidthM:band,
  routeLocal:routeLocal.map(({x,z,nodeId,routeIndex})=>({x,z,nodeId,routeIndex})),
  endpointJoinPolicy:'first/last route node; receiver validates visual/contact seam to existing city scenes'
};
normalized.diagnostics.corridor={
  before,
  after:{
    roads:normalized.features.roads.length,
    buildings:normalized.features.buildings.length,
    landuse:normalized.features.landuse.length,
    waterLines:normalized.features.waterLines.length
  }
};

const scene=buildConsumerScene(normalized);
scene.corridor={
  schema:normalized.corridor.schema,
  halfWidthM:band,
  routePhysicalLengthM:route.route.physicalLengthM,
  route:normalized.corridor.routeLocal,
  selectionPolicy:normalized.frame.corridorBand.selectionPolicy,
  joins:[
    {id:'ehrenfeld-corridor-join',cityId:'ehrenfeld-v0',local:{x:routeLocal[0].x,y:0,z:routeLocal[0].z},routeIndex:0},
    {id:'huerth-corridor-join',cityId:'huerth-v0',local:{x:routeLocal.at(-1).x,y:0,z:routeLocal.at(-1).z},routeIndex:routeLocal.length-1}
  ]
};
scene.landmarkPlacementSocket={
  status:'CANDIDATE_NON_OWNING_SOCKET',
  placementModes:['osmIdentityOverride','authoredSurrealPlacement'],
  instances:[],
  rules:[
    'OSM identity overrides require explicit OSM identity + metre calibration before hiding base massing',
    'authored surreal placements use explicit World Recipe anchors and never invent OSM identity',
    'presentation deformation never changes receiver collision geometry silently'
  ]
};
scene.anchors.push(...scene.corridor.joins.map(j=>({id:j.id,kind:'corridor-city-join',local:j.local,status:'candidate',cityId:j.cityId,safety:['receiver road/contact seam aligned','no teleport required']})));

const normText=JSON.stringify(normalized);
const sceneText=JSON.stringify(scene,null,2);
const deterministicA=JSON.stringify(normalized);
const deterministicSceneA=JSON.stringify(scene);

await fs.writeFile(new URL('normalized.json',DATA),normText+'\n');
await fs.mkdir(new URL('../scenes/',import.meta.url),{recursive:true});
await fs.writeFile(new URL('../scenes/ehrenfeld-huerth-corridor-v0.json',import.meta.url),sceneText+'\n');

function finiteObject(v){
  if(typeof v==='number')return Number.isFinite(v);
  if(Array.isArray(v))return v.every(finiteObject);
  if(v&&typeof v==='object')return Object.values(v).every(finiteObject);
  return true;
}
function allRoadSegmentsNearBand(){
  for(const r of normalized.features.roads){
    for(let i=1;i<r.centerline.length;i++)if(!segmentNearRoute(r.centerline[i-1],r.centerline[i]))return false;
  }
  return true;
}
const sourceRefs=new Set(raw.elements.filter(e=>e?.type&&e.id!=null).map(e=>`${e.type}/${e.id}`));
const preserved=[
  ...normalized.features.roads,
  ...normalized.features.buildings,
  ...normalized.features.landuse,
  ...normalized.features.waterLines
].every(f=>{
  const o=f.osm;
  return o&&sourceRefs.has(`${o.type}/${o.id}`);
});
const routeLengthDelta=Math.abs(Number(scene.corridor.routePhysicalLengthM)-Number(route.route.physicalLengthM));
const report={
  schema:'kfb.osm-city.corridor-consumer-report.v0',
  id:ID,
  generatedAt:new Date().toISOString(),
  sourceSha256:provenance.sourceSha256,
  normalizedSha256:crypto.createHash('sha256').update(normText).digest('hex'),
  sceneSha256:crypto.createHash('sha256').update(sceneText).digest('hex'),
  sourceElements:raw.elements.length,
  routeNodes:routeLocal.length,
  routePhysicalLengthM:route.route.physicalLengthM,
  halfWidthM:band,
  featureCounts:normalized.diagnostics.corridor,
  bounds:normalized.bounds,
  gates:{
    sourceFresh:provenance.status==='CURRENT_NARROW_SOURCE_CANDIDATE'&&provenance.oldestAgeHours<=detailSpec.maxOsmAgeHours&&provenance.baseSkewHours<=detailSpec.maxChunkBaseSkewHours,
    sourceShaMatches:crypto.createHash('sha256').update(JSON.stringify(raw)).digest('hex')===provenance.sourceSha256,
    metreFrame:normalized.frame.units==='metre',
    routePreserved:routeLocal.length===route.route.nodes.length&&routeLengthDelta<0.01,
    routeBandPresent:normalized.frame.corridorBand.halfWidthM===band,
    roadsRemain:normalized.features.roads.length>0,
    buildingsRemain:normalized.features.buildings.length>0,
    roadSegmentsInsideSelection:allRoadSegmentsNearBand(),
    osmIdsPreserved:preserved,
    finiteValues:finiteObject(normalized)&&finiteObject(scene),
    endpointJoins:scene.corridor.joins.length===2,
    landmarkSocket:scene.landmarkPlacementSocket.placementModes.includes('osmIdentityOverride')&&scene.landmarkPlacementSocket.placementModes.includes('authoredSurrealPlacement'),
    movementOwnerUnchanged:scene.ownerContract.cityLab.includes('geodata')&&scene.ownerContract.movementRule.includes('one active movement writer')
  }
};
if(!Object.values(report.gates).every(Boolean))throw new Error('corridor consumer gates failed: '+JSON.stringify(report.gates));
const deterministicB=JSON.stringify(normalized);
const deterministicSceneB=JSON.stringify(scene);
report.gates.deterministic=deterministicA===deterministicB&&deterministicSceneA===deterministicSceneB;
if(!report.gates.deterministic)throw new Error('corridor output not deterministic');

await fs.mkdir(new URL('../evidence/',import.meta.url),{recursive:true});
await fs.writeFile(new URL('../evidence/ehrenfeld-huerth-corridor-v0-consumer.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
