// ============================================================================
// kfb-deform-instanced.js — Cartoon-Verbieger für InstancedMesh · kdi-v1.0
// ----------------------------------------------------------------------------
// **Warum diese Datei existiert.** `kfb-cartoon-deform.js` (Projektwurzel) hat die Mathematik
// und drei Regeln, die den Look tragen — objekt-normiert, am Fuß verankert, ein Parametersatz
// je Set mit Seed je Instanz. Sie notiert aber selbst ihre Grenze:
//
//   *„Für echtes Instanced-Scatter gehören die Werte statt in Uniforms in Instanced-Attribute
//    — dieselbe Mathematik, anderer Träger."*
//
// Genau das ist hier gebaut. `terrain-v17/prop-scatter.js` hatte diesen Träger schon, aber
// verschraubt mit dem Voxel-Terrain (`voxel-terrain.js` liefert dort Bob-Bewegung und Palette).
// Diese Fassung ist **frei von Weltmodell**: sie kennt eine Bounding-Box, zwei Attribute und
// einen Regler. Damit können Globe (Kugel), Voxel-Terrain (Ebene), Card Zone Lab und Pet Studio
// dieselbe Verformung benutzen.
//
// ── Die drei Regeln, unverändert übernommen ─────────────────────────────────
// 1 **Objekt-normiert**, nie in Weltmetern: alles rechnet in `t = (y − minY) / höhe`. Ein Fass
//   und ein Turm biegen sich gleich stark RELATIV — das ganze Set spricht eine Sprache.
// 2 **Am Boden verankert:** Biegung mit t², Neigung mit t. Der Fuß steht, der Kopf ist krumm.
// 3 **Ein Parametersatz pro SET, Seed pro INSTANZ.** Alle unterschiedlich krumm, aber
//   reproduzierbar: gleicher Seed, gleiche Form, kein Flackern beim Neuladen.
//
// ── Und der ehrliche Haken, auch übernommen ─────────────────────────────────
// Weich biegt nur, was vertikal unterteilt ist. Unter vier Höhen-Ringen SCHERT ein Netz, statt
// zu biegen — dann ist Neigen + Verjüngen der richtige Fallback (`mode: 'tilt'`, in `'auto'`
// selbst erkannt). Gezählt wird pro Netz, entschieden pro PROP: sonst biegt der Stamm und der
// Sockel bleibt stehen.
//
// ⚠ **Die Box gehört dem PROP, nicht dem Teil.** Ein Baum aus Stamm + Krone bekäme sonst pro
// Teil eine eigene Mitte und Höhe, jedes Teil bög sich um seine eigene Achse, und das Prop
// fiele auseinander. Deshalb ist `bounds` ein PFLICHT-Argument: der Aufrufer übergibt die Box
// über alle Teile — in Koordinaten, in denen die Vertices auch liegen (also nach dem Backen der
// Teil-Transformationen in die Geometrie).
//
//   const h = attachInstancedDeform(THREE, instancedMesh, {
//     bounds, seed, count, limits: LIMITS.tree, mode: 'auto' });
//   h.update(timeSeconds);        // nur nötig, wenn squash > 0
//   h.setMix(0);                  // A/B: 0 = Originalform
// ============================================================================

export const KDI_VERSION = 'kdi-v1.0';

/** Grenzwerte je Modellart. Ein Baum verträgt Bogen, ein Turm nicht — „eine leichte Banane,
 *  kein Gummi" (Handover des Verbiegers). Keine Automatik: eine Tabelle, die man lesen kann. */
export const LIMITS = {
  tree:  { bend: 0.10, lean: 0.07, taper: 0.16, twist: 14, squash: 0.035 },
  bush:  { bend: 0.12, lean: 0.06, taper: 0.12, twist: 18, squash: 0.05 },
  small: { bend: 0.10, lean: 0.06, taper: 0.10, twist: 20, squash: 0.06 },
  rock:  { bend: 0.00, lean: 0.05, taper: 0.10, twist: 8,  squash: 0.0 },
  build: { bend: 0.02, lean: 0.025, taper: 0.05, twist: 3, squash: 0.0 },
};
export const DEFAULT_LIMITS = LIMITS.tree;

/** mulberry32 — dasselbe PRNG wie `kfb-cartoon-deform.js`, `prop-scatter.js` und world-context,
 *  damit ein Seed im ganzen Projekt dieselbe Form bedeutet. */
export function mulberry32(seed) {
  let a = (seed >>> 0) || 1;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Höhen-Ringe zählen — wörtlich `segmentsAlongY` aus dem Verbieger, auf 1/64 der Höhe gerundet. */
export function ringsAlongY(geo) {
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

// ⚠ Keine Backticks in diesem Block: er steht in einem Template-Literal, und ein Backtick in
// einem Kommentar beendet die Datei (dieselbe Naht hat schon einmal ein Panel-Modul getötet).
const DEFORM_GLSL = /* glsl */`
attribute vec4 aKc1;   // x=bendX y=bendZ z=leanX w=leanZ  (Bruchteile der HOEHE)
attribute vec4 aKc2;   // x=taper y=twist(rad) z=phase w=frei
uniform float uKcMinY, uKcH, uKcCx, uKcCz, uKcMix, uKcSquash, uKcTime, uKcSquashSpd;
vec3 kfbCartoonI(vec3 p) {
  float t = clamp((p.y - uKcMinY) / max(uKcH, 1e-5), 0.0, 1.0);
  vec2 c = vec2(uKcCx, uKcCz);
  vec3 q = p;
  vec2 r = q.xz - c;
  // Verjuengung VOR der Biegung, damit der Bogen die verjuengte Silhouette mitnimmt.
  r *= (1.0 - aKc2.x * t);
  float a = aKc2.y * t;
  r = vec2(r.x * cos(a) - r.y * sin(a), r.x * sin(a) + r.y * cos(a));
  q.xz = c + r;
  // Squash & Stretch, volumenerhaltend: was in der Hoehe waechst, wird schmaler (1/sqrt).
  // Phase je Instanz -> ein Wald atmet nicht im Chor.
  float sy = 1.0 + uKcSquash * sin(aKc2.z + uKcTime * uKcSquashSpd);
  q.y = uKcMinY + (q.y - uKcMinY) * sy;
  q.xz = c + (q.xz - c) / sqrt(max(sy, 1e-4));
  // Bogen (t^2, am Fuss verankert) + Neigung (linear), beide in Bruchteilen der HOEHE.
  q.x += (aKc1.x * t * t + aKc1.z * t) * uKcH;
  q.z += (aKc1.y * t * t + aKc1.w * t) * uKcH;
  return mix(p, q, uKcMix);
}
`;

/**
 * Hängt den Verbieger an ein InstancedMesh: schreibt zwei Instanz-Attribute und patcht das
 * Material (oder alle Materialien eines Arrays) per `onBeforeCompile`.
 *
 * @param mesh   THREE.InstancedMesh — seine Geometrie bekommt die Attribute
 * @param o.bounds  THREE.Box3 über ALLE Teile des Props, in Vertex-Koordinaten
 * @param o.count   Zahl der Instanzen (Standard: mesh.count)
 * @param o.seed    Basis-Seed; Instanz i zieht aus seed*2654435761 + i
 * @param o.limits  Grenzwerte (siehe LIMITS)
 * @param o.mode    'auto' | 'full' | 'tilt'
 * @param o.shared  optional: Attribute eines Geschwister-Teils weiterverwenden
 *                  (mehrere Teile EINES Props teilen Werte, sonst biegt jedes Teil anders)
 */
export function attachInstancedDeform(THREE, mesh, o = {}) {
  const geo = mesh.geometry;
  const count = o.count != null ? o.count : mesh.count;
  const L = Object.assign({}, DEFAULT_LIMITS, o.limits || {});
  const bb = o.bounds;
  if (!bb) throw new Error('attachInstancedDeform: bounds (Box3 über alle Teile) fehlt');

  const rings = ringsAlongY(geo);
  const tiltOnly = o.mode === 'tilt' || (o.mode !== 'full' && (o.ringsProp != null ? o.ringsProp : rings) < 4);

  // Attribute: entweder neu ziehen oder die des Geschwister-Teils übernehmen.
  let a1, a2;
  if (o.shared && o.shared.a1 && o.shared.a2) {
    a1 = o.shared.a1; a2 = o.shared.a2;
  } else {
    const f1 = new Float32Array(count * 4), f2 = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      const r = mulberry32((o.seed || 1) * 2654435761 + i * 40503);
      const sym = () => r() * 2 - 1;
      f1[i * 4 + 0] = tiltOnly ? 0 : sym() * L.bend;      // bendX
      f1[i * 4 + 1] = tiltOnly ? 0 : sym() * L.bend;      // bendZ
      f1[i * 4 + 2] = sym() * L.lean;                     // leanX
      f1[i * 4 + 3] = sym() * L.lean;                     // leanZ
      // Verjüngung geht NUR nach innen: ein oben breiteres Prop liest als Fehler, nicht als Cartoon.
      f2[i * 4 + 0] = r() * L.taper;
      f2[i * 4 + 1] = (tiltOnly ? 0 : sym() * L.twist) * Math.PI / 180;
      f2[i * 4 + 2] = r() * Math.PI * 2;                  // Phase des Atems
      f2[i * 4 + 3] = 0;
    }
    a1 = new THREE.InstancedBufferAttribute(f1, 4);
    a2 = new THREE.InstancedBufferAttribute(f2, 4);
  }
  geo.setAttribute('aKc1', a1);
  geo.setAttribute('aKc2', a2);

  const U = {
    uKcMinY: { value: bb.min.y },
    uKcH: { value: Math.max(1e-5, bb.max.y - bb.min.y) },
    uKcCx: { value: (bb.min.x + bb.max.x) / 2 },
    uKcCz: { value: (bb.min.z + bb.max.z) / 2 },
    uKcMix: { value: o.mix != null ? o.mix : 1 },
    uKcSquash: { value: L.squash != null ? L.squash : 0 },
    uKcTime: { value: 0 },
    uKcSquashSpd: { value: o.squashSpeed != null ? o.squashSpeed : 1.1 },
  };

  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  for (const mat of mats) {
    const vorher = mat.onBeforeCompile;
    mat.onBeforeCompile = (sh, renderer) => {
      if (vorher) { try { vorher(sh, renderer); } catch (e) {} }
      Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader
        .replace('void main() {', DEFORM_GLSL + '\nvoid main() {')
        .replace('#include <begin_vertex>', [
          '#include <begin_vertex>',
          'transformed = kfbCartoonI(transformed);',
        ].join('\n'))
        // NORMALEN numerisch nachziehen: zwei Nachbarpunkte entlang der Tangenten mitverformen
        // und das Kreuzprodukt nehmen. Ohne das kippt die Beleuchtung auf der Biegung.
        .replace('#include <beginnormal_vertex>', [
          '#include <beginnormal_vertex>',
          '{',
          '  vec3 nn = normalize(objectNormal);',
          '  vec3 t1 = normalize(cross(nn, vec3(0.0, 1.0, 0.0001)));',
          '  vec3 t2 = cross(nn, t1);',
          '  float e = uKcH * 0.02;',
          '  vec3 p0 = kfbCartoonI(position);',
          '  vec3 pa = kfbCartoonI(position + t1 * e);',
          '  vec3 pb = kfbCartoonI(position + t2 * e);',
          '  vec3 nd = cross(pa - p0, pb - p0);',
          '  if (length(nd) > 1e-9) objectNormal = normalize(nd) * sign(dot(normalize(nd), nn));',
          '}',
        ].join('\n'));
    };
    mat.needsUpdate = true;
  }

  return {
    name: 'kfb-deform-instanced', version: KDI_VERSION,
    attrs: { a1, a2 },
    info: { rings, tiltOnly, height: U.uKcH.value, instanzen: count },
    get limits() { return Object.assign({}, L); },
    /** Nur nötig, wenn squash > 0 — eine Uhr für alle Instanzen, Phase steckt im Attribut. */
    update(time) { U.uKcTime.value = time; },
    setSquash(v) { U.uKcSquash.value = Math.max(0, v); },
    get squash() { return U.uKcSquash.value; },
    /** A/B am Regler: 0 = Originalform, 1 = verbogen. */
    setMix(v) { U.uKcMix.value = Math.max(0, Math.min(1, v)); },
    get mix() { return U.uKcMix.value; },
  };
}
