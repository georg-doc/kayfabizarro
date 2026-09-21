import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { makeLocalENU } from '../src/osm/projection.js';

const id = 'dom-zentrum-v0';
const DATA = new URL('../data/' + id + '/', import.meta.url);

const [raw, normalized, spec, provenance] = await Promise.all([
  fs.readFile(new URL('source.overpass.json', DATA), 'utf8').then(JSON.parse),
  fs.readFile(new URL('normalized.json', DATA), 'utf8').then(JSON.parse),
  fs.readFile(new URL('SOURCE_SPEC.json', DATA), 'utf8').then(JSON.parse),
  fs.readFile(new URL('PROVENANCE.json', DATA), 'utf8').then(JSON.parse)
]);

const projection = makeLocalENU(spec.origin, spec.projection?.earthRadiusM);
const nodes = new Map(raw.elements.filter(e => e.type === 'node').map(e => [e.id, e]));
const ways = new Map(raw.elements.filter(e => e.type === 'way').map(e => [e.id, e]));

const round3 = v => +Number(v).toFixed(3);
const keepTags = t => {
  const keys = [
    'name','alt_name','highway','railway','building','amenity','tourism','historic',
    'man_made','natural','water','waterway','bridge','tunnel','layer','operator',
    'religion','denomination','public_transport','station'
  ];
  const out = {};
  for (const k of keys) if (t?.[k] != null) out[k] = t[k];
  return out;
};
const pointForNode = id => {
  const n = nodes.get(id);
  if (!n) return null;
  const p = projection.project(n.lat, n.lon, 0);
  return {x:round3(p.x),z:round3(p.z),lat:n.lat,lon:n.lon,nodeId:id};
};
const inside = n => n && n.lat >= spec.bbox.south && n.lat <= spec.bbox.north && n.lon >= spec.bbox.west && n.lon <= spec.bbox.east;
const pointsForWay = w => (w.nodes || []).map(id => nodes.get(id)).filter(Boolean).map(n => ({n,p:pointForNode(n.id)})).filter(x => x.p);
const pointsForElement = e => {
  if (e.type === 'node') {
    const p = pointForNode(e.id);
    return p ? [p] : [];
  }
  if (e.type === 'way') return pointsForWay(e).map(x => x.p);
  if (e.type === 'relation') {
    const pts = [];
    for (const m of e.members || []) {
      if (m.type === 'node') {
        const p = pointForNode(m.ref); if (p) pts.push(p);
      } else if (m.type === 'way') {
        const w = ways.get(m.ref);
        if (w) pts.push(...pointsForWay(w).map(x => x.p));
      }
    }
    return pts;
  }
  return [];
};
const centroid = pts => {
  if (!pts.length) return null;
  const s = pts.reduce((a,p)=>({x:a.x+p.x,z:a.z+p.z}),{x:0,z:0});
  return {x:round3(s.x/pts.length),z:round3(s.z/pts.length)};
};
const lengthM = pts => {
  let n=0;
  for(let i=1;i<pts.length;i++) n += Math.hypot(pts[i].x-pts[i-1].x,pts[i].z-pts[i-1].z);
  return +n.toFixed(2);
};

const railways = [];
for (const w of ways.values()) {
  if (!w.tags?.railway) continue;
  const src = pointsForWay(w);
  const clipped = src.filter(x => inside(x.n)).map(x => ({x:x.p.x,z:x.p.z,nodeId:x.p.nodeId}));
  if (clipped.length < 2) continue;
  railways.push({
    id:'way/' + w.id,
    osm:{type:'way',id:w.id,tags:keepTags(w.tags)},
    class:w.tags.railway,
    line:clipped,
    lengthM:lengthM(clipped)
  });
}

const namedAnchors = [];
for (const e of raw.elements) {
  const name = e.tags?.name;
  if (!name) continue;
  const pts = pointsForElement(e);
  const local = centroid(pts);
  if (!local) continue;
  namedAnchors.push({
    id:e.type + '/' + e.id,
    name,
    osm:{type:e.type,id:e.id,tags:keepTags(e.tags)},
    local
  });
}
namedAnchors.sort((a,b)=>a.name.localeCompare(b.name,'de'));

const heroRegex = /(Kölner Dom|Cologne Cathedral|Hauptbahnhof|Hohenzollernbrücke|Deutzer Brücke|Rhein|Museum Ludwig|Philharmonie)/i;
const heroCandidates = namedAnchors.filter(a =>
  heroRegex.test(a.name) ||
  a.osm.tags.railway === 'station' ||
  a.osm.tags.amenity === 'place_of_worship'
);

const roadTopology = normalized.features.roads
  .filter(r => r.osm?.tags?.bridge || r.osm?.tags?.tunnel || r.osm?.tags?.layer)
  .map(r => ({
    id:r.id,
    name:r.osm.tags.name || null,
    class:r.class,
    driveable:r.driveable,
    bridge:r.osm.tags.bridge || null,
    tunnel:r.osm.tags.tunnel || null,
    layer:r.osm.tags.layer || null
  }));

const railTopology = railways
  .filter(r => r.osm.tags.bridge || r.osm.tags.tunnel || r.osm.tags.layer || r.osm.tags.railway === 'station')
  .map(r => ({
    id:r.id,
    name:r.osm.tags.name || null,
    railway:r.class,
    bridge:r.osm.tags.bridge || null,
    tunnel:r.osm.tags.tunnel || null,
    layer:r.osm.tags.layer || null,
    lengthM:r.lengthM
  }));

const context = {
  schema:'kfb.osm-city.design-context.v0',
  id,
  generatedAt:new Date().toISOString(),
  source:{
    raw:'source.overpass.json',
    normalized:'normalized.json',
    scene:'../../scenes/dom-zentrum-v0.json',
    provenance:'PROVENANCE.json',
    rawSha256:provenance.sourceSha256,
    osmBaseTimestamp:provenance.osmBaseTimestamp,
    endpoint:provenance.endpoint,
    attribution:spec.license
  },
  frame:normalized.frame,
  bounds:normalized.bounds,
  counts:{
    rawElements:raw.elements.length,
    roads:normalized.features.roads.length,
    driveableRoads:normalized.features.roads.filter(r=>r.driveable).length,
    buildings:normalized.features.buildings.length,
    landuse:normalized.features.landuse.length,
    waterLines:normalized.features.waterLines.length,
    railwayWays:railways.length,
    namedAnchors:namedAnchors.length,
    heroCandidates:heroCandidates.length
  },
  heroCandidates,
  railways,
  topology:{roads:roadTopology,railways:railTopology},
  consumerNotes:{
    osmRole:'geographic + semantic truth',
    presentationRole:'KFB / OMS / Option C Elastic Cartoon World',
    landmarkRule:'known hero landmarks should use explicit KFB landmark overrides, not generic OSM boxes',
    railwayRule:'HBF rails are future route candidates; do not skin them as ordinary roads',
    waterRule:'Rhine geometry comes from OSM; final water appearance comes from the current KFB/TinySkies water language'
  }
};

const text = JSON.stringify(context,null,2) + '\n';
await fs.writeFile(new URL('DESIGN_CONTEXT.json', DATA), text);
const sha256 = crypto.createHash('sha256').update(text).digest('hex');
console.log(JSON.stringify({ok:true,id,sha256,counts:context.counts,heroes:heroCandidates.slice(0,20).map(x=>x.name)},null,2));
