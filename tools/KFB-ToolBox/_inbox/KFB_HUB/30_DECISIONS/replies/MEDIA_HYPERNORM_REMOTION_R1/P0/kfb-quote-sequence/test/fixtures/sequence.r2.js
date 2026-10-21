// KFB Billboard Family v1 · Quote-Sequenz (04.10.2026)
// Daten: Quote-Pool + Research Reserve live über raw am Pin des Planungszweigs (PR #354). Keine lokale Kopie, keine
// Ersatzzitate: lädt eine Quelle nicht, meldet die Bühne SOURCE UNAVAILABLE und behält den letzten echten Inhalt.
// Provider-Vertrag (CLAY-01 HANDOVER §2): paint(ctx2d, W, H, now, bb) → void. Kein eigener Takt; die Zeit kommt vom Host.
export const POOL_PIN = '05d61058eaaa8f465b4e2add08cffbf70752fe8f';
const RAW = p => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + POOL_PIN + '/' + p.split('/').map(encodeURIComponent).join('/');
export const POOL_PATHS = {
  mapped: 'skills/chat/workflows/KFB_BILLBOARD_QUOTE_HYPERNORMALISATION_2026-10-04/QUOTE_POOL_BATCH_01.json',
  reserve: 'skills/chat/workflows/KFB_BILLBOARD_QUOTE_HYPERNORMALISATION_2026-10-04/QUOTE_RESEARCH_RESERVE_01.json',
  registry: 'media/kfb/index.json'
};
export async function loadPools() {
  const get = async p => { const r = await fetch(RAW(p), { cache: 'no-store' }); if (!r.ok) throw new Error(p.split('/').pop() + ' HTTP ' + r.status); return r.json(); };
  const [a, b, reg] = await Promise.all([get(POOL_PATHS.mapped), get(POOL_PATHS.reserve), get(POOL_PATHS.registry)]);
  const decks = new Map(reg.decks.map(d => [d.packId, d]));
  const mappedDecks = [...new Set(a.quotes.flatMap(q => q.deckRefs.map(d => d.packId)))].map(id => decks.get(id)).filter(Boolean);
  return { mapped: a.quotes, reserve: b.candidates, decks, mappedDecks, registryCount: reg.decks.length, schema: [a.schema, b.schema] };
}
const deckCache = new Map();
export async function loadDeckCards(deck) {
  if (!deck || !deck.data) throw new Error('Deck ohne data-Feld');
  if (!deckCache.has(deck.packId)) deckCache.set(deck.packId, fetch(RAW('media/kfb/' + deck.data)).then(r => { if (!r.ok) throw new Error(deck.data + ' HTTP ' + r.status); return r.json(); }).then(j => (j.cards || []).filter(c => c.cardName && !/blank|cover|rules/i.test(c.cardName))));
  return deckCache.get(deck.packId);
}

// ── Deterministische Auswahl: hash(packId, cardNumber?, cardSeed, biomeId, biomeSeed, quoteCycle) ───────────
export function selectQuote(P, o, WC) {
  let list = o.source === 'reserve' ? P.reserve.slice() : P.mapped.filter(q => q.deckRefs.some(d => d.packId === o.packId));
  if (o.pdOnly) list = list.filter(q => q.rights && q.rights.status === 'PUBLIC_DOMAIN_CONFIRMED');
  if (!list.length) return { quote: null, list, seed: null };
  if (o.quoteId) { const q = list.find(x => x.id === o.quoteId); if (q) return { quote: q, list, seed: null, pinned: true }; }
  const seed = WC.hashStr([o.packId, o.cardNumber ?? '', o.cardSeed, o.biomeId, o.biomeSeed, o.cycle].join('|')), r = WC.mulberry32(seed)();
  const w = list.map(q => o.source === 'reserve' ? 1 : (q.deckRefs.find(d => d.packId === o.packId) || {}).weight || 1), sum = w.reduce((a, b) => a + b, 0);
  let acc = 0, k = 0; for (; k < list.length; k++) { acc += w[k] / sum; if (r < acc) break; }
  return { quote: list[Math.min(k, list.length - 1)], list, seed };
}
export function contextCard(quote, packId, cards, cardSeed, WC) {
  const ref = quote && (quote.cardRefs || []).find(c => c.packId === packId);
  if (ref) { const c = cards.find(k => k.cardNumber === ref.cardNumber); if (c) return { card: c, how: 'cardRef aus dem Pool' }; }
  if (!cards.length) return { card: null, how: '–' };
  return { card: cards[Math.floor(WC.mulberry32(WC.hashStr(packId + '|' + cardSeed))() * cards.length)], how: 'Card-Seed (Deck-Ebene, keine Kartenzuordnung)' };
}

// ── Phrasen und Zeitleiste ──────────────────────────────────────────────────────────────────────────
export function phrases(text) {
  let parts = String(text).replace(/\s+/g, ' ').trim().split(/(?<=[,;:.!?—–])\s+|\s+\/\s+/).filter(Boolean);
  const out = []; for (const p of parts) { if (out.length && (out[out.length - 1].length < 16 || p.length < 10)) out[out.length - 1] += ' ' + p; else out.push(p); }
  const fin = []; for (const p of out) { if (p.length <= 52) { fin.push(p); continue; } const w = p.split(' '); let best = 1, bd = 1e9, acc = 0; w.forEach((x, i) => { acc += x.length + 1; const d = Math.abs(acc - p.length / 2); if (d < bd && i < w.length - 1) { bd = d; best = i + 1; } }); fin.push(w.slice(0, best).join(' '), w.slice(best).join(' ')); }
  return fin;
}
export const PHASES = ['context', 'quote', 'attribution', 'question', 'brainfood'];
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
export function pinTime(tl, phase) {
  const map = { context: 'context', quote: 'resolve', attribution: 'attribution', question: 'question', brainfood: 'brainfood' }, s = tl.seg.find(x => x.phase === map[phase]);
  if (phase === 'quote') { const q = tl.seg.filter(x => x.phase === 'quote'); const m = q[Math.floor(q.length / 2)] || s; return m.t0 + (m.t1 - m.t0) * 0.6; }
  return s ? s.t0 + (s.t1 - s.t0) * 0.62 : 0;
}

// ── Malen ─────────────────────────────────────────────────────────────────────────────────────────────
const F = { quote: '"Bodoni Moda", Georgia, serif', disp: '"Big Shoulders Display", Impact, sans-serif', q: '"Archivo", Arial, sans-serif', mono: '"IBM Plex Mono", monospace' };
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
    ctx.fillStyle = P.glow; ctx.font = `italic 700 ${f.s * 2.4}px ${F.quote}`; ctx.fillText('\u201C', bx - f.s * 1.5, y0 + f.s * 0.55);
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
