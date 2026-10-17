/* KFB HUD R5e · Aktionen, Rucksack, Kayfabrication. DESIGN ONLY (V-228): Look-Bauteile, kein Spielcode.
 * Baut auf r5d-hud.js auf (Tafel, Almanach, Fenster, Tasten). Neu:
 *  - Icon-Set für Waffen-Paare, Fortbewegung, Kontext-Items, Interagieren
 *  - Aktionsleiste: [Waffen-Paar] [Fortbewegungs-Paar] [Kontext-Platz] [Interagieren], Paar = zwei gleich große Tasten auf farbigem Sockel
 *  - Fortbewegungs-Fenster (Gehen, Fahren, Fliegen | Teleport, Ruhestein)
 *  - Rucksack unten links + Fenster (20 Fächer, rechts großes Bild und Text)
 *  - Fluff: Flug in den Slot, Einrasten, Zähler; alle 6 ≥ 1 → Kayfabricate-Hinweis; Korb mit „Kayfabricate…“
 *  - Kayfabrication-Fenster: Karte wählen → Fluff einfüllen → Kayfabrizieren → Karte
 */
import * as D from './r5d-hud.js';
export * from './r5d-hud.js';
const { h, FN, SIZES, MOTION, KEY, IC, ic, deform, key, woodBg, woodFace, lackFace, plakFace, carved, paper, well, popIn, pop, SM, INK, SOFT, mix, overlayShell, cardBox, FLUFF, fluffBall, DECK, plate, hud, toggle } = D;

const S = `stroke="${INK}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"`;
const CR = '#FFF6E6';
const ln = (d, c, w = 2.4) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 2.4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const spk = (x, y, r, c = '#FFE48A') => { const a = +(r * 0.32).toFixed(2), b = +(r * 0.68).toFixed(2); return `<path d="M${x} ${y - r}l${a} ${b} ${b} ${a}-${b} ${a}-${a} ${b}-${a}-${b}-${b}-${a} ${b}-${a}z" fill="${c}" ${S} stroke-width="1"/>`; };
const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Icon-Set ---------- */
Object.assign(IC, {
  fist: (c) => `<path d="M5.6 10.4c0-1.6 1.2-2.8 2.8-2.8h7.4c1.8 0 3.2 1.4 3.2 3.2v4.6c0 3.4-2.8 6.2-6.2 6.2h-1.6c-3.1 0-5.6-2.5-5.6-5.6z" fill="${c}" ${S}/><path d="M9.2 7.7v3.6M12.4 7.6v3.7M15.6 7.7v3.6" fill="none" ${S}/><path d="M5.7 12.4h5.6a1.9 1.9 0 010 3.8H8.6" fill="${c}" ${S}/><path d="M16.4 16.8a3.6 3.6 0 01-2 1.8" fill="none" stroke="${CR}" stroke-width="1.5" stroke-linecap="round"/>`,
  wrestle: (c) => `<path d="M12 2.8c4.6 0 7.6 3.6 7.6 8.6 0 5.4-3.4 9.8-7.6 9.8s-7.6-4.4-7.6-9.8c0-5 3-8.6 7.6-8.6z" fill="${c}" ${S}/><path d="M6.6 10.4c1.5-1.4 3.6-1.2 4.5.6-1.1 1.7-3.4 1.8-4.5-.6zM17.4 10.4c-1.5-1.4-3.6-1.2-4.5.6 1.1 1.7 3.4 1.8 4.5-.6z" fill="${CR}" ${S} stroke-width="1.3"/><ellipse cx="12" cy="16.4" rx="2.3" ry="1.6" fill="${CR}" ${S} stroke-width="1.3"/>${spk(12, 6.2, 2.3)}`,
  sword: (c) => `<path d="M9 13.6L18.8 3.6h1.8v1.8L10.6 15.2z" fill="#EEF2F7" ${S}/><path d="M12.6 9.8l1.6 1.6" stroke="#AEBBCB" stroke-width="1.2" stroke-linecap="round"/><rect x="5.4" y="13.4" width="7.6" height="2.8" rx="1.2" transform="rotate(45 9.2 14.8)" fill="${c}" ${S}/>${ln('M7.2 16.8l-2.4 2.4', '#A06A38', 2)}<circle cx="3.9" cy="20.1" r="1.7" fill="${c}" ${S}/>`,
  swordX: (c) => `${ln('M2.8 10.2A9.6 9.6 0 0110.4 2.6', c, 1.5)}${ln('M21.4 13.8a9.6 9.6 0 01-7.6 7.6', c, 1.5)}${IC.sword(c)}${spk(20.4, 20, 2.1)}`,
  blaster: (c) => `<path d="M3.2 9.4c0-1.6 1.3-2.9 2.9-2.9h8.4l3.4 1.7h2.6v4.4h-2.6l-3.4 1.7H9.6l-1.1 5.6a1 1 0 01-1 .8H5.3a1 1 0 01-1-1.2l.9-5A2.9 2.9 0 013.2 12z" fill="${c}" ${S}/><path d="M11.2 6.6v7.6M13.6 6.6v7.6" fill="none" ${S} stroke-width="1.4"/><circle cx="21.4" cy="10.4" r="1.4" fill="#FFE48A" ${S} stroke-width="1.2"/><path d="M5.6 8.8h3" stroke="${CR}" stroke-width="1.5" stroke-linecap="round"/>`,
  rocket: (c) => `<g transform="rotate(42 12 12)"><path d="M12 2.4c3 2 4.6 5.4 4.6 9.2v4.4H7.4v-4.4c0-3.8 1.6-7.2 4.6-9.2z" fill="${c}" ${S}/><circle cx="12" cy="9.4" r="2" fill="${CR}" ${S} stroke-width="1.4"/><path d="M7.4 12.4l-2.8 2.9v3.1l2.8-1.6zM16.6 12.4l2.8 2.9v3.1l-2.8-1.6z" fill="${c}" ${S}/><path d="M9.6 16h4.8l-.8 3.2-1.6 2.6-1.6-2.6z" fill="#FFB43A" ${S}/></g>`,
  wand: (c) => `${ln('M4.4 19.6l8.8-8.8', '#9A6232', 2.4)}<path d="M4.4 19.6l1.4-1.4" stroke="${CR}" stroke-width="2.4" stroke-linecap="round"/><path d="M16.2 2.6l1.5 3.3 3.6.4-2.7 2.4.8 3.6-3.2-1.9-3.2 1.9.8-3.6-2.7-2.4 3.6-.4z" fill="${c}" ${S}/>${spk(20.4, 15, 1.9)}${spk(9.4, 5.2, 1.6)}`,
  magicX: (c) => `<circle cx="12" cy="12.6" r="7.2" fill="${c}" ${S}/><path d="M8.6 13.4a3.5 3.5 0 016-2.4 2.1 2.1 0 01-2.7 3.1" fill="none" stroke="${CR}" stroke-width="1.8" stroke-linecap="round"/><circle cx="9.2" cy="9.4" r="1.2" fill="${CR}" opacity=".85"/>${spk(4.2, 4.6, 2.5)}${spk(20.2, 18.8, 2.1)}${spk(19.8, 4.4, 1.6)}`,
  sprint: (c) => `<path d="M7.6 7.8h4l1.4 3.6 5.4 1.5c1.8.5 3 2 3 3.8v.5H7a1.6 1.6 0 01-1.6-1.6V10c0-1.2 1-2.2 2.2-2.2z" fill="${c}" ${S}/><path d="M5.4 17.2h16v1.2a1 1 0 01-1 1h-14a1 1 0 01-1-1z" fill="${CR}" ${S}/><path d="M13.2 12.2l-1.4 1.8M15.6 12.9l-1.4 1.8" fill="none" ${S} stroke-width="1.3"/><path d="M1.2 10.4h2.6M.8 13.4h3M1.2 16.4h1.8" stroke="${INK}" stroke-width="1.7" stroke-linecap="round"/>`,
  turbo: (c) => `<path d="M13 2.6c.8 3.2 5 5 5 10a5.6 5.6 0 01-11.2 0c0-2.6 1.3-4 2.6-5.2.2 1.7.9 2.8 2 3.2 0-3.2.6-5.6 1.6-8z" fill="${c}" ${S}/><path d="M12.4 13c1.1 1.1 2.2 2 2.2 3.4a2.2 2.2 0 01-4.4 0c0-1.3.9-2.2 2.2-3.4z" fill="#FFE48A" ${S} stroke-width="1.2"/><path d="M1.8 8.8h3M1 12.2h3.4M1.8 15.6h3" stroke="${INK}" stroke-width="1.7" stroke-linecap="round"/>`,
  walk: (c) => `<path d="M8.2 2.6c1.8 0 2.8 1.8 2.8 4.2 0 2.2-1 3.8-2.6 3.8S5.6 9.2 5.6 7c0-2.6 1-4.4 2.6-4.4z" fill="${c}" ${S}/><ellipse cx="8.6" cy="13.4" rx="2.1" ry="1.6" fill="${c}" ${S}/><path d="M15.8 8.6c1.8 0 2.8 1.8 2.8 4.2 0 2.2-1 3.8-2.6 3.8s-2.8-1.4-2.8-3.6c0-2.6 1-4.4 2.6-4.4z" fill="${c}" ${S}/><ellipse cx="16.2" cy="19.4" rx="2.1" ry="1.6" fill="${c}" ${S}/>`,
  fly: (c) => `<path d="M2.8 14.2C5 8.6 10.6 4.8 19.4 4c-1 2.2-2.6 3.6-4.6 4.4 2 .1 3.6-.2 5-.8-1.2 2.6-3.6 4-6.4 4.6 1.7.2 3 0 4.2-.4-1.9 3-5.2 4.6-9 4.6-2.1 0-4-.8-5.8-2.2z" fill="${c}" ${S}/><path d="M6.6 13.2c3-2.6 6.2-4.2 9.6-5" fill="none" stroke="${CR}" stroke-width="1.4" stroke-linecap="round"/><path d="M4 19.8h6M12.6 19.8h2" stroke="${INK}" stroke-width="1.7" stroke-linecap="round"/>`,
  teleport: (c) => `<ellipse cx="12" cy="12" rx="8.4" ry="9.4" fill="${c}" ${S}/><ellipse cx="12" cy="12.6" rx="5.4" ry="6.4" fill="${CR}" ${S}/><ellipse cx="12" cy="13.2" rx="2.6" ry="3.4" fill="${c}" ${S}/>${spk(20.4, 3.8, 2.1)}`,
  home: (c) => `<path d="M5.4 10c0-4 3-6.8 6.6-6.8s6.6 2.8 6.6 6.8v8.2a2.8 2.8 0 01-2.8 2.8H8.2a2.8 2.8 0 01-2.8-2.8z" fill="${c}" ${S}/><path d="M8.6 13.6L12 10.4l3.4 3.2v3.8H8.6z" fill="${CR}" ${S} stroke-width="1.4"/><path d="M7.8 7.4a4.6 4.6 0 012.6-2.2" fill="none" stroke="${CR}" stroke-width="1.5" stroke-linecap="round"/>`,
  potion: (c) => `<rect x="9.6" y="2" width="4.8" height="2.8" rx=".9" fill="#C58B4E" ${S}/><path d="M10.2 4.8h3.6v2.6a7.2 7.2 0 11-3.6 0z" fill="${c}" ${S}/><path d="M7.4 13.4a4.6 4.6 0 012.2-3.8" fill="none" stroke="${CR}" stroke-width="1.6" stroke-linecap="round"/><path d="M12 18.4l-2.5-2.4a1.6 1.6 0 012.5-2 1.6 1.6 0 012.5 2z" fill="${CR}" ${S} stroke-width="1.1"/>`,
  bomb: (c) => `<circle cx="10.6" cy="14" r="7" fill="${c}" ${S}/><rect x="11.4" y="5" width="4.4" height="3.4" rx=".9" transform="rotate(40 13.6 6.7)" fill="#8C7A66" ${S}/><path d="M15.4 5.4c1.2-1.6 2.8-2 4-1.2" fill="none" ${S}/><circle cx="7.8" cy="11.2" r="1.8" fill="${CR}" opacity=".75"/>${spk(20.6, 3.4, 2.3, '#FFD21F')}`,
  costume: (c) => `<path d="M7.6 4.4c0-.6.4-1 1-1h6.8c.6 0 1 .4 1 1v10.8H7.6z" fill="${c}" ${S}/><rect x="7.6" y="11.2" width="8.8" height="2.4" fill="${CR}" ${S} stroke-width="1.3"/><path d="M3.2 16.4c0-.8.7-1.2 1.4-1.2h14.8c.7 0 1.4.4 1.4 1.2s-.7 1.6-1.4 1.6H4.6c-.7 0-1.4-.6-1.4-1.6z" fill="${c}" ${S}/><path d="M9.6 5.4v4" stroke="${CR}" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>`,
  mushroom: (c) => `<path d="M3.2 12.2C3.2 7 7.2 3.4 12 3.4s8.8 3.6 8.8 8.8c0 .8-.6 1.2-1.4 1.2H4.6c-.8 0-1.4-.4-1.4-1.2z" fill="${c}" ${S}/><circle cx="8.4" cy="8.6" r="1.6" fill="${CR}"/><circle cx="14.6" cy="6.8" r="1.2" fill="${CR}"/><circle cx="16.6" cy="10.4" r="1.4" fill="${CR}"/><path d="M9 13.4h6l.6 5.8a1.8 1.8 0 01-1.8 2h-3.6a1.8 1.8 0 01-1.8-2z" fill="#FFF3DE" ${S}/>`,
  candy: (c) => `<path d="M7.4 10.2L3 7.4v9.2l4.4-2.8zM16.6 10.2L21 7.4v9.2l-4.4-2.8z" fill="${c}" ${S}/><circle cx="12" cy="12" r="5.2" fill="${c}" ${S}/><path d="M9.2 9.4a5.2 5.2 0 014.6 7.6M8.2 12.8a3.6 3.6 0 002.2 3.4" fill="none" stroke="${CR}" stroke-width="1.7" stroke-linecap="round"/>`,
  interact: (c) => `<path d="M12 3.2c4.8 0 8.6 3.2 8.6 7.4S16.8 18 12 18c-.9 0-1.8-.1-2.6-.3l-4.2 2.8 1.2-3.9C4.6 15.2 3.4 13 3.4 10.6 3.4 6.4 7.2 3.2 12 3.2z" fill="${c}" ${S}/><circle cx="12" cy="7.3" r="1.35" fill="${INK}"/><rect x="10.85" y="9.4" width="2.3" height="5.4" rx="1.15" fill="${INK}"/>`
});

/* ---------- Familien: Primär = c, Spezial = s (eine Stufe satter) ---------- */
export const FAM = {
  fist: { t: 'Faust', c: '#EE6B3B', s: '#C94E22', p: ['fist', 'Schlag'], x: ['wrestle', 'Wrestling-Spezial'] },
  sword: { t: 'Schwert', c: '#5A93D6', s: '#3A6FB4', p: ['sword', 'Schwerthieb'], x: ['swordX', 'Klingen-Wirbel'] },
  blaster: { t: 'Blaster', c: '#22B3A3', s: '#118A7C', p: ['blaster', 'Blaster'], x: ['rocket', 'Rakete'] },
  magic: { t: 'Magie', c: '#B06AD9', s: '#8A45B8', p: ['wand', 'Zauber'], x: ['magicX', 'Magie-Spezial'] },
  loco: { t: 'Fortbewegung', c: '#6FBF4A', s: '#4C9630' }
};
export const WEAPONS = ['fist', 'sword', 'blaster', 'magic'];
export const MODES = { walk: ['walk', 'Gehen'], drive: ['car', 'Fahren'], fly: ['fly', 'Fliegen'], teleport: ['teleport', 'Teleport'], home: ['home', 'Ruhestein'] };
export const CTX = { potion: ['potion', 'Heiltrank', '#E84F6A'], bomb: ['bomb', 'Cartoon-Bombe', '#46506E'], costume: ['costume', 'Kostüm', '#7B62C9'], mushroom: ['mushroom', 'Pilz', '#D9452F'], candy: ['candy', 'Bonbon', '#FFB43A'] };

/* Tönung: Holz leicht (Primär 14 %, Spezial 30 %) · Lack in der Farbe · Plakette Ring + getöntes Papier */
const W0 = woodBg('#F7E4BE', '#EDCD9A', '#DCB37A');
const mixL = (c, w, p) => `color-mix(in oklab, ${c}, ${w} ${p}%)`;
const tintFace = (s, r, c, lv) => {
  if (KEY.style === 'lack') return lackFace(s, r, c);
  if (KEY.style === 'plakette') return plakFace(s, c).replace('#FBF1DC', mixL('#FBF1DC', c, lv ? 26 : 12));
  const p = lv ? 30 : 14; return woodFace(s, r).replace(W0, woodBg(mixL('#F7E4BE', c, p), mixL('#EDCD9A', c, p), mixL('#DCB37A', c, p + 6)));
};
const restyle = (el, css) => { const t = h('div', css); ['background', 'backgroundSize', 'backgroundBlendMode', 'boxShadow', 'borderRadius'].forEach((p) => { el.style[p] = t.style[p]; }); };
export function fkey(s, name, c, lv, o = {}) { const b = key(s, name, { color: c, ...o }); restyle(b, tintFace(s, Math.round(s * 0.3), c, lv)); return b; }
const sockCss = (c, P) => `${woodBg(mix(c, '#000', 2), mix(c, '#000', 10), mix(c, '#000', 22))};border-radius:${P ? 11 : 20}px;box-shadow:inset 0 3px 5px rgba(0,0,0,.3),inset 0 -1px 0 rgba(255,255,255,.35),0 1px 0 rgba(255,255,255,.4);padding:${P ? 2 : 4}px;display:flex;gap:${P ? 3 : 6}px;box-sizing:border-box;flex:none`;
export function famPair(Z, F, a, b, { still = false, onA = null, onB = null } = {}) {
  const P = Z === SIZES.phone, s = Z.key;
  const ka = fkey(s, a[0], F.c, 0, { title: a[1], still, onClick: () => onA?.(ka) });
  const kb = fkey(s, b[0], F.s, 1, { title: b[1], still, onClick: () => onB?.(kb) });
  return h('div', sockCss(F.c, P), [ka, kb]);
}
const caret = (P) => { const d = h('span', `position:absolute;top:${P ? -4 : -6}px;right:${P ? -4 : -6}px;width:${P ? 13 : 22}px;height:${P ? 13 : 22}px;border-radius:50%;background:#FBF1DC;box-shadow:0 0 0 ${P ? 1 : 1.6}px ${INK};display:grid;place-items:center;pointer-events:none`, [ic('chev', P ? 9 : 15, INK)]); d.firstChild.style.transform = 'rotate(180deg)'; return d; };

/* ---------- Aktionsleiste ---------- */
export function actionBar(T, Z, { weapon = 'fist', mode = 'walk', ctx = null, target = false, still = false, onMode = null, onCtx = null, onInteract = null } = {}) {
  const P = Z === SIZES.phone, s = Z.key, g = P ? 4 : 10, sw = s + (P ? 4 : 8);
  const wS = h('div', 'display:flex;flex:none'), lS = h('div', 'display:flex;flex:none');
  const cS = h('div', carved(Math.round(s * 0.3) + 3, 0.22) + `;width:${sw}px;height:${sw}px;display:grid;place-items:center;flex:none`);
  cS.title = 'Kontext-Platz';
  const iK = key(s, 'interact', { color: '#FFD21F', title: 'Interagieren (I)', still, onClick: () => onInteract?.() });
  iK.style.transition = 'opacity .25s,filter .25s';
  const el = hud(h('div', plate(T, 'wood', Z.r + 2) + `;display:flex;align-items:center;gap:${g}px;height:${Z.tray}px;padding:0 ${P ? 5 : 12}px`, [wS, lS, cS, iK]));
  const drawW = (anim) => { const F = FAM[weapon], n = famPair(Z, F, F.p, F.x, { still }); wS.replaceChildren(n); if (anim) popIn(n, 'scale(.5,1.3)'); };
  const drawL = (anim) => {
    const F = FAM.loco, sp = mode === 'walk' ? ['sprint', 'Sprint (Umschalt)'] : ['turbo', 'Turbo (Umschalt)'];
    const n = famPair(Z, F, sp, [MODES[mode][0], 'Fortbewegung · ' + MODES[mode][1]], { still, onB: (b) => onMode?.(b) });
    const mk = n.lastChild; mk.style.position = 'relative'; mk.append(caret(P)); el.modeKey = mk;
    lS.replaceChildren(n); if (anim) { pop(n.firstChild); pop(mk); }
  };
  const drawC = (anim) => { cS.replaceChildren(); if (!ctx) return; const C = CTX[ctx], k = fkey(s, C[0], C[2], 0, { title: C[1], still, onClick: () => onCtx?.(ctx) }); cS.append(k); if (anim) popIn(k, 'scale(.3)'); };
  const drawI = () => { iK.style.opacity = target ? '' : '.42'; iK.style.filter = target ? '' : 'grayscale(1)'; iK.style.pointerEvents = target ? '' : 'none'; iK.title = target ? 'Interagieren (I)' : 'Interagieren (I) · kein Ziel'; };
  drawW(); drawL(); drawC(); drawI();
  el.setWeapon = (w) => {
    if (w === weapon || !FAM[w]) return; weapon = w; const old = wS.firstChild;
    if (MOTION.on && old && !reduced()) old.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15,0)' }], { duration: 140, easing: 'ease-in', fill: 'forwards' }).onfinish = () => drawW(true); else drawW(true);
  };
  el.setMode = (m) => { if (!MODES[m]) return; mode = m; drawL(true); };
  el.setCtx = (c) => { ctx = c; drawC(true); };
  el.setTarget = (b) => { target = b; drawI(); if (b) pop(iK); };
  el.weapon = () => weapon; el.mode = () => mode;
  return el;
}

/* ---------- Fortbewegungs-Fenster über der Leiste ---------- */
export function locoFlyout(T, Z, { mode = 'walk', onPick = null } = {}) {
  const P = Z === SIZES.phone, s = P ? 30 : 56, F = FAM.loco;
  const tile = ([id, [icn, lab]]) => {
    const on = id === mode;
    const k = fkey(s, icn, on ? F.s : F.c, on ? 1 : 0, { title: lab, onClick: () => onPick?.(id) });
    return h('div', (on ? carved(P ? 8 : 14, 0.2) + ';' : '') + `display:flex;flex-direction:column;align-items:center;gap:${P ? 4 : 8}px;padding:${P ? '5px 2px' : '10px 6px'};width:${P ? 48 : 92}px;box-sizing:border-box;border-radius:${P ? 8 : 14}px`, [k, h('span', `font:600 ${P ? 10 : 16}px/1 ${FN};color:${INK};white-space:nowrap`, lab)]);
  };
  const E = Object.entries(MODES);
  const groove = h('div', `width:2px;align-self:stretch;margin:${P ? 6 : 12}px ${P ? 1 : 4}px;border-radius:1px;background:rgba(60,36,14,.24);box-shadow:1px 0 0 rgba(255,255,255,.38)`);
  const el = hud(h('div', plate(T, 'wood', Z.r) + `;display:flex;gap:${P ? 2 : 6}px;padding:${P ? 4 : 8}px;transform-origin:50% 100%`, [...E.slice(0, 3).map(tile), groove, ...E.slice(3).map(tile)]));
  el.addEventListener('pointerdown', (e) => e.stopPropagation());
  return el;
}
export function teleportOverlay(T, Z, { onClose = null } = {}) {
  const P = Z === SIZES.phone, pw = P ? Z.W - 24 : 1240, ph = P ? Z.H - 24 : 800;
  const body = h('div', carved(P ? 10 : 16, 0.12) + `;flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${P ? 10 : 20}px;padding:24px;text-align:center`, [
    ic('teleport', P ? 64 : 140, FAM.loco.c),
    h('div', `font:700 ${P ? 16 : 30}px/1.15 ${FN};color:${INK};max-width:720px;text-wrap:pretty`, 'Taktische Karte · 3D-Galaxie mit allen Welten, Card-Decks und bekannten Portalen'),
    h('div', `font:600 ${P ? 12 : 18}px/1 ${FN};color:${SOFT}`, 'folgt')
  ]);
  return overlayShell(T, Z, { title: 'Teleport', body, pw, ph, onClose });
}

/* ---------- Rucksack ---------- */
export const BAG = [
  { id: 'belt', n: 'Champion-Gürtel', k: 'Waffe · Faust', icon: 'wrestle', fam: 'fist', note: 'Schlag und Wrestling-Spezial.' },
  { id: 'sword', n: 'Holzschwert', k: 'Waffe · Schwert', icon: 'sword', fam: 'sword', note: 'Schwerthieb und Klingen-Wirbel.' },
  { id: 'blaster', n: 'Blaster', k: 'Waffe · Fernkampf', icon: 'blaster', fam: 'blaster', note: 'Schuss und Rakete.' },
  { id: 'wand', n: 'Zauberstab', k: 'Waffe · Magie', icon: 'wand', fam: 'magic', note: 'Zauber und Magie-Spezial.' },
  { id: 'potion', n: 'Heiltrank', k: 'Kontext', icon: 'potion', ctx: 'potion', x: 2, note: 'Füllt Leben auf.' },
  { id: 'bomb', n: 'Cartoon-Bombe', k: 'Kontext', icon: 'bomb', ctx: 'bomb', x: 3, note: 'Rußt die Umgebung ein.' },
  { id: 'costume', n: 'Kostüm', k: 'Kontext', icon: 'costume', ctx: 'costume', note: 'Verkleidung.' },
  { id: 'mushroom', n: 'Pilz', k: 'Kontext', icon: 'mushroom', ctx: 'mushroom', note: 'Wirkung offen.' },
  { id: 'candy', n: 'Bonbon', k: 'Kontext', icon: 'candy', ctx: 'candy', x: 5, note: 'Süßigkeit.' },
  { id: 'item.taxi-key.01', n: 'Taxi-Schlüssel', k: 'Item', icon: 'car', note: 'Vom Driver. Öffnet das Taxi.' },
  { id: 'item.radio.01', n: 'Kassettenradio', k: 'Item', icon: 'play', note: 'Kassette einlegen, das HUD-Radio spielt sie.' },
  { id: 'item.donut.01', n: 'Donut', k: 'Item', icon: 'candy', note: 'Süßigkeit. Ein Bissen Fluff.' },
  { id: 'item.map.01', n: 'Karte', k: 'Item', icon: 'map', note: 'Die vier Inseln, gerollt.' }
];
const colOf = (it) => (it.fam ? FAM[it.fam].c : it.ctx ? CTX[it.ctx][2] : SM('heroic'));
export function bagOverlay(T, Z, { items = BAG, shots = {}, weapon = 'fist', sel = 0, onEquip = null, onCtx = null, onClose = null } = {}) {
  const P = Z === SIZES.phone, pw = P ? Z.W - 24 : 1240, ph = P ? Z.H - 24 : 800, N = 20;
  const gp = P ? 5 : 12, cs = P ? Math.floor((pw - 24 - 4 * gp) / 5) : 112;
  const pic = (it, sz) => { if (shots[it.id]) { const im = h('img', `width:${sz}px;height:${sz}px;display:block;object-fit:contain;pointer-events:none`); im.src = shots[it.id]; return im; } return ic(it.icon, Math.round(sz * 0.62), colOf(it)); };
  const cells = [];
  const grid = h('div', `display:grid;grid-template-columns:repeat(5,${cs}px);gap:${gp}px;align-content:start;flex:none`, Array.from({ length: N }, (_, i) => {
    const it = items[i], c = h('div', carved(P ? 8 : 14, 0.2) + `;position:relative;width:${cs}px;height:${cs}px;display:grid;place-items:center;transition:translate .3s cubic-bezier(.34,1.5,.5,1)`, it ? [pic(it, Math.round(cs * 0.86))] : []);
    c.dataset.bs = c.style.boxShadow;
    if (it) {
      c.style.cursor = 'pointer'; c.title = it.n;
      if (it.x) c.append(h('span', `position:absolute;right:${P ? 3 : 8}px;bottom:${P ? 3 : 6}px;font:700 ${P ? 10 : 16}px/1 ${FN};color:${INK};font-variant-numeric:tabular-nums`, '×' + it.x));
      if (it.fam && it.fam === weapon) c.append(h('span', `position:absolute;left:${P ? 3 : 7}px;top:${P ? 3 : 7}px;width:${P ? 13 : 24}px;height:${P ? 13 : 24}px;border-radius:50%;background:${FAM[it.fam].c};box-shadow:0 0 0 ${P ? 1 : 1.6}px ${INK};display:grid;place-items:center`, [ic('check', P ? 9 : 16, CR)]));
      deform(c, { amp: 0.3, onClick: () => show(i) });
    }
    cells.push(c); return c;
  }));
  const det = h('div', paper(P ? 10 : 16) + `;flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${P ? 8 : 18}px;padding:${P ? 12 : 32}px;box-shadow:0 2px 0 rgba(43,26,11,.22),0 0 0 1px rgba(43,26,11,.14)`);
  const pill = (t, fn, on = true) => { const hh = P ? 32 : 54, b = h('div', (on ? woodFace(hh, P ? 8 : 12) : carved(P ? 8 : 12, 0.16)) + `;display:inline-flex;align-items:center;height:${hh}px;padding:0 ${P ? 14 : 26}px;font:600 ${P ? 13 : 21}px/1 ${FN};color:${on ? INK : SOFT};cursor:${on ? 'pointer' : 'default'};white-space:nowrap;transform-origin:50% 85%`, t); if (on) deform(b, { amp: 0.4, onClick: fn }); return b; };
  const show = (i) => {
    const it = items[i]; if (!it) return; sel = i;
    cells.forEach((c, j) => { c.style.boxShadow = c.dataset.bs + (j === i ? `,0 0 0 ${P ? 2 : 3}px ${INK}` : ''); c.style.translate = j === i ? '0 -2px' : '0 0'; });
    const big = P ? 112 : 340, stage = h('div', `width:${big}px;height:${big}px;display:grid;place-items:center;flex:none`, [pic(it, big)]);
    const act = it.fam ? (it.fam === weapon ? pill('Ausgerüstet', null, false) : pill('Ausrüsten', () => { weapon = it.fam; onEquip?.(it.fam); })) : it.ctx ? pill('In den Kontext-Platz', () => onCtx?.(it.ctx)) : pill('Benutzen', null);
    det.replaceChildren(stage,
      h('div', `display:flex;flex-direction:column;align-items:center;gap:${P ? 4 : 8}px;text-align:center`, [h('div', `font:700 ${P ? 17 : 34}px/1.1 ${FN};color:${INK}`, it.n + (it.x ? ` ×${it.x}` : '')), h('div', `font:600 ${P ? 11 : 17}px/1 ${FN};color:${SOFT}`, it.k)]),
      h('div', `font:500 ${P ? 12 : 19}px/1.4 ${FN};color:${INK};text-align:center;text-wrap:pretty;max-width:420px`, it.note),
      act,
      shots[it.id] ? null : h('div', `font:500 ${P ? 10 : 14}px/1 ${FN};color:${SOFT}`, '3D-Modell folgt')
    );
    popIn(stage, 'scale(.85) rotate(-4deg)');
  };
  const body = h('div', `flex:1;min-height:0;display:flex;flex-direction:${P ? 'column' : 'row'};gap:${P ? 10 : 24}px`, [grid, det]);
  show(sel);
  return overlayShell(T, Z, { title: 'Rucksack', sub: `${items.length} von ${N} Fächern`, body, pw, ph, onClose });
}

/* ---------- Fluff-Leiste: Flug, Einrasten, Zähler, Komplett-Hinweis ---------- */
export function fluffBar(T, Z, { counts = D.FLUFF_COUNTS, numbers = true, onClick = null } = {}) {
  const P = Z === SIZES.phone, showN = numbers && Z.ballN > 0, b = Z.ball, st = counts.slice();
  const sum = () => st.reduce((a, n) => a + n, 0), complete = () => st.every((n) => n > 0);
  const numEl = (n) => h('span', `font:700 ${Z.ballN}px/1 ${FN};color:${INK};font-variant-numeric:tabular-nums;display:inline-block`, String(n));
  const mkBall = (i) => deform(fluffBall(FLUFF[i], b, P), { amp: 1.4 });
  const C = FLUFF.map((f, i) => {
    const s = h('div', carved(b, 0.26) + `;width:${b + (P ? 4 : 8)}px;height:${b + (P ? 4 : 8)}px;flex:none;display:grid;place-items:center;border-radius:50%`), c = { s, ball: null, num: null };
    s.title = f.label; if (st[i]) { c.ball = mkBall(i); s.append(c.ball); }
    c.el = showN ? h('div', `display:flex;align-items:center;gap:7px;width:${b + 8 + 7 + Math.round(Z.ballN * 1.25)}px`, [s]) : s;
    if (showN && st[i]) { c.num = numEl(st[i]); c.el.append(c.num); }
    return c;
  });
  const tot = h('span', `font:700 ${Z.total}px/1 ${FN};color:${INK};font-variant-numeric:tabular-nums;display:inline-block;min-width:${Math.round(Z.total * 1.8)}px;text-align:center`, String(sum()));
  const groove = h('div', `width:2px;align-self:stretch;margin:${P ? 7 : 16}px 0;border-radius:1px;background:rgba(60,36,14,.24);box-shadow:1px 0 0 rgba(255,255,255,.38)`);
  const rb = h('span', `display:none;width:${P ? 16 : 30}px;height:${P ? 16 : 30}px;border-radius:50%;place-items:center;flex:none;background:#FFD21F;box-shadow:0 0 0 ${P ? 1 : 1.6}px ${INK}`, [ic('spark', P ? 11 : 20, CR)]);
  rb.title = 'Kayfabricate bereit';
  const el = hud(h('div', plate(T, 'wood', Z.r) + `;display:flex;align-items:center;gap:${P ? 6 : 16}px;height:${P ? 28 : Z.row}px;padding:0 ${P ? 8 : 20}px;cursor:pointer;transform-origin:50% 0`, [
    tot, groove, h('div', `display:flex;align-items:center;gap:${showN ? 8 : (P ? 3 : 10)}px`, C.map((c) => c.el)), rb
  ]));
  el.title = 'Fluff-Korb';
  deform(el, { amp: 0.25, onClick });
  let pulse = null;
  const setReady = (v) => { rb.style.display = v ? 'grid' : 'none'; pulse?.cancel(); pulse = v && MOTION.on && !reduced() ? rb.animate([{ transform: 'scale(1) rotate(0)' }, { transform: 'scale(1.2) rotate(24deg)', offset: 0.5 }, { transform: 'scale(1) rotate(0)' }], { duration: 1600, iterations: Infinity, easing: 'ease-in-out' }) : null; };
  const countTo = (node, from, to) => {
    if (!MOTION.on || to - from <= 1) node.textContent = String(to);
    else { const t0 = performance.now(), d = 380; const step = (t) => { const p = Math.min(1, (t - t0) / d); node.textContent = String(Math.round(from + (to - from) * p)); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }
    if (MOTION.on) node.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.45) translateY(-2px)', offset: 0.35 }, { transform: 'scale(1)' }], { duration: 360, easing: 'cubic-bezier(.3,.7,.4,1)' });
  };
  const burst = () => {
    const w = el.offsetWidth, hh = el.offsetHeight, n = 16, sz = P ? 10 : 20;
    for (let j = 0; j < n; j++) {
      const a = (j / n) * Math.PI * 2 + Math.random() * 0.3, r = (P ? 46 : 120) + Math.random() * (P ? 20 : 60), sp = ic('spark', sz, FLUFF[j % 6].c);
      sp.style.cssText += `;position:absolute;left:${w / 2 - sz / 2}px;top:${hh / 2 - sz / 2}px;z-index:5`;
      el.append(sp);
      sp.animate([{ transform: 'translate(0,0) scale(.2) rotate(0deg)', opacity: 1 }, { transform: `translate(${(Math.cos(a) * r).toFixed(1)}px,${(Math.sin(a) * r * 0.55).toFixed(1)}px) scale(1.25) rotate(160deg)`, opacity: 1, offset: 0.65 }, { transform: `translate(${(Math.cos(a) * r * 1.12).toFixed(1)}px,${(Math.sin(a) * r * 0.6 + 10).toFixed(1)}px) scale(.3) rotate(240deg)`, opacity: 0 }], { duration: 950, delay: j * 14, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' }).onfinish = () => sp.remove();
    }
  };
  const tag = () => {
    const th = P ? 26 : 46, t = h('div', lackFace(th, P ? 8 : 12, '#FFD21F') + `;position:absolute;left:50%;top:calc(100% + ${P ? 6 : 12}px);translate:-50% 0;height:${th}px;display:flex;align-items:center;gap:${P ? 5 : 10}px;padding:0 ${P ? 10 : 18}px;font:700 ${P ? 12 : 20}px/1 ${FN};color:${INK};white-space:nowrap;z-index:6;cursor:pointer;transform-origin:50% 0`, [ic('spark', P ? 13 : 22, CR), 'Kayfabricate bereit!']);
    t.addEventListener('pointerdown', (e) => e.stopPropagation());
    t.addEventListener('click', (e) => { e.stopPropagation(); t.remove(); onClick?.(); });
    el.append(t); popIn(t, 'scale(.3,.6)');
    setTimeout(() => { if (!t.isConnected) return; if (MOTION.on) t.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-6px)' }], { duration: 300, fill: 'forwards' }).onfinish = () => t.remove(); else t.remove(); }, 4500);
  };
  el.celebrate = () => {
    setReady(true); if (!MOTION.on || reduced()) return;
    C.forEach((c, i) => c.ball?.animate([{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(2px) scale(1.25,.75)', offset: 0.15 }, { transform: `translateY(-${P ? 8 : 16}px) scale(.85,1.2)`, offset: 0.45 }, { transform: 'translateY(0) scale(1.15,.85)', offset: 0.75 }, { transform: 'translateY(0) scale(1)' }], { duration: 560, delay: i * 70, easing: 'ease-out' }));
    burst(); setTimeout(tag, 420);
  };
  el.socketOf = (i) => C[i].s;
  el.counts = () => st.slice();
  el.ready = complete;
  el.land = (i, n = 1) => {
    const was = complete(), c = C[i], old = st[i]; st[i] += n;
    if (!c.ball) { c.ball = mkBall(i); c.s.append(c.ball); }
    if (MOTION.on && !reduced()) {
      c.ball.animate([{ transform: 'scale(1.55,.5)' }, { transform: 'translateY(-3px) scale(.8,1.28)', offset: 0.35 }, { transform: 'scale(1.1,.92)', offset: 0.7 }, { transform: 'scale(1)' }], { duration: 440, easing: 'cubic-bezier(.3,.7,.4,1)' });
      c.s.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.2)', offset: 0.3 }, { transform: 'scale(1)' }], { duration: 300 });
    }
    if (showN) { if (!c.num) { c.num = numEl(0); c.el.append(c.num); } countTo(c.num, old, st[i]); }
    countTo(tot, sum() - n, sum());
    if (!was && complete()) setTimeout(() => el.celebrate(), 260);
  };
  el.spend = (cost) => {
    cost.forEach((n, i) => { if (!n) return; const c = C[i]; st[i] = Math.max(0, st[i] - n);
      if (c.num) { if (st[i]) c.num.textContent = String(st[i]); else { c.num.remove(); c.num = null; } }
      if (!st[i] && c.ball) { c.ball.remove(); c.ball = null; } });
    tot.textContent = String(sum()); setReady(complete());
  };
  setReady(complete());
  return el;
}
/* Fluff-Korb: Bestand je Story-Mode, unten „Kayfabricate…“ (aktiv, sobald jede Sorte ≥ 1) */
export function fluffKorb(T, Z, { counts = D.FLUFF_COUNTS, onFab = null } = {}) {
  const P = Z === SIZES.phone, b = P ? 14 : 26, fs = P ? 12 : 19, total = counts.reduce((a, n) => a + n, 0), ready = counts.every((n) => n > 0);
  const rows = FLUFF.map((f, i) => {
    const s = h('div', carved(b, 0.26) + `;width:${b + (P ? 4 : 8)}px;height:${b + (P ? 4 : 8)}px;flex:none;display:grid;place-items:center;border-radius:50%`); if (counts[i]) s.append(fluffBall(f, b, P));
    return h('div', `display:flex;align-items:center;gap:${P ? 7 : 12}px;height:${P ? 24 : 40}px`, [s, h('span', `flex:1;font:600 ${fs}px/1 ${FN};color:${INK}`, f.label), h('span', `font:700 ${fs}px/1 ${FN};color:${counts[i] ? INK : SOFT};font-variant-numeric:tabular-nums`, counts[i] ? String(counts[i]) : 'leer')]);
  });
  const bh = P ? 32 : 54, missing = FLUFF.filter((f, i) => !counts[i]).map((f) => f.label);
  const fab = ready
    ? deform(h('div', lackFace(bh, P ? 8 : 12, '#FFD21F') + `;display:flex;align-items:center;justify-content:center;gap:${P ? 6 : 10}px;height:${bh}px;margin-top:${P ? 8 : 14}px;font:700 ${P ? 13 : 21}px/1 ${FN};color:${INK};cursor:pointer;transform-origin:50% 85%`, [ic('spark', P ? 14 : 24, CR), 'Kayfabricate…']), { amp: 0.4, onClick: () => onFab?.() })
    : h('div', carved(P ? 8 : 12, 0.18) + `;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${P ? 4 : 7}px;padding:${P ? '7px 6px' : '12px 10px'};margin-top:${P ? 8 : 14}px`, [h('div', `font:700 ${P ? 13 : 21}px/1 ${FN};color:${SOFT}`, 'Kayfabricate…'), h('div', `font:500 ${P ? 10 : 15}px/1 ${FN};color:${SOFT}`, 'Fehlt: ' + missing.join(', '))]);
  const el = h('div', plate(T, 'wood', Z.r) + `;display:flex;flex-direction:column;gap:${P ? 2 : 4}px;padding:${P ? '9px 11px' : '18px 22px'};width:${P ? 180 : 320}px;box-sizing:border-box;transform-origin:30% 0`, [
    h('div', `display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:${P ? 4 : 8}px`, [h('span', `font:700 ${P ? 15 : 26}px/1 ${FN};color:${INK}`, 'Fluff-Korb'), h('span', `font:700 ${P ? 15 : 26}px/1 ${FN};color:${INK};font-variant-numeric:tabular-nums`, String(total))]),
    ...rows, fab
  ]);
  el.addEventListener('pointerdown', (e) => e.stopPropagation());
  return el;
}

/* ---------- Kayfabrication ---------- */
/* Decks mit mindestens einer gesammelten Karte. Namen der ungesammelten Karten im Starter-Deck sind Platzhalter. */
export const DECKS = [
  { id: 'starter', t: 'Starter-Deck', cards: [...DECK.map((c) => ({ ...c, have: true })), { t: 'Barnum-Effekt', m: 'comic' }, { t: 'Halo-Effekt', m: 'heroic' }, { t: 'Ikea-Effekt', m: 'absurd' }, { t: 'Baader-Meinhof', m: 'mystical' }, { t: 'Streisand-Effekt', m: 'forbidden' }, { t: 'Sunk Cost', m: 'tragic' }] },
  { id: 'venice', t: 'Serenissima Screwjob', cards: [{ t: 'Veronese, 1573', m: 'comic', have: true }, { t: 'Tintoretto, 1564', m: 'heroic' }, { t: 'Acqua Alta', m: 'tragic' }, { t: 'Bocca di Leone', m: 'forbidden' }, { t: 'Der Doge', m: 'absurd' }, { t: 'Staatsinquisition', m: 'mystical' }] }
];
/* Preis (Platzhalter): je Sorte 1, in Kartenfarbe 3 */
export const fabCost = (card) => FLUFF.map((f) => (f.id === card.m ? 3 : 1));
export function kayfabOverlay(T, Z, { step = 1, deckId = 'starter', card = null, filled = false, counts = D.FLUFF_COUNTS, onSpend = null, onClose = null } = {}) {
  const P = Z === SIZES.phone, pw = P ? Z.W - 24 : 1440, ph = P ? Z.H - 24 : 860;
  let deck = DECKS.find((d) => d.id === deckId) || DECKS[0], sel = card || deck.cards.find((c) => !c.have), have = counts.slice(), isFilled = filled, live = false;
  const STEPS = ['Karte wählen', 'Fluff einfüllen', 'Kayfabrizieren', 'Fertig'];
  const stepper = h('div', `display:flex;gap:${P ? 3 : 8}px;flex-wrap:wrap;flex:none`);
  const paintSteps = (n) => stepper.replaceChildren(...STEPS.map((t, j) => h('div', (j + 1 === n ? woodFace(40, P ? 6 : 10) : carved(P ? 6 : 10, 0.14)) + `;display:flex;align-items:center;gap:${P ? 4 : 8}px;height:${P ? 22 : 40}px;padding:0 ${P ? 7 : 14}px;font:600 ${P ? 10 : 16}px/1 ${FN};color:${j + 1 <= n ? INK : SOFT};white-space:nowrap;box-sizing:border-box`, [h('span', `font:700 ${P ? 10 : 16}px/1 ${FN}`, String(j + 1)), t])));
  const stage = h('div', carved(P ? 10 : 16, 0.12) + ';flex:1;min-height:0;position:relative;overflow:hidden;display:flex');
  const grey = (el) => { el.style.filter = 'grayscale(1) contrast(.8) brightness(1.08)'; el.style.opacity = '.62'; return el; };
  const bigBtn = (t, c, on, fn) => { const hh = P ? 34 : 58, b = h('div', (on ? (c ? lackFace(hh, P ? 8 : 13, c) : woodFace(hh, P ? 8 : 13)) : carved(P ? 8 : 13, 0.16)) + `;display:inline-flex;align-items:center;justify-content:center;gap:${P ? 6 : 10}px;height:${hh}px;padding:0 ${P ? 14 : 28}px;font:700 ${P ? 13 : 22}px/1 ${FN};color:${on ? INK : SOFT};cursor:${on ? 'pointer' : 'default'};white-space:nowrap;transform-origin:50% 85%`, [c && on ? ic('spark', P ? 14 : 24, CR) : null, t]); if (on) deform(b, { amp: 0.4, onClick: fn }); return b; };

  const s1 = () => {
    paintSteps(1); stage.replaceChildren();
    const tabs = h('div', P ? 'display:flex;gap:4px;flex-wrap:wrap;flex:none' : 'display:flex;flex-direction:column;gap:6px;width:300px;flex:none', DECKS.map((d) => {
      const on = d === deck, n = d.cards.filter((c) => c.have).length;
      return deform(h('div', (on ? woodFace(44, P ? 6 : 10) + ';' : '') + `display:flex;align-items:center;justify-content:space-between;gap:10px;height:${P ? 28 : 56}px;padding:0 ${P ? 9 : 18}px;border-radius:${P ? 6 : 10}px;font:600 ${P ? 11 : 20}px/1.1 ${FN};color:${INK};cursor:pointer;white-space:nowrap;box-sizing:border-box;transform-origin:50% 85%`, [d.t, h('span', `font:600 ${P ? 10 : 16}px/1 ${FN};color:${SOFT};font-variant-numeric:tabular-nums`, `${n}/${d.cards.length}`)]), { amp: 0.25, onClick: () => { deck = d; s1(); } });
    }));
    const cols = P ? 2 : 4, cw = P ? Math.floor((pw - 24 - 20 - 8) / 2) : 236, chh = Math.round(cw / 1.75);
    const grid = h('div', `flex:1;min-height:0;overflow:auto;scrollbar-color:#A27536 transparent;display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:${P ? 8 : 18}px;align-content:start;padding:${P ? 2 : 6}px`, deck.cards.map((c) => {
      const box = cardBox(c, cw, chh, P ? 6 : 10, !!c.have), wrap = h('div', `position:relative;border-radius:${P ? 6 : 10}px;transform-origin:50% 80%`, [box]);
      if (c.have) wrap.append(h('div', `position:absolute;right:${P ? 4 : 8}px;bottom:${P ? 4 : 8}px;width:${P ? 16 : 28}px;height:${P ? 16 : 28}px;border-radius:50%;background:${FAM.loco.c};box-shadow:0 0 0 ${P ? 1 : 1.6}px ${INK};display:grid;place-items:center`, [ic('check', P ? 11 : 18, CR)]));
      else { grey(box); wrap.style.cursor = 'pointer'; wrap.title = c.t; wrap.append(h('div', 'position:absolute;inset:0;display:grid;place-items:center;pointer-events:none', [ic('help', P ? 26 : 48, '#FFE48A')])); deform(wrap, { amp: 0.3, onClick: () => { sel = c; isFilled = false; s2(); } }); }
      return wrap;
    }));
    stage.append(h('div', `flex:1;min-width:0;min-height:0;display:flex;${P ? 'flex-direction:column;' : ''}gap:${P ? 10 : 28}px;padding:${P ? 10 : 28}px`, [tabs, h('div', `flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;gap:${P ? 8 : 14}px`, [h('div', `font:600 ${P ? 12 : 19}px/1.2 ${FN};color:${INK}`, 'Graue Karten fehlen dir noch. Wähle eine.'), grid])]));
  };

  let M = null, socks = [], btnHost = null, rowsHost = null;
  const s2 = () => {
    paintSteps(2); stage.replaceChildren();
    const cost = fabCost(sel), units = cost.flatMap((n, i) => Array(n).fill(i)), ok = cost.every((n, i) => have[i] >= n);
    const sz = P ? 190 : 430, bs = Math.round(sz * 0.11);
    const m = h('div', `position:relative;width:${sz}px;height:${sz}px;flex:none`);
    const pot = h('div', well(T, sz) + `;position:absolute;inset:${sz * 0.2}px;border-radius:50%`);
    const core = h('div', `position:absolute;left:50%;top:50%;width:${sz * 0.22}px;height:${sz * 0.22}px;margin:-${sz * 0.11}px 0 0 -${sz * 0.11}px;border-radius:50%;opacity:0;background:${CR}`);
    const ring = h('div', 'position:absolute;inset:0');
    m.append(h('div', plate(T, 'wood', sz / 2) + ';position:absolute;inset:0;border-radius:50%'), pot, core, ring);
    M = { m, ring, core, sz };
    socks = units.map((i, j) => {
      const a = -Math.PI / 2 + (j / units.length) * Math.PI * 2, r = sz * 0.4;
      const s = h('div', carved(bs, 0.3) + `;position:absolute;left:${sz / 2 + Math.cos(a) * r - bs / 2 - 3}px;top:${sz / 2 + Math.sin(a) * r - bs / 2 - 3}px;width:${bs + 6}px;height:${bs + 6}px;border-radius:50%;display:grid;place-items:center`);
      const gh = fluffBall(FLUFF[i], bs, P); gh.style.opacity = '.26'; s.append(gh); ring.append(s); return { s, i };
    });
    const fillAll = (instant) => socks.forEach(({ s, i }, j) => { const b2 = fluffBall(FLUFF[i], bs, P); s.replaceChildren(b2); if (!instant && MOTION.on) b2.animate([{ transform: 'translateY(-70px) scale(1.6,.6)', opacity: 0 }, { transform: 'translateY(0) scale(1.35,.7)', opacity: 1, offset: 0.55 }, { transform: 'scale(.85,1.2)', offset: 0.78 }, { transform: 'scale(1)' }], { duration: 460, delay: j * 90, easing: 'cubic-bezier(.3,.7,.4,1)', fill: 'backwards' }); });
    const cw = P ? 132 : 380, cardEl = grey(cardBox(sel, cw, Math.round(cw / 1.75), P ? 7 : 12));
    const left = h('div', `display:flex;flex-direction:column;align-items:center;gap:${P ? 4 : 14}px;flex:none`, [cardEl, h('div', `font:700 ${P ? 13 : 26}px/1.1 ${FN};color:${INK};text-align:center`, sel.t), h('div', `font:600 ${P ? 10 : 16}px/1 ${FN};color:${SOFT}`, deck.t)]);
    rowsHost = h('div', P ? 'display:flex;gap:6px;flex:none' : 'display:grid;grid-template-columns:auto 1fr auto auto;align-items:center;gap:8px 14px;flex:none');
    const paintRows = () => {
      if (P) { rowsHost.replaceChildren(...FLUFF.map((f, i) => h('div', 'display:flex;flex-direction:column;align-items:center;gap:3px;width:40px', [fluffBall(f, 14, true), h('span', `font:700 11px/1 ${FN};color:${INK}`, '−' + cost[i]), h('span', `font:600 10px/1 ${FN};color:${have[i] >= (isFilled ? 0 : cost[i]) ? SOFT : '#C23A2A'};font-variant-numeric:tabular-nums`, String(have[i]))]))); return; }
      const hd = (t) => h('span', `font:600 14px/1 ${FN};color:${SOFT}`, t);
      rowsHost.replaceChildren(h('span', ''), hd(''), hd('Preis'), hd('Bestand'), ...FLUFF.flatMap((f, i) => [fluffBall(f, 22), h('span', `font:600 17px/1 ${FN};color:${INK}`, f.label), h('span', `font:700 17px/1 ${FN};color:${INK};text-align:right`, String(cost[i])), h('span', `font:700 17px/1 ${FN};color:${have[i] >= (isFilled ? 0 : cost[i]) ? INK : '#C23A2A'};text-align:right;font-variant-numeric:tabular-nums`, String(have[i]))]));
    };
    btnHost = h('div', 'display:flex;justify-content:center;flex:none');
    const paintBtn = () => btnHost.replaceChildren(isFilled ? bigBtn('Kayfabrizieren!', '#FFD21F', true, () => s3()) : bigBtn(ok ? 'Fluff einfüllen' : 'Zu wenig Fluff', null, ok, () => { isFilled = true; have = have.map((n, i) => n - cost[i]); onSpend?.(cost); fillAll(false); paintRows(); paintBtn(); }));
    paintRows(); paintBtn(); if (isFilled) fillAll(true);
    const mid = h('div', `display:flex;flex-direction:column;align-items:center;gap:${P ? 6 : 14}px;flex:none`, [m, h('div', `font:700 ${P ? 12 : 18}px/1 ${FN};color:${SOFT}`, 'Kayfabricator'), btnHost]);
    stage.append(h('div', `flex:1;min-width:0;display:flex;${P ? 'flex-direction:column;' : ''}align-items:center;justify-content:center;gap:${P ? 8 : 56}px;padding:${P ? 8 : 28}px`, P ? [left, mid, rowsHost] : [left, mid, rowsHost]));
  };

  const s3 = () => {
    paintSteps(3); btnHost?.replaceChildren(); live = true;
    if (!MOTION.on || reduced() || !M) return s4();
    M.ring.animate([{ transform: 'rotate(0deg) scale(1)' }, { transform: 'rotate(160deg) scale(.96)', offset: 0.35 }, { transform: 'rotate(720deg) scale(.1)' }], { duration: 1300, easing: 'cubic-bezier(.6,0,.8,.4)', fill: 'forwards' });
    M.core.animate([{ opacity: 0, transform: 'scale(.2)', background: FLUFF[0].c }, ...FLUFF.map((f, j) => ({ opacity: 1, transform: `scale(${(1 + j * 0.3).toFixed(2)})`, background: f.c, offset: 0.25 + j * 0.1 })), { opacity: 1, transform: 'scale(3.4)', background: CR }], { duration: 1500, easing: 'ease-in', fill: 'forwards' });
    M.m.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06,.94)', offset: 0.2 }, { transform: 'scale(.95,1.05)', offset: 0.4 }, { transform: 'scale(1.08,.92)', offset: 0.6 }, { transform: 'scale(.93,1.08)', offset: 0.8 }, { transform: 'scale(1.1,.9)' }], { duration: 1500, easing: 'ease-in-out' });
    setTimeout(() => { if (!stage.isConnected) return; const f = h('div', `position:absolute;inset:0;background:${CR};pointer-events:none;z-index:5`); stage.append(f); f.animate([{ opacity: 0 }, { opacity: 0.95, offset: 0.3 }, { opacity: 0 }], { duration: 700 }).onfinish = () => f.remove(); setTimeout(s4, 200); }, 1500);
  };

  const s4 = () => {
    if (!stage.isConnected && live) return;
    paintSteps(4); stage.replaceChildren(); if (live) sel.have = true;
    const cw = P ? 250 : 640, cardEl = cardBox(sel, cw, Math.round(cw / 1.75), P ? 9 : 16);
    const next = deck.cards.find((c) => !c.have && c !== sel);
    const col = h('div', `flex:1;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${P ? 12 : 26}px;padding:${P ? 12 : 28}px`, [
      cardEl,
      h('div', `display:flex;flex-direction:column;align-items:center;gap:${P ? 4 : 8}px`, [h('div', `font:700 ${P ? 18 : 36}px/1.1 ${FN};color:${INK}`, sel.t), h('div', `font:600 ${P ? 11 : 18}px/1 ${FN};color:${SOFT}`, `${deck.t} · kayfabriziert`)]),
      h('div', `display:flex;gap:${P ? 8 : 14}px;flex-wrap:wrap;justify-content:center`, [bigBtn('In den Almanach', '#FFD21F', true, () => onClose?.()), next ? bigBtn('Noch eine', null, true, () => { sel = next; isFilled = false; s1(); }) : null])
    ]);
    stage.append(col);
    if (MOTION.on && !reduced()) {
      cardEl.animate([{ transform: 'translateY(90px) scale(.2) rotate(-14deg)', opacity: 0 }, { transform: 'translateY(-14px) scale(1.08,.94) rotate(3deg)', opacity: 1, offset: 0.55 }, { transform: 'scale(.97,1.04) rotate(-1deg)', offset: 0.78 }, { transform: 'none' }], { duration: 760, easing: 'cubic-bezier(.3,.7,.4,1)' });
      if (live) requestAnimationFrame(() => { const w = col.offsetWidth, hh = col.offsetHeight, sz = P ? 14 : 28; for (let j = 0; j < 18; j++) { const a = (j / 18) * Math.PI * 2, r = (P ? 110 : 360) + Math.random() * (P ? 30 : 80), sp = ic('spark', sz, FLUFF[j % 6].c); sp.style.cssText += `;position:absolute;left:${w / 2 - sz / 2}px;top:${hh * 0.36 - sz / 2}px;z-index:4`; col.append(sp); sp.animate([{ transform: 'translate(0,0) scale(.2)', opacity: 1 }, { transform: `translate(${(Math.cos(a) * r).toFixed(1)}px,${(Math.sin(a) * r * 0.5).toFixed(1)}px) scale(1.2) rotate(180deg)`, opacity: 1, offset: 0.7 }, { transform: `translate(${(Math.cos(a) * r * 1.1).toFixed(1)}px,${(Math.sin(a) * r * 0.55 + 14).toFixed(1)}px) scale(.3) rotate(260deg)`, opacity: 0 }], { duration: 1100, delay: 200 + j * 12, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' }).onfinish = () => sp.remove(); } });
    }
  };

  ({ 1: s1, 2: s2, 3: s2, 4: s4 })[step]?.();
  const body = h('div', `flex:1;min-height:0;display:flex;flex-direction:column;gap:${P ? 8 : 16}px`, [stepper, stage]);
  return overlayShell(T, Z, { title: 'Kayfabrication', body, pw, ph, onClose });
}

/* ======================= Bild-Komposition ======================= */
/* cfg wie R5d, dazu: weapon, mode, ctx, target, locoOpen, bagOpen, items, shots, counts, kfabOpen, kfabStep, kfabFilled, kfabCard */
export function buildFrame(cfg) {
  const Z = SIZES[cfg.form] || SIZES.desk, P = cfg.form === 'phone', T = cfg.T, W = Z.W, H = Z.H, pad = Z.pad;
  const el = h('div', `position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${T.sky};font-family:${FN};-webkit-font-smoothing:antialiased;user-select:none`);
  const B = D.bgLayer(W, H, cfg.bg); if (B.el) el.append(B.el);
  const place = (node, css) => { node.style.position = 'absolute'; node.style.cssText += ';' + css; el.append(node); return node; };
  let ov = null;
  const overlay = (node) => { ov?.remove(); ov = node; if (node) el.append(node); };
  const closeOv = () => overlay(null);
  const deck = cfg.deck || DECK;
  const viewer = (c) => { al.setOpen(false); overlay(D.cardViewer(T, Z, { deck, idx: c ? deck.indexOf(c) : deck.length - 1, onClose: closeOv })); };
  const settings = (tab) => overlay(D.settingsOverlay(T, Z, { tab, onClose: closeOv }));
  const info = () => overlay(D.infoOverlay(T, Z, { onClose: closeOv }));
  const snd = { music: true, sfx: true, ...(cfg.sound || {}) };
  const items = (cfg.items || BAG).slice();
  const openBag = () => overlay(bagOverlay(T, Z, { items, shots: cfg.shots || {}, weapon: bar.weapon(), onEquip: (w) => { closeOv(); bar.setWeapon(w); }, onCtx: (c) => { closeOv(); bar.setCtx(c); }, onClose: closeOv }));
  const openFab = (o = {}) => { fluffPop(false); overlay(kayfabOverlay(T, Z, { counts: fl.counts(), onSpend: (cost) => fl.spend(cost), onClose: closeOv, ...o })); };

  /* oben: Fluff (Telefon ganz oben, Stapel darunter) */
  const fluffH = P ? 28 : Z.row, almTop = P ? pad + fluffH + Z.gap : pad;
  let fi = null;
  const fluffPop = (open, quick = false) => {
    if (open && !fi) { fi = fluffKorb(T, Z, { counts: fl.counts(), onFab: () => openFab() }); fi.style.zIndex = 30; place(fi, P ? `left:${pad}px;top:${pad + fluffH + Z.gap}px` : `left:50%;top:${pad + Z.row + Z.gap}px;margin-left:-160px`); if (!quick) popIn(fi, 'scale(.7,.4)'); }
    else if (!open && fi) { fi.remove(); fi = null; }
  };
  const fl = fluffBar(T, Z, { counts: cfg.counts || D.FLUFF_COUNTS, numbers: cfg.fluffNumbers !== false, onClick: () => fluffPop(!fi) });
  fl.style.zIndex = 25;
  if (P) place(fl, `left:${pad}px;top:${pad}px`); else place(fl, `left:50%;top:${pad}px;translate:-50% 0`);

  const inst = D.instruments(T, Z, { nav: cfg.nav, arrowFor: cfg.arrowFor, pinFor: cfg.pinFor, radio: { animate: cfg.animate !== false, playing: snd.music, onPlay: (on) => { if (on && !snd.music) { snd.music = true; syncSnd(); } }, onDrop: () => menu(false) }, onMenu: () => menu(!menuEl) });
  place(inst, `right:${pad}px;top:${pad}px`);
  if (cfg.scene === 'drive') place(D.tacho(T, Z, { speed: cfg.speed ?? 55 }), `right:${pad + D.colWidth(Z) - Math.round(Z.tacho * 0.16)}px;top:${pad}px`);

  /* unten Mitte: Aktionsleiste */
  let lf = null;
  const toast = (t) => { const th = P ? 28 : 48, n = h('div', woodFace(th, P ? 8 : 12) + `;position:absolute;left:50%;bottom:${pad + Z.tray + (P ? 10 : 18)}px;translate:-50% 0;height:${th}px;display:flex;align-items:center;padding:0 ${P ? 10 : 20}px;font:600 ${P ? 12 : 19}px/1 ${FN};color:${INK};white-space:nowrap;z-index:35`, t); el.append(n); popIn(n, 'scale(.5)'); setTimeout(() => n.remove(), 2200); };
  const loco = (open, quick = false) => {
    if (open && !lf) {
      lf = locoFlyout(T, Z, { mode: bar.mode(), onPick: (m) => { loco(false); if (m === 'teleport') return overlay(teleportOverlay(T, Z, { onClose: closeOv })); if (m === 'home') { bar.setMode('walk'); return toast('Ruhestein · zurück nach KFB-Town'); } bar.setMode(m); } });
      lf.style.cssText += `;position:absolute;left:50%;bottom:calc(100% + ${P ? 8 : 14}px);translate:-50% 0;z-index:30`;
      bar.append(lf); if (!quick) popIn(lf, 'scale(.5,.3)');
    } else if (!open && lf) { lf.remove(); lf = null; }
  };
  const bar = actionBar(T, Z, { weapon: cfg.weapon || 'fist', mode: cfg.mode || (cfg.scene === 'drive' ? 'drive' : 'walk'), ctx: cfg.ctx || null, target: !!cfg.target, onMode: () => loco(!lf) });
  place(bar, `left:50%;bottom:${pad}px;translate:-50% 0`);
  bar.style.zIndex = 15;

  /* unten links: Rucksack */
  const bagKey = key(Z.key, 'bag', { color: SM('heroic'), title: 'Rucksack', onClick: () => openBag() });
  bagKey.append(h('span', `position:absolute;top:${P ? -5 : -8}px;right:${P ? -9 : -16}px;height:${P ? 14 : 24}px;padding:0 ${P ? 4 : 7}px;border-radius:${P ? 7 : 12}px;background:#FBF1DC;box-shadow:0 0 0 ${P ? 1 : 1.6}px ${INK};display:grid;place-items:center;font:700 ${P ? 9 : 14}px/1 ${FN};color:${INK};white-space:nowrap;pointer-events:none;font-variant-numeric:tabular-nums`, `${items.length}/20`));
  place(hud(bagKey), `left:${pad}px;bottom:${pad + (Z.tray - Z.key) / 2}px`);

  /* rechts unten: Ton · Info · Einstellungen (wie R5d) */
  const kb = pad + (Z.tray - Z.gear) / 2, sb = kb + 2 * (Z.gear + Z.gap);
  place(D.settingsKey(Z, { onClick: () => settings('spiel') }), `right:${pad}px;bottom:${kb}px`);
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

  /* oben links: Almanach */
  const al = D.almanac(T, Z, { deck, open: !!cfg.cardsOpen, onCard: (c) => viewer(c), onAll: () => viewer(null) });
  place(al.el, `left:${pad}px;top:${almTop}px`);
  al.el.style.zIndex = 20;

  let menuEl = null;
  const menuTop = pad + inst.stripTop + Z.strip + (P ? 4 : 8);
  const menu = (open, quick = false) => {
    if (open && !menuEl) {
      inst.radio.setList?.(false);
      const cur = [...D.TARGETS.quest, ...D.TARGETS.place].find((t) => t.name === inst.nav().name);
      menuEl = D.targetMenu(T, Z, { sel: cur?.id, width: P ? W - 2 * pad : null, onPick: (t) => { inst.setNav({ state: 'set', dist: t.dist, name: t.name }, true); setTimeout(() => menu(false), 240); } });
      place(menuEl, `right:${pad}px;top:${menuTop}px`);
      if (!quick) popIn(menuEl, 'scale(.5,.3)');
      inst.yb.setOpen(true);
    } else if (!open && menuEl) {
      const m = menuEl; menuEl = null; inst.yb.setOpen(false);
      if (MOTION.on) m.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.6,.4)', opacity: 0 }], { duration: 180, easing: 'ease-in' }).onfinish = () => m.remove(); else m.remove();
    }
  };
  el.addEventListener('pointerdown', (e) => {
    if (menuEl && !inst.yb.contains(e.target)) menu(false);
    if (al.isOpen() && !al.el.contains(e.target)) al.setOpen(false);
    if (fi && !fl.contains(e.target)) fluffPop(false);
    if (!inst.contains(e.target)) inst.radio.setList?.(false);
    if (fly && !sk.contains(e.target)) flyOpen(false);
    if (lf && !bar.contains(e.target)) loco(false);
  });

  /* Fluff einsammeln: Kugel springt aus der Welt in ihren Slot, schrumpft auf Slot-Größe, rastet ein, Zähler zählt hoch */
  const collect = (i) => {
    if (!MOTION.on || reduced()) { fl.land(i); return; }
    const r0 = el.getBoundingClientRect(), k = r0.width / W || 1, tr = fl.socketOf(i).getBoundingClientRect();
    const tx = (tr.left - r0.left + tr.width / 2) / k, ty = (tr.top - r0.top + tr.height / 2) / k;
    const sx = W * (0.42 + Math.random() * 0.16), sy = H * 0.6 + Math.random() * H * 0.08;
    const b0 = Math.round(Z.ball * 2.4), ball = fluffBall(FLUFF[i], b0, P);
    place(ball, `left:${sx - b0 / 2}px;top:${sy - b0 / 2}px;z-index:60;pointer-events:none;transform-origin:50% 50%`);
    const cx = (sx + tx) / 2 + (Math.random() - 0.5) * W * 0.12, cy = Math.min(sy, ty) - H * 0.16, sE = Z.ball / b0, lift = P ? 12 : 26;
    const tf = (x, y, a, b) => `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${a.toFixed(3)},${b.toFixed(3)})`;
    const kf = [{ transform: tf(0, 0, 1, 1), offset: 0 }, { transform: tf(0, 4, 1.3, 0.7), offset: 0.08 }, { transform: tf(0, -lift, 0.8, 1.25), offset: 0.18 }];
    for (let j = 1; j <= 12; j++) {
      const t = j / 12, u = 1 - t, x = u * u * sx + 2 * u * t * cx + t * t * tx, y = u * u * (sy - lift) + 2 * u * t * cy + t * t * ty;
      const s = 1 + (sE - 1) * Math.pow(t, 1.4), str = 1 + 0.22 * Math.sin(Math.PI * t);
      kf.push({ transform: tf(x - sx, y - sy, s / str, s * str), offset: 0.18 + 0.82 * t });
    }
    ball.animate(kf, { duration: 820, easing: 'cubic-bezier(.35,0,.65,1)', fill: 'forwards' }).onfinish = () => { ball.remove(); fl.land(i); };
  };

  if (cfg.menuOpen) menu(true, true);
  if (cfg.fluffOpen) fluffPop(true, true);
  if (cfg.playlistOpen) inst.radio.setList?.(true, true);
  if (cfg.soundOpen) flyOpen(true, true);
  if (cfg.locoOpen) loco(true, true);
  if (cfg.settingsOpen) overlay(D.settingsOverlay(T, Z, { tab: cfg.settingsTab || 'spiel', onClose: closeOv }));
  if (cfg.viewerOpen) overlay(D.cardViewer(T, Z, { deck, onClose: closeOv }));
  if (cfg.infoOpen) overlay(D.infoOverlay(T, Z, { onClose: closeOv }));
  if (cfg.bagOpen) openBag();
  if (cfg.kfabOpen) openFab({ step: cfg.kfabStep || 1, filled: !!cfg.kfabFilled, card: cfg.kfabCard || null });
  return { el, W, H, Z, api: { collect, setWeapon: (w) => bar.setWeapon(w), weapon: () => bar.weapon(), counts: () => fl.counts() } };
}
