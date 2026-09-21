/**
 * KFB Seeds v1 · KARTE → WELT
 * ===========================
 * Aus einer Karte wird eine Zone. Deterministisch: gleiche Karte → gleiche Welt, immer.
 *
 * DIESES MODUL ERFINDET KEINE MEDIZIN. Der semantische Vektor (8 Dimensionen) und die
 * Palette kommen aus `world-context.js` (kfb-voxel-world-v1). Hier steht nur die
 * UEBERSETZUNG: welcher Vektorwert welchen Weltparameter bewegt.
 *
 * DIE ZENTRALE EINSICHT — BASISLINIE STATT ROHWERT.
 * Ohne Bezugsgroesse gewinnt immer dieselbe Dimension: `power` ist in jedem Kartentext hoch,
 * weil die Lexika sich Alltagsverben teilen. Jede Zone waere `heroic`. Entscheidend ist
 * nicht, welche Dimension GROSS ist, sondern welche fuer DIESE Karte AUFFAELLIG ist.
 * Deshalb: Abstand zum Pool-Mittel, auf 0…1 gespreizt. 0.5 = durchschnittlich.
 *
 * ZWEI DURCHGAENGE.
 * Der Vektor haengt nicht am Story-Modus, die PALETTE aber schon. Also erst den Vektor holen,
 * daraus den Modus ableiten, dann die Welt endgueltig bauen. Ein Durchgang liefert die Farben
 * des VORHERIGEN Modus.
 *
 * SIGNATUR-SEED AUS DER KARTENIDENTITAET, nicht aus wc.seed: wc.seed haengt via joinSeeds am
 * Story-Modus, und der wird erst aus dem Vektor abgeleitet — waehrend der Ableitung steht dort
 * noch der Modus der vorherigen Karte. Damit waere die Texturwahl von der Vorgeschichte
 * abhaengig statt von der Karte.
 *
 * @module kfb-card-seed
 * @version 1.0.0
 * @herkunft KFB Card Zone Lab v2 (2026-09)
 */

const clamp01 = (x) => Math.max(0, Math.min(1, x));

/** Sauberer Texturbestand fuer helle Zonen. */
export const TEX_CLEAN = ['Cardboard003', 'Chipboard007', 'whitewashed_brick'];
/** Dreckiger Bestand fuer abgenutzte Zonen. */
export const TEX_DIRTY = ['rusty_metal_04', 'PaintedMetal017', 'Leaking018A', 'Tape005', 'RoadLines019B', 'ScrewSet001'];

/**
 * Story-Modus ← Vektor-Dimension. Die sechs D6-Modi aus world-context.
 * @type {Array<[string,string]>} [Modus, Dimension]
 */
export const MODE_BY_DIM = [
  ['tragic', 'melancholy'], ['comic', 'humor'], ['absurd', 'chaos'],
  ['heroic', 'power'], ['mystical', 'wonder'], ['forbidden', 'threat'],
];

/**
 * Fuellung ← Vektor-Dimension. Reihenfolge ist die Prioritaet bei Gleichstand.
 * @type {Array<[string,string]>} [Fuellung, Dimension]
 */
export const FLUID_BY_DIM = [
  ['saeure', 'threat'], ['oel', 'melancholy'], ['wasser', 'wonder'],
  ['bubblegum', 'humor'], ['schlacke', 'chaos'],
];

/**
 * @param {object} cfg
 * @param {object} cfg.WC       Das importierte world-context-Modul.
 * @param {Function} cfg.toCard (poolKarte) → { cardNumber, cardName, power, lore, gradeReason, role }
 */
export function createCardSeeder(cfg) {
  const WC = cfg.WC;
  const toCard = cfg.toCard || ((c) => c);
  let baseline = null, pool = [], wc = null;

  /**
   * BASISLINIE aus dem ganzen Pool. Einmal pro Deck, nicht pro Karte.
   * @param {Array} cards Der komplette Kartenpool.
   */
  function buildBaseline(cards) {
    pool = cards || [];
    if (!pool.length || !WC.cardSemanticVector) { baseline = null; return null; }
    const sum = {}; let n = 0;
    pool.forEach((c) => {
      const cd = toCard(c);
      const v = WC.cardSemanticVector(cd, cd.role);
      Object.keys(v).forEach((k) => { sum[k] = (sum[k] || 0) + v[k]; });
      n++;
    });
    const mean = {}; Object.keys(sum).forEach((k) => { mean[k] = sum[k] / n; });
    baseline = mean;
    return mean;
  }

  /** Abstand zum Pool-Mittel, auf 0…1 gespreizt. 0.5 = durchschnittlich. */
  function dev(k) {
    const v = (wc && wc.vector) || {}, m = baseline || {};
    const x = v[k] || 0, mu = m[k] != null ? m[k] : 0.35;
    return clamp01(0.5 + (x - mu) * 2.6);
  }

  /** Der Drei-Schlag: die aktuelle Karte dominiert, die zwei naechsten biegen die Welt. */
  function triplet(index) {
    if (!pool.length) return { current: null };
    const i = index || 0;
    return {
      current: toCard(pool[i % pool.length]),
      next: toCard(pool[(i + 1) % pool.length]),
      nextNext: toCard(pool[(i + 2) % pool.length]),
    };
  }

  /** Auffaelligste Dimension → Story-Modus. */
  function mode() {
    return MODE_BY_DIM.map(([m, d]) => [m, dev(d)]).sort((a, b) => b[1] - a[1])[0][0];
  }

  /**
   * Die Zonensignatur. Jede Zeile ist eine benannte Uebersetzung, keine Zufallszahl:
   *
   *   Abnutzung  Protopia/Dystopia-Achse. Bedrohung und Schwermut machen dreckig,
   *              Staunen und Humor machen sauber.
   *   Fuellung   die auffaelligste Dimension gewinnt.
   *   Textur     Bestand nach Abnutzung, Auswahl aus dem Identitaets-Seed.
   *   Graben     Chaos macht ihn breiter.
   *   Stufen     Chaos macht den Zonenboden unruhiger.
   *   Absenkung  Bedrohung senkt die Insel ins Wasser.
   *   Deck       Lore macht den Stapel dicker.
   *
   * heightScale und motionAmplitude stehen BEWUSST NICHT hier: sie haengen am Modus und
   * kommen aus wc.params, nachdem der Modus feststeht.
   */
  function signature(card) {
    const c = card || {};
    const seed = WC.joinSeeds
      ? WC.joinSeeds('kfb-card-zone', String(c.packId || 'ø'), String(c.n != null ? c.n : 0))
      : 0;
    const g = dev;
    const wear = clamp01(0.42 + g('threat') * 0.5 + g('melancholy') * 0.3 + g('chaos') * 0.16
      - g('wonder') * 0.42 - g('humor') * 0.3);
    const fluid = FLUID_BY_DIM.map(([f, d]) => [f, g(d)]).sort((a, b) => b[1] - a[1])[0][0];
    const bank = wear < 0.45 ? TEX_CLEAN : TEX_DIRTY;
    return {
      fluid,
      wear: +wear.toFixed(2),
      tex: bank[(seed >>> 7) % bank.length],
      moat: 2 + Math.round(g('chaos') * 3),
      steps: +(0.25 + g('chaos') * 1.05).toFixed(2),
      sink: Math.round(g('threat') * 2),
      deck: 1 + Math.round(g('lore') * 5),
    };
  }

  /**
   * Der vollstaendige Zwei-Durchgang-Ablauf.
   * @param {number} index Index der aktuellen Karte im Pool.
   * @param {string[]} [seeds=['kfb-zone']] Zusaetzliche Seeds (Projekt-/Szenenkennung).
   * @returns {{wc:object, mode:string, signature:object, top:string, vector:object}}
   */
  function resolve(index, seeds = ['kfb-zone']) {
    const tri = triplet(index);
    // Durchgang 1: Vektor holen (Modus ist hier noch egal).
    wc = WC.makeWorldContext({ cardTriplet: tri, storyMode: 'heroic', seeds });
    const m = mode();
    const sig = signature(pool[index % Math.max(1, pool.length)]);
    // Durchgang 2: endgueltige Welt im abgeleiteten Modus.
    wc = WC.makeWorldContext({ cardTriplet: tri, storyMode: m, seeds });
    const top = ['power', 'lore', 'chaos', 'wonder', 'threat', 'humor', 'melancholy']
      .map((k) => [k, dev(k)]).sort((a, b) => b[1] - a[1]).slice(0, 2)
      .map(([k, x]) => k + ' ' + x.toFixed(2)).join(' · ');
    return { wc, mode: m, signature: sig, top, vector: wc.vector };
  }

  return {
    name: 'kfb-card-seed', version: '1.0.0',
    buildBaseline, dev, triplet, mode, signature, resolve,
    get baseline() { return baseline; },
    get worldContext() { return wc; },
    get poolSize() { return pool.length; },
    /** Prueft, ob die Basislinie ueberhaupt Streuung erzeugt — sonst ist jede Zone gleich. */
    measure() {
      if (!baseline) return { baseline: null };
      const keys = Object.keys(baseline);
      const devs = keys.map((k) => dev(k));
      return {
        poolSize: pool.length,
        dims: keys.length,
        devMin: +Math.min(...devs).toFixed(3),
        devMax: +Math.max(...devs).toFixed(3),
        devSpread: +(Math.max(...devs) - Math.min(...devs)).toFixed(3),
        mode: mode(),
      };
    },
  };
}

export default createCardSeeder;
