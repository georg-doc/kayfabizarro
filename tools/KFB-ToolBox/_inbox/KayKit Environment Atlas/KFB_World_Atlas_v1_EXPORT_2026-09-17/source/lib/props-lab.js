/* Props lab · shared helpers for packs that have no raster (forest, tools, bits).
   For prop packs the useful knowledge is SCALE and VARIANT COUNT, not grid rules — so these
   helpers lay parts out by their own measured size instead of on a module. */
import * as THREE from 'three';
import { instance, measured, measure } from './kit-lab.js';

/* palette: every part on a grid, spacing derived from the largest measured footprint */
export async function paletteGrid(pack, names, opts = {}) {
  const g = new THREE.Group();
  for (const name of names) { try { await measure(pack, name); } catch (e) { /* reported by caller */ } }
  const recs = names.map((n) => measured.get(pack + '/' + n)).filter(Boolean);
  const step = (opts.spacing ?? 1.25) * Math.max(...recs.map((r) => Math.max(r.size[0], r.size[2])));
  const cols = opts.columns || Math.ceil(Math.sqrt(recs.length));
  let i = 0;
  for (const name of names) {
    const rec = measured.get(pack + '/' + name);
    if (!rec) { i++; continue; }
    const node = await instance(pack, name);
    node.position.set((i % cols) * step, 0, Math.floor(i / cols) * step);
    node.userData.part = { pack, name, size: rec.size };
    g.add(node);
    i++;
    opts.onProgress?.(i, names.length);
  }
  g.userData.step = step;
  return g;
}

/* scale row: parts sorted by height, lined up with real gaps, on a 1-unit reference ladder */
export async function scaleRow(pack, names, opts = {}) {
  const g = new THREE.Group();
  for (const name of names) { try { await measure(pack, name); } catch (e) {} }
  const recs = names.map((n) => measured.get(pack + '/' + n)).filter(Boolean)
    .sort((a, b) => a.size[1] - b.size[1]);
  const gap = opts.gap ?? 0.18;
  let x = 0, maxH = 0;
  for (const rec of recs) {
    const node = await instance(pack, rec.name);
    node.position.set(x + rec.size[0] / 2, 0, 0);
    node.userData.part = { pack, name: rec.name, size: rec.size };
    g.add(node);
    x += rec.size[0] + gap;
    maxH = Math.max(maxH, rec.size[1]);
  }
  /* reference ladder: a line every whole unit of height */
  const mat = new THREE.LineBasicMaterial({ color: opts.ladderColor ?? 0x6b7a54 });
  for (let y = 1; y <= Math.ceil(maxH); y++) {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, y, 0), new THREE.Vector3(x, y, 0)]);
    g.add(new THREE.Line(geo, mat));
  }
  g.userData.extent = x;
  g.userData.maxH = maxH;
  return g;
}

/* Contact sheet — the layout the pack's own overview sheet uses: every part lying on the ground,
   sorted, nothing touching. Hand-typed offsets cannot do this (that is how S7 ended up with tools
   stuck inside each other), so every number here comes from the rendered bounding box:
   1. orientation — a part whose height beats its footprint is laid down (rotation.x = -90°),
      unless it is on the `stand` list (anvil, bucket, lantern … things that stand in the sheet);
   2. position — the node is pushed by the DIFFERENCE between its measured box and the target cell,
      which makes pivot offsets irrelevant: box.min.x lands on the cursor, box.min.y on the ground;
   3. advance — the cursor moves by the part's own measured length plus padding, so the next part
      cannot reach into it. Proven afterwards by auditFootprints(). */
export async function contactSheet(pack, rows, opts = {}) {
  const g = new THREE.Group();
  const pad = opts.pad ?? 0.3, rowGap = opts.rowGap ?? 0.6;
  const stand = new Set(opts.stand || []);
  const layRatio = opts.layRatio ?? 1.1;
  const names = rows.flatMap((r) => r.parts);
  /* one part first so the shared pack texture is in the browser cache, then small batches */
  if (names.length) await measure(pack, names[0]).catch(() => null);
  for (let i = 1; i < names.length; i += 6) {
    await Promise.all(names.slice(i, i + 6).map((n) => measure(pack, n).catch(() => null)));
    opts.onProgress?.(Math.min(i + 6, names.length), names.length);
  }
  const rowInfo = [];
  let z = 0, laid = 0, missing = [];
  for (const row of rows) {
    const items = [];
    for (const name of row.parts) {
      const rec = measured.get(pack + '/' + name);
      if (!rec) { missing.push(name); continue; }
      const node = await instance(pack, name);
      const lay = !stand.has(name) && rec.size[1] > Math.max(rec.size[0], rec.size[2]) * layRatio;
      if (lay) { node.rotation.x = -Math.PI / 2; laid++; }
      if (row.yaw) node.rotation.y = THREE.MathUtils.degToRad(row.yaw);
      node.updateMatrixWorld(true);
      const b = new THREE.Box3().setFromObject(node);
      items.push({ name, node, b, lay, size: b.getSize(new THREE.Vector3()), native: rec.size });
    }
    if (opts.sort !== null) items.sort((a, b) => b.size.x * b.size.z - a.size.x * a.size.z);
    const depth = items.length ? Math.max(...items.map((i) => i.size.z)) : 0;
    let x = 0;
    for (const it of items) {
      it.node.position.x += x - it.b.min.x;
      it.node.position.z += (z + (depth - it.size.z) / 2) - it.b.min.z;
      it.node.position.y += -it.b.min.y;
      g.add(it.node);
      x += it.size.x + pad;
    }
    const width = Math.max(0, x - pad);
    for (const it of items) {
      it.node.position.x -= width / 2;              // centre the row on the sheet axis
      it.node.updateMatrixWorld(true);
      it.node.userData.recipe = {
        a: pack + ':' + it.name, p: it.node.position.toArray().map((v) => +v.toFixed(3)),
        rx: it.lay ? -90 : 0, r: row.yaw || 0, station: row.name, lay: it.lay,
        footprint: [+it.size.x.toFixed(3), +it.size.z.toFixed(3)], height: +it.size.y.toFixed(3)
      };
      it.node.userData.part = { pack, name: it.name, size: it.native, station: row.name };
    }
    rowInfo.push({ name: row.name, count: items.length, width: +width.toFixed(2), depth: +depth.toFixed(2) });
    z += depth + rowGap;
  }
  /* centre the whole sheet in Z so framing and the reference overlay line up */
  g.updateMatrixWorld(true);
  const cz = new THREE.Box3().setFromObject(g).getCenter(new THREE.Vector3()).z;
  for (const n of g.children) {
    n.position.z -= cz;
    n.updateMatrixWorld(true);
    if (n.userData.recipe) n.userData.recipe.p = n.position.toArray().map((v) => +v.toFixed(3));
  }
  g.userData.sheet = { rows: rowInfo, laid, missing, count: g.children.length, pad, rowGap };
  return g;
}

/* deterministic scatter — same seed, same forest. specs: [{names,count,radius,inner,scale:[lo,hi],yaw}] */
export function scatter(specs, seed = 1, opts = {}) {
  let s = seed >>> 0;
  const rnd = () => (((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296));
  const placed = [];
  const minDist = opts.minDist ?? 0.6;
  for (const spec of specs) {
    let made = 0, guard = 0;
    while (made < spec.count && guard++ < spec.count * 60) {
      const a = rnd() * Math.PI * 2;
      const r = spec.inner + Math.sqrt(rnd()) * (spec.radius - spec.inner);
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const d = spec.minDist ?? minDist;
      if (placed.some((p) => (p.p[0] - x) ** 2 + (p.p[2] - z) ** 2 < d * d)) continue;
      const sc = spec.scale ? spec.scale[0] + rnd() * (spec.scale[1] - spec.scale[0]) : 1;
      placed.push({
        a: spec.pack + ':' + spec.names[Math.floor(rnd() * spec.names.length)],
        p: [x, 0, z], r: rnd() * 360, s: +sc.toFixed(3), band: spec.band
      });
      made++;
    }
  }
  return placed;
}
