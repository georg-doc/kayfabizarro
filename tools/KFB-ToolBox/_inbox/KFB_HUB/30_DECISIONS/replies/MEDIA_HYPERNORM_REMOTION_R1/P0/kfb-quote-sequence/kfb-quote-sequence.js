// kfb-quote-sequence · R1 (21.10.2026, V-606) · Hypernormalisation-Lesefolge als zustandsloses Modul
// EIN Modul, zwei Ausgaben: Spiel (Inhaltsart `quote`, Einbau WS1) und Remotion-Render (WS-Media). Kein eigener Takt, kein Netz, kein DOM.
// Grammatik, Phasen, Schrift und Malen sind 1:1 aus der abgenommenen Clay Stage R2:
//   code/KFB_Billboard_Family_v1/sequence.js @7d6a8496e (Laden über raw entfernt, Pool kommt als Daten herein)
//   Gesichtspalette aus code/KFB_Clay_Stage_R2/billboards/stage.js (computeContext) + palette-roles.js @7d6a8496e
//   hashStr / mulberry32 aus travel/KFB Travel Combat v25/terrain-v25/world-context.js @5b523eb
// Der Vertragstest (test/contract.test.mjs) vergleicht das Malen Aufruf für Aufruf mit der R2-Quelle.
// Provider-Vertrag (CLAY-01 HANDOVER §2): paint(ctx2d, W, H, now, recipe) → void; `now` in ms vom Host.

// ── Seeds (world-context.js @5b523eb, unverändert) ─────────────────────────────────────────────────────
export function hashStr(s) {
  let h = 0x811c9dc5 >>> 0;
  s = String(s);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
export function normalizeSeed(v) {
  if (v == null) return 0;
  if (typeof v === 'number') return (v >>> 0);
  return hashStr(v);
}
export function mulberry32(seed) {
  let a = normalizeSeed(seed) || 1;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const WC = { hashStr, mulberry32 };

// ── Freigabe (V-606): nur Zitate mit Georgs Urteil laufen ──────────────────────────────────────────────
// Der Pool bleibt unverändert am Pin; das Urteil kommt als eigene Liste dazu (quote.status, rights bleibt).
export const RUN_STATUS = ['APPROVED_PRIVATE', 'APPROVED_PUBLIC'];
export function withApprovals(quotes, approvals) {
  return quotes.map(q => (approvals && approvals[q.id] ? { ...q, status: approvals[q.id] } : q));
}
export const runnable = q => !!q && RUN_STATUS.includes(q.status) && !!q.rights && q.rights.status === 'PUBLIC_DOMAIN_CONFIRMED';

// ── Deterministische Auswahl (sequence.js R2): hash(packId, cardNumber?, cardSeed, biomeId, biomeSeed, quoteCycle) ──
// P = { mapped: [...], reserve: [...] }; nur freigegebene Zitate (runnable) kommen in die Liste.
// Abweichung von R2 (bewusst, V-606): quoteId gilt über alle freigegebenen Zitate, nicht nur das Deck (Wilde ist für den Pilot per quoteId gepinnt).
export function selectQuote(P, o) {
  let list = o.source === 'reserve' ? P.reserve.slice() : P.mapped.filter(q => q.deckRefs.some(d => d.packId === o.packId));
  if (o.pdOnly) list = list.filter(q => q.rights && q.rights.status === 'PUBLIC_DOMAIN_CONFIRMED');
  list = list.filter(runnable);
  if (o.quoteId) { const q = P.mapped.concat(P.reserve || []).filter(runnable).find(x => x.id === o.quoteId); if (q) return { quote: q, list, seed: null, pinned: true }; }
  if (!list.length) return { quote: null, list, seed: null };
  const seed = hashStr([o.packId, o.cardNumber ?? '', o.cardSeed, o.biomeId, o.biomeSeed, o.cycle].join('|')), r = mulberry32(seed)();
  const w = list.map(q => o.source === 'reserve' ? 1 : (q.deckRefs.find(d => d.packId === o.packId) || {}).weight || 1), sum = w.reduce((a, b) => a + b, 0);
  let acc = 0, k = 0; for (; k < list.length; k++) { acc += w[k] / sum; if (r < acc) break; }
  return { quote: list[Math.min(k, list.length - 1)], list, seed };
}

// ── Phrasen und Zeitleiste (sequence.js R2, unverändert) ───────────────────────────────────────────────
export function phrases(text) {
  let parts = String(text).replace(/\s+/g, ' ').trim().split(/(?<=[,;:.!?—–])\s+|\s+\/\s+/).filter(Boolean);
  const out = []; for (const p of parts) { if (out.length && (out[out.length - 1].length < 16 || p.length < 10)) out[out.length - 1] += ' ' + p; else out.push(p); }
  const fin = []; for (const p of out) { if (p.length <= 52) { fin.push(p); continue; } const w = p.split(' '); let best = 1, bd = 1e9, acc = 0; w.forEach((x, i) => { acc += x.length + 1; const d = Math.abs(acc - p.length / 2); if (d < bd && i < w.length - 1) { bd = d; best = i + 1; } }); fin.push(w.slice(0, best).join(' '), w.slice(best).join(' ')); }
  return fin;
}
// R2 exportiert PHASES ohne resolve/turn (nur für Pins); hier die vollständige Phasenfolge der Zeitleiste.
export const PHASES = ['context', 'quote', 'resolve', 'attribution', 'turn', 'question', 'brainfood'];
export function timeline(quote) {
  const ph = phrases(quote.text), seg = []; let t = 0;
  const push = (phase, d, extra = {}) => { seg.push({ phase, t0: t, t1: t + d, ...extra }); t += d; };
  push('context', 2200);
  ph.forEach((p, i) => push('quote', 650 + 42 * p.length, { phrase: i }));
  push('resolve', 2600); push('attribution', 3600); push('turn', 700);
  push('question', 1400 + 48 * quote.frizzleQuestion.length); push('brainfood', 3400);
  return { ph, seg, total: t };
}
export function at(tl, t) { const s = tl.seg.find(x => t >= x.t0 && t < x.t1) || tl.seg[tl.seg.length - 1]; return { ...s, k: Math.min(1, Math.max(0, (t - s.t0) / (s.t1 - s.t0))) }; }
// Repräsentative Zeit je Phase (R2, unverändert): für eingefrorene ferne Tafeln
export function pinTime(tl, phase) {
  const map = { context: 'context', quote: 'resolve', attribution: 'attribution', question: 'question', brainfood: 'brainfood' }, s = tl.seg.find(x => x.phase === map[phase]);
  if (phase === 'quote') { const q = tl.seg.filter(x => x.phase === 'quote'); const m = q[Math.floor(q.length / 2)] || s; return m.t0 + (m.t1 - m.t0) * 0.6; }
  return s ? s.t0 + (s.t1 - s.t0) * 0.62 : 0;
}
// Kontextkarte (R2, unverändert bis auf WC als Vorgabe)
export function contextCard(quote, packId, cards, cardSeed, wc = WC) {
  const ref = quote && (quote.cardRefs || []).find(c => c.packId === packId);
  if (ref) { const c = cards.find(k => k.cardNumber === ref.cardNumber); if (c) return { card: c, how: 'cardRef aus dem Pool' }; }
  if (!cards.length) return { card: null, how: '–' };
  return { card: cards[Math.floor(wc.mulberry32(wc.hashStr(packId + '|' + cardSeed))() * cards.length)], how: 'Card-Seed (Deck-Ebene, keine Kartenzuordnung)' };
}
// Kontextzeile (R2 stage.js stState): Decktitel, bei Karte ' · #Nummer Name'
export const ctxLineOf = (deck, packId, card) => (deck ? deck.title : packId) + (card ? ' · #' + card.cardNumber + ' ' + card.cardName : '');

// ── Spielliste: mehrere Zitate hintereinander, Zeit läuft im Kreis ──────────────────────────────────────
export function playlist(quotes) {
  const items = []; let t = 0;
  for (const q of quotes.filter(runnable)) { const tl = timeline(q); items.push({ quote: q, tl, t0: t }); t += tl.total; }
  return { items, total: t };
}
export function playlistAt(pl, tMs) {
  if (!pl.items.length) return { quote: null, tl: null, t: 0, index: -1 };
  const tt = ((tMs % pl.total) + pl.total) % pl.total;
  let i = pl.items.length - 1; while (i > 0 && tt < pl.items[i].t0) i--;
  return { quote: pl.items[i].quote, tl: pl.items[i].tl, t: tt - pl.items[i].t0, index: i };
}

// ── Gesichtspalette (stage.js computeContext + palette-roles.js R2) ────────────────────────────────────
const toLin = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const toS = c => c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
const parseLin = h => { h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); return [0, 2, 4].map(i => toLin(parseInt(h.slice(i, i + 2), 16) / 255)); };
const fmtLin = a => '#' + a.map(v => Math.round(Math.max(0, Math.min(1, toS(Math.max(0, v)))) * 255).toString(16).padStart(2, '0')).join('');
export const mixLin = (a, b, t) => { const A = parseLin(a), B = parseLin(b); return fmtLin(A.map((v, i) => v + (B[i] - v) * t)); };
const lumLin = h => { const [r, g, b] = parseLin(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const CREAM = '#f3ead3';
// stops = [dunkel, mitte, hell]; Rollen wie R2: dark = dunkel ins Schwarzbraun, mid = mitte, glow = roles().accent, cream fest.
export function facePal(stops) {
  const [d, m, g] = stops, glow = lumLin(g) > 0.72 ? mixLin(g, m, 0.28) : g;
  return { dark: mixLin(d, '#120e0a', 0.35), mid: m, glow, cream: CREAM };
}
// Vorschlag für den Einbau (WS1 entscheidet): im Spiel ersetzt die Insel-Palette (V-270) die R2-Weltpaletten.
// R2-Stops sind [dunkel, mitte, hell] aus drei Farbfamilien. Aus ENV_ROLES (je Rolle hell → dunkel):
// dunkel = earth[2] (Unterseite der Insel), mitte = accent[2] (dunkelster Akzent), hell = accent[0]. Ein reiner Akzent-Verlauf hätte
// kein Dunkel (Pilot-Probe 21.10.: rosa Schleier); accent[1] als Mitte gab in der Frage-Phase nur 2,65:1 (Critic 21.10.).
// Vertragstest: Creme auf Frage-Hintergrund ≥ 3:1 für alle Inseln.
export const stopsFromEnvRoles = E => [E.earth[2], E.accent[2], E.accent[0]];

// ── Malen (sequence.js R2, unverändert) ────────────────────────────────────────────────────────────────
export const FONTS = { quote: '"Bodoni Moda", Georgia, serif', disp: '"Big Shoulders Display", Impact, sans-serif', q: '"Archivo", Arial, sans-serif', mono: '"IBM Plex Mono", monospace' };
export const FONT_LOADS = ['italic 500 40px "Bodoni Moda"', 'italic 600 40px "Bodoni Moda"', 'italic 700 40px "Bodoni Moda"', '900 40px "Big Shoulders Display"', '700 40px "Archivo"', '500 20px "IBM Plex Mono"', '600 20px "IBM Plex Mono"'];
const F = FONTS;
const lum = h => { const n = parseInt(h.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const mixHex = (a, b, t) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), f = s => Math.round(((A >> s) & 255) * (1 - t) + ((B >> s) & 255) * t); return '#' + [16, 8, 0].map(s => f(s).toString(16).padStart(2, '0')).join(''); };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
function cover(ctx, src, W, H) { const iw = src.naturalWidth || src.width, ih = src.naturalHeight || src.height; if (!iw || !ih) return false; const s = Math.max(W / iw, H / ih), dw = iw * s, dh = ih * s; ctx.drawImage(src, (W - dw) / 2, (H - dh) / 2, dw, dh); return true; }
function layoutWords(ctx, words, maxW) { const lines = [[]]; let w = 0; const sp = ctx.measureText(' ').width; for (const t of words) { const tw = ctx.measureText(t.w).width; if (lines[lines.length - 1].length && w + sp + tw > maxW) { lines.push([]); w = 0; } const L = lines[lines.length - 1]; t.x = L.length ? w + sp : 0; t.tw = tw; w = t.x + tw; L.push(t); } return lines.map(L => ({ L, w: L.length ? L[L.length - 1].x + L[L.length - 1].tw : 0 })); }
function fitWords(ctx, words, font, maxW, maxH, start, lhK = 1.12, min = 14) { let s = start, lines; for (;;) { ctx.font = font(s); lines = layoutWords(ctx, words, maxW); if (lines.length * s * lhK <= maxH || s <= min) break; s *= 0.94; } return { s, lines, lh: s * lhK }; }
function fitLines(ctx, text, font, maxW, maxH, start, lhK = 1.1, min = 14) { const words = text.split(' ').map(w => ({ w })); const r = fitWords(ctx, words, font, maxW, maxH, start, lhK, min); return { ...r, rows: r.lines.map(l => ({ text: l.L.map(t => t.w).join(' '), w: l.w })) }; }

// st = { quote, tl, t, lod, base, pal:{dark,mid,glow,cream}, ctxLine, readAlong }
export function paintSequence(ctx, W, H, st) {
  const s = W / 1024, P = st.pal, cream = P.cream, q = st.quote;
  ctx.save(); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  ctx.fillStyle = P.dark; ctx.fillRect(0, 0, W, H);
  if (st.base) cover(ctx, st.base, W, H);
  if (!q) { ctx.fillStyle = rgba(P.dark, 0.72); ctx.fillRect(0, 0, W, H); ctx.fillStyle = cream; ctx.font = `600 ${22 * s}px ${F.mono}`; ctx.fillText(st.unavailable || 'SOURCE UNAVAILABLE', 40 * s, H - 40 * s); ctx.restore(); return; }
  const a = at(st.tl, st.t), far = st.lod === 'mid';
  const shade = k => { ctx.fillStyle = rgba(P.dark, k); ctx.fillRect(0, 0, W, H); };
  if (a.phase === 'context') {
    ctx.fillStyle = rgba(P.dark, 0.78); ctx.fillRect(0, H - 52 * s, W, 52 * s);
    ctx.fillStyle = P.glow; ctx.fillRect(0, H - 52 * s, 10 * s, 52 * s);
    ctx.fillStyle = cream; ctx.font = `600 ${19 * s}px ${F.mono}`; ctx.fillText(st.ctxLine, 28 * s, H - 19 * s);
  } else if (a.phase === 'quote' || a.phase === 'resolve') {
    shade(0.76);
    const cur = a.phase === 'resolve' ? 1e9 : a.phrase;
    if (far) { const txt = st.tl.ph[Math.min(a.phrase ?? 0, st.tl.ph.length - 1)]; const f = fitLines(ctx, txt.toUpperCase(), z => `900 ${z}px ${F.disp}`, W * 0.88, H * 0.8, 170 * s, 0.98); const y0 = H / 2 - (f.rows.length - 1) * f.lh / 2 + f.s * 0.34; ctx.fillStyle = cream; ctx.textAlign = 'center'; f.rows.forEach((r, i) => ctx.fillText(r.text, W / 2, y0 + i * f.lh)); ctx.restore(); return; }
    const words = []; st.tl.ph.forEach((p, i) => p.split(' ').forEach(w => words.push({ w, p: i })));
    const bx = W * 0.1, by = H * 0.14, bw = W * 0.8, bh = H * 0.7;
    const f = fitWords(ctx, words, z => `italic 500 ${z}px ${F.quote}`, bw, bh, 64 * s, 1.16);
    const y0 = by + (bh - f.lines.length * f.lh) / 2 + f.s * 0.92;
    ctx.fillStyle = P.glow; ctx.font = `italic 700 ${f.s * 2.4}px ${F.quote}`; ctx.fillText('“', bx - f.s * 1.5, y0 + f.s * 0.55);
    ctx.font = `italic 500 ${f.s}px ${F.quote}`;
    f.lines.forEach((ln, li) => ln.L.forEach(t => { if (t.p > cur) return; ctx.fillStyle = st.readAlong && t.p === cur ? P.glow : cream; ctx.fillText(t.w, bx + t.x, y0 + li * f.lh); }));
  } else if (a.phase === 'attribution') {
    shade(0.72);
    if (far) { const f = fitLines(ctx, q.author.toUpperCase(), z => `900 ${z}px ${F.disp}`, W * 0.88, H * 0.7, 150 * s, 0.98); ctx.fillStyle = P.glow; ctx.textAlign = 'center'; const y0 = H / 2 - (f.rows.length - 1) * f.lh / 2 + f.s * 0.34; f.rows.forEach((r, i) => ctx.fillText(r.text, W / 2, y0 + i * f.lh)); ctx.restore(); return; }
    const f = fitLines(ctx, q.text, z => `italic 500 ${z}px ${F.quote}`, W * 0.8, H * 0.4, 38 * s, 1.14);
    ctx.fillStyle = rgba(cream, 0.62); ctx.font = `italic 500 ${f.s}px ${F.quote}`; f.rows.forEach((r, i) => ctx.fillText(r.text, W * 0.1, H * 0.12 + f.s + i * f.lh));
    const yA = H * 0.12 + f.s + f.rows.length * f.lh + 18 * s;
    ctx.fillStyle = P.glow; ctx.fillRect(W * 0.1, yA, 64 * s, 6 * s);
    const fa = fitLines(ctx, q.author.toUpperCase(), z => `900 ${z}px ${F.disp}`, W * 0.8, H * 0.22, 82 * s, 0.95);
    ctx.font = `900 ${fa.s}px ${F.disp}`; fa.rows.forEach((r, i) => ctx.fillText(r.text, W * 0.1, yA + 18 * s + fa.s * 0.9 + i * fa.lh));
    const yW = yA + 18 * s + fa.s * 0.9 + (fa.rows.length - 1) * fa.lh + 40 * s, yr = (q.provenance && q.provenance.publicationYear) || q.publicationYear;
    ctx.fillStyle = cream; ctx.font = `italic 600 ${28 * s}px ${F.quote}`; ctx.fillText(q.work + (yr ? ' · ' + yr : ''), W * 0.1, yW);
    const loc = q.provenance ? [q.provenance.edition, q.provenance.pageOrLocator].filter(Boolean).join(' · ') : '';
    ctx.fillStyle = rgba(cream, 0.72); ctx.font = `500 ${15 * s}px ${F.mono}`; ctx.fillText(loc.length > 96 ? loc.slice(0, 95) + '…' : loc, W * 0.1, yW + 30 * s);
  } else if (a.phase === 'turn') {
    shade(0.5); const n = Math.floor(a.k * 3) + 1; ctx.fillStyle = P.mid; for (let i = 0; i < n; i++) ctx.fillRect(0, i * H / 3, W * (0.55 + 0.15 * i + a.k * 0.4), H / 3);
  } else if (a.phase === 'question') {
    const bg = lum(P.mid) > 0.34 ? mixHex(P.mid, P.dark, 0.55) : P.mid;
    ctx.fillStyle = rgba(bg, 0.9); ctx.fillRect(0, 0, W, H);
    ctx.font = `900 ${34 * s}px ${F.disp}`; const kick = 'FRIZZLEBOB ASKS YOU', kw = ctx.measureText(kick).width;
    if (far) { const f = fitLines(ctx, kick, z => `900 ${z}px ${F.disp}`, W * 0.88, H * 0.7, 150 * s, 0.98); ctx.fillStyle = cream; ctx.textAlign = 'center'; const y0 = H / 2 - (f.rows.length - 1) * f.lh / 2 + f.s * 0.34; f.rows.forEach((r, i) => ctx.fillText(r.text, W / 2, y0 + i * f.lh)); ctx.restore(); return; }
    ctx.fillStyle = P.glow; ctx.fillRect(W * 0.08, H * 0.1, kw + 28 * s, 46 * s); ctx.fillStyle = P.dark; ctx.fillText(kick, W * 0.08 + 14 * s, H * 0.1 + 35 * s);
    const f = fitLines(ctx, q.frizzleQuestion, z => `700 ${z}px ${F.q}`, W * 0.84, H * 0.6, 54 * s, 1.14);
    ctx.fillStyle = cream; ctx.font = `700 ${f.s}px ${F.q}`; const y0 = H * 0.26 + (H * 0.62 - f.rows.length * f.lh) / 2 + f.s * 0.85; f.rows.forEach((r, i) => ctx.fillText(r.text, W * 0.08, y0 + i * f.lh));
  } else if (a.phase === 'brainfood') {
    shade(0.8); const bf = (q.brainFood || [])[0];
    ctx.font = `900 ${30 * s}px ${F.disp}`; ctx.fillStyle = P.glow; ctx.fillText('BRAIN FOOD', W * 0.1, H * 0.28);
    if (bf) {
      const f = fitLines(ctx, bf.label, z => `italic 600 ${z}px ${F.quote}`, W * 0.8, H * 0.32, 50 * s, 1.12);
      ctx.fillStyle = cream; ctx.font = `italic 600 ${f.s}px ${F.quote}`; f.rows.forEach((r, i) => ctx.fillText(r.text, W * 0.1, H * 0.28 + 30 * s + f.s + i * f.lh));
      let host = ''; try { host = new URL(bf.url).host; } catch (e) {}
      ctx.font = `500 ${18 * s}px ${F.mono}`; ctx.fillStyle = rgba(cream, 0.8); ctx.fillText(host + ' · ' + (bf.kind || '').replace(/_/g, ' ').toLowerCase(), W * 0.1, H * 0.28 + 30 * s + f.s + f.rows.length * f.lh + 18 * s);
      ctx.fillText('rights: ' + ((q.rights && q.rights.status) || '–'), W * 0.1, H * 0.86);
    }
  }
  ctx.restore();
}

// ── Rezept und Provider ────────────────────────────────────────────────────────────────────────────────
// recipe = { quotes (mit Status), pal, ctxLine, readAlong = true, lod = 'near' | 'mid', base? (Bildquelle, z. B. die Karte), offsetMs = 0,
//           ctx? { [quoteId]: { ctxLine, base } } (je Zitat eigener Kontext, z. B. Zitat aus einem anderen Deck ohne Karte) }
// sample() rechnet nur den Zustand aus; paint() malt ihn. Gleiche Eingabe → gleiches Bild.
const plCache = new WeakMap();
const plOf = recipe => { let pl = plCache.get(recipe.quotes); if (!pl) { pl = playlist(recipe.quotes); plCache.set(recipe.quotes, pl); } return pl; };
export function sample(recipe, tMs) {
  const pl = plOf(recipe), cur = playlistAt(pl, tMs + (recipe.offsetMs || 0));
  const c = cur.quote && recipe.ctx && recipe.ctx[cur.quote.id];
  return { quote: cur.quote, tl: cur.tl, t: cur.t, index: cur.index, lod: recipe.lod || 'near', base: (c && 'base' in c ? c.base : recipe.base) || null, pal: recipe.pal, ctxLine: (c && c.ctxLine) || recipe.ctxLine || '', readAlong: recipe.readAlong !== false, unavailable: 'NO APPROVED QUOTE' };
}
export function paint(ctx2d, W, H, now, recipe) { paintSequence(ctx2d, W, H, sample(recipe, now)); }
export const loopMs = recipe => plOf(recipe).total;
