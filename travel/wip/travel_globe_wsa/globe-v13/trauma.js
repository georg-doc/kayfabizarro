// ============================================================================
// trauma.js — KFB Travel Globe v4 · Slice B · EIN Eigentümer der Kamerawucht
// ----------------------------------------------------------------------------
// D-08 §2 hat den alten Zustand gemessen: `camera-rig.shake(i, d)` addierte pro Achse
// `(random − 0.5) · 2 · amp` auf die KAMERAPOSITION in Weltkoordinaten. Drei Aufrufer mit
// 0,008 / 0,016 / 0,020 Weltmaß.
//
// **Drei Gründe, warum das ersetzt wird und nicht nachgestellt:**
//
// 1 **Achsweises Rauschen ist kein Einschlag.** Drei unabhängige Zufallszahlen je Bild sind
//   weißes Rauschen, und das Sehen liest weißes Rauschen als BILDFEHLER (Verwacklung,
//   Kompressionsartefakt), nicht als KRAFT. Ein Einschlag hat eine Richtung: er kommt von
//   irgendwoher. Also: gerichtete Auslenkung entlang `richtung`, moduliert mit EINER kohärenten
//   Frequenz — nicht mit `Math.random()` je Bild.
// 2 **Der Rollkanal trägt bei kleinen Amplituden die meiste Wucht.** Eine Translation von 0,8 %
//   der Bildbreite sieht man kaum; eine Rotation von 0,8° bewegt das ganze Bild. `camera-rig`
//   hat `rotateZ` schon für die Bank — aber `MAX_TILT` ist 0,06 rad (3,44°) und dieses Budget
//   gehört der KURVE. Trauma bekommt sein eigenes.
// 3 **Drei Aufrufer, drei erfundene Zahlen, keine Skala.** 0,008 → 0,020 ist Faktor 2,5 zwischen
//   „Schild angestreift" und „Würfel eingesammelt". Deshalb liegen die Gewichte hier in EINER
//   Tabelle, jedes mit seinem Grund — und die Aufrufstellen nennen einen NAMEN, keine Zahl.
//   (E-19 in Reinform: ein Signalgeber, mehrere Leser mit eigenem Charakter.)
//
// ⚠ **Eigentum:** dieses Modul integriert, `camera-rig` liest. Wer Wucht auslösen will, ruft
// `add()` — es gibt keinen zweiten Weg. `rig.shake()` bleibt als Weiche bestehen und leitet
// hierher, damit kein Altaufrufer still ins Leere schlägt (Fehlerklasse 1 hat dieses Projekt
// viermal bezahlt).
//
// ⚠ **`fov` ist ein RÜCKGABEWERT, kein Setzer.** Wer die Kamera besitzt, addiert ihn — sonst
// hätten wir zwei Schreiber auf `camera.fov`, und der eine würde den anderen jedes Bild
// überschreiben.
//
//   const tr = createTrauma({ THREE });
//   tr.add('karte', richtungWelt);        // Name aus GEWICHTE, Richtung optional
//   tr.update(dt);
//   const w = tr.read();                  // { pos: Vector3, roll, fov, wert }
// ============================================================================

/**
 * Die Gewichtstabelle. **Eine Zahl, ein Ort, ein Grund** — wer ein Ereignis hinzufügt, schreibt
 * seinen Grund daneben. Skala 0…1; 1 wäre ein Absturz, den es in diesem Spiel nicht gibt.
 */
export const GEWICHTE = {
  mikro:     { w: 0.04, warum: 'Ankunft im Stapel — soll man spüren, nicht sehen' },
  // v10 · Slice 1 · Die drei Treffer-Klassen der Impact-Tabelle (`mech-impact.js`). Sie stehen
  // HIER und nicht dort, weil Bauregel 5 gilt: Gewichte in EINER Tabelle mit Grund, die
  // Aufrufstelle nennt einen Namen. Die Skala ist an den Alltagsereignissen geeicht — ein
  // schwerer Treffer darf mehr wiegen als ein eingesammelter Würfel, aber nicht mehr als
  // Bodenkontakt: der Einschlag passiert DRÜBEN, die Landung passiert am eigenen Fahrzeug.
  'treffer-leicht': { w: 0.05, warum: 'Streifschuss, Luft, Schild — Bestätigung, kein Ereignis' },
  'treffer-mittel': { w: 0.11, warum: 'Regelfall: Kinetik auf Erde, Metall, Knochen' },
  'treffer-schwer': { w: 0.19, warum: 'Hitze und Rail — die Zellen, die eine Marke hinterlassen' },
  wegweiser: { w: 0.10, warum: 'Papier gegen Papier; das Schild reagiert, der Flug kaum' },
  schuss:    { w: 0.12, warum: 'Rückstoß eines Spielzeugs, nicht einer Waffe' },
  karte:     { w: 0.22, warum: 'der häufigste Treffer — muss tragen, ohne zu ermüden' },
  wuerfel:   { w: 0.30, warum: 'seltener und schwerer als eine Karte; Hartgummi gegen Papier' },
  boden:     { w: 0.45, warum: 'die einzige Berührung mit der WELT statt mit einem Gegenstand' },
  portal:    { w: 0.80, warum: 'ein Ortswechsel; hier darf es einmal wirklich reißen' },
};

export function createTrauma(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({
    on: true,
    // Abklingkonstante (1/s). 6 heißt: nach 0,38 s ist ein Zehntel übrig, nach 0,77 s ein
    // Hundertstel. Das ist die Länge, die die alten Aufrufe als `duration` hatten (0,14…0,24 s)
    // — nur als Kurve statt als Fenster, also ohne harte Kante am Ende.
    abkling: 6.0,
    // Frequenz der kohärenten Modulation (Hz). 22 Hz liegt über der Flimmergrenze, also liest es
    // als Vibration und nicht als Wackeln. `sky-dice` moduliert seinen Ausklang mit 4,1 Hz — das
    // ist bewusst eine andere Größe, weil ein Objekt schwingt und ein Bild vibriert.
    hz: 22,
    // Amplituden bei Trauma 1. Weltmaß / rad / Grad.
    ampPos: 0.075,
    ampRoll: 0.055,     // 3,15° — eigenes Budget neben MAX_TILT (3,44° für die Kurve)
    ampFov: 5.0,        // Grad. D-08 §11.2: BASE_FOV 60 war eine Konstante, nie angefasst
    // Obergrenze der Summe. Ohne sie stapeln fünf Treffer in einer Sekunde zu einem Erdbeben.
    max: 1.0,
  }, opts.params || {});

  let wert = 0, T = 0;
  const richtung = new THREE.Vector3(0, 1, 0);
  const _pos = new THREE.Vector3();
  let roll = 0, fov = 0;
  let anlaesse = 0, letzter = null, spitze = 0, unbekannt = 0;

  /**
   * @param {string|number} was Name aus `GEWICHTE` oder ein Gewicht 0…1.
   * @param {THREE.Vector3} [dir] Weltrichtung, aus der der Stoß kommt. Fehlt sie, bleibt die
   *        letzte Richtung stehen — besser als eine erfundene, denn eine erfundene Richtung ist
   *        wieder Rauschen, nur mit mehr Code.
   */
  function add(was, dir) {
    if (!P.on) return 0;
    let g;
    if (typeof was === 'number') g = was;
    else if (GEWICHTE[was]) g = GEWICHTE[was].w;
    else { unbekannt++; g = 0.15; }   // nie stumm scheitern: ein Standardstoß plus ein Zähler
    if (dir && dir.lengthSq() > 1e-8) richtung.copy(dir).normalize();
    wert = Math.min(P.max, wert + g);
    if (wert > spitze) spitze = wert;
    anlaesse++;
    letzter = typeof was === 'string' ? was : ('w=' + g.toFixed(2));
    return wert;
  }

  function update(dt) {
    if (wert <= 0.0005) { wert = 0; roll = 0; fov = 0; _pos.set(0, 0, 0); return; }
    T += dt;
    wert *= Math.exp(-P.abkling * dt);
    // Quadratisch: der Ausklang ist weich, die Spitze bleibt scharf. Dieselbe Kurve, die die alte
    // Fassung als `decay²` schon hatte — sie war das einzig Richtige daran.
    const k = wert * wert;
    const s = Math.sin(T * Math.PI * 2 * P.hz);
    _pos.copy(richtung).multiplyScalar(s * P.ampPos * k);
    // Der Roll läuft mit einer NAHE, aber nicht gleichen Frequenz (0,71 ×) — zwei gekoppelte
    // Kanäle auf derselben Frequenz lesen als ein einziger, versetzter Ruck.
    roll = Math.sin(T * Math.PI * 2 * P.hz * 0.71 + 1.1) * P.ampRoll * k;
    // FOV nur nach OBEN (Betrag): ein Einschlag weitet den Blick, er verengt ihn nicht.
    fov = Math.abs(s) * P.ampFov * k;
  }

  return {
    name: 'trauma', params: P, add, update,
    /** Was die Kamera addieren soll. `pos` ist ein geteilter Vektor — nicht behalten, nur lesen. */
    read() { return { pos: _pos, roll, fov, wert }; },
    get wert() { return wert; },
    reset() { wert = 0; roll = 0; fov = 0; _pos.set(0, 0, 0); },
    /** Abnahme: Georg kann keine Konsole lesen, also gehört das ins Panel. */
    report() {
      return { an: P.on, jetzt: +wert.toFixed(3), spitze: +spitze.toFixed(3), anlaesse,
               letzter, unbekannteNamen: unbekannt,
               kanaele: 'pos ' + (P.ampPos * 100).toFixed(1) + ' cm · roll '
                        + (P.ampRoll * 180 / Math.PI).toFixed(2) + '° · fov ' + P.ampFov + '°',
               abkling: P.abkling + '/s → 10 % nach ' + (Math.log(10) / P.abkling).toFixed(2) + ' s' };
    },
    /** Kontrollprobe (PM-41): drei Fälle, deren Antwort man vorher kennt. */
    selbsttest() {
      const z = [];
      const sichern = { wert, T, roll, fov };
      // 1 · ein bekannter Name gibt sein Tabellengewicht
      reset(); add('karte');
      z.push((Math.abs(wert - 0.22) < 1e-9 ? '✓' : '✗') + ' name→gewicht: karte = ' + wert.toFixed(3) + ' (soll 0,220)');
      // 2 · Stapeln klemmt bei `max`
      reset(); for (let i = 0; i < 10; i++) add('portal');
      z.push((Math.abs(wert - P.max) < 1e-9 ? '✓' : '✗') + ' 10× portal geklemmt auf ' + wert.toFixed(3) + ' (soll ' + P.max.toFixed(3) + ')');
      // 3 · Abklingen trifft die gerechnete Zeit: nach ln(10)/k muss ein Zehntel übrig sein
      reset(); add(1.0);
      const schritte = 60, dauer = Math.log(10) / P.abkling;
      for (let i = 0; i < schritte; i++) update(dauer / schritte);
      z.push((Math.abs(wert - 0.1) < 0.01 ? '✓' : '✗') + ' abkling nach ' + dauer.toFixed(2) + ' s = ' + wert.toFixed(3) + ' (soll 0,100)');
      // 4 · Kontrollprobe der Kontrollprobe: ein unbekannter Name darf NICHT still durchgehen
      const vorher = unbekannt; reset(); add('gibtesnicht');
      z.push((unbekannt === vorher + 1 ? '✓' : '✗') + ' unbekannter name wird gezählt');
      // ⚠ **Und der Zähler wird zurückgestellt.** Sonst meldet die Panel-Zeile nach jedem Aufruf
      // des Selbsttests „⚠ 3 unknown weight names" — ein FALSCHER ALARM, den der Test selbst
      // erzeugt. Genau diese Klasse hat BUG-07 gekostet: ein Prüfwerkzeug, das seinen eigenen
      // Probelauf in die Betriebszahlen schreibt, macht die Betriebszahlen unlesbar.
      unbekannt = vorher;
      reset(); wert = sichern.wert; T = sichern.T; roll = sichern.roll; fov = sichern.fov;
      return z;
    },
  };

  function reset() { wert = 0; T = 0; roll = 0; fov = 0; _pos.set(0, 0, 0); }
}
