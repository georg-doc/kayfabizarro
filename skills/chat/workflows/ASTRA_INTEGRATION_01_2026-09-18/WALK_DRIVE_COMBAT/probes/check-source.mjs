// Read-only preflight probe; does not modify the donor or run a game/physics engine.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const expectedBlob = 'be8364bd6dec7b423d6cf3c48163e73fffd5d471';
const input = process.argv[2] ?? new URL('../../../../../../tools/world_atlas/source/scenes/city-block.js', import.meta.url);
const bytes = await readFile(input);
const blob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
assert.equal(blob, expectedBlob, 'Donor changed: review and repin explicitly, do not audit unknown code.');
const { scene } = await import(`data:text/javascript;base64,${bytes.toString('base64')}`);
const roads = scene.placements.filter(p => /^roads:road-(straight|crossroad|crossing)$/.test(p.a));
const byCell = new Map();
for (const p of roads) {
  const key = p.m.join(',');
  if (!byCell.has(key)) byCell.set(key, []);
  byCell.get(key).push(p);
}
const duplicates = [...byCell].filter(([, p]) => p.length > 1).map(([cell, placements]) => ({ cell, placements }));
assert.deepEqual(duplicates.map(x => x.cell).sort(), ['4,2', '7,5']);
const corridorProps = scene.placements.filter(p =>
  /^roads:construction-(cone|barrier)$/.test(p.a) && (p.m[0] === 4 || p.m[1] === 5));
assert.equal(corridorProps.length, 2);
const correctedRoadCount = roads.length - duplicates.length;
assert.equal(correctedRoadCount, 19);

// Analytic constraint only: ideal sphere + an UNPROJECTED tangent plane, no terrain.
// R and bodyHeight are current Ground source defaults; 5% body height is a proposed tolerance.
const radius = 5, bodyHeight = .022, proposedTolerance = bodyHeight * .05;
const planeRadiusLimit = Math.sqrt(2 * radius * proposedTolerance + proposedTolerance ** 2);
const upErrorDegreesAtLimit = Math.atan(planeRadiusLimit / radius) * 180 / Math.PI;
assert.ok(Math.abs(Math.hypot(radius, planeRadiusLimit) - radius - proposedTolerance) < 1e-12);
const result = {
  evidenceClass: 'SOURCE_AUDIT_AND_ANALYTIC_PROBE_ONLY',
  date: '2026-09-18', node: process.version,
  donor: { repo: 'georg-doc/kayfabizarro', path: 'tools/world_atlas/source/scenes/city-block.js', gitBlob: blob, bytes: bytes.length },
  recipe: { id: scene.id, placements: scene.placements.length, roadPlacements: roads.length, distinctRoadCells: byCell.size,
    duplicateRoadCells: duplicates, corridorPropCandidates: corridorProps, roadPlacementsAfterProposedReplacement: correctedRoadCount },
  tangentPlaneConstraint: { radius, bodyHeight, tolerancePolicy: 'PROPOSAL: radial error <= 0.05 bodyHeight',
    proposedTolerance, planeRadiusLimit, upErrorDegreesAtLimit,
    excludes: ['baked terrain variation', 'road mesh thickness', 'vehicle suspension', 'dynamic contact', 'rebase continuity'] },
  checks: { sourceBlobMatches: true, duplicateRoadCellsConfirmed: true, corridorPropCellsConfirmed: true, replacementCountConfirmed: true, sphereEquationConfirmed: true },
  notTested: ['GLB/GLTF geometry bounds', 'asset sidecar closure', 'Rapier dynamics', 'braking/reverse', 'spherical drive', 'safe exit', 'combat integration', 'browser', 'deployment', 'human acceptance']
};
console.log(JSON.stringify(result, null, 2));
