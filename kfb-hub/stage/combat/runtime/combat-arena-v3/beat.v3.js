/* KFB Combat Arena v3 · beat.v3.js — DP1: EIN EREIGNIS, EINE ZEITACHSE, EINE NUMMER
   ────────────────────────────────────────────────────────────────────────────────────────────────
   Das externe Audit in einem Satz: **choreographieren statt auslösen.** In v2 sind Schuss und
   Treffer je sieben unabhängige Aufrufe (Clip · Mündung · Ton · Projektil · Impact · Deformer ·
   Kamera), die zufällig im selben Bild landen. Fällt einer aus, merkt es niemand — »stumm im
   Ergebnis, stumm im Protokoll«.

   Dieses Modul führt den **Beat**: einen nummerierten Vorgang mit einer Zeitachse in
   SIMULATIONSZEIT, an dem jede Schicht meldet, ob sie etwas erzeugt hat.

   DREI BÖDEN HÄNGEN DARAN, und alle drei können durchfallen:
     C13  jedes sichtbare Kampfereignis trägt genau eine Beat-Nummer · **0 Waisen**
     C14  Abstand zwischen Beat-`fire` und der GEMESSENEN Feuerpose ≤ 1 Bild (16,7 ms)
     C16  jede Schicht meldet je Beat, ob sie etwas erzeugt hat · stumme Schicht = eine Zeile

   ⚠ WAS EINE WAISE IST, UND WARUM SIE DER EIGENTLICHE FUND IST. Eine Waise ist ein Schichtaufruf
   OHNE offenen Beat — also ein Effekt, den niemand bestellt hat, oder einer, der zu spät kommt.
   v2 hatte drei Ausfälle dieser Sorte an einem Tag (Foundation nie gebootet · `col` statt `color`
   · `charge` nicht im Atlas), und keiner davon hatte einen Absender. Genau deshalb zählt dieses
   Modul sie, statt sie zu reparieren: erst der Absender, dann die Reparatur.

   ⚠ DIE UHR IST DIE SIMULATIONSZEIT. Ein Beat, der an `performance.now()` hängt, ist im verdeckten
   Fenster (rAF gedrosselt, ENVIRONMENT CA-4) nicht mehr vergleichbar — dieselbe Lehre wie beim
   Runden-Fluss. `tick(dt)` treibt die Uhr, sonst niemand.                                        */

export const SCHICHTEN = ['anim', 'muzzle', 'sfx', 'projektil', 'impact', 'deform', 'kamera'];

let _nr = 0;

export class BeatBuch {
  t = 0;
  offen = [];
  fertig = [];
  waisen = [];
  MAX = 60;                    // Ringpuffer: ein Protokoll, das mitwächst, ist ein Speicherleck
  FENSTER = 0.35;              // wie lange ein Beat Schichten annimmt, in Sekunden

  constructor(o = {}) {
    this.log = o.log || (() => {});
    this.FENSTER = o.fenster || this.FENSTER;
  }

  tick(dt) {
    if (!(dt > 0)) return;
    this.letzterDt = dt;
    this.t += dt;
    for (let i = this.offen.length - 1; i >= 0; i--) {
      const b = this.offen[i];
      if (this.t - b.t0 > (b.fenster || this.FENSTER)) { this.offen.splice(i, 1); this._ablegen(b); }
    }
  }

  /** Einen Beat eröffnen. `soll` ist die Liste der Schichten, die dieser Beat SCHULDET — daran
      misst C16, ob eine stumm geblieben ist. */
  beginn(typ, o = {}) {
    const b = {
      nr: ++_nr, typ, t0: this.t,
      schuetze: o.schuetze || null, ziel: o.ziel || null,
      soll: o.soll || SCHICHTEN.slice(),
      /* Ein Beat muss länger offen sein als der Rückhalt, den er misst — sonst legt ihn `tick` ab,
         bevor der Abgang kommt, und C14 meldet »kein Schuss mit gemessener Feuerpose«. Gemessen bei
         einem Rückhalt von 0,537 s gegen ein festes Fenster von 0,35 s. */
      fenster: Math.max(this.FENSTER, (o.fireAt || 0) + 0.2),
      ist: {}, fireAt: o.fireAt != null ? +o.fireAt : null, fireIst: null
    };
    this.offen.push(b);
    return b;
  }

  /** Der gemessene Abgang: wann die Mündung WIRKLICH kam, relativ zum Beat-Anfang. C14 vergleicht
      das gegen die an der Figur gemessene Feuerpose. */
  feuer(b) {
    if (!b) return null;
    b.fireIst = +(this.t - b.t0).toFixed(4);
    /* ⚠ »EIN BILD« IST DAS BILD, DAS WIRKLICH LIEF — nicht 16,7 ms aus der Lehrbuchtabelle. M5 zählt
       den Rückhalt je Bild herunter, der Abgang landet also zwangsläufig auf einer Bildgrenze. Nach
       einer Pause dauert das erste Bild gemessen 50 ms; gegen eine feste 16,7-ms-Schranke fällt
       dieser Schuss durch, obwohl er im ERSTEN möglichen Bild abging. Gemessen wird deshalb gegen
       die Dauer des Bildes, in dem der Abgang lag.
       Merksatz: eine Schranke in Bildern muss das Bild kennen, nicht seine Wunschdauer. */
    b.dtBild = this.letzterDt || null;
    return b.fireIst;
  }

  /** Eine Schicht meldet sich. `erzeugt` false heißt: sie lief, hat aber nichts gemacht — das ist
      etwas anderes als »nicht gerufen«, und beides muss unterscheidbar bleiben. */
  schicht(b, name, erzeugt = true, notiz) {
    if (!b) { this.waisen.push({ name, t: +this.t.toFixed(3), notiz: notiz || null }); return null; }
    b.ist[name] = { erzeugt: !!erzeugt, dt: +(this.t - b.t0).toFixed(4), notiz: notiz || null };
    return b.ist[name];
  }

  /** Der aktuell offene Beat eines Typs — die Naht für Schichten, die den Beat nicht kennen. */
  aktuell(typ) {
    for (let i = this.offen.length - 1; i >= 0; i--) if (!typ || this.offen[i].typ === typ) return this.offen[i];
    return null;
  }

  ende(b) {
    if (!b) return null;
    const i = this.offen.indexOf(b);
    if (i >= 0) this.offen.splice(i, 1);
    return this._ablegen(b);
  }

  _ablegen(b) {
    b.stumm = b.soll.filter((s) => !b.ist[s] || !b.ist[s].erzeugt);
    this.fertig.push(b);
    if (this.fertig.length > this.MAX) this.fertig.shift();
    if (b.stumm.length) this.log('[beat #' + b.nr + ' ' + b.typ + '] stumm: ' + b.stumm.join(', '));
    return b;
  }

  /* ── Die drei Böden, jeder als Zahl, die durchfallen kann ──────────────────────────────── */

  /** C13 · jedes Ereignis hat genau eine Nummer, keine Waisen. */
  c13() {
    const n = this.fertig.length;
    return { name: 'C13', pass: this.waisen.length === 0 && n > 0, beats: n, waisen: this.waisen.length,
      zeile: 'C13 · ' + n + ' Beats · ' + this.waisen.length + ' Waisen'
        + (this.waisen.length ? ' (' + [...new Set(this.waisen.map((w) => w.name))].join(', ') + ')' : '') };
  }

  /** C14 · Abgang auf der gemessenen Feuerpose, ≤ 1 Bild. */
  c14(bild = 1 / 60) {
    const mit = this.fertig.filter((b) => b.fireAt != null && b.fireIst != null);
    if (!mit.length) return { name: 'C14', pass: null, zeile: 'C14 · noch kein Schuss mit gemessener Feuerpose' };
    const ab = mit.map((b) => ({ d: Math.abs(b.fireIst - b.fireAt), s: Math.max(bild, b.dtBild || bild) }));
    const drueber = ab.filter((x) => x.d > x.s);
    const max = Math.max(...ab.map((x) => x.d)), mittel = ab.reduce((a, x) => a + x.d, 0) / ab.length;
    return { name: 'C14', pass: drueber.length === 0, n: mit.length, ueber: drueber.length,
      maxMs: Math.round(max * 1000), mittelMs: Math.round(mittel * 1000),
      zeile: 'C14 · ' + mit.length + ' Schüsse · Abstand max ' + Math.round(max * 1000) + ' ms, mittel '
        + Math.round(mittel * 1000) + ' ms · ' + drueber.length + ' über dem eigenen Bild' };
  }

  /** C16 · keine stille Schicht über die letzten N Beats. */
  c16(n = 20) {
    const letzte = this.fertig.slice(-n);
    const stumm = {};
    for (const b of letzte) for (const s of (b.stumm || [])) stumm[s] = (stumm[s] || 0) + 1;
    const k = Object.keys(stumm);
    return { name: 'C16', pass: k.length === 0 && letzte.length > 0, beats: letzte.length, stumm,
      zeile: 'C16 · ' + letzte.length + ' Beats · ' + (k.length ? k.map((s) => s + '×' + stumm[s]).join(', ') + ' stumm' : 'keine stille Schicht') };
  }

  protokoll(n = 6) {
    return this.fertig.slice(-n).map((b) => '#' + b.nr + ' ' + b.typ
      + ' · ' + b.soll.map((s) => (b.ist[s] ? (b.ist[s].erzeugt ? s : s + '∅') : s + '—')).join(' ')
      + (b.fireIst != null ? ' · fire ' + Math.round(b.fireIst * 1000) + ' ms'
        + (b.fireAt != null ? ' (soll ' + Math.round(b.fireAt * 1000) + ')' : '') : ''));
  }

  zeile() {
    return '[beat] ' + this.fertig.length + ' Beats · ' + this.offen.length + ' offen · '
      + this.waisen.length + ' Waisen · ' + this.c16().zeile.replace('C16 · ', '');
  }
}

export default BeatBuch;
