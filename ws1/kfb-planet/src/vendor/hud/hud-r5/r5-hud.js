/* KFB HUD R5 · Waschgang. DESIGN ONLY (V-228): Look-Bauteile, kein Spielcode.
 * Eine Grammatik: jede Ecke ein Objekt, eine Plattenhöhe, ein Radius, eine Schrift (Fredoka, gemischte Schreibung).
 * Material 'wood' (Sperrholz, Empfehlung) oder 'clay' (Knete aus R4). Knöpfe, Mulden, Fluff bleiben Knete.
 * Zielpfeil = kleines 3D-Objekt in der Navigationstafel unter der Minikarte, nicht mehr in der Welt.
 */
import { h, icon, GRAIN, clayCss, wellCss, bgLayer, measureCoverage } from '../hud-r4/r4-hud.js';
import { fmtDist } from '../hud-r4/r4-theme.js';
export { h, bgLayer, measureCoverage };

export const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap';
export const FN = "'Fredoka','Nunito',system-ui,sans-serif";

export const SIZES = {
  desk: { W: 1920, H: 1080, pad: 32, gap: 10, row: 64, r: 12, knob: 52, cardH: 52, step: 8, mapS: 232, cup: 64, arrow: 84, call: 88, radio: 64, tacho: 136, num: 32, unit: 20, name: 17, total: 34, dot: 22, dotN: 18, openW: 188, openStep: 118 },
  phone: { W: 390, H: 693, pad: 12, gap: 6, row: 44, r: 9, knob: 34, cardH: 34, step: 5, mapS: 88, cup: 34, arrow: 46, call: 56, radio: 40, tacho: 76, num: 18, unit: 12, name: 11, total: 18, dot: 11, dotN: 0, openW: 96, openStep: 41 }
};
export const CARD_RATIO = 1.75;
/* Sechs Fluff-Farben: Platzhalter, bis die Spielregel die Farben festlegt */
export const FLUFF = [
  { id: 'rosa', c: '#EE86AE' }, { id: 'orange', c: '#F2A052' }, { id: 'gelb', c: '#EFCF4E' },
  { id: 'gruen', c: '#86C766' }, { id: 'blau', c: '#68AEE6' }, { id: 'lila', c: '#AE86DE' }
];

/* ---------- Holz: ruhige Maserung, hell, Schrift direkt darauf ---------- */
function noisePng(w, hh, fn) {
  const c = document.createElement('canvas'); c.width = w; c.height = hh; const g = c.getContext('2d'), d = g.createImageData(w, hh);
  let s = 4242; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const v = fn(x, y, r) | 0, i = (y * w + x) * 4; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  g.putImageData(d, 0, 0); return 'url("' + c.toDataURL('image/png') + '")';
}
const WOOD = noisePng(360, 140, (x, y, r) => { const w = Math.sin((y + Math.sin(x * 0.018) * 5 + Math.sin(x * 0.006 + y * 0.08) * 3) * 0.5) * 0.5 + Math.sin(y * 1.3 + x * 0.008) * 0.2; return 138 + w * 34 + (r() - 0.5) * 14; });

export const WOODC = { hi: '#E6C392', mid: '#D7AE77', lo: '#BE9259', edge: '#86602F', ink: '#2B1A0B', inkSoft: '#5A3E20' };
export const ink = (T, M) => (M === 'wood' ? WOODC.ink : T.ink);
export const inkSoft = (T, M) => (M === 'wood' ? WOODC.inkSoft : T.inkSoft);

export const plate = (T, M, r) => M === 'wood'
  ? `background:${WOOD},linear-gradient(180deg,${WOODC.hi} 0%,${WOODC.mid} 55%,${WOODC.lo} 100%);background-size:360px 140px,100% 100%;background-blend-mode:soft-light,normal;border-radius:${r}px;box-shadow:inset 0 1px 0 rgba(255,255,255,.45),inset 0 -2px 0 rgba(90,55,20,.12),0 3px 0 ${WOODC.edge},0 8px 14px rgba(24,16,8,.24);box-sizing:border-box`
  : clayCss(T, `${r + 2}px`);
const cup = (T, M, r) => `background:linear-gradient(180deg,${M === 'wood' ? '#EADCC2' : T.plaqueHi},${M === 'wood' ? '#F6EEDF' : T.cream});border-radius:${r}px;box-shadow:inset 0 2px 5px rgba(60,38,16,.38),inset 0 -1px 0 rgba(255,255,255,.5);box-sizing:border-box`;
const ball = (c, s) => `width:${s}px;height:${s}px;flex:none;border-radius:50%;background:${GRAIN},radial-gradient(circle at 36% 30%,rgba(255,255,255,.75) 0,rgba(255,255,255,0) 42%),${c};background-size:140px 140px,100% 100%,auto;background-blend-mode:soft-light,normal,normal;box-shadow:0 ${Math.max(1, s / 10)}px 0 rgba(0,0,0,.22),inset 0 -${Math.max(1, s / 8)}px ${s / 6}px rgba(0,0,0,.14)`;
const mapWell = (T, r) => `background:${GRAIN},linear-gradient(180deg,${T.socket},${T.plaqueLo} 160%);background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;border-radius:${r}px;box-shadow:inset 0 3px 7px rgba(10,6,4,.45),inset 0 -1px 0 rgba(255,255,255,.18);box-sizing:border-box`;
const hud = (el) => { el.dataset.hud = '1'; return el; };

/* Knet-Knopf, nur Icon. tone: accent | cream */
export function knob(T, s, iconName, { tone = 'accent', title = '' } = {}) {
  const c = tone === 'cream' ? { hi: '#FFFDF6', mid: T.cream, lo: T.plaqueHi, socket: T.socket, ink: T.ink } : { hi: T.accentHi, mid: T.accent, lo: T.accentLo, socket: T.accentSocket, ink: T.accentInk };
  const b = h('button', clayCss(T, '50%', { hi: c.hi, mid: c.mid, lo: c.lo, socket: c.socket, lift: Math.max(2, Math.round(s / 20)) }) + `;width:${s}px;height:${s}px;flex:none;border:0;padding:0;display:grid;place-items:center;color:${c.ink};cursor:pointer;transition:transform .08s`, icon(iconName, Math.round(s * 0.46)));
  b.type = 'button'; if (title) { b.title = title; b.setAttribute('aria-label', title); }
  b.addEventListener('pointerdown', () => { b.style.transform = 'translateY(2px)'; });
  ['pointerup', 'pointerleave'].forEach((e) => b.addEventListener(e, () => { b.style.transform = ''; }));
  return b;
}
const num = (str, size, unitSize, color) => {
  const m = /^(.*?)\s?(m|km)$/.exec(String(str || '')), n = m ? m[1] : String(str || ''), u = m ? m[2] : '';
  return h('span', `display:inline-flex;align-items:baseline;gap:${Math.round(size * 0.1)}px;white-space:nowrap;color:${color};font-variant-numeric:tabular-nums`, [h('span', `font:700 ${size}px/1 ${FN}`, n), u ? h('span', `font:600 ${unitSize}px/1 ${FN}`, u) : null]);
};

/* ---------- Karten: bündig, ohne Rand, gerade gestapelt ---------- */
const card = (src, w, hh, r, css = '') => {
  const c = h('div', `position:absolute;width:${w}px;height:${hh}px;border-radius:${r}px;overflow:hidden;background:#EFE4CC;box-shadow:${Math.max(1, w / 60).toFixed(1)}px ${Math.max(1, w / 70).toFixed(1)}px ${Math.max(2, w / 30).toFixed(1)}px rgba(24,16,8,.38);${css}`);
  if (src) { const im = h('img', 'display:block;width:100%;height:100%;object-fit:cover'); im.src = src; c.append(im); }
  return c;
};
/* Sammlung oben links: Rucksack-Knopf + Almanach-Stapel auf einer Platte */
export function collection(T, M, Z, { cards = [], open = false } = {}) {
  const P = Z === SIZES.phone, n = Math.min(5, cards.length || 5), ch = Z.cardH, cw = Math.round(ch * CARD_RATIO), r = P ? 3 : 5;
  const stackW = cw + Z.step * (n - 1), ip = Math.round((Z.row - Z.knob) / 2);
  const stack = h('div', `position:relative;flex:none;width:${stackW}px;height:${ch}px`);
  if (!open) for (let k = n - 1; k >= 0; k--) stack.append(card(cards[k] || cards[0], cw, ch, r, `left:${k * Z.step}px;top:0`));
  const el = h('div', plate(T, M, Z.r) + `;display:flex;align-items:center;gap:${Z.gap}px;height:${Z.row}px;padding:0 ${ip + 2}px 0 ${ip}px`, [knob(T, Z.knob, 'bag', { title: 'Rucksack' }), stack]);
  hud(el);
  if (!open) return { el, fan: null };
  /* aufgeklappt: Stapel fächert gerade nach rechts auf, neueste vorn, ältere überlappt */
  const m = Math.min(P ? 5 : 7, cards.length || 7), ow = Z.openW, oh = Math.round(ow / CARD_RATIO);
  const fan = h('div', `position:absolute;width:${ow + Z.openStep * (m - 1)}px;height:${oh}px`);
  for (let k = m - 1; k >= 0; k--) fan.append(card(cards[k] || cards[0], ow, oh, P ? 4 : 7, `left:${k * Z.openStep}px;top:0`));
  return { el, fan: hud(fan), fanH: oh };
}

/* Fluff oben Mitte: Gesamtzahl + sechs Farbpunkte (Zahl je Farbe optional) */
export function fluffCounter(T, M, Z, { total = 128, counts = [34, 22, 0, 41, 19, 12], numbers = true } = {}) {
  const P = Z === SIZES.phone, showN = numbers && !P && Z.dotN > 0, k = ink(T, M);
  const dots = h('div', `display:flex;align-items:center;gap:${showN ? 16 : (P ? 5 : 9)}px`, FLUFF.map((f, i) => {
    const zero = counts[i] === 0;
    const d = h('div', ball(f.c, showN ? Z.dot : Math.round(Z.dot * (P ? 1 : 0.9))) + (zero ? ';opacity:.32;filter:saturate(.4)' : ''));
    return showN ? h('div', 'display:flex;align-items:center;gap:6px', [d, h('span', `font:600 ${Z.dotN}px/1 ${FN};color:${k};font-variant-numeric:tabular-nums;min-width:1.3em;opacity:${zero ? 0.5 : 1}`, String(counts[i]))]) : d;
  }));
  const groove = h('div', `width:2px;align-self:stretch;margin:${P ? 8 : 14}px 0;border-radius:1px;background:rgba(60,36,14,.22);box-shadow:1px 0 0 rgba(255,255,255,.35)`);
  const H = P ? 32 : Z.row;
  return hud(h('div', plate(T, M, Z.r) + `;display:flex;align-items:center;gap:${P ? 8 : 16}px;height:${H}px;padding:0 ${P ? 10 : 20}px`, [h('span', `font:700 ${Z.total}px/1 ${FN};color:${k};font-variant-numeric:tabular-nums`, String(total)), groove, dots]));
}

/* Navigation oben rechts: Minikarte + 3D-Pfeil in der Schale + Entfernung (Name optional) */
export function navBoard(T, M, Z, { dist = 350, name = 'Werkstatt', showName = false, arrowSrc = null, arrived = false } = {}) {
  const P = Z === SIZES.phone, i = Z.mapS, ip = P ? 6 : 8, d = arrived ? null : fmtDist(dist), k = ink(T, M);
  const tc = arrived ? T.arrive : T.target;
  const svg = `<svg width="${i}" height="${i}" viewBox="0 0 100 100" style="position:absolute;inset:0">
    <path d="M18 78 C10 52 22 30 44 26 S82 18 84 44 S70 84 46 82 S22 88 18 78Z" fill="none" stroke="${T.cream}" stroke-width="9" stroke-linecap="round" opacity=".7"/>
    <path d="M18 78 C10 52 22 30 44 26 S82 18 84 44 S70 84 46 82 S22 88 18 78Z" fill="none" stroke="${T.accent}" stroke-width="4.4" stroke-linecap="round"/>
    <path d="M48 52 C46 40 50 28 60 22 S70 16 72 16" fill="none" stroke="${T.cream}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray=".5 5.5"/>
    <circle cx="72" cy="16" r="7.5" fill="none" stroke="${tc}" stroke-width="2.6"/><circle cx="72" cy="16" r="3.8" fill="${tc}"/>
    <path d="M48 47 L55 61 L48 57.5 L41 61Z" fill="${T.cream}" stroke="${T.wellTop}" stroke-width="1" stroke-linejoin="round"/></svg>`;
  const map = h('div', mapWell(T, Z.r - 3) + `;position:relative;width:${i}px;height:${i}px;overflow:hidden`, [h('div', 'position:absolute;inset:0')]);
  map.firstChild.innerHTML = svg;
  const c = h('div', mapWell(T, Z.r - 3) + `;position:relative;width:${Z.cup}px;height:${Z.cup}px;flex:none`);
  if (arrived) c.append(h('div', 'position:absolute;inset:0;display:grid;place-items:center', icon('check', Math.round(Z.cup * 0.56), T.arrive)));
  else if (arrowSrc) { const im = h('img', `position:absolute;width:${Z.arrow}px;height:${Z.arrow}px;left:${(Z.cup - Z.arrow) / 2}px;top:${(Z.cup - Z.arrow) / 2 - Z.cup * 0.06}px;pointer-events:none`); im.src = arrowSrc; c.append(im); }
  const txt = h('div', `display:flex;flex-direction:column;align-items:flex-end;justify-content:center;gap:${P ? 2 : 5}px;min-width:0;flex:1`, [
    showName && !P ? h('div', `font:600 ${Z.name}px/1 ${FN};color:${inkSoft(T, M)};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%`, name) : null,
    d ? num(d, Z.num, Z.unit, k) : null
  ]);
  const strip = h('div', `display:flex;align-items:center;gap:${Z.gap}px;height:${Z.cup}px;padding-right:${P ? 2 : 6}px`, [c, txt]);
  return hud(h('div', plate(T, M, Z.r) + `;display:flex;flex-direction:column;gap:${ip}px;padding:${ip}px`, [map, strip]));
}

export function callKnob(T, Z) { return hud(knob(T, Z.call, 'speech', { tone: 'cream', title: 'Rufe (R / gedrückt halten)' })); }
export function radioKnob(T, Z) { return hud(knob(T, Z.radio, 'note', { title: 'Radio' })); }

export function tacho(T, M, Z, { speed = 55, max = 160 } = {}) {
  const s = Z.tacho, p = Math.max(0, Math.min(1, speed / max)), a = (135 + 270 * p) * Math.PI / 180;
  const D = 'M23.13 76.87 A38 38 0 1 1 76.87 76.87';
  const well = h('div', wellCss(T, '50%') + ';position:relative;width:100%;height:100%');
  well.innerHTML = `<svg viewBox="0 0 100 100" style="position:absolute;inset:0;width:100%;height:100%"><path d="${D}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="10" stroke-linecap="round"/><path d="${D}" fill="none" stroke="${T.accent}" stroke-width="10" stroke-linecap="round" pathLength="100" stroke-dasharray="${(p * 100).toFixed(1)} 100"/><circle cx="${(50 + 38 * Math.cos(a)).toFixed(1)}" cy="${(50 + 38 * Math.sin(a)).toFixed(1)}" r="5" fill="${T.cream}"/></svg>`;
  well.append(h('div', `position:absolute;inset:0;display:grid;place-items:center;font:700 ${Math.round(s * 0.3)}px/1 ${FN};color:${T.cream};font-variant-numeric:tabular-nums`, String(Math.round(speed))));
  return hud(h('div', plate(T, M, s / 2) + `;width:${s}px;height:${s}px;padding:${Math.round(s * 0.07)}px`, [well]));
}

/* ======================= Bild-Komposition ======================= */
/* cfg: { form, T, M, scene:'walk'|'drive', bg, ring:{src,sx,sy,w}, dist, name, showName, arrowSrc, arrived, cards, cardsOpen, fluffNumbers, speed } */
export function buildFrame(cfg) {
  const Z = SIZES[cfg.form] || SIZES.desk, P = cfg.form === 'phone', T = cfg.T, M = cfg.M || 'wood', W = Z.W, H = Z.H, pad = Z.pad;
  const el = h('div', `position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${T.sky};font-family:${FN};-webkit-font-smoothing:antialiased;user-select:none`);
  const B = bgLayer(W, H, cfg.bg); if (B.el) el.append(B.el);
  if (cfg.ring) { const [x, y] = B.map(cfg.ring.sx, cfg.ring.sy), w = cfg.ring.w * B.k; const im = h('img', `position:absolute;left:${x - w / 2}px;top:${y - w * 0.86 / 2}px;width:${w}px`); im.src = cfg.ring.src; el.append(im); }
  const place = (node, css) => { node.style.position = 'absolute'; node.style.cssText += ';' + css; el.append(node); return node; };
  const col = collection(T, M, Z, { cards: cfg.cards, open: !!cfg.cardsOpen });
  place(col.el, `left:${pad}px;top:${pad}px`);
  if (col.fan) place(col.fan, `left:${pad}px;top:${pad + Z.row + Z.gap + (P ? 32 + Z.gap : 4)}px`);
  const fl = fluffCounter(T, M, Z, { numbers: cfg.fluffNumbers !== false });
  if (P) place(fl, `left:${pad}px;top:${pad + Z.row + Z.gap}px`); else place(fl, `left:50%;top:${pad}px;transform:translateX(-50%)`);
  place(navBoard(T, M, Z, { dist: cfg.dist ?? 350, name: cfg.name, showName: !!cfg.showName, arrowSrc: cfg.arrowSrc, arrived: !!cfg.arrived }), `right:${pad}px;top:${pad}px`);
  place(callKnob(T, Z), `right:${pad}px;bottom:${pad}px`);
  if (cfg.scene === 'drive') {
    place(radioKnob(T, Z), `right:${pad + Z.call + Z.gap + 4}px;bottom:${pad + (Z.call - Z.radio) / 2}px`);
    place(tacho(T, M, Z, { speed: cfg.speed ?? 55 }), `left:${pad}px;bottom:${pad}px`);
  }
  return { el, W, H, Z };
}
