/* KFB CLAY-CITY-MVP-01 · orchestrator
   Mounts on the accepted World M2A R6 host (World r2/WB2 terrain, H0 clay, mobility, Drive, Flight).
   Replaces only presentation + collision of the active tile:
   · OSM building extrusions, far shells, facade details and the canvas road map → hidden;
   · clean continuous clay ground on the WB2 tile and the far ground (same colour, no seam);
   · geometric clay road (clay-road.mjs) from the OSM road graph;
   · T4 Knet-Strecke segment (t4-segment.mjs): Track Core TD03 window, one rigid placement at a city road;
   · deterministic Kit district (kit-district.mjs) — render and collision from one recipe;
   · Drive: the OSM-building trimesh leaves the physics world; Kit boxes + T4 deck/strang join it; ground box stays;
   · Walker: world.groundAt / solidAt / buildingAt answer from the same Kit recipes + road surface.
   No owner is replaced: terrain height = app.terrainHeightAt, movement = World r2 play / Race PR10 drive. */
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import { makeClayRelief } from '../world-drive-interact-m2a/h0-clay/clay-relief.v2.js';
import { makeClayUniforms, makeClayMaterial, seedGeometry } from '../world-drive-interact-m2a/h0-clay/clay-material.v4.js';
import { buildClayRoad, ROAD_RULE } from './clay-road.mjs';
import { DISTRICT_RULE, planDistrict, loadArchetypes, buildDistrict, districtCollision } from './kit-district.mjs';
import { loadT4, windowPolyline, makePlacement, buildT4Segment, SEGMENT, T4_PIN, T4_DIR } from './t4-segment.mjs';

export const CLAY_CITY = Object.freeze({ id: 'CLAY-CITY-MVP-01', tileHalfM: 92, roadHalfM: 122, ground: '#86a85a' });

function clayUniforms() {
  const relief = makeClayRelief({ size: 512, seed: 43129, density: 0.78 });
  const t = new THREE.DataTexture(relief.data, relief.size, relief.size, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = true; t.needsUpdate = true;
  const U = makeClayUniforms(THREE, t);
  U.uClayTile.value = 1.75; U.uClayStroke.value = 0.48; U.uClayGrain.value = 0.13; U.uClayMacro.value = 0.42; U.uClayFacet.value = 0.1; U.uClayCrease.value = 0.5;
  return U;
}

function cleanGround(app, hex) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 64;
  const c = cv.getContext('2d'); c.fillStyle = hex; c.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.name = 'clay-city clean ground';
  const touched = [];
  const setMap = (m) => { if (!m) return; for (const x of [].concat(m)) { if ('map' in x && x.map) { x.map = tex; x.needsUpdate = true; touched.push(x.name || x.type); } } };
  setMap(app.terrain.material); setMap(app.terrain.userData.kfbSrcMat);
  const far = app.scene.getObjectByName('far-ground');
  if (far) for (const x of [].concat(far.material, far.userData.kfbSrcMat || [])) if (x?.color) { x.color.set(hex); touched.push('far:' + (x.name || x.type)); }
  return touched;
}

function hideOsmCity(city) {
  const hidden = [];
  for (const o of city.group.children) if (!/^fluid/.test(o.name)) { o.visible = false; hidden.push(o.name || o.type); }
  return hidden;
}

/* Track placement: the TD03 window starts 1.5 m behind a city sidewalk, heading away from the road.
   Candidates along every drive road of the tile, both sides, ±14° jitter. Reject any other drive road inside the
   corridor; penalise foot-path crossings; prefer corridor inside the tile and a start near the centre. */
function findTrackPlacement({ win, zone, road, tileRect, reserved }) {
  const W = ROAD_RULE.width, SW = road.sidewalkM, cx = (tileRect.minX + tileRect.maxX) / 2, cz = (tileRect.minZ + tileRect.maxZ) / 2;
  const t0 = Math.atan2(win.T0[0], win.T0[2]);
  let best = null, tried = 0;
  for (const r of zone.roads) {
    const w = W[r.cls]; if (!w || r.tunnel === 'yes' || r.layer < 0 || !r.line || r.line.length < 2) continue;
    const hw = w / 2;
    for (let i = 1; i < r.line.length; i++) {
      const a = r.line[i - 1], b = r.line[i], L = Math.hypot(b.x - a.x, b.z - a.z); if (L < 8) continue;
      const tx = (b.x - a.x) / L, tz = (b.z - a.z) / L;
      for (let t = 4; t < L - 4; t += 6) {
        const px = a.x + tx * t, pz = a.z + tz * t;
        if (px < tileRect.minX + 10 || px > tileRect.maxX - 10 || pz < tileRect.minZ + 10 || pz > tileRect.maxZ - 10) continue;
        for (const side of [1, -1]) {
          const nx = -tz * side, nz = tx * side, sx = px + nx * (hw + SW + 1.5), sz = pz + nz * (hw + SW + 1.5);
          if (reserved.some((q) => Math.hypot(q.x - sx, q.z - sz) < q.r + 10)) continue;
          for (const jit of [0, -0.12, 0.12, -0.24, 0.24]) {
            tried++;
            const heading = Math.atan2(nx, nz) + jit, th = heading - t0, c = Math.cos(th), s = Math.sin(th);
            let inside = 0, foot = 0, ok = true;
            for (const q of win.pts) {
              const dx = q.x - win.p0[0], dz = q.z - win.p0[2], x = sx + dx * c + dz * s, z = sz - dx * s + dz * c, along = q.s - win.pts[0].s;
              if (x > tileRect.minX && x < tileRect.maxX && z > tileRect.minZ && z < tileRect.maxZ) inside++;
              if (along < 8) continue;
              if (road.dDrive(x, z, 50) < q.hw + 2) { ok = false; break; }
              if (road.dFoot(x, z, 50) < q.hw) foot++;
              if (reserved.some((rr) => Math.hypot(rr.x - x, rr.z - z) < rr.r + q.hw)) { ok = false; break; }
            }
            if (!ok) continue;
            const frac = inside / win.pts.length, score = 100 * frac - 6 * foot - 0.25 * Math.hypot(sx - cx, sz - cz) - 8 * Math.abs(jit);
            if (!best || score > best.score) best = { x: sx, z: sz, heading, score, insideFrac: +frac.toFixed(2), footCrossSamples: foot, road: r.name || r.cls, roadId: r.id, jitterRad: jit };
          }
        }
      }
    }
  }
  return best ? { ...best, candidates: tried } : { failed: true, candidates: tried };
}

function swapDriveCollision(drive, parts) {
  const world = drive.physics.world, removed = [];
  const list = []; world.forEachCollider((c) => { if (!c.parent() && c.shape.type === RAPIER.ShapeType.TriMesh) list.push(c); });
  for (const c of list) { removed.push(c.handle); world.removeCollider(c, true); }
  const added = {};
  for (const [id, m] of Object.entries(parts)) if (m && m.indices.length) { world.createCollider(RAPIER.ColliderDesc.trimesh(m.vertices, m.indices).setFriction(0.8)); added[id] = m.indices.length / 3; }
  world.updateSceneQueries();
  return { removedOsmTrimesh: removed.length, addedTriangles: added };
}

export async function mountClayCity({ app, mobility }) {
  const t0 = performance.now(), ms = {};
  const W = app.world, tile = W.tile, H = (x, z) => app.terrainHeightAt(x, z);
  const rectOf = (h) => ({ minX: tile.cx - h, maxX: tile.cx + h, minZ: tile.cz - h, maxZ: tile.cz + h });
  const tileRect = rectOf(CLAY_CITY.tileHalfM), roadRect = rectOf(CLAY_CITY.roadHalfM);

  /* start the network loads first */
  const U = clayUniforms();
  const makeMaterial = (src) => makeClayMaterial(THREE, U, { src, role: 'world', proc: false, reliefK: 0.55, scale: 2.45 });
  const archP = loadArchetypes({ makeMaterial, seedGeometry: (g, s) => seedGeometry(THREE, g, s) });
  const t4P = loadT4().catch((e) => ({ error: e }));

  const hidden = hideOsmCity(W.city);
  const ground = cleanGround(app, CLAY_CITY.ground);

  /* road */
  let t = performance.now();
  const road = buildClayRoad({ zone: W.zone, rect: roadRect, heightAt: H });
  seedGeometry(THREE, road.top, 7001); seedGeometry(THREE, road.skirt, 7002);
  const roadMat = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ vertexColors: true, name: 'clay-road' }), role: 'world', proc: false, reliefK: 0.8, scale: 1.35 });
  const skirtMat = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, name: 'clay-kerb' }), role: 'world', proc: false, reliefK: 0.6, scale: 1.35 });
  const roadGroup = new THREE.Group(); roadGroup.name = 'CLAY-CITY · geometric clay road';
  const roadMesh = new THREE.Mesh(road.top, roadMat), kerbMesh = new THREE.Mesh(road.skirt, skirtMat);
  roadMesh.receiveShadow = kerbMesh.receiveShadow = true; roadMesh.name = 'clay-road:top'; kerbMesh.name = 'clay-road:kerb-skirt';
  roadGroup.add(roadMesh, kerbMesh); app.scene.add(roadGroup);
  ms.road = Math.round(performance.now() - t);

  /* reserved: player spawn + parked car */
  const drive = mobility?.drive;
  const reserved = [{ x: W.spawn.x, z: W.spawn.z, r: 9, id: 'spawn' }];
  if (drive?.position) reserved.push({ x: drive.position.x, z: drive.position.z, r: 8, id: 'car' });

  /* T4 track segment */
  t = performance.now();
  let track = null, trackReport = { status: 'T4_SOURCE_REQUIRED' };
  const L = await t4P;
  if (L && !L.error) {
    try {
      const win = windowPolyline(L.td);
      const place = findTrackPlacement({ win, zone: W.zone, road, tileRect, reserved });
      if (place.failed) trackReport = { status: 'TRACK_PLACEMENT_FAILED', candidates: place.candidates };
      else {
        const placement = makePlacement(win, place.x, place.z, place.heading, H(place.x, place.z));
        track = buildT4Segment({ L, placement, reliefTex: U.uClayRelief.value, deferMarkings: true });
        app.scene.add(track.group);
        track.path = win.pts.map((q) => ({ s: q.s, hw: q.hw, ...placement.apply([q.x, q.y, q.z]) }));
        for (const q of track.path) reserved.push({ x: q.x, z: q.z, r: q.hw + 3, id: 'track' });
        trackReport = { status: 'BUILT', source: { repo: 'georg-doc/kayfabizarro', pin: T4_PIN, dir: T4_DIR, stream: L.td.core + ' ' + L.td.id, fingerprint: L.td.fingerprint }, window: SEGMENT, placement: place, loadMs: L.loadMs, ...track.info };
      }
    } catch (e) { trackReport = { status: 'TRACK_BUILD_ERROR', error: String(e.message || e) }; }
  } else trackReport = { status: 'T4_SOURCE_REQUIRED', error: String(L?.error?.message || L?.error) };
  ms.track = Math.round(performance.now() - t);

  /* district */
  t = performance.now();
  const { measured, meshes } = await archP;
  ms.donors = Math.round(performance.now() - t); t = performance.now();
  const plan = planDistrict({ zone: W.zone, rect: tileRect, road, heightAt: H, reserved, widths: ROAD_RULE.width });
  const padMat = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#cdb088', name: 'clay-foundation' }), role: 'world', proc: false, reliefK: 0.7, scale: 1.35 });
  const signMat = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#fff1d6', name: 'clay-sign-socket' }), role: 'world', proc: false, reliefK: 0.6, scale: 1.35 });
  const district = buildDistrict({ plan, meshes, padMaterial: padMat, signMaterial: signMat, seedGeometry: (g, s) => seedGeometry(THREE, g, s) });
  app.scene.add(district.group);
  const coll = districtCollision(plan);
  ms.district = Math.round(performance.now() - t);

  /* walker + world queries from the same recipes */
  const orig = { groundAt: W.groundAt, solidAt: W.solidAt, buildingAt: W.buildingAt };
  W.groundAt = (x, z, th) => {
    const b = coll.at(x, z, 0.35);
    if (b) return coll.at(x, z, 0) ? b.baseY + b.h : b.baseY;
    return th + road.surfaceAt(x, z);
  };
  W.solidAt = (x, z) => { const b = coll.at(x, z, 0); return b ? b.baseY + b.h : 0; };
  W.buildingAt = (x, z) => coll.at(x, z, 0);

  const physics = drive ? swapDriveCollision(drive, { kit: coll, t4Deck: track?.contact.deck, t4Strang: track?.contact.strang }) : null;

  const report = () => ({
    schema: 'kfb.clay-city-mvp-01/1', id: CLAY_CITY.id,
    tile: { cx: tile.cx, cz: tile.cz, sizeM: CLAY_CITY.tileHalfM * 2 }, roadRectM: CLAY_CITY.roadHalfM * 2,
    osmHidden: hidden, groundMaterials: ground,
    road: road.report, track: track ? { ...trackReport, ...track.info } : trackReport, district: plan.report, donors: measured.map((d) => ({ id: d.id, tris: d.triangles, sizeM: d.sizeM })),
    instanced: district.instanced, drawCalls: { city: district.drawCalls, road: 2, track: track ? track.info.drawCalls : 0 }, physics,
    owners: { terrainHeight: 'app.terrainHeightAt (WB2)', walker: 'World r2 play via world.groundAt adapter', drive: 'Race PR10 FREE_ROAM_C0 (ground box unchanged)', visibleCity: 'Kit recipes (' + DISTRICT_RULE.id + ')', road: ROAD_RULE.id, trackVisual: 'KFB Knet-Strecke T4', trackContact: 'Track Core TD03 (rigid placement only)' },
    mountMs: Math.round(performance.now() - t0), stepMs: ms
  });
  /* M2 markings after the first playable frames (≈1.5 s of CPU on the full TD03 stream) */
  if (track?.addMarkings) setTimeout(() => { try { track.addMarkings(); } catch (e) { trackReport.errors?.push('deferred markings: ' + e.message); } }, 1500);
  const api = { road, plan, district, coll, track, uniforms: U, report, restore() { Object.assign(W, orig); } };
  window.__clayCity = api;
  return api;
}
