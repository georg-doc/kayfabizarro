const EPSILON = 1e-7;

export const CITY_SCENE_SCHEMA = 'kfb.osm-city.consumer-scene.v0';

const finitePoint = point => point && Number.isFinite(point.x) && Number.isFinite(point.z);
const clamp01 = value => Math.max(0, Math.min(1, value));

export function validateCityScene(scene, expectedId = 'ehrenfeld-v0') {
  if (!scene || scene.schema !== CITY_SCENE_SCHEMA) throw new Error('Unsupported OSM City scene schema');
  if (scene.id !== expectedId) throw new Error(`Expected ${expectedId}, received ${scene.id}`);
  if (scene.frame?.units !== 'metre') throw new Error('OSM City receiver requires local metre coordinates');
  if (scene.ownerContract?.movementRule !== 'exactly one active movement writer; no City-Lab controller') {
    throw new Error('OSM City movement-owner contract changed');
  }
  if (!Array.isArray(scene.surfaces?.roads) || !Array.isArray(scene.obstacles?.buildings)) {
    throw new Error('OSM City road/building export is incomplete');
  }
  if (!Array.isArray(scene.anchors) || !scene.anchors.some(anchor => anchor.id === 'park-candidate')) {
    throw new Error('OSM City park anchor is missing');
  }
  return scene;
}

function cleanLine(points) {
  const clean = [];
  for (const point of points || []) {
    if (!finitePoint(point)) continue;
    const previous = clean.at(-1);
    if (!previous || Math.hypot(point.x - previous.x, point.z - previous.z) > EPSILON) {
      clean.push({ x: point.x, z: point.z });
    }
  }
  return clean;
}

function pushVertex(mesh, x, y, z) {
  mesh.vertices.push(x, y, z);
  return mesh.vertices.length / 3 - 1;
}

function appendRibbon(mesh, centerline, width, y = 0) {
  const points = cleanLine(centerline);
  if (points.length < 2 || !(width > 0)) return 0;
  let segments = 0;
  for (let index = 0; index < points.length - 1; index += 1) {
    const a = points[index];
    const b = points[index + 1];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const length = Math.hypot(dx, dz);
    if (length < EPSILON) continue;
    const ux = dx / length;
    const uz = dz / length;
    const px = -uz;
    const pz = ux;
    const half = width / 2;
    const extension = Math.min(1.1, width * 0.22, length * 0.2);
    const ax = a.x - ux * extension;
    const az = a.z - uz * extension;
    const bx = b.x + ux * extension;
    const bz = b.z + uz * extension;
    const leftA = pushVertex(mesh, ax + px * half, y, az + pz * half);
    const rightA = pushVertex(mesh, ax - px * half, y, az - pz * half);
    const leftB = pushVertex(mesh, bx + px * half, y, bz + pz * half);
    const rightB = pushVertex(mesh, bx - px * half, y, bz - pz * half);
    mesh.indices.push(leftA, leftB, rightA, rightA, leftB, rightB);
    segments += 1;
  }
  for (const point of points) {
    const center = pushVertex(mesh, point.x, y, point.z);
    const ring = [];
    for (let step = 0; step < 10; step += 1) {
      const angle = step / 10 * Math.PI * 2;
      ring.push(pushVertex(mesh, point.x + Math.cos(angle) * width / 2, y, point.z + Math.sin(angle) * width / 2));
    }
    for (let step = 0; step < ring.length; step += 1) {
      mesh.indices.push(center, ring[(step + 1) % ring.length], ring[step]);
    }
  }
  return segments;
}

export function buildRoadMesh(scene) {
  validateCityScene(scene, scene.id);
  const mesh = { vertices: [], indices: [] };
  const sourceIds = [];
  let segments = 0;
  for (const road of scene.surfaces.roads) {
    if (!road.driveable) continue;
    const count = appendRibbon(mesh, road.centerline, road.widthM, 0);
    if (!count) continue;
    segments += count;
    sourceIds.push(road.sourceId);
  }
  return {
    vertices: new Float32Array(mesh.vertices),
    indices: new Uint32Array(mesh.indices),
    stats: {
      sourceRoads: sourceIds.length,
      segments,
      triangles: mesh.indices.length / 3,
      sourceIds
    }
  };
}

export function buildSidewalkMesh(scene) {
  const mesh = { vertices: [], indices: [] };
  let sourceSidewalks = 0;
  for (const sidewalk of scene.surfaces.sidewalks || []) {
    const width = Math.max(0, sidewalk.roadWidthM || 0) + Math.max(0, sidewalk.bandWidthM || 0) * 2;
    if (appendRibbon(mesh, sidewalk.centerline, width, -0.035)) sourceSidewalks += 1;
  }
  return {
    vertices: new Float32Array(mesh.vertices),
    indices: new Uint32Array(mesh.indices),
    stats: { sourceSidewalks, triangles: mesh.indices.length / 3 }
  };
}

function cleanPolygon(points) {
  const polygon = cleanLine(points);
  if (polygon.length > 2 && Math.hypot(polygon[0].x - polygon.at(-1).x, polygon[0].z - polygon.at(-1).z) < EPSILON) {
    polygon.pop();
  }
  return polygon;
}

function signedArea(points) {
  let area = 0;
  for (let index = 0; index < points.length; index += 1) {
    const a = points[index];
    const b = points[(index + 1) % points.length];
    area += a.x * b.z - b.x * a.z;
  }
  return area / 2;
}

function cross(a, b, c) {
  return (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x);
}

function pointInTriangle(point, a, b, c) {
  const ab = cross(a, b, point);
  const bc = cross(b, c, point);
  const ca = cross(c, a, point);
  return ab >= -EPSILON && bc >= -EPSILON && ca >= -EPSILON;
}

export function triangulatePolygon(input) {
  const points = cleanPolygon(input);
  if (points.length < 3) return { points, triangles: [] };
  if (signedArea(points) < 0) points.reverse();
  const remaining = points.map((_, index) => index);
  const triangles = [];
  let guard = points.length * points.length;
  while (remaining.length > 3 && guard-- > 0) {
    let clipped = false;
    for (let cursor = 0; cursor < remaining.length; cursor += 1) {
      const previous = remaining[(cursor - 1 + remaining.length) % remaining.length];
      const current = remaining[cursor];
      const next = remaining[(cursor + 1) % remaining.length];
      if (cross(points[previous], points[current], points[next]) <= EPSILON) continue;
      const containsPoint = remaining.some(index => index !== previous && index !== current && index !== next
        && pointInTriangle(points[index], points[previous], points[current], points[next]));
      if (containsPoint) continue;
      triangles.push([previous, current, next]);
      remaining.splice(cursor, 1);
      clipped = true;
      break;
    }
    if (!clipped) break;
  }
  if (remaining.length === 3) triangles.push([...remaining]);
  if (triangles.length !== points.length - 2) {
    triangles.length = 0;
    for (let index = 1; index < points.length - 1; index += 1) triangles.push([0, index, index + 1]);
  }
  return { points, triangles };
}

export function buildPolygonMesh(entries, options = {}) {
  const mesh = { vertices: [], indices: [] };
  const y = options.y ?? -0.07;
  let sourcePolygons = 0;
  for (const entry of entries || []) {
    const { points, triangles } = triangulatePolygon(entry.polygon || entry.footprint);
    if (!triangles.length) continue;
    const base = mesh.vertices.length / 3;
    points.forEach(point => pushVertex(mesh, point.x, y, point.z));
    for (const [a, b, c] of triangles) mesh.indices.push(base + a, base + c, base + b);
    sourcePolygons += 1;
  }
  return {
    vertices: new Float32Array(mesh.vertices),
    indices: new Uint32Array(mesh.indices),
    stats: { sourcePolygons, triangles: mesh.indices.length / 3 }
  };
}

export function buildBuildingMesh(scene) {
  const mesh = { vertices: [], indices: [] };
  let sourceBuildings = 0;
  for (const building of scene.obstacles.buildings) {
    const { points, triangles } = triangulatePolygon(building.footprint);
    if (!triangles.length) continue;
    const bottom = Math.max(0, Number(building.minHeightM) || 0);
    const top = Math.max(bottom + 1.5, Math.min(60, Number(building.heightM) || 9.3));
    const lower = [];
    const upper = [];
    for (const point of points) {
      lower.push(pushVertex(mesh, point.x, bottom, point.z));
      upper.push(pushVertex(mesh, point.x, top, point.z));
    }
    for (let index = 0; index < points.length; index += 1) {
      const next = (index + 1) % points.length;
      mesh.indices.push(lower[index], upper[index], lower[next], lower[next], upper[index], upper[next]);
    }
    for (const [a, b, c] of triangles) mesh.indices.push(upper[a], upper[c], upper[b]);
    sourceBuildings += 1;
  }
  return {
    vertices: new Float32Array(mesh.vertices),
    indices: new Uint32Array(mesh.indices),
    stats: { sourceBuildings, triangles: mesh.indices.length / 3 }
  };
}

function segmentDistanceSquared(point, start, end) {
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const lengthSquared = dx * dx + dz * dz;
  const t = lengthSquared > EPSILON
    ? clamp01(((point.x - start.x) * dx + (point.z - start.z) * dz) / lengthSquared)
    : 0;
  const x = start.x + dx * t;
  const z = start.z + dz * t;
  return { distanceSquared: (point.x - x) ** 2 + (point.z - z) ** 2, start, end, t, x, z };
}

export function nearestDriveableRoad(scene, point, preferredSourceId = null) {
  let best = null;
  for (const road of scene.surfaces.roads) {
    if (!road.driveable || (preferredSourceId && road.sourceId !== preferredSourceId)) continue;
    const line = cleanLine(road.centerline);
    for (let index = 0; index < line.length - 1; index += 1) {
      const candidate = segmentDistanceSquared(point, line[index], line[index + 1]);
      if (!best || candidate.distanceSquared < best.distanceSquared) best = { ...candidate, road, segmentIndex: index };
    }
  }
  if (!best && preferredSourceId) return nearestDriveableRoad(scene, point);
  return best ? { ...best, distanceM: Math.sqrt(best.distanceSquared) } : null;
}

export function classifyDriveSurface(scene, point, marginM = 0.65) {
  const nearest = nearestDriveableRoad(scene, point);
  const halfWidth = Math.max(0, Number(nearest?.road?.widthM) || 0) / 2;
  const onMappedRoad = Boolean(nearest && nearest.distanceM <= halfWidth + Math.max(0, marginM));
  return {
    nearest,
    onMappedRoad,
    road: onMappedRoad ? nearest.road : {
      sourceId: 'receiver/urban-ground',
      class: 'urban-open-space',
      tags: { name: 'Freifläche', surface: 'urban-ground' }
    }
  };
}

export function resolveCityStart(scene, options = {}) {
  const anchorId = options.anchorId || 'park-candidate';
  const anchor = scene.anchors.find(item => item.id === anchorId);
  if (!anchor) throw new Error(`No ${anchorId} anchor found for the city start`);
  const sourceRoadId = options.sourceRoadId || anchor.headingSource || anchor.sourceRoadId;
  const nearest = nearestDriveableRoad(scene, anchor.local, sourceRoadId);
  if (!nearest) throw new Error(`No driveable road found for the ${anchorId} anchor`);
  let dx = nearest.end.x - nearest.start.x;
  let dz = nearest.end.z - nearest.start.z;
  let headingSource = 'nearest-road';
  if (options.corridorDirection && Array.isArray(scene.corridor?.route) && scene.corridor.route.length > 1) {
    const route = scene.corridor.route;
    const reverse = options.corridorDirection === 'reverse';
    const from = reverse ? route.at(-1) : route[0];
    const to = reverse ? route.at(-2) : route[1];
    if (finitePoint(from) && finitePoint(to)) {
      dx = to.x - from.x;
      dz = to.z - from.z;
      headingSource = reverse ? 'corridor-route-reverse' : 'corridor-route-forward';
    }
  }
  return {
    p: [nearest.x, 1.2, nearest.z],
    yaw: Math.atan2(dx, dz),
    anchorId: anchor.id,
    sourceRoadId: nearest.road.sourceId,
    anchorOffsetM: nearest.distanceM,
    headingSource
  };
}

export function createSoundFacts({ physical, signedForwardSpeed, driveInput, road }) {
  const speed = Math.abs(Number(signedForwardSpeed) || 0);
  const contacts = physical?.contacts?.filter(Boolean).length || 0;
  const slip = Math.abs(Number(physical?.slip) || 0);
  const throttle = Math.abs(Number(driveInput?.throttle) || 0);
  const tireEnergy = clamp01((slip - 1.2) / 6.5);
  return {
    schema: 'kfb.vehicle-sound-facts.v0',
    engineLoad: clamp01((speed > 0.2 ? 0.16 + speed / 90 : 0) + throttle * (0.35 + speed / 35)),
    wind: clamp01(speed / 27),
    tireSlip: tireEnergy,
    tireSqueal: contacts >= 2 && speed > 3 && (physical?.drifting || slip > 2.4),
    airborne: contacts === 0,
    contactCount: contacts,
    roadSurface: road?.tags?.surface || 'unknown',
    roadClass: road?.class || 'unknown',
    recentEvents: (physical?.events || []).slice(-4).map(event => event.type)
  };
}
