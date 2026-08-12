// ============================================================================
// prop-scatter.js — KFB Travel v16 · Slice L3 · Kenney-Props statt grauer Blöcke · ps-v1.0
// ----------------------------------------------------------------------------
// Auftrag Georg (12.8.): „die grauen Platzhalter-Blöcke auf den Voxeln durch Kenney-3D-Assets
// mit leichtem Cartoon-Deformer (zufällig / oder in Biome-Logik später) einbauen, also Bäume und
// andere passende Props & Assets."
//
// ── Was schon da war, und deshalb nicht neu gebaut wurde ────────────────────
// **`asset-repo.json` (Projektwurzel, 328 kB, 986 Assets).** Ein aufgelöster Index mit `ghUrl`
// pro Asset, `size`, `fp` (Grundfläche), `role`, `naturalScale`. Der `KFB Cartoon-Verbieger`
// benutzt ihn bereits (`this.repo = await fetch('./asset-repo.json')`). Dieses Modul liest
// denselben Index — **keine fest verdrahteten URLs.** Der Grund ist nicht Bequemlichkeit: die
// Pfade sind eine Falle. `kenney_nature-kit` liegt im Repo unter `Models/GLTF format/`, und
// dieser Ordner enthält **`.glb`**-Dateien. Wer das selbst zusammensetzt, baut den Fehler nach,
// den `github_status.json` und das Abgleich-Protokoll vom 23.7. schon einmal aufgeräumt haben.
//
// **`kfb-cartoon-deform.js` (Projektwurzel).** Der Verbieger, seit §1 ungenutzt. Er notiert die
// Lücke selbst: *„Für echtes Instanced-Scatter gehören die Werte statt in Uniforms in
// Instanced-Attribute — dieselbe Mathematik, anderer Träger."* Genau das ist hier gebaut: die
// Mathematik ist von dort übernommen (objekt-normiert, am Fuß verankert, t² Bogen, t Neigung,
// Verjüngung, Verdrehung, Normalen numerisch nachgezogen), der Träger ist `aKc1`/`aKc2`.
// Die Datei selbst bleibt unangetastet — sie ist die Referenz, an der der Verbieger-Lab abgestimmt
// wird, und ein geteiltes Modul umzubauen, um es an einer Stelle zu benutzen, ist der falsche Weg.
//
// ── Vier Entscheidungen ─────────────────────────────────────────────────────
// (1) **EIN InstancedMesh pro Modell-Teil, GLOBAL — nicht pro Chunk.** Die grauen Blöcke waren ein
//     Streu-Mesh je Chunk, also 81 Draw-Calls. Bei 9 Modellen × 1–2 Teilen sind es unter 20,
//     unabhängig von der Chunk-Zahl. Der Umbau macht das Bild reicher UND die Liste kürzer.
// (2) **Die Standorte gehören dem Terrain** (`terrain.propSites`), nicht diesem Modul. Wer den
//     Boden zweimal rechnet, hat zwei Höhen — dieselbe Regel wie bei Wasser (Farbe, keine Ebene)
//     und bei den Farbwelten (nur Uniforms, kein Rebake). Deshalb kennt dieses Modul weder
//     Höhenfeld noch Stufung; es bekommt Orte und stellt Dinge hin.
// (3) **Biom-Logik über den DATEINAMEN.** Der Index hat von jedem Baum drei Fassungen:
//     `tree_default`, `tree_default_dark`, `tree_default_fall`. Damit ist „Herbstwald" oder
//     „Nachtwald" kein System, sondern ein Suffix — Georgs „oder in Biome-Logik später" ist damit
//     fast geschenkt und bleibt trotzdem abschaltbar.
// (4) **Die grauen Blöcke bleiben als Fallback, nicht als Altlast.** Laden die Assets nicht
//     (offline, RAW blockiert), streut weiter das, was ohne Netz funktioniert. `setPropsOwn(true)`
//     wird erst gezogen, wenn wirklich Modelle im Speicher sind.
//
// Nichts wird ins Projekt kopiert: RAW-URL zur Laufzeit (Workspace-Regel §A3.1).
// ============================================================================

import { MOTION_GLSL, PALETTE_GLSL } from './voxel-terrain.js';

export const PS_VERSION = 'ps-v1.1';

/**
 * Das Set. **Bewusst klein** (9 Grundmodelle): bei 42 u/s entscheidet die Zahl der Draw-Calls, ob
 * die Welt lebt oder ruckelt, und ein Set, das man nicht überblickt, kann man nicht abstimmen.
 *
 * `kind` bestimmt die Zielgröße und ob gebogen wird. `w` ist das Grundgewicht; `bw` überschreibt
 * es je Biom (fehlt es, gilt `w`). `vary` erlaubt die `_dark`/`_fall`-Fassungen.
 */
export const PROP_SET = [
  // Bäume — verschiedene Silhouetten, nicht verschiedene Bäume. Eine hohe schlanke Kiefer neben
  // einem breiten Laubbaum liest sich als Wald; sechs Laubbäume lesen sich als Tapete.
  { base: 'tree_default',       kind: 'tree',  w: 20, vary: true, bw: { meadow: 26, scorched: 8, fractured: 6 } },
  { base: 'tree_pineTallA',     kind: 'tree',  w: 16, vary: true, bw: { luminous: 24, fractured: 20, meadow: 10 } },
  { base: 'tree_thin',          kind: 'tree',  w: 12, vary: true },
  { base: 'tree_blocks',        kind: 'tree',  w: 8,  vary: true, bw: { plateau: 16 } },
  // Fels — trägt die Klippenzonen aus L1, ohne mit ihnen zu konkurrieren.
  { base: 'rock_tallA',         kind: 'rock',  w: 10, vary: false, bw: { fractured: 22, scorched: 18, meadow: 5 } },
  { base: 'rock_largeC',        kind: 'flat',  w: 8,  vary: false, bw: { scorched: 14 } },
  // Kleinzeug — es macht den Boden bewohnt, nicht die Silhouette.
  { base: 'plant_bushDetailed', kind: 'bush',  w: 10, vary: false, bw: { meadow: 16, scorched: 3 } },
  { base: 'stump_oldTall',      kind: 'bush',  w: 6,  vary: false, bw: { scorched: 14, fractured: 10 } },
  { base: 'mushroom_redGroup',  kind: 'small', w: 5,  vary: false, bw: { luminous: 16, meadow: 8, scorched: 1 } },
];

/**
 * Welche Namensfassung ein Biom bevorzugt. `''` = die Grundfassung.
 * Der Index hat `_dark` und `_fall` nur für Bäume — fehlt die Fassung, fällt es auf die
 * Grundfassung zurück (in `resolve()`), also darf hier ohne Prüfung gewünscht werden.
 */
export const BIOME_VARIANT = {
  meadow: '', plateau: '', luminous: '_dark', fractured: '_dark', scorched: '_fall',
};

// Zielgrundfläche in Welteinheiten (CELL = 3). Ein Baum mit 2,25 u Krone auf einer 3-u-Zelle
// liest sich als Baum; mit 3 u als Wand, mit 1 u als Grasbüschel. Fels kleiner, damit er nicht
// mit den Klippen (6 u, seit L1) konkurriert.
const TARGET_FP = { tree: 2.25, rock: 1.9, flat: 2.2, bush: 1.4, small: 0.95 };
// Nur was hoch und unterteilt ist, wird gebogen. Ein flacher Stein würde sonst „rutschen".
const BENDABLE_KINDS = { tree: 1, bush: 1 };
// Unter vier Höhen-Ringen SCHERT ein Netz statt zu biegen — die Regel steht in
// `kfb-cartoon-deform.js` (§5) und wird hier je Modell gemessen, nicht geraten.
const MIN_RINGS = 4;

// ---------------------------------------------------------------- GLSL
// ⚠ Keine Backticks in diesen Blöcken (Naht 111): sie stehen in Template-Literalen, und ein
// Backtick in einem Kommentar beendet das Literal — der Fehler erscheint dann bei einem Nachbarn.
const DEFORM = /* glsl */`
attribute vec4 aKc1;   // x=bendX y=bendZ z=leanX w=leanZ  (Bruchteile der HOEHE)
attribute vec4 aKc2;   // x=taper y=twist(rad) z=phase w=rampT (Rampenwert des Wuerfels)
attribute vec4 aKc3;   // x=cubeX y=cubeZ z=motionSeed w=1/scale
attribute vec3 aSN;    // geglaettete Normale (Kanten weich)
uniform float uKcMinY, uKcH, uKcCx, uKcCz, uKcMix, uKcTime, uKcSquashAmt, uKcSquashSpd;
uniform float uRound, uInflate, uKcLag, uKcLagJit;
varying float vRampT;
varying vec2 vCube;
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
  // v16/L3d · SQUASH & STRETCH AM BOB DES WUERFELS.
  // Vorher lief hier eine EIGENE Uhr (sin(phase + time)) — also eine zweite Bewegung neben der
  // des Bodens. Genau das liest man als Zappeln statt als Leben (Konfetti-Falle, Naht 82/110).
  // Jetzt kommt die Stauchung aus demselben kfbBob wie der Auftrieb: der Wuerfel ist unten
  // (bob 0) -> das Prop ist gestaucht und breit; der Wuerfel ist oben (bob 1) -> gestreckt und
  // schmal. Das ist Squash & Stretch am ANLASS, nicht im Takt.
  //
  // uKcLag laesst die Stauchung dem Auftrieb NACHlaufen (Follow-Through): die Masse eines Baums
  // reagiert spaeter als der Boden unter ihm. uKcLagJit streut den Verzug pro Instanz, damit ein
  // Wald nicht wie ein Uhrwerk atmet.
  float bq = kfbBobAt(aKc3.xy, aKc3.z, -(uKcLag + aKc2.z * uKcLagJit) * uKcSquashSpd);
  float sy = 1.0 + uKcSquashAmt * (bq * 2.0 - 1.0);
  q.y = uKcMinY + (q.y - uKcMinY) * sy;
  q.xz = c + (q.xz - c) / sqrt(max(sy, 1e-4));
  // Bogen (t^2, am Fuss verankert) + Neigung (linear), beide in Bruchteilen der HOEHE, damit
  // klein und gross gleich stark krumm werden.
  q.x += (aKc1.x * t * t + aKc1.z * t) * uKcH;
  q.z += (aKc1.y * t * t + aKc1.w * t) * uKcH;
  return mix(p, q, uKcMix);
}
`;
const TINT_FRAG = /* glsl */`
uniform float uTintAmt;
varying float vRampT;
varying vec2 vCube;
`;

/** mulberry32 — dasselbe PRNG wie world-context und der Verbieger. */
function mulberry32(seed) {
  let a = (seed >>> 0) || 1;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * v16/L3c · **Geglättete Normalen.** Für jede Position werden die Normalen aller Vertices an
 * derselben Stelle gemittelt (Raster 1/1000 einer Einheit, damit Rundungsfehler nicht zwei
 * Ecken aus einer machen). Das ist genau das, was ein 3D-Programm „Smooth Shading" nennt — nur
 * einmal beim Laden gerechnet und als zweites Normalen-Attribut mitgeführt, damit der Shader
 * zwischen HART und WEICH mischen kann statt sich für eines zu entscheiden.
 *
 * Warum nicht `computeVertexNormals` nach `mergeVertices`: das würde die harte Normale
 * ÜBERSCHREIBEN. Zwei Normalen nebeneinander sind der Grund, warum daraus ein Regler wird.
 */
function smoothNormals(geo) {
  const pos = geo.getAttribute('position'), nor = geo.getAttribute('normal');
  const out = new Float32Array(pos.count * 3);
  if (!nor) { return out; }
  const bucket = new Map();
  const key = (i) => Math.round(pos.getX(i) * 1000) + '/' + Math.round(pos.getY(i) * 1000) + '/' + Math.round(pos.getZ(i) * 1000);
  for (let i = 0; i < pos.count; i++) {
    const k = key(i);
    let b = bucket.get(k);
    if (!b) { b = [0, 0, 0, 0]; bucket.set(k, b); }
    b[0] += nor.getX(i); b[1] += nor.getY(i); b[2] += nor.getZ(i); b[3]++;
  }
  for (let i = 0; i < pos.count; i++) {
    const b = bucket.get(key(i));
    let x = b[0], y = b[1], z = b[2];
    const l = Math.hypot(x, y, z) || 1;
    out[i * 3] = x / l; out[i * 3 + 1] = y / l; out[i * 3 + 2] = z / l;
  }
  return out;
}

/** Höhen-Ringe zählen — wörtlich `segmentsAlongY` aus dem Verbieger, auf 1/64 der Höhe gerundet. */
function ringsAlongY(geo) {
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

export function createPropScatter(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({
    budget: 2400,        // Obergrenze über ALLE Modelle
    biomeLogic: true,    // `_dark`/`_fall` je Biom + Biom-Gewichte
    // Verbieger-Grenzen. Etwas kräftiger als die Vorgabe des Moduls (bend 0,06), weil ein Baum
    // mehr Bogen verträgt als ein Turm — „leichter Cartoon-Deformer" heißt nicht „unmerklich".
    bend: 0.10, lean: 0.07, taper: 0.16, twist: 14,
    // v16/L3d · Squash & Stretch am Bob des Wuerfels. `squash` ist die Amplitude (0 = aus),
    // `squashLag` der Verzug in Sekunden (Follow-Through), `squashLagJitter` seine Streuung.
    // Standard AN: Georgs Auftrag war „cartoonig und lebhaft", und das kostet hier nichts —
    // die Bob-Funktion lief ohnehin schon fuer den Auftrieb.
    squash: 0.07, squashSpeed: 1, squashLag: 0.09, squashLagJitter: 0.06,
    mix: 1,              // 0 = Originalform, 1 = verbogen (A/B am Regler)
    tint: 0.25,          // wie stark die Farbwelt in die Props hineinfärbt
    sizeJitter: 0.12,    // Größenstreuung ±
    sink: 0.05,          // Anteil der Höhe, um den das Prop in die Würfeloberseite gesetzt wird
    // v16/L3c · Runde Kanten. `round` mischt die Normale von hart nach weich (Beleuchtung),
    // `inflate` drückt die Fläche entlang der weichen Normale nach außen (Silhouette).
    // Zusammen ergeben sie „abgerundet" ohne eine einzige zusätzliche Kante.
    round: 0.55, inflate: 0.012,
  }, opts.params || {});
  // Geteilte Uniform-Objekte aus dem Terrain — ohne sie bewegen und färben die Props nicht mit.
  const motionU = opts.motion || {};
  const paletteU = opts.palette || {};

  const group = new THREE.Group();
  group.name = 'kfb-props';
  let index = null;                 // asset-repo.json
  const models = [];                // { base, name, kind, w, bw, parts, height, scale, bendable, rings }
  let ready = false, siteCount = 0, placed = 0, lastOver = 0, loadMs = 0, buildMs = 0, biomeNow = '';
  const tintCol = new THREE.Color(1, 1, 1);
  let timeS = 0;

  const _m = new THREE.Matrix4(), _p = new THREE.Vector3(), _q = new THREE.Quaternion(), _s = new THREE.Vector3();
  const _yAxis = new THREE.Vector3(0, 1, 0);

  /** Name → URL aus dem Index. Gibt `null`, wenn der Name dort nicht steht. */
  function urlOf(name) {
    if (!index) return null;
    const a = (index.assets || []).find((x) => x.name === name);
    if (!a) return null;
    return a.ghUrl || ((index.rawBase || '') + a.pack + '/' + a.name + '.glb');
  }

  /**
   * Ein Modell laden und in Instanced-Teile verwandeln.
   *
   * **Alle Teile werden in den Wurzelraum gebacken** — dieselbe Regel wie im Verbieger: ein Baum
   * aus Stamm + Krone bekäme sonst pro Teil eine eigene Bounding-Box, also eine eigene Mitte und
   * Höhe, und jedes Teil würde sich um seine eigene Achse biegen. Das Prop fiele auseinander.
   * Ein Rahmen für das ganze Prop, in dem `t` gerechnet wird.
   */
  async function loadOne(loader, def, name, cap) {
    const url = urlOf(name);
    if (!url) throw new Error('nicht im Index: ' + name);
    const gltf = await loader.loadAsync(url);
    const root = gltf.scene;
    root.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
    const src = [];
    root.traverse((n) => { if (n.isMesh && n.geometry) src.push(n); });
    if (!src.length) throw new Error('kein Mesh: ' + name);
    const baked = src.map((n) => {
      const g = n.geometry.clone();
      g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, n.matrixWorld));
      g.computeBoundingBox();
      return { geo: g, mat: (Array.isArray(n.material) ? n.material[0] : n.material) };
    });
    const shared = new THREE.Box3();
    baked.forEach((b) => shared.union(b.geo.boundingBox));
    const size = shared.getSize(new THREE.Vector3());
    const fp = Math.max(size.x, size.z);
    const scale = (TARGET_FP[def.kind] || 2.0) / Math.max(1e-4, fp);
    // Biegbarkeit wird GEMESSEN, nicht angenommen: die Ringzahl entscheidet, ob eine Biegung
    // biegt oder schert (Verbieger §5). Gemessen an Kenney-Bäumen: 19–31 Ringe, also biegen sie.
    const rings = Math.max.apply(null, baked.map((b) => ringsAlongY(b.geo)));
    const bendable = !!BENDABLE_KINDS[def.kind] && rings >= MIN_RINGS;

    const parts = baked.map((b) => {
      const mat = b.mat.clone();
      const U = {
        uKcMinY: { value: shared.min.y }, uKcH: { value: Math.max(1e-5, size.y) },
        uKcCx: { value: (shared.min.x + shared.max.x) / 2 },
        uKcCz: { value: (shared.min.z + shared.max.z) / 2 },
        uKcMix: { value: bendable ? P.mix : 0 },
        uKcTime: { value: 0 }, uKcSquashAmt: { value: P.squash }, uKcSquashSpd: { value: P.squashSpeed },
        uKcLag: { value: P.squashLag }, uKcLagJit: { value: P.squashLagJitter },
        uTintAmt: { value: P.tint },
        uRound: { value: P.round }, uInflate: { value: P.inflate },
      };
      mat.onBeforeCompile = (sh) => {
        // ⚠ Die Bewegungs- und Paletten-Uniforms sind DIESELBEN OBJEKTE wie im Terrain, nicht
        // Kopien (siehe `terrain.motionUniforms`). Deshalb gibt es hier keine Zeile, die etwas
        // nachzieht — und deshalb koennen Boden und Props nicht auseinanderlaufen.
        Object.assign(sh.uniforms, motionU, paletteU, U);
        sh.vertexShader = sh.vertexShader
          .replace('void main() {', MOTION_GLSL + DEFORM + '\nvoid main() {')
          .replace('#include <begin_vertex>', [
            '#include <begin_vertex>',
            'vRampT = aKc2.w;',
            'vCube = aKc3.xy;',
            'transformed = kfbCartoonI(transformed);',
            '// v16/L3c · RUNDE KANTEN, Teil 2: entlang der geglaetteten Normale aufblasen. Eine',
            '// Ecke wird dabei diagonal nach aussen gedrueckt, eine Flaeche gerade — die',
            '// Silhouette wird tonnenfoermig, also runder. Teil 1 ist die Normale selbst (unten).',
            'transformed += aSN * (uInflate * uKcH);',
            '// v16/L3b · DIE BODENBEWEGUNG. `kfbLift` ist derselbe GLSL-Block, den das Terrain',
            '// benutzt, mit denselben Uniforms und der Phase des WUERFELS (aKc3.xy/z) — nicht der',
            '// des Props, das versetzt steht. `aKc3.w` ist 1/Maszstab: die Lift ist absolut, hier',
            '// wird aber in Objektraum gerechnet, den die Instanzmatrix danach skaliert.',
            'transformed.y += kfbLift(aKc3.xy, aKc3.z) * aKc3.w;',
          ].join('\n'))
          // Normalen numerisch nachziehen (aus dem Verbieger übernommen): ohne das kippt die
          // Beleuchtung auf der Biegung, und ein gebogener Baum liest sich als Fehler.
          .replace('#include <beginnormal_vertex>', [
            '#include <beginnormal_vertex>',
            '// v16/L3c · RUNDE KANTEN, Teil 1: die Normale zwischen HART (Facette) und WEICH',
            '// (ueber gemeinsame Ecken gemittelt) mischen. Das rundet die BELEUCHTUNG, und weil',
            '// Kenney-Modelle flach schattiert sind, macht genau das den groessten Teil des',
            '// Eindrucks — eine echte Fase waere Geometrie, die wir 1400-fach bezahlen wuerden.',
            'objectNormal = normalize(mix(objectNormal, aSN, uRound));',
            '{',
            '  vec3 nn = normalize(objectNormal);',
            '  vec3 t1 = normalize(cross(nn, vec3(0.0, 1.0, 0.0001)));',
            '  vec3 t2 = cross(nn, t1);',
            '  float e = uKcH * 0.03;',
            '  vec3 q0 = kfbCartoonI(position);',
            '  vec3 qa = kfbCartoonI(position + t1 * e);',
            '  vec3 qb = kfbCartoonI(position + t2 * e);',
            '  vec3 nd = cross(qa - q0, qb - q0);',
            '  if (length(nd) > 1e-9) objectNormal = normalize(nd) * sign(dot(normalize(nd), nn));',
            '}',
          ].join('\n'));
        // Die Farbwelt färbt HINEIN, nicht ÜBER: multiplikativ auf die Grundfarbe, gedeckelt
        // durch `uTintAmt`. Ein Prop soll zur Welt gehören, nicht angemalt aussehen — und die
        // Kenney-Modelle haben KEINE Texturen (gemessen), also ist die Grundfarbe die ganze
        // Wahrheit und ein Multiplikator genügt.
        if (sh.fragmentShader.indexOf('#include <dithering_fragment>') >= 0) {
          sh.fragmentShader = sh.fragmentShader
            .replace('void main() {', PALETTE_GLSL + TINT_FRAG + '\nvoid main() {')
            .replace('#include <dithering_fragment>', [
              // v16/L3c · Die Faerbung kommt vom WUERFEL, auf dem das Prop steht: dieselbe Rampe,
              // dieselbe Palette, dieselbe radiale Front. Multiplikativ, damit die Kenney-Farbe
              // erhalten bleibt und das Prop zur Welt GEHOERT statt angemalt zu sein.
              'vec3 gc = kfbGroundColor(vRampT, vCube);',
              'gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * gc * 1.9, uTintAmt);',
              '#include <dithering_fragment>',
            ].join('\n'));
        }
      };
      mat.needsUpdate = true;
      const geo = b.geo;
      geo.setAttribute('aKc1', new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4));
      geo.setAttribute('aKc2', new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4));
      geo.setAttribute('aKc3', new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4));
      // Kein Instanced-Attribut: die weiche Normale gehört der GEOMETRIE, nicht der Instanz.
      geo.setAttribute('aSN', new THREE.BufferAttribute(smoothNormals(geo), 3));
      const mesh = new THREE.InstancedMesh(geo, mat, cap);
      mesh.frustumCulled = false;   // ein globales Mesh umspannt die Welt — der Test ist sinnlos
      mesh.count = 0;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      group.add(mesh);
      return { mesh, U, cap };
    });
    return { base: def.base, name, kind: def.kind, w: def.w, bw: def.bw || {}, parts,
             height: size.y, scale, bendable, rings,
             verts: baked.reduce((a, b) => a + b.geo.getAttribute('position').count, 0) };
  }

  /** Gewünschte Namensfassung für ein Biom, mit Rückfall auf die Grundfassung. */
  function resolve(def, biome) {
    if (!P.biomeLogic || !def.vary) return def.base;
    const suf = BIOME_VARIANT[biome] || '';
    if (!suf) return def.base;
    return urlOf(def.base + suf) ? def.base + suf : def.base;
  }

  /**
   * Index + Modelle laden. **Scheitert absichtlich weich**: was nicht lädt, fehlt eben, und der
   * Rest streut trotzdem. Ein einziges 404 darf nicht die Landschaft leer machen.
   */
  async function load(loader, biome, indexUrl) {
    const t0 = (typeof performance !== 'undefined' ? performance.now() : 0);
    if (!index) index = await (await fetch(indexUrl || './asset-repo.json')).json();
    biomeNow = biome || '';
    const total = PROP_SET.reduce((a, d) => a + d.w, 0);
    const out = await Promise.all(PROP_SET.map((d) => {
      // Reserve ×2: die Gewichte gelten im Mittel, nicht in jedem Ausschnitt — ein Wald-Fleck
      // kann kurzzeitig doppelt so viele Bäume eines Typs verlangen.
      const cap = Math.max(24, Math.ceil((d.w / total) * P.budget * 2));
      return loadOne(loader, d, resolve(d, biomeNow), cap)
        .catch((e) => { console.warn('[props] ' + d.base + ' nicht geladen: ' + e.message); return null; });
    }));
    out.forEach((m) => { if (m) models.push(m); });
    loadMs = Math.round((typeof performance !== 'undefined' ? performance.now() : 0) - t0);
    ready = models.length > 0;
    return ready;
  }

  /**
   * Standorte einsammeln und verteilen. Wird beim Chunk-Wechsel gerufen (bei Reisetempo also
   * etwa einmal pro Sekunde) — es schreibt nur Matrizen, kein Rebake.
   *
   * Die Modellwahl ist **gewichtete Wahl über einen Hash des ORTES**: derselbe Ort trägt immer
   * dasselbe Modell in derselben Krümmung. Ohne das stünde beim Zurückfliegen ein anderer Wald —
   * und „ich war schon hier" ist der halbe Sinn einer Landschaft (dieselbe Regel wie `stepAt`
   * und `regionAt`: Orte werden gerechnet, nicht vergeben).
   */
  function rebuild(terrain, biome) {
    if (!ready) return 0;
    const t0 = (typeof performance !== 'undefined' ? performance.now() : 0);
    const n = models.length;
    const counts = new Array(n).fill(0);
    const b = P.biomeLogic ? (biome || biomeNow) : '';
    const wts = models.map((m) => (b && m.bw[b] != null ? m.bw[b] : m.w));
    const wsum = wts.reduce((a, v) => a + v, 0) || 1;
    // v16/L3b · **Die Attribut-Arrays werden EINMAL geholt, nicht pro Standort.** Gemessen:
    // mit `getAttribute()` in der inneren Schleife kostete ein Aufbau 26 ms (1403 Standorte ×
    // 2 Teile × 3 Abfragen ≈ 8400 Namenssuchen); bei Reisetempo laeuft der Aufbau etwa einmal
    // pro Sekunde, das waren also anderthalb verlorene Bilder im Sekundentakt.
    const bufs = models.map((m) => m.parts.map((part) => {
      const g = part.mesh.geometry;
      return { mesh: part.mesh, a1: g.getAttribute('aKc1').array, a2: g.getAttribute('aKc2').array,
               a3: g.getAttribute('aKc3').array };
    }));
    let over = 0, total = 0;
    siteCount = terrain.propSites((st) => {
      if (total >= P.budget) { over++; return; }
      const r2 = st.r2, r3 = st.r3;
      let acc = r2 * wsum, k = 0;
      while (k < n - 1 && acc > wts[k]) { acc -= wts[k]; k++; }
      const m = models[k];
      const slot = counts[k];
      if (slot >= m.parts[0].cap) { over++; return; }
      // Form dieser Instanz aus den ZELL-Koordinaten (nicht aus x/z): die tragen den Jitter der
      // Dichte, und dann würde ein Dichte-Regler die Formen aller Props umwerfen.
      const rnd = mulberry32(((st.cell * 73856093) ^ (st.cellZ * 19349663)) >>> 0);
      const sym = () => rnd() * 2 - 1;
      const bendX = sym() * P.bend, bendZ = sym() * P.bend;
      const leanX = sym() * P.lean, leanZ = sym() * P.lean;
      const taper = rnd() * P.taper;
      const twist = sym() * P.twist * Math.PI / 180;
      // aKc2.z war die Phase der alten eigenen Uhr. Sie ist jetzt ein 0..1-Zufall und streut den
      // VERZUG der Stauchung — dieselbe Zahl, andere Bedeutung, deshalb umbenannt.
      const lagJit = rnd();
      const sc = m.scale * (1 + (r3 - 0.5) * 2 * P.sizeJitter);
      _p.set(st.x, st.top - m.height * sc * P.sink, st.z);
      _q.setFromAxisAngle(_yAxis, r3 * Math.PI * 2);
      _s.set(sc, sc, sc);
      _m.compose(_p, _q, _s);
      const o = slot * 4;
      for (const bf of bufs[k]) {
        bf.mesh.setMatrixAt(slot, _m);
        const a1 = bf.a1, a2 = bf.a2, a3 = bf.a3;
        a1[o] = m.bendable ? bendX : 0; a1[o + 1] = m.bendable ? bendZ : 0;
        a1[o + 2] = leanX; a1[o + 3] = leanZ;
        // aKc2.w ist der RAMPENWERT des Würfels — daraus holt der Fragment-Shader die Bodenfarbe.
        a2[o] = taper; a2[o + 1] = m.bendable ? twist : 0; a2[o + 2] = lagJit; a2[o + 3] = st.rampT;
        // aKc3: Würfelmitte + Bewegungs-Seed + 1/Maßstab (siehe Shader-Kommentar).
        a3[o] = st.cubeX; a3[o + 1] = st.cubeZ; a3[o + 2] = st.mseed; a3[o + 3] = 1 / Math.max(1e-4, sc);
      }
      counts[k]++; total++;
    });
    models.forEach((m, k) => {
      for (const part of m.parts) {
        part.mesh.count = counts[k];
        part.mesh.instanceMatrix.needsUpdate = true;
        part.mesh.geometry.getAttribute('aKc1').needsUpdate = true;
        part.mesh.geometry.getAttribute('aKc2').needsUpdate = true;
        part.mesh.geometry.getAttribute('aKc3').needsUpdate = true;
      }
    });
    placed = total; lastOver = over;
    buildMs = Math.round(((typeof performance !== 'undefined' ? performance.now() : 0) - t0) * 10) / 10;
    return placed;
  }

  return {
    name: 'prop-scatter', version: PS_VERSION, group,
    load, rebuild,
    get ready() { return ready; },
    // v16/L3d · **`update` ist absichtlich leer geworden.** Die Stauchung laeuft am geteilten
    // `uTime` des Terrains (ueber `kfbBobAt`), also gibt es keinen eigenen Takt mehr, den jemand
    // vorwaerts drehen muesste. Die Methode bleibt, damit der Aufrufer im Frame-Ablauf nichts
    // aendern muss — und weil ein stiller Fehlschlag schlimmer waere als eine Zeile, die erklaert,
    // warum hier nichts passiert.
    update() {},
    // `setTint` ist ab ps-v1.1 **absichtlich leer**: die Prop-Farbe kommt nicht mehr aus einer
    // gesetzten Farbe, sondern aus dem WÜRFEL, auf dem das Prop steht (`kfbGroundColor`, geteilte
    // Paletten-Uniforms). Die Methode bleibt, damit alte Aufrufer nicht brechen — ein stiller
    // Fehlschlag wäre schlimmer als eine Zeile, die nichts tut und sagt, warum.
    setTint() {},
    setParams(next) {
      Object.assign(P, next || {});
      models.forEach((m) => m.parts.forEach((p) => {
        p.U.uKcMix.value = m.bendable ? P.mix : 0;
        p.U.uKcSquashAmt.value = P.squash;
        p.U.uKcSquashSpd.value = P.squashSpeed;
        p.U.uKcLag.value = P.squashLag;
        p.U.uKcLagJit.value = P.squashLagJitter;
        p.U.uTintAmt.value = P.tint;
        p.U.uRound.value = P.round;
        p.U.uInflate.value = P.inflate;
      }));
    },
    get params() { return P; },
    get biome() { return biomeNow; },
    /** Nach einem Weltwürfel (neues Biom) die Namensfassungen neu ziehen. */
    needsReload(biome) {
      if (!P.biomeLogic) return models.some((m) => m.name !== m.base);
      return models.some((m) => {
        const def = PROP_SET.find((d) => d.base === m.base);
        return def && resolve(def, biome) !== m.name;
      });
    },
    report() {
      return {
        version: PS_VERSION, geladen: models.length + '/' + PROP_SET.length,
        ladezeit: loadMs + ' ms', aufbau: buildMs + ' ms',
        drawCalls: models.reduce((a, m) => a + m.parts.length, 0),
        standorte: siteCount, gesetzt: placed, ueberBudget: lastOver, budget: P.budget,
        biom: biomeNow, biomLogik: P.biomeLogic,
        vertsGesamt: models.reduce((a, m) => a + m.verts, 0),
        modelle: models.map((m) => m.name + ' ×' + (m.parts[0] ? m.parts[0].mesh.count : 0)
          + ' · ' + m.rings + ' Ringe' + (m.bendable ? ' (biegt)' : ' (neigt)')),
      };
    },
    dispose(scene) {
      models.forEach((m) => m.parts.forEach((p) => {
        p.mesh.geometry.dispose(); p.mesh.material.dispose(); group.remove(p.mesh);
      }));
      models.length = 0; ready = false;
      if (scene) scene.remove(group);
    },
  };
}
