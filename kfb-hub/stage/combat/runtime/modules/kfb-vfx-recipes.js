/**
 * kfb-vfx-recipes.js · v1.0.0 · NEUTRALE VFX-REZEPTE ALS DATEN
 * ─────────────────────────────────────────────────────────────────────────────
 * WAS ES IST
 *   Eine Tabelle, keine Maschine. Sie wird GELESEN, nicht gerufen. Jedes Rezept
 *   sagt, WAS zu welcher Zeit auf welcher Ebene passiert — und `tor()` prueft die
 *   Regeln, die bisher als Prosa in Dokumenten standen.
 *
 * WARUM ES DIESES MODUL GIBT (Georgs Befund, 05.09.)
 *   `VFX_Basics+Repos+SOP_v1.md`: „Claude erfindet im Runner jedes neue Partikel
 *   aus SphereGeometry, random() und einer neuen Animation." Genau das war der
 *   Zustand. Es fehlt keine Partikel-Engine — `kfb-fx-sprites.js` ist seit T2 ein
 *   instanzierter Emitter mit Kurven. Es fehlte die FORM, in der ein Effekt
 *   beschrieben wird, bevor ihn jemand baut.
 *   Prosa klebt Formen zusammen. Eine Tabelle nicht.
 *
 * WAS ES NICHT IST
 *   Kein Partikelsystem, kein Editor, kein Effekt-JSON mit Editor-UI (zweimal im
 *   Projekt begraben), kein Renderer. Es besitzt nichts in der Szene und schreibt
 *   nichts: `group: null`, `schreibt: []`.
 *
 * NEUTRALE BASELINE (VFX_Guide_NO_KFB_DRIFT §16, letzte Zeile)
 *   Bis zur Baseline-Abnahme kein projektspezifischer Stil-Layer. Deshalb tragen
 *   diese Rezepte KEINE `card`- und `stamp`-Kacheln, und `tor()` laesst die Zeile
 *   fallen, wenn jemand sie einbaut. Nicht weil sie schlecht sind — weil die
 *   Reihenfolge gilt: Gameplay-Wahrheit → Semantik → neutrale Rueckmeldung →
 *   optionaler Stil-Adapter. Nie umgekehrt.
 *
 * VERTRAG
 *   name · group(null) · besitzt · schreibt([]) · quelle · params
 *   MUZZLE · TRAVEL · IMPACT_TIME · SURFACE · CASCADE · ANKER · KURVEN
 *   fuer(klasse, schluessel)  → Rezept oder null
 *   namen()                   → alle Rezept-Kennungen (fuer das Wirt-Tor)
 *   pruefe(rezept, zellen)    → { ok, zeilen }  · EIN Rezept gegen die Regeln
 *   zeile() · tor(zellen)     → drei Urteile: bestanden / nicht bestanden / nicht messbar
 *
 * GEMESSENE SCHLÜSSEL, NICHT ERINNERTE (05.09., von der eigenen Gate-Zeile gefunden)
 *   Die Waffenlisten hiessen `rail` und `boglob` — der Waffenraum des Standes
 *   heisst `railgun` und `acid`. Zwei Rezepte galten damit fuer keine Waffe, und
 *   zwei Waffen fielen still auf den alten Zweig. Genau dafuer zaehlt die
 *   Gate-Zeile „x/y Waffen dieser Seite": eine Zuordnung, die man nicht messen
 *   kann, ist eine Vermutung.
 *
 * EINHEITEN
 *   t0, dauer, aufraeumen in MILLISEKUNDEN. groesse in WELTEINHEITEN (u).
 *   op = Deckkraft 0..1. Zeiten sind relativ zum Ereignis (Mündung: Abzug = 0;
 *   Einschlag: Kontakt = 0; negative Zeiten sind Anticipation).
 */

export const name = 'vfx-recipes';
/* ABSICHTLICH LEER: dieses Modul besitzt nichts in der Szene. Ein leerer
   Group-Knoten waere unsichtbare Abwesenheit — `null` plus Begruendung ist die
   ehrliche Antwort auf eine Pflichtangabe (Vorschlag 1 an WIRT v14). */
export const group = null;
export const besitzt = 'nichts. Es ist eine Tabelle: Daten, kein Zeichner und kein Kanal.';
export const schreibt = [];
export const quelle = 'Visual FX/VFX_Guide_NO_KFB_DRIFT_v1.md §2–§11 · VFX_Basics+Repos+SOP_v1.md (Rezeptform) · '
  + 'docs/PLAN_vfx-werkbank-v13.md §3–§6 · KFB_COMBAT_FX_MENTAL_MODELS (M1 M4 M9 M10 M15 M16) · gemessene Werte aus v10/v11';

/** Wo ein Element haengt. Ein Element ohne Anker ist eine Weltkoordinate — und
 *  eine Marke auf einem bewegten Ziel darf keine sein (M12). */
/** Rueckstoss-Faktoren (Feld `rueckstoss` je Muendungsklasse) multiplizieren den
 *  gemessenen `kick` der Waffe. Sie stehen NICHT in `sekundaer`: eine Reaktion
 *  zeichnet nichts und darf kein Sichtbarkeits-Budget belegen. */
export const ANKER = ['muzzle', 'projectile', 'contact', 'target', 'ground', 'world'];
/** Wie ein Element lebt. `pop` = erstes Bild das groesste (Vlambeer). */
export const KURVEN = ['pop', 'grow', 'rise', 'settle', 'fade'];

/** Die Budgets aus §3.1. Sie sind hier Zahlen, damit `tor()` sie messen kann. */
export const params = {
  maxPrimaer: 1,
  maxSekundaer: 2,
  maxTertiaer: 3,
  maxTonDominant: 1,
  maxKamera: 1,
  /* §3.4: die drei Ebenen duerfen sich nicht gleichen. „Gewicht" ist
     groesse × op × sqrt(dauer) — eine Zahl, in der Groesse, Deckkraft und
     Standzeit zusammenkommen, weil das Auge sie zusammen liest. */
  ebenenAbstand: 0.35,
  /* Stil-Riegel der Baseline. Leeren, wenn Georg die Baseline freigibt (W6). */
  verbotenZellen: ['card', 'stamp']
};

const P = params;

/* ═══════════════════════════════════════════════════════════════════════════
   1 · MÜNDUNG · fuenf Klassen fuer zehn Waffen
   Nicht je Waffe eines — je KLASSE eines. Der Test aus M8 gilt: eine neue Waffe
   ist eine Zeile. Muendung ist IMMER kurz; ein langer Blitz macht die Waffe
   traege (M4). Negative `t0` sind Anticipation und der Grund, warum sie hier
   steht und nicht als Ausnahme im Wirt: heute hat genau eine von neun Waffen
   ein Ausholen.
   ═══════════════════════════════════════════════════════════════════════════ */
export const MUZZLE = {
  schnell: {
    id: 'muzzle-schnell', klasse: 'muzzle', waffen: ['stinger', 'hornet'],
    primaer: { zelle: 'star', anker: 'muzzle', t0: 0, dauer: 45, groesse: 0.55, op: 1.0, kurve: 'pop', gerichtet: true },
    sekundaer: [],
    rueckstoss: 1.0,
    tertiaer: [{ zelle: 'spark', anker: 'muzzle', t0: 0, dauer: 90, groesse: 0.14, op: 0.85, kurve: 'fade', anzahl: 2, streuung: 0.30 }],
    ton: { transient: 'tack', body: null, tail: null },
    kamera: null, aufraeumen: 160
  },
  schrot: {
    id: 'muzzle-schrot', klasse: 'muzzle', waffen: ['scrap'],
    primaer: { zelle: 'muzzle', anker: 'muzzle', t0: 0, dauer: 60, groesse: 0.95, op: 1.0, kurve: 'pop', gerichtet: true },
    sekundaer: [],
    rueckstoss: 2.0,
    tertiaer: [{ zelle: 'spark', anker: 'muzzle', t0: 0, dauer: 130, groesse: 0.16, op: 0.8, kurve: 'fade', anzahl: 3, streuung: 0.85 }],
    ton: { transient: 'blech', body: 'rassel', tail: null },
    kamera: 'klein', aufraeumen: 240
  },
  blast: {
    id: 'muzzle-blast', klasse: 'muzzle', waffen: ['rocket', 'mortar'],
    primaer: { zelle: 'muzzle', anker: 'muzzle', t0: 0, dauer: 70, groesse: 1.25, op: 1.0, kurve: 'pop', gerichtet: true },
    sekundaer: [
      { id: 'anticipation', anker: 'muzzle', t0: -110, dauer: 110, groesse: 0.0, op: 0.0, kurve: 'grow', reaktion: true, faktor: 0.45 },
      /* GEFAELLT VOM EIGENEN TOR (05.09.): 0,7 u bei op 0,45 lag nur 34 % unter
         dem Blitz — zwei fast gleich laute Signale sind zwei Hauptverben. Ein
         Muendungsrauch ist ein HINWEIS. Jetzt 60 % darunter. */
      { zelle: 'smoke', anker: 'muzzle', t0: 40, dauer: 480, groesse: 0.55, op: 0.32, kurve: 'rise' }
    ],
    rueckstoss: 1.4,
    tertiaer: [{ zelle: 'shard', anker: 'muzzle', t0: 30, dauer: 170, groesse: 0.18, op: 0.7, kurve: 'fade', anzahl: 2, streuung: 0.55 }],
    ton: { transient: 'zuendung', body: 'fauchen', tail: 'rumpeln' },
    kamera: 'klein', aufraeumen: 620
  },
  strahl: {
    id: 'muzzle-strahl', klasse: 'muzzle', waffen: ['beam', 'railgun'],
    primaer: { zelle: 'plasma', anker: 'muzzle', t0: 0, dauer: 50, groesse: 0.45, op: 1.0, kurve: 'pop' },
    /* GEFAELLT VOM EIGENEN TOR (05.09.): 28 % unter dem Puls. Eine Ankuendigung
       darf nie so laut sein wie das Ereignis, das sie ankuendigt — sonst liest
       man den Aufbau als den Schuss. Jetzt 64 % darunter. */
    sekundaer: [{ id: 'ladezeichen', anker: 'muzzle', t0: -90, dauer: 90, groesse: 0.22, op: 0.55, kurve: 'grow', zelle: 'dot' }],
    /* Ein Strahl STOESST nicht — aber er ist auch nicht kraeftefrei: 0,35 ist ein
       Zucken, kein Schlag. Null waere die Behauptung, dass da nichts passiert. */
    rueckstoss: 0.35,
    tertiaer: [{ zelle: 'arc', anker: 'muzzle', t0: 0, dauer: 70, groesse: 0.22, op: 0.9, kurve: 'fade', anzahl: 2, gerichtet: true }],
    ton: { transient: 'klick', body: 'summen', tail: 'klick' },
    kamera: null, aufraeumen: 180
  },
  wurf: {
    id: 'muzzle-wurf', klasse: 'muzzle', waffen: ['acid', 'dice', 'eyeball'],
    primaer: { zelle: 'puff', anker: 'muzzle', t0: 0, dauer: 80, groesse: 0.50, op: 0.9, kurve: 'grow' },
    sekundaer: [{ id: 'ausholen', anker: 'muzzle', t0: -140, dauer: 140, groesse: 0.0, op: 0.0, kurve: 'grow', reaktion: true, faktor: 0.45 }],
    rueckstoss: 0.8,
    tertiaer: [{ zelle: 'dot', anker: 'muzzle', t0: 0, dauer: 60, groesse: 0.10, op: 0.6, kurve: 'fade', anzahl: 1 }],
    ton: { transient: 'plopp', body: null, tail: null },
    kamera: null, aufraeumen: 200
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   2 · REISE · vier Bahnformen
   §5.1: Physikbahn ist WAHRHEIT, Sichtbahn ist DARSTELLUNG. Kein Wackeln darf
   die Kollision aendern. Und: eine Perlenschnur ist keine Spur — der Ribbon ist
   gebaut (`kfb-fx-trails.js`, 16 × 28) und ersetzt die Puff-Ketten.
   ═══════════════════════════════════════════════════════════════════════════ */
export const TRAVEL = {
  gerade: {
    id: 'travel-gerade', klasse: 'travel', waffen: ['stinger', 'hornet', 'scrap'],
    primaer: { id: 'masse', anker: 'projectile', t0: 0, dauer: -1, groesse: 1.0, op: 1.0, kurve: 'grow', schweif: 'streak', growIn: true },
    sekundaer: [], tertiaer: [],
    ton: { transient: null, body: null, tail: null },
    regel: 'Schweif nie laenger als geflogen (M9). Pivot an der Spitze — sonst existiert er vor seinem Ursprung.',
    kamera: null, aufraeumen: 120
  },
  bogen: {
    id: 'travel-bogen', klasse: 'travel', waffen: ['acid', 'mortar', 'dice', 'eyeball'],
    primaer: { id: 'masse', anker: 'projectile', t0: 0, dauer: -1, groesse: 1.0, op: 1.0, kurve: 'grow', taumelt: true },
    sekundaer: [{ id: 'bodenschatten', zelle: 'dot', anker: 'ground', t0: 0, dauer: -1, groesse: 0.34, op: 0.30, kurve: 'fade', folgt: 'projectile' }],
    tertiaer: [{ zelle: 'dot', anker: 'projectile', t0: 0, dauer: 220, groesse: 0.07, op: 0.4, kurve: 'fade', jederTakt: 6 }],
    ton: { transient: null, body: 'zischen', tail: null },
    regel: 'Der Bodenschatten ist der billigste Tiefenhinweis, den es gibt, und im Cartoon Standard.',
    kamera: null, aufraeumen: 260
  },
  schub: {
    id: 'travel-schub', klasse: 'travel', waffen: ['rocket'],
    primaer: { id: 'masse', anker: 'projectile', t0: 0, dauer: -1, groesse: 1.0, op: 1.0, kurve: 'grow' },
    sekundaer: [{ id: 'rauchspur', anker: 'projectile', t0: 0, dauer: -1, groesse: 0.55, op: 0.5, kurve: 'rise', ribbon: true }],
    tertiaer: [{ zelle: 'fire', anker: 'projectile', t0: 0, dauer: 180, groesse: 0.16, op: 0.8, kurve: 'fade', jederTakt: 6 }],
    ton: { transient: null, body: 'fauchen-loop', tail: null },
    regel: 'EINE dominierende Spur, nicht zehn Nebenpartikel. Der Loop endet mit dem Geschoss, nicht danach (§11.4).',
    kamera: null, aufraeumen: 900
  },
  strahl: {
    id: 'travel-strahl', klasse: 'travel', waffen: ['beam', 'railgun'],
    primaer: { id: 'segment', anker: 'world', t0: 0, dauer: 90, groesse: 0.30, op: 1.0, kurve: 'fade', jeBild: true, verjuengt: true },
    sekundaer: [{ zelle: 'plasma', anker: 'contact', t0: 0, dauer: -1, groesse: 0.35, op: 0.9, kurve: 'pop' }],
    tertiaer: [],
    ton: { transient: 'klick', body: 'summen-loop', tail: 'klick' },
    regel: 'Ein Strahl ist eine VERBINDUNG, kein Geschoss (§4.5). Er darf nicht wie ein langsames Projektil lesen.',
    kamera: null, aufraeumen: 200
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   3 · EINSCHLAG · die Zeitachse, die fuer JEDE Zelle gilt
   `kfb-combat-def.js` loest schon richtig, WAS eine Zelle ist (12 Regelzeilen →
   32 Zellen). Was fehlte, ist WANN. Nur die Amplitude skaliert, nie die
   Struktur (M4) — deshalb ist das hier EINE Tabelle und nicht 44.
   ═══════════════════════════════════════════════════════════════════════════ */
export const IMPACT_TIME = [
  { phase: 'anticipation', t0: -110, dauer: 110, ebene: 'sekundaer', nurKlassen: ['blast', 'wurf'], was: 'Ausholen des Schuetzen' },
  { phase: 'kontakt', t0: 0, dauer: 160, ebene: 'primaer', was: 'Burst am Kontaktpunkt, pop, Weissglut → Waffenfarbe' },
  { phase: 'hitstop', t0: 0, dauer: 'zelle.stop', ebene: 'reaktion', was: 'Animation friert — Bildbudget' },
  { phase: 'flash', t0: 0, dauer: 160, ebene: 'reaktion', was: 'Material blitzt in der Energiefarbe' },
  { phase: 'hold', t0: 0, dauer: 70, ebene: 'reaktion', was: 'die gestauchte Pose STEHT — vier Bilder, das Cartoon-Extrem' },
  { phase: 'debris', t0: 20, dauer: 240, ebene: 'sekundaer', was: '3–6 gerichtete Splitter entlang der Einfallsebene' },
  { phase: 'grund', t0: 40, dauer: 220, ebene: 'tertiaer', nurOberflaechen: ['water', 'energy', 'flaeche'], was: 'Ring — NICHT bei jedem Treffer' },
  { phase: 'volumen', t0: 120, dauer: 780, ebene: 'tertiaer', was: 'EINE Rauchsaeule: Impuls 25 %, Widerstand, Auftrieb' },
  { phase: 'rueckstand', t0: 300, dauer: 20000, ebene: 'tertiaer', was: 'Marke, altert 6–20 s, blinkt nicht weg (M7)' }
];

/* ═══════════════════════════════════════════════════════════════════════════
   4 · OBERFLÄCHEN · Form, Ton und Rueckstand je Material (§6.1/§6.2)
   DIE REGEL DARUEBER (M3): die WAFFE bestimmt Farbe und Wucht, die OBERFLAECHE
   bestimmt Form, Ton und was liegen bleibt. Zwei kleine Tabellen statt einer
   grossen Effektbibliothek.
   UND §6.3 als Tor: niemals derselbe metallische Ton fuer Lebewesen, Holz,
   Papier, Schleim und Wasser. Waffenklang und Einschlagklang sind getrennt.
   ═══════════════════════════════════════════════════════════════════════════ */
export const SURFACE = {
  organic: { burst: 'burst', debris: 'puff', n: 3, streu: 0.5, ton: { transient: 'dumpf', body: 'fleisch', tail: 'kurz' }, marke: null, deformer: 'weich' },
  metal:   { burst: 'star',  debris: 'spark', n: 6, streu: 0.9, ton: { transient: 'ping', body: 'ring', tail: 'nachklang' }, marke: 'dot', deformer: 'hart' },
  wood:    { burst: 'burst', debris: 'shard', n: 5, streu: 0.7, ton: { transient: 'knack', body: 'hohl', tail: 'kurz' }, marke: 'scorch', deformer: 'weich' },
  stone:   { burst: 'burst', debris: 'shard', n: 5, streu: 0.6, ton: { transient: 'crack', body: 'trocken', tail: 'staub' }, marke: 'scorch', deformer: 'hart' },
  bone:    { burst: 'star',  debris: 'shard', n: 4, streu: 0.6, ton: { transient: 'klacken', body: 'trocken', tail: null }, marke: 'dot', deformer: 'hart' },
  glass:   { burst: 'star',  debris: 'shard', n: 6, streu: 1.0, ton: { transient: 'crack-hoch', body: 'klirren', tail: 'rieseln' }, marke: 'dot', deformer: 'hart' },
  paper:   { burst: 'puff',  debris: 'shard', n: 3, streu: 0.8, ton: { transient: 'slap', body: 'riss', tail: null }, marke: 'scorch', deformer: 'weich' },
  water:   { burst: 'splat', debris: 'dot',  n: 5, streu: 0.9, ton: { transient: 'plopp', body: 'blubber', tail: 'tropfen' }, marke: null, ring: true, deformer: 'nass' },
  energy:  { burst: 'plasma', debris: 'arc', n: 3, streu: 0.5, ton: { transient: 'zap', body: 'ton', tail: 'ausklang' }, marke: null, ring: true, deformer: 'nass' },
  slime:   { burst: 'splat', debris: 'dot',  n: 4, streu: 0.7, ton: { transient: 'plopp-weich', body: 'blubber', tail: 'tropfen' }, marke: 'splat', deformer: 'nass' },
  ice:     { burst: 'star',  debris: 'shard', n: 5, streu: 0.8, ton: { transient: 'crack-sproede', body: 'klirren', tail: 'rieseln' }, marke: 'dot', deformer: 'hart' },
  /* Lufttreffer: kompakter Burst und AUSDRUECKLICH keine Marke (M7, §10.2). */
  air:     { burst: 'burst', debris: 'spark', n: 3, streu: 0.7, ton: { transient: 'knapp', body: null, tail: null }, marke: null, deformer: null }
};

/** Deformer-Klassen (M19). Bisher galten fuenf globale Zahlen fuer Knochen,
 *  Metall, Gummi, Wasser und Papier — damit staucht ein Skelett wie Kaugummi. */
export const DEFORMER = {
  hart:  { squash: 0.18, dur: 220, abkling: 5.0, ueberschwinger: 1 },
  weich: { squash: 0.34, dur: 450, abkling: 3.2, ueberschwinger: 1 },
  nass:  { squash: 0.42, dur: 700, abkling: 2.1, ueberschwinger: 2 }
};

/* ═══════════════════════════════════════════════════════════════════════════
   5 · KASKADE · die einzige Klasse, fuer die im Projekt kein Beweis existiert
   Die Amplitude FAELLT, die Tonhoehe STEIGT. Das ist der Trick, den Mario und
   Candy Crush beide fahren: das Bild wird ruhiger, waehrend der Ton lauter
   WIRD — deshalb liest sich eine Kette als Belohnung und nicht als Chaos.
   Damit ist die Beat-Grenze (≤ 3 auf t = 0, E-29) keine Sparmassnahme mehr,
   sondern die Regel selbst: mehr als drei gleichzeitig gibt es nicht, weil sie
   NACHEINANDER kommen.
   ═══════════════════════════════════════════════════════════════════════════ */
export const CASCADE = {
  id: 'cascade', klasse: 'cascade',
  glieder: [
    { nr: 1, t0: 0,   burst: 1.00, halbtoene: 0, hitstop: true },
    { nr: 2, t0: 120, burst: 0.85, halbtoene: 2, hitstop: false },
    { nr: 3, t0: 240, burst: 0.72, halbtoene: 4, hitstop: false, fovPunch: true }
  ],
  abschluss: { t0: 380, ton: 'bestaetigung', halbtoene: 6 },
  regel: 'Die Kaskade darf NIE die Koerper verdecken, die sie erklaert (§8.8).',
  aufraeumen: 1200
};

/* ─────────────────────────────────────────────────────────────────────────── */

/* Nur die Rezepte MIT Ebenen. `CASCADE` hat keine — es beschreibt eine Staffel
   von Ereignissen, nicht ein Ereignis, und wird von seinen eigenen zwei
   Torzeilen geprueft. Es hier mitzuzaehlen war der Fehler, der das Tor geworfen
   hat: eine Liste, die zwei verschiedene Dinge enthaelt, hat einen Leser zu
   viel. */
const alleRezepte = () => {
  const out = [];
  for (const k in MUZZLE) out.push(MUZZLE[k]);
  for (const k in TRAVEL) out.push(TRAVEL[k]);
  return out;
};

export function fuer(klasse, schluessel) {
  if (klasse === 'muzzle') return MUZZLE[schluessel] || null;
  if (klasse === 'travel') return TRAVEL[schluessel] || null;
  if (klasse === 'cascade') return CASCADE;
  if (klasse === 'surface') return SURFACE[schluessel] || null;
  if (klasse === 'deformer') return DEFORMER[schluessel] || null;
  return null;
}

/** Welche Klasse gehoert zu dieser Waffe — aus den Tabellen, nicht aus einer
 *  zweiten Liste. Zwei Listen fuer eine Zuordnung driften still. */
export function klasseVon(tabelle, waffe) {
  const T = tabelle === 'travel' ? TRAVEL : MUZZLE;
  for (const k in T) if ((T[k].waffen || []).indexOf(waffe) >= 0) return k;
  return null;
}

export function namen() {
  return alleRezepte().map((r) => r.id).concat(Object.keys(SURFACE).map((s) => 'surface.' + s));
}

/** Alle Elemente eines Rezepts mit ihrer Ebene — EIN Leser fuer alle Pruefungen. */
function elemente(r) {
  const out = [];
  if (r.primaer) out.push({ e: r.primaer, ebene: 'primaer' });
  for (const e of (r.sekundaer || [])) out.push({ e, ebene: 'sekundaer' });
  for (const e of (r.tertiaer || [])) out.push({ e, ebene: 'tertiaer' });
  return out;
}

/** Das Gewicht, mit dem das Auge ein Element liest: Groesse × Deckkraft ×
 *  √Dauer. Drei Zahlen, die zusammen gelesen werden, also auch zusammen
 *  gemessen. Reaktionen (0 Objekte) und offene Dauern (−1) zaehlen nicht mit. */
function gewicht(e) {
  /* NULL-SICHER, und der Grund ist ein echter Fehler dieser Runde: `CASCADE` hat
     kein `primaer`, sondern `glieder` — also lief `gewicht(undefined)` und riss
     das ganze Tor mit („Cannot read properties of undefined"). Ein Tor, das
     wirft, prueft nichts. */
  if (!e || e.reaktion || !e.groesse || e.dauer == null || e.dauer < 0) return null;
  return e.groesse * (e.op == null ? 1 : e.op) * Math.sqrt(Math.max(1, e.dauer) / 100);
}

/**
 * EIN Rezept gegen die Regeln. `zellen` ist die Kachelliste des Wirts (der
 * Atlas) — ohne sie ist „Kachel existiert" NICHT MESSBAR, nicht falsch.
 */
export function pruefe(r, zellen) {
  const z = [];
  const fail = (s) => z.push('\u2717 ' + r.id + ': ' + s);
  const offen = (s) => z.push('\u2013 ' + r.id + ': ' + s + ' (nicht messbar)');
  let ok = true, nm = 0;

  if (!r.primaer) { fail('kein primaeres Element — ein Ereignis ohne Hauptverb'); ok = false; }
  /* GEFUNDEN VOM VERIFIER (05.09.): der Rueckstoss lag als `reaktion`-Element in
     `sekundaer` — also hatten ihn genau die zwei Klassen, bei denen ich ihn
     hingeschrieben hatte, und blast/strahl/wurf gar nicht. Gemessen: railgun
     _kick 0 statt 1,05. Er ist keine SICHTBARKEITSEBENE (er zeichnet nichts und
     darf kein Budget belegen), sondern eine Zahl je Muendungsklasse — also ein
     Feld mit Pflicht, kein Element mit Glueck. */
  if (r.klasse === 'muzzle' && !(typeof r.rueckstoss === 'number')) {
    fail('kein `rueckstoss` — eine Waffe, die den Schuetzen nicht bewegt, hat keinen Abgang'); ok = false;
  }
  if ((r.sekundaer || []).length > P.maxSekundaer) { fail((r.sekundaer || []).length + ' sekundaere (max ' + P.maxSekundaer + ')'); ok = false; }
  if ((r.tertiaer || []).length > P.maxTertiaer) { fail((r.tertiaer || []).length + ' tertiaere (max ' + P.maxTertiaer + ')'); ok = false; }

  /* Aufraeumen ist verbindlich (§2.7): ein Effekt, der danach lebt, ist ein
     Fehler und kein Nachklang. Offene Dauern (−1, „bis der Traeger stirbt")
     sind ausgenommen — sie enden mit ihrem Traeger. */
  let ende = 0, offeneDauer = false;
  for (const { e } of elemente(r)) {
    if (e.dauer != null && e.dauer < 0) { offeneDauer = true; continue; }
    if (typeof e.dauer !== 'number') continue;
    ende = Math.max(ende, (e.t0 || 0) + e.dauer);
  }
  if (!r.aufraeumen) { fail('kein `aufraeumen`'); ok = false; }
  else if (!offeneDauer && r.aufraeumen < ende) { fail('aufraeumen ' + r.aufraeumen + ' ms < laengstes Element ' + ende + ' ms'); ok = false; }

  /* Anker und Kurve muessen aus den Listen kommen, sonst ist der Name eine
     Vermutung: ein Anker, den niemand kennt, wird zur Weltkoordinate (M12). */
  for (const { e, ebene } of elemente(r)) {
    if (e.anker && ANKER.indexOf(e.anker) < 0) { fail('unbekannter Anker `' + e.anker + '` (' + ebene + ')'); ok = false; }
    if (e.kurve && KURVEN.indexOf(e.kurve) < 0) { fail('unbekannte Kurve `' + e.kurve + '` (' + ebene + ')'); ok = false; }
    if (e.zelle && P.verbotenZellen.indexOf(e.zelle) >= 0) { fail('Stil-Kachel `' + e.zelle + '` vor der Baseline-Abnahme (§16)'); ok = false; }
    if (e.zelle && zellen && zellen.length) {
      if (zellen.indexOf(e.zelle) < 0) { fail('Kachel `' + e.zelle + '` liegt nicht im Atlas'); ok = false; }
    } else if (e.zelle) { offen('Kachel `' + e.zelle + '` — Atlas nicht uebergeben'); nm++; }
  }

  /* §3.4: primaer, sekundaer und tertiaer duerfen sich nicht gleichen. Wo eine
     Ebene nur Reaktionen enthaelt (0 Objekte), ist der Vergleich NICHT MESSBAR
     — und das ist ein Urteil, kein Ausweichen. */
  const gp = gewicht(r.primaer);
  const paare = [['sekundaer', r.sekundaer], ['tertiaer', r.tertiaer]];
  for (const [ebene, liste] of paare) {
    const gs = (liste || []).map((e) => gewicht(e)).filter((v) => v != null);
    if (gp == null || !gs.length) { offen('Ebenen-Abstand ' + ebene + ' — nur Reaktionen oder offene Dauer'); nm++; continue; }
    const groesste = Math.max.apply(null, gs);
    const abstand = gp > 0 ? (gp - groesste) / gp : 0;
    if (abstand < P.ebenenAbstand) {
      fail(ebene + ' liegt nur ' + Math.round(abstand * 100) + ' % unter primaer (min ' + Math.round(P.ebenenAbstand * 100) + ' %) — die Ebenen verschmelzen');
      ok = false;
    }
  }

  if (ok && !z.length) z.push('\u2713 ' + r.id);
  return { ok, nichtMessbar: nm, zeilen: z };
}

export function zeile() {
  const n = alleRezepte().length + 1;   // + Kaskade, die kein Ebenen-Rezept ist
  const t = Object.keys(SURFACE).length;
  return 'vfx-recipes · ' + Object.keys(MUZZLE).length + ' Muendungsklassen fuer '
    + Object.keys(MUZZLE).reduce((a, k) => a + MUZZLE[k].waffen.length, 0) + ' Waffen · '
    + Object.keys(TRAVEL).length + ' Bahnformen · ' + IMPACT_TIME.length + ' Einschlagphasen · '
    + t + ' Oberflaechen × 3 Deformer-Klassen · Kaskade ' + CASCADE.glieder.length + ' Glieder · '
    + n + ' pruefbare Rezepte · Budgets 1/' + P.maxSekundaer + '/' + P.maxTertiaer
    + ' · Stil-Riegel: ' + (P.verbotenZellen.length ? P.verbotenZellen.join(', ') + ' gesperrt' : 'OFFEN (Baseline freigegeben)');
}

/**
 * `tor(zellen)` — drei Urteile. `zellen` = Kachelliste des Wirts; fehlt sie,
 * sind die Kachelpruefungen nicht messbar statt stillschweigend bestanden.
 */
export function tor(zellen) {
  const z = []; let ok = 0, von = 0, nm = 0;
  const pruefZ = (b, gut, schlecht) => { von++; if (b) { ok++; z.push('\u2713 ' + gut); } else z.push('\u2717 ' + schlecht); };

  const rs = alleRezepte();
  let schlecht = 0;
  for (const r of rs) {
    const p = pruefe(r, zellen);
    nm += p.nichtMessbar;
    if (!p.ok) { schlecht++; for (const l of p.zeilen) if (l.charAt(0) === '\u2717') z.push(l); }
  }
  pruefZ(schlecht === 0, rs.length + ' Rezepte halten die Budgets, Anker, Kurven und Aufraeumzeiten ein',
    schlecht + ' von ' + rs.length + ' Rezepten verletzen eine Regel (Zeilen darueber)');

  /* §6.3 als Tor, nicht als Merksatz: derselbe Transient fuer mehrere
     Materialien ist der Fehler, den das Dokument beim Namen nennt. */
  const trans = {};
  for (const s in SURFACE) {
    const t = SURFACE[s].ton && SURFACE[s].ton.transient;
    if (t) (trans[t] = trans[t] || []).push(s);
  }
  const doppelt = Object.keys(trans).filter((t) => trans[t].length > 1);
  pruefZ(doppelt.length === 0, Object.keys(SURFACE).length + ' Oberflaechen haben je einen EIGENEN Transienten (§6.3)',
    'derselbe Transient fuer mehrere Oberflaechen: ' + doppelt.map((t) => t + ' → ' + trans[t].join('/')).join(' · '));

  /* Jede Waffe genau einer Muendungs- und einer Bahnklasse. Eine Waffe in zwei
     Klassen hat keine; eine Waffe in keiner faellt still auf einen Vorgabewert. */
  const zaehl = {};
  for (const k in MUZZLE) for (const w of MUZZLE[k].waffen) zaehl[w] = (zaehl[w] || 0) + 1;
  const mehrfach = Object.keys(zaehl).filter((w) => zaehl[w] > 1);
  pruefZ(mehrfach.length === 0, Object.keys(zaehl).length + ' Waffen haben genau EINE Muendungsklasse',
    'Waffe in mehreren Muendungsklassen: ' + mehrfach.join(', '));

  /* Die Kaskade: Amplitude fallend, Tonhoehe steigend, genau ein Hitstop. */
  const g = CASCADE.glieder;
  let fallend = true, steigend = true, stops = 0;
  for (let i = 0; i < g.length; i++) {
    if (g[i].hitstop) stops++;
    if (i > 0) {
      if (g[i].burst >= g[i - 1].burst) fallend = false;
      if (g[i].halbtoene <= g[i - 1].halbtoene) steigend = false;
      if (g[i].t0 <= g[i - 1].t0) steigend = false;
    }
  }
  pruefZ(fallend && steigend && stops === 1,
    'Kaskade: Amplitude fallend, Tonhoehe und Versatz steigend, genau 1 Hitstop',
    'Kaskade verletzt M16 (fallend ' + fallend + ', steigend ' + steigend + ', Hitstops ' + stops + ')');
  pruefZ(g.length <= 3, 'Kaskade haelt die Beat-Grenze: ' + g.length + ' Glieder, hoechstens 3 im Augenblick',
    'Kaskade hat ' + g.length + ' Glieder — mehr als 3 auf t=0 ist ein Akkord (E-29)');

  /* Der Stil-Riegel der Baseline. Er MUSS fallen, wenn jemand ihn oeffnet, ohne
     die Baseline freizugeben — das ist die Zeile, die ich zweimal verletzt habe. */
  pruefZ(P.verbotenZellen.length > 0, 'Stil-Riegel aktiv: ' + P.verbotenZellen.join(', ') + ' gesperrt bis zur Baseline-Abnahme (§16)',
    'STIL-RIEGEL OFFEN — projektspezifische Kacheln erlaubt, obwohl die Baseline nicht freigegeben ist');

  if (!zellen || !zellen.length) { z.push('\u2013 Atlas nicht uebergeben — Kachelpruefung nicht messbar'); }

  return {
    ok: ok === von, bestanden: ok, von, nichtMessbar: nm, zeilen: z,
    text: 'vfx-recipes: ' + ok + '/' + von + ' bestanden' + (nm ? ', ' + nm + ' nicht messbar' : '')
  };
}
