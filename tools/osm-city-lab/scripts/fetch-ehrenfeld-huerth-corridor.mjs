import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const DATA=new URL('../data/corridors/ehrenfeld-huerth-v0/',import.meta.url);
const spec=JSON.parse(await fs.readFile(new URL('SOURCE_SPEC.json',DATA),'utf8'));
const endpoints=['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter'];
const B=spec.discoveryBbox;
const midLon=(B.west+B.east)/2;
const latStep=(B.north-B.south)/4;
const chunks=[];
for(let row=0;row<4;row++){
  const south=B.south+latStep*row;
  const north=row===3?B.north:B.south+latStep*(row+1);
  chunks.push({id:`R${row+1}W`,south,west:B.west,north,east:midLon});
  chunks.push({id:`R${row+1}E`,south,west:midLon,north,east:B.east});
}
const highway='^(trunk|primary|secondary|tertiary|unclassified|residential|living_street|service)$';
const q=c=>`[out:json][timeout:40];\n(\n  way["highway"~"${highway}"](${c.south},${c.west},${c.north},${c.east});\n);\nout body;\n>;\nout skel qt;\n`;

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
          'user-agent':'KFB-OSM-City-Lab/0.31 corridor discovery'
        },
        body:new URLSearchParams({data:query}),
        signal:AbortSignal.timeout(45000)
      });
      if(!res.ok)throw new Error(`${endpoint} HTTP ${res.status}`);
      const raw=JSON.parse(await res.text());
      if(!Array.isArray(raw.elements)||raw.elements.length<20)throw new Error('too few elements');
      return {
        id:chunk.id,
        bbox:chunk,
        endpoint,
        query,
        timestamp:raw.osm3s?.timestamp_osm_base||null,
        generator:raw.generator||null,
        elementCount:raw.elements.length,
        elements:raw.elements
      };
    }catch(error){lastError=error;}
  }
  throw new Error(`chunk ${chunk.id} failed: ${lastError?.message||lastError}`);
}

const results=[];
for(const chunk of chunks){
  const result=await fetchChunk(chunk);
  results.push(result);
  console.log(`chunk ${chunk.id}: ${result.elementCount} elements via ${result.endpoint}`);
}

const map=new Map();
for(const result of results){
  for(const e of result.elements)map.set(`${e.type}/${e.id}`,e);
}
const elements=[...map.values()];
elements.sort((a,b)=>a.type.localeCompare(b.type)||(a.id-b.id));
const merged={
  version:0.6,
  generator:'KFB OSM City corridor chunk merge',
  osm3s:{timestamp_osm_base:results.map(r=>r.timestamp).filter(Boolean).sort().at(-1)||null},
  elements
};
const compact=JSON.stringify(merged);
const sha256=crypto.createHash('sha256').update(compact).digest('hex');

await fs.writeFile(new URL('source.overpass.json',DATA),compact+'\n');
await fs.writeFile(new URL('PROVENANCE.json',DATA),JSON.stringify({
  schema:'kfb.osm-city.corridor-provenance.v0',
  id:spec.id,
  strategy:'4x2 deterministic Overpass chunks merged by type/id',
  retrievedAt:new Date().toISOString(),
  osmBaseTimestamp:merged.osm3s.timestamp_osm_base,
  sourceSha256:sha256,
  elementCount:elements.length,
  chunks:results.map(r=>({
    id:r.id,
    bbox:r.bbox,
    endpoint:r.endpoint,
    elementCount:r.elementCount,
    timestamp:r.timestamp,
    query:r.query
  })),
  attribution:spec.license
},null,2)+'\n');
console.log(JSON.stringify({ok:true,chunks:results.length,elements:elements.length,sha256},null,2));
