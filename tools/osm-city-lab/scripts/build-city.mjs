import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { normalizeOverpass } from '../src/osm/normalize.js';
import { buildConsumerScene } from '../src/export/scene-recipe.js';

const id = process.argv[2];
if (!id || !/^[a-z0-9-]+$/.test(id)) throw new Error('Usage: node build-city.mjs <city-id>');

const DATA = new URL(`../data/${id}/`, import.meta.url);
const raw = JSON.parse(await fs.readFile(new URL('source.overpass.json', DATA), 'utf8'));
const spec = JSON.parse(await fs.readFile(new URL('SOURCE_SPEC.json', DATA), 'utf8'));
const provenance = JSON.parse(await fs.readFile(new URL('PROVENANCE.json', DATA), 'utf8'));
const normalized = normalizeOverpass(raw, spec, provenance);
const scene = buildConsumerScene(normalized);
const normText = JSON.stringify(normalized);
const sceneText = JSON.stringify(scene,null,2);

await fs.writeFile(new URL('normalized.json', DATA), normText+'\n');
await fs.mkdir(new URL('../scenes/', import.meta.url), {recursive:true});
await fs.writeFile(new URL(`../scenes/${id}.json`, import.meta.url), sceneText+'\n');

const deterministicA = JSON.stringify(normalizeOverpass(raw, spec, provenance));
const deterministicB = JSON.stringify(normalizeOverpass(raw, spec, provenance));
const rawRefs = new Set(raw.elements.filter(e=>e.type&&e.id!=null).map(e=>`${e.type}/${e.id}`));
const normalizedRefs = [
  ...normalized.features.roads, ...normalized.features.buildings,
  ...normalized.features.landuse, ...normalized.features.waterLines
].map(f=>`${f.osm.type}/${f.osm.id}`);
const idsPreserved = normalizedRefs.every(ref=>rawRefs.has(ref));
const withinBbox = normalized.bounds.sizeM.x <= spec.approxSizeM.eastWest + 1 && normalized.bounds.sizeM.z <= spec.approxSizeM.northSouth + 1;

const report = {
  schema:'kfb.osm-city.s0-report.v0',
  id,
  generatedAt:new Date().toISOString(),
  sourceSha256:provenance.sourceSha256,
  normalizedSha256:crypto.createHash('sha256').update(normText).digest('hex'),
  deterministic:deterministicA===deterministicB,
  bounds:normalized.bounds,
  diagnostics:normalized.diagnostics,
  gates:{
    sourceCached:true,
    osmIdsPreserved:idsPreserved,
    localMetreFrame:normalized.frame.units==='metre',
    roads:normalized.features.roads.length>0,
    buildings:normalized.features.buildings.length>0,
    deterministicReload:deterministicA===deterministicB,
    geometryClippedToBbox:withinBbox
  }
};
if (!Object.values(report.gates).every(Boolean)) throw new Error(`S0 gates failed: ${JSON.stringify(report.gates)}`);
await fs.mkdir(new URL('../evidence/', import.meta.url), {recursive:true});
await fs.writeFile(new URL(`../evidence/${id}-s0-report.json`, import.meta.url), JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
