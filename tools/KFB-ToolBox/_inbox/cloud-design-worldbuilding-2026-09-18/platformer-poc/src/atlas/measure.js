/* Gemessene Asset-Wahrheit für das Platformer Game Kit.

   Regel aus PLATFORMER_KIT_MENTAL_MODEL.md §3: minY ist NICHT automatisch der Boden und
   maxY ist NICHT automatisch die Lauffläche. Hier werden deshalb echte Dreiecke im
   Weltraum gesammelt und nach Normalenrichtung ausgewertet:

   - nach oben zeigende, waagerechte Dreiecke  -> Kandidaten für Laufflächen (je Höhe gebündelt)
   - nach unten zeigende                       -> Unterseiten-Abdeckung
   - je Seitenrichtung die FLACHE Fläche exakt in der Bounding-Box-Ebene

   Der letzte Punkt ist der entscheidende: in diesem Kit ist eine planflache Seitenwand
   genau in der Zellkante eine FUGE (join) — sie gehört verdeckt. Eine profilierte,
   abgerundete oder zurückgesetzte Seite ist eine gewollte AUSSENKANTE (edge). Genau diese
   Unterscheidung fehlte in der verworfenen Komposition: Fugen standen als Außenwand frei. */

import * as THREE from 'three';

export const N_TOL = 0.985;      // ~10° Toleranz auf die Normale
export const PLANE_TOL = 0.02;   // Abstand zur Bounding-Box-Ebene
const Y_BUCKET = 0.01;

const DIRS = [
  { key: 'px', label: '+X', v: new THREE.Vector3(1, 0, 0) },
  { key: 'nx', label: '−X', v: new THREE.Vector3(-1, 0, 0) },
  { key: 'pz', label: '+Z', v: new THREE.Vector3(0, 0, 1) },
  { key: 'nz', label: '−Z', v: new THREE.Vector3(0, 0, -1) },
];
export const DIR_KEYS = DIRS.map((d) => d.key);
export const OPPOSITE = { px: 'nx', nx: 'px', pz: 'nz', nz: 'pz' };

const r3 = (n) => Math.round(n * 1000) / 1000;

/* Alle Dreiecke im Modellraum. Skinned Meshes werden gezählt, aber nicht vermessen —
   ihre Ruhepose sagt nichts über Laufflächen. */
export function collectTriangles(root) {
  root.updateWorldMatrix(true, true);
  const tris = [];
  let skinnedTris = 0;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ab = new THREE.Vector3(), ac = new THREE.Vector3(), n = new THREE.Vector3();
  root.traverse((o) => {
    if (!o.isMesh) return;
    const g = o.geometry, pos = g?.attributes?.position;
    if (!pos) return;
    const idx = g.index;
    const count = idx ? idx.count : pos.count;
    if (o.isSkinnedMesh) { skinnedTris += count / 3; return; }
    for (let i = 0; i + 2 < count; i += 3) {
      const i0 = idx ? idx.getX(i) : i, i1 = idx ? idx.getX(i + 1) : i + 1, i2 = idx ? idx.getX(i + 2) : i + 2;
      a.fromBufferAttribute(pos, i0).applyMatrix4(o.matrixWorld);
      b.fromBufferAttribute(pos, i1).applyMatrix4(o.matrixWorld);
      c.fromBufferAttribute(pos, i2).applyMatrix4(o.matrixWorld);
      ab.subVectors(b, a); ac.subVectors(c, a);
      n.crossVectors(ab, ac);
      const len = n.length();
      if (len < 1e-9) continue;
      tris.push({
        a: a.clone(), b: b.clone(), c: c.clone(),
        n: n.clone().multiplyScalar(1 / len),
        area: len / 2,
      });
    }
  });
  return { tris, skinnedTris };
}

/* Waagerechte Flächen je Höhe: Fläche, xz-Ausdehnung, Höhe. sign=+1 oben, -1 unten. */
function horizontalPlanes(tris, sign) {
  const buckets = new Map();
  for (const t of tris) {
    if (t.n.y * sign < N_TOL) continue;
    const y = (t.a.y + t.b.y + t.c.y) / 3;
    const key = Math.round(y / Y_BUCKET);
    let e = buckets.get(key);
    if (!e) buckets.set(key, e = { y: key * Y_BUCKET, area: 0, minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity, count: 0 });
    e.area += t.area; e.count++;
    for (const p of [t.a, t.b, t.c]) {
      if (p.x < e.minX) e.minX = p.x; if (p.x > e.maxX) e.maxX = p.x;
      if (p.z < e.minZ) e.minZ = p.z; if (p.z > e.maxZ) e.maxZ = p.z;
    }
  }
  return [...buckets.values()]
    .map((e) => ({ y: r3(e.y), area: r3(e.area), w: r3(e.maxX - e.minX), d: r3(e.maxZ - e.minZ),
      minX: r3(e.minX), maxX: r3(e.maxX), minZ: r3(e.minZ), maxZ: r3(e.maxZ), tris: e.count }))
    .sort((p, q) => q.area - p.area);
}

/* Seitenbefund je Richtung. Entscheidend ist zuerst, ob dort ÜBERHAUPT Geometrie steht.

   Gemessener Befund am Kit: Cube_Grass_Center besteht aus VIER Dreiecken — Deckel und
   Boden, keine einzige Seitenwand. Die Seitenflächen sind im Kit weggelassen, weil ein
   Center-Teil bauartgemäß von Nachbarn umgeben ist. Steht es am Inselrand, schaut man
   ins Nichts. Genau das zeigt der verworfene Project-Island-Screenshot.

   OPEN  keine zugewandte Geometrie — braucht zwingend einen Nachbarn oder ein Wandpaneel
   WALL  planflache Haut genau in der Zellkante — fertige, zeigbare Fläche
   EDGE  zugewandte Geometrie, aber profiliert/zurückgesetzt (Grasüberhang) — gewollte Außenkante
   PARTIAL  teilweise geschlossen */
function sideFaces(tris, box, size) {
  const out = {};
  for (const d of DIRS) {
    const axis = d.v.x !== 0 ? 'x' : 'z';
    const plane = d.v[axis] > 0 ? box.max[axis] : box.min[axis];
    const crossA = axis === 'x' ? size.y * size.z : size.x * size.y;
    let flat = 0, any = 0;
    for (const t of tris) {
      const dot = t.n.dot(d.v);
      if (dot < N_TOL) continue;
      any += t.area;
      const dist = Math.max(
        Math.abs(t.a[axis] - plane), Math.abs(t.b[axis] - plane), Math.abs(t.c[axis] - plane));
      if (dist <= PLANE_TOL) flat += t.area;
    }
    const ratio = crossA > 1e-9 ? flat / crossA : 0;
    const facing = crossA > 1e-9 ? any / crossA : 0;
    let kind;
    if (facing < 0.02) kind = 'OPEN';
    else if (ratio >= 0.85) kind = 'WALL';
    else if (facing >= 0.3) kind = 'EDGE';
    else kind = 'PARTIAL';
    out[d.key] = {
      label: d.label,
      flatArea: r3(flat),
      facingArea: r3(any),
      crossArea: r3(crossA),
      ratio: r3(ratio),
      facingRatio: r3(facing),
      kind,
    };
  }
  return out;
}

const FAMILY_ORDER = [
  'Character', 'Cubes', 'Enemies', 'Level and Mechanics',
  'Modular Platforms/2D', 'Modular Platforms/3D', 'Modular Platforms/Single Cube',
  'Modular Platforms/Single Height', 'Nature', 'Powerups and Pickups',
];
export function familyOf(path) {
  const i = path.indexOf('/glTF/');
  const f = i > 0 ? path.slice(0, i) : path.split('/')[0];
  return f;
}
export function familyRank(f) {
  const i = FAMILY_ORDER.indexOf(f);
  return i < 0 ? FAMILY_ORDER.length : i;
}

/* Rollenvorschlag AUS DER MESSUNG — der Dateiname wird nur gegengeprüft.
   Geschlossene Seiten (WALL oder EDGE) bestimmen die Rolle, nicht der Name. */
function proposeRole(rec) {
  const { size, walkable, sides } = rec;
  const foot = size[0] * size[2];
  const closed = DIR_KEYS.filter((k) => sides[k].kind === 'WALL' || sides[k].kind === 'EDGE');
  const open = DIR_KEYS.filter((k) => sides[k].kind === 'OPEN');
  const coverage = walkable && foot > 1e-6 ? walkable.area / foot : 0;
  const list = (ks) => ks.map((k) => sides[k].label).join(' ') || '—';

  /* Paneele: eine Dimension ist praktisch 0 — eine einzelne Haut, kein Körper.
     Damit baut man große Inseln als Kiste: Deckel oben, Wandpaneele an den Flanken. */
  const thin = size.map((v) => v < 0.05);
  if (thin[1] && !thin[0] && !thin[2]) {
    return { role: walkable ? 'PANEL_LID_TOP' : 'PANEL_LID_BOTTOM',
      reason: `waagerechtes Paneel, Höhe ${size[1].toFixed(3)} — ${walkable ? 'Deckel (Normale nach oben)' : 'Bodenplatte (Normale nach unten)'}` };
  }
  if ((thin[0] || thin[2]) && size[1] > 0.5) {
    return { role: 'PANEL_WALL',
      reason: `senkrechtes Wandpaneel, Dicke ${(thin[0] ? size[0] : size[2]).toFixed(3)} — Flankenhaut für gestapelte Inseln` };
  }
  if (!walkable || coverage < 0.45) {
    /* Hohle Haut: kein Deckel, kein Boden, aber geschlossene Flanken — die Mantelteile
       für gestapelte Inseln (Corner/Side "…Center_Tall", "…Bottom_Tall"). */
    if (rec.family.startsWith('Modular Platforms') && !walkable
        && rec.bottomClosure.kind === 'OPEN' && closed.length) {
      return { role: closed.length >= 2 ? 'SHELL_CORNER' : 'SHELL_SIDE',
        reason: `weder Deckel noch Boden, ${closed.length} geschlossene Flanke(n) (${list(closed)}) — Mantelteil für gestapelte Inseln` };
    }
    if (rec.family.startsWith('Modular Platforms')) {
      return { role: 'BOTTOM', reason: (walkable
        ? `Deckfläche nur ${Math.round(coverage * 100)} % des Grundrisses`
        : 'keine waagerechte Deckfläche') + ' — Unterbau, nicht begehbar' };
    }
    return { role: 'PROP', reason: walkable ? `Deckfläche nur ${Math.round(coverage * 100)} % des Grundrisses` : 'keine waagerechte Deckfläche' };
  }
  let pattern;
  if (closed.length === 0) pattern = 'CENTER';
  else if (closed.length === 4) pattern = 'SINGLE';
  else if (closed.length === 1) pattern = 'SIDE';
  else if (closed.length === 3) pattern = 'END';
  else pattern = OPPOSITE[closed[0]] === closed[1] ? 'SPAN' : 'CORNER';
  return {
    role: pattern,
    reason: `${closed.length} geschlossene Seite(n) (${list(closed)}), ` +
            `${open.length} ohne Geometrie (${list(open)})` +
            (open.length ? ' — diese Seiten brauchen einen Nachbarn' : ''),
  };
}

function nameHint(name) {
  const n = name.toLowerCase();
  if (/cornerbottom/.test(n)) return 'CORNER_BOTTOM';
  if (/cornercenter/.test(n)) return 'CORNER_CENTER';
  if (/sidebottom/.test(n)) return 'SIDE_BOTTOM';
  if (/sidecenter/.test(n)) return 'SIDE_CENTER';
  if (/corner/.test(n)) return 'CORNER';
  if (/1x1end/.test(n)) return 'END';
  if (/1x1center/.test(n)) return 'CENTER';
  if (/_side/.test(n)) return 'SIDE';
  if (/bottom/.test(n)) return 'BOTTOM';
  if (/center/.test(n)) return 'CENTER';
  if (/single/.test(n)) return 'SINGLE';
  return null;
}

export function measureAsset(name, path, gltf) {
  const root = gltf.scene;
  const { tris, skinnedTris } = collectTriangles(root);
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const up = horizontalPlanes(tris, 1);
  const down = horizontalPlanes(tris, -1);
  const sides = sideFaces(tris, box, size);

  const foot = size.x * size.z;
  /* Lauffläche = größte nach oben zeigende Ebene mit relevanter Fläche. Ausdrücklich
     NICHT maxY: bei Bäumen/Requisiten liegt maxY in der Krone. */
  const walkable = up.length ? up[0] : null;
  const walkableIsTop = walkable ? Math.abs(walkable.y - box.max.y) <= 0.05 : false;

  const bottomPlane = down.find((p) => Math.abs(p.y - box.min.y) <= 0.05) || null;
  const bottomRatio = bottomPlane && foot > 1e-9 ? bottomPlane.area / foot : 0;

  const nodes = [], materials = new Map();
  let meshes = 0, skinned = false;
  root.traverse((o) => {
    if (o.name) nodes.push(o.name);
    if (o.isMesh) meshes++;
    if (o.isSkinnedMesh) skinned = true;
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    for (const m of mats) {
      if (!m || materials.has(m.uuid)) continue;
      const maps = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap']
        .filter((k) => m[k]).map((k) => {
          const src = m[k].image?.currentSrc || m[k].image?.src || m[k].source?.data?.src || '';
          return `${k}:${decodeURIComponent(src.split('/').pop() || '?')}`;
        });
      materials.set(m.uuid, {
        name: m.name || '(unbenannt)',
        type: m.type,
        color: m.color ? '#' + m.color.getHexString() : null,
        maps,
      });
    }
  });

  const rec = {
    name, path,
    family: familyOf(path),
    min: box.min.toArray().map(r3),
    max: box.max.toArray().map(r3),
    size: size.toArray().map(r3),
    center: center.toArray().map(r3),
    bottomY: r3(box.min.y),
    topY: r3(box.max.y),
    footprintArea: r3(foot),
    triangles: tris.length,
    skinnedTriangles: Math.round(skinnedTris),
    meshes,
    skinned,
    clips: gltf.animations.map((c) => ({ name: c.name, duration: r3(c.duration) })),
    nodes: nodes.slice(0, 24),
    nodeCount: nodes.length,
    materials: [...materials.values()],
    /* Pivot: das Modell wird bei Identität vermessen, der Ursprung liegt also bei 0,0,0.
       Gemeldet wird, WO die Box um den Ursprung liegt. */
    pivot: {
      inBoxX: foot > 0 ? r3((0 - box.min.x) / (size.x || 1)) : null,
      inBoxY: r3((0 - box.min.y) / (size.y || 1)),
      inBoxZ: foot > 0 ? r3((0 - box.min.z) / (size.z || 1)) : null,
      atBottom: Math.abs(box.min.y) <= 0.02,
      centeredXZ: Math.abs(center.x) <= 0.02 && Math.abs(center.z) <= 0.02,
    },
    upPlanes: up.slice(0, 6),
    downPlanes: down.slice(0, 4),
    walkable: walkable ? { ...walkable, isBoxTop: walkableIsTop, coverage: foot > 1e-9 ? r3(walkable.area / foot) : 0 } : null,
    bottomClosure: { ratio: r3(bottomRatio), kind: bottomRatio >= 0.85 ? 'CLOSED' : bottomRatio >= 0.3 ? 'PARTIAL' : 'OPEN' },
    sides,
  };

  const p = proposeRole(rec);
  rec.role = p.role;
  rec.roleReason = p.reason;
  rec.nameHint = nameHint(name);
  rec.roleMismatch = !!(rec.nameHint && rec.role !== 'PROP' && rec.nameHint !== rec.role
    && !(rec.nameHint.startsWith(rec.role) || rec.role.startsWith(rec.nameHint.split('_')[0])));
  rec.openSides = DIR_KEYS.filter((k) => sides[k].kind === 'OPEN');
  rec.closedSides = DIR_KEYS.filter((k) => sides[k].kind === 'WALL' || sides[k].kind === 'EDGE');
  rec.edgeSides = DIR_KEYS.filter((k) => sides[k].kind === 'EDGE');
  /* Wie viele der vier 90°-Drehungen ergeben eine UNTERSCHIEDLICHE Seitensignatur. */
  const sig = DIR_KEYS.map((k) => sides[k].kind);
  const rot = (s, n) => [s[(0 + n) % 4], s[(1 + n) % 4], s[(2 + n) % 4], s[(3 + n) % 4]].join();
  const seen = new Set([0, 1, 2, 3].map((n) => rot(['px', 'pz', 'nx', 'nz'].map((k) => sides[k].kind), n)));
  rec.distinctRotations = seen.size;
  rec.sideSignature = sig.join('/');
  return rec;
}

/* Rasterschritt und Modulhöhe werden aus den Plattformteilen erschlossen, nicht gesetzt. */
export function deriveGridFacts(records) {
  const mode = (values) => {
    const m = new Map();
    for (const v of values) { const k = v.toFixed(3); m.set(k, (m.get(k) || 0) + 1); }
    let best = null;
    for (const [k, n] of m) if (!best || n > best.n || (n === best.n && +k < +best.k)) best = { k, n };
    return best ? { value: +best.k, count: best.n, distinct: m.size } : null;
  };
  const plat = records.filter((r) => r.role !== 'PROP' && r.family.startsWith('Modular Platforms'));
  const single = plat.filter((r) => r.family.endsWith('Single Height'));
  /* Deckel (Höhe ~0) verfälschen den vertikalen Modulschritt — getrennt ausweisen. */
  const tall = plat.filter((r) => r.family.endsWith('3D') && r.size[1] > 0.05);
  const lids = plat.filter((r) => r.size[1] <= 0.05);
  const cells = new Map();
  for (const r of plat) {
    const key = `${r.size[0].toFixed(2)} × ${r.size[1].toFixed(2)} × ${r.size[2].toFixed(2)}`;
    (cells.get(key) || cells.set(key, []).get(key)).push(r.name);
  }
  return {
    gridStepX: mode(plat.map((r) => r.size[0])),
    gridStepZ: mode(plat.map((r) => r.size[2])),
    singleHeight: mode(single.map((r) => r.size[1])),
    tallHeight: mode(tall.map((r) => r.size[1])),
    cellClasses: [...cells.entries()].map(([k, v]) => ({ cell: k, pieces: v })).sort((a, b) => b.pieces.length - a.pieces.length),
    platformCount: plat.length,
    lids: lids.map((r) => ({ name: r.name, height: r.size[1], walkableY: r.walkable ? r.walkable.y : null })),
  };
}

/* Nachbarschaft: eine OPEN-Seite MUSS gedeckt werden. Passend ist ein Teil mit gleicher
   Höhe und gleicher Querbreite, dessen zugewandte Seite nicht profiliert übersteht —
   eine EDGE-Seite würde in die Nachbarzelle ragen. */
export function deriveNeighbours(records, tol = 0.06) {
  const plat = records.filter((r) => !['PROP'].includes(r.role) && r.family.startsWith('Modular Platforms'));
  const out = new Map();
  for (const r of plat) {
    const per = {};
    for (const k of DIR_KEYS) {
      if (r.sides[k].kind !== 'OPEN') { per[k] = null; continue; }
      const perp = k === 'px' || k === 'nx' ? 2 : 0;
      per[k] = plat.filter((o) => o !== r
        && o.sides[OPPOSITE[k]].kind !== 'EDGE'
        && Math.abs(o.size[1] - r.size[1]) <= tol
        && Math.abs(o.size[perp] - r.size[perp]) <= tol)
        .map((o) => o.name);
    }
    out.set(r.name, per);
  }
  return out;
}
