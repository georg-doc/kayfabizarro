/* KFB Kit Lab · scene builder for KayKit/Kenney packs
   Loads real assets from the kayfabizarro asset repo (read-only consumer of the Asset Registry
   source paths). Every placement is grid-anchored; every module size is measured at runtime. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

THREE.Cache.enabled = true;

const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/';
export const PACKS = {
  dungeon:   { base: RAW + 'KayKit_Dungeon_Pack_1.1_FREE%202/Assets/gltf/', ext: '.gltf' },
  boardgame: { base: RAW + 'KayKit_BoardGameBits_1.0_FREE/Assets/gltf/', ext: '.gltf' },
  city_kk:   { base: RAW + 'KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/', ext: '.gltf' },
  forest:    { base: RAW + 'KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/', ext: '.gltf' },
  tools:     { base: RAW + 'KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/', ext: '.gltf' },
  roads:     { base: RAW + 'kenney_city-kit-roads/Models/GLB%20format/', ext: '.glb' },
  city_com:  { base: RAW + 'kenney_city-kit-commercial_2.1/Models/GLB%20format/', ext: '.glb' },
  city_sub:  { base: RAW + 'kenney_city-kit-suburban_20/Models/GLB%20format/', ext: '.glb' },
  nature:    { base: RAW + 'kenney_nature-kit/Models/GLTF%20format/', ext: '.glb' },
  racing:    { base: RAW + 'kenney_racing-kit/Models/GLTF%20format/', ext: '.glb' },
  space:     { base: RAW + 'KayKit_Space_Base_Bits_1.0_FREE/Assets/gltf/', ext: '.gltf' },
  restaurant:{ base: RAW + 'KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/', ext: '.gltf' },
  furniture: { base: RAW + 'KayKit_Furniture_Bits_1.0_FREE/Assets/gltf/', ext: '.gltf' },
  /* S18 · Plant Prop Lab. Der Ordnername des Tiny-Treats-Packs endet auf " 2" (Leerzeichen
     plus Zwei) — wie beim Dungeon-Pack als %20 kodiert, sonst 404. */
  tt_plants: { base: RAW + 'Tiny_Treats_House_Plants_1.0_FREE%202/Assets/gltf/', ext: '.gltf' },
  qu_env:    { base: RAW + 'SciFI_Ultimate%20Space%20Kit_Quaternius/Environment/GLTF/', ext: '.gltf' },
  hex_base:  { base: RAW + 'KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/tiles/base/', ext: '.gltf' },
  hex_coast: { base: RAW + 'KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/tiles/coast/', ext: '.gltf' },
  hex_coastw:{ base: RAW + 'KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/tiles/coast/waterless/', ext: '.gltf' },
  hex_river: { base: RAW + 'KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/tiles/rivers/', ext: '.gltf' },
  hex_riverw:{ base: RAW + 'KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/tiles/rivers/waterless/', ext: '.gltf' },
  hex_roads: { base: RAW + 'KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/tiles/roads/', ext: '.gltf' },
  hex_bld_b: { base: RAW + 'KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/buildings/blue/', ext: '.gltf' },
  hex_bld_g: { base: RAW + 'KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/buildings/green/', ext: '.gltf' },
  hex_bld_n: { base: RAW + 'KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/buildings/neutral/', ext: '.gltf' },
  hex_bld_r: { base: RAW + 'KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/buildings/red/', ext: '.gltf' },
  hex_bld_y: { base: RAW + 'KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/buildings/yellow/', ext: '.gltf' },
  hex_nature:{ base: RAW + 'KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/nature/', ext: '.gltf' },
  hex_props: { base: RAW + 'KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/', ext: '.gltf' }
};

const loader = new GLTFLoader();
const cache = new Map();
const texReg = new Map();       // Materialname → geladene Textur, über alle je geladenen Teile
export const measured = new Map(); // name -> {size:[x,y,z], min:[..], max:[..]}

export async function loadAsset(pack, name) {
  const key = pack + '/' + name;
  const cfg = PACKS[pack];
  if (!cfg) throw new Error('unknown pack ' + pack);
  if (!cache.has(key)) {
    cache.set(key, loader.loadAsync(cfg.base + encodeURIComponent(name) + cfg.ext).then((g) => {
      const box = new THREE.Box3().setFromObject(g.scene);
      const s = box.getSize(new THREE.Vector3());
      measured.set(key, {
        pack, name,
        size: [s.x, s.y, s.z],
        min: box.min.toArray(), max: box.max.toArray()
      });
      g.scene.traverse((o) => {
        if (!o.isMesh) return;
        o.castShadow = true; o.receiveShadow = true;
        /* Jedes intakt geladene Material ist SPENDER für repairTextures. Ohne diesen Pool kann
           ein Teil nur von einem anderen Teil DERSELBEN Szene geheilt werden — eine Szene mit
           genau einem Bilderrahmen blieb deshalb schwarz. */
        for (const m of (Array.isArray(o.material) ? o.material : [o.material]).filter(Boolean))
          if (m.map && m.map.image && m.name && !texReg.has(m.name)) texReg.set(m.name, m.map);
      });
      return g.scene;
    }));
  }
  return cache.get(key);
}

export async function instance(pack, name) {
  const src = await loadAsset(pack, name);
  return src.clone(true);
}

/* measure a single part without placing it */
export async function measure(pack, name) {
  await loadAsset(pack, name);
  return measured.get(pack + '/' + name);
}

/* A placement: { a:'pack:name', p:[x,y,z] world  OR  m:[i,j] module, y, r:deg-Y, s:scale }
   opts.module scales m[] into world units. */
export async function buildScene(placements, onProgress, opts = {}) {
  const M = opts.module || 1;
  const root = new THREE.Group();
  root.name = 'kfb-scene';
  /* Warm the cache before instancing. NOT all at once: every gltf pulls the same pack texture,
     and 100 simultaneous requests for it get throttled — which renders parts black. So load the
     first part alone (that puts the texture in the browser cache), then go in small batches. */
  const uniq = [...new Set(placements.map((p) => p.a))];
  const load = (ref) => { const [pack, name] = ref.split(':'); return loadAsset(pack, name).catch(() => null); };
  if (uniq.length) await load(uniq[0]);
  const batch = opts.concurrency || 6;
  for (let i = 1; i < uniq.length; i += batch) {
    await Promise.all(uniq.slice(i, i + batch).map(load));
    onProgress?.(Math.min(i + batch, uniq.length), uniq.length + placements.length);
  }
  let done = 0;
  for (const it of placements) {
    const [pack, name] = it.a.split(':');
    try {
      const node = await instance(pack, name);
      const p = it.p || [it.m[0] * M, it.y || 0, it.m[1] * M];
      node.position.set(p[0], it.p ? (p[1] || 0) : (it.y || 0), p[2]);
      if (it.r) node.rotation.y = THREE.MathUtils.degToRad(it.r);
      if (it.s) node.scale.setScalar(it.s);
      node.userData.recipe = it;
      root.add(node);
    } catch (e) {
      console.warn('missing asset', it.a, e.message);
    }
    onProgress?.(++done, placements.length);
  }
  return root;
}

/* Placement audit — the automatic version of "das hätte im Screenshot auffallen müssen".
   Flags parts that do not sit on the module raster and parts whose footprints overlap. */
/* Authored-number check (cheap, catches typos in a recipe).
   NOTE: for recipes written in module coordinates this is true by construction — the real check
   is auditWorld() below, which measures the RENDERED geometry. */
export function audit(placements, module, opts = {}) {
  const tol = opts.tolerance ?? 0.02;
  const step = module / 2;                       // half-module snapping is legal
  const isStructural = opts.structural || (() => true);
  const offGrid = [];
  const free = [];
  const seen = new Map();
  const overlaps = [];
  for (const it of placements) {
    const p = it.p || [it.m[0] * module, it.y || 0, it.m[1] * module];
    const dx = Math.abs(p[0] / step - Math.round(p[0] / step)) * step;
    const dz = Math.abs(p[2] / step - Math.round(p[2] / step)) * step;
    const off = dx > tol || dz > tol;
    if (off && isStructural(it.a)) offGrid.push({ a: it.a, p, offX: +dx.toFixed(3), offZ: +dz.toFixed(3) });
    else if (off) free.push({ a: it.a, p });
    if (opts.checkOverlap && isStructural(it.a)) {
      const layer = opts.layer ? opts.layer(it.a) : 'all';
      const key = `${layer}|${Math.round(p[0] / step)}|${Math.round(p[2] / step)}`;
      if (seen.has(key)) overlaps.push({ a: it.a, with: seen.get(key), p, layer });
      else seen.set(key, it.a);
    }
  }
  return { total: placements.length, free, offGrid, overlaps, clean: offGrid.length === 0 && overlaps.length === 0 };
}

/* Rendered-geometry audit — measures what is actually on screen.
   classify(assetRef) -> 'edge'   : part defines the raster, its bbox edges must snap to it
                         'center' : part sits inside a cell, its bbox centre must snap
                         null     : free prop, ignored
   Catches pivot errors, wrong rotations and wrong part variants — the authored numbers cannot. */
export function auditWorld(root, module, opts = {}) {
  const tol = opts.tolerance ?? 0.03;
  const step = module / 2;
  const classify = opts.classify || (() => 'edge');
  const dev = (v) => Math.abs(v / step - Math.round(v / step)) * step;
  const r2 = (v) => +v.toFixed(2);
  const items = [], offGrid = [];
  for (const node of root.children) {
    const rec = node.userData.recipe;
    if (!rec) continue;
    const kind = classify(rec.a);
    if (!kind) continue;
    const b = new THREE.Box3().setFromObject(node);
    let d, note;
    if (kind === 'edge') {
      d = Math.max(dev(b.min.x), dev(b.min.z), dev(b.max.x), dev(b.max.z));
      note = 'Kantenversatz';
    } else {
      /* part sits inside a cell: measure how far it leaves its own module cell */
      const cx = (rec.m ? rec.m[0] * module : (b.min.x + b.max.x) / 2);
      const cz = (rec.m ? rec.m[1] * module : (b.min.z + b.max.z) / 2);
      const h = module / 2;
      d = Math.max(cx - h - b.min.x, b.max.x - (cx + h), cz - h - b.min.z, b.max.z - (cz + h), 0);
      note = '\u00dcberstand';
    }
    const row = { a: rec.a, kind, note, dev: +d.toFixed(3), min: [r2(b.min.x), r2(b.min.z)], max: [r2(b.max.x), r2(b.max.z)] };
    items.push(row);
    if (d > (kind === 'edge' ? tol : (opts.overhangTolerance ?? 0.3))) offGrid.push(row);
  }
  const worst = items.reduce((m, i) => Math.max(m, i.dev), 0);
  return { count: items.length, offGrid, worst: +worst.toFixed(3), clean: offGrid.length === 0, items };
}

/* Joint audit for chained scenes (tracks, road runs): consecutive parts must touch.
   Measures the real distance between the rendered bounding boxes — a pivot error that still
   closes the loop shows up here as a gap. */
export function auditJoints(nodes, opts = {}) {
  const tol = opts.tolerance ?? 0.05;
  const boxes = nodes.map((n) => new THREE.Box3().setFromObject(n));
  const joints = [];
  for (let i = 0; i < boxes.length - 1; i++) {
    const a = boxes[i], b = boxes[i + 1];
    const dx = Math.max(a.min.x - b.max.x, b.min.x - a.max.x, 0);
    const dz = Math.max(a.min.z - b.max.z, b.min.z - a.max.z, 0);
    const sep = Math.hypot(dx, dz);
    joints.push({ i, sep: +sep.toFixed(3), a: nodes[i].userData.recipe?.a, b: nodes[i + 1].userData.recipe?.a });
  }
  const bad = joints.filter((j) => j.sep > tol);
  return { joints, bad, worst: +joints.reduce((m, j) => Math.max(m, j.sep), 0).toFixed(3), clean: bad.length === 0 };
}

/* Shared surface probe. One ray through the centre is not enough: a prop sitting on the seam
   between two tiles can slip through it and report "no surface below", which a gate must never
   silently pass. So the footprint corners are sampled too and the highest surface hit wins. */
function probeSurface(root, ray, b, isSurface) {
  const down = new THREE.Vector3(0, -1, 0);
  const c = b.getCenter(new THREE.Vector3());
  const ex = (b.max.x - b.min.x) * 0.3, ez = (b.max.z - b.min.z) * 0.3;
  const hitAt = (px, pz) => {
    ray.set(new THREE.Vector3(px, 40, pz), down);
    for (const hit of ray.intersectObject(root, true)) {
      let o = hit.object, r = null;
      while (o && !r) { r = o.userData.recipe; o = o.parent; }
      if (r && isSurface(r.a)) return hit.point.y;
    }
    return null;
  };
  /* The CENTRE decides which surface a prop belongs to. Corners are only a fallback for the seam
     case — using the highest of all samples would teleport a kerbside prop onto a neighbouring
     building's roof whenever a corner sample overhangs it. */
  const centre = hitAt(c.x, c.z);
  if (centre !== null) return centre;
  let best = null;
  for (const [px, pz] of [[c.x - ex, c.z - ez], [c.x + ex, c.z - ez], [c.x - ex, c.z + ez], [c.x + ex, c.z + ez]]) {
    const y = hitAt(px, pz);
    if (y !== null && (best === null || y > best)) best = y;
  }
  return best;
}

/* Ground-contact audit — does every prop actually STAND on the surface under it?
   A prop with nothing measurable beneath it is reported as UNVERIFIED, never as passing: a prop
   placed off the tiled area is exactly the misplacement this gate exists to catch. */
export function auditGround(root, opts = {}) {
  const tol = opts.tolerance ?? 0.015;
  const isSurface = opts.isSurface || ((a) => /:(base|road[-_]|tile)/.test(a));
  const isProp = opts.isProp || ((a) => !isSurface(a));
  root.updateMatrixWorld(true);
  const ray = new THREE.Raycaster();
  const rows = [], bad = [], unverified = [];
  for (const node of root.children) {
    const rec = node.userData.recipe;
    if (!rec || !isProp(rec.a)) continue;
    const b = new THREE.Box3().setFromObject(node);
    const surf = probeSurface(root, ray, b, isSurface);
    const row = { a: rec.a, surface: surf === null ? null : +surf.toFixed(3), gap: surf === null ? null : +(b.min.y - surf).toFixed(3) };
    rows.push(row);
    if (surf === null) unverified.push(row);
    else if (Math.abs(row.gap) > tol) bad.push(row);
  }
  const checked = rows.length - unverified.length;
  const worst = rows.reduce((m, r) => (r.gap === null ? m : Math.max(m, Math.abs(r.gap))), 0);
  return {
    count: rows.length, checked, bad, unverified,
    worst: +worst.toFixed(3),
    clean: bad.length === 0 && unverified.length === 0,
    rows
  };
}

/* Snap props onto whatever tile is under them — the placement rule "a prop stands on the surface
   below it" applied from the geometry instead of from a hand-typed y per prop. Tiles in this pack
   are 0.10 high with 0.07 asphalt insets, so a prop's correct height depends on WHICH tile it
   landed on; measuring beats guessing. Props with nothing beneath them are left alone and reported. */
export function snapToSurface(root, opts = {}) {
  const isSurface = opts.isSurface || ((a) => /:(base|road[-_]|tile)/.test(a));
  const isProp = opts.isProp || ((a) => !isSurface(a));
  root.updateMatrixWorld(true);
  const ray = new THREE.Raycaster();
  const moved = [], unverified = [];
  for (const node of root.children) {
    const rec = node.userData.recipe;
    if (!rec || !isProp(rec.a)) continue;
    const b = new THREE.Box3().setFromObject(node);
    const surf = probeSurface(root, ray, b, isSurface);
    if (surf === null) { unverified.push({ a: rec.a }); continue; }
    const d = surf - b.min.y;
    if (Math.abs(d) < 1e-4) continue;
    node.position.y += d;
    node.updateMatrixWorld(true);
    moved.push({ a: rec.a, delta: +d.toFixed(3), surface: +surf.toFixed(3) });
  }
  return { moved, unverified, worst: +moved.reduce((m, r) => Math.max(m, Math.abs(r.delta)), 0).toFixed(3) };
}

/* Surface probe — a road tile's DRIVING SURFACE is not its bounding box. Measured on the Kenney
   racing kit: a straight's asphalt spans the full tile (lane centre = tile centre), but
   `roadStart` carries its gantry inside the same tile and its asphalt sits 0.13 off-centre. A
   chain that derives the lane from the tile box therefore lays the start tile 0.13 sideways off
   the track — visible as a step at the gate, and invisible to an AABB joint audit.
   So the lane comes from the asphalt mesh itself: vertices of the material named `road`, per tile
   edge, giving the opening's centre and width. */
export const surfaces = new Map();
export async function measureSurface(pack, name, opts = {}) {
  const key = pack + '/' + name;
  if (surfaces.has(key)) return surfaces.get(key);
  const src = await loadAsset(pack, name);
  const matName = opts.material || 'road';
  const eps = opts.eps ?? 1e-3;
  src.updateMatrixWorld(true);
  const pts = [];
  const v = new THREE.Vector3();
  src.traverse((o) => {
    if (!o.isMesh) return;
    const m = [].concat(o.material)[0];
    if (!m || m.name !== matName) return;
    const p = o.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld); pts.push([v.x, v.y, v.z]); }
  });
  if (!pts.length) { surfaces.set(key, null); return null; }
  let minx = Infinity, maxx = -Infinity, minz = Infinity, maxz = -Infinity, top = -Infinity;
  for (const [x, y, z] of pts) {
    if (x < minx) minx = x; if (x > maxx) maxx = x;
    if (z < minz) minz = z; if (z > maxz) maxz = z;
    if (y > top) top = y;
  }
  const span = (pick, other) => {
    let lo = Infinity, hi = -Infinity, n = 0;
    for (const p of pts) { if (Math.abs(pick(p)) < eps) { const o = other(p); if (o < lo) lo = o; if (o > hi) hi = o; n++; } }
    return n ? { lo, hi, mid: (lo + hi) / 2, w: hi - lo, n } : null;
  };
  const rec = {
    pack, name, material: matName, top, verts: pts.length,
    bbox: { minx, minz, maxx, maxz },
    edges: {
      zmax: span((p) => p[2] - maxz, (p) => p[0]), zmin: span((p) => p[2] - minz, (p) => p[0]),
      xmax: span((p) => p[0] - maxx, (p) => p[2]), xmin: span((p) => p[0] - minx, (p) => p[2])
    }
  };
  /* how far the lane sits from where a box-derived chain would put it (tile left edge + half a
     lane width). 0 for every straight and every corner in this kit; +0.13 for `roadStart`. */
  const tile = measured.get(key);
  rec.laneOffset = tile && rec.edges.zmax ? rec.edges.zmax.mid - (tile.min[0] + rec.edges.zmax.w / 2) : 0;
  surfaces.set(key, rec);
  return rec;
}

/* colour of a named material in a pack part — for ground planes that must match the tile verges */
export async function materialColor(pack, name, matName) {
  const src = await loadAsset(pack, name);
  let hex = null;
  src.traverse((o) => {
    if (hex !== null || !o.isMesh) return;
    for (const m of [].concat(o.material)) if (m && m.name === matName) hex = m.color.getHex();
  });
  return hex;
}

/* Texture repair — every part of a KayKit pack shares two or three atlas textures, and when many
   gltf files ask for the same atlas at once one of the image requests can come back empty. The
   material is then intact but mapless, which renders the part BLACK (that is why blueprint_stacked
   was a black slab next to a blue blueprint). Fix from within the scene: any material whose map
   has no image borrows the loaded texture of the material with the same name. */
export function repairTextures(root) {
  const reg = new Map(texReg);
  const mats = (o) => (Array.isArray(o.material) ? o.material : [o.material]).filter(Boolean);
  root.traverse((o) => { if (o.isMesh) for (const m of mats(o)) if (m.map && m.map.image && m.name) reg.set(m.name, m.map); });
  const fixed = new Set(), stillBroken = new Set();
  root.traverse((o) => {
    if (!o.isMesh) return;
    for (const m of mats(o)) {
      if (!m.map || m.map.image) continue;
      const t = reg.get(m.name);
      if (t) { m.map = t; m.needsUpdate = true; fixed.add(m.name); } else stillBroken.add(m.name || m.uuid.slice(0, 6));
    }
  });
  return { repaired: [...fixed], broken: [...stillBroken], clean: stillBroken.size === 0 };
}

/* Footprint audit — the measurable version of "die Teile stecken ineinander".
   Pairwise AABB test on the RENDERED boxes; a pair counts as a collision only when it overlaps
   on all three axes (two tools sharing x/z but stacked in y is legal, e.g. a nail on a map). */
export function auditFootprints(root, opts = {}) {
  const tol = opts.tolerance ?? 0.004;
  /* Some tilings legitimately overlap in AABB terms: a HEXAGON's bounding box is larger than the
     hexagon, so two correctly seated hex tiles always overlap in their boxes (0.577 of a module
     for a side neighbour, 0.866 diagonally — measured on the KayKit hex pack). Pass ignorePair to
     skip those, otherwise the audit reports a perfect tiling as 81 collisions. */
  const ignorePair = opts.ignorePair || (() => false);
  root.updateMatrixWorld(true);
  const nodes = root.children.filter((n) => n.userData.recipe);
  const boxes = nodes.map((n) => new THREE.Box3().setFromObject(n));
  const bad = [];
  let worst = 0;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = boxes[i], b = boxes[j];
      if (ignorePair(nodes[i].userData.recipe, nodes[j].userData.recipe)) continue;
      const ox = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x);
      const oy = Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y);
      const oz = Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z);
      if (ox > tol && oy > tol && oz > tol) {
        const pen = +Math.min(ox, oy, oz).toFixed(3);
        worst = Math.max(worst, pen);
        bad.push({ a: nodes[i].userData.recipe.a, b: nodes[j].userData.recipe.a, pen });
      }
    }
  }
  bad.sort((x, y) => y.pen - x.pen);
  const gap = [];
  for (let i = 0; i < nodes.length; i++) {
    const d = boxes[i].min.y - (opts.groundY ?? 0);
    if (Math.abs(d) > (opts.groundTolerance ?? 0.01)) gap.push({ a: nodes[i].userData.recipe.a, dy: +d.toFixed(3) });
  }
  return {
    count: nodes.length, pairs: (nodes.length * (nodes.length - 1)) / 2,
    badCount: bad.length, bad: bad.slice(0, 40), worst,
    floating: gap.length, gap: gap.slice(0, 20),
    clean: bad.length === 0 && gap.length === 0
  };
}

/* Clearance audit for a height crossing (bridge over an underpass): two node groups that share
   an XZ footprint at DIFFERENT heights must not collide, and must leave real headroom, not just
   "boxes don't overlap in Y at one sample point". Checks every (over,under) pair whose XZ boxes
   intersect and reports the tightest vertical gap. */
export function auditClearance(overNodes, underNodes, opts = {}) {
  const minClear = opts.minClearance ?? 0.3;
  const box = (n) => new THREE.Box3().setFromObject(n);
  const overlaps = [];
  for (const o of overNodes) {
    const ob = box(o);
    for (const u of underNodes) {
      const ub = box(u);
      const ox = Math.min(ob.max.x, ub.max.x) - Math.max(ob.min.x, ub.min.x);
      const oz = Math.min(ob.max.z, ub.max.z) - Math.max(ob.min.z, ub.min.z);
      if (ox > 0 && oz > 0) {
        const clear = +(ob.min.y - ub.max.y).toFixed(3);
        overlaps.push({ over: o.userData.recipe?.a, under: u.userData.recipe?.a, clear, xzOverlap: +Math.min(ox, oz).toFixed(3) });
      }
    }
  }
  const bad = overlaps.filter((r) => r.clear < minClear);
  const worst = overlaps.reduce((m, r) => Math.min(m, r.clear), Infinity);
  return { crossings: overlaps.length, overlaps, bad, worst: worst === Infinity ? null : +worst.toFixed(3), clean: overlaps.length > 0 && bad.length === 0 };
}

/* Overlap relaxation — the automatic version of "nudge it until it stops clipping".
   Works on the RENDERED boxes after a build: any two parts that overlap on all three axes get
   pushed apart along their axis of LEAST overlap (x or z only, never y — a part must keep its
   ground contact), half the penetration each, clamped so nothing wanders off its own cell.
   Returns what moved and what is left, so a gate can still fail on the remainder. */
export function relaxOverlaps(root, opts = {}) {
  const tol = opts.tolerance ?? 0.02;
  const passes = opts.passes ?? 6;
  /* How far a part may wander from where the recipe put it. One flat budget is too blunt: a rock
     next to a castle needs more room than the castle does, and the castle is the addressed thing
     (S11.1: castle 1.98 + mountain 1.80 on neighbouring cells 2.0 apart could not be resolved
     inside a shared 0.3). shiftFor(recipe) gives each layer its own budget. */
  const shiftFor = opts.shiftFor || (() => opts.maxShift ?? 0.3);
  const ignorePair = opts.ignorePair || (() => false);
  const nodes = root.children.filter((n) => n.userData.recipe && !(opts.isFixed || (() => false))(n.userData.recipe));
  const home = new Map(nodes.map((n) => [n, n.position.clone()]));
  const moved = new Map();
  for (let pass = 0; pass < passes; pass++) {
    root.updateMatrixWorld(true);
    const boxes = nodes.map((n) => new THREE.Box3().setFromObject(n));
    let worked = 0;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (ignorePair(nodes[i].userData.recipe, nodes[j].userData.recipe)) continue;
        const a = boxes[i], b = boxes[j];
        const ox = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x);
        const oy = Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y);
        const oz = Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z);
        if (ox <= tol || oy <= tol || oz <= tol) continue;
        const axis = ox < oz ? 'x' : 'z';
        const pen = Math.min(ox, oz) / 2 + 0.01;
        const dir = Math.sign((nodes[i].position[axis] - nodes[j].position[axis]) || 1);
        for (const [node, sign] of [[nodes[i], dir], [nodes[j], -dir]]) {
          const start = home.get(node);
          const next = node.position[axis] + sign * pen;
          if (Math.abs(next - start[axis]) > shiftFor(node.userData.recipe)) continue;
          node.position[axis] = next;
          moved.set(node, +Math.abs(next - start[axis]).toFixed(3));
        }
        worked++;
      }
    }
    if (!worked) break;
  }
  root.updateMatrixWorld(true);
  return {
    moved: moved.size,
    worst: +[...moved.values()].reduce((m, v) => Math.max(m, v), 0).toFixed(3)
  };
}

/* ---------- Draufsicht-Sonde auf die ASSEMBLIERTE Szene ----------
   Jede Prüfung, die nur Masken vergleicht, prüft den Solver gegen sich selbst. Sie kann nicht
   sehen, ob die Kacheltabelle gespiegelt ist oder der Drehsinn falsch — beides ist in S11 genau
   so passiert, bei grünem Balken. Diese Sonde rendert die fertige Szene von oben und liest
   Pixel an Weltkoordinaten: „liegt auf der Fuge zwischen diesen zwei Zellen wirklich Sand?"

   ACHSEN, bewiesen in tools/truth-hex-axes.html: `readRenderTargetPixels` liefert Zeilen von
   UNTEN, und bei einer Draufsichtkamera zeigt Bildschirm-oben auf −z. Deshalb explizit
   `cam.up.set(0,0,-1)` (sonst ist lookAt degeneriert) UND das Minus in der z-Rechnung.

   Klassifiziert wird über KANALVERHÄLTNISSE, nicht über absolute Farben: Schatten und
   Tageslicht ändern die Helligkeit, nicht die Reihenfolge der Kanäle.
     Wasser  b > r und b > g
     Wiese   g ≥ r und g > b
     Sand    sonst (r ≥ g > b) */
export function makeTopDownProbe({ renderer, scene, box, size = 1024, pad = 1.04 }) {
  const c = box.getCenter(new THREE.Vector3());
  const s = box.getSize(new THREE.Vector3());
  const half = (Math.max(s.x, s.z) / 2) * pad;
  const rt = new THREE.WebGLRenderTarget(size, size);
  const cam = new THREE.OrthographicCamera(-half, half, half, -half, 0.1, 200);
  cam.position.set(c.x, box.max.y + 40, c.z);
  cam.up.set(0, 0, -1);
  cam.lookAt(c.x, 0, c.z);
  const buf = new Uint8Array(size * size * 4);
  const prev = renderer.getRenderTarget();
  renderer.setRenderTarget(rt);
  renderer.render(scene, cam);
  renderer.readRenderTargetPixels(rt, 0, 0, size, size, buf);
  renderer.setRenderTarget(prev);
  rt.dispose();

  const at = (wx, wz) => {
    const x = Math.round((((wx - c.x) / half) * 0.5 + 0.5) * (size - 1));
    const y = Math.round(((-(wz - c.z) / half) * 0.5 + 0.5) * (size - 1));
    if (x < 0 || y < 0 || x >= size || y >= size) return null;
    const i = (y * size + x) * 4;
    return [buf[i], buf[i + 1], buf[i + 2]];
  };
  const kindOf = (rgb) => {
    if (!rgb) return null;
    const [r, g, b] = rgb;
    if (r + g + b < 30) return 'x';
    if (b > r && b > g) return 'w';
    if (g >= r && g > b) return 'g';
    return 's';
  };
  /* 3×3-Median in Weltmaß: ein einzelnes Pixel kann auf einer Kante oder in einem Schatten liegen */
  const kind = (wx, wz, spread = half / size * 3) => {
    const votes = {};
    for (const dx of [-spread, 0, spread]) for (const dz of [-spread, 0, spread]) {
      const k = kindOf(at(wx + dx, wz + dz));
      if (k) votes[k] = (votes[k] || 0) + 1;
    }
    const best = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
    return best ? best[0] : null;
  };
  return { at, kind, half, centre: c, size };
}

export function makeViewer(canvas, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(opts.background || 0x1b1030);

  const camera = new THREE.PerspectiveCamera(opts.fov || 26, 1, 0.1, 4000);
  const controls = new OrbitControls(camera, canvas);
  /* Feel: the default damping of 0.05 reads as lag on a scene this small, and pan/zoom speeds
     tuned for a 100-unit city make a 10-unit tool sheet crawl. Distances are clamped per frame()
     so the wheel cannot fly through the parts or park the camera in another county. */
  controls.enableDamping = true;
  controls.dampingFactor = opts.damping ?? 0.14;
  controls.rotateSpeed = opts.rotateSpeed ?? 0.85;
  controls.panSpeed = opts.panSpeed ?? 1;
  controls.zoomSpeed = opts.zoomSpeed ?? 1.1;
  controls.screenSpacePanning = true;
  controls.zoomToCursor = true;
  controls.keyPanSpeed = 18;
  controls.maxPolarAngle = Math.PI * 0.495;

  const day = opts.mood === 'day';
  scene.add(new THREE.HemisphereLight(day ? 0xffffff : 0xdcd6ff, day ? 0x93a2b0 : 0x2a2140, day ? 2.3 : 1.9));
  const key = new THREE.DirectionalLight(day ? 0xfff6e8 : 0xfff3e0, day ? 2.4 : 2.1);
  key.position.set(day ? -26 : -18, day ? 40 : 30, day ? 22 : 16);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const d = 40;
  Object.assign(key.shadow.camera, { left: -d, right: d, top: d, bottom: -d, near: 1, far: 140 });
  scene.add(key);
  const fill = new THREE.DirectionalLight(day ? 0xc8dcff : 0x9f8cff, day ? 0.5 : 0.6);
  fill.position.set(22, 14, -18);
  scene.add(fill);

  const grid = new THREE.GridHelper(80, 20, 0x7b6cc4, 0x3b3060);
  grid.position.y = -0.02;
  grid.visible = false;
  scene.add(grid);

  function resize() {
    const r = canvas.getBoundingClientRect();
    renderer.setSize(Math.max(1, r.width | 0), Math.max(1, r.height | 0), false);
    camera.aspect = Math.max(1, r.width) / Math.max(1, r.height);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  function frame(object, dir = [1, 0.78, 1], pad = 1.12) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const radius = size.length() / 2;
    const dist = (radius * pad) / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2));
    const v = new THREE.Vector3(...dir).normalize().multiplyScalar(dist);
    camera.position.copy(center).add(v);
    controls.target.copy(center);
    camera.near = Math.max(0.01, dist / 200);
    camera.far = dist * 20;
    camera.updateProjectionMatrix();
    controls.minDistance = Math.max(0.05, radius * 0.12);
    controls.maxDistance = dist * 8;
    controls.update();
    controls.saveState();
    return { box, size, center };
  }

  function draw() {
    controls.update();
    renderer.render(scene, camera);
  }
  let ticks = 0, lastTick = performance.now();
  (function loop() {
    requestAnimationFrame(loop);
    ticks++;
    lastTick = performance.now();
    draw();
  })();
  /* Safety net for frames where requestAnimationFrame stalls — this embedded preview stops firing
     rAF once nothing is interacting, which used to leave a STALE image on screen after the scene
     had already changed (S11: switching to the palette rebuilt the root but the canvas kept
     showing the island). The old version retired itself for good once rAF had run once, so a
     later stall was invisible. Now it stays, and draws only while rAF is actually stalled — that
     keeps the out-of-band controls.update() stutter (S7.1) away during normal operation. */
  setInterval(() => { if (performance.now() - lastTick > 400) draw(); }, 150);

  return { renderer, scene, camera, controls, grid, frame, resize, draw, home: () => controls.reset() };
}
