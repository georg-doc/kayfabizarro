/* KFB Plant Prop Lab · Topfmuster: REGISTER-GRAMMATIK (v2, S19)
   ============================================================================

   Der Befund aus der Sichtung von S18: das Muster war ein RASTER. Ein Raster hat keine
   Absicht — es füllt eine Fläche gleichmässig, wird bei jeder Dichte über 8 körnig, liest
   aus drei Metern als Textur statt als Form, und zwei Töpfe nebeneinander sehen aus wie
   dieselbe Tapete in zwei Farben. Genau das Gegenteil von dem, was gefordert war:
   grossflächig, klar lesbar, aus einem Guss, und trotzdem je Kobo eigen.

   Die Antwort ist keine zehnte Musterfamilie, sondern eine GRAMMATIK. Mexikanische
   Talavera, Oaxaca-Barro und Herrimans Coconino-Kulissen teilen dieselbe Bauregel, und
   sie ist älter als alle drei: ein Gefäss wird in waagerechte REGISTER geteilt, und jedes
   Register trägt genau EIN Motiv, das um den Umfang läuft. Nicht alle Register sind gleich
   laut. Eines führt, die anderen begleiten. Das ist der ganze Trick, und er ist der Grund,
   warum handbemalte Keramik aus einem Guss wirkt, obwohl kein Topf dem anderen gleicht.

   Vier Regeln, aus denen alles folgt — `composeBands()` setzt sie durch, nicht der Zufall:

     1  LESERICHTUNG.  Von unten nach oben: Fuss (schmal, Rahmenfarbe) → Hauptregister
        (das grosse Motiv, 35–50 % der Höhe) → Begleitregister → Kranz (schmales Ornament
        unter dem Rand). Kein Topf beginnt mit dem lauten Motiv am Fuss.
     2  EINE LAUTE STIMME.  Höchstens ein Register trägt ein lautes Glyph (Punkt, Raute,
        Zahn, Schuppe, Kreuzblume). Alles andere ist leise (Greca, Welle, Doppellinie,
        Balken, leer). Zwei laute Register nebeneinander sind der Grund, warum generierte
        Muster billig aussehen.
     3  WENIGE, GROSSE FORMEN.  Das laute Register zählt 3–10 Motive um den Umfang, nie
        mehr. Leise Register dürfen dichter laufen, weil sie als Linie lesen, nicht als Form.
     4  JEDES GLYPH HAT KONTUR.  Aus der Rahmenfarbe, in derselben Stärke über alle
        Register. Die einheitliche Strichstärke ist das, was „aus einem Guss" erzeugt —
        stärker als jede Farbwahl.

   NON-REPETITIV OHNE STILBRUCH. Zwei Schrauben, beide gemessen begrenzt:
   · `wobble` verzieht Registergrenzen und Glyphenmitte mit einer langsamen Sinuswelle —
     die Hand, die den Pinsel führt. Bei 0 ist der Topf Maschine, bei 1 betrunken; der
     brauchbare Bereich liegt bei 0,25–0,5, deshalb ist das der Startwert.
   · `variance` würfelt JE GLYPH-INSTANZ (Hash über Umfangsindex × Register): Grösse ±,
     Höhenversatz, und mit kleiner Wahrscheinlichkeit ein Farbtausch Motiv↔Akzent. Das
     Muster bleibt dasselbe Muster, aber keine zwei Nachbarn sind identisch.

   BIOM-BINDUNG. Die Palette ist nicht mehr frei gewählt, sondern aus einem Biom gezogen:
   `paletteForBiome('wueste', seed)` liefert deterministisch eine der dort erlaubten
   Paletten. Damit kann ein Level-Bauer „Wüste" sagen statt zwölf Paletten zu sortieren,
   und derselbe Seed liefert in derselben Zone denselben Topf.

   NICHT-DESTRUKTIV heisst hier wörtlich: `instance()` klont die Szene, aber three teilt
   die MATERIALIEN zwischen Klonen. Wer ohne `material.clone()` färbt, färbt jeden Topf in
   jeder Szene mit — inklusive der Quelle im Cache. Darum klont `stylePot()` vor jedem
   Eingriff.

   INNENSEITE IST ERDE (unverändert aus S18, weil gemessen richtig): das Urteil fällt am
   Normalenvektor plus gemessenem Innenradius, nicht an einer geratenen Höhenschwelle. */
import * as THREE from 'three';

/* ---------------- Farbklima · eine Regel, zwölf Ausprägungen ----------------
   Der erste Bau hatte hier den Fehler, der die ganze Linie gekostet hat: die Rollen waren
   frei belegt, also hatten Terrakotta, Kobalt und Tinte einen DUNKLEN Grund mit einem fast
   ebenso dunklen Motiv darauf. Das Ergebnis liest aus drei Metern als brauner Fleck, egal
   wie gut die Grammatik darüber ist.

   Glasierte Keramik funktioniert andersherum, und zwar in Puebla wie in Oaxaca wie in
   Herrimans Coconino: HELLER GRUND, gesättigtes Motiv darauf, eine wärmere oder kältere
   dritte Stimme als Akzent, und ein fast schwarzer Rahmen für Kontur, Oberkante und
   Fussschatten. Das ist keine Vorliebe, das ist die Bedingung dafür, dass eine gemalte Form
   überhaupt Form bleibt. Alle zwölf Paletten folgen ihr; sie unterscheiden sich in Harmonie
   und Temperatur, nicht im Aufbau. Wer einen dunklen Topf braucht, kippt die Rollen mit
   `invert` — eine Umkehrung der Linie, kein Bruch mit ihr. */
export const PALETTES = {
  terracotta: { label: 'Terrakotta · analog warm', harmony: 'analog',
    colors: ['#efd3b0', '#c1502a', '#e0913c', '#46220f'], soil: '#8a6144' },
  talavera: { label: 'Talavera · komplementär blau/gold', harmony: 'komplementär',
    colors: ['#f6efe3', '#2d5aa8', '#e8a93c', '#14264a'], soil: '#7a5f4a' },
  chili: { label: 'Chili · analog rot/orange', harmony: 'analog',
    colors: ['#ffe0b0', '#d43f22', '#f2a83c', '#5c1a16'], soil: '#8c5c42' },
  jade: { label: 'Jade · analog grün/mint', harmony: 'analog',
    colors: ['#eaf3e4', '#2f8f70', '#e0a92f', '#17403a'], soil: '#77603f' },
  cobalt: { label: 'Kobalt · komplementär blau/gelb', harmony: 'komplementär',
    colors: ['#e8ecf7', '#2b3f9a', '#f2cf5c', '#0e1633'], soil: '#6b5f62' },
  clay: { label: 'Ton · Triade ocker/braun', harmony: 'triade',
    colors: ['#f2ddb4', '#8a4a1e', '#d8a559', '#2b2018'], soil: '#7d6042' },
  melon: { label: 'Melone · Triade koralle/türkis', harmony: 'triade',
    colors: ['#ffe7cf', '#d9482f', '#2fa5a0', '#6e2331'], soil: '#8a5f4b' },
  orchid: { label: 'Orchidee · komplementär violett/limette', harmony: 'komplementär',
    colors: ['#f5eaf6', '#7a4a9e', '#b6cc3c', '#331c4a'], soil: '#736070' },
  dune: { label: 'Düne · monochrom Sand', harmony: 'monochrom',
    colors: ['#f6e3c4', '#9c6a3c', '#e8a43c', '#5b3a22'], soil: '#96704c' },
  ink: { label: 'Tinte · Split marine/koralle', harmony: 'split',
    colors: ['#e4ebf2', '#24467a', '#f0603c', '#0b1422'], soil: '#5f646f' },
  lagoon: { label: 'Lagune · analog türkis/blau', harmony: 'analog',
    colors: ['#eaf4e6', '#2f8fa5', '#efc24a', '#10353f'], soil: '#68705f' },
  pumpkin: { label: 'Kürbis · komplementär orange/violett', harmony: 'komplementär',
    colors: ['#ffe6c4', '#c65c0d', '#6d4a8f', '#63290d'], soil: '#8d6242' }
};
/* Messung statt Zusicherung: relative Leuchtdichte nach WCAG, daraus das Kontrastverhältnis
   Grund↔Motiv. Die Design-Linie verlangt >= 2.6; der Bericht führt den Wert mit, damit eine
   neue Palette am Zahlenwert scheitert und nicht erst am Auge des Reviewers. */
const srgbLin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
export function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = srgbLin(((n >> 16) & 255) / 255), g = srgbLin(((n >> 8) & 255) / 255), b = srgbLin((n & 255) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrastRatio(a, b) {
  const la = luminance(a), lb = luminance(b);
  return +(((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05))).toFixed(2);
}

export const PALETTE_NAMES = Object.keys(PALETTES);
export const HARMONIES = ['analog', 'komplementär', 'triade', 'split', 'monochrom'];
export const roles = (id) => {
  const P = PALETTES[id] || PALETTES.terracotta;
  return { body: P.colors[0], motif: P.colors[1], accent: P.colors[2], frame: P.colors[3], soil: P.soil, harmony: P.harmony };
};

/* ---------------- Biome · Palette als Zonen-Entscheidung, nicht als Geschmack ----------------
   Ein Biom nennt die Paletten, die dort vorkommen dürfen. Ein Seed zieht daraus
   deterministisch. So ist „alle Töpfe dieser Zone gehören zusammen" eine Eigenschaft des
   Datenmodells und nicht der Disziplin des Bauers. */
export const BIOMES = {
  frei: { label: 'frei · alle Paletten', palettes: PALETTE_NAMES },
  wueste: { label: 'Wüste · Sand, Ton, Chili', palettes: ['dune', 'terracotta', 'clay', 'chili', 'pumpkin'] },
  dschungel: { label: 'Dschungel · Jade, Lagune, Melone', palettes: ['jade', 'lagoon', 'melon', 'orchid'] },
  kueste: { label: 'Küste · Talavera, Lagune, Tinte', palettes: ['talavera', 'lagoon', 'cobalt', 'ink'] },
  markt: { label: 'Markt · laut und bunt', palettes: ['talavera', 'chili', 'melon', 'pumpkin', 'orchid'] },
  hochland: { label: 'Hochland · Kobalt, Ton, Tinte', palettes: ['cobalt', 'clay', 'ink', 'terracotta'] },
  nacht: { label: 'Nacht · tiefe Töne', palettes: ['ink', 'cobalt', 'orchid', 'jade'] }
};
export const BIOME_NAMES = Object.keys(BIOMES);
export function paletteForBiome(biome, seed = 1) {
  const B = BIOMES[biome] || BIOMES.frei;
  const r = mulberry32((seed | 0) ^ 0x9e37);
  return B.palettes[Math.floor(r() * B.palettes.length) % B.palettes.length];
}

/* ---------------- Glyphen-Alphabet ----------------
   Zehn Zeichen, mehr braucht kein Topf. `voice` ist die Regel, nicht die Dekoration:
   laute Glyphen tragen Fläche, leise tragen Linie. Die Grammatik lässt genau eine laute
   Stimme zu — siehe Regel 2 im Kopfkommentar. */
export const GLYPHS = {
  leer:        { code: 0, label: 'leer · ruhige Fläche', voice: 'leise', countK: 1.0 },
  punkt:       { code: 1, label: 'Punkt', voice: 'laut', countK: 1.0 },
  raute:       { code: 2, label: 'Raute', voice: 'laut', countK: 1.0 },
  zahn:        { code: 3, label: 'Zahn · Dreieck', voice: 'laut', countK: 1.15 },
  schuppe:     { code: 4, label: 'Schuppe · Bogen', voice: 'laut', countK: 1.1 },
  kreuzblume:  { code: 5, label: 'Kreuzblume · Talavera', voice: 'laut', countK: 0.8 },
  balken:      { code: 6, label: 'Balken · senkrecht', voice: 'leise', countK: 1.10 },
  greca:       { code: 7, label: 'Greca · Stufenmäander', voice: 'leise', countK: 0.95 },
  welle:       { code: 8, label: 'Welle', voice: 'leise', countK: 0.90 },
  doppellinie: { code: 9, label: 'Doppellinie', voice: 'leise', countK: 0.70 }
};
export const GLYPH_NAMES = Object.keys(GLYPHS);
export const LOUD = GLYPH_NAMES.filter((g) => GLYPHS[g].voice === 'laut');
export const QUIET = GLYPH_NAMES.filter((g) => GLYPHS[g].voice === 'leise');

/* Altbestand: die neun S18-Familien bleiben als Namen gültig und übersetzen in ein
   Leitmotiv. Alte Presets (PROOF_DEFS, STUDY) bauen damit weiter, nur eben in der neuen
   Grammatik statt im Raster. */
export const FAMILIES = {
  stripes: { label: 'Streifen → Balken', code: 0, leitmotif: 'balken' },
  bands: { label: 'Bänder → Welle', code: 1, leitmotif: 'welle' },
  dots: { label: 'Punkte', code: 2, leitmotif: 'punkt' },
  diamonds: { label: 'Rauten', code: 3, leitmotif: 'raute' },
  zigzag: { label: 'Zickzack → Zahn', code: 4, leitmotif: 'zahn' },
  scallops: { label: 'Schuppen', code: 5, leitmotif: 'schuppe' },
  sunray: { label: 'Sonne → Kreuzblume', code: 6, leitmotif: 'kreuzblume' },
  blocks: { label: 'Blöcke → Greca', code: 7, leitmotif: 'greca' },
  plain: { label: 'einfarbig', code: 8, leitmotif: 'leer' }
};
export const FAMILY_NAMES = Object.keys(FAMILIES);

/* Grenzen des Cartoon-Massstabs — eine Grenze, kein Vorschlag. Über 10 Motiven im
   Hauptregister zerfällt die Form in Körnung, unter 3 ist es kein Muster mehr. */
export const CELL_LIMITS = { loudMin: 3, loudMax: 10, quietMin: 4, quietMax: 16, regMin: 2, regMax: 5 };
export const MAX_REGISTERS = 6;   // Shader-Feld, inkl. Fussband

export const defaultStyle = () => ({
  biome: 'frei', paletteId: 'terracotta', invert: false,
  leitmotif: 'auto', registers: 0,      // 0 = aus dem Seed
  family: 'bands',                       // Altbestand, wirkt nur wenn leitmotif === 'family'
  projection: 'cyl',
  density: 7, bands: 4, phase: 0,
  accent: 0.25, outline: 0.55,
  wobble: 0.35, variance: 0.45,
  rim: true, soil: true, saucer: 'inherit', seed: 1
});

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (r, arr) => arr[Math.floor(r() * arr.length) % arr.length];

/* ---------------- Die Grammatik ----------------
   Reines JS, keine three-Abhängigkeit, damit der Registerstapel im Bericht steht und
   prüfbar ist, bevor ein Pixel gerendert wird. Rückgabe ist die Partitur des Topfes. */
export function composeBands(style, measure = {}) {
  const S = Object.assign(defaultStyle(), style || {});
  const aspect = measure.aspect || 2.2;              // Umfang / Höhe, gemessen
  const r = mulberry32(((S.seed | 0) * 2654435761) >>> 0);

  /* Wie viele Register? Flache, breite Töpfe vertragen weniger — das ist eine Folge der
     GEMESSENEN Proportion, nicht eine Vorliebe. Bei aspect > 4 ist jedes Register unter
     einem Viertel der Höhe schmaler als ein Glyph breit. */
  const hardMax = aspect > 8.0 ? 2 : (aspect > 4.2 ? 3 : (aspect > 3.0 ? 4 : CELL_LIMITS.regMax));
  let n = S.registers > 0 ? S.registers : 2 + Math.floor(r() * 3);
  n = Math.max(CELL_LIMITS.regMin, Math.min(hardMax, n));

  /* Leitmotiv: die eine laute Stimme. Auflösungsreihenfolge, und sie muss am ROHEN
     Argument hängen: `defaultStyle()` setzt selbst `family: 'bands'` und
     `leitmotif: 'auto'`, also ist nach dem Object.assign nicht mehr zu erkennen, ob der
     AUFRUFER eine Familie genannt hat. Genau daran sind die zwölf Presets im Erstbeweis
     durchgefallen: sie tragen nur `family`, und ihre Angabe wurde stillschweigend
     verworfen — Beweis 1 hiess „Pack-Optik" und zeigte einen vollgemusterten Topf.
       1  leitmotif explizit (≠ 'auto')
       2  family vom Aufrufer → Altbestandsübersetzung
       3  aus dem Seed */
  const rawLead = style && style.leitmotif;
  const rawFam = style && style.family;
  let lead = (rawLead && rawLead !== 'auto' && rawLead !== 'family') ? rawLead
    : (rawFam ? (FAMILIES[rawFam]?.leitmotif || 'welle')
      : (rawLead === 'family' ? (FAMILIES[S.family]?.leitmotif || 'welle') : null));
  if (!lead || lead === 'auto') lead = pick(r, LOUD);
  if (!GLYPHS[lead]) lead = 'raute';
  const leadIsLoud = GLYPHS[lead].voice === 'laut';

  /* `leer` als Leitmotiv heisst UNBEMALT — das ist die Pack-Optik, mit der Beweis 1 die
     Quelle zeigt. Ein Stapel aus Begleitbändern wäre hier kein Sonderfall, sondern eine
     falsche Auskunft: der Topf soll nichts tragen. Ein Register, ein leeres Glyph. */
  if (lead === 'leer') {
    const G0 = GLYPHS.leer;
    return {
      bands: [{ i: 0, glyph: 'leer', label: G0.label, voice: 'leise', lead: false, code: 0,
        vBot: 0, vTop: 1, count: 1, fill: 0, phase: 0, sizeK: 1, jitter: 0 }],
      lead, leadIndex: -1, registers: 1, aspect, hardMax, seed: S.seed | 0, leadCount: 0,
      line: '▭ unbemalt'
    };
  }

  /* Position der lauten Stimme: nie ganz unten (Regel 1). Bei 2 Registern oben, sonst
     Mitte oder oben — zwei Drittel der Töpfe tragen sie mittig, das ist die klassische
     Gefässgliederung. */
  const leadIdx = n <= 2 ? 1 : (r() < 0.66 ? Math.max(1, n - 2) : n - 1);

  /* Begleitung ziehen, ohne Wiederholung und ohne zweite laute Stimme (Regel 2). */
  const quietPool = QUIET.slice();
  const used = new Set([lead]);
  const drawQuiet = () => {
    const free = quietPool.filter((g) => !used.has(g));
    const g = free.length ? pick(r, free) : pick(r, quietPool);
    used.add(g);
    return g;
  };

  /* Höhenverteilung: die Führung bekommt das dreifache Gewicht (ein leises Leitmotiv das
     knapp doppelte, weil eine Linie weniger Fläche braucht als eine Form), das Fussband ein
     halbes. Danach normalisiert — so führt sie bei 2 wie bei 5 Registern.

     Das Leitmotiv besetzt seinen Platz UNABHÄNGIG von der Stimme. Der erste Bau hat es nur
     gesetzt, wenn es laut war — dadurch fielen `bands`→Welle und `blocks`→Greca still aus
     dem Stapel und die Begleitung schloss sie über `used` sogar aus. Die Bildunterschrift
     sagte „Bänder", der Topf zeigte Doppellinien. */
  const specs = [];
  for (let i = 0; i < n; i++) {
    const atLead = i === leadIdx;
    let g;
    if (atLead) g = lead;
    else if (i === 0) { g = r() < 0.5 ? 'leer' : 'doppellinie'; used.add(g); }
    else g = drawQuiet();
    specs.push({
      glyph: g, lead: atLead && leadIsLoud, voiceLead: atLead,
      weight: atLead ? (leadIsLoud ? 3.0 : 1.8) : (i === 0 ? 0.65 : 0.85 + r() * 0.5)
    });
  }
  const total = specs.reduce((s, x) => s + x.weight, 0);

  /* Zählung um den Umfang. Der Dichteregler ist der Maßstab, nicht die Frequenz: er
     verschiebt beide Klassen gemeinsam, die Deckel halten den Cartoon-Massstab. */
  const dens = Math.max(3, Math.min(14, S.density || 7));
  const bands = [];
  /* Spannen zuerst, Teilung danach — die Begleitung braucht die Teilung der lauten Stimme,
     bevor sie ihre eigene bestimmen kann. */
  const spans = [];
  let acc = 0;
  for (const sp of specs) { spans.push([acc / total, (acc + sp.weight) / total]); acc += sp.weight; }

  /* DIE TEILUNG DER LAUTEN STIMME ist der Taktgeber des ganzen Topfes. Sie folgt der
     gemessenen Proportion IHRES Bandes: quadratische Zellen sind der Grund, warum eine
     Raute eine Raute bleibt und nicht zum Zickzackstreifen zerläuft. */
  const k = dens / 7;
  const leadSpanIdx = specs.findIndex((sp) => sp.voiceLead);
  const leadSpan = spans[leadSpanIdx >= 0 ? leadSpanIdx : Math.min(1, spans.length - 1)];
  const leadH = Math.max(1e-3, (leadSpan[1] - leadSpan[0]) * (measure.h || 1));
  const leadSquare = (measure.circ || 4) / leadH;
  const leadCount = Math.max(CELL_LIMITS.loudMin, Math.min(CELL_LIMITS.loudMax,
    Math.round(leadSquare * k * 0.85) || CELL_LIMITS.loudMin));

  for (let i = 0; i < specs.length; i++) {
    const sp = specs[i];
    const G = GLYPHS[sp.glyph];
    const [vBot, vTop] = spans[i];
    /* DIE BEGLEITUNG ZÄHLT GEGEN DIE LAUTE STIMME, NICHT GEGEN SICH SELBST. Das war der
       Fehler im ersten Bau: ein schmales Kranzband hat eine winzige eigene Bandhöhe, also
       lieferte die Quadrat-Rechnung dort 19–22 Wiederholungen und sass dauerhaft am Deckel.
       Der Maßstabsregler bewegte danach nur noch das Hauptregister, während das Ornament
       unten hochfrequent blieb — genau die Körnung, gegen die diese Linie gebaut ist.
       Ein Begleitornament ist die doppelte bis zweieinhalbfache Teilung der Führung. */
    const base = sp.lead ? leadCount : leadCount * 1.9;
    const lim = sp.lead
      ? [CELL_LIMITS.loudMin, CELL_LIMITS.loudMax]
      : [CELL_LIMITS.quietMin, CELL_LIMITS.quietMax];
    const count = Math.max(lim[0], Math.min(lim[1], Math.round(base * G.countK) || lim[0]));
    /* Farbrolle: die laute Stimme ist Motiv auf Körper. Leise Register wechseln zwischen
       Motiv und Akzent, damit der Stapel nicht zweifarbig flach wird. */
    const fill = sp.lead ? 1 : (sp.glyph === 'leer' ? 0 : (r() < 0.35 ? 2 : 1));
    bands.push({
      i, glyph: sp.glyph, label: G.label, voice: G.voice, lead: sp.lead,
      code: G.code, vBot: +vBot.toFixed(4), vTop: +vTop.toFixed(4),
      count, fill, phase: +(r()).toFixed(3),
      sizeK: sp.lead ? 1.0 : 0.82 + r() * 0.22,
      jitter: +(S.variance * (sp.lead ? 0.7 : 1.0)).toFixed(3)
    });
  }
  return {
    bands, lead, leadIndex: leadIdx, registers: bands.length,
    aspect, hardMax, seed: S.seed | 0,
    leadCount,
    line: bands.map((b) => `${b.lead ? '▰' : '▭'}${b.glyph}${b.glyph === 'leer' ? '' : '×' + b.count}`).join(' ')
  };
}

/* ---------------- Messung: ist die UV-Abwicklung überhaupt zylindrisch? ---------------- */
export function probeUV(mesh) {
  const g = mesh.geometry;
  const pos = g.attributes.position, uv = g.attributes.uv;
  if (!uv) return { ok: false, note: 'kein uv-Attribut' };
  const n = pos.count;
  let uMin = 1e9, uMax = -1e9, vMin = 1e9, vMax = -1e9;
  const ang = [], hgt = [], us = [], vs = [];
  for (let i = 0; i < n; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const u = uv.getX(i), v = uv.getY(i);
    if (u < uMin) uMin = u; if (u > uMax) uMax = u;
    if (v < vMin) vMin = v; if (v > vMax) vMax = v;
    ang.push(Math.atan2(z, x) / (Math.PI * 2) + 0.5); hgt.push(y);
    us.push(u); vs.push(v);
  }
  const corr = (a, b) => {
    const m = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;
    const ma = m(a), mb = m(b);
    let sa = 0, sb = 0, sab = 0;
    for (let i = 0; i < a.length; i++) { const da = a[i] - ma, db = b[i] - mb; sa += da * da; sb += db * db; sab += da * db; }
    return (sa && sb) ? sab / Math.sqrt(sa * sb) : 0;
  };
  const rCirc = Math.max(Math.abs(corr(ang, us)), Math.abs(corr(ang, vs)));
  const rHeight = Math.max(Math.abs(corr(hgt, vs)), Math.abs(corr(hgt, us)));
  return {
    ok: true, verts: n,
    uSpan: +(uMax - uMin).toFixed(3), vSpan: +(vMax - vMin).toFixed(3),
    rCirc: +rCirc.toFixed(3), rHeight: +rHeight.toFixed(3),
    cylindrical: rCirc > 0.9 && rHeight > 0.9
  };
}

/* ---------------- Weg 1 · CanvasTexture auf den Quell-UVs ----------------
   Zeichnet DENSELBEN Registerstapel wie der Shader, damit das Vergleichsbild ein
   Vergleich ist und kein zweiter Entwurf. */
export function makeCanvasTexture(style, win, comp, size = 512) {
  const P = PALETTES[style.paletteId] || PALETTES.terracotta;
  const [cA, cB, cC, cR] = P.colors;
  const inv = !!style.invert;
  const roleCol = (i) => [inv ? cB : cA, inv ? cA : cB, cC, cR][i | 0] || cB;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d');
  x.fillStyle = inv ? cB : cA; x.fillRect(0, 0, size, size);
  const w = win || [0, 1, 0, 1];
  const X0 = w[0] * size, X1 = w[1] * size, Y0 = (1 - w[3]) * size, Y1 = (1 - w[2]) * size;
  const W = Math.max(2, X1 - X0), H = Math.max(2, Y1 - Y0);
  x.save();
  x.beginPath(); x.rect(X0, Y0, W, H); x.clip();
  x.fillStyle = inv ? cB : cA; x.fillRect(X0, Y0, W, H);
  const lw = Math.max(1.5, Math.min(W, H) * 0.012 * (0.4 + (style.outline ?? 0.55)));
  x.lineJoin = 'round'; x.lineCap = 'round';

  for (const b of (comp?.bands || [])) {
    const yTop = Y0 + (1 - b.vTop) * H, yBot = Y0 + (1 - b.vBot) * H;
    const bh = Math.max(2, yBot - yTop);
    const n = Math.max(1, b.count);
    const cw = W / n;
    x.fillStyle = roleCol(b.fill);
    x.strokeStyle = cR; x.lineWidth = lw;
    if (b.glyph !== 'leer') {
      for (let i = 0; i < n; i++) {
        const cx = X0 + (i + 0.5 + (b.phase % 1)) * cw, cy = yTop + bh / 2;
        drawGlyph(x, b.glyph, cx, cy, cw * 0.86 * b.sizeK, bh * 0.82 * b.sizeK);
        x.fill(); x.stroke();
      }
    }
    /* Registertrenner — dieselbe Strichstärke wie die Kontur, das hält den Guss. */
    x.strokeStyle = cR; x.lineWidth = lw * 0.9;
    x.beginPath(); x.moveTo(X0, yBot); x.lineTo(X1, yBot); x.stroke();
  }
  if (style.rim) { x.fillStyle = cR; x.fillRect(X0, Y0, W, Math.max(2, H * 0.10)); }
  x.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.flipY = true;
  return t;
}

function drawGlyph(x, g, cx, cy, w, h) {
  const a = w / 2, b = h / 2;
  x.beginPath();
  if (g === 'punkt') { x.ellipse(cx, cy, a * 0.78, b * 0.78, 0, 0, Math.PI * 2); }
  else if (g === 'raute') { x.moveTo(cx, cy - b * 0.92); x.lineTo(cx + a * 0.92, cy); x.lineTo(cx, cy + b * 0.92); x.lineTo(cx - a * 0.92, cy); x.closePath(); }
  else if (g === 'zahn') { x.moveTo(cx, cy - b * 0.92); x.lineTo(cx + a * 0.88, cy + b * 0.82); x.lineTo(cx - a * 0.88, cy + b * 0.82); x.closePath(); }
  else if (g === 'schuppe') { x.arc(cx, cy + b * 0.35, Math.min(a, b) * 1.05, Math.PI, 0); x.closePath(); }
  else if (g === 'kreuzblume') {
    const r = Math.min(a, b) * 0.46;
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) { x.moveTo(cx + dx * r * 1.25 + r, cy + dy * r * 1.25); x.arc(cx + dx * r * 1.25, cy + dy * r * 1.25, r, 0, Math.PI * 2); }
    x.moveTo(cx + r * 0.8, cy); x.arc(cx, cy, r * 0.8, 0, Math.PI * 2);
  }
  else if (g === 'balken') { x.rect(cx - a * 0.30, cy - b * 0.92, a * 0.60, b * 1.84); }
  else if (g === 'greca') {
    const t = Math.min(a, b) * 0.30;
    x.rect(cx - a * 0.9, cy + b * 0.3, a * 1.8, t);
    x.rect(cx + a * 0.3, cy - b * 0.6, t, b * 0.9);
    x.rect(cx - a * 0.9, cy - b * 0.8, a * 1.2, t);
  }
  else if (g === 'welle') {
    const t = b * 0.30;
    x.moveTo(cx - a, cy + t);
    x.quadraticCurveTo(cx - a * 0.5, cy - b * 0.7, cx, cy + t);
    x.quadraticCurveTo(cx + a * 0.5, cy + b * 0.9, cx + a, cy + t);
    x.lineTo(cx + a, cy + t + t); x.quadraticCurveTo(cx + a * 0.5, cy + b * 0.9 + t, cx, cy + t + t);
    x.quadraticCurveTo(cx - a * 0.5, cy - b * 0.7 + t, cx - a, cy + t + t); x.closePath();
  }
  else if (g === 'doppellinie') { const t = b * 0.22; x.rect(cx - a, cy - b * 0.5, a * 2, t); x.rect(cx - a, cy + b * 0.28, a * 2, t); }
}

/* ---------------- Weg 2 · analytisch zylindrisch (Shader) ---------------- */
const VERT_HEAD = 'varying vec3 vKfbLocal;\nvarying vec3 vKfbNrm;\n';
const VERT_BODY = 'vKfbLocal = position;\nvKfbNrm = normal;\n#include <begin_vertex>';
const FRAG_HEAD = `varying vec3 vKfbLocal;
varying vec3 vKfbNrm;
uniform vec3 uColA; uniform vec3 uColB; uniform vec3 uColC; uniform vec3 uColR; uniform vec3 uColS;
uniform float uPhase; uniform float uAccent; uniform float uY0; uniform float uY1;
uniform float uRim; uniform float uOutline; uniform float uSoil; uniform float uGrain;
uniform float uInnerR; uniform float uWobble; uniform float uVariance; uniform float uSeedP;
uniform float uCirc; uniform float uHgt; uniform float uRegN;
uniform vec4 uRegA[6];   /* vBot, vTop, glyphCode, count      */
uniform vec4 uRegB[6];   /* phase, fillRole, sizeK, jitter    */
float kfbHash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
uniform float uInvert;
/* Umkehrung tauscht NUR Grund und Motiv. Akzent und Rahmen bleiben, damit die Kontur und
   die dritte Stimme über beide Varianten identisch lesen. */
vec3 kfbGround(){ return mix(uColA, uColB, uInvert); }
vec3 kfbRole(float r){ return r < 0.5 ? mix(uColA, uColB, uInvert) : (r < 1.5 ? mix(uColB, uColA, uInvert) : (r < 2.5 ? uColC : uColR)); }
/* Normiertes Glyphfeld: d < 1 ist innen, d == 1 ist die Kontur. Eine Konvention für alle
   zehn Zeichen — dadurch ist die Strichstärke über den ganzen Topf identisch, und das ist
   es, was „aus einem Guss" erzeugt. */
float kfbGlyph(float g, vec2 p) {
  vec2 q = abs(p);
  if (g < 0.5)  return 9.0;                                        /* leer      */
  if (g < 1.5)  return length(p) / 0.40;                           /* Punkt     */
  if (g < 2.5)  return (q.x + q.y) / 0.50;                         /* Raute     */
  if (g < 3.5)  return max((q.x * 1.05 + p.y + 0.26) / 0.62,       /* Zahn      */
                           (-p.y) / 0.42);
  if (g < 4.5)  return max(length(vec2(p.x, min(p.y + 0.30, 0.0))) / 0.46,
                           (-p.y - 0.30) / 0.14);                  /* Schuppe   */
  if (g < 5.5)  return min(min(length(q - vec2(0.27, 0.0)) / 0.21, /* Kreuzblume*/
                               length(q - vec2(0.0, 0.27)) / 0.21),
                           length(p) / 0.19);
  if (g < 6.5)  return max(q.x / 0.19, q.y / 0.48);                /* Balken    */
  if (g < 7.5)  return min(min(max(q.x / 0.46, abs(p.y + 0.30) / 0.09),   /* Greca */
                               max(abs(p.x - 0.26) / 0.09, abs(p.y - 0.02) / 0.34)),
                           max(abs(p.x + 0.12) / 0.30, abs(p.y - 0.30) / 0.09));
  if (g < 8.5)  return abs(p.y - 0.22 * sin((p.x + 0.5) * 6.28318)) / 0.13;  /* Welle */
  return min(abs(p.y - 0.22), abs(p.y + 0.22)) / 0.075;            /* Doppellinie */
}
`;
/* Der Schnitt liegt hinter <map_fragment>: dort steht in diffuseColor der Atlas-Texel.
   Seine LUMINANZ bleibt als Schattierung stehen, die Farbe kommt aus der Palette — so
   behält der Topf seine gebackene Plastik und die Quelltextur wird nicht überschrieben. */
const FRAG_BODY = `#include <map_fragment>
{
  vec2 pxz = vec2(vKfbLocal.x, vKfbLocal.z);
  vec2 nxz = vec2(vKfbNrm.x, vKfbNrm.z);
  float pl = length(pxz), nl = length(nxz);
  float radial = (pl > 1e-4 && nl > 1e-4) ? dot(pxz / pl, nxz / nl) : 0.0;
  float ang = atan(vKfbLocal.z, vKfbLocal.x) / 6.28318530718 + 0.5;
  float v0 = clamp((vKfbLocal.y - uY0) / max(uY1 - uY0, 1e-4), 0.0, 1.0);
  float lum = clamp(dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722)), 0.0, 1.0);

  /* Handzittern: eine langsame Welle auf beiden Achsen. Der Pinsel läuft nicht gerade,
     und genau das unterscheidet bemalte Keramik von bedruckter Folie. */
  float wob = uWobble;
  float u = fract(ang + uPhase + sin(v0 * 11.0 + uSeedP * 6.28318) * wob * 0.012);
  float v = clamp(v0 + sin(ang * 6.28318 * 2.0 + uSeedP * 4.0) * wob * 0.010, 0.0, 1.0);

  /* --- Registerstapel abtasten --- */
  float d = 9.0, fillR = 0.0, jit = 0.0, sepd = 9.0, inBand = 0.0;
  float swap = 0.0;
  for (int i = 0; i < 6; i++) {
    if (float(i) >= uRegN) break;
    vec4 A = uRegA[i]; vec4 B = uRegB[i];
    float wv = sin(ang * 6.28318 * 3.0 + float(i) * 2.17 + uSeedP * 5.0) * wob * 0.013;
    float vb = A.x + wv, vt = A.y + wv;
    if (i > 0) sepd = min(sepd, abs(v - vb));
    if (v >= vb && v < vt) {
      inBand = 1.0;
      float n = max(1.0, A.w);
      float fu = fract(u + B.x) * n;
      float ix = floor(fu);
      float h1 = kfbHash(vec2(ix, float(i) * 7.0 + uSeedP * 31.0));
      float h2 = kfbHash(vec2(ix * 3.0 + 11.0, float(i) + uSeedP * 17.0));
      /* Zelle quadrieren: sonst ist derselbe Punkt auf dem flachen Topf eine Ellipse. */
      float cw = uCirc / n, ch = max(vt - vb, 1e-4) * uHgt;
      float k = clamp(ch / max(cw, 1e-4), 0.45, 2.2);
      float lv = (v - vb) / max(vt - vb, 1e-4);
      /* Je-Instanz-Abweichung: Grösse, Höhenversatz, Farbtausch. Das Muster bleibt, die
         Wiederholung verschwindet. */
      /* Einpassen in die KLEINERE Zellachse. Ohne diesen Faktor ist das Seitenverhältnis
         zwar richtig, das Glyph aber zu gross fürs Band und wird an der Fuge abgeschnitten —
         aus vier Rauten wird ein Zickzackstreifen. */
      float fit = clamp(min(k, 1.0), 0.30, 1.0);
      float sz = B.z * fit * (1.0 + (h1 - 0.5) * B.w * 0.45);
      vec2 p = vec2(fract(fu) - 0.5, (lv - 0.5 + (h2 - 0.5) * B.w * 0.12) * k) / max(sz, 0.15);
      d = kfbGlyph(A.z, p);
      fillR = B.y; jit = B.w;
      swap = step(h2, uVariance * 0.22);
    }
  }
  /* Kantenglättung aus der GEMESSENEN Feldsteigung — aber hart gedeckelt. Ohne Deckel
     wächst aa auf kleinen oder schräg gesehenen Töpfen ins Unendliche, und weil die
     Konturbreite aa enthält, ersäuft dann der ganze Topf in Rahmenfarbe. Genau dieser
     Fehler war im ersten Bau drin: 0,6 erlaubt eine Kontur, die breiter ist als das Glyph. */
  float aa = clamp(fwidth(d) * 0.7, 0.008, 0.16);

  vec3 col = kfbGround();
  vec3 fc = kfbRole(fillR);
  fc = mix(fc, uColC, swap * step(0.5, fillR));
  float m = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, d);
  col = mix(col, fc, m * inBand);
  /* Kontur in EINER Stärke über alle Register — der eigentliche Träger des Stilbildes.
     Die Breite ist eine feste Zahl plus eine halbe Glättung, nicht die Glättung selbst. */
  float ow = uOutline * 0.13 + aa * 0.6;
  float ring = (1.0 - smoothstep(ow, ow + aa * 1.4, abs(d - 1.0))) * step(0.02, uOutline) * inBand;
  col = mix(col, uColR, ring * 0.92);
  /* Registertrenner: dieselbe Linie, waagerecht, nur an den INNEREN Fugen. */
  float sw = clamp(fwidth(v) * 1.1, 0.0015, 0.02) + uOutline * 0.003;
  col = mix(col, uColR, (1.0 - smoothstep(sw, sw * 2.4, sepd)) * step(0.02, uOutline) * 0.8);

  /* Rand und Fuss gehören an die WAND, nicht auf die Deckfläche — sonst legt sich ein
     schwarzer Kranz über die Topföffnung und frisst die Erde (Befund der Sichtung). */
  if (uRim > 0.5) col = mix(col, uColR, smoothstep(0.90, 0.96, v0) * (1.0 - smoothstep(0.45, 0.80, abs(vKfbNrm.y))) * 0.92);
  col = mix(col, uColR, smoothstep(0.09, 0.02, v0) * 0.5);

  /* Innen = Erde. Urteil am Normalenvektor UND am gemessenen Innenradius. */
  float innerWall = (nl > 0.25 && radial < -0.05 && v0 < 0.93) ? 1.0 : 0.0;
  float innerFloor = (vKfbNrm.y > 0.55 && pl < uInnerR && v0 < 0.93) ? 1.0 : 0.0;
  float isSoil = clamp(max(innerWall, innerFloor) * uSoil, 0.0, 1.0);
  float g1 = kfbHash(floor(pxz * uGrain));
  float g2 = kfbHash(floor(pxz * uGrain * 0.37) + 7.0);
  vec3 soil = uColS * (0.94 + 0.26 * g1 + 0.16 * g2) * mix(1.30, 1.00, innerWall);
  col = mix(col, soil, isSoil);
  diffuseColor.rgb = col * mix(0.80 + 0.36 * lum, 1.04 + 0.14 * lum, isSoil);
}`;

function measurePot(box) {
  const r = Math.max(0.01, Math.max(box.max.x - box.min.x, box.max.z - box.min.z) / 2);
  const h = Math.max(0.01, box.max.y - box.min.y);
  const circ = 2 * Math.PI * r;
  return { circ: +circ.toFixed(3), h: +h.toFixed(3), aspect: +(circ / h).toFixed(3) };
}

export function stylePot(node, style, opts = {}) {
  const S = Object.assign(defaultStyle(), style || {});
  if (S.biome && S.biome !== 'frei' && !S.paletteLocked) S.paletteId = paletteForBiome(S.biome, S.seed);
  let P = PALETTES[S.paletteId] || PALETTES.terracotta;
  node.updateMatrixWorld(true);
  const local = new THREE.Box3();
  const meshes = [];
  node.traverse((o) => { if (o.isMesh) { meshes.push(o); if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); local.union(o.geometry.boundingBox); } });
  if (!meshes.length) return { mode: 'none', report: { note: 'kein Netz' } };

  const mm = measurePot(local);
  let comp = composeBands(S, mm);
  /* Körnung an die GEMESSENE Topfgrösse binden: sonst ist die Erde in einem Riesentopf
     glatt und in einem Tischtopf Sandpapier. Ziel ≈ 34 Körner über den Durchmesser. */
  const grain = 34 / Math.max(0.02, Math.max(local.max.x - local.min.x, local.max.z - local.min.z));
  const inner = innerRadius(meshes);
  const probe = probeUV(meshes[0]);
  const handles = [];
  const soilOn = opts.soil ?? (S.soil !== false);
  const lin = (hex) => new THREE.Color(hex).convertSRGBToLinear();

  const packA = [], packB = [];
  for (let i = 0; i < MAX_REGISTERS; i++) { packA.push(new THREE.Vector4()); packB.push(new THREE.Vector4()); }
  const writeStack = (c) => {
    for (let i = 0; i < MAX_REGISTERS; i++) {
      const b = c.bands[i];
      if (b) { packA[i].set(b.vBot, b.vTop, b.code, b.count); packB[i].set(b.phase, b.fill, b.sizeK, b.jitter); }
      else { packA[i].set(1, 1, 0, 1); packB[i].set(0, 0, 1, 0); }
    }
  };
  writeStack(comp);

  for (const mesh of meshes) {
    const src = [].concat(mesh.material)[0];
    const mat = src.clone();                    // nicht-destruktiv, siehe Kopfkommentar
    mat.name = (src.name || 'mat') + '__kfb_style';
    mat.roughness = opts.roughness ?? 0.72;
    mat.metalness = 0;
    if (S.projection === 'uv') {
      mat.map = makeCanvasTexture(S, meshUVWindow(mesh), comp);
      mat.color = new THREE.Color(0xffffff);
      mat.needsUpdate = true;
      mesh.material = mat;
      handles.push({ mesh, mat, uniforms: null });
      continue;
    }
    const uniforms = {
      uColA: { value: lin(P.colors[0]) }, uColB: { value: lin(P.colors[1]) },
      uColC: { value: lin(P.colors[2]) }, uColR: { value: lin(P.colors[3]) },
      uColS: { value: lin(P.soil || '#443024') },
      uPhase: { value: S.phase }, uAccent: { value: S.accent },
      uY0: { value: local.min.y }, uY1: { value: local.max.y },
      uRim: { value: S.rim ? 1 : 0 }, uOutline: { value: S.outline ?? 0.55 },
      uSoil: { value: soilOn ? 1 : 0 }, uGrain: { value: grain }, uInnerR: { value: inner.r },
      uWobble: { value: S.wobble ?? 0.35 }, uVariance: { value: S.variance ?? 0.45 },
      uInvert: { value: S.invert ? 1 : 0 },
      uSeedP: { value: ((S.seed | 0) % 997) / 997 },
      uCirc: { value: mm.circ }, uHgt: { value: mm.h },
      uRegN: { value: comp.bands.length },
      uRegA: { value: packA }, uRegB: { value: packB }
    };
    mat.color = new THREE.Color(0xffffff);
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);   // dieselben Uniform-Objekte → live regelbar
      shader.vertexShader = VERT_HEAD + shader.vertexShader.replace('#include <begin_vertex>', VERT_BODY);
      shader.fragmentShader = FRAG_HEAD + shader.fragmentShader.replace('#include <map_fragment>', FRAG_BODY);
    };
    /* Ein Uniform-Wechsel darf den Shader NICHT neu bauen — deshalb steckt der ganze
       Registerstapel in Uniform-Feldern und der Cache-Key ist konstant. */
    mat.customProgramCacheKey = () => 'kfb-pot-register-v2';
    mat.needsUpdate = true;
    mesh.material = mat;
    handles.push({ mesh, mat, uniforms });
  }

  const api = {
    mode: S.projection,
    style: S,
    handles,
    composition: () => comp,
    /* Live: Palette, Biom, Leitmotiv, Register, Dichte, Kontur, Wackel, Abwechslung, Erde.
       Kein Neubau, kein Shader-Recompile — nur Uniforms und ein neuer Registerstapel. */
    set(patch) {
      Object.assign(S, patch || {});
      if (S.biome && S.biome !== 'frei' && !S.paletteLocked) S.paletteId = paletteForBiome(S.biome, S.seed);
      P = PALETTES[S.paletteId] || PALETTES.terracotta;
      comp = composeBands(S, mm);
      writeStack(comp);
      for (const hd of handles) {
        if (!hd.uniforms) { hd.mat.map = makeCanvasTexture(S, meshUVWindow(hd.mesh), comp); hd.mat.needsUpdate = true; continue; }
        const u = hd.uniforms;
        u.uColA.value = lin(P.colors[0]); u.uColB.value = lin(P.colors[1]);
        u.uColC.value = lin(P.colors[2]); u.uColR.value = lin(P.colors[3]);
        u.uColS.value = lin(P.soil || '#443024');
        u.uPhase.value = S.phase; u.uAccent.value = S.accent;
        u.uRim.value = S.rim ? 1 : 0; u.uOutline.value = S.outline ?? 0.55;
        u.uSoil.value = (S.soil === false) ? 0 : 1;
        u.uWobble.value = S.wobble ?? 0.35; u.uVariance.value = S.variance ?? 0.45;
        u.uInvert.value = S.invert ? 1 : 0;
        u.uSeedP.value = ((S.seed | 0) % 997) / 997;
        u.uRegN.value = comp.bands.length;
      }
      return api.report();
    },
    report: () => ({
      projection: S.projection, palette: S.paletteId, harmony: P.harmony,
      biome: S.biome || 'frei', paletteFromBiome: !!(S.biome && S.biome !== 'frei' && !S.paletteLocked),
      leitmotif: comp.lead, leadIndex: comp.leadIndex,
      registers: comp.registers, registerCap: comp.hardMax,
      stack: comp.bands.map((b) => ({ glyph: b.glyph, voice: b.voice, lead: b.lead, count: b.glyph === 'leer' ? null : b.count, span: [b.vBot, b.vTop], fill: b.fill })),
      leadCount: comp.leadCount,
      stackLine: comp.line,
      loudBands: comp.bands.filter((b) => b.voice === 'laut').length,
      countRange: (() => { const c = comp.bands.filter((b) => b.glyph !== 'leer').map((b) => b.count); return c.length ? [Math.min(...c), Math.max(...c)] : [0, 0]; })(),
      invert: !!S.invert,
      contrastGroundMotif: contrastRatio(P.colors[0], P.colors[1]),
      contrastMotifFrame: contrastRatio(P.colors[1], P.colors[3]),
      outline: S.outline ?? 0.55, wobble: S.wobble ?? 0.35, variance: S.variance ?? 0.45,
      soilShading: soilOn, grainPerUnit: +grain.toFixed(1),
      innerRadius: +inner.r.toFixed(3), innerRadiusFrom: inner.from,
      circumference: mm.circ, height: mm.h, aspect: mm.aspect,
      uv: probe, meshes: meshes.length,
      sourceTextureTouched: false,
      /* Abnahmetore der Grammatik — im Bericht, nicht im Gewissen. */
      gates: {
        oneLoudVoice: comp.bands.filter((b) => b.voice === 'laut').length <= 1,
        loudNotAtFoot: !(comp.bands[0] && comp.bands[0].voice === 'laut'),
        countsInRange: comp.bands.filter((b) => b.glyph !== 'leer').every((b) => b.voice === 'laut'
          ? b.count >= CELL_LIMITS.loudMin && b.count <= CELL_LIMITS.loudMax
          : b.count >= CELL_LIMITS.quietMin && b.count <= CELL_LIMITS.quietMax),
        noAdjacentRepeat: comp.bands.every((b, i) => i === 0 || b.glyph !== comp.bands[i - 1].glyph),
        groundReadsAsGround: contrastRatio(P.colors[0], P.colors[1]) >= 2.6,
        frameIsDarkest: P.colors.every((c, i) => i === 3 || luminance(P.colors[3]) <= luminance(c))
      }
    })
  };
  return api;
}

/* Innenradius aus der GEOMETRIE: der grösste Radius, an dem eine Normale nach innen zeigt,
   mit 12 % Luft. Damit trennt der Shader die Erdkappe vom Randkranz, ohne eine Höhe zu
   raten. Ohne Innenwand (massive Töpfe) bleibt der Rückfall 0,62·Aussenradius. */
function innerRadius(meshes) {
  let maxIn = 0, maxAll = 0;
  for (const mesh of meshes) {
    const p = mesh.geometry.attributes.position, n = mesh.geometry.attributes.normal;
    if (!p || !n) continue;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      const nx = n.getX(i), ny = n.getY(i), nz = n.getZ(i);
      const pl = Math.hypot(x, z), nl = Math.hypot(nx, nz);
      if (pl > maxAll) maxAll = pl;
      if (pl < 1e-4 || nl < 1e-4) continue;
      if (Math.abs(ny) < 0.6 && (x * nx + z * nz) / (pl * nl) < -0.2 && pl > maxIn) maxIn = pl;
    }
  }
  return maxIn > 0
    ? { r: maxIn * 1.12, from: 'Innenwand gemessen' }
    : { r: maxAll * 0.62, from: 'Rückfall 0,62·Aussenradius' };
}

function meshUVWindow(mesh) {
  const uv = mesh.geometry.attributes.uv;
  if (!uv) return null;
  let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i), v = uv.getY(i);
    if (u < u0) u0 = u; if (u > u1) u1 = u;
    if (v < v0) v0 = v; if (v > v1) v1 = v;
  }
  return [u0, u1, v0, v1];
}
