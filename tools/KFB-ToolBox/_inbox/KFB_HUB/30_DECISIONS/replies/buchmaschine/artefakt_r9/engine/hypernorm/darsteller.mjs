// kfb-hypernorm · K3 Darsteller (WSV 06.11.2026): Kartenwelt A und Seite P als Einstellungsarten der Engine. M5: Hochformat (Bühne 1080×1920, Ausschnitte als Kästen).
// Aus H16 alpha 0.4 (M12/M13, Look-Referenz Zeilen 1–4 R4) übertragen. Sie zeichnen innerhalb von drawShot (Patch P11),
// also mit den Übergängen und dem Korn der Engine. Material nur aus kfb.hn-media/1: kind figure | card | page (+ zones, cutBottom).
//
// Eine Absicht { t0, t1, show: { deck, card, mode: 'A'|'P', name: {s, at, mark}, power: {s, at, mark}, lore: {at, words: [{w, s}]}, payoffAt, vonKarte?, layout? } }
// ergibt eine Einstellung über das ganze Kartenfenster. Der Darsteller rechnet mit der Songzeit (sh.darsteller.zeit), nicht mit Bildnummern.
const PAPER = '#ece1c4', INK = '#2a2119', MARK = 'rgba(242,223,60,.85)';
const ease = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
const settle = dt => dt < 0 ? 1 : dt < .08 ? 1.03 : dt < .16 ? 1.01 : 1;   // Setzen auf Zweiern (2 Bilder bei 25 fps), kein Federn
const LAYOUT = {   // in Punkten einer 1920×1080-Bühne
  R: { fig: { cx: 1380, cy: 600, h: 800, w: 1150 }, x: 140, align: 'left', maxW: 780, name: { top: 200, size: 250 }, power: { top: 230, size: 165 }, lore: { top: 170, size: 80, maxW: 680 } },
  L: { fig: { cx: 540, cy: 600, h: 800, w: 1150 }, x: 1780, align: 'right', maxW: 780, name: { top: 200, size: 250 }, power: { top: 230, size: 165 }, lore: { top: 170, size: 80, maxW: 680 } },
  W: { fig: { cx: 960, bottom: 1045, h: 610, w: 1720 }, x: 140, align: 'left', maxW: 1640, name: { top: 70, size: 185 }, power: { top: 90, size: 150 }, lore: { top: 90, size: 72 } },
  // M5 Hochformat: Bühne 1080×1920. Typo oben über die ganze Breite, Figur unten (bei cutBottom an der Unterkante)
  H: { fig: { cx: 540, bottom: 1860, h: 1000, w: 1000 }, x: 90, align: 'left', maxW: 900, name: { top: 160, size: 270 }, power: { top: 180, size: 190 }, lore: { top: 160, size: 86, maxW: 900 } }
};
// Bühne je Format: quer 1920×1080 (16:9, 2:1, 1:1), hoch 1080×1920 (9:16 und alles schmaler als 1:1)
const STAGE = (W, H) => W / H < .9 ? { W0: 1080, H0: 1920, hoch: true } : { W0: 1920, H0: 1080, hoch: false };
const split2 = s => { const w = s.split(' '); if (w.length < 2) return [s]; let best = null;
  for (let k = 1; k < w.length; k++) { const a = w.slice(0, k).join(' '), b = w.slice(k).join(' '), m = Math.max(a.length, b.length); if (!best || m < best.m) best = { m, l: [a, b] }; } return best.l; };
const fitSize = (x, font, lines, size, maxW, ls) => { let s = size; for (const l of lines) { x.font = font(s); x.letterSpacing = ls(s) + 'px'; const w = x.measureText(l).width; if (w > maxW) s = s * maxW / w; } return Math.floor(s); };

export function installDarsteller(E, material) {
  const { o, M } = E, by = {};
  for (const p of material.items) { if (!['figure', 'card', 'page'].includes(p.kind)) continue; const im = material.imgs[p.id]; if (!im) continue;
    const k = p.kind === 'page' ? 'page:' + p.deck + ':' + p.page : p.kind + ':' + p.deck + ':' + p.card; by[k] = { im, meta: p }; }
  const bakes = new Map(), MX = .12;
  const pageBake = (deck, page) => { const k = deck + ':' + page; if (bakes.has(k)) return bakes.get(k); const P = by['page:' + k]; if (!P) return null;
    const im = P.im, mx = Math.round(im.width * MX), b = document.createElement('canvas'); b.width = im.width + 2 * mx; b.height = im.height + 2 * mx;
    const x = b.getContext('2d', { willReadFrequently: true }); x.fillStyle = PAPER; x.fillRect(0, 0, b.width, b.height);
    x.shadowColor = 'rgba(40,28,14,.45)'; x.shadowBlur = Math.round(im.width / 160); x.shadowOffsetY = Math.round(im.width / 440); x.imageSmoothingQuality = 'high'; x.drawImage(im, mx, mx);
    const v = { bake: b, w: im.width, h: im.height, mx }; bakes.set(k, v); return v; };
  // Bühne (quer 1920×1080 oder hoch 1080×1920) gleichmäßig in die Engine-Fläche einpassen (Rest Papier)
  const buehne = (ctx, W, H) => { const { W0, H0 } = STAGE(W, H), s = Math.min(W / W0, H / H0); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
    const ox = (W - W0 * s) / 2, oy = (H - H0 * s) / 2; return { s, ox, oy, set: (m = [1, 0, 0, 1, 0, 0]) => ctx.setTransform(s * m[0], s * m[1], s * m[2], s * m[3], ox + s * m[4], oy + s * m[5]) }; };
  const zeitVon = (sh, t, bs) => sh.darsteller.zeit(sh.b0 + t / bs);

  function A(ctx, sh, t, { W, H, bs }) {
    const D = sh.darsteller, T = zeitVon(sh, t, bs), fig = by['figure:' + D.deck + ':' + D.card], card = by['card:' + D.deck + ':' + D.card];
    const B = buehne(ctx, W, H); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowColor = 'transparent'; ctx.letterSpacing = '0px';
    if (!fig || !card) return;
    const { W0, H0, hoch } = STAGE(W, H);
    if (D.payoffAt != null && T >= D.payoffAt) {   // Pointe: ganze Karte, farbig, unbeschnitten
      const ca = card.im.width / card.im.height, z = settle(T - D.payoffAt), ch = Math.min(H0 * .86, W0 * .86 / ca) * z, cw = ch * ca;
      B.set(); ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 40 * B.s; ctx.shadowOffsetY = 14 * B.s; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(card.im, (W0 - cw) / 2, (H0 - ch) / 2, cw, ch); ctx.restore(); return;
    }
    const fa = fig.im.width / fig.im.height, lay = hoch ? (D.layoutHoch || 'H') : D.layout || (fa > 1.7 ? 'W' : D.card % 2 ? 'R' : 'L'), L = LAYOUT[lay];
    let fh = L.fig.h, fw = fh * fa; if (fw > L.fig.w) { fw = L.fig.w; fh = fw / fa; }
    const fcx = L.fig.cx, fcy = fig.meta.cutBottom ? H0 + 12 - fh / 2 : L.fig.bottom ? L.fig.bottom - fh / 2 : L.fig.cy;
    const end = D.payoffAt != null ? D.payoffAt : D.win.t1, u = ease(Math.max(0, Math.min(1, (T - D.win.t0) / Math.max(.1, end - D.win.t0)))), s = 1 + .10 * u, dx = (lay === 'L' ? -1 : 1) * (30 - 80 * u), fx = fcx, fy = fcy - fh * .2;
    const cam = (d, ax = fx, ay = fy) => { const k = 1 + (s - 1) * d; B.set([k, 0, 0, k, dx * d + ax - k * ax, ay - k * ay]); };
    cam(.3); const r = M.mulberry(M.hash(D.card, 3121));   // Papier mit Lavierungen (fest je Karte)
    for (let k = 0; k < 3; k++) { const px = W0 * (.15 + .7 * r()), py = H0 * (.2 + .7 * r()), rr = H0 * (.35 + .25 * r()), g = ctx.createRadialGradient(px, py, 0, px, py, rr);
      g.addColorStop(0, 'rgba(150,105,55,.2)'); g.addColorStop(1, 'rgba(150,105,55,0)'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W0 + 400, H0 + 400); }
    cam(.6, L.x, 300); ctx.fillStyle = INK; ctx.textBaseline = 'alphabetic'; ctx.textAlign = L.align;   // Typo wächst von ihrem Anker aus
    const block = (lines, font, ls, P, lh, markAt, atCut) => {
      const size = fitSize(ctx, font, lines, P.size, L.maxW, ls), z = settle(T - atCut), ax = L.x, ay = P.top;
      ctx.save(); ctx.translate(ax, ay); ctx.scale(z, z); ctx.translate(-ax, -ay);
      lines.forEach((l, i) => { ctx.font = font(size); ctx.letterSpacing = ls(size) + 'px'; const y = P.top + size * (.8 + i * lh), lw = ctx.measureText(l).width;
        if (i === lines.length - 1 && markAt != null) { const p = Math.max(0, Math.min(1, (T - markAt) / .16)); if (p > 0) { const x0 = L.align === 'left' ? ax - 15 : ax - lw - 15, mw = (lw + 30) * (1 - Math.pow(1 - p, 2));
          ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = MARK; ctx.translate(x0, y - size * .5); ctx.rotate(-.025); ctx.transform(1, 0, -.14, 1, 0, 0); ctx.fillRect(0, 0, mw, size * .52); ctx.restore(); ctx.fillStyle = INK; } }
        ctx.fillText(l, ax, y); });
      ctx.restore(); };
    const grot = sz => `900 condensed ${sz}px Archivo`, elite = sz => `${sz}px "Special Elite"`;
    const loreAb = D.lore ? Math.max(D.lore.at, D.lore.words && D.lore.words.length ? D.lore.words[0].s : 0) : Infinity;
    if (D.name && (!D.power || T < D.power.at)) block(split2(D.name.s), grot, sz => -sz * .016, L.name, .88, D.name.mark, D.name.at);
    else if (D.power && T < loreAb) block(split2(D.power.s), elite, () => 0, L.power, 1.05, D.power.mark, D.power.at);
    else if (D.lore) {   // Lore Wort für Wort, Umbruch nach Breite
      const P = L.lore; ctx.font = elite(P.size); ctx.letterSpacing = '0px'; const lines = [[]]; let lw = 0; const sp = ctx.measureText(' ').width;
      D.lore.words.forEach(w => { const ww = ctx.measureText(w.w).width; if (lw + ww > (P.maxW || L.maxW) && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(w); lw += ww + sp; });
      lines.forEach((ln, i) => { const txt = ln.filter(w => T >= w.s - 1e-6).map(w => w.w).join(' '), full = ln.map(w => w.w).join(' '); if (!txt) return; const y = P.top + P.size * (.8 + i * 1.18);
        if (L.align === 'left') ctx.fillText(txt, L.x, y); else { ctx.textAlign = 'left'; ctx.fillText(txt, L.x - ctx.measureText(full).width, y); ctx.textAlign = L.align; } });
    }
    cam(1); ctx.shadowColor = 'rgba(60,40,20,.25)'; ctx.shadowBlur = 14 * B.s; ctx.shadowOffsetY = 6 * B.s; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(fig.im, fcx - fw / 2, fcy - fh / 2, fw, fh); ctx.shadowColor = 'transparent'; ctx.letterSpacing = '0px'; ctx.textAlign = 'left';
  }

  // Seite P: Kamera-Schlüssel je Einstellung (einmal berechnet), Fahrten 2 Beats, Bogen bei weiten Wegen
  function keysP(D, bs) {
    if (D._keys) return D._keys; const card = by['card:' + D.deck + ':' + D.card], P = by['page:' + D.deck + ':' + (card && card.meta.page)]; if (!card || !P) return null;
    const pw = P.im.width, ph = P.im.height, cell = n => { const c = by['card:' + D.deck + ':' + n], q = c ? c.meta.quadrant : 0; return { x: (q % 2) * pw / 2, y: Math.floor(q / 2) * ph / 2, w: pw / 2, h: ph / 2 }; };
    // Ausschnitte als Kästen (w, h); welche Seite bestimmt, entscheidet erst das Format der Fläche (M5)
    const frameCard = n => { const c = cell(n); return { cx: c.x + c.w / 2, cy: c.y + c.h / 2, h: c.h / .86, w: c.w / .86 }; };
    const frameZone = z => { const Z = card.meta.zones && card.meta.zones[z]; if (!Z) return frameCard(D.card); const c = cell(D.card), zx = Z[0] * pw, zy = Z[1] * ph, zw = Z[2] * pw, zh = Z[3] * ph;
      return { cx: zx + zw / 2, cy: zy + zh / 2, h: Math.max(zh * 1.3, c.h * .62), w: zw * 1.3 }; };   // nie enger als 62 % der Karte
    const start = D.vonKarte ? frameCard(D.vonKarte) : { cx: pw / 2, cy: ph / 2, h: ph * 1.08, w: pw * 1.08 };
    const K = [{ ta: D.win.t0, f: start }]; if (D.name) K.push({ ta: D.name.at, f: frameCard(D.card) });
    if (D.power) K.push({ ta: D.power.at, f: frameZone('power') });
    if (D.lore) K.push({ ta: D.lore.words && D.lore.words.length ? D.lore.words[0].s : D.lore.at, f: frameZone('lore') });
    if (D.payoffAt != null) K.push({ ta: D.payoffAt, f: frameCard(D.card) });
    return (D._keys = { K, page: card.meta.page, pw, beat: bs });
  }
  function P(ctx, sh, t, { W, H, bs }) {
    const D = sh.darsteller, T = zeitVon(sh, t, bs), KK = keysP(D, bs); buehne(ctx, W, H); if (!KK) return;
    const PB = pageBake(D.deck, KK.page); if (!PB) return; const beat = D.beat || bs, va = W / H;
    const K = KK.K.map(k => ({ ta: k.ta, f: { cx: k.f.cx, cy: k.f.cy, h: Math.max(k.f.h, k.f.w / va) } }));   // Kasten passt ganz hinein, in Höhe und Breite
    let i = 0; while (i < K.length - 1 && T >= K[i + 1].ta) i++;
    const hold = (k, tt, tn) => { const u = Math.max(0, Math.min(1, (tt - k.ta) / Math.max(.2, tn - k.ta))); return { cx: k.f.cx, cy: k.f.cy, h: k.f.h * (1 - .03 * ease(u)) }; };
    let c; const nx = K[i + 1];
    if (nx) { const d = Math.min(2 * beat, (nx.ta - K[i].ta) * .8), s0 = nx.ta - d;
      if (T >= s0) { const a = hold(K[i], s0, s0), b = nx.f, u = ease((T - s0) / d), dist = Math.hypot(b.cx - a.cx, b.cy - a.cy) / KK.pw, arc = dist > .2 ? 1 + .22 * Math.sin(Math.PI * u) : 1;
        c = { cx: a.cx + (b.cx - a.cx) * u, cy: a.cy + (b.cy - a.cy) * u, h: Math.exp(Math.log(a.h) + (Math.log(b.h) - Math.log(a.h)) * u) * arc }; }
      else c = hold(K[i], T, s0); }
    else c = hold(K[i], T, D.win.t1);
    const vh = c.h, vw = vh * va;   // Ausschnitt im Format der Fläche
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(PB.bake, PB.mx + c.cx - vw / 2, PB.mx + c.cy - vh / 2, vw, vh, 0, 0, W, H);
  }
  o._darsteller = { A, P };
  return { A, P, fehlt: n => !by['figure:help_i_am_a_human:' + n] };
}
