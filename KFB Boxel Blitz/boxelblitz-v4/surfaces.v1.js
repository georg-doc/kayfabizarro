/* physics-lab/surfaces.v1.js — MODUL A · DAS MATERIALMODELL.
   Kanon: docs/physics-lab/CONTRACT_physik_v1.md · Schicht: physics · Determinismus: seeded.

   ── WARUM DIESES MODUL ÜBERHAUPT EXISTIERT ──────────────────────────────────────────────────────
   Das Post Mortem vom 06.09. nennt EINEN Bauteil als Ursache des »nassen Sacks«: in cannon gab es
   im Aufbau genau eine globale Restitution (`world.defaultContactMaterial.restitution = 0.3`, die
   Zahl des Vorbilds). Die FÜNF Oberflächen des Spiels sind damit auf EINEN Wert zusammengefallen.
   Gemessen: Fall aus 4 Zellen auf das blanke Blatt → ein einziger Abpraller von 0,21 Zellen, wo
   das Design-Dokument ein Trampolin verlangt (0,62).

   Der fehlende Bauteil ist kein Regler, sondern eine STRUKTUR: je Oberfläche ein `CANNON.Material`,
   je Paar (Würfel × Oberfläche) ein `CANNON.ContactMaterial` mit eigener `restitution` und
   `friction`. Genau das ist hier drin, und NUR das.

   ── DREI ENTSCHEIDUNGEN, JEDE MIT GRUND ─────────────────────────────────────────────────────────
   1. DER VORGABEWERT DER WELT IST 0, NICHT 0,3. Ein vergessenes Paar fällt auf den Vorgabewert
      zurück. Bei 0,3 wäre das STILL (es prallt halt etwas) — bei 0 klebt der Würfel sofort
      auffällig. Ein Fehlerfall, der nirgends auffällt, ist ein unsichtbarer Defekt.
      Deshalb weicht das Modul hier ABSICHTLICH vom Vorbild ab; `pruefePaare()` zählt es zusätzlich.
   2. REIBUNG IST IM BEZUGSLAUF FÜR ALLE SECHS GLEICH (0,72, aus der SSOT §2.1). Damit kommt die
      gemessene Rangfolge der Abpraller ALLEIN aus der Restitution. Die sechs verschiedenen
      Reibungen, die die Analyse vorschlägt, sind unbelegt — sie liegen als zweiter Modus daneben
      und werden einzeln zugeschaltet (dasselbe Verfahren wie V4-S4: den Regler einzeln drehen und
      danach zurückstellen).
   3. DAS MODUL KENNT KEIN three, KEINE ZELLE UND KEINE ZEIT. Es besitzt zwei Zahlen je Paar, sonst
      nichts. Wer eine dritte Zahl braucht, fragt den Eigentümer.

   ── HERKUNFT JEDER ZAHL ─────────────────────────────────────────────────────────────────────────
   ePaper 0,62 · eTop 0,30 · eBoxel 0,38 · eBumper 0,92  →  `boxelball-v1/dice.v1.js` Z. 62–66.
   Bande 0,42 · Decke 0,55                               →  Design-Dokument §2 (in der v1 nicht als
                                                            eigene Zahl vorhanden).
   Reibung 0,72                                          →  SSOT `RUBBER_CUBE_DEFAULTS.friction`.

   RÜCKWEG: `createSurfaces({ world, e: { paper: 0.3, deck: 0.3, ... } })` stellt den Zustand vor
   dieser Scheibe wieder her — eine Zahl für alle. Oder das Modul weglassen: dann greift der
   Vorgabewert, und das ist genau der Defekt, den es behebt.
   ──────────────────────────────────────────────────────────────────────────────────────────────── */

import * as CANNON from 'cannon-es';

export const ANMELDUNG = {
  name: 'surfaces', version: '1.0', layer: 'physics', determinism: 'seeded',
  canon: 'CONTRACT_physik_v1',
  needs: ['CANNON', 'world'],
  params: {
    e:            { art: 'objekt', wirkung: 'live',    herkunft: 'dice.v1.js Z.62-66 + Design-Dokument §2' },
    frictionMode: { art: 'enum',   wirkung: 'live',    herkunft: 'uniform = SSOT §2.1; perSurface = Analyse, UNBELEGT' },
    world:        { art: 'fremd',  wirkung: 'rebuild', herkunft: 'der Wirt besitzt genau eine Welt' },
  },
};

/** Sollwerte. VERBINDLICH — sie sind der Gegenstand der Abnahme, nicht ihr Regler. */
export const SOLL_E = {
  deck:    0.30,   // Boxel-Deckfläche — er landet und rollt weiter
  flank:   0.38,   // Boxel-Flanke — Anprall an eine höhere Zelle
  band:    0.42,   // Bande (unsichtbar) — hart, Ecke trifft zuerst
  ceiling: 0.55,   // Decke (unsichtbar) — dämpfend, nur für den Einwurf von außen
  paper:   0.62,   // das Blatt — TRAMPOLIN, der Würfel steigt wieder auf
  bumper:  0.92,   // Bumper-Gesicht — Katapult, der Spielwitz
};

/** Die Rangfolge, die B1 prüft — aufsteigend. Sie IST die Anforderung FR1. */
export const RANG = ['deck', 'flank', 'band', 'ceiling', 'paper', 'bumper'];

export const IDS = RANG.slice();

/** SSOT §2.1 `RUBBER_CUBE_DEFAULTS.friction`. Der Bezugslauf nimmt sie für alle sechs. */
export const FRICTION_UNIFORM = 0.72;

/** Vorschlag der Analyse zum Post Mortem. UNBELEGT — kein Design-Dokument nennt diese sechs Zahlen. */
export const FRICTION_JE_FLAECHE = {
  paper: 0.55, deck: 0.72, flank: 0.65, bumper: 0.30, band: 0.50, ceiling: 0.45,
};

/* ── DIE FLANKE IST GLATT — GEORGS ENTSCHEIDUNG (b), 06.09. ──────────────────────────────────────
   Ein Boxel ist 0,78 hoch, der Würfel 0,68: an jedem Lochrand kann er an einen höheren Klotz
   LEHNEN, und bei Reibung 0,72 ist das eine echte Ruhelage — der Würfel steht gekippt, die Physik
   hat recht, das Bild ist trotzdem falsch. Drei Wege standen zur Wahl: (a) Lehnen löst den Klotz
   (ein Boxel platzt ohne Wurf), (b) die Flanke ist glatt und er rutscht ab, (c) Boxel niedriger
   als der Würfel. Georg: »dann (b)«.
   Kriterium: er rutscht, wenn die Reibung an der Flanke kleiner ist als der Tangens seines
   Lehnwinkels; bei 30° ist das 0,58, bei 20° 0,36. 0,15 liegt deutlich darunter — er gleitet auch
   aus einem flachen Lehnen ab. Gilt in BEIDEN Reibungsmodi; die Deckfläche bleibt griffig, damit er
   oben liegen bleibt. */
export const FRICTION_FLANKE_GLATT = 0.15;

/* ── DIE KENNLINIE DES LÖSERS, GEMESSEN IM SPIEL (06.09.2026) ──────────────────────────────────
   Ein gesetzter Wert und der Abprall, der dabei herauskommt, sind NICHT dasselbe: der Löser
   verliert bei jedem Kontakt Energie (Relaxation, Dämpfung, mehrere Kontaktpunkte je Bild).
   Gemessen am Stoß (Auftempo geteilt durch Anschlusstempo), Fall aus 4 Zellen, Würfelkante 0,68:

     BLATT (Plane)   0,20→0,134   0,40→0,319   0,62→0,521   0,80→0,687   1,00→0,872
     FELD  (Kasten)  0,30→0,228   0,60→0,505   0,90→0,782

   Beide Reihen liegen auf DERSELBEN Gerade — die Form des Partners ändert nichts:

     gemessen = 0,9225 · gesetzt − 0,0505     (alle acht Punkte auf ±0,002)

   ⚠ WARUM DAS ÜBERHAUPT KORRIGIERT WIRD: die sechs Designwerte sind die Zahlen der v1, und dort
   waren sie ein direkter Faktor auf die Geschwindigkeit (`d.vz = vin * e`, dice.v1.js Z. 442) —
   also der GEMESSENE Abprall. Wer sie unverändert in eine Engine schreibt, bekommt ein Blatt mit
   0,52 statt 0,62 und ein Deck mit 0,23 statt 0,30: das Spiel fühlt sich weiter zu weich an,
   obwohl »die richtigen Zahlen drinstehen«. Deshalb ist der Designwert das SOLL und der Motorwert
   sein Umkehrwert — ein Eigentümer, zwei Darstellungen derselben Größe.

   RÜCKWEG: `createSurfaces({ world, kalibriert: false })` schreibt die Designwerte unverändert in
   die Engine (der Zustand von V4-S9a, gemessen 0,52 auf dem Blatt). */
export const KENNLINIE = { steigung: 0.9225, achse: -0.0505,
  gemessen: '06.09.2026 im Spiel, Fall 4 Zellen, Plane und Kasten identisch, 8 Punkte' };

/** Designwert (gewünschter Abprall) → Motorwert (was in die Engine geschrieben wird).
    ⚠ DECKEL BEI 1,0, GEMESSEN BEGRÜNDET: für den Bumper (Soll 0,92) verlangt die Umkehrung 1,052,
    und über 1 fügt der Löser Energie hinzu — gemessen Gipfelfolge 3,379 → 0,281 → 0,454 → 0,500,
    also ein Würfel, der nach dem dritten Abprall HÖHER steigt als nach dem zweiten. Das ist ein
    Perpetuum mobile, kein Katapult. Mit dem Deckel misst der Bumper 0,872 statt 0,920 (−0,048) —
    und seinen eigentlichen Schub bekommt er ohnehin aus dem KICK des Spiels (`dice.v4.js` Z. 466,
    Untergrenze 11 für das Auftempo), da gehört das Katapult hin. */
export function motorE(ziel) {
  const v = (ziel - KENNLINIE.achse) / KENNLINIE.steigung;
  return Math.max(0, Math.min(1, +v.toFixed(4)));
}
/** Und zurück — damit eine Abnahme rechnen kann, was sie erwarten muss. */
export function erwartetE(motor) {
  return Math.max(0, +(KENNLINIE.steigung * motor + KENNLINIE.achse).toFixed(4));
}

export function createSurfaces(opts = {}) {
  const world = opts.world;
  if (!world) throw new Error('[surfaces] Der Wirt liefert `world`. Nicht angemeldet heißt nicht da.');

  let mode = opts.frictionMode === 'perSurface' ? 'perSurface' : 'uniform';
  const kalibriert = opts.kalibriert !== false;
  const e = Object.assign({}, SOLL_E, opts.e || {});
  const reib = (id) => (id === 'flank' ? FRICTION_FLANKE_GLATT
                        : mode === 'perSurface' ? FRICTION_JE_FLAECHE[id] : FRICTION_UNIFORM);
  /* Der Wert, der wirklich in die Engine geht — siehe KENNLINIE. */
  const motor = (id) => (kalibriert ? motorE(e[id]) : e[id]);

  /* ⚠ LAUTER VORGABEWERT — siehe Entscheidung 1 im Kopf. */
  world.defaultContactMaterial.restitution = 0;
  world.defaultContactMaterial.friction = FRICTION_UNIFORM;

  const cubeMaterial = new CANNON.Material('cube');
  const mats = Object.create(null);
  const paare = Object.create(null);

  for (const id of IDS) {
    mats[id] = new CANNON.Material('surf:' + id);
    const cm = new CANNON.ContactMaterial(cubeMaterial, mats[id], {
      restitution: motor(id), friction: reib(id),
    });
    world.addContactMaterial(cm);
    paare[id] = cm;
  }

  const api = {
    ANMELDUNG, cubeMaterial, ids: IDS, rang: RANG,

    /** Das Material einer Oberfläche. Unbekannter Name ist ein Fehler, kein Rückfallwert —
        ein stiller Rückfall auf »irgendwas« wäre genau der Defekt, den dieses Modul behebt. */
    materialFor(id) {
      const m = mats[id];
      if (!m) throw new Error('[surfaces] unbekannte Oberfläche: ' + id + ' — bekannt: ' + IDS.join(', '));
      return m;
    },

    setFrictionMode(m) {
      mode = m === 'perSurface' ? 'perSurface' : 'uniform';
      for (const id of IDS) paare[id].friction = reib(id);
      return api;
    },
    frictionMode() { return mode; },

    /** Eine Restitution einzeln drehen — der Wert ist der DESIGNWERT, nicht der Motorwert. */
    setE(id, v) { api.materialFor(id); e[id] = v; paare[id].restitution = motor(id); return api; },

    values() {
      return IDS.map((id) => ({ id, soll: e[id], motor: +paare[id].restitution.toFixed(4),
                                erwartet: erwartetE(paare[id].restitution),
                                e: e[id], mu: +paare[id].friction.toFixed(4) }));
    },

    /** FEHLERFALL WIRD GEZÄHLT: fehlt ein Paar, greift der Vorgabewert 0. `fehlt` ist die Zahl,
        die das laut macht — sie steht in jedem Bericht, auch wenn sie leer ist. */
    pruefePaare() {
      const fehlt = IDS.filter((id) => !world.getContactMaterial(cubeMaterial, mats[id]));
      return { erwartet: IDS.length, gefunden: IDS.length - fehlt.length, fehlt };
    },

    stats() {
      return { version: 'surfaces-v1.1', modus: mode, kalibriert, kennlinie: KENNLINIE,
               paare: api.pruefePaare(),
               vorgabeE: world.defaultContactMaterial.restitution,
               flaechen: api.values() };
    },
  };
  return api;
}
