// ============================================================================
// pet-traegheit.js — v13 · Cartoon-Verformung, die der Flugphysik TRÄGE folgt
// ----------------------------------------------------------------------------
// Georg, 3.9.: *„das pet kippt nur bei banking, beschleunigung etc → es gibt scheinbar noch kein
// cartoon-deforming, das träge der flug-physik folgt (vgl. KFB rollercoaster v11) → evtl. ist das
// aber etwas, was das pet/vehikel-modul mitbringt?"*
//
// **Die Antwort auf die Architekturfrage steht in `kfb-cartoon-deform.js` selbst, und Georgs
// Instinkt ist richtig:** Grenzen und Modus gehören zum KÖRPER (ein Mech darf nicht wie ein
// Gummi-Pet schwabbeln), der ANTRIEB gehört zur Flugsimulation und ist geteilt. Ein Antrieb, vier
// Grenzensätze. Deshalb steht hier der Antrieb, und `limits` kommt von außen — beim Einbau der
// vier Mech-Modelle liefert das Fahrzeugmodul seinen eigenen Satz, nicht dieses Modul.
//
// ── Warum das nicht einfach `applyCartoonDeform` auf das Pet ist ───────────────────────────────
// **Weil `applyCartoonDeform` das Pet zerstören würde, und zwar unsichtbar.** Es backt jede
// Teilgeometrie in den Wurzelraum und hängt sie DIREKT an die Wurzel — nötig, damit ein Baum aus
// Stamm und Krone sich um eine gemeinsame Achse biegt. Ein Prop überlebt das, ein PET nicht: Ohren,
// Schwanz und Augen sind eigene Knoten, die `pet.motion` und das Augen-Rig pro Bild bewegen. Nach
// dem Umhängen zeigt der Rig auf Knoten, deren Transformation eingebacken und zurückgesetzt ist —
// das Pet stünde still und niemand bekäme einen Fehler.
// *Ein Verbieger für Requisiten und einer für Figuren sind nicht dasselbe Werkzeug: Requisiten
// haben keine Hierarchie, die etwas bedeutet.*
//
// Also dieselbe Mathematik, aber im WURZELRAUM statt nach dem Umhängen: jedes Mesh bekommt seine
// `toRoot`/`fromRoot` als Uniform, verformt wird zwischen den beiden. Die Hierarchie bleibt
// unangetastet, und weil die Matrizen pro Bild nachgezogen werden, gilt das auch für bewegte
// Ohren — ein wedelndes Ohr wird im selben Rahmen mitgebogen wie der Körper.
//
// ── Der Antrieb: was „träge folgen" konkret heißt ─────────────────────────────────────────────
// Nicht „ein Wackeln addieren". Die Verformung liest die **Differenz zwischen dem, was das
// Fahrzeug tut, und dem, was der Körper schon mitbekommen hat**:
//
//     folge += (soll − folge) · min(1, rate·dt)      // der Körper holt auf
//     rueckstand = soll − folge                      // was er noch nicht mitbekommen hat
//
// Der Rückstand IST die Verformung. Bei konstanter Fahrt ist er null, also ist das Pet in Ruhe
// unverformt — das ist der Unterschied zu einem Effekt, der immer läuft. Beim Einlenken hängt der
// Körper nach außen, beim Beschleunigen nach hinten, beim Abfangen staucht er. Und weil alles aus
// EINER Größe kommt (dem Rückstand), kann keine Achse gegen die andere laufen.
//
// **Vorzeichen, hergeleitet und nicht geraten** (die Lehre des Tages: ein Vorzeichen aus einem
// anderen Bezugsrahmen ist eine Behauptung): im Kartenrahmen ist +X rechts, +Z hinten, +Y oben —
// dieselbe Karte, an der die Speedlines hängen (`carrier.halfW/halfD`). Lenkt das Fahrzeug nach
// links (`turn > 0`, wie `flight-controls.js` es zählt), bleibt der Körper rechts zurück, also
// `bendX = +rueckstandTurn`. Beschleunigt es, bleibt der Körper hinten, also `bendZ = +rueckstandV`.
//
// ── Der ehrliche Haken, den die Quelle selbst nennt ──────────────────────────────────────────
// `kfb-cartoon-deform.js` §5: **weich biegt nur, was vertikal unterteilt ist.** Die Cube-Pets von
// Kenney sind grobe Kisten; unter vier Höhenringen SCHERT ein Netz statt zu biegen, und der
// Fallback ist Neigen plus Verjüngen (`mode: 'tilt'`). Das wird hier GEZÄHLT (`segmentsAlongY`)
// und im Tor genannt, nicht angenommen — sonst verspricht man Weichheit und liefert Schräglage.
// ============================================================================

import { segmentsAlongY } from '../kfb-cartoon-deform.js';

/** Grenzen des KÖRPERS. Bewusst klein: das ist ein mitfliegendes Tier, kein Gummiball.
 *  Beim Einbau der Mech-Modelle liefert das Fahrzeugmodul seinen eigenen Satz. */
export const PET_GRENZEN = Object.freeze({
  bendTurn: 0.34,    // Anteil der Körperhöhe je Einheit Rückstand im Kurs
  bendSpeed: 0.30,   // dito längs
  taper: 0.0,        // die Verjüngung der Requisiten will man an einer Figur nicht
  squash: 0.16,      // Stauchen beim Abfangen, volumenerhaltend
  rate: 5.5,         // wie schnell der Körper aufholt (1/s) — klein = träger
  squashRate: 7.0,
});

const GLSL = /* glsl */`
uniform float uPtBendX, uPtBendZ, uPtSquash, uPtTaper, uPtMix;
uniform float uPtMinY, uPtH, uPtCx, uPtCz;
uniform mat4 uPtToRoot, uPtFromRoot;
vec3 kfbPetTraeg(vec3 p) {
  // In den Wurzelraum, verformen, zurück — statt die Hierarchie einzubacken (siehe Modulkopf).
  vec3 r3 = (uPtToRoot * vec4(p, 1.0)).xyz;
  float t = clamp((r3.y - uPtMinY) / max(uPtH, 1e-5), 0.0, 1.0);
  vec2 c = vec2(uPtCx, uPtCz);
  vec3 q = r3;
  vec2 rr = q.xz - c;
  rr *= (1.0 - uPtTaper * t);
  q.xz = c + rr;
  // Squash & Stretch volumenerhaltend: was in der Höhe wächst, wird in der Breite schmaler.
  float sy = 1.0 + uPtSquash;
  q.y = uPtMinY + (q.y - uPtMinY) * sy;
  q.xz = c + (q.xz - c) / sqrt(max(sy, 1e-4));
  // Bogen (t², am Fuß verankert): unten sitzt der Körper auf der Karte, oben hängt er nach.
  q.x += uPtBendX * t * t * uPtH;
  q.z += uPtBendZ * t * t * uPtH;
  return (uPtFromRoot * vec4(mix(r3, q, uPtMix), 1.0)).xyz;
}
`;

export function createPetTraegheit(THREE, opts = {}) {
  const P = Object.assign({}, PET_GRENZEN, opts.limits || {});
  let an = opts.on !== false, mix = 1;
  let eintraege = [], wurzel = null, box = null, biegbar = false, modus = 'auto';
  // Der Zustand des ANTRIEBS: was der Körper schon mitbekommen hat.
  let folgeTurn = 0, folgeV = 0, folgeSteig = 0;
  let ruecksTurn = 0, ruecksV = 0, squash = 0;
  const _inv = new THREE.Matrix4(), _toRoot = new THREE.Matrix4(), _fromRoot = new THREE.Matrix4();

  /** Hängt den Verbieger an ein Pet, OHNE die Hierarchie anzufassen. */
  function attach(root) {
    detach();
    if (!root) return false;
    wurzel = root;
    root.updateMatrixWorld(true);
    _inv.copy(root.matrixWorld).invert();
    // EIN Bezugsrahmen für die ganze Figur, im Wurzelraum gemessen: sonst biegt sich jedes Teil
    // um seine eigene Mitte und die Figur fällt auseinander (die Lehre aus `kfb-cartoon-deform`).
    box = new THREE.Box3();
    const meshes = [];
    root.traverse((n) => { if (n.isMesh && n.geometry) meshes.push(n); });
    const hilfsBox = new THREE.Box3(), _m = new THREE.Matrix4();
    meshes.forEach((n) => {
      n.geometry.computeBoundingBox();
      _m.multiplyMatrices(_inv, n.matrixWorld);
      hilfsBox.copy(n.geometry.boundingBox).applyMatrix4(_m);
      box.union(hilfsBox);
    });
    if (!(box.max.y - box.min.y > 1e-6)) { wurzel = null; return false; }
    const minY = box.min.y, h = box.max.y - box.min.y;
    const cx = (box.min.x + box.max.x) / 2, cz = (box.min.z + box.max.z) / 2;

    meshes.forEach((n) => {
      const segs = segmentsAlongY(n.geometry);
      const mats = Array.isArray(n.material) ? n.material : [n.material];
      // ⚠ Materialien NICHT klonen. Der Pet-Look kommt aus `pet-surface`/`reskin` über geteilte
      // Uniforms — ein Klon hier hätte die Figur aus der Färbung genommen, und das wäre erst
      // beim nächsten Tageszeitwechsel aufgefallen. (Requisiten klonen, weil zwei Bäume
      // verschieden krumm sein sollen; eine Figur ist genau eine.)
      mats.forEach((mat) => {
        if (!mat || mat.userData.__ptAngehaengt) return;
        const U = {
          uPtBendX: { value: 0 }, uPtBendZ: { value: 0 }, uPtSquash: { value: 0 },
          uPtTaper: { value: P.taper }, uPtMix: { value: mix },
          uPtMinY: { value: minY }, uPtH: { value: h }, uPtCx: { value: cx }, uPtCz: { value: cz },
          uPtToRoot: { value: new THREE.Matrix4() }, uPtFromRoot: { value: new THREE.Matrix4() },
        };
        const vorher = mat.onBeforeCompile;
        mat.onBeforeCompile = (sh, rend) => {
          if (typeof vorher === 'function') vorher(sh, rend);   // Färbung nicht verdrängen
          Object.assign(sh.uniforms, U);
          sh.vertexShader = sh.vertexShader
            .replace('void main() {', GLSL + '\nvoid main() {')
            .replace('#include <begin_vertex>',
                     '#include <begin_vertex>\n\ttransformed = kfbPetTraeg(transformed);')
            // Normalen numerisch nachziehen, sonst kippt die Beleuchtung auf der Biegung.
            .replace('#include <beginnormal_vertex>', [
              '#include <beginnormal_vertex>',
              '{',
              '  vec3 nn = normalize(objectNormal);',
              '  vec3 t1 = normalize(cross(nn, vec3(0.0, 1.0, 0.0001)));',
              '  vec3 t2 = cross(nn, t1);',
              '  float e = uPtH * 0.02;',
              '  vec3 p0 = kfbPetTraeg(position);',
              '  vec3 pa = kfbPetTraeg(position + t1 * e);',
              '  vec3 pb = kfbPetTraeg(position + t2 * e);',
              '  vec3 nd = cross(pa - p0, pb - p0);',
              '  if (length(nd) > 1e-9) objectNormal = normalize(nd) * sign(dot(normalize(nd), nn));',
              '}',
            ].join('\n'));
        };
        mat.userData.__ptAngehaengt = true;
        mat.needsUpdate = true;
        eintraege.push({ mesh: n, mat, U, segs });
      });
    });
    biegbar = eintraege.some((e) => e.segs >= 4);
    return eintraege.length > 0;
  }

  function detach() {
    eintraege.forEach((e) => { if (e.mat) { e.mat.userData.__ptAngehaengt = false; } });
    eintraege = []; wurzel = null; box = null; biegbar = false;
    folgeTurn = folgeV = folgeSteig = ruecksTurn = ruecksV = squash = 0;
  }

  /** Der Antrieb. `turn` ist die Kursrate, `v01` die Fahrt (0..1), `steig` die Vertikalrate. */
  function update(dt, turn, v01, steig) {
    if (!eintraege.length || !(dt > 0)) return;
    const k = Math.min(1, P.rate * dt), ks = Math.min(1, P.squashRate * dt);
    folgeTurn += ((turn || 0) - folgeTurn) * k;
    folgeV += ((v01 || 0) - folgeV) * k;
    folgeSteig += ((steig || 0) - folgeSteig) * ks;
    // Der Rückstand IST die Verformung — bei konstanter Fahrt null, also Ruhe ohne Zappeln.
    ruecksTurn = (turn || 0) - folgeTurn;
    ruecksV = (v01 || 0) - folgeV;
    squash = -((steig || 0) - folgeSteig);   // Abfangen (steig fällt) staucht, Steigen streckt
    // Neigen statt Biegen, wenn das Netz zu grob ist (Fallback der Quelle, §5).
    const nurNeigen = modus === 'tilt' || (modus === 'auto' && !biegbar);
    const bx = ruecksTurn * P.bendTurn * (nurNeigen ? 0.55 : 1);
    const bz = ruecksV * P.bendSpeed * (nurNeigen ? 0.55 : 1);
    const sq = Math.max(-0.5, Math.min(0.5, squash * P.squash));
    const w = an ? 1 : 0;
    eintraege.forEach((e) => {
      e.U.uPtBendX.value = bx * w;
      e.U.uPtBendZ.value = bz * w;
      e.U.uPtSquash.value = sq * w;
      e.U.uPtTaper.value = P.taper;
      e.U.uPtMix.value = mix;
      // Die Matrizen pro Bild: ein wedelndes Ohr wird im selben Rahmen mitgebogen wie der Körper.
      if (wurzel) {
        _inv.copy(wurzel.matrixWorld).invert();
        _toRoot.multiplyMatrices(_inv, e.mesh.matrixWorld);
        e.U.uPtToRoot.value.copy(_toRoot);
        e.U.uPtFromRoot.value.copy(_fromRoot.copy(_toRoot).invert());
      }
    });
  }

  return {
    name: 'pet-traegheit', attach, detach, update,
    get limits() { return P; },
    setLimits(next) { Object.assign(P, next || {}); },
    setOn(v) { an = !!v; },
    get on() { return an; },
    setMix(v) { mix = Math.max(0, Math.min(1, v)); },
    get mixWert() { return mix; },
    setModus(m) { modus = m || 'auto'; },
    get modus() { return modus; },
    /** **Das Tor nennt die Segmentzahl, nicht die Absicht.** Nach dem 3.9.: ein Tor, das eine
     *  Absicht prüft, übersieht eine Zuweisung, die im Kommentar gelandet ist. */
    tor() {
      if (!eintraege.length) return { ok: false, text: '✗ not attached — no pet materials hooked' };
      const segs = eintraege.map((e) => e.segs);
      const nurNeigen = modus === 'tilt' || (modus === 'auto' && !biegbar);
      const bewegt = Math.abs(ruecksTurn) > 1e-4 || Math.abs(ruecksV) > 1e-4;
      return {
        ok: true,
        text: '✓ ' + eintraege.length + ' materials · height segments '
          + Math.min.apply(null, segs) + '–' + Math.max.apply(null, segs)
          + ' → ' + (nurNeigen ? 'LEAN + taper (mesh too coarse to bend smoothly — the source’s own fallback)'
                               : 'full bend') + ' · lag turn ' + ruecksTurn.toFixed(3)
          + ' / speed ' + ruecksV.toFixed(3) + ' / squash ' + squash.toFixed(3)
          + (bewegt ? ' · deforming' : ' · at rest (lag 0 = no deformation, by design)'),
        segmente: segs, biegbar, nurNeigen,
      };
    },
  };
}
