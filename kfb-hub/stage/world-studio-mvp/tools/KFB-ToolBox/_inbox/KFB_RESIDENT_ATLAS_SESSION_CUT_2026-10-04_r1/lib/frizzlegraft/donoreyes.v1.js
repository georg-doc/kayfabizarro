/* FrizzleGraft v1 · donoreyes.v1 — DIE ORIGINALAUGEN DES SPENDERS AUSBLENDEN.  13.09.2026
 *
 * WOFÜR (Georg 13.09.): »da liegen noch die (jetzt gelben) Originalaugen unter unserem Eye-Rig —
 * können wir die entfernen?«
 *
 * ⚠ WARUM SIE ÜBERHAUPT DA SIND: `headgraft` nimmt aus dem Spender ALLE Dreiecke, die an einem
 * Kopf- oder Ohrenknochen hängen. FrizzleBobs eigene Augenschalen hängen dort auch — im Studio trägt
 * der Kopf nur zwei Materialien (`Main`, `Main_Light`), also fallen sie nicht über den Materialnamen
 * auf, sondern nehmen die Kopffarbe an. Was Georg als gelbe Zipfel sieht, ist genau das.
 *
 * DIE REGEL IST GEMESSEN, NICHT GERATEN (13.09. am laufenden Blatt, Kopfnetz `kfb-head`,
 * 1500 Dreiecke, acht zusammenhängende Inseln):
 *   768 Dreiecke, mittig            → Schädel
 *   2 × 120, x ±0,806, z −0,297     → Ohren (HINTEN)
 *   2 × 108, x ∓0,32,  z  0,26      → Zacken (nicht exakt gespiegelt)
 *   1 ×  84, x  0,00,  z  0,22      → mittlere Zacke
 *   **2 × 96, x ±0,513, z 0,604**   → die Augenschalen: exakt gespiegelt, gleich groß,
 *                                     das VORDERSTE Paar, 0,043 vom Rig-Auge entfernt.
 * Daraus die Regel: unter den gespiegelten Paaren gleicher Dreieckszahl gewinnt das mit dem
 * größten z (am weitesten vorn). Die Ohren fallen über z heraus, die Zacken über die Spiegelung.
 *
 * AUSGEBLENDET WIRD MIT ZEICHENGRUPPEN, NICHT GESCHNITTEN — derselbe Weg wie beim Wirtskopf:
 * der Index wird neu geordnet, die Augen-Dreiecke bekommen keine Gruppe. `restore()` gibt alles
 * zurück, und die Materialzuordnung (Main / Main_Light) bleibt Dreieck für Dreieck erhalten.
 */

export const SCHEMA = 'kfb.donoreyes/0.1';

export function findDonorEyes({ THREE, mesh, tol = 0.06 }) {
  const g = mesh.geometry, pos = g.attributes.position, ix = g.index;
  if (!ix) return { status: 'KEIN_INDEX' };
  const n = ix.count / 3;

  /* Inseln über zusammenfallende PUNKTE, nicht über Indizes: der Exporter gibt jedem Dreieck
     eigene Ecken, wenn die Normalen springen — über Indizes allein zerfiele der Schädel in 768
     Inseln. Gerundet auf vier Stellen, das ist feiner als jede Naht im Modell. */
  const rep = new Int32Array(pos.count);
  for (let i = 0; i < pos.count; i++) rep[i] = i;
  const find = (a) => { while (rep[a] !== a) { rep[a] = rep[rep[a]]; a = rep[a]; } return a; };
  const uni = (a, b) => { a = find(a); b = find(b); if (a !== b) rep[b] = a; };
  const at = new Map();
  for (let i = 0; i < pos.count; i++) {
    const k = pos.getX(i).toFixed(4) + ',' + pos.getY(i).toFixed(4) + ',' + pos.getZ(i).toFixed(4);
    if (at.has(k)) uni(at.get(k), i); else at.set(k, i);
  }
  for (let t = 0; t < n; t++) { const a = ix.getX(t * 3), b = ix.getX(t * 3 + 1), c = ix.getX(t * 3 + 2); uni(a, b); uni(b, c); }

  const isl = new Map();
  const v = new THREE.Vector3();
  for (let t = 0; t < n; t++) {
    const r = find(ix.getX(t * 3));
    let e = isl.get(r);
    if (!e) { e = { tris: [], box: new THREE.Box3() }; isl.set(r, e); }
    e.tris.push(t);
    for (let q = 0; q < 3; q++) { const vi = ix.getX(t * 3 + q); e.box.expandByPoint(v.set(pos.getX(vi), pos.getY(vi), pos.getZ(vi))); }
  }
  const list = [...isl.values()].map((e) => ({ ...e, c: e.box.getCenter(new THREE.Vector3()), s: e.box.getSize(new THREE.Vector3()) }));
  const biggest = list.reduce((a, b) => (b.tris.length > a.tris.length ? b : a), list[0]);
  const span = Math.max(biggest.s.x, 1e-6);

  /* Gespiegelte Paare gleicher Dreieckszahl. Die Schwelle ist ein ANTEIL der Kopfbreite — eine
     absolute Zahl wäre für den nächsten Spender falsch. */
  const pairs = [];
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const A = list[i], B = list[j];
    if (A.tris.length !== B.tris.length) continue;
    if (A.tris.length > biggest.tris.length * 0.25) continue;          // der Schädel ist kein Auge
    if (Math.abs(A.c.x + B.c.x) > tol * span) continue;                // gespiegelt um x = 0
    if (Math.abs(A.c.x) < tol * span) continue;                        // mittig = keine Seite
    if (Math.abs(A.c.y - B.c.y) > tol * span) continue;
    if (Math.abs(A.c.z - B.c.z) > tol * span) continue;
    pairs.push({ A, B, z: (A.c.z + B.c.z) / 2, tris: A.tris.length });
  }
  if (!pairs.length) return { status: 'KEIN_PAAR', islands: list.length };
  pairs.sort((a, b) => b.z - a.z);   // das vorderste Paar ist das Gesicht
  const win = pairs[0];
  return { status: 'OK', islands: list.length, pair: win,
    candidates: pairs.map((p) => ({ tris: p.tris, z: +p.z.toFixed(3) })),
    report: { tris: win.tris * 2, z: +win.z.toFixed(3),
      x: [+win.A.c.x.toFixed(3), +win.B.c.x.toFixed(3)],
      size: [+win.A.s.x.toFixed(3), +win.A.s.y.toFixed(3), +win.A.s.z.toFixed(3)] } };
}

/** Blendet das gefundene Paar aus. Rückgabe enthält `restore()`. */
export function stripDonorEyes({ THREE, headRoot, log = () => {} }) {
  let mesh = null;
  headRoot.traverse((o) => { if (!mesh && o.isMesh && o.geometry && o.geometry.index) mesh = o; });
  if (!mesh) return { status: 'KEIN_NETZ' };
  const found = findDonorEyes({ THREE, mesh });
  if (found.status !== 'OK') { log('Spender-Augen: ' + found.status); return found; }

  const g = mesh.geometry, ix = g.index, oldIndex = ix, oldGroups = g.groups.map((x) => ({ ...x }));
  const drop = new Set([...found.pair.A.tris, ...found.pair.B.tris]);
  /* Welche Gruppe (= welches Material) ein Dreieck trägt, steht in den ALTEN Gruppen. Die neue
     Reihenfolge wird je Gruppe aufgebaut, damit Main und Main_Light getrennt bleiben. */
  const perGroup = oldGroups.map(() => []);
  const groupOf = (t) => {
    for (let q = 0; q < oldGroups.length; q++) {
      const s = oldGroups[q].start / 3, c = oldGroups[q].count / 3;
      if (t >= s && t < s + c) return q;
    }
    return 0;
  };
  const n = ix.count / 3;
  for (let t = 0; t < n; t++) {
    if (drop.has(t)) continue;
    perGroup[groupOf(t)].push(ix.getX(t * 3), ix.getX(t * 3 + 1), ix.getX(t * 3 + 2));
  }
  const flat = [];
  const groups = [];
  perGroup.forEach((arr, q) => { groups.push({ start: flat.length, count: arr.length, mat: oldGroups[q].materialIndex }); flat.push(...arr); });
  g.setIndex(flat);
  g.clearGroups();
  groups.forEach((q) => g.addGroup(q.start, q.count, q.mat));

  log('Spender-Augen ausgeblendet: ' + found.report.tris + ' Dreiecke (Paar bei x ' + found.report.x.join(' / ')
    + ', z ' + found.report.z + ') · ' + (n - drop.size) + ' von ' + n + ' Dreiecken bleiben');
  return { status: 'OK', ...found,
    removedTris: found.report.tris, keptTris: n - drop.size, totalTris: n,
    restore() { g.setIndex(oldIndex); g.clearGroups(); oldGroups.forEach((x) => g.addGroup(x.start, x.count, x.materialIndex)); } };
}

export default { SCHEMA, findDonorEyes, stripDonorEyes };
