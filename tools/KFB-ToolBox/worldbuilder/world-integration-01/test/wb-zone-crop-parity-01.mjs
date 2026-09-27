import fs from 'node:fs';
import assert from 'node:assert/strict';

const PIN = '3b4909d4c83b704662e66b60212e7f20ba5cf662';
const NORMALIZED_BLOB = '14d3f09da6e14fb7f5dc9478f78be9f876bffab9';
const NORMALIZED_URL =
  'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + PIN +
  '/tools/osm-city-lab/world-zones/cologne-dom-zentrum-v0/2026-09-24.1/normalized.json';
const FIXTURE = 'tools/KFB-ToolBox/worldbuilder/world-integration-01/fixtures/cologne-dom-crop-v0.json';
const RECT = { minX: -620, maxX: 180, minZ: -300, maxZ: 300 };

const fixture = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
const response = await fetch(NORMALIZED_URL, { cache: 'no-store' });
assert.equal(response.status, 200, 'pinned normalized.json HTTP 200');
const normalized = await response.json();
assert.equal(normalized.schema, 'kfb.osm-city.normalized.v0');
assert.equal(fixture.counts.buildings, 369);

const buildings = normalized.features?.buildings || [];
const fixtureIds = new Set(fixture.buildings.map((b) => b.id));

const isClosed = (fp) =>
  fp.length > 1 &&
  fp[0].x === fp.at(-1).x &&
  fp[0].z === fp.at(-1).z;

function vertexMeanSerialized(fp) {
  const a = fp || [];
  if (!a.length) return { x: 0, z: 0 };
  return {
    x: a.reduce((sum, p) => sum + Number(p.x), 0) / a.length,
    z: a.reduce((sum, p) => sum + Number(p.z), 0) / a.length
  };
}

function vertexMeanDedupClosing(fp) {
  let a = fp || [];
  if (isClosed(a)) a = a.slice(0, -1);
  if (!a.length) return { x: 0, z: 0 };
  return {
    x: a.reduce((sum, p) => sum + Number(p.x), 0) / a.length,
    z: a.reduce((sum, p) => sum + Number(p.z), 0) / a.length
  };
}

function polygonAreaCentroid(fp) {
  let a = fp || [];
  if (isClosed(a)) a = a.slice(0, -1);
  if (!a.length) return { x: 0, z: 0 };
  let crossSum = 0;
  let cx = 0;
  let cz = 0;
  for (let i = 0; i < a.length; i += 1) {
    const p = a[i];
    const q = a[(i + 1) % a.length];
    const cross = p.x * q.z - q.x * p.z;
    crossSum += cross;
    cx += (p.x + q.x) * cross;
    cz += (p.z + q.z) * cross;
  }
  if (Math.abs(crossSum) < 1e-12) return vertexMeanDedupClosing(a);
  return { x: cx / (3 * crossSum), z: cz / (3 * crossSum) };
}

function bbox(fp) {
  const xs = fp.map((p) => Number(p.x));
  const zs = fp.map((p) => Number(p.z));
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minZ: Math.min(...zs),
    maxZ: Math.max(...zs)
  };
}

function bboxCenter(fp) {
  const b = bbox(fp);
  return { x: (b.minX + b.maxX) / 2, z: (b.minZ + b.maxZ) / 2 };
}

function inside(p, inclusive = true, epsilon = 0) {
  if (inclusive) {
    return (
      p.x >= RECT.minX - epsilon &&
      p.x <= RECT.maxX + epsilon &&
      p.z >= RECT.minZ - epsilon &&
      p.z <= RECT.maxZ + epsilon
    );
  }
  return (
    p.x > RECT.minX + epsilon &&
    p.x < RECT.maxX - epsilon &&
    p.z > RECT.minZ + epsilon &&
    p.z < RECT.maxZ - epsilon
  );
}

function roundPoint(p, digits) {
  const m = 10 ** digits;
  return { x: Math.round(p.x * m) / m, z: Math.round(p.z * m) / m };
}

function selectedIds(centerFn, { inclusive = true, epsilon = 0, roundDigits = null } = {}) {
  return new Set(
    buildings
      .filter((b) => {
        let c = centerFn(b.footprint);
        if (roundDigits !== null) c = roundPoint(c, roundDigits);
        return inside(c, inclusive, epsilon);
      })
      .map((b) => b.id)
  );
}

function delta(ids) {
  return {
    count: ids.size,
    missing: [...fixtureIds].filter((id) => !ids.has(id)).sort(),
    extra: [...ids].filter((id) => !fixtureIds.has(id)).sort()
  };
}

const variants = {
  'vertex-serialized-inclusive': selectedIds(vertexMeanSerialized),
  'vertex-serialized-strict': selectedIds(vertexMeanSerialized, { inclusive: false }),
  'vertex-dedup-closing-inclusive': selectedIds(vertexMeanDedupClosing),
  'area-centroid-inclusive': selectedIds(polygonAreaCentroid),
  'bbox-centre-inclusive': selectedIds(bboxCenter),
  'vertex-serialized-round3-inclusive': selectedIds(vertexMeanSerialized, { roundDigits: 3 }),
  'vertex-serialized-expand-1mm-inclusive': selectedIds(vertexMeanSerialized, { epsilon: 0.001 }),
  'vertex-serialized-shrink-1mm-strict': selectedIds(vertexMeanSerialized, { inclusive: false, epsilon: 0.001 })
};

const variantDeltas = Object.fromEntries(
  Object.entries(variants).map(([name, ids]) => [name, delta(ids)])
);

const differingIds = new Set();
for (const ids of Object.values(variants)) {
  for (const id of fixtureIds) if (!ids.has(id)) differingIds.add(id);
  for (const id of ids) if (!fixtureIds.has(id)) differingIds.add(id);
}

function boundaryDistances(p) {
  return {
    toMinX: p.x - RECT.minX,
    toMaxX: RECT.maxX - p.x,
    toMinZ: p.z - RECT.minZ,
    toMaxZ: RECT.maxZ - p.z
  };
}

const details = [...differingIds].sort().map((id) => {
  const b = buildings.find((x) => x.id === id);
  assert.ok(b, 'differing id exists in normalized source: ' + id);
  const centers = {
    vertexSerialized: vertexMeanSerialized(b.footprint),
    vertexDedupClosing: vertexMeanDedupClosing(b.footprint),
    areaCentroid: polygonAreaCentroid(b.footprint),
    bboxCentre: bboxCenter(b.footprint)
  };
  const box = bbox(b.footprint);
  return {
    id,
    fixture: fixtureIds.has(id),
    closedRing: isClosed(b.footprint),
    osm: {
      kind: b.osm?.tags?.building || null,
      name: b.osm?.tags?.name || null
    },
    centers,
    bbox: box,
    distanceToCropBoundaries: Object.fromEntries(
      Object.entries(centers).map(([name, p]) => [name, boundaryDistances(p)])
    ),
    memberships: Object.fromEntries(
      Object.entries(variants).map(([name, ids]) => [name, ids.has(id)])
    )
  };
});

const rawIds = [...variants['vertex-serialized-inclusive']].sort();
const expectedIds = [...fixtureIds].sort();

assert.deepEqual(
  rawIds,
  expectedIds,
  'serialized vertex mean including the repeated closing point must reproduce the exact frozen 369-id set'
);
assert.equal(
  variants['vertex-dedup-closing-inclusive'].size,
  368,
  'reproduce initial failed repair baseline: removing the repeated closing point yields 368'
);
assert.deepEqual(
  [...variants['vertex-serialized-strict']].sort(),
  expectedIds,
  'strict/inclusive edge predicate is observationally equivalent for this source'
);

const report = {
  schema: 'kfb.wb-zone-crop-parity-01.report/1',
  source: {
    normalizedCommit: PIN,
    normalizedBlob: NORMALIZED_BLOB,
    normalizedUrl: NORMALIZED_URL,
    fixture: FIXTURE
  },
  crop: RECT,
  result: {
    pass: true,
    deterministicRule:
      'arithmetic mean of every serialized footprint coordinate, including the repeated closing coordinate, then inclusive crop bounds',
    exactFixtureIds: expectedIds.length,
    note:
      'Strict and inclusive comparisons produce the same set for this source; no raw serialized-mean centre lies exactly on a crop boundary.'
  },
  variantDeltas,
  differingBuildings: details
};

console.log(JSON.stringify(report, null, 2));
console.log(
  'WB-ZONE-CROP-PARITY-01 PASS · exact 369/369 IDs · rule = serialized vertex mean including closing coordinate'
);
