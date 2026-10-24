// HUD 3D Paket 5/6 · Overlays L3 in einer Hülle (Board h3d-hud l3Shell): fraktaler Almanach (Decks → Karten → Detail), Truhe 20 und Einstellungen (Board 08).
// Reines DOM, keine Fenster-Listener, keine React-/Store-Imports: Tasten (Esc = eine Ebene zurück) und Größe kommen vom Wirt (HudClay).
// Inhalte gehören den Ownern: Almanach-Daten und Kartenbilder (Original, nie umgefärbt) über provider.almanac, Inventar über provider.chest.
// Übergang fraktal (Georg 25.10. Variante A): das Angeklickte wächst zur nächsten Ebene, zurück schrumpft es an seinen Platz.

const INK = '#130e16', TXT = '#2a2024', CREAM = '#f4ecdc', BTN = '#2b2236', WELL = '#e7dcc6', HI = '#fff6e0'
const CARD_AR = 1.79
// Sichere Ränder [oben, rechts, unten, links] und Innenabstand in Board-Einheiten (h3d-hud FORMS / l3Shell)
const FORMS = { desk: { ins: [24, 24, 24, 24], pad: 18, title: 24 }, phoneL: { ins: [10, 50, 20, 50], pad: 12, title: 20 } }
const EASE_POP = 'cubic-bezier(.2,.9,.25,1.12)' // leichter Überschwinger (Cartoon), nie mehr als 12 %

export function createL3({ root, inkText, reduced = () => false, onState = null }) {
  const back0 = el('div', 'kfb-l3'); back0.style.cssText = 'position:absolute;inset:0;display:none;pointer-events:auto;background:rgba(24,14,28,.42);z-index:40'
  const panel = el('div', 'kfb-l3-panel'); panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true')
  back0.append(panel); root.append(back0)
  back0.addEventListener('click', (e) => { if (e.target === back0) close() })
  panel.addEventListener('click', (e) => e.stopPropagation())
  const V = { W: 1920, H: 1080, k: 1, s: 2, form: 'desk' }
  const S = { kind: null, level: 0, deck: null, num: null, sel: 0, tab: null, from: null, provider: null, crumbs: [] }
  const anim = (node, frames, opt) => (reduced() || !node.animate ? null : node.animate(frames, opt))
  const px = (v) => `${Math.round(v * V.s * 100) / 100}px`

  // ── Größe: Desktop = Board × 2 × k (1080p-Bezug), Telefon quer = Board-Werte in Telefon-px ──────────────────────────────────────────────
  function layout({ W, H, k }) {
    V.W = W; V.H = H; V.k = k; V.form = H <= 480 && W / H > 1.6 ? 'phoneL' : 'desk'; V.s = V.form === 'phoneL' ? Math.min(W / 844, H / 390) : 2 * k
    const F = FORMS[V.form], [t, r, b, l] = F.ins.map((x) => x * V.s)
    panel.style.cssText = `position:absolute;left:${l}px;top:${t}px;right:${r}px;bottom:${b}px;box-sizing:border-box;display:flex;flex-direction:column;gap:${px(12)};padding:${px(F.pad)};`
      + `background:${CREAM};border:${px(2)} solid ${INK};border-radius:${px(18)};color:${TXT};font-family:Fredoka,system-ui,sans-serif;overflow:hidden;`
      + `box-shadow:${px(2)} ${px(3)} 0 ${INK},0 ${px(12)} ${px(26)} rgba(20,12,24,.28),inset 0 -${px(4)} 0 rgba(80,60,40,.08),inset 0 ${px(3)} 0 rgba(255,255,255,.6)`
    if (S.kind) render(false)
  }
  const inner = () => { const F = FORMS[V.form], [t, r, b, l] = F.ins.map((x) => x * V.s), p = F.pad * V.s; return { w: V.W - l - r - 2 * p, h: V.H - t - b - 2 * p } }

  // ── Bausteine im Board-Stil ──────────────────────────────────────────────────────────────────────────────────────────────────────────
  function el(tag, id = null, css = '') { const n = document.createElement(tag); if (id) n.id = id; if (css) n.style.cssText = css; return n }
  const well = (r) => `background:${WELL};border-radius:${r}px;box-shadow:inset 0 ${px(2)} 0 rgba(80,60,40,.16),inset 0 -${px(1)} 0 rgba(255,255,255,.55)`
  function button(label, onClick, { dark = false, round = false, size = null, aria = null, data = null } = {}) {
    const b = el('button'); b.type = 'button'; b.textContent = label; if (aria) b.setAttribute('aria-label', aria); if (data) b.dataset.l3 = data
    b.style.cssText = round
      ? `width:${size}px;height:${size}px;flex:none;border-radius:50%;border:0;cursor:pointer;background:${HI};color:${INK};font:400 ${size * 0.53}px/1 Bangers,Fredoka,sans-serif;box-shadow:0 0 0 ${px(2)} ${INK},${px(2)} ${px(3)} 0 ${INK};display:flex;align-items:center;justify-content:center;padding:0`
      : `border:0;cursor:pointer;padding:${px(6)} ${px(12)};border-radius:${px(14)};font:600 ${px(12)}/1 Fredoka,sans-serif;` + (dark ? `background:${BTN};color:${HI}` : `${well(14 * V.s)};color:${TXT}`)
    b.addEventListener('click', (e) => { e.stopPropagation(); onClick() }); return b
  }
  function header(title, { side = null } = {}) {
    const F = FORMS[V.form], h = el('div', null, `display:flex;align-items:center;gap:${px(10)};flex:none`)
    if (S.level > 1 || (S.kind === 'almanac' && S.level > 0 && S.crumbs.length > 1)) h.append(button('‹', back, { round: true, size: 34 * V.s, aria: 'Zurück', data: 'back' }))
    if (side) h.append(side)
    const t = el('div', 'kfb-l3-title', inkText(Math.round(F.title * V.s), TXT).replace(/text-shadow:[^;]*/, 'text-shadow:none') + `;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis`)
    t.textContent = title; h.append(t)
    h.append(button('✕', close, { round: true, size: 34 * V.s, aria: 'Schließen', data: 'close' })); return h
  }
  function flip(node, from, { dur = 360, delay = 0, fade = false } = {}) { // FLIP: vom Ursprungs-Rechteck an den neuen Platz (fraktaler Zoom)
    if (!from) return
    const to = node.getBoundingClientRect(); if (!to.width || !to.height) return
    const dx = from.left - to.left, dy = from.top - to.top, sx = from.width / to.width, sy = from.height / to.height
    node.style.transformOrigin = '0 0'
    anim(node, [{ transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})`, opacity: fade ? 0 : 1 }, { transform: 'none', opacity: 1 }], { duration: dur, delay, easing: EASE_POP, fill: 'backwards' })
  }
  const SCROLL = () => 16 // Platz für einen Scrollbalken, damit die vierte Spalte nie angeschnitten wird
  const rectOf = (q) => panel.querySelector(q)?.getBoundingClientRect() || null

  // ── Almanach: Ebene 1 Decks (je Deck ein kleiner Fächer), Ebene 2 Karten eines Decks (Board 09), Ebene 3 Detail (‹ ›, Leiste) ────────────────
  const imgCache = new Map()
  function cardImg(deckId, num, res, css) {
    const im = el('img', null, css + `;display:block;background:${WELL};object-fit:cover`); im.alt = `Karte ${num}`; im.draggable = false
    const key = deckId + '#' + num + '@' + res, hit = imgCache.get(key)
    if (typeof hit === 'string') im.src = hit
    else { const p = hit || S.provider.img(deckId, num, res).then((u) => { imgCache.set(key, u || ''); return u }, () => ''); imgCache.set(key, p); p.then((u) => { if (u) im.src = u }) }
    return im
  }
  const cardShadow = () => `border-radius:${px(5)};box-shadow:0 0 0 ${px(1)} ${INK},${px(1)} ${px(2)} 0 ${px(1)} ${INK}`
  function almanac(anim0) {
    const D = S.provider.decks(), deck = D.find((d) => d.id === S.deck)
    if (S.level === 3 && deck) return almanacDetail(deck, anim0)
    if (S.level === 2 && deck) return almanacDeck(deck, anim0)
    S.level = 1; S.crumbs = ['ALMANAC']
    const w = inner().w - SCROLL(), cols = V.form === 'phoneL' ? 3 : 4, gap = 14 * V.s, tw = (w - 8 * V.s - (cols - 1) * gap) / cols
    const grid = el('div', 'kfb-l3-decks', `display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:${gap}px;overflow:auto;padding:${px(4)};align-content:start`)
    const total = D.reduce((n, d) => n + d.cards.length, 0)
    D.forEach((d, i) => {
      const t = el('button', null, `position:relative;border:0;cursor:pointer;padding:${px(10)};${well(12 * V.s)};display:flex;flex-direction:column;align-items:center;gap:${px(6)};color:${TXT}`)
      t.type = 'button'; t.dataset.deck = d.id; t.setAttribute('aria-label', `${d.title}, ${d.cards.length} von ${d.total} Karten`)
      const fw = tw * 0.62, fh = fw / CARD_AR, fanBox = el('div', null, `position:relative;width:${tw - 20 * V.s}px;height:${fh * 1.5}px`); fanBox.dataset.fan = d.id
      const show = d.cards.slice(-3), R = [-9, 0, 9]
      show.forEach((c, j) => { const r = show.length === 1 ? 0 : R[j + 3 - show.length]; const im = cardImg(d.id, c.num, 360, `position:absolute;left:50%;top:50%;width:${fw}px;height:${fh}px;${cardShadow()};transform:translate(-50%,-50%) translate(${r * 1.1 * V.s}px,${Math.abs(r) * 0.5 * V.s}px) rotate(${r}deg)`); fanBox.append(im) })
      const nm = el('div', null, inkText(Math.round(17 * V.s), TXT).replace(/text-shadow:[^;]*/, 'text-shadow:none') + ';white-space:normal;text-align:center'); nm.textContent = d.title.toUpperCase()
      const ct = el('div', null, `font:600 ${px(12)}/1 Fredoka,sans-serif;color:#5e5246`); ct.textContent = `${d.cards.length} / ${d.total} Karten`
      t.append(fanBox, nm, ct); t.addEventListener('click', (e) => { e.stopPropagation(); go({ level: 2, deck: d.id }, fanBox.getBoundingClientRect()) })
      grid.append(t)
      if (anim0) anim(t, [{ opacity: 0, transform: `translateY(${px(8)})` }, { opacity: 1, transform: 'none' }], { duration: 220, delay: 30 * i, easing: 'ease-out', fill: 'backwards' })
    })
    const pill = el('div', null, `align-self:flex-start;background:${HI};box-shadow:0 0 0 ${px(1.5)} ${INK};padding:${px(5)} ${px(10)};border-radius:${px(12)};font:600 ${px(12)}/1 Fredoka,sans-serif`)
    pill.textContent = `${D.length} ${D.length === 1 ? 'Deck' : 'Decks'} · ${total} ${total === 1 ? 'Karte' : 'Karten'}`
    return [header('ALMANAC'), pill, grid]
  }
  function almanacDeck(deck, anim0) {
    S.crumbs = ['ALMANAC', deck.title.toUpperCase()]
    const w = inner().w - SCROLL(), cols = 4, gap = 10 * V.s, cw = (w - 6 * V.s - (cols - 1) * gap) / cols, ch = cw / CARD_AR
    const pill = el('div', null, `align-self:flex-start;background:${HI};box-shadow:0 0 0 ${px(1.5)} ${INK};padding:${px(5)} ${px(10)};border-radius:${px(12)};font:600 ${px(12)}/1 Fredoka,sans-serif`)
    pill.textContent = `${deck.title} · ${deck.cards.length} / ${deck.total} Karten`
    const grid = el('div', 'kfb-l3-cards', `display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:${gap}px;overflow:auto;padding:${px(3)};align-content:start`)
    const cells = deck.cards.map((c) => { const b = el('button', null, 'border:0;padding:0;background:none;cursor:pointer;display:block'); b.type = 'button'; b.dataset.card = c.num; b.setAttribute('aria-label', `Karte ${c.num}: ${c.name}`)
      b.append(cardImg(deck.id, c.num, 560, `width:${cw}px;height:${ch}px;${cardShadow()}`)); b.addEventListener('click', (e) => { e.stopPropagation(); go({ level: 3, num: c.num }, b.getBoundingClientRect()) }); grid.append(b); return b })
    S._after = () => { if (!anim0) return; const from = S.from; cells.forEach((b, i) => { if (from) flip(b, from, { dur: 380, delay: 22 * i }); else anim(b, [{ opacity: 0 }, { opacity: 1 }], { duration: 160, delay: 20 * i, fill: 'backwards' }) }) }
    return [header(`ALMANAC › ${deck.title.toUpperCase()}`), pill, grid]
  }
  function almanacDetail(deck, anim0) {
    const i0 = Math.max(0, deck.cards.findIndex((c) => c.num === S.num)), c = deck.cards[i0]; S.num = c.num
    S.crumbs = ['ALMANAC', deck.title.toUpperCase(), (c.name || 'Nr. ' + c.num).toUpperCase()]
    const { w, h } = inner(), strip = (V.form === 'phoneL' ? 34 : 44) * V.s, nav = 40 * V.s, meta = 16 * V.s, head = 34 * V.s
    const bh = Math.max(60, h - head - strip - meta - 3 * 12 * V.s), bw = Math.min(w - 2 * nav - 24 * V.s, bh * CARD_AR), bh2 = bw / CARD_AR
    const stage = el('div', null, `flex:1;min-height:0;display:flex;align-items:center;justify-content:center;gap:${px(12)}`)
    const step = (d) => { const j = (i0 + d + deck.cards.length) % deck.cards.length; go({ level: 3, num: deck.cards[j].num }, null, true) }
    const prev = button('‹', () => step(-1), { round: true, size: nav, aria: 'Vorige Karte', data: 'prev' }), next = button('›', () => step(1), { round: true, size: nav, aria: 'Nächste Karte', data: 'next' })
    const big = cardImg(deck.id, c.num, 1200, `width:${bw}px;height:${bh2}px;border-radius:${px(8)};box-shadow:0 0 0 ${px(1.5)} ${INK},${px(2)} ${px(3)} 0 ${px(1)} ${INK}`); big.id = 'kfb-l3-big'
    if (deck.cards.length < 2) { prev.style.visibility = next.style.visibility = 'hidden' }
    stage.append(prev, big, next)
    const m = el('div', null, `flex:none;text-align:center;font:500 ${px(12)}/1.2 Fredoka,sans-serif;color:#5e5246`); m.textContent = `${deck.title} · Nr. ${c.num} · ${c.name}`
    const th = el('div', 'kfb-l3-strip', `flex:none;display:flex;gap:${px(6)};justify-content:safe center;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;height:${strip}px`)
    deck.cards.forEach((x, j) => { const b = el('button', null, `border:0;padding:0;background:none;cursor:pointer;opacity:${j === i0 ? 1 : 0.55}`); b.type = 'button'; b.setAttribute('aria-label', `Karte ${x.num}`)
      b.append(cardImg(deck.id, x.num, 360, `width:${strip * CARD_AR}px;height:${strip}px;${cardShadow()}`)); b.addEventListener('click', (e) => { e.stopPropagation(); if (j !== i0) go({ level: 3, num: x.num }, null, true) }); th.append(b) })
    S._after = () => { const a = th.children[i0]; if (a && th.scrollWidth > th.clientWidth) th.scrollLeft = a.offsetLeft - th.offsetLeft - (th.clientWidth - a.offsetWidth) / 2 /* aktive Karte mittig, wenn die Leiste länger ist */
      if (anim0 && S.from) flip(big, S.from, { dur: 400 }) }
    return [header(S.crumbs.join(' › ')), stage, m, th]
  }

  // ── Truhe 20 (Board 07): 5 × 4 Fächer, rechts das gewählte Ding mit Ausrüsten/Ablegen bzw. Wegwerfen; Titel „TRUHE · n / 20“ ─────────────────
  function chest() {
    const P = S.provider, list = P.list(), cap = P.cap ?? 20, { w, h } = inner(), cols = 5, rows = Math.ceil(cap / cols), gap = (V.form === 'phoneL' ? 6 : 10) * V.s
    const det = (V.form === 'phoneL' ? 170 : 250) * V.s, head = 34 * V.s + 12 * V.s
    const cs = Math.floor(Math.min((w - det - 16 * V.s - (cols - 1) * gap) / cols, (h - head - (rows - 1) * gap) / rows))
    S.sel = Math.max(0, Math.min(S.sel, list.length - 1))
    const body = el('div', null, `flex:1;min-height:0;display:flex;gap:${px(16)}`)
    const grid = el('div', 'kfb-l3-chest', `display:grid;grid-template-columns:repeat(${cols},${cs}px);grid-auto-rows:${cs}px;gap:${gap}px;align-content:start`)
    for (let i = 0; i < cap; i++) {
      const it = list[i], b = el('button', null, `position:relative;border:0;padding:0;cursor:${it ? 'pointer' : 'default'};${well(Math.round(cs * 0.2))};display:flex;align-items:center;justify-content:center` + (it && i === S.sel ? `;box-shadow:0 0 0 ${px(2)} ${INK}` : ''))
      b.type = 'button'; b.dataset.slot = i; b.disabled = !it; b.setAttribute('aria-label', it ? it.n : 'Leeres Fach')
      if (it) {
        const sz = Math.round(cs * 0.74)
        if (it.shot) { const im = el('img', null, `width:${sz}px;height:${sz}px;object-fit:contain;pointer-events:none`); im.src = it.shot; im.alt = ''; b.append(im) }
        else if (P.icon) { const ic = P.icon(it.icon || 'spark', Math.round(cs * 0.5)); ic.style.opacity = '.8'; b.append(ic) } /* Fundsache: R5f-Symbol ruhiger und kleiner, bis die Beute eigene 3D-Bilder liefert */
        if (it.x > 1) { const c = el('div', null, inkText(Math.round(cs * 0.22)) + ';position:absolute;right:8%;bottom:4%'); c.textContent = '×' + it.x; b.append(c) }
        if (it.active) { const m = el('div', null, `position:absolute;left:7%;top:7%;width:${cs * 0.22}px;height:${cs * 0.22}px;border-radius:50%;background:#4fb648;box-shadow:0 0 0 ${px(1.5)} ${INK};color:#fff;font:700 ${cs * 0.15}px/1 Fredoka,sans-serif;display:flex;align-items:center;justify-content:center`); m.textContent = '✓'; m.dataset.active = '1'; b.append(m) }
        b.addEventListener('click', (e) => { e.stopPropagation(); S.sel = i; render(false) })
      }
      grid.append(b)
    }
    const side = el('div', 'kfb-l3-detail', `min-width:${det}px;flex:1;${well(14 * V.s)};padding:${px(12)};box-sizing:border-box;display:flex;flex-direction:column;gap:${px(6)}`)
    const it = list[S.sel]
    if (it) {
      const t = el('div', null, inkText(Math.round(20 * V.s), TXT).replace(/text-shadow:[^;]*/, 'text-shadow:none') + ';white-space:normal'); t.textContent = it.n.toUpperCase()
      const k = el('div', null, `font:600 ${px(11)}/1.2 Fredoka,sans-serif;color:#8a7a66`); k.textContent = it.k || ''
      const n = el('div', null, `font:500 ${px(13)}/1.35 Fredoka,sans-serif;color:#54483c`); n.textContent = it.note || ''
      const row = el('div', null, `margin-top:auto;display:flex;gap:${px(8)};flex-wrap:wrap`)
      if (it.weapon) row.append(button(it.active ? 'Ablegen' : 'Ausrüsten', () => { P.equip(it.active ? null : it.wid); setTimeout(() => render(false), 0) }, { dark: true, data: 'equip' }))
      else row.append(button('Wegwerfen', () => { P.drop(S.sel - list.filter((x) => x.weapon).length); S.sel = Math.max(0, S.sel - 1); setTimeout(() => (P.list().length ? render(false) : close()), 0) }, { data: 'drop' }))
      side.append(t, k, n, row)
    } else { const e0 = el('div', null, `font:500 ${px(13)}/1.35 Fredoka,sans-serif;color:#8a7a66`); e0.textContent = 'Die Truhe ist leer. Fundsachen landen hier.'; side.append(e0) }
    body.append(grid, side)
    return [header(`TRUHE · ${list.length} / ${cap}`), body]
  }

  // ── Einstellungen (Paket 6, Board 08): Reiter + Zeilen im Board-Stil; jede Zeile ruft den bestehenden Owner (provider.tabs[].rows()) ─────────
  // Zeilen: { label, kind: 'seg' | 'toggle' | 'slider' | 'button' | 'html', name, get, set, items: [[id, Text, aus]], text, onClick, html, disabled, title }
  function seg(r) { const w = el('div', null, `display:flex;gap:${px(2)};padding:${px(3)};border-radius:${px(14)};background:${BTN};box-shadow:inset 0 0 0 ${px(1.5)} ${INK}`); const cur = r.get() /* Rahmen innen: rechte Kante fluchtet mit Schaltern und Knöpfen */
    for (const [id, t, dis] of r.items) { const b = el('button', null, `border:0;padding:${px(5)} ${px(10)};border-radius:${px(11)};font:400 ${px(13)}/1 Bangers,Fredoka,sans-serif;letter-spacing:.06em;cursor:${dis ? 'default' : 'pointer'};`
      + `color:${id === cur ? HI : dis ? '#6e6478' : '#bfb3c7'};background:${id === cur ? '#d97c3a' : 'transparent'}`); b.type = 'button'; b.textContent = t; b.dataset.mode = id; b.disabled = !!dis; if (dis) b.title = 'folgt'
      b.addEventListener('click', (e) => { e.stopPropagation(); if (!dis) { r.set(id); render(false) } }); w.append(b) } return w }
  function toggle(r) { const on = !!r.get(), b = el('button', null, `position:relative;width:${px(40)};height:${px(22)};flex:none;border:0;padding:0;border-radius:${px(12)};cursor:${r.disabled ? 'default' : 'pointer'};background:${on ? '#7a8d4a' : '#cbbfa9'};box-shadow:inset 0 ${px(1)} 0 rgba(0,0,0,.15);opacity:${r.disabled ? 0.5 : 1}`)
    b.type = 'button'; b.setAttribute('role', 'switch'); b.setAttribute('aria-checked', on ? 'true' : 'false'); b.setAttribute('aria-label', r.label); b.dataset.setting = r.name; b.disabled = !!r.disabled; if (r.title) b.title = r.title
    b.append(el('span', null, `position:absolute;top:${px(2)};left:${px(on ? 20 : 2)};width:${px(18)};height:${px(18)};border-radius:50%;background:${HI};box-shadow:0 0 0 ${px(1.5)} ${INK};transition:left .12s`))
    b.addEventListener('click', (e) => { e.stopPropagation(); if (!r.disabled) { r.set(!r.get()); render(false) } }); return b }
  function slider(r) { const i = el('input', null, `width:${px(180)};margin:0;accent-color:#d97c3a;cursor:pointer`); i.type = 'range'; i.min = 0; i.max = 1; i.step = 0.05; i.value = r.get() ?? 0.7; i.dataset.setting = r.name; i.setAttribute('aria-label', r.label)
    i.addEventListener('input', () => r.set(+i.value)); i.addEventListener('change', () => i.blur()); i.addEventListener('click', (e) => e.stopPropagation()); return i }
  function settings() {
    const tabs = S.provider.tabs(); if (!tabs.some((t) => t.id === S.tab)) S.tab = tabs[0]?.id ?? null
    const bar = el('div', 'kfb-l3-tabs', `display:flex;gap:${px(6)};flex-wrap:wrap;flex:none`)
    for (const t of tabs) { const b = el('button', null, `border:0;cursor:pointer;padding:${px(6)} ${px(12)};border-radius:${px(14)};font:600 ${px(12)}/1 Fredoka,sans-serif;` + (t.id === S.tab ? `background:${BTN};color:${HI}` : `${well(14 * V.s)};color:${TXT}`))
      b.type = 'button'; b.textContent = t.label; b.dataset.tab = t.id; b.setAttribute('aria-pressed', t.id === S.tab ? 'true' : 'false'); b.addEventListener('click', (e) => { e.stopPropagation(); S.tab = t.id; render(false) }); bar.append(b) }
    const list = el('div', 'kfb-l3-rows', `flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:${px(8)};padding:${px(2)}`)
    for (const r of tabs.find((t) => t.id === S.tab)?.rows() || []) {
      if (r.kind === 'html') { const h = el('div', null, `${well(10 * V.s)};padding:${px(10)} ${px(12)};font:500 ${px(V.form === 'phoneL' ? 12 : 13)}/1.45 Fredoka,sans-serif;color:${TXT}`); h.dataset.setting = r.name; h.innerHTML = r.html(); list.append(h); continue }
      const row = el('div', null, `display:flex;align-items:center;justify-content:space-between;gap:${px(12)};padding:${px(10)} ${px(12)};${well(10 * V.s)}`)
      const lab = el('span', null, `font:600 ${px(14)}/1.2 Fredoka,sans-serif`); lab.textContent = r.label
      const ctl = r.kind === 'seg' ? seg(r) : r.kind === 'toggle' ? toggle(r) : r.kind === 'slider' ? slider(r) : button(r.text, () => r.onClick(), { dark: true, data: r.name })
      row.append(lab, ctl); list.append(row) }
    S._after = () => { if (list.scrollHeight > list.clientHeight + 1) list.style.cssText += `;-webkit-mask-image:linear-gradient(to bottom,#000 calc(100% - ${px(28)}),transparent);mask-image:linear-gradient(to bottom,#000 calc(100% - ${px(28)}),transparent)` } // länger als die Tafel: weich ausblenden, scrollt
    return [header('EINSTELLUNGEN'), bar, list]
  }

  // ── Ablauf ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  function render(anim0) { S._after = null; const parts = S.kind === 'almanac' ? almanac(anim0) : S.kind === 'settings' ? settings() : chest(); panel.replaceChildren(...parts); S._after?.(); S.from = null; onState?.(state()) }
  function go(to, from = null, quiet = false) { Object.assign(S, to); S.from = from; render(!quiet); if (quiet) anim(panel.querySelector('#kfb-l3-big'), [{ opacity: 0.4 }, { opacity: 1 }], { duration: 140 }) }
  function open(kind, provider, { at = null, from = null } = {}) {
    S.kind = kind; S.provider = provider; S.level = kind === 'almanac' ? (at?.level || 1) : 0; S.deck = at?.deck ?? null; S.num = at?.num ?? null; S.sel = at?.sel ?? 0; S.tab = at?.tab ?? S.tab; S.from = null
    back0.style.display = 'block'; render(true)
    if (from) flip(panel, from, { dur: 300, fade: true }); else anim(back0, [{ opacity: 0 }, { opacity: 1 }], { duration: 140 })
  }
  function close() { if (!S.kind) return false; const k = S.kind; S.kind = null; S.level = 0; back0.style.display = 'none'; panel.replaceChildren(); onState?.(state(), k); return true }
  function back() { // Esc / ‹: eine Ebene zurück, auf Ebene 1 (bzw. in der Truhe) schließen
    if (!S.kind) return false
    if (S.kind === 'almanac' && S.level > 1) {
      const fromRect = rectOf(S.level === 3 ? '#kfb-l3-big' : '#kfb-l3-cards'), lv = S.level - 1, num = S.num, deck = S.deck
      S.level = lv; S.from = null; render(false)
      const target = lv === 2 ? panel.querySelector(`[data-card="${num}"]`) : panel.querySelector(`[data-fan="${deck}"]`)
      if (target && fromRect) flip(target, fromRect, { dur: 320 })
      return true }
    return close()
  }
  const state = () => ({ kind: S.kind, level: S.level, deck: S.deck, num: S.num, sel: S.sel, tab: S.tab, crumbs: S.crumbs.slice(), form: V.form })
  return { layout, open, close, back, isOpen: () => !!S.kind, kind: () => S.kind, state, refresh: () => S.kind && render(false), el: back0, panel }
}
