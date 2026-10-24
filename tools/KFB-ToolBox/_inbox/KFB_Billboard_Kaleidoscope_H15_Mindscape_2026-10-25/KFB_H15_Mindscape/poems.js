// KFB H15 · Gedichte: Text live von Wikisource (wörtlich, mit Seiten-URL), dazu die gemeinfreien Zitate aus quote_index_full.json.
// PoemBand setzt Zeile für Zeile im Engine-Takt auf eine Leinwand, die als Band in der Kugel hängt.
function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const WS = ['en', 'de'];
const clean = s => s.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

const JUNK = /^(by|von|from)\b|copyright|avenue|publish|press\b|printed|london|new york|edition|chapter|contents|translated|^\[|\]$/i;
function verse(html, sur, prose) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const au = clean((doc.querySelector('#ws-author') || {}).textContent || '').toLowerCase(); if (sur && au && !au.includes(sur)) return [];
  doc.querySelectorAll('.ws-noexport, .wst-header, style, sup, .reference, table, .mw-editsection').forEach(n => n.remove());
  let blocks = [...doc.querySelectorAll('.poem')];
  if (!blocks.length) blocks = [...doc.querySelectorAll('p, dd')].filter(p => p.querySelectorAll('br').length >= 1);
  const bl = blocks.map(bk => { bk.querySelectorAll('br').forEach(br => br.replaceWith('\u2028')); return bk.textContent.split(/\u2028|\n\s*\n/).map(clean).filter(l => l && l.length <= 90 && !(/^[^a-z]*$/.test(l) && l.length < 40) && !JUNK.test(l) && !(sur && l.toLowerCase().includes(sur))); }).filter(x => x.length);
  let best = 0; bl.forEach((x, i) => { if (x.length > bl[best].length) best = i; });
  const out = []; for (let i = best; i < bl.length && out.filter(Boolean).length < 14; i++) { bl[i].forEach(l => { if (out.filter(Boolean).length < 14) out.push(l); }); out.push(''); }
  while (out.length && !out[out.length - 1]) out.pop();
  if (out.filter(Boolean).length >= 3 || !prose) return out;
  const pr = [];
  [...doc.querySelectorAll('p')].map(p => clean(p.textContent)).filter(t => t.length > 60).forEach(t => t.split(/(?<=[.;:!?])\s+/).forEach(x => { x = x.replace(/^\d+\s*/, ''); if (JUNK.test(x) || (sur && x.toLowerCase().includes(sur))) return; if (x.length >= 12 && x.length <= 90 && pr.length < 8) pr.push(x); }));
  return pr;
}
// Netz- und HTTP-Fehler bleiben von einem echten "kein Treffer" getrennt, damit sie wiederholt werden
const jf = url => fetch(url).then(r => { if (!r.ok) { const e = new Error('HTTP ' + r.status); e.net = true; throw e; } return r.json(); }, err => { const e = new Error('Netz: ' + (err && err.message || err)); e.net = true; throw e; });
function wsPoem(lang, rec) {
  const api = 'https://' + lang + '.wikisource.org/w/api.php?format=json&origin=*&';
  const key = rec.title.split(/[:(]/)[0].trim(), first = (key.split(' ').find(w => w.length >= 4) || key).toLowerCase();
  const q = s => jf(api + 'action=query&list=search&srlimit=8&srsearch=' + encodeURIComponent(s));
  return q(key + ' ' + rec.creator).then(j => (((j.query || {}).search || []).length ? j : q('intitle:"' + key + '"'))).then(j => {
    const sur = (rec.creator.split('/')[0].trim().split(' ').pop() || '').toLowerCase().replace(/[^a-zà-ÿ]/g, ''), kl = key.toLowerCase(), rank = h => { const t = h.title.toLowerCase(); return (t === kl || t.endsWith('/' + kl) ? 0 : 2) + (/front.matter|commentary|introduction|preface|contents|notes/.test(t) ? 9 : 0); };
    const hits = ((j.query || {}).search || []).filter(h => h.title.toLowerCase().includes(first) && rank(h) < 9).sort((a, b) => rank(a) - rank(b)).slice(0, 5); if (!hits.length) throw new Error('kein Treffer');
    const tryHit = k => k >= hits.length ? Promise.reject(new Error('kein Versblock')) : jf(api + 'action=parse&redirects=1&prop=text&page=' + encodeURIComponent(hits[k].title)).then(p => {
      const html = ((p.parse || {}).text || {})['*'] || '', out = verse(html, sur, p.parse.title.toLowerCase().startsWith(kl)); if (!/id="ws-author"/.test(html) && !p.parse.title.toLowerCase().includes(sur)) return tryHit(k + 1); if (out.filter(Boolean).length < 2) return tryHit(k + 1);
      return { kind: 'poem', title: rec.title, creator: rec.creator, lines: out, url: 'https://' + lang + '.wikisource.org/wiki/' + encodeURIComponent(p.parse.title.replace(/ /g, '_')), rights: rec.rightsStatus, id: rec.id };
    });
    return tryHit(0);
  });
}

export function loadPoems(records, seed, max, onItem) {
  const r = rng(seed), order = records.slice().sort(() => r() - .5).slice(0, max), status = order.map(x => ({ id: x.id, title: x.title, creator: x.creator, state: 'lädt', tries: 0 }));
  const WAIT = [8000, 20000];
  const lookup = rec => { let netErr = null; const go = k => k >= WS.length ? Promise.reject(netErr || new Error('nicht gefunden')) : wsPoem(WS[k], rec).catch(e => { if (e && e.net) netErr = e; return go(k + 1); }); return go(0); };
  const tryRec = i => lookup(order[i]).then(p => { status[i].state = 'im Pool'; status[i].url = p.url; onItem(p, status); }).catch(e => {
    const st = status[i];
    if (e && e.net && st.tries < WAIT.length) { st.state = 'wartet (' + e.message + ')'; const d = WAIT[st.tries++]; onItem(null, status); setTimeout(() => { st.state = 'lädt'; tryRec(i); }, d); return; }
    st.state = String(e && e.message || e); onItem(null, status);
  });
  let k = 0; const next = () => { if (k >= order.length) return; const i = k++; tryRec(i).then(next); }; next(); next();
  return status;
}

export class PoemBand {
  constructor(canvas, fonts, seed) { this.c = canvas; this.x = canvas.getContext('2d'); this.LW = 4096; this.LH = 512; this.fonts = fonts; this.r = rng(seed); this.items = []; this.q = []; this.cur = null; this.ghosts = []; this.beatEnd = 0; this.line = null; this.n = 0; }
  add(item) { this.items.push(item); }
  pickItem() { const P = this.items.filter(i => i.kind === 'poem'), Q = this.items.filter(i => i.kind === 'quote'); const usePoem = P.length && (this.r() < .55 || !Q.length); const L = usePoem ? P : Q; return L.length ? L[Math.floor(this.r() * L.length)] : null; }
  nextLine(beat, bs, sec, u0) {
    if (!this.cur || this.li >= this.cur.lines.length) {
      if (this.cur && !this.credited) { this.credited = true; return this.start({ text: (this.cur.creator || '') + ' · ' + this.cur.title, credit: this.cur.url || this.cur.src || '', meta: true }, beat, 4, u0); }
      this.cur = this.pickItem(); this.li = 0; this.credited = false; if (!this.cur) return; this.fontKey = this.fonts.pick(this.r); this.treat = ['TYPE', 'HARD', 'SPREAD', 'SCATTER', 'TYPE'][Math.floor(this.r() * 5)];
    }
    const t = this.cur.lines[this.li++];
    if (!t) { this.line = null; this.beatEnd = beat + 2; return; }
    const words = t.split(' ').length, hold = sec === 'BREAK' ? 2 : sec === 'DROP' ? .6 : 1;
    const beats = Math.max(2, Math.min(10, Math.ceil(((words / 2.6) + .8) * hold / bs)));
    this.start({ text: t }, beat, beats + (beats % 2), u0);
  }
  start(l, beat, beats, u0) {
    if (this.line && !this.line.meta) this.ghosts.unshift({ ...this.line, born: beat }); this.ghosts = this.ghosts.slice(0, 3);
    this.line = { ...l, b0: beat, beats, u: (u0 + (this.r() - .5) * .05 + 1) % 1, treat: l.meta ? 'HARD' : this.treat, font: this.fontKey, seed: Math.floor(this.r() * 1e6) };
    this.beatEnd = beat + beats; this.n++;
  }
  // beat: Engine-Schlag, u0: Blickrichtung auf dem Band (0..1), pal: { fill, stroke }, au: Engine-Audiomerkmale oder null
  draw(beat, bs, sec, u0, pal, au) {
    if (beat >= this.beatEnd || beat < (this.line ? this.line.b0 : 0) - 1) this.nextLine(beat, bs, sec, u0);
    const x = this.x, W = this.LW, H = this.LH; x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, this.c.width, this.c.height); x.setTransform(this.c.width / W, 0, 0, this.c.height / H, 0, 0);
    const kick = au ? au.kick : 0, high = au ? au.high : 0;
    this.ghosts.forEach((g, i) => { const age = beat - g.born; const a = Math.max(0, .45 - age * .06) / (i + 1); if (a > .01) this.set(g, 1, a, (i % 2 ? 1 : -1) * (120 + age * 6), i + 1, 0, 0, pal); });
    if (this.line) { const L = this.line, p = Math.min(1, (beat - L.b0) / L.beats), out = Math.max(0, (beat - (L.b0 + L.beats - .6)) / .6); this.set(L, p, 1 - out, 0, 0, kick, high, pal); }
  }
  set(L, p, alpha, dy, depth, kick, high, pal) {
    const x = this.x, W = this.LW, H = this.LH, r = rng(L.seed), t = L.text, meta = !!L.meta;
    let size = meta ? 34 : 104 - depth * 18; x.font = meta ? '600 ' + size + 'px "IBM Plex Mono"' : this.fonts.f(L.font, size);
    let w = x.measureText(t).width; const maxW = W * .3; if (w > maxW) { size *= maxW / w; x.font = meta ? '600 ' + size + 'px "IBM Plex Mono"' : this.fonts.f(L.font, size); w = x.measureText(t).width; }
    const cx = (1 - L.u) * W, cy = H / 2 + dy, track = L.treat === 'SPREAD' ? p * size * .35 : 0, chars = [...t];
    const show = L.treat === 'TYPE' ? Math.ceil(chars.length * Math.min(1, p * 3)) : chars.length;
    const widths = chars.map(c => x.measureText(c).width), total = widths.reduce((a, b) => a + b, 0) + track * (chars.length - 1);
    const z = 1 + .06 * kick; x.save(); x.globalAlpha = alpha; x.textBaseline = 'middle'; x.lineJoin = 'round';
    for (const off of [0, -W, W]) {
      let px = cx + off - total * z / 2; if (px > W || px + total * z < 0) continue;
      for (let i = 0; i < show; i++) {
        const c = chars[i]; let ox = 0, oy = 0, rot = 0;
        if (L.treat === 'SCATTER') { const k = Math.max(0, 1 - p * 2.5); ox = (r() - .5) * 600 * k; oy = (r() - .5) * 300 * k; rot = (r() - .5) * 2 * k; } else { r(); r(); r(); }
        if (high > .2 && !meta) { oy += Math.sin(i * 1.7 + p * 40) * high * 10; }
        x.save(); x.translate(px + widths[i] * z / 2 + ox, cy + oy); x.rotate(rot); x.scale(z, z);
        if (!meta) { x.lineWidth = size * .14; x.strokeStyle = pal.stroke; x.strokeText(c, -widths[i] / 2, 0); }
        x.fillStyle = meta ? pal.meta : pal.fill; x.fillText(c, -widths[i] / 2, 0); x.restore();
        px += (widths[i] + track) * z;
      }
      if (meta && L.credit) { x.font = '400 22px "IBM Plex Mono"'; x.fillStyle = pal.meta; x.textAlign = 'center'; x.fillText(L.credit, cx + off, cy + 44); x.textAlign = 'start'; }
    }
    x.restore();
  }
}
