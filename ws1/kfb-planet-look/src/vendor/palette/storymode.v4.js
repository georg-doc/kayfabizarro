/* storymode.v4.js — KFB Pet Podcast v4 · DIE SECHS STORY-MODES ALS FARBRÄUME.

   Auftrag (Georg, 25.8.): die sechs Modi des Story-Mode-Würfels als Paletten anlegen, mit Auslöser
   und Auswahl — damit später die Schere den Würfel rollt und der Ton der Debatte farbcodiert
   zwischen Story-Beats und Karten sichtbar wird.

   ───────────────────────────────────────────────────────────────────────────────────────────────
   1  DIE FARBEN SIND GEMESSEN, NICHT ERFUNDEN

   Alle zwölf Werte stammen aus der Story-Mode-Tabelle auf kayfabizarro.pages.dev (#kfb), pixelweise
   abgetastet: `base` ist die Kachelfläche, `accent` der Modusname. Das ist wichtig, weil diese
   Tabelle gedruckt existiert — eine hier erfundene Farbe wäre sofort eine zweite Wahrheit über
   dieselbe Sache.

   2  WARUM DARAUS NICHT DIREKT DIE FLUID-FARBEN WERDEN

   Die Lektion aus dem Gutter (25.8., Georg: „Farben unglücklich"): eine Wasserfläche braucht ZWEI
   BENACHBARTE Töne. Die Höhe soll die HELLIGKEIT ändern, nicht die Farbe — sonst wird die Welle
   matschig. `base` → `accent` ist aber eine sehr große Spanne (bei Tragic von hellem Grau zu
   dunklem Blau).
   Darum liegen `deep` und `light` beide AUF der Achse base→accent, aber nur ein Stück auseinander:

       deep  = mix(base, accent, 0.62)      light = mix(base, accent, 0.14)

   Damit trägt der Modus seinen Farbton (der Akzent bestimmt die Richtung), und die Spanne bleibt so
   schmal wie im Original (dort 0,29|0,51|0,58 → 0,62|0,80|0,84, also derselbe Ton, nur heller).
   `accent` selbst bleibt unangetastet für alles, was WIRKLICH akzentuieren soll — Rasterfarbe,
   Konturlinie, später Lautschrift und Bedienstellen.

   3  DER ÜBERGANG IST DER EIGENTLICHE PUNKT

   Ein Moduswechsel ist ein Story-Beat, kein Menüpunkt. Er fährt darum über eine Uhr (Default 1,4 s,
   weiches Ein- und Auslaufen) — dieselbe Sprache wie die Kamera zwischen den zwei Ansichten und wie
   das Aufdecken der Karte. Wer sofort will, ruft `set(id, { instant: true })`.

   4  DIE NAHT FÜR DEN WÜRFEL

   Nach außen: `set(id)` · `roll()` · `byFace(n)` · `update(dt)` · `onChange(fn)`.
   `roll()` ist bereits die Würfel-Schnittstelle — die Schere ruft später genau das, und wer eine
   physische Sechs würfelt, ruft `byFace(6)`. Dieses Modul weiß nichts über Scheren, Flipper oder
   Punktestände, und das ist Absicht: der Auslöser gehört dem Spiel, die Farbe gehört hierher.

   5  WAS ES ANFASST — und was nicht

   Es schreibt AUSSCHLIESSLICH über die öffentliche API des Gutters (`setFluidColors`). Es besitzt
   keine Meshes, keine Uniforms, keinen Frame. Fällt der Gutter aus, passiert nichts Halbes.
   Der Rückweg ist `setEnabled(false)`: dann gilt wieder die Palette des Gutters. */

/* Die sechs Modi. `rule` ist der Wortlaut von der Website — nicht paraphrasiert, weil dieselben
   Sätze auf dem gedruckten Würfelblatt stehen. */
export const MODES = [
  { id: 'tragic',    face: 1, label: 'Tragic',    base: '#dadacb', accent: '#34566b',
    rule: 'Loss is real. Push forward anyway.' },
  { id: 'comic',     face: 2, label: 'Comic',     base: '#e3dfc2', accent: '#5d7033',
    rule: "Things go wrong. It's your fault. Play the gap." },
  { id: 'absurd',    face: 3, label: 'Absurd',    base: '#f5e6be', accent: '#b8901d',
    rule: "The impossible is normal. Don't explain it." },
  { id: 'heroic',    face: 4, label: 'Heroic',    base: '#f1ddc0', accent: '#b25e23',
    rule: 'Your Actor is right for this moment. Play the peak.' },
  { id: 'mystical',  face: 5, label: 'Mystical',  base: '#e1d6ca', accent: '#5c4470',
    rule: "Something's happening beneath the surface." },
  { id: 'forbidden', face: 6, label: 'Forbidden', base: '#e9d5c7', accent: '#8e3a60',
    rule: "Cross the line the story's been avoiding. Sell it." },
];

const hexToRgb = (h) => {
  const n = parseInt(String(h).replace('#', ''), 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
};
const rgbToHex = (c) => '#' + c.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255)
  .toString(16).padStart(2, '0')).join('');
const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const ease = (t) => t * t * (3 - 2 * t);

/** Die drei Farben, die die Fläche braucht, aus base + accent. Siehe Modulkopf §2. */
export function paletteOf(m) {
  const base = hexToRgb(m.base), acc = hexToRgb(m.accent);
  return {
    deep: mix(base, acc, 0.62),
    light: mix(base, acc, 0.14),
    /* Die Konturlinie ist der Akzent, deutlich abgedunkelt — sie soll die Welle zeichnen, nicht
       eine zweite Farbe einführen. */
    line: mix(acc, [0, 0, 0], 0.42),
    accent: acc,
  };
}

export function createStoryMode({ gutter, params = {} }) {
  const P = Object.assign({ fade: 1400, mode: 'absurd', enabled: true }, params);

  const byId = (id) => MODES.find((m) => m.id === id) || MODES[2];
  let cur = byId(P.mode), from = paletteOf(cur), to = paletteOf(cur), k = 1, t = 0;
  let listeners = [];
  const S = { changes: 0, lastFrom: null, rolls: 0 };

  function write() {
    if (!P.enabled || !gutter || !gutter.setFluidColors) return;
    const e = ease(k);
    gutter.setFluidColors(rgbToHex(mix(from.deep, to.deep, e)),
                          rgbToHex(mix(from.light, to.light, e)),
                          rgbToHex(mix(from.line, to.line, e)));
  }

  const api = {
    MODES,
    /** Modus setzen. Fährt über die Uhr, außer `instant`. */
    set(id, opt) {
      const m = byId(id);
      if (!P.enabled) { cur = m; return api; }
      const same = m.id === cur.id;
      /* Von der AKTUELL GEZEIGTEN Farbe aus starten, nicht von der Zielfarbe des letzten Wechsels.
         Sonst springt ein Wechsel mitten im Übergang zurück und läuft neu — sichtbar als Ruck. */
      const e = ease(k);
      from = { deep: mix(from.deep, to.deep, e), light: mix(from.light, to.light, e),
               line: mix(from.line, to.line, e), accent: mix(from.accent, to.accent, e) };
      S.lastFrom = cur.id;
      cur = m; to = paletteOf(m);
      k = (opt && opt.instant) || same ? 1 : 0; t = 0;
      S.changes++;
      write();
      listeners.forEach((fn) => { try { fn(m); } catch (e2) {} });
      return api;
    },
    /** Die Würfel-Schnittstelle. Die Schere ruft später genau das. */
    roll(opt) {
      S.rolls++;
      const m = MODES[Math.floor(Math.random() * MODES.length)];
      api.set(m.id, opt);
      return m;
    },
    /** Eine gewürfelte Augenzahl (1–6) übernehmen — für echte Würfel und die Physik im Feld. */
    byFace(n, opt) {
      const m = MODES.find((x) => x.face === n) || MODES[2];
      api.set(m.id, opt);
      return m;
    },
    update(dt) {
      if (!P.enabled || k >= 1) return;
      t += (dt || 0.016) * 1000;
      k = Math.min(1, t / Math.max(1, P.fade));
      write();
    },
    /** Wer sonst noch auf den Ton reagieren soll (Lautschrift, Blasen, Licht) hängt sich hier ein —
        statt dass dieses Modul sie kennt. */
    onChange(fn) { if (typeof fn === 'function') listeners.push(fn); return api; },
    get current() { return cur; },
    get palette() { return paletteOf(cur); },
    /** Die Akzentfarbe des aktuellen Modus als Hex — für alles, was WIRKLICH akzentuieren soll. */
    accent() { return cur.accent; },
    setParams(p) { Object.assign(P, p || {}); return api; },
    setEnabled(on) { P.enabled = !!on; if (P.enabled) { k = 1; write(); } return api; },
    stats() {
      const e = ease(k);
      return { mode: cur.id, label: cur.label, face: cur.face, rule: cur.rule,
               base: cur.base, accent: cur.accent, fade: P.fade,
               k: +k.toFixed(3), moving: k < 1, from: S.lastFrom,
               changes: S.changes, rolls: S.rolls, enabled: P.enabled,
               shown: { deep: rgbToHex(mix(from.deep, to.deep, e)),
                        light: rgbToHex(mix(from.light, to.light, e)),
                        line: rgbToHex(mix(from.line, to.line, e)) },
               /* Wie weit deep und light auseinanderliegen — die Zahl, an der die Lesbarkeit der
                  Welle hängt (Original-Referenz: 0,28). */
               span: +Math.abs(((to.light[0] + to.light[1] + to.light[2]) -
                                (to.deep[0] + to.deep[1] + to.deep[2])) / 3).toFixed(3) };
    },
  };
  api.set(P.mode, { instant: true });
  return api;
}
