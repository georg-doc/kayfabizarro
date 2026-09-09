// ============================================================================
// day-night.js — KFB Travel Globe v3 · S1 · Tageszeit läuft
// ----------------------------------------------------------------------------
// Befund 6 im Living-Dokument: „Tageszeit ist statisch" — v2 liest das Preset EINMAL.
// tinyskies hat dafür `DayNightCycle.ts`; portiert ist hier die ABSICHT, nicht der Code:
// wir haben drei vollständige Presets (`sky-presets.js`, 1:1 aus der Quelle), also wird
// zwischen ihnen interpoliert statt eine zweite Farbwelt zu erfinden.
//
// **Ein Besitzer für den Himmel.** Dieses Modul schreibt sieben Lichter, Nebel,
// Hintergrundverlauf, Sternendeckkraft, Atmosphärenglut und Wolkendeckkraft. Wer sonst noch
// an diesen Werten dreht, muss es lassen (Fehlerklasse 1: zwei Himmelsbesitzer).
//
// **Was es NICHT anfasst und warum:** die Ozean- und Landfarben stecken als Vertex-Farben in
// der Globus-Geometrie (256² Segmente, einmal gebacken). Sie mitzufahren hieße, das Mesh
// neu zu backen — pro Bild unmöglich, pro Übergang ein Ruckler. Der Boden bleibt also in der
// Farbwelt seiner Startzeit; Licht, Nebel und Himmel tragen den Lauf. Rückweg: der Regler
// „Tageszeit" ganz nach links (aus) liefert genau das Verhalten von v2.
//
//   const zyklus = createDayNight({ THREE, scene, lights, stars, globe, lighting, start: 'day' });
//   zyklus.update(dt);   ·   zyklus.setEnabled(true)   ·   zyklus.setMinutes(6)
// ============================================================================

import { getSkyPreset, paintRadialSky } from './sky-presets.js';

// Der Tageslauf als Stützstellen.
// ⚠ **Slice A (30.8.) · Georgs Entscheidung: die Dämmerung war die kürzeste Phase.**
// Gemessen an der alten Liste: Tag 45 % · Dämmerung 15 % · Nacht 40 % — und die 15 % waren in
// 0:36 Abend und **0:18 Morgengrauen** zerlegt, weil `evening` gar keine PLATEAU-Stützstelle
// hatte: es war nur ein Durchgangspunkt zwischen zwei Blenden. Achtzehn Sekunden Morgenlicht je
// Umlauf, dagegen 2:24 fast farblose Nacht.
// Jetzt bekommt `evening` **zwei eigene Plateaus** (Abendrot 0,42–0,50, Morgenrot 0,88–0,94) und
// die Nacht wird kürzer. Nachgerechnet (Etikett kippt in der Mitte jeder Blende):
// **Tag 41 % (2:28) · Dämmerung 30 % (1:48) · Nacht 29 % (1:44)** bei 6 Minuten je Umlauf.
// Das Morgenlicht wächst von 0:18 auf 0:47 — Faktor 2,6.
// **Keine neuen Presets, nur andere Bereiche** — das war die Bedingung.
const KEYS = [
  { p: 0.00, n: 'day' },     { p: 0.34, n: 'day' },       // Tag-Plateau
  { p: 0.42, n: 'evening' }, { p: 0.50, n: 'evening' },   // ABENDROT hält
  { p: 0.60, n: 'night' },   { p: 0.80, n: 'night' },     // Nacht-Plateau
  { p: 0.88, n: 'evening' }, { p: 0.94, n: 'evening' },   // MORGENROT hält (war ein Punkt)
  { p: 1.00, n: 'day' },
];
// S9b · `petFillIntensity` steht MIT in dieser Liste — ein Licht, das nicht mitgefahren wird,
// leuchtet nachts wie mittags. Genau das war der Fehler des anonymen achten Lichts.
const NUM = ['fogNear', 'fogFar', 'hemiIntensity', 'ambientIntensity', 'sunIntensity',
             'sun2Intensity', 'fillIntensity', 'fill2Intensity', 'backIntensity',
             'petFillIntensity', 'cloudOpacity'];
// ⚠ **`oceanShallow/oceanDeep/oceanFoam` standen NICHT in dieser Liste — 30.8., Georgs Frage
// „wo sind wir falsch abgebogen?".** Alle drei Presets tragen die Werte (DAY 0x2a8ca0/0x1560a0,
// zeichengleich mit tinyskies · NIGHT 0x081838/0x040c20, fast schwarz), und der Zyklus hat sie nie
// gelesen. Gefärbt wurde einmal, beim Bau der Welt, aus dem Preset der Startzeit — eine nachts
// gestartete Welt behielt einen schwarzen Ozean durch den ganzen Tag (gemessen: Albedo 0,005
// gegen tinyskies' 0,111). Und es war unsichtbar, weil der Ozean IMMER blau aussieht: nur die
// Zahl konnte das aufdecken, kein Bild.
// *Ein Wert, der in einer Tabelle steht und von keinem Leser gelesen wird, ist kein Parameter,
// sondern Dekoration.* Die drei gehören in dieselbe Interpolation wie Nebel und Sonne.
// ⚠ **Und genau derselbe Fehler nochmal, eine Ebene weiter: `flareColorScale`.**
// 1.9. (v9), gefunden von der Abnahme: der neue Lens Flare las `zyklus.preset.flareColorScale` und
// bekam **[1, 1, 1]**, während das Nacht-Preset **[0.3, 0.4, 0.8]** trägt — das Feld ist ein
// Zahlen-TRIPEL und stand deshalb weder in `NUM` (Skalare) noch in `COL` (Farben). `mix` ist ein
// Klon des TAG-Presets, also blieb der Tagwert für immer stehen und der Reflex leuchtete nachts
// in Tagesfarbe. Dieselbe Klasse wie die drei Ozeanfarben oben, dieselbe Reparatur:
// *ein Wert, den ein Leser braucht, muss in der Interpolation stehen — sonst ist er Dekoration.*
const TRIPEL = ['flareColorScale'];
const COL = ['fogColor', 'hemiSkyColor', 'hemiGroundColor', 'ambientColor', 'sunColor',
             'sun2Color', 'fillColor', 'fill2Color', 'backColor', 'petFillColor',
             'rimColor', 'atmosphereGlow',
             'oceanShallow', 'oceanDeep', 'oceanFoam'];

export function createDayNight(opts = {}) {
  const THREE = opts.THREE;
  const scene = opts.scene, lights = opts.lights, stars = opts.stars;
  const globe = opts.globe, lighting = opts.lighting;
  const P = Object.assign({
    on: false,          // Standard aus: ein Lauf, den man nicht bestellt hat, ist Unruhe
    minutes: 6,         // Minuten je vollem Tag
    phase: null,        // wird aus der Startzeit gesetzt
    skyHz: 4,           // wie oft der Hintergrundverlauf neu gemalt wird (Leinwand, 512²)
  }, opts.params || {});

  const START = { day: 0.18, evening: 0.50, night: 0.70 };
  if (P.phase == null) P.phase = START[opts.start] != null ? START[opts.start] : 0.18;

  // Ein einziges Preset-Objekt, das jedes Bild überschrieben wird — kein Müll je Bild.
  const mix = JSON.parse(JSON.stringify(getSkyPreset('day')));
  for (const k of COL) mix[k] = new THREE.Color(getSkyPreset('day')[k]);
  const _a = new THREE.Color(), _b = new THREE.Color(), _c = new THREE.Color();
  let skyT = 0, letzterSky = -1, aktuell = 'day';
  /** 0 = kein Nachtanteil, 1 = mitten in der Nacht. EIN Eigentümer, mehrere Leser: Sterne, Aurora,
   *  Gottesstrahlen (als `1 − x`). Begründung an der Zuweisung in `schreiben`. */
  let nachtGewicht = 0;
  // ── Slice H · Der Himmel-Ton einer Stimmung ─────────────────────────────────────────────────
  // ⚠ **Ein MODIFIKATOR, kein zweiter Schreiber** — dieselbe Bauform wie beim Wasser (§05u), und
  // zwar bewusst dieselbe: dort hat sie einen Wettlauf beendet, den ich zwei Zeilen unter meinem
  // eigenen Warnkommentar gebaut hatte. Der Zyklus bleibt der einzige, der Himmel, Nebel und
  // Atmosphäre schreibt. Die Stimmung sagt nur, um welchen Farbton er zu drehen hat.
  //
  // ⚠ **Was die Stimmung NICHT dreht: die Lichter.** Und das ist eine Grenze mit Begründung, keine
  // Faulheit. Der Lichtrig ist quellentreu und gemessen (DAY sun 5,0 · sun2 3,25 · hemi 1,75 ·
  // amb 1,25 plus Füller, gegengelesen an `SkyPresets.ts` 63–71). Würde eine Stimmung die
  // Lichtfarben mitdrehen, wäre bei `molten` auch das Pet rot und die Karte rot — die Stimmung
  // färbte dann nicht die Welt, sondern das Bild.
  // **Die Regel dahinter, in einem Satz: die Stimmung besitzt die ATMOSPHÄRE, die Quelle besitzt
  // das LICHT.** Nebel ist dabei das Bindeglied — er trägt die Himmelsfarbe an das Land heran und
  // ist deshalb der eine Wert, der beides verbindet, ohne die Beleuchtung anzufassen.
  let himmelTon = null;
  let fogScale = 1;   // v11 · Game.ts `fogScale`
  const _h = {};
  // ⚠ **Ein VERSATZ, keine Zuweisung — und der erste Anlauf war eine Zuweisung.**
  // `setHSL(grad, s, l)` auf jede Verlaufsstufe legt ALLE neun Stützstellen auf denselben Farbton.
  // Gemessen von der Abnahme: Abend ohne Stimmung Farbtonspanne **154°** (violetter Zenit →
  // warmer Horizont — *das* ist der Sonnenuntergang), Abend mit `molten` Spanne **0,2°**. Der
  // Himmel wurde einfarbig, es variierte nur noch die Helligkeit.
  // *Eine Stimmung soll den Himmel DREHEN, nicht überschreiben.* Also: der Versatz wird EINMAL je
  // Bild aus einem benannten Anker berechnet — dem **Zenit** — und auf alle Stufen gleich
  // angewandt. Damit landet der Zenit exakt auf dem Stimmungston und die vom Preset gestaltete
  // Progression bleibt erhalten, inklusive der Kante am Horizont.
  // Der Anker ist der Zenit und nicht der Horizont, weil der Horizont bei jeder Tageszeit anders
  // weit vom Zenit weg ist: ein Anker muss der stabilere der beiden sein, sonst wandert die
  // Drehung mit der Uhr.
  let versatzJetzt = 0;
  function hueVon(farbe) { farbe.getHSL(_h, THREE.SRGBColorSpace); return _h.h * 360; }
  /** Farbton um `grad` weiterdrehen, Sättigung und Helligkeit unangetastet. */
  function tonVersetzen(farbe, grad) {
    if (!grad) return farbe;
    farbe.getHSL(_h, THREE.SRGBColorSpace);
    farbe.setHSL((((_h.h * 360 + grad) % 360) + 360) % 360 / 360, _h.s, _h.l, THREE.SRGBColorSpace);
    return farbe;
  }
  // Womit das Wasser zuletzt gefärbt wurde. Drei Farben, nicht eine: der Schaum bewegt sich
  // anders als die Tiefe (NIGHT 0x2050aa gegen DAY 0xb3ffff), und wer nur eine prüft, verpasst ihn.
  const ozeanGemalt = [new THREE.Color(-1), new THREE.Color(-1), new THREE.Color(-1)];
  const ozeanAbstand = (s, t, f) =>
    Math.abs(s.r - ozeanGemalt[0].r) + Math.abs(s.g - ozeanGemalt[0].g) + Math.abs(s.b - ozeanGemalt[0].b)
  + Math.abs(t.r - ozeanGemalt[1].r) + Math.abs(t.g - ozeanGemalt[1].g) + Math.abs(t.b - ozeanGemalt[1].b)
  + Math.abs(f.r - ozeanGemalt[2].r) + Math.abs(f.g - ozeanGemalt[2].g) + Math.abs(f.b - ozeanGemalt[2].b);
  // Raum-Blende: 1 = innerhalb der Atmosphäre (Horizontband wie in der Quelle), 0 = außerhalb
  // (der Verlauf wird gegen seinen EIGENEN Zenit-Stop gemischt, also Raum statt Horizont).
  // Dasselbe Band wie bei der Hülle: 1,50…1,62·R.
  let raum = 1, raumGemalt = -1;

  function paar(p) {
    for (let i = 0; i < KEYS.length - 1; i++) {
      if (p >= KEYS[i].p && p <= KEYS[i + 1].p) {
        const span = Math.max(1e-6, KEYS[i + 1].p - KEYS[i].p);
        const t = (p - KEYS[i].p) / span;
        return { A: getSkyPreset(KEYS[i].n), B: getSkyPreset(KEYS[i + 1].n), t,
                 nA: KEYS[i].n, nB: KEYS[i + 1].n };
      }
    }
    return { A: getSkyPreset('day'), B: getSkyPreset('day'), t: 0, nA: 'day', nB: 'day' };
  }

  /** Verlaufsfarbe eines Presets an der Stelle t (0 = Zenit/Mitte, 1 = Horizont/Rand).
   *  ⚠ `_c` als Zwischenfarbe, NICHT `_b`: `mischGrad` ruft dies mit `out = _b` auf — wäre die
   *  Zwischenfarbe dieselbe Instanz, überschriebe sie das Ergebnis, und der zweite Verlauf käme
   *  als reine Stützstellenfarbe heraus. Ein geteilter Arbeitsvektor ist ein stiller Fehler. */
  function gradAt(preset, t, out) {
    const g = preset.skyGradient;
    for (let i = 0; i < g.length - 1; i++) {
      if (t >= g[i].stop && t <= g[i + 1].stop) {
        const s = (t - g[i].stop) / Math.max(1e-6, g[i + 1].stop - g[i].stop);
        return out.set(g[i].color).lerp(_c.set(g[i + 1].color), s);
      }
    }
    return out.set(g[g.length - 1].color);
  }

  // Der Hintergrund ist eine Leinwand (`paintRadialSky`): 12 Stützstellen aus BEIDEN Presets
  // gemischt ergeben einen gültigen Verlauf, ohne die ungleichen Stop-Listen zu vergleichen.
  const SAMPLES = 12;
  // Die Farbton-Spannen der letzten Zeichnung: roh (wie das Preset sie gestaltet hat) und nach der
  // Drehung. Die Abnahme vergleicht die beiden — **das ist das Paar, um das es geht.** Die alte
  // Zeile prüfte nur die Nebelfarbe und meldete daher ✓, während der Himmel einfarbig war.
  let spanneRoh = [], spanneNeu = [];
  function spanne(hues) {
    if (hues.length < 2) return 0;
    let max = 0;
    for (let i = 0; i < hues.length; i++) {
      for (let j = i + 1; j < hues.length; j++) {
        let d = Math.abs(hues[i] - hues[j]) % 360; if (d > 180) d = 360 - d;
        if (d > max) max = d;
      }
    }
    return max;
  }
  /** ⚠ **Dritter und letzter Anlauf an dieser einen Zahl — und der Fehler lag nie im Mechanismus,
   *  sondern in meinen DATEN.**
   *  Anlauf 1: absoluter Farbton, per `setHSL` auf jede Verlaufsstufe geschrieben → alle neun
   *  Stufen fielen auf einen Ton, der Himmel wurde einfarbig (Abend: Spanne 154° → 0,2°).
   *  Anlauf 2: derselbe absolute Ton als Drehung, verankert am Zenit, dann am Horizont. Die Spanne
   *  blieb erhalten (100 %), aber die Zahlen wurden absurd: `frost` brauchte **157°** Drehung, weil
   *  es 212° (kalt) verlangt, während der Tag-Horizont bei 54° (warm) liegt. Ergebnis: ein
   *  **roter Nebel** in einer Frostwelt.
   *  **Die Einsicht:** das Preset kodiert schon, WO die Sonne steht — der Horizont ist warm, der
   *  Zenit kalt, zu jeder Tageszeit. Ein absoluter Zielton für den Himmel kämpft gegen diese
   *  Information und muss sie zwangsläufig umkippen. Eine Stimmung will aber nicht die Sonne
   *  versetzen; sie will die Atmosphäre **wärmer oder kälter** haben.
   *  Also ist `himmel` ab jetzt ein **VERSATZ in Grad** — vorzeichenbehaftet, klein, und ohne
   *  Anker: der Versatz IST der Wert. Damit verschwindet die ganze Ankerfrage.
   *  *Wer für eine Größe dreimal einen Mechanismus umbaut, hat wahrscheinlich das falsche
   *  Datenformat.* */
  const mischGrad = (A, B, t) => {
    // ⚠ **Der Versatz, EINMAL je Zeichnung, aus dem benannten Anker: dem Zenit (`stop 0`).**
    // Und die Puffer werden hier geleert — ohne das wuchsen sie mit jeder Zeichnung weiter (die
    // Abnahme meldete `stufen: 192` statt 12), und `spanne()` rechnete O(n²) über Altlasten.
    // *Ein Puffer, der nicht geleert wird, ist ein Messwert, der Geschichte erzählt.*
    spanneRoh.length = 0; spanneNeu.length = 0;
    const out = [];
    for (let i = 0; i < SAMPLES; i++) {
      const s = i / (SAMPLES - 1);
      gradAt(A, s, _a);
      gradAt(B, s, _b);
      _a.lerp(_b, t);
      // Außerhalb der Atmosphäre gegen den Zenit-Stop des Presets ziehen (keine neue Farbe).
      if (raum < 0.999) { gradAt(A, 0, _c); _a.lerp(_c, 1 - raum); }
      // ⚠ **Der Rohwert wird NACH der Raum-Blende genommen, und das ist der Unterschied zwischen
      // einer Messung und einem Fehlalarm.** Erste Fassung nahm ihn davor — und die Abnahme
      // verglich dann zwei verschiedene Zustände: Spanne VOR der Blende gegen Spanne NACH ihr.
      // Die Blende zieht den Verlauf absichtlich auf die Zenitfarbe zusammen, sobald die Kamera
      // die Atmosphäre verlässt (Eröffnungsflug!); die gemessene Spanne fiel dadurch auf 0 %,
      // obwohl die Drehung sauber arbeitete.
      // *Wer ein Verhältnis bildet, muss beide Seiten im selben Zustand messen* — sonst misst er
      // die Differenz der Zustände und nennt sie Fehler.
      const hueRoh = hueVon(_a);
      // Ohne Stimmung passiert hier nichts; mit Stimmung dieselbe Drehung für jede Stufe.
      tonVersetzen(_a, versatzJetzt);
      out.push({ stop: s, color: '#' + _a.getHexString() });
      spanneRoh.push(hueRoh); spanneNeu.push(hueVon(_a));
    }
    return out;
  };

  function schreiben(dt, sofort) {
    const { A, B, t, nA, nB } = paar(P.phase);
    versatzJetzt = himmelTon || 0;   // der Versatz IST der Wert — kein Anker, keine Berechnung
    aktuell = t < 0.5 ? nA : nB;
    for (const k of NUM) mix[k] = A[k] + (B[k] - A[k]) * t;
    for (const k of COL) mix[k].set(A[k]).lerp(_b.set(B[k]), t);
    for (const k of TRIPEL) {
      const a = A[k] || [1, 1, 1], b = B[k] || [1, 1, 1];
      if (!Array.isArray(mix[k])) mix[k] = [1, 1, 1];
      for (let i = 0; i < 3; i++) mix[k][i] = a[i] + (b[i] - a[i]) * t;
    }
    mix.stars = A.stars || B.stars;

    if (lights) {
      lights.sun.color.copy(mix.sunColor); lights.sun.intensity = mix.sunIntensity;
      lights.sun2.color.copy(mix.sun2Color); lights.sun2.intensity = mix.sun2Intensity;
      lights.fill.color.copy(mix.fillColor); lights.fill.intensity = mix.fillIntensity;
      lights.fill2.color.copy(mix.fill2Color); lights.fill2.intensity = mix.fill2Intensity;
      lights.back.color.copy(mix.backColor); lights.back.intensity = mix.backIntensity;
      lights.hemi.color.copy(mix.hemiSkyColor); lights.hemi.groundColor.copy(mix.hemiGroundColor);
      lights.hemi.intensity = mix.hemiIntensity;
      lights.amb.color.copy(mix.ambientColor); lights.amb.intensity = mix.ambientIntensity;
      if (lights.petFill) {
        lights.petFill.color.copy(mix.petFillColor);
        lights.petFill.intensity = mix.petFillIntensity;
      }
    }
    if (scene.fog) {
      scene.fog.color.copy(mix.fogColor);
      // Derselbe Versatz wie der Verlauf. Wäre der Nebel eine ZUWEISUNG und der Himmel ein
      // Versatz, liefen sie auseinander — und die Naht wäre genau dort zu sehen, wo der Nebel das
      // Land berührt.
      tonVersetzen(scene.fog.color, versatzJetzt);
      scene.fog.near = mix.fogNear * fogScale; scene.fog.far = mix.fogFar * fogScale;   // v11 · Game.ts 1155: preset × fogScale
    }
    if (globe) {
      globe.setAtmosphereGlow(!versatzJetzt ? mix.atmosphereGlow
        : tonVersetzen(_c.copy(mix.atmosphereGlow), versatzJetzt).getHex(THREE.SRGBColorSpace));
      globe.setCloudOpacity(mix.cloudOpacity);
      // Der Ozean wird UMGEFÄRBT, nicht neu gebaut (die Quelle hält die Tiefe je Vertex genau
      // dafür vor). Ein Durchlauf über die Wasser-Vertices ist zu teuer für jedes Bild und
      // unnötig: die Farbe wandert langsam. Schwelle 0,012 im Linearraum ist gemessen, nicht
      // geraten — sie liegt unter dem, was auf 8 Bit sichtbar wird (1/255 = 0,0039 in sRGB, an
      // der dunklen Flanke rund 0,015 linear), also färbt sie um, bevor ein Sprung sichtbar wäre.
      if (globe.setOceanColors) {
        const dist = ozeanAbstand(mix.oceanShallow, mix.oceanDeep, mix.oceanFoam);
        if (sofort || dist > 0.012) {
          ozeanGemalt[0].copy(mix.oceanShallow);
          ozeanGemalt[1].copy(mix.oceanDeep);
          ozeanGemalt[2].copy(mix.oceanFoam);
          globe.setOceanColors(mix.oceanShallow.getHex(), mix.oceanDeep.getHex(),
                               mix.oceanFoam.getHex());
        }
      }
    }
    // Sterne: nur in der Nachtstrecke, weich ein- und ausgefadet.
    // ⚠ **Das Nachtgewicht wird ab 1.9. GEMERKT statt nur benutzt** (Block 2, Atmosphäre-Effekte).
    // Es stand hier als lokale Variable und war damit ein Signal mit genau einem Leser — die Aurora
    // bräuchte dieselbe Zahl, und die Gottesstrahlen ihr Gegenstück. *Eine Größe, die ein zweiter
    // Leser braucht, gehört nicht in eine lokale Variable*; sonst rechnet der zweite sie nach und
    // das Projekt hat zwei Nachtbegriffe, die an den Blenden auseinanderlaufen (genau der Fehler,
    // der am 1.9. bei der Portalgröße dreimal aufgetreten ist).
    nachtGewicht = (nA === 'night' ? 1 - t : 0) + (nB === 'night' ? t : 0);
    if (stars) stars.setOpacity(nachtGewicht);
    if (lighting) lighting.setTint(mix.rimColor.getHex(), lighting.tintAmount);

    // Hintergrundverlauf gedrosselt — eine 512²-Leinwand je Bild wäre Arbeit ohne Bild.
    skyT += dt;
    if (sofort || Math.abs(raum - raumGemalt) > 0.02 || skyT >= 1 / Math.max(0.5, P.skyHz)) {
      raumGemalt = raum;
      skyT = 0;
      const alt = scene.background;
      scene.background = paintRadialSky(THREE, { skyGradient: mischGrad(A, B, t) });
      if (alt && alt.dispose && alt !== scene.background) alt.dispose();
      letzterSky = P.phase;
    }
  }

  return {
    name: 'day-night', params: P, get preset() { return mix; },
    get enabled() { return P.on; },
    get phase() { return P.phase; },
    /** Nachtanteil 0…1 der laufenden Blende — die Zahl, die auch die Sterne fahrt. */
    get nachtGewicht() { return nachtGewicht; },
    /** ⚠ **Tagesgewicht, und zwar als eigener Name.** Die Quelle hat genau dafür ein Feld:
     *  `DayNightCycle.getDayWeight()` — *„Lens flare visibility weight: 1 during day, 0 during
     *  night"* — und es ist dort `1 − getNightWeight()`. Dass die Rechnung trivial ist, ist kein
     *  Grund, sie beim Leser zu machen: eine zweite Stelle, die `1 − x` bildet, ist eine zweite
     *  Definition von „Nacht". Die Gottesstrahlen rechnen `1 − nachtGewicht` seit v7 selbst; ab
     *  jetzt gibt es den Namen, und neue Leser nehmen ihn. */
    get tagGewicht() { return 1 - nachtGewicht; },
    /** ⚠ **Die Zahl, an der sich die Abnahme heute gestoßen hat, lesbar gemacht.**
     *  `timeOfDay` (Startzeit, beim Bau der Welt festgelegt) und die LAUFENDE Phase sind zwei
     *  verschiedene Dinge: eine nachts gestartete Welt steht nach zwei Minuten Lauf im Tag, und
     *  dann ist `nachtGewicht = 0` richtig, nicht kaputt. Wer nur eines von beiden liest, hält das
     *  jeweils andere für einen Fehler. */
    gewichtTor(startzeit) {
      const p = paar(P.phase);
      const ok = nachtGewicht >= 0 && nachtGewicht <= 1;
      return { ok, nachtGewicht: +nachtGewicht.toFixed(3), tagGewicht: +(1 - nachtGewicht).toFixed(3),
        phase: +P.phase.toFixed(3), zwischen: p.nA + '→' + p.nB, anteil: +p.t.toFixed(2),
        flare: (mix.flareColorScale || [1, 1, 1]).map((v) => +v.toFixed(2)),
        text: (ok ? '✓' : '✗') + ' night ' + nachtGewicht.toFixed(2) + ' / day '
          + (1 - nachtGewicht).toFixed(2) + ' · running phase ' + P.phase.toFixed(3)
          + ' between ' + p.nA + ' and ' + p.nB + ' (' + (p.t * 100).toFixed(0) + ' %)'
          + (startzeit ? ' · world was BUILT at ' + startzeit + ' — that is the start time, not the clock' : '')
          + ' · flare scale [' + (mix.flareColorScale || [1, 1, 1]).map((v) => v.toFixed(2)).join(', ')
          + '] (day [1,1,1] · night [0.3,0.4,0.8] — interpolated since v9, it was frozen at the day value before)' };
    },
    get label() {
      const std = Math.floor(((P.phase + 0.25) % 1) * 24);
      const min = Math.floor((((P.phase + 0.25) % 1) * 24 - std) * 60);
      return (std < 10 ? '0' : '') + std + ':' + (min < 10 ? '0' : '') + min + ' · ' + aktuell;
    },
    setEnabled(on) { P.on = !!on; schreiben(0, true); },
    /**
     * Raum-Blende nach Kameradistanz. Der Backdrop ist ein BILDSCHIRM-Verlauf: Mitte = Zenit,
     * Ecken = Horizont. Von außerhalb der Kugel füllt das Horizontband das Bild — deshalb wird
     * der Verlauf dort gegen seinen eigenen Zenit gemischt. Läuft auch bei ausgeschaltetem
     * Tageslauf, weil dieses Modul der EINZIGE Schreiber auf `scene.background` ist.
     */
    setSpaceByCamera(camLen, radius) {
      const a = radius * 1.50, b = radius * 1.62;
      const t = camLen <= a ? 1 : camLen >= b ? 0 : 1 - (camLen - a) / (b - a);
      const k = t * t * (3 - 2 * t);
      if (Math.abs(k - raum) < 0.004) return raum;
      raum = k;
      schreiben(0, false);
      return raum;
    },
    get space() { return raum; },
    /** Himmel einmal neu malen (Startbild, Wiedereinhänger, visibilitychange). */
    repaint() { schreiben(0, true); },
    setMinutes(m) { P.minutes = Math.max(0.5, m); },
    setPhase(p) { P.phase = ((p % 1) + 1) % 1; schreiben(0, true); },
    update(dt) {
      if (!P.on) return false;
      P.phase = (P.phase + dt / (P.minutes * 60)) % 1;
      schreiben(dt, false);
      return true;
    },
    /** Der Himmel-Farbton der Stimmung. `null` = wie das Preset. Löst sofort ein Neuzeichnen aus,
     *  damit eine Umschaltung nicht auf den nächsten Drossel-Takt warten muss. */
    /** `grad` ist ein VERSATZ (positiv = wärmer, negativ = kälter), nicht ein Zielton. */
    setHimmelTon(grad) { himmelTon = grad == null ? null : grad; versatzJetzt = himmelTon || 0;
                         schreiben(0, true); },
    /** v11 · `fogScale` wie Game.ts (1 Desktop, 0,7 Mobil) — EIN Faktor auf near und far, der Zyklus schreibt ihn. */
    setFogScale(v) { fogScale = Math.max(0.1, v || 1); schreiben(0, true); },
    get fogScale() { return fogScale; },
    get himmelTon() { return himmelTon; },
    /** Was der Nebel tragen MUSS: Preset-Nebel plus Stimmungsdrehung. Die Abnahme vergleicht
     *  gegen diesen Wert — nicht gegen das rohe Preset. Das war beim Wasser der Fehler, der die
     *  Zeile in beide Richtungen blind gemacht hat (§05u). */
    nebelSoll() {
      const c = new THREE.Color().copy(mix.fogColor);
      return tonVersetzen(c, versatzJetzt).getHex(THREE.SRGBColorSpace);
    },
    /** ⚠ **Die Zahl, die den ersten Anlauf hätte auffliegen lassen.** `rohSpanne` ist die
     *  Farbton-Spanne, die das Preset gestaltet hat (Abend ≈ 154°, Tag ≈ 158°), `neuSpanne` die
     *  nach der Drehung. Bei einer ZUWEISUNG fällt die zweite auf ~0° — der Himmel wird einfarbig,
     *  und die alte Abnahme sah es nicht, weil sie nur die Nebelfarbe prüfte.
     *  *Ein Instrument muss das Paar messen, um das es geht* (§05u) — hier: gestaltete Spanne
     *  gegen erhaltene Spanne, nicht Nebel gegen Nebel. */
    verlaufSpanne() {
      return { roh: +spanne(spanneRoh).toFixed(1), neu: +spanne(spanneNeu).toFixed(1),
               versatz: +versatzJetzt.toFixed(1), stufen: spanneNeu.length };
    },
    report() { return { an: P.on, phase: +P.phase.toFixed(3), zeit: this.label, minuten: P.minutes,
                        himmelTon: himmelTon }; },
  };
}
