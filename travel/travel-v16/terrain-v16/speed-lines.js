// ============================================================================
// speed-lines.js — KFB Travel · Slice S2 · Speedlines als zweiter Pass
// ----------------------------------------------------------------------------
// PORTIERT aus TinySkies `client/src/game/SpeedLines.ts` (Commit 2659a5cc) —
// nicht neu erfunden. Georgs Befund an der ersten Fassung („klobig, eckig,
// schlecht konstruiert") hatte eine klare Ursache: wir haben die STREIFENFORM
// in die Geometrie gelegt (Rechteck mit harter Kante, Alpha pro Vertex). Dort
// steckt sie aber im Fragment-Shader:
//
//   float taper = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
//   float halfW = taper * 0.35;                       // Breite läuft an BEIDEN Enden aus
//   float shape = 1.0 - smoothstep(halfW * 0.3, halfW, abs(vUv.y - 0.5));
//
// Das ergibt eine Spindel mit weichem Rand — ein Strich, kein Brett. Zweiter
// Unterschied: das Quad sitzt MITTIG auf dem Rand-Radius (0.95…1.10) und ragt
// ±Länge/2 — der Großteil liegt also außerhalb des Bildes, sichtbar ist nur die
// auslaufende Spitze. Deshalb wirken die Streifen dort wie vorbeiziehende Luft
// und legen sich nie über das Fahrzeug.
//
// Was wir bewusst ANDERS machen als TinySkies:
//  · **Keine additiven weißen Streifen** (Embed-Doc §15: genau daran verglühen
//    die Pet-Augen). Default ist die Story-`ink`-Farbe mit NormalBlending;
//    `look: 'light'` gibt es als Regler, dann additiv in der Panel-Farbe.
//  · **Ein Draw-Call statt 24**: eine Geometrie, Positionen und `aLife` pro
//    Frame in vorbelegte `Float32Array`s geschrieben (Sprint-Regel: keine
//    Allokation im Frame). Die Shader-Mathematik ist 1:1 die von dort.
//  · Spawn nur in FREIE Slots (ein Ring-Zeiger würde lebende Streifen kappen).
//
//   const lines = createSpeedLines({ THREE, ink: 0xb5642a });
//   lines.setAspect(w / h);
//   lines.update(dt, { heat, pulse });
//   lines.render(renderer);            // nach dem Post-Pass, vor hud.render()
// ============================================================================

export function createSpeedLines(opts = {}) {
  const THREE = opts.THREE;
  const N = 32;                        // TinySkies: 24 — wir haben ein breiteres Bild
  const P = Object.assign({
    heatOn: 0.22,        // darunter: gar keine Streifen
    spawnBase: 0.02,     // Intervall bei voller Fahrt (TinySkies: 0.02 + (1−f)·0.08)
    spawnSlack: 0.08,
    r0: 0.95, r1: 1.10,  // Radius der Streifen-MITTE
    lenMin: 0.35, lenMax: 0.84,
    widMin: 0.0035, widMax: 0.0075,
    lifeMin: 0.30, lifeMax: 0.70,
    rateMin: 0.5, rateMax: 1.3,   // wie schnell ein einzelner Streifen sein Leben abspult
    drift: 0.15,         // wandert über sein Leben nach innen
    // Georgs Korrektur: bei Vollgas werden die Streifen nicht DICKER, sondern HELLER.
    // Breite wächst nur noch minimal, dafür wird der dünne Kern weiß.
    wideFrom: 0.70,
    wideMul: 1.35,
    whiteFrom: 0.40,     // ab hier fängt der Kern an auszuweißen
    opacity: 0.32,       // Deckel, nie höher
    density: 1.0,        // Regler im Overlay
    // Default ist der TinySkies-Look, aber in KFB-Farbe: additiv in der PANEL-Farbe
    // (Cremeweiß der Story), nicht in reinem Weiß — und weil dieser Pass NACH der Szene
    // läuft, kann er kein Objekt überstrahlen (die Bloom-Sorge aus Embed-Doc §15 betrifft
    // Szenen-Material, nicht ein Screen-Overlay). 'ink' bleibt als Comic-Variante.
    look: 'light',
  }, opts.params || {});

  // ---- Pool: ein Array pro Größe, kein Objekt-Garbage ----
  const active = new Uint8Array(N);
  const life = new Float32Array(N), maxLife = new Float32Array(N), rate = new Float32Array(N);
  const ang = new Float32Array(N), off = new Float32Array(N);
  const len = new Float32Array(N), wid = new Float32Array(N);
  let spawnAcc = 0, aspect = 16 / 9, enabled = true, gOpacity = 0, cursor = 0;

  const positions = new Float32Array(N * 4 * 3);
  const uvs = new Float32Array(N * 4 * 2);
  const lifeAttr = new Float32Array(N * 4);
  const index = new Uint16Array(N * 6);
  for (let i = 0; i < N; i++) {
    const v = i * 4, o = i * 6, u = v * 2;
    index[o] = v; index[o + 1] = v + 1; index[o + 2] = v + 2;
    index[o + 3] = v; index[o + 4] = v + 2; index[o + 5] = v + 3;
    // lokale UV: x = entlang des Streifens, y = quer (genau wie das PlaneGeometry dort)
    uvs[u] = 0; uvs[u + 1] = 0; uvs[u + 2] = 1; uvs[u + 3] = 0;
    uvs[u + 4] = 1; uvs[u + 5] = 1; uvs[u + 6] = 0; uvs[u + 7] = 1;
  }
  const geo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(positions, 3); posAttr.setUsage(THREE.DynamicDrawUsage);
  const lifeBA = new THREE.BufferAttribute(lifeAttr, 1); lifeBA.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', posAttr);
  geo.setAttribute('aUv', new THREE.BufferAttribute(uvs, 2));
  geo.setAttribute('aLife', lifeBA);
  geo.setIndex(new THREE.BufferAttribute(index, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(opts.ink != null ? opts.ink : 0x1f1a14) },
      uOpacity: { value: 0 },
      uWhite: { value: 0 },
    },
    vertexShader: `
      attribute vec2 aUv; attribute float aLife;
      varying vec2 vUv; varying float vLife;
      void main() { vUv = aUv; vLife = aLife; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: `
      uniform vec3 uColor; uniform float uOpacity; uniform float uWhite;
      varying vec2 vUv; varying float vLife;
      void main() {
        float taper = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
        float halfW = taper * 0.35;
        float d = abs(vUv.y - 0.5);
        float shape = 1.0 - smoothstep(halfW * 0.3, halfW, d);
        float fade = smoothstep(0.0, 0.4, vLife) * smoothstep(1.0, 0.5, vLife);
        float a = shape * fade * uOpacity;
        if (a <= 0.002) discard;
        // der KERN weißt aus, nicht der ganze Streifen — deshalb wirkt Vollgas heißer,
        // ohne dass der Strich dicker wird
        float core = 1.0 - smoothstep(0.0, halfW * 0.55, d);
        vec3 col = mix(uColor, vec3(1.0), core * core * uWhite);
        gl_FragColor = vec4(col, a);
      }`,
    transparent: true, depthTest: false, depthWrite: false,
    blending: THREE.NormalBlending, side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.add(mesh);
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const rnd = (a, b) => a + Math.random() * (b - a);
  let inkCol = opts.ink != null ? opts.ink : 0x1f1a14, panelCol = 0xf0e2d2;

  function applyLook() {
    if (P.look === 'light') { mat.blending = THREE.AdditiveBlending; mat.uniforms.uColor.value.set(panelCol); }
    else { mat.blending = THREE.NormalBlending; mat.uniforms.uColor.value.set(inkCol); }
    mat.needsUpdate = true;
  }
  applyLook();

  function spawn() {
    let i = -1;
    for (let k = 0; k < N; k++) { const j = (cursor + k) % N; if (!active[j]) { i = j; break; } }
    if (i < 0) return;                 // Pool voll: lieber keinen Streifen als einen gekappten
    cursor = (i + 1) % N;
    active[i] = 1; life[i] = 0;
    ang[i] = Math.random() * Math.PI * 2;
    off[i] = rnd(P.r0, P.r1);
    len[i] = rnd(P.lenMin, P.lenMax);
    wid[i] = rnd(P.widMin, P.widMax);
    rate[i] = rnd(P.rateMin, P.rateMax);
    maxLife[i] = rnd(P.lifeMin, P.lifeMax);
  }

  const hide = (v) => { lifeAttr[v] = lifeAttr[v + 1] = lifeAttr[v + 2] = lifeAttr[v + 3] = 0; };

  function update(dt, src) {
    src = src || {};
    const heat = Math.max(0, Math.min(1, src.heat || 0));
    const pulse = Math.max(0, Math.min(1, src.pulse || 0));
    // Der Boost-Impuls zählt direkt mit — sonst kommen die Streifen erst, wenn das Tempo
    // angekommen ist (Akzeptanz: aus dem Stand innerhalb von zwei Frames).
    const f = enabled ? Math.max(pulse, Math.max(0, (heat - P.heatOn) / (1 - P.heatOn))) : 0;
    gOpacity += (f - gOpacity) * Math.min(1, dt * (f > gOpacity ? 12 : 4));
    // dezent starten: die Deckkraft wächst überproportional, unten bleibt es ein Hauch
    mat.uniforms.uOpacity.value = gOpacity * P.opacity * (0.35 + 0.65 * gOpacity);
    mat.uniforms.uWhite.value = Math.max(0, Math.min(1, (gOpacity - P.whiteFrom) / (1 - P.whiteFrom)));

    if (f > 0.001) {
      const interval = (P.spawnBase + (1 - f) * P.spawnSlack) / Math.max(0.05, P.density);
      spawnAcc += dt;
      let guard = 0;
      while (spawnAcc >= interval && guard++ < N) { spawnAcc -= interval; spawn(); }
    } else spawnAcc = 0;

    // Breite wächst mit der Fahrt (TinySkies' boostMul) — die Spindel bleibt dabei weich
    const boostMul = f > P.wideFrom ? 1 + (P.wideMul - 1) * ((f - P.wideFrom) / (1 - P.wideFrom)) : 1;

    for (let i = 0; i < N; i++) {
      const v = i * 4;
      if (!active[i]) { hide(v); continue; }
      life[i] += dt * rate[i];
      if (life[i] >= maxLife[i]) { active[i] = 0; hide(v); continue; }
      const t = life[i] / maxLife[i];
      const r = off[i] - t * P.drift;
      const ca = Math.cos(ang[i]), sa = Math.sin(ang[i]);
      // Mitte auf dem Rand-Radius, Streifen ragt ±Länge/2 entlang der Radiale …
      const cx = ca * r, cy = sa * r;
      const hx = ca * len[i] * 0.5, hy = sa * len[i] * 0.5;
      const w = wid[i] * boostMul * 0.5;
      const px = -sa * w, py = ca * w;
      // … Rechnung im aspekt-korrigierten Bildraum, x erst beim Schreiben zurück in NDC
      const p = v * 3;
      positions[p] = (cx - hx - px) / aspect; positions[p + 1] = cy - hy - py; positions[p + 2] = 0;
      positions[p + 3] = (cx + hx - px) / aspect; positions[p + 4] = cy + hy - py; positions[p + 5] = 0;
      positions[p + 6] = (cx + hx + px) / aspect; positions[p + 7] = cy + hy + py; positions[p + 8] = 0;
      positions[p + 9] = (cx - hx + px) / aspect; positions[p + 10] = cy - hy + py; positions[p + 11] = 0;
      lifeAttr[v] = lifeAttr[v + 1] = lifeAttr[v + 2] = lifeAttr[v + 3] = t;
    }
    posAttr.needsUpdate = true; lifeBA.needsUpdate = true;
  }

  function render(renderer) {
    if (mat.uniforms.uOpacity.value <= 0.002) return;
    const keep = renderer.autoClear;
    renderer.autoClear = false;
    renderer.render(scene, cam);
    renderer.autoClear = keep;
  }

  return {
    name: 'speed-lines', update, render,
    setAspect(a) { if (a > 0) aspect = a; },
    setInk(hex, panel) { inkCol = hex; if (panel != null) panelCol = panel; applyLook(); },
    setLook(v) { P.look = v === 'light' ? 'light' : 'ink'; applyLook(); },
    get look() { return P.look; },
    setEnabled(on) { enabled = !!on; },
    get enabled() { return enabled; },
    setParams(p) { Object.assign(P, p || {}); applyLook(); },
    get params() { return P; },
    get liveCount() { let c = 0; for (let i = 0; i < N; i++) if (active[i]) c++; return c; },
    get poolSize() { return N; },
    get opacity() { return mat.uniforms.uOpacity.value; },
    preWarm(renderer) { mat.uniforms.uOpacity.value = 0.003; renderer.autoClear = false; renderer.render(scene, cam); renderer.autoClear = true; mat.uniforms.uOpacity.value = 0; },
    reset() { for (let i = 0; i < N; i++) { active[i] = 0; hide(i * 4); } gOpacity = 0; spawnAcc = 0; lifeBA.needsUpdate = true; },
    dispose() { geo.dispose(); mat.dispose(); },
  };
}
