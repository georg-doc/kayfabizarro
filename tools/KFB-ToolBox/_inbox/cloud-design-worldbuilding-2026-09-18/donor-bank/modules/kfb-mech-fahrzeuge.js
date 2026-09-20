// ============================================================================
// kfb-mech-fahrzeuge.js — v8-Vorbereitung · Die fünf Mech-Einträge im Fahrzeug-Vertrag
// ----------------------------------------------------------------------------
// Löst `FAHRZEUG_ENTWUERFE` in `kfb-mech-combat.js` ab. Die Entwürfe waren die QUELLE
// (Maße aus der Recon); das hier ist die Form, in der `fahrzeug-vertrag.js` sie annimmt:
// fünf Felder + `features`, dieselbe Schreibweise wie `KARTE`, dieselben Verbote.
//
// DREI DINGE, DIE MAN BEIM LESEN WISSEN MUSS:
//
// 1 **Zwei Maßsysteme, und nur eines gehört uns.** Die Recon hat in METERN gemessen
//   (Bee 2,71 · Panda 2,92 · Frog 3,11 · Flamingo 3,81 · Robot 5,35). Der Globus rechnet
//   in Welteinheiten — aber welcher Bezug dort gilt, entscheidet der Wirt, und er hat ihn
//   am 1.9. abends gewechselt (Figurhöhe 0,15 u → gezeichnete Kartenbreite 0,075 u).
//   Deshalb stehen hier nur noch die VERHÄLTNISSE zwischen den fünf Mechs; die absoluten
//   Höhen entstehen in `skaliereFahrzeuge()`, wenn der Wirt seinen Bezug hereinreicht.
//   Eine absolute Weltgröße im Vertrag ist eine Zahl, die beim nächsten Bezugswechsel
//   fünffach falsch wird, ohne dass jemand es merkt.
//
// 2 **`halbBreite` und `halbTiefe` sind NICHT ausgefüllt, und das ist Absicht.** Die
//   Recon hat nur Höhen geliefert. Zwei erfundene Zahlen im Vertrag wären schlimmer als
//   zwei `null`: der Trefferkasten hängt daran (`landmark-collide`, Würfelfenster), und
//   eine Zahl, die niemand gemessen hat, wird beim ersten Fehler verteidigt statt
//   nachgemessen. Stattdessen liegt unten `messeRumpf()` — dieselbe Bone-Box-Methode wie
//   die Recon, als Funktion. Ein Lauf im Slice füllt beide Zellen und BELEGT dabei die
//   Höhe, die hier schon steht. Eine gemessene Kante schlägt ein gepflegtes Feld.
//
// 3 **Die benannte Naht geht auf.** `KARTE.wakeUrsprung.ort` ist `'mitte'`, und
//   `fahrzeug-vertrag.js` schreibt dazu: „Das Feld existiert jetzt und ist noch niemandes
//   Eingang — es benennt eine Naht, die beim zweiten Fahrzeug aufgeht." Der Mech IST das
//   zweite Fahrzeug, und für einen Läufer ist der Ursprung `'fuesse'`. Das ist ab hier
//   keine Notiz mehr, sondern eine Aufgabe des Wirts: `carpet-wake.fahnen()` bekommt den
//   Ursprung aus dem Fahrzeug statt aus `carpet.worldPos()`. Ohne das lügt der Vertrag.
// ============================================================================

export const version = 'mf-v1';

/* ── DER MASSSTAB GEHOERT DEM WIRT, DIE PROPORTION DER RECON ──────────────────
   Bis zum 1.9. mittags stand hier eine absolute Zahl: 0,15 u Figurhoehe als Bezug,
   k = 0,039370. Am selben Abend hat v9 den Bezug gewechselt — der Mech-Massstab haengt
   jetzt an der GEZEICHNETEN Kartenbreite (0,075 u), und v8 stand auf 4,27 Kartenbreiten.
   Das ist ein Faktor 2,13 gegen meine Tabelle.

   Lehre daraus, und sie ist wichtiger als die Zahl: **eine absolute Weltgroesse hat im
   Vertrag nichts verloren.** Der Wirt besitzt die Welt und darf ihren Massstab drehen;
   was die Recon besitzt, sind die VERHAELTNISSE zwischen den fuenf Mechs. Also stehen
   hier nur noch Verhaeltnisse, und die absoluten Hoehen entstehen erst, wenn der Wirt
   seinen Bezug hereinreicht (`skaliereFahrzeuge`). Beim naechsten Bezugswechsel ist
   dann eine Zeile zu aendern statt fuenf. */
export const PROPORTION = {
  bezug: 'flamingo',
  quelle: 'Recon 01.09. (Bone-Box in Modell-Metern), nie Box3.setFromObject',
  // dimensionslos, Flamingo = 1
  faktor: { bee: 2.71 / 3.81, panda: 2.92 / 3.81, frog: 3.11 / 3.81, flamingo: 1, robot: 5.35 / 3.81 }
};

/* Der aktuelle Bezug des Wirts. EINE Stelle, und sie ist als Vermutung markiert, bis
   drueben jemand bestaetigt, worauf sich „4,27 Kartenbreiten" bezieht. */
export const WIRTS_BEZUG = {
  einheit: 'kartenbreite',
  kartenbreiteU: 0.075,
  bezugsMechInKartenbreiten: 4.27,
  stand: 'v9, 01.09. abends',
  offen: 'gilt 4,27 fuer den Flamingo oder fuer den gemessenen v8-Mech? Davon haengen alle fuenf Hoehen ab.'
};

const BONE_BOX_M = { bee: 2.71, panda: 2.92, frog: 3.11, flamingo: 3.81, robot: 5.35 };

const MECHS = [
  { id: 'flamingo', datei: 'Mech by Quaternius - tLs9mFVCSU.glb', name: 'Fernando · Flamingo', sig: 'stinger' },
  { id: 'bee', datei: 'Mech by Quaternius - 4UvIHxnoSR.glb', name: 'Barbara · Bee', sig: 'hornet' },
  { id: 'panda', datei: 'Mech by Quaternius - D5wW2jDO42.glb', name: 'Rae · Red Panda', sig: 'railgun' },
  { id: 'frog', datei: 'Mech by Quaternius - o3Ps8z8ByP.glb', name: 'Finn · Frog', sig: 'acid' },
  { id: 'robot', datei: 'Animated Robot by Quaternius - QCm7qe9uNJ.glb', name: 'Scrapper · Robot', sig: 'scrap' }
];

/* FX-Geschmack je Signaturwaffe. Kein Codezweig — eine Zeile je Mech, wie beim Vertrag
   vorgesehen: „Jeder weitere Mech ist dann nur ein weiterer Eintrag." */
const FX_GESCHMACK = {
  stinger: { kaskaden: ['ground.touch', 'hit.kinetic'], wirker: ['dust', 'spark'], geschmack: 'staub · funken · schnellfeuer' },
  hornet:  { kaskaden: ['ground.touch', 'hit.kinetic'], wirker: ['dust', 'spark'], geschmack: 'staub · schwarm · gold' },
  railgun: { kaskaden: ['ground.touch', 'hit.electric'], wirker: ['dust', 'spark'], geschmack: 'staub · blitz · knall' },
  acid:    { kaskaden: ['ground.touch', 'hit.wet'], wirker: ['dust', 'splat'], geschmack: 'staub · ätzpfütze · grün' },
  scrap:   { kaskaden: ['ground.touch', 'hit.kinetic'], wirker: ['dust', 'debris'], geschmack: 'staub · schrott · streuung' }
};

const num = (v, d) => (v == null ? null : +(+v).toFixed(d == null ? 6 : d));

function baueEintrag(m) {
  const hM = BONE_BOX_M[m.id];
  return {
    id: 'mech-' + m.id,
    name: m.name,
    mesh: 'media/3D_Assets/KFB/' + m.datei + ' (RAW)',

    // ── 1 · SITZ ──────────────────────────────────────────────────────────
    // Kein Sitz im Wortsinn: der Läufer IST das Fahrzeug. `hoehe: 'gelesen'` heißt hier
    // aber etwas Konkreteres als bei der Karte — gelesen wird `kfb-mech-boden.lies()`,
    // also die FACETTE unter dem Fuß, nicht `surfaceAltitudeAt`. Genau daran hing der
    // Sink-Befund; siehe SINK_BEFUND im Boden-Modul.
    sitz: { vorLaengs: 0, hoehe: 'gelesen', fussRadius: null, blick: 'flugrichtung', clip: false, leser: 'kfb-mech-boden' },

    // ── 2 · RUMPF ─────────────────────────────────────────────────────────
    // `hoehe` ist NULL, bis der Wirt seinen Bezug hereinreicht — siehe PROPORTION.
    // Was hier steht, ist gemessen und aendert sich nie: die Modellhoehe und der
    // Anteil am Bezugsmech. Breite und Tiefe sind offen; siehe Kopfnotiz 2 und `messeRumpf`.
    rumpf: {
      form: 'laeufer',
      hoehe: null, hoeheModellM: hM, anteil: num(PROPORTION.faktor[m.id], 5),
      halbBreite: null, halbTiefe: null,
      quelle: 'Bone-Box (Recon 01.09.), nie Box3.setFromObject — Bind-Space liefert Phantomhöhe 217'
    },

    // ── 3 · WAKE-URSPRUNG ─────────────────────────────────────────────────
    // Die Naht aus dem Vertrag, jetzt mit Inhalt. `gelesenVon` nennt die Bones, damit der
    // Wirt weiß, was er lesen soll, statt es zu raten.
    wakeUrsprung: { ort: 'fuesse', laengs: 0, gelesenVon: ['FootL', 'FootR'] },

    // ── 4 · NEIGUNGSGRENZEN ───────────────────────────────────────────────
    // bank/driftBank spiegeln die Physik (Vorgabe aus ENTWURF_LAEUFER: ein Läufer legt
    // sich nicht in die Kurve wie ein Teppich). steigungMax und kanteAb sind Gelände-,
    // keine Flugwerte — sie stammen aus dem Terrain-Kontakt von Slice v2 und sagen, ab
    // wann der Läufer nicht mehr hinaufkommt bzw. fällt.
    neigungsgrenzen: {
      bank: 0.12, driftBank: 0.05, rigRoll: 0.1, rigPitch: 0.1, rigYaw: 0.2,
      steigungMax: 0.9, kanteAb: 0.35
    },

    // ── 5 · FX ────────────────────────────────────────────────────────────
    fx: Object.assign({ signatur: m.sig, tracer: 'streak-billboard (Atlas-Kachel, Kopf hell, Schwanz aus)', decal: 'kfb-ink hole 0.55 u' }, FX_GESCHMACK[m.sig]),

    features: {
      fliegt: false, schwimmt: false, geht: true,
      schiesst: true, barrelRoll: false, blaetter: false, staub: true, gischt: false,
      tutorial: null
    },

    // Was der Modus in `params` dreht. Formgleich mit ENTWURF_LAEUFER, damit die
    // Verbots-Prüfung sie überspringen kann wie dort.
    paramsUeberschreibung: { hoverHeight: 0.0, boostHeight: 0.02, maxSpeed: null, maxBank: 0.12 },
    schrittTiming: 'mixer.timeScale = tempo / schrittLaenge',
    offeneMessungen: ['rumpf.halbBreite', 'rumpf.halbTiefe', 'sitz.fussRadius', 'walk-wurzelversatz']
  };
}

export const MECH_FAHRZEUGE = MECHS.reduce((a, m) => { a['mech-' + m.id] = baueEintrag(m); return a; }, {});
export const MECH_LISTE = Object.values(MECH_FAHRZEUGE);

/**
 * Die absoluten Hoehen entstehen HIER, mit dem Bezug des Wirts — nicht in der Tabelle.
 * Ohne diesen Aufruf steht `rumpf.hoehe` auf `null`, und das Tor meldet es. Ein Vertrag,
 * der eine Weltgroesse behauptet, die der Wirt inzwischen anders rechnet, ist schlimmer
 * als einer, der die Luecke zeigt.
 *
 * @param o.kartenbreiteU            Weltbreite der gezeichneten Karte (v9: 0,075)
 * @param o.bezugsMechInKartenbreiten  wie viele davon der Bezugsmech hoch ist (v9: 4,27)
 */
export function skaliereFahrzeuge(o) {
  const O = o || {};
  const kb = O.kartenbreiteU != null ? O.kartenbreiteU : WIRTS_BEZUG.kartenbreiteU;
  const n = O.bezugsMechInKartenbreiten != null ? O.bezugsMechInKartenbreiten : WIRTS_BEZUG.bezugsMechInKartenbreiten;
  const bezugU = kb * n;                       // Welthoehe des Bezugsmechs
  for (const e of MECH_LISTE) e.rumpf.hoehe = num(bezugU * e.rumpf.anteil);
  return { bezugU: num(bezugU), kartenbreiteU: kb, bezugsMechInKartenbreiten: n,
           hoehen: MECH_LISTE.reduce((a, e) => { a[e.id] = e.rumpf.hoehe; return a; }, {}) };
}

// ============================================================================
// Das Instrument, das die zwei offenen Zellen füllt
// ----------------------------------------------------------------------------
// BONE-BOX, nicht Box3: `Box3.setFromObject` liest bei diesen SkinnedMeshes den
// Bind-Space und meldet Phantomhöhe 217. Gemessen werden deshalb die WELTPOSITIONEN der
// Bones — dasselbe Verfahren, aus dem die fünf Höhen oben stammen. Wer diese Funktion
// laufen lässt, bekommt Breite und Tiefe UND eine Kontrollprobe auf die Höhe: weicht sie
// um mehr als 2 % ab, ist die Tabelle veraltet und nicht die Messung falsch.
// ============================================================================

export function messeRumpf(THREE, root, o) {
  const opt = o || {};
  if (!THREE || !root) return null;
  root.updateWorldMatrix(true, true);
  const v = new THREE.Vector3();
  let n = 0;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
  root.traverse((b) => {
    if (!b.isBone) return;
    // `PoleTargetL/R` sind IK-Hilfen und stehen weit außerhalb der Figur — sie als Anker
    // zu nehmen ist eine der Recon-Fallen und bläht jede Box auf.
    if (/PoleTarget/i.test(b.name)) return;
    b.getWorldPosition(v);
    n++;
    if (v.x < minX) minX = v.x; if (v.x > maxX) maxX = v.x;
    if (v.y < minY) minY = v.y; if (v.y > maxY) maxY = v.y;
    if (v.z < minZ) minZ = v.z; if (v.z > maxZ) maxZ = v.z;
  });
  if (!n) return null;
  const hoehe = maxY - minY, breite = maxX - minX, tiefe = maxZ - minZ;
  return {
    bones: n,
    hoeheModellM: num(hoehe, 3),
    halbBreiteModellM: num(breite / 2, 3),
    halbTiefeModellM: num(tiefe / 2, 3),
    // In Welteinheiten kann diese Funktion nichts sagen — der Massstab gehoert dem Wirt.
    // Sie liefert Modellmasse und den Anteil; `skaliereFahrzeuge` macht daraus Welt.
    anteilZuFlamingo: num(hoehe / 3.81, 5),
    methode: 'Bone-Weltpositionen ohne PoleTarget*',
    hinweis: opt.hinweis || null
  };
}

/**
 * Tor. Prüft dieselben Dinge wie `vertragTor` für die Karte, plus die zwei Mech-eigenen
 * Fragen: stimmt die Tabellenhöhe mit der Messung, und hat der Wirt den Fuß-Ursprung
 * inzwischen als Eingang? `ist` sind LIVE gelesene Werte, nichts wird hier gerechnet.
 *
 * @param ist.verboteneFelder  Liste aus fahrzeug-vertrag.VERBOTENE_FELDER
 * @param ist.kaskaden         KASKADEN aus fx-script.js
 * @param ist.wakeOrt          wie der Runner den Wake heute speist ('mitte' | 'fuesse' | null)
 * @param ist.messungen        { 'mech-bee': messeRumpf(...), … } — optional
 */
export function mechTor(ist) {
  const I = ist || {};
  const z = [];
  let ok = 0, von = 0, nichtMessbar = 0;
  const pruef = (name, urteil, text) => {
    if (urteil === null) { nichtMessbar++; z.push('– ' + name + ' ' + text + ' (nicht messbar)'); return; }
    von++; if (urteil) ok++;
    z.push((urteil ? '✓ ' : '✗ ') + name + ' ' + text);
  };
  const FELDER = ['sitz', 'rumpf', 'wakeUrsprung', 'neigungsgrenzen', 'fx'];

  const fehlend = [];
  for (const e of MECH_LISTE) for (const k of FELDER) if (e[k] == null) fehlend.push(e.id + '.' + k);
  pruef('fields', fehlend.length === 0, MECH_LISTE.length + ' Einträge × ' + FELDER.length + ' Felder' + (fehlend.length ? ' fehlt: ' + fehlend.join(',') : ''));

  if (Array.isArray(I.verboteneFelder)) {
    const treffer = [];
    const scan = (o, pfad) => {
      if (!o || typeof o !== 'object') return;
      for (const k of Object.keys(o)) {
        if (I.verboteneFelder.includes(k)) treffer.push(pfad + '.' + k);
        if (o[k] && typeof o[k] === 'object' && k !== 'paramsUeberschreibung') scan(o[k], pfad + '.' + k);
      }
    };
    for (const e of MECH_LISTE) scan(e, e.id);
    pruef('no physics fields', treffer.length === 0, treffer.length ? treffer.join(',') : '0 von ' + I.verboteneFelder.length + ' verbotenen Namen');
  } else pruef('no physics fields', null, 'VERBOTENE_FELDER nicht gereicht');

  if (I.kaskaden) {
    const unbekannt = [];
    for (const e of MECH_LISTE) for (const n of e.fx.kaskaden) if (!I.kaskaden[n]) unbekannt.push(e.id + ':' + n);
    pruef('fx cascades defined', unbekannt.length === 0, unbekannt.length ? '⚠ unbekannt: ' + unbekannt.join(',') : 'alle Kaskadennamen vorhanden');
  } else pruef('fx cascades defined', null, 'KASKADEN nicht gereicht');

  // Massstab: eine Stelle, fuenf Eintraege. Solange `skaliereFahrzeuge` nicht lief, gibt es
  // keine Welthoehen — und das ist der richtige Zustand, kein Fehler.
  const ohne = MECH_LISTE.filter((e) => e.rumpf.hoehe == null);
  pruef('scaled by host reference', ohne.length === 0,
        ohne.length ? ohne.length + ' Eintraege ohne Welthoehe — skaliereFahrzeuge() nicht gelaufen'
                    : 'Bezug ' + WIRTS_BEZUG.kartenbreiteU + ' u × ' + WIRTS_BEZUG.bezugsMechInKartenbreiten
                      + ' · Anteile ' + MECH_LISTE.map((e) => e.rumpf.anteil.toFixed(2)).join('/'));

  // Höhe gegen die Messung — die Kontrollprobe auf die Recon.
  if (I.messungen) {
    const ab = [];
    for (const e of MECH_LISTE) {
      const m = I.messungen[e.id]; if (!m || m.hoeheModellM == null) continue;
      const rel = Math.abs(m.hoeheModellM - e.rumpf.hoeheModellM) / (e.rumpf.hoeheModellM || 1);
      if (rel > 0.02) ab.push(e.id + ' ' + e.rumpf.hoeheModellM + ' vs gemessen ' + m.hoeheModellM);
    }
    pruef('table height matches bone box', ab.length === 0, ab.length ? ab.join(' · ') : 'alle innerhalb 2 %');
  } else pruef('table height matches bone box', null, 'messeRumpf() noch nicht gelaufen');

  // Die Naht. Solange der Runner den Wake aus der Mitte speist, ist 'fuesse' eine Zusage
  // ohne Eingang — und der Vertrag soll genau das melden, nicht darüber hinweggehen.
  pruef('wake origin has a reader', I.wakeOrt == null ? null : I.wakeOrt === 'fuesse',
        "Zusage 'fuesse'" + (I.wakeOrt ? " vs Runner '" + I.wakeOrt + "'" : '') + (I.wakeOrt === 'mitte' ? ' — carpet-wake liest noch carpet.worldPos()' : ''));

  const offen = MECH_LISTE.reduce((n, e) => n + e.offeneMessungen.length, 0);
  return {
    ok: ok === von, bestanden: ok, von, nichtMessbar, zeilen: z,
    text: (ok === von ? '✓ ' : '✗ ') + ok + '/' + von + ' · ' + MECH_LISTE.length + ' Läufer im Vertrag ('
          + offen + ' Messungen offen)' + (nichtMessbar ? '  ·  ' + nichtMessbar + ' nicht messbar' : '')
  };
}
