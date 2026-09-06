/**
 * combat-arena-v2/locomotion.v2.js — M9 LOCOMOTION-TUNE (MASTERPLAN §2, Slice S1½).
 *
 * Die Frage, die dieses Modul beantwortet: **rutschen die Füße?** Ein Clip läuft mit einer eigenen
 * Schrittweite; der Körper fährt mit einem eigenen Tempo. Passen die nicht zusammen, gleitet die
 * Figur über den Boden wie auf Eis — und niemand kann sagen, um wie viel, solange es niemand misst.
 *
 * ES WIRD NICHTS NEU ERFUNDEN. Das Verfahren (Standfuß-Drift im Clip) liegt seit dem 05.09. als
 * `modules/kfb-stride-measure.js` im Projekt, die Ergebnisse der 45 Cube-Körper in `schrittmass.json`
 * (»KFB Academy 02 Locomotion«, 23 Modelle mit Beinen). Dieses Modul ist der ANSCHLUSS für die Arena:
 *
 *   1. Tabelle lesen — für jeden Cube-Körper das gemessene Tempo, bei dem sein Walk nicht rutscht
 *   2. FB selbst vermessen — die Kenney-Figur steht NICHT in der Tabelle (anderes Pack, andere
 *      Rohhöhe: 3,57 gegen 2,01), also wird sie hier live gemessen, mit demselben Werkzeug
 *   3. Clip-Rate liefern — `rate(refTempo, tempo)` und dazu den Rutschfaktor, den das ergibt
 *
 * ── WARUM DER RUTSCHFAKTOR NICHT IMMER 1,000 IST ──────────────────────────────
 * Setzt man die Rate auf `tempo / refTempo`, ist der Faktor rechnerisch genau 1 — ein Boden, der das
 * prüft, prüft eine Tautologie. Interessant sind die beiden Fälle, in denen er es NICHT ist:
 *   · die Rate läuft in ihre Grenze (ein Clip, der 8× schneller laufen müsste, sieht kaputt aus —
 *     deshalb ist sie geklemmt, und dann rutscht es sichtbar; genau das soll der Boden fangen)
 *   · es gibt kein gemessenes Referenztempo (beinlose Körper haben nur einen Hub, keine Strecke) —
 *     dann gibt es KEINEN Faktor, und das Modul sagt das, statt eine 1,000 zu erfinden.
 *
 * Der Bericht trägt deshalb je Körper `kalibriert: true|false`. Ein Faktor über etwas, das nicht
 * gemessen ist, sieht aus wie eine Messung — das ist der Fehler, den `kfb-stride-measure.js` in
 * seinem eigenen Kopf schon aufgeschrieben hat (Höhen-Rückfall bei den beinlosen Monstern).
 */

const CDN = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/';
const _mod = async (rel, cdn) => { try { return await import(rel); } catch (e) { return await import(cdn); } };

export const SPEC = {
  ratenGrenze: { min: 0.35, max: 2.2 },   // dieselben Werte, mit denen M2 klemmt — hier zum Messen
  band: { min: 0.9, max: 1.1 }            // Boden C12
};

export default class Locomotion {
  /* Zustand VOR jedem `await` (siehe M3/M5, gleiche Fehlerklasse am 06.09.). */
  koerper = new Map();
  tab = null;
  figurMass = null;

  static describe() {
    return { name: 'Locomotion', capabilities: ['three@0.160'], view: 'none', determinism: 'seeded', spec: SPEC };
  }

  async init(ctx) {
    this.THREE = ctx.three;
    this.log = (s) => (ctx.log || console.info)('[loco] ' + s);
    /* ERST DIE FELDER, DANN DAS WARTEN. `koerper` stand hinter dem `await` des Modul-Imports — und
       in diesem Fenster fragt der Wirt schon `tor()` und das Prüfblatt schon `zeile()`:
       »this.koerper is not iterable«, ein Konsolenfehler, der C6 kippte (gemessen 06.09.).
       Ein Objekt, das noch lädt, muss trotzdem antworten können. */
    this.koerper = new Map();     // name → { refWalk, refRun, tempo, rolle, kalibriert, quelle }
    this.tab = null;
    const S = await _mod('../modules/kfb-stride-measure.js', CDN + 'modules/kfb-stride-measure.js');
    this.M = S.createStrideMeasure({ THREE: this.THREE });
    await this.tabelle();
  }

  /** `schrittmass.json` — die Messung vom 05.09., nicht neu gefahren. */
  async tabelle() {
    if (this.tab) return this.tab;
    for (const url of ['./schrittmass.json', CDN + 'schrittmass.json']) {
      try {
        const r = await fetch(url);
        if (!r.ok) continue;
        this.tab = await r.json();
        const n = Object.keys(this.tab.modelle || {}).length;
        const mit = Object.values(this.tab.modelle || {}).filter((m) => m.walk && m.walk.tempo).length;
        this.log('Tabelle: ' + n + ' Modelle, ' + mit + ' mit gemessenem Schritt (' + (this.tab.gemessen || 'ohne Datum') + ')');
        return this.tab;
      } catch (e) { /* nächster Ort */ }
    }
    this.log('AUSFALL: schrittmass.json nicht erreichbar — kein Körper ist kalibriert');
    return null;
  }

  /** Gemessenes Referenztempo eines Cube-Körpers (u/s, Roster-Skala eingerechnet). */
  ref(id, rolle) {
    const m = this.tab && this.tab.modelle && this.tab.modelle[id];
    const e = m && m[rolle || 'walk'];
    return e && e.tempo ? e.tempo : null;
  }

  /**
   * TAKT statt SCHRITT — für die beinlosen Körper. Befund vom 05.09. in `schrittmass.json`: die 21
   * Cube-Monster haben keine Füße (Armature: Body Mouth Head …), ihr »Walk« ist ein Wippen des
   * Rumpfes. Es gibt dort keine Strecke, also KEIN Schrittmaß und keinen Rutschfaktor. Was es gibt,
   * ist ein Takt (Hub je Zyklus). Solche Körper werden hier ausdrücklich als `takt` geführt — nicht
   * als kalibriert, nicht als Fehler. Ein Faktor über etwas, das es nicht gibt, sieht aus wie eine
   * Messung; das ist genau die Falle, die das Messwerkzeug in seinem Kopf beschreibt.
   */
  hub(id) {
    const m = this.tab && this.tab.modelle && this.tab.modelle[id];
    const e = m && m.walkHub;
    return e && e.takt ? { takt: e.takt, hub: e.hub, grund: e.grund || 'ohne Beine' } : null;
  }

  /**
   * FB (oder jede andere Figur mit eigenem Rig) LIVE vermessen. Gibt je Clip das Tempo zurück, bei
   * dem dieser Clip bei Rate 1,0 nicht rutscht — in WELT-Einheiten, Skala eingerechnet.
   */
  messeFigur(name, fb, o) {
    const opt = o || {};
    const figur = fb.figure || (fb.root && fb.root.children[0]);
    if (!figur) { this.log(name + ': keine Figur'); return null; }
    const skala = opt.skala != null ? opt.skala : (fb.root ? fb.root.scale.x : 1);
    const bi = this.M.beine(figur, {});
    const erg = { name, skala: +skala.toFixed(4), fuesse: bi.nodes.length, wie: bi.wie, namen: (bi.namen || []).slice(0, 4), clips: {} };
    for (const [rolle, re] of [['walk', /^walk$/i], ['run', /^run$/i], ['runGun', /^run_gun$/i]]) {
      const e = fb.findClip ? fb.findClip(re) : null;
      if (!e || !e.clip) { erg.clips[rolle] = { ok: false, grund: 'kein Clip' }; continue; }
      const m = this.M.messen({ root: figur, clip: e.clip, forwardZ: opt.forwardZ != null ? opt.forwardZ : 1, skala, beine: bi.nodes });
      erg.clips[rolle] = m && m.ok
        ? { ok: true, clip: e.name, tempo: +m.tempo.toFixed(4), strecke: +m.strecke.toFixed(4), dauer: +m.dauer.toFixed(3), kontakt: +(m.kontakt || 0).toFixed(3) }
        : { ok: false, clip: e.name, grund: (m && m.grund) || 'keine Standphase' };
    }
    this.figurMass = erg;
    const z = Object.entries(erg.clips).map(([k, v]) => k + ' ' + (v.ok ? v.tempo + ' u/s' : '– (' + v.grund + ')'));
    this.log(name + ' gemessen · ' + erg.fuesse + ' Fuß/Füße (' + erg.wie + ') · ' + z.join(' · '));
    return erg;
  }

  /** Körper anmelden: was ist sein gemessenes Referenztempo, in welcher Rolle läuft er gerade. */
  /** Einen Körper abmelden — ein toter Mob ist kein Locomotion-Körper mehr (Kritiker 06.09.:
      `koerper` führte Leichen mit, und C12 zählte sie in seiner Körperzahl). */
  abmelden(name) { return this.koerper ? this.koerper.delete(name) : false; }

  /** Körper anmelden: was ist sein gemessenes Referenztempo, in welcher Rolle läuft er gerade. */
  anmelden(name, o) {
    const b = Object.assign({ refWalk: null, refRun: null, takt: null, tempo: 0, rolle: 'walk', quelle: 'unbekannt' }, this.koerper.get(name) || {}, o || {});
    b.kalibriert = !!(b.rolle === 'run' ? (b.refRun || b.refWalk) : b.refWalk);
    this.koerper.set(name, b);
    return b;
  }

  /**
   * Die Clip-Rate für ein Bodentempo — und der Rutschfaktor, der dabei herauskommt.
   * Geklemmt wird hier, damit der Faktor die Klemme SIEHT (M2 klemmte vorher selbst und still).
   */
  rate(refTempo, tempo) {
    if (!refTempo) return { rate: null, rutsch: null, kalibriert: false, geklemmt: false };
    const roh = Math.abs(tempo) / refTempo;
    const rate = Math.max(SPEC.ratenGrenze.min, Math.min(SPEC.ratenGrenze.max, roh));
    return { rate: +rate.toFixed(3), rohRate: +roh.toFixed(3), rutsch: +((refTempo * rate) / Math.max(0.0001, Math.abs(tempo))).toFixed(3), kalibriert: true, geklemmt: Math.abs(rate - roh) > 1e-6 };
  }

  /** BODEN C12: alle angemeldeten Körper, ihr Rutschfaktor, und wer gar nicht kalibriert ist.
      Ein Körper, der STEHT, hat keinen Rutschfaktor — er wird gezählt, aber nicht gerechnet
      (erste Fassung teilte durch Tempo 0 und meldete 2213,40; eine Zahl, die niemand glauben kann,
      ist immerhin auffindbar, aber sie gehört nicht in einen Boden). */
  probe() {
    const rows = [];
    for (const [name, b] of (this.koerper || new Map())) {
      const ref = b.rolle === 'run' ? (b.refRun || b.refWalk) : b.refWalk;
      const steht = Math.abs(b.tempo || 0) < 0.15;
      const r = steht ? { rate: null, rutsch: null, kalibriert: !!ref, geklemmt: false } : this.rate(ref, b.tempo);
      rows.push({ name, rolle: b.rolle, tempo: +(b.tempo || 0).toFixed(2), ref: ref ? +ref.toFixed(3) : null, rate: r.rate, rutsch: r.rutsch, geklemmt: r.geklemmt, kalibriert: r.kalibriert, steht, takt: b.takt || null, quelle: b.quelle });
    }
    const schritt = rows.filter((r) => !r.takt);          // Körper, für die ein Schrittmaß überhaupt existiert
    const mit = schritt.filter((r) => r.kalibriert && r.rutsch != null);
    const werte = mit.map((r) => r.rutsch);
    return {
      n: rows.length, kalibriert: schritt.filter((r) => r.kalibriert).length, gerechnet: mit.length,
      taktKoerper: rows.filter((r) => r.takt).map((r) => r.name),
      stehen: schritt.filter((r) => r.steht).map((r) => r.name),
      ohne: schritt.filter((r) => !r.kalibriert).map((r) => r.name),
      min: werte.length ? Math.min.apply(null, werte) : null,
      max: werte.length ? Math.max.apply(null, werte) : null,
      geklemmt: rows.filter((r) => r.geklemmt).map((r) => r.name),
      rows
    };
  }

  tor() {
    const p = this.probe();
    return { bestanden: (this.tab ? 1 : 0) + (this.figurMass ? 1 : 0), von: 2, koerper: p.n };
  }

  zeile() {
    const p = this.probe();
    if (!p.n) return '[loco] kein Körper angemeldet · Tabelle ' + (this.tab ? 'gelesen' : 'fehlt');
    const b = p.min != null ? p.min.toFixed(2) + '–' + p.max.toFixed(2) : (p.stehen.length ? 'steht' : '–');
    return '[loco] ' + p.kalibriert + '/' + (p.n - p.taktKoerper.length) + ' Körper mit Schrittmaß kalibriert · Rutschfaktor ' + b
      + (p.taktKoerper.length ? ' · ' + p.taktKoerper.length + ' × Takt statt Schritt (ohne Beine)' : '')
      + (p.geklemmt.length ? ' · Rate geklemmt: ' + p.geklemmt.join(', ') : '')
      + (p.ohne.length ? ' · ohne Schrittmaß: ' + p.ohne.join(', ') : '');
  }
}
