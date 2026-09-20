// ============================================================================
// fahrzeug-vertrag.js — v7 · Der Fahrzeug-Vertrag (Georg, 30.8.: „nur Skins")
// ----------------------------------------------------------------------------
// **Was diese Datei IST:** eine Merkmalstabelle. Ein Fahrzeug ist hier kein Typ mit
// Sonderfällen, sondern ein Eintrag mit fünf Feldern plus `features` — die Bauform, die in
// tinyskies `vehicleFeatures` (`Game.ts`) heißt und die unser Backlog unabhängig davon
// beschrieben hat. Damit ist sie belegt, nicht geraten.
//
// **Was diese Datei NICHT ist:** ein Bewegungsrechner. Tempo, Kurvenrate, Trägheit und
// Höhenband gehören `carpet.js`, und zwar ausschließlich. Ein Feld, das ein Fahrzeug in die
// Physik hineinreichen lässt, ist der erste Schritt zur zweiten Flugphysik — deshalb prüft
// `vertragTor()` unten ausdrücklich auf VERBOTENE Felder. Ein Vertrag, der nur sagt, was
// erlaubt ist, wird durch Anbauten ausgehöhlt; einer, der Verbote zählt, meldet den Anbau.
//
// **Warum jetzt:** solange es EIN Fahrzeug gibt, kostet der Vertrag eine Datei. Ab dem
// zweiten kostet jedes fehlende Feld eine Sonderabfrage in acht Modulen (`carpet-wake`,
// `drift-smoke`, `carpet-leaves`, `card-shadow`, `landmark-collide`, `pet-kinetics`,
// `camera-rig`, `sky-dice`). Die Quelle zeigt den Preis: ~20 verstreute `if (!inCosmicVoid)`.
//
// **Und die Regel dieses Projekts, die hier den Ton setzt (PM-41):** ein Prüfwerkzeug ohne
// Kontrollprobe ist eine Meinung. `vertragTor()` VERGLEICHT deshalb die Zusagen mit den
// LIVE gelesenen Werten der Module (Kartenmaße aus dem Rig, `maxBank` aus der Physik,
// Kaskadennamen aus `KASKADEN`) statt sie zu behaupten. Wer eine Zahl in `carpet.js`
// ändert, ohne sie hier nachzuziehen, bekommt ein ✗ mit beiden Zahlen daneben.
// ============================================================================

import { KASKADEN } from './fx-script.js';

/** Die fünf Felder. Reihenfolge ist Dokumentation, nicht Technik. */
export const VERTRAG_FELDER = ['sitz', 'rumpf', 'wakeUrsprung', 'neigungsgrenzen', 'fx'];

/** Was ein Fahrzeug NIE mitbringen darf. Jeder Name hier ist ein Stück Flugphysik. */
export const VERBOTENE_FELDER = [
  'tempo', 'maxSpeed', 'minSpeed', 'accel', 'traegheit', 'inertia',
  'kurvenrate', 'turnRate', 'turnMult', 'traction', 'hoehenband', 'hoverHeight', 'boostHeight',
];

/**
 * **Die Karte — das einzige gebaute Fahrzeug.**
 *
 * Alle Längen in WELTMASS (u), nicht in Rig-Maß. Der Umrechner ist eine Zahl:
 * `CARD_WELT / 3.0 = 0.025` (der Rig ist native 3,0 breit; der Maßstab gehört der Gruppe,
 * nie der Kartenbreite — siehe `globe-poc.js` an der Stelle, wo `width: 0.075` das Pet
 * einmal verschwinden ließ).
 */
export const KARTE = {
  id: 'karte',
  name: 'KFB card (v17 carrier rig)',
  mesh: 'terrain-planets-v1/card-carrier.js',

  // ── 1 · SITZ ──────────────────────────────────────────────────────────────
  // Der Sitz ist KEINE Konstante: `plantSeat()` liest die verformte Kartenfläche jeden
  // Frame und mittelt über den Fußabdruck (Radius 0,13 Rig-Maß, gemessen an den vier
  // Beinen). Der Vertrag sagt deshalb nicht „Höhe 0,001375", sondern `hoehe: 'gelesen'` —
  // eine Wanne mit festem Wannenboden sagt hier eine Zahl, und genau dieser Unterschied
  // ist der Grund für das Feld.
  sitz: {
    vorLaengs: 0.12,        // Anteil der Kartentiefe vor der Mitte (CD * 0.12)
    hoehe: 'gelesen',       // je Bild aus der Fläche, nicht gesetzt
    fussRadius: 0.13,       // Rig-Maß · Mittelungsradius der Auflage
    blick: 'flugrichtung',
    clip: true,             // Clip-Ebene schneidet Füße an der Kartenfläche ab
  },

  // ── 2 · RUMPF ─────────────────────────────────────────────────────────────
  // Trefferkasten und halbe Breite. Karten- und Würfel-Trefferfenster rechnen mit der
  // Avatarbreite; ändert sie sich stumm, verschieben sich zwei Spielmechaniken.
  rumpf: {
    halbBreite: 0.0375,     // 1,5 Rig · 0,025
    halbTiefe: 0.020951,    // 0,83813 Rig · 0,025  (CD = CW · 447/800)
    dicke: 0.001375,        // TH 0,055 Rig · 0,025
    form: 'platte',
  },

  // ── 3 · WAKE-URSPRUNG ─────────────────────────────────────────────────────
  // ⚠ **Hier steht der Befund, nicht der Wunsch.** Gischt und Driftstaub entstehen heute
  // an `qPosition` — also in der MITTE des Fahrzeugs (`carpet-wake.fahnen(qPosition, …)`).
  // Für die Karte ist das richtig. Für ein Boot mit Außenborder ist es falsch, und der
  // Backlog nennt die Reparatur seit dem 30.8.: den Ursprung aus dem Fahrzeug lesen statt
  // aus `carpet.worldPos()`. **Das Feld existiert jetzt und ist noch niemandes Eingang** —
  // es benennt eine Naht, die beim zweiten Fahrzeug aufgeht, ohne heute Verhalten zu
  // ändern. Ein Fork ändert Pfade und Etiketten (LIVING §05x); dieses Slice ändert
  // Zusagen und Instrumente, keine Bewegung.
  wakeUrsprung: { ort: 'mitte', laengs: 0, gelesenVon: null },

  // ── 4 · NEIGUNGSGRENZEN ───────────────────────────────────────────────────
  // Aussehen, nicht Physik: ein Teppich darf kippen, eine Wanne kentert. Die zwei
  // PHYSIK-Werte (bank, driftBank) stehen hier als SPIEGEL von `carpet.params` und werden
  // vom Tor dagegen geprüft — sie sind Zusage über das Aussehen, nicht ihre Quelle.
  neigungsgrenzen: {
    bank: Math.PI / 4,      // Spiegel von carpet.params.maxBank
    driftBank: Math.PI / 5, // Spiegel von carpet.params.driftBankMax
    rigRoll: 0.7,           // card-carrier: Federklemme roll
    rigPitch: 0.5,          // card-carrier: Federklemme pitch
    rigYaw: 0.35,           // card-carrier: Federklemme yawWhip (Heckschwenk)
  },

  // ── 5 · FX ────────────────────────────────────────────────────────────────
  // Welche Kaskaden dieses Fahrzeug auslöst und welche Wirker es dafür braucht.
  // `water.enter` heißt beim Boot etwas anderes als beim Teppich — deshalb Vertragsfeld.
  fx: {
    kaskaden: ['water.enter', 'ground.touch'],
    wirker: ['wake', 'dust', 'leaves'],
    geschmack: 'papier · blätter · staub',
  },

  // ── features · die Tabelle, die der Frame-Loop fragt ──────────────────────
  // Aus `vehicleFeatures` der Quelle: Merkmale, keine Typprüfung. `if (fahrzeug.features.x)`
  // ist erlaubt, `if (fahrzeug.id === 'karte')` ist der Anfang der Sonderfälle.
  features: {
    fliegt: true, schwimmt: false, geht: false,
    schiesst: true, barrelRoll: true, blaetter: true, staub: true, gischt: true,
    tutorial: null,          // ein freispielbares Fahrzeug ohne Einführung ist eine Fehlbedienung
  },
};

/**
 * **ENTWURF · der Läufer (E-43).** Absichtlich KEIN gebautes Fahrzeug: `null` heißt hier
 * „noch nicht gemessen", nicht „egal". Das Tor prüft diesen Eintrag NICHT (E-30: ein Modul,
 * das nicht gelesen wurde, wird nicht beurteilt) — es zählt nur, wie viele Felder offen sind.
 *
 * Der Eintrag ist trotzdem der halbe Slice: er sagt, welche Messungen fehlen, bevor jemand
 * baut. `hoehe` und `rumpf` hängen am GLB (`Rabbit by Quaternius - mKev485XTR.glb`, steht
 * NICHT im `asset-repo.json` — vor dem Slice einmal indizieren: Maßstab, Clips, `walk`).
 */
export const ENTWURF_LAEUFER = {
  id: 'laeufer', name: 'Pet with walk cycle (invisible vehicle)', entwurf: true,
  mesh: null,                                   // GLB noch nicht indiziert
  sitz: { vorLaengs: 0, hoehe: 'boden', fussRadius: null, blick: 'flugrichtung', clip: false },
  rumpf: { halbBreite: null, halbTiefe: null, dicke: null, form: 'figur' },
  wakeUrsprung: { ort: 'fuesse', laengs: 0, gelesenVon: null },
  neigungsgrenzen: { bank: 0.12, driftBank: 0.05, rigRoll: 0.1, rigPitch: 0.1, rigYaw: 0.2 },
  fx: { kaskaden: ['ground.touch'], wirker: ['dust'], geschmack: 'staub · schritt' },
  features: { fliegt: false, schwimmt: false, geht: true,
              schiesst: true, barrelRoll: false, blaetter: false, staub: true, gischt: false,
              tutorial: null },
  // Was der Modus in `params` dreht — kein Codezweig, 31 Werte sind seit Slice D freigelegt.
  paramsUeberschreibung: { hoverHeight: 0.0, boostHeight: 0.02, maxSpeed: null, maxBank: 0.12 },
  schrittTiming: 'mixer.timeScale = tempo / schrittLaenge',
  offeneMessungen: ['bodenhoehe-aus-mesh', 'massstab', 'glb-index'],
};

export const FAHRZEUGE = { karte: KARTE };

/** **ENTWÜRFE · die fünf Mechs (v8, Briefing 1.9.: Mech = Fahrzeug, KISS).** Quelle ist das
 *  angelieferte Modul — Bone-Box-Maße der Recon, nie Box3. Wie beim Läufer gilt: `entwurf`
 *  heißt „noch nicht gemessen im Wirt", das Tor prüft sie NICHT (E-30), es zählt sie nur.
 *  Der erste Wirt-Beweis läuft über `mech-station.js` (Ladepfad + Maßstab); erst danach wird
 *  aus einem Entwurf ein gebautes Fahrzeug mit gemessenen Rumpf-Halbmassen. */
export { FAHRZEUG_ENTWUERFE as MECH_ENTWUERFE } from '../modules/kfb-mech-combat.js';

// ============================================================================
// Das Tor
// ----------------------------------------------------------------------------
// `ist` sind die LIVE gelesenen Werte. Keiner davon wird hier gerechnet — sie kommen aus
// den Modulen, die sie besitzen:
//   { maxBank, driftBankMax }        ← carpet.params
//   { halbBreite, halbTiefe, dicke } ← card-carrier (halfW/halfD/TH) × Weltmaßstab
//   { sitzVor }                      ← seat.position.z / Kartentiefe
//   { wakeOrt }                      ← wie der Runner den Wake heute speist
// Fehlt ein Wert, sagt die Zeile „nicht messbar" — und das ist ein zulässiges Urteil,
// „falsch" wäre keines.
// ============================================================================

const G = (x) => (x == null ? null : +x);
const nah = (a, b, eps) => (a == null || b == null ? null : Math.abs(a - b) <= (eps || 1e-6));
const grad = (r) => (r * 180 / Math.PI).toFixed(1) + '°';

export function vertragTor(ist = {}) {
  const F = KARTE, z = [];
  let ok = 0, von = 0, nichtMessbar = 0;

  const pruef = (name, urteil, text) => {
    if (urteil === null) { nichtMessbar++; z.push('– ' + name + ' ' + text + ' (nicht messbar)'); return; }
    von++; if (urteil) ok++;
    z.push((urteil ? '✓ ' : '✗ ') + name + ' ' + text);
  };

  // 1 · Vollständigkeit. Ein fehlendes Feld ist eine Sonderabfrage in Wartestellung.
  const fehlend = VERTRAG_FELDER.filter((k) => F[k] == null);
  pruef('fields', fehlend.length === 0,
        VERTRAG_FELDER.length + '/' + VERTRAG_FELDER.length + (fehlend.length ? ' fehlt: ' + fehlend.join(',') : ''));

  // 2 · Verbotene Felder. Der Vertrag zählt Verbote, nicht nur Erlaubnisse.
  const verboten = [];
  const scan = (o, pfad) => {
    if (!o || typeof o !== 'object') return;
    for (const k of Object.keys(o)) {
      if (VERBOTENE_FELDER.includes(k)) verboten.push((pfad ? pfad + '.' : '') + k);
      if (o[k] && typeof o[k] === 'object' && k !== 'paramsUeberschreibung') scan(o[k], (pfad ? pfad + '.' : '') + k);
    }
  };
  scan(F, '');
  pruef('no physics fields', verboten.length === 0,
        verboten.length ? verboten.join(',') : '0 of ' + VERBOTENE_FELDER.length + ' forbidden names');

  // 3 · Schräglage = Physik. Wer `maxBank` dreht, ohne hier nachzuziehen, sieht es hier.
  pruef('bank mirrors carpet', nah(G(ist.maxBank), F.neigungsgrenzen.bank),
        grad(F.neigungsgrenzen.bank) + (ist.maxBank == null ? '' : ' vs physics ' + grad(ist.maxBank)));
  pruef('driftBank mirrors carpet', nah(G(ist.driftBankMax), F.neigungsgrenzen.driftBank),
        grad(F.neigungsgrenzen.driftBank) + (ist.driftBankMax == null ? '' : ' vs ' + grad(ist.driftBankMax)));

  // 4 · Rumpfmaße gegen das GEMESSENE Rig (nicht gegen die Notiz im Rig).
  pruef('hull half-width', nah(G(ist.halbBreite), F.rumpf.halbBreite, 5e-5),
        F.rumpf.halbBreite.toFixed(5) + ' u' + (ist.halbBreite == null ? '' : ' vs rig ' + G(ist.halbBreite).toFixed(5)));
  pruef('hull half-depth', nah(G(ist.halbTiefe), F.rumpf.halbTiefe, 5e-5),
        F.rumpf.halbTiefe.toFixed(5) + ' u' + (ist.halbTiefe == null ? '' : ' vs rig ' + G(ist.halbTiefe).toFixed(5)));

  // 5 · Sitz: der Längsversatz ist eine Zahl, die Höhe ist eine ZUSAGE („gelesen").
  pruef('seat offset', nah(G(ist.sitzVor), F.sitz.vorLaengs, 2e-3),
        F.sitz.vorLaengs.toFixed(2) + ' × depth' + (ist.sitzVor == null ? '' : ' vs rig ' + G(ist.sitzVor).toFixed(3)));
  pruef('seat height is read per frame', F.sitz.hoehe === 'gelesen', "'" + F.sitz.hoehe + "' (S93f)");

  // 6 · FX: die Kaskadennamen müssen in der Tabelle existieren. Ein Fahrzeug, das eine
  //     Kaskade verspricht, die niemand definiert hat, ist eine Notiz, kein Vertrag.
  const unbekannt = F.fx.kaskaden.filter((n) => !KASKADEN[n]);
  pruef('fx cascades defined', unbekannt.length === 0,
        F.fx.kaskaden.join(',') + (unbekannt.length ? ' ⚠ unknown: ' + unbekannt.join(',') : ''));

  // 7 · Der Wake-Ursprung ist die BENANNTE Naht: Zusage und Ist müssen übereinstimmen,
  //     und das Feld ist noch niemandes Eingang. Das ist keine Lücke, das ist der Befund.
  pruef('wake origin as built', ist.wakeOrt == null ? null : ist.wakeOrt === F.wakeUrsprung.ort,
        "'" + F.wakeUrsprung.ort + "'" + (ist.wakeOrt ? ' vs runner ' + "'" + ist.wakeOrt + "'" : '')
        + ' · no reader yet (boat needs heck)');

  const offen = ENTWURF_LAEUFER.offeneMessungen.length;
  const entwurfNull = ['sitz', 'rumpf', 'wakeUrsprung'].reduce((n, k) => {
    const o = ENTWURF_LAEUFER[k]; return n + Object.keys(o).filter((x) => o[x] == null).length;
  }, 0) + (ENTWURF_LAEUFER.mesh == null ? 1 : 0);

  return {
    ok: ok === von, bestanden: ok, von, nichtMessbar, zeilen: z,
    text: (ok === von ? '✓ ' : '✗ ') + ok + '/' + von + ' · 1 vehicle built, 1 draft ('
          + entwurfNull + ' fields open, ' + offen + ' measurements pending)'
          + (nichtMessbar ? '  ·  ' + nichtMessbar + ' not measurable' : ''),
  };
}
