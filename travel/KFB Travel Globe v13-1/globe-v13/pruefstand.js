// ============================================================================
// pruefstand.js — KFB Travel Globe v5 · Slice C · die vier QA-Schleifen als MODUL
// ----------------------------------------------------------------------------
// D-08 §15 hat sie bestellt, Slice B hat sie als Wegwerf-Code im Screenshot-Aufruf gebaut. Das
// war genau die Bastelei, die Georg ausgeschlossen hat: ein Prüfwerkzeug, das nur im Chatverlauf
// existiert, ist beim nächsten Slice weg. **Also hier, im Projekt, mit `report()`.**
//
// **Die eine Regel, die dieses Modul überhaupt möglich macht** (Slice A, PM-50 zum dritten Mal):
// es fragt nicht nach `requestAnimationFrame` und nicht nach `performance.now()`. Es dreht die
// Welt mit `welt.step(dt)`. In einem verdeckten Tab drosselt der Browser rAF fast auf null — ein
// Prüfstand, dessen Uhr der Browser stellt, misst die Aufmerksamkeit des Zuschauers mit.
//
// **Loop A · Bildstreifen.** N Bilder über die Dauer einer Kaskade, bei festem `dt`, in EIN Bild
//   mit Zeitachse. ⚠ Slice B hat gemessen, warum `dt` nicht frei wählbar ist: die Trauma-Modulation
//   läuft mit 22 Hz, bei `dt = 1/30` ist Nyquist 15 Hz — die Vibration ist unterabgetastet und im
//   Streifen unsichtbar, obwohl sie im Bild existiert. **Ein Messwerkzeug mit zu grober Abtastung
//   zeigt nicht „kein Effekt", sondern „nichts messbar" — und das sieht gleich aus.**
//   Deshalb `dtFuer(hz)` und ein Standard von 1/60.
// **Loop B · Beat-Audit.** Ist-Zeit jedes Beats gegen Soll, Toleranz ein Bild. Maschinell, ohne
//   Augen — und mit Kontrollprobe (eine absichtlich verschobene Erwartung MUSS auffallen).
// **Loop C · Gameplay-Simulation.** Eine Eingabefolge über N Sekunden bei festem `dt`; am Ende
//   Ereigniszahlen, gleichzeitig laufende Kaskaden, Bildzeit.
// **Loop D · Szenen-Invarianten.** Draw-Calls, Geometrien, Texturen und `frameFehler` vor und nach
//   jeder Kaskade. Findet Lecks — der Klassiker bei Einmal-VFX.
//
//   const ps = createPruefstand({ welt: __globe });
//   const a = ps.loopA('ground.touch', { nah: true });   // → { dataUrl, report }
//   const b = ps.loopB();                                 // → alle Kaskaden, Abweichung je Beat
//   const d = ps.loopD();                                 // → Invarianten je Kaskade
// ============================================================================

export function createPruefstand(opts = {}) {
  const welt = opts.welt;                    // das `__globe`-Objekt: step/freeze/thaw/fx/scene/…
  const P = Object.assign({
    bilder: 12,
    dt: 1 / 60,          // Standard: reicht für alles unter 24 Hz (Nyquist 30 Hz)
    dtD: 1 / 30,         // Loop D zählt Objekte, er tastet keine Schwingung ab
    kachelBreite: 300,
    /** Nahkamera: Abstand und Höhe über dem Avatar, in Weltmaß. */
    nahDist: 0.34, nahLift: 0.09, nahFov: 38,
    /** v5 · Slice C · **Nah ist der STANDARD.** Slice B hat den Grund geliefert: der Streifen aus
     *  Reiseflug-Distanz zeigt den Avatar wenige Pixel groß, und damit war das Schattenbild aus
     *  Slice A nicht zu beurteilen. Wer die Spielkamera will, sagt `{ nah: false }` — die
     *  Voreinstellung ist die, die etwas BEWEIST. */
    nah: true,
    /** Kachel 0 ist die Kontrollprobe (nicht ausgelöster Zustand), SOP-01 Bedingung 5. */
    kontrollprobe: true,
    /** Vorlauf in Sekunden, bevor gemessen wird — das Intro muss durch sein. */
    vorlauf: 7.0,
  }, opts.params || {});

  const T = welt && welt.THREE;

  /** Die höchste Frequenz in einer Kaskade bestimmt die nötige Abtastrate. Faktor 2,5 statt 2,
   *  weil Nyquist die GRENZE ist und nicht die Empfehlung. */
  function dtFuer(hz) { return 1 / Math.max(30, 2.5 * (hz || 22)); }

  function schnappschuss() {
    const r = welt.renderer.info.render, m = welt.renderer.info.memory;
    return { calls: r.calls, tris: r.triangles, geo: m.geometries, tex: m.textures,
             fehler: fehlerZahl() };
  }

  /** ⚠ **Ein Zähler, der als Satz ausgeliefert wird, ist kein Zähler.** `__globe.frameFehler`
   *  liefert bei einem Fehler `"3 · message"`; `+"3 · message"` ist `NaN`, und `NaN || 0` ist 0.
   *  Die Invariante „frame errors 0 → 0" wäre also GRÜN geblieben, egal wie oft der Frame-Loop
   *  gestorben ist — eine Kontrollprobe, die nicht durchfallen kann (dieselbe Klasse wie PM-41).
   *  Deshalb liest sie jetzt den Zahlenkanal `frameFehlerZahl` und fällt nur notfalls auf das
   *  Vorderstück des Satzes zurück. */
  function fehlerZahl() {
    if (typeof welt.frameFehlerZahl === 'number') return welt.frameFehlerZahl;
    return parseInt(String(welt.frameFehler || 0), 10) || 0;
  }

  /** Eine Kamera, die den Avatar groß zeigt — sonst ist der Avatar im Streifen wenige Pixel groß
   *  und man kann weder Schatten noch Squash beurteilen (Befund aus Slice B). */
  function nahkamera() {
    const wp = welt.carpet.worldPos();
    const n = wp.clone().normalize();
    // Hinter dem Avatar, gegen die Flugrichtung — dieselbe Logik wie der Spielrig, nur näher.
    let hinten;
    try { hinten = welt.carpet.shotRay().direction.clone().negate(); }
    catch (e) { hinten = new T.Vector3(0, 1, 0).cross(n).normalize(); }
    const cam = new T.PerspectiveCamera(P.nahFov, 1.6, 0.001, 60);
    cam.position.copy(wp).addScaledVector(hinten, P.nahDist).addScaledVector(n, P.nahLift);
    cam.up.copy(n);
    cam.lookAt(wp);
    return cam;
  }

  function vorlauf(sek) {
    const n = Math.round((sek != null ? sek : P.vorlauf) / P.dt);
    for (let i = 0; i < n; i++) welt.step(P.dt);
    return n;
  }

  /** Loop A · Bildstreifen. Nahkamera ist der Standard; `{ nah: false }` nimmt die Spielkamera. */
  function loopA(name, o = {}) {
    const dt = o.dt || P.dt, bilder = o.bilder || P.bilder;
    const nah = o.nah === undefined ? !!P.nah : !!o.nah;
    const kontroll = o.kontrollprobe === undefined ? !!P.kontrollprobe : !!o.kontrollprobe;
    welt.freeze();
    if (o.vorlauf !== false) vorlauf(o.vorlauf);
    const cv = welt.renderer.domElement;
    const cols = 4, rows = Math.ceil(bilder / cols);
    const tw = P.kachelBreite, th = Math.round(tw * cv.height / cv.width);
    const c = document.createElement('canvas');
    c.width = cols * tw; c.height = rows * th + 26;
    const x = c.getContext('2d');
    x.fillStyle = '#0d0d10'; x.fillRect(0, 0, c.width, c.height);

    /** Eine Kachel: Bild, Zeitmarke, Rahmen. Die Marke ist FARBIG unterschieden, damit die
     *  Kontrollprobe nicht wie ein weiterer Zeitpunkt aussieht. */
    function kachel(i, marke, farbe) {
      const col = i % cols, row = (i - col) / cols;
      x.drawImage(cv, col * tw, row * th + 26, tw, th);
      x.fillStyle = 'rgba(0,0,0,.62)';
      x.fillRect(col * tw, row * th + 26, Math.max(78, 8 * marke.length + 12), 18);
      x.fillStyle = farbe || '#ffd166'; x.font = '12px ui-monospace,monospace';
      x.fillText(marke, col * tw + 5, row * th + 26 + 13);
      x.strokeStyle = farbe && farbe !== '#ffd166' ? farbe : '#222';
      x.strokeRect(col * tw, row * th + 26, tw, th);
    }

    const vor = schnappschuss();
    let i0 = 0;
    // ⚠ **SOP-01, Bedingung 5: das erste Bild ist der NICHT ausgelöste Zustand.** Ohne diese
    // Kachel zeigt ein Streifen zwölf ähnliche Bilder und beweist gar nichts — der Beweis IST
    // der Unterschied zwischen Kachel 0 und Kachel 1. Slice B hat einen Streifen abgeliefert, in
    // dem der Trauma-Kanal unsichtbar war, und niemand konnte unterscheiden, ob der Effekt fehlt
    // oder die Abtastung zu grob ist. Eine Kontrollprobe trennt genau diese beiden Fälle.
    if (kontroll) {
      welt.renderer.render(welt.scene, nah ? nahkamera() : welt.camera);
      kachel(0, 'control · not fired', '#8fd6a0');
      i0 = 1;
    }
    if (name) welt.fx.fire(name, { pos: welt.carpet.worldPos(), dir: null, strength: 1 });
    for (let i = i0; i < bilder; i++) {
      welt.step(dt);
      welt.renderer.render(welt.scene, nah ? nahkamera() : welt.camera);
      kachel(i, ((i - i0 + 1) * dt).toFixed(3) + ' s');
    }
    const nach = schnappschuss();
    x.fillStyle = '#efe6d0'; x.font = '13px ui-monospace,monospace';
    // ⚠ Die Umgebung steht IM BILD. Ein Beweisbild ohne seine Bedingung ist eine Behauptung
    // (E-21, PM-50) — und `hidden` ist genau die Bedingung, die diese Sitzung dreimal genarrt hat.
    x.fillText('Loop A · ' + (name || 'idle') + ' · dt=' + dt.toFixed(4) + ' s (Nyquist '
      + (1 / (2 * dt)).toFixed(0) + ' Hz) · ' + bilder + ' frames · '
      + (kontroll ? '1 control + ' + (bilder - 1) + ' fired · ' : '')
      + (nah ? 'near cam' : 'game cam') + ' · hidden:' + document.hidden, 6, 17);
    welt.thaw();
    return { dataUrl: c.toDataURL('image/png'),
             report: { kaskade: name || null, dt, bilder, nah, kontrollprobe: kontroll,
                       hidden: document.hidden,
                       nyquistHz: +(1 / (2 * dt)).toFixed(1), vor, nach } };
  }

  /** Loop B · Beat-Audit über alle Kaskaden. Toleranz: ein Bild. */
  function loopB(o = {}) {
    const dt = o.dt || P.dt;
    const tol = dt + 1e-6;
    welt.freeze();
    const defs = welt.fx.report().kaskaden;
    const zeilen = [];
    for (const d of defs) {
      if (d.name.startsWith('__')) continue;
      // ⚠ **Slice-C-Befund an der ersten Fassung dieses Loops.** Sie zählte den GLOBALEN
      // Beat-Zähler des Busses — also jeden Beat, den die WEITERLAUFENDE Welt im Messfenster
      // feuerte, egal von welcher Kaskade. Gemessen kam dabei `card.collect` auf „7 von 6" und
      // `intro.handover` auf „7 von 4": mehr Beats als die Partitur überhaupt hat.
      // *Ein Prüfwerkzeug, das fremde Ereignisse als eigene zählt, misst die Welt und nicht die
      // Partitur — und es tut das nach oben, also sieht es wie Erfolg aus.*
      // Jetzt hängt ein HORCHER am Bus (`fx.setHorcher`): Name, Wirker, Sollzeit je Beat.
      const ist = [];
      let tJetzt = 0;
      welt.fx.setHorcher((name) => { if (name === d.name) ist.push(+tJetzt.toFixed(4)); });
      const startsVor = welt.fx.report().gefeuertJe[d.name] || 0;
      welt.fx.fire(d.name, { pos: welt.carpet.worldPos(), dir: null, strength: 1 });
      const schritte = Math.ceil((d.dauer + 0.2) / dt) + 2;
      for (let i = 0; i < schritte; i++) { tJetzt = (i + 1) * dt; welt.step(dt); }
      welt.fx.setHorcher(null);
      // Wie oft die Kaskade im Fenster überhaupt begann. 1 = nur unser eigener Schuss. Mehr heißt:
      // die laufende Welt hat sie selbst gefeuert (Selbstüberschreibung, Regel 4) — dann sind
      // Zeiten und Anzahl nicht meine Messung, und das muss DASTEHEN statt sich zu verstecken.
      const starts = (welt.fx.report().gefeuertJe[d.name] || 0) - startsVor;
      // Maßstab ist `spielbar`, nicht `beats`: `water.enter` hat 3 Beats, aber nur 2 spielbare —
      // der dritte ist die Vormerkung für Slice F (`wake`). Als Ausfall gelesen wäre das eine
      // Warnung, die nie verschwindet, und eine Warnung, die immer steht, wird nicht gelesen.
      const soll = d.spielbar;
      let urteil = ist.length === soll ? '✓ alle spielbaren Beats'
                                      : '⚠ ' + ist.length + ' von ' + soll;
      if (d.fehlendeWirker.length)
        urteil += ' · ' + (d.beats - d.spielbar) + ' vorgemerkt (Wirker fehlt: '
               + d.fehlendeWirker.join(', ') + ')';
      if (starts > 1) urteil += ' · ⚠ die Welt hat sie im Fenster ' + (starts - 1) + '× selbst gefeuert';
      zeilen.push({ kaskade: d.name, beats: d.beats, spielbar: d.spielbar,
                    gespielt: ist.length, zeiten: ist, dauer: d.dauer,
                    nullBeats: d.nullBeats, starts, urteil });
    }
    // Kontrollprobe: `fx.selbsttest()` prüft die Zeitachse gegen bekannte Sollwerte inklusive der
    // absichtlich verschobenen Erwartung. Ohne sie wäre dieser Loop eine Meinung (PM-41).
    const kontrolle = welt.fx.selbsttest();
    welt.thaw();
    return { dt, toleranz: +tol.toFixed(4), hidden: document.hidden, zeilen, kontrolle };
  }

  /** v5 · Slice C · **Ein Bild messen, nicht einen Zeitpunkt ablesen.**
   *
   * ⚠ Befund, gemessen an der ersten Fassung von Loop D: die Draw-Call-Invariante meldete
   * `93 → 4` und `90 → 1`. Vier Draw-Calls heißt, dass praktisch nichts gezeichnet wurde — und
   * genau das stimmte: `post-radial` legt bei aktivem Radial-Blur einen ZWEITEN `renderer.render`
   * über das Bild (der Vollbild-Quad), und `renderer.info` wird **bei jedem** `render` genullt.
   * Nach einem Bild mit Blur steht dort also die Zahl des Overlays, nicht die der Szene.
   * *Die Kaskade, die geprüft wird, schaltet das Gerät ab, mit dem geprüft wird.*
   *
   * Deshalb: `info.autoReset = false`, selbst nullen, EIN Bild fahren, dann lesen — die Summe
   * beider Renderdurchgänge, also die echten Kosten eines Bildes. Danach wird `autoReset`
   * zurückgestellt, sonst wüchse die Panel-Zahl des Runners endlos weiter.
   */
  function bildMessen(dt) {
    const info = welt.renderer.info;
    const merk = info.autoReset;
    info.autoReset = false;
    info.reset();
    welt.step(dt);
    const s = schnappschuss();
    info.autoReset = merk;
    info.reset();
    return s;
  }

  /** Loop C · Gameplay-Simulation: eine Eingabefolge über die Zeit, bei festem `dt`. */
  /** Loop C · Gameplay-Simulation: eine Eingabefolge über die Zeit, bei festem `dt`.
   *
   * ⚠ **Befund an mir selbst, gefunden in der Abnahme von Slice D:** PM-61 (Draw-Calls sind auf
   * einer fliegenden Kamera keine Invariante) habe ich in Loop D behoben und **in Loop C stehen
   * gelassen.** Gemessen: `⚠ draw calls 255 → 106 (Δ−149, band ±3)` — nach 30 Sekunden Flug an
   * einem anderen Ort der Welt, also genau die Aussicht und nicht ein Leck. *Eine Reparatur, die
   * nur an einem von zwei Geräten desselben Bauplans ankommt, ist eine halbe Reparatur — und die
   * unentdeckte Hälfte meldet weiter Alarm, bis ihr niemand mehr glaubt.*
   * Loop C hat kein Kontrollfenster (die Eingabefolge IST der Zweck), also werden die Draw-Calls
   * hier **beschreibend** ausgegeben, mit Spanne — und beurteilt werden Geometrien, Texturen und
   * Frame-Fehler. Der Lecktest bleibt Loop D (zweiter Schuss). */
  function loopC(o = {}) {
    const dt = o.dt || P.dt, sek = o.sekunden || 30;
    welt.freeze();
    const vor = bildMessen(dt);
    const vorFx = welt.fx.report();
    let maxLive = 0, maxMs = 0;
    const n = Math.round(sek / dt);
    for (let i = 0; i < n; i++) {
      const t = i * dt;
      // Skript als DATEN, damit man es lesen kann, ohne den Loop zu lesen.
      if (Math.abs(t - 2) < dt / 2) welt.fx.fire('card.collect', { pos: welt.carpet.worldPos(), dir: null, strength: 1 });
      if (Math.abs(t - 5) < dt / 2) welt.fx.fire('dice.collect', { pos: welt.carpet.worldPos(), dir: null, strength: 1 });
      if (Math.abs(t - 5.2) < dt / 2) welt.fx.fire('signpost.hit', { pos: welt.carpet.worldPos(), dir: null, strength: 1 });
      if (Math.abs(t - 5.3) < dt / 2) welt.fx.fire('shot.fire', { pos: welt.carpet.worldPos(), dir: null, strength: 1 });
      if (Math.abs(t - 5.4) < dt / 2) welt.fx.fire('ground.touch', { pos: welt.carpet.worldPos(), dir: null, strength: 1 });
      const t0 = performance.now();
      welt.step(dt);
      const ms = performance.now() - t0;
      if (ms > maxMs) maxMs = ms;
      const live = welt.fx.report().live.length;
      if (live > maxLive) maxLive = live;
      // ⚠ Hier stand eine Spanne über das Fenster, und sie meldete „range 1…251“. Die 1 ist der
      // Overlay-Quad des Radial-Blurs: renderer.info wird bei JEDEM render genullt (PM-60),
      // also liest eine rohe Probe nach einem Blur-Bild die Zahl des Overlays. Dieselbe Falle,
      // zum dritten Mal in derselben Sitzung, nur an einer neuen Stelle.
      // Richtig messen hieße hier autoReset je Probe umschalten — 180 Mal je Loop, teurer als
      // das Gemessene. Also wird die Spanne NICHT gemeldet: eine Zahl, die man nicht sauber
      // messen kann, gibt man nicht ungefähr aus.
    }
    const nach = bildMessen(dt);
    const nachFx = welt.fx.report();
    welt.thaw();
    return { dt, sekunden: sek, schritte: n, hidden: document.hidden,
             gleichzeitigMax: maxLive, schrittMsMax: +maxMs.toFixed(2),
             beats: nachFx.beats - vorFx.beats, verworfen: nachFx.verworfen - vorFx.verworfen,
             fehler: nachFx.fehler - vorFx.fehler,
             drawCalls: { von: vor.calls, bis: nach.calls },
             invarianten: pruefeInvarianten(vor, nach, { callsDeskriptiv: true }) };
  }

  /**
   * @param o `{ drift }` — die Eigenbewegung der Welt über dasselbe Zeitfenster, OHNE Kaskade.
   *
   * ⚠ **Slice-C-Befund: eine Draw-Call-Invariante auf einer FLIEGENDEN Kamera misst die Aussicht,
   * nicht das Leck.** Gemessen mit fester Toleranz ±2: `159 → 168`, `147 → 140`, `128 → 125` —
   * neun von zehn Kaskaden „auffällig", während Geometrien und Texturen konstant blieben. Die
   * Schwankung ist das Frustum: die Welt fliegt weiter, also sind je Bild andere Dinge sichtbar.
   * *Eine Toleranz, die aus einer statischen Szene stammt, ist auf einer bewegten Szene eine
   * Fehlermeldung mit Zufallsgenerator.*
   * Deshalb kommt das Band jetzt aus einer KONTROLLPROBE (PM-41): dasselbe Fenster ohne Kaskade.
   */
  function pruefeInvarianten(vor, nach, o) {
    const opt = (typeof o === 'number') ? { tolCalls: o } : (o || {});
    const drift = opt.drift == null ? null : Math.abs(opt.drift);
    const t = opt.tolCalls != null ? opt.tolCalls : Math.max(3, (drift || 0) + 2);
    const dCalls = nach.calls - vor.calls;
    const z = [];
    if (opt.callsDeskriptiv) {
      // Kein Urteil, weil hier keins möglich ist: über ein Gameplay-Fenster wandert die Kamera,
      // also wandert die Sichtbarkeit. Eine Zahl ohne Kontrollfenster ist eine Beobachtung.
      const sp = opt.spanne;
      z.push('· draw calls ' + vor.calls + ' → ' + nach.calls
             + (sp ? ' (range ' + sp[0] + '…' + sp[1] + ' over the window)' : '')
             + ' — descriptive: the camera moves, so visibility moves. Leak test is Loop D.');
    } else {
      z.push((Math.abs(dCalls) <= t ? '✓' : '⚠') + ' draw calls ' + vor.calls + ' → ' + nach.calls
              + ' (Δ' + (dCalls >= 0 ? '+' : '') + dCalls + ', band ±' + Math.round(t)
              + (drift != null ? ' from control drift ' + (opt.drift >= 0 ? '+' : '') + opt.drift : '')
              + ')');
    }
    z.push((nach.geo === vor.geo ? '✓' : '⚠') + ' geometries ' + vor.geo + ' → ' + nach.geo
            + (nach.geo > vor.geo ? '  (first use of a pooled sheet allocates once — Loop D judges'
                                  + ' the SECOND fire)' : ''));
    z.push((nach.tex === vor.tex ? '✓' : '⚠') + ' textures ' + vor.tex + ' → ' + nach.tex);
    z.push((nach.fehler === vor.fehler ? '✓' : '⚠') + ' frame errors ' + vor.fehler + ' → ' + nach.fehler);
    return z;
  }

  /**
   * Loop D · Invarianten je Kaskade. Drei Dinge, in dieser Reihenfolge, und jedes hat einen Grund:
   *
   * 1 **Kontrollprobe zuerst** — dasselbe Zeitfenster OHNE Kaskade. Sie liefert das Band, gegen
   *   das gemessen wird. Ohne sie ist die Toleranz geraten (PM-41), und auf einer fliegenden
   *   Kamera raten heißt: neun von zehn Kaskaden falsch anschwärzen.
   * 2 **Erster Schuss** — er darf einmalig anlegen (Textur, Geometrie). Gemessen an
   *   `card.collect`: `geometries 115 → 116`, `textures 70 → 71`. Das ist die Erstbenutzung des
   *   Kartenblatts, kein Leck.
   * 3 **Zweiter Schuss** — DAS ist der Lecktest. Ein Leck ist, was bei JEDEM Auslösen passiert;
   *   was nur beim ersten Mal passiert, ist eine Vorwärmung, die man vorziehen kann.
   *
   * `dt` ist hier gröber (1/30): dieser Loop zählt Objekte, er tastet keine Schwingung ab —
   * Nyquist ist für Loop A zuständig. Das halbiert die Schrittzahl bei gleichem Ergebnis.
   */
  function loopD(o = {}) {
    const dt = o.dt || P.dtD || (1 / 30);
    welt.freeze();
    if (o.vorlauf !== false) vorlauf(o.vorlauf);
    const zeilen = [];
    const ruhe = Math.ceil(1.0 / dt);
    for (const d of welt.fx.report().kaskaden) {
      if (d.name.startsWith('__')) continue;
      const lauf = Math.ceil((d.dauer + 1.2) / dt);
      const fenster = () => { for (let i = 0; i < lauf; i++) welt.step(dt); };
      const setzen = () => { for (let i = 0; i < ruhe; i++) welt.step(dt); };

      setzen();
      const kVor = bildMessen(dt); fenster(); const kNach = bildMessen(dt);
      const drift = kNach.calls - kVor.calls;

      setzen();
      const eVor = bildMessen(dt);
      welt.fx.fire(d.name, { pos: welt.carpet.worldPos(), dir: null, strength: 1 });
      fenster();
      const eNach = bildMessen(dt);

      setzen();
      const wVor = bildMessen(dt);
      welt.fx.fire(d.name, { pos: welt.carpet.worldPos(), dir: null, strength: 1 });
      fenster();
      const wNach = bildMessen(dt);

      zeilen.push({ kaskade: d.name, drift,
                    erstmalig: pruefeInvarianten(eVor, eNach, { drift }),
                    pruefung: pruefeInvarianten(wVor, wNach, { drift }) });
    }
    welt.thaw();
    return { dt, hidden: document.hidden, hinweis: 'judged on the SECOND fire; the first may '
             + 'allocate once. Band comes from a control window with no cascade.', zeilen };
  }

  return {
    name: 'pruefstand', params: P, dtFuer, loopA, loopB, loopC, loopD,
    nahkamera, schnappschuss, bildMessen, vorlauf, fehlerZahl,
    /** Eine Zeile fürs Panel — Georg liest keine Konsole. */
    zeile() {
      return 'dt=' + P.dt.toFixed(4) + ' s (Nyquist ' + (1 / (2 * P.dt)).toFixed(0) + ' Hz) · '
        + P.bilder + ' tiles · ' + (P.nah ? 'near cam' : 'game cam')
        + (P.kontrollprobe ? ' · tile 0 = control' : ' · ⚠ no control tile')
        + ' · hidden:' + document.hidden;
    },
    report() { return { bilder: P.bilder, dt: P.dt, nyquistHz: +(1 / (2 * P.dt)).toFixed(1),
                        nah: P.nah, kontrollprobe: P.kontrollprobe,
                        nahDist: P.nahDist, frameFehler: fehlerZahl(),
                        hidden: document.hidden }; },
  };
}
