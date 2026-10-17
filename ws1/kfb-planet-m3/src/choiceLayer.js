// S5c · Spielerwahl „choice“ 2 × 2 (Host-Vertrag R1.2 §4, Host-Slot #ui-choice).
// Vorlage: ChatterBox Studio v2 (Cut r2, 05.10.) – Vertrag HANDOVER_WSA_CHATTERBOX_TRIPLET §3 „Zurufe (Player)“:
//   bubbleKind 'choice', 2 Spalten × 2, Reihenfolge und Tasten fix: 1 KayfaBINGO! · 2 KayfaBOGGLE? · 3 KayfaBONGO! · 4 BLÖDSINN!,
//   Labels exakt, Ziele ≥ 44 px, nach Auswahl Stempel 420 ms → Choice tritt ab → Antwort.
// Übernommen aus Studio v2: choiceGeo() (Zweig cols = 2, inkl. Mobil-Zweig W < 560), place() vollständig, die Antwortzeile im
// Rim-Modus „clayonly“ (Clay pur) samt Wand-Schatten, Stempel (scale 1,03 + Tonfarbe, Rest Opacity 0,15 / +6 px), Hover-Anhebung −2 px,
// Fokus-Rahmen 3 px #e2b33c.
// Bewusste Abweichungen vom Studio (Studio ist älter als V-204/V-214; die Optik der Auswahl ist NICHT abgenommen):
//   (1) Blasenkörper über bubbleBodySvg() (derselbe Körper wie jede Sprechblase, V-212) statt bubbleR() mit Rim-Wänden,
//   (2) Tastenkreis ohne Tusche-Rand (Studio: border 2px #1f1a14),
//   (3) Stempel und Hover ohne harten dunklen Schatten (Studio: box-shadow 3px 4px 0 / 3px 5px 0 #1f1a14),
//   (4) Gesichter-Ausweichen (Studio this._faces) entfällt, solange es keine KFB-Figuren mit Eye-Rig gibt (F1); andere Blasen
//       werden nicht ausgewichen (placed = []),
//   (5) Zeile für eigene Wörter (bis 8, Host-Vertrag §4) unter dem Raster – im Studio nicht vorhanden.
import './vendor/chatterbox-core.js'
import { bubbleBodySvg } from './bubbleLayer'

export const ZURUFE = [
  { id: 'bingo', key: '1', label: 'KayfaBINGO!', color: '#e2b33c' },
  { id: 'boggle', key: '2', label: 'KayfaBOGGLE?', color: '#59c3e6' },
  { id: 'bongo', key: '3', label: 'KayfaBONGO!', color: '#7fc46a' },
  { id: 'bloedsinn', key: '4', label: 'BLÖDSINN!', color: '#e5563d' },
]
export const STAMP_MS = 420
export const MAX_OWN_WORDS = 8
const INK = '#1f1a14'
const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v * (1 - t) + B[i] * t).toString(16).padStart(2, '0')).join('') }
export const countWords = (s) => s.trim().split(/\s+/).filter(Boolean).length
const WALL = (() => { const Wl = '#b8956a'; return '1px 1.3px 0 ' + Wl + ', 2px 2.6px 0 ' + Wl + ', 3px 4px 0 ' + Wl + ', 3.75px 5px 0 #8a6a45, 6px 8px 8px rgba(50,30,12,.26)' })()
const CLAYONLY_SHADOW = 'inset 1.5px 2px 0 rgba(255,255,255,.8), inset -2px -3px 6px rgba(90,55,25,.2), ' + WALL

// Studio place(), unverändert bis auf faces = [] (Abweichung 4)
export function place(w, h, hx, hy, W, H, placed, pad, gap) {
  const cx = (x) => Math.max(pad, Math.min(W - pad - w, x)), cy = (y) => Math.max(pad, Math.min(H - pad - h, y))
  const ov = (r) => placed.some((b) => r.x < b.x + b.w + 8 && r.x + w + 8 > b.x && r.y < b.y + b.h + 8 && r.y + h + 8 > b.y)
  const clear = (r) => { const ix = hx > r.x - 10 && hx < r.x + w + 10, iy = hy > r.y - 10 && hy < r.y + h + gap * 0.7; return !(ix && iy) }
  const C = [], up = hy - gap - h, side = gap + 4
  if (up >= pad) [0.5, 0.25, 0.75, 0.08, 0.92].forEach((f) => C.push({ x: cx(hx - w * f), y: up }))
  ;[cy(hy - h * 0.6), cy(hy - h / 2)].forEach((y) => { if (hx + side + w <= W - pad) C.push({ x: hx + side, y }); if (hx - side - w >= pad) C.push({ x: hx - side - w, y }) })
  placed.forEach((b) => { [cy(b.y + b.h + 12), cy(b.y - h - 12)].forEach((y) => { if (hx + side + w <= W - pad) C.push({ x: hx + side, y }); if (hx - side - w >= pad) C.push({ x: hx - side - w, y }) }) })
  placed.forEach((b) => { const y = b.y - h - 10; if (y >= pad && y <= up) C.push({ x: cx(hx - w / 2), y, far: true }) })
  const F = [], fh = (r) => F.some((f) => r.x < f.x + f.w && r.x + w > f.x && r.y < f.y + f.h && r.y + h > f.y)
  for (const r of C) if (clear(r) && !ov(r) && !fh(r)) return r
  for (const r of C) if (clear(r) && !ov(r)) return r
  for (const r of C) if (clear(r)) return Object.assign({ fb: true }, r)
  return { x: cx(hx - w / 2), y: cy(hy + gap), fb: true }
}

// host: Element #ui-choice. onChoice({ id, label } | { id: 'own', text }) wird nach dem Stempel gerufen.
export function createChoiceLayer({ host, onChoice }) {
  const C = window.KFB_CB
  let cur = null // { el, svg, picked, timer, input, g, M, at, hl }

  // Studio choiceGeo(), Zweig two = true; share 0,42 wie im Studio-Bühnen-Default; plus Zeile für eigene Wörter (Abweichung 5)
  function geo(W, H, base) {
    const fs = Math.max(13, Math.round(base * 0.95)), padO = 10, keyW = 26, gap = 8, pad = 12, share = 0.42, mobile = W < 560
    const maxW = mobile ? W - 2 * pad : Math.min(Math.max(W * Math.max(share, 0.42), 260), 440), textMax = maxW - 2 * padO - keyW - 34
    const rows = ZURUFE.map((o) => { const ls = C.wrapBalanced(o.label.replace(/\s+/g, ' '), 40, textMax, (x) => C.measure(x, fs, 'body')); return { ls, tw: Math.max(...ls.map((l) => C.measure(l, fs, 'body'))), h: Math.max(44, Math.round(ls.length * fs * 1.22 + 16)) } })
    const cw = Math.max(...rows.map((r) => r.tw)) + keyW + 40, rh = Math.max(...rows.map((r) => r.h))
    const w = Math.round(mobile ? W - 2 * pad : Math.min(W - 2 * pad, 2 * cw + gap + 2 * padO)), ownH = 44
    const h = 2 * rh + gap + 2 * padO + ownH + gap
    return { fs, padO, keyW, gap, rows, rh, w, h, ownH, pad, mobile }
  }
  // Studio choiceGeo(): Lage über place(), bei Kollision unten andocken neben dem Player
  function locate(g, hx, hy, W, H) {
    if (g.mobile) return { bx: g.pad, by: H - g.h - g.pad }
    const r = place(g.w, g.h, hx, hy, W, H, [], g.pad, 22)
    return { bx: r.x, by: r.y }
  }
  function body(g, M, bx, by, hx, hy) {
    const hlx = hx - (bx - M), hly = Math.min(hy, by + g.h + 60) - (by - M)
    return { svg: bubbleBodySvg(M, g.w, g.h, hlx, hly, '#c9a46a', 'speech', C.hash('choice') % 9999), hl: [hlx, hly] }
  }

  function close() { if (!cur) return; clearTimeout(cur.timer); cur.el.remove(); cur = null }

  function pick(i, ownText) {
    if (!cur || cur.picked != null) return
    cur.picked = i
    cur.el.querySelectorAll('[data-key]').forEach((b, j) => {
      b.style.pointerEvents = 'none'
      if (j === i) { b.style.background = mix('#fffaf0', ZURUFE[j].color, 0.4); b.style.transform = 'scale(1.03)' }
      else { b.style.opacity = '0.15'; b.style.transform = 'translateY(6px)' }
    })
    const res = i === -1 ? { id: 'own', text: ownText } : { id: ZURUFE[i].id, label: ZURUFE[i].label }
    cur.timer = setTimeout(() => { close(); onChoice?.(res) }, STAMP_MS)
  }

  function open({ anchorXY = null } = {}) {
    close()
    const W = innerWidth, H = innerHeight, base = Math.round(Math.max(15, Math.min(20, H / 42))), g = geo(W, H, base), M = 34
    const hx = anchorXY ? anchorXY[0] : W / 2, hy = anchorXY ? anchorXY[1] : H - 6
    const { bx, by } = locate(g, hx, hy, W, H), b = body(g, M, bx, by, hx, hy)
    const el = document.createElement('div')
    el.dataset.kind = 'choice'
    el.style.cssText = `position:fixed;left:0;top:0;transform:translate(${Math.round(bx - M)}px,${Math.round(by - M)}px);width:${g.w + 2 * M}px;height:${g.h + 2 * M}px;pointer-events:none;filter:drop-shadow(0 3px 5px rgba(42,26,12,.28));will-change:transform`
    const ow = (g.w - 2 * g.padO - g.gap) / 2
    const btn = (o, i) => {
      const lx = g.padO + (i % 2) * (ow + g.gap), yy = g.padO + Math.floor(i / 2) * (g.rh + g.gap)
      const st = `position:absolute;left:${lx}px;top:${yy}px;width:${ow}px;height:${g.rh}px;display:flex;align-items:center;gap:10px;padding:0 10px;background:#fffaf0;border:none;border-radius:10px;cursor:pointer;text-align:left;font-family:'Shantell Sans',cursive;font-size:${g.fs}px;line-height:1.22;color:${INK};box-shadow:${CLAYONLY_SHADOW};transition:transform .16s, opacity .2s, background .14s;pointer-events:auto`
      const lines = g.rows[i].ls.map((t) => `<span style="white-space:pre">${t}</span>`).join('')
      return `<button data-key="${o.key}" title="${o.id}" style="${st}"><span style="flex:none;width:26px;height:26px;border-radius:50%;background:${o.color};display:flex;align-items:center;justify-content:center;font-family:Bangers,'Shantell Sans',cursive;font-size:16px;line-height:1;color:${INK};box-shadow:inset 0 -2px 0 rgba(0,0,0,.18)">${o.key}</span><span data-label style="display:flex;flex-direction:column">${lines}</span></button>`
    }
    const oy = g.padO + 2 * g.rh + 2 * g.gap
    el.innerHTML = `<svg data-body width="${g.w + 2 * M}" height="${g.h + 2 * M}" style="position:absolute;left:0;top:0;overflow:visible">${b.svg}</svg>
      <div style="position:absolute;left:${M}px;top:${M}px;width:${g.w}px;height:${g.h}px">${ZURUFE.map(btn).join('')}
      <input data-own maxlength="80" placeholder="eigene Wörter (bis ${MAX_OWN_WORDS}) · Enter" style="position:absolute;left:${g.padO}px;top:${oy}px;width:${g.w - 2 * g.padO}px;height:${g.ownH}px;box-sizing:border-box;border:none;border-radius:10px;padding:0 12px;background:#fffaf0;font-family:'Shantell Sans',cursive;font-size:${Math.round(g.fs * 0.9)}px;color:${INK};box-shadow:inset 1.5px 2px 0 rgba(255,255,255,.8), inset -2px -3px 6px rgba(90,55,25,.2);pointer-events:auto;outline-color:#e2b33c"></div>`
    host.appendChild(el)
    el.querySelectorAll('[data-key]').forEach((bt, i) => {
      bt.addEventListener('click', () => pick(i))
      // Studio style-hover / style-focus, ohne harten dunklen Schatten (Abweichung 3)
      bt.addEventListener('pointerenter', () => { if (cur?.picked == null) { bt.style.transform = 'translateY(-2px)'; bt.style.background = '#fff3d6' } })
      bt.addEventListener('pointerleave', () => { if (cur?.picked == null) { bt.style.transform = ''; bt.style.background = '#fffaf0' } })
      bt.addEventListener('focus', () => { bt.style.outline = '3px solid #e2b33c'; bt.style.outlineOffset = '2px' })
      bt.addEventListener('blur', () => { bt.style.outline = '' })
    })
    const input = el.querySelector('[data-own]')
    input.addEventListener('input', () => { input.style.boxShadow = countWords(input.value) > MAX_OWN_WORDS ? 'inset 0 0 0 2px #e5563d' : 'inset 1.5px 2px 0 rgba(255,255,255,.8), inset -2px -3px 6px rgba(90,55,25,.2)' })
    cur = { el, picked: null, timer: 0, input, g, M, at: [bx, by], hl: b.hl }
  }

  // Lage folgt dem Player pro Frame: nur transform; Zipfel neu, wenn er sich um mehr als 6 px verschiebt (wie die Sprechblase)
  function follow(anchorXY) {
    if (!cur || !anchorXY || cur.picked != null) return
    const W = innerWidth, H = innerHeight, [hx, hy] = anchorXY, { bx, by } = locate(cur.g, hx, hy, W, H)
    if (Math.abs(bx - cur.at[0]) >= 0.5 || Math.abs(by - cur.at[1]) >= 0.5) { cur.at = [bx, by]; cur.el.style.transform = `translate(${Math.round(bx - cur.M)}px,${Math.round(by - cur.M)}px)` }
    const nb = body(cur.g, cur.M, bx, by, hx, hy)
    if (Math.abs(nb.hl[0] - cur.hl[0]) > 6 || Math.abs(nb.hl[1] - cur.hl[1]) > 6) { cur.hl = nb.hl; cur.el.querySelector('[data-body]').innerHTML = nb.svg }
  }

  // Tastatur kommt über den Host-Router (PRIO.playerChoice): Ziffern 1–4; Enter im Feld schickt die eigenen Wörter
  function key(e) {
    if (!cur || cur.picked != null) return false
    if (e.target === cur.input) {
      if (e.key === 'Enter') { e.preventDefault(); const t = cur.input.value.trim(); const n = countWords(t); if (n >= 1 && n <= MAX_OWN_WORDS) pick(-1, t); return true }
      return false
    }
    const i = ZURUFE.findIndex((o) => o.key === e.key)
    if (i >= 0) { e.preventDefault(); pick(i); return true }
    return false
  }

  return { open, close, follow, key, isOpen: () => !!cur, tail: () => (cur ? { at: cur.at, hl: cur.hl, M: cur.M } : null), dispose: close }
}
