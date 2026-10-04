import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const DATA = new URL('../data/ehrenfeld-v0/', import.meta.url);
const spec = JSON.parse(await fs.readFile(new URL('SOURCE_SPEC.json', DATA), 'utf8'));
const query = await fs.readFile(new URL('query.overpassql', DATA), 'utf8');
const outFile = new URL('source.overpass.json', DATA);
const provFile = new URL('PROVENANCE.json', DATA);

let lastError = null, used = null, raw = null;
for (const endpoint of spec.overpass.endpoints) {
  try {
    const body = new URLSearchParams({data:query});
    const res = await fetch(endpoint, {
      method:'POST',
      headers:{
        'content-type':'application/x-www-form-urlencoded;charset=UTF-8',
        'accept':'application/json',
        'user-agent':'KFB-OSM-City-Lab/0.1 (https://github.com/georg-doc/kayfabizarro)'
      },
      body,
      signal:AbortSignal.timeout(45000)
    });
    if (!res.ok) throw new Error(`${endpoint} -> HTTP ${res.status}`);
    const text = await res.text();
    raw = JSON.parse(text);
    if (!Array.isArray(raw.elements) || raw.elements.length < 10) throw new Error(`${endpoint} returned no useful elements`);
    used = endpoint; break;
  } catch (err) { lastError = err; }
}
if (!raw) throw new Error(`All Overpass endpoints failed: ${lastError?.message || lastError}`);

const compact = JSON.stringify(raw);
const sha256 = crypto.createHash('sha256').update(compact).digest('hex');
await fs.writeFile(outFile, compact + '\n');

const provenance = {
  schema:'kfb.osm-city.provenance.v0',
  id:spec.id,
  status:'CACHED_SOURCE',
  bbox:spec.bbox,
  origin:spec.origin,
  queryFile:'query.overpassql',
  endpoint:used,
  retrievedAt:new Date().toISOString(),
  osmBaseTimestamp:raw.osm3s?.timestamp_osm_base || null,
  overpassGenerator:raw.generator || null,
  sourceSha256:sha256,
  elementCount:raw.elements.length,
  attribution:spec.license,
  runtimePolicy:'consumer/viewer reads cached GitHub data; no repeated public Overpass calls'
};
await fs.writeFile(provFile, JSON.stringify(provenance,null,2)+'\n');
console.log(JSON.stringify({ok:true,endpoint:used,elements:raw.elements.length,sha256},null,2));
