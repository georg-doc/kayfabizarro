// B2 Figuren-Wähler (Steuerung 11.10.): built from the HUD R3 bag overlay (createBagOverlay: veil, plaque body + flap with
// title / count / ✕ knob, well grid, detail column with preview well, name, note, source line, buttons) and its prop renderer
// (createPropRenderer via the game HUD's lazy view: thumbnails as stills, the selected figure turning in the preview well).
// New here, because the bag is a fixed 20-slot item list: group tabs (A–E) and a scrolling grid of 68 figures; the status badge
// says where the eyes come from (PASS · vorläufig · Kandidat · Original-Augen · FrizzleBob).
import * as THREE from 'three';
// @ts-ignore – HUD R3, vendored 1:1
import { HudParts, mixHex } from './vendor/kfb-hud.js';
import { loadFigureCatalog, buildPlayable, GROUPS, type FigureEntry, type PlayableFigure } from '../residents/figure-b2';

const F_DISP = "'Bangers','Nunito Sans',system-ui,sans-serif";
const F_MONO = "'JetBrains Mono',ui-monospace,monospace";
const F_TEXT = "'Nunito Sans',system-ui,sans-serif";
const BADGE: Record<FigureEntry['group'], string> = { A: 'PASS', B: 'VORLÄUFIG', C: 'KANDIDAT', D: 'ORIGINAL-AUGEN', E: 'FRIZZLEBOB' };
type View = { render(obj: any, target: HTMLCanvasElement, o?: any): void };

export function createFigurePicker(o: { host: HTMLElement; palette: any; view: View; onPick: (id: string, variant: number) => Promise<any> | void }) {
  const P = o.palette, dpr = Math.min(2, window.devicePixelRatio || 1);
  const el = (tag: string, css: string, kids: (Node | string)[] = []) => { const e = document.createElement(tag); e.style.cssText = css; e.append(...kids); return e; };
  const L: Record<string, ((d: any) => void)[]> = {}; const emit = (ev: string, d?: any) => (L[ev] || []).forEach((fn) => fn(d));
  let cat: FigureEntry[] = [], group: FigureEntry['group'] = 'A', sel: FigureEntry | null = null, current = 'farmer_a', isOpen = false, t = 0, variant = 0;
  const shots: Record<string, string> = {}, cells: Record<string, HTMLButtonElement> = {};
  let live: { id: string; F: PlayableFigure; holder: THREE.Group } | null = null;

  const root = el('div', `position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 55%,rgba(20,14,32,.18),rgba(20,14,32,.55));pointer-events:auto;z-index:8;font-family:${F_TEXT};-webkit-font-smoothing:antialiased;user-select:none`);
  root.setAttribute('data-kfb-figures', 'b2');
  const scaler = el('div', 'position:relative;transform-origin:50% 50%'); root.append(scaler);
  const flapTitle = el('div', `font:400 30px/1 ${F_DISP};letter-spacing:.04em;color:${P.ink};text-shadow:0 2px 0 rgba(10,6,20,.35)`, ['FIGUREN']);
  const flapCount = el('div', `font:400 20px/1 ${HudParts.F_PIX};color:${P.cream}`);
  const knobX = el('button', `width:30px;height:30px;border:0;border-radius:50% 47% 52% 49% / 49% 52% 48% 51%;background:${HudParts.GRAIN},linear-gradient(180deg,${P.accentHi},${P.accent} 60%,${P.accentLo});background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;box-shadow:inset 0 2px 2px rgba(255,255,255,.45),0 2px 0 ${P.accentSocket};color:${P.accentInk};font:800 16px/30px ${F_TEXT};cursor:pointer;padding:0`, ['✕']) as HTMLButtonElement;
  knobX.type = 'button'; knobX.title = 'Schließen (C / Esc)'; knobX.addEventListener('click', () => close());
  const flap = el('div', HudParts.plaqueCss({ ...P, plaqueHi: P.plaque, plaque: P.plaqueLo, plaqueLo: mixHex(P.plaqueLo, '#000', 0.15) }, '34px 38px 14px 16px / 30px 34px 12px 14px', 'position:absolute;left:30px;right:30px;top:-44px;height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 14px 10px 20px;z-index:2'), [el('div', 'display:flex;align-items:baseline;gap:12px', [flapTitle, flapCount]), knobX]);
  // group tabs: chips in a well (as the MODUS plaque)
  const chipCss = `font:400 15px/1 ${F_DISP};letter-spacing:.05em;padding:6px 9px 4px;border-radius:9px 11px 8px 10px / 10px 8px 11px 9px;cursor:pointer;border:0;background:transparent`;
  const tabs: Record<string, HTMLButtonElement> = {};
  const tabRow = el('div', HudParts.wellCss(P, '12px 14px 11px 13px / 13px 11px 14px 12px', 'display:flex;gap:3px;padding:3px;width:max-content'));
  for (const g of ['A', 'B', 'C', 'D', 'E'] as const) { const b = el('button', chipCss, [g + ' · ' + BADGE[g]]) as HTMLButtonElement; b.type = 'button'; b.title = GROUPS[g]; b.addEventListener('click', () => { group = g; drawGrid(); }); tabs[g] = b; tabRow.append(b); }
  const groupNote = el('div', `font:700 9px/1.3 ${F_MONO};letter-spacing:.12em;color:${P.socket}`);
  const grid = el('div', 'display:grid;grid-template-columns:repeat(6,64px);grid-auto-rows:64px;gap:8px;padding:4px 6px 6px 2px');
  const scroll = el('div', 'max-height:296px;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin', [grid]);
  const left = el('div', 'display:flex;flex-direction:column;gap:10px', [tabRow, groupNote, scroll]);
  // detail column (bag: preview well, name, note, source, actions)
  const pv = document.createElement('canvas'); pv.width = Math.round(236 * dpr); pv.height = Math.round(236 * dpr); pv.style.cssText = 'width:236px;height:236px;display:block';
  const pvWell = el('div', HudParts.wellCss(P, '18px 22px 16px 20px / 20px 16px 22px 18px', 'position:relative;width:236px;height:236px;overflow:hidden'), [pv]);
  const dName = el('div', `font:400 26px/1 ${F_DISP};letter-spacing:.03em;color:${P.ink};text-shadow:0 2px 0 rgba(10,6,20,.3)`);
  const dBadge = el('div', `align-self:flex-start;font:400 14px/1 ${F_DISP};letter-spacing:.06em;padding:5px 8px 3px;border-radius:8px 10px 7px 9px;color:${P.accentInk};background:linear-gradient(180deg,${P.accentHi},${P.accent} 60%,${P.accentLo})`);
  const dNote = el('div', `font:600 12.5px/1.4 ${F_TEXT};color:${P.wellTop};text-wrap:pretty`);
  const dSrc = el('div', `font:500 9.5px/1.4 ${F_MONO};letter-spacing:.06em;color:${P.socket}`);
  const dAct = el('div', 'display:flex;flex-wrap:wrap;gap:6px');
  const detail = el('div', 'display:flex;flex-direction:column;gap:8px;width:236px', [pvWell, dName, dBadge, dNote, dSrc, dAct]);
  const body = el('div', HudParts.plaqueCss(P, '30px 34px 40px 36px / 26px 30px 44px 40px', 'position:relative;display:flex;gap:18px;padding:30px 20px 20px;z-index:1'), [left, detail]);
  scaler.append(el('div', 'position:relative', [body, flap]));
  o.host.append(root);
  const btnCss = (primary: boolean) => primary
    ? `border:0;border-radius:12px 14px 11px 13px / 13px 11px 14px 12px;padding:9px 12px;font:800 13px/1 ${F_TEXT};cursor:pointer;color:${P.accentInk};background:${HudParts.GRAIN},linear-gradient(180deg,${P.accentHi},${P.accent} 60%,${P.accentLo});background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;box-shadow:inset 0 2px 2px rgba(255,255,255,.45),0 3px 0 ${P.accentSocket}`
    : `border:0;border-radius:12px 14px 11px 13px / 13px 11px 14px 12px;padding:9px 12px;font:800 13px/1 ${F_TEXT};cursor:pointer;color:${P.ink};background:${P.socket};box-shadow:inset 0 2px 3px rgba(10,6,20,.5)`;
  const btn = (label: string, primary: boolean, fn: () => void) => { const b = el('button', btnCss(primary), [label]) as HTMLButtonElement; b.type = 'button'; b.addEventListener('click', fn); return b; };

  /** a built figure, framed for the prop renderer (it frames ≈ 1 unit at the origin): height → 1.7, feet centred under */
  const frame = (F: PlayableFigure) => {
    F.mixer.update(0.4); F.obj.updateMatrixWorld(true);
    const b = new THREE.Box3().setFromObject(F.obj), s = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3()), k = 1.7 / Math.max(s.y, 1e-3);
    const holder = new THREE.Group(), inner = new THREE.Group(); inner.add(F.obj); inner.scale.setScalar(k); inner.position.set(-c.x * k, -c.y * k, -c.z * k); holder.add(inner);
    return holder;
  };
  // thumbnails: one build at a time, as stills (the bag's ensureModel → shots)
  let chain: Promise<void> = Promise.resolve();
  const thumb = (e: FigureEntry) => { if (shots[e.id]) return; shots[e.id] = 'pending'; chain = chain.then(async () => {
    try { const F = await buildPlayable(e), hld = frame(F), c = document.createElement('canvas'); c.width = c.height = Math.round(58 * dpr);
      o.view.render(hld, c, { rotY: 0.45, tilt: 0.08, zoom: 1.0 }); shots[e.id] = c.toDataURL(); F.dispose(); drawCell(e); }
    catch (err) { console.warn('[figures] thumb', e.id, err); shots[e.id] = 'fail'; drawCell(e); } }); };
  const drawCell = (e: FigureEntry) => {
    const c = cells[e.id]; if (!c) return; c.innerHTML = '';
    const on = sel?.id === e.id, cur = current === e.id;
    c.style.boxShadow = on ? `inset 0 3px 7px rgba(10,6,20,.78),0 0 0 2.5px ${P.accent}` : ''; c.style.transform = on ? 'translateY(-2px)' : '';
    const s = shots[e.id];
    if (s && s !== 'pending' && s !== 'fail') { const im = new Image(); im.src = s; im.style.cssText = 'width:58px;height:58px;pointer-events:none'; c.append(im); }
    else c.append(el('div', `width:22px;height:22px;border-radius:50% 47% 52% 49% / 49% 52% 48% 51%;background:${P.socket};opacity:.7`));
    if (cur) c.append(el('div', `position:absolute;right:4px;top:4px;width:8px;height:8px;border-radius:50%;background:${P.accent};box-shadow:0 0 6px ${P.accent}`));
  };
  const drawGrid = () => {
    for (const [g, b] of Object.entries(tabs)) { const on = g === group; b.style.background = on ? `linear-gradient(180deg,${P.accentHi},${P.accent} 60%,${P.accentLo})` : 'transparent'; b.style.color = on ? P.accentInk : P.cream; }
    const list = cat.filter((e) => e.group === group);
    groupNote.textContent = GROUPS[group].toUpperCase() + ' · ' + list.length;
    grid.innerHTML = ''; for (const k of Object.keys(cells)) delete cells[k];
    list.forEach((e, i) => {
      const c = el('button', HudParts.wellCss(P, `${14 + (i * 7) % 5}px ${16 - (i * 3) % 5}px ${15 + (i * 5) % 4}px ${13 + (i * 11) % 5}px`, 'position:relative;border:0;padding:0;cursor:pointer;display:grid;place-items:center;transition:transform .12s')) as HTMLButtonElement;
      c.type = 'button'; c.title = e.label; c.dataset.fig = e.id; c.addEventListener('click', () => select(e)); cells[e.id] = c; grid.append(c); drawCell(e); thumb(e);
    });
  };
  const drawDetail = () => {
    dAct.innerHTML = ''; if (!sel) return; const e = sel;
    dName.textContent = e.label.replace(/_/g, ' '); dBadge.textContent = BADGE[e.group];
    const eyes = e.eyes.mode === 'anchored' ? 'Augen an Ankern · Lid ' + (e.eyes.skin ?? e.skin) : e.eyes.mode === 'dxdy' ? 'Augen dx/dy (Profil ' + e.eyes.profile + ')' : e.eyes.mode === 'own' ? 'FB-Augen im Modell' : 'eigene Augen des Modells';
    dNote.textContent = `${e.rig === 'Legacy' ? 'Legacy-Rig' : 'Rig_' + e.rig} · ${eyes}${e.note ? ' · ' + e.note : ''}`;
    dSrc.textContent = e.eyes.source.toUpperCase();
    e.variants.forEach((_, i) => dAct.append(btn(e.variants.length > 1 ? 'Textur ' + String.fromCharCode(65 + i) : 'Textur', i === variant && !!live, () => { variant = i; live?.F.setVariant(i); drawDetail(); })));
    const playing = current === e.id;
    dAct.append(btn(playing ? 'Gespielt' : 'Spielen', !playing, async () => { current = e.id; drawDetail(); for (const x of cat) drawCell(x); await o.onPick(e.id, variant); emit('pick', { id: e.id, variant }); }));
  };
  const select = async (e: FigureEntry) => {
    const prev = sel; sel = e; variant = 0; if (prev) drawCell(prev); drawCell(e); drawDetail();
    if (live?.id === e.id) return;
    live?.F.dispose(); live = null;
    const F = await buildPlayable(e); if (sel !== e) { F.dispose(); return; }
    live = { id: e.id, F, holder: frame(F) }; drawDetail();
  };
  const fit = () => { const w = o.host.clientWidth || 1280, hh = o.host.clientHeight || 720; scaler.style.transform = `scale(${Math.max(0.3, Math.min(1, (w - 24) / 780, (hh - 30) / 520)).toFixed(3)})`; };
  async function open() {
    if (isOpen) return; isOpen = true; root.style.display = 'flex'; fit();
    if (!cat.length) cat = await loadFigureCatalog();
    flapCount.textContent = `${cat.length} FIGUREN`;
    const cur = cat.find((x) => x.id === current); if (cur) group = cur.group;
    drawGrid(); if (!sel && cur) select(cur); emit('open');
  }
  function close() { if (!isOpen) return; isOpen = false; root.style.display = 'none'; live?.F.dispose(); live = null; sel = null; emit('close'); }
  addEventListener('resize', () => isOpen && fit());
  return {
    open, close, toggle: () => (isOpen ? close() : open()),
    get isOpen() { return isOpen; },
    on(ev: string, fn: (d: any) => void) { (L[ev] ||= []).push(fn); },
    setCurrent(id: string) { current = id; },
    select: (id: string) => { const e = cat.find((x) => x.id === id); if (e) { group = e.group; drawGrid(); return select(e); } },
    /** the selected figure turns in the preview well (the bag's preview); idle clip runs */
    tick(dt: number) { if (!isOpen || !live) return; t += dt; live.F.update(dt); o.view.render(live.holder, pv, { rotY: 0.6 + t * 0.5, tilt: 0.06, zoom: 0.6 }); },
    thumbsDone: () => Object.values(shots).filter((s) => s !== 'pending').length,
  };
}
