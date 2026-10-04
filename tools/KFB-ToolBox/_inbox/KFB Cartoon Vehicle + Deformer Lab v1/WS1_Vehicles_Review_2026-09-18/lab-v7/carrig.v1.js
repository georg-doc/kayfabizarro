/**
 * lab-v7/carrig.v1.js · Ein Fahrzeug aus der Registry vermessen und riggen.
 *
 * GEMESSEN, NICHT GERATEN. Das Modul benennt kein Rad, das es nicht selbst gefunden hat, und es
 * baut kein Rad, das im Netz nicht liegt. Zwei Wege, in dieser Reihenfolge:
 *
 *   1 KNOTEN. Bringt die Datei benannte Radknoten mit (`spacetruck.gltf`: vier Kinder
 *     `spacetruck_wheel_front_left` …), sind das die Räder. Keine Formprüfung nötig — der Autor
 *     hat sie benannt.
 *   2 INSELN. Sonst wird jede Netzgeometrie in zusammenhängende Inseln getrennt (Union-Find über
 *     verschweißte Positionen, dieselbe Regel wie `lab-v2/audit.js` und `race/src/vehicles.v1.js`)
 *     und jede Insel gegen fünf gemessene Bedingungen geprüft — siehe WHEEL_RULE.
 *
 * Wird nichts gefunden, meldet der Bericht `wheels: 0` und die Oberfläche sagt es. Ein erfundenes
 * Rad an einer geratenen Stelle ist schlimmer als kein Rad: es sieht aus wie ein Befund.
 *
 * Der Drehpunkt-Trick kommt aus `lab-v6/partrig.v1.js`: eine Insel steht in Karosseriekoordinaten,
 * ihr Drehpunkt ist der Fahrzeugursprung. Sie wird darum EINMAL in eine Gruppe auf ihrer gemessenen
 * Mitte gehängt und ihr Versatz ausgeglichen — danach dreht sie um ihre eigene Achse. Geometrie
 * unberührt, Datei unberührt.
 *
 * Achsenfolge je Rad: steer (y) → suspension (y-Versatz) → spin (x). In dieser Reihenfolge
 * geschachtelt, sonst lenkt das Rad um seine eigene gedrehte Achse und läuft schief.
 */
export const SCHEMA = 'kfb.carrig/1';

export const WHEEL_RULE = [
  'dünnste Achse ist x (Radachse quer zur Fahrtrichtung)',
  'die beiden anderen Maße sind rund (Verhältnis ≤ 1,35) — ein Rad ist eine Scheibe',
  'Achse mindestens 1,5 × dünner als der Raddurchmesser',
  'Unterkante liegt in den unteren 22 % der Fahrzeughöhe',
  'Mitte liegt seitlich außen (|x| > 12 % der halben Breite) und Radius < 30 % der Länge',
];

/* ── Inseln: Union-Find über auf 0,5 mm verschweißte Positionen ───────────────────────────── */
function weldKey(x, y, z) { return Math.round(x * 2000) + ',' + Math.round(y * 2000) + ',' + Math.round(z * 2000); }

export function islandsOf(geo) {
  const pos = geo.attributes.position, n = pos.count;
  const idx = geo.index ? geo.index.array : Uint32Array.from({ length: n }, (_, i) => i);
  const parent = new Int32Array(n); for (let i = 0; i < n; i++) parent[i] = i;
  const find = (i) => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
  const union = (a, b) => { a = find(a); b = find(b); if (a !== b) parent[a] = b; };
  const byPos = new Map();
  for (let i = 0; i < n; i++) { const k = weldKey(pos.getX(i), pos.getY(i), pos.getZ(i)); if (byPos.has(k)) union(i, byPos.get(k)); else byPos.set(k, i); }
  for (let t = 0; t < idx.length; t += 3) { union(idx[t], idx[t + 1]); union(idx[t + 1], idx[t + 2]); }
  const comp = new Map(), tri = new Int32Array(idx.length / 3);
  for (let t = 0; t < idx.length; t += 3) { const r = find(idx[t]); if (!comp.has(r)) comp.set(r, comp.size); tri[t / 3] = comp.get(r); }
  return { count: comp.size, tri, idx };
}

/* Trennt eine Netzgeometrie in eigene Netze je Insel. Neue Geometrie im Speicher, Quelle unberührt. */
export function splitIslands({ THREE, mesh }) {
  const g = mesh.geometry, pos = g.attributes.position, nrm = g.attributes.normal, uv = g.attributes.uv;
  const isl = islandsOf(g), groups = new Map();
  for (let t = 0; t < isl.idx.length; t += 3) {
    const c = isl.tri[t / 3];
    if (!groups.has(c)) groups.set(c, []);
    groups.get(c).push(isl.idx[t], isl.idx[t + 1], isl.idx[t + 2]);
  }
  const baseMat = [].concat(mesh.material)[0];
  return [...groups.keys()].sort((a, b) => a - b).map((c) => {
    const src = groups.get(c), remap = new Map(), P = [], N = [], UV = [];
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
    geo.computeBoundingBox();
    const m = new THREE.Mesh(geo, baseMat ? baseMat.clone() : new THREE.MeshStandardMaterial({ roughness: 0.7 }));
    m.name = (mesh.name || 'mesh') + '#island' + c;
    m.castShadow = true; m.receiveShadow = false;
    return { island: c, mesh: m, tris: src.length / 3, box: geo.boundingBox.clone() };
  });
}

const v3 = (THREE, b, fn) => b[fn](new THREE.Vector3());
const r3 = (v) => v.toArray().map((x) => +x.toFixed(4));

/**
 * Zerlegt ein geladenes glTF-Wurzelobjekt in Karosserie und Räder und hängt alles in EINE Gruppe,
 * deren Ursprung auf dem gemessenen Radaufstandspunkt liegt (y = 0 ist der Boden, x/z ist die
 * Fahrzeugmitte). Das ist der Rahmen, in dem Deformer und Fixtures rechnen.
 */
/* Die sechs achsenparallelen Lagen. Vier Vierteldrehungen um die Querachse reichten nicht: der
   Poly-Go-Kart liegt auf der SEITE, und keine x-Drehung richtet ihn auf (gemessen bei 0°, 90°,
   180°, 270° — einmal gekippt, einmal auf dem Kopf, zweimal auf der Kante). Wer eine Achse
   anbietet, kann nur die Haelfte der Faelle heilen. */
export const ORIENTS = [
  ['0°', 0, 0],
  ['X−90°', -Math.PI / 2, 0],
  ['X+90°', Math.PI / 2, 0],
  ['X180°', Math.PI, 0],
  ['Z−90°', 0, -Math.PI / 2],
  ['Z+90°', 0, Math.PI / 2],
];

export function analyse({ THREE, root, label = 'vehicle', upFix = false, orientX = 0 }) {
  /* Von Hand gesetzte Aufrichtung zuerst — sie muss VOR jeder Messung liegen, sonst stehen
     Radaufstandspunkt und Fahrzeugrahmen in der falschen Achse. */
  const oi = ((orientX % ORIENTS.length) + ORIENTS.length) % ORIENTS.length;
  if (oi) { root.rotation.x += ORIENTS[oi][1]; root.rotation.z += ORIENTS[oi][2]; }
  root.updateMatrixWorld(true);
  let whole = new THREE.Box3().setFromObject(root);
  let size = v3(THREE, whole, 'getSize'), centre = v3(THREE, whole, 'getCenter');
  const remeasure = () => { root.updateMatrixWorld(true); whole = new THREE.Box3().setFromObject(root); size = v3(THREE, whole, 'getSize'); centre = v3(THREE, whole, 'getCenter'); };

  /* AUFRICHTEN, aber nur auf Ansage. Poly-by-Google-Assets sind Z-up: der Go-Kart stand auf der
     Nase (Hülle 33,9 hoch gegen 39,5 lang) und die Radregel fand zehn »Räder« in Motorzylindern.
     Aus der Hüllbox allein ist das NICHT ableitbar — ein Mech oder eine Windturbine ist legitim
     höher als lang, und ein globales Aufrichten hätte sie umgelegt. Darum setzt `upFix` nur die
     Gruppe, bei der es gemessen wurde (siehe fixture-adapters.v2.js), und selbst dann greift es
     erst, wenn das Modell wirklich höher als lang ist. */
  let uprighted = false;
  if (upFix && size.y > size.z * 1.15) { root.rotation.x -= Math.PI / 2; remeasure(); uprighted = true; }

  /* LÄNGSACHSE MESSEN, nicht annehmen. Die Radregel und der ganze semantische Fahrzeugraum
     (forward = z, right = x, up = y) setzen voraus, dass das Modell längs z liegt. Kenney hält
     das ein, Poly-by-Google-Assets nicht: das Skateboard lag 5,97 lang auf X und 1,46 auf Z,
     und weil die Regel »dünnste Achse ist x« verlangt, hat sie alle vier Rollen verworfen —
     gemeldet als »0 Räder«. Ist die x-Ausdehnung deutlich größer als die z-Ausdehnung, wird das
     Modell einmal um 90° um die Hochachse gedreht und danach NEU vermessen. Die Schwelle 1,15
     lässt nahezu quadratische Grundflächen unangetastet, wo eine Drehung nur raten wäre. */
  let reoriented = false;
  if (size.x > size.z * 1.15) { root.rotation.y += Math.PI / 2; remeasure(); reoriented = true; }

  const meshes = []; root.traverse((n) => { if (n.isMesh && n.geometry) meshes.push(n); });

  /* Weg 1 · benannte Radknoten. Geprüft wird der Knotenname UND der Name seiner Netze. */
  const named = [];
  root.traverse((n) => { if (/wheel|tyre|tire|\brad\b/i.test(n.name || '') && (n.isMesh || n.children.some((c) => c.isMesh))) named.push(n); });

  const parts = [];
  if (!named.length) meshes.forEach((m) => { m.updateMatrixWorld(true); splitIslands({ THREE, mesh: m }).forEach((p) => { p.geoMatrix = m.matrixWorld.clone(); parts.push(p); }); });

  const candidates = [];
  /* Die FORMPRÜFUNG gilt in BEIDEN Wegen. Erste Fassung glaubte dem Namen allein — `raceCarRed`
     lieferte damit »12 Räder«, weil das Pack Felge, Reifen und Nabe je einzeln als Radknoten
     benennt. Ein Name ist ein Hinweis, die Form ist der Befund. */
  const isWheelBox = (b, c, s) => {
    const dims = [['x', s.x], ['y', s.y], ['z', s.z]].sort((a, d) => a[1] - d[1]);
    const thin = dims[0], d1 = dims[1][1], d2 = dims[2][1];
    return thin[0] === 'x'
      && d2 / Math.max(d1, 1e-6) <= 1.35
      && d2 / Math.max(thin[1], 1e-6) >= 1.5
      && (b.min.y - whole.min.y) <= size.y * 0.22
      && Math.abs(c.x - centre.x) > (size.x / 2) * 0.12
      && (d2 / 2) < size.z * 0.3;
  };

  if (named.length) {
    const rough = [];
    named.forEach((n) => {
      const b = new THREE.Box3().setFromObject(n), s = v3(THREE, b, 'getSize'), c = v3(THREE, b, 'getCenter');
      if (!isWheelBox(b, c, s)) return;
      const dims = [s.x, s.y, s.z].sort((a, d) => a - d);
      rough.push({ node: n, box: b, size: s, centre: c, radius: dims[2] / 2 });
    });
    /* KOAXIAL VERSCHMELZEN: was an derselben Nabe sitzt (x und z innerhalb 60 % des Radradius),
       ist EIN Rad — Felge plus Reifen plus Nabe. */
    const tol = Math.max(1e-4, (rough.reduce((a, r) => a + r.radius, 0) / Math.max(rough.length, 1)) * 0.6);
    const hubs = [];
    rough.forEach((r) => {
      const hit = hubs.find((h) => Math.abs(h.centre.x - r.centre.x) <= tol && Math.abs(h.centre.z - r.centre.z) <= tol);
      if (hit) { hit.nodes.push(r.node); hit.box.union(r.box); hit.centre = v3(THREE, hit.box, 'getCenter'); }
      else hubs.push({ nodes: [r.node], box: r.box.clone(), centre: r.centre.clone() });
    });
    hubs.forEach((h, i) => {
      const s = v3(THREE, h.box, 'getSize');
      const dims = [s.x, s.y, s.z].slice().sort((a, d) => a - d);
      candidates.push({ via: 'node', nodes: h.nodes, name: h.nodes.map((n) => n.name).join('+'), box: h.box, size: s, centre: h.centre, radius: dims[2] / 2, width: dims[0], index: i });
    });
  } else {
    parts.forEach((p, i) => {
      p.mesh.matrix.copy(p.geoMatrix); p.mesh.matrix.decompose(p.mesh.position, p.mesh.quaternion, p.mesh.scale);
      p.mesh.updateMatrixWorld(true);
      const b = p.box.clone().applyMatrix4(p.geoMatrix);
      const s = v3(THREE, b, 'getSize'), c = v3(THREE, b, 'getCenter');
      const dims = [s.x, s.y, s.z].slice().sort((a, d) => a - d);
      if (isWheelBox(b, c, s)) candidates.push({ via: 'island', part: p, name: p.mesh.name, box: b, size: s, centre: c, radius: dims[2] / 2, width: dims[0], index: i });
    });
  }

  /* Ist der Namens-Weg leer geblieben (benannte Knoten, aber keiner hält die Formprüfung), wird
     NACHGELADEN über die Inseln — sonst verliert ein Modell mit irreführenden Namen seine Räder. */
  if (named.length && !candidates.length) {
    meshes.forEach((m) => { m.updateMatrixWorld(true); splitIslands({ THREE, mesh: m }).forEach((p) => { p.geoMatrix = m.matrixWorld.clone(); parts.push(p); }); });
    parts.forEach((p, i) => {
      p.mesh.matrix.copy(p.geoMatrix); p.mesh.matrix.decompose(p.mesh.position, p.mesh.quaternion, p.mesh.scale);
      p.mesh.updateMatrixWorld(true);
      const b = p.box.clone().applyMatrix4(p.geoMatrix);
      const s = v3(THREE, b, 'getSize'), c = v3(THREE, b, 'getCenter');
      const dims = [s.x, s.y, s.z].slice().sort((a, d) => a - d);
      if (isWheelBox(b, c, s)) candidates.push({ via: 'island', part: p, name: p.mesh.name, box: b, size: s, centre: c, radius: dims[2] / 2, width: dims[0], index: i });
    });
  }

  /* ── RÄDER KOMMEN PAARWEISE ────────────────────────────────────────────────────────────────
     Das ist der Test, der vorher fehlte, und er kostete echte Fehler: der Poly-Police-Car meldete
     15 »Räder«, weil die Türplatte, Auspuffrohre und Scheinwerfer die fünf Formbedingungen
     erfüllen — und weil sie als Rad geriggt wurden, ROTIERTE die Tür bei ACCEL mit. Der Wagon
     meldete 10.

     Eine Scheibe allein ist kein Rad. Ein Rad hat drei Eigenschaften, die ein Türblatt nicht hat:
       1 GEGENSTÜCK. Es gibt ein zweites auf der anderen Fahrzeugseite, bei gleichem z und mit
         gleichem Radius (±25 %). Eine Tür sitzt nur auf einer Seite; eine Türplatte und ihr
         Gegenstück haben verschiedene z-Lagen, weil sie gespiegelt an DERSELBEN Achse liegen.
       2 BODENKONTAKT. Alle Räder eines Fahrzeugs stehen auf derselben Höhe. Was mehr als 15 % der
         Fahrzeughöhe über dem tiefsten Paar hängt, trägt nicht.
       3 GLEICHE GRÖSSE. Radien streuen um den Median um höchstens 35 %. Ein Scheinwerfer ist
         kleiner, ein Reserverad sitzt woanders.
     Alle drei sind gemessen, keiner ist geraten. Bleibt nach der Prüfung nichts übrig, meldet der
     Bericht 0 Räder — das ist ehrlicher als eine rotierende Tür. */
  if (candidates.length) {
    const radii = candidates.map((c) => c.radius).slice().sort((a, b) => a - b);
    const median = radii[Math.floor(radii.length / 2)];
    const ztol = Math.max(1e-4, median * 0.8);
    const paired = candidates.filter((c) => candidates.some((d) => d !== c
      && Math.abs(d.centre.z - c.centre.z) <= ztol
      && Math.sign(d.centre.x - centre.x) !== Math.sign(c.centre.x - centre.x)
      && Math.abs(d.radius - c.radius) <= Math.max(d.radius, c.radius) * 0.25));
    const pool = paired.length >= 2 ? paired : candidates;
    const floor = Math.min(...pool.map((c) => c.box.min.y));
    const grounded = pool.filter((c) => (c.box.min.y - floor) <= size.y * 0.15);
    const sized = grounded.filter((c) => Math.abs(c.radius - median) <= Math.max(median, 1e-6) * 0.35);
    const kept = sized.length >= 2 ? sized : grounded;
    candidates.length = 0; kept.forEach((c) => candidates.push(c));
  }

  /* Der Aufstandspunkt ist die Unterkante der RÄDER, nicht die des ganzen Fahrzeugs — ein tiefer
     Frontsplitter würde sonst den Boden bestimmen und das Rig läge in der Luft. */
  const contactY = candidates.length ? Math.min(...candidates.map((c) => c.box.min.y)) : whole.min.y;

  /* ALLES WIRD IN EINEN RAUM GEBACKEN. Die erste Fassung hat stattdessen Knoten umgehängt und
     Weltmatrizen gegeneinander gerechnet — das Fahrzeug fiel auseinander, weil die Matrizen der
     frisch gebauten Drehpunkte noch nicht aktualisiert waren. Und es war ohnehin der falsche Weg:
     der Shader des Deformers rechnet in OBJEKTKOORDINATEN, also muss der Nullpunkt jedes Netzes
     der Aufstandspunkt sein. Dieselbe Lehre steht in `kfb-cartoon-deform.js`, wo alle Teilnetze
     in den Wurzelraum gebacken werden, damit sie EINE Box teilen. Die Datei bleibt unberührt:
     gebacken wird in eine Kopie der Geometrie. */
  const off = new THREE.Matrix4().makeTranslation(-centre.x, -contactY, -centre.z);
  const group = new THREE.Group(); group.name = 'kfb-vehicle:' + label;
  const body = new THREE.Group(); body.name = 'body'; group.add(body);

  const bake = (mesh, extra) => {
    const geo = mesh.geometry.clone();
    const M = new THREE.Matrix4().multiplyMatrices(off, mesh.matrixWorld);
    geo.applyMatrix4(extra ? new THREE.Matrix4().multiplyMatrices(extra, M) : M);
    geo.computeBoundingBox();
    const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material).clone();
    const m = new THREE.Mesh(geo, mat);
    m.name = mesh.name || 'mesh';
    m.castShadow = true; m.frustumCulled = false;
    return m;
  };

  /* Welche Netze gehören zu einem Rad? Im Knoten-Weg alle unter dem Radknoten, im Insel-Weg
     genau die eine Insel. Der Rest ist Karosserie. */
  const wheelMeshes = new Set();
  candidates.forEach((c) => {
    if (c.via === 'node') c.nodes.forEach((n) => n.traverse((x) => { if (x.isMesh) wheelMeshes.add(x); }));
    else wheelMeshes.add(c.part.mesh);
  });

  const wheels = candidates.map((c) => {
    const local = c.centre.clone().applyMatrix4(off);
    const steer = new THREE.Group(); steer.name = 'steer';
    const susp = new THREE.Group(); susp.name = 'susp';
    const spin = new THREE.Group(); spin.name = 'spin';
    steer.position.copy(local); steer.add(susp); susp.add(spin); group.add(steer);
    /* Das Rad wird um seine GEMESSENE Nabe gebacken (Versatz −local), sonst dreht es um den
       Fahrzeugursprung — derselbe Drehpunkt-Befund wie in `lab-v6/partrig.v1.js`. */
    const hub = new THREE.Matrix4().makeTranslation(-local.x, -local.y, -local.z);
    const srcs = [];
    if (c.via === 'node') c.nodes.forEach((n) => n.traverse((x) => { if (x.isMesh) srcs.push(x); }));
    else srcs.push(c.part.mesh);
    srcs.forEach((m) => { m.updateMatrixWorld(true); spin.add(bake(m, hub)); });
    const wb = new THREE.Box3().setFromObject(spin);
    const ws = v3(THREE, wb, 'getSize');
    const dims = [['x', ws.x], ['y', ws.y], ['z', ws.z]].sort((a, d) => a[1] - d[1]);
    return { via: c.via, name: c.name, radius: +(dims[2][1] / 2).toFixed(4), width: +dims[0][1].toFixed(4),
      axle: dims[0][0], centre: local, side: local.x < 0 ? 'R' : 'L', end: null, steer, susp, spin, base: local.clone() };
  });

  const bodySrc = (named.length ? meshes : parts.map((p) => p.mesh)).filter((m) => !wheelMeshes.has(m));
  bodySrc.forEach((m) => { m.updateMatrixWorld(true); body.add(bake(m, null)); });

  /* Vorn/hinten: die Radpaare werden nach z sortiert, die vordere Gruppe ist die, die in
     Blickrichtung liegt. Blickrichtung ist NICHT gemessen (kein Modell sagt sie) — sie ist ein
     Schalter, Vorgabe +z, in der Oberfläche umkehrbar. Darum steht hier nur »zPlus/zMinus«. */
  if (wheels.length) {
    const zs = wheels.map((w) => w.centre.z).sort((a, b) => a - b);
    const mid = (zs[0] + zs[zs.length - 1]) / 2;
    wheels.forEach((w) => { w.end = w.centre.z >= mid ? 'zPlus' : 'zMinus'; });
  }

  const bodyBox = new THREE.Box3().setFromObject(group);
  const track = wheels.length ? Math.max(...wheels.map((w) => Math.abs(w.centre.x))) * 2 : size.x;
  const wheelbase = wheels.length ? Math.max(...wheels.map((w) => w.centre.z)) - Math.min(...wheels.map((w) => w.centre.z)) : size.z;
  const radius = wheels.length ? wheels.reduce((s, w) => s + w.radius, 0) / wheels.length : 0;

  return {
    schema: SCHEMA, label, group, body, wheels,
    frame: { contactY: +contactY.toFixed(4), height: +(bodyBox.max.y).toFixed(4), length: +size.z.toFixed(4), width: +size.x.toFixed(4) },
    report: {
      label, meshes: meshes.length, islands: parts.length || null, wheelSource: candidates.length ? candidates[0].via : 'none',
      wheelNames: wheels.map((w) => w.name), reoriented, uprighted, orientX: oi, orientLabel: ORIENTS[oi][0],
      wheels: wheels.length, wheelRadius: +radius.toFixed(4), wheelWidth: wheels.length ? +wheels[0].width.toFixed(4) : null,
      track: +track.toFixed(4), wheelbase: +wheelbase.toFixed(4),
      size: r3(size), sizeRigged: r3(v3(THREE, bodyBox, 'getSize')),
      contactY: +contactY.toFixed(4), tris: meshes.reduce((s, m) => s + (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3, 0),
      rule: WHEEL_RULE,
    },
  };
}

/** Radgriffe. Ein Aufruf je Bild, nicht je Ereignis. */
export class WheelRig {
  constructor({ THREE, rig, facing = 1 }) {
    this.T = THREE; this.rig = rig; this.facing = facing;
    this.angle = 0; this.steerDeg = 0; this.scrunch = 0;
    this.susp = rig.wheels.map(() => 0);
  }
  get frontEnd() { return this.facing >= 0 ? 'zPlus' : 'zMinus'; }
  /** speed in u/s, positiv = vorwärts. */
  spin(dt, speed) {
    const r = this.rig.report.wheelRadius || 0.001;
    this.angle += (speed / r) * dt * this.facing;
    this.rig.wheels.forEach((w) => { w.spin.rotation.x = this.angle; });
  }
  setSteer(deg) {
    this.steerDeg = deg;
    const front = this.frontEnd;
    this.rig.wheels.forEach((w) => { w.steer.rotation.y = w.end === front ? (deg * Math.PI / 180) : 0; });
  }
  /** Federweg je Rad in u (negativ = eingefedert) plus Rad-Stauchung am Aufstandspunkt. */
  setSuspension(list, scrunch = 0) {
    this.rig.wheels.forEach((w, i) => {
      const dy = Array.isArray(list) ? (list[i] || 0) : (list || 0);
      w.susp.position.y = dy;
      /* Rad-Stauchung: nur die Höhe gibt nach, die Breite bleibt. Ein Rad, das beim Einschlag
         rundum kleiner wird, liest als Skalierungsfehler, nicht als Gummi. */
      const k = 1 - Math.max(0, Math.min(0.5, scrunch));
      w.spin.scale.set(1, k, 1);
    });
    this.scrunch = scrunch;
  }
  reset() { this.angle = 0; this.setSteer(0); this.setSuspension(0, 0); }
}
