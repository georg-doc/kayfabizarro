// Sprechblasen-Modul · Host-Vertrag R1.2 · V-204 / V-212 / V-215.
// Eine DOM-Schicht (#ui-bubbles) über dem Canvas, Anker = projizierter Kopf pro Frame, kein React-State.
// Form 1:1 wie replies/lab-donors/islands-npc.ts Z. 89–98: roundRectPath + Fläche mix('#fbf2df', Farbe, .2) + clayFront,
// keine Tusche, keine Randwände, ein Zipfel, ein drop-shadow. Reveal 300 ms, Stagger 520 ms, cubic-bezier(.2,.9,.3,1.12) – hier über dt (seek-fähig).
import * as THREE from 'three';

const INK = '#1f1a14', M = 34, STAGGER = 520, FLIP = 300;
const mix = (a, b, t) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v * (1 - t) + B[i] * t).toString(16).padStart(2, '0')).join(''); };
function bez(p1x, p1y, p2x, p2y) { const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx, cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by; const X = t => ((ax * t + bx) * t + cx) * t, Y = t => ((ay * t + by) * t + cy) * t, dX = t => (3 * ax * t + 2 * bx) * t + cx; return v => { let t = v; for (let i = 0; i < 10; i++) { const d = dX(t); if (Math.abs(d) < 1e-6) break; t -= (X(t) - v) / d; } return Y(Math.max(0, Math.min(1, t))); }; }
const EASE = bez(.2, .9, .3, 1.12), esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function create(o) {
  const host = o.host, C = window.KFB_CB; if (!C) throw new Error('chatterbox-core fehlt (window.KFB_CB)');
  const layer = document.createElement('div'); layer.id = 'ui-bubbles'; layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:5'; host.appendChild(layer);
  const bubbles = [], v = new THREE.Vector3();
  function layout(parts, basePx) {
    const Ls = parts.map(t => C.layout(t, 'speech', { basePx, maxPx: o.maxPx ?? 420 })), L0 = Ls[0], fs = L0.fontPx, lh = L0.lh, gap = Math.round(fs * 0.5), lines = [];
    Ls.forEach((l, pi) => l.lines.forEach((toks, li) => lines.push({ part: pi, mt: pi > 0 && li === 0 ? gap : 0, text: toks.map(t => t.text).join('') })));
    const w = Math.round(Math.max(...Ls.map(l => l.w - 2 * l.padX)) + 2 * L0.padX), h = Math.round(lines.length * fs * lh + gap * (Ls.length - 1) + 2 * L0.padY);
    return { w, h, fs, lh, padX: L0.padX, padY: L0.padY, lines };
  }
  function svgFor(b, hlx, hly) {
    const d = C.roundRectPath(M, b.L.w, b.L.h, Math.min(14, Math.round(b.L.h * 0.3)), b.seed, hlx, hly, 16, 12), face = mix('#fbf2df', b.col, 0.2);
    return [{ d, fill: face }, ...C.clayFront(d)].map(l => `<path d="${l.d}" fill="${l.fill ?? 'none'}"${l.stroke ? ` stroke="${l.stroke}" stroke-width="${l.sw}" stroke-linejoin="round" stroke-linecap="round"` : ''}${l.tf ? ` transform="${l.tf}"` : ''}${l.op != null ? ` opacity="${l.op}"` : ''}${l.filter ? ` filter="${l.filter}"` : ''}${l.mask ? ` mask="${l.mask}"` : ''}/>`).join('');
  }
  function say(actor, parts, col) {
    clear(actor.id);
    const basePx = host.clientWidth >= 900 ? 16 : host.clientWidth >= 520 ? 15 : 14, L = layout(parts, basePx), el = document.createElement('div');
    el.dataset.speaker = actor.id; el.dataset.text = parts.join(' / ');
    el.style.cssText = `position:absolute;left:0;top:0;width:${L.w + 2 * M}px;height:${L.h + 2 * M}px;filter:drop-shadow(0 3px 5px rgba(42,26,12,.28));will-change:transform`;
    el.innerHTML = `<svg width="${L.w + 2 * M}" height="${L.h + 2 * M}" style="position:absolute;left:0;top:0;overflow:visible"></svg><div style="position:absolute;left:${M}px;top:${M}px;width:${L.w}px;height:${L.h}px;padding:${L.padY}px ${L.padX}px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:'Shantell Sans','Comic Sans MS',cursive;font-size:${L.fs}px;line-height:${L.lh};color:${INK}">${L.lines.map(l => `<div data-part="${l.part}" style="white-space:pre;text-align:center;margin-top:${l.mt}px;transform-origin:50% 0;opacity:0">${esc(l.text)}</div>`).join('')}</div>`;
    layer.appendChild(el);
    const b = { el, actor, L, col, seed: C.hash(parts.join(' / ') + 'speech') % 9999, t: 0, hl: null, svg: el.querySelector('svg'), rows: [...el.querySelectorAll('[data-part]')] };
    bubbles.push(b); return b;
  }
  function clear(id) { for (let i = bubbles.length - 1; i >= 0; i--) if (!id || bubbles[i].actor.id === id) { bubbles[i].el.remove(); bubbles.splice(i, 1); } }
  function place(b, cam, W, H, pads, avoid) {
    v.copy(b.actor.headWorld()).project(cam); const hx = (v.x + 1) / 2 * W, hy = (1 - v.y) / 2 * H, w = b.L.w, h = b.L.h;
    const cx = x => Math.max(pads.l, Math.min(W - pads.r - w, x)), cy = y => Math.max(pads.t, Math.min(H - pads.b - h, y));
    let bx, by; const up = hy - 16 - h;
    if (up >= pads.t) { bx = cx(hx - w / 2); by = up; }
    else { const side = 22, ys = cy(hy - h * 0.2); if (hx + side + w <= W - pads.r) { bx = hx + side; by = ys; } else if (hx - side - w >= pads.l) { bx = hx - side - w; by = ys; } else { bx = cx(hx - w / 2); by = pads.t; } }
    for (const f of avoid) if (bx < f.x + f.w && bx + w > f.x && by < f.y + f.h && by + h > f.y) { const ny = f.y - 12 - h; if (ny >= pads.t) by = ny; else { const sx = hx < W / 2 ? f.x + f.w + 12 : f.x - 12 - w; if (sx >= pads.l && sx + w <= W - pads.r) bx = sx; } }
    const hlx = Math.max(4, Math.min(W - 4, hx)) - (bx - M), hly = Math.max(4, Math.min(H - 4, hy)) - (by - M);
    if (!b.hl || Math.abs(b.hl[0] - hlx) > 2 || Math.abs(b.hl[1] - hly) > 2) { b.hl = [hlx, hly]; b.svg.innerHTML = svgFor(b, hlx, hly); }
    b.el.style.transform = `translate(${Math.round(bx - M)}px,${Math.round(by - M)}px)`; b.rect = { x: bx, y: by, w, h };
  }
  return {
    object3d: new THREE.Group(), layer, say, clear,
    get list() { return bubbles; },
    update(dt, ctx) {
      const W = host.clientWidth, H = host.clientHeight, pads = ctx.pads || { l: 12, r: 12, t: 12, b: 12 };
      for (const b of bubbles) {
        b.t += dt * 1000; place(b, ctx.camera, W, H, pads, ctx.avoid || []);
        for (const r of b.rows) { const p = Math.max(0, Math.min(1, (b.t - Number(r.dataset.part) * STAGGER) / FLIP)), e = p <= 0 ? 0 : EASE(p); r.style.opacity = Math.max(0, Math.min(1, e)).toFixed(3); r.style.transform = `perspective(520px) rotateX(${(-86 * (1 - e)).toFixed(1)}deg)`; }
      }
    },
    dispose() { clear(); layer.remove(); }
  };
}

