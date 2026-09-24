/* KFB Animation Lab · audit — C0: MESSEN, NICHTS SCHNEIDEN.
 *
 * Briefing v3 §Sprint C0: vor jeder Entfernung liegt eine Komponententabelle vor. Dieses Modul
 * lädt ein Modell und zählt, was drin ist — Netze, Knochen, zusammenhängende Inseln, Hüllmaße,
 * Materialien, Bildtafeln, Clips. Es ändert nichts, es blendet nichts aus, es schneidet nichts.
 *
 * WARUM INSELN: die Frage des Briefings ist nicht »wie groß ist Carl«, sondern »sind Mund, Augen,
 * Pfeile und Platten EIGENE Bauteile«. Das entscheidet, ob ein Sichtbarkeitsschalter genügt oder
 * ob geschnitten werden muß (`CUT_REQUIRED`). Eine Insel ist eine über Dreiecke zusammenhängende
 * Punktmenge — genau die Grenze, an der ein Schalter möglich ist.
 *
 * EIGENTUM: dieses Modul besitzt nur die Messung. Es kennt keinen Graft, kein Gesicht, kein Rig.
 */
export const SCHEMA = 'kfb.component-audit.v1';

/* Inseln über Union-Find auf den Dreiecken. Punkte, die auf derselben Stelle liegen, aber nicht
   denselben Index teilen (harte Kanten), gelten als GETRENNT — das ist die Wahrheit des Puffers,
   und sie wird als solche gemeldet (`weldedIslands` zählt zusätzlich mit Positions-Verschmelzung). */
function islands(THREE, mesh, weld) {
  const g = mesh.geometry, pos = g.attributes.position;
  if (!pos) return null;
  const n = pos.count;
  const parent = new Int32Array(n);
  for (let i = 0; i < n; i++) parent[i] = i;
  const find = (a) => { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; };
  const join = (a, b) => { a = find(a); b = find(b); if (a !== b) parent[b] = a; };

  if (weld) {
    /* Positions-Verschmelzung auf 4 Stellen — gleiche Stelle, geteilte Naht. */
    const map = new Map();
    for (let i = 0; i < n; i++) {
      const k = pos.getX(i).toFixed(4) + ',' + pos.getY(i).toFixed(4) + ',' + pos.getZ(i).toFixed(4);
      if (map.has(k)) join(map.get(k), i); else map.set(k, i);
    }
  }
  const ix = g.index ? g.index.array : null;
  if (ix) for (let t = 0; t < ix.length; t += 3) { join(ix[t], ix[t + 1]); join(ix[t + 1], ix[t + 2]); }
  else for (let t = 0; t < n; t += 3) { join(t, t + 1); join(t + 1, t + 2); }

  const groups = new Map();
  const triOf = new Map();
  const count = ix ? ix.length / 3 : n / 3;
  for (let t = 0; t < count; t++) {
    const a = ix ? ix[t * 3] : t * 3;
    const r = find(a);
    triOf.set(r, (triOf.get(r) || 0) + 1);
    if (!groups.has(r)) groups.set(r, new THREE.Box3());
  }
  const v = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const r = find(i);
    const b = groups.get(r); if (!b) continue;
    mesh.getVertexPosition ? mesh.getVertexPosition(i, v) : v.fromBufferAttribute(pos, i);
    b.expandByPoint(v);
  }
  const out = [];
  const order = [];
  groups.forEach((box, r) => {
    const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
    order.push(r);
    out.push({
      root: r,
      tris: triOf.get(r) || 0,
      center: [+c.x.toFixed(3), +c.y.toFixed(3), +c.z.toFixed(3)],
      size: [+s.x.toFixed(3), +s.y.toFixed(3), +s.z.toFixed(3)],
      spansX0: box.min.x < 0 && box.max.x > 0,
    });
  });
  out.sort((a, b) => b.tris - a.tris);
  /* Zugehörigkeit je Punkt — damit die Inseln BEBILDERT werden können. Eine Insel, die nur als
     Zahl existiert, läßt sich nicht benennen; das Briefing verbietet Namen aus der Lage zu raten. */
  const rank = new Map(); out.forEach((o, i) => rank.set(o.root, i));
  const islandOf = new Int32Array(n);
  for (let i = 0; i < n; i++) { const r = rank.get(find(i)); islandOf[i] = r === undefined ? -1 : r; }
  out.forEach((o) => { delete o.root; });
  return { list: out, islandOf };
}

export async function auditModel({ THREE, loader, url, label, path, weld = true, log = () => {} }) {
  const t0 = performance.now();
  let gltf;
  try { gltf = await loader.loadAsync(url); }
  catch (e) { return { schema: SCHEMA, label, path, status: 'LOAD_FAILED', error: String((e && e.message) || e) }; }
  const ms = Math.round(performance.now() - t0);
  const root = gltf.scene;
  root.updateMatrixWorld(true);

  const meshes = [], bones = [], mats = new Map();
  root.traverse((o) => {
    if (o.isBone) bones.push(o);
    if (o.isMesh || o.isSkinnedMesh) {
      meshes.push(o);
      [].concat(o.material).forEach((m) => { if (m && !mats.has(m.uuid)) mats.set(m.uuid, m); });
    }
  });
  const box = new THREE.Box3().setFromObject(root);
  const size = box.isEmpty() ? null : box.getSize(new THREE.Vector3());

  const rows = meshes.map((m) => {
    const res = islands(THREE, m, weld);
    const isl = (res && res.list) || [];
    if (res) m.userData.kfbIslandOf = res.islandOf;
    const pos = m.geometry.attributes.position;
    /* Verformungsziele (Blend Shapes) sind der einzige Weg, auf dem ein Netz OHNE Skelett
       Gesichtsausdrücke mitbringen kann. Wer sie nicht zählt, kann »der Mund ist nicht
       animierbar« nicht behaupten — er kann es nur vermuten. */
    const morphs = m.morphTargetDictionary ? Object.keys(m.morphTargetDictionary) : [];
    return {
      name: m.name || '(no name)',
      skinned: !!m.isSkinnedMesh,
      verts: pos ? pos.count : 0,
      tris: m.geometry.index ? m.geometry.index.count / 3 : (pos ? pos.count / 3 : 0),
      materials: [].concat(m.material).map((x) => (x && x.name) || '(no name)'),
      drawGroups: m.geometry.groups.length,
      morphTargets: morphs.length, morphNames: morphs,
      islands: isl.length,
      islandTable: isl,
      note: isl.length === 1 ? 'ONE ISLAND — a feature inside it needs CUT_REQUIRED, a visibility switch cannot reach it' : isl.length + ' separable islands',
    };
  });

  /* Blickrichtung: nur aus Knochen ableitbar (Zehen vor dem Fuß, IK-Ziele vor den Knien).
     Ein reines Netz gibt sie NICHT her — dann steht das hier, statt geraten zu werden. */
  const bn = {};
  bones.forEach((b) => { bn[b.name.replace(/[.\s_-]/g, '').toLowerCase()] = b; });
  let facing = 'NOT DERIVABLE FROM GEOMETRY — mesh only, no bones';
  if (bones.length) {
    const wp = (o) => o.getWorldPosition(new THREE.Vector3());
    const toe = bn.toesl || bn.toel || bn.toes, foot = bn.footl || bn.foot;
    if (toe && foot) { const d = wp(toe).sub(wp(foot)); d.y = 0; facing = 'toes → ' + [d.x, d.z].map((v) => v.toFixed(3)).join('/'); }
    else facing = 'bones present, no toe/foot pair — measure per case';
  }

  const doc = {
    schema: SCHEMA, label, path, status: 'OK', ms, generatedAt: new Date().toISOString(),
    bounds: { size: size ? size.toArray().map((v) => +v.toFixed(3)) : null, min: box.isEmpty() ? null : box.min.toArray().map((v) => +v.toFixed(3)) },
    skeleton: { bones: bones.length, names: bones.map((b) => b.name), class: bones.length ? (bones.length >= 20 ? 'KayKit-like biped (≥20 bones)' : 'partial rig') : 'NONE — static mesh' },
    animations: (gltf.animations || []).map((c) => ({ name: c.name, dur: +c.duration.toFixed(3), tracks: c.tracks.length })),
    meshes: rows,
    materials: [...mats.values()].map((m) => ({ name: m.name || '(no name)', color: m.color ? '#' + m.color.getHexString() : null, map: m.map && m.map.image ? m.map.image.width + '×' + m.map.image.height : null })),
    facing,
    rule: 'Measured, nothing cut. Island counts say where a visibility switch is possible; a fused feature is CUT_REQUIRED.',
  };
  log(label + ' · ' + meshes.length + ' meshes · ' + bones.length + ' bones · '
    + rows.reduce((a, r) => a + r.islands, 0) + ' islands · ' + ms + ' ms');
  return { doc, scene: root, gltf, meshes };
}

export const PALETTE = [0xe6a13c, 0x4f9ad6, 0x7ec46b, 0xd6604f, 0xb07ed6, 0xd6c84f, 0x4fd6c0, 0xd64f9a,
  0x8a8f95, 0x9ad64f, 0x4f6fd6, 0xd68a4f, 0x6bd6a1, 0xd64f4f, 0x4fc0d6, 0xc0d64f,
  0xa14fd6, 0x4fd66b, 0xd6a14f, 0x6b4fd6, 0x4f8ad6];

/* EINZELNE INSELN AUSBLENDEN, OHNE ZU SCHNEIDEN.
 *
 * Eine Insel innerhalb eines Netzes hat kein eigenes `visible`. Erreichbar ist sie nur über den
 * Dreiecks-Index: der ursprüngliche Index wird aufbewahrt, gezeichnet wird eine gefilterte Kopie.
 * Die DATEI bleibt unberührt, die Geometrie im Speicher behält alle Punkte — `show(null)` stellt
 * den Auslieferungszustand wieder her. Mehrere Zeichengruppen (mehrere Materialien in einem Netz)
 * werden NICHT gefiltert, sondern gemeldet: dort würde ein Filter die Materialzuordnung zerreden.
 */
export function islandVisibility({ THREE, meshes }) {
  const items = [];
  (meshes || []).forEach((m) => {
    const io = m.userData.kfbIslandOf, g = m.geometry, pos = g && g.attributes.position;
    if (!io || !pos) return;
    if (g.groups && g.groups.length > 1) { items.push({ m, unsupported: 'multiple draw groups' }); return; }
    if (!m.userData.kfbIndexOrig) {
      m.userData.kfbIndexOrig = g.index ? g.index.array.slice() : null;
      if (!g.index) {
        const a = new Uint32Array(pos.count);
        for (let i = 0; i < pos.count; i++) a[i] = i;
        m.userData.kfbIndexOrig = a;
        g.setIndex(new THREE.BufferAttribute(a.slice(), 1));
      }
    }
    items.push({ m, io, orig: m.userData.kfbIndexOrig });
  });
  const show = (allow) => {
    const out = { meshes: 0, trisShown: 0, trisTotal: 0, unsupported: [] };
    items.forEach((it) => {
      if (it.unsupported) { out.unsupported.push((it.m.name || 'mesh') + ': ' + it.unsupported); return; }
      const { m, io, orig } = it;
      out.meshes++; out.trisTotal += orig.length / 3;
      if (!allow) {
        m.geometry.setIndex(new THREE.BufferAttribute(orig.slice(), 1));
        out.trisShown += orig.length / 3;
      } else {
        const keep = [];
        for (let t = 0; t < orig.length; t += 3) {
          if (allow.has(io[orig[t]])) { keep.push(orig[t], orig[t + 1], orig[t + 2]); }
        }
        const arr = keep.length > 65535 ? new Uint32Array(keep) : new Uint16Array(keep);
        m.geometry.setIndex(new THREE.BufferAttribute(arr, 1));
        out.trisShown += keep.length / 3;
      }
      m.geometry.computeBoundingSphere();
    });
    return out;
  };
  return { show, restore: () => show(null) };
}

/* Die Rahmen der Inseln IN WELTKOORDINATEN. Die Tabelle aus `auditModel` rechnet im Netz; für
   eine Kamera braucht es den Ort in der Szene. Reihenfolge und Nummer sind dieselben wie in
   `islandTable` (Rang nach Dreieckszahl), damit Bild und Tabelle dieselbe Insel meinen. */
export function islandEntries({ THREE, meshes }) {
  const out = [];
  (meshes || []).forEach((m, mi) => {
    const io = m.userData.kfbIslandOf, pos = m.geometry && m.geometry.attributes.position;
    if (!io || !pos) return;
    m.updateWorldMatrix(true, false);
    const boxes = new Map(), v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      const g = io[i]; if (g < 0) continue;
      v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
      if (!boxes.has(g)) boxes.set(g, new THREE.Box3());
      boxes.get(g).expandByPoint(v);
    }
    [...boxes.keys()].sort((a, b) => a - b).forEach((g) => {
      const box = boxes.get(g);
      out.push({
        mesh: m, meshIndex: mi, meshName: m.name || '(no name)', idx: g, box,
        center: box.getCenter(new THREE.Vector3()), size: box.getSize(new THREE.Vector3()),
      });
    });
  });
  return out;
}

/* EINE Insel hervorheben, alle anderen stumm. Die Karte sagt, wieviele Teile es gibt — welches
   davon der Mund ist, sagt erst ein Bild JE Teil. Ein Farbpuffer wird einmal angelegt und je
   Bild umgeschrieben; Geometrie, Material und Sichtbarkeit des Modells bleiben unberührt.
   `setFocus(null)` malt alle Inseln in Palettenfarben — das Kontrollbild im selben Satz. */
export function focusPainter({ THREE, meshes, accent = 0xcc0033, dim = 0x9b988f }) {
  const items = [];
  (meshes || []).forEach((m) => {
    const io = m.userData.kfbIslandOf, pos = m.geometry && m.geometry.attributes.position;
    if (!io || !pos) return;
    const n = pos.count, col = new Float32Array(n * 3);
    const prevAttr = m.geometry.getAttribute('color'), prevMat = m.material;
    m.geometry.setAttribute('color', new THREE.BufferAttribute(col, 3));
    m.material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0, flatShading: true });
    items.push({ m, io, n, prevAttr, prevMat });
  });
  const c = new THREE.Color();
  const setFocus = (focus) => {
    items.forEach(({ m, io, n }) => {
      const attr = m.geometry.getAttribute('color'), arr = attr.array;
      const hit = focus && focus.mesh === m;
      for (let i = 0; i < n; i++) {
        const g = io[i] < 0 ? 0 : io[i];
        const hex = !focus ? PALETTE[g % PALETTE.length] : (hit && g === focus.idx ? accent : dim);
        c.setHex(hex);
        arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b;
      }
      attr.needsUpdate = true;
    });
  };
  setFocus(null);
  return { palette: PALETTE, accent, dim, setFocus,
    restore: () => items.forEach(({ m, prevAttr, prevMat }) => {
      try { m.material.dispose(); } catch (e) {}
      m.material = prevMat;
      if (prevAttr) m.geometry.setAttribute('color', prevAttr); else m.geometry.deleteAttribute('color');
    }) };
}

/* Die Inseln SICHTBAR machen. Ein Farbton je Insel als Punktfarbe — die Geometrie bleibt
   unangetastet, das Material wird nur für die Dauer der Ansicht getauscht. Rückweg inbegriffen. */
export function colourIslands({ THREE, meshes, on = true }) {
  const restore = [];
  const palette = PALETTE;
  (meshes || []).forEach((m) => {
    const io = m.userData.kfbIslandOf;
    if (!io || !m.geometry.attributes.position) return;
    const n = m.geometry.attributes.position.count;
    const col = new Float32Array(n * 3);
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      c.setHex(palette[(io[i] < 0 ? 0 : io[i]) % palette.length]);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    const prevAttr = m.geometry.getAttribute('color');
    m.geometry.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const prevMat = m.material;
    m.material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0, flatShading: true });
    restore.push(() => {
      m.material.dispose(); m.material = prevMat;
      if (prevAttr) m.geometry.setAttribute('color', prevAttr); else m.geometry.deleteAttribute('color');
    });
  });
  return { palette, restore: () => restore.forEach((f) => { try { f(); } catch (e) {} }) };
}
