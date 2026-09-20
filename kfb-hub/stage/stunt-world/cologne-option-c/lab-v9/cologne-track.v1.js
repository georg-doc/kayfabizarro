// KFB Cologne Race · Option C · TrackFlowDeformer
//
// Eine eigene Verformungsfamilie fuer die Strecke (§25). Sie teilt die globalen
// Weltparameter (windDirection, worldPulse, elasticity) mit den anderen Familien,
// kennt aber nur ihre eigene Topologie: ein Band mit Bogenlaenge, Breite und
// Ueberhoehung.
//
// Regeln aus dem Brief, die hier Geometrie geworden sind:
//   §7  breite fliessende Baender, weiche Schultern, durchgehende Geometrie
//   §33 kein schwarzes Asphaltband, keine dichten Mikrostreifen,
//       kein Gelaende, das die Strecke durchstoesst
//   §4  SURFACE_BOUND traegt sich auf dem Boden, STRUCTURE traegt ein eigenes Bauwerk

import { C } from './option-c-style.v1.js';

const flat = (THREE, color, opts = {}) => new THREE.MeshStandardMaterial(
  Object.assign({ color, roughness: 0.92, metalness: 0.0, flatShading: false }, opts));

function ribbon(THREE, pts, leftFn, rightFn, yFn) {
  const pos = [], idx = [], nrm = [];
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const l = leftFn(p, i), r = rightFn(p, i);
    pos.push(l.x, l.y, l.z, r.x, r.y, r.z);
    nrm.push(0, 1, 0, 0, 1, 0);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2, b = i * 2 + 1;
    const j = ((i + 1) % n) * 2, k = ((i + 1) % n) * 2 + 1;
    idx.push(a, j, b, b, j, k);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// Querschnittspunkt: u ist der Abstand von der Mittellinie in Bandbreiten (-1..1),
// die Ueberhoehung hebt die Aussenseite.
function crossPoint(p, u, lift = 0) {
  const half = p.w * 0.5;
  const off = u * half;
  return {
    x: p.x + p.nx * off,
    y: p.y + Math.sin(p.bank) * off + lift,
    z: p.z + p.nz * off
  };
}

export function buildTrack(THREE, route, opts = {}) {
  const group = new THREE.Group();
  group.name = 'TrackFlow';
  const pts = route.points;
  const parts = {};

  // --- Fahrbahn -----------------------------------------------------------
  const bed = ribbon(THREE, pts, p => crossPoint(p, -1, 0), p => crossPoint(p, 1, 0));
  // Farbverlauf ueber die Bandbreite: aussen dunkler, damit die Kante bei Tempo liest
  // Eigenleuchten haelt den Farbton gegen das warme Licht — die Fahrbahn bleibt teal.
  const bedMat = flat(THREE, C.bed, { roughness: 0.86, emissive: C.bedDark, emissiveIntensity: 0.55 });
  const bedMesh = new THREE.Mesh(bed, bedMat);
  bedMesh.name = 'track-bed';
  bedMesh.receiveShadow = true;
  group.add(bedMesh);
  parts.bed = bedMesh;

  // --- Schultern: weicher Abfall nach aussen, warmer Ton von Tafel 02 ------
  for (const side of [-1, 1]) {
    const g = ribbon(THREE, pts,
      p => crossPoint(p, side * 1.0, 0),
      p => crossPoint(p, side * 1.30, -0.9));
    const m = new THREE.Mesh(g, flat(THREE, C.shoulder, { roughness: 0.95, emissive: C.shoulderLo, emissiveIntensity: 0.22 }));
    m.name = 'track-shoulder-' + (side < 0 ? 'left' : 'right');
    m.receiveShadow = true;
    group.add(m);
  }

  // --- Aussenstreifen: orange-gelb, durchgehend -----------------------------
  for (const side of [-1, 1]) {
    const g = ribbon(THREE, pts,
      p => crossPoint(p, side * 0.955, 0.10),
      p => crossPoint(p, side * 1.0, 0.10));
    const edge = new THREE.Mesh(g, flat(THREE, C.lineOrange, { roughness: 0.7 }));
    edge.name = 'track-line-outer-' + (side < 0 ? 'left' : 'right');
    group.add(edge);
  }

  // --- Randmauer: niedrig, warm, mit heller Oberkante ----------------------
  for (const side of [-1, 1]) {
    const wall = ribbon(THREE, pts,
      p => crossPoint(p, side * 1.30, -0.9),
      p => crossPoint(p, side * 1.30, 1.9));
    const m = new THREE.Mesh(wall, flat(THREE, C.shoulderLo, { roughness: 0.94, side: THREE.DoubleSide }));
    m.name = 'track-wall-' + (side < 0 ? 'left' : 'right');
    group.add(m);
    const cap = ribbon(THREE, pts,
      p => crossPoint(p, side * 1.30, 1.9),
      p => crossPoint(p, side * 1.44, 1.7));
    group.add(new THREE.Mesh(cap, flat(THREE, C.lineOrange, { roughness: 0.8 })));
  }

  // --- Mittelstreifen: Striche mit Luecken, Verkehrslogik ------------------
  // Eine durchgehende Ader gibt kein Tempogefuehl. Ein Strich alle 12 m mit
  // 5 m Strich und 7 m Luecke laeuft bei 41 m/s rund dreieinhalb mal je Sekunde
  // durchs Bild — das ist der Takt, an dem man Geschwindigkeit ablesen kann.
  {
    const DASH = 5.0, GAP = 7.0;
    let acc = 0, on = true, run = [];
    const dashes = [];
    for (let i = 0; i < pts.length; i++) {
      run.push(pts[i]);
      acc += pts[i].ds;
      if (on && acc >= DASH) { if (run.length > 1) dashes.push(run); run = [pts[i]]; acc = 0; on = false; }
      else if (!on && acc >= GAP) { run = [pts[i]]; acc = 0; on = true; }
    }
    if (on && run.length > 1) dashes.push(run);
    const dashMat = flat(THREE, C.lineYellow, { roughness: 0.6 });
    for (const seg of dashes) {
      const g = openRibbon(THREE, seg,
        p => crossPoint(p, -0.026, 0.06),
        p => crossPoint(p, 0.026, 0.06));
      const dash = new THREE.Mesh(g, dashMat);
      dash.name = 'track-line-center';
      group.add(dash);
    }
    parts.centerDashes = { count: dashes.length, dashM: DASH, gapM: GAP };
  }

  // Keine zusaetzlichen Fahrspurbaender: Mittel- und Aussenstreifen muessen
  // bei Tempo eindeutig bleiben und duerfen nicht als vierte Spur flimmern.

  // --- Bauwerk unter STRUCTURE-Abschnitten ---------------------------------
  const structurePts = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    if (p.kind === 'STRUCTURE') structurePts.push({ p, i });
  }

  if (structurePts.length) {
    // Deckunterseite als eigenes Band
    const deckIdx = structurePts.map(o => o.i);
    const runs = groupRuns(deckIdx, pts.length);
    for (const run of runs) {
      const sub = run.map(i => pts[i]);
      if (sub.length < 3) continue;
      const under = openRibbon(THREE, sub,
        p => crossPoint(p, -1.32, -1.8),
        p => crossPoint(p, 1.32, -1.8));
      const m = new THREE.Mesh(under, flat(THREE, C.structureLo, { roughness: 0.96, side: THREE.DoubleSide }));
      m.name = 'structure-soffit';
      group.add(m);
      // Seitenschuerzen
      for (const side of [-1, 1]) {
        const skirt = openRibbon(THREE, sub,
          p => crossPoint(p, side * 1.32, -0.9),
          p => crossPoint(p, side * 1.32, -1.8));
        group.add(new THREE.Mesh(skirt, flat(THREE, C.structure, { roughness: 0.94, side: THREE.DoubleSide })));
      }
      // Pfeiler alle ~34 m, nur wo das Deck wirklich traegt
      const pillarGeo = new THREE.CylinderGeometry(1.25, 1.55, 1, 8);
      const pillarMat = flat(THREE, C.structure, { roughness: 0.95 });
      let acc = 0;
      for (let k = 1; k < sub.length - 1; k++) {
        acc += sub[k].ds;
        if (acc < 34) continue;
        acc = 0;
        const p = sub[k];
        const h = p.y - 1.8;
        if (h < 2.5) continue;
        // Stuetzen stehen ausserhalb des befahrbaren Bandes. Die alte Position
        // bei ±0,85 lag sichtbar in der Strecke und sah wie ein zu langer,
        // falsch beschnittener Zylinder aus.
        for (const side of [-1.16, 1.16]) {
          const base = crossPoint(p, side, -1.8);
          const m2 = new THREE.Mesh(pillarGeo, pillarMat);
          m2.position.set(base.x, h * 0.5, base.z);
          m2.scale.y = h;
          m2.castShadow = true;
          m2.name = 'structure-pillar';
          m2.userData.kfbRole = 'structure-support';
          m2.userData.routeS = +p.s.toFixed(2);
          group.add(m2);
        }
      }
    }
  }

  // --- Tunnel: dichte Boegen, grosser lesbarer Querschnitt (§7) ------------
  const tunnelIdx = [];
  for (let i = 0; i < pts.length; i++) if (pts[i].kind === 'TUNNEL') tunnelIdx.push(i);
  const tunnelRuns = groupRuns(tunnelIdx, pts.length);
  const arches = [];
  for (const run of tunnelRuns) {
    const sub = run.map(i => pts[i]);
    if (sub.length < 4) continue;
    // Tunnelroehre als Halbschale
    const RIB = 14;
    const pos = [], idx = [];
    for (let i = 0; i < sub.length; i++) {
      const p = sub[i];
      for (let r = 0; r <= RIB; r++) {
        const a = Math.PI * (r / RIB);
        const u = -Math.cos(a) * 1.28;
        const lift = Math.sin(a) * 11.5 - 1.2;
        const q = crossPoint(p, u, lift);
        pos.push(q.x, q.y, q.z);
      }
    }
    for (let i = 0; i < sub.length - 1; i++) {
      for (let r = 0; r < RIB; r++) {
        const a = i * (RIB + 1) + r, b = a + 1, c = a + RIB + 1, d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    const shell = new THREE.Mesh(g, flat(THREE, C.shoulderLo, { roughness: 0.98, side: THREE.BackSide }));
    shell.name = 'tunnel-shell';
    group.add(shell);

    // Rippen: leuchtende Boegen in gemessenem Cyan, in dichter Folge
    const ribMat = new THREE.MeshBasicMaterial({ color: C.bedLight });
    let acc = 0;
    for (let i = 1; i < sub.length - 1; i++) {
      acc += sub[i].ds;
      if (acc < 7.5) continue;
      acc = 0;
      const p = sub[i];
      const curve = [];
      for (let r = 0; r <= 18; r++) {
        const a = Math.PI * (r / 18);
        curve.push(new THREE.Vector3().copy(crossPoint(p, -Math.cos(a) * 1.22, Math.sin(a) * 11.0 - 1.2)));
      }
      const rg = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curve), 22, 0.34, 6, false);
      const rm = new THREE.Mesh(rg, ribMat);
      rm.name = 'tunnel-arch';
      group.add(rm);
      arches.push(rm);
    }
  }

  // --- Start / Ziel --------------------------------------------------------
  // Start und Ziel sind ein echtes Kenney-Modell, kein gefaerbtes Rechteck.
  // Siehe cologne-props.v1.js -> buildStartGate(). Die Behelfsplatte, die hier stand,
  // war im Bild eine ockerfarbene Flaeche quer ueber der Startgeraden.

  // --- Kaskade am Bandrand ------------------------------------------------
  // Wiederkehrende Staebe entlang beider Schultern. Die Hoehe laeuft als lange
  // Welle durch die Reihe, deshalb liest sie als Kaskade und nicht als Zaun.
  // Alle 9,5 m ein Stab; die Wellenlaenge ist ein Vielfaches davon, damit sich
  // das Muster nicht mit der Streckenabtastung verhakt.
  {
    const SPACING = 9.5;
    const WAVE = SPACING * 14;
    const postGeo = new THREE.BoxGeometry(0.42, 1, 0.42);
    const finGeo = new THREE.BoxGeometry(0.16, 0.9, 1.9);
    const counts = [];
    let acc = 0;
    for (let i = 1; i < pts.length; i++) {
      acc += pts[i].ds;
      if (acc >= SPACING) { acc = 0; counts.push(i); }
    }
    const postMat = flat(THREE, C.structure, { roughness: 0.94 });
    const finMat = new THREE.MeshBasicMaterial({ color: C.lineYellow, transparent: true, opacity: 0.72 });
    const posts = new THREE.InstancedMesh(postGeo, postMat, counts.length * 2);
    const fins = new THREE.InstancedMesh(finGeo, finMat, counts.length * 2);
    posts.name = 'cascade-posts'; fins.name = 'cascade-fins';
    posts.castShadow = true;
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), pos3 = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    let n = 0;
    for (const idx of counts) {
      const p = pts[idx];
      const phase = (p.s / WAVE) * Math.PI * 2;
      for (const side of [-1, 1]) {
        const swing = Math.sin(phase + (side < 0 ? 0 : Math.PI * 0.35));
        const h = 2.4 + (swing * 0.5 + 0.5) * 4.6;          // 2,4 .. 7,0 m
        const base = crossPoint(p, side * 1.46, -0.7);
        const yaw = Math.atan2(p.tx, p.tz);
        q.setFromAxisAngle(up, yaw);
        pos3.set(base.x, base.y + h * 0.5, base.z);
        sc.set(1, h, 1);
        m4.compose(pos3, q, sc);
        posts.setMatrixAt(n, m4);
        pos3.set(base.x, base.y + h - 0.55, base.z);
        sc.set(1, 1, 1);
        m4.compose(pos3, q, sc);
        fins.setMatrixAt(n, m4);
        n++;
      }
    }
    posts.count = n; fins.count = n;
    posts.instanceMatrix.needsUpdate = true; fins.instanceMatrix.needsUpdate = true;
    group.add(posts, fins);
    parts.cascade = { posts: n, spacingM: SPACING, waveM: WAVE, minH: 2.4, maxH: 7.0 };
  }

  parts.arches = arches;
  return { group, parts };
}

// Zusammenhaengende Laeufe in einem zyklischen Index finden
function groupRuns(indices, total) {
  if (!indices.length) return [];
  const set = new Set(indices);
  const seen = new Set();
  const runs = [];
  for (const i of indices) {
    if (seen.has(i)) continue;
    if (set.has((i - 1 + total) % total)) continue;
    const run = [];
    let k = i;
    while (set.has(k) && !seen.has(k)) { run.push(k); seen.add(k); k = (k + 1) % total; }
    runs.push(run);
  }
  if (!runs.length) runs.push(indices.slice());
  return runs;
}

// Offenes Band (nicht geschlossen) fuer Teilabschnitte
function openRibbon(THREE, pts, leftFn, rightFn) {
  const pos = [], idx = [];
  for (const p of pts) {
    const l = leftFn(p), r = rightFn(p);
    pos.push(l.x, l.y, l.z, r.x, r.y, r.z);
  }
  for (let i = 0; i < pts.length - 1; i++) {
    const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
    idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
