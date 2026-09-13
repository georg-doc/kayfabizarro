// ============================================================================
// carpet-leaves.js — Blätter am Boden, 1:1 aus tinyskies
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, client/src/game/CarpetLeaves.ts (gelesen 29.8.2026),
// Kopfsatz der Quelle: *„Rustling leaf particles when the magic carpet flies over land.
// Curved leaf-shaped points that flutter upward and drift away."*
//
// ⚠ **Das hier ersetzt `ground-leaves.js`, und das war mein Fehler — Regel 2 und 4 aus
// `use-what-works_v1.md`.** Ich hatte „die Absicht von CarpetLeaves" nachgebaut, statt die Datei
// zu kopieren. Georgs Befund (29.8.): „wirken wie Konfetti, was plötzlich über dem Pet
// ausgeschüttet wird". Genau das war der Unterschied zur Quelle, in drei Punkten:
//
//   1. **WANN.** Die Quelle emittiert nur über LAND und nur oberhalb Tempo 0,5
//      (`speedFade = (speed − 0.5) / 0.3`, weich nachgeführt mit 0,08 je Bild). Bei unserem
//      Reisetempo 0,28 passiert also NICHTS — Blätter sind ein Schnellflug-Effekt. Meine Fassung
//      hing an der Bodennähe und schüttete beim Schleichen.
//   2. **WO.** Die Quelle spawnt auf `altitude * 0.7`, also UNTER dem Fahrzeug in Bodennähe.
//      Meine Fassung spawnte vor und über dem Avatar — daher „über dem Pet ausgeschüttet".
//   3. **WIE VIEL.** `EMIT_PER_FRAME = 0.25` bei Pool 300 — ein Blatt alle vier Bilder, nicht
//      34 je Sekunde. Und es sind Blätter mit Form (gebogene Silhouette mit Mittelrippe im
//      Fragment-Shader, sieben Grüntöne), keine bunten Quads.
//
// Alle Konstanten, Shader und der Ablauf sind wörtlich aus der Quelle. **Die Naht** (eigene
// Arbeit, eine Stelle): TypeScript-Klasse → Fabrikfunktion mit injiziertem THREE, und
// `isLand`/`tangentFrame`/`cartesianFromSpherical` kommen aus unseren portierten Modulen statt
// aus den TS-Nachbarn. Sonst nichts.
//
// **Beweis (Regel 6):** die Quelle schreibt nichts in die Konsole, also gibt es keine Meldung zum
// Wiedererscheinen. Ersatz: `report()` liefert ihre eigenen Größen — `landAlpha` (der geglättete
// Ein-/Ausblender), `POOL_SIZE` 300, `EMIT_PER_FRAME` 0,25 — und `[leaves]` meldet beim ersten
// Ausblenden einmal, ab welchem Tempo es angesprungen ist.
// ============================================================================

import { cartesianFromSpherical, tangentFrame } from './spherical-math.js';
import { isLand } from './globe-field.js';

/* Slice D · v5 · Parameter des Laubs. Standard = Quelle (`CarpetLeaves.ts`).
 *
 * ⚠ Zwei Zahlen, die NICHT im Block standen und genau die sind, um die es bei diesem Modul
 * ging: die **Tempo-Schwelle 0,5** (Slice A hat gemessen: „0 lebende Partikel" — und die Ursache
 * war eine Schwelle, kein Shader) und die **Blendrate des Ein-/Ausblenders**. Ein Modul, dessen
 * Sichtbarkeit an einer Schwelle hängt, muss diese Schwelle als Regler haben. */
export const LEAVES_QUELLE = Object.freeze({
  pool: 300,
  lifeMin: 1.0,
  lifeMax: 2.5,
  jeBild: 0.25,
  upSpeed: 0.14,
  outSpeed: 0.14,
  gravity: 0.04,
  flutterFreq: 8.0,
  flutterAmp: 0.015,
  tempoSchwelle: 0.5,   // war ein Literal in `update` UND eine Zahl im `report`
  blendJeBild: 0.08,    // war ein Literal · ⚠ Anteil je BILD, nicht je Sekunde (Quelle)
});
/** ⚠ **Ein Zeiger, kein zweiter Zahlensatz.** Der Partikel-Pool wird auf MODULEBENE gebaut
 *  (`makeLeafParticles`), die Parameter gehören aber der Instanz. Also zeigt `LP` auf die
 *  Parameter der Instanz, und der Pool liest ausschließlich darüber. Zwei Sätze wären zwei
 *  Wahrheiten — genau die Fehlerklasse, die dieses Projekt schon dreimal bezahlt hat.
 *  Gilt für EINE Instanz; mehr als eine gibt es in diesem Spiel nicht, und wenn doch, muss der
 *  Pool den Parametersatz als Argument bekommen. Das steht hier, damit es niemand herausfinden muss. */
let LP = Object.assign({}, LEAVES_QUELLE);
/** Dimensioniert die Puffer, also BAUZEIT — als Instanzparameter wirkungslos, deshalb Modulebene. */
const POOL_SIZE = LEAVES_QUELLE.pool;

const leafVert = `
attribute float aAlpha;
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
varying float vAlpha;
varying float vPhase;
varying vec3 vColor;
void main() {
  vAlpha = aAlpha;
  vPhase = aPhase;
  vColor = aColor;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (200.0 / -mvPos.z);
  gl_Position = projectionMatrix * mvPos;
}
`;

const leafFrag = `
varying float vAlpha;
varying float vPhase;
varying vec3 vColor;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float angle = vPhase;
  float c = cos(angle), s = sin(angle);
  vec2 ruv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);

  float curve = 0.15 * ruv.y * ruv.y;
  vec2 cruv = vec2(ruv.x - curve, ruv.y);

  float ny = cruv.y / 0.38;
  if (abs(ny) > 1.0) discard;
  float bulge = sqrt(1.0 - ny * ny) * (1.0 - 0.3 * ny);
  float w = 0.14 * bulge;
  float leaf = smoothstep(w, w - 0.02, abs(cruv.x));
  if (leaf < 0.1) discard;

  float vein = smoothstep(0.012, 0.0, abs(cruv.x));
  vec3 col = vColor * (1.0 + vein * 0.15);
  gl_FragColor = vec4(col, leaf * vAlpha);
}
`;

const LEAF_COLORS = [
  [0.50, 0.78, 0.40],
  [0.58, 0.80, 0.38],
  [0.65, 0.76, 0.35],
  [0.72, 0.70, 0.32],
  [0.78, 0.65, 0.35],
  [0.62, 0.82, 0.42],
  [0.55, 0.72, 0.38],
];

/** Der Partikel-Pool — `LeafParticles` der Quelle, Feld für Feld. */
function makeLeafParticles(THREE) {
  const pool = [];
  for (let i = 0; i < POOL_SIZE; i++) {
    pool.push({
      alive: false, age: 0, lifetime: 1,
      px: 0, py: 0, pz: 0, vx: 0, vy: 0, vz: 0,
      phase: 0, phaseSpeed: 0, flutterOffset: 0,
      upX: 0, upY: 1, upZ: 0,
    });
  }

  const posAttr = new THREE.BufferAttribute(new Float32Array(POOL_SIZE * 3), 3);
  const alphaAttr = new THREE.BufferAttribute(new Float32Array(POOL_SIZE), 1);
  const sizeAttr = new THREE.BufferAttribute(new Float32Array(POOL_SIZE), 1);
  const phaseAttr = new THREE.BufferAttribute(new Float32Array(POOL_SIZE), 1);
  const colorAttr = new THREE.BufferAttribute(new Float32Array(POOL_SIZE * 3), 3);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', posAttr);
  geometry.setAttribute('aAlpha', alphaAttr);
  geometry.setAttribute('aSize', sizeAttr);
  geometry.setAttribute('aPhase', phaseAttr);
  geometry.setAttribute('aColor', colorAttr);

  const material = new THREE.ShaderMaterial({
    vertexShader: leafVert,
    fragmentShader: leafFrag,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  let nextSlot = 0;

  function emit(origin, up, right, forward, speed) {
    const count = Math.ceil(LP.jeBild * Math.min(1, speed * 1.5));
    const colors = colorAttr.array;

    for (let i = 0; i < count; i++) {
      const p = pool[nextSlot];
      const idx = nextSlot;
      nextSlot = (nextSlot + 1) % POOL_SIZE;

      p.alive = true;
      p.age = 0;
      p.lifetime = LP.lifeMin + Math.random() * (LP.lifeMax - LP.lifeMin);

      const jitterUp = (0.5 + Math.random() * 1.0) * LP.upSpeed;
      const jitterSide = (Math.random() - 0.5) * 2.0 * LP.outSpeed;
      const jitterBack = -Math.random() * 0.03;

      const spread = 0.05;
      p.px = origin.x + (Math.random() - 0.5) * spread + forward.x * (Math.random() - 0.5) * 0.06;
      p.py = origin.y + (Math.random() - 0.5) * spread + forward.y * (Math.random() - 0.5) * 0.06;
      p.pz = origin.z + (Math.random() - 0.5) * spread + forward.z * (Math.random() - 0.5) * 0.06;

      p.vx = up.x * jitterUp + right.x * jitterSide + forward.x * jitterBack;
      p.vy = up.y * jitterUp + right.y * jitterSide + forward.y * jitterBack;
      p.vz = up.z * jitterUp + right.z * jitterSide + forward.z * jitterBack;

      p.phase = Math.random() * Math.PI * 2;
      p.phaseSpeed = (2 + Math.random() * 4) * (Math.random() < 0.5 ? 1 : -1);
      p.flutterOffset = Math.random() * Math.PI * 2;
      p.upX = up.x; p.upY = up.y; p.upZ = up.z;

      const col = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
      colors[idx * 3] = col[0];
      colors[idx * 3 + 1] = col[1];
      colors[idx * 3 + 2] = col[2];
    }
    colorAttr.needsUpdate = true;
  }

  function update(dt, landAlpha) {
    const positions = posAttr.array;
    const alphas = alphaAttr.array;
    const sizes = sizeAttr.array;
    const phases = phaseAttr.array;
    let lebend = 0;

    for (let i = 0; i < POOL_SIZE; i++) {
      const p = pool[i];
      if (!p.alive) { alphas[i] = 0; sizes[i] = 0; continue; }

      p.age += dt;
      if (p.age >= p.lifetime) { p.alive = false; alphas[i] = 0; sizes[i] = 0; continue; }
      lebend++;

      p.vx -= p.upX * LP.gravity * dt;
      p.vy -= p.upY * LP.gravity * dt;
      p.vz -= p.upZ * LP.gravity * dt;

      const flutter = Math.sin(p.age * LP.flutterFreq + p.flutterOffset) * LP.flutterAmp * dt;
      p.vx += (Math.random() - 0.5) * flutter;
      p.vy += (Math.random() - 0.5) * flutter;
      p.vz += (Math.random() - 0.5) * flutter;

      p.px += p.vx * dt;
      p.py += p.vy * dt;
      p.pz += p.vz * dt;

      p.phase += p.phaseSpeed * dt;

      const t = p.age / p.lifetime;
      positions[i * 3] = p.px;
      positions[i * 3 + 1] = p.py;
      positions[i * 3 + 2] = p.pz;
      alphas[i] = landAlpha;
      const scale = t < 0.3 ? t / 0.3 : 1.0 - (t - 0.3) / 0.7;
      sizes[i] = scale * 0.14;
      phases[i] = p.phase;
    }

    posAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    phaseAttr.needsUpdate = true;
    return lebend;
  }

  function reset() {
    for (const p of pool) {
      p.alive = false; p.age = 0; p.lifetime = 1;
      p.px = 0; p.py = 0; p.pz = 0;
      p.vx = 0; p.vy = 0; p.vz = 0;
      p.phase = 0; p.phaseSpeed = 0; p.flutterOffset = 0;
      p.upX = 0; p.upY = 1; p.upZ = 0;
    }
    posAttr.array.fill(0); alphaAttr.array.fill(0);
    sizeAttr.array.fill(0); phaseAttr.array.fill(0);
    posAttr.needsUpdate = true; alphaAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true; phaseAttr.needsUpdate = true;
  }

  return { points, material, emit, update, reset,
           dispose() { geometry.dispose(); material.dispose(); } };
}

/** `CarpetLeaves` der Quelle. Signatur von `update` wörtlich übernommen. */
export function createCarpetLeaves(opts = {}) {
  const THREE = opts.THREE;
  const group = new THREE.Group();
  group.name = 'carpet-leaves';
  const leaves = makeLeafParticles(THREE);
  group.add(leaves.points);
  let landAlpha = 0, lebend = 0, an = true, gemeldet = false;
  /** `LP` ist modulweit, weil der Pool auf Modulebene gebaut wird; `P` ist die Sicht dieser
   *  Instanz. Ein Zeiger, kein zweiter Satz Zahlen — zwei Sätze wären zwei Wahrheiten. */
  const P = Object.assign({}, LEAVES_QUELLE, opts.params || {});
  LP = P;
  function abweichungen() {
    const a = [];
    for (const k in LEAVES_QUELLE) if (P[k] !== LEAVES_QUELLE[k]) a.push(k + ' ' + LEAVES_QUELLE[k] + '→' + P[k]);
    return a;
  }

  const _fwd = new THREE.Vector3(), _right = new THREE.Vector3();

  return {
    name: 'carpet-leaves', group, points: leaves.points, params: P, quelle: LEAVES_QUELLE,
    abweichungen,
    zeile() {
      const a = abweichungen();
      return Object.keys(LEAVES_QUELLE).length + ' params · '
        + (a.length ? '⚠ ' + a.length + ' off source: ' + a.join(', ')
                    : 'all source-faithful (tinyskies CarpetLeaves.ts)')
        + ' · ' + lebend + '/' + POOL_SIZE + ' live · blend ' + landAlpha.toFixed(2)
        + ' · speed gate ' + P.tempoSchwelle
        + (an ? '' : '  ·  OFF')
        + (an && lebend === 0 ? '  ·  ⚠ 0 live (over water, or below the speed gate)' : '');
    },
    get enabled() { return an; },
    setEnabled(on) { an = !!on; group.visible = !!an; if (!an) { landAlpha = 0; leaves.reset(); } },
    update(dt, qPosition, heading, globeRadius, speed, altitude, seed, terrainType) {
      if (!an) return;
      const frame = tangentFrame(qPosition);
      const up = frame.up;
      const overLand = isLand(seed, terrainType, up.x, up.y, up.z);

      const speedFade = Math.min(1, Math.max(0, (speed - 0.5) / 0.3));
      const target = overLand && speed > 0.5 ? speedFade : 0;
            // ⚠ Slice D · Befund: dieser Blender ist der einzige Zeitschreiber im Modul, der `dt`
      // NICHT liest — 8 % je BILD. Bei 30 fps blendet er halb so schnell wie bei 60. Das ist
      // die Quelle 1:1 (`CarpetLeaves.ts`), also bleibt der Wert stehen; er heißt jetzt aber so,
      // wie er wirkt (`blendJeBild`, nicht `blendRate`), und der Befund steht hier statt in
      // niemandes Kopf. Umrechnen wäre eine Verhaltensänderung — und Slice D ändert nichts.
      landAlpha += (target - landAlpha) * P.blendJeBild;

      lebend = leaves.update(dt, landAlpha);

      if (landAlpha < 0.01) return;

      if (!gemeldet) {
        gemeldet = true;
        console.info('[leaves] angesprungen bei Tempo ' + speed.toFixed(2)
          + ' (Schwelle ' + P.tempoSchwelle.toFixed(2) + ') · Pool ' + POOL_SIZE
          + ' · ' + P.jeBild + ' je Bild');
      }

      const spawnAlt = altitude * 0.7;
      const surfacePos = cartesianFromSpherical(qPosition, spawnAlt, globeRadius);

      _fwd.set(0, 0, 0)
        .addScaledVector(frame.north, Math.cos(heading))
        .addScaledVector(frame.east, Math.sin(heading))
        .normalize();
      _right.crossVectors(_fwd, up).normalize();

      leaves.emit(surfacePos, up, _right, _fwd, speed);
    },
    reset() { landAlpha = 0; leaves.reset(); },
    report() {
      const a = abweichungen();
      return { an, landAlpha: +landAlpha.toFixed(3), lebend, pool: POOL_SIZE,
               jeBild: P.jeBild, schwelle: P.tempoSchwelle,
               parameter: Object.keys(LEAVES_QUELLE).length, abweichungen: a.length, abweichend: a };
    },
    dispose() { leaves.dispose(); },
  };
}
