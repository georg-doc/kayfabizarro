/**
 * lab-v8/cartoon-deform-segmented.v1.js · Die WEICHE Schicht.
 *
 * ═══ WAS HIER NEU IST UND WARUM ES NICHT ANDERS GEHT ════════════════════════════════════════
 * `lab-v7/vehicle-cartoon-deformer.v2.js` skaliert EINE starre Shell-Gruppe. Das ist der Grund,
 * warum es dort bei rund 3 % aufhoert: eine nicht-uniforme Skalierung ueber die ganze Karosserie
 * liest jenseits davon als Skalierungsfehler, nicht als Gummi. Die Bananen-Biegung aus
 * `cardeform.v1.js` ist genau daran gestorben — Gruppen koennen sie nicht.
 *
 * Diese Schicht verformt SEGMENTWEISE entlang der gemessenen Laengsachse, im Vertex-Shader, nach
 * derselben Mathematik wie der Spender `travel/kfb-cartoon-deform.js` (gelesen 19.09.). Damit
 * sind 15 % moeglich, wo Gruppen bei 3 % aufhoeren.
 *
 * ═══ DIE DREI REGELN DES SPENDERS, UEBERNOMMEN ══════════════════════════════════════════════
 * 1 OBJEKT-NORMIERT, nie in Weltmetern. Alles rechnet in Anteilen der gemessenen Laenge und
 *   Hoehe. Ein Kart und ein Tourbus biegen sich damit gleich stark RELATIV.
 * 2 VERANKERT. Der Spender verankert am Boden (t², Fuss steht). Ein Fahrzeug hat keinen Fuss,
 *   es hat eine MITTE: die Biegung benutzt darum die mittelwertfreie Basis (s² − 1/3) mit
 *   s = 2t−1. Ohne den Abzug von 1/3 waere jede Biegung zugleich ein Versatz — das Fahrzeug
 *   wuerde in der Kurve seitlich wegrutschen, ohne dass sich etwas bewegt hat.
 * 3 EIN PARAMETERSATZ PRO FAHRZEUG. Alle Teilnetze teilen EINEN Rahmen und EINEN Satz Uniforms.
 *   Pro Teil gerechnet faellt das Fahrzeug auseinander (Befund des Spenders, §Kommentar dort).
 *
 * ═══ WAS DER SPENDER NICHT KONNTE UND HIER DAZUKOMMT ════════════════════════════════════════
 * - **Schattenwurf verformt mit.** Der Spender haengt nur am Sichtmaterial; der Schatten kommt
 *   aber aus einem eigenen Tiefenmaterial, das `onBeforeCompile` des Sichtmaterials nie sieht.
 *   Ergebnis waere ein krummes Auto mit geradem Schatten. Hier bekommt jedes Netz ein
 *   `customDepthMaterial` mit DEMSELBEN Vertex-Code.
 * - **Nachlauf je Segment.** Acht Baender entlang der Laengsachse, jedes mit eigenem Spring auf
 *   der CPU, als Uniform-Feld hochgeladen. Daraus entsteht »Heck kommt spaeter als Bug« von
 *   selbst — nicht aus einer zweiten Kurve.
 * - **Anbauteile gehen gedaempft mit.** Raeder bekommen denselben Code mit kleinerem `uKcMix`.
 *   (v2 laesst sie planiert; beides ist richtig, es ist eine Regieentscheidung.)
 * - **Hitstop.** Ein kurzer Halt im Moment des Einschlags (Skill §11.4: 40–95 ms).
 *
 * ═══ WAS NICHT GEHT, UND WARUM DAS KEINE LUECKE IST ═════════════════════════════════════════
 * ANTICIPATION setzt Wissen ueber die Zukunft voraus. Fuer GEPLANTE Ereignisse (eine Sequenz
 * kennt ihren Zeitplan) wird sie vorgefeuert; fuer REAKTIVE (ein Einschlag, der gerade passiert)
 * kann sie es nicht — das ist Physik, keine fehlende Zeile. `anticipate()` ist darum ein eigener
 * Aufruf mit Vorlauf, kein Automatismus.
 */
export const SCHEMA = 'kfb.cartoon-deform-segmented/1';
export const LIFTED_FROM = 'KFB-Travel-Globe travel/kfb-cartoon-deform.js (Bogen-Basis, Volumenerhalt, numerische Normalen)';

import { Spring } from './spring.v1.js';

const BANDS = 8;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const finite = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);

/**
 * Wie fein ist das Netz entlang einer Achse unterteilt? Der ehrliche Haken des Spenders:
 * weich biegt nur, was unterteilt ist. Zusaetzlich gemessen wird die groesste Dreiecks-Spanne —
 * ein einzelnes Dreieck ueber die halbe Laenge SCHERT, egal wie viele Ringe daneben liegen.
 */
export function segmentsAlongZ(geo, lo, hi) {
  const p = geo.getAttribute('position');
  if (!p) return { rings: 0, maxTriSpan: 0 };
  const L = hi - lo;
  if (!(L > 1e-9)) return { rings: 1, maxTriSpan: 1 };
  const set = new Set();
  for (let i = 0; i < p.count; i++) set.add(Math.round(((p.getZ(i) - lo) / L) * 64));
  let maxSpan = 0;
  const idx = geo.index ? geo.index.array : null;
  const n = idx ? idx.length : p.count;
  for (let i = 0; i + 2 < n; i += 3) {
    const a = idx ? idx[i] : i, b = idx ? idx[i + 1] : i + 1, c = idx ? idx[i + 2] : i + 2;
    const z0 = p.getZ(a), z1 = p.getZ(b), z2 = p.getZ(c);
    const sp = (Math.max(z0, z1, z2) - Math.min(z0, z1, z2)) / L;
    if (sp > maxSpan) maxSpan = sp;
  }
  return { rings: set.size, maxTriSpan: +maxSpan.toFixed(3) };
}

/**
 * MASSE AUS DER GEOMETRIE. Ein Vorschlag, kein Urteil — im Profil ueberschreibbar.
 * Drei gemessene Anteile, gleich gewichtet:
 *   Groesse   grosse Fahrzeuge lesen traeger (Laenge gegen den Median der Flotte, 3 u)
 *   Gedrungenheit  hoch und kurz liest schwer, lang und flach liest leicht
 *   Radlast   viel Radradius je Fahrzeughoehe liest nach Nutzfahrzeug
 */
export function massFromGeometry(rig) {
  const f = rig.frame, r = rig.report;
  const size = clamp(Math.log10(Math.max(0.02, f.length) / 0.6) / 1.6, 0, 1);
  const stout = clamp(f.height / Math.max(1e-6, f.length) / 0.65, 0, 1);
  const wheel = clamp((r.wheelRadius || 0) / Math.max(1e-6, f.height) / 0.35, 0, 1);
  const m = (size + stout + wheel) / 3;
  return { massFeel: +m.toFixed(3), parts: { size: +size.toFixed(3), stout: +stout.toFixed(3), wheel: +wheel.toFixed(3) },
    source: 'gemessen · Laenge, Hoehe/Laenge, Radradius/Hoehe' };
}

const GLSL = /* glsl */`
uniform float uKcMix, uKcMinZ, uKcLenZ, uKcH, uKcCx, uKcCz;
uniform float uKcBend, uKcLean, uKcTwist, uKcSquash, uKcStretch, uKcSide;
uniform float uKcLag[8];
vec3 kfbVehDeform(vec3 p) {
  float t = clamp((p.z - uKcMinZ) / max(uKcLenZ, 1e-6), 0.0, 1.0);
  float s = t * 2.0 - 1.0;
  vec3 q = p;

  // 1 · Squash und Stretch. Die Hoehe ist am AUFSTANDSPUNKT verankert (y = 0, vom Rig dorthin
  //     gelegt) — deshalb braucht es keinen Ausgleichsversatz. Volumenerhaltend: was die Hoehe
  //     verliert, teilen Breite und Laenge sich ueber 1/sqrt. Ohne das wird jedes Fahrzeug beim
  //     Stauchen zum Ballon (Spenderregel).
  float sy = 1.0 - uKcSquash;
  float sz = 1.0 + uKcStretch;
  float comp = inversesqrt(max(sy * sz, 1e-4));
  q.y = q.y * sy;
  q.z = uKcCz + (q.z - uKcCz) * sz;
  q.x = uKcCx + (q.x - uKcCx) * comp * (1.0 + uKcSide);

  // 2 · Twist: Bug und Heck verdrehen GEGENEINANDER. Winkel linear in s, also am Bug und am
  //     Heck gleich gross und entgegengesetzt, in der Mitte null.
  float a = uKcTwist * s;
  float ca = cos(a), sa = sin(a);
  float rx = q.x - uKcCx, ry = q.y - uKcH * 0.5;
  q.x = uKcCx + rx * ca - ry * sa;
  q.y = uKcH * 0.5 + rx * sa + ry * ca;

  // 3 · Nachlauf: acht Baender entlang der Laengsachse, linear zwischen den Stuetzstellen.
  //     Jedes Band hat auf der CPU seinen eigenen Spring — daraus entsteht »Heck spaeter als
  //     Bug« von selbst.
  float bf = t * 7.0;
  int bi = int(floor(bf));
  float bt = fract(bf);
  float lag = mix(uKcLag[bi], uKcLag[min(bi + 1, 7)], bt);

  // 4 · Bogen und Neigung, beide in Anteilen der LAENGE.
  //     (s² − 1/3) ist mittelwertfrei: die Biegung kruemmt, sie versetzt nicht. Ohne den Abzug
  //     rutscht das Fahrzeug in der Kurve seitlich weg, ohne dass es gefahren waere.
  q.x += (uKcBend * (s * s - 0.3333333) + uKcLean * s + lag) * uKcLenZ;

  return mix(p, q, uKcMix);
}
`;

const NORMAL_PATCH = [
  '#include <beginnormal_vertex>',
  '{',
  '  vec3 nn = normalize(objectNormal);',
  '  vec3 t1 = normalize(cross(nn, vec3(0.0, 1.0, 0.0001)));',
  '  vec3 t2 = cross(nn, t1);',
  '  float e = uKcLenZ * 0.02;',
  '  vec3 p0 = kfbVehDeform(position);',
  '  vec3 pa = kfbVehDeform(position + t1 * e);',
  '  vec3 pb = kfbVehDeform(position + t2 * e);',
  '  vec3 nd = cross(pa - p0, pb - p0);',
  '  if (length(nd) > 1e-9) objectNormal = normalize(nd) * sign(dot(normalize(nd), nn));',
  '}',
].join('\n');

export const FALLBACK_SOFT_PROFILE = {
  id: 'SOFT_DEFAULT',
  /* Obergrenzen bei vollem Signal. 0,15 ist Georgs Vorgabe vom 19.09.; darueber wird aus Gummi
     Knete, darunter sieht man den Unterschied zur Gruppenfassung nicht. */
  maxSquash: 0.15, maxStretch: 0.15, maxSide: 0.06,
  bend: 0.05,          // × Laenge, Bogen in der Kurve
  lean: 0.02,          // × Laenge, Neigung (Heck raus)
  twistDeg: 7,         // Bug gegen Heck
  lagAmount: 0.05,     // × Laenge, Amplitude des Nachlaufs — mittelwertfrei, siehe update()
    lagSpreadMs: 110,    // Zeitversatz Bug → Heck ueber die ganze Laenge
  attachmentMix: 0.35, // wie weit Raeder und Anbauteile mitgehen
  hitstopMs: 70,       // Skill §11.4: 40–95 ms
  anticipateMs: 120,
  massFeel: null,      // null = gemessener Vorschlag gilt
  freq: 3.2, damp: 0.5,
};

export function attachSegmentedDeform({ THREE, rig, profile = null }) {
  const P = Object.assign({}, FALLBACK_SOFT_PROFILE, profile || {});
  const measuredMass = massFromGeometry(rig);
  const mass = P.massFeel != null ? P.massFeel : measuredMass.massFeel;
  /* Masse wirkt AUSSCHLIESSLICH auf die Traegheit der Springs — nie auf Geometrie, nie auf
     Physik. Schwer heisst langsamer und laenger, nicht groesser. */
  const freq = P.freq * (1.25 - 0.5 * mass);
  const damp = P.damp + 0.18 * mass;

  /* EIN Rahmen fuer das ganze Fahrzeug (Spenderregel 3). Gemessen wird an der GEBACKENEN
     Geometrie — Orient und Gier sind darin schon enthalten. */
  const box = new THREE.Box3().setFromObject(rig.group);
  const U = {
    uKcMix: { value: 1 },
    uKcMinZ: { value: box.min.z }, uKcLenZ: { value: Math.max(1e-6, box.max.z - box.min.z) },
    uKcH: { value: Math.max(1e-6, box.max.y - box.min.y) },
    uKcCx: { value: (box.min.x + box.max.x) / 2 }, uKcCz: { value: (box.min.z + box.max.z) / 2 },
    uKcBend: { value: 0 }, uKcLean: { value: 0 }, uKcTwist: { value: 0 },
    uKcSquash: { value: 0 }, uKcStretch: { value: 0 }, uKcSide: { value: 0 },
    uKcLag: { value: new Float32Array(BANDS) },
  };

  const entries = [];
  const wheelNodes = new Set();
  rig.wheels.forEach((w) => w.spin.traverse((n) => { if (n.isMesh) wheelNodes.add(n); }));

  const patch = (sh, mixU) => {
    Object.assign(sh.uniforms, U, { uKcMix: mixU });
    sh.vertexShader = sh.vertexShader
      .replace('void main() {', GLSL + '\nvoid main() {')
      .replace('#include <beginnormal_vertex>', NORMAL_PATCH)
      .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed = kfbVehDeform(transformed);');
  };

  const attach = (n, isAttachment) => {
    const mixU = { value: isAttachment ? P.attachmentMix : 1 };
    const mat = n.material = (Array.isArray(n.material) ? n.material[0] : n.material).clone();
    mat.onBeforeCompile = (sh) => patch(sh, mixU);
    mat.needsUpdate = true;
    /* ⚠ DER SCHATTEN KOMMT AUS EINEM ANDEREN MATERIAL. Ohne diese sechs Zeilen steht unter
       einem krumm gebogenen Auto ein kerzengerader Schatten — der Spender hat genau diese
       Luecke, weil seine Props keinen Schlagschatten werfen. */
    const dm = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
    dm.onBeforeCompile = (sh) => patch(sh, mixU);
    n.customDepthMaterial = dm;
    entries.push({ node: n, mat, dm, mixU, attachment: !!isAttachment });
  };

  rig.body.traverse((n) => { if (n.isMesh) attach(n, false); });
  rig.wheels.forEach((w) => w.spin.traverse((n) => { if (n.isMesh) attach(n, true); }));

  /* Netzgüte: gemessen, nicht behauptet. `maxTriSpan` ist der Wert, der entscheidet, ob eine
     Biegung BIEGT oder nur SCHERT — ein Dreieck ueber die halbe Laenge kann sich nicht kruemmen. */
  const quality = (() => {
    let rings = 0, span = 0;
    rig.body.traverse((n) => {
      if (!n.isMesh) return;
      const q = segmentsAlongZ(n.geometry, box.min.z, box.max.z);
      if (q.rings > rings) rings = q.rings;
      if (q.maxTriSpan > span) span = q.maxTriSpan;
    });
    return { rings, maxTriSpan: span, bendable: rings >= 4,
      note: rings < 4 ? 'zu wenige Ringe — biegt nicht, schert. Bogen wird abgeschaltet.'
        : span > 0.45 ? 'einzelne Dreiecke ueber ' + Math.round(span * 100) + ' % der Laenge — die scheren mit, sichtbar bei voller Biegung'
        : 'fein genug unterteilt' };
  })();

  const S = {
    bend: new Spring({ freq, damp, cap: P.bend * 2.2, attack: 1.15, release: 0.85 }),
    lean: new Spring({ freq: freq * 0.9, damp, cap: P.lean * 2.4, attack: 1.1, release: 0.8 }),
    twist: new Spring({ freq: freq * 1.2, damp: damp - 0.06, cap: P.twistDeg * 2.2, attack: 1.4, release: 0.85 }),
    squash: new Spring({ freq: freq * 1.35, damp: damp - 0.08, cap: P.maxSquash * 1.6, attack: 1.6, release: 0.9 }),
    stretch: new Spring({ freq: freq * 1.1, damp, cap: P.maxStretch * 1.6, attack: 1.3, release: 0.85 }),
    side: new Spring({ freq: freq * 1.2, damp, cap: P.maxSide * 1.8, attack: 1.5, release: 0.9 }),
  };
  /* Acht Nachlauf-Springs, EINE Frequenz, gestaffelte Ziele: Band 0 (Heck) bekommt sein Ziel
     `lagSpreadMs` spaeter als Band 7 (Bug). Der Versatz ist eine Verzoegerungsleitung, keine
     zweite Kurve — deshalb steht hier ein Ringpuffer und kein Offset in der Formel. */
  const lagSprings = [];
  for (let i = 0; i < BANDS; i++) lagSprings.push(new Spring({ freq: freq * 1.15, damp: damp - 0.05, cap: P.lagAmount * 2.5, attack: 1.2, release: 0.8 }));
  const delayLine = [];

  const sig = { speed: 0, longAccel: 0, lateral: 0, bank: 0, drift: 0 };
  let now = 0, hitstopUntil = -1e9;
  const readout = { bend: 0, twist: 0, squash: 0, lagHead: 0, lagTail: 0, hitstop: false, quality, mass, measuredMass };

  const api = {
    schema: SCHEMA,
    get quality() { return quality; },
    get mass() { return { used: mass, measured: measuredMass, overridden: P.massFeel != null }; },
    get profile() { return Object.assign({}, P); },
    get readout() { return Object.assign({}, readout); },

    /** 0 = exakt die alte Fassung ohne weiche Schicht, 1 = voll. Der Rueckweg, jederzeit. */
    setMix(v) {
      const m = clamp(finite(v, 1), 0, 1);
      entries.forEach((e) => { e.mixU.value = (e.attachment ? P.attachmentMix : 1) * m; });
      return api;
    },

    setProfile(next) {
      Object.assign(P, next || {});
      const m = P.massFeel != null ? P.massFeel : measuredMass.massFeel;
      const f = P.freq * (1.25 - 0.5 * m), d = P.damp + 0.18 * m;
      S.bend.tune({ freq: f, damp: d, cap: P.bend * 2.2 });
      S.lean.tune({ freq: f * 0.9, damp: d, cap: P.lean * 2.4 });
      S.twist.tune({ freq: f * 1.2, damp: d - 0.06, cap: P.twistDeg * 2.2 });
      S.squash.tune({ freq: f * 1.35, damp: d - 0.08, cap: P.maxSquash * 1.6 });
      S.stretch.tune({ freq: f * 1.1, damp: d, cap: P.maxStretch * 1.6 });
      S.side.tune({ freq: f * 1.2, damp: d, cap: P.maxSide * 1.8 });
      lagSprings.forEach((s) => s.tune({ freq: f * 1.15, damp: d - 0.05, cap: P.lagAmount * 2.5 }));
      return api;
    },

    /** Dieselben fuenf Namen wie seit v2. Die weiche Schicht erfindet keine neuen Signale. */
    setSignals(next) {
      if (!next) return api;
      ['speed', 'longAccel', 'lateral', 'bank', 'drift'].forEach((k) => { if (k in next) sig[k] = clamp(finite(next[k]), -1, 1); });
      sig.speed = clamp(sig.speed, 0, 1);
      return api;
    },

    /** Einschlag: Impuls plus HITSTOP. Der Halt ist der Moment, in dem die Bedeutung wechselt. */
    impact({ side = 1, strength = 1 } = {}) {
      const s = clamp(finite(strength, 1), 0, 1), d = Math.sign(side || 1);
      const w = 2 * Math.PI * Math.max(0.01, S.squash.freq);
      S.squash.kick(P.maxSquash * s * w);
      S.side.kick(-d * P.maxSide * s * w);
      S.twist.kick(-d * P.twistDeg * s * w * 0.6);
      S.bend.kick(-d * P.bend * s * w * 0.8);
      hitstopUntil = now + P.hitstopMs * s;
      return api;
    },

    landing({ strength = 1 } = {}) {
      const s = clamp(finite(strength, 1), 0, 1);
      const w = 2 * Math.PI * Math.max(0.01, S.squash.freq);
      S.squash.kick(P.maxSquash * s * w * 1.2);
      hitstopUntil = now + P.hitstopMs * s * 0.7;
      return api;
    },

    /**
     * Gegenbewegung VOR dem Hauptschlag (Skill §2.1). NUR fuer geplante Ereignisse — wer sie
     * reaktiv aufruft, bekommt sie zu spaet und damit einen zweiten Schlag statt einer
     * Vorbereitung. Der Aufrufer ist der Zeitplan, nicht der Einschlag.
     */
    anticipate({ kind = 'impact', side = 1, strength = 1 } = {}) {
      const s = clamp(finite(strength, 1), 0, 1), d = Math.sign(side || 1);
      const w = 2 * Math.PI * Math.max(0.01, S.squash.freq);
      if (kind === 'landing') S.stretch.kick(P.maxStretch * s * w * 0.35);
      else { S.side.kick(d * P.maxSide * s * w * 0.4); S.bend.kick(d * P.bend * s * w * 0.35); }
      return api;
    },

    update(dt) {
      const raw = clamp(finite(dt), 0, 0.5);
      now += raw * 1000;
      /* HITSTOP: die Uhr der Verformung steht, die Welt laeuft weiter. Nicht `dt = 0` fuer
         alles — sonst friert auch die Bewegung ein, die Travel besitzt. */
      const stopped = now < hitstopUntil;
      readout.hitstop = stopped;
      const h = stopped ? 0 : raw;

      const driftMag = Math.abs(sig.drift);
      const lateralEff = sig.lateral * (1 - 0.45 * driftMag);
      /* Die Kurve KRUEMMT das Fahrzeug (Bogen), der Drift SCHIEBT das Heck raus (Neigung).
         Zwei verschiedene Leseweisen aus zwei verschiedenen Ursachen — nicht dieselbe Zahl
         zweimal verstaerkt. */
      S.bend.set(-lateralEff * P.bend);
      S.lean.set(sig.drift * P.lean);
      S.twist.set((lateralEff * 0.6 + sig.drift * 0.8) * P.twistDeg);
      S.squash.set(Math.abs(lateralEff) * P.maxSquash * 0.35 + sig.speed * P.maxSquash * 0.12);
      S.stretch.set(sig.longAccel * P.maxStretch * 0.8);
      S.side.set(-Math.abs(lateralEff) * P.maxSide * 0.6);

      U.uKcBend.value = S.bend.step(h);
      U.uKcLean.value = S.lean.step(h);
      U.uKcTwist.value = S.twist.step(h) * Math.PI / 180;
      U.uKcSquash.value = S.squash.step(h);
      U.uKcStretch.value = S.stretch.step(h);
      U.uKcSide.value = S.side.step(h);
      if (!quality.bendable) U.uKcBend.value = 0;

      /* Nachlauf. Das Ziel ist die aktuelle Querbewegung; jedes Band liest es um seinen
         eigenen Betrag SPAETER aus der Verzoegerungsleitung. Bug (Band 7) liest jetzt,
         Heck (Band 0) liest `lagSpreadMs` her. */
      const drive = (-lateralEff * 0.6 - sig.drift * 0.9) * P.lagAmount;
      delayLine.push({ t: now, v: drive });
      while (delayLine.length > 2 && now - delayLine[0].t > P.lagSpreadMs + 40) delayLine.shift();
      const lagArr = U.uKcLag.value;
      let lagMean = 0;
      for (let i = 0; i < BANDS; i++) {
        const back = (1 - i / (BANDS - 1)) * P.lagSpreadMs;
        const want = now - back;
        let v = drive;
        for (let k = delayLine.length - 1; k >= 0; k--) { if (delayLine[k].t <= want) { v = delayLine[k].v; break; } }
        lagSprings[i].set(v);
        lagArr[i] = lagSprings[i].step(h);
        lagMean += lagArr[i];
      }
      /* ⚠ MITTELWERTFREI, aus demselben Grund wie (s² − 1/3) beim Bogen — und das war ein
         GEMESSENER Fehler, kein vorsorglicher Handgriff: im eingeschwungenen Zustand stehen alle
         acht Baender auf demselben Wert (gemessen −2,29 % an Bug WIE Heck), und acht gleiche
         Querversaetze sind keine Verformung mehr, sondern eine Verschiebung des ganzen
         Fahrzeugs. Im Bild ist das Auto seitlich aus dem Rahmen gewandert, ohne gefahren zu
         sein. Die Praesentation darf das Fahrzeug nicht bewegen — Bewegung gehoert Race und
         Travel. Was uebrig bleibt, ist genau der UNTERSCHIED zwischen Bug und Heck, und DAS ist
         der Nachlauf. */
      lagMean /= BANDS;
      for (let i = 0; i < BANDS; i++) lagArr[i] -= lagMean;

      readout.bend = +U.uKcBend.value.toFixed(4);
      readout.twist = +(U.uKcTwist.value * 180 / Math.PI).toFixed(2);
      readout.squash = +U.uKcSquash.value.toFixed(4);
      readout.stretch = +U.uKcStretch.value.toFixed(4);
      readout.lagTail = +lagArr[0].toFixed(4);
      readout.lagHead = +lagArr[BANDS - 1].toFixed(4);
      return readout;
    },

    /** Muss EXAKT null werden — jede Uniform auf 0, sonst bleibt eine Krümmung stehen. */
    reset() {
      Object.values(S).forEach((s) => s.reset());
      lagSprings.forEach((s) => s.reset());
      delayLine.length = 0;
      ['uKcBend', 'uKcLean', 'uKcTwist', 'uKcSquash', 'uKcStretch', 'uKcSide'].forEach((k) => { U[k].value = 0; });
      U.uKcLag.value.fill(0);
      hitstopUntil = -1e9;
      Object.keys(sig).forEach((k) => { sig[k] = 0; });
      readout.bend = 0; readout.twist = 0; readout.squash = 0; readout.stretch = 0;
      readout.lagHead = 0; readout.lagTail = 0; readout.hitstop = false;
      return api;
    },

    dispose() {
      entries.forEach((e) => { e.mat.dispose(); e.dm.dispose(); e.node.customDepthMaterial = null; });
      entries.length = 0;
    },
  };
  return api;
}
