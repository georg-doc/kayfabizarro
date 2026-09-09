// ============================================================================
// light-budget.js — S9a · EIN Ort, der sagt, wie hell die Welt ist
// ----------------------------------------------------------------------------
// Georg, 29.8.: „schluss mit whack-a-mole!" — und der Quellenbericht (§6j) hat gezeigt, warum es
// überhaupt entstehen konnte: die Helligkeit der Szene ist eine **Summe aus fünf Beiträgen, und
// keiner besitzt sie**:
//   1. sieben Lichter aus dem Preset (quellentreu, tinyskies `SkyPresets.ts`)
//   2. ein achtes Licht, von mir dazugelegt (`pet-lighting`) — in keiner Tabelle
//   3. `scene.environment` (PMREM-Bake), von mir dazugelegt — wirkt NUR auf PBR-Materialien
//   4. Eigenglut je Objekt (Würfel, Augen)
//   5. die Albedo der Vertexfarben — und die passte zu keinem der vier
// Wer eine Summe nicht ablesen kann, kann nur an Summanden raten. Genau das habe ich siebenmal
// getan. Also zuerst dieses Modul, dann Änderungen.
//
// **Es rechnet, es ändert nichts.** Ein Messgerät, das eingreift, ist keins.
//
// Die Kennzahl, um die es geht: `sun / π · Albedo` — bei physikalisch korrektem Licht (three ≥ r155,
// und sowohl tinyskies mit 0.172 als auch wir mit 0.160 liegen darüber) teilt der Lambert-BRDF
// durch π. Eine der Sonne zugewandte Fläche kommt also auf `(sun + hemi + ambient) / π · Albedo`,
// und alles über 1,0 ist weg — der Renderer hat kein Tone Mapping (bewusst, wie die Quelle).
// Damit ist „überstrahlt" keine Meinung mehr, sondern eine Zahl.
// ============================================================================

/** ── Die Abnahme: SÄTTIGUNGSERHALT, nicht Helligkeit ────────────────────────────────────────
 *  Georgs zwei Screenshots (29.8.) haben die alte Grenze widerlegt: tinyskies' Gras hat lineare
 *  Luminanz **0,463** — deutlich über dem Band-Maximum 0,33 — und überstrahlt trotzdem nicht.
 *  Der Grund ist Farbenlehre, nicht Beleuchtung:
 *
 *    **Eine gesättigte Farbe klippt in ihren HUE. Eine ungesättigte klippt in WEISS.**
 *
 *  Bei sattem Grün klippt nur der G-Kanal; R und B bleiben unten, das Verhältnis bleibt, das Grün
 *  wird nur leuchtender. Bei unserem alten Sand klippten ALLE DREI Kanäle auf 1,1,1 — und damit war
 *  der Buntton gelöscht. „Überstrahlt" war also nie ein Helligkeits-, sondern ein
 *  **Entsättigungsproblem**.
 *
 *  Die alte Luminanzgrenze war deshalb doppelt falsch: sie hat das Problem gelöst und dabei
 *  **den halben Gestaltungsraum mitverboten** — helle Welten wären unmöglich geworden, obwohl das
 *  Vorbild genau davon lebt (Fehlerklasse 47: wer eine Grenze zieht, verbietet auch).
 *
 *  `SAT_KEEP` ist die neue Grenze: nach dem Clip müssen mindestens 55 % der ursprünglichen
 *  Sättigung übrig sein. Sie erlaubt hell UND dunkel und verbietet weiter genau das, was kaputt
 *  war: helle entsättigte Töne. Das Luminanzband bleibt als **Rückfall für ungesättigte Töne** —
 *  wer wenig Sättigung hat, kann keine verlieren, und für den ist Helligkeit das richtige Maß.
 */
export const SAT_KEEP = 0.55;

/** Sättigung eines linearen Tripels (relativ zum Maximalkanal). */
function sat(c) {
  const mx = Math.max(c[0], c[1], c[2]), mn = Math.min(c[0], c[1], c[2]);
  return mx < 1e-6 ? 0 : (mx - mn) / mx;
}

/** Das kalibrierte Albedo-Band in LINEARER Luminanz — der RÜCKFALL für ungesättigte Töne.
 *  Hergeleitet, nicht gewählt: der Tag-Rig gibt einer sonnenzugewandten Fläche
 *  `(5,0 + 1,75 + 1,25) / π · Albedo`; für `< 1,0` muss Albedo unter **0,393** liegen. Mit
 *  Sicherheitsabstand (die Füller können in ungünstiger Ausrichtung dazukommen) ist die Obergrenze
 *  **0,33**. Die Untergrenze ist gestalterisch: unter 0,04 ist ein Band nicht mehr von Schatten zu
 *  unterscheiden.
 *  sRGB-Entsprechung nur zur Orientierung: 0,04…0,33 linear ≈ 0,22…0,61 sRGB. */
export const BAND_LIN = [0.04, 0.33];

/** sRGB-Luminanz (Rec.709) eines Hex-Werts oder eines linearen Tripels.
 *  ⚠ NUR für Hex-Angaben aus der Palette. Vertexfarben liegen LINEAR im Puffer — dafür ist
 *  `albedo()` zuständig, und die beiden dürfen nie verglichen werden (siehe `zeile`). */
import { getSkyPreset } from './sky-presets.js';

/** ── Der Lichtfaktor der ABNAHME ist eine KONSTANTE ────────────────────────────────────────────
 *  ⚠ **Das Tor rechnete mit dem LIVE-Licht — und das wechselt alle 195 s.** Gemessen in einer
 *  Nachtwelt: sun 1,25 · hemi 0,625 · amb 0,375 → m = **0,716**. Damit klippt nichts
 *  (alter Sand 0,68 × 0,716 = 0,487), und der Selbsttest meldete für DREI von vier Fällen PASS —
 *  darunter genau die Töne, die das Tor ablehnen soll.
 *  Alle Palettenrechnungen (§6k, S9d, E-16) verwenden dagegen den TAG-Faktor **2,546**.
 *
 *  Das ist Fehlerklasse 46 zum vierten Mal: *bevor eine Zahl ein Urteil bekommt, muss geklärt sein,
 *  ob sie überhaupt eine Konstante ist.* Eine Palette ist eine Konstante, das Licht nicht — also
 *  muss die Abnahme den **schlimmsten Fall** nehmen, und der ist der Tag.
 *  Wer nachts eine Palette abnimmt, bekommt sonst grünes Licht für etwas, das mittags ausbrennt.
 *
 *  Der Live-Faktor bleibt als INFORMATION (`@now` in der Panel-Zeile) — er sagt, was gerade
 *  passiert, nicht ob die Palette taugt. */
export function gateFaktor() {
  const p = getSkyPreset('day');
  // Schlimmster Fall: die stärkste gerichtete Lampe plus die richtungsunabhängigen.
  const dirMax = Math.max(p.sunIntensity, p.sun2Intensity, p.fillIntensity,
                          p.fill2Intensity, p.backIntensity);
  return (dirMax + p.hemiIntensity + p.ambientIntensity) / Math.PI;
}

export function lum(c) {
  if (Array.isArray(c)) return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  const r = ((c >> 16) & 255) / 255, g = ((c >> 8) & 255) / 255, b = (c & 255) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function createLightBudget(opts = {}) {
  const THREE = opts.THREE, scene = opts.scene, renderer = opts.renderer;

  /** Alle Lichter der Szene, benannt — nicht gezählt, sondern aufgelistet: eine Zahl sagt nicht,
   *  WELCHES Licht dazugekommen ist. */
  function lights() {
    const out = [];
    scene.traverse((o) => {
      if (!o.isLight) return;
      out.push({
        typ: o.isDirectionalLight ? 'dir' : o.isHemisphereLight ? 'hemi'
           : o.isAmbientLight ? 'amb' : o.isPointLight ? 'point' : o.type,
        name: o.name || '(unbenannt)',
        i: +o.intensity.toFixed(3),
        farbe: '#' + o.color.getHexString(),
      });
    });
    return out;
  }

  /** Materialklassen — der Grund, warum eine globale Korrektur nie beide Hälften traf. */
  function materials() {
    let phong = 0, lambert = 0, standard = 0, basic = 0, andere = 0, mitEnvMap = 0;
    const seen = new Set();
    scene.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
        if (!m || seen.has(m.uuid)) continue;
        seen.add(m.uuid);
        if (m.isMeshPhongMaterial) phong++;
        else if (m.isMeshLambertMaterial) lambert++;
        else if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
          standard++;
          if (m.envMap || (scene.environment && m.envMapIntensity > 0.001)) mitEnvMap++;
        } else if (m.isMeshBasicMaterial) basic++;
        else andere++;
      }
    });
    return { phong, lambert, standard, basic, andere, mitEnvMap };
  }

  /** ── Der Kern der Abnahme: wie viel Sättigung übersteht die Sonne? ────────────────────────
   *  Rechnet kanalweise, nicht auf der Luminanz — genau das war der Fehler der alten Grenze.
   *  Rückgabe: Anteil der Sättigung, der nach dem Clip übrig ist (1 = nichts verloren).
   *  ⚠ Ein Ton mit Sättigung nahe null kann keine verlieren; für ihn gilt das Luminanzband.
   */
  /** Der Beleuchtungsfaktor einer sonnenzugewandten Fläche — EINMAL je Messung, nicht je Farbe.
   *  ⚠ Der erste Anlauf hat ihn IN `satKeep` gerechnet, also `scene.traverse` je Probe: bei 6000
   *  Proben rund 540.000 Objektbesuche pro Panel-Aufruf. Das ist genau Fehlerklasse 18 („eine
   *  Drossel macht eine teure Rechnung nicht billig") — nur diesmal vor dem Einbau gemerkt.
   *  Die Lichtsumme ist für alle Proben dieselbe; sie gehört vor die Schleife. */
  function lichtFaktor() {
    let dirMax = 0, gleich = 0;
    scene.traverse((o) => {
      if (!o.isLight) return;
      if (o.isDirectionalLight) dirMax = Math.max(dirMax, o.intensity);
      else if (o.isHemisphereLight || o.isAmbientLight) gleich += o.intensity;
    });
    return (dirMax + gleich) / Math.PI;
  }

  /** Rückgabe `{ keep, messbar }`.
   *  ⚠ **`keep: 1` war zweideutig, und das ist gefährlich:** es bedeutete entweder „gesättigt und
   *  nichts verloren" oder „es gab keine Sättigung zu verlieren". Beides las im Panel als
   *  `ok (≥0.55)`. Damit hätte ein hell-GRAUES Palett — also genau Georgs `frost` — alle drei
   *  Kanäle auf Weiß geklippt und wäre mit einem Haken durchgegangen: der Fall, FÜR DEN das Tor
   *  gebaut wurde.
   *  Ein Maß, das „gut" und „nicht messbar" mit derselben Zahl beantwortet, ist kein Maß.
   *  Für nicht messbare Töne gilt das Luminanzband als Rückfall — und der muss ANGEZEIGT werden,
   *  sonst existiert er nur im Code. */
  function satKeep(c, m) {
    const vor = sat(c);
    if (vor < 0.08) return { keep: 1, messbar: false };
    const nach = sat([Math.min(1, c[0] * m), Math.min(1, c[1] * m), Math.min(1, c[2] * m)]);
    return { keep: +(nach / vor).toFixed(3), messbar: true };
  }

  /** Was eine der Sonne zugewandte Fläche bei gegebener Albedo abbekommt — mit dem LIVE-Licht,
   *  also eine Ist-Beschreibung. Die ABNAHME (`satKeep`) nimmt dagegen den Tag-Faktor.
   *  Die beiden dürfen nicht verwechselt werden: das eine sagt „so sieht es jetzt aus", das andere
   *  „so taugt die Palette".
   *  Nur die RICHTUNGSUNABHÄNGIGEN Anteile (Hemisphere, Ambient) plus die stärkste Sonne — die
   *  Füller stehen in fünf Richtungen, eine Fläche fängt höchstens einen. Das ist die untere
   *  ehrliche Schranke; die obere wäre die Summe aller, und die trifft nie eine einzelne Fläche. */
  function faceLoad(albedo) {
    let dirMax = 0, gleich = 0;
    scene.traverse((o) => {
      if (!o.isLight) return;
      if (o.isDirectionalLight) dirMax = Math.max(dirMax, o.intensity);
      else if (o.isHemisphereLight || o.isAmbientLight) gleich += o.intensity;
    });
    return +(((dirMax + gleich) / Math.PI) * albedo).toFixed(3);
  }

  /** Die Albedo-Statistik der Terrain-Vertexfarben, **getrennt nach LAND und WASSER**.
   *  Gemessen im LINEAR-Raum, weil dort die Beleuchtung multipliziert wird.
   *
   *  ⚠ **Der erste Anlauf maß das ganze Netz gegen ein Band, das nur für Land gilt** — und die
   *  Anzeige meldete daraufhin dauerhaft `face load 1.487 ⚠ CLIPS`, während das Dokument
   *  `0,31 ✓` behauptete. Instrument und Bericht widersprachen sich über dieselbe Größe, und der
   *  Wert schwankte um Faktor 5 mit dem Seed, je nachdem wieviel helles Flachwasser die Stichprobe
   *  traf (diese Welt: 5576 Wasser- gegen 429 Landvertices).
   *  **Ein Maß, das sich mit dem Seed fünffach ändert, ist keine Grenze — es ist ein Zufall mit
   *  Nachkommastellen.** Und es ist Fehlerklasse 40 zum dritten Mal: eine Größe, deren GELTUNGS-
   *  BEREICH niemand besitzt.
   *  Die Maske kommt vom Bäcker (`globe.js`, `geo.userData.kfbLandMask`) — er entscheidet Land
   *  oder Wasser sowieso je Vertex. Eine Farbheuristik wäre der nächste Fehler: das Biom
   *  `spires` ist selbst blaustichig und würde als Wasser gezählt. */
  function albedo(mesh) {
    const attr = mesh && mesh.geometry && mesh.geometry.attributes.color;
    if (!attr) return null;
    const a = attr.array, n = attr.count;
    const maske = mesh.geometry.userData && mesh.geometry.userData.kfbLandMask;
    // ⚠ **Die benannte Ausnahme.** Ohne sie meldete diese Abnahme nach dem Palettenwechsel
    // `sat-keep 0 ⚠ DESATURATES` — richtig gerechnet, falsch zugeordnet: der Ausreißer war der
    // Übergang Berg→Schnee, und für ein Near-White ist Sättigungserhalt die falsche Regel (siehe
    // `globe.js`, Firn-Kommentar vom 27.8.). Die Schneeproben bekommen deshalb einen EIGENEN
    // Eimer und ein eigenes Urteil — sie werden nicht ausgeblendet, sondern getrennt ausgewiesen.
    // *Eine Ausnahme, die man nicht abliest, ist eine gesenkte Grenze.*
    const schnee = mesh.geometry.userData && mesh.geometry.userData.kfbSnowMask;
    const schritt = Math.max(1, Math.floor(n / 6000));
    // Die ABNAHME rechnet mit dem Tag-Faktor (Konstante), nicht mit dem Live-Licht — siehe
    // `gateFaktor`. Der Live-Wert steht daneben, als Information.
    const m = gateFaktor();
    const landW = [], wasserW = [], schneeW = [];
    for (let i = 0; i < n; i += schritt) {
      const c = [a[i * 3], a[i * 3 + 1], a[i * 3 + 2]];
      const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
      // Ohne Maske gilt ALLES als Land — das ist die ehrliche Rückfallantwort: sie ist zu streng,
      // nicht zu milde, und sie fällt sofort auf (der Bericht sagt `maske: false`).
      const probe = { L, c, sk: satKeep(c, m) };   // { keep, messbar }
      if (!maske || maske[i]) (schnee && schnee[i] ? schneeW : landW).push(probe);
      else wasserW.push(probe);
    }
    const stat = (w) => {
      if (!w.length) return null;
      const L = w.map((x) => x.L).sort((x, y) => x - y);
      let sum = 0, ueber = 0;
      for (const v of L) { sum += v; if (v > BAND_LIN[1]) ueber++; }
      // Der schlechteste Sättigungserhalt ist die Abnahme — ein Mittelwert würde einen
      // ausgebrannten Gipfel hinter tausend intakten Hängen verstecken.
      // Der schlechteste MESSBARE Sättigungserhalt ist die Abnahme. Farblose Proben werden
      // getrennt gezählt — für sie gilt das Luminanzband, nicht diese Zahl.
      let sk = 1, skFarbe = null, farblos = 0;
      for (const x of w) {
        if (!x.sk.messbar) { farblos++; continue; }
        if (x.sk.keep < sk) { sk = x.sk.keep; skFarbe = x.c; }
      }
      const anteilFarblos = Math.round(farblos / w.length * 100);
      return {
        max: +L[L.length - 1].toFixed(3),
        median: +L[L.length >> 1].toFixed(3),
        mittel: +(sum / L.length).toFixed(3),
        ueberBand: Math.round(ueber / L.length * 100),
        satKeepMin: farblos === w.length ? null : +sk.toFixed(3),
        satOk: farblos === w.length ? null : sk >= SAT_KEEP,
        // Anteil der Proben, für die die Sättigungsregel NICHTS sagen kann.
        farblosProzent: anteilFarblos,
        // Der Rückfall für genau die: Anteil über dem Luminanzband. Das ist die Zahl, die ein
        // hell-graues Palett auffliegen lässt.
        bandOk: anteilFarblos === 0 || ueber === 0,
        schlechtesteFarbe: skFarbe ? skFarbe.map((v) => +v.toFixed(3)) : null,
        proben: L.length,
      };
    };
    return { maske: !!maske, schneemaske: !!schnee,
             land: stat(landW), wasser: stat(wasserW), schnee: stat(schneeW),
             schneeAnteil: (landW.length + schneeW.length)
               ? Math.round(schneeW.length / (landW.length + schneeW.length) * 100) : 0 };
  }

  /** ── Selbsttest des Tors ────────────────────────────────────────────────────────────────
   *  ⚠ Die Abnahme hat es benannt: das Tor war **unerprobt** — in dieser Welt klippt nichts, also
   *  hat weder der gesättigte noch der farblose Pfad je etwas getan. **Der erste echte Nutzer
   *  eines Prüfwerkzeugs darf nicht sein erster Test sein** (die Schwester von Fehlerklasse 41:
   *  ein Prüfwerkzeug ohne Kontrollprobe ist eine Meinung).
   *  Drei Fälle, deren Antwort man vorher kennt — im Diagnose-Blatt ablesbar. */
  function selbsttest() {
    // ⚠ **Hier stand `lichtFaktor()` — und damit prüfte der Selbsttest nachts etwas anderes als
    // tags.** Er war genau dafür gebaut, das Tor zu zertifizieren, urteilte aber selbst mit einer
    // Nicht-Konstante: bei Nacht meldete er für zwei korrekt behandelte Fälle FALSCHEN ALARM
    // (`✗ MISMATCH … ERWARTET: FAIL`), tags stimmten alle vier — sie waren sich also nur zufällig
    // einig, wie vor dem Fix.
    // ⚠ Und der Grund, warum mein Fix ihn ÜBERSPRUNGEN hat, ist eine eigene Lehre: mein
    // `replaceText` zielte auf zwei benachbarte Zeilen, zwischen die ein früherer Edit einen
    // Kommentar geschoben hatte — das Muster passte nicht mehr, und die Ersetzung fiel STILL aus.
    // Meine Nachprüfung hat dann `lichtFaktor()` GEZÄHLT (»2 ×, Definition + Bericht«) statt die
    // AUFRUFSTELLE zu lesen. **Eine Zählung beweist nichts über einen Ort** — PM-37 an mir selbst.
    const m = gateFaktor();
    // ⚠ Die Erwartungen sind NACHGERECHNET, nicht geraten — und die erste Fassung war falsch
    // beschriftet: ich hatte [0,55 0,57 0,60] als „farblos" erwartet, aber seine Sättigung ist
    // 0,083, also knapp ÜBER der Messgrenze 0,08. Es wird direkt gefangen (keep 0), nicht über den
    // Rückfall. **Ein Selbsttest, dessen Erwartung nicht stimmt, prüft nichts — er bestätigt eine
    // Vermutung.** Deshalb stehen hier die gemessenen Werte in der Erwartung.
    const faelle = [
      // gesättigt und hell: besteht, OBWOHL die Luminanz über dem Band liegt — das ist der ganze
      // Zweck der neuen Regel (Georgs verdant/tinyskies-Fall).
      ['bright saturated green (tinyskies)', [0.24, 0.55, 0.05], 'PASS'],
      // fast grau, aber noch messbar: fällt direkt durch die Sättigungsregel.
      ['near-grey bright (frost trap A)', [0.55, 0.57, 0.60], 'FAIL'],
      // WIRKLICH farblos: die Sättigungsregel kann nichts sagen, das Band muss greifen.
      ['pure grey bright (frost trap B)', [0.58, 0.58, 0.58], 'FAIL via band'],
      // der alte Sand, der überstrahlte: fällt.
      ['old sand (was overexposing)', [0.68, 0.58, 0.36], 'FAIL'],
    ];
    return faelle.map(([n, c, erw]) => {
      const r = satKeep(c, m);
      const L = lum(c);
      const urteil = r.messbar
        ? (r.keep >= SAT_KEEP ? 'PASS' : 'FAIL')
        : (L > BAND_LIN[1] ? 'FAIL via band' : 'PASS via band');
      // **Ein Selbsttest, der einen Widerspruch als Text druckt, ist kein Test.** Die alte
      // Fassung schrieb „→ PASS [expect FAIL]" nebeneinander und meldete nichts — für einen
      // flüchtigen Leser sah das aus wie ein Beweis, dass das Tor funktioniert. Jetzt vergleicht
      // er und schreit.
      const ok = urteil === erw;
      return (ok ? '✓ ' : '✗ MISMATCH ') + n + ': keep ' + r.keep
        + (r.messbar ? '' : ' (not measurable)')
        + ' · L ' + L.toFixed(3) + (L > BAND_LIN[1] ? ' over band' : ' in band')
        + ' → ' + urteil + (ok ? '' : '   ERWARTET: ' + erw);
    });
  }

  return {
    name: 'light-budget', lights, materials, faceLoad, albedo, selbsttest,
    /** Eine Zeile fürs Panel. Kurz genug zum Lesen, lang genug zum Urteilen. */
    zeile(terrainMesh) {
      const L = lights(), M = materials();
      const dir = L.filter((l) => l.typ === 'dir');
      const summe = L.reduce((s, l) => s + l.i, 0);
      const a = albedo(terrainMesh);
      const teile = [
        L.length + ' lights (' + dir.length + ' dir) · Σ ' + summe.toFixed(2),
        // ⚠ **Lambert fehlte hier** — und Lambert ist 66 von 92 Materialien. Die Zeile las sich
        // als „7 phong / 11 pbr", also 61 % PBR, während es 11 von 92 sind: das Gegenteil.
        // In einem Slice, der von irreführenden Instrumenten handelt, ist eine unvollständige
        // Aufzählung kein Schönheitsfehler. `materials()` rechnete Lambert längst mit; nur die
        // ANZEIGE hat es weggelassen. **Wer eine Menge aufzählt, muss sie vollständig aufzählen —
        // eine Teilliste liest sich wie eine ganze.**
        M.phong + ' phong / ' + M.lambert + ' lambert / ' + M.standard + ' pbr'
          + (M.mitEnvMap ? ' (' + M.mitEnvMap + ' = pet)' : '')
          + (M.basic ? ' / ' + M.basic + ' basic' : '')
          // `andere` (ShaderMaterial: Steinchen, Ozean-Patch, Atmosphäre) fehlte — und damit war
          // die Summe 93 von 98, unter einem Kommentar, der Vollständigkeit fordert.
          + (M.andere ? ' / ' + M.andere + ' shader' : '')
          + '  = ' + (M.phong + M.lambert + M.standard + M.basic + M.andere),
        scene.environment ? 'scene.environment ON' : 'no scene env',
      ];
      // ⚠ **Die Einheit steht dabei.** Der erste Anlauf dieses Werkzeugs meldete LINEAR, während
      // Palettentabelle und Abnahmegrenze in sRGB standen — dieselbe Größe in zwei Einheiten, die
      // sich um Faktor 1,3 bis 3,1 unterscheiden. Die Abnahme „Median 0,25–0,45" wäre damit NIE
      // erfüllbar gewesen (linear liegt der Median bei 0,068). Genau Fehlerklasse 40 noch einmal:
      // eine Größe ohne Eigentümer, diesmal ohne Eigentümer der EINHEIT.
      // Linear ist die richtige Wahl, weil three dort das Licht multipliziert — und ab jetzt sagt
      // jede Zahl, in welchem Raum sie gilt.
      if (a && a.land) {
        const l = a.land, fl = faceLoad(l.max);
        // Die ABNAHME steht vorn: Sättigungserhalt. Die Luminanz ist Zusatzinformation, nicht das
        // Urteil — sie war es, und sie hat helle Welten verboten (Fehlerklasse 47).
        // BEIDE Urteile, und jedes sagt, ob es anwendbar ist. Ein „ok", das auch „nicht messbar"
        // bedeuten kann, ist schlimmer als kein Urteil.
        const satTeil = l.satKeepMin == null
          ? 'sat-keep n/a (all colourless)'
          : 'sat-keep ' + l.satKeepMin + (l.satOk ? ' ok (≥' + SAT_KEEP + ')' : ' ⚠ DESATURATES');
        const bandTeil = l.farblosProzent > 0
          ? ' · ' + l.farblosProzent + ' % colourless → band applies: '
            + (l.ueberBand > 0 ? '⚠ ' + l.ueberBand + ' % OVER ' + BAND_LIN[1] : 'ok')
          : '';
        // Der Faktor gehört DAZU: ein Urteil ohne die Bedingung, unter der es gilt, ist eine
        // Behauptung. `gate@day` ist die Konstante der Abnahme, `@now` der Ist-Zustand.
        teile.push('LAND ' + satTeil + bandTeil
          + ' · albedo(lin) max ' + l.max + ' / med ' + l.median
          + ' · load ' + fl + ' @now, gate@day ' + gateFaktor().toFixed(2));
      }
      // ⚠ Die Ausnahme steht als EIGENE Zeile im Bericht, mit Begründung und Anteil. Sie darf nie
      // stillschweigend gelten: wer den Schnee befreit, muss sagen, wieviel Fläche er befreit hat
      // — bei 5 % ist es eine Gipfelkappe, bei 40 % hat jemand die Grenze umgangen.
      // Deshalb trägt sie eine eigene Obergrenze: über 15 % Landanteil ist die „Ausnahme" keine.
      if (a && a.schnee) {
        const s = a.schnee, fs = faceLoad(s.max);
        const zuViel = a.schneeAnteil > 15;
        teile.push('SNOW BAND (e>0.7) ' + (zuViel ? '⚠ ' + a.schneeAnteil + ' % OF LAND — too much for an exemption'
                                                 : a.schneeAnteil + ' % of land, exempt from sat-keep')
          + ' · max ' + s.max + ' / med ' + s.median + ' · load ' + fs
          + (fs > 1 ? ' clips on the sunlit facet — source does too (snow 0xe8e8e0 = 0.802)' : ''));
      } else if (a && a.schneemaske) {
        // ⚠ **Eine Abnahme, die nichts druckt, liest sich wie eine, die bestanden hat.**
        // Erste Fassung: `stat([])` gibt `null` zurück, also fiel die Zeile bei einer Welt ohne
        // Gipfel über `e > 0.7` KOMPLETT aus — und die Ausnahme, die ich eingebaut hatte, um
        // ablesbar zu sein, war unsichtbar. Genau die Fehlerklasse aus §05o, eine Ebene höher:
        // nicht ein falscher Wert, sondern ein FEHLENDER. Ein leerer Eimer ist ein Ergebnis.
        teile.push('SNOW BAND (e>0.7) 0 % of land · exemption idle (no vertex above e>0.7 in this world)');
      } else if (a && a.land) {
        // Fehlt die Maske, gilt die Ausnahme NICHT — und das wird gesagt, nicht verschwiegen.
        teile.push('SNOW BAND — no mask, exemption not applied (land verdict is strict)');
      }
      if (a && a.wasser) {
        // Wasser bekommt eine EIGENE Zeile statt in den Landdurchschnitt zu rutschen — und
        // ausdrücklich den Hinweis `world-dependent`: der Wasseranteil ist gewürfelt, also
        // schwankt diese Zahl zwischen Welten um Faktor 2 (waterworld gegen landreich). Sie ist
        // eine Beobachtung, keine Grenze.
        // ⚠ Hier stand `(foam clips, source value)` — eine Ursache, die dieses Instrument NICHT
        // sehen kann: Schaum ist ein Shader-Effekt und steht in keiner Vertexfarbe. Klippendes
        // Wasser in dieser Messung ist immer eine gebackene FLACHWASSER-Farbe.
        // **Ein Messgerät darf keine Ursache nennen, die es nicht beobachtet.**
        const w = a.wasser, fw = faceLoad(w.max);
        teile.push('WATER max ' + w.max + ' / med ' + w.median + ' → load ' + fw
          + (fw > 1 ? ' (shallow-water vertex colour over band)' : '')
          + ' · world-dependent, not a gate');
      }
      if (a && !a.maske) teile.push('⚠ no land mask — all counted as land');
      return teile.join('  ·  ');
    },
    /** Der ganze Haushalt als Textblock — für das Diagnose-Blatt. */
    bericht(terrainMesh) {
      const L = lights(), M = materials(), a = albedo(terrainMesh);
      const z = [];
      z.push('lights (' + L.length + '):');
      for (const l of L) z.push('  ' + l.typ.padEnd(5) + ' ' + String(l.i).padEnd(6) + l.farbe + '  ' + l.name);
      z.push('sum of all intensities ' + L.reduce((s, l) => s + l.i, 0).toFixed(2)
             + '  (tinyskies day preset = 16.00 across 7 lights)');
      z.push('materials ' + JSON.stringify(M));
      // ⚠ **Diese beiden Blöcke fehlten** — drei `replaceText`-Aufrufe in Folge sind STILL
      // ausgefallen, weil ihre Anker durch frühere Edits verschoben waren, und meine Nachprüfung
      // hat jeweils VORKOMMEN gezählt statt die Stelle zu lesen. Folge: `selbsttest()` war
      // exportiert, aber **nirgends aufgerufen** — ein Prüfwerkzeug, das nie läuft.
      // Lehre (PM-37 an mir selbst, jetzt dreifach bezahlt): **nach jeder Ersetzung am ORT lesen,
      // nicht zählen.** Und: `replaceText` schweigt bei Fehlschlag — wer nicht prüft, glaubt.
      z.push('gate factor: day (constant) ' + gateFaktor().toFixed(3)
             + ' · live @now ' + lichtFaktor().toFixed(3)
             + '   — the gate judges the PALETTE, so it must not depend on the time of day');
      z.push('gate: sat-keep >= ' + SAT_KEEP
             + ' (saturated may be bright; band ' + BAND_LIN.join('-')
             + ' is the FALLBACK for unsaturated tones)');
      z.push('gate self-test (must be all ✓):');
      for (const z2 of selbsttest()) z.push('  ' + z2);
      z.push('scene.environment ' + (scene.environment ? 'SET' : 'null')
             + ' · toneMapping ' + (renderer && renderer.toneMapping ? renderer.toneMapping : 'none (as source)'));
      if (a) {
        z.push('albedo LINEAR, band ' + BAND_LIN.join('–') + ' applies to LAND only'
               + (a.maske ? '' : '  ⚠ NO LAND MASK'));
        if (a.land) z.push('  land  ' + JSON.stringify(a.land)
               + '  → face load max ' + faceLoad(a.land.max) + ' / med ' + faceLoad(a.land.median));
        if (a.wasser) z.push('  water ' + JSON.stringify(a.wasser)
               + '  → face load max ' + faceLoad(a.wasser.max)
               + '   (source colours, foam is an intended bright exception)');
      }
      return z.join('\n');
    },
  };
}
