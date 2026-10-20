/* ============================================================================
 * modefamily.js — KFB Quaternius Mode Family · POC v0 · Familie »Fernando«
 * ----------------------------------------------------------------------------
 * WAS DAS IST: ein Travel-Modus-Wechsel ASTRONAUT → MECH → SPACESHIP → MECH →
 * ASTRONAUT als EIN Vorgang. Nicht drei Ladebefehle nebeneinander.
 *
 * WAS DAS NICHT IST: ein Bewegungsrechner. Ort, Geschwindigkeit, Kurs und
 * Bewegungszustand gehören dem CARRIER und ausschliesslich ihm (E-43 aus
 * `KFB-Travel-Globe/travel/CONTRACT.md`: »Bewegung gehört carpet.js. Kein Modul
 * bringt ein Bewegungsfeld mit.«). Ein Modus darf hier KEIN `maxSpeed`,
 * `accel`, `turnRate`, `hoverHeight` mitbringen — die 13 VERBOTENEN_FELDER aus
 * `fahrzeug-vertrag.js` gelten wörtlich, und `contractGate()` unten zählt sie.
 * Was ein Modus mitbringt, ist AUSSEHEN und CLIP-TAKT, mehr nicht.
 *
 * ALLE ZAHLEN IN `MEASURED` SIND GEMESSEN, nicht aus dem Handoff abgeschrieben.
 * Das Messwerkzeug ist `tools/quaternius-family-probe.html`, es lief am
 * 2026-09-19 gegen den gepinnten Commit. Was nicht gemessen ist, steht als
 * `null` da und sagt warum.
 * ========================================================================== */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const SCHEMA = 'kfb.modefamily/0.1';
export const REPO = 'georg-doc/kayfabizarro';
export const PIN = '29aac1061bdd73736351cb856fa9f1e322478abc'; // handoff-animation-lab-29aac106.json
const raw = (p) => `https://raw.githubusercontent.com/${REPO}/${PIN}/${p.split('/').map(encodeURIComponent).join('/')}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 1 · DER BEFUND. Gemessen mit tools/quaternius-family-probe.html.
 * ────────────────────────────────────────────────────────────────────────── */
export const MEASURED = {
  probe: 'tools/quaternius-family-probe.html',
  pin: PIN,
  at: '2026-09-19',

  astronaut: {
    path: 'media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Characters/GLTF/Astronaut_FernandoTheFlamingo.gltf',
    bones: 43, skin: 'CharacterArmature', clips: 18,
    /* ⚠ Laufzeitnamen sind NICHT die Handoff-Namen: der GLTFLoader frisst den Punkt.
       Handoff sagt `Foot.L`, im Baum steht `FootL`. Dieselbe Falle wie `handslot.r`
       → `handslotr` bei KayKit (github.md, S5). Wer nach `Foot.L` sucht, findet nichts. */
    runtimeNameRule: 'GLTFLoader strips "." — Foot.L → FootL, PoleTarget.L → PoleTargetL',
    head: 'Head', neck: 'Neck',
    headBox: { verts: 1199, of: 5193, center: [0, 2.2688, -0.113], size: [0.9522, 1.0618, 1.083] },
    boneSpanBind: 2.1241, boneSpanIdle: 2.0253,
    /* Der Knochenspan endet am KOPFKNOCHEN (y 2,1217). Der HELM steht 0,57 darüber.
       »Die Box ist nicht die Silhouette« gilt hier andersherum: der Knochenspan auch nicht. */
    silhouetteIdle: { size: [3.0663, 2.7056, 1.0862], min: [-1.5332, -0.0184, -0.5768], max: [1.5332, 2.6873, 0.5093], propsHidden: ['Pistol'] },
    height: 2.7056, groundLift: 0.0184,
    /* Zwei unabhängige Leser, dieselbe Richtung. Zehenknochen gibt es bei Quaternius NICHT,
       der facehost.v1-Weg fällt also aus — deshalb der PoleTarget-Weg (IK-Ziele liegen vor
       dem Knie) und die Fussnetz-Wolke gegen den Knöchel. */
    forward: { dir: [0, 0, 1], readers: [
      { src: 'poleTarget-vs-knee', dir: [0, 0, 1], magnitude: 1.825 },
      { src: 'foot-mesh-centroid', dir: [0.0003, 0, 1], magnitude: 0.2447, points: 416 },
    ], toeBones: null },
    /* Die Pistole ist ein STATISCHES Geschwisternetz am Fingerknochen `Middle1R` — das
       KayKit-Promomuster, viertes Mal im Projekt. Für die fünf v0-Clips wird sie versteckt. */
    staticSiblings: [{ name: 'Pistol', tris: 2348, parentBone: 'Middle1R' }],
    /* Schrittlänge ist NICHT im Clip: alle Fortbewegungsclips stehen auf der Stelle
       (rootTravel 0 über alle 18). Gemessen wird deshalb der SCHRITT — grösste Trennung
       der beiden Fussknochen entlang +Z über 24 Phasen; ein Zyklus sind zwei Schritte. */
    stride: { walk: { step: 1.0835, cycle: 2.167, duration: 1.0, groundSpeed: 2.167 },
              run: { step: 0.8817, cycle: 1.7634, duration: 0.5667, groundSpeed: 3.1117 } },
    /* ⚠ Der Run-SCHRITT ist kleiner als der Walk-Schritt (0,88 gegen 1,08). Das ist kein
       Messfehler, das ist der Clip: Quaternius' Run ist knie- und nicht schrittgetrieben.
       Die TEMPI stimmen trotzdem (3,11 gegen 2,17 u/s), weil der Zyklus kürzer ist. */
  },

  mech: {
    path: 'media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Characters/GLTF/Mech_FernandoTheFlamingo.gltf',
    bones: 13, skin: 'RobotArmature', clips: 17,
    boneNames: ['Body', 'Torso', 'Chest', 'Neck', 'Head', 'UpperLegL', 'LowerLegL', 'UpperLegR', 'LowerLegR', 'PoleTargetL', 'PoleTargetR', 'FootL', 'FootR'],
    /* ⚠ KEINE ARME IM SKELETT. 13 Knochen, davon zwei IK-Ziele; Schulter, Oberarm,
       Unterarm und Hand fehlen vollständig. Die Arme des Mechs sind starre Geometrie am
       Rumpf. Folge, die man vorher wissen muss: kein Handslot, kein Prop in der Faust,
       keine Armpose — und kein Retarget eines Armclips, egal wie die Spuren heissen. */
    hasArms: false,
    head: 'Head', neck: 'Neck',
    headBox: { verts: 803, of: 4811, center: [0, 3.2809, 0.4263], size: [0.5904, 0.5389, 0.47] },
    boneSpanBind: 3.2873, boneSpanIdle: 3.177,
    silhouetteIdle: { size: [2.706, 3.4754, 2.1881], min: [-1.3319, -0.0009, -0.8789], max: [1.3741, 3.4746, 1.3093] },
    height: 3.4754, groundLift: 0.0009,
    /* ⚠ ZWEI LESER WIDERSPRECHEN SICH — und der Widerspruch wird ENTSCHIEDEN, nicht geglättet.
       PoleTarget-gegen-Knie sagt +Z mit 4,92 u Betrag. Die Fussnetz-Wolke sagt −Z mit
       0,0808 u Betrag über 64 Punkte. 0,0808 sind 2,3 % der Figurhöhe (3,475) — bei einem
       blockigen, fast spiegelsymmetrischen Mechfuss ist das Rauschen, keine Richtung.
       Zum Vergleich: derselbe Leser liefert beim Astronauten 0,2447 = 9,0 % der Höhe.
       Dritter, unabhängiger Beleg: die Kopfbox des Mechs sitzt +0,4263 vor dem Hals, also
       0,91 ihrer eigenen Tiefe nach VORN — eine Kanzel neigt sich nach vorn, nicht nach hinten.
       Vierter: `KFB-Travel-Globe/travel/globe-v13/mech-station.js` hat für dieselbe Modellreihe
       unabhängig +Z gemessen. Drei gegen einen, und der eine nennt seinen Betrag. */
    forward: { dir: [0, 0, 1], readers: [
      { src: 'poleTarget-vs-knee', dir: [0, 0, 1], magnitude: 4.9199, verdict: 'accepted' },
      { src: 'foot-mesh-centroid', dir: [0, 0, -1], magnitude: 0.0808, points: 64, verdict: 'rejected — 2.3 % of figure height is noise on a symmetric block foot' },
      { src: 'head-canopy-offset', dir: [0, 0, 1], magnitude: 0.4263, verdict: 'supporting' },
      { src: 'mech-station.js (Travel Globe)', dir: [0, 0, 1], magnitude: null, verdict: 'supporting — independent source' },
    ] },
    staticSiblings: [],
    stride: { walk: { step: 3.4618, cycle: 6.9237, duration: 0.8333, groundSpeed: 8.3085 },
              run: { step: 5.1674, cycle: 10.3349, duration: 0.8333, groundSpeed: 12.4019 } },
  },

  ship: {
    path: 'media/3D_Assets/KFB/Spaceship A by Quaternius - u105mYHLHU.glb',
    skins: 0, animations: 0, meshes: [{ name: 'Spaceship_BarbaraTheBee', tris: 6208 }],
    /* ⚠ DAS SCHIFF TRÄGT BARBARAS NAMEN. »Spaceship A« ist kein Fernando-Schiff und kein
       Familienmitglied — es ist EIN Rumpf für alle vier. Das ist der Grund, warum der
       Identity-Adapter für das Schiff etwas anderes tun muss als für Mech und Astronaut:
       dort liefert der Pack die Identität selbst (Astronaut_Fernando…, Mech_Fernando…),
       hier nicht. */
    familyOwned: false,
    bbox: { size: [7.3369, 5.7034, 4.9578], center: [0, 0.6701, -0.6153], min: [-3.6685, -2.1816, -3.0942], max: [3.6685, 3.5218, 1.8636] },
    /* ⚠ FEHLER DER ERSTEN PROBEFASSUNG, benannt statt weggeputzt: sie nahm die LÄNGSTE
       Achse für die Fahrtrichtung. Das ist hier x (7,337) — und x ist die SPANNWEITE.
       Das x-Profil ist EXAKT spiegelsymmetrisch (Asymmetriemass 0,0000), das z-Profil
       nicht (1,1707). Die Achse, die sich spiegelt, kann die Nase nicht tragen. */
    forward: { dir: [0, 0, 1], axis: 'z', asymmetryX: 0, asymmetryZ: 1.1707,
      profileZ: [4.119, 3.9783, 3.6545, 3.4894, 3.2598, 3.0345, 2.8414, 2.6145, 2.5771, 2.4665, 2.2874, 1.7248] },
    /* Luke = höchster Punkt in einem Zylinder (r 0,917) um die Rumpfmitte. Dort verschwindet
       der Mech, nicht in der Flügelspitze. */
    hatch: { local: [0, 3.5218, -0.6153], radius: 0.9171 },
    groundLift: 2.1816, // der Pivot liegt IM Rumpf, nicht am Boden
    height: 5.7034,
  },

  ratios: {
    mechOverAstronaut_bones: 1.5687,
    mechOverAstronaut_silhouette: 1.2845,
    shipSpanOverMechHeight: 2.1111,
    headBoxVolumeRatio_mechOverAstronaut: 0.1366,
  },
};

/* ──────────────────────────────────────────────────────────────────────────
 * 2 · DAS CLIP-WÖRTERBUCH. Astronaut und Mech meinen dasselbe und sagen es
 *     verschieden. Ohne diese Tabelle heisst »der Roundtrip funktioniert«
 *     in Wahrheit »an drei Stellen steht ein Clipname hart im Code«.
 *     Alle acht Rollen sind in BEIDEN Modi nativ belegt — nichts retargetet.
 * ────────────────────────────────────────────────────────────────────────── */
export const CLIP_ROLES = {
  astronaut: { idle: 'Idle', walk: 'Walk', run: 'Run', jump: 'Jump', air: 'Jump_Idle', land: 'Jump_Land', wave: 'Wave', enter: 'Duck', cheer: 'Yes' },
  mech:      { idle: 'Idle', walk: 'Walk', run: 'Run', jump: 'Jump', air: 'Jump_NoHeight', land: 'Jump_Landing', wave: 'Hello', enter: 'Pickup', cheer: 'Dance' },
  spaceship: { idle: null, walk: null, run: null, jump: null, air: null, land: null, wave: null, enter: null, cheer: null },
};

/* ──────────────────────────────────────────────────────────────────────────
 * 3 · DER CARRIER. EIN Eigentümer für Ort, Tempo, Kurs, Bewegungszustand und
 *     Sitzung. Die Modi lesen ihn und schreiben nie hinein.
 *     Die Tempogrenze je Modus steht HIER, nicht im Modus — sonst wäre sie
 *     ein `maxSpeed` im Fahrzeug und damit ein verbotenes Feld.
 * ────────────────────────────────────────────────────────────────────────── */
const SPEED_BAND = {   // Welt-u/s · gehört dem Carrier, abgeleitet aus den GEMESSENEN Clip-Tempi
  astronaut: { max: MEASURED.astronaut.stride.run.groundSpeed, accel: 9, turn: 3.2, runAbove: Math.sqrt(2.167 * 3.1117) },
  mech:      { max: MEASURED.mech.stride.run.groundSpeed,      accel: 14, turn: 1.8, runAbove: Math.sqrt(8.3085 * 12.4019) },
  spaceship: { max: 34, accel: 16, turn: 1.1, runAbove: Infinity },
};

export function createCarrier(THREE_) {
  const T = THREE_;
  const s = {
    position: new T.Vector3(0, 0, 0),
    velocity: new T.Vector3(0, 0, 0),
    heading: 0,          // rad, 0 = +Z (die gemessene Blickachse aller drei Quellen)
    speed: 0,
    altitude: 0,
    grounded: true,
    moveState: 'idle',   // idle · walk · run · air · flight
    mode: 'astronaut',
    session: { startedAt: Date.now(), distance: 0, modeChanges: 0, visited: [], jumps: 0 },
  };
  const want = new T.Vector3();
  let jumpV = 0;

  return {
    state: s,
    band: (mode) => SPEED_BAND[mode],
    /** Eine Eingabe je Bild. Der Modus liefert NICHTS davon. */
    step(dt, input, mode) {
      const B = SPEED_BAND[mode] || SPEED_BAND.astronaut;
      if (input.turn) s.heading -= input.turn * B.turn * dt;
      const fwd = new T.Vector3(Math.sin(s.heading), 0, Math.cos(s.heading));
      want.copy(fwd).multiplyScalar((input.thrust || 0) * B.max);
      s.velocity.x += (want.x - s.velocity.x) * Math.min(1, B.accel * dt);
      s.velocity.z += (want.z - s.velocity.z) * Math.min(1, B.accel * dt);
      s.speed = Math.hypot(s.velocity.x, s.velocity.z);

      if (mode === 'spaceship') {
        const target = input.climb != null ? input.climb : s.altitude;
        s.altitude += (target - s.altitude) * Math.min(1, 1.6 * dt);
        s.grounded = false; s.moveState = 'flight';
      } else {
        if (input.jump && s.grounded) { jumpV = 7.2; s.grounded = false; s.session.jumps++; }
        if (!s.grounded) { jumpV -= 22 * dt; s.altitude += jumpV * dt; if (s.altitude <= 0) { s.altitude = 0; jumpV = 0; s.grounded = true; } }
        s.moveState = !s.grounded ? 'air' : s.speed < 0.08 ? 'idle' : s.speed > B.runAbove ? 'run' : 'walk';
      }
      const dx = s.velocity.x * dt, dz = s.velocity.z * dt;
      s.position.x += dx; s.position.z += dz; s.position.y = s.altitude;
      s.session.distance += Math.hypot(dx, dz);
      return s;
    },
    /** Was ein Moduswechsel ERHALTEN muss. Der Beweis ist der Vergleich, nicht die Zusage. */
    snapshot() {
      return { position: s.position.toArray().map((n) => +n.toFixed(4)), velocity: s.velocity.toArray().map((n) => +n.toFixed(4)),
        heading: +s.heading.toFixed(4), speed: +s.speed.toFixed(4), altitude: +s.altitude.toFixed(4),
        moveState: s.moveState, grounded: s.grounded,
        session: { distance: +s.session.distance.toFixed(3), modeChanges: s.session.modeChanges, jumps: s.session.jumps, visited: s.session.visited.slice() } };
    },
  };
}

/** Vergleicht zwei Schnappschüsse und sagt, was NICHT überlebt hat.
 *
 *  ⚠ ZWEITE FASSUNG, und die erste hatte genau das Loch, gegen das dieses Projekt seit S28
 *  schreibt: sie meldete beim Start und bei der Landung »position, moveState lost« — und
 *  beides war richtig gemessen und trotzdem kein Verlust. Ein Start SOLL die Höhe ändern,
 *  eine Landung auch, und `flight` ist der Bewegungszustand, den das Schiff mitbringt.
 *  *Ein Tor, das eine erklärte Änderung als Fehler meldet, wird beim nächsten Mal
 *  abgeschaltet — und dann meldet es auch die echten nicht mehr.*
 *  Die Reparatur ist NICHT eine weichere Schwelle, sondern eine ERKLÄRUNG: jeder Übergang
 *  sagt in `mutates`, welche Grössen er anfassen darf. Alles andere bleibt hart. Was ein
 *  Übergang ändert, ohne es erklärt zu haben, ist weiter ein ✗.
 *  Und die Höhe wird jetzt GETRENNT von x/z geprüft — vorher steckte sie in demselben
 *  Vektor, also konnte ein erlaubter Steigflug den Ortsbeweis mit abräumen. */
export function continuityGate(before, after, opts = {}) {
  const allowed = new Set(opts.allowed || []);
  const tol = opts.tol == null ? 1e-3 : opts.tol;
  const rows = [];
  const put = (k, a, b, ok) => rows.push({ k, before: a, after: b, ok: ok || allowed.has(k), declared: !ok && allowed.has(k) });
  const num = (k, a, b, t = tol) => put(k, a, b, Math.abs(a - b) <= t);
  put('position.xz', [before.position[0], before.position[2]], [after.position[0], after.position[2]],
      Math.abs(before.position[0] - after.position[0]) <= tol && Math.abs(before.position[2] - after.position[2]) <= tol);
  num('altitude', before.altitude, after.altitude);
  put('velocity.xz', [before.velocity[0], before.velocity[2]], [after.velocity[0], after.velocity[2]],
      Math.abs(before.velocity[0] - after.velocity[0]) <= tol && Math.abs(before.velocity[2] - after.velocity[2]) <= tol);
  num('heading', before.heading, after.heading);
  num('speed', before.speed, after.speed);
  put('moveState', before.moveState, after.moveState, before.moveState === after.moveState);
  num('session.distance', before.session.distance, after.session.distance, 0.05);
  put('session.jumps', before.session.jumps, after.session.jumps, before.session.jumps === after.session.jumps);
  put('session.visited', before.session.visited.length, after.session.visited.length, after.session.visited.length >= before.session.visited.length);
  const bad = rows.filter((r) => !r.ok);
  const dec = rows.filter((r) => r.declared);
  return { ok: bad.length === 0, rows,
    text: (bad.length ? '✗ ' + bad.map((r) => r.k).join(', ') + ' lost'
      : '✓ ' + (rows.length - dec.length) + '/' + rows.length + ' carried'
        + (dec.length ? ' · ' + dec.length + ' changed as declared (' + dec.map((r) => r.k).join(', ') + ')' : '')) };
}

/* ──────────────────────────────────────────────────────────────────────────
 * 4 · DIE ÜBERGÄNGE ALS TABELLE. Vier Einträge, paarweise gespiegelt.
 *     Kein Mesh-Morph: die Quellen liefern keinen, also gibt es keinen.
 *     Was es gibt: Anticipation · Occlusion · Scale-Beat · Licht/Rauch · SFX-Haken.
 *     `swapAt` ist der Bruchteil der Occlusion-Phase, an dem getauscht wird —
 *     der Tausch liegt per Bauart im Maximum der Verdeckung, nicht am Rand.
 * ────────────────────────────────────────────────────────────────────────── */
export const TRANSITIONS = {
  astronautToMech: { from: 'astronaut', to: 'mech', mirror: 'mechToAstronaut', gate: 'mech-station',
    /* `mutates` ist die ERKLÄRUNG an das Erhaltungstor: was hier steht, darf sich ändern,
       alles andere muss den Wechsel überleben. Eine leere Liste ist die strengste Zusage. */
    mutates: [],
    phases: [
      { n: 'anticipate', t: 0.55, clip: ['from', 'enter'], camera: 'close', sfx: 'mode.approach' },
      { n: 'occlude', t: 0.40, puff: 1.0, swapAt: 0.55, camera: 'close', sfx: 'mode.swap' },
      { n: 'settle', t: 0.60, clip: ['to', 'land'], beat: { squash: 0.84, over: 1.06 }, camera: 'mid', sfx: 'mech.stomp' },
    ] },
  mechToShip: { from: 'mech', to: 'spaceship', mirror: 'shipToMech', gate: 'launch-pad',
    mutates: ['altitude', 'moveState'],   // ein Start, der die Höhe nicht ändert, ist keiner
    phases: [
      { n: 'anticipate', t: 0.50, clip: ['from', 'jump'], camera: 'mid', sfx: 'launch.charge' },
      { n: 'occlude', t: 0.45, puff: 1.6, swapAt: 0.5, camera: 'mid', sfx: 'launch.ignite', light: 1 },
      { n: 'settle', t: 0.85, climb: 6.5, beat: { squash: 1.10, over: 1.0 }, camera: 'wide', sfx: 'launch.rise' },
    ] },
  shipToMech: { from: 'spaceship', to: 'mech', mirror: 'mechToShip', gate: 'launch-pad',
    mutates: ['altitude', 'moveState'],
    phases: [
      { n: 'anticipate', t: 0.70, climb: 0, camera: 'wide', sfx: 'land.descend' },
      { n: 'occlude', t: 0.40, puff: 1.6, swapAt: 0.5, camera: 'mid', sfx: 'land.dust', light: 0.6 },
      { n: 'settle', t: 0.60, clip: ['to', 'land'], beat: { squash: 0.80, over: 1.08 }, camera: 'mid', sfx: 'mech.stomp' },
    ] },
  mechToAstronaut: { from: 'mech', to: 'astronaut', mirror: 'astronautToMech', gate: 'mech-station',
    mutates: [],
    phases: [
      { n: 'anticipate', t: 0.60, clip: ['from', 'enter'], camera: 'mid', sfx: 'mode.dismount' },
      { n: 'occlude', t: 0.40, puff: 0.9, swapAt: 0.55, camera: 'close', sfx: 'mode.swap' },
      { n: 'settle', t: 0.70, clip: ['to', 'wave'], beat: { squash: 0.90, over: 1.04 }, camera: 'close', sfx: 'astro.land' },
    ] },
};

/** Der Ring ASTRONAUT → MECH → SPACESHIP → MECH → ASTRONAUT, als Nachbarschaft. */
export const CHAIN = ['astronaut', 'mech', 'spaceship'];
export function nextOf(mode, dir) {
  const i = CHAIN.indexOf(mode) + dir;
  return CHAIN[Math.max(0, Math.min(CHAIN.length - 1, i))];
}
export function transitionFor(from, to) {
  return Object.entries(TRANSITIONS).find(([, t]) => t.from === from && t.to === to) || null;
}

/* ──────────────────────────────────────────────────────────────────────────
 * 5 · DAS TOR GEGEN DEN FAHRZEUGVERTRAG. Ein Vertrag, der nur sagt was erlaubt
 *     ist, wird durch Anbauten ausgehöhlt; einer, der Verbote ZÄHLT, meldet den
 *     Anbau. Wörtlich die 13 Namen aus fahrzeug-vertrag.js.
 * ────────────────────────────────────────────────────────────────────────── */
export const VERBOTENE_FELDER = ['tempo', 'maxSpeed', 'minSpeed', 'accel', 'traegheit', 'inertia',
  'kurvenrate', 'turnRate', 'turnMult', 'traction', 'hoehenband', 'hoverHeight', 'boostHeight'];

export function contractGate(recipe) {
  const hits = [];
  const scan = (o, path) => {
    if (!o || typeof o !== 'object') return;
    for (const k of Object.keys(o)) {
      if (VERBOTENE_FELDER.includes(k)) hits.push((path ? path + '.' : '') + k);
      if (o[k] && typeof o[k] === 'object') scan(o[k], (path ? path + '.' : '') + k);
    }
  };
  for (const m of ['astronaut', 'mech', 'spaceship']) scan(recipe[m], m);
  scan(recipe.identityAdapter, 'identityAdapter');
  return { ok: hits.length === 0, hits,
    text: (hits.length ? '✗ ' + hits.join(', ') : '✓ 0 of ' + VERBOTENE_FELDER.length + ' forbidden physics names in the recipe') };
}

/* ──────────────────────────────────────────────────────────────────────────
 * 6 · DIE BAUSTELLE. Laden, messen, Modi bereitstellen.
 * ────────────────────────────────────────────────────────────────────────── */
const loader = new GLTFLoader();
const cache = new Map();
const load = (p) => { if (!cache.has(p)) cache.set(p, loader.loadAsync(raw(p))); return cache.get(p); };

/** Bone-Span in Welt-u ohne PoleTarget*. Hausregel: nie Box3 auf einem SkinnedMesh. */
export function boneSpan(root) {
  let min = Infinity, max = -Infinity, n = 0;
  root.updateWorldMatrix(true, true);
  const p = new THREE.Vector3();
  root.traverse((o) => { if (!o.isBone || /PoleTarget/i.test(o.name)) return; o.getWorldPosition(p); n++; if (p.y < min) min = p.y; if (p.y > max) max = p.y; });
  return n ? { height: max - min, min, max, bones: n } : null;
}

function makeActor(gltf, roles, hideStatic) {
  const root = gltf.scene;
  const hidden = [];
  if (hideStatic) root.traverse((m) => { if (m.isMesh && !m.isSkinnedMesh) { m.visible = false; hidden.push(m.name); } });
  root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; } });
  /* frustumCulled aus: bei SkinnedMeshes mit boundingSphere r=0 verschwindet die Figur
     sonst je nach Kamerawinkel. Recon-Falle aus kfb-mech-combat.js, hier vorbeugend. */
  const mixer = new THREE.AnimationMixer(root);
  const byName = new Map(gltf.animations.map((c) => [c.name, c]));
  const acts = {};
  for (const [role, name] of Object.entries(roles)) {
    if (!name) continue;
    const c = byName.get(name);
    if (c) acts[role] = mixer.clipAction(c);
  }
  let current = '';
  function play(role, fade = 0.2, once = false) {
    const a = acts[role];
    if (!a || current === role) return current;
    const from = acts[current];
    a.reset();
    a.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, once ? 1 : Infinity);
    a.clampWhenFinished = once;
    a.fadeIn(fade).play();
    if (from) from.fadeOut(fade);
    current = role;
    return role;
  }
  return { root, mixer, acts, play, roles, hiddenStatic: hidden,
    get clip() { return current; },
    forceClip(role) { current = role; },
    update(dt, timeScale) { mixer.timeScale = timeScale == null ? 1 : timeScale; mixer.update(dt); } };
}

export async function buildFamily(familyId = 'fernando') {
  const F = FAMILIES[familyId];
  if (!F) throw new Error('unknown family: ' + familyId);
  const [ga, gm, gs] = await Promise.all([load(F.astronaut.path), load(F.mech.path), load(F.spaceship.path)]);

  const astronaut = makeActor(ga, CLIP_ROLES.astronaut, true);
  const mech = makeActor(gm, CLIP_ROLES.mech, false);
  const shipRoot = gs.scene;
  shipRoot.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; } });

  /* Am GEBAUTEN Baum nachmessen, nicht der Tabelle glauben. Ein Befund, der nur aus
     `MEASURED` kommt, ist ein Zitat; einer von hier ist eine Messung. */
  astronaut.mixer.update(0.5); mech.mixer.update(0.5);
  const built = {
    astronautSpan: boneSpan(astronaut.root),
    mechSpan: boneSpan(mech.root),
    shipBox: new THREE.Box3().setFromObject(shipRoot),
    astronautClips: ga.animations.length, mechClips: gm.animations.length, shipClips: gs.animations.length,
    shipSkins: (() => { let n = 0; shipRoot.traverse((o) => { if (o.isSkinnedMesh) n++; }); return n; })(),
  };

  const modes = {
    astronaut: { id: 'astronaut', actor: astronaut, node: astronaut.root, kind: 'skinned',
      groundLift: MEASURED.astronaut.groundLift, height: MEASURED.astronaut.height,
      stride: MEASURED.astronaut.stride, forward: MEASURED.astronaut.forward.dir },
    mech: { id: 'mech', actor: mech, node: mech.root, kind: 'skinned',
      groundLift: MEASURED.mech.groundLift, height: MEASURED.mech.height,
      stride: MEASURED.mech.stride, forward: MEASURED.mech.forward.dir },
    spaceship: { id: 'spaceship', actor: null, node: shipRoot, kind: 'static',
      groundLift: MEASURED.ship.groundLift, height: MEASURED.ship.height,
      stride: null, forward: MEASURED.ship.forward.dir },
  };
  return { familyId, modes, built, gltf: { astronaut: ga, mech: gm, ship: gs } };
}

/** Clip-Takt aus dem Carrier-Tempo. `timeScale = v · duration / cycle` — der Zyklus ist
 *  GEMESSEN (Fusstrennung × 2), weil die Clips auf der Stelle stehen. */
export function clipTimeScale(mode, speed) {
  if (!mode.stride) return 1;
  const band = mode.actor && mode.actor.clip === 'run' ? mode.stride.run : mode.stride.walk;
  const natural = band.cycle / band.duration;
  return Math.max(0.45, Math.min(2.6, speed / natural));
}

/* ──────────────────────────────────────────────────────────────────────────
 * 8 · DAS FAMILY RECIPE. Fällt aus den GEMESSENEN Werten heraus, nicht aus
 *     einer zweiten Tabelle — sonst hätte »was ist gemessen« zwei Wahrheiten.
 *     Was nicht gemessen ist, steht als null oder als benannte Lücke drin.
 * ────────────────────────────────────────────────────────────────────────── */
export function buildRecipe(stage) {
  const M = MEASURED;
  const id = (stage && stage.fam && stage.fam.familyId) || 'fernando';
  const trs = (k) => {
    const T = TRANSITIONS[k];
    return T.phases.map((p) => p.n + ' ' + p.t + 's'
      + (p.clip ? ' clip:' + p.clip[0] + '.' + p.clip[1] : '')
      + (p.puff ? ' puff×' + p.puff + ' swap@' + p.swapAt : '')
      + (p.climb != null ? ' climb→' + p.climb : '')
      + (p.beat ? ' beat ' + p.beat.squash + '/' + p.beat.over : '')
      + ' cam:' + (p.camera || '—')).join(' → ');
  };
  return {
    schema: 'kfb.mode-family/0.1', familyId: id, status: 'candidate-only',
    source: { repo: REPO, commit: PIN, probe: M.probe, measuredAt: M.at,
      handoff: 'tools/KFB-ToolBox/_inbox/KFB Cartoon Vehicle Deformer Lab v2/WSA_Vehicles_v2_2026-09-18/data/handoff-animation-lab-29aac106.json',
      contract: 'georg-doc/KFB-Travel-Globe travel/CONTRACT.md + travel/globe-v13/fahrzeug-vertrag.js' },
    astronaut: {
      path: M.astronaut.path, kind: 'skinned', bones: M.astronaut.bones, skin: M.astronaut.skin, clips: M.astronaut.clips,
      forward: M.astronaut.forward.dir, forwardReadBy: M.astronaut.forward.readers.map((r) => r.src),
      height: M.astronaut.height, groundLift: M.astronaut.groundLift, headBox: M.astronaut.headBox,
      clipRoles: CLIP_ROLES.astronaut, v0Clips: ['Idle', 'Walk', 'Run', 'Jump', 'Wave'],
      retargeted: 0, retargetNote: 'native clips only — no KayKit clip retargeted into this slice',
      stride: M.astronaut.stride, hideStatic: M.astronaut.staticSiblings,
      headHost: { bone: M.astronaut.head, neck: M.astronaut.neck, mounted: true, graftApplied: false },
    },
    mech: {
      path: M.mech.path, kind: 'skinned', bones: M.mech.bones, skin: M.mech.skin, clips: M.mech.clips,
      hasArms: false, boneNames: M.mech.boneNames,
      forward: M.mech.forward.dir, forwardReadBy: M.mech.forward.readers.map((r) => r.src + ':' + r.verdict),
      height: M.mech.height, groundLift: M.mech.groundLift, headBox: M.mech.headBox,
      clipRoles: CLIP_ROLES.mech, retargeted: 0, stride: M.mech.stride,
      headHost: { bone: M.mech.head, neck: M.mech.neck, mounted: false, graftApplied: false,
        refusedBecause: 'head box is 0.137 of the astronaut head box by volume; an identity-readable head would be 2.06× the host and overhang 0.316 u per side' },
      note: 'no KayKit body built into the mech — the pack ships a per-character mech and that is the identity',
    },
    spaceship: {
      path: M.ship.path, kind: 'static', skins: 0, clips: 0, fakeSkeleton: false,
      forward: M.ship.forward.dir, forwardReadBy: ['slice-profile asymmetry: x 0.0000 (mirror → wingspan), z 1.1707 (→ nose)'],
      bbox: M.ship.bbox, hatch: M.ship.hatch, groundLift: M.ship.groundLift, height: M.ship.height,
      familyOwned: false, meshName: M.ship.meshes[0].name,
      clipRoles: null, stride: null,
      role: 'static carrier — consumes the same travel carrier state as the walking modes',
    },
    identityAdapter: {
      carriedBy: {
        astronaut: 'the asset itself (Astronaut_FernandoTheFlamingo)',
        mech: 'the asset itself (Mech_FernandoTheFlamingo)',
        spaceship: 'accent light + tint only — the mesh is Spaceship_BarbaraTheBee and is shared by all four families',
      },
      accentTint: '#' + ((FAMILIES[id] && FAMILIES[id].tint) || 0).toString(16).padStart(6, '0'),
      faceHost: { module: 'lib/frizzlegraft/facehost.v1.js', builtOn: 'astronaut', bone: M.astronaut.head, reused: true },
      headGraft: { module: 'lib/frizzlegraft/headgraft.v1.js', donor: 'media/frizzlebob/FrizzleBob_Yellow.gltf', applied: false,
        astronautBlocker: 'the host head is a HELMET (0.95 × 1.06 × 1.08, near-cubic). A graft removes it and changes the fiction, not just the face — a decision, not a measurement.',
        mechBlocker: 'host head box too small by a measured factor of 2.06' },
      forwardAxisRule: 'Quaternius ships no toe bones, so facehost.v1 falls back to +z. Measure with PoleTarget-vs-knee instead, state the magnitude, and reject any reader below ~5 % of figure height.',
      runtimeNameRule: M.astronaut.runtimeNameRule,
    },
    carrier: {
      owner: 'lib/modefamily.js createCarrier()',
      preserves: ['position.xz', 'velocity.xz', 'heading', 'speed', 'moveState', 'session.distance', 'session.jumps', 'session.visited'],
      frozenDuringTransition: true,
      frozenBecause: 'inputs are locked for the beat; a carrier that keeps integrating would decay the velocity the brief asks to preserve',
      speedBandsOwnedBy: 'the carrier, keyed by mode — a mode that brought its own maxSpeed would be a forbidden field',
      contract: 'travel/CONTRACT.md E-43 — a mode brings no movement field',
      forbiddenFieldsChecked: VERBOTENE_FELDER.length,
    },
    transitions: {
      astronautToMech: trs('astronautToMech'),
      mechToShip: trs('mechToShip'),
      shipToMech: trs('shipToMech'),
      mechToAstronaut: trs('mechToAstronaut'),
      mutations: Object.fromEntries(Object.entries(TRANSITIONS).map(([k, t]) => [k, t.mutates])),
      rule: 'no literal mesh morph — none of the three sources ships one. Every switch is anticipation + occlusion + a scale beat, and every entry has a mirror.',
      sfxHooks: ['mode.approach', 'mode.swap', 'mode.dismount', 'mech.stomp', 'launch.charge', 'launch.ignite', 'launch.rise', 'land.descend', 'land.dust', 'astro.land'],
    },
    acceptance: {
      how: 'stage.autoRoundtrip({simulated:true}) — deterministic slices, no wall clock, runs in a hidden window too',
      roundtrip: 'astronaut → mech → spaceship → mech → astronaut, 4 mode changes, ends where it started',
      atGameplaySpeed: 'switch taken at the measured astronaut Run speed (3.1117 u/s): 9/9 carried, and the mech then accelerates into its own measured Run band (12.4019 u/s) on the same heading',
    },
    openPoints: [
      'Head graft not applied anywhere. Astronaut blocked by the helmet fiction (a decision for Georg), mech blocked by size (a measurement). Neither is guessed.',
      'schrittLaenge is derived from FOOT SEPARATION, not from root travel — every locomotion clip is in place (rootTravel 0). It measures the step, not an authored ground speed.',
      'Barbara / Finn / Rae are listed by path only. Not measured, not built. Re-run the probe per family before promising anything; their mechs may differ.',
      'SFX hooks fire as names. No audio in v0.',
      'The ship has no landing gear contact measurement — it is placed by bbox groundLift (2.1816), not by a measured foot.',
      'No licence check on the Quaternius pack. Ownership is not release.',
    ],
  };
}

/* ──────────────────────────────────────────────────────────────────────────
 * 7 · DIE FAMILIEN. Nur `fernando` ist in v0 gebaut; die drei anderen stehen
 *     als Pfade da, weil sie bestehen — nicht als Zusage, dass sie gemessen sind.
 * ────────────────────────────────────────────────────────────────────────── */
const C = 'media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Characters/GLTF/';
const SHIP = 'media/3D_Assets/KFB/Spaceship A by Quaternius - u105mYHLHU.glb';
export const FAMILIES = {
  fernando: { name: 'Fernando the Flamingo', measured: true, tint: 0xf0567a,
    astronaut: { path: C + 'Astronaut_FernandoTheFlamingo.gltf' }, mech: { path: C + 'Mech_FernandoTheFlamingo.gltf' }, spaceship: { path: SHIP } },
  barbara: { name: 'Barbara the Bee', measured: false, tint: 0xf2c93c,
    astronaut: { path: C + 'Astronaut_BarbaraTheBee.gltf' }, mech: { path: C + 'Mech_BarbaraTheBee.gltf' }, spaceship: { path: SHIP } },
  finn: { name: 'Finn the Frog', measured: false, tint: 0x7bc35e,
    astronaut: { path: C + 'Astronaut_FinnTheFrog.gltf' }, mech: { path: C + 'Mech_FinnTheFrog.gltf' }, spaceship: { path: SHIP } },
  rae: { name: 'Rae the Red Panda', measured: false, tint: 0xe0854a,
    astronaut: { path: C + 'Astronaut_RaeTheRedPanda.gltf' }, mech: { path: C + 'Mech_RaeTheRedPanda.gltf' }, spaceship: { path: SHIP } },
};
