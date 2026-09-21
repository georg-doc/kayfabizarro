// ============================================================================
// pet-lighting.js — KFB Travel · Slice S14 · Pet besser ausleuchten
// ----------------------------------------------------------------------------
// Drei unabhängig schaltbare Bausteine, Antwort auf Georgs Frage „wie bekommen wir
// Farbe und Textur des Pets besser heraus?". Vorher hingen Pet und Karte an genau
// zwei Lampen (warme Sonne 2,6 + Hemisphere 1,0) — auf der Schattenseite arbeitete
// also nur die Hemisphere, und die ist eine Fläche ohne Richtung.
//
//  1. **Sky-Environment.** Der Skydome wird EINMAL pro Story-/Varianten-Wechsel in
//     eine PMREM-Map gebacken und als `scene.environment` gesetzt. Jedes PBR-Material
//     nimmt damit die Himmelsfarbe auf — die billigste Art, Farbe und Materialtextur
//     lesbar zu machen, ohne eine einzige neue Lampe. Der Bake läuft außerhalb der
//     Frame-Schleife (er kostet einen Cubemap-Render).
//     Wichtig: der Dome hängt am Kamera-Follow, für den Bake wird er auf den
//     Ursprung gesetzt und danach zurückgehängt — sonst backt man eine Kugel,
//     deren Mittelpunkt woanders liegt.
//  2. **Fill-Light.** Eine kalte gerichtete Lampe GEGEN die Sonne, ohne Schatten —
//     die klassische Cartoon-Zweilicht-Situation. Sie folgt dem Fahrzeug wie die Sonne.
//  3. **Story-Tint** (Muster aus KFB Rollercoaster v11): die Story-`ink` wird in die
//     Diffuse-Farbe GEMISCHT, nicht darübergelegt — `mix(base, base·tint, amount)`
//     hinter `map_fragment`, also nach der Textur. Die Base-Color bleibt damit
//     erkennbar, das Pet gehört aber sichtbar zur Welt. Nur `MeshStandard`/
//     `MeshPhysical` werden angefasst: Augen und Kartenfläche sind `MeshBasic`, die
//     würden vom Tint nur schmutzig.
//
//   const lighting = createPetLighting({ THREE, renderer, scene });
//   lighting.bakeEnvironment(sky.group);      // nach Story-/Sky-Wechsel
//   lighting.register(pet.object3D);          // nach jedem Pet-Mount
//   lighting.setTint(ink, 0.18);  ·  lighting.setEnv(1.0)  ·  lighting.setFill(0.55)
//   lighting.follow(activePos);               // pro Frame
// ============================================================================

export function createPetLighting(opts = {}) {
  const THREE = opts.THREE, renderer = opts.renderer, scene = opts.scene;
  const P = Object.assign({
    env: 1.0,            // envMapIntensity auf den registrierten Objekten
    fill: 0.55,          // Intensität des Gegenlichts
    fillColor: 0xbcd4ff, // kalt, damit die warme Sonne warm bleibt
    tintAmount: 0.18,    // 0 = aus; darüber wird die Base-Color hörbar eingefärbt
    envRes: 256,
  }, opts.params || {});

  // geteilte Uniforms: EIN Zuweisen färbt alles um (Regel 5 aus dem Handover)
  const uTint = { value: new THREE.Color(0xffffff) };
  const uTintAmt = { value: P.tintAmount };

  const fill = new THREE.DirectionalLight(P.fillColor, P.fill);
  fill.position.set(-26, 22, -18);
  fill.castShadow = false;
  scene.add(fill, fill.target);
  const _fillOff = new THREE.Vector3(-26, 22, -18);

  let pmrem = null, envRT = null;
  const roots = new Set();

  function patch(mat) {
    if (!mat || mat.userData.kfbTinted) return;
    if (!(mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial)) return;
    mat.userData.kfbTinted = true;
    mat.envMapIntensity = P.env;
    const prev = mat.onBeforeCompile;
    mat.onBeforeCompile = (shader, r) => {
      if (prev) prev(shader, r);
      shader.uniforms.uKfbTint = uTint;
      shader.uniforms.uKfbTintAmt = uTintAmt;
      shader.fragmentShader = shader.fragmentShader
        .replace('void main() {', 'uniform vec3 uKfbTint;\nuniform float uKfbTintAmt;\nvoid main() {')
        .replace('#include <map_fragment>',
          '#include <map_fragment>\n\tdiffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * uKfbTint, uKfbTintAmt);');
    };
    mat.needsUpdate = true;
  }

  function register(root) {
    if (!root) return;
    roots.add(root);
    root.traverse((n) => {
      if (!n.isMesh || !n.material) return;
      const mats = Array.isArray(n.material) ? n.material : [n.material];
      for (const m of mats) patch(m);
    });
  }

  function bakeEnvironment(skyGroup) {
    if (!skyGroup) return null;
    try {
      if (!pmrem) pmrem = new THREE.PMREMGenerator(renderer);
      const parent = skyGroup.parent;
      const pos = skyGroup.position.clone();
      const tmp = new THREE.Scene();
      tmp.add(skyGroup);
      skyGroup.position.set(0, 0, 0);
      const rt = pmrem.fromScene(tmp, 0.04, 1, 4000);
      skyGroup.position.copy(pos);
      if (parent) parent.add(skyGroup);
      if (envRT) envRT.dispose();
      envRT = rt;
      scene.environment = P.env > 0.001 ? rt.texture : null;
      renderer.setRenderTarget(null);
      return rt.texture;
    } catch (e) {
      console.warn('[pet-lighting] Environment-Bake fehlgeschlagen', e);
      return null;
    }
  }

  return {
    name: 'pet-lighting', register, bakeEnvironment,
    follow(p) { if (!p) return; fill.position.copy(p).add(_fillOff); fill.target.position.copy(p); },
    setTint(hex, amount) {
      if (hex != null) uTint.value.set(hex);
      if (amount != null) { P.tintAmount = amount; }
      uTintAmt.value = P.tintAmount;
    },
    setEnv(v) {
      P.env = v;
      scene.environment = (v > 0.001 && envRT) ? envRT.texture : null;
      for (const root of roots) root.traverse((n) => {
        if (!n.isMesh || !n.material) return;
        const mats = Array.isArray(n.material) ? n.material : [n.material];
        for (const m of mats) if (m.userData.kfbTinted) { m.envMapIntensity = v; m.needsUpdate = true; }
      });
    },
    setFill(v) { P.fill = v; fill.intensity = v; },
    get params() { return P; },
    get tintAmount() { return P.tintAmount; },
    get envActive() { return !!envRT && P.env > 0.001; },
    dispose() {
      if (envRT) envRT.dispose();
      if (pmrem) pmrem.dispose();
      scene.remove(fill, fill.target);
      scene.environment = null;
    },
  };
}
