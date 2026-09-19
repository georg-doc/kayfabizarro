// Adapted from georg-doc/kayfabizarro OSM City Lab, pinned in city-drive-recipe.json.
// Presentation only: the physical building collider remains the undeformed export.

import { triangulatePolygon } from './city-geometry.mjs';

export function stableHash(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

// City Lab uses this 31-based hash when selecting a concrete color inside
// the already-determined material family. Keep it separate from the FNV hash
// used for source identity / material-class selection.
export function paletteHash(value) {
  let hash = 0;
  for (const char of String(value)) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0;
  return hash >>> 0;
}

function mulberry32(seed) {
  let value = (seed >>> 0) || 1;
  return function random() {
    value = (value + 0x6D2B79F5) | 0;
    let mixed = Math.imul(value ^ (value >>> 15), 1 | value);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

export function cityCartoonParams(id, config = {}, seedRoot = 'kfb-city') {
  const random = mulberry32(stableHash(`${seedRoot}:${id}`));
  const symmetric = () => random() * 2 - 1;
  const stackSteps = Math.max(0, Math.floor(Number(config.stackSteps ?? 0)));
  const stackShift = Math.max(0, Number(config.stackShift ?? 0));
  const stackOffsets = [{ x: 0, z: 0 }];
  for (let index = 1; index <= stackSteps; index += 1) {
    const strength = stackShift * (0.4 + 0.6 * index / Math.max(1, stackSteps));
    stackOffsets.push({ x: symmetric() * strength, z: symmetric() * strength });
  }
  return {
    bendX: symmetric() * Number(config.bend ?? 0.018),
    bendZ: symmetric() * Number(config.bend ?? 0.018),
    leanX: symmetric() * Number(config.lean ?? 0.024),
    leanZ: symmetric() * Number(config.lean ?? 0.024),
    taper: (0.35 + random() * 0.65) * Number(config.taper ?? 0.055),
    twist: symmetric() * Number(config.twistDeg ?? 1.8) * Math.PI / 180,
    stackOffsets,
    stackMode: config.stackMode === 'step' ? 'step' : 'smooth',
    seed: stableHash(`${seedRoot}:${id}`)
  };
}

function stackOffsetAt(t, params) {
  const offsets = params.stackOffsets || [];
  if (offsets.length <= 1) return { x: 0, z: 0 };
  const scaled = Math.max(0, Math.min(offsets.length - 1, t * (offsets.length - 1)));
  if (params.stackMode === 'step') {
    return offsets[Math.round(scaled)] || offsets[0];
  }
  const low = Math.floor(scaled);
  const high = Math.min(offsets.length - 1, low + 1);
  const mix = scaled - low;
  const a = offsets[low] || offsets[0];
  const b = offsets[high] || a;
  return {
    x: a.x + (b.x - a.x) * mix,
    z: a.z + (b.z - a.z) * mix
  };
}

export function deformPoint(point, bounds, params) {
  const t = Math.max(0, Math.min(1, (point.y - bounds.minY) / bounds.h));
  let x = point.x - bounds.cx;
  let z = point.z - bounds.cz;
  const scale = Math.max(0.68, 1 - params.taper * t);
  x *= scale;
  z *= scale;
  const angle = params.twist * t;
  const tx = x * Math.cos(angle) - z * Math.sin(angle);
  const tz = x * Math.sin(angle) + z * Math.cos(angle);
  const offset = stackOffsetAt(t, params);
  return {
    x: bounds.cx + tx + (params.bendX * t * t + params.leanX * t + offset.x) * bounds.h,
    y: point.y,
    z: bounds.cz + tz + (params.bendZ * t * t + params.leanZ * t + offset.z) * bounds.h
  };
}

function hexToRgb(hex) {
  const value = Number.parseInt(String(hex).replace('#', ''), 16);
  return [(value >> 16 & 255) / 255, (value >> 8 & 255) / 255, (value & 255) / 255];
}

export function cityMaterialClass(building) {
  const id = building.sourceId || building.id || 'building';
  const kind = String(building.tags?.building || '').toLowerCase();
  const hash = stableHash(id);
  if (['industrial', 'warehouse', 'garages'].includes(kind)) return 'building-industrial';
  if (['commercial', 'retail', 'office'].includes(kind)) return hash % 2 ? 'building-warm' : 'building-pale';
  return hash % 3 === 0 ? 'building-warm' : 'building-pale';
}

function paletteFamily(palette, materialClass) {
  if (materialClass === 'building-industrial') return palette.buildingIndustrial;
  if (materialClass === 'building-warm') return palette.buildingWarm;
  return palette.buildingPale;
}

export function buildingColorHex(building, palette) {
  const id = building.sourceId || building.id || 'building';
  const family = paletteFamily(palette, cityMaterialClass(building));
  return family[paletteHash(id) % family.length];
}

function buildingColor(building, palette) {
  return hexToRgb(buildingColorHex(building, palette));
}

function pushVertex(mesh, point, color) {
  mesh.vertices.push(point.x, point.y, point.z);
  mesh.colors.push(...color);
  return mesh.vertices.length / 3 - 1;
}

export function presetForLook(style, look) {
  const cartoon = style.cartoonMassing.presets.cartoon;
  const grotesque = style.cartoonMassing.presets.grotesque || cartoon;
  if (look === 'stacked') return { ...grotesque, stackMode: 'step' };
  if (look === 'grotesque') return { ...grotesque, stackMode: 'smooth' };
  return { ...cartoon, stackMode: 'smooth' };
}

export function buildStyledBuildingMesh(scene, style, look = 'grotesque') {
  const preset = presetForLook(style, look);
  const verticalSteps = Math.max(1, Math.floor(Number(preset.verticalSteps) || 1));
  const mesh = { vertices: [], colors: [], indices: [] };
  let sourceBuildings = 0;

  for (const building of scene.obstacles.buildings) {
    const { points, triangles } = triangulatePolygon(building.footprint);
    if (!triangles.length) continue;
    const bottom = Math.max(0, Number(building.minHeightM) || 0);
    const top = Math.max(bottom + 1.5, Math.min(60, Number(building.heightM) || 9.3));
    const bounds = {
      minY: bottom,
      maxY: top,
      h: Math.max(0.00001, top - bottom),
      cx: (Math.min(...points.map(point => point.x)) + Math.max(...points.map(point => point.x))) / 2,
      cz: (Math.min(...points.map(point => point.z)) + Math.max(...points.map(point => point.z))) / 2
    };
    const id = building.sourceId || building.id || `building-${sourceBuildings}`;
    const params = cityCartoonParams(id, preset, style.seed);
    const color = buildingColor(building, style.palette);
    const rings = [];
    for (let step = 0; step <= verticalSteps; step += 1) {
      const y = bottom + (top - bottom) * step / verticalSteps;
      rings.push(points.map(point => pushVertex(mesh, deformPoint({ x: point.x, y, z: point.z }, bounds, params), color)));
    }
    for (let step = 0; step < verticalSteps; step += 1) {
      for (let index = 0; index < points.length; index += 1) {
        const next = (index + 1) % points.length;
        mesh.indices.push(rings[step][index], rings[step + 1][index], rings[step][next]);
        mesh.indices.push(rings[step][next], rings[step + 1][index], rings[step + 1][next]);
      }
    }
    const roof = rings.at(-1);
    for (const [a, b, c] of triangles) mesh.indices.push(roof[a], roof[c], roof[b]);
    sourceBuildings += 1;
  }

  return {
    vertices: new Float32Array(mesh.vertices),
    colors: new Float32Array(mesh.colors),
    indices: new Uint32Array(mesh.indices),
    stats: {
      sourceBuildings,
      triangles: mesh.indices.length / 3,
      look,
      stackMode: preset.stackMode,
      paletteMode: 'CITY_LAB_PARITY',
      collisionGeometryDeformed: false
    }
  };
}


export function buildStyledBuildingContours(scene, style, look = 'grotesque', options = {}) {
  const preset = presetForLook(style, look);
  const focus = options.focus || { x: 0, z: 0 };
  const maxCount = Math.max(0, Math.floor(Number(options.maxCount ?? 72)));
  const lift = Number(options.lift ?? 0.025);
  const candidates = [];
  let sourceBuildings = 0;

  for (const building of scene.obstacles.buildings) {
    const { points, triangles } = triangulatePolygon(building.footprint);
    if (!triangles.length) continue;
    const bottom = Math.max(0, Number(building.minHeightM) || 0);
    const top = Math.max(bottom + 1.5, Math.min(60, Number(building.heightM) || 9.3));
    const bounds = {
      minY: bottom,
      maxY: top,
      h: Math.max(0.00001, top - bottom),
      cx: (Math.min(...points.map(point => point.x)) + Math.max(...points.map(point => point.x))) / 2,
      cz: (Math.min(...points.map(point => point.z)) + Math.max(...points.map(point => point.z))) / 2
    };
    const id = building.sourceId || building.id || `building-${sourceBuildings}`;
    const params = cityCartoonParams(id, preset, style.seed);
    const roof = points.map(point => {
      const out = deformPoint({ x: point.x, y: top, z: point.z }, bounds, params);
      return { x: out.x, y: out.y + lift, z: out.z };
    });
    const distanceM = Math.hypot(bounds.cx - focus.x, bounds.cz - focus.z);
    candidates.push({ id, points: roof, closed: true, role: 'building-roofline', distanceM });
    sourceBuildings += 1;
  }

  candidates.sort((a, b) => a.distanceM - b.distanceM);
  const contours = maxCount ? candidates.slice(0, maxCount) : candidates;
  return {
    contours,
    stats: {
      sourceBuildings,
      selectedContours: contours.length,
      look,
      stackMode: preset.stackMode,
      selection: maxCount ? 'NEAREST_TO_START' : 'ALL',
      presentationOnly: true
    }
  };
}
