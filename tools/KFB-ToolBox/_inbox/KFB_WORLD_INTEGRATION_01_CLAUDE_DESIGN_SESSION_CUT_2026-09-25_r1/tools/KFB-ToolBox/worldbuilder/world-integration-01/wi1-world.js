/* KFB WorldBuilder · WORLD-INTEGRATION-01 · world zone seam for the real WorldBuilder (WB2)
   The WorldBuilder keeps owning terrain truth, sculpt strokes, scene objects, save/reload and the
   edit layer. This module only brings a real World Zone INTO that state:
     · zone geometry    → wd1-seam.js loadZone() (frozen OSM fixture, same seam as WB-D2)
     · presentation     → wd1-city.js buildCityLayer() + wd1-names.js (WB-D2 look donor, unchanged)
     · ground map       → the city's own ground texture, draped on the WB2 terrain tile, so roads
                          follow Raise/Lower instead of floating over it
     · collision        → solidAt(x,z): OSM footprints as solid volumes for the walker
     · ink              → w0-ink.js, consumer-side exclusion of geometry that is not visibly drawn
   OSM City Lab stays owner of geography. Nothing here invents streets or buildings. */
import * as THREE from 'three';

/* Claude Design project layout: the WB-D2 modules and fixtures sit at the project root.
   Web re-points ROOT when rehoming (one constant). */
const ROOT = new URL('../../../../', import.meta.url).href;
const PIN = 'c049cae386e1';
const K = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@' + PIN + '/';
const DONOR = {
  cartoon: K + 'tools/osm-city-lab/src/style/cartoon-city.js',
  cityStyle: K + 'tools/osm-city-lab/styles/kfb-city-v0.json',
  elastic: 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@0c59e92d9d8688f5a88cd309ae8891dcd174c2fc/tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs',
  sky: K + 'travel/wip/travel_globe_wsa/globe-v13/sky-presets.js'
};
export const ZONES = {
  huerth: { fixture: 'fixtures/huerth-crop-v0.json', label: 'Hürth' }
};
const TILE = { size: 192, seg: 384 };   // editable terrain tile · 0.5 m vertex spacing · centred on the spawn · carries the 4.7 cm/px ground map

async function imp(url) {
  try { return await import(url); } catch (e1) {
    try { return await import(url + (url.includes('?') ? '&' : '?') + 'r=1'); } catch (e2) {
      const txt = await (await fetch(url)).text(), base = url.slice(0, url.lastIndexOf('/') + 1);
      const src = txt.replace(/(from\s+|import\s*\()(['"])(\.\.?\/[^'"]+)\2/g, (m, a, q, p) => a + q + new URL(p, base).href + q);
      return import(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
    }
  }
}

function pip(x, z, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.z > z) !== (b.z > z) && x < (b.x - a.x) * (z - a.z) / (b.z - a.z) + a.x) inside = !inside;
  }
  return inside;
}
function footprintIndex(zone) {
  const C = 16, grid = new Map(), key = (i, j) => i + ',' + j;
  let n = 0;
  for (const b of zone.buildings) {
    if (!b.fp || b.fp.length < 3) continue;
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (const p of b.fp) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); z0 = Math.min(z0, p.z); z1 = Math.max(z1, p.z); }
    const rec = { id: b.id, fp: b.fp, x0, x1, z0, z1, top: +b.h || 6, under: +b.minH || 0 };
    for (let i = Math.floor(x0 / C); i <= Math.floor(x1 / C); i++) for (let j = Math.floor(z0 / C); j <= Math.floor(z1 / C); j++) {
      const k = key(i, j); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(rec);
    }
    n++;
  }
  return {
    count: n,
    at(x, z) {
      const l = grid.get(key(Math.floor(x / C), Math.floor(z / C))); if (!l) return null;
      for (const r of l) { if (x < r.x0 || x > r.x1 || z < r.z0 || z > r.z1) continue; if (pip(x, z, r.fp)) return r; }
      return null;
    }
  };
}
function findSpawn(zone, fp) {
  const R = zone.rectW, cx = (R.minX + R.maxX) / 2, cz = (R.minZ + R.maxZ) / 2;
  const clear = (x, z) => { for (let a = 0; a < 12; a++) { const t = a / 12 * Math.PI * 2; if (fp.at(x + Math.cos(t) * 6, z + Math.sin(t) * 6)) return false; } return !fp.at(x, z); };
  let best = null;
  for (const r of zone.roads) {
    if (!r.drive || !r.name || r.tunnel === 'yes' || r.bridge === 'yes' || r.line.length < 2) continue;
    for (let i = 0; i < r.line.length - 1; i++) {
      const a = r.line[i], b = r.line[i + 1], L = Math.hypot(b.x - a.x, b.z - a.z); if (L < 8) continue;
      const m = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 }, d = Math.hypot(m.x - cx, m.z - cz);
      if (best && d >= best.d) continue;
      if (!clear(m.x, m.z)) continue;
      best = { x: m.x, z: m.z, d, heading: Math.atan2(b.x - a.x, b.z - a.z), road: r.name, roadId: r.id };
    }
  }
  return best || { x: cx, z: cz, d: 0, heading: 0, road: null, roadId: null };
}

export async function prepare(id) {
  const Z = ZONES[id]; if (!Z) throw new Error('unknown world zone ' + id);
  const SEAM = await import(ROOT + 'wd1-seam.js');
  const zone = await SEAM.loadZone({ kind: 'frozen-fixture', url: ROOT + Z.fixture });
  const fp = footprintIndex(zone);
  const spawn = findSpawn(zone, fp);
  const tile = { cx: Math.round(spawn.x), cz: Math.round(spawn.z), size: TILE.size, seg: TILE.seg };
  return makeWorld({ id, Z, SEAM, zone, fp, spawn, tile });
}

function makeWorld({ id, Z, SEAM, zone, fp, spawn, tile }) {
  const fwd = { x: Math.sin(spawn.heading), z: Math.cos(spawn.heading) }, right = { x: -Math.cos(spawn.heading), z: Math.sin(spawn.heading) };
  const at = (f, r) => [+(spawn.x + fwd.x * f + right.x * r).toFixed(3), null, +(spawn.z + fwd.z * f + right.z * r).toFixed(3)];
  const S = { city: null, names: null, far: null, plate: null, map: null, ink: null, inkOn: false, inkList: [], inkScan: 0, inkReport: null, sun: null, sunDir: null, getTerrain: () => null, scanRoots: [] };
  const LOG = [];
  const log = (t) => { LOG.push(t); console.info('[wi1]', t); };
  log('zone · ' + zone.id + ' · ' + zone.counts.buildings + ' buildings · ' + zone.counts.roadParts + ' road parts · seam ' + SEAM.SEAM.version);
  log('spawn · ' + (spawn.road || 'zone centre') + ' · ' + spawn.x.toFixed(1) + ' / ' + spawn.z.toFixed(1) + ' · ' + spawn.d.toFixed(0) + ' m from zone centre · edit tile ' + tile.size + ' m @ ' + (tile.size / tile.seg) + ' m');

  /* shadow box = WB-D1 shadowFollow (Georg-accepted shadow fix): edge follows the camera distance (90–400 m),
     centre snaps to whole texels (no crawling edges), normalBias 1.2 texel, tiny depth bias → no light gap
     under houses, and houses outside a fixed ±34 m box no longer switch their shadow off. */
  function shadowFollow(focus, camera) {
    const sh = S.sun.shadow, cam = sh.camera, d = camera.position.distanceTo(W.controls ? W.controls.target : focus), SUN_D = 900;
    const half = Math.max(90, Math.min(400, Math.round(d * 2.2 / 10) * 10)), texel = 2 * half / sh.mapSize.x;
    if (half !== S.shHalf) {
      S.shHalf = half;
      Object.assign(cam, { left: -half, right: half, top: half, bottom: -half, near: SUN_D - Math.max(half * 1.2, 380), far: SUN_D + half * 1.2 + 80 });
      cam.updateProjectionMatrix(); sh.normalBias = texel * 1.2; sh.bias = -0.00003;
    }
    const sd = S.sunDir, e1 = new THREE.Vector3(0, 1, 0).cross(sd).normalize(), e2 = sd.clone().cross(e1).normalize();
    const a = Math.round(focus.dot(e1) / texel) * texel, b = Math.round(focus.dot(e2) / texel) * texel;
    const f = e1.multiplyScalar(a).addScaledVector(e2, b).addScaledVector(sd, focus.dot(sd));
    S.sun.target.position.copy(f); S.sun.position.copy(f).addScaledVector(sd, SUN_D); S.sun.target.updateMatrixWorld();
  }
  const W = {
    id, zone, spawn, tile, log: LOG,
    docId: 'wi1-world-' + id,
    storageKey: 'kfb-wi1-world.' + id,
    get inkOn() { return S.inkOn; },
    get inkReport() { return S.inkReport; },
    get city() { return S.city; },
    solidAt(x, z) { const r = fp.at(x, z); return r && r.under < 2.2 ? r.top : 0; },
    buildingAt(x, z) { return fp.at(x, z); },

    /* The WB2 scene document, re-targeted at the zone: same format/version, same owners, same
       object records; terrain gets a flat procedural base (OSM carries no elevation) and a tile. */
    patchDoc(doc) {
      doc.id = W.docId;
      doc.terrain = { seed: 43129, height: 0, macroScale: 3.2, detail: 0.55, tile: { ...tile }, sculpt: { version: 1, strokes: [] } };
      const a = doc.objects.find((o) => o.kind === 'resident'), p = doc.objects.find((o) => o.kind === 'prop');
      if (a) { a.transform.position = at(7, 2.8); a.transform.rotation = [0, +(spawn.heading + Math.PI).toFixed(5), 0]; }
      if (p) { p.transform.position = at(5, -2.4); }
      doc.world = {
        format: 'kfb.wi1.world-ref/0', zone: { id: zone.id, label: Z.label, fixture: Z.fixture, seam: SEAM.SEAM.version, status: zone.status, provenance: zone.provenance },
        player: { position: [+spawn.x.toFixed(3), 0, +spawn.z.toFixed(3)], heading: +spawn.heading.toFixed(5) }
      };
      doc.sources.world = {
        owner: 'OSM City Lab / World Zone (geography) · WB-D2 (presentation donor)',
        seam: 'wd1-seam.js loadZone · frozen-fixture', presenter: 'wd1-city.js buildCityLayer · wd1-names.js buildStreetNames',
        walker: 'travel/KFB Travel Combat v25/terrain-v25/walk-controller.js (unchanged, metre params)',
        motion: 'media/3D_Assets/Animations/KFB_Motion_Library + KayKit_Character_Animations_1.1 Rig_Medium'
      };
      return doc;
    },

    stage({ scene, camera, controls, sun, fog, background }) {
      W.camera = camera; W.controls = controls; S.fog = fog; S.bg = background; S.scene = scene;
      camera.near = 0.1; camera.far = 12000; camera.updateProjectionMatrix();
      /* orbit without limits (Georg 25.09.) + zoom toward the cursor */
      controls.maxPolarAngle = Math.PI; controls.minPolarAngle = 0;
      controls.maxDistance = 6000; controls.minDistance = 0.3;
      controls.zoomToCursor = true; controls.screenSpacePanning = true;
      fog.near = 140; fog.far = 1100;
      S.sun = sun; S.sunDir = sun.position.clone().normalize();
      sun.shadow.mapSize.set(4096, 4096); S.shHalf = 0;
      Object.assign(sun.shadow.camera, { left: -34, right: 34, top: 34, bottom: -34, near: 1, far: 260 });
      /* contact shadow (WB-D1 fix, again): a large bias/normalBias lifts the shadow off the contact → light gap under
         rocks and feet. Texel 68 m / 4096 = 1.7 cm → normalBias ≈ 1 texel, tiny depth bias. */
      sun.shadow.camera.updateProjectionMatrix(); sun.shadow.bias = -0.00005; sun.shadow.normalBias = 0.016;
      scene.add(sun.target);
    },

    async mount({ scene, renderer, getTerrain }) {
      S.getTerrain = getTerrain;
      const [CC, EG, CITY, NAMES, style, SKYP] = await Promise.all([imp(DONOR.cartoon), imp(DONOR.elastic), import(ROOT + 'wd1-city.js'), import(ROOT + 'wd1-names.js'), fetch(DONOR.cityStyle).then((r) => r.json()), imp(DONOR.sky)]);
      S.skyPresets = SKYP;
      const Ly = CITY.layersFrom(style);
      S.city = CITY.buildCityLayer(zone, { mode: 'elastic', style, CC, EG, ghosts: false, renderer, facade: 'rule-v1' });
      S.city.group.position.y = -Ly.plate;               // plate level = WB2 terrain zero
      S.city.group.name = 'world-zone:' + zone.id;
      scene.add(S.city.group);
      S.map = S.city.plate.material.map;
      /* walkable tile: the SAME ground-map drawing, for the tile rect only, at 4096 px → 3 cm/px */
      const h = tile.size / 2;
      S.tileRect = { minX: tile.cx - h, maxX: tile.cx + h, minZ: tile.cz - h, maxZ: tile.cz + h };
      if (CITY.groundMapFor) { S.tileMap = CITY.groundMapFor(zone, { style, renderer, rect: S.tileRect, px: 4096 }).tex; log('tile ground map · 4096 px over ' + tile.size + ' m · ' + (tile.size / 4096 * 100).toFixed(1) + ' cm/px (zone map 17 cm/px)'); }
      await W.setSky(W.skyMode);
      /* the plate keeps its material; its geometry gets a hole where the WB2 tile carries the map */
      const R = zone.rectW, Wd = R.maxX - R.minX, Dp = R.maxZ - R.minZ, m = 0.5;
      const sh = new THREE.Shape([[R.minX, R.minZ], [R.maxX, R.minZ], [R.maxX, R.maxZ], [R.minX, R.maxZ]].map(([x, z]) => new THREE.Vector2(x, -z)));
      const h0 = tile.size / 2 - m;
      sh.holes.push(new THREE.Path([[-1, -1], [-1, 1], [1, 1], [1, -1]].map(([sx, sz]) => new THREE.Vector2(tile.cx + sx * h0, -(tile.cz + sz * h0)))));
      const pg = new THREE.ShapeGeometry(sh); pg.rotateX(-Math.PI / 2);
      const pp = pg.attributes.position, uv = new Float32Array(pp.count * 2);
      for (let i = 0; i < pp.count; i++) { uv[i * 2] = (pp.getX(i) - R.minX) / Wd; uv[i * 2 + 1] = (R.maxZ - pp.getZ(i)) / Dp; pp.setY(i, Ly.plate); }
      pg.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); pg.computeVertexNormals();
      S.city.plate.geometry.dispose(); S.city.plate.geometry = pg;
      S.plate = S.city.plate;
      S.far = new THREE.Mesh(new THREE.CircleGeometry(4200, 64).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x86a85a, roughness: 1 }));
      S.far.position.set((R.minX + R.maxX) / 2, -0.62, (R.minZ + R.maxZ) / 2); S.far.receiveShadow = true; S.far.name = 'far-ground'; scene.add(S.far);
      try {
        S.names = await NAMES.buildStreetNames(zone, { y: Ly.plate, homeStreet: null });
        const ng = new THREE.Group(); ng.name = 'street-names'; ng.position.y = -Ly.plate; ng.add(S.names.ground, S.names.signs); if (S.names.posts) ng.add(S.names.posts);
        S.names.ground.visible = false; S.names.signs.visible = !S.names.posts;   // corner posts replace the floating signs
        scene.add(ng); S.names.group = ng;
        log('street names · ' + S.names.stats.names + ' streets · ' + (S.names.stats.posts != null ? S.names.stats.posts + ' corner posts' : S.names.stats.signs + ' signs'));
      } catch (e) { log('street names failed · ' + e.message); }
      const cs = S.city.stats;
      log('city · Elastic Grotesque Clay V2 ' + cs.buildings + '/' + zone.counts.buildings + ' · facade ' + cs.facade.rule + ' · ground map ' + cs.groundTexture + ' draped on the WB2 tile');
      try {
        const INK = await import(ROOT + 'w0-ink.js');
        S.ink = INK.createInk({ renderer, scene, camera: W.camera });
        S.ink.setParams({ thin: 1.2, thick: 2.6, wobble: 0.3, gap: 0, grain: 0.15, fadeNear: 22, fadeFar: 120, strength: 0.9 });
      } catch (e) { log('ink unavailable · ' + e.message); }
      return S.city;
    },

    dressTerrain(mesh) {
      if (!S.map) return;
      const T = S.tileMap ? S.tileRect : zone.rectW, Wd = T.maxX - T.minX, Dp = T.maxZ - T.minZ, p = mesh.geometry.attributes.position, uv = mesh.geometry.attributes.uv;
      for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) - T.minX) / Wd, (T.maxZ - p.getZ(i)) / Dp);
      uv.needsUpdate = true;
      mesh.material.vertexColors = false; mesh.material.map = S.tileMap || S.map; mesh.material.color.set(0xffffff); mesh.material.roughness = 0.97; mesh.material.needsUpdate = true;
      mesh.name = 'Continuous terrain · world tile ' + zone.id;
    },

    setVisible(v) { for (const o of [S.city && S.city.group, S.names && S.names.group, S.far, S.sky && S.sky.group]) if (o) o.visible = v; },
    /* Sky from the existing owners via wd-sky.js (WorldDesign Lab): Travel Combat v25 skydome-shader.js
       domes (Aquarell = rollercoaster-v11 recipe, Shader S/A) or the TinySkies backdrop. Horizon fog =
       TinySkies preset fog colour. Light stays the accepted WB2 light. */
    skyMode: 'watercolor',
    SKY_MODES: [['watercolor', 'Aquarell 1'], ['watercolor2', 'Aquarell 2'], ['S', 'Shader S'], ['A', 'Shader A'], ['tiny:day', 'TinySkies Tag']],
    async setSky(mode) {
      W.skyMode = mode;
      try {
        const SK = S.skyMod || (S.skyMod = await import(ROOT + 'wd-sky.js'));
        if (S.sky) { try { S.sky.dispose(); } catch {} if (S.sky.group) S.scene.remove(S.sky.group); }
        S.sky = await SK.makeSky(S.scene, mode, {});
        if (S.sky.group) { S.sky.group.traverse((o) => { if (o.material) o.material.fog = false; o.frustumCulled = false; }); }
        const day = S.skyPresets && S.skyPresets.getSkyPreset('day');
        const fogC = new THREE.Color(S.sky.fog != null ? S.sky.fog : day ? day.fogColor : 0xbfd4dc);
        S.fog.color.copy(fogC); if (S.bg && S.bg.isColor) S.bg.copy(fogC);
        if (!S.sky.background) S.scene.background = S.bg;
        log('sky · ' + S.sky.label);
      } catch (e) { log('sky failed · ' + e.message); }
    },
    get namesOn() { return !!(S.names && (S.names.posts || S.names.signs).visible); },
    setNames(v) { if (S.names) (S.names.posts || S.names.signs).visible = !!v; },
    setInk(on) { S.inkOn = !!on && !!S.ink; S.inkScan = 0; },
    setScanRoots(list) { S.scanRoots = list.filter(Boolean); S.inkScan = 0; },

    frameEdit(camera, controls) {
      controls.target.set(spawn.x, 0.8, spawn.z);
      camera.position.set(spawn.x - fwd.x * 14 + right.x * 9, 10, spawn.z - fwd.z * 14 + right.z * 9);
      controls.update();
    },

    tick(focus, camera) {
      if (S.names) S.names.update(camera);
      if (S.sky) { S.sky.update(camera); if (S.sky.background && S.scene.background !== S.sky.background) S.scene.background = S.sky.background; }
      if (S.fog && W.controls) { const d = camera.position.distanceTo(W.controls.target); S.fog.near = Math.max(140, d * 0.9); S.fog.far = Math.max(1100, d * 3.5); }
      if (S.sun && focus) shadowFollow(focus, camera);
    },

    /* Ink only around geometry that is actually drawn. Two measured leaks on the graft actor:
       · headgraft.v1 `body` face box — MeshBasicMaterial opacity 0: invisible in colour, but a normal/
         depth override pass draws it → an ellipsoid outline around nothing.
       · the host head is hidden through an extra draw group with `visible:false`; three.js skips
         invisible groups before the override applies, so w0-ink is clean there — a hull-style ink
         (one material over the whole geometry) is not.
       Rule: exclude every mesh whose materials are all invisible, colour-masked or fully transparent. */
    render(t, renderer, scene, camera) {
      if (!S.inkOn || !S.ink) return false;
      const sz = renderer.getSize(new THREE.Vector2()); S.ink.setSize(sz.x, sz.y);
      if (S.inkScan-- <= 0) {
        S.inkScan = 45;
        const ghost = [];
        for (const r of S.scanRoots) r.traverse((o) => {
          if (!o.isMesh) return;
          const mats = [].concat(o.material).filter(Boolean);
          if (mats.length && mats.every((m) => m.visible === false || m.colorWrite === false || (m.transparent && m.opacity <= 0.02))) ghost.push(o);
        });
        S.inkReport = { excludedInvisible: ghost.length, names: ghost.map((o) => o.name || o.type).slice(0, 12) };
        S.inkList = ghost;
      }
      S.ink.setExcluded([S.getTerrain(), S.plate, S.far, S.names && S.names.ground, ...S.inkList].filter(Boolean));
      S.ink.render(t);
      return true;
    }
  };
  return W;
}
