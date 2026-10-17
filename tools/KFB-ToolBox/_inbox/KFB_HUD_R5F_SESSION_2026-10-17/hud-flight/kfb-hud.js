/* KFB HUD R1 · Knet-Plaketten für Gehen / Fahren / Fliegen
 * Look 1:1 aus hud-theme.v1 (Open-World-Styleguide 07.10., 02-knet-hud-bauteile): Lila-Plakette, dunkle Mulde,
 * Pfirsich-Akzentknopf, Knet-Korn (feTurbulence .8 / 3 Okt. / 140 px), 8-Wert-Radien, Neigung −2…+2°.
 * Anordnung aus Racer-HUD v2 (Tacho unten links, Radio als Leiste, Ecken frei, Mitte frei).
 * Kein Audio: das Radio sendet nur Ereignisse an den bestehenden KFB-Audio-Owner (radio.on(...)).
 *
 *   const hud = createHud({ mode: 'walk', palette, host });
 *   hud.setSpeed(kmh) · hud.setAltitude(m) · hud.setThrust(0..1) · hud.setEnergy(0..1)
 *   hud.setFluff(n) · hud.addFluff(k, { from: { x, y } }) · hud.setMode('walk'|'drive'|'fly')
 *   hud.radio.on('music'|'play'|'prev'|'next'|'playlist', fn)
 *   hud.radio.setPlaylists([{ id, label, sub }], activeId) · hud.radio.setMusic(b) · hud.radio.setPlaying(b)
 *   hud.radio.setTrack({ title, artist, index, count }) · hud.radio.setSource(label)
 *   hud.backpack.host (3D-Miniatur hängt der Verbraucher hier ein) · hud.backpack.onOpen(fn) · hud.backpack.setCount(n, max)
 * R2: Radio mit Zurück/Weiter, Pixel-Mono-Lauftext (VT323, 1 Zeichen je 0,25 s, Pause an den Enden), Rucksack-Slot oben links.
 * R3: Radio = Noten-Knopf (Musik an/aus, aus = minifiziert) + Display + Zurück/Play/Weiter + Playlist-Menü.
 *     Events: 'music' {on} · 'play' {playing} · 'prev' · 'next' · 'playlist' {id,index,item}. Mobil: Radio ohne Display oben in der Rucksack-Reihe.
 */

export const HUD_THEME_V1 = {
  plaqueHi: '#C6B8E4', plaque: '#A895D2', plaqueLo: '#7C69AE', socket: '#4A3D6B',
  wellTop: '#221A33', wellBot: '#3D3359',
  accent: '#FFA97A', accentHi: '#FFC3A2', accentLo: '#B87B60', accentSocket: '#7A4A30', accentInk: '#3A2416',
  ink: '#F6F4FA', cream: '#D6CFEA', dim: '#8478A6', primary: '#8E79C4',
  fluff: '#FFF4E2', fluffLo: '#E7D6BD'
};

const F_DISP = "'Bangers','Nunito Sans',system-ui,sans-serif";
const F_MONO = "'JetBrains Mono',ui-monospace,monospace";
const F_TEXT = "'Nunito Sans',system-ui,sans-serif";
const F_PIX = "'VT323',ui-monospace,monospace";
const F_MONO_R = "'JetBrains Mono',ui-monospace,monospace";
const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Bangers&family=JetBrains+Mono:wght@500;700&family=Nunito+Sans:wght@600;800&family=VT323&display=swap';

const GRAIN = (() => {
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='140' height='140' filter='url(#n)'/></svg>";
  return 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '")';
})();

/* ---------- Farbe ---------- */
const hx = (h) => { h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const toHex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
export const mixHex = (a, b, t) => { const A = hx(a), B = hx(b); return toHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); };

/* palette: Teil-Objekt von HUD_THEME_V1 ODER { primary, accent } (wie uiPrimary/uiAccent im Styleguide) —
 * fehlende Töne werden aus den beiden Grundfarben gemischt (Verhältnisse aus hud-theme.v1 zurückgerechnet). */
export function resolvePalette(p) {
  if (!p) return { ...HUD_THEME_V1 };
  const pr = p.primary || HUD_THEME_V1.primary, ac = p.accent || HUD_THEME_V1.accent;
  const derived = (p.primary || p.accent) ? {
    plaqueHi: mixHex(pr, '#ffffff', 0.5), plaque: mixHex(pr, '#ffffff', 0.22), plaqueLo: mixHex(pr, '#000000', 0.12), socket: mixHex(pr, '#000000', 0.48),
    wellTop: mixHex(pr, '#000000', 0.79), wellBot: mixHex(pr, '#000000', 0.58),
    accentHi: mixHex(ac, '#ffffff', 0.3), accentLo: mixHex(ac, '#000000', 0.28), accentSocket: mixHex(ac, '#000000', 0.52), accentInk: mixHex(ac, '#000000', 0.78),
    ink: mixHex(pr, '#ffffff', 0.92), cream: mixHex(pr, '#ffffff', 0.65), dim: mixHex(pr, '#6f6a80', 0.35)
  } : {};
  return { ...HUD_THEME_V1, ...derived, primary: pr, accent: ac, ...p };
}

/* ---------- DOM-Helfer ---------- */
function h(tag, css, kids) {
  const e = document.createElement(tag);
  if (css) e.style.cssText = css;
  if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach((k) => e.append(k));
  return e;
}
function svg(markup, w, hh) { const s = document.createElement('div'); s.style.cssText = `width:${w}px;height:${hh}px;display:grid;place-items:center`; s.innerHTML = markup; return s; }
const rnd = (seed) => () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
/* unregelmäßige Radien: 8 Werte, je Teil fest (Seed), base ± 3 px */
function rad(seed, base) { const r = rnd(seed * 97 + 13); const v = () => Math.max(2, Math.round(base - 3 + r() * 6)); return `${v()}px ${v()}px ${v()}px ${v()}px / ${v()}px ${v()}px ${v()}px ${v()}px`; }
const BLOB = '50% 47% 52% 49% / 49% 52% 48% 51%';

const plaqueCss = (P, r, extra = '') => `background:${GRAIN},linear-gradient(180deg,${P.plaqueHi} 0%,${P.plaque} 60%,${P.plaqueLo} 100%);background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;border-radius:${r};box-shadow:inset 0 2px 2px rgba(255,255,255,.34),inset 0 -3px 6px rgba(40,25,70,.28),0 4px 0 ${P.socket},0 10px 18px rgba(14,9,24,.36);padding:7px;box-sizing:border-box;${extra}`;
const wellCss = (P, r, extra = '') => `background:${GRAIN},linear-gradient(180deg,${P.wellTop},${P.wellBot});background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;border-radius:${r};box-shadow:inset 0 3px 7px rgba(10,6,20,.78);box-sizing:border-box;${extra}`;
const accentFill = (P, dir = '180deg') => `${GRAIN},linear-gradient(${dir},${P.accentHi},${P.accent} 60%,${P.accentLo})`;
const KNOB_SHADOW = (P) => `inset 0 2px 2px rgba(255,255,255,.45),inset 0 -2px 4px rgba(90,40,20,.25),0 2px 0 ${P.accentSocket},0 5px 8px rgba(14,9,24,.3)`;
const KNOB_SHADOW_DOWN = (P) => `inset 0 2px 3px rgba(90,40,20,.35),inset 0 -1px 2px rgba(255,255,255,.25),0 0 0 ${P.accentSocket},0 2px 4px rgba(14,9,24,.25)`;

/* Akzent-Knopf (diegetisch: drückt sich 2 px in den Sockel) */
function knob(P, size, label, face) {
  const b = h('button', `position:relative;width:${size}px;height:${size}px;flex:none;border:0;padding:0;margin:0;border-radius:${BLOB};background:${accentFill(P)};background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;box-shadow:${KNOB_SHADOW(P)};color:${P.accentInk};cursor:pointer;display:grid;place-items:center;transition:transform .08s,box-shadow .08s;touch-action:none;-webkit-tap-highlight-color:transparent`);
  b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
  if (face) b.append(face);
  const down = () => { b.style.transform = 'translateY(2px)'; b.style.boxShadow = KNOB_SHADOW_DOWN(P); };
  const up = () => { b.style.transform = ''; b.style.boxShadow = KNOB_SHADOW(P); };
  b.addEventListener('pointerdown', down); ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => b.addEventListener(ev, up));
  return b;
}
const ICON = {
  play: '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M4 2.4 L11.6 7 L4 11.6 Z" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>',
  pause: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="3" y="2.5" width="3" height="9" rx="1.2" fill="currentColor"/><rect x="8" y="2.5" width="3" height="9" rx="1.2" fill="currentColor"/></svg>',
  tape: '<svg width="16" height="14" viewBox="0 0 16 14"><rect x="1.5" y="2.5" width="13" height="9" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="5.5" cy="7" r="1.5" fill="currentColor"/><circle cx="10.5" cy="7" r="1.5" fill="currentColor"/></svg>',
  note: '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M6.2 3.2 L13 1.8 V11" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.2 3.2 V12.4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><ellipse cx="4.4" cy="12.6" rx="2.4" ry="1.9" fill="currentColor"/><ellipse cx="11.2" cy="11.2" rx="2.4" ry="1.9" fill="currentColor"/></svg>',
  list: '<svg width="14" height="12" viewBox="0 0 14 12"><rect x="1" y="1.6" width="7.4" height="1.9" rx=".9" fill="currentColor"/><rect x="1" y="5.1" width="7.4" height="1.9" rx=".9" fill="currentColor"/><rect x="1" y="8.6" width="5" height="1.9" rx=".9" fill="currentColor"/><path d="M9.8 6.4 L13.2 6.4 L11.5 9 Z" fill="currentColor" stroke="currentColor" stroke-width=".8" stroke-linejoin="round"/></svg>',
  prev: '<svg width="12" height="12" viewBox="0 0 12 12"><rect x="1.6" y="2.2" width="2" height="7.6" rx=".9" fill="currentColor"/><path d="M10.2 2.4 L4.4 6 L10.2 9.6 Z" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/></svg>',
  next: '<svg width="12" height="12" viewBox="0 0 12 12"><rect x="8.4" y="2.2" width="2" height="7.6" rx=".9" fill="currentColor"/><path d="M1.8 2.4 L7.6 6 L1.8 9.6 Z" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/></svg>'
};
function fluffBallCss(P, s) {
  return `width:${s}px;height:${s}px;flex:none;border-radius:52% 48% 50% 50% / 47% 53% 47% 53%;background:${GRAIN},radial-gradient(circle at 38% 32%,#ffffff 0%,${P.fluff} 45%,${P.fluffLo} 100%);background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;box-shadow:0 0 0 1.5px rgba(255,255,255,.45),0 2px 0 rgba(74,61,107,.55),inset 0 -3px 4px rgba(120,90,60,.2)`;
}

/* ======================= Bauteile ======================= */

/* Tacho · Knet-Rundinstrument (104–112 px), Bogen 270°, Ring 13 px, Perle am Bogenende */
function tacho(P, { max = 160, label = 'KM/H', size = 108 } = {}) {
  const S = 'http://www.w3.org/2000/svg';
  const sv = document.createElementNS(S, 'svg'); sv.setAttribute('viewBox', '0 0 100 100'); sv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;overflow:visible';
  const D = 'M23.13 76.87 A38 38 0 1 1 76.87 76.87';
  const ghost = document.createElementNS(S, 'path'); ghost.setAttribute('d', D); ghost.setAttribute('fill', 'none'); ghost.setAttribute('stroke', 'rgba(255,255,255,.08)'); ghost.setAttribute('stroke-width', '11'); ghost.setAttribute('stroke-linecap', 'round');
  const live = document.createElementNS(S, 'path'); live.setAttribute('d', D); live.setAttribute('fill', 'none'); live.setAttribute('stroke', P.accent); live.setAttribute('stroke-width', '11'); live.setAttribute('stroke-linecap', 'round'); live.setAttribute('pathLength', '100'); live.setAttribute('stroke-dasharray', '0 100');
  const shine = document.createElementNS(S, 'path'); shine.setAttribute('d', D); shine.setAttribute('fill', 'none'); shine.setAttribute('stroke', P.accentHi); shine.setAttribute('stroke-width', '3'); shine.setAttribute('stroke-linecap', 'round'); shine.setAttribute('pathLength', '100'); shine.setAttribute('stroke-dasharray', '0 100'); shine.setAttribute('transform', 'translate(-.6 -1.4)'); shine.setAttribute('opacity', '.7');
  const bead = document.createElementNS(S, 'circle'); bead.setAttribute('r', '5'); bead.setAttribute('fill', P.ink); bead.setAttribute('stroke', P.socket); bead.setAttribute('stroke-width', '1.2');
  sv.append(ghost, live, shine, bead);
  const num = h('div', `font:400 34px/1 ${F_DISP};color:${P.ink};letter-spacing:.01em;font-variant-numeric:tabular-nums;text-shadow:0 2px 0 rgba(10,6,20,.35)`, '0');
  const lab = h('div', `font:700 7.5px/1 ${F_MONO};letter-spacing:.14em;color:${P.cream};margin-top:3px;white-space:nowrap`, label);
  const mid = h('div', 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-top:4px', [num, lab]);
  const well = h('div', wellCss(P, '50%', 'position:relative;width:100%;height:100%'), [sv, mid]);
  const el = h('div', plaqueCss(P, '50% 48% 52% 49% / 49% 52% 48% 51%', `width:${size}px;height:${size}px`), [well]);
  let target = 0, disp = -1, M = max;
  const draw = () => {
    const p = Math.max(0, Math.min(1, disp / M));
    live.setAttribute('stroke-dasharray', `${(p * 100).toFixed(2)} 100`);
    shine.setAttribute('stroke-dasharray', `${(p * 100).toFixed(2)} 100`);
    const a = (135 + 270 * p) * Math.PI / 180; bead.setAttribute('cx', (50 + 38 * Math.cos(a)).toFixed(2)); bead.setAttribute('cy', (50 + 38 * Math.sin(a)).toFixed(2));
    num.textContent = String(Math.round(Math.max(0, disp)));
  };
  return {
    el, set(v) { target = Math.max(0, +v || 0); },
    config({ max: mx, label: lb } = {}) { if (mx) M = mx; if (lb) lab.textContent = lb; draw(); },
    snap() { disp = target; draw(); },
    tick(dt) { const d = target - disp; if (Math.abs(d) < 0.05 && disp >= 0) return; disp += d * (1 - Math.exp(-9 * dt)); draw(); }
  };
}

/* Höhenmesser · Knet-Säule, die in der Mulde hochsteigt */
function altimeter(P, { max = 120 } = {}) {
  const ticks = [0.25, 0.5, 0.75].map((f) => h('div', `position:absolute;left:5px;right:5px;bottom:${5 + f * 66}px;height:2px;border-radius:2px;background:rgba(255,255,255,.1)`));
  const fill = h('div', `position:absolute;left:5px;right:5px;bottom:5px;height:8px;border-radius:9px 10px 5px 6px / 9px 9px 4px 5px;background:${GRAIN},linear-gradient(90deg,${P.accentLo},${P.accent} 38%,${P.accentHi} 58%,${P.accent} 78%,${P.accentLo});background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;box-shadow:inset 0 2px 1px rgba(255,255,255,.4),0 -1px 0 rgba(10,6,20,.3)`);
  const well = h('div', wellCss(P, '15px 16px 14px 15px / 16px 15px 15px 14px', 'position:relative;width:30px;height:76px;flex:none'), [...ticks, fill]);
  const num = h('div', `font:400 19px/1 ${F_DISP};color:${P.ink};font-variant-numeric:tabular-nums;text-shadow:0 2px 0 rgba(10,6,20,.3)`, '0');
  const unit = h('div', `font:700 7px/1 ${F_MONO};letter-spacing:.14em;color:${P.socket}`, 'HÖHE M');
  const el = h('div', plaqueCss(P, rad(5, 17), 'width:50px;display:flex;flex-direction:column;align-items:center;gap:4px;padding:7px 7px 6px'), [well, num, unit]);
  let target = 0, disp = -1, M = max;
  const draw = () => { const p = Math.max(0, Math.min(1, disp / M)); fill.style.height = (8 + p * 58).toFixed(1) + 'px'; num.textContent = String(Math.round(Math.max(0, disp))); };
  return { el, set(v) { target = Math.max(0, +v || 0); }, config({ max: mx } = {}) { if (mx) M = mx; }, snap() { disp = target; draw(); },
    tick(dt) { const d = target - disp; if (Math.abs(d) < 0.05 && disp >= 0) return; disp += d * (1 - Math.exp(-6 * dt)); draw(); } };
}

/* Schub-Tank · Düsenflamme (Schub) + fünf Knet-Tropfen (Energie) */
function tank(P) {
  const flame = h('div', `position:absolute;left:50%;bottom:4px;width:15px;height:21px;margin-left:-7.5px;transform-origin:50% 100%;border-radius:50% 50% 50% 50% / 64% 64% 36% 36%;background:${GRAIN},radial-gradient(ellipse at 50% 78%,#FFF1C9 0%,${P.accentHi} 30%,${P.accent} 62%,${P.accentLo} 100%);background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;box-shadow:inset 0 -2px 2px rgba(255,255,255,.35)`);
  const nozzle = h('div', wellCss(P, BLOB, 'position:relative;width:32px;height:32px;flex:none;overflow:hidden'), [flame]);
  const drops = Array.from({ length: 5 }, (_, i) => h('div', `width:13px;height:17px;flex:none;border-radius:50% 50% 50% 50% / 62% 62% 38% 38%;transition:background .2s,box-shadow .2s,transform .2s;transform:rotate(${(i % 2 ? 4 : -3)}deg)`));
  const row = h('div', 'display:flex;gap:5px;align-items:center', drops);
  const lab = h('div', `font:700 7px/1 ${F_MONO};letter-spacing:.14em;color:${P.dim};margin-top:3px`, 'SCHUB · TANK');
  const well = h('div', wellCss(P, rad(9, 12), 'display:flex;flex-direction:column;justify-content:center;padding:4px 9px 5px;height:32px'), [row, lab]);
  const el = h('div', plaqueCss(P, rad(11, 16), 'display:flex;gap:6px;align-items:center;height:46px'), [nozzle, well]);
  let thrust = 0, tdisp = 0, energy = 1, t = 0, lastE = -1;
  const drawE = () => {
    const n = energy * 5;
    drops.forEach((d, i) => {
      const f = Math.max(0, Math.min(1, n - i));
      if (f > 0.02) { d.style.background = `${GRAIN},linear-gradient(180deg,${P.accentHi},${P.accent} 60%,${P.accentLo})`; d.style.backgroundSize = '140px 140px,100% 100%'; d.style.backgroundBlendMode = 'soft-light,normal'; d.style.boxShadow = 'inset 0 2px 1px rgba(255,255,255,.45),0 1px 0 rgba(10,6,20,.4)'; d.style.opacity = String(0.45 + 0.55 * f); }
      else { d.style.background = 'rgba(255,255,255,.07)'; d.style.boxShadow = 'inset 0 2px 3px rgba(10,6,20,.6)'; d.style.opacity = '1'; }
    });
  };
  drawE();
  return {
    el, setThrust(v) { thrust = Math.max(0, Math.min(1, +v || 0)); }, setEnergy(v) { energy = Math.max(0, Math.min(1, +v || 0)); },
    snap() { tdisp = thrust; this.tick(0); },
    tick(dt) {
      t += dt; tdisp += (thrust - tdisp) * (1 - Math.exp(-10 * dt));
      const w = Math.sin(t * 27) * 0.07 * tdisp + Math.sin(t * 11.3) * 0.04 * tdisp;
      const sy = 0.35 + tdisp * 0.85 + w, sx = 1 - (sy - 0.8) * 0.28;
      flame.style.transform = `scale(${sx.toFixed(3)},${sy.toFixed(3)})`;
      flame.style.filter = tdisp < 0.05 ? 'saturate(.25) brightness(.8)' : '';
      if (Math.abs(energy - lastE) > 0.002) { lastE = energy; drawE(); }
    }
  };
}

/* Lauftext wie ein Digitalradio: springt Zeichen für Zeichen (0,25 s), steht 1,8 s an Anfang und Ende. Passt der Text, steht er. */
function ticker(css) {
  const span = h('span', 'display:inline-block;white-space:pre;will-change:transform');
  const box = h('div', css + ';overflow:hidden;white-space:nowrap', [span]);
  let text = '', off = 0, maxOff = 0, t = 0, phase = 'hold0', cw = 0;
  const measure = () => { const sw = span.scrollWidth, bw = box.clientWidth; cw = text.length ? sw / text.length : 0; maxOff = cw && sw > bw + 1 ? Math.ceil((sw - bw) / cw) : 0; };
  const draw = () => { span.style.transform = off ? `translateX(${(-off * cw).toFixed(1)}px)` : ''; };
  return {
    el: box,
    set(s) { s = String(s || '').toUpperCase(); if (s === text) return; text = s; span.textContent = s; off = 0; t = 0; phase = 'hold0'; measure(); draw(); },
    remeasure() { measure(); if (off > maxOff) { off = 0; phase = 'hold0'; } draw(); },
    tick(dt) {
      if (!maxOff) return; t += dt;
      if (phase === 'hold0' && t > 1.8) { phase = 'run'; t = 0; }
      else if (phase === 'run' && t > 0.25) { t = 0; off++; draw(); if (off >= maxOff) phase = 'hold1'; }
      else if (phase === 'hold1' && t > 1.8) { off = 0; t = 0; phase = 'hold0'; draw(); }
    }
  };
}

/* Radio R3 · Noten-Knopf (Musik an/aus) · Pixel-Display · Zurück · Play · Weiter · Playlist-Menü
 * Musik aus → nur der Noten-Knopf bleibt (minifiziert). Musik an → Display und Steuerung klappen auf.
 * mini(on): ohne Display (Mobil). compact(on): kürzeres Display (Fliegen). setEdge('top'|'bottom'): Menü klappt nach unten bzw. oben. */
function radio(P, { stations = [] } = {}) {
  const L = {}; const emit = (ev, d) => (L[ev] || []).forEach((fn) => { try { fn(d); } catch (e) { console.error(e); } });
  const glow = '0 0 6px ' + mixHex(P.accent, '#ffffff', 0.35) + '55';
  const tTitle = ticker(`font:400 17px/1 ${F_PIX};letter-spacing:.02em;color:${mixHex(P.accentHi, '#ffffff', 0.35)};text-shadow:${glow}`);
  const tSub = ticker(`font:400 13px/1 ${F_PIX};letter-spacing:.04em;color:${P.cream};opacity:.85`);
  tTitle.set('–'); tSub.set('–');
  const disp = h('div', wellCss(P, rad(13, 11), 'display:flex;flex-direction:column;justify-content:center;gap:2px;padding:0 9px;height:36px;width:156px;min-width:0;flex:none;transition:width .38s cubic-bezier(.3,1.35,.5,1)'), [tTitle.el, tSub.el]);
  disp.addEventListener('transitionend', () => { tTitle.remeasure(); tSub.remeasure(); });
  const playFace = svg(ICON.play, 14, 14);
  const kNote = knob(P, 34, 'Musik an / aus', svg(ICON.note, 16, 16));
  const kPrev = knob(P, 27, 'Zurück', svg(ICON.prev, 12, 12));
  const kPlay = knob(P, 34, 'Play / Pause', playFace);
  const kNext = knob(P, 27, 'Weiter', svg(ICON.next, 12, 12));
  const kList = knob(P, 27, 'Playlist wählen', svg(ICON.list, 14, 12));
  const ctrls = h('div', 'display:flex;gap:5px;align-items:center', [kPrev, kPlay, kNext, kList]);
  const body = h('div', 'display:flex;gap:8px;align-items:center;overflow:hidden;max-width:0;opacity:0;transition:max-width .42s cubic-bezier(.3,1.1,.5,1),opacity .26s', [disp, ctrls]);
  const menu = h('div', plaqueCss(P, rad(29, 15), `position:absolute;right:0;bottom:calc(100% + 8px);min-width:190px;padding:7px;display:none;flex-direction:column;gap:3px;z-index:3;pointer-events:auto`));
  const el = h('div', plaqueCss(P, rad(17, 17), 'position:relative;display:flex;gap:8px;align-items:center;height:50px;padding:7px 8px 7px 8px'), [kNote, body, menu]);
  let music = false, playing = false, track = null, srcLabel = '', lists = [], active = null, menuOpen = false, isMini = false, isCompact = false;
  const noteIdle = () => { kNote.style.filter = music ? '' : 'saturate(.25) brightness(.92)'; kNote.title = music ? 'Musik aus' : 'Musik an'; };
  const bodyW = () => (isMini ? 4 * 27 + 34 + 15 + 6 : (isCompact ? 98 : 156) + 8 + 4 * 27 + 34 + 15 + 6);
  const drawBody = () => { body.style.maxWidth = music ? bodyW() + 'px' : '0px'; body.style.opacity = music ? '1' : '0'; body.style.pointerEvents = music ? '' : 'none'; disp.style.display = isMini ? 'none' : ''; el.style.paddingRight = music ? '8px' : '8px'; };
  const drawSub = () => { tSub.set(track ? [track.artist, srcLabel, track.count ? `${track.index + 1}/${track.count}` : ''].filter(Boolean).join(' · ') : (srcLabel || '–')); };
  function drawMenu() {
    menu.innerHTML = '';
    menu.append(h('div', `font:700 9px/1 ${F_MONO_R};letter-spacing:.14em;color:${P.socket};padding:4px 6px 5px`, 'PLAYLIST'));
    lists.forEach((p, i) => {
      const on = p.id === active;
      const dot = h('div', `width:8px;height:8px;border-radius:50%;flex:none;background:${on ? P.accent : P.socket};box-shadow:${on ? '0 0 6px ' + P.accent : 'none'}`);
      const row = h('button', wellCss(P, rad(40 + i, 9), `border:0;cursor:pointer;display:flex;align-items:center;gap:8px;padding:7px 9px;text-align:left;font:400 16px/1 ${F_PIX};letter-spacing:.03em;color:${on ? mixHex(P.accentHi, '#ffffff', 0.35) : P.cream}`), [dot, h('span', 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1', String(p.label).toUpperCase()), p.sub ? h('span', `font:400 13px/1 ${F_PIX};color:${P.dim}`, String(p.sub).toUpperCase()) : null]);
      row.type = 'button';
      row.addEventListener('click', (e) => { e.stopPropagation(); active = p.id; setMenu(false); emit('playlist', { id: p.id, index: i, item: p }); });
      menu.append(row);
    });
    if (!lists.length) menu.append(h('div', `font:400 15px/1.2 ${F_PIX};color:${P.dim};padding:6px`, 'KEINE PLAYLIST'));
  }
  function setMenu(on) { menuOpen = !!on && music; menu.style.display = menuOpen ? 'flex' : 'none'; kList.style.filter = menuOpen ? 'brightness(1.08)' : ''; if (menuOpen) { drawMenu(); menu.animate([{ transform: 'scale(.6,.2)', opacity: 0 }, { transform: 'scale(1.04,.96)', opacity: 1, offset: 0.7 }, { transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.3,1.3,.5,1)' }); } }
  const outside = (e) => { if (menuOpen && !el.contains(e.target)) setMenu(false); };
  document.addEventListener('pointerdown', outside, true);
  noteIdle(); drawBody();
  const api = {
    on(ev, fn) { (L[ev] = L[ev] || []).push(fn); return () => api.off(ev, fn); },
    off(ev, fn) { L[ev] = (L[ev] || []).filter((f) => f !== fn); },
    setTrack(t) { track = t ? { ...t } : null; tTitle.set(t ? t.title : '–'); drawSub(); },
    setSource(label) { srcLabel = String(label || ''); drawSub(); },
    setTitle(s) { tTitle.set(s); },
    setPlaylists(list, activeId) { lists = (list || []).map((p) => (typeof p === 'string' ? { id: p, label: p } : p)); if (activeId !== undefined) active = activeId; if (menuOpen) drawMenu(); },
    setActivePlaylist(id) { active = id; if (menuOpen) drawMenu(); },
    setStations(list) { api.setPlaylists(list); },
    setStation(i, name) { api.setSource(name || ''); },
    setMusic(on) { music = !!on; if (!music) setMenu(false); noteIdle(); drawBody(); requestAnimationFrame(() => { tTitle.remeasure(); tSub.remeasure(); }); },
    setPlaying(b) { playing = !!b; playFace.innerHTML = playing ? ICON.pause : ICON.play; if (playing && !music) api.setMusic(true); },
    openMenu(on = true) { setMenu(on); },
    get state() { return { music, playing, playlist: active, track, menuOpen }; }
  };
  if (stations.length) api.setPlaylists(stations);
  kNote.addEventListener('click', () => { api.setMusic(!music); emit('music', { on: music }); if (music && !playing) { api.setPlaying(true); emit('play', { playing: true }); } if (!music && playing) { playing = false; playFace.innerHTML = ICON.play; emit('play', { playing: false }); } });
  kPrev.addEventListener('click', () => emit('prev', {}));
  kNext.addEventListener('click', () => emit('next', {}));
  kPlay.addEventListener('click', () => { api.setPlaying(!playing); emit('play', { playing }); });
  kList.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!menuOpen); });
  return {
    el, api,
    compact(on) { isCompact = !!on; disp.style.width = on ? '98px' : '156px'; drawBody(); requestAnimationFrame(() => { tTitle.remeasure(); tSub.remeasure(); }); },
    mini(on) { isMini = !!on; drawBody(); },
    setEdge(edge) { menu.style.bottom = edge === 'top' ? 'auto' : 'calc(100% + 8px)'; menu.style.top = edge === 'top' ? 'calc(100% + 8px)' : 'auto'; menu.style.right = edge === 'top' ? 'auto' : '0'; menu.style.left = edge === 'top' ? '0' : 'auto'; },
    snap() { tTitle.remeasure(); tSub.remeasure(); },
    tick(dt) { tTitle.tick(dt); tSub.tick(dt); },
    dispose() { document.removeEventListener('pointerdown', outside, true); }
  };
}

/* Rucksack-Slot · Mulde für die 3D-Miniatur (der Verbraucher hängt sein Canvas in .host), Zähler, Klick öffnet */
function backpack(P) {
  const host = h('div', 'position:absolute;inset:0;display:grid;place-items:center');
  const well = h('div', wellCss(P, BLOB, 'position:relative;width:52px;height:52px;flex:none;overflow:hidden'), [host]);
  const cnt = h('div', `position:absolute;right:-5px;bottom:-4px;min-width:20px;height:18px;padding:0 5px;box-sizing:border-box;border-radius:${BLOB};background:${accentFill(P)};background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;box-shadow:${KNOB_SHADOW(P)};font:400 15px/18px ${F_PIX};color:${P.accentInk};text-align:center`, '0');
  const el = h('button', plaqueCss(P, '48% 52% 50% 50% / 52% 48% 52% 48%', 'position:relative;border:0;cursor:pointer;display:grid;place-items:center;width:66px;height:66px;transition:transform .12s'), [well, cnt]);
  el.type = 'button'; el.title = 'Rucksack öffnen (B)'; el.setAttribute('aria-label', 'Rucksack öffnen');
  const L = [];
  el.addEventListener('click', () => L.forEach((f) => f()));
  el.addEventListener('pointerdown', () => { el.style.transform = 'translateY(2px) scale(.97)'; });
  ['pointerup', 'pointerleave'].forEach((ev) => el.addEventListener(ev, () => { el.style.transform = ''; }));
  return {
    el, host,
    api: {
      host, el,
      onOpen(fn) { L.push(fn); return () => { const i = L.indexOf(fn); if (i >= 0) L.splice(i, 1); }; },
      setCount(n, max) { cnt.textContent = String(n); cnt.title = `${n} von ${max || 20} Fächern belegt`; },
      setOpen(b) { well.style.boxShadow = b ? `inset 0 3px 7px rgba(10,6,20,.78),0 0 0 2px ${P.accent}` : ''; },
      pop() { el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.16,.88)', offset: 0.35 }, { transform: 'scale(.94,1.06)', offset: 0.7 }, { transform: 'none' }], { duration: 380, easing: 'ease-out' }); }
    },
    tick() {}
  };
}

/* Fluff-Zähler · Fluff-Kugel + weich hochzählende Bangers-Zahl */
function fluff(P) {
  const ball = h('div', fluffBallCss(P, 26) + ';transform-origin:50% 80%');
  const num = h('div', `font:400 26px/1 ${F_DISP};color:${P.ink};letter-spacing:.02em;font-variant-numeric:tabular-nums;min-width:2.3em;text-align:right;transform-origin:60% 60%;text-shadow:0 2px 0 rgba(10,6,20,.35)`, '0');
  const well = h('div', wellCss(P, rad(7, 12), 'display:flex;align-items:center;justify-content:flex-end;padding:3px 11px 0 10px;height:32px'), [num]);
  const el = h('div', plaqueCss(P, rad(3, 17), 'display:flex;align-items:center;gap:8px;height:46px;padding:7px 7px 7px 9px'), [ball, well]);
  let target = 0, disp = 0, shown = 0, lastBounce = 0, t = 0;
  const bounce = () => { if (t - lastBounce < 0.09) return; lastBounce = t; num.animate([{ transform: 'scale(1.2,.88) translateY(1px)' }, { transform: 'scale(.95,1.06) translateY(-1px)', offset: 0.45 }, { transform: 'none' }], { duration: 240, easing: 'ease-out' }); };
  const squash = () => ball.animate([{ transform: 'scale(1.3,.68)' }, { transform: 'scale(.9,1.12)', offset: 0.5 }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.3,1.5,.5,1)' });
  return {
    el, ball,
    set(n) { target = Math.max(0, Math.round(+n || 0)); },
    get target() { return target; },
    snap() { disp = shown = target; num.textContent = String(target); },
    squash,
    tick(dt) {
      t += dt; if (disp === target) return;
      const d = target - disp, step = Math.max(Math.abs(d) * (1 - Math.exp(-5 * dt)), dt * 9);
      disp = d > 0 ? Math.min(target, disp + step) : Math.max(target, disp - step);
      const s = Math.round(disp); if (s !== shown) { shown = s; num.textContent = String(s); bounce(); }
    }
  };
}

/* Kompass + Inselname (nur Gehen) */
function compass(P, { island = '' } = {}) {
  const needle = h('div', `position:absolute;left:50%;top:50%;width:8px;height:24px;margin:-12px 0 0 -4px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:linear-gradient(180deg,${P.accent} 0 50%,${P.cream} 50% 100%)`);
  const hub = h('div', `position:absolute;left:50%;top:50%;width:5px;height:5px;margin:-2.5px 0 0 -2.5px;border-radius:50%;background:${P.socket}`);
  const rose = h('div', 'position:absolute;inset:0;transition:transform .25s ease-out', [needle]);
  const dial = h('div', wellCss(P, BLOB, 'position:relative;width:32px;height:32px;flex:none'), [rose, hub]);
  const lab = h('div', `font:700 7px/1 ${F_MONO};letter-spacing:.16em;color:${P.socket}`, 'INSEL');
  const name = h('div', `font:400 18px/1 ${F_DISP};color:${P.ink};letter-spacing:.03em;white-space:nowrap;text-shadow:0 2px 0 rgba(40,25,70,.35)`, island || '—');
  const txt = h('div', 'display:flex;flex-direction:column;gap:3px;padding-right:6px', [lab, name]);
  const el = h('div', plaqueCss(P, rad(23, 17), 'display:flex;align-items:center;gap:9px;height:46px'), [dial, txt]);
  return { el, setHeading(r) { rose.style.transform = `rotate(${(-(+r || 0) * 180 / Math.PI).toFixed(1)}deg)`; }, setIsland(s) { name.textContent = s || '—'; }, tick() {} };
}

export const HudParts = { tacho, altimeter, tank, radio, fluff, compass, backpack, ticker, plaqueCss, wellCss, GRAIN, F_PIX };

/* ======================= HUD ======================= */
const LAYOUT = {
  walk: { pack: 'tl', compass: 'tl', fluff: 'tr' },
  drive: { pack: 'tl', fluff: 'tr', tacho: 'bl', radio: 'br' },
  fly: { pack: 'tl', fluff: 'tr', tacho: 'bl', alt: 'bl', tank: 'bl', radio: 'br' }
};
const ORDER = ['pack', 'compass', 'tacho', 'alt', 'tank', 'radio', 'fluff'];
const TILT = { pack: 1.6, compass: -1.2, tacho: 0, alt: 1.4, tank: -0.8, radio: 0.9, fluff: -1.6 };
const ENTER = { duration: 520, easing: 'cubic-bezier(.25,.9,.35,1)' };
const EXIT = { duration: 340, easing: 'cubic-bezier(.55,0,.85,.55)' };

function frames(kind, group) {
  const top = group[0] === 't', dir = top ? -1 : 1;
  if (kind === 'roll') return [{ transform: 'translateX(-170%) rotate(-230deg)' }, { transform: 'translateX(7%) rotate(9deg)', offset: 0.72 }, { transform: 'none' }];
  if (kind === 'plop') return [{ transform: 'scale(.2,0)', opacity: 0 }, { transform: 'scale(.88,1.2)', opacity: 1, offset: 0.55 }, { transform: 'scale(1.08,.92)', offset: 0.8 }, { transform: 'none' }];
  return [{ transform: `translateY(${dir * 150}%) rotate(${-dir * 5}deg) scale(.9,1.1)`, opacity: 0 }, { transform: `translateY(${-dir * 8}%) rotate(${dir}deg) scale(1.07,.93)`, opacity: 1, offset: 0.68 }, { transform: 'none' }];
}
const KIND = { pack: 'plop', tacho: 'roll', alt: 'plop', tank: 'rise', radio: 'rise', fluff: 'rise', compass: 'rise' };

export function createHud({ mode = 'walk', palette, host = null, driveMax = 160, flyMax = 220, altMax = 120, island = '', stations = [], autoTick = true, fonts = true } = {}) {
  if (fonts && !document.querySelector('link[data-kfb-hud-fonts]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONT_HREF; l.dataset.kfbHudFonts = '1'; document.head.appendChild(l); }
  const P = resolvePalette(palette);
  const el = h('div', `position:absolute;inset:0;pointer-events:none;overflow:hidden;font-family:${F_TEXT};-webkit-font-smoothing:antialiased;user-select:none;-webkit-user-select:none;z-index:2`);
  el.setAttribute('data-kfb-hud', 'r1');
  const G = {};
  const gcss = { tl: 'left:16px;top:14px;align-items:flex-start;transform-origin:0 0', tr: 'right:16px;top:14px;align-items:flex-start;flex-direction:row-reverse;transform-origin:100% 0', bl: 'left:16px;bottom:16px;align-items:flex-end;transform-origin:0 100%', br: 'right:16px;bottom:16px;align-items:flex-end;flex-direction:row-reverse;transform-origin:100% 100%' };
  for (const k of Object.keys(gcss)) { G[k] = h('div', `position:absolute;display:flex;gap:9px;${gcss[k]}`); el.append(G[k]); }

  const parts = {
    compass: compass(P, { island }), fluff: fluff(P), tacho: tacho(P, { max: driveMax }),
    alt: altimeter(P, { max: altMax }), tank: tank(P), radio: radio(P, { stations }), pack: backpack(P)
  };
  const slots = {};
  for (const k of ORDER) {
    parts[k].el.style.transform = `rotate(${TILT[k]}deg)`;
    slots[k] = h('div', `display:none;pointer-events:${k === 'radio' || k === 'pack' ? 'auto' : 'none'};flex:none`, [parts[k].el]);
    slots[k].dataset.part = k;
  }

  let cur = null, narrow = false, anims = [], scale = 1;
  /* schmal: Radio rückt ohne Display in die obere Reihe neben den Rucksack – eine Zeile, unten bleibt die Figur frei */
  const layoutFor = (m) => { const L = { ...LAYOUT[m] }; if (narrow && L.radio) L.radio = 'tl'; return L; };
  const where = {};
  const place = (k, g) => { where[k] = g; };
  const reflow = () => { for (const g of Object.keys(G)) for (const k of ORDER) if (where[k] === g && slots[k].parentNode !== G[g]) G[g].append(slots[k]); for (const g of Object.keys(G)) { const kids = ORDER.filter((k) => where[k] === g); kids.forEach((k) => G[g].append(slots[k])); } };
  const killAnims = () => { anims.forEach((a) => { try { a.cancel(); } catch (e) {} }); anims = []; };

  function applyModeConfig(m) {
    parts.tacho.config(m === 'fly' ? { max: flyMax, label: 'LUFT · KM/H' } : { max: driveMax, label: 'KM/H' });
    parts.radio.compact(m === 'fly' && !narrow);
    parts.radio.mini(narrow);
    parts.radio.setEdge(narrow ? 'top' : 'bottom');
  }

  function setMode(m, { instant = false, freezeAt = null } = {}) {
    if (!LAYOUT[m]) return;
    const from = cur; cur = m;
    killAnims();
    const L = layoutFor(m), Lf = from ? layoutFor(from) : {};
    applyModeConfig(m);
    if (instant || !from || from === m) {
      for (const k of ORDER) { if (L[k]) { place(k, L[k]); slots[k].style.display = ''; } else { slots[k].style.display = 'none'; delete where[k]; } }
      reflow(); return [];
    }
    const exits = ORDER.filter((k) => Lf[k] && !L[k]), enters = ORDER.filter((k) => L[k] && !Lf[k]);
    for (const k of ORDER) if (L[k] && Lf[k]) place(k, L[k]);
    exits.forEach((k, i) => {
      const rev = frames(KIND[k], Lf[k]).slice().reverse().map((f) => (f.offset != null ? { ...f, offset: 1 - f.offset } : f));
      const a = slots[k].animate(rev, { ...EXIT, delay: i * 60, fill: 'both' });
      a.onfinish = () => { if (freezeAt == null) { slots[k].style.display = 'none'; delete where[k]; try { a.cancel(); } catch (e) {} } };
      anims.push(a);
    });
    const d0 = exits.length ? 170 : 0;
    enters.forEach((k, i) => {
      place(k, L[k]); slots[k].style.display = '';
      slots[k].style.transformOrigin = KIND[k] === 'plop' ? '50% 100%' : '50% 50%';
      anims.push(slots[k].animate(frames(KIND[k], L[k]), { ...ENTER, delay: d0 + i * 85, fill: 'backwards' }));
    });
    reflow();
    if (freezeAt != null) {
      const total = transitionLength(exits.length, enters.length);
      anims.forEach((a) => { a.pause(); a.currentTime = Math.max(0, Math.min(1, freezeAt)) * total; });
    }
    return anims;
  }
  const transitionLength = (ne, ni) => Math.max(ne ? (ne - 1) * 60 + EXIT.duration : 0, ni ? (ne ? 170 : 0) + (ni - 1) * 85 + ENTER.duration : 0);

  /* Größe: Desktop 1:1 ab ~1180 px, darunter bis 0,62; schmal (< 620 px) wandert das Radio nach oben links */
  const fit = () => {
    const w = el.clientWidth || 1, hh = el.clientHeight || 1;
    scale = Math.max(0.62, Math.min(1, Math.min(w / 1180, hh / 640)));
    for (const g of Object.keys(G)) G[g].style.transform = scale < 1 ? `scale(${scale.toFixed(3)})` : '';
    /* schmal ODER untere Reihe würde kollidieren → Radio nach oben links. Gemessen am Host, nicht am Fenster. */
    /* volle Radiobreite (Musik an, mit Display) – nur im breiten Zustand messen, sonst springt es hin und her */
    const rW = Math.max(lastRW, narrow ? 0 : slots.radio.offsetWidth, 420); if (!narrow) lastRW = rW;
    const n = w < 620 || (G.bl.offsetWidth + rW) * scale + 56 > w;
    if (n !== narrow) { narrow = n; if (cur) setMode(cur, { instant: true }); }
  };
  let lastRW = 0;
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
  if (ro) ro.observe(el);

  /* Fluff-Kugel springt ins Zählwerk */
  function addFluff(k = 1, { from = null, stagger = 110 } = {}) {
    const f = parts.fluff, base = f.target;
    const inc = (n) => f.set(Math.max(f.target, base + n));
    if (!from || !el.isConnected) { inc(k); return; }
    for (let i = 0; i < k; i++) setTimeout(() => {
      const R = el.getBoundingClientRect(), T = f.ball.getBoundingClientRect();
      const z = R.width / (el.clientWidth || R.width) || 1; /* Host darf skaliert sein (Tafel-Zoom, CSS-Transform) */
      const x0 = from.x, y0 = from.y, x1 = (T.left - R.left + T.width / 2) / z, y1 = (T.top - R.top + T.height / 2) / z;
      const cx = (x0 + x1) / 2 + (x0 < x1 ? -40 : 40), cy = Math.min(y0, y1) - 110 - Math.random() * 40;
      const s = 20 * scale;
      const b = h('div', fluffBallCss(P, s) + `;position:absolute;left:${-s / 2}px;top:${-s / 2}px;pointer-events:none;z-index:6`);
      el.append(b);
      const pts = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => { const u = 1 - t; return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1, t]; });
      const kf = pts.map(([x, y, t]) => ({ transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${(t < 0.15 ? 0.4 + t * 5 : t > 0.85 ? 1.15 - (t - 0.85) * 2.5 : 1.15).toFixed(2)},${(t < 0.15 ? 0.4 + t * 5 : t > 0.85 ? 0.95 : 1.05).toFixed(2)})`, offset: t }));
      const a = b.animate(kf, { duration: 640, easing: 'cubic-bezier(.35,0,.65,1)', fill: 'forwards' });
      a.onfinish = () => { b.remove(); f.squash(); inc(i + 1); };
    }, i * stagger);
  }

  let raf = 0, last = 0, alive = true;
  const tick = (dt) => { for (const k of ORDER) parts[k].tick(dt); };
  const loop = (now) => { if (!alive) return; const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now; tick(dt); raf = requestAnimationFrame(loop); };
  if (autoTick) raf = requestAnimationFrame(loop);

  if (host) host.append(el);
  setMode(mode, { instant: true });
  fit(); requestAnimationFrame(fit);

  const hud = {
    el, palette: P, parts,
    setSpeed: (v) => parts.tacho.set(v),
    setAltitude: (v) => parts.alt.set(v),
    setThrust: (t) => parts.tank.setThrust(t),
    setEnergy: (e) => parts.tank.setEnergy(e),
    setFluff: (n) => parts.fluff.set(n),
    addFluff,
    setHeading: (r) => parts.compass.setHeading(r),
    setIsland: (s) => parts.compass.setIsland(s),
    setMode, getMode: () => cur,
    radio: parts.radio.api,
    backpack: parts.pack.api,
    /* Prüf-/Tafel-Hilfe: Wechsel from → to bei t (0..1) einfrieren */
    freezeTransition(from, to, t) { setMode(from, { instant: true }); return setMode(to, { freezeAt: t }); },
    snap() { for (const k of ORDER) parts[k].snap && parts[k].snap(); fit(); },
    tick, fit,
    get scale() { return scale; },
    dispose() { alive = false; cancelAnimationFrame(raf); killAnims(); ro && ro.disconnect(); parts.radio.dispose(); el.remove(); }
  };
  return hud;
}
