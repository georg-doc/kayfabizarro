import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { normalizeOverpass } from '../src/osm/normalize.js';
import { buildConsumerScene } from '../src/export/scene-recipe.js';

const DATA = new URL('../data/ehrenfeld-v0/', import.meta.url);
const raw = JSON.parse(await fs.readFile(new URL('source.overpass.json', DATA), 'utf8'));
const spec = JSON.parse(await fs.readFile(new URL('SOURCE_SPEC.json', DATA), 'utf8'));
const provenance = JSON.parse(await fs.readFile(new URL('PROVENANCE.json', DATA), 'utf8'));
const normalized = normalizeOverpass(raw, spec, provenance);
const scene = buildConsumerScene(normalized);
const normText = JSON.stringify(normalized);
const sceneText = JSON.stringify(scene,null,2);
await fs.writeFile(new URL('normalized.json', DATA), normText+'\n');
await fs.mkdir(new URL('../scenes/', import.meta.url), {recursive:true});
await fs.writeFile(new URL('../scenes/ehrenfeld-v0.json', import.meta.url), sceneText+'\n');

const deterministicA = JSON.stringify(normalizeOverpass(raw, spec, provenance));
const deterministicB = JSON.stringify(normalizeOverpass(raw, spec, provenance));
const report = {
  schema:'kfb.osm-city.s0-report.v0',
  id:spec.id,
  generatedAt:new Date().toISOString(),
  sourceSha256:provenance.sourceSha256,
  normalizedSha256:crypto.createHash('sha256').update(normText).digest('hex'),
  deterministic:deterministicA===deterministicB,
  bounds:normalized.bounds,
  diagnostics:normalized.diagnostics,
  gates:{
    sourceCached:true,
    osmIdsPreserved:true,
    localMetreFrame:normalized.frame.units==='metre',
    roads:normalized.features.roads.length>0,
    buildings:normalized.features.buildings.length>0,
    deterministicReload:deterministicA===deterministicB
  }
};
await fs.mkdir(new URL('../evidence/', import.meta.url), {recursive:true});
await fs.writeFile(new URL('../evidence/ehrenfeld-v0-s0-report.json', import.meta.url), JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
