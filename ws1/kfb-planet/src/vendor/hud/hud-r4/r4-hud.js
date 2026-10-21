/* KFB HUD R4 · handgemachtes Diorama-HUD (Look-Bauteile + Bild-Komposition für Tafel und Sandbox).
 * DESIGN ONLY (V-228): DOM-Bauteile zum Anschauen, Maße und Farben für WS1. Kein Spielcode.
 * Variante A = reine Knete. Variante B = Knete + Holz (Plaketten) + Pappe (Overlays) + Kreppband.
 * Größen: 'desk' = 1920 × 1080 (1080p-Pixel), 'phone' = 390 × 693 CSS-px (9:16, 1 px = 3 Gerätepixel).
 */
import { CALLS, OWN_TEXT, CONTEXT_ACTIONS, FIRST_USE } from './r4-calls-data.js';
import { fmtDist, fmtHeight } from './r4-theme.js';

export const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Bangers&family=Nunito:wght@700;800;900&family=Shantell+Sans:wght@500;700&family=VT323&display=swap';
export const FD = "'Bangers','Nunito',system-ui,sans-serif", FT = "'Nunito',system-ui,sans-serif", FB = "'Shantell Sans','Comic Sans MS',cursive", FP = "'VT323',ui-monospace,monospace";

export const SIZES = {
  desk: { W: 1920, H: 1080, pad: 28, gap: 12, ph: 64, big: 30, num: 32, lab: 13, mini: 224, fanW: 132, peek: 18, callK: 88, R: 236, puck: 84, puckS: 62, tacho: 136, bag: 80, bub: 30, knob: 48 },
  phone: { W: 390, H: 693, pad: 10, gap: 6, ph: 40, big: 18, num: 19, lab: 11, mini: 86, fanW: 52, peek: 5, callK: 56, R: 150, puck: 54, puckS: 44, tacho: 76, bag: 44, bub: 16, knob: 36 }
};

/* ---------- Texturen (einmal als PNG gerechnet; SVG-feTurbulence in vielen Hintergründen ist zu teuer) ---------- */
const svgUrl = (s) => 'url("data:image/svg+xml;utf8,' + encodeURIComponent(s) + '")';
function noisePng(w, hh, fn) {
  if (typeof document === 'undefined') return 'none';
  const c = document.createElement('canvas'); c.width = w; c.height = hh; const g = c.getContext('2d'), d = g.createImageData(w, hh);
  let s = 99991; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const v = fn(x, y, r) | 0, i = (y * w + x) * 4; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  g.putImageData(d, 0, 0);
  const b64 = c.toDataURL('image/png').split(',')[1], bin = atob(b64), u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return 'url("' + URL.createObjectURL(new Blob([u8], { type: 'image/png' })) + '")';
}
/* Knet-Korn: weißes Rauschen + leichte Klumpen (zwei Oktaven) */
export const GRAIN = noisePng(140, 140, (x, y, r) => { const a = Math.sin(x * 0.21 + Math.sin(y * 0.17) * 2) * Math.cos(y * 0.23 + x * 0.05) * 18; return 128 + a + (r() - 0.5) * 70; });
/* Holzmaserung: lange Streifen quer, leicht gewellt */
const WOODG = noisePng(300, 120, (x, y, r) => { const w = Math.sin((y + Math.sin(x * 0.02) * 6 + Math.sin(x * 0.007 + y * 0.1) * 3) * 0.55) * 0.5 + Math.sin(y * 1.7 + x * 0.01) * 0.25; return 150 + w * 70 + (r() - 0.5) * 30; });
const BOARDG = noisePng(160, 160, (x, y, r) => 128 + (r() - 0.5) * 90);
const THUMB = svgUrl("<svg xmlns='http://www.w3.org/2000/svg' width='260' height='180'><g fill='none' stroke='white' stroke-opacity='.55' stroke-width='1.3'>" +
  Array.from({ length: 9 }, (_, i) => `<ellipse cx='70' cy='60' rx='${6 + i * 4}' ry='${8 + i * 5}' transform='rotate(-24 70 60)'/>`).join('') +
  Array.from({ length: 7 }, (_, i) => `<ellipse cx='200' cy='130' rx='${5 + i * 4}' ry='${7 + i * 5}' transform='rotate(31 200 130)'/>`).join('') + '</g></svg>');


/* ---------- Helfer ---------- */
export function h(tag, css, kids) {
  const e = document.createElement(tag);
  if (css) e.style.cssText = css;
  if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach((k) => { if (k == null) return; e.append(typeof k === 'string' ? document.createTextNode(k) : k); });
  return e;
}
const html = (s, css = '') => { const d = h('div', css); d.innerHTML = s; return d; };
const rnd = (seed) => () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
/* unregelmäßige Radien (Knete: 8 Werte, je Teil fest), Holz: fast gerade, leicht schief geschnitten */
export function rad(seed, base, j = 3) { const r = rnd(seed * 97 + 13); const v = () => Math.max(2, Math.round(base - j + r() * j * 2)); return `${v()}px ${v()}px ${v()}px ${v()}px / ${v()}px ${v()}px ${v()}px ${v()}px`; }
export const BLOB = '50% 47% 52% 49% / 49% 52% 48% 51%';

/* ---------- Oberflächen (eine Familie) ---------- */
export const clayCss = (T, r, c = {}) => {
  const hi = c.hi || T.plaqueHi, mid = c.mid || T.plaque, lo = c.lo || T.plaqueLo, so = c.socket || T.socket;
  return `background:${GRAIN},${THUMB},linear-gradient(180deg,${hi} 0%,${mid} 58%,${lo} 100%);background-size:140px 140px,260px 180px,100% 100%;background-blend-mode:soft-light,soft-light,normal;border-radius:${r};box-shadow:inset 0 2px 2px rgba(255,255,255,.38),inset 0 -3px 6px rgba(30,20,10,.14),0 ${c.lift ?? 4}px 0 ${so},0 ${(c.lift ?? 4) + 6}px 16px rgba(24,16,8,.24);box-sizing:border-box`;
};
export const woodCss = (T, r) => `background:${WOODG},${GRAIN},linear-gradient(180deg,${T.woodHi} 0%,${T.wood} 55%,${T.woodLo} 100%);background-size:300px 120px,140px 140px,100% 100%;background-blend-mode:soft-light,soft-light,normal;border-radius:${r};box-shadow:inset 0 1px 0 rgba(255,255,255,.35),inset 0 -2px 0 rgba(0,0,0,.12),0 3px 0 ${T.woodSocket},0 9px 14px rgba(24,16,8,.28);box-sizing:border-box`;
export const boardCss = (T, r) => `background:repeating-linear-gradient(90deg,rgba(80,50,20,.05) 0 2px,transparent 2px 8px),${BOARDG},linear-gradient(180deg,${T.boardHi},${T.board} 50%,${T.boardLo});background-size:auto,160px 160px,100% 100%;background-blend-mode:normal,soft-light,normal;border-radius:${r};box-shadow:inset 0 0 0 1px rgba(90,60,30,.18),0 8px 18px rgba(24,16,8,.3);box-sizing:border-box`;
export const wellCss = (T, r) => `background:${GRAIN},linear-gradient(180deg,${T.wellTop},${T.wellBot});background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;border-radius:${r};box-shadow:inset 0 3px 7px rgba(10,6,4,.62),inset 0 -1px 0 rgba(255,255,255,.12);box-sizing:border-box`;
export const plaqueCss = (T, r, seed = 1) => (T.variant === 'B' ? woodCss(T, rad(seed, 7, 2)) : clayCss(T, r));
export const panelCss = (T, r) => (T.variant === 'B' ? boardCss(T, '5px 7px 4px 6px') : clayCss(T, r, { lift: 6 }));
const accentTones = (T, tone, color) => tone === 'pad' ? { hi: T.targetHi, mid: T.target, lo: T.targetLo, socket: T.targetLo, ink: T.targetInk }
  : tone === 'cream' ? { hi: '#FFFDF6', mid: T.cream, lo: T.plaqueHi, socket: T.socket, ink: T.ink }
  : tone === 'arrive' ? { hi: T.arrive, mid: T.arrive, lo: T.arriveLo, socket: T.arriveLo, ink: '#1F2A12' }
  : tone === 'call' ? { hi: color, mid: color, lo: color, socket: 'rgba(0,0,0,.35)', ink: '#FFF8EC' }
  : { hi: T.accentHi, mid: T.accent, lo: T.accentLo, socket: T.accentSocket, ink: T.accentInk };
/* Kreppband (nur B) */
export const tape = (T, css) => h('div', `position:absolute;background:${GRAIN},${T.tape};background-size:140px 140px,auto;background-blend-mode:soft-light,normal;opacity:.93;clip-path:polygon(0 8%,4% 0,9% 10%,14% 1%,100% 0,97% 12%,100% 30%,96% 50%,100% 72%,97% 90%,100% 100%,6% 100%,0 88%,3% 70%,0 50%,4% 30%);box-shadow:0 1px 2px rgba(0,0,0,.12);${css}`);

/* ---------- Icons (24er Raster, currentColor) ---------- */
export const ICONS = {
  star: '<path d="M12 2.8l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.6l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  drum: '<ellipse cx="9" cy="8" rx="6" ry="2.6" fill="currentColor"/><path d="M3 8v7.5c0 1.5 2.7 2.7 6 2.7s6-1.2 6-2.7V8" fill="none" stroke="currentColor" stroke-width="2.2"/><ellipse cx="18" cy="11.2" rx="3.6" ry="1.8" fill="currentColor"/><path d="M14.4 11.2v5.4c0 1 1.6 1.8 3.6 1.8s3.6-.8 3.6-1.8v-5.4" fill="none" stroke="currentColor" stroke-width="2"/>',
  eyes: '<circle cx="7.4" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2.3"/><circle cx="16.6" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2.3"/><circle cx="8.6" cy="13.1" r="2.3" fill="currentColor"/><circle cx="15.4" cy="10.7" r="2.3" fill="currentColor"/>',
  bang: '<rect x="9.5" y="2.6" width="5" height="12.4" rx="2.5" fill="currentColor"/><circle cx="12" cy="19.4" r="2.7" fill="currentColor"/>',
  pencil: '<path d="M6 18.2l.9-4.2 9.3-9.3a2.1 2.1 0 013 0l.3.3a2.1 2.1 0 010 3l-9.3 9.3z" fill="currentColor"/><path d="M4.3 19.7l1.2-3.9 2.7 2.7z" fill="currentColor"/>',
  grab: '<path d="M12 2.8v8.4M8.4 7.8L12 11.4l3.6-3.6" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="4" y="14" width="16" height="7" rx="2.4" fill="currentColor"/>',
  ask: '<rect x="4" y="15" width="16" height="6" rx="2.2" fill="currentColor"/><path d="M9.1 5.6a2.9 2.9 0 115.4 1.6c-.8 1-2.5 1.4-2.5 3" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="12" cy="13" r="1.3" fill="currentColor"/>',
  walk: '<ellipse cx="8" cy="8.6" rx="2.8" ry="4.2" transform="rotate(-12 8 8.6)" fill="currentColor"/><ellipse cx="7.3" cy="15.4" rx="1.9" ry="1.7" fill="currentColor"/><ellipse cx="16" cy="10.6" rx="2.8" ry="4.2" transform="rotate(12 16 10.6)" fill="currentColor"/><ellipse cx="16.8" cy="17.4" rx="1.9" ry="1.7" fill="currentColor"/>',
  drive: '<circle cx="12" cy="12" r="7.8" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="12" cy="12" r="2.4" fill="currentColor"/><path d="M12 4.6v5M5.6 15.7l4.3-2.4M18.4 15.7l-4.3-2.4" stroke="currentColor" stroke-width="2.2"/>',
  fly: '<path d="M3 11.6L21 4l-5.5 16-3.7-6.2z" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="4.2" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="9" cy="9" r="1.7" fill="currentColor"/><circle cx="15" cy="15" r="1.7" fill="currentColor"/><circle cx="15" cy="9" r="1.7" fill="currentColor"/><circle cx="9" cy="15" r="1.7" fill="currentColor"/>',
  crown: '<path d="M4 16.6L3 7.8l5 4 4-6 4 6 5-4-1 8.8z" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><rect x="4" y="18.2" width="16" height="2.8" rx="1.4" fill="currentColor"/>',
  pin: '<circle cx="12" cy="8.2" r="5.4" fill="currentColor"/><rect x="10.9" y="11" width="2.2" height="10.4" rx="1.1" fill="currentColor"/>',
  cards: '<rect x="2.6" y="8" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2.1"/><rect x="7.4" y="4.2" width="14" height="10" rx="2" fill="currentColor"/>',
  discard: '<rect x="4" y="13.6" width="16" height="7" rx="2" fill="currentColor"/><rect x="5" y="4.6" width="13" height="7" rx="2" transform="rotate(-9 11 8)" fill="none" stroke="currentColor" stroke-width="2.1"/>',
  bag: '<path d="M5.6 10a6.4 6.4 0 0112.8 0v9a2.4 2.4 0 01-2.4 2.4H8a2.4 2.4 0 01-2.4-2.4z" fill="currentColor"/><path d="M9 8.6V6.4a3 3 0 016 0v2.2" fill="none" stroke="currentColor" stroke-width="2.1"/><rect x="8.6" y="13.4" width="6.8" height="4" rx="1.3" fill="rgba(0,0,0,.28)"/>',
  speech: '<path d="M3.6 6.6a3.1 3.1 0 013.1-3.1h10.6a3.1 3.1 0 013.1 3.1v6.8a3.1 3.1 0 01-3.1 3.1h-5.8l-4.6 4.1v-4.1H6.7a3.1 3.1 0 01-3.1-3.1z" fill="currentColor"/>',
  check: '<path d="M4.8 12.6l4.6 4.6L19.4 7" stroke="currentColor" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>',
  note: '<path d="M9 5l10-2v12.6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 5v13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="6.4" cy="18.4" rx="3.3" ry="2.6" fill="currentColor"/><ellipse cx="16.4" cy="16" rx="3.3" ry="2.6" fill="currentColor"/>',
  play: '<path d="M7.4 4.6L19 12 7.4 19.4z" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
  prev: '<rect x="3.6" y="4.4" width="3.2" height="15.2" rx="1.6" fill="currentColor"/><path d="M19.6 4.8L8.6 12l11 7.2z" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  next: '<rect x="17.2" y="4.4" width="3.2" height="15.2" rx="1.6" fill="currentColor"/><path d="M4.4 4.8L15.4 12l-11 7.2z" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  send: '<path d="M3.4 11.4L20.6 4l-5.2 16.4-3.6-6.2z" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  up: '<path d="M12 4l7 8h-4.4v8H9.4v-8H5z" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>',
  down: '<path d="M12 20l7-8h-4.4V4H9.4v8H5z" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>'
};
export const icon = (name, s, color = 'currentColor', css = '') => html(`<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="display:block;color:${color}">${ICONS[name] || ''}</svg>`, `width:${s}px;height:${s}px;flex:none;display:grid;place-items:center;${css}`);

/* Knet-Knopf (Akzent / Pad / Creme / Ruf). Drückt 2 px in den Sockel. */
export function knob(T, s, face, { tone = 'accent', color, shape = BLOB, title = '', css = '' } = {}) {
  const c = accentTones(T, tone, color);
  const b = h('button', clayCss(T, shape, { hi: c.hi, mid: c.mid, lo: c.lo, socket: c.socket, lift: Math.max(2, Math.round(s / 18)) }) + `;width:${s}px;height:${s}px;flex:none;border:0;padding:0;display:grid;place-items:center;color:${c.ink};cursor:pointer;transition:transform .08s;${css}`, face);
  b.type = 'button'; if (title) { b.title = title; b.setAttribute('aria-label', title); }
  b.addEventListener('pointerdown', () => { b.style.transform = 'translateY(2px)'; });
  ['pointerup', 'pointerleave'].forEach((e) => b.addEventListener(e, () => { b.style.transform = ''; }));
  return b;
}
/* Zahl in Bangers, Einheit klein in Nunito (Bangers kennt nur Versalien: „95 M“ läse sich wie Meilen/Mega) */
export function distEl(str, size) {
  const m = /^(.*?)\s?(m|km|k)$/.exec(String(str || '')), num = m ? m[1] : String(str || ''), unit = m ? m[2] : '';
  return h('span', `display:inline-flex;align-items:baseline;gap:${Math.round(size * 0.12)}px;white-space:nowrap`, [h('span', `font:400 ${size}px/1 ${FD};letter-spacing:.03em`, num), unit ? h('span', `font:900 ${Math.round(size * 0.6)}px/1 ${FT};letter-spacing:.01em`, unit) : null]);
}
const lab = (Z, txt, color, css = '') => h('div', `font:900 ${Z.lab}px/1 ${FT};letter-spacing:.09em;text-transform:uppercase;color:${color};white-space:nowrap;${css}`, txt);
const hud = (el) => { el.dataset.hud = '1'; return el; };

/* ---------- Ruf-Marke (Silhouette = Form-Hinweis, G3) ---------- */
const SHAPES = {
  circle: '<circle cx="50" cy="50" r="41"/>',
  squircle: '<rect x="10" y="10" width="80" height="80" rx="25"/>',
  triangle: '<path d="M50 15 L88 82 L12 82 Z" stroke-width="18" stroke-linejoin="round"/>',
  octagon: '<path d="M35 9 H65 L91 35 V65 L65 91 H35 L9 65 V35 Z" stroke-width="8" stroke-linejoin="round"/>',
  pill: '<rect x="4" y="22" width="92" height="56" rx="28"/>',
  blob: '<path d="M50 9c24 0 41 16 41 41S74 91 50 91 9 75 9 50 26 9 50 9z"/>'
};
let gid = 0;
export function puck(T, s, { shape = 'circle', color = '#888', iconName = 'star', iconColor = '#FFF7EA', lifted = false, dim = false } = {}) {
  const id = 'pk' + (++gid), sh = SHAPES[shape] || SHAPES.circle, iy = shape === 'triangle' ? 7 : 0;
  const w = h('div', `position:relative;width:${s}px;height:${s}px;flex:none;filter:drop-shadow(0 ${lifted ? s * 0.12 : s * 0.06}px ${lifted ? s * 0.14 : s * 0.08}px rgba(24,16,8,${lifted ? 0.34 : 0.26}));transform:${lifted ? 'translateY(-' + (s * 0.07).toFixed(1) + 'px) scale(1.1)' : 'none'};transition:transform .16s cubic-bezier(.3,1.5,.5,1);opacity:${dim ? 0.55 : 1}`);
  w.innerHTML = `<svg width="${s}" height="${s}" viewBox="0 0 100 100" style="position:absolute;inset:0;overflow:visible"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient></defs>
    <g transform="translate(0,5)" fill="rgba(0,0,0,.32)" stroke="rgba(0,0,0,.32)">${sh}</g><g transform="translate(0,5)" fill="${color}" stroke="${color}" opacity=".55">${sh}</g>
    <g fill="${color}" stroke="${color}">${sh}</g><g fill="url(#${id})" stroke="url(#${id})">${sh}</g></svg>`;
  const ic = icon(iconName, Math.round(s * 0.44), iconColor, `position:absolute;left:50%;top:50%;margin:${-s * 0.22 + iy * s / 100}px 0 0 ${-s * 0.22}px`);
  w.append(ic); return w;
}

/* ======================= Bauteile ======================= */

export function targetPlaque(T, Z, { island = 'Hub', name = 'Werkstatt', dist = 350, dy = null, arrived = false, fly = false } = {}) {
  const d = arrived ? null : fmtDist(dist), ht = fly && dy != null ? fmtHeight(dy) : null;
  const pinK = knob(T, Z.ph - 14, icon('pin', Math.round((Z.ph - 14) * 0.55)), { tone: arrived ? 'arrive' : 'pad', title: 'Ziel' });
  const txt = h('div', `display:flex;flex-direction:column;gap:${Z === SIZES.phone ? 3 : 5}px;min-width:0;padding-right:4px`, [
    Z === SIZES.phone ? null : lab(Z, 'Insel ' + island, T.variant === 'B' ? T.woodInk : T.inkSoft, 'opacity:.9'),
    h('div', `font:400 ${Z.big}px/1 ${FD};letter-spacing:.03em;color:${T.variant === 'B' ? T.woodInk : T.ink};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:4px`, name)
  ]);
  const wellKids = [];
  if (arrived) wellKids.push(icon('check', Math.round(Z.num * 0.95), T.arrive));
  else wellKids.push(h('div', `color:${T.inkWell};white-space:nowrap`, distEl(d, Z.num)));
  if (ht) wellKids.push(h('div', `display:flex;align-items:center;gap:4px;color:${T.inkWell};white-space:nowrap`, [horizonMini(T, Z, dy), distEl(ht, Math.round(Z.num * 0.62))]));
  const well = h('div', wellCss(T, rad(7, 12)) + `;display:flex;flex-direction:column;align-items:flex-end;justify-content:center;gap:3px;padding:0 ${Z.lab}px;height:${Z.ph - 14}px;flex:none`, wellKids);
  return hud(h('div', plaqueCss(T, rad(23, 18), 23) + `;display:flex;align-items:center;gap:${Z.gap}px;height:${Z.ph}px;padding:7px;max-width:${Z === SIZES.phone ? 200 : 520}px`, [pinK, txt, well]));
}
/* kleiner Horizontring: Kreis, Horizontlinie, Zielpunkt über/unter der Linie */
function horizonMini(T, Z, dy) {
  const s = Math.round(Z.num * 0.7), p = Math.max(-1, Math.min(1, dy / 60));
  return html(`<svg width="${s}" height="${s}" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8.2" fill="none" stroke="${T.inkWell}" stroke-width="1.8" opacity=".85"/><path d="M2.5 10h15" stroke="${T.inkWell}" stroke-width="1.6" opacity=".7"/><circle cx="10" cy="${(10 - p * 5.5).toFixed(1)}" r="2.6" fill="${T.target}"/></svg>`, `width:${s}px;height:${s}px`);
}

export function modePlaque(T, Z, { mode = 'walk', god = false, compact = false } = {}) {
  const P = Z === SIZES.phone;
  const seg = (key, ic, txt, on, w) => {
    const c = accentTones(T, 'accent');
    const face = h('div', `display:flex;align-items:center;gap:${P ? 4 : 7}px;color:${on ? c.ink : T.inkWell};opacity:${on ? 1 : 0.72}`, [icon(ic, P ? 18 : 24), (!P || on) && !compact ? h('span', `font:400 ${P ? 15 : 22}px/1 ${FD};letter-spacing:.04em`, txt) : null]);
    return h('div', (on ? clayCss(T, rad(w, 12), { hi: c.hi, mid: c.mid, lo: c.lo, socket: c.socket, lift: 3 }) : `border-radius:12px`) + `;display:flex;align-items:center;justify-content:center;height:${P ? 32 : 44}px;padding:0 ${P ? 9 : 14}px;${on ? '' : ''}`, face);
  };
  const w1 = h('div', wellCss(T, rad(3, 15)) + `;display:flex;gap:${P ? 2 : 4}px;padding:${P ? 3 : 4}px`, [seg('walk', 'walk', 'Gehen', mode === 'walk', 1), seg('drive', 'drive', 'Fahren', mode === 'drive', 2), seg('fly', 'fly', 'Fliegen', mode === 'fly', 3)]);
  const w2 = h('div', wellCss(T, rad(5, 15)) + `;display:flex;gap:${P ? 2 : 4}px;padding:${P ? 3 : 4}px`, [seg('game', 'dice', 'Spiel', !god, 4), seg('god', 'crown', 'God', god, 5)]);
  return hud(h('div', plaqueCss(T, rad(11, 19), 11) + `;display:flex;gap:${P ? 5 : 8}px;align-items:center;padding:${P ? 5 : 7}px`, [w1, w2]));
}
/* Telefon: ein Knopf mit dem aktiven Modus; Tippen klappt die Plakette auf */
export function modeKnob(T, Z, { mode = 'walk' } = {}) {
  const k = knob(T, 44, icon(mode === 'drive' ? 'drive' : mode === 'fly' ? 'fly' : 'walk', 22), { title: 'Modus' });
  const dot = h('div', `position:absolute;right:-3px;top:-3px;width:16px;height:16px;border-radius:50%;${clayCss(T, '50%', { hi: T.cream, mid: T.cream, lo: T.plaqueHi, socket: T.socket, lift: 1 })};display:grid;place-items:center;color:${T.ink}`, icon('dice', 11));
  return hud(h('div', 'position:relative;width:44px;height:44px', [k, dot]));
}

export function counters(T, Z, { fluff = 12, sammlung = 7, ablage = 3 } = {}) {
  const P = Z === SIZES.phone;
  const ball = h('div', `width:${P ? 15 : 24}px;height:${P ? 15 : 24}px;flex:none;border-radius:52% 48% 50% 50% / 47% 53% 47% 53%;background:${GRAIN},radial-gradient(circle at 38% 32%,#fff 0%,${T.fluff} 55%,${T.fluff} 100%);background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;box-shadow:0 2px 0 rgba(0,0,0,.22),inset 0 -2px 3px rgba(0,0,0,.12)`);
  const ink = T.variant === 'B' ? T.woodInk : T.ink;
  const cell = (ic, n, word) => h('div', `display:flex;align-items:center;gap:${P ? 4 : 7}px`, [ic, h('div', 'display:flex;flex-direction:column;gap:2px', [h('div', `font:400 ${P ? 16 : 26}px/1 ${FD};color:${ink};letter-spacing:.02em`, String(n)), P ? null : lab(Z, word, T.variant === 'B' ? T.woodInk : T.inkSoft, 'font-size:11px;opacity:.85')])]);
  return hud(h('div', plaqueCss(T, rad(3, 14), 3) + `;display:flex;align-items:center;gap:${P ? 10 : 18}px;height:${P ? 26 : 52}px;padding:0 ${P ? 8 : 14}px`, [
    cell(ball, fluff, 'Fluff'), cell(icon('cards', P ? 15 : 22, ink), sammlung, 'Sammlung'), cell(icon('discard', P ? 15 : 22, ink), ablage, 'Ablage')
  ]));
}

export function backpackBtn(T, Z, { count = 7 } = {}) {
  const s = Z.bag, P = Z === SIZES.phone;
  const well = h('div', wellCss(T, BLOB) + `;width:${s - 16}px;height:${s - 16}px;display:grid;place-items:center`, icon('bag', Math.round(s * 0.42), T.inkWell));
  const badge = h('div', clayCss(T, BLOB, { hi: T.accentHi, mid: T.accent, lo: T.accentLo, socket: T.accentSocket, lift: 2 }) + `;position:absolute;right:-4px;bottom:-3px;min-width:${P ? 18 : 26}px;height:${P ? 17 : 24}px;padding:0 5px;display:grid;place-items:center;font:400 ${P ? 13 : 19}px/1 ${FD};color:${T.accentInk}`, String(count));
  return hud(h('div', (T.variant === 'B' ? woodCss(T, '14px') : clayCss(T, '48% 52% 50% 50% / 52% 48% 52% 48%')) + `;position:relative;width:${s}px;height:${s}px;display:grid;place-items:center`, [well, badge]));
}

/* Minikarte (J17-Spender: Knet-Strang als Streckenlinie) mit Zielnadel und Entfernung daneben */
export function minimap(T, Z, { dist = 350, arrived = false, mode = 'walk' } = {}) {
  const s = Z.mini, i = s - 16, P = Z === SIZES.phone;
  const d = arrived ? null : fmtDist(dist);
  const svg = `<svg width="${i}" height="${i}" viewBox="0 0 100 100" style="position:absolute;inset:0">
    <path d="M18 78 C10 52 22 30 44 26 S82 18 84 44 S70 84 46 82 S22 88 18 78Z" fill="none" stroke="${T.cream}" stroke-width="9" stroke-linecap="round" opacity=".9"/>
    <path d="M18 78 C10 52 22 30 44 26 S82 18 84 44 S70 84 46 82 S22 88 18 78Z" fill="none" stroke="${T.accent}" stroke-width="4.6" stroke-linecap="round"/>
    <path d="M44 26 C46 18 58 14 70 13" fill="none" stroke="${T.cream}" stroke-width="6" stroke-linecap="round" opacity=".75"/>
    <path d="M44 26 C46 18 58 14 70 13" fill="none" stroke="${T.inkWell}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="1 4.5" opacity=".9"/>
    <circle cx="70" cy="13" r="7.5" fill="none" stroke="${arrived ? T.arrive : T.target}" stroke-width="2.4"/><circle cx="70" cy="13" r="4" fill="${arrived ? T.arrive : T.target}"/>
    <path d="M40 60 L48 44 L56 60 L48 56Z" fill="${T.inkWell}" stroke="${T.wellTop}" stroke-width="1.2" stroke-linejoin="round"/>
    <text x="90" y="12" font-family="Bangers" font-size="10" fill="${T.inkWell}" opacity=".8" text-anchor="middle">N</text></svg>`;
  const tagEl = d ? h('div', clayCss(T, rad(41, 8), { hi: '#FFFDF6', mid: T.cream, lo: T.plaqueHi, socket: T.socket, lift: 2 }) + `;position:absolute;left:${(i * 0.7 - (P ? 50 : 92)).toFixed(0)}px;top:${(i * 0.13 - (P ? 9 : 14)).toFixed(0)}px;padding:${P ? '3px 6px' : '4px 9px'};color:${T.ink};white-space:nowrap`, distEl(d, P ? 13 : 20)) : null;
  const well = h('div', wellCss(T, rad(19, 18)) + `;position:relative;width:${i}px;height:${i}px;overflow:visible`, [html(svg, 'position:absolute;inset:0;overflow:hidden;border-radius:inherit'), tagEl]);
  const el = h('div', (T.variant === 'B' ? woodCss(T, '10px 12px 9px 11px') : clayCss(T, rad(29, 22))) + `;position:relative;width:${s}px;height:${s}px;padding:8px`, [well]);
  if (T.variant === 'B') { el.append(tape(T, `width:${P ? 30 : 58}px;height:${P ? 11 : 20}px;left:-8px;top:${P ? 4 : 10}px;transform:rotate(-38deg)`)); }
  return hud(el);
}

/* Almanach-Fächer (V-043): gerade nach unten, letzte 7 + „+N“. Neueste Karte oben vollständig, ältere schauen unten heraus. */
export function almanacFan(T, Z, { n = 7, more = 12, cardSrc = null } = {}) {
  const P = Z === SIZES.phone, w = Z.fanW, ch = Math.round(w / 1.414), peek = Z.peek;
  const box = h('div', `position:relative;width:${w}px;height:${ch + peek * (n - 1) + (P ? 24 : 40)}px`);
  const papers = ['#EFE6D2', '#E7DCC4', '#F2E9D8', '#E9DFCA', '#F0E6D0', '#E4D8BE'];
  for (let k = n - 1; k >= 0; k--) {
    const isTop = k === 0;
    const c = h('div', `position:absolute;left:0;top:${k * peek}px;width:${w}px;height:${ch}px;border-radius:${P ? 3 : 5}px;background:${isTop && cardSrc ? '#fff' : papers[k % papers.length]};box-shadow:0 0 0 ${P ? 1.5 : 2.5}px #FBF7EE,0 ${P ? 2 : 3}px ${P ? 4 : 8}px rgba(24,16,8,.32);overflow:hidden;transform:rotate(${[0, 0.8, -0.6, 0.5, -0.9, 0.7, -0.4][k]}deg)`);
    if (isTop && cardSrc) c.append(h('img', `width:100%;height:100%;object-fit:contain;display:block`));
    else c.append(h('div', `position:absolute;inset:${P ? 3 : 5}px;border-radius:2px;background:repeating-linear-gradient(135deg,rgba(80,60,30,.09) 0 4px,transparent 4px 9px)`));
    if (isTop && cardSrc) c.firstChild.src = cardSrc;
    box.append(c);
  }
  const plus = h('div', clayCss(T, rad(51, 10)) + `;position:absolute;left:50%;transform:translateX(-50%);bottom:0;padding:${P ? '3px 8px' : '5px 13px'};font:400 ${P ? 13 : 20}px/1 ${FD};color:${T.ink};white-space:nowrap;letter-spacing:.03em`, '+' + more);
  box.append(plus);
  return hud(box);
}

export function tacho(T, Z, { speed = 55, max = 160, label = 'km/h' } = {}) {
  const s = Z.tacho, p = Math.max(0, Math.min(1, speed / max)), a = (135 + 270 * p) * Math.PI / 180;
  const D = 'M23.13 76.87 A38 38 0 1 1 76.87 76.87';
  const svg = `<svg viewBox="0 0 100 100" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible"><path d="${D}" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="11" stroke-linecap="round"/><path d="${D}" fill="none" stroke="${T.accent}" stroke-width="11" stroke-linecap="round" pathLength="100" stroke-dasharray="${(p * 100).toFixed(1)} 100"/><circle cx="${(50 + 38 * Math.cos(a)).toFixed(1)}" cy="${(50 + 38 * Math.sin(a)).toFixed(1)}" r="5.4" fill="${T.cream}" stroke="${T.wellTop}" stroke-width="1.2"/></svg>`;
  const mid = h('div', 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-top:4px', [h('div', `font:400 ${Math.round(s * 0.3)}px/1 ${FD};color:${T.inkWell}`, String(Math.round(speed))), lab(Z, label, T.inkWell, `font-size:${Math.max(10, Math.round(s * 0.085))}px;opacity:.8;margin-top:2px;text-transform:none`)]);
  const well = h('div', wellCss(T, '50%') + ';position:relative;width:100%;height:100%', [html(svg, 'position:absolute;inset:0'), mid]);
  return hud(h('div', (T.variant === 'B' ? woodCss(T, '50%') : clayCss(T, BLOB)) + `;width:${s}px;height:${s}px;padding:${Math.round(s * 0.06)}px`, [well]));
}

export function radio(T, Z, { on = true, title = 'Inselfunk · Kassette 2', mini = false } = {}) {
  const P = Z === SIZES.phone, k = P ? 34 : Z.knob;
  const kNote = knob(T, k, icon('note', Math.round(k * 0.46)), { title: 'Musik an/aus' });
  if (!on) return hud(h('div', plaqueCss(T, rad(17, 17), 17) + `;display:flex;padding:${P ? 5 : 7}px`, [kNote]));
  const disp = mini ? null : h('div', wellCss(T, rad(13, 10)) + `;display:flex;flex-direction:column;justify-content:center;gap:2px;padding:0 10px;height:${k}px;width:${P ? 110 : 220}px;overflow:hidden`, [h('div', `font:400 ${P ? 15 : 22}px/1 ${FP};color:${T.accentHi};white-space:nowrap;letter-spacing:.02em`, title.toUpperCase()), h('div', `font:400 ${P ? 12 : 16}px/1 ${FP};color:${T.inkWell};opacity:.75;white-space:nowrap`, 'GEHEIMNIS-EP · 2/7')]);
  const sk = Math.round(k * 0.78);
  return hud(h('div', plaqueCss(T, rad(17, 17), 17) + `;display:flex;gap:${P ? 5 : 8}px;align-items:center;padding:${P ? 5 : 7}px`, [kNote, disp, knob(T, sk, icon('prev', Math.round(sk * 0.42))), knob(T, k, icon('play', Math.round(k * 0.42))), knob(T, sk, icon('next', Math.round(sk * 0.42)))]));
}

/* Ruf-Knopf: Creme-Knete, Sprechblasen-Icon, vier Ruf-Punkte am Rand (Hinweis auf die vier Rufe), Taste R */
export function callKnob(T, Z, { open = false, keyHint = true } = {}) {
  const s = Z.callK, P = Z === SIZES.phone;
  const face = open ? icon('close', Math.round(s * 0.38), T.ink) : icon('speech', Math.round(s * 0.46), T.ink);
  const k = knob(T, s, face, { tone: 'cream', title: 'Rufe (R / gedrückt halten)' });
  const wrap = h('div', `position:relative;width:${s}px;height:${s}px`, [k]);
  if (!open) CALLS.forEach((c, i) => { const a = (-150 + i * 40) * Math.PI / 180, r = s * 0.5 - s * 0.02; wrap.append(h('div', `position:absolute;width:${Math.round(s * 0.13)}px;height:${Math.round(s * 0.13)}px;border-radius:50%;left:${(s / 2 + Math.cos(a) * r - s * 0.065).toFixed(1)}px;top:${(s / 2 + Math.sin(a) * r - s * 0.065).toFixed(1)}px;background:${c.color};box-shadow:0 0 0 ${P ? 1.5 : 2}px ${T.cream},0 1px 2px rgba(0,0,0,.3)`)); });
  if (keyHint && !P) wrap.append(h('div', clayCss(T, '7px', { lift: 2 }) + `;position:absolute;left:-14px;bottom:-6px;padding:4px 7px;font:900 13px/1 ${FT};color:${T.ink}`, 'R'));
  return hud(wrap);
}

/* Radial: Viertelbogen um den Ruf-Knopf (Daumen-Bogen). Rufe außen, Kontext-Aktionen innen. */
export const RADIAL_ANGLES = [185, 163.75, 142.5, 121.25, 100];
export function radial(T, Z, { cx, cy, hover = null, help = false, ctx = true, selected = null, onPick = null, onHover = null } = {}) {
  const P = Z === SIZES.phone, R = Z.R, S = Z.puck, Si = Z.puckS;
  const root = h('div', `position:absolute;left:0;top:0;width:0;height:0;pointer-events:none`);
  const markHud = (n) => { n.dataset.hud = '1'; return n; };
  const arc = (r0, a0, a1) => { const p = (a) => [cx + r0 * Math.cos(a * Math.PI / 180), cy - r0 * Math.sin(a * Math.PI / 180)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r0} ${r0} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
  root.append(html(`<svg width="${cx + R + 60}" height="${cy + 60}" style="position:absolute;left:0;top:0;overflow:visible"><path d="${arc(R, 192, 93)}" fill="none" stroke="rgba(24,16,8,.18)" stroke-width="${P ? 11 : 18}" stroke-linecap="round" transform="translate(0 ${P ? 2 : 4})"/><path d="${arc(R, 192, 93)}" fill="none" stroke="${T.cream}" stroke-width="${P ? 8 : 13}" stroke-linecap="round" opacity=".92"/>${ctx ? `<path d="${arc(R * 0.56, 172, 112)}" fill="none" stroke="${T.cream}" stroke-width="${P ? 5 : 8}" stroke-linecap="round" opacity=".6"/>` : ''}</svg>`, 'position:absolute;left:0;top:0'));
  const items = [...CALLS.map((c) => ({ ...c, iconName: c.icon })), { ...OWN_TEXT, color: T.socket, iconName: OWN_TEXT.icon }];
  items.forEach((it, i) => {
    const a = RADIAL_ANGLES[i] * Math.PI / 180, dx = Math.cos(a), dy = -Math.sin(a);
    const x = cx + R * dx, y = cy + R * dy, on = hover === it.id || selected === it.id;
    const pk = puck(T, S, { shape: it.shape, color: it.id === 'own' ? T.plaqueLo : it.color, iconName: it.iconName, iconColor: it.id === 'own' ? T.ink : '#FFF7EA', lifted: on });
    const cell = markHud(h('div', `position:absolute;left:${(x - S / 2).toFixed(1)}px;top:${(y - S / 2).toFixed(1)}px;pointer-events:auto;cursor:pointer`, [pk]));
    cell.dataset.call = it.id;
    if (onPick) cell.addEventListener('click', () => onPick(it));
    if (onHover) { cell.addEventListener('pointerenter', () => onHover(it.id)); cell.addEventListener('pointerleave', () => onHover(null)); }
    root.append(cell);
    /* Beschriftung radial nach außen; beim Hovern/Halten wächst sie um eine Zeile (Hilfe oder Vorschau des vollen Satzes) */
    const ox = x + dx * (S / 2 + (P ? 5 : 9)), oy = y + dy * (S / 2 + (P ? 5 : 9));
    const extra = on ? (help || !it.line ? it.meaning : '„' + it.line + '“') : null;
    const tagEl = h('div', clayCss(T, rad(60 + i, P ? 7 : 10), { hi: T.cream, mid: T.cream, lo: T.plaqueHi, socket: T.socket, lift: 2 }) + `;position:absolute;left:${ox.toFixed(1)}px;top:${oy.toFixed(1)}px;transform:translate(${(-50 + 50 * dx).toFixed(0)}%,${(-50 + 50 * dy).toFixed(0)}%);padding:${P ? '4px 6px' : '6px 11px'};display:flex;flex-direction:column;gap:${P ? 2 : 4}px;max-width:${P ? 150 : 300}px;pointer-events:none`, [
      h('div', `font:400 ${P ? 13 : 21}px/1 ${FD};letter-spacing:.03em;color:${it.id === 'own' ? T.ink : it.color};white-space:nowrap;filter:brightness(.82)`, it.id === 'own' ? 'Eigener Text' : it.short),
      extra ? h('div', `font:700 ${P ? 11 : 16}px/1.25 ${FT};color:${T.ink};white-space:normal;width:${P ? 128 : 260}px;text-wrap:pretty`, extra) : null
    ]);
    tagEl.dataset.label = it.id; markHud(tagEl);
    root.append(tagEl);
  });
  if (ctx) CONTEXT_ACTIONS.forEach((c, i) => {
    const a = [160, 125][i] * Math.PI / 180, x = cx + R * 0.56 * Math.cos(a), y = cy - R * 0.56 * Math.sin(a);
    const pk = puck(T, Si, { shape: 'blob', color: T.plaque, iconName: c.icon, iconColor: T.ink, lifted: hover === c.id });
    const cell = markHud(h('div', `position:absolute;left:${(x - Si / 2).toFixed(1)}px;top:${(y - Si / 2).toFixed(1)}px;pointer-events:auto;cursor:pointer`, [pk]));
    if (onPick) cell.addEventListener('click', () => onPick(c));
    if (onHover) { cell.addEventListener('pointerenter', () => onHover(c.id)); cell.addEventListener('pointerleave', () => onHover(null)); }
    root.append(cell);
    root.append(h('div', `position:absolute;left:${x.toFixed(1)}px;top:${(y + Si / 2 + 3).toFixed(1)}px;transform:translateX(-50%);font:900 ${P ? 10 : 13}px/1 ${FT};letter-spacing:.06em;color:${T.ink};background:${T.cream};padding:3px 6px;border-radius:6px;box-shadow:0 1px 0 ${T.socket};white-space:nowrap;pointer-events:none`, c.short));
  });
  return root;
}

/* Spickzettel beim ersten Öffnen (G7). Texte aus r4-calls-data.js. */
export function firstUseCard(T, Z, { css = '', onOk = null } = {}) {
  const P = Z === SIZES.phone;
  const row = (it, color, shape, ic) => h('div', `display:flex;align-items:center;gap:${P ? 7 : 12}px`, [puck(T, P ? 26 : 40, { shape, color, iconName: ic, iconColor: it.id === 'own' ? T.ink : '#FFF7EA' }), h('div', 'display:flex;flex-direction:column;gap:2px;min-width:0', [h('div', `font:400 ${P ? 14 : 21}px/1 ${FD};letter-spacing:.03em;color:${T.ink}`, it.label), h('div', `font:700 ${P ? 11 : 15}px/1.25 ${FT};color:${T.ink};opacity:.88;text-wrap:pretty`, it.meaning)])]);
  const okK = knob(T, P ? 34 : 46, icon('check', P ? 18 : 24), { title: FIRST_USE.ok });
  if (onOk) okK.addEventListener('click', onOk);
  const el = h('div', panelCss(T, rad(77, 18)) + `;position:absolute;display:flex;flex-direction:column;gap:${P ? 7 : 12}px;padding:${P ? '10px 11px' : '18px 20px'};width:${P ? 262 : 430}px;${css}`, [
    h('div', `font:400 ${P ? 20 : 32}px/1 ${FD};letter-spacing:.04em;color:${T.variant === 'B' ? T.woodInk : T.ink}`, FIRST_USE.title),
    h('div', `font:700 ${P ? 12 : 16}px/1.3 ${FT};color:${T.variant === 'B' ? T.woodInk : T.ink};text-wrap:pretty`, FIRST_USE.body),
    ...CALLS.map((c) => row(c, c.color, c.shape, c.icon)),
    row(OWN_TEXT, T.plaqueLo, OWN_TEXT.shape, OWN_TEXT.icon),
    h('div', `display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:${P ? -4 : 2}px`, [P ? h('div', '') : h('div', `font:800 14px/1.25 ${FT};color:${T.variant === 'B' ? T.woodInk : T.inkSoft}`, FIRST_USE.more), okK])
  ]);
  if (T.variant === 'B') { el.append(tape(T, `width:${P ? 44 : 80}px;height:${P ? 13 : 22}px;left:50%;top:${P ? -7 : -11}px;transform:translateX(-50%) rotate(-3deg)`)); }
  return el;
}

/* Sprechblase plain (V-204): eine Form, ein Schwanz, weicher Schatten, keine Tusche. Ruf-Wort in Bangers. */
export function bubble(T, Z, { text = '', call = null, x = 0, y = 0, maxW = null } = {}) {
  const P = Z === SIZES.phone, fs = Z.bub;
  const c = call && CALLS.find((k) => k.id === call);
  let head = null, rest = text;
  if (c && text.startsWith(c.label)) { head = c.label + (text[c.label.length] === '!' || text[c.label.length] === '?' ? text[c.label.length] : ''); rest = text.slice(head.length).trim(); }
  const body = h('div', `position:relative;background:${T.bubble};border-radius:${P ? 14 : 24}px;padding:${P ? '8px 12px' : '14px 22px'};max-width:${maxW || (P ? 230 : 560)}px;color:${T.bubbleInk};text-align:center;text-wrap:balance`, [
    head ? h('div', `font:400 ${Math.round(fs * 1.5)}px/1 ${FD};letter-spacing:.03em`, head) : null,
    rest ? h('div', `font:600 ${fs}px/1.28 ${FB};margin-top:${head ? (P ? 4 : 6) : 0}px`, rest) : null
  ]);
  const tail = h('div', `position:absolute;left:50%;bottom:${P ? -10 : -17}px;width:${P ? 18 : 30}px;height:${P ? 12 : 19}px;margin-left:${P ? -12 : -20}px;background:${T.bubble};clip-path:polygon(0 0,100% 0,28% 100%)`);
  body.append(tail);
  return h('div', `position:absolute;left:${x}px;top:${y}px;transform:translate(-50%,-100%);filter:drop-shadow(0 ${P ? 2 : 4}px ${P ? 3 : 6}px rgba(24,16,8,.2))`, [body]);
}

/* Eigener Text: kleines Knet-Feld mit Mulde, Zähler, Senden-Knopf */
export function ownTextField(T, Z, { text = '', max = OWN_TEXT.max, css = '', inputEl = null, onSend = null } = {}) {
  const P = Z === SIZES.phone;
  const caret = h('span', `display:inline-block;width:2px;height:1.05em;background:${T.accent};vertical-align:-2px;margin-left:1px`);
  const fieldCss = wellCss(T, rad(81, 12)) + `;flex:1;min-width:0;padding:${P ? '9px 10px' : '13px 16px'};font:600 ${P ? 15 : 22}px/1.25 ${FB};color:${T.inkWell}`;
  let field;
  if (inputEl) { inputEl.style.cssText = fieldCss + ';border:0;outline:none;caret-color:' + T.accent; inputEl.maxLength = max; inputEl.placeholder = 'Sag etwas …'; field = inputEl; }
  else field = h('div', fieldCss, [text || h('span', 'opacity:.55', 'Sag etwas …'), caret]);
  const cnt = h('div', `font:900 ${P ? 10 : 13}px/1 ${FT};color:${T.variant === 'B' ? T.woodInk : T.inkSoft};white-space:nowrap`, `${text.length}/${max}`);
  const send = knob(T, P ? 40 : 54, icon('send', P ? 19 : 26), { title: 'Sagen (Enter)' });
  if (onSend) send.addEventListener('click', onSend);
  return hud(h('div', plaqueCss(T, rad(83, 18), 83) + `;position:absolute;display:flex;flex-direction:column;gap:${P ? 5 : 8}px;padding:${P ? 7 : 10}px;${css}`, [
    h('div', 'display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 4px', [h('div', 'display:flex;align-items:center;gap:6px', [icon('pencil', P ? 14 : 18, T.variant === 'B' ? T.woodInk : T.ink), lab(Z, 'Eigener Text · deine Figur sagt es', T.variant === 'B' ? T.woodInk : T.ink)]), cnt]),
    h('div', `display:flex;align-items:center;gap:${P ? 6 : 10}px`, [field, send])
  ]));
}

/* Distanz-Anhänger am 3D-Pfeil (hängt an einem Faden, bewegt sich mit dem Pfeil, bleibt bildschirmparallel) */
export function arrowTag(T, Z, { x, y, dist = 350, dy = null, fly = false, color, arrived = false } = {}) {
  const P = Z === SIZES.phone, d = arrived ? null : fmtDist(dist), ht = fly && dy != null ? fmtHeight(dy) : null;
  const str = h('div', `width:${P ? 1.5 : 2.5}px;height:${P ? 10 : 18}px;background:${T.cream};margin:0 auto;box-shadow:0 0 0 .5px rgba(0,0,0,.15)`);
  const kids = arrived ? [icon('check', P ? 16 : 26, '#1F2A12')] : [distEl(d, P ? 15 : 26)];
  if (ht) kids.push(h('span', `margin-left:${P ? 5 : 8}px;opacity:.9`, distEl(ht, P ? 12 : 19)));
  const tg = h('div', clayCss(T, rad(91, P ? 7 : 11), arrived ? { hi: T.arrive, mid: T.arrive, lo: T.arriveLo, socket: T.arriveLo, lift: 2 } : { hi: '#FFFDF6', mid: T.cream, lo: T.plaqueHi, socket: T.socket, lift: 2 }) + `;display:flex;align-items:center;padding:${P ? '4px 7px' : '6px 12px'};color:${arrived ? '#1F2A12' : T.ink};white-space:nowrap`, kids);
  const el = h('div', `position:absolute;left:${x}px;top:${y}px;transform:translateX(-50%) rotate(-2deg);display:flex;flex-direction:column;align-items:center`, [str, tg]);
  el.dataset.hud = '1';
  return el;
}

/* ---------- Karten-Momente ---------- */
const cardBox = (T, w, src, label, P) => {
  const ch = Math.round(w / 1.414);
  const inner = src ? h('img', `width:100%;height:100%;object-fit:contain;display:block;background:#fff`) : h('div', `position:absolute;inset:0;display:grid;place-items:center;background:repeating-linear-gradient(135deg,#EFE7D6 0 7px,#E6DCC7 7px 14px);font:600 ${P ? 10 : 13}px/1.3 ui-monospace,Menlo,monospace;color:#6d5f48;text-align:center;padding:8px`, label || 'Kartenbild · Querformat ¼ Seite');
  if (src) inner.src = src;
  /* Karte liegt in einer Knet- bzw. Pappe-Fassung; die Fassung berührt das Kartenbild nicht (V-220/V-327: vollständig, unverändert) */
  const card = h('div', `position:relative;width:${w}px;height:${ch}px;border-radius:${P ? 3 : 5}px;overflow:hidden;box-shadow:0 0 0 ${P ? 2 : 3}px #FBF7EE,0 ${P ? 3 : 6}px ${P ? 6 : 14}px rgba(24,16,8,.3)`, [inner]);
  return card;
};
export function dealPanel(T, Z, { cardSrc, figure = 'FrizzleBob', pick = 1 } = {}) {
  const P = Z === SIZES.phone, ink = T.variant === 'B' ? T.woodInk : T.ink;
  const names = [['The Ass', 'Actor'], ['Mirror Neurons', 'Actor'], ['Michael Tomasello', 'Actor']];
  const head = h('div', plaqueCss(T, rad(101, 16), 101) + `;display:flex;align-items:center;gap:12px;padding:${P ? '7px 12px' : '12px 22px'};align-self:center`, [
    icon('cards', P ? 18 : 28, T.variant === 'B' ? T.woodInk : T.ink), h('div', 'display:flex;flex-direction:column;gap:3px', [h('div', `font:400 ${P ? 19 : 32}px/1 ${FD};letter-spacing:.04em;color:${T.variant === 'B' ? T.woodInk : T.ink}`, 'Deal · wähle eine Karte'), h('div', `font:700 ${P ? 11 : 16}px/1.2 ${FT};color:${T.variant === 'B' ? T.woodInk : T.inkSoft}`, `${figure} spielt sie. Die anderen zwei kommen in die Sammlung.`)])]);
  const slot = (i) => {
    const on = i === pick, w = P ? 222 : 452;
    const num = knob(T, P ? 34 : 50, h('span', `font:400 ${P ? 18 : 26}px/1 ${FD}`, String(i + 1)), { tone: on ? 'accent' : 'cream' });
    const cap = h('div', `display:flex;flex-direction:column;gap:3px;${P ? '' : 'align-items:center'}`, [h('div', `font:400 ${P ? 14 : 24}px/1.05 ${FD};letter-spacing:.03em;color:${ink};text-wrap:balance`, names[i][0]), lab(Z, names[i][1], T.variant === 'B' ? T.woodInk : T.inkSoft)]);
    const mount = h('div', (on ? (T.variant === 'B' ? boardCss({ ...T, boardHi: '#E9D2A6', board: '#DDBF8C' }, '8px') : clayCss(T, rad(110 + i, 16), { hi: T.accentHi, mid: T.accent, lo: T.accentLo, socket: T.accentSocket, lift: 5 })) : wellCss(T, rad(110 + i, 16))) + `;padding:${P ? 7 : 12}px;transform:${on ? 'translateY(-6px) rotate(-.6deg)' : 'none'}`, [cardBox(T, w, i === 1 ? cardSrc : null, null, P)]);
    if (P) return h('div', 'display:flex;align-items:center;gap:8px', [h('div', 'display:flex;flex-direction:column;align-items:flex-start;gap:6px;width:84px;flex:none', [num, cap]), mount]);
    return h('div', 'display:flex;flex-direction:column;align-items:center;gap:14px', [mount, h('div', 'display:flex;align-items:center;gap:12px', [num, cap])]);
  };
  const row = h('div', `display:flex;${P ? 'flex-direction:column;gap:8px' : 'gap:34px'};justify-content:center`, [slot(0), slot(1), slot(2)]);
  const el = h('div', panelCss(T, rad(99, 26)) + `;position:absolute;display:flex;flex-direction:column;gap:${P ? 9 : 26}px;padding:${P ? '10px 10px 12px' : '26px 34px 34px'}`, [head, row]);
  if (T.variant === 'B') { el.append(tape(T, `width:${P ? 50 : 110}px;height:${P ? 14 : 26}px;left:${P ? -10 : -20}px;top:${P ? 8 : 18}px;transform:rotate(-35deg)`), tape(T, `width:${P ? 50 : 110}px;height:${P ? 14 : 26}px;right:${P ? -10 : -20}px;top:${P ? 8 : 18}px;transform:rotate(35deg)`)); }
  return el;
}
export function revealPanel(T, Z, { cardSrc } = {}) {
  const P = Z === SIZES.phone, ink = T.variant === 'B' ? T.woodInk : T.ink;
  const w = P ? 330 : 760;
  const head = h('div', 'display:flex;align-items:center;justify-content:center;gap:12px', [puck(T, P ? 30 : 48, { shape: 'circle', color: T.arrive, iconName: 'star', iconColor: '#1F2A12' }), h('div', `font:400 ${P ? 26 : 46}px/1 ${FD};letter-spacing:.04em;color:${ink}`, 'Gewonnen!')]);
  const mount = h('div', wellCss(T, rad(121, 18)) + `;padding:${P ? 8 : 14}px`, [cardBox(T, w, cardSrc, null, P)]);
  const ok = knob(T, P ? 46 : 64, h('span', `font:400 ${P ? 20 : 28}px/1 ${FD}`, 'OK'), { title: 'OK' });
  const foot = h('div', 'display:flex;align-items:center;justify-content:center;gap:14px', [ok, h('div', `display:flex;align-items:center;gap:6px;font:800 ${P ? 12 : 17}px/1.2 ${FT};color:${T.variant === 'B' ? T.woodInk : T.inkSoft}`, [icon('cards', P ? 15 : 20), 'kommt in den Almanach'])]);
  const el = h('div', panelCss(T, rad(119, 26)) + `;position:absolute;display:flex;flex-direction:column;gap:${P ? 10 : 20}px;padding:${P ? '12px' : '24px 30px 26px'}`, [head, mount, foot]);
  if (T.variant === 'B') el.append(tape(T, `width:${P ? 60 : 120}px;height:${P ? 15 : 26}px;left:50%;top:${P ? -8 : -12}px;transform:translateX(-50%) rotate(2deg)`));
  return el;
}
export function backpackPanel(T, Z, { items = [], sel = 1 } = {}) {
  const P = Z === SIZES.phone, ink = T.variant === 'B' ? T.woodInk : T.ink, cell = P ? 56 : 84;
  const head = h('div', 'display:flex;align-items:center;justify-content:space-between;gap:12px', [h('div', 'display:flex;align-items:baseline;gap:10px', [h('div', `font:400 ${P ? 24 : 38}px/1 ${FD};letter-spacing:.04em;color:${ink}`, 'Rucksack'), h('div', `font:400 ${P ? 15 : 22}px/1 ${FD};color:${T.variant === 'B' ? T.woodInk : T.inkSoft}`, `${items.length} / 20`)]), knob(T, P ? 34 : 44, icon('close', P ? 15 : 20), { tone: 'cream', title: 'Schließen (B)' })]);
  const grid = h('div', `display:grid;grid-template-columns:repeat(5,${cell}px);gap:${P ? 6 : 10}px`);
  for (let i = 0; i < 20; i++) {
    const on = i === sel, it = items[i];
    const c = h('div', wellCss(T, rad(130 + i, P ? 10 : 14)) + `;width:${cell}px;height:${cell}px;display:grid;place-items:center;${on ? `box-shadow:inset 0 3px 7px rgba(10,6,4,.62),0 0 0 ${P ? 2.5 : 3.5}px ${T.accent}` : ''}`);
    if (it) { const im = h('img', `width:${Math.round(cell * 0.82)}px;height:${Math.round(cell * 0.82)}px;object-fit:contain`); im.src = it.src; c.append(im); }
    grid.append(c);
  }
  const s = items[sel] || {};
  const hero = h('div', wellCss(T, rad(150, 16)) + `;display:grid;place-items:center;height:${P ? 96 : 190}px`, s.big ? (() => { const im = h('img', `height:${P ? 82 : 164}px;object-fit:contain`); im.src = s.big; return im; })() : null);
  const deck = h('div', wellCss(T, rad(151, 10)) + `;padding:${P ? '6px 9px' : '9px 13px'};font:400 ${P ? 13 : 18}px/1 ${FP};color:${T.inkWell};opacity:.9`, 'SCHACHT LEER · KASSETTE EINLEGEN');
  const detail = h('div', `display:flex;flex-direction:column;gap:${P ? 6 : 10}px;width:${P ? 'auto' : '330px'}`, [hero, h('div', `font:400 ${P ? 19 : 30}px/1 ${FD};letter-spacing:.03em;color:${ink}`, s.name || ''), h('div', `font:700 ${P ? 12 : 16}px/1.3 ${FT};color:${ink};text-wrap:pretty`, s.text || ''), deck]);
  const body = h('div', `display:flex;${P ? 'flex-direction:column' : ''};gap:${P ? 10 : 22}px`, [grid, detail]);
  const el = h('div', panelCss(T, rad(129, 26)) + `;position:absolute;display:flex;flex-direction:column;gap:${P ? 10 : 18}px;padding:${P ? '10px 10px 12px' : '20px 26px 26px'}`, [head, body]);
  if (T.variant === 'B') el.append(tape(T, `width:${P ? 50 : 100}px;height:${P ? 14 : 24}px;right:${P ? 40 : 80}px;top:${P ? -7 : -11}px;transform:rotate(-4deg)`));
  return el;
}
/* Telefon-Tastatur: nur Platzhalter (System-UI, nicht Teil des HUD) */
const keyboardPh = (H) => h('div', `position:absolute;left:0;right:0;bottom:0;height:${Math.round(H * 0.36)}px;background:repeating-linear-gradient(135deg,#d9d6cf 0 8px,#cfccc4 8px 16px);display:grid;place-items:center;font:600 11px/1 ui-monospace,Menlo,monospace;color:#5e5a52`, 'System-Tastatur (Platzhalter)');

/* ======================= Bild-Komposition ======================= */
/* bg: { src, sw, sh, zoom, fx, fy } → deckend (cover) mit Zoom; map(sx, sy) rechnet Quell-Pixel in Bild-Pixel */
export function bgLayer(W, H, bg) {
  if (!bg) return { el: null, map: (x, y) => [x, y], k: 1 };
  if (bg.url) { const im = h('img', `position:absolute;inset:0;width:100%;height:100%;object-fit:cover`); im.src = bg.url; return { el: im, map: (x, y) => [x, y], k: 1 }; }
  const k = Math.max(W / bg.sw, H / bg.sh) * (bg.zoom || 1), dw = bg.sw * k, dh = bg.sh * k;
  const left = -(dw - W) * (bg.fx ?? 0.5), top = -(dh - H) * (bg.fy ?? 0.5);
  const im = h('img', `position:absolute;left:${left}px;top:${top}px;width:${dw}px;height:${dh}px;max-width:none`); im.src = bg.src;
  return { el: im, map: (x, y) => [left + x * k, top + y * k], k };
}

/* cfg: { form, T, scene, bg, arrow:{src, sx, sy, w}, ring:{src, sx, sy, w}, target, mode, speed, god, radialHover, help, bubble:{text, call, sx, sy}, own, cardSrc, items } */
export function buildFrame(cfg) {
  const Z = SIZES[cfg.form] || SIZES.desk, P = cfg.form === 'phone', T = cfg.T, W = Z.W, H = Z.H;
  const el = h('div', `position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${T.sky};font-family:${FT};-webkit-font-smoothing:antialiased;user-select:none`);
  const B = bgLayer(W, H, cfg.bg); if (B.el) el.append(B.el);
  const scene = cfg.scene || 'walk', mode = cfg.mode || (scene === 'drive' || scene === 'backpack' ? 'drive' : scene === 'fly' ? 'fly' : 'walk');
  const tgt = { island: 'Hub', name: 'Werkstatt', dist: 350, dy: null, arrived: false, ...(cfg.target || {}) };
  const place = (node, css) => { node.style.position = 'absolute'; node.style.cssText += ';' + css; el.append(node); return node; };
  /* Welt-Ebene: Zielring, Pfeil + Anhänger */
  if (cfg.ring) { const [x, y] = cfg.ring.sx != null ? B.map(cfg.ring.sx, cfg.ring.sy) : [cfg.ring.x, cfg.ring.y]; const w = cfg.ring.w * (cfg.ring.sx != null ? B.k : 1); const im = h('img', `position:absolute;left:${x - w / 2}px;top:${y - w * 0.86 / 2}px;width:${w}px`); im.src = cfg.ring.src; el.append(im); }
  if (cfg.arrow) {
    const [x, y] = cfg.arrow.sx != null ? B.map(cfg.arrow.sx, cfg.arrow.sy) : [cfg.arrow.x, cfg.arrow.y];
    const w = cfg.arrow.w * (cfg.arrow.sx != null ? B.k : 1);
    if (cfg.arrow.src) { const im = h('img', `position:absolute;left:${x - w / 2}px;top:${y - w * 0.76 / 2}px;width:${w}px`); im.src = cfg.arrow.src; el.append(im); }
    if (cfg.arrow.tag !== false) el.append(arrowTag(T, Z, { x, y: y + w * (cfg.arrow.tagDy ?? 0.2), dist: tgt.dist, dy: tgt.dy, fly: mode === 'fly', arrived: tgt.arrived }));
  }
  if (cfg.bubble) { const [x, y] = cfg.bubble.sx != null ? B.map(cfg.bubble.sx, cfg.bubble.sy) : [cfg.bubble.x, cfg.bubble.y]; el.append(bubble(T, Z, { text: cfg.bubble.text, call: cfg.bubble.call, x, y })); }

  const overlay = ['deal', 'reveal', 'backpack'].includes(scene);
  const pad = Z.pad;
  /* HUD-Ebene */
  if (!overlay || scene === 'backpack') {
    place(backpackBtn(T, Z, { count: 7 }), `left:${pad}px;top:${pad}px`);
    if (!overlay) {
      place(targetPlaque(T, Z, { ...tgt, fly: mode === 'fly' }), `left:${pad + Z.bag + Z.gap + 4}px;top:${pad + (P ? 2 : 2)}px`);
      place(counters(T, Z, {}), `left:${pad + Z.bag + Z.gap + 4}px;top:${pad + Z.ph + (P ? 9 : 16)}px`);
      if (!P) place(modePlaque(T, Z, { mode, god: !!cfg.god }), `left:50%;top:${pad}px;transform:translateX(-50%)`);
      place(minimap(T, Z, { dist: tgt.dist, arrived: tgt.arrived, mode }), `right:${pad}px;top:${pad}px`);
      place(almanacFan(T, Z, { n: 7, more: 12, cardSrc: cfg.cardSrc }), `right:${pad + (Z.mini - Z.fanW) / 2}px;top:${pad + Z.mini + (P ? 10 : 18)}px`);
      if (P) place(modeKnob(T, Z, { mode }), `left:${pad}px;bottom:${pad + 2}px`);
      const radOpenP = P && ['radial', 'help', 'own'].includes(scene);
      if (mode !== 'walk' && !radOpenP) place(tacho(T, Z, { speed: cfg.speed ?? (mode === 'fly' ? 124 : 55), max: mode === 'fly' ? 220 : 160, label: mode === 'fly' ? 'Luft km/h' : 'km/h' }), P ? `left:${pad + 52}px;bottom:${pad}px` : `left:${pad}px;bottom:${pad}px`);
    }
  }
  /* Ruf-Knopf + Radio unten rechts (Daumen) */
  let ck = null;
  if (!overlay) {
    const radioOn = mode !== 'walk';
    if (P) { if (radioOn && !['radial', 'help', 'own'].includes(scene)) place(radio(T, Z, { on: true, mini: true }), `right:${pad + Z.callK + 10}px;bottom:${pad + 4}px`); }
    else place(radio(T, Z, { on: radioOn }), `right:${pad}px;bottom:${pad}px`);
    const kb = P ? pad + 2 : pad + 64 + 22;
    const open = ['radial', 'help', 'own'].includes(scene) && scene !== 'own';
    ck = { cx: W - (P ? pad + 2 : pad) - Z.callK / 2, cy: H - kb - Z.callK / 2 };
    const ckEl = place(callKnob(T, Z, { open: open || scene === 'own' }), `right:${P ? pad + 2 : pad}px;bottom:${kb}px`);
    ckEl.dataset.callknob = '1';
    if (cfg.onCallKnob) { const b = ckEl.querySelector('button'); b.addEventListener('click', cfg.onCallKnob); }
    if (open) {
      if (scene === 'help') el.append(firstUseCard(T, Z, { onOk: cfg.onHelpOk, css: P ? `left:${pad}px;top:${pad + Z.ph + 44}px` : `left:${W - 860}px;top:${H - 900}px` }));
      el.append(radial(T, Z, { cx: ck.cx, cy: ck.cy, hover: cfg.radialHover === undefined ? 'boggle' : cfg.radialHover, help: scene === 'help' || !!cfg.help, ctx: cfg.ctx !== false, onPick: cfg.onPick, onHover: cfg.onHover }));
    }
    if (scene === 'own') {
      if (P) { if (!cfg.noKeyboard) el.append(keyboardPh(H)); el.append(ownTextField(T, Z, { text: cfg.own ?? 'Ich nehme die zweite Last, Esel!', inputEl: cfg.ownInputEl, onSend: cfg.onOwnSend, css: `left:${pad}px;right:${pad}px;bottom:${Math.round(H * 0.36) + 8}px` })); }
      else el.append(ownTextField(T, Z, { text: cfg.own ?? 'Ich nehme die zweite Last, Esel!', inputEl: cfg.ownInputEl, onSend: cfg.onOwnSend, css: `right:${pad + Z.callK + 24}px;bottom:${pad + 64 + 22}px;width:640px` }));
    }
  }
  if (scene === 'deal') { const p = dealPanel(T, Z, { cardSrc: cfg.cardSrc }); p.style.cssText += P ? `;left:${pad}px;right:${pad}px;top:${pad}px` : `;left:50%;top:50%;transform:translate(-50%,-50%)`; el.append(p); }
  if (scene === 'reveal') { const p = revealPanel(T, Z, { cardSrc: cfg.cardSrc }); p.style.cssText += `;left:50%;top:50%;transform:translate(-50%,-50%)`; el.append(p); }
  if (scene === 'backpack') { const p = backpackPanel(T, Z, { items: cfg.items || [] }); p.style.cssText += P ? `;left:${pad}px;right:${pad}px;top:${pad + Z.bag + 10}px` : `;left:50%;top:52%;transform:translate(-50%,-50%)`; el.append(p); }
  return { el, W, H, Z, callCenter: ck };
}

/* HUD-Fläche messen (G4): Vereinigung aller [data-hud]-Rechtecke, Rasterzellen 2 px mit Mittelpunkt-Test, in Bild-Pixeln */
export function measureCoverage(frameEl, W, H) {
  const R = frameEl.getBoundingClientRect(), s = R.width / W, cell = 2, cols = Math.ceil(W / cell), rows = Math.ceil(H / cell), g = new Uint8Array(cols * rows);
  frameEl.querySelectorAll('[data-hud]').forEach((n) => {
    if (n.parentElement && n.parentElement.closest('[data-hud]')) return;
    const r = n.getBoundingClientRect(), L = (r.left - R.left) / s, Rr = (r.right - R.left) / s, Tt = (r.top - R.top) / s, Bb = (r.bottom - R.top) / s;
    const x0 = Math.max(0, Math.ceil(L / cell - 0.5)), x1 = Math.min(cols, Math.floor(Rr / cell - 0.5) + 1), y0 = Math.max(0, Math.ceil(Tt / cell - 0.5)), y1 = Math.min(rows, Math.floor(Bb / cell - 0.5) + 1);
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) g[y * cols + x] = 1;
  });
  let n = 0; for (const v of g) n += v; return n / g.length;
}
