import * as THREE_NS from 'three';

const INK_COLOR = 0x1f1a14;

function stableHash(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function cleanPoints(points, closed) {
  const out = [];
  for (const point of points || []) {
    const p = Array.isArray(point)
      ? { x: Number(point[0]), y: Number(point[1]), z: Number(point[2]) }
      : { x: Number(point.x), y: Number(point.y), z: Number(point.z) };
    if (![p.x, p.y, p.z].every(Number.isFinite)) continue;
    const previous = out.at(-1);
    if (!previous || Math.hypot(p.x - previous.x, p.y - previous.y, p.z - previous.z) > 1e-5) out.push(p);
  }
  if (closed && out.length > 2) {
    const a = out[0], b = out.at(-1);
    if (Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) < 1e-5) out.pop();
  }
  return out;
}

function roleProfile(role) {
  if (role === 'building-roofline') return { inkM: 0.055, bendPx: 2.5, jitterM: 0.018, liftM: 0 };
  if (role === 'road-edge') return { inkM: 0.085, bendPx: 3.0, jitterM: 0.035, liftM: 0 };
  return { inkM: 0.11, bendPx: 3.5, jitterM: 0.055, liftM: 0 };
}

function contourMetrics(points, closed, seed, role, torn = false) {
  const n = points.length;
  const cumulative = new Float32Array(n);
  for (let i = 1; i < n; i += 1) {
    const a = points[i - 1], b = points[i];
    cumulative[i] = cumulative[i - 1] + Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
  }
  const total = cumulative[n - 1] + (closed && n > 1
    ? Math.hypot(points[0].x - points[n - 1].x, points[0].y - points[n - 1].y, points[0].z - points[n - 1].z)
    : 0);
  const profile = roleProfile(role);
  const h = stableHash(seed);
  const phase1 = (h % 6283) / 1000;
  const phase2 = ((h >>> 8) % 6283) / 1000;
  const longPeriod = Math.max(5, total * (torn ? 0.07 : 0.16));
  const shortPeriod = Math.max(1.7, total * (torn ? 0.025 : 0.055));
  const pointsOut = points.map((point, i) => {
    const prev = points[closed ? (i - 1 + n) % n : Math.max(0, i - 1)];
    const next = points[closed ? (i + 1) % n : Math.min(n - 1, i + 1)];
    let tx = next.x - prev.x, tz = next.z - prev.z;
    const tl = Math.hypot(tx, tz) || 1;
    tx /= tl; tz /= tl;
    const nx = -tz, nz = tx;
    const s = cumulative[i];
    const jitterScale = torn ? 2.4 : 1;
    const jitter = profile.jitterM * jitterScale * (
      0.72 * Math.sin(s / longPeriod * Math.PI * 2 + phase1)
      + 0.28 * Math.sin(s / shortPeriod * Math.PI * 2 + phase2)
    );
    const widthMod = Math.max(0.46, 1
      + (torn ? 0.48 : 0.28) * Math.sin(s / longPeriod * Math.PI * 2 + phase2)
      + (torn ? 0.22 : 0.12) * Math.sin(s / shortPeriod * Math.PI * 2 + phase1));
    return {
      x: point.x + nx * jitter,
      y: point.y + profile.liftM,
      z: point.z + nz * jitter,
      widthMod
    };
  });
  return { points: pointsOut, total, profile };
}

function appendWorldRibbon(batch, contour, torn = false) {
  const points0 = cleanPoints(contour.points, contour.closed);
  const closed = Boolean(contour.closed);
  if (points0.length < (closed ? 3 : 2)) return;
  const seed = contour.seed ?? stableHash(contour.id || contour.role || 'ink');
  const { points, profile } = contourMetrics(points0, closed, seed, contour.role, torn);
  const n = points.length;
  const base = batch.positions.length / 3;
  for (let i = 0; i < n; i += 1) {
    const prev = points[closed ? (i - 1 + n) % n : Math.max(0, i - 1)];
    const cur = points[i];
    const next = points[closed ? (i + 1) % n : Math.min(n - 1, i + 1)];
    let d1x = cur.x - prev.x, d1z = cur.z - prev.z;
    let d2x = next.x - cur.x, d2z = next.z - cur.z;
    const l1 = Math.hypot(d1x, d1z) || 1;
    const l2 = Math.hypot(d2x, d2z) || 1;
    d1x /= l1; d1z /= l1; d2x /= l2; d2z /= l2;
    const n1x = -d1z, n1z = d1x, n2x = -d2z, n2z = d2x;
    let mx = n1x + n2x, mz = n1z + n2z;
    const ml = Math.hypot(mx, mz) || 1;
    mx /= ml; mz /= ml;
    const miter = 1 / Math.max(0.45, mx * n1x + mz * n1z);
    const half = profile.inkM * cur.widthMod * (torn ? 1.25 : 1) * miter;
    batch.positions.push(cur.x + mx * half, cur.y, cur.z + mz * half);
    batch.positions.push(cur.x - mx * half, cur.y, cur.z - mz * half);
  }
  const segments = closed ? n : n - 1;
  for (let i = 0; i < segments; i += 1) {
    const j = (i + 1) % n;
    const a = base + i * 2, b = a + 1, c = base + j * 2, d = c + 1;
    batch.indices.push(a, b, c, c, b, d);
  }
  batch.contours += 1;
}

function appendScreenRibbon(batch, contour) {
  const points0 = cleanPoints(contour.points, contour.closed);
  const closed = Boolean(contour.closed);
  if (points0.length < (closed ? 3 : 2)) return;
  const seed = contour.seed ?? stableHash(contour.id || contour.role || 'bend');
  const { points, profile } = contourMetrics(points0, closed, seed, contour.role, false);
  const n = points.length;
  const base = batch.positions.length / 3;
  for (let i = 0; i < n; i += 1) {
    const prev = points[closed ? (i - 1 + n) % n : Math.max(0, i - 1)];
    const cur = points[i];
    const next = points[closed ? (i + 1) % n : Math.min(n - 1, i + 1)];
    for (const side of [-1, 1]) {
      batch.positions.push(cur.x, cur.y, cur.z);
      batch.previous.push(prev.x, prev.y, prev.z);
      batch.next.push(next.x, next.y, next.z);
      batch.side.push(side);
      batch.width.push(profile.bendPx * cur.widthMod);
    }
  }
  const segments = closed ? n : n - 1;
  for (let i = 0; i < segments; i += 1) {
    const j = (i + 1) % n;
    const a = base + i * 2, b = a + 1, c = base + j * 2, d = c + 1;
    batch.indices.push(a, b, c, c, b, d);
  }
  batch.contours += 1;
}

function makeWorldMesh(THREE, contours, torn = false) {
  const batch = { positions: [], indices: [], contours: 0 };
  contours.forEach(contour => appendWorldRibbon(batch, contour, torn));
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(batch.positions, 3));
  geometry.setIndex(batch.indices);
  geometry.computeBoundingSphere();
  const material = new THREE.MeshBasicMaterial({
    color: INK_COLOR,
    side: THREE.DoubleSide,
    depthTest: true,
    depthWrite: false,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 30;
  mesh.userData.contours = batch.contours;
  return mesh;
}

function makeBendMesh(THREE, contours) {
  const batch = { positions: [], previous: [], next: [], side: [], width: [], indices: [], contours: 0 };
  contours.forEach(contour => appendScreenRibbon(batch, contour));
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(batch.positions, 3));
  geometry.setAttribute('previous', new THREE.Float32BufferAttribute(batch.previous, 3));
  geometry.setAttribute('next', new THREE.Float32BufferAttribute(batch.next, 3));
  geometry.setAttribute('side', new THREE.Float32BufferAttribute(batch.side, 1));
  geometry.setAttribute('widthPx', new THREE.Float32BufferAttribute(batch.width, 1));
  geometry.setIndex(batch.indices);
  geometry.computeBoundingSphere();

  const uniforms = { uResolution: { value: new THREE.Vector2(1, 1) }, uColor: { value: new THREE.Color(INK_COLOR) } };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      attribute vec3 previous;
      attribute vec3 next;
      attribute float side;
      attribute float widthPx;
      uniform vec2 uResolution;
      void main() {
        vec4 curClip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vec4 prevClip = projectionMatrix * modelViewMatrix * vec4(previous, 1.0);
        vec4 nextClip = projectionMatrix * modelViewMatrix * vec4(next, 1.0);
        vec2 cur = curClip.xy / max(curClip.w, 1e-6);
        vec2 prv = prevClip.xy / max(prevClip.w, 1e-6);
        vec2 nxt = nextClip.xy / max(nextClip.w, 1e-6);
        vec2 d1 = normalize(cur - prv + vec2(1e-7));
        vec2 d2 = normalize(nxt - cur + vec2(1e-7));
        vec2 tangent = normalize(d1 + d2 + vec2(1e-7));
        vec2 normal = vec2(-tangent.y, tangent.x);
        vec2 n1 = vec2(-d1.y, d1.x);
        float miter = 1.0 / max(dot(normal, n1), 0.5);
        vec2 ndcOffset = normal * side * widthPx * miter * 2.0 / max(uResolution, vec2(1.0));
        curClip.xy += ndcOffset * curClip.w;
        gl_Position = curClip;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      void main() { gl_FragColor = vec4(uColor, 1.0); }
    `,
    side: THREE.DoubleSide,
    depthTest: true,
    depthWrite: false,
    toneMapped: false
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 31;
  mesh.userData.contours = batch.contours;
  mesh.userData.uniforms = uniforms;
  return mesh;
}

function offsetPolyline(line, offset, y, role, id) {
  const points = cleanPoints(line.map(point => ({ x: point.x, y, z: point.z })), false);
  if (points.length < 2) return null;
  return {
    id,
    role,
    closed: false,
    points: points.map((point, i) => {
      const prev = points[Math.max(0, i - 1)];
      const next = points[Math.min(points.length - 1, i + 1)];
      let tx = next.x - prev.x, tz = next.z - prev.z;
      const tl = Math.hypot(tx, tz) || 1;
      tx /= tl; tz /= tl;
      return { x: point.x - tz * offset, y: point.y, z: point.z + tx * offset };
    })
  };
}

export function createOsmInkContours({ city, buildingContours = [], depth }) {
  const contours = [];
  for (const entry of city.surfaces.landuse || []) {
    const points = entry.polygon || entry.footprint;
    if (!Array.isArray(points) || points.length < 3) continue;
    contours.push({
      id: `landuse:${entry.sourceId || contours.length}`,
      role: 'landuse-edge',
      closed: true,
      points: points.map(point => ({ x: point.x, y: depth.landuseY + 0.012, z: point.z }))
    });
  }
  for (const road of city.surfaces.roads || []) {
    if (!road.driveable || !Array.isArray(road.centerline) || road.centerline.length < 2) continue;
    const half = Math.max(1, Number(road.widthM) || 0) / 2;
    const left = offsetPolyline(road.centerline, half, depth.roadY + 0.018, 'road-edge', `road-left:${road.sourceId}`);
    const right = offsetPolyline(road.centerline, -half, depth.roadY + 0.018, 'road-edge', `road-right:${road.sourceId}`);
    if (left) contours.push(left);
    if (right) contours.push(right);
  }
  for (const contour of buildingContours) {
    contours.push({
      id: `building:${contour.id}`,
      role: 'building-roofline',
      closed: true,
      points: contour.points
    });
  }
  contours.forEach(contour => { contour.seed = stableHash(contour.id); });
  return contours;
}

export function createInkWorldAdapter(THREE = THREE_NS, { scene, renderer, contours, initialMode = 'off' }) {
  const group = new THREE.Group();
  group.name = 'KFB_INK_WORLD_ADAPTER';
  const inkMesh = makeWorldMesh(THREE, contours, false);
  const tornMesh = makeWorldMesh(THREE, contours, true);
  const bendMesh = makeBendMesh(THREE, contours);
  group.add(inkMesh, tornMesh, bendMesh);
  scene.add(group);
  let mode = 'off';

  function resize() {
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    bendMesh.userData.uniforms.uResolution.value.copy(size);
  }

  function setMode(next) {
    mode = ['off', 'ink', 'bend', 'torn'].includes(next) ? next : 'off';
    inkMesh.visible = mode === 'ink';
    bendMesh.visible = mode === 'bend';
    tornMesh.visible = mode === 'torn';
    return mode;
  }

  function snapshot() {
    return {
      mode,
      schema: 'kfb.ink-world-adapter/te01',
      color: '#1f1a14',
      contourCount: contours.length,
      inkContours: inkMesh.userData.contours,
      bendContours: bendMesh.userData.contours,
      tornContours: tornMesh.userData.contours,
      seedBinding: 'OBJECT_ROUTE_ARCLENGTH_STABLE',
      gameplayOwner: 'RACE_OSM_UNCHANGED',
      presentationOnly: true
    };
  }

  function dispose() {
    scene.remove(group);
    for (const mesh of [inkMesh, bendMesh, tornMesh]) {
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
  }

  resize();
  setMode(initialMode);
  return { group, setMode, resize, snapshot, dispose };
}
