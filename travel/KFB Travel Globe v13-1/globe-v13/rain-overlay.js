// ============================================================================
// rain-overlay.js — v11 · Regen als Bildschirm-Overlay, 1:1 aus tinyskies `RainOverlay.ts`
// ----------------------------------------------------------------------------
// Quelle: georg-doc/tinyskies, client/src/game/RainOverlay.ts (11 477 B), Branch
// cursor/globefly-multiplayer-globe-flight-game, gelesen 2.9.2026. Georg: „Wetter aus dem Original
// übernehmen (nicht wieder sloppy neubauen!)". Also: Konstanten, Shader und Ablauf zeichengleich.
// Was die Quelle hat: 200 Regenstreifen (additiv, Ortho-Kamera), ein Glastropfen-Shader über dem
// Bild (Shadertoy-Adaption, liest den Framebuffer), Blitz ab `moonProgress ≥ 0,75`.
// Was die Quelle NICHT hat: Schnee. (Georg, Formular 2.9.: Schnee weglassen.)
//
// Bewusste Nähte, jede benannt:
//  1 `moonProgress` bleibt als Parameter (Blitz-Ast unverändert), wird bei uns aber nie ≥ 0,75 —
//    wir haben keinen Mond mit Uhr. Der Blitz-Code steht, damit er später einen Auslöser bekommt.
//  2 Der Regen ist Bildschirm, nicht Welt: `render()` wird NACH Szene + Post gerufen, wie in
//    Game.ts (Regen vor Speedlines). Kein Eingriff in die Szene, kein zweiter Renderer.
//  3 `Math.random()` bleibt — Regenstreifen sind Bild, keine Weltlage (Hausregel S3a gilt für
//    Weltinventar; hier sähe dieselbe Welt bei jedem Laden ohnehin anders aus, weil der Regen läuft).
// ============================================================================

const STREAK_COUNT = 200;
const WIND_ANGLE = 0.35;
const ANGLE_JITTER = 0.09;
const NOISE_SIZE = 256;

const streakVert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const streakFrag = `
uniform float opacity;
varying vec2 vUv;
void main() {
  float along = vUv.y;
  float taper = smoothstep(0.0, 0.15, along) * smoothstep(1.0, 0.7, along);
  float across = abs(vUv.x - 0.5) * 2.0;
  float shape = (1.0 - smoothstep(0.0, 1.0, across)) * taper;
  gl_FragColor = vec4(0.75, 0.8, 0.88, shape * opacity);
}
`;
const glassVert = streakVert;
const glassFrag = `
uniform sampler2D sceneTex;
uniform sampler2D noiseTex;
uniform vec2 resolution;
uniform float time;
uniform float opacity;
varying vec2 vUv;
void main() {
  vec2 u = vUv;
  vec2 n = texture2D(noiseTex, u * 0.1).rg;
  vec4 original = texture2D(sceneTex, u);
  vec4 f = original;
  for (float r = 4.0; r > 0.0; r -= 1.0) {
    vec2 x = resolution * r * 0.009;
    vec2 nShift = (n - 0.5) * 0.8 / 6.28318;
    vec2 cellCoord = floor(u * x + nShift + 0.25) / x;
    vec4 d = texture2D(noiseTex, cellCoord);
    vec2 p = 6.28318 * u * x + (n - 0.5) * 0.8;
    vec2 s = sin(p);
    float t = (s.x + s.y) * max(0.0, 1.0 - fract(time * (d.b + 0.1) * 0.45 + d.g) * 1.4);
    if (d.r < (5.0 - r) * 0.056 && t > 0.5) {
      vec3 v = normalize(-vec3(cos(p), mix(0.2, 2.0, t - 0.5)));
      f = texture2D(sceneTex, u - v.xy * 0.4);
    }
  }
  gl_FragColor = vec4(mix(original.rgb, f.rgb, opacity), 1.0);
}
`;

function createNoiseTexture(THREE) {
  const data = new Uint8Array(NOISE_SIZE * NOISE_SIZE * 4);
  for (let i = 0; i < data.length; i++) data[i] = Math.floor(Math.random() * 256);
  const tex = new THREE.DataTexture(data, NOISE_SIZE, NOISE_SIZE, THREE.RGBAFormat, THREE.UnsignedByteType);
  tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
  tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

export function createRainOverlay({ THREE }) {
  const streakScene = new THREE.Scene();
  const glassScene = new THREE.Scene();
  const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geo = new THREE.PlaneGeometry(1, 1);
  const streaks = [], streakMeshes = [], streakMats = [];
  for (let i = 0; i < STREAK_COUNT; i++) {
    const mat = new THREE.ShaderMaterial({
      vertexShader: streakVert, fragmentShader: streakFrag, uniforms: { opacity: { value: 0 } },
      transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geo, mat); mesh.visible = false;
    streakScene.add(mesh); streakMeshes.push(mesh); streakMats.push(mat);
    streaks.push({ x: 0, y: 0, speed: 0, length: 0, width: 0, angle: 0, active: false });
  }
  const noiseTex = createNoiseTexture(THREE);
  let sceneTex = new THREE.FramebufferTexture(1, 1);
  sceneTex.minFilter = THREE.LinearFilter; sceneTex.magFilter = THREE.LinearFilter;
  let bufW = 0, bufH = 0;
  const glassGeo = new THREE.PlaneGeometry(2, 2);
  const glassMat = new THREE.ShaderMaterial({
    vertexShader: glassVert, fragmentShader: glassFrag,
    uniforms: { sceneTex: { value: sceneTex }, noiseTex: { value: noiseTex },
                resolution: { value: new THREE.Vector2(1, 1) }, time: { value: 0 }, opacity: { value: 0 } },
    depthTest: false, depthWrite: false,
  });
  const glassMesh = new THREE.Mesh(glassGeo, glassMat); glassMesh.visible = false; glassScene.add(glassMesh);
  const lightningMat = new THREE.ShaderMaterial({
    vertexShader: 'void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform float alpha; void main() { gl_FragColor = vec4(0.85, 0.88, 1.0, alpha); }',
    uniforms: { alpha: { value: 0 } }, transparent: true, depthTest: false, depthWrite: false,
  });
  const lightningMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), lightningMat);
  lightningMesh.visible = false; glassScene.add(lightningMesh);

  let currentWeight = 0, time = 0, lightningAlpha = 0, lightningCooldown = 0, moonProgress = 0;
  const _size = new THREE.Vector2();
  const api = { onLightningFlash: null };
  const _nullPos = new THREE.Vector2(0, 0);
  // ⚠ Signatur-Naht: three r160 (unsere Import-Map) hat `copyFramebufferToTexture(position, texture)`,
  // ab r165 (Quelle) `(texture, position)`. Gemessen 2.9.: die Quellen-Reihenfolge warf in r160 jedes Bild
  // und riss den Frame-Loop mit — blauer Himmel, sonst nichts. Also nach REVISION unterscheiden.
  const altSig = parseInt(THREE.REVISION, 10) < 165;
  function kopiere(renderer) {
    if (altSig) renderer.copyFramebufferToTexture(_nullPos, sceneTex);
    else renderer.copyFramebufferToTexture(sceneTex, _nullPos);
  }

  function ensureSize(renderer) {
    renderer.getDrawingBufferSize(_size);
    if (_size.x === bufW && _size.y === bufH) return;
    bufW = _size.x; bufH = _size.y;
    sceneTex.dispose();
    sceneTex = new THREE.FramebufferTexture(bufW, bufH);
    sceneTex.minFilter = THREE.LinearFilter; sceneTex.magFilter = THREE.LinearFilter;
    glassMat.uniforms.sceneTex.value = sceneTex;
    glassMat.uniforms.resolution.value.set(bufW, bufH);
  }
  function spawnStreak(idx, heavy) {
    const s = streaks[idx];
    s.angle = -WIND_ANGLE + (Math.random() - 0.5) * 2 * ANGLE_JITTER;
    s.length = heavy ? 0.12 + Math.random() * 0.20 : 0.08 + Math.random() * 0.14;
    s.width = heavy ? 0.002 + Math.random() * 0.002 : 0.0015 + Math.random() * 0.0015;
    s.speed = heavy ? 2.4 + Math.random() * 1.8 : 1.8 + Math.random() * 1.4;
    s.x = (Math.random() - 0.5) * 2.6;
    s.y = 1.15 + Math.random() * 0.3;
    s.active = true;
  }
  function updateLightning(dt, rainWeight) {
    if (moonProgress < 0.75 || rainWeight <= 0) { lightningMesh.visible = false; lightningAlpha = 0; return; }
    if (lightningAlpha > 0) {
      lightningAlpha = Math.max(0, lightningAlpha - dt * 4.0);
      lightningMat.uniforms.alpha.value = lightningAlpha;
      lightningMesh.visible = lightningAlpha > 0.01;
      return;
    }
    lightningCooldown -= dt;
    if (lightningCooldown <= 0) {
      const urgency = Math.min(1, (moonProgress - 0.75) / 0.25);
      lightningAlpha = 0.5 + Math.random() * 0.35;
      lightningMat.uniforms.alpha.value = lightningAlpha;
      lightningMesh.visible = true;
      const minInterval = 2.0 - urgency * 1.2, maxInterval = 6.0 - urgency * 3.0;
      lightningCooldown = minInterval + Math.random() * (maxInterval - minInterval);
      if (api.onLightningFlash) api.onLightningFlash();
      if (Math.random() < 0.4) setTimeout(() => { lightningAlpha = 0.3 + Math.random() * 0.2; }, 80 + Math.random() * 120);
    }
  }
  let aktiveStreifen = 0;
  return {
    name: 'rain-overlay',
    get onLightningFlash() { return api.onLightningFlash; },
    set onLightningFlash(fn) { api.onLightningFlash = fn; },
    get weight() { return currentWeight; },
    get streaks() { return aktiveStreifen; },
    update(dt, rainWeight, moonProg = 0) {
      moonProgress = moonProg; currentWeight = rainWeight;
      if (rainWeight <= 0) {
        for (let i = 0; i < STREAK_COUNT; i++) { streaks[i].active = false; streakMeshes[i].visible = false; }
        glassMesh.visible = false; lightningMesh.visible = false; lightningAlpha = 0; aktiveStreifen = 0;
        return;
      }
      time += dt;
      const intensity = rainWeight;
      const apocalypse = moonProgress >= 0.75;
      const spawnChance = apocalypse ? 1.0 : intensity * 0.85;
      const spawnRate = apocalypse ? 60 : 30;
      const activeLimit = apocalypse ? STREAK_COUNT : Math.floor(STREAK_COUNT * 0.25);
      const opacityMul = apocalypse ? 0.55 : 0.35;
      let aktiv = 0;
      for (let i = 0; i < STREAK_COUNT; i++) {
        const s = streaks[i];
        if (!s.active) {
          if (i < activeLimit && Math.random() < spawnChance * dt * spawnRate) spawnStreak(i, apocalypse);
          continue;
        }
        s.x += Math.sin(s.angle) * s.speed * dt;
        s.y += -Math.cos(s.angle) * s.speed * dt;
        if (s.y < -1.3) { s.active = false; streakMeshes[i].visible = false; continue; }
        const mesh = streakMeshes[i];
        mesh.position.set(s.x, s.y, 0); mesh.rotation.z = s.angle; mesh.scale.set(s.width, s.length, 1);
        mesh.visible = true; streakMats[i].uniforms.opacity.value = intensity * opacityMul; aktiv++;
      }
      aktiveStreifen = aktiv;
      glassMat.uniforms.time.value = time; glassMat.uniforms.opacity.value = intensity; glassMesh.visible = true;
      updateLightning(dt, rainWeight);
    },
    render(renderer) {
      if (currentWeight <= 0) return;
      ensureSize(renderer);
      if (glassMesh.visible) kopiere(renderer);
      renderer.autoClear = false;
      if (glassMesh.visible) renderer.render(glassScene, orthoCamera);
      let any = false; for (const m of streakMeshes) if (m.visible) { any = true; break; }
      if (any) renderer.render(streakScene, orthoCamera);
      renderer.autoClear = true;
    },
    dispose() {
      geo.dispose(); glassGeo.dispose(); glassMat.dispose(); noiseTex.dispose(); sceneTex.dispose();
      lightningMat.dispose(); lightningMesh.geometry.dispose(); for (const m of streakMats) m.dispose();
    },
  };
}

/**
 * Regengewicht 0–1 — zeichengleich `DayNightCycle.getRainWeight` (Wanduhr + Seed, zwei langsame
 * Sinus mit irrationalem Frequenzverhältnis; alle Clients sehen dasselbe Wetter). Georg, Formular
 * 2.9.: „wie die Quelle: seed-gebundene Episoden über Wanduhr". `nowSec` ist injizierbar, damit ein
 * Tor die Episoden vorausrechnen kann, statt zu warten.
 */
export function rainWeight(worldSeed, nowSec = Date.now() / 1000, moonProgress = 0) {
  const s = worldSeed;
  const a = Math.sin(nowSec * 0.058 + s * 1.7) * 0.5 + 0.5;
  const b = Math.sin(nowSec * 0.026 + s * 3.1) * 0.5 + 0.5;
  const raw = a * 0.65 + b * 0.35;
  if (moonProgress >= 0.75) {
    const urgency = Math.min(1, (moonProgress - 0.75) / 0.25);
    const lo = 0.50 - urgency * 0.30, hi = 0.58 + urgency * 0.15;
    const t = Math.max(0, Math.min(1, (raw - lo) / (hi - lo)));
    const base = t * t * (3 - 2 * t);
    return Math.min(1, base + urgency * 0.4);
  }
  const lo = 0.50, hi = 0.58;
  const t = Math.max(0, Math.min(1, (raw - lo) / (hi - lo)));
  return t * t * (3 - 2 * t);
}

/** Das Tor: wann regnet es in dieser Welt? Rechnet die nächsten `horizontMin` Minuten in 10-s-Schritten
 *  durch — Anteil Regenzeit, nächste Episode, aktueller Wert. Ein Wetter, das man nur durch Warten
 *  prüfen kann, ist kein Tor. */
export function regenTor(worldSeed, nowSec = Date.now() / 1000, horizontMin = 30) {
  const jetzt = rainWeight(worldSeed, nowSec);
  let regenSek = 0, naechste = null, ende = null;
  for (let t = 0; t <= horizontMin * 60; t += 10) {
    const w = rainWeight(worldSeed, nowSec + t);
    if (w > 0.02) { regenSek += 10; if (naechste == null && jetzt <= 0.02) naechste = t; if (naechste != null && ende == null) { /* läuft */ } }
    else if (naechste != null && ende == null && t > naechste) ende = t;
  }
  return { jetzt, anteil: regenSek / (horizontMin * 60), naechsteIn: naechste, dauer: (naechste != null && ende != null) ? ende - naechste : null,
    text: (jetzt > 0.02 ? 'raining now, weight ' + jetzt.toFixed(2) : 'dry now')
      + ' · next ' + horizontMin + ' min: ' + Math.round(regenSek / (horizontMin * 60) * 100) + ' % rain'
      + (naechste != null ? ' · next episode in ' + Math.round(naechste / 60) + ' min' + (ende != null ? ', ~' + Math.round((ende - naechste) / 60) + ' min long' : '') : '')
      + ' · source: two seeded sine waves on the wall clock (DayNightCycle.getRainWeight), fog per sky preset unchanged' };
}
