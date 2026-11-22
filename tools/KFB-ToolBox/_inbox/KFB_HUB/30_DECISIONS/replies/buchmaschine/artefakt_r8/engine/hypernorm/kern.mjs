// kfb-hypernorm · Kern R1 (K1 Gerüst, K2 Eingänge; WSV 06.11.2026)
// Eine Engine-Instanz ohne Seite: kein DOM-UI, kein Netz, kein localStorage, kein eigener Takt.
// Material kommt nur von außen (useMaterial). Gerendert wird über den deterministischen Bake-Pfad von H15 (Plan → Bilder → Bild).
// K2: Uhr (clock), Merkmale (features), Absichten (kfb.hn-intents/1), Kamera-Profil, reines Bild. K3: Darsteller A und P. K4a: Absichten in Schichten.
import { createHypernorm, SOURCE } from './hypernorm.gen.mjs';
import { rezept, passtZu, linseNorm, alleRezepte } from './raum/rezepte.mjs';
import { LESEROLLEN } from './schriftpool.mjs';

export const KERN = { name: 'kfb-hypernorm', version: 'r1-r1', source: SOURCE };

// Material im Format kfb.hn-material/1: { items: [{ id, src, kind, tags, title, who, year, crop? }], imgs: { id: HTMLImageElement|ImageBitmap|Canvas }, genCards?, WC?, WP? }
export function createEngine({ material = null, props = {}, cpu = true } = {}) {
  const M = createHypernorm(), o = new M.Component();
  o.props = Object.assign({}, props);
  // Zustand wie H15 componentDidMount, ohne UI, Netz, localStorage und rAF
  Object.assign(o, { imgs: {}, failed: {}, cache: new Map(), ready: false, frame: 0, fps: 0, lastInfo: 0, lastSave: 0, grainPats: new WeakMap(),
    _seed: 1966, _ctx: 'KALEIDOSCOPE', films: [], filmCand: [], au: null, _flashK: 0, all: [], pool: [],
    pd: { rows: 0, items: 0, small: 0, err: null, loaded: 0 }, kfb: { pages: 0, pagesDone: 0, cards: 0, motifs: 0, ms: [], err: null, maxDt: 0, loading: false } });
  // cpu (Standard, K2): alle Arbeitsflächen auf der CPU, rechnerunabhängig. cpu:false = wie die H15-Seite (Grafikkarte), nur für den K1-Vergleich bei RK 1.
  const mk = () => { const c = document.createElement('canvas'); c.width = M.W; c.height = M.H; c.getContext('2d', cpu ? { willReadFrequently: true } : undefined); return c; };
  o.off = mk(); o.tmp = mk(); o.bufA = mk(); o.bufB = mk(); o.tmp2 = mk(); o.tmp3 = mk();   // tmp2/tmp3 legt H15 erst beim ersten Schatten an (live, Grafikkarte)
  { // Rauschquelle wortgleich zu H15 (mulberry(99), 256×256)
    const nz = document.createElement('canvas'); nz.width = nz.height = 256; const nx = nz.getContext('2d'), id = nx.createImageData(256, 256), nr = M.mulberry(99);
    for (let i = 0; i < id.data.length; i += 4) { const v = Math.floor(nr() * 255); id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } nx.putImageData(id, 0, 0); o.noiseSrc = nz;
  }
  function useMaterial(m) {
    o.all = m.items.map(p => Object.assign({}, p)); o.imgs = {}; o.cache = new Map();
    for (const p of m.items) if (m.imgs[p.id]) o.imgs[p.id] = m.imgs[p.id];
    if (m.genCards) { o.genCards = m.genCards; o.genDecks = new Set(m.genCards.map(c => c.deck)).size; }
    if (m.WC) Object.assign(o, { WC: m.WC, WP: m.WP, CLAY: m.CLAY || null });
    o.pool = o.all.filter(p => o.imgs[p.id]); o.ready = o.pool.length >= 6;
  }
  if (material) useMaterial(material);
  // Bake-Optionen wie H15 bake(): Pool nach Quellen gefiltert, nach id sortiert
  function opts(x = {}) { const b = o.bakeOpts(x); b._pool = o.all.filter(p => o.imgs[p.id] && b.sources.includes(p.src)).sort((a, c) => a.id < c.id ? -1 : a.id > c.id ? 1 : 0); return b; }
  // Reines Bild (K2): render(b, fr) hängt nur von Plan und Zeit ab, nicht vom vorigen Bild. Dafür vor jedem Bild:
  // Kick-Blitz aus, und alle Arbeitsflächen zurücksetzen (Pixel und Zeichenzustand; H15 lässt z. B. Schrift-/Füllzustand stehen).
  const flaechen = () => { const L = [o.off, o.tmp, o.bufA, o.bufB, o.tmp2, o.tmp3]; for (const k in (o._bb || {})) L.push(...Object.values(o._bb[k])); return L.filter(Boolean); };
  function reset() { o._flashK = 0; for (const c of flaechen()) { const x = c.getContext('2d', cpu ? { willReadFrequently: true } : undefined); x.reset ? x.reset() : (c.width = c.width); } }
  function render(b, fr) { reset(); return o.bakeRender(b, fr); }
  const E = { o, M, KERN, useMaterial, opts, plan: b => o.bakePlan(b), frames: (b, cy) => o.bakeFrames(b, cy), render, reset, cpu };
  E.timeline = x => timeline(E, x);
  E.live = x => live(E, x);
  return E;
}

// ---------- K2 · Uhr ----------
// { bpm } fester Takt (Spiel, Site) oder { beats: [Sekunden …] } Beats aus dem Song (Video, Radio im Spiel)
export function makeClock(c = {}) {
  if (Array.isArray(c.beats) && c.beats.length > 1) {
    const B = c.beats, d = B.slice(1).map((x, i) => x - B[i]).sort((a, b) => a - b), bpm = 60 / d[d.length >> 1];
    const beatAt = t => { if (t <= B[0]) return (t - B[0]) / (B[1] - B[0]); let lo = 0, hi = B.length - 1; if (t >= B[hi]) return hi + (t - B[hi]) * bpm / 60;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (B[m] <= t) lo = m; else hi = m; } return lo + (t - B[lo]) / (B[lo + 1] - B[lo]); };
    const timeAt = b => { if (b <= 0) return B[0] + b * (B[1] - B[0]); const i = Math.floor(b); if (i >= B.length - 1) return B[B.length - 1] + (b - B.length + 1) * 60 / bpm; return B[i] + (b - i) * (B[i + 1] - B[i]); };
    return { kind: 'beats', bpm, beatAt, timeAt };
  }
  const bpm = c.bpm || 112; return { kind: 'bpm', bpm, beatAt: t => t * bpm / 60, timeAt: b => b * 60 / bpm };
}

// ---------- K2 · Absichten (kfb.hn-intents/1) → Zeitleiste ----------
// Jede Absicht gilt in [t0, t1] (Sekunden) und schneidet bei t0. Ohne Absicht plant der Kern frei wie H15 (Abschnitt `section`, Längen aus SECTIONS).
// families: { base|mid|type|trans|post: 'X' | ['X','Y'] (Auswahl) | { cycle: [...] } (der Reihe nach) }, deny: { base: [...], … }
// shots: 'eine' (Standard bei Text) | 'frei' (Längen aus dem Abschnitt) | Zahl (Beats je Einstellung)
// text: { s, role, fonts?: [...] } · plates: { plate, plate2 } · camera: 'calm'|'reactive' · palette: { stops: [[[r,g,b] dunkel, [r,g,b] mittel, [r,g,b] hell], …] = Liste von Paletten (H15 palPrep), note } (gilt für die ganze Zeitleiste)
// farbe: { wert, ueber } (W-007 Punkt 3, „Viertel wird bunt“): eine Absicht nur mit farbe ist keine Einstellung, sondern ein Schlüssel der Farbkurve.
//   wert 0 = grau (leicht papierfarben), 1 = wie H15 (unverändert), 2 = sehr bunt; ab t0 in `ueber` Sekunden (Standard 1,5) vom vorigen Wert dorthin.
//   Ohne Farb-Schlüssel bleibt jedes Bild bitgleich wie vorher.
const FAM = { base: ['__kfbForceBase', 'BASE_W'], mid: ['__kfbForceMid', 'MID_W'], type: ['__kfbForceType', 'TYPE_W'], trans: ['__kfbForceTrans', 'TDUR'], post: ['__kfbForcePost', null] };
function timeline(E, { seed = 1966, ctx = 'KALEIDOSCOPE', clock = {}, intents = [], t0 = 0, t1 = null, section = 'VERSE', camera = 'reactive', features = null,
  scale = 1, aspect = 2, films = [], props = {}, fps = 25, raum = null } = {}) {
  const { o, M } = E, C = makeClock(clock), K = M.KFBV;
  const b = E.opts(Object.assign({ seed, ctx, mode: 'MOTION', scale, bpm: Math.round(C.bpm) }, props));
  b._films = films;                                               // Filme nur mit reproduzierbarem Bild (prepare), P9/P10
  const pal = intents.find(x => x.palette && x.palette.stops);
  const nurFarbe = it => it.farbe != null && !it.families && !it.show && !it.text && !it.plates && it.text !== null;
  const FK = intents.filter(nurFarbe).map(it => ({ t: it.t0 || 0, wert: +(it.farbe.wert ?? it.farbe), ueber: it.farbe.ueber ?? 1.5 })).sort((a, c) => a.t - c.t);
  const list = intents.filter(it => !nurFarbe(it)).slice().sort((a, c) => a.t0 - c.t0);
  const bA = C.beatAt(t0), shots = [], per = new Map(); let st = null, horizon = bA;
  const choose = (spec, r, k) => { if (spec == null) return undefined; if (typeof spec === 'string') return spec; if (Array.isArray(spec)) return spec[Math.floor(r() * spec.length)]; if (spec.cycle) return spec.cycle[k % spec.cycle.length]; return undefined; };
  const allowed = (fam, deny, r) => { const T = FAM[fam][1] && M[FAM[fam][1]]; if (!T || !deny || !deny.length) return undefined; const ks = Object.keys(T).filter(k => !deny.includes(k)), w = ks.map(k => typeof T[k] === 'number' ? T[k] : 1);
    let s = w.reduce((a, c) => a + c, 0) * r(); for (let i = 0; i < ks.length; i++) { s -= w[i]; if (s <= 0) return ks[i]; } return ks[ks.length - 1]; };
  // R1 Raum: { flaeche, anteil (0..1, wie oft der Planer an einem Schnitt ein Raum-Rezept nimmt), rezepte (Ids, sonst alle passenden), linse (Rezept-Id oder { k, ab, kKick }) }
  const RO = raum ? Object.assign({ flaeche: 'video', anteil: 0, rezepte: null, linse: null }, raum) : null;
  const liest = s => !!(s && (s.darsteller || (s.text && LESEROLLEN.includes(s.text.role))));
  const uebergangVon = s => { const R = s && s.raum && s.raum.rezept ? rezept(s.raum.rezept) : null; return R && R.art === 'uebergang' ? R : null; };
  // Planer (ohne Absicht): nach Fläche und Lese-Regel, nie zwei Raum-Übergänge nacheinander (Ruhe vorher und nachher), nicht dasselbe Rezept zweimal,
  // nur wenn der Übergang auf einem Beat endet (Einstellung lang genug), nicht dasselbe Rezept wie der letzte Raum-Übergang (wenn es eine Wahl gibt). Eigener Zufall (Salz 1605) am Startpunkt: ohne raum bleibt der Plan unverändert.
  const raumWahl = (sh, prev, s0) => {
    if (!RO || !(RO.anteil > 0) || !prev || sh.raum || uebergangVon(prev) || liest(sh) || liest(prev)) return;
    const r = M.mulberry(M.hash(seed, Math.round(s0 * 1000), 1605)); if (r() >= RO.anteil) return;
    const L = (RO.rezepte ? RO.rezepte.map(rezept) : alleRezepte()).filter(R => R && R.art === 'uebergang' && passtZu(R, RO.flaeche) && sh.beats * .6 >= R.beats && (!R.lesen || R.lesen.lesetext !== false || (!liest(sh) && !liest(prev))));
    if (!L.length) return;
    for (let i = shots.length - 1, n = 0; i >= 0 && n < 8; i--, n++) { const U = uebergangVon(shots[i]); if (U) { if (L.length > 1 && L.includes(U)) L.splice(L.indexOf(U), 1); break; } }   // Gedächtnis: nicht dasselbe Rezept wie zuletzt
    const w = L.map(R => (R.gewicht ?? 1) * (R.vorzug && R.vorzug.base && (R.vorzug.base.includes(sh.base) || R.vorzug.base.includes(prev.base)) ? R.vorzug.faktor || 2 : 1));
    let x = w.reduce((a, c) => a + c, 0) * r(), R = L[L.length - 1]; for (let i = 0; i < L.length; i++) { x -= w[i]; if (x <= 0) { R = L[i]; break; } }
    sh.raum = { rezept: R.id, geplant: true }; sh.trans = R.rueckfall || 'CROSS';
  };
  const withFmt = fn => { const a0 = M.ASP; if (a0 !== aspect) M.setAspect(aspect); try { return fn(); } finally { if (a0 !== aspect) M.setAspect(a0); } };
  // Planen bis Beat bZ (inkrementell; offline einmal bis t1, live Stück für Stück)
  function extend(bZ) {
    if (bZ <= horizon + 1e-6) return;
    withFmt(() => o.withBake(b, () => {
      if (pal) { K.__kfbPalSource = 'GAME'; K.__kfbPalStops = pal.palette.stops; K.__kfbPalNote = pal.palette.note || 'Absicht'; }
      st = st || o.newState(seed, ctx);
      const plan1 = (L, sec, it, k) => {
        const r = M.mulberry(M.hash(seed, Math.round((shots.length ? shots[shots.length - 1].b1 : bA) * 1000), 1602)), rr = M.mulberry(M.hash(seed, shots.length, 1603));
        const vor = {}; for (const f in FAM) K[FAM[f][0]] = vor[f] = it ? (choose(it.families && it.families[f], rr, k) ?? allowed(f, it.deny && it.deny[f], rr)) : undefined;
        const sh = o.planShot(st, r, M.SECTIONS[sec] || M.SECTIONS.VERSE, sec, L);
        if (vor.trans !== undefined) sh.trans = vor.trans;   // H15 nimmt erzwungenes CUT nicht an (TDUR kennt CUT nicht), daher hier verbindlich
        for (const f in FAM) K[FAM[f][0]] = undefined;
        if (it) {
          if (it.text && it.text.s) { sh.text = { s: it.text.s, voice: 'slogan', cat: it.text.cat || 'scientific', role: it.text.role || null }; delete sh.mfonts; if (sh.type === 'NONE') sh.type = 'ECHO';
            if (it.text.fonts && it.text.fonts.length) sh.font = it.text.fonts[Math.floor(rr() * it.text.fonts.length)];
            else if (E._pool && it.text.role) { const h = E._pool.hausFuer(it.text.role); if (h) { sh.font = h; delete sh.mfonts;   // Lesetext-Rolle: nur Hausschrift (Typo-Konzept 0c)
              if (['SCATTER', 'CHARFLIP', 'ARC', 'WAVE', 'MIXED'].includes(sh.type)) sh.type = 'OUTLINE_SWEEP'; } } }
          if (it.text === null) { sh.type = 'NONE'; sh.text = null; sh.font = '-'; }
          if (sh.type === 'MIXED' && !(sh.mfonts && sh.mfonts.length)) sh.mfonts = [sh.font];   // text.fonts/Rolle löscht mfonts, MIXED liest sie (WS1-Theater T-014 Befund 2)
          if (it.plates) for (const p in it.plates) if (o.imgs[it.plates[p]]) sh[p] = it.plates[p];
          if (it.camera) sh.camProfile = it.camera;
          if (it.show) { sh.darsteller = Object.assign({}, it.show, { win: { t0: it.t0, t1: it.t1 }, zeit: C.timeAt }); sh.type = 'NONE'; sh.text = null; sh.font = '-'; }   // K3: Darsteller zeichnet das ganze Fenster
          sh.intent = it.id || null;
          if (it.raum) { sh.raum = Object.assign({}, it.raum); const R = uebergangVon(sh);   // R1: Rezept für jede Einstellung der Absicht, Linse mit Durchflug nur an der Nahtstelle
            if (R && sh.beats * .6 >= R.beats) sh.trans = R.rueckfall || 'CROSS'; else delete sh.raum.rezept;   // nur, wenn der Übergang auf einem Beat endet
            if (sh.raum.linse && typeof sh.raum.linse === 'object') sh.raum.linse = Object.assign({}, sh.raum.linse, { flip: !!sh.raum.linse.flip && k === 0 }); }
        }
        return sh;
      };
      const push = (sh, s0, s1) => { Object.assign(sh, { b0: s0, b1: s1, k: shots.length, cycle: 0 }); if (RO) raumWahl(sh, shots[shots.length - 1], s0); shots.push(sh); };
      // fill bis s1 (Planungsrand); gekürzt wird nur an einer echten Grenze `hart` (Ende/Beginn einer Absicht), nie am Planungsrand.
      // Sonst zerlegt Live-Planung (Rand wandert je Bild) die Zeitleiste in Einstellungen von Bruchteilen eines Beats (Befund 06.11., seit K2b).
      // Länge je Einstellung aus einem Zufall, der nur an ihrem Startpunkt hängt: der Plan ist unabhängig davon, in welchen Stücken geplant wird
      // (am Stück wie beim Vorfüllen oder Bild für Bild wie live). Vorher hing er daran (Befund 06.11., Boden als Fortsetzung der Fassade).
      const fill = (s0, s1, sec, it, hart = s1) => { const S = M.SECTIONS[sec] || M.SECTIONS.VERSE; let x = s0;
        while (x < s1 - 1e-6) { const r = M.mulberry(M.hash(seed, Math.round(x * 1000), 1604)); let L = it && typeof it.shots === 'number' ? it.shots : S.shot[Math.floor(r() * S.shot.length)]; if (x + L > hart) L = hart - x;
          const kk = it ? (per.get(it) || 0) : 0; push(plan1(Math.max(1, Math.round(L)), it && it.section || sec, it, kk), x, x + L); if (it) per.set(it, kk + 1); x += L; }
        return x; };
      // Schichten (K4a): überlappen sich Absichten, gilt die zuletzt begonnene (Ereignis über Dauer-Absicht, z. B. Bresche über Fassaden-Ring);
      // endet sie, läuft die darunterliegende weiter (ihr Zyklus zählt fort). Ohne Überlappung wie K2.
      const span = it => [C.beatAt(it.t0), C.beatAt(it.t1)];
      let x = horizon;
      while (x < bZ - 1e-6) {
        let act = null, ab0 = -Infinity, nx = Infinity;
        for (const it of list) { const [i0, i1] = span(it);
          if (i0 <= x + 1e-6 && i1 > x + 1e-6 && i0 >= ab0) { act = it; ab0 = i0; }
          if (i0 > x + 1e-6 && i0 < nx) nx = i0; }
        if (!act) { x = fill(x, Math.min(bZ, nx), section, null, nx); continue; }
        const i1 = span(act)[1], e = Math.min(i1, nx);
        const one = act.shots === 'eine' || (act.shots === undefined && ((act.text && act.text.s) || act.show));
        if (one) { push(plan1(Math.max(1, Math.round(e - x)), act.section || section, act, 0), x, e); x = e; }
        else x = fill(x, Math.min(bZ, e), act.section || section, act, e);
      }
      horizon = Math.max(bZ, shots.length ? shots[shots.length - 1].b1 : bZ);
    }));
  }
  // Ereignis zur Laufzeit (Bresche, Biom, Kontext): ab seinem Beginn neu planen; was davor liegt, bleibt
  // Farbkurve (rein: Wert zur Zeit nur aus den Schlüsseln). Neutral (1) wird nicht gefiltert.
  function farbe(wert, t, ueber = 1.5) { FK.push({ t, wert: +wert, ueber }); FK.sort((a, c) => a.t - c.t); }
  const farbeAt = t => { if (!FK.length) return 1; let v = 1; for (const k of FK) { if (k.t > t) break; const u = k.ueber > 0 ? Math.min(1, (t - k.t) / k.ueber) : 1, e = u * u * (3 - 2 * u); v = v + (k.wert - v) * e; } return v; };
  const filterVon = w => { const lerp = (a, c, u) => a + (c - a) * Math.max(0, Math.min(1, u));
    return w < 1 ? `saturate(${lerp(.04, 1, w).toFixed(4)}) contrast(${lerp(.9, 1, w).toFixed(4)}) brightness(${lerp(.93, 1, w).toFixed(4)}) sepia(${((1 - w) * .22).toFixed(4)})`
      : `saturate(${lerp(1, 1.7, w - 1).toFixed(4)}) contrast(${lerp(1, 1.08, w - 1).toFixed(4)})`; };
  let PC = null;
  const farbePost = (c, t) => { const w = Math.round(farbeAt(t) * 1000) / 1000; if (Math.abs(w - 1) < 1e-3) return c;
    if (!PC || PC.width !== c.width || PC.height !== c.height) { PC = document.createElement('canvas'); PC.width = c.width; PC.height = c.height; }
    const x = PC.getContext('2d', { willReadFrequently: true }); x.reset ? x.reset() : (PC.width = PC.width); x.filter = filterVon(w); x.drawImage(c, 0, 0); x.filter = 'none'; return PC; };
  function add(it) {
    if (nurFarbe(it)) { farbe(it.farbe.wert ?? it.farbe, it.t0 || 0, it.farbe.ueber ?? 1.5); return; }
    list.push(it); list.sort((a, c) => a.t0 - c.t0); const ib0 = C.beatAt(it.t0);
    while (shots.length && shots[shots.length - 1].b0 >= ib0 - 1e-6) shots.pop();
    if (shots.length && shots[shots.length - 1].b1 > ib0) shots[shots.length - 1].b1 = ib0;
    horizon = Math.max(bA, Math.min(horizon, ib0));
  }
  const frameAt = t => { const bt = C.beatAt(t); extend(Math.max(bt + 1, horizon)); let j = 0; while (j < shots.length - 1 && bt >= shots[j + 1].b0 - 1e-9) j++; const sh = shots[j];
    return { i: Math.round(t * fps), sh, prev: j ? shots[j - 1] : null, tIn: Math.max(0, (bt - sh.b0) * 60 / b.settings.bpm), T: t, shotIdx: j }; };   // Engine-Zeit im Shot = Beats · Beatdauer der Engine (H16 M1)
  // Filme: Bild zur Zeit vorab dekodieren (async), Render zeichnet nur Vorbereitetes (reproduzierbar)
  const FB = new Map(), FILM_FPS = 24;
  const filmPos = (f, sh, tt) => { const d = f.el && f.el.duration; if (!isFinite(d) || d <= 2) return null; return Math.round((sh.fstart * (d - 1.5) + tt * (sh.frate || 1)) * FILM_FPS) / FILM_FPS; };
  const filmKey = (f, pos) => f.id + '@' + pos.toFixed(3);
  // Schrift-Pool: Schriften der Einstellungen in [ta, tz] (wie Filme vorab laden)
  const schriftenIn = (ta, tz) => { if (!E._pool) return []; extend(C.beatAt(tz) + 1); const b0 = C.beatAt(ta), b1 = C.beatAt(tz), ks = [];
    for (let i = 0; i < shots.length; i++) { const sh = shots[i]; if (sh.b1 < b0 && !(shots[i + 1] && shots[i + 1].b1 >= b0)) continue; if (sh.b0 > b1) break; ks.push(...E._pool.keysVon(sh)); }   // inkl. der vorigen Einstellung (Übergang)
    return ks; };
  const schriftenVorbereiten = (ta, tz) => E._pool ? E._pool.vorbereiten(schriftenIn(ta, tz)) : Promise.resolve();
  async function prepare(ta, tz, step = 1 / fps) {
    await schriftenVorbereiten(ta, tz);
    for (let t = ta; t <= tz + 1e-9; t += step) { const fr = frameAt(t), sh = fr.sh; if (sh.base !== 'FILM') continue; const f = films.find(x => x.id === sh.film); if (!f) continue;
      const pos = filmPos(f, sh, fr.tIn); if (pos == null || FB.has(filmKey(f, pos))) continue; const v = f.el;
      await new Promise(res => { const done = () => { v.removeEventListener('seeked', done); res(); }; v.addEventListener('seeked', done); v.currentTime = Math.min(pos, v.duration - .05); });
      const c = document.createElement('canvas'); c.width = 640; c.height = Math.max(2, Math.round(640 * v.videoHeight / v.videoWidth)); c.getContext('2d', { willReadFrequently: true }).drawImage(v, 0, 0, c.width, c.height); FB.set(filmKey(f, pos), c); }
  }
  // ---------- R0 · Ebenen-Export (3D-Plan R1, L2) ----------
  // ebenen(t): Grund (Hintergrund + Grundbild, deckend), Mitte und Typo (durchsichtig) einer Einstellung in eigenen Puffern, mit Mischmodus je Ebene.
  // Zusammengesetzt (ebenenZusammen) ergibt das das Bild von render(t) ohne Übergang, Post-Effekt, Blitz und Farbe; Korn ist Meta (grain).
  // Darsteller-Einstellungen liefern das ganze Darsteller-Bild als Grund. Im Übergang kommt die vorige Einstellung als `vorig` dazu.
  const EB = {}, MITTE_ABHAENGIG = new Set(['GLYPH', 'BLOB', 'STRIPS', 'DOSSIER']);   // gemessen 06.11. (test/r0.js): diese Mitten rechnen mit dem Bild darunter
  const ebenenShot = (sh, tt, slot) => {
    const W = M.W, H = M.H, mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
    let s = EB[slot]; if (!s || s.grund.width !== W || s.grund.height !== H) s = EB[slot] = { grund: mk(), mitte: mk(), typo: mk() };
    const cx = c => { const x = c.getContext('2d', E.cpu ? { willReadFrequently: true } : undefined); x.reset ? x.reset() : (c.width = c.width); return x; };
    const g = cx(s.grund), mi = cx(s.mitte), ty = cx(s.typo);
    const bs = o.bs(), tb = tt / bs, u = Math.max(0, Math.min(1, tt / (sh.beats * bs))), P = M.PALS[sh.pal], cam = o.camAt(sh, tt, tb, u);
    g.fillStyle = P.bg; g.fillRect(0, 0, W, H);
    const DS = sh.darsteller && o._darsteller && o._darsteller[sh.darsteller.mode]; let mitteMix = 'source-over', typoMix = 'source-over';
    // Nicht trennbar, daher mit in den Grund (Bild exakt, Ebene nicht frei): Mitten, die mit dem Bild darunter rechnen, und Typo mit eigenem
    // Mischmodus (überlappende Zeichen heben sich sonst auf). meta.verbunden sagt dem Raum-Durchgang, welche Ebenen frei sind.
    const typoFlach = sh.type !== 'NONE' && (sh.type === 'REDACT' || sh.type === 'RANSOM' || sh.tblend !== 'source-over' || o.props.typeShadow === false) && sh.tblend !== 'source-over';
    const mitteInGrund = sh.mid !== 'NONE' && (MITTE_ABHAENGIG.has(sh.mid) || typoFlach), typoInGrund = typoFlach;
    if (DS) DS(g, sh, tt, { W, H, RK: M.RK, cam, P, tb, u, bs });
    else {
      o.layer(g, cam, .12); o.drawBase(g, sh, tt, tb, u, P);
      if (sh.mid !== 'NONE') { const z = mitteInGrund ? g : mi; o.layer(z, cam, .5); o.drawMid(z, sh, tt, tb, u, P); if (!mitteInGrund) mitteMix = sh.mid === 'BLEND' ? sh.bmode : sh.mid === 'HYPNO' ? sh.hblend : sh.mid === 'FRACTAL' ? sh.fblend : 'source-over'; }
      if (sh.type !== 'NONE') { const z = typoInGrund ? g : ty; o.layer(z, cam, .9); o.typeMotion(z, sh, tb);
        if (sh.type === 'REDACT' || sh.type === 'RANSOM' || sh.tblend !== 'source-over' || o.props.typeShadow === false) o.drawType(z, sh, tt, tb, u, P);
        else o.shadowed(z, sh, m => o.drawType(m, sh, tt, tb, u, P), P); }
    }
    for (const x of [g, mi, ty]) { x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; if ('letterSpacing' in x) x.letterSpacing = '0px'; }
    return { grund: s.grund, mitte: s.mitte, typo: s.typo, meta: { tiefe: { grund: .12, mitte: .5, typo: .9 }, mitteMix, typoMix, verbunden: { mitte: mitteInGrund || !!DS, typo: typoInGrund || !!DS }, cam, darsteller: !!DS, post: sh.post || 'NONE', mid: sh.mid, type: sh.type, base: sh.base, shot: sh.k } };
  };
  function ebenen(t) {
    const fr = frameAt(t); b._au = features ? features(t) : null; o._camProfile = camera; o._filmBild = (f, sh, tt) => { const p = filmPos(f, sh, tt); return p == null ? null : FB.get(filmKey(f, p)) || null; };
    try { return withFmt(() => { E.reset(); return o.withBake(b, () => o.withRes(b.scale, () => { o.frame = -1 - fr.i;
      const bs = o.bs(), D = Math.min(M.TDUR[fr.sh.trans] || 0, fr.sh.beats * .6), p = D ? (fr.tIn / bs) / D : 1;
      const cur = ebenenShot(fr.sh, fr.tIn, 'cur'), vor = fr.prev && D && p < 1 ? ebenenShot(fr.prev, fr.prev.beats * bs + fr.tIn, 'vor') : null;
      return Object.assign(cur, { t, tIn: fr.tIn, W: M.W, H: M.H, farbe: farbeAt(t), grain: true, uebergang: vor ? { art: fr.sh.trans, p } : null, vorig: vor }); })); }); }
    finally { b._au = null; o._filmBild = null; }
  }
  // Ebenen wieder zusammensetzen (Prüfung, Rückfall ohne Raum): Grund, Mitte und Typo mit ihrem Mischmodus, dann Korn
  function ebenenZusammen(e, ziel) {
    const c = ziel || document.createElement('canvas'); c.width = e.W; c.height = e.H; const x = c.getContext('2d', E.cpu ? { willReadFrequently: true } : undefined);
    x.drawImage(e.grund, 0, 0); x.globalCompositeOperation = e.meta.mitteMix; x.drawImage(e.mitte, 0, 0); x.globalCompositeOperation = e.meta.typoMix; x.drawImage(e.typo, 0, 0); x.globalCompositeOperation = 'source-over';
    if (e.grain) withFmt(() => o.withBake(b, () => o.withRes(b.scale, () => o.grain(x, e.tIn))));
    return c;
  }
  // ---------- R1 · Raum-Szene (3D-Plan R1) ----------
  // raumSzene(t): null, wenn das Bild flach ist (2D-Pfad, bitgleich), sonst { W, H, rezept, p, tex: { jetzt, vorig }, linse } für raum/raum.mjs.
  // Im Raum-Übergang sind jetzt und vorig die ganzen Bilder beider Einstellungen ohne 2D-Übergang (mit Post-Effekt und Farbe); bei p = 1 ist das Bild
  // wieder das 2D-Bild. Ohne WebGL2 zeichnet der Wirt render(t): dort läuft der Rückfall-Übergang des Rezepts (sh.trans).
  const linseVon = s => linseNorm((s && s.raum && s.raum.linse) || (RO && RO.linse));
  const flippt = s => { const L = s && s.raum && s.raum.linse; return !!(L && L.flip && !uebergangVon(s)); };   // höchstens eine Raumbewegung
  const vz = j => { if (j < 0) return 1; if (shots[j]._vz !== undefined) return shots[j]._vz; let i = j; while (i > 0 && shots[i - 1]._vz === undefined) i--;
    let v = i > 0 ? shots[i - 1]._vz : 1; for (; i <= j; i++) { if (flippt(shots[i])) v = -v; shots[i]._vz = v; } return v; };
  function linseBei(fr, t) {
    const sh = fr.sh, L = linseVon(sh); if (!L) return null;
    const pb = C.beatAt(t) - sh.b0, s = vz(fr.shotIdx); let k = (L.k || 0) * s;
    if (flippt(sh)) { const fb = Math.min(L.flipBeats || 2, sh.b1 - sh.b0); if (pb < fb) { const u = Math.max(0, pb / fb), e = u * u * (3 - 2 * u); k = (L.k || 0) * s * (2 * e - 1); } }
    if (camera === 'reactive' && features && L.kKick) { const au = features(t); if (au && au.kick) k += L.kKick * au.kick * (k < 0 ? -1 : 1); }
    if (liest(sh) && L.lesen && L.lesen.maxK != null) k = Math.max(-L.lesen.maxK, Math.min(L.lesen.maxK, k));
    return Math.abs(k) < 1e-4 && !(L.ab > 0) ? null : { k, ab: L.ab || 0 };
  }
  const RT = {};
  const kopie = (slot, c, t) => { let k = RT[slot]; if (!k || k.width !== c.width || k.height !== c.height) { k = RT[slot] = document.createElement('canvas'); k.width = c.width; k.height = c.height; }
    const x = k.getContext('2d', E.cpu ? { willReadFrequently: true } : undefined); x.reset ? x.reset() : (k.width = k.width); const w = Math.round(farbeAt(t) * 1000) / 1000;
    x.filter = Math.abs(w - 1) < 1e-3 ? 'none' : filterVon(w); x.drawImage(c, 0, 0); x.filter = 'none'; return k; };
  function raumSzene(t) {
    const fr = frameAt(t), sh = fr.sh, R = fr.prev ? uebergangVon(sh) : null, D = R ? Math.min(R.beats, sh.beats * .6) : 0, pb = C.beatAt(t) - sh.b0, ue = D > 0 && pb < D;
    const lin = linseBei(fr, t); if (!ue && !lin) return null;
    b._au = features ? features(t) : null; o._camProfile = camera; o._filmBild = (f, s, tt) => { const p = filmPos(f, s, tt); return p == null ? null : FB.get(filmKey(f, p)) || null; };
    try { return withFmt(() => { const tex = {};
      if (ue) { tex.vorig = kopie('vorig', E.render(b, { i: fr.i, sh: fr.prev, prev: null, tIn: fr.prev.beats * 60 / b.settings.bpm + fr.tIn }), t);
        tex.jetzt = kopie('jetzt', E.render(b, { i: fr.i, sh, prev: null, tIn: fr.tIn }), t); }
      else tex.jetzt = kopie('jetzt', E.render(b, fr), t);
      return { t, W: tex.jetzt.width, H: tex.jetzt.height, rezept: ue ? R : null, p: ue ? Math.max(0, pb / D) : 1, tex, linse: lin, shot: sh.k, rueckfall: ue ? sh.trans : null }; }); }
    finally { b._au = null; o._filmBild = null; }
  }
  const renderAt = t => { const fr = frameAt(t);
    if (E._pool && ![fr.sh, fr.prev].filter(Boolean).every(s => E._pool.keysVon(s).every(E._pool.istGeladen))) E._pool.stats.rueckfall++;   /* Bilder mit Hausschrift statt Pool-Schrift */
    b._au = features ? features(t) : null; o._camProfile = camera; o._filmBild = (f, sh, tt) => { const p = filmPos(f, sh, tt); return p == null ? null : FB.get(filmKey(f, p)) || null; };
    try { return farbePost(withFmt(() => E.render(b, fr)), t); } finally { b._au = null; o._filmBild = null; } };
  if (t1 != null) extend(C.beatAt(t1));
  return { clock: C, opts: b, shots, frameAt, render: renderAt, ebenen, ebenenZusammen, raumSzene, raum: RO, extend: t => extend(C.beatAt(t)), add, prepare, schriftenVorbereiten, farbe, farbeAt, get horizon() { return C.timeAt(horizon); } };
}

// ---------- K2b · Live-Fläche (Spiel, Site): wachsende Zeitleiste, Ereignisse, Pause, Budget ----------
// tick(t) liefert das Bild zur Zeit t oder null, wenn das Budget eine Pause verlangt (Wirt zeigt das letzte Bild weiter).
export function live(E, cfg = {}) {
  const { budgetMs = 8, maxFps = 30, vorlaufS = 4 } = cfg, T = timeline(E, Object.assign({}, cfg, { t1: null }));
  let paused = false, last = -1e9, lastMs = 0, skip = 0, poolIdx = -1; const stats = { bilder: 0, ausgelassen: 0, msMittel: 0 };
  return { timeline: T, add: T.add, pause() { paused = true; }, resume() { paused = false; }, get paused() { return paused; }, stats,
    tick(t) {
      if (paused) return null;
      if (t - last < 1 / maxFps - 1e-6) return null;
      if (skip > 0) { skip--; stats.ausgelassen++; return null; }
      T.extend(t + vorlaufS);
      if (cfg.films && cfg.films.length) T.prepare(t, t + 1).catch(() => {});
      if (E._pool) { const j = T.frameAt(t).shotIdx; if (j !== poolIdx) { poolIdx = j; T.schriftenVorbereiten(t, t + vorlaufS).catch(() => {}); } }   // Pool-Schriften vorab, je neuer Einstellung
      const a = performance.now(), c = cfg.zeichne ? cfg.zeichne(t) : T.render(t); lastMs = performance.now() - a; last = t;
      stats.bilder++; stats.msMittel += (lastMs - stats.msMittel) / Math.min(stats.bilder, 30);
      if (lastMs > budgetMs) skip = Math.min(3, Math.floor(lastMs / budgetMs));   // über Budget: nächste Bilder auslassen statt den Hauptfaden zu blockieren
      return c;
    } };
}

// Momentaufnahme des Materials einer laufenden H15-Instanz (Prüfung K1: gleiche Bildobjekte, gleiche Texte)
export function materialFrom(h15) {
  return { schema: 'kfb.hn-material/1', items: h15.all.filter(p => h15.imgs[p.id]).map(p => Object.assign({}, p)), imgs: Object.assign({}, h15.imgs),
    genCards: h15.genCards, WC: h15.WC, WP: h15.WP, CLAY: h15.CLAY };
}
