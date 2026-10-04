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
//     ⚠ **S9c (29.8.): dieses Modul BESITZT sie nicht mehr.** Sie heißt `petFill`, steht in
//     `sky-presets` mit Werten je Tageszeit und wird hier nur nachgeführt (`useFill`).
//     Ebenso die Environment: sie liegt als `envMap` auf den registrierten Materialien, nicht
//     als `scene.environment` auf allem. Begründung in §6j des Living-Dokuments.
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

  // ── S9c · **Dieses Modul erzeugt KEIN Licht mehr.** ────────────────────────────────────────
  // Hier stand eine eigene DirectionalLight, direkt in die Szene gelegt. Lokal begründet (Georgs
  // S14-Auftrag: Pet plastischer), global unsichtbar — sie stand in keiner Presettabelle, wurde
  // vom Tageslauf nicht mitgefahren und leuchtete nachts wie mittags. Sie ist der Anfang des
  // Whack-a-Mole aus §6j: eine Summe, die niemand besitzt.
  // Jetzt heißt sie `petFill`, steht in `sky-presets` mit Werten je Tageszeit, wird von
  // `day-night` mitgefahren und von `light-budget` namentlich aufgelistet. Das Modul hier BEKOMMT
  // sie übergeben (`useFill`) und führt sie nur noch nach.
  let fill = null;
  // ⚠ **Georg, 2.9.: "die untere Hälfte scheint im Schatten zu versuppen, während Ohren und
  // Oberkopf gut ausgeleuchtet sind." Nichts wurde geändert — es war immer so, nur ortsabhängig.**
  // Hier stand ein Versatz im WELTRAUM: (−26, 22, −18), addiert auf die Pet-Position. Auf einer
  // Ebene ist das eine feste Lichtrichtung. Auf einer KUGEL ist "oben" aber nicht +Y, sondern
  // `position.normalize()` — und damit stand das Gegenlicht an jedem Ort der Welt in einem anderen
  // Winkel über dem lokalen Horizont: an einem Pol von oben (es verdoppelt die Sonne, die
  // Unterseite bleibt schwarz), am Äquator streifend, andernorts von hinten.
  // **Ein Cartoon-Zweilicht, dessen zweiter Winkel vom Aufenthaltsort abhängt, ist kein Zweilicht,
  // sondern ein Zufall.** Deshalb wird der Versatz jetzt im LOKALEN Rahmen gebaut: so viel über
  // dem Horizont, so viel zur Seite — an jedem Ort derselbe Winkel.
  // Die Höhe ist absichtlich NEGATIV: das Gegenlicht kommt leicht von UNTEN, wie ein Bodenreflex.
  // Es soll die Kinnpartie und die Unterseite anheben, nicht den Oberkopf, der schon Sonne hat.
  const _fillLokal = { hoch: -0.32, seite: 0.86, vor: -0.38, weite: 38 };
  const _u = new THREE.Vector3(), _o = new THREE.Vector3(), _s = new THREE.Vector3();
  const _fw = new THREE.Vector3();

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

  /** Die Environment auf die registrierten Materialien legen — nie auf die Szene. */
  function anwendenEnv() {
    const tex = (envRT && P.env > 0.001) ? envRT.texture : null;
    for (const root of roots) root.traverse((n) => {
      if (!n.isMesh || !n.material) return;
      for (const m of (Array.isArray(n.material) ? n.material : [n.material])) {
        if (!m || !m.userData.kfbTinted) continue;
        m.envMap = tex;
        m.envMapIntensity = P.env;
        m.needsUpdate = true;
      }
    });
  }

  function register(root) {
    if (!root) return;
    roots.add(root);
    root.traverse((n) => {
      if (!n.isMesh || !n.material) return;
      const mats = Array.isArray(n.material) ? n.material : [n.material];
      for (const m of mats) patch(m);
    });
    anwendenEnv();     // ein spät gemountetes Pet bekommt die schon gebackene Map nachgereicht
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
      // ── S9c · **NICHT `scene.environment`.** ────────────────────────────────────────────────
      // Hier stand `scene.environment = rt.texture`, und das war der zweite unsichtbare Beitrag
      // zum Lichthaushalt: eine Szenen-Environment wirkt auf JEDES PBR-Material — also auf die
      // Würfel, die Kenney-Props und das Pet, aber NICHT auf die Phong-Welt, die `scene.environment`
      // vollständig ignoriert. Dieselben sieben Lichter trafen damit zwei Materialklassen mit
      // völlig verschiedener Antwort, und die PBR-Hälfte bekam eine achte Quelle dazu.
      // **Das ist der Motor des Whack-a-Mole:** jede globale Korrektur reparierte eine Hälfte und
      // brach die andere — deshalb musste ich die Würfel erst „neon" aufhellen und dann wieder
      // abdunkeln (§6j).
      // Jetzt liegt die Map als `envMap` auf den AUSDRÜCKLICH registrierten Materialien (`register`
      // ruft nur der Pet-Mount). Wer sie will, sagt es; wer schweigt, bekommt sie nicht.
      anwendenEnv();
      renderer.setRenderTarget(null);
      return rt.texture;
    } catch (e) {
      console.warn('[pet-lighting] Environment-Bake fehlgeschlagen', e);
      return null;
    }
  }

  return {
    name: 'pet-lighting', register, bakeEnvironment,
    /** S9c · Die Lampe kommt vom Rig — dieses Modul besitzt sie nicht, es führt sie nach. */
    useFill(light) { fill = light || null; },
    /** Führt das Gegenlicht nach — im LOKALEN Rahmen des Aufenthaltsorts, nicht im Weltraum.
     *  `vor` ist optional die Fahrtrichtung; ohne sie bleibt eine beliebige, aber stabile Seite. */
    follow(p, vorne) {
      if (!p || !fill) return;
      _u.copy(p).normalize();                       // lokales Oben
      // Eine Seitenrichtung, die auf der Tangentialebene liegt: aus der Fahrtrichtung, wenn sie
      // da ist, sonst aus einer Weltachse — und wenn die parallel zu Oben steht, aus der nächsten.
      _fw.copy(vorne || _u).projectOnPlane(_u);
      if (_fw.lengthSq() < 1e-8) {
        _fw.set(0, 1, 0).projectOnPlane(_u);
        if (_fw.lengthSq() < 1e-8) _fw.set(1, 0, 0).projectOnPlane(_u);
      }
      _fw.normalize();
      _s.crossVectors(_u, _fw).normalize();         // links/rechts der Fahrtrichtung
      _o.copy(_u).multiplyScalar(_fillLokal.hoch)
        .addScaledVector(_s, _fillLokal.seite)
        .addScaledVector(_fw, _fillLokal.vor)
        .normalize().multiplyScalar(_fillLokal.weite);
      fill.position.copy(p).add(_o);
      if (fill.target) fill.target.position.copy(p);
    },
    /** Der lokale Rahmen als Stellschrauben — damit das Panel sie drehen kann, ohne dieses
     *  Modul zu kennen. `hoch` unter 0 heißt "von unten", über 0 "von oben". */
    get fillLokal() { return _fillLokal; },
    /** **Das Messgerät zur Frage.** Es sagt, unter welchem Winkel das Gegenlicht ÜBER DEM
     *  LOKALEN HORIZONT steht — die Zahl, die vorher an jedem Ort anders war und die niemand
     *  ablesen konnte. Konstante Zahl beim Fliegen = lokaler Rahmen hält. */
    fillTor(p) {
      if (!fill) return { ok: false, text: '— no fill light' };
      if (!p) return { ok: false, text: '— no position' };
      // ⚠ **Und hier hätte dasselbe Messgerät gelogen, das gegen das Raten gebaut wurde**
      // (Abnahme 2.9.). `if (!p)` fängt kein `Vector3(0,0,0)` — ein Nullvektor ist wahr. Genau der
      // steht direkt nach dem Laden in `carrierState.position`, bevor die Schleife den Carrier
      // gesetzt hat: `normalize()` gibt den Nullvektor zurück, das Skalarprodukt ist 0, `asin(0)`
      // ist 0°, und weil 0 nicht kleiner als 0 ist, meldete die Zeile „⚠ 0,0° above the local
      // horizon — doubles the sun". Sie behauptete den Fehler, den sie finden soll, ohne etwas
      // gemessen zu haben — dritter Fall dieser Art an einem Tag (registry unreachable, der
      // Regler mit 24 außerhalb seines Bereichs). **Kein Messwert ist eine Antwort; eine erfundene
      // Null ist keine.** Auf der Kugel gibt es keinen gültigen Ort im Mittelpunkt.
      if (p.lengthSq() < 1e-8) return { ok: false, text: '— carrier not placed yet' };
      _u.copy(p).normalize();
      const d = _o.copy(fill.position).sub(p).normalize();
      const roh = Math.asin(Math.max(-1, Math.min(1, d.dot(_u)))) * 180 / Math.PI;
      if (!Number.isFinite(roh)) return { ok: false, text: '— angle not measurable' };
      const grad = roh;
      const vonUnten = grad < 0;
      return { ok: true, grad: +grad.toFixed(1),
        text: (vonUnten ? '✓' : '⚠') + ' ' + Math.abs(grad).toFixed(1) + '° '
          + (vonUnten ? 'BELOW' : 'above') + ' the local horizon'
          + '  ·  intensity ' + fill.intensity.toFixed(2)
          + '  ·  ' + (vonUnten ? 'lifts the underside' : 'doubles the sun — underside stays dark') };
    },
    setTint(hex, amount) {
      if (hex != null) uTint.value.set(hex);
      if (amount != null) { P.tintAmount = amount; }
      uTintAmt.value = P.tintAmount;
    },
    setEnv(v) { P.env = v; anwendenEnv(); },
    setFill(v) { P.fill = v; if (fill) fill.intensity = v; },
    get params() { return P; },
    get tintAmount() { return P.tintAmount; },
    get envActive() { return !!envRT && P.env > 0.001; },
    dispose() {
      if (envRT) envRT.dispose();
      if (pmrem) pmrem.dispose();
      // Die Lampe gehört dem Rig — dieses Modul räumt sie NICHT weg. Wer nicht besitzt, entsorgt nicht.
    },
  };
}
