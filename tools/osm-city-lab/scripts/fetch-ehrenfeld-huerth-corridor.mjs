import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const DATA=new URL('../data/corridors/ehrenfeld-huerth-v0/',import.meta.url);
const spec=JSON.parse(await fs.readFile(new URL('SOURCE_SPEC.json',DATA),'utf8'));
const query=await fs.readFile(new URL('query.overpassql',DATA),'utf8');
const endpoints=['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter'];

let raw=null,used=null,lastError=null;
for(const endpoint of endpoints){
  try{
    const res=await fetch(endpoint,{
      method:'POST',
      headers:{
        'content-type':'application/x-www-form-urlencoded;charset=UTF-8',
        'accept':'application/json',
        'user-agent':'KFB-OSM-City-Lab/0.3 corridor discovery'
      },
      body:new URLSearchParams({data:query}),
      signal:AbortSignal.timeout(60000)
    });
    if(!res.ok)throw new Error(`${endpoint} HTTP ${res.status}`);
    raw=JSON.parse(await res.text());
    if(!Array.isArray(raw.elements)||raw.elements.length<100)throw new Error('too few Overpass elements');
    used=endpoint;
    break;
  }catch(error){lastError=error;}
}
if(!raw)throw new Error(`Corridor Overpass failed: ${lastError?.message||lastError}`);

const compact=JSON.stringify(raw);
const sha256=crypto.createHash('sha256').update(compact).digest('hex');
await fs.writeFile(new URL('source.overpass.json',DATA),compact+'\n');
await fs.writeFile(new URL('PROVENANCE.json',DATA),JSON.stringify({
  schema:'kfb.osm-city.corridor-provenance.v0',
  id:spec.id,
  endpoint:used,
  retrievedAt:new Date().toISOString(),
  osmBaseTimestamp:raw.osm3s?.timestamp_osm_base||null,
  sourceSha256:sha256,
  elementCount:raw.elements.length,
  queryFile:'query.overpassql',
  attribution:spec.license
},null,2)+'\n');
console.log(JSON.stringify({ok:true,elements:raw.elements.length,endpoint:used,sha256},null,2));
