/* lab-v4/carlrig.js — CapsuleCarl-Rig: Materialzonen (Farbe + Ausblenden), Mund-Schließung,
   Gesichts-Montage (Augen/Braue/Nase/Bart/Mund aus PetStudio, lab-v2/vendor, UNBERÜHRT).

   Baut NUR auf einem bereits geladenen, auditierten Wirt auf (mesh.userData.kfbIslandOf aus
   lab-v2/audit.js) — misst nichts neu, schneidet nichts an der QUELLE. Die Insel-Trennung selbst
   ist neue Geometrie im Speicher, die Datei bleibt unberührt (dieselbe Regel wie audit.js).

   C0-Befund, gemessen 13.09.: der Mund ist ein echter Hohlraum, keine Textur — die Öffnung gehört
   zur größten Insel selbst (dem Körper). Schließen heißt darum: die Randschleife DIESER Insel
   finden, mit einem Fächer aus dem Mittelpunkt kappen, Ausrichtung an den vorhandenen Normalen der
   Randpunkte PRÜFEN statt aus der Kantenreihenfolge zu raten. */

/* Jedes Dreieck einer Insel teilt einen Union-Find-Wurzelknoten (audit.js: die drei Eckpunkte
   eines Dreiecks liegen immer im selben Wurzelknoten) — ein Eckpunkt je Dreieck genügt darum, um
   das Dreieck seiner Insel zuzuordnen. */
export function splitIslands({ THREE, mesh }) {
  const g = mesh.geometry, pos = g.attributes.position, nrm = g.attributes.normal, uv = g.attributes.uv;
  const idxAttr = g.index, io = mesh.userData.kfbIslandOf;
  if (!idxAttr || !pos || !io) return null;
  const idx = idxAttr.array;
  const byIsland = new Map();
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t], b = idx[t + 1], c = idx[t + 2];
    const isl = io[a]; if (isl == null || isl < 0) continue;
    if (!byIsland.has(isl)) byIsland.set(isl, []);
    byIsland.get(isl).push(a, b, c);
  }
  const baseMat = [].concat(mesh.material)[0];
  return [...byIsland.keys()].sort((x, y) => x - y).map((isl) => {
    const src = byIsland.get(isl);
    const remap = new Map(); const P = [], N = [], UV = [];
    const I = src.map((vi) => {
      let ri = remap.get(vi);
      if (ri == null) {
        ri = remap.size; remap.set(vi, ri);
        P.push(pos.getX(vi), pos.getY(vi), pos.getZ(vi));
        if (nrm) N.push(nrm.getX(vi), nrm.getY(vi), nrm.getZ(vi));
        if (uv) UV.push(uv.getX(vi), uv.getY(vi));
      }
      return ri;
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    if (nrm) geo.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
    if (uv) geo.setAttribute('uv', new THREE.Float32BufferAttribute(UV, 2));
    geo.setIndex(I);
    if (!nrm) geo.computeVertexNormals();
    const mat = baseMat ? baseMat.clone() : new THREE.MeshStandardMaterial({ roughness: 0.9 });
    const m = new THREE.Mesh(geo, mat);
    m.name = 'zone#' + isl;
    m.userData.origMap = mat.map || null;
    m.castShadow = false;
    return { island: isl, mesh: m, tris: src.length / 3 };
  });
}

/* Randschleifen einer Insel: gerichtete Kanten zählen, eine Kante ohne Kante in Gegenrichtung ist
   Rand. Bei einem einfachen Loch hat jeder Randknoten genau eine ausgehende Randkante — daraus
   folgt die Reihenfolge der Schleife ohne weitere Annahme. */
function boundaryLoops(idx) {
  const dir = new Set();
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t], b = idx[t + 1], c = idx[t + 2];
    dir.add(a + '_' + b); dir.add(b + '_' + c); dir.add(c + '_' + a);
  }
  const next = new Map();
  dir.forEach((key) => {
    const s = key.split('_'); const a = +s[0], b = +s[1];
    if (!dir.has(b + '_' + a)) next.set(a, b);
  });
  const used = new Set(), loops = [];
  next.forEach((b0, a0) => {
    if (used.has(a0)) return;
    const loop = [a0]; used.add(a0); let cur = a0, guard = 0;
    while (guard++ < next.size + 2) {
      const nx = next.get(cur);
      if (nx == null || nx === loop[0] || used.has(nx)) break;
      loop.push(nx); used.add(nx); cur = nx;
    }
    if (loop.length >= 3) loops.push(loop);
  });
  return loops;
}

/* ═══ FLÄCHE HEILEN statt Loch zudeckeln ══════════════════════════════════════════════════════
 *
 * Erster Versuch (v1, verworfen): Fächer aus dem Mittelpunkt der Randschleife. Ergebnis am Bild:
 * eine Blase mit sichtbarer Ringkante — ein flacher oder gewölbter Deckel auf einer gekrümmten
 * Fläche ist immer als Kante zu sehen, weil er eine ANDERE Fläche ist.
 *
 * Diese Fassung schließt nicht zu, sie stellt die FLÄCHE wieder her:
 *   1. Der Körper ist eine achsparallele Kapsel. Radius und Kappenmitten werden GEMESSEN
 *      (95-Perzentil der Radialabstände im Mittelband), der Fehler der Anpassung berichtet.
 *   2. Rund um jede offene Randschleife (nur dort, Rest der Figur bleibt unberührt) werden
 *      Punkte, die nach INNEN liegen, auf die gemessene Kapselfläche gezogen — damit ist der
 *      Rand der Öffnung exakt in der Fläche, nicht darunter.
 *   3. Das Loch wird mit einem ZWEIRINGIGEN Fächer gefüllt, dessen neue Punkte ebenfalls auf die
 *      Kapselfläche projiziert werden. Flicken und Umgebung liegen damit auf DERSELBEN Fläche
 *      mit derselben Krümmung — keine Kante, keine Beule, keine Lücke.
 *   4. Normalen werden über die POSITION verschweißt: gespaltene Punkte am alten Rand hätten
 *      sonst verschiedene Normalen und die Naht wäre als Schattenlinie sichtbar, obwohl die
 *      Geometrie stimmt.
 */
function fitCapsuleY(P, count) {
  let minY = Infinity, maxY = -Infinity;
  for (let v = 0; v < count; v++) { const y = P[v * 3 + 1]; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  const h = maxY - minY, lo = minY + h * 0.35, hi = minY + h * 0.65;
  const rhos = [];
  for (let v = 0; v < count; v++) {
    const y = P[v * 3 + 1]; if (y < lo || y > hi) continue;
    rhos.push(Math.hypot(P[v * 3], P[v * 3 + 2]));
  }
  rhos.sort((a, b) => a - b);
  const r = rhos.length ? rhos[Math.min(rhos.length - 1, Math.floor(rhos.length * 0.95))] : h / 4;
  return { r, minY, maxY, cTop: maxY - r, cBot: minY + r, samples: rhos.length };
}
function projectToCapsule(cap, x, y, z, out) {
  if (y > cap.cTop) {
    const dy = y - cap.cTop, len = Math.hypot(x, dy, z) || 1e-9, k = cap.r / len;
    return out.set(x * k, cap.cTop + dy * k, z * k);
  }
  if (y < cap.cBot) {
    const dy = y - cap.cBot, len = Math.hypot(x, dy, z) || 1e-9, k = cap.r / len;
    return out.set(x * k, cap.cBot + dy * k, z * k);
  }
  const rho = Math.hypot(x, z) || 1e-9, k = cap.r / rho;
  return out.set(x * k, y, z * k);
}
/* Gespaltene Punkte an derselben Stelle bekommen DIESELBE Normale. Ohne das bleibt die alte
   Lochkante als Schattenlinie stehen, auch wenn kein Loch mehr da ist. */
function weldNormals(geo, tol = 1e-4, keepAnalytic = null) {
  if (!keepAnalytic) geo.computeVertexNormals();
  const pos = geo.attributes.position.array, nrm = geo.attributes.normal;
  const buckets = new Map();
  const n = geo.attributes.position.count;
  for (let i = 0; i < n; i++) {
    const k = Math.round(pos[i * 3] / tol) + ',' + Math.round(pos[i * 3 + 1] / tol) + ',' + Math.round(pos[i * 3 + 2] / tol);
    let b = buckets.get(k); if (!b) { b = []; buckets.set(k, b); }
    b.push(i);
  }
  let welded = 0;
  buckets.forEach((list) => {
    if (list.length < 2) return;
    /* Ein Punkt mit analytisch gesetzter Normale gibt sie an seine Positions-Zwillinge WEITER,
       statt sie im Mittel mit Nachbardreiecks-Normalen zu verwässern. */
    if (keepAnalytic) {
      const src = list.find((i) => keepAnalytic.has(i));
      if (src != null) {
        const ax = nrm.array[src * 3], ay = nrm.array[src * 3 + 1], az = nrm.array[src * 3 + 2];
        list.forEach((i) => { nrm.array[i * 3] = ax; nrm.array[i * 3 + 1] = ay; nrm.array[i * 3 + 2] = az; });
        welded += list.length; return;
      }
    }
    let nx = 0, ny = 0, nz = 0;
    list.forEach((i) => { nx += nrm.array[i * 3]; ny += nrm.array[i * 3 + 1]; nz += nrm.array[i * 3 + 2]; });
    const len = Math.hypot(nx, ny, nz) || 1; nx /= len; ny /= len; nz /= len;
    list.forEach((i) => { nrm.array[i * 3] = nx; nrm.array[i * 3 + 1] = ny; nrm.array[i * 3 + 2] = nz; });
    welded += list.length;
  });
  nrm.needsUpdate = true;
  return welded;
}

/* Echte Löcher von UV-Nähten unterscheiden — MESSBAR, nicht geraten: audit.js trennt Inseln über
   strikte Index-Gleichheit, darum hat eine UV-Naht zwei Punkte an DERSELBEN Stelle. Ein Randpunkt
   MIT Positions-Zwilling gehört zu einer Naht (dort ist die Fläche zu), einer OHNE zu einem Loch.
   Das war der Fehler der ersten beiden Anläufe: zwölf "Löcher" gefunden, elf davon waren Nähte. */
function posKey(P, v, tol) { return Math.round(P[v * 3] / tol) + ',' + Math.round(P[v * 3 + 1] / tol) + ',' + Math.round(P[v * 3 + 2] / tol); }
function positionBuckets(P, count, tol) {
  const map = new Map();
  for (let v = 0; v < count; v++) {
    const k = posKey(P, v, tol);
    let b = map.get(k); if (!b) { b = []; map.set(k, b); }
    b.push(v);
  }
  return map;
}

export function findOpenings({ THREE, part, tol = 1e-5 }) {
  const geo = part.mesh.geometry, posAttr = geo.attributes.position;
  const P = posAttr.array, count = posAttr.count;
  const buckets = positionBuckets(P, count, tol);
  const loops = boundaryLoops(Array.from(geo.index.array)).filter((l) => l.length >= 3);
  return loops.map((rim) => {
    let seam = 0;
    rim.forEach((vi) => { const b = buckets.get(posKey(P, vi, tol)); if (b && b.length > 1) seam++; });
    const box = new THREE.Box3();
    rim.forEach((vi) => box.expandByPoint(new THREE.Vector3(P[vi * 3], P[vi * 3 + 1], P[vi * 3 + 2])));
    const seamRatio = seam / rim.length;
    return {
      rim, seamRatio: +seamRatio.toFixed(2), isHole: seamRatio < 0.5,
      box, centre: box.getCenter(new THREE.Vector3()), size: box.getSize(new THREE.Vector3()),
    };
  });
}

/* NICHT-INVASIV. Zwei Anläufe haben am Netz selbst operiert (Fächer-Kappe, dann Projektion auf die
   Kapselfläche) und beide haben sichtbare Kanten bzw. zerrissene Flächen hinterlassen — Chirurgie
   an einem gelieferten Netz ist der falsche Hebel. Diese Fassung läßt das Netz UNBERÜHRT und legt
   über die Öffnung ein Stück der GEMESSENEN Kapselfläche: gleicher Radius, gleiche Achse, radiale
   Normalen, gleiche Farbe, 0,003 u nach außen versetzt. Flicken und Umgebung liegen damit auf
   derselben analytischen Fläche — keine Kante, keine Beule, keine Lücke. */
/* MULDEN FINDEN, nicht Löcher raten.
 *
 * Gemessen 13.09. am gelieferten Netz: von zwölf Randschleifen der Körperinsel sind ZWÖLF
 * UV-Nähte und NULL echte Öffnungen. Der Mund ist also kein Loch, sondern eine eingeformte
 * MULDE — eine wasserdichte Einsenkung der Fläche. Beide früheren Anläufe (Fächer-Kappe,
 * Flächenprojektion) haben deshalb am falschen Gegenstand gearbeitet.
 *
 * Eine Mulde ist messbar: ihre Punkte liegen merklich INNERHALB der gemessenen Kapselfläche.
 * Zusammenhängende solche Punkte sind eine Mulde (Union-Find über die Dreieckskanten), und ihre
 * Winkel- und Höhenausdehnung sagt, wie groß der Flicken sein muss. Nichts davon ist geraten. */
export function findRecesses({ THREE, part, minInset = 0.015, minPoints = 8, grow = 2 }) {
  const geo = part.mesh.geometry, posAttr = geo.attributes.position;
  const P = posAttr.array, count = posAttr.count;
  const cap = fitCapsuleY(P, count);
  const tmp = new THREE.Vector3();
  const inset = new Float32Array(count);
  const deep = new Uint8Array(count);
  for (let v = 0; v < count; v++) {
    const x = P[v * 3], y = P[v * 3 + 1], z = P[v * 3 + 2];
    projectToCapsule(cap, x, y, z, tmp);
    const d = Math.hypot(tmp.x - x, tmp.y - y, tmp.z - z);
    /* nach INNEN heißt: näher an der Achse bzw. an der Kappenmitte als die Fläche */
    const onAxis = (y > cap.cTop) ? Math.hypot(x, y - cap.cTop, z)
      : (y < cap.cBot) ? Math.hypot(x, y - cap.cBot, z) : Math.hypot(x, z);
    inset[v] = onAxis < cap.r ? d : -d;
    /* BEIDE Seiten: die Mundmulde liegt innen, ihre Lippe als Wulst AUSSEN. Wer nur nach innen
       sucht, ebnet die Delle und läßt den Grat stehen — am Bild gemessen, 13.09. */
    deep[v] = Math.abs(inset[v]) > minInset ? 1 : 0;
  }
  const idx = geo.index.array;
  const parent = new Int32Array(count); for (let i = 0; i < count; i++) parent[i] = i;
  const find = (a) => { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; };
  const join = (a, b) => { a = find(a); b = find(b); if (a !== b) parent[b] = a; };
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t], b = idx[t + 1], c = idx[t + 2];
    if (deep[a] && deep[b]) join(a, b);
    if (deep[b] && deep[c]) join(b, c);
    if (deep[c] && deep[a]) join(c, a);
  }
  /* Ringwachstum: der Übergang zur unberührten Fläche gehört MIT auf die Fläche, sonst bleibt
     genau dort eine Knickkante stehen (am Bild gesehen: ein weicher Umriss um den alten Mund). */
  const idxArr = idx;
  for (let g = 0; g < grow; g++) {
    const add = [];
    for (let t = 0; t < idxArr.length; t += 3) {
      const a = idxArr[t], b = idxArr[t + 1], c = idxArr[t + 2];
      if (deep[a] || deep[b] || deep[c]) { if (!deep[a]) add.push(a); if (!deep[b]) add.push(b); if (!deep[c]) add.push(c); }
    }
    add.forEach((v) => { deep[v] = 1; });
    for (let t = 0; t < idxArr.length; t += 3) {
      const a = idxArr[t], b = idxArr[t + 1], c = idxArr[t + 2];
      if (deep[a] && deep[b]) join(a, b);
      if (deep[b] && deep[c]) join(b, c);
      if (deep[c] && deep[a]) join(c, a);
    }
  }
  const groups = new Map();
  for (let v = 0; v < count; v++) {
    if (!deep[v]) continue;
    const r = find(v);
    let g = groups.get(r); if (!g) { g = []; groups.set(r, g); }
    g.push(v);
  }
  const out = [];
  groups.forEach((pts) => {
    if (pts.length < minPoints) return;
    const box = new THREE.Box3();
    let maxIn = 0;
    pts.forEach((v) => { box.expandByPoint(new THREE.Vector3(P[v * 3], P[v * 3 + 1], P[v * 3 + 2])); if (Math.abs(inset[v]) > maxIn) maxIn = Math.abs(inset[v]); });
    out.push({
      pts, points: pts.length, box, centre: box.getCenter(new THREE.Vector3()),
      size: box.getSize(new THREE.Vector3()), maxInset: +maxIn.toFixed(4),
    });
  });
  out.sort((a, b) => b.points - a.points);
  return { capsule: cap, recesses: out };
}

/* Ein Stück der GEMESSENEN Kapselfläche über eine Region legen: gleicher Radius, gleiche Achse,
   radiale Normalen, `lift` nach außen. Kein Eingriff am gelieferten Netz. */
function buildSurfacePatch({ THREE, cap, P, pts, margin, lift, seg, color }) {
  let sx = 0, sz = 0;
  pts.forEach((v) => { sx += P[v * 3]; sz += P[v * 3 + 2]; });
  const th0 = Math.atan2(sz / pts.length, sx / pts.length);
  let thMin = Infinity, thMax = -Infinity, yMin = Infinity, yMax = -Infinity;
  pts.forEach((v) => {
    let d = Math.atan2(P[v * 3 + 2], P[v * 3]) - th0;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    if (d < thMin) thMin = d; if (d > thMax) thMax = d;
    const y = P[v * 3 + 1]; if (y < yMin) yMin = y; if (y > yMax) yMax = y;
  });
  const halfTh = Math.max(((thMax - thMin) / 2) * margin, 0.03);
  const yc = (yMin + yMax) / 2, halfY = Math.max(((yMax - yMin) / 2) * margin, 0.02);
  const R = cap.r + lift;
  const pos = [], nrm = [], uv = [], ix = [];
  const nu = seg, nv = Math.max(8, Math.round(seg * 0.7));
  for (let j = 0; j <= nv; j++) {
    const y = yc - halfY + 2 * halfY * (j / nv);
    for (let i = 0; i <= nu; i++) {
      const th = th0 - halfTh + 2 * halfTh * (i / nu);
      let x, yy = y, z, nx, ny = 0, nz;
      if (y > cap.cTop || y < cap.cBot) {
        const cy = y > cap.cTop ? cap.cTop : cap.cBot, dy = y - cy;
        const rho = Math.sqrt(Math.max(R * R - dy * dy, 1e-6));
        x = Math.cos(th) * rho; z = Math.sin(th) * rho; yy = cy + dy;
        const len = Math.hypot(x, dy, z) || 1; nx = x / len; ny = dy / len; nz = z / len;
      } else {
        x = Math.cos(th) * R; z = Math.sin(th) * R;
        nx = Math.cos(th); nz = Math.sin(th);
      }
      pos.push(x, yy, z); nrm.push(nx, ny, nz); uv.push(i / nu, j / nv);
    }
  }
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const a = j * (nu + 1) + i, b = a + 1, c = a + (nu + 1), d = c + 1;
    ix.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(ix);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0, side: THREE.DoubleSide });
  const m = new THREE.Mesh(g, mat);
  m.name = 'surface-patch'; m.userData.kfbPatch = true; m.castShadow = false; m.raycast = () => {};
  return { mesh: m, thetaSpan: +(2 * halfTh).toFixed(3), ySpan: +(2 * halfY).toFixed(3) };
}

/* Schließt den Mund: die größte front-seitige Mulde (und optional weitere) wird mit einem
   Flächenstück überdeckt. Das gelieferte Netz bleibt UNBERÜHRT — `meshTouched: false`. */
export function patchOpenings({ THREE, part, group, margin = 1.16, lift = 0.004, seg = 36,
  fallbackColor = 0xd99a4e, minInset = 0.015, frontOnly = true, maxPatches = 1 }) {
  const geo = part.mesh.geometry, P = geo.attributes.position.array;
  const found = findRecesses({ THREE, part, minInset });
  const cap = found.capsule;
  const openings = findOpenings({ THREE, part });
  const real = openings.filter((o) => o.isHole);
  const report = {
    capsule: { r: +cap.r.toFixed(4), capCentres: [+cap.cBot.toFixed(3), +cap.cTop.toFixed(3)], samples: cap.samples },
    loopsFound: openings.length, seams: openings.length - real.length, realOpenings: real.length,
    recessesFound: found.recesses.length,
    recesses: found.recesses.map((r) => ({ points: r.points, maxInset: r.maxInset, centre: r.centre.toArray().map((v) => +v.toFixed(3)), size: r.size.toArray().map((v) => +v.toFixed(3)) })),
    patches: [], holeBoxesLocal: [], meshTouched: false,
  };
  const regions = [];
  real.forEach((o) => regions.push({ pts: o.rim, centre: o.centre, box: o.box, kind: 'opening' }));
  found.recesses.forEach((r) => {
    if (frontOnly && r.centre.z <= 0.12) return;
    regions.push({ pts: r.pts, centre: r.centre, box: r.box, kind: 'recess', points: r.points });
  });
  regions.sort((a, b) => (b.points || 1e6) - (a.points || 1e6));
  const patches = [];
  regions.slice(0, maxPatches).forEach((rg) => {
    const built = buildSurfacePatch({ THREE, cap, P, pts: rg.pts, margin, lift, seg, color: fallbackColor });
    (group || part.mesh.parent || part.mesh).add(built.mesh);
    patches.push(built.mesh);
    report.patches.push({ kind: rg.kind, points: rg.pts.length, centre: rg.centre.toArray().map((v) => +v.toFixed(3)), thetaSpan: built.thetaSpan, ySpan: built.ySpan });
    report.holeBoxesLocal.push({ min: rg.box.min.toArray(), max: rg.box.max.toArray() });
  });
  part.patches = patches;
  part.patchFallback = fallbackColor;
  return { report, patches };
}

/* MULDE EINEBNEN — der Weg, der trägt.
 *
 * Der Überdeck-Flicken (patchOpenings) schließt den Mund optisch sauber, aber er löst das Problem
 * nur für das AUGE: die PetStudio-Teile tasten die HAUT des Wirts ab (probeSkin, shrinkwrap,
 * EyeRig-Raycast) und treffen weiter die Mulde dahinter — am Bild gemessen: der Schnauzbart sinkt
 * mittig 0,175 u in die Mundhöhle und verschwindet hinter dem Flicken, sichtbar bleiben zwei Enden.
 *
 * Diese Fassung bewegt darum genau die GEMESSENEN Muldenpunkte (nicht ihre Nachbarschaft, nicht die
 * Naht-Schleifen — der Fehler des zweiten Anlaufs, der 1482 Punkte zog) auf die gemessene
 * Kapselfläche. Danach ist die Haut selbst glatt: jede Abtastung eines Gesichtsteils trifft die
 * neue Fläche, ohne dass ein Vendor-Modul etwas davon wissen muss. Die DATEI bleibt unberührt —
 * verändert wird die Geometrie im Speicher, wie schon bei der Insel-Trennung. */
export function flattenRecesses({ THREE, part, minInset = 0.005, frontOnly = true, minPoints = 8, grow = 3 }) {
  const geo = part.mesh.geometry, posAttr = geo.attributes.position;
  const P = posAttr.array;
  const found = findRecesses({ THREE, part, minInset, minPoints, grow });
  const cap = found.capsule;
  const tmp = new THREE.Vector3();
  const report = {
    capsule: { r: +cap.r.toFixed(4), capCentres: [+cap.cBot.toFixed(3), +cap.cTop.toFixed(3)], samples: cap.samples },
    recessesFound: found.recesses.length, flattened: [], verticesMoved: 0, maxInsetBefore: 0, maxInsetAfter: 0,
    boxesLocal: [], coreBoxesLocal: [], meshFileTouched: false,
  };
  const tmp2 = new THREE.Vector3();
  found.recesses.forEach((r) => {
    if (frontOnly && r.centre.z <= 0.12) return;
    /* Kern ZUERST messen: nach dem Verschieben liegt kein Punkt mehr innen. */
    const coreBox0 = new THREE.Box3();
    let core0 = 0;
    r.pts.forEach((v) => {
      const x = P[v * 3], y = P[v * 3 + 1], z = P[v * 3 + 2];
      projectToCapsule(cap, x, y, z, tmp);
      const onAxis = (y > cap.cTop) ? Math.hypot(x, y - cap.cTop, z) : (y < cap.cBot) ? Math.hypot(x, y - cap.cBot, z) : Math.hypot(x, z);
      const dev = Math.hypot(tmp.x - x, tmp.y - y, tmp.z - z);
      if (onAxis < cap.r && dev > 0.03) { coreBox0.expandByPoint(new THREE.Vector3(x, y, z)); core0++; }
    });
    if (core0 >= 3) report.coreBoxesLocal.push({ min: coreBox0.min.toArray(), max: coreBox0.max.toArray() });
    r.pts.forEach((v) => {
      projectToCapsule(cap, P[v * 3], P[v * 3 + 1], P[v * 3 + 2], tmp);
      P[v * 3] = tmp.x; P[v * 3 + 1] = tmp.y; P[v * 3 + 2] = tmp.z;
    });
    report.verticesMoved += r.pts.length;
    if (r.maxInset > report.maxInsetBefore) report.maxInsetBefore = r.maxInset;
    report.flattened.push({ points: r.pts.length, maxInset: r.maxInset, centre: r.centre.toArray().map((q) => +q.toFixed(3)), size: r.size.toArray().map((q) => +q.toFixed(3)) });
    report.boxesLocal.push({ min: r.box.min.toArray(), max: r.box.max.toArray() });
  });
  posAttr.needsUpdate = true;

  /* ⚠ RESTFEHLER WAR SCHATTEN, NICHT FORM (gemessen: Restabweichung 0 u, und trotzdem sah man
     Linien). Zwei Ursachen, beide hier behandelt:
     1. Die alten Muldenwände sind jetzt in die Fläche gedrückt — ihre Dreiecke haben nahezu keine
        Fläche mehr und liefern unbrauchbare Flächennormalen. Sie werden ENTFERNT, nicht geglättet.
     2. Für die verschobenen Punkte wird die Normale ANALYTISCH gesetzt (radial bzw. sphärisch an
        der gemessenen Kapsel), statt sie aus den verbliebenen Nachbardreiecken zu rechnen. Damit
        schattiert der geheilte Bereich exakt wie die Kapsel daneben. */
  const moved = new Set();
  found.recesses.forEach((r) => { if (!(frontOnly && r.centre.z <= 0.12)) r.pts.forEach((v) => moved.add(v)); });
  const oldIdx = geo.index.array;
  const keep = [];
  const a3 = new THREE.Vector3(), b3 = new THREE.Vector3(), c3 = new THREE.Vector3(), ab = new THREE.Vector3(), ac = new THREE.Vector3(), cr = new THREE.Vector3();
  let dropped = 0;
  for (let t = 0; t < oldIdx.length; t += 3) {
    const a = oldIdx[t], b = oldIdx[t + 1], c = oldIdx[t + 2];
    a3.set(P[a * 3], P[a * 3 + 1], P[a * 3 + 2]);
    b3.set(P[b * 3], P[b * 3 + 1], P[b * 3 + 2]);
    c3.set(P[c * 3], P[c * 3 + 1], P[c * 3 + 2]);
    const area = cr.crossVectors(ab.subVectors(b3, a3), ac.subVectors(c3, a3)).length() * 0.5;
    if (area < 1e-6) { dropped++; continue; }
    keep.push(a, b, c);
  }
  geo.setIndex(keep);
  report.degenerateTrisDropped = dropped;
  geo.deleteAttribute('normal');
  geo.computeVertexNormals();
  const nrm = geo.attributes.normal.array;
  moved.forEach((v) => {
    const x = P[v * 3], y = P[v * 3 + 1], z = P[v * 3 + 2];
    let nx, ny = 0, nz;
    if (y > cap.cTop || y < cap.cBot) {
      const cy = y > cap.cTop ? cap.cTop : cap.cBot, dy = y - cy;
      const len = Math.hypot(x, dy, z) || 1; nx = x / len; ny = dy / len; nz = z / len;
    } else {
      const len = Math.hypot(x, z) || 1; nx = x / len; nz = z / len;
    }
    nrm[v * 3] = nx; nrm[v * 3 + 1] = ny; nrm[v * 3 + 2] = nz;
  });
  geo.attributes.normal.needsUpdate = true;
  report.normalsSetAnalytically = moved.size;
  report.normalsWelded = weldNormals(geo, 1e-4, moved);
  geo.computeBoundingBox(); geo.computeBoundingSphere();
  /* Gegenprobe am EIGENEN Ergebnis: wie tief ist die tiefste Mulde jetzt noch? */
  const after = findRecesses({ THREE, part, minInset, minPoints, grow: 0 });
  report.maxInsetAfter = after.recesses.reduce((a, r) => Math.max(a, frontOnly && r.centre.z <= 0.12 ? 0 : r.maxInset), 0);
  report.recessesLeft = after.recesses.filter((r) => !(frontOnly && r.centre.z <= 0.12)).length;
  /* Ehrliche Restmessung, unabhängig von Schwelle und Gruppengröße: die GRÖSSTE Abweichung von
     der gemessenen Fläche innerhalb der behandelten Kisten. Eine Zahl, die eine sichtbare Falte
     nicht verstecken kann. */
  let resid = 0, residN = 0;
  const boxes = report.boxesLocal.map((b) => new THREE.Box3(new THREE.Vector3().fromArray(b.min), new THREE.Vector3().fromArray(b.max)));
  boxes.forEach((b) => b.expandByVector(b.getSize(new THREE.Vector3()).multiplyScalar(0.25)));
  const pv = new THREE.Vector3();
  for (let v = 0; v < geo.attributes.position.count; v++) {
    pv.set(P[v * 3], P[v * 3 + 1], P[v * 3 + 2]);
    if (!boxes.some((b) => b.containsPoint(pv))) continue;
    projectToCapsule(cap, pv.x, pv.y, pv.z, tmp);
    const d = tmp.distanceTo(pv);
    residN++; if (d > resid) resid = d;
  }
  report.residualMax = +resid.toFixed(5);
  report.residualPoints = residN;
  /* Was der Aufrufer zum Ausblenden bekommt, ist der Kern — nicht der geglättete Bereich. */
  report.holeBoxesLocal = report.coreBoxesLocal.length ? report.coreBoxesLocal : report.boxesLocal;
  return report;
}

/* Alter Name, damit die eingefrorenen Blätter (v4, 16B) nicht hart brechen. */
export function closeMouth(args) { return patchOpenings(args).report; }
export function smoothCreases() { return { skipped: 'surgery on the delivered mesh was the wrong lever — see patchOpenings' }; }


/* Welche anderen Inseln liegen in einer jetzt geschlossenen Mundhöhle (Zahn-Blöcke etc.)? Gemessen
   am Mittelpunkt jeder Insel gegen die Randschleifen-Kiste der Öffnung, nicht aus der Nummer
   geraten. `pad` fängt Teile, deren eigene Kiste knapp über den Rand der Öffnung hinausreicht. */
export function partsInsideBoxes({ THREE, parts, boxesLocal, excludeIsland, pad = 0.4 }) {
  if (!boxesLocal || !boxesLocal.length) return [];
  const boxes = boxesLocal.map((b) => {
    const box = new THREE.Box3(new THREE.Vector3().fromArray(b.min), new THREE.Vector3().fromArray(b.max));
    const size = box.getSize(new THREE.Vector3()).multiplyScalar(pad);
    box.expandByVector(size);
    return box;
  });
  const hits = [];
  parts.forEach((p) => {
    if (p.island === excludeIsland) return;
    p.mesh.geometry.computeBoundingBox();
    const c = p.mesh.geometry.boundingBox.getCenter(new THREE.Vector3());
    if (boxes.some((b) => b.containsPoint(c))) hits.push(p.island);
  });
  return hits;
}

/* Sichtbarkeit + Farbe/Textur einer Zone. `color` null gibt die Original-Textur zurück (beim
   Split in `mesh.userData.origMap` gesichert). */
export function setZoneStyle(part, { hidden, color }) {
  const m = part.mesh, mat = m.material;
  m.visible = !hidden;
  if (color) { mat.map = null; mat.color.set(color); }
  else { mat.map = m.userData.origMap || null; mat.color.set(0xffffff); }
  mat.needsUpdate = true;
  /* Ein Flicken, der der Zone nicht folgt, ist als Fleck sichtbar — also folgt er ihr. */
  (part.patches || []).forEach((p) => {
    p.visible = !hidden;
    p.material.color.set(color || part.patchFallback || 0xd99a4e);
    p.material.needsUpdate = true;
  });
}

/* Gesichts-Montage: EyeRig, BrowRig, NoseRig, MoustacheRig, PetMouth aus PetStudio — VERTRAG
   unverändert (HANDOVER §5, "Rolli-Regel"): `ch.inner` ist eine Gruppe mit genau EINEM Netz
   namens 'body' (Fallback: das erste gefundene). Augen und Mund hängen sich selbst per
   `body.add(...)` an; Braue/Nase/Bart über `getEyeFrame().parent` (= body). Kein eigener
   Anschlusscode nötig, nur der Vertrag muss stimmen — das IST der Punkt der Module. */
export function buildFace({ THREE, partsGroup, mods, opts = {} }) {
  const ch = { THREE, inner: partsGroup, o: {}, getFaceShells: () => [] };
  const report = [];
  const baseColor = opts.baseColor != null ? opts.baseColor : 0xf2c93c;
  let eyeRig = null, browRig = null, noseRig = null, moustache = null, mouth = null;
  if (mods.eye && mods.eye.EyeRig) {
    try {
      eyeRig = new mods.eye.EyeRig(ch, {
        anchor: opts.eyeAnchor || {}, pupilStyle: opts.pupilStyle || 'matte-cute', baseColor,
        /* ⚠ Diese vier wurden vorher stumm verschluckt — Wimpern fehlten dadurch ganz. */
        lidFit: opts.lidFit != null ? opts.lidFit : 0.92,
        pupilSize: opts.pupilSize != null ? opts.pupilSize : 0.42,
        inset: opts.inset != null ? opts.inset : 0,
        lashes: opts.lashes || null,
        gloss: opts.gloss != null ? opts.gloss : 0.85,
      });
      eyeRig.build();   /* Konstruktor baut NICHT selbst (anders als Brow/Nose/Moustache) — Vertrag aus frizzlebob.v4a.js:359 */
      /* ⚠ UND: ohne update(dt) im Bildlauf bleiben die Lider in Bauform = geschlossen. */
      report.push('eyes: ' + (eyeRig.eyes ? eyeRig.eyes.length : 0) + ' built on the body zone');
    } catch (e) { report.push('eyes: FAILED ' + e.message); }
  } else report.push('eyes: module missing');
  const getEyeFrame = () => (eyeRig ? eyeRig.eyeFrame() : null);
  if (mods.brow && mods.brow.BrowRig) {
    try { browRig = new mods.brow.BrowRig({ THREE, getEyeFrame, baseColor, seed: 1001 }); report.push('brows: ' + browRig.last.status); }
    catch (e) { report.push('brows: FAILED ' + e.message); }
  }
  if (mods.nose && mods.nose.NoseRig) {
    try { noseRig = new mods.nose.NoseRig({ THREE, getEyeFrame }); report.push('nose: ' + noseRig.last.status); }
    catch (e) { report.push('nose: FAILED ' + e.message); }
  }
  if (mods.stache && mods.stache.MoustacheRig) {
    try { moustache = new mods.stache.MoustacheRig({ THREE, getEyeFrame, baseColor, seed: 2002 }); report.push('moustache: ' + moustache.last.status + ' (enabled after build — walrus is off by default)'); }
    catch (e) { report.push('moustache: FAILED ' + e.message); }
  }
  if (mods.mouth && mods.mouth.PetMouth) {
    try {
      mouth = new mods.mouth.PetMouth(ch, { params: { set: opts.mouthSet || 'male' } });
      mouth.build(); mouth.enabled = true;
      report.push('mouth: set ' + (opts.mouthSet || 'male') + ' mounted on the closed cavity');
    } catch (e) { report.push('mouth: FAILED ' + e.message); }
  }
  return { ch, eyeRig, browRig, noseRig, moustache, mouth, report };
}

export function setFaceVisible(face, on) {
  if (!face) return;
  if (face.eyeRig && face.eyeRig.rig) face.eyeRig.rig.visible = on;
  if (face.browRig && face.browRig.mesh) face.browRig.mesh.visible = on;
  if (face.noseRig && face.noseRig.mesh) face.noseRig.mesh.visible = on;
  if (face.moustache && face.moustache.mesh) face.moustache.mesh.visible = on && face.moustache.params.enabled;
  if (face.mouth && face.mouth.mesh) face.mouth.mesh.visible = on;
}
