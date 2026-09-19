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
    seed: stableHash(`${seedRoot}:${id}`)
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
  const offsets = params.stackOffsets || [];
  const offsetIndex = offsets.length > 1
    ? Math.min(offsets.length - 1, Math.max(0, Math.round(t * (offsets.length - 1))))
    : 0;
  const offset = offsets[offsetIndex] || { x: 0, z: 0 };
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

function buildingColor(building, palette, seedRoot) {
  const id = building.sourceId || building.id || 'building';
  const buildingTag = String(building.tags?.building || building.class || '').toLowerCase();
  const industrial = /industrial|commercial|warehouse|office/.test(buildingTag);
  const family = industrial
    ? palette.buildingIndustrial
    : stableHash(`${seedRoot}:family:${id}`) % 3 === 0 ? palette.buildingPale : palette.buildingWarm;
  return hexToRgb(family[stableHash(`${seedRoot}:color:${id}`) % family.length]);
}

function pushVertex(mesh, point, color) {
  mesh.vertices.push(point.x, point.y, point.z);
  mesh.colors.push(...color);
  return mesh.vertices.length / 3 - 1;
}

export function buildStyledBuildingMesh(scene, style, look = 'grotesque') {
  const preset = style.cartoonMassing.presets[look] || style.cartoonMassing.presets.cartoon;
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
    const color = buildingColor(building, style.palette, style.seed);
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
    stats: { sourceBuildings, triangles: mesh.indices.length / 3, look, collisionGeometryDeformed: false }
  };
}
