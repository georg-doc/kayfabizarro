// ============================================================================
// to-phong.js — S9c · EIN Beleuchtungsmodell für die Welt
// ----------------------------------------------------------------------------
// Der Quellenbericht (§6j) hat als Motor des Whack-a-Mole zwei Beleuchtungsmodelle in einer Welt
// gefunden:
//   · Die Welt ist **Phong** — quellentreu (tinyskies `Globe.ts` 519: `MeshPhongMaterial`,
//     `vertexColors: true, shininess: 8, flatShading: true`; `CampsiteScene.ts` 353: Lambert).
//     In der ganzen Quelle gibt es **kein einziges PBR-Material im Weltbild.**
//   · Unsere geladenen GLB (Würfel, Kenney-Props, Landmarken) kommen als **MeshStandardMaterial**.
//
// Beide bekommen dieselben sieben Lichter und antworten völlig verschieden:
// Phong ist nicht energieerhaltend und hat kein IBL; Standard ist beides. Deshalb reparierte jede
// globale Helligkeitskorrektur eine Klasse und brach die andere — und deshalb sahen die Würfel
// zuerst „dunkel wie Gebäude", dann nach dem Aufhellen „neon" aus. Nicht die Werte waren falsch,
// sondern die Frage: es gab keine EINE Antwort, weil es zwei Modelle gab.
//
// Dieses Modul macht die Welt einheitlich: es konvertiert geladene Materialien nach Phong und
// übernimmt dabei, was ein Phong tragen kann.
//
// ⚠ **Was NICHT konvertiert wird, und warum das eine Entscheidung ist:**
//  · **Das Pet.** Es SOLL plastischer sein als die Welt (Georgs S14-Auftrag). Es bleibt PBR und
//    behält seine eigene `envMap` — aber als benannter Sonderfall im Haushalt, nicht als Zufall.
//  · **MeshBasic** (Kartenblätter, Augen). Unbeleuchtet ist Absicht: eine Karte ist ein Bild.
//  · **Eigene ShaderMaterial** (Steinchen, Ozean-Patch, Atmosphäre). Die wissen, was sie tun.
//
// Und was ein Phong nicht kann, wird BENANNT statt still verworfen: `metalness`, `roughness`,
// `normalMap`, `aoMap` und `envMap` fallen weg. Für die flach schattierten Kenney-Modelle ist das
// kein Verlust (sie haben nichts davon); der Bericht zählt, wie viel wirklich verloren ging.
// ============================================================================

export function createToPhong(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({
    on: true,
    shininess: 8,        // Quellwert (Globe.ts 520) — die Welt hat EINEN Glanz
    flatShading: null,   // null = vom Original übernehmen; true/false erzwingt
  }, opts.params || {});

  let umgebaut = 0, uebersprungen = 0, verlorenNormal = 0, verlorenEnv = 0, verlorenMetal = 0;

  /** Ein Material konvertieren. Gibt das neue zurück, oder das alte wenn nichts zu tun ist. */
  function wandeln(m) {
    if (!m || !P.on) return m;
    if (!(m.isMeshStandardMaterial || m.isMeshPhysicalMaterial)) { uebersprungen++; return m; }
    if (m.userData && m.userData.kfbTinted) { uebersprungen++; return m; }   // das Pet: Sonderfall

    if (m.normalMap) verlorenNormal++;
    if (m.envMap) verlorenEnv++;
    if (m.metalness > 0.05) verlorenMetal++;

    const n = new THREE.MeshPhongMaterial({
      color: m.color ? m.color.clone() : new THREE.Color(0xffffff),
      map: m.map || null,
      // Eigenglut überträgt sich 1:1 — sie ist der Grund, warum die Würfelaugen bei Nacht lesbar
      // sind, und Phong kennt sie genauso.
      emissive: m.emissive ? m.emissive.clone() : new THREE.Color(0x000000),
      emissiveMap: m.emissiveMap || null,
      emissiveIntensity: m.emissiveIntensity != null ? m.emissiveIntensity : 1,
      // `roughness` → `shininess` wäre eine erfundene Umrechnung. Die Welt hat EINEN Glanz, und
      // der steht in der Quelle. Ein Kenney-Klotz braucht keinen eigenen.
      shininess: P.shininess,
      // `specular` dunkel halten: ein Phong mit hellem Specular sieht nass aus, und die Quelle
      // arbeitet mit dem Standardwert bei shininess 8 — also flach und matt.
      specular: new THREE.Color(0x111111),
      flatShading: P.flatShading != null ? P.flatShading : !!m.flatShading,
      vertexColors: !!m.vertexColors,
      transparent: !!m.transparent,
      opacity: m.opacity != null ? m.opacity : 1,
      alphaMap: m.alphaMap || null,
      alphaTest: m.alphaTest || 0,
      side: m.side,
      depthWrite: m.depthWrite,
      fog: m.fog !== false,
      name: m.name || '',
    });
    n.userData = Object.assign({}, m.userData, { kfbFromStandard: true });
    umgebaut++;
    return n;
  }

  /** Einen ganzen Teilbaum umbauen. Ruft der Loader NACH dem Mount. */
  function convert(root) {
    if (!root || !P.on) return 0;
    const vorher = umgebaut;
    const cache = new Map();      // ein Original → ein Ersatz: geteilte Materialien bleiben geteilt
    root.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      if (Array.isArray(o.material)) {
        o.material = o.material.map((m) => {
          if (!cache.has(m)) cache.set(m, wandeln(m));
          return cache.get(m);
        });
      } else {
        if (!cache.has(o.material)) cache.set(o.material, wandeln(o.material));
        o.material = cache.get(o.material);
      }
    });
    // Die ersetzten Originale freigeben — sonst hält der Umbau doppelt Speicher.
    for (const [alt, neu] of cache) if (alt !== neu && alt.dispose) alt.dispose();
    return umgebaut - vorher;
  }

  return {
    name: 'to-phong', params: P, convert, wandeln,
    setEnabled(on) { P.on = !!on; },
    get enabled() { return P.on; },
    report() {
      return { an: P.on, umgebaut, uebersprungen,
               // Was ein Phong nicht kann — benannt, nicht still verworfen.
               verloren: { normalMap: verlorenNormal, envMap: verlorenEnv, metalness: verlorenMetal },
               glanz: P.shininess };
    },
  };
}
