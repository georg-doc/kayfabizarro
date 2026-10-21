/* KFB HUD R5d · Holz, zweiter Kritik-Durchgang. DESIGN ONLY (V-228): Look-Bauteile, kein Spielcode.
 * Oben links Almanach (Stapel 2×), oben Mitte Fluff (Cartoon-Kugeln in Kuhlen, Klick = Fluff-Korb),
 * oben rechts Tafel (Karte · Zielzeile · Radio), Tacho oben an der Karte. Unten Mitte Aktionsleiste, rechts unten übereinander Ton · Info · Einstellungen.
 * Overlays (Einstellungen, Info, Almanach-Ansicht) teilen eine Hülle: Abdunklung + Holzplatte + Kopf mit Schließen.
 */
import { h, GRAIN, bgLayer, measureCoverage } from '../hud-r4/r4-hud.js';
import { fmtDist } from '../hud-r4/r4-theme.js';
import { STORY_MODES } from '../hud-r4/kfb-cartoon-palette.js';
import { plate, WOODC, FN } from './r5-hud.js';
export { h, bgLayer, measureCoverage, FN };

const INK = WOODC.ink, SOFT = WOODC.inkSoft;
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const mix = (c, w, p) => `color-mix(in oklch, ${c}, ${w} ${p}%)`;
/* Cartoon-Farben: Story-Mode-Farbton, heller und bunter als die Website-Farbe; Rand = Website „dunkel“ */
export const CARTOON = {
  tragic: { c: '#3F93CF', d: '#24597D' }, comic: { c: '#93BE3C', d: '#5A7A1E' }, absurd: { c: '#FFD21F', d: '#B8901C' },
  heroic: { c: '#F5893A', d: '#B35E22' }, mystical: { c: '#9A62C4', d: '#5B4470' }, forbidden: { c: '#E2508F', d: '#8F3A60' }
};
const SM = (k) => CARTOON[k].c;
export const FLUFF = Object.keys(CARTOON).map((k) => ({ id: k, label: STORY_MODES[k].label, c: CARTOON[k].c, d: CARTOON[k].d }));

export const SIZES = {
  desk: { W: 1920, H: 1080, pad: 32, gap: 12, r: 14, row: 64, gear: 56, cw: 200, ch: 114, openW: 252, openStep: 92, total: 34, ball: 30, ballN: 20, mapS: 244, ip: 10, strip: 64, aw: 80, arrowSz: 99, num: 36, unit: 22, name: 17, ybtn: 44, tick: 19, tickH: 36, rk: 40, drop: 17, tray: 84, key: 64, tacho: 124, menuW: 380 },
  phone: { W: 390, H: 693, pad: 12, gap: 6, r: 9, row: 36, gear: 32, cw: 100, ch: 57, openW: 150, openStep: 50, total: 16, ball: 15, ballN: 0, mapS: 100, ip: 6, strip: 34, aw: 34, arrowSz: 42, num: 16, unit: 10, name: 11, ybtn: 24, tick: 11, tickH: 26, rk: 26, drop: 0, tray: 44, key: 34, tacho: 66, menuW: 0 }
};
export const MOTION = { on: true };
export const KEY = { style: 'holz' };   // 'holz' | 'lack' | 'plakette'

/* ---------- Icons ---------- */
const S = `stroke="${INK}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"`;
const GEAR = (() => { const t = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<rect x="10" y="2.2" width="4" height="5.4" rx="1.2" transform="rotate(${a} 12 12)"/>`).join(''); return `<circle cx="12" cy="12" r="6.8"/>${t}`; })();
const IC = {
  bag: (c) => `<path d="M9.2 7.4V5.8a2.8 2.8 0 015.6 0v1.6" fill="none" ${S}/><path d="M5.8 10.2a6.2 6.2 0 0112.4 0v8.9a2.4 2.4 0 01-2.4 2.4H8.2a2.4 2.4 0 01-2.4-2.4z" fill="${c}" ${S}/><path d="M5.9 11h12.2v1.8a1.6 1.6 0 01-1.6 1.6H7.5a1.6 1.6 0 01-1.6-1.6z" fill="#FFF3DE" fill-opacity=".5" ${S}/><rect x="9.2" y="16" width="5.6" height="3.4" rx="1.2" fill="#FFF3DE" fill-opacity=".5" ${S}/>`,
  flask: (c) => `<rect x="9.4" y="1.9" width="5.2" height="2.6" rx=".9" fill="#C58B4E" ${S}/><path d="M10.3 4.5h3.4v3.6a7 7 0 11-3.4 0z" fill="#FFF7EA" ${S}/><path d="M5.2 14.4h13.6a6.8 6.8 0 01-13.6 0z" fill="${c}" ${S}/><circle cx="10.2" cy="11.6" r="1.1" fill="${c}"/><circle cx="13.6" cy="9.9" r=".8" fill="${c}"/>`,
  car: (c) => `<path d="M3.2 16.2v-2.6c0-1.2.8-2.1 1.9-2.3l2.1-.1 1.7-3.3c.3-.6.9-1 1.6-1h3.4c.7 0 1.3.4 1.6 1l1.7 3.3 2.1.1c1.1.2 1.9 1.1 1.9 2.3v2.6c0 .5-.4.9-.9.9H4.1c-.5 0-.9-.4-.9-.9z" fill="${c}" ${S}/><path d="M8.9 11.1l1.2-2.5c.1-.3.4-.4.7-.4h.9v2.9zM12.9 8.2h.9c.3 0 .6.1.7.4l1.2 2.5h-2.8z" fill="#FFF3DE" ${S} stroke-width="1.2"/><circle cx="7.6" cy="17.1" r="2.4" fill="${INK}"/><circle cx="7.6" cy="17.1" r=".9" fill="#E8D8BC"/><circle cx="16.4" cy="17.1" r="2.4" fill="${INK}"/><circle cx="16.4" cy="17.1" r=".9" fill="#E8D8BC"/><circle cx="19.7" cy="13.5" r=".8" fill="#FFE48A"/>`,
  gear: (c) => `<g fill="${INK}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round">${GEAR}</g><g fill="${c}">${GEAR}</g><circle cx="12" cy="12" r="2.7" fill="#F3E3C6" ${S} stroke-width="1.5"/>`,
  play: (c) => `<path d="M8 5.4v13.2a1 1 0 001.5.9l10.2-6.6a1 1 0 000-1.7L9.5 4.5A1 1 0 008 5.4z" fill="${c}" ${S}/>`,
  pause: (c) => `<rect x="6.2" y="5" width="4.2" height="14" rx="1.3" fill="${c}" ${S}/><rect x="13.6" y="5" width="4.2" height="14" rx="1.3" fill="${c}" ${S}/>`,
  prev: (c) => `<path d="M18.4 6.4v11.2a.9.9 0 01-1.4.7l-7-5.6a.9.9 0 010-1.4l7-5.6a.9.9 0 011.4.7z" fill="${c}" ${S}/><rect x="5.4" y="5.8" width="2.8" height="12.4" rx="1.1" fill="${c}" ${S}/>`,
  next: (c) => `<g transform="matrix(-1 0 0 1 24 0)">${IC.prev(c)}</g>`,
  left: (c) => `<path d="M15.6 4.8L8 12l7.6 7.2" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.6 4.8L8 12l7.6 7.2" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  right: (c) => `<g transform="matrix(-1 0 0 1 24 0)">${IC.left(c)}</g>`,
  chev: (c = '#FFF6E6') => `<path d="M6.4 9.4l5.6 5.6 5.6-5.6" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.4 9.4l5.6 5.6 5.6-5.6" fill="none" stroke="${c}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>`,
  close: (c) => `<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="${INK}" stroke-width="5.4" stroke-linecap="round"/><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>`,
  check: (c) => `<path d="M5 12.6l4.4 4.4L19 7.4" fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  map: (c) => `<path d="M3.4 6.6l5.6-2.1 6 2.1 5.6-2.1v12.9l-5.6 2.1-6-2.1-5.6 2.1z" fill="${c}" ${S}/><path d="M9 4.5v12.9M15 6.6v12.9" fill="none" ${S}/>`,
  pin: (c) => `<path d="M12 21.2s-6.2-6.1-6.2-10.8a6.2 6.2 0 0112.4 0c0 4.7-6.2 10.8-6.2 10.8z" fill="${c}" ${S}/><circle cx="12" cy="10.3" r="2.2" fill="#FFF3DE" ${S} stroke-width="1.3"/>`,
  spk: (c) => `<path d="M3.6 9.4h3.3l4.9-4.1c.6-.5 1.5-.1 1.5.7v12c0 .8-.9 1.2-1.5.7l-4.9-4.1H3.6a1 1 0 01-1-1v-3.2a1 1 0 011-1z" fill="${c}" ${S}/>`,
  sound: (c) => `${IC.spk(c)}<path d="M16.4 9.2a4 4 0 010 5.6M19 6.6a7.6 7.6 0 010 10.8" fill="none" ${S} stroke-width="2"/>`,
  soundHalf: (c) => `${IC.spk(c)}<path d="M16.4 9.2a4 4 0 010 5.6" fill="none" ${S} stroke-width="2"/>`,
  mute: (c) => `${IC.spk(c)}<path d="M16.2 9.4l5 5.2M21.2 9.4l-5 5.2" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`,
  help: (c) => `<circle cx="12" cy="12" r="9.6" fill="${c}" ${S}/><text x="12" y="17.4" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="15.5" fill="${INK}">?</text>`,
  note: (c) => `<path d="M9.6 17.4V6.4l9-2.2v11" fill="none" ${S} stroke-width="2"/><ellipse cx="7.2" cy="17.6" rx="2.7" ry="2.2" fill="${c}" ${S}/><ellipse cx="16.2" cy="15.4" rx="2.7" ry="2.2" fill="${c}" ${S}/>`,
  spark: (c) => `<path d="M12 2.8l2.1 6.9 6.9 2.3-6.9 2.2L12 21.2l-2.1-7-6.9-2.2 6.9-2.3z" fill="${c}" ${S}/>`,
  pdf: (c) => `<path d="M6 2.8h8.2L19 7.6v12.6a1 1 0 01-1 1H6a1 1 0 01-1-1V3.8a1 1 0 011-1z" fill="#FBF1DC" ${S}/><path d="M14 2.8v4.8h5" fill="none" ${S}/><rect x="7.2" y="11.6" width="9.6" height="5.4" rx="1.2" fill="${c}" ${S} stroke-width="1.3"/>`,
  slides: (c) => `<rect x="3.2" y="3.8" width="17.6" height="12" rx="1.6" fill="${c}" ${S}/><path d="M7 8.2h6M7 11.4h9" fill="none" stroke="#FFF6E6" stroke-width="1.6" stroke-linecap="round"/><path d="M12 15.8v3.4M8.2 20.8l3.8-1.6 3.8 1.6" fill="none" ${S}/>`,
  download: (c) => `<path d="M12 3.6v10.2M7.4 9.6l4.6 4.6 4.6-4.6" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.2 15.4v3a2 2 0 002 2h11.6a2 2 0 002-2v-3" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  cards: (c) => `<rect x="3.5" y="6.5" width="12" height="15" rx="2" transform="rotate(-10 9.5 14)" fill="#F8F1E0" ${S}/><rect x="8.5" y="3" width="12" height="15" rx="2" transform="rotate(8 14.5 10.5)" fill="${c}" ${S}/>`
};
export const ic = (name, s, c = INK) => { const d = h('span', `display:block;width:${s}px;height:${s}px;flex:none;pointer-events:none`); d.innerHTML = `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="display:block;overflow:visible">${IC[name](c)}</svg>`; return d; };

/* ---------- Federung (unverändert aus R5c) ---------- */
const SPRING = 'cubic-bezier(.3,.7,.4,1)';
export const PHASES = [['Ruhe', 1, 1, 0], ['Hover', 1.05, 1.05, -1], ['Drücken', 1.16, 0.8, 3], ['Loslassen', 0.88, 1.16, -4], ['Nachfedern', 1.07, 0.95, 0], ['Ruhe', 1, 1, 0]];
const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Federung abstimmbar (R5f: ruhiger). hover = Stärke des Hover-Wackelns, wiggle = Icon-Drehung, *Ms = Dauer */
export const FEEL = { hover: 1, hoverMs: 380, wiggle: 1, iconMs: 460, leaveMs: 260, upMs: 460 };
export function deform(el, { icon = null, amp = 1, onClick = null, when = null } = {}) {
  if (onClick) el.addEventListener('click', (e) => { e.stopPropagation(); onClick(e); });
  let a = null, over = false;
  const ok = () => MOTION.on && (!when || when()) && !reduced();
  const s = (x, y, ty = 0) => `translateY(${ty * amp}px) scale(${(1 + (x - 1) * amp).toFixed(3)},${(1 + (y - 1) * amp).toFixed(3)})`;
  const go = (frames, ms, ease = SPRING) => { const cur = getComputedStyle(el).transform; a?.cancel(); a = el.animate([{ transform: cur === 'none' ? s(1, 1) : cur }, ...frames], { duration: ms, easing: ease, fill: 'forwards' }); };
  const rest = () => (over ? s(1.05, 1.05, -1) : s(1, 1));
  el.addEventListener('pointerenter', () => {
    over = true; if (!ok()) return;
    const k = FEEL.hover, w = FEEL.wiggle;
    go([{ transform: s(1 + 0.12 * k, 1 - 0.1 * k), offset: 0.3 }, { transform: s(1 - 0.04 * k, 1 + 0.06 * k, -1), offset: 0.64 }, { transform: rest() }], FEEL.hoverMs);
    const i = typeof icon === 'function' ? icon() : icon;
    i?.animate([{ transform: 'rotate(0)' }, { transform: `rotate(${-9 * w}deg)` }, { transform: `rotate(${7 * w}deg)` }, { transform: `rotate(${-3 * w}deg)` }, { transform: 'rotate(0)' }], { duration: FEEL.iconMs, easing: 'ease-in-out' });
  });
  el.addEventListener('pointerleave', () => { over = false; if (!ok()) { a?.cancel(); return; } go([{ transform: s(1 - 0.03 * FEEL.hover, 1 + 0.03 * FEEL.hover), offset: 0.5 }, { transform: s(1, 1) }], FEEL.leaveMs); });
  el.addEventListener('pointerdown', () => { if (ok()) go([{ transform: s(1.16, 0.8, 3) }], 90, 'ease-out'); });
  el.addEventListener('pointerup', () => { if (ok()) go([{ transform: s(0.88, 1.16, -4), offset: 0.32 }, { transform: s(1.07, 0.95), offset: 0.64 }, { transform: rest() }], FEEL.upMs); });
  return el;
}
const pop = (el) => MOTION.on && !reduced() && el.animate([{ transform: 'scale(.7,1.22)' }, { transform: 'scale(1.1,.92)', offset: 0.5 }, { transform: 'scale(1)' }], { duration: 380, easing: SPRING });
const popIn = (el, from = 'scale(.6,.4)') => MOTION.on && !reduced() && el.animate([{ transform: from, opacity: 0 }, { transform: 'scale(1.03,1.02)', opacity: 1, offset: 0.6 }, { transform: 'scale(1)' }], { duration: 340, easing: SPRING });

/* ---------- Material ---------- */
const WOODURL = plate({}, 'wood', 0).match(/url\("[^"]+"\)/)[0];
const woodBg = (hi, mid, lo) => `background:${WOODURL},linear-gradient(180deg,${hi} 0%,${mid} 55%,${lo} 100%);background-size:360px 140px,100% 100%;background-blend-mode:soft-light,normal`;
const lift = (s) => Math.max(2, Math.round(s / 16));
const woodFace = (s, r) => `${woodBg('#F7E4BE', '#EDCD9A', '#DCB37A')};border-radius:${r}px;box-shadow:inset 0 1.5px 0 rgba(255,255,255,.75),inset 0 -${lift(s)}px 0 rgba(150,100,45,.2),0 ${lift(s)}px 0 #A27536,0 ${lift(s) + 3}px ${lift(s) + 5}px rgba(24,16,8,.28);box-sizing:border-box`;
const lackFace = (s, r, c) => `${woodBg(mix(c, '#fff', 32), c, mix(c, '#000', 16))};border-radius:${r}px;box-shadow:inset 0 1.5px 0 rgba(255,255,255,.55),inset 0 -${lift(s)}px 0 rgba(0,0,0,.14),0 ${lift(s)}px 0 ${mix(c, '#000', 45)},0 ${lift(s) + 3}px ${lift(s) + 5}px rgba(24,16,8,.3);box-sizing:border-box`;
const plakFace = (s, c) => { const ol = Math.max(1.2, s / 30), ring = Math.max(2, Math.round(s * 0.075)), L = lift(s);
  return `background:radial-gradient(circle at 34% 26%,rgba(255,255,255,.95) 0,rgba(255,255,255,0) 42%),#FBF1DC;border-radius:50%;box-shadow:inset 0 0 0 ${ring}px ${c},inset 0 0 0 ${ring + ol}px ${rgba(INK, 0.9)},0 0 0 ${ol}px ${INK},0 ${L}px 0 ${ol}px ${INK};box-sizing:border-box`; };
const keyFace = (s, r, c) => (KEY.style === 'lack' ? lackFace(s, r, c) : KEY.style === 'plakette' ? plakFace(s, c) : woodFace(s, r));
const iconColor = (c) => (KEY.style === 'lack' ? '#FFF6E6' : c);
const well = (T, r) => `background:${GRAIN},linear-gradient(180deg,${T.socket},${T.plaqueLo} 160%);background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;border-radius:${r}px;box-shadow:inset 0 3px 7px rgba(10,6,4,.45),inset 0 -1px 0 rgba(255,255,255,.18);box-sizing:border-box`;
const carved = (r, a = 0.15) => `background:rgba(80,48,16,${a});border-radius:${r}px;box-shadow:inset 0 2px 4px rgba(60,36,14,.38),inset 0 -1px 0 rgba(255,255,255,.42);box-sizing:border-box`;
const paper = (r) => `background:${GRAIN},linear-gradient(180deg,#FBF5E6,#EFE3C8);background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;border-radius:${r}px;box-sizing:border-box`;
const hud = (el) => { el.dataset.hud = '1'; return el; };
const num = (str, size, unitSize, color = INK) => {
  const m = /^(.*?)\s?(m|km)$/.exec(String(str || '')), n = m ? m[1] : String(str || ''), u = m ? m[2] : '';
  return h('span', `display:inline-flex;align-items:baseline;gap:${Math.round(size * 0.1)}px;white-space:nowrap;color:${color};font-variant-numeric:tabular-nums`, [h('span', `font:700 ${size}px/1 ${FN}`, n), u ? h('span', `font:600 ${unitSize}px/1 ${FN}`, u) : null]);
};

/* Taste: ein Stil für alles, wählbar über KEY.style */
export function key(s, name, { color = INK, title = '', k = 0.62, r = null, onClick = null, still = false } = {}) {
  const b = h('button', keyFace(s, r ?? Math.round(s * 0.3), color) + `;width:${s}px;height:${s}px;flex:none;border:0;padding:0;display:grid;place-items:center;cursor:pointer;transform-origin:50% 85%;-webkit-tap-highlight-color:transparent`, ic(name, Math.round(s * (KEY.style === 'plakette' ? k * 0.92 : k)), iconColor(color)));
  b.type = 'button'; if (title) { b.title = title; b.setAttribute('aria-label', title); }
  b.setIcon = (n) => b.firstChild.replaceWith(ic(n, Math.round(s * k), iconColor(color)));
  if (!still) deform(b, { icon: () => b.firstChild, onClick });
  return b;
}
/* Zielwahl-Klapptaste in Pfeilfarbe */
const yFace = (s, c) => { const L = lift(s); return `border-radius:${Math.round(s * 0.32)}px;background:${GRAIN},radial-gradient(circle at 34% 26%,rgba(255,255,255,.55) 0,rgba(255,255,255,0) 46%),linear-gradient(180deg,${mix(c, '#fff', 26)},${c} 58%,${mix(c, '#000', 14)});background-size:140px 140px,100% 100%,100% 100%;background-blend-mode:soft-light,normal,normal;box-shadow:inset 0 1.5px 0 rgba(255,255,255,.55),inset 0 -${L}px 0 rgba(0,0,0,.16),0 ${L}px 0 ${mix(c, '#000', 42)},0 ${L + 3}px ${L + 5}px rgba(24,16,8,.3);box-sizing:border-box`; };
export function ybtn(s, { color = '#E8BC37', onClick = null, still = false } = {}) {
  const b = h('button', yFace(s, color) + `;width:${s}px;height:${s}px;flex:none;border:0;padding:0;display:grid;place-items:center;cursor:pointer;transform-origin:50% 85%;-webkit-tap-highlight-color:transparent`, ic('chev', Math.round(s * 0.62)));
  b.type = 'button'; b.title = 'Ziel wählen'; b.setAttribute('aria-label', 'Ziel wählen');
  b.firstChild.style.transition = 'transform .32s cubic-bezier(.34,1.5,.5,1)';
  b.setOpen = (v) => { b.firstChild.style.transform = v ? 'rotate(180deg)' : ''; };
  b.setColor = (c) => { const keep = b.style.transform; const tmp = h('div', yFace(s, c)); ['background', 'backgroundSize', 'backgroundBlendMode', 'boxShadow'].forEach((p) => { b.style[p] = tmp.style[p]; }); b.style.transform = keep; };
  if (!still) deform(b, { onClick });
  return b;
}

/* ---------- Almanach ---------- */
/* Reihenfolge = Sammelreihenfolge, letzter Eintrag = zuletzt gesammelt. Nur Mirror Neurons ist echt. */
export const DECK = [
  { t: 'Pareto', m: 'comic' }, { t: 'Schrödinger', m: 'mystical' }, { t: 'Kognitive Dissonanz', m: 'absurd' },
  { t: 'The Ass', m: 'comic' }, { t: 'Tomasello', m: 'heroic' }, { t: 'Placebo', m: 'mystical' },
  { t: 'Dunning-Kruger', m: 'absurd' }, { t: 'Ockhams Messer', m: 'tragic' }, { t: 'Tabula Rasa', m: 'forbidden' },
  { t: 'Mirror Neurons', m: 'heroic', src: 'hud-r4/card-mirror-neurons.png' }
];
export function cardFace(c, w, hh) {
  if (c.src) { const im = h('img', 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;pointer-events:none'); im.src = c.src; return im; }
  const col = SM(c.m), u = hh / 100, fs = Math.round(hh * 0.15), ln = Math.max(1, u * 1.1);
  const f = h('div', `position:absolute;inset:0;pointer-events:none;${paper(0)}`);
  f.append(
    h('div', `position:absolute;left:${9 * u}px;top:${8 * u}px;max-width:${w - 34 * u}px;overflow:hidden;font:700 ${fs}px/1.15 ${FN};text-transform:uppercase;letter-spacing:.01em;color:${INK};white-space:nowrap;padding:0 ${Math.round(fs * 0.3)}px;background:linear-gradient(180deg,transparent 22%,${rgba(col, 0.6)} 22%,${rgba(col, 0.6)} 86%,transparent 86%)`, c.t),
    h('div', `position:absolute;right:${8 * u}px;top:${9 * u}px;width:${fs}px;height:${fs}px;border-radius:50%;background:${col};box-shadow:inset 0 0 0 ${ln}px ${INK}`),
    h('div', `position:absolute;left:${5 * u}px;top:${30 * u}px;bottom:${7 * u}px;border-left:${ln}px dashed ${rgba(INK, 0.4)}`),
    h('div', `position:absolute;left:${10 * u}px;top:${30 * u}px;bottom:${8 * u}px;width:${w * 0.44}px;border-radius:${4 * u}px;border:${ln}px solid ${rgba(col, 0.55)};background:repeating-linear-gradient(135deg,${rgba(col, 0.2)} 0 ${5 * u}px,transparent ${5 * u}px ${10 * u}px);box-sizing:border-box`),
    ...[0, 1, 2, 3].map((i) => h('div', `position:absolute;left:${w * 0.44 + 16 * u}px;right:${(i === 3 ? 30 : 9) * u}px;top:${(34 + i * 13) * u}px;height:${4 * u}px;border-radius:${2 * u}px;background:${rgba(INK, i === 0 ? 0.32 : 0.15)}`))
  );
  return f;
}
const cardBox = (c, w, hh, r, sh = true) => h('div', `position:relative;width:${w}px;height:${hh}px;border-radius:${r}px;overflow:hidden;background:#EFE4CC;flex:none;${sh ? `box-shadow:0 ${Math.max(2, hh / 36)}px ${Math.max(5, hh / 12)}px rgba(24,16,8,.42),0 0 0 1px rgba(43,26,11,.2)` : 'box-shadow:0 0 0 1px rgba(43,26,11,.2)'}`, [cardFace(c, w, hh)]);
/* Zu: Stapel, neueste oben. Offen: die letzten sieben fächern unregelmäßig nach unten, neueste oben und ganz sichtbar; darunter „Alle Karten“. */
const FAN_X = [0, 18, -8, 24, 4, -12, 14], FAN_R = [-1.5, 3, -3.5, 2, -2.5, 3.5, -1];
export function almanac(T, Z, { deck = DECK, open = false, show = 7, onCard = null, onAll = null } = {}) {
  const P = Z === SIZES.phone, list = deck.slice(-show).reverse(), m = list.length, ow = Z.openW, oh = Math.round(ow / 1.75), s0 = Z.cw / ow, r = P ? 5 : 9;
  let isOpen = open;
  const root = hud(h('div', `position:relative;width:${Z.cw}px;height:${Z.ch}px;cursor:pointer;-webkit-tap-highlight-color:transparent;transform-origin:50% 90%`));
  root.title = 'Almanach';
  const geo = (k, mode) => {
    if (mode === 'open') return { x: FAN_X[k % 7] * (P ? 0.45 : 1), y: k * Z.openStep, r: FAN_R[k % 7] * (P ? 0.8 : 1), s: 1 };
    const top = Math.min(2, k), f = mode === 'hover' ? 1.9 : 1;
    return { x: [0, -2, 3][top] * f, y: [0, 3, 5][top] * f, r: [0, -5, 4.5][top] * f, s: s0 };
  };
  const tf = (g) => { const cx = (ow * g.s) / 2, cy = (oh * g.s) / 2; return `translate(${g.x}px,${g.y}px) translate(${cx}px,${cy}px) rotate(${g.r}deg) translate(${-cx}px,${-cy}px) scale(${g.s})`; };
  const cards = list.map((c, k) => {
    const inner = cardBox(c, ow, oh, r);
    const outer = hud(h('div', `position:absolute;left:0;top:0;width:${ow}px;height:${oh}px;transform-origin:0 0;z-index:${m - k};transition:transform .52s cubic-bezier(.34,1.4,.5,1)`, [inner]));
    outer.title = c.t;
    inner.addEventListener('pointerenter', () => { if (!isOpen) return; outer.style.zIndex = 50; if (MOTION.on) inner.animate([{ transform: 'none' }, { transform: `translate(${P ? 8 : 16}px,-${P ? 2 : 4}px) scale(1.04) rotate(${-FAN_R[k % 7] * 0.6}deg)` }], { duration: 260, easing: 'cubic-bezier(.34,1.6,.5,1)', fill: 'forwards' }); });
    inner.addEventListener('pointerleave', () => { outer.style.zIndex = m - k; if (MOTION.on) inner.animate([{ transform: getComputedStyle(inner).transform }, { transform: 'none' }], { duration: 220, easing: SPRING, fill: 'forwards' }); else inner.getAnimations().forEach((a) => a.cancel()); });
    inner.addEventListener('click', (e) => { if (!isOpen) return; e.stopPropagation(); onCard?.(c); });
    root.append(outer); return outer;
  });
  const fs = P ? 11 : 17, bh = P ? 26 : 44;
  const more = h('div', woodFace(bh, P ? 7 : 11) + `;position:absolute;left:${P ? 4 : 10}px;top:${(m - 1) * Z.openStep + oh + (P ? 10 : 18)}px;height:${bh}px;display:flex;align-items:center;gap:${P ? 5 : 9}px;padding:0 ${P ? 9 : 16}px;font:600 ${fs}px/1 ${FN};color:${INK};white-space:nowrap;cursor:pointer;transform-origin:20% 85%;transition:opacity .2s,visibility .2s;z-index:0`, [ic('cards', P ? 14 : 22, SM('heroic')), `Alle ${deck.length} Karten`]);
  deform(more, { amp: 0.5, onClick: () => onAll?.() });
  root.append(hud(more));
  const apply = (mode, stagger) => {
    cards.forEach((o, k) => { o.style.transitionDelay = stagger && MOTION.on ? `${(mode === 'open' ? k : m - 1 - k) * 28}ms` : '0ms'; o.style.transitionDuration = MOTION.on ? '' : '0s'; o.style.transform = tf(geo(k, mode)); });
    const vis = mode === 'open'; more.style.opacity = vis ? 1 : 0; more.style.visibility = vis ? 'visible' : 'hidden'; more.style.transitionDelay = vis && stagger ? `${m * 28 + 120}ms` : '0ms';
  };
  apply(isOpen ? 'open' : 'closed', false);
  root.addEventListener('pointerenter', () => { if (!isOpen && MOTION.on) apply('hover', false); });
  root.addEventListener('pointerleave', () => { if (!isOpen) apply('closed', false); });
  const setOpen = (v) => { isOpen = v; apply(v ? 'open' : 'closed', true); };
  deform(root, { amp: 0.6, when: () => !isOpen, onClick: () => setOpen(!isOpen) });
  return { el: root, setOpen, isOpen: () => isOpen };
}

/* ---------- Fluff: Cartoon-Kugeln in Kuhlen, Bestand 0 = leere Kuhle ---------- */
export function fluffBall(f, b, P = false) {
  const ol = P ? 1.2 : Math.max(1.6, b / 14);
  return h('div', `width:${b}px;height:${b}px;flex:none;border-radius:50%;box-sizing:border-box;border:${ol}px solid ${INK};background:radial-gradient(circle at 33% 28%,rgba(255,255,255,.95) 0,rgba(255,255,255,.95) ${P ? 9 : 11}%,rgba(255,255,255,0) ${P ? 22 : 26}%),radial-gradient(circle at 50% 118%,${f.d} 0,${rgba(f.d, 0)} 62%),${f.c};box-shadow:0 ${P ? 1 : 2}px 0 rgba(43,26,11,.35);transform-origin:50% 100%`);
}
const socket = (b, P) => h('div', carved(b, 0.26) + `;width:${b + (P ? 4 : 8)}px;height:${b + (P ? 4 : 8)}px;flex:none;display:grid;place-items:center;border-radius:50%`);
export const FLUFF_COUNTS = [34, 22, 0, 41, 19, 12];
export function fluffCounter(T, Z, { total = 128, counts = FLUFF_COUNTS, numbers = true, onClick = null } = {}) {
  const P = Z === SIZES.phone, showN = numbers && Z.ballN > 0, b = Z.ball;
  const cells = FLUFF.map((f, i) => {
    const zero = counts[i] === 0, s = socket(b, P);
    if (!zero) s.append(deform(fluffBall(f, b, P), { amp: 1.4 }));
    s.title = f.label + (zero ? ' · leer' : ` · ${counts[i]}`);
    if (!showN) return s;
    return h('div', `display:flex;align-items:center;gap:7px;width:${b + 8 + 7 + Math.round(Z.ballN * 1.25)}px`, [s, zero ? null : h('span', `font:700 ${Z.ballN}px/1 ${FN};color:${INK};font-variant-numeric:tabular-nums`, String(counts[i]))]);
  });
  const groove = h('div', `width:2px;align-self:stretch;margin:${P ? 7 : 16}px 0;border-radius:1px;background:rgba(60,36,14,.24);box-shadow:1px 0 0 rgba(255,255,255,.38)`);
  const el = hud(h('div', plate(T, 'wood', Z.r) + `;display:flex;align-items:center;gap:${P ? 6 : 16}px;height:${P ? 28 : Z.row}px;padding:0 ${P ? 8 : 20}px;cursor:pointer;transform-origin:50% 0`, [
    h('span', `font:700 ${Z.total}px/1 ${FN};color:${INK};font-variant-numeric:tabular-nums`, String(total)), groove,
    h('div', `display:flex;align-items:center;gap:${showN ? 8 : (P ? 3 : 10)}px`, cells)
  ]));
  el.title = 'Fluff-Korb';
  deform(el, { amp: 0.25, onClick });
  return el;
}
/* Klick auf den Zähler: Fluff-Korb mit Aufschlüsselung */
export function fluffInfo(T, Z, { total = 128, counts = FLUFF_COUNTS } = {}) {
  const P = Z === SIZES.phone, b = P ? 14 : 26, fs = P ? 12 : 19;
  const rows = FLUFF.map((f, i) => {
    const s = socket(b, P); if (counts[i]) s.append(fluffBall(f, b, P));
    return h('div', `display:flex;align-items:center;gap:${P ? 7 : 12}px;height:${P ? 24 : 40}px`, [s, h('span', `flex:1;font:600 ${fs}px/1 ${FN};color:${INK}`, f.label), h('span', `font:700 ${fs}px/1 ${FN};color:${counts[i] ? INK : SOFT};font-variant-numeric:tabular-nums`, counts[i] ? String(counts[i]) : 'leer')]);
  });
  const el = h('div', plate(T, 'wood', Z.r) + `;display:flex;flex-direction:column;gap:${P ? 2 : 4}px;padding:${P ? '9px 11px' : '18px 22px'};width:${P ? 180 : 320}px;box-sizing:border-box;transform-origin:30% 0`, [
    h('div', `display:flex;align-items:baseline;justify-content:space-between;gap:10px`, [h('span', `font:700 ${P ? 15 : 26}px/1 ${FN};color:${INK}`, 'Fluff-Korb'), num(String(total), P ? 15 : 26, 0)]),
    h('div', `font:500 ${P ? 11 : 16}px/1.3 ${FN};color:${SOFT};margin:${P ? '2px 0 4px' : '4px 0 10px'}`, 'Gesammelter Fluff, nach Story-Mode'),
    ...rows
  ]);
  el.addEventListener('pointerdown', (e) => e.stopPropagation());
  return el;
}

/* ---------- rechts: Tafel = Karte + Zielzeile + Radio ---------- */
export const colWidth = (Z) => Z.mapS + 2 * Z.ip;
const MAP_BASE = {
  terrain: (T) => `<path d="M14 40 C10 22 30 8 52 10 S90 18 90 44 S84 86 56 90 S8 82 10 62 S16 50 14 40Z" fill="${T.plaque}" opacity=".55"/>
    <path d="M14 40 C10 22 30 8 52 10 S90 18 90 44 S84 86 56 90 S8 82 10 62 S16 50 14 40Z" fill="none" stroke="${T.cream}" stroke-width="1.6" opacity=".55"/>
    <ellipse cx="30" cy="34" rx="7" ry="5" fill="${T.socket}" opacity=".75"/><path d="M24 68 l5-9 5 9z" fill="${T.cream}" opacity=".6"/><circle cx="66" cy="64" r="4.5" fill="${T.cream}" opacity=".5"/><rect x="58" y="30" width="8" height="6" rx="1.5" fill="${T.cream}" opacity=".5"/>`,
  track: (T) => `<path d="M18 78 C10 52 22 30 44 26 S82 18 84 44 S70 84 46 82 S22 88 18 78Z" fill="none" stroke="${T.cream}" stroke-width="9" stroke-linecap="round" opacity=".7"/>
    <path d="M18 78 C10 52 22 30 44 26 S82 18 84 44 S70 84 46 82 S22 88 18 78Z" fill="none" stroke="${T.accent}" stroke-width="4.4" stroke-linecap="round"/>`
};
const mapSvg = (T, i, nav, pin) => {
  const has = nav.state !== 'none', arrived = nav.state === 'arrived', pc = arrived ? T.arrive : pin;
  const route = nav.mapKind === 'track' ? 'M48 54 C46 42 50 30 60 23 S70 17 72 17' : 'M48 54 L72 16';
  return `<svg width="${i}" height="${i}" viewBox="0 0 100 100" style="position:absolute;inset:0">${(MAP_BASE[nav.mapKind] || MAP_BASE.terrain)(T)}
    ${has && !arrived ? `<path d="${route}" fill="none" stroke="${pc}" stroke-width="2.8" stroke-linecap="round" stroke-dasharray=".5 5.5"/>` : ''}
    ${has ? `<circle cx="72" cy="16" r="8" fill="none" stroke="${pc}" stroke-width="2.8"/><circle cx="72" cy="16" r="4" fill="${pc}"/>` : ''}
    <path d="M48 54 L41.5 41 A14 14 0 0 1 54.5 41Z" fill="${T.cream}" opacity=".28"/><circle cx="48" cy="54" r="4.4" fill="${T.cream}" stroke="${T.wellTop}" stroke-width="1.2"/></svg>`;
};
export function radio(T, Z, { playlists = ['Inselfunk', 'Werkstatt-Hits', 'Nachtschicht'], song = 'Seetang-Walzer · Die Bojen', animate = true, playing = true, onPlay = null, onDrop = null } = {}) {
  const P = Z === SIZES.phone;
  const run = h('div', `display:flex;gap:${Z.tick * 2.4}px;white-space:nowrap;font:600 ${Z.tick}px/1 ${FN};color:${T.cream};will-change:transform`, [h('span', '', song), h('span', '', song)]);
  const tick = h('div', well(T, Z.r - 5) + `;position:relative;height:${Z.tickH}px;overflow:hidden;display:flex;align-items:center;padding:0 ${P ? 6 : 12}px;flex:1;min-width:0`, [run]);
  let anim = null;
  if (animate && run.animate) { let tries = 0; const go = () => { const w = run.firstChild.offsetWidth + Z.tick * 2.4; if (w > Z.tick * 2.4) { anim = run.animate([{ transform: 'translateX(0)' }, { transform: `translateX(-${w}px)` }], { duration: w * 28, iterations: Infinity }); if (!playing) anim.pause(); } else if (tries++ < 30) requestAnimationFrame(go); }; requestAnimationFrame(go); }
  const setPlaying = (v) => { playing = v; play.setIcon(playing ? 'pause' : 'play'); if (anim) playing ? anim.play() : anim.pause(); };
  const play = key(Z.rk, playing ? 'pause' : 'play', { color: SM('heroic'), title: 'Abspielen / Pause', onClick: () => { setPlaying(!playing); onPlay?.(playing); } });
  if (P) { const w = h('div', `display:flex;align-items:center;gap:${Z.gap}px`, [play, tick]); w.setPlaying = setPlaying; return w; }
  let pi = 0, list = null;
  const label = h('span', 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block', playlists[0]);
  const chev = ic('chev', 16, INK); chev.style.transition = 'transform .32s cubic-bezier(.34,1.5,.5,1)';
  const drop = deform(h('div', carved(Z.r - 5) + `;flex:1;min-width:0;height:${Z.rk}px;display:flex;align-items:center;justify-content:space-between;gap:6px;padding:0 8px 0 12px;font:600 ${Z.drop}px/1 ${FN};color:${INK};cursor:pointer;transform-origin:50% 85%`, [label, chev]), { amp: 0.35, onClick: () => { wrap.setList(!list); if (list) onDrop?.(); } });
  drop.title = 'Playlist wählen';
  /* Aufgeklappt: Liste unter der Tafel, aktuelle Playlist als Holzklotz mit Note */
  const listEl = () => {
    const rows = playlists.map((p, j) => deform(h('div', (j === pi ? woodFace(40, 9) + ';' : '') + `display:flex;align-items:center;gap:10px;height:40px;padding:0 12px;border-radius:9px;font:600 ${Z.drop}px/1 ${FN};color:${INK};cursor:pointer;transform-origin:50% 60%;box-sizing:border-box`, [h('span', 'flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis', p), j === pi ? ic('note', 20, SM('heroic')) : null]), { amp: 0.25, onClick: () => { pi = j; label.textContent = p; pop(label); wrap.setList(false); } }));
    const el = hud(h('div', plate(T, 'wood', Z.r) + `;position:absolute;left:${-Z.ip}px;right:${-Z.ip}px;top:calc(100% + ${Z.ip + 8}px);z-index:30;display:flex;flex-direction:column;gap:2px;padding:8px;transform-origin:50% 0`, [h('div', `font:600 14px/1 ${FN};color:${SOFT};padding:8px 12px 6px`, 'Playlists'), ...rows]));
    el.addEventListener('pointerdown', (e) => e.stopPropagation());
    return el;
  };
  const wrap = h('div', `position:relative;display:flex;flex-direction:column;gap:${Z.gap - 2}px`, [tick, h('div', 'display:flex;align-items:center;gap:8px', [drop, play, key(Z.rk, 'next', { color: SM('heroic'), title: 'Weiter' })])]);
  wrap.setPlaying = setPlaying;
  wrap.setList = (v, quick = false) => {
    if (v && !list) { list = listEl(); wrap.append(list); if (!quick) popIn(list, 'scale(.6,.4)'); chev.style.transform = 'rotate(180deg)'; }
    else if (!v && list) { list.remove(); list = null; chev.style.transform = ''; }
  };
  return wrap;
}
/* Zielzeile: drei Spalten [Pfeil | Mitte | Taste], Außenspalten gleich breit → Entfernung sitzt auf der Tafelmitte.
 * Pfeil eingerückt (Spalte 80 statt 64), damit er bei jeder Drehung innerhalb der Tafel bleibt. Taste in Pfeilfarbe. */
export function instruments(T, Z, { nav = {}, arrowSrc = null, arrowFor = null, pinFor = null, onMenu = null, radio: ro = {}, still = false } = {}) {
  const P = Z === SIZES.phone, i = Z.mapS;
  let N = { state: 'travel', dist: 350, name: 'KFB-Town', mapKind: 'terrain', ...nav }, timer = null;
  const map = h('div', well(T, Z.r - 4) + `;position:relative;width:${i}px;height:${i}px;overflow:hidden`);
  const arr = h('div', `position:relative;width:${Z.aw}px;height:${Z.strip}px`);
  const mid = h('div', `min-width:0;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${P ? 2 : 5}px;text-align:center;cursor:pointer;overflow:visible;white-space:nowrap`);
  const colorOf = () => (N.state === 'arrived' ? T.arrive : pinFor ? pinFor(N.state === 'none' ? 9999 : N.dist) : '#E8794A');
  const yb = ybtn(Z.ybtn, { color: colorOf(), onClick: () => onMenu?.(), still });
  const draw = () => {
    const has = N.state !== 'none', arrived = N.state === 'arrived', pin = pinFor ? pinFor(N.dist) : '#E8794A';
    map.innerHTML = mapSvg(T, i, N, pin); arr.innerHTML = ''; mid.innerHTML = ''; yb.setColor(colorOf());
    const src = has && !arrived ? (arrowFor ? arrowFor(N) : arrowSrc) : null;
    if (arrived) arr.append(h('div', 'position:absolute;inset:0;display:grid;place-items:center', ic('check', Math.round(Z.aw * 0.55), T.arriveLo)));
    else if (src) { const s = Z.arrowSz; const im = h('img', `position:absolute;width:${s}px;height:${s}px;left:${(Z.aw - s) / 2}px;top:${(Z.strip - s) / 2}px;pointer-events:none`); im.src = src; arr.append(im); }
    const nameEl = (c = SOFT) => h('div', `font:600 ${Z.name}px/1.1 ${FN};color:${c}`, N.name);
    if (!has) { if (!P) mid.append(h('div', `font:600 ${Z.name + 1}px/1 ${FN};color:${SOFT}`, 'Ziel wählen')); }
    else if (arrived) { if (!P) mid.append(nameEl(INK)); }
    else { if (N.state === 'set' && !P) mid.append(nameEl()); const d = fmtDist(N.dist); if (d) mid.append(num(d, Z.num, Z.unit)); }
  };
  mid.addEventListener('click', () => { if (N.state === 'travel') { el.setNav({ state: 'set' }); clearTimeout(timer); timer = setTimeout(() => el.setNav({ state: 'travel' }), 3000); } });
  draw();
  const rd = radio(T, Z, ro);
  const groove = h('div', `height:2px;margin:${P ? 2 : 4}px ${P ? 2 : 4}px;border-radius:1px;background:rgba(60,36,14,.22);box-shadow:0 1px 0 rgba(255,255,255,.38)`);
  const el = hud(h('div', plate(T, 'wood', Z.r) + `;display:flex;flex-direction:column;gap:${P ? 4 : 6}px;padding:${Z.ip}px;width:${colWidth(Z)}px`, [
    map, h('div', `display:grid;grid-template-columns:${Z.aw}px minmax(0,1fr) ${Z.aw}px;align-items:center;gap:${P ? 4 : 6}px;height:${Z.strip}px`, [arr, mid, h('div', 'display:flex;justify-content:flex-end', [yb])]), groove, rd
  ]));
  el.yb = yb; el.radio = rd; el.nav = () => N;
  el.setNav = (n, auto = false) => { N = { ...N, ...n }; draw(); pop(mid); if (auto) { clearTimeout(timer); timer = setTimeout(() => el.setNav({ state: 'travel' }), 3500); } };
  el.stripTop = Z.ip + i + (P ? 4 : 6);
  return el;
}
export function tacho(T, Z, { speed = 55, max = 160 } = {}) {
  const s = Z.tacho, p = Math.max(0, Math.min(1, speed / max)), D = 'M23.13 76.87 A38 38 0 1 1 76.87 76.87';
  const w = h('div', well(T, s / 2) + ';position:relative;width:100%;height:100%;border-radius:50%');
  w.innerHTML = `<svg viewBox="0 0 100 100" style="position:absolute;inset:0;width:100%;height:100%"><path d="${D}" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="10" stroke-linecap="round"/><path d="${D}" fill="none" stroke="${T.cream}" stroke-width="10" stroke-linecap="round" pathLength="100" stroke-dasharray="${(p * 100).toFixed(1)} 100"/></svg>`;
  w.append(h('div', `position:absolute;inset:0;display:grid;place-items:center;font:700 ${Math.round(s * 0.32)}px/1 ${FN};color:${T.cream};font-variant-numeric:tabular-nums`, String(Math.round(speed))));
  return hud(h('div', plate(T, 'wood', s / 2) + `;width:${s}px;height:${s}px;padding:${Math.round(s * 0.08)}px;border-radius:50%`, [w]));
}

/* ---------- Zielwahl ---------- */
export const TARGETS = {
  quest: [{ id: 'q1', name: 'KFB-Town', dist: 350, m: 'heroic' }, { id: 'q2', name: 'Bäckerei', dist: 95, m: 'comic' }, { id: 'q3', name: 'Leuchtturm', dist: 1240, m: 'mystical' }],
  place: [{ id: 'p1', name: 'Werkstatt', dist: 620 }, { id: 'p2', name: 'Strand', dist: 210 }]
};
export function targetMenu(T, Z, { sel = 'q1', onPick = null, width = null } = {}) {
  const P = Z === SIZES.phone, W = width || Z.menuW, rh = P ? 32 : 50, fs = P ? 13 : 19;
  const rows = [];
  const row = (t) => {
    const mark = t.m ? h('div', `width:${P ? 11 : 16}px;height:${P ? 11 : 16}px;flex:none;border-radius:50%;box-sizing:border-box;border:${P ? 1 : 1.5}px solid ${INK};background:${SM(t.m)}`) : ic('pin', P ? 14 : 20, '#C9A06A');
    const r = h('div', `display:flex;align-items:center;gap:${P ? 8 : 12}px;height:${rh}px;padding:0 ${P ? 9 : 14}px;border-radius:${P ? 7 : 11}px;cursor:pointer;transform-origin:50% 60%;box-sizing:border-box`, [
      h('div', `width:${P ? 14 : 20}px;display:grid;place-items:center;flex:none`, mark),
      h('div', `flex:1;min-width:0;font:600 ${fs}px/1 ${FN};color:${INK};white-space:nowrap;overflow:hidden;text-overflow:ellipsis`, t.name),
      num(fmtDist(t.dist), P ? 13 : 19, P ? 9 : 13, SOFT)
    ]);
    r.dataset.id = t.id; rows.push(r);
    return deform(r, { amp: 0.25, onClick: () => { sel = t.id; paint(); onPick?.(t); } });
  };
  const tmp = h('div', woodFace(rh, P ? 7 : 11)), PROPS = ['background', 'backgroundSize', 'backgroundBlendMode', 'boxShadow'];
  const paint = () => rows.forEach((r) => { const on = r.dataset.id === sel; PROPS.forEach((p) => { r.style[p] = on ? tmp.style[p] : ''; }); });
  const sec = (t) => h('div', `font:600 ${P ? 10 : 14}px/1 ${FN};color:${SOFT};padding:${P ? '6px 9px 3px' : '10px 14px 4px'}`, t);
  const big = deform(h('div', woodFace(rh, P ? 7 : 11) + `;display:flex;align-items:center;justify-content:center;gap:${P ? 6 : 10}px;height:${rh}px;margin-top:${P ? 6 : 10}px;cursor:pointer;font:600 ${fs}px/1 ${FN};color:${INK};transform-origin:50% 85%`, [ic('map', P ? 16 : 24, '#FFD21F'), 'Große Karte']), { amp: 0.4 });
  const el = hud(h('div', plate(T, 'wood', Z.r) + `;display:flex;flex-direction:column;padding:${P ? 7 : 12}px;width:${W}px;transform-origin:calc(100% - ${Math.round(Z.ybtn / 2) + Z.ip}px) 0`, [
    sec('Quests'), ...TARGETS.quest.map(row), sec('Orte'), ...TARGETS.place.map(row), big
  ]));
  paint();
  el.addEventListener('pointerdown', (e) => e.stopPropagation());
  return el;
}

/* ---------- unten: Aktionsleiste (Mitte) + Einstellungen (links) ---------- */
export const ACTIONS = { bag: { t: 'Rucksack', c: SM('heroic') }, flask: { t: 'Fluff-Alchemie', c: SM('mystical') }, car: { t: 'Fahrzeug rufen', c: '#E0483A' } };
export function actionBar(T, Z, { slots = ['bag', 'flask', 'car'], still = false } = {}) {
  const pv = Math.round((Z.tray - Z.key) / 2);
  return hud(h('div', plate(T, 'wood', Z.r + 2) + `;display:flex;align-items:center;gap:${Z.gap}px;height:${Z.tray}px;padding:0 ${pv}px`,
    slots.filter(Boolean).slice(0, 6).map((k) => key(Z.key, k, { color: ACTIONS[k]?.c, title: ACTIONS[k]?.t, still }))));
}
export const settingsKey = (Z, o = {}) => hud(key(Z.gear, 'gear', { color: '#C98A48', title: 'Einstellungen', ...o }));

/* Schalter: an = Comic-Grün mit Kontur, Holzknopf */
export function toggle(P, on, cb) {
  const w = P ? 42 : 76, hh = P ? 24 : 40, kk = hh - (P ? 6 : 10), ol = P ? 1.2 : 2;
  const knob = h('div', `${woodBg('#F7E4BE', '#EDCD9A', '#DCB37A')};position:absolute;top:${(hh - kk) / 2}px;width:${kk}px;height:${kk}px;border-radius:50%;box-shadow:0 0 0 ${ol}px ${INK},0 2px 0 rgba(43,26,11,.3);transition:left .3s cubic-bezier(.34,1.5,.5,1)`);
  const t = h('div', `position:relative;width:${w}px;height:${hh}px;border-radius:${hh / 2}px;cursor:pointer;flex:none;box-sizing:border-box`, [knob]);
  const paint = () => { const a = on ? `background:${SM('comic')};box-shadow:inset 0 0 0 ${ol}px ${INK},inset 0 3px 5px rgba(0,0,0,.22);border-radius:${hh / 2}px` : carved(hh / 2, 0.24); const tmp = h('div', a); ['background', 'boxShadow'].forEach((p) => { t.style[p] = tmp.style[p]; }); knob.style.left = on ? `${w - kk - (hh - kk) / 2}px` : `${(hh - kk) / 2}px`; };
  paint(); t.addEventListener('click', (e) => { e.stopPropagation(); on = !on; paint(); cb?.(on); });
  t.set = (v) => { on = v; paint(); };
  return t;
}

/* ======================= Overlays ======================= */
function overlayShell(T, Z, { title, sub = '', body, pw, ph, onClose }) {
  const P = Z === SIZES.phone;
  const cs = P ? 32 : 52, xs = Math.round(cs * 0.62);
  const close = h('button', `width:${cs}px;height:${cs}px;flex:none;border:0;padding:0;background:none;display:grid;place-items:center;cursor:pointer;-webkit-tap-highlight-color:transparent`, ic('close', xs, INK));
  close.type = 'button'; close.title = 'Schließen'; close.setAttribute('aria-label', 'Schließen');
  close.addEventListener('pointerenter', () => close.firstChild.replaceWith(ic('close', xs, '#E0483A')));
  close.addEventListener('pointerleave', () => close.firstChild.replaceWith(ic('close', xs, INK)));
  deform(close, { onClick: () => onClose?.() });
  const head = h('div', `display:flex;align-items:center;gap:${P ? 10 : 18}px;flex:none`, [
    h('div', 'flex:1;min-width:0;display:flex;flex-direction:column;gap:4px', [h('div', `font:700 ${P ? 20 : 38}px/1 ${FN};color:${INK}`, title), sub ? h('div', `font:500 ${P ? 12 : 18}px/1.2 ${FN};color:${SOFT}`, sub) : null]), close
  ]);
  const panel = h('div', plate(T, 'wood', P ? 14 : 22) + `;width:${pw}px;height:${ph}px;display:flex;flex-direction:column;gap:${P ? 10 : 20}px;padding:${P ? 12 : 28}px;box-sizing:border-box`, [head, body]);
  const root = h('div', `position:absolute;inset:0;z-index:100;background:rgba(24,14,6,.5);display:grid;place-items:center`, [panel]);
  root.addEventListener('pointerdown', (e) => { e.stopPropagation(); if (e.target === root) onClose?.(); });
  popIn(panel, 'scale(.82,.7)');
  return root;
}

/* Almanach-Ansicht: aufgeklapptes Buch auf Holz. Links die Karte groß, rechts alle Karten. */
export function cardViewer(T, Z, { deck = DECK, idx = deck.length - 1, onClose = null } = {}) {
  const P = Z === SIZES.phone, W = Z.W, H = Z.H, pw = P ? W - 24 : 1440, ph = P ? H - 24 : 860;
  const order = deck.slice().reverse(); let cur = Math.max(0, order.indexOf(deck[idx]));
  const cw = P ? pw - 24 - 24 : 700, chh = Math.round(cw / 1.75);
  const stage = h('div', `position:relative;width:${cw}px;height:${chh}px;flex:none`);
  const cap = h('div', `font:700 ${P ? 15 : 28}px/1.1 ${FN};color:${INK};text-align:center`);
  const meta = h('div', `font:500 ${P ? 11 : 17}px/1 ${FN};color:${SOFT};text-align:center;display:flex;align-items:center;justify-content:center;gap:8px`);
  const thumbs = [];
  const show = (k, anim = true) => {
    cur = (k + order.length) % order.length; const c = order[cur];
    stage.innerHTML = ''; const card = cardBox(c, cw, chh, P ? 8 : 14); stage.append(card); if (anim) popIn(card, 'scale(.92) rotate(-2deg)');
    cap.textContent = c.t; meta.innerHTML = '';
    meta.append(h('span', `width:${P ? 9 : 14}px;height:${P ? 9 : 14}px;border-radius:50%;background:${SM(c.m)};box-shadow:inset 0 0 0 1.3px ${INK}`), `${STORY_MODES[c.m].label} · ${cur + 1} von ${order.length}${cur === 0 ? ' · zuletzt gesammelt' : ''}`);
    thumbs.forEach((t, j) => { t.style.boxShadow = j === cur ? `0 0 0 ${P ? 2 : 3}px ${INK},0 6px 12px rgba(24,16,8,.35)` : ''; t.style.translate = j === cur ? '0 -3px' : '0 0'; });
  };
  const ks = P ? 30 : 48;
  const nav = h('div', `display:flex;align-items:center;justify-content:center;gap:${P ? 12 : 24}px`, [
    key(ks, 'left', { color: SM('heroic'), title: 'Vorherige', onClick: () => show(cur - 1) }), h('div', 'display:flex;flex-direction:column;gap:6px;min-width:0', [cap, meta]), key(ks, 'right', { color: SM('heroic'), title: 'Nächste', onClick: () => show(cur + 1) })
  ]);
  const tw = P ? Math.floor((pw - 24 - 24 - 2 * 8) / 3) : 196, th = Math.round(tw / 1.75);
  const grid = h('div', `display:grid;grid-template-columns:repeat(3,${tw}px);gap:${P ? 8 : 18}px;justify-content:center;align-content:start`, order.map((c, j) => {
    const t = h('div', `border-radius:${P ? 5 : 9}px;cursor:pointer;transition:box-shadow .2s,translate .3s cubic-bezier(.34,1.5,.5,1)`, [cardBox(c, tw, th, P ? 5 : 9, false)]);
    t.title = c.t; thumbs.push(t); return deform(t, { amp: 0.3, onClick: () => show(j) });
  }));
  const pageL = h('div', paper(P ? 10 : 16) + `;flex:${P ? 'none' : '1.35'};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${P ? 12 : 28}px;padding:${P ? 12 : 32}px;box-shadow:inset ${P ? 0 : -18}px ${P ? -10 : 0}px 22px -14px rgba(90,60,25,.45)`, [stage, nav]);
  const pageR = h('div', paper(P ? 10 : 16) + `;flex:1;min-height:0;display:flex;flex-direction:column;gap:${P ? 8 : 18}px;padding:${P ? 12 : 32}px;overflow:auto;box-shadow:inset ${P ? 0 : 18}px ${P ? 10 : 0}px 22px -14px rgba(90,60,25,.45)`, [
    h('div', `font:600 ${P ? 12 : 18}px/1 ${FN};color:${SOFT}`, 'Alle Karten · neueste zuerst'), grid
  ]);
  const book = h('div', `flex:1;min-height:0;display:flex;flex-direction:${P ? 'column' : 'row'};gap:${P ? 8 : 6}px`, [pageL, pageR]);
  show(cur, false);
  return overlayShell(T, Z, { title: 'Almanach', sub: `${deck.length} Karten gesammelt`, body: book, pw, ph, onClose });
}

/* Einstellungen: nur Spiel-Einstellungen. Sprache Standard English. */
const MODES = Object.keys(CARTOON);
export const SETTINGS = [
  { id: 'spiel', t: 'Spiel', rows: [['seg', 'Sprache', ['English', 'Deutsch'], 0], ['tog', 'Untertitel', true], ['sld', 'Kamera-Tempo', 55]] },
  { id: 'grafik', t: 'Grafik', rows: [['seg', 'Qualität', ['Niedrig', 'Mittel', 'Hoch'], 2], ['tog', 'Schatten', true], ['sld', 'Sichtweite', 70]] },
  { id: 'ton', t: 'Ton', rows: [['sld', 'Gesamt', 80], ['sld', 'Musik', 60], ['sld', 'Effekte', 75], ['sld', 'Stimmen', 90]] },
  { id: 'steuer', t: 'Steuerung', rows: [['cap', 'Rufe', 'R'], ['cap', 'Almanach', 'A'], ['cap', 'Karte', 'M'], ['cap', 'Rucksack', '1'], ['cap', 'Fluff-Alchemie', '2'], ['cap', 'Fahrzeug rufen', '3']] },
  { id: 'zugang', t: 'Barrierefreiheit', rows: [['seg', 'Schriftgröße', ['Normal', 'Groß', 'Sehr groß'], 0], ['tog', 'HUD federt', true, 'motion'], ['tog', 'Starker Kontrast', false]] }
];
export function settingsOverlay(T, Z, { tab = 'spiel', onClose = null } = {}) {
  const P = Z === SIZES.phone, W = Z.W, H = Z.H, pw = P ? W - 24 : 1240, ph = P ? H - 24 : 800;
  const F = P ? { lab: 13, val: 12, tab: 12, row: 42, gap: 10 } : { lab: 23, val: 19, tab: 21, row: 72, gap: 18 };
  const slider = (v, c = SM('heroic')) => {
    const w = P ? 120 : 380, th = P ? 8 : 14, kk = P ? 18 : 32, ol = P ? 1.2 : 2;
    const fill = h('div', `position:absolute;left:0;top:0;bottom:0;border-radius:${th / 2}px;background:${c};box-shadow:inset 0 0 0 ${ol}px ${INK}`);
    const knob = h('div', `${woodBg('#F7E4BE', '#EDCD9A', '#DCB37A')};position:absolute;top:${(th - kk) / 2}px;width:${kk}px;height:${kk}px;margin-left:${-kk / 2}px;border-radius:50%;box-shadow:0 0 0 ${ol}px ${INK},0 2px 0 rgba(43,26,11,.3)`);
    const track = h('div', carved(th / 2, 0.24) + `;position:relative;width:${w}px;height:${th}px;cursor:pointer;flex:none;touch-action:none`, [fill, knob]);
    const out = h('span', `width:${P ? 22 : 40}px;text-align:right;font:700 ${F.val}px/1 ${FN};color:${INK};font-variant-numeric:tabular-nums`);
    const set = (x) => { v = Math.round(Math.max(0, Math.min(100, x))); fill.style.width = v + '%'; knob.style.left = v + '%'; out.textContent = v; };
    const at = (e) => { const r = track.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); };
    track.addEventListener('pointerdown', (e) => { track.setPointerCapture(e.pointerId); at(e); });
    track.addEventListener('pointermove', (e) => { if (track.hasPointerCapture(e.pointerId)) at(e); });
    set(v); return h('div', `display:flex;align-items:center;gap:${P ? 8 : 16}px`, [track, out]);
  };
  const choice = (opts, sel, { dots = false, wrap = false } = {}) => {
    const items = [];
    const box = h('div', (wrap ? '' : carved(P ? 7 : 12, 0.2) + ';') + `display:flex;${wrap ? 'flex-wrap:wrap;' : ''}gap:${P ? 4 : 8}px;padding:${wrap ? 0 : P ? 3 : 5}px`, opts.map((o, j) => {
      const it = h('div', `display:flex;align-items:center;gap:${P ? 5 : 8}px;height:${P ? 26 : 44}px;padding:0 ${P ? 9 : 18}px;border-radius:${P ? 6 : 10}px;font:600 ${F.val}px/1 ${FN};color:${INK};cursor:pointer;white-space:nowrap;box-sizing:border-box;transform-origin:50% 85%`, [dots ? h('span', `width:${P ? 9 : 14}px;height:${P ? 9 : 14}px;border-radius:50%;background:${SM(MODES[j])};box-shadow:inset 0 0 0 1.3px ${INK}`) : null, o]);
      items.push(it); return deform(it, { amp: 0.3, onClick: () => { sel = j; paint(); } });
    }));
    const on = h('div', woodFace(44, P ? 6 : 10)), off = h('div', wrap ? carved(P ? 6 : 10, 0.18) : '');
    const paint = () => items.forEach((it, j) => { const src = j === sel ? on : off; ['background', 'backgroundSize', 'backgroundBlendMode', 'boxShadow'].forEach((p) => { it.style[p] = src.style[p]; }); });
    paint(); return box;
  };
  const keycap = (k) => h('div', woodFace(P ? 26 : 46, P ? 6 : 10) + `;min-width:${P ? 28 : 48}px;height:${P ? 28 : 48}px;padding:0 ${P ? 6 : 12}px;display:grid;place-items:center;font:700 ${F.val + 2}px/1 ${FN};color:${INK};cursor:pointer`, k);
  const btn = (t) => deform(h('div', woodFace(P ? 30 : 52, P ? 7 : 12) + `;height:${P ? 30 : 52}px;padding:0 ${P ? 12 : 24}px;display:inline-flex;align-items:center;font:600 ${F.val}px/1 ${FN};color:${INK};cursor:pointer;transform-origin:50% 85%`, t), { amp: 0.4 });
  const rowEl = (r) => {
    const [kind, label, a, b, c] = r, lab = h('div', `flex:1;min-width:0;font:600 ${F.lab}px/1.15 ${FN};color:${INK}`, label);
    const line = `border-bottom:2px solid rgba(60,36,14,.14);box-shadow:0 1px 0 rgba(255,255,255,.3)`;
    if (kind === 'pick') return h('div', `display:flex;flex-direction:column;gap:${P ? 7 : 12}px;padding:${P ? 9 : 16}px 0;${line}`, [lab, choice(a, b, { dots: c === 'dots', wrap: true })]);
    if (kind === 'btn') return h('div', `display:flex;padding:${P ? 10 : 18}px 0`, [btn(label)]);
    const ctl = kind === 'tog' ? (b === 'motion' ? toggle(P, MOTION.on, (v) => { MOTION.on = v; }) : toggle(P, a)) : kind === 'sld' ? slider(a) : kind === 'seg' ? choice(a, b) : keycap(a);
    return h('div', `display:flex;align-items:center;gap:${F.gap}px;min-height:${F.row}px;${line}`, [lab, ctl]);
  };
  const content = h('div', carved(P ? 10 : 16, 0.12) + `;flex:1;min-height:0;min-width:0;overflow:auto;scrollbar-color:#A27536 transparent;padding:${P ? '4px 12px 8px' : '12px 32px 20px'}`);
  const tabs = [];
  const open = (id) => {
    const s = SETTINGS.find((x) => x.id === id) || SETTINGS[0]; tab = s.id; content.innerHTML = '';
    s.rows.forEach((r) => content.append(rowEl(r)));
    tabs.forEach((t) => { const on = t.dataset.id === tab, tmp = h('div', on ? woodFace(44, P ? 6 : 10) : ''); ['background', 'backgroundSize', 'backgroundBlendMode', 'boxShadow'].forEach((p) => { t.style[p] = tmp.style[p]; }); });
  };
  const tabEl = (s) => {
    const t = h('div', `display:flex;align-items:center;gap:${P ? 5 : 10}px;height:${P ? 26 : 52}px;padding:0 ${P ? 9 : 18}px;border-radius:${P ? 6 : 10}px;font:600 ${F.tab}px/1 ${FN};color:${INK};cursor:pointer;white-space:nowrap;box-sizing:border-box;transform-origin:50% 85%`, [s.t]);
    t.dataset.id = s.id; tabs.push(t); return deform(t, { amp: 0.25, onClick: () => open(s.id) });
  };
  const nav = h('div', P ? `display:flex;flex-wrap:wrap;gap:4px;flex:none` : `display:flex;flex-direction:column;gap:6px;width:280px;flex:none`, SETTINGS.map(tabEl));
  const body = h('div', `flex:1;min-height:0;display:flex;flex-direction:${P ? 'column' : 'row'};gap:${P ? 10 : 24}px`, [nav, content]);
  open(tab);
  return overlayShell(T, Z, { title: 'Einstellungen', body, pw, ph, onClose });
}

/* Info („?“): Spiel und Decks nach AIDA mit Gumroad-Taste, darunter Credits. Texte Entwurf, Credits-Liste von WS0. */
export const GUMROAD = 'https://georgvw.gumroad.com/?section=V4n4XYemvn1-_RTR-Oew8A==#V4n4XYemvn1-_RTR-Oew8A==';
export const CREDITS = [
  { n: 'Kenney', what: 'Tower Defense Kit · UFOs, beam', url: 'https://kenney.nl', hub: 'kenney.nl' },
  { n: 'Kay Lousberg · KayKit', what: 'Character animations, Mystery Series · Black Knight, Combat Mech', url: 'https://kaylousberg.com', hub: 'kaylousberg.com' },
  { n: 'Quaternius', what: 'Arrow · reference for our rebuild', url: 'https://quaternius.com', hub: 'quaternius.com' },
  { n: 'eeee', what: "Rick's UFO", url: null, hub: 'link to follow' }
];
export function infoOverlay(T, Z, { onClose = null } = {}) {
  const P = Z === SIZES.phone, W = Z.W, H = Z.H, pw = P ? W - 24 : 1240, ph = P ? H - 24 : 800;
  const F = P ? { h1: 22, lead: 13, h2: 16, body: 12, small: 11, gap: 18 } : { h1: 48, lead: 22, h2: 30, body: 19, small: 16, gap: 44 };
  const txt = (s, css) => h('div', `color:${INK};text-wrap:pretty;font:${css}`, s);
  const cw = P ? 160 : 340, card = cardBox(DECK[DECK.length - 1], cw, Math.round(cw / 1.75), P ? 7 : 12);
  card.style.rotate = '3deg';
  const hero = h('div', `display:flex;${P ? 'flex-direction:column;align-items:flex-start' : 'align-items:center'};gap:${P ? 14 : 48}px`, [
    h('div', `flex:1;min-width:0;display:flex;flex-direction:column;gap:${P ? 6 : 14}px`, [
      txt('Kayfabizarro', `600 ${F.small}px/1 ${FN};color:${SOFT}`),
      txt('Every story here is staged.', `700 ${F.h1}px/1.05 ${FN}`),
      txt('FrizzleBob shows you around a world that believes its own plot. Walk, drive and fly across it, collect Fluff in six story modes, and pick up Almanac cards that explain what just happened to you.', `500 ${F.lead}px/1.4 ${FN}`)
    ]), card
  ]);
  const chip = (icn, c, t) => h('div', carved(P ? 7 : 11, 0.16) + `;display:flex;align-items:center;gap:${P ? 6 : 10}px;height:${P ? 28 : 48}px;padding:0 ${P ? 10 : 18}px;font:600 ${F.body}px/1 ${FN};color:${INK};white-space:nowrap`, [ic(icn, P ? 15 : 26, c), t]);
  const bh = P ? 42 : 64;
  const buy = h('a', lackFace(bh, P ? 9 : 14, SM('heroic')) + `;display:inline-flex;align-items:center;gap:${P ? 8 : 14}px;height:${bh}px;padding:0 ${P ? 14 : 28}px;font:700 ${P ? 14 : 24}px/1 ${FN};color:${INK};text-decoration:none;cursor:pointer;transform-origin:50% 85%;align-self:flex-start`, [ic('download', P ? 18 : 30, INK), 'Get the decks on Gumroad']);
  buy.href = GUMROAD; buy.target = '_blank'; buy.rel = 'noopener';
  deform(buy, { amp: 0.5 });
  const decks = h('div', paper(P ? 10 : 16) + `;display:flex;flex-direction:column;gap:${P ? 10 : 18}px;padding:${P ? 14 : 32}px;box-shadow:0 2px 0 rgba(43,26,11,.22),0 0 0 1px rgba(43,26,11,.14)`, [
    txt('The decks behind the cards', `700 ${F.h2}px/1.1 ${FN}`),
    txt('Every Almanac card comes from a KFB deck. The decks are available as printable PDFs and as slide decks.', `500 ${F.body}px/1.4 ${FN}`),
    h('div', `display:flex;flex-wrap:wrap;gap:${P ? 6 : 12}px`, [chip('pdf', SM('forbidden'), 'PDF · print & play'), chip('slides', SM('tragic'), 'Slides · for talks')]),
    buy
  ]);
  const credit = (c) => {
    const link = c.url ? deform(h('a', woodFace(P ? 28 : 44, P ? 7 : 10) + `;display:inline-flex;align-items:center;height:${P ? 28 : 44}px;padding:0 ${P ? 10 : 18}px;font:600 ${F.small}px/1 ${FN};color:${INK};text-decoration:none;white-space:nowrap;align-self:${P ? 'flex-start' : 'center'};transform-origin:50% 85%`, c.hub + ' ↗'), { amp: 0.4 }) : h('span', `align-self:center;font:500 ${F.small}px/1 ${FN};color:${SOFT}`, c.hub);
    if (c.url) { link.href = c.url; link.target = '_blank'; link.rel = 'noopener'; }
    return h('div', `display:grid;grid-template-columns:${P ? 'minmax(0,1fr)' : 'minmax(0,1fr) auto'};gap:${P ? 8 : 12}px ${P ? 10 : 24}px;padding:${P ? 12 : 22}px 0;border-bottom:2px solid rgba(60,36,14,.14)`, [
      h('div', `display:flex;flex-direction:column;gap:${P ? 4 : 8}px;min-width:0`, [txt(c.n, `700 ${F.body + (P ? 1 : 3)}px/1.1 ${FN}`), txt(c.what, `500 ${F.small}px/1.3 ${FN};color:${SOFT}`)]),
      link,
      h('div', `grid-column:1/-1;font:500 ${F.small}px/1.3 ${FN};color:${SOFT};border:1.5px dashed rgba(60,36,14,.35);border-radius:${P ? 6 : 10}px;padding:${P ? '6px 9px' : '10px 14px'}`, 'FrizzleBob’s hat tip · WS0')
    ]);
  };
  const credits = h('div', 'display:flex;flex-direction:column', [
    txt('Credits', `700 ${F.h2}px/1.1 ${FN}`),
    txt('Hat tips to the creators whose work this world is built on.', `500 ${F.body}px/1.4 ${FN};color:${SOFT};margin-top:${P ? 6 : 10}px`),
    ...CREDITS.map(credit)
  ]);
  const body = h('div', carved(P ? 10 : 16, 0.12) + `;flex:1;min-height:0;overflow:auto;scrollbar-color:#A27536 transparent;display:flex;flex-direction:column;gap:${F.gap}px;padding:${P ? '16px 12px 20px' : '40px 56px 48px'}`, [hero, decks, credits]);
  return overlayShell(T, Z, { title: 'Info', body, pw, ph, onClose });
}

/* ======================= Bild-Komposition ======================= */
/* cfg: { form, T, scene, bg, nav, arrowFor, pinFor, deck, cardsOpen, menuOpen, fluffOpen, settingsOpen, settingsTab, viewerOpen, infoOpen, sound:{music,sfx}, soundOpen, playlistOpen, fluffNumbers, speed, slots, animate } */
export function buildFrame(cfg) {
  const Z = SIZES[cfg.form] || SIZES.desk, P = cfg.form === 'phone', T = cfg.T, W = Z.W, H = Z.H, pad = Z.pad;
  const el = h('div', `position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${T.sky};font-family:${FN};-webkit-font-smoothing:antialiased;user-select:none`);
  const B = bgLayer(W, H, cfg.bg); if (B.el) el.append(B.el);
  const place = (node, css) => { node.style.position = 'absolute'; node.style.cssText += ';' + css; el.append(node); return node; };
  let ov = null;
  const overlay = (node) => { ov?.remove(); ov = node; if (node) el.append(node); };
  const closeOv = () => overlay(null);
  const deck = cfg.deck || DECK;
  const viewer = (c) => { al.setOpen(false); overlay(cardViewer(T, Z, { deck, idx: c ? deck.indexOf(c) : deck.length - 1, onClose: closeOv })); };
  const settings = (tab) => overlay(settingsOverlay(T, Z, { tab, onClose: closeOv }));
  const info = () => overlay(infoOverlay(T, Z, { onClose: closeOv }));
  const snd = { music: true, sfx: true, ...(cfg.sound || {}) };

  /* Telefon: Fluff ganz oben, Almanach-Stapel darunter */
  const fluffH = P ? 28 : Z.row, almTop = P ? pad + fluffH + Z.gap : pad;
  let fi = null;
  const fluffPop = (open, quick = false) => {
    if (open && !fi) { fi = fluffInfo(T, Z, {}); fi.style.zIndex = 30; place(fi, P ? `left:${pad}px;top:${pad + fluffH + Z.gap}px` : `left:50%;top:${pad + Z.row + Z.gap}px;margin-left:-160px`); if (!quick) popIn(fi, 'scale(.7,.4)'); }
    else if (!open && fi) { fi.remove(); fi = null; }
  };
  const fl = fluffCounter(T, Z, { numbers: cfg.fluffNumbers !== false, onClick: () => fluffPop(!fi) });
  if (P) place(fl, `left:${pad}px;top:${pad}px`); else place(fl, `left:50%;top:${pad}px;translate:-50% 0`);

  const inst = instruments(T, Z, { nav: cfg.nav, arrowFor: cfg.arrowFor, pinFor: cfg.pinFor, radio: { animate: cfg.animate !== false, playing: snd.music, onPlay: (on) => { if (on && !snd.music) { snd.music = true; syncSnd(); } }, onDrop: () => menu(false) }, onMenu: () => menu(!menuEl) });
  place(inst, `right:${pad}px;top:${pad}px`);
  if (cfg.scene === 'drive') place(tacho(T, Z, { speed: cfg.speed ?? 55 }), `right:${pad + colWidth(Z) - Math.round(Z.tacho * 0.16)}px;top:${pad}px`);

  const bar = actionBar(T, Z, { slots: cfg.slots || (cfg.scene === 'drive' ? ['bag', 'flask'] : ['bag', 'flask', 'car']) });
  place(bar, `left:50%;bottom:${pad}px;translate:-50% 0`);

  /* rechts unten übereinander: Ton · Info · Einstellungen.
   * Ton antippen = alles aus/an. Hover (Maus) bzw. langes Drücken (Touch) = Fenster Musik/Effekte.
   * Ton aus + Radio abspielen = nur Musik an, Effekte bleiben aus. */
  const kb = pad + (Z.tray - Z.gear) / 2, sb = kb + 2 * (Z.gear + Z.gap);
  place(settingsKey(Z, { onClick: () => settings('spiel') }), `right:${pad}px;bottom:${kb}px`);
  place(hud(key(Z.gear, 'help', { color: SM('absurd'), title: 'Info', onClick: () => info() })), `right:${pad}px;bottom:${kb + Z.gear + Z.gap}px`);
  const sIcon = () => (snd.music && snd.sfx ? 'sound' : !snd.music && !snd.sfx ? 'mute' : 'soundHalf');
  let fly = null, flyT = null, longT = null, longFired = false, lastMusic = snd.music;
  const sk = hud(key(Z.gear, sIcon(), { color: SM('tragic'), title: 'Ton an/aus', onClick: () => { if (longFired) { longFired = false; return; } const on = !(snd.music || snd.sfx); snd.music = snd.sfx = on; syncSnd(); } }));
  const syncSnd = () => { sk.setIcon(sIcon()); fly?.sync(); if (snd.music !== lastMusic) { lastMusic = snd.music; inst.radio.setPlaying(snd.music); } };
  const flyH = P ? 74 : 124;
  const flyOpen = (v, quick = false) => {
    if (v && !fly) {
      const row = (icn, c, lab, k) => { const t = toggle(P, snd[k], (on) => { snd[k] = on; syncSnd(); }); t.k = k; return [h('div', `display:flex;align-items:center;gap:${P ? 7 : 12}px;height:${P ? 30 : 50}px`, [ic(icn, P ? 15 : 26, c), h('span', `flex:1;font:600 ${P ? 12 : 19}px/1 ${FN};color:${INK};white-space:nowrap`, lab), t]), t]; };
      const rows = [row('note', SM('heroic'), 'Musik', 'music'), row('spark', SM('absurd'), 'Effekte', 'sfx')];
      fly = hud(h('div', plate(T, 'wood', Z.r) + `;display:flex;flex-direction:column;justify-content:center;gap:${P ? 2 : 4}px;height:${flyH}px;width:${P ? 128 : 240}px;padding:0 ${P ? 10 : 18}px;box-sizing:border-box;transform-origin:100% 50%;z-index:40`, rows.map((r) => r[0])));
      fly.sync = () => rows.forEach(([, t]) => t.set(snd[t.k]));
      fly.addEventListener('pointerdown', (e) => e.stopPropagation());
      fly.addEventListener('pointerenter', () => clearTimeout(flyT));
      fly.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'mouse') return; clearTimeout(flyT); flyT = setTimeout(() => flyOpen(false), 320); });
      place(fly, `right:${pad + Z.gear + Z.gap}px;bottom:${sb + (Z.gear - flyH) / 2}px`);
      if (!quick) popIn(fly, 'scale(.5,.7)');
    } else if (!v && fly) { fly.remove(); fly = null; }
  };
  sk.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'mouse') return; clearTimeout(flyT); flyT = setTimeout(() => flyOpen(true), 220); });
  sk.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'mouse') return; clearTimeout(flyT); flyT = setTimeout(() => flyOpen(false), 320); });
  sk.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') return; longT = setTimeout(() => { longFired = true; flyOpen(true); }, 450); });
  ['pointerup', 'pointercancel'].forEach((ev) => sk.addEventListener(ev, () => clearTimeout(longT)));
  place(sk, `right:${pad}px;bottom:${sb}px`);

  const al = almanac(T, Z, { deck, open: !!cfg.cardsOpen, onCard: (c) => viewer(c), onAll: () => viewer(null) });
  place(al.el, `left:${pad}px;top:${almTop}px`);
  al.el.style.zIndex = 20;

  let menuEl = null;
  const menuTop = pad + inst.stripTop + Z.strip + (P ? 4 : 8);
  const menu = (open, quick = false) => {
    if (open && !menuEl) {
      inst.radio.setList?.(false);
      const cur = [...TARGETS.quest, ...TARGETS.place].find((t) => t.name === inst.nav().name);
      menuEl = targetMenu(T, Z, { sel: cur?.id, width: P ? W - 2 * pad : null, onPick: (t) => { inst.setNav({ state: 'set', dist: t.dist, name: t.name }, true); setTimeout(() => menu(false), 240); } });
      place(menuEl, `right:${pad}px;top:${menuTop}px`);
      if (!quick) popIn(menuEl, 'scale(.5,.3)');
      inst.yb.setOpen(true);
    } else if (!open && menuEl) {
      const m = menuEl; menuEl = null; inst.yb.setOpen(false);
      if (MOTION.on) m.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.6,.4)', opacity: 0 }], { duration: 180, easing: 'ease-in' }).onfinish = () => m.remove(); else m.remove();
    }
  };
  if (cfg.menuOpen) menu(true, true);
  if (cfg.fluffOpen) fluffPop(true, true);
  el.addEventListener('pointerdown', (e) => {
    if (menuEl && !inst.yb.contains(e.target)) menu(false);
    if (al.isOpen() && !al.el.contains(e.target)) al.setOpen(false);
    if (fi && !fl.contains(e.target)) fluffPop(false);
    if (!inst.contains(e.target)) inst.radio.setList?.(false);
    if (fly && !sk.contains(e.target)) flyOpen(false);
  });
  if (cfg.playlistOpen) inst.radio.setList?.(true, true);
  if (cfg.soundOpen) flyOpen(true, true);
  if (cfg.settingsOpen) overlay(settingsOverlay(T, Z, { tab: cfg.settingsTab || 'spiel', onClose: closeOv }));
  if (cfg.viewerOpen) overlay(cardViewer(T, Z, { deck, onClose: closeOv }));
  if (cfg.infoOpen) overlay(infoOverlay(T, Z, { onClose: closeOv }));
  return { el, W, H, Z };
}

/* R5e-Zugriff */
export { woodBg, woodFace, lackFace, plakFace, carved, paper, well, popIn, pop, SM, INK, SOFT, mix, rgba, overlayShell, cardBox, IC, hud, plate, lift };
