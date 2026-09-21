import { makeLocalENU } from './projection.js';
import {
  buildingHeight, buildingMaterialClass, classifySurface, isDriveable,
  roadClass, roadWidthM, sidewalkPolicy
} from './tags.js';

function stableHash(value) {
  let h = 2166136261;
  const s = String(value);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function hash01(value) { return stableHash(value) / 0xffffffff; }
function round3(v) { return +Number(v).toFixed(3); }
function tagsOf(e) { return e.tags || {}; }
function osmRef(e) { return { type: e.type, id: e.id, tags: tagsOf(e) }; }

function closeRing(points) {
  if (!points.length) return points;
  const a = points[0], b = points[points.length - 1];
  return (a.x === b.x && a.z === b.z) ? points : [...points, { ...a }];
}

function stitchNodeRings(ways) {
  const pool = ways.map(w => [...(w.nodes || [])]).filter(n => n.length >= 2);
  const rings = [];
  while (pool.length) {
    let ring = pool.shift();
    let changed = true;
    while (changed && ring[0] !== ring[ring.length - 1]) {
      changed = false;
      for (let i = 0; i < pool.length; i++) {
        const w = pool[i];
        const a = ring[0], b = ring[ring.length - 1], c = w[0], d = w[w.length - 1];
        if (b === c) ring = ring.concat(w.slice(1));
        else if (b === d) ring = ring.concat([...w].reverse().slice(1));
        else if (a === d) ring = w.slice(0, -1).concat(ring);
        else if (a === c) ring = [...w].reverse().slice(0, -1).concat(ring);
        else continue;
        pool.splice(i, 1);
        changed = true;
        break;
      }
    }
    if (ring.length >= 4 && ring[0] === ring[ring.length - 1]) rings.push(ring);
  }
  return rings;
}

function localClipRect(sourceSpec, projection) {
  const sw = projection.project(sourceSpec.bbox.south, sourceSpec.bbox.west, 0);
  const ne = projection.project(sourceSpec.bbox.north, sourceSpec.bbox.east, 0);
  return { minX: Math.min(sw.x, ne.x), maxX: Math.max(sw.x, ne.x), minZ: Math.min(sw.z, ne.z), maxZ: Math.max(sw.z, ne.z) };
}

function clipSegment(a, b, r) {
  const dx=b.x-a.x, dz=b.z-a.z; let t0=0, t1=1;
  const p=[-dx,dx,-dz,dz], q=[a.x-r.minX,r.maxX-a.x,a.z-r.minZ,r.maxZ-a.z];
  for(let i=0;i<4;i++){
    if(Math.abs(p[i])<1e-12){ if(q[i]<0) return null; continue; }
    const t=q[i]/p[i];
    if(p[i]<0){ if(t>t1)return null; if(t>t0)t0=t; }
    else { if(t<t0)return null; if(t<t1)t1=t; }
  }
  const point=(t,src)=>({x:round3(a.x+dx*t),z:round3(a.z+dz*t),nodeId:Math.abs(t-src)<1e-10?(src===0?a.nodeId:b.nodeId):null});
  return [point(t0,0),point(t1,1)];
}

function sameXZ(a,b){ return a && b && Math.abs(a.x-b.x)<0.002 && Math.abs(a.z-b.z)<0.002; }
function clipPolyline(points, rect) {
  const parts=[]; let current=null;
  for(let i=0;i<points.length-1;i++){
    const seg=clipSegment(points[i],points[i+1],rect);
    if(!seg){ if(current?.length>1)parts.push(current); current=null; continue; }
    if(!current || !sameXZ(current[current.length-1],seg[0])) { if(current?.length>1)parts.push(current); current=[seg[0],seg[1]]; }
    else if(!sameXZ(current[current.length-1],seg[1])) current.push(seg[1]);
  }
  if(current?.length>1)parts.push(current);
  return parts;
}

function clipPolygon(points, rect) {
  let poly=points.map(p=>({x:p.x,z:p.z}));
  if(poly.length>1 && sameXZ(poly[0],poly[poly.length-1])) poly.pop();
  const edges=[
    {inside:p=>p.x>=rect.minX, intersect:(a,b)=>({x:rect.minX,z:a.z+(b.z-a.z)*(rect.minX-a.x)/(b.x-a.x)})},
    {inside:p=>p.x<=rect.maxX, intersect:(a,b)=>({x:rect.maxX,z:a.z+(b.z-a.z)*(rect.maxX-a.x)/(b.x-a.x)})},
    {inside:p=>p.z>=rect.minZ, intersect:(a,b)=>({z:rect.minZ,x:a.x+(b.x-a.x)*(rect.minZ-a.z)/(b.z-a.z)})},
    {inside:p=>p.z<=rect.maxZ, intersect:(a,b)=>({z:rect.maxZ,x:a.x+(b.x-a.x)*(rect.maxZ-a.z)/(b.z-a.z)})}
  ];
  for(const e of edges){
    const input=poly; poly=[]; if(!input.length)break;
    let a=input[input.length-1], ain=e.inside(a);
    for(const b of input){ const bin=e.inside(b);
      if(bin){ if(!ain)poly.push(e.intersect(a,b)); poly.push(b); }
      else if(ain)poly.push(e.intersect(a,b));
      a=b; ain=bin;
    }
  }
  if(poly.length<3)return [];
  const out=poly.map(p=>({x:round3(p.x),z:round3(p.z)}));
  out.push({...out[0]}); return out;
}

function roofFor(tags, key, materialClass) {
  const tagged = tags['roof:shape'];
  if (tagged) return { type: tagged, source: 'osm-tag', heightM: 1.2 };
  const h = stableHash(key);
  if (materialClass === 'building-industrial') return { type: h % 2 ? 'flat' : 'sawtooth-hint', source: 'stable-id', heightM: h % 2 ? 0.35 : 0.8 };
  const types = ['flat', 'gabled-hint', 'hipped-hint'];
  const type = types[h % types.length];
  return { type, source: 'stable-id', heightM: type === 'flat' ? 0.35 : 1.4 + (h % 5) * 0.15 };
}

export function normalizeOverpass(raw, sourceSpec, provenance = {}) {
  if (!raw || !Array.isArray(raw.elements)) throw new Error('Overpass JSON missing elements[]');
  const projection = makeLocalENU(sourceSpec.origin, sourceSpec.projection?.earthRadiusM);
  const clipRect = localClipRect(sourceSpec, projection);
  const nodes = new Map(), ways = new Map(), relations = [];
  for (const e of raw.elements) {
    if (e.type === 'node') nodes.set(e.id, e);
    else if (e.type === 'way') ways.set(e.id, e);
    else if (e.type === 'relation') relations.push(e);
  }
  const pointForNode = id => {
    const n = nodes.get(id);
    if (!n) return null;
    const p = projection.project(n.lat, n.lon, 0);
    return { x: round3(p.x), z: round3(p.z), nodeId: id };
  };
  const lineForWay = w => (w.nodes || []).map(pointForNode).filter(Boolean);
  const features = { roads: [], buildings: [], landuse: [], waterLines: [] };
  const consumedRelationWays = new Set();
  const diagnostics = { missingNodes: 0, openPolygonWays: 0, unsupportedRelations: 0, relationRings: 0, clippedLineParts: 0, clippedPolygons: 0 };

  function pushPolygonFeature(kind, ref, ring, tags, relationMeta = null) {
    if (ring.length < 4) return;
    const pts = ring.map(pointForNode).filter(Boolean);
    if (pts.length < 4) { diagnostics.missingNodes++; return; }
    const unclippedClosed = closeRing(pts);
    const closed = clipPolygon(unclippedClosed, clipRect);
    if (closed.length < 4) return;
    if (closed.length !== unclippedClosed.length || closed.some((p,i)=>!sameXZ(p,unclippedClosed[i]))) diagnostics.clippedPolygons++;
    if (kind === 'building') {
      const key = relationMeta ? `${ref.type}/${ref.id}:${relationMeta.ringIndex}` : `${ref.type}/${ref.id}`;
      const h = stableHash(key);
      const bh = buildingHeight(tags, hash01(key));
      const materialClass = buildingMaterialClass(tags, h);
      features.buildings.push({
        id: key, osm: { ...ref, tags }, footprint: closed.map(({x,z}) => ({x,z})),
        heightM: bh.heightM, heightSource: bh.source, minHeightM: 0,
        materialClass, roof: roofFor(tags, key, materialClass),
        relation: relationMeta
      });
    } else {
      const cls = classifySurface(tags);
      features.landuse.push({
        id: relationMeta ? `${ref.type}/${ref.id}:${relationMeta.ringIndex}` : `${ref.type}/${ref.id}`, osm: { ...ref, tags }, class: cls,
        polygon: closed.map(({x,z}) => ({x,z})), relation: relationMeta
      });
    }
  }

  for (const rel of relations) {
    const tags = tagsOf(rel);
    const kind = tags.building ? 'building' :
      (tags.landuse || tags.leisure || tags.natural || tags.water || tags.waterway === 'riverbank') ? 'surface' : null;
    if (!kind) continue;
    const outers = (rel.members || []).filter(m => m.type === 'way' && (m.role === 'outer' || m.role === ''));
    const outerWays = outers.map(m => ways.get(m.ref)).filter(Boolean);
    const rings = stitchNodeRings(outerWays);
    if (!rings.length) { diagnostics.unsupportedRelations++; continue; }
    for (const m of outers) consumedRelationWays.add(m.ref);
    diagnostics.relationRings += rings.length;
    rings.forEach((ring, i) => pushPolygonFeature(kind, {type:'relation', id:rel.id}, ring, tags, { relationId: rel.id, ringIndex: i }));
  }

  for (const w of ways.values()) {
    const tags = tagsOf(w);
    if (tags.highway) {
      const pts = lineForWay(w);
      if (pts.length >= 2) {
        const parts = clipPolyline(pts, clipRect);
        const sw = sidewalkPolicy(tags);
        diagnostics.clippedLineParts += Math.max(0, parts.length - 1);
        parts.forEach((part,partIndex)=>features.roads.push({
          id:parts.length===1?`way/${w.id}`:`way/${w.id}:${partIndex}`, osm:osmRef(w), class:roadClass(tags), driveable:isDriveable(tags),
          widthM:round3(roadWidthM(tags)), centerline:part.map(({x,z})=>({x,z})),
          nodeIds:part.map(p=>p.nodeId??null), sidewalk:sw, sourcePart:parts.length===1?null:partIndex
        }));
      }
    }
    if (consumedRelationWays.has(w.id)) continue;
    const isClosed = (w.nodes || []).length >= 4 && w.nodes[0] === w.nodes[w.nodes.length - 1];
    if (tags.building) {
      if (isClosed) pushPolygonFeature('building', {type:'way', id:w.id}, w.nodes, tags);
      else diagnostics.openPolygonWays++;
    } else if (tags.landuse || tags.leisure || tags.natural || tags.water || tags.waterway === 'riverbank') {
      if (isClosed) pushPolygonFeature('surface', {type:'way', id:w.id}, w.nodes, tags);
      else if (tags.waterway) {
        const pts = lineForWay(w);
        if (pts.length >= 2) clipPolyline(pts,clipRect).forEach((part,partIndex)=>features.waterLines.push({id:`way/${w.id}:${partIndex}`, osm:osmRef(w), line:part.map(({x,z})=>({x,z}))}));
      }
    } else if (tags.waterway) {
      const pts = lineForWay(w);
      if (pts.length >= 2) clipPolyline(pts,clipRect).forEach((part,partIndex)=>features.waterLines.push({id:`way/${w.id}:${partIndex}`, osm:osmRef(w), line:part.map(({x,z})=>({x,z}))}));
    }
  }

  const all = [];
  for (const r of features.roads) all.push(...r.centerline);
  for (const b of features.buildings) all.push(...b.footprint);
  for (const a of features.landuse) all.push(...a.polygon);
  for (const l of features.waterLines) all.push(...l.line);
  let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;
  for(const p of all){
    if(p.x<minX)minX=p.x; if(p.x>maxX)maxX=p.x;
    if(p.z<minZ)minZ=p.z; if(p.z>maxZ)maxZ=p.z;
  }
  const bounds = all.length ? {
    min:{x:round3(minX), z:round3(minZ)},
    max:{x:round3(maxX), z:round3(maxZ)}
  } : {min:{x:0,z:0},max:{x:0,z:0}};
  bounds.sizeM = {x:round3(bounds.max.x-bounds.min.x), z:round3(bounds.max.z-bounds.min.z)};

  return {
    schema:'kfb.osm-city.normalized.v0',
    id:sourceSpec.id,
    source:{
      bbox:sourceSpec.bbox, query:'data/ehrenfeld-v0/query.overpassql',
      attribution:sourceSpec.license, provenance
    },
    frame:{
      kind:sourceSpec.projection.kind, originWgs84:[sourceSpec.origin.lat,sourceSpec.origin.lon,sourceSpec.origin.altM||0],
      axes:{x:'east',y:'up',z:'north'}, units:'metre', earthRadiusM:sourceSpec.projection.earthRadiusM,
      clipRectM:{minX:round3(clipRect.minX),maxX:round3(clipRect.maxX),minZ:round3(clipRect.minZ),maxZ:round3(clipRect.maxZ)}
    },
    bounds, features,
    diagnostics:{
      ...diagnostics,
      elementCounts:{nodes:nodes.size,ways:ways.size,relations:relations.length},
      featureCounts:{
        roads:features.roads.length, buildings:features.buildings.length,
        landuse:features.landuse.length, waterLines:features.waterLines.length
      }
    }
  };
}
