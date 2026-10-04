/**
 * lab-v7/cardeform.v1.js · Cartoon-Verbieger für FAHRZEUGE.
 *
 * VORBILD, gelesen vor der ersten Zeile: `kfb-cartoon-deform.js` aus dem Travel-Globe-WS0
 * (Bogen/Neigung/Verjüngung/Verdrehung im Vertex-Shader, `onBeforeCompile`, Material geklont,
 * Normalen numerisch nachgezogen, Mix-Regler für A/B). Diese Technik ist von dort WÖRTLICH
 * übernommen und wird nicht neu erfunden.
 *
 * WAS ANDERS IST, und warum es eine eigene Datei rechtfertigt:
 *
 *   1 ANKER. Der Prop-Verbieger verankert am FUSS des Objekts und rechnet `t` über die Höhe: ein
 *     gerader Turm wird oben krumm. Ein Fahrzeug hat keinen Fuß, es hat einen RADAUFSTANDSPUNKT.
 *     Hier ist y = 0 der Boden (das Rig liefert ihn gemessen) und die Karosserie staucht gegen ihn.
 *   2 ZWEITE ACHSE. Bei einem Prop ist nur die Höhe interessant. Bei einem Fahrzeug ist die
 *     LÄNGSACHSE die Hauptachse: `s = (z − mitte) / (länge/2)` ∈ [−1,1]. Banane, Verwringung und
 *     Nickneigung rechnen über s, nicht über t.
 *   3 KEINE ZUFALLSWERTE. Ein Prop-Set zieht seine Form aus einem Seed, damit alle Fässer anders
 *     krumm sind. Ein Fahrzeug wird nicht zufällig krumm, es wird krumm WEIL etwas passiert ist
 *     (Skill §1.1). Die Pose kommt aus Telemetrie oder aus einer Fixture, nie aus mulberry32.
 *
 * ARBEITSTEILUNG, die der Skill verlangt (§8.3): starre Lage (Nicken, Rollen, Gieren, Höhe) gehört
 * der GRUPPE und damit der Physik; weiche Form (Squash, Stretch, Banane, Verwringung) gehört dem
 * Shader. Ein Sicht-Offset überschreibt nie eine Physik-Position.
 *
 * Vertrag:
 *   const d = applyCarDeform(THREE, rig.group, { frame: rig.frame, limits });
 *   d.setPose({ squash, stretch, bend, twist });   // −1…1, Anteile der Grenzen
 *   d.setLimits({ squash: .18, … });               // Grenzen in Objektmaßen
 *   d.setMix(0);                                   // 0 = Originalform (A/B am Regler)
 *   d.info / d.pose / d.dispose()
 */
export const SCHEMA = 'kfb.cardeform/1';

/* Konservative Startwerte. Am Regler konvergieren, nicht raten — dieselbe Regel wie beim
   Prop-Verbieger. Alle Werte sind Anteile der gemessenen Fahrzeugmaße, nie Weltmeter. */
export const DEFAULT_LIMITS = Object.freeze({
  squash: 0.22,   // × Höhe: Landung drückt die Karosserie zusammen
  stretch: 0.16,  // × Länge: Beschleunigung zieht sie lang
  bend: 0.10,     // × Länge: Banane quer zur Fahrt (Kurve)
  twist: 10,      // Grad Verwringung Front gegen Heck (Drift)
});

export const META = [
  ['squash', 'Squash', -1, 1, 0.01, 'Landung: Karosserie staucht gegen den Aufstandspunkt'],
  ['stretch', 'Stretch', -1, 1, 0.01, 'Beschleunigung: Karosserie zieht sich in Fahrtrichtung lang'],
  ['bend', 'Banane', -1, 1, 0.01, 'Kurve: Front und Heck biegen zur Kurveninnenseite'],
  ['twist', 'Verwringung', -1, 1, 0.01, 'Drift: Front gegen Heck um die Hochachse verdreht'],
];

const GLSL = /* glsl */`
uniform float uCdSquash, uCdStretch, uCdBend, uCdTwist, uCdMix;
uniform float uCdY0, uCdH, uCdCx, uCdCz, uCdHalfL;
vec3 kfbCarDeform(vec3 p) {
  float t = clamp((p.y - uCdY0) / max(uCdH, 1e-5), 0.0, 1.0);
  float s = clamp((p.z - uCdCz) / max(uCdHalfL, 1e-5), -1.0, 1.0);
  vec3 q = p;
  // SQUASH gegen den Aufstandspunkt, volumenerhaltend: was in der Hoehe verschwindet, kommt in
  // der Breite dazu (1/sqrt). Ohne das wird das Auto beim Landen zum Brett statt zum Gummi.
  float sy = 1.0 - uCdSquash;
  q.y = uCdY0 + (q.y - uCdY0) * sy;
  float k = 1.0 / sqrt(max(sy, 1e-4));
  q.x = uCdCx + (q.x - uCdCx) * k;
  q.z = uCdCz + (q.z - uCdCz) * k;
  // STRETCH laengs: die Hoehe gibt anteilig nach, damit Volumen plausibel bleibt.
  float sz = 1.0 + uCdStretch;
  q.z = uCdCz + (q.z - uCdCz) * sz;
  q.y = uCdY0 + (q.y - uCdY0) / max(sqrt(sz), 1e-4);
  // BANANE: Querversatz ueber s². Der Abzug von 1/3 ist der Mittelwert von s² ueber [-1,1] —
  // ohne ihn wuerde die ganze Karosserie seitlich WANDERN statt sich zu biegen.
  q.x += uCdBend * (s * s - 0.3333) * uCdHalfL;
  // VERWRINGUNG: Gierdrehung proportional zu s, Front und Heck gegenlaeufig. Hoehere Punkte
  // tragen etwas mehr (0.6 + 0.4·t), sonst scheuert das Dach nicht mit.
  float a = uCdTwist * s * (0.6 + 0.4 * t);
  vec2 r = vec2(q.x - uCdCx, q.z - uCdCz);
  r = vec2(r.x * cos(a) - r.y * sin(a), r.x * sin(a) + r.y * cos(a));
  q.x = uCdCx + r.x; q.z = uCdCz + r.y;
  return mix(p, q, uCdMix);
}
`;

export function applyCarDeform(THREE, root, opts = {}) {
  const limits = Object.assign({}, DEFAULT_LIMITS, opts.limits || {});
  const frame = Object.assign({ contactY: 0, height: 1, length: 1, width: 1 }, opts.frame || {});
  const pose = { squash: 0, stretch: 0, bend: 0, twist: 0 };
  const entries = [];

  root.updateMatrixWorld(true);
  /* EIN Bezugsrahmen für das ganze Fahrzeug. Pro Netz eigene Box wäre der Fehler, den der
     Prop-Verbieger schon einmal bezahlt hat: jedes Teil bog um seine eigene Mitte und das
     Fahrzeug fiel auseinander. Hier kommt der Rahmen aus dem Rig, ist also gemessen. */
  const y0 = 0, H = Math.max(1e-4, frame.height), halfL = Math.max(1e-4, frame.length / 2);

  root.traverse((n) => {
    if (!n.isMesh || !n.geometry) return;
    const mat = n.material = (Array.isArray(n.material) ? n.material[0] : n.material).clone();
    const U = {
      uCdSquash: { value: 0 }, uCdStretch: { value: 0 }, uCdBend: { value: 0 }, uCdTwist: { value: 0 },
      uCdMix: { value: 1 }, uCdY0: { value: y0 }, uCdH: { value: H },
      uCdCx: { value: 0 }, uCdCz: { value: 0 }, uCdHalfL: { value: halfL },
    };
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader
        .replace('void main() {', GLSL + '\nvoid main() {')
        .replace('#include <begin_vertex>', ['#include <begin_vertex>', 'transformed = kfbCarDeform(transformed);'].join('\n'))
        /* Normalen numerisch nachziehen — wörtlich die Methode aus kfb-cartoon-deform: zwei
           Nachbarpunkte entlang der Tangenten mitverformen, Kreuzprodukt nehmen. Ohne das kippt
           die Beleuchtung auf der gestauchten Fläche. */
        .replace('#include <beginnormal_vertex>', ['#include <beginnormal_vertex>', '{',
          '  vec3 nn = normalize(objectNormal);',
          '  vec3 t1 = normalize(cross(nn, vec3(0.0, 1.0, 0.0001)));',
          '  vec3 t2 = cross(nn, t1);',
          '  float e = uCdH * 0.02;',
          '  vec3 p0 = kfbCarDeform(position);',
          '  vec3 pa = kfbCarDeform(position + t1 * e);',
          '  vec3 pb = kfbCarDeform(position + t2 * e);',
          '  vec3 nd = cross(pa - p0, pb - p0);',
          '  if (length(nd) > 1e-9) objectNormal = normalize(nd) * sign(dot(normalize(nd), nn));',
          '}'].join('\n'));
    };
    mat.needsUpdate = true;
    entries.push({ mesh: n, U });
  });

  const write = () => {
    entries.forEach((e) => {
      e.U.uCdSquash.value = pose.squash * limits.squash;
      e.U.uCdStretch.value = pose.stretch * limits.stretch;
      e.U.uCdBend.value = pose.bend * limits.bend;
      e.U.uCdTwist.value = pose.twist * limits.twist * Math.PI / 180;
    });
  };
  write();

  return {
    name: 'kfb-cardeform', schema: SCHEMA,
    info: { meshes: entries.length, frame: { y0, height: +H.toFixed(4), halfLength: +halfL.toFixed(4) } },
    get pose() { return Object.assign({}, pose); },
    get limits() { return Object.assign({}, limits); },
    setPose(next) { Object.assign(pose, next || {}); write(); return this; },
    setLimits(next) { Object.assign(limits, next || {}); write(); return this; },
    setMix(v) { entries.forEach((e) => { e.U.uCdMix.value = v; }); },
    /** Ruhezustand (Skill §2.1: keine Bewegung ohne definierte Rückkehr). */
    rest() { Object.assign(pose, { squash: 0, stretch: 0, bend: 0, twist: 0 }); write(); },
    dispose() { entries.forEach((e) => e.mesh.material.dispose()); entries.length = 0; },
  };
}
