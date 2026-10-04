// ============================================================================
// impact-dust.js — Steinchen am Aufprallort (v3 · S7f)
// ----------------------------------------------------------------------------
// Georg, 29.8.: „beim bouncen der dice wären kleine steinchen/partikel am impact-ort gut (ebenso
// wie bei flug-boden-kontakt), die der jeweiligen impact-physik/kinetik dezent, aber wirkungsvoll
// animiert folgen".
//
// Der Satz enthält die ganze Spezifikation, und zwar in seinem Nebensatz: **die Partikel folgen
// der jeweiligen Impact-Kinetik.** Ein Partikelsystem, das immer denselben Puff macht, ist Deko;
// eines, das die Geschwindigkeit des Verursachers erbt, ist Physik-Sprache. Also nimmt `burst()`
// die Impuls-Geschwindigkeit als Argument:
//   · **Würfel-Bounce** — senkrechter Aufprall. Die Steinchen springen radial nach außen und
//     etwas hoch, Betrag nach Aufprallgeschwindigkeit. Ein harter Bounce spritzt weiter.
//   · **Flug-Boden-Kontakt** — Streifschlag. Der Teppich hat viel Längsgeschwindigkeit und wenig
//     senkrechte: die Steinchen werden nach HINTEN geschleppt, nicht nach oben geworfen.
// Dasselbe Modul, dasselbe Bild, zwei Kinetiken — kein zweites System für den zweiten Anlass.
//
// **Bauform: EIN gepooltes `Points`-Objekt, kein Objekt je Steinchen.** 160 Partikel, ein
// Draw-Call, keine Allokation im Bild. Tote Partikel bekommen Größe 0 statt aus der Szene zu
// fliegen — Löschen aus einem Attribut-Array kostet mehr als es spart.
//
// ⚠ Die Schwerkraft zeigt entgegen der STANDORTNORMALE, nicht entgegen Welt-Y: auf einer Kugel
// gibt es kein globales Unten. Jedes Steinchen trägt seine Normale mit (die des Aufprallorts) —
// das ist billiger und richtiger, als sie je Bild aus der Position neu zu rechnen.
// ============================================================================

export function createImpactDust(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({
    max: 160,
    camera: null,       // für den Projektionsfaktor — ohne Kamera bleibt die Voreinstellung stehen
    viewportPx: 0,      // 0 = `innerHeight`
    size: 0.011,        // Weltmaß eines Steinchens — gegen 0,05 Würfel und 0,075 Pet: dezent
    life: 0.85,         // Sekunden
    gravity: 3.2,
    bounce: 0.34,       // sie hüpfen einmal nach — Steinchen auf Fels, nicht Mehl
    drag: 0.72,         // Luftwiderstand je Sekunde (Anteil, der bleibt)
    on: true,
  }, opts.params || {});

  // Rundes Steinchen als Punktsprite. Ein Canvas, 32 px — größer wäre bei 11 Tausendstel Weltmaß
  // verschwendet, und ein hartes Quadrat liest bei dieser Größe als Dreckfleck.
  const tex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 32;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(16, 14, 1, 16, 16, 15);
    gr.addColorStop(0, 'rgba(255,252,242,1)');
    gr.addColorStop(0.45, 'rgba(214,198,166,.95)');
    gr.addColorStop(1, 'rgba(120,104,80,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(16, 16, 15, 0, Math.PI * 2); g.fill();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();

  const N = P.max;
  const pos = new Float32Array(N * 3);
  const siz = new Float32Array(N);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(siz, 1));
  // Eigener Shader, weil `PointsMaterial` keine Größe JE Partikel kann — und ohne die kann kein
  // Steinchen kleiner werden, während es ausläuft. Zwölf Zeilen sind billiger als 160 Sprites.
  //
  // ⚠ **Die Punktgröße war eine geratene Formel, und das hat zwei Befunde auf einmal erzeugt**
  // (Georg, 29.8.: „statt Partikel sehe ich große Kreise beim dice bounce" und „terrain UND
  // Würfel sind überstrahlt"). Es stand `gl_PointSize = size * 620.0 / max(0.05, -mv.z)`:
  //  · **620 war eine Zauberzahl** ohne Bezug zu Bildhöhe oder Bildwinkel. Richtig ist der
  //    Projektionsfaktor `hPx / (2·tan(fov/2))` — damit ist ein Steinchen von 0,011 Weltmaß in
  //    einem Meter Abstand genau so groß, wie es die Perspektive vorschreibt.
  //  · **Keine Obergrenze.** Bei `-mv.z` = 0,05 (Klemme) ergab die Formel **136 px** — ein
  //    Steinchen von 11 Tausendstel Weltmaß als handtellergroße weiße Scheibe. Und weil bei einem
  //    Bounce neun davon dicht an der Kamera entstehen, legten sich neun halbtransparente
  //    Scheiben übereinander über das Bild: **das war das „überstrahlte Terrain".** Nicht das
  //    Terrain war zu hell — es lag Milchglas davor. Zwei Symptome, eine Zeile.
  // Jetzt: echter Projektionsfaktor als Uniform, harte Deckelung, und die Klemme auf `-mv.z` weit
  // genug, dass ein Steinchen direkt vor der Linse nicht die Sicht nimmt.
  const mat = new THREE.ShaderMaterial({
    uniforms: { map: { value: tex }, tint: { value: new THREE.Color(0xd8c9a8) },
                projF: { value: 900 }, maxPx: { value: 26 } },
    vertexShader: [
      'attribute float size;',
      'uniform float projF;',
      'uniform float maxPx;',
      'varying float vS;',
      'void main() {',
      '  vS = size;',
      '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
      '  gl_PointSize = min(maxPx, size * projF / max(0.35, -mv.z));',
      '  gl_Position = projectionMatrix * mv;',
      '}',
    ].join('\n'),
    fragmentShader: [
      'uniform sampler2D map;',
      'uniform vec3 tint;',
      'varying float vS;',
      'void main() {',
      '  if (vS <= 0.0) discard;',
      '  vec4 t = texture2D(map, gl_PointCoord);',
      '  gl_FragColor = vec4(tint * t.rgb, t.a);',
      '}',
    ].join('\n'),
    transparent: true, depthWrite: false, fog: false,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  points.renderOrder = 2;

  // Zustand je Partikel in flachen Feldern — ein Objekt je Steinchen wäre 160 Allokationen je Salve.
  const vel = new Float32Array(N * 3);
  const nrm = new Float32Array(N * 3);
  const t0 = new Float32Array(N);
  const s0 = new Float32Array(N);
  let cursor = 0, lebend = 0, salven = 0, gesamt = 0;

  const _n = new THREE.Vector3(), _t1 = new THREE.Vector3(), _t2 = new THREE.Vector3();

  /**
   * Eine Salve.
   * @param p      Weltort des Aufpralls
   * @param normal Standortnormale dort (das lokale „oben")
   * @param impuls Geschwindigkeit des Verursachers (Vector3) — DAS ist die Kinetik, der die
   *               Steinchen folgen. Länge steuert Reichweite, Richtung die Streurichtung.
   * @param anzahl 4…14 ist der dezente Bereich
   */
  function burst(p, normal, impuls, anzahl) {
    if (!P.on || !p || !normal) return 0;
    const n = Math.max(1, Math.min(20, anzahl || 8));
    _n.copy(normal).normalize();
    // Tangentenbasis am Aufprallort. Der Ausweichvektor gegen die Entartung ist Pflicht: ist die
    // Normale zufällig Welt-X, ergibt das Kreuzprodukt mit X den Nullvektor.
    _t1.set(0, 1, 0);
    if (Math.abs(_t1.dot(_n)) > 0.9) _t1.set(1, 0, 0);
    _t1.crossVectors(_t1, _n).normalize();
    _t2.crossVectors(_n, _t1).normalize();

    // Der Impuls wird in senkrecht und waagerecht zerlegt — daraus entsteht der Unterschied
    // zwischen „springt" (Würfel) und „wird geschleppt" (Teppich), ohne zwei Codepfade.
    const vN = impuls ? impuls.dot(_n) : 0;
    const vT = impuls ? Math.sqrt(Math.max(0, impuls.lengthSq() - vN * vN)) : 0;
    const hoch = Math.min(1.4, 0.28 + Math.abs(vN) * 0.55);
    const weit = Math.min(1.2, 0.16 + vT * 0.42 + Math.abs(vN) * 0.14);

    for (let k = 0; k < n; k++) {
      const i = cursor; cursor = (cursor + 1) % N;
      const a = Math.random() * Math.PI * 2;
      const r = weit * (0.4 + Math.random() * 0.9);
      const u = hoch * (0.45 + Math.random() * 0.85);
      // Waagerechter Anteil: radial gestreut PLUS die Schleppkomponente des Verursachers.
      const vx = Math.cos(a) * r, vz = Math.sin(a) * r;
      let ex = _t1.x * vx + _t2.x * vz + _n.x * u;
      let ey = _t1.y * vx + _t2.y * vz + _n.y * u;
      let ez = _t1.z * vx + _t2.z * vz + _n.z * u;
      if (impuls && vT > 0.01) {
        // Die Schleppe: 30 % der waagerechten Verursacher-Geschwindigkeit. Deshalb ziehen die
        // Steinchen beim Streifschlag hinter dem Teppich her statt senkrecht zu stauben.
        ex += (impuls.x - _n.x * vN) * 0.3;
        ey += (impuls.y - _n.y * vN) * 0.3;
        ez += (impuls.z - _n.z * vN) * 0.3;
      }
      const b = i * 3;
      pos[b] = p.x; pos[b + 1] = p.y; pos[b + 2] = p.z;
      vel[b] = ex; vel[b + 1] = ey; vel[b + 2] = ez;
      nrm[b] = _n.x; nrm[b + 1] = _n.y; nrm[b + 2] = _n.z;
      t0[i] = P.life * (0.7 + Math.random() * 0.6);
      s0[i] = P.size * (0.55 + Math.random() * 0.9);
      siz[i] = s0[i];
      gesamt++;
    }
    salven++;
    geo.attributes.position.needsUpdate = true;
    geo.attributes.size.needsUpdate = true;
    return n;
  }

  function update(dt) {
    if (!P.on) return;
    // Der Projektionsfaktor hängt an Bildhöhe und Bildwinkel — beide können sich ändern (Fenster,
    // FOV-Kick), also wird er gelesen statt gespeichert. Eine Division je Bild.
    if (P.camera) {
      const h = P.viewportPx || innerHeight;
      mat.uniforms.projF.value = h / (2 * Math.tan((P.camera.fov * Math.PI / 180) / 2));
    }
    let am = 0;
    const halt = Math.pow(P.drag, dt);
    for (let i = 0; i < N; i++) {
      if (t0[i] <= 0) { if (siz[i] !== 0) siz[i] = 0; continue; }
      t0[i] -= dt;
      const b = i * 3;
      if (t0[i] <= 0) { siz[i] = 0; continue; }
      am++;
      vel[b] *= halt; vel[b + 1] *= halt; vel[b + 2] *= halt;
      const g = P.gravity * dt;
      vel[b] -= nrm[b] * g; vel[b + 1] -= nrm[b + 1] * g; vel[b + 2] -= nrm[b + 2] * g;
      pos[b] += vel[b] * dt; pos[b + 1] += vel[b + 1] * dt; pos[b + 2] += vel[b + 2] * dt;
      // Ausklang: die letzten 45 % der Lebenszeit schrumpft das Steinchen. Kein Alpha-Fade —
      // bei 11 Tausendstel Weltmaß liest Schrumpfen als Wegrollen, Ausblenden als Bug.
      const k = t0[i] / P.life;
      siz[i] = s0[i] * Math.min(1, k / 0.45);
    }
    lebend = am;
    geo.attributes.position.needsUpdate = true;
    geo.attributes.size.needsUpdate = true;
  }

  return {
    name: 'impact-dust', params: P, object: points, burst, update,
    setEnabled(on) { P.on = !!on; if (!on) { for (let i = 0; i < N; i++) { t0[i] = 0; siz[i] = 0; } geo.attributes.size.needsUpdate = true; } },
    /** Deckel für die Sprite-Größe in Pixeln — der Regler gegen „große Kreise". */
    setMaxPx(px) { mat.uniforms.maxPx.value = Math.max(2, px); },
    get maxPx() { return mat.uniforms.maxPx.value; },
    get enabled() { return P.on; },
    get alive() { return lebend; },
    report() { return { an: P.on, lebend, salven, steinchen: gesamt, pool: N,
                        groesse: P.size, maxPx: mat.uniforms.maxPx.value,
                        projF: +mat.uniforms.projF.value.toFixed(0), drawCalls: 1 }; },
    dispose() { geo.dispose(); mat.dispose(); tex.dispose(); },
  };
}
