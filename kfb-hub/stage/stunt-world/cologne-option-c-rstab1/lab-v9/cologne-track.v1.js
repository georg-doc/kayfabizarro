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

// Masse der Tunnel-Halbschale, in Einheiten von crossPoint: uMax ist das
// Vielfache der halben Bandbreite, rise die Scheitelhoehe ueber der Fahrbahn,
// drop die Tiefe der Schalenfuesse darunter. Exportiert, damit die Bodenplatte
// ihren Einschnitt an derselben Flaeche enden lassen kann.
export const TUNNEL_SHELL = { uMax: 1.28, rise: 11.5, drop: 1.2, rib: 14 };

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

// RSTAB-1: actual rendered tunnel-shell intersection with a horizontal world plane.
// The old ground seam solved a smooth, unbanked half-circle while the visible shell is
// banked and faceted. At strong bank that moved the two ground intersections by metres
// in opposite directions. This pure helper uses the same RIB vertices as buildTrack().
export function tunnelShellGroundSpan(p, worldY) {
  const half = p.w * 0.5;
  const verts = [];
  for (let r = 0; r <= TUNNEL_SHELL.rib; r++) {
    const a = Math.PI * (r / TUNNEL_SHELL.rib);
    const off = -Math.cos(a) * TUNNEL_SHELL.uMax * half;
    const y = p.y + Math.sin(p.bank) * off +
      Math.sin(a) * TUNNEL_SHELL.rise - TUNNEL_SHELL.drop;
    verts.push({ off, y });
  }

  let negative = null, positive = null;
  const take = off => {
    if (off < 0) negative = Math.abs(off);
    else if (off > 0) positive = Math.abs(off);
  };
  for (let i = 0; i < verts.length - 1; i++) {
    const a = verts[i], b = verts[i + 1];
    const da = a.y - worldY, db = b.y - worldY;
    if (Math.abs(da) < 1e-9) take(a.off);
    if (da * db <= 0 && Math.abs(b.y - a.y) > 1e-9) {
      const t = (worldY - a.y) / (b.y - a.y);
      if (t >= 0 && t <= 1) take(a.off + (b.off - a.off) * t);
    }
  }

  const foot = TUNNEL_SHELL.uMax * half;
  // If a shell foot already stands above the ground plane there is no crossing
  // on that side: the cut must reach the actual foot rather than jump closed.
  if (negative == null && verts[0].y >= worldY) negative = foot;
  if (positive == null && verts[verts.length - 1].y >= worldY) positive = foot;

  return { negative, positive };
}

// RSTAB-1: a support spans from the real local banked soffit endpoint to ground.
// Do not derive its top from the centerline p.y; that is what produced three
// downhill pillars through the road at indices 166 / 179 / 187.
export function structurePillarSpan(p, side, groundY = 0) {
  const top = crossPoint(p, side, -1.8);
  const height = top.y - groundY;
  return { top, groundY, height, centerY: groundY + height * 0.5 };
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

  // --- Randleisten: schmal, durchgehend ------------------------------------
  // Verkehrslogik nach Georgs Vorgabe: MITTE gelb, AUSSEN orange-gelb. Die
  // aeussersten Streifen tragen deshalb den gemessenen Goldton (Tafel 01, 0,43 %),
  // nicht mehr das Creme — Creme lag zu nah am warmen Bauwerk daneben.
  for (const side of [-1, 1]) {
    const g = ribbon(THREE, pts,
      p => crossPoint(p, side * 0.955, 0.10),
      p => crossPoint(p, side * 1.0, 0.10));
    group.add(new THREE.Mesh(g, flat(THREE, C.lineOuter, { roughness: 0.7 })));
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
  //
  // GEMELDETER BEFUND (Georg): die Striche sitzen unregelmaessig, mal laenger,
  // mal kuerzer. Ursache: die Grenzen wurden auf STUETZPUNKTE gerundet, und die
  // liegen rund 3,45 m auseinander. Ein 5-m-Strich passt in dieses Raster
  // schlicht nicht — er wurde je nach Phase 3,45 oder 6,9 m lang. Die Grenzen
  // werden jetzt EXAKT auf der Bogenlaenge gesetzt und der Stuetzpunkt dafuer
  // zwischen den Nachbarn interpoliert.
  {
    const DASH = 5.0, GAP = 7.0;
    const lerpPt = (a, b, u) => {
      const o = {};
      for (const key in a) {
        const va = a[key], vb = b[key];
        o[key] = (typeof va === 'number' && typeof vb === 'number') ? va + (vb - va) * u : va;
      }
      return o;
    };
    const dashes = [];
    let run = [pts[0]];
    let acc = 0, on = true;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const seg = Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
      if (seg < 1e-6) continue;
      let consumed = 0;
      while (true) {
        const need = (on ? DASH : GAP) - acc;
        if (need > seg - consumed) { acc += seg - consumed; break; }
        consumed += need;
        const cutPt = lerpPt(a, b, consumed / seg);
        if (on) { run.push(cutPt); if (run.length > 1) dashes.push(run); run = []; }
        else { run = [cutPt]; }
        on = !on;
        acc = 0;
      }
      if (on) run.push(b);
    }
    if (on && run.length > 1) dashes.push(run);
    // Mittelstreifen GELB (C.lineYellow, Tafel 02 Akzent 0,48 %)
    const dashMat = flat(THREE, C.lineYellow, { roughness: 0.6 });
    for (const seg of dashes) {
      const g = openRibbon(THREE, seg,
        p => crossPoint(p, -0.026, 0.06),
        p => crossPoint(p, 0.026, 0.06));
      group.add(new THREE.Mesh(g, dashMat));
    }
    parts.centerDashes = { count: dashes.length, dashM: DASH, gapM: GAP, exactArcLength: true };
  }

  // --- Zwei Fahrspurbaender, weit auseinander (§7: keine Moiré-Streifung) --
  for (const u of [-0.52, 0.52]) {
    const g = ribbon(THREE, pts,
      p => crossPoint(p, u - 0.014, 0.05),
      p => crossPoint(p, u + 0.014, 0.05));
    group.add(new THREE.Mesh(g, flat(THREE, C.lineOuter, { roughness: 0.6, transparent: true, opacity: 0.85 })));
  }

  // --- Bauwerk unter STRUCTURE-Abschnitten ---------------------------------
  const structurePts = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    if (p.kind === 'STRUCTURE' || (p.kind !== 'TUNNEL' && p.y > 3.5)) structurePts.push({ p, i });
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
      const pillarGeo = new THREE.CylinderGeometry(1.5, 2.3, 1, 10);
      const pillarMat = flat(THREE, C.structure, { roughness: 0.95 });
      let acc = 0;
      for (let k = 1; k < sub.length - 1; k++) {
        acc += sub[k].ds;
        if (acc < 34) continue;
        acc = 0;
        const p = sub[k];
        // Preserve the existing support cadence/topology. The old 2.5 m gate was
        // centerline-owned and admitted both sides together; RSTAB-1 changes only
        // each pillar's real local top, not whether a support pair exists.
        if (p.y - 1.8 < 2.5) continue;
        for (const side of [-0.85, 0.85]) {
          const span = structurePillarSpan(p, side, 0);
          if (span.height <= 0) continue;
          const m2 = new THREE.Mesh(pillarGeo, pillarMat);
          m2.position.set(span.top.x, span.centerY, span.top.z);
          m2.scale.y = span.height;
          m2.castShadow = true;
          m2.name = 'structure-pillar';
          m2.userData.rstab1 = {
            routeIndex: run[k], side,
            topY: +span.top.y.toFixed(4),
            height: +span.height.toFixed(4)
          };
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
    // Tunnelroehre als Halbschale. Die drei Zahlen sind exportiert, weil die
    // Bodenplatte sie braucht: sie muss ihren Einschnitt genau an dieser Schale
    // enden lassen, sonst klafft zwischen Rohr und Platte ein Streifen offener
    // Grabenwand — Georgs brauner Keil im Tunnel.
    const RIB = TUNNEL_SHELL.rib;
    const pos = [], idx = [];
    for (let i = 0; i < sub.length; i++) {
      const p = sub[i];
      for (let r = 0; r <= RIB; r++) {
        const a = Math.PI * (r / RIB);
        const u = -Math.cos(a) * TUNNEL_SHELL.uMax;
        const lift = Math.sin(a) * TUNNEL_SHELL.rise - TUNNEL_SHELL.drop;
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
    // GEMESSENER BEFUND 2026-09-22: die Schale stand auf BackSide. Eine halbe
    // Roehre ist von INNEN und von AUSSEN zu sehen — man faehrt hindurch und
    // faehrt daran vorbei. Einseitig gerendert verschwindet die Decke, sobald
    // man drinsteht, und uebrig bleiben die Rippen: es sieht aus wie eine Reihe
    // Boegen statt eines gedeckten Tunnels. DoubleSide, eine Naht.
    const shell = new THREE.Mesh(g, flat(THREE, C.shoulderLo, { roughness: 0.98, side: THREE.DoubleSide }));
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
