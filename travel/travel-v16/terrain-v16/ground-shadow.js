// ============================================================================
// ground-shadow.js — KFB Travel · Slice S15 · Blob-Schatten
// ----------------------------------------------------------------------------
// Warum kein echter Schattenwurf: das Pet WIRFT längst Schatten (`castShadow`
// steht, die Schattenkarte der Sonne läuft) — aber **nichts empfängt sie**. Die
// Terrain-Cubes sind ein eigenes `ShaderMaterial` ohne Shadowmap-Chunks, und die
// Chunks bekämen sie nur mit einem Umbau ihres Shaders. Dazu kommt: die Cubes
// tanzen, eine echte Schattenkante würde auf ihnen zappeln.
//
// Also die cartoongerechte Lösung: eine weiche dunkle Fläche unter dem Objekt.
// Ein Quad, radial ausgefadet, unbeleuchtet, `depthWrite: false` — aber mit
// Tiefentest, damit ein höherer Cube den Schatten korrekt verdeckt.
//
// Zwei Anwendungen, dieselbe Klasse:
//  · **Karten-Schatten** auf dem Terrain: hängt in der Szene, folgt der
//    Bodenhöhe unter dem Fahrzeug, dreht mit dem Kurs. Größer und blasser mit
//    der Flughöhe — das ist die eigentliche Höhenauskunft am Boden.
//  · **Pet-Schatten auf der Karte**: hängt IM Karten-Rig (`rig.lean`), also
//    bankt und wellt er mit. Beim Sprung wächst er und wird blasser; das ist der
//    Kontakt, der einem Cartoon-Sprung Gewicht gibt.
//
//   const sh = createBlobShadow({ THREE, color: 0x1f1a14 });
//   parent.add(sh.mesh);
//   sh.place(x, y, z, sizeX, sizeZ, heading, opacity);
// ============================================================================

export function createBlobShadow(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({
    color: 0x1f1a14,
    core: 0.34,      // Radius des vollen Kerns (0..1); darüber fädt der Rand weich aus
    opacity: 0.42,
  }, opts.params || {});

  const geo = new THREE.PlaneGeometry(1, 1);
  geo.rotateX(-Math.PI / 2);          // liegt flach; lokal x → Welt x, lokal y → Welt z

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(P.color) },
      uOpacity: { value: 0 },
      uCore: { value: P.core },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform vec3 uColor; uniform float uOpacity, uCore;
      varying vec2 vUv;
      void main() {
        float d = length(vUv - 0.5) * 2.0;                 // 0 in der Mitte, 1 am Rand
        // voller Kern bis uCore, dann weich aus — ein Exponent allein macht den Fleck zu blass,
        // um auf einem gemusterten Boden überhaupt gelesen zu werden.
        float a = (1.0 - smoothstep(uCore, 1.0, d)) * uOpacity;
        if (a <= 0.003) discard;
        gl_FragColor = vec4(uColor, a);
      }`,
    transparent: true, depthWrite: false, toneMapped: false,
    blending: THREE.NormalBlending, side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 1;               // nach dem Terrain, damit die Kante nicht flimmert
  mesh.visible = false;

  return {
    name: 'blob-shadow', mesh,
    place(x, y, z, sx, sz, heading, opacity) {
      const o = Math.max(0, opacity);
      mat.uniforms.uOpacity.value = o;
      mesh.visible = o > 0.004;
      if (!mesh.visible) return;
      mesh.position.set(x, y, z);
      mesh.scale.set(Math.max(0.01, sx), 1, Math.max(0.01, sz));
      mesh.rotation.y = heading || 0;
    },
    setColor(hex) { mat.uniforms.uColor.value.set(hex); },
    setCore(v) { mat.uniforms.uCore.value = v; },
    hide() { mat.uniforms.uOpacity.value = 0; mesh.visible = false; },
    dispose() { geo.dispose(); mat.dispose(); },
  };
}
