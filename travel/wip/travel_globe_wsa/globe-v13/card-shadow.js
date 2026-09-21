// ============================================================================
// card-shadow.js — KFB Travel Globe v3b · Schatten, der sich dem Boden anpasst
// ----------------------------------------------------------------------------
// Georg, 29.8., drei Einwände gegen den v17-Blob (`ground-shadow.js`), alle berechtigt:
//   „der runde Schatten passt nicht zu Pet/eckiger Karte · er ist zu groß · er wird vom
//    Terrain angeschnitten statt sich anzupassen (sieht fehlerhaft aus)"
// und die faire Alternative: „tinyskies verzichtet auf Schatten → wäre bei uns auch okay,
// es sei denn, du hast eine smarte Lösung."
//
// **Das ist die smarte Lösung, und sie hat genau eine Idee:** der Schatten ist kein Quad,
// das über dem Boden schwebt und deshalb in ihn schneidet, sondern ein **Gitter, das den
// Boden abliest** — 8×8 Felder, jeder Knoten auf `surfaceAltitudeAt` seiner eigenen Stelle
// plus 1,5 mm Abhebung. Über einer Kante knickt er mit der Kante, in einer Mulde sinkt er
// hinein. Ein flaches Quad KANN das nicht: es hat vier Ecken und der Boden hat Facetten.
//
// Drei Folgen, die die anderen zwei Einwände miterledigen:
//   · **Form.** Die Maske ist ein abgerundetes RECHTECK im UV-Raum, gedreht in den Kurs und
//     im Seitenverhältnis der KFB-Karte (800:447 aus `card-carrier.js`, also 0,559). Rund
//     war die Form eines Balls, nicht die eines Blattes.
//   · **Größe.** Grundmaß = Kartenbreite × 1,0 (v17 stand auf 1,5) und wächst erst mit der
//     Flughöhe. Am Boden liegt der Schatten also UNTER der Karte, nicht um sie herum.
//   · **Kosten.** 81 Höhenproben je Bild aus derselben Funktion, die die Flugphysik liest
//     (keine zweite Höhenquelle — dieselbe Regel wie bei den Landmarken). Das ist die eine
//     Zahl, die auf Georgs Gerät gemessen werden muss; `report().proben` sagt sie.
//
// Rückweg, wenn es nicht überzeugt: `setEnabled(false)` — dann ist es tinyskies-treu, ohne
// Schatten. Der Regler heißt „Schatten unter der Karte".
// ============================================================================

export function createCardShadow(opts = {}) {
  const THREE = opts.THREE;
  const R = opts.radius, seed = opts.seed, terrainType = opts.terrainType;
  const altAt = opts.surfaceAltitudeAt;
  const P = Object.assign({
    seg: 8,             // Felder je Achse (Knoten = seg+1 zum Quadrat)
    aspect: 447 / 800,  // Seitenverhältnis der KFB-Karte
    size: 1.0,          // Grundmaß als Vielfaches der Kartenbreite
    spread: 2.2,        // wie stark der Schatten mit der Flughöhe wächst
    lift: 0.0015,       // Abhebung vom Boden (gegen Z-Fighting)
    round: 0.34,        // Eckenradius der Maske (0 = Rechteck, 1 = Ellipse)
    soft: 0.30,         // Weichheit der Kante am Boden
    color: 0x1f1a14,    // dieselbe Tusche wie die Ink-Outline
    opacity: 0.34,
    // ⚠ **Standard AUS, und das ist ein Befund an der Quelle, nicht Bequemlichkeit.**
    // Georg, 30.8.: „schatten sehe ich in TS nicht…?" — er hat recht, und mein Dokument lag falsch.
    // Ich hatte 96 Fundstellen gezählt (`shadowMap.enabled = !mobile`, `sunLight.castShadow`,
    // `surfaceMesh.receiveShadow`) und daraus „die Quelle hat echte Schatten" gemacht. Nachgelesen,
    // was DANEBEN steht (`Game.ts` 1167–1174): eine Schattenkamera von **±22 Weltunits** bei
    // Globusradius **5** — die ganze Kugel liegt in einer Box von 44 Einheiten. Bei 2048 px Karte
    // sind das ~46 px je Weltunit, und ein Baum ist 0,06 Einheiten hoch: **sein Schatten ist drei
    // Pixel.** Der Teppich ebenso. Technisch aktiv, im Bild nicht vorhanden.
    // *Eine Zählung von Fundstellen ist keine Aussage über das Bild — Fehlerklasse „Zählung statt
    // Ort", zum zweiten Mal in dieser Sitzung.*
    // Also: das Vorbild hat im Flug sichtbar KEINEN Schatten unter dem Fahrzeug. Unser gemalter
    // Fleck war damit kein Ersatz für etwas, sondern eine Zutat — und die Zutat war der dunkle
    // Keil, den Georg im Land gemeldet hat (harte Polygonkanten auf steilem Gelände, `seg: 8`).
    // Der Regler bleibt vollständig erhalten (Panel: „Shadow under the card"), nur der Standard
    // folgt jetzt dem Vorbild.
    on: false,
  }, opts.params || {});

  const N = P.seg + 1;
  const geo = new THREE.PlaneGeometry(1, 1, P.seg, P.seg);   // liefert UVs; Positionen schreiben wir
  const pos = geo.attributes.position;
  pos.setUsage(THREE.DynamicDrawUsage);

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(P.color) },
      uOpacity: { value: 0 },
      uRound: { value: P.round },
      uSoft: { value: P.soft },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform vec3 uColor; uniform float uOpacity, uRound, uSoft;
      varying vec2 vUv;
      void main() {
        // Abgerundetes Rechteck als Abstandsfunktion: Halbmaß (1 - r), Radius r.
        vec2 p = abs(vUv * 2.0 - 1.0);
        float r = clamp(uRound, 0.001, 0.999);
        vec2 q = max(p - (1.0 - r), 0.0);
        float d = length(q) + min(max(p.x - (1.0 - r), p.y - (1.0 - r)), 0.0) - r;
        float a = (1.0 - smoothstep(-uSoft, 0.02, d)) * uOpacity;
        if (a <= 0.003) discard;
        gl_FragColor = vec4(uColor, a);
      }`,
    transparent: true, depthWrite: false, toneMapped: false, fog: false,
    blending: THREE.NormalBlending, side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 1;
  mesh.visible = false;
  mesh.name = 'card-shadow';

  const _dir = new THREE.Vector3(), _fwd = new THREE.Vector3(), _right = new THREE.Vector3();
  const _off = new THREE.Vector3();
  let proben = 0, breiteJetzt = 0;

  return {
    name: 'card-shadow', mesh, params: P,
    get enabled() { return P.on; },
    setEnabled(on) { P.on = !!on; if (!on) { mesh.visible = false; } },
    setOpacity(v) { P.opacity = Math.max(0, Math.min(1, v)); },
    get opacity() { return mat.uniforms.uOpacity.value; },
    /**
     * ctx: { up, north, east, heading, cardWidth, agl, sicht }
     * `up` ist die Flächennormale AM FAHRZEUG, `heading` sein Kurs.
     */
    update(ctx) {
      const deck = P.on ? P.opacity * Math.max(0, 1 - Math.max(0, ctx.agl) / 0.5) * (ctx.sicht != null ? ctx.sicht : 1) : 0;
      mat.uniforms.uOpacity.value = deck;
      mesh.visible = deck > 0.004;
      if (!mesh.visible) return;

      // Mit der Höhe größer und weicher — das ist die Höhenauskunft am Boden.
      const wachs = 1 + Math.min(3.0, Math.max(0, ctx.agl) * P.spread * 7.0);
      const sx = ctx.cardWidth * P.size * wachs;
      const sz = sx * P.aspect;
      breiteJetzt = sx;
      mat.uniforms.uSoft.value = P.soft * (1 + (wachs - 1) * 0.6);

      _fwd.set(0, 0, 0).addScaledVector(ctx.north, Math.cos(ctx.heading))
          .addScaledVector(ctx.east, Math.sin(ctx.heading)).normalize();
      _right.crossVectors(_fwd, ctx.up).normalize();

      const arr = pos.array;
      for (let j = 0; j < N; j++) {
        // PlaneGeometry läuft von oben nach unten; für uns ist die Reihenfolge gleichgültig,
        // solange UV und Position denselben Knoten meinen — beides kommt aus (i, j).
        const tz = (j / P.seg - 0.5) * sz;
        for (let i = 0; i < N; i++) {
          const tx = (i / P.seg - 0.5) * sx;
          _off.set(0, 0, 0).addScaledVector(_right, tx).addScaledVector(_fwd, tz);
          // Tangentialer Versatz auf die Kugel abbilden: die Richtung wandert um off/R.
          _dir.copy(ctx.up).addScaledVector(_off, 1 / R).normalize();
          const alt = altAt(seed, terrainType, _dir.x, _dir.y, _dir.z);
          proben++;
          const rr = R + alt + P.lift;
          const k = (j * N + i) * 3;
          arr[k] = _dir.x * rr; arr[k + 1] = _dir.y * rr; arr[k + 2] = _dir.z * rr;
        }
      }
      pos.needsUpdate = true;
      geo.computeBoundingSphere();
    },
    hide() { mat.uniforms.uOpacity.value = 0; mesh.visible = false; },
    report() {
      return { an: P.on, deckkraft: +mat.uniforms.uOpacity.value.toFixed(3),
               breite: +breiteJetzt.toFixed(4), knoten: N * N,
               probenJeBild: N * N, probenTotal: proben };
    },
    dispose() { geo.dispose(); mat.dispose(); },
  };
}
