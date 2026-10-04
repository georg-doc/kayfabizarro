import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import os from 'node:os';
import path from 'node:path';

const DATA=new URL('../data/corridors/ehrenfeld-huerth-v0/',import.meta.url);
const spec=JSON.parse(await fs.readFile(new URL('SOURCE_SPEC.json',DATA),'utf8'));
const endpoints=['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter','https://overpass.private.coffee/api/interpreter'];
const B=spec.discoveryBbox;
const midLon=(B.west+B.east)/2;
const latStep=(B.north-B.south)/8;
const chunks=[];
for(let row=0;row<8;row++){
  const south=B.south+latStep*row;
  const north=row===7?B.north:B.south+latStep*(row+1);
  chunks.push({id:`R${row+1}W`,south,west:B.west,north,east:midLon});
  chunks.push({id:`R${row+1}E`,south,west:midLon,north,east:B.east});
}
const highway='^(trunk|primary|secondary|tertiary|unclassified)$';
const q=c=>`[out:json][timeout:35];\n(\n  way["highway"~"${highway}"](${c.south},${c.west},${c.north},${c.east});\n);\nout body;\n>;\nout skel qt;\n`;

const CACHE_DIR=process.env.KFB_CORRIDOR_CACHE
  || path.join(process.env.RUNNER_TEMP||os.tmpdir(),'kfb-osm-city-corridor-v1');

const sha256Text=text=>crypto.createHash('sha256').update(text).digest('hex');
const chunkFile=id=>path.join(CACHE_DIR,`${id}.json`);

async function readCachedChunk(chunk,query){
  try{
    const raw=JSON.parse(await fs.readFile(chunkFile(chunk.id),'utf8'));
    if(raw?.schema!=='kfb.osm-city.corridor-chunk.v1')return null;
    if(raw.id!==chunk.id)return null;
    if(raw.querySha256!==sha256Text(query))return null;
    if(JSON.stringify(raw.bbox)!==JSON.stringify(chunk))return null;
    if(!Array.isArray(raw.elements)||raw.elements.length<10)return null;
    return {
      id:raw.id,
      bbox:raw.bbox,
      endpoint:raw.endpoint,
      query,
      timestamp:raw.timestamp||null,
      generator:raw.generator||null,
      elementCount:raw.elements.length,
      elements:raw.elements,
      cache:'hit'
    };
  }catch{
    return null;
  }
}

async function writeCachedChunk(result){
  await fs.mkdir(CACHE_DIR,{recursive:true});
  const payload={
    schema:'kfb.osm-city.corridor-chunk.v1',
    id:result.id,
    bbox:result.bbox,
    endpoint:result.endpoint,
    querySha256:sha256Text(result.query),
    timestamp:result.timestamp,
    generator:result.generator,
    elements:result.elements
  };
  await fs.writeFile(chunkFile(result.id),JSON.stringify(payload)+'\n');
}

async function fetchChunk(chunk){
  const query=q(chunk);
  let lastError=null;
  for(const endpoint of endpoints){
    try{
      const res=await fetch(endpoint,{
        method:'POST',
        headers:{
          'content-type':'application/x-www-form-urlencoded;charset=UTF-8',
          'accept':'application/json',
          'user-agent':'KFB-OSM-City-Lab/0.33 corridor discovery checkpoint retry'
        },
        body:new URLSearchParams({data:query}),
        signal:AbortSignal.timeout(30000)
      });
      if(!res.ok)throw new Error(`${endpoint} HTTP ${res.status}`);
      const raw=JSON.parse(await res.text());
      if(!Array.isArray(raw.elements)||raw.elements.length<10)throw new Error('too few elements');
      return {
        id:chunk.id,bbox:chunk,endpoint,query,
        timestamp:raw.osm3s?.timestamp_osm_base||null,
        generator:raw.generator||null,
        elementCount:raw.elements.length,
        elements:raw.elements,
        cache:'miss'
      };
    }catch(error){
      lastError=error;
    }
  }
  throw new Error(`chunk ${chunk.id} failed: ${lastError?.message||lastError}`);
}

function addElement(map,e){ if(e?.type&&e.id!=null)map.set(`${e.type}/${e.id}`,e); }

await fs.mkdir(CACHE_DIR,{recursive:true});
const results=[];
const failures=[];
let cacheHits=0,fetched=0;

for(const chunk of chunks){
  const query=q(chunk);
  const cached=await readCachedChunk(chunk,query);
  if(cached){
    results.push(cached);
    cacheHits++;
    console.log(`chunk ${chunk.id}: cache hit · ${cached.elementCount} major-road elements from ${cached.endpoint}`);
    continue;
  }

  try{
    const result=await fetchChunk(chunk);
    await writeCachedChunk(result);
    results.push(result);
    fetched++;
    console.log(`chunk ${chunk.id}: fetched + cached · ${result.elementCount} major-road elements via ${result.endpoint}`);
  }catch(error){
    failures.push({id:chunk.id,message:error?.message||String(error)});
    console.error(`chunk ${chunk.id}: FAILED this pass · ${error?.message||error}`);
  }
  await new Promise(resolve=>setTimeout(resolve,350));
}

if(failures.length){
  console.error(JSON.stringify({
    ok:false,
    cacheDir:CACHE_DIR,
    cacheHits,
    fetched,
    complete:results.length,
    expected:chunks.length,
    missing:failures
  },null,2));
  throw new Error(`corridor source incomplete: ${failures.map(f=>f.id).join(', ')}`);
}

const map=new Map();
for(const result of results)for(const e of result.elements)addElement(map,e);

const localSources=[];
for(const rel of spec.endpointConnectorSources||[]){
  const url=new URL('../'+rel,import.meta.url);
  const text=await fs.readFile(url,'utf8');
  const raw=JSON.parse(text);
  const ways=(raw.elements||[]).filter(e=>e.type==='way'&&e.tags?.highway&&spec.endpointConnectorHighwayClasses.includes(e.tags.highway));
  const nodeIds=new Set(ways.flatMap(w=>w.nodes||[]));
  const nodes=(raw.elements||[]).filter(e=>e.type==='node'&&nodeIds.has(e.id));
  for(const e of ways)addElement(map,e);
  for(const e of nodes)addElement(map,e);
  const sha256=crypto.createHash('sha256').update(text.trim()).digest('hex');
  localSources.push({path:rel,sha256,wayCount:ways.length,nodeCount:nodes.length});
  console.log(`local connector ${rel}: ${ways.length} highway ways / ${nodes.length} nodes`);
}

const elements=[...map.values()];
elements.sort((a,b)=>a.type.localeCompare(b.type)||(a.id-b.id));
const merged={
  version:.6,
  generator:'KFB OSM City corridor major-road chunks + existing city connector caches',
  osm3s:{timestamp_osm_base:results.map(r=>r.timestamp).filter(Boolean).sort().at(-1)||null},
  elements
};
const compact=JSON.stringify(merged);
const sha256=crypto.createHash('sha256').update(compact).digest('hex');

await fs.writeFile(new URL('source.overpass.json',DATA),compact+'\n');
await fs.writeFile(new URL('PROVENANCE.json',DATA),JSON.stringify({
  schema:'kfb.osm-city.corridor-provenance.v0',
  id:spec.id,
  strategy:'8x2 major-road Overpass chunks + existing Ehrenfeld/Hürth S0 highway connectors; merged by type/id; successful chunks checkpointed within the workflow job and reused across bounded retry passes',
  retrievedAt:new Date().toISOString(),
  osmBaseTimestamp:merged.osm3s.timestamp_osm_base,
  sourceSha256:sha256,
  elementCount:elements.length,
  chunks:results.map(r=>({
    id:r.id,bbox:r.bbox,endpoint:r.endpoint,elementCount:r.elementCount,
    timestamp:r.timestamp,query:r.query
  })),
  localConnectorSources:localSources,
  attribution:spec.license
},null,2)+'\n');

console.log(JSON.stringify({
  ok:true,
  chunks:results.length,
  cacheHits,
  fetched,
  localConnectorSources:localSources,
  elements:elements.length,
  sha256
},null,2));
