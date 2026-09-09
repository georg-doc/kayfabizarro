// ============================================================================
// light-budget.js — KFB Travel v24 · EIN Ort, der sagt, wie hell die Welt ist
// ----------------------------------------------------------------------------
// Übernommen aus globe-v13 (S9a), weil hier derselbe Fehler noch einmal passiert ist:
// Georg, 4.9. — „assets sind immer noch überstrahlt · mech und enemies sind überstrahlt ·
// auch der sky shader scheint sehr hell und verwaschen". Drei Meldungen, drei Knöpfe, und in
// der Runde davor habe ich an EINEM davon gedreht. Das ist Whack-a-Mole.
//
// Der Grund ist derselbe wie damals: die Helligkeit dieser Szene ist eine **Summe aus vier
// Beiträgen, und keiner besitzt sie** —
//   1. die Szenen-Lampen (travel-stage: `sun` + `hemi`) → Props, Mech, Gegner, alles PBR
//   2. der TERRAIN-Shader mit seinen EIGENEN Zahlen (`uAmbient`, `uLightInt`) → die Karten
//   3. der Prop-Tint (prop-scatter, multiplikativ auf die fertige Prop-Farbe)
//   4. der Rim (pet-lighting) und der Sky-Shader (`uExposure`) obendrauf
// Die Wege 1 und 2 kennen einander NICHT. Deshalb kann man Punkt 1 richtig einstellen und
// die Karten bleiben weiß.
//
// **Dieses Modul rechnet, es ändert nichts.** Ein Messgerät, das eingreift, ist keins.
//
// Die zwei Kennzahlen:
//  · **PBR-Pfad** (Lampen): eine der Sonne zugewandte Lambert-Fläche kommt auf
//    `(dirMax + hemi + amb) / π · Albedo`. three ≥ r155 rechnet physikalisch, der BRDF teilt
//    durch π. Danach läuft ACES-Tonemapping — das clippt nicht hart, aber alles über ~1,0
//    **entsättigt**, und genau das ist „überstrahlt" (globe-v13: eine gesättigte Farbe klippt in
//    ihren Hue, eine ungesättigte in Weiß).
//  · **Terrain-Pfad**: der Shader schreibt DISPLAY-Raum, ohne Tonemapping — hier clippt es hart.
//    `uAmbient + uLightInt` mal Albedo muss unter 1,0 bleiben. Die Karten sind Papier
//    (Albedo ≈ 0,92 in den weißen Feldern), das ist der strengste Fall der ganzen Welt und
//    deshalb die Zahl, gegen die geprüft wird.
//
// Damit ist „überstrahlt" keine Meinung mehr, sondern eine Zahl mit einem Namen.
// ============================================================================

/** Albedo des hellsten Materials, das wirklich im Bild ist. Kein gewählter Wert: die Kartenfelder
 *  sind gescanntes Papier, und weißes Papier liegt bei 0,88…0,95. Wer gegen einen weicheren Wert
 *  prüft, prüft gegen ein Bild, das es nicht gibt. */
export const PAPIER_ALBEDO = 0.92;

/** Kenney-Props: die Grundfarben der Bäume liegen zwischen 0,55 und 0,78 linear (gemessen an den
 *  Modellfarben). Der obere Wert ist der Prüffall. */
export const PROP_ALBEDO = 0.78;

/** ── Die Abnahme für eine ABGETASTETE Palette ──────────────────────────────────────
 *  Georg, 5.9.: „nach einer weile kommt wieder die überstrahlung… ist das vielleicht ein shader
 *  oder story-mode, der zugeschaltet wird?" — fast. Es ist eine PALETTE, die zugeschaltet wird:
 *  `card-collage.samplePalette()` nimmt sechs dominante Farben aus den Kartenbildern und macht
 *  daraus drei Stops; fünf Sekunden nach dem Start ersetzen die die Weltpalette. Und die
 *  Kartenbilder sind zu großen Teilen PAPIER: der helle Stop kommt bei 0,9 Luminanz und fast ohne
 *  Sättigung an. Der Terrain-Shader multipliziert ihn dann mit (uAmbient + uLightInt) und der
 *  Würfelstreuung (uBrightMin + uBrightRange) — und schreibt Display-Raum ohne Tonemapping.
 *  Ergebnis: alle drei Kanäle am Anschlag, Buntton gelöscht. Genau das Bild.
 *
 *  Das Modul, das die Palette abtastet, kann diese Frage nicht beantworten: es kennt das Licht
 *  nicht. Deshalb steht die Abnahme HIER, bei dem, der die Summe besitzt.
 *
 *  Ein Stop besteht, wenn EINE der beiden Bedingungen gilt (globe-v13, S9a):
 *   · **Sättigungserhalt** — er hat überhaupt Buntheit (≥ 0,18) und behält nach dem Clip noch
 *     `SAT_KEEP` davon. Eine gesättigte Farbe klippt in ihren Hue und wird nur leuchtender; das
 *     ist erlaubt, und helle Welten bleiben damit möglich.
 *   · **Helligkeitsband** — er ist ungesättigt, kann also keine Sättigung verlieren; für den ist
 *     Helligkeit das richtige Maß, und über 0,55 Display-Luminanz liest ein unbunter Ton als
 *     Papier, nicht als Landschaft.
 *  Papier (Sättigung ≈ 0,08, Luminanz ≈ 0,91) fällt durch beide — und genau das soll es.
 */
export const SAT_KEEP = 0.55;
export const UNBUNT_MAX_LUM = 0.55;
export const SAT_MIN = 0.18;

function sat3(c) {
  const mx = Math.max(c[0], c[1], c[2]), mn = Math.min(c[0], c[1], c[2]);
  return mx < 1e-6 ? 0 : (mx - mn) / mx;
}

/** @param stops drei RGB-Tripel 0…1 (Display-Raum, so wie `card-collage` sie abtastet)
 *  @param faktor der schlimmste Fall des Terrain-Shaders: (uAmbient + uLightInt) × (uBrightMin + uBrightRange) */
export function palettePruefung(stops, faktor) {
  if (!stops || !stops.length) return { ok: false, grund: 'keine Stops', stops: [] };
  const werte = stops.map((c) => {
    const s = sat3(c), lum = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
    const nachClip = sat3(c.map((v) => Math.min(1, v * faktor)));
    const behalten = s < 1e-6 ? 0 : nachClip / s;
    const ok = (s >= SAT_MIN && behalten >= SAT_KEEP) || lum <= UNBUNT_MAX_LUM;
    return { lum: +lum.toFixed(3), sat: +s.toFixed(3), behalten: +behalten.toFixed(3), ok };
  });
  const durchgefallen = werte.filter((w) => !w.ok);
  return {
    ok: durchgefallen.length === 0, faktor: +faktor.toFixed(3), stops: werte,
    grund: durchgefallen.length
      ? durchgefallen.length + ' von ' + werte.length + ' Stops überstrahlen (hellster: Luminanz '
        + Math.max.apply(null, durchgefallen.map((w) => w.lum)) + ', Sättigung '
        + durchgefallen[0].sat + ', davon nach dem Clip übrig ' + durchgefallen[0].behalten + ')'
      : 'alle ' + werte.length + ' Stops halten Sättigung oder Band',
  };
}

export function createLightBudget(o) {
  const scene = o.scene, renderer = o.renderer, terrain = o.terrain;
  const sky = o.sky, lighting = o.lighting, propTint = o.propTint || (() => 1);

  /** Alle Lichter der Szene, NAMENTLICH — nicht gezählt. Eine Zahl sagt nicht, WELCHES Licht
   *  dazugekommen ist, und genau diese Frage stellt man, wenn die Summe nicht stimmt. */
  function lampen() {
    const out = [];
    scene.traverse((n) => {
      if (!n.isLight) return;
      out.push({ name: n.name || '(unbenannt)', intensity: +n.intensity.toFixed(3),
        typ: n.isDirectionalLight ? 'dir' : n.isHemisphereLight ? 'hemi' : n.isAmbientLight ? 'amb' : n.type });
    });
    return out;
  }

  /** Der PBR-Faktor: stärkste GERICHTETE Lampe (nur eine kann eine Fläche voll treffen) plus alle
   *  richtungsunabhängigen. Schlimmster Fall, nicht Durchschnitt. */
  function pbrFaktor() {
    let dirMax = 0, gleich = 0;
    scene.traverse((n) => {
      if (!n.isLight) return;
      if (n.isDirectionalLight || n.isPointLight || n.isSpotLight) dirMax = Math.max(dirMax, n.intensity);
      else gleich += n.intensity;
    });
    return (dirMax + gleich) / Math.PI;
  }

  function terrainFaktor() {
    const u = terrain && terrain.lichtWerte ? terrain.lichtWerte() : null;
    return u ? u.ambient + u.lightInt : NaN;
  }

  return {
    name: 'light-budget', lampen,
    messen() {
      const pbr = pbrFaktor(), ter = terrainFaktor(), tint = propTint();
      const exp = renderer.toneMappingExposure;
      return {
        pbr: +pbr.toFixed(3),
        terrain: +ter.toFixed(3),
        karte: +(ter * PAPIER_ALBEDO).toFixed(3),
        prop: +(pbr * PROP_ALBEDO * exp * tint).toFixed(3),
        akteur: +(pbr * exp + (lighting ? lighting.params.rim : 0)).toFixed(3),
        skyExposure: sky && sky.exposure != null ? +sky.exposure.toFixed(2) : null,
        exposure: +exp.toFixed(2), propTint: +tint.toFixed(2),
      };
    },
    /** Das Tor. Vier Zahlen, vier Namen — jede sagt, WELCHER Pfad zu hell ist. */
    tor() {
      const m = this.messen(); const z = []; let ok = 0, von = 0;
      const pruef = (b, gut, schlecht) => { von++; if (b) { ok++; z.push('\u2713 ' + gut); } else z.push('\u2717 ' + schlecht); };
      pruef(m.karte < 1.0, 'Karten-Papier ' + m.karte + ' < 1,0 \u2014 die Kartenfelder clippen nicht (Terrain schreibt Display-Raum, hier gibt es kein Tonemapping als Netz)',
        'Karten-Papier ' + m.karte + ' \u2265 1,0 \u2014 wei\u00dfe Kartenfelder brennen aus (uAmbient + uLightInt = ' + m.terrain + ')');
      pruef(m.prop < 1.0, 'Props ' + m.prop + ' < 1,0 \u2014 die Kenney-Farbe bleibt ges\u00e4ttigt',
        'Props ' + m.prop + ' \u2265 1,0 \u2014 \u00fcberstrahlt: ACES entfernt hier S\u00e4ttigung, nicht Helligkeit (Tint ' + m.propTint + '\u00d7)');
      pruef(m.akteur < 1.05, 'Akteure ' + m.akteur + ' < 1,05 \u2014 Mech und Gegner behalten ihre Grundfarbe',
        'Akteure ' + m.akteur + ' \u2265 1,05 \u2014 Mech/Gegner \u00fcberstrahlt (Rim ' + (lighting ? lighting.params.rim : 0) + ' addiert)');
      pruef(m.pbr < 1.0, 'Lampen-Budget ' + m.pbr + ' < 1,0 (' + lampen().length + ' Lampen: ' + lampen().map((l) => l.name + ' ' + l.intensity).join(', ') + ')',
        'Lampen-Budget ' + m.pbr + ' \u2265 1,0 \u2014 eine wei\u00dfe Fl\u00e4che im Sonnenlicht ist schon am Anschlag');
      return { ok: ok === von, bestanden: ok, von, zeilen: z, mass: m,
        text: 'light-budget: ' + ok + '/' + von + ' bestanden' };
    },
    zeile() {
      const m = this.messen();
      return 'light-budget \u00b7 Lampen ' + m.pbr + ' \u00b7 Karte ' + m.karte + ' \u00b7 Props ' + m.prop
        + ' \u00b7 Akteure ' + m.akteur + ' \u00b7 Sky ' + m.skyExposure + ' \u00b7 Exposure ' + m.exposure;
    },
  };
}
