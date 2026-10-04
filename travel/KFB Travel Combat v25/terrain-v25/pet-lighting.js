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
    // 4. **Rim.** Ein additiver Fresnel-Saum auf den registrierten Akteuren (Pet, Mech, Gegner).
    //    Grund: die Welt ist hell und gemustert — ein Mech ohne Silhouetten-Kante verschwindet
    //    darin, egal wie kräftig seine Grundfarbe ist (Georg 4.9.: „avatar/mech und enemies sind
    //    kaum zu erkennen"). Der Saum sitzt VOR dem Tonemapping, also nimmt ACES ihn als Licht
    //    statt als Weiß — sonst hätte man den Fehler nur an eine andere Stelle verschoben.
    // v24 · 5.9. · **Der Rim ist AUS.** Er war meine Idee gegen „Mech und Gegner sind kaum zu
    // erkennen" (4.9.) — und hat sich als die falsche Antwort erwiesen: Georg, 5.9.: „enemies haben
    // durchgehend einen hellen schattensaum, sind falsch beleuchtet" und „mech sieht auch leicht
    // farb-verschoben aus". Genau das TUT ein additiver Fresnel-Saum — er sitzt auf JEDER Kante,
    // auch dort, wo gar kein Licht ist, und ein cremefarbener Zuschlag verschiebt den Buntton.
    // Das eigentliche Problem war das Lichtbudget (light-budget.js) und die Papier-Palette; beides
    // ist behoben, die Akteure lesen sich ohne Trick. Der Saum bleibt als REGLER stehen (die
    // Mechanik ist richtig, nur nicht als Standard) — auf 0 ist er nicht im Bild.
    rim: 0,
    rimColor: 0xfff1d0,
    rimPow: 2.6,
    envRes: 256,
  }, opts.params || {});

  // geteilte Uniforms: EIN Zuweisen färbt alles um (Regel 5 aus dem Handover)
  const uTint = { value: new THREE.Color(0xffffff) };
  const uTintAmt = { value: P.tintAmount };
  const uRim = { value: P.rim };
  const uRimCol = { value: new THREE.Color(P.rimColor) };
  const uRimPow = { value: P.rimPow };

  const fill = new THREE.DirectionalLight(P.fillColor, P.fill);
  fill.name = 'petFill';   // benannt, damit light-budget.js sie AUFLISTEN kann (globe-v13 S9b)
  fill.position.set(-26, 22, -18);
  fill.castShadow = false;
  scene.add(fill, fill.target);
  const _fillOff = new THREE.Vector3(-26, 22, -18);

  let pmrem = null, envRT = null;
  const roots = new Set();

  function patch(mat, opts) {
    if (!mat || mat.userData.kfbTinted) return;
    if (!(mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial)) return;
    mat.userData.kfbTinted = true;
    mat.envMapIntensity = P.env;
    // v24 · 5.9. · Der Story-Tint ist für das PET gedacht: es soll zur Welt gehören. Ein FAHRZEUG
    // hat dagegen eine Signaturfarbe — der pinke Mech ist pink, in jeder Welt. Deshalb kann eine
    // Wurzel den Tint abbestellen; sie bekommt eine EIGENE Uniform mit 0 statt der geteilten.
    // (Die geteilte Uniform ist der Grund, warum es ein Material-Flag braucht und keinen Aufruf:
    // ein `setTint(0)` würde alles entfärben.)
    const amt = (opts && opts.tint === false) ? { value: 0 } : uTintAmt;
    const prev = mat.onBeforeCompile;
    mat.onBeforeCompile = (shader, r) => {
      if (prev) prev(shader, r);
      shader.uniforms.uKfbTint = uTint;
      shader.uniforms.uKfbTintAmt = amt;
      shader.uniforms.uKfbRim = uRim;
      shader.uniforms.uKfbRimCol = uRimCol;
      shader.uniforms.uKfbRimPow = uRimPow;
      const rimAnker = shader.fragmentShader.indexOf('#include <tonemapping_fragment>') >= 0
        ? '#include <tonemapping_fragment>' : '';
      shader.fragmentShader = shader.fragmentShader
        .replace('void main() {', 'uniform vec3 uKfbTint;\nuniform float uKfbTintAmt;\nuniform vec3 uKfbRimCol;\nuniform float uKfbRim;\nuniform float uKfbRimPow;\nvoid main() {')
        .replace('#include <map_fragment>',
          '#include <map_fragment>\n\tdiffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * uKfbTint, uKfbTintAmt);');
      if (rimAnker) {
        shader.fragmentShader = shader.fragmentShader.replace(rimAnker, [
          '{ float f = 1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0);',
          '  gl_FragColor.rgb += uKfbRimCol * (uKfbRim * pow(f, uKfbRimPow)); }',
          rimAnker,
        ].join('\n'));
      }
    };
    mat.needsUpdate = true;
  }

  function register(root, opts) {
    if (!root) return;
    roots.add(root);
    root.traverse((n) => {
      if (!n.isMesh || !n.material) return;
      const mats = Array.isArray(n.material) ? n.material : [n.material];
      for (const m of mats) patch(m, opts);
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
    setRim(amount, hex) {
      if (amount != null) { P.rim = amount; uRim.value = amount; }
      if (hex != null) { P.rimColor = hex; uRimCol.value.set(hex); }
    },
    get params() { return P; },
    get tintAmount() { return P.tintAmount; },
    /** v25.2f · Die Tint-Farbe selbst. Wer die Grundfarbe eines Akteurs ANDERSWO zeigen will
     *  (die Slot-Würfel zeigen die des Avatars), muß dieselbe Mischung rechnen wie der Shader:
     *  mix(base, base × tint, amount). Ohne diesen Zugang bliebe nur Raten — und dann steht im
     *  HUD ein anderes Gelb als auf dem Pet (Georgs Befund 06.09.). */
    get tint() { return uTint.value; },
    get envActive() { return !!envRT && P.env > 0.001; },
    dispose() {
      if (envRT) envRT.dispose();
      if (pmrem) pmrem.dispose();
      scene.remove(fill, fill.target);
      scene.environment = null;
    },
  };
}
