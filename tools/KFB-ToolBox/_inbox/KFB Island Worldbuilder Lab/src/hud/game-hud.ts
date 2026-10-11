// Spiel-Oberfläche (5) · Steuerung 10.10. spät: the Claude Design HUD R3 is taken over 1:1 (src/hud/vendor, see SOURCE.md),
// incl. the backpack overlay. This file is only the Lab wiring:
//   · HUD mode from the travel state (WALK → walk, AUTO → drive; the fly layout is not reachable yet, no jetpack)
//   · tacho from the k2b speed, compass from the camera, island name + biome palette from the island
//   · the inventory list in the game state (synced from the bag overlay; never in the island recipe)
//   · the item previews' second WebGL context lives only while something renders (bag open / thumbnails)
// Own build (the only one): the mode plaque top centre in HUD R3 style: GEHEN · FAHREN · FLIEGEN (greyed) + SPIEL ↔ GOD switch.
import * as THREE from 'three';
// vendored templates, plain JS (typed loosely on purpose: the files stay byte-identical to the source)
import * as HUD_R3 from './vendor/kfb-hud.js';
import * as BAG_R3 from './vendor/kfb-backpack.js';
import * as DATA_R3 from './vendor/kfb-jukebox-data.js';
const { createHud, HudParts } = HUD_R3 as any;
const { createPropLibrary, createPropRenderer, mountBackpackMini, createBagOverlay } = BAG_R3 as any;
const { BIOMES, DEFAULT_BAG, BAG_SLOTS } = DATA_R3 as any;
import { createFigurePicker } from './figure-picker';

/** island palette (src/palettes.ts) → HUD R3 biome (kfb-jukebox-data BIOMES); unknown palettes keep the HUD R3 default theme */
const PAL_BIOME: Record<string, string> = { otown: 'burg', kfb_town: 'burg', protopia: 'protopia', utopia: 'utopia', dystopia: 'dystopia' };
const F_DISP = "'Bangers','Nunito Sans',system-ui,sans-serif";
const F_MONO = "'JetBrains Mono',ui-monospace,monospace";

export type HudMode = 'walk' | 'drive' | 'fly';
/** the game state (never in the island recipe): backpack inventory, fluff, God-Mode, collected almanac cards (7) */
export interface GameState { inventory: (string | null)[]; fluff: number; god: boolean; almanac: { deck: string; n: number; at: number }[] }

/** one prop renderer, created on demand and released 1.5 s after its last render while the bag is closed */
function lazyPropView() {
  let real: any = null, last = 0;
  return {
    render(obj: any, target: HTMLCanvasElement, o?: any) { if (!real) real = createPropRenderer({ THREE }); last = performance.now(); real.render(obj, target, o); },
    release(force = false) { if (real && (force || performance.now() - last > 1500)) { real.renderer.dispose(); real.renderer.forceContextLoss(); real = null; } },
    get alive() { return !!real; },
  };
}

export function createGameHud(o: { host: HTMLElement; island: string; palette: string; biome?: string; onGod: (on: boolean) => void }) {
  const biome = BIOMES[o.biome ?? PAL_BIOME[o.palette]];   // the island theme's biome wins (stage), else from the island palette
  // fonts vendored locally (offline runtime): public/fonts/hud/hud-fonts.css instead of HUD R3's Google Fonts link
  if (!document.querySelector('link[data-kfb-hud-local-fonts]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '/fonts/hud/hud-fonts.css'; l.dataset.kfbHudLocalFonts = '1'; document.head.appendChild(l); }
  const hud = createHud({ mode: 'walk', palette: biome?.hud, host: o.host, island: o.island, fonts: false });
  const P = hud.palette;
  const lib = createPropLibrary({ THREE }), view = lazyPropView();
  mountBackpackMini({ hud, lib, view, still: true });   // still: one render, no per-frame second context
  const bag = createBagOverlay({ host: o.host, palette: P, lib, view, items: DEFAULT_BAG });
  const state: GameState = { inventory: bag.items, fluff: 0, god: false, almanac: [] };
  const sync = () => { state.inventory = bag.items; hud.backpack.setCount(bag.count, BAG_SLOTS); };
  sync();
  hud.backpack.onOpen(() => bag.toggle());
  bag.on('open', () => hud.backpack.setOpen(true));
  bag.on('close', () => hud.backpack.setOpen(false));
  bag.on('change', sync);

  // ---- mode plaque (own build, HUD R3 parts: plaqueCss / wellCss / palette) ----
  const el = (tag: string, css: string, kids: (Node | string)[] = []) => { const e = document.createElement(tag); e.style.cssText = css; e.append(...kids); return e; };
  const chipCss = 'font:400 15px/1 ' + F_DISP + ';letter-spacing:.05em;padding:6px 9px 4px;border-radius:9px 11px 8px 10px / 10px 8px 11px 9px;transition:background .2s,color .2s';
  const chips: Record<HudMode | 'god' | 'game', HTMLElement> = {
    walk: el('div', chipCss, ['GEHEN']), drive: el('div', chipCss, ['FAHREN']), fly: el('div', chipCss + ';opacity:.38', ['FLIEGEN']),
    game: el('div', chipCss, ['SPIEL']), god: el('div', chipCss, ['GOD-MODE']),
  };
  chips.fly.title = 'Fliegen kommt mit dem Jetpack';
  const modes = el('div', HudParts.wellCss(P, '12px 14px 11px 13px / 13px 11px 14px 12px', 'display:flex;gap:3px;padding:3px'), [chips.walk, chips.drive, chips.fly]);
  const sw = el('button', HudParts.wellCss(P, '13px 11px 14px 12px / 12px 14px 11px 13px', 'display:flex;gap:3px;padding:3px;border:0;cursor:pointer;pointer-events:auto'), [chips.game, chips.god]);
  sw.title = 'Spiel ↔ God-Mode (G)'; sw.setAttribute('aria-label', 'Spiel oder God-Mode');
  const lab = el('div', `font:700 7px/1 ${F_MONO};letter-spacing:.16em;color:${P.socket};writing-mode:vertical-rl;transform:rotate(180deg)`, ['MODUS']);
  // B2 figure picker (C): a third well in the plaque, in Spiel and God-Mode
  const figChip = el('div', chipCss, ['FIGUR']);
  const figBtn = el('button', HudParts.wellCss(P, '12px 13px 11px 14px / 13px 12px 14px 11px', 'display:flex;padding:3px;border:0;cursor:pointer;pointer-events:auto'), [figChip]);
  figBtn.title = 'Figur wählen (C)'; figBtn.setAttribute('aria-label', 'Figur wählen');
  const plaque = el('div', HudParts.plaqueCss(P, '17px 19px 16px 18px / 18px 16px 19px 17px', 'display:flex;align-items:center;gap:8px;padding:6px 8px;transform:rotate(-.6deg)'), [lab, modes, sw, figBtn]);
  const holder = el('div', 'position:absolute;left:50%;top:14px;transform:translateX(-50%);transform-origin:50% 0;pointer-events:none;z-index:3', [plaque]);
  // God-Mode time of day (8+9): a second row in the same plaque style, only in God-Mode
  const timeChips: Record<string, HTMLElement> = { day: el('div', chipCss, ['TAG']), evening: el('div', chipCss, ['ABEND']), night: el('div', chipCss, ['NACHT']), auto: el('div', chipCss, ['AUTO']) };
  const timeRow = el('div', HudParts.wellCss(P, '12px 14px 11px 13px / 13px 11px 14px 12px', 'display:none;gap:3px;padding:3px;margin:6px auto 0;width:max-content;pointer-events:auto'), Object.values(timeChips));
  let timePick: ((t: any) => void) | null = null, timeOn = 'day';
  const paintTime = () => { for (const [k, c] of Object.entries(timeChips)) { const on = k === timeOn; c.style.background = on ? `linear-gradient(180deg,${P.accentHi},${P.accent} 60%,${P.accentLo})` : 'transparent'; c.style.color = on ? P.accentInk : P.cream; c.style.cursor = 'pointer'; } };
  for (const [k, c] of Object.entries(timeChips)) c.addEventListener('click', () => { timeOn = k; paintTime(); timePick?.(k); });
  holder.append(timeRow);
  // A10 (V-092) God-Mode weather: a third row in the same plaque style (KLAR · REGEN)
  const wxChips: Record<string, HTMLElement> = { clear: el('div', chipCss, ['KLAR']), rain: el('div', chipCss, ['REGEN']) };
  const wxRow = el('div', HudParts.wellCss(P, '12px 14px 11px 13px / 13px 11px 14px 12px', 'display:none;gap:3px;padding:3px;margin:6px auto 0;width:max-content;pointer-events:auto'), Object.values(wxChips));
  let wxPick: ((w: 'clear' | 'rain') => void) | null = null, wxOn = 'clear';
  const paintWx = () => { for (const [k, c] of Object.entries(wxChips)) { const on = k === wxOn; c.style.background = on ? `linear-gradient(180deg,${P.accentHi},${P.accent} 60%,${P.accentLo})` : 'transparent'; c.style.color = on ? P.accentInk : P.cream; c.style.cursor = 'pointer'; } };
  for (const [k, c] of Object.entries(wxChips)) c.addEventListener('click', () => { wxOn = k; paintWx(); wxPick?.(k as 'clear' | 'rain'); });
  holder.append(wxRow);
  // God-Mode default camera (V-025): RollerCoaster v11 „Pet-Position“ slider 1:1 — range 0…1 step 0.01, 0 = POV (label), else %, localStorage
  const camIn = document.createElement('input'); camIn.type = 'range'; camIn.min = '0'; camIn.max = '1'; camIn.step = '0.01';
  camIn.style.cssText = `flex:1;min-width:120px;accent-color:${P.accent};height:5px;cursor:pointer`;
  const camVal = el('div', `min-width:48px;text-align:right;font:400 15px/1 ${F_DISP};letter-spacing:.04em;color:${P.ink}`);
  const camRow = el('div', HudParts.wellCss(P, '12px 14px 11px 13px / 13px 11px 14px 12px', 'display:none;gap:8px;align-items:center;padding:5px 10px;margin:6px auto 0;width:300px;pointer-events:auto'), [el('div', `font:700 8px/1 ${F_MONO};letter-spacing:.16em;color:${P.cream}`, ['KAMERA']), camIn, camVal]);
  let camPick: ((v: number) => void) | null = null;
  const camLabel = () => { const v = parseFloat(camIn.value); camVal.textContent = v <= 0.01 ? 'POV' : Math.round(v * 100) + '%'; };
  camIn.addEventListener('input', () => { camLabel(); try { localStorage.setItem('kfb-cam-default', camIn.value); } catch { /* storage blocked */ } camPick?.(parseFloat(camIn.value)); });
  holder.append(camRow);
  // A10 Lichtkreis (WhackMan Fog of War slider, stepless): LICHTKREIS 0–100 %, effective × night weight (light.ts)
  const lkIn = document.createElement('input'); lkIn.type = 'range'; lkIn.min = '0'; lkIn.max = '1'; lkIn.step = '0.01';
  lkIn.style.cssText = `flex:1;min-width:120px;accent-color:${P.accent};height:5px;cursor:pointer`;
  const lkVal = el('div', `min-width:48px;text-align:right;font:400 15px/1 ${F_DISP};letter-spacing:.04em;color:${P.ink}`);
  const lkRow = el('div', HudParts.wellCss(P, '12px 14px 11px 13px / 13px 11px 14px 12px', 'display:none;gap:8px;align-items:center;padding:5px 10px;margin:6px auto 0;width:300px;pointer-events:auto'), [el('div', `font:700 8px/1 ${F_MONO};letter-spacing:.16em;color:${P.cream}`, ['LICHTKREIS']), lkIn, lkVal]);
  let lkPick: ((v: number) => void) | null = null;
  const lkLabel = () => { const v = parseFloat(lkIn.value); lkVal.textContent = v <= 0.01 ? 'AUS' : Math.round(v * 100) + '%'; };
  lkIn.addEventListener('input', () => { lkLabel(); lkPick?.(parseFloat(lkIn.value)); });
  holder.append(lkRow);
  o.host.append(holder);
  let mode: HudMode = 'walk';
  const paint = () => {
    for (const k of ['walk', 'drive', 'fly'] as const) { const on = !state.god && k === mode; chips[k].style.background = on ? `linear-gradient(180deg,${P.accentHi},${P.accent} 60%,${P.accentLo})` : 'transparent'; chips[k].style.color = on ? P.accentInk : P.cream; }
    for (const k of ['game', 'god'] as const) { const on = (k === 'god') === state.god; chips[k].style.background = on ? `linear-gradient(180deg,${P.accentHi},${P.accent} 60%,${P.accentLo})` : 'transparent'; chips[k].style.color = on ? P.accentInk : P.dim; }
  };
  const setGod = (on: boolean) => {
    if (state.god === on) return;
    state.god = on; if (on) bag.close();
    hud.el.style.display = on ? 'none' : '';
    timeRow.style.display = on && timePick ? 'flex' : 'none';
    wxRow.style.display = on && wxPick ? 'flex' : 'none';
    camRow.style.display = on && camPick ? 'flex' : 'none';
    lkRow.style.display = on && lkPick ? 'flex' : 'none';
    paint(); o.onGod(on);
  };
  sw.addEventListener('click', () => setGod(!state.god));
  let pickFig: ((id: string, v: number) => Promise<any> | void) | null = null;
  const figures = createFigurePicker({ host: o.host, palette: P, view, onPick: (id, v) => pickFig?.(id, v) });
  const paintFig = () => { figChip.style.background = figures.isOpen ? `linear-gradient(180deg,${P.accentHi},${P.accent} 60%,${P.accentLo})` : 'transparent'; figChip.style.color = figures.isOpen ? P.accentInk : P.cream; };
  figures.on('open', () => { bag.close(); paintFig(); }); figures.on('close', paintFig);
  figBtn.addEventListener('click', () => figures.toggle());
  addEventListener('keydown', (e) => {
    if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
    if (e.code === 'KeyG') setGod(!state.god);
    if (e.code === 'KeyB' && !state.god) { figures.close(); bag.toggle(); }
    if (e.code === 'Escape' && bag.isOpen) bag.close();
    if (e.code === 'KeyC') figures.toggle();
    if (e.code === 'Escape' && figures.isOpen) figures.close();
  });
  paint();

  let fitW = -1;
  return {
    hud, bag, state, figures,
    get blocking() { return state.god || bag.isOpen || figures.isOpen; },
    /** B2: picking a figure in the picker → the travel core (setFigure) */
    figureControl(pick: (id: string, v: number) => Promise<any> | void, current: string) { pickFig = pick; figures.setCurrent(current); },   // game keys pause while the bag is open or in God-Mode
    setGod,
    /** God-Mode default-camera slider → the play camera; returns the stored value (applied at game start) */
    camControl(pick: (v: number) => void, def = 0.36) { camPick = pick; let v = def; try { const st = localStorage.getItem('kfb-cam-default'); if (st != null) v = parseFloat(st); } catch { /* storage blocked */ } camIn.value = String(v); camLabel(); pick(v); return v; },
    /** God-Mode time chips (TAG · ABEND · NACHT · AUTO) → the sky owner */
    timeControl(pick: (t: 'day' | 'evening' | 'night' | 'auto') => void, active = 'day') { timePick = pick; timeOn = active; paintTime(); },
    /** A10 God-Mode Lichtkreis slider (0…1, default 0.6) → light.ts setCircle */
    circleControl(pick: (v: number) => void, def = 0.6) { lkPick = pick; lkIn.value = String(def); lkLabel(); pick(def); },
    /** A10 God-Mode weather chips (KLAR · REGEN) → the sky owner */
    weatherControl(pick: (w: 'clear' | 'rain') => void, active: 'clear' | 'rain' = 'clear') { wxPick = pick; wxOn = active; paintWx(); },
    update(dt: number, s: { mode: HudMode; speedKmh: number; heading: number }) {
      if (s.mode !== mode) { mode = s.mode; hud.setMode(mode); paint(); }
      hud.setSpeed(s.speedKmh); hud.setHeading(s.heading); hud.setFluff(state.fluff);
      bag.tick(dt); figures.tick(dt);
      if (!bag.isOpen && !figures.isOpen) view.release();
      // the plaque follows the HUD's own scale; narrow screens: below the top corner row
      const w = o.host.clientWidth;
      if (w !== fitW) { fitW = w; holder.style.transform = `translateX(-50%) scale(${hud.scale.toFixed(3)})`; holder.style.top = w < 760 ? '78px' : '14px'; }
    },
    /** probes: is the item-preview context alive right now */
    propContext: () => view.alive,
  };
}
export type GameHud = ReturnType<typeof createGameHud>;
