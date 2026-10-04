// ============================================================================
// natur-marken.js — v9 · Vulkane + Leuchttürme auf der Streuungsschicht
// ----------------------------------------------------------------------------
// Zwei Marken, ein Prinzip: **das Prädikat entscheidet den Ort, nicht ein eigener Zufall.**
// Genau dafür ist `verteilung.js` gebaut — ein Leuchtturm will Küste, ein Vulkan will Hochland.
// Beide fragen dieselbe Schicht, also gibt es weiter EINE Antwort auf „wohin darf etwas".
//
// **Vulkan — zeichengleich aus `client/src/game/Volcano.ts`:**
//   · Platzierung: bester Platz aus bis zu 3000 Würfen mit `elevation > 0.4`, Abbruch ab 0,6
//     (Quelle `getVolcanoPlacementNormal`). Wir setzen dieselbe Regel als PRÄDIKAT auf die
//     Streuungsschicht — dadurch stehen zwei Vulkane nie beieinander (Mindestabstand gratis).
//   · Körper: `LatheGeometry` mit S = 0,35 · H = 1,25, Kraterprofil (sechs Stützstellen) plus
//     24 Außenschritte mit `r = 0.24·S + t^1.6 · 1.15·S`, danach Rauschverzerrung
//     (`radialScale = 1 + warp·0.25·heightFade`) und die vier Farbbänder (Magma 0.85/0.25/0.05,
//     versengter Rand 0.16/0.10/0.08, Oberhang, Unterhang ins Grünbraun).
//   · Lava: 30 additive Kugeln (r 0,02), Auftrieb 0,12–0,28, Schwerkraft 0,08, Lebensdauer
//     2,5–4,5 s. Rauch: 15 additive Billboards 0,07², Auftrieb 0,025–0,05.
//   · Beide Shader (`lavaFrag`, `smokeFrag`) unverändert übernommen.
//   · Einsinken `S·0.42`, Kratermitte `S·H·0.92` — die Zahlen, an denen der Rauch ansetzt.
//
// **Leuchtturm — Mechanik aus `Globe.createLighthouses` (Globe.ts 5368–5646):**
//   · **3** Stück (`LIGHTHOUSE_COUNT`), Platz über `waterRatioAround` — also KÜSTE: Land unter dem
//     Fuß, Wasser im Ring. Turmhöhe **0,18** (`towerH`), Strahl als liegender Kegel
//     (`CylinderGeometry(beamSpread, 0.002, beamLen)` um −90° gedreht) mit **0,8 rad/s**.
//   · Was hier UNSERES ist und benannt bleibt: Farben, Streifen, Laterne und Sockelmaße. Die
//     Quelle baut 14 Einzelteile; wir bauen die Silhouette aus fünf und halten die KFB-Tusche.
//     (Regel des Hauses: Mechanik von der Quelle, Farbton von uns.)
//   · ⚠ **UNSERE Zahlen, nicht die der Quelle: der Küstenring** (Weite 0,04 · 8 Proben ·
//     Wasseranteil 25–75 %). Die lighthouse-eigenen `CHECK_DIST`/`WATER_CHECKS` stehen in
//     `Globe.ts` 5369–5400 und sind **nicht gelesen** — zwei Suchen haben nur die Aufrufstelle
//     geliefert (`waterRatioAround(centerNormal, CHECK_DIST, WATER_CHECKS)`), nicht die
//     Deklarationen. Zum Vergleich, was benachbarte Sorten benutzen: Kokospalmen 0,04 / 6 Proben
//     (Globe.ts 872), Dörfer 0,05 / 10 Proben mit Anteil 0,2…max (1828–1830). Unsere Werte liegen
//     dazwischen. *Eine ungelesene Konstante darf nicht als Quellenwert auftreten* — deshalb steht
//     sie hier und im Tor als unsere.
// ============================================================================
import { createNoise3D, terrainNoise, sampleTerrain } from './simplex-noise.js';
import { isLand } from './globe-field.js';
import { streuen } from './verteilung.js';
import { surfaceAltitudeAt } from './terrain-surface.js';
import { addRimLight, initRimLight } from './rim-light.js';

const LAVA_VERT = `
attribute float aLife;
varying vec2 vUv; varying float vLife;
void main() {
  vUv = uv; vLife = aLife;
  vec4 wp = instanceMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * wp;
}`;

const LAVA_FRAG = `
varying vec2 vUv; varying float vLife;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  vec3 core = vec3(1.0, 0.75, 0.15);
  vec3 mid  = vec3(1.0, 0.45, 0.02);
  vec3 edge = vec3(0.9, 0.20, 0.0);
  vec3 col = mix(core, mid, smoothstep(0.0, 0.5, d));
  col = mix(col, edge, smoothstep(0.4, 0.9, d));
  float fade = 1.0 - smoothstep(0.65, 1.0, vLife);
  float alpha = (1.0 - smoothstep(0.5, 1.0, d)) * fade;
  gl_FragColor = vec4(col * 3.0, alpha);
}`;

const SMOKE_VERT = `
attribute float aLife;
varying vec2 vUv; varying float vLife;
void main() {
  vUv = uv; vLife = aLife;
  vec4 ip = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  vec4 mv = modelViewMatrix * ip;
  float sx = length(vec3(instanceMatrix[0][0], instanceMatrix[0][1], instanceMatrix[0][2]));
  float sy = length(vec3(instanceMatrix[1][0], instanceMatrix[1][1], instanceMatrix[1][2]));
  mv.xy += position.xy * vec2(sx, sy);
  gl_Position = projectionMatrix * mv;
}`;

const SMOKE_FRAG = `
uniform float uOpacity;
varying vec2 vUv; varying float vLife;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  vec3 inner = vec3(0.6, 0.12, 0.03);
  vec3 outer = vec3(0.35, 0.05, 0.01);
  vec3 col = mix(inner, outer, smoothstep(0.0, 0.8, d));
  float lifeFade = smoothstep(0.0, 0.15, vLife) * (1.0 - smoothstep(0.5, 1.0, vLife));
  float alpha = (1.0 - smoothstep(0.3, 1.0, d)) * uOpacity * lifeFade;
  gl_FragColor = vec4(col * 1.2, alpha * 0.45);
}`;

const S = 0.35, H = 1.25;              // Quelle: Volcano.ts
const LAVA = 30, RAUCH = 15;
const REF_UP = { x: 0, y: 1, z: 0 };

function rand01(seedRef) {
  seedRef.s = (Math.imul(seedRef.s, 1664525) + 1013904223) >>> 0;
  return seedRef.s / 0x100000000;
}

/** Vulkankörper — Profil, Rauschverzerrung und Farbbänder wie in der Quelle. */
function vulkanGeometrie(THREE, seed) {
  const p = [];
  p.push(new THREE.Vector2(0.00 * S, 0.88 * S * H));
  p.push(new THREE.Vector2(0.06 * S, 0.88 * S * H));
  p.push(new THREE.Vector2(0.09 * S, 0.94 * S * H));
  p.push(new THREE.Vector2(0.12 * S, 0.98 * S * H));
  p.push(new THREE.Vector2(0.18 * S, 1.00 * S * H));
  p.push(new THREE.Vector2(0.24 * S, 0.98 * S * H));
  const steps = 24;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    p.push(new THREE.Vector2(0.24 * S + Math.pow(t, 1.6) * 1.15 * S, (1 - t) * 0.98 * S * H));
  }
  const geo = new THREE.LatheGeometry(p, 32);
  const pos = geo.attributes.position;
  const rimY = S * H;
  const noise = createNoise3D(seed);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    if (Math.sqrt(x * x + z * z) < 0.001) continue;
    const t = y / rimY;
    const warp = (terrainNoise(noise, x * 4, y * 4, z * 4, 4, 2, 0.5, 1) - 0.5) * 2;
    const band = Math.sin(t * Math.PI);
    const fade = Math.max(band, (1 - t) * 0.6);
    const k = 1 + warp * 0.25 * fade;
    pos.setX(i, x * k); pos.setZ(i, z * k);
    pos.setY(i, y + warp * 0.08 * S * band);
  }
  pos.needsUpdate = true;
  const cols = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const r = Math.sqrt(x * x + z * z);
    const t = Math.max(0, y / rimY);
    const cn = terrainNoise(noise, x * 10, y * 10, z * 10, 3, 2, 0.5, 1);
    const tm = Math.max(0, Math.min(1, t + (cn - 0.5) * 0.25));
    let cr, cg, cb;
    if (tm > 0.88 && r < 0.1 * S) { cr = 0.85; cg = 0.25; cb = 0.05; }
    else if (tm > 0.82) { cr = 0.16; cg = 0.10; cb = 0.08; }
    else if (tm > 0.55) {
      const q = (tm - 0.55) / 0.27;
      cr = 0.38 + (0.16 - 0.38) * q; cg = 0.24 + (0.10 - 0.24) * q; cb = 0.18 + (0.08 - 0.18) * q;
    } else {
      const q = Math.max(0, Math.min(1, tm / 0.55));
      cr = 0.28 + (0.38 - 0.28) * q; cg = 0.32 + (0.24 - 0.32) * q; cb = 0.22 + (0.18 - 0.22) * q;
    }
    const hl = (cn - 0.5) * 0.1;
    cols[i * 3] = Math.max(0, Math.min(1, cr + hl));
    cols[i * 3 + 1] = Math.max(0, Math.min(1, cg + hl));
    cols[i * 3 + 2] = Math.max(0, Math.min(1, cb + hl));
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  geo.computeVertexNormals();
  return geo;
}

// ── v10 · Der Grund unter einer FLÄCHE, nicht unter einem Punkt ─────────────────────
// **Georg, 2.9.: „Leuchtturm ragt mit Teilen der Basis in die Luft" und „Vulkan steckt wie ein Hut
// auf dem Berg". Das sind nicht zwei Fehler, das ist einer — zweimal sichtbar.**
// Beide Requisiten lasen die Höhe an GENAU EINEM Punkt: ihrer Mitte. Ein Punkt genügt, solange
// der Boden waagerecht ist. Ist er es nicht, gilt die gelesene Höhe nur für die Mitte — und ein
// Körper mit breitem Fuß hängt dann über allem, was tiefer liegt:
//   · der Turm steht am Hang, seewarts fällt der Grund weg, die Basis hängt in der Luft;
//   · der Vulkan steht auf einer Kuppe, ringsum fällt alles ab, also sitzt er obenauf wie ein Hut.
// Dass es beim Vulkan schlimmer aussieht, ist Maßstab, nicht Ursache: sein Fuß ist 0,175 u breit,
// der des Turms 0,054 u — dreimal so viel Flanke, dreimal so viel Luft.
// Also liest ab jetzt jede Requisite ihre **eigene Grundfläche** ab und nimmt die TIEFSTE Stelle.
// Damit steckt der Rand im Boden statt zu schweben; was in der Mitte zu viel eintaucht, ist unter
// dem Körper und unsichtbar. Zu tief ist verzeihlich, zu hoch nicht — das ist dieselbe Regel,
// nach der der Bodenschein weiter oben seine Reserve bekommt.
// **Nachtrag 2.9., nach der Abnahme — der erste Anlauf war überkorrigiert.**
// Das rohe Ringminimum zu nehmen war falsch, und die Messung sagt um wieviel: Vulkan 1 lag zu
// 88 % im Boden, der Krater noch 19 mm drüber (Lava spawnt auf Bodenhöhe), und der Bodenschein
// aller drei Türme lag wieder UNTER dem Gelände — −7,7 cm statt der −8,19 mm, für die der
// Platzierungsvertrag überhaupt umgeschrieben wurde. Verschlimmbessert, Faktor neun.
// **Der Denkfehler:** beide Requisiten stehen per Prädikat dort, wo es steil ist — der Turm an
// der Küste (eine Seite fällt immer ins Wasser), der Vulkan auf einer Kuppe. Das Ringminimum
// ist dort nicht „der Boden unter der Requisite", sondern der Hangfuß ein Stück weiter unten.
// Wer sich danach setzt, pflanzt sich an den Hangfuß, während er auf der Kuppe steht.
// Also ein **Deckel am eigenen Maßstab**: tiefer als der Deckel unter die eigene Mitte geht keine
// Requisite. Der Rand darf ein wenig überhängen — sichtbar ist er erst, wenn er es deutlich tut.
function tiefsterGrund(THREE, n, weite, proben, lesen, deckel) {
  let tief = lesen(n);
  if (tief == null) return null;
  const mitte = tief;
  const t1 = new THREE.Vector3(Math.abs(n.y) > 0.9 ? 1 : 0, Math.abs(n.y) > 0.9 ? 0 : 1, 0);
  t1.crossVectors(t1, n).normalize();
  const t2 = new THREE.Vector3().crossVectors(n, t1).normalize();
  const p = new THREE.Vector3();
  for (let i = 0; i < proben; i++) {
    const a = (i / proben) * Math.PI * 2;
    p.copy(n).addScaledVector(t1, Math.cos(a) * weite)
             .addScaledVector(t2, Math.sin(a) * weite).normalize();
    const r = lesen(p);
    if (r != null && r < tief) tief = r;
  }
  return deckel > 0 ? Math.max(tief, mitte - deckel) : tief;
}

// ⚠ **Ein Eingang für „wie hoch ist der Boden": `bodenRadius`.**
// Die Abnahme hat gemessen, was die Höhenfunktion hier anrichtet: der Bodenschein lag bei zwei von
// drei Leuchttürmen UNTER dem Gelände (−8,19 mm / −1,13 mm / +0,46 mm), weil `surfaceAltitudeAt`
// bis ±8 mm von den gebackenen Dreiecken abweicht — ein Versatz von 1,4 mm überlebt das nicht.
// Also platziert diese Datei nicht mehr selbst: der Wirt gibt `bodenRadius(up)` herein
// (`boden-lesung.js`, dieselbe Dreiecks-Ebenenlesung, mit der der Mech steht). Fällt der Eingang
// weg, bleibt die Höhenfunktion der Rückfall — sichtbar im Tor, nicht stillschweigend.
export function createVulkane({ THREE, radius, seed, terrainType, anzahl = 2,
                                bodenRadius = null, params = {} }) {
  const P = Object.assign({ on: true, hoehenSchwelle: 0.4 }, params);
  const group = new THREE.Group();
  group.name = 'vulkane';
  const _y = new THREE.Vector3(0, 1, 0);
  // Prädikat der Sorte: Hochland. Dieselbe Schwelle wie die Quelle (elevation > 0.4).
  const hochland = (n) => {
    const s = sampleTerrain(seed, terrainType, n.x, n.y, n.z);
    return s.isLand && s.elevation > P.hoehenSchwelle;
  };
  const orte = P.on ? streuen({ THREE, count: anzahl, seed, salt: 7723, gueltig: hochland,
                                minSep: 0.9, maxRad: 0.22, ringe: 6 }) : [];
  const vulkane = [];
  for (let i = 0; i < orte.length; i++) {
    const n = orte[i];
    const g = new THREE.Group();
    const geo = vulkanGeometrie(THREE, (seed | 0) + i * 7723451);
    const mat = new THREE.MeshPhongMaterial({ vertexColors: true, flatShading: true,
                                              emissive: 0x2a0a00, shininess: 5,
                                              side: THREE.DoubleSide });
    // ⚠ **Der Term, den ich beim Portieren verloren hatte** (Abnahme 1.9.): die Quelle ruft
    // direkt nach dem Material `addRimLight(mat, 0xff5533, 0.52, 2.55)` — der Fresnel-Rand ist
    // laut eigener Panel-Notiz dieses Projekts *„eines der beiden billigsten Dinge der Quelle, die
    // wir nicht hatten"*, und ohne ihn liest ein Prop sich flach gegen den Himmel. Der Kopf dieser
    // Datei nannte den Körper trotzdem zeichengleich — also war der Text besser als der Code.
    // **Benannte Abweichung:** unser `addRimLight` benutzt den GETEILTEN Randton
    // (`globalRimColor`, 0xffeebb, vom Tageszeit-Preset gefahren) und ignoriert das Farbargument.
    // Die Quelle gibt dem Vulkan sein eigenes Rot 0xff5533. Wir übernehmen Stärke und Exponent
    // (0,52 / 2,55) und lassen den Ton beim einen Eigentümer — eine zweite Randfarbe wäre ein
    // zweiter Schreiber für dieselbe Sache.
    initRimLight(THREE);
    addRimLight(mat, 0xff5533, 0.52, 2.55);
    const koerper = new THREE.Mesh(geo, mat);
    koerper.castShadow = true;
    g.add(koerper);
    // Lava + Rauch: zwei InstancedMesh, beide additiv, beide ohne Frustum-Culling (Quelle).
    const lavaGeo = new THREE.SphereGeometry(0.02, 5, 4);
    const lavaLife = new THREE.InstancedBufferAttribute(new Float32Array(LAVA), 1);
    lavaGeo.setAttribute('aLife', lavaLife);
    const lavaMat = new THREE.ShaderMaterial({ vertexShader: LAVA_VERT, fragmentShader: LAVA_FRAG,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const lava = new THREE.InstancedMesh(lavaGeo, lavaMat, LAVA);
    lava.frustumCulled = false; lava.renderOrder = 10; g.add(lava);
    const rauchGeo = new THREE.PlaneGeometry(0.07, 0.07);
    const rauchLife = new THREE.InstancedBufferAttribute(new Float32Array(RAUCH), 1);
    rauchGeo.setAttribute('aLife', rauchLife);
    const rauchMat = new THREE.ShaderMaterial({ vertexShader: SMOKE_VERT, fragmentShader: SMOKE_FRAG,
      uniforms: { uOpacity: { value: 1 } }, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const rauch = new THREE.InstancedMesh(rauchGeo, rauchMat, RAUCH);
    rauch.frustumCulled = false; rauch.renderOrder = 11; g.add(rauch);

    // Der Grund unter der ganzen Fußfläche (Begründung an `tiefsterGrund`). Der Fuß des Kegels
    // misst S·0,5 in der Breite; die Ringweite ist genau das, in Bogenmaß auf der Kugel.
    const lesen = (u) => (bodenRadius ? bodenRadius(u)
      : radius + Math.max(0, surfaceAltitudeAt(seed, terrainType, u.x, u.y, u.z)));
    // Deckel S·0,15: der Kegel sinkt höchstens 15 % seiner Fußbreite unter die eigene Mitte,
    // dazu das Einsinken der Quelle. Ohne Deckel waren es 88 % der Kegelhöhe (Abnahme 2.9.).
    const gemessen = bodenRadius
      ? tiefsterGrund(THREE, n, (S * 0.5) / radius, 8, lesen, S * 0.15) : null;
    const rBoden = gemessen != null ? gemessen
      : radius + Math.max(0, surfaceAltitudeAt(seed, terrainType, n.x, n.y, n.z));
    const rr = rBoden - S * 0.42;            // Einsinken wie in der Quelle
    g.position.copy(n).multiplyScalar(rr);
    g.quaternion.setFromUnitVectors(_y, n);
    group.add(g);

    const sref = { s: ((seed | 0) + i * 6971) >>> 0 };
    const blobs = [], wisps = [];
    for (let k = 0; k < LAVA; k++) blobs.push({
      pos: new THREE.Vector3((rand01(sref) - 0.5) * 0.03, S * H * 0.92, (rand01(sref) - 0.5) * 0.03),
      vel: new THREE.Vector3((rand01(sref) - 0.5) * 0.12, 0.12 + rand01(sref) * 0.16, (rand01(sref) - 0.5) * 0.12),
      life: rand01(sref) * 3, maxLife: 2.5 + rand01(sref) * 2, scale: 0.8 + rand01(sref) * 0.8 });
    for (let k = 0; k < RAUCH; k++) {
      const b = 1 + rand01(sref) * 1.2;
      wisps.push({ pos: new THREE.Vector3((rand01(sref) - 0.5) * 0.04, S * H * 0.95 + rand01(sref) * 0.05, (rand01(sref) - 0.5) * 0.04),
        vel: new THREE.Vector3((rand01(sref) - 0.5) * 0.008, 0.025 + rand01(sref) * 0.025, (rand01(sref) - 0.5) * 0.008),
        life: rand01(sref) * 3, maxLife: 2.5 + rand01(sref) * 2.5, scale: b, basis: b });
    }
    vulkane.push({ n, gruppe: g, lava, rauch, lavaLife, rauchLife, blobs, wisps, sref,
                   krater: n.clone().multiplyScalar(rr + S * H * 0.92) });
  }

  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3();
  return {
    name: 'vulkane', group, params: P, orte: vulkane.map((v) => v.n),
    krater: vulkane.map((v) => v.krater),
    update(dt) {
      if (!P.on) return;
      for (const v of vulkane) {
        for (let i = 0; i < LAVA; i++) {
          const b = v.blobs[i];
          b.life += dt;
          if (b.life >= b.maxLife || b.pos.y < 0) {
            b.pos.set((rand01(v.sref) - 0.5) * 0.03, S * H * 0.92, (rand01(v.sref) - 0.5) * 0.03);
            b.vel.set((rand01(v.sref) - 0.5) * 0.12, 0.12 + rand01(v.sref) * 0.16, (rand01(v.sref) - 0.5) * 0.12);
            b.life = 0; b.maxLife = 2.5 + rand01(v.sref) * 2; b.scale = 0.8 + rand01(v.sref) * 0.8;
          }
          b.vel.y -= 0.08 * dt;
          b.pos.addScaledVector(b.vel, dt);
          const lr = Math.min(1, b.life / b.maxLife);
          const decay = lr < 0.7 ? 1 : 1 - (lr - 0.7) / 0.3;
          v.lavaLife.setX(i, lr);
          _q.identity(); _s.setScalar(b.scale * decay);
          _m.compose(b.pos, _q, _s); v.lava.setMatrixAt(i, _m);
        }
        v.lava.instanceMatrix.needsUpdate = true; v.lavaLife.needsUpdate = true;
        for (let i = 0; i < RAUCH; i++) {
          const w = v.wisps[i];
          w.life += dt;
          if (w.life >= w.maxLife) {
            w.basis = 1 + rand01(v.sref) * 1.2;
            w.pos.set((rand01(v.sref) - 0.5) * 0.04, S * H * 0.95 + rand01(v.sref) * 0.05, (rand01(v.sref) - 0.5) * 0.04);
            w.vel.set((rand01(v.sref) - 0.5) * 0.008, 0.025 + rand01(v.sref) * 0.025, (rand01(v.sref) - 0.5) * 0.008);
            w.life = 0; w.maxLife = 2.5 + rand01(v.sref) * 2.5;
          }
          w.pos.addScaledVector(w.vel, dt);
          const lr = w.life / w.maxLife;
          v.rauchLife.setX(i, lr);
          _q.identity(); _s.setScalar(w.basis * (1 + lr * 1.5));
          _m.compose(w.pos, _q, _s); v.rauch.setMatrixAt(i, _m);
        }
        v.rauch.instanceMatrix.needsUpdate = true; v.rauchLife.needsUpdate = true;
      }
    },
    /** ⚠ Liest die GEBAUTE Szene: wieviele stehen, auf welcher Höhe, wie weit auseinander. */
    tor() {
      if (!P.on) return { ok: false, text: '— volcanoes off' };
      const hoehen = vulkane.map((v) => sampleTerrain(seed, terrainType, v.n.x, v.n.y, v.n.z).elevation);
      const abst = vulkane.length > 1
        ? vulkane[0].n.angleTo(vulkane[1].n) * 180 / Math.PI : null;
      const partikel = vulkane.length * (LAVA + RAUCH);
      // ⚠ Gelesen wird das GEBAUTE Material: hat der Randterm den Shader gepatcht?
      const koerperMat = vulkane.length && vulkane[0].gruppe.children[0]
        ? vulkane[0].gruppe.children[0].material : null;
      const rand = !!(koerperMat && koerperMat.onBeforeCompile
                      && String(koerperMat.onBeforeCompile).indexOf('rimIntensity') >= 0);
      const ok = vulkane.length === anzahl && hoehen.every((h) => h > P.hoehenSchwelle) && rand;
      return { ok, anzahl: vulkane.length, hoehen: hoehen.map((h) => +h.toFixed(2)),
        text: (ok ? '✓' : '✗') + ' ' + vulkane.length + '/' + anzahl + ' volcanoes on highland'
          + ' · elevation ' + hoehen.map((h) => h.toFixed(2)).join(' / ')
          + ' (source demands > ' + P.hoehenSchwelle + ')'
          + (abst != null ? ' · ' + abst.toFixed(0) + '° apart' : '')
          + ' · ' + partikel + ' additive particles (' + LAVA + ' lava + ' + RAUCH + ' smoke each)'
          + ' · rim light ' + (rand ? '✓ patched (0.52 / 2.55 from source; hue is the shared rim colour, not the source’s 0xff5533)' : '✗ MISSING')
          + (ok ? '' : (rand ? ' — ⚠ the highland predicate did not hold' : ' — ⚠ the body reads flat against the sky')) };
    },
  };
}

export function createLeuchttuerme({ THREE, radius, seed, terrainType, anzahl = 3,
                                    bodenRadius = null, params = {} }) {
  const P = Object.assign({ on: true, hoehe: 0.18, ringWeite: 0.04, ringProben: 8,
                            wasserMin: 0.25, wasserMax: 0.75, drehung: 0.8,
                            // v10 · Das Punktlicht in der Laterne. Reichweite in TURMHÖHEN, nicht
                            // in Weltmeter — sonst hängt die Lichtstimmung an `hoehe`.
                            lampenFarbe: 0xffc878, lampenWeite: 7.0, lampenAbfall: 1.5,
                            lampenNacht: 0, lampenBahn: 0.30,
                            // Eigenglut je Material bei voller Nacht (v10, siehe `setNacht`).
                            // Sie ist der EINZIGE Nachtträger des Turms — Begründung dort.
                            glutWeiss: 0.52, glutRot: 0.80, glutStein: 0.42 }, params);
  const group = new THREE.Group();
  group.name = 'leuchttuerme';
  const _y = new THREE.Vector3(0, 1, 0);
  // Prädikat der Sorte: KÜSTE. Land unter dem Fuß, Wasser im Ring — die Idee von
  // `waterRatioAround` als Bedingung statt als Filter.
  const wasserAnteil = (n) => {
    const t1 = new THREE.Vector3(), t2 = new THREE.Vector3(), p = new THREE.Vector3();
    t1.crossVectors(n, Math.abs(n.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : _y).normalize();
    t2.crossVectors(n, t1).normalize();
    let w = 0;
    for (let i = 0; i < P.ringProben; i++) {
      const a = (i / P.ringProben) * Math.PI * 2;
      p.copy(n).addScaledVector(t1, Math.cos(a) * P.ringWeite)
               .addScaledVector(t2, Math.sin(a) * P.ringWeite).normalize();
      if (!isLand(seed, terrainType, p.x, p.y, p.z)) w++;
    }
    return w / P.ringProben;
  };
  const kueste = (n) => {
    if (!isLand(seed, terrainType, n.x, n.y, n.z)) return false;
    const w = wasserAnteil(n);
    return w >= P.wasserMin && w <= P.wasserMax;
  };
  const orte = P.on ? streuen({ THREE, count: anzahl, seed, salt: 5551, gueltig: kueste,
                                minSep: 0.6, maxRad: 0.16, ringe: 6 }) : [];

  // Farben: KFB (Tusche-Palette), Mechanik: Quelle. Fünf Teile statt vierzehn.
  // v10 · Die drei Materialien tragen eine EIGENGLUT in ihrem eigenen Buntton, die nachts
  // aufgedreht und tags abgedreht wird (`setNacht`). Begründung unten am Punktlicht.
  const stein = new THREE.MeshPhongMaterial({ color: 0x453d35, emissive: 0x3b3128,
    emissiveIntensity: 0, flatShading: true, shininess: 4 });
  const weiss = new THREE.MeshPhongMaterial({ color: 0xf6efdf, emissive: 0xffdcae,
    emissiveIntensity: 0, flatShading: true, shininess: 8 });
  const rot = new THREE.MeshPhongMaterial({ color: 0xc8382c, emissive: 0xc8382c,
    emissiveIntensity: 0, flatShading: true, shininess: 8 });
  // v10 · Die dunkle Tusche des Laternenhauses. Ohne sie ist eine Laterne eine Glühbirne.
  const rahmen = new THREE.MeshPhongMaterial({ color: 0x241d18, flatShading: true, shininess: 12 });
  const lampe = new THREE.MeshPhongMaterial({ color: 0xffe9b8, emissive: 0xffc46a,
    emissiveIntensity: 1.0, flatShading: true, shininess: 30,
    transparent: true, opacity: 0.92 });
  // ── v9b · Der Strahl fädet aus, statt mit einem Kreis zu enden ────────────────────────
  // **Georg, 1.9. am Bild:** *„bei tiny skies endet der Strahl des Leuchtturms nicht mit Kreis,
  // sondern fadet natürlich aus.“* Richtig, und die Ursache war unsere Materialwahl: ein
  // `MeshBasicMaterial` mit konstanter Deckkraft färbt jeden Punkt des Kegels gleich stark — damit
  // ist die offene Deckfläche am fernen Ende eine sichtbare Ellipse und der Kegel liest als Keil
  // mit Deckel. Der Kegel selbst ist schon offen (`openEnded`), es fehlte die Verlaufsfunktion.
  // Jetzt ein Shader mit zwei Verläufen:
  //   · **entlang der Achse** — `uv.y` läuft von 0 (Laterne, schmales Ende) nach 1 (fernes Ende);
  //     Alpha fällt mit `(1 − uv.y)^1.6` auf null, also gibt es am Ende nichts zum Abschneiden.
  //   · **über die Silhouette** — streifend gesehene Flächen tragen mehr Licht als frontale
  //     (`1 − |n·view|`), das ist der Grund, warum ein echter Lichtkegel an den Rändern dichter
  //     wirkt. Beides multiplikativ, additiv geblendet, ohne Tiefenschreiben.
  // ⚠ **UNSERE Zahlen, benannt:** die Shader-Zeilen der Quelle (`Globe.ts` ~5560–5620) sind nicht
  // gelesen — drei Suchen haben nur Geometrie und Aufrufstellen geliefert. Der Verlauf ist aus dem
  // BILD gebaut (hellste Stelle an der Laterne, kein Deckel, weicher Auslauf), nicht aus dem Code.
  const STRAHL_VERT = `
varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main() {
  vUv = uv;
  vN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;
  const STRAHL_FRAG = `
uniform vec3 uColor; uniform float uOpacity;
varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main() {
  float laenge = pow(clamp(1.0 - vUv.y, 0.0, 1.0), 1.6);
  float streif = 1.0 - abs(dot(normalize(vN), normalize(vV)));
  float a = laenge * (0.35 + 0.65 * streif) * uOpacity;
  gl_FragColor = vec4(uColor, a);
}`;
  const strahlMat = new THREE.ShaderMaterial({
    vertexShader: STRAHL_VERT, fragmentShader: STRAHL_FRAG,
    uniforms: { uColor: { value: new THREE.Color(0xffcf72) }, uOpacity: { value: 0.58 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  // Laternen-Schein und Bodenschein — die Quelle hat beide (`glowMesh` an `lanternY`,
  // `groundGlowMesh` mit dem GETEILTEN Bodenschein-Shader, den wir aus `Globe.ts` gelesen haben:
  // warmes Orange `vec3(1.0, 0.6, 0.1)`, `alpha = smoothstep(0.5, 0.0, dist)² · 0.4`).
  // ── v10 · Der Schein ist ein SCHEIN, keine Kugel ─────────────────────────────────
  // **Georg, 2.9. am tinyskies-Bild:** *„wir haben noch helle Bälle statt Lichtschein der Kuppel".*
  // Die Ursache stand hier: eine additive KUGEL mit KONSTANTER Deckkraft. Additiv plus konstant
  // ergibt überall dieselbe Helligkeit, und eine gleichmäßig helle Kugel ist genau das, was ein
  // Auge als Körper liest — ein Ball neben der Kuppel, nicht Licht aus ihr. Dieselbe Fehlerklasse
  // wie beim Strahl (v9b: konstante Deckkraft macht aus einem Kegel einen Keil mit Deckel), nur
  // eine Zeile weiter oben, und ich habe sie damals nicht mitrepariert.
  // Jetzt: eine Fläche, die zur Kamera schaut, mit radialem Abfall — innen warm und dicht, außen
  // auf null. Kein Rand, also kein Körper. Und die Farbe kommt aus dem Kern nach außen kühler,
  // weil echte Streuung genau das tut.
  const scheinMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uOpacity: { value: 0.85 } },
    vertexShader: `varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform float uOpacity; varying vec2 vUv;
void main(){
  float d = length(vUv - 0.5) * 2.0;
  float kern = pow(clamp(1.0 - d, 0.0, 1.0), 2.6);
  float hof  = pow(clamp(1.0 - d, 0.0, 1.0), 0.9) * 0.28;
  vec3 c = mix(vec3(1.0, 0.72, 0.34), vec3(1.0, 0.95, 0.82), kern);
  gl_FragColor = vec4(c, (kern + hof) * uOpacity);
}`,
  });
  const bodenScheinMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec2 vUv;
void main() {
  float d = distance(vUv, vec2(0.5));
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vec3(1.0, 0.6, 0.1), a * a * 0.4);
}`,
  });
  const hT = P.hoehe;
  const strahlen = [];
  const scheine = [];   // v10 · die Scheine schauen zur Kamera, siehe update()
  const lampen = [];    // v10 · je Turm ein warmes Punktlicht, siehe unten
  const aufMesh = [];   // je Turm: wurde die Höhe am NETZ gelesen (true) oder geraten (false)?
  for (let i = 0; i < orte.length; i++) {
    const n = orte[i];
    const g = new THREE.Group();
    const sockel = new THREE.Mesh(new THREE.CylinderGeometry(hT * 0.34, hT * 0.40, hT * 0.10, 12), stein);
    sockel.position.y = hT * 0.05; g.add(sockel);
    const turmGeo = new THREE.CylinderGeometry(hT * 0.17, hT * 0.26, hT, 16);
    turmGeo.translate(0, hT / 2, 0);
    g.add(new THREE.Mesh(turmGeo, weiss));
    for (const [y, h] of [[hT * 0.55, hT * 0.12], [hT * 0.30, hT * 0.10]]) {
      const rGeo = new THREE.CylinderGeometry(hT * 0.205, hT * 0.225, h, 16);
      rGeo.translate(0, y, 0);
      g.add(new THREE.Mesh(rGeo, rot));
    }
    // ── v10 · Das Laternenhaus, nach dem tinyskies-Bild ─────────────────────────────────
    // Was dort ein Leuchtturm sein lässt und bei uns fehlte, sind nicht mehr Teile, sondern
    // die DUNKLE FASSUNG: Galerie, Geländer, zwei Rahmenringe, Knauf. Ein warmer Zylinder ohne
    // Fassung ist eine Glühbirne; derselbe Zylinder zwischen zwei Tusche-Ringen ist Glas.
    // Sprossen (senkrechte Streben) sind bewusst NICHT gebaut: der Turm misst 0,18 u und steht
    // im Bild etwa sechzig Pixel hoch — sechs Streben je Turm wären achtzehn Draw-Calls für
    // etwas, das unter einem Pixel breit ist. Die Fassung trägt die Lesbarkeit, nicht das Detail.
    const deck = new THREE.Mesh(new THREE.CylinderGeometry(hT * 0.25, hT * 0.25, hT * 0.035, 12), rahmen);
    deck.position.y = hT; g.add(deck);
    const gelaender = new THREE.Mesh(
      new THREE.CylinderGeometry(hT * 0.245, hT * 0.245, hT * 0.055, 12, 1, true), rahmen);
    gelaender.position.y = hT * 1.03; g.add(gelaender);
    const laterne = new THREE.Mesh(new THREE.CylinderGeometry(hT * 0.135, hT * 0.135, hT * 0.15, 12), lampe);
    laterne.position.y = hT * 1.09; g.add(laterne);
    for (const y of [hT * 1.017, hT * 1.163]) {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(hT * 0.145, hT * 0.145, hT * 0.018, 12), rahmen);
      ring.position.y = y; g.add(ring);
    }
    const dach = new THREE.Mesh(new THREE.ConeGeometry(hT * 0.195, hT * 0.13, 12), rot);
    dach.position.y = hT * 1.235; g.add(dach);
    const knauf = new THREE.Mesh(new THREE.SphereGeometry(hT * 0.026, 8, 6), rahmen);
    knauf.position.y = hT * 1.315; g.add(knauf);
    // Der Strahl: liegender Kegel, wie in der Quelle gebaut und gedreht.
    const len = hT * 9, spread = hT * 0.5;
    const bGeo = new THREE.CylinderGeometry(spread, 0.002, len, 12, 1, true);
    bGeo.rotateZ(-Math.PI / 2);
    bGeo.translate(len / 2, 0, 0);
    const strahl = new THREE.Mesh(bGeo, strahlMat);
    strahl.position.y = hT * 1.09;
    strahl.frustumCulled = false;
    g.add(strahl);
    strahlen.push(strahl);
    // Laternen-Schein: eine Fläche, die zur Kamera schaut (Begründung am Material oben).
    const schein = new THREE.Mesh(new THREE.PlaneGeometry(hT * 0.66, hT * 0.66), scheinMat);
    schein.position.y = hT * 1.09;
    schein.frustumCulled = false;
    g.add(schein);
    scheine.push(schein);
    // ── v10 · Dritter Anlauf, und diesmal eine ENTSCHEIDUNG statt einer Zahl ────────────────
    // Hier stand zweimal ein Punktlicht, und beide Male hat die Messung es widerlegt:
    //  1 auf der Turmachse — wirkungslos (N·L ≈ 0 am Zylindermantel; 0,55 und 20 ergaben
    //    denselben Pixel #070b19),
    //  2 seitlich, mitfahrend — überbelichtet (Schaft #fffff3, Ring #ffff74: der Buntton des
    //    Rots war gelöscht, also genau die Kardinalsünde aus `light-budget.js`, SAT_KEEP 0,55).
    // **Die Ursache des zweiten Fehlers ist keine falsche Zahl, sondern eine falsche Größenordnung.**
    // Die Laterne steht 0,023 u über der Schaftfläche und 0,5…3 u über dem Wasser, das sie
    // erhellen soll — Faktor hundert. Eine Abklingkurve, die auf dem Wasser noch etwas tut, ist
    // am Schaft praktisch ungebremst; eine, die den Schaft schont, erreicht das Wasser nie.
    // Ein Punktlicht kann diese beiden Aufgaben nicht gleichzeitig erfüllen, egal bei welcher
    // Intensität. Also tut es keine davon mehr: **das Licht ist raus.**
    // Die Nacht trägt jetzt, wer sie tragen kann, jeder für seine eigene Sache:
    //   · die FARBE des Turms — Eigenglut je Material in seinem eigenen Buntton (S3i,
    //     wörtlich aus `sky-dice.js`: fast-schwarze Materialien werden gehoben),
    //   · die FORM — das kalte Globus-Rig, das ohnehin auf ihn fällt,
    //   · die UMGEBUNG — der Bodenschein (liegt schon da) und der Strahl.
    // Der Lichthaushalt geht damit auf neun Lichter zurück: keine Summe, die heimlich wächst.
    // (`lampenNacht > 0` baut das Punktlicht wieder ein — der Rückweg ist EINE Zahl, aber er
    // ist als Versuch markiert, nicht als Vorgabe.)
    if (P.lampenNacht > 0) {
      const lampenLicht = new THREE.PointLight(P.lampenFarbe, 0, hT * P.lampenWeite, P.lampenAbfall);
      lampenLicht.name = 'lighthouse-lamp';
      lampenLicht.castShadow = false;
      lampenLicht.position.set(hT * P.lampenBahn, hT * 1.09, 0);
      g.add(lampenLicht);
      lampen.push(lampenLicht);
    }
    // Bodenschein: eine Scheibe auf dem Grund, mit dem Shader der Quelle.
    const boden = new THREE.Mesh(new THREE.PlaneGeometry(hT * 3.4, hT * 3.4), bodenScheinMat);
    boden.rotation.x = -Math.PI / 2;
    // Der Schein liegt über dem GELESENEN Boden: die Gruppe sitzt hT·0,02 tief, also muss er
    // mindestens so weit hoch — plus Luft gegen Z-Fighting. 1,4 mm waren zu wenig, sobald die
    // Höhe geraten war; jetzt ist die Höhe gemessen und der Versatz eine bewusste Reserve.
    boden.position.y = hT * 0.035;
    g.add(boden);

    // Der Grund unter der ganzen Basis (Begründung an `tiefsterGrund`). Der Sockel misst
    // hT·0,3 in der Breite — der Turm steht auf einer Küste, also fällt eine Seite immer ab.
    const lesenL = (u) => (bodenRadius ? bodenRadius(u)
      : radius + Math.max(0, surfaceAltitudeAt(seed, terrainType, u.x, u.y, u.z)));
    // Deckel hT·0,12 — mehr als ein Achtel der Turmhöhe darf die Küstenkante nicht ziehen.
    const gemessen = bodenRadius
      ? tiefsterGrund(THREE, n, (hT * 0.3) / radius, 8, lesenL, hT * 0.12) : null;
    const rMitte = lesenL(n);
    const rBoden = gemessen != null ? gemessen
      : radius + Math.max(0, surfaceAltitudeAt(seed, terrainType, n.x, n.y, n.z));
    aufMesh.push(gemessen != null);
    g.position.copy(n).multiplyScalar(rBoden - hT * 0.02);
    // ⚠ **Der Bodenschein folgt dem Einsinken, statt eine feste Höhe zu raten.**
    // Er lag bei allen drei Türmen unter dem Gelände, weil hT·0,035 gegen die MITTE gerechnet
    // war, die Gruppe aber nach dem Ringminimum tiefer sitzt. Jetzt ist sein Abstand gemessen:
    // so viel, wie die Gruppe abgesackt ist, plus die alte Reserve.
    if (rMitte != null) boden.position.y = (rMitte - rBoden) + hT * 0.055;
    g.quaternion.setFromUnitVectors(_y, n);
    group.add(g);
  }
  let t = 0;
  let kamera = null;
  const _wp = new THREE.Vector3();
  return {
    name: 'leuchttuerme', group, params: P, orte,
    /** v10 · Der Schein braucht die Kamera, sonst ist er eine Scheibe mit Kante. Der Wirt
     *  reicht sie herein wie bei `carpet-wake` — EIN Eigentümer der Kamera bleibt der Wirt. */
    setCamera(c) { kamera = c || null; },
    /** v10 · Nacht 0…1 vom EINEN Nachtgewicht des Wirts (`zyklus.nachtGewicht`) — wie
     *  `avatar-lamp.setNacht`. Kein zweiter Nachtbegriff, keine eigene Uhr. */
    setNacht(w) {
      const n = Math.max(0, Math.min(1, w || 0));
      const s = n * P.lampenNacht;
      for (let i = 0; i < lampen.length; i++) lampen[i].intensity = P.on ? s : 0;
      // Eigenglut nur nachts: tags würde sie den Turm in der Sonne auswaschen (genau der
      // Fehler, den `sky-dice` mit `bodyLift` + `glow` schon einmal gemacht hat — Neongelb).
      weiss.emissiveIntensity = n * P.glutWeiss;
      rot.emissiveIntensity = n * P.glutRot;
      stein.emissiveIntensity = n * P.glutStein;
    },
    update(dt) {
      if (!P.on) return;
      t += dt;
      const w = t * P.drehung;                 // Quelle: lighthouseBeamTime * 0.8
      for (let i = 0; i < strahlen.length; i++) strahlen[i].rotation.y = w + i * 2.1;
      // v10 · Das Licht fährt mit seinem Strahl — dieselbe Winkelrechnung, kein zweiter Takt.
      const r = hT * P.lampenBahn;
      for (let i = 0; i < lampen.length; i++) {
        const a = w + i * 2.1;
        lampen[i].position.set(Math.sin(a) * r, hT * 1.09, Math.cos(a) * r);
      }
      if (kamera) {
        kamera.getWorldPosition(_wp);
        for (let i = 0; i < scheine.length; i++) scheine[i].lookAt(_wp);
      }
    },
    tor() {
      if (!P.on) return { ok: false, text: '— lighthouses off' };
      const w = orte.map((n) => wasserAnteil(n));
      const gelesen = aufMesh.filter(Boolean).length;
      const ok = orte.length === anzahl && w.every((v) => v >= P.wasserMin && v <= P.wasserMax)
                 && gelesen === orte.length;
      return { ok, anzahl: orte.length, wasser: w.map((v) => +v.toFixed(2)),
        text: (ok ? '✓' : '✗') + ' ' + orte.length + '/' + anzahl + ' lighthouses on coast'
          + ' · water share in the ' + (P.ringWeite * 100).toFixed(0) + '-unit ring: '
          + w.map((v) => (v * 100).toFixed(0) + ' %').join(' / ')
          + ' (demanded ' + (P.wasserMin * 100) + '–' + (P.wasserMax * 100) + ' %)'
          + ' · tower ' + hT.toFixed(2) + ' u (source towerH 0.18), beam ' + P.drehung
          + ' rad/s (source 0.8)'
          + ' · height read off the MESH at ' + gelesen + '/' + orte.length
          + (gelesen === orte.length ? '' : ' — ⚠ the rest fell back to the height function (±8 mm)')
          + ' · beam fades along the axis (no end cap) + lantern glow + ground'
          + ' glow with the source’s shared shader · ring numbers are OURS (0.04 / 8 probes / 25–75 %): the'
          + ' lighthouse-specific CHECK_DIST and WATER_CHECKS in Globe.ts 5369–5400 were not read,'
          + ' neighbours use 0.04/6 (coconuts) and 0.05/10 (villages)'
          + (ok ? '' : ' — ⚠ the coast predicate did not hold') };
    },
  };
}
