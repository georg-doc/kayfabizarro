// ============================================================================
// sky-atmosphere.js — Block 2 · Aurora + Gottesstrahlen
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, `client/src/game/Aurora.ts` und `GodRays.ts`
// (gelesen 1.9.2026, Branch cursor/globefly-multiplayer-globe-flight-game).
// Beide Shader stehen **zeichengleich** hier — Wellenzahlen, Exponenten, Farbtripel, die 0,55 am
// Ende der Aurora-Alpha, die 0,06 am Gottesstrahl. Was abweicht, steht unten benannt.
//
// **Warum diese zwei zuerst** (Georg, 1.9.: Atmosphäre ist der Hauptfokus): sie sind die billigsten
// im Quell-Repo — Aurora 10 Draw-Calls, Gottesstrahlen EINER — und sie teilen sich den Tag: die
// Aurora hängt am Nachtgewicht, die Strahlen an der Sonne. **Sie sind nie gleichzeitig sichtbar.**
// Das ist keine Nebenbemerkung, sondern die Antwort auf die Frage aus dem Sprintplan („sechs
// additive Effekte sind die Konstellation, die am 31.8. die Portale überstrahlt hat"): der
// Lichthaushalt ist **pro Tageszeit** zu rechnen, nicht als Summe über alle sechs.
//
// ⚠ **Ein additiver Effekt ist von `light-budget.js` NICHT erfasst.** Das Modul misst Lichter und
// Albedo — beides Dinge, die three multipliziert. Aurora und Strahlen ADDIEREN auf das fertige
// Bild, nach allem Licht. Ihre Obergrenze ist deshalb nicht `sun/π · Albedo`, sondern schlicht: was
// nach der Addition über 1,0 liegt, ist Weiß. Gemessen wird das am fertigen Bild (`weissTor` in
// `globe-poc.js`), nicht an einem Modell davon — die Lehre aus vier Messfehlern am 1.9.
// ============================================================================

// ── Aurora · Konstanten der Quelle ──────────────────────────────────────────────────────────────
const NUM_CURTAINS = 10;
const RING_RADIUS = 7;
const RING_HEIGHT = 9;
const CURTAIN_HEIGHT = 7;
const CURTAIN_WIDTH = 6;
const SEGMENTS_X = 64;
const SEGMENTS_Y = 24;

// ⚠ **Der Ring passt OHNE Umrechnung**, und das ist nachgelesen, nicht gehofft: `Game.ts` nennt den
// Radius seiner Kugel im Kommentar „same space as globe radius ~5", und unser `GLOBE_RADIUS` ist
// ebenfalls 5 (seit v5 bewusst so gesetzt, siehe `globe-poc.js`). Ring-Abstand vom Mittelpunkt:
// √(7² + 9²) = 11,4 — also klar über der Oberfläche und unter dem Sternenhimmel (Radius 80).
// *Eine Konstante aus einer anderen Welt zu übernehmen ist nur erlaubt, wenn die Bezugsgröße
// dieselbe ist. Hier ist sie es, und deshalb steht sie hier ungerechnet.*

const auroraVert = `
uniform float uTime;
varying vec2 vUv;
varying float vWave;
varying float vHeight;

void main() {
  vUv = uv;
  vHeight = uv.y;

  vec3 pos = position;

  float wave1 = sin(pos.x * 0.6 + uTime * 0.3) * 0.4;
  float wave2 = sin(pos.x * 1.2 + uTime * 0.2 + 1.5) * 0.2;
  float wave3 = sin(pos.x * 0.3 + uTime * 0.15 + 3.0) * 0.6;
  float ripple = sin(pos.x * 3.0 + pos.y * 0.4 + uTime * 0.8) * 0.05;

  pos.z += (wave1 + wave2 + wave3 + ripple) * (0.3 + uv.y * 0.7);

  float sway = sin(pos.x * 0.25 + uTime * 0.1) * 0.3;
  pos.y += sway * uv.y;

  vWave = (wave1 + wave2) * 0.8;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const auroraFrag = `
uniform float uTime;
uniform float uAlpha;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
varying vec2 vUv;
varying float vWave;
varying float vHeight;

void main() {
  float curtainX = sin(vUv.x * 12.0 + uTime * 0.5) * 0.5 + 0.5;
  curtainX = pow(curtainX, 2.0);
  float curtainX2 = sin(vUv.x * 8.0 - uTime * 0.3 + 2.0) * 0.5 + 0.5;
  curtainX2 = pow(curtainX2, 3.0);
  float curtain = max(curtainX * 0.8, curtainX2 * 0.5);

  float shimmer = sin(vUv.x * 30.0 + vUv.y * 8.0 + uTime * 2.0) * 0.5 + 0.5;
  shimmer = shimmer * 0.2 + 0.8;

  float bottomFade = smoothstep(0.0, 0.2, vHeight);
  float topFade = 1.0 - smoothstep(0.5, 1.0, vHeight);
  float vertFade = bottomFade * topFade;

  float edgeFade = smoothstep(0.0, 0.15, vUv.x) * (1.0 - smoothstep(0.85, 1.0, vUv.x));

  float t = vUv.y + vWave * 0.3;
  vec3 col;
  if (t < 0.4) {
    col = mix(uColor1, uColor2, t / 0.4);
  } else {
    col = mix(uColor2, uColor3, (t - 0.4) / 0.6);
  }

  col += vec3(0.1, 0.15, 0.1) * shimmer * curtain;

  float a = curtain * vertFade * edgeFade * shimmer * uAlpha;
  a *= 0.55;

  gl_FragColor = vec4(col, a);
}
`;

/** Fünf Vorhang-Sorten, zehn Vorhänge — `PALETTE[i % 5]`. Zeichengleich mit der Quelle. */
const PALETTE = [
  { c1: [0.1, 0.9, 0.3], c2: [0.1, 0.7, 0.6], c3: [0.3, 0.3, 0.9], alpha: 1.0, hOff: 0 },
  { c1: [0.15, 0.8, 0.4], c2: [0.2, 0.5, 0.8], c3: [0.6, 0.2, 0.7], alpha: 0.8, hOff: 0.5 },
  { c1: [0.2, 0.6, 0.9], c2: [0.4, 0.3, 0.8], c3: [0.7, 0.15, 0.5], alpha: 0.6, hOff: -0.3 },
  { c1: [0.05, 0.95, 0.35], c2: [0.1, 0.85, 0.55], c3: [0.15, 0.5, 0.75], alpha: 0.7, hOff: 0.8 },
  { c1: [0.3, 0.4, 0.9], c2: [0.5, 0.2, 0.8], c3: [0.8, 0.1, 0.4], alpha: 0.5, hOff: 0.2 },
];

export function createAurora(THREE, opts = {}) {
  const group = new THREE.Group();
  group.name = 'aurora';
  const mats = [], zeitU = [], alphaU = [], basisAlpha = [], meshes = [], winkelArr = [], hOffArr = [];
  const camPos = new THREE.Vector3(), radialUp = new THREE.Vector3();
  // ⚠ **1.9., zweite Runde — Georgs Entscheidung: „mitfliegend, jede Nacht da."**
  // Vorher hing der Ring FEST über dem Nordpol (`RING_HEIGHT` auf Welt-Y) — gemessen von 57,8 %
  // der Kugel über dem Horizont sichtbar, mal 29 % Nachtanteil: an den meisten Orten und den
  // meisten Nächten war er unter dem Horizont oder gar nicht da. Jetzt trägt `update()` einen
  // Mittelpunkt und ein „oben" (Spieler, radiale Normale) — der Ring wird JEDES Bild neu um diese
  // Achse gelegt, dieselbe Bauform wie die Portale (`stellen()` in `portal.js`). Ohne diese zwei
  // Argumente fällt es auf das alte Verhalten zurück (Welt-Y), falls `update` ohne sie gerufen
  // wird — kein stiller Bruch für einen Aufrufer, der sie (noch) nicht mitgibt.
  const _east = new THREE.Vector3(), _north = new THREE.Vector3(), _pos = new THREE.Vector3();
  const _worldUp = new THREE.Vector3(0, 1, 0), _worldX = new THREE.Vector3(1, 0, 0);

  const P = Object.assign({
    // Gesamtstärke über allem — der eine Regler, den Georg anfassen will. 1 = Quelle.
    stark: 1.0,
    // Anzahl. Die Quelle hat 10; weniger heißt weniger Überlappung und damit weniger Weiß.
    vorhaenge: NUM_CURTAINS,
  }, opts.params || {});

  for (let i = 0; i < P.vorhaenge; i++) {
    const cfg = PALETTE[i % PALETTE.length];
    const winkel = (i / P.vorhaenge) * Math.PI * 2;
    winkelArr.push(winkel); hOffArr.push(cfg.hOff);
    const geo = new THREE.PlaneGeometry(CURTAIN_WIDTH, CURTAIN_HEIGHT, SEGMENTS_X, SEGMENTS_Y);

    // ⚠ Startzeit `i * 7,3` — die Quelle versetzt die Vorhänge gegeneinander, damit sie nicht im
    // Gleichschritt wehen. Das ist die einzige „Zufälligkeit" der Aurora, und sie ist deterministisch;
    // die Seed-Regel (S3a) hat hier also nichts zu klemmen.
    const tU = { value: i * 7.3 };
    const aU = { value: cfg.alpha * P.stark };
    zeitU.push(tU); alphaU.push(aU); basisAlpha.push(cfg.alpha);

    const mat = new THREE.ShaderMaterial({
      vertexShader: auroraVert, fragmentShader: auroraFrag,
      uniforms: { uTime: tU, uAlpha: aU,
                  uColor1: { value: cfg.c1 }, uColor2: { value: cfg.c2 }, uColor3: { value: cfg.c3 } },
      transparent: true, depthWrite: false, depthTest: true,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    });
    mats.push(mat);

    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = 'aurora-curtain-' + i;
    // Anfangslage wie vorher (Welt-Y) — gültig, bis das erste `update()` mit Spielerposition
    // kommt. Ohne das wäre `lookAt` vor dem ersten Bild auf (0,0,0) entartet.
    mesh.position.set(RING_RADIUS * Math.cos(winkel), RING_HEIGHT + cfg.hOff,
                      RING_RADIUS * Math.sin(winkel));
    mesh.frustumCulled = false;
    mesh.renderOrder = 999;
    meshes.push(mesh);
    group.add(mesh);
  }

  let gewicht = 0;

  return {
    name: 'aurora', group, params: P,
    /** `center`/`up` = wo der Spieler steht und seine radiale Normale — fehlen sie, bleibt der
     *  Ring am alten polaren Fleck (Rückweg, kein Bruch für einen alten Aufrufer). */
    update(dt, camera, center, up) {
      if (gewicht <= 0.001) return;
      for (const u of zeitU) u.value += dt;
      camera.getWorldPosition(camPos);
      const mitfliegend = !!(center && up);
      if (mitfliegend) {
        radialUp.copy(up).normalize();
        // Ost/Nord aus der radialen Normale — dieselbe Konstruktion wie `tangentFrame`, nur ohne
        // dessen Quaternion-Eingang (hier kommt die Normale direkt aus der Weltposition).
        _east.crossVectors(Math.abs(radialUp.dot(_worldUp)) > 0.98 ? _worldX : _worldUp, radialUp);
        if (_east.lengthSq() < 1e-9) _east.set(1, 0, 0); else _east.normalize();
        _north.crossVectors(radialUp, _east).normalize();
      }
      for (let i = 0; i < meshes.length; i++) {
        const m = meshes[i];
        if (mitfliegend) {
          _pos.copy(center)
            .addScaledVector(radialUp, RING_HEIGHT + hOffArr[i])
            .addScaledVector(_east, RING_RADIUS * Math.cos(winkelArr[i]))
            .addScaledVector(_north, RING_RADIUS * Math.sin(winkelArr[i]));
          m.position.copy(_pos);
          m.up.copy(radialUp);
        } else {
          radialUp.copy(m.position).normalize();
          m.up.copy(radialUp);
        }
        m.lookAt(camPos);
      }
    },
    /** Nachtgewicht 0…1 — in der Quelle `aurora.setOpacity(nightW)`. */
    setGewicht(w) {
      gewicht = Math.max(0, Math.min(1, w));
      for (let i = 0; i < alphaU.length; i++) alphaU[i].value = basisAlpha[i] * gewicht * P.stark;
      group.visible = gewicht > 0.001;
      return gewicht;
    },
    get gewicht() { return gewicht; },
    setStark(v) {
      P.stark = Math.max(0, Math.min(2, v));
      for (let i = 0; i < alphaU.length; i++) alphaU[i].value = basisAlpha[i] * gewicht * P.stark;
      return P.stark;
    },
    /** ⚠ Die GERECHNETE Obergrenze eines EINZELNEN Vorhangs, als Bezugsgröße für das Weiß-Tor.
     *  Aus dem Shader abgelesen, nicht geschätzt: `a = curtain · vertFade · edgeFade · shimmer ·
     *  uAlpha · 0,55`, davon `curtain ≤ 0,8`, `shimmer ≤ 1,0`, die Blenden ≤ 1,0.
     *  Bei zehn Vorhängen auf einem Ring überlappen sich mehrere in der Blickrichtung — wie viele,
     *  sagt kein Modell verlässlich, das sagt nur das Bild. Deshalb ist diese Zahl eine SCHRANKE
     *  für einen Vorhang, kein Urteil über die Szene. */
    spitzeEinzeln() {
      let m = 0;
      for (let i = 0; i < alphaU.length; i++) m = Math.max(m, alphaU[i].value);
      return +(0.8 * m * 0.55).toFixed(3);
    },
    dispose() {
      group.traverse((c) => { if (c.geometry) c.geometry.dispose(); });
      for (const m of mats) m.dispose();
      group.removeFromParent();
    },
  };
}

// ── Gottesstrahlen ──────────────────────────────────────────────────────────────────────────────

const strahlVert = `
varying vec2 vUv;
varying vec3 vLocalPos;
void main() {
  vUv = uv;
  vLocalPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const strahlFrag = `
uniform float uTime;
uniform vec3 uColor;
uniform float uIntensity;

varying vec2 vUv;
varying vec3 vLocalPos;

float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                   mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                   mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}

void main() {
  float radius = length(vLocalPos.xz) + 0.001;
  vec3 p = vec3(vLocalPos.x / radius * 2.0, vUv.y * 1.5, vLocalPos.z / radius * 2.0);

  float c = cos(uTime * 0.04);
  float s = sin(uTime * 0.04);
  p.xz = vec2(p.x * c - p.z * s, p.x * s + p.z * c);

  float n1 = noise(p * 4.0);
  float n2 = noise(p * 8.0 + vec3(0.0, uTime * 0.15, 0.0));

  // High exponent = fewer, sharper, more sporadic distinct shafts
  float rays = pow(n1 * n2, 2.5) * 6.0;

  // Aggressively fade near the source (top): invisible for the first 45% of the cone.
  float fadeTop = smoothstep(0.0, 0.45, vUv.y);
  float fadeBot = smoothstep(1.0, 0.65, vUv.y);
  float fadeY = fadeTop * fadeBot;

  float a = rays * fadeY * uIntensity;

  gl_FragColor = vec4(uColor * a, a);
}
`;

/** ⚠ **Die Sonnendistanz, für die der Kegel gebaut ist — und der Grund für die eine echte
 *  Abweichung dieses Ports.**
 *  Die Quelle stellt ihre Sonne auf `(12, 2, 5)`, Abstand **13,15**, und baut den Kegel mit
 *  Höhe 18, Spitze am Ursprung: er reicht also von 13,15 bis −4,85, durch die Kugel hindurch.
 *  **Unsere Sonne steht auf 60** (`sky-presets.js`: `.normalize().multiplyScalar(60)`).
 *  Für ein DirectionalLight ist der Abstand bedeutungslos — es zählt nur die Richtung, deshalb war
 *  60 nie ein Fehler. Für den Kegel ist er alles: bei 60 reicht er von 60 bis 42 und die Kugel
 *  liegt 42 Einheiten unterhalb seines Endes. **Der Effekt wäre vorhanden, korrekt und unsichtbar.**
 *  *Eine Zahl, die in einem Zusammenhang bedeutungslos ist, wird gefährlich, sobald ein zweiter
 *  Leser dazukommt.* Der Kegel bekommt daher die Sonnen-RICHTUNG und diesen Abstand — nicht die
 *  Position der Lampe. */
const SONNE_ABSTAND = 13.15;

export function createGodRays(THREE, opts = {}) {
  const group = new THREE.Group();
  group.name = 'godrays';
  const farbeU = { value: new THREE.Color() };
  const starkeU = { value: 1.0 };

  const P = Object.assign({
    // Quelle: `sunIntensity * 0.06`. Der eine Regler.
    faktor: 0.06,
    abstand: SONNE_ABSTAND,
  }, opts.params || {});

  // Offener Kegel: oben 0,5 (an der Sonne), unten 8,0 (an der Kugel), Höhe 18 — Quelle.
  const geo = new THREE.CylinderGeometry(0.5, 8.0, 18.0, 32, 1, true);
  geo.translate(0, -9.0, 0);   // Ursprung an die Spitze

  const mat = new THREE.ShaderMaterial({
    vertexShader: strahlVert, fragmentShader: strahlFrag,
    uniforms: { uTime: { value: 0 }, uColor: farbeU, uIntensity: starkeU },
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'godrays-cone';
  mesh.frustumCulled = false;
  mesh.renderOrder = 1;
  mesh.rotation.x = -Math.PI / 2;
  group.add(mesh);

  const richtung = new THREE.Vector3(), mitte = new THREE.Vector3();
  let gewicht = 1;
  // ⚠ **Der letzte Stand von `stark`, damit das Gewicht OHNE `update()` wirken kann.** Ohne diese
  // zwei Zeilen war `setGewicht` eine Absichtserklärung: es setzte nur die lokale Variable, und die
  // Uniform änderte sich erst beim nächsten `update()`. In der Spielschleife fällt das nie auf (dort
  // folgt `update` unmittelbar), aber JEDER Aufrufer außerhalb der Schleife wurde stillschweigend
  // ignoriert — und das war ausgerechnet das Weiß-Tor, das mit `setGewicht(0)` die Kontrollaufnahme
  // macht. Es hat die Strahlen also in VOLLER Stärke als „ohne Effekt" fotografiert und daraufhin
  // „0 % geändert" gemeldet. Gemessen vom Verifier mit richtig genullter Uniform: **40,9 % des
  // Bildes**, max Δ 499/765.
  // *Ein Setter, der seine Wirkung an einen anderen Aufruf delegiert, ist kein Setter — er ist eine
  // Vormerkung.* Die Aurora machte es von Anfang an richtig; die Asymmetrie war der Fehler.
  let letztesStark = 1;
  function schreibeStaerke() {
    starkeU.value = letztesStark * P.faktor * gewicht;
    group.visible = starkeU.value > 0.0005;
  }

  return {
    name: 'godrays', group, params: P,
    /** `sonnePos` darf beliebig weit weg stehen — nur die RICHTUNG wird genommen (Begründung bei
     *  `SONNE_ABSTAND`). `stark` ist die Sonnenintensität des Presets. */
    update(zeit, sonnePos, kugelMitte, farbe, stark) {
      mat.uniforms.uTime.value = zeit;
      farbeU.value.set(farbe);
      letztesStark = stark;
      schreibeStaerke();
      mitte.copy(kugelMitte || { x: 0, y: 0, z: 0 });
      richtung.copy(sonnePos).sub(mitte);
      if (richtung.lengthSq() < 1e-9) richtung.set(0, 1, 0);
      richtung.normalize().multiplyScalar(P.abstand).add(mitte);
      group.position.copy(richtung);
      group.up.set(0, 1, 0);
      group.lookAt(mitte);
    },
    /** Tagesgewicht: nachts fahren die Strahlen aus, so wie die Aurora tags. In der Quelle passiert
     *  das über `sunIntensity` allein — die fällt nachts auf 1,25, also 25 % Reststrahlen unter
     *  einem Sternenhimmel. Bei uns ist das ein eigener Regler, weil `weltstimmungen` die
     *  Sonnenintensität nicht anfasst und die Strahlen sonst nachts stehen blieben. */
    setGewicht(w) { gewicht = Math.max(0, Math.min(1, w)); schreibeStaerke(); return gewicht; },
    get gewicht() { return gewicht; },
    setFaktor(v) { P.faktor = Math.max(0, Math.min(0.4, v)); schreibeStaerke(); return P.faktor; },
    /** ⚠ Die gerechnete Obergrenze, aus dem Shader abgelesen: `a = pow(n1·n2, 2,5) · 6 · fadeY ·
     *  uIntensity`. Beide Rauschterme sind ≤ 1, also ist `rays ≤ 6,0` — und `6,0 × uIntensity`
     *  ist die Schranke. Bei Tagessonne 5,0 und Faktor 0,06 sind das **1,8**: der Effekt kann
     *  allein Weiß erzeugen. Dass er es meistens nicht tut, liegt daran, dass `n1·n2 = 1` zwei
     *  gleichzeitige Rauschmaxima verlangt — aber *„meistens nicht" ist keine Grenze*, und deshalb
     *  steht die Zahl hier und wird am Bild gegengeprüft. */
    spitze() { return +(6.0 * starkeU.value).toFixed(3); },
    dispose() { geo.dispose(); mat.dispose(); group.removeFromParent(); },
  };
}
