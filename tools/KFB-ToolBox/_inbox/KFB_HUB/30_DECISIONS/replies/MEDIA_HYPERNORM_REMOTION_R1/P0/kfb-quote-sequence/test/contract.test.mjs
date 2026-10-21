// Vertragstests kfb-quote-sequence R1 · node --test modules/kfb-quote-sequence/test/contract.test.mjs
// 1) Malen ist Aufruf für Aufruf gleich der abgenommenen R2-Quelle (keine Neugestaltung).
// 2) Nur freigegebene Zitate laufen. 3) Determinismus. 4) Höchstens 3 Helligkeitssprünge pro Sekunde (G7).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Q from '../kfb-quote-sequence.js';
import * as R2 from './fixtures/sequence.r2.js';
import { roles as r2roles, mix as r2mix } from './fixtures/palette-roles.r2.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MOD = path.join(HERE, '..');
const pilot = JSON.parse(fs.readFileSync(path.join(MOD, 'p0.pilot.json'), 'utf8'));
const pool = JSON.parse(fs.readFileSync(path.join(MOD, pilot.pool), 'utf8'));
const quotes = Q.withApprovals(pool.quotes, pilot.approvals.status);
const pal = Q.facePal(pilot.palette.stops);
import { ENV_ROLES } from './fixtures/island-palettes.planet-a701da4.js';
const CARD_MEAN = '#b8c8c2'; // mittlere Farbe der Karte glossy_horizon.jpg (1×1-Verkleinerung)
const ctxOf = q => { const c = pilot.context[q.id]; return { ctxLine: Q.ctxLineOf({ title: c.deckTitle }, c.packId, c.card), base: c.base ? 'card' : null }; };
const CTX = Object.fromEntries(quotes.map(q => [q.id, ctxOf(q)]));

// Aufzeichnender 2D-Kontext: misst Text deterministisch (Zeichen × Schriftgröße × 0,5)
function recCtx() {
  const ops = []; const st = { font: '10px x', fillStyle: '#000', textAlign: 'left', textBaseline: 'alphabetic' }; const stack = [];
  const size = () => parseFloat((st.font.match(/([\d.]+)px/) || [0, 10])[1]);
  const ctx = {
    ops,
    save() { stack.push({ ...st }); ops.push(['save']); },
    restore() { Object.assign(st, stack.pop()); ops.push(['restore']); },
    fillRect(x, y, w, h) { ops.push(['fillRect', st.fillStyle, +x.toFixed(3), +y.toFixed(3), +w.toFixed(3), +h.toFixed(3)]); },
    fillText(t, x, y) { ops.push(['fillText', st.font, st.fillStyle, st.textAlign, t, +x.toFixed(3), +y.toFixed(3)]); },
    measureText(t) { return { width: String(t).length * size() * 0.5 }; },
    drawImage(...a) { ops.push(['drawImage', ...a.slice(1).map(v => +(+v).toFixed(3))]); },
  };
  for (const k of ['font', 'fillStyle', 'textAlign', 'textBaseline']) Object.defineProperty(ctx, k, { get: () => st[k], set: v => { st[k] = v; } });
  return ctx;
}
const times = tl => { const out = []; for (let t = 0; t < tl.total; t += 97) out.push(t); for (const s of tl.seg) out.push(s.t0, (s.t0 + s.t1) / 2, s.t1 - 1); return out; };

test('Pilot: drei Zitate, alle freigegeben, rights unverändert PUBLIC_DOMAIN_CONFIRMED', () => {
  assert.deepEqual(quotes.map(q => q.id), pilot.order);
  for (const q of quotes) { assert.equal(q.status, 'APPROVED_PRIVATE'); assert.equal(q.rights.status, 'PUBLIC_DOMAIN_CONFIRMED'); assert.ok(Q.runnable(q)); }
  for (const q of pool.quotes) assert.equal(q.status, 'RESEARCHED', 'Pool-Kopie bleibt wörtlich wie am Pin');
});

test('Ohne Freigabe läuft nichts', () => {
  assert.equal(Q.playlist(pool.quotes).items.length, 0);
  const ctx = recCtx(); Q.paint(ctx, 1024, 572, 0, { quotes: pool.quotes, pal, ctxLine: 'x' });
  assert.ok(ctx.ops.some(o => o[0] === 'fillText' && o[4] === 'NO APPROVED QUOTE'));
  const restricted = { ...quotes[0], rights: { ...quotes[0].rights, status: 'RESEARCHED_RESTRICTED' } };
  assert.equal(Q.runnable(restricted), false);
});

test('Phrasen und Zeitleiste gleich R2', () => {
  for (const q of quotes) {
    assert.deepEqual(Q.phrases(q.text), R2.phrases(q.text));
    assert.deepEqual(Q.timeline(q), R2.timeline(q));
  }
});

test('Malen Aufruf für Aufruf gleich R2 (nah und fern, 1024×512 und 1,79:1)', () => {
  for (const q of quotes) {
    const tl = Q.timeline(q);
    for (const [W, H] of [[1024, 512], [1024, 572], [1920, 1073]]) for (const lod of ['near', 'mid']) for (const t of times(tl)) {
      const st = { quote: q, tl, t, lod, base: null, pal, ctxLine: CTX[q.id].ctxLine, readAlong: true };
      const a = recCtx(), b = recCtx();
      Q.paintSequence(a, W, H, st); R2.paintSequence(b, W, H, st);
      assert.deepEqual(a.ops, b.ops, `${q.id} t=${t} ${lod} ${W}x${H}`);
    }
  }
});

test('Gesichtspalette gleich R2 (stage.js computeContext)', () => {
  const [d, m, g] = pilot.palette.stops;
  const R = r2roles([d, m, g], '#3e6a83', false);
  assert.deepEqual(pal, { dark: r2mix(d, '#120e0a', 0.35), mid: m, glow: R.accent, cream: '#f3ead3' });
});

test('Auswahl deterministisch und gleich R2 auf der freigegebenen Liste', () => {
  const P = { mapped: quotes, reserve: [] };
  for (let cycle = 0; cycle < 50; cycle++) {
    const o = { source: 'mapped', packId: 'forget_utopia', cardSeed: 'kfb-1', biomeId: 'AUTO', biomeSeed: 'b-1', cycle, pdOnly: true };
    const a = Q.selectQuote(P, o), b = Q.selectQuote(P, o), r = R2.selectQuote(P, o, Q.WC);
    assert.equal(a.quote.id, b.quote.id); assert.equal(a.quote.id, r.quote.id); assert.equal(a.seed, r.seed);
  }
  const pin = Q.selectQuote(P, { source: 'mapped', packId: 'forget_utopia', quoteId: 'q-b01-1001-wilde-mask-truth', pdOnly: true });
  assert.equal(pin.quote.id, 'q-b01-1001-wilde-mask-truth');
});

test('Determinismus: gleiche Zeit, gleiches Bild; keine Uhr, kein Zufall, kein Netz im Modul', () => {
  const recipe = { quotes, pal, ctx: CTX };
  for (const t of [0, 1234, 9876, Q.loopMs(recipe) + 1234]) {
    const a = recCtx(), b = recCtx(); Q.paint(a, 1024, 572, t, recipe); Q.paint(b, 1024, 572, t, recipe); assert.deepEqual(a.ops, b.ops);
  }
  const c1 = recCtx(), c2 = recCtx(); Q.paint(c1, 1024, 572, 1234, recipe); Q.paint(c2, 1024, 572, Q.loopMs(recipe) + 1234, recipe); assert.deepEqual(c1.ops, c2.ops, 'Loop schließt nahtlos');
  const src = fs.readFileSync(path.join(MOD, 'kfb-quote-sequence.js'), 'utf8').replace(/\/\/.*$/gm, '');
  for (const bad of ['Math.random', 'Date.now', 'new Date', 'performance.now', 'fetch(', 'document.', 'window.', 'requestAnimationFrame']) assert.ok(!src.includes(bad), bad);
});

test('Nur die vier Schriften aus R2 und nur Farben aus der Palette', () => {
  const recipe = { quotes, pal, ctx: CTX }, fams = new Set(), cols = new Set();
  for (let t = 0; t < Q.loopMs(recipe); t += 50) { const c = recCtx(); Q.paint(c, 1024, 572, t, recipe); for (const o of c.ops) { if (o[0] === 'fillText') { fams.add(o[1].replace(/^.*?px /, '')); cols.add(o[2]); } if (o[0] === 'fillRect') cols.add(o[1]); } }
  assert.deepEqual([...fams].sort(), Object.values(Q.FONTS).sort());
  const base = [pal.dark, pal.mid, pal.glow, pal.cream].map(h => parseInt(h.slice(1), 16)).map(n => `${n >> 16},${(n >> 8) & 255},${n & 255}`);
  for (const c of cols) { const ok = [pal.dark, pal.mid, pal.glow, pal.cream].includes(c) || base.some(b => c.startsWith(`rgba(${b},`)) || /^#[0-9a-f]{6}$/.test(c); assert.ok(ok, c); }
});

// Grobe Bildhelligkeit aus den Flächen (Text ignoriert): Deckkraft wird über die Fläche gemischt
const hexLum = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0); };
function frameLum(ops, W, H) {
  let L = 0;
  for (const o of ops) {
    if (o[0] !== 'fillRect') continue;
    const [, col, , , w, h] = o, area = Math.min(1, (w * h) / (W * H));
    let c = col, a = 1; const m = /^rgba\((\d+),(\d+),(\d+),([\d.]+)\)$/.exec(col);
    if (m) { c = '#' + [m[1], m[2], m[3]].map(v => (+v).toString(16).padStart(2, '0')).join(''); a = +m[4]; }
    L = L * (1 - a * area) + hexLum(c) * a * area;
  }
  return L;
}
test('G7: höchstens 3 Helligkeitssprünge (> 10 %) pro Sekunde, mit Karte als Basis', () => {
  const recipe = { quotes, pal, ctx: CTX }, W = 1024, H = 572, fps = 30, lums = [];
  for (let f = 0; f * 1000 / fps < Q.loopMs(recipe); f++) {
    const c = recCtx(), st = Q.sample(recipe, f * 1000 / fps);
    Q.paintSequence(c, W, H, { ...st, base: null });
    if (st.base) c.ops.splice(c.ops.findIndex(o => o[0] === 'fillRect') + 1, 0, ['fillRect', CARD_MEAN, 0, 0, W, H]); // Karte deckt das Bild
    lums.push(frameLum(c.ops, W, H));
  }
  const jumps = []; for (let i = 1; i < lums.length; i++) if (Math.abs(lums[i] - lums[i - 1]) > 0.1) jumps.push(i);
  let worst = 0; for (const j of jumps) worst = Math.max(worst, jumps.filter(k => k >= j && k < j + fps).length);
  assert.ok(worst <= 3, `max ${worst} Sprünge in 1 s`);
});

// WCAG-Kontrast
const contrast = (a, b) => { const [x, y] = [hexLum(a), hexLum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const qBg = p => { const L = hexLum(p.mid); if (L > 0.34) { const A = parseInt(p.mid.slice(1), 16), B = parseInt(p.dark.slice(1), 16), f = s => Math.round(((A >> s) & 255) * 0.45 + ((B >> s) & 255) * 0.55); return '#' + [16, 8, 0].map(s => f(s).toString(16).padStart(2, '0')).join(''); } return p.mid; };
test('Lesbarkeit: Creme auf dunkel und auf Frage-Hintergrund ≥ 3:1 für alle Inseln (Vorschlag stopsFromEnvRoles)', () => {
  for (const [id, E] of Object.entries(ENV_ROLES)) {
    const p = Q.facePal(Q.stopsFromEnvRoles(E));
    assert.ok(contrast(p.cream, qBg(p)) >= 3, `${id} Frage ${contrast(p.cream, qBg(p)).toFixed(2)}`);
    assert.ok(contrast(p.cream, p.dark) >= 4.5, `${id} dunkel ${contrast(p.cream, p.dark).toFixed(2)}`);
  }
  assert.deepEqual(Q.stopsFromEnvRoles(ENV_ROLES.otown), pilot.palette.stops);
});

test('pinTime und contextCard gleich R2; Kontextzeile nach R2-Formel', () => {
  for (const q of quotes) { const tl = Q.timeline(q); for (const ph of ['context', 'quote', 'attribution', 'question', 'brainfood']) assert.equal(Q.pinTime(tl, ph), R2.pinTime(tl, ph)); }
  const cards = [{ cardNumber: 1, cardName: 'The Glossy Horizon' }, { cardNumber: 2, cardName: 'The Finished City' }];
  for (const seed of ['kfb-1', 'kfb-2', 'x']) assert.deepEqual(Q.contextCard(quotes[0], 'forget_utopia', cards, seed), R2.contextCard(quotes[0], 'forget_utopia', cards, seed, Q.WC));
  assert.equal(CTX['q-b01-utopia-thoreau-tools'].ctxLine, 'Forget Utopia · #1 The Glossy Horizon');
  assert.equal(CTX['q-b01-1001-wilde-mask-truth'].ctxLine, "Uncle FrizzleBob's 1001 Kayfabe Nights");
  assert.equal(CTX['q-b01-1001-wilde-mask-truth'].base, null, 'Wilde nicht auf der Forget-Utopia-Karte');
  for (const id of pilot.boards.glossy_horizon.quotes) assert.equal(pilot.context[id].packId, 'forget_utopia', 'Glossy-Horizon-Tafel zeigt nur Zitate ihres Decks');
  for (const q of quotes) for (const d of q.deckRefs) assert.equal(d.packId, pilot.context[q.id].packId, 'Kontext = eigenes Deck des Zitats');
});
