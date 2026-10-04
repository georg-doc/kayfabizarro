// ============================================================================
// speed-lines.js — Tempostreifen als Bildschirm-Overlay, 1:1 aus tinyskies
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, client/src/game/SpeedLines.ts (gelesen 27.8.2026).
// 24 Streifen, Schwelle 0.8, Boost ab 1.2, eigene Ortho-Szene über dem Bild.
//
// **Sie werden nach der Szene gerendert, mit `autoClear = false`** — dieselbe Reihenfolge, die in
// v20 als „S2 unverhandelbar" notiert ist: Szene → Post → Speedlines → HUD. Hier ist es dieselbe
// Regel, nur aus einer anderen Quelle.
// ============================================================================

/* Slice D · v5 · Parameter der Tempostreifen. Standard = Quelle (`SpeedLines.ts`).
 *
 * ⚠ **Hier ist die Parameter-Frage keine Bequemlichkeit, sondern eine Fehlerklasse.** Der
 * Kommentar in `update()` beschreibt eine Endlosschleife, die den Tab einfriert, weil
 * `spawnRate` negativ werden konnte — und JEDE Zahl dieser Rechnung war ein nacktes Literal
 * (`0.02`, `0.08`, `0.015`, `64`). Ein Wert, den man nicht benennen kann, kann man auch nicht
 * gegen seine Grenze prüfen. Die Untergrenze `spawnFloor` heißt jetzt so, wie sie wirkt. */
export const LINES_QUELLE = Object.freeze({
  count: 24,
  threshold: 0.8,        // darunter keine Streifen
  maxSpeed: 1.5,
  boostThreshold: 1.2,
  opacity: 0.35,         // war `speedFactor * 0.35`
  spawnBase: 0.02,       // war ein nacktes Literal
  spawnSlope: 0.08,      // war ein nacktes Literal
  spawnFloor: 0.015,     // war ein nacktes Literal — DIE Sicherung gegen den Tab-Freeze
  spawnGuard: 64,        // war ein nacktes Literal — zweite Sicherung gegen NaN
  boostGain: 4,          // war ein nacktes Literal
  drift: 0.15,           // war ein nacktes Literal: Wanderung nach innen
  lenMin: 0.35, lenSpan: 0.49,
  widMin: 0.006, widSpan: 0.008,
  offMin: 0.95, offSpan: 0.15,
  spdMin: 0.5, spdSpan: 0.8,
  lifeMin: 0.3, lifeSpan: 0.4,
});

export function createSpeedLines(THREE, opts) {
  const P = Object.assign({}, LINES_QUELLE, (opts && opts.params) || {});
  const LINE_COUNT = P.count, SPEED_THRESHOLD = P.threshold,
        MAX_SPEED = P.maxSpeed, BOOST_THRESHOLD = P.boostThreshold;

  const screenVert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

  const screenFrag = `
uniform float opacity;
uniform float life;
varying vec2 vUv;
void main() {
  float taper = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
  float halfW = taper * 0.35;
  float d = abs(vUv.y - 0.5);
  float shape = 1.0 - smoothstep(halfW * 0.3, halfW, d);
  float fade = smoothstep(0.0, 0.4, life) * smoothstep(1.0, 0.5, life);
  float a = shape * fade * opacity;
  gl_FragColor = vec4(1.0, 1.0, 1.0, a);
}`;

  const geo = new THREE.PlaneGeometry(1, 1);
  const orthoScene = new THREE.Scene();
  const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const streaks = [], meshes = [], materials = [];
  let spawnTimer = 0, lebend = 0, gespawnt = 0, schutzGriff = 0;

  for (let i = 0; i < LINE_COUNT; i++) {
    const mat = new THREE.ShaderMaterial({
      vertexShader: screenVert, fragmentShader: screenFrag,
      uniforms: { opacity: { value: 0 }, life: { value: 0 } },
      transparent: true, depthTest: false, depthWrite: false,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.visible = false;
    orthoScene.add(mesh);
    meshes.push(mesh); materials.push(mat);
    streaks.push({ angle: 0, length: 0, offset: 0, width: 0, speed: 0, life: 0, maxLife: 0, active: false });
  }

  function spawn(idx) {
    const s = streaks[idx];
    s.angle = Math.random() * Math.PI * 2;
    s.length = P.lenMin + Math.random() * P.lenSpan;
    s.width = P.widMin + Math.random() * P.widSpan;
    s.offset = P.offMin + Math.random() * P.offSpan;
    s.speed = P.spdMin + Math.random() * P.spdSpan;
    s.maxLife = P.lifeMin + Math.random() * P.lifeSpan;
    s.life = 0; s.active = true; gespawnt++;
  }

  return {
    name: 'speed-lines', params: P, quelle: LINES_QUELLE,
    abweichungen() {
      const a = [];
      for (const k in LINES_QUELLE) if (P[k] !== LINES_QUELLE[k]) a.push(k + ' ' + LINES_QUELLE[k] + '→' + P[k]);
      return a;
    },
    report() {
      const a = this.abweichungen();
      return { parameter: Object.keys(LINES_QUELLE).length, abweichungen: a.length, abweichend: a,
               lebend, gespawnt, pool: LINE_COUNT, schutzGriff };
    },
    /** `lebend` ist die Zahl, die dieses Modul zweimal gebraucht hätte: „stumme Tempostreifen"
     *  war beide Male eine Schwelle, nicht ein Shader. `schutzGriff > 0` heißt: die Sicherung
     *  gegen die Endlosschleife hat GEGRIFFEN — dann steht sie hier und nicht nur im Kommentar. */
    zeile() {
      const a = this.abweichungen();
      return Object.keys(LINES_QUELLE).length + ' params · '
        + (a.length ? '⚠ ' + a.length + ' off source: ' + a.join(', ')
                    : 'all source-faithful (tinyskies SpeedLines.ts)')
        + ' · ' + lebend + '/' + LINE_COUNT + ' live · ' + gespawnt + ' spawned'
        + ' · threshold ' + P.threshold
        + (schutzGriff ? '  ·  ⚠ spawn guard tripped ' + schutzGriff + '×' : '');
    },
    update(dt, planeSpeed) {
      // ⚠ **Hier lag eine echte Endlosschleife — und zwar eine, die den Tab hart einfriert, ohne
      // eine Zeile Fehler.** `speedFactor` war nur nach UNTEN geklemmt. Bei Tempo über
      // 1,25× der normierten Obergrenze wird `spawnRate = 0.02 + (1 - speedFactor) * 0.08`
      // null und dann negativ — und `while (spawnTimer >= spawnRate) { spawnTimer -= spawnRate }`
      // zählt mit negativem Schritt nach OBEN: die Bedingung wird nie falsch.
      // Auslöser sind genau die neuen Sachen dieser Baureihe: der blaue Würfel-Boost, der
      // Dice-FX-Schlenker, `carpet.setSpeed`.
      // ⚠ Und die Lehre für die Fangkorb-Bauform von letzter Runde: `try/finally` um den
      // Frame-Körper schützt dagegen NICHT. Eine Endlosschleife erreicht das `finally` nie, und
      // die Panel-Anzeige „Frame loop: N frames" ist unlesbar, weil die Seite nicht mehr
      // zeichnet. **Ein Zähler fängt geworfene Fehler, keine Hänger.** Gegen Hänger hilft nur,
      // die Schleife selbst unmöglich zu machen: `spawnRate` hat eine harte Untergrenze, und
      // der Faktor ist beidseitig geklemmt.
      const spanne = (MAX_SPEED - SPEED_THRESHOLD) || 1;
      const speedFactor = Math.max(0, Math.min(1, (planeSpeed - SPEED_THRESHOLD) / spanne));
      if (speedFactor > 0) {
        spawnTimer += dt;
        const spawnRate = Math.max(P.spawnFloor, P.spawnBase + (1 - speedFactor) * P.spawnSlope);
        let schutz = P.spawnGuard;   // zweite Sicherung: auch bei NaN im Tempo endet die Schleife
        while (spawnTimer >= spawnRate && schutz-- > 0) {
          spawnTimer -= spawnRate;
          for (let i = 0; i < streaks.length; i++) if (!streaks[i].active) { spawn(i); break; }
        }
        if (schutz <= 0) { spawnTimer = 0; schutzGriff++; }
      } else spawnTimer = 0;

      const globalOpacity = speedFactor * P.opacity;
      let am = 0;
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i], mesh = meshes[i], mat = materials[i];
        if (!s.active) { mesh.visible = false; continue; }
        s.life += dt * s.speed;
        if (s.life >= s.maxLife) { s.active = false; mesh.visible = false; continue; }
        const lifeNorm = s.life / s.maxLife;
        const edgeDist = s.offset - lifeNorm * P.drift;
        mesh.position.set(Math.cos(s.angle) * edgeDist, Math.sin(s.angle) * edgeDist, 0);
        mesh.rotation.z = s.angle + Math.PI;
        const boostMul = planeSpeed > BOOST_THRESHOLD
          ? 1 + P.boostGain * Math.min(1, (planeSpeed - BOOST_THRESHOLD) / (MAX_SPEED - BOOST_THRESHOLD)) : 1;
        mesh.scale.set(s.length, s.width * boostMul, 1);
        mesh.visible = true;
        mat.uniforms.opacity.value = globalOpacity;
        mat.uniforms.life.value = lifeNorm;
        am++;
      }
      lebend = am;
    },
    render(renderer) {
      let anyVisible = false;
      for (const m of meshes) if (m.visible) { anyVisible = true; break; }
      if (!anyVisible) return;
      renderer.autoClear = false;
      renderer.render(orthoScene, orthoCamera);
      renderer.autoClear = true;
    },
    dispose() { geo.dispose(); for (const m of materials) m.dispose(); },
  };
}
