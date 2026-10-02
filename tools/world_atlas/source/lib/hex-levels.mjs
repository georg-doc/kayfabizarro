// Additive vertical contract for the existing Hex catalog. No grid/solver/scale owner.
// Edge order and turns follow hex-grid.js: E, SE, SW, W, NW, NE; i -> i + turns.
export const LEVEL_SCHEMA = 'kfb.hex-vertical-topology/0.1-candidate';
export const MEASUREMENT_TOLERANCE = 0.002; // Blender/browser agreement, not a walkable-step allowance.

function turns(n) {
  if (!Number.isInteger(n)) throw new TypeError('Rotation must be whole hex turns');
  return ((n % 6) + 6) % 6;
}
function six(values, name) {
  if (!Array.isArray(values) || values.length !== 6) throw new TypeError(`${name} needs six edges`);
}
export function rotateEdges(values, n = 0) {
  six(values, 'Edge values');
  const out = Array(6), shift = turns(n);
  for (let i = 0; i < 6; i++) out[(i + shift) % 6] = values[i];
  return out;
}
export function rotateVerticalTopology(vertical, n = 0) {
  if (!vertical) return null;
  const shift = turns(n);
  return {
    ...vertical,
    edgeDeckY: rotateEdges(vertical.edgeDeckY, shift),
    // Tangent direction rotates with the edge: do not reverse profiles here.
    ...(vertical.edgeProfilesY ? { edgeProfilesY: rotateEdges(vertical.edgeProfilesY, shift) } : {}),
    slopeAxisLowEdge: vertical.slopeAxisLowEdge === null ? null : (vertical.slopeAxisLowEdge + shift) % 6,
  };
}
export function measuredSlope(row, source) {
  six(row.edgeMid0to5, 'Measured heights');
  if (![...row.edgeMid0to5, row.centre].every(Number.isFinite)) throw new TypeError('Non-finite height');
  const edgeDeckY = [...row.edgeMid0to5];
  return {
    schema: LEVEL_SCHEMA,
    units: 'hex-native', frame: 'three.js-y-up', tileFlatToFlat: 2,
    edgeDeckY, levelLow: Math.min(...edgeDeckY), levelHigh: Math.max(...edgeDeckY),
    slopeAxisLowEdge: edgeDeckY.indexOf(Math.min(...edgeDeckY)), centerDeckY: row.centre,
    source, confidence: 'MEASURED_BLENDER_MIDPOINTS',
    sampling: { radius: 0.9, method: 'downward-ray', coverage: 'six-inset-midpoints-and-centre' },
    fullEdgeProfilesMeasured: false,
    rotationalSymmetry: 6, // Edge colour symmetry cannot deduplicate slope direction.
    admission: 'PREPARE', contractStatus: 'CANDIDATE',
    reason: 'Inset midpoint heights identify level conflicts but do not prove full-edge contact.',
  };
}
export function extendHexCatalog(catalog, measurements, source) {
  if (catalog.schema !== 'kfb.hex-tiles/1') throw new TypeError('Expected existing kfb.hex-tiles/1 catalog');
  const known = new Map(catalog.tiles.map(t => [t.key, t]));
  for (const key of Object.keys(measurements.slopes.rows)) if (!known.has(key)) throw new Error(`Missing tile ${key}`);
  // Preserve every existing field, topology, source pin and runtime fact.
  return {
    ...catalog,
    tiles: catalog.tiles.map(tile => measurements.slopes.rows[tile.key] ? {
      ...tile,
      verticalTopology: measuredSlope(measurements.slopes.rows[tile.key], {
        ...source, asset: tile.source, measurementKey: tile.key,
      }),
    } : tile),
    verticalContract: {
      schema: LEVEL_SCHEMA, status: 'CANDIDATE', scaleDecision: 'A_LOGICAL_HEX',
      tolerance: MEASUREMENT_TOLERANCE, source,
      policy: 'Height compatibility is additional to edge classes; missing/full-edge-unproven data never grants placement.',
    },
  };
}

// A predicate consumed by the existing audit/solver owner, not a second solver.
// Missing evidence is explicit. Equal midpoint samples must not become a full seam PASS.
export function compareVerticalEdges(a, b, dir, opts = {}) {
  if (!Number.isInteger(dir) || dir < 0 || dir > 5) throw new TypeError('Invalid edge direction');
  const tolerance = opts.tolerance ?? MEASUREMENT_TOLERANCE;
  if (!Number.isFinite(tolerance) || tolerance < 0 || tolerance > MEASUREMENT_TOLERANCE)
    throw new TypeError('Tolerance may not hide a physical step');
  const opposite = (dir + 3) % 6;
  const va = rotateVerticalTopology(a.verticalTopology, a.rotTurns ?? 0);
  const vb = rotateVerticalTopology(b.verticalTopology, b.rotTurns ?? 0);
  const base = { dir, opposite, safeToPlace: false, tolerance };
  const kindsA = a.topology?.kinds, kindsB = b.topology?.kinds;
  if (typeof kindsA !== 'string' || kindsA.length !== 6 || typeof kindsB !== 'string' || kindsB.length !== 6)
    return { ...base, status: 'UNPROVEN', reason: 'EDGE_CLASSES_MISSING' };
  const ca = rotateEdges([...kindsA], a.rotTurns ?? 0)[dir];
  const cb = rotateEdges([...kindsB], b.rotTurns ?? 0)[opposite];
  if (ca === '?' || cb === '?') return { ...base, status: 'UNPROVEN', reason: 'EDGE_CLASS_UNKNOWN' };
  if (ca !== cb) return { ...base, status: 'INCOMPATIBLE', reason: 'EDGE_CLASS_MISMATCH', classA: ca, classB: cb };
  if (!va || !vb) return { ...base, status: 'UNPROVEN', reason: 'VERTICAL_DATA_MISSING' };
  if (va.units !== 'hex-native' || vb.units !== va.units || va.frame !== 'three.js-y-up' ||
      vb.frame !== va.frame || va.tileFlatToFlat !== 2 || vb.tileFlatToFlat !== va.tileFlatToFlat)
    return { ...base, status: 'INCOMPATIBLE', reason: 'FRAME_OR_UNIT_MISMATCH' };
  const offsetA = a.level ?? 0, offsetB = b.level ?? 0;
  if (![offsetA, offsetB, va.edgeDeckY[dir], vb.edgeDeckY[opposite]].every(Number.isFinite))
    return { ...base, status: 'UNPROVEN', reason: 'NON_FINITE_HEIGHT' };
  const midpointGap = Math.abs(va.edgeDeckY[dir] + offsetA - vb.edgeDeckY[opposite] - offsetB);
  const pa = va.edgeProfilesY?.[dir], pb = vb.edgeProfilesY?.[opposite];
  // Facing edges have opposite local tangent directions; reverse B exactly once.
  const complete = va.fullEdgeProfilesMeasured === true && vb.fullEdgeProfilesMeasured === true &&
    Array.isArray(pa) && Array.isArray(pb) && pa.length >= 3 && pa.length === pb.length &&
    JSON.stringify(va.profileSampleOffsets) === JSON.stringify(vb.profileSampleOffsets) &&
    Array.isArray(va.profileSampleOffsets) && va.profileSampleOffsets.length === pa.length &&
    va.profileSampleOffsets.every((x,i,arr) => Number.isFinite(x) && (i === 0 || x > arr[i-1]) &&
      Math.abs(x + arr[arr.length-1-i]) <= tolerance) && [...pa, ...pb].every(Number.isFinite);
  const profileGap = complete ? Math.max(...pa.map((y,i) => Math.abs(y + offsetA - pb[pb.length-1-i] - offsetB))) : null;
  const maxGap = Math.max(midpointGap, profileGap ?? 0);
  if (maxGap > tolerance) return {
    ...base, midpointGap, profileGap, maxGap,
    status: opts.transition?.id ? 'TRANSITION_REQUIRED' : 'INCOMPATIBLE',
    reason: 'HEIGHT_MISMATCH', transition: opts.transition?.id ?? null,
  };
  return { ...base, midpointGap, profileGap, maxGap, status: 'MATCHED',
    safeToPlace: complete, reason: complete ? 'MEASURED_PROFILE_MATCH' : 'MIDPOINT_ONLY_FULL_EDGE_UNPROVEN' };
}

export function reportMeasuredSeam(recipe, source) {
  return recipe.seams.map(seam => {
    const valid = Array.isArray(seam.deckStepAlongEdge) && seam.deckStepAlongEdge.length === 5 &&
      seam.deckStepAlongEdge.every(v => Number.isFinite(v) && v >= 0);
    const maxStep = valid ? Math.max(...seam.deckStepAlongEdge) : null;
    return {
      ...seam, units: 'hex-native', source,
      status: !valid ? 'UNPROVEN' : !seam.classMatch ? 'INCOMPATIBLE' :
        maxStep > MEASUREMENT_TOLERANCE ? 'TRANSITION_REQUIRED' : 'MATCHED_AT_SAMPLES',
      safeToTraverse: false, centreStep: valid ? seam.deckStepAlongEdge[2] : null, maxStep,
      recommendation: 'MEASURED_TRANSITION_WITH_COLLISION_SURFACE',
      treatment: 'One local transition fitted to the five measured gaps. A visual skirt alone does not close the traversal step. No global tile shift.',
      geometryChanged: false,
      evidenceScope: 'five seam probes, 0.04 inside either tile; not a full continuous edge proof',
    };
  });
}
