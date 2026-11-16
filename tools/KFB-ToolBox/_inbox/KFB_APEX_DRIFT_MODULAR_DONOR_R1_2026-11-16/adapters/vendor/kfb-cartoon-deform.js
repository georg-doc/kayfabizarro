// ============================================================================
// kfb-cartoon-deform.js — Cartoon-Verbieger für Zone-Props
//
// Weiche Bogen-Verbiegung + Neigung + Verjüngung + eine Spur Verdrehung, stärker
// nach oben hin, optional atmendes Squash & Stretch. Nickelodeon-Look: ein gerader
// Turm wird eine leichte Banane, kein Gummi.
//
// DREI REGELN, die den Look tragen (Handover §2/§3/§8):
//
// 1 OBJEKT-NORMIERT, nie in Weltmetern. Alles rechnet in `t = (y - bbMinY) / höhe`.
//   Ein Fass und ein Turm biegen sich damit gleich stark RELATIV — das ganze Set
//   spricht eine Sprache. In Metern gerechnet wäre der Turm eine Banane und das
//   Fass unverändert.
//
// 2 AM BODEN VERANKERT. Biegung mit t², Neigung mit t. Der Fuß steht, der Kopf ist
//   krumm. Kein Schweben, kein abgeschnittener Fuß.
//
// 3 EIN PARAMETERSATZ PRO SET, PER-INSTANZ-SEED INNERHALB DER GRENZEN. Jede Instanz
//   zieht ihre Werte aus mulberry32(seed) — alle unterschiedlich krumm, aber
//   reproduzierbar. Gleicher Seed = gleiche Form, kein Flackern beim Neuladen.
//
// Nichts an der Datei ändern: die Verformung sitzt im Vertex-Shader, per
// onBeforeCompile auf dem vorhandenen Prop-Material.
//
// Vertrag:
//   const h = applyCartoonDeform(THREE, gltfSceneOrMesh, { limits, seed, mode });
//   h.setLimits({ bend, lean, taper, twist, squash });
//   h.setSeed(n);            // neue Form, sofort
//   h.update(timeSeconds);   // nur nötig, wenn squash > 0
//   h.info                   // { bendable, segmentsY, height } je Mesh
//   h.dispose();
// ============================================================================

export const DEFAULT_LIMITS = {
  // Konservative Startwerte (Handover §7). Am Regler konvergieren, nicht raten.
  bend: 0.06,      // × Höhe, Bogen (t²)
  lean: 0.05,      // × Höhe, Neigung (linear)
  taper: 0.12,     // oben schmaler
  twist: 6,        // Grad um die Hochachse
  squash: 0.03,    // Amplitude, volumenerhaltend
  squashSpeed: 1.1,
};

/** mulberry32 — dasselbe PRNG wie world-context, damit Seeds über das Projekt gleich wirken. */
export function mulberry32(seed) {
  let a = (seed >>> 0) || 1;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Werte EINER Instanz innerhalb der Set-Grenzen. Symmetrisch um 0, damit ein Set nicht
 * insgesamt in eine Richtung kippt — Verjüngung ist die Ausnahme, sie geht nur nach innen
 * (ein oben BREITERES Prop liest als Fehler, nicht als Cartoon).
 */
export function cartoonParams(seed, limits) {
  const L = Object.assign({}, DEFAULT_LIMITS, limits || {});
  const r = mulberry32(seed);
  const sym = () => r() * 2 - 1;
  return {
    bendX: sym() * L.bend, bendZ: sym() * L.bend,
    leanX: sym() * L.lean, leanZ: sym() * L.lean,
    taper: r() * L.taper,
    twist: sym() * L.twist * Math.PI / 180,
    phase: r() * Math.PI * 2,
  };
}

/**
 * WIE VIELE HÖHEN-SEGMENTE hat das Netz? Der ehrliche Haken aus §5: weich biegt nur, was
 * vertikal unterteilt ist. Eine grobe Kiste mit zwei Ringen SCHERT — dann ist Neigen +
 * Verjüngen der richtige Fallback. Zählt verschiedene y-Werte, auf 1/64 der Höhe gerundet.
 */
export function segmentsAlongY(geo) {
  const p = geo.getAttribute('position');
  if (!p) return 0;
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i); if (y < lo) lo = y; if (y > hi) hi = y; }
  const h = hi - lo;
  if (!(h > 1e-6)) return 1;
  const set = new Set();
  for (let i = 0; i < p.count; i++) set.add(Math.round(((p.getY(i) - lo) / h) * 64));
  return set.size;
}

const GLSL = /* glsl */`
uniform float uKcBendX, uKcBendZ, uKcLeanX, uKcLeanZ, uKcTaper, uKcTwist, uKcSquash;
uniform float uKcMinY, uKcH, uKcCx, uKcCz, uKcMix;
vec3 kfbCartoon(vec3 p) {
  float t = clamp((p.y - uKcMinY) / max(uKcH, 1e-5), 0.0, 1.0);
  vec2 c = vec2(uKcCx, uKcCz);
  vec3 q = p;
  vec2 r = q.xz - c;
  // Verjuengung: oben schmaler. Vor der Biegung, damit der Bogen die verjuengte
  // Silhouette mitnimmt und nicht umgekehrt.
  r *= (1.0 - uKcTaper * t);
  float a = uKcTwist * t;
  r = vec2(r.x * cos(a) - r.y * sin(a), r.x * sin(a) + r.y * cos(a));
  q.xz = c + r;
  // Squash & Stretch, volumenerhaltend: was in der Hoehe waechst, wird in der Breite
  // schmaler (1/sqrt). Ohne das wird jedes Prop beim Atmen zum Ballon.
  float sy = 1.0 + uKcSquash;
  q.y = uKcMinY + (q.y - uKcMinY) * sy;
  q.xz = c + (q.xz - c) / sqrt(max(sy, 1e-4));
  // Bogen (t², am Fuss verankert) + Neigung (linear). Beide in Bruchteilen der HOEHE,
  // damit klein und gross gleich stark krumm werden.
  q.x += (uKcBendX * t * t + uKcLeanX * t) * uKcH;
  q.z += (uKcBendZ * t * t + uKcLeanZ * t) * uKcH;
  return mix(p, q, uKcMix);
}
`;

/**
 * Hängt den Verbieger an alle Materialien unter `root`. Materialien werden GEKLONT: zwei
 * Instanzen desselben Props sollen verschieden krumm sein, ein geteiltes Material kann das
 * nicht. Für echtes Instanced-Scatter gehören die Werte statt in Uniforms in
 * Instanced-Attribute — dieselbe Mathematik, anderer Träger.
 */
export function applyCartoonDeform(THREE, root, opts = {}) {
  const limits = Object.assign({}, DEFAULT_LIMITS, opts.limits || {});
  let seed = opts.seed != null ? opts.seed : 1;
  let mode = opts.mode || 'auto';     // auto | full | tilt (nur neigen + verjuengen)
  const entries = [];

  // EIN BEZUGSRAHMEN FÜR DAS GANZE PROP. Ein Prop aus mehreren Meshes (Baum = Stamm + Krone,
  // Statue = Sockel + Schaft) bekam sonst pro Teil eine EIGENE Bounding-Box und damit eine eigene
  // Mitte und Höhe — jedes Teil bog sich um seine eigene Achse und das Prop fiel auseinander.
  // Deshalb werden hier alle Teilgeometrien in den Wurzelraum gebacken und direkt an die Wurzel
  // gehängt: danach teilen sie eine Box. Das ändert den Szenengraphen, nicht die Datei.
  root.updateMatrixWorld(true);
  const invRoot = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const meshes = [];
  root.traverse((n) => { if (n.isMesh && n.geometry) meshes.push(n); });
  meshes.forEach((n) => {
    const toRoot = new THREE.Matrix4().multiplyMatrices(invRoot, n.matrixWorld);
    n.geometry = n.geometry.clone();
    n.geometry.applyMatrix4(toRoot);
    n.position.set(0, 0, 0);
    n.quaternion.identity();
    n.scale.set(1, 1, 1);
    n.updateMatrix();
    if (n.parent !== root) root.add(n);
  });
  // Gemeinsame Box über alle Teile — das ist der Rahmen, in dem `t` gerechnet wird.
  const shared = new THREE.Box3();
  meshes.forEach((n) => { n.geometry.computeBoundingBox(); shared.union(n.geometry.boundingBox); });

  meshes.forEach((n) => {
    const bb = shared;
    const segs = segmentsAlongY(n.geometry);
    const mat = n.material = (Array.isArray(n.material) ? n.material[0] : n.material).clone();
    const U = {
      uKcBendX: { value: 0 }, uKcBendZ: { value: 0 },
      uKcLeanX: { value: 0 }, uKcLeanZ: { value: 0 },
      uKcTaper: { value: 0 }, uKcTwist: { value: 0 }, uKcSquash: { value: 0 },
      uKcMinY: { value: bb.min.y }, uKcH: { value: Math.max(1e-5, bb.max.y - bb.min.y) },
      uKcCx: { value: (bb.min.x + bb.max.x) / 2 }, uKcCz: { value: (bb.min.z + bb.max.z) / 2 },
      uKcMix: { value: 1 },
    };
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader
        .replace('void main() {', GLSL + '\nvoid main() {')
        .replace('#include <begin_vertex>', [
          '#include <begin_vertex>',
          'transformed = kfbCartoon(transformed);',
        ].join('\n'))
        // NORMALEN numerisch nachziehen: zwei Nachbarpunkte entlang der Tangenten mitverformen
        // und das Kreuzprodukt nehmen. Ohne das kippt die Beleuchtung auf der Biegung — im
        // stilisierten Look faellt es zwar kaum auf, an einem hellen Turm aber schon.
        .replace('#include <beginnormal_vertex>', [
          '#include <beginnormal_vertex>',
          '{',
          '  vec3 nn = normalize(objectNormal);',
          '  vec3 t1 = normalize(cross(nn, vec3(0.0, 1.0, 0.0001)));',
          '  vec3 t2 = cross(nn, t1);',
          '  float e = uKcH * 0.02;',
          '  vec3 p0 = kfbCartoon(position);',
          '  vec3 pa = kfbCartoon(position + t1 * e);',
          '  vec3 pb = kfbCartoon(position + t2 * e);',
          '  vec3 nd = cross(pa - p0, pb - p0);',
          '  if (length(nd) > 1e-9) objectNormal = normalize(nd) * sign(dot(normalize(nd), nn));',
          '}',
        ].join('\n'));
    };
    mat.needsUpdate = true;
    // Ein Prop mit weniger als vier Hoehen-Ringen kann nicht biegen, es schert nur. Gezaehlt wird
    // pro Teil, entschieden wird pro PROP: sonst biegt der Stamm und der Sockel bleibt stehen.
    entries.push({ mesh: n, U, segs, bendable: segs >= 4, height: U.uKcH.value });
  });

  // EINE FORM FÜR DAS GANZE PROP: alle Teile ziehen denselben Parametersatz und dieselbe
  // Biegbarkeits-Entscheidung. Pro Teil gezogen (wie zuvor) wäre jedes Teil anders krumm.
  const propBendable = entries.some((e) => e.bendable);
  const write = () => {
    const p0 = cartoonParams(seed, limits);
    entries.forEach((e) => {
      const p = e.params = p0;
      const tiltOnly = mode === 'tilt' || (mode === 'auto' && !propBendable);
      e.U.uKcBendX.value = tiltOnly ? 0 : p.bendX;
      e.U.uKcBendZ.value = tiltOnly ? 0 : p.bendZ;
      e.U.uKcLeanX.value = p.leanX;
      e.U.uKcLeanZ.value = p.leanZ;
      e.U.uKcTaper.value = p.taper;
      e.U.uKcTwist.value = tiltOnly ? 0 : p.twist;
    });
  };
  write();

  return {
    name: 'kfb-cartoon-deform',
    info: entries.map((e) => ({ segmentsY: e.segs, bendable: e.bendable, height: e.height })),
    get limits() { return Object.assign({}, limits); },
    setLimits(next) { Object.assign(limits, next || {}); write(); },
    setSeed(n) { seed = (n >>> 0) || 1; write(); },
    setMode(m) { mode = m || 'auto'; write(); },
    /** Nur nötig, wenn squash > 0. Phase pro Instanz aus dem Seed → das Set atmet ungleichzeitig. */
    update(time) {
      if (!(limits.squash > 0)) {
        entries.forEach((e) => { e.U.uKcSquash.value = 0; });
        return;
      }
      entries.forEach((e) => {
        const ph = (e.params && e.params.phase) || 0;
        e.U.uKcSquash.value = limits.squash * Math.sin(ph + time * limits.squashSpeed);
      });
    },
    /** Weicher Ein-/Ausblender für A/B am Regler: 0 = Originalform, 1 = verbogen. */
    setMix(v) { entries.forEach((e) => { e.U.uKcMix.value = v; }); },
    dispose() { entries.forEach((e) => e.mesh.material.dispose()); entries.length = 0; },
  };
}
