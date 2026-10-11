// Fraktaler Almanach (7) · Georgs Korrektur 11.10. (bestätigt): Fächer RECHTS, senkrecht GERADE nach unten, nur die letzten 7 + „+N“;
// Klick → Almanach-Overlay mit Reitern je Deck bzw. Welt und einem Raster der gesammelten Viertel; Klick auf ein Viertel → Viewer.
// Template first:
//   · fan: Overworld v13 card-rail-v9b.js makePile (logic ported: step 0.62 → 1.02 card heights on hover — the fan opens, cards
//     never grow; hover intent 220 / 200 ms). Lab changes (Georg): no arc / pivot, straight down; right edge; at most 7 + counter
//   · previews: Overworld v13 card-art-2d.js OW_ART.quarter (raw quarter page), vendored public/vendor/ow, pdf.js 4.7.76 local
//   · viewer: Deck Viewer v4 kfb-corpus.js (data layer, vendored public/vendor/deckviewer) + a Reader overlay in HUD R3 style
//     (the v4 Reader UI lives in its React board and cannot be lifted)
// Collected cards = a plain list in the GAME state (state.almanac), never in the island recipe. Renders run one at a time (parallel
// pdf.js renders of one document stalled). The grid draws lazily (IntersectionObserver): thousands of cards stay cheap.
// @ts-ignore – vendored template, plain JS
import * as HUD_R3 from './vendor/kfb-hud.js';
const { HudParts } = HUD_R3 as any;

export interface AlmanacCard { deck: string; n: number; at: number }
const VIS = 7, HOVER_IN = 220, HOVER_OUT = 200, STEP_CLOSED = 0.62, STEP_OPEN = 1.02;
const W = 120;   // card width (px) in the fan (the deck quarters are landscape, AR ≈ 1.8)

const loadScript = (src: string) => new Promise<void>((res, rej) => { if (document.querySelector(`script[src="${src}"]`)) return res(); const s = document.createElement('script'); s.src = src; s.onload = () => res(); s.onerror = () => rej(new Error('script ' + src)); document.head.appendChild(s); });

export async function createAlmanac(o: { host: HTMLElement; palette: any; list: AlmanacCard[]; top?: number }) {
  const w = window as any;
  w.OW_SRC = w.OW_SRC ?? { kfb: (p: string) => '/decks/' + (p || ''), ow: (p: string) => '/vendor/ow/' + (p || '') };
  await loadScript('/vendor/ow/card-art-2d.js');
  await loadScript('/vendor/deckviewer/kfb-corpus.js');
  const ART = w.OW_ART, CORPUS = w.KFBCorpus, P = o.palette;
  const reg = await CORPUS.registry();
  const deckTitle = (id: string) => reg.decks.find((d: any) => d.packId === id)?.title ?? id.replace(/_/g, ' ');
  const names = new Map<string, Map<number, string>>();
  const nameOf = async (deck: string, n: number) => { if (!names.has(deck)) { const c = await CORPUS.cards(deck); names.set(deck, new Map(c.cards.map((x: any) => [x.n, x.name]))); } return names.get(deck)!.get(n) ?? 'Karte ' + n; };
  const el = (tag: string, css: string, kids: (Node | string)[] = []) => { const e = document.createElement(tag); e.style.cssText = css; e.append(...kids); return e; };
  const btn = (txt: string, f: () => void, css = '') => { const b = el('button', `border:0;cursor:pointer;border-radius:12px 14px 11px 13px;padding:7px 12px;font:400 17px/1 'Bangers',sans-serif;letter-spacing:.04em;color:${P.accentInk};background:linear-gradient(180deg,${P.accentHi},${P.accent} 60%,${P.accentLo});box-shadow:0 3px 0 ${P.accentSocket};${css}`, [txt]); b.addEventListener('click', (e) => { e.stopPropagation(); f(); }); return b; };
  // one render at a time (as the template's art() queue)
  let chain: Promise<unknown> = Promise.resolve(), AR = 0.72;
  const drawQuarter = (c: AlmanacCard, cv: HTMLCanvasElement, wpx: number, done?: () => void) => {
    chain = chain.then(() => ART.quarter({ packId: c.deck, n: c.n }, 700)).then((q: any) => {
      if (!q) return; AR = q.ar;
      const dpr = Math.min(2, devicePixelRatio || 1); cv.width = Math.round(wpx * dpr); cv.height = Math.round((wpx / q.ar) * dpr);
      cv.getContext('2d')!.drawImage(q.canvas, 0, 0, cv.width, cv.height); done?.();
    }).catch(() => null);
  };
  const sorted = () => [...list].sort((a, b) => b.at - a.at);

  // ---------------- fan (right edge, straight down, last 7 + „+N“) ----------------
  const host = el('div', `position:absolute;right:16px;top:${o.top ?? 84}px;pointer-events:auto;z-index:3;display:flex;flex-direction:column;align-items:flex-end`);
  const count = el('span', `font:400 15px/1 'Bangers',sans-serif;letter-spacing:.04em;color:${P.ink}`, ['0']);
  const label = el('button', HudParts.wellCss(P, '9px 11px 8px 10px / 10px 8px 11px 9px', `display:inline-flex;gap:6px;align-items:center;padding:3px 8px;margin-bottom:6px;border:0;cursor:pointer;font:700 9px/1 'JetBrains Mono',monospace;letter-spacing:.16em;color:${P.cream}`), ['ALMANACH', count]);
  const pile = el('div', 'position:relative');
  const more = el('button', HudParts.plaqueCss(P, '10px 12px 9px 11px / 11px 9px 12px 10px', `display:none;margin-top:6px;border:0;cursor:pointer;padding:4px 10px;font:400 16px/1 'Bangers',sans-serif;letter-spacing:.04em;color:${P.ink}`));
  host.append(label, pile, more); o.host.append(host);
  let hot = false, intent = 0;
  const cards: { el: HTMLElement; cv: HTMLCanvasElement; c: AlmanacCard; ok?: boolean }[] = [];
  function lay() {
    const n = cards.length, cw = W, ch = cw / AR, step = ch * (hot ? STEP_OPEN : STEP_CLOSED);
    pile.style.width = cw + 'px'; pile.style.height = (n ? (n - 1) * step + ch : 0) + 'px';
    cards.forEach((c, i) => { const s = c.el.style; s.width = cw + 'px'; s.height = ch + 'px'; s.left = '0px'; s.top = i * step + 'px'; s.zIndex = String(100 - i);
      s.transition = 'top .38s cubic-bezier(.45,0,.25,1), opacity .25s ease'; });
  }
  pile.addEventListener('mouseenter', () => { clearTimeout(intent); intent = window.setTimeout(() => { hot = true; lay(); }, HOVER_IN); });
  pile.addEventListener('mouseleave', () => { clearTimeout(intent); intent = window.setTimeout(() => { hot = false; lay(); }, HOVER_OUT); });
  function setFan(l: AlmanacCard[]) {
    pile.innerHTML = ''; cards.length = 0;
    const s = [...l].sort((a, b) => b.at - a.at), shown = s.slice(0, VIS);
    shown.forEach((c) => {
      const cv = document.createElement('canvas'); cv.style.cssText = 'display:block;width:100%;height:100%;border-radius:7px';
      const e = el('div', `position:absolute;cursor:pointer;border-radius:7px;background:${P.wellBot};box-shadow:0 0 0 2px ${P.plaqueHi},0 3px 0 ${P.socket},0 8px 14px rgba(14,9,24,.32)`, [cv]);
      e.title = `Karte ${c.n} · ${deckTitle(c.deck)}`; e.dataset.almanacCard = String(c.n);
      e.addEventListener('click', () => openOverlay(c.deck));
      pile.append(e); const it: (typeof cards)[number] = { el: e, cv, c }; cards.push(it);
      drawQuarter(c, cv, W, () => { it.ok = true; lay(); });
    });
    count.textContent = String(l.length);
    more.textContent = '+' + (l.length - shown.length); more.style.display = l.length > VIS ? '' : 'none';
    lay();
  }
  label.addEventListener('click', () => openOverlay());
  more.addEventListener('click', () => openOverlay());

  // ---------------- almanac overlay: tabs per deck / world, grid of the collected quarters ----------------
  const veil = el('div', 'position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 55%,rgba(20,14,32,.25),rgba(20,14,32,.62));pointer-events:auto;z-index:9');
  const oTitle = el('div', `font:400 28px/1 'Bangers',sans-serif;letter-spacing:.03em;color:${P.ink};text-shadow:0 2px 0 rgba(40,25,70,.35)`, ['ALMANACH']);
  const tabs = el('div', 'display:flex;gap:6px;flex-wrap:wrap');
  const grid = el('div', 'display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;overflow:auto;max-height:62vh;padding:2px');
  const oCount = el('div', `font:700 10px/1 'JetBrains Mono',monospace;letter-spacing:.14em;color:${P.socket}`);
  const oPanel = el('div', HudParts.plaqueCss(P, '22px 26px 20px 24px / 24px 20px 26px 22px', 'padding:14px 16px 16px;width:min(92vw,980px);max-height:90vh;display:flex;flex-direction:column;gap:10px'),
    [el('div', 'display:flex;align-items:center;justify-content:space-between;gap:12px', [el('div', 'display:flex;flex-direction:column;gap:6px', [oTitle, oCount]), btn('✕', () => closeAll())]), tabs, el('div', HudParts.wellCss(P, '14px', 'padding:10px'), [grid])]);
  const viewPanel = el('div', 'display:none');
  veil.append(oPanel, viewPanel); o.host.append(veil);
  veil.addEventListener('pointerdown', (e) => { if (e.target === veil) closeAll(); });
  let mode: 'closed' | 'overlay' | 'viewer' = 'closed', tab = '', io: IntersectionObserver | null = null;
  function openOverlay(deck?: string) {
    const decks = [...new Set(list.map((c) => c.deck))];
    tab = deck && decks.includes(deck) ? deck : tab && decks.includes(tab) ? tab : decks[0] ?? '';
    mode = 'overlay'; veil.style.display = 'flex'; oPanel.style.display = 'flex'; viewPanel.style.display = 'none';
    tabs.innerHTML = '';
    for (const d of decks) { const on = d === tab, n = list.filter((c) => c.deck === d).length;
      const t = el('button', `border:0;cursor:pointer;padding:6px 11px 5px;border-radius:10px 12px 9px 11px;font:400 16px/1 'Bangers',sans-serif;letter-spacing:.04em;${on ? `color:${P.accentInk};background:linear-gradient(180deg,${P.accentHi},${P.accent} 60%,${P.accentLo});box-shadow:0 3px 0 ${P.accentSocket}` : `color:${P.cream};background:${P.wellBot}`}`, [`${deckTitle(d).toUpperCase()} · ${n}`]);
      t.addEventListener('click', () => openOverlay(d)); tabs.append(t); }
    renderGrid();
  }
  function renderGrid() {
    io?.disconnect(); grid.innerHTML = '';
    const items = sorted().filter((c) => c.deck === tab);
    oCount.textContent = `${items.length} GESAMMELTE VIERTEL · ${deckTitle(tab).toUpperCase()}`;
    io = new IntersectionObserver((ents) => { for (const e of ents) if (e.isIntersecting) { const t = e.target as HTMLElement; io!.unobserve(t); const c = (t as any)._card as AlmanacCard, cv = t.querySelector('canvas')!; drawQuarter(c, cv, 150, () => t.classList.add('ok')); } }, { root: grid, rootMargin: '200px' });
    for (const c of items) {
      const cv = document.createElement('canvas'); cv.style.cssText = 'display:block;width:100%;aspect-ratio:1.8;border-radius:6px;background:' + P.wellBot;
      const cap = el('div', `font:700 9px/1.2 'JetBrains Mono',monospace;letter-spacing:.08em;color:${P.cream};margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`, [`#${c.n}`]);
      nameOf(c.deck, c.n).then((nm) => { cap.textContent = `#${c.n} · ${nm}`; });
      const t = el('button', `border:0;cursor:pointer;padding:5px;border-radius:9px;background:transparent;text-align:left`, [cv, cap]);
      (t as any)._card = c; t.dataset.almanacQuarter = String(c.n);
      t.addEventListener('click', () => openViewer(c)); grid.append(t); io.observe(t);
    }
  }

  // ---------------- viewer (Reader over KFBCorpus) ----------------
  const pageCv = document.createElement('canvas'); pageCv.style.cssText = 'display:block;max-width:100%;max-height:100%;border-radius:8px';
  const mark = el('div', `position:absolute;border-radius:6px;box-shadow:0 0 0 3px ${P.accent},0 0 18px ${P.accent};pointer-events:none;transition:all .25s ease`);
  const stage = el('div', 'position:relative;display:inline-block;line-height:0', [pageCv, mark]);
  const title = el('div', `font:400 26px/1 'Bangers',sans-serif;letter-spacing:.03em;color:${P.ink};text-shadow:0 2px 0 rgba(40,25,70,.35)`);
  const sub = el('div', `font:700 10px/1 'JetBrains Mono',monospace;letter-spacing:.14em;color:${P.socket};margin-top:6px`);
  const head = el('div', 'display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:10px', [el('div', '', [title, sub]), el('div', 'display:flex;gap:6px', [btn('◂ ALMANACH', () => openOverlay(cur?.deck)), btn('‹', () => step(-1)), btn('›', () => step(1)), btn('✕', () => closeAll())])]);
  viewPanel.append(el('div', HudParts.plaqueCss(P, '22px 26px 20px 24px / 24px 20px 26px 22px', 'padding:14px 16px 16px;max-width:min(92vw,980px);max-height:92vh;display:flex;flex-direction:column'), [head, el('div', HudParts.wellCss(P, '14px', 'padding:10px;display:flex;justify-content:center;overflow:hidden'), [stage])]));
  addEventListener('keydown', (e) => { if (e.code === 'Escape' && mode !== 'closed') { if (mode === 'viewer') openOverlay(cur?.deck); else closeAll(); } if (mode === 'viewer' && e.code === 'ArrowRight') step(1); if (mode === 'viewer' && e.code === 'ArrowLeft') step(-1); });
  let cur: AlmanacCard | null = null, list: AlmanacCard[] = [];
  async function openViewer(c: AlmanacCard) {
    cur = c; mode = 'viewer'; veil.style.display = 'flex'; oPanel.style.display = 'none'; viewPanel.style.display = 'block';
    const deck = await CORPUS.cards(c.deck), card = deck.cards.find((x: any) => x.n === c.n);
    title.textContent = await nameOf(c.deck, c.n);
    sub.textContent = `KARTE ${c.n} / ${deck.cards.length} · SEITE ${card?.page ?? '?'} · ${deckTitle(c.deck).toUpperCase()}`;
    const pg = await CORPUS.renderPage(c.deck, card.page, 1400);
    const maxH = innerHeight * 0.72, k = Math.min(1, maxH / pg.height, (Math.min(innerWidth * 0.92, 980) - 52) / pg.width);
    pageCv.width = pg.width; pageCv.height = pg.height; pageCv.getContext('2d')!.drawImage(pg, 0, 0);
    pageCv.style.width = Math.round(pg.width * k) + 'px'; pageCv.style.height = Math.round(pg.height * k) + 'px';
    const qx = card.quadrant % 2, qy = card.quadrant >> 1, cw = pg.width * k / 2, ch = pg.height * k / 2;
    Object.assign(mark.style, { left: qx * cw + 4 + 'px', top: qy * ch + 4 + 'px', width: cw - 8 + 'px', height: ch - 8 + 'px' });
  }
  function step(d: number) { const s = sorted().filter((x) => x.deck === cur?.deck); if (!cur || !s.length) return; const i = s.findIndex((x) => x.n === cur!.n); openViewer(s[(i + d + s.length) % s.length]); }
  function closeAll() { mode = 'closed'; veil.style.display = 'none'; io?.disconnect(); }

  list = o.list; setFan(list);
  return {
    get open() { return mode !== 'closed'; },
    get mode() { return mode; },
    /** the game state list changed (a card collected) */
    refresh(l: AlmanacCard[]) { list = l; setFan(l); if (mode === 'overlay') openOverlay(tab); },
    openOverlay, openCard: (c: AlmanacCard) => openViewer(c), close: closeAll,
    probe: () => ({ fan: cards.length, total: list.length, more: Math.max(0, list.length - VIS), hot, mode, tab, ar: +AR.toFixed(3), drawn: cards.filter((c) => c.ok).length, gridDrawn: grid.querySelectorAll('.ok').length }),
  };
}
export type Almanac = Awaited<ReturnType<typeof createAlmanac>>;
