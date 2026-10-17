/**
 * lab-v9/drive-mods.v1.js · Antriebs-Mods · EIN Modul, drei Antriebe, EINE Drehmaschine.
 *
 * ═══ WARUM ANBAUEN UND NICHT DREHEN ════════════════════════════════════════════════════════
 * Gemessen am 19.09. an allen zehn Flug-Fixtures (`KFB Antrieb Probe.dc.html`): KEIN einziges
 * Modell fuehrt einen Propeller-, Rotor- oder Duesenknoten. Neun sind ein einziges verschweisstes
 * Netz, Airplane B ist nach MATERIAL in drei Tori geteilt (`Torus001_1 … _2`), nicht nach Bauteil.
 * Ein »mitdrehender Propeller« gibt es also nicht zu finden — er wird ANGEBAUT. Damit ist der
 * rotierende Propeller von vornherein dasselbe wie ein Mod, und das ist der Grund, warum hier
 * ein Mod-System steht und keine Propellerfunktion.
 *
 * ═══ WAS DIESES MODUL BESITZT ══════════════════════════════════════════════════════════════
 * Eigene Praesentationsknoten UNTER einem Traegerknoten, sonst nichts. Im Betriebsart »zeigen«
 * schreibt es nie Ort, Kurs, Tempo oder Hoehe — die gehoeren Travel. In »treiben« liefert es
 * einen Signalblock (Schub, Auftrieb) NACH AUSSEN; wer ihn anwendet, entscheidet der Aufrufer.
 * Ein Mod bewegt nie selbst ein Fahrzeug.
 *
 * ═══ DIE DREHMASCHINE ══════════════════════════════════════════════════════════════════════
 * Alle sechs Cartoon-Reads haengen an EINER Zustandsgroesse (omega) und EINER Blende (shutterHz).
 * Sie sind nicht sechs Sondereffekte, sondern sechs Folgen derselben zwei Zahlen:
 *
 *   Anlauf / Auslauf   zwei Zeitkonstanten statt einer. Auslauf ist laenger → Nachlauf.
 *   Windmuehle         bei Schub 0 und Fahrt > 0 bleibt ein Bodensatz an Drehzahl stehen.
 *   Tuckern            Drehmomentwelligkeit in Blattfrequenz, Amplitude faellt mit omega.
 *   Anwerfen           Zustandsautomat aus → angeworfen → laeuft, mit Fangdrehzahl.
 *   Fehlzuendung       negativer Impuls plus kurzes Fenster mit vierfacher Welligkeit.
 *   Wagenrad + Blur    BEIDE aus dem Blendenwinkel je Blendenbild, siehe unten.
 *
 * ═══ WAGENRAD UND BLUR SIND DIESELBE ZAHL ══════════════════════════════════════════════════
 * Je Blendenbild dreht das Blatt um Δ = omega / shutterHz. Der Blattschritt ist 2π/Blattzahl.
 * Ab Δ > Blattschritt/2 ist die Drehrichtung mehrdeutig (Abtasttheorem) — das ist der
 * Wagenradeffekt, und er ist RECHENBAR, kein Trick: die scheinbare Drehung ist der auf
 * ±Blattschritt/2 gefaltete Rest. Ab etwa Δ > 1,4 × Blattschritt kann das Auge gar nichts mehr
 * verfolgen; genau dort blendet die Scheibe auf. Die Schwelle ist damit ABGELEITET und
 * verschiebt sich von selbst, wenn die Blattzahl oder die Blende sich aendert.
 *
 * ═══ KEINE ZUFALLSWERTE ════════════════════════════════════════════════════════════════════
 * V6 der Fahrzeuglinie gilt hier genauso. Tuckern ist periodisch in der Blattphase, nicht
 * verrauscht. Eine Fehlzuendung passiert, WEIL sie ausgeloest wurde.
 */
export const SCHEMA = 'kfb.drive-mods/1';

const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const finite = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
const smooth = (a, b, x) => { const t = clamp((x - a) / Math.max(1e-9, b - a), 0, 1); return t * t * (3 - 2 * t); };

export const MOD_RULE = [
  'Kein Flugmodell fuehrt einen Antriebsknoten — jeder Mod ist angebaute Geometrie (gemessen 19.09.)',
  'Nabe = Schwerpunkt der Scheitel in der Scheibenebene, nicht Huellboxmitte (ein langes Blatt verzieht die Box)',
  'Drehachse = duennste Huellachse des Mod-Assets',
  'Blattzahl = Anzahl der Winkelspitzen der Radialreichweite ueber 360 Faecher bei r > 0,6 R',
  'Hoechstdrehzahl = Blattspitzentempo / Radius — ein groesserer Propeller dreht langsamer',
  'Blur-Schwelle = 1,4 × Blattschritt je Blendenbild, abgeleitet aus Blende und Blattzahl',
  'Anker = gemessener Vorschlag am Traegerrahmen, per Griff korrigierbar, Korrektur wird gemerkt',
];

/* ══ TRAEGERRAHMEN ═══════════════════════════════════════════════════════════════════════════
   Eingang ist das Ergebnis von `lab-v7/carrig.v3.js`: y = 0 auf dem Aufstandspunkt, x/z auf der
   Modellmitte, alle Teilnetze in EINEN Raum gebacken. Was Orient und Gier gedreht haben, steckt
   schon drin — deshalb wird hier die gebackene Geometrie gelesen und nicht die Quelldatei. */
export function measureCarrier({ THREE, rig, forward = 1 }) {
  const box = new THREE.Box3().setFromObject(rig.body);
  const size = box.getSize(new THREE.Vector3());
  const centre = box.getCenter(new THREE.Vector3());
  const f = forward < 0 ? -1 : 1;
  const midY = +centre.y.toFixed(5);
  const halfLen = size.z / 2;
  return {
    schema: SCHEMA,
    span: +size.x.toFixed(5), length: +size.z.toFixed(5), height: +size.y.toFixed(5),
    minY: +box.min.y.toFixed(5), maxY: +box.max.y.toFixed(5), midY,
    forward: f,
    /* Die drei gemessenen Ankerpunkte. Sie sind ein VORSCHLAG — der Griff korrigiert sie. */
    anchors: {
      nose: { x: 0, y: midY, z: +(f * halfLen).toFixed(5) },
      tail: { x: 0, y: midY, z: +(-f * halfLen).toFixed(5) },
      belly: { x: 0, y: +box.min.y.toFixed(5), z: +centre.z.toFixed(5) },
    },
    unit: +Math.max(size.x, size.y, size.z).toFixed(5),
    rule: MOD_RULE,
  };
}

/* ══ DIE DREHMASCHINE ════════════════════════════════════════════════════════════════════════ */
export class Spinner {
  /**
   * @param {object} o
   * @param {number} o.radius     gemessener Aussenradius in Traegereinheiten
   * @param {number} o.blades     gemessene Blattzahl
   * @param {number} o.tipSpeed   Blattspitzentempo in Traegereinheiten/s — der EINE Charakterwert
   * @param {number} o.spinUp     Zeitkonstante Anlauf (s)
   * @param {number} o.spinDown   Zeitkonstante Auslauf (s) — laenger, daher Nachlauf
   * @param {number} o.shutterHz  Blende. 0 = keine, dann kein Wagenrad und kein Aliasing
   * @param {number} o.chug       Tuckern im Leerlauf, 0…1
   */
  constructor({ radius = 1, blades = 2, tipSpeed = 90, spinUp = 0.85, spinDown = 3.4,
                shutterHz = 24, chug = 0.35, windmill = 0.22, requireCrank = false, dir = 1 } = {}) {
    this.p = { radius, blades: Math.max(1, Math.round(blades)), tipSpeed, spinUp, spinDown,
               shutterHz, chug, windmill, requireCrank, dir: dir < 0 ? -1 : 1 };
    this.reset();
  }

  get bladeStep() { return TAU / this.p.blades; }
  /** Hoechstdrehzahl ist ABGELEITET: ein groesserer Propeller dreht langsamer (V16-Regel). */
  get omegaMax() { return this.p.tipSpeed / Math.max(1e-4, this.p.radius); }
  /** Fangdrehzahl des Anwerfens: eine Achtel-Hoechstdrehzahl. Eine Zahl, eine Stelle. */
  get catchOmega() { return this.omegaMax * 0.125; }

  tune(next) { Object.assign(this.p, next || {}); if (this.p.blades < 1) this.p.blades = 1; return this; }

  reset() {
    this.angle = 0; this.shown = 0; this.omega = 0; this.kickOmega = 0;
    this.demand = 0; this.carry = 0; this.shutterAcc = 0; this.stutter = 0;
    this.state = this.p.requireCrank ? 'aus' : 'laeuft';
    this.read = { rpm: 0, apparentRpm: 0, blur: 0, delta: 0, state: this.state, aliasing: false };
    return this;
  }

  /** @param {number} throttle 0…1 · @param {number} carry Fahrtwind 0…1 (Windmuehle im Gleitflug) */
  set(throttle, carry = 0) {
    this.demand = clamp(finite(throttle), 0, 1);
    this.carry = clamp(finite(carry), 0, 1);
    return this;
  }

  /** Anwerfen von Hand. Ein Ruck, kein Dauerzustand — faengt der Motor nicht, laeuft es aus. */
  crank(strength = 1) {
    const s = clamp(finite(strength, 1), 0, 1);
    this.kickOmega += this.catchOmega * 2.6 * s;
    if (this.state === 'aus') this.state = 'angeworfen';
    return this;
  }

  /** Fehlzuendung: ein negativer Impuls plus ein kurzes Fenster mit vervierfachter Welligkeit. */
  misfire(strength = 1) {
    const s = clamp(finite(strength, 1), 0, 1);
    this.kickOmega -= this.omega * 0.55 * s;
    this.stutter = Math.max(this.stutter, 0.28 * s + 0.08);
    return this;
  }

  step(dt) {
    const h = clamp(finite(dt), 0, 0.1);
    const P = this.p;

    /* Der Anwerf-Zustand entscheidet, ob der Gashebel ueberhaupt wirkt. */
    if (P.requireCrank) {
      if (this.state === 'angeworfen' && this.demand > 0.05 && this.omega > this.catchOmega) this.state = 'laeuft';
      if (this.state === 'angeworfen' && this.omega < this.catchOmega * 0.12) this.state = 'aus';
      if (this.state === 'laeuft' && this.demand < 0.02 && this.omega < this.catchOmega * 0.12) this.state = 'aus';
    } else this.state = 'laeuft';

    const gated = P.requireCrank && this.state !== 'laeuft' ? 0 : this.demand;
    /* Windmuehle: ohne Schub, aber mit Fahrt bleibt ein Bodensatz stehen. Das ist der Gleitflug. */
    const floor = this.carry * this.omegaMax * P.windmill;
    const target = Math.max(gated * this.omegaMax, floor);

    const tau = target > this.omega ? P.spinUp : P.spinDown;
    this.omega += (target - this.omega) * (1 - Math.exp(-h / Math.max(0.02, tau)));
    this.omega += this.kickOmega * (1 - Math.exp(-h / 0.06));
    this.kickOmega *= Math.exp(-h / 0.06);
    if (this.omega < 0) this.omega = 0;
    /* Ruhe muss EXAKT Ruhe sein. Eine Exponentialkurve erreicht die Null nie — ohne diese
       Schwelle tuckert der Propeller noch nach elf Sekunden mit 22 U/min vor sich hin, und ein
       Standbild waere nicht reproduzierbar (V8 der Fahrzeuglinie). Die Schwelle ist ein
       Tausendstel der Hoechstdrehzahl, also nicht sichtbar, aber messbar null. */
    if (target <= 0 && Math.abs(this.kickOmega) < 1e-4 && this.omega < this.omegaMax * 0.004) { this.omega = 0; this.angle = 0; this.shown = 0; }
    if (this.stutter > 0) this.stutter = Math.max(0, this.stutter - h);

    /* Tuckern. Periodisch in der Blattphase, Amplitude faellt mit der Drehzahl — ein Motor
       tuckert im Leerlauf und laeuft oben rund. Nie ein Zufallswert (V6). */
    const lowT = 1 - smooth(0, this.omegaMax * 0.28, this.omega);
    const amp = P.chug * lowT * (this.stutter > 0 ? 4 : 1);
    const ripple = amp * Math.sin(this.angle * P.blades);
    const omegaInst = this.omega * (1 + ripple);

    this.angle += P.dir * omegaInst * h;
    if (this.angle > TAU * 1e6 || this.angle < -TAU * 1e6) this.angle = this.angle % TAU;

    /* Blende. Zwischen zwei Blendenbildern steht der GEZEIGTE Winkel still — nur so entsteht
       Aliasing ueberhaupt. Bei shutterHz 0 laeuft die Darstellung stetig und es gibt kein Wagenrad. */
    if (P.shutterHz > 0) {
      const period = 1 / P.shutterHz;
      this.shutterAcc += h;
      while (this.shutterAcc >= period) { this.shown = this.angle; this.shutterAcc -= period; }
    } else this.shown = this.angle;

    /* Wagenrad und Blur aus DERSELBEN Zahl: dem Blattwinkel je Blendenbild. */
    const step = this.bladeStep;
    const delta = P.shutterHz > 0 ? (this.omega / P.shutterHz) : 0;
    let fold = 0;
    if (P.shutterHz > 0 && step > 0) {
      fold = ((delta % step) + step) % step;
      if (fold > step / 2) fold -= step;
    }
    const blur = P.shutterHz > 0 ? smooth(step * 0.6, step * 1.4, delta) : smooth(this.omegaMax * 0.35, this.omegaMax * 0.8, this.omega);

    this.read = {
      rpm: +(this.omega * 60 / TAU).toFixed(1),
      apparentRpm: +(P.dir * fold * P.shutterHz * 60 / TAU).toFixed(1),
      blur: +blur.toFixed(3),
      delta: +delta.toFixed(4),
      bladeStep: +step.toFixed(4),
      omega: +this.omega.toFixed(3),
      state: this.state,
      chugging: amp > 0.02 && this.omega > 0,
      aliasing: P.shutterHz > 0 && delta > step / 2 && blur < 0.98,
    };
    return this.read;
  }
}

/* ══ PROPELLER · aus dem Librarian-Asset ═════════════════════════════════════════════════════
   `media/3D_Assets/KFB/Propeller by Poly by Google - 7IXU7duFN7t.glb` — EIN Netz, Huelle
   66,74 × 6,52 × 55,86 (gemessen 19.09.). Duennste Achse y, die Scheibe liegt also in xz.
   Gebaut wird daraus eine Gruppe, deren Drehachse +z ist und deren Nabe im Ursprung sitzt —
   damit haengt jeder Mod gleich, egal wie sein Asset autoriert war. */
export function buildPropeller({ THREE, source, carrier, sizeK = 1 }) {
  const src = source.clone(true);
  const box = new THREE.Box3().setFromObject(src);
  const size = box.getSize(new THREE.Vector3());
  const dims = [['x', size.x], ['y', size.y], ['z', size.z]].sort((a, b) => a[1] - b[1]);
  const axis = dims[0][0];                       /* duennste Achse = Drehachse */
  const plane = ['x', 'y', 'z'].filter((k) => k !== axis);

  /* Nabe: Schwerpunkt der Scheitel in der Scheibenebene. Die Huellboxmitte taugt nicht — ein
     einzelnes langes Blatt verzieht sie, und der Propeller liefe dann exzentrisch. */
  let n = 0; const sum = { x: 0, y: 0, z: 0 };
  const v = new THREE.Vector3();
  src.updateMatrixWorld(true);
  src.traverse((o) => {
    if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
    const p = o.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld); sum.x += v.x; sum.y += v.y; sum.z += v.z; n++; }
  });
  const hub = n ? { x: sum.x / n, y: sum.y / n, z: sum.z / n } : box.getCenter(new THREE.Vector3());
  const boxCentre = box.getCenter(new THREE.Vector3());

  /* Radius und Blattzahl aus der Radialreichweite ueber 360 Faecher. Eine Spitze ist ein Blatt. */
  const FAN = 360, reach = new Float64Array(FAN);
  let rMax = 0;
  src.traverse((o) => {
    if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
    const p = o.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld);
      const a = v[plane[0]] - hub[plane[0]], b = v[plane[1]] - hub[plane[1]];
      const r = Math.hypot(a, b);
      if (r > rMax) rMax = r;
      const k = Math.floor((((Math.atan2(b, a) + Math.PI) / TAU) * FAN)) % FAN;
      if (r > reach[k]) reach[k] = r;
    }
  });
  let blades = 0;
  const thr = rMax * 0.6;
  for (let i = 0; i < FAN; i++) {
    const prev = reach[(i + FAN - 1) % FAN];
    if (reach[i] >= thr && prev < thr) blades++;
  }
  if (blades < 2) blades = 2;

  /* In EINEN Raum bringen: Nabe in den Ursprung, Drehachse auf +z, danach auf das gemessene
     Zielmass des Traegers skalieren. Erst umhaengen, dann skalieren — nie umgekehrt. */
  /* Die Nabe wandert ueber eine EIGENE Gruppe in den Ursprung, nicht ueber die Position des
     Asset-Wurzelknotens: haette die Wurzel selbst schon einen Versatz, wuerde ihn ein direktes
     `position.set` stillschweigend loeschen und der Propeller liefe exzentrisch. */
  const inner = new THREE.Group(); inner.name = 'ModPropellerBlades';
  inner.position.set(-hub.x, -hub.y, -hub.z);
  inner.add(src);
  const align = new THREE.Group(); align.name = 'ModPropellerAlign';
  if (axis === 'y') align.rotation.x = Math.PI / 2;
  else if (axis === 'x') align.rotation.y = Math.PI / 2;
  align.add(inner);

  const targetDia = Math.min(carrier.height * 0.75, carrier.span * 0.28) * sizeK;
  const k = targetDia / Math.max(1e-6, rMax * 2);
  align.scale.setScalar(k);

  /* Die Blur-Scheibe darf NICHT unter der skalierten Gruppe haengen — dort wuerde sie mit dem
     Asset-Massstab (hier 0,013) mitschrumpfen und waere unsichtbar. Darum eine aeussere,
     unskalierte Gruppe: sie ist der Anschlusspunkt, `align` nur der Dreher. */
  const outer = new THREE.Group(); outer.name = 'ModPropeller';
  outer.add(align);

  const blades3 = [];
  align.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; blades3.push(o); } });

  return {
    node: outer, spinNode: align, blades: blades3,
    radius: targetDia / 2, bladeCount: blades,
    measured: {
      assetHull: [+size.x.toFixed(4), +size.y.toFixed(4), +size.z.toFixed(4)],
      assetAxis: axis, assetRadius: +rMax.toFixed(4), scale: +k.toFixed(5),
      hub: [+hub.x.toFixed(3), +hub.y.toFixed(3), +hub.z.toFixed(3)],
      hubVsBox: +Math.hypot(hub.x - boxCentre.x, hub.y - boxCentre.y, hub.z - boxCentre.z).toFixed(3),
      verts: n, blades,
    },
  };
}

/* ══ ANTI-GRAV-TURBINE · erzeugt ════════════════════════════════════════════════════════════
   Kein Asset im Satz (Librarian am 19.09. durchsucht: nur ein Propeller). Also erzeugte
   Primitive — zwei Ringe, gegenlaeufig, plus eine Scheibe, die den Schub nach unten zeigt. */
export function buildAntiGrav({ THREE, carrier, sizeK = 1 }) {
  const R = carrier.span * 0.3 * sizeK;
  const node = new THREE.Group(); node.name = 'ModAntiGrav';
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x9fd4e8, metalness: 0.6, roughness: 0.3,
    emissive: 0x2a6f8a, emissiveIntensity: 0.6 });
  const outer = new THREE.Mesh(new THREE.TorusGeometry(R, R * 0.10, 10, 40), ringMat);
  const inner = new THREE.Mesh(new THREE.TorusGeometry(R * 0.66, R * 0.085, 10, 34), ringMat.clone());
  outer.rotation.x = Math.PI / 2; inner.rotation.x = Math.PI / 2;
  const spinA = new THREE.Group(); spinA.add(outer);
  const spinB = new THREE.Group(); spinB.add(inner); spinB.position.y = -R * 0.16;
  const glow = new THREE.Mesh(new THREE.CircleGeometry(R * 0.92, 40),
    new THREE.MeshBasicMaterial({ color: 0x7fe0ff, transparent: true, opacity: 0, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, depthWrite: false }));
  glow.rotation.x = Math.PI / 2; glow.position.y = -R * 0.34;
  node.add(spinA, spinB, glow);
  /* Der Bauchanker liegt auf der Unterkante der Huelle. Eine Turbine, die GENAU dort sitzt,
     steckt zur Haelfte im Rumpf und zur Haelfte im Boden — sie haengt darunter. */
  node.position.y = -R * 0.38;
  node.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; } });
  return { node, spinNode: spinA, counterNode: spinB, glow, radius: R, bladeCount: 8,
    measured: { ringRadius: +R.toFixed(4), quelle: 'erzeugt — kein Asset im Librarian' } };
}

/* ══ SCHUBDUESE · erzeugt ═══════════════════════════════════════════════════════════════════
   Die Duese selbst steht still, der Verdichterring darin dreht — damit haengt auch dieser Mod
   an derselben Drehmaschine und nicht an einer zweiten Mechanik. Die Flamme ist ein Kegel mit
   additiver Mischung; ihre LAENGE ist der Read, nicht ihre Farbe. */
export function buildThruster({ THREE, carrier, sizeK = 1 }) {
  const R = carrier.height * 0.22 * sizeK;
  const L = carrier.height * 0.4 * sizeK;
  const node = new THREE.Group(); node.name = 'ModThruster';
  const shellMat = new THREE.MeshStandardMaterial({ color: 0x6f6a5c, metalness: 0.7, roughness: 0.42 });
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.15, R * 0.78, L, 22, 1, true), shellMat);
  nozzle.rotation.x = Math.PI / 2; nozzle.position.z = -L / 2;
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.8, roughness: 0.3,
    emissive: 0x7a5a00, emissiveIntensity: 0.5 });
  const comp = new THREE.Mesh(new THREE.TorusGeometry(R * 0.6, R * 0.16, 8, 6), ringMat);
  const spin = new THREE.Group(); spin.add(comp); spin.position.z = -L * 0.18;
  const flame = new THREE.Mesh(new THREE.ConeGeometry(R * 0.78, 1, 18, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xffb04a, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  flame.rotation.x = -Math.PI / 2;
  node.add(nozzle, spin, flame);
  node.traverse((o) => { if (o.isMesh) { o.frustumCulled = false; } });
  nozzle.castShadow = true;
  return { node, spinNode: spin, flame, radius: R, length: L, bladeCount: 6,
    measured: { nozzleRadius: +R.toFixed(4), nozzleLength: +L.toFixed(4), quelle: 'erzeugt — kein Asset im Librarian' } };
}

/* ══ DIE MOD-TABELLE ════════════════════════════════════════════════════════════════════════ */
export const MODS = [
  { id: 'propeller', label: 'Propeller', anchor: 'nose', axis: 'thrust', needsAsset: true,
    asset: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KFB/Propeller%20by%20Poly%20by%20Google%20-%207IXU7duFN7t.glb',
    assetPath: 'media/3D_Assets/KFB/Propeller by Poly by Google - 7IXU7duFN7t.glb',
    build: buildPropeller, spin: { tipSpeed: 26, spinUp: 0.8, spinDown: 3.6, chug: 0.4, windmill: 0.24 },
    read: 'Zug. Die Nase zieht, der Nachlauf erzaehlt, dass der Schub weg ist.' },
  { id: 'antigrav', label: 'Anti-Grav-Turbine', anchor: 'belly', axis: 'up', needsAsset: false,
    build: buildAntiGrav, spin: { tipSpeed: 34, spinUp: 1.5, spinDown: 5.2, chug: 0.14, windmill: 0.05 },
    read: 'Schweben. Zwei Ringe gegenlaeufig — das Fahrzeug haengt, es faehrt nicht.' },
  { id: 'thruster', label: 'Schubduese', anchor: 'tail', axis: 'thrust', needsAsset: false,
    build: buildThruster, spin: { tipSpeed: 40, spinUp: 0.35, spinDown: 1.1, chug: 0.06, windmill: 0.1 },
    read: 'Boost. Die Flammenlaenge ist der Read, nicht die Farbe.' },
];
export const byModId = (id) => MODS.find((m) => m.id === id) || null;

/* ══ EIN ANGEHAENGTER MOD ═══════════════════════════════════════════════════════════════════ */
export function attachMod({ THREE, def, carrier, parent, source = null, sizeK = 1, offset = null, flip = false }) {
  const built = def.build({ THREE, source, carrier, sizeK });
  const mount = new THREE.Group(); mount.name = 'Mod:' + def.id;
  mount.add(built.node);
  parent.add(mount);

  const spinner = new Spinner(Object.assign({ radius: built.radius, blades: built.bladeCount }, def.spin));
  const state = { throttle: 0, carry: 0, lift: 0 };
  let off = Object.assign({ x: 0, y: 0, z: 0 }, offset || {});
  let dirFlip = !!flip;

  function place() {
    const a = carrier.anchors[def.anchor];
    mount.position.set(a.x + off.x, a.y + off.y, a.z + off.z);
    if (def.axis === 'thrust') {
      /* +z der Mod-Gruppe zeigt in Schubrichtung. Ist der Traeger auf -z ausgerichtet, dreht
         die Gruppe mit — die Achse folgt der Blickrichtung, nicht dem Weltraum. */
      mount.rotation.set(0, carrier.forward < 0 ? Math.PI : 0, 0);
    } else {
      mount.rotation.set(0, 0, 0);
    }
    spinner.tune({ dir: dirFlip ? -1 : 1 });
  }
  place();

  const api = {
    id: def.id, def, node: mount, built, spinner,
    get measured() { return built.measured; },
    get offset() { return Object.assign({}, off); },
    get flipped() { return dirFlip; },

    setOffset(next) { off = Object.assign(off, next || {}); place(); return api; },
    setFlip(v) { dirFlip = !!v; place(); return api; },
    setShutter(hz) { spinner.tune({ shutterHz: Math.max(0, finite(hz, 24)) }); return api; },
    setChug(v) { spinner.tune({ chug: clamp(finite(v), 0, 1) }); return api; },
    setCrankGate(v) {
      /* Das Gate einzuschalten heisst: der Motor ist AUS, bis er angeworfen wird. Ohne diese
         Zeile bleibt eine schon laufende Maschine auf »laeuft« stehen und das Gate tut nichts —
         gemessen am 19.09.: Gashebel wirkte trotz Gate, 278 U/min ohne jeden Ruck. */
      spinner.tune({ requireCrank: !!v });
      spinner.state = v ? 'aus' : 'laeuft';
      if (v) { spinner.omega = 0; spinner.kickOmega = 0; }
      return api;
    },
    setTipSpeed(v) { spinner.tune({ tipSpeed: Math.max(1, finite(v, 26)) }); return api; },

    /** Der einzige Eingang fuer Bewegung. `throttle` Schub 0…1, `carry` Fahrtwind 0…1. */
    setDrive({ throttle = 0, carry = 0 } = {}) { state.throttle = clamp(finite(throttle), 0, 1); state.carry = clamp(finite(carry), 0, 1); return api; },
    crank(s) { spinner.crank(s); return api; },
    misfire(s) { spinner.misfire(s); return api; },

    update(dt) {
      spinner.set(state.throttle, state.carry);
      const r = spinner.step(dt);
      const sn = built.spinNode;
      if (def.axis === 'thrust') sn.rotation.z = spinner.shown;
      else sn.rotation.y = spinner.shown;
      if (built.counterNode) built.counterNode.rotation.y = -spinner.shown * 0.72;

      /* Blur: die Blaetter blenden aus, wo das Auge sie ohnehin nicht mehr verfolgen kann. */
      if (built.blades && built.blades.length) {
        const vis = 1 - r.blur;
        built.blades.forEach((m) => {
          if (!m.material) return;
          if (!m.userData.__modMat) { m.material = m.material.clone(); m.userData.__modMat = true; }
          m.material.transparent = r.blur > 0.001;
          m.material.opacity = vis;
          m.visible = vis > 0.02;
        });
        if (!built.disc && r.blur > 0) {
          const g = new THREE.RingGeometry(built.radius * 0.12, built.radius, 48);
          built.disc = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xd8d2be, transparent: true,
            opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
          built.disc.rotation.set(0, 0, 0);
          built.node.add(built.disc);
        }
        if (built.disc) { built.disc.material.opacity = r.blur * 0.42; built.disc.visible = r.blur > 0.01; }
      }
      if (built.glow) built.glow.material.opacity = 0.18 + 0.5 * clamp(spinner.omega / spinner.omegaMax, 0, 1);
      if (built.flame) {
        const t = clamp(spinner.omega / spinner.omegaMax, 0, 1);
        const len = built.length * (0.35 + 3.1 * t);
        built.flame.scale.set(1, len, 1);
        built.flame.position.z = -built.length - len / 2;
        built.flame.material.opacity = t * 0.85;
        built.flame.visible = t > 0.015;
      }
      state.lift = clamp(spinner.omega / spinner.omegaMax, 0, 1);
      return r;
    },

    /** Betriebsart »treiben«: was dieser Mod an Bewegung ANBIETET. Anwenden tut es der Aufrufer. */
    offer() {
      const t = clamp(spinner.omega / spinner.omegaMax, 0, 1);
      return def.axis === 'up'
        ? { lift: t, thrust: 0, source: def.id }
        : { lift: 0, thrust: t * (dirFlip ? -1 : 1), source: def.id };
    },

    reset() { spinner.reset(); state.throttle = 0; state.carry = 0; api.update(0); return api; },
    dispose() {
      if (mount.parent) mount.parent.remove(mount);
      mount.traverse((o) => { if (o.isMesh) { if (o.geometry) o.geometry.dispose(); if (o.material && o.material.dispose) o.material.dispose(); } });
    },
  };
  api.update(0);
  return api;
}

/* ══ FLUGZUSTAND → SCHUB ════════════════════════════════════════════════════════════════════
   Georgs erste Frage: der Propeller soll zu FLUGMODUS UND TEMPO drehen. Hier steht die einzige
   Stelle, an der beides zu einer Zahl wird. Alles darin kommt aus dem Travel-Block, nichts wird
   nachgeleitet. */
export function driveFromFlight(block) {
  if (!block) return { throttle: 0, carry: 0, mode: 'ruhe' };
  const speed = clamp(finite(block.speedNorm), 0, 1);
  const climb = clamp(finite(block.climbIn), -1, 1);
  const boost = !!block.boosting;
  const throttle = clamp(Math.max(boost ? 1 : 0, speed) + Math.max(0, climb) * 0.35 + Math.min(0, climb) * 0.5, 0, 1);
  const mode = boost ? 'boost'
    : climb > 0.1 ? 'steigen'
    : climb < -0.1 ? 'sinken · Windmuehle'
    : speed > 0.05 ? 'reiseflug' : 'leerlauf';
  return { throttle, carry: speed, mode };
}
