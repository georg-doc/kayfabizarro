// ============================================================================
// avatar-lamp.js — v9 · Die Nahfeld-Lampe des Fahrzeugs (1:1 aus tinyskies)
// ----------------------------------------------------------------------------
// Georg, 1.9.: *„bei tiny skies gibt es auch eine Art Lichtkegel mit Kerzenlicht-Anmutung, der bei
// Nacht/Dunkelheit den Nahbereich der Flug-Avatare beleuchtet…?"* — ja, und es ist **kein Kegel**.
// Gefunden in `Game.ts`, vier Stellen, zusammen die ganze Mechanik:
//
//     1517: this.playerLight = new PointLight(0xeec4a8, 0, 6.5, 1.25);
//     3146: position aus der Weltmatrix des Spielers, dann + 0,15 entlang `up`
//     6288: this.playerLight.intensity = nightW * PLAYER_LIGHT_NIGHT_INTENSITY;   // 0,38
//
// Eine **Punktlampe** mit warmem Ton (0xeec4a8), Reichweite 6,5 und Abfall 1,25. Der Eindruck
// eines Kegels entsteht aus dem Abfall über gekrümmtem Boden, nicht aus einer Blende — wer hier
// einen SpotLight einbaut, baut ein anderes Bild und nennt es dasselbe.
// Zwei Zahlen sind bemerkenswert: die Reichweite **6,5 bei Globusradius 5** ist gewaltig (die Lampe
// leuchtet über den halben Horizont), und die Höhe **0,15** ist die Figurhöhe — sie sitzt also
// ungefähr da, wo eine Laterne am Fahrzeug hängen würde.
//
// **Eigentümer:** diese Datei. Der Wirt sagt nur „hier bin ich" (`folgen`) und „so dunkel ist es"
// (`setNacht`) — dieselbe Bauform wie beim Sonnenschatten, und dieselbe Begründung: die
// Nachtzahl hat EINEN Besitzer (`zyklus.nachtGewicht`), nicht drei Nachrechnungen.
//
// **Ausblick, ausdrücklich NICHT gebaut (Georgs zweite Idee):** derselbe Radius ist der natürliche
// Träger für „Fog of War" — was die Lampe erreicht, ist bekannt. Das braucht aber einen zweiten
// Mechanismus (eine Sichtbarkeitsmaske über Land, Props und Karten), und der gehört in die
// Weltbau-Schicht, nicht in eine Lampe. Notiert im Panel, damit es nicht als „gelöst" gilt.
// ============================================================================

export function createAvatarLamp({ THREE, scene, params = {} }) {
  // Quellenzahlen. `nachtStaerke` ist `PLAYER_LIGHT_NIGHT_INTENSITY` (Game.ts:173).
  const P = Object.assign({ on: true, farbe: 0xeec4a8, weite: 6.5, abfall: 1.25,
                            nachtStaerke: 0.38, hoehe: 0.15 }, params);
  const licht = new THREE.PointLight(P.farbe, 0, P.weite, P.abfall);
  licht.name = 'avatar-lamp';
  licht.castShadow = false;          // Punktlicht-Schatten sind in three unzuverlässig (Quelle sagt es selbst)
  if (scene) scene.add(licht);
  const _up = new THREE.Vector3();
  let nacht = 0, gesetzt = 0;

  return {
    name: 'avatar-lamp', params: P, licht,
    /** Je Bild: Ort des Fahrzeugs plus 0,15 entlang der Senkrechten (Quelle: Game.ts 3146–3149). */
    folgen(pos) {
      if (!pos) return;
      licht.position.copy(pos);
      _up.copy(pos).normalize();
      licht.position.addScaledVector(_up, P.hoehe);
    },
    /** Die EINE Nachtzahl kommt von außen — hier wird sie nur in Helligkeit übersetzt. */
    setNacht(w) {
      nacht = Math.max(0, Math.min(1, w || 0));
      gesetzt = P.on ? nacht * P.nachtStaerke : 0;
      licht.intensity = gesetzt;
    },
    setOn(on) { P.on = !!on; this.setNacht(nacht); return P.on; },
    setStaerke(v) { P.nachtStaerke = Math.max(0, Math.min(2, v)); this.setNacht(nacht); return P.nachtStaerke; },
    setWeite(v) { P.weite = Math.max(0.5, Math.min(20, v)); licht.distance = P.weite; return P.weite; },
    /** ⚠ Liest die LAUFENDE Lampe, nicht die Tabelle oben. */
    tor() {
      const quelle = { farbe: 0xeec4a8, weite: 6.5, abfall: 1.25, staerke: 0.38, hoehe: 0.15 };
      const treu = licht.color.getHex() === quelle.farbe && licht.distance === quelle.weite
                && licht.decay === quelle.abfall && P.nachtStaerke === quelle.staerke
                && P.hoehe === quelle.hoehe;
      const ok = P.on && (nacht < 0.02 || licht.intensity > 0);
      return { ok, treu, nacht: +nacht.toFixed(2), helligkeit: +licht.intensity.toFixed(3),
        text: (!P.on ? '— off'
          : (ok ? '✓' : '✗') + ' point light (NOT a cone) · night ' + nacht.toFixed(2)
            + ' × ' + P.nachtStaerke.toFixed(2) + ' = intensity ' + licht.intensity.toFixed(3)
            + ' · warm #' + licht.color.getHexString() + ' · range ' + licht.distance.toFixed(1)
            + ' u at globe radius 5, decay ' + licht.decay.toFixed(2)
            + ' · rides ' + P.hoehe.toFixed(2) + ' u above the vehicle'
            + (treu ? ' · all five numbers = source' : ' · ⚠ off source')) };
    },
    dispose() { if (scene) scene.remove(licht); licht.dispose && licht.dispose(); },
  };
}
