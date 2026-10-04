// ============================================================================
// muenzen.js — v12 · Die goldenen Münzen: Durchflug-Sammelgut statt Wahrzeichen
// ----------------------------------------------------------------------------
// **Anlass (Georg, 3.9.):** „unsere braun-grauen assets wie castle und auch die grau-braunen
// riesen-coins würde ich rausnehmen → die (goldenen) coins können eher als sammel-assets per
// großzügigen durchflug (wie die diamonds im TS) +1 ‚Pop‘ pro coin geben."
//
// Die stehende Riesenmünze war seit 29.8. ein Wahrzeichen — „der Witz ist die Größe" (0,22 u,
// Gewicht 7 im surrealen Satz). Der Witz hat funktioniert, solange sie allein stand; als grau-
// brauner Klotz neben einer gebauten Vegetation liest sie nicht mehr als Gag, sondern als Rest.
// **Ein Asset, das seine Rolle verloren hat, wird nicht kleiner gemacht — es bekommt eine andere.**
// Aus dem Wahrzeichen wird das Sammelgut: klein, golden, drehend, und man holt es sich im Flug.
//
// **Quelle für Mechanik und Timing** (georg-doc/tinyskies, gelesen 3.9.):
//   `Rings.ts`          — Diamanten als Durchflug-Sammelgut: Spawn-Ease 0,5 s (easeOutCubic mit
//                         `1 + 0,15·sin(πt)` Überschwinger), Spin 1,8 rad/s um die Flächennormale,
//                         Bob `lift 0,012 + sin(t·1,5 + φ)·0,017`, Sammelradius 0,19 (Teppich)
//                         bzw. 0,30 (Flugzeug), Respawn nach 1,5–2,5 s an einem neuen Ort,
//                         Mindestabstand zwischen zwei Stücken.
//   `RingCollectVFX.ts` — der Einsammel-Ausbruch: 12 Splitter, additiv, Lebenszeit 0,55 s,
//                         `damp = 1/(1 + t·0,85)`, Fade `pow(1-p, 1.35)`, Helligkeit
//                         `1 + (1-p)·1,2`, Schrumpfen `1 - p·0,55`. Pool von 4 Ausbrüchen.
// Übernommen sind die ZAHLEN, nicht der Aufbau: unsere Welt hat Radius 5 gegen ihre Flughöhen von
// 0,55–1,35, wir fliegen auf 0,03 über Grund. Ein 1:1 kopierter Sammelradius von 0,19 wäre bei uns
// ein Staubsauger. Umgerechnet auf unser Maß sind das ~0,05; Georg will **großzügig**, also 0,10.
//
// **⚠ Zweite Runde (Georg, 3.9.): „du hast eigene Münzen gebaut, statt der 3D coins, die wir im
// terrain hatten → größe und farbigkeit sollte sich an den sky-dice orientieren."**
// Er hat zweimal recht, und der zweite Teil ist der wichtigere.
//  (1) Das Asset war da. `KFB_Coin_01` (396 Dreiecke, ein farbiger Teil) stand seit dem 29.8. in der
//      Welt; ich habe es abgeräumt und daneben eine Scheibe aus Zylinder plus Torus gebaut. Die
//      v12-Doktrin „gebaut statt geladen" gilt für die FLÄCHE (Vegetation: tausende Exemplare,
//      AO, Saum, Wind) — nicht für ein einzelnes Kanon-Objekt mit eigener Silhouette. **Eine
//      Regel, die man auf ihren Gegenfall anwendet, ist keine Regel mehr, sondern ein Reflex.**
//  (2) Maß und Farbe gehören nicht mir. Die Würfel (sky-dice.js) sind das eingemessene
//      Sammelgut dieser Welt — durch drei Runden Georg-Abnahme gegangen („zu groß", „wirken wie
//      dunkle Gebäude", „Augen sehe ich nicht", „Neongelb"). Alles, was daraus gelernt wurde,
//      steht dort als Zahl: `size 0,05` · `bodyLift 0,26` (Helligkeit hoch, Sättigung dagegen
//      abgegeben, Hue unangetastet) · `pipHex #f2e8d0` Papiercreme · Eigenglut `body→glow 0,35`,
//      Phong `shininess 8 / specular #111111` · und die Regel, dass die Großzügigkeit im
//      `pickupPad` sitzt und NICHT in der Silhouette. Die Münze übernimmt das Ganze, statt sich
//      eine zweite Meinung dazu zu bilden. **Ein zweites Sammelgut mit eigenem Maßsystem wäre ein
//      zweiter Maßstab — dieselbe Fehlerklasse wie die zwölf handgesetzten `h:`-Werte vom 2.9.**
// Meine gebaute Scheibe bleibt als RÜCKFALL im Code (das Repo ist nicht immer erreichbar), und das
// Tor sagt, welcher Weg gerade steht — wie `fromGlb` bei den Würfeln.
//
// **Was dieses Modul NICHT tut:** eine eigene Uhr führen (`update(dt)` aus dem Frame-Loop),
// eigene Zufallsorte würfeln (`streuen()`), den Boden rechnen (`bodenRadius`), den Punktestand
// führen (das tut `collect-hud.js` — hier fliegt nur der Chip dorthin), Klang auslösen (der
// Aufrufer entscheidet über `onCollect`, damit der Effektbus EIN Eigentümer bleibt).
// ============================================================================
import { streuen } from './verteilung.js';
import { isLand } from './globe-field.js';
import { initRimLight, addRimLight } from './rim-light.js';

function seededRandom(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

const GLB_URL = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KFB_Coin_01.glb';

// Die Kanon-Farbe der Münze, im Satz der Würfel-Sitze gedacht: rot #c22d12 · gelb #d99a08 ·
// blau #1f5793 — die Münze ist das vierte Glied und liegt zwischen Gelb und Bernstein.
const MUENZE = { body: 0xc98a12, glow: 0xffd166 };
const PIP = 0xf2e8d0;               // Papiercreme, wörtlich der `pipHex` der Würfel
const GOLD = 0xf2c04a, GOLD_TIEF = 0xa9761f, GOLD_KANTE = 0xffe9a8;   // nur für den Rückfall

/** ⚠ **Wörtlich `bodyOf` aus sky-dice.js — kopiert, weil es dieselbe Frage ist.**
 *  Helligkeit hoch, aber je gehobenem Schritt Sättigung abgegeben; Hue bleibt. Der Grund steht
 *  dort ausführlich: **Sättigung und Helligkeit sind gemeinsam der Regler für „leuchtet"** — wer
 *  eine gesättigte Farbe aufhellt, ohne Sättigung abzugeben, bekommt Leuchtstoff. Genau das war
 *  meine erste Münze: volles Gold in sieben Lichtern ohne Tonemapping = weiße Pastille. */
function korpusFarbe(THREE, hex, lift) {
  const c = new THREE.Color(hex);
  if (lift > 0) {
    const h = {}; c.getHSL(h);
    const l = Math.max(h.l, lift);
    const gabe = Math.max(0, l - h.l);
    c.setHSL(h.h, Math.max(0.35, h.s - gabe * 1.5), l);
  }
  return c;
}

/** Die Münze: Scheibe mit erhabenem Rand und geprägter Mitte. Sechzehn Seiten, 88 Dreiecke —
 *  und die Farbe steckt in den Vertizes, damit ein Material für alle reicht (ein Draw-Call).
 *  Die Kante ist heller als die Fläche: DAS ist der Glanz, nicht ein Specular-Punkt. */
function muenzGeometrie(THREE, r, dicke) {
  const teile = [];
  const scheibe = new THREE.CylinderGeometry(r * 0.93, r * 0.93, dicke, 16, 1, false);
  const ring = new THREE.TorusGeometry(r * 0.9, dicke * 0.55, 6, 18);
  ring.rotateX(Math.PI / 2);
  const praegung = new THREE.CylinderGeometry(r * 0.42, r * 0.42, dicke * 1.9, 8, 1, false);
  teile.push([scheibe, GOLD], [ring, GOLD_KANTE], [praegung, GOLD_TIEF]);
  const fertig = [];
  for (const [g0, hex] of teile) {
    const g = g0.index ? g0.toNonIndexed() : g0;
    g.deleteAttribute('uv');
    const pos = g.attributes.position, n = pos.count;
    const col = new Float32Array(n * 3), c = new THREE.Color(hex), tmp = new THREE.Color();
    for (let i = 0; i < n; i++) {
      // Aufhellen zur Kante hin (Radius), leicht abdunkeln zur Rückseite — eine Münze, die von
      // beiden Seiten gleich hell ist, dreht sich sichtbar, blitzt aber nicht.
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const rad = Math.sqrt(x * x + z * z) / r;
      const f = 0.62 + 0.30 * Math.min(1, rad) + (y > 0 ? 0.08 : -0.05);
      tmp.copy(c).multiplyScalar(f);
      col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.rotateZ(Math.PI / 2);   // dünne Achse auf X — dieselbe Lage, in der das GLB gebacken wird
    fertig.push(g);
  }
  return fertig;
}

// ── Der Einsammel-Ausbruch, Zahlen aus RingCollectVFX.ts ────────────────────────────────
const SPLITTER = 12, POOL = 4, LEBEN = 0.55;
const splitterVert = `
varying vec3 vNorm;
void main() {
  vec4 p = instanceMatrix * vec4(position, 1.0);
  vNorm = normalize(normalMatrix * mat3(instanceMatrix) * normal);
  gl_Position = projectionMatrix * modelViewMatrix * p;
}`;
const splitterFrag = `
uniform vec3 color;
uniform float globalAlpha;
varying vec3 vNorm;
void main() {
  float light = 0.7 + 0.3 * abs(dot(vNorm, normalize(vec3(1.0, 2.0, 0.5))));
  gl_FragColor = vec4(color * light * 2.5, globalAlpha);
}`;

function splitterGeometrie(THREE, rnd) {
  const g = new THREE.BufferGeometry(), s = 0.035;
  const j = () => (rnd() - 0.5) * s * 0.7;
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    j(), s * (1 + rnd() * 0.6), j(),
    -s * (0.6 + rnd() * 0.8), -s * (0.3 + rnd() * 0.4), s * (0.2 + rnd() * 0.4),
    s * (0.6 + rnd() * 0.8), -s * (0.3 + rnd() * 0.4), -s * (0.2 + rnd() * 0.4),
  ]), 3));
  g.computeVertexNormals();
  return g;
}

function createAusbruch({ THREE, rnd, farbe = [1.0, 0.78, 0.28] }) {
  const group = new THREE.Group(); group.name = 'muenz-funken';
  const pool = [], _d = new THREE.Object3D(), _p = new THREE.Vector3();
  for (let i = 0; i < POOL; i++) {
    const mat = new THREE.ShaderMaterial({
      vertexShader: splitterVert, fragmentShader: splitterFrag,
      uniforms: { color: { value: farbe.slice() }, globalAlpha: { value: 1 } },
      transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
    });
    const mesh = new THREE.InstancedMesh(splitterGeometrie(THREE, rnd), mat, SPLITTER);
    mesh.frustumCulled = false; mesh.visible = false;
    group.add(mesh);
    const zust = [];
    for (let k = 0; k < SPLITTER; k++) zust.push({ v: new THREE.Vector3(), rv: new THREE.Euler(),
      rot: new THREE.Euler(), s: new THREE.Vector3(), a: 1 });
    pool.push({ mesh, mat, zust, t: 0, an: false, mitte: new THREE.Vector3() });
  }
  return {
    group,
    zuende(pos) {
      const inst = pool.find((p) => !p.an);
      if (!inst) return;
      inst.an = true; inst.t = 0; inst.mitte.copy(pos); inst.mesh.visible = true;
      const up = pos.clone().normalize();
      const hilf = Math.abs(up.dot(new THREE.Vector3(1, 0, 0))) > 0.9
        ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0);
      const t1 = new THREE.Vector3().crossVectors(up, hilf).normalize();
      const t2 = new THREE.Vector3().crossVectors(up, t1).normalize();
      for (let i = 0; i < SPLITTER; i++) {
        const z = inst.zust[i];
        const th = rnd() * Math.PI * 2, phi = rnd() * 0.8 + 0.2, sp = 1 + rnd() * 1.2;
        z.v.copy(up).multiplyScalar(phi * sp)
          .addScaledVector(t1, Math.cos(th) * (1 - phi) * sp)
          .addScaledVector(t2, Math.sin(th) * (1 - phi) * sp);
        z.rv.set((rnd() - 0.5) * 15, (rnd() - 0.5) * 15, (rnd() - 0.5) * 15);
        z.rot.set(rnd() * 6.28, rnd() * 6.28, rnd() * 6.28);
        const b = 0.18;
        z.s.set(b + rnd() * b * 2, b + rnd() * b * 2, b + rnd() * b * 2);
        z.a = 0.4 + rnd() * 0.6;
      }
    },
    update(dt) {
      for (const inst of pool) {
        if (!inst.an) continue;
        inst.t += dt;
        const p = inst.t / LEBEN;
        if (p >= 1) { inst.an = false; inst.mesh.visible = false; continue; }
        const fade = Math.pow(1 - p, 1.35), hell = 1 + (1 - p) * 1.2;
        let aSum = 0; for (const z of inst.zust) aSum += z.a;
        inst.mat.uniforms.globalAlpha.value = fade * (aSum / SPLITTER);
        inst.mat.uniforms.color.value = [farbe[0] * hell, farbe[1] * hell, farbe[2] * hell];
        for (let i = 0; i < SPLITTER; i++) {
          const z = inst.zust[i], t = inst.t, damp = 1 / (1 + t * 0.85);
          _p.copy(inst.mitte).addScaledVector(z.v, t * damp);
          z.rot.x += z.rv.x * dt; z.rot.y += z.rv.y * dt; z.rot.z += z.rv.z * dt;
          const sk = 1 - p * 0.55;
          _d.position.copy(_p); _d.rotation.copy(z.rot);
          _d.scale.set(z.s.x * sk, z.s.y * sk, z.s.z * sk);
          _d.updateMatrix();
          inst.mesh.setMatrixAt(i, _d.matrix);
        }
        inst.mesh.instanceMatrix.needsUpdate = true;
      }
    },
  };
}

const CHIP_CSS = `
#kfb-muenz-chip-css{}
.kfb-muenz-chip{position:fixed;left:0;top:0;width:26px;height:26px;border-radius:50%;
  background:radial-gradient(circle at 34% 30%,#ffeaa6 0%,#f2c04a 45%,#b57f22 100%);
  box-shadow:0 0 12px rgba(242,192,74,.75),inset 0 -2px 4px rgba(120,80,10,.55);
  border:1.5px solid #7a5412;pointer-events:none;z-index:60;will-change:transform,opacity}`;

export function createMuenzen({ THREE, radius, seed, terrainType, bodenRadius, salt = 3311,
                                params = {}, frei = null, camera = null, mount = null,
                                popAnker = null, onCollect = null }) {
  const P = Object.assign({
    on: true,
    anzahl: 28,
    // ⚠ **Maß und Reichweite wörtlich von den Würfeln** (sky-dice.js), samt ihrer Regel: `size`
    // ist Kantenlänge bzw. Durchmesser, und die GROßZÜGIGKEIT sitzt im `pad`, nicht in der
    // Silhouette. Dort steht das als teuer gelernte Lehre: ein Trefferfenster, das an der Größe
    // hängt, schrumpft bei jeder Verkleinerung mit — und dann macht man das Objekt wieder größer,
    // um es treffen zu können. Fenster = 0,05 · 1,8 + 0,075 = **0,165**, also großzügiger als
    // meine erste, frei geratene 0,10 — und diesmal mit einer Begründung, die schon abgenommen ist.
    size: 0.05,
    sammelFaktor: 1.8, sammelPad: 0.075,
    schwebeMin: 0.045, schwebeMax: 0.075,   // hochkant: der halbe Durchmesser muss frei über Grund stehen
    // Farbe wie die Würfel: Kanon-Hue, Helligkeit gehoben, Sättigung dagegen abgegeben.
    bodyLift: 0.26, glow: 0.30,
    r: 0.025, dicke: 0.008,   // nur für die Rückfall-Scheibe, falls das GLB nicht lädt
    spin: 1.8,              // rad/s (Quelle)
    bobHub: 0.006, bobAmp: 0.008,   // Quelle 0,012/0,017 — auf unser Maß geteilt
    spawnDauer: 0.5,        // Quelle
    respawnMin: 1.5, respawnMax: 2.5,   // Quelle
    // ⚠ **Die Münze steht HOCHKANT, und die Aufrichtung sitzt in der GEOMETRIE, nicht im Frame.**
    // Erste Fassung ließ sie liegen (Achse = Flächennormale) — im Anflug sieht man dann eine
    // Ellipse, die sich um sich selbst dreht, und das liest als Teller. Zweite Fassung drehte sie
    // zur Laufzeit auf; als dann das GLB dazukam, das beim Backen SCHON aufgerichtet wird, drehte
    // die Laufzeit sie wieder flach. **Zwei Stellen, die dieselbe Lage bestimmen, sind eine zu
    // viel** — dieselbe Klasse wie zwei Schreiber auf einem Winkel. Jetzt gilt: jede Geometrie
    // verlässt ihren Bau mit der DÜNNEN ACHSE AUF X (Fläche senkrecht), und der Frame dreht nur
    // noch um die Normale. Das ist der Spin, und sonst nichts.
    neigung: 0.18,          // kleiner Rest-Kipp, damit die Kante Licht fängt statt zu verschwinden
    punkte: 1,              // „+1 Pop pro coin erstmal" (Georg)
  }, params);

  const group = new THREE.Group(); group.name = 'muenzen'; group.visible = !!P.on;
  const R = radius;
  const rnd = seededRandom((seed | 0) + salt);
  initRimLight(THREE);
  if (mount && !document.getElementById('kfb-muenz-chip-css')) {
    const st = document.createElement('style');
    st.id = 'kfb-muenz-chip-css'; st.textContent = CHIP_CSS;
    document.head.appendChild(st);
  }

  const korpus = korpusFarbe(THREE, MUENZE.body, P.bodyLift);
  const glut = new THREE.Color(MUENZE.body).lerp(new THREE.Color(MUENZE.glow), 0.35);
  /** Ein Material, Würfel-Doktrin: Phong wie die ganze Welt, Eigenglut statt Glanzlicht.
   *  `vertexColors` nur für die Rückfall-Scheibe — das GLB trägt seine Farbe im Material. */
  function materialBauen(mitVertexfarben) {
    const m = new THREE.MeshPhongMaterial({
      color: mitVertexfarben ? new THREE.Color(0xffffff) : korpus,
      vertexColors: !!mitVertexfarben, flatShading: true,
      emissive: glut, emissiveIntensity: P.glow,
      shininess: 8, specular: new THREE.Color(0x111111),
    });
    addRimLight(m, null, 0.35, 2.4);
    return m;
  }

  let netze = [], teile = [], mat = null, quelle = 'lädt …';
  function netzeSetzen(geos, mitVertexfarben, woher) {
    for (const m of netze) group.remove(m);
    for (const g of teile) g.dispose();
    if (mat) mat.dispose();
    teile = geos; mat = materialBauen(mitVertexfarben); quelle = woher;
    netze = geos.map((g) => {
      const m = new THREE.InstancedMesh(g, mat, P.anzahl);
      m.frustumCulled = false; m.castShadow = false; m.receiveShadow = false;
      m.name = 'muenze';
      group.add(m);
      return m;
    });
  }
  // Rückfall zuerst, damit im ersten Bild etwas steht; das GLB ersetzt ihn, sobald es da ist.
  netzeSetzen(muenzGeometrie(THREE, P.r, P.dicke), true, 'eigene Scheibe (Rückfall)');

  /** Das Kanon-Asset. Auf `P.size` normiert, zentriert, und die DÜNNE Achse auf X gedreht —
   *  damit steht die Scheibe hochkant, egal wie das Modell exportiert wurde. Eine feste Rotation
   *  wäre eine Annahme über eine Datei, die ich nicht geschrieben habe. */
  (async () => {
    try {
      const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
      const gltf = await new GLTFLoader().loadAsync(GLB_URL);
      const root = gltf.scene; root.updateWorldMatrix(true, true);
      const bb = new THREE.Box3().setFromObject(root);
      const sz = bb.getSize(new THREE.Vector3()), mitte = bb.getCenter(new THREE.Vector3());
      const norm = P.size / Math.max(sz.x, sz.y, sz.z, 1e-4);
      const achsen = [['x', sz.x], ['y', sz.y], ['z', sz.z]].sort((a, b) => a[1] - b[1]);
      const drehen = new THREE.Matrix4();
      if (achsen[0][0] === 'y') drehen.makeRotationZ(Math.PI / 2);
      else if (achsen[0][0] === 'z') drehen.makeRotationY(Math.PI / 2);
      const M = new THREE.Matrix4().multiply(drehen)
        .multiply(new THREE.Matrix4().makeScale(norm, norm, norm))
        .multiply(new THREE.Matrix4().makeTranslation(-mitte.x, -mitte.y, -mitte.z));
      const geos = [];
      root.traverse((c) => {
        if (!c.isMesh || !c.geometry) return;
        const g2 = c.geometry.clone();
        g2.applyMatrix4(new THREE.Matrix4().copy(M).multiply(c.matrixWorld));
        g2.deleteAttribute('uv');
        if (g2.attributes.color) g2.deleteAttribute('color');   // Farbe kommt aus dem Material
        geos.push(g2);
      });
      if (geos.length) netzeSetzen(geos, false, 'KFB_Coin_01 (GLB, ' + geos.length + ' Teil(e))');
    } catch (e) {
      quelle = 'eigene Scheibe (GLB nicht erreichbar: ' + (e && e.message || e) + ')';
    }
  })();
  const ausbruch = createAusbruch({ THREE, rnd });
  group.add(ausbruch.group);

  const land = (n) => isLand(seed, terrainType, n.x, n.y, n.z);
  const pr = (n) => land(n) && (!frei || frei(n, 0.06));

  const muenzen = [];
  let stand = 'baut …', geholt = 0, verpasst = 0;
  const fenster = () => P.size * P.sammelFaktor + P.sammelPad;
  const _M = new THREE.Matrix4(), _q1 = new THREE.Quaternion(), _q2 = new THREE.Quaternion();
  const _pos = new THREE.Vector3(), _sc = new THREE.Vector3(), _Y = new THREE.Vector3(0, 1, 0);
  const _X = new THREE.Vector3(1, 0, 0), _Z = new THREE.Vector3(0, 0, 1);
  const _weg = new THREE.Vector3(0, -9999, 0), _leer = new THREE.Matrix4().makeScale(0, 0, 0);
  let uhr = 0;

  function ortSuchen() {
    const kand = streuen({ THREE, count: 1, seed: (seed | 0) + Math.floor(rnd() * 1e6),
                           salt: salt + Math.floor(rnd() * 9999), gueltig: pr, minSep: null });
    return kand.length ? kand[0] : null;
  }
  function setzen(m, n) {
    const rB = bodenRadius ? bodenRadius(n) : R;
    if (rB == null) return false;
    m.n = n.clone();
    m.hoehe = rB + P.schwebeMin + rnd() * (P.schwebeMax - P.schwebeMin);
    m.phase = rnd() * Math.PI * 2;
    m.dreh = rnd() * Math.PI * 2;
    m.t = 0; m.an = true; m.warte = 0;
    return true;
  }

  function bauen() {
    const orte = streuen({ THREE, count: P.anzahl, seed, salt, gueltig: pr, minSep: null });
    for (const n of orte) {
      const m = { n: null, hoehe: 0, phase: 0, dreh: 0, t: 0, an: false, warte: 0 };
      if (setzen(m, n)) muenzen.push(m);
    }
    stand = 'gebaut';
  }
  bauen();

  /** Der Chip, der zum Zähler fliegt — dieselbe Geste wie beim Karten-Fächer, nur ohne Blatt.
   *  Bewusst DOM und nicht 3D: das Ziel ist ein HUD-Element, und eine Bahn, die in der WELT
   *  gerechnet wird, aber an einem BILDSCHIRM-Punkt enden soll, hat zwei Bezugssysteme und
   *  damit einen Fehler pro Kamerabewegung (Fehlerklasse 17, siehe card-flight.js). */
  /** ⚠ **Der Punkt fällt beim Einsammeln, der Chip ist Dekoration.** Erste Fassung vergab ihn in
   *  `anim.onfinish` nach 620 ms — in einem gedrosselten Tab läuft die WAAPI-Zeitleiste aber
   *  kaum, und dann platzt der Funke, während der Zähler sekundenlang stillsteht. **Ein Punktestand
   *  darf nicht an der Dokument-Zeitleiste hängen** (dieselbe Klasse wie PM-50: eine zweite Uhr ist
   *  im verdeckten Tab eine andere Uhr). Die Bahn darf ruhig zu spät ankommen; die Zahl nicht. */
  function chipFliegen(welt) {
    if (onCollect) onCollect(P.punkte);
    if (!mount || !camera || !popAnker) return;
    const p = welt.clone().project(camera);
    const rect = mount.getBoundingClientRect();
    const sx = rect.left + (p.x * 0.5 + 0.5) * rect.width;
    const sy = rect.top + (-p.y * 0.5 + 0.5) * rect.height;
    const ziel = popAnker();
    if (!ziel) return;
    const el = document.createElement('div');
    el.className = 'kfb-muenz-chip';
    el.style.transform = 'translate(' + (sx - 13) + 'px,' + (sy - 13) + 'px) scale(1)';
    mount.appendChild(el);
    // Bogen statt Gerade: der Scheitel liegt über der Sehne, sonst liest die Bahn als Schiene.
    const mx = (sx + ziel.x) / 2 + (ziel.x - sx) * 0.12;
    const my = Math.min(sy, ziel.y) - Math.abs(ziel.x - sx) * 0.22 - 40;
    const anim = el.animate([
      { transform: 'translate(' + (sx - 13) + 'px,' + (sy - 13) + 'px) scale(1.15) rotate(0deg)', opacity: 1 },
      { transform: 'translate(' + (mx - 13) + 'px,' + (my - 13) + 'px) scale(0.92) rotate(220deg)', opacity: 1, offset: 0.55 },
      { transform: 'translate(' + (ziel.x - 13) + 'px,' + (ziel.y - 13) + 'px) scale(0.45) rotate(520deg)', opacity: 0.9 },
    ], { duration: 620, easing: 'cubic-bezier(.34,.02,.28,1)', fill: 'forwards' });
    anim.onfinish = () => el.remove();
    // Sicherung, falls die Zeitleiste steht: der Chip räumt sich auch ohne Ende der Animation weg.
    setTimeout(() => el.remove(), 2500);
  }

  return {
    name: 'muenzen', group, params: P,
    get enabled() { return P.on; },
    setEnabled(on) { P.on = !!on; group.visible = !!on; },
    get status() { return stand; },
    get geholt() { return geholt; },
    /** @param spielerPos Weltposition des Teppichs — der einzige Eingang für „wo ist der Spieler". */
    update(dt, spielerPos) {
      if (!P.on) return;
      uhr += dt;
      ausbruch.update(dt);
      let i = 0;
      for (const m of muenzen) {
        if (!m.an) {
          m.warte -= dt;
          if (m.warte <= 0) { const n = ortSuchen(); if (n) setzen(m, n); }
          for (const netz of netze) netz.setMatrixAt(i, _leer);
          i++; continue;
        }
        m.t += dt;
        // Spawn-Ease aus der Quelle: easeOutCubic mit kurzem Überschwinger.
        const sp = Math.min(1, m.t / P.spawnDauer);
        const ease = 1 - Math.pow(1 - sp, 3);
        const ueber = sp < 1 ? 1 + 0.15 * Math.sin(sp * Math.PI) : 1;
        const sk = ease * ueber;
        const bob = P.bobHub + Math.sin(uhr * 1.5 + m.phase) * P.bobAmp;
        _pos.copy(m.n).multiplyScalar(m.hoehe + bob);
        m.dreh += P.spin * dt;
        _q1.setFromUnitVectors(_Y, m.n);          // lokales +Y auf die Flächennormale
        _q2.setFromAxisAngle(_Y, m.dreh);         // Drehung um die Normale — das ist der Spin
        _q1.multiply(_q2);
        _q2.setFromAxisAngle(_X, P.neigung);      // ein Hauch Kipp gegen die Senkrechte
        _q1.multiply(_q2);
        _sc.setScalar(sk);
        _M.compose(_pos, _q1, _sc);
        for (const netz of netze) netz.setMatrixAt(i, _M);
        if (sp >= 1 && spielerPos && _pos.distanceTo(spielerPos) < fenster()) {
          m.an = false;
          m.warte = P.respawnMin + rnd() * (P.respawnMax - P.respawnMin);
          geholt++;
          ausbruch.zuende(_pos);
          chipFliegen(_pos);
          for (const netz of netze) netz.setMatrixAt(i, _leer);
        }
        i++;
      }
      for (const netz of netze) netz.instanceMatrix.needsUpdate = true;
    },
    tor() {
      const aktiv = muenzen.filter((m) => m.an).length;
      const ok = stand === 'gebaut' && muenzen.length >= P.anzahl * 0.9;
      return { ok, gesetzt: muenzen.length, aktiv, geholt,
        text: (ok ? '✓' : '⚠') + ' coins: ' + muenzen.length + '/' + P.anzahl + ' placed · ' + aktiv
          + ' in the air · ' + geholt + ' collected · model: ' + quelle
          + ' · size ' + P.size + ', pickup window ' + fenster().toFixed(3) + ' (= size · ' + P.sammelFaktor
          + ' + pad ' + P.sammelPad + ') and colour treatment taken verbatim from sky-dice.js,'
          + ' including its rule that the generosity lives in the PAD, not in the silhouette'
          + ' · timing 1:1 from Rings.ts: spawn ease 0.5 s, spin ' + P.spin + ' rad/s, respawn '
          + P.respawnMin + '–' + P.respawnMax + ' s · burst from RingCollectVFX.ts (12 shards, 0.55 s)'
          + ' · ' + netze.length + ' draw calls (one instanced mesh per coin part, gold in the vertex colours)' };
    },
    dispose() { for (const g of teile) g.dispose(); mat.dispose(); },
  };
}
