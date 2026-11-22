// kfb-hypernorm · Flächen ohne Umgebung (K7; W-007 Punkt 2: mehrere Flächen, ein Kern; WSV 06.11.2026)
// Derselbe Ablauf im Hauptfaden (Rückfall) und im Worker: Kern-Instanz (Material, Caches, Darsteller einmal), darauf beliebig viele Flächen
// (Fassade, Boden, Kuppel, Video), je mit eigener Zeitleiste, eigenem Format und eigenen Absichten. Ring-Buchführung und Vorfüllen je Fläche.
// Kein three, kein DOM außer Canvas (im Worker: OffscreenCanvas über die Hülle in fassade.worker.mjs).
import { createEngine } from '../kern.mjs';
import { installDarsteller } from '../darsteller.mjs';
import { installSchriftPool } from '../schriftpool.mjs';
import { createRaum } from '../raum/raum.mjs';

// wie cascade/r4 EBENEN (V-1500); BASEN/SCHRIFT/MITTE stehen jetzt in FASSADE_RING
export const EBENEN = Object.freeze({ RING: 16, ABSTAND: 3, VORFUELL_ABSTAND: 2, SPALTEN: 4, VORFUELL_MAX_S: 30,
  RING_BASEN: ['PLATE'], RING_NUR: ['KNOCKOUT', 'MIXED', 'WIDTH_MORPH', 'ARC', 'ECHO', 'OUTLINE_SWEEP', 'REDACT'], MITTE: ['NONE', 'BLEND', 'LUMA_KEY'] });

// Fassaden-Ring als Absicht (gleich test/daten/fassade-ring.hn-intents.json, ohne Ende)
export const FASSADE_RING = Object.freeze([{ id: 'fassade.ring', t0: 0, t1: 1e9, shots: 'frei',
  families: { base: 'PLATE', type: { cycle: ['KNOCKOUT', 'MIXED', 'WIDTH_MORPH', 'KNOCKOUT', 'ARC', 'MIXED', 'REDACT'] }, mid: ['NONE', 'BLEND', 'LUMA_KEY'], post: 'NONE' },
  deny: { trans: ['FILM'] } }]);
// Boden ruhig (Alternative zur Fortsetzung): längere Einstellungen (INTRO 4–8 Beats), wenig Schrift, Muster und Kaleidoskop sind von oben schön
export const BODEN_RUHIG = Object.freeze([{ id: 'boden.ruhig', t0: 0, t1: 1e9, shots: 'frei', section: 'INTRO',
  families: { base: ['PLATE', 'KALEIDO', 'PATTERN', 'DROSTE'], type: { cycle: ['NONE', 'GIANT_CROP', 'NONE', 'KNOCKOUT'] }, mid: ['NONE', 'BLEND'], post: 'NONE' },
  deny: { trans: ['FILM'] } }]);

// Flächen-Arten (Raum-Konzept R1, `flaeche.art`). Format, Vorgaben und Beschreibung für den Planer (Krümmung, typischer Blick).
// boden: Kartenhaus-Ruine (Q-118). Standard ist die FORTSETZUNG der Fassade: gleiche Absichten, gleicher Seed, gleiche Uhr → zur selben Zeit derselbe Shot wie
// auf der Fassade, nur quadratisch. So läuft die HyperNorm-Fläche im Boden weiter, wenn das Haus einstürzt.
export const ARTEN = Object.freeze({
  fassade: { aspect: 2, intents: FASSADE_RING, ungespiegelt: true, kruemmung: 0, blick: { winkel: 'schräg', abstand: 'fern' } },
  boden: { aspect: 1, intents: FASSADE_RING, ungespiegelt: true, kruemmung: 0, blick: { winkel: 'von oben', abstand: 'nah' } },
  kuppel: { aspect: 2, intents: FASSADE_RING, ungespiegelt: true, kruemmung: -1, blick: { winkel: 'innen', abstand: 'umgebend' } },   // Wölbung im Spiel: L3 im Kugel-Shader (WS1); raum.linse nur, wenn gewünscht
  video: { aspect: 16 / 9, intents: [], ungespiegelt: false, kruemmung: 0, blick: { winkel: 'frontal', abstand: 'bild' } }
});

const norm = s => String(s || '').trim().toLowerCase();
export const shotMeta = sh => ({ type: sh.type || '', base: sh.base || '', mid: sh.mid || '', text: norm(sh.text && sh.text.s), plate: String(sh.plate ?? '') });

// Ring-Buchführung (V-1500): welche Shots in den Ring dürfen. Jeder Text und jedes Bild einmal, REDACT höchstens einmal; alte Ebenen werden überschrieben.
export function ringBuch(R = EBENEN.RING) {
  const txt = new Array(R).fill(''), bld = new Array(R).fill(''), typ = new Array(R).fill(''); let next = 0, filled = 0;
  return { get filled() { return filled; }, get fortschritt() { return filled / R; }, get voll() { return filled >= R; },
    passt(sh) { if (!sh) return false; const m = shotMeta(sh);
      return EBENEN.RING_NUR.includes(m.type) && EBENEN.RING_BASEN.includes(m.base) && EBENEN.MITTE.includes(m.mid)
        && !txt.includes(m.text || '#') && !bld.includes(m.plate || '#') && !(m.type === 'REDACT' && typ.includes('REDACT')); },
    merke(sh) { const m = shotMeta(sh); txt[next] = m.text; bld[next] = m.plate; typ[next] = m.type; next = (next + 1) % R; filled = Math.min(R, filled + 1); return m; } };
}

// Ereignis-Zeiten: t0/t1 und alle Zeiten in show (name.at, power.at, lore.at, lore.words[].s, payoffAt) in Sekunden ab jetzt → Zeitleiste
const verschoben = (it, dt) => { const o = Object.assign({}, it, { t0: dt + (it.t0 || 0), t1: dt + (it.t1 ?? 4) });
  if (it.show) { const S = o.show = Object.assign({}, it.show), z = x => x == null ? x : x + dt;
    for (const k of ['name', 'power']) if (S[k]) S[k] = Object.assign({}, S[k], { at: z(S[k].at), mark: z(S[k].mark) });
    if (S.lore) S.lore = Object.assign({}, S.lore, { at: z(S.lore.at), words: (S.lore.words || []).map(w => Object.assign({}, w, { s: z(w.s) })) });
    if (S.payoffAt != null) S.payoffAt = z(S.payoffAt); }
  return o; };

// Kern-Instanz: ein Kern (Material, Bild-Caches, Darsteller) für alle Flächen einer Seite bzw. eines Workers.
// darsteller (Standard an): Kartenwelt A und Seite P (K3) für Ereignisse mit show. Braucht kfb.hn-media/1 (figure, card, page) im Material.
// Spiegel und Kaleidoskop-Keile (wie cascade/r4, WS0 04.11.) werden je Fläche gesperrt: o._ungespiegelt gilt nur während ihres Bildes.
// schriftPool: { manifest (geladenes kfb.hypernorm-fonts/1, rolle pool), blacklist?, anteil?, budget? } (Typo-Konzept 0c); ohne: H15-Schriften
export function kernInstanz(material, { darsteller = true, schriftPool = null } = {}) {
  const E = createEngine({ material }), o = E.o, DS = darsteller ? installDarsteller(E, material) : null;
  if (schriftPool) installSchriftPool(E, schriftPool.manifest || null, schriftPool);
  const mirror0 = o.mirror, kaleido0 = o.kaleido;
  o.mirror = function (c, src, sh, t) { if (!this._ungespiegelt) return mirror0.call(this, c, src, sh, t); this.cover(c, src, 0, 0, c.canvas.width, c.canvas.height, 1.15, sh?.fx ?? .5, sh?.fy ?? .5); };
  o.kaleido = function (c, src, ...r) { if (!this._ungespiegelt) return kaleido0.call(this, c, src, ...r); this.cover(c, src, 0, 0, c.canvas.width, c.canvas.height, 1.15, .5, .5); };
  return { E, material, DS, kern: true };
}

// quelle: Kern-Instanz (kernInstanz) oder Material (dann eigene Instanz)
// cfg: { art, aspect, intents, palette, seed, ctx, clock, camera, res, budgetMs, maxFps, vorlaufS, ungespiegelt, ebenen, darsteller, raum }
// raum (R1): { anteil, rezepte, linse } → Raum-Durchgang (WebGL2) für Raum-Übergänge und Linse; die Fläche (art) wählt passende Rezepte. Ohne WebGL2: 2D-Pfad.
export function flaeche(quelle, cfg = {}) {
  const inst = quelle && quelle.kern ? quelle : kernInstanz(quelle, { darsteller: cfg.darsteller !== false });
  const A = ARTEN[cfg.art || 'fassade'] || ARTEN.fassade;
  const { intents = A.intents, palette = null, seed = 1966, ctx = 'KALEIDOSCOPE', clock = { bpm: 112 }, camera = 'calm', res = 1,
    budgetMs = 8, maxFps = 20, vorlaufS = 4, ungespiegelt = A.ungespiegelt, ebenen = false, aspect = A.aspect, raum = null } = cfg;
  const E = inst.E;
  const its = intents.map(it => Object.assign({}, it, { t1: it.t1 == null ? 1e9 : it.t1 }));
  if (palette && its.length) its[0] = Object.assign({}, its[0], { palette: { stops: palette, note: 'Viertel' } });
  const RC = raum ? Object.assign({ flaeche: cfg.art || 'fassade' }, raum) : null;
  let RA = null; const RS = { ok: null, grund: null, bilder: 0, flach: 0 };
  // Bild zur Zeit t: flach (2D, bitgleich) oder durch den Raum-Durchgang
  const zeichne = t => { const s = RC ? T.raumSzene(t) : null; if (!s) { RS.flach++; return T.render(t); }
    if (!RA) { RA = createRaum(); RS.ok = RA.ok; RS.grund = RA.grund; }
    if (!RA.ok) { RS.flach++; return T.render(t); } RS.bilder++; return RA.zeichne(s); };
  const L = E.live({ seed, ctx, clock, intents: its, camera, scale: res === 2 ? 2 : 1, aspect, budgetMs, maxFps, vorlaufS, raum: RC, zeichne: t => zeichne(t) });
  const T = L.timeline, buch = ebenen ? ringBuch() : null;
  const mit = fn => { E.o._ungespiegelt = ungespiegelt; try { return fn(); } finally { E.o._ungespiegelt = false; } };
  let zeit = 0, lastIdx = -1, q = 0, gezeigt = false;
  return { E, L, buch, DS: inst.DS, art: cfg.art || 'fassade', aspect, beschreibung: { art: cfg.art || 'fassade', kruemmung: A.kruemmung, blick: A.blick, aspect },
    get zeit() { return zeit; }, get timeline() { return T; }, raum: RS, get raumStats() { return RA ? RA.stats : null; },
    // Bild zur Zeit z oder null (maxFps/Budget). vor: Shot, dessen letztes Bild (noch auf der Fläche des Wirts) jetzt in den Ring wandert
    tick(z) {
      zeit = z; const c = mit(() => L.tick(z)); if (!c) return null;
      let vor = null;
      if (buch) { const fr = T.frameAt(z);
        if (fr.shotIdx !== lastIdx) { const alt = lastIdx >= 0 ? T.shots[lastIdx] : null;
          if (gezeigt && buch.passt(alt) && (q++ % EBENEN.ABSTAND) === 0) vor = buch.merke(alt);
          lastIdx = fr.shotIdx; } }
      gezeigt = true; const sh = T.frameAt(z).sh;
      return { c, vor, sh: Object.assign(shotMeta(sh), { trans: sh.trans || '', intent: sh.intent || null }) };
    },
    render(t) { return mit(() => zeichne(t)); },
    flach(t) { return mit(() => T.render(t)); },
    // Vorfüllen ohne Zeitraffer: Ring-Shots direkt an ihrem letzten Bild rendern. Generator: je Ring-Bild ein Schritt { c, meta, fortschritt }
    *vorfuellen(maxS = EBENEN.VORFUELL_MAX_S) {
      if (!buch) return zeit;
      const t0 = performance.now(), C = T.clock; let j = 0, k = 0;
      while (!buch.voll && performance.now() - t0 < maxS * 1000) {
        while (T.shots.length <= j + 1) T.extend(C.timeAt(T.shots.length ? T.shots[T.shots.length - 1].b1 : 0) + vorlaufS);
        const sh = T.shots[j];
        if (buch.passt(sh) && (k++ % EBENEN.VORFUELL_ABSTAND) === 0) { const c = mit(() => T.render(C.timeAt(sh.b1) - 1 / 25)), meta = buch.merke(sh); yield { c, meta, fortschritt: buch.fortschritt }; }
        j++;
      }
      zeit = C.timeAt(T.shots[j].b0); lastIdx = j - 1; gezeigt = false;   // ab dem nächsten Shot live weiter, keine Wiederholung der Ring-Bilder
      return zeit;
    },
    add(it) { L.add(verschoben(it, zeit)); },
    // Farbe/Heilen (W-007 Punkt 3): ab jetzt in `ueber` s zu `wert` (0 grau, 1 wie H15, 2 sehr bunt). Rein: Teil der Zeitleiste.
    farbe(wert, { ueber = 1.5 } = {}) { T.farbe(wert, zeit, ueber); },
    pause() { L.pause(); }, resume() { L.resume(); } };
}
