/**
 * kfb-combat-def.js — DIE GEMEINSAME KAMPFDEFINITION (Modulvertrag v1.0.0)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * WARUM DIESE DATEI EXISTIERT
 * Bis v8 lagen Waffen, Munitionsformen und die Impact-Tabelle als Konstanten IM
 * Slice. Der Schussbahn-Stand (v9) braucht dieselben Werte — und eine Kopie waere
 * zwei Wahrheiten. Wer hier tunt, tunt beide Stände.
 *
 * WAS SIE NICHT TUT
 * Sie rendert nichts, spielt nichts, kennt keine Szene. Nur Daten und eine Regel.
 *
 * DIE REGEL (aus dem gestorbenen Gun-Feel-Labor gerettet, LD §12)
 * v8 traegt eine handgeschriebene Tabelle mit 4 Energiearten × 8 Oberflaechen =
 * 32 Zellen. Das ist nicht skalierbar: jede neue Waffe kostet nichts, aber jede
 * neue Oberflaeche kostet vier Zellen, und niemand kann pruefen, ob die 32 Zellen
 * untereinander konsistent sind. Hier steht stattdessen:
 *
 *     4 ENERGIEARTEN + 8 OBERFLAECHEN = ZWOELF Regelzeilen
 *     → resolveImpact(energie, oberflaeche) leitet die Zelle ab und merkt sie
 *
 * Unterscheidbar bleibt es, weil zwei UNABHAENGIGE Achsen wirken:
 * die Energie setzt Form, Farbe und Transient, die Oberflaeche setzt Koerperklang,
 * Truebermaterial, Marke und Haerte.
 */

export function describe() {
  return {
    id: 'kfb-combat-def',
    version: '1.0.0',
    needs: [],
    provides: ['weapons', 'ammo', 'impact-rule', 'enemy-roster', 'seeded-rng', 'atlas-order']
  };
}

/* ─── Tusche-Atlas: die Reihenfolge IST der Vertrag (UV-Index) ───────────────── */
/* T6 (03.09.2026, Georg: „die ganze Enchilada"): Zeile 4 kommt ADDITIV dazu — 0–11 bleiben,
   damit v8s UV-Indizes weiter stimmen. Das Blatt ist jetzt 4×4 (1024×1024). */
/* T6b (03.09.2026): Zeile 5 kommt ADDITIV dazu — 0–15 bleiben byte-gleich im Blatt.
   `arc` (spark_05) ist EIN gerichteter Blitz und zeigt im Bild nach oben; der Wirt
   dreht ihn auf die Schussrichtung, wie muzzle und streak. `plasma` (spark_02) ist
   Kugelblitz, radial, ohne Vorzugsrichtung. Beide sind ELEKTRISCH, nicht der
   allgemeine Funke — `spark` (trace_04) bleibt der universelle Splitter. */
export const ATLAS = ['burst', 'star', 'puff', 'spark', 'splat', 'ring', 'streak', 'shard', 'tongue', 'card', 'stamp', 'smoke', 'muzzle', 'scorch', 'fire', 'dot', 'arc', 'plasma'];
export const ATLAS_COLS = 4, ATLAS_ROWS = 5;

/* KFB-Palette. Vier Farben, keine fuenfte — Neon-Sci-Fi ist ein anderes Spiel. */
export const INK = 0x1f1a14, GOLD = 0xe9c14a, RED = 0xb8361f, PAPER = 0xf3ead3, SAND = 0xd8c9a4;

/* ─── 1 · WAFFEN ──────────────────────────────────────────────────────────────
   Unveraendert aus v8 uebernommen, damit der Schussstand DAS Spiel zeigt und
   nicht eine Nachbildung. `ammo` ist neu und benennt die Silhouette explizit:
   bisher wurde sie aus `shape`/`rocket`/`glow` erraten, was drei Stellen im Code
   uneinig gemacht hat. */
export const WEAPONS = {
  stinger: {
    name: 'Stinger', kind: 'SIGNATUR', note: 'Schnellfeuer · Tracer',
    rate: 0.11, dmg: 9, speed: 78, clip: 'Shoot_Small',
    color: 0xffe89a, flash: 0xfff3cf, glow: true, kick: 0.028,
    sfx: 'pop', energy: 'kinetic', muz: 'star', heft: 0.35, ammo: 'streak'
  },
  hornet: {
    name: 'Hornet Swarm', kind: 'SIGNATUR', note: '3er-Salve · Dartschwarm',
    rate: 0.5, burst: 3, burstGap: 0.07, dmg: 8, speed: 62, clip: 'Shoot_Small',
    color: 0xffd23f, flash: 0xfff0a8, glow: true, kick: 0.024,
    sfx: 'buzz', energy: 'kinetic', muz: 'star', heft: 0.35, ammo: 'dart', spreadA: 0.035
  },
  railgun: {
    name: 'Bamboo Rail', kind: 'SIGNATUR', note: 'Einzelschuss · durchschlagend',
    rate: 1.15, dmg: 54, speed: 165, clip: 'Shoot_Big',
    color: 0x8fe6ff, flash: 0xffffff, glow: true, kick: 0.075,
    sfx: 'railzap', energy: 'electric', muz: 'rail', heft: 0.9, ant: 0.09,
    ammo: 'slug', pierce: true
  },
  acid: {
    name: 'Bog Lob', kind: 'SIGNATUR', note: 'Bogenwurf · Ätzpfütze',
    rate: 0.85, dmg: 30, speed: 30, clip: 'Shoot_Big',
    color: 0x9ad63f, flash: 0xd6ff7a, kick: 0.05,
    sfx: 'wetlob', energy: 'wet', muz: 'blast', heft: 0.6,
    ammo: 'glob', arc: 0.5, splash: 3.0
  },
  scrap: {
    name: 'Scrap Cannon', kind: 'SIGNATUR', note: 'Streuschuss · Schrottgarbe',
    rate: 0.75, pellets: 6, dmg: 11, speed: 52, clip: 'Shoot_Big',
    color: 0xffb35c, flash: 0xffe0a8, kick: 0.08,
    sfx: 'scrapboom', energy: 'kinetic', muz: 'spread', heft: 0.7,
    ammo: 'scrap', spreadA: 0.1
  },
  rocket: {
    name: 'Nest Rocket', kind: 'WECHSEL', note: 'Rakete · Flächenschaden',
    rate: 1.35, dmg: 46, speed: 34, clip: 'Shoot_Big',
    color: RED, kick: 0.09,
    sfx: 'whoosh', energy: 'hot', muz: 'blast', heft: 1, ant: 0.12,
    ammo: 'rocket', trail: 'smoke', splash: 3.4, shadow: true
  },
  mortar: {
    /* GEORGS ENTSCHEIDUNG (04.09.): „ink mortar → trail & farbe anpassen für normalen
       Mortar". Der Tusche-Pass fliegt raus, und mit ihm drei Dinge, die an ihm hingen:
         color: INK    war 0x1f1a14. Additiv geblendet addiert Schwarz NICHTS — die fuenf
                       Muendungsfunken je Schuss haben kein einziges Pixel gezeichnet und
                       nur Poolplaetze belegt. Jetzt Stahl mit warmem Blitz.
         trail: 'ink'  laeuft auf die Rauchbahn um. Weil er `arc` traegt, bekommt er dort
                       die dicke, langsame Wolke statt des schmalen Triebwerkstrahls.
         fxExtra       'card' war Kayfabe-Konfetti. Gehoert nicht in eine Ballistik.
       `energy` wird 'hot': die Bedingung fuer die Feuerwolke (`heavy && hot`) trifft ihn
       damit endlich. Die alte Gegenbegruendung war die Tuschepalette — die ist weg. */
    name: 'Mortar', kind: 'WECHSEL', note: 'Bogenschuss · Sprengwolke',
    rate: 1.8, dmg: 38, speed: 26, clip: 'Shoot_Big',
    color: 0x8a8f7d, flash: 0xffd9a0, kick: 0.11,
    sfx: 'thump', energy: 'hot', muz: 'blast', heft: 1, ant: 0.12,
    ammo: 'shell', trail: 'smoke', splash: 4.6, arc: 0.55, shadow: true
  },
  beam: {
    name: 'Kayfabeam', kind: 'WECHSEL', note: 'Bolzenfolge · schmilzt Panzer',
    rate: 0.16, dmg: 12, speed: 130, clip: 'Shoot_Small',
    color: 0x9fe6ff, flash: 0xffffff, glow: true, kick: 0.018,
    sfx: 'zap', energy: 'hot', muz: 'charge', heft: 0.3,
    /* GEORGS ENTSCHEIDUNG (02.09.): KEIN DAUERSTRAHL. Stattdessen schnelle Bolzen
       mit zulaufender, verblassender Spur. Der alte Dauerstrahl feuerte alle 60 ms
       einen Ton und war als Bild ein stehender Zylinder ohne Ereignis. */
    ammo: 'bolt', taper: true, decalMarke: 'stamp'
  }
};

/* ─── 2 · MUNITIONS-SILHOUETTEN ───────────────────────────────────────────────
   Der Grund, dass das eine eigene Tabelle ist: auf Kampfdistanz ist die SILHOUETTE
   die einzige Ansage, die noch ankommt. Farbe verschwindet gegen das Terrain,
   Groesse verschwindet in der Perspektive — die Form bleibt.

   GEORGS REFERENZ (03.09., Godot Beam VFX): das Konzept ist ein TROPFEN oder KOMET,
   nicht ein Strich. Fette, satte, runde Kuppe VORN in Flugrichtung; der Koerper
   laeuft nach hinten auf null zu; am Schweifende ein weissglühender Funke.
   Zwei Folgen fuer die Zahlen: KURZ UND DICK statt lang und dünn (ein 2,2 × 0,16-u-
   Faden war „ein lazy Strich ohne Konzept" — sein Wort, und er hat recht), und das
   Verhaeltnis Laenge:Breite bleibt unter 6:1, sonst liest es als Linie.
   `px` ist die Zielgroesse in Bildpunkten auf 12 u — unter 10 px ist eine Form
   unlesbar, egal wie gut sie gezeichnet ist (v5-Befund). */
export const AMMO = {
  streak: { form: 'Komet: satte Kuppe vorn, Schweif auf null, weisser Funke hinten', len: 1.6, wid: 0.34, px: 14, layers: 3 },
  dart:   { form: 'kurzer Pfeil, Spitze vorn', len: 0.9, wid: 0.2, px: 11, layers: 1 },
  slug:   { form: 'schmaler Zylinder mit heisser Spitze, hart', len: 1.3, wid: 0.22, px: 13, layers: 2 },
  glob:   { form: 'Klumpen, asymmetrisch, wobbelt', len: 0.5, wid: 0.55, px: 16, layers: 1 },
  scrap:  { form: 'Splitter, kantig, dreht', len: 0.32, wid: 0.26, px: 10, layers: 1 },
  rocket: { form: 'Zylinder mit Flossen und Flamme', len: 1.1, wid: 0.34, px: 20, layers: 2 },
  bolt:   { form: 'kurzer Komet, zulaufende Spur', len: 1.2, wid: 0.3, px: 13, layers: 3 },
  /* Gegner-Munition: eine Energiekugel, KEIN Komet. Der Unterschied ist Absicht —
     man muss auf Kampfdistanz sehen, ob ein Geschoss zu einem gehoert oder auf einen
     zufliegt, und Silhouette traegt das besser als Farbe (die gegen das Terrain
     verschwindet). Der Schweif ist kurz, die Masse rund. */
  orb:    { form: 'Energiekugel, runde Masse, kurzer Schweif', len: 0.55, wid: 0.44, px: 15, layers: 2 },
  /* GEORGS BEFUND: Ink Mortar und Nest Rocket sahen fast gleich aus — beide fuhren
     `ammo: 'rocket'`, also dasselbe Mesh mit anderer Farbe. Ein Mortar ist aber kein
     Flugkoerper: er wird GEWORFEN. Deshalb eine eigene Silhouette — eine stumpfe,
     dicke Buechse, die TAUMELT statt spitz voran zu fliegen. Das trennt die beiden
     im Flug auf den ersten Blick, ohne dass Farbe die Arbeit machen muss.
     Keine Flossen, keine Flamme: nichts an dieser Munition treibt sich selbst. */
  shell:  { form: 'stumpfe Tuschebuechse, taumelt, Deckel und Band', len: 0.62, wid: 0.5, px: 19, layers: 2 }
};

/* ─── 2b · MÜNDUNG ALS ECHTE FELDER ──────────────────────────────────────────
   VERIFIER-FUND (03.09.): das Mündungsfenster stand als Literal in `_muzzleFx`
   (`kind === 'blast' ? 0.075 : 0.05`), die Anzeige im Schussstand behauptete
   90/50 ms — eine dritte Zahl, die keine Maschine liest. Dieselbe Fehlerklasse wie
   `musicVolume` (deklariert, ungelesen) und der falsche `_diceOn`-Kommentar: ein
   Instrument, das etwas behauptet, was nicht stimmt, ist schlimmer als keins.

   Die Werte hier sind GENAU die, die der Code bisher benutzt hat — nichts ändert
   sich im Bild, aber ab jetzt gibt es EINE Quelle, und der Schussstand kann sie
   stellen. 40–70 ms ist die Grenze aus den Mental Models (M4): ein langer Blitz
   macht die Waffe träge. `blast` darf mit 75 ms knapp darüber liegen, weil eine
   schwere Waffe Gewicht behaupten soll. */
const MUZ_DEFAULTS = { star: [50, 0.8], blast: [75, 1.5], spread: [50, 1.2], rail: [50, 1.0], charge: [50, 0.8] };
for (const k of Object.keys(WEAPONS)) {
  const w = WEAPONS[k], d = MUZ_DEFAULTS[w.muz] || MUZ_DEFAULTS.star;
  if (w.muzMs == null) w.muzMs = d[0];
  if (w.muzSize == null) w.muzSize = d[1];
}

/* ─── 3 · DIE IMPACT-REGEL ────────────────────────────────────────────────────
   Vier Energiearten (was die WAFFE mitbringt) und acht Oberflaechen (was das
   ZIEL mitbringt). Zwoelf Zeilen, 32 Ergebnisse. */

/** Was die Waffe in den Treffer mitbringt. */
export const ENERGY = {
  kinetic:  { cell: 'star',  transient: 'clack', soft: 'thump', tail: 'room',  decal: 'hole',   smoke: 0, hot: 0xfff3cf, stop: 0.02, knock: 0.26 },
  hot:      { cell: 'fire',  transient: 'thump', soft: 'thump', tail: 'room',  decal: 'scorch', smoke: 2, hot: 0xffd27a, stop: 0.04, knock: 0.30 },
  wet:      { cell: 'splat', transient: 'plip',  soft: 'plip',  tail: 'drip',  decal: 'splat',  smoke: 0, hot: 0xb6e35c, stop: 0.03, knock: 0.20 },
  electric: { cell: 'star',  transient: 'crack', soft: 'zap',   tail: 'metal', decal: 'scorch', smoke: 0, hot: 0xd8f6ff, stop: 0.05, knock: 0.34 }
};

/* ⚠ BEFUND 05.09. — DIE ACHSE WAR VERDREHT (Georg: »alle Materialien erzeugen den gleichen Ton«).
   `snd.transient` kam aus ENERGY und wurde nur bei `hard < 0.3` gegen `E.soft` getauscht. Mit einer
   kinetischen Waffe hiessen damit SECHS von acht Oberflaechen `clack` und zwei `thump`. Und der
   Transient ist die Lage, an der das Ohr das Material erkennt: 0-50 ms, laut, breitbandig. Das
   Material lag in `body` — leiser, 12 ms spaeter, gefiltert, also Nachklang. Gleicher Anschlag,
   anderer Nachklang liest sich als »derselbe Ton«.
   Der Kopfkommentar dieses Moduls behauptete es als Absicht (»die Energie setzt Form, Farbe und
   Transient«), `kfb-vfx-recipes.js` §6.1/M3 sagt das Gegenteil und hat recht: die OBERFLAECHE
   bestimmt den Ton, die Waffe FAERBT ihn. Zwei Module, ein Widerspruch, und das falsche lief.
   Seit diesem Stand: `attack` gehoert der Oberflaeche, `pitch` der Waffe. `hard` steuert nur noch
   Ausklingen und Marke — der Anschlag ist davon ENTKOPPELT, damit eine Tonaenderung nie still das
   Bild verschiebt.

   Was das Ziel mitbringt. `mark` sagt, ob etwas liegen bleibt. */
export const SURFACES = {
  earth:  { attack: 'thud',  body: 'dirt',   debris: 'puff',  n: 3, tint: 0xbfae86, hard: 0.35, mark: true,  sfx: 'hitdirt',  react: 'none',   size: 0.85 },
  metal:  { attack: 'ping',  body: 'ring',   debris: 'spark', n: 5, tint: 0xfff3cf, hard: 1.00, mark: true,  sfx: 'hitmetal', react: 'recoil', size: 0.70 },
  /* `bone` hiess `bone` und trug `body: 'flesh'` — der Name log. Jetzt ist es trockener Knochen
     (kurzer harter Anschlag, kein Nachklang); WEICHE Koerper stehen als `flesh` darunter. */
  bone:   { attack: 'click', body: 'dry',    debris: 'shard', n: 3, tint: 0xf3ead3, hard: 0.25, mark: true,  sfx: 'hitbone',  react: 'squash', size: 0.75 },
  flesh:  { attack: 'slap',  body: 'flesh',  debris: 'puff',  n: 3, tint: 0xd98a7a, hard: 0.15, mark: true,  sfx: 'hitbone',  react: 'squash', size: 0.80 },
  wood:   { attack: 'knock', body: 'hollow', debris: 'shard', n: 3, tint: 0xa8865a, hard: 0.60, mark: false, sfx: 'hitwood',  react: 'recoil', size: 0.70 },
  stone:  { attack: 'crack', body: 'grind',  debris: 'shard', n: 3, tint: 0xb9b3a6, hard: 0.90, mark: false, sfx: 'hitstone', react: 'recoil', size: 0.70 },
  glass:  { attack: 'tink',  body: 'shatter',debris: 'shard', n: 6, tint: 0xd6f0f5, hard: 0.95, mark: true,  sfx: 'hitmetal', react: 'recoil', size: 0.70 },
  slime:  { attack: 'splat', body: 'squelch',debris: 'puff',  n: 4, tint: 0x9fd45c, hard: 0.05, mark: true,  sfx: 'splash',   react: 'squash', size: 0.95 },
  /* Luft hat KEINE Marke — das ist eine Regel, kein Versehen: ein Lufttreffer
     kann nichts hinterlassen, worauf man spaeter zeigen koennte. */
  /* Luft hatte `body: 'ring'` — ein Lufttreffer, der metallisch nachklingt, ist genau die Luege,
     die §6.3 beim Namen nennt. Ein Streifschuss ist Luftbewegung: Anschlag ohne Koerper. */
  air:    { attack: 'whiff', body: 'none',   debris: 'spark', n: 4, tint: 0xfff3cf, hard: 0.80, mark: false, sfx: 'hitmetal', react: 'tumble', size: 0.65, force: { knock: 1.4 } },
  /* Wasser darf einen RING haben, weil er dort semantisch eine Welle ist. An jeder
     anderen Oberflaeche waere derselbe Ring ein UI-Marker (§4.5). */
  water:  { attack: 'plop',  body: 'wash',   debris: 'puff',  n: 2, tint: 0x9fd4e6, hard: 0.10, mark: false, sfx: 'splash',   react: 'none',   size: 1.00, force: { cell: 'ring', stop: 0, knock: 0 } },
  shield: { attack: 'chime', body: 'hum',    debris: 'spark', n: 3, tint: 0x8fe6ff, hard: 0.50, mark: false, sfx: 'ping',     react: 'none',   size: 0.90, force: { cell: 'ring', knock: 0.1 } }
};

/* ⚠ OFFENE LUECKE, benannt statt versteckt: `flesh`, `glass` und `slime` haben KEINEN eigenen
   Sample-Namen. Sie leihen `hitbone` / `hitmetal` / `splash`, damit der Bank-Pfad nicht still auf
   »nicht gefunden« laeuft. Der SYNTH-Pfad ist fuer alle drei eigenstaendig. Glas leiht sich damit
   ausgerechnet Metall — im Sample-Pfad ist §6.3 also noch verletzt, im Synth-Pfad nicht mehr. */

/** Die Waffe FAERBT den Anschlag der Oberflaeche, sie ersetzt ihn nicht. Reiner Tonhoehenfaktor. */
export const ATTACK_PITCH = { kinetic: 1, hot: 0.88, wet: 0.80, electric: 1.18 };

const _cache = {};
/**
 * Die abgeleitete Impact-Zelle. Form identisch zur alten v8-Tabelle, damit
 * `_impact()` unverändert damit arbeiten kann:
 *   { cell, sec:[[name,n],…], tint, t, stop, knock, decal, sfx, size, react }
 */
export function resolveImpact(energy, surface, heavy) {
  const key = energy + '|' + surface + '|' + (heavy ? 'h' : 'l');
  if (_cache[key]) return _cache[key];
  const E = ENERGY[energy] || ENERGY.kinetic;
  const S = SURFACES[surface] || SURFACES.earth;
  const f = S.force || {};
  const sec = [[S.debris, Math.max(1, Math.round(S.n * (heavy ? 1.4 : 1)))]];
  if (E.smoke || heavy) sec.push(['smoke', Math.min(3, E.smoke + (heavy ? 1 : 0)) || 1]);
  const out = {
    rule: energy + ' × ' + surface + (heavy ? ' (schwer)' : ''),
    cell: f.cell || E.cell,
    sec: sec.slice(0, 2),                       // hoechstens zwei sekundaere Signale
    tint: S.tint,
    t: S.hard > 0.7 ? 0.35 : S.hard > 0.3 ? 0.55 : 0.70,
    stop: f.stop != null ? f.stop : E.stop * (heavy ? 1.5 : 1),
    knock: f.knock != null ? f.knock : E.knock * (f.knock === 0 ? 0 : (S.hard > 0.6 ? 1 : 0.7)) * (heavy ? 1.3 : 1),
    decal: S.mark ? (heavy && S.hard > 0.5 ? 'crater' : E.decal) : null,
    sfx: S.sfx,
    /* `transient` heisst weiter `transient` (es gibt Leser), traegt aber jetzt den Anschlag der
       OBERFLAECHE. `pitch` ist der Anteil der Waffe — eine Faerbung, keine Identitaet. */
    snd: { transient: S.attack || 'thud', body: S.body || 'none', tail: S.hard > 0.4 ? E.tail : 'none', pitch: ATTACK_PITCH[energy] != null ? ATTACK_PITCH[energy] : 1 },
    react: S.react,
    size: S.size * (heavy ? 1.35 : 1)
  };
  _cache[key] = out;
  return out;
}

/** DAS TOR ZU §6.3, ALS ZAHL STATT ALS MERKSATZ.
 *  Zaehlt, wie viele VERSCHIEDENE Anschlaege die Oberflaechen bei EINER Waffe erzeugen. Vor dem
 *  Fix waren es 2 bei 8 Oberflaechen, und kein Zaehler hat es gemeldet. Bestanden ist nur
 *  `distinct === total` — jede Oberflaeche ihr eigener Anschlag. */
export function attackGate(energy) {
  const keys = Object.keys(SURFACES);
  const seen = {};
  for (const s of keys) seen[resolveImpact(energy || 'kinetic', s, false).snd.transient] = 1;
  const distinct = Object.keys(seen).length;
  return { total: keys.length, distinct: distinct, ok: distinct === keys.length, namen: Object.keys(seen) };
}

/** Alle 32 Zellen als Liste — fuer die Anzeige im Schussstand, nicht fuer die Laufzeit. */
export function impactTable(heavy) {
  const rows = [];
  for (const e of Object.keys(ENERGY)) for (const s of Object.keys(SURFACES)) rows.push(resolveImpact(e, s, heavy));
  return rows;
}

/* ─── 4 · GEGNER-ROSTER ───────────────────────────────────────────────────────
   `ready` heisst: im Spiel verdrahtet und gemessen. `ready:false` heisst: Datei
   liegt im Repo, Clips ungeprueft. Der Unterschied steht hier, damit niemand ein
   Modell fuer einsatzfaehig haelt, weil es in einer Liste steht.

   GEZAEHLT (Georgs Asset-Index, nicht der GitHub-Tree — der filtert .gltf/.glb
   heraus): Ultimate Monsters Bundle hat 17 in `Flying/glTF`, 16 in `Big/glTF`,
   17 in `Blob/glTF`. */
const SPACE = 'media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Characters/GLTF/';
const MONST = 'media/3D_Assets/Ultimate Monsters Bundle-glb/Flying/glTF/';

export const ENEMIES = [
  /* Einsatzfaehig, gemessen (v5–v8): identischer 8-Clip-Satz, EIN Controller. */
  { id: 'flying', name: 'Flieger', file: SPACE + 'Enemy_Flying.gltf', h: 1.7, hp: 62, bolt: 0x5fb8ee, bs: 1.0, dmg: 8, air: true, surface: 'metal', ready: true, clipSet: 'spacekit' },
  { id: 'small', name: 'Kleiner', file: SPACE + 'Enemy_Small.gltf', h: 1.15, hp: 38, bolt: 0x8fe0ff, bs: 0.74, dmg: 6, air: true, surface: 'metal', ready: true, clipSet: 'spacekit' },
  { id: 'xs', name: 'Winzling', file: SPACE + 'Enemy_ExtraSmall.gltf', h: 0.82, hp: 22, bolt: 0xbdf2ff, bs: 0.54, dmg: 4, air: true, surface: 'metal', ready: true, clipSet: 'spacekit' },
  /* KayKit: Rig und Clips gemessen (23 Bones, 25 Clips aus Rig_Medium_*), im Slice
     abgeschaltet weil es keinen Nahkampf gibt — nicht weil sie kaputt sind. */
  { id: 'minion', name: 'KayKit Minion', file: 'media/3D_Assets/KayKit_Skeletons/Skeleton_Minion.glb', h: 1.85, hp: 40, bolt: 0x9ad63f, bs: 0.8, dmg: 9, air: false, surface: 'bone', ready: true, clipSet: 'kaykit' },
  { id: 'mage', name: 'KayKit Mage', file: 'media/3D_Assets/KayKit_Skeletons/Skeleton_Mage.glb', h: 1.85, hp: 46, bolt: 0xc78fff, bs: 0.9, dmg: 11, air: false, surface: 'bone', ready: true, clipSet: 'kaykit' },
  /* Perspektivisch (Georg, 02.09.): zuerst alle 17 Flieger aus dem Monsters
     Bundle, dann der Rest, dann KayKit und Kenney. Clips UNGEPRUEFT — der
     Befund „teilen die Clip-Grammatik der Space-Kit-Gegner exakt" stammt aus
     einer Tree-Abfrage, nicht aus einer Messung. Der Schussstand loggt beim
     Laden die echten Clipnamen; erst dann wird `ready` wahr. */
  ...['Alpaking', 'Alpaking_Evolved', 'Armabee', 'Armabee_Evolved', 'Demon', 'Dragon',
    'Dragon_Evolved', 'Ghost', 'Ghost_Skull', 'Glub', 'Glub_Evolved', 'Goleling',
    'Goleling_Evolved', 'Hywirl', 'Pigeon', 'Squidle', 'Tribal'].map((n) => ({
      id: 'm_' + n.toLowerCase(), name: n.replace(/_/g, ' '), file: MONST + n + '.gltf',
      h: 1.6, hp: 45, bolt: 0x9ad63f, bs: 0.85, dmg: 7, air: true, surface: 'bone',
      ready: false, clipSet: 'monsters'
    }))
];

/** Nur die, die wirklich laufen. */
export const READY = ENEMIES.filter((e) => e.ready);

/* ─── 4b · GEGNER-GESCHOSSE ───────────────────────────────────────────────────
   GEORGS FORDERUNG (03.09.): „ich brauche natürlich auch alle Enemy-Geschosse."
   Richtig — die halbe Lesbarkeitsfrage im Kampf ist „fliegt das auf mich zu?", und
   die kann ein Schussstand nur beantworten, wenn er auch aus der Gegenrichtung
   feuert. Ein Gegner-Schuss ist ein Waffenprofil wie jedes andere; die Zahlen
   (`bolt`, `bs`, `dmg`) stehen schon im Roster, also wird hier nichts erfunden.

   ZUM TINT (Georgs Vorschlag): „Farb-Tint mit der Model-Base-Color, um die Schützen
   besser zuordnen zu können." Das ist die bessere Antwort auf die alte Frage der
   Gegner-Färbung — statt den ganzen Gegner in einen Warmton zu tauchen (was seine
   Zeichnung platt macht, HOUSEKEEPING „Offen 1"), trägt sein GESCHOSS seine
   Grundfarbe. Die Farbe sitzt dann dort, wo sie eine Frage beantwortet, und der
   Wert wird am Modell GEMESSEN statt geraten (`accent`, vom Wirt gesetzt). */
export function enemyShot(K) {
  const bs = K.bs == null ? 1 : K.bs;
  return {
    id: 'enemy-' + K.id,
    name: K.name + ' · Wurf',
    kind: 'GEGNER',
    note: 'Energiekugel · ' + (K.dmg || 7) + ' Schaden',
    /* 12 u/s ist die Chill-Kurve aus v8: eine Kugel, der man weglaufen kann. */
    speed: 12, dmg: K.dmg || 7,
    color: K.bolt || 0x7fd8ff,
    flash: 0xf4fbff,
    glow: true,
    kick: 0,
    energy: 'electric',
    muz: 'charge',
    muzMs: 60, muzSize: 0.55 * bs,
    heft: 0.35 * bs,
    ammo: 'orb',
    scale: bs,
    accent: K.accent || null
  };
}

/* ─── 5 · GESETZTER ZUFALL ────────────────────────────────────────────────────
   Der Schussstand kann nur scrubben, wenn ein Schuss REPRODUZIERBAR ist. Also
   darf kein Effekt `Math.random` benutzen: derselbe Seed und dieselbe Anzahl
   Schritte muessen dasselbe Bild ergeben. mulberry32 ist die Hauskonvention
   (world-context.js, prop-scatter.js, kfb-ink.js). */
export function rng(seed) {
  let a = (seed >>> 0) || 1;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
