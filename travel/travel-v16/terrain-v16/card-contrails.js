// ============================================================================
// card-contrails.js — KFB Travel · Slice S2b · Kondensstreifen an den Kartenecken
// ----------------------------------------------------------------------------
// PORTIERT aus TinySkies `client/src/game/Contrails.ts` (Commit 2659a5cc): zwei
// Ribbon-Meshes, die an den Flügelspitzen hängen und der Kamera zugewandt
// aufgespannt werden. Genau das, was Georg an den Screenshots meint — bei
// Normaltempo die einzige Geschwindigkeitsauskunft, und sie zeichnen Bank,
// Barrel-Roll und Steigflug als Kurve in die Luft.
//
// Was 1:1 von dort kommt:
//  · 72 Segmente, Ribbon aus zwei Vertices pro Segment, Index `a,c,b, b,c,d`
//  · Querachse = `cross(Bewegungsrichtung, Blickrichtung zur Kamera)` — deshalb
//    bleibt das Band immer sichtbar, egal wie man um es herumfliegt; Fallback
//    auf die letzte Querachse, wenn zwei Punkte zusammenfallen
//  · Breite und Alpha faden über die Länge (`fade`, `fade²`), additiv, eisblau,
//    `toneMapped: false`, `premultipliedAlpha: true`
//
// Was anders ist (und warum):
//  · **Ankerpunkte sind die hinteren Kartenecken**, gelesen aus der Weltmatrix
//    von `rig.lean` — damit tragen die Streifen Bank, Kippung, Kantencurl und
//    Barrel-Roll ohne eine eigene Zeile Kinematik.
//  · **Punkte werden strecken-, nicht frame-getaktet** (`minStep`): bei 20 km/h
//    sonst 72 Punkte auf zwei Metern, also ein Klumpen statt eines Bandes.
//  · **Ab 20 km/h** (`kmhOn`) fadet das Band ein, mit dem Tempo heller, und der
//    dünne Kern wird weiß (`uWhite`) — nicht das ganze Band.
//  · Keine Allokation im Frame: Punkte in einem `Float32Array`, das per
//    `copyWithin` nachrückt.
//
//   const trails = createCardContrails({ THREE });
//   scene.add(trails.group);
//   trails.update(dt, rig.lean, camera, { kmh });   // im Flug, nach rig.sync
//   trails.setActive(false);                        // Walk-Modus
// ============================================================================

export function createCardContrails(opts = {}) {
  const THREE = opts.THREE;
  const SEG = opts.segments || 72;
  const P = Object.assign({
    width: 0.055,       // Bandbreite an der Spitze (Karte ist 3.0 breit; TinySkies: 0.005 auf 0.22 Spannweite)
    minStep: 0.10,      // ein neuer Punkt erst nach dieser Strecke
    kmhOn: 20,          // ab hier sichtbar
    kmhFull: 70,        // hier voll ausgefahren
    alpha: 0.55,        // wie im Original
    white: 1.0,         // wie weiß der Kern bei Vollgas wird
    tint: 0xdfeaff,     // eisblau wie dort; setTint() zieht die Story-Farbe nach
  }, opts.params || {});

  const group = new THREE.Group();
  group.frustumCulled = false;
  const _dir = new THREE.Vector3(), _toCam = new THREE.Vector3(), _cross = new THREE.Vector3();
  const _fallback = new THREE.Vector3(0, 1, 0), _p = new THREE.Vector3(), _q = new THREE.Vector3();
  const _camPos = new THREE.Vector3();

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTint: { value: new THREE.Color(P.tint) },
      uWhite: { value: 0 },
      uOpacity: { value: 0 },
    },
    vertexShader: `
      attribute float aAlpha; attribute float aSide;
      varying float vA; varying float vSide;
      void main() {
        vA = aAlpha; vSide = aSide;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform vec3 uTint; uniform float uWhite; uniform float uOpacity;
      varying float vA; varying float vSide;
      void main() {
        float core = 1.0 - abs(vSide);              // 1 in der Mitte, 0 an den Rändern
        float soft = core * core;                   // weiche Kante statt Bandkante
        vec3 col = mix(uTint, vec3(1.0), core * core * uWhite);
        float a = vA * soft * uOpacity;
        if (a <= 0.002) discard;
        gl_FragColor = vec4(col * a, a);            // premultipliert, additiv
      }`,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending, premultipliedAlpha: true, toneMapped: false,
  });

  function makeRibbon() {
    const pos = new Float32Array(SEG * 2 * 3);
    const alpha = new Float32Array(SEG * 2);
    const side = new Float32Array(SEG * 2);
    for (let i = 0; i < SEG; i++) { side[i * 2] = -1; side[i * 2 + 1] = 1; }
    const geo = new THREE.BufferGeometry();
    const posA = new THREE.BufferAttribute(pos, 3); posA.setUsage(THREE.DynamicDrawUsage);
    const alA = new THREE.BufferAttribute(alpha, 1); alA.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posA);
    geo.setAttribute('aAlpha', alA);
    geo.setAttribute('aSide', new THREE.BufferAttribute(side, 1));
    const idx = [];
    for (let i = 0; i < SEG - 1; i++) { const a = i * 2, b = a + 1, c = a + 2, d = a + 3; idx.push(a, c, b, b, c, d); }
    geo.setIndex(idx);
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    group.add(mesh);
    return {
      geo, posA, alA, pos, alpha,
      pts: new Float32Array(SEG * 3), n: 0,
      lastCross: new THREE.Vector3(0, 1, 0),
    };
  }

  const ribbons = [makeRibbon(), makeRibbon()];
  // Ankerpunkte im Karten-Raum (lean-lokal): hintere Ecken, knapp über der Oberfläche.
  // halfW/halfD kommen vom Runner über setAnchors(), damit hier keine Kartenmaße doppelt liegen.
  const anchors = [new THREE.Vector3(-1.38, 0.02, 0.62), new THREE.Vector3(1.38, 0.02, 0.62)];
  let opacity = 0, active = true;

  function pushPoint(rb, x, y, z) {
    if (rb.n > 0) {
      const dx = x - rb.pts[0], dy = y - rb.pts[1], dz = z - rb.pts[2];
      if (dx * dx + dy * dy + dz * dz < P.minStep * P.minStep) {
        rb.pts[0] = x; rb.pts[1] = y; rb.pts[2] = z;   // Kopf nachziehen, kein neues Segment
        return;
      }
    }
    rb.pts.copyWithin(3, 0, (SEG - 1) * 3);
    rb.pts[0] = x; rb.pts[1] = y; rb.pts[2] = z;
    if (rb.n < SEG) rb.n++;
  }

  function writeRibbon(rb, camPos) {
    const { pts, pos, alpha } = rb;
    for (let i = 0; i < SEG; i++) {
      const o = i * 6, ao = i * 2;
      if (i >= rb.n) { pos[o] = pos[o + 1] = pos[o + 2] = pos[o + 3] = pos[o + 4] = pos[o + 5] = 0; alpha[ao] = alpha[ao + 1] = 0; continue; }
      const pi = i * 3;
      const px = pts[pi], py = pts[pi + 1], pz = pts[pi + 2];
      const prev = Math.max(i - 1, 0) * 3, next = Math.min(i + 1, rb.n - 1) * 3;
      _dir.set(pts[prev] - pts[next], pts[prev + 1] - pts[next + 1], pts[prev + 2] - pts[next + 2]);
      if (_dir.lengthSq() < 1e-10) _cross.copy(rb.lastCross);
      else {
        _dir.normalize();
        _toCam.set(camPos.x - px, camPos.y - py, camPos.z - pz).normalize();
        _cross.crossVectors(_dir, _toCam);
        if (_cross.lengthSq() < 1e-10) _cross.crossVectors(_dir, _fallback);
        _cross.normalize();
        rb.lastCross.copy(_cross);
      }
      const fade = 1 - i / SEG, w = P.width * fade;
      pos[o] = px + _cross.x * w; pos[o + 1] = py + _cross.y * w; pos[o + 2] = pz + _cross.z * w;
      pos[o + 3] = px - _cross.x * w; pos[o + 4] = py - _cross.y * w; pos[o + 5] = pz - _cross.z * w;
      const a = fade * fade * P.alpha;
      alpha[ao] = a; alpha[ao + 1] = a;
    }
    rb.posA.needsUpdate = true; rb.alA.needsUpdate = true;
  }

  function update(dt, lean, camera, src) {
    src = src || {};
    const kmh = src.kmh || 0;
    const f = Math.max(0, Math.min(1, (kmh - P.kmhOn) / Math.max(1, P.kmhFull - P.kmhOn)));
    const want = active ? f : 0;
    opacity += (want - opacity) * Math.min(1, dt * (want > opacity ? 5 : 3));
    mat.uniforms.uOpacity.value = opacity;
    mat.uniforms.uWhite.value = Math.max(0, Math.min(1, f * P.white));
    if (opacity <= 0.002 && !active) return;
    if (!lean) return;
    lean.updateWorldMatrix(true, false);
    camera.getWorldPosition(_camPos);
    for (let i = 0; i < 2; i++) {
      _p.copy(anchors[i]).applyMatrix4(lean.matrixWorld);
      pushPoint(ribbons[i], _p.x, _p.y, _p.z);
      writeRibbon(ribbons[i], _camPos);
    }
  }

  return {
    name: 'card-contrails', group, update,
    setAnchors(halfW, halfD) {
      anchors[0].set(-halfW * 0.92, 0.02, halfD * 0.74);
      anchors[1].set(halfW * 0.92, 0.02, halfD * 0.74);
    },
    setTint(hex) { mat.uniforms.uTint.value.set(hex); },
    setActive(on) { active = !!on; if (!on) reset(); },
    get active() { return active; },
    setParams(p) { Object.assign(P, p || {}); },
    get params() { return P; },
    get opacity() { return opacity; },
    get segments() { return ribbons[0].n; },
    reset,
    dispose() { for (const rb of ribbons) rb.geo.dispose(); mat.dispose(); },
  };

  function reset() {
    for (const rb of ribbons) {
      rb.n = 0; rb.pts.fill(0); rb.alpha.fill(0); rb.pos.fill(0);
      rb.posA.needsUpdate = true; rb.alA.needsUpdate = true;
    }
  }
}
