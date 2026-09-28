/* KFB CLAY-CITY-MVP-01 · orchestrator
   Mounts on the accepted World M2A R6 host (World r2/WB2 terrain, H0 clay, mobility, Drive, Flight).
   Replaces only presentation + collision of the active tile:
   · OSM building extrusions, far shells, facade details and the canvas road map → hidden;
   · clean continuous clay ground on the WB2 tile and the far ground (same colour, no seam);
   · geometric clay road (clay-road.mjs) from the OSM road graph;
   · deterministic Kit district (kit-district.mjs) — render and collision from one recipe;
   · Drive: the OSM-building trimesh leaves the physics world, the Kit boxes join it; ground box stays;
   · Walker: world.groundAt / solidAt / buildingAt answer from the same Kit recipes + road surface.
   No owner is replaced: terrain height = app.terrainHeightAt, movement = World r2 play / Race PR10 drive. */
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import { makeClayRelief } from '../world-drive-interact-m2a/h0-clay/clay-relief.v2.js';
import { makeClayUniforms, makeClayMaterial, seedGeometry } from '../world-drive-interact-m2a/h0-clay/clay-material.v4.js';
import { buildClayRoad, ROAD_RULE } from './clay-road.mjs';
import { DISTRICT_RULE, planDistrict, loadArchetypes, buildDistrict, districtCollision } from './kit-district.mjs';

export const CLAY_CITY = Object.freeze({ id: 'CLAY-CITY-MVP-01', tileHalfM: 92, roadHalfM: 122, ground: '#86a85a' });

function clayUniforms() {
  const relief = makeClayRelief({ size: 512, seed: 43129, density: 0.78 });
  const t = new THREE.DataTexture(relief.data, relief.size, relief.size, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = true; t.needsUpdate = true;
  const U = makeClayUniforms(THREE, t);
  Object.assign(U, {}); U.uClayTile.value = 1.75; U.uClayStroke.value = 0.48; U.uClayGrain.value = 0.13; U.uClayMacro.value = 0.42; U.uClayFacet.value = 0.1; U.uClayCrease.value = 0.5;
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

function swapDriveCollision(drive, kit) {
  const world = drive.physics.world, removed = [];
  const list = []; world.forEachCollider((c) => { if (!c.parent() && c.shape.type === RAPIER.ShapeType.TriMesh) list.push(c); });
  for (const c of list) { removed.push(c.handle); world.removeCollider(c, true); }
  const added = world.createCollider(RAPIER.ColliderDesc.trimesh(kit.vertices, kit.indices).setFriction(0.8));
  world.updateSceneQueries();
  return { removedOsmTrimesh: removed.length, kitTriangles: kit.indices.length / 3, kitCollider: added.handle };
}

export async function mountClayCity({ app, mobility }) {
  const t0 = performance.now();
  const W = app.world, tile = W.tile, H = (x, z) => app.terrainHeightAt(x, z);
  const rectOf = (h) => ({ minX: tile.cx - h, maxX: tile.cx + h, minZ: tile.cz - h, maxZ: tile.cz + h });
  const tileRect = rectOf(CLAY_CITY.tileHalfM), roadRect = rectOf(CLAY_CITY.roadHalfM);

  const hidden = hideOsmCity(W.city);
  const ground = cleanGround(app, CLAY_CITY.ground);
  const U = clayUniforms();

  /* road */
  const road = buildClayRoad({ zone: W.zone, rect: roadRect, heightAt: H });
  seedGeometry(THREE, road.top, 7001); seedGeometry(THREE, road.skirt, 7002);
  const roadMat = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ vertexColors: true, name: 'clay-road' }), role: 'world', proc: false, reliefK: 0.8, scale: 1.35 });
  const skirtMat = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, name: 'clay-kerb' }), role: 'world', proc: false, reliefK: 0.6, scale: 1.35 });
  const roadGroup = new THREE.Group(); roadGroup.name = 'CLAY-CITY · geometric clay road';
  const roadMesh = new THREE.Mesh(road.top, roadMat), kerbMesh = new THREE.Mesh(road.skirt, skirtMat);
  roadMesh.receiveShadow = kerbMesh.receiveShadow = true; roadMesh.name = 'clay-road:top'; kerbMesh.name = 'clay-road:kerb-skirt';
  roadGroup.add(roadMesh, kerbMesh); app.scene.add(roadGroup);

  /* district */
  const drive = mobility?.drive;
  const reserved = [{ x: W.spawn.x, z: W.spawn.z, r: 9 }];
  if (drive?.position) reserved.push({ x: drive.position.x, z: drive.position.z, r: 8 });
  const makeMaterial = (src) => makeClayMaterial(THREE, U, { src, role: 'world', proc: false, reliefK: 0.55, scale: 2.45 });
  const { measured, meshes } = await loadArchetypes({ makeMaterial, seedGeometry: (g, s) => seedGeometry(THREE, g, s) });
  const plan = planDistrict({ zone: W.zone, rect: tileRect, road, heightAt: H, reserved, widths: ROAD_RULE.width });
  const padMat = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#cdb088', name: 'clay-foundation' }), role: 'world', proc: false, reliefK: 0.7, scale: 1.35 });
  const district = buildDistrict({ plan, meshes, padMaterial: padMat });
  app.scene.add(district.group);
  const coll = districtCollision(plan);

  /* walker + world queries from the same recipes */
  const orig = { groundAt: W.groundAt, solidAt: W.solidAt, buildingAt: W.buildingAt };
  W.groundAt = (x, z, th) => {
    const b = coll.at(x, z, 0.35);
    if (b) return coll.at(x, z, 0) ? b.baseY + b.h : b.baseY;
    return th + road.surfaceAt(x, z);
  };
  W.solidAt = (x, z) => { const b = coll.at(x, z, 0); return b ? b.baseY + b.h : 0; };
  W.buildingAt = (x, z) => coll.at(x, z, 0);

  const physics = drive ? swapDriveCollision(drive, coll) : null;

  const report = () => ({
    schema: 'kfb.clay-city-mvp-01/1', id: CLAY_CITY.id,
    tile: { cx: tile.cx, cz: tile.cz, sizeM: CLAY_CITY.tileHalfM * 2 }, roadRectM: CLAY_CITY.roadHalfM * 2,
    osmHidden: hidden, groundMaterials: ground,
    road: road.report, district: plan.report, donors: measured.map((d) => ({ id: d.id, tris: d.triangles, sizeM: d.sizeM })),
    instanced: district.instanced, cityDrawCalls: district.drawCalls + 2, physics,
    owners: { terrainHeight: 'app.terrainHeightAt (WB2)', walker: 'World r2 play via world.groundAt adapter', drive: 'Race PR10 FREE_ROAM_C0 (ground box unchanged)', visibleCity: 'Kit recipes (' + DISTRICT_RULE.id + ')', road: ROAD_RULE.id },
    mountMs: Math.round(performance.now() - t0)
  });
  const api = { road, plan, district, coll, uniforms: U, report, restore() { Object.assign(W, orig); } };
  window.__clayCity = api;
  return api;
}
