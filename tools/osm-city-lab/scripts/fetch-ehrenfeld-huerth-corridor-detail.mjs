import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import os from 'node:os';
import path from 'node:path';

const DATA=new URL('../data/ehrenfeld-huerth-corridor-v0/',import.meta.url);
const spec=JSON.parse(await fs.readFile(new URL('SOURCE_SPEC.json',DATA),'utf8'));
const routeUrl=new URL('../'+spec.routeEvidence,import.meta.url);
const routeText=await fs.readFile(routeUrl,'utf8');
const route=JSON.parse(routeText);
if(route.id!=='ehrenfeld-huerth-v0'||!Array.isArray(route.route?.nodes)||route.route.nodes.length<2){
  throw new Error('route evidence missing or incompatible');
}

const CACHE_DIR=process.env.KFB_CORRIDOR_DETAIL_CACHE
  || path.join(process.env.RUNNER_TEMP||os.tmpdir(),'kfb-osm-city-corridor-detail-v1');
const endpoint=spec.canonicalEndpoint;
const sha256Text=text=>crypto.createHash('sha256').update(text).digest('hex');
const routeEvidenceSha256=sha256Text(routeText.trim());
const rad=d=>d*Math.PI/180;
function distanceM(a,b){
  const R=6371008.8;
  const dLat=rad(b.lat-a.lat),dLon=rad(b.lon-a.lon);
  const s=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.min(1,Math.sqrt(s)));
}
function expandedBbox(points,halfWidthM){
  const lats=points.map(p=>p.lat),lons=points.map(p=>p.lon);
  const midLat=(Math.min(...lats)+Math.max(...lats))/2;
  const latPad=halfWidthM/111320;
  const lonPad=halfWidthM/(111320*Math.max(0.2,Math.cos(rad(midLat))));
  return {
    south:Math.min(...lats)-latPad,
    west:Math.min(...lons)-lonPad,
    north:Math.max(...lats)+latPad,
    east:Math.max(...lons)+lonPad
  };
}
function buildChunks(nodes,targetM,halfWidthM){
  const out=[];
  let start=0,acc=0;
  for(let i=1;i<nodes.length;i++){
    acc+=distanceM(nodes[i-1],nodes[i]);
    const atEnd=i===nodes.length-1;
    if(acc<targetM&&!atEnd)continue;
    const pts=nodes.slice(start,i+1);
    const id='D'+String(out.length+1).padStart(2,'0');
    out.push({id,startNodeIndex:start,endNodeIndex:i,routeLengthM:+acc.toFixed(1),bbox:expandedBbox(pts,halfWidthM)});
    start=i;
    acc=0;
  }
  return out;
}
const chunks=buildChunks(route.route.nodes,spec.targetChunkRouteLengthM,spec.halfWidthM);
const bboxText=b=>`${b.south},${b.west},${b.north},${b.east}`;
const q=c=>`[out:json][timeout:40];\n(\n  way["highway"](${bboxText(c.bbox)});\n  way["building"](${bboxText(c.bbox)});\n  relation["building"](${bboxText(c.bbox)});\n  way["landuse"](${bboxText(c.bbox)});\n  relation["landuse"](${bboxText(c.bbox)});\n  way["leisure"](${bboxText(c.bbox)});\n  relation["leisure"](${bboxText(c.bbox)});\n  way["natural"](${bboxText(c.bbox)});\n  relation["natural"](${bboxText(c.bbox)});\n  way["water"](${bboxText(c.bbox)});\n  relation["water"](${bboxText(c.bbox)});\n  way["waterway"](${bboxText(c.bbox)});\n  relation["waterway"="riverbank"](${bboxText(c.bbox)});\n);\nout body;\n>;\nout skel qt;\n`;
const chunkFile=id=>path.join(CACHE_DIR,`${id}.json`);

async function readCachedChunk(chunk,query){
  try{
    const raw=JSON.parse(await fs.readFile(chunkFile(chunk.id),'utf8'));
    if(raw?.schema!=='kfb.osm-city.corridor-detail-chunk.v0')return null;
    if(raw.id!==chunk.id||raw.querySha256!==sha256Text(query))return null;
    if(JSON.stringify(raw.bbox)!==JSON.stringify(chunk.bbox))return null;
    if(!Array.isArray(raw.elements)||raw.elements.length<10)return null;
    return {...raw,query,elementCount:raw.elements.length,cache:'hit'};
  }catch{return null;}
}
async function writeCachedChunk(result){
  await fs.mkdir(CACHE_DIR,{recursive:true});
  await fs.writeFile(chunkFile(result.id),JSON.stringify({
    schema:'kfb.osm-city.corridor-detail-chunk.v0',
    id:result.id,bbox:result.bbox,endpoint:result.endpoint,
    querySha256:sha256Text(result.query),timestamp:result.timestamp,
    generator:result.generator,elements:result.elements
  })+'\n');
}
async function fetchChunk(chunk){
  const query=q(chunk);
  const res=await fetch(endpoint,{
    method:'POST',
    headers:{
      'content-type':'application/x-www-form-urlencoded;charset=UTF-8',
      accept:'application/json',
      'user-agent':'KFB-OSM-City-Lab/0.34 current corridor detail'
    },
    body:new URLSearchParams({data:query}),
    signal:AbortSignal.timeout(spec.timeoutMs)
  });
  if(!res.ok)throw new Error(`${endpoint} HTTP ${res.status}`);
  const raw=JSON.parse(await res.text());
  if(!Array.isArray(raw.elements)||raw.elements.length<10)throw new Error('too few elements');
  return {id:chunk.id,bbox:chunk.bbox,endpoint,query,timestamp:raw.osm3s?.timestamp_osm_base||null,generator:raw.generator||null,elements:raw.elements,elementCount:raw.elements.length,cache:'miss'};
}
function addElement(map,e){if(e?.type&&e.id!=null)map.set(`${e.type}/${e.id}`,e);}

await fs.mkdir(CACHE_DIR,{recursive:true});
await fs.writeFile(new URL('QUERY_PLAN.json',DATA),JSON.stringify({
  schema:'kfb.osm-city.corridor-detail-query-plan.v0',
  id:spec.id,routeEvidence:spec.routeEvidence,routeEvidenceSha256,
  halfWidthM:spec.halfWidthM,targetChunkRouteLengthM:spec.targetChunkRouteLengthM,
  canonicalEndpoint:endpoint,chunks:chunks.map(c=>({...c,query:q(c)}))
},null,2)+'\n');

const results=[],failures=[];
let cacheHits=0,fetched=0;
for(const chunk of chunks){
  const query=q(chunk);
  const cached=await readCachedChunk(chunk,query);
  if(cached){results.push(cached);cacheHits++;console.log(`chunk ${chunk.id}: cache hit · ${cached.elementCount} elements`);continue;}
  try{
    const result=await fetchChunk(chunk);
    await writeCachedChunk(result);
    results.push(result);fetched++;
    console.log(`chunk ${chunk.id}: fetched + cached · ${result.elementCount} elements · OSM ${result.timestamp}`);
  }catch(error){
    failures.push({id:chunk.id,message:error?.message||String(error)});
    console.error(`chunk ${chunk.id}: FAILED this pass · ${error?.message||error}`);
  }
  await new Promise(resolve=>setTimeout(resolve,300));
}
if(failures.length){
  console.error(JSON.stringify({ok:false,cacheDir:CACHE_DIR,cacheHits,fetched,complete:results.length,expected:chunks.length,missing:failures},null,2));
  throw new Error(`corridor detail source incomplete: ${failures.map(f=>f.id).join(', ')}`);
}

const timestamps=results.map(r=>Date.parse(r.timestamp)).filter(Number.isFinite).sort((a,b)=>a-b);
if(timestamps.length!==results.length)throw new Error('one or more chunks lack OSM base timestamp');
const minTs=timestamps[0],maxTs=timestamps[timestamps.length-1];
const skewHours=(maxTs-minTs)/3600000;
const oldestAgeHours=(Date.now()-minTs)/3600000;
if(skewHours>spec.maxChunkBaseSkewHours)throw new Error(`OSM base skew ${skewHours.toFixed(2)}h exceeds ${spec.maxChunkBaseSkewHours}h`);
if(oldestAgeHours>spec.maxOsmAgeHours)throw new Error(`oldest OSM base age ${oldestAgeHours.toFixed(2)}h exceeds ${spec.maxOsmAgeHours}h`);

const map=new Map();
for(const result of results)for(const e of result.elements)addElement(map,e);
const elements=[...map.values()].sort((a,b)=>a.type.localeCompare(b.type)||(a.id-b.id));
const merged={version:.6,generator:'KFB OSM City current narrow corridor detail chunks',osm3s:{timestamp_osm_base:new Date(maxTs).toISOString().replace('.000Z','Z')},elements};
const compact=JSON.stringify(merged);
const sourceSha256=sha256Text(compact);
await fs.writeFile(new URL('source.overpass.json',DATA),compact+'\n');
await fs.writeFile(new URL('PROVENANCE.json',DATA),JSON.stringify({
  schema:'kfb.osm-city.corridor-detail-provenance.v0',
  id:spec.id,status:'CURRENT_NARROW_SOURCE_CANDIDATE',
  routeEvidence:spec.routeEvidence,routeSourceRevision:spec.routeSourceRevision,routeEvidenceSha256,
  halfWidthM:spec.halfWidthM,queryPlan:'QUERY_PLAN.json',canonicalEndpoint:endpoint,
  retrievedAt:new Date().toISOString(),osmBaseOldest:new Date(minTs).toISOString(),osmBaseNewest:new Date(maxTs).toISOString(),
  baseSkewHours:+skewHours.toFixed(3),oldestAgeHours:+oldestAgeHours.toFixed(3),sourceSha256,elementCount:elements.length,
  chunks:results.map(r=>({id:r.id,bbox:r.bbox,endpoint:r.endpoint,elementCount:r.elementCount,timestamp:r.timestamp,querySha256:sha256Text(r.query)})),
  attribution:spec.license,runtimePolicy:spec.runtimePolicy
},null,2)+'\n');
console.log(JSON.stringify({ok:true,id:spec.id,chunks:results.length,cacheHits,fetched,elements:elements.length,sourceSha256,baseSkewHours:+skewHours.toFixed(3),oldestAgeHours:+oldestAgeHours.toFixed(3)},null,2));
